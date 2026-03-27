/**
 * PhonicsQuest – Mastery 2.0 Engine
 *
 * Multi-dimensional mastery model that goes beyond binary "mastered / not mastered".
 * Three dimensions per word:
 *   accuracy   – correct / attempts ratio
 *   retention  – how well spaced-repetition intervals have been stretched (0–1)
 *   speed      – response time relative to a target (0–1, faster = higher)
 *
 * Domain mastery aggregates across phonics groups and quest skills.
 * Readiness signals tell parents and the app whether a learner is ready to advance,
 * needs more practice, or is at risk of falling behind.
 *
 * Public API:
 *   getWordMastery(wordId)                  → { accuracy, retention, speed, composite }
 *   getDomainMastery()                      → [{ id, label, icon, composite, signal }]
 *   getReadinessSignal(domainId)            → 'on-track' | 'needs-practice' | 'at-risk'
 *   getLearnerReadinessSummary()            → { overallSignal, domainsAtRisk, strongDomains, nextFocus }
 */

import { store } from './store.js';

// ── Constants ────────────────────────────────────────────────────────────────

const SRS_INTERVALS    = [1, 3, 7, 14, 30]; // days per interval level 0–4
const TARGET_SPEED_MS  = 3000;              // under 3 s counts as "fast"
const MIN_ATTEMPTS     = 3;                 // minimum attempts before mastery is meaningful

const DOMAIN_DEFS = [
  { id: 'phonics',        label: 'Phonics / Decoding',  icon: '🔤', source: 'groupMastery',  keys: ['short-a','short-e','short-i','short-o','short-u'] },
  { id: 'sentenceSkills', label: 'Sentence Skills',      icon: '🔨', source: 'questMastery',  keys: ['sentenceForge'] },
  { id: 'grammarCloze',   label: 'Grammar Cloze',        icon: '🏰', source: 'questMastery',  keys: ['clozeCastle'] },
  { id: 'vocabCloze',     label: 'Vocabulary Cloze',     icon: '🔑', source: 'questMastery',  keys: ['wordVault'] },
  { id: 'editingQuest',   label: 'Editing Quest',        icon: '✏️', source: 'questMastery',  keys: ['editingQuest'] },
  { id: 'writingQuest',   label: 'Writing Quest',        icon: '📝', source: 'questMastery',  keys: ['writingQuest'] },
];

// Thresholds for readiness signals
const SIGNAL_THRESHOLDS = {
  ON_TRACK:       0.70,
  NEEDS_PRACTICE: 0.50,
  // below NEEDS_PRACTICE → at-risk
};

// ── Internal helpers ─────────────────────────────────────────────────────────

/**
 * Retention score: the fraction of maximum SRS interval reached.
 * 0 = never reviewed / interval 0, 1 = longest interval (30 days).
 */
function _retentionScore(stat) {
  if (!stat || (stat.attempts || 0) < MIN_ATTEMPTS) return 0;
  const interval = stat.reviewInterval ?? 0;
  return interval / (SRS_INTERVALS.length - 1); // 0 → 0.0, 4 → 1.0
}

/**
 * Speed score: derived from learningEvents for this word.
 * We take the median response time of correct answers and map to 0–1.
 */
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
  // Linear mapping: 0ms → 1.0, TARGET_SPEED_MS → 0.5, 2×TARGET → 0.0 (clamped)
  const score = Math.max(0, 1 - (median / (2 * TARGET_SPEED_MS)));
  return Math.min(1, score);
}

/**
 * Average quest-mastery score for an array of quest keys.
 */
function _avgQuestScore(questKeys) {
  const qm = store.get('questMastery') || {};
  let total = 0, count = 0;
  for (const qk of questKeys) {
    const bucket = qm[qk] || {};
    const scores = Object.values(bucket).filter(s => typeof s === 'number');
    if (scores.length) {
      total += scores.reduce((a, b) => a + b, 0) / scores.length;
      count++;
    }
  }
  return count > 0 ? total / count : null;
}

/**
 * Average group-mastery score for an array of group keys.
 */
function _avgGroupScore(groupKeys) {
  const gm = store.get('groupMastery') || {};
  const scores = groupKeys.map(k => gm[k]).filter(s => typeof s === 'number');
  if (!scores.length) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Multi-dimensional mastery for a single word.
 * @param {string} wordId
 * @returns {{ accuracy: number|null, retention: number, speed: number|null, composite: number|null }}
 */
export function getWordMastery(wordId) {
  const wordStats = store.get('wordStats') || {};
  const stat      = wordStats[wordId];

  const accuracy  = stat && stat.attempts >= MIN_ATTEMPTS
    ? (stat.correct || 0) / stat.attempts
    : null;
  const retention = _retentionScore(stat);
  const speed     = _speedScore(wordId);

  // Composite: weighted average of dimensions with data
  // weights: accuracy 50%, retention 30%, speed 20%
  let composite = null;
  let wSum = 0, vSum = 0;
  if (accuracy !== null)  { vSum += accuracy  * 0.5; wSum += 0.5; }
  if (retention > 0)      { vSum += retention * 0.3; wSum += 0.3; }
  if (speed !== null)     { vSum += speed     * 0.2; wSum += 0.2; }
  if (wSum > 0) composite = Math.min(1, vSum / wSum);

  return { accuracy, retention, speed, composite };
}

/**
 * Domain mastery summary across all 6 literacy domains.
 * @returns {Array<{ id, label, icon, composite: number|null, signal: string }>}
 */
export function getDomainMastery() {
  return DOMAIN_DEFS.map(def => {
    const rawScore = def.source === 'questMastery'
      ? _avgQuestScore(def.keys)
      : _avgGroupScore(def.keys);

    // Blend raw score with word-level retention where possible
    let composite = rawScore;
    if (def.source === 'groupMastery') {
      // Augment phonics domain with average retention across practiced words
      const wordStats = store.get('wordStats') || {};
      const retentions = Object.values(wordStats)
        .filter(s => (s.attempts || 0) >= MIN_ATTEMPTS)
        .map(s => _retentionScore(s));
      if (retentions.length) {
        const avgRetention = retentions.reduce((a, b) => a + b, 0) / retentions.length;
        // 80% raw accuracy + 20% retention
        composite = rawScore !== null
          ? rawScore * 0.8 + avgRetention * 0.2
          : null;
      }
    }

    return {
      ...def,
      raw:       rawScore,
      composite,
      signal:    composite !== null ? getReadinessSignal(composite) : 'no-data',
    };
  });
}

/**
 * Map a composite score to a readiness signal.
 * @param {number} score  0–1
 * @returns {'on-track'|'needs-practice'|'at-risk'|'no-data'}
 */
export function getReadinessSignal(score) {
  if (score === null || score === undefined) return 'no-data';
  if (score >= SIGNAL_THRESHOLDS.ON_TRACK)       return 'on-track';
  if (score >= SIGNAL_THRESHOLDS.NEEDS_PRACTICE) return 'needs-practice';
  return 'at-risk';
}

/**
 * Overall learner readiness summary for the coaching card.
 * @returns {{
 *   overallSignal: string,
 *   domainsAtRisk: Array<{id, label, icon}>,
 *   strongDomains:  Array<{id, label, icon}>,
 *   nextFocus:      string,
 *   reviewsDue:     number,
 * }}
 */
export function getLearnerReadinessSummary() {
  const domains = getDomainMastery().filter(d => d.composite !== null);

  const domainsAtRisk   = domains.filter(d => d.signal === 'at-risk');
  const needsPractice   = domains.filter(d => d.signal === 'needs-practice');
  const strongDomains   = domains.filter(d => d.signal === 'on-track');

  // Overall signal: worst single domain signal
  const overallSignal = domainsAtRisk.length   > 0 ? 'at-risk'
    : needsPractice.length > 0 ? 'needs-practice'
    : domains.length > 0       ? 'on-track'
    : 'no-data';

  // Next focus: lowest-scoring domain with data
  const sorted = [...domains].sort((a, b) => (a.composite ?? 1) - (b.composite ?? 1));
  const weakest = sorted[0];
  const nextFocus = weakest
    ? `${weakest.icon} ${weakest.label} (${Math.round((weakest.composite ?? 0) * 100)}%)`
    : 'Keep practising across all areas!';

  // Count SRS reviews due today
  const wordStats = store.get('wordStats') || {};
  const now = Date.now();
  let reviewsDue = 0;
  for (const stat of Object.values(wordStats)) {
    if (stat?.nextReviewDate) {
      const due = new Date(stat.nextReviewDate).getTime();
      if (!isNaN(due) && now >= due) reviewsDue++;
    }
  }

  return { overallSignal, domainsAtRisk, needsPractice, strongDomains, nextFocus, reviewsDue };
}
