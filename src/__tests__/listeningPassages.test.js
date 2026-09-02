/**
 * Data integrity for the dedicated listening-comprehension bank
 * (src/data/listeningPassages.js). Every passage must be playable by TTS
 * and every question auto-markable.
 */
import { describe, it, expect } from 'vitest';
import { LISTENING_PASSAGES } from '../data/listeningPassages.js';

const LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const KINDS = ['story', 'announcement', 'conversation', 'instruction', 'news'];

/** Generous per-level script word bounds (listening, not reading, lengths). */
const SCRIPT_BOUNDS = {
  P1: [40, 110],
  P2: [60, 150],
  P3: [90, 220],
  P4: [130, 260],
  P5: [170, 320],
  P6: [200, 380],
};

const wordCount = (s) => String(s).trim().split(/\s+/).length;

describe('listening passages bank', () => {
  it('has unique ids', () => {
    const ids = LISTENING_PASSAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every level with at least 4 passages', () => {
    for (const level of LEVELS) {
      const count = LISTENING_PASSAGES.filter((p) => p.level === level).length;
      expect(count, `${level} should have ≥4 passages`).toBeGreaterThanOrEqual(4);
    }
  });

  it.each(LISTENING_PASSAGES.map((p) => [p.id, p]))('%s is well-formed', (_id, p) => {
    expect(LEVELS).toContain(p.level);
    expect(KINDS).toContain(p.kind);
    expect(p.title.length).toBeGreaterThan(0);
    expect(p.script.length).toBeGreaterThan(0);

    const [min, max] = SCRIPT_BOUNDS[p.level];
    const words = wordCount(p.script);
    expect(words, `script length for ${p.id} (${words} words)`).toBeGreaterThanOrEqual(min);
    expect(words, `script length for ${p.id} (${words} words)`).toBeLessThanOrEqual(max);

    expect(Array.isArray(p.questions)).toBe(true);
    expect(p.questions.length).toBeGreaterThanOrEqual(3);

    for (const q of p.questions) {
      expect(q.q.length, `${p.id} question text`).toBeGreaterThan(0);
      expect(q.options, `${p.id} options`).toHaveLength(4);
      expect(new Set(q.options).size, `${p.id} duplicate options`).toBe(4);
      expect(q.options, `${p.id} answer must be an option`).toContain(q.answer);
      expect(q.explain.length, `${p.id} explanation`).toBeGreaterThan(0);
    }
  });

  it('keeps question counts in line with the level', () => {
    for (const p of LISTENING_PASSAGES) {
      const expected = p.level === 'P1' || p.level === 'P2' ? 3 : 4;
      expect(p.questions.length, `${p.id} question count`).toBe(expected);
    }
  });
});
