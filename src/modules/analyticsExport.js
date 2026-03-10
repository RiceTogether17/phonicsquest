/**
 * Analytics export helpers for parent + teacher reporting.
 */

/**
 * @param {object} args
 * @param {any} args.profile
 * @param {object} args.learnerSummary
 * @param {Array} args.literacyDomains
 * @param {object} args.clueInsights
 * @param {Array} args.recommendedActions
 * @param {Array} args.recentPatternInsights
 * @param {object} args.stats
 */
export function buildParentReportData({
  profile,
  learnerSummary,
  literacyDomains,
  clueInsights,
  recommendedActions,
  recentPatternInsights,
  stats,
}) {
  return {
    generatedAt: new Date().toISOString(),
    learnerSummary,
    literacyDomains,
    clueInsights,
    recommendedActions,
    recentPatternInsights,
    progress: {
      wordsAttempted: stats.wordsAttempted,
      wordsMastered: stats.wordsMastered,
      overallAccuracy: stats.overallAccuracy,
      bestStreak: stats.bestStreak,
      totalAttempts: stats.totalAttempts,
      totalCorrect: stats.totalCorrect,
      groupMastery: stats.groupMastery,
      recentHistory: (stats.recentHistory || []).slice(0, 50),
      profile,
    },
  };
}

/**
 * @param {object} args
 * @param {any} args.profile
 * @param {object} args.stats
 * @param {Array<{name:string, score:number}>} args.literacyDomains
 */
export function buildTeacherSummaryCsv({ profile, stats, literacyDomains }) {
  const rows = [['Section', 'Metric', 'Value']];
  rows.push(['Meta', 'Generated At', new Date().toISOString()]);
  rows.push(['Meta', 'Learner', profile?.name || 'Unknown']);
  rows.push(['Meta', 'School Level', profile?.schoolLevel || 'preschool']);

  rows.push(['Overall', 'Words Attempted', String(stats.wordsAttempted || 0)]);
  rows.push(['Overall', 'Words Mastered', String(stats.wordsMastered || 0)]);
  rows.push(['Overall', 'Overall Accuracy %', String(Math.round((stats.overallAccuracy || 0) * 100))]);
  rows.push(['Overall', 'Best Streak', String(stats.bestStreak || 0)]);
  rows.push(['Overall', 'Total Attempts', String(stats.totalAttempts || 0)]);
  rows.push(['Overall', 'Total Correct', String(stats.totalCorrect || 0)]);

  for (const d of literacyDomains || []) {
    rows.push(['Domain', d.name, String(Math.round((d.score || 0) * 100))]);
  }

  const groupMastery = stats.groupMastery || {};
  for (const [group, accuracy] of Object.entries(groupMastery)) {
    rows.push(['Group Mastery', group, String(Math.round((accuracy || 0) * 100))]);
  }

  return rows.map((r) => r.map(csvEscape).join(',')).join('\n');
}

function csvEscape(v) {
  const s = String(v ?? '');
  if (/[",\n]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}
