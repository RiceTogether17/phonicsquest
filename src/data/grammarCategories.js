/**
 * PhonicsQuest – Master Grammar Category Spine
 *
 * Single source of truth for grammar category definitions shared by
 * Grammar Cloze (Cloze Castle) and Grammar MCQ.
 *
 * SPIRAL PROGRESSION: every strand recurs across P1-P6 with increasing
 * difficulty.  MCQ items and Cloze passages reference the same category
 * keys so mastery data stays meaningful across modes.
 *
 * When adding a new category, update this file and both data consumers
 * (passages.js, grammarMcq.js) will inherit it automatically.
 */

export const GRAMMAR_CATEGORIES = {
  articles:                  { label: 'Articles (a/an/the)',              icon: '📰' },
  pronouns:                  { label: 'Pronouns',                         icon: '👤' },
  reflexivePronouns:         { label: 'Reflexive Pronouns (myself / yourselves / themselves)', icon: '🪞' },
  demonstratives:            { label: 'Demonstratives (this/that/these/those)', icon: '👉' },
  whQuestions:               { label: 'Wh- Questions (how/what/when/where/why)', icon: '❔' },
  svAgreement:               { label: 'Subject-Verb Agreement',           icon: '🤝' },
  simplePast:                { label: 'Simple Past Tense',                icon: '⏪' },
  presentCont:               { label: 'Present Continuous',               icon: '🔄' },
  pastCont:                  { label: 'Past Continuous',                  icon: '⏳' },
  perfectContinuousTenses:   { label: 'Perfect & Continuous Tenses',      icon: '🕒' },
  futureTense:               { label: 'Future Tense',                     icon: '🔮' },
  presentPerfect:            { label: 'Present Perfect',                  icon: '✅' },
  pastPerfect:               { label: 'Past Perfect',                     icon: '🔙' },
  tenseAwareness:            { label: 'Tense Awareness',                  icon: '⏰' },
  prepositions:              { label: 'Prepositions',                     icon: '📍' },
  connectors:                { label: 'Connectors',                       icon: '🔗' },
  conjunctions:              { label: 'Conjunctions',                     icon: '🔗' },
  modals:                    { label: 'Modal Verbs',                      icon: '💪' },
  comparatives:              { label: 'Comparatives',                     icon: '📊' },
  superlatives:              { label: 'Superlatives',                     icon: '🏆' },
  quantifiers:               { label: 'Quantifiers',                      icon: '🔢' },
  passiveVoice:              { label: 'Passive Voice',                    icon: '🔃' },
  conditionals:              { label: 'Conditionals (If)',                icon: '❓' },
  reportedSpeech:            { label: 'Reported Speech',                  icon: '💬' },
  relativeClauses:           { label: 'Relative Clauses',                 icon: '🧩' },
  countableUncountable:      { label: 'Countable & Uncountable Nouns',    icon: '🧺' },
  possessives:               { label: 'Possessives',                      icon: '🏷' },
  adjAdverbs:                { label: 'Adjectives & Adverbs',             icon: '🎨' },
  auxiliaries:               { label: 'Auxiliaries & Questions',           icon: '🙋' },
  inversion:                 { label: 'Inversion & Advanced Structures',  icon: '🔀' },
  mixedGrammar:              { label: 'Mixed Grammar (Exam)',             icon: '📝' },
};

/** Ordered list of category keys for UI iteration. */
export const GRAMMAR_CATEGORY_KEYS = Object.keys(GRAMMAR_CATEGORIES);
