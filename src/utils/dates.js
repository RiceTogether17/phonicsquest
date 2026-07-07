// @ts-check
/**
 * PhonicsQuest – day-key helpers.
 *
 * The codebase intentionally uses TWO day conventions, previously
 * re-implemented in five+ modules:
 *
 *  - LOCAL day keys for anything the child experiences as "today":
 *    daily-lesson rollover, AI call caps, home-tab freshness. These must
 *    roll at local midnight, not UTC midnight (a Singapore child's new
 *    day would otherwise start at 8am).
 *
 *  - UTC day keys for stored schedules and exports: SRS due dates,
 *    report filenames. Stable across timezone changes.
 *
 * Pick the one that matches the meaning; don't mix them for one value.
 */

/**
 * Local-midnight day key, YYYY-MM-DD.
 * @param {Date} [date]
 */
export function localYmd(date = new Date()) {
  const pad = (/** @type {number} */ n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * UTC day key, YYYY-MM-DD.
 * @param {Date} [date]
 */
export function utcYmd(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * UTC day key `days` from now (or from `from`).
 * @param {number} days
 * @param {Date} [from]
 */
export function utcYmdAddDays(days, from = new Date()) {
  const d = new Date(from);
  d.setUTCDate(d.getUTCDate() + days);
  return utcYmd(d);
}
