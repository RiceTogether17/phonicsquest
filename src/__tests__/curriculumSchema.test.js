/**
 * Curriculum schema regression guard.
 *
 * `src/data/curriculum.js` is the single source of truth for the
 * PhonicsQuest curriculum. This file asserts the shape of that data so
 * downstream consumers (UI, reporting, adaptive routing) can rely on
 * every PHASES entry and every CURRICULUM stage having the same fields.
 *
 * If you add a stage or phase, you must populate every field listed in
 * REQUIRED_PHASE_FIELDS / REQUIRED_STAGE_FIELDS. If you intentionally
 * add a new required field, update both that constant and any consumers.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import {
  CURRICULUM,
  PHASES,
  PHASE_LABELS,
  REQUIRED_STAGE_FIELDS,
  REQUIRED_PHASE_FIELDS,
  DEFAULT_MASTERY_CRITERIA,
  getPhase,
  getStage,
  getStagesInPhase,
} from '../data/curriculum.js';

// MODES pulls audio.js -> needs speechSynthesis. Stub before import.
let MODES;
beforeAll(async () => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
  ({ MODES } = await import('../modes/index.js'));
});

describe('curriculum data shape', () => {
  it('PHASES is non-empty and starts at phase 1', () => {
    expect(PHASES.length).toBeGreaterThan(0);
    expect(PHASES[0].phase).toBe(1);
  });

  it('PHASES.phase numbers are contiguous starting at 1', () => {
    PHASES.forEach((p, i) => {
      expect(p.phase).toBe(i + 1);
    });
  });

  it('every PHASES entry has the required fields', () => {
    for (const phase of PHASES) {
      for (const field of REQUIRED_PHASE_FIELDS) {
        expect(
          phase[field] !== undefined && phase[field] !== null && phase[field] !== '',
          `Phase ${phase.phase} (${phase.title}) is missing field "${field}"`,
        ).toBe(true);
      }
    }
  });

  it('every PHASES entry has non-empty target sounds, sample words and sentences', () => {
    for (const phase of PHASES) {
      expect(
        Array.isArray(phase.targetSounds),
        `phase ${phase.phase} targetSounds must be array`,
      ).toBe(true);
      expect(phase.targetSounds.length, `phase ${phase.phase} targetSounds empty`).toBeGreaterThan(
        0,
      );

      expect(
        Array.isArray(phase.sampleWords),
        `phase ${phase.phase} sampleWords must be array`,
      ).toBe(true);
      expect(phase.sampleWords.length, `phase ${phase.phase} sampleWords empty`).toBeGreaterThan(0);

      expect(
        Array.isArray(phase.sentenceExamples),
        `phase ${phase.phase} sentenceExamples must be array`,
      ).toBe(true);
      expect(
        phase.sentenceExamples.length,
        `phase ${phase.phase} sentenceExamples empty`,
      ).toBeGreaterThan(0);

      expect(
        Array.isArray(phase.recommendedModes),
        `phase ${phase.phase} recommendedModes must be array`,
      ).toBe(true);
      expect(
        phase.recommendedModes.length,
        `phase ${phase.phase} recommendedModes empty`,
      ).toBeGreaterThan(0);
    }
  });

  it('every PHASES.recommendedModes entry refers to a registered mode', () => {
    const registered = new Set(Object.keys(MODES));
    for (const phase of PHASES) {
      for (const modeKey of phase.recommendedModes) {
        expect(
          registered.has(modeKey),
          `Phase ${phase.phase} recommends unknown mode "${modeKey}"`,
        ).toBe(true);
      }
    }
  });

  it('every PHASES.masteryCriteria has numeric accuracy and minAttempts', () => {
    for (const phase of PHASES) {
      expect(typeof phase.masteryCriteria.accuracy).toBe('number');
      expect(phase.masteryCriteria.accuracy).toBeGreaterThan(0);
      expect(phase.masteryCriteria.accuracy).toBeLessThanOrEqual(1);
      expect(typeof phase.masteryCriteria.minAttempts).toBe('number');
      expect(phase.masteryCriteria.minAttempts).toBeGreaterThan(0);
    }
  });

  it('PHASE_LABELS is derived from PHASES (no drift)', () => {
    for (const phase of PHASES) {
      expect(PHASE_LABELS[phase.phase]).toBe(phase.label);
    }
    // PHASE_LABELS should not declare phases that PHASES doesn't.
    const phaseNumbers = new Set(PHASES.map((p) => p.phase));
    for (const key of Object.keys(PHASE_LABELS)) {
      expect(phaseNumbers.has(Number(key)), `PHASE_LABELS has stray entry ${key}`).toBe(true);
    }
  });
});

describe('curriculum stages', () => {
  it('CURRICULUM is non-empty', () => {
    expect(CURRICULUM.length).toBeGreaterThan(0);
  });

  it('every CURRICULUM stage has the required fields', () => {
    for (const stage of CURRICULUM) {
      for (const field of REQUIRED_STAGE_FIELDS) {
        expect(
          stage[field] !== undefined && stage[field] !== null && stage[field] !== '',
          `Stage "${stage.id}" is missing field "${field}"`,
        ).toBe(true);
      }
    }
  });

  it('every stage has non-empty learning outcome and target sounds', () => {
    for (const stage of CURRICULUM) {
      expect(typeof stage.learningOutcome).toBe('string');
      expect(stage.learningOutcome.length).toBeGreaterThan(10);

      expect(Array.isArray(stage.targetSounds), `${stage.id} targetSounds must be array`).toBe(
        true,
      );
      expect(stage.targetSounds.length, `${stage.id} targetSounds empty`).toBeGreaterThan(0);
    }
  });

  it('every stage has at least 4 sample words and 1 decodable sentence', () => {
    for (const stage of CURRICULUM) {
      expect(Array.isArray(stage.sampleWords), `${stage.id} sampleWords must be array`).toBe(true);
      expect(stage.sampleWords.length, `${stage.id} sampleWords too short`).toBeGreaterThanOrEqual(
        4,
      );
      expect(stage.sampleWords.every((w) => typeof w === 'string' && w.length > 0)).toBe(true);

      expect(
        Array.isArray(stage.sentenceExamples),
        `${stage.id} sentenceExamples must be array`,
      ).toBe(true);
      expect(stage.sentenceExamples.length, `${stage.id} sentenceExamples empty`).toBeGreaterThan(
        0,
      );
      expect(stage.sentenceExamples.every((s) => typeof s === 'string' && s.length > 0)).toBe(true);
    }
  });

  it('every stage.recommendedModes entry refers to a registered mode', () => {
    const registered = new Set(Object.keys(MODES));
    for (const stage of CURRICULUM) {
      expect(
        Array.isArray(stage.recommendedModes),
        `${stage.id} recommendedModes must be array`,
      ).toBe(true);
      expect(stage.recommendedModes.length, `${stage.id} recommendedModes empty`).toBeGreaterThan(
        0,
      );
      for (const modeKey of stage.recommendedModes) {
        expect(
          registered.has(modeKey),
          `Stage "${stage.id}" recommends unknown mode "${modeKey}"`,
        ).toBe(true);
      }
    }
  });

  it('every stage.masteryCriteria has numeric accuracy and minAttempts', () => {
    for (const stage of CURRICULUM) {
      expect(typeof stage.masteryCriteria.accuracy).toBe('number');
      expect(stage.masteryCriteria.accuracy).toBeGreaterThan(0);
      expect(stage.masteryCriteria.accuracy).toBeLessThanOrEqual(1);
      expect(typeof stage.masteryCriteria.minAttempts).toBe('number');
      expect(stage.masteryCriteria.minAttempts).toBeGreaterThan(0);
    }
  });

  it('stage ids are unique', () => {
    const ids = CURRICULUM.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every stage.phase exists in PHASES', () => {
    const phaseNumbers = new Set(PHASES.map((p) => p.phase));
    for (const stage of CURRICULUM) {
      expect(
        phaseNumbers.has(stage.phase),
        `Stage "${stage.id}" has unknown phase ${stage.phase}`,
      ).toBe(true);
    }
  });

  it('every PHASES entry has at least one CURRICULUM stage', () => {
    for (const phase of PHASES) {
      const stages = getStagesInPhase(phase.phase);
      expect(stages.length, `Phase ${phase.phase} has no curriculum stages`).toBeGreaterThan(0);
    }
  });
});

describe('curriculum lookup helpers', () => {
  it('getPhase returns the right phase', () => {
    expect(getPhase(1)?.title).toBe('CVC Words');
    expect(getPhase(99)).toBeNull();
  });

  it('getStage returns the right stage', () => {
    expect(getStage('cvc-a')?.name).toMatch(/Short A/);
    expect(getStage('nope')).toBeNull();
  });

  it('getStagesInPhase returns only stages in that phase', () => {
    const phase1Stages = getStagesInPhase(1);
    expect(phase1Stages.length).toBeGreaterThan(0);
    expect(phase1Stages.every((s) => s.phase === 1)).toBe(true);
  });

  it('DEFAULT_MASTERY_CRITERIA is exported and immutable', () => {
    expect(DEFAULT_MASTERY_CRITERIA.accuracy).toBeGreaterThan(0);
    expect(() => {
      DEFAULT_MASTERY_CRITERIA.accuracy = 0.1;
    }).toThrow();
  });
});
