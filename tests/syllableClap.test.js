import { beforeEach, describe, expect, it, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
  globalThis.AudioContext = globalThis.AudioContext || class {
    constructor() { this.state = 'running'; }
    createOscillator() { return { connect: vi.fn(), start: vi.fn(), stop: vi.fn(), frequency: { value: 0 } }; }
    createGain() { return { connect: vi.fn(), gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() } }; }
    get destination() { return {}; }
    resume() { return Promise.resolve(); }
  };
}

stubAudioGlobals();
const { setupSyllableClap, cleanup } = await import('../src/modes/syllableClap.js');

/**
 * Clap the Syllables — DOM + answer flow.
 */

const RUNNING = {
  id: 'running', word: 'running',
  graphemes: ['r','u','nn','-ing'],
  types: ['c','sv','c','sf'],
  group: 'suffix-ing', level: 3, emoji: '🏃',
};

const CAT = {
  id: 'cat', word: 'cat',
  graphemes: ['c','a','t'], types: ['c','sv','c'],
  group: 'short-a', level: 1, emoji: '🐱',
};

describe('setupSyllableClap', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="word-emoji-wrap" class="word-image-wrap"><div id="word-emoji"></div></div>
      <div id="word-display"></div>
      <div id="phoneme-row"></div>
      <div id="mode-instruction"></div>
      <div id="mode-area"></div>
      <button id="btn-check"></button>
      <button id="btn-say-it"></button>
      <button id="btn-skip"></button>
    `;
    stubAudioGlobals();
    cleanup();
  });

  function makeEls() {
    return {
      wordEmoji:       document.getElementById('word-emoji'),
      wordDisplay:     document.getElementById('word-display'),
      phonemeRow:      document.getElementById('phoneme-row'),
      modeInstruction: document.getElementById('mode-instruction'),
      modeArea:        document.getElementById('mode-area'),
      btnCheck:        document.getElementById('btn-check'),
      btnSayIt:        document.getElementById('btn-say-it'),
      btnSkip:         document.getElementById('btn-skip'),
      onResult:        vi.fn(),
    };
  }

  it('renders the clap button and a choice grid of syllable counts', () => {
    setupSyllableClap(RUNNING, makeEls());
    expect(document.getElementById('clap-btn')).not.toBeNull();
    const choices = document.querySelectorAll('#syllable-grid .choice-btn');
    expect(choices.length).toBeGreaterThanOrEqual(4);
  });

  it('clap button increments the visible counter', () => {
    setupSyllableClap(RUNNING, makeEls());
    const btn = document.getElementById('clap-btn');
    btn.click();
    btn.click();
    expect(document.getElementById('clap-count-display').textContent).toBe('2');
  });

  it('correct choice fires onResult(true) and reveals the breakdown', () => {
    const els = makeEls();
    setupSyllableClap(RUNNING, els);  // 2 syllables
    const choice2 = document.querySelector('#syllable-grid .choice-btn[data-value="2"]');
    choice2.click();
    expect(els.modeArea.querySelector('.vmcq-next-btn')).not.toBeNull();
    expect(document.querySelector('.syllable-reveal-breakdown')).not.toBeNull();

    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(els.onResult).toHaveBeenCalledWith(true, expect.any(Number));
  });

  it('wrong choice fires onResult(false) and shows correct answer', () => {
    const els = makeEls();
    setupSyllableClap(CAT, els);  // 1 syllable
    const choice3 = document.querySelector('#syllable-grid .choice-btn[data-value="3"]');
    choice3.click();
    expect(choice3.classList.contains('wrong')).toBe(true);
    const correctBtn = document.querySelector('#syllable-grid .choice-btn[data-correct="true"]');
    expect(correctBtn.classList.contains('correct')).toBe(true);

    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(els.onResult).toHaveBeenCalledWith(false, expect.any(Number));
  });
});
