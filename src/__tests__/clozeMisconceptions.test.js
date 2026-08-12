import { beforeEach, describe, expect, it } from 'vitest';
import { store } from '../modules/store.js';
import { stemForBlank } from '../modules/answerDiagnosis.js';
import { buildWhyWrongExplanation } from '../modes/examTrainingFramework.js';
import {
  getMisconceptionSummary,
  recordMisconceptionsFromReview,
} from '../modules/teacherFeedback.js';

beforeEach(() => {
  store.set('misconceptionLog', {});
});

describe('stemForBlank', () => {
  const text = 'I have ___ mother and ___ father. They live in ___ big house.';
  const answers = ['a', 'a', 'a'];

  it('keeps only the target blank open and fills its siblings', () => {
    expect(stemForBlank(text, 0, answers)).toBe('I have ___ mother and a father.');
    expect(stemForBlank(text, 1, answers)).toBe('I have a mother and ___ father.');
  });

  it('returns just the sentence the blank sits in', () => {
    expect(stemForBlank(text, 2, answers)).toBe('They live in ___ big house.');
  });

  it('marks unanswered siblings rather than dropping them', () => {
    expect(stemForBlank(text, 0, [])).toBe('I have ___ mother and … father.');
  });

  it('survives text with no blanks', () => {
    expect(stemForBlank('No blanks here.', 0, [])).toBe('No blanks here.');
    expect(stemForBlank('', 0, [])).toBe('');
  });
});

describe('buildWhyWrongExplanation', () => {
  it('names the misconception when the passage has no authored trap', () => {
    const why = buildWhyWrongExplanation({
      meta: { primarySkill: 'grammar' },
      chosen: 'a',
      correct: 'an',
      stem: 'I have ___ older sister.',
    });

    expect(why.misconceptionId).toBe('article-sound');
    expect(why.whyWrong).toContain('choosing a or an by the letter instead of the sound');
    expect(why.examTip).toContain('Whisper the word');
  });

  it('still prefers an authored trap over the detected one', () => {
    const why = buildWhyWrongExplanation({
      meta: {
        primarySkill: 'grammar',
        wrongOptionTraps: { a: 'Listen to "older" — it opens with a vowel.' },
      },
      chosen: 'a',
      correct: 'an',
      stem: 'I have ___ older sister.',
    });

    expect(why.whyWrong).toBe('Listen to "older" — it opens with a vowel.');
    expect(why.misconceptionId).toBe('article-sound');
  });

  it('offers the detected clue when no expected thinking is authored', () => {
    const why = buildWhyWrongExplanation({
      meta: { primarySkill: 'tense' },
      chosen: 'walks',
      correct: 'walked',
      stem: 'Yesterday she ___ to the market.',
    });

    expect(why.missedClue).toBe('The clue was "yesterday".');
  });

  it('handles a blank left empty', () => {
    const why = buildWhyWrongExplanation({ chosen: '', correct: 'an', stem: 'I have ___ apple.' });
    expect(why.misconceptionId).toBe('no-answer');
    expect(why.whyWrong).toBe('No answer was chosen for this blank.');
  });
});

describe('recordMisconceptionsFromReview', () => {
  const rows = [
    { misconceptionId: 'article-sound', status: 'Try again', skillTag: 'grammar' },
    { misconceptionId: 'article-sound', status: 'Correct', skillTag: 'grammar' },
    { misconceptionId: 'tense-time-marker', status: 'Try again', skillTag: 'tense' },
  ];

  it('logs only the wrong rows', () => {
    recordMisconceptionsFromReview(rows, { mode: 'clozeCastle' });
    recordMisconceptionsFromReview(rows, { mode: 'clozeCastle' });

    const log = store.get('misconceptionLog');
    expect(log['article-sound'].count).toBe(2);
    expect(log['tense-time-marker'].count).toBe(2);
    expect(log['article-sound'].modes.clozeCastle).toBe(2);
  });

  it('pools with the MCQ modes so one habit reads as one habit', () => {
    recordMisconceptionsFromReview(
      [{ misconceptionId: 'article-sound', status: 'Try again', skillTag: 'grammar' }],
      { mode: 'clozeCastle' },
    );
    recordMisconceptionsFromReview(
      [{ misconceptionId: 'article-sound', status: 'Try again', skillTag: 'articles' }],
      { mode: 'grammarMcq' },
    );

    const [top] = getMisconceptionSummary();
    expect(top.id).toBe('article-sound');
    expect(top.count).toBe(2);
    expect(top.modes.sort()).toEqual(['clozeCastle', 'grammarMcq']);
  });

  it('ignores rows without a diagnosis', () => {
    recordMisconceptionsFromReview([{ status: 'Try again' }, null], { mode: 'wordVault' });
    expect(store.get('misconceptionLog')).toEqual({});
  });
});
