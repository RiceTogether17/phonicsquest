/**
 * PhonicsQuest – Dashboard Insights Module
 *
 * Computes structured, actionable insights from store data.
 * Used by the parent dashboard to surface real guidance beyond charts.
 * All data is derived from actual store state — no fake placeholders.
 */

import { store } from './store.js';
import { getActiveProfile } from './profiles.js';
import { humaniseSkill } from './recommendations.js';

const SHORT_VOWEL_GROUPS = ['short-a', 'short-e', 'short-i', 'short-o', 'short-u'];
const VOWEL_LABELS = {
  'short-a': 'Short A', 'short-e': 'Short E',
  'short-i': 'Short I', 'short-o': 'Short O', 'short-u': 'Short U',
};

// ── Internal helpers ───────────────────────────────────────────────────────

function _avgQuestScore(questKey) {
  const bucket = (store.get('questMastery') || {})[questKey] || {};
  const scores = Object.values(bucket).filter(s => typeof s === 'number');
  if (!scores.length) return null;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function _clueAccuracyRaw(questKey) {
  const cs = store.get('clueStats') || {};
  const b = cs[questKey];
  if (!b) return null;
  if (questKey === 'sentenceForge') {
    const total = (b.correct || 0) + (b.incorrect || 0);
    return total > 0 ? { accuracy: b.correct / total, attempted: total } : null;
  }
  const total = b.attempted || 0;
  if (!total) return null;
  return {
    accuracy: ((b.strong || 0) + (b.partial || 0) * 0.5) / total,
    attempted: total,
    strong: b.strong || 0, partial: b.partial || 0, weak: b.weak || 0,
  };
}

function _weakestQuestSkill(questKey) {
  const bucket = (store.get('questMastery') || {})[questKey] || {};
  if (!Object.keys(bucket).length) return null;
  let weakest = null, lowest = Infinity;
  for (const [skill, score] of Object.entries(bucket)) {
    if (score < lowest) { lowest = score; weakest = skill; }
  }
  return weakest ? { skill: weakest, score: lowest } : null;
}

function _weakestPhonicsGroup() {
  const gm = store.get('groupMastery') || {};
  let weakest = null, lowest = Infinity;
  for (const g of SHORT_VOWEL_GROUPS) {
    const s = gm[g];
    if (typeof s === 'number' && s < lowest) { lowest = s; weakest = g; }
  }
  return weakest;
}

function _recentQuestAccuracy(questKey, n = 10) {
  const attempts = (store.get('questAttempts') || [])
    .filter(a => a.quest === questKey).slice(0, n);
  if (attempts.length < 3) return null;
  return attempts.filter(a => a.correct).length / attempts.length;
}

function _interpretClueVsAnswer(clueAcc, answerAcc) {
  if (clueAcc === null) return null;
  if (clueAcc >= 0.7 && answerAcc !== null && answerAcc >= 0.7)
    return 'Finding clues and answering correctly';
  if (clueAcc >= 0.7 && answerAcc !== null && answerAcc < 0.55)
    return 'Finds clue but chooses wrong answer';
  if (clueAcc < 0.5 && answerAcc !== null && answerAcc < 0.5)
    return 'Misses clue and answer — needs focused practice';
  if (clueAcc < 0.5 && answerAcc !== null && answerAcc >= 0.65)
    return 'Answering correctly but clue work still weak';
  if (clueAcc >= 0.5 && clueAcc < 0.7) return 'Developing clue detection skills';
  return 'Building understanding';
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Compute a concise learner summary panel.
 * @returns {{ learnerType, profileName, profileAvatar, strongest, weakest, currentFocus }}
 */
export function getLearnerSummary() {
  const profile = getActiveProfile();
  const gm = store.get('groupMastery') || {};
  const learnerType = profile?.schoolLevel === 'primary' ? 'Primary' : 'Preschool';

  const phonicsEntries = SHORT_VOWEL_GROUPS
    .map(g => ({ label: VOWEL_LABELS[g], score: gm[g] ?? null }))
    .filter(e => e.score !== null);

  const sorted = [...phonicsEntries].sort((a, b) => b.score - a.score);
  const strongestPhonics = sorted[0];
  const weakestPhonics   = sorted[sorted.length - 1];

  const domains = [
    { name: 'Grammar Cloze',    score: _avgQuestScore('clozeCastle') },
    { name: 'Sentence Skills',  score: _avgQuestScore('sentenceForge') },
    { name: 'Vocabulary Cloze', score: _avgQuestScore('wordVault') },
  ].filter(d => d.score !== null).sort((a, b) => b.score - a.score);

  const strongest = domains[0]?.name
    || (strongestPhonics ? `Phonics (${strongestPhonics.label})` : 'Not enough data yet');
  const weakest = domains[domains.length - 1]?.name
    || (weakestPhonics ? `Phonics (${weakestPhonics.label})` : 'Not enough data yet');

  let currentFocus = 'Building foundations';
  if (profile?.schoolLevel === 'primary') {
    const sfScore = _avgQuestScore('sentenceForge');
    const ccScore = _avgQuestScore('clozeCastle');
    const wvScore = _avgQuestScore('wordVault');
    if (sfScore !== null && sfScore < 0.6) currentFocus = 'Sentence structure skills';
    else if (ccScore !== null && ccScore < 0.6) currentFocus = 'Grammar cloze passages';
    else if (wvScore !== null && wvScore < 0.6) currentFocus = 'Vocabulary in context';
    else currentFocus = 'Advanced sentence and grammar skills';
  } else {
    const weak = _weakestPhonicsGroup();
    if (weak && (gm[weak] ?? 0) < 0.6) {
      currentFocus = `Short vowel sounds (${VOWEL_LABELS[weak] || weak})`;
    } else if (!phonicsEntries.length) {
      currentFocus = 'Starting phonics journey';
    } else {
      currentFocus = 'Phonics blending and awareness';
    }
  }

  return {
    learnerType,
    profileName:   profile?.name   || 'Learner',
    profileAvatar: profile?.avatar || '🦉',
    strongest,
    weakest,
    currentFocus,
  };
}

/**
 * Compute per-domain literacy scores for the dashboard domains panel.
 * Returns an array of domain objects with real-data scores (null = no data).
 */
export function getLiteracyDomains() {
  const gm = store.get('groupMastery') || {};
  const cs = store.get('clueStats') || {};

  const phonicsScores = SHORT_VOWEL_GROUPS
    .map(g => gm[g]).filter(s => typeof s === 'number');
  const phonicsScore = phonicsScores.length
    ? phonicsScores.reduce((a, b) => a + b, 0) / phonicsScores.length
    : null;

  // Clue detection: average across quests with data
  const clueAccuracies = [];
  const ccRaw = _clueAccuracyRaw('clozeCastle');
  if (ccRaw) clueAccuracies.push(ccRaw.accuracy);
  const sfRaw = _clueAccuracyRaw('sentenceForge');
  if (sfRaw) clueAccuracies.push(sfRaw.accuracy);
  const wvRaw2 = _clueAccuracyRaw('wordVault');
  if (wvRaw2) clueAccuracies.push(wvRaw2.accuracy);
  const clueDetection = clueAccuracies.length
    ? clueAccuracies.reduce((a, b) => a + b, 0) / clueAccuracies.length
    : null;

  return [
    { id: 'phonics',        label: 'Phonics / Decoding',  icon: '🔤', score: phonicsScore,                    color: '#3b82f6' },
    { id: 'sentenceSkills', label: 'Sentence Skills',      icon: '🔨', score: _avgQuestScore('sentenceForge'), color: '#f97316' },
    { id: 'grammarCloze',   label: 'Grammar Cloze',        icon: '🏰', score: _avgQuestScore('clozeCastle'),  color: '#a855f7' },
    { id: 'vocabCloze',     label: 'Vocabulary Cloze',     icon: '🔑', score: _avgQuestScore('wordVault'),    color: '#0d9488' },
    { id: 'clueDetection',  label: 'Clue Detection',       icon: '🔍', score: clueDetection,                  color: '#f59e0b' },
  ];
}

/**
 * Compute clue accuracy vs. answer accuracy insights per quest.
 * Returns { questInsights: [...], byType: [...] }
 */
export function getClueInsights() {
  const clueStats = store.get('clueStats') || {};
  const questAttempts = store.get('questAttempts') || [];
  const questInsights = [];

  const quests = [
    { key: 'clozeCastle', label: 'Cloze Castle', icon: '🏰' },
    { key: 'wordVault',   label: 'Word Vault',   icon: '🔑' },
    { key: 'sentenceForge', label: 'Sentence Forge', icon: '🔨' },
  ];

  for (const { key, label, icon } of quests) {
    const raw = _clueAccuracyRaw(key);
    if (!raw) continue;
    const ansAttempts = questAttempts.filter(a => a.quest === key);
    const answerAcc = ansAttempts.length >= 3
      ? ansAttempts.filter(a => a.correct).length / ansAttempts.length
      : null;
    questInsights.push({
      quest: label, icon,
      clueAttempted: raw.attempted,
      clueAccuracy:  raw.accuracy,
      answerAccuracy: answerAcc,
      interpretation: _interpretClueVsAnswer(raw.accuracy, answerAcc),
    });
  }

  // By-type breakdown (only types with ≥3 attempts)
  const byType = Object.entries(clueStats.byType || {})
    .filter(([, b]) => b.attempted >= 3)
    .map(([type, b]) => ({
      type: humaniseSkill(type),
      accuracy: ((b.strong || 0) + (b.partial || 0) * 0.5) / b.attempted,
      attempted: b.attempted,
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  return { questInsights, byType };
}

/**
 * Generate up to 3 explicit, actionable recommended next steps.
 * Each includes why, target, and CTA.
 */
export function getRecommendedActions() {
  const profile = getActiveProfile();
  const isPrimary = profile?.schoolLevel === 'primary';
  const gm = store.get('groupMastery') || {};
  const actions = [];

  if (!isPrimary) {
    // Preschool: phonics first
    const weak = _weakestPhonicsGroup();
    const weakScore = weak ? (gm[weak] ?? 0) : null;
    if (weak && weakScore < 0.65) {
      const pct = Math.round(weakScore * 100);
      actions.push({
        why: `${VOWEL_LABELS[weak]} decoding accuracy is ${pct}% — below the 65% target.`,
        target: `Phonics – ${VOWEL_LABELS[weak]}`,
        ctaLabel: 'Practise Blend It!', ctaTarget: 'blend', ctaGroup: weak,
      });
    }

    const phonicsScores = SHORT_VOWEL_GROUPS.map(g => gm[g] ?? 0);
    const avg = phonicsScores.reduce((a, b) => a + b, 0) / phonicsScores.length;
    if (avg >= 0.6) {
      actions.push({
        why: 'Phonics foundation is building well. Sight words extend reading fluency.',
        target: 'Sight Words',
        ctaLabel: 'Try Sight Words', ctaTarget: 'sight-words',
      });
    }

    actions.push({
      why: 'Reading decodable stories reinforces all phonics skills in context.',
      target: 'Giri Stories',
      ctaLabel: 'Read a Story', ctaTarget: 'stories',
    });
  } else {
    // Primary: quest-focused
    const ccRaw = _clueAccuracyRaw('clozeCastle');
    if (ccRaw && ccRaw.accuracy < 0.6) {
      const ccWeak = _weakestQuestSkill('clozeCastle');
      const pct = Math.round(ccRaw.accuracy * 100);
      actions.push({
        why: `Grammar clue accuracy is ${pct}%.${ccWeak ? ` Weakest area: ${humaniseSkill(ccWeak.skill)}.` : ''}`,
        target: `Cloze Castle${ccWeak ? ` – ${humaniseSkill(ccWeak.skill)}` : ''}`,
        ctaLabel: 'Practise Cloze Castle', ctaTarget: 'cloze-castle',
      });
    }

    const sfWeak = _weakestQuestSkill('sentenceForge');
    const sfAcc = _recentQuestAccuracy('sentenceForge');
    if ((sfAcc !== null && sfAcc < 0.65) || (sfWeak && sfWeak.score < 0.55)) {
      actions.push({
        why: sfWeak
          ? `Sentence skill "${humaniseSkill(sfWeak.skill)}" scores ${Math.round(sfWeak.score * 100)}% — needs practice.`
          : 'Recent sentence building accuracy is below target.',
        target: `Sentence Forge${sfWeak ? ` – ${humaniseSkill(sfWeak.skill)}` : ''}`,
        ctaLabel: 'Try Sentence Forge', ctaTarget: 'sentence-forge',
      });
    }

    const wvRaw = _clueAccuracyRaw('wordVault');
    if (wvRaw && wvRaw.accuracy < 0.6) {
      actions.push({
        why: `Vocabulary context clue accuracy is ${Math.round(wvRaw.accuracy * 100)}%.`,
        target: 'Word Vault – Context Clues',
        ctaLabel: 'Practise Word Vault', ctaTarget: 'word-vault',
      });
    }

    // Fallback if no weaknesses found
    if (!actions.length) {
      actions.push(
        { why: 'Keep grammar skills sharp with regular practice.', target: 'Cloze Castle', ctaLabel: 'Open Cloze Castle', ctaTarget: 'cloze-castle' },
        { why: 'Consistent sentence structure practice builds academic writing.', target: 'Sentence Forge', ctaLabel: 'Open Sentence Forge', ctaTarget: 'sentence-forge' },
      );
    }
  }

  return actions.slice(0, 3);
}

/**
 * Generate recent learning pattern insights from real data.
 * Only shows insights that can actually be derived — no invented trends.
 * @returns {string[]}
 */
export function getRecentPatternInsights() {
  const insights = [];
  const wordHistory = store.get('wordHistory') || [];
  const questAttempts = store.get('questAttempts') || [];
  const clueStats = store.get('clueStats') || {};

  // Accuracy trend: last 7 days vs. prior 7 days
  const now = Date.now();
  const WEEK = 7 * 24 * 60 * 60 * 1000;
  const recent = wordHistory.filter(h => h.timestamp && now - new Date(h.timestamp).getTime() < WEEK);
  const prior  = wordHistory.filter(h => {
    if (!h.timestamp) return false;
    const age = now - new Date(h.timestamp).getTime();
    return age >= WEEK && age < 2 * WEEK;
  });

  if (recent.length >= 5 && prior.length >= 5) {
    const rAcc = recent.filter(h => h.correct).length / recent.length;
    const pAcc = prior.filter(h => h.correct).length / prior.length;
    if (rAcc > pAcc + 0.1)      insights.push('Accuracy has improved over the last 7 days');
    else if (rAcc < pAcc - 0.1) insights.push('Accuracy has dipped recently — more practice will help');
  }

  // Weak clue types (≥3 attempts, <45% accuracy)
  const byType = clueStats.byType || {};
  const weakTypes = Object.entries(byType)
    .filter(([, b]) => b.attempted >= 3)
    .filter(([, b]) => ((b.strong || 0) + (b.partial || 0) * 0.5) / b.attempted < 0.45)
    .map(([t]) => humaniseSkill(t));
  if (weakTypes.length > 0) insights.push(`Struggled with ${weakTypes[0]} clues recently`);

  // Sentence Forge coverage
  if (questAttempts.filter(a => a.quest === 'sentenceForge').length < 3) {
    insights.push('Not enough data yet in Sentence Forge');
  }

  // Strong clue types
  const strongTypes = Object.entries(byType)
    .filter(([, b]) => b.attempted >= 3)
    .filter(([, b]) => ((b.strong || 0) + (b.partial || 0) * 0.5) / b.attempted >= 0.75)
    .map(([t]) => humaniseSkill(t));
  if (strongTypes.length > 0) insights.push(`Strong in ${strongTypes[0]} passages`);

  if (!insights.length && wordHistory.length < 10) {
    insights.push('Keep playing to see learning pattern insights here');
  }

  return insights.slice(0, 4);
}
