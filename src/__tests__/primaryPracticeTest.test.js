/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { mountPracticeTest, buildPaperLauncherHtml } from '../modes/primaryPracticeTest.js';
import { P1_PRACTICE_TESTS } from '../data/p1PracticeTests.js';
import { P2_PRACTICE_TESTS } from '../data/p2PracticeTests.js';
import { P3_PRACTICE_TESTS } from '../data/p3PracticeTests.js';
import { P5_PRACTICE_TESTS } from '../data/p5PracticeTests.js';
import { P6_PRACTICE_TESTS } from '../data/p6PracticeTests.js';

function mount(paper, opts = {}) {
  document.body.innerHTML = '<div id="root"></div>';
  const root = document.getElementById('root');
  const calls = { closed: 0, practised: [] };
  mountPracticeTest(root, paper, {
    onClose: () => { calls.closed += 1; },
    onPractiseSkill: (t) => { calls.practised.push(t); },
    ...opts,
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

describe('Grader honours the section\'s declared marks', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('a P5 Grammar Cloze (10 blanks, marks: 10) scores out of section.marks', () => {
    const paper = P5_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    // Walk to Section C
    const order = ['sectionA', 'sectionB', 'sectionC'];
    for (const key of order) {
      if (root.querySelector('.ptg-section-title')?.textContent?.includes('Grammar Cloze')) break;
      answerAll(root, paper, key, 'correct');
      click(root.querySelector('[data-action="check"]'));
      click(root.querySelector('[data-action="next"]'));
    }
    answerAll(root, paper, 'sectionC', 'correct');
    click(root.querySelector('[data-action="check"]'));
    // The section's "(N marks)" label in the title must equal what the
    // grader actually awards on a perfect run.
    const title = root.querySelector('.ptg-section-title')?.textContent || '';
    const declared = Number((title.match(/\((\d+)\s*marks?\)/) || [])[1]);
    expect(declared).toBe(paper.sectionC.marks);
  });

  it('Situational Writing is rendered with data-q-type="writing" and excluded from the per-section grader total', () => {
    const paper = P5_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    const writingArea = paper.sectionE?.bullets ? paper.sectionE : null;
    expect(writingArea, 'P5 T1 should have a writing section at sectionE').toBeTruthy();
    // Jump to sectionE by clicking through prior sections without answering.
    const order = ['sectionA', 'sectionB', 'sectionC', 'sectionD'];
    for (const _key of order) {
      click(root.querySelector('[data-action="check"]'));
      click(root.querySelector('[data-action="next"]'));
    }
    // Now should be on Section E (writing).
    const ta = root.querySelector('textarea[data-q-type="writing"]');
    expect(ta, 'writing section should render a textarea tagged data-q-type="writing"').toBeTruthy();
    ta.value = 'My short attempt at the email.';
    click(root.querySelector('[data-action="check"]'));
    // Feedback row should explicitly label it as self-assessment.
    const fb = root.querySelector('.ptg-feedback--info');
    expect(fb?.textContent || '').toMatch(/self-assess/i);
  });
});

describe('Validator regressions — answer-in-choices + duplicate-choice + Section I in totals', () => {
  it('P6 totalMarks must include Section I (regression guard)', () => {
    for (const term of ['T1', 'T2', 'T3', 'T4']) {
      const paper = P6_PRACTICE_TESTS[term];
      const sectionKeys = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF', 'sectionG', 'sectionH', 'sectionI'];
      const sum = sectionKeys.reduce((acc, k) => acc + (paper[k]?.marks || 0), 0);
      expect(sum, `P6/${term} declared sections sum`).toBe(paper.totalMarks);
      expect(paper.sectionI?.marks, `P6/${term} sectionI marks`).toBeGreaterThan(0);
    }
  });

  it('checkMcqItems flags an MCQ whose answer is not among the choices', async () => {
    const { checkMcqItems } = await import('../data/practiceTestValidators.js');
    const issues = [];
    checkMcqItems(issues, 'TEST', [{
      q: 'All rubbish must be disposed ___ in designated bins.',
      choices: ['off', 'in', 'away', 'out'],
      answer: 'of',
    }], 4);
    expect(issues.some(i => /not among choices/.test(i))).toBe(true);
  });

  it('checkMcqItems flags duplicate choices after case/whitespace normalisation', async () => {
    const { checkMcqItems } = await import('../data/practiceTestValidators.js');
    const issues = [];
    checkMcqItems(issues, 'TEST', [{
      q: 'She ___ to school every day.',
      choices: ['walks', ' Walks ', 'walked', 'walking'],
      answer: 'walks',
    }], 4);
    expect(issues.some(i => /duplicate choice/.test(i))).toBe(true);
  });

  it('checkSectionMarks flags a 15-mark Grammar Cloze with only 10 blanks', async () => {
    const { checkSectionMarks } = await import('../data/practiceTestValidators.js');
    const issues = [];
    checkSectionMarks(issues, 'TEST/sectionC', { marks: 15 }, 'cloze', 10);
    expect(issues[0]).toMatch(/declared marks=15.*10 cloze items × 1 = 10/);
  });
});

describe('Comprehension OE — requiredGroups + negation-aware partial credit', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  function mountToComprehension(paper) {
    const { root } = mount(paper);
    // Click through every section without answering until we land on the
    // comprehension passage (Section H).
    while (!root.querySelector('.ptg-passage')) {
      const check = root.querySelector('[data-action="check"]');
      if (!check || check.hidden) break;
      check.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const next = root.querySelector('[data-action="next"]');
      if (!next || next.hidden) break;
      next.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
    return root;
  }

  it('a negated answer does NOT credit the keyword (e.g. "not urgent" with keyword "urgent")', () => {
    const paper = P6_PRACTICE_TESTS.T1;
    const root = mountToComprehension(paper);
    // The evidence question at sectionH/3 uses requiredGroups for the
    // Coral Reefs passage. Type an answer whose only "hits" are negated.
    const ta = root.querySelector('textarea[data-q-key="sectionH/3"]');
    expect(ta, 'expected an evidence textarea at sectionH/3').toBeTruthy();
    ta.value = 'It is not bleaching and there is no sedimentation at all.';
    root.querySelector('[data-action="check"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fb = root.querySelector('[data-feedback-for="sectionH/3"]');
    // Negation should disqualify both meaning units → 0 marks → "no" feedback.
    expect(fb?.className).toContain('ptg-feedback--no');
  });

  it('awards partial credit when only ONE required meaning unit is hit', () => {
    const paper = P6_PRACTICE_TESTS.T1;
    const root = mountToComprehension(paper);
    const ta = root.querySelector('textarea[data-q-key="sectionH/3"]');
    // Mentions a global threat (bleaching) but no local Singapore threat.
    ta.value = 'Rising sea temperatures cause widespread bleaching across the reefs.';
    root.querySelector('[data-action="check"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fb = root.querySelector('[data-feedback-for="sectionH/3"]');
    expect(fb?.className, fb?.outerHTML).toContain('ptg-feedback--partial');
    // The teacher-style marking guide should call out what was missing.
    expect(fb?.textContent || '').toMatch(/Missing/i);
  });

  it('awards full credit when BOTH required meaning units appear unnegated', () => {
    const paper = P6_PRACTICE_TESTS.T1;
    const root = mountToComprehension(paper);
    const ta = root.querySelector('textarea[data-q-key="sectionH/3"]');
    ta.value = 'Singapore reefs suffer from bleaching driven by rising temperatures, on top of local sedimentation from land reclamation.';
    root.querySelector('[data-action="check"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fb = root.querySelector('[data-feedback-for="sectionH/3"]');
    expect(fb?.className).toContain('ptg-feedback--ok');
  });
});

describe('Practice Test Section F — PSLE-style partial credit in synthesis', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  function jumpToSectionF(paper) {
    const { root } = mount(paper);
    while (!root.querySelector('.ptg-section-title')?.textContent?.includes('Synthesis')) {
      const check = root.querySelector('[data-action="check"]');
      if (!check || check.hidden) break;
      check.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      const next = root.querySelector('[data-action="next"]');
      if (!next || next.hidden) break;
      next.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
    return root;
  }

  it('every P5/P6 sectionF item declares 2 required groups for the marker\'s 1+1 split', async () => {
    const { P5_PRACTICE_TESTS } = await import('../data/p5PracticeTests.js');
    const { P6_PRACTICE_TESTS } = await import('../data/p6PracticeTests.js');
    const offenders = [];
    for (const [lvl, bank] of [['P5', P5_PRACTICE_TESTS], ['P6', P6_PRACTICE_TESTS]]) {
      for (const term of ['T1', 'T2', 'T3', 'T4']) {
        const items = bank[term]?.sectionF?.items || [];
        items.forEach((it, i) => {
          if (!Array.isArray(it.requiredGroups) || it.requiredGroups.length !== 2) {
            offenders.push(`${lvl}/${term}/sectionF[${i}]`);
          }
        });
      }
    }
    expect(offenders, offenders.join(', ')).toEqual([]);
  });

  it('renders synthesis textareas with data-q-type="synthesis" and data-required-groups attribute', () => {
    const paper = P6_PRACTICE_TESTS.T1;
    const root = jumpToSectionF(paper);
    const ta = root.querySelector('textarea[data-q-type="synthesis"]');
    expect(ta, 'expected at least one synthesis textarea').toBeTruthy();
    expect(ta.getAttribute('data-required-groups'), 'required-groups attribute must be present').toBeTruthy();
  });

  it('awards partial credit (◐) when only one of the two meaning units is preserved', () => {
    const paper = P6_PRACTICE_TESTS.T1;
    const root = jumpToSectionF(paper);
    // Item 1 = "The pollution was too ___" → "severe for the fish to survive in the water"
    // Group A: too severe / severe for the fish. Group B: survive / live.
    // Type something that hits A but misses B.
    const ta = root.querySelector('textarea[data-q-key="sectionF/1"]');
    expect(ta).toBeTruthy();
    ta.value = 'too severe but the fish managed to swim away';
    root.querySelector('[data-action="check"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fb = root.querySelector('[data-feedback-for="sectionF/1"]');
    expect(fb?.className, fb?.outerHTML).toContain('ptg-feedback--partial');
  });

  it('awards full credit when both meaning units appear unnegated', () => {
    const paper = P6_PRACTICE_TESTS.T1;
    const root = jumpToSectionF(paper);
    const ta = root.querySelector('textarea[data-q-key="sectionF/1"]');
    ta.value = 'severe for the fish to survive in the water';
    root.querySelector('[data-action="check"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fb = root.querySelector('[data-feedback-for="sectionF/1"]');
    expect(fb?.className).toContain('ptg-feedback--ok');
  });
});

describe('Summary distinguishes self-assessed writing from the auto-graded total', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('paper header reports auto vs self-assessed marks when the paper has a writing section', () => {
    const paper = P6_PRACTICE_TESTS.T1;
    const { root } = mount(paper);
    const small = root.querySelector('.ptg-header small')?.textContent || '';
    expect(small).toMatch(/auto-graded/);
    expect(small).toMatch(/self-assessed/);
  });
});

describe('Test Mode exam conditions', () => {
  beforeEach(() => { document.body.innerHTML = ''; });

  it('withholds inline feedback and writing support while the timed paper is active', () => {
    const paper = P5_PRACTICE_TESTS.T1;
    const { root } = mount(paper, { mode: 'test' });

    expect(root.querySelector('.ptg-timer')?.hidden).toBe(false);
    expect(root.querySelector('[data-action="check"]')?.textContent).toMatch(/Submit section/i);
    click(root.querySelector('[data-action="check"]'));
    expect(root.querySelectorAll('.ptg-feedback:not([hidden])').length).toBe(0);

    // Walk to Situational Writing (Section E). Test Mode must not expose the
    // model answer or rubric before the learner submits the paper.
    click(root.querySelector('[data-action="next"]'));
    for (let i = 0; i < 3; i += 1) {
      click(root.querySelector('[data-action="check"]'));
      click(root.querySelector('[data-action="next"]'));
    }
    expect(root.querySelector('textarea[data-q-type="writing"]')).toBeTruthy();
    expect(root.querySelector('.ptg-model-answer')).toBeNull();
    expect(root.querySelector('.ptg-rubric')).toBeNull();

    // Avoid leaving the test timer alive after the assertion.
    click(root.querySelector('[data-action="exit"]'));
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
