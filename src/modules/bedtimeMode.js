/**
 * PhonicsQuest – Bedtime Mode (C4)
 *
 * The charter rule the rest of the app fights for: "not every minute
 * needs XP." When a child opens the app late in the evening, Bedtime
 * Mode trades the noisy reward loop for a calmer one — dimmed colours,
 * suppressed celebrations, no XP — so the same five minutes of reading
 * can be a wind-down activity rather than a hype loop before lights-out.
 *
 * Two pieces:
 *   • A localStorage-backed on/off flag (parent / teacher choice).
 *   • A time-window helper so the toggle in the header can suggest itself
 *     after 19:00 device-local time.
 *
 * Pure helpers — DOM application happens in the app shell. Easy to test
 * with `vi.useFakeTimers()`.
 *
 * Charter-safe: never auto-enables itself, never punishes the child for
 * playing late. The window suggestion is a UI label, not a gate.
 */

const STORAGE_KEY = 'pq_bedtime_enabled';
const BODY_CLASS = 'bedtime-on';
const HTML_ATTR = 'data-bedtime';

/** Bedtime starts at 19:00 (7 pm) and runs until 06:00 the next morning. */
const BEDTIME_START_HOUR = 19;
const BEDTIME_END_HOUR = 6;

/**
 * Is the given Date inside the bedtime window? Wraps across midnight.
 * @param {Date} [now]
 * @returns {boolean}
 */
export function isBedtimeWindow(now = new Date()) {
  const hour = now.getHours();
  return hour >= BEDTIME_START_HOUR || hour < BEDTIME_END_HOUR;
}

/**
 * Read the persisted flag without touching the DOM.
 * @returns {boolean}
 */
export function isBedtimeActive() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch (_) {
    return false;
  }
}

/**
 * Toggle bedtime on/off. Persists the flag and applies (or removes) the
 * `bedtime-on` class on `<body>` plus `data-bedtime` on `<html>` so CSS
 * can scope both element-level and root-level overrides cleanly.
 *
 * @param {boolean} enabled
 */
export function setBedtimeEnabled(enabled) {
  const value = !!enabled;
  try {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
  } catch (_) {
    /* ignore */
  }
  applyBedtimeStateToDom(value);
}

/**
 * Mirror the persisted flag onto the DOM. Called on app init and after
 * every toggle so a page reload picks up the right body class.
 * @param {boolean} [enabled]
 */
export function applyBedtimeStateToDom(enabled = isBedtimeActive()) {
  if (typeof document === 'undefined') return;
  const value = !!enabled;
  document.body?.classList.toggle(BODY_CLASS, value);
  if (document.documentElement) {
    if (value) document.documentElement.setAttribute(HTML_ATTR, 'on');
    else document.documentElement.removeAttribute(HTML_ATTR);
  }
}

/**
 * Compact status snapshot used by the header toggle and the XP gate.
 *   active    — bedtime is currently turned on
 *   inWindow  — device-local time is between 19:00 and 06:00
 *   suggested — inWindow AND !active (UI cue to surface the toggle)
 *
 * @param {Date} [now]
 * @returns {{ active: boolean, inWindow: boolean, suggested: boolean }}
 */
export function getBedtimeStatus(now = new Date()) {
  const active = isBedtimeActive();
  const inWindow = isBedtimeWindow(now);
  return { active, inWindow, suggested: inWindow && !active };
}

export const __TEST__ = {
  STORAGE_KEY,
  BODY_CLASS,
  HTML_ATTR,
  BEDTIME_START_HOUR,
  BEDTIME_END_HOUR,
};
