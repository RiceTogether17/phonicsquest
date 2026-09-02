/**
 * writingTrackProgress.js
 *
 * Track-based progress storage for Writing Quest.
 *
 * DESIGN: Track progress is the primary source of truth for levels that
 * have defined tracks. Legacy `writingCompleted` (keyed by level number)
 * is maintained only as a backward-compat fallback layer for levels
 * that have no track definitions.
 */

import { store } from './store.js';

const TRACK_PROGRESS_KEY = 'writingTrackProgress';

export function getTrackProgressMap() {
  const map = store.get(TRACK_PROGRESS_KEY);
  return map && typeof map === 'object' ? map : {};
}

export function getTrackProgress(trackId) {
  const map = getTrackProgressMap();
  return map[trackId] || { completedLessons: 0, totalLessons: 0, completed: false };
}

export function setTrackProgress(trackId, completedLessons, totalLessons, level = null) {
  const map = getTrackProgressMap();
  const existing = map[trackId] || {};
  map[trackId] = {
    completedLessons: Math.max(completedLessons, existing.completedLessons || 0),
    totalLessons,
    completed: completedLessons >= totalLessons,
    level,
  };
  store.set(TRACK_PROGRESS_KEY, map);
  return map[trackId];
}

/**
 * Migrate legacy writingCompleted data into track-based progress.
 *
 * Only runs once per track — if the track already has progress data,
 * migration is skipped. Migrates to the first track in the list only
 * (legacy data had no track concept).
 *
 * @param {string[]} trackIds - track IDs for the level
 * @param {number} totalLessons - total lessons in the track
 * @param {number} level - the level being migrated
 * @returns {object} the updated progress map
 */
export function migrateLegacyWritingCompleted(trackIds = [], totalLessons = 0, level = 0) {
  const map = getTrackProgressMap();
  // Skip if any of the provided tracks already has progress
  if (trackIds.some((id) => map[id])) return map;

  const legacy = store.get('writingCompleted') || {};
  const legacyDone = Number(legacy[level] || 0);
  if (!legacyDone || trackIds.length === 0) return map;

  const firstTrack = trackIds[0];
  map[firstTrack] = {
    completedLessons: Math.min(legacyDone, totalLessons || legacyDone),
    totalLessons: totalLessons || legacyDone,
    completed: legacyDone >= (totalLessons || legacyDone),
    migratedFromLevel: level,
    level,
  };
  store.set(TRACK_PROGRESS_KEY, map);
  return map;
}

/**
 * Get combined progress across all tracks for a given level.
 * Used by the browser display to show accurate totals.
 */
export function getLevelTrackProgress(tracks) {
  let totalDone = 0;
  let totalLessons = 0;
  for (const track of tracks) {
    const progress = getTrackProgress(track.id);
    totalDone += progress.completedLessons || 0;
    totalLessons += track.lessonIds.length;
  }
  return { done: totalDone, total: totalLessons };
}

/**
 * Check if all tracks at a given level are complete.
 */
export function isLevelFullyComplete(tracks) {
  return tracks.every((t) => {
    const p = getTrackProgress(t.id);
    return p.completed;
  });
}
