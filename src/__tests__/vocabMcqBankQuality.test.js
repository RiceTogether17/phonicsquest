/**
 * Vocabulary MCQ bank quality: enough different questions per category for
 * mastery practice, one right answer per question, no repeats, and feedback
 * for every choice.
 */
import { describe, expect, it } from 'vitest';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';
import { VOCAB_EXTRA_ROWS, levelsInRange } from '../data/vocabMcqExtra/index.js';

const MIN_PER_CATEGORY = 30;

const norm = (text) =>
  String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9_ ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// The extra rows are keyed by the plan's category names; the bank files
// word-part questions under their canonical name.
const canonical = (category) => (category === 'wordParts' ? 'morphologicalAffix' : category);

function byCategory(items) {
  const out = {};
  for (const item of items) (out[item.category] ||= []).push(item);
  return out;
}

const all = VOCAB_MCQ_LEVELS.flatMap((level) => VOCAB_MCQ_ITEMS[level]);

describe('vocabulary MCQ bank size', () => {
  it(`every category has at least ${MIN_PER_CATEGORY} different questions at every level it is taught`, () => {
    const short = [];
    for (const level of VOCAB_MCQ_LEVELS) {
      for (const [category, items] of Object.entries(byCategory(VOCAB_MCQ_ITEMS[level]))) {
        const stems = new Set(items.map((it) => norm(it.q)));
        if (stems.size < MIN_PER_CATEGORY) short.push(`${level} ${category}: ${stems.size}`);
      }
    }
    expect(short, short.join('\n')).toEqual([]);
  });
});

describe('vocabulary MCQ answer keys', () => {
  it('every question lists its answer exactly once among 4 different choices', () => {
    const bad = [];
    for (const item of all) {
      const choices = item.choices || [];
      const hits = choices.filter((c) => c === item.answer).length;
      const distinct = new Set(choices.map((c) => String(c).trim().toLowerCase())).size;
      if (hits !== 1 || distinct !== 4 || choices.length !== 4) {
        bad.push(`${item.id}: ${item.q} [${choices.join(' | ')}] answer=${item.answer}`);
      }
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('no question appears twice in the same category and level', () => {
    const dupes = [];
    for (const level of VOCAB_MCQ_LEVELS) {
      for (const [category, items] of Object.entries(byCategory(VOCAB_MCQ_ITEMS[level]))) {
        const seen = new Set();
        for (const item of items) {
          const key = norm(item.q);
          if (seen.has(key)) dupes.push(`${level} ${category}: ${item.q}`);
          seen.add(key);
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

describe('hand-written extra vocabulary rows', () => {
  const rows = Object.entries(VOCAB_EXTRA_ROWS).flatMap(([category, list]) =>
    list.map((row) => ({ category, row })),
  );

  it('are well formed: a valid level range, 3 distractors, one feedback line per choice', () => {
    const bad = [];
    for (const { category, row } of rows) {
      const [range, q, answer, distractors, explanations] = row;
      const ok =
        levelsInRange(range).length > 0 &&
        typeof q === 'string' &&
        /___|\?/.test(q) &&
        typeof answer === 'string' &&
        Array.isArray(distractors) &&
        distractors.length === 3 &&
        !distractors.includes(answer) &&
        Array.isArray(explanations) &&
        explanations.length === distractors.length + 1 &&
        explanations.every((line) => typeof line === 'string' && line.trim());
      if (!ok) bad.push(`${category}: ${q}`);
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('give each choice its own feedback, and never call a wrong choice correct', () => {
    const bad = [];
    for (const { category, row } of rows) {
      const [, q, , distractors, explanations] = row;
      if (new Set(explanations).size !== explanations.length) {
        bad.push(`${category}: ${q} — two choices share one feedback line`);
      }
      explanations.slice(1).forEach((line, i) => {
        if (/\bis (also )?(correct|right)\b/i.test(line)) {
          bad.push(`${category}: ${q} — feedback for "${distractors[i]}" says it is correct`);
        }
      });
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  it('every row reaches each level in its range', () => {
    const shown = new Set(all.map((it) => `${it.level}|${it.category}|${norm(it.q)}`));
    const unused = [];
    for (const { category, row } of rows) {
      for (const level of levelsInRange(row[0])) {
        if (!shown.has(`${level}|${canonical(category)}|${norm(row[1])}`)) {
          unused.push(`${level} ${category}: ${row[1]}`);
        }
      }
    }
    expect(unused, unused.join('\n')).toEqual([]);
  });

  it('do not repeat each other within a category', () => {
    const seen = new Set();
    const dupes = [];
    for (const { category, row } of rows) {
      const key = `${category}|${norm(row[1])}`;
      if (seen.has(key)) dupes.push(`${category}: ${row[1]}`);
      seen.add(key);
    }
    expect(dupes, dupes.join('\n')).toEqual([]);
  });
});
