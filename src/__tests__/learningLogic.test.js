import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../modules/store.js';
import { progress } from '../modules/progress.js';
import { gamification } from '../modules/gamification.js';
import { getQuestUnlockStatus } from '../modules/questUnlocks.js';
import { XP_REWARDS } from '../data/curriculum.js';

function resetState() {
  localStorage.clear();
  store.resetStorageKey();
  store.reset();
}

describe('quest unlock logic', () => {
  beforeEach(() => resetState());

  it('unlocks Sentence Forge once 10+ words are mastered', () => {
    const stats = {};
    for (let i = 0; i < 15; i++) {
      stats[`w${i}`] = { attempts: 6, correct: 5 };
    }

    const unlock = getQuestUnlockStatus(stats, { schoolLevel: 'preschool' });

    expect(unlock.mastered).toBe(15);
    expect(unlock.sentenceForge.unlocked).toBe(true);
    expect(unlock.sentenceForge.current).toBe(15);
  });

  it('respects custom mastery policy when computing unlocks', () => {
    const stats = {
      a: { attempts: 5, correct: 4 },
      b: { attempts: 5, correct: 4 },
      c: { attempts: 5, correct: 4 },
      d: { attempts: 5, correct: 4 },
      e: { attempts: 5, correct: 4 },
      f: { attempts: 5, correct: 4 },
      g: { attempts: 5, correct: 4 },
      h: { attempts: 5, correct: 4 },
      i: { attempts: 5, correct: 4 },
      j: { attempts: 5, correct: 4 },
    };

    const unlock = getQuestUnlockStatus(
      stats,
      { schoolLevel: 'preschool' },
      { sentenceForge: 10, clozeCastle: 25, wordVault: 50 },
      { minAttempts: 5, masteryAccuracy: 0.8 },
    );

    expect(unlock.mastered).toBe(10);
    expect(unlock.sentenceForge.unlocked).toBe(true);
  });

});

describe('progress summary', () => {
  beforeEach(() => resetState());

  it('tracks attempts and mastered words after recordAttempt', () => {
    for (let i = 0; i < 6; i++) progress.recordAttempt('cat', true, 'blend');
    for (let i = 0; i < 4; i++) progress.recordAttempt('hat', true, 'blend');

    const summary = progress.getOverallStats();

    expect(summary.totalAttempts).toBe(10);
    expect(summary.wordsAttempted).toBe(2);
    expect(summary.wordsMastered).toBe(1);
  });

  it('uses masteryConfig from store when counting mastered words in summary', () => {
    store.set('masteryConfig', { minAttempts: 4, masteryAccuracy: 0.75 });

    for (let i = 0; i < 4; i++) progress.recordAttempt('cat', true, 'blend');
    for (let i = 0; i < 4; i++) progress.recordAttempt('hat', i < 2, 'blend');

    const summary = progress.getOverallStats();
    expect(summary.wordsMastered).toBe(1);
  });

});

describe('gamification rewards', () => {
  beforeEach(() => resetState());

  it('applies daily-goal bonus XP when goal is reached', () => {
    store.patch({ xp: 0, dailyGoal: 1, dailyDone: 0 });

    const result = gamification.recordCorrect(2500, false);

    expect(result.dailyComplete).toBe(true);
    expect(result.xpEarned).toBe(XP_REWARDS.correct_fast + XP_REWARDS.daily_goal);
    expect(store.get('xp')).toBe(XP_REWARDS.correct_fast + XP_REWARDS.daily_goal);
  });
});
