import { beforeEach, describe, expect, it } from 'vitest';
import { store } from '../modules/store.js';
import { buildParentReportCard } from '../modules/parentReportCard.js';
import { PATTERN_THRESHOLD, recordMisconception } from '../modules/teacherFeedback.js';

beforeEach(() => {
  store.set('misconceptionLog', {});
});

describe('the report card habit list', () => {
  it('is empty until a slip recurs', () => {
    recordMisconception('agreement-with-nearest-noun', {
      skill: 'svAgreement',
      mode: 'grammarMcq',
    });
    expect(buildParentReportCard({}).habits).toEqual([]);
  });

  it('names the habit in plain language with the check that fixes it', () => {
    for (let i = 0; i < 4; i++) {
      recordMisconception('agreement-with-nearest-noun', {
        skill: 'svAgreement',
        mode: 'grammarMcq',
      });
    }

    const [habit] = buildParentReportCard({}).habits;
    expect(habit.label).toBe('matching the verb to the closest word instead of the real subject');
    expect(habit.teacherLabel).toBe('Agreement with the nearest noun');
    expect(habit.count).toBe(4);
    expect(habit.tip).toContain('Cross out');
  });

  it('lists at most three, strongest first', () => {
    const ids = ['article-sound', 'tense-time-marker', 'homophone-confusion', 'pronoun-case'];
    ids.forEach((id, i) => {
      for (let n = 0; n <= i + 1; n++)
        recordMisconception(id, { skill: 'mixed', mode: 'clozeCastle' });
    });

    const { habits } = buildParentReportCard({});
    expect(habits).toHaveLength(3);
    expect(habits.map((h) => h.id)).toEqual([
      'pronoun-case',
      'homophone-confusion',
      'tense-time-marker',
    ]);
  });

  it('drops a habit the child has fixed', () => {
    for (let i = 0; i < PATTERN_THRESHOLD; i++)
      recordMisconception('article-sound', { skill: 'articles' });
    expect(buildParentReportCard({}).habits).toHaveLength(1);

    store.set('misconceptionLog', {});
    expect(buildParentReportCard({}).habits).toEqual([]);
  });
});
