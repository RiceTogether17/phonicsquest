/**
 * PhonicsQuest – Home screen banners & badges
 *
 * The home screen shows a row of "there is something waiting for you"
 * banners (review lane, daily challenge, word workout, mistakes den,
 * trophy room, quest unlocks) plus the Today tab's count badge. Each one
 * reads current progress and either fills in a subtitle or hides itself.
 *
 * Extracted from app.js: these are pure DOM updates driven entirely by
 * module state, with no dependency on app internals. `updateQuestBanners`
 * takes the unlock status as an argument rather than reaching back into
 * the app for it, so this module stays free of app coupling.
 *
 * Every function is a no-op when its element is absent, so partial DOM
 * (tests, or a screen that hasn't rendered yet) is safe.
 */

import { store } from './store.js';
import { progress } from './progress.js';
import { estimateMinutes as estimateReviewMinutes } from './reviewScheduler.js';
import { isDailyChallengeComplete, DAILY_BONUS_XP } from './dailyChallenge.js';
import { getMistakesDenSummary, MISTAKES_LOOKBACK_DAYS } from './mistakesDen.js';

/** Show/hide a banner and return whether it ended up visible. */
function _setVisible(banner, visible) {
  banner.style.display = visible ? '' : 'none';
  return visible;
}

/** Review Lane banner — how many words are due today. */
export function updateReviewBanner() {
  const banner = document.getElementById('review-banner');
  if (!banner) return;
  const dueCount = progress.getReviewDueCount();
  const sub = document.getElementById('review-banner-sub');

  if (_setVisible(banner, dueCount > 0) && sub) {
    const minutes = estimateReviewMinutes(dueCount);
    sub.textContent = `${dueCount} word${dueCount === 1 ? '' : 's'} due today · about ${minutes} min`;
  }
  updateTodayTabBadge();
}

/** Daily Challenge banner — done state vs. the XP on offer. */
export function updateDailyBanner() {
  const done = isDailyChallengeComplete();
  const title = document.getElementById('daily-banner-title');
  const sub   = document.getElementById('daily-banner-sub');
  const arrow = document.getElementById('daily-banner-arrow');

  if (title) title.textContent = done ? '✅ Daily Challenge' : '⚡ Daily Challenge';
  if (sub)   sub.textContent   = done ? 'Completed today – well done!' : `5 words · earn ${DAILY_BONUS_XP} bonus XP`;
  if (arrow) arrow.textContent = done ? '✓' : '→';

  const banner = document.getElementById('btn-daily-challenge');
  if (banner) banner.classList.toggle('stories-banner--done', done);
}

/** Word Workout banner — only offered when something is actually due. */
export function updateWordWorkoutBanner() {
  const banner = document.getElementById('word-workout-banner');
  if (!banner) return;
  const sub = document.getElementById('word-workout-sub');

  if (_setVisible(banner, progress.getReviewDueCount() > 0) && sub) {
    sub.textContent = 'Drill one due word through 4 angles';
  }
}

/** Mistakes Den banner — recent errors worth retrying. */
export function updateMistakesDenBanner() {
  const banner = document.getElementById('mistakes-den-banner');
  if (!banner) return;
  let summary;
  try { summary = getMistakesDenSummary(); } catch (_) { summary = { count: 0 }; }
  const sub = document.getElementById('mistakes-den-sub');

  if (_setVisible(banner, summary.count > 0) && sub) {
    sub.textContent = `${summary.count} to retry · last ${MISTAKES_LOOKBACK_DAYS} days`;
  }
}

/** Trophy Room banner — hidden until the child has anything to show. */
export function updatePersonalBestBanner() {
  const banner = document.getElementById('personal-best-banner');
  if (!banner) return;
  const xp = store.get('xp') || 0;
  const calendar = Array.isArray(store.get('challengeCalendar')) ? store.get('challengeCalendar') : [];

  if (_setVisible(banner, xp > 0 || calendar.length > 0)) {
    const sub = document.getElementById('personal-best-sub');
    if (sub) {
      const bestStreak = store.get('bestStreak') || 0;
      sub.textContent = bestStreak > 0
        ? `Best streak ${bestStreak} day${bestStreak === 1 ? '' : 's'} · see your trophies`
        : 'See your personal bests';
    }
  }
}

/**
 * Quest banners — subtitle reflects unlock progress, locked ones say what
 * is still needed rather than just refusing.
 * @param {Record<string, {unlocked:boolean, required:number, current:number}>} unlock
 */
export function updateQuestBanners(unlock) {
  if (!unlock) return;

  const banners = [
    { id: 'btn-sentence-forge', quest: unlock.sentenceForge, label: '6 levels · unscramble & build sentences' },
    { id: 'btn-cloze-castle',   quest: unlock.clozeCastle,   label: 'P1–P6 · grammar cloze passages' },
    { id: 'btn-word-vault',     quest: unlock.wordVault,     label: '7 categories · vocabulary cloze passages' },
    { id: 'btn-editing-quest',  quest: unlock.editingQuest,  label: 'Editing and grammar correction tasks' },
    { id: 'btn-writing-quest',  quest: unlock.writingQuest,  label: 'Guided writing with rubric feedback' },
  ];

  for (const b of banners) {
    const el = document.getElementById(b.id);
    if (!el || !b.quest) continue;
    const sub = el.querySelector('.stories-banner-sub');
    const arrow = el.querySelector('.stories-banner-arrow');

    if (b.quest.unlocked) {
      if (sub) sub.textContent = b.label;
      if (arrow) arrow.textContent = '→';
      el.classList.remove('stories-banner--locked');
    } else {
      if (sub) sub.textContent = `🔒 Master ${b.quest.required} words to unlock (${b.quest.current}/${b.quest.required})`;
      if (arrow) arrow.textContent = '🔒';
      el.classList.add('stories-banner--locked');
    }
  }
}

/** Today tab count badge — reviews due plus mistakes waiting. */
export function updateTodayTabBadge() {
  const badge = document.getElementById('home-tab-today-badge');
  if (!badge) return;

  let count = 0;
  try { count += progress.getReviewDueCount() || 0; } catch (_) { /* fresh profile */ }
  try { count += getMistakesDenSummary().count || 0; } catch (_) { /* fresh profile */ }

  badge.hidden = count === 0;
  badge.textContent = count > 9 ? '9+' : String(count);

  const tab = document.getElementById('home-tab-today');
  if (tab) {
    tab.setAttribute('aria-label', count > 0
      ? `Today — your lesson and reviews, ${count} item${count === 1 ? '' : 's'} waiting`
      : 'Today — your lesson and reviews');
  }
}
