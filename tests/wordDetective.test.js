import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/modules/store.js';
import {
  lookupWord,
  addWordToReview,
  normaliseWordText,
  __resetIndex,
} from '../src/modules/wordDetective.js';

beforeEach(() => {
  store.reset();
  localStorage.clear();
  __resetIndex();
});

describe('normaliseWordText — strip punctuation, lowercase, trim', () => {
  it('lowercases and trims', () => {
    expect(normaliseWordText('  Cat  ')).toBe('cat');
  });

  it('strips surrounding punctuation but keeps internal letters', () => {
    expect(normaliseWordText('"Hello!"')).toBe('hello');
    expect(normaliseWordText('(world)')).toBe('world');
    expect(normaliseWordText('puff!')).toBe('puff');
  });

  it('returns "" for non-string or empty input', () => {
    expect(normaliseWordText(null)).toBe('');
    expect(normaliseWordText(undefined)).toBe('');
    expect(normaliseWordText('')).toBe('');
    expect(normaliseWordText('!!!')).toBe('');
  });
});

describe('lookupWord — bank lookup + graceful fallback', () => {
  it('finds a known phonics word and returns its rich graphemes/types', () => {
    const info = lookupWord('cat');
    expect(info.foundInBank).toBe(true);
    expect(info.word?.id).toBe('cat');
    expect(info.graphemes).toEqual(['c', 'a', 't']);
    expect(info.types).toEqual(['c', 'sv', 'c']);
    expect(info.alreadyTracked).toBe(false);
  });

  it('matches a story word with trailing punctuation', () => {
    const info = lookupWord('cat!');
    expect(info.foundInBank).toBe(true);
    expect(info.word?.id).toBe('cat');
  });

  it('matches case-insensitively (story sentence-case → bank lowercase)', () => {
    const info = lookupWord('Cat');
    expect(info.foundInBank).toBe(true);
    expect(info.word?.id).toBe('cat');
  });

  it('falls back to letter-by-letter split for words not in the bank', () => {
    const info = lookupWord('Xyzzy');
    expect(info.foundInBank).toBe(false);
    expect(info.word).toBeNull();
    expect(info.graphemes).toEqual(['x', 'y', 'z', 'z', 'y']);
    expect(info.types).toEqual([]);
    expect(info.alreadyTracked).toBe(false);
  });

  it('returns an empty result for words made of pure punctuation', () => {
    const info = lookupWord('!!!');
    expect(info.foundInBank).toBe(false);
    expect(info.graphemes).toEqual([]);
  });

  it('flags alreadyTracked when the word has prior attempts', () => {
    store.recordWordAttempt('cat', true);
    const info = lookupWord('cat');
    expect(info.alreadyTracked).toBe(true);
  });
});

describe('addWordToReview — bank-only, routes through the Review Lane', () => {
  it('seeds a bank word into the Review Lane via store.recordWordAttempt', () => {
    expect(addWordToReview('cat')).toBe(true);
    const stats = store.get('wordStats') || {};
    expect(stats.cat).toBeDefined();
    expect(stats.cat.attempts).toBe(1);
    // Adding a word to review is a request to practise it, not evidence the
    // child can read it — so it enters at box 0 and is due immediately
    // rather than being pushed a day out by a fake "correct".
    expect(stats.cat.box).toBe(0);
    expect(stats.cat.byEvidence.exposure.attempts).toBe(1);
    expect(stats.cat.byEvidence.independent.attempts).toBe(0);
    expect(typeof stats.cat.dueAt).toBe('number');
    expect(stats.cat.dueAt).toBeLessThanOrEqual(Date.now());
  });

  it('refuses to add a non-bank word — no pollution of wordStats', () => {
    expect(addWordToReview('xyzzy')).toBe(false);
    const stats = store.get('wordStats') || {};
    expect(stats.xyzzy).toBeUndefined();
  });

  it('refuses invalid input', () => {
    expect(addWordToReview(null)).toBe(false);
    expect(addWordToReview('')).toBe(false);
    expect(addWordToReview(42)).toBe(false);
  });

  it('is idempotent (a second add just advances the box)', () => {
    addWordToReview('cat');
    const firstBox = store.get('wordStats').cat.box;
    addWordToReview('cat');
    const secondBox = store.get('wordStats').cat.box;
    expect(secondBox).toBeGreaterThanOrEqual(firstBox);
    expect(store.get('wordStats').cat.attempts).toBe(2);
  });
});
