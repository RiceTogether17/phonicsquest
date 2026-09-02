import { describe, it, expect } from 'vitest';
import { gradeShortAnswer, hasUnnegatedMatch } from '../modes/scoring/shortAnswerGrader.js';

describe('hasUnnegatedMatch — negation rejection', () => {
  it('rejects a keyword preceded by "not" within the same clause', () => {
    expect(hasUnnegatedMatch('It was not urgent.', 'urgent')).toBe(false);
  });

  it('rejects a keyword preceded by "never"', () => {
    expect(hasUnnegatedMatch('She was never afraid.', 'afraid')).toBe(false);
  });

  it('rejects a keyword preceded by a contracted negation', () => {
    expect(hasUnnegatedMatch("They didn't help him.", 'help')).toBe(false);
    expect(hasUnnegatedMatch("It wasn't important.", 'important')).toBe(false);
  });

  it('accepts a keyword after a clause break, even if the prior clause negated it', () => {
    // "not urgent." is one clause; "she still hurried" is a new clause and the
    // negation does not carry across the period.
    expect(
      hasUnnegatedMatch('It was not urgent. She still hurried, urgent or not.', 'hurried'),
    ).toBe(true);
  });

  it('accepts a positive keyword that just happens to appear after a long sentence', () => {
    expect(hasUnnegatedMatch('The matter was extremely urgent.', 'urgent')).toBe(true);
  });

  it('does not match a keyword inside another word', () => {
    // "now" must not match "no"; "another" must not match "an".
    expect(hasUnnegatedMatch('I will go now.', 'no')).toBe(false);
    expect(hasUnnegatedMatch('Choose another option.', 'an')).toBe(false);
  });

  it('handles multiple occurrences — accepts if any unnegated', () => {
    // first hit is negated, second is not
    expect(
      hasUnnegatedMatch('It was not urgent at first, but it became urgent later.', 'urgent'),
    ).toBe(true);
  });

  it('does not carry negation across "but" / "however"', () => {
    expect(hasUnnegatedMatch('He was not tired, but he was hungry.', 'hungry')).toBe(true);
  });
});

describe('gradeShortAnswer — exact and acceptable matches', () => {
  it('awards full credit when the user answer exactly matches the model', () => {
    const r = gradeShortAnswer('The matter was urgent.', {
      expected: 'The matter was urgent.',
      keywords: ['urgent'],
    });
    expect(r.fraction).toBe(1);
    expect(r.trace.reason).toBe('exact-match');
  });

  it('awards full credit when the answer matches an acceptable variant', () => {
    const r = gradeShortAnswer('It was very urgent.', {
      expected: 'The matter was urgent.',
      accepts: ['It was urgent.', 'It was very urgent.'],
    });
    expect(r.fraction).toBe(1);
    expect(r.trace.reason).toBe('accepted-match');
  });
});

describe('gradeShortAnswer — requiredGroups strict partial credit', () => {
  it('awards full credit when every required meaning unit is hit', () => {
    const r = gradeShortAnswer(
      'They left quickly because the matter was urgent and time was short.',
      {
        requiredGroups: [
          ['urgent', 'pressing', 'critical'],
          ['quickly', 'in a hurry', 'right away'],
        ],
      },
    );
    expect(r.fraction).toBe(1);
    expect(r.trace.hits).toHaveLength(2);
    expect(r.trace.misses).toHaveLength(0);
  });

  it('awards half credit when one of two required groups is hit', () => {
    const r = gradeShortAnswer('They left because it was urgent.', {
      requiredGroups: [
        ['urgent', 'pressing'],
        ['immediately', 'right away', 'no time to lose'],
      ],
    });
    expect(r.fraction).toBeCloseTo(0.5, 5);
    expect(r.trace.hits).toContain('urgent');
    expect(r.trace.misses).toContain('immediately');
  });

  it('does NOT credit a meaning unit that is negated', () => {
    // The student wrote "It was not urgent" — historically the old matcher
    // would count this as a hit because "urgent" appears as a substring.
    const r = gradeShortAnswer('It was not urgent and they had plenty of time.', {
      requiredGroups: [['urgent', 'pressing']],
    });
    expect(r.fraction).toBe(0);
    expect(r.trace.hits).toHaveLength(0);
    expect(r.trace.misses).toContain('urgent');
  });

  it('partial credit divides cleanly across three required groups', () => {
    const r = gradeShortAnswer('The reef is fragile and dying.', {
      requiredGroups: [
        ['fragile', 'delicate'],
        ['dying', 'collapsing', 'disappearing'],
        ['warming', 'temperature', 'bleaching'],
      ],
    });
    expect(r.fraction).toBeCloseTo(2 / 3, 5);
  });
});

describe('gradeShortAnswer — legacy keywords path', () => {
  it('still awards full credit on any single keyword hit (back-compat)', () => {
    const r = gradeShortAnswer('She looked exhausted after the run.', {
      keywords: ['tired', 'exhausted', 'weary'],
    });
    expect(r.fraction).toBe(1);
    expect(r.trace.hits).toContain('exhausted');
  });

  it('returns 0 with a populated misses list when no keyword hits', () => {
    const r = gradeShortAnswer('She felt fine.', {
      keywords: ['tired', 'exhausted'],
    });
    expect(r.fraction).toBe(0);
    expect(r.trace.reason).toBe('no-keyword-hit');
    expect(r.trace.misses).toEqual(['tired', 'exhausted']);
  });

  it('rejects a negated legacy keyword too', () => {
    // The bug the user flagged: "It was not urgent" must not match "urgent".
    const r = gradeShortAnswer('It was not urgent.', { keywords: ['urgent'] });
    expect(r.fraction).toBe(0);
  });
});

describe('gradeShortAnswer — empty / malformed input', () => {
  it('returns 0 for empty input', () => {
    const r = gradeShortAnswer('', { expected: 'anything', keywords: ['anything'] });
    expect(r.fraction).toBe(0);
    expect(r.trace.reason).toBe('empty');
  });

  it('returns 0 when no grading information is provided', () => {
    const r = gradeShortAnswer('some answer', {});
    expect(r.fraction).toBe(0);
    expect(r.trace.reason).toBe('no-match');
  });
});
