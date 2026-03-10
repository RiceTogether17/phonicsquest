import { describe, it, expect } from 'vitest';
import { buildParentReportData, buildTeacherSummaryCsv } from '../modules/analyticsExport.js';

describe('analytics export helpers', () => {
  it('buildParentReportData keeps top-level analytics blocks and slices history', () => {
    const data = buildParentReportData({
      profile: { name: 'Ari' },
      learnerSummary: { profileName: 'Ari' },
      literacyDomains: [{ name: 'Phonics', score: 0.8 }],
      clueInsights: { overall: 0.7 },
      recommendedActions: [{ title: 'Practise blends' }],
      recentPatternInsights: ['Strong on cvc-a'],
      stats: {
        wordsAttempted: 22,
        wordsMastered: 11,
        overallAccuracy: 0.81,
        bestStreak: 9,
        totalAttempts: 90,
        totalCorrect: 73,
        groupMastery: { 'short-a': 0.8 },
        recentHistory: Array.from({ length: 70 }, (_, i) => ({ i })),
      },
    });

    expect(data.learnerSummary.profileName).toBe('Ari');
    expect(data.progress.wordsMastered).toBe(11);
    expect(data.progress.recentHistory.length).toBe(50);
  });

  it('buildTeacherSummaryCsv includes core summary and domains', () => {
    const csv = buildTeacherSummaryCsv({
      profile: { name: 'Ari', schoolLevel: 'primary' },
      stats: {
        wordsAttempted: 15,
        wordsMastered: 10,
        overallAccuracy: 0.9,
        bestStreak: 6,
        totalAttempts: 80,
        totalCorrect: 72,
        groupMastery: { 'short-a': 0.8 },
      },
      literacyDomains: [{ name: 'Phonics', score: 0.75 }],
    });

    expect(csv).toContain('Section,Metric,Value');
    expect(csv).toContain('Meta,Learner,Ari');
    expect(csv).toContain('Overall,Words Mastered,10');
    expect(csv).toContain('Domain,Phonics,75');
    expect(csv).toContain('Group Mastery,short-a,80');
  });
});
