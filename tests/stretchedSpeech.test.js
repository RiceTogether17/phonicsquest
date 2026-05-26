import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('stretched speech for phonemic awareness', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = '';
    globalThis.speechSynthesis = {
      getVoices: () => [],
      addEventListener: () => {},
      speak: vi.fn((utt) => {
        // Resolve onend asynchronously so callers' `await` continues.
        queueMicrotask(() => utt.onend?.());
      }),
      cancel: vi.fn(),
      paused: false,
      resume: vi.fn(),
    };
    globalThis.SpeechSynthesisUtterance = class {
      constructor(text) { this.text = text; }
    };
  });

  it('sequences phonemes then says the full word slowly', async () => {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);
    store.set('voiceSpeed', 0.8);

    const phonemeOrder = [];
    vi.spyOn(audio, 'speakPhoneme').mockImplementation(async (g) => {
      phonemeOrder.push(g);
    });
    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();
    const delaySpy = vi.spyOn(audio, '_delay').mockResolvedValue();

    await audio.speakWordStretched({
      word: 'cat',
      graphemes: ['c', 'a', 't'],
      types: ['c', 'sv', 'c'],
    });

    expect(phonemeOrder).toEqual(['c', 'a', 't']);
    // Final blend re-says the full word at a slow rate
    expect(speakSpy).toHaveBeenCalledTimes(1);
    expect(speakSpy.mock.calls[0][0]).toBe('cat');
    expect(speakSpy.mock.calls[0][1]).toBeLessThan(0.8);
    // One inter-phoneme gap per non-first phoneme, plus the pre-blend pause
    expect(delaySpy).toHaveBeenCalledTimes(3);
  });

  it('falls back to plain slow speech when wordData has no graphemes', async () => {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);

    const phonemeSpy = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();
    const speakSpy   = vi.spyOn(audio, '_speak').mockResolvedValue();

    await audio.speakWordStretched('the');

    expect(phonemeSpy).not.toHaveBeenCalled();
    expect(speakSpy).toHaveBeenCalledTimes(1);
    expect(speakSpy.mock.calls[0][0]).toBe('the');
  });

  it('respects the sfx-disabled setting and skips audio entirely', async () => {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', false);

    const phonemeSpy = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();
    const speakSpy   = vi.spyOn(audio, '_speak').mockResolvedValue();

    await audio.speakWordStretched({ word: 'cat', graphemes: ['c','a','t'], types: ['c','sv','c'] });

    expect(phonemeSpy).not.toHaveBeenCalled();
    expect(speakSpy).not.toHaveBeenCalled();
  });

  it('settings controller binds and applies the stretched-speech toggle', async () => {
    document.body.innerHTML = `
      <input id="stretched-speech-toggle" type="checkbox" />
      <input id="sfx-toggle" type="checkbox" />
      <input id="autoplay-toggle" type="checkbox" />
      <input id="voice-speed" type="range" />
      <span id="voice-speed-display"></span>
      <input id="reduced-motion-toggle" type="checkbox" />
      <input id="font-size-scale" type="range" />
      <span id="font-size-scale-display"></span>
      <input id="bank-chip-scale" type="range" />
      <span id="bank-chip-scale-display"></span>
      <input id="bilingual-toggle" type="checkbox" />
      <input id="dyslexia-font-toggle" type="checkbox" />
      <input id="high-contrast-toggle" type="checkbox" />
      <input id="goal-range" type="range" />
      <span id="goal-range-display"></span>
    `;

    const { settingsController } = await import('../src/modules/settingsController.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();

    const badges = { reset: vi.fn() };
    const gamification = { init: vi.fn() };
    settingsController.bind({ store, badges, gamification, onReset: vi.fn(), closeModal: vi.fn() });

    const toggle = /** @type {HTMLInputElement} */ (document.getElementById('stretched-speech-toggle'));
    toggle.checked = true;
    toggle.dispatchEvent(new Event('change'));
    expect(store.get('stretchedSpeech')).toBe(true);

    toggle.checked = false;
    store.set('stretchedSpeech', true);
    settingsController.apply(store);
    expect(toggle.checked).toBe(true);
  });

  it('phonemic-awareness hint plays the stretched word', async () => {
    document.body.innerHTML = `
      <button id="btn-hint">💡 Hint</button>
      <div id="phoneme-row"></div>
      <div id="toast-container"></div>
    `;

    globalThis.AudioContext = globalThis.AudioContext || class {
      constructor() { this.state = 'running'; }
      createOscillator() {
        return { connect: vi.fn(), start: vi.fn(), stop: vi.fn(), frequency: { value: 0 } };
      }
      createGain() {
        return {
          connect: vi.fn(),
          gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() },
        };
      }
      get destination() { return {}; }
      resume() { return Promise.resolve(); }
    };

    const { app } = await import('../src/app.js');
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();

    const stretchedSpy = vi.spyOn(audio, 'speakWordStretched').mockResolvedValue();
    const phonemeSpy   = vi.spyOn(audio, 'speakPhoneme').mockResolvedValue();
    const wordSpy      = vi.spyOn(audio, 'speakWord').mockResolvedValue();

    app._mode = 'first';
    app._hintTier = 0;
    app._hintUsed = false;
    app._currentWord = { id: 'pa-1', word: 'sat', graphemes: ['s','a','t'], types: ['c','sv','c'] };
    app._els = { btnHint: document.getElementById('btn-hint') };
    app._showToast = vi.fn();

    await app._giveHint();

    expect(stretchedSpy).toHaveBeenCalledTimes(1);
    expect(stretchedSpy.mock.calls[0][0]).toBe(app._currentWord);
    // Non-PA paths should not have fired
    expect(phonemeSpy).not.toHaveBeenCalled();
    expect(wordSpy).not.toHaveBeenCalled();
    // Hint button should be marked used after the single stretched playback
    expect(app._els.btnHint.getAttribute('aria-disabled')).toBe('true');
    expect(app._els.btnHint.textContent).toBe('💡 Used');
    expect(app._hintUsed).toBe(true);
  });
});
