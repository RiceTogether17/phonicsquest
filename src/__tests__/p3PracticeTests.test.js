import { describe, it, expect } from 'vitest';
import {
  P3_PRACTICE_TESTS,
  P3_PRACTICE_TEST_TERMS,
  getP3PracticeTest,
  getP3PracticeTests,
  validateP3PracticeTests,
} from '../data/p3PracticeTests.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';
import { buildPlaceholderHtml, PRIMARY_PLACEHOLDER_KINDS } from '../modes/primaryPlaceholders.js';

describe('P3 Practice Test data bank', () => {
  it('exposes all three terms with the right level', () => {
    expect(P3_PRACTICE_TEST_TERMS).toEqual(['T1', 'T2', 'T3']);
    for (const term of P3_PRACTICE_TEST_TERMS) {
      const test = P3_PRACTICE_TESTS[term];
      expect(test, `${term} missing`).toBeTruthy();
      expect(test.level).toBe('P3');
    }
  });

  it('passes structural validation', () => {
    const issues = validateP3PracticeTests();
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('keeps the documented mark totals (40 / 40 / 50)', () => {
    expect(getP3PracticeTest('T1').totalMarks).toBe(40);
    expect(getP3PracticeTest('T2').totalMarks).toBe(40);
    expect(getP3PracticeTest('T3').totalMarks).toBe(50);
  });

  it('T3 adds two new section types: open Comprehension Cloze + a second comprehension passage', () => {
    const t3 = getP3PracticeTest('T3');
    expect(Array.isArray(t3.sectionE.blanks)).toBe(true); // open cloze
    expect(t3.sectionE.blanks.length).toBe(5);
    expect(t3.sectionH.passage).toBeTruthy(); // first comprehension
    expect(t3.sectionI.passage).toBeTruthy(); // second comprehension
  });

  it('every Section A item maps to a registered grammar skill', () => {
    for (const test of getP3PracticeTests()) {
      for (const item of test.sectionA.items) {
        if (!item.skill) continue;
        expect(GRAMMAR_CATEGORIES[item.skill], `${test.term}/A skill "${item.skill}"`).toBeTruthy();
      }
    }
  });

  it('every Section B item maps to a registered vocab skill', () => {
    for (const test of getP3PracticeTests()) {
      for (const item of test.sectionB.items) {
        if (!item.skill) continue;
        expect(VOCAB_CATEGORIES[item.skill], `${test.term}/B skill "${item.skill}"`).toBeTruthy();
      }
    }
  });

  it('exercises the newly registered P3 categories (tagQuestions / phrasalVerbs / compoundIndefinite)', () => {
    const allASkills = getP3PracticeTests().flatMap(t => t.sectionA.items.map(i => i.skill));
    const allBSkills = getP3PracticeTests().flatMap(t => t.sectionB.items.map(i => i.skill));
    expect(allASkills).toContain('tagQuestions');
    expect(allASkills).toContain('compoundIndefinite');
    expect(allBSkills).toContain('phrasalVerbs');
  });

  it('comprehension supports tabular + true-false question types in T3', () => {
    const t3 = getP3PracticeTest('T3');
    const allTypes = [
      ...t3.sectionH.questions.map(q => q.type),
      ...t3.sectionI.questions.map(q => q.type),
    ];
    expect(allTypes).toContain('table');
    expect(allTypes).toContain('true-false');
  });
});

describe('P3 Practice Test launcher', () => {
  it('registers p3-practice-tests as a placeholder kind', () => {
    expect(PRIMARY_PLACEHOLDER_KINDS).toContain('p3-practice-tests');
  });

  it('renders a launcher card with a Start button for each paper', () => {
    const html = buildPlaceholderHtml('p3-practice-tests');
    expect(html).toContain('Primary 3 Practice Tests');
    for (const term of P3_PRACTICE_TEST_TERMS) {
      const test = P3_PRACTICE_TESTS[term];
      expect(html).toContain(test.label);
      expect(html).toContain(`data-start-paper="${test.id}"`);
    }
  });
});
