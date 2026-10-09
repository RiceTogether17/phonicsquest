import { describe, it, expect } from 'vitest';
import {
  WRITING_TRACKS,
  PLAN_GUIDE,
  writingLessonPacks,
  getTracksForLevel,
  getLessonsForTrack,
  validateLessonPackSchema,
} from '../src/data/writingLessonPacks.js';

/**
 * Writing was only taught at P3: every other level got a bare prompt and a
 * score. Each level now has a track with the same shape as P3 Term 1:
 * learn, revise, plan, draft, repair, then a boss check.
 */

const allLessons = Object.values(writingLessonPacks);
const writingLessons = allLessons.filter((p) => p.lessonType !== 'bossQuiz');
const bosses = allLessons.filter((p) => p.lessonType === 'bossQuiz');

describe('a writing track for every level', () => {
  it.each([1, 2, 3, 4, 5, 6])('P%i has at least one track', (level) => {
    const tracks = getTracksForLevel(level);
    expect(tracks.length).toBeGreaterThan(0);
    for (const track of tracks) {
      const lessons = getLessonsForTrack(track.id);
      expect(lessons.length).toBe(track.lessonIds.length);
      lessons.forEach((lesson) => {
        expect(validateLessonPackSchema(lesson)).toBe(true);
        expect(lesson.level).toBe(level);
        expect(lesson.track).toBe(track.id);
      });
      expect(lessons.at(-1).lessonType).toBe('bossQuiz');
    }
  });

  it('carries old prompt progress over only to the P3 tracks it came from', () => {
    const migrating = Object.values(WRITING_TRACKS).filter((t) => t.migrateLegacyProgress);
    expect(migrating.map((t) => t.level)).toEqual([3, 3]);
  });
});

describe('lesson content', () => {
  it('names every plan box', () => {
    for (const lesson of writingLessons) {
      for (const field of lesson.plotPlanTemplate || []) {
        expect(PLAN_GUIDE[field], `${lesson.id}: ${field}`).toBeTruthy();
      }
    }
  });

  it('teaches before it tests: cards on every new lesson', () => {
    for (const lesson of writingLessons.filter((l) => l.level !== 3)) {
      expect(lesson.teachCards?.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.sampleAnswer, lesson.id).toBeTruthy();
      expect(lesson.requiredChecks.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it('uses each word-bucket word in its own example', () => {
    for (const lesson of writingLessons) {
      for (const entry of lesson.wordBucket || []) {
        expect(entry.example.toLowerCase(), `${lesson.id}: ${entry.word}`).toContain(
          entry.word.toLowerCase(),
        );
      }
    }
  });

  it('gives every new drill a valid answer, a hint and a reason', () => {
    for (const lesson of writingLessons.filter((l) => l.level !== 3)) {
      for (const drill of lesson.reviseDrills) {
        expect(drill.hint, `${lesson.id}: ${drill.question}`).toBeTruthy();
        expect(drill.why, `${lesson.id}: ${drill.question}`).toBeTruthy();
        if (drill.type === 'arrange_sequence') {
          expect([...drill.correctOrder].sort()).toEqual(drill.sentences.map((_, i) => i));
        } else {
          expect(drill.options[drill.correctIndex], drill.question).toBeTruthy();
        }
      }
    }
  });

  it('sets situational lessons up as tasks with a purpose, audience and points', () => {
    const situational = writingLessons.filter((l) => l.mode === 'situational');
    expect(situational.length).toBeGreaterThanOrEqual(4);
    for (const lesson of situational) {
      expect(lesson.pac?.audience, lesson.id).toBeTruthy();
      expect(lesson.taskBrief?.points?.length, lesson.id).toBe(3);
    }
  });
});

describe('boss checks', () => {
  it('can be passed and explain every answer', () => {
    for (const boss of bosses) {
      const { passMark, questions, constructedItems = [] } = boss.bossQuiz;
      expect(passMark).toBeLessThanOrEqual(questions.length + constructedItems.length);
      for (const q of questions) {
        expect(q.options[q.answer], `${boss.id} ${q.id}`).toBeTruthy();
        if (boss.level !== 3) expect(q.why, `${boss.id} ${q.id}`).toBeTruthy();
      }
    }
  });
});
