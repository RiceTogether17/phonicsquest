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

/**
 * A category that serves one seed pool to P1 through P6 is simultaneously too
 * hard for a six-year-old and trivial for a P6 pupil. Every category must
 * band its pool along the spiral.
 */
describe('vocabulary level banding', () => {
  function seedsFor(level, category) {
    return new Set(
      VOCAB_MCQ_ITEMS[level].filter((i) => i.category === category).map((i) => i.seedId),
    );
  }

  it('no category serves the same seeds to P1 and P6', () => {
    const categories = new Set(VOCAB_MCQ_ITEMS.P1.map((i) => i.category));
    const shared = [];
    for (const category of categories) {
      const p1 = seedsFor('P1', category);
      const p6 = seedsFor('P6', category);
      if (!p1.size || !p6.size) continue;
      const overlap = [...p1].filter((s) => p6.has(s)).length;
      if (overlap / p1.size > 0.5) shared.push(`${category}: ${overlap}/${p1.size} shared`);
    }
    expect(shared, shared.join('\n')).toEqual([]);
  });

  it('upper primary tests what a proverb means, not a memorised ending', () => {
    for (const level of ['P5', 'P6']) {
      const items = VOCAB_MCQ_ITEMS[level].filter((i) => i.category === 'proverbsSayings');
      expect(items.length).toBeGreaterThan(0);
      expect(items.every((i) => i.subskill === 'proverb_meaning')).toBe(true);
    }
    // Lower primary still learns the fixed wording first.
    const p1 = VOCAB_MCQ_ITEMS.P1.filter((i) => i.category === 'proverbsSayings');
    expect(p1.every((i) => i.subskill === 'proverb_completion')).toBe(true);
  });

  it('P5/P6 social studies vocabulary is English, not economics jargon', () => {
    // These test knowledge of economics or international law, not the word.
    const JARGON = ['tariff', 'depreciation', 'monetary', 'bloc', 'multilateralism', 'drain'];
    const found = new Set();
    for (const level of ['P5', 'P6']) {
      for (const item of VOCAB_MCQ_ITEMS[level]) {
        if (item.category !== 'socialStudiesVocab') continue;
        if (JARGON.includes(item.answer)) found.add(item.answer);
      }
    }
    expect([...found]).toEqual([]);
  });
});
