/**
 * PhonicsQuest – Class snapshot: who needs the same thing
 *
 * Everything else in the app answers "how is this child doing?". An adult
 * with three or four children on one device — a teacher on a shared tablet,
 * a parent with siblings, a centre running a small group — has a different
 * question: *which of them need the same lesson?* Answering it by opening
 * four dashboards and holding the answers in your head is the work this
 * saves, and it is the work that makes the difference between a report and
 * a plan.
 *
 * Nothing here is new measurement. Every number already exists per profile;
 * this reads across profiles instead of down one.
 *
 * ── Read-only, by construction ───────────────────────────────────────────
 *
 * `store` is bound to ONE profile at a time (`activateProfile` swaps its
 * storage key), so the obvious implementation — switch profile, read, switch
 * back — would write another child's namespace into the live store and leave
 * the app pointing at a sibling if anything threw in between. That is a data
 * corruption bug waiting for a slow device.
 *
 * Instead every read here parses the profile's localStorage blob directly
 * and never touches `store`. `classSnapshot.test.js` asserts the active
 * profile is unchanged after a snapshot, because the safe version and the
 * dangerous version look identical from the outside.
 *
 * ── Why it lives behind the parent PIN ───────────────────────────────────
 *
 * It names other children and what they cannot yet do. On a shared device a
 * child could otherwise read that about a classmate. The dashboard is
 * already PIN-gated, so putting the snapshot inside it is both the simplest
 * home and the right one.
 */

import { getProfiles } from './profiles.js';
import { getMisconception, isFallbackMisconception } from './misconceptions.js';
import { PATTERN_LOOKBACK_DAYS } from './teacherFeedback.js';
import { CURRICULUM } from '../data/curriculum.js';
import { VOWEL_LABELS, normalizeGroupMasteryMap } from './phonicsGroupKeys.js';

/** Fewest children who must share a finding before it is a group. */
export const MIN_GROUP_SIZE = 2;

/** Group mastery at or below this counts as "not secure yet". */
const WEAK_MASTERY = 0.6;

/** Times a misconception must recur in one child before it is a pattern. */
const MIN_OCCURRENCES = 2;

const PROFILE_KEY = (id) => `phonicsquest_profile_${id}`;

/**
 * One profile's saved progress, parsed straight from storage.
 *
 * Deliberately does NOT go through `store` — see the header. Returns an
 * empty object rather than throwing: a child who has never played has no
 * blob, and a corrupt one must not take the whole snapshot down.
 *
 * @param {string} id
 * @returns {object}
 */
export function readProfileProgress(id) {
  if (!id) return {};
  try {
    const raw = localStorage.getItem(PROFILE_KEY(id));
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
}

function _daysSince(iso) {
  const then = Date.parse(iso || '');
  return Number.isNaN(then) ? Infinity : (Date.now() - then) / 86_400_000;
}

/**
 * The misconceptions this child is currently showing.
 *
 * Stale entries are dropped on the same 14-day window `teacherFeedback`
 * uses, and the per-domain fallbacks are excluded: "a rule that has not
 * clicked yet" is what an unmatched wrong answer is *labelled*, not a
 * finding, and grouping children under it would be inventing a shared
 * problem out of the absence of a diagnosis.
 *
 * @param {object} progress
 * @returns {Array<{id: string, count: number}>}
 */
export function liveMisconceptions(progress) {
  const log = progress?.misconceptionLog;
  if (!log || typeof log !== 'object') return [];
  return Object.entries(log)
    .filter(([id, entry]) => {
      if (!entry || typeof entry !== 'object') return false;
      if (isFallbackMisconception(id) || !getMisconception(id)) return false;
      if ((entry.count || 0) < MIN_OCCURRENCES) return false;
      return _daysSince(entry.lastSeen) <= PATTERN_LOOKBACK_DAYS;
    })
    .map(([id, entry]) => ({ id, count: entry.count || 0 }))
    .sort((a, b) => b.count - a.count);
}

/**
 * The phonics stages this child has practised but not secured.
 *
 * Untouched stages are excluded on purpose: a child who has never met long
 * vowels is not "weak at long vowels", they are simply not there yet, and
 * grouping them with a child who has practised and struggled would send
 * both to the wrong lesson.
 *
 * @param {object} progress
 * @returns {Array<{group: string, mastery: number}>}
 */
export function weakGroups(progress) {
  const raw = progress?.groupMastery;
  if (!raw || typeof raw !== 'object') return [];
  const mastery = normalizeGroupMasteryMap(raw);
  return Object.entries(mastery)
    .filter(([group, score]) => typeof score === 'number' && score > 0 && score <= WEAK_MASTERY)
    .filter(([group]) => CURRICULUM.some((s) => s.group === group || s.id === group))
    .map(([group, score]) => ({ group, mastery: score }))
    .sort((a, b) => a.mastery - b.mastery);
}

/** Teacher-facing name for a phonics group. */
function _groupLabel(group) {
  const stage = CURRICULUM.find((s) => s.group === group || s.id === group);
  return stage?.name || VOWEL_LABELS[group] || group;
}

/** The mode a stage recommends first, for the "what to do" line. */
function _groupAction(group) {
  const stage = CURRICULUM.find((s) => s.group === group || s.id === group);
  return {
    target: stage?.recommendedModes?.[0] || 'blend',
    group: stage?.group || group,
  };
}

/**
 * Children grouped by what they need, not by how they are doing.
 *
 * Two kinds of finding, because they lead to two different lessons:
 *   - `misconception` — a named habit, with the rule that fixes it.
 *   - `phonics`       — a stage practised but not secured.
 *
 * Only findings shared by `MIN_GROUP_SIZE` children are returned. One child
 * with a problem is already covered by their own dashboard; the point here
 * is the lesson worth teaching once to several.
 *
 * @returns {{groups: Array<object>, childCount: number, generatedAt: string}}
 */
export function getClassSnapshot() {
  const profiles = getProfiles();
  /** @type {Map<string, {kind: string, key: string, children: object[], total: number}>} */
  const buckets = new Map();

  for (const profile of profiles) {
    if (!profile?.id) continue;
    const progress = readProfileProgress(profile.id);
    const child = { id: profile.id, name: profile.name, avatar: profile.avatar };

    for (const { id, count } of liveMisconceptions(progress)) {
      const key = `misconception:${id}`;
      if (!buckets.has(key)) {
        buckets.set(key, { kind: 'misconception', key: id, children: [], total: 0 });
      }
      const bucket = buckets.get(key);
      bucket.children.push({ ...child, count });
      bucket.total += count;
    }

    for (const { group, mastery } of weakGroups(progress)) {
      const key = `phonics:${group}`;
      if (!buckets.has(key)) {
        buckets.set(key, { kind: 'phonics', key: group, children: [], total: 0 });
      }
      const bucket = buckets.get(key);
      bucket.children.push({ ...child, mastery });
      bucket.total += 1;
    }
  }

  const groups = [...buckets.values()]
    .filter((b) => b.children.length >= MIN_GROUP_SIZE)
    .map((b) => (b.kind === 'misconception' ? _describeMisconception(b) : _describePhonicsGroup(b)))
    // Most children first — that is the lesson with the best return on ten
    // minutes. Ties break on how often it is happening.
    .sort((a, b) => b.children.length - a.children.length || b.total - a.total);

  return { groups, childCount: profiles.length, generatedAt: new Date().toISOString() };
}

function _describeMisconception(bucket) {
  const m = getMisconception(bucket.key);
  return {
    kind: 'misconception',
    key: bucket.key,
    title: m.label,
    childName: m.childName,
    detail: m.rule,
    example: m.example,
    // `cue` is written to be said out loud before the answer is revealed,
    // which is exactly what a small-group teacher needs in their hand.
    teach: m.cue,
    children: bucket.children,
    total: bucket.total,
    action: null,
  };
}

function _describePhonicsGroup(bucket) {
  const label = _groupLabel(bucket.key);
  return {
    kind: 'phonics',
    key: bucket.key,
    title: label,
    childName: label,
    detail: `Practised but not secure — all ${bucket.children.length} are under ${Math.round(
      WEAK_MASTERY * 100,
    )}%.`,
    example: '',
    teach: `Teach ${label} once to the group, then let each child practise it.`,
    children: bucket.children,
    total: bucket.total,
    action: _groupAction(bucket.key),
  };
}

/**
 * Whether the snapshot is worth showing at all.
 *
 * One child does not have a class, and their own dashboard already says
 * everything this would.
 */
export function hasClassToShow() {
  return getProfiles().length >= MIN_GROUP_SIZE;
}

export const __TEST__ = { WEAK_MASTERY, MIN_OCCURRENCES };
