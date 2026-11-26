/**
 * Extra vocabulary MCQ rows, added on top of the rows each builder in
 * ../vocabMcq.js already rotates through, so every category has enough
 * different questions at each level for real practice.
 *
 * Kept in its own chunk (see vite.config.js) so the main vocabulary bank
 * stays inside its lazy-chunk budget.
 */
import { LOWER_ROWS } from './lower.js';
import { UPPER_WORD_ROWS } from './upperWords.js';
import { UPPER_TOPIC_ROWS } from './upperTopics.js';

const LEVEL_ORDER = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

/** All raw rows by plan category: [levels, q, answer, distractors, explanations][]. */
export const VOCAB_EXTRA_ROWS = mergeRowSets([LOWER_ROWS, UPPER_WORD_ROWS, UPPER_TOPIC_ROWS]);

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
 * The extra questions for one category at one level, as plain specs:
 * { q, answer, distractors, optionExplanations }.
 * optionExplanations is keyed by choice text, answer first.
 */
export function extraVocabSpecs(category, level) {
  return (VOCAB_EXTRA_ROWS[category] || [])
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
