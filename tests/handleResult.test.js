import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

const WORD = {
  id: 'cat',
  word: 'cat',
  graphemes: ['c', 'a', 't'],
  types: ['c', 'sv', 'c'],
  phonemes: ['c', 'a', 't'],
  emoji: '🐱',
  group: 'short-a',
  level: 1,
};

async function makeApp(mode) {
  const { app } = await import('../src/app.js');
  const { progress } = await import('../src/modules/progress.js');

  const recordSpy = vi.spyOn(progress, 'recordAttempt').mockImplementation(() => {});
  vi.spyOn(progress, 'isNewWord').mockReturnValue(false);
  vi.spyOn(app, '_showResultScreen').mockImplementation(() => {});
  vi.spyOn(app, '_adjustModeDifficulty').mockImplementation(() => {});
  vi.spyOn(app, '_showToast').mockImplementation(() => {});

  // init() is never called here, so wire the element cache the way the app
  // does — the confirmation round needs a real #mode-area to render into.
  app._cacheElements();

  app._mode = mode;
  app._currentWord = { ...WORD };
  app._wrongStrikes = 0;
  app._hintUsed = false;
  app._adultVerdict = null;
  app._resultProcessing = false;

  return { app, recordSpy };
}

/**
 * Answer the blend-confirmation round that a self-assessed "Yes" now opens.
 * @param {boolean} pickCorrect  tap the target word, or a distractor
 */
function answerConfirm(pickCorrect) {
  const cards = [...document.querySelectorAll('.blend-confirm__card')];
  const btn = cards.find((b) => (b.dataset.correct === 'true') === pickCorrect);
  btn?.click();
  // The round pauses briefly on the reveal before committing.
  vi.advanceTimersByTime(2000);
  return cards.length;
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
    // 'first' is objectively scored and no hint was used → independent.
    expect(recordSpy).toHaveBeenCalledWith('cat', false, 'first', 1200, 'independent');
    expect(app._showResultScreen).toHaveBeenCalledWith(false, expect.anything(), null);
    // No retry-nudge toast for a final result.
    expect(app._showToast).not.toHaveBeenCalledWith(expect.stringContaining('Almost'), 'warning');
  });

  it('records a correct answer exactly once', async () => {
    const { app, recordSpy } = await makeApp('hear');

    app._handleResult(true, 900);

    expect(recordSpy).toHaveBeenCalledTimes(1);
    // 'hear' speaks the target before the child picks, so it is capped at
    // guided however cleanly the answer comes.
    expect(recordSpy).toHaveBeenCalledWith('cat', true, 'hear', 900, 'guided');
    expect(app._showResultScreen).toHaveBeenCalledWith(true, expect.anything(), expect.anything());
  });

  it('guards against synchronous double-submission', async () => {
    const { app, recordSpy } = await makeApp('missing');

    // Simulate a double click where the first call is still processing.
    const origShowResult = app._showResultScreen;
    app._showResultScreen.mockImplementation(() => {
      app._handleResult(false, 1000); // re-entrant call must be ignored
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

    app._handleResult(false, 3000); // nudge
    app._handleResult(false, 5000); // final

    expect(recordSpy).toHaveBeenCalledTimes(1);
    // 'blend' models the word aloud, so it can never exceed exposure.
    expect(recordSpy).toHaveBeenCalledWith('cat', false, 'blend', 5000, 'exposure');
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
    vi.useFakeTimers();
    const { app, recordSpy } = await makeApp('blend');
    const { store } = await import('../src/modules/store.js');
    store.set('sessionFirstTryToday', 0);

    // A self-assessed "Yes" opens the confirmation round; the credit lands
    // when the child names the word, not when they claim to have read it.
    app._handleResult(true, 1500);
    expect(recordSpy).not.toHaveBeenCalled();
    answerConfirm(true);
    expect(store.get('sessionFirstTryToday')).toBe(1);
    expect(recordSpy).toHaveBeenCalledTimes(1);

    // Reset for a new word; this time miss first (nudge), then succeed.
    app._currentWord = { ...WORD, id: 'dog' };
    app._wrongStrikes = 0;
    app._resultProcessing = false;
    app._handleResult(false, 1000); // nudge, nothing recorded
    app._handleResult(true, 4000); // success on second try
    answerConfirm(true);
    expect(store.get('sessionFirstTryToday')).toBe(1); // unchanged
    vi.useRealTimers();
  });
});

describe('blend confirmation — a self-report is not evidence on its own', () => {
  beforeEach(() => {
    vi.resetModules();
    stubGlobals();
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('a self-assessed "Yes" records nothing until the child names the word', async () => {
    const { app, recordSpy } = await makeApp('blend');

    app._handleResult(true, 1500);

    // The claim alone banks nothing.
    expect(recordSpy).not.toHaveBeenCalled();
    expect(app._showResultScreen).not.toHaveBeenCalled();
    expect(document.querySelectorAll('.blend-confirm__card').length).toBe(3);
  });

  it('records the confirmation as independent evidence when the child is right', async () => {
    const { app, recordSpy } = await makeApp('blend');

    app._handleResult(true, 1500);
    answerConfirm(true);

    expect(recordSpy).toHaveBeenCalledTimes(1);
    const [wordId, correct, mode, , evidence] = recordSpy.mock.calls[0];
    expect(wordId).toBe('cat');
    expect(correct).toBe(true);
    expect(mode).toBe('blend');
    // Not 'exposure' — the confirmation had no model and no audio, so this
    // is the one thing a self-assessed mode can prove.
    expect(evidence).toBe('independent');
  });

  it('records a wrong confirmation as a miss, however confident the child was', async () => {
    const { app, recordSpy } = await makeApp('blend');

    app._handleResult(true, 1500);
    answerConfirm(false);

    expect(recordSpy).toHaveBeenCalledTimes(1);
    const [, correct, , , evidence] = recordSpy.mock.calls[0];
    expect(correct).toBe(false);
    expect(evidence).toBe('independent');
  });

  it('does not interrupt "final" modes, which already assess objectively', async () => {
    const { app, recordSpy } = await makeApp('first');

    app._handleResult(true, 1200);

    expect(document.querySelectorAll('.blend-confirm__card').length).toBe(0);
    expect(recordSpy).toHaveBeenCalledTimes(1);
  });

  it('survives a late repaint of the mode area', async () => {
    // Blend It! repaints #mode-area asynchronously. A double-tap on
    // "Blend it!" leaves a repaint in flight, and when it landed on top of
    // the confirmation round it wiped the question away — leaving the word
    // soft-locked with _resultProcessing stuck true and nothing to tap.
    const { app, recordSpy } = await makeApp('blend');

    app._handleResult(true, 1500);
    expect(document.querySelectorAll('.blend-confirm__card').length).toBe(3);

    // Simulate the stray repaint.
    app._els.modeArea.innerHTML = '<div class="blend-assess-prompt">Did you blend it right?</div>';

    expect(document.querySelectorAll('.blend-confirm__card').length).toBe(3);
    answerConfirm(true);
    expect(recordSpy).toHaveBeenCalledTimes(1);
    // The mode area is handed back once the round is done.
    expect(app._els.modeArea.dataset.blendConfirmHidden).toBeUndefined();
    expect(document.getElementById('blend-confirm-host')).toBeNull();
  });

  it('hides the graphemes and the picture so the child cannot letter-match', async () => {
    const { app } = await makeApp('blend');

    app._handleResult(true, 1500);
    // The blend leaves c-a-t and the picture on screen. Leaving them up
    // turns "which word did you read?" into a matching exercise.
    //
    // Asserted on the marker attribute rather than inline display or the
    // `hidden` property. `[data-blend-confirm-hidden] { display: none
    // !important }` in main.css does the hiding, because it has to beat both
    // `.word-display { display: flex }` and the inline `style.display = ''`
    // that Blend It!'s async repaint writes to the Say It button.
    // "Say It" speaks the target outright and "Hint" plays its first sound —
    // either one hands over the answer.
    for (const el of [
      app._els.phonemeRow,
      app._els.wordDisplay,
      app._els.wordEmoji,
      app._els.btnSayIt,
      app._els.btnHint,
    ]) {
      expect(el.dataset.blendConfirmHidden).toBe('1');
    }

    answerConfirm(true);

    // …and everything comes back for the next word.
    for (const el of [
      app._els.phonemeRow,
      app._els.wordDisplay,
      app._els.wordEmoji,
      app._els.btnSayIt,
      app._els.btnHint,
    ]) {
      expect(el.dataset.blendConfirmHidden).toBeUndefined();
    }
  });

  it('falls back to recording the self-report when no round can be built', async () => {
    const { app, recordSpy } = await makeApp('blend');
    // No mode area to render into — the round must be skipped, and skipping
    // must not invent a wrong answer.
    app._els.modeArea = null;

    app._handleResult(true, 1500);

    expect(recordSpy).toHaveBeenCalledTimes(1);
    const [, correct, , , evidence] = recordSpy.mock.calls[0];
    expect(correct).toBe(true);
    expect(evidence).toBe('exposure');
  });
});
