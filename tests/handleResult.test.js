import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * _handleResult — record-exactly-once contract.
 *
 * Regression tests for the double-record bug: commit-on-tap modes
 * (resultPolicy 'final') deliver a single final result via their own
 * Next button. The old app-level two-strike branch bounced the first
 * wrong result back (dead Next click) and recorded the SAME wrong
 * answer twice on the second click, corrupting wordStats / SRS /
 * adaptive difficulty. Self-assess modes (blend / classicBlend) keep
 * the gentle nudge, but nothing is recorded until the final outcome.
 */

function stubGlobals() {
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
    constructor() { this.state = 'running'; this.sampleRate = 44100; }
    createOscillator() { return { connect: vi.fn(), start: vi.fn(), stop: vi.fn(), frequency: { value: 0 } }; }
    createGain() { return { connect: vi.fn(), gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn() } }; }
    createBuffer(_c, frames) { return { getChannelData: () => new Float32Array(frames) }; }
    createBufferSource() { return { connect: vi.fn(), start: vi.fn(), stop: vi.fn(), buffer: null }; }
    createBiquadFilter() { return { connect: vi.fn(), type: '', frequency: { value: 0 }, Q: { value: 0 } }; }
    get destination() { return {}; }
    resume() { return Promise.resolve(); }
  };
}

const WORD = {
  id: 'cat', word: 'cat', graphemes: ['c', 'a', 't'],
  types: ['c', 'sv', 'c'], phonemes: ['c', 'a', 't'],
  emoji: '🐱', group: 'short-a', level: 1,
};

async function makeApp(mode) {
  const { app } = await import('../src/app.js');
  const { progress } = await import('../src/modules/progress.js');

  const recordSpy = vi.spyOn(progress, 'recordAttempt').mockImplementation(() => {});
  vi.spyOn(progress, 'isNewWord').mockReturnValue(false);
  vi.spyOn(app, '_showResultScreen').mockImplementation(() => {});
  vi.spyOn(app, '_adjustModeDifficulty').mockImplementation(() => {});
  vi.spyOn(app, '_setGameMascot').mockImplementation(() => {});
  vi.spyOn(app, '_showToast').mockImplementation(() => {});

  app._mode = mode;
  app._currentWord = { ...WORD };
  app._wrongStrikes = 0;
  app._hintUsed = false;
  app._resultProcessing = false;

  return { app, recordSpy };
}

describe('_handleResult — commit-on-tap ("final") modes', () => {
  beforeEach(() => {
    vi.resetModules();
    stubGlobals();
  });

  it('records a wrong answer exactly once and advances immediately', async () => {
    const { app, recordSpy } = await makeApp('first');

    app._handleResult(false, 1200);

    expect(recordSpy).toHaveBeenCalledTimes(1);
    expect(recordSpy).toHaveBeenCalledWith('cat', false, 'first', 1200);
    expect(app._showResultScreen).toHaveBeenCalledWith(false, expect.anything(), null);
    // No retry-nudge toast for a final result.
    expect(app._showToast).not.toHaveBeenCalledWith(expect.stringContaining('Almost'), 'warning');
  });

  it('records a correct answer exactly once', async () => {
    const { app, recordSpy } = await makeApp('hear');

    app._handleResult(true, 900);

    expect(recordSpy).toHaveBeenCalledTimes(1);
    expect(recordSpy).toHaveBeenCalledWith('cat', true, 'hear', 900);
    expect(app._showResultScreen).toHaveBeenCalledWith(true, expect.anything(), expect.anything());
  });

  it('guards against synchronous double-submission', async () => {
    const { app, recordSpy } = await makeApp('missing');

    // Simulate a double click where the first call is still processing.
    const origShowResult = app._showResultScreen;
    app._showResultScreen.mockImplementation(() => {
      app._handleResult(false, 1000);  // re-entrant call must be ignored
    });
    app._handleResult(false, 1000);
    app._showResultScreen = origShowResult;

    expect(recordSpy).toHaveBeenCalledTimes(1);
  });
});

describe('_handleResult — self-assess modes keep the gentle nudge', () => {
  beforeEach(() => {
    vi.resetModules();
    stubGlobals();
  });

  it('first "Not yet" nudges without recording or advancing', async () => {
    const { app, recordSpy } = await makeApp('blend');

    app._handleResult(false, 3000);

    expect(recordSpy).not.toHaveBeenCalled();
    expect(app._showResultScreen).not.toHaveBeenCalled();
    expect(app._wrongStrikes).toBe(1);
    expect(app._showToast).toHaveBeenCalledWith(expect.stringContaining('Almost'), 'warning');
    // Not left in a stuck processing state — the child can answer again.
    expect(app._resultProcessing).toBe(false);
  });

  it('second "Not yet" records once and advances', async () => {
    const { app, recordSpy } = await makeApp('blend');

    app._handleResult(false, 3000);  // nudge
    app._handleResult(false, 5000);  // final

    expect(recordSpy).toHaveBeenCalledTimes(1);
    expect(recordSpy).toHaveBeenCalledWith('cat', false, 'blend', 5000);
    expect(app._showResultScreen).toHaveBeenCalledTimes(1);
  });

  it('a wrong answer after using the hint skips the nudge and records once', async () => {
    const { app, recordSpy } = await makeApp('classicBlend');
    app._hintUsed = true;

    app._handleResult(false, 2000);

    expect(recordSpy).toHaveBeenCalledTimes(1);
    expect(app._showResultScreen).toHaveBeenCalledTimes(1);
  });

  it('sessionFirstTryToday increments only on a clean first-try success', async () => {
    const { app, recordSpy } = await makeApp('blend');
    const { store } = await import('../src/modules/store.js');
    store.set('sessionFirstTryToday', 0);

    app._handleResult(true, 1500);
    expect(store.get('sessionFirstTryToday')).toBe(1);
    expect(recordSpy).toHaveBeenCalledTimes(1);

    // Reset for a new word; this time miss first (nudge), then succeed.
    app._currentWord = { ...WORD, id: 'dog' };
    app._wrongStrikes = 0;
    app._handleResult(false, 1000);  // nudge, nothing recorded
    app._handleResult(true, 4000);   // success on second try
    expect(store.get('sessionFirstTryToday')).toBe(1);  // unchanged
  });
});
