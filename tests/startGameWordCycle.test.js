import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Regression test: non-PA, non-syllable modes (segment, blend,
 * classicBlend, hear, missing, soundCount, etc.) must call the
 * adaptive picker on EVERY _startGame call. A previous version
 * gated the adaptive call on `if (!this._currentWord)`, which read
 * truthy from the previous round so the same word reappeared
 * indefinitely (the "keeps showing bag" bug in segment mode).
 */

describe('_startGame — non-PA modes pick a fresh word every round', () => {
  beforeEach(() => {
    vi.resetModules();
    document.body.innerHTML = `
      <div id="phoneme-row"></div>
      <div id="game-progress-count"></div>
      <div id="game-mascot"></div>
      <div id="toast-container"></div>
      <div id="speech-bubble"></div>
      <div id="word-emoji"></div>
      <div id="word-display"></div>
      <div id="mode-instruction"></div>
      <div id="mode-area"></div>
      <button id="btn-check"></button>
      <button id="btn-say-it"></button>
      <button id="btn-skip"></button>
      <button id="btn-hint"></button>
      <button id="btn-next"></button>
    `;
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
  });

  it('segment mode calls progress.getNextWord on every round, even when _currentWord is already set', async () => {
    const { app } = await import('../src/app.js');
    const { progress } = await import('../src/modules/progress.js');
    const { MODES }  = await import('../src/modes/index.js');

    const getNextSpy = vi.spyOn(progress, 'getNextWord').mockImplementation(() => ({
      id: `w-${Math.random()}`, word: 'mock', graphemes: ['m','o','c','k'],
      types: ['c','sv','c','c'], emoji: '🃏', group: 'short-o', level: 1,
      phonemes: ['m','o','k'],
    }));

    // Stub the segment mode's setup so the test exercises only the
    // word-picking path inside _startGame — not the full mode UI.
    const segmentSetupSpy = vi.spyOn(MODES.segment, 'setup').mockImplementation(() => {});

    // Simulate the second round of a normal session: _currentWord is
    // already populated from the prior round and _sessionType='normal'.
    app._mode = 'segment';
    app._sessionType = 'normal';
    app._currentWord = { id: 'previous', word: 'bag', graphemes: ['b','a','g'], types: ['c','sv','c'] };

    app._showScreen    = vi.fn();

    app._startGame('short-a');

    expect(getNextSpy).toHaveBeenCalledTimes(1);
    expect(app._currentWord.id).not.toBe('previous');
    expect(segmentSetupSpy).toHaveBeenCalled();
  });

  it('blend mode also picks fresh every round (same bug surface)', async () => {
    const { app } = await import('../src/app.js');
    const { progress } = await import('../src/modules/progress.js');
    const { MODES }  = await import('../src/modes/index.js');

    let calls = 0;
    vi.spyOn(progress, 'getNextWord').mockImplementation(() => ({
      id: `b-${++calls}`, word: 'cat', graphemes: ['c','a','t'],
      types: ['c','sv','c'], emoji: '🐱', group: 'short-a', level: 1,
      phonemes: ['c','a','t'],
    }));
    vi.spyOn(MODES.blend, 'setup').mockImplementation(() => {});

    app._mode = 'blend';
    app._sessionType = 'normal';
    app._currentWord = { id: 'previous', word: 'bag', graphemes: ['b','a','g'], types: ['c','sv','c'] };
    app._showScreen    = vi.fn();

    app._startGame('short-a');
    const firstId = app._currentWord.id;
    app._startGame('short-a');
    expect(app._currentWord.id).not.toBe(firstId);
    expect(app._currentWord.id).not.toBe('previous');
  });
});
