/**
 * PhonicsQuest – App Constants
 *
 * Centralised screen IDs, quest thresholds, and other enumerations.
 * Use these instead of raw string literals to catch typos at reference time
 * and make renaming screens a one-place change.
 */

/** Screen element IDs as they appear in the DOM */
export const SCREENS = Object.freeze({
  PROFILES: 'screen-profiles',
  HOME: 'screen-home',
  GAME: 'screen-game',
  RESULT: 'screen-result',
  STORIES: 'screen-stories',
  LETTER_SOUNDS: 'screen-letter-sounds',
  SIGHT_MATCH: 'screen-sight-match',
  SENTENCE_FORGE: 'screen-sentence-forge',
  GRAMMAR_MCQ: 'screen-grammar-mcq',
  VOCAB_MCQ: 'screen-vocab-mcq',
  PAPER_MODE: 'screen-paper-mode',
  CLOZE_CASTLE: 'screen-cloze-castle',
  WORD_VAULT: 'screen-word-vault',
  EDITING_QUEST: 'screen-editing-quest',
  WRITING_QUEST: 'screen-writing-quest',
  PRIMARY_PLACEHOLDER: 'screen-primary-placeholder',
  ROADMAP: 'screen-roadmap',
});

/**
 * Questions in one self-directed MCQ round (Grammar MCQ, Vocabulary MCQ).
 *
 * Without a cap these modes served the whole filtered bank as a single round:
 * tapping "Start P4 (All Skills)" opened a 2,929-question session with no end,
 * no summary and a progress bar that never visibly moved. A round has to be
 * something a child can finish, so it matches the store's default `dailyGoal`
 * of 10 — about five minutes, then a summary and a decision to play again.
 *
 * Entry points that want a different length (Paper Mode) still override it
 * through `paperItemLimit`.
 */
export const MCQ_ROUND_SIZE = 10;

/**
 * Minimum number of mastered words required to unlock each quest mode.
 * A word is "mastered" when it has ≥6 attempts and ≥80% accuracy.
 */
export const QUEST_THRESHOLDS = Object.freeze({
  sentenceForge: 10,
  clozeCastle: 25,
  wordVault: 50,
  editingQuest: 70,
  writingQuest: 90,
});
