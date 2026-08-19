import { describe, expect, it } from 'vitest';
import { buildGrammarMcqLevel } from '../data/grammarMcq.js';
import { buildVocabMcqLevel } from '../data/vocabMcq.js';

function expectExplanationsForEveryChoice(item) {
  expect(item.optionExplanations, `${item.id} should include option explanations`).toBeTruthy();
  for (const choice of item.choices) {
    expect(item.optionExplanations[choice], `${item.id} should explain ${choice}`).toEqual(
      expect.any(String),
    );
    expect(item.optionExplanations[choice].length).toBeGreaterThan(20);
  }
}

describe('production MCQ option explanations', () => {
  it('adds real per-choice feedback to high-practice grammar categories', () => {
    const items = buildGrammarMcqLevel('P3');
    for (const category of [
      'articles',
      'pronouns',
      'svAgreement',
      'simplePast',
      'presentPerfect',
      'tenseAwareness',
    ]) {
      const item = items.find((candidate) => candidate.category === category);
      expect(item, `${category} item should exist`).toBeTruthy();
      expectExplanationsForEveryChoice(item);
    }
  });

  it('adds real per-choice feedback to core vocabulary categories', () => {
    const items = buildVocabMcqLevel('P4');
    for (const category of ['contextInference', 'collocationCloze']) {
      const item = items.find((candidate) => candidate.category === category);
      expect(item, `${category} item should exist`).toBeTruthy();
      expectExplanationsForEveryChoice(item);
    }
  });
});
