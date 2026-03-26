const STOPWORDS = new Set(['the', 'and', 'with', 'from', 'that', 'this', 'have', 'your', 'then', 'when', 'while', 'into', 'just', 'very']);

export function isPlanReady(plan, requiredSections = ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion']) {
  return requiredSections.every((key) => (plan?.[key] || '').trim().length >= 6);
}

export function createPlanChecks(plan) {
  return Object.entries(plan || {})
    .filter(([, value]) => value?.trim())
    .map(([key, value]) => {
      const keywordsAny = value
        .toLowerCase()
        .split(/[^a-z]+/)
        .filter((word) => word.length >= 4 && !STOPWORDS.has(word))
        .slice(0, 3);
      return { id: `plan-${key}`, label: `Planned ${key} appears in draft`, keywordsAny };
    })
    .filter((check) => check.keywordsAny.length > 0);
}

function _normaliseMission(mission, idx) {
  if (typeof mission === 'string') {
    const inferred = mission.toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 4).slice(0, 2);
    return { id: `mission-${idx}`, text: mission, keywordsAny: inferred };
  }
  return { id: mission.id || `mission-${idx}`, text: mission.text || '', keywordsAny: mission.keywordsAny || [] };
}

export function getParagraphMissionStatus(lesson, text = '') {
  const lower = (text || '').toLowerCase();
  const missions = (lesson.paragraphMissions || []).map(_normaliseMission);
  return missions.map((mission) => ({
    ...mission,
    hit: mission.keywordsAny.length === 0 ? false : mission.keywordsAny.some((kw) => lower.includes(kw.toLowerCase())),
  }));
}

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

export function getRemediationPath(result) {
  const missingChecks = (result?.checkResults || []).filter((check) => !check.hit).map((check) => check.label);
  const weak = result?.weakest || 'content';
  const missionByWeakness = {
    content: 'Detail Boost Mission: add one sensory clue and one precise action.',
    organisation: 'Bridge Builder Mission: add connectors to fix event order.',
    language: 'Language Fix Mission: repair punctuation and improve one verb.',
    taskFulfilment: 'Checkpoint Rescue Mission: complete all missing task checkpoints.',
  };
  return {
    title: missionByWeakness[weak] || missionByWeakness.content,
    missingChecks,
  };
}
