/**
 * PhonicsQuest — Short-answer / comprehension OE grader.
 *
 * The original grader passed a comprehension answer whenever ANY single
 * keyword appeared in the response. That produced false positives like
 * "It was not urgent" matching the keyword "urgent". It also gave no
 * partial credit: a 4-mark question was 0 or 4, never 2 or 3.
 *
 * This module replaces that with PSLE-style marking:
 *
 *   1. Exact / acceptable-answer match → full credit.
 *   2. requiredGroups (opt-in, strict): each group is a set of synonyms
 *      that all mean "the same meaning unit". Every group must contain
 *      at least one UNNEGATED hit for full credit. Partial credit is
 *      awarded proportional to how many groups hit.
 *   3. keywords (legacy any-match): retained so existing data keeps
 *      working, but negation now disqualifies a hit.
 *
 * Negation rule: a keyword preceded within four words (and within the
 * same clause) by not / n't / never / no / etc. does NOT count. This
 * is intentionally conservative — we don't try to understand "not
 * just X, but also Y". The goal is to stop the obvious false positives
 * a teacher would never award.
 */

const NEGATION_RE =
  /^(not|never|no|none|neither|nothing|nobody|nor|cannot|n't|didn't|doesn't|don't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|won't|wouldn't|shouldn't|couldn't|can't|mustn't|mightn't)$/i;
const CLAUSE_BREAK_RE = /[.;!?]|\b(but|however|although|though|whereas|yet)\b/i;

// Audit 2026-09-19, finding 2: this was 2, while the docblock above it claimed
// four. At 2, "It is not at all urgent" reads back as ["at", "all"] and the
// negation is never seen, so the answer counted as a hit for "urgent". Four
// covers the intensifier padding ("not at all", "not in the least", "by no
// means really") that a child writing a full sentence naturally produces.
const NEG_LOOKBACK_WORDS = 4;

// PSLE-fronted emphatic negatives. When one of these opens a clause AND is
// followed by an inversion, it is a structural trigger rather than a predicate
// negation: "Never had I seen..." does not negate "seen".
const FRONTED_NEG_WORDS = new Set(['never', 'seldom', 'rarely', 'hardly', 'barely']);

// The auxiliaries that make a fronted negative an inversion. Without one of
// these the fronted word is negating normally, which is why the exemption used
// to swallow "Never urgent" -- an answer that plainly denies urgency and was
// nevertheless credited with the keyword "urgent". Audit finding 2.
const INVERSION_AUXILIARIES = new Set([
  'had',
  'has',
  'have',
  'did',
  'do',
  'does',
  'was',
  'were',
  'is',
  'are',
  'am',
  'will',
  'would',
  'shall',
  'should',
  'can',
  'could',
  'may',
  'might',
  'must',
]);

// Fixed phrases where the bare negation isn't actually negating the next
// content word: "not only X but also Y" adds X and Y, doesn't reject X;
// "no sooner had X" is a time-of-occurrence marker, not a rejection.
//
// "no longer" was here and should not have been: "It is no longer urgent"
// denies present urgency, and exempting it credited that answer for "urgent".
// "no less" stays -- "no less urgent" affirms urgency rather than denying it.
// Audit finding 2.
const NOT_PHRASE_NEXT = new Set(['only', 'just', 'until', 'yet']);
const NO_PHRASE_NEXT = new Set(['sooner', 'less']);

function _normalize(s) {
  return String(s ?? '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[.,;:!?]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Is the substring at `position` in `text` preceded (within the same clause,
 * within NEG_LOOKBACK_WORDS) by a TRUE predicate negation?
 *
 * Two exemptions stop us from wrongly rejecting valid PSLE patterns:
 *   1. Fronted emphatic negatives at clause start ("Never had I…",
 *      "Seldom does she…") — these trigger inversion, they don't predicate-
 *      negate the verb that follows.
 *   2. Fixed phrases where bare "not"/"no" doesn't reject the following
 *      content ("not only X but also Y", "not until X", "no sooner had…").
 */
function isNegated(text, position) {
  const before = text.slice(0, position);
  // Find the nearest clause break — negation does not carry across it.
  const breakMatch = before.match(new RegExp(`.*(${CLAUSE_BREAK_RE.source})`, 'i'));
  const clauseStart = breakMatch ? breakMatch.index + breakMatch[0].length : 0;
  const clause = before.slice(clauseStart);
  const words = clause
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  // Words of the whole clause, not just the part before the match. The
  // inversion exemption has to see the word AFTER the negation, and for
  // "Never had the champion lost" that word sits inside the match itself —
  // reading it from `before` alone found nothing and wrongly reported a
  // negation. Audit 2026-09-19, finding 2.
  const fullClause = text
    .slice(clauseStart)
    .trim()
    .split(/[\s,]+/)
    .filter(Boolean);
  const window = words.slice(-NEG_LOOKBACK_WORDS);
  for (const w of window) {
    const isNeg = NEGATION_RE.test(w) || /n't$/i.test(w);
    if (!isNeg) continue;

    const wLower = w.toLowerCase();
    // Look at the position of THIS negation word inside the clause so we
    // can inspect the word immediately after it.
    const negIdx = words.lastIndexOf(w);

    // Exemption 1: fronted emphatic negative at clause start, but only when an
    // auxiliary follows it and makes the clause an actual inversion.
    // "Never had I seen" is exempt; "Never urgent" is a plain denial, and
    // exempting that credited an answer that denies exactly what was asked.
    if (
      negIdx === 0 &&
      FRONTED_NEG_WORDS.has(wLower) &&
      INVERSION_AUXILIARIES.has((fullClause[1] || '').toLowerCase())
    ) {
      continue;
    }

    // Exemption 2: fixed phrase where the negation isn't predicate-negating.
    const nextWord = (fullClause[negIdx + 1] || words[negIdx + 1] || '').toLowerCase();
    if (wLower === 'not' && NOT_PHRASE_NEXT.has(nextWord)) continue;
    if (wLower === 'no' && NO_PHRASE_NEXT.has(nextWord)) continue;

    return true;
  }
  return false;
}

/**
 * Does the haystack contain the needle UNNEGATED at least once?
 *
 * A keyword may appear multiple times — we accept the first unnegated
 * occurrence. "Not always urgent — sometimes urgent" still credits
 * the second hit.
 */
export function hasUnnegatedMatch(haystack, needle) {
  if (!needle) return false;
  const h = _normalize(haystack);
  const n = _normalize(needle);
  if (!n) return false;
  // Whole-word-ish match: ensure boundaries on either side so "no" does
  // not match inside "now" and "an" does not match inside "another".
  const re = new RegExp(`(?:^|[^a-z])${_escapeRe(n)}(?=$|[^a-z])`, 'gi');
  let m;
  while ((m = re.exec(h)) !== null) {
    // Offset of the actual needle start within h:
    const start = m[0].toLowerCase().indexOf(n);
    const pos = m.index + (start >= 0 ? start : 0);
    if (!isNegated(h, pos)) return true;
  }
  return false;
}

function _escapeRe(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * How a needle appears in a text: unnegated, negated, or not at all.
 *
 * @param {string} haystack
 * @param {string} needle
 * @returns {'unnegated'|'negated'|'absent'}
 */
export function matchPolarity(haystack, needle) {
  if (!needle) return 'absent';
  const h = _normalize(haystack);
  const n = _normalize(needle);
  if (!n) return 'absent';

  // A meaning unit that spells out its own polarity is matched literally.
  // `st-cond3-2` requires "would not have missed", inside an answer that also
  // begins "If he had not left early" — scanning the context for a negation
  // finds the if-clause's "not", which belongs to a different clause and says
  // nothing about this unit. Where the author wrote the negation into the key,
  // the key is the polarity. Audit 2026-09-19, finding 2.
  if (n.split(/\s+/).some((w) => NEGATION_RE.test(w) || /n't$/i.test(w))) {
    return h.includes(n) ? 'unnegated' : 'absent';
  }

  const re = new RegExp(`(?:^|[^a-z])${_escapeRe(n)}(?=$|[^a-z])`, 'gi');
  let found = false;
  let m;
  while ((m = re.exec(h)) !== null) {
    const start = m[0].toLowerCase().indexOf(n);
    const pos = m.index + (start >= 0 ? start : 0);
    if (!isNegated(h, pos)) return 'unnegated';
    found = true;
  }
  return found ? 'negated' : 'absent';
}

/**
 * Does the student's answer agree with the mark scheme on this meaning unit?
 *
 * Polarity is judged against the model answer rather than in the abstract,
 * because "contains the word, not negated" is the wrong test whenever the
 * correct answer is itself a negative. For a Type 3 conditional whose model
 * answer is "They would not have got drenched in the rain", the meaning unit
 * `drenched` is *supposed* to appear negated; demanding an unnegated hit fails
 * the correct answer. Meanwhile a comprehension question whose model answer is
 * "It is urgent because ..." must not credit "It is not at all urgent".
 *
 * The comparison is deliberately asymmetric: polarity can REJECT a hit, never
 * require one. An unnegated hit is always accepted; a negated hit is accepted
 * only when the model answer is negated there too.
 *
 * Requiring the polarities to match outright was the first attempt and it was
 * too strict, because a paraphrase may carry the negation lexically instead of
 * grammatically. For `st-cond3-3` the model reads "they would not have got
 * drenched" while an authored alternate reads "they could have avoided getting
 * drenched": same meaning, and `drenched` is negated in one and not the other.
 * Rejecting that would fail a correct answer, which is the error this finding
 * is about, pointed the other way.
 *
 * Asymmetric gets every case right. "It is not at all urgent" is still refused
 * against an affirmative model, and a correct negative answer still scores.
 *
 * Audit 2026-09-19, finding 2.
 *
 * @param {string} userValue
 * @param {string} needle
 * @param {string} [modelAnswer]
 * @returns {boolean}
 */
export function matchesMarkScheme(userValue, needle, modelAnswer = '') {
  const got = matchPolarity(userValue, needle);
  if (got === 'absent') return false;
  if (got === 'unnegated') return true;

  // Negated in the child's answer: only credit it if the model is negated too.
  return modelAnswer ? matchPolarity(modelAnswer, needle) === 'negated' : false;
}

/**
 * Grade a short / comprehension OE answer.
 *
 * ## Why this can return "I don't know"
 *
 * Audit 2026-09-19, finding 2. Of 29 P6 comprehension questions with model
 * answers, 21 carry no `requiredGroups`, `keywords` or `acceptable` list at
 * all. For those the only thing left to compare against is the prose model
 * answer, and that is not a mark scheme:
 *
 *   - asked what percentage of coral reefs has been lost, a child who writes
 *     **"50%"** scored **zero**, because the model is a sentence containing
 *     several equivalent forms;
 *   - asked the meaning of "swimming against the tide", a child who writes
 *     **"tide"** scored **full marks**, having explained nothing.
 *
 * Both directions are wrong, and a confidently wrong mark is worse than no
 * mark: it teaches a child that a correct answer was incorrect, and it hands a
 * parent a number that means nothing. So where this grader cannot make a
 * reliable decision it now says so, via `needsReview`, and the caller keeps
 * the question out of the auto-graded total for a teacher to mark.
 *
 * `fraction` is still returned alongside `needsReview` as an advisory
 * suggestion, so a teacher override can preserve both the automated
 * suggestion and their own judgement.
 *
 * @param {string} userValue — the student's written response
 * @param {object} opts
 * @param {string} [opts.expected]       — model answer (exact-match → 1.0)
 * @param {string[]} [opts.accepts]      — additional acceptable full answers
 * @param {string[]} [opts.keywords]     — legacy any-match keyword list
 * @param {string[][]} [opts.requiredGroups] — strict per-group meaning units;
 *                                             each group is a list of synonyms
 * @param {number} [opts.marks]          — the question's mark value. A single
 *   keyword cannot earn a multi-mark explanation, so keyword-only grading on a
 *   question worth more than one mark is referred for review.
 *
 * @returns {{ fraction: number, needsReview: boolean,
 *             trace: { reason: string, hits: string[], misses: string[] } }}
 */
export function gradeShortAnswer(userValue, opts = {}) {
  const { expected = '', accepts = [], keywords = [], requiredGroups = null, marks = 1 } = opts;
  const u = _normalize(userValue);

  const hasGroups = Array.isArray(requiredGroups) && requiredGroups.length > 0;
  const hasKeywords = Array.isArray(keywords) && keywords.length > 0;
  const hasAccepts = Array.isArray(accepts) && accepts.length > 0;
  const hasMarkingKey = hasGroups || hasKeywords || hasAccepts;

  if (!u) {
    return { fraction: 0, needsReview: false, trace: { reason: 'empty', hits: [], misses: [] } };
  }

  // An exact match against the model or an authored acceptable answer is
  // reliable whatever else is missing.
  if (expected && u === _normalize(expected)) {
    return {
      fraction: 1,
      needsReview: false,
      trace: { reason: 'exact-match', hits: ['model answer'], misses: [] },
    };
  }
  for (const a of accepts) {
    if (u === _normalize(a)) {
      return {
        fraction: 1,
        needsReview: false,
        trace: { reason: 'accepted-match', hits: [a], misses: [] },
      };
    }
  }

  // No mark scheme: the 21-question case. Comparing prose to prose is what
  // failed "50%", so decline rather than guess.
  if (!hasMarkingKey) {
    return {
      fraction: 0,
      needsReview: true,
      trace: { reason: 'no-marking-key', hits: [], misses: [] },
    };
  }

  if (hasGroups) {
    const hits = [];
    const misses = [];
    for (const group of requiredGroups) {
      const hit = (group || []).find((k) => matchesMarkScheme(u, k, expected));
      if (hit) hits.push(hit);
      else misses.push((group || [])[0] || '');
    }
    const fraction = hits.length / requiredGroups.length;
    return { fraction, needsReview: false, trace: { reason: 'required-groups', hits, misses } };
  }

  if (hasKeywords) {
    const hits = keywords.filter((k) => matchesMarkScheme(u, k, expected));
    if (hits.length === 0) {
      // A clean miss on an authored keyword list is a reliable zero.
      return {
        fraction: 0,
        needsReview: false,
        trace: { reason: 'no-keyword-hit', hits: [], misses: keywords },
      };
    }

    // One keyword is not an explanation. On a question worth more than a mark,
    // "tide" for "swimming against the tide" hits the list and explains
    // nothing, so the hit becomes evidence for a teacher rather than a mark.
    if (marks > 1) {
      return {
        fraction: 0.5,
        needsReview: true,
        trace: { reason: 'keyword-only-multi-mark', hits, misses: [] },
      };
    }

    return {
      fraction: 1,
      needsReview: false,
      trace: { reason: 'keyword-match', hits, misses: [] },
    };
  }

  return { fraction: 0, needsReview: true, trace: { reason: 'no-match', hits: [], misses: [] } };
}
