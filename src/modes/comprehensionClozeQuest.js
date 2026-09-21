/**
 * PhonicsQuest – Comprehension Cloze Quest
 *
 * Real Paper 2-style open cloze: pupils read a passage and TYPE one
 * suitable word for each blank.  No multiple-choice, no AI marking,
 * no backend.  Pure DOM.
 *
 * Lifecycle (matches the existing primary-placeholder host flow):
 *   initComprehensionClozeQuest(container, { onClose })
 *   cleanupComprehensionClozeQuest()
 *
 * Internal state is module-level so the host screen can mount/unmount
 * by replacing the container's innerHTML (the existing placeholder
 * pattern) without leaking listeners.
 */

import {
  COMPREHENSION_CLOZE_LEVELS,
  getComprehensionClozePassages,
} from '../data/comprehensionClozePassages.js';
import { diagnoseAnswer, stemForBlank } from '../modules/answerDiagnosis.js';
import { recordMisconceptionsFromReview } from '../modules/teacherFeedback.js';
import { questMastery } from '../modules/questMastery.js';
import { store } from '../modules/store.js';
import { EVIDENCE } from '../modules/evidence.js';
import { recordClozeCompletion } from './clozeCompletionTracker.js';

let _container = null;
let _onClose = () => {};
let _currentLevel = null;
let _currentPassage = null;
let _seenPassageIds = new Set();

/**
 * Audit 2026-09-19, finding 16. Two problems, one cause: nothing about a
 * committed answer was persisted, and everything that DID fire ran again on
 * every Check press.
 *
 * `_committedPassageIds` makes the commit once-per-passage, so pressing Check
 * a second time to re-read the explanations cannot bank a second attempt or
 * re-log the same mistake as a fresh one. `_hintsShown` and `_revealed` track
 * the support given, so a score reached after hints or a reveal is not
 * recorded as independent.
 */
let _committedPassageIds = new Set();
let _hintsShown = false;
let _revealed = false;

/**
 * Mount the Comprehension Cloze quest into a container element.
 * @param {HTMLElement} container
 * @param {{ onClose?: () => void }} [opts]
 */
export function initComprehensionClozeQuest(container, opts = {}) {
  if (!container) return;
  _container = container;
  _onClose = typeof opts.onClose === 'function' ? opts.onClose : () => {};
  _currentLevel = null;
  _currentPassage = null;
  _seenPassageIds = new Set();
  _committedPassageIds = new Set();
  _hintsShown = false;
  _revealed = false;
  _renderShell();
  _renderLevelPicker();
}

/**
 * Tear down the quest. Safe to call when not mounted.
 */
export function cleanupComprehensionClozeQuest() {
  if (_container) _container.innerHTML = '';
  _container = null;
  _onClose = () => {};
  _currentLevel = null;
  _currentPassage = null;
  _seenPassageIds = new Set();
  _committedPassageIds = new Set();
  _hintsShown = false;
  _revealed = false;
}

// ── render: shell + level picker ────────────────────────────────────────────

function _renderShell() {
  if (!_container) return;
  _container.innerHTML = `
    <section class="cc-quest" aria-label="Comprehension Cloze">
      <header class="cc-quest__header">
        <p class="cc-quest__paper-link">Paper 2 · Comprehension Cloze</p>
        <p class="cc-quest__blurb">Read each passage and type one suitable word for each blank. Spelling counts; capitals do not.</p>
      </header>
      <div class="cc-quest__body" id="cc-quest-body" aria-live="polite"></div>
      <div class="cc-quest__footer">
        <button class="btn btn--ghost" type="button" data-action="back">← Back to home</button>
      </div>
    </section>`;
  _container.querySelector('[data-action="back"]')?.addEventListener('click', () => _onClose());
}

function _renderLevelPicker() {
  const body = _container?.querySelector('#cc-quest-body');
  if (!body) return;
  const tiles = COMPREHENSION_CLOZE_LEVELS.map((lv) => {
    const count = getComprehensionClozePassages(lv).length;
    return `
      <button class="cc-quest__level-btn" type="button" data-level="${lv}" aria-label="Open ${lv} comprehension cloze passages">
        <span class="cc-quest__level-name">${lv}</span>
        <span class="cc-quest__level-count">${count} passage${count === 1 ? '' : 's'}</span>
      </button>`;
  }).join('');
  body.innerHTML = `
    <div class="cc-quest__picker">
      <p class="cc-quest__picker-prompt">Choose a level to begin:</p>
      <div class="cc-quest__levels" role="list">${tiles}</div>
    </div>`;
  body.querySelectorAll('[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => _startLevel(btn.dataset.level));
  });
}

function _startLevel(level) {
  if (!COMPREHENSION_CLOZE_LEVELS.includes(level)) return;
  _currentLevel = level;
  _seenPassageIds = new Set();
  const passages = getComprehensionClozePassages(level);
  if (!passages.length) return;
  _seenPassageIds.add(passages[0].id);
  _renderPassage(passages[0]);
}

function _pickNextPassage() {
  if (!_currentLevel) return null;
  const passages = getComprehensionClozePassages(_currentLevel);
  if (!passages.length) return null;
  const unseen = passages.filter((p) => !_seenPassageIds.has(p.id));
  if (unseen.length) return unseen[0];
  // All passages at this level have been seen — reset, but skip the
  // current one so we never re-render the same passage twice in a row.
  const currentId = _currentPassage?.id || '';
  _seenPassageIds = currentId ? new Set([currentId]) : new Set();
  const fresh = passages.filter((p) => p.id !== currentId);
  return fresh[0] || passages[0];
}

// ── render: passage with inputs + buttons ───────────────────────────────────

function _renderPassage(passage) {
  // Support is per passage, not per session.
  _hintsShown = false;
  _revealed = false;

  _currentPassage = passage;
  const body = _container?.querySelector('#cc-quest-body');
  if (!body) return;

  const segments = _splitText(passage.text);
  const passageHtml = segments
    .map((seg) => {
      if (seg.type === 'text') return _escapeHtml(seg.value);
      return (
        `<span class="cc-quest__blank-wrap">` +
        `<input class="cc-quest__blank" data-num="${seg.num}" type="text" inputmode="text" ` +
        `autocomplete="off" autocapitalize="off" spellcheck="false" ` +
        `aria-label="Blank ${seg.num}: type one word" placeholder="${seg.num}" />` +
        `<span class="cc-quest__blank-mark" aria-hidden="true"></span>` +
        `</span>`
      );
    })
    .join('');

  body.innerHTML = `
    <article class="cc-quest__passage" data-passage-id="${_escapeAttr(passage.id)}">
      <div class="cc-quest__meta">
        <button class="btn btn--ghost btn--sm" type="button" data-action="back-to-levels">← Levels</button>
        <h3 class="cc-quest__title">${_escapeHtml(passage.title)} <small class="cc-quest__title-level">(${_escapeHtml(passage.level)})</small></h3>
      </div>
      <p class="cc-quest__instructions">Type one suitable word for each blank. Press <kbd>Enter</kbd> to check.</p>
      <p class="cc-quest__text">${passageHtml}</p>
      <p class="cc-quest__score" id="cc-quest-score" aria-live="polite"></p>
      <div class="cc-quest__buttons" role="group" aria-label="Answer actions">
        <button class="btn" type="button" data-action="hint">💡 Show Hints</button>
        <button class="btn btn--primary" type="button" data-action="check">✓ Check Answers</button>
        <button class="btn" type="button" data-action="reveal">👁 Reveal Answers</button>
        <button class="btn btn--ghost" type="button" data-action="another">🔁 Try Another</button>
      </div>
      <section class="cc-quest__hints" id="cc-quest-hints" hidden aria-label="Hints"></section>
      <section class="cc-quest__feedback" id="cc-quest-feedback" hidden aria-label="Per-blank explanations"></section>
    </article>`;

  body
    .querySelector('[data-action="back-to-levels"]')
    ?.addEventListener('click', () => _renderLevelPicker());
  body.querySelector('[data-action="hint"]')?.addEventListener('click', () => _toggleHints());
  body.querySelector('[data-action="check"]')?.addEventListener('click', () => _checkAnswers());
  body.querySelector('[data-action="reveal"]')?.addEventListener('click', () => _revealAnswers());
  body.querySelector('[data-action="another"]')?.addEventListener('click', () => _tryAnother());

  body.querySelectorAll('.cc-quest__blank').forEach((input) => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        _checkAnswers();
      }
    });
  });
}

// ── interactions ────────────────────────────────────────────────────────────

function _toggleHints() {
  if (!_currentPassage) return;
  const host = _container?.querySelector('#cc-quest-hints');
  if (!host) return;
  if (host.dataset.populated === 'true' && !host.hidden) {
    host.hidden = true;
    return;
  }
  host.innerHTML = `
    <h4 class="cc-quest__feedback-title">Hints</h4>
    <ol class="cc-quest__hint-list">
      ${_currentPassage.blanks
        .map((b) => `<li><strong>${b.num}.</strong> ${_escapeHtml(b.hint)}</li>`)
        .join('')}
    </ol>`;
  host.dataset.populated = 'true';
  host.hidden = false;
  _hintsShown = true;
}

function _checkAnswers() {
  if (!_currentPassage) return { correct: 0, total: 0 };
  let correct = 0;
  const rows = [];
  for (const blank of _currentPassage.blanks) {
    const input = _container?.querySelector(`.cc-quest__blank[data-num="${blank.num}"]`);
    const userValue = (input?.value || '').trim();
    const isCorrect = _isAnswerCorrect(userValue, blank);
    if (input) {
      input.classList.remove('cc-quest__blank--correct', 'cc-quest__blank--wrong');
      if (userValue.length === 0) {
        input.classList.add('cc-quest__blank--wrong');
      } else {
        input.classList.add(isCorrect ? 'cc-quest__blank--correct' : 'cc-quest__blank--wrong');
      }
      const mark = input.parentElement?.querySelector('.cc-quest__blank-mark');
      if (mark) mark.textContent = isCorrect ? '✓' : userValue ? '✗' : '?';
    }
    if (isCorrect) correct++;
    // Every blank the child got wrong is named, so the explanation says what
    // they did rather than only what the answer was.
    const diagnosis = isCorrect
      ? null
      : diagnoseAnswer({
          stem: stemForBlank(
            _currentPassage.text,
            blank.num - 1,
            _currentPassage.blanks.map((b) => b.answer),
          ),
          given: userValue,
          correct: blank.answer,
          skill: blank.skill,
          domain: 'comprehension',
        });
    rows.push({ blank, userValue, isCorrect, diagnosis });
  }

  const total = _currentPassage.blanks.length;

  // ── Commit, once per passage ─────────────────────────────────────────────
  // Audit 2026-09-19, finding 16: this module showed a score and logged
  // misconceptions but recorded no quest attempt, no mastery and no persistent
  // completion, so the work vanished on leaving the section and a daily plan
  // could not know it had happened. Meanwhile the misconception log ran again
  // on every Check press, turning one mistake into a repeat offence for a
  // child who pressed Check twice to re-read the explanations.
  if (!_committedPassageIds.has(_currentPassage.id)) {
    _committedPassageIds.add(_currentPassage.id);

    recordMisconceptionsFromReview(
      rows.map(({ blank, isCorrect, diagnosis }) => ({
        misconceptionId: diagnosis?.id || null,
        status: isCorrect ? 'Correct' : 'Try again',
        skillTag: blank.skill,
      })),
      { mode: 'comprehensionCloze' },
    );

    _commitPassageAttempt(rows, correct, total);
  }

  const score = _container?.querySelector('#cc-quest-score');
  if (score) score.textContent = `Score: ${correct} / ${total} correct`;

  const feedback = _container?.querySelector('#cc-quest-feedback');
  if (feedback) {
    feedback.hidden = false;
    feedback.innerHTML = `
      <h4 class="cc-quest__feedback-title">Explanations</h4>
      <ol class="cc-quest__feedback-list">
        ${rows
          .map(
            ({ blank, userValue, isCorrect, diagnosis }) => `
          <li class="cc-quest__feedback-item ${isCorrect ? 'cc-quest__feedback-item--correct' : 'cc-quest__feedback-item--wrong'}">
            <strong>${blank.num}.</strong>
            ${
              userValue
                ? `You typed “<em>${_escapeHtml(userValue)}</em>”.`
                : 'You left this blank empty.'
            }
            ${isCorrect ? ' ✓' : ` The answer is “<em>${_escapeHtml(blank.answer)}</em>”.`}
            ${
              diagnosis && diagnosis.matched
                ? `<span class="cc-quest__feedback-slip">That is ${_escapeHtml(diagnosis.misconception.childName)}.</span>`
                : ''
            }
            <span class="cc-quest__feedback-explanation">${_escapeHtml(blank.explanation)}</span>
            ${
              diagnosis
                ? `<span class="cc-quest__feedback-nexttime">Next time: ${_escapeHtml(diagnosis.misconception.selfCheck)}</span>`
                : ''
            }
            <span class="cc-quest__feedback-skill">[${_escapeHtml(blank.skill)}]</span>
          </li>
        `,
          )
          .join('')}
      </ol>`;
  }

  return { correct, total };
}

/**
 * Record one committed pass at a passage.
 *
 * Evidence is honest about the support that was given: hints shown or answers
 * revealed make it `guided`, so a revealed answer can never become an
 * independent success. Audit 2026-09-19, finding 16.
 *
 * @param {Array<{blank: object, isCorrect: boolean}>} rows
 * @param {number} correct
 * @param {number} total
 */
function _commitPassageAttempt(rows, correct, total) {
  const supported = _hintsShown || _revealed;
  const evidence = supported ? EVIDENCE.GUIDED : EVIDENCE.INDEPENDENT;

  // One mastery update per skill this passage exercised, rather than one per
  // blank, so a passage with four `preposition` blanks is one piece of
  // evidence about prepositions and not four.
  const bySkill = new Map();
  for (const { blank, isCorrect } of rows) {
    const skill = blank.skill || 'comprehensionCloze';
    const acc = bySkill.get(skill) || { right: 0, seen: 0 };
    acc.seen += 1;
    if (isCorrect) acc.right += 1;
    bySkill.set(skill, acc);
  }

  for (const [skill, acc] of bySkill) {
    questMastery.updateSkill('comprehensionCloze', skill, acc.right === acc.seen, {
      evidence,
      attemptId: `ccq:${_currentPassage.id}:${skill}`,
    });
  }

  questMastery.recordAttempt({
    quest: 'comprehensionCloze',
    skill: rows[0]?.blank?.skill || 'comprehensionCloze',
    correct: correct === total,
    level: _currentLevel,
  });

  store.recordLearningEvent?.({
    eventType: 'comprehension_cloze_passage',
    quest: 'comprehensionCloze',
    level: _currentLevel,
    correct: correct === total,
    evidence,
    meta: {
      passageId: _currentPassage.id,
      correct,
      total,
      hintsShown: _hintsShown,
      revealed: _revealed,
    },
  });

  // Persistent completion, through the tracker Cloze Castle and Word Vault
  // already share, so the daily plan and the dashboard count this section the
  // same way they count the others.
  try {
    const next = recordClozeCompletion({
      level: _currentLevel,
      category: 'comprehensionCloze',
      passageId: _currentPassage.id,
      ccqCompletedByPassage: store.get('ccqCompletedByPassage'),
      ccqCompleted: store.get('ccqCompleted'),
      ccqCatCompleted: store.get('ccqCatCompleted'),
    });
    store.set('ccqCompletedByPassage', next.nextByPassage);
    store.set('ccqCompleted', next.nextCompleted);
    store.set('ccqCatCompleted', next.nextCatCompleted);
  } catch (_) {
    /* completion tracking is best-effort; never block the child's feedback */
  }
}

function _revealAnswers() {
  if (!_currentPassage) return;
  _revealed = true;
  for (const blank of _currentPassage.blanks) {
    const input = _container?.querySelector(`.cc-quest__blank[data-num="${blank.num}"]`);
    if (!input) continue;
    input.value = blank.answer;
    input.classList.remove('cc-quest__blank--correct', 'cc-quest__blank--wrong');
    input.classList.add('cc-quest__blank--revealed');
    input.readOnly = true;
    const mark = input.parentElement?.querySelector('.cc-quest__blank-mark');
    if (mark) mark.textContent = '✓';
  }
  const total = _currentPassage.blanks.length;
  const score = _container?.querySelector('#cc-quest-score');
  if (score) score.textContent = `Answers revealed (${total} of ${total})`;
  const feedback = _container?.querySelector('#cc-quest-feedback');
  if (feedback) {
    feedback.hidden = false;
    feedback.innerHTML = `
      <h4 class="cc-quest__feedback-title">Why these answers fit</h4>
      <ol class="cc-quest__feedback-list">
        ${_currentPassage.blanks
          .map(
            (b) => `
          <li class="cc-quest__feedback-item cc-quest__feedback-item--revealed">
            <strong>${b.num}.</strong> The answer is “<em>${_escapeHtml(b.answer)}</em>”.
            <span class="cc-quest__feedback-explanation">${_escapeHtml(b.explanation)}</span>
            <span class="cc-quest__feedback-skill">[${_escapeHtml(b.skill)}]</span>
          </li>
        `,
          )
          .join('')}
      </ol>`;
  }
}

function _tryAnother() {
  const next = _pickNextPassage();
  if (!next) return;
  _seenPassageIds.add(next.id);
  _renderPassage(next);
}

// ── pure helpers ────────────────────────────────────────────────────────────

function _isAnswerCorrect(userValue, blank) {
  const v = String(userValue || '')
    .trim()
    .toLowerCase();
  if (!v) return false;
  if (
    v ===
    String(blank?.answer || '')
      .trim()
      .toLowerCase()
  )
    return true;
  const accept = Array.isArray(blank?.accept) ? blank.accept : [];
  return accept.some(
    (alt) =>
      v ===
      String(alt || '')
        .trim()
        .toLowerCase(),
  );
}

function _splitText(text) {
  const parts = [];
  let last = 0;
  let m;
  const re = /\{\{(\d+)\}\}/g;
  const src = String(text || '');
  while ((m = re.exec(src)) !== null) {
    if (m.index > last) parts.push({ type: 'text', value: src.slice(last, m.index) });
    parts.push({ type: 'blank', num: Number(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < src.length) parts.push({ type: 'text', value: src.slice(last) });
  return parts;
}

function _escapeHtml(s) {
  return String(s ?? '').replace(
    /[&<>"']/g,
    (c) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[c],
  );
}

function _escapeAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}

// Test-only handles (chunk 5). Not part of the public API.
export const __TEST__ = { _isAnswerCorrect, _splitText };
