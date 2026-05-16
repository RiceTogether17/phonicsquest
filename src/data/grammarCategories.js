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

/**
 * Each category lists the levels at which it makes pedagogical sense to
 * appear in Grammar MCQ (and corresponding modes). The UI uses this to hide
 * categories outside their level range so kids never see "Coming Soon" for
 * grammar that's either too advanced or already mastered for their level.
 */
export const GRAMMAR_CATEGORIES = {
  articles:                  { label: 'Articles (a/an/the)',              icon: '📰', levels: ['P1', 'P2', 'P3'] },
  pronouns:                  { label: 'Pronouns',                         icon: '👤', levels: ['P1', 'P2', 'P3', 'P4'] },
  reflexivePronouns:         { label: 'Reflexive Pronouns (myself / yourselves / themselves)', icon: '🪞', levels: ['P2', 'P3', 'P4', 'P5', 'P6'] },
  tagQuestions:              { label: 'Tag Questions (isn’t he? / haven’t you?)', icon: '🏷️', levels: ['P3', 'P4', 'P5', 'P6'] },
  compoundIndefinite:        { label: 'Compound Indefinite Pronouns (somewhere / anyone)', icon: '🔍', levels: ['P3', 'P4', 'P5', 'P6'] },
  demonstratives:            { label: 'Demonstratives (this/that/these/those)', icon: '👉', levels: ['P1', 'P2'] },
  whQuestions:               { label: 'Wh- Questions (how/what/when/where/why)', icon: '❔', levels: ['P1', 'P2', 'P3', 'P4'] },
  svAgreement:               { label: 'Subject-Verb Agreement',           icon: '🤝', levels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] },
  simplePast:                { label: 'Simple Past Tense',                icon: '⏪', levels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] },
  presentCont:               { label: 'Present Continuous',               icon: '🔄', levels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] },
  pastCont:                  { label: 'Past Continuous',                  icon: '⏳', levels: ['P2', 'P3', 'P4', 'P5', 'P6'] },
  perfectContinuousTenses:   { label: 'Perfect & Continuous Tenses',      icon: '🕒', levels: ['P4', 'P5', 'P6'] },
  futureTense:               { label: 'Future Tense',                     icon: '🔮', levels: ['P2', 'P3', 'P4', 'P5', 'P6'] },
  presentPerfect:            { label: 'Present Perfect',                  icon: '✅', levels: ['P3', 'P4', 'P5', 'P6'] },
  pastPerfect:               { label: 'Past Perfect',                     icon: '🔙', levels: ['P4', 'P5', 'P6'] },
  tenseAwareness:            { label: 'Tense Awareness',                  icon: '⏰', levels: ['P3', 'P4', 'P5', 'P6'] },
  prepositions:              { label: 'Prepositions',                     icon: '📍', levels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] },
  connectors:                { label: 'Connectors',                       icon: '🔗', levels: ['P2', 'P3', 'P4', 'P5', 'P6'] },
  conjunctions:              { label: 'Conjunctions',                     icon: '🔗', levels: ['P3', 'P4', 'P5', 'P6'] },
  modals:                    { label: 'Modal Verbs',                      icon: '💪', levels: ['P3', 'P4', 'P5', 'P6'] },
  comparatives:              { label: 'Comparatives',                     icon: '📊', levels: ['P3', 'P4', 'P5'] },
  superlatives:              { label: 'Superlatives',                     icon: '🏆', levels: ['P3', 'P4', 'P5', 'P6'] },
  quantifiers:               { label: 'Quantifiers',                      icon: '🔢', levels: ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'] },
  passiveVoice:              { label: 'Passive Voice',                    icon: '🔃', levels: ['P5', 'P6'] },
  conditionals:              { label: 'Conditionals (If)',                icon: '❓', levels: ['P4', 'P5', 'P6'] },
  reportedSpeech:            { label: 'Reported Speech',                  icon: '💬', levels: ['P5', 'P6'] },
  relativeClauses:           { label: 'Relative Clauses',                 icon: '🧩', levels: ['P5', 'P6'] },
  countableUncountable:      { label: 'Countable & Uncountable Nouns',    icon: '🧺', levels: ['P2', 'P3', 'P4', 'P5', 'P6'] },
  possessives:               { label: 'Possessives',                      icon: '🏷', levels: ['P1', 'P2', 'P3', 'P4'] },
  adjAdverbs:                { label: 'Adjectives & Adverbs',             icon: '🎨', levels: ['P3', 'P4', 'P5', 'P6'] },
  auxiliaries:               { label: 'Auxiliaries & Questions',           icon: '🙋', levels: ['P3', 'P4', 'P5', 'P6'] },
  inversion:                 { label: 'Inversion & Advanced Structures',  icon: '🔀', levels: ['P6'] },
  mixedGrammar:              { label: 'Mixed Grammar (Exam)',             icon: '📝', levels: ['P5', 'P6'] },
};

/** Helper: does this category belong at the given level? */
export function categoryAppliesToLevel(categoryKey, level) {
  const meta = GRAMMAR_CATEGORIES[categoryKey];
  if (!meta) return false;
  if (!Array.isArray(meta.levels) || meta.levels.length === 0) return true;
  return meta.levels.includes(level);
}

/** Ordered list of category keys for UI iteration. */
export const GRAMMAR_CATEGORY_KEYS = Object.keys(GRAMMAR_CATEGORIES);
