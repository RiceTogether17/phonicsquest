import { describe, it, expect } from 'vitest';
import { findClue, clueForQuestion, sentences, keywords, MIN_SCORE } from '../modules/storyClue.js';
import { STORIES } from '../data/stories.js';
import { words } from '../utils/tokenise.js';

const story = {
  lines: [
    { type: 'intro', text: 'Giri had a grand plan. He wanted to bake two cakes for his pal Jay.' },
    { type: 'label', text: 'Problem:' },
    { type: 'beat', text: 'But the cake stayed flat in the pan. It did not lift a bit!' },
    { type: 'end', text: 'Jay ate it by the lake. That flat cake was the best.' },
  ],
};

describe('splitting a story into sentences', () => {
  it('addresses each sentence the way the reader renders it', () => {
    const s = sentences(story);
    // line is the reader's data-line; from/to are data-word-idx, inclusive.
    expect(s[0]).toEqual({ line: 0, from: 0, to: 4, text: 'Giri had a grand plan.' });
    expect(s[1].line).toBe(0);
    expect(s[1].from).toBe(5);
  });

  it('skips the story-grammar labels', () => {
    // A clue pointing at "Problem:" tells a child nothing.
    expect(sentences(story).some((s) => s.text.includes('Problem'))).toBe(false);
  });

  it('every sentence covers a real word range', () => {
    for (const s of sentences(story)) {
      expect(s.to).toBeGreaterThanOrEqual(s.from);
      expect(s.text.split(/\s+/)).toHaveLength(s.to - s.from + 1);
    }
  });

  it('survives an empty or malformed story', () => {
    expect(sentences(null)).toEqual([]);
    expect(sentences({ lines: [] })).toEqual([]);
    expect(sentences({ lines: [{ type: 'beat' }] })).toEqual([]);
  });
});

describe('keywords', () => {
  it('drops the words that locate nothing', () => {
    const k = keywords('What did the cat do with the big red ball?');
    expect(k.has('cat')).toBe(true);
    expect(k.has('ball')).toBe(true);
    expect(k.has('the')).toBe(false);
    expect(k.has('did')).toBe(false);
  });

  it('matches across inflections', () => {
    expect([...keywords('cakes')][0]).toBe([...keywords('cake')][0]);
    expect([...keywords('jumped')][0]).toBe([...keywords('jump')][0]);
  });
});

describe('finding the clue', () => {
  it('points at the sentence that holds the answer', () => {
    const c = findClue(story, 'What did Giri want to bake?', 'Two cakes');
    expect(c.text).toContain('bake two cakes');
    expect(c.line).toBe(0);
  });

  it('weights the answer’s own words most heavily', () => {
    // "cake" appears in three sentences; only one is about the lake.
    const c = findClue(story, 'Where did Jay eat the cake?', 'By the lake');
    expect(c.text).toContain('lake');
  });

  it('returns null rather than sending a child somewhere arbitrary', () => {
    // Being sent to a sentence that does not hold the answer is worse than
    // being told it: the child looks, finds nothing, and learns that
    // looking back does not work.
    expect(findClue(story, 'What is the capital of France?')).toBeNull();
    expect(findClue(story, '')).toBeNull();
    expect(findClue(story, 'the and of')).toBeNull();
  });

  it('needs real overlap, not one incidental word', () => {
    const weak = findClue(story, 'Did it?');
    expect(weak).toBeNull();
    expect(MIN_SCORE).toBeGreaterThan(1);
  });
});

describe('measured against every authored question', () => {
  const withQuests = STORIES.filter((s) => s.comprehension?.length);
  const all = withQuests.flatMap((s) => s.comprehension.map((q) => ({ s, q })));

  it('finds a clue for every literal question in the bank', () => {
    // A literal question is one whose answer is stated in the text, so
    // "look back at the story" is exactly the right instruction and the
    // matcher has no excuse for failing.
    const literal = all.filter(({ q }) => q.type === 'literal');
    expect(literal.length).toBeGreaterThan(50);
    const missed = literal.filter(({ s, q }) => !clueForQuestion(s, q)).map(({ q }) => q.q);
    expect(missed).toEqual([]);
  });

  it('declines on the questions whose answer is in no single sentence', () => {
    // "What does this story teach us?" has no clue sentence, and saying so
    // is the correct answer, not a gap. These three are the only ones.
    const missed = all.filter(({ s, q }) => !clueForQuestion(s, q));
    expect(missed.every(({ q }) => q.type === 'inferential')).toBe(true);
    expect(missed.length).toBeLessThanOrEqual(5);
  });

  it('locates a clue for at least 95% of questions overall', () => {
    const found = all.filter(({ s, q }) => clueForQuestion(s, q)).length;
    const pct = (100 * found) / all.length;
    expect(pct, `found ${found}/${all.length} (${pct.toFixed(1)}%)`).toBeGreaterThanOrEqual(95);
  });

  it('every clue it returns is really in that story', () => {
    for (const { s, q } of all) {
      const c = clueForQuestion(s, q);
      if (!c) continue;
      const line = s.lines[c.line];
      expect(line, `${s.id}: clue line out of range`).toBeTruthy();
      expect(line.text, `${s.id}: clue text not in its line`).toContain(c.text);
    }
  });

  it('its word indices are the ones the reader puts on screen', () => {
    // The reader numbers `.wf-word` spans with the shared tokeniser; a clue
    // addresses a span by those numbers. When the clue matcher had its own
    // whitespace split the two disagreed on 30 of the bank's lines —
    // "Giri's" is one whitespace word but two word tokens, a lone em dash
    // is one whitespace word and no word token — so a clue would light up
    // the wrong phrase. Worse than lighting up nothing: the child looks,
    // finds no answer, and learns that looking back does not work.
    let checked = 0;
    for (const story of STORIES) {
      for (const s of sentences(story)) {
        const rendered = words(story.lines[s.line].text);
        expect(s.to, `${story.id} line ${s.line}: clue runs past the line`).toBeLessThan(
          rendered.length,
        );
        const span = rendered.slice(s.from, s.to + 1).join(' ');
        // Same words, in the same order, as the spans the reader will light.
        expect(words(s.text).join(' '), `${story.id} line ${s.line}`).toBe(span);
        checked++;
      }
    }
    expect(checked).toBeGreaterThan(500);
  });
});
