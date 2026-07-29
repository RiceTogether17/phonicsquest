/**
 * PhonicsQuest – Giri blending guide
 *
 * Blending is the step where a child stops hearing "/c/ /a/ /t/" as three
 * separate noises and hears "cat". The audio already models that (see the
 * cumulative sweep in modes/blend.js); what was missing was anything to
 * *look* at — the phoneme tiles simply highlighted in place, so the sense
 * of sounds being gathered up left to right was carried by sound alone.
 *
 * This walks Giri along the sound track, pointing at the sound being said
 * and sweeping across the whole word on the final blend. It rides on top of
 * the existing sweep rather than replacing it: blend.js calls `moveTo()` as
 * it steps, so the audio remains the source of truth for timing.
 *
 * Motion: every movement checks `prefersReducedMotion()` and snaps to the
 * end position instead of animating. The guide is decorative — a child who
 * has motion disabled loses nothing but the travel.
 */

import { STATES } from './mascot.js';
import { prefersReducedMotion } from '../utils/motion.js';

const GUIDE_CLASS = 'giri-blend-guide';

/**
 * Attach the guide above a phoneme row.
 *
 * @param {HTMLElement} phonemeRow  the #phoneme-row element
 * @returns {HTMLElement|null} the guide element, or null if unavailable
 */
export function mountBlendGuide(phonemeRow) {
  if (!phonemeRow) return null;
  unmountBlendGuide(phonemeRow);

  // The row is the positioning context for the guide's absolute placement.
  phonemeRow.classList.add('phoneme-row--guided');

  const guide = document.createElement('img');
  guide.className = GUIDE_CLASS;
  guide.src = STATES.pointRight;
  guide.alt = '';
  // Decorative: the tiles and the audio carry the teaching, and announcing
  // a travelling mascot on every sound would be noise for a screen reader.
  guide.setAttribute('aria-hidden', 'true');
  guide.addEventListener('error', () => guide.remove());

  phonemeRow.appendChild(guide);
  return guide;
}

/** Remove the guide and its positioning class. */
export function unmountBlendGuide(phonemeRow) {
  if (!phonemeRow) return;
  phonemeRow.querySelector(`.${GUIDE_CLASS}`)?.remove();
  phonemeRow.classList.remove('phoneme-row--guided');
}

/**
 * Move the guide over the tile at `index`.
 *
 * @param {HTMLElement} phonemeRow
 * @param {number} index
 * @param {{ pose?: 'point'|'celebrate' }} [opts]
 */
export function moveGuideTo(phonemeRow, index, opts = {}) {
  const guide = phonemeRow?.querySelector(`.${GUIDE_CLASS}`);
  if (!guide) return;

  const tiles = phonemeRow.querySelectorAll('.phoneme-tile');
  const tile = tiles[index];
  if (!tile) return;

  // Centre the guide over the tile, measured against the row so the maths
  // survives wrapping and the responsive tile sizes.
  const rowBox = phonemeRow.getBoundingClientRect();
  const tileBox = tile.getBoundingClientRect();
  const x = (tileBox.left - rowBox.left) + (tileBox.width / 2);

  guide.style.transition = prefersReducedMotion() ? 'none' : '';
  guide.style.transform = `translateX(${x}px) translateX(-50%)`;

  if (opts.pose === 'celebrate') {
    guide.src = STATES.celebrate;
  } else {
    // Face the direction of travel: Giri points forward along the word.
    guide.src = index >= tiles.length - 1 ? STATES.holdCard : STATES.pointRight;
  }
}

/**
 * Final "it's a word!" beat — Giri celebrates over the middle of the track.
 * @param {HTMLElement} phonemeRow
 */
export function celebrateGuide(phonemeRow) {
  const tiles = phonemeRow?.querySelectorAll('.phoneme-tile');
  if (!tiles?.length) return;
  moveGuideTo(phonemeRow, Math.floor(tiles.length / 2), { pose: 'celebrate' });
}
