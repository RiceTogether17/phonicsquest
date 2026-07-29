// @ts-check
/**
 * PhonicsQuest – SM-2 SRS Scheduler
 *
 * Spaced Repetition System for vocabulary words in Word Vault, using the
 * SuperMemo SM-2 algorithm.  Schedule data is persisted under the
 * 'srsSchedule' key in the store, keyed by wordId.
 *
 * Algorithm (SM-2):
 *   Each word tracks: { interval, repetitions, easeFactor, dueAt, correct, wrong }
 *
 *   Correct (rating q = 4):
 *     repetitions += 1
 *     interval:   rep 1 → 1 day, rep 2 → 6 days, rep ≥ 3 → round(interval * EF)
 *     EF change:  EF + (0.1 − (5−4) × (0.08 + (5−4) × 0.02)) = EF + 0 (no change)
 *
 *   Wrong (rating q = 1):
 *     repetitions = 0, interval = 1
 *     EF change:  EF + (0.1 − (5−1) × (0.08 + (5−1) × 0.02)) = EF − 0.54
 *
 *   easeFactor is clamped to [1.3, ∞], interval is capped at 180 days.
 *   dueAt is stored as a UTC 'YYYY-MM-DD' string (see utils/dates.js for
 *   the local-vs-UTC day-key conventions).
 *
 * Backwards-compatible: old entries lacking repetitions / easeFactor are
 * migrated on first read (repetitions: 0, easeFactor: 2.5).
 */

import { store } from './store.js';
import { utcYmd, utcYmdAddDays } from '../utils/dates.js';

/**
 * One word's SM-2 state, as persisted under `store.srsSchedule`.
 * @typedef {object} SrsEntry
 * @property {number} interval    days until the next review
 * @property {number} repetitions consecutive correct reviews
 * @property {number} easeFactor  SM-2 EF, floored at 1.3
 * @property {string} dueAt       UTC 'YYYY-MM-DD'
 * @property {number} correct     lifetime correct count
 * @property {number} wrong       lifetime wrong count
 */

const STORE_KEY    = 'srsSchedule';
const INITIAL_EF   = 2.5;
const MIN_EF       = 1.3;
const MAX_INTERVAL = 180;

const _today = () => utcYmd();
/** @param {number} days */
const _addDays = (days) => utcYmdAddDays(days);

/**
 * Read the full schedule map from the store.
 * @returns {Record<string, SrsEntry>}
 */
function _getSchedule() {
  return store.get(STORE_KEY) || {};
}

/**
 * Persist the full schedule map to the store.
 * @param {Record<string, SrsEntry>} schedule
 */
function _setSchedule(schedule) {
  store.set(STORE_KEY, schedule);
}

/**
 * Migrate a legacy entry (or brand-new blank) to the full SM-2 shape.
 * @param {Partial<SrsEntry>|undefined} existing
 * @returns {SrsEntry}
 */
function _ensureSM2Shape(existing) {
  if (!existing) {
    return {
      interval:    1,
      repetitions: 0,
      easeFactor:  INITIAL_EF,
      dueAt:       _today(),
      correct:     0,
      wrong:       0,
    };
  }
  // Every field is defaulted, not just the two SM-2 additions: a truncated
  // or hand-edited entry missing `interval` would otherwise propagate NaN
  // through the interval arithmetic and produce an invalid dueAt.
  return {
    ...existing,
    interval:    typeof existing.interval    === 'number' ? existing.interval    : 1,
    dueAt:       typeof existing.dueAt       === 'string' ? existing.dueAt       : _today(),
    correct:     typeof existing.correct     === 'number' ? existing.correct     : 0,
    wrong:       typeof existing.wrong       === 'number' ? existing.wrong       : 0,
    repetitions: typeof existing.repetitions === 'number' ? existing.repetitions : 0,
    easeFactor:  typeof existing.easeFactor  === 'number' ? existing.easeFactor  : INITIAL_EF,
  };
}

/**
 * Apply one SM-2 review step and return the updated entry fields.
 * @param {SrsEntry} entry
 * @param {boolean} correct
 * @returns {{ interval: number, repetitions: number, easeFactor: number, dueAt: string }}
 */
function _applyReview(entry, correct) {
  let { interval, repetitions, easeFactor } = entry;
  const q = correct ? 4 : 1;

  // SM-2 ease-factor update: EF' = EF + (0.1 − (5−q) × (0.08 + (5−q) × 0.02))
  const delta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  easeFactor = Math.max(MIN_EF, easeFactor + delta);

  if (correct) {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    interval = Math.min(interval, MAX_INTERVAL);
  } else {
    repetitions = 0;
    interval    = 1;
  }

  return {
    interval,
    repetitions,
    easeFactor,
    dueAt: _addDays(interval),
  };
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Record a review result for a word and reschedule it using SM-2.
 * Creates a new entry if the word has never been scheduled before.
 *
 * @param {string}  wordId  - unique identifier for the vocabulary word
 * @param {boolean} correct - true if the learner answered correctly
 */
export function scheduleWord(wordId, correct) {
  if (!wordId) return;
  const schedule = _getSchedule();
  const entry    = _ensureSM2Shape(schedule[wordId]);
  const reviewed = _applyReview(entry, correct);

  schedule[wordId] = {
    ...entry,
    ...reviewed,
    correct: entry.correct + (correct ? 1 : 0),
    wrong:   entry.wrong   + (correct ? 0 : 1),
  };

  _setSchedule(schedule);
}

/** Alias matching the srsScheduler.record() namespace API. */
export const record = scheduleWord;

/**
 * Check whether a word is due for review today.
 *
 * @param {string} wordId
 * @returns {boolean}
 */
export function isWordDue(wordId) {
  if (!wordId) return false;
  const schedule = _getSchedule();
  const entry    = schedule[wordId];
  if (!entry) return false;
  return _today() >= entry.dueAt;
}

/** Alias matching the srsScheduler.isDue() namespace API. */
export const isDue = isWordDue;

/**
 * Return an array of wordIds that are due for review today.
 * Accepts an optional array to filter; if omitted, returns all due IDs.
 *
 * @param {string[]} [wordIds] - optional list to filter
 * @returns {string[]}
 */
export function getDueWords(wordIds) {
  const schedule = _getSchedule();
  const today    = _today();
  const source   = Array.isArray(wordIds) ? wordIds : Object.keys(schedule);
  return source.filter(id => schedule[id] && today >= schedule[id].dueAt);
}

/**
 * Return the number of words that are due for review today.
 *
 * @returns {number}
 */
export function getDueCount() {
  return getDueWords().length;
}

/**
 * Return the SM-2 status for a given word, or null if never scheduled.
 *
 * @param {string} wordId
 * @returns {SrsEntry | null}
 */
export function getWordStatus(wordId) {
  if (!wordId) return null;
  const schedule = _getSchedule();
  const entry    = schedule[wordId];
  if (!entry) return null;
  return _ensureSM2Shape(entry);
}

/** Alias matching the srsScheduler.getSchedule() namespace API. */
export const getSchedule = getWordStatus;

/**
 * Clear all SRS schedule data from the store.
 */
export function reset() {
  _setSchedule({});
}

/**
 * Namespace object for callers that use the srsScheduler.* dot-notation API.
 */
export const srsScheduler = {
  record:      scheduleWord,
  isDue:       isWordDue,
  getDueWords,
  getSchedule: getWordStatus,
  reset,
};
