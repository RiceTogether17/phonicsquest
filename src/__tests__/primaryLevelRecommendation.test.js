/**
 * Primary practice-level recommendation from the Quick Check: gentle,
 * one-grade-at-most steps with a broad "stay put" middle band.
 */
import { beforeAll, describe, expect, it } from 'vitest';

let recommendPrimaryLevel;
beforeAll(async () => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
  ({ recommendPrimaryLevel } = await import('../modules/primaryQuickCheck.js'));
});

describe('recommendPrimaryLevel', () => {
  it('steps one grade down when accuracy is very low', () => {
    expect(recommendPrimaryLevel('P3', 0.2, 6)).toEqual({ level: 'P2', direction: 'down' });
  });

  it('never goes below P1', () => {
    expect(recommendPrimaryLevel('P1', 0.0, 6)).toEqual({ level: 'P1', direction: 'same' });
  });

  it('steps one grade up on a near-perfect check', () => {
    expect(recommendPrimaryLevel('P4', 1.0, 6)).toEqual({ level: 'P5', direction: 'up' });
  });

  it('never goes above P6', () => {
    expect(recommendPrimaryLevel('P6', 1.0, 6)).toEqual({ level: 'P6', direction: 'same' });
  });

  it('stays at the declared grade in the middle band', () => {
    expect(recommendPrimaryLevel('P3', 0.6, 6)).toEqual({ level: 'P3', direction: 'same' });
  });

  it('does not move on too little signal', () => {
    expect(recommendPrimaryLevel('P3', 0.0, 2)).toEqual({ level: 'P3', direction: 'same' });
  });

  it('defaults an unknown grade to P3', () => {
    expect(recommendPrimaryLevel('kindergarten', 0.6, 6).level).toBe('P3');
  });
});
