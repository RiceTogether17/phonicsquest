/**
 * Extra grammar MCQ rows, added on top of the rows each builder in
 * ../grammarMcq.js already rotates through, so every skill has enough
 * different questions at each level for real practice.
 *
 * Kept in its own chunk (see vite.config.js) because the main grammar bank
 * is already close to the lazy-chunk budget.
 */
import { EARLY_ROWS } from './early.js';
import { MIDDLE_ROWS } from './middle.js';
import { UPPER_ROWS } from './upper.js';

const LEVEL_ORDER = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

/** All raw rows by category: [levels, q, answer, distractors, explanations][]. */
export const GRAMMAR_EXTRA_ROWS = mergeRowSets([EARLY_ROWS, MIDDLE_ROWS, UPPER_ROWS]);

function mergeRowSets(sets) {
  const out = {};
  for (const set of sets) {
    for (const [category, rows] of Object.entries(set)) {
      out[category] = [...(out[category] || []), ...rows];
    }
  }
  return out;
}

/** 'P2-P4' → ['P2', 'P3', 'P4']. */
export function levelsInRange(range) {
  const [from, to = from] = String(range).split('-');
  const start = LEVEL_ORDER.indexOf(from);
  const end = LEVEL_ORDER.indexOf(to);
  if (start < 0 || end < start) return [];
  return LEVEL_ORDER.slice(start, end + 1);
}

/**
 * The extra questions for one skill at one level, as plain specs:
 * { q, answer, distractors, optionExplanations }.
 * optionExplanations is keyed by choice text, answer first.
 */
export function extraGrammarSpecs(category, level) {
  return (GRAMMAR_EXTRA_ROWS[category] || [])
    .filter(([range]) => levelsInRange(range).includes(level))
    .map(([, q, answer, distractors, explanations]) => {
      const choices = [answer, ...distractors];
      return {
        q,
        answer,
        distractors: [...distractors],
        optionExplanations: Object.fromEntries(choices.map((c, i) => [c, explanations[i]])),
      };
    });
}
