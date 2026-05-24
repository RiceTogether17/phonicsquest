/**
 * PhonicsQuest – Phonics Progression Helpers
 *
 * Extends Blend It!'s stage-picker model to every phonics mode (oral blend,
 * first/last/middle sound, sound count, hear & choose, missing sound,
 * segment, plus blend itself). The picker UI lives in app.js — this module
 * just answers the questions "which stages should mode X surface?" and
 * "how mastered is this phase for this skill?" so the UI can render
 * progress consistently across all of them.
 *
 * Pure. No DOM, no store reads — every input is passed in so tests can
 * drive every code path with fixtures.
 */

/**
 * Stages where `mode` belongs, in curriculum order.
 * A stage is included if the phase it belongs to lists `mode` in its
 * `recommendedModes` array (the source of truth in PHASES). When a mode
 * has no recommendations at all we fall back to all stages — a kind
 * mistake-tolerant default so new modes never produce an empty picker.
 *
 * @param {string} mode               mode key, e.g. 'first', 'segment'
 * @param {Array<{ id:string, group:string, phase:number }>} curriculum
 * @param {Array<{ phase:number, recommendedModes?:string[] }>} phases
 * @returns {Array<typeof curriculum[number]>}
 */
export function getStagesForMode(mode, curriculum, phases) {
  if (!Array.isArray(curriculum) || curriculum.length === 0) return [];
  if (!mode) return [...curriculum];
  const allowedPhases = new Set();
  let anyRecommendsThisMode = false;
  for (const p of phases || []) {
    if (Array.isArray(p?.recommendedModes) && p.recommendedModes.length > 0) {
      anyRecommendsThisMode ||= p.recommendedModes.includes(mode);
      if (p.recommendedModes.includes(mode)) allowedPhases.add(p.phase);
    }
  }
  // Mode isn't named anywhere → fall back to the full curriculum rather
  // than render an empty picker (e.g. new experimental modes).
  if (!anyRecommendsThisMode) return [...curriculum];
  return curriculum.filter(stage => allowedPhases.has(stage.phase));
}

/**
 * Roll stages up by phase. Returns an ordered list of
 * `{ phase, stages }` groups so the UI can render phase headers above
 * stage cards without doing its own bookkeeping.
 *
 * @param {Array<{ phase:number }>} stages
 * @returns {Array<{ phase:number, stages: typeof stages }>}
 */
export function groupStagesByPhase(stages) {
  if (!Array.isArray(stages) || stages.length === 0) return [];
  const byPhase = new Map();
  for (const s of stages) {
    if (!byPhase.has(s.phase)) byPhase.set(s.phase, []);
    byPhase.get(s.phase).push(s);
  }
  return Array.from(byPhase.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([phase, list]) => ({ phase, stages: list }));
}

/**
 * Summarise mastery for one phase. Counts how many stages are at or above
 * the `masteredAt` threshold (default 0.8 matching DEFAULT_MASTERY_CRITERIA)
 * and computes the phase's average mastery.
 *
 * @param {Array<{ group:string }>} stages — the stages in the phase
 * @param {Record<string, number>} groupMastery — store.get('groupMastery')
 * @param {{ masteredAt?: number }} [opts]
 * @returns {{ stagesMastered:number, total:number, pct:number, avgPct:number }}
 */
export function summarisePhaseMastery(stages, groupMastery, opts = {}) {
  const masteredAt = typeof opts.masteredAt === 'number' ? opts.masteredAt : 0.8;
  const total = Array.isArray(stages) ? stages.length : 0;
  if (total === 0) return { stagesMastered: 0, total: 0, pct: 0, avgPct: 0 };

  let stagesMastered = 0;
  let masterySum = 0;
  for (const stage of stages) {
    const m = (groupMastery && typeof groupMastery[stage.group] === 'number')
      ? groupMastery[stage.group]
      : 0;
    masterySum += m;
    if (m >= masteredAt) stagesMastered += 1;
  }
  return {
    stagesMastered,
    total,
    pct: Math.round((stagesMastered / total) * 100),
    avgPct: Math.round((masterySum / total) * 100),
  };
}

/**
 * Pick the "Next" recommended stage for a given mode. Strategy:
 *   1. The first stage (in curriculum order) whose mastery < `masteredAt`
 *   2. If every stage is mastered, the very last stage (so the child
 *      can still pick something to celebrate)
 *
 * @param {Array<{ group:string }>} stages
 * @param {Record<string, number>} groupMastery
 * @param {{ masteredAt?: number }} [opts]
 * @returns {object|null}
 */
export function recommendStageForMode(stages, groupMastery, opts = {}) {
  if (!Array.isArray(stages) || stages.length === 0) return null;
  const masteredAt = typeof opts.masteredAt === 'number' ? opts.masteredAt : 0.8;
  for (const stage of stages) {
    const m = (groupMastery && typeof groupMastery[stage.group] === 'number')
      ? groupMastery[stage.group]
      : 0;
    if (m < masteredAt) return stage;
  }
  return stages[stages.length - 1];
}
