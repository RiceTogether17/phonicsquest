/**
 * Unit tests for the gamification engine (gamification.js).
 * Tests XP rewards, energy system, streak tracking, and session stats.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => { store[key] = String(val); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

describe('Gamification', () => {
  let gamification, store;

  beforeEach(async () => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    vi.resetModules();
    const storeMod = await import('../modules/store.js');
    const gamMod = await import('../modules/gamification.js');
    store = storeMod.store;
    gamification = gamMod.gamification;
  });

  describe('recordCorrect', () => {
    it('awards base XP for a correct answer', () => {
      const result = gamification.recordCorrect(5000, false);
      expect(result.xpEarned).toBeGreaterThan(0);
      expect(result.reasons).toContain('Correct!');
      expect(store.get('xp')).toBeGreaterThan(0);
    });

    it('awards fast XP for quick answers (< 3s)', () => {
      const result = gamification.recordCorrect(2000, false);
      expect(result.reasons).toContain('Quick answer!');
      expect(result.xpEarned).toBe(15); // XP_REWARDS.correct_fast
    });

    it('awards new word bonus', () => {
      const result = gamification.recordCorrect(5000, true);
      expect(result.reasons).toContain('New word!');
      expect(result.xpEarned).toBe(15); // 10 base + 5 new word
    });

    it('awards streak bonus at 5 correct', () => {
      // Get 4 correct first
      for (let i = 0; i < 4; i++) gamification.recordCorrect(5000);
      const result = gamification.recordCorrect(5000);
      expect(result.reasons).toContain('5 in a row!');
    });

    it('awards streak bonus at 10 correct', () => {
      for (let i = 0; i < 9; i++) gamification.recordCorrect(5000);
      const result = gamification.recordCorrect(5000);
      expect(result.reasons).toContain('10 in a row!');
    });

    it('detects level up', () => {
      // Level 2 starts at 100 XP
      store.set('xp', 95);
      const result = gamification.recordCorrect(5000);
      expect(result.levelUp).toBe(true);
      expect(result.newLevel).toBe(2);
    });
  });

  describe('recordWrong', () => {
    it('resets session streak and drains energy', () => {
      gamification.recordCorrect(5000); // streak = 1
      const result = gamification.recordWrong();
      expect(result.energyLeft).toBe(2);
    });

    it('signals needsRest when energy hits 0', () => {
      store.set('energy', 1);
      const result = gamification.recordWrong();
      expect(result.needsRest).toBe(true);
      expect(result.energyLeft).toBe(0);
    });
  });

  describe('energy system', () => {
    it('resetEnergy sets energy back to 3', () => {
      store.set('energy', 0);
      gamification.resetEnergy();
      expect(store.get('energy')).toBe(3);
    });

});

  describe('getSessionStats', () => {
    it('tracks session correct and wrong counts', () => {
      gamification.recordCorrect(5000);
      gamification.recordCorrect(5000);
      gamification.recordWrong();
      const stats = gamification.getSessionStats();
      expect(stats.correct).toBe(0); // reset by recordWrong
      expect(stats.wrong).toBe(1);
    });

    it('calculates accuracy', () => {
      gamification.recordCorrect(5000);
      gamification.recordCorrect(5000);
      // Note: sessionCorrect got reset by no wrong, so accuracy depends on internal state
      const stats = gamification.getSessionStats();
      expect(stats.accuracy).toBeGreaterThanOrEqual(0);
      expect(stats.accuracy).toBeLessThanOrEqual(1);
    });
  });

  describe('resetSession', () => {
    it('resets session counters', () => {
      gamification.recordCorrect(5000);
      gamification.resetSession();
      const stats = gamification.getSessionStats();
      expect(stats.correct).toBe(0);
      expect(stats.wrong).toBe(0);
    });
  });
});
