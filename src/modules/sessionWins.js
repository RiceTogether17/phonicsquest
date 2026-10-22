/**
 * PhonicsQuest – Session wins
 *
 * What the closing screen celebrates. Points tell a child they played;
 * these tell them what they can now do that they could not before — the
 * words they read today, the words that are now theirs for keeps, and the
 * sound waiting for them next time. A reward tied to real progress is one a
 * child can feel, and a clear "next time" gives them a reason to come back
 * that is about learning, not about losing a streak.
 *
 * Pure functions over store-shaped data, so the screen and the tests share
 * one definition.
 */

import { localDayKey } from '../utils/localDay.js';
import { CURRICULUM, MASTERY_THRESHOLD, childStageName } from '../data/curriculum.js';

/** How many word chips the summary shows before saying "and N more". */
export const MAX_WORDS_SHOWN = 8;

/**
 * Words the child read correctly today, newest first, each listed once.
 *
 * @param {Array<{wordId:string, correct:boolean, timestamp:string}>} history
 *   store.wordHistory (newest first)
 * @param {(id: string) => string|undefined} wordText  id → written word
 * @param {number} [now]
 * @returns {string[]}
 */
export function wordsReadToday(history = [], wordText, now = Date.now()) {
  const today = localDayKey(now);
  const seen = new Set();
  const out = [];
  for (const h of history) {
    if (!h?.correct || !h.timestamp) continue;
    const t = new Date(h.timestamp).getTime();
    if (!Number.isFinite(t) || localDayKey(t) !== today) continue;
    if (seen.has(h.wordId)) continue;
    seen.add(h.wordId);
    const text = wordText(h.wordId);
    if (text) out.push(text);
  }
  return out;
}

/**
 * Words that moved into long-term memory today: the review ladder
 * graduated them, so they will not come back for a long while.
 *
 * @param {Record<string, {graduatedAt?: number|null}>} wordStats
 * @param {(id: string) => string|undefined} wordText
 * @param {number} [now]
 * @returns {string[]}
 */
export function wordsKeptToday(wordStats = {}, wordText, now = Date.now()) {
  const today = localDayKey(now);
  return Object.entries(wordStats)
    .filter(([, s]) => typeof s?.graduatedAt === 'number' && localDayKey(s.graduatedAt) === today)
    .map(([id]) => wordText(id))
    .filter(Boolean);
}

/**
 * The sound to look forward to next time.
 *
 * If the child's current stage is not secure yet, next time is more of the
 * same, said as a goal rather than a failure. Once it is secure, next time
 * is the stage after it.
 *
 * @param {string} currentGroup  store.currentGroup
 * @param {Record<string, number>} groupMastery
 * @returns {{ kind: 'keep'|'next', name: string, example: string } | null}
 */
export function nextAdventure(currentGroup, groupMastery = {}) {
  const idx = CURRICULUM.findIndex((s) => s.group === currentGroup || s.id === currentGroup);
  if (idx < 0) return null;
  const current = CURRICULUM[idx];
  const secure = (groupMastery[current.group] ?? 0) >= MASTERY_THRESHOLD;
  const stage = secure ? CURRICULUM[idx + 1] : current;
  if (!stage) return null;
  return {
    kind: secure ? 'next' : 'keep',
    name: childStageName(stage),
    example: stage.sampleWords?.[0] || '',
  };
}

/**
 * Praise for how the child worked, never a grade. A child who needed help
 * on most words still worked hard, and is told that the tricky ones will
 * come back to practise — not that they "need more practice".
 *
 * @param {number} firstTry  words read with no hint and no wrong try
 * @param {number} total     words practised today
 * @returns {string}
 */
export function effortMessage(firstTry, total) {
  if (!total) return 'You started today. That is the hardest part!';
  const share = firstTry / total;
  if (share >= 0.7) return 'You read most words all by yourself!';
  if (share >= 0.5) return 'You are getting stronger with every try!';
  return 'You kept trying on tricky words. That is how your brain grows!';
}
