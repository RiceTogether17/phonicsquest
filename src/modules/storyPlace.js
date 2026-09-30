/**
 * PhonicsQuest — where the child stopped reading.
 *
 * A Band D story runs to 181 words. Nothing saved the reading position, so a
 * child who closed the tab, took a phone call or had the tablet taken off
 * them came back to the top and read the first third again — which is the
 * fastest way to teach a beginning reader that finishing is not the point.
 *
 * Stored per profile (siblings share a device) and per story, as a word
 * index into the story's `.wf-word` spans. A word index rather than a scroll
 * offset, because the offset is meaningless once the text size, the screen
 * width or the device changes, and all three do.
 *
 * A finished story has no place: it starts at the beginning next time, which
 * is what re-reading for fluency wants.
 */

import { getProfileScopedKey } from './profiles.js';

const BASE_KEY = 'giri_story_place';

/** Stories to remember at once. Beyond this the oldest are dropped. */
export const MAX_PLACES = 40;

/** A place older than this is stale — the child has moved on. */
export const PLACE_TTL_DAYS = 30;

/**
 * Below this, "where you stopped" is the beginning and the welcome-back
 * banner is noise. Roughly the first line of a Band A mini.
 */
export const MIN_WORTH_SAVING = 8;

const key = () => getProfileScopedKey(BASE_KEY);

/** @returns {Record<string, {word:number, at:number}>} */
function readAll() {
  try {
    const raw = localStorage.getItem(key());
    const map = raw ? JSON.parse(raw) : {};
    return map && typeof map === 'object' && !Array.isArray(map) ? map : {};
  } catch {
    return {};
  }
}

function writeAll(map) {
  try {
    localStorage.setItem(key(), JSON.stringify(map));
  } catch {
    /* private mode, quota — losing a bookmark is not worth throwing over */
  }
}

/**
 * Drop stale and surplus entries. Oldest first, so the story being read now
 * is the last thing that could ever be evicted.
 * @param {Record<string, {word:number, at:number}>} map
 * @param {number} now
 */
export function prune(map, now = Date.now()) {
  const cutoff = now - PLACE_TTL_DAYS * 24 * 60 * 60 * 1000;
  const live = Object.entries(map).filter(
    ([, v]) => v && typeof v.word === 'number' && typeof v.at === 'number' && v.at >= cutoff,
  );
  live.sort((a, b) => b[1].at - a[1].at);
  return Object.fromEntries(live.slice(0, MAX_PLACES));
}

/**
 * Remember where the child is in a story.
 * @param {string} storyId
 * @param {number} word index into the story's words
 * @param {number} [now]
 */
export function savePlace(storyId, word, now = Date.now()) {
  if (!storyId || typeof word !== 'number' || !Number.isFinite(word)) return;
  const map = readAll();
  if (word < MIN_WORTH_SAVING) {
    // Back at the top: forget rather than store "you stopped at word 2",
    // which would greet a child with a welcome-back banner for no reason.
    if (!(storyId in map)) return;
    delete map[storyId];
    writeAll(map);
    return;
  }
  map[storyId] = { word: Math.max(0, Math.round(word)), at: now };
  writeAll(prune(map, now));
}

/**
 * Where the child stopped, or null.
 * @param {string} storyId
 * @returns {number|null}
 */
export function getPlace(storyId) {
  const entry = readAll()[storyId];
  return entry && typeof entry.word === 'number' && entry.word >= MIN_WORTH_SAVING
    ? entry.word
    : null;
}

/** Forget a story's place — it was finished, or the child asked to restart. */
export function clearPlace(storyId) {
  const map = readAll();
  if (!(storyId in map)) return;
  delete map[storyId];
  writeAll(map);
}

/** Every story with a place, newest first. For "carry on reading". */
export function placesInOrder() {
  return Object.entries(readAll())
    .filter(([, v]) => v && typeof v.at === 'number')
    .sort((a, b) => b[1].at - a[1].at)
    .map(([storyId, v]) => ({ storyId, word: v.word, at: v.at }));
}
