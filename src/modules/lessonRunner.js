/**
 * PhonicsQuest – Today's Lesson Runner
 *
 * Session state for the guided "Today's Lesson with Giri" flow composed
 * by lessonComposer.js. Holds the small amount of state the live signals
 * can't derive:
 *
 *   • whether the teach step has been completed today
 *   • whether the completion bonus has been awarded
 *   • a capped history of completed lessons (for the parent report)
 *
 * Step completion for warm-up / practice / review steps is always read
 * live from the underlying systems via composeTodaysLesson(), so ticks
 * update the moment the child finishes the real task — same design as
 * missionToday / todaysPlan.
 */

import { store } from './store.js';
import { gamification } from './gamification.js';
import { composeTodaysLesson } from './lessonComposer.js';
import { localYmd } from '../utils/dates.js';

const STATE_KEY = 'currentLesson';
const HISTORY_KEY = 'lessonHistory';
const HISTORY_CAP = 30;

/** Bonus XP for finishing the whole guided lesson (on top of per-step XP). */
export const LESSON_BONUS_XP = 40;

const _ymd = (date) => localYmd(date);

/** Load (or roll over) today's lesson state. */
export function getLessonState(now = new Date()) {
  const today = _ymd(now);
  const stored = store.get(STATE_KEY);
  if (stored && stored.date === today) return stored;

  const fresh = {
    date: today,
    startedAt: null,
    teachDone: false,
    completedAt: null,
    bonusAwarded: false,
  };
  store.set(STATE_KEY, fresh);
  return fresh;
}

function _patchState(patch, now = new Date()) {
  const state = getLessonState(now);
  const next = { ...state, ...patch };
  store.set(STATE_KEY, next);
  return next;
}

/**
 * Today's lesson with live completion, ready to render.
 * @param {Date} [now]
 * @returns {{ band: string, steps: object[], done: number, total: number,
 *             complete: boolean, started: boolean, nextStep: object|null }}
 */
export function getTodaysLessonView(now = new Date()) {
  const state = getLessonState(now);
  const { band, steps } = composeTodaysLesson(now);

  const merged = steps.map((step) => {
    if (step.kind !== 'teach') return step;
    return {
      ...step,
      done: state.teachDone,
      progressLabel: state.teachDone ? '✓' : 'Start',
    };
  });

  const done = merged.filter((s) => s.done).length;
  const total = merged.length;
  return {
    band,
    steps: merged,
    done,
    total,
    complete: total > 0 && done === total,
    started: !!state.startedAt,
    nextStep: merged.find((s) => !s.done) || null,
  };
}

/** Record that the child opened the lesson today (for resume copy). */
export function markLessonStarted(now = new Date()) {
  const state = getLessonState(now);
  if (state.startedAt) return state;
  return _patchState({ startedAt: new Date().toISOString() }, now);
}

/** Record the teach step as completed today. */
export function markTeachDone(now = new Date()) {
  return _patchState({ teachDone: true }, now);
}

/**
 * If every step is done and the bonus hasn't been paid yet, award it,
 * stamp completion, and append to lessonHistory.
 * @returns {{ bonus: number }|null}  the award, or null if nothing happened
 */
export function finalizeLessonIfComplete(now = new Date()) {
  const view = getTodaysLessonView(now);
  const state = getLessonState(now);
  if (!view.complete || state.bonusAwarded) return null;

  _patchState({ completedAt: new Date().toISOString(), bonusAwarded: true }, now);

  const history = [
    { date: state.date, band: view.band, steps: view.total, completedAt: new Date().toISOString() },
    ...(store.get(HISTORY_KEY) || []),
  ].slice(0, HISTORY_CAP);
  store.set(HISTORY_KEY, history);

  gamification.awardXp(LESSON_BONUS_XP, 'todays_lesson_complete');
  return { bonus: LESSON_BONUS_XP };
}

/** Completed-lesson history (newest first, capped). */
export function getLessonHistory() {
  return store.get(HISTORY_KEY) || [];
}
