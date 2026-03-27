/**
 * PhonicsQuest – Parent Dashboard
 *
 * Upgraded (Part B) to surface actionable insights:
 *   B1. Learner summary panel at the top
 *   B2. Literacy domains section
 *   B3. Clue accuracy vs. answer accuracy
 *   B4. Recommended next actions (with CTAs)
 *   B5. Recent learning pattern insights
 *   B6. Existing charts preserved below action content
 *
 * All data is computed from real store state via dashboardInsights.js.
 */

import { Chart, registerables } from 'chart.js';
import { progress } from '../modules/progress.js';
import { store } from '../modules/store.js';
import { badges } from '../modules/badges.js';
import { getActiveProfile, getProfiles, getClasses, saveClasses } from '../modules/profiles.js';
import { WORD_GROUPS, GROUP_ORDER, WORDS } from '../data/words.js';
import { CURRICULUM, getUnlockedStages } from '../data/curriculum.js';
import {
  getLearnerSummary,
  getLiteracyDomains,
  getClueInsights,
  getRecommendedActions,
  getRecentPatternInsights,
  getMoeOutcomeMappings,
  getParentCoachingCard,
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

Chart.register(...registerables);

/** @type {Chart|null} */
let accuracyChart = null;

// Callback wired in by app.js to navigate to a quest/mode
let _onNavigate = null;

/**
 * Render the full dashboard content.
 * @param {HTMLElement} container  #dashboard-content
 * @param {{ onNavigate?: Function }} [opts]
 */
export function renderDashboard(container, opts = {}) {
  _onNavigate = opts.onNavigate || null;

  const stats = progress.getOverallStats();

  container.innerHTML = `
    <!-- B0: Parent Coaching Card -->
    <div id="dash-coaching-card"></div>

    <!-- B1: Learner Summary -->
    <div id="dash-learner-summary"></div>

    <!-- B4: Recommended next actions -->
    <div id="dash-actions-section"></div>

    <!-- B2: Literacy Domains -->
    <div id="dash-domains-section"></div>

    <!-- B3: Clue vs Answer Accuracy -->
    <div id="dash-clue-section"></div>

    <!-- B5: Recent Pattern Insights -->
    <div id="dash-patterns-section"></div>

    <div id="dash-reporting-section"></div>
    <div id="dash-moe-section"></div>
    <div id="dash-class-section"></div>

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
  _renderParentCoachingCard();
  _renderLearnerSummary();
  _renderRecommendedActions();
  _renderLiteracyDomains();
  _renderClueInsights();
  _renderPatternInsights();
  _renderCategoryReporting();
  _renderMoeOutcomes();
  _renderClassManagement();

  // Render existing sections
  _renderCurriculumMapSection();
  _renderMasteryChart(stats);
  _renderMasteryBars(stats);
  _renderLearningPath(stats);
  _renderWordHistory(stats);
  _renderBadges();
  _bindActions();
}


function _renderCurriculumMapSection() {
  const container = document.getElementById('dash-curriculum-map');
  if (!container) return;
  container.innerHTML = `<h3 class="dash-section-title">Learning Journey Map</h3><div id="dash-cm-inner"></div>`;
  const inner = document.getElementById('dash-cm-inner');
  if (inner) renderCurriculumMap(inner);
}

function _renderParentCoachingCard() {
  const container = document.getElementById('dash-coaching-card');
  if (!container) return;

  const card = getParentCoachingCard();

  const signalClass = {
    'on-track':       'coaching-card--green',
    'needs-practice': 'coaching-card--amber',
    'at-risk':        'coaching-card--red',
    'no-data':        'coaching-card--grey',
  }[card.overallSignal] || 'coaching-card--grey';

  // Advancement decision banner (only when there's a clear recommendation)
  const advHtml = card.advancementNote
    ? `<div class="coaching-advancement">${card.advancementNote}</div>`
    : '';

  // At-risk domain chips
  const atRiskHtml = card.domainsAtRisk.length
    ? `<div class="coaching-at-risk">
        <span class="coaching-at-risk-label">🔴 Needs attention:</span>
        ${card.domainsAtRisk.map(d => `<span class="coaching-domain-chip coaching-chip--red">${d.icon} ${d.label}</span>`).join('')}
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
  const xpStatHtml = card.weekXp > 0
    ? `<div class="coaching-stat">
        <span class="coaching-stat-value">+${card.weekXp}</span>
        <span class="coaching-stat-label">XP this week</span>
       </div>`
    : '';

  // Review note
  const reviewHtml = card.reviewsDue > 0
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

  const rowHtml = (rows) => rows.map(r => {
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
  }).join('');


  const priorityBlock = (title, rows) => `
    <div class="dash-pattern-item">
      <strong>${title}</strong>
      ${rows.map(r => `<div class="dash-category-row" title="${r.tooltip}">
        <div class="dash-category-head">
          <span><strong>${r.label}</strong> <small>(${r.loCode})</small></span>
          <span>${Math.round((r.accuracy || 0) * 100)}%</span>
        </div>
        <div class="dash-mini-track"><div class="dash-mini-fill" style="width:${Math.round((r.accuracy || 0) * 100)}%"></div></div>
        <div class="dash-category-meta">Priority score: ${r.priorityScore.toFixed(2)} · <a href="${r.syllabusLink}" target="_blank" rel="noreferrer">MOE syllabus</a></div>
      </div>`).join('')}
    </div>`;

  const scoreHtml = scoreboards.map(s => {
    const pct = Math.round((s.accuracy || 0) * 100);
    return `<div class="dash-scoreboard-chip"><strong>${s.quest}</strong><br>${s.correct}/${s.total} · ${pct}%</div>`;
  }).join('');

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
      ${lessonQueue.map(item => `<li class="dash-pattern-item"><strong>${item.quest}</strong> · ${item.label} <small>(${item.loCode})</small><br>${item.reason}</li>`).join('')}
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
      ${rows.map(r => `<li class="dash-pattern-item"><strong>${r.code}</strong> · ${r.focus}</li>`).join('')}
    </ul>`;
}

function _renderClassManagement() {
  const container = document.getElementById('dash-class-section');
  if (!container) return;
  const classes = getClasses();
  const profiles = getProfiles();
  const assignments = store.get('teacherAssignments') || {};
  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:24px">Teacher Class Management</h3>
    <ul class="dash-pattern-list">
      ${classes.map(c => `<li class="dash-pattern-item">🏫 ${c.name} · ${profiles.filter(p => p.classId === c.id).length} learner(s)</li>`).join('')}
    </ul>
    <div class="dash-actions">
      <input id="class-name-input" class="cp-name-input" placeholder="New class name" />
      <button class="btn btn--ghost" id="btn-add-class">Add Class</button>
    </div>
    <div class="dash-actions" style="margin-top:8px">
      <select id="assign-class" class="category-select">
        ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
      </select>
      <select id="assign-quest" class="category-select">
        <option value="sentence-forge">Sentence Forge</option>
        <option value="cloze-castle">Cloze Castle</option>
        <option value="word-vault">Word Vault</option>
        <option value="editing-quest">Editing Quest</option>
        <option value="writing-quest">Writing Quest</option>
      </select>
      <select id="assign-level" class="category-select">
        <option value="1">Level 1</option><option value="2">Level 2</option><option value="3">Level 3</option>
        <option value="4">Level 4</option><option value="5">Level 5</option><option value="6">Level 6</option>
      </select>
      <button class="btn btn--ghost" id="btn-save-assignment">Assign</button>
    </div>
    <p class="dash-pattern-item">📌 Current assignments: ${Object.keys(assignments).length ? Object.entries(assignments).map(([k,v]) => `${k}: ${v.quest} L${v.level}`).join(' | ') : 'none'}</p>`;

  document.getElementById('btn-add-class')?.addEventListener('click', () => {
    const input = /** @type {HTMLInputElement|null} */ (document.getElementById('class-name-input'));
    const name = input?.value?.trim();
    if (!name) return;
    const next = [...classes, { id: `class-${Date.now().toString(36)}`, name }];
    saveClasses(next);
    _renderClassManagement();
  });

  document.getElementById('btn-save-assignment')?.addEventListener('click', () => {
    const classId = /** @type {HTMLSelectElement|null} */ (document.getElementById('assign-class'))?.value;
    const quest = /** @type {HTMLSelectElement|null} */ (document.getElementById('assign-quest'))?.value;
    const level = /** @type {HTMLSelectElement|null} */ (document.getElementById('assign-level'))?.value;
    if (!classId || !quest || !level) return;
    const next = { ...(store.get('teacherAssignments') || {}) };
    next[classId] = { quest, level: Number(level), updatedAt: new Date().toISOString() };
    store.set('teacherAssignments', next);
    _renderClassManagement();
  });
}

// ── B1: Learner Summary ──────────────────────────────────────────────────────

function _renderLearnerSummary() {
  const container = document.getElementById('dash-learner-summary');
  if (!container) return;

  const s = getLearnerSummary();
  const accent = store.get('speechLocale') || 'en-SG';

  container.innerHTML = `
    <div class="dash-learner-summary">
      <div class="dash-learner-avatar">${s.profileAvatar}</div>
      <div class="dash-learner-info">
        <div class="dash-learner-name">${s.profileName}</div>
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
  const hasData = domains.some(d => d.score !== null);

  container.innerHTML = `
    <h3 class="dash-section-title" style="margin-top:24px">Literacy Domains</h3>
    ${!hasData ? '<p class="dash-no-data">Play more to see domain scores here.</p>' : ''}
    <div class="dash-domains-grid">
      ${domains.map(d => {
        const pct = d.score !== null ? Math.round(d.score * 100) : null;
        const barColor = pct === null ? '#e5e3fa' :
          pct >= 70 ? 'var(--color-success)' :
          pct >= 45 ? 'var(--color-warning)' : 'var(--color-error)';
        return `
          <div class="dash-domain-card">
            <span class="dash-domain-icon">${d.icon}</span>
            <span class="dash-domain-label">${d.label}</span>
            ${pct !== null ? `
              <div class="dash-domain-bar-track">
                <div class="dash-domain-bar-fill" style="width:${pct}%;background:${d.color}"></div>
              </div>
              <span class="dash-domain-pct" style="color:${barColor}">${pct}%</span>` :
              '<span class="dash-domain-pct" style="color:var(--text-muted)">No data yet</span>'}
          </div>`;
      }).join('')}
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

  const questRows = questInsights.map(qi => {
    const clueColor = qi.clueAccuracy >= 0.7 ? 'var(--color-success)' :
      qi.clueAccuracy >= 0.45 ? 'var(--color-warning)' : 'var(--color-error)';
    return `
      <div class="dash-clue-row">
        <div class="dash-clue-quest-label">${qi.icon} ${qi.quest}</div>
        <div class="dash-clue-metrics">
          <div class="dash-clue-metric">
            <span class="dash-clue-metric-label">Clue accuracy</span>
            <span class="dash-clue-metric-val" style="color:${clueColor}">${Math.round(qi.clueAccuracy * 100)}%</span>
            <span class="dash-clue-metric-sub">(${qi.clueAttempted} attempts)</span>
          </div>
          ${qi.answerAccuracy !== null ? `
            <div class="dash-clue-metric">
              <span class="dash-clue-metric-label">Answer accuracy</span>
              <span class="dash-clue-metric-val">${Math.round(qi.answerAccuracy * 100)}%</span>
            </div>` : ''}
        </div>
        ${qi.interpretation ? `<p class="dash-clue-interpretation">${qi.interpretation}</p>` : ''}
      </div>`;
  }).join('');

  const typeRows = byType.length > 0 ? `
    <h4 class="dash-clue-type-title">By Clue Type</h4>
    <div class="dash-clue-types">
      ${byType.slice(0, 5).map(t => {
        const pct = Math.round(t.accuracy * 100);
        const col = pct >= 70 ? 'var(--color-success)' : pct >= 45 ? 'var(--color-warning)' : 'var(--color-error)';
        return `
          <div class="dash-clue-type-row">
            <span class="dash-clue-type-label">${t.type}</span>
            <div class="dash-clue-type-bar-track">
              <div class="dash-clue-type-bar" style="width:${pct}%;background:${col}"></div>
            </div>
            <span class="dash-clue-type-pct" style="color:${col}">${pct}%</span>
          </div>`;
      }).join('')}
    </div>` : '';

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
      ${actions.map((a, i) => `
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
        </div>`).join('')}
    </div>`;

  // Wire CTAs if navigation callback is available
  container.querySelectorAll('.dash-rec-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      const group  = btn.dataset.group || null;
      _onNavigate?.({ target, group });
    });
  });
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
      ${insights.map(i => `<li class="dash-pattern-item">💬 ${i}</li>`).join('')}
    </ul>`;
}

// ── Existing chart/mastery/history sections ───────────────────────────────────

function _renderMasteryChart(stats) {
  const canvas = document.getElementById('chart-mastery');
  if (!canvas) return;

  if (accuracyChart) { accuracyChart.destroy(); accuracyChart = null; }

  const groups = GROUP_ORDER.filter(g => WORD_GROUPS[g]);
  const labels = groups.map(g => WORD_GROUPS[g].label);
  const data   = groups.map(g => Math.round((stats.groupMastery[g] ?? 0) * 100));
  const colors = groups.map(g => WORD_GROUPS[g].color);

  accuracyChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Mastery %',
        data,
        backgroundColor: colors.map(c => c + '80'),
        borderColor: colors,
        borderWidth: 2,
        borderRadius: 6,
        barPercentage: 0.7,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true, max: 100,
          ticks: { callback: v => v + '%', font: { size: 11 } },
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

  container.innerHTML = GROUP_ORDER.map(group => {
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

  const unlocked = getUnlockedStages(stats.groupMastery);

  container.innerHTML = CURRICULUM.map(stage => {
    const isUnlocked = unlocked.includes(stage.id);
    const stageGroups = stage.groups ?? (stage.group ? [stage.group] : []);
    const groupAccuracies = stageGroups.map(g => stats.groupMastery[g] ?? 0);
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

  const rows = stats.recentHistory.slice(0, 30).map(h => {
    const word = WORDS.find(w => w.id === h.wordId);
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

  tbody.innerHTML = rows.join('') || '<tr><td colspan="4" style="text-align:center;color:var(--text-muted)">No history yet</td></tr>';
}

function _renderBadges() {
  const container = document.getElementById('badge-grid');
  if (!container) return;

  const all = badges.getAll();
  container.setAttribute('aria-label', `${badges.earnedCount} of ${badges.totalCount} badges earned`);

  container.innerHTML = all.map(b => `
    <div class="badge-card ${b.earned ? 'badge-card--earned' : 'badge-card--locked'}"
         title="${b.desc}"
         aria-label="${b.name}${b.earned ? ' — earned' : ' — locked'}">
      <span class="badge-emoji">${b.earned ? b.emoji : '🔒'}</span>
      <span class="badge-name">${b.name}</span>
    </div>`).join('');
}

function _bindActions() {
  document.getElementById('btn-export-csv')?.addEventListener('click', () => {
    const csv  = progress.exportCSV();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'phonicsquest-progress.csv'; a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('btn-export-csv-anon')?.addEventListener('click', () => {
    const csv = progress.exportCSV().split('\n').map((line, idx) => {
      if (idx === 0 || !line.trim()) return line;
      const [word, ...rest] = line.split(',');
      const masked = `${word.slice(0, 1)}***`;
      return [masked, ...rest].join(',');
    }).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'phonicsquest-progress-anonymised.csv'; a.click();
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
    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dash-import-drop--active'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dash-import-drop--active'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dash-import-drop--active');
      const file = e.dataTransfer?.files?.[0];
      if (file) _handleCSVImport(file);
    });
  }

  // Adaptive controls
  const adaptiveWeak = /** @type {HTMLInputElement|null} */ (document.getElementById('adaptive-weak-weight'));
  const adaptiveUnseen = /** @type {HTMLInputElement|null} */ (document.getElementById('adaptive-unseen-weight'));
  const cfg = store.get('adaptiveConfig') || {};
  if (adaptiveWeak) {
    adaptiveWeak.value = String(cfg.weakWeight ?? 5);
    adaptiveWeak.addEventListener('input', () => {
      store.set('adaptiveConfig', { ...(store.get('adaptiveConfig') || {}), weakWeight: Number(adaptiveWeak.value) });
    });
  }
  if (adaptiveUnseen) {
    adaptiveUnseen.value = String(cfg.unseenWeight ?? 3);
    adaptiveUnseen.addEventListener('input', () => {
      store.set('adaptiveConfig', { ...(store.get('adaptiveConfig') || {}), unseenWeight: Number(adaptiveUnseen.value) });
    });
  }
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

const VOWELS     = new Set(['a', 'e', 'i', 'o', 'u']);
const CONSONANTS = new Set('bcdfghjklmnpqrstvwxyz'.split(''));

function _autoDetectPhonemes(word) {
  const lower = word.toLowerCase();
  const graphemes = lower.split('');
  const types = graphemes.map(ch => {
    if (VOWELS.has(ch)) return 'sv';
    if (CONSONANTS.has(ch)) return 'c';
    return 'c';
  });
  return { graphemes, types };
}

function _detectGroup(word) {
  const vowel = word.toLowerCase().split('').find(ch => VOWELS.has(ch));
  return vowel ? `short-${vowel}` : 'short-a';
}

function _detectPattern(graphemes, types) {
  const consonantBefore = [], consonantAfter = [];
  let foundVowel = false;
  for (const t of types) {
    if (t === 'sv' || t === 'lv') { foundVowel = true; continue; }
    if (!foundVowel) consonantBefore.push(t);
    else consonantAfter.push(t);
  }
  const c1 = consonantBefore.length, c2 = consonantAfter.length;
  if (c1 <= 1 && c2 <= 1) return 'CVC';
  if (c1 >= 2 && c2 <= 1) return 'blend';
  if (c1 <= 1 && c2 >= 2) return 'CVCC';
  return 'CCVCC';
}

async function _handleCSVImport(file) {
  const preview = document.getElementById('csv-import-preview');
  const status  = document.getElementById('csv-import-status');
  if (!preview || !status) return;

  const text  = await file.text();
  const lines = text.trim().split('\n').filter(l => l.trim());

  if (!lines.length) {
    status.hidden = false;
    status.textContent = 'File is empty.';
    status.className = 'dash-import-status dash-import-status--error';
    return;
  }

  const firstLine = lines[0].trim();
  const isFullCSV = firstLine.includes(',');
  let words = [];
  const existingIds = new Set(WORDS.map(w => w.id));

  if (isFullCSV) {
    const header  = firstLine.toLowerCase().split(',').map(h => h.trim());
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
      const cols = lines[i].split(',').map(c => c.trim());
      const w = cols[wordIdx];
      if (!w || existingIds.has(w.toLowerCase())) continue;

      const graphemes = graphIdx >= 0 && cols[graphIdx]
        ? cols[graphIdx].split(/[|;]/)
        : _autoDetectPhonemes(w).graphemes;
      const types = typesIdx >= 0 && cols[typesIdx]
        ? cols[typesIdx].split(/[|;]/)
        : _autoDetectPhonemes(w).types;

      words.push({
        id: w.toLowerCase(), word: w.toLowerCase(), graphemes, types,
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
        id: w, word: w, graphemes, types,
        pattern: _detectPattern(graphemes, types),
        group: _detectGroup(w), level: 1, emoji: '',
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
    <div class="dash-import-word-list">${words.slice(0, 20).map(w =>
      `<span class="dash-import-word">${w.emoji ? w.emoji + ' ' : ''}${w.word} <small>(${w.group})</small></span>`
    ).join('')}${words.length > 20 ? `<span class="dash-import-word">…and ${words.length - 20} more</span>` : ''}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${words.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>`;

  document.getElementById('csv-cancel-import')?.addEventListener('click', () => {
    preview.hidden = true; status.hidden = true;
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
  if (accuracyChart) { accuracyChart.destroy(); accuracyChart = null; }
}
