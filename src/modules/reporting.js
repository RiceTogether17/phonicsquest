/**
 * Parent reporting helpers for cross-quest category progress views.
 */

import { store } from './store.js';
import { VOCAB_CATEGORIES } from '../data/vocabPassages.js';
import { GRAMMAR_CATEGORIES } from '../data/passages.js';

const LO_CODE_MAP = {
  connector_clue: 'LO-ENG-GR-03',
  contextInference: 'LO-ENG-VOC-02',
  synonymContrast: 'LO-ENG-VOC-03',
  definitionMatch: 'LO-ENG-VOC-01',
  idiomaticExpressions: 'LO-ENG-VOC-05',
  proverbsSayings: 'LO-ENG-VOC-06',
  scienceTechTerms: 'LO-ENG-VOC-07',
  socialStudiesVocab: 'LO-ENG-VOC-08',
  pronouns: 'LO-ENG-GR-04',
  svAgreement: 'LO-ENG-GR-05',
  conditionals: 'LO-ENG-GR-08',
  passiveVoice: 'LO-ENG-GR-09',
  reportedSpeech: 'LO-ENG-GR-10',
  relativeClauses: 'LO-ENG-GR-11',
  grammarArticles: 'LO-ENG-GR-01',
  grammarPrepositions: 'LO-ENG-GR-02',
  grammarSVA: 'LO-ENG-GR-05',
  tenses: 'LO-ENG-GR-06',
  modals: 'LO-ENG-GR-07',
  morphologicalAffix: 'LO-ENG-VOC-04',
  collocationCloze: 'LO-ENG-VOC-09',
};


const PRIORITY_WEIGHTS = {
  // MOE/PSLE-heavy grammar focus
  grammarArticles: 1.25,
  grammarPrepositions: 1.3,
  grammarSVA: 1.35,
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
  return ((1 - (row.accuracy || 0)) * w) + attemptsPenalty;
}

const MOE_SYLLABUS_LINK = 'https://www.moe.gov.sg/primary/curriculum/syllabus';

function _accuracy(correct, total) {
  return total > 0 ? correct / total : 0;
}

function _collectQuestAccuracy(quest, categoryKeys) {
  const attempts = store.get('questAttempts') || [];

  return categoryKeys.map((key) => {
    const rows = attempts.filter(a => a.quest === quest && a.skill === key);
    const total = rows.length;
    const correct = rows.filter(a => a.correct).length;
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
  const clue = store.get('clueStats')?.wordVault || { attempted: 0, strong: 0, partial: 0, weak: 0 };
  const clueSuccess = clue.attempted > 0 ? ((clue.strong || 0) + (clue.partial || 0)) / clue.attempted : 0;

  return rows.map((r) => ({
    ...r,
    label: VOCAB_CATEGORIES[r.key]?.label || r.key,
    tooltip: VOCAB_CATEGORIES[r.key]?.desc || 'Vocabulary development category',
    loCode: LO_CODE_MAP[r.key] || 'LO-ENG-VOC',
    clueSuccess,
    syllabusLink: MOE_SYLLABUS_LINK,
  }));
}

export function getGrammarCategoryReport() {
  const categories = Object.keys(GRAMMAR_CATEGORIES);
  const rows = _collectQuestAccuracy('clozeCastle', categories);
  const clue = store.get('clueStats')?.clozeCastle || { attempted: 0, strong: 0, partial: 0, weak: 0 };
  const clueSuccess = clue.attempted > 0 ? ((clue.strong || 0) + (clue.partial || 0)) / clue.attempted : 0;

  return rows.map((r) => ({
    ...r,
    label: GRAMMAR_CATEGORIES[r.key]?.label || r.key,
    tooltip: `${GRAMMAR_CATEGORIES[r.key]?.label || r.key} mastery`,
    loCode: LO_CODE_MAP[r.key] || 'LO-ENG-GR',
    clueSuccess,
    syllabusLink: MOE_SYLLABUS_LINK,
  }));
}


export function getMoePriorityRecommendations() {
  const vocab = getVocabularyCategoryReport()
    .map(r => ({ ...r, priorityScore: _priorityScore(r) }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);

  const grammar = getGrammarCategoryReport()
    .map(r => ({ ...r, priorityScore: _priorityScore(r) }))
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, 3);

  return { vocab, grammar };
}

export function getLatestQuestScoreboards() {
  const attempts = store.get('questAttempts') || [];
  const byQuest = ['sentenceForge', 'clozeCastle', 'wordVault'].map((quest) => {
    const rows = attempts.filter(a => a.quest === quest).slice(0, 12);
    const total = rows.length;
    const correct = rows.filter(a => a.correct).length;
    const accuracy = _accuracy(correct, total);
    return { quest, total, correct, accuracy };
  });
  return byQuest;
}
