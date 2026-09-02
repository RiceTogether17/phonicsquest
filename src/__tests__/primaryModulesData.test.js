import { describe, it, expect } from 'vitest';
import { editingPassages } from '../data/editingPassages.js';
import { writingPrompts } from '../data/writingPrompts.js';

describe('PSLE-style editing data', () => {
  it('provides 10 editing targets per passage', () => {
    for (const passages of Object.values(editingPassages)) {
      for (const p of passages) {
        expect(p.errors.length).toBe(10);
      }
    }
  });

  it('has at least 1 spelling and 5 grammar targets per passage', () => {
    for (const passages of Object.values(editingPassages)) {
      for (const p of passages) {
        const grammar = p.errors.filter((e) => e.type === 'grammar').length;
        const spelling = p.errors.filter((e) => e.type === 'spelling').length;
        expect(grammar).toBeGreaterThanOrEqual(5);
        expect(spelling).toBeGreaterThanOrEqual(1);
      }
    }
  });
});

describe('Writing prompts structure', () => {
  it('includes rubric and try-this tiers for each prompt', () => {
    for (const prompts of Object.values(writingPrompts)) {
      for (const prompt of prompts) {
        expect(Array.isArray(prompt.rubric)).toBe(true);
        expect(prompt.rubric.length).toBeGreaterThanOrEqual(3);
        expect(Array.isArray(prompt.tryThis)).toBe(true);
        expect(prompt.tryThis.length).toBe(2);
      }
    }
  });
});
