/**
 * PhonicsQuest – AI Guardrails
 *
 * Shared safety layer for every child-facing Gemini feature. All AI tutor
 * calls go through askGiriConstrained(), which:
 *
 *   1. prefixes the fixed child-safe persona prompt (Giri the owl tutor)
 *   2. enforces a per-day call cap so a curious child can't burn quota
 *   3. sanitises the response (strip HTML/URLs, cap length)
 *   4. logs the interaction to the parent-visible aiUsageLog
 *
 * The AI is always ADDITIVE: callers must render their authored/offline
 * content first and only append the AI elaboration when it arrives.
 * No key, capped out, offline, or refused → null, and the experience is
 * the same as before the feature existed.
 */

import { store } from './store.js';
import { callGemini, hasApiKey } from './aiService.js';

/** Max child-initiated AI calls per day (across features). */
export const DAILY_AI_CALL_CAP = 40;

/** Max characters shown from any AI answer. */
const MAX_RESPONSE_CHARS = 700;

/** Capped parent-visible usage log length. */
const USAGE_LOG_CAP = 100;

/**
 * Fixed persona prefix for every child-facing call. Keep instructions
 * here, not in callers, so safety rules can't drift per feature.
 */
export const GIRI_SYSTEM_PREFIX = `You are Giri, a friendly owl tutor inside a children's English learning app (ages 5–12, Singapore primary school).

Rules you must always follow:
- Answer in at most 60 words of plain, encouraging English a child can read.
- Talk ONLY about English learning: sounds, words, grammar, vocabulary, reading and writing.
- If asked about anything else (personal questions, other topics, who made you), reply exactly: "Let's keep learning English together!"
- Never ask the child for personal information. Never suggest visiting websites or links.
- No markdown, no HTML, no emoji spam (one emoji is fine).

Task:
`;

function _todayKey(now = new Date()) {
  const pad = n => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Remove anything we never want to render from an AI reply. */
export function sanitizeAiText(raw) {
  if (typeof raw !== 'string') return '';
  let text = raw
    .replace(/<[^>]*>/g, ' ')                 // HTML tags
    .replace(/https?:\/\/\S+/gi, '')          // URLs
    .replace(/www\.\S+/gi, '')
    .replace(/[*_#`>|]/g, '')                 // markdown remnants
    .replace(/\s{2,}/g, ' ')
    .trim();
  if (text.length > MAX_RESPONSE_CHARS) {
    text = `${text.slice(0, MAX_RESPONSE_CHARS).replace(/\s+\S*$/, '')}…`;
  }
  return text;
}

/** How many AI calls the child has made today. */
export function aiCallsToday(now = new Date()) {
  const today = _todayKey(now);
  return (store.get('aiUsageLog') || []).filter(e => e && e.date === today).length;
}

/** Is another child-initiated AI call allowed right now? */
export function canCallAi(now = new Date()) {
  return hasApiKey() && aiCallsToday(now) < DAILY_AI_CALL_CAP;
}

/** Append to the parent-visible usage log (capped). */
export function logAiUse(kind, summary, now = new Date()) {
  const entry = {
    date: _todayKey(now),
    at: new Date().toISOString(),
    kind,
    summary: String(summary || '').slice(0, 120),
  };
  const log = [entry, ...(store.get('aiUsageLog') || [])].slice(0, USAGE_LOG_CAP);
  store.set('aiUsageLog', log);
}

/**
 * Make a guarded, child-safe Gemini call.
 *
 * @param {string} kind        feature tag for the usage log ('explain', 'hint', 'ask')
 * @param {string} taskPrompt  the feature-specific task (appended after the persona prefix)
 * @param {object} [opts]
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.temperature]   capped at 0.3 — tutoring, not creativity
 * @param {string} [opts.logSummary]    what the parent sees in the usage log
 * @returns {Promise<string|null>} sanitised reply, or null (no key / cap / failure)
 */
export async function askGiriConstrained(kind, taskPrompt, opts = {}) {
  if (!canCallAi()) return null;

  const { maxTokens = 160, temperature = 0.2, logSummary = '' } = opts;
  logAiUse(kind, logSummary || taskPrompt.slice(0, 120));

  const raw = await callGemini(GIRI_SYSTEM_PREFIX + taskPrompt, {
    maxTokens,
    temperature: Math.min(temperature, 0.3),
  });
  if (!raw) return null;

  const clean = sanitizeAiText(raw);
  return clean.length > 0 ? clean : null;
}
