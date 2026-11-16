import { describe, it, expect } from 'vitest';
import { CLASS_SENTENCE_SETS, classSentenceSet } from '../data/classSentences.js';
import { STORY_PHASES, classifyWord, cleanToken } from '../modules/decodability.js';

describe('class sentences', () => {
  it('has one set per phase, in the order the phases are taught', () => {
    const order = STORY_PHASES.map((p) => p.id);
    const phases = CLASS_SENTENCE_SETS.map((s) => s.phase);
    expect(new Set(phases).size).toBe(phases.length);
    for (const p of phases) expect(order).toContain(p);
    const positions = phases.map((p) => order.indexOf(p));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(classSentenceSet('short-a')?.sentences.length).toBeGreaterThan(0);
    expect(classSentenceSet('nope')).toBeNull();
  });

  it('gives every sentence questions with answers and a prompt to make a new one', () => {
    for (const set of CLASS_SENTENCE_SETS) {
      expect(set.label).toBeTruthy();
      expect(set.sentences.length).toBeGreaterThanOrEqual(4);
      for (const s of set.sentences) {
        expect(s.text).toMatch(/^[A-Z].*[.!?]$/);
        expect(s.questions.length).toBeGreaterThanOrEqual(2);
        for (const q of s.questions) {
          expect(q.q).toMatch(/\?$/);
          expect(q.a.trim()).not.toBe('');
        }
        expect(s.change.trim()).not.toBe('');
      }
    }
  });

  it('only asks a class to read words its phase has taught', () => {
    const offenders = [];
    for (const set of CLASS_SENTENCE_SETS) {
      const story = { phase: set.phase, allowedHFWTier: set.hfwTier, pages: [] };
      for (const s of set.sentences) {
        for (const token of s.text.split(/\s+/)) {
          const clean = cleanToken(token);
          if (!clean) continue;
          const { status } = classifyWord(clean, story, new Set(), new Set());
          if (status === 'stretch') offenders.push(`${set.phase}: "${clean}" in "${s.text}"`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
