/**
 * Regression tests for modalManager.
 *
 * Verifies:
 *  1. Opening a modal registers exactly one Escape handler.
 *  2. Closing via button does NOT leave a stale Escape handler.
 *  3. Opening the same modal twice doesn't accumulate two listeners.
 *  4. anyOpen() correctly reflects open/closed state.
 *  5. The onClose callback fires on Escape, not on programmatic close.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { modalManager } from '../modules/modalManager.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeModal(id) {
  const el = document.createElement('div');
  el.id = id;
  el.hidden = true;
  // Give it a focusable child so focus-trap has something to focus.
  const btn = document.createElement('button');
  btn.textContent = 'Close';
  el.appendChild(btn);
  document.body.appendChild(el);
  return el;
}

function fireEscape() {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('modalManager', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    // Ensure handler map is empty between tests by closing any open modals.
    // (We can't reach _escHandlers directly – close() cleans up.)
  });

  it('shows a modal when opened', () => {
    const el = makeModal('modal-test');
    expect(el.hidden).toBe(true);

    modalManager.open('modal-test');

    expect(el.hidden).toBe(false);
  });

  it('hides a modal when closed', () => {
    const el = makeModal('modal-test');
    modalManager.open('modal-test');

    modalManager.close('modal-test');

    expect(el.hidden).toBe(true);
  });

  it('isOpen() returns true only while the modal is open', () => {
    makeModal('modal-test');

    expect(modalManager.isOpen('modal-test')).toBe(false);
    modalManager.open('modal-test');
    expect(modalManager.isOpen('modal-test')).toBe(true);
    modalManager.close('modal-test');
    expect(modalManager.isOpen('modal-test')).toBe(false);
  });

  it('anyOpen() reflects whether any modal has an active Escape handler', () => {
    makeModal('modal-a');

    expect(modalManager.anyOpen()).toBe(false);
    modalManager.open('modal-a');
    expect(modalManager.anyOpen()).toBe(true);
    modalManager.close('modal-a');
    expect(modalManager.anyOpen()).toBe(false);
  });

  it('Escape key closes the modal', () => {
    const el = makeModal('modal-test');
    modalManager.open('modal-test');
    expect(el.hidden).toBe(false);

    fireEscape();

    expect(el.hidden).toBe(true);
  });

  it('does NOT accumulate Escape handlers when opened twice', () => {
    makeModal('modal-test');
    const addSpy = vi.spyOn(document, 'addEventListener');
    const removeSpy = vi.spyOn(document, 'removeEventListener');

    modalManager.open('modal-test');
    modalManager.open('modal-test'); // second open should remove the first handler

    // One removal (the first handler) + one addition.
    const keydownAdds = addSpy.mock.calls.filter((c) => c[0] === 'keydown').length;
    const keydownRemoves = removeSpy.mock.calls.filter((c) => c[0] === 'keydown').length;
    expect(keydownAdds).toBe(2); // one per open call
    expect(keydownRemoves).toBe(1); // previous handler cleaned up on second open

    addSpy.mockRestore();
    removeSpy.mockRestore();
    modalManager.close('modal-test');
  });

  it('closing via button removes the Escape listener (no stale handlers)', () => {
    makeModal('modal-test');
    modalManager.open('modal-test');
    expect(modalManager.anyOpen()).toBe(true);

    // Simulate user clicking the modal's close button (programmatic close).
    modalManager.close('modal-test');

    // After close, anyOpen() must be false (handler map is empty).
    expect(modalManager.anyOpen()).toBe(false);

    // Firing Escape now should do nothing (no handler left).
    // We verify there's no JS error and isOpen stays false.
    expect(() => fireEscape()).not.toThrow();
    expect(modalManager.isOpen('modal-test')).toBe(false);
  });

  it('onClose callback fires when Escape is pressed', () => {
    makeModal('modal-test');
    const onClose = vi.fn();
    modalManager.open('modal-test', { onClose });

    fireEscape();

    expect(onClose).toHaveBeenCalledOnce();
  });

  it('onClose callback does NOT fire on programmatic close', () => {
    makeModal('modal-test');
    const onClose = vi.fn();
    modalManager.open('modal-test', { onClose });

    modalManager.close('modal-test');

    expect(onClose).not.toHaveBeenCalled();
  });

  it('opening a non-existent modal ID is a no-op', () => {
    expect(() => modalManager.open('modal-does-not-exist')).not.toThrow();
    expect(modalManager.anyOpen()).toBe(false);
  });
});
