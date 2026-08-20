/**
 * PhonicsQuest – MCQ item features
 *
 * Three item-intrinsic signals the MCQ banks used to fake or skip:
 *
 *   deriveMcqDifficulty  Difficulty from what the item actually demands —
 *                        how close the answer set is, how much reading the
 *                        stem takes — instead of the old positional
 *                        `idx % 5` labels that made Learn/Challenge mode
 *                        serve near-random subsets.
 *   deriveClueWords      The evidence words (time markers, quantity words,
 *                        comparison signals) a teacher would underline
 *                        before letting a pupil answer. Feeds guided mode's
 *                        clue chips and the first-miss cue.
 *   mcqSeedKey           A stable identity for a seed question that survives
 *                        the presentation wrappers and pupil-name swaps, so
 *                        spaced review can recognise "the same question"
 *                        across sessions.
 */

import { inferQuestionContextType } from './mcqItemMetadata.js';

// ── Difficulty ────────────────────────────────────────────────────────────

function levenshtein(a, b) {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m || !n) return m || n;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i += 1) {
    const cur = [i];
    for (let j = 1; j <= n; j += 1) {
      cur[j] = Math.min(
        prev[j] + 1,
        cur[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    prev = cur;
  }
  return prev[n];
}

function isCloseToAnswer(answer, choice) {
  const a = String(answer).toLowerCase();
  const c = String(choice).toLowerCase();
  if (!a || !c) return false;
  // Multiword choices (verb phrases, phrasal verbs): sharing a word means the
  // pupil must weigh the differing word, not spot an unrelated option.
  const aWords = a.split(/\s+/);
  const cWords = c.split(/\s+/);
  if (aWords.length > 1 || cWords.length > 1) {
    return aWords.some((w) => w.length > 2 && cWords.includes(w));
  }
  // Single words: same opening stem or a couple of letters apart (was/were,
  // their/there) forces attention to the grammar, not the vocabulary.
  if (a.slice(0, 3) === c.slice(0, 3) && a.slice(0, 3).length === 3) return true;
  return levenshtein(a, c) <= 2;
}

function countWords(text) {
  return String(text || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

/**
 * Difficulty 1–3 from the item's own demands.
 *
 * Base by level band (P1/P2 start easy, upper primary starts at 2), plus one
 * step when the choice set is a minimal-pair family and one when the stem
 * makes the pupil hold a multi-sentence context or a long sentence. P1/P2 cap
 * at 2 by design — Learn mode there must always have material.
 *
 * @param {{ q: string, answer: string, choices: string[], level: string }} spec
 * @returns {1|2|3}
 */
export function deriveMcqDifficulty({ q = '', answer = '', choices = [], level = 'P3' } = {}) {
  const lower = level === 'P1' || level === 'P2';
  let score = lower ? 1 : 2;

  // One near-form distractor is enough to force real discrimination
  // (was/is, their/there): the pupil cannot win by elimination alone.
  const distractors = choices.filter((c) => c !== answer);
  if (distractors.some((c) => isCloseToAnswer(answer, c))) score += 1;

  if (inferQuestionContextType(q) === 'multi' || countWords(q) > 18) score += 1;

  return Math.max(1, Math.min(score, lower ? 2 : 3));
}

// ── Clue words ────────────────────────────────────────────────────────────

// Multiword phrases first so "last weekend" wins over "last".
const CLUE_MARKERS = [
  // time — past
  'yesterday', 'last night', 'last week', 'last weekend', 'last month', 'last year', 'last term',
  'a moment ago', 'ago', 'just now', 'earlier', 'by the time', 'before', 'after', 'when', 'while',
  'at that moment', 'at the time',
  // time — present / habit
  'every day', 'every morning', 'every week', 'every year', 'usually', 'always', 'often',
  'sometimes', 'seldom', 'rarely', 'never', 'now', 'right now', 'at the moment', 'currently',
  'nowadays', 'these days', 'look!', 'listen!',
  // time — future
  'tomorrow', 'next week', 'next month', 'next year', 'soon', 'later', 'in a few minutes',
  'this afternoon', 'tonight',
  // perfect-aspect signals ("for"/"just" alone are too common to be evidence,
  // so only their unambiguous forms are listed)
  'already', 'yet', 'since', 'ever', 'so far', 'recently', 'has just', 'have just', 'had just',
  // quantity / agreement signals
  'each', 'every', 'both', 'all of', 'none of', 'neither', 'either', 'one of', 'many', 'much',
  'a few', 'a little', 'several', 'plenty of', 'a number of',
  // comparison signals
  'than', 'of all', 'the most', 'the least',
];

// Longest first, so "last weekend" is matched before "last".
const CLUE_REGEXES = CLUE_MARKERS
  .slice()
  .sort((a, b) => b.length - a.length)
  .map(
    (marker) =>
      new RegExp(
        `(?:^|[\\s"“(])(${marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(?=$|[\\s.,;:!?"”)])`,
        'i',
      ),
  );

/**
 * Extract up to `max` evidence words a teacher would point at. Returns [] when
 * the stem carries no recognised marker — callers should leave `clueWords`
 * unset rather than invent one.
 *
 * @param {string} q  the seed stem (pre-wrapper)
 * @param {number} [max]
 * @returns {string[]}
 */
export function deriveClueWords(q, max = 3) {
  const text = String(q || '');
  const found = [];
  for (const re of CLUE_REGEXES) {
    const match = text.match(re);
    if (!match) continue;
    const hit = match[1];
    if (found.some((f) => f.toLowerCase().includes(hit.toLowerCase()))) continue;
    found.push(hit);
    if (found.length >= max) break;
  }
  return found;
}

/** Grammar categories where a marker word genuinely is the evidence. */
export const CLUE_CATEGORIES = new Set([
  'simplePast', 'presentCont', 'pastCont', 'futureTense', 'presentPerfect', 'pastPerfect',
  'perfectContinuousTenses', 'tenseAwareness', 'svAgreement', 'quantifiers',
  'countableUncountable', 'comparatives', 'superlatives', 'auxiliaries', 'mixedGrammar',
]);

// ── Seed identity ─────────────────────────────────────────────────────────

// The five presentation frames from practiceExpansion.js, reduced to prefixes
// and suffixes that can be stripped regardless of the pupil name used.
const FRAME_STRIPPERS = [
  /^Fill in the blank in [A-Z][a-z]+[’']s sentence:\s*/,
  /^[A-Z][a-z]+ is checking a sentence\. Choose the word that fits the blank:\s*/,
  /^[A-Z][a-z]+ read this sentence aloud, leaving out one word:\s*/,
  /^Choose the best word for the blank in [A-Z][a-z]+[’']s sentence:\s*/,
  /^Help [A-Z][a-z]+ complete this sentence:\s*/,
];
const FRAME_SUFFIX = /\s*Which word is missing\?\s*$/;

// Mirrors the swap pools in practiceExpansion.js so any rotated name collapses
// to the same placeholder.
const SWAP_NAMES =
  /\b(Mei|Siti|Priya|Jia|Zara|Aisha|Nurul|Devi|Hana|Lena|Ying|Tara|Sarah|Ravi|Ben|Ahmad|Ali|Farid|Arjun|Omar|Ethan|Daniel|Tom|Kai|Wei|Sam)\b/g;

/** Strip wrapper frames and collapse pupil names, leaving the seed sentence. */
export function normalizeMcqStem(q) {
  let text = String(q || '').trim();
  for (const re of FRAME_STRIPPERS) text = text.replace(re, '');
  text = text.replace(FRAME_SUFFIX, '');
  return text
    .replace(SWAP_NAMES, '·')
    .toLowerCase()
    .replace(/[^a-z0-9_·]+/g, ' ')
    .trim();
}

function hash36(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i += 1) {
    h = ((h << 5) + h + text.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

/**
 * Stable id for a seed question. Two renderings of the same seed — different
 * wrapper frame, different pupil name — share one key, so review scheduling
 * and analytics see one question, not five.
 *
 * @param {{ q: string, category?: string, answer?: string }} item
 * @returns {string}
 */
export function mcqSeedKey(item) {
  const stem = normalizeMcqStem(item?.q);
  return `${item?.category || 'mcq'}:${hash36(`${stem}|${String(item?.answer || '').toLowerCase()}`)}`;
}
