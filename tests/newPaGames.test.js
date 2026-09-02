/**
 * Tests for the three classroom-inspired PA games added from the
 * Foundations material: Odd One Out, Count the Words, and Sound Hunt's
 * registry wiring.
 */
import { describe, it, expect, beforeAll } from 'vitest';

// The mode modules pull in the audio manager, which touches
// speechSynthesis at import time — stub it before importing (same
// pattern as paChoiceOrder.test.js).
globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
  paused: false,
  resume: () => {},
};
globalThis.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
  }
};

let pickOddOneOutRound, buildCountSentence, MODES, paPositionForMode, WORDS;
beforeAll(async () => {
  ({ pickOddOneOutRound } = await import('../src/modes/oddOneOut.js'));
  ({ buildCountSentence } = await import('../src/modes/wordCountMode.js'));
  ({ MODES } = await import('../src/modes/index.js'));
  ({ paPositionForMode } = await import('../src/modules/paTargetSequencer.js'));
  ({ WORDS } = await import('../src/data/words.js'));
});

const w = (id, word, graphemes, types, group = 'cvc-a', level = 1) => ({
  id,
  word,
  graphemes,
  types,
  group,
  level,
  emoji: '🃏',
});

describe('pickOddOneOutRound', () => {
  const pool = [
    w('b1', 'bat', ['b', 'a', 't'], ['c', 'sv', 'c']),
    w('b2', 'bag', ['b', 'a', 'g'], ['c', 'sv', 'c']),
    w('b3', 'bad', ['b', 'a', 'd'], ['c', 'sv', 'c']),
    w('p1', 'pat', ['p', 'a', 't'], ['c', 'sv', 'c']),
    w('m1', 'mat', ['m', 'a', 't'], ['c', 'sv', 'c']),
  ];

  it('builds 3 matching words plus 1 odd word with a different first sound', () => {
    const round = pickOddOneOutRound(pool[0], pool, pool);
    expect(round).not.toBeNull();
    expect(round.matches).toHaveLength(3);
    for (const m of round.matches) expect(m.graphemes[0]).toBe('b');
    expect(round.odd.graphemes[0]).not.toBe('b');
  });

  it('always includes the sequenced word among the matches', () => {
    const round = pickOddOneOutRound(pool[1], pool, pool);
    expect(round.matches.map((m) => m.id)).toContain('b2');
  });

  it('prefers a confusable first sound for the odd word (p for b)', () => {
    const round = pickOddOneOutRound(pool[0], pool, pool);
    expect(round.odd.id).toBe('p1'); // /p/ is /b/'s confusion pair, beats /m/
  });

  it('accepts a 2-match round when the pool is sparse (classroom "two or three")', () => {
    const sparse = [
      w('b1', 'bat', ['b', 'a', 't'], ['c', 'sv', 'c']),
      w('b2', 'bag', ['b', 'a', 'g'], ['c', 'sv', 'c']),
      w('m1', 'mat', ['m', 'a', 't'], ['c', 'sv', 'c']),
    ];
    const round = pickOddOneOutRound(sparse[0], sparse, sparse);
    expect(round).not.toBeNull();
    expect(round.matches).toHaveLength(2);
    expect(round.odd.id).toBe('m1');
  });

  it('returns null when no odd word exists', () => {
    const allSame = [
      w('b1', 'bat', ['b', 'a', 't'], ['c', 'sv', 'c']),
      w('b2', 'bag', ['b', 'a', 'g'], ['c', 'sv', 'c']),
      w('b3', 'bad', ['b', 'a', 'd'], ['c', 'sv', 'c']),
    ];
    expect(pickOddOneOutRound(allSame[0], allSame, allSame)).toBeNull();
  });

  it('builds a playable round for every real CVC word in the bank', () => {
    const cvcPool = WORDS.filter(
      (x) => x.group?.startsWith('cvc-') && Array.isArray(x.graphemes) && x.graphemes.length >= 2,
    );
    for (const word of cvcPool) {
      const round = pickOddOneOutRound(word, cvcPool, WORDS);
      expect(round, `no round for ${word.word}`).not.toBeNull();
      expect(round.matches.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('buildCountSentence', () => {
  it('substitutes the word and splits into clean tokens', () => {
    expect(buildCountSentence('I can say {w}.', 'cat')).toEqual(['I', 'can', 'say', 'cat']);
  });

  it('strips question marks and never yields empty tokens', () => {
    const tokens = buildCountSentence('Can you say the word {w}?', 'sun');
    expect(tokens).toEqual(['Can', 'you', 'say', 'the', 'word', 'sun']);
    expect(tokens.every((t) => t.length > 0)).toBe(true);
  });
});

describe('mode registry wiring', () => {
  it.each(['soundHunt', 'oddOneOut', 'wordCount'])('%s is registered with full metadata', (key) => {
    const mode = MODES[key];
    expect(mode).toBeDefined();
    expect(mode.key).toBe(key);
    expect(typeof mode.setup).toBe('function');
    expect(typeof mode.cleanup).toBe('function');
    expect(typeof mode.getCurrentWord).toBe('function');
    expect(mode.resultPolicy).toBe('final');
    expect(mode.group).toBe('phonemic');
  });

  it('routes the first-sound games through the alphabetical target ladder', () => {
    expect(paPositionForMode('soundHunt')).toBe('first');
    expect(paPositionForMode('oddOneOut')).toBe('first');
    // Word counting is sentence-level, not phoneme-positional
    expect(paPositionForMode('wordCount')).toBeNull();
  });
});
