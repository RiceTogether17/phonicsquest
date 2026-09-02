import { describe, it, expect } from 'vitest';
import {
  P4_PRACTICE_TESTS,
  P4_PRACTICE_TEST_TERMS,
  getP4PracticeTest,
  getP4PracticeTests,
  validateP4PracticeTests,
} from '../data/p4PracticeTests.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';
import { buildPlaceholderHtml, PRIMARY_PLACEHOLDER_KINDS } from '../modes/primaryPlaceholders.js';

describe('P4 Practice Test data bank', () => {
  it('exposes all four terms with the right level', () => {
    expect(P4_PRACTICE_TEST_TERMS).toEqual(['T1', 'T2', 'T3', 'T4']);
    for (const term of P4_PRACTICE_TEST_TERMS) {
      const test = P4_PRACTICE_TESTS[term];
      expect(test, `${term} missing`).toBeTruthy();
      expect(test.level).toBe('P4');
      expect(test.term).toBe(term);
    }
  });

  it('passes structural validation', () => {
    const issues = validateP4PracticeTests();
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('all papers have 55 total marks', () => {
    for (const term of P4_PRACTICE_TEST_TERMS) {
      expect(getP4PracticeTest(term).totalMarks).toBe(55);
    }
  });

  it('every paper has 10 grammar MCQ items in section A', () => {
    for (const test of getP4PracticeTests()) {
      expect(test.sectionA.items.length).toBe(10);
    }
  });

  it('every paper has 5 vocabulary MCQ items in section B', () => {
    for (const test of getP4PracticeTests()) {
      expect(test.sectionB.items.length).toBe(5);
    }
  });

  it('every paper has a synthesis section (F) with items that have stems', () => {
    for (const test of getP4PracticeTests()) {
      const synth = test.sectionF;
      expect(synth, 'sectionF missing').toBeTruthy();
      expect(Array.isArray(synth.items)).toBe(true);
      for (const item of synth.items) {
        expect(typeof item.stem).toBe('string');
        expect(item.answer).toBeTruthy();
      }
    }
  });

  it('every paper has a comprehension section with a passage', () => {
    for (const test of getP4PracticeTests()) {
      const compKey = Object.keys(test).find((k) => test[k]?.passage);
      expect(compKey, 'no comprehension section').toBeTruthy();
    }
  });

  it('grammar MCQ answers are among the 4 choices', () => {
    for (const test of getP4PracticeTests()) {
      for (const item of test.sectionA.items) {
        expect(item.choices.length).toBe(4);
        expect(item.choices, `answer "${item.answer}" not in choices`).toContain(item.answer);
        expect(new Set(item.choices).size).toBe(4);
      }
    }
  });

  it('registered grammar skills are in GRAMMAR_CATEGORIES', () => {
    for (const test of getP4PracticeTests()) {
      for (const item of test.sectionA.items) {
        if (!item.skill) continue;
        expect(
          GRAMMAR_CATEGORIES[item.skill],
          `T${test.term}/A skill "${item.skill}" not in GRAMMAR_CATEGORIES`,
        ).toBeTruthy();
      }
    }
  });

  it('registered vocab skills are in VOCAB_CATEGORIES', () => {
    for (const test of getP4PracticeTests()) {
      for (const item of test.sectionB.items) {
        if (!item.skill) continue;
        expect(
          VOCAB_CATEGORIES[item.skill],
          `T${test.term}/B skill "${item.skill}" not in VOCAB_CATEGORIES`,
        ).toBeTruthy();
      }
    }
  });

  it('lookup helpers return clean data', () => {
    expect(getP4PracticeTest('T1').sectionA.items.length).toBe(10);
    expect(getP4PracticeTest('NOPE')).toBeNull();
    expect(getP4PracticeTests().length).toBe(4);
  });
});

describe('P4 Practice Test launcher', () => {
  it('registers p4-practice-tests as a valid placeholder kind', () => {
    expect(PRIMARY_PLACEHOLDER_KINDS).toContain('p4-practice-tests');
  });

  it('renders a launcher card for every paper with a Start button', () => {
    const html = buildPlaceholderHtml('p4-practice-tests');
    expect(html).toContain('P4');
    for (const term of P4_PRACTICE_TEST_TERMS) {
      const test = P4_PRACTICE_TESTS[term];
      expect(html).toContain(test.label);
      expect(html).toContain(`data-start-paper="${test.id}"`);
    }
  });
});
