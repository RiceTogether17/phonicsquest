/**
 * Read and Tap — scoring & hints.
 *
 * The child reads (or hears) a sentence and taps the target word.
 *
 * Attempt shape:
 *   {
 *     sentence:    'The big cat sat on the mat.',
 *     target:      'cat',                // canonical target word (lowercase)
 *     tappedWord:  'mat',                // word the child tapped
 *     tappedIndex: number,               // word index they tapped
 *     timeMs:      number,
 *   }
 *
 * Error categories:
 *   - tapped-similar-onset : tapped word shares the same first phoneme/letter
 *   - tapped-rhyme         : tapped word shares the rime (e.g. cat/mat)
 *   - tapped-anywhere      : far from target and unrelated
 */

const HINTS = Object.freeze({
  'tapped-similar-onset': 'Two words start the same. Say each one and listen for the rest.',
  'tapped-rhyme':         'Those words rhyme. Look at how the start is spelled.',
  'tapped-anywhere':      'Read the sentence left to right. Stop when the word sounds the same.',
  'default':              'Read each word out loud. Tap the one that matches what you heard.',
});

const PUNCT_RE = /[^a-z0-9']/gi;

function _norm(w) {
  return String(w ?? '').toLowerCase().replace(PUNCT_RE, '');
}

/**
 * Find the rime — everything from the first vowel onwards. Falls back to
 * the whole word if no vowel is found.
 */
function _rime(w) {
  const s = _norm(w);
  const i = s.search(/[aeiou]/);
  return i === -1 ? s : s.slice(i);
}

function classify(target, tapped) {
  const t = _norm(target);
  const c = _norm(tapped);
  if (!c || !t || t === c) return 'default';
  if (c[0] === t[0]) return 'tapped-similar-onset';
  if (_rime(c) === _rime(t)) return 'tapped-rhyme';
  return 'tapped-anywhere';
}

/**
 * Tokenise a sentence into normalised words plus their original surface
 * forms, so the UI can highlight them while scoring uses the canonical form.
 */
export function tokenizeSentence(sentence = '') {
  const surface = String(sentence).split(/\s+/).filter(Boolean);
  return surface.map((raw, i) => ({ index: i, surface: raw, word: _norm(raw) }));
}

export function getReadAndTapHint(attempt = {}) {
  const cat = classify(attempt?.target, attempt?.tappedWord);
  return HINTS[cat] ?? HINTS.default;
}

export function scoreReadAndTap(attempt = {}) {
  const t = _norm(attempt?.target);
  const c = _norm(attempt?.tappedWord);
  const correct = !!t && t === c;
  const errorCategory = correct ? null : classify(t, c);

  return {
    correct,
    errorCategory,
    hint: correct ? '' : (HINTS[errorCategory] ?? HINTS.default),
    masteryDelta: correct ? 1 : 0,
    scoreBreakdown: { accuracy: correct ? 1 : 0 },
  };
}
