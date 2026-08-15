import { describe, expect, it } from 'vitest';
import { compareToModel, modelIdeaWords } from '../modes/scoring/ideaOverlap.js';

describe('modelIdeaWords', () => {
  it('keeps the ideas and drops the scaffolding', () => {
    expect(modelIdeaWords('Emma and her family were moving away.')).toEqual([
      'emma',
      'family',
      'moving',
      'away',
    ]);
  });

  it('de-duplicates on the stem, keeping the model order', () => {
    // "she"/"and" are stopwords; "practising" repeats the stem of "practised".
    expect(modelIdeaWords('She practised, and kept practising hard every day.')).toEqual([
      'practised',
      'kept',
      'hard',
      'every',
      'day',
    ]);
  });

  it('returns nothing for a model made only of stopwords', () => {
    expect(modelIdeaWords('It was for them.')).toEqual([]);
    expect(modelIdeaWords('')).toEqual([]);
  });

  it('keeps a bare number, which can be the whole answer', () => {
    expect(modelIdeaWords('Three.')).toEqual(['three']);
  });
});

describe('compareToModel', () => {
  const MODEL = 'Emma and her family were moving away.';

  it('finds the ideas a child covered, in their own words', () => {
    const r = compareToModel('Her friend Emma moved away with the family', MODEL);
    expect(r.covered).toEqual(['emma', 'family', 'moving', 'away']);
    expect(r.missing).toEqual([]);
    expect(r.ratio).toBe(1);
  });

  it('names the ideas that are not there', () => {
    const r = compareToModel('Emma was going somewhere', MODEL);
    expect(r.covered).toContain('emma');
    expect(r.missing).toContain('family');
    expect(r.ratio).toBeLessThan(1);
  });

  it('matches a digit against a model that spells the number out', () => {
    const r = compareToModel('there were 3 of them', 'Three — Sarah and her two parents.');
    expect(r.covered).toContain('three');
  });

  it('tolerates inflection rather than reporting a false miss', () => {
    expect(compareToModel('they moved house', MODEL).covered).toContain('moving');
  });

  it('reports an empty answer as unanswered, not as zero overlap', () => {
    const r = compareToModel('   ', MODEL);
    expect(r.answered).toBe(false);
    expect(r.covered).toEqual([]);
    expect(r.missing).toHaveLength(4);
  });

  it('survives a model with no idea words', () => {
    const r = compareToModel('anything', 'It was for them.');
    expect(r).toMatchObject({ covered: [], missing: [], ratio: 0, answered: true });
  });
});
