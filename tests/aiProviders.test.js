import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Bring-your-own-key AI tutor.
 *
 * PhonicsQuest has no server, so the tutor runs on a key the parent
 * supplies and the request goes straight from their browser to the
 * provider. These tests pin the parts a parent would notice going wrong:
 * the key reaching the right place, a failure being explainable rather
 * than silent, and the child seeing nothing either way.
 */

const localStorageMock = (() => {
  let data = {};
  return {
    getItem: vi.fn(k => data[k] ?? null),
    setItem: vi.fn((k, v) => { data[k] = String(v); }),
    removeItem: vi.fn(k => { delete data[k]; }),
    clear: vi.fn(() => { data = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

let store, aiService, aiConfig, providers, fetchMock;

beforeEach(async () => {
  localStorageMock.clear();
  vi.resetModules();
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  store = (await import('../src/modules/store.js')).store;
  aiService = await import('../src/modules/aiService.js');
  aiConfig = await import('../src/modules/aiConfig.js');
  providers = await import('../src/modules/aiProviders.js');
});

const okJson = (body) => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
const errJson = (status, body = {}) =>
  Promise.resolve({ ok: false, status, json: () => Promise.resolve(body) });

const geminiOk = (text) => okJson({
  candidates: [{ content: { parts: [{ text }] } }],
  usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5 },
});

function useProvider(id, key, model) {
  store.set('aiProvider', id);
  if (key) aiConfig.setApiKey(id, key);
  if (model) aiConfig.setModel(id, model);
}

describe('each provider is reachable with the parent’s own key', () => {
  it('Google sends the key as a header, never in the URL', async () => {
    useProvider('google', 'AIzaTESTKEY');
    fetchMock.mockReturnValue(geminiOk('hello'));

    expect(await aiService.callAi('hi')).toBe('hello');

    const [url, init] = fetchMock.mock.calls[0];
    // A key in a query string leaks into history, Referer and proxy logs.
    expect(url).not.toContain('AIzaTESTKEY');
    expect(init.headers['x-goog-api-key']).toBe('AIzaTESTKEY');
  });

  it('Anthropic opts in to browser access and sends the version header', async () => {
    useProvider('anthropic', 'sk-ant-TESTKEY');
    fetchMock.mockReturnValue(okJson({
      content: [{ type: 'text', text: 'hello' }],
      usage: { input_tokens: 10, output_tokens: 5 },
    }));

    expect(await aiService.callAi('hi')).toBe('hello');

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect(init.headers['x-api-key']).toBe('sk-ant-TESTKEY');
    expect(init.headers['anthropic-version']).toBe('2023-06-01');
    // Without this header the API refuses browser-origin calls outright.
    expect(init.headers['anthropic-dangerous-direct-browser-access']).toBe('true');
  });

  it('OpenAI sends a bearer token', async () => {
    useProvider('openai', 'sk-TESTKEY');
    fetchMock.mockReturnValue(okJson({
      choices: [{ message: { content: 'hello' }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 10, completion_tokens: 5 },
    }));

    expect(await aiService.callAi('hi')).toBe('hello');
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer sk-TESTKEY');
  });

  it('the on-device provider needs no key and never hits the network', async () => {
    const prompt = vi.fn().mockResolvedValue('hello from Chrome');
    vi.stubGlobal('LanguageModel', {
      availability: () => Promise.resolve('available'),
      create: () => Promise.resolve({ prompt, destroy: vi.fn() }),
    });
    store.set('aiProvider', 'chrome');

    expect(aiConfig.isTutorConfigured('chrome')).toBe(true);
    expect(await aiService.callAi('hi')).toBe('hello from Chrome');
    expect(fetchMock).not.toHaveBeenCalled();
    vi.unstubAllGlobals();
  });

  it('sends the model the parent chose, not the provider default', async () => {
    useProvider('google', 'AIzaKEY', 'gemini-2.5-pro');
    fetchMock.mockReturnValue(geminiOk('ok'));
    await aiService.callAi('hi');
    expect(fetchMock.mock.calls[0][0]).toContain('gemini-2.5-pro');
  });
});

describe('a parent can find out why the tutor went quiet', () => {
  it.each([
    { status: 401, code: 'auth' },
    { status: 404, code: 'model' },
    { status: 429, code: 'rate-limit' },
    { status: 500, code: 'network' },
  ])('turns HTTP $status into a "$code" a parent can act on', async ({ status, code }) => {
    useProvider('google', 'AIzaKEY');
    fetchMock.mockReturnValue(errJson(status));

    // The child sees nothing either way — that contract is unchanged.
    expect(await aiService.callAi('hi')).toBeNull();
    expect(aiConfig.lastError()?.code).toBe(code);
    expect(aiConfig.lastError()?.message.length).toBeGreaterThan(10);
  });

  it('records a missing key distinctly from a broken one', async () => {
    store.set('aiProvider', 'anthropic');
    expect(await aiService.callAi('hi')).toBeNull();
    expect(aiConfig.lastError()?.code).toBe('no-key');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('treats a safety block as its own outcome, not a network fault', async () => {
    useProvider('anthropic', 'sk-ant-KEY');
    fetchMock.mockReturnValue(okJson({ stop_reason: 'refusal', content: [] }));
    expect(await aiService.callAi('hi')).toBeNull();
    expect(aiConfig.lastError()?.code).toBe('blocked');
  });

  it('clears the error once a call succeeds', async () => {
    useProvider('google', 'AIzaKEY');
    fetchMock.mockReturnValue(errJson(401));
    await aiService.callAi('hi');
    expect(aiConfig.lastError()).not.toBeNull();

    fetchMock.mockReturnValue(geminiOk('better'));
    await aiService.callAi('hi');
    expect(aiConfig.lastError()).toBeNull();
  });
});

describe('a pasted key identifies its own provider', () => {
  it.each([
    { key: 'AIzaSyABCDEF', provider: 'google' },
    { key: 'sk-ant-api03-abc', provider: 'anthropic' },
    { key: 'sk-proj-abcdef', provider: 'openai' },
  ])('$key belongs to $provider', ({ key, provider }) => {
    expect(providers.detectProviderFromKey(key)).toBe(provider);
  });

  it('does not mistake an Anthropic key for an OpenAI one', () => {
    // Both start "sk-", so prefix order matters: longest match first.
    expect(providers.detectProviderFromKey('sk-ant-abc')).toBe('anthropic');
    expect(providers.detectProviderFromKey('sk-abc')).toBe('openai');
  });

  it('returns null for something that is not a key at all', () => {
    expect(providers.detectProviderFromKey('')).toBeNull();
    expect(providers.detectProviderFromKey('   ')).toBeNull();
    expect(providers.detectProviderFromKey('https://example.com')).toBeNull();
  });

  it('tolerates the whitespace a copy-paste picks up', () => {
    expect(providers.detectProviderFromKey('  AIzaSyABC\n')).toBe('google');
  });
});

describe('key shape is checked before a request is spent', () => {
  it('accepts a well-formed key for each provider', () => {
    expect(providers.validateKeyShape('google', 'AIzaSyABC').ok).toBe(true);
    expect(providers.validateKeyShape('anthropic', 'sk-ant-abc').ok).toBe(true);
    expect(providers.validateKeyShape('openai', 'sk-abc').ok).toBe(true);
  });

  it('names the provider a mispasted key actually belongs to', () => {
    const result = providers.validateKeyShape('google', 'sk-ant-abc');
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('Anthropic');
  });

  it('catches an empty or truncated paste', () => {
    expect(providers.validateKeyShape('openai', '').ok).toBe(false);
    expect(providers.validateKeyShape('openai', 'sk-abc def').ok).toBe(false);
  });

  it('asks for no key at all from the on-device provider', () => {
    expect(providers.validateKeyShape('chrome', '').ok).toBe(true);
  });
});

describe('the parent can see what it is costing', () => {
  it('accumulates tokens and an estimate across calls', async () => {
    useProvider('anthropic', 'sk-ant-KEY', 'claude-haiku-4-5');
    fetchMock.mockReturnValue(okJson({
      content: [{ type: 'text', text: 'hi' }],
      usage: { input_tokens: 1000, output_tokens: 1000 },
    }));

    await aiService.callAi('a');
    await aiService.callAi('b');

    const spend = aiConfig.spendSummary();
    expect(spend.calls).toBe(2);
    expect(spend.inputTokens).toBe(2000);
    expect(spend.estimatedUsd).toBeGreaterThan(0);
    expect(spend.priced).toBe(true);
  });

  it('says "unknown" rather than "$0.00" for a model with no price on file', async () => {
    useProvider('anthropic', 'sk-ant-KEY', 'some-future-model');
    fetchMock.mockReturnValue(okJson({
      content: [{ type: 'text', text: 'hi' }],
      usage: { input_tokens: 100, output_tokens: 100 },
    }));
    await aiService.callAi('a');

    const spend = aiConfig.spendSummary();
    expect(spend.priced).toBe(false);
    expect(spend.inputTokens).toBe(100);
  });
});

describe('migrating from the single-key version', () => {
  it('keeps working for a parent who already had a Gemini key', async () => {
    store.set('geminiApiKey', 'AIzaOLDKEY');
    expect(aiConfig.apiKeyFor('google')).toBe('AIzaOLDKEY');
    expect(aiService.hasApiKey()).toBe(true);

    fetchMock.mockReturnValue(geminiOk('still working'));
    expect(await aiService.callAi('hi')).toBe('still working');
  });

  it('survives a progress reset, like the PIN', () => {
    aiConfig.setApiKey('anthropic', 'sk-ant-KEEPME');
    store.set('aiProvider', 'anthropic');
    store.reset();
    expect(aiConfig.apiKeyFor('anthropic')).toBe('sk-ant-KEEPME');
    expect(aiConfig.activeProviderId()).toBe('anthropic');
  });
});
