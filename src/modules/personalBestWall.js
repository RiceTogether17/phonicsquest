/**
 * PhonicsQuest – Personal Best Wall
 *
 * The charter's answer to Duolingo's leagues: a celebration surface that
 * compares the child to *themselves*, never to other players. Everything
 * here is derived from existing per-profile telemetry — no new tracking,
 * no leaderboards, no rank.
 *
 * The wall reads like a trophy room: a handful of round numbers a child
 * can see grow over time. Every card carries a "current vs personal best"
 * pair where the comparison makes sense, so today's value always sits
 * next to the highest the child has ever reached.
 *
 * Charter-safe:
 *   - No comparison to other players, anywhere.
 *   - No "you're behind" framing — the empty/early-game state celebrates
 *     starting, not failing.
 *   - No new data sources; everything pulled from store, badges, and the
 *     stories localStorage key.
 */

import { store } from './store.js';
import { badges } from './badges.js';
import { getActiveProfile } from './profiles.js';
import { getLevelInfo } from '../data/curriculum.js';
import { GRADUATED_BOX } from './reviewScheduler.js';

const DAY_MS = 86_400_000;
const STORIES_READ_KEY = 'giri_stories_read';

/**
 * Build the full Personal Best Wall snapshot for the current profile.
 * Pure: no DOM, no async — easy to unit-test.
 *
 * @param {{ now?: number }} [opts]
 * @returns {{
 *   profileName: string,
 *   cards: Array<{
 *     id: string, icon: string, label: string,
 *     value: number|string, best?: number|string, sub?: string,
 *   }>,
 *   badges: Array<{ id: string, name: string, emoji: string }>,
 *   summary: { highlights: string[] },
 * }}
 */
export function getPersonalBests(opts = {}) {
  const now = opts.now ?? Date.now();

  // ── Streak ───────────────────────────────────────────────────────────
  const streakCurrent = store.get('streak') || 0;
  const streakBest = Math.max(store.get('bestStreak') || 0, streakCurrent);

  // ── Level / XP ───────────────────────────────────────────────────────
  const xp = store.get('xp') || 0;
  const { level } = getLevelInfo(xp);

  // ── Days played (rolling 30 + lifetime) ──────────────────────────────
  const challengeCal = Array.isArray(store.get('challengeCalendar'))
    ? store.get('challengeCalendar')
    : [];
  const cutoff30 = now - 30 * DAY_MS;
  const daysThisMonth = challengeCal.filter((d) => {
    const t = new Date(d).getTime();
    return Number.isFinite(t) && t >= cutoff30;
  }).length;
  const dailyChallengesEver = challengeCal.length;

  // ── XP this week (from rolling daily ledger) ─────────────────────────
  const cutoff7Iso = new Date(now - 7 * DAY_MS).toISOString().slice(0, 10);
  const weeklyXpLog = Array.isArray(store.get('weeklyXpLog')) ? store.get('weeklyXpLog') : [];
  const xpThisWeek = weeklyXpLog
    .filter((e) => e?.date >= cutoff7Iso)
    .reduce((sum, e) => sum + (e?.xp || 0), 0);

  // ── Words: graduated + total practised ───────────────────────────────
  const wordStats = store.get('wordStats') || {};
  const wordStatList = Object.values(wordStats);
  const wordsPractised = wordStatList.filter((s) => s && (s.attempts || 0) > 0).length;
  const wordsGraduated = wordStatList.filter((s) => s && (s.box || 0) >= GRADUATED_BOX).length;

  // ── Stories finished (lives in its own localStorage key) ─────────────
  const storiesFinished = _safeReadStoriesRead().length;

  // ── Badges (already a per-profile structure) ─────────────────────────
  let earnedBadges;
  try {
    earnedBadges = badges.getEarned() || [];
  } catch (_) {
    earnedBadges = [];
  }

  // ── Profile name ─────────────────────────────────────────────────────
  let profileName = 'You';
  try {
    const active = getActiveProfile();
    if (active?.name) profileName = active.name;
  } catch (_) {
    /* ignore — tests or first-run with no profile */
  }

  const cards = [
    {
      id: 'streak',
      icon: '🔥',
      label: 'Day Streak',
      value: streakCurrent,
      best: streakBest,
      sub:
        streakBest > 0
          ? `Best: ${streakBest} day${streakBest === 1 ? '' : 's'}`
          : 'Play tomorrow to start a streak',
    },
    {
      id: 'level',
      icon: '⭐',
      label: 'Level',
      value: level,
      sub: `${xp} XP earned all-time`,
    },
    {
      id: 'xpWeek',
      icon: '⚡',
      label: 'XP this week',
      value: xpThisWeek,
      sub: 'Last 7 days',
    },
    {
      id: 'daysMonth',
      icon: '📅',
      label: 'Active days this month',
      value: daysThisMonth,
      sub: 'Last 30 days',
    },
    {
      id: 'wordsGraduated',
      icon: '🌟',
      label: 'Words graduated',
      value: wordsGraduated,
      sub: 'Locked in long-term memory',
    },
    {
      id: 'wordsPractised',
      icon: '🗂️',
      label: 'Words practised',
      value: wordsPractised,
      sub: 'Unique words you have tried',
    },
    {
      id: 'storiesRead',
      icon: '📚',
      label: 'Giri Stories finished',
      value: storiesFinished,
    },
    {
      id: 'dailyChallenges',
      icon: '🏆',
      label: 'Daily Challenges done',
      value: dailyChallengesEver,
    },
  ];

  return {
    profileName,
    cards,
    badges: earnedBadges.map((b) => ({ id: b.id, name: b.name, emoji: b.emoji })),
    summary: {
      highlights: _pickHighlights({ streakBest, wordsGraduated, storiesFinished, level }),
    },
  };
}

function _safeReadStoriesRead() {
  try {
    const raw = localStorage.getItem(STORIES_READ_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function _pickHighlights({ streakBest, wordsGraduated, storiesFinished, level }) {
  const lines = [];
  if (streakBest >= 7) lines.push(`🔥 Best streak: ${streakBest} days`);
  if (wordsGraduated > 0)
    lines.push(`🌟 ${wordsGraduated} word${wordsGraduated === 1 ? '' : 's'} graduated`);
  if (storiesFinished > 0)
    lines.push(`📚 ${storiesFinished} Giri Stor${storiesFinished === 1 ? 'y' : 'ies'} finished`);
  if (level > 1) lines.push(`⭐ Level ${level}`);
  if (lines.length === 0)
    lines.push('✨ Every quest counts — your trophy room is just getting started.');
  return lines;
}

export const __TEST__ = { STORIES_READ_KEY, _safeReadStoriesRead, _pickHighlights };
