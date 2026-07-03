/**
 * PhonicsQuest – Daily Challenge
 *
 * Each day offers a fresh set of 5 words selected deterministically
 * from the full word bank using today's date as a seed.
 * Completing all 5 earns 50 bonus XP and is recorded on a streak calendar.
 */

import { WORDS } from '../data/words.js';
import { store } from './store.js';
import { gamification } from './gamification.js';
import { normalizeAdaptiveConfig, getWordWeight } from './adaptiveSelection.js';

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

/**
 * Format a Date as a LOCAL YYYY-MM-DD string. All calendar bookkeeping in
 * this module uses local dates — never `toISOString()`, which is UTC and
 * rolls to the wrong day for evening play west of Greenwich (or morning
 * play east of it).
 */
function localDateStr(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Today's date string (YYYY-MM-DD, local time). */
function todayStr() {
  return localDateStr(new Date());
}

function pickFrom(pool, count, rng) {
  if (count <= 0 || pool.length === 0) return [];
  const copy = [...pool];
  const picked = [];
  for (let i = 0; i < count && copy.length > 0; i++) {
    const idx = Math.floor(rng() * copy.length);
    picked.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return picked;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Get today's deterministic daily-challenge word list.
 * Always returns the same words for the same calendar day.
 *
 * The first call of the day computes the set (seeded RNG + the child's
 * current stats) and pins the word ids in the store. Later calls replay
 * the pinned ids, so practising between visits can't reshuffle "today's
 * five" — the RNG seed alone can't guarantee that, because the candidate
 * pool and ordering also depend on mutable wordStats/difficulty.
 * @returns {import('../data/words.js').Word[]}
 */
export function getDailyChallengeWords() {
  const today = todayStr();

  const pinned = store.get('dailyChallengeWords');
  if (pinned && pinned.date === today && Array.isArray(pinned.ids)) {
    const words = pinned.ids
      .map(id => WORDS.find(w => w.id === id))
      .filter(Boolean);
    if (words.length === DAILY_WORD_COUNT) return words;
    // Stale ids (e.g. word bank changed between versions) — recompute below.
  }

  const words = _computeDailyChallengeWords();
  store.set('dailyChallengeWords', { date: today, ids: words.map(w => w.id) });
  return words;
}

/** Compute today's picks from the seeded RNG + current learner stats. */
function _computeDailyChallengeWords() {
  const seed = dateSeed(todayStr());
  const rng  = mulberry32(seed);
  const wordStats = store.get('wordStats') || {};
  const maxLevel = store.get('difficulty') || 1;
  const adaptiveCfg = normalizeAdaptiveConfig(store.get('adaptiveConfig'));

  const eligible = WORDS.filter(w => w.level <= maxLevel);
  const unseen = eligible.filter(w => !wordStats[w.id] || (wordStats[w.id].attempts || 0) === 0);

  const weightedWeak = eligible
    .filter(w => !unseen.includes(w))
    .map(word => ({ word, weight: getWordWeight(wordStats[word.id], adaptiveCfg) }))
    .sort((a, b) => b.weight - a.weight)
    .map(x => x.word);

  const strongerReview = eligible
    .filter(w => {
      const s = wordStats[w.id];
      return s && s.attempts >= adaptiveCfg.masteryMinAttempts && (s.correct / s.attempts) >= adaptiveCfg.strongAccuracy;
    });

  const picks = [];
  picks.push(...pickFrom(weightedWeak, 3, rng));
  picks.push(...pickFrom(unseen.filter(w => !picks.includes(w)), 1, rng));
  picks.push(...pickFrom(strongerReview.filter(w => !picks.includes(w)), 1, rng));

  if (picks.length < DAILY_WORD_COUNT) {
    picks.push(...pickFrom(eligible.filter(w => !picks.includes(w)), DAILY_WORD_COUNT - picks.length, rng));
  }

  // Deterministic shuffle of selected words to avoid positional bias.
  const pool = [...picks];
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

  // Award bonus XP through the centralized pipeline so level-ups,
  // session XP, and weekly logs stay in sync.
  gamification.awardXp(DAILY_BONUS_XP, 'daily_challenge_bonus');

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
    // Compare in LOCAL dates — the calendar is written with localDateStr,
    // so a UTC comparison would miss today's completion in any timezone
    // west of UTC after ~5pm.
    if (calendar.includes(localDateStr(d))) count++;
  }
  return count;
}

export { DAILY_BONUS_XP, DAILY_WORD_COUNT };
