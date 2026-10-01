import { describe, it, expect } from 'vitest';
import { STORIES } from '../data/stories.js';
import { classifyWord, cleanToken } from '../modules/decodability.js';
import { clueForQuestion } from '../modules/storyClue.js';

/**
 * The comprehension questions, held to the same promise as the stories.
 *
 * Band A and 19 of the Band B stories used to carry a single open-ended
 * prompt and nothing checkable — so the youngest readers, who are most of
 * them, finished a story and were asked one question they could answer with
 * a shrug. They all have questions now.
 *
 * The gates below are what make authored content trustworthy. The first one
 * caught 37 words in my own first draft, including options borrowed from
 * the wrong story ("goat" and "oats" offered in a story that teaches long-e,
 * where a child cannot read either).
 */

const all = STORIES.flatMap((story) => (story.comprehension ?? []).map((q) => ({ story, q })));

describe('every story has something checkable', () => {
  it('leaves no story with only an open-ended prompt', () => {
    const without = STORIES.filter((s) => !s.comprehension?.length).map((s) => s.id);
    expect(without).toEqual([]);
  });

  it('asks fewer questions of the youngest readers', () => {
    // A Band A story is 40-odd words. Three four-option questions after it
    // is a test, not a check.
    for (const s of STORIES) {
      const n = s.comprehension.length;
      if (s.band === 'A') expect(n, s.id).toBeLessThanOrEqual(2);
      expect(n, s.id).toBeGreaterThanOrEqual(2);
      expect(n, s.id).toBeLessThanOrEqual(4);
    }
  });

  it('keeps the options short enough to hold in mind', () => {
    // Four options is a lot of reading for a child who has just read 40
    // words. Band A is held to three; the rest to four, which is what the
    // existing Band C and D quests use.
    for (const { story, q } of all) {
      const max = story.band === 'A' ? 3 : 4;
      expect(q.options.length, `${story.id}: "${q.q}"`).toBeLessThanOrEqual(max);
      expect(q.options.length, `${story.id}: "${q.q}"`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('a child can read every word of every option', () => {
  it('offers no option the story has not taught them to decode', () => {
    // The bank's core promise is that every word in a story is readable by
    // some taught route. An answer a child cannot read breaks that promise
    // at the exact moment they are being asked to think.
    const bad = [];
    for (const { story, q } of all) {
      for (const option of q.options) {
        for (const raw of option.split(/\s+/)) {
          const clean = cleanToken(raw);
          if (!clean) continue;
          if (classifyWord(clean, story).status === 'stretch') {
            bad.push(`${story.id} (${story.phase}) "${option}" → ${clean}`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
  });
});

describe('the questions are well formed', () => {
  it('never repeats an option inside one question', () => {
    for (const { story, q } of all) {
      expect(new Set(q.options).size, `${story.id}: "${q.q}"`).toBe(q.options.length);
    }
  });

  it('points at a real option', () => {
    for (const { story, q } of all) {
      expect(Number.isInteger(q.answer), `${story.id}: "${q.q}"`).toBe(true);
      expect(q.answer, `${story.id}: "${q.q}"`).toBeGreaterThanOrEqual(0);
      expect(q.answer, `${story.id}: "${q.q}"`).toBeLessThan(q.options.length);
    }
  });

  it('says whether it is asking for a fact or for thinking', () => {
    for (const { story, q } of all) {
      expect(['literal', 'inferential'], `${story.id}: "${q.q}"`).toContain(q.type);
    }
    // Both kinds, everywhere — a bank of pure retrieval teaches skimming.
    for (const s of STORIES) {
      const types = new Set(s.comprehension.map((q) => q.type));
      expect(types.has('inferential'), `${s.id} has no thinking question`).toBe(true);
    }
  });

  it('ends every question with a question mark', () => {
    for (const { story, q } of all) {
      expect(q.q.trim(), `${story.id}: "${q.q}"`).toMatch(/\?$/);
    }
  });
});

describe('a wrong answer can always be sent somewhere useful', () => {
  it('finds the sentence behind every literal question', () => {
    // A literal question is one whose answer is stated in the text. If the
    // clue matcher cannot find it, either the question is not really
    // literal or it is not really answerable from the story.
    const missed = all
      .filter(({ q }) => q.type === 'literal')
      .filter(({ story, q }) => !clueForQuestion(story, q))
      .map(({ story, q }) => `${story.id}: ${q.q}`);
    expect(missed).toEqual([]);
  });

  it('covers nearly every thinking question too', () => {
    const inferential = all.filter(({ q }) => q.type === 'inferential');
    const found = inferential.filter(({ story, q }) => clueForQuestion(story, q)).length;
    // The handful without one — "what does this story teach us?" — have no
    // single sentence behind them, and the reader says so rather than
    // pointing somewhere arbitrary.
    expect(found / inferential.length).toBeGreaterThan(0.9);
  });
});
