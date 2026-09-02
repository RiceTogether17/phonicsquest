import { describe, it, expect } from 'vitest';
import { SYLLABLE_WORDS, pickSyllableWord } from '../data/syllableWords.js';
import { getSyllableCount, getSyllableBreakdown } from '../modules/syllables.js';

describe('SYLLABLE_WORDS pool', () => {
  it('every entry has the minimal phonological shape', () => {
    for (const w of SYLLABLE_WORDS) {
      expect(typeof w.id).toBe('string');
      expect(typeof w.word).toBe('string');
      expect(typeof w.emoji).toBe('string');
      expect(w.emoji.length).toBeGreaterThan(0);
      expect(w.syllables).toBeGreaterThanOrEqual(1);
      expect(w.syllables).toBeLessThanOrEqual(4);
      expect(w.syllableBreakdown).toContain(w.syllables > 1 ? '-' : w.word);
    }
  });

  it('ids are unique', () => {
    const ids = SYLLABLE_WORDS.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('breakdown hyphen-part count matches the syllable count', () => {
    for (const w of SYLLABLE_WORDS) {
      const parts = w.syllableBreakdown.split('-');
      expect(parts.length).toBe(w.syllables);
    }
  });

  it('spans the full 1–4 syllable range', () => {
    const counts = new Set(SYLLABLE_WORDS.map((w) => w.syllables));
    expect(counts).toEqual(new Set([1, 2, 3, 4]));
  });

  it('getSyllableCount / getSyllableBreakdown resolve from the explicit override', () => {
    const donkey = SYLLABLE_WORDS.find((w) => w.id === 'syl-donkey');
    expect(getSyllableCount(donkey)).toBe(2);
    expect(getSyllableBreakdown(donkey)).toBe('don-key');
    const cat = SYLLABLE_WORDS.find((w) => w.id === 'syl-cat');
    expect(getSyllableCount(cat)).toBe(1);
  });
});

describe('pickSyllableWord', () => {
  it('returns a valid pool word', () => {
    const w = pickSyllableWord([]);
    expect(SYLLABLE_WORDS).toContain(w);
  });

  it('avoids recently-seen ids when fresh words remain', () => {
    // Mark all but one word as recent — the one fresh word must be returned.
    const recent = SYLLABLE_WORDS.slice(1).map((w) => w.id);
    const w = pickSyllableWord(recent);
    expect(w.id).toBe(SYLLABLE_WORDS[0].id);
  });

  it('falls back to the full pool when everything is recent', () => {
    const recent = SYLLABLE_WORDS.map((w) => w.id);
    const w = pickSyllableWord(recent);
    expect(SYLLABLE_WORDS).toContain(w);
  });
});
