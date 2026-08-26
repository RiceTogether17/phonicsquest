import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Pins the speech path for Count the Words.
 *
 * The mode plays a sentence one word at a time, so the child hears four to
 * seven separate utterances a round instead of one. Every default that is
 * merely suboptimal for a single word — the short onset guard that clips the
 * opening consonant, conversational rate, the playful raised pitch — becomes
 * a listening problem when it repeats on every token, and it lands hardest on
 * exactly the short function words the child has to notice in order to count
 * them. These tests keep the mode on the clear path.
 */

function stubAudioGlobals() {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: (utt) => {
      queueMicrotask(() => utt.onend?.());
    },
    cancel: vi.fn(),
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(t) {
      this.text = t;
    }
  };
}

async function loadAudio({ voiceSpeed = 0.8, sfxEnabled = true } = {}) {
  const { audio } = await import('../src/modules/audio.js');
  const { store } = await import('../src/modules/store.js');
  store.reset();
  store.set('sfxEnabled', sfxEnabled);
  store.set('voiceSpeed', voiceSpeed);
  return { audio, store };
}

describe('audio.speakSentenceWord', () => {
  beforeEach(() => {
    vi.resetModules();
    stubAudioGlobals();
  });

  it('speaks slower than the conversational default', async () => {
    const { audio } = await loadAudio({ voiceSpeed: 0.8 });
    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();

    await audio.speakSentenceWord('the');

    expect(speakSpy).toHaveBeenCalledTimes(1);
    expect(speakSpy.mock.calls[0][0]).toBe('the');
    expect(speakSpy.mock.calls[0][1]).toBeLessThanOrEqual(0.7);
  });

  it('keeps pitch neutral and lengthens the onset guard so the first consonant survives', async () => {
    const { audio } = await loadAudio();
    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();

    await audio.speakSentenceWord('can');

    const opts = speakSpy.mock.calls[0][2];
    expect(opts.pitch).toBe(1.0);
    expect(opts.preDelayMs).toBeGreaterThanOrEqual(150);
  });

  it('respects an even-slower user setting as the ceiling', async () => {
    const { audio } = await loadAudio({ voiceSpeed: 0.45 });
    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();

    await audio.speakSentenceWord('word');

    expect(speakSpy.mock.calls[0][1]).toBeLessThanOrEqual(0.45);
  });

  it('routes a sight word through its pronunciation override', async () => {
    const { audio } = await loadAudio();
    const phonemeSpy = vi.spyOn(audio, '_playPhonemeAudio').mockResolvedValue();
    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();

    // Standing alone is exactly where TTS reaches for the letter name
    // /eɪ/ instead of the schwa the article actually has.
    await audio.speakSentenceWord('a');

    expect(phonemeSpy).toHaveBeenCalledWith('u');
    expect(speakSpy).not.toHaveBeenCalled();
  });

  it('stays silent when sound effects are off', async () => {
    const { audio } = await loadAudio({ sfxEnabled: false });
    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();

    await audio.speakSentenceWord('word');

    expect(speakSpy).not.toHaveBeenCalled();
  });
});

describe('audio.cancelSpeech', () => {
  beforeEach(() => {
    vi.resetModules();
    stubAudioGlobals();
  });

  it('stops an utterance already handed to the engine', async () => {
    const { audio } = await loadAudio();
    audio.cancelSpeech();
    expect(globalThis.speechSynthesis.cancel).toHaveBeenCalled();
  });
});

describe('Count the Words playback', () => {
  let mode, audio, els;

  const WORD = {
    id: 'c1',
    word: 'cat',
    graphemes: ['c', 'a', 't'],
    types: ['c', 'sv', 'c'],
    emoji: '🐱',
  };

  function makeEls() {
    const mk = () => {
      const el = document.createElement('div');
      document.body.appendChild(el);
      return el;
    };
    return {
      wordEmoji: mk(),
      wordDisplay: mk(),
      phonemeRow: mk(),
      modeInstruction: mk(),
      modeArea: mk(),
      btnCheck: mk(),
      btnSayIt: mk(),
      btnSkip: mk(),
      onResult: vi.fn(),
    };
  }

  beforeEach(async () => {
    vi.resetModules();
    stubAudioGlobals();
    document.body.innerHTML = '';
    ({ audio } = await loadAudio());
    mode = await import('../src/modes/wordCountMode.js');
    els = makeEls();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('speaks each word on the clear single-token path, not the conversational one', async () => {
    const clearSpy = vi.spyOn(audio, 'speakSentenceWord').mockResolvedValue();
    const plainSpy = vi.spyOn(audio, 'speakWord').mockResolvedValue();

    mode.setupWordCount(WORD, els);
    await vi.advanceTimersByTimeAsync(400);

    expect(clearSpy).toHaveBeenCalled();
    expect(plainSpy).not.toHaveBeenCalled();
  });

  it('leaves a countable beat between words', async () => {
    const spokenAt = [];
    vi.spyOn(audio, 'speakSentenceWord').mockImplementation(() => {
      spokenAt.push(Date.now());
      return Promise.resolve();
    });

    mode.setupWordCount(WORD, els);
    await vi.advanceTimersByTimeAsync(400);
    expect(spokenAt).toHaveLength(1);

    // Nothing more until a full beat has passed.
    await vi.advanceTimersByTimeAsync(300);
    expect(spokenAt).toHaveLength(1);

    await vi.advanceTimersByTimeAsync(200);
    expect(spokenAt).toHaveLength(2);
  });

  it('shows a playing cue while speaking and clears it when the sentence ends', async () => {
    vi.spyOn(audio, 'speakSentenceWord').mockResolvedValue();

    mode.setupWordCount(WORD, els);
    const replay = els.modeArea.querySelector('.wc-replay');
    expect(replay.classList.contains('is-speaking')).toBe(false);

    await vi.advanceTimersByTimeAsync(400);
    expect(replay.classList.contains('is-speaking')).toBe(true);

    // Longest template is 7 words; run well past the end of any of them.
    await vi.advanceTimersByTimeAsync(10_000);
    expect(replay.classList.contains('is-speaking')).toBe(false);
    expect(replay.textContent).toContain('Hear the sentence again');
  });

  it('never prints the sentence before the reveal', async () => {
    vi.spyOn(audio, 'speakSentenceWord').mockResolvedValue();

    mode.setupWordCount(WORD, els);
    await vi.advanceTimersByTimeAsync(10_000);

    expect(els.modeArea.querySelectorAll('.wc-chip')).toHaveLength(0);
  });

  it('silences a word still in flight when the mode is torn down', async () => {
    const cancelSpy = vi.spyOn(audio, 'cancelSpeech');
    vi.spyOn(audio, 'speakSentenceWord').mockResolvedValue();

    mode.setupWordCount(WORD, els);
    await vi.advanceTimersByTimeAsync(400);
    mode.cleanup();

    expect(cancelSpy).toHaveBeenCalled();
  });
});
