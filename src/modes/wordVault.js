/**
 * PhonicsQuest – Word Vault Quest 🔑
 *
 * Vocabulary cloze passages across 7 categories × 6 levels (p1–p6).
 * Same tap-to-fill mechanics as Cloze Castle but with a two-step browser:
 *   1. Choose category
 *   2. Choose level
 *   3. Play passage
 *
 * Clue Mode (Part A, D)
 * ─────────────────────
 * When a passage has a `clues` array, a clue-hunt step precedes the word bank
 * for each blank that has clue data.  Backward compatible: passages without
 * `clues` behave exactly as before.
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
import {
  evaluateClueSelection,
  renderClueHuntPassage,
  getClueHint,
  clueResultFeedback,
  clueResultToScore,
} from './clueEngine.js';
import { celebrateCorrect } from '../components/confettiHelper.js';
import { mascot } from '../components/mascot.js';

// ── Module state ───────────────────────────────────────────────────────────

let _container     = null;
let _onGoHome      = null;

let _currentCat    = null;   // category key
let _currentLevel  = 'p1';   // 'p1' … 'p6'
let _bankWords     = [];     // [{id, word, used}]
let _blankFills    = [];     // null | bankWordId per blank
let _passage       = null;   // current passage object
let _sessionCorrect = 0;
let _sessionTotal   = 0;
let _keyHandler     = null;

// ── Clue-mode state ────────────────────────────────────────────────────────

let _activeBlankIndex = -1;
let _clueResults      = {};
let _hintLevel        = 0;
let _bankLocked       = false;
let _weakAttempts     = 0;
let _sessionClueScore = 0;

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
  if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
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
    const totalPossible = 6;
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

  _sessionCorrect   = 0;
  _sessionTotal     = 0;
  _sessionClueScore = 0;

  _passage = passageList[Math.floor(Math.random() * passageList.length)];
  _initPassage(_passage);
}

function _initPassage(passage) {
  const round  = createClozeRound(passage);
  _bankWords   = round.bankWords;
  _blankFills  = round.blankFills;

  // Reset clue state
  _clueResults      = {};
  _hintLevel        = 0;
  _weakAttempts     = 0;

  if (passage.clues && passage.clues.length > 0) {
    _activeBlankIndex = passage.clues[0].blankIndex;
    _bankLocked       = true;
  } else {
    _activeBlankIndex = -1;
    _bankLocked       = false;
  }

  _renderPassage(passage);
}

// ── Passage render ─────────────────────────────────────────────────────────

function _renderPassage(passage) {
  if (!_container) return;

  const meta      = VOCAB_CATEGORIES[_currentCat];
  const lv        = _currentLevel;
  const inClueMode = passage.clues && passage.clues.length > 0 && _bankLocked;

  _container.innerHTML = `
    <div class="wv-game">
      <div class="wv-game-header">
        <button class="btn btn--ghost btn--sm" id="wv-back-levels">← Levels</button>
        <span class="wv-game-badge" style="color:${meta.color}">${meta.icon} ${meta.label}</span>
        <span class="wv-game-level">${LEVEL_ICONS[lv]} ${LEVEL_LABELS[lv]}</span>
      </div>

      <h3 class="wv-passage-title">${passage.title}</h3>

      ${inClueMode ? _buildClueHuntPanel(passage) : ''}

      <p class="wv-instruction" id="wv-instruction">
        ${inClueMode ? '🔍 Tap the context clue in the passage first!' : '🔑 Tap a word to fill the next blank!'}
      </p>

      <div class="wv-passage-text" id="wv-passage-text" aria-live="polite"></div>

      <div class="wv-bank-wrapper ${inClueMode ? 'wv-bank-wrapper--locked' : ''}" id="wv-bank-wrapper">
        ${inClueMode ? '<div class="wv-bank-lock-msg">🔒 Find the context clue first!</div>' : ''}
        <div class="wv-bank" id="wv-bank" aria-label="Word choices"></div>
      </div>

      <div class="wv-actions">
        <button class="btn btn--ghost btn--sm" id="wv-clear">↺ Clear all</button>
        <button class="btn btn--ghost btn--sm" id="wv-listen" aria-label="Listen to passage">🔊 Listen</button>
        <button class="btn btn--primary" id="wv-check" ${inClueMode ? 'disabled' : ''}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="wv-quit">Menu</button>
      </div>

      <div class="wv-feedback" id="wv-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`;

  _renderText(passage);
  _renderBank(passage);

  if (inClueMode) _attachClueHuntListeners(passage);

  document.getElementById('wv-back-levels')?.addEventListener('click', () => _renderLevelBrowser(_currentCat));
  document.getElementById('wv-clear')?.addEventListener('click', () => {
    clearClozeRound(_bankWords, _blankFills);
    _renderText(passage);
    _renderBank(passage);
  });
  document.getElementById('wv-listen')?.addEventListener('click', () => {
    let readable = passage.text;
    for (const ans of passage.answers) readable = readable.replace('___', ans);
    audio.speakWord(readable);
  });
  document.getElementById('wv-check')?.addEventListener('click', () => _checkPassage(passage));
  document.getElementById('wv-quit')?.addEventListener('click', () => { cleanupWordVault(); _onGoHome?.(); });

  if (_keyHandler) document.removeEventListener('keydown', _keyHandler);
  _keyHandler = (e) => {
    if (e.key === 'Enter' && !_bankLocked) { e.preventDefault(); document.getElementById('wv-check')?.click(); }
    if (e.key === 'Escape') { cleanupWordVault(); _onGoHome?.(); }
  };
  document.addEventListener('keydown', _keyHandler);
}

// ── Clue Hunt Panel HTML ───────────────────────────────────────────────────

function _buildClueHuntPanel(passage) {
  const clueData = _getActiveClueData(passage);
  if (!clueData) return '';

  return `
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Context Clue</span>
        <span class="clue-hunt-sub">Blank ${_activeBlankIndex + 1}</span>
      </div>
      <p class="clue-hunt-prompt">${clueData.prompt}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        <button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`;
}

// ── Clue Hunt Listeners ────────────────────────────────────────────────────

function _attachClueHuntListeners(passage) {
  document.getElementById('clue-hint-btn')?.addEventListener('click', () => {
    const clueData = _getActiveClueData(passage);
    if (!clueData) return;
    _hintLevel = Math.min(_hintLevel + 1, 4);
    const { message } = getClueHint(_hintLevel, clueData);
    const hintMsg = document.getElementById('clue-hint-msg');
    if (hintMsg) {
      hintMsg.textContent = message;
      hintMsg.className = 'clue-hint-msg clue-hint-msg--visible';
    }
    if (_hintLevel >= 4) _unlockBankAfterClue(passage, null);
  });
}

// ── Clue Hunt — word tap ───────────────────────────────────────────────────

function _handleClueWordTap(tappedWord, passage) {
  const clueData = _getActiveClueData(passage);
  if (!clueData) return;

  const result   = evaluateClueSelection(tappedWord, clueData);
  const feedback = clueResultFeedback(result);

  const fbEl = document.getElementById('clue-hunt-feedback');
  if (fbEl) {
    fbEl.textContent = feedback.message;
    fbEl.className   = `clue-hunt-feedback ${feedback.cssClass}`;
  }

  // Re-render passage with highlighted selection
  const passageEl = document.getElementById('wv-passage-text');
  if (passageEl) {
    renderClueHuntPassage({
      container:        passageEl,
      text:             passage.text,
      activeBlankIndex: _activeBlankIndex,
      selectedWord:     tappedWord,
      selectedResult:   result,
      filledAnswers:    _blankFills.map(id =>
        id !== null ? _bankWords.find(w => w.id === id)?.word || '' : ''
      ),
      onTapWord: (word) => _handleClueWordTap(word, passage),
    });
  }

  store.recordClueAttempt({
    quest: 'wordVault',
    result,
    clueType: clueData.clueType,
  });

  if (result === 'strong' || result === 'partial') {
    _clueResults[_activeBlankIndex] = result;
    audio.playSfx(result === 'strong' ? 'correct' : 'pop');
    setTimeout(() => _unlockBankAfterClue(passage, result), 800);
  } else {
    _weakAttempts++;
    audio.playSfx('wrong');
    if (_weakAttempts >= 2) {
      _clueResults[_activeBlankIndex] = 'weak';
      setTimeout(() => _unlockBankAfterClue(passage, 'weak'), 1000);
    }
  }
}

function _unlockBankAfterClue(passage, result) {
  if (!_bankLocked) return;

  _bankLocked = false;
  _sessionClueScore += clueResultToScore(result);

  const instr = document.getElementById('wv-instruction');
  if (instr) instr.textContent = '🔑 Now tap a word to fill the blank!';

  const wrapper = document.getElementById('wv-bank-wrapper');
  if (wrapper) wrapper.className = 'wv-bank-wrapper';

  const checkBtn = document.getElementById('wv-check');
  if (checkBtn) checkBtn.disabled = false;

  _renderBank(passage);
}

// ── Passage text + bank rendering ─────────────────────────────────────────

function _renderText(passage) {
  const container = document.getElementById('wv-passage-text');
  if (!container) return;

  if (_bankLocked) {
    const filled = _blankFills.map(id =>
      id !== null ? _bankWords.find(w => w.id === id)?.word || '' : ''
    );
    renderClueHuntPassage({
      container,
      text:             passage.text,
      activeBlankIndex: _activeBlankIndex,
      filledAnswers:    filled,
      onTapWord:        (word) => _handleClueWordTap(word, passage),
    });
  } else {
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
}

function _renderBank(passage) {
  const bank = document.getElementById('wv-bank');
  if (!bank) return;

  if (_bankLocked) {
    bank.innerHTML = _bankWords.map(w => `
      <button class="wv-word-chip wv-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${w.word}">${w.word}</button>
    `).join('');
    return;
  }

  renderClozeBank({
    container: bank,
    bankWords: _bankWords,
    chipClass: 'wv-word-chip',
    usedClass: 'wv-word-chip--used',
    onChooseWord: (id) => {
      if (!fillNextBlank(_bankWords, _blankFills, id)) return;
      audio.playSfx('pop');

      const filledCount = _blankFills.filter(f => f !== null).length;
      const nextClue = _getClueDataForBlank(passage, filledCount);

      if (nextClue && !_clueResults.hasOwnProperty(filledCount)) {
        _activeBlankIndex = nextClue.blankIndex;
        _bankLocked       = true;
        _hintLevel        = 0;
        _weakAttempts     = 0;
        _renderPassage(passage);
      } else {
        _renderText(passage);
        _renderBank(passage);
      }
    },
  });
}

// ── Clue data helpers ──────────────────────────────────────────────────────

function _getActiveClueData(passage) {
  if (!passage.clues) return null;
  return passage.clues.find(c => c.blankIndex === _activeBlankIndex) || null;
}

function _getClueDataForBlank(passage, blankIndex) {
  if (!passage.clues) return null;
  return passage.clues.find(c => c.blankIndex === blankIndex) || null;
}

// ── Checking ───────────────────────────────────────────────────────────────

function _checkPassage(passage) {
  if (_blankFills.some(f => f === null)) {
    _showFeedback('Fill all the blanks first! 🔑', false);
    return;
  }

  const userAnswers = buildUserAnswers(_blankFills, _bankWords);
  const allCorrect  = userAnswers.every((ans, i) => ans === passage.answers[i]);

  _sessionTotal++;

  if (allCorrect) {
    _sessionCorrect++;
    gamification.recordCorrect(2000, false);
    celebrateCorrect();
    audio.playSfx('correct');
    mascot.celebrate(false);

    const completed = store.get('wvqCompleted') || {};
    if (!completed[_currentCat]) completed[_currentCat] = {};
    completed[_currentCat][_currentLevel] = true;
    store.set('wvqCompleted', completed);

    questMastery.recordAttempt({
      quest: 'wordVault',
      skill: _currentCat,
      correct: true,
      responseMs: 2000,
      level: _currentLevel,
    });
    questMastery.updateSkill('wordVault', _currentCat, true);

    document.querySelectorAll('.wv-blank--filled').forEach(b => b.classList.add('wv-blank--correct'));

    if (passage.clues && passage.clues.length > 0) {
      _showClueExplanation(passage, () => setTimeout(() => _showComplete(), 600));
    } else {
      _showFeedback('✅ Brilliant! All correct!', true);
      setTimeout(() => _showComplete(), 1800);
    }
  } else {
    audio.playSfx('wrong');
    questMastery.recordAttempt({
      quest: 'wordVault',
      skill: _currentCat,
      correct: false,
      responseMs: 2000,
      level: _currentLevel,
    });
    questMastery.updateSkill('wordVault', _currentCat, false);
    document.querySelectorAll('.wv-blank--filled').forEach((b, i) => {
      const ans = _bankWords.find(w => w.id === _blankFills[i])?.word || '';
      b.classList.toggle('wv-blank--wrong', ans !== passage.answers[i]);
    });
    mascot.encourage();
    _showFeedback('❌ Some blanks are wrong – check and try again!', false);
    setTimeout(() => {
      document.querySelectorAll('.wv-blank--wrong').forEach(b => b.classList.remove('wv-blank--wrong'));
      const fb = document.getElementById('wv-feedback');
      if (fb) fb.hidden = true;
    }, 1800);
  }
}

// ── Post-answer Clue Explanation ───────────────────────────────────────────

function _showClueExplanation(passage, onContinue) {
  if (!_container) return;

  const primaryClue  = passage.clues[0];
  const clueSpan     = (primaryClue.acceptableSpans || [])[0] || '';
  const playerResult = _clueResults[primaryClue.blankIndex] || 'weak';
  const { cssClass } = clueResultFeedback(playerResult);

  const existing = document.getElementById('wv-explanation-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id        = 'wv-explanation-overlay';
  overlay.className = 'clue-explanation-overlay';
  overlay.innerHTML = `
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Brilliant! All correct!</p>
      <div class="clue-explanation-body">
        <p class="clue-explanation-label">Context clue:</p>
        <span class="clue-result-badge ${cssClass}">${clueSpan || 'No clue selected'}</span>
        <p class="clue-explanation-text">${primaryClue.explanation}</p>
      </div>
      <button class="btn btn--primary" id="wv-explanation-next">Continue →</button>
    </div>`;

  _container.querySelector('.wv-game')?.appendChild(overlay);
  audio.playSfx('correct');

  document.getElementById('wv-explanation-next')?.addEventListener('click', () => {
    overlay.remove();
    onContinue();
  });

  setTimeout(() => {
    if (document.getElementById('wv-explanation-overlay')) {
      overlay.remove();
      onContinue();
    }
  }, 4000);
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
  mascot.celebrate(true);

  const acc   = _sessionTotal > 0 ? Math.round((_sessionCorrect / _sessionTotal) * 100) : 100;
  const stars = acc >= 90 ? 3 : acc >= 70 ? 2 : 1;

  const clueTotal = Object.keys(_clueResults).length;
  const clueAcc   = clueTotal > 0
    ? Math.round((_sessionClueScore / clueTotal) * 100)
    : null;
  const clueAccLine = clueAcc !== null
    ? `<p class="wv-complete-clue">🔍 Clue accuracy: ${clueAcc}%</p>`
    : '';

  _container.innerHTML = `
    <div class="wv-complete">
      <div class="wv-complete-icon">${meta.icon}</div>
      <h3 class="wv-complete-title">Vault Opened! 🔑</h3>
      <p class="wv-complete-sub">${meta.label} · ${LEVEL_LABELS[_currentLevel]}</p>
      <div class="wv-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="wv-complete-score">${_sessionCorrect} / ${_sessionTotal} correct · ${acc}%</p>
      ${clueAccLine}
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

  if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
  setTimeout(() => (document.getElementById('wv-next-level') || document.getElementById('wv-replay'))?.focus(), 200);
}
