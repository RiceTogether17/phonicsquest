/**
 * Today's Lesson — composer + runner.
 *
 * Covers the guided-session layer that unified the daily surfaces:
 *  • composition per pathway (early-reading vs primary)
 *  • teach-step selection (recommended stage / weakest skill)
 *  • runner state: daily rollover, teach flag, one-time completion bonus,
 *    capped lesson history
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function setProfile({ primaryGrade = null, readingBand = 'pre-reader', schoolLevel = 'preschool' } = {}) {
  const id = `p_test_${Math.random().toString(36).slice(2)}`;
  const profile = { id, name: 'Test', avatar: '🦁', color: '#6c63ff', schoolLevel, primaryGrade, readingBand };
  localStorage.setItem('phonicsquest_profiles', JSON.stringify([profile]));
  localStorage.setItem('phonicsquest_active_profile', id);
  localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
  return profile;
}

async function loadModules() {
  const storeMod = await import('../modules/store.js');
  const composer = await import('../modules/lessonComposer.js');
  const runner = await import('../modules/lessonRunner.js');
  return { store: storeMod.store, ...composer, ...runner };
}

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

/**
 * Seed store signals that put the child at the blending journey step —
 * PA mastered via skill attempts, letter sounds via a placement score —
 * so the phonics teach step applies (pre-print children skip it).
 */
async function seedBlendingStage(store) {
  for (let i = 0; i < 10; i++) store.recordWordSkillAttempt(`w${i}`, 'segmenting', true);
  store.set('placementProfile', { stageScores: { letterSounds: { composite: 0.9 } } });
}

describe('lessonComposer — early reading pathway', () => {
  it('composes warm-up → teach → practice → review for a K1 profile', async () => {
    setProfile({ readingBand: 'emerging-decoder' });
    const mods = await loadModules();
    const { composeTodaysLesson } = mods;
    await seedBlendingStage(mods.store);

    const { band, steps } = composeTodaysLesson();
    expect(band).toBe('early');

    const kinds = steps.map(s => s.kind);
    expect(kinds).toEqual(['warmup', 'teach', 'practice', 'review']);

    const teach = steps.find(s => s.kind === 'teach');
    expect(teach.action.type).toBe('teach-phonics');
    // A brand-new profile starts at the first curriculum stage.
    expect(teach.action.stageId).toBe('cvc-a');
    expect(teach.action.target).toBe('blend');
  });
});

describe('lessonComposer — primary pathway', () => {
  it('composes mission steps without a teach step when no skills are weak', async () => {
    setProfile({ primaryGrade: 'P4', readingBand: 'reader', schoolLevel: 'primary' });
    const { composeTodaysLesson } = await loadModules();

    const { band, steps } = composeTodaysLesson();
    expect(band).toBe('primary');
    expect(steps.some(s => s.kind === 'teach')).toBe(false);
    expect(steps.length).toBe(5); // the five mission steps
    expect(steps[steps.length - 1].kind).toBe('review'); // yesterday's slip
  });

  it('prepends a teach step for the weakest skill with its authored tip', async () => {
    setProfile({ primaryGrade: 'P5', readingBand: 'reader', schoolLevel: 'primary' });
    const { store, composeTodaysLesson } = await loadModules();
    store.set('questMastery', { grammarMcq: { svAgreement: 0.3, articles: 0.9 } });

    const { steps } = composeTodaysLesson();
    const teach = steps[0];
    expect(teach.kind).toBe('teach');
    expect(teach.action.type).toBe('teach-tip');
    expect(teach.action.skill).toBe('svAgreement');
    expect(teach.action.tip.rule.length).toBeGreaterThan(20);
    expect(steps.length).toBe(6);
  });
});

describe('lessonComposer — pre-print journey steps', () => {
  it('skips the phonics teach step for a phonemic-awareness child', async () => {
    setProfile({ readingBand: 'pre-reader' });
    const { composeTodaysLesson } = await loadModules();
    const { steps } = composeTodaysLesson();
    expect(steps.some(s => s.kind === 'teach')).toBe(false);
    // The practice slot carries a listening warm-up instead.
    const practice = steps.find(s => s.kind === 'practice');
    expect(practice.title).toContain('Hear the Sounds');
  });
});

describe('lessonRunner — session state', () => {
  it('rolls the lesson state over to a new day', async () => {
    setProfile({ readingBand: 'pre-reader' });
    const { getLessonState, markTeachDone } = await loadModules();

    const day1 = new Date('2026-06-10T09:00:00');
    expect(getLessonState(day1).teachDone).toBe(false);
    markTeachDone(day1);
    expect(getLessonState(day1).teachDone).toBe(true);

    const day2 = new Date('2026-06-11T09:00:00');
    expect(getLessonState(day2).teachDone).toBe(false);
  });

  it('overrides teach-step doneness from the runner flag', async () => {
    setProfile({ readingBand: 'emerging-decoder' });
    const mods = await loadModules();
    const { getTodaysLessonView, markTeachDone } = mods;
    await seedBlendingStage(mods.store);

    let view = getTodaysLessonView();
    const teachBefore = view.steps.find(s => s.kind === 'teach');
    expect(teachBefore.done).toBe(false);

    markTeachDone();
    view = getTodaysLessonView();
    const teachAfter = view.steps.find(s => s.kind === 'teach');
    expect(teachAfter.done).toBe(true);
  });

  it('awards the completion bonus exactly once and records history', async () => {
    setProfile({ primaryGrade: 'P4', readingBand: 'reader', schoolLevel: 'primary' });
    const { store, getTodaysLessonView, finalizeLessonIfComplete, markTeachDone, getLessonHistory, LESSON_BONUS_XP } =
      await loadModules();

    // Seed yesterday's slip BEFORE the first mission read (the daily mission
    // snapshot caches the replay pick the first time it is built).
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    store.set('questAttempts', [
      { quest: 'grammarMcq', skill: 'articles', correct: false, timestamp: yesterday },
    ]);

    // Not complete yet → no award.
    expect(finalizeLessonIfComplete()).toBeNull();

    // Complete every mission step: 3 cloze castle + 3 word vault attempts
    // today, comprehension clue manual, 1 editing attempt, 1 grammar replay.
    markTeachDone();
    const now = new Date().toISOString();
    store.set('questAttempts', [
      { quest: 'grammarMcq', skill: 'articles', correct: false, timestamp: yesterday },
      ...Array(3).fill({ quest: 'clozeCastle', skill: 'articles', correct: true, timestamp: now }),
      ...Array(3).fill({ quest: 'wordVault', skill: 'contextInference', correct: true, timestamp: now }),
      { quest: 'editingQuest', skill: 'spelling', correct: true, timestamp: now },
      { quest: 'grammarMcq', skill: 'articles', correct: true, timestamp: now },
    ]);
    const { markMissionStepDone } = await import('../modules/missionToday.js');
    markMissionStepDone('comprehension-clue');

    const view = getTodaysLessonView();
    expect(view.complete).toBe(true);

    const xpBefore = store.get('xp');
    const award = finalizeLessonIfComplete();
    expect(award).toEqual({ bonus: LESSON_BONUS_XP });
    expect(store.get('xp')).toBe(xpBefore + LESSON_BONUS_XP);

    // Second call is a no-op.
    expect(finalizeLessonIfComplete()).toBeNull();
    expect(store.get('xp')).toBe(xpBefore + LESSON_BONUS_XP);

    const history = getLessonHistory();
    expect(history.length).toBe(1);
    expect(history[0].band).toBe('primary');
  });
});
