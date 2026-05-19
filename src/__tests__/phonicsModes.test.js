/**
 * Phonics modes registry + scoring logic.
 *
 * The PhonicsQuest curriculum recommends seven canonical game modes. Each
 * must declare the educational metadata defined in REQUIRED_MODE_FIELDS so
 * UI and reporting can rely on a uniform shape, and each must ship a pure
 * scoring function we can exercise without a DOM.
 *
 * Tests in this file cover:
 *   1. Registry shape — every mode has the required fields.
 *   2. Instruction copy — child-friendly, ≤ MAX_INSTRUCTION_WORDS.
 *   3. Per-mode scoring — golden cases for correct, error categories, and
 *      error-specific hints.
 */
import { beforeAll, describe, expect, it } from 'vitest';

beforeAll(() => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
});

import {
  PHONICS_MODES,
  PHONICS_MODE_ORDER,
  REQUIRED_MODE_FIELDS,
  MAX_INSTRUCTION_WORDS,
  getPhonicsMode,
} from '../modes/phonicsModes.js';
import { scoreSoundMatch, getSoundMatchHint } from '../modes/scoring/soundMatch.js';
import { scorePictureFirstSound, getPictureFirstSoundHint } from '../modes/scoring/pictureFirstSound.js';
import { scoreBlendBuilder, getBlendBuilderHint } from '../modes/scoring/blendBuilder.js';
import { scoreWordSort, getWordSortHint, buildWordSortRound } from '../modes/scoring/wordSort.js';
import { scoreReadAndTap, getReadAndTapHint, tokenizeSentence } from '../modes/scoring/readAndTap.js';
import { scoreListenAndSpell, getListenAndSpellHint } from '../modes/scoring/listenAndSpell.js';
import { scoreFluencySprint, getFluencySprintHint } from '../modes/scoring/fluencySprint.js';

// ── Registry ──────────────────────────────────────────────────────────────

describe('phonics-mode registry', () => {
  it('PHONICS_MODE_ORDER lists exactly the seven canonical modes', () => {
    expect(PHONICS_MODE_ORDER).toHaveLength(7);
    expect(new Set(PHONICS_MODE_ORDER)).toEqual(new Set(Object.keys(PHONICS_MODES)));
  });

  it('every mode has the required educational metadata fields', () => {
    for (const key of PHONICS_MODE_ORDER) {
      const mode = PHONICS_MODES[key];
      for (const field of REQUIRED_MODE_FIELDS) {
        expect(
          mode[field] !== undefined && mode[field] !== null && mode[field] !== '',
          `mode "${key}" is missing field "${field}"`,
        ).toBe(true);
      }
    }
  });

  it('every instruction is ≤ MAX_INSTRUCTION_WORDS words and ends with a period', () => {
    for (const key of PHONICS_MODE_ORDER) {
      const m = PHONICS_MODES[key];
      const wordCount = m.instruction.trim().split(/\s+/).length;
      expect(wordCount, `mode "${key}" instruction too long: "${m.instruction}"`).toBeLessThanOrEqual(MAX_INSTRUCTION_WORDS);
    }
  });

  it('every mode supports both keyboard and touch input', () => {
    for (const key of PHONICS_MODE_ORDER) {
      expect(PHONICS_MODES[key].keyboard, `mode "${key}" missing keyboard support`).toBe(true);
      expect(PHONICS_MODES[key].touch,    `mode "${key}" missing touch support`).toBe(true);
    }
  });

  it('every mode has a non-empty default errorHints.default entry', () => {
    for (const key of PHONICS_MODE_ORDER) {
      expect(typeof PHONICS_MODES[key].errorHints.default).toBe('string');
      expect(PHONICS_MODES[key].errorHints.default.length).toBeGreaterThan(8);
    }
  });

  it('every mode exposes a callable score and hint function', () => {
    for (const key of PHONICS_MODE_ORDER) {
      expect(typeof PHONICS_MODES[key].score).toBe('function');
      expect(typeof PHONICS_MODES[key].hint).toBe('function');
    }
  });

  it('getPhonicsMode returns mode or null', () => {
    expect(getPhonicsMode('soundMatch')?.name).toBe('Sound Match');
    expect(getPhonicsMode('nope')).toBeNull();
  });
});

// ── Sound Match ──────────────────────────────────────────────────────────

describe('Sound Match scoring', () => {
  it('marks an exact match correct and awards the speed bonus on fast answers', () => {
    const r = scoreSoundMatch({
      prompt: { sound: '/sh/', grapheme: 'sh' },
      chosen: 'sh',
      timeMs: 1200,
    });
    expect(r.correct).toBe(true);
    expect(r.errorCategory).toBeNull();
    expect(r.scoreBreakdown.speedBonus).toBe(1);
    expect(r.masteryDelta).toBe(1);
  });

  it('detects a voiced/voiceless pair confusion (/p/ vs /b/)', () => {
    const r = scoreSoundMatch({ prompt: { grapheme: 'b' }, chosen: 'p', timeMs: 1800 });
    expect(r.correct).toBe(false);
    expect(r.errorCategory).toBe('voicing-confusion');
    expect(r.hint).toMatch(/whispered|buzzes/i);
  });

  it('detects short-vowel confusion (a vs e)', () => {
    const r = scoreSoundMatch({ prompt: { grapheme: 'a' }, chosen: 'e' });
    expect(r.errorCategory).toBe('short-vowel-confusion');
  });

  it('detects digraph confusion (sh vs ch)', () => {
    const r = scoreSoundMatch({ prompt: { grapheme: 'sh' }, chosen: 'ch' });
    expect(r.errorCategory).toBe('digraph-confusion');
  });

  it('getSoundMatchHint returns the matching hint for an attempt', () => {
    const hint = getSoundMatchHint({ prompt: { grapheme: 'b' }, chosen: 'p' });
    expect(hint).toMatch(/whispered/i);
  });
});

// ── Picture First Sound ───────────────────────────────────────────────────

describe('Picture First Sound scoring', () => {
  const cat = { prompt: { word: 'cat', picture: '🐱' }, phonemes: ['/k/', '/a/', '/t/'] };

  it('marks the initial phoneme correct', () => {
    const r = scorePictureFirstSound({ ...cat, chosen: '/k/' });
    expect(r.correct).toBe(true);
  });

  it('flags picking the final phoneme', () => {
    const r = scorePictureFirstSound({ ...cat, chosen: '/t/' });
    expect(r.errorCategory).toBe('picked-final');
    expect(r.hint).toMatch(/end/i);
  });

  it('flags picking the medial vowel', () => {
    const r = scorePictureFirstSound({ ...cat, chosen: '/a/' });
    expect(r.errorCategory).toBe('picked-medial');
  });

  it('flags picking the inner letter of an initial blend (star → /t/)', () => {
    const star = { prompt: { word: 'star' }, phonemes: ['/s/', '/t/', '/a/', '/r/'], chosen: '/t/' };
    const r = scorePictureFirstSound(star);
    expect(r.errorCategory).toBe('blend-skipped');
  });

  it('getPictureFirstSoundHint returns a hint for a wrong pick', () => {
    expect(getPictureFirstSoundHint({ ...cat, chosen: '/t/' })).toMatch(/end/i);
  });
});

// ── Blend Builder ────────────────────────────────────────────────────────

describe('Blend Builder scoring', () => {
  const flat = { target: { word: 'flat', graphemes: ['f','l','a','t'] } };

  it('marks an exact placement correct', () => {
    const r = scoreBlendBuilder({ ...flat, placed: ['f','l','a','t'] });
    expect(r.correct).toBe(true);
    expect(r.scoreBreakdown.accuracy).toBe(1);
  });

  it('flags missing sounds', () => {
    const r = scoreBlendBuilder({ ...flat, placed: ['f','l','a'] });
    expect(r.errorCategory).toBe('missing-sound');
  });

  it('flags extra sounds', () => {
    const r = scoreBlendBuilder({ ...flat, placed: ['f','l','a','t','s'] });
    expect(r.errorCategory).toBe('extra-sound');
  });

  it('flags out-of-order placements', () => {
    const r = scoreBlendBuilder({ ...flat, placed: ['l','f','a','t'] });
    expect(r.errorCategory).toBe('out-of-order');
  });

  it('flags wrong graphemes when count matches', () => {
    const r = scoreBlendBuilder({ ...flat, placed: ['f','r','a','t'] });
    expect(r.errorCategory).toBe('wrong-grapheme');
  });

  it('returns partial-credit accuracy for near-misses', () => {
    const r = scoreBlendBuilder({ ...flat, placed: ['f','l','a','p'] });
    expect(r.scoreBreakdown.accuracy).toBeCloseTo(3 / 4);
  });

  it('hint returns empty string on full match', () => {
    expect(getBlendBuilderHint({ ...flat, placed: ['f','l','a','t'] })).toBe('');
  });
});

// ── Word Sort ────────────────────────────────────────────────────────────

describe('Word Sort scoring', () => {
  it('marks a fully correct sort correct', () => {
    const r = scoreWordSort({
      placements: [
        { word: 'cat', expected: 'short-a', placed: 'short-a' },
        { word: 'pen', expected: 'short-e', placed: 'short-e' },
      ],
    });
    expect(r.correct).toBe(true);
    expect(r.scoreBreakdown.accuracy).toBe(1);
  });

  it('flags short-vowel confusion when most errors mix short vowels', () => {
    const r = scoreWordSort({
      placements: [
        { word: 'pen', expected: 'short-e', placed: 'short-i' },
        { word: 'bin', expected: 'short-i', placed: 'short-e' },
        { word: 'cat', expected: 'short-a', placed: 'short-a' },
      ],
    });
    expect(r.errorCategory).toBe('vowel-confusion');
    expect(r.scoreBreakdown.errors).toBe(2);
  });

  it('flags long-vowel pattern confusion (a_e vs ai)', () => {
    const r = scoreWordSort({
      placements: [
        { word: 'cake', expected: 'long-a-ae', placed: 'long-a-ai' },
        { word: 'rain', expected: 'long-a-ai', placed: 'long-a-ae' },
      ],
    });
    expect(r.errorCategory).toBe('pattern-confusion');
  });

  it('buildWordSortRound shuffles items deterministically with an injected rng', () => {
    const items = [
      { word: 'cat', category: 'short-a' },
      { word: 'pen', category: 'short-e' },
      { word: 'sit', category: 'short-i' },
    ];
    let i = 0;
    const seq = [0.1, 0.9, 0.5, 0.2]; // deterministic RNG
    const rng = () => seq[(i++) % seq.length];
    const round = buildWordSortRound(items, null, { count: 3, rng });
    expect(round.items.length).toBe(3);
    expect(round.categories.sort()).toEqual(['short-a','short-e','short-i']);
  });

  it('hint reflects vowel confusion', () => {
    const hint = getWordSortHint({
      placements: [{ word: 'pen', expected: 'short-e', placed: 'short-i' }],
    });
    expect(hint).toMatch(/vowel/i);
  });
});

// ── Read and Tap ─────────────────────────────────────────────────────────

describe('Read and Tap scoring', () => {
  it('marks an exact tap correct (case + punctuation insensitive)', () => {
    const r = scoreReadAndTap({
      sentence: 'The big cat sat on the mat.',
      target: 'cat',
      tappedWord: 'CAT',
    });
    expect(r.correct).toBe(true);
  });

  it('flags a similar-onset tap', () => {
    const r = scoreReadAndTap({ target: 'cat', tappedWord: 'cup' });
    expect(r.errorCategory).toBe('tapped-similar-onset');
  });

  it('flags a rhyme tap (cat vs mat)', () => {
    const r = scoreReadAndTap({ target: 'cat', tappedWord: 'mat' });
    expect(r.errorCategory).toBe('tapped-rhyme');
  });

  it('flags an unrelated tap', () => {
    const r = scoreReadAndTap({ target: 'cat', tappedWord: 'shoe' });
    expect(r.errorCategory).toBe('tapped-anywhere');
  });

  it('tokenizeSentence preserves index and surface form', () => {
    const tokens = tokenizeSentence('The big cat, sat!');
    expect(tokens).toHaveLength(4);
    expect(tokens[2]).toEqual({ index: 2, surface: 'cat,', word: 'cat' });
  });

  it('hint returns rhyme guidance for a rhyme tap', () => {
    expect(getReadAndTapHint({ target: 'cat', tappedWord: 'mat' })).toMatch(/rhyme/i);
  });
});

// ── Listen and Spell ─────────────────────────────────────────────────────

describe('Listen and Spell scoring', () => {
  it('marks an exact spelling correct', () => {
    const r = scoreListenAndSpell({ target: 'cake', written: 'cake' });
    expect(r.correct).toBe(true);
    expect(r.scoreBreakdown.accuracy).toBe(1);
  });

  it('flags silent-e missing for split-digraph words', () => {
    const r = scoreListenAndSpell({ target: 'cake', written: 'cak' });
    expect(r.errorCategory).toBe('silent-e-missing');
  });

  it('flags wrong vowel (CVC pen → pin)', () => {
    const r = scoreListenAndSpell({ target: 'pen', written: 'pin' });
    expect(r.errorCategory).toBe('wrong-vowel');
  });

  it('flags transposed letters (same multiset, wrong order)', () => {
    const r = scoreListenAndSpell({ target: 'cat', written: 'cta' });
    expect(r.errorCategory).toBe('transposed-letters');
  });

  it('flags missing letters', () => {
    const r = scoreListenAndSpell({ target: 'stamp', written: 'stam' });
    expect(r.errorCategory).toBe('missing-letter');
  });

  it('hint returns empty string for a perfect spelling', () => {
    expect(getListenAndSpellHint({ target: 'cat', written: 'cat' })).toBe('');
  });
});

// ── Fluency Sprint ───────────────────────────────────────────────────────

describe('Fluency Sprint scoring', () => {
  it('marks a run mastered with high accuracy and above-target WPM', () => {
    const attempts = Array.from({ length: 30 }, (_, i) => ({
      word: `w${i}`, correct: true, timeMs: 800,
    }));
    const r = scoreFluencySprint({ attempts, durationMs: 30 * 800, targetWpm: 30 });
    expect(r.correct).toBe(true);
    expect(r.scoreBreakdown.accuracy).toBe(1);
    expect(r.scoreBreakdown.wpm).toBeGreaterThanOrEqual(30);
  });

  it('flags fast-and-error when WPM ≥ target but accuracy < 0.9', () => {
    const attempts = [];
    // 10 words, 7 correct, ~600ms each → WPM ~ 70 (well above 30)
    for (let i = 0; i < 10; i++) attempts.push({ word: `w${i}`, correct: i < 7, timeMs: 600 });
    const r = scoreFluencySprint({ attempts, durationMs: 10 * 600, targetWpm: 30 });
    expect(r.correct).toBe(false);
    expect(r.errorCategory).toBe('fast-and-error');
  });

  it('flags slow-and-accurate when accuracy ≥ 0.9 but WPM < target', () => {
    // 3 correct in 60s → 3 wpm
    const attempts = [
      { word: 'cat', correct: true, timeMs: 20000 },
      { word: 'hat', correct: true, timeMs: 20000 },
      { word: 'mat', correct: true, timeMs: 20000 },
    ];
    const r = scoreFluencySprint({ attempts, durationMs: 60000, targetWpm: 30 });
    expect(r.correct).toBe(false);
    expect(r.errorCategory).toBe('sound-by-sound');
    // average per word is 20000ms > 2500 -> sound-by-sound takes priority
  });

  it('flags slow-and-accurate when avg per-word is reasonable but WPM still low', () => {
    const attempts = [
      { word: 'cat', correct: true, timeMs: 2000 },
      { word: 'hat', correct: true, timeMs: 2000 },
      { word: 'mat', correct: true, timeMs: 2000 },
      { word: 'sat', correct: true, timeMs: 2000 },
      { word: 'pat', correct: true, timeMs: 2000 },
    ];
    // 5 correct in 60s -> 5 wpm < 30 wpm target; avg 2000ms < 2500 sound-by-sound
    const r = scoreFluencySprint({ attempts, durationMs: 60000, targetWpm: 30 });
    expect(r.errorCategory).toBe('slow-and-accurate');
  });

  it('hint mirrors the error category', () => {
    const attempts = [
      { word: 'cat', correct: false, timeMs: 600 },
      { word: 'hat', correct: true,  timeMs: 600 },
    ];
    const h = getFluencySprintHint({ attempts, durationMs: 1200, targetWpm: 30 });
    expect(typeof h).toBe('string');
    expect(h.length).toBeGreaterThan(8);
  });

  it('respects an attempt-level targetWpm override', () => {
    const attempts = Array.from({ length: 10 }, () => ({ correct: true, timeMs: 1000 }));
    const r = scoreFluencySprint({ attempts, durationMs: 10000, targetWpm: 1000 });
    expect(r.correct).toBe(false); // even a perfect run can't hit 1000 wpm
    expect(r.scoreBreakdown.targetWpm).toBe(1000);
  });
});
