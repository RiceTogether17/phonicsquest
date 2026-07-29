/**
 * PhonicsQuest – First-run onboarding + parent PIN gate.
 *
 * Two adult-facing entry flows, extracted from app.js:
 *
 *   • the once-per-install tutorial that orients a parent to their child's
 *     pathway (content lives in data/onboardingTutorial.js), and
 *   • the 4-digit PIN gate protecting the parent dashboard.
 *
 * Modal open/close and dashboard opening are injected as callbacks so this
 * module doesn't depend on the app shell.
 */

import { store } from './store.js';
import { createPinHash, verifyPin } from './parentPin.js';
import { getTutorialScreens } from '../data/onboardingTutorial.js';
import { html, raw } from '../utils/html.js';

const PIN_LENGTH = 4;

/**
 * @typedef {object} OnboardingHandlers
 * @property {(id: string) => void} openModal
 * @property {(id: string) => void} closeModal
 * @property {() => void} [onUnlocked]  run after a correct/first PIN entry
 */

// ── Onboarding tutorial ─────────────────────────────────────────────────────

/**
 * Show the first-run tutorial for a reading band and mark it complete when
 * the parent finishes or skips.
 *
 * @param {string} readingBand
 * @param {Pick<OnboardingHandlers,'openModal'|'closeModal'>} handlers
 */
export function showOnboardingTutorial(readingBand, handlers) {
  const screens = getTutorialScreens(readingBand);

  const contentEl = document.getElementById('ob-content');
  const dotsEl    = document.getElementById('ob-dots');
  const prevBtn   = /** @type {HTMLButtonElement|null} */ (document.getElementById('ob-prev'));
  const nextBtn   = /** @type {HTMLButtonElement|null} */ (document.getElementById('ob-next'));
  const skipBtn   = /** @type {HTMLButtonElement|null} */ (document.getElementById('ob-skip-btn'));

  if (!contentEl || !dotsEl || !prevBtn || !nextBtn) return;

  let step = 0;

  const renderStep = (s) => {
    const sc = screens[s];
    // `sc.body` is authored markup from data/onboardingTutorial.js, so it is
    // spliced in with raw(). Never pass learner or model text through here.
    contentEl.innerHTML = html`
      <div class="ob-screen">
        <div class="ob-screen-icon" aria-hidden="true">${sc.icon}</div>
        <h2 class="ob-screen-title">${sc.title}</h2>
        <div class="ob-screen-body">${raw(sc.body)}</div>
      </div>`;

    dotsEl.innerHTML = screens.map((_, i) => html`
      <span class="ob-dot ${i === s ? 'ob-dot--active' : ''}" role="tab" aria-selected="${i === s}"></span>`
    ).join('');

    prevBtn.hidden = s === 0;
    nextBtn.textContent = s === screens.length - 1 ? "Let's go! 🚀" : 'Next →';
  };

  const closeTutorial = () => {
    store.set('onboardingComplete', true);
    handlers.closeModal('modal-onboarding');
  };

  // Assigned (not addEventListener) so re-opening never stacks handlers.
  prevBtn.onclick = () => { if (step > 0) { step--; renderStep(step); } };
  nextBtn.onclick = () => {
    if (step < screens.length - 1) { step++; renderStep(step); }
    else closeTutorial();
  };
  if (skipBtn) skipBtn.onclick = closeTutorial;

  renderStep(0);
  handlers.openModal('modal-onboarding');
}

// ── Parent PIN gate ─────────────────────────────────────────────────────────

/**
 * Wire the 4-digit PIN entry: auto-advance between boxes, backspace to the
 * previous box, and verify (or set, on first use) on confirm.
 *
 * @param {OnboardingHandlers} handlers
 */
export function bindPinGate(handlers) {
  const digits = /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('.pin-digit'));
  const hint = document.getElementById('pin-hint');
  if (!digits.length) return;

  const setHint = (msg) => { if (hint) hint.textContent = msg; };
  const clearDigits = () => {
    digits.forEach(d => { d.value = ''; });
    digits[0]?.focus();
  };

  digits.forEach((input, i) => {
    input.addEventListener('input', (e) => {
      if (/** @type {HTMLInputElement} */ (e.target).value && i < digits.length - 1) {
        digits[i + 1].focus();
      }
    });
    input.addEventListener('keydown', (e) => {
      const ke = /** @type {KeyboardEvent} */ (e);
      if (ke.key === 'Backspace' && !(/** @type {HTMLInputElement} */ (ke.target)).value && i > 0) {
        digits[i - 1].focus();
      }
    });
  });

  document.getElementById('pin-confirm-btn')?.addEventListener('click', async () => {
    const pin = Array.from(digits).map(d => d.value).join('');
    if (pin.length < PIN_LENGTH) {
      setHint(`Enter all ${PIN_LENGTH} digits`);
      return;
    }

    const savedPin = store.get('parentPin');

    if (!savedPin) {
      // First use: whatever the parent types becomes the PIN, salted+hashed.
      store.set('parentPin', await createPinHash(pin));
      setHint('');
      handlers.closeModal('modal-pin');
      handlers.onUnlocked?.();
      return;
    }

    const { ok, needsUpgrade } = await verifyPin(pin, savedPin);
    if (!ok) {
      setHint('Wrong PIN. Try again.');
      clearDigits();
      return;
    }

    // Migrate legacy plaintext/unsalted records on a successful entry.
    if (needsUpgrade) store.set('parentPin', await createPinHash(pin));
    setHint('');
    handlers.closeModal('modal-pin');
    handlers.onUnlocked?.();
  });

  document.getElementById('pin-cancel-btn')?.addEventListener('click', () => {
    handlers.closeModal('modal-pin');
    clearDigits();
  });
}
