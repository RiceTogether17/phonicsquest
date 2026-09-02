import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * createChoiceRound — the shared two-try controller for tap-to-choose
 * modes (UX_SPEC §2.5/§3.3):
 *   1st tap correct → lock + reveal + Next(true)
 *   1st tap wrong   → only the tapped button locks, retry stays open
 *   2nd tap         → lock + reveal + Next(first-attempt correctness)
 * Feedback must be text + glyph (not colour/animation alone) in a
 * polite live region.
 */

globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
  paused: false,
  resume: () => {},
};
globalThis.SpeechSynthesisUtterance = class {
  constructor(t) {
    this.text = t;
  }
};

const { createChoiceRound } = await import('../src/modes/choiceRound.js');

function renderGrid() {
  document.body.innerHTML = `
    <div id="mode-area">
      <div class="choice-grid">
        <button class="choice-btn" data-correct="true">A</button>
        <button class="choice-btn" data-correct="false">B</button>
        <button class="choice-btn" data-correct="false">C</button>
        <button class="choice-btn" data-correct="false">D</button>
      </div>
    </div>
  `;
  return {
    modeArea: document.getElementById('mode-area'),
    grid: document.querySelector('.choice-grid'),
    correctBtn: document.querySelector('[data-correct="true"]'),
    wrongBtns: Array.from(document.querySelectorAll('[data-correct="false"]')),
  };
}

describe('createChoiceRound', () => {
  let els, onResult, onRetry, onReveal, round;

  beforeEach(() => {
    els = renderGrid();
    onResult = vi.fn();
    onRetry = vi.fn();
    onReveal = vi.fn();
    round = createChoiceRound({
      modeArea: els.modeArea,
      grid: els.grid,
      onResult,
      retryHint: 'Listen again.',
      onRetry,
      onReveal,
    });
  });

  it('first-tap correct: locks grid, reveals, Next fires onResult(true)', () => {
    round.handleTap(true, els.correctBtn);

    expect(els.correctBtn.classList.contains('correct')).toBe(true);
    expect(els.correctBtn.querySelector('.choice-result-icon')).not.toBeNull();
    expect(els.grid.querySelectorAll('.choice-btn:disabled').length).toBe(4);
    expect(onReveal).toHaveBeenCalledTimes(1);
    expect(round.isDone()).toBe(true);

    const feedback = els.modeArea.querySelector('.choice-feedback');
    expect(feedback.getAttribute('role')).toBe('status');
    expect(feedback.getAttribute('aria-live')).toBe('polite');
    expect(feedback.textContent).toContain('Yes!');

    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(onResult).toHaveBeenCalledWith(true, expect.any(Number));
  });

  it('first-tap wrong: only tapped button locks, retry message + replay, no Next', () => {
    round.handleTap(false, els.wrongBtns[0]);

    expect(els.wrongBtns[0].disabled).toBe(true);
    expect(els.wrongBtns[0].classList.contains('wrong')).toBe(true);
    expect(els.wrongBtns[0].querySelector('.choice-result-icon')).not.toBeNull();
    expect(els.correctBtn.disabled).toBe(false);
    expect(els.wrongBtns[1].disabled).toBe(false);
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onReveal).not.toHaveBeenCalled();
    expect(round.isDone()).toBe(false);
    expect(els.modeArea.querySelector('.vmcq-next-btn')).toBeNull();

    const feedback = els.modeArea.querySelector('.choice-feedback');
    expect(feedback.textContent).toContain('Almost! Try again.');
    expect(feedback.textContent).toContain('Listen again.');
  });

  it('second-tap correct still records first-attempt correctness (false)', () => {
    round.handleTap(false, els.wrongBtns[0]);
    round.handleTap(true, els.correctBtn);

    expect(round.isDone()).toBe(true);
    expect(onReveal).toHaveBeenCalledTimes(1);
    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(onResult).toHaveBeenCalledWith(false, expect.any(Number));
  });

  it('second-tap wrong reveals the correct answer with a ✓ glyph', () => {
    round.handleTap(false, els.wrongBtns[0]);
    round.handleTap(false, els.wrongBtns[1]);

    expect(round.isDone()).toBe(true);
    expect(els.correctBtn.classList.contains('correct')).toBe(true);
    expect(els.correctBtn.querySelector('.choice-result-icon--yes')).not.toBeNull();
    expect(els.grid.querySelectorAll('.choice-btn:disabled').length).toBe(4);

    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(onResult).toHaveBeenCalledWith(false, expect.any(Number));
  });

  it('taps after the round is done are ignored', () => {
    round.handleTap(true, els.correctBtn);
    round.handleTap(false, els.wrongBtns[0]);

    expect(els.wrongBtns[0].classList.contains('wrong')).toBe(false);
    els.modeArea.querySelector('.vmcq-next-btn').click();
    expect(onResult).toHaveBeenCalledTimes(1);
    expect(onResult).toHaveBeenCalledWith(true, expect.any(Number));
  });

  it('re-tapping the disabled wrong button does not consume the second try', () => {
    round.handleTap(false, els.wrongBtns[0]);
    round.handleTap(false, els.wrongBtns[0]); // disabled — ignored

    expect(round.isDone()).toBe(false);
    round.handleTap(true, els.correctBtn);
    expect(round.isDone()).toBe(true);
  });

  it('Next click only fires onResult once even if clicked twice', () => {
    round.handleTap(true, els.correctBtn);
    const next = els.modeArea.querySelector('.vmcq-next-btn');
    next.click();
    next.click();
    expect(onResult).toHaveBeenCalledTimes(1);
  });
});
