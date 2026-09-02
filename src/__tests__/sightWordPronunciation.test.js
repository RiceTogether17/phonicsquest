/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// AudioManager's constructor calls speechSynthesis.getVoices().  JSDOM
// doesn't ship speechSynthesis, so stub it before the module loads.
globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener: () => {},
  cancel: () => {},
  speak: () => {},
};
globalThis.SpeechSynthesisUtterance = class {
  constructor(t) {
    this.text = t;
  }
};

const { audio } = await import('../modules/audio.js');
const { store } = await import('../modules/store.js');

/**
 * Regression tests for sight-word pronunciation.
 *
 * Browser TTS engines pronounce single-letter strings like "a" with the
 * LETTER NAME ("ay" /eɪ/) rather than the unstressed schwa /ə/ ("uh") that
 * the article actually has when it appears in real reading.  Sight word
 * cards must say the schwa, not the alphabet letter.
 *
 * We stub out the low-level _speak and _playPhonemeAudio so the assertions
 * exercise routing only — no actual speech is produced inside vitest.
 */
describe('audio.speakSightWord', () => {
  let phonemeCalls;
  let ttsCalls;

  beforeEach(() => {
    store.set('sfxEnabled', true);
    phonemeCalls = [];
    ttsCalls = [];
    audio._playPhonemeAudio = vi.fn(async (key) => {
      phonemeCalls.push(key);
    });
    audio._speak = vi.fn(async (text) => {
      ttsCalls.push(text);
    });
  });

  it('plays the schwa phoneme (mapped to short-u MP3) when asked to speak "a"', async () => {
    await audio.speakSightWord('a');
    expect(phonemeCalls, 'expected schwa-phoneme path').toEqual(['u']);
    expect(ttsCalls, 'should NOT fall back to TTS for "a"').toEqual([]);
  });

  it('also honours the override for an uppercase "A"', async () => {
    await audio.speakSightWord('A');
    expect(phonemeCalls).toEqual(['u']);
  });

  it('falls back to TTS speakWord for ordinary sight words like "the"', async () => {
    await audio.speakSightWord('the');
    expect(phonemeCalls).toEqual([]);
    expect(ttsCalls).toEqual(['the']);
  });

  it('falls back to TTS speakWord for the pronoun "I" — its letter-name reading is correct', async () => {
    await audio.speakSightWord('I');
    expect(phonemeCalls).toEqual([]);
    expect(ttsCalls).toEqual(['I']);
  });

  it('does nothing when sfx is disabled', async () => {
    store.set('sfxEnabled', false);
    await audio.speakSightWord('a');
    await audio.speakSightWord('the');
    expect(phonemeCalls).toEqual([]);
    expect(ttsCalls).toEqual([]);
    store.set('sfxEnabled', true);
  });
});
