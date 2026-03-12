import { describe, it, expect } from 'vitest';
import { passages } from '../data/passages.js';

const REQUIRED = [
  'pronouns',
  'svAgreement',
  'perfectContinuousTenses',
  'modals',
  'conditionals',
  'passiveVoice',
  'reportedSpeech',
  'relativeClauses',
];

describe('Cloze Castle grammar expansion coverage', () => {
  it('exposes required grammar categories at every level', () => {
    for (const level of ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']) {
      for (const category of REQUIRED) {
        expect(passages[level][category], `${level}-${category}`).toBeTruthy();
        expect(passages[level][category].length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it('includes clues and grammar notes for generated passages', () => {
    for (const level of ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']) {
      const generated = passages[level].relativeClauses.filter(p => p.id.startsWith(`gm-${level.toLowerCase()}`));
      expect(generated.length).toBeGreaterThanOrEqual(3);
      const sample = generated[0];
      expect(Array.isArray(sample.grammarNotes)).toBe(true);
      expect(sample.grammarNotes.length).toBeGreaterThan(0);
      expect(Array.isArray(sample.clues)).toBe(true);
      expect(sample.clues.length).toBeGreaterThan(0);
    }
  });
});
