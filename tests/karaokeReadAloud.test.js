import { describe, it, expect } from 'vitest';
import { mapCharIndexToWord, isOffscreen } from '../src/modules/karaokeUtils.js';

describe('mapCharIndexToWord — karaoke charIndex → word index', () => {
  const TEXT = 'Puff puff puff! Ears wiggle.';
  //            0123 4567 89012345 67890 12345678
  //            ^P0  ^P1  ^P2     ^E3   ^w4

  it('returns 0 when charIndex points to the first character', () => {
    expect(mapCharIndexToWord(TEXT, 0)).toBe(0);
  });

  it('returns 0 anywhere inside the first word', () => {
    expect(mapCharIndexToWord(TEXT, 3)).toBe(0); // last char of "Puff"
  });

  it('returns 1 when charIndex falls in the second word', () => {
    expect(mapCharIndexToWord(TEXT, 5)).toBe(1);
    expect(mapCharIndexToWord(TEXT, 7)).toBe(1);
  });

  it('returns 2 inside the third word, even though punctuation is attached', () => {
    expect(mapCharIndexToWord(TEXT, 10)).toBe(2);
    expect(mapCharIndexToWord(TEXT, 14)).toBe(2); // "puff!" — punctuation still belongs to word 2
  });

  it('moves to the next word after the space that follows punctuation', () => {
    expect(mapCharIndexToWord(TEXT, 16)).toBe(3); // "Ears"
    expect(mapCharIndexToWord(TEXT, 21)).toBe(4); // "wiggle."
  });

  it('clamps gracefully when charIndex overshoots the text length', () => {
    expect(mapCharIndexToWord(TEXT, 999)).toBe(4);
  });

  it('returns -1 for empty or non-string text', () => {
    expect(mapCharIndexToWord('', 0)).toBe(-1);
    expect(mapCharIndexToWord(null, 0)).toBe(-1);
    expect(mapCharIndexToWord(undefined, 5)).toBe(-1);
  });

  it('returns -1 for invalid charIndex values', () => {
    expect(mapCharIndexToWord('Hello world', -1)).toBe(-1);
    expect(mapCharIndexToWord('Hello world', NaN)).toBe(-1);
    expect(mapCharIndexToWord('Hello world', '0')).toBe(-1);
  });

  it('handles leading whitespace without inventing a phantom word', () => {
    expect(mapCharIndexToWord('   Hello world', 3)).toBe(0); // "H" of Hello
    expect(mapCharIndexToWord('   Hello world', 9)).toBe(1); // "w" of world
  });

  it('handles multi-space gaps between words', () => {
    expect(mapCharIndexToWord('cat  hat', 0)).toBe(0);
    expect(mapCharIndexToWord('cat  hat', 5)).toBe(1); // "h" of hat
  });

  it('handles a single-word utterance', () => {
    expect(mapCharIndexToWord('hello', 0)).toBe(0);
    expect(mapCharIndexToWord('hello', 4)).toBe(0);
  });
});

describe('isOffscreen — auto-scroll predicate', () => {
  const VIEWPORT = 800;

  it('returns false when the element is comfortably in view', () => {
    expect(isOffscreen({ top: 300, bottom: 360 }, VIEWPORT)).toBe(false);
  });

  it('returns true when the element has scrolled above the top margin', () => {
    expect(isOffscreen({ top: 10, bottom: 30 }, VIEWPORT)).toBe(true);
  });

  it('returns true when the element has scrolled below the bottom margin', () => {
    expect(isOffscreen({ top: 780, bottom: 820 }, VIEWPORT)).toBe(true);
  });

  it('returns false on the boundary case (within 80px buffer)', () => {
    expect(isOffscreen({ top: 100, bottom: 140 }, VIEWPORT)).toBe(false);
    expect(isOffscreen({ top: 700, bottom: 740 }, VIEWPORT)).toBe(false);
  });

  it('returns false defensively for invalid input', () => {
    expect(isOffscreen(null, VIEWPORT)).toBe(false);
    expect(isOffscreen({ top: 100, bottom: 140 }, 0)).toBe(false);
    expect(isOffscreen({ top: 'a', bottom: 140 }, VIEWPORT)).toBe(false);
  });
});
