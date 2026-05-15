import { describe, it, expect } from 'vitest';
import {
  P2_PRACTICE_TESTS,
  P2_PRACTICE_TEST_TERMS,
  getP2PracticeTest,
  getP2PracticeTests,
  validateP2PracticeTests,
} from '../data/p2PracticeTests.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';
import { buildPlaceholderHtml, PRIMARY_PLACEHOLDER_KINDS } from '../modes/primaryPlaceholders.js';

describe('P2 Practice Test data bank', () => {
  it('exposes all four terms', () => {
    expect(P2_PRACTICE_TEST_TERMS).toEqual(['T1', 'T2', 'T3', 'T4']);
    for (const term of P2_PRACTICE_TEST_TERMS) {
      const test = P2_PRACTICE_TESTS[term];
      expect(test, `${term} missing`).toBeTruthy();
      expect(test.level).toBe('P2');
      expect(test.term).toBe(term);
    }
  });

  it('passes structural validation (sections, marks, blanks, answers)', () => {
    const issues = validateP2PracticeTests();
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('uses 35-mark total for T1/T2 and 40-mark total for T3/T4 (adds Editing)', () => {
    expect(getP2PracticeTest('T1').totalMarks).toBe(35);
    expect(getP2PracticeTest('T2').totalMarks).toBe(35);
    expect(getP2PracticeTest('T3').totalMarks).toBe(40);
    expect(getP2PracticeTest('T4').totalMarks).toBe(40);
    expect(getP2PracticeTest('T3').sectionG?.paragraph).toBeTruthy();
    expect(getP2PracticeTest('T4').sectionG?.paragraph).toBeTruthy();
  });

  it('every paper has 3 Sentence Combining items (new section vs P1)', () => {
    for (const test of getP2PracticeTests()) {
      expect(test.sectionF, `${test.term} missing sectionF`).toBeTruthy();
      expect(test.sectionF.items.length).toBe(3);
      for (const item of test.sectionF.items) {
        expect(typeof item.connector).toBe('string');
        expect(typeof item.model).toBe('string');
      }
    }
  });

  it('every MCQ item is tagged with a known skill and a known practiseTarget', () => {
    const allowedTargets = ['grammar-mcq', 'vocab-mcq', 'cloze-castle', 'word-vault', 'sentence-forge', 'editing-quest'];
    for (const test of getP2PracticeTests()) {
      for (const item of test.sectionA.items) {
        expect(GRAMMAR_CATEGORIES[item.skill], `${test.term}/A skill "${item.skill}"`).toBeTruthy();
        expect(allowedTargets, `${test.term}/A target`).toContain(item.practiseTarget);
      }
      for (const item of test.sectionB.items) {
        expect(VOCAB_CATEGORIES[item.skill], `${test.term}/B skill "${item.skill}"`).toBeTruthy();
        expect(allowedTargets, `${test.term}/B target`).toContain(item.practiseTarget);
      }
    }
  });

  it('T3 + T4 editing errors cover spelling AND punctuation AND grammar', () => {
    for (const term of ['T3', 'T4']) {
      const errs = P2_PRACTICE_TESTS[term].sectionG.errors;
      const kinds = new Set(errs.map(e => e.kind));
      expect(kinds.has('spelling'),    `${term} editing has no spelling errors`).toBe(true);
      expect(kinds.has('punctuation'), `${term} editing has no punctuation errors`).toBe(true);
      expect(kinds.has('grammar'),     `${term} editing has no grammar errors`).toBe(true);
    }
  });

  it('comprehension is in Section G for T1/T2 and Section H for T3/T4', () => {
    expect(P2_PRACTICE_TESTS.T1.sectionG.passage).toBeTruthy();
    expect(P2_PRACTICE_TESTS.T2.sectionG.passage).toBeTruthy();
    expect(P2_PRACTICE_TESTS.T3.sectionH.passage).toBeTruthy();
    expect(P2_PRACTICE_TESTS.T4.sectionH.passage).toBeTruthy();
  });

  it('lookup helpers return clean data', () => {
    expect(getP2PracticeTest('T1').sectionA.items.length).toBe(5);
    expect(getP2PracticeTest('NOPE')).toBeNull();
    expect(getP2PracticeTests().length).toBe(4);
  });
});

describe('P2 Practice Test renderer', () => {
  it('registers p2-practice-tests as a valid placeholder kind', () => {
    expect(PRIMARY_PLACEHOLDER_KINDS).toContain('p2-practice-tests');
  });

  it('renders the four papers with answer details and Sentence Combining blocks', () => {
    const html = buildPlaceholderHtml('p2-practice-tests');
    expect(html).toContain('Primary 2 Practice Tests');
    for (const term of P2_PRACTICE_TEST_TERMS) {
      expect(html).toContain(P2_PRACTICE_TESTS[term].label);
    }
    expect(html).toContain('Show combined sentence');
    expect(html).toContain('Show corrections');
  });

  it('emits a Practise this skill button for every Section A / B item', () => {
    const html = buildPlaceholderHtml('p2-practice-tests');
    // 4 papers × 10 MCQ items each = 40 practise links minimum
    const practiseLinks = (html.match(/class="ptest-practise"/g) || []).length;
    expect(practiseLinks).toBeGreaterThanOrEqual(40);
    expect(html).toContain('data-related="grammar-mcq"');
    expect(html).toContain('data-related="vocab-mcq"');
  });

  it('labels editing-error kinds (spelling / punctuation / grammar) inline', () => {
    const html = buildPlaceholderHtml('p2-practice-tests');
    expect(html).toContain('ptest-edit-kind');
    expect(html).toMatch(/ptest-edit-kind">spelling/);
    expect(html).toMatch(/ptest-edit-kind">grammar/);
    expect(html).toMatch(/ptest-edit-kind">punctuation/);
  });
});
