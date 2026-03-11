/**
 * PhonicsQuest – App Constants
 *
 * Centralised screen IDs, quest thresholds, and other enumerations.
 * Use these instead of raw string literals to catch typos at reference time
 * and make renaming screens a one-place change.
 */

/** Screen element IDs as they appear in the DOM */
export const SCREENS = Object.freeze({
  PROFILES:       'screen-profiles',
  HOME:           'screen-home',
  GAME:           'screen-game',
  RESULT:         'screen-result',
  STORIES:        'screen-stories',
  LETTER_SOUNDS:  'screen-letter-sounds',
  SIGHT_MATCH:    'screen-sight-match',
  SENTENCE_FORGE: 'screen-sentence-forge',
  CLOZE_CASTLE:   'screen-cloze-castle',
  WORD_VAULT:     'screen-word-vault',
  EDITING_QUEST:  'screen-editing-quest',
});

/**
 * Minimum number of mastered words required to unlock each quest mode.
 * A word is "mastered" when it has ≥6 attempts and ≥80% accuracy.
 */
export const QUEST_THRESHOLDS = Object.freeze({
  sentenceForge: 10,
  clozeCastle:   25,
  wordVault:     50,
  editingQuest:  70,
});
