/**
 * writingEvaluator.js
 *
 * Heuristic writing evaluator for Writing Quest.
 *
 * ⚠️  DESIGN PRINCIPLE: This evaluator provides automated practice feedback,
 *     NOT authoritative writing assessment. Scores are heuristic signals only.
 *     A teacher's judgement remains essential for final marking decisions.
 *
 * Dimensions:
 *   content       – Ideas developed, required points covered, word count in band
 *   organisation  – Sentence variety, connector diversity, structural signals
 *   language      – Punctuation mechanics, vocabulary range, genre patterns
 *   taskFulfilment– Required checks, purpose/audience/tone alignment
 */

import { computeNarrativeQuality } from './writingNarrativeHelpers.js';
import {
  containsAllTerms,
  containsAnyPhrase,
  countPhrases,
  countTerms,
  findPhrases,
} from './textMatch.js';

// Approximate word-count targets by level (guide, not strict cap)
const LENGTH_TARGETS = { 1: 35, 2: 55, 3: 80, 4: 110, 5: 150, 6: 190 };

export function getLengthTarget(level) {
  return LENGTH_TARGETS[level] || 80;
}

// Connector banks separated by complexity tier.
// Variety across banks is rewarded more than repetition within one bank.
const CONNECTOR_BANKS = {
  simple: ['and', 'but', 'so', 'or'],
  sequence: ['first', 'then', 'after', 'next', 'finally', 'lastly', 'after that'],
  subordinate: [
    'because',
    'when',
    'while',
    'although',
    'even though',
    'if',
    'unless',
    'since',
    'as',
    'before',
  ],
  advanced: [
    'despite',
    'not only',
    'however',
    'therefore',
    'moreover',
    'consequently',
    'furthermore',
    'nevertheless',
    'in addition',
    'on the other hand',
  ],
};

const FORMAL_OPENINGS = ['dear ', 'i am writing', 'i would like to', 'i am pleased'];
const FORMAL_CLOSINGS = [
  'yours sincerely',
  'yours faithfully',
  'best regards',
  'thank you for',
  'i hope to',
];

// Sensory / action words that signal show-don't-tell technique at upper primary.
//
// Matched as whole words (audit finding 19: "rushed" used to be credited from
// "brushed" and "froze" from "frozen"), so the forms a child actually writes
// have to be listed rather than inferred. Past tense first, because these are
// narrative words, with the present forms a P5 recount might use beside them.
const SENSORY_WORDS = [
  'trembled',
  'trembling',
  'heart pounded',
  'tear',
  'tears',
  'gasped',
  'gasping',
  'stared',
  'staring',
  'whispered',
  'whispering',
  'glistened',
  'glistening',
  'clutched',
  'clutching',
  'shivered',
  'shivering',
  'rushed',
  'rushing',
  'froze',
  'sweat',
  'sweating',
  'gulp',
  'gulped',
];

// ── Raw Signal Extraction ─────────────────────────────────────────────────────

/**
 * Compute raw textual signals used by dimension scorers.
 * Kept separate from scoring so the metrics object can be reused
 * for live hints, badge detection, and comparison.
 */
export function computeMetrics(item, text, level) {
  const t = (text || '').trim();
  const words = t ? t.split(/\s+/).length : 0;

  // Terminal-punctuation sentence count
  const punctMatches = t.match(/[.!?]+/g) || [];
  const sentenceCount = Math.max(punctMatches.length, 1);

  // Paragraph count (separated by blank lines)
  const paragraphCount = Math.max(t.split(/\n\s*\n/).filter((p) => p.trim().length > 10).length, 1);

  // Connector variety – the distinct connectors actually used, per bank.
  //
  // Audit finding 19: this was `lower.includes(c)`, which credited "and" from
  // "sandy", "or" from "forgot" and "as" from "was". Every past-tense
  // narrative contains "was", so every story collected a free subordinate
  // connector. Whole words only now — see textMatch.js.
  const connectorHits = {};
  let totalDistinct = 0;
  for (const [type, list] of Object.entries(CONNECTOR_BANKS)) {
    connectorHits[type] = findPhrases(t, list);
    totalDistinct += connectorHits[type].length;
  }

  // Required checks via the richer keywordsAny / keywordsAll schema.
  // Falls back to neutral coverage when no checks defined (legacy prompts).
  const checks = item.requiredChecks || [];
  const checkResults = checks.map((check) => {
    // Audit finding 19: substring matching marked a required point covered by
    // any word containing it — a task asking the child to mention the "ball"
    // was satisfied by "football" or "balloon". Required coverage feeds both
    // the content and task-match scores, so this was the costliest instance.
    let hit = false;
    if (check.keywordsAny?.length) {
      const terms = [...check.keywordsAny, ...(check.synonyms || [])];
      const found = countTerms(t, terms);
      hit = found >= (check.minimumHits || 1);
    } else if (check.keywordsAll?.length) {
      hit = containsAllTerms(t, check.keywordsAll);
    }
    return { id: check.id, label: check.label, hit };
  });
  const requiredHits = checkResults.filter((r) => r.hit).length;
  const requiredTotal = checks.length;
  const requiredCoverage = requiredTotal > 0 ? requiredHits / requiredTotal : 0.6;

  // Length band scoring (80–140 % of target = full credit)
  const target = getLengthTarget(level);
  const wordRatio = words / target;
  const lengthScore =
    wordRatio >= 0.8 && wordRatio <= 1.4 ? 1 : wordRatio < 0.8 ? wordRatio / 0.8 : 0.85; // mild penalty for very long responses

  // Mechanics
  const hasEndPunct = /[.!?]$/.test(t);
  const sentenceStartCapitals = (t.match(/(?:^|[.!?]\s+)[A-Z]/g) || []).length;

  // Dialogue detection (requires speech marks AND a reporting verb)
  const hasDialogue =
    /["'""\u2018\u2019\u201c\u201d]/.test(t) &&
    / said| asked| replied| whispered| explained/i.test(t);
  const dialoguePunctOk = hasDialogue && /["“”][^"\n]{3,}[.!?,]["”]/.test(t);
  const purposefulDialogue =
    hasDialogue && /(let's|we should|we can|help|run|quick|plan|careful)/i.test(t);
  const hasClimaxSignal = /(suddenly|all at once|just then|without warning|at that moment)/i.test(
    t,
  );
  const hasResolutionSignal = /(in the end|finally|at last|eventually)/i.test(t);
  const hasReflectionSignal = /(i learned|i realised|i realized|next time|i promised)/i.test(t);
  // "after" used to be credited from "afternoon" and "then" from "when".
  const chronologicalFlow = countPhrases(t, ['first', 'next', 'then', 'after that', 'finally']);

  // Formal register signals (relevant for situational writing)
  const hasFormalOpening = containsAnyPhrase(t, FORMAL_OPENINGS);
  const hasFormalClosing = containsAnyPhrase(t, FORMAL_CLOSINGS);

  // Story structure signal (narrative tasks)
  const hasStoryStructure = item.storyPlan ? sentenceCount >= 5 && paragraphCount >= 2 : null; // null = not applicable

  // Show-don't-tell signals (P5/P6 narratives)
  const emotionTellingCount = (
    t.match(/\b(I felt|I was (sad|happy|angry|scared)|I feel)\b/gi) || []
  ).length;
  const sensoryWordsUsed = findPhrases(t, SENSORY_WORDS);
  const sensoryHits = sensoryWordsUsed.length;

  // Vocabulary variety proxies
  const wordList = t
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z]/gi, '').toLowerCase())
    .filter(Boolean);
  const longWords = wordList.filter((w) => w.length >= 7).length;
  const uniqueWords = new Set(wordList).size;
  const lexicalDensity = uniqueWords / Math.max(wordList.length, 1);

  // First sentence (for badge detection)
  const firstSentence = t.split(/[.!?]/)[0]?.trim() || '';

  // Narrative quality sub-scores (from writingNarrativeHelpers)
  const narrativeQuality = computeNarrativeQuality(t);

  return {
    words,
    sentenceCount,
    paragraphCount,
    wordRatio,
    lengthScore,
    target,
    connectorHits,
    totalDistinct,
    requiredHits,
    requiredTotal,
    requiredCoverage,
    checkResults,
    hasEndPunct,
    sentenceStartCapitals,
    hasDialogue,
    dialoguePunctOk,
    purposefulDialogue,
    hasFormalOpening,
    hasFormalClosing,
    hasStoryStructure,
    hasClimaxSignal,
    hasResolutionSignal,
    hasReflectionSignal,
    chronologicalFlow,
    emotionTellingCount,
    sensoryHits,
    sensoryWordsUsed,
    longWords,
    uniqueWords,
    lexicalDensity,
    firstSentence,
    narrativeQuality,
  };
}

// ── Dimension Scorers ─────────────────────────────────────────────────────────

// Content: required coverage dominates; length and specific detail signal quality.
// Deliberately avoids rewarding keyword stuffing.
function _scoreContent(item, m) {
  const detailBonus = Math.min((m.sensoryHits / 3) * 0.08 + (m.longWords / 6) * 0.07, 0.12);
  return Math.min(1, m.requiredCoverage * 0.6 + m.lengthScore * 0.28 + detailBonus);
}

// Organisation: connector VARIETY (across banks) is rewarded,
// not raw connector count. Stuffing one connector type doesn't inflate this.
// Now also incorporates narrative arc and chronology from narrative helpers.
function _scoreOrganisation(item, m, level) {
  const bankDiversity = Object.values(m.connectorHits).filter((hits) => hits.length > 0).length;
  const connectorScore = Math.min(
    (m.totalDistinct / (level <= 2 ? 3 : 5)) *
      (bankDiversity / Object.keys(CONNECTOR_BANKS).length),
    1,
  );
  const sentTarget = level <= 2 ? 4 : level <= 4 ? 6 : 8;
  const sentScore = Math.min(m.sentenceCount / sentTarget, 1);
  // Upper primary: paragraphs matter; lower primary: sentence count proxies structure
  const paraScore = level >= 5 ? Math.min(m.paragraphCount / 3, 1) : sentScore;
  const closureScore = m.hasEndPunct ? 1 : 0.4;

  // Use richer chronology from narrative helpers instead of simple count
  const nq = m.narrativeQuality || {};
  const chronologyScore = nq.chronology ?? Math.min(m.chronologicalFlow / 2, 1);
  // Narrative arc bonus for continuous/narrative modes
  const mode = item.mode || 'guided';
  const arcBonus =
    mode === 'continuous' || item.lessonType === 'narrative' || item.lessonType === 'bootcamp'
      ? (nq.arc || 0) * 0.1
      : 0;

  return Math.min(
    1,
    connectorScore * 0.28 +
      sentScore * 0.22 +
      paraScore * 0.16 +
      closureScore * 0.08 +
      chronologyScore * 0.16 +
      arcBonus,
  );
}

// Language: mechanics, vocabulary variety, genre-appropriate patterns, sentence variety
// Now uses richer narrative craft scoring from narrative helpers.
function _scoreLanguage(item, m) {
  const punctScore = m.hasEndPunct ? 1 : 0.3;
  const vocabScore = Math.min(m.lexicalDensity * 1.6, 1);
  const genreScore = _genrePatternScore(item, m);
  const sentCount = Math.max(m.sentenceCount, 1);
  const varietyScore = Math.min(m.sentenceStartCapitals / (sentCount - 0.5), 1);

  // Use deeper narrative quality signals instead of flat boolean checks
  const nq = m.narrativeQuality || {};
  const narrativeCraft =
    (nq.climax || 0) * 0.22 +
    (nq.resolution || 0) * 0.22 +
    (nq.reflection || 0) * 0.22 +
    (nq.dialogue || 0) * 0.34;
  return Math.min(
    1,
    punctScore * 0.22 +
      vocabScore * 0.22 +
      genreScore * 0.18 +
      varietyScore * 0.14 +
      narrativeCraft * 0.24,
  );
}

// Task Fulfilment: required coverage + purpose/audience alignment
// Arc bonus now uses graduated narrative quality scores instead of binary flags.
function _scoreTaskFulfilment(item, m) {
  const nq = m.narrativeQuality || {};
  const arcBonus = ((nq.climax || 0) + (nq.resolution || 0) + (nq.reflection || 0)) * 0.1;
  return Math.min(
    1,
    m.requiredCoverage * 0.55 + _purposeAlignmentScore(item, m) * 0.3 + Math.min(arcBonus, 0.3),
  );
}

// Genre-specific writing patterns (situational = formal register; narrative = structure/dialogue)
function _genrePatternScore(item, m) {
  const mode = item.mode || 'guided';
  if (mode === 'situational') {
    return (m.hasFormalOpening ? 0.55 : 0.1) + (m.hasFormalClosing ? 0.45 : 0.1);
  }
  if (mode === 'continuous') {
    const dlg = m.hasDialogue ? (m.dialoguePunctOk ? 0.5 : 0.3) : 0;
    const str = m.hasStoryStructure !== null ? (m.hasStoryStructure ? 0.5 : 0.25) : 0.4;
    return Math.min(dlg + str, 1);
  }
  if (mode === 'hybrid') {
    const formal = (m.hasFormalOpening ? 0.3 : 0) + (m.hasFormalClosing ? 0.3 : 0);
    const struct = Math.min(m.paragraphCount / 3, 0.4);
    return Math.min(formal + struct, 1);
  }
  // guided / default
  return m.sentenceCount >= 4 ? 0.75 : 0.5;
}

// Purpose/audience alignment – checks formal register for adult audience
function _purposeAlignmentScore(item, m) {
  if (item.pac) {
    const aud = (item.pac.audience || '').toLowerCase();
    const isAdult = [
      'teacher',
      'principal',
      'teacher-in-charge',
      'school leader',
      'mr',
      'ms',
      'mrs',
      // Substring is right here: this reads the task's own authored audience
      // field ("your form teacher"), not the child's writing. Finding 19 is
      // about signals taken from what the child wrote.
    ].some((a) => aud.includes(a));
    if (isAdult) {
      return (m.hasFormalOpening ? 0.55 : 0.1) + (m.hasFormalClosing ? 0.45 : 0.15);
    }
    return m.words >= m.target * 0.6 ? 0.75 : 0.5;
  }
  return Math.min(m.words / (m.target * 0.85), 1);
}

function _weightedScore(d) {
  return d.content * 0.3 + d.organisation * 0.25 + d.language * 0.25 + d.taskFulfilment * 0.2;
}

function _findStrongWeak(dims) {
  const entries = Object.entries(dims);
  return {
    strongest: entries.reduce((a, b) => (b[1] > a[1] ? b : a))[0],
    weakest: entries.reduce((a, b) => (b[1] < a[1] ? b : a))[0],
  };
}

// ── Public Metadata ───────────────────────────────────────────────────────────

export const DIMENSION_LABELS = {
  content: 'Ideas & Content',
  organisation: 'Organisation',
  language: 'Language & Style',
  taskFulfilment: 'Task Match',
};

export const DIMENSION_EMOJIS = {
  content: '💡',
  organisation: '📋',
  language: '✍️',
  taskFulfilment: '🎯',
};

export function getDimensionFeedback(key, score) {
  const tier = score >= 0.8 ? 'strong' : score >= 0.58 ? 'growing' : 'needs work';
  const map = {
    content: {
      strong: 'Your ideas are well developed and specific.',
      growing: 'Add one more specific detail or example to deepen your response.',
      'needs work': 'Include more required points and expand your main ideas with details.',
    },
    organisation: {
      strong: 'Your writing flows clearly from opening to ending.',
      growing: 'Add a connector to link two ideas more smoothly (e.g. "however", "after that").',
      'needs work':
        'Plan a clear opening, middle, and ending. Use connectors to guide your reader.',
    },
    language: {
      strong: 'Your language choices are varied and well controlled.',
      growing:
        'Check that every sentence ends with a full stop, question mark, or exclamation mark.',
      'needs work': 'Focus on full stops, capital letters, and trying more varied vocabulary.',
    },
    taskFulfilment: {
      strong: 'You matched the task purpose and audience well.',
      growing: 'Re-read the task — are all required points in your response?',
      'needs work':
        'Cover every required point and make sure your tone suits the purpose and audience.',
    },
  };
  return map[key]?.[tier] || 'Revise and improve one area at a time.';
}

export function getRevisionMission(weakest) {
  const missions = {
    content: 'Mission: Add one specific detail or example that was missing from your first draft.',
    organisation:
      'Mission: Find a gap between two ideas and bridge it with a connector you have not used yet.',
    language:
      'Mission: Check each sentence — does it start with a capital letter and end with correct punctuation? Fix any that do not.',
    taskFulfilment:
      'Mission: Re-read the task. Find one required point not yet in your response and add it now.',
  };
  return missions[weakest] || 'Mission: Re-read your draft and strengthen the weakest part.';
}

export function getEncouragement(score) {
  if (score >= 0.88) return 'Excellent draft! Your revision can make it exceptional.';
  if (score >= 0.72) return 'Good effort — focused revision will push your score higher.';
  if (score >= 0.55) return 'You have a solid start. Use the feedback below to improve.';
  return 'Every writer improves through revision. Use the mission below to guide your next draft.';
}

/**
 * Map a 0-1 score to a 4-band rubric label.
 * Returns an object with band number, label, and description.
 * Band 4 Strong / Band 3 Secure / Band 2 Developing / Band 1 Needs Support
 */
export function getRubricBand(score) {
  if (score >= 0.8) return { band: 4, label: 'Strong', emoji: '🌟' };
  if (score >= 0.65) return { band: 3, label: 'Secure', emoji: '✅' };
  if (score >= 0.5) return { band: 2, label: 'Developing', emoji: '📈' };
  return { band: 1, label: 'Needs Support', emoji: '💪' };
}

/** Dimension-level band label (single word) */
export function getDimensionBandLabel(dimensionScore) {
  if (dimensionScore >= 0.8) return 'Good';
  if (dimensionScore >= 0.58) return 'Developing';
  return 'Needs work';
}

// ── Observation, separated from judgement ─────────────────────────────────────

/**
 * The things this evaluator can actually see.
 *
 * Audit 2026-09-19, finding 19: "separate observable mechanics from judgement
 * about meaning, organisation and task fulfilment."
 *
 * Counting words, spotting a full stop and listing the connectors a child used
 * are observations — a teacher would agree with every one of them. Deciding
 * that the ideas are "well developed" or that the organisation is "Secure" is
 * a judgement, and this module is a word counter. Both still ship, because
 * the practice loop needs something to aim at; they are now different fields
 * with different names, so a screen can show the facts without dressing the
 * guesses up as facts too.
 *
 * `connectorsUsed` is the list, not the count, on purpose. A number can be
 * quietly wrong; a list a child reads back is checkable — which is exactly how
 * this finding would have been caught in use rather than in an audit.
 *
 * @param {ReturnType<typeof computeMetrics>} m
 * @returns {object}
 */
export function observedFacts(m) {
  const connectorsUsed = Object.values(m.connectorHits).flat();
  return {
    words: m.words,
    target: m.target,
    sentences: m.sentenceCount,
    paragraphs: m.paragraphCount,
    endsWithPunctuation: m.hasEndPunct,
    sentencesStartingWithCapital: m.sentenceStartCapitals,
    connectorsUsed,
    sequenceWordsUsed: m.chronologicalFlow,
    sensoryWordsUsed: m.sensoryWordsUsed || [],
    hasDialogue: m.hasDialogue,
    requiredPointsCovered: m.requiredHits,
    requiredPointsTotal: m.requiredTotal,
    coveredPoints: (m.checkResults || []).filter((c) => c.hit).map((c) => c.label),
    missingPoints: (m.checkResults || []).filter((c) => !c.hit).map((c) => c.label),
  };
}

/**
 * One line naming what was counted, for a screen to print under the score.
 *
 * Deliberately short. The audit asks for "a small number of accurate revision
 * suggestions over a pseudo-precise overall mark", and a wall of statistics is
 * the same mistake in a different direction.
 *
 * @param {object} observed — from `observedFacts`
 * @returns {string}
 */
export function describeObserved(observed) {
  const parts = [`${observed.words} words in ${observed.sentences} sentences`];
  if (observed.connectorsUsed.length) {
    parts.push(`connectors you used: ${observed.connectorsUsed.join(', ')}`);
  } else {
    parts.push('no linking words found yet');
  }
  if (observed.requiredPointsTotal > 0) {
    parts.push(
      `${observed.requiredPointsCovered} of ${observed.requiredPointsTotal} required points found`,
    );
  }
  return parts.join(' · ');
}

/**
 * What this check does not look at, said plainly.
 *
 * Finding 19's acceptance asks that heuristic scores are not presented as
 * composition marks. A band with no caveat beside it reads like one — the
 * four-band Strong/Secure/Developing vocabulary is what Singapore composition
 * rubrics use.
 */
export const HEURISTIC_CAVEAT =
  'This is an automatic check of things a computer can count — length, punctuation, linking words and required points. It cannot judge whether your story is interesting, whether it makes sense, or whether it suits the reader. Your teacher decides that.';

// ── Main Evaluation Export ────────────────────────────────────────────────────

/**
 * Full evaluation — returns everything needed for the feedback card and revision loop.
 */
export function evaluateWriting(item, text, level) {
  if (!text?.trim()) return _emptyResult();

  const metrics = computeMetrics(item, text, level);
  const dimensions = {
    content: _scoreContent(item, metrics),
    organisation: _scoreOrganisation(item, metrics, level),
    language: _scoreLanguage(item, metrics),
    taskFulfilment: _scoreTaskFulfilment(item, metrics),
  };
  const score = _weightedScore(dimensions);
  const { strongest, weakest } = _findStrongWeak(dimensions);
  const feedback = Object.fromEntries(
    Object.entries(dimensions).map(([k, v]) => [k, getDimensionFeedback(k, v)]),
  );

  const observed = observedFacts(metrics);

  return {
    metrics,
    dimensions,
    observed,
    observedSummary: describeObserved(observed),
    caveat: HEURISTIC_CAVEAT,
    score,
    passed: score >= 0.72,
    stars: score >= 0.88 ? 3 : score >= 0.72 ? 2 : 1,
    strongest,
    weakest,
    revisionMission: getRevisionMission(weakest),
    encouragement: getEncouragement(score),
    requiredCoverage: metrics.requiredCoverage,
    checkResults: metrics.checkResults,
    feedback,
  };
}

/**
 * Compare two evaluation results to surface revision improvement.
 * Returns improvement deltas per dimension, XP bonus, and net improvement flag.
 */
export function compareRevisions(r1, r2) {
  if (!r1 || !r2) return null;
  const scoreDiff = r2.score - r1.score;
  const improved = Object.fromEntries(
    Object.keys(r1.dimensions).map((k) => [k, r2.dimensions[k] - r1.dimensions[k]]),
  );
  // Bonus XP for meaningful improvement (encourages genuine revision)
  const revisionBonus = scoreDiff >= 0.12 ? 20 : scoreDiff >= 0.07 ? 12 : scoreDiff >= 0.03 ? 5 : 0;
  return {
    scoreDiff,
    improved,
    wordGain: r2.metrics.words - r1.metrics.words,
    coverageGain: r2.requiredCoverage - r1.requiredCoverage,
    netImproved: scoreDiff > 0.02,
    revisionBonus,
  };
}

/**
 * Lightweight live hint for real-time feedback during drafting (practice mode only).
 * Cheaper than a full evaluation – same metrics, simpler output.
 */
export function getLiveHint(item, text, level) {
  const m = computeMetrics(item, text, level);
  const d = {
    content: _scoreContent(item, m),
    organisation: _scoreOrganisation(item, m, level),
    language: _scoreLanguage(item, m),
    taskFulfilment: _scoreTaskFulfilment(item, m),
  };
  const { weakest } = _findStrongWeak(d);
  const tips = {
    content: 'Add more specific details or cover a required point.',
    organisation: 'Try adding a connector like "however", "because", or "finally".',
    language: 'Check punctuation — each sentence needs a full stop or question mark.',
    taskFulfilment: 'Re-read the task — are you covering everything asked?',
  };
  return {
    words: m.words,
    target: m.target,
    score: _weightedScore(d),
    weakest,
    tip: tips[weakest] || 'Keep going!',
  };
}

// ── Backward-compatible wrappers ──────────────────────────────────────────────
// Kept so any external code that imported the old API still works.

export function evaluateWritingSubmission(item, text, level) {
  const r = evaluateWriting(item, text, level);
  return {
    words: r.metrics.words,
    sentenceCount: r.metrics.sentenceCount,
    requiredHits: r.metrics.requiredHits,
    requiredTotal: r.metrics.requiredTotal,
    dimensions: r.dimensions,
    score: r.score,
    passed: r.passed,
  };
}

export function getWritingLiveFeedback(item, text, level) {
  const hint = getLiveHint(item, text, level);
  return {
    result: { score: hint.score, words: hint.words, dimensions: {} },
    strongest: hint.weakest === 'content' ? 'organisation' : 'content',
    weakest: hint.weakest,
    tip: hint.tip,
    progressLabel: `Words ${hint.words}/${hint.target}`,
  };
}

function _emptyResult() {
  return {
    metrics: {
      words: 0,
      sentenceCount: 0,
      requiredHits: 0,
      requiredTotal: 0,
      checkResults: [],
      firstSentence: '',
    },
    dimensions: { content: 0, organisation: 0, language: 0, taskFulfilment: 0 },
    observed: {
      words: 0,
      target: 0,
      sentences: 0,
      paragraphs: 0,
      endsWithPunctuation: false,
      sentencesStartingWithCapital: 0,
      connectorsUsed: [],
      sequenceWordsUsed: 0,
      sensoryWordsUsed: [],
      hasDialogue: false,
      requiredPointsCovered: 0,
      requiredPointsTotal: 0,
      coveredPoints: [],
      missingPoints: [],
    },
    observedSummary: '',
    caveat: HEURISTIC_CAVEAT,
    score: 0,
    passed: false,
    stars: 0,
    strongest: 'content',
    weakest: 'taskFulfilment',
    revisionMission: 'Write at least one complete sentence to receive feedback.',
    encouragement: 'Start writing — feedback appears once you have typed a response.',
    requiredCoverage: 0,
    checkResults: [],
    feedback: {},
  };
}
