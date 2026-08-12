import { beforeEach, describe, expect, it } from 'vitest';
import { store } from '../modules/store.js';
import { FALLBACK_MISCONCEPTION_IDS } from '../modules/misconceptions.js';
import {
  getMisconceptionPattern,
  getMisconceptionSummary,
  recordMisconception,
} from '../modules/teacherFeedback.js';

/**
 * Placeholders are not habits.
 *
 * A wrong answer no detector recognised is labelled with its domain fallback
 * so the re-teach still has something to say. Those labels must not reach the
 * parent report: "your child keeps making: a rule that has not clicked yet"
 * is noise dressed as a diagnosis.
 */

beforeEach(() => {
  store.set('misconceptionLog', {});
});

describe('fallback misconceptions in reporting', () => {
  it.each(FALLBACK_MISCONCEPTION_IDS)('keeps %s out of the habit summary', (id) => {
    for (let i = 0; i < 5; i++) recordMisconception(id, { skill: 'mixed', mode: 'grammarMcq' });

    expect(getMisconceptionSummary().map((h) => h.id)).not.toContain(id);
    expect(getMisconceptionPattern(id)).toBeNull();
  });

  it('still surfaces a detected slip alongside them', () => {
    for (let i = 0; i < 5; i++) recordMisconception('rule-not-applied', { skill: 'mixed' });
    for (let i = 0; i < 3; i++) recordMisconception('article-sound', { skill: 'articles' });

    const summary = getMisconceptionSummary();
    expect(summary.map((h) => h.id)).toEqual(['article-sound']);
    expect(getMisconceptionPattern('article-sound')).not.toBeNull();
  });

  it('still records them, so the counts stay honest for anything else reading the log', () => {
    recordMisconception('rule-not-applied', { skill: 'mixed' });
    expect(store.get('misconceptionLog')['rule-not-applied'].count).toBe(1);
  });
});
