/**
 * Regression tests for keyboardManager.
 *
 * Covers the critical bug fix: the 'n' / Enter / Space shortcut on the result
 * screen was previously unreachable because the handler exited early when the
 * screen was not 'screen-game'.
 *
 * Verifies:
 *  1. Space/Enter on screen-game clicks btn-reveal-next.
 *  2. 's' on screen-game clicks btn-say-it.
 *  3. 'h' on screen-game clicks btn-hint.
 *  4. Escape on screen-game clicks btn-back.
 *  5. 'n' on screen-result clicks btn-next.          ← THE BUG FIX
 *  6. Enter on screen-result clicks btn-next.        ← THE BUG FIX
 *  7. Space on screen-result clicks btn-next.        ← THE BUG FIX
 *  8. Shortcuts are suppressed while a modal is open.
 *  9. Shortcuts are suppressed when the user is in an input.
 * 10. destroy() removes the listener cleanly.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { keyboardManager } from '../modules/keyboardManager.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeBtn(id) {
  const btn = document.createElement('button');
  btn.id = id;
  document.body.appendChild(btn);
  return btn;
}

function fire(key, target = document) {
  const event = new KeyboardEvent('keydown', { key, bubbles: true });
  target.dispatchEvent(event);
  return event;
}

/** Minimal modalManager stub */
function modalStub(open = false) {
  return { anyOpen: () => open };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('keyboardManager', () => {
  let screen = 'screen-home';
  let els;

  beforeEach(() => {
    document.body.innerHTML = '';
    screen = 'screen-home';

    els = {
      btnSayIt: makeBtn('btn-say-it'),
      btnHint: makeBtn('btn-hint'),
      btnBack: makeBtn('btn-back'),
      btnNext: makeBtn('btn-next'),
    };

    makeBtn('btn-reveal-next');

    keyboardManager.init({
      getScreen: () => screen,
      els,
      onHome: vi.fn(),
      modalManager: modalStub(false),
    });
  });

  afterEach(() => {
    keyboardManager.destroy();
  });

  // ── game-screen shortcuts ──────────────────────────────────────────────────

  it('Space on screen-game triggers btn-reveal-next', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    document.getElementById('btn-reveal-next').addEventListener('click', spy);
    fire(' ');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('Enter on screen-game triggers btn-reveal-next', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    document.getElementById('btn-reveal-next').addEventListener('click', spy);
    fire('Enter');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('"s" on screen-game triggers btn-say-it', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    els.btnSayIt.addEventListener('click', spy);
    fire('s');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('"h" on screen-game triggers btn-hint', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    els.btnHint.addEventListener('click', spy);
    fire('h');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('Escape on screen-game triggers btn-back', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    els.btnBack.addEventListener('click', spy);
    fire('Escape');
    expect(spy).toHaveBeenCalledOnce();
  });

  // ── result-screen shortcuts (the critical bug fix) ─────────────────────────

  it('"n" on screen-result triggers btn-next  ← BUG FIX', () => {
    screen = 'screen-result';
    const spy = vi.fn();
    els.btnNext.addEventListener('click', spy);
    fire('n');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('Enter on screen-result triggers btn-next  ← BUG FIX', () => {
    screen = 'screen-result';
    const spy = vi.fn();
    els.btnNext.addEventListener('click', spy);
    fire('Enter');
    expect(spy).toHaveBeenCalledOnce();
  });

  it('Space on screen-result triggers btn-next  ← BUG FIX', () => {
    screen = 'screen-result';
    const spy = vi.fn();
    els.btnNext.addEventListener('click', spy);
    fire(' ');
    expect(spy).toHaveBeenCalledOnce();
  });

  // ── suppression rules ──────────────────────────────────────────────────────

  it('ignores shortcuts when a modal is open', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    els.btnSayIt.addEventListener('click', spy);

    // Re-init with modal open.
    keyboardManager.init({
      getScreen: () => screen,
      els,
      onHome: vi.fn(),
      modalManager: modalStub(true),
    });

    fire('s');
    expect(spy).not.toHaveBeenCalled();
  });

  it('ignores shortcuts when an input element has focus', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    document.getElementById('btn-reveal-next').addEventListener('click', spy);

    const input = document.createElement('input');
    document.body.appendChild(input);

    // Fire from the input element (simulating it has focus).
    fire('Enter', input);
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not trigger result shortcuts on screen-game', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    els.btnNext.addEventListener('click', spy);
    fire('n'); // 'n' has no binding on screen-game
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not trigger game shortcuts on screen-result', () => {
    screen = 'screen-result';
    const spy = vi.fn();
    els.btnSayIt.addEventListener('click', spy);
    fire('s'); // 's' has no binding on screen-result
    expect(spy).not.toHaveBeenCalled();
  });

  it('does not trigger any shortcut on screen-home', () => {
    screen = 'screen-home';
    const revealSpy = vi.fn();
    const nextSpy = vi.fn();
    document.getElementById('btn-reveal-next').addEventListener('click', revealSpy);
    els.btnNext.addEventListener('click', nextSpy);

    fire('Enter');
    fire('n');

    expect(revealSpy).not.toHaveBeenCalled();
    expect(nextSpy).not.toHaveBeenCalled();
  });

  // ── destroy ────────────────────────────────────────────────────────────────

  it('destroy() removes the keyboard listener', () => {
    screen = 'screen-game';
    const spy = vi.fn();
    els.btnSayIt.addEventListener('click', spy);

    keyboardManager.destroy();
    fire('s');

    expect(spy).not.toHaveBeenCalled();
  });
});
