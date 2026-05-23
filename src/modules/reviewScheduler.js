/**
 * PhonicsQuest – Giri's Review Lane (Spaced Review Engine)
 *
 * Every word a child sees rides a 6-box Leitner ladder. The brain has just
 * enough time to forget a little before the next exposure — the most robust
 * lever in the evidence base for long-term retention.
 *
 * Boxes and intervals (days):
 *   0  Today      → 0
 *   1  +1 day     → 1
 *   2  +3 days    → 3
 *   3  +1 week    → 7
 *   4  +2 weeks   → 14
 *   5  +1 month   → 30
 *   6  Graduated  → 90 (one recall check, then stays put)
 *
 * Charter-safe rules (mistakes are safe):
 *   - Correct  → advance one box (cap at 6)
 *   - Wrong    → drop one box (floor 0). A graduated item only ever drops
 *                back to box 3 (+1 week) — momentum protection so a single
 *                slip doesn't undo a month of practice.
 *   - Never red, never reset-to-zero from the top. Demotion is a step, not
 *     a punishment.
 *
 * Pure functions — no store reads/writes inside. Caller owns persistence.
 */

export const INTERVAL_DAYS = Object.freeze([0, 1, 3, 7, 14, 30, 90]);
export const MAX_BOX = 6;
export const GRADUATED_BOX = 6;

const DAY_MS = 86_400_000;
const GRADUATED_FLOOR = 3; // wrong on graduated drops here (+1 week), never to 0

/** Per-band session cap. K1–P1 → 10, P2+ → 20. */
const BAND_CAPS = Object.freeze({ young: 10, older: 20 });

function dayMs(days) {
  return days * DAY_MS;
}

/**
 * Compute the new box/dueAt for a word after an attempt.
 * @param {object|undefined} stat   existing word stat (may be undefined for first attempt)
 * @param {boolean} correct
 * @param {number} [now]            ms epoch
 * @returns {{ box:number, dueAt:number, lastResult:'pass'|'demote', graduatedAt:number|null }}
 */
export function scheduleAttempt(stat, correct, now = Date.now()) {
  const prev = stat || {};
  const prevBox = typeof prev.box === 'number' ? prev.box : 0;
  const wasGraduated = prevBox >= GRADUATED_BOX;

  let box;
  if (correct) {
    box = Math.min(prevBox + 1, MAX_BOX);
  } else {
    box = wasGraduated ? GRADUATED_FLOOR : Math.max(0, prevBox - 1);
  }

  const dueAt = now + dayMs(INTERVAL_DAYS[box]);
  const graduatedAt = box >= GRADUATED_BOX
    ? (prev.graduatedAt || now)
    : null;

  return {
    box,
    dueAt,
    lastResult: correct ? 'pass' : 'demote',
    graduatedAt,
  };
}

/**
 * Seed box/dueAt for a stat that pre-dates the engine, so existing learners
 * don't lose ground on upgrade. Idempotent: returns the existing box if set.
 * @param {object|undefined} stat
 * @param {number} [now]
 * @returns {{ box:number, dueAt:number }}
 */
export function seedFromLegacy(stat, now = Date.now()) {
  if (!stat) return { box: 0, dueAt: now };
  if (typeof stat.box === 'number') {
    return { box: stat.box, dueAt: typeof stat.dueAt === 'number' ? stat.dueAt : now };
  }

  const attempts = stat.attempts || 0;
  const correct  = stat.correct  || 0;
  const accuracy = attempts > 0 ? correct / attempts : 0;

  let box;
  if (attempts === 0)        box = 0;
  else if (accuracy < 0.5)   box = 0;
  else if (accuracy < 0.8)   box = 1;
  else if (accuracy < 0.95)  box = 3;
  else if (attempts >= 5)    box = 5;
  else                       box = 3;

  return { box, dueAt: now + dayMs(INTERVAL_DAYS[box]) };
}

/**
 * Maturity indicator for a word.
 * @param {object|undefined} stat
 * @returns {{ dots:number, graduated:boolean }}
 */
export function getMaturity(stat) {
  if (!stat) return { dots: 0, graduated: false };
  const box = typeof stat.box === 'number' ? stat.box : 0;
  if (box >= GRADUATED_BOX) return { dots: 5, graduated: true };
  return { dots: Math.min(5, Math.max(0, box)), graduated: false };
}

/**
 * Is the item due at `now`? Falls back to the legacy `nextReviewDate` for
 * stats that haven't been re-touched since the engine shipped.
 */
export function isDue(stat, now = Date.now()) {
  if (!stat) return false;
  let dueAt = typeof stat.dueAt === 'number' ? stat.dueAt : null;
  if (dueAt === null && stat.nextReviewDate) {
    const t = new Date(stat.nextReviewDate).getTime();
    dueAt = Number.isFinite(t) ? t : null;
  }
  if (dueAt === null) return false;
  return now >= dueAt;
}

/**
 * Return up to `cap` due items, oldest-overdue first.
 * @param {Record<string, object>} wordStats
 * @param {Iterable<{id:string}>} items
 * @param {{ cap?:number, now?:number }} [opts]
 * @returns {Array<{id:string, item:object, stat:object}>}
 */
export function getDueItems(wordStats, items, opts = {}) {
  const { cap = Infinity, now = Date.now() } = opts;
  const due = [];
  for (const item of items) {
    const stat = wordStats[item.id];
    if (!isDue(stat, now)) continue;
    const dueAt = typeof stat.dueAt === 'number'
      ? stat.dueAt
      : new Date(stat.nextReviewDate).getTime();
    due.push({ item, stat, dueAt });
  }
  due.sort((a, b) => a.dueAt - b.dueAt);
  return due.slice(0, cap).map(d => ({ id: d.item.id, item: d.item, stat: d.stat }));
}

/** Total due (no cap) — for the home-screen tile. */
export function countDueItems(wordStats, items, now = Date.now()) {
  let n = 0;
  for (const item of items) {
    if (isDue(wordStats[item.id], now)) n++;
  }
  return n;
}

/**
 * Items at box 5 whose dueAt falls within `withinDays` — they're one
 * correct answer away from graduating.
 */
export function getGraduatingSoon(wordStats, items, withinDays = 7, now = Date.now()) {
  const horizon = now + dayMs(withinDays);
  const out = [];
  for (const item of items) {
    const stat = wordStats[item.id];
    if (!stat) continue;
    const box = typeof stat.box === 'number' ? stat.box : null;
    if (box !== 5) continue;
    const dueAt = typeof stat.dueAt === 'number' ? stat.dueAt : null;
    if (dueAt !== null && dueAt <= horizon) {
      out.push({ id: item.id, item });
    }
  }
  return out;
}

/**
 * Items demoted in the last `withinDays`. Used in parent dashboard.
 */
export function getSlippingRecently(wordStats, items, withinDays = 7, now = Date.now()) {
  const since = now - dayMs(withinDays);
  const out = [];
  for (const item of items) {
    const stat = wordStats[item.id];
    if (!stat || stat.lastResult !== 'demote') continue;
    const lastSeen = stat.lastSeen ? new Date(stat.lastSeen).getTime() : 0;
    if (lastSeen >= since) {
      out.push({ id: item.id, item });
    }
  }
  return out;
}

/**
 * Per-profile session cap. Younger readers see a softer pile so they don't
 * drown after a missed week; P2+ profiles handle the standard 20.
 * @param {{ schoolLevel?:string, primaryGrade?:string, readingBand?:string }|null} profile
 */
export function getReviewCapForProfile(profile) {
  if (!profile) return BAND_CAPS.young;
  const grade = profile.primaryGrade || '';
  if (/^P[2-6]$/i.test(grade)) return BAND_CAPS.older;
  if (/^P1$/i.test(grade))     return BAND_CAPS.young;
  const level = profile.schoolLevel || '';
  if (/(p2|p3|p4|p5|p6)/i.test(level))   return BAND_CAPS.older;
  return BAND_CAPS.young;
}

/**
 * Estimate session minutes — 35s/item median, rounded up to whole minutes,
 * min 1 when non-empty.
 */
export function estimateMinutes(count, secondsPerItem = 35) {
  if (count <= 0) return 0;
  return Math.max(1, Math.round((count * secondsPerItem) / 60));
}

export const __TEST__ = { BAND_CAPS, DAY_MS, GRADUATED_FLOOR };
