import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/modules/store.js';
import {
  buildPrimaryQuickCheck,
  applyPrimaryQuickCheckResults,
  QUICK_CHECK_PER_DOMAIN,
  __TEST__,
} from '../src/modules/primaryQuickCheck.js';

beforeEach(() => {
  store.reset();
});

describe('buildPrimaryQuickCheck — diagnostic bank assembly', () => {
  it('returns 3 grammar + 3 vocab items for a known grade', () => {
    const check = buildPrimaryQuickCheck('P4');
    expect(check.grade).toBe('P4');
    expect(check.items).toHaveLength(QUICK_CHECK_PER_DOMAIN * 2);
    const sources = check.items.map(i => i.source);
    expect(sources.filter(s => s === 'grammarMcq')).toHaveLength(QUICK_CHECK_PER_DOMAIN);
    expect(sources.filter(s => s === 'vocabMcq')).toHaveLength(QUICK_CHECK_PER_DOMAIN);
  });

  it('orders grammar before vocab so the flow opens with familiar territory', () => {
    const check = buildPrimaryQuickCheck('P3');
    expect(check.items[0].source).toBe('grammarMcq');
    expect(check.items[QUICK_CHECK_PER_DOMAIN].source).toBe('vocabMcq');
  });

  it('each item carries a question, four choices, and the correct answer', () => {
    const check = buildPrimaryQuickCheck('P5');
    for (const item of check.items) {
      expect(typeof item.q).toBe('string');
      expect(item.q.length).toBeGreaterThan(0);
      expect(Array.isArray(item.choices)).toBe(true);
      expect(item.choices.length).toBeGreaterThanOrEqual(2);
      expect(item.choices).toContain(item.answer);
      expect(typeof item.category).toBe('string');
    }
  });

  it('every grammar item picks a distinct category (broad coverage)', () => {
    const check = buildPrimaryQuickCheck('P6');
    const cats = check.items
      .filter(i => i.source === 'grammarMcq')
      .map(i => i.category);
    expect(new Set(cats).size).toBe(cats.length);
  });

  it('is deterministic — same grade twice returns the same items', () => {
    const a = buildPrimaryQuickCheck('P2');
    const b = buildPrimaryQuickCheck('P2');
    expect(a.items.map(i => i.q)).toEqual(b.items.map(i => i.q));
  });

  it('falls back to P3 for unknown / malformed grades', () => {
    expect(__TEST__._normaliseGrade('Z9')).toBe('P3');
    expect(__TEST__._normaliseGrade(null)).toBe('P3');
    expect(__TEST__._normaliseGrade('p4')).toBe('P4'); // case-insensitive
  });
});

describe('applyPrimaryQuickCheckResults — seeds questMastery + questAttempts', () => {
  it('records each answer through questMastery so dashboards have signal', () => {
    const answers = [
      { source: 'grammarMcq', category: 'svAgreement',   correct: true,  level: 'P4' },
      { source: 'grammarMcq', category: 'connectors',    correct: false, level: 'P4' },
      { source: 'vocabMcq',   category: 'contextInference', correct: true, level: 'P4' },
    ];
    const summary = applyPrimaryQuickCheckResults(answers);
    expect(summary.total).toBe(3);
    expect(summary.correct).toBe(2);
    expect(summary.accuracy).toBeCloseTo(2 / 3, 4);

    const mastery = store.get('questMastery') || {};
    expect(typeof mastery.grammarMcq?.svAgreement).toBe('number');
    expect(typeof mastery.grammarMcq?.connectors).toBe('number');
    expect(typeof mastery.vocabMcq?.contextInference).toBe('number');
    // EMA starts at 0.5; one correct answer with alpha=0.45 should lift it.
    expect(mastery.grammarMcq.svAgreement).toBeGreaterThan(0.5);
    // One wrong should drop it below 0.5.
    expect(mastery.grammarMcq.connectors).toBeLessThan(0.5);
  });

  it('records questAttempts so Mistakes Den / Personal Best surfaces light up', () => {
    applyPrimaryQuickCheckResults([
      { source: 'grammarMcq', category: 'svAgreement', correct: false, level: 'P4' },
    ]);
    const attempts = store.get('questAttempts') || [];
    expect(attempts).toHaveLength(1);
    expect(attempts[0].quest).toBe('grammarMcq');
    expect(attempts[0].skill).toBe('svAgreement');
    expect(attempts[0].correct).toBe(false);
  });

  it('partitions weak vs strong skills for the summary card', () => {
    const summary = applyPrimaryQuickCheckResults([
      { source: 'grammarMcq', category: 'svAgreement', correct: true },
      { source: 'grammarMcq', category: 'connectors',  correct: false },
      { source: 'vocabMcq',   category: 'idiomaticExpressions', correct: false },
    ]);
    expect(summary.strongSkills.map(s => s.skill)).toEqual(['svAgreement']);
    expect(summary.weakSkills.map(s => s.skill).sort())
      .toEqual(['connectors', 'idiomaticExpressions']);
  });

  it('returns an empty summary for an empty input (no side effects)', () => {
    const summary = applyPrimaryQuickCheckResults([]);
    expect(summary.total).toBe(0);
    expect(summary.correct).toBe(0);
    expect(summary.accuracy).toBe(0);
    expect(store.get('questMastery')).toEqual({
      sentenceForge: {}, clozeCastle: {}, wordVault: {},
      stories: {}, editingQuest: {}, writingQuest: {},
      grammarMcq: {}, vocabMcq: {}, paperMode: {}, synthesisQuest: {},
    });
  });

  it('skips malformed entries without throwing', () => {
    const summary = applyPrimaryQuickCheckResults([
      null,
      { source: 'grammarMcq' },                       // no category
      { category: 'foo', correct: true },              // no source
      { source: 'grammarMcq', category: 'connectors', correct: true },
    ]);
    expect(summary.total).toBe(4); // total counts all input rows
    expect(summary.correct).toBe(1); // but only the valid one credits
    const mastery = store.get('questMastery') || {};
    expect(typeof mastery.grammarMcq?.connectors).toBe('number');
  });
});

describe('_pickPerCategory — selection helper', () => {
  it('returns at most `count` items, all from distinct categories', () => {
    const bank = [
      { category: 'a', q: '1', choices: [], answer: '' },
      { category: 'a', q: '2', choices: [], answer: '' },
      { category: 'b', q: '3', choices: [], answer: '' },
      { category: 'c', q: '4', choices: [], answer: '' },
    ];
    const picked = __TEST__._pickPerCategory(bank, 5, 'grammarMcq');
    expect(picked).toHaveLength(3);
    expect(picked.map(p => p.category)).toEqual(['a', 'b', 'c']);
    expect(picked.every(p => p.source === 'grammarMcq')).toBe(true);
  });

  it('stops at `count` even if more distinct categories are available', () => {
    const bank = [
      { category: 'a', q: '1', choices: [], answer: '' },
      { category: 'b', q: '2', choices: [], answer: '' },
      { category: 'c', q: '3', choices: [], answer: '' },
    ];
    expect(__TEST__._pickPerCategory(bank, 2, 'vocabMcq')).toHaveLength(2);
  });
});
