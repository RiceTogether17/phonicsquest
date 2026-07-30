/**
 * Blend confirmation round.
 *
 * Blend It! and Listen & Blend reveal the phonemes, blend the word aloud,
 * and then ask the child "Did you blend it right?". That is a reasonable
 * reflection prompt and a hopeless assessment: the app has already said the
 * answer, and a five-year-old is not a reliable judge of their own decoding.
 * Every "Yes! ✓" used to write a full decoding success.
 *
 * This module adds the missing half. After the child self-reports, three
 * PRINTED words appear with no audio and no model — the target plus two
 * phonologically close distractors — and the child taps the one they just
 * read. That tap is real, independent evidence, recorded against the same
 * word so it feeds decoding accuracy and the progression gate.
 *
 * The governing rule, from the instructional audit: the word used for
 * teaching should not be the only word used for assessment. Here the same
 * word is used, but the task changes from "did you get it?" to "which one
 * was it?" — recognition the child has to perform, not a claim they make.
 *
 * Deliberately NOT a gate: getting the confirmation wrong doesn't punish the
 * child or block the round. It records what happened and moves on.
 */

import { getDistractors, shuffleArray } from '../data/words.js';
import { html } from '../utils/html.js';

/** How many words the child chooses between (target + distractors). */
const CHOICE_COUNT = 3;

/**
 * The round gets its own container rather than borrowing the mode's.
 *
 * Blend It! renders asynchronously — `_doBlend` awaits audio and then
 * repaints `#mode-area`. If the child double-taps "Blend it!" (entirely
 * normal for a five-year-old) a second repaint is still in flight when they
 * answer, and it would wipe the confirmation round out from under them,
 * leaving the word soft-locked with nothing to tap. Owning our own node
 * makes that impossible.
 */
const HOST_ID = 'blend-confirm-host';

let _cleanup = null;

/**
 * Hide an element for the duration of the round.
 *
 * Marks it with `data-blend-confirm-hidden`, which the stylesheet hides with
 * `display: none !important`. Two weaker approaches both fail here:
 *
 *   - `el.hidden = true` — the UA rule `[hidden] { display: none }` is a
 *     single attribute selector and loses to `.word-display { display: flex }`,
 *     so it looks right in code and does nothing on screen.
 *   - inline `style.display = 'none'` — Blend It!'s `_doBlend` sets
 *     `btnSayIt.style.display = ''` *after* an await, so a repaint still in
 *     flight when the child answers puts "Say It" back and hands them the
 *     word.
 *
 * A stylesheet `!important` declaration beats a normal inline one, so the
 * marker wins whatever the mode writes. Teardown just drops the attribute —
 * there is no saved state to restore, and therefore no restore-order bug.
 *
 * @param {Element|null|undefined} el
 * @returns {(() => void)|null} restore function, or null if there was nothing to hide
 */
function _hide(el) {
  if (!(el instanceof HTMLElement)) return null;
  el.dataset.blendConfirmHidden = '1';
  return () => {
    delete el.dataset.blendConfirmHidden;
  };
}

/**
 * Show the confirmation round.
 *
 * @param {object} opts
 * @param {import('../data/words.js').Word} opts.word   the word just blended
 * @param {HTMLElement} opts.modeArea                   container to render into
 * @param {Array<HTMLElement|null>} [opts.conceal]
 *   Elements to hide for the duration — the phoneme tiles, the word display
 *   and the picture. Without this the question is free: the graphemes are
 *   still on screen, so the child letter-matches instead of reading, which
 *   is exactly the failure mode this round exists to close.
 * @param {number} [opts.maxLevel]                      difficulty cap for distractors
 * @param {(correct: boolean, responseMs: number) => void} opts.onDone
 *   Called exactly once, with the child's answer — but ONLY when a round is
 *   actually shown. If this function returns false it has not called back,
 *   and the caller must handle the word itself. Reporting a skipped round as
 *   a wrong answer would invent a failure the child never made.
 * @returns {boolean} true if a round was shown, false if it was skipped
 */
export function showBlendConfirm({ word, modeArea, conceal = [], maxLevel = 3, onDone }) {
  cleanupBlendConfirm();
  if (!word || !modeArea) return false;

  const distractors = getDistractors(word, CHOICE_COUNT - 1, { maxLevel });
  // Without real distractors the question is free — skip rather than bank a
  // meaningless "independent" success against a one-button choice.
  if (distractors.length < CHOICE_COUNT - 1) return false;

  const choices = shuffleArray([word, ...distractors]);
  const startedAt = Date.now();
  let answered = false;

  // Own node, inserted after the mode area, with the mode area hidden for
  // the duration. A late repaint from the mode then lands harmlessly on a
  // hidden element instead of destroying the question.
  const host = document.createElement('div');
  host.id = HOST_ID;
  modeArea.insertAdjacentElement('afterend', host);

  // Hide the mode's own UI plus the printed word, the phoneme tiles and the
  // picture. Each element is marked so the safety net in
  // cleanupBlendConfirm can restore it even if teardown is skipped — a
  // permanently blank game screen is far worse than a missed round.
  const restores = [modeArea, ...conceal].map(_hide).filter(Boolean);

  host.innerHTML = html`
    <div class="blend-confirm" role="group" aria-labelledby="blend-confirm-prompt">
      <p class="blend-confirm__prompt" id="blend-confirm-prompt">Which word did you just read?</p>
      <div class="blend-confirm__grid choice-grid" id="blend-confirm-grid">
        ${choices.map(
          (w) => html`
            <button
              type="button"
              class="choice-btn blend-confirm__card"
              data-correct="${String(w.id === word.id)}"
              aria-label="Choose ${w.word}"
            >
              ${w.word}
            </button>
          `,
        )}
      </div>
      <div
        class="blend-confirm__feedback"
        id="blend-confirm-feedback"
        role="status"
        aria-live="polite"
      ></div>
    </div>
  `;

  const grid = host.querySelector('#blend-confirm-grid');
  const feedback = host.querySelector('#blend-confirm-feedback');

  /** @param {HTMLButtonElement} btn */
  function onTap(btn) {
    if (answered) return;
    answered = true;
    const correct = btn.dataset.correct === 'true';

    // Lock the grid and always reveal the right answer — the child finishes
    // every question knowing what the word was.
    for (const b of grid.querySelectorAll('.blend-confirm__card')) {
      b.disabled = true;
      if (b.dataset.correct === 'true') b.classList.add('blend-confirm__card--yes');
      else if (b === btn) b.classList.add('blend-confirm__card--no');
    }

    if (feedback) {
      // Text + glyph, never colour alone.
      feedback.className = `blend-confirm__feedback blend-confirm__feedback--${correct ? 'yes' : 'no'}`;
      feedback.textContent = correct
        ? `✓ Yes — that's "${word.word}".`
        : `✗ It was "${word.word}". Good try!`;
    }

    const responseMs = Date.now() - startedAt;
    // Brief pause so the reveal is readable before the round advances.
    const timer = setTimeout(
      () => {
        teardown();
        onDone?.(correct, responseMs);
      },
      correct ? 700 : 1400,
    );
    _cleanup = () => {
      clearTimeout(timer);
      teardown();
    };
  }

  const handler = (e) => {
    const btn = e.target.closest('.blend-confirm__card');
    if (btn) onTap(btn);
  };
  grid?.addEventListener('click', handler);

  function teardown() {
    grid?.removeEventListener('click', handler);
    host.remove();
    for (const restore of restores) restore();
  }

  _cleanup = teardown;

  // Move focus to the first choice so keyboard and screen-reader users land
  // on the question rather than wherever the self-assess buttons were.
  /** @type {HTMLButtonElement|null} */
  const first = grid?.querySelector('.blend-confirm__card');
  first?.focus();

  return true;
}

/**
 * Tear down any live round: clears a pending commit timer, removes the host
 * node and un-hides the mode area. Safe to call when no round is showing.
 */
export function cleanupBlendConfirm() {
  _cleanup?.();
  _cleanup = null;
  // Belt and braces: if a host or a marked element survived an unexpected
  // teardown path, make sure it can't leave the game screen permanently
  // blank.
  document.getElementById(HOST_ID)?.remove();
  for (const el of document.querySelectorAll('[data-blend-confirm-hidden]')) {
    if (el instanceof HTMLElement) delete el.dataset.blendConfirmHidden;
  }
}
