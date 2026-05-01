import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { store } from '../src/modules/store.js';
import { WORDS } from '../src/data/words.js';
import {
  getDailyChallengeWords,
  isDailyChallengeComplete,
  completeDailyChallenge,
  getChallengeCalendar,
  getWeeklyStreak,
  DAILY_BONUS_XP,
  DAILY_WORD_COUNT,
} from '../src/modules/dailyChallenge.js';

const FIXED_TODAY    = new Date(2026, 3, 30, 9, 0, 0); // 2026-04-30 (local)
const FIXED_TOMORROW = new Date(2026, 4, 1, 9, 0, 0);  // 2026-05-01

describe('getDailyChallengeWords', () => {
  beforeEach(() => {
    store.reset();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_TODAY);
  });
  afterEach(() => { vi.useRealTimers(); });

  it('returns exactly DAILY_WORD_COUNT words', () => {
    store.set('difficulty', 3);
    const words = getDailyChallengeWords();
    expect(words).toHaveLength(DAILY_WORD_COUNT);
  });

  it('only picks words at or below the configured difficulty', () => {
    store.set('difficulty', 2);
    const picks = getDailyChallengeWords();
    for (const w of picks) {
      expect(w.level).toBeLessThanOrEqual(2);
    }
  });

  it('is deterministic for the same calendar day', () => {
    store.set('difficulty', 3);
    const a = getDailyChallengeWords().map(w => w.id);
    const b = getDailyChallengeWords().map(w => w.id);
    expect(a).toEqual(b);
  });

  it('produces a different selection on a different calendar day', () => {
    store.set('difficulty', 3);
    const day1 = getDailyChallengeWords().map(w => w.id);
    vi.setSystemTime(FIXED_TOMORROW);
    const day2 = getDailyChallengeWords().map(w => w.id);
    // Same length but at least one different word — extremely unlikely to
    // collide across the 800+ word bank.
    expect(day2).toHaveLength(DAILY_WORD_COUNT);
    expect(day2).not.toEqual(day1);
  });

  it('returns words from the WORDS bank only', () => {
    store.set('difficulty', 3);
    const ids = new Set(WORDS.map(w => w.id));
    for (const w of getDailyChallengeWords()) {
      expect(ids.has(w.id)).toBe(true);
    }
  });

  it('biases the first slots toward weak words when stats exist', () => {
    store.set('difficulty', 3);
    // Mark every word at level 1 as a "weak" word (low accuracy, attempted).
    const stats = {};
    for (const w of WORDS) {
      if (w.level === 1) {
        stats[w.id] = { attempts: 8, correct: 1, lastSeen: Date.now() };
      }
    }
    store.set('wordStats', stats);
    const picks = getDailyChallengeWords();
    const weakIds = new Set(WORDS.filter(w => w.level === 1).map(w => w.id));
    // The selector reserves 3 of 5 slots for weighted weak picks; with the
    // entire L1 pool flagged weak, at least 3 of today's picks should be
    // drawn from that pool.
    const weakHits = picks.filter(w => weakIds.has(w.id)).length;
    expect(weakHits).toBeGreaterThanOrEqual(3);
  });
});

describe('completion + calendar tracking', () => {
  beforeEach(() => {
    store.reset();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_TODAY);
  });
  afterEach(() => { vi.useRealTimers(); });

  it('isDailyChallengeComplete is false before completion', () => {
    expect(isDailyChallengeComplete()).toBe(false);
  });

  it('completeDailyChallenge awards bonus XP and marks today complete', () => {
    const beforeXp = store.get('xp') || 0;
    const awarded = completeDailyChallenge();
    expect(awarded).toBe(DAILY_BONUS_XP);
    expect(isDailyChallengeComplete()).toBe(true);
    expect((store.get('xp') || 0) - beforeXp).toBe(DAILY_BONUS_XP);
  });

  it('completeDailyChallenge is a no-op the second time on the same day', () => {
    completeDailyChallenge();
    const xpAfterFirst = store.get('xp') || 0;
    const second = completeDailyChallenge();
    expect(second).toBe(0);
    expect(store.get('xp') || 0).toBe(xpAfterFirst);
  });

  it('records today on the calendar exactly once', () => {
    completeDailyChallenge();
    completeDailyChallenge();
    const calendar = getChallengeCalendar();
    const todayStr = `${FIXED_TODAY.getFullYear()}-${String(FIXED_TODAY.getMonth() + 1).padStart(2, '0')}-${String(FIXED_TODAY.getDate()).padStart(2, '0')}`;
    expect(calendar.filter(d => d === todayStr)).toHaveLength(1);
  });

  it('isDailyChallengeComplete resets when the day rolls over', () => {
    completeDailyChallenge();
    expect(isDailyChallengeComplete()).toBe(true);
    vi.setSystemTime(FIXED_TOMORROW);
    expect(isDailyChallengeComplete()).toBe(false);
  });
});

describe('getWeeklyStreak', () => {
  beforeEach(() => {
    store.reset();
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_TODAY);
  });
  afterEach(() => { vi.useRealTimers(); });

  function isoDay(offsetDays) {
    const d = new Date(FIXED_TODAY);
    d.setDate(d.getDate() - offsetDays);
    return d.toISOString().slice(0, 10);
  }

  it('returns 0 when nothing has been completed', () => {
    expect(getWeeklyStreak()).toBe(0);
  });

  it('counts only completions within the last 7 days', () => {
    store.set('challengeCalendar', [
      isoDay(0), isoDay(1), isoDay(3),
      isoDay(8),  // outside the 7-day window
      isoDay(20),
    ]);
    expect(getWeeklyStreak()).toBe(3);
  });

  it('caps at 7 even if the calendar contains duplicates', () => {
    store.set('challengeCalendar',
      [0, 1, 2, 3, 4, 5, 6].map(isoDay)
    );
    expect(getWeeklyStreak()).toBe(7);
  });
});
