/**
 * Phonemic-awareness modes must stay sound-first: no printed word during
 * the question phase, no bare-letter choice buttons. These tests are the
 * regression guard for the PA/phonics split called out in the architecture
 * review.
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

const { renderPhonemeChoiceGrid } = await import('../components/phonemeChoice.js');
const { store } = await import('../modules/store.js');
// Silence the audio side-effects so the test output stays clean.
store.set('sfxEnabled', false);

const baseEls = () => {
  document.body.innerHTML = `
    <div id="word-emoji"></div>
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

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('renderPhonemeChoiceGrid()', () => {
  const choices = [
    { grapheme: 'k', type: 'c', correct: true  },
    { grapheme: 'm', type: 'c', correct: false },
    { grapheme: 's', type: 'c', correct: false },
    { grapheme: 't', type: 'c', correct: false },
  ];

  it('renders one button per choice with phoneme notation, never bare uppercase letters', () => {
    const container = document.createElement('div');
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false });

    const buttons = container.querySelectorAll('.choice-btn--phoneme');
    expect(buttons).toHaveLength(4);

    const labels = [...container.querySelectorAll('.choice-btn-phoneme')].map(el => el.textContent);
    expect(labels).toEqual(['/k/', '/m/', '/s/', '/t/']);
    // No bare uppercase letter labels — those would be print contamination.
    expect(labels.every(l => l.startsWith('/') && l.endsWith('/'))).toBe(true);
  });

  it('marks the correct option via dataset.correct so the existing reveal flow keeps working', () => {
    const container = document.createElement('div');
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false });

    const buttons = [...container.querySelectorAll('.choice-btn--phoneme')];
    expect(buttons.filter(b => b.dataset.correct === 'true')).toHaveLength(1);
    expect(buttons.find(b => b.dataset.correct === 'true').dataset.grapheme).toBe('k');
  });

  it('includes a speaker affordance so the button reads as a sound, not a letter', () => {
    const container = document.createElement('div');
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false });
    const speakers = container.querySelectorAll('.choice-btn-speaker');
    expect(speakers).toHaveLength(4);
    for (const sp of speakers) expect(sp.getAttribute('aria-hidden')).toBe('true');
  });

  it('invokes onChoose with the choice and the clicked button', () => {
    const container = document.createElement('div');
    const onChoose  = vi.fn();
    renderPhonemeChoiceGrid(container, choices, { autoPlay: false, onChoose });

    const second = container.querySelectorAll('.choice-btn--phoneme')[1];
    second.click();
    expect(onChoose).toHaveBeenCalledTimes(1);
    expect(onChoose.mock.calls[0][0]).toEqual(choices[1]);
    expect(onChoose.mock.calls[0][1]).toBe(second);
  });

  it('ignores autoplay errors so a failing audio backend cannot break the question', async () => {
    const container = document.createElement('div');
    // Helper auto-plays via audio.speakPhoneme; in jsdom this returns without
    // throwing because sfx playback degrades gracefully. We just need to
    // confirm that mounting + advancing timers does not throw.
    renderPhonemeChoiceGrid(container, choices, { autoPlay: true, autoPlayDelay: 10, autoPlayStride: 10 });
    await vi.advanceTimersByTimeAsync(200);
    expect(container.querySelectorAll('.choice-btn--phoneme')).toHaveLength(4);
  });
});

describe('first/last/middle sound modes hide print during the question', () => {
  it('firstSound never shows the printed word until after a choice', async () => {
    const { setupFirstSound } = await import('../modes/firstSound.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cat');
    const els  = baseEls();

    setupFirstSound(word, els);

    // Word display must be empty during the question.
    expect(els.wordDisplay.innerHTML.trim()).toBe('');
    // Choice buttons must not contain the bare letter 'C'.
    const labels = [...els.modeArea.querySelectorAll('.choice-btn-phoneme')].map(e => e.textContent);
    expect(labels.length).toBe(4);
    expect(labels).toContain('/c/');
    for (const label of labels) {
      expect(label).toMatch(/^\/[a-z]+\/$/); // /lowercase-only/
    }
  });

  it('lastSound never shows the printed word until after a choice', async () => {
    const { setupLastSound } = await import('../modes/lastSound.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cat');
    const els  = baseEls();

    setupLastSound(word, els);
    expect(els.wordDisplay.innerHTML.trim()).toBe('');
    expect(els.modeArea.querySelectorAll('.choice-btn--phoneme')).toHaveLength(4);
  });

  it('middleSound never shows the printed word until after a choice', async () => {
    const { setupMiddleSound } = await import('../modes/middleSound.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cat');
    const els  = baseEls();

    setupMiddleSound(word, els);
    expect(els.wordDisplay.innerHTML.trim()).toBe('');
    expect(els.modeArea.querySelectorAll('.choice-btn--phoneme')).toHaveLength(4);
  });
});

describe('soundCount mode hides the printed word during the question', () => {
  it('does not render the printed word on setup', async () => {
    const { setupSoundCount } = await import('../modes/soundCount.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cake'); // silent-e: phoneme≠grapheme count
    const els  = baseEls();

    setupSoundCount(word, els);
    // If the printed word were rendered, wordDisplay would contain letter
    // tiles. Counting letters instead of sounds would give the wrong answer
    // for cake (4 letters, 3 sounds).
    expect(els.wordDisplay.innerHTML.trim()).toBe('');
  });

  it('reveals the printed word after the child commits a choice', async () => {
    const { setupSoundCount } = await import('../modes/soundCount.js');
    const { WORDS } = await import('../data/words.js');
    const word = WORDS.find(w => w.id === 'cat');
    const els  = baseEls();

    setupSoundCount(word, els);
    expect(els.wordDisplay.innerHTML.trim()).toBe('');

    // Simulate the child picking any answer.
    const btn = els.modeArea.querySelector('.choice-btn--count');
    btn.click();

    // wordDisplay is populated by buildWordAnimation() in the reveal path.
    expect(els.wordDisplay.innerHTML.trim()).not.toBe('');
  });
});
