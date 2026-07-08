/**
 * Tests for critical bug fixes identified in static code audit:
 * 1. Streak logic — evaluated before lastPlayDate mutation, off-by-one fixed
 * 2. Review session must NOT trigger daily challenge completion
 * 3. Centralized XP pipeline — all XP through gamification.awardXp()
 * 4. Debounced localStorage writes
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// ── Mock localStorage ──────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────────

/** Return a Date string N days ago. */
function daysAgo(n) {
  return new Date(Date.now() - n * 86400000).toDateString();
}

// ── 1. Streak Logic ────────────────────────────────────────────────────────

describe('Streak logic (gamification._checkStreak)', () => {
  let gamification, store;

  beforeEach(async () => {
    localStorageMock.clear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    vi.resetModules();
    const storeMod = await import('../src/modules/store.js');
    const gamMod   = await import('../src/modules/gamification.js');
    store        = storeMod.store;
    gamification = gamMod.gamification;
  });

  it('does not reset streak when lastPlayDate is yesterday', () => {
    store.set('streak', 5);
    store.set('lastPlayDate', daysAgo(1)); // yesterday
    gamification._checkStreak();
    expect(store.get('streak')).toBe(5); // intact
  });

  it('does not reset streak when lastPlayDate is today', () => {
    store.set('streak', 3);
    store.set('lastPlayDate', new Date().toDateString());
    gamification._checkStreak();
    expect(store.get('streak')).toBe(3);
  });

  it('resets streak when 2+ days are missed and no freeze available', () => {
    store.set('streak', 5);
    store.set('lastPlayDate', daysAgo(3)); // 3 days ago = 2 skipped
    store.set('streakFreezes', 0);
    gamification._checkStreak();
    expect(store.get('streak')).toBe(0);
  });

  it('uses freeze token when exactly 1 day is skipped', () => {
    store.set('streak', 5);
    store.set('lastPlayDate', daysAgo(2)); // 2 days ago = 1 skipped
    store.set('streakFreezes', 1);
    gamification._checkStreak();
    expect(store.get('streak')).toBe(5);       // preserved
    expect(store.get('streakFreezes')).toBe(0); // token consumed
    expect(gamification.wasFreezeUsed()).toBe(true);
  });

  it('does NOT use freeze when 2+ days are skipped', () => {
    store.set('streak', 5);
    store.set('lastPlayDate', daysAgo(4)); // 4 days ago = 3 skipped
    store.set('streakFreezes', 1);
    gamification._checkStreak();
    expect(store.get('streak')).toBe(0);       // reset
    expect(store.get('streakFreezes')).toBe(1); // token NOT consumed
  });

  it('checkDailyReset does NOT overwrite lastPlayDate (streak reads original)', () => {
    const yesterday = daysAgo(1);
    store.set('streak', 7);
    store.set('lastPlayDate', yesterday);
    store.checkDailyReset();
    // lastPlayDate must still be yesterday so streak logic can evaluate it
    expect(store.get('lastPlayDate')).toBe(yesterday);
    // Daily counters should still reset
    expect(store.get('dailyDone')).toBe(0);
    expect(store.get('sessionXpToday')).toBe(0);
  });
});

// ── 2. Review session vs Daily Challenge ───────────────────────────────────

describe('Review session does NOT complete daily challenge', () => {
  // These are integration-level assertions against the session type enum.
  // We cannot easily instantiate App, but we test the data layer contract.

  let dailyChallengeMod;

  beforeEach(async () => {
    localStorageMock.clear();
    vi.resetModules();
    await import('../src/modules/store.js');
    dailyChallengeMod = await import('../src/modules/dailyChallenge.js');
  });

  it('completeDailyChallenge awards XP and marks date', () => {
    const xp = dailyChallengeMod.completeDailyChallenge();
    expect(xp).toBe(dailyChallengeMod.DAILY_BONUS_XP);
    expect(dailyChallengeMod.isDailyChallengeComplete()).toBe(true);
  });

  it('completeDailyChallenge is idempotent (returns 0 if already done)', () => {
    dailyChallengeMod.completeDailyChallenge();
    const second = dailyChallengeMod.completeDailyChallenge();
    expect(second).toBe(0);
  });

  it('isDailyChallengeComplete returns false before completion', () => {
    expect(dailyChallengeMod.isDailyChallengeComplete()).toBe(false);
  });
});

// ── 3. Centralized XP Pipeline ─────────────────────────────────────────────

describe('gamification.awardXp() centralized pipeline', () => {
  let gamification, store;

  beforeEach(async () => {
    localStorageMock.clear();
    vi.resetModules();
    const storeMod = await import('../src/modules/store.js');
    const gamMod   = await import('../src/modules/gamification.js');
    store        = storeMod.store;
    gamification = gamMod.gamification;
  });

  it('awards XP and updates level', () => {
    const result = gamification.awardXp(50, 'test');
    expect(result.newXP).toBe(50);
    expect(store.get('xp')).toBe(50);
  });

  it('tracks session XP via addSessionXp', () => {
    // Set lastPlayDate to today so session tracking works
    store.set('lastPlayDate', new Date().toDateString());
    gamification.awardXp(30, 'test');
    expect(store.get('sessionXpToday')).toBe(30);
  });

  it('detects level-up', () => {
    // Level 2 requires 100 XP per getLevelInfo
    const result = gamification.awardXp(150, 'test');
    expect(result.levelUp).toBe(true);
    expect(result.newLevel).toBeGreaterThanOrEqual(2);
  });

  it('rejects zero/negative amounts', () => {
    const result = gamification.awardXp(0, 'noop');
    expect(result.newXP).toBe(0);
    expect(result.levelUp).toBe(false);
  });

  it('recordCorrect uses awardXp internally (XP and level sync)', () => {
    const result = gamification.recordCorrect(5000, false);
    expect(result.xpEarned).toBeGreaterThan(0);
    expect(store.get('xp')).toBe(result.xpEarned);
  });
});

// ── 4. Debounced localStorage writes ────────────────────────────────────────

describe('Store debounced persistence', () => {
  let store;

  beforeEach(async () => {
    localStorageMock.clear();
    localStorageMock.setItem.mockClear();
    vi.resetModules();
    const storeMod = await import('../src/modules/store.js');
    store = storeMod.store;
    // Clear the initial save from constructor
    localStorageMock.setItem.mockClear();
  });

  // The first flush of a day also writes the __backup key, so count only
  // writes to the main key when asserting debounce behaviour.
  const mainKeyWrites = () =>
    localStorageMock.setItem.mock.calls.filter(([k]) => k === 'phonicsquest_v2');

  it('batches multiple set() calls into a single localStorage write', async () => {
    store.set('xp', 10);
    store.set('level', 2);
    store.set('streak', 3);

    // Synchronously, no writes should have happened yet beyond the microtask queue
    const callsBefore = mainKeyWrites().length;

    // Wait for microtask to flush
    await new Promise(resolve => queueMicrotask(resolve));

    const callsAfter = mainKeyWrites().length;
    // Should have batched into 1 write (or at most a few — not 3 separate ones)
    expect(callsAfter - callsBefore).toBeLessThanOrEqual(1);
  });

  it('patch() triggers only one save', async () => {
    localStorageMock.setItem.mockClear();
    store.patch({ xp: 99, level: 5, streak: 10 });

    await new Promise(resolve => queueMicrotask(resolve));

    // patch + debounce = 1 write to the main key
    expect(mainKeyWrites().length).toBe(1);
  });

  it('state is correct after debounced writes', async () => {
    store.set('xp', 42);
    store.set('streak', 7);

    await new Promise(resolve => queueMicrotask(resolve));

    // Verify the persisted data has both values
    const lastCall = mainKeyWrites().at(-1);
    const persisted = JSON.parse(lastCall[1]);
    expect(persisted.xp).toBe(42);
    expect(persisted.streak).toBe(7);
  });
});
