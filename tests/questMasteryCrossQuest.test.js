import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/modules/store.js';
import { questMastery } from '../src/modules/questMastery.js';

describe('questMastery cross-quest recommendations', () => {
  beforeEach(() => {
    store.reset();
    store.set('questMastery', {
      sentenceForge: { connector_clue: 0.75 },
      clozeCastle: { conditionals: 0.7, relativeClauses: 0.9 },
      wordVault: { connectorClue: 0.2, synonymContrast: 0.8 },
      stories: {}, editingQuest: {}, writingQuest: {},
    });
  });

  it('blends related skills across quests for unified score', () => {
    const score = questMastery.getUnifiedSkillScore('connector_clue', 'clozeCastle');
    expect(score).toBeLessThan(0.6);
  });

  it('recommends the globally weakest skill alias', () => {
    const rec = questMastery.getRecommendedSkill('clozeCastle', ['conditionals', 'relativeClauses']);
    expect(rec).toBe('conditionals');
  });
});
