/*
 * Audit 2026-09-19, Finding 15 — primary mastery merges different skills and
 * evidence types.
 *
 * questMastery stored an exponential moving average with no item diversity and
 * no evidence metadata, and its cross-quest alias table mixed simple past with
 * the continuous tenses, comparatives with superlatives, and idioms with
 * proverbs. Averaging across those let success in one skill speak for a skill
 * the child had never attempted.
 *
 * Separately, one answer in the six-item Quick Check was enough to create a
 * category signal: with alpha 0.45 a single correct answer moves the score from
 * 0.5 to 0.725, and the printed parent report rendered that as "73%" with
 * nothing to say how thin it was.
 *
 * The audit's acceptance criterion: success with comparatives cannot establish
 * superlative mastery, and confidence depends on varied samples.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { EVIDENCE } from '../modules/evidence.js';

const independent = { evidence: EVIDENCE.INDEPENDENT };

describe('mastery does not merge unlike skills (audit finding 15)', () => {
  beforeEach(() => {
    store.reset();
  });

  it('does not let comparatives practice establish superlative mastery', () => {
    // The audit's named case. These are taught together and assessed apart.
    for (let i = 0; i < 10; i++) {
      questMastery.updateSkill('grammarMcq', 'comparatives', true, {
        ...independent,
        attemptId: `cmp-${i}`,
      });
    }

    expect(questMastery.getSkillScore('grammarMcq', 'comparatives')).toBeGreaterThan(0.8);
    // Superlatives were never attempted, so they stay at the default.
    expect(questMastery.getUnifiedSkillScore('superlatives', 'grammarMcq')).toBe(0.5);
    expect(questMastery.getSkillScore('grammarMcq', 'superlatives')).toBe(0.5);
  });

  it('keeps simple past away from the continuous tenses', () => {
    for (let i = 0; i < 10; i++) {
      questMastery.updateSkill('grammarMcq', 'simplePast', true, {
        ...independent,
        attemptId: `sp-${i}`,
      });
    }

    // Different aspect, not a harder version of the same thing.
    expect(questMastery.getUnifiedSkillScore('presentCont', 'grammarMcq')).toBe(0.5);
    expect(questMastery.getUnifiedSkillScore('pastCont', 'grammarMcq')).toBe(0.5);
  });

  it('keeps idioms away from proverbs', () => {
    for (let i = 0; i < 10; i++) {
      questMastery.updateSkill('vocabMcq', 'idiomaticExpressions', true, {
        ...independent,
        attemptId: `idm-${i}`,
      });
    }

    expect(questMastery.getUnifiedSkillScore('proverbsSayings', 'vocabMcq')).toBe(0.5);
  });

  it('still blends the same construct measured in two quests', () => {
    // This is what the alias table is legitimately for: Grammar Cloze's
    // `preposition_clue` and Grammar MCQ's `prepositions` are one skill.
    for (let i = 0; i < 10; i++) {
      questMastery.updateSkill('clozeCastle', 'preposition_clue', true, {
        ...independent,
        attemptId: `prep-${i}`,
      });
    }

    expect(questMastery.getUnifiedSkillScore('prepositions', 'grammarMcq')).toBeGreaterThan(0.8);
  });

  it('offers the unlike skills as suggestions instead of scores', () => {
    // Removing them from the score must not lose the teaching link.
    expect(questMastery.getRelatedSkills('comparatives')).toContain('superlatives');
    expect(questMastery.getRelatedSkills('simplePast')).toContain('presentCont');
    expect(questMastery.getRelatedSkills('idiomaticExpressions')).toContain('proverbsSayings');

    // And a same-construct pair is not duplicated into the related table.
    expect(questMastery.getRelatedSkills('articles')).not.toContain('grammarArticles');
  });
});

describe('a mastery score carries its sample size (audit finding 15)', () => {
  beforeEach(() => {
    store.reset();
  });

  it('flags a score built from one Quick Check answer as an early indication', () => {
    questMastery.updateSkill('primaryQuickCheck', 'comparatives', true, {
      ...independent,
      alpha: 0.45,
    });

    // The number the printed report would show.
    expect(Math.round(questMastery.getSkillScore('primaryQuickCheck', 'comparatives') * 100)).toBe(
      73,
    );

    expect(questMastery.getSkillSample('primaryQuickCheck', 'comparatives')).toEqual({
      attempts: 1,
      correct: 1,
    });
    expect(questMastery.getSkillConfidence('primaryQuickCheck', 'comparatives')).toBe('low');
    expect(questMastery.isEarlyIndication('primaryQuickCheck', 'comparatives')).toBe(true);
  });

  it('stops calling it early once there are enough independent attempts', () => {
    for (let i = 0; i < 6; i++) {
      questMastery.updateSkill('grammarMcq', 'articles', true, {
        ...independent,
        attemptId: `a-${i}`,
      });
    }

    expect(questMastery.getSkillSample('grammarMcq', 'articles').attempts).toBe(6);
    expect(questMastery.getSkillConfidence('grammarMcq', 'articles')).toBe('moderate');
    expect(questMastery.isEarlyIndication('grammarMcq', 'articles')).toBe(false);
  });

  it('reports no confidence for a skill with no independent evidence', () => {
    // Guided work is practice; it moves no score and adds no sample.
    questMastery.updateSkill('openResponse', 'comprehension', true, {
      evidence: EVIDENCE.GUIDED,
    });

    expect(questMastery.getSkillSample('openResponse', 'comprehension').attempts).toBe(0);
    expect(questMastery.getSkillConfidence('openResponse', 'comprehension')).toBe('none');
    expect(questMastery.isEarlyIndication('openResponse', 'comprehension')).toBe(true);
  });

  it('does not double-count a revised judgement', () => {
    const opts = { ...independent, attemptId: 'one-response' };
    questMastery.updateSkill('grammarMcq', 'articles', true, opts);
    questMastery.updateSkill('grammarMcq', 'articles', false, opts);

    expect(questMastery.getSkillSample('grammarMcq', 'articles')).toEqual({
      attempts: 1,
      correct: 0,
    });
  });
});
