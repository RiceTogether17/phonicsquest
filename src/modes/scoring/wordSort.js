/**
 * Word Sort — scoring & hints.
 *
 * The child sorts words into category bins (e.g. by vowel sound, or by
 * spelling pattern). The scorer evaluates a finished round and identifies
 * the dominant confusion so the hint engine can be specific.
 *
 * Round shape (input to buildWordSortRound):
 *   {
 *     items:      [{ word: 'cat', category: 'short-a' }, ...]
 *     categories: ['short-a', 'short-e', 'short-i'],
 *   }
 *
 * Attempt shape (input to scoreWordSort):
 *   {
 *     placements: [
 *       { word: 'cat', expected: 'short-a', placed: 'short-a' },
 *       { word: 'pen', expected: 'short-e', placed: 'short-i' },
 *       ...
 *     ],
 *     timeMs: number,
 *   }
 */

const HINTS = Object.freeze({
  'vowel-confusion':   'Say the word slowly. What vowel sound do you hear in the middle?',
  'pattern-confusion': 'Look at the letters in the middle. Does it have a_e, ai, or ay?',
  'default':           'Stretch the word out. The middle sound tells you the right box.',
});

/**
 * Build a sort round from a flat list of {word, category} items. Optionally
 * shuffles the items and the category order via the injected RNG so tests
 * can be deterministic.
 */
export function buildWordSortRound(items = [], categories = null, { count = items.length, rng = Math.random } = {}) {
  const safe = Array.isArray(items) ? items.filter(i => i && i.word && i.category) : [];
  const picked = _take(safe, count, rng);
  const cats   = categories?.length
    ? categories
    : [...new Set(picked.map(i => i.category))];
  return { items: picked, categories: cats };
}

function _take(arr, n, rng) {
  const a = [...arr];
  // Fisher-Yates
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.max(0, Math.min(n, a.length)));
}

/**
 * Classify the dominant error pattern. If most errors are between two
 * short vowels, surface vowel-confusion. If they're between two long-vowel
 * spelling patterns of the SAME vowel, surface pattern-confusion.
 */
function classify(errors) {
  if (!errors.length) return 'default';

  let vowelClash   = 0;
  let patternClash = 0;
  for (const e of errors) {
    if (_isShortVowelPair(e.expected, e.placed))    vowelClash++;
    if (_isLongVowelPatternPair(e.expected, e.placed)) patternClash++;
  }
  if (patternClash >= vowelClash && patternClash > 0) return 'pattern-confusion';
  if (vowelClash > 0) return 'vowel-confusion';
  return 'default';
}

const SHORT_VOWEL_CATS = new Set([
  'short-a', 'short-e', 'short-i', 'short-o', 'short-u',
  'cvc-a', 'cvc-e', 'cvc-i', 'cvc-o', 'cvc-u',
]);

function _isShortVowelPair(a, b) {
  return SHORT_VOWEL_CATS.has(a) && SHORT_VOWEL_CATS.has(b) && a !== b;
}

function _isLongVowelPatternPair(a, b) {
  // Same vowel letter, different spelling pattern: long-a-ae vs long-a-ai
  const ma = /^long-([aeiou])-/.exec(String(a));
  const mb = /^long-([aeiou])-/.exec(String(b));
  return !!ma && !!mb && ma[1] === mb[1] && a !== b;
}

export function getWordSortHint(attempt = {}) {
  const errors = (attempt?.placements ?? []).filter(p => p.expected !== p.placed);
  const cat = classify(errors);
  return HINTS[cat] ?? HINTS.default;
}

export function scoreWordSort(attempt = {}) {
  const placements = Array.isArray(attempt?.placements) ? attempt.placements : [];
  const total      = placements.length;
  const correct    = placements.filter(p => p.expected === p.placed).length;
  const accuracy   = total === 0 ? 0 : correct / total;
  const errors     = placements.filter(p => p.expected !== p.placed);
  const errorCategory = errors.length === 0 ? null : classify(errors);

  return {
    correct: errors.length === 0 && total > 0,
    errorCategory,
    hint: errors.length === 0 ? '' : (HINTS[errorCategory] ?? HINTS.default),
    masteryDelta: accuracy >= 0.80 ? 1 : 0,
    scoreBreakdown: { accuracy, correctPlacements: correct, total, errors: errors.length },
  };
}
