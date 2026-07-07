/**
 * Tests for the AI guardrails layer (aiGuardrails.js) and the guarded
 * aiService helpers built on it. All Gemini calls are mocked — no network.
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

describe('aiGuardrails', () => {
  let guardrails;
  let store;
  let fetchMock;

  beforeEach(async () => {
    localStorageMock.clear();
    vi.resetModules();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    store = (await import('../modules/store.js')).store;
    guardrails = await import('../modules/aiGuardrails.js');
  });

  function geminiReply(text) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ candidates: [{ content: { parts: [{ text }] } }] }),
    });
  }

  describe('sanitizeAiText', () => {
    it('strips HTML tags', () => {
      expect(guardrails.sanitizeAiText('Use <b>an</b> before vowels')).toBe('Use an before vowels');
    });

    it('strips URLs', () => {
      expect(guardrails.sanitizeAiText('See https://example.com for more and www.evil.com too'))
        .toBe('See for more and too');
    });

    it('strips markdown remnants', () => {
      expect(guardrails.sanitizeAiText('**Rule**: use `an` _here_')).toBe('Rule: use an here');
    });

    it('caps very long replies at a word boundary with an ellipsis', () => {
      const long = 'word '.repeat(400);
      const out = guardrails.sanitizeAiText(long);
      expect(out.length).toBeLessThanOrEqual(701);
      expect(out.endsWith('…')).toBe(true);
    });

    it('returns empty string for non-string input', () => {
      expect(guardrails.sanitizeAiText(null)).toBe('');
      expect(guardrails.sanitizeAiText(undefined)).toBe('');
      expect(guardrails.sanitizeAiText(42)).toBe('');
    });
  });

  describe('canCallAi / daily cap', () => {
    it('is false without an API key', () => {
      expect(guardrails.canCallAi()).toBe(false);
    });

    it('is true with a key and no usage', () => {
      store.set('geminiApiKey', 'test-key');
      expect(guardrails.canCallAi()).toBe(true);
    });

    it('is false once the daily cap is reached, and resets the next day', () => {
      store.set('geminiApiKey', 'test-key');
      const today = new Date('2026-06-10T10:00:00');
      for (let i = 0; i < guardrails.DAILY_AI_CALL_CAP; i++) {
        guardrails.logAiUse('explain', `q${i}`, today);
      }
      expect(guardrails.canCallAi(today)).toBe(false);
      expect(guardrails.canCallAi(new Date('2026-06-11T10:00:00'))).toBe(true);
    });
  });

  describe('logAiUse', () => {
    it('records kind, date and a truncated summary', () => {
      guardrails.logAiUse('hint', 'x'.repeat(300), new Date('2026-06-10T10:00:00'));
      const log = store.get('aiUsageLog');
      expect(log).toHaveLength(1);
      expect(log[0].kind).toBe('hint');
      expect(log[0].date).toBe('2026-06-10');
      expect(log[0].summary.length).toBeLessThanOrEqual(120);
    });

    it('caps the log length', () => {
      for (let i = 0; i < 150; i++) guardrails.logAiUse('explain', `q${i}`);
      expect(store.get('aiUsageLog').length).toBeLessThanOrEqual(100);
    });
  });

  describe('askGiriConstrained', () => {
    it('returns null and does not fetch without a key', async () => {
      const out = await guardrails.askGiriConstrained('explain', 'Why is the sky blue?');
      expect(out).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('prefixes the Giri persona and sanitises the reply', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('Use <b>"an"</b> before vowel sounds! See https://x.com'));

      const out = await guardrails.askGiriConstrained('explain', 'Explain a vs an.');
      expect(out).toBe('Use "an" before vowel sounds! See');

      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      const prompt = body.contents[0].parts[0].text;
      expect(prompt.startsWith(guardrails.GIRI_SYSTEM_PREFIX)).toBe(true);
      expect(prompt).toContain('Explain a vs an.');
    });

    it('caps temperature at 0.3', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('ok'));
      await guardrails.askGiriConstrained('explain', 'task', { temperature: 0.9 });
      const body = JSON.parse(fetchMock.mock.calls[0][1].body);
      expect(body.generationConfig.temperature).toBeLessThanOrEqual(0.3);
    });

    it('logs usage for the parent dashboard', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('ok'));
      await guardrails.askGiriConstrained('hint', 'task text', { logSummary: 'Hint: question one' });
      const log = store.get('aiUsageLog');
      expect(log).toHaveLength(1);
      expect(log[0].kind).toBe('hint');
      expect(log[0].summary).toBe('Hint: question one');
    });

    it('returns null on a failed request', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(Promise.resolve({ ok: false }));
      const out = await guardrails.askGiriConstrained('explain', 'task');
      expect(out).toBeNull();
    });

    it('stops calling once the daily cap is reached', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('ok'));
      for (let i = 0; i < guardrails.DAILY_AI_CALL_CAP + 5; i++) {
        await guardrails.askGiriConstrained('explain', `task ${i}`);
      }
      expect(fetchMock.mock.calls.length).toBe(guardrails.DAILY_AI_CALL_CAP);
    });
  });

  describe('aiService guarded helpers', () => {
    it('explainMistake builds an MCQ prompt with the choices and verdict', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('Because "an" goes before vowel sounds.'));
      const { explainMistake } = await import('../modules/aiService.js');

      const out = await explainMistake({
        question: 'I ate ___ apple.',
        options: ['a', 'an', 'the', 'some'],
        chosen: 'a',
        correct: 'an',
        authoredExplanation: 'Use an before vowel sounds.',
        level: 'P2',
      });
      expect(out).toBe('Because "an" goes before vowel sounds.');

      const prompt = JSON.parse(fetchMock.mock.calls[0][1].body).contents[0].parts[0].text;
      expect(prompt).toContain('a / an / the / some');
      expect(prompt).toContain('wrong (correct answer: "an")');
      expect(prompt).toContain('Use an before vowel sounds.');
    });

    it('getAdaptiveHint instructs the model not to reveal the answer', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('Look at the word after the blank.'));
      const { getAdaptiveHint } = await import('../modules/aiService.js');

      const out = await getAdaptiveHint({
        question: 'I ate ___ apple.',
        options: ['a', 'an'],
        correct: 'an',
        categoryLabel: 'Articles',
        level: 'P2',
      });
      expect(out).toBe('Look at the word after the blank.');

      const prompt = JSON.parse(fetchMock.mock.calls[0][1].body).contents[0].parts[0].text;
      expect(prompt).toContain('NOT say it');
    });

    it('explainTeachBack includes exercise, student answer and correct answer', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('You used the present tense.'));
      const { explainTeachBack } = await import('../modules/aiService.js');

      const out = await explainTeachBack({
        skillLabel: 'tense consistency',
        exercise: 'Fix the grammar error in the word "pack"',
        studentAnswer: 'packs',
        correctAnswer: 'packed',
        level: 'P3',
      });
      expect(out).toBe('You used the present tense.');

      const prompt = JSON.parse(fetchMock.mock.calls[0][1].body).contents[0].parts[0].text;
      expect(prompt).toContain('tense consistency');
      expect(prompt).toContain('"packs"');
      expect(prompt).toContain('"packed"');
    });

    it('guarded helpers return null without a key', async () => {
      const { explainMistake, getAdaptiveHint, explainTeachBack } = await import('../modules/aiService.js');
      expect(await explainMistake({ question: 'q', options: [], chosen: 'a', correct: 'b' })).toBeNull();
      expect(await getAdaptiveHint({ question: 'q', options: [], correct: 'b' })).toBeNull();
      expect(await explainTeachBack({ skillLabel: 's', exercise: 'e', studentAnswer: 'a', correctAnswer: 'b' })).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('callGemini transport', () => {
    it('sends the API key in a header, never in the URL', async () => {
      store.set('geminiApiKey', 'secret-key');
      fetchMock.mockReturnValue(geminiReply('ok'));
      const { callGemini } = await import('../modules/aiService.js');
      await callGemini('hello');

      const [url, opts] = fetchMock.mock.calls[0];
      expect(url).not.toContain('secret-key');
      expect(url).not.toContain('key=');
      expect(opts.headers['x-goog-api-key']).toBe('secret-key');
    });
  });

  describe('getWritingCoachFeedback', () => {
    it('returns null without a key and does not fetch', async () => {
      const { getWritingCoachFeedback } = await import('../modules/aiService.js');
      expect(await getWritingCoachFeedback('My draft.', 3)).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('parses findings into sanitised structure — HTML in the echoed draft is stripped', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply(
        'SENTENCE: I like <img src=x onerror=alert(1)> dogs | ISSUE: Remove the strange <b>code</b>\n' +
        'SENTENCE: He run fast | ISSUE: Use "runs" with "he"',
      ));
      const { getWritingCoachFeedback } = await import('../modules/aiService.js');

      const out = await getWritingCoachFeedback('draft', 2);
      expect(out.items).toHaveLength(2);
      expect(out.items[0].sentence).toBe('I like dogs');
      expect(out.items[0].sentence).not.toContain('<');
      expect(out.items[0].issue).toBe('Remove the strange code');
      expect(out.items[1].issue).toContain('runs');
    });

    it('returns { good } for a GOOD: reply, sanitised', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('GOOD: Well done! Visit https://evil.example for more'));
      const { getWritingCoachFeedback } = await import('../modules/aiService.js');

      const out = await getWritingCoachFeedback('draft', 2);
      expect(out.good).toBe('Well done! Visit for more');
      expect(out.good).not.toContain('http');
    });

    it('returns null for unparseable replies and logs usage for the parent dashboard', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('I refuse to follow the format.'));
      const { getWritingCoachFeedback } = await import('../modules/aiService.js');

      expect(await getWritingCoachFeedback('draft', 4)).toBeNull();
      const log = store.get('aiUsageLog');
      expect(log).toHaveLength(1);
      expect(log[0].kind).toBe('coach');
    });

    it('respects the daily cap', async () => {
      store.set('geminiApiKey', 'test-key');
      const { getWritingCoachFeedback } = await import('../modules/aiService.js');
      for (let i = 0; i < guardrails.DAILY_AI_CALL_CAP; i++) guardrails.logAiUse('explain', `q${i}`);
      expect(await getWritingCoachFeedback('draft', 2)).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });
  });

  describe('gradeSynthesisAnswer', () => {
    it('returns null without a key and does not fetch', async () => {
      const { gradeSynthesisAnswer } = await import('../modules/aiService.js');
      expect(await gradeSynthesisAnswer('a', '', 'b', [], 'c', 'Passive voice')).toBeNull();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('sanitises the feedback line', async () => {
      store.set('geminiApiKey', 'test-key');
      fetchMock.mockReturnValue(geminiReply('PARTIAL\nAlmost — check <b>tense</b> at https://evil.example'));
      const { gradeSynthesisAnswer } = await import('../modules/aiService.js');

      const out = await gradeSynthesisAnswer('a', '', 'b', [], 'c', 'Passive voice');
      expect(out.verdict).toBe('PARTIAL');
      expect(out.feedback).toBe('Almost — check tense at');
      expect(out.feedback).not.toContain('<');
      expect(out.feedback).not.toContain('http');
    });
  });
});
