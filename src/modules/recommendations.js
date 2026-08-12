/**
 * PhonicsQuest – Learner Recommendation Engine
 *
 * Home recommendations are now driven primarily by reading stage (readingBand),
 * with schoolLevel kept as metadata only.
 */

import { store } from './store.js';
import { getActiveProfile } from './profiles.js';
import { getReadingBand, isReadingBandMeasured } from './readingStages.js';
import {
  SHORT_VOWEL_CANONICAL_GROUPS,
  VOWEL_LABELS,
  normalizeGroupMasteryMap,
  normalizePhonicsGroupKey,
} from './phonicsGroupKeys.js';

export function humaniseSkill(skill) {
  const map = {
    word_order: 'Word Order',
    first_word_clue: 'First Word Clue',
    time_order_clue: 'Time Order',
    connector_clue: 'Connectors',
    tense_clue: 'Verb Tense',
    punctuation_clue: 'Punctuation',
    subject_action_clue: 'Subject & Action',
    modal_order: 'Modal Verbs',
    clause_boundary: 'Clause Boundary',
    inversion_pattern: 'Inversion',
    comparison_structure: 'Comparisons',
    'connector-clue': 'Connectors',
    'time-marker': 'Time Markers',
    'contrast-clue': 'Contrast',
    'past-tense': 'Past Tense',
    comparatives: 'Comparatives',
    modals: 'Modal Verbs',
    Animals: 'Animals',
    Food: 'Food',
    School: 'School',
    Home: 'Home',
    Nature: 'Nature',
  };
  return map[skill] || String(skill || '').replace(/[-_]/g, ' ');
}

function _placementProfile() {
  return store.get('placementProfile') || null;
}

function _groupMastery(group) {
  const gm = normalizeGroupMasteryMap(store.get('groupMastery') || {});
  return gm[normalizePhonicsGroupKey(group)] ?? 0;
}

function _weakestPhonicsGroup() {
  const gm = normalizeGroupMasteryMap(store.get('groupMastery') || {});
  let weakest = null,
    lowest = Infinity;
  for (const g of SHORT_VOWEL_CANONICAL_GROUPS) {
    const s = gm[g];
    if (typeof s === 'number' && s < lowest) {
      lowest = s;
      weakest = g;
    }
  }
  return weakest;
}

function _weakestQuestSkill(questKey) {
  const qm = store.get('questMastery') || {};
  const bucket = qm[questKey] || {};
  if (!Object.keys(bucket).length) return null;
  let weakest = null;
  let lowest = Infinity;
  for (const [skill, score] of Object.entries(bucket)) {
    if (score < lowest) {
      lowest = score;
      weakest = skill;
    }
  }
  return weakest ? { skill: weakest, score: lowest } : null;
}

function _band() {
  const profile = getActiveProfile();
  return getReadingBand(profile, _placementProfile());
}

function _phonicsPriorityRec() {
  const weakGroup = _weakestPhonicsGroup();
  if (weakGroup && _groupMastery(weakGroup) < 0.75) {
    const pct = Math.round(_groupMastery(weakGroup) * 100);
    return {
      title: `Practise ${VOWEL_LABELS[weakGroup] || weakGroup}`,
      reason: `${VOWEL_LABELS[weakGroup] || weakGroup} blending is ${pct}% — this is the quickest growth area.`,
      ctaLabel: 'Start Blend It!',
      ctaTarget: 'blend',
      ctaGroup: weakGroup,
      domain: 'Phonics',
      urgency: pct < 45 ? 'high' : 'medium',
    };
  }
  return {
    title: 'Build sound awareness first',
    reason: 'Start with listening and sound-matching before heavy print tasks.',
    ctaLabel: 'Open First Sound',
    ctaTarget: 'first-sound',
    domain: 'Sound Awareness',
    urgency: 'medium',
  };
}

function _readerRec() {
  const sfWeak = _weakestQuestSkill('sentenceForge');
  const ccWeak = _weakestQuestSkill('clozeCastle');
  const wvWeak = _weakestQuestSkill('wordVault');

  if (sfWeak && sfWeak.score < 0.65) {
    return {
      title: 'Sentence Forge needs attention',
      reason: `${humaniseSkill(sfWeak.skill)} is ${Math.round(sfWeak.score * 100)}% — strengthen this first.`,
      ctaLabel: 'Open Sentence Forge',
      ctaTarget: 'sentence-forge',
      domain: 'Sentence Skills',
      urgency: 'high',
    };
  }
  if (ccWeak && ccWeak.score < 0.65) {
    return {
      title: 'Target grammar cloze practice',
      reason: `Focus on ${humaniseSkill(ccWeak.skill)} to improve passage accuracy.`,
      ctaLabel: 'Open Cloze Castle',
      ctaTarget: 'cloze-castle',
      domain: 'Grammar Cloze',
      urgency: 'medium',
    };
  }
  if (wvWeak && wvWeak.score < 0.65) {
    return {
      title: 'Strengthen context vocabulary',
      reason: `Work on ${humaniseSkill(wvWeak.skill)} clues for Word Vault fluency.`,
      ctaLabel: 'Open Word Vault',
      ctaTarget: 'word-vault',
      domain: 'Vocabulary',
      urgency: 'medium',
    };
  }
  return {
    title: 'Ready for higher language tasks',
    reason: 'Reading foundations are secure — continue sentence, grammar and vocabulary quests.',
    ctaLabel: 'Open Sentence Forge',
    ctaTarget: 'sentence-forge',
    domain: 'Primary Language',
    urgency: 'low',
  };
}

export function getRecommendation() {
  const readingBand = _band();

  if (readingBand === 'pre-reader') {
    return {
      title: 'Start with no-print sound play',
      reason:
        'This learner is in pre-reader stage. Build oral sounds, letter sounds, and listening first.',
      ctaLabel: 'Start First Sound',
      ctaTarget: 'first-sound',
      domain: 'Foundations',
      urgency: 'high',
    };
  }

  if (readingBand === 'emerging-decoder') {
    return _phonicsPriorityRec();
  }

  if (readingBand === 'developing-reader') {
    const placement = _placementProfile();
    const sentenceReady = !!placement?.sentenceReady;
    return {
      title: sentenceReady ? 'Bridge to sentence work' : 'Bridge to connected reading',
      reason: sentenceReady
        ? 'Keep phonics visible, then start Sentence Forge for structured sentence practice.'
        : 'Keep phonics active while adding sight words and short story reading.',
      ctaLabel: sentenceReady ? 'Open Sentence Forge' : 'Open Blend It!',
      ctaTarget: sentenceReady ? 'sentence-forge' : 'blend',
      domain: 'Decoding + Stories',
      urgency: 'medium',
    };
  }

  return _readerRec();
}

export function getDailyPlan() {
  const readingBand = _band();

  if (readingBand === 'pre-reader') {
    return [
      {
        step: 1,
        label: 'First Sound',
        detail: 'No-print sound awareness.',
        ctaTarget: 'first-sound',
      },
      {
        step: 2,
        label: 'Hear & Choose',
        detail: 'Listening and picture matching.',
        ctaTarget: 'hear',
      },
      {
        step: 3,
        label: 'Letter Sounds',
        detail: 'Build letter-sound links.',
        ctaTarget: 'letter-sounds',
      },
    ];
  }

  if (readingBand === 'emerging-decoder') {
    const weakGroup = _weakestPhonicsGroup();
    return [
      {
        step: 1,
        label: weakGroup ? `Blend It! – ${VOWEL_LABELS[weakGroup] || weakGroup}` : 'Blend It!',
        detail: 'Target the weakest decoding group.',
        ctaTarget: 'blend',
        ctaGroup: weakGroup || undefined,
      },
      {
        step: 2,
        label: 'Sight Words',
        detail: 'Build automatic word recognition.',
        ctaTarget: 'sight-words',
      },
      { step: 3, label: 'Giri Stories', detail: 'Short connected reading.', ctaTarget: 'stories' },
    ];
  }

  if (readingBand === 'developing-reader') {
    return [
      {
        step: 1,
        label: 'Blend It! review',
        detail: 'Keep phonics automaticity strong.',
        ctaTarget: 'blend',
      },
      {
        step: 2,
        label: 'Giri Stories',
        detail: 'Read sentence/paragraph-level text.',
        ctaTarget: 'stories',
      },
      {
        step: 3,
        label: 'Sentence Forge',
        detail: 'Begin sentence construction readiness.',
        ctaTarget: 'sentence-forge',
      },
    ];
  }

  return [
    {
      step: 1,
      label: 'Sentence Forge',
      detail: 'Sentence structure work.',
      ctaTarget: 'sentence-forge',
    },
    {
      step: 2,
      label: 'Cloze Castle',
      detail: 'Grammar cloze passages.',
      ctaTarget: 'cloze-castle',
    },
    { step: 3, label: 'Word Vault', detail: 'Vocabulary in context.', ctaTarget: 'word-vault' },
  ];
}

export function getLearnerSummaryChips() {
  const placement = _placementProfile();
  const readingBand = _band();
  const gm = normalizeGroupMasteryMap(store.get('groupMastery') || {});
  const chips = [];

  // Outcome-focused stage label. These are claims about what the child CAN do,
  // so they need a measured band behind them: a primary profile is routed to
  // `reader` by school level alone, and "Reading fluently" is not something to
  // tell a child before they have read anything here.
  const stageLabels = {
    'pre-reader': 'Learning sounds & letters',
    'emerging-decoder': 'Decoding simple words',
    'developing-reader': 'Reading short stories',
    reader: 'Reading fluently',
  };
  const measured = isReadingBandMeasured(getActiveProfile(), placement);
  chips.push(
    measured
      ? stageLabels[readingBand] || `Stage: ${readingBand.replace(/-/g, ' ')}`
      : 'Starting out — we are still getting to know you',
  );

  // Mastered phonics groups (accuracy > 75%)
  const masteredGroups = SHORT_VOWEL_CANONICAL_GROUPS.filter((g) => (gm[g] ?? 0) >= 0.75);
  if (masteredGroups.length > 0) {
    const groupLabels = masteredGroups.map((g) => VOWEL_LABELS[g] || g);
    chips.push(
      `Can decode: ${groupLabels.slice(0, 2).join(', ')}${groupLabels.length > 2 ? '…' : ''}`,
    );
  }

  // Story/sentence readiness
  if (placement?.storyReadiness === 'ready') chips.push('Ready for stories');
  else if (placement?.sentenceReady) chips.push('Ready for sentences');

  // Pathway
  if (readingBand === 'reader') chips.push('Grammar pathway unlocked');

  return chips.slice(0, 4);
}
