import { QUEST_THRESHOLDS } from '../constants.js';

/**
 * @typedef {{ attempts?: number, correct?: number }} ProgressRecord
 * @typedef {{ schoolLevel?: 'preschool'|'primary'|string }} UserProfile
 */

/**
 * A word is mastered when attempts >= minAttempts and accuracy >= masteryThreshold.
 * @param {Record<string, ProgressRecord>} wordStats
 * @param {number} [minAttempts]
 * @param {number} [masteryThreshold]
 */
export function countMasteredWords(wordStats = {}, minAttempts = 6, masteryThreshold = 0.8) {
  let mastered = 0;
  for (const stat of Object.values(wordStats || {})) {
    const attempts = stat?.attempts || 0;
    const correct = stat?.correct || 0;
    const accuracy = attempts > 0 ? correct / attempts : 0;
    if (attempts >= minAttempts && accuracy >= masteryThreshold) mastered++;
  }
  return mastered;
}

/**
 * Compute quest unlock status from profile + per-word progress.
 * Primary profiles bypass gating.
 * @param {Record<string, ProgressRecord>} wordStats
 * @param {UserProfile|null} profile
 * @param {{ sentenceForge:number, clozeCastle:number, wordVault:number }} [thresholds]
 * @param {{ minAttempts?: number, masteryAccuracy?: number }} [masteryConfig]
 */
export function getQuestUnlockStatus(wordStats = {}, profile = null, thresholds = QUEST_THRESHOLDS, masteryConfig = {}) {
  // Merge-conflict hardening:
  // if a caller accidentally passes masteryConfig as the 3rd arg (from older
  // call sites), auto-detect and fall back to default quest thresholds.
  const looksLikeMasteryConfig =
    thresholds && typeof thresholds === 'object' &&
    ('minAttempts' in thresholds || 'masteryAccuracy' in thresholds) &&
    !('sentenceForge' in thresholds);

  const effectiveThresholds = looksLikeMasteryConfig ? QUEST_THRESHOLDS : thresholds;
  const effectiveMasteryConfig = looksLikeMasteryConfig ? thresholds : masteryConfig;

  if (profile?.schoolLevel === 'primary') {
    return {
      mastered: Infinity,
      sentenceForge: { unlocked: true, required: effectiveThresholds.sentenceForge, current: Infinity },
      clozeCastle:   { unlocked: true, required: effectiveThresholds.clozeCastle,   current: Infinity },
      wordVault:     { unlocked: true, required: effectiveThresholds.wordVault,     current: Infinity },
    };
  }

  const mastered = countMasteredWords(
    wordStats,
    effectiveMasteryConfig.minAttempts ?? 6,
    effectiveMasteryConfig.masteryAccuracy ?? 0.8,
  );
  return {
    mastered,
    sentenceForge: { unlocked: mastered >= effectiveThresholds.sentenceForge, required: effectiveThresholds.sentenceForge, current: mastered },
    clozeCastle:   { unlocked: mastered >= effectiveThresholds.clozeCastle,   required: effectiveThresholds.clozeCastle,   current: mastered },
    wordVault:     { unlocked: mastered >= effectiveThresholds.wordVault,     required: effectiveThresholds.wordVault,     current: mastered },
  };
}
