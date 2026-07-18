/**
 * Tap the Sounds (oralSegment) — the grapheme-free segmenting mode.
 * Guards the two contracts that define it:
 *   1. Pure phonemic awareness: no printed word or letters anywhere,
 *      question or reveal.
 *   2. choiceRound's "first attempt counts" scoring: a second-try save
 *      still records the round as incorrect.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// jsdom does not implement Web Speech / Web Audio. Stub the bare minimum
// before importing anything that pulls in the audio module.
globalThis.speechSynthesis = globalThis.speechSynthesis || {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
};
globalThis.SpeechSynthesisUtterance = globalThis.SpeechSynthesisUtterance || class { constructor(text){ this.text = text; } };
if (!globalThis.AudioContext) {
  globalThis.AudioContext = class {
    constructor() {}
    createOscillator() { return { connect() {}, start() {}, stop() {} }; }
    createGain()       { return { connect() {}, gain: { value: 0 } }; }
  };
}

const { setupOralSegment, cleanup } = await import('../modes/oralSegment.js');
const { store } = await import('../modules/store.js');
store.set('sfxEnabled', false);

const WORD = {
  id: 'cat', word: 'cat', emoji: '🐱', group: 'short-a', level: 1,
  graphemes: ['c', 'a', 't'], types: ['c', 'sv', 'c'], phonemes: ['c', 'a', 't'],
};

const baseEls = () => {
  document.body.innerHTML = `
    <div class="word-image-wrap"><div id="word-emoji"></div></div>
    <div id="word-display"></div>
    <div id="phoneme-row"></div>
    <div id="mode-area"></div>
    <p id="mode-instruction"></p>
    <button id="btn-check"></button>
    <button id="btn-sayit"></button>
    <button id="btn-skip"></button>
  `;
  return {
    wordEmoji:       document.getElementById('word-emoji'),
    wordDisplay:     document.getElementById('word-display'),
    phonemeRow:      document.getElementById('phoneme-row'),
    modeArea:        document.getElementById('mode-area'),
    modeInstruction: document.getElementById('mode-instruction'),
    btnCheck:        document.getElementById('btn-check'),
    btnSayIt:        document.getElementById('btn-sayit'),
    btnSkip:         document.getElementById('btn-skip'),
    onResult:        vi.fn(),
  };
};

const tap  = (els, n) => { for (let i = 0; i < n; i++) els.modeArea.querySelector('#os-tap').click(); };
const done = (els)    => els.modeArea.querySelector('#os-done').click();

beforeEach(() => { vi.useFakeTimers(); });

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('setupOralSegment()', () => {
  it('shows the picture but never the printed word or letters', () => {
    const els = baseEls();
    setupOralSegment(WORD, els);

    expect(els.wordEmoji.textContent).toBe('🐱');
    expect(els.wordDisplay.innerHTML).toBe('');
    expect(els.phonemeRow.innerHTML).toBe('');
    // No letter of the word anywhere in the answer area.
    expect(els.modeArea.textContent).not.toMatch(/\bcat\b/);
  });

  it('each tap adds one visible sound dot; Start over clears them', () => {
    const els = baseEls();
    setupOralSegment(WORD, els);

    tap(els, 2);
    expect(els.modeArea.querySelectorAll('.sound-dot--filled')).toHaveLength(2);

    els.modeArea.querySelector('#os-reset').click();
    expect(els.modeArea.querySelectorAll('.sound-dot')).toHaveLength(0);
  });

  it('records a first-try correct count as correct', () => {
    const els = baseEls();
    setupOralSegment(WORD, els);

    tap(els, 3);
    done(els);
    els.modeArea.querySelector('.vmcq-next-btn').click();

    expect(els.onResult).toHaveBeenCalledTimes(1);
    expect(els.onResult.mock.calls[0][0]).toBe(true);
  });

  it('a wrong first try then a correct second try records incorrect', () => {
    const els = baseEls();
    setupOralSegment(WORD, els);

    tap(els, 2);
    done(els);
    // Retry: dots reset, round still live, no Next button yet.
    expect(els.modeArea.querySelectorAll('.sound-dot')).toHaveLength(0);
    expect(els.modeArea.querySelector('.vmcq-next-btn')).toBeNull();

    tap(els, 3);
    done(els);
    els.modeArea.querySelector('.vmcq-next-btn').click();

    expect(els.onResult).toHaveBeenCalledTimes(1);
    expect(els.onResult.mock.calls[0][0]).toBe(false);
  });

  it('two wrong tries locks the round and records incorrect', () => {
    const els = baseEls();
    setupOralSegment(WORD, els);

    tap(els, 1); done(els);
    tap(els, 5); done(els);

    expect(els.modeArea.querySelector('#os-tap').disabled).toBe(true);
    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(els.onResult.mock.calls[0][0]).toBe(false);
  });

  it('Done with zero taps nudges instead of counting as an attempt', () => {
    const els = baseEls();
    setupOralSegment(WORD, els);

    done(els);
    expect(els.modeArea.querySelector('.choice-feedback--retry')).toBeTruthy();
    expect(els.modeArea.querySelector('.vmcq-next-btn')).toBeNull();

    tap(els, 3);
    done(els);
    els.modeArea.querySelector('.vmcq-next-btn').click();
    // The empty-tap nudge did not burn the first try.
    expect(els.onResult.mock.calls[0][0]).toBe(true);
  });

  it('the reveal stays oral — dots only, still no printed word', () => {
    const els = baseEls();
    setupOralSegment(WORD, els);

    tap(els, 3);
    done(els);

    expect(els.modeArea.querySelectorAll('.sound-dot')).toHaveLength(3);
    expect(els.wordDisplay.innerHTML).toBe('');
    expect(els.modeArea.textContent).not.toMatch(/\bcat\b/);
  });
});
