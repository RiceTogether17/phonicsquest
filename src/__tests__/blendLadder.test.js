import { describe, it, expect } from 'vitest';
import { blendSteps, soundedIndex } from '../modules/blendLadder.js';
import { graphemeSounds } from '../modules/phonemeColors.js';

/** Build the ladder the way the panel does, from bank-shaped data. */
const ladder = (word, graphemes, types) =>
  blendSteps(graphemes, graphemeSounds(word, graphemes, types));

describe('the cumulative blend', () => {
  it('adds one sound at a time to the sounds already held', () => {
    // This is the whole point: the child holds "ma" and adds /p/, rather
    // than hearing three separate sounds and being told the answer.
    expect(ladder('map', ['m', 'a', 'p'], ['c', 'sv', 'c'])).toEqual(['m', 'ma', 'map']);
  });

  it('keeps a digraph together as one step', () => {
    expect(ladder('ship', ['sh', 'i', 'p'], ['c', 'sv', 'c'])).toEqual(['sh', 'shi', 'ship']);
  });

  it('gives a silent letter no step of its own', () => {
    // There is no sound to add for the magic e — but the word has to finish
    // as "cake", not "cak", or the ladder teaches the wrong spelling.
    const steps = ladder('cake', ['c', 'a', 'k', 'e'], ['c', 'lv', 'c', 'se']);
    expect(steps).toEqual(['c', 'ca', 'cake']);
    expect(steps.at(-1)).toBe('cake');
  });

  it('carries a silent letter in the middle into the next step', () => {
    const steps = blendSteps(
      ['w', 'r', 'i', 't', 'e'],
      ['silent', 'consonant', 'long', 'consonant', 'silent'],
    );
    expect(steps).toEqual(['wr', 'wri', 'write']);
  });

  it('every step is a prefix of the one after it', () => {
    const steps = ladder('stamp', ['s', 't', 'a', 'm', 'p'], ['c', 'c', 'sv', 'c', 'c']);
    for (let i = 1; i < steps.length; i++) {
      expect(steps[i].startsWith(steps[i - 1])).toBe(true);
    }
  });

  it('the last step is always the whole word', () => {
    const cases = [
      ['map', ['m', 'a', 'p'], ['c', 'sv', 'c']],
      ['cake', ['c', 'a', 'k', 'e'], ['c', 'lv', 'c', 'se']],
      ['ship', ['sh', 'i', 'p'], ['c', 'sv', 'c']],
      ['start', ['st', 'ar', 't'], ['c', 'rc', 'c']],
    ];
    for (const [word, g, t] of cases) {
      expect(ladder(word, g, t).at(-1)).toBe(word);
    }
  });

  it('keeps the affix hyphen on the tile, out of the spelling', () => {
    // "-ed" on a tile says "this joins onto a word". In the ladder it would
    // spell the word wrong: "stayed" must not end at "stay-ed".
    const steps = blendSteps(['s', 't', 'ay', '-ed'], ['consonant', 'consonant', 'long', 'affix']);
    expect(steps).toEqual(['s', 'st', 'stay', 'stayed']);
    expect(steps.at(-1)).toBe('stayed');
  });

  it('handles a word with no sounded letters, and an empty word', () => {
    expect(blendSteps([], [])).toEqual([]);
    // Nothing to blend: no steps, and nothing thrown.
    expect(blendSteps(['e'], ['silent'])).toEqual([]);
  });
});

describe('soundedIndex', () => {
  it('skips silent letters when finding the nth sound', () => {
    const sounds = ['silent', 'consonant', 'long', 'silent'];
    expect(soundedIndex(sounds, 0)).toBe(1);
    expect(soundedIndex(sounds, 1)).toBe(2);
    expect(soundedIndex(sounds, 2)).toBe(-1);
  });

  it('lines up with the steps, so each tap plays the sound it added', () => {
    const graphemes = ['c', 'a', 'k', 'e'];
    const sounds = graphemeSounds('cake', graphemes, ['c', 'lv', 'c', 'se']);
    const steps = blendSteps(graphemes, sounds);
    for (let n = 0; n < steps.length; n++) {
      const i = soundedIndex(sounds, n);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(sounds[i]).not.toBe('silent');
      // The grapheme played is the one the new step just added.
      expect(steps[n]).toContain(graphemes[i]);
    }
  });
});
