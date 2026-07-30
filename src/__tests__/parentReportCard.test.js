import { describe, it, expect } from 'vitest';
import {
  buildParentReportCard,
  buildWhatsAppMessage,
  buildExamRisk,
  bandForPct,
} from '../modules/parentReportCard.js';

describe('bandForPct', () => {
  it('returns red below 55%', () => {
    expect(bandForPct(0)).toBe('red');
    expect(bandForPct(40)).toBe('red');
    expect(bandForPct(54)).toBe('red');
  });

  it('returns amber between 55% and 75%', () => {
    expect(bandForPct(55)).toBe('amber');
    expect(bandForPct(70)).toBe('amber');
    expect(bandForPct(74)).toBe('amber');
  });

  it('returns green at 75% and above', () => {
    expect(bandForPct(75)).toBe('green');
    expect(bandForPct(90)).toBe('green');
  });

  it('treats null/NaN as unknown — absence of evidence is not a pass', () => {
    expect(bandForPct(null)).toBe('unknown');
    expect(bandForPct(NaN)).toBe('unknown');
  });
});

describe('buildExamRisk', () => {
  it('is unknown when there are no weak skills — nothing has been measured', () => {
    const r = buildExamRisk([]);
    expect(r.band).toBe('unknown');
    expect(r.label).toMatch(/Not enough evidence/);
    expect(r.label).not.toMatch(/Exam-ready/);
    expect(r.skills).toEqual([]);
  });

  it('bands an unmeasured skill unknown, and lets it outrank green', () => {
    const r = buildExamRisk([
      { label: 'Synonyms', pct: 90 }, // green
      { label: 'Connectors', pct: null }, // never practised
    ]);
    expect(r.skills.map((s) => s.band)).toEqual(['green', 'unknown']);
    expect(r.band).toBe('unknown');
    expect(r.summary).toContain('Connectors');
  });

  it('takes the worst band across skills', () => {
    const r = buildExamRisk([
      { label: 'Connectors', pct: 40 }, // red
      { label: 'Tense', pct: 70 }, // amber
      { label: 'Synonyms', pct: 80 }, // green
    ]);
    expect(r.band).toBe('red');
    expect(r.label).toMatch(/Needs support/);
    expect(r.summary).toContain('Connectors');
    expect(r.summary).toContain('55%');
  });

  it('returns amber when no skills are red but some are amber', () => {
    const r = buildExamRisk([
      { label: 'Tense', pct: 70 },
      { label: 'Synonyms', pct: 80 },
    ]);
    expect(r.band).toBe('amber');
    expect(r.label).toMatch(/Developing/);
    expect(r.summary).toContain('Tense');
    expect(r.summary).toContain('75%');
  });

  it('returns green when every weak skill is already secure', () => {
    const r = buildExamRisk([
      { label: 'Tense', pct: 78 },
      { label: 'Synonyms', pct: 85 },
    ]);
    expect(r.band).toBe('green');
    expect(r.summary).toMatch(/solid/i);
  });

  it('joins multiple at-risk skills with commas and "and"', () => {
    const r = buildExamRisk([
      { label: 'Connectors', pct: 30 },
      { label: 'Tense', pct: 40 },
      { label: 'Articles', pct: 50 },
    ]);
    expect(r.band).toBe('red');
    expect(r.summary).toContain('Connectors, Tense and Articles');
  });

  it('tags every skill with its individual band', () => {
    const r = buildExamRisk([
      { label: 'Connectors', pct: 40 },
      { label: 'Tense', pct: 70 },
      { label: 'Synonyms', pct: 80 },
    ]);
    expect(r.skills.map((s) => s.band)).toEqual(['red', 'amber', 'green']);
  });
});

describe('buildParentReportCard with exam risk', () => {
  it('exposes examRisk and tags each Needs Practice entry with a band', () => {
    const card = buildParentReportCard({
      profile: { name: 'Ethan', primaryGrade: 'P3' },
      weakSkills: [
        { label: 'Connectors', score: 0.4, domain: 'vocab', attempts: 20 },
        { label: 'Tense', score: 0.7, domain: 'grammar', attempts: 20 },
      ],
      strengths: [{ label: 'Synonyms', score: 0.85 }],
      recentMistakes: [],
      weekly: { days: 4, words: 25, accuracy: 0.7 },
    });

    expect(card.examRisk.band).toBe('red');
    expect(card.needsPractice).toHaveLength(2);
    expect(card.needsPractice[0].band).toBe('red');
    expect(card.needsPractice[1].band).toBe('amber');
  });

  it('reports a weak score with no attempts behind it as unmeasured, not 0%', () => {
    const card = buildParentReportCard({
      profile: { name: 'Ethan' },
      weakSkills: [{ label: 'Connectors', score: 0, domain: 'vocab', attempts: 0 }],
      strengths: [],
      recentMistakes: [],
      weekly: { days: 0, words: 0, accuracy: 0 },
    });
    expect(card.needsPractice[0].pct).toBeNull();
    expect(card.needsPractice[0].band).toBe('unknown');
    expect(card.needsPractice[0].confidence).toBe('none');
    expect(card.examRisk.band).toBe('unknown');
  });

  it('carries the sample size behind each reported score', () => {
    const card = buildParentReportCard({
      profile: { name: 'Ethan' },
      weakSkills: [
        {
          label: 'Connectors',
          score: 0.4,
          domain: 'vocab',
          attempts: 3,
          independentAttempts: 3,
          lastPractised: '2026-07-28T10:00:00.000Z',
        },
      ],
      strengths: [],
      recentMistakes: [],
      weekly: { days: 1, words: 3, accuracy: 0.4 },
    });
    expect(card.needsPractice[0].attempts).toBe(3);
    expect(card.needsPractice[0].confidence).toBe('low');
    expect(card.needsPractice[0].lastPractised).toBe('2026-07-28T10:00:00.000Z');
    // A thin sample must be visible wherever the number is quoted.
    expect(card.recommendation.detail).toContain('from just 3 answers');
  });

  it('returns an unknown band when there are no weak skills', () => {
    const card = buildParentReportCard({
      profile: { name: 'Ethan' },
      weakSkills: [],
      strengths: [{ label: 'Synonyms', score: 0.9 }],
      recentMistakes: [],
      weekly: { days: 5, words: 30, accuracy: 0.9 },
    });
    expect(card.examRisk.band).toBe('unknown');
    expect(card.needsPractice).toEqual([]);
  });
});

describe('buildWhatsAppMessage with exam risk', () => {
  it('inserts an Exam focus line between needs-practice and recent slips', () => {
    const card = buildParentReportCard({
      profile: { name: 'Ethan', primaryGrade: 'P3' },
      weakSkills: [{ label: 'Connectors', score: 0.4, domain: 'vocab', attempts: 20 }],
      strengths: [{ label: 'Synonyms', score: 0.85 }],
      recentMistakes: [{ word: 'although' }],
      weekly: { days: 4, words: 25, accuracy: 0.7 },
    });
    const msg = buildWhatsAppMessage(card);
    expect(msg).toContain('🚦 Exam focus:');
    expect(msg).toContain('Needs support');
    expect(msg).toContain('Connectors');
    // Must appear after Needs practice and before Recent slips.
    const needsIdx = msg.indexOf('🎯 Needs practice');
    const focusIdx = msg.indexOf('🚦 Exam focus');
    const slipsIdx = msg.indexOf('📝 Recent slips');
    expect(needsIdx).toBeLessThan(focusIdx);
    expect(focusIdx).toBeLessThan(slipsIdx);
  });

  it('never tells a parent with no recorded practice that their child is exam-ready', () => {
    const card = buildParentReportCard({
      profile: { name: 'Ethan' },
      weakSkills: [],
      strengths: [{ label: 'Synonyms', score: 0.9 }],
      recentMistakes: [],
      weekly: { days: 5, words: 30, accuracy: 0.9 },
    });
    const msg = buildWhatsAppMessage(card);
    expect(msg).toContain('🚦 Exam focus:');
    expect(msg).toContain('Not enough evidence');
    expect(msg).not.toContain('Exam-ready');
  });

  it("labels the generated comment as automated, not as a teacher's note", () => {
    const card = buildParentReportCard({
      profile: { name: 'Ethan' },
      weakSkills: [],
      strengths: [],
      recentMistakes: [],
      weekly: { days: 2, words: 10, accuracy: 0.8 },
    });
    const msg = buildWhatsAppMessage(card);
    expect(msg).toContain('Automated learning summary');
    expect(msg).not.toContain("Teacher's note");
  });
});
