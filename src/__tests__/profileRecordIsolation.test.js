/*
 * Audit 2026-09-19, Finding 4 — story, spelling and badge records cross profile
 * boundaries.
 *
 * storyMode.js used the global keys giri_stories_read, giri_meet_words and
 * giri_comp_log; lscwcDrill.js used lscwc_stats; badges.js had its own global
 * store. So a second child on the same device inherited the first one's read
 * stories, word preparation and spelling practice, and a report could describe
 * a mixture of learners. profiles.js already acknowledged the gap in a comment.
 *
 * The audit's acceptance criterion, which this file is written to: learner A
 * completes a story and a spelling drill; learner B remains untouched;
 * deleting A does not affect B.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  createProfile,
  activateProfile,
  deleteProfile,
  getProfileScopedKey,
  adoptLegacyGlobalRecords,
} from '../modules/profiles.js';

const root = resolve(import.meta.dirname, '../..');

/** The keys that used to be shared by every child on the device. */
const LEAKED_BASES = [
  'giri_stories_read',
  'giri_meet_words',
  'giri_comp_log',
  'lscwc_stats',
  'phonicsquest_badges',
];

/** Write a record as the currently active learner. */
const writeAs = (base, value) =>
  localStorage.setItem(getProfileScopedKey(base), JSON.stringify(value));

/** Read the currently active learner's record. */
const readAs = (base) => {
  const raw = localStorage.getItem(getProfileScopedKey(base));
  return raw === null ? null : JSON.parse(raw);
};

describe('learner records do not cross profiles (audit finding 4)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps one learner’s stories, spelling and badges away from another’s', () => {
    const a = createProfile('Learner A', undefined, undefined, 'preschool');
    const b = createProfile('Learner B', undefined, undefined, 'preschool');

    activateProfile(a.id);
    writeAs('giri_stories_read', ['core-a-01', 'core-a-02']);
    writeAs('giri_meet_words', { cat: 3 });
    writeAs('giri_comp_log', [{ story: 'core-a-01', score: 2 }]);
    writeAs('lscwc_stats', { ship: { attempts: 4, correct: 3 } });
    writeAs('phonicsquest_badges', { earned: ['first-story'] });

    // B has done nothing and must look like it.
    activateProfile(b.id);
    for (const base of LEAKED_BASES) {
      expect(readAs(base), `${base} leaked into learner B`).toBeNull();
    }

    // B's own work does not disturb A's.
    writeAs('giri_stories_read', ['core-b-01']);
    expect(readAs('giri_stories_read')).toEqual(['core-b-01']);

    activateProfile(a.id);
    expect(readAs('giri_stories_read')).toEqual(['core-a-01', 'core-a-02']);
    expect(readAs('lscwc_stats')).toEqual({ ship: { attempts: 4, correct: 3 } });
  });

  it('removes a deleted learner’s records and leaves the other’s intact', () => {
    const a = createProfile('Learner A', undefined, undefined, 'preschool');
    const b = createProfile('Learner B', undefined, undefined, 'preschool');

    activateProfile(a.id);
    for (const base of LEAKED_BASES) writeAs(base, { owner: 'A' });

    activateProfile(b.id);
    for (const base of LEAKED_BASES) writeAs(base, { owner: 'B' });

    deleteProfile(a.id);

    // A's scoped records are gone...
    for (const base of LEAKED_BASES) {
      expect(localStorage.getItem(`${base}__${a.id}`), `${base} survived deletion`).toBeNull();
    }
    // ...and B still has everything.
    activateProfile(b.id);
    for (const base of LEAKED_BASES) {
      expect(readAs(base), `${base} lost when the other learner was deleted`).toEqual({
        owner: 'B',
      });
    }
  });

  it('assigns pre-existing global records to one learner, not to all of them', () => {
    // An existing install has one undifferentiated pile of records. Copying it
    // to every child would manufacture evidence that each had read those
    // stories, so exactly one profile adopts it.
    localStorage.setItem('giri_stories_read', JSON.stringify(['legacy-01', 'legacy-02']));
    localStorage.setItem('lscwc_stats', JSON.stringify({ old: { attempts: 9, correct: 9 } }));

    const a = createProfile('First Child', undefined, undefined, 'preschool');
    const b = createProfile('Second Child', undefined, undefined, 'preschool');

    activateProfile(a.id);
    expect(readAs('giri_stories_read')).toEqual(['legacy-01', 'legacy-02']);
    expect(readAs('lscwc_stats')).toEqual({ old: { attempts: 9, correct: 9 } });

    // The global copies are gone, so nobody else can inherit them.
    expect(localStorage.getItem('giri_stories_read')).toBeNull();
    expect(localStorage.getItem('lscwc_stats')).toBeNull();

    activateProfile(b.id);
    expect(readAs('giri_stories_read')).toBeNull();
    expect(readAs('lscwc_stats')).toBeNull();
  });

  it('runs the legacy adoption once and never reruns it', () => {
    localStorage.setItem('giri_stories_read', JSON.stringify(['legacy-01']));

    const a = createProfile('First Child', undefined, undefined, 'preschool');
    activateProfile(a.id);
    expect(readAs('giri_stories_read')).toEqual(['legacy-01']);

    // A later global write (a stale module, an old build) must not be adopted
    // a second time and handed to whoever happens to be active.
    localStorage.setItem('giri_stories_read', JSON.stringify(['should-not-be-adopted']));
    const b = createProfile('Second Child', undefined, undefined, 'preschool');
    activateProfile(b.id);

    const result = adoptLegacyGlobalRecords(b.id);
    expect(result.alreadyRun).toBe(true);
    expect(readAs('giri_stories_read')).toBeNull();
  });

  it('never overwrites a record the adopting learner already has', () => {
    const a = createProfile('First Child', undefined, undefined, 'preschool');

    // The learner has their own history, and a legacy global pile also exists.
    localStorage.setItem(`giri_stories_read__${a.id}`, JSON.stringify(['mine']));
    localStorage.setItem('giri_stories_read', JSON.stringify(['legacy']));

    activateProfile(a.id);

    expect(readAs('giri_stories_read')).toEqual(['mine']);
    // The global copy is still cleared, so it cannot reach anyone else.
    expect(localStorage.getItem('giri_stories_read')).toBeNull();
  });

  it('leaves no module reading or writing these keys unscoped', () => {
    // The tests above go through getProfileScopedKey, so on their own they
    // would still pass if a module kept using the bare key. This checks the
    // source: every access must be routed through the helper.
    const files = [
      'src/modes/storyMode.js',
      'src/modes/lscwcDrill.js',
      'src/modules/badges.js',
      'src/modules/personalBestWall.js',
      'src/data/journeyStages.js',
    ];

    for (const file of files) {
      const source = readFileSync(resolve(root, file), 'utf8');
      expect(source, `${file} does not use getProfileScopedKey`).toMatch(/getProfileScopedKey/);

      for (const base of LEAKED_BASES) {
        // A bare localStorage call naming the base key directly.
        const bare = new RegExp(`localStorage\\.(get|set|remove)Item\\(\\s*['"\`]${base}['"\`]`);
        expect(source, `${file} still accesses "${base}" unscoped`).not.toMatch(bare);
      }
    }
  });

  it('registers every one of these keys for cleanup on delete', () => {
    // Scoping without registering would leak a deleted learner's records
    // forever, which is the other half of the same bug.
    const source = readFileSync(resolve(root, 'src/modules/profiles.js'), 'utf8');
    const block = source.slice(
      source.indexOf('const PROFILE_SCOPED_BASE_KEYS'),
      source.indexOf('];', source.indexOf('const PROFILE_SCOPED_BASE_KEYS')),
    );
    for (const base of LEAKED_BASES) {
      expect(block, `${base} is not registered for cleanup`).toContain(base);
    }
  });

  it('falls back to the bare key when no profile is active', () => {
    // Pre-onboarding and single-user installs must keep working unchanged.
    expect(getProfileScopedKey('giri_stories_read')).toBe('giri_stories_read');
  });
});
