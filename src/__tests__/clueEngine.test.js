import { describe, it, expect } from 'vitest';
import { evaluateClueSelection, tokenizePassage } from '../modes/clueEngine.js';

describe('clueEngine clue strength', () => {
  const clueData = {
    acceptableSpans: ['Last Sunday'],
    partialSpans: ['Sunday'],
  };

  it('matches strong clue spans', () => {
    expect(evaluateClueSelection('Last', clueData)).toBe('strong');
  });

  it('matches partial clue spans', () => {
    expect(evaluateClueSelection('Sunday', { acceptableSpans: ['Yesterday'], partialSpans: ['Sunday'] })).toBe('partial');
  });

  it('marks weak clues', () => {
    expect(evaluateClueSelection('banana', clueData)).toBe('weak');
  });

  it('tokenizes punctuation safely', () => {
    const tokens = tokenizePassage(`"Yesterday," she ran to ___.`);
    const words = tokens.filter((t) => t.type === 'word').map((t) => t.value.toLowerCase());
    expect(words).toContain('yesterday');
    expect(words).toContain('ran');
  });
});
