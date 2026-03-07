/**
 * PhonicsQuest – Word Vault Quest 🔑
 *
 * Vocabulary cloze passages across 7 categories × 6 levels (p1–p6).
 * Same tap-to-fill mechanics as Cloze Castle but with a two-step browser:
 *   1. Choose category
 *   2. Choose level
 *   3. Play passage
 *
 * Public API:
 *   initWordVault(container, onGoHome)  – attach to DOM container
 *   showVaultBrowser()                  – render category picker
 *   cleanupWordVault()                  – teardown
 */

import { vocabPassages, VOCAB_CATEGORIES } from '../data/vocabPassages.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { gamification } from '../modules/gamification.js';
import { questMastery } from '../modules/questMastery.js';
import {
  buildUserAnswers,
  clearClozeRound,
  createClozeRound,
  fillNextBlank,
  renderClozeBank,
  renderClozePassage,
} from './clozeEngine.js';
import { celebrateCorrect } from '../components/confettiHelper.js';

// ── Module state ───────────────────────────────────────────────────────────

let _container     = null;
let _onGoHome      = null;

let _currentCat    = null;   // category key
let _currentLevel  = 'p1';   // 'p1' … 'p6'
let _bankWords     = [];     // [{id, word, used}]
let _blankFills    = [];     // null | bankWordId per blank
let _passage       = null;   // current passage object

const LEVEL_LABELS = { p1: 'P1', p2: 'P2', p3: 'P3', p4: 'P4', p5: 'P5', p6: 'P6' };
const LEVEL_ICONS  = { p1: '🌱', p2: '🌿', p3: '🌳', p4: '🔥', p5: '💎', p6: '👑' };

// ── Public API ─────────────────────────────────────────────────────────────

export function initWordVault(container, onGoHome) {
  _container = container;
  _onGoHome  = onGoHome;
}

export function showVaultBrowser() {
  _renderCategoryBrowser();
}

export function cleanupWordVault() {
  if (_container) _container.innerHTML = '';
  _bankWords  = [];
  _blankFills = [];
  _passage    = null;
}

// ── Category browser ───────────────────────────────────────────────────────

function _renderCategoryBrowser() {
  if (!_container) return;

  const completed = store.get('wvqCompleted') || {};

  let html = '<div class="wv-browser">';
  html += '<div class="wv-cat-grid">';

  const keys = Object.keys(VOCAB_CATEGORIES);
  const recommendedCat = questMastery.getRecommendedSkill('wordVault', keys);

  for (const [key, meta] of Object.entries(VOCAB_CATEGORIES)) {
    const catCompleted = completed[key] || {};
    const totalPossible = 6; // one per level
    const doneLevels = Object.keys(catCompleted).length;
    const isRecommended = key === recommendedCat;

    html += `
      <button class="wv-cat-btn ${isRecommended ? 'wv-cat-btn--recommended' : ''}" data-cat="${key}"
              style="--cat-color:${meta.color}"
              aria-label="${meta.label}${isRecommended ? ' (recommended)' : ''}">
        <span class="wv-cat-icon">${meta.icon}</span>
        <span class="wv-cat-label">${meta.label}</span>
        <span class="wv-cat-desc">${meta.desc}</span>
        <span class="wv-cat-progress">${doneLevels} / ${totalPossible}${isRecommended ? ' · Recommended' : ''}</span>
      </button>`;
  }

  html += '</div></div>';
  _container.innerHTML = html;

  _container.querySelectorAll('.wv-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentCat = btn.dataset.cat;
      _renderLevelBrowser(_currentCat);
    });
  });
}

// ── Level browser (within a category) ─────────────────────────────────────

function _renderLevelBrowser(catKey) {
  if (!_container) return;

  const meta      = VOCAB_CATEGORIES[catKey];
  const catData   = vocabPassages[catKey] || {};
  const completed = (store.get('wvqCompleted') || {})[catKey] || {};
  const levels    = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];

  let html = `
    <div class="wv-level-browser">
      <div class="wv-level-header">
        <button class="btn btn--ghost btn--sm" id="wv-back-cats">← Categories</button>
        <span class="wv-level-title" style="color:${meta.color}">${meta.icon} ${meta.label}</span>
      </div>
      <p class="wv-level-desc">${meta.desc}</p>
      <div class="wv-level-grid">`;

  for (const lv of levels) {
    const passages = catData[lv];
    const hasPassage = passages && passages.length > 0;
    const isDone = !!completed[lv];

    html += `
      <button class="wv-level-btn ${isDone ? 'wv-level-btn--done' : ''} ${!hasPassage ? 'wv-level-btn--locked' : ''}"
              data-level="${lv}"
              ${!hasPassage ? 'disabled aria-disabled="true"' : ''}
              style="--cat-color:${meta.color}"
              aria-label="${LEVEL_LABELS[lv]}${isDone ? ' – completed' : ''}">
        <span class="wv-level-icon">${isDone ? '⭐' : LEVEL_ICONS[lv]}</span>
        <span class="wv-level-name">${LEVEL_LABELS[lv]}</span>
      </button>`;
  }

  html += '</div></div>';
  _container.innerHTML = html;

  document.getElementById('wv-back-cats')?.addEventListener('click', () => _renderCategoryBrowser());

  _container.querySelectorAll('.wv-level-btn:not([disabled])').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentLevel = btn.dataset.level;
      _startPassage(catKey, _currentLevel);
    });
  });
}

// ── Passage flow ───────────────────────────────────────────────────────────

function _startPassage(catKey, level) {
  const passageList = (vocabPassages[catKey] || {})[level] || [];
  if (!passageList.length) return;

  // Pick random passage from the list
  _passage = passageList[Math.floor(Math.random() * passageList.length)];
  _initPassage(_passage);
}

function _initPassage(passage) {
  const round = createClozeRound(passage);
  _bankWords = round.bankWords;
  _blankFills = round.blankFills;

  _renderPassage(passage);
}

// ── Passage render ─────────────────────────────────────────────────────────

function _renderPassage(passage) {
  if (!_container) return;

  const meta = VOCAB_CATEGORIES[_currentCat];
  const lv   = _currentLevel;

  _container.innerHTML = `
    <div class="wv-game">
      <div class="wv-game-header">
        <button class="btn btn--ghost btn--sm" id="wv-back-levels">← Levels</button>
        <span class="wv-game-badge" style="color:${meta.color}">${meta.icon} ${meta.label}</span>
        <span class="wv-game-level">${LEVEL_ICONS[lv]} ${LEVEL_LABELS[lv]}</span>
      </div>

      <h3 class="wv-passage-title">${passage.title}</h3>
      <p class="wv-instruction">🔑 Tap a word to fill the next blank!</p>

      <div class="wv-passage-text" id="wv-passage-text" aria-live="polite"></div>

      <div class="wv-bank" id="wv-bank" aria-label="Word choices"></div>

      <div class="wv-actions">
        <button class="btn btn--ghost btn--sm" id="wv-clear">↺ Clear all</button>
        <button class="btn btn--primary" id="wv-check">Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="wv-quit">Menu</button>
      </div>

      <div class="wv-feedback" id="wv-feedback" hidden></div>
    </div>`;

  _renderText(passage);
  _renderBank(passage);

  document.getElementById('wv-back-levels')?.addEventListener('click', () => _renderLevelBrowser(_currentCat));
  document.getElementById('wv-clear')?.addEventListener('click', () => {
    clearClozeRound(_bankWords, _blankFills);
    _renderText(passage);
    _renderBank(passage);
  });
  document.getElementById('wv-check')?.addEventListener('click', () => _checkPassage(passage));
  document.getElementById('wv-quit')?.addEventListener('click', () => { cleanupWordVault(); _onGoHome?.(); });
}

function _renderText(passage) {
  const container = document.getElementById('wv-passage-text');
  if (!container) return;

  renderClozePassage({
    container,
    text: passage.text,
    blankFills: _blankFills,
    bankWords: _bankWords,
    blankClass: 'wv-blank',
    filledClass: 'wv-blank--filled',
    emptyBlankAria: (i) => `Blank ${i + 1}`,
    removeBlankAria: (word) => `Remove ${word}`,
    onRemoveWord: () => {
      _renderText(passage);
      _renderBank(passage);
    },
  });
}

function _renderBank(passage) {
  const bank = document.getElementById('wv-bank');
  if (!bank) return;

  renderClozeBank({
    container: bank,
    bankWords: _bankWords,
    chipClass: 'wv-word-chip',
    usedClass: 'wv-word-chip--used',
    onChooseWord: (id) => {
      if (!fillNextBlank(_bankWords, _blankFills, id)) return;
      audio.playSfx('pop');
      _renderText(passage);
      _renderBank(passage);
    },
  });
}

// ── Checking ───────────────────────────────────────────────────────────────

function _checkPassage(passage) {
  if (_blankFills.some(f => f === null)) {
    _showFeedback('Fill all the blanks first! 🔑', false);
    return;
  }

  const userAnswers = buildUserAnswers(_blankFills, _bankWords);
  const allCorrect  = userAnswers.every((ans, i) => ans === passage.answers[i]);

  questMastery.recordAttempt({
    quest: 'wordVault',
    skill: _currentCat || 'mixed',
    correct: allCorrect,
    responseMs: 2000,
    level: _currentLevel,
  });
  questMastery.updateSkill('wordVault', _currentCat || 'mixed', allCorrect);

  if (allCorrect) {
    gamification.recordCorrect(2000, false);
    celebrateCorrect();
    audio.playSfx('correct');

    // Save completion
    const completed = store.get('wvqCompleted') || {};
    if (!completed[_currentCat]) completed[_currentCat] = {};
    completed[_currentCat][_currentLevel] = true;
    store.set('wvqCompleted', completed);

    document.querySelectorAll('.wv-blank--filled').forEach(b => b.classList.add('wv-blank--correct'));
    _showFeedback('✅ Brilliant! All correct!', true);

    setTimeout(() => _showComplete(), 1800);
  } else {
    audio.playSfx('wrong');
    document.querySelectorAll('.wv-blank--filled').forEach((b, i) => {
      const ans = _bankWords.find(w => w.id === _blankFills[i])?.word || '';
      b.classList.toggle('wv-blank--wrong', ans !== passage.answers[i]);
    });
    _showFeedback('❌ Some blanks are wrong – check and try again!', false);
    setTimeout(() => {
      document.querySelectorAll('.wv-blank--wrong').forEach(b => b.classList.remove('wv-blank--wrong'));
      const fb = document.getElementById('wv-feedback');
      if (fb) fb.hidden = true;
    }, 1800);
  }
}

function _showFeedback(msg, success) {
  const el = document.getElementById('wv-feedback');
  if (!el) return;
  el.textContent = msg;
  el.className = `wv-feedback wv-feedback--${success ? 'success' : 'error'}`;
  el.hidden = false;
  if (success) setTimeout(() => { el.hidden = true; }, 1600);
}

// ── Complete screen ────────────────────────────────────────────────────────

function _showComplete() {
  if (!_container) return;

  const meta  = VOCAB_CATEGORIES[_currentCat];
  const levels = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'];
  const nextLv = levels[levels.indexOf(_currentLevel) + 1] || null;

  celebrateCorrect();
  audio.playSfx('levelUp');

  _container.innerHTML = `
    <div class="wv-complete">
      <div class="wv-complete-icon">${meta.icon}</div>
      <h3 class="wv-complete-title">Vault Opened! 🔑</h3>
      <p class="wv-complete-sub">${meta.label} · ${LEVEL_LABELS[_currentLevel]}</p>
      <div class="wv-stars">⭐⭐⭐</div>
      <div class="wv-complete-actions">
        ${nextLv
          ? `<button class="btn btn--primary btn--lg" id="wv-next-level">${LEVEL_LABELS[nextLv]} →</button>`
          : ''}
        <button class="btn btn--ghost btn--sm" id="wv-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="wv-back-lvls">All Levels</button>
        <button class="btn btn--ghost btn--sm" id="wv-back-cats2">Categories</button>
      </div>
    </div>`;

  document.getElementById('wv-next-level')?.addEventListener('click', () => {
    _currentLevel = nextLv;
    _startPassage(_currentCat, _currentLevel);
  });
  document.getElementById('wv-replay')?.addEventListener('click', () => _startPassage(_currentCat, _currentLevel));
  document.getElementById('wv-back-lvls')?.addEventListener('click', () => _renderLevelBrowser(_currentCat));
  document.getElementById('wv-back-cats2')?.addEventListener('click', () => _renderCategoryBrowser());
}
