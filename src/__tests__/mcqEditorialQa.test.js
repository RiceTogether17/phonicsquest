/**
 * Editorial QA for the generated MCQ banks.
 *
 * A distractor is only fair if it is actually wrong. When a wrong-answer
 * explanation concedes that the choice is "also correct", "also natural",
 * "also used", or merely "less common", the item has two defensible answers
 * and must be rewritten, not shipped. This suite rejects any per-choice
 * explanation for a non-answer choice that hedges in one of those ways.
 */
import { describe, expect, it } from 'vitest';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';

// Phrases that concede a distractor could be a right answer. Kept tight so
// legitimate teaching notes ("X is not correct because…") never match.
const CONCESSION = new RegExp(
  [
    'also correct',
    'also natural',
    'also standard',
    'also acceptable',
    'also used',
    'is possible',
    'is used but',
    'is less common',
    'but less common',
    'less common than',
    'works but',
    'is correct but',
    'is natural but',
    'natural and close',
  ].join('|'),
  'i',
);

function collectConcessions(items, bankName) {
  const offenders = [];
  const seen = new Set();
  for (const item of items) {
    if (!item.optionExplanations) continue;
    for (const [choice, text] of Object.entries(item.optionExplanations)) {
      if (choice === item.answer) continue;
      if (!CONCESSION.test(text)) continue;
      const key = `${choice}::${text}`;
      if (seen.has(key)) continue;
      seen.add(key);
      offenders.push(`${bankName} ${item.id} "${choice}": ${text}`);
    }
  }
  return offenders;
}

describe('MCQ editorial QA — distractors must be genuinely wrong', () => {
  it('grammar MCQ explanations never concede a distractor is also correct', () => {
    const offenders = GRAMMAR_MCQ_LEVELS.flatMap((level) =>
      collectConcessions(GRAMMAR_MCQ_ITEMS[level], `grammar/${level}`),
    );
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('vocabulary MCQ explanations never concede a distractor is also correct', () => {
    const offenders = VOCAB_MCQ_LEVELS.flatMap((level) =>
      collectConcessions(VOCAB_MCQ_ITEMS[level], `vocab/${level}`),
    );
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});
