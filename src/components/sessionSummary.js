/**
 * PhonicsQuest – Session Summary
 *
 * A closing screen shown when the learner hits their daily goal.
 * Provides the session-ending ceremony: XP earned, words practised,
 * streak status, new badges, and a "See you tomorrow!" closer.
 *
 * Public API:
 *   showSessionSummary({ xpEarned, wordsCount, streak, newBadges, onClose })
 *     Renders the summary into the #screen-session-summary element.
 */

import { store }        from '../modules/store.js';
import { getActiveProfile } from '../modules/profiles.js';

/**
 * Show the session summary screen.
 * @param {{
 *   xpEarned:  number,
 *   wordsCount: number,
 *   streak:     number,
 *   newBadges:  Array<{name:string, emoji:string}>,
 *   onClose:   () => void,
 * }} opts
 */
export function showSessionSummary({ xpEarned, wordsCount, streak, newBadges = [], onClose }) {
  const container = document.getElementById('screen-session-summary');
  if (!container) { onClose(); return; }

  const profile      = getActiveProfile();
  const firstName    = profile?.name?.split(' ')[0] || 'Great job';
  const avatar       = profile?.avatar || '🦁';
  const level        = store.get('level') || 1;
  const dailyGoal    = store.get('dailyGoal') || 10;
  const bestStreak   = store.get('bestStreak') || streak;

  // Motivational copy based on performance
  const messages = [
    `You did it, ${firstName}! 🎉`,
    `Brilliant work today, ${firstName}!`,
    `${firstName} is on a roll! Keep going! 🚀`,
    `That was amazing, ${firstName}! 🌟`,
  ];
  const heading = messages[Math.floor(Math.random() * messages.length)];

  const streakHtml = streak > 0
    ? `<div class="ss-streak" aria-label="${streak} day streak">
         <span class="ss-streak-fire">🔥</span>
         <strong>${streak}</strong>
         <span class="ss-streak-label">day streak${streak > 1 ? '' : ''}</span>
         ${streak === bestStreak && streak > 1 ? '<span class="ss-best-badge">Best!</span>' : ''}
       </div>`
    : '';

  const badgesHtml = newBadges.length
    ? `<div class="ss-badges" aria-label="New badges earned">
         <p class="ss-badges-title">🏅 New badge${newBadges.length > 1 ? 's' : ''} unlocked!</p>
         <div class="ss-badges-list">
           ${newBadges.map(b => `
             <div class="ss-badge-item">
               <span class="ss-badge-emoji" aria-hidden="true">${b.emoji}</span>
               <span class="ss-badge-name">${b.name}</span>
             </div>`).join('')}
         </div>
       </div>`
    : '';

  const statsHtml = `
    <div class="ss-stats" aria-label="Today's stats">
      <div class="ss-stat">
        <span class="ss-stat-icon" aria-hidden="true">⭐</span>
        <span class="ss-stat-value">+${xpEarned}</span>
        <span class="ss-stat-label">XP earned</span>
      </div>
      <div class="ss-stat">
        <span class="ss-stat-icon" aria-hidden="true">📚</span>
        <span class="ss-stat-value">${wordsCount}</span>
        <span class="ss-stat-label">word${wordsCount !== 1 ? 's' : ''} practised</span>
      </div>
      <div class="ss-stat">
        <span class="ss-stat-icon" aria-hidden="true">🏆</span>
        <span class="ss-stat-value">Lv ${level}</span>
        <span class="ss-stat-label">current level</span>
      </div>
    </div>`;

  container.innerHTML = `
    <div class="ss-wrapper" role="main" aria-label="Session complete">
      <div class="ss-avatar" aria-hidden="true">${avatar}</div>
      <h1 class="ss-heading">${heading}</h1>
      <p class="ss-subheading">Daily goal complete! (${dailyGoal} activities done)</p>

      ${statsHtml}
      ${streakHtml}
      ${badgesHtml}

      <div class="ss-actions">
        <button class="btn btn--primary btn--xl" id="ss-keep-going">
          Keep going →
        </button>
        <button class="btn btn--ghost" id="ss-go-home">
          Home
        </button>
      </div>

      <p class="ss-footer">Come back tomorrow to keep your streak! 🔥</p>
    </div>`;

  // Focus the primary action
  setTimeout(() => container.querySelector('#ss-keep-going')?.focus(), 100);

  container.querySelector('#ss-keep-going')?.addEventListener('click', () => {
    onClose({ continueSession: true });
  });
  container.querySelector('#ss-go-home')?.addEventListener('click', () => {
    onClose({ continueSession: false });
  });
}
