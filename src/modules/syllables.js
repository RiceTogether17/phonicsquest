/**
 * PhonicsQuest — Syllable count helper
 *
 * Powers the "Clap the Syllables" mode (and any other place that needs
 * to know how many beats a word has). Resolves to an integer ≥ 1.
 *
 * Resolution order:
 *   1. Explicit `word.syllables` field wins — for the rare cases where
 *      the heuristic would be wrong, the bank entry can pin the count.
 *   2. Otherwise count vowel-bearing chunks across the word's
 *      `graphemes` + `types`. Each grapheme contributes 0 or 1
 *      syllable; the silent-e split digraph subtracts 1.
 *
 * The heuristic mirrors the structure phonics teachers use when
 * counting beats: "every vowel sound is a syllable; the silent e on
 * cake doesn't add a beat". It's intentionally simple — false
 * positives can be fixed with an explicit override on the word entry.
 */

/** Vowel-type grapheme tags as used across src/data/words.js. */
const VOWEL_TYPES = new Set(['sv', 'lv', 'rc', 'dp']);

/**
 * Suffixes that introduce their own syllable when tagged type 'sf'.
 *
 * Excludes plain `s` (a non-syllabic plural) and `ed` (context-
 * dependent — handled separately below using the same rule as
 * audio.js' speakPhoneme `-ed` branch).
 */
const SYLLABIC_SUFFIXES = new Set([
  'ing',
  'er',
  'est',
  'es',
  'ly',
  'al',
  'le',
  'el',
  'tion',
  'sion',
  'able',
  'ible',
  'ous',
  'ious',
  'ture',
  'ful',
  'ness',
  'ment',
  'ish',
  'ant',
  'ent',
  // Consonant + le endings — each adds a syllable (don't double-count
  // the leading consonant since it's part of the suffix chunk itself).
  'ble',
  'cle',
  'dle',
  'fle',
  'gle',
  'kle',
  'ple',
  'tle',
  'zle',
]);

/** Letters that signal a prefix chunk contributes its own syllable. */
const VOWEL_LETTERS = /[aeiouy]/;

/**
 * Compute the syllable count for a word.
 *
 * @param {import('../data/words.js').Word} word
 * @returns {number}  syllable count, floored at 1
 */
export function getSyllableCount(word) {
  if (!word) return 1;
  if (typeof word.syllables === 'number' && word.syllables >= 1) {
    return Math.floor(word.syllables);
  }

  const graphemes = Array.isArray(word.graphemes) ? word.graphemes : [];
  const types = Array.isArray(word.types) ? word.types : [];
  if (graphemes.length === 0) return 1;

  let count = 0;
  for (let i = 0; i < graphemes.length; i++) {
    const g = String(graphemes[i] || '').toLowerCase();
    const type = String(types[i] || '').toLowerCase();

    if (VOWEL_TYPES.has(type)) {
      count++;
      continue;
    }

    // Prefix chunks (un-, re-, pre-, dis-, mis-, in-, im-) are each a
    // syllable in their own right — every one in the bank contains a
    // vowel letter. Guard with the letter check so non-vowel-bearing
    // prefixes (none today, but a future addition like 'pl-' wouldn't
    // qualify) don't get counted.
    if (type === 'p' && VOWEL_LETTERS.test(g)) {
      count++;
      continue;
    }

    if (type === 'sf') {
      const bare = g.replace(/^-/, '');
      if (SYLLABIC_SUFFIXES.has(bare)) {
        count++;
        continue;
      }
      // Context-sensitive -ed: only a syllable after /t/ or /d/
      // (matches the /ɪd/ pronunciation rule in audio.js speakPhoneme).
      if (bare === 'ed') {
        const prev = String(graphemes[i - 1] || '').toLowerCase();
        const tail = prev[prev.length - 1];
        if (tail === 't' || tail === 'd') count++;
        continue;
      }
      // Plain -s plural / 3sg present: no syllable.
    }
  }

  // Silent-e split digraph marker ('se' type) sits on the trailing
  // <e> that lengthens the prior vowel without adding a beat. Don't
  // dip below 1 — even a CVCe word has at least one syllable.
  if (types[types.length - 1] === 'se' && count > 1) count--;

  return Math.max(1, count);
}

/**
 * Human-readable syllable breakdown, e.g. "don-key" for donkey.
 *
 * Uses the syllable *count* (from getSyllableCount) and splits the
 * printed word at letter boundaries that approximate the spoken
 * break. For 1-syllable words this returns the word unchanged.
 *
 * @param {import('../data/words.js').Word} word
 * @returns {string}
 */
export function getSyllableBreakdown(word) {
  if (!word?.word) return '';
  if (typeof word.syllableBreakdown === 'string' && word.syllableBreakdown.length) {
    return word.syllableBreakdown;
  }
  const count = getSyllableCount(word);
  const text = String(word.word);
  if (count <= 1) return text;

  // Naive even split — good enough for a celebratory reveal. Words
  // where this is awkward can pin `syllableBreakdown` explicitly.
  const step = Math.max(1, Math.round(text.length / count));
  const parts = [];
  for (let i = 0; i < count; i++) {
    const start = i * step;
    const end = i === count - 1 ? text.length : Math.min(text.length, start + step);
    if (start >= text.length) break;
    parts.push(text.slice(start, end));
  }
  return parts.filter(Boolean).join('-');
}
