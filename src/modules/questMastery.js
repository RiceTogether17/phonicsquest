/**
 * Quest mastery service
 *
 * Centralizes quest-skill mastery updates and quest attempt telemetry.
 * Uses exponential moving average so mastery responds quickly while
 * still smoothing noisy single-attempt results.
 */

import { store } from './store.js';
import { EVIDENCE, isMasteryEvidence, confidenceFor } from './evidence.js';

const DEFAULT_MASTERY = 0.5;

/**
 * Skill IDs that name the SAME construct in different quests.
 *
 * Audit 2026-09-19, finding 15. One table used to serve two incompatible
 * purposes: "these are the same thing measured in two places" and "these are
 * related, so practising one suggests the other". Averaging across the second
 * kind lets success in one skill speak for a skill the child has never
 * attempted — the audit's example is comparatives standing in for
 * superlatives.
 *
 * Only genuine same-construct pairs belong here, and they are all the same
 * grammar point assessed by a different quest: Grammar Cloze's
 * `preposition_clue` and Grammar MCQ's `prepositions` are one skill with two
 * names, so blending their scores is right.
 *
 * Everything that is merely adjacent moved to RELATED_SKILLS below.
 */
const SAME_CONSTRUCT_ALIASES = {
  // Connectors / conjunctions — the same "which joining word fits" judgement.
  connector_clue: ['connectorClue', 'connectors', 'conjunctions'],
  connectorClue: ['connector_clue', 'connectors', 'conjunctions'],
  connectors: ['connector_clue', 'connectorClue', 'conjunctions'],
  conjunctions: ['connector_clue', 'connectorClue', 'connectors'],

  // Prepositions (Grammar Cloze ↔ MCQ ↔ Vocab Cloze).
  preposition_clue: ['prepositions', 'grammarPrepositions'],
  prepositions: ['preposition_clue', 'grammarPrepositions'],
  grammarPrepositions: ['preposition_clue', 'prepositions'],

  // Subject-verb agreement (Grammar Cloze ↔ MCQ ↔ Vocab Cloze).
  svAgreement: ['grammarSVA'],
  grammarSVA: ['svAgreement'],

  // Articles (Grammar Cloze ↔ Vocab Cloze).
  articles: ['grammarArticles'],
  grammarArticles: ['articles'],
};

/**
 * Skills that are adjacent but NOT interchangeable.
 *
 * Used to suggest what to practise next, never averaged into a score. Each of
 * these pairs was in the alias table and had to come out:
 *
 *   simple past vs the continuous tenses   different aspect, not a harder
 *                                          version of the same thing
 *   comparatives vs superlatives           "taller" and "tallest" are taught
 *                                          together and assessed separately
 *   idioms vs proverbs                     related figurative language, but
 *                                          knowing one says little about the
 *                                          other
 *   conditionals vs connectors             a conditional is one use of a
 *                                          connector, not the same skill
 *
 * `tenseAwareness` stays linked to the individual tenses in this table for
 * recommendation purposes, because a weak specific tense is a good reason to
 * revisit tense awareness — but it no longer lends its score to them.
 */
const RELATED_SKILLS = {
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

  conditionals: ['connector_clue', 'connectorClue', 'connectors', 'conjunctions'],

  modal_order: ['modals'],
  modals: ['modal_order'],

  comparatives: ['superlatives'],
  superlatives: ['comparatives'],

  idiomaticExpressions: ['proverbsSayings'],
  proverbsSayings: ['idiomaticExpressions'],

  grammaticalRole: ['morphologicalAffix'],
  morphologicalAffix: ['grammaticalRole'],
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
  /**
   * Fold one result into a quest-skill score.
   *
   * @param {string} questKey
   * @param {string} skillKey
   * @param {boolean} correct
   * @param {object} [opts]
   * @param {number} [opts.alpha]        EMA weight (0.05..0.95)
   * @param {string} [opts.evidence]     how the answer was obtained; see
   *   `evidence.js`. Anything below `independent` is recorded as practice
   *   accuracy and leaves the mastery score untouched. Defaults to
   *   `independent`, which is what an unannotated answer-a-question mode
   *   already meant — callers whose result is self-reported, modelled or
   *   heuristic must say so explicitly.
   * @param {string} [opts.attemptId]    stable ID for one committed response.
   *   Supplying it makes the call idempotent: a repeated tap or a rerender
   *   cannot bank the same response twice, and a changed judgement replaces
   *   the previous one.
   * @returns {number} the mastery score after the call
   */
  updateSkill(questKey, skillKey, correct, opts = {}) {
    const alpha = typeof opts.alpha === 'number' ? _clamp(opts.alpha, 0.05, 0.95) : 0.2;
    const skill = _normalizeSkill(skillKey);
    const evidence = opts.evidence || EVIDENCE.INDEPENDENT;
    const attemptId = opts.attemptId || null;
    const isCorrect = !!correct;

    const scoreNow = () => this.getSkillScore(questKey, skill);

    // ── Idempotency ───────────────────────────────────────────────────────
    // One committed response, one record. Ten clicks of "I got this" are ten
    // renderings of a single judgement, not ten pieces of evidence.
    let priorOutcome = null;
    if (attemptId) {
      const applied = store.getAppliedAttempt(attemptId);
      if (applied) {
        if (applied.correct === isCorrect) return scoreNow(); // nothing changed
        priorOutcome = applied.correct; // judgement revised — replace it
      }
      store.setAppliedAttempt(attemptId, { quest: questKey, skill, correct: isCorrect });
    }

    // ── Evidence gate ─────────────────────────────────────────────────────
    // Supported, modelled, self-reported and heuristic results are practice.
    // They inform adaptive selection through `getPracticeRecord`, but they
    // may not be cited as mastery, so they never touch the mastery score.
    if (!isMasteryEvidence(evidence)) {
      if (priorOutcome !== null) {
        store.updateQuestPractice(questKey, skill, priorOutcome, -1);
      }
      store.updateQuestPractice(questKey, skill, isCorrect, 1);
      return scoreNow();
    }

    const prev = scoreNow();
    const next = prev * (1 - alpha) + (isCorrect ? 1 : 0) * alpha;

    store.updateQuestMastery(questKey, skill, next);

    // Count the sample behind the score, so a surface that reports it can say
    // whether it rests on one attempt or twenty. A revised judgement replaces
    // its predecessor rather than adding a second sample.
    // Audit 2026-09-19, finding 15.
    if (priorOutcome !== null) {
      store.updateQuestMasterySample(questKey, skill, priorOutcome, -1);
    }
    store.updateQuestMasterySample(questKey, skill, isCorrect, 1);

    return next;
  }

  /**
   * Practice accuracy below the independent-evidence bar.
   * @returns {{attempts: number, correct: number}}
   */
  getPracticeRecord(questKey, skillKey) {
    const practice = store.get('questPractice') || {};
    const rec = practice?.[questKey]?.[_normalizeSkill(skillKey)];
    return {
      attempts: rec?.attempts || 0,
      correct: rec?.correct || 0,
    };
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

  /**
   * Independent attempts behind a mastery score.
   * @returns {{attempts: number, correct: number}}
   */
  getSkillSample(questKey, skillKey) {
    const samples = store.get('questMasterySamples') || {};
    const rec = samples?.[questKey]?.[_normalizeSkill(skillKey)];
    return { attempts: rec?.attempts || 0, correct: rec?.correct || 0 };
  }

  /**
   * How much the score can be relied on, from its independent sample size.
   *
   * Audit 2026-09-19, finding 15: one answer in the six-item Quick Check was
   * enough to create a category signal, and the printed report showed it as a
   * percentage with nothing to say how thin it was. `'none'` and `'low'` are
   * the bands a parent-facing surface must label rather than present bare.
   *
   * @returns {'none'|'low'|'moderate'|'high'}
   */
  getSkillConfidence(questKey, skillKey) {
    return confidenceFor(this.getSkillSample(questKey, skillKey).attempts);
  }

  /**
   * True when a score rests on too few independent attempts to be reported as
   * a finding rather than a first impression.
   */
  isEarlyIndication(questKey, skillKey) {
    const band = this.getSkillConfidence(questKey, skillKey);
    return band === 'none' || band === 'low';
  }

  /**
   * A skill's score blended across the quests that assess the SAME construct.
   *
   * Only SAME_CONSTRUCT_ALIASES are averaged. Related-but-different skills are
   * deliberately excluded: averaging them let comparatives speak for
   * superlatives. Audit 2026-09-19, finding 15.
   */
  getUnifiedSkillScore(skillKey, preferredQuest = null) {
    const normalized = _normalizeSkill(skillKey);
    const aliasKeys = [normalized, ...(SAME_CONSTRUCT_ALIASES[normalized] || [])];
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

  /** Skills worth suggesting alongside this one. Never used as a score. */
  getRelatedSkills(skillKey) {
    return [...(RELATED_SKILLS[_normalizeSkill(skillKey)] || [])];
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
