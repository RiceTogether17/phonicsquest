/**
 * A child working alone must be able to move through the phonics stages.
 *
 * Every phonics reading game records at most `guided` evidence, so these
 * tests play the stages the way an unaided child does and check that the
 * path keeps moving: mixed-review stages get a score, review promotes words,
 * unlocked stages stay unlocked, and "separate days" means the child's days.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { store } from '../modules/store.js';
import { progress } from '../modules/progress.js';
import {
  buildProgressionSnapshot,
  getStageReadiness,
  getUnlockedStages,
} from '../modules/progression.js';
import { getEarlyReadingPlan } from '../modules/todaysPlan.js';
import { CURRICULUM } from '../data/curriculum.js';
import { WORDS } from '../data/words.js';
import { localYmd } from '../utils/dates.js';

const MIXED = CURRICULUM.find((s) => s.group === 'struct-cvc');
const AFTER_MIXED = CURRICULUM.find((s) => s.prerequisite === MIXED.id);
const CVC_A = CURRICULUM.find((s) => s.group === 'cvc-a');
const AFTER_CVC_A = CURRICULUM.find((s) => s.prerequisite === CVC_A.id);

/** Play `words` once each through Blend It on each of `days`. */
function playOnDays(words, days, { mode = 'blend', evidence = 'guided', correct = true } = {}) {
  for (const day of days) {
    vi.setSystemTime(day);
    for (const w of words) progress.recordAttempt(w.id, correct, mode, 1500, evidence);
  }
}

const DAY_1 = new Date(2026, 4, 4, 10, 0, 0);
const DAY_2 = new Date(2026, 4, 5, 10, 0, 0);

describe('an unaided child moves through the stages', () => {
  beforeEach(() => {
    store.reset();
    vi.useFakeTimers();
    vi.setSystemTime(DAY_1);
  });
  afterEach(() => {
    vi.useRealTimers();
    store.reset();
  });

  it('scores the mixed CVC review stage, which is no word’s own group', () => {
    const words = progress.getWordsInGroup(MIXED.group).slice(0, 14);
    playOnDays(words, [DAY_1, DAY_2]);
    expect(store.get('groupMastery')[MIXED.group]).toBe(1);
  });

  it('opens the stage after mixed CVC from Blend It answers alone', () => {
    const words = progress.getWordsInGroup(MIXED.group).slice(0, 14);
    playOnDays(words, [DAY_1, DAY_2]);
    const r = getStageReadiness(AFTER_MIXED.id, buildProgressionSnapshot());
    expect(r.unlocked).toBe(true);
    expect(r.checks.decodingAccuracy.fallback).toBe('decoding-supported');
    // Supported answers may unlock, but never count as mastery.
    expect(r.masteryLevel).toBe('ready-to-explore');
  });

  it('does not count bare "I read it" taps as supported decoding', () => {
    const words = progress.getWordsInGroup(CVC_A.group).slice(0, 14);
    playOnDays(words, [DAY_1, DAY_2], { evidence: 'exposure' });
    const r = getStageReadiness(AFTER_CVC_A.id, buildProgressionSnapshot());
    expect(r.checks.decodingAccuracy.fallback).toBe('cross-skill');
  });

  it('judges decoding on reading, not on spelling misses', () => {
    const words = progress.getWordsInGroup(CVC_A.group).slice(0, 14);
    playOnDays(words, [DAY_1, DAY_2]);
    playOnDays(words, [DAY_2], { mode: 'listenAndSpell', evidence: 'independent', correct: false });
    const r = getStageReadiness(AFTER_CVC_A.id, buildProgressionSnapshot());
    expect(r.checks.decodingAccuracy.actual).toBe(1);
    // The spelling gap is still reported, by its own check.
    expect(r.checks.spellingAccuracy.pass).toBe(false);
  });
});

describe('unlocked stages stay unlocked', () => {
  beforeEach(() => {
    store.reset();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    store.reset();
  });

  it('keeps a stage open after a bad review day', () => {
    const words = progress.getWordsInGroup(CVC_A.group).slice(0, 14);
    playOnDays(words, [DAY_1, DAY_2]);
    expect(getUnlockedStages()).toContain(AFTER_CVC_A.id);

    // A tired day: every one of those words wrong, twice.
    playOnDays(words, [DAY_2, DAY_2], { correct: false });
    expect(getStageReadiness(AFTER_CVC_A.id, buildProgressionSnapshot()).unlocked).toBe(false);
    expect(getUnlockedStages()).toContain(AFTER_CVC_A.id);
  });

  it('reads remembered stages from a hand-built snapshot without writing', () => {
    const ids = getUnlockedStages({ stagesUnlocked: [AFTER_CVC_A.id, 'no-such-stage'] });
    expect(ids).toContain(AFTER_CVC_A.id);
    expect(ids).not.toContain('no-such-stage');
    expect(store.get('stagesUnlocked')).toEqual([]);
  });
});

describe('separate days are the child’s own days', () => {
  const ORIGINAL_TZ = process.env.TZ;
  afterEach(() => {
    if (ORIGINAL_TZ === undefined) delete process.env.TZ;
    else process.env.TZ = ORIGINAL_TZ;
  });

  const ids = progress.getWordsInGroup(CVC_A.group).map((w) => w.id);
  const events = (stamps) =>
    stamps.flatMap((t) =>
      ids.slice(0, 12).map((id) => ({
        eventType: 'word_attempt',
        meta: { wordId: id },
        timestamp: t,
      })),
    );
  const sessionDays = (stamps) =>
    getStageReadiness(AFTER_CVC_A.id, { learningEvents: events(stamps) }).checks.sessionDays;

  it('counts 7:30am and 9:30am on one Singapore morning as one day', () => {
    process.env.TZ = 'Asia/Singapore';
    // 07:30 and 09:30 SGT on 2 May fall on different UTC dates.
    const r = sessionDays(['2026-05-01T23:30:00Z', '2026-05-02T01:30:00Z']);
    expect(r.actual).toBe(1);
    expect(r.pass).toBe(false);
  });

  it('counts a Monday evening and a Tuesday morning as two days', () => {
    process.env.TZ = 'Asia/Singapore';
    // 19:00 Monday and 07:00 Tuesday SGT share one UTC date.
    const r = sessionDays(['2026-05-04T11:00:00Z', '2026-05-04T23:00:00Z']);
    expect(r.actual).toBe(2);
    expect(r.pass).toBe(true);
  });
});

describe('Review Lane can clear', () => {
  beforeEach(() => store.reset());
  afterEach(() => {
    vi.useRealTimers();
    store.reset();
  });

  it('moves a word up a box on a correct supported answer', () => {
    store.recordWordAttempt(WORDS[0].id, true, 'guided');
    expect(store.get('wordStats')[WORDS[0].id].box).toBe(1);
  });

  it('holds the box when the child only said they read it', () => {
    store.recordWordAttempt(WORDS[0].id, true, 'exposure');
    expect(store.get('wordStats')[WORDS[0].id].box).toBe(0);
  });

  it("ticks the plan's review step once today's session is finished", () => {
    vi.useFakeTimers();
    vi.setSystemTime(DAY_2);
    const dueAt = DAY_2.getTime() - 86_400_000;
    const stats = {};
    for (const w of WORDS.slice(0, 30)) stats[w.id] = { attempts: 1, correct: 1, box: 1, dueAt };
    store.set('wordStats', stats);
    expect(getEarlyReadingPlan().steps[0].done).toBe(false);

    store.set('reviewDoneDate', localYmd());
    const step = getEarlyReadingPlan().steps[0];
    expect(step.done).toBe(true);
    expect(step.detail).toMatch(/saved for tomorrow/);
  });
});
