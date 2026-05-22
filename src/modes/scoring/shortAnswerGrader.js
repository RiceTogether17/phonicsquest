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

const NEGATION_RE = /^(not|never|no|none|neither|nothing|nobody|nor|cannot|n't|didn't|doesn't|don't|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|won't|wouldn't|shouldn't|couldn't|can't|mustn't|mightn't)$/i;
const CLAUSE_BREAK_RE = /[.;!?]|\b(but|however|although|though|whereas|yet)\b/i;
const NEG_LOOKBACK_WORDS = 4;

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
 * within NEG_LOOKBACK_WORDS) by a negation word?
 */
function isNegated(text, position) {
  const before = text.slice(0, position);
  // Find the nearest clause break — negation does not carry across it.
  const breakMatch = before.match(new RegExp(`.*(${CLAUSE_BREAK_RE.source})`, 'i'));
  const clauseStart = breakMatch ? breakMatch.index + breakMatch[0].length : 0;
  const clause = before.slice(clauseStart);
  const words = clause.trim().split(/[\s,]+/).filter(Boolean);
  const window = words.slice(-NEG_LOOKBACK_WORDS);
  // Also catch words like "wasn't" / "couldn't" by stripping the contracted tail.
  for (const w of window) {
    if (NEGATION_RE.test(w)) return true;
    // Apostrophe variants that survived normalisation.
    if (/n't$/i.test(w)) return true;
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
 * Grade a short / comprehension OE answer.
 *
 * @param {string} userValue — the student's written response
 * @param {object} opts
 * @param {string} [opts.expected]       — model answer (exact-match → 1.0)
 * @param {string[]} [opts.accepts]      — additional acceptable full answers
 * @param {string[]} [opts.keywords]     — legacy any-match keyword list
 * @param {string[][]} [opts.requiredGroups] — strict per-group meaning units;
 *                                             each group is a list of synonyms
 *
 * @returns {{ fraction: number, trace: { reason: string, hits: string[], misses: string[] } }}
 */
export function gradeShortAnswer(userValue, opts = {}) {
  const { expected = '', accepts = [], keywords = [], requiredGroups = null } = opts;
  const u = _normalize(userValue);
  if (!u) return { fraction: 0, trace: { reason: 'empty', hits: [], misses: [] } };

  if (expected && u === _normalize(expected)) {
    return { fraction: 1, trace: { reason: 'exact-match', hits: ['model answer'], misses: [] } };
  }
  for (const a of accepts) {
    if (u === _normalize(a)) {
      return { fraction: 1, trace: { reason: 'accepted-match', hits: [a], misses: [] } };
    }
  }

  if (Array.isArray(requiredGroups) && requiredGroups.length > 0) {
    const hits = [];
    const misses = [];
    for (const group of requiredGroups) {
      const hit = (group || []).find(k => hasUnnegatedMatch(u, k));
      if (hit) hits.push(hit); else misses.push((group || [])[0] || '');
    }
    const fraction = hits.length / requiredGroups.length;
    return { fraction, trace: { reason: 'required-groups', hits, misses } };
  }

  if (Array.isArray(keywords) && keywords.length > 0) {
    const hits = keywords.filter(k => hasUnnegatedMatch(u, k));
    if (hits.length > 0) {
      return { fraction: 1, trace: { reason: 'keyword-match', hits, misses: [] } };
    }
    return { fraction: 0, trace: { reason: 'no-keyword-hit', hits: [], misses: keywords } };
  }

  return { fraction: 0, trace: { reason: 'no-match', hits: [], misses: [] } };
}
