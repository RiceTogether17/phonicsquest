/**
 * PhonicsQuest – Lightweight SRS Scheduler
 *
 * A simple Spaced Repetition System for vocabulary words in Word Vault.
 * Schedule data is persisted under the 'srsSchedule' key in the store,
 * keyed by wordId.
 *
 * Algorithm:
 *   correct → interval = Math.min(interval * 2, 60), dueAt = today + interval days
 *   wrong   → interval = 1, dueAt = tomorrow
 *   due     → today >= dueAt
 */

import { store } from './store.js';

const STORE_KEY = 'srsSchedule';

/** Return today's date as a 'YYYY-MM-DD' string (local time). */
function _today() {
  return new Date().toISOString().slice(0, 10);
}

/** Return an ISO date string for today + n days. */
function _addDays(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Read the full schedule map from the store. */
function _getSchedule() {
  return store.get(STORE_KEY) || {};
}

/** Persist the full schedule map to the store. */
function _setSchedule(schedule) {
  store.set(STORE_KEY, schedule);
}

/**
 * Record a review result for a word and reschedule it.
 * Creates a new entry if the word has never been scheduled before.
 *
 * @param {string} wordId   - unique identifier for the vocabulary word
 * @param {boolean} correct - true if the learner answered correctly
 */
export function scheduleWord(wordId, correct) {
  if (!wordId) return;
  const schedule = _getSchedule();
  const existing = schedule[wordId] || { interval: 1, dueAt: _today(), correct: 0, wrong: 0 };

  let interval;
  let dueAt;

  if (correct) {
    interval = Math.min(existing.interval * 2, 60);
    dueAt    = _addDays(interval);
  } else {
    interval = 1;
    dueAt    = _addDays(1);
  }

  schedule[wordId] = {
    interval,
    dueAt,
    correct: existing.correct + (correct ? 1 : 0),
    wrong:   existing.wrong   + (correct ? 0 : 1),
  };

  _setSchedule(schedule);
}

/**
 * Check whether a word is due for review today.
 *
 * @param {string} wordId
 * @returns {boolean}
 */
export function isWordDue(wordId) {
  if (!wordId) return false;
  const schedule = _getSchedule();
  const entry = schedule[wordId];
  if (!entry) return false;
  return _today() >= entry.dueAt;
}

/**
 * Return an array of wordIds that are due for review today.
 *
 * @returns {string[]}
 */
export function getDueWords() {
  const schedule = _getSchedule();
  const today = _today();
  return Object.keys(schedule).filter(id => today >= schedule[id].dueAt);
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
 * Return the SRS status for a given word, or null if it has never been scheduled.
 *
 * @param {string} wordId
 * @returns {{ interval: number, dueAt: string, correct: number, wrong: number } | null}
 */
export function getWordStatus(wordId) {
  if (!wordId) return null;
  const schedule = _getSchedule();
  return schedule[wordId] ?? null;
}
