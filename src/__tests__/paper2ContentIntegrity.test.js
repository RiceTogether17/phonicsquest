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
  validateVocabMcqDiscrimination,
} from '../data/paper2Validators.js';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES, VOCAB_MCQ_ONLY_CATEGORIES } from '../data/vocabCategories.js';
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
const MIN_GRAMMAR_MCQ_PER_LEVEL = 150;
const MIN_VOCAB_MCQ_PER_LEVEL   = 150;
const MIN_GRAMMAR_MCQ_CATEGORIES_PER_LEVEL = 8;
const MIN_VOCAB_MCQ_CATEGORIES_PER_LEVEL   = 6;
const MIN_GRAMMAR_PASSAGES_PER_LEVEL = 70;
const BANNED_INTERNAL_LABEL = /(practice set|p1 practice|p2 practice|p3 practice|p4 practice|p5 practice|p6 practice|set 88)/i;

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

  it('grammar MCQ stems are non-empty after normalization', () => {
    for (const level of GRAMMAR_MCQ_LEVELS) {
      for (const item of GRAMMAR_MCQ_ITEMS[level] || []) {
        expect(String(item.q || '').trim().length, `${item.id} has empty stem`).toBeGreaterThan(0);
      }
    }
  });

  it('only uses grammar categories from GRAMMAR_CATEGORIES', () => {
    for (const level of GRAMMAR_MCQ_LEVELS) {
      for (const item of GRAMMAR_MCQ_ITEMS[level] || []) {
        expect(GRAMMAR_CATEGORY_KEYS.has(item.category), `${item.id} uses unknown grammar category ${item.category}`).toBe(true);
      }
    }
  });

  it('contains no internal generation labels in grammar MCQ stems', () => {
    for (const level of GRAMMAR_MCQ_LEVELS) {
      for (const item of GRAMMAR_MCQ_ITEMS[level] || []) {
        expect(BANNED_INTERNAL_LABEL.test(String(item.q || '')), `${item.id} contains banned internal label text`).toBe(false);
      }
    }
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

  it('vocabulary MCQ stems are non-empty after normalization', () => {
    for (const level of VOCAB_MCQ_LEVELS) {
      for (const item of VOCAB_MCQ_ITEMS[level] || []) {
        expect(String(item.q || '').trim().length, `${item.id} has empty stem`).toBeGreaterThan(0);
      }
    }
  });

  it('contains no internal generation labels in vocabulary MCQ stems', () => {
    for (const level of VOCAB_MCQ_LEVELS) {
      for (const item of VOCAB_MCQ_ITEMS[level] || []) {
        expect(BANNED_INTERNAL_LABEL.test(String(item.q || '')), `${item.id} contains banned internal label text`).toBe(false);
      }
    }
  });

  it('only uses vocabulary categories from VOCAB_CATEGORIES', () => {
    for (const level of VOCAB_MCQ_LEVELS) {
      for (const item of VOCAB_MCQ_ITEMS[level] || []) {
        expect(VOCAB_CATEGORY_KEYS.has(item.category), `${item.id} uses unknown vocab category ${item.category}`).toBe(true);
      }
    }
  });

  it('connectorClue items focus on meaning inference, not connector insertion', () => {
    const insertionPattern = /\\b(and|but|so|because|although|however|therefore|unless)\\b\\s*___|___\\s*\\b(and|but|so|because|although|however|therefore|unless)\\b/i;
    for (const level of VOCAB_MCQ_LEVELS) {
      const items = (VOCAB_MCQ_ITEMS[level] || []).filter(item => item.category === 'connectorClue');
      for (const item of items) {
        expect(insertionPattern.test(item.q), `${item.id} appears to test connector insertion instead of vocabulary inference`).toBe(false);
      }
    }
  });

  it('keeps upper-primary meaning-in-context stems sufficiently contextual', () => {
    const contextCats = new Set(['contextInference', 'synonymContrast', 'collocationCloze']);
    const levels = ['P4', 'P5', 'P6'];
    for (const level of levels) {
      const items = (VOCAB_MCQ_ITEMS[level] || []).filter(it => contextCats.has(it.category));
      for (const it of items) {
        const wc = String(it.q || '').trim().split(/\s+/).filter(Boolean).length;
        expect(wc, `${it.id} has too little context in stem`).toBeGreaterThanOrEqual(6);
        expect(String(it.q || '').includes('___'), `${it.id} must retain a cloze slot`).toBe(true);
      }
    }
  });

  it('passes ambiguity-focused discrimination guardrails for upper-primary vocab MCQs', () => {
    const issues = validateVocabMcqDiscrimination(VOCAB_MCQ_ITEMS);
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

  it('every grammar cloze passage has clue support for each blank', () => {
    for (const [level, cats] of Object.entries(passages)) {
      for (const [cat, arr] of Object.entries(cats || {})) {
        for (const p of arr || []) {
          expect(Array.isArray(p.clues), `${p.id} (${level}/${cat}) missing clues`).toBe(true);
          expect(p.clues.length, `${p.id} clues length mismatch`).toBe((p.answers || []).length);
          const blankIndexes = new Set((p.clues || []).map(c => c.blankIndex));
          for (let i = 0; i < (p.answers || []).length; i += 1) {
            expect(blankIndexes.has(i), `${p.id} missing clue for blank ${i}`).toBe(true);
          }
        }
      }
    }
  });

  it('contains no internal generation labels in grammar cloze titles/text', () => {
    for (const [level, cats] of Object.entries(passages)) {
      for (const [cat, arr] of Object.entries(cats || {})) {
        for (const p of arr || []) {
          expect(BANNED_INTERNAL_LABEL.test(String(p.title || '')), `${p.id} (${level}/${cat}) has banned label in title`).toBe(false);
          expect(BANNED_INTERNAL_LABEL.test(String(p.text || '')), `${p.id} (${level}/${cat}) has banned label in text`).toBe(false);
        }
      }
    }
  });
});

describe('Paper 2 content integrity — Vocabulary Cloze passages', () => {
  it('validates structurally (blanks, answers, wordBank, categories)', () => {
    const issues = validateVocabPassages(vocabPassages, VOCAB_CATEGORY_KEYS);
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('passes strict quality + required learning aids checks', () => {
    const issues = validateVocabPassages(vocabPassages, VOCAB_CATEGORY_KEYS, {
      strictQuality: true,
      requireLearningAids: true,
    });
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

  it('all cloze-eligible vocab categories have p1-p6 coverage with at least 12 passages per level', () => {
    const levels = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
    const mcqOnly = new Set(VOCAB_MCQ_ONLY_CATEGORIES);
    for (const category of Object.keys(VOCAB_CATEGORIES)) {
      if (mcqOnly.has(category)) continue; // exercised only through MCQ, no cloze bank
      expect(vocabPassages[category], `${category} missing from vocabPassages`).toBeTruthy();
      for (const lv of levels) {
        const arr = vocabPassages[category]?.[lv] || [];
        expect(arr.length, `${category}/${lv} has ${arr.length} passages`).toBeGreaterThanOrEqual(12);
      }
    }
  });

  it('every vocab passage has complete hints, clues and real definitions for wordBank words', () => {
    const badDefinition = /(a useful word|matches the context|definition unavailable|placeholder|todo|tbd|n\/a)/i;
    const genericHint = /(choose the best word|read carefully|fill in the blank)/i;
    const genericPrompt = /(which word or phrase helps you choose the answer|best clue for this blank)/i;
    for (const [category, levels] of Object.entries(vocabPassages)) {
      for (const [lv, arr] of Object.entries(levels || {})) {
        for (const p of arr || []) {
          expect(Array.isArray(p.hints), `${p.id} (${category}/${lv}) missing hints`).toBe(true);
          expect(p.hints.length, `${p.id} hints length mismatch`).toBe((p.answers || []).length);
          for (const hint of p.hints || []) {
            expect(genericHint.test(String(hint || '')), `${p.id} has generic hint text`).toBe(false);
          }
          expect(Array.isArray(p.clues), `${p.id} (${category}/${lv}) missing clues`).toBe(true);
          expect(p.clues.length, `${p.id} clues length mismatch`).toBe((p.answers || []).length);
          for (const clue of p.clues || []) {
            expect(genericPrompt.test(String(clue?.prompt || '')), `${p.id} has generic clue prompt`).toBe(false);
          }
          expect(p.definitions && typeof p.definitions === 'object', `${p.id} missing definitions`).toBe(true);
          for (const wb of p.wordBank || []) {
            const def = p.definitions[wb];
            expect(typeof def === 'string' && def.trim().length > 0, `${p.id} missing definition for ${wb}`).toBe(true);
            expect(badDefinition.test(def.trim()), `${p.id} has placeholder definition for ${wb}`).toBe(false);
            expect(def.trim().toLowerCase(), `${p.id} definition repeats word for ${wb}`).not.toBe(String(wb).trim().toLowerCase());
          }
        }
      }
    }
  });

  it('contains no internal generation labels in vocab cloze titles/text', () => {
    for (const [category, levels] of Object.entries(vocabPassages)) {
      for (const [lv, arr] of Object.entries(levels || {})) {
        for (const p of arr || []) {
          expect(BANNED_INTERNAL_LABEL.test(String(p.title || '')), `${p.id} (${category}/${lv}) has banned label in title`).toBe(false);
          expect(BANNED_INTERNAL_LABEL.test(String(p.text || '')), `${p.id} (${category}/${lv}) has banned label in text`).toBe(false);
        }
      }
    }
  });
});

describe('Paper 2 coverage report', () => {
  it('prints current category-level coverage for audit visibility', () => {
    const grammarMcqCounts = countMcqCategories(GRAMMAR_MCQ_ITEMS);
    const vocabMcqCounts = countMcqCategories(VOCAB_MCQ_ITEMS);

    const grammarClozeCounts = Object.fromEntries(
      Object.entries(passages).map(([level, cats]) => [
        level,
        Object.fromEntries(Object.entries(cats || {}).map(([cat, arr]) => [cat, (arr || []).length])),
      ]),
    );

    const vocabClozeCounts = Object.fromEntries(
      Object.entries(vocabPassages).map(([cat, levels]) => [
        cat,
        Object.fromEntries(Object.entries(levels || {}).map(([lv, arr]) => [lv, (arr || []).length])),
      ]),
    );

    // eslint-disable-next-line no-console
    console.log('[Coverage] Grammar MCQ by level/category', JSON.stringify(grammarMcqCounts));
    // eslint-disable-next-line no-console
    console.log('[Coverage] Vocab MCQ by level/category', JSON.stringify(vocabMcqCounts));
    // eslint-disable-next-line no-console
    console.log('[Coverage] Grammar Cloze by level/category', JSON.stringify(grammarClozeCounts));
    // eslint-disable-next-line no-console
    console.log('[Coverage] Vocab Cloze by category/level', JSON.stringify(vocabClozeCounts));

    expect(Object.keys(grammarMcqCounts).length).toBeGreaterThan(0);
    expect(Object.keys(vocabMcqCounts).length).toBeGreaterThan(0);
    expect(Object.keys(grammarClozeCounts).length).toBeGreaterThan(0);
    expect(Object.keys(vocabClozeCounts).length).toBeGreaterThan(0);
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

  it('flags non-string explain fields', () => {
    const issues = validateMcqItem({
      id: 'test-explain-type',
      level: 'P3',
      category: 'articles',
      subskill: 'a_an',
      difficulty: 1,
      q: 'She bought ___ orange.',
      choices: ['a', 'an', 'the', 'some'],
      answer: 'an',
      explain: 123,
    }, {
      required: ['id', 'level', 'category', 'subskill', 'difficulty', 'q', 'choices', 'answer', 'explain'],
      knownCategories: GRAMMAR_CATEGORY_KEYS,
      expectedLevel: 'P3',
    });

    expect(issues.some(i => i.includes('explain must be a non-empty string'))).toBe(true);
  });
});

describe('Paper 2 validator guardrails — strict cloze quality checks', () => {
  it('fails strict mode when word banks do not provide enough distractors', () => {
    const issues = validateGrammarPassages({
      P3: {
        svAgreement: [{
          id: 'strict-cloze-1',
          text: 'The girls ___ at home.',
          answers: ['are'],
          wordBank: ['are'],
        }],
      },
    }, GRAMMAR_CATEGORY_KEYS, { strictQuality: true });

    expect(issues.some(i => i.includes('strict quality requires at least 2 distractors in wordBank'))).toBe(true);
    expect(issues.some(i => i.includes('strict quality requires at least 2 non-answer distractors in wordBank'))).toBe(true);
  });

  it('flags duplicate word-bank entries after normalization in strict mode', () => {
    const issues = validateVocabPassages({
      contextInference: {
        p5: [{
          id: 'strict-cloze-2',
          text: 'She felt ___ after the race.',
          answers: ['tired'],
          wordBank: ['tired', ' Tired ', 'rested', 'calm'],
        }],
      },
    }, VOCAB_CATEGORY_KEYS, { strictQuality: true });

    expect(issues.some(i => i.includes('wordBank has duplicate entries after case/space normalization'))).toBe(true);
  });
});
