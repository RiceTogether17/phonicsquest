// src/modules/aiService.js
//
// Feature-level AI prompts. The transport underneath is provider-agnostic:
// a parent picks Google, Anthropic, OpenAI or Chrome's on-device model in
// Settings, and every function here works the same way regardless.
//
// The contract callers rely on is unchanged: a Promise of text, or null.
// Null means "the tutor said nothing" for ANY reason, and every caller
// already renders its authored, offline content first — so a missing key,
// a wrong key and a flat battery all degrade to the same experience for the
// child. The reason is recorded for the parent instead (aiConfig.lastError).

import {
  activeProviderId,
  apiKeyFor,
  isTutorConfigured,
  modelFor,
  recordUsage,
  setLastError,
} from './aiConfig.js';
import { AiError, getProvider } from './aiProviders.js';

/** The active provider's key ('' for the on-device model, which needs none). */
export function getApiKey() {
  return apiKeyFor();
}

/** Is the tutor set up enough to try? */
export function hasApiKey() {
  return isTutorConfigured();
}

/**
 * Ask the configured provider. Returns the text, or null on any failure.
 *
 * @param {string} prompt
 * @param {object} [opts]
 * @param {number} [opts.maxTokens]
 * @param {number} [opts.temperature]
 * @param {string} [opts.system]       provider-native system prompt
 * @param {AbortSignal} [opts.signal]  cancel when the child leaves the screen
 * @returns {Promise<string|null>}
 */
export async function callAi(
  prompt,
  { maxTokens = 1024, temperature = 0.3, system = '', signal } = {},
) {
  const providerId = activeProviderId();
  const provider = getProvider(providerId);
  if (!provider) return null;
  if (!isTutorConfigured(providerId)) {
    setLastError(new AiError('no-key', 'No AI provider is set up yet.'));
    return null;
  }

  const model = modelFor(providerId);
  try {
    const { text, usage } = await provider.call({
      key: apiKeyFor(providerId),
      model,
      system,
      prompt,
      maxTokens,
      temperature,
      signal,
    });
    if (!text || !text.trim()) {
      setLastError(new AiError('empty', 'The provider returned an empty answer.'));
      return null;
    }
    recordUsage(usage, model);
    setLastError(null);
    return text;
  } catch (err) {
    // Cancellation is not a failure worth reporting to a parent.
    if (err?.name !== 'AbortError') setLastError(err);
    return null;
  }
}

/**
 * @deprecated Kept so existing call sites keep working while the tutor is
 * no longer Gemini-only. Prefer callAi.
 */
export const callGemini = callAi;

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
export async function explainMistake({
  question,
  options,
  chosen,
  correct,
  authoredExplanation = '',
  level = '',
}) {
  const { askGiriConstrained } = await import('./aiGuardrails.js');
  const wasRight = chosen === correct;
  const prompt = `A ${level ? `${level} ` : ''}student answered a multiple-choice English question.

Question: ${question}
Choices: ${options.join(' / ')}
Student chose: "${chosen}" — ${wasRight ? 'CORRECT' : `wrong (correct answer: "${correct}")`}
${authoredExplanation ? `The app already told them: "${authoredExplanation}"` : ''}

${
  wasRight
    ? 'In 1–2 short sentences, reinforce WHY their answer is right so the idea transfers to the next question.'
    : 'In 2–3 short sentences, explain the thinking mistake that leads to their choice, then how to spot the right answer next time. Be kind — mistakes are how we learn.'
}`;

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
export async function getAdaptiveHint({
  question,
  options,
  correct,
  categoryLabel = '',
  level = '',
}) {
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
export async function explainTeachBack({
  skillLabel,
  exercise,
  studentAnswer,
  correctAnswer,
  level = '',
}) {
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
 *
 * Returns structured, sanitised data — never raw model text — so callers
 * can render it safely: `{ good: string }` when the draft passes, or
 * `{ items: [{ sentence, issue }] }` with per-sentence findings.
 * Returns null without a key, over the daily cap, or on failure.
 *
 * @param {string} draftText  - student's composition text
 * @param {number} level      - P1–P6 level (1–6)
 * @param {string} [taskDesc] - brief task description
 * @returns {Promise<{ good: string } | { items: { sentence: string, issue: string }[] } | null>}
 */
export async function getWritingCoachFeedback(draftText, level, taskDesc = '') {
  const { canCallAi, logAiUse, sanitizeAiText } = await import('./aiGuardrails.js');
  if (!canCallAi()) return null;
  logAiUse('coach', `Draft coached (P${level})`);

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

  const raw = await callGemini(prompt, { maxTokens: 600, temperature: 0.2 });
  if (!raw) return null;

  // Parse BEFORE sanitising: sanitizeAiText strips the "|" separator the
  // format relies on, so split fields first, then clean each field.
  const trimmed = raw.trim();
  if (trimmed.startsWith('GOOD:')) {
    const good = sanitizeAiText(trimmed.replace(/^GOOD:/, ''));
    return good ? { good } : null;
  }
  const items = trimmed
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('SENTENCE:'))
    .map((l) => {
      const [sentPart, issuePart] = l.replace('SENTENCE:', '').split('| ISSUE:');
      return { sentence: sanitizeAiText(sentPart || ''), issue: sanitizeAiText(issuePart || '') };
    })
    .filter((it) => it.sentence || it.issue);
  return items.length ? { items } : null;
}

/**
 * Grade a composition against the same 4-dimension rubric the local
 * evaluator uses (writingEvaluator.js), so the AI bands sit beside the
 * local bands without inventing a different scale. The local score stays
 * the source of truth for XP/progression — this is tutor commentary.
 *
 * Routed through the aiGuardrails daily cap + usage log, but with its own
 * marking prompt (a rubric needs more than the 60-word chat persona).
 *
 * @param {string} draftText
 * @param {number|string} level   P1–P6 numeric level
 * @param {string} [taskDesc]
 * @returns {Promise<{ dimensions: Record<string, { band: number, comment: string }>, overall: string } | null>}
 */
export async function gradeEssayWithRubric(draftText, level, taskDesc = '') {
  const { canCallAi, logAiUse, sanitizeAiText } = await import('./aiGuardrails.js');
  if (!canCallAi()) return null;
  logAiUse('grade', `Essay graded (P${level})`);

  const prompt = `You are a Singapore primary school English teacher grading a P${level} student's composition against a 4-band rubric (4 = Strong, 3 = Secure, 2 = Developing, 1 = Needs Support). Judge against P${level} expectations, not adult standards.

Task: ${taskDesc || 'Write a story or composition.'}

Student's draft:
"""
${draftText}
"""

Grade these four dimensions. Reply EXACTLY in this format, one line each, no other text:
CONTENT: <band 1-4> | <one short, specific comment in plain English>
ORGANISATION: <band 1-4> | <one short, specific comment>
LANGUAGE: <band 1-4> | <one short, specific comment>
TASK: <band 1-4> | <one short, specific comment>
OVERALL: <one encouraging sentence naming the single most useful next improvement>`;

  const raw = await callGemini(prompt, { maxTokens: 300, temperature: 0.2 });
  if (!raw) return null;

  const keyMap = {
    CONTENT: 'content',
    ORGANISATION: 'organisation',
    LANGUAGE: 'language',
    TASK: 'taskFulfilment',
  };
  const dimensions = {};
  let overall = '';
  for (const line of raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)) {
    const m = line.match(/^([A-Z]+):\s*(.*)$/);
    if (!m) continue;
    if (m[1] === 'OVERALL') {
      overall = sanitizeAiText(m[2]);
      continue;
    }
    const key = keyMap[m[1]];
    if (!key) continue;
    const parts = m[2].split('|');
    const band = parseInt(parts[0], 10);
    if (!Number.isInteger(band) || band < 1 || band > 4) continue;
    dimensions[key] = { band, comment: sanitizeAiText(parts.slice(1).join('|')) };
  }

  // All four dimensions must parse for the grading to be usable.
  if (Object.keys(dimensions).length < 4) return null;
  return { dimensions, overall };
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
  const { canCallAi, logAiUse, sanitizeAiText } = await import('./aiGuardrails.js');
  if (!canCallAi()) return null;

  const altLines = alts.length ? `Also accepted:\n${alts.map((a) => `- ${a}`).join('\n')}` : '';
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

  logAiUse('grade', `Synthesis graded: ${String(skillLabel || '').slice(0, 80)}`);
  const raw = await callGemini(prompt, { maxTokens: 80, temperature: 0.1 });
  if (!raw) return null;
  const lines = raw
    .trim()
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
  const verdict = ['CORRECT', 'PARTIAL', 'WRONG'].find((v) => lines[0]?.startsWith(v));
  if (!verdict) return null;
  return { verdict, feedback: sanitizeAiText(lines[1] || '') };
}
