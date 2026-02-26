/**
 * PhonicsQuest – Daily Challenge
 *
 * Each day offers a fresh set of 5 words selected deterministically
 * from the full word bank using today's date as a seed.
 * Completing all 5 earns 50 bonus XP and is recorded on a streak calendar.
 */

import { WORDS } from '../data/words.js';
import { store } from './store.js';

const DAILY_WORD_COUNT = 5;
const DAILY_BONUS_XP   = 50;

// ── Seeded pseudo-random number generator (mulberry32) ─────────────────────

function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Convert a date string like "2026-02-23" to a numeric seed. */
function dateSeed(dateStr) {
  return parseInt(dateStr.replace(/-/g, ''), 10);
}

/** Today's date string (YYYY-MM-DD). */
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Get today's deterministic daily-challenge word list.
 * Always returns the same words for the same calendar day.
 * @returns {import('../data/words.js').Word[]}
 */
export function getDailyChallengeWords() {
  const seed = dateSeed(todayStr());
  const rng  = mulberry32(seed);

  // Shuffle a copy of all words using the seeded RNG
  const pool = [...WORDS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, DAILY_WORD_COUNT);
}

/** Whether today's challenge has been completed. */
export function isDailyChallengeComplete() {
  const state = store.get('dailyChallenge') || {};
  return state.date === todayStr() && state.complete === true;
}

/** Mark today's challenge complete and award bonus XP. */
export function completeDailyChallenge() {
  if (isDailyChallengeComplete()) return 0; // already done

  const state = { date: todayStr(), complete: true };
  store.set('dailyChallenge', state);

  // Record date in calendar history
  const calendar = store.get('challengeCalendar') || [];
  if (!calendar.includes(todayStr())) {
    const updated = [todayStr(), ...calendar].slice(0, 365);
    store.set('challengeCalendar', updated);
  }

  // Award bonus XP via gamification (just add to raw xp)
  const currentXp = store.get('xp') || 0;
  store.set('xp', currentXp + DAILY_BONUS_XP);

  return DAILY_BONUS_XP;
}

/** Get the calendar of days on which a daily challenge was completed. */
export function getChallengeCalendar() {
  return store.get('challengeCalendar') || [];
}

/** How many daily challenges completed in the last 7 days. */
export function getWeeklyStreak() {
  const calendar = getChallengeCalendar();
  const today = new Date();
  let count = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (calendar.includes(d.toISOString().slice(0, 10))) count++;
  }
  return count;
}

export { DAILY_BONUS_XP, DAILY_WORD_COUNT };
