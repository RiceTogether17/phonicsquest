/**
 * PhonicsQuest – Progression Gate (architecture review item #3)
 *
 * The legacy `getUnlockedStages` in curriculum.js had one rule:
 *   "if the prerequisite group's accuracy is ≥ 70%, unlock the next stage."
 *
 * 70% across one accuracy figure is too lenient for early reading. A
 * weak reader can squeak past CVC short-A at 71% by guessing on three of
 * ten words, then immediately get stuck in blends because their decoding
 * isn't actually secure. The architecture review prescribed a much
 * stricter, multi-criterion gate. This module is that gate.
 *
 * A stage is "ready to unlock" when the prerequisite passes ALL of:
 *
 *   1. Decoding accuracy ≥ 85% over the prereq group's words, measured on
 *      INDEPENDENT attempts only (see modules/evidence.js) — answers the
 *      app modelled or hinted don't count towards it.
 *   2. Spelling/encoding accuracy ≥ 80% — only enforced once the child
 *      has at least MIN_SPELLING_ATTEMPTS data points; before that it
 *      passes as "no-data" so a child who has never seen spelling mode
 *      can still progress.
 *   3. At least 12 unique words attempted in the prereq group (capped
 *      by group size — small groups with < 12 total words use 75% of
 *      what's available so the gate is reachable).
 *   4. Practice on at least 2 separate calendar days — prevents "binge
 *      then advance" patterns where the child crams a stage in one
 *      session and forgets it by tomorrow.
 *   5. No major vowel confusion — applies only to short-vowel structural
 *      stages (cvc-X / ccvc-X / cvcc-X / ccvcc-X). If the prereq's
 *      accuracy is more than 20 points below the median of its sibling
 *      vowels, the child has a specific vowel weakness to address.
 *
 * Snapshots can be partial: any data the snapshot doesn't carry causes
 * that check to pass with reason 'no-data'. This keeps the gate working
 * on partially-migrated installs and lets tests target one criterion at
 * a time.
 *
 * Those permissive passes are now also marked `provisional: true`, and any
 * provisional check caps the result at `ready-to-explore` instead of
 * `mastered`. The gate deliberately does not tighten who may advance — it
 * separates "may advance" from "has demonstrated", so a stage unlocked on
 * thin evidence stops being reported to parents as mastered.
 */
import { CURRICULUM } from '../data/curriculum.js';
import { getTrickyWordsForPhase } from '../data/trickyWords.js';
import { store } from './store.js';
import { progress } from './progress.js';
import { isTeacherUnlockActive } from './teacherUnlock.js';
import { confidenceFor } from './evidence.js';

// ── Public configuration ────────────────────────────────────────────────────

export const PROGRESSION_GATE = Object.freeze({
  MIN_DECODING_ACCURACY: 0.85,
  MIN_SPELLING_ACCURACY: 0.8,
  MIN_UNIQUE_WORDS: 12,
  MIN_SESSION_DAYS: 2,
  MIN_SPELLING_ATTEMPTS: 6, // before we have this many spelling attempts, treat as no-data
  MIN_DECODING_ATTEMPTS: 6, // need at least this many decoding attempts to judge
  MAX_VOWEL_CONFUSION_GAP: 0.2, // prereq accuracy must not be more than 20 pts below sibling-median
  GROUP_SIZE_FRACTION: 0.75, // small groups: required unique = min(MIN_UNIQUE_WORDS, floor(size * this))
});

const STRUCTURAL_VOWEL_RE = /^(cvc|ccvc|cvcc|ccvcc)-([aeiou])$/;

// ── Snapshot builder ────────────────────────────────────────────────────────

/**
 * Build a progression snapshot from the live store. Tests can construct
 * partial snapshots directly; production code uses this convenience.
 * @returns {ProgressionSnapshot}
 */
export function buildProgressionSnapshot() {
  return {
    groupMastery: store.get('groupMastery') || {},
    wordStats: store.get('wordStats') || {},
    wordSkillStats: store.get('wordSkillStats') || {},
    learningEvents: store.get('learningEvents') || [],
  };
}

// ── Internal helpers ────────────────────────────────────────────────────────

function _wordsInGroup(groupKey) {
  // Use the progress singleton's group filter so the structural-vowel,
  // long-vowel-micro, and dip-X selectors all resolve correctly.
  return progress.getWordsInGroup(groupKey);
}

/**
 * Sum attempts/correct across a set of words.
 *
 * `independentOnly` reads the per-skill `independentAttempts` /
 * `independentCorrect` counters written by store.recordWordSkillAttempt, so
 * a stage cannot be judged on answers the app supplied. Records written
 * before evidence tracking have no independent counters, which is the point:
 * they backfill as `guided` and fall through to the cross-skill path below.
 */
function _accuracyOver(stats, wordIds, skill = null, independentOnly = false) {
  let attempts = 0,
    correct = 0;
  for (const id of wordIds) {
    const s = skill ? stats?.[id]?.[skill] : stats?.[id];
    if (!s) continue;
    const a = independentOnly ? s.independentAttempts || 0 : s.attempts || 0;
    if (!a) continue;
    attempts += a;
    correct += independentOnly ? s.independentCorrect || 0 : s.correct || 0;
  }
  return { attempts, correct, accuracy: attempts > 0 ? correct / attempts : null };
}

function _checkDecodingAccuracy(prereqStage, snapshot) {
  const wordIds = _wordsInGroup(prereqStage.group).map((w) => w.id);
  // Prefer INDEPENDENT per-skill data: decoding the child did unaided.
  if (snapshot.wordSkillStats) {
    const skill = _accuracyOver(snapshot.wordSkillStats, wordIds, 'decoding', true);
    if (skill.attempts >= PROGRESSION_GATE.MIN_DECODING_ATTEMPTS) {
      const required = PROGRESSION_GATE.MIN_DECODING_ACCURACY;
      return {
        pass: skill.accuracy >= required,
        reason: skill.accuracy >= required ? 'meets-target' : 'below-decoding-target',
        actual: skill.accuracy,
        required,
        attempts: skill.attempts,
        independentAttempts: skill.attempts,
      };
    }
  }
  // Fall back to the cross-skill groupMastery. This is what keeps existing
  // learners — and children who have only played self-assessed modes — from
  // being locked out mid-journey. It is explicitly PROVISIONAL: it can
  // unlock the next stage, but it cannot support a mastery claim, because
  // nothing in it distinguishes decoding from a tap after a modelled blend.
  if (snapshot.groupMastery && typeof snapshot.groupMastery[prereqStage.group] === 'number') {
    const actual = snapshot.groupMastery[prereqStage.group];
    const required = PROGRESSION_GATE.MIN_DECODING_ACCURACY;
    return {
      pass: actual >= required,
      reason: actual >= required ? 'meets-target-cross-skill' : 'below-decoding-target',
      actual,
      required,
      fallback: 'cross-skill',
      provisional: true,
      independentAttempts: 0,
    };
  }
  return {
    pass: false,
    reason: 'no-decoding-data',
    required: PROGRESSION_GATE.MIN_DECODING_ACCURACY,
  };
}

function _checkSpellingAccuracy(prereqStage, snapshot) {
  const required = PROGRESSION_GATE.MIN_SPELLING_ACCURACY;
  if (!snapshot.wordSkillStats) {
    return { pass: true, reason: 'no-data', required, provisional: true };
  }
  const wordIds = _wordsInGroup(prereqStage.group).map((w) => w.id);
  const { attempts, accuracy } = _accuracyOver(snapshot.wordSkillStats, wordIds, 'spelling');
  if (attempts < PROGRESSION_GATE.MIN_SPELLING_ATTEMPTS) {
    // Still passes — a child who has never opened a spelling mode should not
    // be stuck — but flagged, so the stage reads "ready to explore" rather
    // than "mastered" until some encoding evidence exists.
    return {
      pass: true,
      reason: 'insufficient-spelling-data',
      attempts,
      required,
      provisional: true,
    };
  }
  return {
    pass: accuracy >= required,
    reason: accuracy >= required ? 'meets-target' : 'below-spelling-target',
    actual: accuracy,
    required,
    attempts,
  };
}

function _checkUniqueWords(prereqStage, snapshot) {
  if (!snapshot.wordStats) return { pass: true, reason: 'no-data', provisional: true };
  const groupWords = _wordsInGroup(prereqStage.group);
  const groupSize = groupWords.length;
  const baseRequired = PROGRESSION_GATE.MIN_UNIQUE_WORDS;
  const required = Math.min(
    baseRequired,
    Math.max(1, Math.floor(groupSize * PROGRESSION_GATE.GROUP_SIZE_FRACTION)),
  );
  let unique = 0;
  for (const w of groupWords) {
    const s = snapshot.wordStats[w.id];
    if (s && s.attempts > 0) unique++;
  }
  return {
    pass: unique >= required,
    reason: unique >= required ? 'meets-target' : 'too-few-unique-words',
    actual: unique,
    required,
    groupSize,
  };
}

function _checkSessionDays(prereqStage, snapshot) {
  const required = PROGRESSION_GATE.MIN_SESSION_DAYS;
  if (!Array.isArray(snapshot.learningEvents) || snapshot.learningEvents.length === 0) {
    // Note: learningEvents is the only IndexedDB-offloaded key, and is not
    // persisted at all when IndexedDB is unavailable (private browsing). So
    // this check can silently vanish — flag it rather than reporting a pass
    // as though the spacing requirement had been met.
    return { pass: true, reason: 'no-data', required, provisional: true };
  }
  const wordIds = new Set(_wordsInGroup(prereqStage.group).map((w) => w.id));
  const days = new Set();
  for (const e of snapshot.learningEvents) {
    if (e.eventType !== 'word_attempt') continue;
    if (!wordIds.has(e.meta?.wordId)) continue;
    if (!e.timestamp) continue;
    days.add(e.timestamp.slice(0, 10)); // YYYY-MM-DD
  }
  return {
    pass: days.size >= required,
    reason: days.size >= required ? 'meets-target' : 'too-few-session-days',
    actual: days.size,
    required,
  };
}

function _checkVowelConfusion(prereqStage, snapshot) {
  const match = STRUCTURAL_VOWEL_RE.exec(prereqStage.group);
  // Not a short-vowel stage — the check genuinely doesn't apply, so this is
  // a real pass rather than a gap in the evidence.
  if (!match) return { pass: true, reason: 'not-applicable' };
  const struct = match[1];
  const vowel = match[2];
  if (!snapshot.groupMastery) return { pass: true, reason: 'no-data', provisional: true };

  const myScore = snapshot.groupMastery[prereqStage.group];
  if (typeof myScore !== 'number') {
    return { pass: true, reason: 'no-data-for-prereq', provisional: true };
  }

  // Sibling vowel groups (same structure, different vowel).
  const siblings = ['a', 'e', 'i', 'o', 'u']
    .filter((v) => v !== vowel)
    .map((v) => snapshot.groupMastery[`${struct}-${v}`])
    .filter((s) => typeof s === 'number');

  if (siblings.length === 0) {
    return { pass: true, reason: 'no-sibling-data', provisional: true };
  }

  // Median of siblings — robust against one outlier. For an even count,
  // average the two central values (true median).
  const sorted = [...siblings].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const gap = median - myScore;
  const required = PROGRESSION_GATE.MAX_VOWEL_CONFUSION_GAP;
  return {
    pass: gap <= required,
    reason: gap <= required ? 'no-major-confusion' : 'vowel-specific-weakness',
    actual: gap,
    required,
    vowel,
    structure: struct,
    siblingMedian: median,
  };
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Mastery states a passing stage can be in.
 *
 * The distinction exists because "may move on" and "has proved it" are
 * different questions, and collapsing them is what let the dashboard report
 * mastery for stages backed only by modelled answers. A child is never
 * blocked from new learning for want of encoding evidence — but the grown-up
 * view should not claim mastery until that evidence exists.
 */
export const MASTERY_LEVEL = Object.freeze({
  /** Gate passed, but on provisional evidence (no independent decoding data,
   *  no encoding data, or a criterion that silently had nothing to check). */
  READY_TO_EXPLORE: 'ready-to-explore',
  /** Every criterion passed on real, independent evidence. */
  MASTERED: 'mastered',
  /** Gate not passed. */
  NOT_READY: 'not-ready',
});

/**
 * Run the five-criterion readiness gate for one stage.
 *
 * @param {string} stageId
 * @param {ProgressionSnapshot} snapshot
 * @returns {{
 *   unlocked: boolean,
 *   masteryLevel: string,
 *   provisional: boolean,
 *   confidence: 'none'|'low'|'moderate'|'high',
 *   independentAttempts: number,
 *   checks: Record<string, object>,
 *   stage: object|null,
 * }}
 */
export function getStageReadiness(stageId, snapshot = {}) {
  const stage = CURRICULUM.find((s) => s.id === stageId);
  if (!stage) {
    return {
      unlocked: false,
      stage: null,
      masteryLevel: MASTERY_LEVEL.NOT_READY,
      provisional: true,
      confidence: 'none',
      independentAttempts: 0,
      checks: { stage: { pass: false, reason: 'unknown-stage' } },
    };
  }
  if (!stage.prerequisite) {
    // A root stage is open by definition — that says nothing about mastery.
    return {
      unlocked: true,
      stage,
      masteryLevel: MASTERY_LEVEL.READY_TO_EXPLORE,
      provisional: true,
      confidence: 'none',
      independentAttempts: 0,
      checks: { rootStage: { pass: true, reason: 'no-prerequisite' } },
    };
  }
  const prereq = CURRICULUM.find((s) => s.id === stage.prerequisite);
  if (!prereq) {
    return {
      unlocked: false,
      stage,
      masteryLevel: MASTERY_LEVEL.NOT_READY,
      provisional: true,
      confidence: 'none',
      independentAttempts: 0,
      checks: { prereq: { pass: false, reason: 'missing-prereq-definition' } },
    };
  }

  const checks = {
    decodingAccuracy: _checkDecodingAccuracy(prereq, snapshot),
    spellingAccuracy: _checkSpellingAccuracy(prereq, snapshot),
    uniqueWords: _checkUniqueWords(prereq, snapshot),
    sessionDays: _checkSessionDays(prereq, snapshot),
    vowelConfusion: _checkVowelConfusion(prereq, snapshot),
  };
  const values = Object.values(checks);
  const unlocked = values.every((c) => c.pass);
  const provisional = values.some((c) => c.provisional);
  const independentAttempts = checks.decodingAccuracy.independentAttempts || 0;

  const masteryLevel = !unlocked
    ? MASTERY_LEVEL.NOT_READY
    : provisional
      ? MASTERY_LEVEL.READY_TO_EXPLORE
      : MASTERY_LEVEL.MASTERED;

  return {
    unlocked,
    masteryLevel,
    provisional,
    confidence: confidenceFor(independentAttempts),
    independentAttempts,
    stage,
    checks,
  };
}

/** Parent/teacher-facing label for a mastery level. */
export function masteryLevelLabel(level) {
  return (
    {
      [MASTERY_LEVEL.MASTERED]: 'Stage mastered',
      [MASTERY_LEVEL.READY_TO_EXPLORE]: 'Ready to explore the next stage',
      [MASTERY_LEVEL.NOT_READY]: 'Still building',
    }[level] || level
  );
}

/**
 * Walk CURRICULUM in order, unlocking each stage only when its prerequisite
 * passes the strict gate. Returns an array of unlocked stage ids — same
 * shape as the legacy curriculum.getUnlockedStages so callers can swap.
 * @param {ProgressionSnapshot} snapshot
 * @returns {string[]}
 */
export function getUnlockedStages(snapshot = buildProgressionSnapshot()) {
  // Teacher master unlock: every curriculum stage is available at once.
  if (isTeacherUnlockActive()) return CURRICULUM.map((s) => s.id);

  // Iterate to a fixpoint rather than assuming CURRICULUM is topologically
  // ordered: a stage defined before its prerequisite still unlocks once the
  // prerequisite does.
  const unlocked = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const stage of CURRICULUM) {
      if (unlocked.has(stage.id)) continue;
      if (stage.prerequisite && !unlocked.has(stage.prerequisite)) continue;
      const ok = !stage.prerequisite || getStageReadiness(stage.id, snapshot).unlocked;
      if (ok) {
        unlocked.add(stage.id);
        changed = true;
      }
    }
  }
  return CURRICULUM.filter((s) => unlocked.has(s.id)).map((s) => s.id);
}

/**
 * First unlocked stage the learner hasn't yet mastered, i.e. the recommended
 * next focus. Returns the last unlocked stage if everything is mastered.
 * @param {ProgressionSnapshot} snapshot
 * @returns {object|null}
 */
export function getRecommendedStage(snapshot = buildProgressionSnapshot()) {
  const unlocked = getUnlockedStages(snapshot);
  const gm = snapshot.groupMastery || {};
  for (const id of unlocked) {
    const stage = CURRICULUM.find((s) => s.id === id);
    const score = gm[stage.group] ?? 0;
    if (score < PROGRESSION_GATE.MIN_DECODING_ACCURACY) return stage;
  }
  const lastId = unlocked[unlocked.length - 1];
  return CURRICULUM.find((s) => s.id === lastId) ?? null;
}

/**
 * Human-readable reason for why a stage is locked, for the dashboard.
 * Returns null if the stage is unlocked or unknown.
 */
export function explainLockReason(stageId, snapshot = buildProgressionSnapshot()) {
  const { unlocked, checks } = getStageReadiness(stageId, snapshot);
  if (unlocked) return null;
  const labels = {
    decodingAccuracy: 'Decoding accuracy',
    spellingAccuracy: 'Spelling accuracy',
    uniqueWords: 'Variety of words practised',
    sessionDays: 'Spread over multiple sessions',
    vowelConfusion: 'Vowel-specific weakness',
  };
  const failed = Object.entries(checks).filter(([, c]) => !c.pass);
  if (failed.length === 0) return null;
  return failed
    .map(([key, c]) => {
      const label = labels[key] || key;
      // Count-based checks must format as counts, not percentages — check
      // these BEFORE the generic ratio branch (uniqueWords/sessionDays carry
      // actual/required as plain counts).
      if (c.reason === 'too-few-unique-words') return `${label}: ${c.actual}/${c.required} words`;
      if (c.reason === 'too-few-session-days')
        return `${label}: ${c.actual}/${c.required} sessions`;
      if (c.reason === 'no-decoding-data') return `${label}: practise this stage first`;
      if (c.actual !== undefined && c.required !== undefined) {
        const a = Math.round((c.actual ?? 0) * 100);
        const r = Math.round((c.required ?? 0) * 100);
        return `${label}: ${a}% (need ${r}%)`;
      }
      return `${label}: not yet`;
    })
    .join(' · ');
}

/**
 * Tricky high-frequency words the learner should be working on at their
 * current curriculum phase. Returns 0–8 entries (phases 1 and 5 have the
 * most; later phases taper off as more become fully decodable). UI can
 * surface these alongside the next stage so early decodable sentences
 * have `the`, `a`, `I`, `to`, `was`, `said`, `you`, `my` available from
 * phase 1 rather than waiting for the old phase-10 sight-word bucket.
 *
 * @param {ProgressionSnapshot=} snapshot
 * @returns {Array<import('../data/trickyWords.js').TrickyWord>}
 */
export function getTrickyWordsForCurrentStage(snapshot = buildProgressionSnapshot()) {
  const stage = getRecommendedStage(snapshot);
  if (!stage) return [];
  return getTrickyWordsForPhase(stage.phase);
}

/**
 * @typedef {object} ProgressionSnapshot
 * @property {Record<string, number>} groupMastery
 * @property {Record<string, object>} wordStats
 * @property {Record<string, Record<string, object>>} wordSkillStats
 * @property {Array<object>} learningEvents
 */
