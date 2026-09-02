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
 * Reading stage (from placement) now takes precedence over schoolLevel.
 * @param {Record<string, ProgressRecord>} wordStats
 * @param {UserProfile|null} profile
 * @param {{ sentenceForge:number, clozeCastle:number, wordVault:number, editingQuest:number, writingQuest:number }} [thresholds]
 * @param {{ readingBand?: string, sentenceReady?: boolean, grammarReady?: boolean, vocabularyReady?: boolean }|null} [placementProfile]
 */
export function getQuestUnlockStatus(
  wordStats = {},
  profile = null,
  thresholds = QUEST_THRESHOLDS,
  placementProfile = null,
) {
  const readingBand = placementProfile?.readingBand || profile?.readingBand || null;

  if (readingBand === 'reader') {
    return {
      mastered: Infinity,
      sentenceForge: { unlocked: true, required: thresholds.sentenceForge, current: Infinity },
      clozeCastle: { unlocked: true, required: thresholds.clozeCastle, current: Infinity },
      wordVault: { unlocked: true, required: thresholds.wordVault, current: Infinity },
      editingQuest: { unlocked: true, required: thresholds.editingQuest, current: Infinity },
      writingQuest: { unlocked: true, required: thresholds.writingQuest, current: Infinity },
    };
  }

  const mastered = countMasteredWords(wordStats);
  const sentenceReady = !!placementProfile?.sentenceReady || readingBand === 'developing-reader';
  const grammarReady = !!placementProfile?.grammarReady && sentenceReady;
  const vocabReady = !!placementProfile?.vocabularyReady && sentenceReady;

  // Backward compatibility for older profiles that have no placement profile.
  const legacyPrimaryBypass = !placementProfile && profile?.schoolLevel === 'primary';

  return {
    mastered,
    sentenceForge: {
      unlocked: legacyPrimaryBypass || sentenceReady || mastered >= thresholds.sentenceForge,
      required: thresholds.sentenceForge,
      current: mastered,
    },
    clozeCastle: {
      unlocked: legacyPrimaryBypass || grammarReady || mastered >= thresholds.clozeCastle,
      required: thresholds.clozeCastle,
      current: mastered,
    },
    wordVault: {
      unlocked: legacyPrimaryBypass || vocabReady || mastered >= thresholds.wordVault,
      required: thresholds.wordVault,
      current: mastered,
    },
    editingQuest: {
      unlocked: legacyPrimaryBypass || grammarReady || mastered >= thresholds.editingQuest,
      required: thresholds.editingQuest,
      current: mastered,
    },
    writingQuest: {
      unlocked: legacyPrimaryBypass || grammarReady || mastered >= thresholds.writingQuest,
      required: thresholds.writingQuest,
      current: mastered,
    },
  };
}
