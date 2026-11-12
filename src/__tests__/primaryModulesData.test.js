import { describe, it, expect } from 'vitest';
import { editingPassages, parseEditingSource } from '../data/editingPassages.js';
import { EDITING_TEACHBACK, renderEditingPassage, editingStem } from '../modes/editingQuest.js';
import { writingPrompts } from '../data/writingPrompts.js';

describe('Editing Quest passages', () => {
  const all = Object.values(editingPassages).flat();
  const EXPECTED_ERRORS = { 1: 6, 2: 7, 3: 8, 4: 10, 5: 10, 6: 12 };

  it('gives every level five different passages', () => {
    for (const [level, passages] of Object.entries(editingPassages)) {
      expect(passages.length, `P${level}`).toBe(5);
      expect(new Set(passages.map((p) => p.paragraph)).size).toBe(5);
      expect(new Set(passages.map((p) => p.title)).size).toBe(5);
    }
    expect(new Set(all.map((p) => p.id)).size).toBe(all.length);
  });

  it('asks for more corrections as the levels go up', () => {
    for (const [level, passages] of Object.entries(editingPassages)) {
      for (const p of passages) expect(p.errors.length, p.id).toBe(EXPECTED_ERRORS[level]);
    }
  });

  it('mixes grammar and spelling in every passage, six of each at P6', () => {
    for (const [level, passages] of Object.entries(editingPassages)) {
      for (const p of passages) {
        const grammar = p.errors.filter((e) => e.type === 'grammar').length;
        const spelling = p.errors.filter((e) => e.type === 'spelling').length;
        expect(grammar + spelling, p.id).toBe(p.errors.length);
        expect(spelling, p.id).toBeGreaterThanOrEqual(1);
        expect(grammar, p.id).toBeGreaterThanOrEqual(4);
        if (level === '6') expect([grammar, spelling], p.id).toEqual([6, 6]);
      }
    }
  });

  it('places every mistake exactly where the passage prints it', () => {
    for (const p of all) {
      let previousEnd = 0;
      for (const e of p.errors) {
        expect(p.paragraph.slice(e.index, e.index + e.token.length), p.id).toBe(e.token);
        expect(e.index, p.id).toBeGreaterThanOrEqual(previousEnd);
        previousEnd = e.index + e.token.length;
      }
    }
  });

  it('never asks a child to "correct" a word that is already right', () => {
    for (const p of all) {
      for (const e of p.errors) {
        expect(e.correction.toLowerCase(), `${p.id} ${e.token}`).not.toBe(e.token.toLowerCase());
        expect(e.accepted, p.id).toContain(e.correction);
        expect(e.explanation.length, `${p.id} ${e.token}`).toBeGreaterThan(10);
      }
    }
  });

  it('leaves no marking symbols in what the child reads', () => {
    for (const p of all) {
      for (const text of [p.paragraph, p.corrected, p.title, ...p.tryThis]) {
        expect(text, p.id).not.toMatch(/\[\[|\]\]|=>|::/);
      }
    }
  });

  it('has teaching notes for every rule it tests', () => {
    for (const p of all) {
      for (const e of p.errors) expect(EDITING_TEACHBACK[e.rule], `${p.id} ${e.rule}`).toBeTruthy();
    }
  });
});

describe('Editing Quest screen', () => {
  const item = parseEditingSource(
    'It [[were => was :: g :: svAgreement :: One day takes "was".]] hot. The cat was [[hapy => happy :: s :: spelling :: Double the p.]] & calm.',
  );

  it('underlines the word being fixed, not an earlier copy of it', () => {
    const html = renderEditingPassage(item, 1);
    expect(html).toContain('<mark class="eq-target">hapy</mark>');
    expect(html).toContain('<span class="eq-fixed">was</span> hot. The cat was ');
    expect(html).toContain('&amp; calm');
  });

  it('shows words still to come as printed', () => {
    const html = renderEditingPassage(item, 0);
    expect(html).toContain('<mark class="eq-target">were</mark>');
    expect(html).toContain('hapy');
    expect(html).not.toContain('happy');
  });

  it('gives the diagnosis the sentence the mistake is in', () => {
    expect(editingStem(item.paragraph, item.errors[1])).toBe('The cat was ___ & calm.');
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
