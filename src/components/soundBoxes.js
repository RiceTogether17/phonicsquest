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
 * @property {number|null} [targetIndex]  the sound this round is *about*
 *   (First/Last/Middle Sound) — ringed so the child sees which position in
 *   the word they just identified
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
    targetIndex = null,
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

    const state = correct.has(i)
      ? 'correct'
      : retry.has(i)
        ? 'retry'
        : isFilled
          ? 'filled'
          : i === activeIndex
            ? 'active'
            : 'empty';

    const isTarget = i === targetIndex;
    box.className =
      `sound-box sound-box--${state} sound-box--${typeClass}` +
      (isTarget ? ' sound-box--target' : '');
    box.dataset.index = String(i);
    box.dataset.state = state;
    if (isTarget) box.dataset.target = 'true';

    // Visible content distinguishes states without relying on colour.
    const mark = document.createElement('span');
    mark.className = 'sound-box__mark';
    mark.textContent = isFilled && showGraphemes ? grapheme : EMPTY_MARK;
    mark.setAttribute('aria-hidden', 'true');
    box.appendChild(mark);

    box.setAttribute('role', 'listitem');
    box.setAttribute(
      'aria-label',
      _boxLabel(i, count, state, typeName, grapheme, showGraphemes, isTarget),
    );

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
  const { filledIndices = [], activeIndex = null, correctIndices = [], retryIndices = [] } = opts;

  const filled = new Set(filledIndices);
  const correct = new Set(correctIndices);
  const retry = new Set(retryIndices);
  const boxes = host.querySelectorAll('.sound-box');

  boxes.forEach((box, i) => {
    const state = correct.has(i)
      ? 'correct'
      : retry.has(i)
        ? 'retry'
        : filled.has(i)
          ? 'filled'
          : i === activeIndex
            ? 'active'
            : 'empty';

    // Swap only the state class, preserving the type colour class.
    box.className = box.className.replace(
      /sound-box--(empty|active|filled|correct|retry)/,
      `sound-box--${state}`,
    );
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

/** Id of the shared container used by the reveal helper. */
const REVEAL_HOST_ID = 'reveal-sound-boxes';

/**
 * Show the completed sound track as part of a round's *reveal*.
 *
 * The oral phonemic-awareness modes (Sound Count, Tap the Sounds, First /
 * Last / Middle Sound) deliberately keep the boxes hidden while the child
 * is answering — `oralSegment.js` puts it plainly: "a visible box count
 * would leak the answer". So the scaffold belongs after the answer, where
 * it turns an abstract count into something the child can see.
 *
 * Creates (or reuses) a container directly after the phoneme row and fills
 * every box, since by reveal time the whole word is known.
 *
 * @param {import('../data/words.js').Word} word
 * @param {{ phonemeRow: HTMLElement }} els  the mode's DOM refs
 * @param {SoundBoxOpts} [opts]  typically { targetIndex } and/or
 *   { showGraphemes: false } for the grapheme-free modes
 * @returns {HTMLElement|null} the container, so callers can animate it
 */
export function renderRevealBoxes(word, els, opts = {}) {
  const row = els?.phonemeRow;
  if (!row || !row.parentNode) return null;

  let host = document.getElementById(REVEAL_HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = REVEAL_HOST_ID;
    row.parentNode.insertBefore(host, row.nextSibling);
  }

  const count = soundCount(word);
  renderSoundBoxes(word, host, {
    filledIndices: Array.from({ length: count }, (_, i) => i),
    ...opts,
  });
  return host;
}

/** Remove the reveal track — called from each mode's cleanup(). */
export function clearRevealBoxes() {
  document.getElementById(REVEAL_HOST_ID)?.remove();
}

/** @private */
function _boxLabel(i, count, state, typeName, grapheme, showGraphemes, isTarget = false) {
  const position = `Sound ${i + 1} of ${count}`;
  // The ringed box is what the round asked about, so say so first.
  const prefix = isTarget ? `${position}, this round's sound` : position;
  if (state === 'correct') return `${prefix}: ${showGraphemes ? `${grapheme}, ` : ''}correct`;
  if (state === 'retry') return `${prefix}: try again`;
  if (state === 'filled')
    return `${prefix}: ${showGraphemes ? `${grapheme}, ` : ''}filled, ${typeName}`;
  if (state === 'active') return `${prefix}: current, empty`;
  return `${prefix}: empty`;
}

export const __TEST__ = { EMPTY_MARK, _boxLabel };
