/**
 * PhonicsQuest – MCQ feedback
 *
 * Shared answer handling for Grammar MCQ and Vocabulary MCQ. Both modes had
 * an identical ~60-line click handler that marked the answer, revealed the
 * correct choice immediately and printed a one-line verdict. That handler now
 * lives here once and runs the teacher-feedback ladder instead:
 *
 *   first wrong tap  → the wrong choice is disabled, the others stay live,
 *                      and the child gets a cue pointing at the evidence.
 *                      The answer is NOT revealed.
 *   second wrong tap → the answer is revealed with the misconception named,
 *                      the rule, a worked example and a next-time habit.
 *   correct          → one line saying why it works.
 *
 * **Measurement is unchanged.** Mastery, the session score and the streak are
 * all recorded from the FIRST attempt only, exactly as before — the retry is a
 * teaching move, not a second chance at the mark. This mirrors the early-reading
 * `choiceRound` controller, which has always scored first attempts only.
 */

import { explainMistake, getAdaptiveHint } from '../modules/aiService.js';
import { attachAskGiriButton } from '../components/askGiriButton.js';
import {
  DEFAULT_MAX_ATTEMPTS,
  buildTeacherFeedback,
  renderTeacherFeedbackHtml,
} from '../modules/teacherFeedback.js';

/**
 * Authored option explanations open with their own verdict — "Correct — use
 * 'an' before vowel sounds", "Wrong — 'the' is for a specific noun" — because
 * the old renderer had no structure to carry one. The feedback card states the
 * verdict in its headline, so the prefix now reads as a stutter. Strip it.
 */
function stripVerdictPrefix(text) {
  return String(text ?? '').replace(
    /^\s*(?:[✅❌]\s*)?(?:correct|wrong|incorrect|not quite|almost)\s*[—–\-:,.]\s*/i,
    '',
  );
}

/**
 * Build the feedback for one MCQ attempt.
 *
 * Authored per-option explanations still win over the generic diagnosis —
 * a human sentence about *this* distractor beats a detected category — but
 * the diagnosis supplies the rule, example, habit and pattern tracking that
 * the authored text never carried.
 *
 * @param {object} params
 * @param {object} params.item            the MCQ item ({ q, answer, choices, … })
 * @param {string} params.selectedChoice
 * @param {boolean} params.isCorrect
 * @param {number} [params.attempt]       1-based attempt number
 * @param {number} [params.maxAttempts]
 * @param {string} [params.domain]        'grammar' | 'vocab'
 * @param {string} [params.mode]          mode key for the pattern log
 * @param {string} [params.skillLabel]
 * @param {{rule?: string, example?: string}} [params.tip]  category rule card
 * @param {string} [params.cue]           first-attempt cue override
 * @param {boolean} [params.showClueWords]
 * @returns {import('../modules/teacherFeedback.js').TeacherFeedback}
 */
export function buildMcqFeedback({
  item,
  selectedChoice,
  isCorrect,
  attempt = 1,
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  domain = 'grammar',
  mode = '',
  skillLabel = '',
  tip = null,
  cue = '',
  showClueWords = true,
} = {}) {
  const authored = stripVerdictPrefix(
    item?.optionExplanations?.[selectedChoice] || item?.reasoning || item?.explain || '',
  );

  return buildTeacherFeedback({
    correct: isCorrect,
    given: selectedChoice,
    answer: item?.answer,
    stem: item?.q,
    choices: item?.choices || [],
    skill: item?.category || '',
    skillLabel,
    domain,
    mode,
    attempt,
    maxAttempts,
    authoredExplanation: authored,
    cue,
    rule: tip?.rule || '',
    example: tip?.example || '',
    clueWords: showClueWords ? item?.clueWords || [] : [],
  });
}

/**
 * Wire an MCQ round's choice buttons to the feedback ladder.
 *
 * @param {object} params
 * @param {ParentNode} params.root            container holding `[data-choice]` buttons
 * @param {object} params.item
 * @param {HTMLElement|null} params.feedbackEl
 * @param {HTMLElement|null} [params.nextWrap]
 * @param {HTMLElement|null} [params.nextBtn]
 * @param {string} params.mode                'grammarMcq' | 'vocabMcq'
 * @param {string} [params.domain]
 * @param {string} [params.skillLabel]
 * @param {string} [params.level]
 * @param {boolean} [params.showClueWords]
 * @param {{rule?: string, example?: string}} [params.tip]
 * @param {string} [params.cue]               first-attempt cue override
 * @param {number} [params.maxAttempts]
 * @param {(correct: boolean, chosen: string) => void} [params.onFirstAttempt]
 *        the measurement hook — fires exactly once, on the first tap
 * @param {(result: {correct: boolean, attempts: number, chosen: string}) => void} [params.onResolved]
 *        fires once when the item is finished, whether solved or re-taught
 * @param {(chosen: string, correct: boolean) => string} [params.extraHtml]
 *        mode-specific additions (remediation redirects, rule reminders)
 */
export function attachMcqAnswerLadder({
  root,
  item,
  feedbackEl,
  nextWrap = null,
  nextBtn = null,
  mode = '',
  domain = 'grammar',
  skillLabel = '',
  level = '',
  showClueWords = true,
  tip = null,
  cue = '',
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  onFirstAttempt = null,
  onResolved = null,
  extraHtml = null,
} = {}) {
  if (!root || !item) return;

  const buttons = Array.from(root.querySelectorAll('[data-choice]'));
  let attempt = 0;
  let resolved = false;

  const disableAll = () => {
    for (const b of buttons) {
      b.disabled = true;
      b.setAttribute('aria-disabled', 'true');
      if (b.dataset.choice === item.answer) b.classList.add('pt-choice--correct');
    }
  };

  const showNext = () => {
    if (!nextWrap || !nextBtn) return;
    nextWrap.style.display = '';
    nextBtn.focus();
  };

  const onChoice = (btn) => {
    if (resolved) return;
    const chosen = btn.dataset.choice;
    const correct = chosen === item.answer;
    attempt += 1;

    // The mark is the first attempt, always. Retries teach; they do not score.
    if (attempt === 1) onFirstAttempt?.(correct, chosen);

    const feedback = buildMcqFeedback({
      item,
      selectedChoice: chosen,
      isCorrect: correct,
      attempt,
      maxAttempts,
      domain,
      mode,
      skillLabel,
      tip,
      cue,
      showClueWords,
    });

    if (feedbackEl) {
      let html = renderTeacherFeedbackHtml(feedback);
      const extra = extraHtml?.(chosen, correct);
      if (extra) html += extra;
      feedbackEl.innerHTML = html;
      // Modes hide the feedback slot in three different ways; unhide them all.
      feedbackEl.hidden = false;
      if (feedbackEl.style.display === 'none') feedbackEl.style.display = '';
      if (feedback.revealAnswer || correct) {
        attachAskGiri(feedbackEl, { item, selectedChoice: chosen, level });
      }
    }

    if (feedback.allowRetry) {
      // Close off the choice just ruled out, leave the rest live, and keep
      // keyboard focus inside the choice group rather than on a dead button.
      btn.disabled = true;
      btn.setAttribute('aria-disabled', 'true');
      btn.classList.add('pt-choice--wrong');
      buttons.find((b) => !b.disabled)?.focus();
      return;
    }

    resolved = true;
    if (!correct) btn.classList.add('pt-choice--wrong');
    disableAll();
    onResolved?.({ correct, attempts: attempt, chosen });
    showNext();
  };

  for (const btn of buttons) {
    btn.addEventListener('click', () => onChoice(btn));
  }
}

/**
 * Append an on-demand "Ask Giri why ✨" button below the authored feedback.
 *
 * Strictly additive: the authored explanation is already rendered; this
 * only appears when an API key is configured and asks the AI to elaborate
 * in child-safe language. Call after setting the feedback element's HTML.
 *
 * @param {HTMLElement|null} hintEl  the feedback element
 * @param {object} params            { item, selectedChoice, level }
 */
export function attachAskGiri(hintEl, { item, selectedChoice, level = '' } = {}) {
  if (!hintEl || !item) return;
  const authored = item.optionExplanations?.[selectedChoice] || item.explain || '';
  attachAskGiriButton(hintEl, () =>
    explainMistake({
      question: item.q,
      options: item.choices,
      chosen: selectedChoice,
      correct: item.answer,
      authoredExplanation: typeof authored === 'string' ? authored.replace(/<[^>]*>/g, '') : '',
      level,
    }),
  );
}

/**
 * Append a "Giri's hint ✨" button to the rule-hint panel: a question-specific
 * nudge that never names a choice. Sits above the authored rule/example/tip
 * tiers, which remain the offline default.
 *
 * @param {HTMLElement|null} panelEl  the opened rule-hint panel
 * @param {object} params             { item, categoryLabel, level }
 */
export function attachGiriHint(panelEl, { item, categoryLabel = '', level = '' } = {}) {
  if (!panelEl || !item || panelEl.querySelector('.mcq-ask-giri')) return;
  attachAskGiriButton(
    panelEl,
    () =>
      getAdaptiveHint({
        question: item.q,
        options: item.choices,
        correct: item.answer,
        categoryLabel,
        level,
      }),
    {
      label: "Giri's hint for this question ✨",
      ariaLabel: 'Ask Giri for a hint about this question',
    },
  );
}
