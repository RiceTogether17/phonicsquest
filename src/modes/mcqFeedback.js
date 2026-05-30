import { escapeHtml } from '../utils/escapeHtml.js';

function getSelectedOptionExplanation(item, selectedChoice) {
  const explanations = item?.optionExplanations;
  if (!explanations || typeof explanations !== 'object') return '';
  return explanations[selectedChoice] || '';
}

function renderClueWords(clueWords) {
  if (!Array.isArray(clueWords) || clueWords.length === 0) return '';
  return `<br><span class="mcq-clue-words"><strong>🔍 Clue words:</strong> ${clueWords.map(w => `<span class="mcq-clue-chip">${escapeHtml(w)}</span>`).join(' ')}</span>`;
}

/**
 * Build the post-answer feedback shown by Grammar/Vocabulary MCQ modes.
 *
 * `optionExplanations` is optional and additive: existing items keep the
 * current general explanation, while richer items can explain the selected
 * distractor specifically ("why this option was wrong"). General reasoning or
 * explain text is still appended as the transferable rule for the next item.
 *
 * @param {object} item
 * @param {string} selectedChoice
 * @param {boolean} isCorrect
 * @returns {string}
 */
export function buildMcqFeedbackHtml(item, selectedChoice, isCorrect, { showClueWords = true } = {}) {
  let hintText = isCorrect
    ? '✅ <strong>Correct!</strong>'
    : `❌ <strong>Correct answer:</strong> ${escapeHtml(item.answer)}`;

  if (showClueWords) hintText += renderClueWords(item.clueWords);

  const selectedExplanation = getSelectedOptionExplanation(item, selectedChoice);
  if (selectedExplanation) {
    hintText += `<br><span class="mcq-option-feedback">${escapeHtml(selectedExplanation)}</span>`;
  }

  // explain/reasoning intentionally carry light HTML formatting (e.g. <strong>)
  // from static data; keep that existing behaviour for backwards compatibility.
  if (item.reasoning) {
    hintText += `<br><span class="mcq-reasoning">${item.reasoning}</span>`;
  } else if (item.explain) {
    hintText += `<br>${item.explain}`;
  }

  return hintText;
}
