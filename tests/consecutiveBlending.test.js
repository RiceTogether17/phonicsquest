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
const { audio } = await import('../src/modules/audio.js');
const { store } = await import('../src/modules/store.js');
const { setupClassicBlend, cleanup } = await import('../src/modes/classicBlend.js');

const LIST = {
  id: 'list', word: 'list',
  graphemes: ['l', 'i', 'st'], types: ['c', 'sv', 'bl'],
  pattern: 'CVCC', group: 'struct-cvcc', level: 2, emoji: '📋',
};

const CAKE = {
  id: 'cake', word: 'cake',
  graphemes: ['c', 'a', 'k', 'e'], types: ['c', 'lv', 'c', 'se'],
  pattern: 'CVCe', group: 'magic-e-a', level: 2, emoji: '🎂',
};

const PRONG = {
  id: 'prong', word: 'prong',
  graphemes: ['pr', 'o', 'ng'], types: ['bl', 'sv', 'd'],
  pattern: 'CCVC', group: 'cvc-o', level: 2, emoji: '🍴',
};

describe('audio.speakChunk (consecutive blending)', () => {
  beforeEach(() => {
    stubAudioGlobals();
    store.set('sfxEnabled', true);
    vi.restoreAllMocks();
  });

  it('delegates the full-word chunk to speakWord', async () => {
    const speakWord = vi.spyOn(audio, 'speakWord').mockResolvedValue();
    await audio.speakChunk(LIST, 3);
    expect(speakWord).toHaveBeenCalledWith('list');
  });

  it('speaks a consonant-final chunk as one blended TTS unit', async () => {
    const speak = vi.spyOn(audio, '_speak').mockResolvedValue();
    const speakPhoneme = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();
    await audio.speakChunk(PRONG, 2); // "pro" ends in a short vowel → fallback
    // 'pr' + 'o' chunk ends in short vowel, so this one falls back...
    expect(speak).not.toHaveBeenCalled();
    expect(speakPhoneme).toHaveBeenCalledTimes(2);
  });

  it('uses TTS for a chunk ending in a consonant with no pending magic-e', async () => {
    const speak = vi.spyOn(audio, '_speak').mockResolvedValue();
    // Build a word where the 2-grapheme chunk ends in a consonant: "lis" of list?
    // 'l'+'i' ends in sv; use a VC-start word instead.
    const AND = {
      id: 'and', word: 'and',
      graphemes: ['a', 'n', 'd'], types: ['sv', 'c', 'c'],
      pattern: 'VCC', group: 'cvc-a', level: 1, emoji: '➕',
    };
    await audio.speakChunk(AND, 2); // "an" ends in a consonant → TTS
    expect(speak).toHaveBeenCalled();
    expect(speak.mock.calls[0][0]).toBe('an');
  });

  it('falls back to phoneme playback when the chunk ends in a short vowel', async () => {
    const speak = vi.spyOn(audio, '_speak').mockResolvedValue();
    const speakPhoneme = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();
    await audio.speakChunk(LIST, 2); // "li" would be read as "lie" by TTS
    expect(speak).not.toHaveBeenCalled();
    expect(speakPhoneme).toHaveBeenCalledTimes(2);
  });

  it('falls back to phoneme playback when a magic-e is not yet in the chunk', async () => {
    const speak = vi.spyOn(audio, '_speak').mockResolvedValue();
    const speakPhoneme = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();
    await audio.speakChunk(CAKE, 3); // "cak" would be read with a short vowel
    expect(speak).not.toHaveBeenCalled();
    expect(speakPhoneme).toHaveBeenCalledTimes(3);
  });

  it('plays nothing when sfx is disabled', async () => {
    store.set('sfxEnabled', false);
    const speak = vi.spyOn(audio, '_speak').mockResolvedValue();
    const speakWord = vi.spyOn(audio, 'speakWord').mockResolvedValue();
    await audio.speakChunk(LIST, 2);
    expect(speak).not.toHaveBeenCalled();
    expect(speakWord).not.toHaveBeenCalled();
    store.set('sfxEnabled', true);
  });
});

describe('Listen & Blend — blend-style toggle', () => {
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
    store.set('autoplay', false);
    store.set('blendStyle', 'simultaneous');
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
      onGroupChange:   vi.fn(),
    };
  }

  it('renders both blend-style buttons with the saved style active', () => {
    store.set('blendStyle', 'cumulative');
    setupClassicBlend(LIST, makeEls());
    const btns = document.querySelectorAll('[data-blend-style]');
    expect(btns.length).toBe(2);
    const active = document.querySelector('[data-blend-style].speed-btn--active');
    expect(active?.dataset.blendStyle).toBe('cumulative');
  });

  it('persists the chosen style to the store on click', () => {
    setupClassicBlend(LIST, makeEls());
    document.querySelector('[data-blend-style="cumulative"]').click();
    expect(store.get('blendStyle')).toBe('cumulative');
    const active = document.querySelector('[data-blend-style].speed-btn--active');
    expect(active?.dataset.blendStyle).toBe('cumulative');
  });
});

describe('Blend It! — cumulative reveal', () => {
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
    store.set('autoplay', false);
    vi.restoreAllMocks();
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

  it('shows the blend-style toggle before the first reveal', async () => {
    store.set('blendStyle', 'simultaneous');
    const { setupBlend, cleanup: blendCleanup } = await import('../src/modes/blend.js');
    blendCleanup();
    setupBlend(LIST, makeEls());
    expect(document.querySelectorAll('[data-blend-style]').length).toBe(2);
  });

  it('plays a cumulative chunk instead of a lone phoneme after the first sound', async () => {
    store.set('blendStyle', 'cumulative');
    const { setupBlend, cleanup: blendCleanup } = await import('../src/modes/blend.js');
    blendCleanup();

    const speakPhoneme = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();
    const speakChunk   = vi.spyOn(audio, 'speakChunk').mockResolvedValue();

    const els = makeEls();
    setupBlend(LIST, els);

    // First sound: lone phoneme
    document.getElementById('btn-reveal-next').click();
    await vi.waitFor(() => expect(speakPhoneme).toHaveBeenCalledTimes(1));
    expect(speakChunk).not.toHaveBeenCalled();

    // Second sound: blended chunk "li" — wait for the post-reveal re-render
    // (a 200 ms guard ignores clicks while the first reveal is finishing).
    await vi.waitFor(() =>
      expect(document.getElementById('blend-tip')?.textContent).toContain('Sound 1 of 3'),
    { timeout: 2000 });
    document.getElementById('btn-reveal-next').click();
    await vi.waitFor(() => expect(speakChunk).toHaveBeenCalledWith(LIST, 2));
  });
});
