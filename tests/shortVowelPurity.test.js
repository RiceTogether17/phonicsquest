/**
 * Short-vowel set purity.
 *
 * The structural pools (cvc|ccvc|cvcc|ccvcc)-[aeiou] cross-cut every word
 * group, so a mislabeled word anywhere leaks into the sets that teach a
 * short vowel's sound. Locks in three rules:
 *
 *   1. No multisyllabic words (second syllables reduce to schwa —
 *      pocket, unplug used to leak in via a structure-detection gap).
 *   2. No irregular-vowel words (what/want say /ɒ/, bush/full/pull/bull
 *      say /ʊ/ — none of them say the short sound their letter teaches).
 *   3. Every pool word's vowel letter is the pool's vowel.
 */
import { describe, it, expect } from 'vitest';
import { WORDS, getWordStructure, getShortVowelLetter } from '../src/data/words.js';

const STRUCTURES = ['CVC', 'CCVC', 'CVCC', 'CCVCC'];
const VOWELS = ['a', 'e', 'i', 'o', 'u'];

function poolFor(structure, vowel) {
  return WORDS.filter(
    (w) =>
      getWordStructure(w) === structure &&
      getShortVowelLetter(w) === vowel &&
      !w.types.includes('sf'),
  );
}

describe('structural short-vowel pools', () => {
  it('contain only single-syllable words (one vowel grapheme)', () => {
    for (const st of STRUCTURES) {
      for (const v of VOWELS) {
        for (const w of poolFor(st, v)) {
          const vowelCount = w.types.filter((t) => ['sv', 'lv', 'rc', 'dp'].includes(t)).length;
          expect(vowelCount, `${w.word} (${st}-${v}) has ${vowelCount} vowel graphemes`).toBe(1);
        }
      }
    }
  });

  it('exclude known wrong-vowel words (schwa, /ɒ/, /ʊ/, broad-a, /ʌ/-spelled-o)', () => {
    const banned = new Set([
      'what',
      'want', // a says /ɒ/ (or schwa unstressed)
      'was', // defensive — not currently in WORDS
      'bush',
      'full',
      'pull',
      'bull', // u says /ʊ/ (short oo)
      'front', // o says /ʌ/
      'slant',
      'grasp',
      'fast',
      'last',
      'mast',
      'draft',
      'blast', // broad /ɑː/
      'pocket',
      'rocket',
      'unplug',
      'distrust', // multisyllabic leaks
      'again',
      'about', // schwa-initial sight words
    ]);
    for (const st of STRUCTURES) {
      for (const v of VOWELS) {
        const leaked = poolFor(st, v).filter((w) => banned.has(w.word));
        expect(
          leaked.map((w) => w.word),
          `${st}-${v}`,
        ).toEqual([]);
      }
    }
  });

  it('every pool word carries the pool vowel as its short-vowel letter', () => {
    for (const st of STRUCTURES) {
      for (const v of VOWELS) {
        for (const w of poolFor(st, v)) {
          const svIdx = w.types.findIndex((t) => t === 'sv');
          expect(w.graphemes[svIdx], `${w.word} in ${st}-${v}`).toBe(v);
        }
      }
    }
  });

  it('irregular-vowel words are excluded from every structural pool', () => {
    const irregular = WORDS.filter((w) => w.irregularVowel);
    expect(irregular.length).toBeGreaterThanOrEqual(6); // what, want, bush, full, pull, bull
    for (const w of irregular) {
      expect(getShortVowelLetter(w), w.word).toBeNull();
    }
  });

  it('short-oo words never appear in short-u pools (oo is not in a-e-i-o-u)', () => {
    for (const st of STRUCTURES) {
      const leaked = poolFor(st, 'u').filter((w) => w.group === 'short-oo');
      expect(leaked).toEqual([]);
    }
  });
});
