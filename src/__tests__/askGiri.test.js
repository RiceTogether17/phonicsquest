/**
 * Tests for Ask Giri (askGiri.js): chip generation from recent mistakes,
 * authored offline answers, and the AI rubric essay grader's line-protocol
 * parsing (aiService.gradeEssayWithRubric). No network — fetch is mocked.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => { store[key] = String(val); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

let store;
let askGiri;
let fetchMock;

beforeEach(async () => {
  localStorageMock.clear();
  vi.resetModules();
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  store = (await import('../modules/store.js')).store;
  askGiri = await import('../modules/askGiri.js');
});

function seedQuestMistake(quest, skill, when = Date.now()) {
  const attempts = store.get('questAttempts') || [];
  store.set('questAttempts', [
    { quest, skill, correct: false, timestamp: new Date(when).toISOString() },
    ...attempts,
  ]);
}

describe('buildGiriQuestionChips', () => {
  it('returns starter chips for a fresh profile', () => {
    const chips = askGiri.buildGiriQuestionChips();
    expect(chips.length).toBeGreaterThanOrEqual(3);
    for (const chip of chips) {
      expect(chip.question.toLowerCase()).toContain('explain');
      expect(['grammar', 'vocab']).toContain(chip.domain);
    }
  });

  it('builds chips from recent grammar mistakes first', () => {
    seedQuestMistake('grammarMcq', 'simplePast');
    const chips = askGiri.buildGiriQuestionChips();
    expect(chips[0].skillKey).toBe('simplePast');
    expect(chips[0].domain).toBe('grammar');
  });

  it('recognises vocabulary-quest mistakes as vocab chips', () => {
    seedQuestMistake('vocabMcq', 'contextInference');
    const chips = askGiri.buildGiriQuestionChips();
    expect(chips[0].skillKey).toBe('contextInference');
    expect(chips[0].domain).toBe('vocab');
  });

  it('dedupes repeated mistakes on the same skill', () => {
    seedQuestMistake('grammarMcq', 'articles');
    seedQuestMistake('clozeCastle', 'articles');
    const chips = askGiri.buildGiriQuestionChips();
    expect(chips.filter(c => c.skillKey === 'articles')).toHaveLength(1);
  });

  it('respects the chip limit', () => {
    for (const skill of ['articles', 'pronouns', 'svAgreement', 'simplePast', 'presentCont', 'pastCont']) {
      seedQuestMistake('grammarMcq', skill);
    }
    expect(askGiri.buildGiriQuestionChips({ limit: 4 })).toHaveLength(4);
  });
});

describe('answerChipOffline', () => {
  it('answers grammar chips from the authored tips', () => {
    const out = askGiri.answerChipOffline({ skillKey: 'articles', domain: 'grammar' });
    expect(out.rule.length).toBeGreaterThan(0);
    expect(out.example.length).toBeGreaterThan(0);
  });

  it('answers vocab chips from the category teaching fields', () => {
    const out = askGiri.answerChipOffline({ skillKey: 'contextInference', domain: 'vocab' });
    expect(out.rule.length).toBeGreaterThan(0);
    expect(out.example.length).toBeGreaterThan(0);
  });

  it('every chip it generates has a non-empty offline answer', () => {
    seedQuestMistake('grammarMcq', 'simplePast');
    seedQuestMistake('vocabMcq', 'synonymContrast');
    for (const chip of askGiri.buildGiriQuestionChips()) {
      const out = askGiri.answerChipOffline(chip);
      expect(out.rule.length, `${chip.id} rule`).toBeGreaterThan(0);
      expect(out.example.length, `${chip.id} example`).toBeGreaterThan(0);
    }
  });
});

describe('gradeEssayWithRubric', () => {
  function geminiReply(text) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ candidates: [{ content: { parts: [{ text }] } }] }),
    });
  }

  it('parses the four-dimension line protocol', async () => {
    store.set('geminiApiKey', 'test-key');
    fetchMock.mockReturnValue(geminiReply([
      'CONTENT: 3 | Good ideas with one vivid moment.',
      'ORGANISATION: 2 | The middle jumps in time — add a connector.',
      'LANGUAGE: 3 | Mostly accurate tenses.',
      'TASK: 4 | All required points covered.',
      'OVERALL: Lovely start — smooth out the middle next.',
    ].join('\n')));

    const { gradeEssayWithRubric } = await import('../modules/aiService.js');
    const out = await gradeEssayWithRubric('My story...', 4, 'Write about a rainy day');
    expect(out).not.toBeNull();
    expect(out.dimensions.content.band).toBe(3);
    expect(out.dimensions.organisation.comment).toContain('connector');
    expect(out.dimensions.taskFulfilment.band).toBe(4);
    expect(out.overall).toContain('Lovely start');
  });

  it('returns null when a dimension is missing or malformed', async () => {
    store.set('geminiApiKey', 'test-key');
    fetchMock.mockReturnValue(geminiReply('CONTENT: 3 | ok\nLANGUAGE: nine | bad'));
    const { gradeEssayWithRubric } = await import('../modules/aiService.js');
    expect(await gradeEssayWithRubric('text', 4)).toBeNull();
  });

  it('returns null without an API key and never fetches', async () => {
    const { gradeEssayWithRubric } = await import('../modules/aiService.js');
    expect(await gradeEssayWithRubric('text', 4)).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('logs the grading to the parent-visible usage log', async () => {
    store.set('geminiApiKey', 'test-key');
    fetchMock.mockReturnValue(geminiReply([
      'CONTENT: 3 | a', 'ORGANISATION: 3 | b', 'LANGUAGE: 3 | c', 'TASK: 3 | d', 'OVERALL: e',
    ].join('\n')));
    const { gradeEssayWithRubric } = await import('../modules/aiService.js');
    await gradeEssayWithRubric('text', 5);
    const log = store.get('aiUsageLog');
    expect(log).toHaveLength(1);
    expect(log[0].kind).toBe('grade');
  });
});
