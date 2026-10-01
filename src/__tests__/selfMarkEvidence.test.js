/**
 * Audit 2026-09-19, Finding 3 — guided self-marks inflate mastery.
 *
 * The reproduction in the audit: type "cat" for a model answer "The cat is
 * hungry", reveal the model, then click "I got this" ten times. Mastery rose
 * from its 0.5 default to 0.9463129088 without a second answer.
 *
 * Two separate defects sit behind that number, so they are tested separately:
 *   1. `updateSkill` took a boolean, not an evidence level, so a self-report
 *      moved the same score an independent answer moves.
 *   2. Nothing was idempotent, so one committed response could be banked
 *      repeatedly just by clicking again.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { EVIDENCE } from '../modules/evidence.js';

describe('self-marks cannot manufacture mastery (audit finding 3)', () => {
  beforeEach(() => {
    store.reset();
  });

  it('does not raise mastery for ten repeated self-reports', () => {
    for (let i = 0; i < 10; i++) {
      questMastery.updateSkill('openResponse', 'comprehension', true, {
        evidence: EVIDENCE.GUIDED,
      });
    }

    // The audit measured 0.9463129088 here.
    expect(questMastery.getSkillScore('openResponse', 'comprehension')).toBe(0.5);
  });

  it('records guided work as practice accuracy rather than mastery', () => {
    questMastery.updateSkill('openResponse', 'comprehension', true, {
      evidence: EVIDENCE.GUIDED,
    });

    const practice = questMastery.getPracticeRecord('openResponse', 'comprehension');
    expect(practice.attempts).toBe(1);
    expect(practice.correct).toBe(1);
    expect(questMastery.getSkillScore('openResponse', 'comprehension')).toBe(0.5);
  });

  it('ignores a repeated commit of the same attempt id', () => {
    const opts = { evidence: EVIDENCE.INDEPENDENT, attemptId: 'q1:commit' };

    const first = questMastery.updateSkill('grammarMcq', 'articles', true, opts);
    for (let i = 0; i < 9; i++) {
      questMastery.updateSkill('grammarMcq', 'articles', true, opts);
    }

    expect(questMastery.getSkillScore('grammarMcq', 'articles')).toBe(first);
  });

  it('lets a changed judgement replace the previous reflection, not stack on it', () => {
    const attemptId = 'q1:commit';

    questMastery.updateSkill('openResponse', 'comprehension', true, {
      evidence: EVIDENCE.GUIDED,
      attemptId,
    });
    questMastery.updateSkill('openResponse', 'comprehension', false, {
      evidence: EVIDENCE.GUIDED,
      attemptId,
    });

    const practice = questMastery.getPracticeRecord('openResponse', 'comprehension');
    expect(practice.attempts).toBe(1);
    expect(practice.correct).toBe(0);
  });

  it('still moves mastery for genuine independent evidence', () => {
    const next = questMastery.updateSkill('grammarMcq', 'articles', true, {
      evidence: EVIDENCE.INDEPENDENT,
    });

    expect(next).toBeGreaterThan(0.5);
    expect(questMastery.getSkillScore('grammarMcq', 'articles')).toBe(next);
  });

  it('treats an unspecified evidence level as independent, as before', () => {
    const next = questMastery.updateSkill('grammarMcq', 'articles', true);
    expect(next).toBeGreaterThan(0.5);
  });
});
