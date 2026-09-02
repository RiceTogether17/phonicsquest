import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Pins the speech path for phonemic-awareness modes.
 *
 * The right pedagogical play for First / Last / Middle Sound is
 * articulated (slowed) speech of the WHOLE word — segmenting the word
 * would reveal the answer (it literally plays /c/-/a/-/t/ for "cat",
 * which IS the phoneme the child is being asked to identify).
 */

function stubAudioGlobals() {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: (utt) => {
      queueMicrotask(() => utt.onend?.());
    },
    cancel: () => {},
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(t) {
      this.text = t;
    }
  };
}

describe('audio.speakWordArticulated', () => {
  beforeEach(() => {
    vi.resetModules();
    stubAudioGlobals();
  });

  it('uses a rate at or below 0.55 — slower than the default 0.8', async () => {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);
    store.set('voiceSpeed', 0.8);

    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();
    await audio.speakWordArticulated('cat');
    expect(speakSpy).toHaveBeenCalledTimes(1);
    expect(speakSpy.mock.calls[0][0]).toBe('cat');
    expect(speakSpy.mock.calls[0][1]).toBeLessThanOrEqual(0.55);
  });

  it('respects an even-slower user setting as the ceiling', async () => {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);
    store.set('voiceSpeed', 0.5);

    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();
    await audio.speakWordArticulated('cat');
    expect(speakSpy.mock.calls[0][1]).toBeLessThanOrEqual(0.5);
  });

  it('does not segment the word (no per-phoneme calls)', async () => {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);

    const phonemeSpy = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();
    vi.spyOn(audio, '_speak').mockResolvedValue();
    await audio.speakWordArticulated('cat');
    expect(phonemeSpy).not.toHaveBeenCalled();
  });

  it('skips audio when sfx is disabled', async () => {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', false);

    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();
    await audio.speakWordArticulated('cat');
    expect(speakSpy).not.toHaveBeenCalled();
  });
});

describe('Say-It button routing per mode', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = `
      <button id="btn-say-it"></button>
      <button id="btn-check"></button>
      <button id="btn-hint"></button>
      <button id="btn-skip"></button>
      <button id="btn-next"></button>
      <div id="phoneme-row"></div>
      <div id="game-progress-count"></div>
      <div id="speech-bubble"></div>
      <div id="word-emoji"></div>
      <div id="word-display"></div>
      <div id="mode-instruction"></div>
      <div id="mode-area"></div>
      <div id="game-mascot"></div>
      <div id="toast-container"></div>
    `;
    stubAudioGlobals();
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
  });

  for (const mode of ['first', 'last', 'middle']) {
    it(`uses speakWordArticulated for ${mode} mode (not natural, not stretched)`, async () => {
      const { app } = await import('../src/app.js');
      const { audio } = await import('../src/modules/audio.js');

      const articulatedSpy = vi.spyOn(audio, 'speakWordArticulated').mockResolvedValue();
      const naturalSpy = vi.spyOn(audio, 'speakWord').mockResolvedValue();
      const stretchedSpy = vi.spyOn(audio, 'speakWordStretched').mockResolvedValue();

      app._mode = mode;
      app._currentWord = {
        id: 'cat',
        word: 'cat',
        graphemes: ['c', 'a', 't'],
        types: ['c', 'sv', 'c'],
      };

      app._handleSayIt();

      expect(articulatedSpy).toHaveBeenCalledTimes(1);
      expect(articulatedSpy.mock.calls[0][0]).toBe('cat');
      expect(naturalSpy).not.toHaveBeenCalled();
      expect(stretchedSpy).not.toHaveBeenCalled();
    });
  }

  it('still uses speakWordStretched for segment mode', async () => {
    const { app } = await import('../src/app.js');
    const { audio } = await import('../src/modules/audio.js');

    const articulatedSpy = vi.spyOn(audio, 'speakWordArticulated').mockResolvedValue();
    const stretchedSpy = vi.spyOn(audio, 'speakWordStretched').mockResolvedValue();

    app._mode = 'segment';
    app._currentWord = {
      id: 'cat',
      word: 'cat',
      graphemes: ['c', 'a', 't'],
      types: ['c', 'sv', 'c'],
    };

    app._handleSayIt();
    expect(stretchedSpy).toHaveBeenCalledTimes(1);
    expect(articulatedSpy).not.toHaveBeenCalled();
  });

  it('uses natural speakWord for non-PA modes (e.g. blend)', async () => {
    const { app } = await import('../src/app.js');
    const { audio } = await import('../src/modules/audio.js');

    const naturalSpy = vi.spyOn(audio, 'speakWord').mockResolvedValue();
    const articulatedSpy = vi.spyOn(audio, 'speakWordArticulated').mockResolvedValue();

    app._mode = 'blend';
    app._currentWord = {
      id: 'cat',
      word: 'cat',
      graphemes: ['c', 'a', 't'],
      types: ['c', 'sv', 'c'],
    };

    app._handleSayIt();
    expect(naturalSpy).toHaveBeenCalledTimes(1);
    expect(articulatedSpy).not.toHaveBeenCalled();
  });
});
