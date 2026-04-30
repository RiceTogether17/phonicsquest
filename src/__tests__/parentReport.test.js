import { describe, it, expect } from 'vitest';
import {
  buildParentReport,
  getTeacherTip,
  pickStrongestWeakest,
} from '../modes/clozeSessionSummary.js';

describe('getTeacherTip', () => {
  it('returns a tense-specific question for tense weakness', () => {
    expect(getTeacherTip('tense')).toMatch(/time word/i);
  });

  it('returns a connector question for connectorLogic', () => {
    expect(getTeacherTip('connectorLogic')).toMatch(/contrast|reason|result/i);
  });

  it('falls back to the generic clue question for unknown skills', () => {
    expect(getTeacherTip('unknown-thing')).toMatch(/word in the sentence gives you the clue/i);
    expect(getTeacherTip()).toMatch(/word in the sentence gives you the clue/i);
  });
});

describe('pickStrongestWeakest', () => {
  it('returns null entries when no skills have attempts', () => {
    expect(pickStrongestWeakest({})).toEqual({ strongest: null, weakest: null });
  });

  it('uses accuracy to pick top + bottom skills', () => {
    const stats = {
      tense: { correct: 3, total: 3, label: 'Verb tense' },
      connectorLogic: { correct: 1, total: 4, label: 'Connector logic' },
      collocation: { correct: 2, total: 3, label: 'Word partners' },
    };
    const { strongest, weakest } = pickStrongestWeakest(stats);
    expect(strongest.skill).toBe('tense');
    expect(strongest.accuracy).toBe(100);
    expect(weakest.skill).toBe('connectorLogic');
    expect(weakest.accuracy).toBe(25);
  });

  it('returns weakest=null when only one skill is tracked', () => {
    const { strongest, weakest } = pickStrongestWeakest({
      tense: { correct: 2, total: 4, label: 'Verb tense' },
    });
    expect(strongest.skill).toBe('tense');
    expect(weakest).toBeNull();
  });
});

describe('buildParentReport', () => {
  it('lays out the report in the spec format with strength + weakness', () => {
    const text = buildParentReport({
      questLabel: 'Cloze Castle',
      modeLabel: 'Practice Mode',
      scoreLine: '6/10',
      accuracy: 60,
      strongest: { skill: 'tense', label: 'Verb tense', correct: 4, total: 4, accuracy: 100 },
      weakest: { skill: 'connectorLogic', label: 'Connector logic', correct: 1, total: 3, accuracy: 33 },
      weakExamples: ['although', 'however'],
      recommendation: 'Practise 5 contrast-clue questions before the next passage.',
    });
    expect(text.startsWith('Cloze Castle Report')).toBe(true);
    expect(text).toContain('Score: 6/10 (60%)');
    expect(text).toContain('Mode: Practice Mode');
    expect(text).toContain('Strength: Student could identify verb tense clues (4/4).');
    expect(text).toContain('Weakness: Student missed connector logic clues such as "although" and "however" (1/3).');
    expect(text).toContain('Next Step: Practise 5 contrast-clue questions before the next passage.');
    expect(text).toContain('Teacher Tip:');
    expect(text).toMatch(/contrast|reason|result/i);
  });

  it('falls back to neutral copy when strength + weakness are missing', () => {
    const text = buildParentReport({
      questLabel: 'Word Vault',
      scoreLine: '0/0',
      accuracy: 0,
      recommendation: 'Try one more passage with the scan task on.',
    });
    expect(text).toContain('Word Vault Report');
    expect(text).toContain('Strength: Steady effort');
    expect(text).toContain('Weakness: No major gaps detected');
    expect(text).toContain('Teacher Tip:');
  });

  it('uses the explicit teacherTip override when provided', () => {
    const text = buildParentReport({
      questLabel: 'Cloze Castle',
      scoreLine: '5/5',
      accuracy: 100,
      teacherTip: 'Celebrate this win with your child!',
      recommendation: 'Stretch to a harder level.',
    });
    expect(text).toContain('Celebrate this win with your child!');
  });
});
