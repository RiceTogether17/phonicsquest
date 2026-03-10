import { describe, it, expect } from 'vitest';
import { DEFAULT_ADAPTIVE_CONFIG, normalizeAdaptiveConfig, getWordWeight } from '../modules/adaptiveSelection.js';

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
});
