import { describe, it, expect } from 'vitest';
import {
  P5_PRACTICE_TESTS,
  P5_PRACTICE_TEST_TERMS,
  getP5PracticeTest,
  getP5PracticeTests,
  validateP5PracticeTests,
} from '../data/p5PracticeTests.js';
import {
  P6_PRACTICE_TESTS,
  P6_PRACTICE_TEST_TERMS,
  getP6PracticeTest,
  getP6PracticeTests,
  validateP6PracticeTests,
} from '../data/p6PracticeTests.js';
import { SITUATIONAL_WRITING_PROMPTS } from '../data/situationalWritingPrompts.js';
import { buildPlaceholderHtml, PRIMARY_PLACEHOLDER_KINDS } from '../modes/primaryPlaceholders.js';

describe('P5 Practice Test data bank', () => {
  it('exposes all four terms', () => {
    expect(P5_PRACTICE_TEST_TERMS).toEqual(['T1', 'T2', 'T3', 'T4']);
  });

  it('passes structural validation', () => {
    const issues = validateP5PracticeTests();
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('registers p5-practice-tests as a valid placeholder kind', () => {
    expect(PRIMARY_PLACEHOLDER_KINDS).toContain('p5-practice-tests');
  });

  it('lookup helpers work correctly', () => {
    expect(getP5PracticeTest('NOPE')).toBeNull();
    expect(Array.isArray(getP5PracticeTests())).toBe(true);
  });

  it('renders launcher html if papers exist', () => {
    const html = buildPlaceholderHtml('p5-practice-tests');
    expect(html).toContain('P5');
    expect(html).toContain('Practice Tests');
  });
});

describe('P6 Practice Test data bank', () => {
  it('exposes all four terms', () => {
    expect(P6_PRACTICE_TEST_TERMS).toEqual(['T1', 'T2', 'T3', 'T4']);
  });

  it('passes structural validation', () => {
    const issues = validateP6PracticeTests();
    expect(issues, issues.join('\n')).toEqual([]);
  });

  it('registers p6-practice-tests as a valid placeholder kind', () => {
    expect(PRIMARY_PLACEHOLDER_KINDS).toContain('p6-practice-tests');
  });

  it('lookup helpers work correctly', () => {
    expect(getP6PracticeTest('NOPE')).toBeNull();
    expect(Array.isArray(getP6PracticeTests())).toBe(true);
  });

  it('renders launcher html if papers exist', () => {
    const html = buildPlaceholderHtml('p6-practice-tests');
    expect(html).toContain('P6');
    expect(html).toContain('Practice Tests');
  });
});

describe('SITUATIONAL_WRITING_PROMPTS data bank', () => {
  it('is an array', () => {
    expect(Array.isArray(SITUATIONAL_WRITING_PROMPTS)).toBe(true);
  });

  it('all prompts have required fields when content exists', () => {
    for (const prompt of SITUATIONAL_WRITING_PROMPTS) {
      expect(prompt.id, 'missing id').toBeTruthy();
      expect(prompt.level, `${prompt.id} missing level`).toMatch(/^P[5-6]$/);
      expect(prompt.format, `${prompt.id} missing format`).toBeTruthy();
      expect(prompt.purpose, `${prompt.id} missing purpose`).toBeTruthy();
      expect(prompt.audience, `${prompt.id} missing audience`).toBeTruthy();
      expect(Array.isArray(prompt.bullets), `${prompt.id} bullets must be array`).toBe(true);
      expect(prompt.bullets.length, `${prompt.id} needs 3 bullets`).toBe(3);
    }
  });

  it('ids are unique when content exists', () => {
    const ids = SITUATIONAL_WRITING_PROMPTS.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('renders situational-writing placeholder html', () => {
    const html = buildPlaceholderHtml('situational-writing');
    expect(html).toContain('Situational Writing');
  });
});
