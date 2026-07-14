/**
 * Pre-phase (Step 0a/0b) regression guard.
 *
 * The foundation steps — phonemic awareness and letter sounds — are
 * first-class curriculum entries in PRE_PHASES with the same field schema
 * as the numeric PHASES, string phase keys ('0a'/'0b') so the persisted
 * numeric phases never shift, derived progress signals, and placement
 * routing via result.startPrePhase.
 */
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PRE_PHASES,
  PHASES,
  REQUIRED_PHASE_FIELDS,
  getPrePhase,
} from '../data/curriculum.js';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

// Standalone screens that are valid recommendations but are not MODES keys.
const SCREEN_KEYS = new Set(['letterSounds']);

let MODES;
beforeAll(async () => {
  stubAudioGlobals();
  ({ MODES } = await import('../modes/index.js'));
});

describe('PRE_PHASES data shape', () => {
  it('defines exactly the two foundation steps, in order', () => {
    expect(PRE_PHASES.map(p => p.phase)).toEqual(['0a', '0b']);
  });

  it('every PRE_PHASES entry has the same required fields as PHASES', () => {
    for (const pre of PRE_PHASES) {
      for (const field of REQUIRED_PHASE_FIELDS) {
        expect(
          pre[field] !== undefined && pre[field] !== null && pre[field] !== '',
          `Pre-phase ${pre.phase} is missing field "${field}"`,
        ).toBe(true);
      }
    }
  });

  it('pre-phase ids do not collide with numeric phase ids', () => {
    const phaseIds = new Set(PHASES.map(p => p.id));
    for (const pre of PRE_PHASES) {
      expect(phaseIds.has(pre.id)).toBe(false);
    }
  });

  it('recommendedModes reference real modes or known standalone screens', () => {
    for (const pre of PRE_PHASES) {
      for (const mode of pre.recommendedModes) {
        expect(
          Boolean(MODES[mode]) || SCREEN_KEYS.has(mode),
          `Pre-phase ${pre.phase} recommends unknown mode "${mode}"`,
        ).toBe(true);
      }
    }
  });

  it('getPrePhase resolves by phase key and id', () => {
    expect(getPrePhase('0a')?.id).toBe('phase-0a-phonemic-awareness');
    expect(getPrePhase('phase-0b-letter-sounds')?.phase).toBe('0b');
    expect(getPrePhase('9z')).toBeNull();
  });
});

describe('pre-phase progress signals', () => {
  let store, progressMod;

  beforeEach(async () => {
    vi.resetModules();
    stubAudioGlobals();
    localStorage.clear();
    ({ store } = await import('../modules/store.js'));
    progressMod = await import('../modules/prePhaseProgress.js');
  });

  it('reports locked with no signal at all', () => {
    expect(progressMod.getPaProgress()).toEqual({ status: 'locked', pct: 0 });
    expect(progressMod.getLetterSoundProgress()).toEqual({ status: 'locked', pct: 0 });
  });

  it('derives PA progress from oralBlend/segmenting skill attempts', () => {
    for (let i = 0; i < 10; i++) {
      store.recordWordSkillAttempt(`w${i}`, 'segmenting', i < 9); // 90% over 10
    }
    const { status, pct } = progressMod.getPaProgress();
    expect(pct).toBe(90);
    expect(status).toBe('complete'); // >= 80% mastery threshold
  });

  it('ignores practice evidence below the minimum attempt count', () => {
    store.recordWordSkillAttempt('w1', 'oralBlend', true); // 1 attempt only
    expect(progressMod.getPaProgress().status).toBe('locked');
  });

  it('uses the placement letter-sounds stage score when present', () => {
    store.set('placementProfile', {
      stageScores: { letterSounds: { composite: 0.5 } },
    });
    const { status, pct } = progressMod.getLetterSoundProgress();
    expect(pct).toBe(50);
    expect(status).toBe('in-progress');
  });
});

describe('placement startPrePhase routing', () => {
  let derivePlacementResult;

  beforeAll(async () => {
    stubAudioGlobals();
    ({ derivePlacementResult } = await import('../modules/placementTest.js'));
  });

  function paResults(correctRatio) {
    // Minimal synthetic gate-A result rows in the shape derivePlacementResult
    // scores: phonemic-awareness sections with pass/fail.
    const rows = [];
    const total = 10;
    for (let i = 0; i < total; i++) {
      rows.push({
        id: `pa-${i}`,
        stage: 'phonemic-awareness',
        section: ['firstSound', 'lastSound', 'middleSound', 'oralBlending'][i % 4],
        correct: i < Math.round(correctRatio * total),
      });
    }
    return rows;
  }

  it('routes a weak-PA child to pre-phase 0a', () => {
    const result = derivePlacementResult(paResults(0.2));
    expect(result.startPrePhase).toBe('0a');
  });

  it('does not route to 0a when PA is secure', () => {
    const result = derivePlacementResult(paResults(0.9));
    expect(result.startPrePhase).not.toBe('0a');
  });
});
