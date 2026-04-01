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

  it('does not auto-unlock grammar quests for weak primary readers when placement says pre-reader', () => {
    const unlock = getQuestUnlockStatus(
      {},
      { schoolLevel: 'primary' },
      undefined,
      { readingBand: 'pre-reader', sentenceReady: false, grammarReady: false, vocabularyReady: false }
    );

    expect(unlock.sentenceForge.unlocked).toBe(false);
    expect(unlock.clozeCastle.unlocked).toBe(false);
    expect(unlock.wordVault.unlocked).toBe(false);
  });

  it('unlocks Sentence Forge for developing readers but keeps grammar gated', () => {
    const unlock = getQuestUnlockStatus(
      {},
      { schoolLevel: 'primary' },
      undefined,
      { readingBand: 'developing-reader', sentenceReady: true, grammarReady: false, vocabularyReady: false }
    );

    expect(unlock.sentenceForge.unlocked).toBe(true);
    expect(unlock.clozeCastle.unlocked).toBe(false);
  });

  it('fully unlocks language quests for reader band', () => {
    const unlock = getQuestUnlockStatus(
      {},
      { schoolLevel: 'preschool' },
      undefined,
      { readingBand: 'reader', sentenceReady: true, grammarReady: true, vocabularyReady: true }
    );

    expect(unlock.sentenceForge.unlocked).toBe(true);
    expect(unlock.clozeCastle.unlocked).toBe(true);
    expect(unlock.wordVault.unlocked).toBe(true);
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
});


describe('blending content filters', () => {
  beforeEach(() => resetState());

  it('excludes high-frequency sight-word group from blending pools', () => {
    const pool = progress.getAdaptivePool(25, {
      group: 'sight-highfreq',
      mode: 'classicBlend',
      maxLevel: 3,
    });

    expect(pool.length).toBeGreaterThan(0);
    expect(pool.every(word => word.group !== 'sight-highfreq' && word.pattern !== 'sight')).toBe(true);
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
