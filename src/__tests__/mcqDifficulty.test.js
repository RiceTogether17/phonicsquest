import { describe, expect, it } from 'vitest';
import { inferQuestionContextType } from '../data/mcqItemMetadata.js';
import { buildGrammarMcqLevel } from '../data/grammarMcq.js';
import { filterMcqItemsForDifficulty } from '../modes/mcqDifficulty.js';

describe('MCQ difficulty and context metadata', () => {
  it('tags multi-sentence contexts from question text', () => {
    expect(
      inferQuestionContextType('Rina had never visited the museum before. She saw ___ vase.'),
    ).toBe('multi');
    expect(inferQuestionContextType('She saw ___ vase.')).toBe('single');
  });

  it('writes context metadata to generated MCQ items', () => {
    const items = buildGrammarMcqLevel('P3');
    expect(
      items.every((item) => item.contextType === 'single' || item.contextType === 'multi'),
    ).toBe(true);
    expect(items.some((item) => item.contextType === 'multi')).toBe(true);
  });

  it('filters challenge mode to harder items and prefers multi-sentence upper-primary items', () => {
    const items = buildGrammarMcqLevel('P4');
    const challenge = filterMcqItemsForDifficulty(items, { level: 'P4', difficulty: 'challenge' });
    expect(challenge.length).toBeGreaterThan(0);
    expect(challenge.every((item) => item.difficulty >= 3)).toBe(true);
    if (items.filter((item) => item.difficulty >= 3 && item.contextType === 'multi').length >= 5) {
      expect(challenge.every((item) => item.contextType === 'multi')).toBe(true);
    }
  });
});
