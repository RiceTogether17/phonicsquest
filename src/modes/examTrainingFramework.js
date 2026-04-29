export const TRAINING_STAGES = Object.freeze(['LEARN', 'GUIDED', 'EXAM', 'REVIEW', 'MASTERY']);

export const CLOZE_SKILL_TAGS = Object.freeze([
  'gist', 'grammar', 'tense', 'subjectVerbAgreement', 'pronounReference', 'connectorLogic',
  'contrast', 'causeEffect', 'vocabularyInContext', 'collocation', 'phrasalVerb', 'wordForm', 'spelling', 'sentenceLogic',
]);

export const CLUE_TYPES = Object.freeze([
  'timeClue', 'grammarClue', 'meaningClue', 'contrastClue', 'causeEffectClue',
  'repeatedIdeaClue', 'wordFamilyClue', 'collocationClue', 'pronounReferenceClue', 'connectorClue',
]);

const SKILL_LABELS = {
  gist: 'Main idea',
  grammar: 'Grammar check',
  tense: 'Verb tense',
  subjectVerbAgreement: 'Subject-verb agreement',
  pronounReference: 'Pronoun reference',
  connectorLogic: 'Connector logic',
  contrast: 'Contrast idea',
  causeEffect: 'Cause and effect',
  vocabularyInContext: 'Meaning in context',
  collocation: 'Word partners',
  phrasalVerb: 'Phrasal verbs',
  wordForm: 'Word form',
  spelling: 'Spelling',
  sentenceLogic: 'Sentence logic',
};

const CLUE_LABELS = {
  timeClue: 'Time clue', grammarClue: 'Grammar clue', meaningClue: 'Meaning clue', contrastClue: 'Contrast clue',
  causeEffectClue: 'Cause-effect clue', repeatedIdeaClue: 'Repeated idea clue', wordFamilyClue: 'Word family clue',
  collocationClue: 'Collocation clue', pronounReferenceClue: 'Pronoun reference clue', connectorClue: 'Connector clue',
};

const REVIEW_PROMPTS = {
  tense: 'Look for time words before choosing the verb.',
  connectorLogic: 'Check if the ideas show contrast, reason, or result.',
  collocation: 'Check which words usually go together.',
  pronounReference: 'Find which noun the pronoun points to.',
  vocabularyInContext: 'Use sentence clues to match the meaning.',
  sentenceLogic: 'Check the words before and after the blank.',
};

export function normaliseSkillTag(tag) {
  return CLOZE_SKILL_TAGS.includes(tag) ? tag : 'sentenceLogic';
}

export function getSkillLabel(tag) {
  return SKILL_LABELS[normaliseSkillTag(tag)] || SKILL_LABELS.sentenceLogic;
}

export function getClueTypeLabel(type) {
  return CLUE_LABELS[type] || 'Sentence clue';
}

export function getReviewPromptForSkill(tag) {
  return REVIEW_PROMPTS[normaliseSkillTag(tag)] || REVIEW_PROMPTS.sentenceLogic;
}

export function getMasteryRecommendation({ weakSkills = [], hintsUsed = 0, accuracy = 0 } = {}) {
  const firstWeak = normaliseSkillTag(weakSkills[0]);
  if (accuracy < 60) return `Retry ${getSkillLabel(firstWeak).toLowerCase()} with one clue at a time.`;
  if (hintsUsed > 3) return `Do one guided round on ${getSkillLabel(firstWeak).toLowerCase()}.`;
  if (weakSkills.length > 0) return `Practise ${getSkillLabel(firstWeak).toLowerCase()} in exam mode next.`;
  return 'Great job. Try a harder level for mastery.';
}
