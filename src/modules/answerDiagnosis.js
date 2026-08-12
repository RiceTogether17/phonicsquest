/**
 * PhonicsQuest – Answer diagnosis
 *
 * Turns "wrong" into "wrong *because*".
 *
 * Every primary-English mode already knows three things when a child answers:
 * the question stem, what they chose, and what was correct. That is enough to
 * work out the misconception behind most wrong answers *without any per-item
 * authoring*, by comparing the two answers morphologically and reading the
 * clue words in the stem. `was` chosen where `were` was needed is subject–verb
 * agreement. `walks` where `walked` was needed, with "yesterday" sitting in
 * the stem, is a missed time signal. `their` for `there` is a homophone.
 *
 * That matters for coverage: hand-authored `optionExplanations` exist on a
 * small fraction of the ~5,000 items in the banks. Detection applies to all
 * of them, and authored explanations still win when present (see
 * `teacherFeedback.js`).
 *
 * Everything here is a pure function over strings — no DOM, no store, no
 * network — so it is cheap to call on every answer and easy to test.
 */

import { MISCONCEPTIONS, fallbackMisconceptionFor } from './misconceptions.js';

// ── Small string helpers ──────────────────────────────────────────────────

/** Lowercase, strip surrounding punctuation and collapse whitespace. */
function norm(value) {
  return String(value ?? '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Normalise and drop punctuation entirely — for comparing single words. */
function bare(value) {
  return norm(value)
    .replace(/[^a-z' ]/g, '')
    .trim();
}

function words(value) {
  return bare(value).split(' ').filter(Boolean);
}

/** Levenshtein distance, capped for speed on long strings. */
export function editDistance(a, b) {
  const s = String(a ?? '');
  const t = String(b ?? '');
  if (s === t) return 0;
  if (!s.length) return t.length;
  if (!t.length) return s.length;
  let prev = Array.from({ length: t.length + 1 }, (_, i) => i);
  for (let i = 1; i <= s.length; i++) {
    const curr = [i];
    for (let j = 1; j <= t.length; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (s[i - 1] === t[j - 1] ? 0 : 1),
      );
    }
    prev = curr;
  }
  return prev[t.length];
}

// ── Word banks ────────────────────────────────────────────────────────────

/** Verb pairs that differ only in number (singular form → plural form). */
const NUMBER_PAIRS = Object.freeze([
  ['is', 'are'],
  ['was', 'were'],
  ['has', 'have'],
  ['does', 'do'],
  ["isn't", "aren't"],
  ["wasn't", "weren't"],
  ["hasn't", "haven't"],
  ["doesn't", "don't"],
]);

const PRESENT_FORMS = new Set(['am', 'is', 'are', 'do', 'does', 'have', 'has']);
const PAST_FORMS = new Set(['was', 'were', 'did', 'had']);

/** Irregular verbs as [base, past, participle]. Common primary set. */
const IRREGULAR_VERBS = Object.freeze([
  ['be', 'was', 'been'],
  ['begin', 'began', 'begun'],
  ['break', 'broke', 'broken'],
  ['bring', 'brought', 'brought'],
  ['build', 'built', 'built'],
  ['buy', 'bought', 'bought'],
  ['catch', 'caught', 'caught'],
  ['choose', 'chose', 'chosen'],
  ['come', 'came', 'come'],
  ['do', 'did', 'done'],
  ['draw', 'drew', 'drawn'],
  ['drink', 'drank', 'drunk'],
  ['drive', 'drove', 'driven'],
  ['eat', 'ate', 'eaten'],
  ['fall', 'fell', 'fallen'],
  ['feel', 'felt', 'felt'],
  ['find', 'found', 'found'],
  ['fly', 'flew', 'flown'],
  ['forget', 'forgot', 'forgotten'],
  ['get', 'got', 'gotten'],
  ['give', 'gave', 'given'],
  ['go', 'went', 'gone'],
  ['grow', 'grew', 'grown'],
  ['hear', 'heard', 'heard'],
  ['hide', 'hid', 'hidden'],
  ['hold', 'held', 'held'],
  ['keep', 'kept', 'kept'],
  ['know', 'knew', 'known'],
  ['leave', 'left', 'left'],
  ['lend', 'lent', 'lent'],
  ['lose', 'lost', 'lost'],
  ['make', 'made', 'made'],
  ['meet', 'met', 'met'],
  ['pay', 'paid', 'paid'],
  ['put', 'put', 'put'],
  ['read', 'read', 'read'],
  ['ride', 'rode', 'ridden'],
  ['ring', 'rang', 'rung'],
  ['run', 'ran', 'run'],
  ['say', 'said', 'said'],
  ['see', 'saw', 'seen'],
  ['sell', 'sold', 'sold'],
  ['send', 'sent', 'sent'],
  ['sing', 'sang', 'sung'],
  ['sit', 'sat', 'sat'],
  ['sleep', 'slept', 'slept'],
  ['speak', 'spoke', 'spoken'],
  ['spend', 'spent', 'spent'],
  ['stand', 'stood', 'stood'],
  ['steal', 'stole', 'stolen'],
  ['swim', 'swam', 'swum'],
  ['take', 'took', 'taken'],
  ['teach', 'taught', 'taught'],
  ['tell', 'told', 'told'],
  ['think', 'thought', 'thought'],
  ['throw', 'threw', 'thrown'],
  ['understand', 'understood', 'understood'],
  ['wear', 'wore', 'worn'],
  ['win', 'won', 'won'],
  ['write', 'wrote', 'written'],
]);

/** Words that force the plain (bare infinitive) form of the verb after them. */
const HELPER_WORDS = new Set([
  'can',
  'could',
  'will',
  'would',
  'shall',
  'should',
  'may',
  'might',
  'must',
  'do',
  'does',
  'did',
  "don't",
  "doesn't",
  "didn't",
  'to',
  'let',
  'please',
  "can't",
  "couldn't",
  "won't",
  "wouldn't",
  "shouldn't",
  "mustn't",
]);

const PREPOSITIONS = new Set([
  'in',
  'on',
  'at',
  'to',
  'for',
  'with',
  'by',
  'from',
  'of',
  'about',
  'into',
  'over',
  'under',
  'between',
  'among',
  'during',
  'before',
  'after',
  'since',
  'until',
  'against',
  'through',
  'across',
  'towards',
  'toward',
  'onto',
  'off',
  'up',
  'down',
  'near',
  'beside',
  'behind',
  'above',
  'below',
  'within',
  'without',
  'upon',
  'along',
  'around',
  'past',
  'beyond',
]);

const CONNECTORS = new Set([
  'and',
  'but',
  'or',
  'so',
  'because',
  'although',
  'though',
  'however',
  'therefore',
  'unless',
  'while',
  'whereas',
  'since',
  'yet',
  'nevertheless',
  'moreover',
  'besides',
  'otherwise',
  'if',
  'when',
  'until',
  'as',
]);

const SUBJECT_PRONOUNS = new Set(['i', 'he', 'she', 'we', 'they', 'who']);
const OBJECT_PRONOUNS = new Set(['me', 'him', 'her', 'us', 'them', 'whom']);

/** Pronoun case partners, both directions. */
const PRONOUN_CASE_PAIRS = Object.freeze([
  ['i', 'me'],
  ['he', 'him'],
  ['she', 'her'],
  ['we', 'us'],
  ['they', 'them'],
  ['who', 'whom'],
]);

const POSSESSIVE_PRONOUNS = new Set([
  'my',
  'his',
  'her',
  'its',
  'our',
  'their',
  'your',
  'mine',
  'hers',
  'ours',
  'theirs',
  'yours',
]);

/** Homophone / near-homophone groups children mix up. */
const HOMOPHONE_GROUPS = Object.freeze([
  ['their', 'there', "they're"],
  ['its', "it's"],
  ['your', "you're"],
  ['whose', "who's"],
  ['to', 'too', 'two'],
  ['then', 'than'],
  ['hear', 'here'],
  ['were', 'where', "we're", 'wear'],
  ['our', 'are', 'hour'],
  ['of', 'off'],
  ['quite', 'quiet'],
  ['lose', 'loose'],
  ['affect', 'effect'],
  ['passed', 'past'],
  ['accept', 'except'],
  ['advice', 'advise'],
  ['principal', 'principle'],
  ['stationary', 'stationery'],
  ['desert', 'dessert'],
  ['weather', 'whether'],
  ['break', 'brake'],
  ['piece', 'peace'],
  ['write', 'right'],
  ['knew', 'new'],
  ['no', 'know'],
  ['son', 'sun'],
  ['sea', 'see'],
  ['blue', 'blew'],
  ['flour', 'flower'],
  ['allowed', 'aloud'],
]);

/** Countable / uncountable quantifier partners. */
const QUANTIFIER_PAIRS = Object.freeze([
  ['many', 'much'],
  ['few', 'little'],
  ['fewer', 'less'],
  ['number', 'amount'],
]);

/** Irregular singular/plural noun pairs. */
const IRREGULAR_PLURALS = Object.freeze([
  ['child', 'children'],
  ['man', 'men'],
  ['woman', 'women'],
  ['foot', 'feet'],
  ['tooth', 'teeth'],
  ['mouse', 'mice'],
  ['goose', 'geese'],
  ['person', 'people'],
  ['leaf', 'leaves'],
  ['knife', 'knives'],
  ['wife', 'wives'],
  ['life', 'lives'],
  ['shelf', 'shelves'],
  ['half', 'halves'],
  ['loaf', 'loaves'],
  ['thief', 'thieves'],
]);

/** Suffixes that mark a word's grammatical job, used for word-form detection. */
const FORM_SUFFIXES = [
  'ation',
  'ically',
  'ability',
  'ness',
  'ment',
  'ious',
  'ful',
  'less',
  'able',
  'ible',
  'ance',
  'ence',
  'ity',
  'ive',
  'ise',
  'ize',
  'ous',
  'ally',
  'ing',
  'ion',
  'est',
  'ist',
  'ly',
  'ed',
  'er',
  'al',
  'y',
];

/**
 * Time markers grouped by the tense they demand. Multi-word phrases first so
 * "last night" wins over "night".
 */
const TIME_MARKERS = Object.freeze({
  past: [
    'yesterday',
    'last night',
    'last week',
    'last month',
    'last year',
    'last time',
    'a moment ago',
    'an hour ago',
    'days ago',
    'years ago',
    'ago',
    'just now',
    'in the past',
    'earlier today',
    'earlier',
    'once upon a time',
  ],
  habitual: [
    'every day',
    'every week',
    'every morning',
    'every evening',
    'every night',
    'every year',
    'each day',
    'each morning',
    'always',
    'usually',
    'often',
    'sometimes',
    'seldom',
    'rarely',
    'normally',
    'generally',
    'on mondays',
    'twice a week',
    'once a week',
  ],
  continuous: [
    'right now',
    'at the moment',
    'at present',
    'currently',
    'this minute',
    'look!',
    'listen!',
  ],
  future: [
    'tomorrow',
    'next week',
    'next month',
    'next year',
    'next time',
    'soon',
    'later today',
    'in a while',
    'this coming',
    'from now on',
  ],
  perfect: [
    'so far',
    'up to now',
    'already',
    'recently',
    'lately',
    'just',
    'since',
    'ever since',
    'yet',
  ],
  pastPerfect: ['by the time', 'before that', 'by then', 'earlier that'],
});

// ── Morphology ────────────────────────────────────────────────────────────

/** Crude verb lemma: irregulars by table, regulars by suffix stripping. */
export function verbLemma(word) {
  const w = bare(word);
  if (!w) return '';
  for (const [base, past, participle] of IRREGULAR_VERBS) {
    if (w === base || w === past || w === participle) return base;
    if (w === `${base}s` || w === `${base}es`) return base;
    if (w === `${base}ing`) return base;
  }
  if (/(ies)$/.test(w) && w.length > 4) return `${w.slice(0, -3)}y`;
  if (/(ied)$/.test(w) && w.length > 4) return `${w.slice(0, -3)}y`;
  if (/(sses|shes|ches|xes|zes)$/.test(w)) return w.slice(0, -2);
  if (/(ing)$/.test(w) && w.length > 5) {
    const stem = w.slice(0, -3);
    // running → run (undo the doubled consonant), making → make
    if (/([bdfglmnprt])\1$/.test(stem)) return stem.slice(0, -1);
    if (/[^aeiou][aeiou][^aeiouwxy]$/.test(stem)) return stem;
    return `${stem}e`.replace(/ee$/, 'e');
  }
  if (/(ed)$/.test(w) && w.length > 4) {
    const stem = w.slice(0, -2);
    if (/([bdfglmnprt])\1$/.test(stem)) return stem.slice(0, -1);
    return stem;
  }
  if (/[^s]s$/.test(w) && w.length > 3) return w.slice(0, -1);
  return w;
}

/** Which tense bucket a verb form belongs to, as far as shape can tell. */
function verbTense(word) {
  const w = bare(word);
  if (PAST_FORMS.has(w)) return 'past';
  if (PRESENT_FORMS.has(w)) return 'present';
  for (const [base, past, participle] of IRREGULAR_VERBS) {
    if (w === past) return 'past';
    if (w === participle && participle !== past) return 'participle';
    if (w === base || w === `${base}s`) return 'present';
    if (w === `${base}ing`) return 'continuous';
  }
  if (/ing$/.test(w)) return 'continuous';
  if (/ed$/.test(w)) return 'past';
  return 'present';
}

/** Words appear as a pair in either order in the given list of pairs. */
function pairedIn(pairs, a, b) {
  return pairs.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

function sharedHomophoneGroup(a, b) {
  return HOMOPHONE_GROUPS.find((group) => group.includes(a) && group.includes(b)) || null;
}

/**
 * Strip known form suffixes down to a shared root.
 *
 * Stripping has to repeat, not run once: "carefully" sheds -ly to "careful",
 * which still carries -ful. A single pass leaves "careful" and "carefully"
 * with different stems and the word-form slip goes undetected.
 */
function formStem(word) {
  let w = bare(word);
  for (let pass = 0; pass < 3; pass++) {
    const suffix = FORM_SUFFIXES.find((s) => w.length > s.length + 2 && w.endsWith(s));
    if (!suffix) break;
    const next = w.slice(0, -suffix.length).replace(/i$/, 'y');
    if (next.length < 3) break;
    w = next;
  }
  return w;
}

/** True when `plural` is the plural of `singular` under regular -s / -es. */
function isRegularPlural(plural, singular) {
  return plural === `${singular}s` || plural === `${singular}es`;
}

// ── Stem reading ──────────────────────────────────────────────────────────

/** Every blank marker a bank uses: ___ , ____, (1), …… */
const BLANK_RE = /_{2,}|\(\s*\d+\s*\)|…{2,}/;

/**
 * Words immediately around the gap. Falls back to end-of-stem when the stem
 * has no blank marker (e.g. "Which word means…?" questions).
 * @param {string} stem
 * @returns {{ before: string[], after: string[], hasGap: boolean }}
 */
export function gapContext(stem) {
  const text = norm(stem);
  const match = text.match(BLANK_RE);
  if (!match || match.index === undefined) {
    return { before: words(text), after: [], hasGap: false };
  }
  return {
    before: words(text.slice(0, match.index)),
    after: words(text.slice(match.index + match[0].length)),
    hasGap: true,
  };
}

/**
 * The sentence around one blank of a multi-blank cloze passage.
 *
 * The detectors read the words on either side of the gap, so they need the
 * blank they are diagnosing to be the only `___` left standing. Sibling blanks
 * are filled with their own answers — "The boy of the apples ___ heavy" would
 * otherwise hide the subject behind another gap.
 *
 * @param {string} text          passage text with `___` per blank
 * @param {number} blankIndex    0-based blank to keep open
 * @param {string[]} [answers]   answers for the other blanks
 * @returns {string}
 */
export function stemForBlank(text, blankIndex, answers = []) {
  const source = String(text ?? '');
  if (!source) return '';
  let seen = -1;
  const filled = source.replace(/_{2,}/g, () => {
    seen += 1;
    if (seen === blankIndex) return '___';
    return String(answers[seen] ?? '…');
  });
  // Keep only the sentence the blank sits in; a whole passage buries the clue.
  const sentences = filled.split(/(?<=[.!?])\s+/);
  return (sentences.find((s) => s.includes('___')) || filled).trim();
}

/**
 * First time marker present in the stem, with the tense it demands.
 * @param {string} stem
 * @returns {{ phrase: string, tense: string }|null}
 */
export function findTimeMarker(stem) {
  const text = ` ${norm(stem)} `;
  let best = null;
  for (const [tense, phrases] of Object.entries(TIME_MARKERS)) {
    for (const phrase of phrases) {
      const needle = phrase.endsWith('!') ? phrase : ` ${phrase} `;
      const idx = text.indexOf(needle);
      if (idx === -1) continue;
      if (!best || phrase.length > best.phrase.length) best = { phrase, tense };
    }
  }
  return best;
}

/**
 * True when a phrase sits between the subject and the gap — the classic
 * "The box of apples ___ heavy" trap where the nearest noun is not the
 * subject.
 * @param {string[]} before  words before the gap
 */
function hasInterveningPhrase(before) {
  if (before.length < 3) return false;
  const tail = before.slice(-6);
  const separators = [
    'of',
    'with',
    'in',
    'from',
    'including',
    'besides',
    'near',
    'behind',
    'under',
    'on',
  ];
  const multiword = ['as well as', 'along with', 'together with', 'such as'];
  const joined = tail.join(' ');
  if (multiword.some((p) => joined.includes(p))) return true;
  const sepIdx = tail.findIndex((w) => separators.includes(w));
  // the separator must have a noun before it and at least one word after it
  return sepIdx > 0 && sepIdx < tail.length - 1;
}

// ── Detectors ─────────────────────────────────────────────────────────────
//
// Each detector receives the normalised context and returns either null or
// `{ id, evidence }`. `evidence` is the specific thing in the question that
// justifies the diagnosis — the clue a teacher would point at. Order is
// most-specific-first; the first match wins.

/** @typedef {{ stem: string, given: string, correct: string, choices: string[], skill: string, domain: string, before: string[], after: string[], hasGap: boolean }} DiagCtx */

/** @type {Array<{ id: string, run: (ctx: DiagCtx) => ({ id?: string, evidence?: string|null })|null }>} */
const DETECTORS = [
  {
    id: 'homophone-confusion',
    run: ({ given, correct }) => {
      const group = sharedHomophoneGroup(given, correct);
      return group ? { evidence: group.join(' / ') } : null;
    },
  },

  {
    id: 'article-sound',
    run: ({ given, correct }) => {
      const both = new Set([given, correct]);
      if (both.size === 2 && both.has('a') && both.has('an')) return { evidence: null };
      return null;
    },
  },

  {
    id: 'article-specificity',
    run: ({ given, correct }) => {
      const articles = new Set(['a', 'an', 'the']);
      if (articles.has(given) && articles.has(correct)) return { evidence: null };
      return null;
    },
  },

  // Runs before subject-verb agreement: "can swims" for "can swim" is also an
  // -s/base pair, but the helper word is the reason, not the subject.
  {
    id: 'verb-form-after-helper',
    run: ({ given, correct, before }) => {
      const helper = before.length ? before[before.length - 1] : '';
      if (!HELPER_WORDS.has(helper)) return null;
      if (verbLemma(given) !== verbLemma(correct)) return null;
      // correct is the plain form, the child inflected it
      if (bare(correct) !== verbLemma(correct)) return null;
      return { evidence: helper };
    },
  },

  {
    id: 'subject-verb-agreement',
    run: ({ given, correct, before }) => {
      const numberPair = pairedIn(NUMBER_PAIRS, given, correct);
      const sFormPair =
        verbLemma(given) === verbLemma(correct) &&
        verbTense(given) === 'present' &&
        verbTense(correct) === 'present' &&
        (given === `${correct}s` ||
          correct === `${given}s` ||
          given === `${correct}es` ||
          correct === `${given}es`);
      if (!numberPair && !sFormPair) return null;
      if (hasInterveningPhrase(before)) {
        return { id: 'agreement-with-nearest-noun', evidence: null };
      }
      return { evidence: null };
    },
  },

  {
    id: 'tense-time-marker',
    run: ({ given, correct, stem }) => {
      if (verbLemma(given) !== verbLemma(correct)) return null;
      if (verbTense(given) === verbTense(correct)) return null;
      const marker = findTimeMarker(stem);
      if (marker) return { evidence: marker.phrase };
      return { id: 'tense-choice', evidence: null };
    },
  },

  {
    id: 'pronoun-case',
    run: ({ given, correct }) => {
      if (pairedIn(PRONOUN_CASE_PAIRS, given, correct)) return { evidence: null };
      const isPronoun = (w) =>
        SUBJECT_PRONOUNS.has(w) || OBJECT_PRONOUNS.has(w) || POSSESSIVE_PRONOUNS.has(w);
      if (isPronoun(given) && isPronoun(correct)) {
        return { id: 'pronoun-agreement', evidence: null };
      }
      return null;
    },
  },

  {
    id: 'comparative-vs-superlative',
    run: ({ given, correct, stem }) => {
      const shape = (w) => {
        if (/^more /.test(w) || /[a-z]{3}er$/.test(w)) return 'comparative';
        if (/^most /.test(w) || /[a-z]{3}est$/.test(w)) return 'superlative';
        return null;
      };
      const g = shape(given);
      const c = shape(correct);
      if (!g || !c || g === c) return null;
      const hasThan = / than /.test(` ${norm(stem)} `);
      return { evidence: hasThan ? 'than' : null };
    },
  },

  {
    id: 'countable-uncountable',
    run: ({ given, correct }) =>
      pairedIn(QUANTIFIER_PAIRS, given, correct) ? { evidence: null } : null,
  },

  {
    id: 'noun-number',
    run: ({ given, correct }) => {
      if (pairedIn(IRREGULAR_PLURALS, given, correct)) return { evidence: null };
      // "childs" for "children": the child regularised an irregular plural,
      // so neither word appears in the pair table as written.
      const regularisedIrregular = IRREGULAR_PLURALS.some(
        ([singular, plural]) =>
          (correct === plural && (given === singular || isRegularPlural(given, singular))) ||
          (given === plural && (correct === singular || isRegularPlural(correct, singular))),
      );
      if (regularisedIrregular) return { evidence: null };
      const plural = (a, b) => a === `${b}s` || a === `${b}es`;
      if (
        (plural(given, correct) || plural(correct, given)) &&
        verbLemma(given) === verbLemma(correct)
      ) {
        // Only call it a noun-number slip when neither reads as a verb form.
        if (verbTense(given) === 'present' && verbTense(correct) === 'present')
          return { evidence: null };
      }
      return null;
    },
  },

  {
    id: 'preposition-collocation',
    run: ({ given, correct, before }) => {
      if (!PREPOSITIONS.has(given) || !PREPOSITIONS.has(correct)) return null;
      const anchor = before.length ? before[before.length - 1] : '';
      return { evidence: anchor ? `${anchor} ${correct}` : null };
    },
  },

  {
    id: 'connector-meaning',
    run: ({ given, correct }) =>
      CONNECTORS.has(given) && CONNECTORS.has(correct) ? { evidence: null } : null,
  },

  {
    id: 'word-form',
    run: ({ given, correct }) => {
      if (given.length < 4 || correct.length < 4) return null;
      if (verbLemma(given) === verbLemma(correct)) return null; // a tense case, handled above
      const gs = formStem(given);
      const cs = formStem(correct);
      if (!gs || !cs || gs !== cs) return null;
      return { evidence: `${gs}…` };
    },
  },

  {
    id: 'spelling-slip',
    run: ({ given, correct }) => {
      if (given.length < 4 || correct.length < 4) return null;
      const distance = editDistance(given, correct);
      const threshold = correct.length >= 8 ? 2 : 1;
      return distance > 0 && distance <= threshold ? { evidence: null } : null;
    },
  },
];

/**
 * Diagnose a wrong answer.
 *
 * @param {object} params
 * @param {string} [params.stem]     the question text, blanks marked with ___
 * @param {string} params.given      what the child answered
 * @param {string} params.correct    the expected answer
 * @param {string[]} [params.choices]
 * @param {string} [params.skill]    the item's skill/category key
 * @param {string} [params.domain]   'grammar' | 'vocab' | 'spelling' | 'comprehension' | 'writing'
 * @returns {{
 *   id: string,
 *   misconception: import('./misconceptions.js').Misconception,
 *   evidence: string|null,
 *   matched: boolean,
 * }}
 *   `matched` is false when no detector fired and the domain fallback was
 *   used — callers can use that to prefer authored explanations.
 */
export function diagnoseAnswer({
  stem = '',
  given,
  correct,
  choices = [],
  skill = '',
  domain = 'grammar',
} = {}) {
  const givenNorm = bare(given);
  const correctNorm = bare(correct);

  if (!givenNorm) {
    return {
      id: 'no-answer',
      misconception: MISCONCEPTIONS['no-answer'],
      evidence: null,
      matched: true,
    };
  }

  const { before, after, hasGap } = gapContext(stem);
  const ctx = {
    stem: String(stem ?? ''),
    given: givenNorm,
    correct: correctNorm,
    choices: (choices || []).map(bare),
    skill: String(skill ?? ''),
    domain,
    before,
    after,
    hasGap,
  };

  for (const detector of DETECTORS) {
    const hit = detector.run(ctx);
    if (!hit) continue;
    const id = hit.id || detector.id;
    const misconception = MISCONCEPTIONS[id];
    if (!misconception) continue;
    return { id, misconception, evidence: hit.evidence ?? null, matched: true };
  }

  const fallbackId = fallbackMisconceptionFor(domain);
  return {
    id: fallbackId,
    misconception: MISCONCEPTIONS[fallbackId],
    evidence: null,
    matched: false,
  };
}

/**
 * Diagnose a free-text answer against a model answer. Used by the written
 * modes (synthesis, editing, comprehension short answers) where the child
 * types rather than chooses, so length and coverage matter as much as the
 * words themselves.
 *
 * @param {object} params
 * @param {string} params.given
 * @param {string} params.model            the model / expected answer
 * @param {string} [params.stem]
 * @param {string[]} [params.requiredWords] words the answer must contain
 * @param {string} [params.domain]
 */
export function diagnoseWrittenAnswer({
  given,
  model,
  stem = '',
  requiredWords = [],
  domain = 'writing',
} = {}) {
  const answer = norm(given);
  if (!answer) {
    return {
      id: 'no-answer',
      misconception: MISCONCEPTIONS['no-answer'],
      evidence: null,
      matched: true,
    };
  }

  const answerWords = new Set(words(answer));
  const missing = (requiredWords || []).map(bare).filter((w) => w && !answerWords.has(w));

  if (missing.length) {
    return {
      id: 'structure-not-followed',
      misconception: MISCONCEPTIONS['structure-not-followed'],
      evidence: missing.join(', '),
      matched: true,
    };
  }

  const modelWordCount = words(model).length;
  if (modelWordCount > 0 && words(answer).length < modelWordCount * 0.5) {
    return {
      id: 'incomplete-answer',
      misconception: MISCONCEPTIONS['incomplete-answer'],
      evidence: null,
      matched: true,
    };
  }

  // A single-word difference from the model is a spelling or word-choice slip,
  // not a structural one — fall through to the word-level detectors.
  const answerTokens = words(answer);
  const modelTokens = words(model);
  if (answerTokens.length === modelTokens.length && modelTokens.length > 0) {
    const differing = modelTokens.map((w, i) => [w, answerTokens[i]]).filter(([m, a]) => m !== a);
    if (differing.length === 1) {
      return diagnoseAnswer({
        stem,
        given: differing[0][1],
        correct: differing[0][0],
        domain,
      });
    }
  }

  const fallbackId = fallbackMisconceptionFor(domain);
  return {
    id: fallbackId,
    misconception: MISCONCEPTIONS[fallbackId],
    evidence: null,
    matched: false,
  };
}

export const __TEST__ = {
  norm,
  bare,
  words,
  verbTense,
  formStem,
  hasInterveningPhrase,
  HOMOPHONE_GROUPS,
  TIME_MARKERS,
};
