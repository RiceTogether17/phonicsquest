import { describe, it, expect, beforeEach } from 'vitest';
import {
  deriveFriendName,
  friendFromStory,
  unlockFriend,
  isFriendUnlocked,
  getUnlockedSet,
  getRoster,
  getRosterSummary,
  __TEST__,
} from '../src/modules/storyFriends.js';

beforeEach(() => {
  localStorage.clear();
});

describe('deriveFriendName — strip the "Giri X" prefix', () => {
  it('handles the possessive pattern', () => {
    expect(deriveFriendName("Giri's Red Hat")).toBe('Red Hat');
    expect(deriveFriendName("Giri's Big Cake")).toBe('Big Cake');
  });

  it('handles the "Giri and the X" pattern', () => {
    expect(deriveFriendName('Giri and the Cat')).toBe('Cat');
    expect(deriveFriendName('Giri and the Speedy Boat')).toBe('Speedy Boat');
  });

  it('handles the "Giri and X" pattern (no "the")', () => {
    expect(deriveFriendName('Giri and Hen')).toBe('Hen');
  });

  it('falls back to remainder for "Giri verb X" patterns', () => {
    expect(deriveFriendName('Giri Bakes a Cake')).toBe('Bakes a Cake');
    expect(deriveFriendName('Giri Helps the Bee')).toBe('Helps the Bee');
  });

  it('returns the original title when nothing strips cleanly', () => {
    expect(deriveFriendName('Wonderland')).toBe('Wonderland');
  });

  it('returns "" for falsy / non-string input', () => {
    expect(deriveFriendName(null)).toBe('');
    expect(deriveFriendName(undefined)).toBe('');
    expect(deriveFriendName('')).toBe('');
    expect(deriveFriendName('   ')).toBe('');
  });
});

describe('friendFromStory — build the friend record', () => {
  it('uses the story emoji + derived name', () => {
    const friend = friendFromStory({
      id: 'core-a-01',
      title: "Giri's Red Hat",
      emoji: '🎩',
      band: 'A',
      phase: 'short-a',
    });
    expect(friend).toEqual({
      id: 'core-a-01',
      storyId: 'core-a-01',
      name: 'Red Hat',
      emoji: '🎩',
      band: 'A',
      phase: 'short-a',
      storyTitle: "Giri's Red Hat",
    });
  });

  it('uses the curated override when the auto-derive would be awkward', () => {
    const friend = friendFromStory({
      id: 'core-a-14',
      title: 'Giri Gets Wet',
      emoji: '💦',
      band: 'A',
    });
    expect(friend.name).toBe(__TEST__.NAME_OVERRIDES['core-a-14']);
    expect(friend.name).toBe('Wet Boots');
  });

  it('falls back to ✨ when the story has no emoji', () => {
    const friend = friendFromStory({ id: 's', title: 'Giri Plays' });
    expect(friend.emoji).toBe('✨');
  });

  it('returns null for missing input', () => {
    expect(friendFromStory(null)).toBeNull();
    expect(friendFromStory({})).toBeNull();
  });
});

describe('unlockFriend / isFriendUnlocked — localStorage persistence', () => {
  it('starts empty on a fresh profile', () => {
    expect(isFriendUnlocked('core-a-01')).toBe(false);
    expect(Array.from(getUnlockedSet())).toEqual([]);
  });

  it('unlocks once and persists', () => {
    expect(unlockFriend('core-a-01')).toBe(true);
    expect(isFriendUnlocked('core-a-01')).toBe(true);
  });

  it('is idempotent (second unlock returns false)', () => {
    unlockFriend('core-a-01');
    expect(unlockFriend('core-a-01')).toBe(false);
    expect(Array.from(getUnlockedSet())).toEqual(['core-a-01']);
  });

  it('refuses invalid input', () => {
    expect(unlockFriend(null)).toBe(false);
    expect(unlockFriend('')).toBe(false);
    expect(unlockFriend(42)).toBe(false);
  });

  it('survives a corrupted storage value', () => {
    localStorage.setItem(__TEST__.storageKey(), '{not json');
    expect(Array.from(getUnlockedSet())).toEqual([]);
    expect(unlockFriend('core-a-01')).toBe(true);
    expect(isFriendUnlocked('core-a-01')).toBe(true);
  });
});

describe('getRoster / getRosterSummary — gallery view', () => {
  const stories = [
    { id: 'core-a-01', title: "Giri's Red Hat", emoji: '🎩', band: 'A' },
    { id: 'core-a-02', title: 'Giri and the Cat', emoji: '🐱', band: 'A' },
    { id: 'core-b-01', title: 'Giri and the Bee', emoji: '🐝', band: 'B' },
  ];

  it('returns one record per story, with locked default', () => {
    const roster = getRoster(stories);
    expect(roster).toHaveLength(3);
    expect(roster.every((r) => r.unlocked === false)).toBe(true);
  });

  it('flags unlocked friends correctly', () => {
    unlockFriend('core-a-01');
    unlockFriend('core-b-01');
    const roster = getRoster(stories);
    const unlocked = roster.filter((r) => r.unlocked).map((r) => r.id);
    expect(unlocked.sort()).toEqual(['core-a-01', 'core-b-01']);
  });

  it('handles non-array input gracefully', () => {
    expect(getRoster(null)).toEqual([]);
    expect(getRoster(undefined)).toEqual([]);
  });

  it('summary returns unlocked/total counts + the roster', () => {
    unlockFriend('core-a-01');
    const summary = getRosterSummary(stories);
    expect(summary.unlocked).toBe(1);
    expect(summary.total).toBe(3);
    expect(summary.roster).toHaveLength(3);
  });
});

describe('profile isolation — friends are per-profile, never shared', () => {
  it('unlocks are scoped to the active profile (siblings stay separate)', () => {
    // Set up two profiles on one device
    localStorage.setItem(
      'phonicsquest_profiles',
      JSON.stringify([
        { id: 'child-a', name: 'A', avatar: '🦁', color: '#000', createdAt: 1 },
        { id: 'child-b', name: 'B', avatar: '🐯', color: '#111', createdAt: 2 },
      ]),
    );

    // Child A unlocks Red Hat
    localStorage.setItem('phonicsquest_active_profile', 'child-a');
    unlockFriend('core-a-01');
    expect(isFriendUnlocked('core-a-01')).toBe(true);

    // Switch to Child B — should see an empty friends list
    localStorage.setItem('phonicsquest_active_profile', 'child-b');
    expect(isFriendUnlocked('core-a-01')).toBe(false);
    expect(Array.from(getUnlockedSet())).toEqual([]);

    // Child B unlocks their own
    unlockFriend('core-a-02');
    expect(isFriendUnlocked('core-a-02')).toBe(true);
    expect(isFriendUnlocked('core-a-01')).toBe(false);

    // Switch back — Child A's unlocks survive unaffected
    localStorage.setItem('phonicsquest_active_profile', 'child-a');
    expect(isFriendUnlocked('core-a-01')).toBe(true);
    expect(isFriendUnlocked('core-a-02')).toBe(false);
  });

  it('falls back to the base key when no profile is active (single-user / tests)', () => {
    // No active profile set
    expect(__TEST__.storageKey()).toBe(__TEST__.STORAGE_BASE);
    unlockFriend('core-a-05');
    expect(localStorage.getItem(__TEST__.STORAGE_BASE)).toBeTruthy();
  });
});

describe('charter audit — friends are co-stars, not Giri himself', () => {
  it("no friend name in the derived set is just 'Giri'", () => {
    const titles = [
      "Giri's Red Hat",
      'Giri and the Cat',
      'Giri and the Bee',
      'Giri Bakes a Cake',
      "Giri's Big Day",
    ];
    for (const t of titles) {
      const name = deriveFriendName(t);
      expect(name.toLowerCase()).not.toBe('giri');
      expect(name.length).toBeGreaterThan(0);
    }
  });
});
