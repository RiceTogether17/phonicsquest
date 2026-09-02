/**
 * Shared two-try round controller for the tap-to-choose modes
 * (First/Last/Middle Sound, Hear & Choose, Missing Sound, Count the
 * Sounds, Clap the Syllables, Oral Blend).
 *
 * Implements the UX_SPEC §2.5/§3.3 "mistakes are safe" contract:
 *   1st tap correct → ✓ + "Yes! 🎉", reveal, Next.
 *   1st tap wrong   → only the tapped button is disabled (✗), a calm
 *                     "Almost! Try again." message shows, the prompt
 *                     audio replays, and the rest of the grid stays live.
 *   2nd tap (either)→ grid locks, the correct answer is revealed with a ✓,
 *                     Next appears. The RECORDED correctness is the first
 *                     attempt — the child always finishes the question,
 *                     but a second-try save doesn't inflate mastery.
 *
 * Feedback is text + ✓/✗ glyphs inside a `role="status"` live region, so
 * right/wrong never relies on colour or animation alone (colour-blind,
 * reduced-motion, and forced-colors users all get the same signal).
 *
 * Buttons must carry `data-correct="true|false"` so the controller can
 * light up the right answer at reveal time.
 */

import { cancelChoicePreviews } from '../components/phonemeChoice.js';

/**
 * @param {object} opts
 * @param {HTMLElement} opts.modeArea  container for the feedback strip + Next button
 * @param {HTMLElement} opts.grid      the .choice-grid holding the option buttons
 * @param {(correct: boolean, responseTime: number) => void} opts.onResult
 * @param {string}   [opts.retryHint]  mode-specific coaching line shown after "Almost! Try again."
 * @param {() => void} [opts.onRetry]  replay the prompt audio on the first miss
 * @param {() => void} [opts.onReveal] mode-specific reveal (word animation, phoneme tiles, audio)
 * @returns {{ handleTap: (isCorrect: boolean, btn: HTMLButtonElement) => void, isDone: () => boolean }}
 */
export function createChoiceRound({
  modeArea,
  grid,
  onResult,
  retryHint = '',
  onRetry = null,
  onReveal = null,
}) {
  const startTime = Date.now();
  let firstTryWrong = false;
  let finished = false;

  const feedback = document.createElement('div');
  feedback.className = 'choice-feedback';
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  grid.insertAdjacentElement('afterend', feedback);

  function setFeedback(kind, text) {
    feedback.className = `choice-feedback choice-feedback--${kind}`;
    feedback.innerHTML = '';
    const icon = document.createElement('span');
    icon.className = 'choice-feedback-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = kind === 'retry' ? '✗' : '✓';
    const msg = document.createElement('span');
    msg.className = 'choice-feedback-text';
    msg.textContent = text;
    feedback.appendChild(icon);
    feedback.appendChild(msg);
  }

  function markBtn(btn, correct) {
    if (!btn) return;
    btn.classList.add(correct ? 'correct' : 'wrong');
    if (!btn.querySelector('.choice-result-icon')) {
      const icon = document.createElement('span');
      icon.className = `choice-result-icon choice-result-icon--${correct ? 'yes' : 'no'}`;
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = correct ? '✓' : '✗';
      btn.appendChild(icon);
    }
  }

  function finish(finalCorrect) {
    finished = true;
    grid.querySelectorAll('.choice-btn').forEach((b) => {
      b.disabled = true;
      if (b.dataset.correct === 'true') markBtn(b, true);
    });

    onReveal?.();

    const wrap = document.createElement('div');
    wrap.className = 'vmcq-next-wrap';
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn btn--primary vmcq-next-btn';
    nextBtn.textContent = 'Next →';
    nextBtn.setAttribute('aria-label', 'Next word');
    wrap.appendChild(nextBtn);
    modeArea.appendChild(wrap);
    nextBtn.addEventListener(
      'click',
      () => {
        onResult(finalCorrect, Date.now() - startTime);
      },
      { once: true },
    );
    nextBtn.focus();
  }

  function handleTap(isCorrect, btn) {
    if (finished || btn?.disabled) return;
    // The child has committed — stop any option previews still queued.
    cancelChoicePreviews();

    if (isCorrect) {
      markBtn(btn, true);
      setFeedback('correct', firstTryWrong ? 'You got it! ⭐' : 'Yes! 🎉');
      finish(!firstTryWrong);
    } else if (!firstTryWrong) {
      firstTryWrong = true;
      markBtn(btn, false);
      btn.disabled = true;
      setFeedback('retry', retryHint ? `Almost! Try again. ${retryHint}` : 'Almost! Try again.');
      onRetry?.();
    } else {
      markBtn(btn, false);
      setFeedback('reveal', 'Good try! Here’s the answer.');
      finish(false);
    }
  }

  return { handleTap, isDone: () => finished };
}
