import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '../src/modules/store.js';
import {
  getVocabularyCategoryReport,
  getGrammarCategoryReport,
  getLatestQuestScoreboards,
  getPracticePriorityRecommendations,
  getAlignmentDisclosure,
  getLearningFunnelReport,
  getAdaptiveLessonQueue,
} from '../src/modules/reporting.js';

describe('reporting module', () => {
  beforeEach(() => {
    store.reset();
    store.set('questAttempts', [
      { quest: 'wordVault', skill: 'scienceTechTerms', correct: true },
      { quest: 'wordVault', skill: 'scienceTechTerms', correct: false },
      { quest: 'clozeCastle', skill: 'conditionals', correct: true },
      { quest: 'sentenceForge', skill: 'connector_clue', correct: false },
    ]);
    store.set('clueStats', {
      clozeCastle: { attempted: 2, strong: 1, partial: 0, weak: 1 },
      wordVault: { attempted: 4, strong: 2, partial: 1, weak: 1 },
      sentenceForge: { attempted: 0, correct: 0, incorrect: 0 },
      editingQuest: { attempted: 0, correct: 0, incorrect: 0 },
      byType: {},
    });
  });

  it('returns vocabulary rows with clue success and no invented syllabus code', () => {
    // This used to assert `sci.loCode` matched /^LO-/. The codes it was
    // checking — LO-ENG-VOC-07 and twenty-two others — were invented in
    // reporting.js and rendered to parents beside a link labelled "MOE
    // syllabus". Audit finding 25: an alignment claim needs an exact,
    // reviewable source, and until the crosswalk exists there is none.
    const rows = getVocabularyCategoryReport();
    const sci = rows.find((r) => r.key === 'scienceTechTerms');
    expect(sci).toBeTruthy();
    expect(sci.clueSuccess).toBeGreaterThan(0);
    expect(sci.loCode).toBeUndefined();
    expect(sci.alignment).toBeNull();
  });

  it('discloses that the sequence is the app’s own', () => {
    const { statement, syllabusLink } = getAlignmentDisclosure();
    expect(statement).toMatch(/PhonicsQuest’s own sequence/);
    expect(statement).toMatch(/not mapped to the MOE syllabus/);
    expect(syllabusLink).toContain('moe.gov.sg');
  });

  it('returns scoreboard snapshots for key quests', () => {
    const rows = getLatestQuestScoreboards();
    expect(rows.map((r) => r.quest)).toEqual(['sentenceForge', 'clozeCastle', 'wordVault']);
  });

  it('returns grammar rows', () => {
    const rows = getGrammarCategoryReport();
    expect(rows.find((r) => r.key === 'conditionals')).toBeTruthy();
  });

  it('returns practice priorities weighted by the app’s own category weights', () => {
    // Renamed from "MOE-priority": the weights are this app's editorial
    // judgement and were never checked against a syllabus (finding 25).
    const rec = getPracticePriorityRecommendations();
    expect(rec.vocab.length).toBeGreaterThan(0);
    expect(rec.grammar.length).toBeGreaterThan(0);
    expect(rec.grammar[0]).toHaveProperty('priorityScore');
  });

  it('builds 7-day learning funnel metrics from telemetry', () => {
    store.recordLearningEvent({
      eventType: 'quest_attempt',
      quest: 'wordVault',
      skill: 'contextInference',
      correct: true,
      responseMs: 1800,
      level: 'p3',
    });
    store.recordLearningEvent({
      eventType: 'quest_attempt',
      quest: 'clozeCastle',
      skill: 'conditionals',
      correct: false,
      responseMs: 4200,
      level: 'p5',
    });
    const funnel = getLearningFunnelReport({ days: 7 });
    expect(funnel.attempts).toBeGreaterThanOrEqual(2);
    expect(funnel.byQuest.find((q) => q.quest === 'wordVault')?.attempts).toBeGreaterThanOrEqual(1);
    expect(funnel.avgResponseMs).not.toBeNull();
  });

  it('builds adaptive lesson queue with deduped tasks', () => {
    store.recordLearningEvent({
      eventType: 'quest_attempt',
      quest: 'wordVault',
      skill: 'contextInference',
      correct: false,
      responseMs: 5200,
      level: 'p3',
    });
    const queue = getAdaptiveLessonQueue({ limit: 4 });
    expect(queue.length).toBeLessThanOrEqual(4);
    expect(queue.length).toBeGreaterThan(0);
    const uniqueKeys = new Set(queue.map((q) => `${q.quest}:${q.skill}`));
    expect(uniqueKeys.size).toBe(queue.length);
  });
});
