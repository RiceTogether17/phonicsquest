import { describe, it, expect } from 'vitest';
import { getUniqueClozeDone, getUniqueWordVaultDone, recordClozeCompletion, recordWordVaultCompletion } from '../modes/clozeCompletionTracker.js';

describe('completion tracking uniqueness', () => {
  it('does not increase unique cloze completion for same passage twice', () => {
    const first = recordClozeCompletion({ level: 'P3', category: 'subjectVerbAgreement', passageId: 'p3-sva-001' });
    const second = recordClozeCompletion({
      level: 'P3',
      category: 'subjectVerbAgreement',
      passageId: 'p3-sva-001',
      ccqCompletedByPassage: first.nextByPassage,
      ccqCompleted: first.nextCompleted,
      ccqCatCompleted: first.nextCatCompleted,
    });

    expect(getUniqueClozeDone({
      level: 'P3',
      category: 'subjectVerbAgreement',
      ccqCompletedByPassage: second.nextByPassage,
      ccqCatCompleted: second.nextCatCompleted,
    })).toBe(1);
    expect(second.nextCompleted.P3).toBe(1);
  });

  it('keeps legacy keys readable when by-passage map is missing', () => {
    expect(getUniqueClozeDone({ level: 'P2', category: 'articles', ccqCatCompleted: { 'P2-articles': 3 } })).toBe(3);
    expect(getUniqueWordVaultDone({ category: 'synonymContrast', level: 'p1', wvqCompleted: { synonymContrast: { p1: { done: true, stars: 2 } } } })).toBe(1);
  });

  it('stores word vault completion by unique passage id', () => {
    const tracked = recordWordVaultCompletion({ category: 'synonymContrast', level: 'p3', passageId: 'wv-p3-syn-001', stars: 3, accuracy: 100 });
    expect(getUniqueWordVaultDone({
      category: 'synonymContrast',
      level: 'p3',
      wvqCompletedByPassage: tracked.nextByPassage,
      wvqCompleted: tracked.nextCompleted,
    })).toBe(1);
  });
});
