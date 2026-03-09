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
import { WORD_GROUPS, GROUP_ORDER, WORDS } from '../data/words.js';
import { CURRICULUM, getUnlockedStages } from '../data/curriculum.js';
import {
  getLearnerSummary,
  getLiteracyDomains,
  getClueInsights,
  getRecommendedActions,
  getRecentPatternInsights,
} from '../modules/dashboardInsights.js';

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
      <button class="btn btn--ghost" id="btn-import-csv">Import Words (CSV)</button>
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
  _renderLearnerSummary();
  _renderRecommendedActions();
  _renderLiteracyDomains();
  _renderClueInsights();
  _renderPatternInsights();

  // Render existing sections
  _renderMasteryChart(stats);
  _renderMasteryBars(stats);
  _renderLearningPath(stats);
  _renderWordHistory(stats);
  _renderBadges();
  _bindActions();
}

// ── B1: Learner Summary ──────────────────────────────────────────────────────

function _renderLearnerSummary() {
  const container = document.getElementById('dash-learner-summary');
  if (!container) return;

  const s = getLearnerSummary();

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
