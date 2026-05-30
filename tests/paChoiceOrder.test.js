import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Pins the choice-grid ordering policy for the phonemic-awareness modes:
 * Phase 1–2 words (level ≤ 2) get alphabetical order so a teacher/parent
 * can cover initial / final / middle sounds systematically. Phase 3+
 * (level ≥ 3) goes back to shuffled so the answer can't be located by
 * remembered position.
 */

const DOM_HTML = `
  <div id="word-emoji"></div>
  <div id="word-display"></div>
  <div id="phoneme-row"></div>
  <div id="mode-instruction"></div>
  <div id="mode-area"></div>
  <button id="btn-check"></button>
  <button id="btn-say-it"></button>
  <button id="btn-skip"></button>
`;

function makeEls() {
  document.body.innerHTML = DOM_HTML;
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

function readRenderedGraphemes() {
  return Array.from(document.querySelectorAll('#mode-area .choice-btn'))
    .map(b => b.dataset.grapheme);
}

beforeEach(() => {
  vi.resetModules();
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
});

describe('First Sound — choice ordering', () => {
  it('Phase 1 word (level 1) renders choices in alphabetical order', async () => {
    const { setupFirstSound, cleanup } = await import('../src/modes/firstSound.js');
    const els = makeEls();
    setupFirstSound(
      { id: 't', word: 'cat', level: 1, graphemes: ['c','a','t'], types: ['c','sv','c'] },
      els,
    );
    const order = readRenderedGraphemes();
    expect(order).toHaveLength(4);
    expect(order).toContain('c');
    expect([...order]).toEqual([...order].sort((a, b) => a.localeCompare(b)));
    cleanup();
  });

  it('Phase 3+ word (level 3) shuffles — at least one run differs from sorted order', async () => {
    const { setupFirstSound, cleanup } = await import('../src/modes/firstSound.js');
    let sawUnsorted = false;
    for (let i = 0; i < 30 && !sawUnsorted; i++) {
      const els = makeEls();
      setupFirstSound(
        { id: 'bel', word: 'belt', level: 3, graphemes: ['b','e','l','t'], types: ['c','sv','c','c'] },
        els,
      );
      const order = readRenderedGraphemes();
      const sorted = [...order].sort((a, b) => a.localeCompare(b));
      if (order.join('|') !== sorted.join('|')) sawUnsorted = true;
      cleanup();
    }
    expect(sawUnsorted).toBe(true);
  });
});

describe('Last Sound — choice ordering', () => {
  it('Phase 1 word (level 1) renders choices in alphabetical order', async () => {
    const { setupLastSound, cleanup } = await import('../src/modes/lastSound.js');
    const els = makeEls();
    setupLastSound(
      { id: 'd', word: 'dog', level: 1, graphemes: ['d','o','g'], types: ['c','sv','c'] },
      els,
    );
    const order = readRenderedGraphemes();
    expect(order).toHaveLength(4);
    expect(order).toContain('g');
    expect([...order]).toEqual([...order].sort((a, b) => a.localeCompare(b)));
    cleanup();
  });
});

describe('Middle Sound — choice ordering', () => {
  it('Phase 1 word (level 1) renders vowel choices in alphabetical order (a, e, i, o, u feel)', async () => {
    const { setupMiddleSound, cleanup } = await import('../src/modes/middleSound.js');
    const els = makeEls();
    setupMiddleSound(
      { id: 'cat', word: 'cat', level: 1, graphemes: ['c','a','t'], types: ['c','sv','c'] },
      els,
    );
    const order = readRenderedGraphemes();
    expect(order).toHaveLength(4);
    expect(order).toContain('a');
    expect([...order]).toEqual([...order].sort((a, b) => a.localeCompare(b)));
    cleanup();
  });
});
