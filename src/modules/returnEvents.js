/**
 * PhonicsQuest – Return-visit events
 *
 * What a learner sees when they come back after time away, in strict
 * priority order so modals never stack:
 *
 *   streak-freeze toast → comeback modal (2–6 days away)
 *                       → weekly recap (7+ days since the last one)
 *                       → backup reminder
 *
 * Only one modal runs per return; each hands off to the next check when
 * dismissed. The comeback and recap paths are mutually exclusive by design
 * — a child returning after a week should get one warm welcome, not three.
 *
 * Extracted from app.js. App-specific actions (toasts, starting a warm-up
 * round) are injected as callbacks so this module owns no app state.
 */

import { store } from './store.js';
import { gamification } from './gamification.js';
import { getActiveProfile, exportProfile } from './profiles.js';
import { shouldShowWeeklyRecap, showWeeklyRecap } from '../components/weeklyRecap.js';
import { html } from '../utils/html.js';

/** Days away that count as "a short absence worth welcoming back". */
const COMEBACK_MIN_DAYS = 2;
const COMEBACK_MAX_DAYS = 6;

/** Don't nag about backups more than once a week... */
const BACKUP_REMINDER_INTERVAL_DAYS = 7;
/** ...and not at all until there's progress genuinely worth losing. */
const BACKUP_MIN_WORDS = 10;

/** Delay before a modal appears, so it doesn't slam in over the home render. */
const MODAL_DELAY_MS = 600;

/**
 * @typedef {object} ReturnEventHandlers
 * @property {(msg: string, type?: string) => void} [onToast]
 * @property {() => void} [onStartWarmUp]  begin the comeback warm-up round
 */

/**
 * Run the return-visit checks in priority order.
 * @param {ReturnEventHandlers} [handlers]
 */
export function checkReturnEvents(handlers = {}) {
  if (gamification.wasFreezeUsed()) {
    handlers.onToast?.('Streak saved! 🛡️ Your streak freeze was used automatically.', 'success');
  }

  const daysAway = gamification.getDaysAway();
  if (
    daysAway >= COMEBACK_MIN_DAYS &&
    daysAway <= COMEBACK_MAX_DAYS &&
    !_shownToday('comebackShownAt')
  ) {
    store.set('comebackShownAt', new Date().toISOString());
    setTimeout(() => showComebackModal(daysAway, handlers), MODAL_DELAY_MS);
    return;
  }

  if (shouldShowWeeklyRecap()) {
    const stats = gamification.getWeeklyStats();
    setTimeout(
      () =>
        showWeeklyRecap({
          stats,
          onClose: () => checkBackupReminder(handlers),
        }),
      MODAL_DELAY_MS,
    );
    return;
  }

  checkBackupReminder(handlers);
}

/** Has the modal behind this store key already been shown today? @private */
function _shownToday(key) {
  const last = store.get(key);
  if (!last) return false;
  return new Date(last).toDateString() === new Date().toDateString();
}

/** Build a full-screen modal overlay shell. @private */
function _makeModal(id, ariaLabel) {
  document.getElementById(id)?.remove();
  const modal = document.createElement('div');
  modal.id = id;
  modal.className = 'modal-overlay modal-overlay--active';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', ariaLabel);
  return modal;
}

/**
 * "Welcome back" modal after a short absence. Offers a gentle warm-up
 * rather than dropping the child straight into new material.
 * @param {number} daysAway
 * @param {ReturnEventHandlers} [handlers]
 */
export function showComebackModal(daysAway, handlers = {}) {
  const profile = getActiveProfile();
  const name = profile?.name?.split(' ')[0] || 'there';
  const dayLabel = daysAway === 1 ? 'yesterday' : `${daysAway} days ago`;
  const streak = store.get('streak') || 0;

  const modal = _makeModal('modal-comeback', 'Welcome back');
  modal.innerHTML = html`
    <div class="modal-panel cb-panel">
      <div class="cb-icon" aria-hidden="true">👋</div>
      <h2 class="cb-title">Welcome back, ${name}!</h2>
      <p class="cb-body">You last played ${dayLabel}. Let's warm up with a quick 5-question round before diving in.</p>
      ${streak > 0 ? html`<p class="cb-streak">🔥 Your streak is at <strong>${streak} days</strong> — keep it going!</p>` : ''}
      <div class="cb-actions">
        <button class="btn btn--primary btn--xl" id="cb-warm-up">Start warm-up →</button>
        <button class="btn btn--ghost" id="cb-skip">Skip, go to home</button>
      </div>
    </div>`;

  document.body.appendChild(modal);

  modal.querySelector('#cb-warm-up')?.addEventListener('click', () => {
    modal.remove();
    handlers.onStartWarmUp?.();
  });
  modal.querySelector('#cb-skip')?.addEventListener('click', () => {
    modal.remove();
    checkBackupReminder(handlers);
  });

  setTimeout(
    () => /** @type {HTMLElement|null} */ (modal.querySelector('#cb-warm-up'))?.focus(),
    100,
  );
}

/**
 * Show the backup reminder if enough time has passed and the profile has
 * progress genuinely worth protecting.
 * @param {ReturnEventHandlers} [handlers]
 */
export function checkBackupReminder(handlers = {}) {
  const last = store.get('lastBackupReminderAt');
  if (last) {
    const daysSince = (Date.now() - new Date(last).getTime()) / 86_400_000;
    if (daysSince < BACKUP_REMINDER_INTERVAL_DAYS) return;
  }

  const wordCount = Object.keys(store.get('wordStats') || {}).length;
  if (wordCount < BACKUP_MIN_WORDS) return;

  store.set('lastBackupReminderAt', new Date().toISOString());
  showBackupReminderModal(handlers);
}

/**
 * Offer a one-tap progress export. Framed around what's at stake (the
 * child's practised words) rather than generic "back up your data".
 * @param {ReturnEventHandlers} [handlers]
 */
export function showBackupReminderModal(handlers = {}) {
  const profile = getActiveProfile();
  const wordCount = Object.keys(store.get('wordStats') || {}).length;

  const modal = _makeModal('modal-backup-reminder', 'Backup your progress');
  modal.innerHTML = html`
    <div class="modal-panel br-panel">
      <div class="br-icon" aria-hidden="true">💾</div>
      <h2 class="br-title">Back up your progress!</h2>
      <p class="br-body">
        ${profile?.name || 'Your learner'} has practised <strong>${wordCount} words</strong>.
        If browser data is cleared, this progress could be lost.
      </p>
      <p class="br-body">Download a backup file to keep it safe.</p>
      <div class="br-actions">
        <button class="btn btn--primary" id="br-export-btn">📥 Download backup</button>
        <button class="btn btn--ghost" id="br-dismiss-btn">Remind me later</button>
      </div>
    </div>`;

  document.body.appendChild(modal);

  modal.querySelector('#br-export-btn')?.addEventListener('click', () => {
    if (profile?.id) exportProfile(profile.id);
    modal.remove();
    handlers.onToast?.('Backup downloaded! Keep the file somewhere safe.', 'success');
  });
  modal.querySelector('#br-dismiss-btn')?.addEventListener('click', () => modal.remove());

  setTimeout(
    () => /** @type {HTMLElement|null} */ (modal.querySelector('#br-export-btn'))?.focus(),
    100,
  );
}
