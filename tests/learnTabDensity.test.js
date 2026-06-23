import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Learn-tab density: the Primary English module groups collapse to a short,
 * scannable list by pathway. Younger profiles collapse everything (future
 * milestone content); primary profiles keep only the everyday Language Use +
 * Vocabulary groups open and the heavier Sentence/Writing/Comprehension/Exam
 * groups closed.
 */

function stubAudioGlobals() {
  globalThis.speechSynthesis = {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
    paused: false, resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  globalThis.AudioContext = globalThis.AudioContext || class {
    constructor() { this.state = 'running'; }
    createOscillator() { return { connect() {}, start() {}, stop() {}, frequency: { value: 0 } }; }
    createGain() { return { connect() {}, gain: { value: 1, setValueAtTime() {}, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} } }; }
    get destination() { return {}; }
    resume() { return Promise.resolve(); }
  };
}

const GROUPS = ['language', 'vocab', 'sentences', 'writing', 'comprehension', 'exam'];

function buildQuestSection() {
  document.body.innerHTML = `
    <div id="home-quests-section">
      ${GROUPS.map(g => `<details class="home-group" data-group="${g}" open></details>`).join('')}
    </div>`;
}

const openGroups = () =>
  Array.from(document.querySelectorAll('#home-quests-section .home-group'))
    .filter(d => d.hasAttribute('open'))
    .map(d => d.getAttribute('data-group'));

describe('_applyQuestGroupDefaults — Learn-tab density', () => {
  beforeEach(() => {
    vi.resetModules();
    stubAudioGlobals();
    buildQuestSection();
  });

  it('collapses every Primary group for younger (early) profiles', async () => {
    const { app } = await import('../src/app.js');
    app._applyQuestGroupDefaults('early');
    expect(openGroups()).toEqual([]);
  });

  it('opens only Language Use + Vocabulary for primary profiles', async () => {
    const { app } = await import('../src/app.js');
    app._applyQuestGroupDefaults('primary');
    expect(openGroups().sort()).toEqual(['language', 'vocab']);
    // The dense exam-paper list is collapsed by default.
    expect(openGroups()).not.toContain('exam');
  });
});
