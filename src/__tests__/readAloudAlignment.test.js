/**
 * Tests for the read-aloud alignment logic (readAloudListener.js).
 * Pure functions only — no browser speech APIs involved.
 */
import { describe, it, expect, vi } from 'vitest';

// speech.js touches window/store at import time inside jsdom; the pure
// helpers under test only use it for the default simFn, which these tests
// override, so a stub keeps the module graph light.
vi.mock('../modules/speech.js', () => ({
  speech: {
    supported: false,
    phoneticSimilarity: (a, b) => (a === b ? 1 : 0),
    stop: () => {},
    listenTranscript: async () => null,
  },
}));

const { tokenizeWords, alignReading, assessLineReading, MATCH_THRESHOLD, UNSURE_THRESHOLD } =
  await import('../modules/readAloudListener.js');

/** Exact-match similarity with a little leniency for near spellings. */
function simpleSim(a, b) {
  if (a === b) return 1;
  if (a[0] === b[0] && Math.abs(a.length - b.length) <= 1) return 0.5;
  return 0;
}

describe('tokenizeWords', () => {
  it('lowercases and strips punctuation', () => {
    expect(tokenizeWords('“Sam!” said the Cat.')).toEqual(['sam', 'said', 'the', 'cat']);
  });

  it('keeps internal apostrophes', () => {
    expect(tokenizeWords("Don't nap, Sam!")).toEqual(["don't", 'nap', 'sam']);
  });

  it('handles empty and non-string input', () => {
    expect(tokenizeWords('')).toEqual([]);
    expect(tokenizeWords(null)).toEqual([]);
    expect(tokenizeWords('   ')).toEqual([]);
  });
});

describe('alignReading', () => {
  it('matches a perfect reading word for word', () => {
    const out = alignReading(['the', 'cat', 'sat'], ['the', 'cat', 'sat'], simpleSim);
    expect(out.map((w) => w.status)).toEqual(['match', 'match', 'match']);
    expect(out.map((w) => w.heard)).toEqual(['the', 'cat', 'sat']);
  });

  it('flags a clearly skipped long word as miss', () => {
    const out = alignReading(['the', 'enormous', 'cat'], ['the', 'cat'], simpleSim);
    expect(out[0].status).toBe('match');
    expect(out[1].status).toBe('miss');
    expect(out[1].heard).toBeNull();
    expect(out[2].status).toBe('match');
  });

  it('is lenient on very short words (recognisers swallow them)', () => {
    const out = alignReading(['at', 'the', 'top'], ['top'], simpleSim);
    // 'at' is 2 letters — never flagged as a hard miss
    expect(out[0].status).toBe('unsure');
    expect(out[2].status).toBe('match');
  });

  it('survives extra inserted words without penalising later matches', () => {
    const out = alignReading(
      ['sam', 'ran', 'fast'],
      ['um', 'sam', 'like', 'ran', 'fast'],
      simpleSim,
    );
    expect(out.map((w) => w.status)).toEqual(['match', 'match', 'match']);
  });

  it('uses similarity, not equality, so near pronunciations stay kind', () => {
    const sim = (a, b) => (a === b ? 1 : a === 'cat' && b === 'cap' ? 0.7 : 0);
    const out = alignReading(['the', 'cat'], ['the', 'cap'], sim);
    expect(out[1].status).toBe('match'); // 0.7 ≥ MATCH_THRESHOLD
  });

  it('classifies middling similarity as unsure, not miss', () => {
    const sim = (a, b) => (a === b ? 1 : 0.5);
    const out = alignReading(['reading'], ['leading'], sim);
    expect(out[0].status).toBe('unsure');
  });

  it('marks everything miss when nothing was heard', () => {
    const out = alignReading(['the', 'big', 'dog'], [], simpleSim);
    expect(out.every((w) => w.status === 'miss')).toBe(true);
  });

  it('returns empty for an empty expected line', () => {
    expect(alignReading([], ['hello'], simpleSim)).toEqual([]);
  });

  it('thresholds are ordered sanely', () => {
    expect(MATCH_THRESHOLD).toBeGreaterThan(UNSURE_THRESHOLD);
    expect(UNSURE_THRESHOLD).toBeGreaterThan(0);
  });
});

describe('assessLineReading', () => {
  it('keeps the kindest result across transcript alternatives', () => {
    const transcripts = [{ text: 'the bat sat' }, { text: 'the cat sat' }];
    const out = assessLineReading('The cat sat.', transcripts, simpleSim);
    expect(out.matchCount).toBe(3);
    expect(out.total).toBe(3);
  });

  it('returns all-miss when there are no transcripts', () => {
    const out = assessLineReading('The cat sat.', [], simpleSim);
    expect(out.matchCount).toBe(0);
    expect(out.total).toBe(3);
    expect(out.words.every((w) => w.status === 'miss')).toBe(true);
  });
});
