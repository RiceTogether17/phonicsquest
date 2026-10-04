/**
 * PhonicsQuest – Story band readiness (soft gating)
 *
 * Maps the child's phonics-phase progress onto the five story bands so the
 * story library can recommend the right band instead of presenting all four
 * as equals. This is deliberately SOFT gating: a band that isn't ready yet
 * is marked "best after …" but stays tappable — a parent reading along can
 * always open it.
 *
 * Band → phonics readiness:
 *   A  Core Decodable Minis   — short vowels (Phase 1). Always open.
 *   B  Decodable Story Readers — long-vowel patterns (Phase 6).
 *   C  Fluency Readers         — r-controlled + digraphs (Phases 4/7).
 *   D  Bridge Readers          — diphthongs (Phase 8).
 *   E  Longer Reads            — suffixes and longer words (Phase 9).
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

/** True when any of the named stages has been practised at all. */
function _stagesTouched(ids) {
  const gm = store.get('groupMastery') || {};
  return CURRICULUM.some(
    (s) => ids.includes(s.id) && typeof gm[s.group] === 'number' && gm[s.group] > 0,
  );
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
 * @returns {Record<'A'|'B'|'C'|'D'|'E', {ready: boolean, hint: string}>}
 */
export function getBandReadiness() {
  const earlyMastered = _masteredFraction([1, 2, 3, 4, 5]);
  const longVowelsStarted = _phaseTouched([6]);
  // By stage, not phase: phase 7 also holds the blends review and tch/dge,
  // which say nothing about whether Bossy R has been taught.
  const rControlledStarted = _stagesTouched(['rc-ar-or', 'rc-er-ir-ur']);
  const diphthongsStarted = _stagesTouched(['dip-oi', 'dip-ou', 'dip-aw']);
  // Band E is length and longer words, which phases 9 (suffixes) and 10
  // (multisyllable words) teach.
  const longWordsStarted = _phaseTouched([9, 10]);

  // Band C is the Bossy-R band: its stories are written in ar, or, er, ir
  // and ur. It used to open on solid long vowels alone, before Bossy R had
  // been taught, so a child was recommended stories full of "farm" and
  // "bird" they had never been shown how to read. Band D's code includes
  // Bossy R too (story tiers are cumulative), so it needs both — which is
  // also the order the curriculum now teaches them in (phase 7, then 8).
  const bReady = earlyMastered >= 0.6 || longVowelsStarted;
  const cReady = bReady && rControlledStarted;
  const dReady = cReady && diphthongsStarted;
  const eReady = dReady && longWordsStarted;

  return {
    A: { ready: true, hint: '' },
    B: { ready: bReady, hint: bReady ? '' : 'Best after starting Phase 6 — Long Vowels' },
    C: { ready: cReady, hint: cReady ? '' : 'Best after starting Phase 7 — Bossy R (ar, or, er)' },
    D: { ready: dReady, hint: dReady ? '' : 'Best after starting Phase 8 — Diphthongs' },
    E: { ready: eReady, hint: eReady ? '' : 'Best after starting Phase 9 — Suffixes' },
  };
}

/** First band that is ready but not yet finished — the recommended shelf. */
export function getRecommendedBand(readStoryIds, storiesByBand) {
  const readiness = getBandReadiness();
  for (const band of ['A', 'B', 'C', 'D', 'E']) {
    if (!readiness[band].ready) break;
    const stories = storiesByBand?.[band] || [];
    const unread = stories.some((s) => !readStoryIds?.includes(s.id));
    if (unread || !stories.length) return band;
  }
  return 'A';
}
