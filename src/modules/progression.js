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
 *   1. Decoding accuracy ≥ 85% over the prereq group's words.
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
 */
import { CURRICULUM } from '../data/curriculum.js';
import { store } from './store.js';
import { progress } from './progress.js';

// ── Public configuration ────────────────────────────────────────────────────

export const PROGRESSION_GATE = Object.freeze({
  MIN_DECODING_ACCURACY:   0.85,
  MIN_SPELLING_ACCURACY:   0.80,
  MIN_UNIQUE_WORDS:        12,
  MIN_SESSION_DAYS:        2,
  MIN_SPELLING_ATTEMPTS:    6,   // before we have this many spelling attempts, treat as no-data
  MIN_DECODING_ATTEMPTS:    6,   // need at least this many decoding attempts to judge
  MAX_VOWEL_CONFUSION_GAP: 0.20, // prereq accuracy must not be more than 20 pts below sibling-median
  GROUP_SIZE_FRACTION:     0.75, // small groups: required unique = min(MIN_UNIQUE_WORDS, floor(size * this))
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
    groupMastery:   store.get('groupMastery')   || {},
    wordStats:      store.get('wordStats')      || {},
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

function _accuracyOver(stats, wordIds, skill = null) {
  let attempts = 0, correct = 0;
  for (const id of wordIds) {
    const s = skill ? stats?.[id]?.[skill] : stats?.[id];
    if (!s || !s.attempts) continue;
    attempts += s.attempts;
    correct  += s.correct;
  }
  return { attempts, correct, accuracy: attempts > 0 ? correct / attempts : null };
}

function _checkDecodingAccuracy(prereqStage, snapshot) {
  const wordIds = _wordsInGroup(prereqStage.group).map(w => w.id);
  // Prefer per-skill data if available.
  if (snapshot.wordSkillStats) {
    const skill = _accuracyOver(snapshot.wordSkillStats, wordIds, 'decoding');
    if (skill.attempts >= PROGRESSION_GATE.MIN_DECODING_ATTEMPTS) {
      const required = PROGRESSION_GATE.MIN_DECODING_ACCURACY;
      return {
        pass:     skill.accuracy >= required,
        reason:   skill.accuracy >= required ? 'meets-target' : 'below-decoding-target',
        actual:   skill.accuracy,
        required,
        attempts: skill.attempts,
      };
    }
  }
  // Fall back to the cross-skill groupMastery (legacy data path).
  if (snapshot.groupMastery && typeof snapshot.groupMastery[prereqStage.group] === 'number') {
    const actual = snapshot.groupMastery[prereqStage.group];
    const required = PROGRESSION_GATE.MIN_DECODING_ACCURACY;
    return {
      pass:   actual >= required,
      reason: actual >= required ? 'meets-target-cross-skill' : 'below-decoding-target',
      actual,
      required,
      fallback: 'cross-skill',
    };
  }
  return { pass: false, reason: 'no-decoding-data', required: PROGRESSION_GATE.MIN_DECODING_ACCURACY };
}

function _checkSpellingAccuracy(prereqStage, snapshot) {
  const required = PROGRESSION_GATE.MIN_SPELLING_ACCURACY;
  if (!snapshot.wordSkillStats) return { pass: true, reason: 'no-data', required };
  const wordIds = _wordsInGroup(prereqStage.group).map(w => w.id);
  const { attempts, accuracy } = _accuracyOver(snapshot.wordSkillStats, wordIds, 'spelling');
  if (attempts < PROGRESSION_GATE.MIN_SPELLING_ATTEMPTS) {
    return { pass: true, reason: 'insufficient-spelling-data', attempts, required };
  }
  return {
    pass:   accuracy >= required,
    reason: accuracy >= required ? 'meets-target' : 'below-spelling-target',
    actual: accuracy,
    required,
    attempts,
  };
}

function _checkUniqueWords(prereqStage, snapshot) {
  if (!snapshot.wordStats) return { pass: true, reason: 'no-data' };
  const groupWords = _wordsInGroup(prereqStage.group);
  const groupSize  = groupWords.length;
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
    pass:     unique >= required,
    reason:   unique >= required ? 'meets-target' : 'too-few-unique-words',
    actual:   unique,
    required,
    groupSize,
  };
}

function _checkSessionDays(prereqStage, snapshot) {
  const required = PROGRESSION_GATE.MIN_SESSION_DAYS;
  if (!Array.isArray(snapshot.learningEvents) || snapshot.learningEvents.length === 0) {
    return { pass: true, reason: 'no-data', required };
  }
  const wordIds = new Set(_wordsInGroup(prereqStage.group).map(w => w.id));
  const days = new Set();
  for (const e of snapshot.learningEvents) {
    if (e.eventType !== 'word_attempt') continue;
    if (!wordIds.has(e.meta?.wordId)) continue;
    if (!e.timestamp) continue;
    days.add(e.timestamp.slice(0, 10)); // YYYY-MM-DD
  }
  return {
    pass:   days.size >= required,
    reason: days.size >= required ? 'meets-target' : 'too-few-session-days',
    actual: days.size,
    required,
  };
}

function _checkVowelConfusion(prereqStage, snapshot) {
  const match = STRUCTURAL_VOWEL_RE.exec(prereqStage.group);
  if (!match) return { pass: true, reason: 'not-applicable' };
  const struct = match[1];
  const vowel  = match[2];
  if (!snapshot.groupMastery) return { pass: true, reason: 'no-data' };

  const myScore = snapshot.groupMastery[prereqStage.group];
  if (typeof myScore !== 'number') {
    return { pass: true, reason: 'no-data-for-prereq' };
  }

  // Sibling vowel groups (same structure, different vowel).
  const siblings = ['a', 'e', 'i', 'o', 'u']
    .filter(v => v !== vowel)
    .map(v => snapshot.groupMastery[`${struct}-${v}`])
    .filter(s => typeof s === 'number');

  if (siblings.length === 0) {
    return { pass: true, reason: 'no-sibling-data' };
  }

  // Median of siblings — robust against one outlier.
  const sorted = [...siblings].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  const gap = median - myScore;
  const required = PROGRESSION_GATE.MAX_VOWEL_CONFUSION_GAP;
  return {
    pass:   gap <= required,
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
 * Run the five-criterion readiness gate for one stage.
 * @param {string} stageId
 * @param {ProgressionSnapshot} snapshot
 * @returns {{ unlocked: boolean, checks: Record<string, object>, stage: object|null }}
 */
export function getStageReadiness(stageId, snapshot = {}) {
  const stage = CURRICULUM.find(s => s.id === stageId);
  if (!stage) return { unlocked: false, stage: null, checks: { stage: { pass: false, reason: 'unknown-stage' } } };
  if (!stage.prerequisite) {
    return { unlocked: true, stage, checks: { rootStage: { pass: true, reason: 'no-prerequisite' } } };
  }
  const prereq = CURRICULUM.find(s => s.id === stage.prerequisite);
  if (!prereq) {
    return { unlocked: false, stage, checks: { prereq: { pass: false, reason: 'missing-prereq-definition' } } };
  }

  const checks = {
    decodingAccuracy: _checkDecodingAccuracy(prereq, snapshot),
    spellingAccuracy: _checkSpellingAccuracy(prereq, snapshot),
    uniqueWords:      _checkUniqueWords(prereq, snapshot),
    sessionDays:      _checkSessionDays(prereq, snapshot),
    vowelConfusion:   _checkVowelConfusion(prereq, snapshot),
  };
  const unlocked = Object.values(checks).every(c => c.pass);
  return { unlocked, stage, checks };
}

/**
 * Walk CURRICULUM in order, unlocking each stage only when its prerequisite
 * passes the strict gate. Returns an array of unlocked stage ids — same
 * shape as the legacy curriculum.getUnlockedStages so callers can swap.
 * @param {ProgressionSnapshot} snapshot
 * @returns {string[]}
 */
export function getUnlockedStages(snapshot = buildProgressionSnapshot()) {
  const unlocked = [];
  for (const stage of CURRICULUM) {
    if (!stage.prerequisite) { unlocked.push(stage.id); continue; }
    if (!unlocked.includes(stage.prerequisite)) continue;
    const { unlocked: ok } = getStageReadiness(stage.id, snapshot);
    if (ok) unlocked.push(stage.id);
  }
  return unlocked;
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
    const stage = CURRICULUM.find(s => s.id === id);
    const score = gm[stage.group] ?? 0;
    if (score < PROGRESSION_GATE.MIN_DECODING_ACCURACY) return stage;
  }
  const lastId = unlocked[unlocked.length - 1];
  return CURRICULUM.find(s => s.id === lastId) ?? null;
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
    uniqueWords:      'Variety of words practised',
    sessionDays:      'Spread over multiple sessions',
    vowelConfusion:   'Vowel-specific weakness',
  };
  const failed = Object.entries(checks).filter(([, c]) => !c.pass);
  if (failed.length === 0) return null;
  return failed.map(([key, c]) => {
    const label = labels[key] || key;
    if (c.actual !== undefined && c.required !== undefined) {
      const a = Math.round((c.actual ?? 0) * 100);
      const r = Math.round((c.required ?? 0) * 100);
      return `${label}: ${a}% (need ${r}%)`;
    }
    if (c.reason === 'too-few-unique-words')   return `${label}: ${c.actual}/${c.required} words`;
    if (c.reason === 'too-few-session-days')   return `${label}: ${c.actual}/${c.required} sessions`;
    if (c.reason === 'no-decoding-data')       return `${label}: practise this stage first`;
    return `${label}: not yet`;
  }).join(' · ');
}

/**
 * @typedef {object} ProgressionSnapshot
 * @property {Record<string, number>} groupMastery
 * @property {Record<string, object>} wordStats
 * @property {Record<string, Record<string, object>>} wordSkillStats
 * @property {Array<object>} learningEvents
 */
