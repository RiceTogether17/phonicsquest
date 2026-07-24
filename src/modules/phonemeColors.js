/**
 * PhonicsQuest — unified vowel-sound colour system.
 *
 * One colour language for every "what sound is this letter making?" surface
 * in the story reader: the inline "Sound colours" scaffold, the Decode
 * ("Sound It Out") panel, and the Word Detective card. A vowel is coloured by
 * the SOUND it makes here, not by which letter it is — so the same `a`
 * reads red in "căt" (short), green in "cāke" (long) and grey in "əbout"
 * (schwa), teaching the child that one letter has several jobs.
 *
 * ── How the sound of each vowel is decided ────────────────────────────────
 *   1. A small curated table of true schwa words (the article "a", "the",
 *      the unstressed a- prefix) — English spelling can't reveal schwa, so
 *      it is listed explicitly. This overrides everything below.
 *   2. A curated table of common silent-e / irregular words the spelling
 *      rules get wrong ("have", "love", "one", "there"…).
 *   3. The curated word bank (words.js) when the word is known — accurate
 *      grapheme→type data (short vs long vs r-controlled vs diphthong).
 *   4. A spelling-pattern fallback for everything else (most story words are
 *      not in the bank): split digraphs, vowel teams, r-controlled strings,
 *      open syllables, otherwise short.
 *
 * The classifier returns letter-aligned segments so the inline renderer can
 * wrap the exact letters of the original word (case preserved) and the tile
 * renderers can colour each grapheme.
 */

import { WORDS } from '../data/words.js';
import { PROPER_NOUNS } from './decodability.js';

// ── Canonical palette ──────────────────────────────────────────────────────

/**
 * Every sound category the reader colours, with an accessible hue, a child
 * label, and a diacritic/marker for the legend. Vowel categories are used
 * inline; consonant/blend/digraph/affix are only used by the full-breakdown
 * tile panels.
 */
export const SOUND_META = Object.freeze({
  short:       { label: 'short vowel',   color: '#d62828', mark: 'ă' },
  long:        { label: 'long vowel',    color: '#1a7f37', mark: 'ā' },
  schwa:       { label: 'schwa · lazy “uh”', color: '#6b7280', mark: 'ə' },
  rcontrolled: { label: 'bossy-r vowel', color: '#7c3aed', mark: 'ûr' },
  diphthong:   { label: 'sliding vowel', color: '#ea580c', mark: 'oi' },
  silent:      { label: 'silent letter', color: '#9aa3af', mark: '∅' },
  consonant:   { label: 'consonant',     color: '#2563eb', mark: '' },
  digraph:     { label: 'digraph',       color: '#0891b2', mark: '' },
  blend:       { label: 'blend',         color: '#d97706', mark: '' },
  affix:       { label: 'word part',     color: '#db2777', mark: '' },
});

/** Categories a child sees when the inline "Sound colours" scaffold is on. */
export const VOWEL_LEGEND = Object.freeze(
  ['short', 'long', 'schwa', 'rcontrolled', 'diphthong', 'silent']
    .map(key => ({ key, ...SOUND_META[key] }))
);

/** Vowel categories (get an inline colour); consonants stay plain in text. */
const VOWEL_SOUNDS = new Set(['short', 'long', 'schwa', 'rcontrolled', 'diphthong']);

// ── Curated overrides ──────────────────────────────────────────────────────

/**
 * Unstressed a- prefix words whose leading `a` is a reduced /ə/ (about,
 * above, alone…). Spelling can't reveal this, so the set is explicit.
 */
const A_SCHWA_PREFIX = new Set([
  'about', 'above', 'again', 'ago', 'along', 'alone', 'around', 'away',
  'aside', 'awake', 'aboard', 'aloud', 'ashore', 'alike', 'asleep', 'amaze',
  'alarm', 'across', 'aware', 'another', 'awhile', 'ahead', 'afraid', 'apart',
  'alive', 'awoke', 'ajar', 'aloft', 'amount', 'account', 'asleep', 'aglow',
]);

const CONS_CLASS = 'bcdfghjklmnpqrstvwxyz';
const reFinalA = new RegExp(`[${CONS_CLASS}]a$`);           // sofa, panda, banana
const reFinalAl = new RegExp(`[bcdfghjkmnprstvz]al$`);       // animal, total, final, metal
const reTion = /[ts]ion$/;                                   // action, question, mission

/**
 * Letter indices in `word` that make a schwa /ə/. Combines the curated a-
 * prefix and article cases with reliable spelling rules: a word-final
 * consonant+a (soF-A), the a in a consonant+al ending (anim-AL), and the i
 * in a -tion / -sion ending (quest-I-on).
 * @returns {Set<number>|null}
 */
function schwaIndices(word) {
  const set = new Set();
  if (word === 'a') set.add(0);
  else if (word === 'the') set.add(2);
  else {
    if (A_SCHWA_PREFIX.has(word) && word[0] === 'a') set.add(0);
    if (word.length >= 3 && reFinalA.test(word)) set.add(word.length - 1);
    if (word.length >= 4 && reFinalAl.test(word)) set.add(word.length - 2);
    if (word.length >= 5 && reTion.test(word)) set.add(word.length - 3); // the 'i'
  }
  return set.size ? set : null;
}

// A handful of words whose final e IS sounded, so the general silent-final-e
// rule must skip them.
const FINAL_E_SOUNDS = new Set(['maybe', 'recipe', 'karate', 'sesame', 'ukulele', 'finale']);
const reFinalCe = new RegExp(`[${CONS_CLASS}]e$`);

/**
 * Letter indices that are a genuinely silent letter (not sounded):
 *   - the e of a -le ending (litt-l-E), covered by the general rule below;
 *   - the o of a -tion / -sion ending (quest-i-O-n);
 *   - a final consonant+e once the word already has a vowel (leav-E,
 *     pleas-E, larg-E) — but not open CV words (he, she) or the few that
 *     sound it (maybe);
 *   - the e of a regular past-tense -ed (beam-Ed, reach-Ed) — except after
 *     t/d, where it says /ɪd/ (wanted), or when there's no stem vowel (sled).
 * Split-digraph silent e (cake) is handled inline by the walker.
 * @returns {Set<number>|null}
 */
function silentIndices(word) {
  const set = new Set();
  const n = word.length;
  if (n >= 5 && reTion.test(word)) set.add(n - 2); // the 'o' of -ion
  if (
    n >= 4 && reFinalCe.test(word) &&
    !FINAL_E_SOUNDS.has(word) && /[aeiou]/.test(word.slice(0, -2))
  ) {
    set.add(n - 1);
  }
  if (n >= 4 && word.endsWith('ed')) {
    const before = word[n - 3];
    if (CONS_CLASS.includes(before) && before !== 't' && before !== 'd' &&
        /[aeiou]/.test(word.slice(0, -2))) {
      set.add(n - 2);
    }
  }
  return set.size ? set : null;
}

// Vowel teams whose usual sound is overridden in a bounded set of words.
const EA_SHORT = new Set([                                   // ea → short /ɛ/
  'head', 'bread', 'dead', 'ready', 'heavy', 'instead', 'meant', 'health',
  'wealth', 'weather', 'feather', 'leather', 'thread', 'spread', 'breath',
  'death', 'sweat', 'meadow', 'steady', 'already', 'breakfast', 'dread',
  'heaven', 'peasant', 'pleasant', 'treasure', 'measure',
]);
const EE_SHORT = new Set(['been']);                          // ee → short /ɪ/
const IE_SHORT = new Set(['friend', 'friends']);             // ie → short /ɛ/
const OW_LONG = new Set([                                    // ow → long /oʊ/
  'snow', 'show', 'shown', 'low', 'below', 'grow', 'grown', 'blow', 'blown',
  'glow', 'flow', 'slow', 'throw', 'thrown', 'own', 'owned', 'know', 'known',
  'yellow', 'follow', 'window', 'arrow', 'narrow', 'elbow', 'rainbow', 'bowl',
  'sparrow', 'pillow', 'shadow', 'meadow', 'borrow', 'tomorrow', 'below',
  'row', 'mow', 'sow', 'bow', 'crow', 'flown', 'growth',
]);

// Inflectional suffixes stripped before a set lookup, so "showed"/"slowly"
// inherit "show"/"slow". 'er'/'en' are deliberately excluded — they would
// wrongly fold "flower"/"shower" onto "flow"/"show".
const INFLECT = ['ing', 'ed', 'ly', 'es', 's', 'n'];

/** Set membership tolerant of a trailing inflection (showed → show). */
function inSet(set, word) {
  if (set.has(word)) return true;
  for (const suf of INFLECT) {
    if (word.endsWith(suf) && word.length - suf.length >= 2 &&
        set.has(word.slice(0, -suf.length))) {
      return true;
    }
  }
  return false;
}

/**
 * Apply the bounded team/word exceptions to a base vowel sound. Shared by
 * every path so the inline scaffold and the tile panels agree.
 * @param {string} word cleaned word
 * @param {string} grapheme the grapheme text (e.g. 'ea', 'ow', 'e')
 * @param {number} idx start letter index of the grapheme
 * @param {string} base the sound category before refinement
 * @param {Set<number>|null} schwa
 * @param {Set<number>|null} silent
 * @returns {string}
 */
function refineVowel(word, grapheme, idx, base, schwa, silent) {
  if (!VOWEL_SOUNDS.has(base)) return base;
  if (silent?.has(idx)) return 'silent';
  if (schwa?.has(idx)) return 'schwa';
  if (grapheme === 'ea' && inSet(EA_SHORT, word)) return 'short';
  if (grapheme === 'ee' && inSet(EE_SHORT, word)) return 'short';
  if (grapheme === 'ie' && inSet(IE_SHORT, word)) return 'short';
  if (grapheme === 'ow' && inSet(OW_LONG, word)) return 'long';
  return base;
}

/**
 * Words the spelling rules mis-read — mostly silent-e that does NOT make the
 * vowel long ("have", "love", "one"), and the -ere r-controlled family.
 * Value is a per-letter sound array (null = plain consonant), length ===
 * word length. Takes priority over the bank and the fallback.
 */
const S = null; // consonant / plain, for readability below
const IRREGULAR = new Map([
  ['have',  [S, 'short', S, 'silent']],
  ['love',  [S, 'short', S, 'silent']],
  ['come',  [S, 'short', S, 'silent']],
  ['some',  [S, 'short', S, 'silent']],
  ['done',  [S, 'short', S, 'silent']],
  ['gone',  [S, 'short', S, 'silent']],
  ['none',  [S, 'short', S, 'silent']],
  ['give',  [S, 'short', S, 'silent']],
  ['live',  [S, 'short', S, 'silent']],
  ['one',   ['short', S, 'silent']],
  ['were',  [S, 'rcontrolled', 'rcontrolled', 'silent']],
  ['here',  [S, 'rcontrolled', 'rcontrolled', 'silent']],
  ['where', [S, S, 'rcontrolled', 'rcontrolled', 'silent']],
  ['there', [S, S, 'rcontrolled', 'rcontrolled', 'silent']],
  ['above', ['schwa', S, 'short', S, 'silent']],
  ['become', [S, 'short', S, 'short', S, 'silent']],
  ['people', [S, 'long', 'silent', S, S, 'silent']],
  // Vowel teams the bank types oddly / that say an irregular sound.
  ['again', ['schwa', S, 'long', 'long', S]],
  ['said',  [S, 'short', 'short', S]],
  ['says',  [S, 'short', 'short', S]],
]);

// ── Word-bank lookup + type mapping ────────────────────────────────────────

const BANK = new Map(WORDS.map(w => [w.word.toLowerCase(), w]));

/** words.js grapheme type → sound category (null = leave plain inline). */
const TYPE_SOUND = Object.freeze({
  sv: 'short', lv: 'long', rc: 'rcontrolled', dp: 'diphthong', se: 'silent',
  c: 'consonant', bl: 'blend', d: 'digraph',
  soft_c: 'consonant', soft_g: 'consonant', p: 'affix', sf: 'affix',
});

/**
 * The sound category for a curated grapheme+type, exposed for the tile
 * panels (Decode, Word Detective) which have full per-grapheme data.
 * @param {string} type words.js type code
 * @returns {string} a SOUND_META key
 */
export function soundForType(type) {
  return TYPE_SOUND[type] ?? 'consonant';
}

/** Is this category one that gets coloured inside running text? */
export function isVowelSound(sound) {
  return VOWEL_SOUNDS.has(sound);
}

/**
 * Sound category per grapheme for the full-breakdown tile panels (Decode,
 * Word Detective), which already have curated graphemes + types. Consonants
 * keep their category (they're tiles, not running text); vowels get the same
 * schwa / irregular overrides the inline scaffold uses, so both surfaces
 * agree on what each vowel is doing.
 * @param {string} word
 * @param {string[]} graphemes
 * @param {string[]} types
 * @returns {string[]} SOUND_META keys aligned to `graphemes`
 */
export function graphemeSounds(word, graphemes, types) {
  const clean = String(word).toLowerCase().replace(/[^a-z]/g, '');
  const schwa = schwaIndices(clean);
  const silent = silentIndices(clean);
  const irregular = IRREGULAR.get(clean);
  const out = [];
  let idx = 0;
  for (let k = 0; k < graphemes.length; k++) {
    const g = graphemes[k] || '';
    const len = g.length || 1;
    let sound = soundForType(types[k]);
    if (VOWEL_SOUNDS.has(sound)) {
      sound = irregular?.[idx] ?? refineVowel(clean, g, idx, sound, schwa, silent);
    }
    out.push(sound);
    idx += len;
  }
  return out;
}

// ── Spelling-pattern fallback ──────────────────────────────────────────────

const VOWELS = 'aeiou';
const CONS = 'bcdfghjklmnpqrstvwxyz';
const isVowel = ch => VOWELS.includes(ch);
const isCons = ch => CONS.includes(ch);

/** Vowel teams → sound. Matched longest-first in the fallback scan. */
const TEAMS = Object.freeze({
  igh: 'long',
  ar: 'rcontrolled', or: 'rcontrolled', er: 'rcontrolled', ir: 'rcontrolled', ur: 'rcontrolled',
  ai: 'long', ay: 'long', ee: 'long', ea: 'long', ie: 'long', oa: 'long', oe: 'long',
  ue: 'long', ew: 'long', oo: 'long', ey: 'long',
  oi: 'diphthong', oy: 'diphthong', ou: 'diphthong', au: 'diphthong', aw: 'diphthong', ow: 'diphthong',
});
const TEAM_KEYS = Object.keys(TEAMS).sort((a, b) => b.length - a.length);

/**
 * Segment an unknown word by spelling pattern, with the shared refinements.
 * @param {string} word lowercase letters only
 * @param {Set<number>|null} schwa
 * @param {Set<number>|null} silent
 * @returns {Array<{len:number, sound:string|null}>}
 */
function fallbackSegments(word, schwa, silent) {
  const segs = [];
  const n = word.length;
  let i = 0;
  while (i < n) {
    // Split digraph: vowel–consonant–e at the very end (cake, plate, home).
    if (
      i === n - 3 &&
      isVowel(word[i]) && isCons(word[i + 1]) && word[i + 2] === 'e'
    ) {
      segs.push({ len: 1, sound: refineVowel(word, word[i], i, 'long', schwa, silent) });
      segs.push({ len: 1, sound: null });
      segs.push({ len: 1, sound: 'silent' });
      break;
    }
    // Vowel team, longest first.
    let matched = false;
    for (const team of TEAM_KEYS) {
      if (word.startsWith(team, i)) {
        segs.push({ len: team.length, sound: refineVowel(word, team, i, TEAMS[team], schwa, silent) });
        i += team.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    // Single vowel (or a vowel-y like "my", "happy"). Open syllable at the
    // word end reads long (go, he, my), otherwise short — before refinement.
    if (isVowel(word[i]) || (word[i] === 'y' && i > 0)) {
      const base = i === n - 1 ? 'long' : 'short';
      segs.push({ len: 1, sound: refineVowel(word, word[i], i, base, schwa, silent) });
      i += 1;
      continue;
    }
    // Consonant or other — no inline colour.
    segs.push({ len: 1, sound: null });
    i += 1;
  }
  return segs;
}

/**
 * Segment a known word from its curated graphemes/types, refined.
 * @param {{graphemes:string[], types:string[]}} entry
 * @param {string} word cleaned word
 * @param {Set<number>|null} schwa
 * @param {Set<number>|null} silent
 * @returns {Array<{len:number, sound:string|null}>}
 */
function bankSegments(entry, word, schwa, silent) {
  const segs = [];
  let idx = 0;
  for (let k = 0; k < entry.graphemes.length; k++) {
    const g = entry.graphemes[k];
    const len = g.length;
    // Some bank entries group a trailing consonant+e ("house" = h·ou·se) as
    // one tile; split it so the silent e reads silent and the consonant plain.
    if (
      len === 2 && g[1] === 'e' && CONS_CLASS.includes(g[0]) &&
      idx + 2 === word.length && silent?.has(idx + 1)
    ) {
      segs.push({ len: 1, sound: null });
      segs.push({ len: 1, sound: 'silent' });
      idx += 2;
      continue;
    }
    let sound = TYPE_SOUND[entry.types[k]] ?? null;
    if (!VOWEL_SOUNDS.has(sound) && sound !== 'silent') sound = null; // plain inline
    sound = refineVowel(word, g, idx, sound, schwa, silent);
    segs.push({ len, sound });
    idx += len;
  }
  return segs;
}

/**
 * Letter-aligned sound segments for a word (for inline colouring). Consonants
 * carry `sound: null` (rendered plain). Proper nouns are skipped entirely.
 * @param {string} rawWord a single word token (any case/punctuation)
 * @returns {Array<{len:number, sound:string|null}>|null} null = do not colour
 */
export function vowelSegments(rawWord) {
  const word = rawWord.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return null;
  if (PROPER_NOUNS.has(word)) return null;

  const irregular = IRREGULAR.get(word);
  if (irregular) {
    // Coalesce the per-letter array into runs.
    const segs = [];
    for (const sound of irregular) {
      const last = segs[segs.length - 1];
      if (last && last.sound === sound) last.len += 1;
      else segs.push({ len: 1, sound });
    }
    return segs;
  }

  const schwa = schwaIndices(word);
  const silent = silentIndices(word);
  const entry = BANK.get(word);
  return entry?.graphemes?.length
    ? bankSegments(entry, word, schwa, silent)
    : fallbackSegments(word, schwa, silent);
}

// ── Inline renderer ────────────────────────────────────────────────────────

/**
 * Wrap the vowels of every word in `text` with sound-coloured spans. Word
 * boundaries are the only thing tokenised; punctuation and spacing pass
 * through untouched, and case is preserved. Consonants are left plain so the
 * scaffold reads as a vowel-sound highlighter, not a rainbow.
 * @param {string} text plain story text (no markup)
 * @returns {string} HTML
 */
export function soundColoredHtml(text) {
  if (!text) return text;
  // Split into word / non-word runs; letters (and internal letters only) form
  // the word runs, everything else (spaces, punctuation) passes through.
  return text.replace(/[A-Za-z]+/g, (word) => {
    const segs = vowelSegments(word);
    if (!segs) return word;
    let out = '';
    let pos = 0;
    for (const { len, sound } of segs) {
      const slice = word.slice(pos, pos + len);
      pos += len;
      out += sound
        ? `<span class="vs vs--${sound}">${slice}</span>`
        : slice;
    }
    // Any remainder (shouldn't happen, but be safe).
    if (pos < word.length) out += word.slice(pos);
    return out;
  });
}
