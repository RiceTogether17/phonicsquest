/**
 * PhonicsQuest – Local calendar day keys.
 *
 * Audit 2026-09-19, finding 23. Two places built a "calendar day" key by
 * taking a local moment and running `.toISOString()` on it, which converts to
 * UTC:
 *
 *   - `progressAnalytics._isoDay` bucketed to local midnight and then labelled
 *     the bucket with the UTC date. East of Greenwich that is the previous
 *     day, so "today" on a parent's chart was yesterday.
 *   - `store.addSessionXp` keyed `weeklyXpLog` — commented "one entry per
 *     calendar day" — by the UTC date. In Singapore a child playing before
 *     8am local is filed under the previous day, so one local day splits
 *     across two entries and the week's XP is attributed to the wrong days.
 *
 * The convention for anything a learner or parent reads is **local**: a
 * child's "today" is the day they actually practised. This module is the one
 * place that produces those keys, so the surfaces cannot drift apart again —
 * two modules disagreeing about what day it is would be worse than either
 * being wrong alone.
 *
 * Durations are a separate matter and are not this module's business. A
 * rolling "last 30 days" cutoff is a length of time, and subtracting
 * 30 × 24h for it is correct. What must not use fixed 24-hour blocks is
 * stepping between calendar dates, because a local day is 23 or 25 hours
 * across a daylight-saving boundary — see `startOfDayBefore`.
 */

/** Local midnight for the day containing `ts`, as a timestamp. */
export function startOfLocalDay(ts = Date.now()) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * `YYYY-MM-DD` for the LOCAL calendar date of `ts`.
 *
 * Built from local calendar fields rather than `.toISOString()`, which is the
 * whole point: the string names the day the child was actually looking at.
 *
 * @param {number|Date} [ts]
 * @returns {string}
 */
export function localDayKey(ts = Date.now()) {
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Local midnight `n` calendar days before `ts`.
 *
 * Calendar arithmetic, not `ts - n * 86400000`. Across a daylight-saving
 * boundary a local day is 23 or 25 hours, so subtracting fixed blocks skips a
 * date or repeats one. `setDate` also handles month and year ends.
 *
 * @param {number|Date} ts
 * @param {number} n
 * @returns {number}
 */
export function startOfLocalDayBefore(ts, n) {
  const d = new Date(startOfLocalDay(ts));
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/**
 * `YYYY-MM-DD` for the local calendar date `n` days before `ts`.
 * Suitable as an inclusive lower bound when filtering day-keyed records.
 */
export function localDayKeyBefore(ts, n) {
  return localDayKey(startOfLocalDayBefore(ts, n));
}
