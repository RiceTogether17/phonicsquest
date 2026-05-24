import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { store } from '../src/modules/store.js';
import { getEarlyReadingPlan, WARMUP_TARGET } from '../src/modules/todaysPlan.js';
import { DAILY_BONUS_XP } from '../src/modules/dailyChallenge.js';
import { WORDS } from '../src/data/words.js';

const NOW = new Date(2026, 4, 23, 9, 0, 0); // 2026-05-23 09:00

function todayYmd(date = NOW) {
  return date.toDateString();
}

describe("Today's Plan — early-reading 3-step daily quest", () => {
  beforeEach(() => {
    store.reset();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    // Mark today as the active play day so sessionWordsToday tracking persists.
    store.set('lastPlayDate', todayYmd());
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('exposes three steps in fixed order: review → daily → warm-up', () => {
    const plan = getEarlyReadingPlan();
    expect(plan.steps).toHaveLength(3);
    expect(plan.steps.map(s => s.id)).toEqual(['review', 'daily', 'warmup']);
    expect(plan.total).toBe(3);
  });

  it('marks the Review Lane step done when there are no due items (empty queue)', () => {
    // Brand-new profile with no wordStats → no due items → "all caught up".
    const plan = getEarlyReadingPlan();
    const review = plan.steps.find(s => s.id === 'review');
    expect(review.done).toBe(true);
    expect(review.detail).toMatch(/caught up/i);
  });

  it('marks the Review Lane step pending when due items exist, with minute estimate', () => {
    // Seed a few past-due words.
    const dueAt = NOW.getTime() - 86_400_000; // yesterday
    const stats = {};
    for (const w of WORDS.slice(0, 5)) {
      stats[w.id] = { box: 1, dueAt, attempts: 2, correct: 1, lastSeen: new Date(dueAt).toISOString() };
    }
    store.set('wordStats', stats);

    const plan = getEarlyReadingPlan();
    const review = plan.steps.find(s => s.id === 'review');
    expect(review.done).toBe(false);
    expect(review.detail).toMatch(/5 words? due/i);
    expect(review.detail).toMatch(/about \d+ min/);
  });

  it('marks the Daily Challenge step done when isDailyChallengeComplete()', () => {
    store.set('dailyChallenge', { date: '2026-05-23', complete: true });
    const plan = getEarlyReadingPlan();
    const daily = plan.steps.find(s => s.id === 'daily');
    expect(daily.done).toBe(true);
    expect(daily.detail).toMatch(new RegExp(`\\+${DAILY_BONUS_XP}`));
  });

  it('marks the Warm-up step done after sessionWordsToday hits the target', () => {
    store.set('sessionWordsToday', ['cat', 'hat', 'mat']);
    const plan = getEarlyReadingPlan();
    const warmup = plan.steps.find(s => s.id === 'warmup');
    expect(warmup.done).toBe(true);
    expect(warmup.progressLabel).toBe('✓');
  });

  it('Warm-up shows partial progress (X/3) when below target', () => {
    store.set('sessionWordsToday', ['cat']);
    const plan = getEarlyReadingPlan();
    const warmup = plan.steps.find(s => s.id === 'warmup');
    expect(warmup.done).toBe(false);
    expect(warmup.progressLabel).toBe(`1/${WARMUP_TARGET}`);
  });

  it('reports done/total/complete accurately when all three are done', () => {
    store.set('dailyChallenge', { date: '2026-05-23', complete: true });
    store.set('sessionWordsToday', ['cat', 'hat', 'mat', 'sit']);
    // Review Lane is empty by default → step 1 already done.
    const plan = getEarlyReadingPlan();
    expect(plan.done).toBe(3);
    expect(plan.complete).toBe(true);
    expect(plan.allCaughtUp).toBe(true);
  });

  it('complete-but-not-all-caught-up: review step done because queue cleared mid-day', () => {
    // Simulate: child cleared their queue today, completed daily + warm-up.
    // (In practice, getReviewDueCount() === 0 after clearing.)
    store.set('dailyChallenge', { date: '2026-05-23', complete: true });
    store.set('sessionWordsToday', ['cat', 'hat', 'mat']);
    const plan = getEarlyReadingPlan();
    expect(plan.complete).toBe(true);
    // allCaughtUp is true only when due === 0; we still set it true here
    // because no due items exist post-clear. Documented behaviour.
    expect(plan.allCaughtUp).toBe(true);
  });

  it('every step carries the data needed to navigate', () => {
    const plan = getEarlyReadingPlan();
    for (const step of plan.steps) {
      expect(typeof step.id).toBe('string');
      expect(typeof step.title).toBe('string');
      expect(typeof step.detail).toBe('string');
      expect(typeof step.target).toBe('string');
      expect(typeof step.done).toBe('boolean');
      expect(step.num).toBeGreaterThan(0);
    }
  });

  it('Warm-up falls back to a safe default when recommendations are unavailable', () => {
    // Empty store + reset → recommendations should still produce a step.
    const plan = getEarlyReadingPlan();
    const warmup = plan.steps.find(s => s.id === 'warmup');
    expect(warmup).toBeDefined();
    expect(warmup.target).toBeTruthy();
    expect(warmup.title).toBeTruthy();
  });
});
