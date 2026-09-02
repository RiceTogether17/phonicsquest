/**
 * Queued-session builders.
 *
 * These decide what a Daily Challenge / Review Lane / Word Workout session
 * contains and what to tell the child about it. The behaviours worth pinning
 * are the ones a child actually feels:
 *
 *   • an empty queue must show a friendly note, never start an empty session
 *   • the review cap must hold, and the deferred remainder must be described
 *     as saved rather than silently dropped
 *   • a re-run Daily Challenge must say it's already claimed, not imply the
 *     session didn't count
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
}

const fakeWords = (n) => Array.from({ length: n }, (_, i) => ({ id: `w${i}`, word: `w${i}` }));

let starters, progressMod;
beforeEach(async () => {
  stubAudioGlobals();
  localStorage.clear();
  vi.resetModules();
  starters = await import('../modules/sessionStarters.js');
  progressMod = await import('../modules/progress.js');
});

describe('daily challenge', () => {
  it('queues the seeded word set with a go message', () => {
    const session = starters.buildDailyChallengeSession();
    expect(session.ok).toBe(true);
    expect(session.words.length).toBeGreaterThan(0);
    expect(session.message).toMatch(/go!/i);
  });

  it('declines gracefully when no set is available', async () => {
    vi.resetModules();
    vi.doMock('../modules/dailyChallenge.js', () => ({
      getDailyChallengeWords: () => [],
      isDailyChallengeComplete: () => false,
      completeDailyChallenge: () => 0,
      DAILY_BONUS_XP: 50,
    }));
    const mod = await import('../modules/sessionStarters.js');

    const session = mod.buildDailyChallengeSession();
    expect(session.ok).toBe(false);
    expect(session.message).toMatch(/try again tomorrow/i);
    expect(session.words).toBeUndefined();
    vi.doUnmock('../modules/dailyChallenge.js');
  });
});

describe('review lane', () => {
  it('refuses to start an empty session and says why', () => {
    vi.spyOn(progressMod.progress, 'getReviewDueWords').mockReturnValue([]);
    vi.spyOn(progressMod.progress, 'getReviewDueCount').mockReturnValue(0);

    const session = starters.buildReviewSession(null);
    expect(session.ok).toBe(false);
    expect(session.message).toMatch(/all caught up/i);
    expect(session.words).toBeUndefined();
  });

  it('queues the due words with a count', () => {
    vi.spyOn(progressMod.progress, 'getReviewDueWords').mockReturnValue(fakeWords(4));
    vi.spyOn(progressMod.progress, 'getReviewDueCount').mockReturnValue(4);

    const session = starters.buildReviewSession(null);
    expect(session.ok).toBe(true);
    expect(session.words).toHaveLength(4);
    expect(session.message).toContain('4 words');
  });

  it('uses the singular for one due word', () => {
    vi.spyOn(progressMod.progress, 'getReviewDueWords').mockReturnValue(fakeWords(1));
    vi.spyOn(progressMod.progress, 'getReviewDueCount').mockReturnValue(1);

    expect(starters.buildReviewSession(null).message).toContain('1 word ');
  });

  it('describes the capped remainder as saved, not dropped', () => {
    // 10 served out of 25 due — the child must know the other 15 are safe.
    vi.spyOn(progressMod.progress, 'getReviewDueWords').mockReturnValue(fakeWords(10));
    vi.spyOn(progressMod.progress, 'getReviewDueCount').mockReturnValue(25);

    const session = starters.buildReviewSession(null);
    expect(session.message).toContain('15 more saved for tomorrow');
  });

  it('says nothing about overflow when everything fits', () => {
    vi.spyOn(progressMod.progress, 'getReviewDueWords').mockReturnValue(fakeWords(6));
    vi.spyOn(progressMod.progress, 'getReviewDueCount').mockReturnValue(6);

    expect(starters.buildReviewSession(null).message).not.toMatch(/saved for tomorrow/);
  });

  it('applies the band cap when asking for due words', () => {
    const spy = vi.spyOn(progressMod.progress, 'getReviewDueWords').mockReturnValue(fakeWords(3));
    vi.spyOn(progressMod.progress, 'getReviewDueCount').mockReturnValue(3);

    // A P4 profile gets the older-band cap; a preschooler the younger one.
    starters.buildReviewSession({ primaryGrade: 'P4' });
    const olderCap = spy.mock.calls[0][0].cap;
    starters.buildReviewSession({ primaryGrade: null, schoolLevel: 'preschool' });
    const youngCap = spy.mock.calls[1][0].cap;

    expect(olderCap).toBeGreaterThan(youngCap);
  });
});

describe('word workout', () => {
  it('falls back to the most overdue review word', () => {
    const spy = vi.spyOn(progressMod.progress, 'getReviewDueWords').mockReturnValue([
      {
        id: 'cat',
        word: 'cat',
        graphemes: ['c', 'a', 't'],
        types: ['c', 'sv', 'c'],
        phonemes: ['/c/', '/a/', '/t/'],
      },
    ]);

    const session = starters.buildWordWorkoutSession();
    expect(spy).toHaveBeenCalledWith({ cap: 1 });
    expect(session.ok).toBe(true);
    expect(session.word.word).toBe('cat');
    expect(session.rounds.length).toBeGreaterThan(0);
    expect(session.message).toContain('cat');
  });

  it('declines with a pointer to Review Lane when nothing is due', () => {
    vi.spyOn(progressMod.progress, 'getReviewDueWords').mockReturnValue([]);

    const session = starters.buildWordWorkoutSession();
    expect(session.ok).toBe(false);
    expect(session.message).toMatch(/review lane/i);
  });

  it('declines when the word has no workout ladder', async () => {
    vi.resetModules();
    vi.doMock('../modules/wordWorkout.js', () => ({ buildWordWorkout: () => [] }));
    const mod = await import('../modules/sessionStarters.js');

    const session = mod.buildWordWorkoutSession({ id: 'x', word: 'x' });
    expect(session.ok).toBe(false);
    expect(session.message).toMatch(/workout ladder/i);
    expect(session.rounds).toBeUndefined();
    vi.doUnmock('../modules/wordWorkout.js');
  });
});

describe('completion feedback', () => {
  it('celebrates a first Daily Challenge completion with its bonus', () => {
    const f = starters.completionFeedback('dailyChallenge', { bonusXp: 50 });
    expect(f.message).toContain('+50 bonus XP');
    expect(f.celebrate).toBe(true);
    expect(f.sfx).toBe('levelUp');
    expect(f.tone).toBe('success');
  });

  it('says already-claimed rather than implying it did not count', () => {
    const f = starters.completionFeedback('dailyChallenge', { bonusXp: 0 });
    expect(f.message).toMatch(/already claimed/i);
    expect(f.celebrate).toBe(false);
    expect(f.sfx).toBeNull();
  });

  it('acknowledges a finished review session', () => {
    const f = starters.completionFeedback('review');
    expect(f.message).toMatch(/review session complete/i);
    expect(f.sfx).toBe('correct');
  });

  it('names the word a workout covered', () => {
    const f = starters.completionFeedback('wordWorkout', { workoutWord: 'splash' });
    expect(f.message).toContain('splash');
  });

  it('falls back gracefully when the workout word is unknown', () => {
    const f = starters.completionFeedback('wordWorkout', {});
    expect(f.message).toContain('that word');
    expect(f.message).not.toContain('undefined');
  });

  it('returns null for an ordinary session', () => {
    expect(starters.completionFeedback('normal')).toBeNull();
    expect(starters.completionFeedback('anything-else')).toBeNull();
  });
});
