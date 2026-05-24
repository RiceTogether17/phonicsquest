import { describe, it, expect } from 'vitest';
import {
  scheduleAttempt,
  seedFromLegacy,
  getMaturity,
  isDue,
  getDueItems,
  countDueItems,
  getGraduatingSoon,
  getSlippingRecently,
  getReviewCapForProfile,
  estimateMinutes,
  INTERVAL_DAYS,
  MAX_BOX,
  GRADUATED_BOX,
  __TEST__,
} from '../src/modules/reviewScheduler.js';

const DAY = 86_400_000;
const NOW = new Date(2026, 4, 23, 9, 0, 0).getTime(); // 2026-05-23 09:00

describe('scheduleAttempt — Leitner ladder', () => {
  it('places a brand-new item in box 0, due now', () => {
    const next = scheduleAttempt(undefined, true, NOW);
    expect(next.box).toBe(1);
    expect(next.dueAt).toBe(NOW + INTERVAL_DAYS[1] * DAY);
    expect(next.lastResult).toBe('pass');
  });

  it('advances one box on each correct answer', () => {
    let stat = { box: 0, dueAt: NOW };
    for (let b = 1; b <= MAX_BOX; b++) {
      stat = scheduleAttempt(stat, true, NOW);
      expect(stat.box).toBe(b);
    }
  });

  it('caps at the graduated box', () => {
    const stat = scheduleAttempt({ box: MAX_BOX, dueAt: NOW }, true, NOW);
    expect(stat.box).toBe(MAX_BOX);
    expect(stat.graduatedAt).toBe(NOW);
  });

  it('demotes one box on a wrong answer', () => {
    const stat = scheduleAttempt({ box: 3, dueAt: NOW }, false, NOW);
    expect(stat.box).toBe(2);
    expect(stat.lastResult).toBe('demote');
  });

  it('never demotes below box 0 — the floor is forgiving', () => {
    const stat = scheduleAttempt({ box: 0, dueAt: NOW }, false, NOW);
    expect(stat.box).toBe(0);
  });

  it('graduated items only drop to box 3 — momentum protection', () => {
    const stat = scheduleAttempt({ box: GRADUATED_BOX, dueAt: NOW, graduatedAt: NOW - 5 * DAY }, false, NOW);
    expect(stat.box).toBe(__TEST__.GRADUATED_FLOOR);
    expect(stat.box).toBe(3);
  });

  it('schedules dueAt by the interval table', () => {
    const cases = [
      { box: 0, interval: 0 },
      { box: 1, interval: 1 },
      { box: 2, interval: 3 },
      { box: 3, interval: 7 },
      { box: 4, interval: 14 },
      { box: 5, interval: 30 },
    ];
    for (const { box, interval } of cases) {
      const stat = scheduleAttempt({ box: box - 1, dueAt: NOW }, true, NOW);
      expect(stat.box).toBe(box);
      expect(stat.dueAt - NOW).toBe(interval * DAY);
    }
  });

  it('preserves graduatedAt across subsequent correct answers', () => {
    const graduated = scheduleAttempt({ box: 5, dueAt: NOW }, true, NOW);
    expect(graduated.graduatedAt).toBe(NOW);
    const stillGraduated = scheduleAttempt(graduated, true, NOW + DAY);
    expect(stillGraduated.graduatedAt).toBe(NOW);
  });
});

describe('seedFromLegacy — zero data loss on upgrade', () => {
  it('returns box 0 for a brand-new stat', () => {
    expect(seedFromLegacy(undefined, NOW).box).toBe(0);
  });

  it('seeds a struggling word (low accuracy) at box 0', () => {
    expect(seedFromLegacy({ attempts: 8, correct: 2 }, NOW).box).toBe(0);
  });

  it('seeds a developing word (50–79%) at box 1', () => {
    expect(seedFromLegacy({ attempts: 10, correct: 7 }, NOW).box).toBe(1);
  });

  it('seeds a strong word (80–94%) at box 3', () => {
    expect(seedFromLegacy({ attempts: 10, correct: 9 }, NOW).box).toBe(3);
  });

  it('seeds a mastered word (≥95% over 5+ attempts) at box 5', () => {
    expect(seedFromLegacy({ attempts: 20, correct: 19 }, NOW).box).toBe(5);
  });

  it('is idempotent — does not re-seed a stat that already has a box', () => {
    const existing = { box: 4, dueAt: NOW + 14 * DAY, attempts: 10, correct: 9 };
    const seeded = seedFromLegacy(existing, NOW);
    expect(seeded.box).toBe(4);
    expect(seeded.dueAt).toBe(NOW + 14 * DAY);
  });
});

describe('getMaturity — 5-dot indicator', () => {
  it('shows zero dots for an empty stat', () => {
    expect(getMaturity(undefined)).toEqual({ dots: 0, graduated: false });
  });

  it('maps boxes 0–5 to 0–5 dots', () => {
    for (let b = 0; b <= 5; b++) {
      expect(getMaturity({ box: b })).toEqual({ dots: b, graduated: false });
    }
  });

  it('flags graduated items', () => {
    expect(getMaturity({ box: GRADUATED_BOX })).toEqual({ dots: 5, graduated: true });
  });
});

describe('isDue / countDueItems / getDueItems', () => {
  const items = [
    { id: 'cat' },
    { id: 'hat' },
    { id: 'mat' },
    { id: 'sit' },
  ];

  it('treats stats with no dueAt as not-due', () => {
    expect(isDue({ box: 0, attempts: 0 }, NOW)).toBe(false);
  });

  it('falls back to legacy nextReviewDate when dueAt is missing', () => {
    const legacy = { nextReviewDate: new Date(NOW - DAY).toISOString() };
    expect(isDue(legacy, NOW)).toBe(true);
  });

  it('returns oldest-overdue first', () => {
    const wordStats = {
      cat: { box: 1, dueAt: NOW - DAY },         // 1 day overdue
      hat: { box: 2, dueAt: NOW - 3 * DAY },     // 3 days overdue
      mat: { box: 0, dueAt: NOW + DAY },         // not due yet
      sit: { box: 3, dueAt: NOW },               // due right now
    };
    const due = getDueItems(wordStats, items, { now: NOW });
    expect(due.map(d => d.id)).toEqual(['hat', 'cat', 'sit']);
  });

  it('honours the cap (avalanche prevention)', () => {
    const wordStats = {};
    for (const item of items) wordStats[item.id] = { box: 1, dueAt: NOW - DAY };
    expect(getDueItems(wordStats, items, { now: NOW, cap: 2 })).toHaveLength(2);
    expect(countDueItems(wordStats, items, NOW)).toBe(4);
  });
});

describe('getGraduatingSoon / getSlippingRecently — parent dashboard', () => {
  const items = [
    { id: 'cat', word: 'cat' },
    { id: 'hat', word: 'hat' },
    { id: 'mat', word: 'mat' },
  ];

  it('lists items at box 5 due within the horizon', () => {
    const wordStats = {
      cat: { box: 5, dueAt: NOW + 3 * DAY },      // due in 3 days → graduating soon
      hat: { box: 5, dueAt: NOW + 30 * DAY },     // due in 30 days → not yet
      mat: { box: 4, dueAt: NOW + 2 * DAY },      // not at box 5
    };
    const grads = getGraduatingSoon(wordStats, items, 7, NOW);
    expect(grads.map(g => g.id)).toEqual(['cat']);
  });

  it('lists items demoted in the last 7 days', () => {
    const wordStats = {
      cat: { lastResult: 'demote', lastSeen: new Date(NOW - 2 * DAY).toISOString() },
      hat: { lastResult: 'pass',   lastSeen: new Date(NOW - 1 * DAY).toISOString() },
      mat: { lastResult: 'demote', lastSeen: new Date(NOW - 30 * DAY).toISOString() },
    };
    const slips = getSlippingRecently(wordStats, items, 7, NOW);
    expect(slips.map(g => g.id)).toEqual(['cat']);
  });
});

describe('getReviewCapForProfile — per-band cap', () => {
  it('returns 10 for null profile (safest default)', () => {
    expect(getReviewCapForProfile(null)).toBe(10);
  });

  it('returns 10 for P1 profile', () => {
    expect(getReviewCapForProfile({ primaryGrade: 'P1' })).toBe(10);
  });

  it('returns 20 for P2+ profile', () => {
    expect(getReviewCapForProfile({ primaryGrade: 'P4' })).toBe(20);
    expect(getReviewCapForProfile({ primaryGrade: 'P6' })).toBe(20);
  });

  it('reads schoolLevel as a fallback', () => {
    expect(getReviewCapForProfile({ schoolLevel: 'P3 Primary' })).toBe(20);
  });
});

describe('estimateMinutes', () => {
  it('returns 0 for empty queue', () => {
    expect(estimateMinutes(0)).toBe(0);
  });

  it('rounds to nearest minute, floor of 1', () => {
    expect(estimateMinutes(1)).toBe(1);
    expect(estimateMinutes(8)).toBe(5);
    expect(estimateMinutes(20)).toBe(12);
  });
});
