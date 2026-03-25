import { describe, it, expect } from 'vitest';
import { writingLessonPacks, WRITING_TRACKS, getLessonsForTrack, validateLessonPackSchema } from '../src/data/writingLessonPacks.js';
import { evaluateWriting } from '../src/modules/writingEvaluator.js';
import { createPlanChecks, mergeLessonWithPlan, isPlanReady, getRemediationPath } from '../src/modules/writingLessonEngine.js';

describe('writing lesson packs schema', () => {
  it('validates all packs in the P3 T1 track', () => {
    const lessons = getLessonsForTrack(WRITING_TRACKS.p3t1Creative.id);
    expect(lessons.length).toBeGreaterThanOrEqual(6);
    lessons.forEach((pack) => expect(validateLessonPackSchema(pack)).toBe(true));
  });

  it('uses structured requiredChecks for non-quiz lessons', () => {
    Object.values(writingLessonPacks)
      .filter((pack) => pack.lessonType !== 'bossQuiz')
      .forEach((pack) => {
        expect(Array.isArray(pack.requiredChecks)).toBe(true);
        expect(pack.requiredChecks.length).toBeGreaterThan(0);
      });
  });
});

describe('planner to draft flow helpers', () => {
  it('requires complete plot fields before drafting', () => {
    expect(isPlanReady({ introduction: 'a', risingAction: 'b', climax: 'c', fallingAction: 'd', conclusion: 'e' })).toBe(false);
    expect(isPlanReady({
      introduction: 'The hall was dark and quiet.',
      risingAction: 'I heard a noise and looked behind me.',
      climax: 'A cat jumped from the shelf.',
      fallingAction: 'I laughed and opened the window.',
      conclusion: 'I learned to check before panicking.',
    })).toBe(true);
  });

  it('converts plan points into extra required checks', () => {
    const lesson = writingLessonPacks['p3-lesson-rainy-court'];
    const merged = mergeLessonWithPlan(lesson, {
      introduction: 'Rainy court with broken umbrella',
      climax: 'Found the missing keychain',
    });
    expect(merged.requiredChecks.length).toBeGreaterThan(lesson.requiredChecks.length);
    expect(createPlanChecks({ introduction: 'Rainy court with broken umbrella' })[0].keywordsAny.length).toBeGreaterThan(0);
  });
});

describe('requiredChecks + remediation behavior', () => {
  it('flags missing checks and routes remediation mission', () => {
    const lesson = writingLessonPacks['p3-lesson-lost-key'];
    const result = evaluateWriting(lesson, 'I walked into the library. I looked around.', 3);
    const remediation = getRemediationPath(result);
    expect(result.metrics.requiredHits).toBeLessThan(result.metrics.requiredTotal);
    expect(remediation.missingChecks.length).toBeGreaterThan(0);
  });
});
