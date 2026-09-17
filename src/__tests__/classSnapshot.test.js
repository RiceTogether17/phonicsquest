/**
 * Class snapshot — grouping children by what they need.
 *
 * The app answers "how is this child doing?" everywhere. An adult with
 * several children on one device needs "which of them need the same
 * lesson?", and answering it by opening four dashboards and holding the
 * answers in your head is the work this saves.
 *
 * Three properties carry it:
 *
 *   1. Reading a sibling's progress must not disturb the live one. `store`
 *      is bound to one profile at a time, so the obvious implementation
 *      (switch, read, switch back) corrupts state if anything throws in
 *      between — and looks identical from the outside when it works.
 *   2. A group is only a group at two or more children. One child with a
 *      problem is already covered by their own dashboard.
 *   3. Findings must be real findings. Stale entries, fallback labels and
 *      never-practised stages all look like shared problems and are none.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getClassSnapshot,
  readProfileProgress,
  liveMisconceptions,
  weakGroups,
  hasClassToShow,
  MIN_GROUP_SIZE,
} from '../modules/classSnapshot.js';
import { getActiveProfileId } from '../modules/profiles.js';
import { PATTERN_LOOKBACK_DAYS } from '../modules/teacherFeedback.js';
import { FALLBACK_MISCONCEPTION_IDS, getMisconception } from '../modules/misconceptions.js';

const daysAgo = (n) => new Date(Date.now() - n * 86_400_000).toISOString();

/** Write a profile straight to storage, the way a real session would. */
function seedProfile(id, name, progress) {
  const metaKey = 'phonicsquest_profiles';
  const existing = JSON.parse(localStorage.getItem(metaKey) || '[]');
  existing.push({ id, name, avatar: '🦊', color: '#f97316', schoolLevel: 'preschool' });
  localStorage.setItem(metaKey, JSON.stringify(existing));
  localStorage.setItem(`phonicsquest_profile_${id}`, JSON.stringify(progress));
}

const misconception = (id, count, seen = daysAgo(1)) => ({
  [id]: { count, skills: {}, modes: {}, firstSeen: seen, lastSeen: seen, cleanStreak: 0 },
});

beforeEach(() => localStorage.clear());
afterEach(() => localStorage.clear());

// ── 1. The safety property ────────────────────────────────────────────────

describe('reading across profiles', () => {
  it('leaves the active profile exactly where it was', () => {
    seedProfile('a', 'Ana', { groupMastery: { 'cvc-a': 0.3 } });
    seedProfile('b', 'Bo', { groupMastery: { 'cvc-a': 0.4 } });
    localStorage.setItem('phonicsquest_active_profile', 'a');

    const before = getActiveProfileId();
    getClassSnapshot();
    expect(getActiveProfileId()).toBe(before);
  });

  it('never writes to a profile it read', () => {
    seedProfile('a', 'Ana', { groupMastery: { 'cvc-a': 0.3 }, xp: 40 });
    seedProfile('b', 'Bo', { groupMastery: { 'cvc-a': 0.4 }, xp: 90 });
    const snapshotOf = (id) => localStorage.getItem(`phonicsquest_profile_${id}`);
    const beforeA = snapshotOf('a');
    const beforeB = snapshotOf('b');

    getClassSnapshot();

    expect(snapshotOf('a')).toBe(beforeA);
    expect(snapshotOf('b')).toBe(beforeB);
  });

  it('survives a profile with no saved progress, or corrupt progress', () => {
    seedProfile('a', 'Ana', { groupMastery: { 'cvc-a': 0.3 } });
    localStorage.setItem(
      'phonicsquest_profiles',
      JSON.stringify([
        { id: 'a', name: 'Ana' },
        { id: 'never-played', name: 'Cal' },
        { id: 'broken', name: 'Di' },
      ]),
    );
    localStorage.setItem('phonicsquest_profile_broken', '{not json');

    expect(readProfileProgress('never-played')).toEqual({});
    expect(readProfileProgress('broken')).toEqual({});
    expect(() => getClassSnapshot()).not.toThrow();
  });
});

// ── 2. What counts as a group ─────────────────────────────────────────────

describe('grouping', () => {
  it('reports a stage two children have both practised and not secured', () => {
    seedProfile('a', 'Ana', { groupMastery: { 'cvc-a': 0.3 } });
    seedProfile('b', 'Bo', { groupMastery: { 'cvc-a': 0.5 } });

    const { groups } = getClassSnapshot();
    const phonics = groups.find((g) => g.kind === 'phonics' && g.key === 'cvc-a');
    expect(phonics).toBeTruthy();
    expect(phonics.children.map((c) => c.name).sort()).toEqual(['Ana', 'Bo']);
    expect(phonics.action.group).toBe('cvc-a');
  });

  it('says nothing about a problem only one child has', () => {
    // Their own dashboard already covers it; a "group" of one is noise in a
    // view whose whole purpose is the lesson worth teaching once to several.
    seedProfile('a', 'Ana', { groupMastery: { 'cvc-a': 0.3 } });
    seedProfile('b', 'Bo', { groupMastery: { 'cvc-e': 0.3 } });

    const { groups } = getClassSnapshot();
    expect(groups).toHaveLength(0);
  });

  it('puts the biggest group first — best return on ten minutes', () => {
    seedProfile('a', 'Ana', { groupMastery: { 'cvc-a': 0.3, 'cvc-e': 0.3 } });
    seedProfile('b', 'Bo', { groupMastery: { 'cvc-a': 0.3, 'cvc-e': 0.3 } });
    seedProfile('c', 'Cal', { groupMastery: { 'cvc-a': 0.3 } });

    const { groups } = getClassSnapshot();
    expect(groups[0].children).toHaveLength(3);
    expect(groups[0].key).toBe('cvc-a');
  });

  it('groups a shared misconception with the rule that fixes it', () => {
    const id = 'subject-verb-agreement';
    seedProfile('a', 'Ana', { misconceptionLog: misconception(id, 3) });
    seedProfile('b', 'Bo', { misconceptionLog: misconception(id, 2) });

    const { groups } = getClassSnapshot();
    const group = groups.find((g) => g.kind === 'misconception');
    expect(group?.key).toBe(id);
    expect(group.children).toHaveLength(2);
    // The teaching line is the cue — written to be said before the answer is
    // revealed, which is what a small-group teacher needs in their hand.
    expect(group.teach).toBeTruthy();
    expect(group.detail).toBeTruthy();
  });

  it('only offers itself when there is more than one child', () => {
    seedProfile('a', 'Ana', {});
    expect(hasClassToShow()).toBe(false);
    seedProfile('b', 'Bo', {});
    expect(hasClassToShow()).toBe(true);
    expect(MIN_GROUP_SIZE).toBe(2);
  });
});

// ── 3. What must not count ────────────────────────────────────────────────

describe('findings that would be false', () => {
  it('ignores a stage nobody has practised', () => {
    // Mastery 0 means "not there yet", not "struggling". Grouping a child
    // who has never met long vowels with one who has practised and
    // struggled sends both to the wrong lesson.
    seedProfile('a', 'Ana', { groupMastery: { 'long-a-ae': 0 } });
    seedProfile('b', 'Bo', { groupMastery: { 'long-a-ae': 0 } });

    expect(getClassSnapshot().groups).toHaveLength(0);
    expect(weakGroups({ groupMastery: { 'long-a-ae': 0 } })).toHaveLength(0);
  });

  it('ignores a secure stage', () => {
    seedProfile('a', 'Ana', { groupMastery: { 'cvc-a': 0.95 } });
    seedProfile('b', 'Bo', { groupMastery: { 'cvc-a': 0.9 } });
    expect(getClassSnapshot().groups).toHaveLength(0);
  });

  it('drops a misconception that has gone stale', () => {
    const id = 'subject-verb-agreement';
    const old = daysAgo(PATTERN_LOOKBACK_DAYS + 3);
    seedProfile('a', 'Ana', { misconceptionLog: misconception(id, 5, old) });
    seedProfile('b', 'Bo', { misconceptionLog: misconception(id, 5, old) });

    expect(getClassSnapshot().groups).toHaveLength(0);
  });

  it('drops a one-off slip that never became a habit', () => {
    const id = 'subject-verb-agreement';
    seedProfile('a', 'Ana', { misconceptionLog: misconception(id, 1) });
    seedProfile('b', 'Bo', { misconceptionLog: misconception(id, 1) });
    expect(getClassSnapshot().groups).toHaveLength(0);
  });

  it('never groups children under a fallback label', () => {
    // The per-domain fallbacks are what an unmatched wrong answer is
    // LABELLED, not a diagnosis. Grouping on one would invent a shared
    // problem out of the absence of a finding.
    for (const id of FALLBACK_MISCONCEPTION_IDS) {
      // These ARE in the taxonomy, so they would sail through a check that
      // only asked "is this a known id?" — the exclusion has to be explicit.
      expect(getMisconception(id), `${id} should exist in the taxonomy`).toBeTruthy();
      expect(liveMisconceptions({ misconceptionLog: misconception(id, 9) })).toEqual([]);
    }
  });

  it('ignores a misconception id that is not in the taxonomy', () => {
    expect(liveMisconceptions({ misconceptionLog: misconception('made-up-id', 9) })).toEqual([]);
  });
});
