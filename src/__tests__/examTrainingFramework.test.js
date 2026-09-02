import { describe, it, expect } from 'vitest';
import {
  TRAINING_STAGES,
  normaliseSkillTag,
  getSkillLabel,
  getClueTypeLabel,
  getReviewPromptForSkill,
  getMasteryRecommendation,
  getBlankSkillMeta,
  buildWhyWrongExplanation,
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
    expect(
      getMasteryRecommendation({ weakSkills: ['tense'], hintsUsed: 0, accuracy: 55 }),
    ).toContain('Retry');
    expect(getMasteryRecommendation({ weakSkills: [], hintsUsed: 0, accuracy: 95 })).toContain(
      'harder level',
    );
  });
});

describe('getBlankSkillMeta', () => {
  it('reads the rich object form positionally', () => {
    const passage = {
      blankSkills: [
        {
          primarySkill: 'connectorLogic',
          clueType: 'contrastClue',
          expectedThinking: 'The word "although" shows an opposite idea.',
          correctReason: 'The answer must show disappointment.',
          wrongOptionTraps: { excited: 'Opposite meaning.' },
          examTip: 'Look for connectors before choosing.',
        },
      ],
    };
    const meta = getBlankSkillMeta(passage, 0);
    expect(meta.primarySkill).toBe('connectorLogic');
    expect(meta.clueType).toBe('contrastClue');
    expect(meta.expectedThinking).toContain('although');
    expect(meta.wrongOptionTraps.excited).toContain('Opposite');
    expect(meta.examTip).toContain('connectors');
  });

  it('finds rich entries by blankIndex when sparsely positioned', () => {
    const passage = {
      blankSkills: [{ blankIndex: 2, primarySkill: 'tense', clueType: 'timeClue' }],
    };
    const meta = getBlankSkillMeta(passage, 2);
    expect(meta.primarySkill).toBe('tense');
    expect(meta.clueType).toBe('timeClue');
  });

  it('falls back to clue + passage-level fields and string tags', () => {
    const passage = {
      blankSkills: ['tense'],
      clues: [
        {
          blankIndex: 0,
          clueType: 'timeClue',
          prompt: 'Find the time word.',
          explanation: 'past tense fits.',
        },
      ],
      simpleMeaning: 'felt sad',
      partOfSpeech: 'verb',
      wrongOptionTraps: [{ option: 'happy', reason: 'wrong tone' }],
    };
    const meta = getBlankSkillMeta(passage, 0);
    expect(meta.primarySkill).toBe('tense');
    expect(meta.clueType).toBe('timeClue');
    expect(meta.expectedThinking).toContain('time word');
    expect(meta.simpleMeaning).toBe('felt sad');
    expect(meta.partOfSpeech).toBe('verb');
    expect(meta.wrongOptionTraps.happy).toBe('wrong tone');
  });

  it('returns a sentenceLogic default for missing metadata', () => {
    expect(getBlankSkillMeta({}, 0).primarySkill).toBe('sentenceLogic');
  });
});

describe('buildWhyWrongExplanation', () => {
  it('uses trap reasons and correctReason when present', () => {
    const out = buildWhyWrongExplanation({
      meta: {
        primarySkill: 'connectorLogic',
        clueType: 'contrastClue',
        expectedThinking: 'although signals contrast',
        correctReason: 'The answer must show fear.',
        wrongOptionTraps: { excited: 'Opposite meaning.' },
        examTip: 'Look for connectors first.',
      },
      chosen: 'excited',
      correct: 'nervous',
    });
    expect(out.whyWrong).toBe('Opposite meaning.');
    expect(out.whyRight).toContain('fear');
    expect(out.missedClue).toContain('although');
    expect(out.examTip).toContain('connectors');
  });

  it('falls back gracefully when no metadata is provided', () => {
    const out = buildWhyWrongExplanation({ chosen: 'happy', correct: 'sad' });
    expect(out.whyWrong).toContain('happy');
    expect(out.whyRight).toContain('sad');
    expect(out.missedClue).toMatch(/before|after|clue/i);
    expect(out.examTip.length).toBeGreaterThan(0);
  });

  it('handles a missing chosen answer without crashing', () => {
    const out = buildWhyWrongExplanation({ correct: 'nervous' });
    expect(out.whyWrong).toMatch(/no answer/i);
  });
});
