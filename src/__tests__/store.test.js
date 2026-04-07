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
    setItem: vi.fn((key, val) => { store[key] = String(val); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
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
    });

    it('sets and gets a value', () => {
      store.set('xp', 42);
      expect(store.get('xp')).toBe(42);
    });

    it('persists to localStorage on set (after microtask)', async () => {
      localStorageMock.setItem.mockClear();
      store.set('xp', 100);
      // Persistence is debounced via queueMicrotask
      await new Promise(resolve => queueMicrotask(resolve));
      expect(localStorageMock.setItem).toHaveBeenCalled();
      const saved = JSON.parse(localStorageMock.setItem.mock.calls.at(-1)[1]);
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
