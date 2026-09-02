/**
 * IndexedDB key/value wrapper + the store's offloaded-key path.
 *
 * The learning-event log (up to 1,000 records) used to be re-serialised
 * into localStorage on every single answer, sharing the ~5 MB quota with
 * the child's actual progress. It now lives in IndexedDB.
 *
 * Two properties matter and are pinned here:
 *   1. the offloaded key never appears in the localStorage payload, and
 *   2. everything degrades quietly when IndexedDB is unavailable — this is
 *      telemetry, and no session should break over it.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
}

/** Flush the store's queueMicrotask-debounced save. */
const flushSave = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  stubAudioGlobals();
  localStorage.clear();
  vi.resetModules();
});

describe('idb wrapper without IndexedDB', () => {
  it('reports unavailability rather than throwing', async () => {
    const original = globalThis.indexedDB;
    // jsdom has no IndexedDB by default; be explicit so the test is honest
    // about what it is exercising.
    delete globalThis.indexedDB;

    const idb = await import('../modules/idb.js');
    idb.__resetForTests();
    expect(idb.isAvailable()).toBe(false);

    if (original !== undefined) globalThis.indexedDB = original;
  });

  it('resolves null/false instead of rejecting when unavailable', async () => {
    const original = globalThis.indexedDB;
    delete globalThis.indexedDB;

    const idb = await import('../modules/idb.js');
    idb.__resetForTests();

    await expect(idb.idbGet('missing')).resolves.toBeNull();
    await expect(idb.idbSet('k', [1, 2, 3])).resolves.toBe(false);
    await expect(idb.idbDelete('k')).resolves.toBe(false);

    if (original !== undefined) globalThis.indexedDB = original;
  });
});

describe('store offloading', () => {
  it('keeps learningEvents out of the localStorage payload', async () => {
    const { store } = await import('../modules/store.js');

    store.recordLearningEvent({ eventType: 'word_attempt', correct: true, responseMs: 400 });
    await flushSave();

    const raw = localStorage.getItem('phonicsquest_v2');
    expect(raw).toBeTruthy();
    const saved = JSON.parse(raw);
    // The whole point: this key no longer rides every save.
    expect(saved.learningEvents).toBeUndefined();
    // ...while other progress still persists normally.
    expect(saved).toHaveProperty('wordStats');
  });

  it('still exposes events synchronously in memory', async () => {
    const { store } = await import('../modules/store.js');

    store.recordLearningEvent({ eventType: 'word_attempt', correct: true });
    const events = store.get('learningEvents');

    expect(Array.isArray(events)).toBe(true);
    expect(events[0].eventType).toBe('word_attempt');
    expect(events[0].correct).toBe(true);
    expect(events[0].timestamp).toBeTruthy();
  });

  it('records newest-first and caps the log', async () => {
    const { store } = await import('../modules/store.js');

    for (let i = 0; i < 1005; i++) {
      store.recordLearningEvent({ eventType: 'e', meta: { i } });
    }

    const events = store.get('learningEvents');
    expect(events.length).toBe(1000);
    // Newest first — consumers rely on this ordering.
    expect(events[0].meta.i).toBe(1004);
    expect(events[999].meta.i).toBe(5);
  });

  it('normalises missing fields to nulls rather than undefined', async () => {
    const { store } = await import('../modules/store.js');
    store.recordLearningEvent({ eventType: 'bare' });

    const e = store.get('learningEvents')[0];
    expect(e.quest).toBeNull();
    expect(e.skill).toBeNull();
    expect(e.correct).toBeNull();
    expect(e.responseMs).toBeNull();
  });

  it('hydrate is a safe no-op when IndexedDB is unavailable', async () => {
    const { store } = await import('../modules/store.js');
    await expect(store.hydrateOffloadedKeys()).resolves.toBeUndefined();
  });
});

describe('default-state aliasing', () => {
  it("does not let one profile's events leak into the defaults", async () => {
    const { store } = await import('../modules/store.js');

    store.setStorageKey('phonicsquest_profile_a');
    store.recordLearningEvent({ eventType: 'a-only' });
    expect(store.get('learningEvents').length).toBe(1);

    // Switching profiles must start from a clean log, not the previous
    // child's — and must not have mutated the shared defaults.
    store.setStorageKey('phonicsquest_profile_b');
    expect(store.get('learningEvents').length).toBe(0);

    store.resetStorageKey();
  });

  it('reset does not carry mutations into the next fresh state', async () => {
    const { store } = await import('../modules/store.js');

    store.recordLearningEvent({ eventType: 'before-reset' });
    store.reset();
    expect(store.get('learningEvents')).toEqual([]);

    store.recordLearningEvent({ eventType: 'after-reset' });
    expect(store.get('learningEvents').length).toBe(1);
  });

  it('nested default objects are per-state copies, not shared references', async () => {
    const { store } = await import('../modules/store.js');

    const before = store.get('questMastery');
    before.sentenceForge.touched = true;

    store.reset();
    // A fresh state must not see the mutation made to the previous one.
    expect(store.get('questMastery').sentenceForge.touched).toBeUndefined();
  });
});
