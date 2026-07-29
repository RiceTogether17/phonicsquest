/**
 * SM-2 SRS scheduler (Word Vault vocabulary).
 *
 * This is the second of the app's two spaced-repetition systems: the
 * Leitner ladder in reviewScheduler.js drives phonics words, while this
 * SM-2 implementation drives Word Vault vocabulary. Its interval and
 * ease-factor arithmetic decides how long a child goes before seeing a
 * word again, so the maths and the due-date boundaries are pinned here.
 *
 * Reference (from the module header):
 *   correct (q=4): rep1 → 1d, rep2 → 6d, rep≥3 → round(interval × EF); EF unchanged
 *   wrong   (q=1): reps → 0, interval → 1d; EF − 0.54, floored at 1.3
 *   interval capped at 180 days; dueAt is a UTC YYYY-MM-DD string
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

async function loadSrs() {
  return import('../modules/srsScheduler.js');
}

/** UTC YYYY-MM-DD for `daysFromNow`, matching utils/dates.js conventions. */
function utcDay(daysFromNow = 0) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

describe('first review', () => {
  it('schedules a new word one day out after a correct answer', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();
    scheduleWord('w1', true);

    const s = getWordStatus('w1');
    expect(s.repetitions).toBe(1);
    expect(s.interval).toBe(1);
    expect(s.easeFactor).toBeCloseTo(2.5, 5); // q=4 leaves EF unchanged
    expect(s.dueAt).toBe(utcDay(1));
    expect(s.correct).toBe(1);
    expect(s.wrong).toBe(0);
  });

  it('keeps a missed new word at one day and drops its ease factor', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();
    scheduleWord('w1', false);

    const s = getWordStatus('w1');
    expect(s.repetitions).toBe(0);
    expect(s.interval).toBe(1);
    expect(s.easeFactor).toBeCloseTo(2.5 - 0.54, 5);
    expect(s.wrong).toBe(1);
  });
});

describe('interval progression', () => {
  it('follows the 1 → 6 → interval×EF ladder', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();

    scheduleWord('w1', true);
    expect(getWordStatus('w1').interval).toBe(1);

    scheduleWord('w1', true);
    expect(getWordStatus('w1').interval).toBe(6);

    scheduleWord('w1', true);
    // rep 3: round(6 × 2.5) = 15
    expect(getWordStatus('w1').interval).toBe(15);

    scheduleWord('w1', true);
    // rep 4: round(15 × 2.5) = 38
    expect(getWordStatus('w1').interval).toBe(38);
  });

  it('caps the interval at 180 days', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();
    for (let i = 0; i < 12; i++) scheduleWord('w1', true);
    expect(getWordStatus('w1').interval).toBe(180);
  });

  it('resets repetitions and interval on a lapse, without wiping counts', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();
    scheduleWord('w1', true);
    scheduleWord('w1', true);
    scheduleWord('w1', true);
    expect(getWordStatus('w1').interval).toBe(15);

    scheduleWord('w1', false);
    const s = getWordStatus('w1');
    expect(s.repetitions).toBe(0);
    expect(s.interval).toBe(1);
    expect(s.correct).toBe(3); // history is kept
    expect(s.wrong).toBe(1);
  });
});

describe('ease factor', () => {
  it('never falls below the 1.3 floor', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();
    for (let i = 0; i < 10; i++) scheduleWord('w1', false);
    expect(getWordStatus('w1').easeFactor).toBeCloseTo(1.3, 5);
  });

  it('is unchanged by correct answers', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();
    scheduleWord('w1', true);
    scheduleWord('w1', true);
    expect(getWordStatus('w1').easeFactor).toBeCloseTo(2.5, 5);
  });
});

describe('due-date queries', () => {
  it('treats a word due today as due (boundary is inclusive)', async () => {
    const { isWordDue, getSchedule } = await loadSrs();
    const { store } = await import('../modules/store.js');
    store.set('srsSchedule', {
      today: { interval: 1, repetitions: 1, easeFactor: 2.5, dueAt: utcDay(0), correct: 1, wrong: 0 },
    });
    expect(isWordDue('today')).toBe(true);
    expect(getSchedule('today')).not.toBeNull();
  });

  it('does not surface a word scheduled for the future', async () => {
    const { isWordDue } = await loadSrs();
    const { store } = await import('../modules/store.js');
    store.set('srsSchedule', {
      later: { interval: 6, repetitions: 2, easeFactor: 2.5, dueAt: utcDay(3), correct: 2, wrong: 0 },
    });
    expect(isWordDue('later')).toBe(false);
  });

  it('reports overdue words as due', async () => {
    const { isWordDue } = await loadSrs();
    const { store } = await import('../modules/store.js');
    store.set('srsSchedule', {
      stale: { interval: 1, repetitions: 1, easeFactor: 2.5, dueAt: utcDay(-5), correct: 1, wrong: 0 },
    });
    expect(isWordDue('stale')).toBe(true);
  });

  it('getDueWords filters an explicit list and getDueCount counts all', async () => {
    const { getDueWords, getDueCount } = await loadSrs();
    const { store } = await import('../modules/store.js');
    store.set('srsSchedule', {
      a: { interval: 1, repetitions: 1, easeFactor: 2.5, dueAt: utcDay(-1), correct: 1, wrong: 0 },
      b: { interval: 6, repetitions: 2, easeFactor: 2.5, dueAt: utcDay(4),  correct: 2, wrong: 0 },
      c: { interval: 1, repetitions: 1, easeFactor: 2.5, dueAt: utcDay(0),  correct: 1, wrong: 0 },
    });

    expect(getDueWords(['a', 'b']).sort()).toEqual(['a']);
    expect(getDueWords().sort()).toEqual(['a', 'c']);
    expect(getDueCount()).toBe(2);
  });

  it('ignores unknown ids rather than throwing', async () => {
    const { isWordDue, getWordStatus, getDueWords } = await loadSrs();
    expect(isWordDue('nope')).toBe(false);
    expect(getWordStatus('nope')).toBeNull();
    expect(getDueWords(['nope'])).toEqual([]);
  });

  it('ignores falsy ids on write and read', async () => {
    const { scheduleWord, isWordDue, getWordStatus } = await loadSrs();
    expect(() => scheduleWord('', true)).not.toThrow();
    expect(isWordDue('')).toBe(false);
    expect(getWordStatus('')).toBeNull();
  });
});

describe('legacy migration', () => {
  it('backfills repetitions and easeFactor for pre-SM-2 entries', async () => {
    const { getWordStatus } = await loadSrs();
    const { store } = await import('../modules/store.js');
    // Old shape: interval/dueAt/correct/wrong only.
    store.set('srsSchedule', {
      old: { interval: 3, dueAt: utcDay(1), correct: 2, wrong: 1 },
    });

    const s = getWordStatus('old');
    expect(s.repetitions).toBe(0);
    expect(s.easeFactor).toBe(2.5);
    expect(s.interval).toBe(3); // existing data preserved
  });

  it('defaults every field of a truncated entry rather than propagating NaN', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();
    const { store } = await import('../modules/store.js');
    // A hand-edited or partially-written record missing `interval`/`dueAt`.
    store.set('srsSchedule', { broken: { repetitions: 2 } });

    const migrated = getWordStatus('broken');
    expect(migrated.interval).toBe(1);
    expect(migrated.correct).toBe(0);
    expect(migrated.wrong).toBe(0);
    expect(typeof migrated.dueAt).toBe('string');

    // And a review off that base must still produce finite, valid values.
    scheduleWord('broken', true);
    const after = getWordStatus('broken');
    expect(Number.isFinite(after.interval)).toBe(true);
    expect(after.dueAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('reviews a migrated legacy entry without losing its counts', async () => {
    const { scheduleWord, getWordStatus } = await loadSrs();
    const { store } = await import('../modules/store.js');
    store.set('srsSchedule', {
      old: { interval: 3, dueAt: utcDay(1), correct: 2, wrong: 1 },
    });

    scheduleWord('old', true);
    const s = getWordStatus('old');
    expect(s.correct).toBe(3);
    expect(s.wrong).toBe(1);
    expect(s.repetitions).toBe(1);
  });
});

describe('reset', () => {
  it('clears every scheduled word', async () => {
    const { scheduleWord, reset, getDueCount, getWordStatus } = await loadSrs();
    scheduleWord('w1', true);
    scheduleWord('w2', true);

    reset();
    expect(getDueCount()).toBe(0);
    expect(getWordStatus('w1')).toBeNull();
  });
});

describe('namespace API', () => {
  it('exposes the same behaviour through the dot-notation object', async () => {
    const { srsScheduler } = await loadSrs();
    srsScheduler.record('w1', true);
    expect(srsScheduler.getSchedule('w1').repetitions).toBe(1);
    expect(srsScheduler.isDue('w1')).toBe(false); // due tomorrow
    srsScheduler.reset();
    expect(srsScheduler.getSchedule('w1')).toBeNull();
  });
});
