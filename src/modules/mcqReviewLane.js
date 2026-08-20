/**
 * PhonicsQuest – MCQ review lane
 *
 * The one thing a tutor has that a question bank lacks is memory: what this
 * child got wrong last Tuesday comes back before it is forgotten. This lane
 * gives the two MCQ modes that memory.
 *
 * A question enters the lane the first time its first attempt is wrong. From
 * then on every first attempt (right or wrong) moves it along the same
 * Leitner ladder the word-review engine uses (reviewScheduler.js): correct
 * answers push the next appearance further out (1 → 3 → 7 days…), wrong
 * answers pull it closer. After enough spaced successes the question is
 * considered recovered and leaves the lane — a tutor stops re-asking what has
 * been mastered.
 *
 * Because the banks regenerate every session (fresh shuffles and name
 * variants), the lane stores a snapshot of the exact item the child saw. The
 * `seedId` (mcqItemFeatures.js) keys the entry, so a later rendering of the
 * same seed under a different wrapper or pupil name still counts as the same
 * question.
 */

import { store } from './store.js';
import { scheduleAttempt, isDue } from './reviewScheduler.js';

const STORE_KEY = 'mcqReviewLane';

/** Spaced successes needed before an item leaves the lane (box 0→4). */
export const RECOVERED_BOX = 4;

/** Most entries kept per mode; oldest-seen beyond the cap are dropped. */
export const LANE_CAP = 60;

/** Reviews served at the start of one round. */
export const REVIEWS_PER_ROUND = 3;

const SNAPSHOT_FIELDS = [
  'id',
  'seedId',
  'level',
  'category',
  'subskill',
  'difficulty',
  'q',
  'questionType',
  'choices',
  'answer',
  'explain',
  'optionExplanations',
  'clueWords',
  'reasoning',
  'contextType',
];

function _readLane() {
  const lane = store.get(STORE_KEY);
  return lane && typeof lane === 'object' ? lane : {};
}

function _snapshot(item) {
  const snap = {};
  for (const field of SNAPSHOT_FIELDS) {
    if (item[field] !== undefined) snap[field] = item[field];
  }
  return snap;
}

function _pruneMode(lane, mode) {
  const keys = Object.keys(lane).filter((key) => lane[key].mode === mode);
  if (keys.length <= LANE_CAP) return lane;
  keys
    .sort((a, b) => Date.parse(lane[a].lastSeen || 0) - Date.parse(lane[b].lastSeen || 0))
    .slice(0, keys.length - LANE_CAP)
    .forEach((key) => delete lane[key]);
  return lane;
}

/**
 * Record the FIRST attempt on an MCQ item. Misses enter the lane; correct
 * answers only matter for items already in it (they climb the ladder and
 * eventually leave). Call exactly once per item per round, from the same
 * first-attempt hook that records mastery.
 *
 * `promote: false` (recovery rounds) holds the box where it is on a correct
 * answer. The ladder measures RETENTION, and a question re-answered seconds
 * after being missed tests nothing — without this, four quick recovery
 * rounds would retire an item that was never once recalled cold. Wrong
 * answers still demote: getting it wrong with the answer fresh in mind is
 * still getting it wrong.
 *
 * @param {'grammarMcq'|'vocabMcq'} mode
 * @param {object} item     the served item (must carry seedId)
 * @param {boolean} correct
 * @param {number} [now]
 * @param {{promote?: boolean}} [opts]
 */
export function recordMcqAttempt(mode, item, correct, now = Date.now(), { promote = true } = {}) {
  const seedId = item?.seedId;
  if (!seedId) return;
  const lane = { ..._readLane() };
  const key = `${mode}:${seedId}`;
  const existing = lane[key];

  if (!existing && correct) return; // only misses start a review thread

  const next = scheduleAttempt(existing, correct, now, { promote });

  if (correct && next.box >= RECOVERED_BOX) {
    // Recovered: enough spaced successes since the original miss.
    delete lane[key];
    store.set(STORE_KEY, lane);
    return;
  }

  lane[key] = {
    ...next,
    mode,
    attempts: (existing?.attempts || 0) + 1,
    correct: (existing?.correct || 0) + (correct ? 1 : 0),
    lastSeen: new Date(now).toISOString(),
    item: _snapshot(item), // refresh so review shows the latest wording
  };
  _pruneMode(lane, mode);
  store.set(STORE_KEY, lane);
}

/**
 * Items due for review, oldest-due first, as playable item snapshots tagged
 * `isReview: true`. Scope filters mirror the round scope: a P3 prepositions
 * session only resurfaces P3 prepositions misses; a mixed session takes any.
 *
 * @param {'grammarMcq'|'vocabMcq'} mode
 * @param {{ level?: string|null, category?: string|null, limit?: number, now?: number }} [opts]
 * @returns {object[]}
 */
export function getDueReviews(
  mode,
  { level = null, category = null, limit = REVIEWS_PER_ROUND, now = Date.now() } = {},
) {
  const lane = _readLane();
  return Object.values(lane)
    .filter((entry) => entry.mode === mode && entry.item && isDue(entry, now))
    .filter((entry) => !level || entry.item.level === level)
    .filter((entry) => !category || entry.item.category === category)
    .sort((a, b) => (a.dueAt || 0) - (b.dueAt || 0))
    .slice(0, Math.max(0, limit))
    .map((entry) => ({ ...entry.item, isReview: true }));
}

/**
 * How many reviews are waiting for a mode (any scope). Lets menus surface
 * "3 questions to win back" the way a tutor opens with yesterday's corrections.
 *
 * @param {'grammarMcq'|'vocabMcq'} mode
 * @param {number} [now]
 */
export function countDueReviews(mode, now = Date.now()) {
  const lane = _readLane();
  return Object.values(lane).filter(
    (entry) => entry.mode === mode && entry.item && isDue(entry, now),
  ).length;
}
