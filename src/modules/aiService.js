// src/modules/aiService.js
import { store } from './store.js';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export function getApiKey() {
  return store.get('geminiApiKey') || '';
}

export function hasApiKey() {
  return !!getApiKey();
}

/**
 * Call Gemini. Returns the text response string, or null on failure.
 * @param {string} prompt
 * @param {object} [opts]
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.temperature]
 */
export async function callGemini(prompt, { maxTokens = 1024, temperature = 0.3 } = {}) {
  const key = getApiKey();
  if (!key) return null;
  try {
    const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: maxTokens, temperature },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch {
    return null;
  }
}

/**
 * Get sentence-level writing coach feedback for a student's draft.
 * Returns HTML string with inline <mark> annotations, or null if no key/failure.
 *
 * @param {string} draftText  - student's composition text
 * @param {number} level      - P1–P6 level (1–6)
 * @param {string} [taskDesc] - brief task description
 */
export async function getWritingCoachFeedback(draftText, level, taskDesc = '') {
  const prompt = `You are a Singapore primary school English teacher marking a P${level} student's composition.

Task: ${taskDesc || 'Write a story or composition.'}

Student's draft:
"""
${draftText}
"""

Give sentence-level feedback. For each sentence that has an issue, quote the exact sentence and give a short, encouraging correction in plain English. Use simple language a primary school child can understand.

Format your response EXACTLY like this — one finding per line, no extra text:
SENTENCE: [exact quote] | ISSUE: [1-sentence tip]

Focus only on: grammar errors, word choice, punctuation, sentence structure.
Give at most 5 findings. If the draft is good, say: GOOD: Well done!`;

  return callGemini(prompt, { maxTokens: 600, temperature: 0.2 });
}
