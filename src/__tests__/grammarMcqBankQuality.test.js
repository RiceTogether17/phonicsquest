/**
 * Grammar MCQ bank quality: enough different questions per skill for
 * mastery practice, one right answer per question, no repeats, and feedback
 * for every choice.
 */
import { describe, expect, it } from 'vitest';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { GRAMMAR_EXTRA_ROWS, levelsInRange } from '../data/grammarMcqExtra/index.js';

const MIN_PER_SKILL = 30;

const norm = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9_ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const capitalise = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function byCategory(items) {
  const out = {};
  for (const item of items) (out[item.category] ||= []).push(item);
  return out;
}

describe('grammar MCQ bank size', () => {
  it(`every skill has at least ${MIN_PER_SKILL} different questions at every level it is taught`, () => {
    const short = [];
    for (const level of GRAMMAR_MCQ_LEVELS) {
      for (const [category, items] of Object.entries(byCategory(GRAMMAR_MCQ_ITEMS[level]))) {
        const stems = new Set(items.map((it) => norm(it.q)));
        if (stems.size < MIN_PER_SKILL) short.push(`${level} ${category}: ${stems.size}`);
      }
    }
    expect(short, short.join('\n')).toEqual([]);
  });
});

describe('grammar MCQ answer keys', () => {
  const all = GRAMMAR_MCQ_LEVELS.flatMap((level) => GRAMMAR_MCQ_ITEMS[level]);

  it('every question lists its answer exactly once among 3 or 4 different choices', () => {
    const bad = [];
    for (const item of all) {
      const choices = item.choices || [];
      const hits = choices.filter((c) => c === item.answer).length;
      const distinct = new Set(choices.map((c) => String(c).trim().toLowerCase())).size;
      if (hits !== 1 || distinct !== choices.length || choices.length < 3 || choices.length > 4) {
        bad.push(`${item.id}: ${item.q} [${choices.join(' | ')}] answer=${item.answer}`);
      }
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('every question has a blank or asks a question', () => {
    const bad = all.filter((item) => !/___|\?/.test(item.q)).map((item) => `${item.id}: ${item.q}`);
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('no question appears twice in the same skill and level', () => {
    const dupes = [];
    for (const level of GRAMMAR_MCQ_LEVELS) {
      for (const [category, items] of Object.entries(byCategory(GRAMMAR_MCQ_ITEMS[level]))) {
        const seen = new Map();
        for (const item of items) {
          const key = norm(item.q);
          if (seen.has(key)) dupes.push(`${level} ${category}: ${item.q}`);
          else seen.set(key, item.id);
        }
      }
    }
    expect(dupes, dupes.join('\n')).toEqual([]);
  });

  it('every choice has its own feedback line', () => {
    const missing = [];
    for (const item of all) {
      for (const choice of item.choices) {
        if (!String(item.optionExplanations?.[choice] || '').trim()) {
          missing.push(`${item.id} "${choice}"`);
        }
      }
    }
    expect(missing, missing.join('\n')).toEqual([]);
  });
});

describe('hand-written extra grammar rows', () => {
  const rows = Object.entries(GRAMMAR_EXTRA_ROWS).flatMap(([category, list]) =>
    list.map((row) => ({ category, row })),
  );

  it('are well formed: a valid level range, 2 or 3 distractors, one feedback line per choice', () => {
    const bad = [];
    for (const { category, row } of rows) {
      const [range, q, answer, distractors, explanations] = row;
      const ok =
        levelsInRange(range).length > 0 &&
        typeof q === 'string' &&
        q.includes('___') &&
        typeof answer === 'string' &&
        Array.isArray(distractors) &&
        distractors.length >= 2 &&
        distractors.length <= 3 &&
        !distractors.includes(answer) &&
        Array.isArray(explanations) &&
        explanations.length === distractors.length + 1;
      if (!ok) bad.push(`${category}: ${q}`);
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('the first feedback line confirms the keyed answer, and no other line claims to be correct', () => {
    const bad = [];
    for (const { category, row } of rows) {
      const [, q, answer, distractors, explanations] = row;
      const [why, ...wrongs] = explanations;
      // Opens with the answer itself, e.g. '"An" is correct' or, where the
      // answer is part of a phrase, '"Should have" is correct'.
      if (!why.startsWith(`"${capitalise(answer)}`)) {
        bad.push(`${category}: ${q} — answer line does not start with "${answer}"`);
      }
      if (!/is correct/.test(why))
        bad.push(`${category}: ${q} — answer line does not say it is correct`);
      wrongs.forEach((line, i) => {
        if (/^"[^"]+" is correct/.test(line)) {
          bad.push(`${category}: ${q} — feedback for "${distractors[i]}" says it is correct`);
        }
      });
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('every row reaches at least one level where its skill is taught', () => {
    const shown = new Set(
      GRAMMAR_MCQ_LEVELS.flatMap((level) =>
        GRAMMAR_MCQ_ITEMS[level].map((it) => `${it.category}|${norm(it.q)}`),
      ),
    );
    const unused = rows
      .filter(({ category, row }) => !shown.has(`${category}|${norm(row[1])}`))
      .map(({ category, row }) => `${category}: ${row[1]}`);
    expect(unused, unused.join('\n')).toEqual([]);
  });

  it('do not repeat a question the bank already had for the same skill', () => {
    const seen = new Map();
    const dupes = [];
    for (const { category, row } of rows) {
      const key = `${category}|${norm(row[1])}`;
      if (seen.has(key)) dupes.push(`${category}: ${row[1]}`);
      seen.set(key, true);
    }
    expect(dupes, dupes.join('\n')).toEqual([]);
  });
});
