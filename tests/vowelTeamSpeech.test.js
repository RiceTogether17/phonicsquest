import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Pins the pronunciation of long-U vowel teams during sound-by-sound
 * playback (Blend It! reveal, "Blend it with Giri" lesson demo, stretched
 * hints).
 *
 * The only long-vowel MP3 shipped for /uː/ is long_u.mp3, which actually
 * says /juː/ ("you") — correct for the u_e split digraph (cube, cute) but
 * WRONG for the ue/ew vowel teams, which say /uː/ ("oo"): blue, true, glue,
 * flew, grew, chew. Those graphemes must fall through to the /oo/ TTS so the
 * blending demonstration says the right sound. Regression guard for the bug
 * where blue blended as "b-l-you".
 */

function stubAudioGlobals() {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: (utt) => { queueMicrotask(() => utt.onend?.()); },
    cancel: () => {},
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
}

describe('long-U vowel-team pronunciation (speakPhoneme)', () => {
  beforeEach(() => {
    vi.resetModules();
    stubAudioGlobals();
  });

  async function setup() {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);
    // No file ever caches, so every key takes its file-or-TTS branch.
    const loadSpy = vi.spyOn(audio, '_loadBuffer').mockRejectedValue(new Error('no file in test'));
    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();
    return { audio, loadSpy, speakSpy };
  }

  it('plays the /oo/ sound for the ue vowel team (blue), not /juː/ from long_u.mp3', async () => {
    const { audio, loadSpy, speakSpy } = await setup();
    await audio.speakPhoneme('ue', 'lv');
    // Never reaches for the long_u MP3…
    const triedLongU = loadSpy.mock.calls.some(([p]) => /long_u\.mp3$/.test(p));
    expect(triedLongU).toBe(false);
    // …falls through to the /oo/ TTS instead.
    expect(speakSpy.mock.calls.at(-1)?.[0]).toBe('oo');
  });

  it('plays the /oo/ sound for the ew vowel team (flew/grew)', async () => {
    const { audio, loadSpy, speakSpy } = await setup();
    await audio.speakPhoneme('ew', 'lv');
    const triedLongU = loadSpy.mock.calls.some(([p]) => /long_u\.mp3$/.test(p));
    expect(triedLongU).toBe(false);
    expect(speakSpy.mock.calls.at(-1)?.[0]).toBe('oo');
  });

  it('plays the /oo/ sound for the oo team (moon)', async () => {
    const { audio, speakSpy } = await setup();
    await audio.speakPhoneme('oo', 'lv');
    expect(speakSpy.mock.calls.at(-1)?.[0]).toBe('oo');
  });

  it('still uses long_u.mp3 (/juː/) for the u_e split digraph vowel (cube)', async () => {
    const { audio, loadSpy } = await setup();
    await audio.speakPhoneme('u', 'lv');
    const triedLongU = loadSpy.mock.calls.some(([p]) => /long_u\.mp3$/.test(p));
    expect(triedLongU).toBe(true);
  });
});
