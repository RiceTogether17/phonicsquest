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

  // Import CSV toggle
  document.getElementById('btn-import-csv')?.addEventListener('click', () => {
    const panel = document.getElementById('csv-import-panel');
    if (panel) panel.hidden = !panel.hidden;
  });

  // CSV file browse
  document.getElementById('csv-browse-btn')?.addEventListener('click', () => {
    document.getElementById('csv-file-input')?.click();
  });

  // CSV file input
  document.getElementById('csv-file-input')?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (file) _handleCSVImport(file);
  });

  // Drag & drop
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

// ── CSV Import ──────────────────────────────────────────────────────────────

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);
const CONSONANTS = new Set('bcdfghjklmnpqrstvwxyz'.split(''));

/**
 * Auto-detect graphemes and types for a simple CVC-style word.
 * Returns null if the word is too complex to auto-detect.
 */
function _autoDetectPhonemes(word) {
  const lower = word.toLowerCase();
  const graphemes = lower.split('');
  const types = graphemes.map(ch => {
    if (VOWELS.has(ch)) return 'sv';
    if (CONSONANTS.has(ch)) return 'c';
    return 'c'; // fallback
  });
  return { graphemes, types };
}

function _detectGroup(word) {
  const vowel = word.toLowerCase().split('').find(ch => VOWELS.has(ch));
  if (!vowel) return 'short-a';
  return `short-${vowel}`;
}

function _detectPattern(graphemes, types) {
  const consonantBefore = [];
  const consonantAfter = [];
  let foundVowel = false;
  for (const t of types) {
    if (t === 'sv' || t === 'lv') { foundVowel = true; continue; }
    if (!foundVowel) consonantBefore.push(t);
    else consonantAfter.push(t);
  }
  const c1 = consonantBefore.length;
  const c2 = consonantAfter.length;
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
  const lines = text.trim().split('\n').filter(l => l.trim());

  if (lines.length === 0) {
    status.hidden = false;
    status.textContent = 'File is empty.';
    status.className = 'dash-import-status dash-import-status--error';
    return;
  }

  // Detect format: full CSV (has commas in first line) or simple word list
  const firstLine = lines[0].trim();
  const isFullCSV = firstLine.includes(',');

  let words = [];
  const existingIds = new Set(WORDS.map(w => w.id));

  if (isFullCSV) {
    // Parse header
    const header = firstLine.toLowerCase().split(',').map(h => h.trim());
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
    // Simple word list: one word per line
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

  if (words.length === 0) {
    status.hidden = false;
    status.textContent = 'No new words found (all may already exist).';
    status.className = 'dash-import-status dash-import-status--error';
    return;
  }

  // Show preview
  preview.hidden = false;
  preview.innerHTML = `
    <p><strong>${words.length} new word${words.length > 1 ? 's' : ''}</strong> ready to import:</p>
    <div class="dash-import-word-list">${words.slice(0, 20).map(w =>
      `<span class="dash-import-word">${w.emoji ? w.emoji + ' ' : ''}${w.word} <small>(${w.group})</small></span>`
    ).join('')}${words.length > 20 ? `<span class="dash-import-word">…and ${words.length - 20} more</span>` : ''}</div>
    <button class="btn btn--primary btn--sm" id="csv-confirm-import">Import ${words.length} Words</button>
    <button class="btn btn--ghost btn--sm" id="csv-cancel-import">Cancel</button>
  `;

  document.getElementById('csv-cancel-import')?.addEventListener('click', () => {
    preview.hidden = true;
    status.hidden = true;
  });

  document.getElementById('csv-confirm-import')?.addEventListener('click', () => {
    // Add to the WORDS array in memory
    WORDS.push(...words);
    // Also persist to store so they survive refresh
    const existing = store.get('customWords') || [];
    store.set('customWords', [...existing, ...words]);

    preview.hidden = true;
    status.hidden = false;
    status.textContent = `Imported ${words.length} word${words.length > 1 ? 's' : ''} successfully!`;
    status.className = 'dash-import-status dash-import-status--success';
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
