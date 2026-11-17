/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  P6_PAPER2_TESTS,
  P6_PAPER2_ALIGNMENT,
  getP6Paper2Tests,
  paper2Sections,
  validateP6Paper2Tests,
} from '../data/p6Paper2Tests.js';
import { P6_PRACTICE_TESTS } from '../data/p6PracticeTests.js';
import {
  PSLE_2026_ENGLISH,
  diffAgainstBlueprint,
  certifyAgainstBlueprint,
} from '../data/examBlueprints.js';
import { PLACEHOLDER_META } from '../modes/placeholderMeta.js';
import { buildPlaceholderHtml } from '../modes/primaryPlaceholders.js';
import { mountPracticeTest } from '../modes/primaryPracticeTest.js';

const PAPERS = getP6Paper2Tests();
const SECTION_KEYS = 'ABCDEFGHI'.split('').map((l) => `section${l}`);

describe('P6 Paper 2 layout papers: structure', () => {
  it('has four sound papers', () => {
    expect(PAPERS).toHaveLength(4);
    expect(validateP6Paper2Tests()).toEqual([]);
    expect(new Set(PAPERS.map((p) => p.id)).size).toBe(4);
  });

  it('follows the two-booklet layout: 25 + 65 = 90 marks in 1 h 50 min', () => {
    const paper2 = PSLE_2026_ENGLISH.papers.find((p) => p.name === 'Paper 2');
    for (const p of PAPERS) {
      const marks = paper2Sections(p).map((s) => s.marks);
      expect(marks).toEqual([10, 5, 5, 5, 10, 10, 15, 10, 20]);
      expect(marks.slice(0, 4).reduce((a, b) => a + b)).toBe(25);
      expect(marks.slice(4).reduce((a, b) => a + b)).toBe(65);
      expect(p.totalMarks).toBe(paper2.marks);
      expect(p.duration).toBe(paper2.duration);
    }
  });

  it('agrees with every Paper 2 component the blueprint records', () => {
    const recorded = Object.values(PSLE_2026_ENGLISH.components).filter(
      (c) => c.paper === 'Paper 2',
    );
    expect(recorded.length).toBeGreaterThanOrEqual(4);
    for (const p of PAPERS) {
      const sections = paper2Sections(p);
      const diff = diffAgainstBlueprint({ totalMarks: p.totalMarks, sections });
      expect(diff.markMismatches, p.id).toEqual([]);
      for (const c of recorded) {
        expect(sections.find((s) => s.name === c.name)?.marks, `${p.id} ${c.name}`).toBe(c.marks);
      }
      // Nothing from Paper 2 is missing; only the Paper 1 writing tasks are.
      expect(diff.missing.sort()).toEqual(['Continuous Writing', 'Situational Writing']);
    }
  });

  it('gives ten comprehension questions at two marks each, with no essay question', () => {
    for (const p of PAPERS) {
      const qs = p.sectionI.questions;
      expect(qs).toHaveLength(10);
      expect(qs.every((q) => q.marks === 2)).toBe(true);
      expect(qs.some((q) => q.type === 'personal-response')).toBe(false);
    }
  });

  it('names only people who are in the passage', () => {
    const q = P6_PAPER2_TESTS.T1.sectionI.questions.map((x) => x.q).join(' ');
    expect(q).toContain('Dr Chong');
    expect(q).not.toContain('Dr Nair');
  });

  it('leaves the term papers as they were', () => {
    expect(P6_PRACTICE_TESTS.T1.totalMarks).toBe(95);
    expect(P6_PRACTICE_TESTS.T1.sectionG.answers).toHaveLength(10);
    expect(P6_PRACTICE_TESTS.T1.sectionA.title).toBe('Section A: Grammar MCQ');
  });
});

describe('P6 Paper 2 layout papers: what is claimed', () => {
  it('does not claim to be the official format, and says what the score leaves out', () => {
    expect(certifyAgainstBlueprint({ totalMarks: 90, sections: [] }).certified).toBe(false);
    expect(P6_PAPER2_ALIGNMENT.matchesOfficialFormat).toBe(false);
    expect(P6_PAPER2_ALIGNMENT.scoreCaveat).toMatch(/not a PSLE readiness figure/i);
    expect(P6_PAPER2_ALIGNMENT.scoreCaveat).toMatch(/Writing, Listening and Oral/);
    const forbidden = [/full\s+PSLE/i, /PSLE[- ]format/i, /exam[- ]ready/i, /PSLE\s+mock/i];
    const surfaces = [
      ...PAPERS.flatMap((p) => [p.label, p.blurb]),
      PLACEHOLDER_META['p6-practice-tests'].blurb,
      buildPlaceholderHtml('p6-practice-tests'),
    ];
    for (const text of surfaces) {
      for (const pattern of forbidden) expect(text).not.toMatch(pattern);
    }
  });

  it('lists the four layout papers ahead of the four term papers', () => {
    const html = buildPlaceholderHtml('p6-practice-tests');
    expect(html).toMatch(/8 papers available/);
    expect(html.indexOf('p6-paper2-1')).toBeGreaterThan(-1);
    expect(html.indexOf('p6-paper2-1')).toBeLessThan(html.indexOf('p6-test-term-1'));
  });
});

describe('P6 Paper 2 layout papers: sitting one', () => {
  const click = (el) => el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  let root;

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    root = document.getElementById('root');
  });

  function answer(paper, key) {
    const s = paper[key];
    if (s.items?.[0]?.choices) {
      s.items.forEach((item, i) => {
        root.querySelectorAll(`input[name="q-${key}-${i}"]`).forEach((r) => {
          if (r.value === item.answer) r.checked = true;
        });
      });
    } else if (s.answers) {
      s.answers.forEach((a, i) => {
        root.querySelector(`[data-q-key="${key}/${i}"]`).value = a;
      });
    } else if (s.paragraph) {
      s.errors.forEach((e, i) => {
        root.querySelector(`[data-q-key="${key}/${i}"]`).value = e.correction;
      });
    }
  }

  it('shows each section in booklet order with what it needs on screen', () => {
    const paper = P6_PAPER2_TESTS.T1;
    mountPracticeTest(root, paper, {});
    const seen = [];
    SECTION_KEYS.forEach((key, i) => {
      const title = root.querySelector('.ptg-section-title').textContent;
      seen.push(title);
      expect(title).toContain(`(${paper[key].marks} marks)`);
      expect(root.querySelector('.ptg-time-hint')).toBeTruthy();
      expect(root.querySelector('.ptg-stage, .ptg').textContent).not.toContain('Unsupported');

      if (key === 'sectionC') {
        expect(root.querySelectorAll('.ptg-tested-word')).toHaveLength(5);
        expect(root.querySelectorAll('.ptg-mcq > li')).toHaveLength(5);
      }
      if (key === 'sectionD') {
        expect(root.querySelector('.vstim')).toBeTruthy();
        expect(root.querySelectorAll('.ptg-mcq > li')).toHaveLength(5);
      }
      if (key === 'sectionE') {
        expect(root.querySelectorAll('.ptg-input--cloze')).toHaveLength(10);
        expect(root.textContent).toMatch(/no word box/i);
      }
      if (key === 'sectionG') {
        expect(root.querySelectorAll('.ptg-input--cloze')).toHaveLength(15);
        expect(root.querySelector('.ptg-wordbank')).toBeNull();
      }
      if (key === 'sectionI') {
        expect(root.querySelectorAll('.ptg-comprehension > li')).toHaveLength(10);
      }

      answer(paper, key);
      click(root.querySelector('[data-action="check"]'));
      if (['sectionA', 'sectionB', 'sectionC', 'sectionD'].includes(key)) {
        expect(root.querySelectorAll('.ptg-feedback--ok').length, key).toBe(
          paper[key].items.length,
        );
      }
      if (key === 'sectionG') {
        // Every blank must be markable: a right answer is not marked wrong.
        const wrong = [...root.querySelectorAll('.ptg-input--cloze')].filter((el) =>
          el.classList.contains('ptg-input--wrong'),
        );
        expect(wrong).toHaveLength(0);
        expect(root.querySelector('[data-feedback-for="sectionG/all"]').textContent).toMatch(
          /15\s*\/\s*15/,
        );
      }
      if (i < SECTION_KEYS.length - 1) click(root.querySelector('[data-action="next"]'));
    });
    expect(seen[0]).toContain('Booklet A');
    expect(seen[3]).toContain('Visual Text');
    expect(seen[4]).toContain('Booklet B');
    expect(seen[8]).toContain('Comprehension');

    click(root.querySelector('[data-action="finish"]'));
    expect(root.textContent).toContain('Summary');
    expect(root.querySelector('.ptg-summary-caveat').textContent).toMatch(/Paper 2/);
  });

  it('marks the comprehension cloze of a term paper too', () => {
    const paper = P6_PRACTICE_TESTS.T1;
    mountPracticeTest(root, paper, {});
    const order = SECTION_KEYS.filter((k) => paper[k]);
    for (let i = 0; i < order.indexOf('sectionG'); i++) {
      click(root.querySelector('[data-action="check"]'));
      click(root.querySelector('[data-action="next"]'));
    }
    const first = root.querySelector('[data-q-key="sectionG/0"]');
    expect(first.getAttribute('data-answer')).toBe(paper.sectionG.answers[0]);
    answer(paper, 'sectionG');
    click(root.querySelector('[data-action="check"]'));
    expect(root.querySelector('[data-feedback-for="sectionG/all"]').textContent).toMatch(
      /10\s*\/\s*10/,
    );
  });
});
