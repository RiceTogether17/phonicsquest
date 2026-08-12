/**
 * PhonicsQuest – Parent Dashboard
 */

import { Chart, registerables } from 'chart.js';
import { progress } from '../modules/progress.js';
import { store } from '../modules/store.js';
import { badges } from '../modules/badges.js';
import { getActiveProfile } from '../modules/profiles.js';
import { WORD_GROUPS, GROUP_ORDER, WORDS } from '../data/words.js';
import { CURRICULUM } from '../data/curriculum.js';
import { getUnlockedStages, buildProgressionSnapshot } from '../modules/progression.js';
import {
  getLearnerSummary,
  getLiteracyDomains,
  getClueInsights,
  getRecommendedActions,
  getRecentPatternInsights,
  getMoeOutcomeMappings,
  getParentCoachingCard,
  getStuckWords,
} from '../modules/dashboardInsights.js';
import { renderCurriculumMap } from './curriculumMap.js';
import {
  getVocabularyCategoryReport,
  getGrammarCategoryReport,
  getLatestQuestScoreboards,
  getMoePriorityRecommendations,
  getLearningFunnelReport,
  getAdaptiveLessonQueue,
} from '../modules/reporting.js';
import { getWeakSkills } from '../modules/remediationRouter.js';
import { buildParentReportCard, buildWhatsAppMessage } from '../modules/parentReportCard.js';
import { confidenceLabel } from '../modules/evidence.js';
import { getGraduatingSoon, getSlippingRecently } from '../modules/reviewScheduler.js';
import { questMastery } from '../modules/questMastery.js';
import { GRAMMAR_CATEGORIES, GRAMMAR_CATEGORY_KEYS } from '../data/grammarCategories.js';
import { VOCAB_CATEGORIES, VOCAB_CATEGORY_KEYS } from '../data/vocabCategories.js';

Chart.register(...registerables);

/** @type {Chart|null} */
let accuracyChart = null;

let _onNavigate = null;

/**
 * Render the full dashboard content.
 * @param {HTMLElement} container  #dashboard-content
 * @param {{ onNavigate?: (mode: string) => void }} [opts]
 */
export function renderDashboard(container, opts = {}) {
  _onNavigate = opts.onNavigate || null;

  const stats = progress.getOverallStats();

  container.innerHTML = `
    <!-- A0: Parent-friendly Report Card (top of the dashboard for non-technical viewing) -->
    <div id="dash-parent-report-card"></div>

    <!-- B0: Parent Coaching Card -->
    <div id="dash-coaching-card"></div>

    <!-- B1: Learner Summary -->
    <div id="dash-learner-summary"></div>

    <!-- B4: Recommended next actions -->
    <div id="dash-actions-section"></div>

    <!-- Stuck words alert -->
    <div id="dash-stuck-words"></div>

    <!-- B2: Literacy Domains -->
    <div id="dash-domains-section"></div>

    <!-- B3: Clue vs Answer Accuracy -->
    <div id="dash-clue-section"></div>

    <!-- B5: Recent Pattern Insights -->
    <div id="dash-patterns-section"></div>

    <!-- B6: Tutor activity — guided lessons, read-aloud, AI usage -->
    <div id="dash-tutor-activity"></div>

    <div id="dash-reporting-section"></div>
    <div id="dash-moe-section"></div>

    <!-- Summary Stats (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Progress Summary</h3>
    <div class="dash-stats-grid">
      <div class="dash-stat-card">
        <span class="dash-stat-value">${stats.wordsAttempted}</span>
        <span class="dash-stat-label">Words practiced</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${stats.wordsMastered}</span>
        <span class="dash-stat-label">Words mastered</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${Math.round(stats.overallAccuracy * 100)}%</span>
        <span class="dash-stat-label">Accuracy</span>
      </div>
      <div class="dash-stat-card">
        <span class="dash-stat-value">${stats.bestStreak}</span>
        <span class="dash-stat-label">Best streak</span>
      </div>
    </div>

    <!-- Accuracy Chart (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Group Mastery</h3>
    <div class="dash-chart-wrap">
      <canvas id="chart-mastery" aria-label="Group mastery chart"></canvas>
    </div>
    <div class="mastery-bar-list" id="mastery-bars"></div>

    <!-- Curriculum Map -->
    <div id="dash-curriculum-map" style="margin-top:24px"></div>

    <!-- Learning Path (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Learning Path</h3>
    <div id="learning-path"></div>

    <!-- Recent Words (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Recent Words</h3>
    <div style="overflow-x:auto;">
      <table class="word-history-table">
        <thead><tr><th>Word</th><th>Mode</th><th>Result</th><th>When</th></tr></thead>
        <tbody id="word-history-body"></tbody>
      </table>
    </div>

    <!-- Badges (existing) -->
    <h3 class="dash-section-title" style="margin-top:24px">Achievements</h3>
    <div id="badge-grid" class="badge-grid"></div>

    <!-- Actions (existing) -->
    <div class="dash-actions">
      <button class="btn btn--ghost" id="btn-export-csv">Export CSV</button>
      <button class="btn btn--ghost" id="btn-export-csv-anon">Export CSV (Anonymised)</button>
      <button class="btn btn--ghost" id="btn-export-report">Export Parent Report (JSON)</button>
      <button class="btn btn--ghost" id="btn-import-csv">Import Words (CSV)</button>
      <button class="btn btn--ghost" id="btn-print-report">🖨️ Print Report</button>
    </div>

    <!-- Print report wrapper (hidden on screen, shown when printing) -->
    <div class="print-report-wrapper">
      <div class="print-report" id="print-report-content"></div>
    </div>

    <h3 class="dash-section-title" style="margin-top:24px">Adaptive Controls</h3>
    <div class="dash-stats-grid">
      <label class="dash-stat-card">Weak-word Weight
        <input type="range" id="adaptive-weak-weight" min="2" max="8" step="0.5" value="5" />
      </label>
      <label class="dash-stat-card">Unseen-word Weight
        <input type="range" id="adaptive-unseen-weight" min="1" max="6" step="0.5" value="3" />
      </label>
    </div>

    <!-- Custom word import panel (hidden by default) -->
    <div id="csv-import-panel" class="dash-import-panel" hidden>
      <h4 class="dash-section-title">Import Custom Words</h4>
      <p class="dash-import-desc">Upload a CSV with columns: <code>word, graphemes, types, group, level, emoji</code><br>
        Or a simple list with just: <code>word</code> (one per line) — we'll auto-detect phonemes for CVC words.</p>
      <div class="dash-import-drop" id="csv-drop-zone">
        <input type="file" id="csv-file-input" accept=".csv,.txt" hidden />
        <span>Drop CSV file here or <button class="btn btn--ghost btn--sm" id="csv-browse-btn">Browse</button></span>
      </div>
      <div id="csv-import-preview" class="dash-import-preview" hidden></div>
      <div id="csv-import-status" class="dash-import-status" hidden></div>
    </div>
  `;

  // Render new insight sections
  _renderParentReportCard();
  _renderParentCoachingCard();
  _renderLearnerSummary();
  _renderRecommendedActions();
  _renderStuckWords();
  _renderLiteracyDomains();
  _renderClueInsights();
  _renderPatternInsights();
  _renderTutorActivity();
  _renderCategoryReporting();
  _renderMoeOutcomes();

  // Render existing sections
  _renderCurriculumMapSection();
  _renderMasteryChart(stats);
  _renderMasteryBars(stats);
  _renderLearningPath(stats);
  _renderWordHistory(stats);
  _renderBadges();
  _renderPrintReport();
  _bindActions();
}

function _renderCurriculumMapSection() {
  const container = document.getElementById('dash-curriculum-map');
  if (!container) return;
  container.innerHTML = `<h3 class="dash-section-title">Learning Journey Map</h3><div id="dash-cm-inner"></div>`;
  const inner = document.getElementById('dash-cm-inner');
  if (inner) renderCurriculumMap(inner);
}

function _renderParentReportCard() {
  const container = document.getElementById('dash-parent-report-card');
  if (!container) return;

  const profile = getActiveProfile();
  const stats = progress.getOverallStats();
  const coaching = getParentCoachingCard();
  const weakSkills = getWeakSkills();

  // Strengths come from quest mastery — pick highest-scoring skill
  const mastery = store.get('questMastery') || {};
  const allMastery = [];
  for (const [, bucket] of Object.entries(mastery)) {
    if (!bucket || typeof bucket !== 'object') continue;
    for (const [skill, score] of Object.entries(bucket)) {
      if (typeof score !== 'number') continue;
      const existing = allMastery.find((r) => r.skill === skill);
      if (existing) {
        if (score > existing.score) existing.score = score;
      } else {
        allMastery.push({ skill, score });
      }
    }
  }
  const strengths = allMastery
    .filter((s) => s.score >= 0.75)
    .sort((a, b) => b.score - a.score)
    .map((s) => ({ skill: s.skill, label: _humaniseSkill(s.skill), score: s.score }));

  // Recent mistakes from word history
  const recentMistakes = (stats.recentHistory || [])
    .filter((h) => h && h.correct === false)
    .slice(0, 5)
    .map((h) => ({ word: h.wordId, mode: h.mode, when: _timeAgo(h.timestamp), correct: false }));

  const weekly = {
    days: coaching?.weekDays ?? 0,
    words: coaching?.weekWords ?? (stats.totalAttempts || 0),
    accuracy: stats.overallAccuracy || 0,
  };

  // Giri's Review Lane signals for the report card — pulled from the same
  // per-word stats that drive the home banner. Graduating soon = positive
  // frame; slipping = gentle nudge.
  const wordStats = store.get('wordStats') || {};
  const graduatingSoon = getGraduatingSoon(wordStats, WORDS).map((g) => ({
    word: g.item.word || g.id,
  }));
  const slippingRecently = getSlippingRecently(wordStats, WORDS).map((g) => ({
    word: g.item.word || g.id,
  }));

  const card = buildParentReportCard({
    profile,
    weakSkills,
    strengths,
    recentMistakes,
    weekly,
    graduatingSoon,
    slippingRecently,
  });

  container.innerHTML = `
    <section class="parent-report-card" aria-label="Parent report card" role="region">
      <header class="parent-report-card__head">
        <span class="parent-report-card__avatar" aria-hidden="true">${card.avatar}</span>
        <div>
          <h3 class="parent-report-card__title">📋 Report Card · ${escapeHtml(card.learnerName)}${card.grade ? ` <small>(${card.grade})</small>` : ''}</h3>
          <p class="parent-report-card__sub">Parent-friendly snapshot · this week ${card.weekly.days} day${card.weekly.days === 1 ? '' : 's'}, ${card.weekly.words} questions, ${Math.round(card.weekly.accuracy * 100)}% accurate</p>
        </div>
        ${
          card.examRisk
            ? `
          <div class="exam-risk exam-risk--${card.examRisk.band}" role="status" aria-label="Exam focus: ${escapeHtml(card.examRisk.label)}">
            <span class="exam-risk__label">${escapeHtml(card.examRisk.label)}</span>
            <span class="exam-risk__summary">${escapeHtml(card.examRisk.summary)}</span>
          </div>`
            : ''
        }
      </header>
      <div class="parent-report-card__grid">
        <div class="parent-report-card__cell">
          <h4>✅ Strengths</h4>
          <ul>
            ${card.strengths.map((s) => `<li>${escapeHtml(s.label)}${s.pct ? ` <strong>(${s.pct}%)</strong>` : ''}</li>`).join('') || '<li>Steady effort across the board</li>'}
          </ul>
        </div>
        <div class="parent-report-card__cell">
          <h4>🎯 Needs Practice</h4>
          <ul class="needs-practice-list">
            ${card.needsPractice.map((s) => `<li class="needs-practice-item needs-practice-item--${s.band || 'amber'}"><span class="needs-practice-dot" aria-hidden="true"></span>${escapeHtml(s.label)} <strong>${s.pct == null ? '(not enough practice yet)' : `(${s.pct}%)`}</strong>${_evidenceNote(s)}</li>`).join('') || '<li>Nothing has been measured yet — a few short sessions will show where things stand</li>'}
          </ul>
        </div>
        ${
          card.habits?.length
            ? `
        <div class="parent-report-card__cell parent-report-card__cell--habits">
          <h4>🔁 Habits to work on</h4>
          <ul class="report-habits">
            ${card.habits
              .map(
                (h) => `<li class="report-habit">
                  <span class="report-habit__name">${escapeHtml(h.label)} <small>· ${h.count} time${h.count === 1 ? '' : 's'}</small></span>
                  <span class="report-habit__tip">${escapeHtml(h.tip)}</span>
                </li>`,
              )
              .join('')}
          </ul>
        </div>`
            : ''
        }
        <div class="parent-report-card__cell">
          <h4>📝 Recent Mistakes</h4>
          <ul>
            ${card.recentMistakes.map((m) => `<li>${escapeHtml(m.word)}${m.mode ? ` <small>· ${escapeHtml(m.mode)}</small>` : ''}${m.when ? ` <small>· ${escapeHtml(m.when)}</small>` : ''}</li>`).join('') || '<li>No recent mistakes recorded</li>'}
          </ul>
        </div>
        ${
          card.graduatingSoon?.length || card.slippingRecently?.length
            ? `
        <div class="parent-report-card__cell parent-report-card__cell--review-lane">
          <h4>🌟 Giri's Review Lane</h4>
          ${
            card.graduatingSoon?.length
              ? `
            <p class="parent-report-card__detail"><strong>🌱 Graduating soon:</strong> ${card.graduatingSoon
              .slice(0, 5)
              .map((g) => escapeHtml(g.word))
              .join(', ')} — about to lock into long-term memory.</p>
          `
              : ''
          }
          ${
            card.slippingRecently?.length
              ? `
            <p class="parent-report-card__detail"><strong>🍂 Slipping:</strong> ${card.slippingRecently
              .slice(0, 5)
              .map((g) => escapeHtml(g.word))
              .join(', ')} — a 2-min review tonight will help.</p>
          `
              : ''
          }
        </div>`
            : ''
        }
        <div class="parent-report-card__cell parent-report-card__cell--cta">
          <h4>⏱️ Recommended 10-minute practice</h4>
          <p><strong>${escapeHtml(card.recommendation.title)}</strong></p>
          <p class="parent-report-card__detail">${escapeHtml(card.recommendation.detail)}</p>
          <button class="btn btn--primary btn--sm" id="parent-report-cta" data-target="${card.recommendation.target}">${escapeHtml(card.recommendation.targetLabel)} →</button>
        </div>
      </div>
      <div class="parent-report-card__teacher">
        <h4>💬 Automated learning summary</h4>
        <p>${escapeHtml(card.teacherComment)}</p>
        <p class="parent-report-card__detail"><small>Generated from recorded practice — not reviewed by a teacher.</small></p>
      </div>
      <div class="parent-report-card__actions">
        <button class="btn btn--primary" id="copy-parent-update" data-clip="parent-update">📲 Copy Parent Update (WhatsApp)</button>
        <span class="parent-report-card__hint" id="parent-update-hint" aria-live="polite"></span>
      </div>
    </section>`;

  const cta = container.querySelector('#parent-report-cta');
  cta?.addEventListener('click', () => {
    const target = cta.dataset.target;
    if (_onNavigate && target) _onNavigate({ target });
  });

  const copyBtn = container.querySelector('#copy-parent-update');
  const hint = container.querySelector('#parent-update-hint');
  copyBtn?.addEventListener('click', async () => {
    const message = buildWhatsAppMessage(card);
    let copied = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
        copied = true;
      }
    } catch (_) {
      /* ignore */
    }

    if (!copied) {
      // Fallback: show the message in a textarea so the parent can copy manually
      const ta = document.createElement('textarea');
      ta.value = message;
      ta.setAttribute('aria-label', 'Parent update message');
      ta.className = 'parent-report-card__fallback';
      ta.readOnly = true;
      copyBtn.parentElement?.appendChild(ta);
      ta.focus();
      ta.select();
    }
    if (hint)
      hint.textContent = copied
        ? 'Copied! Paste it into WhatsApp.'
        : 'Select the text below and copy manually.';
  });
}

/**
 * The evidence behind a reported score: how many answers it rests on and
 * when the skill was last practised. Rendered small, under the percentage,
 * so a figure is never shown without the sample size that produced it.
 */
function _evidenceNote(skill) {
  const n = skill?.attempts ?? 0;
  const bits = [];
  bits.push(n === 0 ? 'no answers recorded' : `${n} answer${n === 1 ? '' : 's'}`);
  if (skill?.lastPractised) bits.push(`last practised ${_timeAgo(skill.lastPractised)}`);
  if (skill?.confidence && skill.confidence !== 'high') {
    bits.push(escapeHtml(confidenceLabel(skill.confidence)).toLowerCase());
  }
  return ` <small class="needs-practice-evidence">· ${escapeHtml(bits.join(' · '))}</small>`;
}

function _humaniseSkill(key) {
  return String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^./, (c) => c.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function _renderParentCoachingCard() {
  const container = document.getElementById('dash-coaching-card');
  if (!container) return;

  const card = getParentCoachingCard();

  const signalClass =
    {
      'on-track': 'coaching-card--green',
      'needs-practice': 'coaching-card--amber',
      'at-risk': 'coaching-card--red',
      'no-data': 'coaching-card--grey',
    }[card.overallSignal] || 'coaching-card--grey';

  // Advancement decision banner (only when there's a clear recommendation)
  const advHtml = card.advancementNote
    ? `<div class="coaching-advancement">${card.advancementNote}</div>`
    : '';

  // At-risk domain chips
  const atRiskHtml = card.domainsAtRisk.length
    ? `<div class="coaching-at-risk">
        <span class="coaching-at-risk-label">🔴 Needs attention:</span>
        ${card.domainsAtRisk.map((d) => `<span class="coaching-domain-chip coaching-chip--red">${d.icon} ${d.label}</span>`).join('')}
       </div>`
    : '';

  // Strength line
  const strengthHtml = `
    <div class="coaching-strength">
      <span class="coaching-strength-label">💪 Strength:</span>
      <span class="coaching-strength-text">${card.mainStrength}</span>
    </div>`;

  // Concern line (only when there is one)
  const concernHtml = card.mainConcern
    ? `<div class="coaching-concern">
        <span class="coaching-concern-label">⚠️ Concern:</span>
        <span class="coaching-concern-text">${card.mainConcern}</span>
       </div>`
    : '';

  // Weekly priority with explanation
  const priorityHtml = `
    <div class="coaching-priority">
      <div class="coaching-priority-head">
        <span class="coaching-priority-icon">🎯</span>
        <span class="coaching-priority-text">${card.weeklyPriority}</span>
      </div>
      <p class="coaching-priority-why">${card.whyPriority}</p>
    </div>`;

  // Weekly XP (only show when non-zero)
  const xpStatHtml =
    card.weekXp > 0
      ? `<div class="coaching-stat">
        <span class="coaching-stat-value">+${card.weekXp}</span>
        <span class="coaching-stat-label">XP this week</span>
       </div>`
      : '';

  // Review note
  const reviewHtml =
    card.reviewsDue > 0
      ? `<div class="coaching-review">
        <span class="coaching-review-icon">🔁</span>
        <span class="coaching-review-text">${card.reviewNote}</span>
       </div>`
      : '';

  container.innerHTML = `
    <div class="coaching-card ${signalClass}" aria-label="Parent coaching summary">
      <div class="coaching-card-header">
        <span class="coaching-signal-badge">${card.signalEmoji} ${card.signalLabel}</span>
        <span class="coaching-card-title">This Week's Coaching Report</span>
      </div>

      <div class="coaching-stats-row">
        <div class="coaching-stat">
          <span class="coaching-stat-value">${card.weekDays}</span>
          <span class="coaching-stat-label">days active</span>
        </div>
        <div class="coaching-stat">
          <span class="coaching-stat-value">${card.weekWords}</span>
          <span class="coaching-stat-label">words practised</span>
        </div>
        <div class="coaching-stat">
          <span class="coaching-stat-value">${card.streak}</span>
          <span class="coaching-stat-label">day streak</span>
        </div>
        ${xpStatHtml}
      </div>

      ${advHtml}
      ${strengthHtml}
      ${concernHtml}
      ${atRiskHtml}
      ${priorityHtml}
      ${reviewHtml}
    </div>`;
}

function _renderCategoryReporting() {
  const container = document.getElementById('dash-reporting-section');
  if (!container) return;

  const vocabRows = getVocabularyCategoryReport()
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 8);
  const grammarRows = getGrammarCategoryReport()
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 8);
  const scoreboards = getLatestQuestScoreboards();
  const priorities = getMoePriorityRecommendations();
  const funnel = getLearningFunnelReport({ days: 7 });
  const lessonQueue = getAdaptiveLessonQueue({ limit: 6 });

  const rowHtml = (rows) =>
    rows
      .map((r) => {
        const pct = Math.round((r.accuracy || 0) * 100);
        const cluePct = Math.round((r.clueSuccess || 0) * 100);
        return `<div class="dash-category-row" title="${r.tooltip}">
      <div class="dash-category-head">
        <span><strong>${r.label}</strong> <small>(${r.loCode})</small></span>
        <span>${pct}%</span>
      </div>
      <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${pct}%"></div></div>
      <div class="dash-category-meta">Attempts: ${r.attempts} · Clue success: ${cluePct}% · <a href="${r.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
    </div>`;
      })
      .join('');

  const priorityBlock = (title, rows) => `
    <div class="dash-pattern-item">
      <strong>${title}</strong>
      ${rows
        .map(
          (r) => `<div class="dash-category-row" title="${r.tooltip}">
        <div class="dash-category-head">
          <span><strong>${r.label}</strong> <small>(${r.loCode})</small></span>
          <span>${Math.round((r.accuracy || 0) * 100)}%</span>
        </div>
        <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${Math.round((r.accuracy || 0) * 100)}%"></div></div>
        <div class="dash-category-meta">Priority score: ${r.priorityScore.toFixed(2)} · <a href="${r.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
      </div>`,
        )
        .join('')}
    </div>`;

  const scoreHtml = scoreboards
    .map((s) => {
      const pct = Math.round((s.accuracy || 0) * 100);
      return `<div class="dash-scoreboard-chip"><strong>${s.quest}</strong><br>${s.correct}/${s.total} · ${pct}%</div>`;
    })
    .join('');

  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:24px">Quest Category Reporting</h3>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="dash-pattern-item">
        <strong>Vocabulary categories</strong>
        ${rowHtml(vocabRows)}
      </div>
      <div class="dash-pattern-item">
        <strong>Grammar categories</strong>
        ${rowHtml(grammarRows)}
      </div>
    </div>
    <div class="dash-actions" style="justify-content:flex-start;gap:8px;margin-top:10px;">${scoreHtml}</div>
    <div class="dash-category-row" title="Recent telemetry-driven learning health">
      <div class="dash-category-head"><span><strong>7-day Learning Funnel</strong></span><span>${Math.round((funnel.accuracy || 0) * 100)}%</span></div>
      <div class="dash-category-meta">Attempts: ${funnel.attempts} · Correct: ${funnel.correct} · Avg response: ${funnel.avgResponseMs !== null ? `${funnel.avgResponseMs}ms` : 'N/A'}</div>
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">MOE Priority Recommendations</h4>
    <div class="dash-pattern-list" style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      ${priorityBlock('Priority vocabulary revision', priorities.vocab)}
      ${priorityBlock('Priority grammar revision', priorities.grammar)}
    </div>
    <h4 class="dash-section-title" style="margin-top:16px">Adaptive Next Lesson Queue</h4>
    <ul class="dash-pattern-list">
      ${lessonQueue.map((item) => `<li class="dash-pattern-item"><strong>${item.quest}</strong> · ${item.label} <small>(${item.loCode})</small><br>${item.reason}</li>`).join('')}
    </ul>
  `;
}

function _renderMoeOutcomes() {
  const container = document.getElementById('dash-moe-section');
  if (!container) return;
  const rows = getMoeOutcomeMappings();
  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:24px">MOE Learning Outcome Mapping</h3>
    <ul class="dash-pattern-list">
      ${rows.map((r) => `<li class="dash-pattern-item"><strong>${r.code}</strong> · ${r.focus}</li>`).join('')}
    </ul>`;
}

// ── B1: Learner Summary ──────────────────────────────────────────────────────

function _renderLearnerSummary() {
  const container = document.getElementById('dash-learner-summary');
  if (!container) return;

  const s = getLearnerSummary();
  const accent = store.get('speechLocale') || 'en-SG';

  container.innerHTML = `
    <div class="dash-learner-summary">
      <div class="dash-learner-avatar">${escapeHtml(s.profileAvatar)}</div>
      <div class="dash-learner-info">
        <div class="dash-learner-name">${escapeHtml(s.profileName)}</div>
        <div class="dash-learner-type-badge">${s.learnerType} Pathway</div>
      </div>
      <div class="dash-learner-stats">
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Strongest area</span>
          <span class="dash-learner-stat-value">${s.strongest}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Needs attention</span>
          <span class="dash-learner-stat-value">${s.weakest}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Current focus</span>
          <span class="dash-learner-stat-value">${s.currentFocus}</span>
        </div>
        <div class="dash-learner-stat">
          <span class="dash-learner-stat-label">Speech accent</span>
          <span class="dash-learner-stat-value">${accent}</span>
        </div>
      </div>
    </div>`;
}

// ── B2: Literacy Domains ─────────────────────────────────────────────────────

function _renderLiteracyDomains() {
  const container = document.getElementById('dash-domains-section');
  if (!container) return;

  const domains = getLiteracyDomains();
  const hasData = domains.some((d) => d.score !== null);

  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:24px">Literacy Domains</h3>
    ${!hasData ? '<p class="dash-no-data">Play more to see domain scores here.</p>' : ''}
    <div class="dash-domains-grid">
      ${domains
        .map((d) => {
          const pct = d.score !== null ? Math.round(d.score * 100) : null;
          const barColor =
            pct === null
              ? '#e5e3fa'
              : pct >= 70
                ? 'var(--color-success)'
                : pct >= 45
                  ? 'var(--color-warning)'
                  : 'var(--color-error)';
          return `
          <div class="dash-domain-card">
            <span class="dash-domain-icon">${d.icon}</span>
            <span class="dash-domain-label">${d.label}</span>
            ${
              pct !== null
                ? `
              <div class="dash-domain-bar-track">
                <div class="dash-domain-bar-fill" style="width:${pct}%;background:${d.color}"></div>
              </div>
              <span class="dash-domain-pct" style="color:${barColor}">${pct}%</span>`
                : '<span class="dash-domain-pct" style="color:var(--text-muted)">No data yet</span>'
            }
          </div>`;
        })
        .join('')}
    </div>`;
}

// ── B3: Clue vs Answer Accuracy ──────────────────────────────────────────────

function _renderClueInsights() {
  const container = document.getElementById('dash-clue-section');
  if (!container) return;

  const { questInsights, byType } = getClueInsights();

  if (!questInsights.length && !byType.length) {
    container.innerHTML = `
      <h3 class="dash-section-title" style="margin-top:24px">Clue Detection</h3>
      <p class="dash-no-data">Complete quests with clue missions to see clue accuracy here.</p>`;
    return;
  }

  const questRows = questInsights
    .map((qi) => {
      const clueColor =
        qi.clueAccuracy >= 0.7
          ? 'var(--color-success)'
          : qi.clueAccuracy >= 0.45
            ? 'var(--color-warning)'
            : 'var(--color-error)';
      return `
      <div class="dash-clue-row">
        <div class="dash-clue-quest-label">${qi.icon} ${qi.quest}</div>
        <div class="dash-clue-metrics">
          <div class="dash-clue-metric">
            <span class="dash-clue-metric-label">Clue accuracy</span>
            <span class="dash-clue-metric-val" style="color:${clueColor}">${Math.round(qi.clueAccuracy * 100)}%</span>
            <span class="dash-clue-metric-sub">(${qi.clueAttempted} attempts)</span>
          </div>
          ${
            qi.answerAccuracy !== null
              ? `
            <div class="dash-clue-metric">
              <span class="dash-clue-metric-label">Answer accuracy</span>
              <span class="dash-clue-metric-val">${Math.round(qi.answerAccuracy * 100)}%</span>
            </div>`
              : ''
          }
        </div>
        ${qi.interpretation ? `<p class="dash-clue-interpretation">${qi.interpretation}</p>` : ''}
      </div>`;
    })
    .join('');

  const typeRows =
    byType.length > 0
      ? `
    <h4 class="dash-clue-type-title">By Clue Type</h4>
    <div class="dash-clue-types">
      ${byType
        .slice(0, 5)
        .map((t) => {
          const pct = Math.round(t.accuracy * 100);
          const col =
            pct >= 70
              ? 'var(--color-success)'
              : pct >= 45
                ? 'var(--color-warning)'
                : 'var(--color-error)';
          return `
          <div class="dash-clue-type-row">
            <span class="dash-clue-type-label">${t.type}</span>
            <div class="dash-clue-type-bar-track">
              <div class="dash-clue-type-bar" style="width:${pct}%;background:${col}"></div>
            </div>
            <span class="dash-clue-type-pct" style="color:${col}">${pct}%</span>
          </div>`;
        })
        .join('')}
    </div>`
      : '';

  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:24px">Clue Detection vs. Answer Accuracy</h3>
    <div class="dash-clue-list">${questRows}</div>
    ${typeRows}`;
}

// ── B4: Recommended Next Actions ─────────────────────────────────────────────

function _renderRecommendedActions() {
  const container = document.getElementById('dash-actions-section');
  if (!container) return;

  const actions = getRecommendedActions();

  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:0">Recommended Next Steps</h3>
    <div class="dash-rec-actions">
      ${actions
        .map(
          (a, i) => `
        <div class="dash-rec-action">
          <div class="dash-rec-action-num">${i + 1}</div>
          <div class="dash-rec-action-body">
            <div class="dash-rec-action-target">${a.target}</div>
            <div class="dash-rec-action-why">${a.why}</div>
          </div>
          <button class="btn btn--primary btn--sm dash-rec-cta"
                  data-target="${a.ctaTarget}"
                  ${a.ctaGroup ? `data-group="${a.ctaGroup}"` : ''}>
            ${a.ctaLabel}
          </button>
        </div>`,
        )
        .join('')}
    </div>`;

  // Wire CTAs if navigation callback is available
  container.querySelectorAll('.dash-rec-cta').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const group = btn.dataset.group || null;
      _onNavigate?.({ target, group });
    });
  });
}

// ── Stuck Words Alert ────────────────────────────────────────────────────────

function _renderStuckWords() {
  const container = document.getElementById('dash-stuck-words');
  if (!container) return;

  const stuckWords = getStuckWords();
  if (!stuckWords.length) return;

  const wordPills = stuckWords
    .map(
      (w) => `
    <div class="stuck-word-pill" aria-label="${w.word}: ${w.accuracy}% correct after ${w.attempts} tries">
      <span class="stuck-word-text">${w.word}</span>
      <span class="stuck-word-stat">${w.accuracy}%</span>
    </div>`,
    )
    .join('');

  container.innerHTML = `
    <div class="stuck-words-card" role="alert" aria-label="Words needing attention">
      <div class="stuck-words-header">
        <span class="stuck-words-icon" aria-hidden="true">🔍</span>
        <div>
          <h3 class="stuck-words-title">Words Needing Extra Attention</h3>
          <p class="stuck-words-subtitle">Your child has attempted these ${stuckWords.length} word${stuckWords.length !== 1 ? 's' : ''} many times with low accuracy. App practice alone may not be enough.</p>
        </div>
      </div>
      <div class="stuck-words-list">${wordPills}</div>
      <p class="stuck-words-tip"><strong>Try at home:</strong> Say the word aloud, clap each sound, then blend — e.g. /c/ … /a/ … /t/ → "cat". Pair it with a picture or object they know.</p>
    </div>`;
}

// ── B5: Recent Pattern Insights ──────────────────────────────────────────────

function _renderPatternInsights() {
  const container = document.getElementById('dash-patterns-section');
  if (!container) return;

  const insights = getRecentPatternInsights();
  if (!insights.length) return;

  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:24px">Recent Learning Patterns</h3>
    <ul class="dash-pattern-list">
      ${insights.map((i) => `<li class="dash-pattern-item">💬 ${i}</li>`).join('')}
    </ul>`;
}

/**
 * Tutor-style activity report: guided lessons completed, read-aloud
 * sessions (with words to practise together), and the parent-visible
 * AI usage log. Each block renders only when there is data.
 */
function _renderTutorActivity() {
  const container = document.getElementById('dash-tutor-activity');
  if (!container) return;

  const lessons = (store.get('lessonHistory') || []).slice(0, 30);
  const readAloud = store.get('readAloudStats') || {};
  const aiLog = (store.get('aiUsageLog') || []).slice(0, 8);
  const readAloudEntries = Object.entries(readAloud)
    .sort((a, b) => String(b[1]?.updatedAt || '').localeCompare(String(a[1]?.updatedAt || '')))
    .slice(0, 5);

  if (!lessons.length && !readAloudEntries.length && !aiLog.length) return;

  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  const lessonsRecent = lessons.filter((l) => {
    const t = new Date(l.completedAt || l.date).getTime();
    return Number.isFinite(t) && t >= cutoff;
  }).length;

  const lessonHtml = lessons.length
    ? `
    <div class="dash-stat-card">
      <span class="dash-stat-value">${lessonsRecent}</span>
      <span class="dash-stat-label">Guided lessons · last 14 days</span>
    </div>`
    : '';

  const missedWords = [
    ...new Set(readAloudEntries.flatMap(([, s]) => s?.lastMissedWords || [])),
  ].slice(0, 8);
  const readAloudHtml = readAloudEntries.length
    ? `
    <div class="dash-stat-card">
      <span class="dash-stat-value">${readAloudEntries.reduce((sum, [, s]) => sum + (s?.attempts || 0), 0)}</span>
      <span class="dash-stat-label">Read-to-Giri story readings</span>
    </div>`
    : '';

  const aiKinds = {
    explain: '❓ Why explained',
    hint: '💡 Hint',
    ask: '🦉 Ask Giri',
    grade: '✍️ Essay marked',
  };
  const aiHtml = aiLog.length
    ? `
    <details class="dash-ai-log">
      <summary>✨ AI tutor usage (${aiLog.length} recent) — everything your child asked</summary>
      <ul class="dash-pattern-list">
        ${aiLog.map((e) => `<li class="dash-pattern-item">${aiKinds[e.kind] || e.kind} · ${escapeHtml(e.summary || '')} <small>(${escapeHtml(e.date || '')})</small></li>`).join('')}
      </ul>
    </details>`
    : '';

  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:24px">Tutor Activity</h3>
    <div class="dash-stats-grid">
      ${lessonHtml}
      ${readAloudHtml}
    </div>
    ${missedWords.length ? `<p class="dash-pattern-item" style="margin-top:8px">🔤 <strong>Words to practise together</strong> (flagged while reading aloud): ${missedWords.map(escapeHtml).join(', ')}</p>` : ''}
    ${aiHtml}`;
}

// ── Existing chart/mastery/history sections ───────────────────────────────────

function _renderMasteryChart(stats) {
  const canvas = document.getElementById('chart-mastery');
  if (!canvas) return;

  if (accuracyChart) {
    accuracyChart.destroy();
    accuracyChart = null;
  }

  const groups = GROUP_ORDER.filter((g) => WORD_GROUPS[g]);
  const labels = groups.map((g) => WORD_GROUPS[g].label);
  const data = groups.map((g) => Math.round((stats.groupMastery[g] ?? 0) * 100));
  const colors = groups.map((g) => WORD_GROUPS[g].color);

  accuracyChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Mastery %',
          data,
          backgroundColor: colors.map((c) => c + '80'),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 6,
          barPercentage: 0.7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { callback: (v) => v + '%', font: { size: 11 } },
          grid: { display: false },
        },
        x: {
          ticks: { font: { size: 10 }, maxRotation: 45 },
          grid: { display: false },
        },
      },
    },
  });
}

function _renderMasteryBars(stats) {
  const container = document.getElementById('mastery-bars');
  if (!container) return;

  container.innerHTML = GROUP_ORDER.map((group) => {
    const meta = WORD_GROUPS[group];
    if (!meta) return '';
    const pct = Math.round((stats.groupMastery[group] ?? 0) * 100);
    return `
      <div class="mastery-bar-item">
        <span class="mastery-bar-label">${meta.icon} ${meta.label}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${pct}%; background:${meta.color}"></div>
        </div>
        <span class="mastery-bar-pct">${pct}%</span>
      </div>`;
  }).join('');
}

function _renderLearningPath(stats) {
  const container = document.getElementById('learning-path');
  if (!container) return;

  const unlocked = getUnlockedStages(buildProgressionSnapshot());

  container.innerHTML = CURRICULUM.map((stage) => {
    const isUnlocked = unlocked.includes(stage.id);
    const stageGroups = stage.groups ?? (stage.group ? [stage.group] : []);
    const groupAccuracies = stageGroups.map((g) => stats.groupMastery[g] ?? 0);
    const avgAccuracy = stageGroups.length
      ? Math.round((groupAccuracies.reduce((a, b) => a + b, 0) / stageGroups.length) * 100)
      : 0;

    return `
      <div class="mastery-bar-item" style="opacity:${isUnlocked ? 1 : 0.4}">
        <span class="mastery-bar-label">${stage.icon} ${stage.name}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${avgAccuracy}%"></div>
        </div>
        <span class="mastery-bar-pct">${isUnlocked ? avgAccuracy + '%' : '🔒'}</span>
      </div>`;
  }).join('');
}

function _renderWordHistory(stats) {
  const tbody = document.getElementById('word-history-body');
  if (!tbody) return;

  const rows = stats.recentHistory.slice(0, 30).map((h) => {
    const word = WORDS.find((w) => w.id === h.wordId);
    const emoji = word?.emoji || '';
    const timeAgo = _timeAgo(h.timestamp);
    const result = h.correct
      ? '<span style="color:var(--color-success)">✓</span>'
      : '<span style="color:var(--color-error)">✗</span>';

    return `<tr>
      <td>${emoji} ${h.wordId}</td>
      <td>${h.mode}</td>
      <td>${result}</td>
      <td>${timeAgo}</td>
    </tr>`;
  });

  tbody.innerHTML =
    rows.join('') ||
    '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No history yet</td></tr>';
}

function _renderBadges() {
  const container = document.getElementById('badge-grid');
  if (!container) return;

  const all = badges.getAll();
  container.setAttribute(
    'aria-label',
    `${badges.earnedCount} of ${badges.totalCount} badges earned`,
  );

  container.innerHTML = all
    .map(
      (b) => `
    <div class="badge-card ${b.earned ? 'badge-card--earned' : 'badge-card--locked'}"
         title="${b.desc}"
         aria-label="${b.name}${b.earned ? ' — earned' : ' — locked'}">
      <span class="badge-emoji">${b.earned ? b.emoji : '🔒'}</span>
      <span class="badge-name">${b.name}</span>
    </div>`,
    )
    .join('');
}

function _bindActions() {
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const csv = progress.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phonicsquest-progress.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-export-csv-anon')?.addEventListener('click', () => {
    const csv = progress
      .exportCSV()
      .split('\n')
      .map((line, idx) => {
        if (idx === 0 || !line.trim()) return line;
        const [word, ...rest] = line.split(',');
        const masked = `${word.slice(0, 1)}***`;
        return [masked, ...rest].join(',');
      })
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'phonicsquest-progress-anonymised.csv';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-export-report')?.addEventListener('click', () => {
    const report = _buildParentReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phonicsquest-parent-report-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-import-csv')?.addEventListener('click', () => {
    const panel = document.getElementById('csv-import-panel');
    if (panel) panel.hidden = !panel.hidden;
  });

  document.getElementById('csv-browse-btn')?.addEventListener('click', () => {
    document.getElementById('csv-file-input')?.click();
  });

  document.getElementById('csv-file-input')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) _handleCSVImport(file);
  });

  const dropZone = document.getElementById('csv-drop-zone');
  if (dropZone) {
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dash-import-drop--active');
    });
    dropZone.addEventListener('dragleave', () =>
      dropZone.classList.remove('dash-import-drop--active'),
    );
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dash-import-drop--active');
      const file = e.dataTransfer?.files?.[0];
      if (file) _handleCSVImport(file);
    });
  }

  // Adaptive controls
  const adaptiveWeak = /** @type {HTMLInputElement|null} */ (
    document.getElementById('adaptive-weak-weight')
  );
  const adaptiveUnseen = /** @type {HTMLInputElement|null} */ (
    document.getElementById('adaptive-unseen-weight')
  );
  const cfg = store.get('adaptiveConfig') || {};
  if (adaptiveWeak) {
    adaptiveWeak.value = String(cfg.weakWeight ?? 5);
    adaptiveWeak.addEventListener('input', () => {
      store.set('adaptiveConfig', {
        ...(store.get('adaptiveConfig') || {}),
        weakWeight: Number(adaptiveWeak.value),
      });
    });
  }
  if (adaptiveUnseen) {
    adaptiveUnseen.value = String(cfg.unseenWeight ?? 3);
    adaptiveUnseen.addEventListener('input', () => {
      store.set('adaptiveConfig', {
        ...(store.get('adaptiveConfig') || {}),
        unseenWeight: Number(adaptiveUnseen.value),
      });
    });
  }

  // Print Report button
  document.getElementById('btn-print-report')?.addEventListener('click', () => {
    document.body.classList.add('print-mode');
    window.print();
    setTimeout(() => document.body.classList.remove('print-mode'), 2000);
  });
}

function _renderPrintReport() {
  const container = document.getElementById('print-report-content');
  if (!container) return;

  // Today's date
  const today = new Date().toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Helper to colour-code a mastery score (0–1)
  function _scoreColor(score) {
    const pct = score * 100;
    if (pct >= 70) return '#22c55e';
    if (pct >= 40) return '#f59e0b';
    return '#ef4444';
  }

  // Build rows for one skill category list
  function _skillRows(questKey, categoryKeys, categories) {
    const rows = [];
    for (const key of categoryKeys) {
      const score = questMastery.getSkillScore(questKey, key);
      if (score === 0.5) continue; // default/unattempted — skip
      const pct = Math.round(score * 100);
      const color = _scoreColor(score);
      const label = categories[key]?.label || key;
      const barWidth = Math.max(pct, 4);
      rows.push(`
        <div class="print-report-skill-row">
          <div class="print-report-bar" style="width:${barWidth}px;background:${color};"></div>
          <span style="color:${color};font-weight:600;min-width:36px">${pct}%</span>
          <span>${escapeHtml(label)}</span>
        </div>`);
    }
    return rows.join('') || '<p style="font-size:12px;color:#6b7280">No attempts recorded yet.</p>';
  }

  // Overall stats from store
  const xpTotal = store.get('xp') ?? 0;
  const streak = store.get('streak') ?? 0;
  const dailyGoal = store.get('dailyGoal') ?? 0;
  const daysPlayed = (() => {
    const history = store.get('dailyHistory') || {};
    const now = Date.now();
    const msPerDay = 86400000;
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const day = new Date(now - i * msPerDay).toISOString().slice(0, 10);
      if (history[day]) count++;
    }
    return count;
  })();

  container.innerHTML = `
    <div style="font-family:serif;padding:24px;max-width:700px;margin:0 auto;color:#1e1b4b">
      <h1 style="font-size:20px;margin:0 0 4px">PhonicsQuest — Student Report</h1>
      <p style="font-size:12px;color:#6b7280;margin:0 0 20px">Printed: ${escapeHtml(today)}</p>

      <div class="print-report-section">
        <h3>Overall Stats</h3>
        <div style="display:flex;gap:24px;font-size:12px">
          <span><strong>XP total:</strong> ${xpTotal}</span>
          <span><strong>Day streak:</strong> ${streak}</span>
          <span><strong>Daily goal:</strong> ${dailyGoal}</span>
          <span><strong>Days played this week:</strong> ${daysPlayed}</span>
        </div>
      </div>

      <div class="print-report-section">
        <h3>Grammar Skills</h3>
        ${_skillRows('grammarMcq', GRAMMAR_CATEGORY_KEYS, GRAMMAR_CATEGORIES)}
      </div>

      <div class="print-report-section">
        <h3>Vocabulary Skills</h3>
        ${_skillRows('vocabMcq', VOCAB_CATEGORY_KEYS, VOCAB_CATEGORIES)}
      </div>

      <p style="font-size:11px;color:#6b7280;border-top:1px solid #ccc;padding-top:8px;margin-top:24px">
        Generated by PhonicsQuest · For teacher/parent use only
      </p>
    </div>`;
}

function _buildParentReport() {
  const stats = progress.getOverallStats();
  const profile = getActiveProfile();
  return {
    generatedAt: new Date().toISOString(),
    learnerSummary: getLearnerSummary(),
    literacyDomains: getLiteracyDomains(),
    clueInsights: getClueInsights(),
    recommendedActions: getRecommendedActions(),
    recentPatternInsights: getRecentPatternInsights(),
    progress: {
      wordsAttempted: stats.wordsAttempted,
      wordsMastered: stats.wordsMastered,
      overallAccuracy: stats.overallAccuracy,
      bestStreak: stats.bestStreak,
      totalAttempts: stats.totalAttempts,
      totalCorrect: stats.totalCorrect,
      groupMastery: stats.groupMastery,
      recentHistory: stats.recentHistory.slice(0, 50),
      profile,
    },
  };
}

// ── CSV Import (unchanged) ────────────────────────────────────────────────────

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const CONSONANTS = new Set('bcdfghjklmnpqrstvwxyz'.split(''));

function _autoDetectPhonemes(word) {
  const lower = word.toLowerCase();
  const graphemes = lower.split('');
  const types = graphemes.map((ch) => {
    if (VOWELS.has(ch)) return 'sv';
    if (CONSONANTS.has(ch)) return 'c';
    return 'c';
  });
  return { graphemes, types };
}

function _detectGroup(word) {
  const vowel = word
    .toLowerCase()
    .split('')
    .find((ch) => VOWELS.has(ch));
  return vowel ? `short-${vowel}` : 'short-a';
}

function _detectPattern(graphemes, types) {
  const consonantBefore = [],
    consonantAfter = [];
  let foundVowel = false;
  for (const t of types) {
    if (t === 'sv' || t === 'lv') {
      foundVowel = true;
      continue;
    }
    if (!foundVowel) consonantBefore.push(t);
    else consonantAfter.push(t);
  }
  const c1 = consonantBefore.length,
    c2 = consonantAfter.length;
  if (c1 <= 1 && c2 <= 1) return 'CVC';
  if (c1 >= 2 && c2 <= 1) return 'blend';
  if (c1 <= 1 && c2 >= 2) return 'CVCC';
  return 'CCVCC';
}

async function _handleCSVImport(file) {
  const preview = document.getElementById('csv-import-preview');
  const status = document.getElementById('csv-import-status');
  if (!preview || !status) return;

  const text = await file.text();
  const lines = text
    .trim()
    .split('\n')
    .filter((l) => l.trim());

  if (!lines.length) {
    status.hidden = false;
    status.textContent = 'File is empty.';
    status.className = 'dash-import-status dash-import-status--error';
    return;
  }

  const firstLine = lines[0].trim();
  const isFullCSV = firstLine.includes(',');
  const words = [];
  const existingIds = new Set(WORDS.map((w) => w.id));

  if (isFullCSV) {
    const header = firstLine
      .toLowerCase()
      .split(',')
      .map((h) => h.trim());
    const wordIdx = header.indexOf('word');
    if (wordIdx < 0) {
      status.hidden = false;
      status.textContent = 'CSV must have a "word" column.';
      status.className = 'dash-import-status dash-import-status--error';
      return;
    }
    const graphIdx = header.indexOf('graphemes');
    const typesIdx = header.indexOf('types');
    const groupIdx = header.indexOf('group');
    const levelIdx = header.indexOf('level');
    const emojiIdx = header.indexOf('emoji');

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim());
      const w = cols[wordIdx];
      if (!w || existingIds.has(w.toLowerCase())) continue;

      const graphemes =
        graphIdx >= 0 && cols[graphIdx]
          ? cols[graphIdx].split(/[|;]/)
          : _autoDetectPhonemes(w).graphemes;
      const types =
        typesIdx >= 0 && cols[typesIdx]
          ? cols[typesIdx].split(/[|;]/)
          : _autoDetectPhonemes(w).types;

      words.push({
        id: w.toLowerCase(),
        word: w.toLowerCase(),
        graphemes,
        types,
        pattern: _detectPattern(graphemes, types),
        group: (groupIdx >= 0 && cols[groupIdx]) || _detectGroup(w),
        level: (levelIdx >= 0 && parseInt(cols[levelIdx])) || 1,
        emoji: (emojiIdx >= 0 && cols[emojiIdx]) || '',
      });
    }
  } else {
    for (const line of lines) {
      const w = line.trim().toLowerCase();
      if (!w || existingIds.has(w)) continue;
      const { graphemes, types } = _autoDetectPhonemes(w);
      words.push({
        id: w,
        word: w,
        graphemes,
        types,
        pattern: _detectPattern(graphemes, types),
        group: _detectGroup(w),
        level: 1,
        emoji: '',
      });
    }
  }

  if (!words.length) {
    status.hidden = false;
    status.textContent = 'No new words found (all may already exist).';
    status.className = 'dash-import-status dash-import-status--error';
    return;
  }

  preview.hidden = false;
  preview.innerHTML = `
    <p><strong>${words.length} new word${words.length > 1 ? 's' : ''}</strong> ready to import:</p>
    <div class="dash-import-word-list">${words
      .slice(0, 20)
      .map(
        (w) =>
          `<span class="dash-import-word">${w.emoji ? w.emoji + ' ' : ''}${w.word} <small>(${w.group})</small></span>`,
      )
      .join(
        '',
      )}${words.length > 20 ? `<span class="dash-import-word">…and ${words.length - 20} more</span>` : ''}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${words.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>`;

  document.getElementById('csv-cancel-import')?.addEventListener('click', () => {
    preview.hidden = true;
    status.hidden = true;
  });

  document.getElementById('csv-confirm-import')?.addEventListener('click', () => {
    WORDS.push(...words);
    const existing = store.get('customWords') || [];
    store.set('customWords', [...existing, ...words]);
    preview.hidden = true;
    status.hidden = false;
    status.textContent = `Imported ${words.length} word${words.length > 1 ? 's' : ''} successfully!`;
    status.className = 'dash-import-status dash-import-status--success';
  });
}

function _timeAgo(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

/** Destroy the chart cleanly when modal closes. */
export function destroyDashboard() {
  if (accuracyChart) {
    accuracyChart.destroy();
    accuracyChart = null;
  }
}
