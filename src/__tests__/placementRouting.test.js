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

    expect(['cvc-a', 'ccvc-a', 'cvcc-a', 'digraphs', 'long-a']).toContain(result.startGroup);
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
});
