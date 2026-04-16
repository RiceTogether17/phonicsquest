/**
 * Adaptive selection settings and helpers.
 */

export const DEFAULT_ADAPTIVE_CONFIG = Object.freeze({
  unseenWeight: 3,
  weakWeight: 5,
  mediumWeight: 3,
  strongWeight: 0.5,
  defaultWeight: 1,
  weakAccuracy: 0.5,
  mediumAccuracy: 0.7,
  strongAccuracy: 0.9,
  masteryMinAttempts: 6,
});

/**
 * @param {Partial<typeof DEFAULT_ADAPTIVE_CONFIG>} [raw]
 */
export function normalizeAdaptiveConfig(raw = {}) {
  const cfg = { ...DEFAULT_ADAPTIVE_CONFIG, ...(raw || {}) };
  return {
    unseenWeight: Number(cfg.unseenWeight),
    weakWeight: Number(cfg.weakWeight),
    mediumWeight: Number(cfg.mediumWeight),
    strongWeight: Number(cfg.strongWeight),
    defaultWeight: Number(cfg.defaultWeight),
    weakAccuracy: Number(cfg.weakAccuracy),
    mediumAccuracy: Number(cfg.mediumAccuracy),
    strongAccuracy: Number(cfg.strongAccuracy),
    masteryMinAttempts: Number(cfg.masteryMinAttempts),
  };
}

/**
 * @param {{attempts?: number, correct?: number, nextReviewDate?: string|null}|undefined} stat
 * @param {ReturnType<typeof normalizeAdaptiveConfig>} cfg
 */
export function getWordWeight(stat, cfg) {
  if (!stat || (stat.attempts || 0) === 0) return cfg.unseenWeight;
  const attempts = stat.attempts || 0;
  const correct = stat.correct || 0;
  const accuracy = attempts > 0 ? correct / attempts : 0;

  // Spaced-repetition override: if a previously mastered word is due for
  // review (its nextReviewDate has passed), boost its weight so the adaptive
  // pool surfaces it regardless of historical accuracy.
  if (
    stat.nextReviewDate &&
    accuracy >= cfg.strongAccuracy &&
    attempts >= cfg.masteryMinAttempts
  ) {
    const due = new Date(stat.nextReviewDate).getTime();
    if (!isNaN(due) && Date.now() >= due) {
      // Due for review — treat like a medium-weight word to surface it
      return cfg.mediumWeight;
    }
    // Mastered and not yet due → reduce weight (already internalized)
    return cfg.strongWeight;
  }

  if (accuracy < cfg.weakAccuracy) return cfg.weakWeight;
  if (accuracy < cfg.mediumAccuracy) return cfg.mediumWeight;
  if (accuracy > cfg.strongAccuracy && attempts >= cfg.masteryMinAttempts) return cfg.strongWeight;
  return cfg.defaultWeight;
}

/**
 * Count how many words are due for spaced-repetition review today.
 * Useful for the parent dashboard and session summary.
 * @param {Record<string, {nextReviewDate?: string|null, attempts?: number, correct?: number}>} wordStats
 * @param {ReturnType<typeof normalizeAdaptiveConfig>} cfg
 * @returns {number}
 */
export function countReviewsDue(wordStats = {}, cfg = DEFAULT_ADAPTIVE_CONFIG) {
  const now = Date.now();
  let count = 0;
  for (const stat of Object.values(wordStats)) {
    if (!stat?.nextReviewDate) continue;
    const due = new Date(stat.nextReviewDate).getTime();
    if (!isNaN(due) && now >= due) count++;
  }
  return count;
}
