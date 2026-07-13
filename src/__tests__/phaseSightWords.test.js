/**
 * Phase-interleaved sight words: every phonics phase carries a small set
 * of high-frequency "tricky" words, in introduction order, and each word
 * is introduced exactly once across the ten phases.
 */
import { describe, expect, it } from 'vitest';
import {
  PHASES,
  getSightWordsForPhase,
  getSightWordsThroughPhase,
} from '../data/curriculum.js';

describe('phase sight words', () => {
  it('every phase carries a non-empty sightWords list', () => {
    for (const phase of PHASES) {
      expect(Array.isArray(phase.sightWords), `phase ${phase.phase}`).toBe(true);
      expect(phase.sightWords.length, `phase ${phase.phase}`).toBeGreaterThan(0);
    }
  });

  it('no sight word is introduced twice', () => {
    const seen = new Map();
    for (const phase of PHASES) {
      for (const word of phase.sightWords) {
        expect(seen.has(word), `"${word}" appears in phase ${seen.get(word)} and ${phase.phase}`).toBe(false);
        seen.set(word, phase.phase);
      }
    }
  });

  it('getSightWordsForPhase returns the phase list', () => {
    expect(getSightWordsForPhase(1)).toContain('the');
    expect(getSightWordsForPhase(99)).toEqual([]);
  });

  it('getSightWordsThroughPhase accumulates in order', () => {
    const through2 = getSightWordsThroughPhase(2);
    expect(through2).toEqual([...getSightWordsForPhase(1), ...getSightWordsForPhase(2)]);
  });
});
