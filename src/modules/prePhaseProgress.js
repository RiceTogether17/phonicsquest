/**
 * PhonicsQuest – Pre-phase progress (Step 0a Phonemic Awareness, Step 0b
 * Letter Sounds).
 *
 * The numeric phonics phases 1–10 derive progress from group mastery over
 * the word bank. The two pre-phases have no word groups of their own, so
 * their progress is derived from the signals the app already records:
 *
 *   0a Phonemic Awareness — per-skill attempt stats for the oralBlend and
 *      segmenting skill bins (recorded by progress.recordAttempt for the
 *      PA modes), topped up by the placement screener's
 *      phonemic-awareness stage score when a placement exists.
 *
 *   0b Letter Sounds — the placement screener's letter-sounds stage score,
 *      topped up by decoding-skill accuracy on level-1 words (the first
 *      print work a child does after learning letter sounds).
 *
 * Both return { status, pct } in the same shape curriculumMap uses for
 * numeric phases, so pre-phase cards render identically.
 */

import { store } from './store.js';
import { MASTERY_THRESHOLD, MIN_ATTEMPTS_FOR_MASTERY } from '../data/curriculum.js';

/** Aggregate accuracy + attempts for a set of skill bins from wordSkillStats. */
function _skillAccuracy(skills) {
  const stats = store.get('wordSkillStats') || {};
  let attempts = 0;
  let correct = 0;
  for (const perWord of Object.values(stats)) {
    for (const skill of skills) {
      const s = perWord?.[skill];
      if (!s) continue;
      attempts += s.attempts || 0;
      correct += s.correct || 0;
    }
  }
  return { attempts, accuracy: attempts ? correct / attempts : 0 };
}

/** Placement stage score (0–1) if a placement result recorded one. */
function _placementStageScore(stageKey) {
  const placement = store.get('placementProfile');
  const composite = placement?.stageScores?.[stageKey]?.composite;
  return typeof composite === 'number' ? composite : null;
}

function _toStatus(pct, hasSignal) {
  if (!hasSignal) return 'locked';
  if (pct >= Math.round(MASTERY_THRESHOLD * 100)) return 'complete';
  return 'in-progress';
}

/** Progress for Step 0a — Phonemic Awareness. @returns {{status:string,pct:number}} */
export function getPaProgress() {
  const { attempts, accuracy } = _skillAccuracy(['oralBlend', 'segmenting']);
  const placementScore = _placementStageScore('phonemicAwareness');

  // Practice evidence needs a minimum sample before it means anything.
  const practicePct = attempts >= MIN_ATTEMPTS_FOR_MASTERY ? Math.round(accuracy * 100) : null;
  const placementPct = placementScore !== null ? Math.round(placementScore * 100) : null;

  const pct = Math.max(practicePct ?? 0, placementPct ?? 0);
  return { status: _toStatus(pct, practicePct !== null || placementPct !== null), pct };
}

/** Progress for Step 0b — Letter Sounds. @returns {{status:string,pct:number}} */
export function getLetterSoundProgress() {
  const placementScore = _placementStageScore('letterSounds');
  const { attempts, accuracy } = _skillAccuracy(['decoding']);

  const placementPct = placementScore !== null ? Math.round(placementScore * 100) : null;
  const practicePct = attempts >= MIN_ATTEMPTS_FOR_MASTERY ? Math.round(accuracy * 100) : null;

  const pct = Math.max(placementPct ?? 0, practicePct ?? 0);
  return { status: _toStatus(pct, placementPct !== null || practicePct !== null), pct };
}

/** Progress for a pre-phase by key ('0a' | '0b'). */
export function getPrePhaseProgress(key) {
  return key === '0a' ? getPaProgress() : getLetterSoundProgress();
}
