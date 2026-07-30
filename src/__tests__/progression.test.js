/**
 * Strict progression gate (architecture review item #3).
 *
 * The legacy unlock rule was "prereq accuracy ≥ 70%". These tests cover the
 * new five-criterion gate (decoding ≥85%, spelling ≥80%, ≥12 unique words,
 * ≥2 session days, no major vowel confusion), the graceful-degradation
 * path when a snapshot lacks some data, and the dashboard-facing
 * explainLockReason helper.
 */
import { describe, it, expect } from 'vitest';
import {
  PROGRESSION_GATE,
  getStageReadiness,
  getUnlockedStages,
  getRecommendedStage,
  explainLockReason,
} from '../modules/progression.js';
import { CURRICULUM } from '../data/curriculum.js';

// ── Test fixture builders ───────────────────────────────────────────────────

/**
 * Build wordSkillStats for a list of word IDs at a target accuracy and
 * attempt count. Per-word stats look like the production shape so the
 * production helpers don't need a special test path.
 */
function seedSkillStats(wordIds, skill, attempts, accuracy) {
  const stats = {};
  for (const id of wordIds) {
    const correct = Math.round(attempts * accuracy);
    stats[id] = { [skill]: { attempts, correct, lastSeen: '2026-05-01T00:00:00Z' } };
  }
  return stats;
}

function seedWordStats(wordIds, attemptsEach = 1) {
  const stats = {};
  for (const id of wordIds) stats[id] = { attempts: attemptsEach, correct: attemptsEach };
  return stats;
}

function seedLearningEvents(wordIds, days /* string[] like ['2026-05-01','2026-05-02'] */) {
  return days.flatMap((day) =>
    wordIds.map((id) => ({
      eventType: 'word_attempt',
      skill: 'decoding',
      correct: true,
      meta: { wordId: id, mode: 'blend' },
      timestamp: `${day}T10:00:00Z`,
    })),
  );
}

const CVCA_WORDS = [
  'cat',
  'hat',
  'bat',
  'mat',
  'sat',
  'rat',
  'can',
  'fan',
  'man',
  'pan',
  'ran',
  'van',
  'bag',
  'tag',
  'cap',
  'map',
];

// ── PROGRESSION_GATE constants ──────────────────────────────────────────────

describe('PROGRESSION_GATE thresholds', () => {
  it('is stricter than the legacy 70% rule', () => {
    expect(PROGRESSION_GATE.MIN_DECODING_ACCURACY).toBeGreaterThan(0.7);
    expect(PROGRESSION_GATE.MIN_DECODING_ACCURACY).toBe(0.85);
    expect(PROGRESSION_GATE.MIN_SPELLING_ACCURACY).toBe(0.8);
  });

  it('requires multi-session, multi-word evidence', () => {
    expect(PROGRESSION_GATE.MIN_UNIQUE_WORDS).toBeGreaterThanOrEqual(10);
    expect(PROGRESSION_GATE.MIN_SESSION_DAYS).toBeGreaterThanOrEqual(2);
  });
});

// ── Decoding accuracy check ─────────────────────────────────────────────────

describe('decoding-accuracy check', () => {
  it('passes when per-skill decoding accuracy ≥ 85% over ≥ MIN_DECODING_ATTEMPTS', () => {
    const snapshot = {
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 2, 0.9),
      groupMastery: { 'cvc-a': 0.9 },
      wordStats: seedWordStats(CVCA_WORDS, 2),
      learningEvents: seedLearningEvents(CVCA_WORDS.slice(0, 8), ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.decodingAccuracy.pass).toBe(true);
    expect(checks.decodingAccuracy.actual).toBeGreaterThanOrEqual(0.85);
  });

  it('fails when decoding accuracy is below 85%', () => {
    const snapshot = {
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.75),
      groupMastery: { 'cvc-a': 0.75 },
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const { unlocked, checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.decodingAccuracy.pass).toBe(false);
    expect(checks.decodingAccuracy.actual).toBeCloseTo(0.75, 1);
    expect(unlocked).toBe(false); // gate composite
  });

  it('falls back to cross-skill groupMastery when wordSkillStats is empty', () => {
    const snapshot = {
      wordSkillStats: {}, // no per-skill data
      groupMastery: { 'cvc-a': 0.92 },
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.decodingAccuracy.pass).toBe(true);
    expect(checks.decodingAccuracy.fallback).toBe('cross-skill');
  });

  it('fails with no-decoding-data when neither source has anything for the prereq', () => {
    const snapshot = { groupMastery: {}, wordSkillStats: {}, wordStats: {}, learningEvents: [] };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.decodingAccuracy.pass).toBe(false);
    expect(checks.decodingAccuracy.reason).toBe('no-decoding-data');
  });
});

// ── Spelling accuracy check ─────────────────────────────────────────────────

describe('spelling-accuracy check', () => {
  it("passes as 'no-data' when wordSkillStats is missing (sparse spelling practice)", () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92 },
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.spellingAccuracy.pass).toBe(true);
    expect(checks.spellingAccuracy.reason).toBe('no-data');
  });

  it("passes as 'insufficient-spelling-data' when spelling attempts < MIN_SPELLING_ATTEMPTS", () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92 },
      wordStats: seedWordStats(CVCA_WORDS, 4),
      wordSkillStats: seedSkillStats(CVCA_WORDS.slice(0, 2), 'spelling', 1, 0.5),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.spellingAccuracy.pass).toBe(true);
    expect(checks.spellingAccuracy.reason).toBe('insufficient-spelling-data');
  });

  it('fails when spelling accuracy is below 80% with enough data', () => {
    // 4 words × 5 attempts × 0.60 accuracy → 3/5 correct each, exact 60%
    const spellingStats = seedSkillStats(CVCA_WORDS.slice(0, 4), 'spelling', 5, 0.6);
    const decodingStats = seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95);
    // Merge per-word so each word has both decoding and spelling sub-keys.
    const merged = {};
    for (const id of CVCA_WORDS)
      merged[id] = { ...(decodingStats[id] || {}), ...(spellingStats[id] || {}) };
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92 },
      wordStats: seedWordStats(CVCA_WORDS, 4),
      wordSkillStats: merged,
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.spellingAccuracy.pass).toBe(false);
    expect(checks.spellingAccuracy.actual).toBeCloseTo(0.6, 2);
  });
});

// ── Unique-word check ───────────────────────────────────────────────────────

describe('unique-word check', () => {
  it('fails when fewer than 12 unique words have been attempted in the prereq group', () => {
    const fewWords = CVCA_WORDS.slice(0, 5);
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92 },
      wordSkillStats: seedSkillStats(fewWords, 'decoding', 4, 0.95),
      wordStats: seedWordStats(fewWords, 4),
      learningEvents: seedLearningEvents(fewWords, ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.uniqueWords.pass).toBe(false);
    expect(checks.uniqueWords.actual).toBe(5);
    expect(checks.uniqueWords.required).toBe(12);
  });

  it('passes when ≥ 12 unique words have been attempted', () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.uniqueWords.pass).toBe(true);
    expect(checks.uniqueWords.actual).toBeGreaterThanOrEqual(12);
  });
});

// ── Session-day check ───────────────────────────────────────────────────────

describe('session-day check', () => {
  it('fails when all practice was on a single day', () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.sessionDays.pass).toBe(false);
    expect(checks.sessionDays.actual).toBe(1);
  });

  it('passes when practice is spread across ≥ 2 calendar days', () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-03']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.sessionDays.pass).toBe(true);
    expect(checks.sessionDays.actual).toBe(2);
  });

  it("passes as 'no-data' when learningEvents is empty (legacy data)", () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: [],
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.sessionDays.pass).toBe(true);
    expect(checks.sessionDays.reason).toBe('no-data');
  });
});

// ── Vowel-confusion check ───────────────────────────────────────────────────

describe('vowel-confusion check', () => {
  it('flags a vowel-specific weakness when prereq is > 20 pts below sibling median', () => {
    const snapshot = {
      // cvc-a is 0.65 while cvc-e/i/o/u are all ~0.90 → 25 pt gap → flag
      groupMastery: { 'cvc-a': 0.65, 'cvc-e': 0.9, 'cvc-i': 0.9, 'cvc-o': 0.9, 'cvc-u': 0.9 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.vowelConfusion.pass).toBe(false);
    expect(checks.vowelConfusion.reason).toBe('vowel-specific-weakness');
  });

  it('passes when prereq is within the normal range of siblings', () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92, 'cvc-e': 0.88, 'cvc-i': 0.91, 'cvc-o': 0.9, 'cvc-u': 0.89 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const { checks } = getStageReadiness('cvc-e', snapshot);
    expect(checks.vowelConfusion.pass).toBe(true);
  });

  it('is not applicable for non-structural-vowel stages (e.g. digraphs, long-a-ae)', () => {
    // Use long-a-ai which has prereq long-a-ae (a long-vowel micro-stage, not cvc-*)
    const snapshot = { groupMastery: { 'long-a-ae': 0.65 } };
    const { checks } = getStageReadiness('long-a-ai', snapshot);
    expect(checks.vowelConfusion.pass).toBe(true);
    expect(checks.vowelConfusion.reason).toBe('not-applicable');
  });
});

// ── Composite gate behaviour ────────────────────────────────────────────────

describe('combined readiness gate', () => {
  it('unlocks only when ALL five criteria pass', () => {
    const happy = {
      groupMastery: { 'cvc-a': 0.92, 'cvc-e': 0.88, 'cvc-i': 0.91, 'cvc-o': 0.9, 'cvc-u': 0.89 },
      wordSkillStats: {
        ...seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
        ...seedSkillStats(CVCA_WORDS.slice(0, 6), 'spelling', 2, 0.9),
      },
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    expect(getStageReadiness('cvc-e', happy).unlocked).toBe(true);
  });

  it('a single failing criterion blocks unlock', () => {
    // Same as happy path but only 1 session day.
    const oneDay = {
      groupMastery: { 'cvc-a': 0.92, 'cvc-e': 0.88, 'cvc-i': 0.91, 'cvc-o': 0.9, 'cvc-u': 0.89 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01']),
    };
    expect(getStageReadiness('cvc-e', oneDay).unlocked).toBe(false);
  });

  it('root stages (no prerequisite) are always unlocked', () => {
    const { unlocked } = getStageReadiness('cvc-a', {});
    expect(unlocked).toBe(true);
  });
});

// ── Chain walk ──────────────────────────────────────────────────────────────

describe('getUnlockedStages', () => {
  it("only the root stage is unlocked when there's no progress data", () => {
    const unlocked = getUnlockedStages({
      groupMastery: {},
      wordSkillStats: {},
      wordStats: {},
      learningEvents: [],
    });
    expect(unlocked).toEqual(['cvc-a']);
  });

  it('unlocks the next stage when the prereq passes the strict gate', () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.92, 'cvc-e': 0.88, 'cvc-i': 0.91, 'cvc-o': 0.9, 'cvc-u': 0.89 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const unlocked = getUnlockedStages(snapshot);
    expect(unlocked).toContain('cvc-a');
    expect(unlocked).toContain('cvc-e');
    expect(unlocked).not.toContain('cvc-i'); // cvc-e hasn't been practised yet
  });

  it('a learner who only crammed once (1 session) cannot advance even at 100% accuracy', () => {
    // Direct regression for the review motivation: prevents "binge then advance"
    const snapshot = {
      groupMastery: { 'cvc-a': 1.0, 'cvc-e': 0.9, 'cvc-i': 0.9, 'cvc-o': 0.9, 'cvc-u': 0.9 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 1.0),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01']), // 1 day only
    };
    expect(getUnlockedStages(snapshot)).not.toContain('cvc-e');
  });
});

// ── Recommendation ──────────────────────────────────────────────────────────

describe('getRecommendedStage', () => {
  it('returns the first unlocked stage the learner has not yet mastered', () => {
    const snapshot = {
      // cvc-a is mastered, cvc-e is unlocked but not mastered
      groupMastery: { 'cvc-a': 0.95, 'cvc-e': 0.4, 'cvc-i': 0.4, 'cvc-o': 0.4, 'cvc-u': 0.4 },
      wordSkillStats: seedSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS, 4),
      learningEvents: seedLearningEvents(CVCA_WORDS, ['2026-05-01', '2026-05-02']),
    };
    const stage = getRecommendedStage(snapshot);
    expect(stage?.id).toBe('cvc-e');
  });
});

// ── explainLockReason ──────────────────────────────────────────────────────

describe('explainLockReason', () => {
  it('returns null for an unlocked stage', () => {
    expect(explainLockReason('cvc-a', {})).toBeNull();
  });

  it('summarises every failing check for a locked stage', () => {
    const snapshot = {
      groupMastery: { 'cvc-a': 0.5 }, // below decoding threshold
      wordStats: seedWordStats(CVCA_WORDS.slice(0, 3), 4), // not enough unique words
      learningEvents: seedLearningEvents(CVCA_WORDS.slice(0, 3), ['2026-05-01']), // 1 day
      wordSkillStats: {},
    };
    const reason = explainLockReason('cvc-e', snapshot);
    expect(reason).toBeTruthy();
    expect(reason).toMatch(/Decoding/i);
    expect(reason).toMatch(/sessions|words/i);
  });
});

// ── CURRICULUM integration ──────────────────────────────────────────────────

describe('curriculum integration', () => {
  it('every CURRICULUM stage with a prerequisite resolves through the gate without throwing', () => {
    const snapshot = { groupMastery: {}, wordStats: {}, wordSkillStats: {}, learningEvents: [] };
    for (const stage of CURRICULUM) {
      if (!stage.prerequisite) continue;
      expect(() => getStageReadiness(stage.id, snapshot)).not.toThrow();
    }
  });
});

// ── Mastery levels: "may advance" vs "has demonstrated" ─────────────────────

/**
 * Like seedSkillStats, but the attempts are INDEPENDENT — no hint, no model,
 * no audio supplying the answer. Only these count towards a mastery claim.
 */
function seedIndependentSkillStats(wordIds, skill, attempts, accuracy) {
  const stats = {};
  for (const id of wordIds) {
    const correct = Math.round(attempts * accuracy);
    stats[id] = {
      [skill]: {
        attempts,
        correct,
        independentAttempts: attempts,
        independentCorrect: correct,
        lastSeen: '2026-05-01T00:00:00Z',
      },
    };
  }
  return stats;
}

/** Merge two wordSkillStats maps (different skills on the same words). */
function mergeSkillStats(a, b) {
  const out = { ...a };
  for (const [id, skills] of Object.entries(b)) out[id] = { ...(out[id] || {}), ...skills };
  return out;
}

describe('mastery level separates advancing from demonstrating', () => {
  const NEXT_STAGE = CURRICULUM.find((s) => s.prerequisite)?.id;
  const DAYS = ['2026-05-01', '2026-05-02'];

  it('reports ready-to-explore when the stage unlocks on thin evidence', () => {
    // Passes every criterion, but has no encoding data at all.
    const r = getStageReadiness(NEXT_STAGE, {
      groupMastery: { 'cvc-a': 0.92 },
      wordSkillStats: seedIndependentSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS),
      learningEvents: seedLearningEvents(CVCA_WORDS, DAYS),
    });

    expect(r.unlocked).toBe(true);
    expect(r.masteryLevel).toBe('ready-to-explore');
    expect(r.provisional).toBe(true);
    expect(r.checks.spellingAccuracy.provisional).toBe(true);
  });

  it('reports mastered only once encoding evidence exists too', () => {
    const r = getStageReadiness(NEXT_STAGE, {
      // Sibling vowels present, so the vowel-confusion check has something
      // to compare against and isn't itself provisional.
      groupMastery: { 'cvc-a': 0.92, 'cvc-e': 0.9, 'cvc-i': 0.88 },
      wordSkillStats: mergeSkillStats(
        seedIndependentSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
        seedSkillStats(CVCA_WORDS, 'spelling', 3, 0.9),
      ),
      wordStats: seedWordStats(CVCA_WORDS),
      learningEvents: seedLearningEvents(CVCA_WORDS, DAYS),
    });

    expect(r.unlocked).toBe(true);
    expect(r.masteryLevel).toBe('mastered');
    expect(r.provisional).toBe(false);
  });

  it('never reports mastered on self-reported decoding alone', () => {
    // The exact shape a child produces by tapping "Yes! ✓" through Blend It!:
    // plenty of attempts, none of them independent.
    const r = getStageReadiness(NEXT_STAGE, {
      groupMastery: { 'cvc-a': 0.98 },
      wordSkillStats: mergeSkillStats(
        seedSkillStats(CVCA_WORDS, 'decoding', 6, 1.0),
        seedSkillStats(CVCA_WORDS, 'spelling', 3, 1.0),
      ),
      wordStats: seedWordStats(CVCA_WORDS, 6),
      learningEvents: seedLearningEvents(CVCA_WORDS, DAYS),
    });

    // Still advances — nobody gets locked out mid-journey…
    expect(r.unlocked).toBe(true);
    // …but the grown-up view must not call this mastery.
    expect(r.masteryLevel).toBe('ready-to-explore');
    expect(r.checks.decodingAccuracy.provisional).toBe(true);
    expect(r.checks.decodingAccuracy.fallback).toBe('cross-skill');
    expect(r.independentAttempts).toBe(0);
    expect(r.confidence).toBe('none');
  });

  it('carries the independent sample size and its confidence band', () => {
    const r = getStageReadiness(NEXT_STAGE, {
      groupMastery: { 'cvc-a': 0.92 },
      wordSkillStats: seedIndependentSkillStats(CVCA_WORDS, 'decoding', 4, 0.95),
      wordStats: seedWordStats(CVCA_WORDS),
      learningEvents: seedLearningEvents(CVCA_WORDS, DAYS),
    });
    expect(r.independentAttempts).toBe(CVCA_WORDS.length * 4);
    expect(r.confidence).toBe('high');
  });

  it('does not claim mastery for a root stage that is simply open', () => {
    const root = CURRICULUM.find((s) => !s.prerequisite)?.id;
    const r = getStageReadiness(root, {});
    expect(r.unlocked).toBe(true);
    expect(r.masteryLevel).toBe('ready-to-explore');
  });
});
