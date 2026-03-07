/**
 * Shared Cloze Engine
 *
 * Reusable helpers for cloze-style quests (Cloze Castle + Word Vault).
 * Keeps rendering and interaction logic consistent between both modes.
 */

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
  bankWords.forEach(word => { word.used = false; });
  blankFills.fill(null);
}

export function buildUserAnswers(blankFills, bankWords) {
  return blankFills.map(id => bankWords.find(w => w.id === id)?.word || '');
}

export function fillNextBlank(bankWords, blankFills, id) {
  const item = bankWords.find(w => w.id === id);
  if (!item || item.used) return false;

  const blankIdx = blankFills.findIndex(fill => fill === null);
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
    html += `<span>${part}</span>`;
    if (i < parts.length - 1) {
      const fillId = blankFills[i];
      const fill = fillId !== null ? bankWords.find(w => w.id === fillId) : null;

      if (fill) {
        html += `<button class="${blankClass} ${filledClass}" data-blank="${i}" aria-label="${removeBlankAria(fill.word)}">${fill.word}</button>`;
      } else {
        html += `<button class="${blankClass}" data-blank="${i}" aria-label="${emptyBlankAria(i)}"></button>`;
      }
    }
  });

  container.innerHTML = html;

  container.querySelectorAll(`.${filledClass}`).forEach(blank => {
    blank.addEventListener('click', () => {
      const idx = parseInt(blank.dataset.blank, 10);
      const id = blankFills[idx];
      const item = bankWords.find(w => w.id === id);
      if (item) item.used = false;
      blankFills[idx] = null;
      onRemoveWord?.();
    });
  });

  if (onTapEmpty) {
    container.querySelectorAll(`.${blankClass}:not(.${filledClass})`).forEach(blank => {
      blank.addEventListener('click', () => onTapEmpty(blank));
    });
  }
}

export function renderClozeBank({ container, bankWords, chipClass, usedClass, onChooseWord }) {
  container.innerHTML = bankWords.map(w => `
    <button class="${chipClass} ${w.used ? usedClass : ''}"
            data-id="${w.id}"
            ${w.used ? 'disabled aria-disabled="true"' : ''}
            aria-label="${w.word}">${w.word}</button>
  `).join('');

  container.querySelectorAll(`.${chipClass}:not([disabled])`).forEach(chip => {
    chip.addEventListener('click', () => {
      const id = parseInt(chip.dataset.id, 10);
      onChooseWord(id);
    });
  });
}
