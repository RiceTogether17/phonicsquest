import { describe, it, expect } from 'vitest';
import { PAPER_MODE_PLAYLISTS, PAPER_SECTION_LABELS } from '../data/paperPlaylists.js';
import { VOCAB_CATEGORIES, vocabPassages } from '../data/vocabPassages.js';

describe('Paper Playlist data integrity', () => {
  it('has no duplicate sections within any level playlist', () => {
    for (const [level, sections] of Object.entries(PAPER_MODE_PLAYLISTS)) {
      const unique = new Set(sections);
      expect(unique.size, `${level} has duplicate sections`).toBe(sections.length);
    }
  });

  it('every playlist section key has a label in PAPER_SECTION_LABELS', () => {
    const allKeys = new Set(Object.values(PAPER_MODE_PLAYLISTS).flat());
    for (const key of allKeys) {
      expect(PAPER_SECTION_LABELS[key], `Missing label for section "${key}"`).toBeTruthy();
    }
  });
});

describe('Vocab Passages data integrity', () => {
  it('every vocabPassages category key exists in VOCAB_CATEGORIES', () => {
    for (const key of Object.keys(vocabPassages)) {
      expect(VOCAB_CATEGORIES[key], `Category "${key}" in vocabPassages but not in VOCAB_CATEGORIES`).toBeTruthy();
    }
  });

  it('every VOCAB_CATEGORIES key has at least one passage in vocabPassages', () => {
    for (const key of Object.keys(VOCAB_CATEGORIES)) {
      const catData = vocabPassages[key];
      expect(catData, `Category "${key}" in VOCAB_CATEGORIES but no passages in vocabPassages`).toBeTruthy();
      const levelCount = Object.keys(catData).length;
      expect(levelCount, `Category "${key}" has zero levels`).toBeGreaterThan(0);
    }
  });
});
