import { describe, it, expect } from 'vitest';
import {
  P1_PRACTICE_TESTS,
  P1_PRACTICE_TEST_TERMS,
  getP1PracticeTest,
  getP1PracticeTests,
  validateP1PracticeTests,
} from '../data/p1PracticeTests.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';
import { buildPlaceholderHtml, PRIMARY_PLACEHOLDER_KINDS } from '../modes/primaryPlaceholders.js';

describe('P1 Practice Test data bank', () => {
  it('exposes all four terms', () => {
    expect(P1_PRACTICE_TEST_TERMS).toEqual(['T1', 'T2', 'T3', 'T4']);
    for (const term of P1_PRACTICE_TEST_TERMS) {
      const test = P1_PRACTICE_TESTS[term];
      expect(test, `${term} missing`).toBeTruthy();
      expect(test.level).toBe('P1');
      expect(test.term).toBe(term);
    }
  });

  it('passes structural validation (sections, marks, blanks, answers)', () => {
    const issues = validateP1PracticeTests();
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('keeps the documented term-1 and term-2 mark total of 30', () => {
    expect(getP1PracticeTest('T1').totalMarks).toBe(30);
    expect(getP1PracticeTest('T2').totalMarks).toBe(30);
  });

  it('keeps the documented term-3 and term-4 mark total of 35 (adds Editing)', () => {
    expect(getP1PracticeTest('T3').totalMarks).toBe(35);
    expect(getP1PracticeTest('T4').totalMarks).toBe(35);
    expect(getP1PracticeTest('T3').sectionF).toBeTruthy();
    expect(getP1PracticeTest('T4').sectionF).toBeTruthy();
    expect(getP1PracticeTest('T1').sectionF).toBeUndefined();
    expect(getP1PracticeTest('T2').sectionF).toBeUndefined();
  });

  it('uses grammar skills already registered in the spine', () => {
    for (const test of getP1PracticeTests()) {
      for (const item of test.sectionA.items) {
        if (!item.skill) continue;
        expect(
          GRAMMAR_CATEGORIES[item.skill],
          `T${test.term}/A skill "${item.skill}" not in GRAMMAR_CATEGORIES`,
        ).toBeTruthy();
      }
    }
  });

  it('uses vocab skills already registered in the spine', () => {
    for (const test of getP1PracticeTests()) {
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
    expect(getP1PracticeTest('T1').sectionA.items.length).toBe(5);
    expect(getP1PracticeTest('NOPE')).toBeNull();
    expect(getP1PracticeTests().length).toBe(4);
  });
});

describe('P1 Practice Test launcher', () => {
  it('registers p1-practice-tests as a valid placeholder kind', () => {
    expect(PRIMARY_PLACEHOLDER_KINDS).toContain('p1-practice-tests');
  });

  it('renders a launcher card for every paper with a Start button', () => {
    const html = buildPlaceholderHtml('p1-practice-tests');
    expect(html).toContain('Primary 1 Practice Tests');
    for (const term of P1_PRACTICE_TEST_TERMS) {
      const test = P1_PRACTICE_TESTS[term];
      expect(html).toContain(test.label);
      expect(html).toContain(`data-start-paper="${test.id}"`);
    }
    // The launcher no longer ships static answers — those live in the
    // interactive game mode now.
    expect(html).not.toContain('Show answer');
  });
});
