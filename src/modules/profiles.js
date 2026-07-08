/**
 * PhonicsQuest – Multi-Profile Manager
 *
 * Profiles allow multiple children to have separate progress.
 * Each profile's game data is stored under its own localStorage key.
 * App settings (theme, audio, parentPin) remain global.
 */

import { store } from './store.js';

const PROFILES_META_KEY = 'phonicsquest_profiles';
const ACTIVE_PROFILE_KEY = 'phonicsquest_active_profile';
const PROFILE_STORAGE_KEY = (id) => `phonicsquest_profile_${id}`;
const LEGACY_STORAGE_KEY = 'phonicsquest_v2';
const LEGACY_MIGRATION_FLAG = 'phonicsquest_legacy_migrated_to_profiles';

/** Default avatars for new profiles */
const AVATAR_OPTIONS = ['🦁', '🐯', '🐻', '🦊', '🐼', '🐨', '🦋', '🐸', '🐬', '🦄', '🐧', '🐙'];
const COLOR_OPTIONS  = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#ec4899', '#8b5cf6', '#14b8a6'];

// ── Public API ─────────────────────────────────────────────────────────────


function _hasProgressData(state) {
  if (!state || typeof state !== 'object') return false;
  if ((state.xp || 0) > 0) return true;
  if ((state.level || 1) > 1) return true;
  if ((state.dailyDone || 0) > 0) return true;
  if (Object.keys(state.wordStats || {}).length > 0) return true;
  if ((state.wordHistory || []).length > 0) return true;
  return false;
}

function _maybeMigrateLegacyProgressToProfile(id) {
  try {
    const profiles = getProfiles();
    const isOnlyProfile = profiles.length === 1 && profiles[0]?.id === id;
    if (!isOnlyProfile) return;

    if (localStorage.getItem(LEGACY_MIGRATION_FLAG) === '1') return;

    const profileKey = PROFILE_STORAGE_KEY(id);
    if (localStorage.getItem(profileKey)) return;

    const rawLegacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!rawLegacy) {
      localStorage.setItem(LEGACY_MIGRATION_FLAG, '1');
      return;
    }

    const legacyState = JSON.parse(rawLegacy);
    if (!_hasProgressData(legacyState)) {
      localStorage.setItem(LEGACY_MIGRATION_FLAG, '1');
      return;
    }

    localStorage.setItem(profileKey, JSON.stringify(legacyState));
    localStorage.setItem(LEGACY_MIGRATION_FLAG, '1');
  } catch (_) {}
}

/** Return all profiles, or [] if none. */
export function getProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_META_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

/** Save (overwrite) the profiles list. */
function _saveProfiles(profiles) {
  try {
    localStorage.setItem(PROFILES_META_KEY, JSON.stringify(profiles));
  } catch (_) {}
}

const VALID_PRIMARY_GRADES = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];
const VALID_READING_BANDS = ['pre-reader', 'emerging-decoder', 'developing-reader', 'reader'];

function _normalisePrimaryGrade(grade) {
  if (!grade) return null;
  const upper = String(grade).toUpperCase().trim();
  return VALID_PRIMARY_GRADES.includes(upper) ? upper : null;
}

function _normaliseReadingBand(band) {
  if (!band) return null;
  return VALID_READING_BANDS.includes(band) ? band : null;
}

/** Create a new profile and return it. */
export function createProfile(name, avatar, color, schoolLevel = 'preschool', opts = {}) {
  const id = 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  const normalisedGrade = _normalisePrimaryGrade(opts.primaryGrade);
  const normalisedBand = _normaliseReadingBand(opts.readingBand);
  // If a primaryGrade is provided we treat the profile as primary, even when
  // the caller forgot to pass schoolLevel='primary'.
  const resolvedSchoolLevel = (schoolLevel === 'primary' || normalisedGrade) ? 'primary' : 'preschool';
  const profile = {
    id,
    name: name || 'Player',
    avatar: avatar || AVATAR_OPTIONS[0],
    color:  color  || COLOR_OPTIONS[0],
    // 'primary' bypasses phonics-mastery unlock gates for Sentence Forge,
    // Cloze Castle and Word Vault for legacy profiles. New placement now
    // routes by reading band, but schoolLevel is still kept as metadata.
    schoolLevel: resolvedSchoolLevel,
    // For primary profiles: 'P1'–'P6'. Null means not yet set.
    primaryGrade: resolvedSchoolLevel === 'primary' ? normalisedGrade : null,
    readingBand: normalisedBand,
    createdAt: new Date().toISOString(),
  };
  const profiles = getProfiles();
  profiles.push(profile);
  _saveProfiles(profiles);
  return profile;
}

/**
 * Update an existing profile in-place. Used by the dashboard / settings
 * to fix a stale primaryGrade or readingBand without having to re-create
 * the profile. Returns the updated profile, or null if the id is unknown.
 */
export function updateProfile(id, patch = {}) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === id);
  if (idx < 0) return null;
  const existing = profiles[idx];
  const next = { ...existing };
  if ('name' in patch && typeof patch.name === 'string' && patch.name.trim()) next.name = patch.name.trim();
  if ('avatar' in patch && patch.avatar) next.avatar = patch.avatar;
  if ('color' in patch && patch.color) next.color = patch.color;
  if ('schoolLevel' in patch) {
    next.schoolLevel = patch.schoolLevel === 'primary' ? 'primary' : 'preschool';
  }
  if ('primaryGrade' in patch) {
    const g = _normalisePrimaryGrade(patch.primaryGrade);
    next.primaryGrade = g;
    if (g && next.schoolLevel !== 'primary') next.schoolLevel = 'primary';
  }
  if ('readingBand' in patch) {
    next.readingBand = _normaliseReadingBand(patch.readingBand);
  }
  profiles[idx] = next;
  _saveProfiles(profiles);
  return next;
}

/** Delete a profile and its progress data. */
export function deleteProfile(id) {
  const profiles = getProfiles().filter(p => p.id !== id);
  _saveProfiles(profiles);
  try { localStorage.removeItem(PROFILE_STORAGE_KEY(id)); } catch (_) {}
  if (getActiveProfileId() === id) {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
  // Clean up every per-profile scoped key registered above so a deleted
  // profile leaves no residue (charter: adult-facing surfaces are calm).
  _cleanupProfileScopedKeys(id);
}

/** Get the ID of the currently active profile (or null). */
export function getActiveProfileId() {
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || null;
}

/** Get the currently active profile object (or null). */
export function getActiveProfile() {
  const id = getActiveProfileId();
  if (!id) return null;
  return getProfiles().find(p => p.id === id) ?? null;
}

/**
 * Append the active profile id to a base localStorage key so per-profile
 * data doesn't leak across siblings on the same device. Falls back to the
 * base key when no profile is active (single-user / pre-onboarding) so
 * tests and first-run still work without special-casing.
 *
 * @param {string} base — base storage key (e.g. 'giri_friends_unlocked')
 * @returns {string}
 */
export function getProfileScopedKey(base) {
  const id = getActiveProfileId();
  return id ? `${base}__${id}` : base;
}

/**
 * Known per-profile storage keys cleared when a profile is deleted.
 * Adding a new profile-scoped module? Add its BASE key here so the
 * scoped variant gets cleaned up cleanly.
 *
 * Pre-existing globally-keyed storage (giri_stories_read, giri_meet_words,
 * giri_comp_log, phonicsquest_badges, lscwc_stats) is NOT cleaned up here
 * — they're known to leak across profiles and need a separate migration
 * pass (audit follow-up).
 */
const PROFILE_SCOPED_BASE_KEYS = [
  'giri_friends_unlocked',
];

function _cleanupProfileScopedKeys(id) {
  for (const base of PROFILE_SCOPED_BASE_KEYS) {
    try { localStorage.removeItem(`${base}__${id}`); } catch (_) {}
  }
}

/**
 * Activate a profile: switch the store's storage key so all
 * progress reads/writes go to that profile's namespace.
 */
export function activateProfile(id) {
  _maybeMigrateLegacyProgressToProfile(id);
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
  store.setStorageKey(PROFILE_STORAGE_KEY(id));
}

/**
 * Deactivate the current profile (for switching).
 * Saves current data before switching away.
 */
export function deactivateProfile() {
  // store.setStorageKey() already saves on switch; just clear active
  localStorage.removeItem(ACTIVE_PROFILE_KEY);
  store.resetStorageKey();
}

/** Check if a profile needs to be selected before the app starts. */
export function needsProfileSelection() {
  const profiles = getProfiles();
  if (profiles.length === 0) return true;   // no profiles → must create one
  if (profiles.length === 1) {
    // Auto-activate the only profile if none is active
    if (!getActiveProfileId()) {
      activateProfile(profiles[0].id);
    }
    return false;
  }
  // Multiple profiles → must select one if none is active
  return !getActiveProfileId();
}

/** Restore a previously active profile on page load. */
export function restoreActiveProfile() {
  const id = getActiveProfileId();
  if (id && getProfiles().find(p => p.id === id)) {
    store.setStorageKey(PROFILE_STORAGE_KEY(id));
    return true;
  }
  return false;
}

// ── Export / Import ─────────────────────────────────────────────────────────

/**
 * Export a profile and all its progress data to a JSON file download.
 * The exported file can later be imported via importProfile().
 * @param {string} id  Profile ID to export
 * @returns {boolean}  true if export was triggered, false if profile not found
 */
export function exportProfile(id) {
  const profiles = getProfiles();
  const profile = profiles.find(p => p.id === id);
  if (!profile) return false;

  let progressData;
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY(id));
    progressData = raw ? JSON.parse(raw) : {};
  } catch (_) {
    progressData = {};
  }

  const exportPayload = {
    _type:       'phonicsquest_profile_export',
    _version:    2,
    _exportedAt: new Date().toISOString(),
    profile,
    progressData,
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const safeName = profile.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.href     = url;
  a.download = `phonicsquest_${safeName}_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return true;
}

/**
 * Import a profile from a previously exported JSON blob/string.
 * Creates a new profile with a fresh ID (to avoid collisions) and
 * restores all progress data, including primaryGrade and readingBand
 * so a parent's child shows up as the same kind of learner after a
 * backup restore.
 * @param {string} jsonString  Raw JSON text of the export file
 * @returns {{ profile: object, error?: string }}
 */
export function importProfile(jsonString) {
  let payload;
  try {
    payload = JSON.parse(jsonString);
  } catch (_) {
    return { profile: null, error: 'File could not be read. Make sure it is a valid PhonicsQuest export.' };
  }

  if (payload?._type !== 'phonicsquest_profile_export') {
    return { profile: null, error: 'This file is not a PhonicsQuest export file.' };
  }

  if (!payload.profile?.name) {
    return { profile: null, error: 'Export file is missing profile data.' };
  }

  const src = payload.profile;
  const importedGrade = _normalisePrimaryGrade(src.primaryGrade);
  const importedBand  = _normaliseReadingBand(src.readingBand);
  // If the export had a primaryGrade we treat it as a primary profile even if
  // the legacy schoolLevel field was missing.
  const resolvedSchoolLevel = (src.schoolLevel === 'primary' || importedGrade) ? 'primary' : 'preschool';

  // Create a fresh profile (new ID to avoid stomping an existing one)
  const newProfile = createProfile(
    src.name + ' (imported)',
    src.avatar || AVATAR_OPTIONS[0],
    src.color  || COLOR_OPTIONS[0],
    resolvedSchoolLevel,
    {
      primaryGrade: importedGrade,
      readingBand:  importedBand,
    },
  );

  // Restore progress data under the new profile's storage key.  Progress
  // includes weak-skill maps (wvWeakSkills, ccqWeakSkills), questMastery,
  // wordStats, paperSession, etc., so the imported child looks exactly the
  // same as the exported one.
  if (payload.progressData && typeof payload.progressData === 'object') {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY(newProfile.id), JSON.stringify(payload.progressData));
    } catch (_) {
      return { profile: newProfile, error: 'Profile created but progress data could not be restored (storage full?).' };
    }
  }

  return { profile: newProfile, error: null };
}

/**
 * Pure-function variant of import used by tests and the dashboard "preview"
 * flow.  It parses a JSON payload and produces the canonical profile object
 * (without writing to localStorage), so callers can verify that fields like
 * primaryGrade and readingBand survive the round-trip.
 */
export function parseProfileImportPayload(jsonString) {
  let payload;
  try {
    payload = JSON.parse(jsonString);
  } catch (_) {
    return { profile: null, progressData: null, error: 'invalid-json' };
  }
  if (payload?._type !== 'phonicsquest_profile_export' || !payload.profile?.name) {
    return { profile: null, progressData: null, error: 'invalid-shape' };
  }
  const src = payload.profile;
  const importedGrade = _normalisePrimaryGrade(src.primaryGrade);
  const importedBand  = _normaliseReadingBand(src.readingBand);
  const resolvedSchoolLevel = (src.schoolLevel === 'primary' || importedGrade) ? 'primary' : 'preschool';
  return {
    profile: {
      name:        src.name,
      avatar:      src.avatar || AVATAR_OPTIONS[0],
      color:       src.color || COLOR_OPTIONS[0],
      schoolLevel: resolvedSchoolLevel,
      primaryGrade: resolvedSchoolLevel === 'primary' ? importedGrade : null,
      readingBand: importedBand,
    },
    progressData: payload.progressData && typeof payload.progressData === 'object' ? payload.progressData : {},
    error: null,
  };
}

export { AVATAR_OPTIONS, COLOR_OPTIONS };
