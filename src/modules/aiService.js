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
  const { askGiriConstrained, fenceLearnerInput } = await import('./aiGuardrails.js');
  // The one free-text field a child controls here is their own answer, so it
  // is fenced rather than quoted. Audit 2026-09-19, finding 24.
  const prompt = `A ${level ? `${level} ` : ''}student is practising ${skillLabel || 'English'} and has tried twice without success. They have already been shown the rule and the correct answer — your job is to make it click.

Exercise: ${exercise}
Correct answer: "${correctAnswer}"

What the student wrote:
${fenceLearnerInput('PUPIL ANSWER', studentAnswer)}

In 2–3 short sentences, explain the thinking mistake behind their answer and how to spot the right one next time. Be kind — mistakes are how we learn.`;

  return askGiriConstrained('explain', prompt, {
    maxTokens: 160,
    logSummary: `Teach-back: ${String(skillLabel || exercise).slice(0, 80)}`,
  });
}

/**
 * Normalised form for comparing a quoted sentence with the draft it came from.
 */
function _flatten(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[\u2018\u2019\u201c\u201d]/g, "'")
    .replace(/[^a-z0-9' ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Get sentence-level writing coach feedback for a student's draft.
 *
 * Returns structured, sanitised data — never raw model text — so callers
 * can render it safely: `{ good: string }` when the draft passes, or
 * `{ items: [{ sentence, issue }] }` with per-sentence findings.
 * Returns null without a key, over the daily cap, or on failure.
 *
 * Audit 2026-09-19, finding 24: goes through `askStructured`, so the marking
 * instructions are in the system channel and the child's draft is fenced
 * rather than concatenated onto them. Each finding's quoted sentence is also
 * checked against the draft — a quote the child did not write is a sentence
 * the model made up, and showing it as "your sentence" teaches nothing.
 *
 * @param {string} draftText  - student's composition text
 * @param {number} level      - P1–P6 level (1–6)
 * @param {string} [taskDesc] - brief task description
 * @returns {Promise<{ good: string } | { items: { sentence: string, issue: string }[] } | null>}
 */
export async function getWritingCoachFeedback(draftText, level, taskDesc = '') {
  const { askStructured, sanitizeAiText } = await import('./aiGuardrails.js');
  const haystack = _flatten(draftText);

  return askStructured('coach', {
    task: `Mark a Singapore Primary ${level} pupil's composition and give sentence-level feedback.`,
    rules: [
      'Comment only on grammar, word choice, punctuation and sentence structure.',
      'Quote each sentence exactly as the pupil wrote it, copied from their draft.',
      'At most five findings. Each tip is one short sentence a P' + level + ' child can act on.',
      'Judge against Primary ' + level + ' expectations, not adult standards.',
      'When there is nothing worth fixing, use the GOOD line instead of inventing a finding.',
    ],
    context: [['Writing task set by the teacher', taskDesc || 'Write a story or composition.']],
    learner: [['PUPIL DRAFT', draftText]],
    fields: {
      SENTENCE: {
        repeated: true,
        parts: ['sentence', 'issue'],
        format:
          "SENTENCE: <the pupil's sentence, copied exactly> | ISSUE: <one short tip>   (one line per finding, at most five)",
      },
      GOOD: {
        format: 'GOOD: <one encouraging sentence>   (this line INSTEAD, when nothing needs fixing)',
      },
    },
    validate: (parsed) => {
      const items = (parsed.SENTENCE || [])
        .map(({ sentence, issue }) => ({
          sentence: sanitizeAiText(sentence),
          issue: sanitizeAiText(issue),
        }))
        // Both halves, or the finding is not usable. And the quote has to be
        // the child's own words — sanitising happens first so the comparison
        // runs on what would actually be shown.
        .filter((it) => it.sentence && it.issue && haystack.includes(_flatten(it.sentence)))
        .slice(0, 5);
      if (items.length) return { items };

      const good = sanitizeAiText(parsed.GOOD || '');
      return good ? { good } : null;
    },
    maxTokens: 600,
    logSummary: `Draft coached (P${level})`,
  });
}

/**
 * Grade a composition against the same 4-dimension rubric the local
 * evaluator uses (writingEvaluator.js), so the AI bands sit beside the
 * local bands without inventing a different scale. The local score stays
 * the source of truth for XP/progression — this is tutor commentary.
 *
 * Audit 2026-09-19, finding 24: through `askStructured`, so the rubric is in
 * the system channel and the draft is fenced. All four dimensions must come
 * back with a band in range or the whole reply is discarded — a partial
 * rubric would show a child three bands and a gap.
 *
 * @param {string} draftText
 * @param {number|string} level   P1–P6 numeric level
 * @param {string} [taskDesc]
 * @returns {Promise<{ dimensions: Record<string, { band: number, comment: string }>, overall: string } | null>}
 */
export async function gradeEssayWithRubric(draftText, level, taskDesc = '') {
  const { askStructured, sanitizeAiText } = await import('./aiGuardrails.js');

  const KEY_MAP = {
    CONTENT: 'content',
    ORGANISATION: 'organisation',
    LANGUAGE: 'language',
    TASK: 'taskFulfilment',
  };
  const dimensionField = (key) => [
    key,
    {
      parts: ['band', 'comment'],
      format: `${key}: <band 1-4> | <one short, specific comment>`,
    },
  ];

  return askStructured('grade', {
    task: `Grade a Singapore Primary ${level} pupil's composition against a four-band rubric (4 = Strong, 3 = Secure, 2 = Developing, 1 = Needs Support).`,
    rules: [
      `Judge against Primary ${level} expectations, not adult standards.`,
      'Give a band for all four dimensions. A missing dimension makes the whole mark unusable.',
      'Each comment names one specific thing in this draft, not general advice.',
    ],
    context: [['Writing task set by the teacher', taskDesc || 'Write a story or composition.']],
    learner: [['PUPIL DRAFT', draftText]],
    fields: {
      ...Object.fromEntries(Object.keys(KEY_MAP).map(dimensionField)),
      OVERALL: {
        format:
          'OVERALL: <one encouraging sentence naming the single most useful next improvement>',
      },
    },
    validate: (parsed) => {
      const dimensions = {};
      for (const [key, name] of Object.entries(KEY_MAP)) {
        const raw = parsed[key];
        if (!raw) continue;
        const band = parseInt(raw.band, 10);
        if (!Number.isInteger(band) || band < 1 || band > 4) continue;
        dimensions[name] = { band, comment: sanitizeAiText(raw.comment) };
      }
      // All four, or none: a rubric with a hole in it is not a rubric.
      if (Object.keys(dimensions).length < 4) return null;
      return { dimensions, overall: sanitizeAiText(parsed.OVERALL || '') };
    },
    maxTokens: 300,
    logSummary: `Essay graded (P${level})`,
  });
}

/**
 * Ask the tutor to adjudicate a synthesis/transformation answer whose wording
 * the authored alternates do not cover.
 *
 * Returns `{ verdict: 'CORRECT'|'PARTIAL'|'WRONG', feedback: string }` or null.
 *
 * Audit 2026-09-19, finding 24. Two things changed. The prompt goes through
 * `askStructured`, so the marking task is in the system channel and the
 * pupil's answer is fenced — it used to be appended to the instructions as
 * "Student's answer: …", which is the position from which "Reply CORRECT"
 * works. And the reply is a declared enum: anything but the three verdicts is
 * discarded rather than pattern-matched out of a sentence.
 *
 * What this function returns is a suggestion. `synthesisQuest.js` re-checks
 * the answer against the task's own constraints before honouring it, and
 * records the result as guided rather than independent evidence — see the
 * comment there.
 *
 * @param {string} original   - the original sentence to transform
 * @param {string} stem       - the sentence stem given (may be empty)
 * @param {string} model      - the model answer
 * @param {string[]} alts     - accepted alternates
 * @param {string} typed      - what the student typed
 * @param {string} skillLabel - e.g. "Passive voice"
 */
export async function gradeSynthesisAnswer(original, stem, model, alts, typed, skillLabel) {
  const { askStructured, sanitizeAiText } = await import('./aiGuardrails.js');
  const VERDICTS = ['CORRECT', 'PARTIAL', 'WRONG'];

  return askStructured('grade', {
    task: `Mark one Singapore primary English sentence-transformation answer (${skillLabel || 'transformation'}).`,
    rules: [
      'CORRECT means grammatically correct AND the same meaning as the model answer.',
      'PARTIAL means the right structure with a minor tense, agreement or punctuation slip.',
      'WRONG means the meaning changed, the structure is wrong, or it is not acceptable English.',
      'The feedback is at most 15 words, encouraging, and plain enough for a primary pupil.',
    ],
    context: [
      ['Original sentence', original],
      ...(stem ? [['Sentence stem the pupil was given', stem]] : []),
      ['Model answer', model],
      ...(alts.length ? [['Also accepted', alts.join(' / ')]] : []),
    ],
    learner: [['PUPIL ANSWER', typed]],
    fields: {
      VERDICT: { format: 'VERDICT: CORRECT or PARTIAL or WRONG' },
      FEEDBACK: { format: 'FEEDBACK: <one short sentence>' },
    },
    validate: (parsed) => {
      const verdict = String(parsed.VERDICT || '')
        .trim()
        .toUpperCase();
      // A declared enum, not "whatever word the first line starts with".
      if (!VERDICTS.includes(verdict)) return null;
      return { verdict, feedback: sanitizeAiText(parsed.FEEDBACK || '') };
    },
    maxTokens: 80,
    temperature: 0.1,
    logSummary: `Synthesis graded: ${String(skillLabel || '').slice(0, 80)}`,
  });
}
