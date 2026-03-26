import { describe, it, expect, beforeEach } from 'vitest';
import { writingLessonPacks, WRITING_TRACKS, getLessonsForTrack, getTracksForLevel, validateLessonPackSchema } from '../src/data/writingLessonPacks.js';
import { evaluateWriting } from '../src/modules/writingEvaluator.js';
import { createPlanChecks, mergeLessonWithPlan, isPlanReady, getRemediationPath, getParagraphMissionStatus } from '../src/modules/writingLessonEngine.js';
import { gradeDrills } from '../src/modules/writingReviseDrills.js';
import { store } from '../src/modules/store.js';
import { getTrackProgress, setTrackProgress, migrateLegacyWritingCompleted } from '../src/modules/writingTrackProgress.js';

describe('writing lesson packs schema', () => {
  it('validates all packs in P3 tracks', () => {
    const lessons = [...getLessonsForTrack(WRITING_TRACKS.p3t1Creative.id), ...getLessonsForTrack(WRITING_TRACKS.p3t2Creative.id)];
    expect(lessons.length).toBeGreaterThanOrEqual(13);
    lessons.forEach((pack) => expect(validateLessonPackSchema(pack)).toBe(true));
  });

  it('supports multiple tracks for level 3', () => {
    const tracks = getTracksForLevel(3);
    expect(tracks.map((t) => t.id)).toContain('p3t1Creative');
    expect(tracks.map((t) => t.id)).toContain('p3t2Creative');
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

describe('planner + missions + remediation helpers', () => {
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

  it('tracks paragraph mission completion from text', () => {
    const lesson = writingLessonPacks['p3t2-lesson-market-rush'];
    const status = getParagraphMissionStatus(lesson, 'Steam rose from the stall. Suddenly I slipped, but finally we were safe in the end.');
    expect(status.some((m) => m.hit)).toBe(true);
  });

  it('flags missing checks and routes remediation mission', () => {
    const lesson = writingLessonPacks['p3-lesson-lost-key'];
    const result = evaluateWriting(lesson, 'I walked into the library. I looked around.', 3);
    const remediation = getRemediationPath(result);
    expect(result.metrics.requiredHits).toBeLessThan(result.metrics.requiredTotal);
    expect(remediation.missingChecks.length).toBeGreaterThan(0);
  });
});

describe('revise drills and track progress storage', () => {
  beforeEach(() => {
    store.reset();
  });

  it('grades mini-drills with pass threshold', () => {
    const drills = [
      { type: 'vocab_mcq', correctIndex: 1 },
      { type: 'spelling_pick', correctIndex: 0 },
      { type: 'dialogue_tag', correctIndex: 2 },
    ];
    const result = gradeDrills(drills, [1, 0, 1]);
    expect(result.correctCount).toBe(2);
    expect(result.passed).toBe(true);
  });

  it('stores and migrates track-based progress', () => {
    setTrackProgress('p3t1Creative', 2, 6, 3);
    expect(getTrackProgress('p3t1Creative').completedLessons).toBe(2);

    store.set('writingCompleted', { 3: 5 });
    const migrated = migrateLegacyWritingCompleted(['p3t2Creative'], 7, 3);
    expect(migrated.p3t2Creative.completedLessons).toBe(5);
  });
});
