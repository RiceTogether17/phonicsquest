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
};

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
