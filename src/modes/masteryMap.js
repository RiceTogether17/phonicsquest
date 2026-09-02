import { getSkillLabel, normaliseSkillTag } from './examTrainingFramework.js';

const RECENT_LIMIT = 5;

function _ensure(obj, key, fallback) {
  if (!obj[key]) obj[key] = fallback;
  return obj[key];
}

function _bumpCounter(target, wasWrong) {
  target.attempts = Number(target.attempts || 0) + 1;
  target.wrong = Number(target.wrong || 0) + (wasWrong ? 1 : 0);
}

/**
 * Record a per-blank attempt into the diagnostic mastery map.
 *
 * Storage shape (added alongside existing ccqWeakSkills / wvWeakSkills):
 *   masteryMap[mode][level][skill] = {
 *     attempts, wrong, lastSeenAt,
 *     byCategory: { [cat]: { attempts, wrong } },
 *     byClueType: { [clueType]: { attempts, wrong } },
 *     recentExamples: [{ passageId, blankIndex, chosen, correct, clueType, at }] (cap RECENT_LIMIT)
 *   }
 *
 * Returns the new map; the caller persists via store.set('masteryMap', ...).
 */
export function recordMasteryAttempt({
  mode,
  level,
  category = 'mixed',
  skill,
  clueType = '',
  wasWrong = false,
  example = null,
  now = Date.now(),
  current = {},
} = {}) {
  if (!mode || !level || !skill) return current;
  const next = structuredClone(current || {});
  const modeBucket = _ensure(next, mode, {});
  const levelBucket = _ensure(modeBucket, level, {});
  const skillTag = normaliseSkillTag(skill);
  const skillBucket = _ensure(levelBucket, skillTag, {
    attempts: 0,
    wrong: 0,
    lastSeenAt: 0,
    byCategory: {},
    byClueType: {},
    recentExamples: [],
  });

  _bumpCounter(skillBucket, wasWrong);
  skillBucket.lastSeenAt = now;

  const catBucket = _ensure(skillBucket.byCategory, category, { attempts: 0, wrong: 0 });
  _bumpCounter(catBucket, wasWrong);

  if (clueType) {
    const cluBucket = _ensure(skillBucket.byClueType, clueType, { attempts: 0, wrong: 0 });
    _bumpCounter(cluBucket, wasWrong);
  }

  if (wasWrong && example) {
    const safeExample = {
      passageId: String(example.passageId ?? ''),
      blankIndex: Number(example.blankIndex ?? 0),
      chosen: String(example.chosen ?? ''),
      correct: String(example.correct ?? ''),
      clueType: String(example.clueType ?? clueType ?? ''),
      at: Number(example.at ?? now),
    };
    skillBucket.recentExamples = [safeExample, ...(skillBucket.recentExamples || [])].slice(
      0,
      RECENT_LIMIT,
    );
  }

  return next;
}

function _entryAccuracy(entry) {
  const a = Number(entry.attempts || 0);
  const w = Number(entry.wrong || 0);
  return a > 0 ? Math.round(((a - w) / a) * 100) : 100;
}

/**
 * Return the weakest N skills for the given mode + level, sorted by error
 * rate (then absolute wrong count). Each entry includes a label, accuracy,
 * the last wrong example (if any) and a shortlist of cause clue types.
 */
export function getTopMasteryGaps({ mode, level, masteryMap = {}, limit = 3 } = {}) {
  if (!mode || !level) return [];
  const bucket = masteryMap?.[mode]?.[level] || {};
  return Object.entries(bucket)
    .map(([skill, entry]) => {
      const attempts = Number(entry.attempts || 0);
      const wrong = Number(entry.wrong || 0);
      const errorRate = attempts > 0 ? wrong / attempts : 0;
      return {
        skill,
        skillLabel: getSkillLabel(skill),
        attempts,
        wrong,
        accuracy: _entryAccuracy(entry),
        errorRate,
        lastSeenAt: Number(entry.lastSeenAt || 0),
        topClueTypes: Object.entries(entry.byClueType || {})
          .sort((a, b) => Number(b[1]?.wrong || 0) - Number(a[1]?.wrong || 0))
          .slice(0, 2)
          .map(([clueType]) => clueType),
        lastExample: (entry.recentExamples || [])[0] || null,
      };
    })
    .filter((row) => row.attempts > 0)
    .sort((a, b) => b.errorRate - a.errorRate || b.wrong - a.wrong)
    .slice(0, limit);
}

/**
 * Short, child-friendly recommendation for a single mastery gap.
 */
export function summariseMasteryGap(entry = {}) {
  const label = entry.skillLabel || getSkillLabel(entry.skill || 'sentenceLogic');
  if (!entry.attempts) return `Try one ${label.toLowerCase()} passage to start tracking.`;
  if (entry.accuracy >= 80)
    return `Almost mastered — keep ${label.toLowerCase()} sharp with one more passage.`;
  if (entry.accuracy >= 50) return `Practise ${label.toLowerCase()} with the scan task on.`;
  return `Drill ${label.toLowerCase()} slowly — read the clue twice before answering.`;
}
