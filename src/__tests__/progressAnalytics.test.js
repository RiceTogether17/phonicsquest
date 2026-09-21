/**
 * Progress analytics — golden tests against a controlled attempt stream.
 *
 * The progress model has to be right because parents and teachers act on
 * its numbers. Every public function in `progressAnalytics.js` gets a
 * focused test here.
 */
import { describe, expect, it } from 'vitest';
import {
  getMasteryByStage,
  getAccuracyByMode,
  getStrongestSounds,
  getWeakestSounds,
  getCommonErrorTypes,
  getAttemptsOverTime,
  getCurrentPhase,
  getSuggestedNext,
  getMasteryPercent,
  getPrintablePracticeList,
  summarise,
  attemptLog,
} from '../modules/progressAnalytics.js';
import { CURRICULUM } from '../data/curriculum.js';

// Helper to build an attempt with sensible defaults.
function a(overrides = {}) {
  return {
    timestamp: Date.UTC(2026, 4, 19, 10, 0, 0),
    stageId: 'cvc-a',
    group: 'cvc-a',
    mode: 'soundMatch',
    word: 'cat',
    correct: true,
    errorCategory: null,
    timeMs: 1200,
    targetSound: 'short a /ă/',
    ...overrides,
  };
}

// A small synthetic curriculum keeps these tests independent of changes
// in curriculum.js. The real curriculum is exercised by the integration
// summarise() tests below.
const TINY = [
  {
    id: 's1',
    phase: 1,
    name: 'S1',
    sampleWords: ['cat', 'hat'],
    sentenceExamples: ['The cat sat.'],
  },
  {
    id: 's2',
    phase: 1,
    name: 'S2',
    sampleWords: ['bed', 'leg'],
    sentenceExamples: ['The bed is red.'],
  },
  { id: 's3', phase: 2, name: 'S3', sampleWords: ['flap'], sentenceExamples: ['Flap and clap.'] },
];

// ── Mastery by stage ─────────────────────────────────────────────────────

describe('getMasteryByStage', () => {
  it('returns an empty object for no attempts', () => {
    expect(getMasteryByStage([])).toEqual({});
  });

  it('counts attempts and correct per stage and computes accuracy', () => {
    const out = getMasteryByStage([
      a({ stageId: 's1', correct: true }),
      a({ stageId: 's1', correct: true }),
      a({ stageId: 's1', correct: false }),
      a({ stageId: 's2', correct: true }),
    ]);
    expect(out.s1.attempts).toBe(3);
    expect(out.s1.correct).toBe(2);
    expect(out.s1.accuracy).toBeCloseTo(2 / 3);
    expect(out.s2.accuracy).toBe(1);
  });

  it('marks a stage mastered only when accuracy AND minAttempts thresholds clear', () => {
    const attempts = [
      // 6 correct in a row at s1 → should master
      ...Array.from({ length: 6 }, () => a({ stageId: 's1', correct: true })),
      // 5 perfect at s2 → not enough attempts
      ...Array.from({ length: 5 }, () => a({ stageId: 's2', correct: true })),
      // 10 at s3 with only 60% accuracy → enough attempts but low accuracy
      ...Array.from({ length: 6 }, () => a({ stageId: 's3', correct: true })),
      ...Array.from({ length: 4 }, () => a({ stageId: 's3', correct: false })),
    ];
    const out = getMasteryByStage(attempts);
    expect(out.s1.mastered).toBe(true);
    expect(out.s2.mastered).toBe(false);
    expect(out.s3.mastered).toBe(false);
  });

  it('respects per-call masteryAccuracy / masteryMinAttempts overrides', () => {
    const attempts = Array.from({ length: 3 }, () => a({ stageId: 's1', correct: true }));
    const out = getMasteryByStage(attempts, { masteryAccuracy: 0.5, masteryMinAttempts: 3 });
    expect(out.s1.mastered).toBe(true);
  });

  it('ignores non-object entries gracefully', () => {
    const out = getMasteryByStage([null, undefined, 42, a({ stageId: 's1' })]);
    expect(Object.keys(out)).toEqual(['s1']);
  });
});

// ── Accuracy by mode ─────────────────────────────────────────────────────

describe('getAccuracyByMode', () => {
  it('rolls up per-mode counts and accuracy', () => {
    const out = getAccuracyByMode([
      a({ mode: 'soundMatch', correct: true }),
      a({ mode: 'soundMatch', correct: false }),
      a({ mode: 'blendBuilder', correct: true }),
    ]);
    expect(out.soundMatch.attempts).toBe(2);
    expect(out.soundMatch.accuracy).toBe(0.5);
    expect(out.blendBuilder.accuracy).toBe(1);
  });

  it('lumps missing mode under "unknown"', () => {
    const out = getAccuracyByMode([{ correct: true }, { correct: false }]);
    expect(out.unknown.attempts).toBe(2);
  });
});

// ── Strongest / weakest sounds ───────────────────────────────────────────

describe('getStrongestSounds / getWeakestSounds', () => {
  const stream = [
    ...Array.from({ length: 8 }, () => a({ targetSound: '/ă/', correct: true })),
    ...Array.from({ length: 4 }, () => a({ targetSound: '/ĕ/', correct: true })),
    ...Array.from({ length: 4 }, () => a({ targetSound: '/ĕ/', correct: false })),
    a({ targetSound: '/ŏ/', correct: true }),
    a({ targetSound: '/ŏ/', correct: true }),
    // 2 attempts only — filtered out by the min-3-attempts guard
  ];

  it('returns sounds with at least 3 attempts ordered by accuracy', () => {
    const top = getStrongestSounds(stream, { topN: 2 });
    expect(top[0].sound).toBe('/ă/');
    expect(top[0].accuracy).toBe(1);
    expect(top.find((r) => r.sound === '/ŏ/')).toBeUndefined();
  });

  it('weakest mirrors strongest with ascending order', () => {
    const bottom = getWeakestSounds(stream, { topN: 2 });
    expect(bottom[0].sound).toBe('/ĕ/');
    expect(bottom[0].accuracy).toBe(0.5);
  });
});

// ── Common error types ──────────────────────────────────────────────────

describe('getCommonErrorTypes', () => {
  it('counts and sorts wrong-attempt errorCategories desc', () => {
    const stream = [
      a({ correct: false, errorCategory: 'vowel-confusion' }),
      a({ correct: false, errorCategory: 'vowel-confusion' }),
      a({ correct: false, errorCategory: 'digraph-confusion' }),
      a({ correct: true, errorCategory: 'should-be-ignored' }),
    ];
    const out = getCommonErrorTypes(stream);
    expect(out).toEqual([
      { category: 'vowel-confusion', count: 2 },
      { category: 'digraph-confusion', count: 1 },
    ]);
  });
});

// ── Attempts over time ─────────────────────────────────────────────────

describe('getAttemptsOverTime', () => {
  // Audit 2026-09-19, finding 23: this fixture used Date.UTC for both `now`
  // and the attempts. Buckets are learner-local, so in any non-UTC zone the
  // two landed on different local calendar days and the test failed for
  // reasons that had nothing to do with the logic — which is exactly how the
  // real defect stayed hidden in a UTC CI box. Local construction states the
  // intended timezone: these are all "the same local day the child practised".
  const localNoon = (y, m, d, h = 12) => new Date(y, m, d, h, 0, 0, 0).getTime();

  it('buckets attempts into days and pads missing days', () => {
    const now = localNoon(2026, 4, 19);
    const out = getAttemptsOverTime(
      [
        a({ timestamp: localNoon(2026, 4, 19, 10) }),
        a({ timestamp: localNoon(2026, 4, 19, 12), correct: false }),
        a({ timestamp: localNoon(2026, 4, 17, 10) }),
      ],
      { historyDays: 5, now },
    );
    expect(out).toHaveLength(5);
    // Last bucket should be 2 today, second-from-last should be 0 (the 18th),
    // and third-from-last should be 1 (the 17th).
    expect(out[out.length - 1].attempts).toBe(2);
    expect(out[out.length - 1].correct).toBe(1);
    expect(out[out.length - 2].attempts).toBe(0);
    expect(out[out.length - 3].attempts).toBe(1);
  });

  it('labels each bucket with the local calendar date, not the UTC one', () => {
    // The defect itself. _isoDay took local midnight and ran toISOString on
    // it: in Singapore local midnight on the 21st is 16:00 UTC on the 20th, so
    // "today" on a parent's chart was labelled yesterday.
    const now = localNoon(2026, 4, 19);
    const out = getAttemptsOverTime([], { historyDays: 1, now });

    const d = new Date(now);
    const expected = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate(),
    ).padStart(2, '0')}`;

    expect(out[0].date).toBe(expected);
  });

  it('advances one calendar day at a time, including across a DST boundary', () => {
    // Subtracting fixed 24-hour blocks skips or repeats a date wherever a local
    // day is 23 or 25 hours. Late March covers the northern DST change; the
    // assertion holds in every zone because it checks the sequence, not values.
    const out = getAttemptsOverTime([], { historyDays: 10, now: localNoon(2026, 2, 31) });

    expect(out).toHaveLength(10);
    expect(new Set(out.map((b) => b.date)).size).toBe(10); // no repeats

    for (let i = 1; i < out.length; i++) {
      const prev = new Date(`${out[i - 1].date}T00:00:00Z`);
      const cur = new Date(`${out[i].date}T00:00:00Z`);
      const gapDays = Math.round((cur - prev) / 86400000);
      expect(gapDays, `${out[i - 1].date} → ${out[i].date}`).toBe(1);
    }
  });

  it('puts an attempt from late evening on that same local day', () => {
    // 23:30 local is the case that flips to tomorrow under a UTC label east of
    // Greenwich, and to yesterday west of it.
    const now = localNoon(2026, 4, 19);
    const out = getAttemptsOverTime([a({ timestamp: localNoon(2026, 4, 19, 23) })], {
      historyDays: 3,
      now,
    });

    expect(out[out.length - 1].attempts).toBe(1);
  });
});

// ── Phase + suggested next ──────────────────────────────────────────────

describe('getCurrentPhase / getSuggestedNext / getMasteryPercent', () => {
  it('returns phase 1 with no attempts', () => {
    expect(getCurrentPhase([], TINY)).toBe(1);
    expect(getSuggestedNext([], TINY)?.id).toBe('s1');
    expect(getMasteryPercent([], TINY)).toBe(0);
  });

  it('advances when s1 is mastered', () => {
    const six = Array.from({ length: 6 }, () => a({ stageId: 's1', correct: true }));
    expect(getCurrentPhase(six, TINY)).toBe(1); // s2 still not mastered, also phase 1
    expect(getSuggestedNext(six, TINY)?.id).toBe('s2');
  });

  it('reports phase 2 when all phase-1 stages are mastered', () => {
    const stream = [
      ...Array.from({ length: 6 }, () => a({ stageId: 's1', correct: true })),
      ...Array.from({ length: 6 }, () => a({ stageId: 's2', correct: true })),
    ];
    expect(getCurrentPhase(stream, TINY)).toBe(2);
    expect(getSuggestedNext(stream, TINY)?.id).toBe('s3');
    expect(getMasteryPercent(stream, TINY)).toBe(67); // 2/3 mastered
  });
});

// ── Printable practice list ────────────────────────────────────────────

describe('getPrintablePracticeList', () => {
  it('lists weakest stages first with their sample words and a sentence', () => {
    const stream = [
      ...Array.from({ length: 6 }, () => a({ stageId: 's1', correct: true })),
      a({ stageId: 's2', correct: false }),
      a({ stageId: 's2', correct: false }),
      a({ stageId: 's2', correct: true }),
    ];
    const out = getPrintablePracticeList(stream, TINY, { topN: 2 });
    expect(out[0].stage.id).toBe('s2');
    expect(out[0].sampleWords).toContain('bed');
    expect(out[0].sentence).toMatch(/red/);
  });

  it('falls back to the first N curriculum stages when no attempts exist', () => {
    const out = getPrintablePracticeList([], TINY, { topN: 2 });
    expect(out.map((o) => o.stage.id)).toEqual(['s1', 's2']);
  });
});

// ── summarise() against the real curriculum ──────────────────────────────

describe('summarise (integration with the real curriculum)', () => {
  it('produces a complete dashboard payload', () => {
    const stream = [
      ...Array.from({ length: 6 }, () =>
        a({ stageId: 'cvc-a', mode: 'soundMatch', correct: true }),
      ),
      a({ stageId: 'cvc-a', mode: 'blendBuilder', correct: false, errorCategory: 'out-of-order' }),
    ];
    const out = summarise(stream, { curriculum: CURRICULUM, now: Date.UTC(2026, 4, 19) });
    expect(out.totalAttempts).toBe(7);
    expect(out.correctAttempts).toBe(6);
    expect(out.currentPhase).toBeGreaterThanOrEqual(1);
    expect(out.suggestedNext).not.toBeNull();
    expect(out.suggestedNext.id).toMatch(/^cvc-|^ccvc-|^cvcc-/); // first unmastered
    expect(Object.keys(out.accuracyByMode)).toEqual(
      expect.arrayContaining(['soundMatch', 'blendBuilder']),
    );
    expect(out.attemptsOverTime.length).toBeGreaterThan(0);
    expect(out.commonErrorTypes[0]?.category).toBe('out-of-order');
    expect(Array.isArray(out.printablePracticeList)).toBe(true);
    expect(out.printablePracticeList.length).toBeGreaterThan(0);
  });
});

// ── localStorage wrapper ────────────────────────────────────────────────

describe('attemptLog (localStorage wrapper)', () => {
  function makeMemoryStorage() {
    let map = new Map();
    return {
      getItem(k) {
        return map.has(k) ? map.get(k) : null;
      },
      setItem(k, v) {
        map.set(k, String(v));
      },
      removeItem(k) {
        map.delete(k);
      },
      clear() {
        map = new Map();
      },
    };
  }

  it('pushes attempts and lists them back', () => {
    const log = attemptLog(makeMemoryStorage());
    log.push(a({ stageId: 's1', correct: true }));
    log.push(a({ stageId: 's2', correct: false }));
    expect(log.list()).toHaveLength(2);
    expect(log.list()[1].stageId).toBe('s2');
  });

  it('clear() empties the log', () => {
    const log = attemptLog(makeMemoryStorage());
    log.push(a());
    log.clear();
    expect(log.list()).toEqual([]);
  });

  it('survives a corrupt storage payload', () => {
    const storage = makeMemoryStorage();
    storage.setItem('phonicsquest_attempts', 'not json');
    const log = attemptLog(storage);
    expect(log.list()).toEqual([]);
    log.push(a()); // should not throw
    expect(log.list()).toHaveLength(1);
  });

  it('caps stored attempts to prevent localStorage bloat', () => {
    const log = attemptLog(makeMemoryStorage(), { maxStored: 50 });
    for (let i = 0; i < 80; i++) log.push(a({ word: `w${i}` }));
    expect(log.list().length).toBe(50);
    // Oldest entries are dropped first.
    expect(log.list()[0].word).toBe('w30');
  });
});
