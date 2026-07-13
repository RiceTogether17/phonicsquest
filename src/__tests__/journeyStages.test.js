/**
 * Journey steps regression guard — the six-step learning path is the
 * spine of the Learn tab and journey map. Steps must stay ordered,
 * mode assignments must reference real modes, and progress derivation
 * must respond to the store signals it documents.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

let JOURNEY_STEPS, journeyStepForMode, MODES;
beforeAll(async () => {
  stubAudioGlobals();
  ({ JOURNEY_STEPS, journeyStepForMode } = await import('../data/journeyStages.js'));
  ({ MODES } = await import('../modes/index.js'));
});

describe('JOURNEY_STEPS shape', () => {
  it('defines the six pedagogy steps in order', () => {
    expect(JOURNEY_STEPS.map(s => s.key)).toEqual([
      'phonemic-awareness', 'letter-sounds', 'blending',
      'sight-words', 'stories', 'primary',
    ]);
    JOURNEY_STEPS.forEach((s, i) => expect(s.step).toBe(i + 1));
  });

  it('every listed mode key exists in MODES', () => {
    for (const stage of JOURNEY_STEPS) {
      for (const mode of stage.modes) {
        expect(Boolean(MODES[mode]), `step ${stage.key} lists unknown mode "${mode}"`).toBe(true);
      }
    }
  });

  it('no mode is assigned to two steps', () => {
    const seen = new Map();
    for (const stage of JOURNEY_STEPS) {
      for (const key of [...stage.modes, ...stage.screens]) {
        expect(seen.has(key), `"${key}" appears in both ${seen.get(key)} and ${stage.key}`).toBe(false);
        seen.set(key, stage.key);
      }
    }
  });

  it('journeyStepForMode maps modes to their step', () => {
    expect(journeyStepForMode('first')).toBe('phonemic-awareness');
    expect(journeyStepForMode('blend')).toBe('blending');
    expect(journeyStepForMode('nope')).toBeNull();
  });
});

describe('journey progress derivation', () => {
  let store, journey;

  beforeEach(async () => {
    vi.resetModules();
    stubAudioGlobals();
    localStorage.clear();
    ({ store } = await import('../modules/store.js'));
    journey = await import('../data/journeyStages.js');
  });

  it('a brand-new learner starts at step 1', () => {
    expect(journey.getCurrentJourneyStep().key).toBe('phonemic-awareness');
  });

  it('completing PA moves the current step to letter sounds', () => {
    for (let i = 0; i < 10; i++) store.recordWordSkillAttempt(`w${i}`, 'segmenting', true);
    expect(journey.getCurrentJourneyStep().key).toBe('letter-sounds');
  });

  it('sight-word progress reflects completed quests', () => {
    store.set('sightQuestsCompleted', { q1: true, q2: true });
    const { status, pct } = journey.getJourneyStageProgress('sight-words');
    expect(status).toBe('in-progress');
    expect(pct).toBeGreaterThan(0);
  });
});
