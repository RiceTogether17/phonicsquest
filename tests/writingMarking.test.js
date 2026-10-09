import { describe, it, expect } from 'vitest';
import { writingPrompts } from '../src/data/writingPrompts.js';
import { writingLessonPacks } from '../src/data/writingLessonPacks.js';
import { evaluateWriting, computeMetrics } from '../src/modules/writingEvaluator.js';
import { mergeLessonWithPlan, getRemediationPath } from '../src/modules/writingLessonEngine.js';
import {
  findGrammarSlips,
  connectorLoad,
  englishShape,
  topicRelevance,
  isNarrativeTask,
} from '../src/modules/writingChecks.js';

/**
 * The writing marker used to pass nonsense padded with connectives, answers
 * to a different task and drafts full of grammar errors, while some of the
 * app's own model answers failed their own checks. These tests pin both
 * sides: every model passes, and each kind of weak draft does not.
 */

const NONSENSE =
  'Zorp blim flarn and gek. First wubble then splonk. Next frib because grop. Finally zat but yom. Moreover, blarg trop quib. However, flim flam zing.';
const DINOSAURS =
  'Dinosaurs lived a long time ago. They were very big and some ate plants. The T-rex had sharp teeth and long claws. Scientists dig up their bones in the desert. I like the long neck ones best because they are gentle giants.';

function basePrompts() {
  const seen = new Set();
  const out = [];
  for (const [level, list] of Object.entries(writingPrompts)) {
    for (const prompt of list) {
      const base = prompt.id.replace(/-v\d$/, '');
      if (seen.has(base)) continue;
      seen.add(base);
      out.push([Number(level), prompt]);
    }
  }
  return out;
}

const lessons = Object.values(writingLessonPacks).filter((p) => p.sampleAnswer);

describe('model answers pass their own task', () => {
  it.each(basePrompts().map(([level, p]) => [p.id, level, p]))(
    'free practice %s',
    (_id, level, prompt) => {
      const result = evaluateWriting(prompt, prompt.sampleAnswer, level);
      expect(result.passed).toBe(true);
      expect(result.observed.missingPoints).toEqual([]);
    },
  );

  it.each(lessons.map((p) => [p.id, p]))('lesson %s, missions included', (_id, lesson) => {
    const result = evaluateWriting(
      mergeLessonWithPlan(lesson, {}),
      lesson.sampleAnswer,
      lesson.level,
    );
    expect(result.passed).toBe(true);
    expect(result.observed.missingPoints).toEqual([]);
    expect(result.grammarSlips).toEqual([]);
  });
});

describe('weak drafts do not pass', () => {
  it.each(lessons.map((p) => [p.id, p]))('nonsense with connectives fails %s', (_id, lesson) => {
    const result = evaluateWriting(mergeLessonWithPlan(lesson, {}), NONSENSE, lesson.level);
    expect(result.passed).toBe(false);
  });

  it.each(lessons.map((p) => [p.id, p]))('an answer about dinosaurs fails %s', (_id, lesson) => {
    const result = evaluateWriting(mergeLessonWithPlan(lesson, {}), DINOSAURS, lesson.level);
    expect(result.passed).toBe(false);
  });

  it('a recount full of grammar errors is not passed, and the slips are named', () => {
    const prompt = writingPrompts[2][0];
    const result = evaluateWriting(
      prompt,
      'Last Saturday we goed to the zoo. We seen the monkeys and they was very funny. My brother eated an ice cream. Then we buyed a toy giraffe. I am happy because it were a fun day.',
      2,
    );
    expect(result.passed).toBe(false);
    expect(result.grammarSlips.map((s) => s.fix)).toEqual(
      expect.arrayContaining(['went', 'ate', 'bought', 'they were']),
    );
  });

  it('the same recount written correctly passes', () => {
    const prompt = writingPrompts[2][0];
    const result = evaluateWriting(
      prompt,
      'Last Saturday we went to the zoo. We saw the monkeys and they were very funny. My brother ate an ice cream. Then we bought a toy giraffe. I am happy because it was a fun day.',
      2,
    );
    expect(result.passed).toBe(true);
  });
});

describe('writing checks', () => {
  it('finds common grammar slips and leaves correct sentences alone', () => {
    expect(findGrammarSlips('We goed home and she were tired.').map((s) => s.fix)).toEqual([
      'went',
      'she was',
    ]);
    expect(findGrammarSlips('He has a cat. She does not like it. We were late.')).toEqual([]);
    expect(findGrammarSlips('I saw a elephant.').map((s) => s.fix)).toEqual(['an elephant']);
    expect(findGrammarSlips('I saw a unicorn and a one-eyed cat.')).toEqual([]);
  });

  it('spots connective stuffing but not normal linking', () => {
    expect(connectorLoad(NONSENSE).stuffed).toBe(true);
    expect(
      connectorLoad(
        'First, we packed our bags. Then we caught the bus to the beach because it was sunny.',
      ).stuffed,
    ).toBe(false);
  });

  it('tells English sentences from made-up words', () => {
    expect(englishShape(NONSENSE).looksLikeEnglish).toBe(false);
    expect(englishShape('My cat sleeps on the sofa every afternoon.').looksLikeEnglish).toBe(true);
  });

  it('scores an answer about another topic as off-topic', () => {
    const pet = writingLessonPacks['p1-lesson-my-pet'];
    expect(topicRelevance(pet, DINOSAURS).score).toBeLessThan(0.3);
    expect(topicRelevance(pet, pet.sampleAnswer).score).toBeGreaterThanOrEqual(0.3);
  });

  it('knows which tasks are stories', () => {
    expect(isNarrativeTask(writingLessonPacks['p4-lesson-broken-vase'])).toBe(true);
    expect(isNarrativeTask(writingLessonPacks['p4-lesson-email-invite'])).toBe(false);
    expect(isNarrativeTask(writingLessonPacks['p2-lesson-class-outing'])).toBe(false);
    expect(isNarrativeTask(writingLessonPacks['p1-bootcamp-sentences'])).toBe(false);
  });

  it('does not count an apostrophe as dialogue', () => {
    const lesson = writingLessonPacks['p3-lesson-rainy-court'];
    expect(computeMetrics(lesson, "It's raining and I can't find Mei's bag.", 3).hasDialogue).toBe(
      false,
    );
    expect(computeMetrics(lesson, '“Look out!” Mei shouted.', 3).hasDialogue).toBe(true);
  });

  it('gives an email no story advice', () => {
    const lesson = writingLessonPacks['p6-lesson-crossing-email'];
    const result = evaluateWriting(lesson, 'Dear Mr Lee, the road is busy. Thank you.', 6);
    const path = getRemediationPath(result);
    const advice = JSON.stringify(path).toLowerCase();
    expect(advice).not.toContain('climax');
    expect(advice).not.toContain('turning point');
  });
});
