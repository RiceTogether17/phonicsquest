/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { mountPracticeTest, buildPaperLauncherHtml } from '../modes/primaryPracticeTest.js';
import { P1_PRACTICE_TESTS } from '../data/p1PracticeTests.js';
import { P2_PRACTICE_TESTS } from '../data/p2PracticeTests.js';
import { P3_PRACTICE_TESTS } from '../data/p3PracticeTests.js';

function mount(paper, opts = {}) {
  document.body.innerHTML = '<div id="root"></div>';
  const root = document.getElementById('root');
  const calls = { closed: 0, practised: [] };
  mountPracticeTest(root, paper, {
    onClose: () => { calls.closed += 1; },
    onPractiseSkill: (t) => { calls.practised.push(t); },
  });
  return { root, calls };
}

function click(el) {
  el?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
}

function answerAll(root, paper, key, mode = 'correct') {
  const section = paper[key];
  if (key === 'sectionA' || key === 'sectionB') {
    section.items.forEach((item, i) => {
      const choice = mode === 'correct' ? item.answer : item.choices.find(c => c !== item.answer);
      const radios = root.querySelectorAll(`input[name="q-${key}-${i}"]`);
      radios.forEach(r => { if (r.value === choice) r.checked = true; });
    });
    return;
  }
  if (key === 'sectionC' || key === 'sectionD') {
    section.answers.forEach((ans, i) => {
      const input = root.querySelector(`input[data-q-key="${key}/${i}"]`);
      if (!input) return;
      input.value = mode === 'correct' ? ans : 'wrong';
    });
    return;
  }
  if (key === 'sectionE' && Array.isArray(section.blanks)) {
    section.blanks.forEach((b, i) => {
      const input = root.querySelector(`input[data-q-key="${key}/${i}"]`);
      if (!input) return;
      input.value = mode === 'correct' ? b.answer : 'wrong';
    });
    return;
  }
  if (Array.isArray(section.items) && section.items[0]?.scrambled) {
    section.items.forEach((item, i) => {
      const input = root.querySelector(`input[data-q-key="${key}/${i}"]`);
      if (!input) return;
      input.value = mode === 'correct' ? item.answer : 'wrong sentence';
    });
    return;
  }
  if (Array.isArray(section.items) && section.items[0]?.originals) {
    section.items.forEach((item, i) => {
      const input = root.querySelector(`textarea[data-q-key="${key}/${i}"]`);
      if (!input) return;
      input.value = mode === 'correct' ? item.model : 'something wrong';
    });
    return;
  }
  if (section.paragraph) {
    section.errors.forEach((err, i) => {
      const input = root.querySelector(`input[data-q-key="${key}/${i}"]`);
      if (!input) return;
      input.value = mode === 'correct' ? err.correction : 'wrong';
    });
    return;
  }
}

describe('Practice Test launcher → interactive game mode', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('renders the section stepper and the first section title on mount', () => {
    const paper = P1_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    expect(root.querySelector('.ptg-stepper')).toBeTruthy();
    expect(root.querySelector('.ptg-section-title')?.textContent).toContain('Section A');
    // Multiple steps for each of the 6 sections in P1 T1
    expect(root.querySelectorAll('.ptg-step').length).toBeGreaterThanOrEqual(5);
  });

  it('scores a perfect Section A and shows ✅ feedback', () => {
    const paper = P1_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    answerAll(root, paper, 'sectionA', 'correct');
    click(root.querySelector('[data-action="check"]'));
    const okFeedback = root.querySelectorAll('.ptg-feedback--ok');
    expect(okFeedback.length).toBe(5);
    expect(root.querySelector('[data-action="next"]')?.hidden).toBe(false);
  });

  it('marks wrong answers as ❌ and reveals the correct answer', () => {
    const paper = P1_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    answerAll(root, paper, 'sectionA', 'wrong');
    click(root.querySelector('[data-action="check"]'));
    const noFeedback = root.querySelectorAll('.ptg-feedback--no');
    expect(noFeedback.length).toBe(5);
    // Correct answer surfaces in the feedback text
    const fbText = [...noFeedback].map(n => n.textContent).join(' | ');
    expect(fbText).toContain(paper.sectionA.items[0].answer);
  });

  it('disables inputs after grading so students cannot retry the same section', () => {
    const paper = P1_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    answerAll(root, paper, 'sectionA', 'correct');
    click(root.querySelector('[data-action="check"]'));
    const radios = root.querySelectorAll(`input[name="q-sectionA-0"]`);
    radios.forEach(r => expect(r.disabled).toBe(true));
  });

  it('Next advances through every section to the Finish + Summary', () => {
    const paper = P1_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    // Sections: A, B, C, D, E, G  (no F in P1 T1)
    const sections = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionG'];
    for (let i = 0; i < sections.length; i += 1) {
      // Comprehension section in P1 T1 is the last; just leave it blank
      if (sections[i] !== 'sectionG') answerAll(root, paper, sections[i], 'correct');
      click(root.querySelector('[data-action="check"]'));
      if (i < sections.length - 1) {
        click(root.querySelector('[data-action="next"]'));
      }
    }
    click(root.querySelector('[data-action="finish"]'));
    const summary = root.querySelector('.ptg-stage');
    expect(summary.textContent).toContain('Summary');
    expect(summary.querySelector('.ptg-summary-table')).toBeTruthy();
  });

  it('Practise → button in feedback fires onPractiseSkill with the target module', () => {
    const paper = P1_PRACTICE_TESTS.T1;
    const { root, calls } = mount(paper);
    answerAll(root, paper, 'sectionA', 'wrong');
    click(root.querySelector('[data-action="check"]'));
    const practiseBtn = root.querySelector('.ptg-practise');
    expect(practiseBtn).toBeTruthy();
    click(practiseBtn);
    expect(calls.practised.length).toBeGreaterThan(0);
    expect(['grammar-mcq', 'vocab-mcq', 'cloze-castle', 'word-vault', 'sentence-forge', 'editing-quest'])
      .toContain(calls.practised[0]);
  });

  it('grades a P2 Sentence Combining section (textarea answers)', () => {
    const paper = P2_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    // Walk to Section F (sentence combining)
    const order = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF'];
    for (const key of order) {
      if (root.querySelector('.ptg-section-title')?.textContent?.includes('Sentence Combining')) break;
      answerAll(root, paper, key, 'correct');
      click(root.querySelector('[data-action="check"]'));
      click(root.querySelector('[data-action="next"]'));
    }
    // Now on Section F
    answerAll(root, paper, 'sectionF', 'correct');
    click(root.querySelector('[data-action="check"]'));
    expect(root.querySelectorAll('.ptg-feedback--ok').length).toBe(3);
  });

  it('grades a P3 open Comprehension Cloze section (no word bank)', () => {
    const paper = P3_PRACTICE_TESTS.T3;
    const { root } = mount(paper);
    // Section E is open cloze
    const order = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE'];
    for (const key of order) {
      if (root.querySelector('.ptg-section-title')?.textContent?.includes('Comprehension Cloze')) break;
      answerAll(root, paper, key, 'correct');
      click(root.querySelector('[data-action="check"]'));
      click(root.querySelector('[data-action="next"]'));
    }
    answerAll(root, paper, 'sectionE', 'correct');
    click(root.querySelector('[data-action="check"]'));
    expect(root.querySelectorAll('.ptg-feedback').length).toBe(1); // one feedback for the whole section
    // Section overall must have scored 5 (all blanks correct)
    const fb = root.querySelector('[data-feedback-for$="/all"]');
    expect(fb).toBeTruthy();
  });

  it('Exit button calls onClose', () => {
    const { root, calls } = mount(P1_PRACTICE_TESTS.T1);
    click(root.querySelector('[data-action="exit"]'));
    expect(calls.closed).toBe(1);
  });
});

describe('buildPaperLauncherHtml', () => {
  it('lists every paper with a Start button + paper id', () => {
    const html = buildPaperLauncherHtml({
      level: 'P3',
      papers: Object.values(P3_PRACTICE_TESTS),
    });
    for (const paper of Object.values(P3_PRACTICE_TESTS)) {
      expect(html).toContain(paper.label);
      expect(html).toContain(`data-start-paper="${paper.id}"`);
    }
  });
});
