/**
 * PhonicsQuest — grapheme split for words the curated bank does not hold.
 *
 * The blend ladder needs to know which letters make one sound. The word bank
 * carries that for 1115 words, but only **33% of the tokens in the story
 * bank** are bank words — so without this, tapping a word in a story would
 * offer a ladder one time in three and "here, listen to it" the rest of the
 * time, including for plainly decodable words like "cakes", "walked" and
 * "small".
 *
 * The vowels are not guessed here: `vowelSegments` already classifies them
 * for the sound-colour scaffold, which is why those words are correctly
 * coloured in the story even when they have no tiles. This adds the missing
 * half — splitting the consonant runs — using the app's own inventory of
 * graphemes it has a recording for, so a derived tile can always be sounded.
 *
 * ── How good is it ────────────────────────────────────────────────────────
 * Checked against the 1115 curated bank words, where the right answer is
 * known: the split agrees on **95%** of them, and rebuilds the word exactly
 * on **100%** — it never shows a child a letter their word does not contain.
 * `deriveGraphemes.test.js` holds both numbers, so a change that makes the
 * split worse fails rather than quietly teaching the wrong thing.
 *
 * The bank always wins where it has an entry. This is the fallback, and it
 * is deliberately conservative: where it cannot be confident (a prefix it
 * cannot tell from a root, an irregular like "enough" or "-tion") it splits
 * smaller rather than inventing a grapheme.
 */

import { vowelSegments } from './phonemeColors.js';

/**
 * Consonant graphemes, longest first. Every entry has a recording in
 * `audio.js`'s PHONEME_FILES — a tile the app cannot say is worse than no
 * tile, because the child taps it and nothing happens.
 */
const CONSONANT_GRAPHEMES = Object.freeze([
  'tch',
  'dge',
  'ph',
  'sh',
  'ch',
  'th',
  'wh',
  'ck',
  'ng',
  'qu',
  'wr',
  'kn',
  'gn',
  'll',
  'ss',
  'tt',
  'nn',
  'gg',
  'ff',
  'dd',
  'zz',
  'bb',
  'pp',
  'mm',
  'rr',
  'cc',
]);

/**
 * Suffixes the app can pronounce as a unit. A morpheme is one chunk to a
 * reader — "jump·ed", not "jump·e·d" — and `audio.speakPhoneme` has an
 * affix path for exactly these.
 */
const SUFFIXES = Object.freeze(['-ness', '-less', '-ing', '-est', '-ful', '-ed', '-er', '-ly']);

/** Shortest stem worth calling a word, so "shed" is not read as sh + -ed. */
const MIN_STEM = 3;

const hasVowel = (s) => /[aeiouy]/.test(s);

/**
 * Split a run of consonants into graphemes.
 *
 * @param {string} run
 * @param {string} word the whole word, for lookahead
 * @param {number} at   where `run` starts in `word`
 */
function splitConsonants(run, word, at) {
  const out = [];
  let i = 0;
  while (i < run.length) {
    let hit = CONSONANT_GRAPHEMES.find((g) => run.startsWith(g, i));
    // "ng" before e or i is n plus a soft g — change, hinge, danger — not
    // the /ŋ/ of "ring". Looked up in the whole word, because the silent e
    // that gives it away is in the next segment, not this run.
    if (hit === 'ng' && /[ei]/.test(word[at + i + 2] ?? '')) hit = null;
    if (hit) {
      out.push(hit);
      i += hit.length;
    } else {
      out.push(run[i]);
      i += 1;
    }
  }
  return out;
}

/**
 * Rejoin "qu".
 *
 * `vowelSegments` classifies the u of "quick" as a vowel — reasonable for
 * colouring a vowel by its sound, wrong for a ladder, where qu is one
 * grapheme saying /kw/ and the u is not a vowel sound at all. Done as a pass
 * afterwards so the vowel classifier stays the single place vowels are
 * decided.
 *
 * @param {string[]} graphemes
 * @param {string[]} types
 */
function mergeQu(graphemes, types) {
  const g = [];
  const t = [];
  for (let i = 0; i < graphemes.length; i++) {
    const next = graphemes[i + 1];
    if (graphemes[i] === 'q' && next?.startsWith('u')) {
      g.push('qu');
      t.push('c');
      const rest = next.slice(1);
      if (rest) {
        // "queen": the u was swallowed into a vowel team, so hand the rest
        // of that team back to the next round.
        graphemes[i + 1] = rest;
      } else {
        i += 1;
      }
      continue;
    }
    g.push(graphemes[i]);
    t.push(types[i]);
  }
  return { graphemes: g, types: t };
}

/** Coalesce adjacent consonant runs — a digraph can straddle two segments. */
function coalesceConsonants(segs) {
  const out = [];
  for (const s of segs) {
    const last = out[out.length - 1];
    if (last && last.sound === null && s.sound === null) last.len += s.len;
    else out.push({ ...s });
  }
  return out;
}

/** The sound category `vowelSegments` gives, as a word-bank type code. */
const TYPE_BY_SOUND = Object.freeze({
  short: 'sv',
  long: 'lv',
  rcontrolled: 'rc',
  diphthong: 'dp',
  silent: 'se',
  // No recording exists for a bare schwa, and the short sound is the
  // approximation a teacher uses when sounding one out.
  schwa: 'sv',
});

/**
 * Split a word into graphemes and word-bank type codes.
 *
 * @param {string} raw
 * @returns {{graphemes: string[], types: string[]}|null} null = cannot split
 */
export function deriveGraphemes(raw) {
  const word = String(raw ?? '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  if (!word) return null;

  let stem = word;
  let suffix = null;

  // A plural or third-person -s on a split-digraph word hides the silent e
  // from the vowel classifier, which only recognises one at the end of a
  // word: "cakes" came out with the e sounding, giving the ladder a rung
  // that says /e/ in a word where that letter is silent. Set the s aside,
  // analyse "cake", and put the s back as an ordinary consonant.
  //
  // Deliberately narrow — it fires only on a magic-e stem, so "glass",
  // "this" and "bus" are untouched.
  let pluralS = false;
  if (word.endsWith('s') && /[aeiou][^aeiouy]e$/.test(word.slice(0, -1))) {
    pluralS = true;
    stem = word.slice(0, -1);
  }

  for (const s of SUFFIXES) {
    const bare = s.slice(1);
    const rest = stem.slice(0, -bare.length);
    // Both guards earn their keep: without the length one "seed" reads as
    // se + -ed, and without the vowel one "shed" reads as sh + -ed.
    if (stem.endsWith(bare) && rest.length >= MIN_STEM && hasVowel(rest)) {
      suffix = s;
      stem = rest;
      break;
    }
  }

  const segs = vowelSegments(stem);
  if (!segs) return null; // a proper noun, or nothing to split

  const graphemes = [];
  const types = [];
  let pos = 0;
  for (const { len, sound } of coalesceConsonants(segs)) {
    const slice = stem.slice(pos, pos + len);
    if (sound) {
      graphemes.push(slice);
      types.push(TYPE_BY_SOUND[sound] ?? 'sv');
    } else {
      for (const g of splitConsonants(slice, stem, pos)) {
        graphemes.push(g);
        types.push('c');
      }
    }
    pos += len;
  }
  if (pos < stem.length) {
    for (const g of splitConsonants(stem.slice(pos), stem, pos)) {
      graphemes.push(g);
      types.push('c');
    }
  }
  if (pluralS) {
    graphemes.push('s');
    types.push('c');
  }
  if (suffix) {
    graphemes.push(suffix);
    types.push('sf');
  }

  if (!graphemes.length) return null;
  return mergeQu(graphemes, types);
}

/**
 * Split a bank blend tile into the sounds it is made of.
 *
 * The bank types "st", "tr", "str" as a single `bl` tile. That is right for
 * a tile display, but wrong for a ladder: the app's own rule is that "a
 * digraph is ONE sound; a blend is TWO sounds you can hear separately"
 * (aiGuardrails.js), and a ladder that jumps straight from nothing to "st"
 * skips the blending step it exists to teach. So "stay" climbs
 * s → st → stay, not st → stay.
 *
 * @param {string[]} graphemes
 * @param {string[]} types
 * @returns {{graphemes: string[], types: string[]}}
 */
export function expandBlends(graphemes, types) {
  const g = [];
  const t = [];
  graphemes.forEach((grapheme, i) => {
    if (types[i] !== 'bl') {
      g.push(grapheme);
      t.push(types[i]);
      return;
    }
    const low = String(grapheme).toLowerCase();
    for (const part of splitConsonants(low, low, 0)) {
      g.push(part);
      t.push('c');
    }
  });
  return { graphemes: g, types: t };
}

export const __TEST__ = { CONSONANT_GRAPHEMES, SUFFIXES, MIN_STEM };
