/**
 * PhonicsQuest – Queued-session builders
 *
 * The three sessions that run a pre-chosen queue of words rather than
 * letting a mode pick as it goes:
 *
 *   Daily Challenge — the seeded 5-word set, worth bonus XP
 *   Review Lane     — everything due today, capped for the child's band
 *   Word Workout    — one word driven through several modes in a row
 *
 * These functions decide *what* the session contains and *what to say about
 * it*; they deliberately do not touch app state. The session fields
 * (`_sessionType`, `_queuedWords`, `_workoutWord`) belong to the app's
 * lifecycle, so app.js still assigns them — pushing that in here would have
 * meant handing state back and forth for no gain.
 *
 * What this does buy is that the fiddly parts are now testable in isolation:
 * the band cap, the "saved for tomorrow" overflow message, pluralisation,
 * and every empty-queue path that should show a friendly note instead of
 * starting an empty session.
 */

import { progress } from './progress.js';
import { getReviewCapForProfile } from './reviewScheduler.js';
import { getDailyChallengeWords } from './dailyChallenge.js';
import { buildWordWorkout } from './wordWorkout.js';

/**
 * @typedef {object} QueuedSession
 * @property {boolean} ok            false when there is nothing to run
 * @property {string}  message       toast to show either way
 * @property {'info'|'success'} [tone]
 * @property {object[]} [words]      queued words (daily challenge, review)
 * @property {object[]} [rounds]     queued rounds (word workout)
 * @property {object}  [word]        the workout's target word
 */

/**
 * Today's Daily Challenge — a fixed, seeded five-word set so every child
 * gets the same words on the same day.
 * @returns {QueuedSession}
 */
export function buildDailyChallengeSession() {
  const words = getDailyChallengeWords();
  if (!words?.length) {
    return {
      ok: false,
      message: 'No challenge available today — try again tomorrow.',
      tone: 'info',
    };
  }
  return { ok: true, words, message: "Today's 5 words – go! ⚡", tone: 'info' };
}

/**
 * Review Lane — everything due today, capped to the child's band so a
 * missed week doesn't produce an eighty-word session.
 *
 * @param {object|null} profile  active profile, for the band cap
 * @returns {QueuedSession}
 */
export function buildReviewSession(profile) {
  const cap = getReviewCapForProfile(profile);
  const dueWords = progress.getReviewDueWords({ cap });
  const totalDue = progress.getReviewDueCount();

  if (!dueWords.length) {
    return { ok: false, message: 'All caught up! Come back tomorrow.', tone: 'info' };
  }

  // Say plainly that the rest is deferred, not lost — a child who sees
  // "12 due" and gets 10 should know the other two are safe.
  const overflow =
    totalDue > dueWords.length ? ` (${totalDue - dueWords.length} more saved for tomorrow)` : '';

  return {
    ok: true,
    words: dueWords,
    message: `Review Lane: ${dueWords.length} word${dueWords.length === 1 ? '' : 's'}${overflow} 🌟`,
    tone: 'info',
  };
}

/**
 * Word Workout — one word through several modes. With no word given it
 * takes the most-overdue Review Lane item, which is the natural target.
 *
 * @param {object|null} [word]
 * @returns {QueuedSession}
 */
export function buildWordWorkoutSession(word = null) {
  const target = word || progress.getReviewDueWords({ cap: 1 })[0] || null;

  if (!target) {
    return {
      ok: false,
      message: 'No words to work out — try Review Lane after some practice.',
      tone: 'info',
    };
  }

  const rounds = buildWordWorkout(target);
  if (!rounds.length) {
    return { ok: false, message: "That word doesn't have a workout ladder yet.", tone: 'info' };
  }

  return {
    ok: true,
    rounds,
    word: target,
    message: `Workout: “${target.word}” through ${rounds.length} modes 🎽`,
    tone: 'info',
  };
}

/**
 * What to say when a queued session finishes.
 *
 * @param {'dailyChallenge'|'review'|'wordWorkout'|'normal'} type
 * @param {{ bonusXp?: number, workoutWord?: string }} [ctx]
 * @returns {{ message: string, tone: 'info'|'success', celebrate: boolean, sfx: string|null }|null}
 */
export function completionFeedback(type, ctx = {}) {
  if (type === 'dailyChallenge') {
    const { bonusXp = 0 } = ctx;
    // Zero bonus means it was already claimed today — say so rather than
    // implying the session didn't count.
    return bonusXp > 0
      ? {
          message: `Daily Challenge done! +${bonusXp} bonus XP!`,
          tone: 'success',
          celebrate: true,
          sfx: 'levelUp',
        }
      : {
          message: 'Daily Challenge already claimed today!',
          tone: 'info',
          celebrate: false,
          sfx: null,
        };
  }

  if (type === 'review') {
    return {
      message: 'Review session complete! Great revision! 🔄',
      tone: 'success',
      celebrate: false,
      sfx: 'correct',
    };
  }

  if (type === 'wordWorkout') {
    const word = ctx.workoutWord || 'that word';
    return {
      message: `Workout done! You took “${word}” through every angle. 🎽`,
      tone: 'success',
      celebrate: false,
      sfx: 'correct',
    };
  }

  return null;
}
