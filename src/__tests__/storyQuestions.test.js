import { describe, it, expect } from 'vitest';
import { STORIES } from '../data/stories.js';
import { classifyWord, cleanToken, scanWord, stripSuffix } from '../modules/decodability.js';
import { clueForQuestion } from '../modules/storyClue.js';
import { NOT_SAID } from '../modes/storyQuest.js';

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
/** Every question answered by picking an option (all but put-in-order). */
const picked = all.filter(({ q }) => q.kind !== 'order');
const ordering = all.filter(({ q }) => q.kind === 'order');

describe('every story has something checkable', () => {
  it('leaves no story with only an open-ended prompt', () => {
    const without = STORIES.filter((s) => !s.comprehension?.length).map((s) => s.id);
    expect(without).toEqual([]);
  });

  it('asks fewer questions of the youngest readers', () => {
    // A Band A story is 40-odd words. Three four-option questions after it
    // is a test, not a check. From Band B a story carries five: the three
    // original questions plus two of the other kinds (true or false, fill
    // the gap, put in order), so a child does more than pick from a list.
    for (const s of STORIES) {
      const n = s.comprehension.length;
      if (s.band === 'A') expect(n, s.id).toBeLessThanOrEqual(2);
      expect(n, s.id).toBeGreaterThanOrEqual(2);
      expect(n, s.id).toBeLessThanOrEqual(5);
    }
  });

  it('keeps the options short enough to hold in mind', () => {
    // Four options is a lot of reading for a child who has just read 40
    // words. Band A is held to three; the rest to four, which is what the
    // existing Band C and D quests use.
    for (const { story, q } of picked) {
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
      // The events of a put-in-order question are read like options.
      for (const option of q.kind === 'order' ? q.events : q.options) {
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
    for (const { story, q } of picked) {
      expect(new Set(q.options).size, `${story.id}: "${q.q}"`).toBe(q.options.length);
    }
  });

  it('points at a real option', () => {
    for (const { story, q } of picked) {
      expect(Number.isInteger(q.answer), `${story.id}: "${q.q}"`).toBe(true);
      expect(q.answer, `${story.id}: "${q.q}"`).toBeGreaterThanOrEqual(0);
      expect(q.answer, `${story.id}: "${q.q}"`).toBeLessThan(q.options.length);
    }
  });

  it('says whether it is asking for a fact or for thinking', () => {
    // A fill-the-gap is reading a word in its sentence (vocabulary), and a
    // put-in-order question is about sequence; both are named as such.
    const allowed = {
      undefined: ['literal', 'inferential'],
      tf: ['literal', 'inferential'],
      gap: ['vocabulary'],
      order: ['sequence'],
    };
    for (const { story, q } of all) {
      expect(allowed[q.kind], `${story.id}: unknown kind ${q.kind}`).toBeTruthy();
      expect(allowed[q.kind], `${story.id}: "${q.q}"`).toContain(q.type);
    }
    // Both kinds, everywhere — a bank of pure retrieval teaches skimming.
    for (const s of STORIES) {
      const types = new Set(s.comprehension.map((q) => q.type));
      expect(types.has('inferential'), `${s.id} has no thinking question`).toBe(true);
    }
  });

  it('ends every question with a question mark', () => {
    // True or false is a statement and a gap is a sentence, so those end
    // like sentences; an order question is an instruction.
    for (const { story, q } of all) {
      const end =
        q.kind === 'tf' || q.kind === 'gap' ? /[.!]$/ : q.kind === 'order' ? /[.?]$/ : /\?$/;
      expect(q.q.trim(), `${story.id}: "${q.q}"`).toMatch(end);
    }
  });
});

describe('a wrong answer can always be sent somewhere useful', () => {
  it('finds the sentence behind every literal question', () => {
    // A literal question is one whose answer is stated in the text. If the
    // clue matcher cannot find it, either the question is not really
    // literal or it is not really answerable from the story.
    const missed = picked
      .filter(({ q }) => q.type === 'literal' && q.options[q.answer] !== NOT_SAID)
      .filter(({ story, q }) => !clueForQuestion(story, q))
      .map(({ story, q }) => `${story.id}: ${q.q}`);
    expect(missed).toEqual([]);
  });

  it('covers nearly every thinking question too', () => {
    const inferential = picked.filter(
      ({ q }) => q.type === 'inferential' && q.options[q.answer] !== NOT_SAID,
    );
    const found = inferential.filter(({ story, q }) => clueForQuestion(story, q)).length;
    // The handful without one — "what does this story teach us?" — have no
    // single sentence behind them, and the reader says so rather than
    // pointing somewhere arbitrary.
    expect(found / inferential.length).toBeGreaterThan(0.9);
  });
});

describe('the other kinds of question', () => {
  const text = (story) => story.lines.map((l) => l.text).join(' ');
  /** Lowercase words only, so punctuation and quotes do not decide a match. */
  const flat = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z']+/g, ' ')
      .trim();
  const of = (kind) => all.filter(({ q }) => q.kind === kind);

  it('true or false offers True and False, and "the story does not say" when it is fair', () => {
    for (const { story, q } of of('tf')) {
      const ok = ['True', 'False'];
      expect([ok, [...ok, NOT_SAID]], `${story.id}: "${q.q}"`).toContainEqual(q.options);
    }
  });

  it('sometimes the answer is that the story does not say', () => {
    // Checking the text is the skill: a child who learns that "not in the
    // story" can be the answer stops filling gaps with guesses. Often enough
    // to be a real option, never so often it becomes the safe bet.
    const tf = of('tf');
    const notSaid = tf.filter(({ q }) => q.options[q.answer] === NOT_SAID).length;
    expect(notSaid).toBeGreaterThanOrEqual(6);
    expect(notSaid).toBeLessThanOrEqual(tf.length / 2);
    const falses = tf.filter(({ q }) => q.options[q.answer] === 'False').length;
    expect(falses, 'some statements should be false').toBeGreaterThanOrEqual(6);
  });

  it('a gap sentence has one blank, and filled in, it is a sentence from the story', () => {
    // So the gap is fair, and so a wrong answer can be sent to that sentence.
    for (const { story, q } of of('gap')) {
      expect(q.q.split('___'), `${story.id}: "${q.q}"`).toHaveLength(2);
      const filled = flat(q.q.replace('___', q.options[q.answer]));
      expect(flat(text(story)), `${story.id}: "${filled}"`).toContain(filled);
    }
  });

  it('a Band B gap asks for a word with the sound the story teaches', () => {
    // The point of the word bank in Band B is decoding: kite, kit and cat
    // differ by the sound the story is about, so only reading picks right.
    const spells = (word, g) => {
      const parses = [scanWord(word).parse];
      const st = stripSuffix(word);
      if (st) parses.push(scanWord(st.base).parse);
      return parses.some((p) => p.includes(g));
    };
    for (const { story, q } of of('gap').filter(({ story }) => story.band === 'B')) {
      const answer = cleanToken(q.options[q.answer]);
      const targets = story.targetGraphemes ?? [];
      expect(
        targets.some((g) => spells(answer, g)),
        `${story.id}: "${answer}" has none of ${targets.join(', ')}`,
      ).toBe(true);
    }
  });

  it('a put-in-order question has three or four different events', () => {
    for (const { story, q } of ordering) {
      expect(q.events.length, story.id).toBeGreaterThanOrEqual(3);
      expect(q.events.length, story.id).toBeLessThanOrEqual(4);
      expect(new Set(q.events).size, story.id).toBe(q.events.length);
    }
  });

  it('each band carries the kinds planned for it', () => {
    // Band B: a word-bank gap on the story's sound, and the story in order.
    // Band C: true or false, the story in order, and something to write.
    // Band D: true or false, a word in its sentence, and something to write.
    // Band E: true or false, the events in order, and something to write.
    const plan = { B: ['gap', 'order'], C: ['tf', 'order'], D: ['tf', 'gap'], E: ['tf', 'order'] };
    for (const story of STORIES.filter((s) => plan[s.band])) {
      const kinds = new Set(story.comprehension.map((q) => q.kind));
      for (const kind of plan[story.band])
        expect(kinds.has(kind), `${story.id}: ${kind}`).toBe(true);
      const written = story.openEnded?.length ?? 0;
      expect(written, `${story.id}: written answers`).toBe(story.band === 'B' ? 0 : 1);
    }
  });

  it('every written question has a good answer and says what to look for', () => {
    for (const story of STORIES) {
      for (const w of story.openEnded ?? []) {
        expect(w.q.trim(), story.id).toMatch(/\?$/);
        expect(w.sampleAnswer.length, `${story.id}: sample`).toBeGreaterThan(20);
        expect(w.markingGuide.length, `${story.id}: check`).toBeGreaterThan(15);
      }
    }
  });
});
