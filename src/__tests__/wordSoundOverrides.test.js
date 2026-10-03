/**
 * @vitest-environment jsdom
 */
/*
 * A word's tiles must play the sounds the word really makes.
 *
 * Most tiles sound the way their spelling and type say, but some words break
 * the rule — the u in "bush" is /ʊ/, not the u of "bus"; the u_e in "rule" is
 * /oo/, not the "you" of "cube"; the se in "noise" is /z/. The word entry names
 * the real recording in `phonemeKeys`.
 *
 * That table used to be read by three audio paths out of roughly twenty-five.
 * Blend It, Segment It, Middle/Last Sound and the rest called speakPhoneme
 * directly and played the spelling's default, so "bush" was sounded out as
 * "b-uh-sh". The override now lives inside speakPhoneme, and these tests pin
 * that every path that names the word gets it.
 */
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

const { WORDS, derivePhonemes, phonemeKeyFor, splitBlend } = await import('../data/words.js');
const { audio } = await import('../modules/audio.js');
const { store } = await import('../modules/store.js');
const { getSyllableCount } = await import('../modules/syllables.js');

const byId = (id) => WORDS.find((w) => w.id === id);

const RECORDINGS = new Set(
  readdirSync(resolve(import.meta.dirname, '../../public/audio/phonemes')).map((f) =>
    f.replace(/\.mp3$/, ''),
  ),
);
// Keys that play without a file of their own name: the schwa is the short-u
// clip (declared in APPROXIMATE_PHONEME_AUDIO) and /aw/ has no recording yet,
// so the device voice says it.
const PLAYABLE_WITHOUT_OWN_FILE = new Set(['ə', 'aw']);

describe('per-word sound overrides (data)', () => {
  const overridden = WORDS.filter((w) => w.phonemeKeys);

  it('every override sits on a real tile and names a playable sound', () => {
    expect(overridden.length).toBeGreaterThan(20);
    for (const w of overridden) {
      for (const [i, key] of Object.entries(w.phonemeKeys)) {
        expect(w.graphemes[i], `${w.word} tile ${i}`).toBeTruthy();
        expect(w.types[i], `${w.word} tile ${i}`).not.toBe('se');
        expect(
          RECORDINGS.has(key) || PLAYABLE_WITHOUT_OWN_FILE.has(key),
          `${w.word}: no recording for "${key}"`,
        ).toBe(true);
      }
    }
  });

  it('an override changes which sound, never how many', () => {
    for (const w of overridden) {
      const plain = derivePhonemes({ ...w, id: `${w.id}__plain`, phonemeKeys: undefined });
      expect(w.phonemes.length, w.word).toBe(plain.length);
    }
  });

  it('the printed sounds agree with what is played', () => {
    expect(byId('bush').phonemes).toEqual(['/b/', '/oo/', '/sh/']);
    expect(byId('rule').phonemes).toEqual(['/r/', '/oo/', '/l/']);
    expect(byId('few').phonemes).toEqual(['/f/', '/ū/']);
    expect(byId('noise').phonemes).toEqual(['/n/', '/oi/', '/z/']);
    expect(byId('trophy').phonemes.at(-1)).toBe('/ē/');
    expect(byId('taller').phonemes[1]).toBe('/aw/');
  });

  it('a blend tile holding a digraph is two sounds, not three letters', () => {
    expect(splitBlend('shr')).toEqual(['sh', 'r']);
    expect(splitBlend('spl')).toEqual(['s', 'p', 'l']);
    expect(byId('shred').phonemes).toEqual(['/sh/', '/r/', '/e/', '/d/']);
  });

  it('looks overrides up by word, and by tile when the index is known', () => {
    expect(phonemeKeyFor('bush', 1, 'u')).toBe('short_oo');
    expect(phonemeKeyFor('Rule', undefined, 'u')).toBe('long_oo');
    expect(phonemeKeyFor('rule', 0, 'r')).toBeNull();
    // An index that names a different tile is not trusted.
    expect(phonemeKeyFor('bush', 0, 'u')).toBeNull();
    expect(phonemeKeyFor('bus', 1, 'u')).toBeNull();
  });

  it('strongest is not a soft-g word (ng + -est)', () => {
    expect(byId('strongest').flags).not.toContain('soft-g');
  });
});

describe('speakPhoneme plays the word-specific sound for every caller', () => {
  let played;
  beforeEach(() => {
    store.set('teachingAudioEnabled', true);
    played = [];
    vi.spyOn(audio, '_playPhonemeAudio').mockImplementation(async (key) => {
      played.push(key);
    });
    vi.spyOn(audio, '_delay').mockResolvedValue(undefined);
    vi.spyOn(audio, 'speakWord').mockResolvedValue(undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  it('the u in "bush" is short oo, the u in "bus" is short u', async () => {
    await audio.speakPhoneme('u', 'sv', { word: 'bush', index: 1 });
    await audio.speakPhoneme('u', 'sv', { word: 'bus', index: 1 });
    expect(played).toEqual(['short_oo', 'u']);
  });

  it('works for callers that pass the word but not the index', async () => {
    await audio.speakPhoneme('u', 'lv', { word: 'rule', prevGrapheme: 'r' });
    await audio.speakPhoneme('u', 'lv', { word: 'cube', prevGrapheme: 'c' });
    expect(played).toEqual(['long_oo', 'long_u']);
  });

  it('plays the /z/ of "noise" and the /yoo/ of "few"', async () => {
    await audio.speakPhoneme('se', 'd', { word: 'noise', index: 2 });
    await audio.speakPhoneme('ew', 'lv', { word: 'few', index: 1 });
    expect(played).toEqual(['z', 'long_u']);
  });

  it('sounds "shr" as sh then r', async () => {
    await audio.speakPhoneme('shr', 'bl', { word: 'shred', index: 0 });
    expect(played).toEqual(['sh', 'r']);
  });

  it('a sounded-out word plays its override on every tile path', async () => {
    const word = byId('bush');
    await audio.revealPhonemes(word);
    expect(played).toEqual(['b', 'short_oo', 'sh']);
  });
});

describe('syllable beats', () => {
  it.each([
    ['unsafe', 2],
    ['dislike', 2],
    ['cake', 1],
    ['lovable', 3],
    ['washable', 3],
    ['readable', 3],
    ['unable', 3],
  ])('%s has %i beats', (id, beats) => {
    expect(getSyllableCount(byId(id))).toBe(beats);
  });
});
