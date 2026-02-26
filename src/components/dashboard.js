/**
 * PhonicsQuest – Parent Dashboard
 *
 * Renders progress charts (Chart.js), mastery bars, word history,
 * and export functionality inside the dashboard modal.
 */

import { Chart, registerables } from 'chart.js';
import { progress } from '../modules/progress.js';
import { store } from '../modules/store.js';
import { badges } from '../modules/badges.js';
import { WORD_GROUPS, GROUP_ORDER, WORDS } from '../data/words.js';
import { CURRICULUM, getUnlockedStages } from '../data/curriculum.js';

Chart.register(...registerables);

/** @type {Chart|null} */
let accuracyChart = null;

/**
 * Render the full dashboard content.
 * @param {HTMLElement} container  #dashboard-content
 */
export function renderDashboard(container) {
  const stats = progress.getOverallStats();

  container.innerHTML = `
    <!-- Summary Stats -->
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

    <!-- Accuracy Chart -->
    <h3 class="dash-section-title">Group Mastery</h3>
    <div class="dash-chart-wrap">
      <canvas id="chart-mastery" aria-label="Group mastery chart"></canvas>
    </div>

    <!-- Mastery Bars -->
    <div class="mastery-bar-list" id="mastery-bars"></div>

    <!-- Learning Path -->
    <h3 class="dash-section-title" style="margin-top:24px">Learning Path</h3>
    <div id="learning-path"></div>

    <!-- Recent Words -->
    <h3 class="dash-section-title" style="margin-top:24px">Recent Words</h3>
    <div style="overflow-x:auto;">
      <table class="word-history-table">
        <thead><tr><th>Word</th><th>Mode</th><th>Result</th><th>When</th></tr></thead>
        <tbody id="word-history-body"></tbody>
      </table>
    </div>

    <!-- Badges -->
    <h3 class="dash-section-title" style="margin-top:24px">Achievements</h3>
    <div id="badge-grid" class="badge-grid"></div>

    <!-- Actions -->
    <div class="dash-actions">
      <button class="btn btn--ghost" id="btn-export-csv">Export CSV</button>
      <button class="btn btn--ghost" id="btn-add-words">Custom Words</button>
    </div>
  `;

  _renderMasteryChart(stats);
  _renderMasteryBars(stats);
  _renderLearningPath(stats);
  _renderWordHistory(stats);
  _renderBadges();
  _bindActions();
}

function _renderMasteryChart(stats) {
  const canvas = document.getElementById('chart-mastery');
  if (!canvas) return;

  // Destroy previous chart
  if (accuracyChart) {
    accuracyChart.destroy();
    accuracyChart = null;
  }

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
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
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
      </div>
    `;
  }).join('');
}

function _renderLearningPath(stats) {
  const container = document.getElementById('learning-path');
  if (!container) return;

  const unlocked = getUnlockedStages(stats.groupMastery);

  container.innerHTML = CURRICULUM.map(stage => {
    const isUnlocked = unlocked.includes(stage.id);
    const groupAccuracies = stage.groups.map(g => stats.groupMastery[g] ?? 0);
    const avgAccuracy = groupAccuracies.length
      ? Math.round((groupAccuracies.reduce((a, b) => a + b, 0) / groupAccuracies.length) * 100)
      : 0;

    return `
      <div class="mastery-bar-item" style="opacity:${isUnlocked ? 1 : 0.4}">
        <span class="mastery-bar-label">${stage.icon} ${stage.name}</span>
        <div class="mastery-bar-track">
          <div class="mastery-bar-fill" style="width:${avgAccuracy}%"></div>
        </div>
        <span class="mastery-bar-pct">${isUnlocked ? avgAccuracy + '%' : '🔒'}</span>
      </div>
    `;
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
  const earnedCount = badges.earnedCount;
  const totalCount  = badges.totalCount;

  container.setAttribute('aria-label', `${earnedCount} of ${totalCount} badges earned`);

  container.innerHTML = all.map(b => `
    <div class="badge-card ${b.earned ? 'badge-card--earned' : 'badge-card--locked'}"
         title="${b.desc}"
         aria-label="${b.name}${b.earned ? ' — earned' : ' — locked'}">
      <span class="badge-emoji">${b.earned ? b.emoji : '🔒'}</span>
      <span class="badge-name">${b.name}</span>
    </div>
  `).join('');
}

function _bindActions() {
  // Export CSV
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

  // Custom words — placeholder for now
  document.getElementById('btn-add-words')?.addEventListener('click', () => {
    alert('Custom words feature coming soon! You can add words via the browser console:\n\nstore.set("customWords", [...])');
  });
}

/** Human-readable time difference */
function _timeAgo(timestamp) {
  if (!timestamp) return '';
  const diff = Date.now() - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Destroy the chart cleanly (call when modal closes) */
export function destroyDashboard() {
  if (accuracyChart) {
    accuracyChart.destroy();
    accuracyChart = null;
  }
}
