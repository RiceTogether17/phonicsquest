import { beforeEach, describe, expect, it } from 'vitest';
import { store } from '../modules/store.js';
import {
  DEFAULT_MAX_ATTEMPTS,
  PATTERN_THRESHOLD,
  buildTeacherFeedback,
  buildWrittenFeedback,
  creditMisconception,
  getMisconceptionPattern,
  getMisconceptionSummary,
  recordMisconception,
  renderTeacherFeedbackHtml,
  teacherFeedbackText,
} from '../modules/teacherFeedback.js';

const SVA_ITEM = {
  stem: 'The boys ___ playing football.',
  answer: 'are',
  skill: 'svAgreement',
  skillLabel: 'Subject–verb agreement',
};

function kindsOf(feedback) {
  return feedback.sections.map((s) => s.kind);
}

function findSection(feedback, kind) {
  return feedback.sections.find((s) => s.kind === kind) || null;
}

beforeEach(() => {
  store.set('misconceptionLog', {});
});

describe('the feedback ladder', () => {
  it('withholds the answer on the first wrong attempt', () => {
    const fb = buildTeacherFeedback({ ...SVA_ITEM, given: 'is', correct: false, attempt: 1 });

    expect(fb.stage).toBe('coach');
    expect(fb.allowRetry).toBe(true);
    expect(fb.revealAnswer).toBe(false);
    expect(kindsOf(fb)).toContain('cue');
    expect(teacherFeedbackText(fb)).not.toContain('are');
  });

  it('re-teaches and reveals the answer on the second', () => {
    const fb = buildTeacherFeedback({ ...SVA_ITEM, given: 'is', correct: false, attempt: 2 });

    expect(fb.stage).toBe('reteach');
    expect(fb.allowRetry).toBe(false);
    expect(fb.revealAnswer).toBe(true);
    expect(fb.misconceptionId).toBe('subject-verb-agreement');
    expect(kindsOf(fb)).toEqual(
      expect.arrayContaining(['noticed', 'answer', 'rule', 'example', 'strategy', 'transfer']),
    );
    expect(findSection(fb, 'answer').text).toBe('are');
    expect(findSection(fb, 'noticed').text).toContain('"is"');
  });

  it('defaults to one re-think before revealing', () => {
    expect(DEFAULT_MAX_ATTEMPTS).toBe(2);
    const single = buildTeacherFeedback({
      ...SVA_ITEM,
      given: 'is',
      correct: false,
      attempt: 1,
      maxAttempts: 1,
    });
    expect(single.stage).toBe('reteach');
  });

  it('explains why a correct answer is correct', () => {
    const fb = buildTeacherFeedback({
      ...SVA_ITEM,
      given: 'are',
      correct: true,
      rule: 'More than one thing takes "are".',
    });

    expect(fb.stage).toBe('praise');
    expect(findSection(fb, 'why').text).toBe('More than one thing takes "are".');
  });

  it('credits the second look when the child self-corrects', () => {
    const fb = buildTeacherFeedback({ ...SVA_ITEM, given: 'are', correct: true, attempt: 2 });

    expect(fb.stage).toBe('praise-recovered');
    expect(teacherFeedbackText(fb)).toContain('second check');
  });

  it('names the missing time signal in its cue without giving the answer', () => {
    const fb = buildTeacherFeedback({
      stem: 'Yesterday she ___ to the market.',
      given: 'walks',
      answer: 'walked',
      correct: false,
      attempt: 1,
    });

    expect(fb.misconceptionId).toBe('tense-time-marker');
    expect(findSection(fb, 'evidence').text).toBe('yesterday');
    expect(teacherFeedbackText(fb)).not.toContain('walked');
  });

  it('prefers an authored explanation over the generic one', () => {
    const fb = buildTeacherFeedback({
      ...SVA_ITEM,
      given: 'is',
      correct: false,
      attempt: 2,
      authoredExplanation: '"Boys" is plural, so the verb must be <strong>are</strong>.',
    });

    const why = findSection(fb, 'why');
    expect(why.html).toContain('<strong>are</strong>');
  });

  it('treats a blank answer as its own case', () => {
    const fb = buildTeacherFeedback({ ...SVA_ITEM, given: '', correct: false, attempt: 2 });
    expect(fb.misconceptionId).toBe('no-answer');
  });
});

describe('pattern tracking', () => {
  it('does not log a misconception while the child still has a retry', () => {
    buildTeacherFeedback({ ...SVA_ITEM, given: 'is', correct: false, attempt: 1 });
    expect(store.get('misconceptionLog')).toEqual({});
  });

  it('logs once the answer has been revealed', () => {
    buildTeacherFeedback({
      ...SVA_ITEM,
      given: 'is',
      correct: false,
      attempt: 2,
      mode: 'grammarMcq',
    });
    const log = store.get('misconceptionLog');
    expect(log['subject-verb-agreement'].count).toBe(1);
    expect(log['subject-verb-agreement'].skills.svAgreement).toBe(1);
    expect(log['subject-verb-agreement'].modes.grammarMcq).toBe(1);
  });

  it('names the pattern only once it recurs', () => {
    for (let i = 1; i < PATTERN_THRESHOLD; i++) {
      const fb = buildTeacherFeedback({ ...SVA_ITEM, given: 'is', correct: false, attempt: 2 });
      expect(fb.pattern).toBeNull();
    }
    const fb = buildTeacherFeedback({ ...SVA_ITEM, given: 'is', correct: false, attempt: 2 });
    expect(fb.pattern.count).toBe(PATTERN_THRESHOLD);
    expect(findSection(fb, 'pattern').text).toContain(`${PATTERN_THRESHOLD} times`);
  });

  it('retires a pattern after three clean answers', () => {
    for (let i = 0; i < PATTERN_THRESHOLD; i++)
      recordMisconception('subject-verb-agreement', { skill: 'svAgreement' });
    expect(getMisconceptionPattern('subject-verb-agreement')).not.toBeNull();

    creditMisconception('subject-verb-agreement');
    creditMisconception('subject-verb-agreement');
    expect(getMisconceptionPattern('subject-verb-agreement')).not.toBeNull();

    creditMisconception('subject-verb-agreement');
    expect(getMisconceptionPattern('subject-verb-agreement')).toBeNull();
  });

  it('a correct answer credits the misconception the item targets', () => {
    for (let i = 0; i < PATTERN_THRESHOLD; i++)
      recordMisconception('subject-verb-agreement', { skill: 'svAgreement' });

    for (let i = 0; i < 3; i++) {
      buildTeacherFeedback({ ...SVA_ITEM, given: 'is', answer: 'are', correct: true });
    }
    expect(getMisconceptionPattern('subject-verb-agreement')).toBeNull();
  });

  it('ignores stale entries', () => {
    const old = new Date(Date.now() - 40 * 86_400_000).toISOString();
    store.set('misconceptionLog', {
      'subject-verb-agreement': {
        count: 9,
        skills: {},
        modes: {},
        firstSeen: old,
        lastSeen: old,
        cleanStreak: 0,
      },
    });
    expect(getMisconceptionPattern('subject-verb-agreement')).toBeNull();
    expect(getMisconceptionSummary()).toEqual([]);

    // a fresh occurrence restarts the count rather than resuming the old one
    expect(recordMisconception('subject-verb-agreement', {}).count).toBe(1);
  });

  it('summarises the live patterns strongest first', () => {
    recordMisconception('subject-verb-agreement', { skill: 'svAgreement', mode: 'grammarMcq' });
    recordMisconception('subject-verb-agreement', { skill: 'svAgreement', mode: 'grammarMcq' });
    recordMisconception('article-sound', { skill: 'articles', mode: 'clozeCastle' });
    recordMisconception('article-sound', { skill: 'articles', mode: 'clozeCastle' });
    recordMisconception('article-sound', { skill: 'articles', mode: 'clozeCastle' });

    const summary = getMisconceptionSummary();
    expect(summary.map((s) => s.id)).toEqual(['article-sound', 'subject-verb-agreement']);
    expect(summary[0].count).toBe(3);
    expect(summary[0].skills).toEqual(['articles']);
    expect(summary[0].modes).toEqual(['clozeCastle']);
  });

  it('leaves one-off slips out of the summary', () => {
    recordMisconception('article-sound', { skill: 'articles' });
    expect(getMisconceptionSummary()).toEqual([]);
  });
});

describe('written feedback', () => {
  it('flags a synthesis answer that ignores the required opening', () => {
    const fb = buildWrittenFeedback({
      correct: false,
      attempt: 2,
      given: 'He sat down and the bell rang.',
      model: 'No sooner had he sat down than the bell rang.',
      requiredWords: ['no', 'sooner'],
      domain: 'writing',
    });

    expect(fb.misconceptionId).toBe('structure-not-followed');
    expect(findSection(fb, 'evidence').text).toContain('sooner');
  });

  it('coaches before revealing the model answer', () => {
    const fb = buildWrittenFeedback({
      correct: false,
      attempt: 1,
      given: 'She was late.',
      model: 'She was late because the bus broke down on the way to school.',
    });

    expect(fb.stage).toBe('coach');
    expect(teacherFeedbackText(fb)).not.toContain('bus broke down');
  });
});

describe('rendering', () => {
  it('escapes child input and keeps authored formatting', () => {
    const fb = buildTeacherFeedback({
      ...SVA_ITEM,
      given: '<script>x</script>',
      correct: false,
      attempt: 2,
      authoredExplanation: 'Use <strong>are</strong>.',
    });

    const html = renderTeacherFeedbackHtml(fb);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('<strong>are</strong>');
    expect(html).toContain('tf-feedback--reteach');
  });

  it('renders nothing for absent feedback', () => {
    expect(renderTeacherFeedbackHtml(null)).toBe('');
    expect(teacherFeedbackText(null)).toBe('');
  });
});
