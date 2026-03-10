import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createProfile, activateProfile } from '../modules/profiles.js';
import { store } from '../modules/store.js';

const LEGACY_KEY = 'phonicsquest_v2';
const MIGRATION_FLAG = 'phonicsquest_legacy_migrated_to_profiles';

function profileKey(id) {
  return `phonicsquest_profile_${id}`;
}

describe('profiles legacy progress migration', () => {
  beforeEach(() => {
    localStorage.clear();
    store.resetStorageKey();
    store.reset();
  });

  afterEach(() => {
    store.resetStorageKey();
  });

  it('migrates legacy single-profile progress when activating the first profile', () => {
    const legacy = {
      xp: 320,
      level: 4,
      dailyDone: 7,
      wordStats: {
        cat: { attempts: 8, correct: 7, lastSeen: '2026-01-10T00:00:00.000Z' },
      },
      wordHistory: [{ wordId: 'cat', correct: true }],
    };
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacy));

    const profile = createProfile('Ari', '🦊', '#6c63ff');
    activateProfile(profile.id);

    const migrated = JSON.parse(localStorage.getItem(profileKey(profile.id)) || '{}');
    expect(migrated.xp).toBe(320);
    expect(migrated.level).toBe(4);
    expect(Object.keys(migrated.wordStats || {})).toContain('cat');
    expect(localStorage.getItem(MIGRATION_FLAG)).toBe('1');
  });

  it('does not overwrite an existing profile save during activation', () => {
    localStorage.setItem(LEGACY_KEY, JSON.stringify({ xp: 999, wordStats: { sun: { attempts: 9, correct: 9 } } }));

    const profile = createProfile('Bea', '🐼', '#22c55e');
    const existing = { xp: 10, wordStats: { map: { attempts: 2, correct: 2 } } };
    localStorage.setItem(profileKey(profile.id), JSON.stringify(existing));

    activateProfile(profile.id);

    const saved = JSON.parse(localStorage.getItem(profileKey(profile.id)) || '{}');
    expect(saved.xp).toBe(10);
    expect(saved.wordStats.sun).toBeUndefined();
    expect(saved.wordStats.map.attempts).toBe(2);
  });
});
