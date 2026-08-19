import { describe, expect, it } from 'vitest';
import {
  deriveMcqDifficulty,
  deriveClueWords,
  mcqSeedKey,
  normalizeMcqStem,
} from '../data/mcqItemFeatures.js';
import { buildGrammarMcqLevel } from '../data/grammarMcq.js';
import { buildVocabMcqLevel } from '../data/vocabMcq.js';

describe('deriveMcqDifficulty', () => {
  it('rates a minimal-pair choice set harder than unrelated words', () => {
    const base = { q: 'The dog ___ at the postman.', level: 'P5' };
    const easy = deriveMcqDifficulty({
      ...base,
      answer: 'barked',
      choices: ['barked', 'purple', 'yesterday', 'seven'],
    });
    const hard = deriveMcqDifficulty({
      ...base,
      answer: 'was',
      choices: ['was', 'were', 'is', 'are'],
    });
    expect(hard).toBeGreaterThan(easy);
  });

  it('rates multi-sentence stems harder', () => {
    const single = deriveMcqDifficulty({
      q: 'She saw ___ vase.',
      answer: 'a',
      choices: ['a', 'lion', 'happily', 'seven'],
      level: 'P5',
    });
    const multi = deriveMcqDifficulty({
      q: 'Rina had never visited the museum. She saw ___ vase.',
      answer: 'a',
      choices: ['a', 'lion', 'happily', 'seven'],
      level: 'P5',
    });
    expect(multi).toBeGreaterThan(single);
  });

  it('caps P1/P2 at difficulty 2 so Learn mode always has material', () => {
    const value = deriveMcqDifficulty({
      q: 'Rina had never visited the museum before today. She saw ___ vase near the entrance of the gallery hall.',
      answer: 'was',
      choices: ['was', 'were', 'is', 'are'],
      level: 'P1',
    });
    expect(value).toBeLessThanOrEqual(2);
  });

  it('is item-intrinsic: both banks produce the full announced range per band', () => {
    for (const [build, level, max] of [
      [buildGrammarMcqLevel, 'P1', 2],
      [buildGrammarMcqLevel, 'P5', 3],
      [buildVocabMcqLevel, 'P5', 3],
    ]) {
      const items = build(level);
      const values = new Set(items.map((item) => item.difficulty));
      expect(Math.max(...values)).toBeLessThanOrEqual(max);
      expect(values.size).toBeGreaterThan(1);
    }
  });
});

describe('deriveClueWords', () => {
  it('finds time markers a teacher would underline', () => {
    expect(deriveClueWords('Yesterday, I ___ to the library to borrow books.')).toContain(
      'Yesterday',
    );
    expect(deriveClueWords('Tomorrow, our class ___ the heritage gallery.')).toContain('Tomorrow');
    expect(deriveClueWords('We ___ this museum twice, so the layout is familiar to us.')).toEqual(
      [],
    );
  });

  it('finds quantity and comparison signals', () => {
    expect(deriveClueWords('Each of the pupils ___ a form to submit.')).toContain('Each');
    expect(
      deriveClueWords('My bag is lighter than my old one, so it is easier to carry.'),
    ).toContain('than');
  });

  it('returns [] rather than inventing a clue', () => {
    expect(deriveClueWords('The cat licked ___ paw.')).toEqual([]);
  });

  it('feeds clue chips on tense items in the generated grammar bank', () => {
    const items = buildGrammarMcqLevel('P3');
    const tenseItems = items.filter((item) => item.category === 'simplePast');
    expect(
      tenseItems.some((item) => Array.isArray(item.clueWords) && item.clueWords.length > 0),
    ).toBe(true);
  });
});

describe('mcqSeedKey', () => {
  it('sees through wrapper frames and pupil-name swaps', () => {
    const seed = { category: 'pronouns', answer: 'they', q: 'Mei and Ravi were late, so ___ ran.' };
    const framed = {
      ...seed,
      q: 'Fill in the blank in Zara’s sentence: Mei and Ravi were late, so ___ ran.',
    };
    const renamed = {
      ...seed,
      q: 'Help Ben complete this sentence: Siti and Ahmad were late, so ___ ran.',
    };
    expect(mcqSeedKey(framed)).toBe(mcqSeedKey(seed));
    expect(mcqSeedKey(renamed)).toBe(mcqSeedKey(seed));
  });

  it('distinguishes genuinely different seeds', () => {
    const a = mcqSeedKey({ category: 'articles', answer: 'an', q: 'She found ___ umbrella.' });
    const b = mcqSeedKey({ category: 'articles', answer: 'a', q: 'She found ___ pencil.' });
    expect(a).not.toBe(b);
  });

  it('collapses the rendered banks to far fewer seed identities than items', () => {
    const items = buildGrammarMcqLevel('P4');
    const seeds = new Set(items.map((item) => item.seedId));
    expect(items.every((item) => typeof item.seedId === 'string' && item.seedId.length > 3)).toBe(
      true,
    );
    expect(seeds.size).toBeLessThan(items.length / 2);
  });

  it('strips the dialogue-completion suffix too', () => {
    expect(
      normalizeMcqStem(
        'Ravi read this sentence aloud, leaving out one word: The dog ___ loudly. Which word is missing?',
      ),
    ).toBe(normalizeMcqStem('The dog ___ loudly.'));
  });
});
