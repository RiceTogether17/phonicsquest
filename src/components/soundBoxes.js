/**
 * PhonicsQuest – Elkonin sound boxes
 *
 * One box per phoneme, filled as the child isolates each sound. This is the
 * canonical phonemic-awareness scaffold: it makes the *count* and *order* of
 * sounds in a word visible before (and alongside) the letters that spell
 * them, which is the whole point of the segmenting stage.
 *
 * `soundCount.js` and `oralSegment.js` have cited Elkonin boxes in their
 * headers as the model since they were written, but the visual itself was
 * never built — modes rendered bare, unstyled slots. This is that visual.
 *
 * Generated from data every word already carries (`phonemes`, `graphemes`,
 * `types`), so it covers the whole 1,080-word bank and every 2–8 sound
 * length with no per-word assets.
 *
 * Implementation note: these are rectangles containing text, so this renders
 * DOM + CSS rather than SVG. DOM gives correct text shaping, real
 * screen-reader semantics and theme inheritance for free; SVG would buy
 * nothing here and cost all three.
 *
 * Colour comes from the shared `--c-*` variables via TYPE_CLASS, so the
 * boxes track the default, high-contrast and dyslexia themes automatically.
 *
 * Accessibility: state is never carried by colour alone — a filled box shows
 * its grapheme, an empty box shows a placeholder, and every box carries an
 * aria-label naming its position, state and sound type.
 */

import { TYPE_CLASS, TYPE_LABEL } from './phonemeDisplay.js';

/** Placeholder glyph in an unfilled box. Decorative — aria-label carries the meaning. */
const EMPTY_MARK = '·';

/**
 * @typedef {object} SoundBoxOpts
 * @property {number[]} [filledIndices]   boxes the child has completed
 * @property {number|null} [activeIndex]  the box currently being worked on
 * @property {number[]} [correctIndices]  boxes confirmed correct
 * @property {number[]} [retryIndices]    boxes to try again (never "wrong")
 * @property {boolean} [showGraphemes]    render the letters in filled boxes
 * @property {string}  [label]            override the group aria-label
 */

/**
 * Render sound boxes for a word into `host`.
 *
 * @param {import('../data/words.js').Word} word
 * @param {HTMLElement} host
 * @param {SoundBoxOpts} [opts]
 * @returns {number} how many boxes were rendered
 */
export function renderSoundBoxes(word, host, opts = {}) {
  if (!host) return 0;
  host.innerHTML = '';
  if (!word) return 0;

  const {
    filledIndices = [],
    activeIndex = null,
    correctIndices = [],
    retryIndices = [],
    showGraphemes = true,
    label = null,
  } = opts;

  const count = soundCount(word);
  if (count === 0) return 0;

  const filled = new Set(filledIndices);
  const correct = new Set(correctIndices);
  const retry = new Set(retryIndices);

  host.className = `sound-boxes sound-boxes--n${count}`;
  // list/listitem, not group/img: the boxes are an ordered sequence, and
  // role="img" per box would announce each one as a separate image.
  host.setAttribute('role', 'list');
  host.setAttribute(
    'aria-label',
    label || `Sound boxes: ${count} sound${count === 1 ? '' : 's'}, ${filled.size} filled`,
  );

  for (let i = 0; i < count; i++) {
    const typeCode = word.types?.[i];
    const typeClass = TYPE_CLASS[typeCode] || 'consonant';
    const typeName = TYPE_LABEL[typeCode] || 'sound';
    const grapheme = word.graphemes?.[i] || '';

    const isFilled = filled.has(i);
    const box = document.createElement('div');

    const state = correct.has(i) ? 'correct'
      : retry.has(i) ? 'retry'
      : isFilled ? 'filled'
      : i === activeIndex ? 'active'
      : 'empty';

    box.className = `sound-box sound-box--${state} sound-box--${typeClass}`;
    box.dataset.index = String(i);
    box.dataset.state = state;

    // Visible content distinguishes states without relying on colour.
    const mark = document.createElement('span');
    mark.className = 'sound-box__mark';
    mark.textContent = isFilled && showGraphemes ? grapheme : EMPTY_MARK;
    mark.setAttribute('aria-hidden', 'true');
    box.appendChild(mark);

    box.setAttribute('role', 'listitem');
    box.setAttribute('aria-label', _boxLabel(i, count, state, typeName, grapheme, showGraphemes));

    host.appendChild(box);
  }

  return count;
}

/**
 * How many sounds a word has. Prefers `phonemes`, falls back to `graphemes`
 * so a word with incomplete data still renders a sensible track.
 * @param {import('../data/words.js').Word} word
 */
export function soundCount(word) {
  if (!word) return 0;
  if (Array.isArray(word.phonemes) && word.phonemes.length) return word.phonemes.length;
  if (Array.isArray(word.graphemes) && word.graphemes.length) return word.graphemes.length;
  return 0;
}

/**
 * Update box states without rebuilding the DOM — used on every tap, so it
 * avoids re-creating nodes (and losing focus) mid-interaction.
 *
 * @param {HTMLElement} host
 * @param {SoundBoxOpts} opts
 */
export function updateSoundBoxes(host, opts = {}) {
  if (!host) return;
  const {
    filledIndices = [],
    activeIndex = null,
    correctIndices = [],
    retryIndices = [],
  } = opts;

  const filled = new Set(filledIndices);
  const correct = new Set(correctIndices);
  const retry = new Set(retryIndices);
  const boxes = host.querySelectorAll('.sound-box');

  boxes.forEach((box, i) => {
    const state = correct.has(i) ? 'correct'
      : retry.has(i) ? 'retry'
      : filled.has(i) ? 'filled'
      : i === activeIndex ? 'active'
      : 'empty';

    // Swap only the state class, preserving the type colour class.
    box.className = box.className.replace(/sound-box--(empty|active|filled|correct|retry)/, `sound-box--${state}`);
    box.dataset.state = state;

    const mark = box.querySelector('.sound-box__mark');
    if (mark && !filled.has(i) && !correct.has(i)) mark.textContent = EMPTY_MARK;
  });

  host.setAttribute(
    'aria-label',
    `Sound boxes: ${boxes.length} sound${boxes.length === 1 ? '' : 's'}, ${filled.size} filled`,
  );
}

/**
 * Fill one box with its grapheme.
 * @param {HTMLElement} host
 * @param {number} index
 * @param {string} grapheme
 */
export function fillSoundBox(host, index, grapheme) {
  const box = host?.querySelector(`.sound-box[data-index="${index}"]`);
  if (!box) return;
  const mark = box.querySelector('.sound-box__mark');
  if (mark) mark.textContent = grapheme;
}

/** @private */
function _boxLabel(i, count, state, typeName, grapheme, showGraphemes) {
  const position = `Sound ${i + 1} of ${count}`;
  if (state === 'correct') return `${position}: ${showGraphemes ? `${grapheme}, ` : ''}correct`;
  if (state === 'retry')   return `${position}: try again`;
  if (state === 'filled')  return `${position}: ${showGraphemes ? `${grapheme}, ` : ''}filled, ${typeName}`;
  if (state === 'active')  return `${position}: current, empty`;
  return `${position}: empty`;
}

export const __TEST__ = { EMPTY_MARK, _boxLabel };
