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
  map[trackId] = {
    completedLessons,
    totalLessons,
    completed: completedLessons >= totalLessons,
    level,
  };
  store.set(TRACK_PROGRESS_KEY, map);
  return map[trackId];
}

export function migrateLegacyWritingCompleted(trackIds = [], totalLessons = 0, level = 0) {
  const map = getTrackProgressMap();
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
