import { describe, it, expect, beforeEach } from 'vitest';
import { SITUATIONAL_WRITING_PROMPTS } from '../src/data/situationalWritingPrompts.js';
import { SITUATIONAL_POINT_CHECKS } from '../src/data/situationalPointChecks.js';
import { P5_PRACTICE_TESTS } from '../src/data/p5PracticeTests.js';
import { P6_PRACTICE_TESTS } from '../src/data/p6PracticeTests.js';
import { checkSituationalPoints } from '../src/modules/situationalChecks.js';
import { attachOpenResponses, renderOpenResponseHtml } from '../src/modes/openResponse.js';
import { store } from '../src/modules/store.js';

/**
 * Situational writing is marked first on whether every required point is
 * there. The child used to be shown "ideas from the model answer" only, could
 * open the model before writing, and had a three-line box.
 */

const paperTasks = [...Object.values(P5_PRACTICE_TESTS), ...Object.values(P6_PRACTICE_TESTS)]
  .filter((paper) => paper.sectionE?.bullets)
  .map((paper) => ({
    id: paper.id,
    bullets: paper.sectionE.bullets,
    format: paper.sectionE.format,
    modelAnswer: paper.sectionE.modelAnswer,
  }));

const allTasks = [...SITUATIONAL_WRITING_PROMPTS, ...paperTasks];

describe('situational point checks', () => {
  it('has one check for every bullet of every task', () => {
    for (const task of allTasks) {
      expect(SITUATIONAL_POINT_CHECKS[task.id], task.id).toBeTruthy();
      expect(SITUATIONAL_POINT_CHECKS[task.id].length, task.id).toBe(task.bullets.length);
    }
  });

  it.each(allTasks.map((t) => [t.id, t]))(
    'the model answer for %s covers every point',
    (_id, task) => {
      const result = checkSituationalPoints(task, task.modelAnswer);
      expect(result.points.filter((p) => !p.covered).map((p) => p.bullet)).toEqual([]);
      expect(result.format.filter((f) => !f.ok)).toEqual([]);
    },
  );

  it('a short off-task answer covers at most one point', () => {
    const junk = 'Dear Sir, I like to play games with my friends at school. Yours sincerely, Ali';
    for (const task of allTasks) {
      expect(checkSituationalPoints(task, junk).covered, task.id).toBeLessThanOrEqual(1);
    }
  });

  it('names the missing point with a hint', () => {
    const task = SITUATIONAL_WRITING_PROMPTS.find((p) => p.id === 'sw-1');
    const result = checkSituationalPoints(
      task,
      'Dear Mrs Lim, I cannot go to camp because I have a fever. I am very sorry. Yours sincerely, Wei Jie',
    );
    expect(result.covered).toBe(2);
    const missing = result.points.find((p) => !p.covered);
    expect(missing.bullet).toMatch(/missed work/);
    expect(missing.hint).toBeTruthy();
  });

  it('reads times and dates written in different ways', () => {
    const task = SITUATIONAL_WRITING_PROMPTS.find((p) => p.id === 'sw-11');
    for (const text of ['Come on 5 July at 2pm.', 'Come on July 5th at 2.30 p.m.']) {
      expect(checkSituationalPoints(task, text).points[0].covered, text).toBe(true);
    }
    // "may" the verb is not the month.
    expect(checkSituationalPoints(task, 'You may come.').points[0].covered).toBe(false);
  });

  it('checks the greeting and sign-off only for letters, emails and notes', () => {
    const email = SITUATIONAL_WRITING_PROMPTS.find((p) => p.format === 'Email');
    const speech = SITUATIONAL_WRITING_PROMPTS.find((p) => p.format === 'Speech');
    expect(checkSituationalPoints(email, 'hello').format.length).toBe(2);
    expect(checkSituationalPoints(speech, 'hello').format.length).toBe(0);
  });
});

describe('situational answer box', () => {
  const task = SITUATIONAL_WRITING_PROMPTS.find((p) => p.id === 'sw-1');

  beforeEach(() => {
    store.set('questMastery', {});
    store.set('learningEvents', []);
    document.body.innerHTML = `<div id="host">${renderOpenResponseHtml({
      id: 'sw-sw-1',
      model: task.modelAnswer,
      skill: 'situationalWriting',
      rows: 12,
      pointsId: 'sw-1',
    })}</div>`;
    attachOpenResponses(document.getElementById('host'), {
      quest: 'situational-writing',
      pointCheck: (id, text) => checkSituationalPoints(task, text),
    });
  });

  const input = () => document.querySelector('.open-response__input');
  const check = () => document.querySelector('[data-or-check]');
  const result = () => document.querySelector('[data-or-result]');

  it('is tall enough to write a letter in', () => {
    expect(input().getAttribute('rows')).toBe('12');
  });

  it('lists missing points and keeps the answer editable, without the model', () => {
    input().value = 'Dear Mrs Lim, I have a fever so I cannot go to camp. Yours sincerely, Wei Jie';
    check().click();
    expect(result().textContent).toContain('1 of 3');
    expect(result().textContent).toContain('Apologise sincerely');
    expect(result().textContent).not.toContain('Model answer');
    expect(input().readOnly).toBe(false);
    expect(check().textContent).toBe('Check again');
  });

  it('shows the model and locks the answer only when the child finishes', () => {
    input().value = 'Dear Mrs Lim, I have a fever so I cannot go to camp. Yours sincerely, Wei Jie';
    check().click();
    document.querySelector('[data-or-finish]').click();
    expect(result().textContent).toContain('Model answer');
    expect(input().readOnly).toBe(true);
    expect(document.querySelectorAll('[data-or-mark]').length).toBe(3);
  });
});
