import { describe, it, expect } from 'vitest';
import { getSyllableCount, getSyllableBreakdown } from '../modules/syllables.js';
import { WORDS } from '../data/words.js';

/**
 * Spot-tests the syllable heuristic across representative words from
 * each phase. Real bank entries are used so the heuristic stays
 * pinned against actual `graphemes` + `types` shapes.
 */

function findWord(id) {
  const w = WORDS.find((x) => x.id === id);
  if (!w) throw new Error(`Fixture word "${id}" missing from bank`);
  return w;
}

describe('getSyllableCount — Phase 1–8 mono-syllable words', () => {
  it.each([
    ['cat', 1],
    ['hat', 1],
    ['ship', 1],
    ['cake', 1], // CVCe — silent-e should not add a beat
    ['rain', 1],
  ])('counts %s as %i syllable(s)', (id, expected) => {
    const w = WORDS.find((x) => x.id === id);
    if (!w) return; // skip if a phase-fixture is renamed
    expect(getSyllableCount(w)).toBe(expected);
  });
});

describe('getSyllableCount — Phase 9 inflectional suffixes', () => {
  it('running → 2 (root + syllabic -ing)', () => {
    expect(getSyllableCount(findWord('running'))).toBe(2);
  });

  it('jumped → 1 (-ed after voiceless stop is /t/, no syllable)', () => {
    expect(getSyllableCount(findWord('jumped'))).toBe(1);
  });
});

describe('getSyllableCount — Phase 10 morphology', () => {
  it('redo → 2 (prefix re- + root)', () => {
    expect(getSyllableCount(findWord('redo'))).toBe(2);
  });

  it('action → 2 (root + syllabic -tion)', () => {
    expect(getSyllableCount(findWord('action'))).toBe(2);
  });

  it('readable → 3 (read + a + ble)', () => {
    expect(getSyllableCount(findWord('readable'))).toBe(3);
  });
});

describe('getSyllableCount — fallback behaviour', () => {
  it('honours an explicit word.syllables override over the heuristic', () => {
    const overridden = {
      id: 'fixture',
      word: 'whatever',
      graphemes: ['w', 'a'],
      types: ['c', 'sv'],
      syllables: 4,
    };
    expect(getSyllableCount(overridden)).toBe(4);
  });

  it('floors at 1 even for empty word data', () => {
    expect(getSyllableCount({ word: 'x', graphemes: [], types: [] })).toBe(1);
    expect(getSyllableCount(null)).toBe(1);
  });

  it('plain -s plural does not add a syllable', () => {
    const cats = {
      id: 'cats',
      word: 'cats',
      graphemes: ['c', 'a', 't', 's'],
      types: ['c', 'sv', 'c', 'sf'],
    };
    expect(getSyllableCount(cats)).toBe(1);
  });

  it('-es plural / 3sg adds a syllable', () => {
    const buses = {
      id: 'buses',
      word: 'buses',
      graphemes: ['b', 'u', 's', 'es'],
      types: ['c', 'sv', 'c', 'sf'],
    };
    expect(getSyllableCount(buses)).toBe(2);
  });
});

describe('getSyllableBreakdown', () => {
  it('returns the word unchanged for 1-syllable words', () => {
    expect(getSyllableBreakdown(findWord('cat'))).toBe('cat');
  });

  it('joins parts with a hyphen for multi-syllable words', () => {
    const out = getSyllableBreakdown(findWord('running'));
    expect(out).toMatch(/-/);
    expect(out.replace(/-/g, '')).toBe('running');
  });

  it('respects an explicit syllableBreakdown override', () => {
    const w = {
      word: 'donkey',
      graphemes: ['d', 'o', 'n', 'k', 'ey'],
      types: ['c', 'sv', 'c', 'c', 'lv'],
      syllableBreakdown: 'don-key',
    };
    expect(getSyllableBreakdown(w)).toBe('don-key');
  });
});
