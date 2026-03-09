/**
 * PhonicsQuest – Learner Recommendation Engine
 *
 * Generates data-driven recommendations from real store state.
 * Inspects schoolLevel, questMastery, clueStats, groupMastery, and wordHistory
 * to produce targeted, actionable guidance — no hardcoded fake results.
 */

import { store } from './store.js';
import { getActiveProfile } from './profiles.js';

const SHORT_VOWEL_GROUPS = ['short-a', 'short-e', 'short-i', 'short-o', 'short-u'];

const VOWEL_LABELS = {
  'short-a': 'Short A', 'short-e': 'Short E',
  'short-i': 'Short I', 'short-o': 'Short O', 'short-u': 'Short U',
};

/** Convert a skill/type key to a human-readable label. */
export function humaniseSkill(skill) {
  const map = {
    word_order: 'Word Order', first_word_clue: 'First Word Clue',
    time_order_clue: 'Time Order', connector_clue: 'Connectors',
    tense_clue: 'Verb Tense', punctuation_clue: 'Punctuation',
    subject_action_clue: 'Subject & Action', modal_order: 'Modal Verbs',
    clause_boundary: 'Clause Boundary', inversion_pattern: 'Inversion',
    comparison_structure: 'Comparisons', 'connector-clue': 'Connectors',
    'time-marker': 'Time Markers', 'contrast-clue': 'Contrast',
    'past-tense': 'Past Tense', comparatives: 'Comparatives',
    modals: 'Modal Verbs', Animals: 'Animals', Food: 'Food',
    School: 'School', Home: 'Home', Nature: 'Nature',
  };
  return map[skill] || skill.replace(/[-_]/g, ' ');
}

// ── Internal helpers ───────────────────────────────────────────────────────

function _groupMastery(group) {
  return (store.get('groupMastery') || {})[group] ?? 0;
}

function _avgShortVowelScore() {
  const gm = store.get('groupMastery') || {};
  const scores = SHORT_VOWEL_GROUPS.map(g => gm[g]).filter(s => typeof s === 'number');
  if (!scores.length) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
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

/** Clue accuracy ratio for a quest (0–1). Returns null if no data. */
function _clueAccuracy(questKey) {
  const cs = store.get('clueStats') || {};
  const b = cs[questKey];
  if (!b) return null;
  if (questKey === 'sentenceForge') {
    const total = (b.correct || 0) + (b.incorrect || 0);
    return total > 0 ? b.correct / total : null;
  }
  const total = b.attempted || 0;
  return total > 0 ? ((b.strong || 0) + (b.partial || 0) * 0.5) / total : null;
}

/** Weakest skill key+score within a quest's questMastery bucket. */
function _weakestQuestSkill(questKey) {
  const qm = store.get('questMastery') || {};
  const bucket = qm[questKey] || {};
  if (!Object.keys(bucket).length) return null;
  let weakest = null, lowest = Infinity;
  for (const [skill, score] of Object.entries(bucket)) {
    if (score < lowest) { lowest = score; weakest = skill; }
  }
  return weakest ? { skill: weakest, score: lowest } : null;
}

/** Recent quest accuracy for the last N attempts. Returns null if <3 attempts. */
function _recentQuestAccuracy(questKey, n = 10) {
  const attempts = (store.get('questAttempts') || [])
    .filter(a => a.quest === questKey).slice(0, n);
  if (attempts.length < 3) return null;
  return attempts.filter(a => a.correct).length / attempts.length;
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Generate the "Best Next Step" recommendation using real store data.
 * @returns {{ title, reason, ctaLabel, ctaTarget, ctaGroup?, domain, urgency }}
 */
export function getRecommendation() {
  const profile = getActiveProfile();
  return profile?.schoolLevel === 'primary'
    ? _primaryRec()
    : _preschoolRec();
}

function _preschoolRec() {
  const gm = store.get('groupMastery') || {};
  const weakGroup = _weakestPhonicsGroup();
  const phonicsAvg = _avgShortVowelScore();

  // Very weak short-vowel group → recommend blending practice
  if (weakGroup && _groupMastery(weakGroup) < 0.6) {
    const pct = Math.round(_groupMastery(weakGroup) * 100);
    return {
      title: `Practice ${VOWEL_LABELS[weakGroup]} Blending`,
      reason: `${VOWEL_LABELS[weakGroup]} accuracy is ${pct}% — below the 60% target.`,
      ctaLabel: 'Start Blend It!', ctaTarget: 'blend', ctaGroup: weakGroup,
      domain: 'Phonics', urgency: pct < 40 ? 'high' : 'medium',
    };
  }

  // Struggling with recent phonics attempts → Listen & Blend
  const history = store.get('wordHistory') || [];
  const recentPhonics = history.slice(0, 15)
    .filter(h => ['blend', 'classicBlend', 'hear', 'segment'].includes(h.mode));
  if (recentPhonics.length >= 5) {
    const acc = recentPhonics.filter(h => h.correct).length / recentPhonics.length;
    if (acc < 0.5) {
      return {
        title: 'Try Listen & Blend',
        reason: 'Recent phonics attempts are below 50%. Listening to sounds first can help.',
        ctaLabel: 'Listen & Blend', ctaTarget: 'classicBlend',
        domain: 'Phonics', urgency: 'high',
      };
    }
  }

  // Decent phonics → push sight words
  if (phonicsAvg >= 0.7) {
    return {
      title: 'Explore Sight Words',
      reason: 'Phonics is looking strong! Sight words extend reading fluency.',
      ctaLabel: 'Open Sight Words', ctaTarget: 'sight-words',
      domain: 'Sight Words', urgency: 'low',
    };
  }

  return {
    title: 'Start with Blend It!',
    reason: 'Build reading confidence by blending sounds step by step.',
    ctaLabel: 'Blend It!', ctaTarget: 'blend',
    domain: 'Phonics', urgency: 'low',
  };
}

function _primaryRec() {
  // Low clue accuracy in Cloze Castle → grammar focus
  const ccAcc = _clueAccuracy('clozeCastle');
  if (ccAcc !== null && ccAcc < 0.55) {
    const weak = _weakestQuestSkill('clozeCastle');
    return {
      title: 'Targeted Grammar Cloze Practice',
      reason: weak
        ? `Grammar clue accuracy is low. Weakest area: ${humaniseSkill(weak.skill)}.`
        : `Grammar clue accuracy is ${Math.round(ccAcc * 100)}% — needs work.`,
      ctaLabel: 'Open Cloze Castle', ctaTarget: 'cloze-castle',
      domain: 'Grammar Cloze', urgency: ccAcc < 0.4 ? 'high' : 'medium',
    };
  }

  // Low Sentence Forge accuracy → sentence skills focus
  const sfAcc = _recentQuestAccuracy('sentenceForge');
  const sfWeak = _weakestQuestSkill('sentenceForge');
  if ((sfAcc !== null && sfAcc < 0.6) || (sfWeak && sfWeak.score < 0.5)) {
    return {
      title: 'Strengthen Sentence Skills',
      reason: sfWeak
        ? `"${humaniseSkill(sfWeak.skill)}" skill needs practice (${Math.round(sfWeak.score * 100)}%).`
        : 'Recent sentence building accuracy is below target.',
      ctaLabel: 'Open Sentence Forge', ctaTarget: 'sentence-forge',
      domain: 'Sentence Skills', urgency: 'medium',
    };
  }

  // Low Word Vault clue accuracy
  const wvAcc = _clueAccuracy('wordVault');
  if (wvAcc !== null && wvAcc < 0.55) {
    const weak = _weakestQuestSkill('wordVault');
    return {
      title: 'Vocabulary Context Practice',
      reason: weak
        ? `Vocabulary clues are weak. Try the ${humaniseSkill(weak.skill)} category.`
        : `Vocabulary clue accuracy is ${Math.round(wvAcc * 100)}% — needs work.`,
      ctaLabel: 'Open Word Vault', ctaTarget: 'word-vault',
      domain: 'Vocabulary', urgency: 'medium',
    };
  }

  // No notable weakness → suggest next challenge
  return {
    title: 'Ready for a Challenge?',
    reason: 'Skills are in good shape. Keep building with advanced grammar and sentence work.',
    ctaLabel: 'Open Cloze Castle', ctaTarget: 'cloze-castle',
    domain: 'Grammar Cloze', urgency: 'low',
  };
}

/**
 * Generate a 3-step guided daily plan from real learner data.
 * @returns {Array<{ step, label, detail, ctaTarget, ctaGroup? }>}
 */
export function getDailyPlan() {
  const profile = getActiveProfile();
  return profile?.schoolLevel === 'primary'
    ? _primaryPlan()
    : _preschoolPlan();
}

function _preschoolPlan() {
  const gm = store.get('groupMastery') || {};
  const weakGroup = _weakestPhonicsGroup();
  const plan = [];

  // Step 1: weakest phonics or default
  if (weakGroup && _groupMastery(weakGroup) < 0.75) {
    plan.push({
      step: 1,
      label: `Blend It! – ${VOWEL_LABELS[weakGroup] || weakGroup}`,
      detail: 'Strengthen your weakest phonics group.',
      ctaTarget: 'blend', ctaGroup: weakGroup,
    });
  } else {
    plan.push({ step: 1, label: 'Blend It!', detail: 'Keep blending sharp.', ctaTarget: 'blend' });
  }

  // Step 2: First Sound or Hear & Choose based on recent history
  const history = store.get('wordHistory') || [];
  const doneFirst = history.slice(0, 20).some(h => h.mode === 'first');
  plan.push({
    step: 2,
    label: doneFirst ? 'Hear & Choose' : 'First Sound',
    detail: 'Phonemic awareness practice.',
    ctaTarget: doneFirst ? 'hear' : 'first-sound',
  });

  // Step 3: Giri Stories for reading fluency
  plan.push({ step: 3, label: 'Giri Stories', detail: 'Read and decode a phonics story.', ctaTarget: 'stories' });
  return plan;
}

function _primaryPlan() {
  const sfWeak = _weakestQuestSkill('sentenceForge');
  const ccWeak = _weakestQuestSkill('clozeCastle');
  const wvWeak = _weakestQuestSkill('wordVault');
  const sfAcc = _recentQuestAccuracy('sentenceForge');

  return [
    {
      step: 1,
      label: sfWeak && sfAcc !== null && sfAcc < 0.65
        ? `Sentence Forge – ${humaniseSkill(sfWeak.skill)}`
        : 'Sentence Forge',
      detail: 'Build and strengthen sentence structure skills.',
      ctaTarget: 'sentence-forge',
    },
    {
      step: 2,
      label: ccWeak ? `Cloze Castle – ${humaniseSkill(ccWeak.skill)}` : 'Cloze Castle',
      detail: 'Grammar cloze with clue detection.',
      ctaTarget: 'cloze-castle',
    },
    {
      step: 3,
      label: wvWeak ? `Word Vault – ${humaniseSkill(wvWeak.skill)}` : 'Word Vault',
      detail: 'Vocabulary in context practice.',
      ctaTarget: 'word-vault',
    },
  ];
}

/**
 * Generate summary chips describing the learner's current state.
 * All derived from real store data.
 * @returns {string[]}
 */
export function getLearnerSummaryChips() {
  const profile = getActiveProfile();
  const chips = [];

  if (profile?.schoolLevel === 'primary') chips.push('Older learner pathway active');

  const gm = store.get('groupMastery') || {};
  const weak = SHORT_VOWEL_GROUPS.filter(g => typeof gm[g] === 'number' && gm[g] < 0.6);
  const strong = SHORT_VOWEL_GROUPS.filter(g => typeof gm[g] === 'number' && gm[g] >= 0.8);

  if (weak.length > 0) chips.push(`Needs ${VOWEL_LABELS[weak[0]] || weak[0]} review`);
  if (strong.length >= 3) chips.push('Strong phonics foundation');

  const ccAcc = _clueAccuracy('clozeCastle');
  const wvAcc = _clueAccuracy('wordVault');
  const sfAcc = _clueAccuracy('sentenceForge');

  if (ccAcc !== null && ccAcc >= 0.7) chips.push('Ready for grammar cloze');
  if (wvAcc !== null && wvAcc < 0.5)  chips.push('Connector clues need practice');
  if (sfAcc !== null && sfAcc >= 0.75) chips.push('Strong in sentence clues');

  const qm = store.get('questMastery') || {};
  const wvSkills = Object.values(qm.wordVault || {});
  if (wvSkills.length > 0) {
    const avg = wvSkills.reduce((a, b) => a + b, 0) / wvSkills.length;
    if (avg >= 0.7) chips.push('Strong in context clues');
  }

  return chips.slice(0, 4);
}
