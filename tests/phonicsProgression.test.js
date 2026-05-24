import { describe, it, expect } from 'vitest';
import {
  getStagesForMode,
  groupStagesByPhase,
  summarisePhaseMastery,
  recommendStageForMode,
} from '../src/modules/phonicsProgression.js';

const CURRICULUM = [
  { id: 'cvc-a',   group: 'cvc-a',   phase: 1, name: 'CVC – Short A' },
  { id: 'cvc-i',   group: 'cvc-i',   phase: 1, name: 'CVC – Short I' },
  { id: 'ccvc-a',  group: 'ccvc-a',  phase: 2, name: 'CCVC – Short A' },
  { id: 'cvcc-a',  group: 'cvcc-a',  phase: 3, name: 'CVCC – Short A' },
  { id: 'digra-a', group: 'digra-a', phase: 4, name: 'Digraph A' },
];

const PHASES = [
  { phase: 1, recommendedModes: ['oralBlend', 'first', 'middle', 'blend', 'segment'] },
  { phase: 2, recommendedModes: ['blend', 'segment', 'hear', 'soundCount', 'missing'] },
  { phase: 3, recommendedModes: ['segment', 'last', 'hear', 'missing'] },
  { phase: 4, recommendedModes: ['hear', 'blend', 'segment', 'missing'] },
];

describe('getStagesForMode — filters CURRICULUM by mode-recommended phases', () => {
  it('returns only stages from phases that recommend the mode', () => {
    const stages = getStagesForMode('first', CURRICULUM, PHASES);
    expect(stages.map(s => s.id)).toEqual(['cvc-a', 'cvc-i']);
  });

  it('includes every phase that lists the mode', () => {
    const stages = getStagesForMode('segment', CURRICULUM, PHASES);
    const phases = Array.from(new Set(stages.map(s => s.phase))).sort();
    expect(phases).toEqual([1, 2, 3, 4]);
  });

  it('respects per-phase recommendations exactly', () => {
    const stages = getStagesForMode('last', CURRICULUM, PHASES);
    expect(stages.map(s => s.id)).toEqual(['cvcc-a']);
  });

  it('falls back to the full curriculum when a mode is in no phase', () => {
    const stages = getStagesForMode('newExperimentalMode', CURRICULUM, PHASES);
    expect(stages).toHaveLength(CURRICULUM.length);
  });

  it('returns the full curriculum when mode is missing/falsy', () => {
    expect(getStagesForMode('', CURRICULUM, PHASES)).toHaveLength(CURRICULUM.length);
    expect(getStagesForMode(null, CURRICULUM, PHASES)).toHaveLength(CURRICULUM.length);
  });

  it('returns [] defensively for missing/empty curriculum', () => {
    expect(getStagesForMode('blend', [], PHASES)).toEqual([]);
    expect(getStagesForMode('blend', null, PHASES)).toEqual([]);
  });
});

describe('groupStagesByPhase — UI rollup', () => {
  it('groups stages and orders by phase ascending', () => {
    const stages = getStagesForMode('segment', CURRICULUM, PHASES);
    const grouped = groupStagesByPhase(stages);
    expect(grouped.map(g => g.phase)).toEqual([1, 2, 3, 4]);
    expect(grouped[0].stages.map(s => s.id)).toEqual(['cvc-a', 'cvc-i']);
    expect(grouped[1].stages.map(s => s.id)).toEqual(['ccvc-a']);
  });

  it('handles empty input safely', () => {
    expect(groupStagesByPhase([])).toEqual([]);
    expect(groupStagesByPhase(null)).toEqual([]);
  });
});

describe('summarisePhaseMastery — progress rollup', () => {
  const stages = [
    { id: 'a', group: 'g1' },
    { id: 'b', group: 'g2' },
    { id: 'c', group: 'g3' },
  ];

  it('counts mastered stages at the 0.8 default threshold', () => {
    const summary = summarisePhaseMastery(stages, { g1: 0.9, g2: 0.4, g3: 0.85 });
    expect(summary.stagesMastered).toBe(2);
    expect(summary.total).toBe(3);
    expect(summary.pct).toBe(67); // 2 of 3 → 67
  });

  it('computes average mastery percent across all stages', () => {
    const summary = summarisePhaseMastery(stages, { g1: 1.0, g2: 0.5, g3: 0.0 });
    expect(summary.avgPct).toBe(50); // (100+50+0)/3
  });

  it('treats missing group entries as 0 mastery', () => {
    const summary = summarisePhaseMastery(stages, { g1: 1.0 });
    expect(summary.stagesMastered).toBe(1);
    expect(summary.avgPct).toBe(33); // (100+0+0)/3 rounded
  });

  it('honours a custom mastery threshold', () => {
    const summary = summarisePhaseMastery(stages, { g1: 0.6, g2: 0.7, g3: 0.5 }, { masteredAt: 0.6 });
    expect(summary.stagesMastered).toBe(2);
  });

  it('returns zero-filled summary for empty stages', () => {
    expect(summarisePhaseMastery([], {})).toEqual({ stagesMastered: 0, total: 0, pct: 0, avgPct: 0 });
  });
});

describe('recommendStageForMode — "Next" stage picker', () => {
  const stages = [
    { id: 'a', group: 'g1' },
    { id: 'b', group: 'g2' },
    { id: 'c', group: 'g3' },
  ];

  it('returns the first not-yet-mastered stage', () => {
    expect(recommendStageForMode(stages, { g1: 0.9, g2: 0.5, g3: 0.0 }).id).toBe('b');
  });

  it('falls back to the last stage when everything is mastered', () => {
    expect(recommendStageForMode(stages, { g1: 0.9, g2: 0.9, g3: 0.9 }).id).toBe('c');
  });

  it('returns the first stage when nothing has been played yet', () => {
    expect(recommendStageForMode(stages, {}).id).toBe('a');
  });

  it('returns null for empty input', () => {
    expect(recommendStageForMode([], {})).toBeNull();
    expect(recommendStageForMode(null, {})).toBeNull();
  });
});

describe('integration — every phonemic-awareness mode gets a non-empty stage list', () => {
  it('first / last / middle / oralBlend / soundCount / hear / missing / segment all have stages', () => {
    const PA_MODES = ['oralBlend', 'first', 'last', 'middle', 'soundCount', 'hear', 'missing', 'segment'];
    for (const mode of PA_MODES) {
      const stages = getStagesForMode(mode, CURRICULUM, PHASES);
      expect(stages.length).toBeGreaterThan(0);
    }
  });
});
