import { beforeEach, describe, expect, it, vi } from 'vitest';

function installMockSpeechRecognition(transcriptsByLocale = {}) {
  class MockSpeechRecognition {
    constructor() {
      this.lang = 'en-SG';
      this.onresult = null;
      this.onerror = null;
      this.onend = null;
    }

    start() {
      queueMicrotask(() => {
        const alternatives = (transcriptsByLocale[this.lang] || [{ transcript: '', confidence: 0.1 }]).map(item => ({
          transcript: item.transcript,
          confidence: item.confidence ?? 0.8,
        }));
        this.onresult?.({ results: [alternatives] });
      });
    }

    stop() {
      this.onend?.();
    }
  }

  window.SpeechRecognition = MockSpeechRecognition;
  window.webkitSpeechRecognition = MockSpeechRecognition;
}

describe('speech recognition enhancements', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="speech-bubble"></div>';
    vi.restoreAllMocks();
  });

  it('uses speechThreshold to decide correctness while preserving exact-match override', async () => {
    vi.resetModules();
    const { store } = await import('../src/modules/store.js');
    store.reset();

    installMockSpeechRecognition({ 'en-SG': [{ transcript: 'cot', confidence: 0.9 }] });
    const { speech } = await import('../src/modules/speech.js');

    store.set('speechThreshold', 0.99);
    const strictResult = await speech.listen('cat');
    expect(strictResult).toBeTruthy();
    expect(strictResult.correct).toBe(false);

    store.set('speechThreshold', 0.6);
    const lenientResult = await speech.listen('cat');
    expect(lenientResult).toBeTruthy();
    expect(lenientResult.correct).toBe(true);
    expect(lenientResult.score).toBe(Math.round(lenientResult.rawScore * 100));

    installMockSpeechRecognition({ 'en-SG': [{ transcript: 'cat', confidence: 0.7 }] });
    const exactResult = await speech.listen('cat');
    expect(exactResult.correct).toBe(true);
  });

  it('builds locale fallback order with required accent variants', async () => {
    vi.resetModules();
    const { buildSpeechLocales } = await import('../src/modules/speech.js');

    expect(buildSpeechLocales('en-AU')).toEqual(['en-AU', 'en-SG', 'en-GB', 'en-IN', 'en-US']);
    expect(buildSpeechLocales('en-SG')).toEqual(['en-SG', 'en-GB', 'en-AU', 'en-IN', 'en-US']);
  });

  it('calibration helper returns threshold in expected range', async () => {
    vi.resetModules();
    const { calculateCalibrationThreshold } = await import('../src/modules/speech.js');

    expect(calculateCalibrationThreshold(0.8)).toBeCloseTo(0.72, 2);
    expect(calculateCalibrationThreshold(2)).toBe(0.95);
    expect(calculateCalibrationThreshold(-1)).toBe(0.5);
  });

  it('manual override marks word correct and awards XP', async () => {
    vi.resetModules();
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('xp', 0);

    globalThis.speechSynthesis = {
      getVoices: () => [],
      addEventListener: () => {},
      speak: () => {},
      cancel: () => {},
    };

    const { app } = await import('../src/app.js');

    app._mode = 'blend';
    app._currentWord = { id: 'manual-word-1', word: 'cat' };
    app._els = { speechBubble: document.getElementById('speech-bubble') };
    app._cleanupMode = vi.fn();
    app._nextWord = vi.fn();
    app._showToast = vi.fn();

    app._applyManualSpeechOverride('manual-word-1');

    const stats = store.get('wordStats');
    expect(stats['manual-word-1']).toBeTruthy();
    expect(stats['manual-word-1'].attempts).toBe(1);
    expect(stats['manual-word-1'].correct).toBe(1);
    expect(store.get('xp')).toBeGreaterThan(0);
    expect(app._cleanupMode).toHaveBeenCalled();
    expect(app._nextWord).toHaveBeenCalled();
  }, 15000);

  it('phonetic similarity blends levenshtein and metaphone for accent variants', async () => {
    vi.resetModules();
    const { speech } = await import('../src/modules/speech.js');

    const colourVsColor = speech._phoneticSimilarity('colour', 'color');
    const colourVsTable = speech._phoneticSimilarity('colour', 'table');

    expect(colourVsColor).toBeGreaterThan(0.7);
    expect(colourVsColor).toBeGreaterThan(colourVsTable);
  });
});
