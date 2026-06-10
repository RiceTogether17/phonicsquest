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
 * Ask Giri to elaborate on WHY a chosen answer was right or wrong.
 * Strictly additive: callers always show the authored explanation first
 * and append this only when it resolves. Returns null without a key,
 * over the daily cap, or on any failure.
 *
 * @param {object} params
 * @param {string} params.question        the question/stem as shown
 * @param {string[]} params.options       all choices
 * @param {string} params.chosen          what the child picked
 * @param {string} params.correct         the correct answer
 * @param {string} [params.authoredExplanation]  the built-in explanation (so the AI adds, not repeats)
 * @param {string|number} [params.level]  P1–P6 level for pitch
 * @returns {Promise<string|null>}
 */
export async function explainMistake({ question, options, chosen, correct, authoredExplanation = '', level = '' }) {
  const { askGiriConstrained } = await import('./aiGuardrails.js');
  const wasRight = chosen === correct;
  const prompt = `A ${level ? `${level} ` : ''}student answered a multiple-choice English question.

Question: ${question}
Choices: ${options.join(' / ')}
Student chose: "${chosen}" — ${wasRight ? 'CORRECT' : `wrong (correct answer: "${correct}")`}
${authoredExplanation ? `The app already told them: "${authoredExplanation}"` : ''}

${wasRight
    ? 'In 1–2 short sentences, reinforce WHY their answer is right so the idea transfers to the next question.'
    : 'In 2–3 short sentences, explain the thinking mistake that leads to their choice, then how to spot the right answer next time. Be kind — mistakes are how we learn.'}`;

  return askGiriConstrained('explain', prompt, {
    maxTokens: 160,
    logSummary: `Why: ${String(question).slice(0, 80)}`,
  });
}

/**
 * Ask Giri for a nudge-don't-tell hint on the current question.
 * Returns null without a key, over the daily cap, or on failure.
 *
 * @param {object} params
 * @param {string} params.question
 * @param {string[]} params.options
 * @param {string} params.correct        never revealed to the child
 * @param {string} [params.categoryLabel]
 * @param {string|number} [params.level]
 * @returns {Promise<string|null>}
 */
export async function getAdaptiveHint({ question, options, correct, categoryLabel = '', level = '' }) {
  const { askGiriConstrained } = await import('./aiGuardrails.js');
  const prompt = `A ${level ? `${level} ` : ''}student is stuck on this English question${categoryLabel ? ` about ${categoryLabel}` : ''}:

Question: ${question}
Choices: ${options.join(' / ')}
(The correct answer is "${correct}" — you must NOT say it or name any choice.)

Give ONE short hint (max 25 words) that points at the clue in the sentence or the rule to think about, WITHOUT revealing or naming any answer choice.`;

  return askGiriConstrained('hint', prompt, {
    maxTokens: 80,
    logSummary: `Hint: ${String(question).slice(0, 80)}`,
  });
}

/**
 * Ask Giri to elaborate on a teach-back moment (cloze passage, synthesis
 * rewrite, editing correction) where the child has already seen the rule
 * and the correct answer. Returns null without a key / capped / failure.
 *
 * @param {object} params
 * @param {string} params.skillLabel      e.g. "Past tense", "Passive voice"
 * @param {string} params.exercise        the sentence/blank/task as shown
 * @param {string} params.studentAnswer   what the child wrote or picked
 * @param {string} params.correctAnswer
 * @param {string|number} [params.level]
 * @returns {Promise<string|null>}
 */
export async function explainTeachBack({ skillLabel, exercise, studentAnswer, correctAnswer, level = '' }) {
  const { askGiriConstrained } = await import('./aiGuardrails.js');
  const prompt = `A ${level ? `${level} ` : ''}student is practising ${skillLabel || 'English'} and has tried twice without success. They have already been shown the rule and the correct answer — your job is to make it click.

Exercise: ${exercise}
Student's answer: "${studentAnswer}"
Correct answer: "${correctAnswer}"

In 2–3 short sentences, explain the thinking mistake behind their answer and how to spot the right one next time. Be kind — mistakes are how we learn.`;

  return askGiriConstrained('explain', prompt, {
    maxTokens: 160,
    logSummary: `Teach-back: ${String(skillLabel || exercise).slice(0, 80)}`,
  });
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

/**
 * Ask Gemini to grade a synthesis/transformation answer.
 * Returns { verdict: 'CORRECT'|'PARTIAL'|'WRONG', feedback: string } or null on failure.
 *
 * @param {string} original   - the original sentence to transform
 * @param {string} stem       - the sentence stem given (may be empty)
 * @param {string} model      - the model answer
 * @param {string[]} alts     - accepted alternates
 * @param {string} typed      - what the student typed
 * @param {string} skillLabel - e.g. "Passive voice"
 */
export async function gradeSynthesisAnswer(original, stem, model, alts, typed, skillLabel) {
  const altLines = alts.length ? `Also accepted:\n${alts.map(a => `- ${a}`).join('\n')}` : '';
  const prompt = `You are a Singapore PSLE English examiner.

Task type: ${skillLabel}
Original sentence: ${original}
${stem ? `Sentence stem given to student: ${stem}` : ''}
Model answer: ${model}
${altLines}
Student's answer: ${typed}

Decide if the student's answer is:
CORRECT — grammatically correct AND semantically equivalent to the model answer
PARTIAL — correct structure but a minor tense, agreement, or punctuation error
WRONG — incorrect meaning, wrong structure, or grammatically unacceptable

Reply on the FIRST LINE with exactly one word: CORRECT, PARTIAL, or WRONG.
On the SECOND LINE give one short sentence of feedback (max 15 words, encouraging tone, plain English for a primary student).
No other text.`;

  const raw = await callGemini(prompt, { maxTokens: 80, temperature: 0.1 });
  if (!raw) return null;
  const lines = raw.trim().split('\n').map(l => l.trim()).filter(Boolean);
  const verdict = ['CORRECT', 'PARTIAL', 'WRONG'].find(v => lines[0]?.startsWith(v));
  if (!verdict) return null;
  return { verdict, feedback: lines[1] || '' };
}
