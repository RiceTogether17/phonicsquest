/**
 * Listen and Spell — scoring & hints.
 *
 * Pairs with `lscwcDrill.js` (the Look-Say-Cover-Write-Check drill) as its
 * canonical UI; this module exists so the scoring logic is reusable from
 * other surfaces (sight-word recall, spelling sprint, parent reports).
 *
 * Attempt shape:
 *   {
 *     target:  'cake',
 *     written: 'cak',     // letters the child placed, in order
 *     timeMs:  number,
 *   }
 *
 * Error categories:
 *   - missing-letter     : written.length < target.length
 *   - transposed-letters : same multiset, wrong order
 *   - wrong-vowel        : vowel substitution at the vowel slot
 *   - silent-e-missing   : long-vowel split-digraph word missing the final e
 *   - default
 */

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

const HINTS = Object.freeze({
  'missing-letter': 'You missed a letter. Say the word and count the sounds.',
  'transposed-letters': 'The right letters, the wrong order. Say each sound from left to right.',
  'wrong-vowel': 'Listen to the vowel sound. Try a different vowel and re-read it.',
  'silent-e-missing': 'The vowel says its name. Add a silent e at the end.',
  default: 'Say the word slowly. Tap one letter for each sound you hear.',
});

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

function classify(target, written) {
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
  return 'default';
}

export function getListenAndSpellHint(attempt = {}) {
  const cat = classify(attempt?.target, attempt?.written);
  return cat ? (HINTS[cat] ?? HINTS.default) : '';
}

export function scoreListenAndSpell(attempt = {}) {
  const t = _norm(attempt?.target);
  const w = _norm(attempt?.written);
  const correct = !!t && t === w;
  const errorCategory = correct ? null : classify(t, w);

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
    scoreBreakdown: { accuracy, matches, total: len },
  };
}
