import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/modules/store.js';
import {
  getVocabularyCategoryReport,
  getGrammarCategoryReport,
  getLatestQuestScoreboards,
  getMoePriorityRecommendations,
  getLearningFunnelReport,
  getAdaptiveLessonQueue,
} from '../src/modules/reporting.js';

describe('reporting module', () => {
  beforeEach(() => {
    store.reset();
    store.set('questAttempts', [
      { quest: 'wordVault', skill: 'scienceTechTerms', correct: true },
      { quest: 'wordVault', skill: 'scienceTechTerms', correct: false },
      { quest: 'clozeCastle', skill: 'conditionals', correct: true },
      { quest: 'sentenceForge', skill: 'connector_clue', correct: false },
    ]);
    store.set('clueStats', {
      clozeCastle: { attempted: 2, strong: 1, partial: 0, weak: 1 },
      wordVault: { attempted: 4, strong: 2, partial: 1, weak: 1 },
      sentenceForge: { attempted: 0, correct: 0, incorrect: 0 },
      editingQuest: { attempted: 0, correct: 0, incorrect: 0 },
      byType: {},
    });
  });

  it('returns vocabulary rows with LO codes and clue success', () => {
    const rows = getVocabularyCategoryReport();
    const sci = rows.find((r) => r.key === 'scienceTechTerms');
    expect(sci).toBeTruthy();
    expect(sci.loCode).toMatch(/^LO-/);
    expect(sci.clueSuccess).toBeGreaterThan(0);
  });

  it('returns scoreboard snapshots for key quests', () => {
    const rows = getLatestQuestScoreboards();
    expect(rows.map((r) => r.quest)).toEqual(['sentenceForge', 'clozeCastle', 'wordVault']);
  });

  it('returns grammar rows', () => {
    const rows = getGrammarCategoryReport();
    expect(rows.find((r) => r.key === 'conditionals')).toBeTruthy();
  });

  it('returns MOE-priority recommendations weighted by category priority', () => {
    const rec = getMoePriorityRecommendations();
    expect(rec.vocab.length).toBeGreaterThan(0);
    expect(rec.grammar.length).toBeGreaterThan(0);
    expect(rec.grammar[0]).toHaveProperty('priorityScore');
  });

  it('builds 7-day learning funnel metrics from telemetry', () => {
    store.recordLearningEvent({
      eventType: 'quest_attempt',
      quest: 'wordVault',
      skill: 'contextInference',
      correct: true,
      responseMs: 1800,
      level: 'p3',
    });
    store.recordLearningEvent({
      eventType: 'quest_attempt',
      quest: 'clozeCastle',
      skill: 'conditionals',
      correct: false,
      responseMs: 4200,
      level: 'p5',
    });
    const funnel = getLearningFunnelReport({ days: 7 });
    expect(funnel.attempts).toBeGreaterThanOrEqual(2);
    expect(funnel.byQuest.find((q) => q.quest === 'wordVault')?.attempts).toBeGreaterThanOrEqual(1);
    expect(funnel.avgResponseMs).not.toBeNull();
  });

  it('builds adaptive lesson queue with deduped tasks', () => {
    store.recordLearningEvent({
      eventType: 'quest_attempt',
      quest: 'wordVault',
      skill: 'contextInference',
      correct: false,
      responseMs: 5200,
      level: 'p3',
    });
    const queue = getAdaptiveLessonQueue({ limit: 4 });
    expect(queue.length).toBeLessThanOrEqual(4);
    expect(queue.length).toBeGreaterThan(0);
    const uniqueKeys = new Set(queue.map((q) => `${q.quest}:${q.skill}`));
    expect(uniqueKeys.size).toBe(queue.length);
  });
});
