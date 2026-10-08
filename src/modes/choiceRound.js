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
 * When the mode passes `diagnose`, the wrong-tap lines name the child's
 * actual slip instead (see modules/phonicsDiagnosis.js): the first miss
 * gets a cue that points at the evidence without giving the answer, and
 * the reveal says which two sounds were mixed up. `onReveal` then receives
 * the wrong choice so the mode can play the two sounds side by side.
 *
 * Feedback is text + ✓/✗ glyphs inside a `role="status"` live region, so
 * right/wrong never relies on colour or animation alone (colour-blind,
 * reduced-motion, and forced-colors users all get the same signal).
 *
 * Buttons must carry `data-correct="true|false"` so the controller can
 * light up the right answer at reveal time.
 */

import { cancelChoicePreviews } from '../components/phonemeChoice.js';
import { audio } from '../modules/audio.js';

/**
 * Play the sound the child wrongly chose, then a short gap, so the reveal
 * can follow it with the right one: "/e/ … /a/ … bad". Hearing the two side
 * by side is how a teacher fixes a mix-up; the reveal alone only plays the
 * answer. Resolves immediately when there is no mistake to contrast.
 *
 * @param {{ grapheme?: string, type?: string }|null} mistake
 */
export async function playMistakeSound(mistake) {
  if (!mistake?.grapheme) return;
  try {
    await audio.speakPhoneme(mistake.grapheme, mistake.type);
  } catch {
    return; // no audio for it: go straight to the answer
  }
  await new Promise((r) => setTimeout(r, 450));
}

/**
 * @param {object} opts
 * @param {HTMLElement} opts.modeArea  container for the feedback strip + Next button
 * @param {HTMLElement} opts.grid      the .choice-grid holding the option buttons
 * @param {(correct: boolean, responseTime: number) => void} opts.onResult
 * @param {string}   [opts.retryHint]  mode-specific coaching line shown after "Almost! Try again."
 * @param {() => void} [opts.onRetry]  replay the prompt audio on the first miss
 * @param {(choice: any) => ({ cue: string, reveal: string }|null)} [opts.diagnose]
 *   names the slip behind a wrong choice; null falls back to `retryHint`
 * @param {(info: { mistake: any }) => void} [opts.onReveal] mode-specific reveal
 *   (word animation, phoneme tiles, audio). `mistake` is the wrong choice the
 *   round ended on, or null when the child finished on a right answer.
 * @returns {{ handleTap: (isCorrect: boolean, btn: HTMLButtonElement, choice?: any) => void, isDone: () => boolean }}
 */
export function createChoiceRound({
  modeArea,
  grid,
  onResult,
  retryHint = '',
  onRetry = null,
  onReveal = null,
  diagnose = null,
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

  function diagnosisFor(choice) {
    if (!diagnose || choice === undefined) return null;
    try {
      return diagnose(choice);
    } catch {
      // A diagnosis is a nicety; a bad lookup must never block the round.
      return null;
    }
  }

  function finish(finalCorrect, mistake = null) {
    finished = true;
    grid.querySelectorAll('.choice-btn').forEach((b) => {
      b.disabled = true;
      if (b.dataset.correct === 'true') markBtn(b, true);
    });

    onReveal?.({ mistake });

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

  function handleTap(isCorrect, btn, choice) {
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
      const cue = diagnosisFor(choice)?.cue;
      if (cue) setFeedback('retry', `Almost! ${cue}`);
      else
        setFeedback('retry', retryHint ? `Almost! Try again. ${retryHint}` : 'Almost! Try again.');
      onRetry?.();
    } else {
      markBtn(btn, false);
      const reveal = diagnosisFor(choice)?.reveal;
      setFeedback('reveal', reveal ? `Good try! ${reveal}` : 'Good try! Here’s the answer.');
      finish(false, choice ?? null);
    }
  }

  return { handleTap, isDone: () => finished };
}
