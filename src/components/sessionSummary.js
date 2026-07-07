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
export function showSessionSummary({ xpEarned, wordsCount, firstTryCount = 0, streak, newBadges = [], onClose }) {
  const container = document.getElementById('screen-session-summary');
  if (!container) { onClose(); return; }

  const profile      = getActiveProfile();
  const firstName    = profile?.name?.split(' ')[0] || 'Great job';
  const avatar       = profile?.avatar || '🦁';
  const level        = store.get('level') || 1;
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

  // First-try rate: colour-code as a quality signal
  const firstTryPct    = wordsCount > 0 ? Math.round((firstTryCount / wordsCount) * 100) : 0;
  const firstTryColour = firstTryPct >= 70 ? '#22c55e' : firstTryPct >= 50 ? '#f59e0b' : '#ef4444';
  const firstTryLabel  = firstTryPct >= 70 ? 'Decoded independently'
                       : firstTryPct >= 50 ? 'Mostly independent'
                       : 'Needs more practice';

  const statsHtml = `
    <div class="ss-stats" aria-label="Today's stats">
      <div class="ss-stat">
        <span class="ss-stat-icon" aria-hidden="true">⭐</span>
        <span class="ss-stat-value">+${xpEarned}</span>
        <span class="ss-stat-label">XP earned</span>
      </div>
      <div class="ss-stat">
        <span class="ss-stat-icon" aria-hidden="true">📖</span>
        <span class="ss-stat-value">${wordsCount}</span>
        <span class="ss-stat-label">word${wordsCount !== 1 ? 's' : ''} decoded</span>
      </div>
      <div class="ss-stat ss-stat--quality" aria-label="${firstTryLabel}: ${firstTryCount} of ${wordsCount} words">
        <span class="ss-stat-icon" aria-hidden="true">🎯</span>
        <span class="ss-stat-value" style="color:${firstTryColour}">${firstTryCount}/${wordsCount}</span>
        <span class="ss-stat-label">first try</span>
      </div>
      <div class="ss-stat">
        <span class="ss-stat-icon" aria-hidden="true">🏆</span>
        <span class="ss-stat-value">Lv ${level}</span>
        <span class="ss-stat-label">current level</span>
      </div>
    </div>
    <p class="ss-quality-label" style="color:${firstTryColour};font-size:0.75rem;font-weight:700;margin:0 0 12px;text-align:center;">${firstTryLabel}</p>`;

  container.innerHTML = `
    <div class="ss-wrapper" role="main" aria-label="Session complete">
      <div class="ss-avatar" aria-hidden="true">${avatar}</div>
      <h1 class="ss-heading">${heading}</h1>
      <p class="ss-subheading">Reading session complete — ${wordsCount} word${wordsCount !== 1 ? 's' : ''} practised today!</p>

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
