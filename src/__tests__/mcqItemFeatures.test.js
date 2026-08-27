import { describe, expect, it } from 'vitest';
import {
  deriveMcqDifficulty,
  deriveClueWords,
  mcqSeedKey,
  normalizeMcqStem,
} from '../data/mcqItemFeatures.js';
import { buildGrammarMcqLevel } from '../data/grammarMcq.js';
import { buildVocabMcqLevel } from '../data/vocabMcq.js';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { getStrandLevel } from '../data/spiralGrammar.js';

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

  it('gives every rendered item its own seed identity', () => {
    // This used to assert the opposite — that seeds were fewer than half the
    // items — because each authored sentence was shipped about six times
    // under different scene-setting wrappers. The banks are deduplicated to
    // their seeds now, so one item means one question.
    const items = buildGrammarMcqLevel('P4');
    const seeds = new Set(items.map((item) => item.seedId));
    expect(items.every((item) => typeof item.seedId === 'string' && item.seedId.length > 3)).toBe(
      true,
    );
    expect(seeds.size).toBe(items.length);
  });

  it('strips the dialogue-completion suffix too', () => {
    expect(
      normalizeMcqStem(
        'Ravi read this sentence aloud, leaving out one word: The dog ___ loudly. Which word is missing?',
      ),
    ).toBe(normalizeMcqStem('The dog ___ loudly.'));
  });
});

/**
 * A strand like Simple Past spans six years of distinct teaching points. If a
 * category has no spiral entry, its rule card can only teach one strand-wide
 * generality for all six levels — which is the thing the spiral exists to fix.
 */
describe('spiral step coverage', () => {
  it('every grammar category the bank serves has a spiral step at every level it serves', () => {
    const gaps = [];
    for (const level of GRAMMAR_MCQ_LEVELS) {
      for (const item of GRAMMAR_MCQ_ITEMS[level]) {
        if (!getStrandLevel(item.category, level)) gaps.push(`${item.category} @ ${level}`);
      }
    }
    expect([...new Set(gaps)], [...new Set(gaps)].join(', ')).toEqual([]);
  });

  it('tags every served item with the step it belongs to', () => {
    const items = buildGrammarMcqLevel('P4');
    expect(items.every((i) => typeof i.spiralLabel === 'string' && i.spiralLabel.length > 0)).toBe(
      true,
    );
  });

  it('a strand teaches a different step at each level, not one rule for six years', () => {
    for (const strand of ['simplePast', 'presentCont', 'quantifiers', 'homophones']) {
      const labels = GRAMMAR_MCQ_LEVELS.map((lv) => getStrandLevel(strand, lv)?.label).filter(
        Boolean,
      );
      expect(labels.length, `${strand} should span several levels`).toBeGreaterThan(2);
      expect(new Set(labels).size, `${strand} repeats a label across levels`).toBe(labels.length);
    }
  });
});
