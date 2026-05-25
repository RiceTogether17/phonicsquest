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

