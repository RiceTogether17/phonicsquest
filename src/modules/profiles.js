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

/** Default avatars for new profiles */
const AVATAR_OPTIONS = ['🦁', '🐯', '🐻', '🦊', '🐼', '🐨', '🦋', '🐸', '🐬', '🦄', '🐧', '🐙'];
const COLOR_OPTIONS  = ['#6c63ff', '#22c55e', '#f59e0b', '#ef4444', '#0ea5e9', '#ec4899', '#8b5cf6', '#14b8a6'];

// ── Public API ─────────────────────────────────────────────────────────────

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

/** Create a new profile and return it. */
export function createProfile(name, avatar, color) {
  const id = 'p_' + Date.now().toString(36);
  const profile = {
    id,
    name: name || 'Player',
    avatar: avatar || AVATAR_OPTIONS[0],
    color:  color  || COLOR_OPTIONS[0],
    createdAt: new Date().toISOString(),
  };
  const profiles = getProfiles();
  profiles.push(profile);
  _saveProfiles(profiles);
  return profile;
}

/** Delete a profile and its progress data. */
export function deleteProfile(id) {
  const profiles = getProfiles().filter(p => p.id !== id);
  _saveProfiles(profiles);
  try { localStorage.removeItem(PROFILE_STORAGE_KEY(id)); } catch (_) {}
  if (getActiveProfileId() === id) {
    localStorage.removeItem(ACTIVE_PROFILE_KEY);
  }
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
 * Activate a profile: switch the store's storage key so all
 * progress reads/writes go to that profile's namespace.
 */
export function activateProfile(id) {
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

export { AVATAR_OPTIONS, COLOR_OPTIONS };
