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
        this.sampleRate = 44100;
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
      createBuffer(_channels, frames) {
        return { getChannelData: () => new Float32Array(frames) };
      }
      createBufferSource() {
        return { connect: vi.fn(), start: vi.fn(), stop: vi.fn(), buffer: null };
      }
      createBiquadFilter() {
        return { connect: vi.fn(), type: '', frequency: { value: 0 }, Q: { value: 0 } };
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
const { setupSyllableClap, cleanup } = await import('../src/modes/syllableClap.js');

/**
 * Clap the Syllables — DOM + answer flow.
 */

const RUNNING = {
  id: 'running',
  word: 'running',
  graphemes: ['r', 'u', 'nn', '-ing'],
  types: ['c', 'sv', 'c', 'sf'],
  group: 'suffix-ing',
  level: 3,
  emoji: '🏃',
};

const CAT = {
  id: 'cat',
  word: 'cat',
  graphemes: ['c', 'a', 't'],
  types: ['c', 'sv', 'c'],
  group: 'short-a',
  level: 1,
  emoji: '🐱',
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
      wordEmoji: document.getElementById('word-emoji'),
      wordDisplay: document.getElementById('word-display'),
      phonemeRow: document.getElementById('phoneme-row'),
      modeInstruction: document.getElementById('mode-instruction'),
      modeArea: document.getElementById('mode-area'),
      btnCheck: document.getElementById('btn-check'),
      btnSayIt: document.getElementById('btn-say-it'),
      btnSkip: document.getElementById('btn-skip'),
      onResult: vi.fn(),
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
    setupSyllableClap(RUNNING, els); // 2 syllables
    const choice2 = document.querySelector('#syllable-grid .choice-btn[data-value="2"]');
    choice2.click();
    expect(els.modeArea.querySelector('.vmcq-next-btn')).not.toBeNull();
    expect(document.querySelector('.syllable-reveal-breakdown')).not.toBeNull();

    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(els.onResult).toHaveBeenCalledWith(true, expect.any(Number));
  });

  it('works with a phonological pool word (3-syllable elephant) and shows up-to-4 choices', () => {
    const elephant = {
      id: 'syl-elephant',
      word: 'elephant',
      emoji: '🐘',
      syllables: 3,
      syllableBreakdown: 'el-e-phant',
    };
    const els = makeEls();
    setupSyllableClap(elephant, els);
    const choices = document.querySelectorAll('#syllable-grid .choice-btn');
    expect(choices.length).toBe(4); // min(6, max(4, 3+1)) = 4
    const choice3 = document.querySelector('#syllable-grid .choice-btn[data-value="3"]');
    choice3.click();
    expect(document.querySelector('.syllable-reveal-breakdown').textContent).toBe('el-e-phant');
    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(els.onResult).toHaveBeenCalledWith(true, expect.any(Number));
  });

  it('a 4-syllable word offers a choice up to 5', () => {
    const caterpillar = {
      id: 'syl-caterpillar',
      word: 'caterpillar',
      emoji: '🐛',
      syllables: 4,
      syllableBreakdown: 'cat-er-pil-lar',
    };
    setupSyllableClap(caterpillar, makeEls());
    const choices = document.querySelectorAll('#syllable-grid .choice-btn');
    expect(choices.length).toBe(5); // min(6, max(4, 4+1)) = 5
    expect(document.querySelector('#syllable-grid .choice-btn[data-value="5"]')).not.toBeNull();
  });

  it('first wrong choice allows a retry: tapped button locks, grid stays live', () => {
    const els = makeEls();
    setupSyllableClap(CAT, els); // 1 syllable
    const choice3 = document.querySelector('#syllable-grid .choice-btn[data-value="3"]');
    choice3.click();

    // Two-try contract: only the tapped button is disabled, no Next yet.
    expect(choice3.classList.contains('wrong')).toBe(true);
    expect(choice3.disabled).toBe(true);
    expect(els.modeArea.querySelector('.vmcq-next-btn')).toBeNull();
    const correctBtn = document.querySelector('#syllable-grid .choice-btn[data-correct="true"]');
    expect(correctBtn.disabled).toBe(false);
    expect(els.modeArea.querySelector('.choice-feedback').textContent).toContain('Almost');
  });

  it('second tap finishes the round and records first-attempt correctness (false)', () => {
    const els = makeEls();
    setupSyllableClap(CAT, els); // 1 syllable
    document.querySelector('#syllable-grid .choice-btn[data-value="3"]').click(); // miss
    const correctBtn = document.querySelector('#syllable-grid .choice-btn[data-correct="true"]');
    correctBtn.click(); // save on second try

    expect(correctBtn.classList.contains('correct')).toBe(true);
    expect(document.querySelector('.syllable-reveal-breakdown')).not.toBeNull();

    els.modeArea.querySelector('.vmcq-next-btn').click();
    // Recorded correctness = FIRST attempt, even though the second tap was right.
    expect(els.onResult).toHaveBeenCalledWith(false, expect.any(Number));
  });

  it('two wrong taps reveal the answer and fire onResult(false)', () => {
    const els = makeEls();
    setupSyllableClap(CAT, els); // 1 syllable
    document.querySelector('#syllable-grid .choice-btn[data-value="3"]').click();
    document.querySelector('#syllable-grid .choice-btn[data-value="4"]').click();

    const correctBtn = document.querySelector('#syllable-grid .choice-btn[data-correct="true"]');
    expect(correctBtn.classList.contains('correct')).toBe(true);
    expect(correctBtn.disabled).toBe(true);

    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(els.onResult).toHaveBeenCalledWith(false, expect.any(Number));
  });
});
