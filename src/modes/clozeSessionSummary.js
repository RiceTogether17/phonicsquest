import { escapeHtml } from '../utils/escapeHtml.js';

export function getModeConfig(mode = 'practice') {
  const exam = mode === 'exam';
  return {
    mode: exam ? 'exam' : 'practice',
    label: exam ? 'Exam Mode' : 'Practice Mode',
    allowHints: !exam,
    allowInfoPanel: !exam,
    showImmediateFeedback: !exam,
    showPerPassageReview: !exam,
    showFinalReviewOnly: exam,
    confettiPerPassage: !exam,
  };
}

export function getNextStepRecommendation({ accuracy = 0, skillLabel = 'grammar', hintsUsed = 0 }) {
  if (accuracy >= 90)
    return `Excellent! Move up a level, or replay in Exam Mode to test ${skillLabel} without hints.`;
  if (hintsUsed > 2)
    return `Strong effort — you used ${hintsUsed} hints. Replay and try to find each clue yourself before asking for help.`;
  return `Read the rule for ${skillLabel} once more, then try one more passage — a second attempt right away is the fastest way to improve.`;
}

export function buildCopySummaryText({
  modeLabel,
  title,
  category,
  level,
  scoreLine,
  accuracy,
  timeTaken = '',
  hintsUsed,
  clueScore,
  wrongLines = [],
  nextStep,
}) {
  const lines = [
    `Mode: ${modeLabel}`,
    `Passage: ${title}`,
    `Category: ${category}`,
    `Level: ${level}`,
    `Score: ${scoreLine}`,
    `Accuracy: ${accuracy}%`,
    `Time: ${timeTaken}`,
    `Hints used: ${hintsUsed}`,
    `Clue score: ${clueScore}%`,
    'Wrong answers:',
    ...(wrongLines.length ? wrongLines : ['- None']),
    `Next Step: ${nextStep}`,
  ];
  return lines
    .map((line) =>
      String(line || '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .join('\n');
}

export function getSummaryScoreLine({
  mode = 'practice',
  blankCorrect = 0,
  blankTotal = 0,
  passageCorrect = 0,
  passageTotal = 0,
}) {
  if (mode === 'exam') return `${blankCorrect}/${blankTotal}`;
  return `${blankCorrect || passageCorrect}/${blankTotal || passageTotal}`;
}

export function safeText(value) {
  return escapeHtml(String(value ?? ''));
}

const TEACHER_TIPS = {
  tense: 'Ask your child, "What time word in the sentence is your clue?"',
  connectorLogic:
    'Ask your child, "What does the connector tell you about the two ideas — contrast, reason, or result?"',
  contrast: 'Ask your child, "Which words show the opposite idea?"',
  causeEffect: 'Ask your child, "Which word tells you the reason or the result?"',
  collocation: 'Ask your child, "Which words usually go together in English?"',
  pronounReference: 'Ask your child, "Which person or thing does this pronoun point to?"',
  vocabularyInContext: 'Ask your child, "What clue in the sentence shows the meaning?"',
  subjectVerbAgreement: 'Ask your child, "Is the subject one person or many? Read it aloud."',
  grammar: 'Ask your child, "Read it aloud — does the sentence sound right?"',
  wordForm: 'Ask your child, "Is this word a noun, verb, adjective, or adverb here?"',
  spelling: 'Ask your child, "Which letters change when this word is added to the sentence?"',
  phrasalVerb: 'Ask your child, "Which little word goes with this verb to make sense?"',
  gist: 'Ask your child, "In one sentence, what is the passage mostly about?"',
  sentenceLogic: 'Ask your child, "What word in the sentence gives you the clue?"',
};

/**
 * Return a child-friendly teacher prompt for a single weak skill tag.
 * Falls back to the generic sentence-logic question if the tag is unknown.
 */
export function getTeacherTip(skillTag = '') {
  return TEACHER_TIPS[skillTag] || TEACHER_TIPS.sentenceLogic;
}

function _bestAccuracy(stats) {
  if (!stats || stats.total <= 0) return 0;
  return stats.correct / stats.total;
}

/**
 * Inspect a `{ [skillTag]: { correct, total, label } }` map and pick the
 * strongest + weakest skills for the parent report.
 *
 * `minSamples` filters out skills with too few attempts to be representative.
 * Returns `{ strongest, weakest }` where each entry is either null or
 * `{ skill, label, correct, total, accuracy }`.
 */
export function pickStrongestWeakest(skillStats = {}, { minSamples = 1 } = {}) {
  const entries = Object.entries(skillStats || {})
    .map(([skill, raw]) => ({
      skill,
      label: raw?.label || skill,
      correct: Number(raw?.correct || 0),
      total: Number(raw?.total || 0),
    }))
    .filter((e) => e.total >= minSamples);

  if (!entries.length) return { strongest: null, weakest: null };

  const sorted = [...entries].sort((a, b) => _bestAccuracy(b) - _bestAccuracy(a));
  const top = sorted[0];
  const bottom = sorted[sorted.length - 1];
  const decorate = (e) => ({
    ...e,
    accuracy: Math.round(_bestAccuracy(e) * 100),
  });
  return {
    strongest: decorate(top),
    weakest: top === bottom ? null : decorate(bottom),
  };
}

/**
 * Build a copyable parent / teacher report following the spec format:
 *
 *   {questLabel} Report
 *
 *   Score: 6/10
 *   Strength: Student could identify simple tense clues.
 *   Weakness: Student missed connector clues such as "although" and "however".
 *   Next Step: Practise 5 contrast-clue questions before the next passage.
 *
 *   Teacher Tip:
 *   Ask your child, "What word in the sentence gives you the clue?"
 */
export function buildParentReport({
  questLabel = 'Cloze Castle',
  scoreLine = '0/0',
  accuracy = 0,
  modeLabel = '',
  strongest = null,
  weakest = null,
  weakExamples = [],
  recommendation = 'Try one more passage with the scan task on.',
  teacherTip,
} = {}) {
  const accuracyLine = Number.isFinite(accuracy)
    ? `Score: ${scoreLine} (${accuracy}%)`
    : `Score: ${scoreLine}`;

  const strengthLine = strongest
    ? `Strength: Student could identify ${String(strongest.label || strongest.skill).toLowerCase()} clues (${strongest.correct}/${strongest.total}).`
    : 'Strength: Steady effort across the session.';

  const examplesText = weakExamples.length
    ? ` such as ${weakExamples.map((e) => `"${e}"`).join(' and ')}`
    : '';
  const weaknessLine = weakest
    ? `Weakness: Student missed ${String(weakest.label || weakest.skill).toLowerCase()} clues${examplesText} (${weakest.correct}/${weakest.total}).`
    : 'Weakness: No major gaps detected — keep stretching with harder passages.';

  const tipKey = weakest?.skill || strongest?.skill;
  const tip = teacherTip || getTeacherTip(tipKey);

  const lines = [
    `${questLabel} Report`,
    '',
    accuracyLine,
    modeLabel ? `Mode: ${modeLabel}` : null,
    strengthLine,
    weaknessLine,
    `Next Step: ${recommendation}`,
    '',
    'Teacher Tip:',
    tip,
  ].filter((line) => line !== null);

  return lines.join('\n');
}

/**
 * Group exam-mode wrong rows by their skillLabel and return one summary
 * line per group. Each row should carry { skillLabel, passageTitle,
 * blank, studentAnswer, correctAnswer }.
 *
 * Returns an array of strings ready to drop into a copyable summary, e.g.
 *   "By skill — Verb tense (2 wrong):"
 *   "  - Storm Day #1: walk → walked"
 */
export function groupWrongLinesBySkill(rows = []) {
  const groups = new Map();
  for (const row of rows) {
    const label = String(row?.skillLabel || 'Other').trim() || 'Other';
    const list = groups.get(label) || [];
    list.push(row);
    groups.set(label, list);
  }
  if (!groups.size) return [];
  const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length);
  const lines = [];
  for (const [label, list] of ordered) {
    lines.push(`By skill — ${label} (${list.length} wrong):`);
    for (const row of list) {
      const studentAnswer = row.studentAnswer || '(blank)';
      const correctAnswer = row.correctAnswer || '?';
      const title = row.passageTitle || 'Passage';
      const blank = row.blank || '';
      lines.push(`  - ${title} ${blank}: ${studentAnswer} → ${correctAnswer}`);
    }
  }
  return lines;
}
