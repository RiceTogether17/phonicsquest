import { describe, it, expect } from 'vitest';
import { getStagesForMode } from '../src/modules/phonicsProgression.js';

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

describe('integration — every phonemic-awareness mode gets a non-empty stage list', () => {
  it('first / last / middle / oralBlend / soundCount / hear / missing / segment all have stages', () => {
    const PA_MODES = ['oralBlend', 'first', 'last', 'middle', 'soundCount', 'hear', 'missing', 'segment'];
    for (const mode of PA_MODES) {
      const stages = getStagesForMode(mode, CURRICULUM, PHASES);
      expect(stages.length).toBeGreaterThan(0);
    }
  });
});

describe('real curriculum — mode/phase coverage is complete and has no dead stages', () => {
  async function phasesFor(mode) {
    const { CURRICULUM: C, PHASES: P } = await import('../src/data/curriculum.js');
    const stages = getStagesForMode(mode, C, P);
    return [...new Set(stages.map(s => s.phase))].sort((a, b) => a - b);
  }

  it('both blending modes span every phase 1–10 (Blend It! and Listen & Blend match)', async () => {
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(await phasesFor('blend')).toEqual(all);
    // classicBlend previously skipped Phase 4 (Digraphs) — guard the gap.
    expect(await phasesFor('classicBlend')).toEqual(all);
  });

  it('Segment It covers phases 1–9 but not Phase 10 (its words are PA-excluded)', async () => {
    // Phase 10 (prefixes, advanced suffixes, multisyllabic, sight) cannot serve
    // phoneme-level segmenting, so surfacing it would create dead picker stages.
    expect(await phasesFor('segment')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('phonemic-awareness sound modes keep their intended scope', async () => {
    expect(await phasesFor('first')).toEqual([1]);
    expect(await phasesFor('last')).toEqual([1, 2, 3, 4, 5]);
    expect(await phasesFor('middle')).toEqual([1, 6, 7]);
  });
});

describe('real curriculum — Last Sound surfaces beginner phases, not just CVCC', () => {
  it('Last Sound includes Phase 1 (CVC) so children can start on the easiest words', async () => {
    const { CURRICULUM: REAL_CURRICULUM, PHASES: REAL_PHASES } = await import('../src/data/curriculum.js');
    const stages = getStagesForMode('last', REAL_CURRICULUM, REAL_PHASES);
    const phases = Array.from(new Set(stages.map(s => s.phase))).sort((a, b) => a - b);

    // CVC (1) is the single-final-consonant sweet spot for last-sound practice;
    // CCVC (2), CVCC (3), Digraphs (4) and CCVCC (5) all also have a clear final
    // phoneme. If any of these drop out, Last Sound starts mid-curriculum and
    // beginners hit a locked-stage wall (the original bug).
    expect(phases).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    expect(stages.length).toBeGreaterThan(0);
  });
});
