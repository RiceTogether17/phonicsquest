import { beforeEach, describe, expect, it } from 'vitest';
import { store } from '../modules/store.js';
import { getWeeklyActivity } from '../modules/weeklyActivity.js';

/**
 * The parent-facing counters were derived from `wordHistory`, which only the
 * early-reading modes write. A P4 child who spends every session in Grammar
 * MCQ and the practice papers registered as having done nothing — the
 * coaching report read "0 days active, 0 words practised" after a full week.
 */

const NOW = Date.parse('2026-08-12T10:00:00Z');
const hoursAgo = (h) => new Date(NOW - h * 3_600_000).toISOString();

beforeEach(() => {
  store.set('questAttempts', []);
  store.set('wordHistory', []);
  store.set('lastPlayDate', null);
});

describe('getWeeklyActivity', () => {
  it('reports nothing for a profile that has not played', () => {
    const week = getWeeklyActivity({ now: NOW });
    expect(week.hasActivity).toBe(false);
    expect(week).toMatchObject({ days: 0, questions: 0, accuracy: null });
  });

  it('counts Primary English practice, which wordHistory never sees', () => {
    store.set('questAttempts', [
      { quest: 'grammarMcq', correct: true, timestamp: hoursAgo(1) },
      { quest: 'grammarMcq', correct: false, timestamp: hoursAgo(2) },
      { quest: 'clozeCastle', correct: true, timestamp: hoursAgo(30) },
    ]);

    const week = getWeeklyActivity({ now: NOW });
    expect(week.hasActivity).toBe(true);
    expect(week.questions).toBe(3);
    expect(week.days).toBe(2);
    expect(week.answered).toBe(3);
    expect(week.correct).toBe(2);
    expect(week.accuracy).toBeCloseTo(2 / 3);
  });

  it('pools both pathways into one week', () => {
    store.set('questAttempts', [{ quest: 'grammarMcq', correct: true, timestamp: hoursAgo(1) }]);
    store.set('wordHistory', [
      { word: 'cat', timestamp: hoursAgo(1) },
      { word: 'cat', timestamp: hoursAgo(2) },
      { word: 'dog', timestamp: hoursAgo(50) },
    ]);

    const week = getWeeklyActivity({ now: NOW });
    // Distinct words, not raw attempts, plus the quest attempt.
    expect(week.questions).toBe(3);
    expect(week.days).toBe(2);
  });

  it('ignores anything outside the window', () => {
    store.set('questAttempts', [
      { quest: 'grammarMcq', correct: true, timestamp: hoursAgo(24 * 8) },
    ]);
    expect(getWeeklyActivity({ now: NOW }).hasActivity).toBe(false);
  });

  it('honours a custom window', () => {
    store.set('questAttempts', [
      { quest: 'grammarMcq', correct: true, timestamp: hoursAgo(24 * 8) },
    ]);
    expect(getWeeklyActivity({ days: 30, now: NOW }).questions).toBe(1);
  });

  it('counts a session that logged no attempt via lastPlayDate', () => {
    store.set('lastPlayDate', new Date(NOW).toDateString());
    const week = getWeeklyActivity({ now: NOW });
    expect(week.days).toBe(1);
    expect(week.hasActivity).toBe(true);
    expect(week.accuracy).toBeNull();
  });

  it('survives malformed timestamps', () => {
    store.set('questAttempts', [
      { quest: 'grammarMcq', correct: true, timestamp: 'not-a-date' },
      { quest: 'grammarMcq', correct: true },
      null,
    ]);
    expect(() => getWeeklyActivity({ now: NOW })).not.toThrow();
    expect(getWeeklyActivity({ now: NOW }).questions).toBe(0);
  });
});
