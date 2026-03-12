import { describe, it, expect, beforeAll } from 'vitest';
import { allSentences } from '../data/sentences.js';

let getSentenceForgeCategoriesByLevel;
let getScoreboardStats;

beforeAll(async () => {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    cancel: () => {},
    speak: () => {},
  };

  ({ getSentenceForgeCategoriesByLevel, getScoreboardStats } = await import('../modes/sentenceForge.js'));
});

describe('Sentence Forge category coverage', () => {
  it('shows new sentence categories in each level selector bucket', () => {
    const categoryMap = getSentenceForgeCategoriesByLevel(allSentences);
    const required = ['connector_clue', 'comparison_structure', 'modal_order', 'tense_clue', 'preposition_clue'];

    for (let lv = 1; lv <= 6; lv++) {
      for (const key of required) {
        expect(categoryMap[lv]).toContain(key);
      }
    }
  });
});

describe('Sentence Forge scoreboard stats', () => {
  it('returns 3 stars at >=90%', () => {
    expect(getScoreboardStats({ correct: 9, total: 10 })).toEqual({ accuracy: 90, stars: 3 });
  });

  it('returns 2 stars at >=70%', () => {
    expect(getScoreboardStats({ correct: 7, total: 10 })).toEqual({ accuracy: 70, stars: 2 });
  });

  it('returns 1 star below 70%', () => {
    expect(getScoreboardStats({ correct: 5, total: 10 })).toEqual({ accuracy: 50, stars: 1 });
  });
});
