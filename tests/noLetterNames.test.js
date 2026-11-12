/**
 * Sounds must play as recorded sounds, never as letter names.
 *
 * Reported from use: some multi-syllable words, and an option in a long-vowel
 * listening game, said the letter NAME instead of the sound. The app has
 * recordings for its 48 sounds; anything else is handed to the device voice,
 * which reads a string it does not know letter by letter ("et" → "E T").
 *
 * Each test below closes one way a sound reached the voice:
 *   - a word tile with no recording ("sci", "et", "eir", "-est");
 *   - a choice button taken out of its word (the u of "rule" says /oo/, but
 *     out of the word it played "you"), or a wrong option from a tricky word;
 *   - a building-up step in Blend It that is not a real word ("magn", "br");
 *   - lesson lines read aloud ("c… a… t" read as "see, ay, tee").
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

globalThis.speechSynthesis ??= {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
};
globalThis.SpeechSynthesisUtterance ??= class {
  constructor(t) {
    this.text = t;
  }
};

const { WORDS } = await import('../src/data/words.js');
const { audio, tileSoundKeys, phonemeKeyFile } = await import('../src/modules/audio.js');
const { hasRecordedSound } = await import('../src/modes/phonemePosition.js');
const { getFirstSoundDistractors } = await import('../src/modes/firstSound.js');
const { getLastSoundDistractors } = await import('../src/modes/lastSound.js');
const { getMiddleSoundDistractors } = await import('../src/modes/middleSound.js');
const { PHONICS_LESSONS } = await import('../src/data/lessons/phonicsLessons.js');
const { narrationParts } = await import('../src/modules/lessonNarration.js');
const { __TEST__: derive } = await import('../src/modules/deriveGraphemes.js');

const RECORDINGS = new Set(
  readdirSync(resolve(import.meta.dirname, '../public/audio/phonemes')).map((f) =>
    f.replace(/\.mp3$/, ''),
  ),
);
// Voiced th has no recording on purpose: the voice says "the", a real /ð/.
const VOICE_ALLOWED = new Set(['the']);

describe('every word tile plays a recording', () => {
  it('in its own word, no tile in the bank goes to the voice', () => {
    const bad = [];
    for (const w of WORDS) {
      w.graphemes.forEach((g, i) => {
        const keys = tileSoundKeys(g, w.types[i], {
          word: w.word,
          index: i,
          prevGrapheme: i > 0 ? w.graphemes[i - 1] : null,
        });
        if (!keys) bad.push(`${w.word}: "${g}" (${w.types[i]})`);
        else if (
          keys.some((k) => k !== 'th_voiced' && !RECORDINGS.has(phonemeKeyFile(k)) && k !== 'ə')
        )
          bad.push(`${w.word}: "${g}" → ${keys.join('+')}`);
      });
    }
    expect(bad).toEqual([]);
  });

  it('the multi-syllable words are split into one-sound tiles', () => {
    const byId = (id) => WORDS.find((w) => w.id === id);
    expect(byId('market').graphemes).toEqual(['m', 'ar', 'k', 'e', 't']);
    expect(byId('science').graphemes).toEqual(['sc', 'i', 'e', 'n', 'ce']);
    expect(byId('energy').graphemes).toEqual(['e', 'n', 'er', 'g', 'y']);
  });

  it('every word ending the story helper can split off plays recordings', () => {
    for (const suffix of derive.SUFFIXES) {
      expect(
        tileSoundKeys(suffix, 'sf', { word: `jump${suffix.slice(1)}` }),
        suffix,
      ).not.toBeNull();
    }
    expect(tileSoundKeys('qu', 'c')).toEqual(['qu']);
    expect(phonemeKeyFile('qu')).toBe('q');
  });
});

describe('choice buttons in First, Middle and Last Sound', () => {
  const RUNS = 4;

  it('never offer a wrong option that has no recording or comes from a tricky word', () => {
    const bad = new Set();
    const check = (word, list) =>
      list.forEach((d) => {
        if (!hasRecordedSound(d.grapheme, d.type)) bad.add(`${word.word}: ${d.grapheme}|${d.type}`);
      });
    for (const word of WORDS) {
      for (let r = 0; r < RUNS; r++) {
        check(word, getFirstSoundDistractors(word.graphemes[0], word.types[0], word.level));
        check(
          word,
          getLastSoundDistractors(word.graphemes.at(-1), 'last', word.level, word.types.at(-1)),
        );
        const v = word.types.findIndex((t) => ['sv', 'lv', 'rc', 'dp'].includes(t));
        if (v >= 0)
          check(word, getMiddleSoundDistractors(word.graphemes[v], word.level, word.types[v]));
      }
    }
    expect([...bad]).toEqual([]);
  });

  it('the answer for "rule" is /oo/, and /oo/ is not also offered as wrong', () => {
    for (let r = 0; r < 10; r++) {
      const wrong = getMiddleSoundDistractors('u', 2, 'lv', 'long_oo');
      expect(wrong.map((d) => `${d.grapheme}|${d.type}`)).not.toContain('oo|lv');
      expect(wrong.map((d) => `${d.grapheme}|${d.type}`)).not.toContain('ue|lv');
      expect(wrong.map((d) => `${d.grapheme}|${d.type}`)).not.toContain('ew|lv');
    }
  });
});

describe('Blend It building-up steps', () => {
  let spoken;
  beforeEach(() => {
    spoken = [];
    vi.spyOn(audio, '_speak').mockImplementation(async (t) => {
      spoken.push(t);
    });
    vi.spyOn(audio, '_playPhonemeAudio').mockResolvedValue();
    vi.spyOn(audio, '_delay').mockResolvedValue();
  });
  afterEach(() => vi.restoreAllMocks());

  it('only ever hand the voice a real word', async () => {
    const words = new Set(WORDS.map((w) => w.word.toLowerCase()));
    for (const w of WORDS) {
      for (let end = 2; end < w.graphemes.length; end++) {
        await audio.speakChunk(w, end);
      }
    }
    const notWords = [...new Set(spoken)].filter((t) => !words.has(t) && !VOICE_ALLOWED.has(t));
    expect(notWords).toEqual([]);
  });
});

describe('lesson "Read it to me"', () => {
  it('plays every sounding-out run and /sound/ as recordings', () => {
    const bad = [];
    for (const [id, lesson] of Object.entries(PHONICS_LESSONS)) {
      for (const line of lesson.script) {
        for (const part of narrationParts(line, lesson)) {
          if (typeof part !== 'string') {
            part.sounds.forEach((k) => {
              if (!RECORDINGS.has(phonemeKeyFile(k)) && k !== 'ə') bad.push(`${id}: ${k}`);
            });
            continue;
          }
          if (/[A-Za-zāēīōū]\s*…/.test(part) || /\/[^/\s]+\//.test(part))
            bad.push(`${id}: "${part}"`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('reads "c… a… t — cat" as three sounds, then the word', () => {
    const parts = narrationParts('Glue them together: c… a… t — cat!', PHONICS_LESSONS['cvc-a']);
    expect(parts).toEqual([
      'Glue them together:',
      { sounds: ['c'] },
      { sounds: ['a'] },
      { sounds: ['t'] },
      'cat',
    ]);
  });

  it('takes a long vowel from the word: "c… ā… k — cake"', () => {
    const parts = narrationParts('c… ā… k — cake!', PHONICS_LESSONS['long-a-ae']);
    expect(parts.filter((p) => typeof p !== 'string')).toEqual([
      { sounds: ['c'] },
      { sounds: ['long_a'] },
      { sounds: ['k'] },
    ]);
  });

  it('keeps letter names where the line is naming letters: "a + r says /ar/"', () => {
    const parts = narrationParts('a + r says /ar/ like a pirate.', PHONICS_LESSONS['rc-ar-or']);
    expect(parts[0]).toBe('a + r says');
    expect(parts[1]).toEqual({ sounds: ['ar'] });
  });
});
