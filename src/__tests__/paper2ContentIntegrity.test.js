import { describe, it, expect } from 'vitest';
import {
  validateGrammarMcqBank,
  validateVocabMcqBank,
  validateGrammarPassages,
  validateVocabPassages,
  countMcqCategories,
  validatePaperModeConfig,
  validateSpiralGrammarMatrix,
  validateMcqItem,
  validateUniqueMcqPrompts,
} from '../data/paper2Validators.js';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';
import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';
import { PAPER_ITEM_COUNTS, PAPER_LEVELS, PAPER_MODE_PLAYLISTS, PAPER_SECTION_LABELS } from '../data/paperPlaylists.js';
import { SPIRAL_MATRIX } from '../data/spiralGrammar.js';

/**
 * Chunk-1 foundational guardrails for the Paper 2 content banks.
 *
 * These assertions codify the current invariants the paper-mode consumers
 * rely on.  Thresholds are set at or slightly below the present content
 * counts so the tests fail fast if a future chunk accidentally regresses
 * coverage, introduces a duplicate id, or uses an unregistered category.
 *
 * Raise the MIN_* values as later chunks expand the banks.
 */

const GRAMMAR_CATEGORY_KEYS = new Set(Object.keys(GRAMMAR_CATEGORIES));
const VOCAB_CATEGORY_KEYS = new Set(Object.keys(VOCAB_CATEGORIES));

// Baseline minimums (current state) — later chunks should grow these.
const MIN_GRAMMAR_MCQ_PER_LEVEL = 35;
const MIN_VOCAB_MCQ_PER_LEVEL   = 15;
const MIN_GRAMMAR_MCQ_CATEGORIES_PER_LEVEL = 5;
const MIN_VOCAB_MCQ_CATEGORIES_PER_LEVEL   = 4;
const MIN_GRAMMAR_PASSAGES_PER_LEVEL = 30;

describe('Paper 2 content integrity — Grammar MCQ', () => {
  it('validates structurally (no duplicates, choices, blanks, categories)', () => {
    const issues = validateGrammarMcqBank(GRAMMAR_MCQ_ITEMS, GRAMMAR_CATEGORY_KEYS);
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it(`has at least ${MIN_GRAMMAR_MCQ_PER_LEVEL} items at every level`, () => {
    for (const level of GRAMMAR_MCQ_LEVELS) {
      const count = (GRAMMAR_MCQ_ITEMS[level] || []).length;
      expect(count, `${level} has only ${count} items`).toBeGreaterThanOrEqual(MIN_GRAMMAR_MCQ_PER_LEVEL);
    }
  });

  it(`covers at least ${MIN_GRAMMAR_MCQ_CATEGORIES_PER_LEVEL} distinct categories per level`, () => {
    const counts = countMcqCategories(GRAMMAR_MCQ_ITEMS);
    for (const level of GRAMMAR_MCQ_LEVELS) {
      const cats = Object.keys(counts[level] || {});
      expect(cats.length, `${level} only covers ${cats.join(',')}`).toBeGreaterThanOrEqual(MIN_GRAMMAR_MCQ_CATEGORIES_PER_LEVEL);
    }
  });

  it('does not contain duplicate grammar MCQ prompts after normalization', () => {
    const issues = validateUniqueMcqPrompts(GRAMMAR_MCQ_ITEMS, 'Grammar MCQ');
    expect(issues, issues.join('\n')).toEqual([]);
  });
});

describe('Paper 2 content integrity — Vocabulary MCQ', () => {
  it('validates structurally (no duplicates, choices, blanks, categories)', () => {
    const issues = validateVocabMcqBank(VOCAB_MCQ_ITEMS, VOCAB_CATEGORY_KEYS);
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it(`has at least ${MIN_VOCAB_MCQ_PER_LEVEL} items at every level`, () => {
    for (const level of VOCAB_MCQ_LEVELS) {
      const count = (VOCAB_MCQ_ITEMS[level] || []).length;
      expect(count, `${level} has only ${count} items`).toBeGreaterThanOrEqual(MIN_VOCAB_MCQ_PER_LEVEL);
    }
  });

  it(`covers at least ${MIN_VOCAB_MCQ_CATEGORIES_PER_LEVEL} distinct categories per level`, () => {
    const counts = countMcqCategories(VOCAB_MCQ_ITEMS);
    for (const level of VOCAB_MCQ_LEVELS) {
      const cats = Object.keys(counts[level] || {});
      expect(cats.length, `${level} only covers ${cats.join(',')}`).toBeGreaterThanOrEqual(MIN_VOCAB_MCQ_CATEGORIES_PER_LEVEL);
    }
  });

  it('does not contain duplicate vocabulary MCQ prompts after normalization', () => {
    const issues = validateUniqueMcqPrompts(VOCAB_MCQ_ITEMS, 'Vocab MCQ');
    expect(issues, issues.join('\n')).toEqual([]);
  });
});

describe('Paper 2 content integrity — Grammar Cloze passages', () => {
  it('validates structurally (blanks, answers, wordBank, categories)', () => {
    const issues = validateGrammarPassages(passages, GRAMMAR_CATEGORY_KEYS);
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it(`has at least ${MIN_GRAMMAR_PASSAGES_PER_LEVEL} passages per level`, () => {
    for (const level of Object.keys(passages)) {
      const total = Object.values(passages[level]).reduce((sum, arr) => sum + (arr?.length || 0), 0);
      expect(total, `${level} only has ${total} passages`).toBeGreaterThanOrEqual(MIN_GRAMMAR_PASSAGES_PER_LEVEL);
    }
  });
});

describe('Paper 2 content integrity — Vocabulary Cloze passages', () => {
  it('validates structurally (blanks, answers, wordBank, categories)', () => {
    const issues = validateVocabPassages(vocabPassages, VOCAB_CATEGORY_KEYS);
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('every category in vocabPassages is registered in VOCAB_CATEGORIES', () => {
    for (const key of Object.keys(vocabPassages)) {
      expect(VOCAB_CATEGORIES[key], `"${key}" in vocabPassages but not in VOCAB_CATEGORIES`).toBeTruthy();
    }
  });

  it('core vocab categories have content at every primary level (p1–p6)', () => {
    const coreCats = ['contextInference', 'definitionMatch', 'synonymContrast', 'collocationCloze', 'grammaticalRole'];
    for (const cat of coreCats) {
      for (const lv of ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']) {
        const arr = vocabPassages[cat]?.[lv];
        expect(Array.isArray(arr) && arr.length > 0, `${cat} missing content at ${lv}`).toBe(true);
      }
    }
  });
});

describe('Paper 2 content integrity — Routing and curriculum contracts', () => {
  it('paper playlists, labels and item caps stay in sync', () => {
    const issues = validatePaperModeConfig({
      levels: PAPER_LEVELS,
      playlists: PAPER_MODE_PLAYLISTS,
      sectionLabels: PAPER_SECTION_LABELS,
      itemCounts: PAPER_ITEM_COUNTS,
    });
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('spiral grammar matrix remains structurally complete for P1-P6', () => {
    const issues = validateSpiralGrammarMatrix(SPIRAL_MATRIX, GRAMMAR_CATEGORY_KEYS);
    expect(issues, issues.join('\n')).toEqual([]);
  });
});

describe('Paper 2 validator guardrails — malformed MCQ detection', () => {
  it('flags duplicate options even when case/spacing differ', () => {
    const issues = validateMcqItem({
      id: 'test-dup',
      level: 'P3',
      category: 'svAgreement',
      subskill: 'is_are',
      difficulty: 1,
      q: 'The boys ___ in class now.',
      choices: ['are', ' Are ', 'is', 'am'],
      answer: 'are',
      explain: 'Plural subject takes are.',
    }, {
      required: ['id', 'level', 'category', 'subskill', 'difficulty', 'q', 'choices', 'answer', 'explain'],
      knownCategories: GRAMMAR_CATEGORY_KEYS,
      expectedLevel: 'P3',
    });

    expect(issues.some(i => i.includes('duplicate choices after case/space normalization'))).toBe(true);
  });

  it('flags non-string answers', () => {
    const issues = validateMcqItem({
      id: 'test-answer-type',
      level: 'P3',
      category: 'articles',
      subskill: 'a_an',
      difficulty: 1,
      q: 'She bought ___ orange.',
      choices: ['a', 'an', 'the', 'some'],
      answer: 123,
      explain: 'Use an before vowel sound.',
    }, {
      required: ['id', 'level', 'category', 'subskill', 'difficulty', 'q', 'choices', 'answer', 'explain'],
      knownCategories: GRAMMAR_CATEGORY_KEYS,
      expectedLevel: 'P3',
    });

    expect(issues.some(i => i.includes('answer must be a non-empty string'))).toBe(true);
  });
});
