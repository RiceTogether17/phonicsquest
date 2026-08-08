/**
 * Unit tests for the reactive state store (store.js).
 * Tests state management, persistence, validation, and circuit breaker.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage before importing store
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => {
      store[key] = String(val);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    _store: store,
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

// Mock import.meta.env
vi.stubGlobal('import', { meta: { env: { DEV: true } } });

// We need to re-import store fresh for each test to reset singleton state.
// Since store.js uses a singleton, we use dynamic imports with vi.resetModules().
describe('Store', () => {
  let store;

  beforeEach(async () => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    vi.resetModules();
    const mod = await import('../modules/store.js');
    store = mod.store;
  });

  describe('get / set', () => {
    it('returns default values for unset keys', () => {
      expect(store.get('xp')).toBe(0);
      expect(store.get('level')).toBe(1);
      expect(store.get('energy')).toBe(3);
      expect(store.get('theme')).toBe('default');
      expect(store.get('blendStyle')).toBe('simultaneous');
    });

    it('sets and gets a value', () => {
      store.set('xp', 42);
      expect(store.get('xp')).toBe(42);
    });

    it('persists to localStorage on set (after microtask)', async () => {
      localStorageMock.setItem.mockClear();
      store.set('xp', 100);
      // Persistence is debounced via queueMicrotask
      await new Promise((resolve) => queueMicrotask(resolve));
      expect(localStorageMock.setItem).toHaveBeenCalled();
      // A daily __backup write may follow the main write — assert on the
      // last write to the main key specifically.
      const mainWrites = localStorageMock.setItem.mock.calls.filter(
        ([k]) => k === 'phonicsquest_v2',
      );
      const saved = JSON.parse(mainWrites.at(-1)[1]);
      expect(saved.xp).toBe(100);
    });
  });

  describe('patch', () => {
    it('updates multiple keys at once', () => {
      store.patch({ xp: 50, level: 3, theme: 'ocean' });
      expect(store.get('xp')).toBe(50);
      expect(store.get('level')).toBe(3);
      expect(store.get('theme')).toBe('ocean');
    });
  });

  describe('subscribe', () => {
    it('notifies subscriber on key change', () => {
      const cb = vi.fn();
      store.subscribe('xp', cb);
      store.set('xp', 10);
      expect(cb).toHaveBeenCalledWith(10, 'xp');
    });

    it('notifies wildcard subscribers on any change', () => {
      const cb = vi.fn();
      store.subscribe('*', cb);
      store.set('level', 5);
      expect(cb).toHaveBeenCalledWith(5, 'level');
    });

    it('returns an unsubscribe function', () => {
      const cb = vi.fn();
      const unsub = store.subscribe('xp', cb);
      unsub();
      store.set('xp', 999);
      expect(cb).not.toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('resets state to defaults but preserves parentPin', () => {
      store.set('xp', 500);
      store.set('parentPin', '1234');
      store.reset();
      expect(store.get('xp')).toBe(0);
      expect(store.get('parentPin')).toBe('1234');
    });
  });

  describe('snapshot', () => {
    it('returns a shallow copy of state', () => {
      store.set('xp', 77);
      const snap = store.snapshot();
      expect(snap.xp).toBe(77);
      snap.xp = 0;
      expect(store.get('xp')).toBe(77); // original unaffected
    });
  });

  describe('recordWordAttempt', () => {
    it('tracks word attempts and correctness', () => {
      store.recordWordAttempt('cat', true);
      store.recordWordAttempt('cat', false);
      const stats = store.get('wordStats');
      expect(stats.cat.attempts).toBe(2);
      expect(stats.cat.correct).toBe(1);
      expect(stats.cat.lastSeen).toBeTruthy();
    });
  });

  describe('addWordHistory', () => {
    it('prepends entries and caps at 100', () => {
      for (let i = 0; i < 110; i++) {
        store.addWordHistory({ wordId: `word-${i}` });
      }
      const history = store.get('wordHistory');
      expect(history.length).toBe(100);
      expect(history[0].wordId).toBe('word-109');
    });
  });

  describe('energy system', () => {
    it('resets energy to 3', () => {
      store.drainEnergy();
      store.resetEnergy();
      expect(store.get('energy')).toBe(3);
    });

    it('drains energy to minimum 0', () => {
      store.drainEnergy(); // 2
      store.drainEnergy(); // 1
      store.drainEnergy(); // 0
      store.drainEnergy(); // still 0
      expect(store.get('energy')).toBe(0);
    });
  });

  describe('schema validation', () => {
    it('rejects state where xp is a string', async () => {
      localStorageMock.clear();
      localStorageMock.setItem('phonicsquest_v2', JSON.stringify({ xp: 'not-a-number' }));
      vi.resetModules();
      const mod = await import('../modules/store.js');
      expect(mod.store.get('xp')).toBe(0); // falls back to default
    });

    it('rejects state where wordStats is not an object', async () => {
      localStorageMock.clear();
      localStorageMock.setItem('phonicsquest_v2', JSON.stringify({ wordStats: 'bad' }));
      vi.resetModules();
      const mod = await import('../modules/store.js');
      expect(mod.store.get('wordStats')).toEqual({});
    });

    it('accepts valid saved state', async () => {
      localStorageMock.clear();
      localStorageMock.setItem('phonicsquest_v2', JSON.stringify({ xp: 42, level: 3 }));
      vi.resetModules();
      const mod = await import('../modules/store.js');
      expect(mod.store.get('xp')).toBe(42);
      expect(mod.store.get('level')).toBe(3);
    });

    it('repairs a single bad field without wiping the rest of the profile', async () => {
      localStorageMock.clear();
      localStorageMock.setItem(
        'phonicsquest_v2',
        JSON.stringify({
          xp: NaN, // JSON.stringify(NaN) -> null, an invalid xp
          level: 4,
          streak: 12,
          wordStats: { cat: { attempts: 9, correct: 8 } },
          badges: ['first-word'],
        }),
      );
      vi.resetModules();
      const mod = await import('../modules/store.js');
      expect(mod.store.get('xp')).toBe(0); // bad field reset to default
      expect(mod.store.get('level')).toBe(4); // everything else survives
      expect(mod.store.get('streak')).toBe(12);
      expect(mod.store.get('wordStats')).toEqual({ cat: { attempts: 9, correct: 8 } });
      expect(mod.store.get('badges')).toEqual(['first-word']);
    });

    it('backs up an unparseable payload instead of silently discarding it', async () => {
      localStorageMock.clear();
      localStorageMock.setItem('phonicsquest_v2', '{not json at all');
      vi.resetModules();
      const mod = await import('../modules/store.js');
      expect(mod.store.get('xp')).toBe(0); // defaults in use
      expect(localStorageMock.getItem('phonicsquest_v2__corrupt')).toBe('{not json at all');
    });

    it('backs up a non-object payload instead of silently discarding it', async () => {
      localStorageMock.clear();
      localStorageMock.setItem('phonicsquest_v2', JSON.stringify([1, 2, 3]));
      vi.resetModules();
      const mod = await import('../modules/store.js');
      expect(mod.store.get('xp')).toBe(0);
      expect(localStorageMock.getItem('phonicsquest_v2__corrupt')).toBe('[1,2,3]');
    });

    it('deep-merges structured objects so new sub-keys reach old saves', async () => {
      localStorageMock.clear();
      // A save from a version that predates several questMastery buckets and
      // only overrode one adaptiveConfig field.
      localStorageMock.setItem(
        'phonicsquest_v2',
        JSON.stringify({
          questMastery: { sentenceForge: { 'skill-1': 0.8 } },
          adaptiveConfig: { weakWeight: 9 },
        }),
      );
      vi.resetModules();
      const mod = await import('../modules/store.js');
      const qm = mod.store.get('questMastery');
      expect(qm.sentenceForge).toEqual({ 'skill-1': 0.8 }); // saved data kept
      expect(qm.synthesisQuest).toEqual({}); // newer bucket restored
      const cfg = mod.store.get('adaptiveConfig');
      expect(cfg.weakWeight).toBe(9); // override kept
      expect(cfg.strongAccuracy).toBe(0.9); // missing sub-key defaulted
      // _mergeWithDefaults stamps the current schema version onto old saves.
      expect(mod.store.get('schemaVersion')).toBe(2);
    });
  });

  describe('automatic backup & restore', () => {
    it('writes a daily backup on the first successful save', async () => {
      localStorageMock.clear();
      vi.resetModules();
      const mod = await import('../modules/store.js');
      mod.store.set('xp', 77);
      await Promise.resolve(); // let the queued microtask flush
      const backup = JSON.parse(localStorageMock.getItem('phonicsquest_v2__backup'));
      expect(backup.savedAt.slice(0, 10)).toBe(new Date().toISOString().slice(0, 10));
      expect(backup.state.xp).toBe(77);
    });

    it('does not rewrite a same-day backup on later saves', async () => {
      localStorageMock.clear();
      vi.resetModules();
      const mod = await import('../modules/store.js');
      mod.store.set('xp', 1);
      await Promise.resolve();
      mod.store.set('xp', 999);
      await Promise.resolve();
      const backup = JSON.parse(localStorageMock.getItem('phonicsquest_v2__backup'));
      expect(backup.state.xp).toBe(1); // first save of the day is the snapshot
    });

    it('restores from the backup when the main key is unreadable', async () => {
      localStorageMock.clear();
      localStorageMock.setItem('phonicsquest_v2', '{corrupt!!!');
      localStorageMock.setItem(
        'phonicsquest_v2__backup',
        JSON.stringify({
          savedAt: new Date().toISOString(),
          state: { xp: 321, level: 5, wordStats: { cat: { attempts: 4, correct: 4 } } },
        }),
      );
      vi.resetModules();
      const mod = await import('../modules/store.js');
      expect(mod.store.get('xp')).toBe(321);
      expect(mod.store.get('level')).toBe(5);
      expect(mod.store.get('wordStats')).toEqual({ cat: { attempts: 4, correct: 4 } });
      // The corrupt payload is still preserved for manual inspection.
      expect(localStorageMock.getItem('phonicsquest_v2__corrupt')).toBe('{corrupt!!!');
    });

    it('falls back to defaults when both main key and backup are unreadable', async () => {
      localStorageMock.clear();
      localStorageMock.setItem('phonicsquest_v2', '{corrupt!!!');
      localStorageMock.setItem('phonicsquest_v2__backup', 'also corrupt');
      vi.resetModules();
      const mod = await import('../modules/store.js');
      expect(mod.store.get('xp')).toBe(0);
    });
  });

  describe('reset', () => {
    it('preserves parent credentials (PIN and AI key) across a progress reset', () => {
      store.set('parentPin', 'hashed-pin');
      store.set('geminiApiKey', 'parent-key');
      store.set('xp', 500);
      store.reset();
      expect(store.get('xp')).toBe(0);
      expect(store.get('parentPin')).toBe('hashed-pin');
      expect(store.get('geminiApiKey')).toBe('parent-key');
    });
  });

  describe('checkDailyReset', () => {
    it('resets dailyDone when date changes', () => {
      store.patch({ dailyDone: 5, lastPlayDate: 'Thu Jan 01 2020' });
      store.checkDailyReset();
      expect(store.get('dailyDone')).toBe(0);
    });
  });

  describe('recordQuestAttempt', () => {
    it('caps at 300 entries', () => {
      for (let i = 0; i < 310; i++) {
        store.recordQuestAttempt({ quest: 'test', skill: 'abc', correct: true });
      }
      expect(store.get('questAttempts').length).toBe(300);
    });
  });
});
