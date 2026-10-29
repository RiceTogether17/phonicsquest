import { describe, it, expect } from 'vitest';
import { GRAMMAR_MCQ_ITEMS } from '../data/grammarMcq.js';
import { GRAMMAR_TIPS } from '../data/grammarTips.js';

// Children and parents read /j/ as the letter j. Grammar text must name
// sounds with plain spellings ("a you sound", "the u in up") instead.
const PHONETIC_SYMBOL = /[ʌʊɒɛɪəæɔʃʒθðŋːɑɜ]|\/[a-z]\//;

function textsOf(item) {
  return [item.q, item.explain, ...Object.values(item.optionExplanations || {})].filter(Boolean);
}

describe('grammar text uses plain sound spellings', () => {
  it('no grammar MCQ question or explanation uses phonetic symbols', () => {
    const bad = [];
    for (const items of Object.values(GRAMMAR_MCQ_ITEMS)) {
      for (const item of items) {
        for (const text of textsOf(item)) {
          if (PHONETIC_SYMBOL.test(text)) bad.push(text);
        }
      }
    }
    expect([...new Set(bad)]).toEqual([]);
  });

  it('the a/an tip warns about words whose first letter misleads', () => {
    const { rule, example, tip } = GRAMMAR_TIPS.articles;
    expect(rule).not.toMatch(/a, e, i, o, u/);
    expect(`${example} ${tip}`).toMatch(/useful/);
    expect(`${example} ${tip}`).toMatch(/hour/);
  });
});
