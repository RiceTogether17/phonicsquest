/**
 * PhonicsQuest – Story band readiness (soft gating)
 *
 * Maps the child's phonics-phase progress onto the four story bands so the
 * story library can recommend the right band instead of presenting all four
 * as equals. This is deliberately SOFT gating: a band that isn't ready yet
 * is marked "best after …" but stays tappable — a parent reading along can
 * always open it.
 *
 * Band → phonics readiness:
 *   A  Core Decodable Minis   — short vowels (Phase 1). Always open.
 *   B  Decodable Story Readers — long-vowel patterns (Phase 6).
 *   C  Fluency Readers         — r-controlled + digraphs (Phases 4/8).
 *   D  Bridge Readers          — diphthongs (Phase 7).
 */

import { store } from './store.js';
import { CURRICULUM } from '../data/curriculum.js';

/** Fraction of a phase-range's stages mastered (mastery ≥ 0.8). */
function _masteredFraction(phases) {
  const gm = store.get('groupMastery') || {};
  const stages = CURRICULUM.filter((s) => phases.includes(s.phase));
  if (!stages.length) return 0;
  const mastered = stages.filter((s) => (gm[s.group] ?? 0) >= 0.8).length;
  return mastered / stages.length;
}

/** True when any stage in the given phases has been practised at all. */
function _phaseTouched(phases) {
  const gm = store.get('groupMastery') || {};
  return CURRICULUM.some(
    (s) => phases.includes(s.phase) && typeof gm[s.group] === 'number' && gm[s.group] > 0,
  );
}

/**
 * Readiness per story band.
 * @returns {Record<'A'|'B'|'C'|'D', {ready: boolean, hint: string}>}
 */
export function getBandReadiness() {
  const earlyMastered = _masteredFraction([1, 2, 3, 4, 5]);
  const longVowelsStarted = _phaseTouched([6]);
  const longVowelsSolid = _masteredFraction([6]) >= 0.5;
  const rControlledStarted = _phaseTouched([8]);
  const diphthongsStarted = _phaseTouched([7]);

  const bReady = earlyMastered >= 0.6 || longVowelsStarted;
  const cReady = bReady && (longVowelsSolid || rControlledStarted);
  const dReady = cReady && diphthongsStarted;

  return {
    A: { ready: true, hint: '' },
    B: { ready: bReady, hint: bReady ? '' : 'Best after starting Phase 6 — Long Vowels' },
    C: { ready: cReady, hint: cReady ? '' : 'Best after Phase 6 and Bossy-R practice' },
    D: { ready: dReady, hint: dReady ? '' : 'Best after starting Phase 7 — Diphthongs' },
  };
}

/** First band that is ready but not yet finished — the recommended shelf. */
export function getRecommendedBand(readStoryIds, storiesByBand) {
  const readiness = getBandReadiness();
  for (const band of ['A', 'B', 'C', 'D']) {
    if (!readiness[band].ready) break;
    const stories = storiesByBand?.[band] || [];
    const unread = stories.some((s) => !readStoryIds?.includes(s.id));
    if (unread || !stories.length) return band;
  }
  return 'A';
}
