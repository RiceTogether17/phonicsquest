import { describe, it, expect } from 'vitest';
import {
  DEFAULT_ADAPTIVE_CONFIG,
  normalizeAdaptiveConfig,
  getWordWeight,
} from '../modules/adaptiveSelection.js';

describe('adaptive selection config', () => {
  it('uses defaults when config is empty', () => {
    const cfg = normalizeAdaptiveConfig();
    expect(cfg.unseenWeight).toBe(DEFAULT_ADAPTIVE_CONFIG.unseenWeight);
    expect(cfg.weakAccuracy).toBe(DEFAULT_ADAPTIVE_CONFIG.weakAccuracy);
  });

  it('applies teacher overrides to weighting', () => {
    const cfg = normalizeAdaptiveConfig({ weakWeight: 8, strongWeight: 0.8 });
    expect(getWordWeight({ attempts: 8, correct: 2 }, cfg)).toBe(8);
    expect(getWordWeight({ attempts: 8, correct: 8 }, cfg)).toBe(0.8);
  });

  it('gives unseen words the unseen weight', () => {
    const cfg = normalizeAdaptiveConfig({ unseenWeight: 4 });
    expect(getWordWeight(undefined, cfg)).toBe(4);
  });

  it('treats a word at exactly the strong threshold as strong with or without a review date', () => {
    const cfg = normalizeAdaptiveConfig(); // strongAccuracy 0.9, masteryMinAttempts 6
    const future = new Date(Date.now() + 86400000).toISOString();
    // 9/10 = exactly 0.9 — both paths must agree on the boundary.
    expect(getWordWeight({ attempts: 10, correct: 9 }, cfg)).toBe(cfg.strongWeight);
    expect(getWordWeight({ attempts: 10, correct: 9, nextReviewDate: future }, cfg)).toBe(
      cfg.strongWeight,
    );
  });

  it('boosts a mastered word once its review date has passed', () => {
    const cfg = normalizeAdaptiveConfig();
    const past = new Date(Date.now() - 86400000).toISOString();
    expect(getWordWeight({ attempts: 10, correct: 9, nextReviewDate: past }, cfg)).toBe(
      cfg.mediumWeight,
    );
  });
});
