/**
 * PhonicsQuest – AI provider layer (bring your own key)
 *
 * PhonicsQuest has no server and no AI budget. The tutor therefore runs on
 * a key the PARENT supplies, billed to the parent's own account, with the
 * request going straight from their browser to the provider they chose.
 *
 * What this is NOT
 * ────────────────
 * You cannot sign a child into a ChatGPT Plus, Claude Pro or Gemini
 * Advanced subscription and have this app use it. Those are consumer chat
 * products; none of them exposes an OAuth grant that lets a third-party web
 * page spend a subscription's inference. The API platforms are separate
 * accounts with separate billing, and an API key is the only credential
 * they hand out. So: a key, pasted once by a grown-up.
 *
 * Cost, honestly
 * ──────────────
 * Google's AI Studio tier is free for the volumes a single child generates,
 * and Chrome's built-in model is free and never leaves the device. Those are
 * the two options a family with no budget should reach for; the paid
 * providers are here for parents who already have an account.
 *
 * Where the key lives
 * ───────────────────
 * In this browser's local storage, and nowhere else. It is never sent to
 * PhonicsQuest (there is nothing to send it to) — only to the provider's own
 * endpoint. That is the same trust model as pasting a key into any local
 * tool, and it is worth a parent knowing: a key in a browser is readable by
 * anything else running in that browser, so use a key with a spend limit set
 * on the provider's console, not your only key.
 */

/**
 * A failure a parent can act on.
 *
 * The old code returned null for every failure — no key, wrong key, retired
 * model, no network, safety block — so a parent who mistyped a key saw the
 * same silence as a parent who had never set one up, with nothing to tell
 * them which. The tutor still degrades to silence for the CHILD; the reason
 * is kept for the settings screen.
 */
export class AiError extends Error {
  /**
   * @param {'no-key'|'auth'|'rate-limit'|'model'|'network'|'blocked'|'empty'|'unsupported'} code
   * @param {string} message  written for a parent, not a developer
   */
  constructor(code, message) {
    super(message);
    this.name = 'AiError';
    this.code = code;
  }
}

/** Shared timeout so a hung request can't leave the tutor spinning forever. */
const REQUEST_TIMEOUT_MS = 30000;

async function postJson(url, { headers, body, signal }) {
  const timer = new AbortController();
  const timeout = setTimeout(() => timer.abort(), REQUEST_TIMEOUT_MS);
  // Honour a caller's cancellation (leaving the screen) as well as our own.
  const onAbort = () => timer.abort();
  signal?.addEventListener('abort', onAbort, { once: true });
  try {
    return await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
      signal: timer.signal,
    });
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new AiError(
        'network',
        'The tutor took too long to answer. Check the connection and try again.',
      );
    }
    throw new AiError('network', 'Could not reach the AI provider. Check the internet connection.');
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', onAbort);
  }
}

/**
 * Turn an HTTP failure into something a parent can fix.
 * @param {Response} res
 * @param {string} providerLabel
 */
async function raiseHttpError(res, providerLabel) {
  let detail = '';
  try {
    const body = await res.json();
    detail = body?.error?.message || body?.error?.[0]?.message || body?.message || '';
  } catch {
    /* non-JSON error body */
  }

  if (res.status === 401 || res.status === 403) {
    throw new AiError(
      'auth',
      `${providerLabel} rejected the key. Check it was copied in full and is still active.`,
    );
  }
  if (res.status === 404) {
    throw new AiError(
      'model',
      `${providerLabel} does not have that model. Pick another model in Settings.${detail ? ` (${detail})` : ''}`,
    );
  }
  if (res.status === 429) {
    throw new AiError(
      'rate-limit',
      `${providerLabel} is rate-limiting this key — either too many requests just now, or the account is out of credit.`,
    );
  }
  if (res.status >= 500) {
    throw new AiError(
      'network',
      `${providerLabel} is having trouble right now. Try again in a minute.`,
    );
  }
  throw new AiError(
    'network',
    detail || `${providerLabel} refused the request (HTTP ${res.status}).`,
  );
}

/**
 * Every provider exposes the same shape:
 *   call({ key, model, system, prompt, maxTokens, temperature, signal })
 *     → Promise<{ text, usage? }>   (throws AiError)
 *
 * `usage` is best-effort — it drives the parent-facing spend estimate, and a
 * provider that doesn't report tokens simply doesn't contribute to it.
 */
export const AI_PROVIDERS = {
  /**
   * On-device, free, private. Chrome ships a small model behind the Prompt
   * API; nothing is uploaded and there is no key and no bill. It is the
   * right default for a family with no budget, when the browser has it.
   */
  chrome: {
    id: 'chrome',
    label: 'This device (Chrome built-in AI)',
    needsKey: false,
    free: true,
    blurb:
      'Free and private — the model runs inside Chrome and nothing leaves the device. Needs a recent desktop Chrome; the app will tell you if it is unavailable.',
    keyUrl: null,
    defaultModel: 'on-device',
    models: [{ id: 'on-device', label: 'Chrome built-in' }],

    async available() {
      const api = onDeviceApi();
      if (!api) return false;
      try {
        // Newer Chrome exposes availability(); older exposes capabilities().
        if (api.availability) return (await api.availability()) !== 'unavailable';
        if (api.capabilities) return (await api.capabilities())?.available !== 'no';
      } catch {
        /* treat any probe failure as unavailable */
      }
      return false;
    },

    async call({ system, prompt, maxTokens, temperature, signal }) {
      const api = onDeviceApi();
      if (!api?.create) {
        throw new AiError(
          'unsupported',
          'This browser has no built-in AI. Use Chrome on desktop, or choose a provider and paste a key.',
        );
      }
      let session;
      try {
        session = await api.create({
          initialPrompts: system ? [{ role: 'system', content: system }] : undefined,
          temperature,
          signal,
        });
        const text = await session.prompt(prompt, { signal });
        // The on-device model has no token accounting to report.
        return { text: String(text || ''), usage: null, maxTokens };
      } catch (err) {
        if (err instanceof AiError) throw err;
        throw new AiError(
          'unsupported',
          'The built-in AI could not answer. It may still be downloading — try again shortly.',
        );
      } finally {
        try {
          session?.destroy?.();
        } catch {
          /* already gone */
        }
      }
    },
  },

  /**
   * Google AI Studio. The free tier covers a single child's use comfortably,
   * which is why it stays the recommended paid-provider alternative for a
   * family without a budget.
   */
  google: {
    id: 'google',
    label: 'Google Gemini',
    needsKey: true,
    free: false,
    blurb:
      'Google AI Studio keys have a free tier that comfortably covers one child. Set a spend limit if you add billing.',
    keyUrl: 'https://aistudio.google.com/apikey',
    keyHint: 'Starts with AIza…',
    defaultModel: 'gemini-2.5-flash',
    models: [
      { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash — fast, cheapest' },
      { id: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro — strongest' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash — older, still fine' },
    ],

    async call({ key, model, system, prompt, maxTokens, temperature, signal }) {
      // The key goes in a header, never the query string: URLs leak into
      // browser history, Referer headers and proxy logs.
      const res = await postJson(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          headers: { 'x-goog-api-key': key },
          signal,
          body: {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
            generationConfig: { maxOutputTokens: maxTokens, temperature },
          },
        },
      );
      if (!res.ok) await raiseHttpError(res, 'Google');
      const data = await res.json();

      const candidate = data?.candidates?.[0];
      if (candidate?.finishReason === 'SAFETY' || data?.promptFeedback?.blockReason) {
        throw new AiError(
          'blocked',
          'Google’s safety filter blocked that answer. Nothing was shown to the child.',
        );
      }
      const text =
        candidate?.content?.parts
          ?.map((p) => p.text)
          .filter(Boolean)
          .join('') ?? '';
      return {
        text,
        usage: {
          input: data?.usageMetadata?.promptTokenCount ?? 0,
          output: data?.usageMetadata?.candidatesTokenCount ?? 0,
        },
      };
    },
  },

  /**
   * Anthropic. Direct browser calls need the opt-in header below; without
   * it the API refuses the request from a web page on purpose, because a
   * browser key is visible to the page. See the header's own name.
   */
  anthropic: {
    id: 'anthropic',
    label: 'Anthropic Claude',
    needsKey: true,
    free: false,
    blurb:
      'Billed to your Anthropic Console account. Set a monthly spend limit there before using a key in a browser.',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyHint: 'Starts with sk-ant-…',
    defaultModel: 'claude-opus-5',
    models: [
      { id: 'claude-opus-5', label: 'Claude Opus 5 — strongest' },
      { id: 'claude-sonnet-5', label: 'Claude Sonnet 5 — balanced' },
      { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 — fastest, cheapest' },
    ],

    async call({ key, model, system, prompt, maxTokens, temperature, signal }) {
      const res = await postJson('https://api.anthropic.com/v1/messages', {
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          // Anthropic blocks browser-origin calls unless the caller opts in,
          // precisely because a key in a page is exposed. A parent's own key
          // on their own device is the bargain this whole feature makes.
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        signal,
        body: {
          model,
          max_tokens: maxTokens,
          temperature,
          ...(system ? { system } : {}),
          messages: [{ role: 'user', content: prompt }],
        },
      });
      if (!res.ok) await raiseHttpError(res, 'Anthropic');
      const data = await res.json();

      // A refusal arrives as a normal 200 — check before reading content.
      if (data?.stop_reason === 'refusal') {
        throw new AiError(
          'blocked',
          'Claude declined to answer that. Nothing was shown to the child.',
        );
      }
      const text = (data?.content || [])
        .filter((b) => b?.type === 'text')
        .map((b) => b.text)
        .join('');
      return {
        text,
        usage: { input: data?.usage?.input_tokens ?? 0, output: data?.usage?.output_tokens ?? 0 },
      };
    },
  },

  /** OpenAI platform keys (separate account from ChatGPT Plus). */
  openai: {
    id: 'openai',
    label: 'OpenAI (ChatGPT models)',
    needsKey: true,
    free: false,
    blurb:
      'This is an OpenAI Platform key, which is billed separately from a ChatGPT Plus subscription. Set a usage limit on the platform first.',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyHint: 'Starts with sk-…',
    defaultModel: 'gpt-4o-mini',
    models: [
      { id: 'gpt-4o-mini', label: 'GPT-4o mini — fast, cheapest' },
      { id: 'gpt-4o', label: 'GPT-4o — stronger' },
    ],

    async call({ key, model, system, prompt, maxTokens, temperature, signal }) {
      const res = await postJson('https://api.openai.com/v1/chat/completions', {
        headers: { Authorization: `Bearer ${key}` },
        signal,
        body: {
          model,
          max_completion_tokens: maxTokens,
          temperature,
          messages: [
            ...(system ? [{ role: 'system', content: system }] : []),
            { role: 'user', content: prompt },
          ],
        },
      });
      if (!res.ok) await raiseHttpError(res, 'OpenAI');
      const data = await res.json();

      const choice = data?.choices?.[0];
      if (choice?.finish_reason === 'content_filter') {
        throw new AiError(
          'blocked',
          'OpenAI’s safety filter blocked that answer. Nothing was shown to the child.',
        );
      }
      return {
        text: choice?.message?.content ?? '',
        usage: {
          input: data?.usage?.prompt_tokens ?? 0,
          output: data?.usage?.completion_tokens ?? 0,
        },
      };
    },
  },
};

/**
 * Chrome's built-in model, under whichever global this browser uses.
 * It shipped as `window.ai.languageModel` and later moved to a top-level
 * `LanguageModel`; checking both is the difference between the no-setup
 * path working on a parent's machine and it silently not existing.
 */
function onDeviceApi() {
  return globalThis.LanguageModel || globalThis.ai?.languageModel || null;
}

/**
 * Which provider does this key belong to?
 *
 * Every provider stamps its keys with a distinct prefix, so a parent never
 * has to answer "which provider is this?" — a question they may not even
 * know they are being asked. They paste; the app works it out.
 *
 * @param {string} key
 * @returns {string|null} provider id, or null if it matches nothing
 */
export function detectProviderFromKey(key) {
  const k = String(key || '').trim();
  if (!k) return null;
  // Longest prefix first: an Anthropic key also starts with "sk-".
  if (k.startsWith('sk-ant-')) return 'anthropic';
  if (k.startsWith('AIza')) return 'google';
  if (k.startsWith('sk-')) return 'openai';
  return null;
}

/** Provider ids in the order the settings screen should offer them. */
export const PROVIDER_ORDER = ['chrome', 'google', 'anthropic', 'openai'];

/** @param {string} id @returns {object|null} */
export function getProvider(id) {
  return AI_PROVIDERS[id] ?? null;
}

/**
 * Is this at least shaped like a key for the provider?
 *
 * A deliberately loose check — the point is to catch the common paste
 * mistakes (empty, whitespace, the placeholder text, a key pasted into the
 * wrong provider) before spending a request to learn the same thing.
 *
 * @param {string} providerId
 * @param {string} key
 * @returns {{ ok: true } | { ok: false, reason: string }}
 */
export function validateKeyShape(providerId, key) {
  const provider = AI_PROVIDERS[providerId];
  if (!provider) return { ok: false, reason: 'Unknown provider.' };
  if (!provider.needsKey) return { ok: true };

  const k = String(key || '').trim();
  if (!k) return { ok: false, reason: 'Paste a key first.' };
  if (/\s/.test(k))
    return {
      ok: false,
      reason: 'That key has a space in it — it may have been cut short when copying.',
    };

  const prefixes = { anthropic: 'sk-ant-', openai: 'sk-', google: 'AIza' };
  const expected = prefixes[providerId];
  if (expected && !k.startsWith(expected)) {
    // Name the provider it DOES look like — pasting the wrong one of three
    // keys is the likeliest mistake once a parent has more than one.
    const looksLike = Object.entries(prefixes).find(
      ([id, p]) => id !== providerId && k.startsWith(p),
    );
    return {
      ok: false,
      reason: looksLike
        ? `That is a ${AI_PROVIDERS[looksLike[0]].label} key — this box wants the ${provider.label} one.`
        : `${provider.label} keys normally start with "${expected}".`,
    };
  }
  return { ok: true };
}
