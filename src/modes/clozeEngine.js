/**
 * Shared Cloze Engine
 *
 * Reusable helpers for cloze-style quests (Cloze Castle + Word Vault).
 * Keeps rendering and interaction logic consistent between both modes.
 */

import { escapeAttr, escapeHtml } from '../utils/escapeHtml.js';

export function createClozeRound(passage) {
  const blankCount = (passage.text.match(/___/g) || []).length;
  const bankWords = passage.wordBank.map((word, id) => ({ id, word, used: false }));

  for (let i = bankWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bankWords[i], bankWords[j]] = [bankWords[j], bankWords[i]];
  }

  return {
    bankWords,
    blankFills: Array(blankCount).fill(null),
  };
}

export function clearClozeRound(bankWords, blankFills) {
  bankWords.forEach((word) => {
    word.used = false;
  });
  blankFills.fill(null);
}

/**
 * Is this word right for this blank?
 *
 * Each blank has one keyed answer, but English often allows a second: "although"
 * where the passage has "even though", "which" for "that" in a defining clause,
 * "should" for "must" in a rule. A child who picks one of those has not made a
 * mistake, and marking it wrong teaches them to distrust a correct instinct.
 * Such alternatives are listed per blank in `passage.acceptableAnswers`.
 *
 * @param {{answers: string[], acceptableAnswers?: (string[]|undefined)[]}} passage
 * @param {number} idx
 * @param {string} answer
 */
export function isBlankAnswerCorrect(passage, idx, answer) {
  if (answer === passage.answers[idx]) return true;
  const alternatives = passage.acceptableAnswers?.[idx];
  return Array.isArray(alternatives) && alternatives.includes(answer);
}

export function buildUserAnswers(blankFills, bankWords) {
  return blankFills.map((id) => bankWords.find((w) => w.id === id)?.word || '');
}

export function fillNextBlank(bankWords, blankFills, id) {
  const item = bankWords.find((w) => w.id === id);
  if (!item || item.used) return false;

  const blankIdx = blankFills.findIndex((fill) => fill === null);
  if (blankIdx === -1) return false;

  item.used = true;
  blankFills[blankIdx] = id;
  return true;
}

export function renderClozePassage({
  container,
  text,
  blankFills,
  bankWords,
  blankClass,
  filledClass,
  emptyBlankAria,
  removeBlankAria,
  onRemoveWord,
  onTapEmpty,
}) {
  const parts = text.split('___');
  let html = '';

  parts.forEach((part, i) => {
    html += `<span>${escapeHtml(part)}</span>`;
    if (i < parts.length - 1) {
      const fillId = blankFills[i];
      const fill = fillId !== null ? bankWords.find((w) => w.id === fillId) : null;

      if (fill) {
        html += `<button class="${blankClass} ${filledClass}" data-blank="${i}" aria-label="${escapeAttr(removeBlankAria(fill.word))}">${escapeHtml(fill.word)}</button>`;
      } else {
        html += `<button class="${blankClass}" data-blank="${i}" aria-label="${escapeAttr(emptyBlankAria(i))}"></button>`;
      }
    }
  });

  container.innerHTML = html;

  container.querySelectorAll(`.${filledClass}`).forEach((blank) => {
    blank.addEventListener('click', () => {
      const idx = parseInt(blank.dataset.blank, 10);
      const id = blankFills[idx];
      const item = bankWords.find((w) => w.id === id);
      if (item) item.used = false;
      blankFills[idx] = null;
      onRemoveWord?.();
    });
  });

  if (onTapEmpty) {
    container.querySelectorAll(`.${blankClass}:not(.${filledClass})`).forEach((blank) => {
      blank.addEventListener('click', () => onTapEmpty(blank));
    });
  }
}

export function renderClozeBank({ container, bankWords, chipClass, usedClass, onChooseWord }) {
  container.innerHTML = bankWords
    .map(
      (w) => `
    <button class="${chipClass} ${w.used ? usedClass : ''}"
            data-id="${w.id}"
            ${w.used ? 'disabled aria-disabled="true"' : ''}
            aria-label="${escapeAttr(w.word)}">${escapeHtml(w.word)}</button>
  `,
    )
    .join('');

  container.querySelectorAll(`.${chipClass}:not([disabled])`).forEach((chip) => {
    chip.addEventListener('click', () => {
      const id = parseInt(chip.dataset.id, 10);
      onChooseWord(id);
    });
  });
}
