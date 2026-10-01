/*
 * Audit 2026-09-19, Finding 8 — "Sound Effects" also disables teaching audio.
 *
 * The switch is labelled Sound Effects and writes `sfxEnabled`. audio.js
 * checked that same flag in `speakWord`, articulated speech and every phoneme
 * routine, so a teacher removing reward noises also removed the spoken
 * stimulus a phonemic-awareness task needs the child to hear.
 *
 * The audit's reproduction: with `sfxEnabled=false`, `speakWord('cat')` never
 * reaches its speech path.
 */

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// AudioManager's constructor calls speechSynthesis.getVoices(); JSDOM does not
// ship speechSynthesis, so stub it before the module loads.
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

/** The instructional methods that must survive effects being switched off. */
const TEACHING_METHODS = [
  'speakWord',
  'speakText',
  'speakWordArticulated',
  'speakSentenceWord',
  'speakSightWord',
  'speakWordTwiceClear',
];

describe('teaching audio is independent of sound effects (audit finding 8)', () => {
  beforeEach(() => {
    store.reset();
    vi.restoreAllMocks();
  });

  it('still speaks the stimulus when sound effects are off', async () => {
    store.set('sfxEnabled', false);
    store.set('teachingAudioEnabled', true);

    // The audit's reproduction, inverted: this must now reach the speech path.
    const speak = vi.spyOn(audio, '_speak').mockResolvedValue(undefined);
    await audio.speakWord('cat');

    expect(speak).toHaveBeenCalled();
  });

  it('keeps every instructional method reachable with effects off', async () => {
    store.set('sfxEnabled', false);
    store.set('teachingAudioEnabled', true);

    for (const method of TEACHING_METHODS) {
      const speak = vi.spyOn(audio, '_speak').mockResolvedValue(undefined);
      await audio[method]('cat');
      expect(speak, `${method} was silenced by sfxEnabled=false`).toHaveBeenCalled();
      speak.mockRestore();
    }
  });

  it('silences celebrations when effects are off, without touching the voice', async () => {
    store.set('sfxEnabled', false);
    store.set('teachingAudioEnabled', true);

    const tone = vi.spyOn(audio, '_playTone');
    await audio.playSfx('correct');

    expect(tone).not.toHaveBeenCalled();
    expect(audio.isTeachingAudioAvailable()).toBe(true);
  });

  it('reports teaching audio unavailable only when its own switch is off', async () => {
    store.set('sfxEnabled', true);
    store.set('teachingAudioEnabled', false);

    expect(audio.isTeachingAudioAvailable()).toBe(false);

    const speak = vi.spyOn(audio, '_speak').mockResolvedValue(undefined);
    await audio.speakWord('cat');
    expect(speak).not.toHaveBeenCalled();
  });

  it('defaults both switches on', () => {
    expect(store.get('sfxEnabled')).toBe(true);
    expect(store.get('teachingAudioEnabled')).toBe(true);
    expect(audio.isTeachingAudioAvailable()).toBe(true);
  });
});
