/**
 * PhonicsQuest – Teacher feedback engine
 *
 * One feedback voice for every Primary English mode.
 *
 * Before this module each mode wrote its own reply to a wrong answer, and the
 * replies ranged from a full hint ladder (Cloze Castle) to a bare
 * "❌ Not quite. Correct answer: were" (MCQ). Worse, the weakest of them did
 * the one thing a teacher never does: hand over the answer on the first
 * mistake, with nothing in between.
 *
 * What a teacher actually does, and what this module implements:
 *
 *   1. **Withhold the answer once.** The first wrong attempt gets a *cue* —
 *      a prompt that points at the evidence in the question and hands the
 *      thinking back. ("There is a word here that tells you WHEN. Find it.")
 *   2. **Name the slip on the second.** Not "wrong" but "you matched the verb
 *      to the closest word instead of the real subject", followed by the
 *      rule, a worked example, the answer, and the habit to use next time.
 *   3. **Explain the successes too.** A correct answer gets one line of *why*
 *      it works, because a right answer for the wrong reason is not learning.
 *   4. **Remember across questions.** The third time the same misconception
 *      appears it is named as a pattern, not treated as a fresh surprise.
 *   5. **Ask for the reasoning back.** After a re-teach, a transfer prompt
 *      makes the child say why the answer fits before moving on.
 *
 * The engine is deliberately split in three so each part is testable alone:
 * `misconceptions.js` (what can go wrong), `answerDiagnosis.js` (which one
 * did), and this file (what to say about it, and when).
 */

import { escapeHtml } from '../utils/escapeHtml.js';
import { store } from './store.js';
import { diagnoseAnswer, diagnoseWrittenAnswer } from './answerDiagnosis.js';
import { getMisconception, isFallbackMisconception } from './misconceptions.js';

/** Attempts allowed before the answer is revealed. One free re-think. */
export const DEFAULT_MAX_ATTEMPTS = 2;

/** Times a misconception must recur before it is named as a pattern. */
export const PATTERN_THRESHOLD = 3;

/** How long a misconception stays "live" in the pattern log. */
export const PATTERN_LOOKBACK_DAYS = 14;

/** Consecutive clean answers on a skill that clear its pattern flag. */
const RESOLVE_STREAK = 3;

/**
 * @typedef {object} FeedbackSection
 * @property {string} kind   'cue'|'noticed'|'rule'|'example'|'evidence'|'answer'|'strategy'|'pattern'|'transfer'|'why'
 * @property {string} [label]
 * @property {string} [text] plain text — escaped on render
 * @property {string} [html] pre-trusted authored HTML — rendered as-is
 */

/**
 * @typedef {object} TeacherFeedback
 * @property {'praise'|'praise-recovered'|'coach'|'reteach'} stage
 * @property {boolean} correct
 * @property {boolean} revealAnswer
 * @property {boolean} allowRetry
 * @property {string} headline
 * @property {FeedbackSection[]} sections
 * @property {string|null} misconceptionId
 * @property {string|null} misconceptionLabel
 * @property {{ count: number, childName: string, label: string }|null} pattern
 */

// ── Pattern log ───────────────────────────────────────────────────────────

function _today() {
  return new Date().toISOString();
}

function _daysSince(iso) {
  const then = Date.parse(iso || '');
  if (Number.isNaN(then)) return Infinity;
  return (Date.now() - then) / 86_400_000;
}

function _readLog() {
  const log = store.get('misconceptionLog');
  return log && typeof log === 'object' ? log : {};
}

/**
 * Record one occurrence of a misconception.
 *
 * The log is small and bounded — one entry per misconception id, not per
 * attempt — so it stays in localStorage alongside the rest of progress
 * rather than in the offloaded event log.
 *
 * @param {string} id
 * @param {{ skill?: string, mode?: string }} [context]
 * @returns {{ count: number, skills: Record<string, number> }}
 */
export function recordMisconception(id, { skill = '', mode = '' } = {}) {
  if (!id) return { count: 0, skills: {} };
  const log = { ..._readLog() };
  const prev = log[id] && typeof log[id] === 'object' ? log[id] : null;
  const stale = prev && _daysSince(prev.lastSeen) > PATTERN_LOOKBACK_DAYS;

  const entry =
    stale || !prev
      ? { count: 0, skills: {}, modes: {}, firstSeen: _today(), lastSeen: _today(), cleanStreak: 0 }
      : { ...prev, skills: { ...prev.skills }, modes: { ...prev.modes } };

  entry.count = (entry.count || 0) + 1;
  entry.lastSeen = _today();
  entry.cleanStreak = 0;
  if (skill) entry.skills[skill] = (entry.skills[skill] || 0) + 1;
  if (mode) entry.modes[mode] = (entry.modes[mode] || 0) + 1;

  log[id] = entry;
  store.set('misconceptionLog', log);
  return entry;
}

/**
 * Credit a clean answer against a misconception. Three in a row retire the
 * pattern, so a fixed habit stops being mentioned.
 * @param {string} id
 */
export function creditMisconception(id) {
  if (!id) return;
  const log = _readLog();
  const prev = log[id];
  if (!prev || typeof prev !== 'object') return;
  const cleanStreak = (prev.cleanStreak || 0) + 1;
  const next = { ...log };
  if (cleanStreak >= RESOLVE_STREAK) {
    delete next[id];
  } else {
    next[id] = { ...prev, cleanStreak };
  }
  store.set('misconceptionLog', next);
}

/**
 * Log every named misconception in a batch-marked review.
 *
 * The cloze modes mark a whole passage at once rather than one answer at a
 * time, so they cannot go through `buildTeacherFeedback`'s per-attempt path.
 * This keeps their slips in the same cross-mode pattern log — a child who
 * mixes up a/an in Cloze Castle and again in Grammar MCQ should be told it is
 * the same habit, not two unrelated mistakes.
 *
 * @param {Array<{misconceptionId?: string|null, status?: string, skillTag?: string}>} rows
 * @param {{ mode?: string }} [options]
 */
export function recordMisconceptionsFromReview(rows = [], { mode = '' } = {}) {
  for (const row of rows) {
    if (!row?.misconceptionId) continue;
    if (row.status === 'Correct') continue;
    recordMisconception(row.misconceptionId, { skill: row.skillTag || '', mode });
  }
}

/**
 * The live pattern for a misconception, or null when it has not recurred
 * often enough (or has gone stale) to be worth naming.
 * @param {string} id
 */
export function getMisconceptionPattern(id) {
  // Placeholders are not habits — see FALLBACK_MISCONCEPTION_IDS.
  if (isFallbackMisconception(id)) return null;
  const entry = _readLog()[id];
  if (!entry || typeof entry !== 'object') return null;
  if (_daysSince(entry.lastSeen) > PATTERN_LOOKBACK_DAYS) return null;
  if ((entry.count || 0) < PATTERN_THRESHOLD) return null;
  const misconception = getMisconception(id);
  if (!misconception) return null;
  return {
    id,
    count: entry.count,
    childName: misconception.childName,
    label: misconception.label,
    selfCheck: misconception.selfCheck,
  };
}

/**
 * Live patterns, strongest first — the raw material for the parent report and
 * for targeted practice suggestions.
 * @param {number} [limit]
 */
export function getMisconceptionSummary(limit = 5) {
  return Object.entries(_readLog())
    .filter(
      ([id, entry]) =>
        getMisconception(id) &&
        !isFallbackMisconception(id) &&
        entry &&
        typeof entry === 'object' &&
        _daysSince(entry.lastSeen) <= PATTERN_LOOKBACK_DAYS &&
        (entry.count || 0) >= 2,
    )
    .map(([id, entry]) => {
      const misconception = getMisconception(id);
      return {
        id,
        count: entry.count,
        label: misconception.label,
        childName: misconception.childName,
        rule: misconception.rule,
        selfCheck: misconception.selfCheck,
        skills: Object.keys(entry.skills || {}),
        modes: Object.keys(entry.modes || {}),
        lastSeen: entry.lastSeen,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, Math.max(0, limit));
}

// ── Feedback construction ─────────────────────────────────────────────────

function _stripTags(value) {
  return String(value ?? '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Build the teacher's response to one answer.
 *
 * @param {object} params
 * @param {boolean} params.correct        whether the answer was right
 * @param {string} [params.given]         what the child answered
 * @param {string} [params.answer]        the expected answer
 * @param {string} [params.stem]          the question text
 * @param {string[]} [params.choices]
 * @param {string} [params.skill]         skill/category key, for the pattern log
 * @param {string} [params.skillLabel]    human label for that skill
 * @param {string} [params.domain]        'grammar'|'vocab'|'spelling'|'comprehension'|'writing'
 * @param {string} [params.mode]          mode key, for the pattern log
 * @param {number} [params.attempt]       1-based attempt number
 * @param {number} [params.maxAttempts]   attempts before the answer is revealed
 * @param {string} [params.authoredExplanation] item-specific explanation (may contain light HTML)
 * @param {string} [params.cue]           first-attempt cue override (e.g. "Listen again")
 * @param {string} [params.rule]          rule override (e.g. from grammarTips)
 * @param {string} [params.example]       worked-example override
 * @param {string[]} [params.clueWords]   words in the stem that decide the answer
 * @param {boolean} [params.track]        write to the pattern log (default true)
 * @param {object} [params.diagnosis]     pre-computed diagnosis, to avoid re-running it
 * @returns {TeacherFeedback}
 */
export function buildTeacherFeedback({
  correct,
  given = '',
  answer = '',
  stem = '',
  choices = [],
  skill = '',
  skillLabel = '',
  domain = 'grammar',
  mode = '',
  attempt = 1,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  authoredExplanation = '',
  cue = '',
  rule = '',
  example = '',
  clueWords = [],
  track = true,
  diagnosis = null,
} = {}) {
  const attemptNo = Math.max(1, Number(attempt) || 1);
  const attemptCap = Math.max(1, Number(maxAttempts) || DEFAULT_MAX_ATTEMPTS);

  if (correct) {
    return _buildPraise({
      attemptNo,
      rule,
      example,
      authoredExplanation,
      answer,
      skill,
      skillLabel,
      domain,
      given,
      stem,
      choices,
      track,
      diagnosis,
    });
  }

  const diag =
    diagnosis || diagnoseAnswer({ stem, given, correct: answer, choices, skill, domain });
  const misconception = diag.misconception;
  const isFinal = attemptNo >= attemptCap;

  if (track && isFinal) recordMisconception(diag.id, { skill, mode });
  const pattern = isFinal ? getMisconceptionPattern(diag.id) : null;

  return isFinal
    ? _buildReteach({
        diag,
        misconception,
        pattern,
        given,
        answer,
        rule,
        example,
        authoredExplanation,
        clueWords,
        skillLabel,
      })
    : _buildCoach({ diag, misconception, cue, clueWords, attemptNo, attemptCap });
}

function _buildPraise({
  attemptNo,
  rule,
  example,
  authoredExplanation,
  answer,
  skill,
  skillLabel,
  domain,
  given,
  stem,
  choices,
  track,
  diagnosis,
}) {
  const recovered = attemptNo > 1;

  // A correct answer is evidence against whatever misconception the item
  // targets, so credit the pattern log — this is what lets a fixed habit
  // stop being mentioned.
  if (track) {
    const diag =
      diagnosis ||
      diagnoseAnswer({
        stem,
        given: given || answer,
        correct: answer,
        choices,
        skill,
        domain,
      });
    if (diag?.id) creditMisconception(diag.id);
  }

  /** @type {FeedbackSection[]} */
  const sections = [];

  if (recovered) {
    sections.push({
      kind: 'why',
      text: 'You looked again and found it yourself. That second check is the skill — keep using it.',
    });
  }

  const why = _stripTags(authoredExplanation) || rule;
  if (why) {
    sections.push({ kind: 'why', label: 'Why it works', text: why });
  } else if (skillLabel) {
    sections.push({
      kind: 'why',
      label: 'Why it works',
      text: `That is ${skillLabel} used correctly.`,
    });
  }
  if (recovered && example) sections.push({ kind: 'example', label: 'Remember', text: example });

  return {
    stage: recovered ? 'praise-recovered' : 'praise',
    correct: true,
    revealAnswer: false,
    allowRetry: false,
    headline: recovered ? 'Got it on the second look ✓' : 'Correct ✓',
    sections,
    misconceptionId: null,
    misconceptionLabel: null,
    pattern: null,
  };
}

function _buildCoach({ diag, misconception, cue, clueWords, attemptNo, attemptCap }) {
  /** @type {FeedbackSection[]} */
  const sections = [{ kind: 'cue', text: cue || misconception.cue }];

  if (diag.evidence) {
    sections.push({
      kind: 'evidence',
      label: 'Look at',
      text: diag.evidence,
    });
  } else if (clueWords && clueWords.length) {
    sections.push({
      kind: 'evidence',
      label: 'Look at',
      text: clueWords.join(', '),
    });
  }

  const remaining = attemptCap - attemptNo;
  sections.push({
    kind: 'strategy',
    text:
      remaining > 1
        ? `You have ${remaining} more tries.`
        : 'One more try — then we will work through it together.',
  });

  return {
    stage: 'coach',
    correct: false,
    revealAnswer: false,
    allowRetry: true,
    headline: 'Not yet — have another look',
    sections,
    misconceptionId: diag.id,
    misconceptionLabel: misconception.label,
    pattern: null,
  };
}

function _buildReteach({
  diag,
  misconception,
  pattern,
  given,
  answer,
  rule,
  example,
  authoredExplanation,
  clueWords,
  skillLabel,
}) {
  /** @type {FeedbackSection[]} */
  const sections = [];

  // When no detector matched, the misconception is the domain fallback — a
  // placeholder, not a finding. Naming it ("that is a rule that has not
  // clicked yet") reads as evasion, so say the honest thing instead.
  const named = diag.matched;
  const noticed = given
    ? named
      ? `You chose "${given}". That is ${misconception.childName}.`
      : `You chose "${given}". Let's look at why "${answer}" fits better.`
    : `This one is about ${misconception.childName}.`;
  sections.push({ kind: 'noticed', text: noticed });

  if (authoredExplanation) {
    sections.push({ kind: 'why', html: authoredExplanation });
  }

  if (diag.evidence) {
    sections.push({ kind: 'evidence', label: 'The clue was', text: diag.evidence });
  } else if (clueWords && clueWords.length) {
    sections.push({ kind: 'evidence', label: 'The clue was', text: clueWords.join(', ') });
  }

  if (answer) {
    sections.push({ kind: 'answer', label: 'Answer', text: String(answer) });
  }

  sections.push({ kind: 'rule', label: 'The rule', text: rule || misconception.rule });
  sections.push({ kind: 'example', label: 'Like this', text: example || misconception.example });
  sections.push({ kind: 'strategy', label: 'Next time', text: misconception.selfCheck });

  if (pattern) {
    sections.push({
      kind: 'pattern',
      label: 'I have seen this before',
      text: `That is ${pattern.count} times recently${skillLabel ? ` in ${skillLabel}` : ''}. Let us make it your focus: ${misconception.selfCheck}`,
    });
  }

  sections.push({
    kind: 'transfer',
    text: answer
      ? `Before you move on: say out loud why "${answer}" fits here. Which word in the question proves it?`
      : 'Before you move on: say out loud why that answer fits.',
  });

  return {
    stage: 'reteach',
    correct: false,
    revealAnswer: true,
    allowRetry: false,
    headline: named ? `Let's fix ${misconception.childName}` : "Let's work through this one",
    sections,
    misconceptionId: diag.id,
    misconceptionLabel: misconception.label,
    pattern,
  };
}

/**
 * Feedback for a typed / free-text answer. Same ladder, but the diagnosis
 * comes from comparing against a model answer rather than a chosen option.
 *
 * @param {object} params  as `buildTeacherFeedback`, plus:
 * @param {string} [params.model]          the model answer
 * @param {string[]} [params.requiredWords] words the answer must contain
 */
export function buildWrittenFeedback({
  correct,
  given = '',
  model = '',
  answer = '',
  requiredWords = [],
  ...rest
} = {}) {
  const expected = answer || model;
  const diagnosis = correct
    ? null
    : diagnoseWrittenAnswer({
        given,
        model: expected,
        stem: rest.stem || '',
        requiredWords,
        domain: rest.domain || 'writing',
      });
  return buildTeacherFeedback({
    ...rest,
    correct,
    given,
    answer: expected,
    diagnosis,
  });
}

// ── Rendering ─────────────────────────────────────────────────────────────

const SECTION_ICONS = Object.freeze({
  cue: '🔎',
  noticed: '👀',
  why: '💡',
  evidence: '🔍',
  answer: '✅',
  rule: '📘',
  example: '✏️',
  strategy: '🧭',
  pattern: '📊',
  transfer: '🗣️',
});

function _renderSection(section) {
  const icon = SECTION_ICONS[section.kind] || '•';
  const label = section.label
    ? `<strong class="tf-section__label">${escapeHtml(section.label)}:</strong> `
    : '';
  // `html` carries authored content from the item banks, which has always
  // been allowed light formatting (<strong>, <em>). `text` is escaped.
  const body = section.html != null ? section.html : escapeHtml(section.text || '');
  return `<p class="tf-section tf-section--${section.kind}"><span class="tf-section__icon" aria-hidden="true">${icon}</span> ${label}${body}</p>`;
}

/**
 * Render feedback to the shared HTML anatomy every primary mode uses.
 * @param {TeacherFeedback} feedback
 * @returns {string}
 */
export function renderTeacherFeedbackHtml(feedback) {
  if (!feedback) return '';
  const sections = (feedback.sections || []).map(_renderSection).join('');
  return (
    `<div class="tf-feedback tf-feedback--${feedback.stage}">` +
    `<p class="tf-headline">${escapeHtml(feedback.headline)}</p>` +
    sections +
    '</div>'
  );
}

/**
 * Plain-text rendering — used for screen-reader announcements and for tests
 * that should not depend on markup.
 * @param {TeacherFeedback} feedback
 * @returns {string}
 */
export function teacherFeedbackText(feedback) {
  if (!feedback) return '';
  const parts = [feedback.headline];
  for (const section of feedback.sections || []) {
    const body = _stripTags(section.html != null ? section.html : section.text);
    if (!body) continue;
    parts.push(section.label ? `${section.label}: ${body}` : body);
  }
  return parts.join(' ');
}

export const __TEST__ = { RESOLVE_STREAK, _readLog };
