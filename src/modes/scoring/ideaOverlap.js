/**
 * PhonicsQuest — Idea overlap against a model answer.
 *
 * Open-ended comprehension in this app has model answers but no marking keys:
 * every question is `{ q, model }`, with no keywords and no required groups.
 * That rules out automatic marking — scoring "3 people" against "Three — Sarah
 * and her two parents (she is the only child)" by string comparison would fail
 * a correct answer, and a marking system that is confidently wrong is worse
 * than none.
 *
 * What CAN be computed honestly is which ideas from the model answer appear in
 * the child's response. That is not a mark and this module never calls it one:
 * it is a checklist the child uses while comparing their answer to the model,
 * turning "read the model answer" into "check your answer against the model,
 * point by point".
 *
 * Pure functions over strings — no DOM, no store.
 */

/** Words that carry no idea on their own, so their presence proves nothing. */
const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'and',
  'or',
  'but',
  'so',
  'if',
  'then',
  'than',
  'that',
  'this',
  'these',
  'those',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'am',
  'do',
  'does',
  'did',
  'have',
  'has',
  'had',
  'will',
  'would',
  'shall',
  'should',
  'can',
  'could',
  'may',
  'might',
  'must',
  'to',
  'of',
  'in',
  'on',
  'at',
  'by',
  'for',
  'with',
  'from',
  'as',
  'into',
  'about',
  'it',
  'its',
  'he',
  'she',
  'they',
  'them',
  'his',
  'her',
  'their',
  'we',
  'us',
  'our',
  'you',
  'your',
  'i',
  'me',
  'my',
  'who',
  'what',
  'when',
  'where',
  'why',
  'how',
  'not',
  'no',
  'there',
  'here',
  'also',
  'very',
  'too',
  'more',
  'most',
  'some',
  'any',
  'all',
  'each',
  'because',
  'while',
  'after',
  'before',
]);

/** Digit-word equivalents, so "3 people" matches a model that says "three". */
const NUMBER_WORDS = Object.freeze({
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  10: 'ten',
});

function _words(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(Boolean);
}

/**
 * Compare on a stem so inflection does not cause a false miss: "moving" in the
 * model should be found by "moved" in the answer.
 *
 * A bare prefix is not enough — "moving" and "moved" share only three letters,
 * so a four-character cut reports a miss on a word the child clearly used.
 * Strip the inflection first, undo any doubled consonant, then cut what is
 * left. Deliberately crude, because a wrong stem here only adds or drops a
 * checklist line; it never moves a mark.
 */
function _stem(word) {
  let w = NUMBER_WORDS[word] || word;
  const suffix = ['ing', 'ed', 'es', 'ly', 's'].find(
    (suf) => w.length > suf.length + 2 && w.endsWith(suf),
  );
  if (suffix) {
    w = w.slice(0, -suffix.length);
    if (/([bdfglmnprt])\1$/.test(w)) w = w.slice(0, -1);
    w = w.replace(/i$/, 'y');
  }
  return w.length <= 5 ? w : w.slice(0, 5);
}

/**
 * The idea words a model answer is made of.
 * @param {string} model
 * @returns {string[]} content words, de-duplicated, in the model's own order
 */
export function modelIdeaWords(model) {
  const seen = new Set();
  const out = [];
  for (const word of _words(model)) {
    if (STOPWORDS.has(word)) continue;
    if (word.length < 3 && !/^\d+$/.test(word)) continue;
    const stem = _stem(word);
    if (seen.has(stem)) continue;
    seen.add(stem);
    out.push(word);
  }
  return out;
}

/**
 * Which of the model's ideas appear in the child's answer.
 *
 * @param {string} given   the child's typed response
 * @param {string} model   the model answer
 * @returns {{
 *   covered: string[],   model idea words found in the answer
 *   missing: string[],   model idea words not found
 *   ratio: number,       covered / total, 0 when the model has no idea words
 *   answered: boolean,   whether the child wrote anything at all
 * }}
 *   Never a score. `ratio` describes overlap with one particular wording of
 *   the answer, and a good response can paraphrase every idea away.
 */
export function compareToModel(given, model) {
  const answered = _words(given).length > 0;
  const ideas = modelIdeaWords(model);
  if (!ideas.length) return { covered: [], missing: [], ratio: 0, answered };

  const answerStems = new Set(_words(given).map(_stem));
  const covered = [];
  const missing = [];
  for (const idea of ideas) {
    if (answerStems.has(_stem(idea))) covered.push(idea);
    else missing.push(idea);
  }

  return { covered, missing, ratio: covered.length / ideas.length, answered };
}

export const __TEST__ = { STOPWORDS, _stem, _words };
