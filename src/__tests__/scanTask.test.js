import { describe, it, expect, beforeEach, vi } from 'vitest';
import { buildScanTask, buildScanTaskForPassage, renderScanTask } from '../modes/scanTask.js';

function fixedRandom(seq) {
  let i = 0;
  return () => {
    const v = seq[i % seq.length];
    i++;
    return v;
  };
}

describe('buildScanTask', () => {
  it('returns a task with the correct option present and 4 unique options', () => {
    const task = buildScanTask({
      blankIndex: 1,
      meta: { primarySkill: 'connectorLogic', clueType: 'contrastClue' },
      randomFn: fixedRandom([0.1, 0.5, 0.9, 0.3, 0.7, 0.2, 0.4, 0.6]),
    });
    expect(task).not.toBeNull();
    expect(task.expectedClueType).toBe('contrastClue');
    expect(task.options).toHaveLength(4);
    expect(task.options.filter((o) => o.isCorrect)).toHaveLength(1);
    const values = new Set(task.options.map((o) => o.value));
    expect(values.size).toBe(4);
    expect(values.has('contrastClue')).toBe(true);
    expect(task.prompt).toContain('Blank 2');
  });

  it('falls back from primarySkill when clueType is missing', () => {
    const task = buildScanTask({ blankIndex: 0, meta: { primarySkill: 'tense' } });
    expect(task.expectedClueType).toBe('timeClue');
  });

  it('returns null when there is not enough metadata', () => {
    const task = buildScanTask({ blankIndex: 0, meta: {} });
    expect(task).toBeNull();
  });
});

describe('buildScanTaskForPassage', () => {
  it('uses the first blank with metadata', () => {
    const passage = {
      answers: ['was', 'although', 'fast'],
      clues: [
        { blankIndex: 1, clueType: 'contrastClue', prompt: '', acceptableSpans: ['although'] },
      ],
    };
    const task = buildScanTaskForPassage(passage);
    expect(task).not.toBeNull();
    expect(task.blankIndex).toBe(1);
    expect(task.expectedClueType).toBe('contrastClue');
  });

  it('returns null when no blank has scannable metadata', () => {
    const passage = { answers: ['x', 'y'] };
    expect(buildScanTaskForPassage(passage)).toBeNull();
  });
});

describe('renderScanTask', () => {
  let host;
  beforeEach(() => {
    document.body.innerHTML = '<div id="host"></div>';
    host = document.getElementById('host');
    vi.useFakeTimers();
  });

  it('renders four labelled options and a Skip Scan button by default', () => {
    const task = buildScanTask({
      blankIndex: 0,
      meta: { primarySkill: 'tense' },
      randomFn: fixedRandom([0.1, 0.4, 0.7, 0.2]),
    });
    renderScanTask({ host, task, onAnswer: () => {} });
    const options = host.querySelectorAll('.scan-task-option');
    expect(options).toHaveLength(4);
    expect(host.querySelector('#scan-task-skip')).not.toBeNull();
    expect(host.innerHTML).toContain('Blank 1');
    expect(host.innerHTML).not.toContain('<script');
  });

  it('escapes unsafe option labels', () => {
    const task = {
      blankIndex: 0,
      prompt: '<img onerror=alert(1)>',
      expectedClueType: 'meaningClue',
      options: [
        { value: 'meaningClue', label: '<bad>', isCorrect: true },
        { value: 'timeClue', label: 'Time clue', isCorrect: false },
        { value: 'contrastClue', label: 'Contrast clue', isCorrect: false },
        { value: 'grammarClue', label: 'Grammar clue', isCorrect: false },
      ],
    };
    renderScanTask({ host, task, onAnswer: () => {} });
    const html = host.innerHTML;
    expect(html).not.toContain('<bad>');
    expect(html).not.toContain('<img');
  });

  it('invokes onAnswer with correctness after the user picks an option', () => {
    const onAnswer = vi.fn();
    const task = buildScanTask({
      blankIndex: 0,
      meta: { primarySkill: 'connectorLogic', clueType: 'contrastClue' },
      randomFn: fixedRandom([0.1, 0.4, 0.7, 0.2]),
    });
    renderScanTask({ host, task, onAnswer });
    const correctBtn = [...host.querySelectorAll('.scan-task-option')]
      .find((b) => b.dataset.correct === '1');
    correctBtn.click();
    vi.runAllTimers();
    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer.mock.calls[0][0]).toMatchObject({
      correct: true,
      expectedClueType: 'contrastClue',
    });
  });

  it('invokes onSkip when Skip Scan is pressed', () => {
    const onSkip = vi.fn();
    const onAnswer = vi.fn();
    const task = buildScanTask({
      blankIndex: 0,
      meta: { primarySkill: 'tense' },
      randomFn: fixedRandom([0.1, 0.4, 0.7, 0.2]),
    });
    renderScanTask({ host, task, onAnswer, onSkip });
    host.querySelector('#scan-task-skip').click();
    expect(onSkip).toHaveBeenCalledTimes(1);
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it('returns silently when host or task is missing', () => {
    expect(() => renderScanTask({ host: null, task: { options: [] } })).not.toThrow();
    expect(() => renderScanTask({ host, task: null })).not.toThrow();
  });
});
