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

// Approximate word-count targets by level (guide, not strict cap)
const LENGTH_TARGETS = { 1: 35, 2: 55, 3: 80, 4: 110, 5: 150, 6: 190 };

export function getLengthTarget(level) {
  return LENGTH_TARGETS[level] || 80;
}

// Connector banks separated by complexity tier.
// Variety across banks is rewarded more than repetition within one bank.
const CONNECTOR_BANKS = {
  simple:      ['and', 'but', 'so', 'or'],
  sequence:    ['first', 'then', 'after', 'next', 'finally', 'lastly', 'after that'],
  subordinate: ['because', 'when', 'while', 'although', 'even though', 'if',
                'unless', 'since', 'as', 'before'],
  advanced:    ['despite', 'not only', 'however', 'therefore', 'moreover',
                'consequently', 'furthermore', 'nevertheless', 'in addition',
                'on the other hand'],
};

const FORMAL_OPENINGS = ['dear ', 'i am writing', 'i would like to', 'i am pleased'];
const FORMAL_CLOSINGS = ['yours sincerely', 'yours faithfully', 'best regards',
                         'thank you for', 'i hope to'];

// Sensory / action words that signal show-don't-tell technique at upper primary
const SENSORY_WORDS = [
  'trembled', 'heart pounded', 'tears', 'gasped', 'stared', 'whispered',
  'glistened', 'clutched', 'shivered', 'rushed', 'froze', 'sweat', 'gulp',
];

// ── Raw Signal Extraction ─────────────────────────────────────────────────────

/**
 * Compute raw textual signals used by dimension scorers.
 * Kept separate from scoring so the metrics object can be reused
 * for live hints, badge detection, and comparison.
 */
export function computeMetrics(item, text, level) {
  const t     = (text || '').trim();
  const lower = t.toLowerCase();
  const words = t ? t.split(/\s+/).length : 0;

  // Terminal-punctuation sentence count
  const punctMatches  = t.match(/[.!?]+/g) || [];
  const sentenceCount = Math.max(punctMatches.length, 1);

  // Paragraph count (separated by blank lines)
  const paragraphCount = Math.max(
    t.split(/\n\s*\n/).filter(p => p.trim().length > 10).length,
    1
  );

  // Connector variety – count distinct matches per bank
  const connectorHits = {};
  let totalDistinct = 0;
  for (const [type, list] of Object.entries(CONNECTOR_BANKS)) {
    connectorHits[type] = list.filter(c => lower.includes(c));
    totalDistinct += connectorHits[type].length;
  }

  // Required checks via the richer keywordsAny / keywordsAll schema.
  // Falls back to neutral coverage when no checks defined (legacy prompts).
  const checks = item.requiredChecks || [];
  const checkResults = checks.map(check => {
    let hit = false;
    if (check.keywordsAny?.length) {
      const terms = [...check.keywordsAny, ...(check.synonyms || [])];
      hit = terms.filter(kw => lower.includes(kw.toLowerCase())).length
            >= (check.minimumHits || 1);
    } else if (check.keywordsAll?.length) {
      hit = check.keywordsAll.every(kw => lower.includes(kw.toLowerCase()));
    }
    return { id: check.id, label: check.label, hit };
  });
  const requiredHits     = checkResults.filter(r => r.hit).length;
  const requiredTotal    = checks.length;
  const requiredCoverage = requiredTotal > 0 ? requiredHits / requiredTotal : 0.6;

  // Length band scoring (80–140 % of target = full credit)
  const target    = getLengthTarget(level);
  const wordRatio = words / target;
  const lengthScore = (wordRatio >= 0.8 && wordRatio <= 1.4)
    ? 1
    : wordRatio < 0.8
      ? wordRatio / 0.8
      : 0.85; // mild penalty for very long responses

  // Mechanics
  const hasEndPunct           = /[.!?]$/.test(t);
  const sentenceStartCapitals = (t.match(/(?:^|[.!?]\s+)[A-Z]/g) || []).length;

  // Dialogue detection (requires speech marks AND a reporting verb)
  const hasDialogue = /["'""\u2018\u2019\u201c\u201d]/.test(t)
                   && / said| asked| replied| whispered| explained/i.test(t);
  const dialoguePunctOk = hasDialogue
    && /["“”][^"\n]{3,}[.!?,]["”]/.test(t);
  const purposefulDialogue = hasDialogue && /(let's|we should|we can|help|run|quick|plan|careful)/i.test(t);
  const hasClimaxSignal = /(suddenly|all at once|just then|without warning|at that moment)/i.test(t);
  const hasResolutionSignal = /(in the end|finally|at last|eventually)/i.test(t);
  const hasReflectionSignal = /(i learned|i realised|i realized|next time|i promised)/i.test(t);
  const chronologicalFlow = ['first', 'next', 'then', 'after that', 'finally'].filter((c) => lower.includes(c)).length;

  // Formal register signals (relevant for situational writing)
  const hasFormalOpening = FORMAL_OPENINGS.some(p => lower.includes(p));
  const hasFormalClosing = FORMAL_CLOSINGS.some(p => lower.includes(p));

  // Story structure signal (narrative tasks)
  const hasStoryStructure = item.storyPlan
    ? (sentenceCount >= 5 && paragraphCount >= 2)
    : null; // null = not applicable

  // Show-don't-tell signals (P5/P6 narratives)
  const emotionTellingCount = (
    t.match(/\b(I felt|I was (sad|happy|angry|scared)|I feel)\b/gi) || []
  ).length;
  const sensoryHits = SENSORY_WORDS.filter(w => lower.includes(w)).length;

  // Vocabulary variety proxies
  const wordList       = t.split(/\s+/)
                          .map(w => w.replace(/[^a-z]/gi, '').toLowerCase())
                          .filter(Boolean);
  const longWords      = wordList.filter(w => w.length >= 7).length;
  const uniqueWords    = new Set(wordList).size;
  const lexicalDensity = uniqueWords / Math.max(wordList.length, 1);

  // First sentence (for badge detection)
  const firstSentence = t.split(/[.!?]/)[0]?.trim() || '';

  // Narrative quality sub-scores (from writingNarrativeHelpers)
  const narrativeQuality = computeNarrativeQuality(t);

  return {
    words, sentenceCount, paragraphCount,
    wordRatio, lengthScore, target,
    connectorHits, totalDistinct,
    requiredHits, requiredTotal, requiredCoverage, checkResults,
    hasEndPunct, sentenceStartCapitals,
    hasDialogue, dialoguePunctOk, purposefulDialogue,
    hasFormalOpening, hasFormalClosing,
    hasStoryStructure, hasClimaxSignal, hasResolutionSignal, hasReflectionSignal, chronologicalFlow, emotionTellingCount, sensoryHits,
    longWords, uniqueWords, lexicalDensity,
    firstSentence,
    narrativeQuality,
  };
}

// ── Dimension Scorers ─────────────────────────────────────────────────────────

// Content: required coverage dominates; length and specific detail signal quality.
// Deliberately avoids rewarding keyword stuffing.
function _scoreContent(item, m) {
  const detailBonus = Math.min(
    (m.sensoryHits / 3) * 0.08 + (m.longWords / 6) * 0.07,
    0.12
  );
  return Math.min(1,
    m.requiredCoverage * 0.60 +
    m.lengthScore      * 0.28 +
    detailBonus
  );
}

// Organisation: connector VARIETY (across banks) is rewarded,
// not raw connector count. Stuffing one connector type doesn't inflate this.
// Now also incorporates narrative arc and chronology from narrative helpers.
function _scoreOrganisation(item, m, level) {
  const bankDiversity = Object.values(m.connectorHits)
                               .filter(hits => hits.length > 0).length;
  const connectorScore = Math.min(
    (m.totalDistinct / (level <= 2 ? 3 : 5))
    * (bankDiversity / Object.keys(CONNECTOR_BANKS).length),
    1
  );
  const sentTarget = level <= 2 ? 4 : level <= 4 ? 6 : 8;
  const sentScore  = Math.min(m.sentenceCount / sentTarget, 1);
  // Upper primary: paragraphs matter; lower primary: sentence count proxies structure
  const paraScore  = level >= 5
    ? Math.min(m.paragraphCount / 3, 1)
    : sentScore;
  const closureScore = m.hasEndPunct ? 1 : 0.4;

  // Use richer chronology from narrative helpers instead of simple count
  const nq = m.narrativeQuality || {};
  const chronologyScore = nq.chronology ?? Math.min(m.chronologicalFlow / 2, 1);
  // Narrative arc bonus for continuous/narrative modes
  const mode = item.mode || 'guided';
  const arcBonus = (mode === 'continuous' || item.lessonType === 'narrative' || item.lessonType === 'bootcamp')
    ? (nq.arc || 0) * 0.10
    : 0;

  return Math.min(1,
    connectorScore  * 0.28 +
    sentScore       * 0.22 +
    paraScore       * 0.16 +
    closureScore    * 0.08 +
    chronologyScore * 0.16 +
    arcBonus
  );
}

// Language: mechanics, vocabulary variety, genre-appropriate patterns, sentence variety
// Now uses richer narrative craft scoring from narrative helpers.
function _scoreLanguage(item, m) {
  const punctScore   = m.hasEndPunct ? 1 : 0.3;
  const vocabScore   = Math.min(m.lexicalDensity * 1.6, 1);
  const genreScore   = _genrePatternScore(item, m);
  const sentCount    = Math.max(m.sentenceCount, 1);
  const varietyScore = Math.min(m.sentenceStartCapitals / (sentCount - 0.5), 1);

  // Use deeper narrative quality signals instead of flat boolean checks
  const nq = m.narrativeQuality || {};
  const narrativeCraft = (
    (nq.climax || 0) * 0.22 +
    (nq.resolution || 0) * 0.22 +
    (nq.reflection || 0) * 0.22 +
    (nq.dialogue || 0) * 0.34
  );
  return Math.min(1,
    punctScore      * 0.22 +
    vocabScore      * 0.22 +
    genreScore      * 0.18 +
    varietyScore    * 0.14 +
    narrativeCraft  * 0.24
  );
}

// Task Fulfilment: required coverage + purpose/audience alignment
// Arc bonus now uses graduated narrative quality scores instead of binary flags.
function _scoreTaskFulfilment(item, m) {
  const nq = m.narrativeQuality || {};
  const arcBonus = ((nq.climax || 0) + (nq.resolution || 0) + (nq.reflection || 0)) * 0.10;
  return Math.min(1,
    m.requiredCoverage       * 0.55 +
    _purposeAlignmentScore(item, m) * 0.30 +
    Math.min(arcBonus, 0.30)
  );
}

// Genre-specific writing patterns (situational = formal register; narrative = structure/dialogue)
function _genrePatternScore(item, m) {
  const mode = item.mode || 'guided';
  if (mode === 'situational') {
    return (m.hasFormalOpening ? 0.55 : 0.10) + (m.hasFormalClosing ? 0.45 : 0.10);
  }
  if (mode === 'continuous') {
    const dlg = m.hasDialogue ? (m.dialoguePunctOk ? 0.50 : 0.30) : 0;
    const str = m.hasStoryStructure !== null
      ? (m.hasStoryStructure ? 0.50 : 0.25)
      : 0.40;
    return Math.min(dlg + str, 1);
  }
  if (mode === 'hybrid') {
    const formal = (m.hasFormalOpening ? 0.30 : 0) + (m.hasFormalClosing ? 0.30 : 0);
    const struct = Math.min(m.paragraphCount / 3, 0.40);
    return Math.min(formal + struct, 1);
  }
  // guided / default
  return m.sentenceCount >= 4 ? 0.75 : 0.50;
}

// Purpose/audience alignment – checks formal register for adult audience
function _purposeAlignmentScore(item, m) {
  if (item.pac) {
    const aud = (item.pac.audience || '').toLowerCase();
    const isAdult = ['teacher', 'principal', 'teacher-in-charge', 'school leader',
                     'mr', 'ms', 'mrs'].some(a => aud.includes(a));
    if (isAdult) {
      return (m.hasFormalOpening ? 0.55 : 0.10) + (m.hasFormalClosing ? 0.45 : 0.15);
    }
    return m.words >= m.target * 0.6 ? 0.75 : 0.50;
  }
  return Math.min(m.words / (m.target * 0.85), 1);
}

function _weightedScore(d) {
  return d.content * 0.30 + d.organisation * 0.25 + d.language * 0.25 + d.taskFulfilment * 0.20;
}

function _findStrongWeak(dims) {
  const entries = Object.entries(dims);
  return {
    strongest: entries.reduce((a, b) => b[1] > a[1] ? b : a)[0],
    weakest:   entries.reduce((a, b) => b[1] < a[1] ? b : a)[0],
  };
}

// ── Public Metadata ───────────────────────────────────────────────────────────

export const DIMENSION_LABELS = {
  content:       'Ideas & Content',
  organisation:  'Organisation',
  language:      'Language & Style',
  taskFulfilment:'Task Match',
};

export const DIMENSION_EMOJIS = {
  content:       '💡',
  organisation:  '📋',
  language:      '✍️',
  taskFulfilment:'🎯',
};

export function getDimensionFeedback(key, score) {
  const tier = score >= 0.80 ? 'strong' : score >= 0.58 ? 'growing' : 'needs work';
  const map = {
    content: {
      strong:       'Your ideas are well developed and specific.',
      growing:      'Add one more specific detail or example to deepen your response.',
      'needs work': 'Include more required points and expand your main ideas with details.',
    },
    organisation: {
      strong:       'Your writing flows clearly from opening to ending.',
      growing:      'Add a connector to link two ideas more smoothly (e.g. "however", "after that").',
      'needs work': 'Plan a clear opening, middle, and ending. Use connectors to guide your reader.',
    },
    language: {
      strong:       'Your language choices are varied and well controlled.',
      growing:      'Check that every sentence ends with a full stop, question mark, or exclamation mark.',
      'needs work': 'Focus on full stops, capital letters, and trying more varied vocabulary.',
    },
    taskFulfilment: {
      strong:       'You matched the task purpose and audience well.',
      growing:      'Re-read the task — are all required points in your response?',
      'needs work': 'Cover every required point and make sure your tone suits the purpose and audience.',
    },
  };
  return map[key]?.[tier] || 'Revise and improve one area at a time.';
}

export function getRevisionMission(weakest) {
  const missions = {
    content:       'Mission: Add one specific detail or example that was missing from your first draft.',
    organisation:  'Mission: Find a gap between two ideas and bridge it with a connector you have not used yet.',
    language:      'Mission: Check each sentence — does it start with a capital letter and end with correct punctuation? Fix any that do not.',
    taskFulfilment:'Mission: Re-read the task. Find one required point not yet in your response and add it now.',
  };
  return missions[weakest] || 'Mission: Re-read your draft and strengthen the weakest part.';
}

export function getEncouragement(score) {
  if (score >= 0.88) return 'Excellent draft! Your revision can make it exceptional.';
  if (score >= 0.72) return 'Good effort — focused revision will push your score higher.';
  if (score >= 0.55) return 'You have a solid start. Use the feedback below to improve.';
  return 'Every writer improves through revision. Use the mission below to guide your next draft.';
}

// ── Main Evaluation Export ────────────────────────────────────────────────────

/**
 * Full evaluation — returns everything needed for the feedback card and revision loop.
 */
export function evaluateWriting(item, text, level) {
  if (!text?.trim()) return _emptyResult();

  const metrics    = computeMetrics(item, text, level);
  const dimensions = {
    content:       _scoreContent(item, metrics),
    organisation:  _scoreOrganisation(item, metrics, level),
    language:      _scoreLanguage(item, metrics),
    taskFulfilment:_scoreTaskFulfilment(item, metrics),
  };
  const score                = _weightedScore(dimensions);
  const { strongest, weakest } = _findStrongWeak(dimensions);
  const feedback             = Object.fromEntries(
    Object.entries(dimensions).map(([k, v]) => [k, getDimensionFeedback(k, v)])
  );

  return {
    metrics, dimensions, score,
    passed:          score >= 0.72,
    stars:           score >= 0.88 ? 3 : score >= 0.72 ? 2 : 1,
    strongest, weakest,
    revisionMission: getRevisionMission(weakest),
    encouragement:   getEncouragement(score),
    requiredCoverage: metrics.requiredCoverage,
    checkResults:    metrics.checkResults,
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
  const improved  = Object.fromEntries(
    Object.keys(r1.dimensions).map(k => [k, r2.dimensions[k] - r1.dimensions[k]])
  );
  // Bonus XP for meaningful improvement (encourages genuine revision)
  const revisionBonus = scoreDiff >= 0.12 ? 20 : scoreDiff >= 0.07 ? 12 : scoreDiff >= 0.03 ? 5 : 0;
  return {
    scoreDiff, improved,
    wordGain:     r2.metrics.words - r1.metrics.words,
    coverageGain: r2.requiredCoverage - r1.requiredCoverage,
    netImproved:  scoreDiff > 0.02,
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
    content:       _scoreContent(item, m),
    organisation:  _scoreOrganisation(item, m, level),
    language:      _scoreLanguage(item, m),
    taskFulfilment:_scoreTaskFulfilment(item, m),
  };
  const { weakest } = _findStrongWeak(d);
  const tips = {
    content:       'Add more specific details or cover a required point.',
    organisation:  'Try adding a connector like "however", "because", or "finally".',
    language:      'Check punctuation — each sentence needs a full stop or question mark.',
    taskFulfilment:'Re-read the task — are you covering everything asked?',
  };
  return { words: m.words, target: m.target, score: _weightedScore(d), weakest, tip: tips[weakest] || 'Keep going!' };
}

// ── Backward-compatible wrappers ──────────────────────────────────────────────
// Kept so any external code that imported the old API still works.

export function evaluateWritingSubmission(item, text, level) {
  const r = evaluateWriting(item, text, level);
  return {
    words:         r.metrics.words,
    sentenceCount: r.metrics.sentenceCount,
    requiredHits:  r.metrics.requiredHits,
    requiredTotal: r.metrics.requiredTotal,
    dimensions:    r.dimensions,
    score:         r.score,
    passed:        r.passed,
  };
}

export function getWritingLiveFeedback(item, text, level) {
  const hint = getLiveHint(item, text, level);
  return {
    result:        { score: hint.score, words: hint.words, dimensions: {} },
    strongest:     hint.weakest === 'content' ? 'organisation' : 'content',
    weakest:       hint.weakest,
    tip:           hint.tip,
    progressLabel: `Words ${hint.words}/${hint.target}`,
  };
}

function _emptyResult() {
  return {
    metrics:       { words: 0, sentenceCount: 0, requiredHits: 0, requiredTotal: 0,
                     checkResults: [], firstSentence: '' },
    dimensions:    { content: 0, organisation: 0, language: 0, taskFulfilment: 0 },
    score: 0, passed: false, stars: 0,
    strongest: 'content', weakest: 'taskFulfilment',
    revisionMission: 'Write at least one complete sentence to receive feedback.',
    encouragement:   'Start writing — feedback appears once you have typed a response.',
    requiredCoverage: 0, checkResults: [], feedback: {},
  };
}
