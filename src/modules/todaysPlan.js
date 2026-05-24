/**
 * PhonicsQuest – Today's Plan (Early Reading)
 *
 * The Duolingo Daily Quests pattern, adapted for K1–P1 phonics profiles.
 * A 3-step daily card with live completion that surfaces:
 *
 *   ① 🌟 Giri's Review Lane     — clear what's due (or "all caught up")
 *   ② ⚡ Daily Challenge         — the 5-word seeded set, +50 XP
 *   ③ 🎯 Today's Warm-up         — one targeted blend session at the child's
 *                                  weakest phonics group
 *
 * Completion is derived from existing signals — no new event plumbing —
 * so step ticks update the moment the child completes the underlying task:
 *
 *   • Review Lane: due-count === 0 (queue empty)
 *   • Daily Challenge: isDailyChallengeComplete()
 *   • Warm-up: sessionWordsToday.length >= WARMUP_TARGET (3 unique words today)
 *
 * Primary (P1–P6) profiles continue to use the richer 5-step
 * `missionToday.js` — Today's Plan only renders for early-reading bands.
 */

import { store } from './store.js';
import { progress } from './progress.js';
import { isDailyChallengeComplete, DAILY_BONUS_XP } from './dailyChallenge.js';
import { estimateMinutes } from './reviewScheduler.js';
import { getRecommendation, getDailyPlan } from './recommendations.js';

/** Number of unique words the child needs to play today to complete the warm-up. */
export const WARMUP_TARGET = 3;

/**
 * Build today's 3-step plan for an early-reading profile.
 * Returns the steps + summary so the home screen can render a header
 * ("2/3 done — almost there!") and dispatch each tap.
 *
 * @returns {{
 *   steps: Array<{ id:string, num:number, icon:string, title:string, detail:string,
 *                  target:string, group?:string, done:boolean, progressLabel:string }>,
 *   done: number,
 *   total: number,
 *   complete: boolean,
 *   allCaughtUp: boolean,
 * }}
 */
export function getEarlyReadingPlan() {
  const dueCount = progress.getReviewDueCount();
  const dailyDone = isDailyChallengeComplete();
  const sessionWordsToday = (store.get('sessionWordsToday') || []).length;

  // Step 1 — Giri's Review Lane
  const reviewDone = dueCount === 0;
  const reviewMins = estimateMinutes(dueCount);
  const reviewStep = {
    id: 'review',
    num: 1,
    icon: '🌟',
    title: "Giri's Review Lane",
    detail: dueCount > 0
      ? `${dueCount} word${dueCount === 1 ? '' : 's'} due · about ${reviewMins} min`
      : 'All caught up — nice work!',
    target: 'review',
    done: reviewDone,
    progressLabel: reviewDone ? '✓' : 'Start',
  };

  // Step 2 — Daily Challenge
  const dailyStep = {
    id: 'daily',
    num: 2,
    icon: '⚡',
    title: 'Daily Challenge',
    detail: dailyDone
      ? `Done — +${DAILY_BONUS_XP} bonus XP earned`
      : `5 words · earn ${DAILY_BONUS_XP} bonus XP`,
    target: 'daily-challenge',
    done: dailyDone,
    progressLabel: dailyDone ? '✓' : 'Start',
  };

  // Step 3 — Today's Warm-up: reuse the existing weak-skill picker so the
  // child gets the same target the home roadmap would have suggested.
  const warmup = _pickWarmup();
  const warmupCount = Math.min(sessionWordsToday, WARMUP_TARGET);
  const warmupDone = warmupCount >= WARMUP_TARGET;
  const warmupStep = {
    id: 'warmup',
    num: 3,
    icon: warmup.icon || '🎯',
    title: warmup.title,
    detail: warmupDone
      ? `${WARMUP_TARGET} of ${WARMUP_TARGET} done today`
      : warmup.detail,
    target: warmup.target,
    group: warmup.group || undefined,
    done: warmupDone,
    progressLabel: warmupDone ? '✓' : `${warmupCount}/${WARMUP_TARGET}`,
  };

  const steps = [reviewStep, dailyStep, warmupStep];
  const done = steps.filter(s => s.done).length;
  // "All caught up" — the entire plan is complete AND there was nothing
  // urgent to review (queue was empty from the start). Drives the cheerful
  // empty-state copy on the home card.
  const allCaughtUp = done === steps.length && dueCount === 0;

  return {
    steps,
    done,
    total: steps.length,
    complete: done === steps.length,
    allCaughtUp,
  };
}

/**
 * Pick a one-tap warm-up. Prefers the existing recommendations engine so
 * the suggestion matches what the home roadmap already surfaces (e.g.
 * weakest phonics group for emerging decoders).
 * @private
 */
function _pickWarmup() {
  // Daily plan's first step is the most targeted recommendation; fall back
  // to the headline recommendation if for some reason getDailyPlan returns
  // an empty list.
  let pick = null;
  try {
    const plan = getDailyPlan();
    pick = Array.isArray(plan) && plan.length > 0 ? plan[0] : null;
  } catch (_) {
    pick = null;
  }
  if (!pick) {
    try {
      const rec = getRecommendation();
      pick = rec ? { label: rec.title, detail: rec.reason, ctaTarget: rec.ctaTarget, ctaGroup: rec.ctaGroup } : null;
    } catch (_) {
      pick = null;
    }
  }
  if (!pick) {
    return {
      title: 'Quick warm-up',
      detail: 'Play 3 quick rounds of any phonics activity.',
      icon: '🎯',
      target: 'blend',
      group: null,
    };
  }

  return {
    title: pick.label || 'Quick warm-up',
    detail: pick.detail || `Play ${WARMUP_TARGET} quick rounds.`,
    icon: '🎯',
    target: pick.ctaTarget || 'blend',
    group: pick.ctaGroup || null,
  };
}

export const __TEST__ = { _pickWarmup };
