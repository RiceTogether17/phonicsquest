/**
 * Practice-level defaults: pickers open on the Quick Check recommendation,
 * else the profile grade, else P1.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

describe('getDefaultPracticeLevel', () => {
  let store, defaults;

  beforeEach(async () => {
    vi.resetModules();
    stubAudioGlobals();
    localStorage.clear();
    ({ store } = await import('../modules/store.js'));
    defaults = await import('../modules/practiceDefaults.js');
  });

  it('falls back to P1 with no signal', () => {
    expect(defaults.getDefaultPracticeLevel()).toBe('P1');
  });

  it('prefers the Quick Check recommendation', () => {
    store.set('recommendedPracticeLevel', 'P4');
    expect(defaults.getDefaultPracticeLevel()).toBe('P4');
    expect(defaults.isRecommendedLevel('P4')).toBe(true);
    expect(defaults.isRecommendedLevel('P3')).toBe(false);
  });

  it('ignores junk recommendations', () => {
    store.set('recommendedPracticeLevel', 'kindergarten');
    expect(defaults.getDefaultPracticeLevel()).toBe('P1');
  });
});
