/**
 * writingNarrativeHelpers.js
 *
 * Focused helper functions for narrative composition analysis.
 * Used by writingEvaluator.js to provide richer narrative quality signals
 * without bloating the main evaluator module.
 *
 * All functions are deterministic and lightweight — no NLP libraries.
 *
 * Audit 2026-09-19, finding 19 names `writingEvaluator.js`, but these scores
 * feed straight into it and carried the same defect: every list below was
 * matched with `includes`, so "froze" was credited from "frozen", "found"
 * from "foundation" and "day" from "Sunday". Matching is on word boundaries
 * now — see `textMatch.js` for why, and for the choice not to stem.
 */

import { containsPhrase, countPhrases, phraseIndex } from './textMatch.js';

// ── Climax Detection ────────────────────────────────────────────────────────

const CLIMAX_MARKERS = [
  'suddenly',
  'all at once',
  'just then',
  'without warning',
  'at that moment',
  'in a flash',
  'before i knew it',
  'out of nowhere',
];

const TENSION_VERBS = [
  'gasped',
  'screamed',
  'shouted',
  'froze',
  'stumbled',
  'crashed',
  'slammed',
  'burst',
  'grabbed',
  'yanked',
  'sprinted',
  'leaped',
  'dove',
  'scrambled',
  'jolted',
  'lurched',
];

const TENSION_PHRASES = [
  'heart pounded',
  'heart raced',
  'hands trembled',
  'blood ran cold',
  "couldn't believe",
  'eyes widened',
  'held my breath',
  'pulse quickened',
];

/**
 * Score the presence and quality of a climax moment.
 * Returns 0..1 where higher = stronger climax signal.
 */
export function scoreClimaxPresence(lower) {
  const markerHits = countPhrases(lower, CLIMAX_MARKERS);
  const verbHits = countPhrases(lower, TENSION_VERBS);
  const phraseHits = countPhrases(lower, TENSION_PHRASES);

  // A real climax needs a marker + at least some tension language
  const markerScore = Math.min(markerHits, 2) * 0.3;
  const tensionScore = Math.min(verbHits + phraseHits, 3) * 0.13;
  return Math.min(markerScore + tensionScore, 1);
}

// ── Resolution Detection ────────────────────────────────────────────────────

const RESOLUTION_MARKERS = [
  'in the end',
  'finally',
  'at last',
  'eventually',
  'after all',
  'everything was',
  'things returned',
  'it turned out',
  'we managed',
];

const RESOLUTION_ACTIONS = [
  'solved',
  'fixed',
  'saved',
  'found',
  'returned',
  'helped',
  'repaired',
  'calmed',
  'settled',
  'resolved',
  'recovered',
];

/**
 * Score the presence and quality of a resolution.
 * Returns 0..1.
 */
export function scoreResolutionPresence(lower) {
  const markerHits = countPhrases(lower, RESOLUTION_MARKERS);
  const actionHits = countPhrases(lower, RESOLUTION_ACTIONS);

  const markerScore = Math.min(markerHits, 2) * 0.35;
  const actionScore = Math.min(actionHits, 2) * 0.15;
  return Math.min(markerScore + actionScore, 1);
}

// ── Reflection / Lesson Ending Detection ────────────────────────────────────

const REFLECTION_MARKERS = [
  'i learned',
  'i realised',
  'i realized',
  'next time',
  'i promised',
  'i understood',
  'i decided',
  'from that day',
  'i knew then',
  'that day i',
  'looking back',
  'i will never forget',
  'i would always remember',
  'it taught me',
];

/**
 * Score whether the text ends with genuine reflection.
 * Checks both marker presence and position (should be near the end).
 */
export function scoreReflectionEnding(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const totalWords = words.length;
  if (totalWords < 5) return 0;

  // Check if any reflection marker appears in the final 40% of the text
  const lastPortionStart = Math.floor(totalWords * 0.6);
  const lastPortion = words.slice(lastPortionStart).join(' ');

  const markerInEnd = countPhrases(lastPortion, REFLECTION_MARKERS);
  const markerAnywhere = countPhrases(lower, REFLECTION_MARKERS);

  // Reward markers near end more than markers at start
  if (markerInEnd > 0) return Math.min(0.5 + markerInEnd * 0.25, 1);
  if (markerAnywhere > 0) return 0.3;
  return 0;
}

// ── Purposeful Dialogue Detection ───────────────────────────────────────────

const DIALOGUE_PURPOSE_PATTERNS = [
  // Decision-making
  /[""\u201c][^""\u201d]*\b(let's|we should|we must|we need to|we can|come on|hurry|quick)\b/i,
  // Problem-solving
  /[""\u201c][^""\u201d]*\b(help|try|plan|careful|watch out|look out|idea|think)\b/i,
  // Emotional revelation
  /[""\u201c][^""\u201d]*\b(sorry|thank you|forgive|promise|afraid|worried)\b/i,
  // Conflict
  /[""\u201c][^""\u201d]*\b(stop|don't|wait|no way|impossible|why did you)\b/i,
];

const WEAK_DIALOGUE_PATTERNS = [
  /[""\u201c]\s*(hi|hello|hey|ok|okay|yes|no|bye|nice|cool|good)\s*[,.!?]?\s*[""\u201d]/i,
];

/**
 * Score dialogue purposefulness: does it advance plot, reveal character,
 * or create conflict? Returns 0..1.
 */
export function scoreDialoguePurpose(text) {
  const hasDialogue =
    /[""\u201c\u201d\u2018\u2019]/.test(text) &&
    /\b(said|asked|replied|whispered|shouted|explained|muttered|cried)\b/i.test(text);
  if (!hasDialogue) return 0;

  const purposeHits = DIALOGUE_PURPOSE_PATTERNS.filter((p) => p.test(text)).length;
  const weakHits = WEAK_DIALOGUE_PATTERNS.filter((p) => p.test(text)).length;

  // Purposeful dialogue scores higher; weak-only dialogue scores low
  if (purposeHits >= 2) return 1.0;
  if (purposeHits === 1 && weakHits <= 1) return 0.7;
  if (purposeHits === 1) return 0.5;
  if (weakHits > 0 && purposeHits === 0) return 0.2;
  return 0.35; // has dialogue with tags but no clear purpose signals
}

// ── Narrative Arc Completeness ──────────────────────────────────────────────

/**
 * Score overall narrative arc completeness by checking whether the text
 * contains signals for setup, buildup, climax, and resolution in
 * approximately the expected order.
 *
 * Returns 0..1.
 */
export function scoreNarrativeArc(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const len = words.length;
  if (len < 10) return 0;

  // Divide text into quarters
  const q1 = words.slice(0, Math.floor(len * 0.25)).join(' ');
  const q2 = words.slice(Math.floor(len * 0.25), Math.floor(len * 0.5)).join(' ');
  const q3 = words.slice(Math.floor(len * 0.5), Math.floor(len * 0.75)).join(' ');
  const q4 = words.slice(Math.floor(len * 0.75)).join(' ');

  // Setup signals (setting, character intro) — expected in first half
  const setupWords = [
    'the',
    'was',
    'were',
    'morning',
    'day',
    'room',
    'school',
    'house',
    'walked',
    'sat',
  ];
  const hasSetup = countPhrases(q1, setupWords) >= 2 || q1.split(/[.!?]/).length >= 2;

  // Rising action — some tension or action in middle quarters
  const risingWords = [
    'but',
    'however',
    'although',
    'worried',
    'noticed',
    'strange',
    'heard',
    'saw',
  ];
  const hasRising = risingWords.some((w) => containsPhrase(q2, w) || containsPhrase(q3, w));

  // Climax — tension peak in second half
  const hasClimax = CLIMAX_MARKERS.some((m) => containsPhrase(q3, m) || containsPhrase(q2, m));

  // Resolution — in final quarter
  const hasResolution = RESOLUTION_MARKERS.some(
    (m) => containsPhrase(q4, m) || containsPhrase(q3, m),
  );

  let score = 0;
  if (hasSetup) score += 0.25;
  if (hasRising) score += 0.25;
  if (hasClimax) score += 0.25;
  if (hasResolution) score += 0.25;

  return score;
}

// ── Chronology / Sequence Signals ───────────────────────────────────────────

const SEQUENCE_MARKERS_ORDERED = [
  { markers: ['first', 'at first', 'in the beginning', 'one morning', 'one day'], phase: 'start' },
  { markers: ['then', 'next', 'after that', 'soon', 'later', 'meanwhile'], phase: 'middle' },
  { markers: ['suddenly', 'just then', 'all at once', 'without warning'], phase: 'peak' },
  { markers: ['finally', 'in the end', 'at last', 'eventually'], phase: 'end' },
];

/**
 * Score chronological flow: are sequence markers used and do they
 * appear in roughly the right order? Returns 0..1.
 */
export function scoreChronologicalFlow(text) {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const len = words.length;
  if (len < 8) return 0;

  let phasesHit = 0;
  let lastPosition = -1;
  let inOrder = true;

  for (const group of SEQUENCE_MARKERS_ORDERED) {
    let earliestPos = Infinity;
    for (const marker of group.markers) {
      const idx = phraseIndex(lower, marker);
      if (idx >= 0 && idx < earliestPos) {
        earliestPos = idx;
      }
    }
    if (earliestPos < Infinity) {
      phasesHit++;
      if (earliestPos <= lastPosition) inOrder = false;
      lastPosition = earliestPos;
    }
  }

  const coverageScore = phasesHit / SEQUENCE_MARKERS_ORDERED.length;
  const orderBonus = inOrder && phasesHit >= 2 ? 0.15 : 0;

  return Math.min(coverageScore + orderBonus, 1);
}

// ── Aggregate Narrative Quality Score ───────────────────────────────────────

/**
 * Compute an aggregate narrative quality score from sub-signals.
 * Returns an object with individual scores and a combined score.
 */
export function computeNarrativeQuality(text) {
  const lower = (text || '').toLowerCase();
  const climax = scoreClimaxPresence(lower);
  const resolution = scoreResolutionPresence(lower);
  const reflection = scoreReflectionEnding(text || '');
  const dialogue = scoreDialoguePurpose(text || '');
  const arc = scoreNarrativeArc(text || '');
  const chronology = scoreChronologicalFlow(text || '');

  const combined =
    climax * 0.18 +
    resolution * 0.18 +
    reflection * 0.14 +
    dialogue * 0.16 +
    arc * 0.18 +
    chronology * 0.16;

  return { climax, resolution, reflection, dialogue, arc, chronology, combined };
}
