/*
 * Second-reader review, 2026-10-07 — Grammar MCQ, Vocabulary MCQ, Sentence
 * Forge, Cloze Castle and Word Vault.
 *
 * The 2026-09-19 audit (finding 11) asked for a second reader to complete every
 * item with every option, because structural validators cannot tell that two
 * options are both correct English. This file pins what that reading found:
 * answer keys that were wrong, distractors that were also right, an answer-key
 * corruption in Word Vault, and name swaps that changed a person's gender.
 * See SECOND_READER_REVIEW_2026-10-07.md for the full findings.
 */

import { describe, it, expect } from 'vitest';
import { GRAMMAR_MCQ_ITEMS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS } from '../data/vocabMcq.js';
import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';
import { allSentences } from '../data/sentences.js';
import {
  GRAMMAR_CLOZE_ACCEPTABLE_ANSWERS,
  VOCAB_CLOZE_ACCEPTABLE_ANSWERS,
} from '../data/clozeAcceptableAnswers.js';
import { SENTENCE_FORGE_ALTERNATIVES } from '../data/sentenceForgeAlternatives.js';
import { varyMcqNames } from '../data/practiceExpansion.js';
import { isBlankAnswerCorrect } from '../modes/clozeEngine.js';

const mcq = (bank) => Object.values(bank).flat();
const clozeAll = (bank) => Object.values(bank).flatMap((group) => Object.values(group).flat());
const firstBySeed = (items) => {
  const out = new Map();
  for (const p of items) if (!out.has(p.seedId || p.id)) out.set(p.seedId || p.id, p);
  return out;
};
const countOf = (list) => list.reduce((m, w) => m.set(w, (m.get(w) || 0) + 1), new Map());

describe('MCQ distractors that were also correct English', () => {
  // [stem fragment, the option that is no longer offered, because it also fitted]
  const RETIRED = [
    ['My cousins ___ badminton after school', 'played'],
    ['The captain of the team ___ early every day', 'arrived'],
    ['A box of crayons ___ been left', 'had'],
    ['The audience ___ clapping loudly', 'were'],
    ['The puppy ___ at the door the whole time', 'was waiting'],
    ['While the coach ___ the strategy', 'explained'],
    ['The pupils ___ their projects while the principal observed', 'presented'],
    ['Tomorrow, our class ___ the science centre', 'is visiting'],
    ['The coach says we ___ extra drills next week', 'are having'],
    ['My flight ___ at six in the morning', 'will depart'],
    ['If you heat ice, it ___ into water', 'will melt'],
    ['If you freeze water, it ___ into ice', 'will turn'],
    ['Once the storm ___, we went outside', 'passed'],
    ['Place the books over ___', 'here'],
    ['The doctor said that I ___ plenty of water', 'must drink'],
    ['We reached school ___ 7.20 a.m. today', 'by'],
    ['Please ___ the music a little', 'turn off'],
    ['Do not ___ so easily', 'give in'],
    ['Please ___ the lights when you leave', 'turn out'],
    ['A person who flies an aeroplane is a ___', 'captain'],
    ['Every morning, I can hear birds ___ outside my window', 'cheeping'],
    ['The crowd ___ in delight when the magician', 'screamed'],
    ['Her memory is as sharp as a ___', 'knife'],
  ];
  const all = [...mcq(GRAMMAR_MCQ_ITEMS), ...mcq(VOCAB_MCQ_ITEMS)];

  it.each(RETIRED)('“%s” no longer offers “%s”', (fragment, retired) => {
    const items = all.filter((i) => i.q.includes(fragment));
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) expect(item.choices).not.toContain(retired);
  });

  it('keys the future perfect after "By tomorrow morning" and "By next year"', () => {
    const grammar = mcq(GRAMMAR_MCQ_ITEMS);
    for (const fragment of [
      'By tomorrow morning, my brother',
      'By next year, the new community centre',
    ]) {
      const item = grammar.find((i) => i.q.includes(fragment));
      expect(item.answer).toMatch(/^will have /);
    }
  });

  it('no longer asks for "a little" water from someone who was very thirsty', () => {
    const item = mcq(GRAMMAR_MCQ_ITEMS).find((i) => i.answer === 'a little' && /drank/.test(i.q));
    expect(item.q).toMatch(/not very thirsty/);
  });

  it('does not put the answer in the question', () => {
    const vocab = mcq(VOCAB_MCQ_ITEMS);
    expect(vocab.some((i) => /rule .* is called a ___/i.test(i.q) && i.answer === 'rule')).toBe(
      false,
    );
    expect(vocab.some((i) => /in this passage/.test(i.q))).toBe(false);
    expect(vocab.some((i) => /___ glasses/.test(i.q) && i.answer === 'sunglasses')).toBe(false);
  });
});

describe('name swaps keep gender and titles', () => {
  it('never puts a girl among "three brothers"', () => {
    const spec = {
      q: 'Among the three brothers, Tom is the ___.',
      answer: 'tallest',
      choices: ['tallest', 'taller'],
    };
    for (let i = 0; i < 30; i += 1) {
      const { q } = varyMcqNames(spec, i);
      expect(q).not.toMatch(
        /\b(Mei|Siti|Priya|Jia|Zara|Aisha|Nurul|Devi|Hana|Lena|Ying|Tara|Sarah)\b/,
      );
    }
  });

  it('leaves "Aunt Mei" alone rather than producing "Aunt Omar"', () => {
    const spec = {
      q: '"___ did you go?" Aunt Mei asked.',
      answer: 'Where',
      choices: ['Where', 'When'],
    };
    for (let i = 0; i < 30; i += 1) expect(varyMcqNames(spec, i).q).toContain('Aunt Mei');
  });
});

describe('cloze blanks that accept a second correct word', () => {
  it('marks the key and each listed alternative right, and nothing else', () => {
    const passage = { answers: ['that', 'who'], acceptableAnswers: [['which'], []] };
    expect(isBlankAnswerCorrect(passage, 0, 'that')).toBe(true);
    expect(isBlankAnswerCorrect(passage, 0, 'which')).toBe(true);
    expect(isBlankAnswerCorrect(passage, 0, 'whom')).toBe(false);
    expect(isBlankAnswerCorrect(passage, 1, 'which')).toBe(false);
    expect(isBlankAnswerCorrect({ answers: ['a'] }, 0, 'a')).toBe(true);
  });

  it.each([
    ['Cloze Castle', passages, GRAMMAR_CLOZE_ACCEPTABLE_ANSWERS],
    ['Word Vault', vocabPassages, VOCAB_CLOZE_ACCEPTABLE_ANSWERS],
  ])('%s: every listed alternative is a real tile in a real blank', (_name, bank, table) => {
    const bySeed = firstBySeed(clozeAll(bank));
    for (const [seed, alternatives] of Object.entries(table)) {
      const passage = bySeed.get(seed);
      expect(passage, seed).toBeTruthy();
      expect(alternatives.length, seed).toBe(passage.answers.length);
      alternatives.forEach((words, i) => {
        for (const word of words) {
          expect(passage.wordBank, `${seed} blank ${i + 1}`).toContain(word);
          expect(word, `${seed} blank ${i + 1}`).not.toBe(passage.answers[i]);
        }
      });
    }
  });

  it('reaches revision rounds of a passage, not just its first copy', () => {
    const rounds = clozeAll(passages).filter((p) => p.seedId === 'gx-p5-connectors-23');
    expect(rounds.length).toBeGreaterThan(1);
    for (const p of rounds) expect(isBlankAnswerCorrect(p, 1, 'Although')).toBe(true);
  });
});

describe('Word Vault answer keys', () => {
  const all = clozeAll(vocabPassages);

  it('serves every passage with the tiles its own answers need', () => {
    for (const p of all) {
      const bank = countOf(p.wordBank);
      for (const [word, n] of countOf(p.answers)) {
        expect(bank.get(word) || 0, `${p.id}: "${word}"`).toBeGreaterThanOrEqual(n);
      }
    }
  });

  it('keeps authored answers rather than replacing a repeat with a distractor', () => {
    const owl = firstBySeed(all).get('ga-p2-01');
    expect(owl.answers).toEqual(['an', 'a', 'The']);
    const won = firstBySeed(all).get('con-p4-02');
    expect(won.answers[2]).toBe('in spite of');
  });

  it('no longer generates "stacked books in the shelf" or a chatting-so-focused connector', () => {
    for (const p of all) {
      expect(p.text, p.id).not.toMatch(/stacked books ___ the shelf/);
      expect(p.text, p.id).not.toMatch(/Because his friends were chatting/);
      expect(p.text, p.id).not.toMatch(
        /\b(During|In|At) (reading corner|bus ride home|lunch queue|school garden)\b/,
      );
    }
  });

  it('uses "an" before vowel-sound answers in definition passages', () => {
    const text = all.map((p) => p.text).join('\n');
    expect(text).not.toMatch(/\bA ___ is a piece of land completely surrounded/);
    expect(text).not.toMatch(/We use a ___ to erase/);
    expect(text).not.toMatch(/top, bottom, left and right directions are shown by a ___/);
  });
});

describe('Cloze Castle passages that were wrong', () => {
  const all = clozeAll(passages);
  const text = all.map((p) => p.text).join('\n');

  it('fixes ungrammatical or self-contradicting sentences', () => {
    expect(text).not.toMatch(/Never ___ I expected/);
    expect(text).not.toMatch(/feels ___ neat overall/);
    expect(text).not.toMatch(/completed the prototype since last Wednesday/);
    expect(text).not.toMatch(/By Tuesday, our class ___ ten chapters since Monday/);
    expect(text).not.toMatch(/___ a member forgets the schedule/);
    expect(text).not.toMatch(/Our last race was the ___ event/);
  });

  it('keys "a large number of" for the plural "resources"', () => {
    const plan = firstBySeed(all).get('g-p6-cu-02');
    expect(plan.answers[0]).toBe('a large number of');
  });
});

describe('Sentence Forge alternative orders', () => {
  const base = allSentences.filter((s) => !s.isVariant);
  const tiles = (s) => [
    s
      .replace(/[.!?]$/, '')
      .split(' ')
      .sort()
      .join('|'),
    s.slice(-1),
  ];

  it('every alternative belongs to exactly one sentence and uses exactly its tiles', () => {
    for (const [target, alternatives] of Object.entries(SENTENCE_FORGE_ALTERNATIVES)) {
      expect(base.filter((s) => s.sentence === target).length, target).toBe(1);
      for (const alt of alternatives) expect(tiles(alt), alt).toEqual(tiles(target));
    }
  });

  it('accepts the adverb before the verb as well as after the object', () => {
    const entry = base.find((s) => s.sentence === 'My sister packed her suitcase carefully.');
    expect(entry.acceptableAnswers).toContain('My sister carefully packed her suitcase.');
  });
});
