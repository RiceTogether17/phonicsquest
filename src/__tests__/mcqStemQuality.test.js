import { describe, it, expect } from 'vitest';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';

/**
 * Quality guardrails for the auto-generated MCQ banks.
 *
 * Two regressions we hit during recent additions:
 *   (a) The decorator appended an adverbial tail AFTER a "?" or "!" —
 *       producing broken sentences like "...isn't he? before recess."
 *   (b) When categoryCount shared a factor with the 15-slot tail pool,
 *       the same (row, tail) pair repeated, collapsing 150 items to ~50
 *       unique stems.  Fixed by expanding the pool to a prime size + a
 *       multiplicative hash + prepending the tail for ?/! stems.
 *
 * These tests pin both behaviours so they don't regress silently.
 */
describe('MCQ stem quality — no decoration after ? / !', () => {
  it('grammar MCQ never appends a tail after a question mark', () => {
    const offenders = [];
    for (const level of GRAMMAR_MCQ_LEVELS) {
      for (const it of GRAMMAR_MCQ_ITEMS[level] || []) {
        if (/[?!]\s+(during|before|after|at|in|while)\s/i.test(it.q)) {
          offenders.push(`${it.id}: ${it.q}`);
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });

  it('vocab MCQ never appends a tail after a question mark', () => {
    const offenders = [];
    for (const level of VOCAB_MCQ_LEVELS) {
      for (const it of VOCAB_MCQ_ITEMS[level] || []) {
        if (/[?!]\s+(during|before|after|at|in|while)\s/i.test(it.q)) {
          offenders.push(`${it.id}: ${it.q}`);
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

describe('MCQ stem quality — high diversity per level', () => {
  // Since `decorateStem` was removed (commit 99c5f8f), banks generate
  // stems without the prepended adverbial / fronted-context tails that
  // used to inflate diversity. The natural-language stems are slightly
  // less unique at lower grades (P1 has the smallest blueprint pool),
  // so the threshold is set per-level to the empirically observed floor.
  // If a future generator change drops below these floors, that's a real
  // diversity regression worth catching.
  const MIN_UNIQUE_RATIO = {
    P1: 0.80, P2: 0.90, P3: 0.90, P4: 0.90, P5: 0.90, P6: 0.90,
  };

  it('every grammar MCQ level has enough unique stems', () => {
    for (const level of GRAMMAR_MCQ_LEVELS) {
      const items = GRAMMAR_MCQ_ITEMS[level] || [];
      const unique = new Set(items.map(it => it.q.trim().toLowerCase()));
      const ratio = unique.size / items.length;
      const floor = MIN_UNIQUE_RATIO[level] ?? 0.90;
      expect(
        ratio,
        `${level}: only ${unique.size}/${items.length} unique stems (floor ${floor})`,
      ).toBeGreaterThanOrEqual(floor);
    }
  });

  it('every vocab MCQ level has at least 90% unique stems', () => {
    // Vocab banks are richer (more lemmas per category) and consistently
    // hit ≥90% across every level. Real regression if this drops.
    for (const level of VOCAB_MCQ_LEVELS) {
      const items = VOCAB_MCQ_ITEMS[level] || [];
      const unique = new Set(items.map(it => it.q.trim().toLowerCase()));
      const ratio = unique.size / items.length;
      expect(
        ratio,
        `${level}: only ${unique.size}/${items.length} unique stems`,
      ).toBeGreaterThanOrEqual(0.90);
    }
  });
});

describe('MCQ stem quality — proper-noun capitalization', () => {
  it('common starters (pronouns, articles, modals) are lowercased after a comma', () => {
    // Tag-question stems that DO contain a fronted comma should still
    // lowercase generic starters after it. After decorateStem's removal
    // most stems no longer have a fronted clause, but the rule still
    // applies to any that remain.
    const tagItems = GRAMMAR_MCQ_ITEMS.P3.filter(it => it.category === 'tagQuestions');
    expect(tagItems.length).toBeGreaterThan(0);
    const offenders = tagItems.filter(it => /,\s+(You|They|She|He|We|It|The|This|That|These|Those|Can|Could|Will|Would|Must|May|Should|Is|Are|Was|Were|Do|Does|Did|Have|Has|Had)\s/.test(it.q));
    expect(offenders.map(it => it.q), 'capital pronouns/articles after comma').toEqual([]);
  });

  it('proper nouns stay capitalised wherever they appear in the stem', () => {
    // Andy / Mei / Mum should keep their capital whether at sentence
    // start or after punctuation. Since decorateStem was removed, most
    // proper nouns now sit at the start of the stem rather than post-
    // comma — capitalisation should still hold in both positions.
    const items = GRAMMAR_MCQ_ITEMS.P3.filter(it => it.q.includes('Andy'));
    expect(items.length).toBeGreaterThan(0);
    for (const it of items) {
      expect(it.q, `proper noun should keep capital: ${it.q}`)
        .toMatch(/(^|[,.!?]\s+)Andy\s/);
    }
  });
});
