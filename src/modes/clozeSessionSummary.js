import { escapeHtml } from '../utils/escapeHtml.js';

export function getModeConfig(mode = 'practice') {
  const exam = mode === 'exam';
  return {
    mode: exam ? 'exam' : 'practice',
    label: exam ? 'Exam Mode' : 'Practice Mode',
    hintsInline: !exam,
    immediateFeedback: !exam,
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
    `Hints used: ${hintsUsed}`,
    `Clue score: ${clueScore}%`,
    'Wrong answers:',
    ...(wrongLines.length ? wrongLines : ['- None']),
    `Next Step: ${nextStep}`,
  ];
  return lines.map((line) => String(line || '').replace(/\s+/g, ' ').trim()).join('\n');
}

export function safeText(value) {
  return escapeHtml(String(value ?? ''));
}
