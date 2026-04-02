import { describe, it, expect } from 'vitest';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';
import { PAPER_MODE_PLAYLISTS, PAPER_LEVELS } from '../data/paperPlaylists.js';

describe('exam-format data scaffolds', () => {
  it('has grammar MCQ banks for P1-P6', () => {
    for (const level of GRAMMAR_MCQ_LEVELS) {
      expect(Array.isArray(GRAMMAR_MCQ_ITEMS[level])).toBe(true);
      expect(GRAMMAR_MCQ_ITEMS[level].length).toBeGreaterThanOrEqual(3);
    }
  });

  it('has vocabulary MCQ banks for P1-P6', () => {
    for (const level of VOCAB_MCQ_LEVELS) {
      expect(Array.isArray(VOCAB_MCQ_ITEMS[level])).toBe(true);
      expect(VOCAB_MCQ_ITEMS[level].length).toBeGreaterThanOrEqual(3);
    }
  });

  it('paper playlists include MCQ sections for each level', () => {
    for (const level of PAPER_LEVELS) {
      const playlist = PAPER_MODE_PLAYLISTS[level] || [];
      expect(playlist).toContain('grammar-mcq');
      expect(playlist).toContain('vocab-mcq');
      expect(playlist.some(s => s.startsWith('sentence-forge-'))).toBe(true);
    }
  });
});
