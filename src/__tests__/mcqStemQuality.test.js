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
  const MIN_UNIQUE_RATIO = 0.95; // ≥95% of the 150 stems should be unique

  it('every grammar MCQ level has at least 95% unique stems', () => {
    for (const level of GRAMMAR_MCQ_LEVELS) {
      const items = GRAMMAR_MCQ_ITEMS[level] || [];
      const unique = new Set(items.map(it => it.q.trim().toLowerCase()));
      const ratio = unique.size / items.length;
      expect(
        ratio,
        `${level}: only ${unique.size}/${items.length} unique stems`,
      ).toBeGreaterThanOrEqual(MIN_UNIQUE_RATIO);
    }
  });

  it('every vocab MCQ level has at least 95% unique stems', () => {
    for (const level of VOCAB_MCQ_LEVELS) {
      const items = VOCAB_MCQ_ITEMS[level] || [];
      const unique = new Set(items.map(it => it.q.trim().toLowerCase()));
      const ratio = unique.size / items.length;
      expect(
        ratio,
        `${level}: only ${unique.size}/${items.length} unique stems`,
      ).toBeGreaterThanOrEqual(MIN_UNIQUE_RATIO);
    }
  });
});

describe('MCQ stem quality — capitalization after fronted context', () => {
  it('common starters (pronouns, articles, modals) are lowercased after the comma', () => {
    // Tag-question stems get fronted contexts that end with a comma.
    // After the comma, common starters like "you", "they", "she", "the"
    // should be lowercase to read naturally.
    const tagItems = GRAMMAR_MCQ_ITEMS.P3.filter(it => it.category === 'tagQuestions');
    expect(tagItems.length).toBeGreaterThan(0);
    const offenders = tagItems.filter(it => /,\s+(You|They|She|He|We|It|The|This|That|These|Those|Can|Could|Will|Would|Must|May|Should|Is|Are|Was|Were|Do|Does|Did|Have|Has|Had)\s/.test(it.q));
    expect(offenders.map(it => it.q), 'capital pronouns/articles after comma').toEqual([]);
  });

  it('proper nouns keep their capital after the fronted context', () => {
    // Stems that begin with "Andy" / "Mei" / "Mum" should preserve the
    // capital even when prepended.
    const items = GRAMMAR_MCQ_ITEMS.P3.filter(it => it.q.includes('Andy is joining us'));
    expect(items.length).toBeGreaterThan(0);
    for (const it of items) {
      // Match "..., Andy" with capital A
      expect(it.q, `proper noun should keep capital: ${it.q}`).toMatch(/,\s+Andy\s/);
    }
  });
});
