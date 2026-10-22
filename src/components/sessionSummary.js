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

import { store } from '../modules/store.js';
import { getActiveProfile } from '../modules/profiles.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { WORDS } from '../data/words.js';
import {
  wordsReadToday,
  wordsKeptToday,
  nextAdventure,
  effortMessage,
  MAX_WORDS_SHOWN,
} from '../modules/sessionWins.js';

const getAudio = () => import('../modules/audio.js').then((m) => m.audio);

/** id → written word, built once on first use. */
let _wordText = null;
function wordText(id) {
  if (!_wordText) _wordText = new Map(WORDS.map((w) => [w.id, w.word]));
  return _wordText.get(id);
}

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
export function showSessionSummary({
  xpEarned,
  wordsCount,
  firstTryCount = 0,
  streak,
  newBadges = [],
  onClose,
}) {
  const container = document.getElementById('screen-session-summary');
  if (!container) {
    onClose();
    return;
  }

  const profile = getActiveProfile();
  // Escaped once here: firstName is spliced into the motivational headings
  // below, which are assigned to innerHTML.
  const firstName = escapeHtml(profile?.name?.split(' ')[0] || 'Great job');
  const avatar = profile?.avatar || '🦁';
  const level = store.get('level') || 1;
  const bestStreak = store.get('bestStreak') || streak;

  // Motivational copy based on performance
  const messages = [
    `You did it, ${firstName}! 🎉`,
    `Brilliant work today, ${firstName}!`,
    `${firstName} is on a roll! 🚀`,
    `That was amazing, ${firstName}! 🌟`,
  ];
  const heading = messages[Math.floor(Math.random() * messages.length)];

  // What the child learned, not just what they scored.
  const readWords = wordsReadToday(store.get('wordHistory') || [], wordText);
  const keptWords = wordsKeptToday(store.get('wordStats') || {}, wordText);
  const next = nextAdventure(store.get('currentGroup'), store.get('groupMastery') || {});

  const streakHtml =
    streak > 0
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
           ${newBadges
             .map(
               (b) => `
             <div class="ss-badge-item">
               <span class="ss-badge-emoji" aria-hidden="true">${b.emoji}</span>
               <span class="ss-badge-name">${b.name}</span>
             </div>`,
             )
             .join('')}
         </div>
       </div>`
    : '';

  // Praise for effort, never a red grade: a child who needed help still
  // worked hard, and the tricky words come back on their own to practise.
  const firstTryLabel = effortMessage(firstTryCount, wordsCount);

  const shown = readWords.slice(0, MAX_WORDS_SHOWN);
  const more = readWords.length - shown.length;
  const wordsHtml = shown.length
    ? `<div class="ss-learned" aria-label="Words you read today">
         <p class="ss-learned-title">📖 Words you read today</p>
         <ul class="ss-word-chips">
           ${shown.map((w) => `<li class="ss-word-chip">${escapeHtml(w)}</li>`).join('')}
           ${more > 0 ? `<li class="ss-word-chip ss-word-chip--more">+${more} more</li>` : ''}
         </ul>
         ${
           keptWords.length
             ? `<p class="ss-kept">🧠 ${keptWords.length === 1 ? `<strong>${escapeHtml(keptWords[0])}</strong> is` : `<strong>${keptWords.length} words</strong> are`} now yours for keeps!</p>`
             : ''
         }
       </div>`
    : '';

  const nextHtml = next
    ? `<div class="ss-next" aria-label="Next time">
         <p class="ss-next-title">${next.kind === 'next' ? '🗝️ You unlocked something new for next time:' : "🎯 Next time, let's make this one strong:"}</p>
         <p class="ss-next-name">${escapeHtml(next.name)}</p>
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
        <span class="ss-stat-icon" aria-hidden="true">📖</span>
        <span class="ss-stat-value">${wordsCount}</span>
        <span class="ss-stat-label">word${wordsCount !== 1 ? 's' : ''} decoded</span>
      </div>
      <div class="ss-stat ss-stat--quality" aria-label="${firstTryCount} of ${wordsCount} words read by yourself">
        <span class="ss-stat-icon" aria-hidden="true">🎯</span>
        <span class="ss-stat-value">${firstTryCount}/${wordsCount}</span>
        <span class="ss-stat-label">by yourself</span>
      </div>
      <div class="ss-stat">
        <span class="ss-stat-icon" aria-hidden="true">🏆</span>
        <span class="ss-stat-value">Lv ${level}</span>
        <span class="ss-stat-label">current level</span>
      </div>
    </div>
    <p class="ss-quality-label">${firstTryLabel}</p>`;

  container.innerHTML = `
    <div class="ss-wrapper" role="main" aria-label="Session complete">
      <div class="ss-avatar" aria-hidden="true">${avatar}</div>
      <h1 class="ss-heading">${heading}</h1>
      <p class="ss-subheading">Reading session complete — ${wordsCount} word${wordsCount !== 1 ? 's' : ''} practised today!</p>

      ${statsHtml}
      ${wordsHtml}
      ${streakHtml}
      ${badgesHtml}
      ${nextHtml}

      <div class="ss-actions">
        <button class="btn btn--primary btn--xl" id="ss-keep-going">
          Keep going →
        </button>
        <button class="btn btn--ghost" id="ss-go-home">
          Home
        </button>
      </div>

      <p class="ss-footer">See you tomorrow${profile?.name ? `, ${firstName}` : ''}! 👋</p>
    </div>`;

  // Focus the primary action
  setTimeout(() => container.querySelector('#ss-keep-going')?.focus(), 100);

  // Said aloud, so a child who cannot read the screen yet still hears what
  // they achieved and what is coming next.
  const spoken = [
    `You read ${wordsCount} word${wordsCount !== 1 ? 's' : ''} today.`,
    firstTryLabel,
    next ? (next.kind === 'next' ? 'Next time, something new!' : 'See you tomorrow!') : '',
  ]
    .filter(Boolean)
    .join(' ');
  getAudio()
    .then((audio) => audio.speakText(spoken))
    .catch(() => {
      /* silence is an acceptable outcome */
    });

  container.querySelector('#ss-keep-going')?.addEventListener('click', () => {
    onClose({ continueSession: true });
  });
  container.querySelector('#ss-go-home')?.addEventListener('click', () => {
    onClose({ continueSession: false });
  });
}
