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
      createBuffer(_c, frames) {
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
const { setupReadAndTap, cleanup } = await import('../src/modes/readAndTapMode.js');
const { store } = await import('../src/modules/store.js');
const { WORDS } = await import('../src/data/words.js');

const CAT = WORDS.find((w) => w.id === 'cat');

describe('Read & Tap mode', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="word-emoji-wrap" class="word-image-wrap"><div id="word-emoji"></div></div>
      <div id="word-display"></div>
      <div id="phoneme-row"></div>
      <div id="mode-instruction"></div>
      <div id="mode-area"></div>
      <button id="btn-check"></button>
      <button id="btn-say-it"></button>
      <button id="btn-hint"></button>
      <button id="btn-skip"></button>
    `;
    stubAudioGlobals();
    cleanup();
    store.reset();
    store.set('currentGroup', 'cvc-a');
    store.set('difficulty', 1);
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
      btnHint: document.getElementById('btn-hint'),
      btnSkip: document.getElementById('btn-skip'),
      onResult: vi.fn(),
    };
  }

  it('uses a curriculum sentence containing the word, tokens as buttons', () => {
    setupReadAndTap(CAT, makeEls());
    const tokens = [...document.querySelectorAll('.rt-token')];
    expect(tokens.length).toBeGreaterThanOrEqual(4);
    const sentence = tokens.map((t) => t.textContent).join(' ');
    expect(sentence.toLowerCase()).toContain('cat');
    const correctTokens = tokens.filter((t) => t.dataset.correct === 'true');
    expect(correctTokens.length).toBeGreaterThanOrEqual(1);
    for (const t of correctTokens) {
      expect(t.textContent.toLowerCase().replace(/[^a-z']/g, '')).toBe('cat');
    }
  });

  it('falls back to a template sentence for a word no curriculum sentence contains', () => {
    const zog = {
      id: 'zog',
      word: 'zog',
      graphemes: ['z', 'o', 'g'],
      types: ['c', 'sv', 'c'],
      pattern: 'CVC',
      group: 'short-o',
      level: 1,
      emoji: '👾',
      phonemes: ['z', 'o', 'g'],
    };
    store.set('currentGroup', 'cvc-o');
    setupReadAndTap(zog, makeEls());
    const tokens = [...document.querySelectorAll('.rt-token')];
    const sentence = tokens.map((t) => t.textContent).join(' ');
    expect(sentence.toLowerCase()).toContain('zog');
    expect(tokens.filter((t) => t.dataset.correct === 'true').length).toBe(1);
  });

  it('punctuation is preserved on the surface while matching is normalized', () => {
    setupReadAndTap(CAT, makeEls());
    const tokens = [...document.querySelectorAll('.rt-token')];
    // Curriculum sentence 'The cat sat on a mat.' ends with 'mat.'
    const withPunct = tokens.find((t) => /[.!,]$/.test(t.textContent));
    expect(withPunct).toBeTruthy();
    expect(withPunct.dataset.correct).toBe('false');
  });

  it('correct first tap → success feedback, Next reports onResult(true)', () => {
    const els = makeEls();
    setupReadAndTap(CAT, els);
    document.querySelector('.rt-token[data-correct="true"]').click();

    expect(els.modeArea.querySelector('.choice-feedback').textContent).toContain('Yes!');
    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(els.onResult).toHaveBeenCalledWith(true, expect.any(Number));
  });

  it('wrong first tap keeps the grid live and shows a category-specific hint', () => {
    const els = makeEls();
    setupReadAndTap(CAT, els);
    // 'mat' rhymes with 'cat' → the scorer's tapped-rhyme hint.
    const mat = [...document.querySelectorAll('.rt-token')].find((t) =>
      t.textContent.toLowerCase().startsWith('mat'),
    );
    mat.click();

    expect(mat.disabled).toBe(true);
    expect(els.modeArea.querySelector('.vmcq-next-btn')).toBeNull();
    expect(document.querySelector('.rt-token[data-correct="true"]').disabled).toBe(false);
    expect(document.getElementById('rt-hint').textContent).toMatch(/rhyme/i);
  });

  it('second-tap save still records first-attempt correctness (false)', () => {
    const els = makeEls();
    setupReadAndTap(CAT, els);
    const mat = [...document.querySelectorAll('.rt-token')].find((t) =>
      t.textContent.toLowerCase().startsWith('mat'),
    );
    mat.click();
    document.querySelector('.rt-token[data-correct="true"]').click();

    expect(document.querySelector('.rt-token--target')).not.toBeNull();
    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(els.onResult).toHaveBeenCalledWith(false, expect.any(Number));
  });
});
