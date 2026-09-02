/**
 * PhonicsQuest – Mouth cue (articulation diagram)
 *
 * A simple front-on mouth diagram showing what to *do* to make a sound.
 * Pairs with the phoneme audio: hearing /b/ helps, but "press both lips
 * together and pop them" is often what actually unlocks it for a child who
 * can't yet tell /b/ from /p/ by ear.
 *
 * Unlike the sound boxes and the Giri card, this genuinely is drawing, so
 * it is SVG: 13 shapes covering all 66 phonemes in the bank (see
 * data/articulation.js for the mapping — and the review note attached to
 * it, since that mapping is educational content).
 *
 * Everything is drawn with `currentColor` and CSS variables so the diagram
 * inherits the active theme, including high contrast, without a second
 * palette.
 */

import { getMouthCue } from '../data/articulation.js';

/** Shared viewBox for every shape, so they line up when swapped. */
const VIEW_BOX = '0 0 100 70';

/**
 * The drawn part of each shape, as SVG markup.
 *
 * Authored constants, never user input — assigned via innerHTML on a
 * container the caller owns. Keep it that way: no interpolation of learner
 * or model text belongs in here.
 *
 * Conventions: lips are the outer stroke, the dark opening is the mouth
 * cavity, a pink shape is the tongue, and white blocks are teeth.
 */
const SHAPE_SVG = Object.freeze({
  // Lips pressed shut — /b/ /p/ /m/
  'lips-closed': `
    <ellipse cx="50" cy="35" rx="30" ry="16" class="mc-lips"/>
    <line x1="22" y1="35" x2="78" y2="35" class="mc-seal"/>`,

  // Top teeth resting on the bottom lip — /f/ /v/
  'lips-teeth': `
    <ellipse cx="50" cy="35" rx="30" ry="16" class="mc-lips"/>
    <path d="M25 30 Q50 22 75 30 L75 36 Q50 30 25 36 Z" class="mc-mouth"/>
    <rect x="34" y="27" width="32" height="8" rx="2" class="mc-teeth"/>`,

  // Tongue tip between the teeth — /th/
  'tongue-teeth': `
    <ellipse cx="50" cy="35" rx="30" ry="16" class="mc-lips"/>
    <ellipse cx="50" cy="35" rx="22" ry="10" class="mc-mouth"/>
    <rect x="34" y="27" width="32" height="6" rx="2" class="mc-teeth"/>
    <ellipse cx="50" cy="37" rx="12" ry="6" class="mc-tongue"/>`,

  // Tongue tip up at the alveolar ridge — /t/ /d/ /n/ /s/ /z/ /l/
  'tongue-ridge': `
    <ellipse cx="50" cy="35" rx="30" ry="16" class="mc-lips"/>
    <ellipse cx="50" cy="35" rx="22" ry="11" class="mc-mouth"/>
    <rect x="34" y="26" width="32" height="6" rx="2" class="mc-teeth"/>
    <path d="M32 44 Q50 44 56 32" class="mc-tongue-line"/>`,

  // Back of the tongue humped up — /k/ /g/ /ng/
  'tongue-back': `
    <ellipse cx="50" cy="35" rx="30" ry="16" class="mc-lips"/>
    <ellipse cx="50" cy="35" rx="22" ry="11" class="mc-mouth"/>
    <path d="M36 44 Q56 44 68 30" class="mc-tongue-line"/>
    <ellipse cx="64" cy="33" rx="9" ry="6" class="mc-tongue"/>`,

  // Open, just breath — /h/
  'open-throat': `
    <ellipse cx="50" cy="35" rx="26" ry="19" class="mc-lips"/>
    <ellipse cx="50" cy="36" rx="17" ry="13" class="mc-mouth"/>
    <path d="M50 30 q6 -8 12 -10" class="mc-air"/>
    <path d="M50 34 q9 -5 16 -5" class="mc-air"/>`,

  // Lips pushed forward, small opening — /sh/ /ch/ /j/ /r/
  'rounded-small': `
    <ellipse cx="50" cy="35" rx="20" ry="17" class="mc-lips"/>
    <ellipse cx="50" cy="35" rx="9" ry="8" class="mc-mouth"/>`,

  // Rounded, whistle-like — /w/ /wh/
  'rounded-lips': `
    <ellipse cx="50" cy="35" rx="22" ry="18" class="mc-lips"/>
    <ellipse cx="50" cy="35" rx="12" ry="10" class="mc-mouth"/>`,

  // Jaw dropped wide — /a/ /ar/
  'vowel-open': `
    <ellipse cx="50" cy="35" rx="26" ry="24" class="mc-lips"/>
    <ellipse cx="50" cy="36" rx="18" ry="17" class="mc-mouth"/>
    <ellipse cx="50" cy="52" rx="12" ry="5" class="mc-tongue"/>`,

  // Relaxed, half open — /e/ /u/ schwa, r-coloured
  'vowel-mid': `
    <ellipse cx="50" cy="35" rx="27" ry="17" class="mc-lips"/>
    <ellipse cx="50" cy="36" rx="19" ry="10" class="mc-mouth"/>`,

  // Lips spread wide — /i/ /ee/ /ay/ /igh/
  'vowel-smile': `
    <path d="M18 32 Q50 20 82 32 Q50 46 18 32 Z" class="mc-lips"/>
    <path d="M27 32 Q50 26 73 32 Q50 40 27 32 Z" class="mc-mouth"/>`,

  // Round O — /o/ /oa/ /oo/ /or/ /aw/
  'vowel-round': `
    <circle cx="50" cy="35" r="20" class="mc-lips"/>
    <circle cx="50" cy="35" r="12" class="mc-mouth"/>`,

  // The mouth travels between two shapes — diphthongs and /y/
  glide: `
    <ellipse cx="34" cy="35" rx="16" ry="14" class="mc-lips"/>
    <ellipse cx="34" cy="35" rx="8" ry="7" class="mc-mouth"/>
    <ellipse cx="72" cy="35" rx="14" ry="9" class="mc-lips mc-lips--ghost"/>
    <path d="M52 35 L62 35" class="mc-arrow"/>
    <path d="M60 31 L66 35 L60 39 Z" class="mc-arrow-head"/>`,
});

/**
 * Render a mouth cue for a phoneme.
 *
 * @param {string} phoneme  `/c/` or bare `c`
 * @param {HTMLElement} host
 * @param {{ showCue?: boolean }} [opts]  showCue renders the text instruction
 * @returns {boolean} false when the phoneme has no mapping
 */
export function renderMouthCue(phoneme, host, opts = {}) {
  if (!host) return false;
  host.innerHTML = '';

  const cue = getMouthCue(phoneme);
  if (!cue) return false;

  const { showCue = true } = opts;

  host.className = 'mouth-cue';
  host.dataset.shape = cue.shape;

  // The diagram is one image with a text alternative; the child hears the
  // same instruction that a sighted child reads underneath.
  const wrap = document.createElement('div');
  wrap.className = 'mouth-cue__diagram';
  wrap.setAttribute('role', 'img');
  wrap.setAttribute('aria-label', `${cue.label}. ${cue.cue}`);
  wrap.innerHTML =
    `<svg viewBox="${VIEW_BOX}" class="mouth-cue__svg" focusable="false" aria-hidden="true">` +
    SHAPE_SVG[cue.shape] +
    '</svg>';
  host.appendChild(wrap);

  if (showCue) {
    const text = document.createElement('p');
    text.className = 'mouth-cue__text';
    // aria-hidden: the wrapper's label already carries this wording, and
    // repeating it would announce the instruction twice.
    text.setAttribute('aria-hidden', 'true');
    text.textContent = cue.cue;
    host.appendChild(text);
  }

  return true;
}

/** Shapes available, for tests and any future picker UI. */
export const MOUTH_SHAPE_KEYS = Object.keys(SHAPE_SVG);

/** Id of the container the reveal helper creates. */
const REVEAL_CUE_ID = 'reveal-mouth-cue';

/**
 * Show the mouth cue for one sound as part of a round's reveal.
 *
 * Used by First / Last / Middle Sound: once the child has identified the
 * sound, the cue answers the natural follow-up — "so how do I *say* it?".
 * Placed after the phoneme row so it reads as part of the same explanation.
 *
 * @param {import('../data/words.js').Word} word
 * @param {number} index  which phoneme the round was about
 * @param {{ phonemeRow: HTMLElement }} els
 * @returns {HTMLElement|null}
 */
export function renderRevealMouthCue(word, index, els, { phoneme: override } = {}) {
  const row = els?.phonemeRow;
  if (!row || !row.parentNode || !word) return null;

  // `override` lets a mode name the sound when the tile at `index` is not
  // itself one phoneme: the last tile of "clamp" is the blend "mp", which
  // has no single mouth shape, but the sound the child just named is /p/.
  const phoneme = override || word.phonemes?.[index] || word.graphemes?.[index];
  if (!phoneme) return null;

  let host = document.getElementById(REVEAL_CUE_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = REVEAL_CUE_ID;
    row.parentNode.insertBefore(host, row.nextSibling);
  }

  // A phoneme with no mapping simply shows nothing rather than an empty box.
  if (!renderMouthCue(phoneme, host)) {
    host.remove();
    return null;
  }
  return host;
}

/** Remove the reveal cue — called from each mode's cleanup(). */
export function clearRevealMouthCue() {
  document.getElementById(REVEAL_CUE_ID)?.remove();
}
