/**
 * Evidence model — see src/modules/evidence.js.
 *
 * The bug this guards against: before evidence levels existed, tapping
 * "Yes! ✓" after the app had blended a word aloud produced a record
 * indistinguishable from reading a printed word cold, and both advanced
 * mastery, the SRS ladder and the progression gate.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  EVIDENCE,
  EVIDENCE_RANK,
  LEGACY_EVIDENCE,
  MODE_EVIDENCE_CEILING,
  addEvidenceCount,
  classifyEvidence,
  confidenceFor,
  countAtLeast,
  emptyEvidenceCounts,
  ensureEvidenceBuckets,
  evidenceCeilingForMode,
  independentCount,
  isMasteryEvidence,
} from '../modules/evidence.js';

/**
 * MODES is imported lazily: the mode files reach audio.js at module load,
 * which needs the Web Speech API. Stub it, then import.
 */
async function loadModes() {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) {
      this.text = text;
    }
  };
  return (await import('../modes/index.js')).MODES;
}

describe('classifyEvidence', () => {
  it('caps a self-assessed mode at exposure however clean the answer', () => {
    expect(
      classifyEvidence({
        ceiling: EVIDENCE.EXPOSURE,
        hintUsed: false,
        wrongStrikes: 0,
      }),
    ).toBe(EVIDENCE.EXPOSURE);
  });

  it('gives independent for a clean answer in an objectively scored mode', () => {
    expect(
      classifyEvidence({
        ceiling: EVIDENCE.INDEPENDENT,
        hintUsed: false,
        wrongStrikes: 0,
      }),
    ).toBe(EVIDENCE.INDEPENDENT);
  });

  it('drops to guided when a hint was used', () => {
    expect(
      classifyEvidence({
        ceiling: EVIDENCE.INDEPENDENT,
        hintUsed: true,
        wrongStrikes: 0,
      }),
    ).toBe(EVIDENCE.GUIDED);
  });

  it('drops to guided after a wrong first try', () => {
    expect(
      classifyEvidence({
        ceiling: EVIDENCE.INDEPENDENT,
        hintUsed: false,
        wrongStrikes: 1,
      }),
    ).toBe(EVIDENCE.GUIDED);
  });

  it('takes the weaker of the mode ceiling and the attempt', () => {
    // A hint in an already-capped mode cannot make it worse than exposure,
    // and cannot make it better either.
    expect(
      classifyEvidence({
        ceiling: EVIDENCE.EXPOSURE,
        hintUsed: true,
        wrongStrikes: 3,
      }),
    ).toBe(EVIDENCE.EXPOSURE);
  });

  it('lets an adult verdict outrank the mode ceiling', () => {
    expect(
      classifyEvidence({
        ceiling: EVIDENCE.EXPOSURE,
        adultVerdict: 'independent',
      }),
    ).toBe(EVIDENCE.VERIFIED);
  });

  it('records an adult "needed help" verdict as guided, not verified', () => {
    expect(classifyEvidence({ ceiling: EVIDENCE.INDEPENDENT, adultVerdict: 'help' })).toBe(
      EVIDENCE.GUIDED,
    );
    expect(classifyEvidence({ ceiling: EVIDENCE.INDEPENDENT, adultVerdict: 'not-yet' })).toBe(
      EVIDENCE.GUIDED,
    );
  });

  it('defaults to independent only when nothing says otherwise', () => {
    expect(classifyEvidence()).toBe(EVIDENCE.INDEPENDENT);
  });
});

describe('isMasteryEvidence', () => {
  it('accepts independent and verified, rejects exposure and guided', () => {
    expect(isMasteryEvidence(EVIDENCE.INDEPENDENT)).toBe(true);
    expect(isMasteryEvidence(EVIDENCE.VERIFIED)).toBe(true);
    expect(isMasteryEvidence(EVIDENCE.GUIDED)).toBe(false);
    expect(isMasteryEvidence(EVIDENCE.EXPOSURE)).toBe(false);
  });

  it('rejects an unknown level rather than assuming the best', () => {
    expect(isMasteryEvidence(undefined)).toBe(false);
    expect(isMasteryEvidence('nonsense')).toBe(false);
  });
});

describe('mode ceilings', () => {
  it('caps both self-assessed blend modes at exposure', () => {
    expect(MODE_EVIDENCE_CEILING.blend).toBe(EVIDENCE.EXPOSURE);
    expect(MODE_EVIDENCE_CEILING.classicBlend).toBe(EVIDENCE.EXPOSURE);
  });

  it('caps modes that speak the target before showing print at guided', () => {
    // Hear & Choose measures auditory-to-print matching, not decoding.
    expect(MODE_EVIDENCE_CEILING.hear).toBe(EVIDENCE.GUIDED);
    expect(MODE_EVIDENCE_CEILING.sightMatch).toBe(EVIDENCE.GUIDED);
  });

  it('treats an unclassified mode as guided, never independent', () => {
    expect(evidenceCeilingForMode('some-future-mode')).toBe(EVIDENCE.GUIDED);
    expect(evidenceCeilingForMode(undefined)).toBe(EVIDENCE.GUIDED);
  });

  it('agrees with the MODES registry for every playable mode', async () => {
    // The registry carries `evidenceCeiling` for readability at the point of
    // use; this map is what progress.js reads. They must not drift.
    const MODES = await loadModes();
    for (const [key, mode] of Object.entries(MODES)) {
      expect(mode.evidenceCeiling, `MODES.${key} has no evidenceCeiling`).toBeTruthy();
      expect(MODE_EVIDENCE_CEILING[key], `MODE_EVIDENCE_CEILING is missing "${key}"`).toBe(
        mode.evidenceCeiling,
      );
    }
  });
});

describe('evidence buckets', () => {
  it('starts every level at zero', () => {
    const b = emptyEvidenceCounts();
    expect(Object.keys(b).sort()).toEqual(['exposure', 'guided', 'independent', 'verified']);
    expect(b.independent).toEqual({ attempts: 0, correct: 0 });
  });

  it('backfills a pre-evidence record into the guided bucket', () => {
    // Grandfathering rule: history counts as practice, but not as proof.
    const buckets = ensureEvidenceBuckets({ attempts: 9, correct: 7 });
    expect(buckets[LEGACY_EVIDENCE]).toEqual({ attempts: 9, correct: 7 });
    expect(buckets.independent).toEqual({ attempts: 0, correct: 0 });
  });

  it('leaves an already-migrated record alone', () => {
    const existing = {
      attempts: 3,
      byEvidence: { ...emptyEvidenceCounts(), independent: { attempts: 3, correct: 2 } },
    };
    expect(ensureEvidenceBuckets(existing).independent).toEqual({ attempts: 3, correct: 2 });
    expect(ensureEvidenceBuckets(existing).guided).toEqual({ attempts: 0, correct: 0 });
  });

  it('handles a missing or empty stat without inventing attempts', () => {
    expect(ensureEvidenceBuckets(undefined).guided).toEqual({ attempts: 0, correct: 0 });
    expect(ensureEvidenceBuckets({ attempts: 0, correct: 0 }).guided).toEqual({
      attempts: 0,
      correct: 0,
    });
  });

  it('counts only levels at or above the floor', () => {
    let b = emptyEvidenceCounts();
    b = addEvidenceCount(b, EVIDENCE.EXPOSURE, true);
    b = addEvidenceCount(b, EVIDENCE.GUIDED, true);
    b = addEvidenceCount(b, EVIDENCE.INDEPENDENT, true);
    b = addEvidenceCount(b, EVIDENCE.VERIFIED, false);

    expect(countAtLeast(b, EVIDENCE.EXPOSURE)).toEqual({ attempts: 4, correct: 3 });
    expect(countAtLeast(b, EVIDENCE.INDEPENDENT)).toEqual({ attempts: 2, correct: 1 });
    expect(countAtLeast(b, EVIDENCE.VERIFIED)).toEqual({ attempts: 1, correct: 0 });
  });

  it('reports no independent evidence for a fully grandfathered word', () => {
    expect(independentCount({ attempts: 40, correct: 38 })).toEqual({ attempts: 0, correct: 0 });
  });
});

describe('confidenceFor', () => {
  it('bands by independent sample size', () => {
    expect(confidenceFor(0)).toBe('none');
    expect(confidenceFor(1)).toBe('low');
    expect(confidenceFor(5)).toBe('low');
    expect(confidenceFor(6)).toBe('moderate');
    expect(confidenceFor(11)).toBe('moderate');
    expect(confidenceFor(12)).toBe('high');
  });

  it('treats missing input as no confidence', () => {
    expect(confidenceFor(undefined)).toBe('none');
    expect(confidenceFor(null)).toBe('none');
  });
});

describe('level ranks', () => {
  it('orders exposure < guided < independent < verified', () => {
    expect(EVIDENCE_RANK.exposure).toBeLessThan(EVIDENCE_RANK.guided);
    expect(EVIDENCE_RANK.guided).toBeLessThan(EVIDENCE_RANK.independent);
    expect(EVIDENCE_RANK.independent).toBeLessThan(EVIDENCE_RANK.verified);
  });
});

describe('store integration', () => {
  let store;

  beforeEach(async () => {
    localStorage.clear();
    ({ store } = await import('../modules/store.js'));
    store.reset();
  });

  it('does not advance the Leitner box on a modelled correct answer', () => {
    store.recordWordAttempt('cat', true, EVIDENCE.EXPOSURE);
    const stat = store.get('wordStats').cat;
    expect(stat.attempts).toBe(1);
    expect(stat.correct).toBe(1);
    // The word was never retrieved from memory — it must stay due.
    expect(stat.box).toBe(0);
    expect(stat.lastResult).toBe('hold');
  });

  it('advances the box on an independent correct answer', () => {
    store.recordWordAttempt('cat', true, EVIDENCE.INDEPENDENT);
    const stat = store.get('wordStats').cat;
    expect(stat.box).toBe(1);
    expect(stat.lastResult).toBe('pass');
  });

  it('demotes on a wrong answer at any evidence level', () => {
    store.recordWordAttempt('cat', true, EVIDENCE.INDEPENDENT);
    store.recordWordAttempt('cat', true, EVIDENCE.INDEPENDENT);
    expect(store.get('wordStats').cat.box).toBe(2);

    store.recordWordAttempt('cat', false, EVIDENCE.EXPOSURE);
    const stat = store.get('wordStats').cat;
    expect(stat.box).toBe(1);
    expect(stat.lastResult).toBe('demote');
  });

  it('keeps independent counters separate on per-skill stats', () => {
    store.recordWordSkillAttempt('cat', 'decoding', true, 900, EVIDENCE.EXPOSURE);
    store.recordWordSkillAttempt('cat', 'decoding', true, 900, EVIDENCE.INDEPENDENT);
    store.recordWordSkillAttempt('cat', 'decoding', false, 900, EVIDENCE.VERIFIED);

    const stat = store.get('wordSkillStats').cat.decoding;
    expect(stat.attempts).toBe(3);
    expect(stat.correct).toBe(2);
    // exposure doesn't count; independent + verified do.
    expect(stat.independentAttempts).toBe(2);
    expect(stat.independentCorrect).toBe(1);
  });

  it('migrates a pre-v2 word stat lazily, keeping its box and counts', () => {
    store.set('wordStats', {
      cat: { attempts: 8, correct: 7, box: 3, dueAt: Date.now() + 1000, lastSeen: null },
    });

    store.recordWordAttempt('cat', true, EVIDENCE.INDEPENDENT);

    const stat = store.get('wordStats').cat;
    expect(stat.attempts).toBe(9);
    // History landed in `guided`, the new attempt in `independent`.
    expect(stat.byEvidence.guided).toEqual({ attempts: 8, correct: 7 });
    expect(stat.byEvidence.independent).toEqual({ attempts: 1, correct: 1 });
    // The existing ladder position was not reset.
    expect(stat.box).toBe(4);
  });
});
