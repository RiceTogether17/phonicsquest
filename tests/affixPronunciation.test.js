import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Tests for affix / suffix pronunciation in the audio module.
 *
 * Verifies that consonant+le endings, schwa-reduced suffixes, and
 * TTS-overridden affixes play the correct phoneme sequences instead
 * of letting the browser TTS guess (which produces letter names or
 * wrong vowels).
 */

function installAudioMocks() {
  // Minimal speechSynthesis stub
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: vi.fn((utt) => { utt.onend?.(); }),
    cancel: () => {},
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(text) { this.text = text; this.rate = 1; this.pitch = 1; this.volume = 1; }
  };
  // Minimal AudioContext stub
  globalThis.AudioContext = globalThis.AudioContext || class {
    constructor() { this.state = 'running'; this.currentTime = 0; }
    createBufferSource() {
      return {
        connect: vi.fn(), start: vi.fn(), stop: vi.fn(),
        buffer: null, onended: null,
      };
    }
    createGain() {
      return {
        connect: vi.fn(),
        gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      };
    }
    createOscillator() {
      return {
        connect: vi.fn(), start: vi.fn(), stop: vi.fn(),
        type: 'sine', frequency: { value: 0 },
      };
    }
    get destination() { return {}; }
    resume() { return Promise.resolve(); }
    decodeAudioData() { return Promise.reject(new Error('no real audio')); }
  };
}

describe('affix pronunciation', () => {
  let audio;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    installAudioMocks();
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);
    const mod = await import('../src/modules/audio.js');
    audio = mod.audio;
    // Spy on internal methods to track what gets called
    vi.spyOn(audio, '_playPhonemeAudio').mockResolvedValue();
    vi.spyOn(audio, '_speak').mockResolvedValue();
    vi.spyOn(audio, '_delay').mockResolvedValue();
  });

  // ── Consonant + le endings ──────────────────────────────────────────

  it('plays -ble as phoneme sequence [b, l, ə] not raw TTS', async () => {
    await audio.speakPhoneme('ble', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(3);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'b');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'l');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(3, 'ə');
    expect(audio._speak).not.toHaveBeenCalled();
  });

  it('plays -ble with hyphen prefix the same way', async () => {
    await audio.speakPhoneme('-ble', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(3);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'b');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'l');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(3, 'ə');
  });

  it('plays -dle as [d, l, ə]', async () => {
    await audio.speakPhoneme('dle', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(3);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'd');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'l');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(3, 'ə');
  });

  it('plays -ple as [p, l, ə]', async () => {
    await audio.speakPhoneme('ple', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(3);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'p');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'l');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(3, 'ə');
  });

  it('plays -tle as [t, l, ə]', async () => {
    await audio.speakPhoneme('tle', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(3);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 't');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'l');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(3, 'ə');
  });

  it('plays -cle as [c, l, ə] (c → /k/ sound)', async () => {
    await audio.speakPhoneme('cle', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(3);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'c');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'l');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(3, 'ə');
  });

  it('plays -fle as [f, l, ə]', async () => {
    await audio.speakPhoneme('fle', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(3);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'f');
  });

  it('plays -gle as [g, l, ə]', async () => {
    await audio.speakPhoneme('gle', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'g');
  });

  it('plays -kle as [k, l, ə]', async () => {
    await audio.speakPhoneme('kle', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'k');
  });

  it('plays -zle as [z, l, ə]', async () => {
    await audio.speakPhoneme('zle', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'z');
  });

  // ── Bare -le suffix ────────────────────────────────────────────────

  it('plays bare -le as [l, ə]', async () => {
    await audio.speakPhoneme('le', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(2);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'l');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'ə');
    expect(audio._speak).not.toHaveBeenCalled();
  });

  // ── Schwa-reduced endings ──────────────────────────────────────────

  it('plays -al as [ə, l]', async () => {
    await audio.speakPhoneme('al', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(2);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'ə');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'l');
  });

  it('plays -el as [ə, l]', async () => {
    await audio.speakPhoneme('el', 'sf');
    expect(audio._playPhonemeAudio).toHaveBeenCalledTimes(2);
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(1, 'ə');
    expect(audio._playPhonemeAudio).toHaveBeenNthCalledWith(2, 'l');
  });

  // ── TTS overrides ─────────────────────────────────────────────────

  it('speaks -tion as "shun" via TTS override', async () => {
    await audio.speakPhoneme('tion', 'sf');
    expect(audio._speak).toHaveBeenCalledWith('shun', 0.9);
    expect(audio._playPhonemeAudio).not.toHaveBeenCalled();
  });

  it('speaks -sion as "zhun" via TTS override', async () => {
    await audio.speakPhoneme('sion', 'sf');
    expect(audio._speak).toHaveBeenCalledWith('zhun', 0.9);
  });

  // ── Existing suffix behavior preserved ─────────────────────────────

  it('still speaks -ing via TTS fallback', async () => {
    await audio.speakPhoneme('-ing', 'sf');
    expect(audio._speak).toHaveBeenCalledWith('ing', 0.9);
    expect(audio._playPhonemeAudio).not.toHaveBeenCalled();
  });

  it('still speaks -er via TTS fallback', async () => {
    await audio.speakPhoneme('-er', 'sf');
    expect(audio._speak).toHaveBeenCalledWith('er', 0.9);
  });

  it('still speaks -est via TTS fallback', async () => {
    await audio.speakPhoneme('-est', 'sf');
    expect(audio._speak).toHaveBeenCalledWith('est', 0.9);
  });

  it('still handles -ed after voiceless consonant as /t/', async () => {
    await audio.speakPhoneme('-ed', 'sf', { prevGrapheme: 'mp' });
    expect(audio._playPhonemeAudio).toHaveBeenCalledWith('t');
  });

  it('still handles -ed after t/d as /ɪd/', async () => {
    await audio.speakPhoneme('-ed', 'sf', { prevGrapheme: 'nd' });
    expect(audio._speak).toHaveBeenCalledWith('id', 0.9);
  });

  it('still handles -ed after voiced consonant as /d/', async () => {
    await audio.speakPhoneme('-ed', 'sf', { prevGrapheme: 'ng' });
    expect(audio._playPhonemeAudio).toHaveBeenCalledWith('d');
  });

  // ── Phoneme delay between sequence items ───────────────────────────

  it('inserts delay between phonemes in affix sequence', async () => {
    await audio.speakPhoneme('ble', 'sf');
    // 3 phonemes → 2 delays (between 1st-2nd and 2nd-3rd)
    expect(audio._delay).toHaveBeenCalledTimes(2);
    expect(audio._delay).toHaveBeenCalledWith(80);
  });
});
