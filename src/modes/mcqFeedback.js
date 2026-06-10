import { escapeHtml } from '../utils/escapeHtml.js';
import { explainMistake, getAdaptiveHint } from '../modules/aiService.js';
import { attachAskGiriButton } from '../components/askGiriButton.js';

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

/**
 * Append an on-demand "Ask Giri why ✨" button below the authored feedback.
 *
 * Strictly additive: the authored explanation is already rendered; this
 * only appears when an API key is configured and asks the AI to elaborate
 * in child-safe language. Call after setting the feedback element's HTML.
 *
 * @param {HTMLElement|null} hintEl  the feedback element
 * @param {object} params            { item, selectedChoice, level }
 */
export function attachAskGiri(hintEl, { item, selectedChoice, level = '' } = {}) {
  if (!hintEl || !item) return;
  const authored = item.optionExplanations?.[selectedChoice] || item.explain || '';
  attachAskGiriButton(hintEl, () => explainMistake({
    question: item.q,
    options: item.choices,
    chosen: selectedChoice,
    correct: item.answer,
    authoredExplanation: typeof authored === 'string' ? authored.replace(/<[^>]*>/g, '') : '',
    level,
  }));
}

/**
 * Append a "Giri's hint ✨" button to the rule-hint panel: a question-specific
 * nudge that never names a choice. Sits above the authored rule/example/tip
 * tiers, which remain the offline default.
 *
 * @param {HTMLElement|null} panelEl  the opened rule-hint panel
 * @param {object} params             { item, categoryLabel, level }
 */
export function attachGiriHint(panelEl, { item, categoryLabel = '', level = '' } = {}) {
  if (!panelEl || !item || panelEl.querySelector('.mcq-ask-giri')) return;
  attachAskGiriButton(panelEl, () => getAdaptiveHint({
    question: item.q,
    options: item.choices,
    correct: item.answer,
    categoryLabel,
    level,
  }), { label: "Giri's hint for this question ✨", ariaLabel: 'Ask Giri for a hint about this question' });
}
