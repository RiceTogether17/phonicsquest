/**
 * Skill-specific mastery (architecture review item #2).
 *
 * Until now, every attempt on a word — oral blending, decoding, segmenting,
 * spelling — collapsed into one wordStats accuracy. A child who reads `cat`
 * fluently but can't orally segment /c/-/a/-/t/ showed up as one number,
 * and adaptive review never saw the segmenting gap. These tests lock in
 * the new per-skill split:
 *
 *   1. SKILL_BY_MODE maps every phonics mode to one of the four canonical
 *      bins (oralBlend / segmenting / decoding / spelling).
 *   2. progress.recordAttempt updates BOTH wordStats (cross-skill summary,
 *      backwards-compat) AND wordSkillStats (per-skill breakdown).
 *   3. masteryEngine.getWordSkillMastery returns per-skill accuracy +
 *      fluency, with null (not zero) for skills the child hasn't practised.
 *   4. getWordMasteryBySkill surfaces every skill in one call so the
 *      dashboard can render the split without N store reads.
 *   5. The cross-skill API (getWordMastery) is unchanged — existing call
 *      sites keep working.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { store } from '../modules/store.js';
import { progress, SKILL_BY_MODE, SKILLS, getSkillForMode } from '../modules/progress.js';
import { getWordSkillMastery, getWordMasteryBySkill, getWordMastery } from '../modules/masteryEngine.js';

beforeEach(() => {
  localStorage.clear();
  store.resetStorageKey();
  store.reset();
});

afterEach(() => {
  localStorage.clear();
});

describe('SKILL_BY_MODE / getSkillForMode', () => {
  it('every phonics mode maps to one of the four canonical skill bins', () => {
    const validBins = new Set(SKILLS);
    for (const [mode, skill] of Object.entries(SKILL_BY_MODE)) {
      expect(validBins.has(skill), `mode "${mode}" → "${skill}" not in SKILLS`).toBe(true);
    }
  });

  it('groups modes by pedagogical skill, not by surface UI', () => {
    // Phonemic-awareness identification modes (first/last/middle/soundCount/
    // segment) all bin to segmenting — they're the same underlying skill.
    expect(getSkillForMode('first')).toBe('segmenting');
    expect(getSkillForMode('last')).toBe('segmenting');
    expect(getSkillForMode('middle')).toBe('segmenting');
    expect(getSkillForMode('soundCount')).toBe('segmenting');
    expect(getSkillForMode('segment')).toBe('segmenting');

    // Reading-from-print modes bin to decoding.
    expect(getSkillForMode('blend')).toBe('decoding');
    expect(getSkillForMode('classicBlend')).toBe('decoding');
    expect(getSkillForMode('hear')).toBe('decoding');

    // Oral blending is its own skill — auditory only, no print.
    expect(getSkillForMode('oralBlend')).toBe('oralBlend');

    // Sound→print mapping is spelling.
    expect(getSkillForMode('missing')).toBe('spelling');
  });

  it('returns null for unknown modes (e.g. grammar quests, sentence forge)', () => {
    expect(getSkillForMode('grammarMcq')).toBeNull();
    expect(getSkillForMode('sentenceForge')).toBeNull();
    expect(getSkillForMode(undefined)).toBeNull();
  });
});

describe('progress.recordAttempt updates per-skill stats', () => {
  it('writes both the cross-skill summary AND the per-skill breakdown', () => {
    progress.recordAttempt('cat', true,  'blend',  1500);
    progress.recordAttempt('cat', true,  'blend',  1800);
    progress.recordAttempt('cat', false, 'first',  4200);

    const wordStats     = store.get('wordStats');
    const wordSkillStats = store.get('wordSkillStats');

    // Cross-skill summary (unchanged shape — backwards compat)
    expect(wordStats.cat.attempts).toBe(3);
    expect(wordStats.cat.correct).toBe(2);

    // Per-skill split
    expect(wordSkillStats.cat.decoding.attempts).toBe(2);
    expect(wordSkillStats.cat.decoding.correct).toBe(2);
    expect(wordSkillStats.cat.segmenting.attempts).toBe(1);
    expect(wordSkillStats.cat.segmenting.correct).toBe(0);
  });

  it('skips per-skill recording when the mode does not map to a phonics skill', () => {
    progress.recordAttempt('cat', true, 'grammarMcq', 1000);
    expect(store.get('wordStats').cat.attempts).toBe(1);
    expect(store.get('wordSkillStats').cat).toBeUndefined();
  });

  it('emits a word_attempt learning event so masteryEngine.speed has data', () => {
    progress.recordAttempt('cat', true, 'blend', 1700);
    const events = store.get('learningEvents');
    const wordEvents = events.filter(e => e.eventType === 'word_attempt');
    expect(wordEvents.length).toBe(1);
    expect(wordEvents[0].meta.wordId).toBe('cat');
    expect(wordEvents[0].skill).toBe('decoding');
    expect(wordEvents[0].responseMs).toBe(1700);
  });

  it('persists the latest response time per skill for fallback fluency scoring', () => {
    progress.recordAttempt('cat', true, 'blend', 2500);
    progress.recordAttempt('cat', true, 'blend', 1900);
    expect(store.get('wordSkillStats').cat.decoding.lastResponseMs).toBe(1900);
  });
});

describe('masteryEngine.getWordSkillMastery', () => {
  it('returns nulls (not zeros) when the child has not practised this skill', () => {
    progress.recordAttempt('cat', true, 'blend', 1500);
    const seg = getWordSkillMastery('cat', 'segmenting');
    expect(seg.attempts).toBe(0);
    expect(seg.accuracy).toBeNull();
    expect(seg.fluency).toBeNull();
    expect(seg.composite).toBeNull();
  });

  it('requires MIN_ATTEMPTS before reporting accuracy (avoids early-data flapping)', () => {
    progress.recordAttempt('cat', true, 'blend', 1500);
    progress.recordAttempt('cat', true, 'blend', 1500);
    // With only 2 attempts < MIN_ATTEMPTS=3, accuracy stays null
    const dec = getWordSkillMastery('cat', 'decoding');
    expect(dec.attempts).toBe(2);
    expect(dec.accuracy).toBeNull();

    progress.recordAttempt('cat', true, 'blend', 1500);
    // 3 attempts → accuracy now reportable
    expect(getWordSkillMastery('cat', 'decoding').accuracy).toBe(1);
  });

  it('exposes the gap between two skills on the same word', () => {
    // Decoding: nailed it
    progress.recordAttempt('cat', true, 'blend',  1500);
    progress.recordAttempt('cat', true, 'blend',  1400);
    progress.recordAttempt('cat', true, 'blend',  1600);
    // Segmenting: struggling
    progress.recordAttempt('cat', false, 'first', 4200);
    progress.recordAttempt('cat', false, 'last',  4500);
    progress.recordAttempt('cat', true,  'middle', 5000);

    const split = getWordMasteryBySkill('cat');
    expect(split.decoding.accuracy).toBe(1);
    expect(split.segmenting.accuracy).toBeCloseTo(1 / 3, 5);
    expect(split.spelling.attempts).toBe(0);
    expect(split.oralBlend.attempts).toBe(0);

    // The whole point: the cross-skill summary hides this gap.
    const wholeWord = getWordMastery('cat');
    expect(wholeWord.accuracy).toBeCloseTo(4 / 6, 5);
  });

  it('fluency uses the per-skill target, not the global default', () => {
    // Decoding target = 3000ms. A 1500ms response = ~0.75 fluency.
    progress.recordAttempt('cat', true, 'blend', 1500);
    progress.recordAttempt('cat', true, 'blend', 1500);
    progress.recordAttempt('cat', true, 'blend', 1500);
    const dec = getWordSkillMastery('cat', 'decoding');
    expect(dec.fluency).toBeGreaterThan(0.7);
    expect(dec.fluency).toBeLessThanOrEqual(1);

    // Segmenting target = 5000ms. The same 1500ms response gives a higher
    // fluency score (the task is meant to take longer).
    progress.recordAttempt('cat', true, 'first', 1500);
    progress.recordAttempt('cat', true, 'first', 1500);
    progress.recordAttempt('cat', true, 'first', 1500);
    const seg = getWordSkillMastery('cat', 'segmenting');
    expect(seg.fluency).toBeGreaterThan(dec.fluency);
  });
});

describe('backward compatibility', () => {
  it('getWordMastery (cross-skill API) is unchanged for existing call sites', () => {
    progress.recordAttempt('cat', true, 'blend', 1500);
    progress.recordAttempt('cat', true, 'blend', 1500);
    progress.recordAttempt('cat', true, 'blend', 1500);
    const m = getWordMastery('cat');
    expect(m.accuracy).toBe(1);
    expect(m.composite).toBeGreaterThan(0);
  });

  it('a session that never touches the skill-aware code still works', () => {
    // Simulate the legacy path: mode unknown to SKILL_BY_MODE.
    expect(() => progress.recordAttempt('cat', true, 'mysteryMode', 1500))
      .not.toThrow();
    expect(store.get('wordStats').cat.attempts).toBe(1);
  });
});
