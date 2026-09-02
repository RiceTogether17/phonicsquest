/**
 * Tricky high-frequency word distribution (architecture review item #4).
 *
 * The legacy `sight-highfreq` curriculum stage put every tricky word at
 * the end (phase 10). Early decodable sentences need `the`, `a`, `I`,
 * `to`, `was`, `said`, `you`, `my` from phase 1, otherwise the child
 * can't read a single real sentence for the first nine phases.
 *
 * These tests lock in:
 *   1. Every phase 1–8 has a non-empty tricky-word batch.
 *   2. Each entry has a valid category (decodable-soon / partial /
 *      fully-irregular) and the regular+tricky parts together cover the
 *      word's letters.
 *   3. The bootstrapping bundle (the/a/I/to/was/said/you/my) is in phase 1.
 *   4. Lookup helpers behave (getTrickyWord, isTrickyWord, getTrickyWordsForPhase,
 *      getTrickyWordsUpToPhase, highlightTrickyParts).
 *   5. progression.getTrickyWordsForCurrentStage returns sensible data.
 */
import { describe, it, expect } from 'vitest';
import {
  TRICKY_WORDS,
  getTrickyWord,
  isTrickyWord,
  getTrickyWordsForPhase,
  getTrickyWordsUpToPhase,
  highlightTrickyParts,
} from '../data/trickyWords.js';
import { getTrickyWordsForCurrentStage } from '../modules/progression.js';

const VALID_CATEGORIES = new Set(['decodable-soon', 'partial', 'fully-irregular']);

describe('TRICKY_WORDS data integrity', () => {
  it('every entry has a valid shape', () => {
    for (const t of TRICKY_WORDS) {
      expect(typeof t.word).toBe('string');
      expect(t.word.length).toBeGreaterThan(0);
      expect(Number.isInteger(t.phase)).toBe(true);
      expect(t.phase).toBeGreaterThanOrEqual(1);
      expect(t.phase).toBeLessThanOrEqual(8);
      expect(VALID_CATEGORIES.has(t.category), `bad category for ${t.word}: ${t.category}`).toBe(
        true,
      );
      expect(Array.isArray(t.regular)).toBe(true);
      expect(Array.isArray(t.tricky)).toBe(true);
      expect(typeof t.note).toBe('string');
      expect(t.note.length).toBeGreaterThan(0);
    }
  });

  it("'decodable-soon' entries declare which phase they'll be decodable in", () => {
    for (const t of TRICKY_WORDS) {
      if (t.category !== 'decodable-soon') continue;
      expect(
        t.decodableInPhase,
        `${t.word} is decodable-soon but missing decodableInPhase`,
      ).toBeDefined();
      expect(t.decodableInPhase).toBeGreaterThanOrEqual(t.phase);
    }
  });

  it('no duplicate words across the list', () => {
    const seen = new Set();
    for (const t of TRICKY_WORDS) {
      expect(seen.has(t.word), `duplicate entry for ${t.word}`).toBe(false);
      seen.add(t.word);
    }
  });

  it('every phase 1–8 has at least one tricky word (no empty phases)', () => {
    for (let p = 1; p <= 8; p++) {
      const words = getTrickyWordsForPhase(p);
      expect(words.length, `phase ${p} has no tricky words`).toBeGreaterThan(0);
    }
  });

  it('phase 1 contains the bootstrapping bundle for early decodable sentences', () => {
    const phase1 = getTrickyWordsForPhase(1).map((t) => t.word);
    // The minimum set so a child can read "I said the cat was my…" in phase 1.
    for (const required of ['the', 'a', 'I', 'to', 'was', 'said', 'you', 'my']) {
      expect(phase1, `phase 1 missing ${required}`).toContain(required);
    }
  });

  it('each phase introduces a manageable batch (≤ 8 tricky words)', () => {
    // Architecture review said 3–5 per stage; allow up to 8 for the phase-1
    // bootstrapping batch which has to seed early reading.
    for (let p = 1; p <= 8; p++) {
      const n = getTrickyWordsForPhase(p).length;
      expect(n, `phase ${p} has ${n} tricky words — cognitive load too high`).toBeLessThanOrEqual(
        8,
      );
    }
  });

  it('regular + tricky parts together cover every letter of the word', () => {
    for (const t of TRICKY_WORDS) {
      const parts = [...t.regular, ...t.tricky];
      const concatenated = parts.join('').toLowerCase();
      const wordLetters = t.word.toLowerCase();
      // The parts should produce the same multiset of letters as the word.
      expect(
        concatenated.split('').sort().join(''),
        `${t.word}: regular+tricky parts (${parts.join('+')}) don't cover the word`,
      ).toBe(wordLetters.split('').sort().join(''));
    }
  });
});

describe('lookup helpers', () => {
  it('getTrickyWord is case-insensitive and returns null for non-tricky words', () => {
    expect(getTrickyWord('was')?.word).toBe('was');
    expect(getTrickyWord('Was')?.word).toBe('was');
    expect(getTrickyWord('WAS')?.word).toBe('was');
    expect(getTrickyWord('cat')).toBeNull();
  });

  it('isTrickyWord is a boolean shortcut', () => {
    expect(isTrickyWord('the')).toBe(true);
    expect(isTrickyWord('cat')).toBe(false);
    expect(isTrickyWord('')).toBe(false);
  });

  it('getTrickyWordsUpToPhase is cumulative', () => {
    const upTo3 = getTrickyWordsUpToPhase(3);
    const ids = upTo3.map((t) => t.word);
    expect(ids).toContain('the'); // phase 1
    expect(ids).toContain('have'); // phase 2
    expect(ids).toContain('are'); // phase 3
    expect(ids).not.toContain('they'); // phase 4
  });

  it('returns a fresh array (mutating the result does not corrupt the data)', () => {
    const first = getTrickyWordsForPhase(1);
    first.pop();
    expect(getTrickyWordsForPhase(1).length).toBeGreaterThan(first.length);
  });
});

describe('highlightTrickyParts', () => {
  it("splits 'said' into s · ai · d with ai marked tricky", () => {
    expect(highlightTrickyParts('said')).toEqual([
      { text: 's', isTricky: false },
      { text: 'ai', isTricky: true },
      { text: 'd', isTricky: false },
    ]);
  });

  it("marks both 'a' and 's' as tricky in 'was' (two irregular phonemes)", () => {
    expect(highlightTrickyParts('was')).toEqual([
      { text: 'w', isTricky: false },
      { text: 'a', isTricky: true },
      { text: 's', isTricky: true },
    ]);
  });

  it("marks 'one' as a single tricky chunk (whole-word irregular)", () => {
    expect(highlightTrickyParts('one')).toEqual([{ text: 'one', isTricky: true }]);
  });

  it('every tricky word in the list round-trips: reconstructed text matches the word', () => {
    for (const t of TRICKY_WORDS) {
      const segs = highlightTrickyParts(t.word);
      expect(segs).not.toBeNull();
      const reconstructed = segs.map((s) => s.text).join('');
      expect(reconstructed.toLowerCase(), `${t.word} reconstruction mismatch`).toBe(
        t.word.toLowerCase(),
      );
    }
  });

  it('returns null for non-tricky words', () => {
    expect(highlightTrickyParts('cat')).toBeNull();
  });
});

describe('progression integration', () => {
  it('getTrickyWordsForCurrentStage returns the phase-1 batch for a fresh learner', () => {
    // Empty snapshot → recommended stage is cvc-a (phase 1) → phase-1 tricky words.
    const tricky = getTrickyWordsForCurrentStage({});
    const words = tricky.map((t) => t.word);
    expect(words).toContain('the');
    expect(words).toContain('was');
  });
});
