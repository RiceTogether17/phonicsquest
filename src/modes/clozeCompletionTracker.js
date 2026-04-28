export function getUniqueClozeDone({ level, category, ccqCompletedByPassage, ccqCompleted, ccqCatCompleted }) {
  const byLevel = ccqCompletedByPassage?.[level] || {};
  const categoryMap = byLevel?.[category] || {};
  const unique = Object.keys(categoryMap).length;
  if (unique > 0) return unique;

  if (category) {
    return Number(ccqCatCompleted?.[`${level}-${category}`] || 0);
  }
  return Number(ccqCompleted?.[level] || 0);
}

export function recordClozeCompletion({ level, category, passageId, accuracy = 100, now = Date.now(), ccqCompletedByPassage = {}, ccqCompleted = {}, ccqCatCompleted = {} }) {
  const nextByPassage = structuredClone(ccqCompletedByPassage || {});
  if (!nextByPassage[level]) nextByPassage[level] = {};
  if (!nextByPassage[level][category]) nextByPassage[level][category] = {};

  const prev = nextByPassage[level][category][passageId];
  const isNew = !prev?.done;
  const bestAccuracy = Math.max(Number(prev?.bestAccuracy || 0), Number(accuracy || 0));

  nextByPassage[level][category][passageId] = {
    done: true,
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

export function getUniqueWordVaultDone({ category, level, wvqCompletedByPassage, wvqCompleted }) {
  const byCatLevel = wvqCompletedByPassage?.[category]?.[level] || {};
  const unique = Object.keys(byCatLevel).length;
  if (unique > 0) return unique;

  const legacy = wvqCompleted?.[category]?.[level];
  if (legacy === true || legacy?.done) return 1;
  return 0;
}

export function recordWordVaultCompletion({ category, level, passageId, stars = 1, accuracy = 100, now = Date.now(), wvqCompletedByPassage = {}, wvqCompleted = {} }) {
  const nextByPassage = structuredClone(wvqCompletedByPassage || {});
  if (!nextByPassage[category]) nextByPassage[category] = {};
  if (!nextByPassage[category][level]) nextByPassage[category][level] = {};

  nextByPassage[category][level][passageId] = {
    done: true,
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
