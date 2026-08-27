/**
 * PhonicsQuest – AI tutor configuration
 *
 * Which provider is active, which key it uses, which model, and what the
 * tutor has cost so far. Kept separate from the transport (aiProviders.js)
 * and from the child-safety layer (aiGuardrails.js) so that "who pays and
 * how" is answerable in one place.
 *
 * Migration: PhonicsQuest used to hold a single `geminiApiKey`. That key is
 * read once into the per-provider store and left where it was, so a parent
 * who upgrades mid-term keeps working without touching Settings.
 */

import { store } from './store.js';
import { AI_PROVIDERS, getProvider, PROVIDER_ORDER } from './aiProviders.js';

/** Rough $ per million tokens, for the parent-facing running estimate.
 *
 *  Deliberately approximate and deliberately shown as "about": the real
 *  bill lives on the provider's dashboard and this is only here so a parent
 *  can tell "pennies" from "pounds" without leaving the app. Wrong by a
 *  factor of two is fine; wrong by a factor of a hundred is not, which is
 *  what showing nothing at all effectively was. */
const PRICE_PER_MTOK = {
  'claude-opus-5': { input: 5, output: 25 },
  'claude-sonnet-5': { input: 2, output: 10 },
  'claude-haiku-4-5': { input: 1, output: 5 },
  'gpt-4o': { input: 2.5, output: 10 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gemini-2.5-pro': { input: 1.25, output: 10 },
  'gemini-2.5-flash': { input: 0.3, output: 2.5 },
  'gemini-1.5-flash': { input: 0.075, output: 0.3 },
};

/** The provider the tutor should use right now. */
export function activeProviderId() {
  const id = store.get('aiProvider');
  return AI_PROVIDERS[id] ? id : 'google';
}

/**
 * The key for a provider, falling back to the legacy single-key field.
 * @param {string} [providerId]
 */
export function apiKeyFor(providerId = activeProviderId()) {
  const keys = store.get('aiApiKeys') || {};
  if (keys[providerId]) return keys[providerId];
  // Pre-multi-provider installs kept one Gemini key at the top level.
  if (providerId === 'google') return store.get('geminiApiKey') || '';
  return '';
}

/** @param {string} providerId @param {string} key */
export function setApiKey(providerId, key) {
  const keys = { ...(store.get('aiApiKeys') || {}) };
  const trimmed = String(key || '').trim();
  if (trimmed) keys[providerId] = trimmed;
  else delete keys[providerId];
  store.set('aiApiKeys', keys);
  // Keep the legacy field in step so a downgrade doesn't lose the key.
  if (providerId === 'google') store.set('geminiApiKey', trimmed || null);
}

/** @param {string} [providerId] */
export function modelFor(providerId = activeProviderId()) {
  const models = store.get('aiModels') || {};
  return models[providerId] || getProvider(providerId)?.defaultModel || '';
}

/** @param {string} providerId @param {string} model */
export function setModel(providerId, model) {
  const models = { ...(store.get('aiModels') || {}) };
  const trimmed = String(model || '').trim();
  if (trimmed) models[providerId] = trimmed;
  else delete models[providerId];
  store.set('aiModels', models);
}

/**
 * Is the tutor configured enough to try a call?
 *
 * The on-device provider needs no key, so "configured" is not the same
 * question as "has a key" — which is why the old hasApiKey() could not be
 * reused for it.
 */
export function isTutorConfigured(providerId = activeProviderId()) {
  const provider = getProvider(providerId);
  if (!provider) return false;
  return provider.needsKey ? !!apiKeyFor(providerId) : true;
}

/** Every provider the parent has actually set up. */
export function configuredProviders() {
  return PROVIDER_ORDER.filter(isTutorConfigured);
}

/**
 * Record what a call consumed, for the parent's running estimate.
 * @param {{ input: number, output: number }|null} usage
 * @param {string} model
 */
export function recordUsage(usage, model) {
  if (!usage) return;
  const price = PRICE_PER_MTOK[model];
  const spend = price
    ? (usage.input / 1e6) * price.input + (usage.output / 1e6) * price.output
    : 0;
  const totals = store.get('aiSpend') || { inputTokens: 0, outputTokens: 0, estimatedUsd: 0, calls: 0 };
  store.set('aiSpend', {
    inputTokens: totals.inputTokens + (usage.input || 0),
    outputTokens: totals.outputTokens + (usage.output || 0),
    estimatedUsd: totals.estimatedUsd + spend,
    calls: totals.calls + 1,
  });
}

/** Totals for the settings/dashboard display. */
export function spendSummary() {
  const t = store.get('aiSpend') || { inputTokens: 0, outputTokens: 0, estimatedUsd: 0, calls: 0 };
  const known = PRICE_PER_MTOK[modelFor()] != null;
  return {
    ...t,
    /** False when the active model has no price on file — say "unknown", never "$0.00". */
    priced: known,
  };
}

/** Clear the running estimate (e.g. after the parent pays a bill). */
export function resetSpend() {
  store.set('aiSpend', { inputTokens: 0, outputTokens: 0, estimatedUsd: 0, calls: 0 });
}

/**
 * The last failure, so Settings can explain why the tutor is quiet.
 * The child never sees this — features fall back to their authored content.
 */
export function setLastError(err) {
  store.set('aiLastError', err ? { code: err.code || 'network', message: err.message || '', at: Date.now() } : null);
}

/** @returns {{ code: string, message: string, at: number }|null} */
export function lastError() {
  return store.get('aiLastError') || null;
}
