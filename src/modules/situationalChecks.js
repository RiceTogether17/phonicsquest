/**
 * PhonicsQuest – point-by-point checks for Situational Writing.
 *
 * A situational task is marked first on whether every required point is
 * there. The open-response box could only show "ideas from the model answer",
 * so a child who left out a whole point was never told which one. This checks
 * each bullet against the keyword lists in `situationalPointChecks.js`, and
 * checks the greeting and sign-off for the formats that need them.
 */

import { SITUATIONAL_POINT_CHECKS } from '../data/situationalPointChecks.js';
import { containsTerm } from './textMatch.js';

const MONTHS =
  'jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?';

const PATTERNS = {
  '#time':
    /\b\d{1,2}(?:[.:]\d{2})?\s*(?:a\.?m\b\.?|p\.?m\b\.?)|\b\d{1,2}[.:]\d{2}\b|\bnoon\b|\bo'clock\b/i,
  '#date': new RegExp(
    `\\b\\d{1,2}(?:st|nd|rd|th)?\\s+(?:${MONTHS})\\b|\\b(?:${MONTHS})\\s+\\d{1,2}(?:st|nd|rd|th)?\\b`,
    'i',
  ),
};

/** Formats that open with a greeting and close with a sign-off. */
const NEEDS_GREETING = /email|letter|note/i;
const GREETING = /^\s*(?:dear|hi|hello|hey|good (?:morning|afternoon))\b/im;
const SIGN_OFF =
  /\b(?:yours (?:sincerely|faithfully|truly)|yours,|regards|best wishes|best,|love,|take care|your (?:friend|pal|cousin|classmate|excited friend)|cheers|see you|from,)/i;

function _matches(text, keyword) {
  const pattern = PATTERNS[keyword];
  return pattern ? pattern.test(text) : containsTerm(text, keyword);
}

/**
 * Check a situational answer against its prompt's required points.
 *
 * @param {{id: string, bullets?: string[], format?: string}} item
 * @param {string} text
 * @returns {{points: {bullet: string, covered: boolean, hint: string}[],
 *   covered: number, total: number, format: {label: string, ok: boolean}[]} | null}
 *   null when the prompt has no checks
 */
export function checkSituationalPoints(item, text) {
  const checks = SITUATIONAL_POINT_CHECKS[item?.id];
  if (!checks?.length) return null;
  const answer = String(text ?? '');

  const points = checks.map((check, i) => {
    const hits = (check.keywords || []).filter((k) => _matches(answer, k)).length;
    return {
      bullet: item.bullets?.[i] || `Point ${i + 1}`,
      covered: hits >= (check.min || 1),
      hint: check.hint || '',
    };
  });

  const format = [];
  if (NEEDS_GREETING.test(item.format || '')) {
    format.push({ label: 'Starts with a greeting (Dear …, Hi …)', ok: GREETING.test(answer) });
    format.push({ label: 'Ends with a sign-off and your name', ok: SIGN_OFF.test(answer) });
  }

  return {
    points,
    covered: points.filter((p) => p.covered).length,
    total: points.length,
    format,
  };
}
