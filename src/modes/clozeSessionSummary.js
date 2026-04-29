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
  if (accuracy >= 90) return `Great work. Keep this level and refine ${skillLabel} speed.`;
  if (hintsUsed > 2) return `Strong effort. Retry with fewer hints and focus on ${skillLabel}.`;
  return `Revise ${skillLabel} clues and attempt one more passage.`;
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
  return lines.map((line) => String(line || '').replace(/\s+/g, ' ').trim()).join('\n');
}

export function getSummaryScoreLine({ mode = 'practice', blankCorrect = 0, blankTotal = 0, passageCorrect = 0, passageTotal = 0 }) {
  if (mode === 'exam') return `${blankCorrect}/${blankTotal}`;
  return `${blankCorrect || passageCorrect}/${blankTotal || passageTotal}`;
}

export function safeText(value) {
  return escapeHtml(String(value ?? ''));
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
