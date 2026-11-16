/**
 * Sound confusions: which two sounds a child keeps mixing up.
 *
 * The phonics games already tell the child "you heard /e/, but the middle
 * sound is /a/". This keeps a small tally of those pairs so the adult can
 * see the pattern afterwards: a child who swaps /e/ and /i/ six times in a
 * week needs that pair taught, not more mixed practice.
 *
 * The log is bounded: one entry per pair of sounds, not per answer.
 */

import { store } from './store.js';

const KEY = 'soundConfusions';
const MAX_WORDS = 4;
const DAY_MS = 24 * 60 * 60 * 1000;

function _read() {
  const log = store.get(KEY);
  return log && typeof log === 'object' ? log : {};
}

/** One key for a pair whichever way round it was confused. */
function _pairKey(a, b) {
  return [a, b].sort().join(' ');
}

/**
 * Record one mix-up.
 * @param {{ target: string, chosen: string, word?: string }} slip
 *   sounds in slash notation, e.g. { target: '/a/', chosen: '/e/', word: 'bad' }
 */
export function recordSoundConfusion(slip) {
  const { target, chosen, word = '' } = slip || {};
  if (!target || !chosen || target === chosen) return;
  const log = { ..._read() };
  const key = _pairKey(target, chosen);
  const prev = log[key] && typeof log[key] === 'object' ? log[key] : null;
  const words = [word, ...(prev?.words ?? []).filter((w) => w !== word)]
    .filter(Boolean)
    .slice(0, MAX_WORDS);
  log[key] = {
    sounds: [target, chosen].sort(),
    count: (prev?.count ?? 0) + 1,
    words,
    lastSeen: new Date().toISOString(),
  };
  store.set(KEY, log);
}

/**
 * Pairs mixed up at least `min` times and seen within `days`, most often first.
 * @param {{ days?: number, min?: number, now?: number }} [opts]
 * @returns {Array<{ sounds: string[], count: number, words: string[], lastSeen: string }>}
 */
export function getSoundConfusions({ days = 14, min = 2, now = Date.now() } = {}) {
  return Object.values(_read())
    .filter(
      (e) =>
        e &&
        Array.isArray(e.sounds) &&
        (e.count || 0) >= min &&
        now - Date.parse(e.lastSeen) <= days * DAY_MS,
    )
    .sort((a, b) => b.count - a.count);
}
