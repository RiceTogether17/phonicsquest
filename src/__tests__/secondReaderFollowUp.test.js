/*
 * Second-reader review, follow-up round (2026-10-08). Pins the work on the
 * open items in SECOND_READER_REVIEW_2026-10-07.md:
 *   D4 — every MCQ option at every level is explained, not just named;
 *   D1 — the clue hunt asks for clues a person wrote, starting with P1–P3
 *        articles, pronouns, agreement and tenses.
 *
 * Each rewritten item was completed with every option before release. Where a
 * distractor also made correct English it was replaced, or the stem gained
 * the clue that rules it out; the RETIRED lists below pin those changes.
 */

import { describe, it, expect } from 'vitest';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';
import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';
import { GRAMMAR_CLOZE_CLUES } from '../data/clozeClues.js';
import {
  evaluateClueSelection,
  hasClueHunt,
  huntableClue,
  spanKeyWords,
} from '../modes/clueEngine.js';

const mcq = (bank) => Object.values(bank).flat();
const clozeAll = (bank) => Object.values(bank).flatMap((group) => Object.values(group).flat());
const firstBySeed = (items) => {
  const out = new Map();
  for (const p of items) if (!out.has(p.seedId || p.id)) out.set(p.seedId || p.id, p);
  return out;
};
const authoredClues = (p) => (p.clues || []).filter((c) => !c.generated);
const escapeRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const phraseIn = (phrase, text) => new RegExp(`\\b${escapeRe(phrase)}\\b`, 'i').test(text);

// Both generic generators: mcqOptionExplanations' fallback and vocabGlosses'
// per-choice gap filler.
const GENERIC =
  /is the choice that fits this sentence|does not fit here; the sentence needs|does not fit this sentence — the sentence needs/;

describe('D4: every option is explained', () => {
  it.each(GRAMMAR_MCQ_LEVELS)('Grammar %s has no generic explanation', (level) => {
    const generic = GRAMMAR_MCQ_ITEMS[level].filter((i) =>
      Object.values(i.optionExplanations).some((t) => GENERIC.test(t)),
    );
    expect(generic.map((i) => `${i.category}: ${i.q}`)).toEqual([]);
  });

  it.each(VOCAB_MCQ_LEVELS)('Vocabulary %s has no generic explanation', (level) => {
    const generic = VOCAB_MCQ_ITEMS[level].filter((i) =>
      Object.values(i.optionExplanations).some((t) => GENERIC.test(t)),
    );
    expect(generic.map((i) => `${i.category}: ${i.q}`)).toEqual([]);
  });

  it('explains every choice, and nothing that is not a choice', () => {
    for (const item of [...mcq(GRAMMAR_MCQ_ITEMS), ...mcq(VOCAB_MCQ_ITEMS)]) {
      expect(Object.keys(item.optionExplanations).sort(), item.id).toEqual(
        [...item.choices].sort(),
      );
    }
  });

  it('says why a wrong option is wrong in that sentence, not just that it is wrong', () => {
    const grammar = mcq(GRAMMAR_MCQ_ITEMS);
    const spareKey = grammar.find((i) => i.q.includes('where I ___ the spare key'));
    expect(spareKey.optionExplanations['have hidden']).toMatch(/the day before/);
    const lim = grammar.find((i) => i.q.startsWith('Seldom ___ as generous'));
    expect(lim.optionExplanations['Mr Lim was']).toMatch(/before the subject/);

    const vocab = mcq(VOCAB_MCQ_ITEMS);
    const gymnast = vocab.find((i) => i.q.startsWith('The gymnast landed'));
    expect(gymnast.optionExplanations.heavily).toMatch(/top marks|marks off/);
    const deadline = vocab.find((i) => i.q.startsWith('Since the deadline'));
    expect(deadline.optionExplanations['more slowly']).toMatch(/earlier deadline/);
  });
});

describe('D4: distractors found to be correct English while explaining them', () => {
  // [stem fragment, option no longer offered, because it also made a true sentence]
  const RETIRED = [
    // Reported speech: moving a past tense back to past perfect is optional.
    ['where I ___ the spare key', 'hid'],
    ['what I ___ in my project report', 'wrote'],
    ['what I ___ in my project report', 'was writing'],
    ['his father ___ him to the airport', 'drove'],
    ['his father ___ him to the airport', 'was driving'],
    ['said that his sister ___ to swim', 'was learning'],
    ['The coach asked us what time ___ the next day', 'we left'],
    ['said that she ___ the worksheet already', 'finished'],
    // Inversion: each of these is a grammatical inverted sentence.
    ['Only after checking the data ___ the error', 'has she noticed'],
    ['Seldom ___ as generous to the volunteers', 'is Mr Lim'],
    ['Only after finishing her corrections ___ allowed', 'has she been'],
    // Vocabulary.
    ['the team had to work ___', 'later'],
    ['___ the dirty table with a cloth', 'mopped'],
    ['the laboratory assistant carefully ___ the bench', 'mopped'],
    ['The monkey ___ from branch to branch', 'crawled'],
    ['The elderly professor ___ into the wrong lecture hall', 'marched'],
    ['had ___ off on her own', 'marched'],
    ['The vase ___ when it hit the floor', 'crashed'],
    ['The kitten purred ___', 'loudly'],
    ['The dog growled ___ when the stranger', 'softly'],
    ['He practised the piano ___ every evening', 'reluctantly'],
    ['He glanced at the report ___', 'anxiously'],
    ['She agreed to help ___, having already refused twice', 'sincerely'],
    ['He forgot his umbrella, so he got ___', 'cold'],
  ];
  const all = [...mcq(GRAMMAR_MCQ_ITEMS), ...mcq(VOCAB_MCQ_ITEMS)];

  it.each(RETIRED)('“%s” no longer offers “%s”', (fragment, retired) => {
    const items = all.filter((i) => i.q.includes(fragment));
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) expect(item.choices).not.toContain(retired);
  });

  // Moving the tense back is optional while what was said is still true, so
  // an unshifted option ("will be", "has finished") is only wrong when the
  // sentence says the words were spoken at a time that is now over.
  it.each([
    ['Mum phoned to say that she ___ home late', 'At lunchtime'],
    ['said that she ___ the worksheet', 'yesterday'],
    ['he asked whether I ___ the notice', "last Monday's"],
    ['where I ___ the spare key', 'the day before'],
    ['what I ___ in my project report', 'the week before'],
    ['the guide warned us that the path', "yesterday's hike"],
    ['___ the trophy on her shelf', 'last year'],
    ['when the new science lab ___ ready', 'a month later'],
    ['my brother said that he ___ the reply email', 'Yesterday afternoon'],
    ['explained that she ___ the dance steps', "last week's concert"],
  ])('“%s” carries the time clue “%s”', (fragment, clue) => {
    const items = mcq(GRAMMAR_MCQ_ITEMS).filter((i) => i.q.includes(fragment));
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) expect(item.q).toContain(clue);
  });

  it('makes the passive necessary in the lost-kitten item', () => {
    const item = mcq(GRAMMAR_MCQ_ITEMS).find((i) =>
      i.q.startsWith('The lost kitten ___ to its owner'),
    );
    expect(item.q).toMatch(/by a kind passer-by/);
    expect(item.answer).toBe('was returned');
  });
});

describe('D1: clues a person wrote', () => {
  const grammarSeeds = firstBySeed(clozeAll(passages));
  const vaultSeeds = firstBySeed(clozeAll(vocabPassages));
  const everySeed = [...grammarSeeds.values(), ...vaultSeeds.values()];

  it('every authored span is really in the passage, and is more than a little word', () => {
    for (const p of everySeed) {
      for (const clue of authoredClues(p)) {
        const where = `${p.id} blank ${clue.blankIndex + 1}`;
        expect(clue.acceptableSpans.length, where).toBeGreaterThan(0);
        for (const span of [...clue.acceptableSpans, ...(clue.partialSpans || [])]) {
          expect(phraseIn(span, p.text), `${where}: "${span}"`).toBe(true);
          expect(spanKeyWords(span).length, `${where}: "${span}"`).toBeGreaterThan(0);
        }
        expect(clue.explanation, where).toBeTruthy();
      }
    }
  });

  it('every table entry names a real passage and lines up with its blanks', () => {
    for (const [seed, clues] of Object.entries(GRAMMAR_CLOZE_CLUES)) {
      const p = grammarSeeds.get(seed);
      expect(p, seed).toBeTruthy();
      expect(clues.length, seed).toBe(p.answers.length);
    }
  });

  it('points a pronoun or agreement clue back at a word the child has already read', () => {
    for (const p of grammarSeeds.values()) {
      for (const clue of authoredClues(p)) {
        if (!['antecedent', 'subject-clue'].includes(clue.clueType)) continue;
        const before = p.text
          .split('___')
          .slice(0, clue.blankIndex + 1)
          .join(' ');
        const found = clue.acceptableSpans.some((span) => phraseIn(span, before));
        expect(found, `${p.id} blank ${clue.blankIndex + 1}`).toBe(true);
      }
    }
  });

  const P1_TO_P3 = ['P1', 'P2', 'P3'];
  const CATEGORIES = [
    'articles',
    'pronouns',
    'svAgreement',
    'simplePast',
    'presentCont',
    'pastCont',
    'tenseAwareness',
  ];

  it('hunts the first blank of every P1–P3 article, pronoun, agreement and tense passage', () => {
    const missing = [];
    for (const level of P1_TO_P3) {
      for (const category of CATEGORIES) {
        for (const p of firstBySeed(passages[level][category] || []).values()) {
          if (!huntableClue(p, 0)) missing.push(`${level} ${category} ${p.id}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it('asks a pronoun hunt for the person, not the words after the blank', () => {
    const tom = grammarSeeds.get('g-p1-pro-01');
    expect(hasClueHunt(tom)).toBe(true);
    expect(evaluateClueSelection('Tom', huntableClue(tom, 0))).toBe('strong');
    expect(evaluateClueSelection('likes', huntableClue(tom, 0))).toBe('weak');
  });

  it('keeps a clue on some blanks rather than re-deriving them all', () => {
    const p = grammarSeeds.get('g-p1-sp-01');
    expect(huntableClue(p, 0)?.acceptableSpans).toEqual(['Yesterday']);
    expect(huntableClue(p, 1)).toBeNull();
  });

  it('gives no part credit for the little words beside the blank', () => {
    const slide = huntableClue(grammarSeeds.get('g-p1-sva-01'), 1);
    expect(evaluateClueSelection('Tom', slide)).toBe('strong');
    expect(evaluateClueSelection('the', slide)).toBe('weak');
    expect(spanKeyWords('By the time')).toEqual(['by', 'time']);
    expect(evaluateClueSelection('the', { acceptableSpans: ['By the time'] })).toBe('weak');
    expect(evaluateClueSelection('time', { acceptableSpans: ['By the time'] })).toBe('strong');
  });

  it('no longer asks for "we", "she" or "lab" as the evidence', () => {
    const spansOf = (seed, blank) => huntableClue(grammarSeeds.get(seed), blank).acceptableSpans;
    expect(spansOf('gm-p3-conditionals-1', 1)).not.toContain('we'); // "result clause marker"
    expect(spansOf('gm-p5-reportedSpeech-1', 2)).not.toContain('she'); // "reporting signal"
    expect(spansOf('gm-p1-modals-1', 0)).not.toContain('lab'); // "rule word"
  });

  it('names who each pronoun stands for in passages that left it open', () => {
    const text = clozeAll(passages)
      .map((p) => p.text)
      .join('\n');
    expect(text).not.toMatch(/to the art teacher before ___ started class/);
    expect(text).not.toMatch(/Coach praised ___ after the race/);
    expect(text).not.toMatch(/The guide showed us old maps and ___/);
    expect(text).not.toMatch(/Mum thanked ___ warmly while ___ set the table/);
    expect(text).not.toMatch(/before ___ moved it outside/);
    expect(text).not.toMatch(/Sara is nice too\. ___ shares her toys\. ___ play together/);
  });

  it('gives a tense passage the time words that decide it', () => {
    const text = clozeAll(passages)
      .map((p) => p.text)
      .join('\n');
    // Without these, the present tense ("I walk home", "the pupils stand")
    // was also correct English.
    expect(text).not.toMatch(/^After school, I ___ home quickly/m);
    expect(text).not.toMatch(/(^|\. )After dinner, Tom ___ the dishes/m);
    expect(text).not.toMatch(/(^|\. )The pupils ___ in straight lines/m);
    expect(text).not.toMatch(/(^|\. )I ___ a poster for Earth Day/m);
    expect(text).not.toMatch(/Today, my teacher ___ kind/);
  });
});
