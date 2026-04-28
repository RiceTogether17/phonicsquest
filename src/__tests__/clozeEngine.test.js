import { describe, it, expect } from 'vitest';
import { createClozeRound, fillNextBlank } from '../modes/clozeEngine.js';

describe('createClozeRound', () => {
  it('blank count matches passage blanks and fills initialise to null', () => {
    const round = createClozeRound({
      text: 'A ___ B ___ C',
      wordBank: ['x', 'y'],
    });
    expect(round.blankFills).toEqual([null, null]);
    expect(round.blankFills.length).toBe(2);
  });

  it('shuffles word bank but preserves all words', () => {
    const wordBank = ['alpha', 'beta', 'gamma', 'delta'];
    const round = createClozeRound({ text: '___ ___ ___ ___', wordBank });
    expect(round.bankWords).toHaveLength(wordBank.length);
    expect(round.bankWords.map((w) => w.word).sort()).toEqual([...wordBank].sort());
  });
});

describe('fillNextBlank', () => {
  it('fills first empty blank', () => {
    const bankWords = [{ id: 0, word: 'a', used: false }, { id: 1, word: 'b', used: false }];
    const blankFills = [null, null];
    expect(fillNextBlank(bankWords, blankFills, 1)).toBe(true);
    expect(blankFills).toEqual([1, null]);
  });

  it('cannot reuse used word and returns false when full', () => {
    const bankWords = [{ id: 0, word: 'a', used: false }];
    const blankFills = [null];
    expect(fillNextBlank(bankWords, blankFills, 0)).toBe(true);
    expect(fillNextBlank(bankWords, blankFills, 0)).toBe(false);
    expect(fillNextBlank(bankWords, blankFills, 999)).toBe(false);
  });
});
