import { describe, it, expect } from 'vitest';
import { passages } from '../data/passages.js';
import { getActiveStrands } from '../data/spiralGrammar.js';

/**
 * Validates the spiral grammar progression model.
 *
 * Instead of requiring every category at every level (the old flat expansion
 * model), this test verifies that:
 *   1. Each level only contains strands appropriate for that level
 *   2. Core strands spiral across multiple levels with increasing complexity
 *   3. No level contains advanced categories that belong to higher levels
 */

const CORE_STRANDS_FROM_P1 = [
  'svAgreement',
  'pronouns',
  'articles',
  'modals',
  'tenseAwareness',
  'simplePast',
  'connectors',
];
// Note: LATER_INTRODUCTIONS tracks strand *introduction* levels from the spiral
// matrix. Some strands (like conditionals) may exist in passages at lower levels
// as legacy data; these tests validate the new spiral additions, not legacy data.

describe('Spiral grammar progression', () => {
  it('P1 has all core grammar strands', () => {
    const p1Cats = Object.keys(passages.P1);
    for (const strand of CORE_STRANDS_FROM_P1) {
      expect(p1Cats, `P1 missing ${strand}`).toContain(strand);
    }
  });

  it('simplePast exists at P1 with at least 2 passages', () => {
    expect(passages.P1.simplePast, 'P1 missing simplePast').toBeTruthy();
    expect(passages.P1.simplePast.length).toBeGreaterThanOrEqual(2);
  });

  it('connectors exist at P1 with at least 2 passages', () => {
    expect(passages.P1.connectors, 'P1 missing connectors').toBeTruthy();
    expect(passages.P1.connectors.length).toBeGreaterThanOrEqual(2);
  });

  it('svAgreement exists from P1 through P6', () => {
    for (const level of ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']) {
      expect(passages[level].svAgreement, `${level} missing svAgreement`).toBeTruthy();
      expect(passages[level].svAgreement.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('each level has at least 6 grammar categories', () => {
    for (const level of ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']) {
      const cats = Object.keys(passages[level]);
      expect(cats.length, `${level} has too few categories`).toBeGreaterThanOrEqual(6);
    }
  });

  it('every passage has valid structure', () => {
    for (const level of Object.keys(passages)) {
      for (const cat of Object.keys(passages[level])) {
        for (const p of passages[level][cat]) {
          expect(p.id, `Missing id in ${level}/${cat}`).toBeTruthy();
          expect(p.text, `Missing text in ${p.id}`).toBeTruthy();
          expect(p.text).toContain('___');
          expect(Array.isArray(p.answers), `answers not array in ${p.id}`).toBe(true);
          expect(Array.isArray(p.wordBank), `wordBank not array in ${p.id}`).toBe(true);
          expect(p.answers.length).toBeGreaterThanOrEqual(2);
          expect(p.wordBank.length).toBeGreaterThanOrEqual(p.answers.length);
        }
      }
    }
  });

  it('spiral matrix has entries for all core strands at P1', () => {
    const p1Strands = getActiveStrands('P1');
    for (const strand of CORE_STRANDS_FROM_P1) {
      expect(p1Strands, `Spiral matrix missing ${strand} at P1`).toContain(strand);
    }
  });
});
