/*
 * Audit 2026-09-19, Finding 2 — open-ended paper marking is unreliable in both
 * directions.
 *
 * Of 29 P6 comprehension questions with model answers, 21 carry no
 * requiredGroups, keywords or acceptable list, 7 use keywords without required
 * groups, and 1 has required groups. Missing marking keys fell back to matching
 * the complete model-answer string.
 *
 * The audit's three reproductions, using the actual questions:
 *
 *   - "50%" scored ZERO for a question asking what percentage of coral reefs
 *     has been lost, because the model is a longer sentence.
 *   - "tide" scored FULL for a question asking the meaning of "swimming
 *     against the tide", explaining nothing.
 *   - "It is not at all urgent", "Never urgent" and "It is no longer urgent"
 *     all counted as unnegated matches for "urgent".
 */

import { describe, it, expect } from 'vitest';
import {
  gradeShortAnswer,
  hasUnnegatedMatch,
  matchPolarity,
} from '../modes/scoring/shortAnswerGrader.js';

describe('open-ended marking declines rather than guessing (audit finding 2)', () => {
  describe('reproduction 1: a correct short answer is no longer marked wrong', () => {
    const model =
      'Scientists estimate that half the world’s coral reefs — about 50% — have already been lost since the 1950s.';

    it('refers "50%" to a teacher instead of scoring it zero', () => {
      const r = gradeShortAnswer('50%', { expected: model, marks: 2 });

      // The old behaviour: fraction 0, reason 'no-match', reported as wrong.
      expect(r.needsReview).toBe(true);
      expect(r.trace.reason).toBe('no-marking-key');
    });

    it('scores it outright once the question has a real marking key', () => {
      // What the audit asks for: model answers separated from marking keys.
      const r = gradeShortAnswer('50%', {
        expected: model,
        accepts: ['50%', 'half', 'half of them', '50 percent'],
        marks: 2,
      });

      expect(r.fraction).toBe(1);
      expect(r.needsReview).toBe(false);
    });
  });

  describe('reproduction 2: a bare keyword no longer earns an explanation mark', () => {
    const opts = {
      expected: 'It means going against what most people are doing or thinking.',
      keywords: ['against', 'opposite', 'most people', 'majority', 'tide'],
    };

    it('refers a single keyword on a multi-mark question to a teacher', () => {
      const r = gradeShortAnswer('tide', { ...opts, marks: 2 });

      expect(r.fraction).toBeLessThan(1);
      expect(r.needsReview).toBe(true);
      expect(r.trace.reason).toBe('keyword-only-multi-mark');
      // The hit is preserved as evidence for the teacher, not discarded.
      expect(r.trace.hits).toContain('tide');
    });

    it('still credits a keyword outright on a one-mark question', () => {
      // A one-mark factual question is what keyword matching is actually for.
      const r = gradeShortAnswer('tide', { ...opts, marks: 1 });
      expect(r.fraction).toBe(1);
      expect(r.needsReview).toBe(false);
    });

    it('still reports a clean miss as a reliable zero', () => {
      const r = gradeShortAnswer('I do not know', { ...opts, marks: 2 });
      expect(r.fraction).toBe(0);
      expect(r.needsReview).toBe(false);
      expect(r.trace.reason).toBe('no-keyword-hit');
    });
  });

  describe('reproduction 3: negated answers no longer match the keyword', () => {
    const affirmativeModel = 'It is urgent because the reefs are dying quickly.';

    // All three were counted as hits for "urgent".
    for (const answer of [
      'It is not at all urgent',
      'Never urgent',
      'It is no longer urgent',
      'It is not urgent',
      "It isn't urgent at all",
    ]) {
      it(`refuses "${answer}" as a match for "urgent"`, () => {
        expect(matchPolarity(answer, 'urgent')).toBe('negated');

        const r = gradeShortAnswer(answer, {
          expected: affirmativeModel,
          keywords: ['urgent'],
          marks: 1,
        });
        expect(r.fraction).toBe(0);
      });
    }

    it('still credits a genuinely affirmative answer', () => {
      const r = gradeShortAnswer('It is urgent because the reefs are dying', {
        expected: affirmativeModel,
        keywords: ['urgent'],
        marks: 1,
      });
      expect(r.fraction).toBe(1);
    });

    it('keeps the fronted-inversion exemption, which is a real pattern', () => {
      // "Never had I seen..." is an inversion trigger, not a denial of "seen".
      expect(hasUnnegatedMatch('Never had the champion lost a match.', 'lost')).toBe(true);
      // Without the auxiliary it is an ordinary denial.
      expect(hasUnnegatedMatch('Never urgent.', 'urgent')).toBe(false);
    });

    it('keeps the not-only and no-sooner exemptions', () => {
      expect(
        hasUnnegatedMatch('The complex is not only affordable but also convenient.', 'affordable'),
      ).toBe(true);
      expect(hasUnnegatedMatch('No sooner had he sat down than the bell rang.', 'sat down')).toBe(
        true,
      );
    });

    it('does not let polarity reject a lexically-negated paraphrase', () => {
      // "avoided getting drenched" means the same as "would not have got
      // drenched" but is grammatically affirmative. Rejecting it would fail a
      // correct answer, so polarity only ever rejects a denial.
      const model = 'If they had brought umbrellas, they would not have got drenched.';
      const r = gradeShortAnswer(
        'If they had brought umbrellas, they could have avoided getting drenched.',
        {
          expected: model,
          requiredGroups: [['could have avoided', 'would not have got'], ['drenched']],
        },
      );
      expect(r.fraction).toBe(1);
    });
  });
});
