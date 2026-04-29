import { describe, it, expect } from 'vitest';
import {
  TRAINING_STAGES,
  normaliseSkillTag,
  getSkillLabel,
  getClueTypeLabel,
  getReviewPromptForSkill,
  getMasteryRecommendation,
} from '../modes/examTrainingFramework.js';

describe('examTrainingFramework', () => {

  it('exports the full learn-to-mastery stage sequence', () => {
    expect(TRAINING_STAGES).toEqual(['LEARN', 'GUIDED', 'EXAM', 'REVIEW', 'MASTERY']);
  });
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
