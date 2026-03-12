import { describe, it, expect } from 'vitest';
import { VOCAB_CATEGORIES, vocabPassages } from '../data/vocabPassages.js';

describe('Word Vault category expansion', () => {
  it('includes new VocabMaster-inspired categories with metadata', () => {
    for (const key of ['idiomaticExpressions', 'proverbsSayings', 'scienceTechTerms', 'socialStudiesVocab']) {
      expect(VOCAB_CATEGORIES[key]).toBeTruthy();
      expect(VOCAB_CATEGORIES[key].label.length).toBeGreaterThan(3);
      expect(VOCAB_CATEGORIES[key].icon.length).toBeGreaterThan(0);
      expect(VOCAB_CATEGORIES[key].desc.length).toBeGreaterThan(8);
    }
  });

  it('provides at least 2 passages per level (P3-P6) in each new category', () => {
    const levels = ['p3', 'p4', 'p5', 'p6'];
    for (const key of ['idiomaticExpressions', 'proverbsSayings', 'scienceTechTerms', 'socialStudiesVocab']) {
      for (const lv of levels) {
        expect(vocabPassages[key][lv]?.length || 0).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe('Word Vault clue coverage improvements', () => {
  it('adds clue arrays to targeted context/synonym passages', () => {
    const targets = ['ci-p3-04', 'sc-p4-01', 'sc-p5-02'];

    const all = Object.values(vocabPassages)
      .flatMap(levels => Object.values(levels || {}))
      .flatMap(items => items || []);

    for (const id of targets) {
      const p = all.find(item => item.id === id);
      expect(p, `passage ${id}`).toBeTruthy();
      expect(Array.isArray(p.clues)).toBe(true);
      expect(p.clues.length).toBeGreaterThan(0);
    }
  });
});
