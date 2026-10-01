/**
 * Audit 2026-09-19, Finding 5 — learner profile exports include AI credentials.
 *
 * `exportProfile` serialised the entire saved state as `progressData`, so a
 * routine progress-transfer file carried `aiApiKeys`, the legacy
 * `geminiApiKey` and the `parentPin` hash. The audit reproduced this with a
 * synthetic profile holding a dummy provider key.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  store,
  pickExportableState,
  exportableStateKeys,
  isNonExportableStateKey,
  NON_EXPORTABLE_STATE_KEYS,
} from '../modules/store.js';
import { exportProfile, createProfile, parseProfileImportPayload } from '../modules/profiles.js';

const SECRETS = {
  parentPin: 'hashed-1234',
  geminiApiKey: 'AIza-dummy-not-a-real-key',
  aiApiKeys: { google: 'AIza-dummy-not-a-real-key', openai: 'sk-dummy' },
  aiProvider: 'google',
};

describe('progress exports withhold credentials (audit finding 5)', () => {
  beforeEach(() => {
    store.reset();
    localStorage.clear();
  });

  it('withholds every secret-shaped state key deliberately, not by accident', () => {
    // Adding a state key that looks like a credential without listing it in
    // NON_EXPORTABLE_STATE_KEYS should fail here, so the decision is made
    // once, in the open, rather than discovered in a parent's shared file.
    const all = Object.keys(store.getAll ? store.getAll() : store._state);

    // Guard against this test passing because it read an empty object.
    expect(all.length).toBeGreaterThan(60);

    const withheld = all.filter((k) => isNonExportableStateKey(k)).sort();
    expect(withheld).toEqual([...NON_EXPORTABLE_STATE_KEYS].sort());
    expect(exportableStateKeys()).not.toContain('aiApiKeys');
  });

  it('carries progress written under keys absent from the default state', () => {
    // Roughly a third of a learner's record is created on first use and never
    // appears in DEFAULT_STATE. An allowlist derived from DEFAULT_STATE drops
    // these silently, which is loss of a child's progress on an ordinary
    // transfer -- the failure the audit's own acceptance criterion rules out.
    const dynamic = {
      wvWeakSkills: { P5: { collocation: { wrong: 3 } } },
      ccqCompletedByPassage: { 'cc-p3-01': true },
      masteryMap: { articles: 0.8 },
      paperMode: { lastPaper: 'p6-1' },
    };

    const picked = pickExportableState({ ...dynamic, ...SECRETS });

    expect(picked).toEqual(dynamic);
  });

  it('drops credential and PIN fields from a state copy', () => {
    const picked = pickExportableState({ xp: 120, streak: 4, ...SECRETS });

    expect(picked.xp).toBe(120);
    expect(picked.streak).toBe(4);
    for (const secret of Object.keys(SECRETS)) {
      expect(picked).not.toHaveProperty(secret);
    }
  });

  it('writes no credential into the generated export file', () => {
    const profile = createProfile('Test Child', undefined, undefined, 'primary', {
      primaryGrade: 'P3',
    });
    localStorage.setItem(
      `phonicsquest_profile_${profile.id}`,
      JSON.stringify({ xp: 300, wordStats: { cat: { attempts: 3 } }, ...SECRETS }),
    );

    let captured = '';
    const OriginalBlob = globalThis.Blob;
    globalThis.Blob = class {
      constructor(parts) {
        captured = parts.join('');
      }
    };
    globalThis.URL.createObjectURL = () => 'blob:stub';
    globalThis.URL.revokeObjectURL = () => {};
    const anchor = document.createElement('a');
    anchor.click = () => {};
    const originalCreate = document.createElement.bind(document);
    document.createElement = (tag) => (tag === 'a' ? anchor : originalCreate(tag));

    try {
      expect(exportProfile(profile.id)).toBe(true);
    } finally {
      globalThis.Blob = OriginalBlob;
      document.createElement = originalCreate;
    }

    expect(captured).not.toBe('');
    expect(captured).not.toMatch(/AIza-dummy|sk-dummy|hashed-1234/);
    expect(captured).not.toMatch(/aiApiKeys|geminiApiKey|parentPin/);

    // Ordinary progress still round-trips.
    const payload = JSON.parse(captured);
    expect(payload.progressData.xp).toBe(300);
    expect(payload.progressData.wordStats.cat.attempts).toBe(3);
  });

  it('cannot reinstate credentials from an export written before this policy', () => {
    const legacyFile = JSON.stringify({
      _type: 'phonicsquest_profile_export',
      _version: 2,
      profile: { name: 'Older Export', schoolLevel: 'primary', primaryGrade: 'P4' },
      progressData: { xp: 50, ...SECRETS },
    });

    const { progressData, error } = parseProfileImportPayload(legacyFile);

    expect(error).toBeNull();
    expect(progressData.xp).toBe(50);
    for (const secret of Object.keys(SECRETS)) {
      expect(progressData).not.toHaveProperty(secret);
    }
  });
});
