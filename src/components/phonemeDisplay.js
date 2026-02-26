/**
 * PhonicsQuest – Phoneme Display Component
 *
 * Renders the color-coded phoneme tiles with diacritics below the word display.
 */

import { DIACRITICS } from '../data/words.js';

/** Map phoneme type codes to CSS class names */
const TYPE_CLASS = {
  c:  'consonant',
  sv: 'short-vowel',
  lv: 'long-vowel',
  d:  'digraph',
  bl: 'blend',
  se: 'silent-e',
  rc: 'r-control',
  dp: 'diphthong',
  sf: 'suffix',
};

/** Human-readable labels for phoneme types */
const TYPE_LABEL = {
  c:  'consonant',
  sv: 'short vowel',
  lv: 'long vowel',
  d:  'digraph',
  bl: 'blend',
  se: 'silent e',
  rc: 'r-controlled',
  dp: 'diphthong',
  sf: 'suffix',
};

/**
 * Render phoneme tiles into a container.
 * Each tile shows the grapheme, a diacritic mark, and a type label.
 *
 * @param {import('../data/words.js').Word} word
 * @param {HTMLElement} container  typically #phoneme-row
 * @param {object} [opts]
 * @param {boolean} [opts.showDiacritics=true]
 * @param {boolean} [opts.showLabels=false]
 * @param {number[]} [opts.hiddenIndices]  indices to show as "?" (for Missing Sound mode)
 * @param {number[]} [opts.revealedIndices]  only show these (for Blend mode sequential reveal)
 */
export function renderPhonemes(word, container, opts = {}) {
  const {
    showDiacritics = true,
    showLabels = false,
    hiddenIndices = [],
    revealedIndices = null,
  } = opts;

  container.innerHTML = '';

  for (let i = 0; i < word.graphemes.length; i++) {
    const grapheme = word.graphemes[i];
    const type     = word.types[i];
    const isHidden   = hiddenIndices.includes(i);
    const isRevealed = revealedIndices === null || revealedIndices.includes(i);

    const tile = document.createElement('div');
    tile.className = 'phoneme-tile';
    tile.setAttribute('role', 'listitem');

    // Symbol (the grapheme letter)
    const symbol = document.createElement('span');
    symbol.className = `phoneme-symbol phoneme-symbol--${TYPE_CLASS[type] || 'consonant'}`;

    if (isHidden) {
      symbol.textContent = '?';
      symbol.classList.add('phoneme-symbol--hidden');
      symbol.setAttribute('aria-label', 'missing sound');
    } else if (!isRevealed) {
      symbol.textContent = '•';
      symbol.classList.add('phoneme-symbol--unrevealed');
      symbol.setAttribute('aria-label', 'unrevealed sound');
    } else {
      symbol.textContent = grapheme;
      symbol.setAttribute('aria-label', `${grapheme}, ${TYPE_LABEL[type] || type}`);
    }

    tile.appendChild(symbol);

    // Diacritic mark (for vowels)
    if (showDiacritics && isRevealed && !isHidden) {
      const vowelBase = grapheme.toLowerCase().replace('ee', 'e').replace('ay', 'a');
      const diacriticMap = DIACRITICS[vowelBase];
      if (diacriticMap) {
        const mark = document.createElement('span');
        mark.className = 'phoneme-diacritic';
        if (type === 'sv') {
          mark.textContent = diacriticMap.sv;
        } else if (type === 'lv') {
          mark.textContent = diacriticMap.lv;
        }
        if (mark.textContent) tile.appendChild(mark);
      }
    }

    // Type label
    if (showLabels && isRevealed && !isHidden) {
      const label = document.createElement('span');
      label.className = 'phoneme-label';
      label.textContent = TYPE_LABEL[type] || '';
      tile.appendChild(label);
    }

    // Animation class
    if (isRevealed && !isHidden) {
      tile.style.animationDelay = `${i * 100}ms`;
    }

    container.appendChild(tile);
  }
}

/**
 * Render the word emoji/image above the word.
 * @param {import('../data/words.js').Word} word
 * @param {HTMLElement} emojiEl   #word-emoji
 * @param {boolean} [show=true]  whether to show the image (hidden in some modes)
 */
export function renderWordImage(word, emojiEl, show = true) {
  if (!emojiEl) return;
  emojiEl.textContent = show ? word.emoji : '';
  const wrap = emojiEl.closest('.word-image-wrap');
  if (wrap) wrap.style.display = show ? '' : 'none';
}
