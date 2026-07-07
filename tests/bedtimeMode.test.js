import { describe, it, expect, beforeEach } from 'vitest';
import {
  isBedtimeWindow,
  isBedtimeActive,
  setBedtimeEnabled,
  applyBedtimeStateToDom,
  getBedtimeStatus,
  __TEST__,
} from '../src/modules/bedtimeMode.js';
import { store } from '../src/modules/store.js';
import { gamification } from '../src/modules/gamification.js';

const at = (h, m = 0) => new Date(2026, 4, 23, h, m, 0);

beforeEach(() => {
  localStorage.clear();
  document.body.className = '';
  document.documentElement.removeAttribute(__TEST__.HTML_ATTR);
  store.reset();
});

describe('isBedtimeWindow — 19:00–06:00 local-time gate', () => {
  it('is true at exactly 19:00', () => {
    expect(isBedtimeWindow(at(19))).toBe(true);
  });

  it('is true late at night', () => {
    expect(isBedtimeWindow(at(22, 30))).toBe(true);
  });

  it('wraps across midnight (00:30 is still bedtime)', () => {
    expect(isBedtimeWindow(at(0, 30))).toBe(true);
  });

  it('is true at 05:59 (last minute of the night)', () => {
    expect(isBedtimeWindow(at(5, 59))).toBe(true);
  });

  it('is false at 06:00 (morning starts)', () => {
    expect(isBedtimeWindow(at(6, 0))).toBe(false);
  });

  it('is false during the day (noon)', () => {
    expect(isBedtimeWindow(at(12))).toBe(false);
  });

  it('is false at 18:59 (one minute before bedtime)', () => {
    expect(isBedtimeWindow(at(18, 59))).toBe(false);
  });
});

describe('setBedtimeEnabled / isBedtimeActive — persistence', () => {
  it('starts inactive on a fresh profile', () => {
    expect(isBedtimeActive()).toBe(false);
  });

  it('persists the on flag across reads', () => {
    setBedtimeEnabled(true);
    expect(isBedtimeActive()).toBe(true);
  });

  it('persists the off flag (not just absence) so toggling reads cleanly', () => {
    setBedtimeEnabled(true);
    setBedtimeEnabled(false);
    expect(isBedtimeActive()).toBe(false);
    expect(localStorage.getItem(__TEST__.STORAGE_KEY)).toBe('0');
  });

  it('coerces truthy/falsy inputs to a clean boolean', () => {
    setBedtimeEnabled(1);
    expect(isBedtimeActive()).toBe(true);
    setBedtimeEnabled(0);
    expect(isBedtimeActive()).toBe(false);
  });
});

describe('applyBedtimeStateToDom — body class + html attribute', () => {
  it('adds .bedtime-on and data-bedtime when enabled', () => {
    applyBedtimeStateToDom(true);
    expect(document.body.classList.contains(__TEST__.BODY_CLASS)).toBe(true);
    expect(document.documentElement.getAttribute(__TEST__.HTML_ATTR)).toBe('on');
  });

  it('removes them when disabled', () => {
    applyBedtimeStateToDom(true);
    applyBedtimeStateToDom(false);
    expect(document.body.classList.contains(__TEST__.BODY_CLASS)).toBe(false);
    expect(document.documentElement.hasAttribute(__TEST__.HTML_ATTR)).toBe(false);
  });

  it('reads from localStorage when called with no argument', () => {
    setBedtimeEnabled(true);
    document.body.className = ''; // simulate fresh DOM (e.g. after reload)
    applyBedtimeStateToDom();
    expect(document.body.classList.contains(__TEST__.BODY_CLASS)).toBe(true);
  });
});

describe('getBedtimeStatus — combined snapshot', () => {
  it('flags suggested when in window but not active', () => {
    expect(getBedtimeStatus(at(20))).toEqual({ active: false, inWindow: true, suggested: true });
  });

  it('does not flag suggested once already active', () => {
    setBedtimeEnabled(true);
    expect(getBedtimeStatus(at(20))).toEqual({ active: true, inWindow: true, suggested: false });
  });

  it('does not flag suggested outside the window', () => {
    expect(getBedtimeStatus(at(12))).toEqual({ active: false, inWindow: false, suggested: false });
  });
});

describe('XP gate — gamification.awardXp short-circuits under bedtime', () => {
  it('returns zero-delta XP when bedtime is on', () => {
    store.set('xp', 50);
    setBedtimeEnabled(true);
    const result = gamification.awardXp(20, 'test');
    expect(result.newXP).toBe(50);
    expect(result.levelUp).toBe(false);
    expect(store.get('xp')).toBe(50);
  });

  it('awards XP normally when bedtime is off', () => {
    store.set('xp', 50);
    setBedtimeEnabled(false);
    const result = gamification.awardXp(20, 'test');
    expect(result.newXP).toBe(70);
    expect(store.get('xp')).toBe(70);
  });
});
