/**
 * Journey-aware Today's Lesson: the warm-up step matches the child's
 * journey step. A phonemic-awareness child gets a listening game (never a
 * print drill); a letter-sounds child gets sound-to-letter matching;
 * blending children keep the group-targeted recommendation path.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

describe('journey-aware warm-up', () => {
  let store, plan;

  beforeEach(async () => {
    vi.resetModules();
    stubAudioGlobals();
    localStorage.clear();
    ({ store } = await import('../modules/store.js'));
    plan = await import('../modules/todaysPlan.js');
  });

  it('a brand-new (PA-stage) child gets a listening warm-up, not print', () => {
    const warmup = plan.__TEST__._pickWarmup();
    const paTargets = ['first', 'last', 'oddOneOut', 'syllable', 'middle'];
    expect(paTargets).toContain(warmup.target);
    expect(warmup.title).toContain('Hear the Sounds');
  });

  it('a letter-sounds child gets sound-to-letter matching', () => {
    // Complete PA via skill evidence; leave letter sounds incomplete.
    for (let i = 0; i < 10; i++) store.recordWordSkillAttempt(`w${i}`, 'segmenting', true);
    const warmup = plan.__TEST__._pickWarmup();
    expect(['soundHunt', 'hear']).toContain(warmup.target);
  });

  it('a blending-stage child falls through to the recommendation engine', () => {
    for (let i = 0; i < 10; i++) store.recordWordSkillAttempt(`w${i}`, 'segmenting', true);
    store.set('placementProfile', { stageScores: { letterSounds: { composite: 0.9 } } });
    const warmup = plan.__TEST__._pickWarmup();
    // Whatever the engine picks, it must not be a PA/letter-sounds override.
    expect(plan.__TEST__._journeyWarmup()).toBeNull();
    expect(warmup.target).toBeTruthy();
  });

  it('the warm-up rotates across days within a step', () => {
    const a = plan.__TEST__._journeyWarmup(new Date('2026-07-14'));
    const b = plan.__TEST__._journeyWarmup(new Date('2026-07-15'));
    expect(a.target).not.toBe(b.target);
  });
});
