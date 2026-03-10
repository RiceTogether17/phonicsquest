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
 * @param {any} raw
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
 * @param {{attempts?: number, correct?: number}|undefined} stat
 * @param {ReturnType<typeof normalizeAdaptiveConfig>} cfg
 */
export function getWordWeight(stat, cfg) {
  if (!stat || (stat.attempts || 0) === 0) return cfg.unseenWeight;
  const attempts = stat.attempts || 0;
  const correct = stat.correct || 0;
  const accuracy = attempts > 0 ? correct / attempts : 0;

  if (accuracy < cfg.weakAccuracy) return cfg.weakWeight;
  if (accuracy < cfg.mediumAccuracy) return cfg.mediumWeight;
  if (accuracy > cfg.strongAccuracy && attempts >= cfg.masteryMinAttempts) return cfg.strongWeight;
  return cfg.defaultWeight;
}
