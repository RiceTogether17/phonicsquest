/**
 * Every early sight word says what is tricky about it (VALIDITY_ROADMAP 1.3).
 */
import { describe, expect, it } from 'vitest';
import { SIGHT_QUESTS } from '../data/sightwords.js';
import { SIGHT_WORD_CODE, getSightWordCode } from '../data/sightWordCode.js';
import { TRICKY_WORDS } from '../data/trickyWords.js';

const readingWords = [
  ...new Set(SIGHT_QUESTS.filter((q) => q.tier !== 'hard').flatMap((q) => q.words)),
];

describe('sight word code', () => {
  it('describes every easy and medium sight word', () => {
    expect(readingWords.filter((w) => !getSightWordCode(w))).toEqual([]);
  });

  it('describes nothing that is not in the bank', () => {
    const bank = new Set(readingWords.map((w) => w.toLowerCase()));
    expect(Object.keys(SIGHT_WORD_CODE).filter((w) => !bank.has(w))).toEqual([]);
  });

  it('spells each word exactly with its letter groups', () => {
    for (const w of readingWords) {
      const code = getSightWordCode(w);
      expect(code.segments.map((s) => s.text).join(''), w).toBe(w);
    }
  });

  it('every heart word names its tricky part, and only heart words do', () => {
    for (const code of Object.values(SIGHT_WORD_CODE)) {
      const hasTricky = code.segments.some((s) => s.tricky);
      expect(code.category === 'heart', code.word).toBe(hasTricky);
      if (hasTricky) expect(code.note.length, code.word).toBeGreaterThan(8);
      else expect(code.decodableAt, code.word).toBeGreaterThanOrEqual(1);
    }
  });

  it('agrees with the curated tricky-word list', () => {
    for (const t of TRICKY_WORDS) {
      const code = getSightWordCode(t.word);
      if (!code) continue;
      const expected = t.category === 'decodable-soon' ? 'decodable' : 'heart';
      expect(code.category, t.word).toBe(expected);
    }
  });

  it('computes when regular words become decodable from the curriculum order', () => {
    expect(getSightWordCode('it').decodableAt).toBe(1);
    expect(getSightWordCode('then').decodableAt).toBe(4); // th
    expect(getSightWordCode('day').decodableAt).toBe(6); // ay
    expect(getSightWordCode('for').decodableAt).toBe(7); // Bossy R
    expect(getSightWordCode('out').decodableAt).toBe(8); // ou
    expect(getSightWordCode('story').decodableAt).toBe(10); // two beats
  });

  it('most "sight words" are not irregular at all', () => {
    // The point of the reclassification: a child can sound these out once
    // the code is taught, so they should not be drilled as shapes.
    const all = Object.values(SIGHT_WORD_CODE);
    const decodable = all.filter((c) => c.category === 'decodable').length;
    expect(decodable / all.length).toBeGreaterThan(0.5);
  });
});
