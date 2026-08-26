import { describe, it, expect } from 'vitest';
import { WORDS, derivePhonemes } from '../data/words.js';

const wordById = (id) => WORDS.find(w => w.id === id);

describe('derivePhonemes()', () => {
  describe('regular CVC', () => {
    it('counts each grapheme as one phoneme', () => {
      // Notation is the SOUND, so the "c" of cat reads /k/ — the letter name
      // is not one of English's phonemes.
      expect(derivePhonemes(wordById('cat'))).toEqual(['/k/', '/a/', '/t/']);
      expect(derivePhonemes(wordById('hat'))).toEqual(['/h/', '/a/', '/t/']);
    });
  });

  describe('digraphs', () => {
    it('treats sh/ch/th/ck/ng as a single phoneme', () => {
      expect(derivePhonemes(wordById('ship'))).toEqual(['/sh/', '/i/', '/p/']);
      expect(derivePhonemes(wordById('chin'))).toEqual(['/ch/', '/i/', '/n/']);
      expect(derivePhonemes(wordById('that'))).toEqual(['/th/', '/a/', '/t/']);
    });
  });

  describe('silent-e words', () => {
    it('drops the silent e from the phoneme count', () => {
      expect(derivePhonemes(wordById('cake'))).toEqual(['/k/', '/a/', '/k/']);
      expect(derivePhonemes(wordById('kite'))).toEqual(['/k/', '/i/', '/t/']);
      expect(derivePhonemes(wordById('tune'))).toEqual(['/t/', '/u/', '/n/']);
    });

    it('makes the phoneme count one less than the grapheme count', () => {
      const cake = wordById('cake');
      expect(cake.graphemes.length).toBe(4);
      expect(cake.phonemes.length).toBe(3);
    });
  });

  describe("'x' as a single grapheme = two phonemes (/k/+/s/)", () => {
    it.each(['tax', 'wax', 'hex', 'vex', 'six', 'fox', 'box'])('%s', (id) => {
      const w = wordById(id);
      expect(w.graphemes.length).toBe(3);
      expect(w.phonemes.length).toBe(4);
      expect(w.phonemes.slice(-2)).toEqual(['/k/', '/s/']);
    });
  });

  describe('blends split into one phoneme per letter', () => {
    it('two-letter blends', () => {
      expect(derivePhonemes(wordById('flat'))).toEqual(['/f/', '/l/', '/a/', '/t/']);
      expect(derivePhonemes(wordById('step'))).toEqual(['/s/', '/t/', '/e/', '/p/']);
    });

    it('final blends', () => {
      expect(derivePhonemes(wordById('best'))).toEqual(['/b/', '/e/', '/s/', '/t/']);
      expect(derivePhonemes(wordById('lamp'))).toEqual(['/l/', '/a/', '/m/', '/p/']);
    });

    it('three-letter blends', () => {
      expect(derivePhonemes(wordById('split'))).toEqual(['/s/', '/p/', '/l/', '/i/', '/t/']);
      expect(derivePhonemes(wordById('stream'))).toEqual(['/s/', '/t/', '/r/', '/ea/', '/m/']);
    });
  });

  describe('silent letters via PHONEME_OVERRIDES', () => {
    it("'know' is two phonemes, not three", () => {
      const know = wordById('know');
      expect(know.graphemes).toEqual(['kn', 'ow']);
      expect(know.phonemes.length).toBe(2);
    });
  });

  describe("-ed suffix follows the /ɪd/ vs /t|d/ rule", () => {
    it("after /t/ or /d/, '-ed' contributes 2 phonemes", () => {
      expect(wordById('landed').phonemes.length).toBe(6);
      expect(wordById('rested').phonemes.length).toBe(6);
      expect(wordById('melted').phonemes.length).toBe(6);
    });

    it("after other consonants, '-ed' contributes 1 phoneme", () => {
      expect(wordById('jumped').phonemes.length).toBe(5);
      expect(wordById('camped').phonemes.length).toBe(5);
      expect(wordById('fished').phonemes.length).toBe(4);
    });
  });

  describe('every word has phonemes attached at module load', () => {
    it('phonemes is a non-empty array on every WORD', () => {
      for (const w of WORDS) {
        expect(Array.isArray(w.phonemes), `${w.id} missing phonemes[]`).toBe(true);
        expect(w.phonemes.length, `${w.id} has zero phonemes`).toBeGreaterThan(0);
      }
    });
  });

  describe('regression guard for the soundCount mode', () => {
    // soundCount used to read graphemes.length — these are the word classes
    // where that produced wrong sound counts. Locking them in here prevents
    // a regression if the mode ever falls back to graphemes again.
    it.each([
      ['cake', 3], ['kite', 3], ['tune', 3],   // silent-e
      ['tax', 4], ['wax', 4], ['fox', 4],      // x = /k/+/s/
      ['flat', 4], ['split', 5],               // blends
      ['ship', 3], ['chin', 3],                // digraphs (already correct)
      ['know', 2],                             // silent k
    ])('%s → %i phonemes', (id, count) => {
      expect(wordById(id).phonemes.length).toBe(count);
    });
  });
});
