/**
 * PhonicsQuest – Sentence Forge completion tracking
 *
 * The level picker shows "37 / 101". That number used to be a tally of correct
 * answers, not of sentences finished: replaying the same eight sentences ten
 * times read as eighty done. The count was clamped with Math.min for display,
 * which hid the inflation and made the figure meaningless as progress.
 *
 * Sentences carry stable ids, so progress is now counted by id — the same
 * shape Cloze Castle uses (see clozeCompletionTracker.js). Repeating a
 * sentence keeps the best result but never advances the count.
 *
 * Pure functions: the caller owns persistence, so this is testable without
 * touching the store.
 */

/**
 * @typedef {Record<string, Record<string, { done: boolean, attempts: number,
 *   firstTryCorrect: boolean, lastCompletedAt: number }>>} SentenceCompletionMap
 *   level → sentenceId → record
 */

/**
 * Unique sentences finished at a level. Falls back to the legacy per-level
 * tally so existing profiles do not appear to lose progress on upgrade.
 *
 * @param {{ level: number|string, sfqCompletedBySentence?: SentenceCompletionMap,
 *           sfqCompleted?: Record<string, number> }} params
 * @returns {number}
 */
export function getUniqueSentencesDone({ level, sfqCompletedBySentence, sfqCompleted }) {
  const byLevel = sfqCompletedBySentence?.[level] || {};
  const unique = Object.keys(byLevel).length;
  if (unique > 0) return unique;
  return Number(sfqCompleted?.[level] || 0);
}

/**
 * Record one finished sentence.
 *
 * `firstTryCorrect` is kept because it is the honest measure of whether the
 * child knew it: a sentence solved only after the teach-back is finished, but
 * it is not yet mastered, and the parent report should be able to tell those
 * apart.
 *
 * @param {{ level: number|string, sentenceId: string, firstTryCorrect?: boolean,
 *           now?: number, sfqCompletedBySentence?: SentenceCompletionMap,
 *           sfqCompleted?: Record<string, number> }} params
 * @returns {{ nextBySentence: SentenceCompletionMap,
 *             nextCompleted: Record<string, number>, isNew: boolean }}
 */
export function recordSentenceCompletion({
  level,
  sentenceId,
  firstTryCorrect = false,
  now = Date.now(),
  sfqCompletedBySentence = {},
  sfqCompleted = {},
}) {
  const nextBySentence = structuredClone(sfqCompletedBySentence || {});
  if (!nextBySentence[level]) nextBySentence[level] = {};

  const prev = nextBySentence[level][sentenceId];
  const isNew = !prev?.done;

  nextBySentence[level][sentenceId] = {
    done: true,
    attempts: Number(prev?.attempts || 0) + 1,
    // Once earned, a clean first try is never taken away by a later replay.
    firstTryCorrect: Boolean(prev?.firstTryCorrect) || Boolean(firstTryCorrect),
    lastCompletedAt: now,
  };

  const nextCompleted = { ...(sfqCompleted || {}) };
  if (isNew) {
    nextCompleted[level] = Number(nextCompleted[level] || 0) + 1;
  }

  return { nextBySentence, nextCompleted, isNew };
}

/**
 * Sentences at a level that were finished but never solved on the first try —
 * the ones worth serving again before brand-new material.
 *
 * @param {{ level: number|string, sfqCompletedBySentence?: SentenceCompletionMap }} params
 * @returns {string[]} sentence ids
 */
export function getShakySentenceIds({ level, sfqCompletedBySentence = {} }) {
  const byLevel = sfqCompletedBySentence?.[level] || {};
  return Object.entries(byLevel)
    .filter(([, record]) => record?.done && !record.firstTryCorrect)
    .map(([id]) => id);
}
