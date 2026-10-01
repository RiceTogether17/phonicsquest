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
const { APPROXIMATE_PHONEME_AUDIO, isApproximatePhonemeAudio } =
  await import('../modules/audio.js');
const { PHONEME_MOUTH } = await import('../data/articulation.js');

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

  it('declares the schwa substitution instead of making it silently', () => {
    // There is no schwa recording. The short-u clip is still played, but it is
    // now declared so a discrimination task can decline to use it.
    expect(isApproximatePhonemeAudio('ə')).toBe(true);
    expect(APPROXIMATE_PHONEME_AUDIO['ə']).toMatch(/short-u/i);
    expect(APPROXIMATE_PHONEME_AUDIO['ə']).toMatch(/no schwa recording exists/i);
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
