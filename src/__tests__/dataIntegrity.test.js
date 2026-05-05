import { describe, it, expect } from 'vitest';
import { PAPER_MODE_PLAYLISTS, PAPER_SECTION_LABELS } from '../data/paperPlaylists.js';
import { VOCAB_CATEGORIES, vocabPassages } from '../data/vocabPassages.js';
import { passages as clozePassages } from '../data/passages.js';

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

/**
 * Sufficiency targets for Cloze Castle (Grammar Cloze).
 *
 * Each entry pins a minimum passage count for one (level × category) cell.
 * The list grows as content-fill chunks land — this is the regression guard
 * that prevents accidental deletion / refactoring from re-thinning a cell.
 *
 * Target = 6 passages per in-scope cell (≈18–30 attempt opportunities once
 * every passage's blanks are counted).
 */
const CLOZE_SUFFICIENCY_TARGETS = [
  // Chunk 1a — connectors P2 & P3 (subordination + sequence)
  { level: 'P2', category: 'connectors', min: 6 },
  { level: 'P3', category: 'connectors', min: 6 },
  // Chunk 1b — prepositions P2/P4 + tenseAwareness P3
  { level: 'P2', category: 'prepositions', min: 6 },
  { level: 'P3', category: 'tenseAwareness', min: 6 },
  { level: 'P4', category: 'prepositions', min: 6 },
  // Chunk 1c — conjunctions P4 + comparatives P2/P5
  { level: 'P4', category: 'conjunctions', min: 6 },
  { level: 'P2', category: 'comparatives', min: 6 },
  { level: 'P5', category: 'comparatives', min: 6 },
  // Chunk 1d — quantifiers P3 + relativeClauses P4 + inversion P6
  { level: 'P3', category: 'quantifiers', min: 6 },
  { level: 'P4', category: 'relativeClauses', min: 6 },
  { level: 'P6', category: 'inversion', min: 6 },
  // Chunk 2a — articles P2 (specific vs general; previously empty)
  { level: 'P2', category: 'articles', min: 6 },
  // Chunk 2b — articles P3 (zero article in context; previously empty)
  { level: 'P3', category: 'articles', min: 6 },
  // Chunk 2c — articles P4 (the + superlative/ordinal; previously empty)
  { level: 'P4', category: 'articles', min: 6 },
  // Chunk 2d — articles P5 (formal writing register; previously empty)
  { level: 'P5', category: 'articles', min: 6 },
  // Chunk 2e — articles P6 (precision in complex texts; previously empty)
  { level: 'P6', category: 'articles', min: 6 },
  // Chunk 3a — simplePast P3 (paragraph consistency; previously empty)
  { level: 'P3', category: 'simplePast', min: 6 },
  // Chunk 3b — simplePast P4 (contrast with past continuous; previously empty)
  { level: 'P4', category: 'simplePast', min: 6 },
  // Chunk 3c — simplePast P5 (complex subordinated clauses; previously empty)
  { level: 'P5', category: 'simplePast', min: 6 },
  // Chunk 3d — simplePast P6 (advanced tense control with past perfect + reported speech; previously empty)
  { level: 'P6', category: 'simplePast', min: 6 },
  // Chunk 4a — connectors P4 (if / unless / although; previously empty)
  { level: 'P4', category: 'connectors', min: 6 },
  // Chunk 4b — connectors P5 (despite / even though / not only…but also; previously empty)
  { level: 'P5', category: 'connectors', min: 6 },
  // Chunk 4c — connectors P6 (formal: consequently / furthermore / nevertheless / however; previously empty)
  { level: 'P6', category: 'connectors', min: 6 },
];

describe('Cloze Castle passage sufficiency', () => {
  for (const { level, category, min } of CLOZE_SUFFICIENCY_TARGETS) {
    it(`${category} at ${level} has at least ${min} passages`, () => {
      const cell = clozePassages?.[level]?.[category];
      const count = Array.isArray(cell) ? cell.length : 0;
      expect(count, `${category}/${level} has only ${count} passage(s); target is ${min}`).toBeGreaterThanOrEqual(min);
    });
  }
});
