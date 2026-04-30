/**
 * Exam Practice Hub (formerly Paper Mode)
 *
 * Three modes:
 *   - Practice Mode: hints + per-section feedback, no timer
 *   - Test Mode: timer, no hints (sets paperMode flag for downstream modes)
 *   - Review Mistakes Mode: rerun the last session's wrong items only
 *
 * After every section the learner sees: score, weak skill tags, wrong answers,
 * recommended follow-up module. After the final section a full-paper summary
 * shows totals, weak-skill heatmap and follow-up suggestions per section.
 */

import {
  PAPER_LEVELS,
  PAPER_MODE_PLAYLISTS,
  PAPER_SECTION_LABELS,
  PAPER_SECTION_MARKS,
  PAPER_BOOKLET_SPLIT,
  PAPER_TIMING,
  PAPER_ITEM_COUNTS,
} from '../data/paperPlaylists.js';
import { store } from '../modules/store.js';
import { getWeakSkills } from '../modules/remediationRouter.js';

let _container = null;
let _launchSection = null;
let _onGoHome = null;
let _activeSession = null;

const MODE_META = {
  practice: { icon: '🎯', label: 'Practice Mode', desc: 'Hints + per-section feedback. No timer.' },
  test:     { icon: '⏱️', label: 'Test Mode',     desc: 'Timed. No hints. Mirrors the real paper.' },
  review:   { icon: '🔄', label: 'Review Mistakes', desc: 'Replay only the questions you got wrong last time.' },
};

const FOLLOW_UP_BY_SECTION = {
  'grammar-mcq':                'grammar-mcq',
  'cloze-castle':               'cloze-castle',
  'vocab-mcq':                  'vocab-mcq',
  'word-vault':                 'word-vault',
  'editing-quest':              'editing-quest',
  'sentence-forge-word-order':  'sentence-forge',
  'sentence-forge-combining':   'sentence-forge',
  'sentence-forge-synthesis':   'sentence-forge',
};

const FOLLOW_UP_LABEL = {
  'grammar-mcq':    '🧠 Grammar MCQ',
  'cloze-castle':   '🏰 Cloze Castle',
  'vocab-mcq':      '📖 Vocabulary MCQ',
  'word-vault':     '🔑 Word Vault',
  'editing-quest':  '✏️ Editing Quest',
  'sentence-forge': '🔨 Sentence Forge',
};

function _persistSession() {
  store.set('paperSession', _activeSession);
}

export function initPaperMode(container, { onLaunchSection, onGoHome }) {
  _container = container;
  _launchSection = onLaunchSection;
  _onGoHome = onGoHome;
  _activeSession = store.get('paperSession') || null;
}

export function cleanupPaperMode() {
  if (_container) _container.innerHTML = '';
}

/**
 * Build the per-paper exam summary (used in tests & UI).
 * Returns { totalScored, totalTotal, accuracy, weakSections, recommendations }
 */
export function buildPaperSummary(session) {
  const marks = Array.isArray(session?.marks) ? session.marks : [];
  const totalScored = marks.reduce((s, m) => s + (Number(m.scored) || 0), 0);
  const totalTotal  = marks.reduce((s, m) => s + (Number(m.total) || 0), 0);
  const accuracy    = totalTotal > 0 ? Math.round((totalScored / totalTotal) * 100) : 0;

  const weakSections = marks
    .map(m => ({
      key: m.key,
      label: PAPER_SECTION_LABELS[m.key] || m.key,
      scored: Number(m.scored) || 0,
      total: Number(m.total) || 0,
      accuracy: m.total ? Math.round((m.scored / m.total) * 100) : 0,
    }))
    .filter(s => s.total > 0 && s.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy);

  const recommendations = weakSections.slice(0, 3).map(ws => ({
    section: ws.key,
    sectionLabel: ws.label,
    target: FOLLOW_UP_BY_SECTION[ws.key] || ws.key,
    targetLabel: FOLLOW_UP_LABEL[FOLLOW_UP_BY_SECTION[ws.key]] || ws.label,
    reason: `Score ${ws.scored}/${ws.total} (${ws.accuracy}%) — practise this module next.`,
  }));

  return { totalScored, totalTotal, accuracy, weakSections, recommendations };
}

export function showPaperModeBrowser() {
  if (!_container) return;
  _container.innerHTML = `
    <div class="sfq-browser exam-hub" role="region" aria-label="Exam Practice Hub level selection">
      <h2 class="sfq-title">📋 Exam Practice Hub</h2>
      <p class="sfq-instruction">PSLE English-style paper practice. Pick your level, then choose a mode.</p>

      <div class="exam-hub-modes" role="radiogroup" aria-label="Choose practice mode">
        ${Object.entries(MODE_META).map(([key, m]) => `
          <button class="exam-hub-mode-btn" data-paper-mode="${key}" aria-label="${m.label}: ${m.desc}">
            <span class="exam-hub-mode-icon" aria-hidden="true">${m.icon}</span>
            <span class="exam-hub-mode-name">${m.label}</span>
            <span class="exam-hub-mode-desc">${m.desc}</span>
          </button>`).join('')}
      </div>

      <div class="exam-hub-selected-mode" id="exam-hub-selected-mode" aria-live="polite"></div>

      <div class="sfq-browser-grid" role="group" aria-label="Level buttons">
        ${PAPER_LEVELS.map(l => `<button class="sfq-level-btn" data-level="${l}" aria-label="Open ${l} paper">
          <strong>${l}</strong>
          <span style="display:block;font-size:0.7em;opacity:0.8">${PAPER_TIMING[l]}</span>
        </button>`).join('')}
      </div>

      <div class="sfq-actions"><button class="btn btn--ghost" id="paper-home">← Home</button></div>
      <div id="paper-playlist"></div>
    </div>`;

  let selectedMode = store.get('paperMode') || 'practice';
  const updateModeUi = () => {
    _container.querySelectorAll('[data-paper-mode]').forEach(btn => {
      const isActive = btn.dataset.paperMode === selectedMode;
      btn.classList.toggle('exam-hub-mode-btn--active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
    const banner = _container.querySelector('#exam-hub-selected-mode');
    const meta = MODE_META[selectedMode];
    if (banner && meta) {
      banner.textContent = `${meta.icon} ${meta.label} selected — ${meta.desc}`;
    }
    store.set('paperMode', selectedMode);
  };
  updateModeUi();

  _container.querySelectorAll('[data-paper-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedMode = btn.dataset.paperMode;
      updateModeUi();
    });
  });

  _container.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => _renderPlaylist(btn.dataset.level, selectedMode));
  });
  _container.querySelector('#paper-home')?.addEventListener('click', () => _onGoHome?.());
}

function _renderPlaylist(level, paperMode = 'practice') {
  const sections = PAPER_MODE_PLAYLISTS[level] || [];
  const holder = _container?.querySelector('#paper-playlist');
  if (!holder) return;
  const canResume = _activeSession && _activeSession.level === level && !_activeSession.complete;
  const marks = PAPER_SECTION_MARKS[level] || {};
  const itemCounts = PAPER_ITEM_COUNTS[level] || {};
  const totalMarks = sections.reduce((sum, s) => sum + (marks[s] || 0), 0);
  const booklet = PAPER_BOOKLET_SPLIT[level];
  const timing = PAPER_TIMING[level] || '';
  const modeMeta = MODE_META[paperMode] || MODE_META.practice;

  const weakSkills = getWeakSkills().slice(0, 3);
  const weakPanel = weakSkills.length ? `
    <div class="paper-weak-panel" role="note" aria-label="Weak skills to focus on">
      <p class="paper-weak-title">📊 Focus areas this paper:</p>
      <div class="paper-weak-chips">
        ${weakSkills.map(ws => `<span class="paper-weak-chip">${ws.label} <span class="paper-weak-score">${Math.round(ws.score * 100)}%</span></span>`).join('')}
      </div>
    </div>` : '';

  const sectionStatus = (key) => {
    const mark = (_activeSession?.marks || []).find(m => m.key === key);
    if (mark) return `<span class="paper-section-status paper-section-status--done" aria-label="Section completed">✓ ${mark.scored}/${mark.total}</span>`;
    return '<span class="paper-section-status paper-section-status--pending" aria-label="Not started">○</span>';
  };

  const sectionHtml = (s, i) => {
    const m = marks[s] || '–';
    const cap = itemCounts[s];
    const capLabel = cap ? ` · ${cap}q` : '';
    return `<li>
      <button class="btn btn--ghost paper-section-btn" data-section="${s}" aria-label="Section ${i + 1}: ${PAPER_SECTION_LABELS[s] || s}, ${m} marks${capLabel}">
        <span class="paper-section-no">${i + 1}.</span>
        <span class="paper-section-label">${PAPER_SECTION_LABELS[s] || s}</span>
        <span class="paper-section-meta" style="opacity:0.7">[${m} marks${capLabel}]</span>
        ${sectionStatus(s)}
      </button>
    </li>`;
  };

  let listHtml;
  if (booklet) {
    const aIdx = [];
    const bIdx = [];
    sections.forEach((s, i) => {
      if (booklet.bookletA.includes(s)) aIdx.push(i);
      else bIdx.push(i);
    });
    listHtml = `
      <p style="font-weight:600;margin:8px 0 2px">Booklet A</p>
      <ol>${aIdx.map(i => sectionHtml(sections[i], i)).join('')}</ol>
      <p style="font-weight:600;margin:8px 0 2px">Booklet B</p>
      <ol start="${aIdx.length + 1}">${bIdx.map(i => sectionHtml(sections[i], i)).join('')}</ol>`;
  } else {
    listHtml = `<ol>${sections.map((s, i) => sectionHtml(s, i)).join('')}</ol>`;
  }

  const reviewAvailable = _activeSession && _activeSession.level === level && _activeSession.complete && _activeSession.marks?.some(m => (m.total || 0) - (m.scored || 0) > 0);

  holder.innerHTML = `
    <div class="dash-pattern-item exam-hub-playlist" style="margin-top:12px">
      <h3>${level} Paper · ${modeMeta.icon} ${modeMeta.label}</h3>
      <p class="sfq-instruction" style="margin:4px 0 8px">Total: ${totalMarks} marks · Suggested time: ${timing} · ${sections.length} sections</p>
      ${weakPanel}
      ${listHtml}
      <div class="sfq-actions" style="margin-top:8px">
        <button class="btn btn--primary" id="paper-start-all">${paperMode === 'review' ? '🔄 Start Review Mistakes' : '▶ Start Full Paper'}</button>
        ${canResume ? '<button class="btn btn--ghost" id="paper-resume">Resume Session</button>' : ''}
        ${reviewAvailable ? '<button class="btn btn--ghost" id="paper-review-mistakes">🔄 Review last paper mistakes</button>' : ''}
      </div>
      <div id="paper-session-card"></div>
    </div>`;

  holder.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.set('paperMode', paperMode);
      _launchSection?.(btn.dataset.section, level);
    });
  });
  holder.querySelector('#paper-start-all')?.addEventListener('click', () => _startFullPaper(level, sections, paperMode));
  holder.querySelector('#paper-resume')?.addEventListener('click', () => _renderSessionCard());
  holder.querySelector('#paper-review-mistakes')?.addEventListener('click', () => _startFullPaper(level, sections, 'review'));
  if (canResume) _renderSessionCard();
}

function _startFullPaper(level, sections, paperMode = 'practice') {
  _activeSession = {
    level,
    sections,
    index: 0,
    startedAt: Date.now(),
    marks: [],
    complete: false,
    paperMode,
  };
  store.set('paperMode', paperMode);
  _persistSession();
  _renderSessionCard();
}

function _renderSessionCard() {
  const card = _container?.querySelector('#paper-session-card');
  if (!card || !_activeSession) return;

  const current = _activeSession.sections[_activeSession.index];
  const elapsedMins = Math.max(1, Math.round((Date.now() - _activeSession.startedAt) / 60000));
  const score = _activeSession.marks.reduce((acc, m) => {
    acc.scored += m.scored;
    acc.total += m.total;
    return acc;
  }, { scored: 0, total: 0 });

  if (_activeSession.complete || !current) {
    card.innerHTML = _buildPaperSummaryHtml(_activeSession, elapsedMins);
    card.querySelector('#paper-summary-restart')?.addEventListener('click', () => {
      _activeSession = null;
      _persistSession();
      _onGoHome?.();
    });
    card.querySelectorAll('[data-followup-target]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.followupTarget;
        if (target) _launchSection?.(target, _activeSession?.level);
      });
    });
    return;
  }

  const modeMeta = MODE_META[_activeSession.paperMode || 'practice'];

  card.innerHTML = `
    <div class="dash-pattern-item exam-hub-session" style="margin-top:10px" role="region" aria-label="Active paper session">
      <h4>🧾 ${_activeSession.level} Paper · ${modeMeta.icon} ${modeMeta.label}</h4>
      <p class="sfq-instruction">Section ${_activeSession.index + 1}/${_activeSession.sections.length}: ${PAPER_SECTION_LABELS[current] || current}</p>
      <p class="sfq-instruction">Elapsed: ~${elapsedMins} min · Running score: ${score.scored}/${score.total || 0}</p>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="paper-launch-current">Launch Current Section</button>
        <button class="btn btn--ghost" id="paper-mark-done">Mark Section Done</button>
      </div>
      <div id="paper-mark-form" hidden>
        <div class="dash-pattern-item" style="margin-top:8px; display:flex; flex-direction:column; gap:8px;">
          <label for="paper-scored-input">Marks scored:</label>
          <input id="paper-scored-input" class="cp-name-input" type="number" min="0" value="0" aria-label="Marks scored" />
          <label for="paper-total-input">Total marks:</label>
          <input id="paper-total-input" class="cp-name-input" type="number" min="0" value="${(PAPER_SECTION_MARKS[_activeSession.level] || {})[current] || 5}" aria-label="Total marks" />
          <div class="sfq-actions" style="margin-top:4px">
            <button class="btn btn--primary btn--sm" id="paper-confirm-mark">Confirm</button>
            <button class="btn btn--ghost btn--sm" id="paper-cancel-mark">Cancel</button>
          </div>
        </div>
      </div>
    </div>`;

  card.querySelector('#paper-launch-current')?.addEventListener('click', () => {
    if (!_activeSession || _activeSession.complete) return;
    const cap = (PAPER_ITEM_COUNTS[_activeSession.level] || {})[current];
    if (cap) store.set('paperItemLimit', cap);
    store.set('paperMode', _activeSession.paperMode || 'practice');
    _launchSection?.(current, _activeSession.level);
  });

  card.querySelector('#paper-mark-done')?.addEventListener('click', () => {
    const form = card.querySelector('#paper-mark-form');
    if (form) form.hidden = false;
  });

  card.querySelector('#paper-cancel-mark')?.addEventListener('click', () => {
    const form = card.querySelector('#paper-mark-form');
    if (form) form.hidden = true;
  });

  card.querySelector('#paper-confirm-mark')?.addEventListener('click', () => {
    const scoredInput = /** @type {HTMLInputElement} */ (card.querySelector('#paper-scored-input'));
    const totalInput = /** @type {HTMLInputElement} */ (card.querySelector('#paper-total-input'));
    const scored = Math.max(0, Number.parseInt(scoredInput?.value || '0', 10) || 0);
    const total = Math.max(scored, Number.parseInt(totalInput?.value || '0', 10) || 0);
    _activeSession.marks.push({
      key: current,
      scored,
      total,
      finishedAt: Date.now(),
      sectionLabel: PAPER_SECTION_LABELS[current] || current,
    });
    _activeSession.index += 1;
    if (_activeSession.index === _activeSession.sections.length) {
      _activeSession.complete = true;
      _activeSession.completedAt = Date.now();
    }
    _persistSession();
    _renderSectionFeedback(current, scored, total);
  });
}

function _renderSectionFeedback(sectionKey, scored, total) {
  const card = _container?.querySelector('#paper-session-card');
  if (!card) return;
  const accuracy = total > 0 ? Math.round((scored / total) * 100) : 0;
  const sectionLabel = PAPER_SECTION_LABELS[sectionKey] || sectionKey;
  const followUpKey = FOLLOW_UP_BY_SECTION[sectionKey];
  const followUpLabel = FOLLOW_UP_LABEL[followUpKey] || sectionLabel;
  const weakSkills = getWeakSkills().slice(0, 3);

  const verdict = accuracy >= 80 ? 'Strong section — ready to move on.'
                : accuracy >= 60 ? 'Solid effort — practise this module to push higher.'
                : 'This section needs revision. Use the recommended module before retrying.';

  card.innerHTML = `
    <div class="dash-pattern-item exam-hub-section-feedback" role="region" aria-label="Section feedback">
      <h4>📊 Section complete · ${sectionLabel}</h4>
      <p class="sfq-instruction"><strong>Score:</strong> ${scored}/${total} (${accuracy}%)</p>
      <p class="sfq-instruction">${verdict}</p>
      ${weakSkills.length ? `
        <p class="sfq-instruction"><strong>Weak skill tags:</strong></p>
        <div class="paper-weak-chips">
          ${weakSkills.map(ws => `<span class="paper-weak-chip">${ws.label} <span class="paper-weak-score">${Math.round(ws.score * 100)}%</span></span>`).join('')}
        </div>` : ''}
      <p class="sfq-instruction"><strong>Recommended follow-up:</strong> ${followUpLabel}</p>
      <div class="sfq-actions" style="margin-top:8px">
        <button class="btn btn--primary" data-followup-target="${followUpKey || sectionKey}">Practise ${followUpLabel}</button>
        <button class="btn btn--ghost" id="paper-continue">Continue paper →</button>
      </div>
    </div>`;

  card.querySelector('#paper-continue')?.addEventListener('click', () => _renderSessionCard());
  card.querySelectorAll('[data-followup-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.followupTarget;
      if (target) _launchSection?.(target, _activeSession?.level);
    });
  });
}

function _buildPaperSummaryHtml(session, elapsedMins) {
  const summary = buildPaperSummary(session);
  const modeMeta = MODE_META[session.paperMode || 'practice'];
  const sectionRows = (session.marks || []).map((m, i) => {
    const acc = m.total ? Math.round((m.scored / m.total) * 100) : 0;
    const tag = acc >= 80 ? '✅' : acc >= 60 ? '🟡' : '🔴';
    return `<li>${tag} Section ${i + 1}: ${PAPER_SECTION_LABELS[m.key] || m.key} — ${m.scored}/${m.total} (${acc}%)</li>`;
  }).join('');

  const recHtml = summary.recommendations.length
    ? `<div class="exam-hub-followups">
        <p class="sfq-instruction"><strong>Suggested follow-up modules:</strong></p>
        <ul class="dash-pattern-list">
          ${summary.recommendations.map(r => `
            <li class="dash-pattern-item">
              <strong>${r.sectionLabel}</strong> — ${r.reason}
              <div class="sfq-actions" style="margin-top:6px">
                <button class="btn btn--primary btn--sm" data-followup-target="${r.target}">Open ${r.targetLabel}</button>
              </div>
            </li>`).join('')}
        </ul>
       </div>`
    : '<p class="sfq-instruction">🎉 Strong paper! No section dropped below 70%.</p>';

  return `
    <div class="dash-pattern-item exam-hub-summary" role="region" aria-label="Paper results summary">
      <h4>✅ ${session.level} Paper Complete · ${modeMeta.icon} ${modeMeta.label}</h4>
      <p class="sfq-instruction">Elapsed: ~${elapsedMins} min · Total score: ${summary.totalScored}/${summary.totalTotal} (${summary.accuracy}%)</p>
      <ol>${sectionRows}</ol>
      ${recHtml}
      <div class="sfq-actions" style="margin-top:8px">
        <button class="btn btn--ghost" id="paper-summary-restart">Back to Hub</button>
      </div>
    </div>`;
}
