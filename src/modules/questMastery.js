/**
 * Quest mastery service
 *
 * Centralizes quest-skill mastery updates and quest attempt telemetry.
 * Uses exponential moving average so mastery responds quickly while
 * still smoothing noisy single-attempt results.
 */

import { store } from './store.js';

const DEFAULT_MASTERY = 0.5;

const CROSS_QUEST_SKILL_ALIASES = {
  // ── Grammar: connectors / conjunctions (Cloze ↔ MCQ) ──
  connector_clue: ['connectorClue', 'connectors', 'conditionals', 'conjunctions'],
  connectorClue: ['connector_clue', 'connectors', 'conditionals', 'conjunctions'],
  connectors: ['connector_clue', 'connectorClue', 'conditionals', 'conjunctions'],
  conditionals: ['connector_clue', 'connectorClue', 'connectors', 'conjunctions'],
  conjunctions: ['connector_clue', 'connectorClue', 'connectors', 'conditionals'],

  // ── Grammar: tenses (Cloze ↔ MCQ) ──
  tense_clue: [
    'simplePast',
    'presentCont',
    'pastCont',
    'futureTense',
    'perfectContinuousTenses',
    'presentPerfect',
    'pastPerfect',
    'tenseAwareness',
  ],
  simplePast: ['tense_clue', 'presentCont', 'pastCont', 'tenseAwareness'],
  presentCont: ['tense_clue', 'simplePast', 'pastCont', 'tenseAwareness'],
  pastCont: ['tense_clue', 'simplePast', 'presentCont', 'tenseAwareness'],
  presentPerfect: ['tense_clue', 'pastPerfect', 'tenseAwareness'],
  pastPerfect: ['tense_clue', 'presentPerfect', 'tenseAwareness'],
  tenseAwareness: [
    'tense_clue',
    'simplePast',
    'presentCont',
    'pastCont',
    'presentPerfect',
    'pastPerfect',
  ],

  // ── Grammar: modals ──
  modal_order: ['modals'],
  modals: ['modal_order'],

  // ── Grammar: prepositions (Cloze ↔ MCQ ↔ Vocab Cloze) ──
  preposition_clue: ['prepositions', 'grammarPrepositions'],
  prepositions: ['preposition_clue', 'grammarPrepositions'],
  grammarPrepositions: ['preposition_clue', 'prepositions'],

  // ── Grammar: SV agreement (Grammar Cloze ↔ MCQ ↔ Vocab Cloze) ──
  svAgreement: ['grammarSVA'],
  grammarSVA: ['svAgreement'],

  // ── Grammar: articles (Grammar Cloze ↔ Vocab Cloze) ──
  articles: ['grammarArticles'],
  grammarArticles: ['articles'],

  // ── Grammar: comparatives / superlatives ──
  comparatives: ['superlatives'],
  superlatives: ['comparatives'],

  // ── Grammar: passive / reported / relative / inversion ──
  passiveVoice: [],
  reportedSpeech: [],
  relativeClauses: [],
  inversion: [],

  // ── Vocabulary: context & synonyms (Cloze ↔ MCQ) ──
  contextInference: [],
  definitionMatch: [],
  synonymContrast: [],

  // ── Vocabulary: collocations (Cloze ↔ MCQ) ──
  collocationCloze: [],

  // ── Vocabulary: word form (Cloze ↔ MCQ) ──
  grammaticalRole: ['morphologicalAffix'],
  morphologicalAffix: ['grammaticalRole'],

  // ── Vocabulary: idioms (Cloze ↔ MCQ) ──
  idiomaticExpressions: ['proverbsSayings'],
  proverbsSayings: ['idiomaticExpressions'],
};

function _allQuestBuckets() {
  return Object.keys(store.get('questMastery') || {});
}

function _clamp(v, min = 0, max = 1) {
  return Math.max(min, Math.min(max, v));
}

function _normalizeSkill(skillKey) {
  return skillKey || 'mixed';
}

class QuestMasteryService {
  updateSkill(questKey, skillKey, correct, opts = {}) {
    const alpha = typeof opts.alpha === 'number' ? _clamp(opts.alpha, 0.05, 0.95) : 0.2;
    const skill = _normalizeSkill(skillKey);

    const mastery = store.get('questMastery') || {};
    const bucket = mastery[questKey] || {};
    const prev = typeof bucket[skill] === 'number' ? bucket[skill] : DEFAULT_MASTERY;
    const next = prev * (1 - alpha) + (correct ? 1 : 0) * alpha;

    store.updateQuestMastery(questKey, skill, next);
    return next;
  }

  recordAttempt({ quest, skill, correct, responseMs = null, level = null }) {
    const normalizedSkill = _normalizeSkill(skill);
    const payload = {
      quest,
      skill: normalizedSkill,
      correct: !!correct,
      responseMs,
      level,
    };
    store.recordQuestAttempt(payload);
    store.recordLearningEvent({
      eventType: 'quest_attempt',
      ...payload,
      meta: { source: 'questMastery' },
    });
  }

  getSkillScore(questKey, skillKey) {
    const mastery = store.get('questMastery') || {};
    const score = mastery?.[questKey]?.[_normalizeSkill(skillKey)];
    return typeof score === 'number' ? score : DEFAULT_MASTERY;
  }

  getUnifiedSkillScore(skillKey, preferredQuest = null) {
    const normalized = _normalizeSkill(skillKey);
    const aliasKeys = [normalized, ...(CROSS_QUEST_SKILL_ALIASES[normalized] || [])];
    const mastery = store.get('questMastery') || {};
    const quests = preferredQuest
      ? [preferredQuest, ..._allQuestBuckets().filter((q) => q !== preferredQuest)]
      : _allQuestBuckets();

    let total = 0;
    let count = 0;
    for (const quest of quests) {
      const bucket = mastery[quest] || {};
      for (const alias of aliasKeys) {
        const raw = bucket[_normalizeSkill(alias)];
        if (typeof raw === 'number') {
          total += raw;
          count++;
        }
      }
    }

    return count > 0 ? total / count : DEFAULT_MASTERY;
  }

  getRecommendedSkill(questKey, skillKeys = []) {
    if (!skillKeys.length) return null;

    let recommendation = null;
    let lowest = Infinity;

    for (const key of skillKeys) {
      const score = this.getUnifiedSkillScore(key, questKey);
      if (score < lowest) {
        lowest = score;
        recommendation = key;
      }
    }

    return recommendation;
  }
}

export const questMastery = new QuestMasteryService();
