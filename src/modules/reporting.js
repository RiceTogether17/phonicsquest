/**
 * Parent reporting helpers for cross-quest category progress views.
 */

import { store } from './store.js';
import { VOCAB_CATEGORIES } from '../data/vocabPassages.js';
import { GRAMMAR_CATEGORIES } from '../data/passages.js';
import { alignmentFor, describeAlignmentStatus } from '../data/syllabusCrosswalk.js';

/**
 * How much a weak category counts when ranking what to practise next.
 *
 * Audit 2026-09-19, finding 25: this was headed "MOE/PSLE-heavy grammar
 * focus", and the recommendation it produced was shown to parents as
 * "MOE-priority grammar focus: …". These weights are PhonicsQuest's own
 * editorial judgement about what is worth revisiting. Nobody checked them
 * against a syllabus, so they may not borrow its authority.
 */
const PRIORITY_WEIGHTS = {
  // Grammar the app weights most heavily in revision.
  pronouns: 1.25,
  connectorClue: 1.2,
  conditionals: 1.2,
  passiveVoice: 1.15,
  reportedSpeech: 1.15,
  tenses: 1.2,
  modals: 1.2,
  // vocabulary emphasis
  morphologicalAffix: 1.15,
  synonymContrast: 1.1,
  collocationCloze: 1.15,
  scienceTechTerms: 1.1,
  socialStudiesVocab: 1.1,
};

function _priorityScore(row) {
  const w = PRIORITY_WEIGHTS[row.key] || 1;
  const attemptsPenalty = row.attempts === 0 ? 0.1 : 0;
  return (1 - (row.accuracy || 0)) * w + attemptsPenalty;
}

/**
 * The syllabus index, for a parent who wants to read it themselves.
 *
 * It used to hang off every category row beside an invented outcome code,
 * which read as "this category maps to that syllabus". It is now offered once,
 * next to `describeAlignmentStatus()`, which says no mapping exists.
 */
export const MOE_SYLLABUS_LINK = 'https://www.moe.gov.sg/primary/curriculum/syllabus';

function _accuracy(correct, total) {
  return total > 0 ? correct / total : 0;
}

function _collectQuestAccuracy(quest, categoryKeys) {
  const attempts = store.get('questAttempts') || [];

  return categoryKeys.map((key) => {
    const rows = attempts.filter((a) => a.quest === quest && a.skill === key);
    const total = rows.length;
    const correct = rows.filter((a) => a.correct).length;
    return {
      key,
      attempts: total,
      correct,
      accuracy: _accuracy(correct, total),
    };
  });
}

export function getVocabularyCategoryReport() {
  const categories = Object.keys(VOCAB_CATEGORIES);
  const rows = _collectQuestAccuracy('wordVault', categories);
  const clue = store.get('clueStats')?.wordVault || {
    attempted: 0,
    strong: 0,
    partial: 0,
    weak: 0,
  };
  const clueSuccess =
    clue.attempted > 0 ? ((clue.strong || 0) + (clue.partial || 0)) / clue.attempted : 0;

  return rows.map((r) => ({
    ...r,
    label: VOCAB_CATEGORIES[r.key]?.label || r.key,
    tooltip: VOCAB_CATEGORIES[r.key]?.desc || 'Vocabulary development category',
    // Null until a teacher-reviewed crosswalk entry exists. Audit finding 25.
    alignment: alignmentFor(r.key),
    clueSuccess,
  }));
}

export function getGrammarCategoryReport() {
  const categories = Object.keys(GRAMMAR_CATEGORIES);
  const rows = _collectQuestAccuracy('clozeCastle', categories);
  const clue = store.get('clueStats')?.clozeCastle || {
    attempted: 0,
    strong: 0,
    partial: 0,
    weak: 0,
  };
  const clueSuccess =
    clue.attempted > 0 ? ((clue.strong || 0) + (clue.partial || 0)) / clue.attempted : 0;

  return rows.map((r) => ({
    ...r,
    label: GRAMMAR_CATEGORIES[r.key]?.label || r.key,
    tooltip: `${GRAMMAR_CATEGORIES[r.key]?.label || r.key} mastery`,
    alignment: alignmentFor(r.key),
    clueSuccess,
  }));
}

/**
 * The categories worth revisiting first, by this app's own weighting.
 *
 * Renamed from `getMoePriorityRecommendations` (audit finding 25): the
 * priority is PhonicsQuest's, not MOE's.
 */
/**
 * What the app may claim about syllabus alignment, and the link to read it.
 *
 * One place, one sentence. Audit finding 25.
 */
export function getAlignmentDisclosure() {
  return { statement: describeAlignmentStatus(), syllabusLink: MOE_SYLLABUS_LINK };
}

export function getPracticePriorityRecommendations() {
  const vocab = getVocabularyCategoryReport()
    .map((r) => ({ ...r, priorityScore: _priorityScore(r) }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);

  const grammar = getGrammarCategoryReport()
    .map((r) => ({ ...r, priorityScore: _priorityScore(r) }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);

  return { vocab, grammar };
}

export function getLearningFunnelReport({ days = 7 } = {}) {
  const events = store.get('learningEvents') || [];
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recent = events.filter((e) => {
    const ts = Date.parse(e.timestamp || '');
    return Number.isFinite(ts) && ts >= cutoff;
  });

  const attempts = recent.filter((e) => e.eventType === 'quest_attempt');
  const withResponse = attempts.filter((e) => typeof e.responseMs === 'number');
  const correct = attempts.filter((e) => e.correct === true).length;
  const avgResponseMs = withResponse.length
    ? Math.round(withResponse.reduce((sum, e) => sum + e.responseMs, 0) / withResponse.length)
    : null;

  const byQuest = ['sentenceForge', 'clozeCastle', 'wordVault'].map((quest) => {
    const rows = attempts.filter((e) => e.quest === quest);
    const total = rows.length;
    const right = rows.filter((e) => e.correct === true).length;
    return {
      quest,
      attempts: total,
      accuracy: total > 0 ? right / total : 0,
    };
  });

  return {
    days,
    attempts: attempts.length,
    correct,
    accuracy: attempts.length ? correct / attempts.length : 0,
    avgResponseMs,
    byQuest,
  };
}

export function getAdaptiveLessonQueue({ limit = 6 } = {}) {
  const { vocab, grammar } = getPracticePriorityRecommendations();
  const funnel = getLearningFunnelReport({ days: 7 });

  const queue = [];
  for (const r of vocab) {
    queue.push({
      quest: 'wordVault',
      skill: r.key,
      label: r.label,
      alignment: r.alignment,
      reason: `Low mastery (${Math.round(r.accuracy * 100)}%) in ${r.label}`,
      targetAccuracy: 0.85,
    });
  }
  for (const r of grammar) {
    queue.push({
      quest: 'clozeCastle',
      skill: r.key,
      label: r.label,
      alignment: r.alignment,
      reason: `Grammar we weight highly in revision: ${r.label}`,
      targetAccuracy: 0.85,
    });
  }

  // If response speed is very slow, add a confidence/speed item in Sentence Forge.
  if (funnel.avgResponseMs !== null && funnel.avgResponseMs > 3500) {
    queue.unshift({
      quest: 'sentenceForge',
      skill: 'fluency',
      label: 'Sentence fluency sprint',
      reason: `Average response time is ${funnel.avgResponseMs}ms (target < 3000ms).`,
      targetAccuracy: 0.8,
    });
  }

  // Deduplicate by quest+skill and cap.
  const seen = new Set();
  const deduped = [];
  for (const item of queue) {
    const key = `${item.quest}:${item.skill}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
    if (deduped.length >= limit) break;
  }
  return deduped;
}

export function getLatestQuestScoreboards() {
  const attempts = store.get('questAttempts') || [];
  const byQuest = ['sentenceForge', 'clozeCastle', 'wordVault'].map((quest) => {
    const rows = attempts.filter((a) => a.quest === quest).slice(0, 12);
    const total = rows.length;
    const correct = rows.filter((a) => a.correct).length;
    const accuracy = _accuracy(correct, total);
    return { quest, total, correct, accuracy };
  });
  return byQuest;
}
