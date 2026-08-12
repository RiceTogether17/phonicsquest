import { diagnoseAnswer } from '../modules/answerDiagnosis.js';

export const TRAINING_STAGES = Object.freeze(['LEARN', 'GUIDED', 'EXAM', 'REVIEW', 'MASTERY']);

export const CLOZE_SKILL_TAGS = Object.freeze([
  'gist',
  'grammar',
  'tense',
  'subjectVerbAgreement',
  'pronounReference',
  'connectorLogic',
  'contrast',
  'causeEffect',
  'vocabularyInContext',
  'collocation',
  'phrasalVerb',
  'wordForm',
  'spelling',
  'sentenceLogic',
]);

export const CLUE_TYPES = Object.freeze([
  'timeClue',
  'grammarClue',
  'meaningClue',
  'contrastClue',
  'causeEffectClue',
  'repeatedIdeaClue',
  'wordFamilyClue',
  'collocationClue',
  'pronounReferenceClue',
  'connectorClue',
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
  timeClue: 'Time clue',
  grammarClue: 'Grammar clue',
  meaningClue: 'Meaning clue',
  contrastClue: 'Contrast clue',
  causeEffectClue: 'Cause-effect clue',
  repeatedIdeaClue: 'Repeated idea clue',
  wordFamilyClue: 'Word family clue',
  collocationClue: 'Collocation clue',
  pronounReferenceClue: 'Pronoun reference clue',
  connectorClue: 'Connector clue',
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
  if (accuracy < 60)
    return `Retry ${getSkillLabel(firstWeak).toLowerCase()} with one clue at a time.`;
  if (hintsUsed > 3) return `Do one guided round on ${getSkillLabel(firstWeak).toLowerCase()}.`;
  if (weakSkills.length > 0)
    return `Practise ${getSkillLabel(firstWeak).toLowerCase()} in exam mode next.`;
  return 'Great job. Try a harder level for mastery.';
}

/**
 * Normalise per-blank metadata into a single shape.
 *
 * Supports three input shapes for `passage.blankSkills[blankIndex]`:
 *   1. Rich object: `{ blankIndex, primarySkill, clueType, expectedThinking,
 *      correctReason, wrongOptionTraps, examTip }`
 *   2. String tag (legacy): "tense", "connectorLogic", …
 *   3. Missing: falls back to clue + passage-level fields.
 *
 * Returns a normalised meta object with safe defaults so callers never need
 * optional-chaining beyond the top level.
 */
export function getBlankSkillMeta(passage = {}, blankIndex = 0) {
  const rawArray = Array.isArray(passage.blankSkills) ? passage.blankSkills : [];
  let raw = rawArray[blankIndex];
  if (!raw && rawArray.length) {
    raw = rawArray.find(
      (entry) => entry && typeof entry === 'object' && entry.blankIndex === blankIndex,
    );
  }

  let meta = {};
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    meta = { ...raw };
  } else if (typeof raw === 'string') {
    meta.primarySkill = raw;
  }

  const clue = Array.isArray(passage.clues)
    ? passage.clues.find((c) => c && c.blankIndex === blankIndex)
    : null;
  if (clue) {
    if (!meta.clueType) meta.clueType = clue.clueType;
    if (!meta.expectedThinking) meta.expectedThinking = clue.prompt;
    if (!meta.correctReason) meta.correctReason = clue.explanation;
  }

  if (!meta.simpleMeaning) meta.simpleMeaning = passage.simpleMeaning;
  if (!meta.partOfSpeech) meta.partOfSpeech = passage.partOfSpeech;
  if (!meta.writingUse) meta.writingUse = passage.writingUse;

  if (!meta.wrongOptionTraps && Array.isArray(passage.wrongOptionTraps)) {
    meta.wrongOptionTraps = passage.wrongOptionTraps.reduce((acc, item) => {
      if (item && item.option) acc[item.option] = item.reason || '';
      return acc;
    }, {});
  }

  meta.primarySkill = normaliseSkillTag(meta.primarySkill);
  return meta;
}

/**
 * Build a child-friendly explanation for a wrong answer.
 *
 * Returns five short fields the review UI can stack:
 *   - whyWrong:   why the chosen option does not fit
 *   - whyRight:   why the correct option fits
 *   - missedClue: which words in the sentence were the clue
 *   - examTip:    one-line study tip
 *   - misconceptionId: the named slip, for the cross-mode pattern log
 *
 * Authored `wrongOptionTraps` still win — a human sentence about *this*
 * distractor beats a detected category. Where none exists, the generic
 * "…does not match the clue in this sentence" is replaced by the named
 * misconception from `answerDiagnosis`, so the review says what the child
 * actually did rather than only that it was wrong.
 *
 * @param {object} params
 * @param {object} [params.meta]    per-blank metadata
 * @param {string} [params.chosen]
 * @param {string} [params.correct]
 * @param {string} [params.stem]    the sentence around this blank, `___` for the gap
 * @param {string} [params.domain]  'grammar' | 'vocab'
 */
export function buildWhyWrongExplanation({
  meta = {},
  chosen = '',
  correct = '',
  stem = '',
  domain = 'grammar',
} = {}) {
  const traps = meta.wrongOptionTraps || {};
  const trap = chosen && Object.prototype.hasOwnProperty.call(traps, chosen) ? traps[chosen] : '';

  const diagnosis = diagnoseAnswer({
    stem,
    given: chosen,
    correct,
    skill: meta.primarySkill || '',
    domain,
  });
  const named = diagnosis.matched ? diagnosis.misconception : null;

  const whyWrong =
    trap ||
    (named && chosen ? `"${chosen}" — that is ${named.childName}. ${named.rule}` : '') ||
    (chosen
      ? `"${chosen}" does not match the clue in this sentence.`
      : 'No answer was chosen for this blank.');

  const whyRight =
    meta.correctReason ||
    (correct
      ? `"${correct}" fits the meaning the sentence builds up to.`
      : 'Re-read the sentence to find the best fit.');

  const missedClue =
    meta.expectedThinking ||
    (diagnosis.evidence ? `The clue was "${diagnosis.evidence}".` : '') ||
    (meta.clueType
      ? `Look for the ${getClueTypeLabel(meta.clueType).toLowerCase()} near the blank.`
      : 'Check the words just before and after the blank.');

  const examTip = meta.examTip || named?.selfCheck || getReviewPromptForSkill(meta.primarySkill);

  return { whyWrong, whyRight, missedClue, examTip, misconceptionId: diagnosis.id };
}
