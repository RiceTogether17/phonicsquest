/**
 * PhonicsQuest – Weekly activity
 *
 * How much practice happened in the last seven days, counted across *both*
 * pathways.
 *
 * The parent-facing counters used to be derived from `wordHistory` alone,
 * which only the early-reading modes write. A P4 child who spends every
 * session in Grammar MCQ, Cloze Castle and the practice papers registered as
 * having done nothing: the coaching report read "0 days active, 0 words
 * practised, 0 day streak" after a full week of Primary English. Quest
 * attempts are the missing half.
 *
 * Store-only and dependency-light on purpose: the home screen imports this
 * eagerly, while the full dashboard-insights module stays in its lazy chunk.
 */

import { store } from './store.js';

const DAY_MS = 86_400_000;

function _time(value) {
  if (typeof value === 'number') return value;
  const parsed = Date.parse(value || '');
  return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Practice in a rolling window, pooled across early-reading and Primary
 * English.
 *
 * @param {object} [opts]
 * @param {number} [opts.days]  window length, default 7
 * @param {number} [opts.now]   clock override for tests
 * @returns {{
 *   days: number,          distinct days with any recorded practice
 *   questions: number,     quest attempts plus distinct words practised
 *   correct: number,       quest attempts marked correct
 *   answered: number,      quest attempts with a recorded outcome
 *   accuracy: number|null, correct / answered, or null when nothing is scored
 *   hasActivity: boolean,
 * }}
 */
export function getWeeklyActivity({ days = 7, now = Date.now() } = {}) {
  const cutoff = now - days * DAY_MS;

  const questAttempts = (store.get('questAttempts') || []).filter((a) => {
    const t = _time(a?.timestamp);
    return t !== null && t >= cutoff;
  });

  const wordHistory = (store.get('wordHistory') || []).filter((h) => {
    const t = _time(h?.timestamp);
    return t !== null && t >= cutoff;
  });

  const activeDays = new Set();
  for (const a of questAttempts) activeDays.add(new Date(_time(a.timestamp)).toDateString());
  for (const h of wordHistory) activeDays.add(new Date(_time(h.timestamp)).toDateString());
  // `lastPlayDate` covers a session that scored nothing worth logging.
  const today = new Date(now).toDateString();
  if (store.get('lastPlayDate') === today) activeDays.add(today);

  const answered = questAttempts.filter((a) => typeof a.correct === 'boolean').length;
  const correct = questAttempts.filter((a) => a.correct === true).length;
  const words = new Set(wordHistory.map((h) => h.word).filter(Boolean)).size;
  const questions = questAttempts.length + words;

  return {
    days: activeDays.size,
    questions,
    correct,
    answered,
    accuracy: answered > 0 ? correct / answered : null,
    hasActivity: questions > 0 || activeDays.size > 0,
  };
}
