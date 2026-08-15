/**
 * Exam Practice Hub (formerly Paper Mode)
 *
 * The public hub launches the complete P1–P6 term-paper banks in two modes:
 *   - Practice Mode: teaching scaffolds + per-section feedback, no timer
 *   - Test Mode: timer, no scaffolds or inline feedback
 *
 * Each level lists its complete term papers; opening one hands off to
 * `primaryPracticeTest.js`, which renders and marks the paper itself.
 *
 * This file used to carry a second, unreachable path as well: a section
 * "playlist" that launched other quest modes one at a time and then asked the
 * child to TYPE their own marks into a form — "Marks scored: [__] / Total
 * marks: [__]" — and stored whatever they typed as their paper score. Nothing
 * called it (`_renderPlaylist` had no callers), so no child ever saw it, but
 * it was ~250 lines of self-reported exam results waiting to be re-enabled.
 * Deleted, along with the `paperSession` state it persisted.
 */

import { PAPER_LEVELS, PAPER_TIMING } from '../data/paperPlaylists.js';
import { store } from '../modules/store.js';
import { P1_PRACTICE_TESTS, P1_PRACTICE_TEST_TERMS } from '../data/p1PracticeTests.js';
import { P2_PRACTICE_TESTS, P2_PRACTICE_TEST_TERMS } from '../data/p2PracticeTests.js';
import { P3_PRACTICE_TESTS, P3_PRACTICE_TEST_TERMS } from '../data/p3PracticeTests.js';
import { P4_PRACTICE_TESTS, P4_PRACTICE_TEST_TERMS } from '../data/p4PracticeTests.js';
import { P5_PRACTICE_TESTS, P5_PRACTICE_TEST_TERMS } from '../data/p5PracticeTests.js';
import { P6_PRACTICE_TESTS, P6_PRACTICE_TEST_TERMS } from '../data/p6PracticeTests.js';
import { mountPracticeTest } from './primaryPracticeTest.js';

let _container = null;
let _launchSection = null;
let _onGoHome = null;
let _selectedLevel = null;
let _cleanupRunner = null;

const MODE_META = {
  practice: { icon: '🎯', label: 'Practice Mode', desc: 'Hints + per-section feedback. No timer.' },
  test: { icon: '⏱️', label: 'Test Mode', desc: 'Timed. No hints. Mirrors the real paper.' },
  review: {
    icon: '🔄',
    label: 'Review Mistakes',
    desc: 'Replay only the questions you got wrong last time.',
  },
};

const PRACTICE_PAPERS_BY_LEVEL = Object.freeze({
  P1: P1_PRACTICE_TEST_TERMS.map((term) => P1_PRACTICE_TESTS[term]).filter(Boolean),
  P2: P2_PRACTICE_TEST_TERMS.map((term) => P2_PRACTICE_TESTS[term]).filter(Boolean),
  P3: P3_PRACTICE_TEST_TERMS.map((term) => P3_PRACTICE_TESTS[term]).filter(Boolean),
  P4: P4_PRACTICE_TEST_TERMS.map((term) => P4_PRACTICE_TESTS[term]).filter(Boolean),
  P5: P5_PRACTICE_TEST_TERMS.map((term) => P5_PRACTICE_TESTS[term]).filter(Boolean),
  P6: P6_PRACTICE_TEST_TERMS.map((term) => P6_PRACTICE_TESTS[term]).filter(Boolean),
});

export function initPaperMode(container, { onLaunchSection, onGoHome }) {
  _container = container;
  _launchSection = onLaunchSection;
  _onGoHome = onGoHome;
}

export function cleanupPaperMode() {
  _cleanupRunner?.();
  _cleanupRunner = null;
  if (_container) _container.innerHTML = '';
}

export function showPaperModeBrowser() {
  if (!_container) return;
  _cleanupRunner?.();
  _cleanupRunner = null;
  _container.innerHTML = `
    <div class="sfq-browser exam-hub" role="region" aria-label="Exam Practice Hub level selection">
      <h2 class="sfq-title">📋 Exam Practice Hub</h2>
      <p class="sfq-instruction">Take a complete term paper interactively. Answers are scored section by section and the summary points you to the skills that need more practice.</p>

      <div class="exam-hub-modes" role="radiogroup" aria-label="Choose practice mode">
        ${Object.entries(MODE_META)
          .filter(([key]) => key !== 'review')
          .map(
            ([key, m]) => `
          <button class="exam-hub-mode-btn" data-paper-mode="${key}" aria-label="${m.label}: ${m.desc}">
            <span class="exam-hub-mode-icon" aria-hidden="true">${m.icon}</span>
            <span class="exam-hub-mode-name">${m.label}</span>
            <span class="exam-hub-mode-desc">${m.desc}</span>
          </button>`,
          )
          .join('')}
      </div>

      <div class="exam-hub-selected-mode" id="exam-hub-selected-mode" aria-live="polite"></div>

      <div class="sfq-browser-grid" role="group" aria-label="Level buttons">
        ${PAPER_LEVELS.map(
          (l) => `<button class="sfq-level-btn" data-level="${l}" aria-label="Open ${l} paper">
          <strong>${l}</strong>
          <span style="display:block;font-size:0.7em;opacity:0.8">${PAPER_TIMING[l]}</span>
        </button>`,
        ).join('')}
      </div>

      <div class="sfq-actions"><button class="btn btn--ghost" id="paper-home">← Home</button></div>
      <div id="paper-playlist"></div>
    </div>`;

  let selectedMode = store.get('paperMode') || 'practice';
  if (!['practice', 'test'].includes(selectedMode)) selectedMode = 'practice';
  const updateModeUi = () => {
    _container.querySelectorAll('[data-paper-mode]').forEach((btn) => {
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
    if (_selectedLevel) _renderInteractivePapers(_selectedLevel, selectedMode);
  };
  updateModeUi();

  _container.querySelectorAll('[data-paper-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedMode = btn.dataset.paperMode;
      updateModeUi();
    });
  });

  _container.querySelectorAll('[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => {
      _selectedLevel = btn.dataset.level;
      _renderInteractivePapers(_selectedLevel, selectedMode);
    });
  });
  _container.querySelector('#paper-home')?.addEventListener('click', () => _onGoHome?.());
}

function _renderInteractivePapers(level, paperMode = 'practice') {
  const holder = _container?.querySelector('#paper-playlist');
  if (!holder) return;
  const papers = PRACTICE_PAPERS_BY_LEVEL[level] || [];
  const modeMeta = MODE_META[paperMode] || MODE_META.practice;
  const paperCards = papers
    .map(
      (paper, index) => `
    <article class="ptg-launcher-card" data-paper-id="${paper.id}">
      <h4>${paper.label}</h4>
      <p><small>${paper.duration} · ${paper.totalMarks} marks · ${Object.keys(paper).filter((key) => /^section[A-I]$/.test(key)).length} sections</small></p>
      <p>${paper.blurb || ''}</p>
      <button class="btn btn--primary" ${index === 0 ? 'id="paper-start-all"' : ''} data-start-paper="${paper.id}" type="button">
        ${paperMode === 'test' ? '⏱ Start timed paper' : '🎯 Start practice paper'}
      </button>
    </article>`,
    )
    .join('');

  holder.innerHTML = `
    <div class="dash-pattern-item exam-hub-playlist" style="margin-top:12px">
      <h3>${level} Papers · ${modeMeta.icon} ${modeMeta.label}</h3>
      <p class="sfq-instruction">${papers.length} complete paper${papers.length === 1 ? '' : 's'} available. ${
        paperMode === 'test'
          ? 'The timer starts when you open a paper; learning scaffolds are hidden.'
          : 'Check each section as you go and use the targeted practice links in your feedback.'
      }</p>
      <div class="ptg-launcher-grid">${paperCards || '<p>No papers are available for this level yet.</p>'}</div>
    </div>`;

  holder.querySelectorAll('[data-start-paper]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const paper = papers.find((candidate) => candidate.id === btn.dataset.startPaper);
      if (!paper || !_container) return;
      store.set('paperMode', paperMode);
      _cleanupRunner = mountPracticeTest(_container, paper, {
        mode: paperMode,
        onClose: () => {
          _cleanupRunner = null;
          showPaperModeBrowser();
        },
        onPractiseSkill: (target) => _launchSection?.(target, level),
      });
    });
  });
}
