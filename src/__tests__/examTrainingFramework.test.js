import { describe, it, expect } from 'vitest';
import {
  normaliseSkillTag,
  getSkillLabel,
  getClueTypeLabel,
  getReviewPromptForSkill,
  getMasteryRecommendation,
} from '../modes/examTrainingFramework.js';

describe('examTrainingFramework', () => {
  it('normalises unknown skill tags to sentenceLogic', () => {
    expect(normaliseSkillTag('tense')).toBe('tense');
    expect(normaliseSkillTag('unknown')).toBe('sentenceLogic');
  });

  it('returns labels for skills and clue types', () => {
    expect(getSkillLabel('subjectVerbAgreement')).toBe('Subject-verb agreement');
    expect(getClueTypeLabel('contrastClue')).toBe('Contrast clue');
    expect(getClueTypeLabel('random')).toBe('Sentence clue');
  });

  it('returns review prompts and recommendation text', () => {
    expect(getReviewPromptForSkill('connectorLogic')).toContain('contrast');
    expect(getMasteryRecommendation({ weakSkills: ['tense'], hintsUsed: 0, accuracy: 55 })).toContain('Retry');
    expect(getMasteryRecommendation({ weakSkills: [], hintsUsed: 0, accuracy: 95 })).toContain('harder level');
  });
});
