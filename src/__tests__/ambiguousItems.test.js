/*
 * Audit 2026-09-19, Finding 11 — several questions have more than one
 * defensible answer.
 *
 * Six representative items were named. In each, a child giving correct English
 * was marked wrong, which teaches that the program's preference outranks
 * meaning — the most corrosive thing a practice app can teach.
 *
 * Two shapes of fix, both of which the audit asks for:
 *   - MCQ: author context that forces the intended answer (or remove a
 *     distractor that is genuinely correct).
 *   - open cloze: accept every completion a teacher would accept.
 *
 * These tests pin the six. They are NOT a claim that the remaining 2,520
 * Grammar and 1,928 Vocabulary MCQ items have been reviewed — the audit is
 * explicit that structural validators cannot replace a second reader, and that
 * review is work package 3.
 */

import { describe, it, expect } from 'vitest';
import { GRAMMAR_MCQ_ITEMS } from '../data/grammarMcq.js';
import { VOCAB_MCQ_ITEMS } from '../data/vocabMcq.js';
import { getAllComprehensionClozePassages } from '../data/comprehensionClozePassages.js';

/** Every built item across all levels of a bank. */
const flatten = (bank) => Object.values(bank).flat();

const grammar = flatten(GRAMMAR_MCQ_ITEMS);
const vocab = flatten(VOCAB_MCQ_ITEMS);

const findStem = (items, fragment) => items.find((i) => i.q.includes(fragment));

const allBlanks = () =>
  getAllComprehensionClozePassages().flatMap((p) =>
    (p.blanks || []).map((b) => ({ passage: p.id, ...b })),
  );

const blankFor = (passageId, num) =>
  allBlanks().find((b) => b.passage === passageId && b.num === num);

describe('items with more than one defensible answer (audit finding 11)', () => {
  it('reads both banks, so the assertions below are not vacuous', () => {
    expect(grammar.length).toBeGreaterThan(100);
    expect(vocab.length).toBeGreaterThan(100);
  });

  describe('grammar MCQ: context now forces the keyed answer', () => {
    it('gives "Both the teacher and the principal ___" a time context', () => {
      const item = findStem(grammar, 'Both the teacher and the principal');
      expect(item).toBeTruthy();
      expect(item.answer).toBe('support');

      // "supported" is still offered, and is now defensibly wrong.
      expect(item.choices).toContain('supported');
      expect(item.q).toMatch(/begins this Monday/);
    });

    it('gives "The news about the school trip ___" a tense clue', () => {
      const item = findStem(grammar, 'The news about the school trip');
      expect(item).toBeTruthy();
      expect(item.answer).toBe('is');
      expect(item.choices).toContain('was');
      expect(item.q).toMatch(/we leave on Friday/);
    });

    it('makes the ruler indefinite, so "the" is no longer possible', () => {
      const item = findStem(grammar, 'any ruler will do');
      expect(item).toBeTruthy();
      expect(item.answer).toBe('a');
      expect(item.choices).toContain('the');
      expect(item.q).toMatch(/any ruler will do/);
    });
  });

  describe('vocabulary MCQ: the correct distractor is gone', () => {
    it('no longer offers "finish off" against a keyed "complete"', () => {
      const item = findStem(vocab, 'their homework before going home');
      expect(item).toBeTruthy();
      expect(item.answer).toBe('complete');
      // "finish off their homework" is ordinary English and could not be wrong.
      expect(item.choices).not.toContain('finish off');
    });
  });

  describe('open cloze: alternatives are accepted, not just keyed', () => {
    it('accepts "on Saturday" as well as "last Saturday" (cc-p3-01)', () => {
      const blank = blankFor('cc-p3-01', 1);
      expect(blank.answer).toBe('last');
      expect(blank.accept).toContain('on');
      // The explanation says so, rather than asserting one right answer.
      expect(blank.explanation).toMatch(/equally correct|both are accepted/i);
    });

    it('accepts "before" and "during" as well as "after" (cc-p3-02)', () => {
      const blank = blankFor('cc-p3-02', 2);
      expect(blank.answer).toBe('after');
      expect(blank.accept).toEqual(expect.arrayContaining(['before', 'during']));
      expect(blank.explanation).toMatch(/all three are accepted/i);
    });
  });

  it('keeps every keyed answer out of its own accept list, and all lists clean', () => {
    // A stray duplicate would mask a real ambiguity behind a passing grade.
    for (const b of allBlanks()) {
      const accept = b.accept || [];
      expect(accept, `${b.passage} blank ${b.num} repeats its own answer`).not.toContain(b.answer);
      expect(new Set(accept).size, `${b.passage} blank ${b.num} has duplicate accepts`).toBe(
        accept.length,
      );
    }
  });

  it('has no MCQ item whose answer also appears among its distractors', () => {
    // The structural check the audit confirmed is clean; asserted here so it
    // stays clean as items are edited.
    for (const item of [...grammar, ...vocab]) {
      const seen = new Set(item.choices.map((c) => c.toLowerCase().trim()));
      expect(seen.size, `duplicate choice in "${item.q}"`).toBe(item.choices.length);
    }
  });
});
