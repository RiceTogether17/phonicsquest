/**
 * PhonicsQuest – Word Detective
 *
 * Tap any word in a Giri Story (with Detective mode on) and a card opens
 * showing the grapheme breakdown + sample sentence + an "Add to Review
 * Lane" button. Compounds with the karaoke pass — same words, same colour
 * tokens, same character (Giri). The toggle is opt-in so the default
 * read-aloud experience is unchanged.
 *
 * Pure-ish: lookup and normalisation are pure helpers; the only side
 * effect is `addWordToReview`, which routes through the existing
 * Review Lane (scheduleAttempt via store.recordWordAttempt) so the new
 * surface doesn't open a back door into wordStats.
 *
 * Charter-safe: never adds an unknown wordId to wordStats (no pollution
 * of the SR queue with story-only or non-decodable text); shows a
 * breakdown anyway so the child still learns something.
 */

import { WORDS } from '../data/words.js';
import { store } from './store.js';
import { EVIDENCE } from './evidence.js';

/** Normalise a story word: strip surrounding punctuation, lowercase, trim. */
export function normaliseWordText(text) {
  if (typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/^[^a-z0-9]+/, '')
    .replace(/[^a-z0-9]+$/, '')
    .trim();
}

/** @type {Map<string, import('../data/words.js').Word>} */
let _wordIndex = null;

function _ensureIndex() {
  if (_wordIndex) return _wordIndex;
  _wordIndex = new Map();
  for (const w of WORDS) {
    if (!w?.word) continue;
    _wordIndex.set(w.word.toLowerCase(), w);
  }
  return _wordIndex;
}

/**
 * Look up a word in the bank by its rendered text.
 * Returns the rich Word object (with graphemes + types) if found, plus a
 * `foundInBank` flag the UI uses to enable/disable the "Add to Review"
 * action — we only add bank words to the SR queue (no pollution).
 *
 * @param {string} text — raw word text from a story span
 * @returns {{
 *   text: string,
 *   word: import('../data/words.js').Word | null,
 *   foundInBank: boolean,
 *   graphemes: string[],
 *   types: string[],
 *   alreadyTracked: boolean,
 * }}
 */
export function lookupWord(text) {
  const normalised = normaliseWordText(text);
  const idx = _ensureIndex();
  const word = normalised ? idx.get(normalised) : null;

  if (word) {
    const stats = store.get('wordStats') || {};
    const alreadyTracked = !!stats[word.id] && (stats[word.id].attempts || 0) > 0;
    return {
      text: word.word,
      word,
      foundInBank: true,
      graphemes: Array.isArray(word.graphemes) ? word.graphemes : [normalised],
      types: Array.isArray(word.types) ? word.types : [],
      alreadyTracked,
    };
  }

  // Fallback: split by letter so the card still teaches something for
  // story-only words (e.g. proper nouns, names) that aren't in the bank.
  return {
    text: normalised,
    word: null,
    foundInBank: false,
    graphemes: normalised ? normalised.split('') : [],
    types: [],
    alreadyTracked: false,
  };
}

/**
 * Add a bank word to the Review Lane. Routes through
 * `store.recordWordAttempt` so the Leitner ladder picks the item up.
 *
 * Recorded as `exposure`: looking a word up and adding it to review is a
 * request to practise it, not a demonstration that the child can read it.
 * The word therefore enters at box 0 and is due immediately — which is what
 * you want from "I want to work on this one", and avoids a queue-only
 * bookkeeping call inflating the child's decoding record.
 *
 * @param {string} wordId
 * @returns {boolean} true if the add succeeded, false if wordId unknown
 */
export function addWordToReview(wordId) {
  if (!wordId || typeof wordId !== 'string') return false;
  const idx = _ensureIndex();
  // Look up via the index (id matches word text in this bank) — and fall
  // back to a direct WORDS scan if the id doesn't match a text key (some
  // entries have id !== word, e.g. capitalised variants).
  const inBank = idx.has(wordId) || WORDS.some((w) => w?.id === wordId);
  if (!inBank) return false;
  store.recordWordAttempt(wordId, true, EVIDENCE.EXPOSURE);
  return true;
}

/**
 * Reset the cached index (used by tests so a fresh module import lines up
 * with a fresh WORDS bank).
 */
export function __resetIndex() {
  _wordIndex = null;
}

export const __TEST__ = { _ensureIndex };
