/**
 * PhonicsQuest – Master Vocabulary Category Spine
 *
 * Single source of truth for vocabulary category definitions shared by
 * Vocabulary Cloze (Word Vault) and Vocabulary MCQ.
 *
 * SPIRAL PROGRESSION: every strand recurs across P1-P6 with increasing
 * sophistication.  MCQ items and Cloze passages reference the same
 * category keys so mastery data stays meaningful across modes.
 *
 * When adding a new category, update this file and both data consumers
 * (vocabPassages.js, vocabMcq.js) will inherit it automatically.
 */

export const VOCAB_CATEGORIES = {
  contextInference: {
    label: 'Context Clue',
    icon: '🔎',
    color: '#6c63ff',
    desc: 'Use the story to guess the missing word',
  },
  definitionMatch: {
    label: 'Definition Match',
    icon: '📖',
    color: '#0ea5e9',
    desc: 'Match words to their meanings',
  },
  synonymContrast: {
    label: 'Synonym & Contrast',
    icon: '⚖️',
    color: '#22c55e',
    desc: 'Find words that mean the same or opposite',
  },
  morphologicalAffix: {
    label: 'Word Parts',
    icon: '🔧',
    color: '#f97316',
    desc: 'Use prefixes and suffixes to build words',
  },
  collocationCloze: {
    label: 'Word Partners',
    icon: '🤝',
    color: '#a855f7',
    desc: 'Words that naturally go together',
  },
  grammaticalRole: {
    label: 'Word Form in Context',
    icon: '🏷️',
    color: '#ec4899',
    desc: 'Choose the right noun, verb, or adjective',
  },
  connectorClue: {
    label: 'Connectors',
    icon: '🔗',
    color: '#0d9488',
    desc: 'Link ideas with the right connector word',
  },
  idiomaticExpressions: {
    label: 'Idiomatic Expressions',
    icon: '💬',
    color: '#7c3aed',
    desc: 'Use common idioms from context clues',
  },
  proverbsSayings: {
    label: 'Proverbs & Sayings',
    icon: '🪶',
    color: '#ca8a04',
    desc: 'Complete famous sayings with meaning clues',
  },
  scienceTechTerms: {
    label: 'Science & Technology',
    icon: '🧪',
    color: '#0891b2',
    desc: 'Topic vocabulary for science and technology',
  },
  socialStudiesVocab: {
    label: 'Social Studies Vocabulary',
    icon: '🏛️',
    color: '#2563eb',
    desc: 'Citizenship, community and governance terms',
  },
  grammarPrepositions: {
    label: 'Prepositions',
    icon: '📍',
    color: '#64748b',
    desc: 'Choose the correct preposition in context',
  },
  grammarArticles: {
    label: 'Articles',
    icon: '📰',
    color: '#475569',
    desc: 'Select the right article (a, an, the)',
  },
  grammarSVA: {
    label: 'Subject-Verb Agreement',
    icon: '🤝',
    color: '#334155',
    desc: 'Match subjects with the correct verb form',
  },
};

/** Ordered list of category keys for UI iteration. */
export const VOCAB_CATEGORY_KEYS = Object.keys(VOCAB_CATEGORIES);
