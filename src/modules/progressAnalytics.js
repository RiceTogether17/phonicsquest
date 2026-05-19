/**
 * PhonicsQuest — Progress analytics for the parent/teacher view.
 *
 * Pure functions over a stream of attempt records. Storage is provided
 * by callers (the journey controller persists to localStorage via the
 * `attemptLog` helper at the bottom of this file). Keeping the math
 * separate from the storage means we can swap localStorage for a
 * backend later without rewriting the analytics.
 *
 * Attempt shape:
 *   {
 *     timestamp:     number,    // ms since epoch
 *     stageId:       string,    // curriculum stage id, e.g. 'cvc-a'
 *     group:         string,    // word group key
 *     mode:          string,    // canonical mode key from PHONICS_MODES
 *     word:          string,    // word that was practised (lowercase)
 *     correct:       boolean,
 *     errorCategory: string|null,
 *     timeMs:        number,
 *     targetSound:   string|null,
 *   }
 *
 * The dashboard renders a `summarise(attempts, { curriculum })` result.
 * Every part of that result is also exported as a standalone helper so
 * tests can pin behaviour one slice at a time.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

/** Default config — overridable by the caller. */
const DEFAULTS = Object.freeze({
  topN:                5,
  historyDays:        14,
  masteryAccuracy:   0.80,
  masteryMinAttempts:   6,
});

// ── Helpers ──────────────────────────────────────────────────────────────

function _safeList(input) {
  return Array.isArray(input) ? input.filter(a => a && typeof a === 'object') : [];
}

function _startOfDay(ts) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function _isoDay(ts) {
  return new Date(_startOfDay(ts)).toISOString().slice(0, 10);
}

// ── Per-stage / per-mode rollups ────────────────────────────────────────

/**
 * Aggregate attempts into per-stage stats.
 *
 *   { [stageId]: { attempts, correct, accuracy, mastered, lastTimestamp } }
 *
 * `mastered` is true when `attempts >= masteryMinAttempts && accuracy >= masteryAccuracy`.
 */
export function getMasteryByStage(attempts, opts = {}) {
  const list = _safeList(attempts);
  const { masteryAccuracy, masteryMinAttempts } = { ...DEFAULTS, ...opts };
  const out = {};
  for (const a of list) {
    if (!a.stageId) continue;
    const row = out[a.stageId] ?? (out[a.stageId] = { attempts: 0, correct: 0, accuracy: 0, mastered: false, lastTimestamp: 0 });
    row.attempts++;
    if (a.correct) row.correct++;
    if (a.timestamp > row.lastTimestamp) row.lastTimestamp = a.timestamp;
  }
  for (const id of Object.keys(out)) {
    const r = out[id];
    r.accuracy = r.attempts > 0 ? r.correct / r.attempts : 0;
    r.mastered = r.attempts >= masteryMinAttempts && r.accuracy >= masteryAccuracy;
  }
  return out;
}

/**
 * Per-mode accuracy summary. Returns an object keyed by mode key.
 */
export function getAccuracyByMode(attempts) {
  const list = _safeList(attempts);
  const out = {};
  for (const a of list) {
    const key = a.mode || 'unknown';
    const row = out[key] ?? (out[key] = { attempts: 0, correct: 0, accuracy: 0 });
    row.attempts++;
    if (a.correct) row.correct++;
  }
  for (const k of Object.keys(out)) {
    const r = out[k];
    r.accuracy = r.attempts > 0 ? r.correct / r.attempts : 0;
  }
  return out;
}

/**
 * Sound-level accuracy. A "sound" is the stage's `targetSound` if present,
 * otherwise the stageId — gives us a meaningful label for the dashboard.
 */
function _byTargetSound(attempts) {
  const list = _safeList(attempts);
  const out = new Map();
  for (const a of list) {
    const key = a.targetSound || a.stageId;
    if (!key) continue;
    const row = out.get(key) ?? { sound: key, attempts: 0, correct: 0, accuracy: 0 };
    row.attempts++;
    if (a.correct) row.correct++;
    out.set(key, row);
  }
  for (const r of out.values()) r.accuracy = r.attempts > 0 ? r.correct / r.attempts : 0;
  return [...out.values()];
}

/**
 * Top N strongest sounds (highest accuracy, requiring at least 3 attempts
 * so a single lucky guess doesn't bubble to the top).
 */
export function getStrongestSounds(attempts, opts = {}) {
  const { topN } = { ...DEFAULTS, ...opts };
  return _byTargetSound(attempts)
    .filter(r => r.attempts >= 3)
    .sort((a, b) => b.accuracy - a.accuracy || b.attempts - a.attempts)
    .slice(0, topN);
}

/**
 * Top N weakest sounds (lowest accuracy, requiring at least 3 attempts).
 */
export function getWeakestSounds(attempts, opts = {}) {
  const { topN } = { ...DEFAULTS, ...opts };
  return _byTargetSound(attempts)
    .filter(r => r.attempts >= 3)
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts)
    .slice(0, topN);
}

// ── Errors over time ─────────────────────────────────────────────────────

/**
 * Common error categories sorted by frequency, descending.
 */
export function getCommonErrorTypes(attempts) {
  const list = _safeList(attempts).filter(a => a.correct === false && a.errorCategory);
  const counts = new Map();
  for (const a of list) {
    counts.set(a.errorCategory, (counts.get(a.errorCategory) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Attempts per day for the last N days, oldest first. Missing days are
 * still represented (count: 0) so a sparkline has a smooth axis.
 */
export function getAttemptsOverTime(attempts, opts = {}) {
  const { historyDays, now } = { ...DEFAULTS, now: Date.now(), ...opts };
  const list = _safeList(attempts);

  const buckets = new Map();
  const todayKey = _startOfDay(now);
  for (let i = historyDays - 1; i >= 0; i--) {
    const dayMs = todayKey - i * DAY_MS;
    buckets.set(_isoDay(dayMs), { date: _isoDay(dayMs), attempts: 0, correct: 0 });
  }
  for (const a of list) {
    if (typeof a.timestamp !== 'number') continue;
    const key = _isoDay(a.timestamp);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.attempts++;
    if (a.correct) bucket.correct++;
  }
  return [...buckets.values()];
}

// ── Phase / next-step ────────────────────────────────────────────────────

/**
 * The phase the learner is currently working in. Defined as the lowest
 * phase that still contains a stage which hasn't been mastered. If every
 * stage in the curriculum is mastered, returns the last phase number.
 */
export function getCurrentPhase(attempts, curriculum) {
  const list = curriculum ?? [];
  if (!list.length) return 1;
  const mastery = getMasteryByStage(attempts);
  for (const stage of list) {
    if (!mastery[stage.id]?.mastered) return stage.phase;
  }
  return list[list.length - 1].phase;
}

/**
 * The next stage the learner should practise. First unmastered stage in
 * curriculum order (we deliberately ignore the unlock gate here — the
 * dashboard is a recommendation, the unlock logic enforces ordering).
 */
export function getSuggestedNext(attempts, curriculum) {
  const list = curriculum ?? [];
  if (!list.length) return null;
  const mastery = getMasteryByStage(attempts);
  return list.find(s => !mastery[s.id]?.mastered) ?? list[list.length - 1];
}

/**
 * Mastery percentage across the whole curriculum (0–100).
 */
export function getMasteryPercent(attempts, curriculum) {
  const list = curriculum ?? [];
  if (!list.length) return 0;
  const mastery = getMasteryByStage(attempts);
  const mastered = list.filter(s => mastery[s.id]?.mastered).length;
  return Math.round((mastered / list.length) * 100);
}

// ── Printable practice list ──────────────────────────────────────────────

/**
 * Build a printable practice list — for every weakest stage, surface its
 * sample words and one decodable sentence. Default: top 3 weak stages.
 *
 * Returns:
 *   [
 *     { stage, sampleWords: [...], sentence: '...' },
 *     ...
 *   ]
 */
export function getPrintablePracticeList(attempts, curriculum, opts = {}) {
  const { topN = 3 } = opts;
  const list = curriculum ?? [];
  if (!list.length) return [];

  const mastery = getMasteryByStage(attempts);
  const ranked = list
    .filter(s => mastery[s.id]) // only include stages with attempts
    .map(s => ({ stage: s, accuracy: mastery[s.id].accuracy, attempts: mastery[s.id].attempts }))
    .sort((a, b) => a.accuracy - b.accuracy || b.attempts - a.attempts);

  // Fallback: if no attempts yet, use the first `topN` stages from the
  // curriculum so the print sheet is never empty.
  const picks = ranked.length ? ranked.slice(0, topN) : list.slice(0, topN).map(s => ({ stage: s, accuracy: 0, attempts: 0 }));

  return picks.map(({ stage }) => ({
    stage,
    sampleWords:   (stage.sampleWords ?? []).slice(0, 8),
    sentence:      (stage.sentenceExamples ?? [])[0] ?? '',
  }));
}

// ── One-shot summary ─────────────────────────────────────────────────────

/**
 * Roll everything up into one object the dashboard can render.
 */
export function summarise(attempts, { curriculum, now } = {}) {
  const safe = _safeList(attempts);
  const timeOpts = typeof now === 'number' ? { now } : {};
  return {
    totalAttempts:        safe.length,
    correctAttempts:      safe.filter(a => a.correct).length,
    currentPhase:         getCurrentPhase(safe, curriculum),
    masteryPercent:       getMasteryPercent(safe, curriculum),
    masteryByStage:       getMasteryByStage(safe),
    accuracyByMode:       getAccuracyByMode(safe),
    strongestSounds:      getStrongestSounds(safe),
    weakestSounds:        getWeakestSounds(safe),
    commonErrorTypes:     getCommonErrorTypes(safe),
    attemptsOverTime:     getAttemptsOverTime(safe, timeOpts),
    suggestedNext:        getSuggestedNext(safe, curriculum),
    printablePracticeList: getPrintablePracticeList(safe, curriculum),
  };
}

// ── Storage wrapper ──────────────────────────────────────────────────────

const STORAGE_KEY = 'phonicsquest_attempts';
export const DEFAULT_MAX_ATTEMPTS_STORED = 5000;

/**
 * A thin localStorage-backed log. Pass `storage` for tests; defaults to
 * the global `localStorage` when available. `maxStored` caps the on-disk
 * log so the localStorage quota doesn't explode after months of use.
 */
export function attemptLog(
  storage = (typeof localStorage !== 'undefined' ? localStorage : null),
  { maxStored = DEFAULT_MAX_ATTEMPTS_STORED } = {},
) {
  function _read() {
    if (!storage) return [];
    try {
      const raw = storage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }
  function _write(list) {
    if (!storage) return;
    try { storage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch {}
  }
  return {
    list() { return _read(); },
    push(attempt) {
      const list = _read();
      list.push({ timestamp: Date.now(), correct: false, ...attempt });
      if (list.length > maxStored) list.splice(0, list.length - maxStored);
      _write(list);
      return list[list.length - 1];
    },
    clear() { _write([]); },
  };
}
