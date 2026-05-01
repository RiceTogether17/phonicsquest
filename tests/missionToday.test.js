import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/modules/store.js';
import {
  getMissionSteps,
  getMissionSummary,
  getTodaysMission,
  markMissionStepDone,
} from '../src/modules/missionToday.js';

function pad2(n) { return String(n).padStart(2, '0'); }
function ymd(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function attemptAt(date, { quest, skill, correct }) {
  // Mirror the timestamp format used by store.recordQuestAttempt so that
  // dayOf(timestamp) lines up with ymd(now) under the same local timezone.
  const t = new Date(date);
  t.setHours(12, 0, 0, 0);
  return { quest, skill, correct, responseMs: null, level: null, timestamp: t.toISOString() };
}

describe('missionToday', () => {
  const NOW = new Date(2026, 3, 30, 12, 0, 0); // 2026-04-30 noon local
  const YESTERDAY = new Date(2026, 3, 29, 12, 0, 0);

  beforeEach(() => {
    store.reset();
  });

  it('exposes five steps in fixed order', () => {
    const steps = getMissionSteps(NOW);
    expect(steps.map(s => s.id)).toEqual([
      'grammar-cloze',
      'vocab-cloze',
      'comprehension-clue',
      'sentence-correction',
      'yesterday-review',
    ]);
    expect(steps.every(s => typeof s.title === 'string' && s.title.length > 0)).toBe(true);
  });

  it('routes each step to the right module target', () => {
    const steps = getMissionSteps(NOW);
    const byId = Object.fromEntries(steps.map(s => [s.id, s]));
    expect(byId['grammar-cloze'].target).toBe('cloze-castle');
    expect(byId['vocab-cloze'].target).toBe('word-vault');
    expect(byId['comprehension-clue'].target).toBe('comprehension-cloze');
    expect(byId['sentence-correction'].target).toBe('editing-quest');
    // No mistake yet → review step should fall back to grammar-mcq warm-up.
    expect(byId['yesterday-review'].target).toBe('grammar-mcq');
  });

  it('counts today\'s questAttempts toward the matching step', () => {
    store.set('questAttempts', [
      attemptAt(NOW, { quest: 'clozeCastle', skill: 'tense', correct: true }),
      attemptAt(NOW, { quest: 'clozeCastle', skill: 'tense', correct: false }),
      attemptAt(NOW, { quest: 'wordVault', skill: 'connectorClue', correct: true }),
      attemptAt(YESTERDAY, { quest: 'clozeCastle', skill: 'tense', correct: true }),
    ]);
    const steps = getMissionSteps(NOW);
    const grammar = steps.find(s => s.id === 'grammar-cloze');
    const vocab   = steps.find(s => s.id === 'vocab-cloze');
    expect(grammar.count).toBe(2);
    expect(grammar.done).toBe(false);            // goal is 3
    expect(vocab.count).toBe(1);
    expect(vocab.done).toBe(false);
  });

  it('marks a step done when goal is reached', () => {
    store.set('questAttempts', [
      attemptAt(NOW, { quest: 'clozeCastle', skill: 'tense', correct: true }),
      attemptAt(NOW, { quest: 'clozeCastle', skill: 'tense', correct: false }),
      attemptAt(NOW, { quest: 'clozeCastle', skill: 'svAgreement', correct: true }),
      attemptAt(NOW, { quest: 'editingQuest', skill: 'spelling', correct: false }),
    ]);
    const steps = getMissionSteps(NOW);
    const byId = Object.fromEntries(steps.map(s => [s.id, s]));
    expect(byId['grammar-cloze'].done).toBe(true);
    expect(byId['sentence-correction'].count).toBe(1);
    expect(byId['sentence-correction'].done).toBe(true);
  });

  it('picks yesterday\'s wrong attempt for the review step', () => {
    store.set('questAttempts', [
      // Most recent first (matches store.recordQuestAttempt ordering)
      attemptAt(NOW, { quest: 'wordVault', skill: 'synonym', correct: true }),
      attemptAt(YESTERDAY, { quest: 'wordVault', skill: 'connectorClue', correct: false }),
      attemptAt(YESTERDAY, { quest: 'clozeCastle', skill: 'tense', correct: true }),
    ]);
    const steps = getMissionSteps(NOW);
    const review = steps.find(s => s.id === 'yesterday-review');
    expect(review.target).toBe('word-vault');
    expect(review.replaySkill).toBe('connectorClue');
    expect(review.title).toContain('Word Vault');
  });

  it('tick the review step only when the same skill is attempted today', () => {
    store.set('questAttempts', [
      attemptAt(YESTERDAY, { quest: 'wordVault', skill: 'connectorClue', correct: false }),
    ]);
    let steps = getMissionSteps(NOW);
    expect(steps.find(s => s.id === 'yesterday-review').done).toBe(false);

    // Add a same-skill attempt today; review step should now be done.
    store.set('questAttempts', [
      attemptAt(NOW, { quest: 'wordVault', skill: 'connectorClue', correct: true }),
      attemptAt(YESTERDAY, { quest: 'wordVault', skill: 'connectorClue', correct: false }),
    ]);
    steps = getMissionSteps(NOW);
    expect(steps.find(s => s.id === 'yesterday-review').done).toBe(true);
  });

  it('persists today\'s mistake selection across calls', () => {
    store.set('questAttempts', [
      attemptAt(YESTERDAY, { quest: 'clozeCastle', skill: 'tense', correct: false }),
    ]);
    const first  = getTodaysMission(NOW);
    // Mutate questAttempts after generation — selection should be stable.
    store.set('questAttempts', [
      attemptAt(YESTERDAY, { quest: 'editingQuest', skill: 'spelling', correct: false }),
      attemptAt(YESTERDAY, { quest: 'clozeCastle', skill: 'tense', correct: false }),
    ]);
    const second = getTodaysMission(NOW);
    expect(second.mistakeReplay).toEqual(first.mistakeReplay);
    expect(second.mistakeReplay.quest).toBe('clozeCastle');
  });

  it('regenerates the mission on a new day', () => {
    store.set('questAttempts', [
      attemptAt(YESTERDAY, { quest: 'clozeCastle', skill: 'tense', correct: false }),
    ]);
    const first = getTodaysMission(NOW);
    expect(first.date).toBe(ymd(NOW));

    const tomorrow = new Date(2026, 4, 1, 12, 0, 0); // 2026-05-01
    const second = getTodaysMission(tomorrow);
    expect(second.date).toBe(ymd(tomorrow));
  });

  it('markMissionStepDone marks placeholder steps complete', () => {
    let steps = getMissionSteps(NOW);
    expect(steps.find(s => s.id === 'comprehension-clue').done).toBe(false);

    markMissionStepDone('comprehension-clue', NOW);

    steps = getMissionSteps(NOW);
    expect(steps.find(s => s.id === 'comprehension-clue').done).toBe(true);
  });

  it('summary reports done/total and complete flag', () => {
    store.set('questAttempts', [
      attemptAt(NOW, { quest: 'clozeCastle', skill: 'tense', correct: true }),
      attemptAt(NOW, { quest: 'clozeCastle', skill: 'tense', correct: true }),
      attemptAt(NOW, { quest: 'clozeCastle', skill: 'tense', correct: true }),
    ]);
    const summary = getMissionSummary(NOW);
    expect(summary.total).toBe(5);
    expect(summary.done).toBe(1);
    expect(summary.complete).toBe(false);
  });
});
