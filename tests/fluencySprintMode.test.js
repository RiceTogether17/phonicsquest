import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
const { setupFluencySprint, cleanup } = await import('../src/modes/fluencySprintMode.js');
const { store } = await import('../src/modules/store.js');
const { WORDS } = await import('../src/data/words.js');

const CAT = WORDS.find((w) => w.id === 'cat');

describe('Fluency Sprint mode', () => {
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
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  function tap({ correct }) {
    vi.advanceTimersByTime(200); // let the item's speak timer fire
    const btn = correct
      ? document.querySelector('.fs-card[data-correct="true"]')
      : document.querySelector('.fs-card[data-correct="false"]');
    btn.click();
    vi.advanceTimersByTime(300); // 250ms advance to the next item
  }

  it('shows a Start gate — no cards or countdown before the child begins', () => {
    setupFluencySprint(CAT, makeEls());
    expect(document.getElementById('fs-start-btn')).not.toBeNull();
    expect(document.querySelector('.fs-card')).toBeNull();
    vi.advanceTimersByTime(5000);
    expect(document.querySelector('.fs-summary')).toBeNull();
  });

  it('hides Say-It and Hint during the sprint and restores them on cleanup', () => {
    const els = makeEls();
    setupFluencySprint(CAT, els);
    expect(els.btnSayIt.style.display).toBe('none');
    expect(els.btnHint.style.display).toBe('none');
    cleanup();
    expect(els.btnSayIt.style.display).toBe('');
    expect(els.btnHint.style.display).toBe('');
  });

  it('after Start: timer shows 45, three cards with exactly one correct', () => {
    setupFluencySprint(CAT, makeEls());
    document.getElementById('fs-start-btn').click();

    expect(document.getElementById('fs-timer').textContent).toBe('45');
    const cards = document.querySelectorAll('.fs-card');
    expect(cards.length).toBe(3);
    expect(document.querySelectorAll('.fs-card[data-correct="true"]').length).toBe(1);
  });

  it('a correct tap increments the score and advances to a fresh item', () => {
    setupFluencySprint(CAT, makeEls());
    document.getElementById('fs-start-btn').click();
    tap({ correct: true });

    expect(document.getElementById('fs-score').textContent).toBe('✓ 1');
    const cards = document.querySelectorAll('.fs-card');
    expect(cards.length).toBe(3);
    expect([...cards].every((c) => !c.disabled)).toBe(true);
  });

  it('a fast accurate run masters the sprint: onResult(true, ≥45s)', () => {
    const els = makeEls();
    setupFluencySprint(CAT, els);
    document.getElementById('fs-start-btn').click();

    // ~500ms of fake time per item → 30 correct in ~15s → wpm ≈ 40 ≥ 30.
    for (let i = 0; i < 30; i++) tap({ correct: true });
    vi.advanceTimersByTime(45000); // run out the clock

    const summary = document.querySelector('.fs-summary');
    expect(summary).not.toBeNull();
    expect(summary.textContent).toContain('words/min');
    expect(summary.textContent).toContain('100%');

    document.querySelector('.vmcq-next-btn').click();
    expect(els.onResult).toHaveBeenCalledTimes(1);
    expect(els.onResult.mock.calls[0][0]).toBe(true);
    expect(els.onResult.mock.calls[0][1]).toBeGreaterThanOrEqual(45000);
  });

  it('an error-heavy run shows a coaching hint and reports onResult(false)', () => {
    const els = makeEls();
    setupFluencySprint(CAT, els);
    document.getElementById('fs-start-btn').click();

    for (let i = 0; i < 10; i++) tap({ correct: false });
    vi.advanceTimersByTime(45000);

    const summary = document.querySelector('.fs-summary');
    expect(summary.querySelector('.fs-summary-hint').textContent.length).toBeGreaterThan(8);
    document.querySelector('.vmcq-next-btn').click();
    expect(els.onResult.mock.calls[0][0]).toBe(false);
  });

  it('cleanup mid-sprint stops the clock: no summary ever appears, buttons restored', () => {
    const els = makeEls();
    setupFluencySprint(CAT, els);
    document.getElementById('fs-start-btn').click();
    tap({ correct: true });

    cleanup();
    expect(() => vi.advanceTimersByTime(60000)).not.toThrow();
    expect(document.querySelector('.fs-summary')).toBeNull();
    expect(els.onResult).not.toHaveBeenCalled();
    expect(els.btnHint.style.display).toBe('');
  });
});
