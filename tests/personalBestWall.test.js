import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { store } from '../src/modules/store.js';
import { getPersonalBests, __TEST__ } from '../src/modules/personalBestWall.js';
import { GRADUATED_BOX } from '../src/modules/reviewScheduler.js';

const NOW = new Date(2026, 4, 23, 9, 0, 0); // 2026-05-23 09:00
const DAY = 86_400_000;

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

describe('Personal Best Wall — derived trophy snapshot', () => {
  beforeEach(() => {
    store.reset();
    localStorage.clear();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the full 8-card grid even for an empty profile', () => {
    const pb = getPersonalBests();
    expect(pb.cards.map((c) => c.id)).toEqual([
      'streak',
      'level',
      'xpWeek',
      'daysMonth',
      'wordsGraduated',
      'wordsPractised',
      'storiesRead',
      'dailyChallenges',
    ]);
    // All values defined so the UI doesn't render "undefined".
    for (const card of pb.cards) {
      expect(card.value).toBeDefined();
    }
  });

  it('streak card surfaces both current and best, with friendly empty copy', () => {
    const pb = getPersonalBests();
    const streak = pb.cards.find((c) => c.id === 'streak');
    expect(streak.value).toBe(0);
    expect(streak.best).toBe(0);
    expect(streak.sub).toMatch(/start a streak/i);
  });

  it('uses bestStreak when current < best (does not lie)', () => {
    store.patch({ streak: 2, bestStreak: 11 });
    const pb = getPersonalBests();
    const streak = pb.cards.find((c) => c.id === 'streak');
    expect(streak.value).toBe(2);
    expect(streak.best).toBe(11);
  });

  it('treats current as best if best lags behind (defensive)', () => {
    // If somehow current > bestStreak, we still want best >= current
    // so the UI never shows "current 14 · best 2".
    store.patch({ streak: 14, bestStreak: 2 });
    const pb = getPersonalBests();
    const streak = pb.cards.find((c) => c.id === 'streak');
    expect(streak.best).toBe(14);
  });

  it('derives level from XP via the curriculum table', () => {
    store.set('xp', 250);
    const pb = getPersonalBests();
    const level = pb.cards.find((c) => c.id === 'level');
    expect(level.value).toBeGreaterThan(0);
    expect(level.sub).toContain('250 XP');
  });

  it('sums XP from the last 7 days only (weeklyXpLog)', () => {
    store.set('weeklyXpLog', [
      { date: isoDate(new Date(NOW.getTime() - 1 * DAY)), xp: 50 },
      { date: isoDate(new Date(NOW.getTime() - 3 * DAY)), xp: 30 },
      { date: isoDate(new Date(NOW.getTime() - 20 * DAY)), xp: 999 }, // excluded
    ]);
    const pb = getPersonalBests();
    expect(pb.cards.find((c) => c.id === 'xpWeek').value).toBe(80);
  });

  it('counts active days from challengeCalendar within the last 30 days', () => {
    store.set('challengeCalendar', [
      isoDate(new Date(NOW.getTime() - 1 * DAY)),
      isoDate(new Date(NOW.getTime() - 10 * DAY)),
      isoDate(new Date(NOW.getTime() - 45 * DAY)), // excluded
    ]);
    const pb = getPersonalBests();
    expect(pb.cards.find((c) => c.id === 'daysMonth').value).toBe(2);
    expect(pb.cards.find((c) => c.id === 'dailyChallenges').value).toBe(3); // all-time
  });

  it('counts graduated words at box >= GRADUATED_BOX (6)', () => {
    store.set('wordStats', {
      cat: { attempts: 10, correct: 10, box: GRADUATED_BOX, dueAt: NOW.getTime() },
      hat: { attempts: 10, correct: 10, box: GRADUATED_BOX, dueAt: NOW.getTime() },
      mat: { attempts: 5, correct: 4, box: 3, dueAt: NOW.getTime() },
      sit: { attempts: 0, correct: 0 },
    });
    const pb = getPersonalBests();
    expect(pb.cards.find((c) => c.id === 'wordsGraduated').value).toBe(2);
    expect(pb.cards.find((c) => c.id === 'wordsPractised').value).toBe(3); // sit has 0 attempts
  });

  it('reads stories finished from the giri_stories_read localStorage key', () => {
    localStorage.setItem('giri_stories_read', JSON.stringify(['story-1', 'story-2', 'story-3']));
    const pb = getPersonalBests();
    expect(pb.cards.find((c) => c.id === 'storiesRead').value).toBe(3);
  });

  it('gracefully handles a corrupted giri_stories_read value', () => {
    localStorage.setItem('giri_stories_read', '{not json');
    const pb = getPersonalBests();
    expect(pb.cards.find((c) => c.id === 'storiesRead').value).toBe(0);
  });

  it('builds celebration highlights based on what the child has reached', () => {
    store.patch({ bestStreak: 9 });
    store.set('wordStats', {
      cat: { box: GRADUATED_BOX, attempts: 10, correct: 10 },
    });
    localStorage.setItem('giri_stories_read', JSON.stringify(['s1']));
    const pb = getPersonalBests();
    expect(pb.summary.highlights.some((h) => h.includes('Best streak'))).toBe(true);
    expect(pb.summary.highlights.some((h) => h.includes('graduated'))).toBe(true);
    expect(pb.summary.highlights.some((h) => h.includes('Stor'))).toBe(true);
  });

  it('shows a warm starter highlight when nothing has been earned yet', () => {
    const pb = getPersonalBests();
    expect(pb.summary.highlights).toHaveLength(1);
    expect(pb.summary.highlights[0]).toMatch(/just getting started/i);
  });

  it('never returns a comparison-to-other-players field', () => {
    const pb = getPersonalBests();
    const serialized = JSON.stringify(pb).toLowerCase();
    for (const banned of ['league', 'rank', 'leaderboard', 'percentile', 'compared to other']) {
      expect(serialized).not.toContain(banned);
    }
  });
});

describe('_pickHighlights edge cases', () => {
  it('only includes streak when it crosses the 7-day floor', () => {
    expect(
      __TEST__._pickHighlights({ streakBest: 3, wordsGraduated: 0, storiesFinished: 0, level: 1 }),
    ).toEqual(['✨ Every quest counts — your trophy room is just getting started.']);
    expect(
      __TEST__._pickHighlights({
        streakBest: 7,
        wordsGraduated: 0,
        storiesFinished: 0,
        level: 1,
      })[0],
    ).toMatch(/Best streak/);
  });
});
