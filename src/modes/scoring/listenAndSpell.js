/**
 * Listen and Spell — scoring & hints.
 *
 * Backs `listenAndSpellMode.js` (the encoding mode) and `lscwcDrill.js` (the
 * Look-Say-Cover-Write-Check drill); the logic lives here, pure, so it is
 * reusable from other surfaces (sight-word recall, spelling sprint, parent
 * reports) and testable without a DOM.
 *
 * Attempt shape:
 *   {
 *     target:  'cake',
 *     written: 'cak',     // letters the child placed, in order
 *     timeMs:  number,
 *
 *     // OPTIONAL — supplied by listenAndSpellMode, which knows how the child
 *     // carved the word up because they placed one tile per sound:
 *     targetGraphemes:  ['c', 'a', 'k', 'e'],
 *     targetTypes:      ['c', 'lv', 'c', 'se'],   // words.js `types`
 *     writtenGraphemes: ['c', 'ai', 'k'],
 *   }
 *
 * Error categories:
 *   - missing-letter     : written.length < target.length
 *   - transposed-letters : same multiset, wrong order
 *   - wrong-vowel        : vowel substitution at the vowel slot
 *   - silent-e-missing   : long-vowel split-digraph word missing the final e
 *   - plausible-spelling : every sound is spelled with a grapheme that really
 *                          does spell that sound in English — just not the one
 *                          this word uses ("caik" for cake)
 *   - default
 *
 * ── Why `plausible-spelling` is separate ─────────────────────────────────
 *
 * "caik" and "cadk" are both wrong, and a percentage score calls them equal.
 * A teacher does not. "caik" says the child segmented /k/-/ā/-/k/ correctly
 * and picked a real long-a spelling — the phonology is sound and only the
 * orthographic choice is wrong, which is a spelling-pattern lesson. "cadk"
 * says the segmentation itself broke down, which is a segmenting lesson.
 * Routing both to "try again" throws away the most informative thing the
 * child just did.
 *
 * Plausibility needs to know which grapheme the child chose for each sound,
 * which a bare letter string cannot tell you — `caik` could be c-ai-k or
 * c-a-i-k. So it is only computed when the caller supplies both grapheme
 * arrays; every other caller keeps the letter-level behaviour unchanged.
 */

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

const HINTS = Object.freeze({
  'missing-letter': 'You missed a letter. Say the word and count the sounds.',
  'transposed-letters': 'The right letters, the wrong order. Say each sound from left to right.',
  'wrong-vowel': 'Listen to the vowel sound. Try a different vowel and re-read it.',
  'silent-e-missing': 'The vowel says its name. Add a silent e at the end.',
  'plausible-spelling':
    'Great sounding out! Every sound is right — this word just uses a different spelling.',
  default: 'Say the word slowly. Tap one letter for each sound you hear.',
});

/**
 * Sound → the graphemes that spell it, restricted to the code this word bank
 * teaches. Keys are internal sound ids, not IPA; they only ever have to
 * compare equal to each other.
 *
 * Deliberately NOT a flat "these graphemes are interchangeable" list. `c`
 * spells /k/ in `cat` and /s/ in `race`, so a list would make "sat" a
 * plausible spelling of "cat" — a different real word, and exactly the kind
 * of nonsense a teacher would catch on the first report. Going through the
 * sound keeps every substitution answerable: does this grapheme spell THIS
 * sound?
 */
const SOUND_SPELLINGS = Object.freeze({
  // Consonants
  k: ['c', 'k', 'ck'],
  s: ['s', 'ss', 'c'],
  z: ['z', 'zz'],
  j: ['j', 'g', 'dge', 'ge'],
  g: ['g', 'gg'],
  f: ['f', 'ff', 'ph'],
  ch: ['ch', 'tch'],
  l: ['l', 'll'],
  n: ['n', 'nn', 'kn'],
  m: ['m', 'mm'],
  b: ['b', 'bb'],
  d: ['d', 'dd'],
  p: ['p', 'pp'],
  t: ['t', 'tt'],
  r: ['r', 'rr', 'wr'],
  // Long vowels. `X_e` is the split-digraph unit — see `_foldSilentE`.
  'long-a': ['a_e', 'ai', 'ay'],
  'long-e': ['e_e', 'ee', 'ea', 'ie', 'y'],
  'long-i': ['i_e', 'igh', 'ie', 'y'],
  'long-o': ['o_e', 'oa', 'ow', 'oe'],
  'long-u': ['u_e', 'ue', 'ew', 'oo'],
  // R-controlled: er, ir and ur are one sound with three spellings — the
  // single most common plausible-but-wrong spelling in early writing.
  er: ['er', 'ir', 'ur'],
  // Diphthongs
  oi: ['oi', 'oy'],
  ou: ['ou', 'ow'],
  aw: ['aw', 'au'],
});

/** grapheme → every sound it can spell. */
const GRAPHEME_SOUNDS = (() => {
  /** @type {Map<string, Set<string>>} */
  const map = new Map();
  for (const [sound, graphemes] of Object.entries(SOUND_SPELLINGS)) {
    for (const g of graphemes) {
      if (!map.has(g)) map.set(g, new Set());
      map.get(g).add(sound);
    }
  }
  return map;
})();

/**
 * Graphemes that spell more than one sound, where guessing wrong produces a
 * different real word. For these the TARGET's sound is pinned rather than
 * left open: by the word data's type tag when there is one, otherwise by the
 * common value. The child's own grapheme stays open — all that matters is
 * whether it can spell the target's sound at all.
 */
const TYPE_SOUND = Object.freeze({ soft_c: 's', soft_g: 'j' });
const PINNED_SOUND = Object.freeze({ c: 'k', g: 'g', s: 's' });

/**
 * Which side of the vowel/consonant line each sound sits on, and which
 * `types` tags mean which.
 *
 * `y` is why this exists. It spells /y/ in `yam`, long-e in `happy` and
 * long-i in `sky`, and the grapheme alone cannot tell you which — so the
 * letter bank for `yam` offered `ea`, `ie` and `igh` as alternatives for a
 * consonant. The type tag settles it: a consonant-typed grapheme can only
 * be standing in for a consonant sound.
 */
const VOWEL_SOUNDS = new Set(['long-a', 'long-e', 'long-i', 'long-o', 'long-u', 'er', 'oi', 'ou', 'aw']); // prettier-ignore
const VOWEL_TYPES = new Set(['sv', 'lv', 'rc', 'dp']);
const CONSONANT_TYPES = new Set(['c', 'bl', 'd', 'soft_c', 'soft_g']);

const EMPTY = Object.freeze(new Set());

/** The sound the target grapheme makes in this word. */
function _targetSounds(grapheme, type) {
  if (type && TYPE_SOUND[type]) return new Set([TYPE_SOUND[type]]);
  if (PINNED_SOUND[grapheme]) return new Set([PINNED_SOUND[grapheme]]);

  const all = GRAPHEME_SOUNDS.get(grapheme) ?? EMPTY;
  const wantVowel = VOWEL_TYPES.has(type);
  // An unrecognised tag leaves the grapheme open rather than guessing.
  if (!wantVowel && !CONSONANT_TYPES.has(type)) return all;

  const filtered = new Set();
  for (const sound of all) if (VOWEL_SOUNDS.has(sound) === wantVowel) filtered.add(sound);
  return filtered;
}

function _norm(s) {
  return String(s ?? '').toLowerCase();
}

function multisetEqual(a, b) {
  if (a.length !== b.length) return false;
  const c = new Map();
  for (const ch of a) c.set(ch, (c.get(ch) ?? 0) + 1);
  for (const ch of b) {
    const n = c.get(ch);
    if (!n) return false;
    c.set(ch, n - 1);
  }
  return true;
}

function _isSplitDigraph(word) {
  // word ends in vowel + consonant + 'e' (e.g. cake, ride, hope, cube)
  const w = _norm(word);
  if (w.length < 4) return false;
  if (w[w.length - 1] !== 'e') return false;
  if (VOWELS.has(w[w.length - 2])) return false;
  return VOWELS.has(w[w.length - 3]);
}

/**
 * Collapse a split digraph into one unit: ['c','a','k','e'] → ['c','a_e','k'].
 *
 * The silent e is not a sound of its own — it is the back half of the vowel
 * spelling, sitting at the wrong end of the word. Folding it makes the unit
 * count equal the SOUND count, so a child who spells `cake` as c-ai-k (three
 * tiles) is compared slot-for-slot against c-a_e-k (also three) instead of
 * failing on length. Target and child's tiles both go through this same
 * fold, so the comparison stays symmetric.
 *
 * `types` is folded in step when supplied, so it stays parallel.
 *
 * @param {string[]} units
 * @param {string[]|null} [types]
 * @returns {{units: string[], types: string[]|null}}
 */
function _foldSilentE(units, types = null) {
  const n = units.length;
  const unchanged = { units, types };
  if (n < 3 || units[n - 1] !== 'e') return unchanged;
  const vowel = units[n - 3];
  if (vowel.length !== 1 || !VOWELS.has(vowel)) return unchanged;

  const folded = units.slice(0, -1);
  folded[n - 3] = `${vowel}_e`;
  return { units: folded, types: types ? types.slice(0, -1) : null };
}

/**
 * Did the child spell every sound with a grapheme that really spells that
 * sound — just not the one this word uses?
 *
 * @param {string[]} targetGraphemes
 * @param {string[]} writtenGraphemes
 * @param {{targetTypes?: string[]}} [opts]
 * @returns {boolean}
 */
export function isPlausibleSpelling(targetGraphemes, writtenGraphemes, opts = {}) {
  if (!Array.isArray(targetGraphemes) || !Array.isArray(writtenGraphemes)) return false;
  if (!targetGraphemes.length || !writtenGraphemes.length) return false;

  const tTypes = Array.isArray(opts?.targetTypes) ? opts.targetTypes : null;
  const t = _foldSilentE(targetGraphemes.map(_norm), tTypes);
  const w = _foldSilentE(writtenGraphemes.map(_norm));

  // One tile per sound in both, or the child heard a different number of
  // sounds — a segmenting slip, not a spelling-choice one.
  if (t.units.length !== w.units.length) return false;

  for (let i = 0; i < t.units.length; i++) {
    if (t.units[i] === w.units[i]) continue;
    const wanted = _targetSounds(t.units[i], t.types?.[i]);
    const offered = GRAPHEME_SOUNDS.get(w.units[i]) ?? EMPTY;
    let shares = false;
    for (const sound of wanted) {
      if (offered.has(sound)) {
        shares = true;
        break;
      }
    }
    if (!shares) return false;
  }
  return true;
}

/**
 * Other graphemes that spell the same sound as `grapheme` does here — the
 * real spelling choices a child has to pick between.
 *
 * `listenAndSpellMode` builds its letter bank from this, so the distractors
 * are the alternatives a child would actually reach for ("ai" for the /ā/ in
 * cake) rather than arbitrary letters. A bank of impossible options tests
 * nothing: the child eliminates instead of spelling.
 *
 * @param {string} grapheme
 * @param {string} [type]  the words.js `types` tag for this grapheme
 * @returns {string[]}
 */
export function alternativeSpellings(grapheme, type) {
  const g = _norm(grapheme);
  const out = new Set();
  for (const sound of _targetSounds(g, type)) {
    for (const alt of SOUND_SPELLINGS[sound] ?? []) if (alt !== g) out.add(alt);
  }
  return [...out];
}

function classify(target, written, attempt) {
  const t = _norm(target);
  const w = _norm(written);
  if (t === w) return null;
  if (_isSplitDigraph(t) && w === t.slice(0, -1)) return 'silent-e-missing';
  if (w.length < t.length) return 'missing-letter';
  if (w.length === t.length && multisetEqual([...t], [...w])) return 'transposed-letters';

  // Vowel substitution at vowel positions only
  if (w.length === t.length) {
    let vowelErrors = 0;
    let consErrors = 0;
    for (let i = 0; i < t.length; i++) {
      if (t[i] !== w[i]) {
        if (VOWELS.has(t[i]) && VOWELS.has(w[i])) vowelErrors++;
        else consErrors++;
      }
    }
    if (vowelErrors > 0 && consErrors === 0) return 'wrong-vowel';
  }

  // Last, so the letter-level categories above keep their meaning: a missing
  // silent e is reported as a missing silent e, not as "a different spelling".
  if (
    isPlausibleSpelling(attempt?.targetGraphemes, attempt?.writtenGraphemes, {
      targetTypes: attempt?.targetTypes,
    })
  ) {
    return 'plausible-spelling';
  }

  return 'default';
}

export function getListenAndSpellHint(attempt = {}) {
  const cat = classify(attempt?.target, attempt?.written, attempt);
  return cat ? (HINTS[cat] ?? HINTS.default) : '';
}

export function scoreListenAndSpell(attempt = {}) {
  const t = _norm(attempt?.target);
  const w = _norm(attempt?.written);
  const correct = !!t && t === w;
  const errorCategory = correct ? null : classify(t, w, attempt);

  // Position-wise accuracy for partial credit.
  const len = Math.max(t.length, w.length);
  let matches = 0;
  for (let i = 0; i < len; i++) if (t[i] && w[i] && t[i] === w[i]) matches++;
  const accuracy = len === 0 ? 0 : matches / len;

  return {
    correct,
    errorCategory,
    hint: correct ? '' : (HINTS[errorCategory] ?? HINTS.default),
    masteryDelta: correct ? 1 : 0,
    // Right sounds, wrong spelling. Kept separate from `correct` on purpose:
    // mastery must not count it, but the child gets credit for the segmenting
    // and the report gets to say which of the two actually went wrong.
    plausible: correct || errorCategory === 'plausible-spelling',
    scoreBreakdown: { accuracy, matches, total: len },
  };
}

export const __TEST__ = { SOUND_SPELLINGS, GRAPHEME_SOUNDS, _foldSilentE, _targetSounds };
