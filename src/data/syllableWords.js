/**
 * PhonicsQuest — Syllable-Clap word pool
 *
 * Clap the Syllables is a PHONOLOGICAL-awareness game, not a phonemic
 * or decoding one. Syllable awareness develops early on the
 * phonological continuum (word → syllable → onset-rime → phoneme), so
 * the activity is available from day one and is NOT tied to the
 * decoding curriculum's locked stages.
 *
 * Because the game is about hearing beats — not decoding print — the
 * pool is a curated set of highly picture-able words spanning 1–4
 * syllables, independent of the phonics WORDS bank. Each entry carries
 * an explicit `syllables` count and `syllableBreakdown`, so
 * getSyllableCount / getSyllableBreakdown resolve directly from the
 * override without running the grapheme heuristic (these words have no
 * grapheme annotations on purpose).
 *
 * Shape is intentionally minimal: { id, word, emoji, syllables,
 * syllableBreakdown }. No graphemes/types — preloadWord and the
 * group-mastery path both guard against their absence.
 */

import { shuffleArray } from './words.js';

/** @typedef {{id:string, word:string, emoji:string, syllables:number, syllableBreakdown:string}} SyllableWord */

/** @type {SyllableWord[]} */
export const SYLLABLE_WORDS = [
  // ── 1 syllable ──────────────────────────────────────────────────
  { id: 'syl-dog',   word: 'dog',   emoji: '🐶', syllables: 1, syllableBreakdown: 'dog' },
  { id: 'syl-cat',   word: 'cat',   emoji: '🐱', syllables: 1, syllableBreakdown: 'cat' },
  { id: 'syl-fish',  word: 'fish',  emoji: '🐟', syllables: 1, syllableBreakdown: 'fish' },
  { id: 'syl-sun',   word: 'sun',   emoji: '☀️', syllables: 1, syllableBreakdown: 'sun' },
  { id: 'syl-tree',  word: 'tree',  emoji: '🌳', syllables: 1, syllableBreakdown: 'tree' },
  { id: 'syl-book',  word: 'book',  emoji: '📖', syllables: 1, syllableBreakdown: 'book' },
  { id: 'syl-star',  word: 'star',  emoji: '⭐', syllables: 1, syllableBreakdown: 'star' },
  { id: 'syl-cake',  word: 'cake',  emoji: '🎂', syllables: 1, syllableBreakdown: 'cake' },

  // ── 2 syllables ─────────────────────────────────────────────────
  { id: 'syl-rabbit', word: 'rabbit', emoji: '🐰', syllables: 2, syllableBreakdown: 'rab-bit' },
  { id: 'syl-monkey', word: 'monkey', emoji: '🐒', syllables: 2, syllableBreakdown: 'mon-key' },
  { id: 'syl-tiger',  word: 'tiger',  emoji: '🐯', syllables: 2, syllableBreakdown: 'ti-ger' },
  { id: 'syl-apple',  word: 'apple',  emoji: '🍎', syllables: 2, syllableBreakdown: 'ap-ple' },
  { id: 'syl-pencil', word: 'pencil', emoji: '✏️', syllables: 2, syllableBreakdown: 'pen-cil' },
  { id: 'syl-flower', word: 'flower', emoji: '🌸', syllables: 2, syllableBreakdown: 'flow-er' },
  { id: 'syl-panda',  word: 'panda',  emoji: '🐼', syllables: 2, syllableBreakdown: 'pan-da' },
  { id: 'syl-robot',  word: 'robot',  emoji: '🤖', syllables: 2, syllableBreakdown: 'ro-bot' },
  { id: 'syl-donkey', word: 'donkey', emoji: '🫏', syllables: 2, syllableBreakdown: 'don-key' },
  { id: 'syl-rocket', word: 'rocket', emoji: '🚀', syllables: 2, syllableBreakdown: 'rock-et' },

  // ── 3 syllables ─────────────────────────────────────────────────
  { id: 'syl-elephant',  word: 'elephant',  emoji: '🐘', syllables: 3, syllableBreakdown: 'el-e-phant' },
  { id: 'syl-banana',    word: 'banana',    emoji: '🍌', syllables: 3, syllableBreakdown: 'ba-na-na' },
  { id: 'syl-butterfly', word: 'butterfly', emoji: '🦋', syllables: 3, syllableBreakdown: 'but-ter-fly' },
  { id: 'syl-umbrella',  word: 'umbrella',  emoji: '☂️', syllables: 3, syllableBreakdown: 'um-brel-la' },
  { id: 'syl-dinosaur',  word: 'dinosaur',  emoji: '🦕', syllables: 3, syllableBreakdown: 'di-no-saur' },
  { id: 'syl-tomato',    word: 'tomato',    emoji: '🍅', syllables: 3, syllableBreakdown: 'to-ma-to' },
  { id: 'syl-computer',  word: 'computer',  emoji: '💻', syllables: 3, syllableBreakdown: 'com-pu-ter' },
  { id: 'syl-kangaroo',  word: 'kangaroo',  emoji: '🦘', syllables: 3, syllableBreakdown: 'kan-ga-roo' },

  // ── 4 syllables ─────────────────────────────────────────────────
  { id: 'syl-caterpillar', word: 'caterpillar', emoji: '🐛', syllables: 4, syllableBreakdown: 'cat-er-pil-lar' },
  { id: 'syl-watermelon',  word: 'watermelon',  emoji: '🍉', syllables: 4, syllableBreakdown: 'wa-ter-mel-on' },
  { id: 'syl-helicopter',  word: 'helicopter',  emoji: '🚁', syllables: 4, syllableBreakdown: 'hel-i-cop-ter' },
  { id: 'syl-alligator',   word: 'alligator',   emoji: '🐊', syllables: 4, syllableBreakdown: 'al-li-ga-tor' },
];

/**
 * Pick the next syllable-clap word, avoiding recently-seen ids so the
 * same picture doesn't repeat back-to-back.
 *
 * @param {string[]} [recentIds]  ids shown recently (most-recent first)
 * @returns {SyllableWord}
 */
export function pickSyllableWord(recentIds = []) {
  const recent = new Set(recentIds);
  const fresh  = SYLLABLE_WORDS.filter(w => !recent.has(w.id));
  const pool   = fresh.length > 0 ? fresh : SYLLABLE_WORDS;
  return shuffleArray(pool)[0];
}
