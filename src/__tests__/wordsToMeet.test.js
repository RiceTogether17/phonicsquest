/**
 * The words shown before a story: supportWords plus the heart words its
 * spelling check lets through, in the band where they are new.
 */
import { describe, expect, it } from 'vitest';
import { STORIES } from '../data/stories.js';
import { getSightWordCode } from '../data/sightWordCode.js';
import {
  MASCOT_NAME,
  ONOMATOPOEIA,
  isWordDecodable,
  supportWords,
} from '../modules/decodability.js';
import { heartWordFirstBand, wordsToMeet } from '../modules/wordsToMeet.js';

const byId = (id) => STORIES.find((s) => s.id === id);

describe('wordsToMeet', () => {
  it('shows a heart word the spelling check would let a child sound out wrongly', () => {
    // "was" parses as w-a-s, inside a short-a story's code, so supportWords
    // never listed it — and a child sounding it out says "wass".
    const nap = byId('core-a-04');
    expect(isWordDecodable('was', nap.phase)).toBe(true);
    expect(supportWords(nap).map((w) => w.word)).not.toContain('was');
    expect(wordsToMeet(nap)).toContainEqual({ word: 'was', display: 'was', status: 'heart' });
  });

  it('keeps every word supportWords lists, with its status', () => {
    for (const story of STORIES) {
      const meet = wordsToMeet(story);
      for (const w of supportWords(story)) expect(meet, story.id).toContainEqual(w);
    }
  });

  it('adds only heart words, and only in the band that first uses them', () => {
    for (const story of STORIES) {
      for (const w of wordsToMeet(story).filter((x) => x.status === 'heart')) {
        expect(getSightWordCode(w.word)?.category, `${story.id}: ${w.word}`).toBe('heart');
        expect(heartWordFirstBand(w.word), `${story.id}: ${w.word}`).toBe(story.band);
      }
    }
  });

  it('lists the words in the order the child meets them, once each', () => {
    for (const story of STORIES) {
      const words = wordsToMeet(story).map((w) => w.word);
      expect(new Set(words).size, story.id).toBe(words.length);
    }
    const nap = wordsToMeet(byId('core-a-04')).map((w) => w.word);
    expect(nap.indexOf('was')).toBeLessThan(nap.indexOf('said'));
  });

  it('still fits in one sitting', () => {
    for (const story of STORIES) {
      expect(wordsToMeet(story).length, story.id).toBeLessThanOrEqual(12);
    }
  });

  it('prints I as a capital and leaves out the mascot and sound effects', () => {
    for (const story of STORIES) {
      for (const w of wordsToMeet(story)) {
        expect(w.display, story.id).toBe(w.word === 'i' ? 'I' : w.word);
        expect(w.word, story.id).not.toBe(MASCOT_NAME);
        expect(ONOMATOPOEIA.has(w.word), `${story.id}: ${w.word}`).toBe(false);
      }
    }
  });
});
