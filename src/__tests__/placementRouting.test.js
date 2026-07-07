import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { store } from '../modules/store.js';
import { createProfile, activateProfile } from '../modules/profiles.js';
import { getHomeLayoutForReadingBand } from '../modules/readingStages.js';
import { getRecommendation, getDailyPlan } from '../modules/recommendations.js';
import { normalizePhonicsGroupKey, normalizeGroupMasteryMap } from '../modules/phonicsGroupKeys.js';

let derivePlacementResult;
let getNextGateToAppend;

beforeAll(async () => {
  const synth = {
    getVoices: () => [],
    addEventListener: () => {},
    cancel: () => {},
    speak: () => {},
  };
  globalThis.speechSynthesis = globalThis.speechSynthesis || synth;
  if (globalThis.window) {
    globalThis.window.speechSynthesis = globalThis.window.speechSynthesis || synth;
  }
  const mod = await import('../modules/placementTest.js');
  derivePlacementResult = mod.derivePlacementResult;
  getNextGateToAppend = mod.getNextGateToAppend;
});

function resetState() {
  localStorage.clear();
  store.resetStorageKey();
  store.reset();
}

describe('placement gate adaptivity', () => {
  beforeEach(() => resetState());

  it('stops after Gate A when foundations are weak', () => {
    const weakA = [
      { section: 'oral', score: 0 },
      { section: 'vocab', correct: false },
      { section: 'firstSound', correct: false },
      { section: 'lastSound', correct: false },
      { section: 'middleSound', correct: false },
      { section: 'letterSounds', score: 0 },
      { section: 'oralBlending', correct: false },
    ];

    const result = derivePlacementResult(weakA, {}, 'primary');
    const nextGate = getNextGateToAppend(result, [{ gate: 'INTAKE' }, { gate: 'A' }]);

    expect(result.readingBand).toBe('pre-reader');
    expect(nextGate).toBe(null);
  });

  it('progresses to Gate B after strong Gate A', () => {
    const strongA = [
      { section: 'oral', score: 1 },
      { section: 'vocab', correct: true },
      { section: 'firstSound', correct: true },
      { section: 'lastSound', correct: true },
      { section: 'middleSound', correct: true },
      { section: 'letterSounds', score: 1 },
      { section: 'oralBlending', correct: true },
    ];

    const result = derivePlacementResult(strongA, {}, 'preschool');
    const nextGate = getNextGateToAppend(result, [{ gate: 'INTAKE' }, { gate: 'A' }]);

    expect(result.readingBand).toBe('emerging-decoder');
    expect(nextGate).toBe('B');
  });

  it('progresses to Gate C after strong A and B', () => {
    const strongAB = [
      { section: 'oral', score: 1 },
      { section: 'vocab', correct: true },
      { section: 'firstSound', correct: true },
      { section: 'lastSound', correct: true },
      { section: 'middleSound', correct: true },
      { section: 'letterSounds', score: 1 },
      { section: 'oralBlending', correct: true },
      { section: 'decoding', correct: true, phase: 1, group: 'cvc-a' },
      { section: 'decoding', correct: true, phase: 2, group: 'ccvc-a' },
      { section: 'sightWords', correct: true },
    ];

    const result = derivePlacementResult(strongAB, {}, 'primary');
    const nextGate = getNextGateToAppend(result, [{ gate: 'INTAKE' }, { gate: 'A' }, { gate: 'B' }]);

    expect(result.readingBand).toBe('developing-reader');
    expect(nextGate).toBe('C');
  });

  it('progresses to Gate D after strong A/B/C', () => {
    const strongABC = [
      { section: 'oral', score: 1 },
      { section: 'vocab', correct: true },
      { section: 'firstSound', correct: true },
      { section: 'lastSound', correct: true },
      { section: 'middleSound', correct: true },
      { section: 'letterSounds', score: 1 },
      { section: 'oralBlending', correct: true },
      { section: 'decoding', correct: true, phase: 1, group: 'cvc-a' },
      { section: 'decoding', correct: true, phase: 2, group: 'ccvc-a' },
      { section: 'decoding', correct: true, phase: 3, group: 'cvcc-e' },
      { section: 'connectedReading', correct: true },
      { section: 'comprehension', correct: true },
      { section: 'storyReadiness', score: 1 },
    ];

    const result = derivePlacementResult(strongABC, {}, 'primary');
    const nextGate = getNextGateToAppend(result, [{ gate: 'INTAKE' }, { gate: 'A' }, { gate: 'B' }, { gate: 'C' }]);

    expect(result.readingBand).toBe('developing-reader');
    expect(nextGate).toBe('D');
  });

  it('uses curriculum-aligned startGroup keys', () => {
    const result = derivePlacementResult([
      { section: 'decoding', correct: true, phase: 1, group: 'cvc-a' },
      { section: 'decoding', correct: true, phase: 2, group: 'ccvc-a' },
    ]);

    // Valid set tracks PLACEMENT_PHASES.fallbackGroup. CCVCC was missing
    // from the screener entirely before the curriculum/placement alignment
    // fix; it now gates phase 5 between digraphs and long vowels.
    expect(['cvc-a', 'ccvc-a', 'cvcc-a', 'digraphs', 'ccvcc-a', 'long-a']).toContain(result.startGroup);
  });

  it('returns valid startGroup and phonicsPhase when no decoding data is present', () => {
    // Pre-reader who never reaches Gate B should still have defined placement fields
    const preReaderOnly = [
      { section: 'oral', score: 0 },
      { section: 'vocab', correct: false },
      { section: 'firstSound', correct: false },
      { section: 'lastSound', correct: false },
      { section: 'middleSound', correct: false },
      { section: 'letterSounds', score: 0 },
      { section: 'oralBlending', correct: false },
    ];

    const result = derivePlacementResult(preReaderOnly, {}, 'preschool');

    expect(result.startGroup).toBe('cvc-a');
    expect(result.phonicsPhase).toBe(1);
    expect(result.phase).toBe(1);
  });

  it('does not deflate Gate A when only some sections were administered', () => {
    // A child who aced the four sections the screener actually gave them
    // must not be dragged below the 0.6 threshold by sections that were
    // skipped (middleSound, oralBlending, letterSounds were never asked).
    const partialStrongA = [
      { section: 'oral', score: 1 },
      { section: 'vocab', correct: true },
      { section: 'vocab', correct: true },
      { section: 'firstSound', correct: true },
      { section: 'lastSound', correct: true },
    ];

    const result = derivePlacementResult(partialStrongA, {}, 'preschool');
    expect(result.gateScores.gateA).toBeGreaterThanOrEqual(0.6);
    expect(result.readingBand).toBe('emerging-decoder');
  });

  it('still fails Gate A when administered sections are genuinely weak', () => {
    const partialWeakA = [
      { section: 'oral', score: 0 },
      { section: 'vocab', correct: false },
      { section: 'firstSound', correct: false },
    ];
    const result = derivePlacementResult(partialWeakA, {}, 'preschool');
    expect(result.readingBand).toBe('pre-reader');
  });

  it('counts letterSounds teacher-scale score toward Gate A', () => {
    // Learner has strong letter-sounds (teacher confirmed) but borderline elsewhere
    // Without the fix, letterSounds = 0, causing Gate A to fail
    const borderlineA = [
      { section: 'oral', score: 0.5 },
      { section: 'vocab', correct: true },
      { section: 'firstSound', correct: true },
      { section: 'lastSound', correct: false },
      { section: 'middleSound', correct: false },
      { section: 'letterSounds', score: 1 },   // teacher-scale: strong
      { section: 'oralBlending', correct: true },
    ];
    // gateA = (0.5 + 1 + 1 + 0 + 0 + 1 + 1) / 7 ≈ 0.643 → should pass with letterSounds counted
    const result = derivePlacementResult(borderlineA, {}, 'preschool');
    expect(result.gateScores.gateA).toBeGreaterThanOrEqual(0.6);
    expect(result.readingBand).toBe('emerging-decoder');
  });
});

describe('reading-band routing', () => {
  beforeEach(() => resetState());

  it('keeps weak primary learner on phonics-led recommendation', () => {
    const p = createProfile('Ari', '🦁', '#6c63ff', 'primary');
    activateProfile(p.id);
    store.set('placementProfile', {
      readingBand: 'pre-reader',
      sentenceReady: false,
      grammarReady: false,
      vocabularyReady: false,
    });

    const rec = getRecommendation();
    const plan = getDailyPlan();

    expect(rec.ctaTarget).toBe('first-sound');
    expect(plan[0].ctaTarget).toBe('first-sound');
    expect(plan.some(step => step.ctaTarget === 'letter-sounds')).toBe(true);
  });

  it('returns developing-reader hybrid home layout', () => {
    const layout = getHomeLayoutForReadingBand('developing-reader');
    expect(layout.hidePhonicsCore).toBe(false);
    expect(layout.questsMilestone).toBe(false);
    expect(layout.spotlightSentenceForge).toBe(true);
  });

  it('normalizes legacy short-vowel keys to canonical curriculum keys', () => {
    expect(normalizePhonicsGroupKey('short-a')).toBe('cvc-a');
    const gm = normalizeGroupMasteryMap({ 'short-a': 0.32, 'cvc-a': 0.61, 'short-e': 0.48 });
    expect(gm['cvc-a']).toBe(0.61);
    expect(gm['cvc-e']).toBe(0.48);
  });

  it('weak-group recommendation targets canonical cvc-* group keys', () => {
    const p = createProfile('Bo', '🦁', '#6c63ff', 'preschool');
    activateProfile(p.id);
    store.set('placementProfile', { readingBand: 'emerging-decoder' });
    store.set('groupMastery', { 'short-a': 0.31, 'short-e': 0.72 });

    const rec = getRecommendation();
    expect(rec.ctaTarget).toBe('blend');
    expect(rec.ctaGroup).toBe('cvc-a');
  });

  // New: confirm the additive stage-score + skill-gap fields surface alongside
  // the legacy gateScores. Adding them must not break any of the routing
  // expectations above.
  it('attaches stageScores + skillGaps + bandDescription without breaking legacy routing', () => {
    const responses = [
      { id: 'a-or-1', section: 'oral', score: 1 },
      { id: 'a-or-2', section: 'oral', score: 1 },
      { id: 'a-pic-1', section: 'vocab', correct: true },
      { id: 'a-pic-2', section: 'vocab', correct: true },
      { id: 'a-pic-3', section: 'vocab', correct: true },
      { id: 'a-first-1', section: 'firstSound', correct: true },
      { id: 'a-first-2', section: 'firstSound', correct: true },
      { id: 'a-first-3', section: 'firstSound', correct: true },
      { id: 'a-last-1', section: 'lastSound', correct: true },
      { id: 'a-last-2', section: 'lastSound', correct: true },
      { id: 'a-last-3', section: 'lastSound', correct: true },
      { id: 'a-middle-1', section: 'middleSound', correct: false },
      { id: 'a-middle-2', section: 'middleSound', correct: false },
      { id: 'a-middle-3', section: 'middleSound', correct: false },
      { id: 'a-letters-1', section: 'letterSounds', score: 1 },
      { id: 'a-letters-2', section: 'letterSounds', score: 1 },
      { id: 'a-blend-1', section: 'oralBlending', correct: true },
      { id: 'a-blend-2', section: 'oralBlending', correct: true },
      { id: 'a-blend-3', section: 'oralBlending', correct: true },
    ];
    const result = derivePlacementResult(responses, {}, 'preschool');
    // Legacy invariants still hold
    expect(result.readingBand).toBe('emerging-decoder');
    expect(result.gateScores.gateA).toBeGreaterThanOrEqual(0.6);
    // New fields are present + middle-sound shows up as a gap
    expect(result.stageScores.phonemicAwareness.middleSound).toBeCloseTo(0, 1);
    expect(result.skillGaps.some(g => g.skill === 'middleSound')).toBe(true);
    expect(typeof result.bandDescription).toBe('string');
  });
});
