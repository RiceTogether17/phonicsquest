/**
 * Parent Report Card
 *
 * Builds a compact, parent-friendly snapshot:
 *   - Strengths
 *   - Needs Practice
 *   - Recent Mistakes
 *   - Recommended 10-minute practice
 *   - Teacher-style comment
 *
 * Also exposes buildWhatsAppMessage() so the dashboard can render a
 * "Copy Parent Update" button that yields a WhatsApp-ready message.
 *
 * Pure-ish: takes its inputs explicitly so it can be unit-tested without a DOM.
 */

const PRACTICE_BY_DOMAIN = {
  grammar:    { target: 'grammar-mcq', label: '🧠 Grammar MCQ' },
  vocabulary: { target: 'vocab-mcq',   label: '📖 Vocabulary MCQ' },
  vocab:      { target: 'vocab-mcq',   label: '📖 Vocabulary MCQ' },
};

/**
 * @typedef {Object} ParentReportCardInput
 * @property {{ name?: string, primaryGrade?: string|null, avatar?: string }|null} profile
 * @property {Array<{ skill: string, label: string, score: number, domain: string }>} weakSkills
 * @property {Array<{ skill: string, label: string, score: number }>} strengths
 * @property {Array<{ word: string, mode?: string, when?: string, correct?: boolean }>} recentMistakes
 * @property {{ days: number, words: number, accuracy: number }} weekly
 */

/**
 * Build a structured report card object — easy to render and easy to test.
 * @param {ParentReportCardInput} input
 */
export function buildParentReportCard(input) {
  const profile = input?.profile || null;
  const weakSkills = Array.isArray(input?.weakSkills) ? input.weakSkills : [];
  const strengths  = Array.isArray(input?.strengths)  ? input.strengths  : [];
  const mistakes   = Array.isArray(input?.recentMistakes) ? input.recentMistakes : [];
  const weekly     = input?.weekly || { days: 0, words: 0, accuracy: 0 };

  const topWeak = weakSkills.slice(0, 3).map(w => ({
    label: w.label,
    pct: Math.round((w.score || 0) * 100),
    domain: w.domain || 'grammar',
  }));

  const topStrong = strengths.slice(0, 3).map(s => ({
    label: s.label,
    pct: Math.round((s.score || 0) * 100),
  }));

  const recommendation = _buildRecommendation(topWeak[0], profile);
  const teacherComment = _buildTeacherComment({ topWeak, topStrong, weekly, profile });

  const recentMistakes = mistakes.slice(0, 5).map(m => ({
    word: String(m.word || '').slice(0, 40),
    mode: m.mode || '',
    when: m.when || '',
  }));

  return {
    learnerName: profile?.name || 'Your child',
    grade: profile?.primaryGrade || null,
    avatar: profile?.avatar || '🧒',
    weekly,
    strengths: topStrong.length ? topStrong : [{ label: 'Steady effort', pct: null }],
    needsPractice: topWeak,
    recentMistakes,
    recommendation,
    teacherComment,
  };
}

function _buildRecommendation(topWeak, profile) {
  if (!topWeak) {
    return {
      title: '10-minute warm-up: Grammar MCQ',
      detail: 'No weak skills detected yet. A short Grammar MCQ session will help us learn what to focus on.',
      target: 'grammar-mcq',
      targetLabel: '🧠 Grammar MCQ',
    };
  }
  const route = PRACTICE_BY_DOMAIN[topWeak.domain] || PRACTICE_BY_DOMAIN.grammar;
  const grade = profile?.primaryGrade ? ` (${profile.primaryGrade})` : '';
  return {
    title: `10 minutes: ${topWeak.label}${grade}`,
    detail: `Practise ${topWeak.label} — currently ${topWeak.pct}%. Aim for 8 of 10 correct before bed.`,
    target: route.target,
    targetLabel: route.label,
  };
}

function _buildTeacherComment({ topWeak, topStrong, weekly, profile }) {
  const name = profile?.name || 'Your child';
  const greeting = weekly.days >= 5
    ? `${name} has been wonderfully consistent this week (${weekly.days} active days).`
    : weekly.days >= 2
      ? `${name} practised on ${weekly.days} days this week — a solid rhythm.`
      : `${name} hasn't practised much this week. Two short sessions will keep skills warm.`;

  const strengthLine = topStrong[0]
    ? ` They are strongest in ${topStrong[0].label}${topStrong[0].pct ? ` (${topStrong[0].pct}%)` : ''}.`
    : '';
  const weaknessLine = topWeak[0]
    ? ` ${topWeak[0].label} is the area to focus on next — currently ${topWeak[0].pct}%.`
    : ' No clear weak spots — well done!';
  const closing = ' Encourage them to read aloud short passages every day to keep building fluency.';

  return `${greeting}${strengthLine}${weaknessLine}${closing}`;
}

/**
 * Build a parent-friendly WhatsApp update — one short message, no jargon.
 */
export function buildWhatsAppMessage(card) {
  if (!card) return '';
  const lines = [];
  lines.push(`📚 ${card.learnerName}'s English update${card.grade ? ` (${card.grade})` : ''}`);
  lines.push(`This week: ${card.weekly.days} active days · ${card.weekly.words} questions · ${Math.round(card.weekly.accuracy * 100)}% accuracy`);
  if (card.strengths?.[0]?.pct) {
    lines.push(`✅ Strength: ${card.strengths[0].label} (${card.strengths[0].pct}%)`);
  } else {
    lines.push('✅ Strength: Steady effort');
  }
  if (card.needsPractice?.[0]) {
    lines.push(`🎯 Needs practice: ${card.needsPractice[0].label} (${card.needsPractice[0].pct}%)`);
  }
  if (card.recentMistakes?.length) {
    lines.push(`📝 Recent slips: ${card.recentMistakes.slice(0, 3).map(m => m.word).join(', ')}`);
  }
  lines.push(`👉 Today's 10 min: ${card.recommendation.title}`);
  lines.push(`💬 Teacher's note: ${card.teacherComment}`);
  return lines.join('\n');
}
