/**
 * Quest mastery service
 *
 * Centralizes quest-skill mastery updates and quest attempt telemetry.
 * Uses exponential moving average so mastery responds quickly while
 * still smoothing noisy single-attempt results.
 */

import { store } from './store.js';

const DEFAULT_MASTERY = 0.5;

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
    store.recordQuestAttempt({
      quest,
      skill: _normalizeSkill(skill),
      correct: !!correct,
      responseMs,
      level,
    });
  }

  getSkillScore(questKey, skillKey) {
    const mastery = store.get('questMastery') || {};
    const score = mastery?.[questKey]?.[_normalizeSkill(skillKey)];
    return typeof score === 'number' ? score : DEFAULT_MASTERY;
  }

  getRecommendedSkill(questKey, skillKeys = []) {
    if (!skillKeys.length) return null;

    let recommendation = null;
    let lowest = Infinity;

    for (const key of skillKeys) {
      const score = this.getSkillScore(questKey, key);
      if (score < lowest) {
        lowest = score;
        recommendation = key;
      }
    }

    return recommendation;
  }
}

export const questMastery = new QuestMasteryService();
