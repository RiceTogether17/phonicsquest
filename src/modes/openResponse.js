/**
 * PhonicsQuest – Open response
 *
 * Turns a read-only "here is the question, here is the model answer" block
 * into something a child can actually do.
 *
 * Three library modules shipped as answer keys: Visual Text Comprehension
 * (63 questions), Open-ended Comprehension (107) and Situational Writing (20)
 * rendered every question with a `Show model answer` toggle and **zero input
 * elements**. There was nothing to do but read the answer, which is the one
 * study behaviour that reliably teaches nothing.
 *
 * ## Why this does not auto-mark
 *
 * The banks carry `{ q, model }` and no marking key — no keywords, no required
 * groups. Marking "3 people" against "Three — Sarah and her two parents (she
 * is the only child)" by string comparison fails a correct answer, and a
 * marking system that is confidently wrong is worse than none. So the loop is:
 *
 *   1. the child writes their answer (the input that was missing);
 *   2. they commit it — the answer is locked before the model is revealed, so
 *      this cannot become copy-the-answer;
 *   3. the model appears with an **idea checklist** (`ideaOverlap.js`) showing
 *      which of the model's ideas their wording covered and which it did not;
 *   4. they self-mark against it — got it / partly / not yet.
 *
 * Step 2 is what makes step 4 worth anything. Step 3 is what makes the
 * self-mark a judgement rather than a guess.
 *
 * ## What it records
 *
 * A self-mark is a self-report, so it is recorded at the `guided` evidence
 * ceiling and can never support a mastery claim — the same rule Priority 0
 * applied to Blend It!'s "Yes! ✓". See `VALIDITY_ROADMAP.md`.
 */

import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';
import { compareToModel } from './scoring/ideaOverlap.js';
import { questMastery } from '../modules/questMastery.js';
import { store } from '../modules/store.js';
import { EVIDENCE } from '../modules/evidence.js';

/** Self-mark options. `value` is what gets recorded. */
export const SELF_MARKS = Object.freeze([
  { key: 'got', label: '✅ I got this', value: 1 },
  { key: 'partly', label: '◐ Partly — I missed something', value: 0.5 },
  { key: 'not-yet', label: '○ Not yet', value: 0 },
]);

/**
 * The answer box for one open question.
 *
 * @param {object} params
 * @param {string} params.id      unique within the page
 * @param {string} params.model   the model answer, revealed only after commit
 * @param {string} [params.skill] skill tag recorded with the self-mark
 * @param {string} [params.placeholder]
 * @returns {string}
 */
export function renderOpenResponseHtml({
  id,
  model,
  skill = '',
  placeholder = 'Write your answer…',
}) {
  const key = escapeAttr(id);
  return `
    <div class="open-response" data-open-response="${key}" data-model="${escapeAttr(model)}" data-skill="${escapeAttr(skill)}">
      <label class="open-response__label" for="or-input-${key}">Your answer</label>
      <textarea id="or-input-${key}" class="open-response__input" rows="3"
                placeholder="${escapeAttr(placeholder)}"></textarea>
      <div class="open-response__actions">
        <button type="button" class="btn btn--primary btn--sm" data-or-check>Check my answer</button>
      </div>
      <div class="open-response__result" data-or-result hidden aria-live="polite"></div>
    </div>`;
}

/** The model answer plus the idea checklist, shown once the answer is locked. */
function _resultHtml(given, model) {
  const { covered, missing, answered } = compareToModel(given, model);

  if (!answered) {
    return `<p class="open-response__empty">Write something first — even a partial answer is worth more than a blank.</p>`;
  }

  const chips = (words, kind) =>
    words
      .map(
        (w) =>
          `<span class="open-response__idea open-response__idea--${kind}">${escapeHtml(w)}</span>`,
      )
      .join(' ');

  const checklist =
    covered.length || missing.length
      ? `
      <div class="open-response__ideas">
        <p class="open-response__ideas-title">Ideas from the model answer</p>
        ${covered.length ? `<p class="open-response__ideas-row">✓ In your answer: ${chips(covered, 'covered')}</p>` : ''}
        ${missing.length ? `<p class="open-response__ideas-row">• Not mentioned: ${chips(missing, 'missing')}</p>` : ''}
        <p class="open-response__ideas-note">This is a word check, not a mark — you can express the same idea in different words. Read both answers and decide for yourself.</p>
      </div>`
      : '';

  return `
    <p class="open-response__yours"><strong>You wrote:</strong> ${escapeHtml(given)}</p>
    <p class="open-response__model"><strong>Model answer:</strong> ${escapeHtml(model)}</p>
    ${checklist}
    <fieldset class="open-response__mark">
      <legend class="open-response__mark-legend">How did yours compare?</legend>
      ${SELF_MARKS.map(
        (m) =>
          `<button type="button" class="btn btn--ghost btn--sm open-response__mark-btn" data-or-mark="${m.key}">${m.label}</button>`,
      ).join('')}
    </fieldset>`;
}

/**
 * Wire every open-response box inside a container.
 *
 * @param {ParentNode|null} container
 * @param {object} [opts]
 * @param {string} [opts.quest]  quest key recorded against the self-mark
 * @param {string} [opts.level]
 * @param {(result: {id: string, mark: string, value: number, skill: string}) => void} [opts.onMark]
 */
export function attachOpenResponses(
  container,
  { quest = 'openResponse', level = null, onMark } = {},
) {
  if (!container) return;

  for (const box of container.querySelectorAll('[data-open-response]')) {
    const input = /** @type {HTMLTextAreaElement|null} */ (
      box.querySelector('.open-response__input')
    );
    const result = box.querySelector('[data-or-result]');
    const checkBtn = box.querySelector('[data-or-check]');
    if (!input || !result || !checkBtn) continue;

    checkBtn.addEventListener('click', () => {
      const given = input.value.trim();
      const model = box.getAttribute('data-model') || '';
      result.hidden = false;
      result.innerHTML = _resultHtml(given, model);

      if (!given) {
        input.focus();
        return;
      }

      // Lock the answer before the model is visible: an editable box next to
      // a revealed model answer is a copying exercise, not a check.
      input.readOnly = true;
      checkBtn.disabled = true;
      box.classList.add('open-response--checked');

      for (const markBtn of result.querySelectorAll('[data-or-mark]')) {
        markBtn.addEventListener('click', () => {
          const key = markBtn.getAttribute('data-or-mark');
          const mark = SELF_MARKS.find((m) => m.key === key);
          if (!mark) return;

          for (const b of result.querySelectorAll('[data-or-mark]')) {
            b.classList.toggle('open-response__mark-btn--picked', b === markBtn);
            b.setAttribute('aria-pressed', String(b === markBtn));
          }

          const skill = box.getAttribute('data-skill') || 'comprehension';
          // A self-mark is a self-report: it counts as practice, never as
          // proof. `guided` is the ceiling, as with every self-assessed mode.
          questMastery.updateSkill(quest, skill, mark.value >= 1);
          store.recordLearningEvent?.({
            eventType: 'open_response_self_mark',
            quest,
            skill,
            correct: mark.value >= 1,
            level,
            evidence: EVIDENCE.GUIDED,
            meta: { mark: mark.key, selfAssessed: true },
          });

          onMark?.({
            id: box.getAttribute('data-open-response') || '',
            mark: mark.key,
            value: mark.value,
            skill,
          });
        });
      }
    });
  }
}
