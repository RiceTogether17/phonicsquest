/**
 * PhonicsQuest – Keyboard Manager
 *
 * Centralises all global keyboard shortcuts and routes them to the correct
 * handler based on the current screen.
 *
 * BUG FIXED:
 *   The previous `_handleKeyboard` method in app.js exited unconditionally
 *   when the current screen was not `screen-game`:
 *
 *     if (this._screen !== 'screen-game') return;   // ← early exit
 *     …
 *     case 'n':
 *       if (this._screen === 'screen-result') { … }  // ← dead code!
 *
 *   As a result the `n` / Enter shortcut for "Next word" on the result screen
 *   was unreachable.  This module fixes that by routing shortcuts based on
 *   the actual current screen without a single early-exit guard.
 *
 * DESIGN:
 *   - One named listener on `document`, replaceable via `init()`.
 *   - Skips shortcuts when the user is typing in an input/textarea.
 *   - Skips global shortcuts when a modal is open (modals handle their own
 *     Escape via modalManager, so we don't double-fire).
 *   - `destroy()` removes the listener cleanly (useful for testing).
 *
 * USAGE:
 *   import { keyboardManager } from './modules/keyboardManager.js';
 *   import { modalManager } from './modules/modalManager.js';
 *
 *   keyboardManager.init({
 *     getScreen : () => app._screen,
 *     els       : app._els,
 *     onHome    : () => app._showScreen(SCREENS.HOME),
 *     modalManager,
 *   });
 */

import { SCREENS } from '../constants.js';

export const keyboardManager = {
  /** @type {((e: KeyboardEvent) => void) | null} */
  _handler: null,

  /**
   * Attach (or replace) the global keyboard listener.
   *
   * @param {object} config
   * @param {() => string}  config.getScreen    - Returns the current screen ID.
   * @param {object}        config.els          - Cached DOM element map from app.js.
   * @param {() => void}    [config.onHome]     - Navigate to home screen.
   * @param {{ anyOpen: () => boolean }} config.modalManager - modalManager instance.
   */
  init({ getScreen, els, onHome, modalManager }) {
    // Replace any previous handler cleanly.
    this.destroy();

    this._handler = (/** @type {KeyboardEvent} */ e) => {
      const screen = getScreen();

      // Never intercept input / textarea keystrokes.
      const tag = /** @type {HTMLElement} */ (e.target).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // Let modals handle their own Escape; don't double-fire global shortcuts.
      if (modalManager.anyOpen()) return;

      // ── Game screen shortcuts ──────────────────────────────────────────────
      if (screen === SCREENS.GAME) {
        switch (e.key) {
          case ' ':
          case 'Enter':
            e.preventDefault();
            // Primary action: reveal next phoneme / check answer.
            (document.getElementById('btn-reveal-next') || document.getElementById('btn-check'))?.click();
            break;
          case 's':
            // "Say it" – hear the whole word.
            els.btnSayIt?.click();
            break;
          case 'h':
            // Hint – play the first phoneme.
            els.btnHint?.click();
            break;
          case 'Escape':
            // Back to home.
            els.btnBack?.click();
            break;
        }
        return;
      }

      // ── Result screen shortcuts ────────────────────────────────────────────
      if (screen === SCREENS.RESULT) {
        switch (e.key) {
          case 'n':
          case 'Enter':
          case ' ':
            e.preventDefault();
            // "Next word" – the main CTA on the result screen.
            els.btnNext?.click();
            break;
          case 'Escape':
            // Bail out to home.
            onHome?.();
            break;
        }
      }
    };

    document.addEventListener('keydown', this._handler);
  },

  /**
   * Remove the global keyboard listener.
   * Safe to call multiple times.
   */
  destroy() {
    if (this._handler) {
      document.removeEventListener('keydown', this._handler);
      this._handler = null;
    }
  },
};
