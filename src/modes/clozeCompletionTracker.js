import { countCoveredSeeds } from '../data/practiceSeeds.js';

/**
 * How much of a scope a child has actually covered.
 *
 * Audit 2026-09-19, finding 12. This used to count completion records, and a
 * completion record is one passage. But P1 Articles holds 27 passages built
 * from four authored bodies, so a child who finished four of them could be
 * shown "4 / 27 done" having met every distinct passage in the topic, or
 * "4 / 27 done" having met one passage four times. The screen could not tell
 * the difference and neither could a parent reading it.
 *
 * Coverage is now counted in seeds. Pass `seedIndex` (from
 * `seedIdIndex(scopeItems)`) so records written before seeds existed can still
 * be resolved.
 *
 * With no per-passage map at all — an install that last played before that key
 * existed — the legacy counters are all there is. They count passages, and
 * seeds are never more numerous than passages, so the caller's `Math.min`
 * against the seed total is the closest honest reading available.
 */
export function getUniqueClozeDone({
  level,
  category,
  ccqCompletedByPassage,
  ccqCompleted,
  ccqCatCompleted,
  seedIndex,
}) {
  const byLevel = ccqCompletedByPassage?.[level] || {};

  if (category) {
    const categoryMap = byLevel?.[category] || {};
    if (Object.keys(categoryMap).length > 0) return countCoveredSeeds(categoryMap, seedIndex);
    return Number(ccqCatCompleted?.[`${level}-${category}`] || 0);
  }

  // Level view: seeds are unique within a category, so summing per category
  // is the same as counting across the level, without needing one index that
  // spans every category.
  const categories = Object.values(byLevel);
  if (categories.length) {
    return categories.reduce((sum, map) => sum + countCoveredSeeds(map, seedIndex), 0);
  }
  return Number(ccqCompleted?.[level] || 0);
}

export function recordClozeCompletion({
  level,
  category,
  passageId,
  seedId,
  accuracy = 100,
  now = Date.now(),
  ccqCompletedByPassage = {},
  ccqCompleted = {},
  ccqCatCompleted = {},
}) {
  const nextByPassage = structuredClone(ccqCompletedByPassage || {});
  if (!nextByPassage[level]) nextByPassage[level] = {};
  if (!nextByPassage[level][category]) nextByPassage[level][category] = {};

  const prev = nextByPassage[level][category][passageId];
  const isNew = !prev?.done;
  const bestAccuracy = Math.max(Number(prev?.bestAccuracy || 0), Number(accuracy || 0));

  nextByPassage[level][category][passageId] = {
    done: true,
    // The authored passage this one re-presents, so coverage stays countable
    // even if the bank is later regenerated with different variant ids.
    seedId: String(seedId || prev?.seedId || passageId),
    bestAccuracy,
    lastCompletedAt: now,
  };

  const nextCompleted = { ...(ccqCompleted || {}) };
  const nextCatCompleted = { ...(ccqCatCompleted || {}) };
  if (isNew) {
    nextCompleted[level] = Number(nextCompleted[level] || 0) + 1;
    const catKey = `${level}-${category}`;
    nextCatCompleted[catKey] = Number(nextCatCompleted[catKey] || 0) + 1;
  }

  return { nextByPassage, nextCompleted, nextCatCompleted, isNew };
}

export function getUniqueWordVaultDone({
  category,
  level,
  wvqCompletedByPassage,
  wvqCompleted,
  seedIndex,
}) {
  const byCatLevel = wvqCompletedByPassage?.[category]?.[level] || {};
  if (Object.keys(byCatLevel).length > 0) return countCoveredSeeds(byCatLevel, seedIndex);

  const legacy = wvqCompleted?.[category]?.[level];
  if (legacy === true || legacy?.done) return 1;
  return 0;
}

export function recordWordVaultCompletion({
  category,
  level,
  passageId,
  seedId,
  stars = 1,
  accuracy = 100,
  now = Date.now(),
  wvqCompletedByPassage = {},
  wvqCompleted = {},
}) {
  const nextByPassage = structuredClone(wvqCompletedByPassage || {});
  if (!nextByPassage[category]) nextByPassage[category] = {};
  if (!nextByPassage[category][level]) nextByPassage[category][level] = {};

  const prev = nextByPassage[category][level][passageId];
  nextByPassage[category][level][passageId] = {
    done: true,
    seedId: String(seedId || prev?.seedId || passageId),
    stars,
    accuracy,
    lastCompletedAt: now,
  };

  const nextCompleted = { ...(wvqCompleted || {}) };
  if (!nextCompleted[category]) nextCompleted[category] = {};
  const prevLevel = nextCompleted[category][level];
  const prevStars = typeof prevLevel === 'object' ? Number(prevLevel.stars || 1) : 1;
  nextCompleted[category][level] = { done: true, stars: Math.max(prevStars, stars) };

  return { nextByPassage, nextCompleted };
}

function _upsertWeakSkillBucket(current, level, skill, wasWrong, now) {
  const next = structuredClone(current || {});
  if (!next[level]) next[level] = {};
  const prev = next[level][skill] || { attempts: 0, wrong: 0, lastSeenAt: 0 };
  next[level][skill] = {
    attempts: prev.attempts + 1,
    wrong: prev.wrong + (wasWrong ? 1 : 0),
    lastSeenAt: now,
  };
  return next;
}

export function recordWeakSkills({
  storageKey,
  level,
  skills = [],
  wrongSkillSet = new Set(),
  now = Date.now(),
  current = {},
}) {
  let next = structuredClone(current || {});
  skills.forEach((skill) => {
    next = _upsertWeakSkillBucket(next, level, skill, wrongSkillSet.has(skill), now);
  });
  return next;
}

export function getTopWeakSkills({ level, weakSkillsMap = {}, limit = 3 }) {
  const entries = Object.entries(weakSkillsMap?.[level] || {});
  return entries
    .map(([skill, stats]) => ({
      skill,
      attempts: Number(stats.attempts || 0),
      wrong: Number(stats.wrong || 0),
    }))
    .sort(
      (a, b) =>
        b.wrong / Math.max(1, b.attempts) - a.wrong / Math.max(1, a.attempts) || b.wrong - a.wrong,
    )
    .slice(0, limit);
}
