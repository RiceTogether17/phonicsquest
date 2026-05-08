/**
 * PhonicsQuest – Mastery 2.1 Engine
 *
 * Multi-dimensional mastery model. Three dimensions per word:
 *   accuracy   – correct / attempts ratio
 *   retention  – depth of SRS interval reached (0–1)
 *   speed      – median response time vs 3 s target (0–1, optional)
 *
 * Five-state readiness model (replaces the old 3-state):
 *   just-started  < 20%
 *   building      20–49%
 *   consolidating 50–69%
 *   on-track      70–84%
 *   mastered      ≥ 85%
 *
 * Domain mastery aggregates all phonics groups that have been practised
 * (not just the 5 short-vowel groups) plus all quest skill buckets.
 *
 * Public API:
 *   getWordMastery(wordId)              → { accuracy, retention, speed, composite }
 *   getDomainMastery()                  → array of domain objects
 *   getReadinessState(score)            → 5-state label
 *   getReadinessSignal(score)           → 3-state label (backward compat)
 *   getProgressionReadiness(domainId)   → { decision, label, canAdvance }
 *   getLearnerReadinessSummary()        → comprehensive readiness snapshot
 *   getWeeklyDomainPractice()           → { [questKey]: attemptCount } last 7 days
 */

import { store } from './store.js';
import { SKILLS } from './progress.js';

// ── Constants ────────────────────────────────────────────────────────────────

const SRS_INTERVALS   = [1, 3, 7, 14, 30];
const TARGET_SPEED_MS = 3000;
const MIN_ATTEMPTS    = 3;

/**
 * Per-skill fluency targets (median response time on correct attempts at
 * which speed score = 1.0; double the target gives 0.0). Segmenting and
 * spelling are slower than decoding because the learner is producing
 * phonemes/letters rather than just identifying a word.
 */
const SKILL_TARGET_MS = Object.freeze({
  oralBlend:  4000,
  segmenting: 5000,
  decoding:   3000,
  spelling:   5000,
});

// Five-state readiness thresholds
const RT = {
  MASTERED:      0.85,
  ON_TRACK:      0.70,
  CONSOLIDATING: 0.50,
  BUILDING:      0.20,
};

// Domain definitions — phonics uses ALL available groupMastery keys (computed dynamically)
const QUEST_DOMAIN_DEFS = [
  { id: 'sentenceSkills', label: 'Sentence Skills',  icon: '🔨', questKey: 'sentenceForge' },
  { id: 'grammarCloze',   label: 'Grammar Cloze',    icon: '🏰', questKey: 'clozeCastle'  },
  { id: 'vocabCloze',     label: 'Vocabulary Cloze', icon: '🔑', questKey: 'wordVault'    },
  { id: 'editingQuest',   label: 'Editing Quest',    icon: '✏️', questKey: 'editingQuest' },
  { id: 'writingQuest',   label: 'Writing Quest',    icon: '📝', questKey: 'writingQuest' },
];

// ── Internal helpers ─────────────────────────────────────────────────────────

function _retentionScore(stat) {
  if (!stat || (stat.attempts || 0) < MIN_ATTEMPTS) return 0;
  return (stat.reviewInterval ?? 0) / (SRS_INTERVALS.length - 1);
}

function _speedScore(wordId) {
  const events = (store.get('learningEvents') || [])
    .filter(e =>
      e.eventType === 'word_attempt' &&
      e.meta?.wordId === wordId &&
      e.meta?.correct === true &&
      typeof e.meta?.responseMs === 'number'
    );
  if (!events.length) return null;
  const times = events.map(e => e.meta.responseMs).sort((a, b) => a - b);
  const median = times[Math.floor(times.length / 2)];
  return Math.min(1, Math.max(0, 1 - median / (2 * TARGET_SPEED_MS)));
}

function _avgQuestScore(questKey) {
  const bucket = (store.get('questMastery') || {})[questKey] || {};
  const scores = Object.values(bucket).filter(s => typeof s === 'number');
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
}

/** Average mastery for ALL phonics groups that have been practised. */
function _avgPhonicsScore() {
  const gm = store.get('groupMastery') || {};
  const scores = Object.values(gm).filter(s => typeof s === 'number');
  return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
}

/** Average word-level SRS retention across all words with enough attempts. */
function _avgWordRetention() {
  const wordStats = store.get('wordStats') || {};
  const retentions = Object.values(wordStats)
    .filter(s => (s?.attempts || 0) >= MIN_ATTEMPTS)
    .map(s => _retentionScore(s));
  return retentions.length
    ? retentions.reduce((a, b) => a + b, 0) / retentions.length
    : 0;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Multi-dimensional mastery for a single word.
 */
export function getWordMastery(wordId) {
  const stat     = (store.get('wordStats') || {})[wordId];
  const accuracy = stat && stat.attempts >= MIN_ATTEMPTS
    ? (stat.correct || 0) / stat.attempts : null;
  const retention = _retentionScore(stat);
  const speed     = _speedScore(wordId);

  let composite = null, wSum = 0, vSum = 0;
  if (accuracy  !== null) { vSum += accuracy  * 0.5; wSum += 0.5; }
  if (retention  > 0)     { vSum += retention * 0.3; wSum += 0.3; }
  if (speed     !== null) { vSum += speed     * 0.2; wSum += 0.2; }
  if (wSum > 0) composite = Math.min(1, vSum / wSum);

  return { accuracy, retention, speed, composite };
}

/**
 * Per-skill mastery for one word.
 *
 * A child often reads `cat` perfectly (decoding=high) but can't orally
 * segment /c/-/a/-/t/ (segmenting=low). Cross-skill `getWordMastery`
 * collapses these into one composite and hides the gap. This API surfaces
 * each skill's accuracy and fluency separately so adaptive review and the
 * dashboard can target the actual weakness.
 *
 * @param {string} wordId
 * @param {string} skill   one of 'oralBlend' | 'segmenting' | 'decoding' | 'spelling'
 * @returns {{ attempts: number, accuracy: number|null, fluency: number|null, composite: number|null }}
 */
export function getWordSkillMastery(wordId, skill) {
  const all   = store.get('wordSkillStats') || {};
  const stat  = all?.[wordId]?.[skill];
  if (!stat || stat.attempts === 0) {
    return { attempts: 0, accuracy: null, fluency: null, composite: null };
  }

  const accuracy = stat.attempts >= MIN_ATTEMPTS ? stat.correct / stat.attempts : null;

  // Fluency: median correct-attempt response time vs the skill's target.
  // Falls back to the most recent correct response if telemetry is sparse.
  const target = SKILL_TARGET_MS[skill] ?? TARGET_SPEED_MS;
  const correctTimes = (store.get('learningEvents') || [])
    .filter(e =>
      e.eventType === 'word_attempt' &&
      e.skill === skill &&
      e.correct === true &&
      e.meta?.wordId === wordId &&
      typeof e.responseMs === 'number'
    )
    .map(e => e.responseMs)
    .sort((a, b) => a - b);
  let fluency = null;
  if (correctTimes.length) {
    const median = correctTimes[Math.floor(correctTimes.length / 2)];
    fluency = Math.min(1, Math.max(0, 1 - median / (2 * target)));
  } else if (stat.lastResponseMs && stat.correct > 0) {
    fluency = Math.min(1, Math.max(0, 1 - stat.lastResponseMs / (2 * target)));
  }

  // Composite: 70% accuracy, 30% fluency. No retention component here —
  // SRS intervals live on cross-skill wordStats; per-skill retention would
  // need its own SRS scheduler, which isn't worth the complexity yet.
  let composite = null, wSum = 0, vSum = 0;
  if (accuracy !== null) { vSum += accuracy * 0.7; wSum += 0.7; }
  if (fluency  !== null) { vSum += fluency  * 0.3; wSum += 0.3; }
  if (wSum > 0) composite = Math.min(1, vSum / wSum);

  return { attempts: stat.attempts, accuracy, fluency, composite };
}

/**
 * Per-skill mastery for one word, returned as an object keyed by skill.
 * Skills the child hasn't practised yet have null values, not 0 — null
 * means "no data yet" (don't penalise) and 0 means "tried and failed".
 *
 * @param {string} wordId
 * @returns {Record<string, ReturnType<typeof getWordSkillMastery>>}
 */
export function getWordMasteryBySkill(wordId) {
  const out = {};
  for (const skill of SKILLS) {
    out[skill] = getWordSkillMastery(wordId, skill);
  }
  return out;
}

/**
 * Domain mastery for all domains including full phonics coverage.
 * @returns {Array<{ id, label, icon, raw, composite, state, signal }>}
 */
export function getDomainMastery() {
  const avgRetention = _avgWordRetention();
  const phonicsRaw   = _avgPhonicsScore();
  const phonicsComp  = phonicsRaw !== null
    ? Math.min(1, phonicsRaw * 0.8 + avgRetention * 0.2)
    : null;

  const phDomain = {
    id: 'phonics', label: 'Phonics / Decoding', icon: '🔤',
    raw:       phonicsRaw,
    composite: phonicsComp,
    state:     getReadinessState(phonicsComp),
    signal:    getReadinessSignal(phonicsComp),
  };

  const questDomains = QUEST_DOMAIN_DEFS.map(def => {
    const raw  = _avgQuestScore(def.questKey);
    const comp = raw;   // quest mastery already aggregates skill accuracy
    return {
      ...def,
      raw,
      composite: comp,
      state:  getReadinessState(comp),
      signal: getReadinessSignal(comp),
    };
  });

  return [phDomain, ...questDomains];
}

/**
 * Map a score (0–1) to a five-state readiness label.
 */
export function getReadinessState(score) {
  if (score === null || score === undefined) return 'no-data';
  if (score >= RT.MASTERED)      return 'mastered';
  if (score >= RT.ON_TRACK)      return 'on-track';
  if (score >= RT.CONSOLIDATING) return 'consolidating';
  if (score >= RT.BUILDING)      return 'building';
  return 'just-started';
}

/**
 * Map a score to a 3-state signal (backward-compatible with dashboard rendering).
 */
export function getReadinessSignal(score) {
  if (score === null || score === undefined) return 'no-data';
  if (score >= RT.ON_TRACK)      return 'on-track';
  if (score >= RT.CONSOLIDATING) return 'needs-practice';
  return 'at-risk';
}

/**
 * Human-readable label for a readiness state.
 */
export function readinessStateLabel(state) {
  return {
    'mastered':      'Mastered ✅',
    'on-track':      'On track',
    'consolidating': 'Consolidating',
    'building':      'Building',
    'just-started':  'Just started',
    'no-data':       'No data yet',
  }[state] || state;
}

/**
 * Progression decision for a domain:
 *   advance     → mastered, ready to move on
 *   continue    → on-track, keep going at this level
 *   consolidate → consolidating, secure before advancing
 *   review      → building or just-started, needs more practice
 */
export function getProgressionReadiness(domainId) {
  const domains = getDomainMastery();
  const domain  = domains.find(d => d.id === domainId);
  if (!domain || domain.composite === null) {
    return { decision: 'no-data', label: 'Not enough data yet', canAdvance: false };
  }
  const s = domain.state;
  if (s === 'mastered')      return { decision: 'advance',     label: 'Ready to advance ✅',           canAdvance: true  };
  if (s === 'on-track')      return { decision: 'continue',    label: 'On track — keep going',         canAdvance: false };
  if (s === 'consolidating') return { decision: 'consolidate', label: 'Consolidate before advancing ⚠️', canAdvance: false };
  return                           { decision: 'review',       label: 'Needs more practice 🔴',          canAdvance: false };
}

/**
 * Count quest attempts per domain in the last 7 days.
 * @returns {{ [questKey]: number }}
 */
export function getWeeklyDomainPractice() {
  const attempts = store.get('questAttempts') || [];
  const cutoff   = Date.now() - 7 * 24 * 3600 * 1000;
  const counts   = {};
  for (const a of attempts) {
    if (a.timestamp && new Date(a.timestamp).getTime() >= cutoff) {
      counts[a.quest] = (counts[a.quest] || 0) + 1;
    }
  }
  return counts;
}

/**
 * Comprehensive learner readiness summary for coaching card and dashboard.
 */
export function getLearnerReadinessSummary() {
  const domains = getDomainMastery().filter(d => d.composite !== null);

  const domainsAtRisk    = domains.filter(d => d.signal === 'at-risk');
  const needsPractice    = domains.filter(d => d.signal === 'needs-practice');
  const strongDomains    = domains.filter(d => d.signal === 'on-track');
  const masteredDomains  = domains.filter(d => d.state  === 'mastered');

  const overallSignal = domainsAtRisk.length  > 0 ? 'at-risk'
    : needsPractice.length > 0               ? 'needs-practice'
    : domains.length > 0                     ? 'on-track'
    : 'no-data';

  // Weakest domain with data
  const sorted = [...domains].sort((a, b) => (a.composite ?? 1) - (b.composite ?? 1));
  const weakest = sorted[0];
  const nextFocus = weakest
    ? `${weakest.icon} ${weakest.label} (${Math.round((weakest.composite ?? 0) * 100)}%)`
    : 'Keep practising across all areas!';

  // SRS reviews due
  const wordStats = store.get('wordStats') || {};
  const now = Date.now();
  let reviewsDue = 0;
  for (const stat of Object.values(wordStats)) {
    if (stat?.nextReviewDate) {
      const due = new Date(stat.nextReviewDate).getTime();
      if (!isNaN(due) && now >= due) reviewsDue++;
    }
  }

  // Progression decision for weakest domain
  const progressionDecision = weakest
    ? getProgressionReadiness(weakest.id)
    : null;

  return {
    overallSignal,
    domainsAtRisk,
    needsPractice,
    strongDomains,
    masteredDomains,
    nextFocus,
    reviewsDue,
    progressionDecision,
    weakestDomain: weakest || null,
    domains,
  };
}
