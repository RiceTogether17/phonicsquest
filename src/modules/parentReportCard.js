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
 * Also exposes buildErrorDigest() / renderErrorDigest() for the weekly
 * focus-areas panel shown in the parent dashboard.
 *
 * Pure-ish: takes its inputs explicitly so it can be unit-tested without a DOM.
 */

import { store } from './store.js';
import { getMisconceptionSummary } from './teacherFeedback.js';
import { confidenceFor } from './evidence.js';
import { GRAMMAR_CATEGORIES } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';

const PRACTICE_BY_DOMAIN = {
  grammar: { target: 'grammar-mcq', label: '🧠 Grammar MCQ' },
  vocabulary: { target: 'vocab-mcq', label: '📖 Vocabulary MCQ' },
  vocab: { target: 'vocab-mcq', label: '📖 Vocabulary MCQ' },
};

/** Score thresholds (0–100) for the exam-risk traffic-light band. */
const RISK_THRESHOLDS = Object.freeze({ red: 55, amber: 75 });

/**
 * Four states, not three.
 *
 * "No data" used to map onto the green band and render as "Exam-ready", so a
 * brand-new profile with zero recorded practice produced a copy-pasteable
 * message telling a parent their child was ready for the exam. Absence of
 * evidence is now its own state, and the top band claims what the data can
 * actually support — that a skill is secure, not that an exam is passed.
 */
const RISK_LABELS = Object.freeze({
  unknown: '⚪ Not enough evidence',
  green: '🟢 Secure',
  amber: '🟡 Developing',
  red: '🔴 Needs support',
});

/**
 * @typedef {'unknown'|'green'|'amber'|'red'} ExamRiskBand
 */

/**
 * Map a 0–100 skill score onto a traffic-light band.
 * A missing score bands `unknown` — never green.
 * @param {number|null} pct
 * @returns {ExamRiskBand}
 */
export function bandForPct(pct) {
  if (pct == null || Number.isNaN(pct)) return 'unknown';
  if (pct < RISK_THRESHOLDS.red) return 'red';
  if (pct < RISK_THRESHOLDS.amber) return 'amber';
  return 'green';
}

/** Human-readable label for a band. */
export function bandLabel(band) {
  return RISK_LABELS[band] || RISK_LABELS.unknown;
}

/**
 * Build the exam-risk summary from the child's weakest skills.
 * Returns the overall band (worst across listed skills) plus a short,
 * parent-readable explanation that names the skills driving the risk.
 *
 * @param {Array<{ label: string, pct: number }>} needsPractice
 * @returns {{ band: ExamRiskBand, label: string, summary: string, skills: Array<{ label: string, pct: number, band: ExamRiskBand }> }}
 */
export function buildExamRisk(needsPractice = []) {
  if (!Array.isArray(needsPractice) || needsPractice.length === 0) {
    // An empty weak-skill list means nothing has been measured yet — not
    // that everything is fine. The summary always said so; the band and
    // label now agree with it.
    return {
      band: 'unknown',
      label: RISK_LABELS.unknown,
      summary: 'No weak skills detected yet — keep practising to build a clearer picture.',
      skills: [],
    };
  }

  const skills = needsPractice.map((s) => ({
    label: s.label,
    pct: s.pct,
    band: bandForPct(s.pct),
    attempts: s.attempts ?? 0,
    independentAttempts: s.independentAttempts ?? 0,
    lastPractised: s.lastPractised ?? null,
    confidence: s.confidence ?? confidenceFor(s.independentAttempts ?? 0),
  }));

  // `unknown` outranks green: an unmeasured skill among measured ones should
  // pull the headline down to "not enough evidence", not be treated as a pass.
  const order = { red: 4, unknown: 3, amber: 2, green: 1 };
  const worstBand = skills.reduce((acc, s) => (order[s.band] > order[acc] ? s.band : acc), 'green');

  let summary;
  if (worstBand === 'red') {
    const reds = skills.filter((s) => s.band === 'red').map((s) => s.label);
    summary = `${_joinList(reds)} below ${RISK_THRESHOLDS.red}% — focused practice this week will lift exam scores.`;
  } else if (worstBand === 'unknown') {
    const unknowns = skills.filter((s) => s.band === 'unknown').map((s) => s.label);
    summary = `Not enough practice yet to judge ${_joinList(unknowns)} — a few short sessions will show where things stand.`;
  } else if (worstBand === 'amber') {
    const ambers = skills.filter((s) => s.band === 'amber').map((s) => s.label);
    summary = `${_joinList(ambers)} under ${RISK_THRESHOLDS.amber}% — solid practice will close the gap before the next paper.`;
  } else {
    summary = 'Skills look solid for the next paper — keep the rhythm going.';
  }

  return { band: worstBand, label: RISK_LABELS[worstBand], summary, skills };
}

function _joinList(items) {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

/**
 * @typedef {Object} ParentReportCardInput
 * @property {{ name?: string, primaryGrade?: string|null, avatar?: string }|null} profile
 * @property {Array<{ skill: string, label: string, score: number, domain: string }>} weakSkills
 * @property {Array<{ skill: string, label: string, score: number }>} strengths
 * @property {Array<{ word: string, mode?: string, when?: string, correct?: boolean }>} recentMistakes
 * @property {{ days: number, words: number, accuracy: number }} weekly
 * @property {Array<{ word: string }>} [graduatingSoon]   words about to graduate to long-term memory
 * @property {Array<{ word: string }>} [slippingRecently] words demoted in the last 7 days
 */

/**
 * Build a structured report card object — easy to render and easy to test.
 * @param {ParentReportCardInput} input
 */
export function buildParentReportCard(input) {
  const profile = input?.profile || null;
  const weakSkills = Array.isArray(input?.weakSkills) ? input.weakSkills : [];
  const strengths = Array.isArray(input?.strengths) ? input.strengths : [];
  const mistakes = Array.isArray(input?.recentMistakes) ? input.recentMistakes : [];
  const weekly = input?.weekly || { days: 0, words: 0, accuracy: 0 };

  const topWeak = weakSkills.slice(0, 3).map((w) => ({
    label: w.label,
    // A score with no attempts behind it is not a low score — it is no
    // score. Keeping it null lets bandForPct band it `unknown` rather than
    // reporting a confident 0%.
    pct: (w.attempts ?? 0) > 0 ? Math.round((w.score || 0) * 100) : null,
    domain: w.domain || 'grammar',
    attempts: w.attempts ?? 0,
    independentAttempts: w.independentAttempts ?? 0,
    lastPractised: w.lastPractised ?? null,
    confidence: w.confidence ?? confidenceFor(w.independentAttempts ?? 0),
  }));

  const topStrong = strengths.slice(0, 3).map((s) => ({
    label: s.label,
    pct: Math.round((s.score || 0) * 100),
  }));

  const examRisk = buildExamRisk(topWeak);
  const recommendation = _buildRecommendation(topWeak[0], profile);
  const teacherComment = _buildTeacherComment({ topWeak, topStrong, weekly, profile });

  const recentMistakes = mistakes.slice(0, 5).map((m) => ({
    word: String(m.word || '').slice(0, 40),
    mode: m.mode || '',
    when: m.when || '',
  }));

  // Tag each weak skill with its band so the dashboard can colour the chip.
  const needsPractice = topWeak.map((w) => ({ ...w, band: bandForPct(w.pct) }));

  // Giri's Review Lane signals — surfaced for parents in plain language.
  // Graduating: words about to lock into long-term memory (positive frame).
  // Slipping: words demoted in the last week (gentle nudge to do a review).
  const graduating = Array.isArray(input?.graduatingSoon)
    ? input.graduatingSoon
        .slice(0, 5)
        .map((g) => ({ word: String(g.word || '').slice(0, 40) }))
        .filter((g) => g.word)
    : [];
  const slipping = Array.isArray(input?.slippingRecently)
    ? input.slippingRecently
        .slice(0, 5)
        .map((g) => ({ word: String(g.word || '').slice(0, 40) }))
        .filter((g) => g.word)
    : [];

  // Recurring misconceptions behind the weak skills. The skill list says
  // *which topics* are shaky; this says *what the child keeps doing*, which
  // is the part a parent can act on at home. Empty until something recurs —
  // a one-off slip is not a habit.
  const habits = getMisconceptionSummary(3).map((h) => ({
    id: h.id,
    label: h.childName,
    teacherLabel: h.label,
    count: h.count,
    tip: h.selfCheck,
  }));

  return {
    learnerName: profile?.name || 'Your child',
    grade: profile?.primaryGrade || null,
    avatar: profile?.avatar || '🧒',
    weekly,
    strengths: topStrong.length ? topStrong : [{ label: 'Steady effort', pct: null }],
    needsPractice,
    habits,
    recentMistakes,
    recommendation,
    examRisk,
    teacherComment,
    graduatingSoon: graduating,
    slippingRecently: slipping,
  };
}

function _buildRecommendation(topWeak, profile) {
  if (!topWeak) {
    return {
      title: '10-minute warm-up: Grammar MCQ',
      detail:
        'No weak skills detected yet. A short Grammar MCQ session will help us learn what to focus on.',
      target: 'grammar-mcq',
      targetLabel: '🧠 Grammar MCQ',
    };
  }
  const route = PRACTICE_BY_DOMAIN[topWeak.domain] || PRACTICE_BY_DOMAIN.grammar;
  const grade = profile?.primaryGrade ? ` (${profile.primaryGrade})` : '';
  const standing =
    topWeak.pct == null
      ? 'not enough practice yet to give a score'
      : `currently ${topWeak.pct}%${_sampleNote(topWeak)}`;
  return {
    title: `10 minutes: ${topWeak.label}${grade}`,
    detail: `Practise ${topWeak.label} — ${standing}. Aim for 8 of 10 correct before bed.`,
    target: route.target,
    targetLabel: route.label,
  };
}

/**
 * A short "(from N answers)" note, so a percentage never appears without the
 * sample size that produced it. Empty when the sample is large enough that
 * the figure speaks for itself.
 */
function _sampleNote(skill) {
  const n = skill?.attempts ?? 0;
  if (n <= 0) return '';
  if (n >= 12) return '';
  return ` from just ${n} answer${n === 1 ? '' : 's'}`;
}

function _buildTeacherComment({ topWeak, topStrong, weekly, profile }) {
  const name = profile?.name || 'Your child';
  const greeting =
    weekly.days >= 5
      ? `${name} has been wonderfully consistent this week (${weekly.days} active days).`
      : weekly.days >= 2
        ? `${name} practised on ${weekly.days} days this week — a solid rhythm.`
        : `${name} hasn't practised much this week. Two short sessions will keep skills warm.`;

  const strengthLine = topStrong[0]
    ? ` They are strongest in ${topStrong[0].label}${topStrong[0].pct ? ` (${topStrong[0].pct}%)` : ''}.`
    : '';
  const weaknessLine = topWeak[0]
    ? topWeak[0].pct == null
      ? ` ${topWeak[0].label} is the area to look at next — there isn't enough practice yet to put a number on it.`
      : ` ${topWeak[0].label} is the area to focus on next — currently ${topWeak[0].pct}%${_sampleNote(topWeak[0])}.`
    : ' No weak spots have shown up yet — there may simply not be enough practice recorded to tell.';
  const closing =
    ' Encourage them to read aloud short passages every day to keep building fluency.';

  return `${greeting}${strengthLine}${weaknessLine}${closing}`;
}

// ─── Weekly Error Digest ──────────────────────────────────────────────────────

/** Milliseconds in 14 days, used to filter recent attempts. */
const MS_14_DAYS = 14 * 24 * 60 * 60 * 1000;

/**
 * Build a digest of weak skills for the weekly parent focus-areas panel.
 *
 * Reads `questMastery` and `questAttempts` from the store and finds every
 * skill with:
 *   - mastery score < 0.55, AND
 *   - at least 2 attempts in the last 14 days
 *
 * @returns {{ weakSkills: Array<{ quest: string, skill: string, score: number, recentWrong: number }>, generatedAt: string }}
 */
export function buildErrorDigest() {
  const mastery = store.get('questMastery') || {};
  const attempts = store.get('questAttempts') || [];

  const cutoff = Date.now() - MS_14_DAYS;

  // Group recent attempts by "quest::skill"
  const recentByKey = {};
  for (const attempt of attempts) {
    if (!attempt || !attempt.quest || !attempt.skill) continue;
    const ts = typeof attempt.ts === 'number' ? attempt.ts : Date.parse(attempt.ts);
    if (!ts || ts < cutoff) continue;
    const key = `${attempt.quest}::${attempt.skill}`;
    if (!recentByKey[key])
      recentByKey[key] = { total: 0, wrong: 0, quest: attempt.quest, skill: attempt.skill };
    recentByKey[key].total += 1;
    if (!attempt.correct) recentByKey[key].wrong += 1;
  }

  const weakSkills = [];

  for (const [_key, stats] of Object.entries(recentByKey)) {
    if (stats.total < 2) continue;

    // Look up mastery score: mastery[quest][skill]
    const questMastery = mastery[stats.quest];
    const score =
      questMastery && typeof questMastery[stats.skill] === 'number'
        ? questMastery[stats.skill]
        : null;

    if (score === null || score >= 0.55) continue;

    weakSkills.push({
      quest: stats.quest,
      skill: stats.skill,
      score,
      recentWrong: stats.wrong,
    });
  }

  // Sort weakest-first
  weakSkills.sort((a, b) => a.score - b.score);

  return {
    weakSkills,
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Resolve a human-readable label for a skill from the category data files.
 * Checks grammar categories first, then vocab categories.
 *
 * @param {string} skill - category key
 * @returns {{ label: string, icon: string }}
 */
function _categoryMeta(skill) {
  if (GRAMMAR_CATEGORIES[skill]) {
    return { label: GRAMMAR_CATEGORIES[skill].label, icon: GRAMMAR_CATEGORIES[skill].icon };
  }
  if (VOCAB_CATEGORIES[skill]) {
    return { label: VOCAB_CATEGORIES[skill].label, icon: VOCAB_CATEGORIES[skill].icon };
  }
  return { label: skill, icon: '📚' };
}

/**
 * Render the weekly error digest into a DOM container element.
 *
 * Shows "📊 This Week's Focus Areas" with up to 5 weak skills, each
 * displaying an icon, label, accuracy bar, and a "practise now" link.
 * If no weak skills are found: "✅ Great week — no struggling areas!"
 *
 * @param {HTMLElement} container - element to render into
 */
export function renderErrorDigest(container) {
  if (!container) return;

  const digest = buildErrorDigest();
  container.innerHTML = '';

  const heading = document.createElement('h3');
  heading.textContent = "📊 This Week's Focus Areas";
  heading.className = 'error-digest__heading';
  container.appendChild(heading);

  if (!digest.weakSkills.length) {
    const empty = document.createElement('p');
    empty.className = 'error-digest__empty';
    empty.textContent = '✅ Great week — no struggling areas!';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'error-digest__list';

  const top5 = digest.weakSkills.slice(0, 5);
  for (const item of top5) {
    const { label, icon } = _categoryMeta(item.skill);
    const pct = Math.round(item.score * 100);

    const li = document.createElement('li');
    li.className = 'error-digest__item';

    // Icon + label
    const nameSpan = document.createElement('span');
    nameSpan.className = 'error-digest__name';
    nameSpan.textContent = `${icon} ${label}`;

    // Accuracy bar
    const barWrap = document.createElement('span');
    barWrap.className = 'error-digest__bar-wrap';
    barWrap.setAttribute('aria-label', `Accuracy: ${pct}%`);
    const bar = document.createElement('span');
    bar.className = 'error-digest__bar';
    bar.style.width = `${pct}%`;
    const barLabel = document.createElement('span');
    barLabel.className = 'error-digest__bar-label';
    barLabel.textContent = `${pct}%`;
    barWrap.appendChild(bar);
    barWrap.appendChild(barLabel);

    // "Practise now" link
    const link = document.createElement('a');
    link.className = 'error-digest__link';
    link.href = `#quest-${item.quest}`;
    link.textContent = 'practise now';

    li.appendChild(nameSpan);
    li.appendChild(barWrap);
    li.appendChild(link);
    list.appendChild(li);
  }

  container.appendChild(list);
}

/**
 * Build a parent-friendly WhatsApp update — one short message, no jargon.
 */
export function buildWhatsAppMessage(card) {
  if (!card) return '';
  const lines = [];
  lines.push(`📚 ${card.learnerName}'s English update${card.grade ? ` (${card.grade})` : ''}`);
  lines.push(
    `This week: ${card.weekly.days} active days · ${card.weekly.words} questions · ${Math.round(card.weekly.accuracy * 100)}% accuracy`,
  );
  if (card.strengths?.[0]?.pct) {
    lines.push(`✅ Strength: ${card.strengths[0].label} (${card.strengths[0].pct}%)`);
  } else {
    lines.push('✅ Strength: Steady effort');
  }
  if (card.needsPractice?.[0]) {
    const w = card.needsPractice[0];
    const figure =
      w.pct == null ? 'not enough practice yet to score' : `${w.pct}%${_sampleNote(w)}`;
    lines.push(`🎯 Needs practice: ${w.label} (${figure})`);
  }
  if (card.examRisk) {
    lines.push(`🚦 Exam focus: ${card.examRisk.label} — ${card.examRisk.summary}`);
  }
  if (card.recentMistakes?.length) {
    lines.push(
      `📝 Recent slips: ${card.recentMistakes
        .slice(0, 3)
        .map((m) => m.word)
        .join(', ')}`,
    );
  }
  if (card.graduatingSoon?.length) {
    lines.push(
      `🌱 Graduating soon: ${card.graduatingSoon
        .slice(0, 3)
        .map((g) => g.word)
        .join(', ')}`,
    );
  }
  if (card.slippingRecently?.length) {
    lines.push(
      `🍂 Slipping: ${card.slippingRecently
        .slice(0, 3)
        .map((g) => g.word)
        .join(', ')} — a 2-min review tonight will help.`,
    );
  }
  lines.push(`👉 Today's 10 min: ${card.recommendation.title}`);
  // Not "Teacher's note" — no teacher has read this. It is generated from
  // the child's recorded practice, and calling it a teacher's note lends it
  // authority it hasn't earned.
  lines.push(`💬 Automated learning summary: ${card.teacherComment}`);
  return lines.join('\n');
}
