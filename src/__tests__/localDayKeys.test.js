/*
 * Audit 2026-09-19, Finding 23 — daily analytics mix local midnight with UTC
 * labels.
 *
 * `progressAnalytics._startOfDay` bucketed to local midnight and `_isoDay`
 * then ran `.toISOString()` on that timestamp, which converts to UTC. In
 * Singapore local midnight on the 21st is 16:00 UTC on the 20th, so a parent
 * reading "today" on the chart was reading yesterday.
 *
 * The same mistake was keying `weeklyXpLog` — a ledger whose own comment says
 * "one entry per calendar day" — by the UTC date, so a child playing before
 * 8am local was filed under the previous day.
 *
 * Acceptance: dates and buckets are correct under UTC, Asia/Singapore and a
 * negative-offset zone, including local-midnight and DST boundaries.
 *
 * These assertions are written to hold in ANY zone: they compare against the
 * host's own local calendar fields rather than hardcoded strings, so running
 * the file under `TZ=...` is a real check rather than a restatement.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  localDayKey,
  localDayKeyBefore,
  startOfLocalDay,
  startOfLocalDayBefore,
} from '../utils/localDay.js';
import { store } from '../modules/store.js';

/** The local calendar date of a timestamp, built independently of the module. */
function expectedKey(ts) {
  const d = new Date(ts);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

describe('local calendar day keys (audit finding 23)', () => {
  it('labels a moment with its local date, not its UTC one', () => {
    const t = new Date(2026, 8, 21, 0, 30, 0).getTime(); // 00:30 local
    expect(localDayKey(t)).toBe(expectedKey(t));
  });

  it('keeps 00:00 and 23:59 on the same local day', () => {
    // The two moments a UTC label splits apart, in opposite directions.
    const midnight = new Date(2026, 8, 21, 0, 0, 0).getTime();
    const lateEvening = new Date(2026, 8, 21, 23, 59, 0).getTime();

    expect(localDayKey(midnight)).toBe(localDayKey(lateEvening));
    expect(localDayKey(midnight)).toBe(expectedKey(midnight));
  });

  it('starts the day at local midnight', () => {
    const t = new Date(2026, 8, 21, 14, 37, 12).getTime();
    const start = new Date(startOfLocalDay(t));

    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getDate()).toBe(new Date(t).getDate());
  });

  it('steps back one calendar day at a time, not 24-hour blocks', () => {
    // Late March and late October cover the northern and southern DST changes.
    for (const [y, m, d] of [
      [2026, 2, 31],
      [2026, 9, 31],
      [2026, 0, 1], // year boundary
      [2026, 2, 1], // month boundary out of February
    ]) {
      const now = new Date(y, m, d, 12, 0, 0).getTime();
      const keys = [];
      for (let i = 9; i >= 0; i--) keys.push(localDayKeyBefore(now, i));

      expect(new Set(keys).size, `repeated a date near ${y}-${m + 1}-${d}`).toBe(10);

      for (let i = 1; i < keys.length; i++) {
        const gap = Math.round(
          (Date.parse(`${keys[i]}T00:00:00Z`) - Date.parse(`${keys[i - 1]}T00:00:00Z`)) / 86400000,
        );
        expect(gap, `${keys[i - 1]} → ${keys[i]}`).toBe(1);
      }
    }
  });

  it('gives startOfLocalDayBefore a real local midnight each step', () => {
    const now = new Date(2026, 2, 31, 12, 0, 0).getTime();
    for (let i = 0; i < 10; i++) {
      const d = new Date(startOfLocalDayBefore(now, i));
      expect(d.getHours(), `day -${i} is not local midnight`).toBe(0);
    }
  });
});

describe('the XP ledger is keyed the same way as the chart (audit finding 23)', () => {
  beforeEach(() => {
    store.reset();
  });

  it('files XP under the local day, so a 7am session is not yesterday', () => {
    store.addSessionXp(10);

    const log = store.get('weeklyXpLog');
    expect(log).toHaveLength(1);
    expect(log[0].date).toBe(localDayKey());
    expect(log[0].date).toBe(expectedKey(Date.now()));
  });

  it('accumulates a second session into the same local day', () => {
    store.addSessionXp(10);
    store.addSessionXp(5);

    const log = store.get('weeklyXpLog');
    expect(log).toHaveLength(1);
    expect(log[0].xp).toBe(15);
  });

  it('uses one key format everywhere it writes or compares a day', () => {
    // Two modules disagreeing about what day it is would be worse than either
    // being wrong alone, so the ledger, its cutoff and the chart share a helper.
    store.addSessionXp(1);
    const [entry] = store.get('weeklyXpLog');

    expect(entry.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(localDayKeyBefore(Date.now(), 0)).toBe(entry.date);
  });
});
