/**
 * PhonicsQuest – Read-Aloud Listener ("Read to Giri")
 *
 * Listens to a child reading one line of a story and decides, word by word,
 * which expected words were clearly read. Built on the single-shot
 * recognition engine in speech.js (continuous recognition is unreliable for
 * children across browsers, so we listen line by line on demand).
 *
 * Design rule: bias toward ACCEPTING. Speech recognition of child voices is
 * mediocre, so a word is only flagged when it is clearly absent — and the UI
 * frames flags as "let's check this word together", never "you read it
 * wrongly". The pure alignment functions here have no browser dependencies
 * so they can be tested directly.
 */

import { speech } from './speech.js';

/** Similarity at or above which an expected word counts as read. Lenient on
 *  purpose — recognisers regularly mangle correct child speech. */
export const MATCH_THRESHOLD = 0.62;

/** Below MATCH but at/above this → 'unsure' (treated kindly by the UI). */
export const UNSURE_THRESHOLD = 0.4;

/** Words this short are accepted whenever anything aligns near them —
 *  recognisers swallow articles and prepositions constantly. */
const SHORT_WORD_LEN = 2;

/**
 * Lowercase word tokens with punctuation stripped.
 * "“Sam!” said the cat." → ['sam', 'said', 'the', 'cat']
 * @param {string} text
 * @returns {string[]}
 */
export function tokenizeWords(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[’']/g, "'")
    .split(/[^a-z0-9']+/)
    .map(w => w.replace(/^'+|'+$/g, ''))
    .filter(Boolean);
}

/**
 * Globally align expected words to what was heard (Needleman–Wunsch over
 * words, similarity-scored) and classify each expected word.
 *
 * @param {string[]} expected   words the child should read, in order
 * @param {string[]} said       transcript tokens
 * @param {(a: string, b: string) => number} [simFn]  word similarity 0–1
 * @returns {{ word: string, status: 'match'|'unsure'|'miss', heard: string|null }[]}
 */
export function alignReading(expected, said, simFn = (a, b) => speech.phoneticSimilarity(a, b)) {
  const m = expected.length;
  const n = said.length;
  if (m === 0) return [];
  if (n === 0) return expected.map(word => ({ word, status: 'miss', heard: null }));

  const GAP = -0.4; // skipping a word costs less than a bad match scores
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) dp[i][0] = i * GAP;
  for (let j = 1; j <= n; j++) dp[0][j] = j * GAP;

  const sim = Array.from({ length: m }, (_, i) =>
    Array.from({ length: n }, (_, j) => simFn(expected[i], said[j])));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // pair score in [-0.5, 0.5]: good matches attract, bad ones repel
      const pair = sim[i - 1][j - 1] - 0.5;
      dp[i][j] = Math.max(
        dp[i - 1][j - 1] + pair,
        dp[i - 1][j] + GAP,
        dp[i][j - 1] + GAP,
      );
    }
  }

  // Trace back to recover which expected words paired with which heard words
  const result = new Array(m);
  let i = m, j = n;
  while (i > 0) {
    const pair = j > 0 ? sim[i - 1][j - 1] - 0.5 : -Infinity;
    if (j > 0 && dp[i][j] === dp[i - 1][j - 1] + pair) {
      const s = sim[i - 1][j - 1];
      const word = expected[i - 1];
      let status;
      if (s >= MATCH_THRESHOLD) status = 'match';
      else if (s >= UNSURE_THRESHOLD || word.length <= SHORT_WORD_LEN) status = 'unsure';
      else status = 'miss';
      result[i - 1] = { word, status, heard: said[j - 1] };
      i--; j--;
    } else if (j > 0 && dp[i][j] === dp[i][j - 1] + GAP) {
      j--; // extra heard word — ignore (insertions are fine)
    } else {
      const word = expected[i - 1];
      result[i - 1] = {
        word,
        status: word.length <= SHORT_WORD_LEN ? 'unsure' : 'miss',
        heard: null,
      };
      i--;
    }
  }
  return result;
}

/**
 * Assess one spoken line against the expected text, trying every transcript
 * alternative and keeping the kindest result (most matches).
 *
 * @param {string} lineText
 * @param {{ text: string }[]} transcripts  alternatives from recognition
 * @param {(a: string, b: string) => number} [simFn]
 * @returns {{ words: { word: string, status: string, heard: string|null }[],
 *             matchCount: number, total: number }}
 */
export function assessLineReading(lineText, transcripts, simFn) {
  const expected = tokenizeWords(lineText);
  let best = null;

  for (const t of (transcripts || [])) {
    const words = alignReading(expected, tokenizeWords(t.text), simFn);
    const matchCount = words.filter(w => w.status === 'match').length;
    if (!best || matchCount > best.matchCount) {
      best = { words, matchCount, total: expected.length };
    }
  }

  return best || {
    words: expected.map(word => ({ word, status: 'miss', heard: null })),
    matchCount: 0,
    total: expected.length,
  };
}

/** Can this browser/profile do read-aloud listening at all? */
export function isReadAloudSupported() {
  return speech.supported;
}

/**
 * Listen to the child reading one line and assess it.
 * @param {string} lineText
 * @returns {Promise<ReturnType<typeof assessLineReading> | null>}
 *   null when nothing usable was heard (caller decides how to degrade)
 */
export async function listenToLine(lineText) {
  const heard = await speech.listenTranscript({ timeoutMs: 12000 });
  if (!heard) return null;
  return assessLineReading(lineText, heard.transcripts);
}

/** Stop any in-flight listening (mode cleanup). */
export function stopListening() {
  speech.stop();
}
