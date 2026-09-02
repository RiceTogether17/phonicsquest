/**
 * Mini-lesson teaching layer — data integrity and coverage.
 *
 * Guards the explicit-instruction layer:
 *  1. Every CURRICULUM stage has a phonics mini-lesson, and every lesson's
 *     guided-practice word resolves to a real words.js entry from that
 *     stage's sample words (so phoneme tiles and audio exist).
 *  2. Every grammar category in the MCQ plan has a real authored tip
 *     (not the generic fallback).
 *  3. Every vocabulary category carries the rule/example/tip teach fields.
 *  4. Every generated MCQ item explains all of its choices.
 */
import { describe, it, expect } from 'vitest';
import { CURRICULUM } from '../data/curriculum.js';
import { WORDS } from '../data/words.js';
import { PHONICS_LESSONS, getPhonicsLesson } from '../data/lessons/phonicsLessons.js';
import { GRAMMAR_TIPS } from '../data/grammarTips.js';
import { GRAMMAR_CATEGORY_KEYS } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES, VOCAB_CATEGORY_KEYS } from '../data/vocabCategories.js';
import { buildGrammarMcqLevel, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { buildVocabMcqLevel, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';

// soft_c / soft_g are as playable as any other chip type — both have their
// own MP3 in public/audio/phonemes — they just had no lesson using them
// until the soft c/g stage existed.
const VALID_CHIP_TYPES = [
  'c',
  'sv',
  'lv',
  'd',
  'bl',
  'se',
  'rc',
  'dp',
  'sf',
  'p',
  'soft_c',
  'soft_g',
];

describe('phonics mini-lessons', () => {
  const wordSet = new Set(WORDS.map((w) => w.word));

  it('covers every curriculum stage', () => {
    for (const stage of CURRICULUM) {
      expect(PHONICS_LESSONS[stage.id], `stage ${stage.id} should have a mini-lesson`).toBeTruthy();
    }
  });

  it('has no orphan lessons for removed stages', () => {
    const stageIds = new Set(CURRICULUM.map((s) => s.id));
    for (const key of Object.keys(PHONICS_LESSONS)) {
      expect(stageIds.has(key), `lesson ${key} should match a curriculum stage`).toBe(true);
    }
  });

  it.each(Object.entries(PHONICS_LESSONS))('lesson %s is well-formed', (stageId, lesson) => {
    const stage = CURRICULUM.find((s) => s.id === stageId);

    expect(lesson.headline).toEqual(expect.any(String));
    expect(lesson.headline.length).toBeGreaterThan(5);
    expect(lesson.headline.length).toBeLessThanOrEqual(60);

    expect(Array.isArray(lesson.script)).toBe(true);
    expect(lesson.script.length).toBeGreaterThanOrEqual(2);
    expect(lesson.script.length).toBeLessThanOrEqual(4);
    for (const line of lesson.script) {
      expect(line.length).toBeGreaterThan(10);
      expect(line.length).toBeLessThanOrEqual(140);
    }

    // Guided-practice word must exist in the word bank (tiles + audio)
    // AND belong to the stage's own sample words (pattern-appropriate).
    expect(
      wordSet.has(lesson.weDoWord),
      `${stageId}: weDoWord "${lesson.weDoWord}" missing from WORDS`,
    ).toBe(true);
    expect(stage.sampleWords).toContain(lesson.weDoWord);

    // Sound chips must use playable phoneme types.
    for (const chip of lesson.soundChips || []) {
      expect(chip.g).toEqual(expect.any(String));
      expect(VALID_CHIP_TYPES).toContain(chip.type);
      expect(chip.label).toEqual(expect.any(String));
    }

    expect(Array.isArray(lesson.confusions)).toBe(true);
    expect(lesson.confusions.length).toBeLessThanOrEqual(2);
  });

  it('getPhonicsLesson returns null for unknown stages', () => {
    expect(getPhonicsLesson('not-a-stage')).toBeNull();
    expect(getPhonicsLesson('cvc-a')).toBe(PHONICS_LESSONS['cvc-a']);
  });
});

describe('grammar tip coverage', () => {
  it('has an authored tip for every grammar MCQ category', () => {
    for (const category of GRAMMAR_CATEGORY_KEYS) {
      const tip = GRAMMAR_TIPS[category];
      expect(tip, `GRAMMAR_TIPS should cover "${category}"`).toBeTruthy();
      expect(tip.rule.length).toBeGreaterThan(20);
      expect(tip.example.length).toBeGreaterThan(10);
    }
  });
});

describe('vocabulary teach fields', () => {
  it('every vocab category carries rule/example/tip', () => {
    for (const key of VOCAB_CATEGORY_KEYS) {
      const cat = VOCAB_CATEGORIES[key];
      expect(cat.rule, `${key} should have a rule`).toEqual(expect.any(String));
      expect(cat.example, `${key} should have an example`).toEqual(expect.any(String));
      expect(cat.tip, `${key} should have a tip`).toEqual(expect.any(String));
    }
  });
});

describe('per-choice explanations cover the full banks', () => {
  it('every grammar MCQ item explains every choice', () => {
    for (const level of GRAMMAR_MCQ_LEVELS) {
      for (const item of buildGrammarMcqLevel(level)) {
        expect(item.optionExplanations, `${item.id} should have optionExplanations`).toBeTruthy();
        for (const choice of item.choices) {
          expect(item.optionExplanations[choice], `${item.id} should explain "${choice}"`).toEqual(
            expect.any(String),
          );
        }
      }
    }
  });

  it('every vocab MCQ item explains every choice', () => {
    for (const level of VOCAB_MCQ_LEVELS) {
      for (const item of buildVocabMcqLevel(level)) {
        expect(item.optionExplanations, `${item.id} should have optionExplanations`).toBeTruthy();
        for (const choice of item.choices) {
          expect(item.optionExplanations[choice], `${item.id} should explain "${choice}"`).toEqual(
            expect.any(String),
          );
        }
      }
    }
  });
});
