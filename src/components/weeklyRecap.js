/**
 * PhonicsQuest – Weekly Recap
 *
 * Shown on the first app open of each new week (or accessible from home).
 * Summarises the past 7 days: words mastered, quests done, streak days,
 * level progress, and a motivational message.
 *
 * Public API:
 *   shouldShowWeeklyRecap()  → boolean
 *   showWeeklyRecap({ stats, onClose })
 */

import { store } from '../modules/store.js';
import { getActiveProfile } from '../modules/profiles.js';
import { html } from '../utils/html.js';

const RECAP_INTERVAL_DAYS = 7;

/**
 * Returns true if 7+ days have elapsed since the last weekly recap was shown.
 * @returns {boolean}
 */
export function shouldShowWeeklyRecap() {
  const last = store.get('lastWeeklyRecapAt');
  if (!last) return false; // Don't show on first week — not enough data
  const elapsed = (Date.now() - new Date(last).getTime()) / 86400000;
  return elapsed >= RECAP_INTERVAL_DAYS;
}

/**
 * Show the weekly recap inside the #modal-weekly-recap modal overlay.
 * @param {{
 *   stats: { daysPlayed:number, xpThisWeek:number, wordsThisWeek:number, questsThisWeek:number },
 *   onClose: () => void,
 * }} opts
 */
export function showWeeklyRecap({ stats, onClose }) {
  const existing = document.getElementById('modal-weekly-recap');
  if (existing) existing.remove();

  const profile = getActiveProfile();
  const name = profile?.name?.split(' ')[0] || 'Learner';
  const avatar = profile?.avatar || '🦁';
  const streak = store.get('streak') || 0;
  const level = store.get('level') || 1;

  // Mark as shown
  store.set('lastWeeklyRecapAt', new Date().toISOString());

  // Choose motivational message based on days played
  const perfMessages = {
    7: [`Incredible week, ${name}! 7 days straight — you're unstoppable! 🏆`, '🔥'],
    6: [`Amazing effort, ${name}! 6 out of 7 days this week! Keep it up! 🌟`, '⭐'],
    5: [`Great week, ${name}! 5 days of learning — that's real dedication! 💪`, '✨'],
    4: [`Solid week, ${name}! 4 days done. Can you do 5 next week? 🎯`, '🎯'],
    3: [`Good start, ${name}! 3 days this week. Every session counts! 🌱`, '🌱'],
  };
  const [message, icon] = perfMessages[stats.daysPlayed] ?? [
    `A new week begins, ${name}! Let's make it a great one! 🚀`,
    '🚀',
  ];

  const modal = document.createElement('div');
  modal.id = 'modal-weekly-recap';
  modal.className = 'modal-overlay modal-overlay--active';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Weekly learning recap');

  // html`` escapes every interpolation — `message` embeds the profile name,
  // which is user-supplied (and reachable from an imported profile file).
  modal.innerHTML = html`
    <div class="modal-panel wr-panel">
      <div class="wr-header">
        <span class="wr-icon" aria-hidden="true">${icon}</span>
        <h2 class="wr-title">This Week's Recap</h2>
      </div>

      <div class="wr-avatar" aria-hidden="true">${avatar}</div>
      <p class="wr-message">${message}</p>

      <div class="wr-stats" aria-label="Weekly stats">
        <div class="wr-stat">
          <span class="wr-stat-icon" aria-hidden="true">📅</span>
          <span class="wr-stat-value">${stats.daysPlayed}</span>
          <span class="wr-stat-label">days played</span>
        </div>
        <div class="wr-stat">
          <span class="wr-stat-icon" aria-hidden="true">📚</span>
          <span class="wr-stat-value">${stats.wordsThisWeek}</span>
          <span class="wr-stat-label">words practised</span>
        </div>
        <div class="wr-stat">
          <span class="wr-stat-icon" aria-hidden="true">⭐</span>
          <span class="wr-stat-value">${stats.xpThisWeek || '—'}</span>
          <span class="wr-stat-label">XP earned</span>
        </div>
        <div class="wr-stat">
          <span class="wr-stat-icon" aria-hidden="true">🔥</span>
          <span class="wr-stat-value">${streak}</span>
          <span class="wr-stat-label">day streak</span>
        </div>
      </div>

      <div class="wr-level-row" aria-label="Current level: ${level}">
        <span class="wr-level-label">Level</span>
        <span class="wr-level-badge">🏆 ${level}</span>
      </div>

      <button class="btn btn--primary btn--xl wr-cta" id="wr-start-btn">
        Start this week →
      </button>
    </div>`;

  document.body.appendChild(modal);

  modal.querySelector('#wr-start-btn')?.addEventListener('click', () => {
    modal.remove();
    onClose();
  });

  // Escape key closes
  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      modal.remove();
      onClose();
      document.removeEventListener('keydown', onKeyDown);
    }
  };
  document.addEventListener('keydown', onKeyDown);

  setTimeout(() => modal.querySelector('#wr-start-btn')?.focus(), 100);
}
