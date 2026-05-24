import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { store } from '../src/modules/store.js';
import {
  getRecentMistakes,
  getMistakesDenSummary,
  timeAgo,
  MISTAKES_LOOKBACK_DAYS,
} from '../src/modules/mistakesDen.js';

const NOW = new Date(2026, 4, 23, 9, 0, 0); // 2026-05-23 09:00
const DAY = 86_400_000;

function wordEntry({ wordId, mode = 'blend', correct = false, daysAgo = 0 }) {
  return {
    wordId,
    mode,
    correct,
    timestamp: new Date(NOW.getTime() - daysAgo * DAY).toISOString(),
  };
}

function questEntry({ quest, skill, correct = false, daysAgo = 0 }) {
  return {
    quest,
    skill,
    correct,
    responseMs: null,
    level: null,
    timestamp: new Date(NOW.getTime() - daysAgo * DAY).toISOString(),
  };
}

describe('Mistakes Den — recent-mistake aggregation', () => {
  beforeEach(() => {
    store.reset();
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns an empty list when there are no mistakes', () => {
    expect(getRecentMistakes()).toEqual([]);
    expect(getMistakesDenSummary()).toEqual({ count: 0, mistakes: [], byModule: {} });
  });

  it('pulls wrong wordHistory entries within the lookback window', () => {
    store.set('wordHistory', [
      wordEntry({ wordId: 'cat', mode: 'blend', daysAgo: 1 }),
      wordEntry({ wordId: 'hat', mode: 'blend', correct: true, daysAgo: 1 }), // excluded — correct
      wordEntry({ wordId: 'mat', mode: 'blend', daysAgo: 10 }),               // excluded — too old
    ]);
    const mistakes = getRecentMistakes();
    expect(mistakes).toHaveLength(1);
    expect(mistakes[0].label).toBe('cat');
    expect(mistakes[0].moduleKey).toBe('blend');
    expect(mistakes[0].kind).toBe('word');
  });

  it('pulls wrong questAttempts within the lookback window', () => {
    store.set('questAttempts', [
      questEntry({ quest: 'grammarMcq', skill: 'tense', daysAgo: 2 }),
      questEntry({ quest: 'wordVault', skill: 'collocation', correct: true, daysAgo: 0 }), // excluded
      questEntry({ quest: 'clozeCastle', skill: 'connectorLogic', daysAgo: 30 }),          // excluded
    ]);
    const mistakes = getRecentMistakes();
    expect(mistakes).toHaveLength(1);
    expect(mistakes[0].kind).toBe('quest');
    expect(mistakes[0].moduleKey).toBe('grammarMcq');
    expect(mistakes[0].label).toBe('Tense');
  });

  it('combines word + quest sources and sorts newest first', () => {
    store.set('wordHistory', [wordEntry({ wordId: 'cat', daysAgo: 3 })]);
    store.set('questAttempts', [questEntry({ quest: 'grammarMcq', skill: 'tense', daysAgo: 1 })]);
    const mistakes = getRecentMistakes();
    expect(mistakes).toHaveLength(2);
    expect(mistakes[0].kind).toBe('quest');   // newer
    expect(mistakes[1].kind).toBe('word');    // older
  });

  it('dedupes repeated mistakes on the same (kind, key) into one row with a count', () => {
    store.set('wordHistory', [
      wordEntry({ wordId: 'cat', mode: 'blend', daysAgo: 1 }),
      wordEntry({ wordId: 'cat', mode: 'blend', daysAgo: 2 }),
      wordEntry({ wordId: 'cat', mode: 'blend', daysAgo: 3 }),
    ]);
    const mistakes = getRecentMistakes();
    expect(mistakes).toHaveLength(1);
    expect(mistakes[0].count).toBe(3);
  });

  it('keeps the same word in different modes as separate rows', () => {
    store.set('wordHistory', [
      wordEntry({ wordId: 'cat', mode: 'blend', daysAgo: 1 }),
      wordEntry({ wordId: 'cat', mode: 'hear',  daysAgo: 1 }),
    ]);
    const mistakes = getRecentMistakes();
    expect(mistakes).toHaveLength(2);
    expect(mistakes.map(m => m.moduleKey).sort()).toEqual(['blend', 'hear']);
  });

  it('honours a custom days window', () => {
    store.set('wordHistory', [
      wordEntry({ wordId: 'cat', daysAgo: 1 }),
      wordEntry({ wordId: 'hat', daysAgo: 14 }),
    ]);
    expect(getRecentMistakes({ days: 30 })).toHaveLength(2);
    expect(getRecentMistakes({ days: 2 })).toHaveLength(1);
  });

  it('byModule summary groups mistakes by parent module', () => {
    store.set('wordHistory', [
      wordEntry({ wordId: 'cat', mode: 'blend', daysAgo: 1 }),
      wordEntry({ wordId: 'hat', mode: 'blend', daysAgo: 2 }),
      wordEntry({ wordId: 'sit', mode: 'hear',  daysAgo: 1 }),
    ]);
    store.set('questAttempts', [
      questEntry({ quest: 'grammarMcq', skill: 'tense', daysAgo: 1 }),
    ]);
    const summary = getMistakesDenSummary();
    expect(summary.count).toBe(4);
    expect(summary.byModule).toEqual({
      blend: 2,
      hear: 1,
      grammarMcq: 1,
    });
  });

  it('every row carries a navigation target for known modes/quests', () => {
    store.set('wordHistory', [wordEntry({ wordId: 'cat', mode: 'blend', daysAgo: 0 })]);
    store.set('questAttempts', [questEntry({ quest: 'wordVault', skill: 'collocation', daysAgo: 0 })]);
    const mistakes = getRecentMistakes();
    expect(mistakes.find(m => m.moduleKey === 'blend').target).toBe('blend');
    expect(mistakes.find(m => m.moduleKey === 'wordVault').target).toBe('word-vault');
  });

  it('lookback constant matches the parent-dashboard 7-day window', () => {
    expect(MISTAKES_LOOKBACK_DAYS).toBe(7);
  });
});

describe('timeAgo helper', () => {
  it('returns "today" for the same day', () => {
    expect(timeAgo(NOW.getTime() - 1000, NOW.getTime())).toBe('today');
  });

  it('returns "yesterday" for ~1 day ago', () => {
    expect(timeAgo(NOW.getTime() - 1.5 * DAY, NOW.getTime())).toBe('yesterday');
  });

  it('returns "N days ago" for older timestamps', () => {
    expect(timeAgo(NOW.getTime() - 5.2 * DAY, NOW.getTime())).toBe('5 days ago');
  });

  it('returns empty string for invalid timestamps', () => {
    expect(timeAgo(NaN, NOW.getTime())).toBe('');
  });
});
