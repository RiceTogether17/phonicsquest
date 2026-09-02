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
const { setupWordSort, cleanup, getCurrentWord } = await import('../src/modes/wordSortMode.js');
const { store } = await import('../src/modules/store.js');
const { WORDS } = await import('../src/data/words.js');

const CAT = WORDS.find((w) => w.id === 'cat');

describe('Word Sort mode', () => {
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

  /** Tap the bin matching (or mismatching) the current card's word. */
  function tapBin({ correct }) {
    const cardWord = document.querySelector('.ws-card-word').textContent;
    const wordObj = WORDS.find((w) => w.word === cardWord);
    const bins = [...document.querySelectorAll('.ws-bin')];
    const rightBin = bins.find(
      (b) =>
        b.dataset.scorerKey === wordObj.group ||
        b.dataset.group === wordObj.group ||
        b.dataset.scorerKey === `short-${(wordObj.group.match(/-([aeiou])$/) || [])[1]}`,
    );
    const target = correct ? rightBin : bins.find((b) => b !== rightBin);
    target.click();
  }

  function playRound(mistakes = 0) {
    let made = 0;
    for (let guard = 0; guard < 20; guard++) {
      if (document.querySelector('.ws-summary')) break;
      const card = document.querySelector('.ws-card-word');
      if (!card) break;
      tapBin({ correct: made >= mistakes ? true : (made++, false) });
      vi.advanceTimersByTime(800);
    }
  }

  it('renders two labelled bins and a word card with a 🔊 button', () => {
    setupWordSort(CAT, makeEls());
    const bins = document.querySelectorAll('.ws-bin');
    expect(bins.length).toBe(2);
    for (const bin of bins) {
      expect(bin.querySelector('.ws-bin-label').textContent.trim().length).toBeGreaterThan(0);
    }
    expect(document.querySelector('.ws-card-word')).not.toBeNull();
    expect(document.querySelector('.ws-card-speak')).not.toBeNull();
    expect(document.getElementById('ws-progress').textContent).toMatch(/Word 1 of \d+/);
  });

  it('hides the shell Say-It button and restores it on cleanup', () => {
    const els = makeEls();
    setupWordSort(CAT, els);
    expect(els.btnSayIt.style.display).toBe('none');
    cleanup();
    expect(els.btnSayIt.style.display).toBe('');
  });

  it('a correct bin tap shows ✓ status and advances to the next word', () => {
    vi.useFakeTimers();
    try {
      setupWordSort(CAT, makeEls());
      tapBin({ correct: true });
      expect(document.getElementById('ws-status').textContent).toContain('✓');
      vi.advanceTimersByTime(800);
      expect(document.getElementById('ws-progress').textContent).toMatch(/Word 2 of \d+/);
    } finally {
      vi.useRealTimers();
    }
  });

  it('a clean run ends in a summary and reports onResult(true) exactly once', () => {
    vi.useFakeTimers();
    try {
      const els = makeEls();
      setupWordSort(CAT, els);
      playRound(0);

      const summary = document.querySelector('.ws-summary');
      expect(summary).not.toBeNull();
      expect(summary.textContent).toContain('Perfect sort');

      const next = document.querySelector('.vmcq-next-btn');
      next.click();
      next.click(); // double-click guard ({once:true})
      expect(els.onResult).toHaveBeenCalledTimes(1);
      expect(els.onResult).toHaveBeenCalledWith(true, expect.any(Number));
    } finally {
      vi.useRealTimers();
    }
  });

  it('a short-vowel misplacement surfaces the vowel hint and reports onResult(false)', () => {
    vi.useFakeTimers();
    try {
      const els = makeEls();
      setupWordSort(CAT, els);
      playRound(1); // one deliberate wrong bin

      const summary = document.querySelector('.ws-summary');
      expect(summary.textContent).toMatch(/vowel/i); // getWordSortHint parity
      expect(summary.querySelector('.ws-summary-misses')).not.toBeNull();

      document.querySelector('.vmcq-next-btn').click();
      expect(els.onResult).toHaveBeenCalledWith(false, expect.any(Number));
    } finally {
      vi.useRealTimers();
    }
  });

  it('includes the shell word in the round and exposes it via getCurrentWord', () => {
    vi.useFakeTimers();
    try {
      setupWordSort(CAT, makeEls());
      expect(getCurrentWord()).toBe(CAT);

      const seen = [];
      for (let guard = 0; guard < 20; guard++) {
        const card = document.querySelector('.ws-card-word');
        if (!card || document.querySelector('.ws-summary')) break;
        seen.push(card.textContent);
        tapBin({ correct: true });
        vi.advanceTimersByTime(800);
      }
      expect(seen).toContain('cat');
    } finally {
      vi.useRealTimers();
    }
  });

  it('cleanup mid-round is safe: pending timers do nothing after teardown', () => {
    vi.useFakeTimers();
    try {
      setupWordSort(CAT, makeEls());
      tapBin({ correct: true }); // queues the 700ms advance
      cleanup();
      expect(() => vi.advanceTimersByTime(5000)).not.toThrow();
      // A fresh setup still works after mid-round teardown.
      setupWordSort(CAT, makeEls());
      expect(document.querySelector('.ws-card-word')).not.toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});
