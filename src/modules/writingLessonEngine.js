/**
 * writingLessonEngine.js
 *
 * Lesson-level helpers: plan readiness, plan-to-draft validation,
 * paragraph mission checking (now section-aware), and remediation routing.
 */

const STOPWORDS = new Set([
  'the',
  'and',
  'with',
  'from',
  'that',
  'this',
  'have',
  'your',
  'then',
  'when',
  'while',
  'into',
  'just',
  'very',
  'they',
  'them',
  'their',
  'what',
  'were',
  'been',
  'will',
  'about',
  'also',
  'some',
  'more',
  'than',
  'each',
  'would',
  'could',
  'should',
  'there',
  'where',
]);

// ── Simple synonym map for common narrative words ───────────────────────────
// Used to broaden plan-to-draft keyword matching without NLP.
const SYNONYM_MAP = {
  scared: ['afraid', 'frightened', 'terrified', 'fearful'],
  happy: ['glad', 'joyful', 'delighted', 'pleased', 'cheerful'],
  sad: ['upset', 'unhappy', 'miserable', 'gloomy'],
  angry: ['furious', 'annoyed', 'frustrated', 'mad'],
  ran: ['sprinted', 'dashed', 'rushed', 'hurried'],
  walked: ['strolled', 'trudged', 'wandered', 'marched'],
  said: ['whispered', 'shouted', 'replied', 'muttered', 'exclaimed'],
  looked: ['stared', 'glanced', 'peered', 'gazed'],
  big: ['huge', 'enormous', 'massive', 'gigantic'],
  small: ['tiny', 'little', 'miniature', 'petite'],
  dark: ['dim', 'shadowy', 'gloomy', 'murky'],
  found: ['discovered', 'spotted', 'noticed', 'located'],
  helped: ['assisted', 'aided', 'supported', 'rescued'],
  friend: ['classmate', 'companion', 'buddy', 'pal'],
  rain: ['drizzle', 'downpour', 'shower', 'storm'],
  cold: ['chilly', 'freezing', 'icy', 'frosty'],
  hot: ['warm', 'scorching', 'boiling', 'sweltering'],
  problem: ['trouble', 'issue', 'challenge', 'difficulty'],
  idea: ['plan', 'thought', 'solution', 'suggestion'],
};

function _getSynonyms(word) {
  const lower = word.toLowerCase();
  const synonyms = SYNONYM_MAP[lower] || [];
  // Also check if the word is a synonym pointing back to a root
  for (const [root, syns] of Object.entries(SYNONYM_MAP)) {
    if (syns.includes(lower) && !synonyms.includes(root)) {
      synonyms.push(root, ...syns.filter((s) => s !== lower));
    }
  }
  return [...new Set(synonyms)];
}

// ── Plan Readiness ──────────────────────────────────────────────────────────

export function isPlanReady(
  plan,
  requiredSections = ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
) {
  return requiredSections.every((key) => (plan?.[key] || '').trim().length >= 6);
}

// ── Plan-to-Draft Validation (improved) ─────────────────────────────────────

/**
 * Extract meaningful keywords from a plan section value.
 * Now filters more aggressively and extracts multi-word phrases.
 */
function _extractPlanKeywords(text) {
  const lower = (text || '').toLowerCase();
  const words = lower.split(/[^a-z]+/).filter((w) => w.length >= 4 && !STOPWORDS.has(w));

  // Also extract 2-word phrases from the text
  const allWords = lower
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z]/g, ''))
    .filter(Boolean);
  const phrases = [];
  for (let i = 0; i < allWords.length - 1; i++) {
    const phrase = `${allWords[i]} ${allWords[i + 1]}`;
    if (
      allWords[i].length >= 3 &&
      allWords[i + 1].length >= 3 &&
      !STOPWORDS.has(allWords[i]) &&
      !STOPWORDS.has(allWords[i + 1])
    ) {
      phrases.push(phrase);
    }
  }

  return { words: [...new Set(words)].slice(0, 5), phrases: phrases.slice(0, 3) };
}

/**
 * Build synonyms for a set of keywords.
 */
function _expandWithSynonyms(words) {
  const expanded = new Set(words);
  for (const word of words) {
    for (const syn of _getSynonyms(word)) {
      expanded.add(syn);
    }
  }
  return [...expanded];
}

/**
 * Score how well a draft section matches plan keywords.
 * Returns 0..1 indicating overlap strength.
 */
function _scorePlanSectionMatch(planKeywords, draftText) {
  const lower = (draftText || '').toLowerCase();
  if (!lower || !planKeywords.words.length) return 0;

  const expandedWords = _expandWithSynonyms(planKeywords.words);
  const wordHits = expandedWords.filter((kw) => lower.includes(kw)).length;
  const wordScore = Math.min(wordHits / Math.max(planKeywords.words.length, 1), 1);

  // Phrase overlap bonus
  const phraseHits = planKeywords.phrases.filter((p) => lower.includes(p)).length;
  const phraseBonus =
    planKeywords.phrases.length > 0
      ? Math.min(phraseHits / planKeywords.phrases.length, 1) * 0.2
      : 0;

  return Math.min(wordScore + phraseBonus, 1);
}

/**
 * Convert plan into required checks with synonym-expanded keywords
 * and phrase overlap scoring.
 */
export function createPlanChecks(plan) {
  return Object.entries(plan || {})
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => {
      const extracted = _extractPlanKeywords(value);
      const expandedKeywords = _expandWithSynonyms(extracted.words);
      return {
        id: `plan-${key}`,
        label: `Planned ${key} appears in draft`,
        keywordsAny: expandedKeywords.slice(0, 8),
        _phrases: extracted.phrases,
        _sectionKey: key,
      };
    })
    .filter((check) => check.keywordsAny.length > 0);
}

/**
 * Detailed plan-to-draft match report. Returns per-section scores
 * and an overall match score.
 */
export function getPlanDraftMatchReport(plan, draftText) {
  const sections = {};
  let totalScore = 0;
  let sectionCount = 0;

  for (const [key, value] of Object.entries(plan || {})) {
    if (!value?.trim()) continue;
    const keywords = _extractPlanKeywords(value);
    const score = _scorePlanSectionMatch(keywords, draftText);
    const matchedWords = _expandWithSynonyms(keywords.words).filter((kw) =>
      (draftText || '').toLowerCase().includes(kw),
    );
    sections[key] = { score, matchedWords, totalKeywords: keywords.words.length };
    totalScore += score;
    sectionCount++;
  }

  return {
    sections,
    overallScore: sectionCount > 0 ? totalScore / sectionCount : 0,
    weakSections: Object.entries(sections)
      .filter(([, s]) => s.score < 0.4)
      .map(([key]) => key),
  };
}

// ── Section-Aware Paragraph Missions ────────────────────────────────────────

/**
 * Split text into approximate sections: opening (~25%), middle (~50%), ending (~25%).
 * Uses paragraph breaks if available, otherwise falls back to word-count slicing.
 */
function _splitIntoSections(text) {
  const t = (text || '').trim();
  if (!t) return { opening: '', middle: '', ending: '' };

  // Try paragraph-based splitting first
  const paragraphs = t
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 5);

  if (paragraphs.length >= 3) {
    const openCount = Math.max(1, Math.floor(paragraphs.length * 0.25));
    const endCount = Math.max(1, Math.floor(paragraphs.length * 0.25));
    const midStart = openCount;
    const midEnd = paragraphs.length - endCount;
    return {
      opening: paragraphs.slice(0, midStart).join(' '),
      middle: paragraphs.slice(midStart, Math.max(midEnd, midStart + 1)).join(' '),
      ending: paragraphs.slice(Math.max(midEnd, midStart + 1)).join(' '),
    };
  }

  // Fall back to sentence-based splitting
  const sentences = t.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 3);
  if (sentences.length >= 3) {
    const openCount = Math.max(1, Math.floor(sentences.length * 0.25));
    const endCount = Math.max(1, Math.floor(sentences.length * 0.25));
    return {
      opening: sentences.slice(0, openCount).join(' '),
      middle: sentences.slice(openCount, sentences.length - endCount).join(' '),
      ending: sentences.slice(sentences.length - endCount).join(' '),
    };
  }

  // Very short text — treat everything as middle
  return { opening: t, middle: t, ending: t };
}

// Mission position hints: which section a mission is expected to match
const POSITION_HINTS = {
  open: 'opening',
  opening: 'opening',
  begin: 'opening',
  start: 'opening',
  setting: 'opening',
  scene: 'opening',
  introduce: 'opening',
  climax: 'middle',
  surprise: 'middle',
  problem: 'middle',
  conflict: 'middle',
  build: 'middle',
  action: 'middle',
  dialogue: 'middle',
  end: 'ending',
  ending: 'ending',
  conclude: 'ending',
  conclusion: 'ending',
  resolution: 'ending',
  resolve: 'ending',
  reflect: 'ending',
  reflection: 'ending',
  learn: 'ending',
  lesson: 'ending',
  change: 'ending',
};

/**
 * Infer which section a mission should target based on its text.
 */
function _inferMissionSection(missionText) {
  const lower = (missionText || '').toLowerCase();
  for (const [hint, section] of Object.entries(POSITION_HINTS)) {
    if (lower.includes(hint)) return section;
  }
  return 'any'; // no position preference
}

function _normaliseMission(mission, idx) {
  if (typeof mission === 'string') {
    const inferred = mission
      .toLowerCase()
      .split(/[^a-z]+/)
      .filter((w) => w.length > 4)
      .slice(0, 2);
    return {
      id: `mission-${idx}`,
      text: mission,
      keywordsAny: inferred,
      expectedSection: _inferMissionSection(mission),
    };
  }
  return {
    id: mission.id || `mission-${idx}`,
    text: mission.text || '',
    keywordsAny: mission.keywordsAny || [],
    expectedSection: mission.expectedSection || _inferMissionSection(mission.text || ''),
  };
}

/**
 * Check paragraph missions against the draft, now section-aware.
 * A mission targeting "opening" is checked primarily against the opening section.
 * Falls back to full-text check if section check fails (backward compatible).
 */
export function getParagraphMissionStatus(lesson, text = '') {
  const lower = (text || '').toLowerCase();
  const sections = _splitIntoSections(text || '');
  const missions = (lesson.paragraphMissions || []).map(_normaliseMission);

  return missions.map((mission) => {
    if (mission.keywordsAny.length === 0) return { ...mission, hit: false, sectionMatch: false };

    const expectedSection = mission.expectedSection;
    const targetText =
      expectedSection !== 'any' && sections[expectedSection]
        ? sections[expectedSection].toLowerCase()
        : null;

    // Check target section first
    const sectionHit = targetText
      ? mission.keywordsAny.some((kw) => targetText.includes(kw.toLowerCase()))
      : false;

    // Fallback to full-text check
    const fullHit = mission.keywordsAny.some((kw) => lower.includes(kw.toLowerCase()));

    return {
      ...mission,
      hit: sectionHit || fullHit,
      sectionMatch: sectionHit,
    };
  });
}

// ── Lesson Merging ──────────────────────────────────────────────────────────

export function mergeLessonWithPlan(lesson, plan) {
  const planChecks = createPlanChecks(plan);
  const missionChecks = getParagraphMissionStatus(lesson)
    .map((m) => ({ id: m.id, label: m.text, keywordsAny: m.keywordsAny }))
    .filter((m) => m.keywordsAny?.length);
  return {
    ...lesson,
    requiredChecks: [...(lesson.requiredChecks || []), ...missionChecks, ...planChecks],
  };
}

// ── Remediation Routing ─────────────────────────────────────────────────────

export function getRemediationPath(result) {
  const missingChecks = (result?.checkResults || [])
    .filter((check) => !check.hit)
    .map((check) => check.label);
  const weak = result?.weakest || 'content';
  const missionByWeakness = {
    content: 'Detail Boost Mission: add one sensory clue and one precise action.',
    organisation: 'Bridge Builder Mission: add connectors to fix event order.',
    language: 'Language Fix Mission: repair punctuation and improve one verb.',
    taskFulfilment: 'Checkpoint Rescue Mission: complete all missing task checkpoints.',
  };

  // Generate targeted prompts for each weak dimension
  const nq = result?.metrics?.narrativeQuality || {};
  const narrativePrompts = [];
  if (nq.climax !== undefined && nq.climax < 0.3) {
    narrativePrompts.push(
      'Add a clear turning point with a surprise marker (e.g. "suddenly", "just then").',
    );
  }
  if (nq.resolution !== undefined && nq.resolution < 0.3) {
    narrativePrompts.push('Show how the problem was solved at the end.');
  }
  if (nq.reflection !== undefined && nq.reflection < 0.3) {
    narrativePrompts.push('End with what the character learned or felt.');
  }
  if (nq.dialogue !== undefined && nq.dialogue < 0.3 && result?.metrics?.hasDialogue) {
    narrativePrompts.push('Make dialogue show a decision or feeling, not just greetings.');
  }

  return {
    title: missionByWeakness[weak] || missionByWeakness.content,
    missingChecks,
    narrativePrompts,
    weakestDimension: weak,
  };
}

// Exported for testing
export { _extractPlanKeywords, _expandWithSynonyms, _splitIntoSections, _inferMissionSection };
