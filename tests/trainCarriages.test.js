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
const { pickTrainRound, setupTrainCarriages, cleanup } =
  await import('../src/modes/trainCarriages.js');

/**
 * Train Carriages — round composition + integration smoke.
 *
 * `pickTrainRound` is the pure round-builder; the setup test confirms
 * the framework slots together (cards rendered, target announced,
 * round-complete fires onResult once every match is tapped).
 */

const POOL = [
  // /b/ — 3 matches available
  {
    id: 'bad',
    word: 'bad',
    graphemes: ['b', 'a', 'd'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '😠',
  },
  {
    id: 'bag',
    word: 'bag',
    graphemes: ['b', 'a', 'g'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '👜',
  },
  {
    id: 'bat',
    word: 'bat',
    graphemes: ['b', 'a', 't'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '🦇',
  },
  // /c/
  {
    id: 'cab',
    word: 'cab',
    graphemes: ['c', 'a', 'b'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '🚕',
  },
  {
    id: 'can',
    word: 'can',
    graphemes: ['c', 'a', 'n'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '🥫',
  },
  {
    id: 'cat',
    word: 'cat',
    graphemes: ['c', 'a', 't'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '🐱',
  },
  // others
  {
    id: 'dad',
    word: 'dad',
    graphemes: ['d', 'a', 'd'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '👨',
  },
  {
    id: 'pan',
    word: 'pan',
    graphemes: ['p', 'a', 'n'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '🍳',
  },
  {
    id: 'ran',
    word: 'ran',
    graphemes: ['r', 'a', 'n'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '🏃',
  },
  {
    id: 'tan',
    word: 'tan',
    graphemes: ['t', 'a', 'n'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '🍂',
  },
  {
    id: 'ham',
    word: 'ham',
    graphemes: ['h', 'a', 'm'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    emoji: '🍖',
  },
];

describe('pickTrainRound', () => {
  it('returns exactly cardCount cards with matchCount matches by default', () => {
    const { matches, distractors } = pickTrainRound('b', 'c', POOL, {
      cardCount: 6,
      matchCount: 3,
    });
    expect(matches.length + distractors.length).toBe(6);
    expect(matches).toHaveLength(3);
    expect(matches.every((m) => m.graphemes[0] === 'b')).toBe(true);
    expect(distractors.every((d) => d.graphemes[0] !== 'b')).toBe(true);
  });

  it('caps matches when the pool has fewer than the quota', () => {
    const pool = POOL.filter((w) => w.id !== 'bat'); // only bad + bag left
    const { matches } = pickTrainRound('b', 'c', pool, { cardCount: 6, matchCount: 3 });
    expect(matches.map((m) => m.id).sort()).toEqual(['bad', 'bag']);
  });

  it('matches are sorted alphabetically by word', () => {
    const { matches } = pickTrainRound('c', 'c', POOL, { cardCount: 6, matchCount: 3 });
    expect(matches.map((m) => m.word)).toEqual(['cab', 'can', 'cat']);
  });

  it('does not duplicate words between matches and distractors', () => {
    const { matches, distractors } = pickTrainRound('b', 'c', POOL, {
      cardCount: 6,
      matchCount: 3,
    });
    const all = [...matches, ...distractors].map((w) => w.id);
    expect(new Set(all).size).toBe(all.length);
  });

  it('returns empty round when no matches exist for the target', () => {
    const { matches, distractors } = pickTrainRound('z', 'c', POOL);
    expect(matches).toEqual([]);
    expect(distractors).toEqual([]);
  });
});

describe('setupTrainCarriages — DOM + completion flow', () => {
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

  it('renders 6 word cards and a target sound for a Short-A b-word', () => {
    const els = makeEls();
    setupTrainCarriages(POOL[0], els); // 'bad' → target = /b/
    const cards = document.querySelectorAll('.word-card');
    expect(cards.length).toBe(6);
    expect(document.querySelector('.train-target-sound').textContent).toBe('/b/');
    expect(document.querySelector('.train-engine')).not.toBeNull();
  });

  it('completes the round (calls onResult) only when all matching cards are tapped', async () => {
    const els = makeEls();
    setupTrainCarriages(POOL[0], els); // target /b/, 3 matches

    const matchCards = Array.from(document.querySelectorAll('.word-card[data-match="true"]'));
    expect(matchCards.length).toBeGreaterThanOrEqual(2);

    // Tap all but one match — should NOT complete yet.
    for (let i = 0; i < matchCards.length - 1; i++) matchCards[i].click();
    expect(els.onResult).not.toHaveBeenCalled();

    // Final match → triggers onResult after the celebration delay.
    matchCards[matchCards.length - 1].click();
    await new Promise((r) => setTimeout(r, 1700));
    expect(els.onResult).toHaveBeenCalledTimes(1);
    expect(els.onResult.mock.calls[0][0]).toBe(true); // clean round
  }, 4000);

  it('shakes a wrong-tap card without completing the round', () => {
    const els = makeEls();
    setupTrainCarriages(POOL[0], els);
    const wrong = document.querySelector('.word-card[data-match="false"]');
    expect(wrong).not.toBeNull();
    wrong.click();
    expect(wrong.classList.contains('word-card--wrong')).toBe(true);
    expect(els.onResult).not.toHaveBeenCalled();
  });

  it('a round finished with a mis-tap reports onResult(false) so the word is not promoted', async () => {
    const els = makeEls();
    setupTrainCarriages(POOL[0], els); // target /b/

    // One wrong tap, then collect every match.
    document.querySelector('.word-card[data-match="false"]').click();
    document.querySelectorAll('.word-card[data-match="true"]').forEach((c) => c.click());

    await new Promise((r) => setTimeout(r, 1700));
    expect(els.onResult).toHaveBeenCalledTimes(1);
    expect(els.onResult.mock.calls[0][0]).toBe(false); // real correctness, not always-true
  }, 4000);
});
