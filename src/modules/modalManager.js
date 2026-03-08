/**
 * PhonicsQuest – Modal Manager
 *
 * Centralises open/close lifecycle for all modal overlays.
 *
 * PROBLEM FIXED:
 *   The previous implementation added a new `keydown` handler every time a
 *   modal was opened.  The handler only removed itself when Escape was pressed;
 *   if the modal was closed via a button click or overlay click the listener was
 *   never removed.  After a few modal opens, dozens of stale handlers
 *   accumulated on `document`, each capable of calling `_closeModal` for an
 *   already-closed modal.
 *
 * SOLUTION:
 *   `modalManager` keeps a WeakMap-style registry (using the modal's ID as
 *   key) that stores exactly one Escape handler per modal.  Opening the same
 *   modal twice in a row first removes any previous handler before adding a
 *   new one.  `close()` always removes the handler regardless of how the modal
 *   was dismissed.
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

export const modalManager = {
  /**
   * Open a modal by element ID.
   *
   * - Makes the element visible (`hidden = false`).
   * - Moves focus to the first focusable child.
   * - Registers a single Escape-key handler that calls `close()`.
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

    modal.hidden = false;
    modal.removeAttribute('aria-hidden');

    // Trap focus on the first interactive element inside the modal.
    const focusable = modal.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length) /** @type {HTMLElement} */ (focusable[0]).focus();

    // Register a single, named Escape handler so we can remove it later.
    const handler = (/** @type {KeyboardEvent} */ e) => {
      if (e.key === 'Escape') {
        this.close(id);
        opts.onClose?.();
      }
    };
    _escHandlers.set(id, handler);
    document.addEventListener('keydown', handler);
  },

  /**
   * Close a modal by element ID.
   *
   * - Hides the element (`hidden = true`).
   * - Removes the Escape-key handler registered at `open()` time.
   *   Safe to call even if no handler was registered.
   *
   * @param {string} id - The modal element's `id` attribute.
   */
  close(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    this._removeEscHandler(id);
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
