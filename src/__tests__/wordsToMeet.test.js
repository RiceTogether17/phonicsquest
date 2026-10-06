/**
 * The words shown before a story: supportWords, less the shared heart and
 * sight words the bank first needed in an earlier band.
 */
import { describe, expect, it } from 'vitest';
import { STORIES } from '../data/stories.js';
import {
  MASCOT_NAME,
  ONOMATOPOEIA,
  isWordDecodable,
  supportWords,
} from '../modules/decodability.js';
import { sharedWordFirstBand, wordsToMeet } from '../modules/wordsToMeet.js';

const byId = (id) => STORIES.find((s) => s.id === id);
const SHARED = new Set(['hfw', 'tricky', 'sight']);

describe('wordsToMeet', () => {
  it('shows a heart word that a child would sound out wrongly', () => {
    // "was" parses as w-a-s, every letter inside a short-a story's code, and
    // a child sounding it out says "wass". It used to count as decodable.
    const nap = byId('core-a-04');
    expect(isWordDecodable('was', nap.phase)).toBe(false);
    expect(wordsToMeet(nap).map((w) => w.word)).toContain('was');
  });

  it('shows the words that belong to the story every time', () => {
    // A pre-taught word or a name is this story's own homework.
    for (const story of STORIES) {
      const meet = wordsToMeet(story);
      for (const w of supportWords(story).filter((x) => !SHARED.has(x.status))) {
        expect(meet, story.id).toContainEqual(w);
      }
    }
  });

  it('shows a shared heart or sight word only in the band that first needs it', () => {
    for (const story of STORIES) {
      for (const w of wordsToMeet(story).filter((x) => SHARED.has(x.status))) {
        expect(sharedWordFirstBand(w.word), `${story.id}: ${w.word}`).toBe(story.band);
      }
    }
    // "the" is new in Band A, and a Band D reader has met it hundreds of times.
    expect(sharedWordFirstBand('the')).toBe('A');
    expect(wordsToMeet(byId('core-d-01')).map((w) => w.word)).not.toContain('the');
  });

  it('lists the words in the order the child meets them, once each', () => {
    for (const story of STORIES) {
      const words = wordsToMeet(story).map((w) => w.word);
      expect(new Set(words).size, story.id).toBe(words.length);
    }
    const nap = wordsToMeet(byId('core-a-04')).map((w) => w.word);
    expect(nap.indexOf('was')).toBeLessThan(nap.indexOf('said'));
  });

  it('includes the words of a refrain', () => {
    // "Wiggle, wiggle, will it go? Not yet, no!" — the story text never says
    // "go", so a list built from the counted text alone missed it.
    const tooth = byId('core-b-20');
    expect(supportWords(tooth).map((w) => w.word)).toContain('go');
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
