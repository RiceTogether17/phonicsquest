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
    const allASkills = getP3PracticeTests().flatMap((t) => t.sectionA.items.map((i) => i.skill));
    const allBSkills = getP3PracticeTests().flatMap((t) => t.sectionB.items.map((i) => i.skill));
    expect(allASkills).toContain('tagQuestions');
    expect(allASkills).toContain('compoundIndefinite');
    expect(allBSkills).toContain('phrasalVerbs');
  });

  it('comprehension supports tabular + true-false question types in T3', () => {
    const t3 = getP3PracticeTest('T3');
    const allTypes = [
      ...t3.sectionH.questions.map((q) => q.type),
      ...t3.sectionI.questions.map((q) => q.type),
    ];
    expect(allTypes).toContain('table');
    expect(allTypes).toContain('true-false');
  });
});

describe('P3 editing sections — every blank tests a real error', () => {
  it('no P3 editing item has wrong === correction (no "No change" entries)', () => {
    const offenders = [];
    for (const test of getP3PracticeTests()) {
      const editKey = test.term === 'T3' ? 'sectionG' : 'sectionF';
      const edit = test[editKey];
      if (!edit?.errors) continue;
      for (const e of edit.errors) {
        const w = String(e.wrong ?? '')
          .trim()
          .toLowerCase();
        const c = String(e.correction ?? '')
          .trim()
          .toLowerCase();
        if (w && c && w === c) {
          offenders.push(
            `${test.term}/${editKey} num=${e.num}: "${e.wrong}" === "${e.correction}"`,
          );
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('P3 T1 editing passage uses one consistent friend name throughout', () => {
    // Regression guard: an earlier version introduced the friend under one
    // name ("her friend X") but quoted a different name later in the
    // paragraph. Whatever name follows "her friend" must be the only
    // capitalised name other than the narrator's used in the paragraph.
    const t1 = getP3PracticeTest('T1');
    const paragraph = t1.sectionF.paragraph;
    const m = paragraph.match(/her friend (\w+)/);
    expect(m, 'paragraph should introduce a friend by name').toBeTruthy();
    const friend = m[1];
    // Every later dialogue attribution should use the same friend name.
    const saidNames = [...paragraph.matchAll(/(\w+) said/g)].map((x) => x[1]);
    for (const name of saidNames) {
      if (name !== friend) {
        expect([friend]).toContain(name);
      }
    }
  });

  it('checkEditingErrors validator flags a fake "No change" entry', async () => {
    const { checkEditingErrors } = await import('../data/practiceTestValidators.js');
    const issues = [];
    checkEditingErrors(issues, 'FIXTURE/sectionF', {
      errors: [
        { num: 1, kind: 'grammar', wrong: 'forward', correction: 'forward', explain: 'no change' },
        { num: 2, kind: 'spelling', wrong: 'recieve', correction: 'receive', explain: 'real fix' },
      ],
    });
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/both "forward"/);
  });

  it('checkEditingErrors leaves punctuation blanks (empty wrong) alone', async () => {
    const { checkEditingErrors } = await import('../data/practiceTestValidators.js');
    const issues = [];
    checkEditingErrors(issues, 'FIXTURE/sectionF', {
      errors: [
        { num: 1, kind: 'punctuation', wrong: '', correction: ',', explain: 'missing comma' },
      ],
    });
    expect(issues).toEqual([]);
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

  it('honestly labels the launcher as "3 papers available" and notes T4 is absent', () => {
    const html = buildPlaceholderHtml('p3-practice-tests');
    // Count caption surfaces the exact paper count.
    expect(html).toMatch(/3 papers available/);
    // Intro tells the user T4 is not in the bank — no surprise.
    expect(html.toLowerCase()).toMatch(/no t4|t1.{0,4}t3 only|only terms 1.{0,4}3/i);
  });

  it('upper-primary launchers honestly show 4 papers available', () => {
    for (const kind of ['p4-practice-tests', 'p5-practice-tests', 'p6-practice-tests']) {
      const html = buildPlaceholderHtml(kind);
      expect(html, kind).toMatch(/4 papers available/);
    }
  });
});
