/**
 * PhonicsQuest – word and phrase matching over a learner's own writing.
 *
 * Audit 2026-09-19, finding 19. `writingEvaluator.js` credited connectors with
 * `lower.includes(c)`, so the audit's example
 *
 *     "The island was sandy. She forgot the ball."
 *
 * was credited with **and** (inside "sandy"), **or** (inside "forgot") and
 * **as** (inside "was") — three distinct connectors, the same count as
 * "The island was hot and dry. She left because she was tired.", which
 * actually uses two.
 *
 * "as" inside "was" is the one that matters most: a past-tense narrative is
 * almost guaranteed to contain "was", so every story a child wrote collected a
 * free subordinate-bank connector. Reproduced here, the defect goes further
 * than the one example — "The bandage was soft. He was thirsty. The horse ran.
 * A sorbet melted." scored **four** distinct connectors from none at all.
 *
 * The same `includes` pattern decided required-point coverage (a task needing
 * "ball" was satisfied by "football" or "balloon"), sequence words ("after"
 * inside "afternoon"), and show-don't-tell credit ("rushed" inside "brushed",
 * "froze" inside "frozen").
 *
 * So matching happens on word boundaries. `\b` rather than Unicode property
 * lookbehind: every list this serves is English function words and school
 * vocabulary, `\b` is the universally supported primitive, and a hyphenated
 * "after-school" genuinely does contain the word "after".
 *
 * Matching is exact. There is no stemmer, deliberately: the word lists are
 * already written in the form their author expected to see ("gasped",
 * "trembled"), and a stemmer would put a second layer of inference between the
 * child's words and the credit they are given — which is the kind of thing
 * this finding is about. Where another form should count, add it to the list.
 */

/** Escape a literal string for use inside a regular expression. */
function escapeRe(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Cached patterns — these lists are matched on every keystroke of live feedback. */
const _cache = new Map();

/**
 * A whole-word/phrase matcher for one phrase.
 *
 * Internal whitespace is flexible, so "after that" matches across a line
 * break or a double space the child typed.
 *
 * The boundaries are conditional. `\b` is defined between a word character
 * and a non-word one, so `\b$5\b` can never match: the space before `$` is
 * two non-word characters, which is not a boundary. Required-point keywords
 * are authored task data and can be anything — "$5", "P.E." — so an edge that
 * is not a word character gets no boundary marker, because a non-word
 * character already separates itself from the word beside it.
 *
 * @param {string} phrase
 * @param {{plural?: boolean}} [opts] allow a trailing -s/-es on the last word
 * @returns {RegExp|null} null when the phrase is empty
 */
export function phrasePattern(phrase, { plural = false } = {}) {
  const trimmed = String(phrase ?? '').trim();
  if (!trimmed) return null;

  const key = plural ? `${trimmed}\u0000s` : trimmed;
  if (_cache.has(key)) return _cache.get(key);

  const body = trimmed.split(/\s+/).map(escapeRe).join('\\s+');
  const left = /^\w/.test(trimmed) ? '\\b' : '';
  const right = /\w$/.test(trimmed) ? '\\b' : '';
  const tail = plural && /\w$/.test(trimmed) ? '(?:e?s)?' : '';
  const pattern = new RegExp(`${left}${body}${tail}${right}`, 'i');
  _cache.set(key, pattern);
  return pattern;
}

/**
 * Does the text use this word or phrase, as a word rather than as letters
 * inside another one?
 *
 * @param {string} text
 * @param {string} phrase
 * @returns {boolean}
 */
export function containsPhrase(text, phrase) {
  const pattern = phrasePattern(phrase);
  return pattern ? pattern.test(String(text ?? '')) : false;
}

/**
 * Does the text use this required term, allowing a plural or third-person -s?
 *
 * For the content words a task asks a child to mention. Strict word matching
 * fixes the false positives this finding is about ("football" no longer
 * counts as "ball"), but it introduces a false negative of its own: a child
 * who writes "we lost two balls" HAS mentioned the ball. `ball(?:e?s)?`
 * matches ball and balls and not football or balloon.
 *
 * It is deliberately only this. Past tense ("apologised" for "apologise") and
 * other inflections are not covered — adding them means a stemmer, and a
 * stemmer is another layer of inference between what the child wrote and the
 * credit they get. Where a form should count, add it to the task's keyword
 * list, which is authored data a person can read.
 *
 * Connectors do not use this: "and" has no plural, and loosening a function
 * word is how "as" started matching "was".
 *
 * @param {string} text
 * @param {string} term
 * @returns {boolean}
 */
export function containsTerm(text, term) {
  const pattern = phrasePattern(term, { plural: true });
  return pattern ? pattern.test(String(text ?? '')) : false;
}

/**
 * How many of these required terms the text uses (plural-tolerant).
 *
 * @param {string} text
 * @param {string[]} terms
 * @returns {number}
 */
export function countTerms(text, terms = []) {
  const haystack = String(text ?? '');
  return (terms || []).filter((term) => containsTerm(haystack, term)).length;
}

/**
 * Does the text use every one of these required terms (plural-tolerant)?
 *
 * @param {string} text
 * @param {string[]} terms
 * @returns {boolean}
 */
export function containsAllTerms(text, terms = []) {
  const list = terms || [];
  if (!list.length) return false;
  const haystack = String(text ?? '');
  return list.every((term) => containsTerm(haystack, term));
}

/**
 * Which of these words or phrases the text actually uses, in list order.
 *
 * Returning the matches rather than a count is deliberate: a screen that can
 * say "connectors you used: and, because" is showing the child the evidence
 * behind the score, and a wrong match becomes visible instead of silently
 * inflating a number.
 *
 * @param {string} text
 * @param {string[]} phrases
 * @returns {string[]}
 */
export function findPhrases(text, phrases = []) {
  const haystack = String(text ?? '');
  return (phrases || []).filter((phrase) => containsPhrase(haystack, phrase));
}

/**
 * Where the text first uses this word or phrase, or -1.
 *
 * `indexOf` would find "then" inside "when" and "after" inside "afternoon",
 * which matters doubly where the position is what is being measured: a
 * sequence marker found at the wrong place reports the story's events in the
 * wrong order.
 *
 * @param {string} text
 * @param {string} phrase
 * @returns {number} character index, or -1
 */
export function phraseIndex(text, phrase) {
  const pattern = phrasePattern(phrase);
  if (!pattern) return -1;
  const match = String(text ?? '').match(pattern);
  return match ? match.index : -1;
}

/**
 * How many of these words or phrases the text uses.
 *
 * @param {string} text
 * @param {string[]} phrases
 * @returns {number}
 */
export function countPhrases(text, phrases = []) {
  return findPhrases(text, phrases).length;
}

/**
 * Does the text use at least one of these words or phrases?
 *
 * @param {string} text
 * @param {string[]} phrases
 * @returns {boolean}
 */
export function containsAnyPhrase(text, phrases = []) {
  const haystack = String(text ?? '');
  return (phrases || []).some((phrase) => containsPhrase(haystack, phrase));
}

/**
 * Does the text use every one of these words or phrases?
 *
 * An empty list is not "all present" — a check with no terms has nothing to
 * be satisfied by, and returning true would mark it covered for free.
 *
 * @param {string} text
 * @param {string[]} phrases
 * @returns {boolean}
 */
export function containsAllPhrases(text, phrases = []) {
  const list = phrases || [];
  if (!list.length) return false;
  const haystack = String(text ?? '');
  return list.every((phrase) => containsPhrase(haystack, phrase));
}
