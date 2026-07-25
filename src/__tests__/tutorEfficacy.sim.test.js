/**
 * Tutor-efficacy simulation.
 *
 * Drives the real scheduling + adaptive-selection engines with a simulated
 * learner who forgets over time, and asserts the properties a tutor is hired
 * for: knowledge grows, practised words are retained long-term, weak words
 * get more attention than strong ones, and the daily workload stays humane.
 *
 * The learner model is deliberately simple and pessimistic: each word has a
 * memory strength; recall probability decays exponentially with days since
 * last practice (halving roughly every `strength` days); every practice
 * attempt strengthens the memory (more when recalled, less when not).
 * If the engines produce learning gains for this learner, the scheduling
 * logic — not luck — is doing the teaching.
 */
import { describe, expect, it } from 'vitest';
import {
  scheduleAttempt, getDueItems, getMaturity, GRADUATED_BOX,
} from '../modules/reviewScheduler.js';
import {
  getWordWeight, normalizeAdaptiveConfig,
} from '../modules/adaptiveSelection.js';

const DAY_MS = 86_400_000;

/** Deterministic PRNG (mulberry32) so the simulation is reproducible. */
function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** P(recall) after `elapsedDays` for a memory of the given strength. */
function recallProbability(strengthDays, elapsedDays) {
  if (strengthDays <= 0) return 0.3; // guessing/first exposure
  return Math.exp((-0.693 * elapsedDays) / strengthDays);
}

function simulateLearner({ seed, days, wordCount, newPerDay, reviewCap }) {
  const rng = makeRng(seed);
  const words = Array.from({ length: wordCount }, (_, i) => ({ id: `w${i}` }));
  /** app-side stats keyed by word id (what the store would hold) */
  const stats = {};
  /** learner-side memory: strength in days, last practice time */
  const memory = {};
  const start = Date.parse('2026-01-05T09:00:00Z');
  let introduced = 0;
  let attemptsTotal = 0;
  const attemptsByWord = {};
  const dailyLoad = [];

  const practise = (id, now) => {
    const mem = memory[id] || { strength: 0, lastAt: now };
    const elapsed = (now - mem.lastAt) / DAY_MS;
    const p = recallProbability(mem.strength, elapsed);
    const correct = rng() < p;
    // Practice strengthens memory: successful recall compounds it, a miss
    // (followed by the app re-teaching) still adds a little.
    mem.strength = correct
      ? Math.max(1, mem.strength * 1.9 + 0.6)
      : Math.max(0.75, mem.strength * 0.9 + 0.3);
    mem.lastAt = now;
    memory[id] = mem;

    const sched = scheduleAttempt(stats[id], correct, now);
    const prev = stats[id] || { attempts: 0, correct: 0 };
    stats[id] = {
      ...prev,
      ...sched,
      attempts: prev.attempts + 1,
      correct: prev.correct + (correct ? 1 : 0),
      lastSeen: new Date(now).toISOString(),
    };
    attemptsTotal += 1;
    attemptsByWord[id] = (attemptsByWord[id] || 0) + 1;
    return correct;
  };

  for (let day = 0; day < days; day++) {
    const now = start + day * DAY_MS;

    // 1. Review lane first — exactly what the app's Today's Plan does.
    const due = getDueItems(stats, words, { cap: reviewCap, now });
    dailyLoad.push(due.length);
    for (const d of due) practise(d.id, now);

    // 2. Introduce a few new words a day, like a lesson's "new material".
    for (let n = 0; n < newPerDay && introduced < wordCount; n++) {
      practise(words[introduced].id, now);
      introduced += 1;
    }
  }

  return { stats, memory, words, attemptsTotal, attemptsByWord, dailyLoad, start, days };
}

describe('tutor efficacy over a 60-day simulated learner', () => {
  const sim = simulateLearner({
    seed: 20260725, days: 60, wordCount: 120, newPerDay: 3, reviewCap: 20,
  });

  it('produces real learning gains: most practised words reach high maturity', () => {
    const practised = sim.words.filter(w => sim.stats[w.id]);
    expect(practised.length).toBeGreaterThanOrEqual(100); // curriculum coverage
    const mature = practised.filter(w => getMaturity(sim.stats[w.id]).dots >= 3);
    // At least 70% of everything taught sits at box 3+ (a week+ between reviews).
    expect(mature.length / practised.length).toBeGreaterThan(0.7);
  });

  it('moves early words onto month-scale retention intervals', () => {
    // Full graduation (box 6) requires 55+ consecutive correct days by
    // design, so it can't happen inside a 60-day course — box 5 (a
    // 30-day interval) is the long-term-retention marker reachable here.
    const early = sim.words.slice(0, 30); // taught in the first two weeks
    const longTerm = early.filter(w => (sim.stats[w.id]?.box ?? 0) >= GRADUATED_BOX - 1);
    expect(longTerm.length / early.length).toBeGreaterThan(0.5);
  });

  it('retains what it taught: end-of-course recall beats the no-tutor baseline', () => {
    const end = sim.start + sim.days * DAY_MS;
    // Learner's actual expected recall today, from the memory model.
    const recalls = sim.words
      .filter(w => sim.memory[w.id])
      .map(w => {
        const m = sim.memory[w.id];
        return recallProbability(m.strength, (end - m.lastAt) / DAY_MS);
      });
    const mean = recalls.reduce((a, b) => a + b, 0) / recalls.length;
    // Baseline: same learner model, each word seen once and never reviewed.
    const baseline = recallProbability(1, 30);
    expect(mean).toBeGreaterThan(0.85);
    expect(mean).toBeGreaterThan(baseline * 5);
  });

  it('spends its attention like a tutor: struggling words get more practice', () => {
    const byAccuracy = sim.words
      .filter(w => (sim.stats[w.id]?.attempts ?? 0) >= 3)
      .map(w => ({
        acc: sim.stats[w.id].correct / sim.stats[w.id].attempts,
        n: sim.attemptsByWord[w.id],
      }));
    const weak = byAccuracy.filter(x => x.acc < 0.7);
    const strong = byAccuracy.filter(x => x.acc >= 0.9);
    const avg = (xs) => xs.reduce((a, b) => a + b.n, 0) / xs.length;
    expect(weak.length).toBeGreaterThan(0);
    expect(strong.length).toBeGreaterThan(0);
    // The scheduler re-drilled hard words more often than easy ones.
    expect(avg(weak)).toBeGreaterThan(avg(strong));
  });

  it('adaptive weighting agrees: weak words outweigh mastered ones in selection', () => {
    const cfg = normalizeAdaptiveConfig();
    const weakStat = { attempts: 10, correct: 4 };
    const strongStat = {
      attempts: 12, correct: 12,
      nextReviewDate: new Date(Date.now() + 7 * DAY_MS).toISOString(),
    };
    expect(getWordWeight(weakStat, cfg)).toBeGreaterThan(getWordWeight(strongStat, cfg));
  });

  it('keeps the daily workload humane and non-exploding', () => {
    expect(Math.max(...sim.dailyLoad)).toBeLessThanOrEqual(20); // session cap held
    // Steady state: reviews don't pile up unbounded at the end of the course.
    const lastWeek = sim.dailyLoad.slice(-7);
    const avgLastWeek = lastWeek.reduce((a, b) => a + b, 0) / lastWeek.length;
    expect(avgLastWeek).toBeLessThanOrEqual(20);
  });
});
