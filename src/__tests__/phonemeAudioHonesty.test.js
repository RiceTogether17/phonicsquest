/*
 * Audit 2026-09-19, Finding 7 — phoneme identity and audio mapping contain
 * teaching errors.
 *
 * Three separate faults, all of which let an activity count the right number
 * of phonemes while teaching the wrong sound. That is why the existing
 * data-integrity tests did not catch any of them: they check how many phonemes
 * a word has, not which.
 *
 *   1. `nk` was split letter by letter, so bank derived as /b/ /a/ /n/ /k/.
 *      The nasal before /k/ is /ŋ/. Twenty entries carry an `nk` tile.
 *   2. One `th` token and one th.mp3 served both thin /θ/ and that /ð/, so no
 *      activity could select the right target although the curriculum names
 *      both.
 *   3. The schwa key played the short-u clip as an approximation, and
 *      consonant+le played the /l/ before the schwa.
 */

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';

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

const { WORDS, derivePhonemes, TH_VOICED_WORDS } = await import('../data/words.js');
const { APPROXIMATE_PHONEME_AUDIO, isApproximatePhonemeAudio, phonemeAudioFile } =
  await import('../modules/audio.js');
const { PHONEME_MOUTH } = await import('../data/articulation.js');
const { deriveGraphemes } = await import('../modules/deriveGraphemes.js');

const byId = (id) => WORDS.find((w) => w.id === id);

describe('phoneme identity is separate from audio asset (audit finding 7)', () => {
  it('derives /ng/ + /k/ for every word with an nk tile', () => {
    const nkWords = WORDS.filter((w) => (w.graphemes || []).includes('nk'));
    expect(nkWords.length).toBe(20);

    for (const word of nkWords) {
      const phonemes = derivePhonemes(word);
      const joined = phonemes.join(' ');
      expect(joined, `${word.word} should contain /ng/ /k/`).toContain('/ng/ /k/');
      // And must not claim the alveolar /n/ immediately before /k/.
      expect(joined, `${word.word} still derives /n/ before /k/`).not.toContain('/n/ /k/');
    }
  });

  it('keeps the phoneme count unchanged by the nk correction', () => {
    // The count was always right; only the identity was wrong. If this moved,
    // every sound-counting activity would have shifted underneath us.
    expect(derivePhonemes(byId('bank')).length).toBe(4);
    expect(derivePhonemes(byId('blink')).length).toBe(5);
    // th + i + ng + k + er
    expect(derivePhonemes(byId('thinker')).length).toBe(5);
  });

  it('splits voiced th from unvoiced th across the bank', () => {
    const thWords = WORDS.filter((w) => (w.graphemes || []).includes('th'));
    expect(thWords.length).toBe(14);

    for (const word of thWords) {
      const phonemes = derivePhonemes(word);
      const voiced = TH_VOICED_WORDS.has(word.word.toLowerCase());
      const token = voiced ? '/th_voiced/' : '/th/';
      expect(phonemes, `${word.word} should carry ${token}`).toContain(token);
    }

    // Both classes are actually represented, so the split is not vacuous.
    const voicedCount = thWords.filter((w) => TH_VOICED_WORDS.has(w.word.toLowerCase())).length;
    expect(voicedCount).toBeGreaterThan(0);
    expect(voicedCount).toBeLessThan(thWords.length);
  });

  it('does not treat voiced th as an approximation, because it is not one', () => {
    // Only one th.mp3 exists and it is the unvoiced /θ/. Rather than point
    // voiced th at it, the key is absent from the file map so it falls through
    // to TTS, which says "the" and produces a real /ð/.
    expect(isApproximatePhonemeAudio('th_voiced')).toBe(false);
  });

  it('plays the schwa from its own recording, not short u', () => {
    // It used to borrow the short-u clip and was declared approximate. It now
    // has schwa.mp3, so nothing is a stand-in any more.
    expect(isApproximatePhonemeAudio('ə')).toBe(false);
    expect(Object.keys(APPROXIMATE_PHONEME_AUDIO)).toEqual([]);
    expect(phonemeAudioFile('ə', 'c')).toBe('schwa');
  });

  it('claims no approximation for sounds that have their own recording', () => {
    for (const key of ['b', 'th', 'ng', 'k', 'sh', 'ch']) {
      expect(isApproximatePhonemeAudio(key), `${key} wrongly marked approximate`).toBe(false);
    }
  });

  it('gives voiced th the same mouth shape as unvoiced th', () => {
    // They are articulated identically and differ only in voicing, so a
    // picture cannot separate them — which is exactly why the audio must.
    expect(PHONEME_MOUTH['/th_voiced/']).toBe(PHONEME_MOUTH['/th/']);
    expect(PHONEME_MOUTH['/th_voiced/']).toBe('tongue-teeth');
  });

  it('plays a silent-letter digraph as the one sound it makes', () => {
    // "kn" used to reach TTS as the literal text "kn", which reads the
    // letters out, and "know" typed its kn as a blend, which played /k/
    // then /n/. Both teach that the k is sounded.
    expect(phonemeAudioFile('kn', 'c')).toBe('n');
    expect(phonemeAudioFile('kn', 'd')).toBe('n');
    expect(phonemeAudioFile('gn', 'c')).toBe('n');
    expect(phonemeAudioFile('wr', 'c')).toBe('r');
    expect(byId('know').types[0]).not.toBe('bl');
    expect(phonemeAudioFile(byId('know').graphemes[0], byId('know').types[0])).toBe('n');
  });

  it('keeps kn as one tile when a story word is split for the ladder', () => {
    // The colour scaffold marks the silent k as a heart letter, and the
    // splitter used to take that for a vowel: k and n came out as two tiles.
    for (const word of ['knee', 'knot', 'knock', 'know']) {
      expect(deriveGraphemes(word).graphemes[0], word).toBe('kn');
    }
  });

  it('maps every derived phoneme to a mouth shape', () => {
    // The guard that caught /th_voiced/ when it was first introduced.
    const unmapped = new Set();
    for (const word of WORDS) {
      for (const phoneme of derivePhonemes(word)) {
        if (!PHONEME_MOUTH[phoneme]) unmapped.add(phoneme);
      }
    }
    expect([...unmapped]).toEqual([]);
  });
});
