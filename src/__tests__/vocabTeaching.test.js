/**
 * Vocabulary explanations must TEACH, not restate the answer key.
 *
 * For the fact-based categories, every choice's explanation must be specific
 * to that word (gloss-driven or template-driven) — the generic "does not fit
 * this sentence" fallback is a lexicon gap and fails the build. The answer of
 * every gloss-category item must itself carry a gloss so the word card can
 * teach it on reveal.
 */
import { describe, expect, it } from 'vitest';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';
import { getWordGloss, proverbMeaningFor } from '../data/vocabGlosses.js';

const GLOSS_CATEGORIES = [
  'soundVerbs',
  'movementVerbs',
  'collectiveNouns',
  'bodyPartsAnimals',
  'placeNouns',
  'verbDistinction',
  'emotionAdjectives',
  'phrasalVerbs',
];
const TEMPLATE_CATEGORIES = [
  'proverbsSayings',
  'similes',
  'idiomaticExpressions',
  'scienceTechTerms',
  'socialStudiesVocab',
];

const GENERIC_FALLBACK =
  /does not fit this sentence — the sentence needs|is the choice that fits this sentence/;

function allItems() {
  return VOCAB_MCQ_LEVELS.flatMap((level) => VOCAB_MCQ_ITEMS[level]);
}

describe('vocabulary teaching explanations', () => {
  it('every choice in a gloss category is explained by what the word means', () => {
    const gaps = [];
    for (const item of allItems()) {
      if (!GLOSS_CATEGORIES.includes(item.category)) continue;
      for (const choice of item.choices) {
        const text = item.optionExplanations?.[choice] || '';
        if (!text || GENERIC_FALLBACK.test(text)) gaps.push(`${item.id} "${choice}"`);
      }
    }
    expect([...new Set(gaps)], [...new Set(gaps)].slice(0, 20).join('\n')).toEqual([]);
  });

  it('every gloss-category answer has a gloss for the word card', () => {
    const missing = new Set();
    for (const item of allItems()) {
      if (!GLOSS_CATEGORIES.includes(item.category)) continue;
      if (!getWordGloss(item.answer)) missing.add(item.answer);
    }
    expect([...missing], [...missing].join(', ')).toEqual([]);
  });

  it('template categories never fall back to the generic line', () => {
    const gaps = [];
    for (const item of allItems()) {
      if (!TEMPLATE_CATEGORIES.includes(item.category)) continue;
      for (const choice of item.choices) {
        const text = item.optionExplanations?.[choice] || '';
        if (!text || GENERIC_FALLBACK.test(text)) gaps.push(`${item.id} "${choice}"`);
      }
    }
    expect([...new Set(gaps)], [...new Set(gaps)].slice(0, 20).join('\n')).toEqual([]);
  });

  it('proverb explanations teach the meaning, not just the missing word', () => {
    for (const item of allItems()) {
      if (item.category !== 'proverbsSayings') continue;
      const meaning = proverbMeaningFor(item.q);
      expect(meaning, `no meaning authored for: ${item.q}`).toBeTruthy();
      expect(item.optionExplanations[item.answer]).toContain(meaning);
    }
  });
});
