/**
 * PhonicsQuest – Giri's Story Friends (C3)
 *
 * Each Giri Story has a co-star — the cat, the hat, the cake. When a
 * child finishes a story, that co-star moves into Giri's Friends
 * gallery. Pure narrative reward: every friend is the supporting
 * character from a story the child has actually read, never a
 * decorative cosmetic the child buys with currency, and never Giri
 * himself (the originality charter keeps Giri sacred).
 *
 * Pure helpers — no DOM. Storage uses a single localStorage key
 * (per-profile via the existing pattern would require wiring through
 * profiles.js; a single shared key is fine for v1 and matches how
 * `giri_stories_read` already works).
 *
 * Charter-safe:
 *   - Friends are unlocked, never traded / bought / dressed up.
 *   - Locked friends are silhouettes, NEVER a "buy with XP" gate.
 *   - The roster reads as "look at the friends you've met," not
 *     "look at what you're missing" — empty-state copy celebrates
 *     the first read instead of guilting on zero unlocks.
 */

const STORAGE_KEY = 'giri_friends_unlocked';

/**
 * Names that don't strip cleanly from the title patterns (e.g.
 * "Giri Gets Wet" — "Wet" is awkward as a friend name). Map by
 * story id to a short, kid-friendly co-star label. Anything not in
 * here falls through to the regex deriver below.
 */
const NAME_OVERRIDES = Object.freeze({
  'core-a-14': 'Wet Boots',     // Giri Gets Wet
  'core-a-16': 'Fast Feet',     // Giri's Big Run
  'core-b-04': 'Sun Day',       // Giri's Big Day
  'core-a-06': 'Shovel',        // Giri's Big Dig
  'core-a-04': 'Pillow',        // Giri's Nap
});

/**
 * Strip the "Giri's / Giri and (the) / Giri " prefix from a title to
 * leave the co-star noun. Returns the trimmed remainder; if nothing
 * usable is left, returns the original title.
 *
 * @param {string} title
 * @returns {string}
 */
export function deriveFriendName(title) {
  if (typeof title !== 'string' || !title.trim()) return '';
  return title
    .replace(/^Giri's\s+/i, '')
    .replace(/^Giri\s+and\s+the\s+/i, '')
    .replace(/^Giri\s+and\s+/i, '')
    .replace(/^Giri\s+/i, '')
    .trim()
    || title;
}

/**
 * Build a friend record from a story. Pure.
 *
 * @param {{ id:string, title:string, emoji?:string, band?:string, phase?:string }} story
 * @returns {{
 *   id:string, storyId:string, name:string, emoji:string,
 *   band:string, phase:string, storyTitle:string,
 * }}
 */
export function friendFromStory(story) {
  if (!story || !story.id) return null;
  const name = NAME_OVERRIDES[story.id] || deriveFriendName(story.title || '') || 'Friend';
  return {
    id: story.id,
    storyId: story.id,
    name,
    emoji: story.emoji || '✨',
    band: story.band || 'A',
    phase: story.phase || '',
    storyTitle: story.title || '',
  };
}

/** Read the unlocked set from localStorage, defensively. */
export function getUnlockedSet() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch (_) {
    return new Set();
  }
}

/** Persist the unlocked set. */
function _saveUnlockedSet(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (_) { /* storage full / disabled — ignore */ }
}

/**
 * Mark a friend as unlocked. Idempotent — multiple reads of the same
 * story don't pile on. Returns `true` if this was a new unlock (the
 * caller can show a one-shot celebration), `false` if already unlocked
 * or invalid input.
 *
 * @param {string} storyId
 * @returns {boolean}
 */
export function unlockFriend(storyId) {
  if (!storyId || typeof storyId !== 'string') return false;
  const set = getUnlockedSet();
  if (set.has(storyId)) return false;
  set.add(storyId);
  _saveUnlockedSet(set);
  return true;
}

/** Is the friend for this story unlocked? */
export function isFriendUnlocked(storyId) {
  return getUnlockedSet().has(storyId);
}

/**
 * Build the full roster from a list of stories. Each entry carries
 * `unlocked:bool` so the UI can render unlocked friends in full + a
 * silhouette for locked ones (NEVER a "buy" gate).
 *
 * @param {Array<typeof friendFromStory['arguments'][0]>} stories
 * @returns {Array<ReturnType<typeof friendFromStory> & { unlocked:boolean }>}
 */
export function getRoster(stories) {
  const unlocked = getUnlockedSet();
  if (!Array.isArray(stories)) return [];
  const out = [];
  for (const story of stories) {
    const friend = friendFromStory(story);
    if (!friend) continue;
    out.push({ ...friend, unlocked: unlocked.has(story.id) });
  }
  return out;
}

/** Compact summary for the home / stories browser tile. */
export function getRosterSummary(stories) {
  const roster = getRoster(stories);
  const unlocked = roster.filter(r => r.unlocked).length;
  return { unlocked, total: roster.length, roster };
}

export const __TEST__ = { STORAGE_KEY, NAME_OVERRIDES };
