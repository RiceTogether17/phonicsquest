/**
 * The two /oo/ recordings: long_oo.mp3 (/uː/ moon) and short_oo.mp3
 * (/ʊ/ book). Pins which file each grapheme+type reaches for, and the
 * per-word phonemeKeys override that lets bush/full/pull/bull play /ʊ/
 * for their 'u' tile.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('short/long oo phoneme audio', () => {
  beforeEach(() => {
    vi.resetModules();
    stubAudioGlobals();
  });

  async function setup() {
    const { audio } = await import('../src/modules/audio.js');
    const { store } = await import('../src/modules/store.js');
    store.reset();
    store.set('sfxEnabled', true);
    const loadSpy = vi.spyOn(audio, '_loadBuffer').mockRejectedValue(new Error('no file in test'));
    const speakSpy = vi.spyOn(audio, '_speak').mockResolvedValue();
    return { audio, loadSpy, speakSpy };
  }

  it('long-vowel oo (moon) reaches for long_oo.mp3', async () => {
    const { audio, loadSpy } = await setup();
    await audio.speakPhoneme('oo', 'lv');
    expect(loadSpy.mock.calls.some(([p]) => /long_oo\.mp3$/.test(p))).toBe(true);
  });

  it('short-vowel oo (book) reaches for short_oo.mp3, never long_oo or long_u', async () => {
    const { audio, loadSpy } = await setup();
    await audio.speakPhoneme('oo', 'sv');
    expect(loadSpy.mock.calls.some(([p]) => /short_oo\.mp3$/.test(p))).toBe(true);
    expect(loadSpy.mock.calls.some(([p]) => /long_oo\.mp3$|long_u\.mp3$/.test(p))).toBe(false);
  });

  it('ue and ew vowel teams reach for long_oo.mp3 (not /juː/ long_u)', async () => {
    const { audio, loadSpy } = await setup();
    await audio.speakPhoneme('ue', 'lv');
    await audio.speakPhoneme('ew', 'lv');
    expect(loadSpy.mock.calls.filter(([p]) => /long_oo\.mp3$/.test(p)).length).toBe(2);
    expect(loadSpy.mock.calls.some(([p]) => /long_u\.mp3$/.test(p))).toBe(false);
  });

  it('falls back to the /oo/ TTS when the files are unavailable', async () => {
    const { audio, speakSpy } = await setup();
    await audio.speakPhoneme('oo', 'sv');
    expect(speakSpy.mock.calls.at(-1)?.[0]).toBe('oo');
  });

  it('bush plays short_oo.mp3 for its u tile during stretched playback', async () => {
    const { audio, loadSpy } = await setup();
    const { WORDS } = await import('../src/data/words.js');
    const bush = WORDS.find(w => w.id === 'bush');
    expect(bush.phonemeKeys).toEqual({ 1: 'short_oo' });
    await audio.speakWordStretched(bush);
    expect(loadSpy.mock.calls.some(([p]) => /short_oo\.mp3$/.test(p))).toBe(true);
    // The plain short-u file must NOT be reached for the vowel tile.
    expect(loadSpy.mock.calls.some(([p]) => /\/u\.mp3$/.test(p))).toBe(false);
  });

  it('revealPhonemes honours the override too', async () => {
    const { audio, loadSpy } = await setup();
    const { WORDS } = await import('../src/data/words.js');
    const full = WORDS.find(w => w.id === 'full');
    await audio.revealPhonemes(full);
    expect(loadSpy.mock.calls.some(([p]) => /short_oo\.mp3$/.test(p))).toBe(true);
  });

  it('the short-oo word set exists with 8 decodable oo words', async () => {
    const { WORDS, WORD_GROUPS, GROUP_ORDER } = await import('../src/data/words.js');
    const set = WORDS.filter(w => w.group === 'short-oo');
    expect(set.length).toBeGreaterThanOrEqual(8);
    for (const w of set) {
      const i = w.graphemes.indexOf('oo');
      expect(i, w.word).toBeGreaterThanOrEqual(0);
      expect(w.types[i], w.word).toBe('sv');
    }
    expect(WORD_GROUPS['short-oo']).toBeTruthy();
    expect(GROUP_ORDER).toContain('short-oo');
  });
});
