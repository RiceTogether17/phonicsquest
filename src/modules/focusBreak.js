/**
 * PhonicsQuest – Focus breaks
 *
 * Young children hold focus for minutes, not hours, and a short movement
 * break brings attention back better than pushing on. After a stretch of
 * steady play, Giri offers a 20-second break right after a correct answer,
 * so the pause comes on a win and the child returns wanting the next word.
 *
 * The break is offered, never forced: the child can tap "I'm ready" at any
 * moment. It is not tied to mistakes — a break that only appears after
 * wrong answers teaches a child that resting is a punishment.
 */

import { html } from '../utils/html.js';

/** Minutes of steady play before a break is offered. */
export const FOCUS_MINUTES = 12;
/** A gap this long between answers already was a break, so the clock restarts. */
export const IDLE_RESET_MINUTES = 3;
/** Length of the break countdown. */
export const BREAK_SECONDS = 20;

const MIN = 60_000;

/** Moves for a normal break. Each is safe at a desk and needs no space. */
export const ACTIVE_BREAKS = Object.freeze([
  { emoji: '🦒', text: 'Stand up and stretch up high, like a giraffe!' },
  { emoji: '🐸', text: 'Do five little frog jumps!' },
  { emoji: '🙆', text: 'Roll your shoulders back, slowly, five times.' },
  { emoji: '👀', text: 'Look out of the window at something far away.' },
  { emoji: '🖐️', text: 'Wiggle your fingers, then wiggle your toes!' },
  { emoji: '🌬️', text: 'Take three slow, deep breaths. In… and out.' },
]);

/** Calm-only moves for bedtime, which should wind a child down. */
export const CALM_BREAKS = Object.freeze([
  { emoji: '🌬️', text: 'Take three slow, deep breaths. In… and out.' },
  { emoji: '👀', text: 'Close your eyes and count to ten, slowly.' },
  { emoji: '🖐️', text: 'Wiggle your fingers, then let them rest.' },
]);

/**
 * Tracks how long the child has been playing without a pause.
 * Kept as a small class so tests can drive it with a fake clock.
 */
export class FocusTimer {
  constructor() {
    this._since = null;
    this._lastAt = null;
  }

  /**
   * Note an answer. Returns true when a break is due.
   * @param {number} [now]
   */
  noteAnswer(now = Date.now()) {
    if (this._lastAt === null || now - this._lastAt >= IDLE_RESET_MINUTES * MIN) {
      this._since = now;
    }
    this._lastAt = now;
    return now - this._since >= FOCUS_MINUTES * MIN;
  }

  /** Start a fresh focus stretch (after a break, or a new session). */
  reset(now = Date.now()) {
    this._since = now;
    this._lastAt = now;
  }
}

export const focusTimer = new FocusTimer();

/**
 * Pick a break move.
 * @param {{ calm?: boolean, random?: () => number }} [opts]
 */
export function pickBreak({ calm = false, random = Math.random } = {}) {
  const list = calm ? CALM_BREAKS : ACTIVE_BREAKS;
  return list[Math.floor(random() * list.length) % list.length];
}

/**
 * Show the break. Speaks the move aloud for children who cannot read it
 * yet, counts down, and calls `onDone` when the child is ready.
 *
 * @param {{ calm?: boolean, speak?: (text: string) => void, onDone?: () => void }} [opts]
 */
export function showFocusBreak({ calm = false, speak, onDone } = {}) {
  document.getElementById('modal-focus-break')?.remove();
  const move = pickBreak({ calm });
  const intro = 'Great reading! Time for a quick brain break.';

  const modal = document.createElement('div');
  modal.id = 'modal-focus-break';
  modal.className = 'modal-overlay modal-overlay--active';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Brain break');
  modal.innerHTML = html`
    <div class="modal-panel fb-panel">
      <div class="fb-emoji" aria-hidden="true">${move.emoji}</div>
      <h2 class="fb-title">${intro}</h2>
      <p class="fb-move">${move.text}</p>
      <p class="fb-timer" aria-live="off"><span id="fb-seconds">${BREAK_SECONDS}</span> seconds</p>
      <button class="btn btn--primary btn--xl" id="fb-ready">I'm ready! →</button>
    </div>`;
  document.body.appendChild(modal);

  const secondsEl = modal.querySelector('#fb-seconds');
  const readyBtn = /** @type {HTMLElement|null} */ (modal.querySelector('#fb-ready'));
  let left = BREAK_SECONDS;
  const tick = setInterval(() => {
    left -= 1;
    if (secondsEl) secondsEl.textContent = String(Math.max(0, left));
    if (left <= 0) {
      clearInterval(tick);
      if (secondsEl?.parentElement) secondsEl.parentElement.textContent = 'All done!';
      speak?.('All done! Let’s read some more.');
    }
  }, 1000);

  const finish = () => {
    clearInterval(tick);
    modal.remove();
    focusTimer.reset();
    onDone?.();
  };
  readyBtn?.addEventListener('click', finish);
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') finish();
  });

  speak?.(`${intro} ${move.text}`);
  setTimeout(() => readyBtn?.focus(), 100);
}
