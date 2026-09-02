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
  globalThis.SpeechSynthesisUtterance = class {
    constructor(t) {
      this.text = t;
    }
  };
  globalThis.AudioContext =
    globalThis.AudioContext ||
    class {
      constructor() {
        this.state = 'running';
      }
      createOscillator() {
        return { connect: vi.fn(), start: vi.fn(), stop: vi.fn(), frequency: { value: 0 } };
      }
      createGain() {
        return {
          connect: vi.fn(),
          gain: {
            value: 1,
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
          },
        };
      }
      get destination() {
        return {};
      }
      resume() {
        return Promise.resolve();
      }
    };
}

stubAudioGlobals();
const { setupClassicBlend, cleanup } = await import('../src/modes/classicBlend.js');

/**
 * Listen & Blend (free mode) — DOM hygiene.
 *
 * This mode shows only the emoji + the labelled phoneme row; it must NOT
 * leave a previous word's assembled tiles in #word-display, or the screen
 * shows two different words at once (regression: "prong" tiles above the
 * "list" phoneme tiles).
 */

const LIST = {
  id: 'list',
  word: 'list',
  graphemes: ['l', 'i', 'st'],
  types: ['c', 'sv', 'bl'],
  pattern: 'CVCC',
  group: 'struct-cvcc',
  level: 2,
  emoji: '📋',
};

describe('setupClassicBlend', () => {
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
      wordEmoji: document.getElementById('word-emoji'),
      wordDisplay: document.getElementById('word-display'),
      phonemeRow: document.getElementById('phoneme-row'),
      modeInstruction: document.getElementById('mode-instruction'),
      modeArea: document.getElementById('mode-area'),
      btnCheck: document.getElementById('btn-check'),
      btnSayIt: document.getElementById('btn-say-it'),
      btnSkip: document.getElementById('btn-skip'),
      onResult: vi.fn(),
      onGroupChange: vi.fn(),
    };
  }

  it('clears stale #word-display tiles left by a previous word/mode', () => {
    const els = makeEls();
    // Simulate a prior mode's buildWordAnimation output ("prong") lingering.
    els.wordDisplay.innerHTML =
      '<span class="wheel-letter">pr</span><span class="wheel-letter">o</span><span class="wheel-letter">ng</span>';

    setupClassicBlend(LIST, els);

    expect(els.wordDisplay.innerHTML).toBe('');
    // Only the current word is on screen: 3 phoneme tiles (l · i · st).
    expect(els.phonemeRow.querySelectorAll('.phoneme-tile').length).toBe(3);
    expect(els.wordEmoji.textContent).toBe('📋');
  });
});
