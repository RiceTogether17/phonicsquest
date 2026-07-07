/**
 * PhonicsQuest – Modal Manager
 *
 * Centralises open/close lifecycle for all modal overlays.
 *
 * PROBLEM FIXED (1 — stale handlers):
 *   The previous implementation added a new `keydown` handler every time a
 *   modal was opened.  The handler only removed itself when Escape was pressed;
 *   if the modal was closed via a button click or overlay click the listener was
 *   never removed.  After a few modal opens, dozens of stale handlers
 *   accumulated on `document`, each capable of calling `_closeModal` for an
 *   already-closed modal.
 *
 * PROBLEM FIXED (2 — keyboard accessibility):
 *   Focus used to move to the first control on open but Tab could walk
 *   straight out of the `aria-modal` dialog into the background page, and
 *   closing never returned focus to the control that opened the modal.
 *   The keydown handler now cycles Tab/Shift+Tab within the modal and
 *   `close()` restores focus to the recorded opener.
 *
 * SOLUTION:
 *   `modalManager` keeps a registry (using the modal's ID as key) that stores
 *   exactly one keydown handler per modal plus the element that had focus when
 *   it opened.  Opening the same modal twice in a row first removes any
 *   previous handler before adding a new one.  `close()` always removes the
 *   handler and restores focus regardless of how the modal was dismissed.
 *
 * USAGE:
 *   import { modalManager } from './modules/modalManager.js';
 *
 *   modalManager.open('modal-settings');
 *   modalManager.close('modal-settings');
 *   modalManager.isOpen('modal-settings'); // → boolean
 *   modalManager.anyOpen();               // → boolean
 */

/** @type {Map<string, (e: KeyboardEvent) => void>} */
const _escHandlers = new Map();

/** @type {Map<string, HTMLElement|null>} element to restore focus to on close */
const _openers = new Map();

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/** Focusable elements inside the modal (skipping hidden subtrees), in DOM order. */
function _focusableIn(modal) {
  return [...modal.querySelectorAll(FOCUSABLE_SELECTOR)]
    .filter(el => !el.closest('[hidden]'));
}

export const modalManager = {
  /**
   * Open a modal by element ID.
   *
   * - Makes the element visible (`hidden = false`).
   * - Records the currently focused element so `close()` can restore it.
   * - Moves focus to the first focusable child.
   * - Registers a single keydown handler that closes on Escape and traps
   *   Tab/Shift+Tab inside the modal.
   * - Any pre-existing handler for this modal ID is cleaned up first.
   *
   * @param {string} id - The modal element's `id` attribute.
   * @param {{ onClose?: () => void }} [opts]
   *   Optional callback invoked when the modal is closed via Escape key.
   */
  open(id, opts = {}) {
    const modal = document.getElementById(id);
    if (!modal) return;

    // Idempotent: remove any stale handler before (re-)opening.
    this._removeEscHandler(id);

    // Remember the opener so close() can hand focus back to it.
    _openers.set(id, document.activeElement instanceof HTMLElement ? document.activeElement : null);

    modal.hidden = false;
    modal.removeAttribute('aria-hidden');

    const focusable = _focusableIn(modal);
    if (focusable.length) focusable[0].focus();

    // Single, named handler: Escape closes, Tab cycles within the modal.
    const handler = (/** @type {KeyboardEvent} */ e) => {
      if (e.key === 'Escape') {
        this.close(id);
        opts.onClose?.();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = _focusableIn(modal);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      // Focus outside the dialog (or about to leave it) wraps to the far end.
      if (e.shiftKey && (active === first || !modal.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !modal.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };
    _escHandlers.set(id, handler);
    document.addEventListener('keydown', handler);
  },

  /**
   * Close a modal by element ID.
   *
   * - Hides the element (`hidden = true`).
   * - Removes the keydown handler registered at `open()` time.
   *   Safe to call even if no handler was registered.
   * - Restores focus to the element that opened the modal.
   *
   * @param {string} id - The modal element's `id` attribute.
   */
  close(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    this._removeEscHandler(id);

    const opener = _openers.get(id);
    _openers.delete(id);
    if (opener && opener.isConnected) opener.focus();
  },

  /**
   * Returns `true` if the modal with this ID is currently visible.
   * @param {string} id
   * @returns {boolean}
   */
  isOpen(id) {
    const modal = document.getElementById(id);
    return !!modal && !modal.hidden;
  },

  /**
   * Returns `true` if at least one modal is currently tracked as open.
   * Useful for suppressing global keyboard shortcuts when a modal is active.
   * @returns {boolean}
   */
  anyOpen() {
    return _escHandlers.size > 0;
  },

  // ── Internal helpers ──

  /** @param {string} id */
  _removeEscHandler(id) {
    const handler = _escHandlers.get(id);
    if (handler) {
      document.removeEventListener('keydown', handler);
      _escHandlers.delete(id);
    }
  },
};
