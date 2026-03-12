import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/modules/store.js';
import { getVocabularyCategoryReport, getGrammarCategoryReport, getLatestQuestScoreboards } from '../src/modules/reporting.js';

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
    const sci = rows.find(r => r.key === 'scienceTechTerms');
    expect(sci).toBeTruthy();
    expect(sci.loCode).toMatch(/^LO-/);
    expect(sci.clueSuccess).toBeGreaterThan(0);
  });

  it('returns scoreboard snapshots for key quests', () => {
    const rows = getLatestQuestScoreboards();
    expect(rows.map(r => r.quest)).toEqual(['sentenceForge', 'clozeCastle', 'wordVault']);
  });

  it('returns grammar rows', () => {
    const rows = getGrammarCategoryReport();
    expect(rows.find(r => r.key === 'conditionals')).toBeTruthy();
  });
});
