import { describe, it, expect, beforeEach } from 'vitest';
import {
  tokenizePassage,
  evaluateClueSelection,
  getClueHint,
  clueResultToScore,
  clueResultFeedback,
  renderClueHuntPassage,
} from '../modes/clueEngine.js';

describe('tokenizePassage', () => {
  it('splits a passage into words, blanks and spaces', () => {
    const tokens = tokenizePassage('Last Sunday I went to ___.');
    const types = tokens.map((t) => t.type);
    expect(types).toContain('word');
    expect(types).toContain('blank');
    expect(types).toContain('space');
    const words = tokens.filter((t) => t.type === 'word').map((t) => t.value);
    expect(words).toEqual(['Last', 'Sunday', 'I', 'went', 'to']);
  });

  it('numbers blanks consecutively from 0', () => {
    const tokens = tokenizePassage('I ___ to the shop and ___ a cake.');
    const blanks = tokens.filter((t) => t.type === 'blank');
    expect(blanks).toHaveLength(2);
    expect(blanks.map((b) => b.blankIndex)).toEqual([0, 1]);
  });

  it('separates leading and trailing punctuation from words', () => {
    const tokens = tokenizePassage('"Hello," she said.');
    const punctValues = tokens.filter((t) => t.type === 'punct').map((t) => t.value);
    const wordValues = tokens.filter((t) => t.type === 'word').map((t) => t.value);
    expect(wordValues).toEqual(['Hello', 'she', 'said']);
    expect(punctValues).toContain('"');
    expect(punctValues).toContain(',"');
  });

  it('keeps apostrophes and hyphens inside word tokens', () => {
    const tokens = tokenizePassage("don't worry, it's well-written.");
    const words = tokens.filter((t) => t.type === 'word').map((t) => t.value);
    expect(words).toContain("don't");
    expect(words).toContain("it's");
    expect(words).toContain('well-written');
  });

  it('returns no blanks for passages with no ___ markers', () => {
    const tokens = tokenizePassage('Plain sentence with no blanks.');
    expect(tokens.filter((t) => t.type === 'blank')).toHaveLength(0);
  });
});

describe('evaluateClueSelection', () => {
  const clueData = {
    acceptableSpans: ['Last Sunday'],
    partialSpans: ['Sunday'],
  };

  it('returns "strong" for any word inside an acceptable span', () => {
    expect(evaluateClueSelection('Last', clueData)).toBe('strong');
    expect(
      evaluateClueSelection('SUNDAY', { acceptableSpans: ['last sunday'], partialSpans: [] }),
    ).toBe('strong');
  });

  it('returns "partial" only when the word is in partialSpans but not acceptableSpans', () => {
    const data = { acceptableSpans: ['Yesterday morning'], partialSpans: ['Sunday'] };
    expect(evaluateClueSelection('Sunday', data)).toBe('partial');
  });

  it('returns "weak" for unrelated words', () => {
    expect(evaluateClueSelection('banana', clueData)).toBe('weak');
  });

  it('returns "weak" when clueData is missing', () => {
    expect(evaluateClueSelection('Last', null)).toBe('weak');
    expect(evaluateClueSelection('Last', undefined)).toBe('weak');
  });

  it('strips outer punctuation before comparing', () => {
    // "Sunday" is inside the "Last Sunday" acceptable span, so we expect
    // strong even when the tapped word arrives surrounded by quotes/commas.
    expect(evaluateClueSelection('"Sunday,"', clueData)).toBe('strong');
    expect(evaluateClueSelection('Last,', clueData)).toBe('strong');
    // Stripping should also kick in for partial spans when the only match
    // lives in partialSpans.
    const partialOnly = { acceptableSpans: ['Yesterday'], partialSpans: ['Sunday'] };
    expect(evaluateClueSelection('"Sunday,"', partialOnly)).toBe('partial');
  });

  it('is case-insensitive', () => {
    expect(evaluateClueSelection('last', clueData)).toBe('strong');
    expect(evaluateClueSelection('SUNDAY', clueData)).toBe('strong');
    const partialOnly = { acceptableSpans: ['Yesterday'], partialSpans: ['Sunday'] };
    expect(evaluateClueSelection('SUNDAY', partialOnly)).toBe('partial');
  });

  it('handles missing partialSpans / acceptableSpans gracefully', () => {
    expect(evaluateClueSelection('Last', { acceptableSpans: ['Last Sunday'] })).toBe('strong');
    expect(evaluateClueSelection('foo', { acceptableSpans: [] })).toBe('weak');
    expect(evaluateClueSelection('foo', {})).toBe('weak');
  });
});

describe('getClueHint hint ladder', () => {
  const clueData = {
    acceptableSpans: ['Last Sunday'],
    partialSpans: ['Sunday'],
    clueType: 'time-marker',
    explanation: '"Last Sunday" tells us this is past tense.',
  };

  it('level 1 is a generic nudge with no reveal', () => {
    const h = getClueHint(1, clueData);
    expect(h.message).toMatch(/look near the blank/i);
    expect(h.revealSpan).toBeNull();
  });

  it('level 2 returns a clueType-specific nudge for known types', () => {
    expect(getClueHint(2, { ...clueData, clueType: 'time-marker' }).message).toMatch(/when/i);
    expect(getClueHint(2, { ...clueData, clueType: 'connector-clue' }).message).toMatch(
      /connector/i,
    );
    expect(getClueHint(2, { ...clueData, clueType: 'contrast-clue' }).message).toMatch(/contrast/i);
    expect(getClueHint(2, { ...clueData, clueType: 'cause-clue' }).message).toMatch(/reason/i);
    expect(getClueHint(2, { ...clueData, clueType: 'collocation-clue' }).message).toMatch(/pair/i);
  });

  it('level 2 falls back to a generic message for unknown clue types', () => {
    const h = getClueHint(2, { ...clueData, clueType: 'unknown-mystery-type' });
    expect(h.message).toMatch(/key word/i);
  });

  it('level 3 hints at the region without revealing the full span', () => {
    const h = getClueHint(3, clueData);
    expect(h.message).toMatch(/Last/);
    expect(h.message).not.toMatch(/Last Sunday\b/);
    expect(h.revealSpan).toBeNull();
  });

  it('level 4 reveals the full span and the explanation', () => {
    const h = getClueHint(4, clueData);
    expect(h.message).toContain('"Last Sunday"');
    expect(h.message).toContain(clueData.explanation);
    expect(h.revealSpan).toBe('Last Sunday');
  });

  it('level 4 falls back to the explanation alone when no acceptableSpan exists', () => {
    const h = getClueHint(4, { explanation: 'Read the whole sentence.' });
    expect(h.message).toContain('Read the whole sentence');
    expect(h.revealSpan).toBeNull();
  });

  it('returns a safe default when clueData is missing', () => {
    const h = getClueHint(1, null);
    expect(h.message).toMatch(/whole sentence/i);
    expect(h.revealSpan).toBeNull();
  });

  it('returns a safe default for unknown hint levels', () => {
    const h = getClueHint(99, clueData);
    expect(h.message).toMatch(/whole sentence/i);
  });
});

describe('clueResultToScore', () => {
  it('maps strong/partial/weak to 1 / 0.5 / 0', () => {
    expect(clueResultToScore('strong')).toBe(1);
    expect(clueResultToScore('partial')).toBe(0.5);
    expect(clueResultToScore('weak')).toBe(0);
  });

  it('treats null/undefined/unknown as 0', () => {
    expect(clueResultToScore(null)).toBe(0);
    expect(clueResultToScore(undefined)).toBe(0);
    expect(clueResultToScore('mystery')).toBe(0);
  });
});

describe('clueResultFeedback', () => {
  it('returns positive copy + strong CSS class for strong clues', () => {
    const f = clueResultFeedback('strong');
    expect(f.message).toMatch(/excellent/i);
    expect(f.cssClass).toBe('clue-feedback--strong');
  });

  it('encourages a stronger clue for partial selections', () => {
    const f = clueResultFeedback('partial');
    expect(f.message).toMatch(/stronger one/i);
    expect(f.cssClass).toBe('clue-feedback--partial');
  });

  it('redirects to "look near the blank" for weak / unknown selections', () => {
    expect(clueResultFeedback('weak').message).toMatch(/near the blank/i);
    expect(clueResultFeedback('weak').cssClass).toBe('clue-feedback--weak');
    expect(clueResultFeedback(null).cssClass).toBe('clue-feedback--weak');
  });
});

describe('renderClueHuntPassage', () => {
  let container;

  beforeEach(() => {
    document.body.innerHTML = '';
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  it('renders one tappable button per word and a placeholder for the blank', () => {
    renderClueHuntPassage({
      container,
      text: 'Last Sunday I went to ___.',
      activeBlankIndex: 0,
    });
    const wordBtns = container.querySelectorAll('.clue-word-token');
    expect(wordBtns.length).toBe(5);
    expect([...wordBtns].map((b) => b.dataset.word)).toEqual(['Last', 'Sunday', 'I', 'went', 'to']);
    expect(container.querySelector('.clue-blank-token--active')).not.toBeNull();
  });

  it('marks already-filled blanks with their answer text instead of ___', () => {
    renderClueHuntPassage({
      container,
      text: 'I ___ to the shop and ___ a cake.',
      activeBlankIndex: 1,
      filledAnswers: ['went', null],
    });
    const filled = container.querySelector('.clue-blank-token--filled');
    expect(filled).not.toBeNull();
    expect(filled.textContent.trim()).toBe('went');
  });

  it('applies the result CSS class to the selected word', () => {
    renderClueHuntPassage({
      container,
      text: 'Last Sunday I went to ___.',
      activeBlankIndex: 0,
      selectedWord: 'Last',
      selectedResult: 'strong',
    });
    const strong = container.querySelector('.clue-word-token--strong');
    expect(strong).not.toBeNull();
    expect(strong.dataset.word).toBe('Last');
  });

  it('invokes onTapWord with the raw word value when a word is tapped', () => {
    const taps = [];
    renderClueHuntPassage({
      container,
      text: 'Last Sunday I went to ___.',
      activeBlankIndex: 0,
      onTapWord: (word) => taps.push(word),
    });
    container.querySelector('.clue-word-token[data-word="Sunday"]').click();
    expect(taps).toEqual(['Sunday']);
  });
});
