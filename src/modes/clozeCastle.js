/**
 * PhonicsQuest – Cloze Castle Quest 🏰
 *
 * Grammar cloze passages (P1–P6) organised by grammar category.
 * Flow: Level picker → Category picker → Passages
 *
 * Clue Mode (Part A–C)
 * ─────────────────────
 * When a passage has a `clues` array, each blank gets a clue-hunt step BEFORE
 * the word bank is available.  Backwards compatible: passages without `clues`
 * fall through to the classic tap-to-fill flow unchanged.
 *
 * Public API:
 *   initClozeCastle(container, onGoHome)  – attach to DOM container
 *   showClozeBrowser()                    – render level picker
 *   cleanupClozeCastle()                  – teardown
 */

import { passages, CLOZE_LEVEL_LABELS, CLOZE_LEVEL_ICONS, GRAMMAR_CATEGORIES } from '../data/passages.js';
import { getGrammarTip } from '../data/grammarTips.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { gamification } from '../modules/gamification.js';
import { questMastery } from '../modules/questMastery.js';
import { progress } from '../modules/progress.js';
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
import { escapeAttr, escapeHtml } from '../utils/escapeHtml.js';
import { getUniqueClozeDone, recordClozeCompletion } from './clozeCompletionTracker.js';
import { showAnswerReviewPanel } from './clozeReviewPanel.js';
import { buildCopySummaryText, getModeConfig, getNextStepRecommendation, getSummaryScoreLine } from './clozeSessionSummary.js';
import { incrementHintUsage } from './hintUsage.js';

// ── Module state ───────────────────────────────────────────────────────────

let _container = null;
let _onGoHome  = null;

let _currentLevel   = 'P1';
let _currentCat     = '';
let _passageIdx     = 0;
let _levelPassages  = [];
let _bankWords      = [];   // [{id, word, used}]
let _blankFills     = [];   // null | bankWordId per blank
let _sessionCorrect   = 0;
let _sessionTotal     = 0;
let _passageWrongCount = 0; // wrong attempts on current passage (for teach-back)
let _keyHandler       = null;

// ── Clue-mode state ────────────────────────────────────────────────────────
// activeBlankIndex: which blank is in the clue-hunt phase right now (-1 = all done)
// clueResults: { [blankIndex]: 'strong'|'partial'|'weak' } for scoring
// hintLevel: 0–4 hint ladder position for current blank
// bankLocked: true while waiting for a clue selection
// weakAttempts: number of 'weak' selections in the current blank's clue hunt

let _activeBlankIndex = -1;
let _clueResults      = {};
let _hintLevel        = 0;
let _bankLocked       = false;
let _weakAttempts     = 0;
let _sessionClueScore = 0;   // accumulated clue points this session
let _sessionMode      = 'practice';
let _sessionHintsUsed = 0;
let _examStartedAt    = 0;
let _lastUserAnswers  = [];
let _sessionReviewRows = [];
let _sessionBlankTotal = 0;
let _sessionBlankCorrect = 0;

// ── Public API ─────────────────────────────────────────────────────────────

export function initClozeCastle(container, onGoHome) {
  _container = container;
  _onGoHome  = onGoHome;
}

export function showClozeBrowser() {
  _renderBrowser();
}

export function cleanupClozeCastle() {
  if (_container) _container.innerHTML = '';
  _bankWords  = [];
  _blankFills = [];
  if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
}

// ── Level Browser ─────────────────────────────────────────────────────────

function _renderBrowser() {
  if (!_container) return;

  const completed = store.get('ccqCompleted') || {};
  const levels    = Object.keys(passages);

  let html = '<div class="cloze-browser">';
  html += '<div class="cloze-browser-grid">';

  for (const lv of levels) {
    const cats  = Object.keys(passages[lv]);
    const total = cats.reduce((sum, cat) => sum + passages[lv][cat].length, 0);
    const done  = getUniqueClozeDone({ level: lv, ccqCompletedByPassage: store.get('ccqCompletedByPassage') || {}, ccqCompleted: completed });
    const isDone = done >= total;
    const icon   = CLOZE_LEVEL_ICONS[lv];

    html += `
      <button class="cloze-level-btn ${isDone ? 'cloze-level-btn--done' : ''}"
              data-level="${lv}" aria-label="${CLOZE_LEVEL_LABELS[lv]}">
        <span class="cloze-level-icon">${isDone ? '⭐' : icon}</span>
        <span class="cloze-level-name">${CLOZE_LEVEL_LABELS[lv]}</span>
        <span class="cloze-level-count">${cats.length} topics · ${Math.min(done, total)} / ${total} done</span>
      </button>`;
  }

  html += '</div></div>';
  _container.innerHTML = html;

  _container.querySelectorAll('.cloze-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentLevel = btn.dataset.level;
      _renderCategoryPicker(_currentLevel);
    });
  });
}

// ── Category Picker ───────────────────────────────────────────────────────

function _renderCategoryPicker(level) {
  if (!_container) return;

  const cats = Object.keys(passages[level]);
  const completed = store.get('ccqCatCompleted') || {};
  const icon = CLOZE_LEVEL_ICONS[level];

  let html = `<div class="cloze-browser">`;
  html += `<div class="cloze-cat-header">
    <button class="btn btn--ghost btn--sm" id="cloze-back-levels" aria-label="Back to levels">← Levels</button>
    <h3 class="cloze-cat-title">${icon} ${CLOZE_LEVEL_LABELS[level]}</h3>
  </div>`;
  html += `<p class="cloze-cat-subtitle">Choose a grammar topic:</p>`;
  html += '<div class="cloze-cat-grid">';

  const recommendedCat = progress.getRecommendedGrammarCategory(level, cats)
    || questMastery.getRecommendedSkill('clozeCastle', cats);

  for (const catKey of cats) {
    const cat   = GRAMMAR_CATEGORIES[catKey] || { label: catKey, icon: '📝' };
    const total = passages[level][catKey].length;
    const doneKey = `${level}-${catKey}`;
    const done  = getUniqueClozeDone({ level, category: catKey, ccqCompletedByPassage: store.get('ccqCompletedByPassage') || {}, ccqCatCompleted: completed });
    const isDone = done >= total;
    const isRecommended = catKey === recommendedCat;

    html += `
      <button class="cloze-cat-btn ${isDone ? 'cloze-cat-btn--done' : ''} ${isRecommended ? 'cloze-cat-btn--recommended' : ''}"
              data-cat="${catKey}" aria-label="${cat.label}${isRecommended ? ' (recommended)' : ''}">
        <span class="cloze-cat-icon">${isDone ? '⭐' : cat.icon}</span>
        <span class="cloze-cat-label">${cat.label}</span>
        <span class="cloze-cat-count">${Math.min(done, total)} / ${total}${isRecommended ? ' · Recommended' : ''}</span>
      </button>`;
  }

  html += '</div>';

  const modeCfg = getModeConfig(_sessionMode);
  html += `<div class="cloze-mode-toggle">
    <span class="cloze-mode-label">Mode:</span>
    <button class="btn btn--ghost btn--sm ${modeCfg.mode === 'practice' ? 'is-active' : ''}" id="cloze-mode-practice">Practice</button>
    <button class="btn btn--ghost btn--sm ${modeCfg.mode === 'exam' ? 'is-active' : ''}" id="cloze-mode-exam">Exam</button>
  </div>`;

  const totalAll = cats.reduce((s, c) => s + passages[level][c].length, 0);
  html += `<div class="cloze-cat-actions">
    <button class="btn btn--primary btn--lg" id="cloze-play-all">Play All (${totalAll} passages)</button>
  </div>`;

  html += '</div>';
  _container.innerHTML = html;

  document.getElementById('cloze-back-levels')?.addEventListener('click', () => _renderBrowser());
  document.getElementById('cloze-mode-practice')?.addEventListener('click', () => {
    _sessionMode = 'practice';
    _renderCategoryPicker(level);
  });
  document.getElementById('cloze-mode-exam')?.addEventListener('click', () => {
    _sessionMode = 'exam';
    _renderCategoryPicker(level);
  });

  _container.querySelectorAll('.cloze-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentCat = btn.dataset.cat;
      _startCategory(_currentLevel, _currentCat);
    });
  });

  document.getElementById('cloze-play-all')?.addEventListener('click', () => {
    _currentCat = '__all__';
    _startAllCategories(_currentLevel);
  });
}

// ── Level flow ─────────────────────────────────────────────────────────────

function _startCategory(level, catKey) {
  const raw = passages[level]?.[catKey] || [];
  _levelPassages = [...raw].sort(() => Math.random() - 0.5);
  _passageIdx    = 0;
  _sessionCorrect = 0;
  _sessionTotal   = 0;
  _sessionClueScore = 0;
  _sessionHintsUsed = 0;
  _examStartedAt = Date.now();
  _sessionReviewRows = [];
  _sessionBlankTotal = 0;
  _sessionBlankCorrect = 0;
  _showPassage();
}

function _startAllCategories(level) {
  const cats = Object.keys(passages[level] || {});
  const all = cats.flatMap(c => passages[level][c]);
  _levelPassages = [...all].sort(() => Math.random() - 0.5);
  _passageIdx    = 0;
  _sessionCorrect = 0;
  _sessionTotal   = 0;
  _sessionClueScore = 0;
  _sessionHintsUsed = 0;
  _examStartedAt = Date.now();
  _sessionReviewRows = [];
  _sessionBlankTotal = 0;
  _sessionBlankCorrect = 0;
  _showPassage();
}

function _showPassage() {
  if (_passageIdx >= _levelPassages.length) {
    _showComplete();
    return;
  }
  _initPassage(_levelPassages[_passageIdx]);
}

// ── Passage init ───────────────────────────────────────────────────────────

function _initPassage(passage) {
  const round = createClozeRound(passage);
  _bankWords  = round.bankWords;
  _blankFills = round.blankFills;

  // Reset clue state
  _clueResults       = {};
  _hintLevel         = 0;
  _weakAttempts      = 0;
  _passageWrongCount = 0; // reset per-passage wrong counter for teach-back

  // Determine starting mode
  if (passage.clues && passage.clues.length > 0) {
    // Start with the first blank's clue hunt
    const firstClue = [...passage.clues].sort((a, b) => a.blankIndex - b.blankIndex)[0];
    _activeBlankIndex = firstClue?.blankIndex ?? -1;
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

  const icon     = CLOZE_LEVEL_ICONS[_currentLevel];
  const progress = `${_passageIdx + 1} / ${_levelPassages.length}`;
  const catInfo  = _currentCat !== '__all__' && GRAMMAR_CATEGORIES[_currentCat]
    ? `${GRAMMAR_CATEGORIES[_currentCat].icon} ${GRAMMAR_CATEGORIES[_currentCat].label}`
    : 'All Topics';

  const hasClues = passage.clues && passage.clues.length > 0;
  const inClueMode = hasClues && _bankLocked;
  const modeCfg = getModeConfig(_sessionMode);

  _container.innerHTML = `
    <div class="cloze-game">
      <div class="cloze-game-header">
        <span class="cloze-badge">${icon} ${CLOZE_LEVEL_LABELS[_currentLevel]}</span>
        <span class="cloze-badge cloze-badge--cat">${catInfo}</span>
        <span class="cloze-badge">${modeCfg.label}</span>
        <span class="cloze-progress">${progress}</span>
        <span class="cloze-xp-badge">+${passage.xp} XP</span>
      </div>

      <h3 class="cloze-title">${passage.title}</h3>

      ${inClueMode ? _buildClueHuntPanel(passage) : ''}

      <p class="cloze-instruction" id="cloze-instruction">
        ${inClueMode ? '🔍 Tap the clue word in the passage first!' : '🏰 Tap a word to fill the next blank!'}
      </p>

      <div class="cloze-passage" id="cloze-passage" aria-live="polite"></div>

      <div class="cloze-bank-wrapper ${inClueMode ? 'cloze-bank-wrapper--locked' : ''}" id="cloze-bank-wrapper">
        ${inClueMode ? '<div class="cloze-bank-lock-msg">🔒 Find the clue first!</div>' : ''}
        <div class="cloze-bank" id="cloze-bank" aria-label="Word choices"></div>
      </div>

      <div class="cloze-actions">
        <button class="btn btn--ghost btn--sm" id="cloze-clear">↺ Clear all</button>
        <button class="btn btn--ghost btn--sm" id="cloze-listen" aria-label="Listen to passage">🔊 Listen</button>
        <button class="btn btn--primary" id="cloze-check" ${inClueMode ? 'disabled' : ''}>Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="cloze-quit">Menu</button>
      </div>

      <div class="cloze-feedback" id="cloze-feedback" role="status" aria-live="assertive" hidden></div>
    </div>`;

  _renderPassageText(passage);
  _renderBankWords(passage);

  // ── Clue hunt listeners ──────────────────────────────────────────────────
  if (inClueMode) {
    _attachClueHuntListeners(passage);
  }

  // ── Classic listeners ────────────────────────────────────────────────────
  document.getElementById('cloze-clear')?.addEventListener('click', () => {
    clearClozeRound(_bankWords, _blankFills);
    _renderPassageText(passage);
    _renderBankWords(passage);
  });

  document.getElementById('cloze-listen')?.addEventListener('click', () => {
    let readable = passage.text;
    for (const ans of passage.answers) {
      readable = readable.replace('___', ans);
    }
    audio.speakWord(readable);
  });

  document.getElementById('cloze-check')?.addEventListener('click', () => _checkPassage(passage));

  document.getElementById('cloze-quit')?.addEventListener('click', () => {
    cleanupClozeCastle();
    _onGoHome?.();
  });

  // Keyboard shortcuts
  if (_keyHandler) document.removeEventListener('keydown', _keyHandler);
  _keyHandler = (e) => {
    if (e.key === 'Enter' && !_bankLocked) { e.preventDefault(); document.getElementById('cloze-check')?.click(); }
    if (e.key === 'Escape') { cleanupClozeCastle(); _onGoHome?.(); }
  };
  document.addEventListener('keydown', _keyHandler);
}


function _renderClueScoreMeter() {
  const scores = Object.values(_clueResults || {}).map(clueResultToScore);
  if (!scores.length) return '☆ ☆ ☆';
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const stars = avg >= 0.85 ? 3 : avg >= 0.45 ? 2 : 1;
  return `${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}`;
}

// ── Clue Hunt Panel HTML ───────────────────────────────────────────────────

function _buildClueHuntPanel(passage) {
  const clueData = _getActiveClueData(passage);
  if (!clueData) return '';
  const modeCfg = getModeConfig(_sessionMode);

  return `
    <div class="clue-hunt-panel" id="clue-hunt-panel">
      <div class="clue-hunt-header">
        <span class="clue-hunt-icon">🔍</span>
        <span class="clue-hunt-title">Find the Clue</span>
        <span class="clue-hunt-sub">Blank ${_activeBlankIndex + 1} · Clue Score ${_renderClueScoreMeter()}</span>
      </div>
      <p class="clue-hunt-prompt">${escapeHtml(clueData.prompt)}</p>
      <div class="clue-hunt-feedback" id="clue-hunt-feedback" aria-live="polite"></div>
      <div class="clue-hint-row">
        ${modeCfg.allowHints ? '<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-hint-btn" aria-label="Get a hint">💡 Hint</button>' : ''}
        ${modeCfg.allowHints ? '<button class="btn btn--ghost btn--sm clue-hint-btn" id="clue-skip-btn" aria-label="Skip clue">Skip clue</button>' : ''}
        <span class="clue-hint-msg" id="clue-hint-msg"></span>
      </div>
    </div>`;
}

// ── Clue Hunt Listeners ────────────────────────────────────────────────────

function _attachClueHuntListeners(passage) {
  const modeCfg = getModeConfig(_sessionMode);
  if (!modeCfg.allowHints) return;
  // Hint button
  document.getElementById('clue-hint-btn')?.addEventListener('click', () => {
    const clueData = _getActiveClueData(passage);
    if (!clueData) return;
    _hintLevel = Math.min(_hintLevel + 1, 4);
    _sessionHintsUsed = incrementHintUsage(_sessionHintsUsed);
    const { message } = getClueHint(_hintLevel, clueData);
    const hintMsg = document.getElementById('clue-hint-msg');
    if (hintMsg) {
      hintMsg.textContent = message;
      hintMsg.className = 'clue-hint-msg clue-hint-msg--visible';
    }
    if (_hintLevel >= 4) {
      _clueResults[_activeBlankIndex] = 'weak';
      _unlockBankAfterClue(passage, 'weak');
    }
  });

  document.getElementById('clue-skip-btn')?.addEventListener('click', () => {
    if (_activeBlankIndex < 0) return;
    _clueResults[_activeBlankIndex] = 'weak';
    _unlockBankAfterClue(passage, 'weak');
  });
}

// ── Clue Hunt — word tap ───────────────────────────────────────────────────

function _handleClueWordTap(tappedWord, passage) {
  const clueData = _getActiveClueData(passage);
  if (!clueData) return;

  const result   = evaluateClueSelection(tappedWord, clueData);
  const feedback = clueResultFeedback(result);

  // Show feedback in clue panel
  const fbEl = document.getElementById('clue-hunt-feedback');
  if (fbEl) {
    fbEl.textContent  = feedback.message;
    fbEl.className    = `clue-hunt-feedback ${feedback.cssClass}`;
  }

  // Re-render passage with selected word highlighted
  const passageEl = document.getElementById('cloze-passage');
  if (passageEl) {
    renderClueHuntPassage({
      container:        passageEl,
      text:             passage.text,
      activeBlankIndex: _activeBlankIndex,
      selectedWord:     tappedWord,
      selectedResult:   result,
      filledAnswers:    _blankFills.map((id, i) =>
        id !== null ? _bankWords.find(w => w.id === id)?.word || '' : ''
      ),
      onTapWord: (word) => _handleClueWordTap(word, passage),
    });
  }

  // Record analytics
  store.recordClueAttempt({
    quest: 'clozeCastle',
    result,
    clueType: clueData.clueType,
  });

  if (result === 'strong' || result === 'partial') {
    // Good enough — unlock the word bank
    _clueResults[_activeBlankIndex] = result;
    audio.playSfx(result === 'strong' ? 'correct' : 'pop');
    setTimeout(() => _unlockBankAfterClue(passage, result), 800);
  } else {
    // Weak — allow one more attempt, then unlock anyway
    _weakAttempts++;
    audio.playSfx('wrong');
    if (_weakAttempts >= 2) {
      _clueResults[_activeBlankIndex] = 'weak';
      setTimeout(() => _unlockBankAfterClue(passage, 'weak'), 1000);
    }
  }
}

function _unlockBankAfterClue(passage, result) {
  if (!_bankLocked) return; // already unlocked

  _bankLocked = false;
  _activeBlankIndex = -1;

  // Accumulate clue score
  _sessionClueScore += clueResultToScore(result);

  // Update instruction
  const instr = document.getElementById('cloze-instruction');
  if (instr) instr.textContent = '🏰 Now tap a word to fill the blank!';

  // Swap bank wrapper state
  const wrapper = document.getElementById('cloze-bank-wrapper');
  if (wrapper) wrapper.className = 'cloze-bank-wrapper';

  // Enable the Check button
  const checkBtn = document.getElementById('cloze-check');
  if (checkBtn) checkBtn.disabled = false;

  // Re-render bank so chips become interactive
  _renderBankWords(passage);
}

// ── Passage Rendering ──────────────────────────────────────────────────────

function _renderPassageText(passage) {
  const container = document.getElementById('cloze-passage');
  if (!container) return;

  if (_bankLocked) {
    // Clue hunt phase — render tappable tokens
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
    // Classic fill mode
    renderClozePassage({
      container,
      text: passage.text,
      blankFills: _blankFills,
      bankWords: _bankWords,
      blankClass: 'cloze-blank',
      filledClass: 'cloze-blank--filled',
      emptyBlankAria: (i) => `Empty blank ${i + 1}`,
      removeBlankAria: (word) => `Remove ${word} from blank`,
      onRemoveWord: () => {
        _renderPassageText(passage);
        _renderBankWords(passage);
      },
      onTapEmpty: (blank) => {
        blank.classList.add('cloze-blank--selected');
        setTimeout(() => blank.classList.remove('cloze-blank--selected'), 800);
      },
    });
  }
}

function _renderBankWords(passage) {
  const bank = document.getElementById('cloze-bank');
  if (!bank) return;

  if (_bankLocked) {
    // Show chips but fully disabled
    bank.innerHTML = _bankWords.map(w => `
      <button class="cloze-word-chip cloze-word-chip--locked"
              disabled aria-disabled="true"
              aria-label="${escapeAttr(w.word)}">${escapeHtml(w.word)}</button>
    `).join('');
    return;
  }

  renderClozeBank({
    container: bank,
    bankWords: _bankWords,
    chipClass: 'cloze-word-chip',
    usedClass: 'cloze-word-chip--used',
    onChooseWord: (id) => {
      if (!fillNextBlank(_bankWords, _blankFills, id)) return;
      audio.playSfx('pop');

      // After filling a blank, activate clue-hunt for the next unfilled clue target.
      const nextClue = (passage.clues || [])
        .slice()
        .sort((a, b) => a.blankIndex - b.blankIndex)
        .find(c => _blankFills[c.blankIndex] === null && !_clueResults.hasOwnProperty(c.blankIndex));

      if (nextClue) {
        _activeBlankIndex = nextClue.blankIndex;
        _bankLocked       = true;
        _hintLevel        = 0;
        _weakAttempts     = 0;
        console.info('[ClozeCastle] Activating next clue target', { blankIndex: _activeBlankIndex, passageId: passage.id });
        _renderPassage(passage);
      } else {
        _renderPassageText(passage);
        _renderBankWords(passage);
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


function _buildReviewRows(passage, userAnswers) {
  return passage.answers.map((correctAnswer, idx) => {
    const clue = _getClueDataForBlank(passage, idx);
    const studentAnswer = userAnswers[idx] || '';
    return {
      blank: `#${idx + 1}`,
      passageTitle: passage.title,
      studentAnswer,
      correctAnswer,
      status: studentAnswer === correctAnswer ? 'Correct' : 'Try again',
      clue: clue?.acceptableSpans?.[0] || '—',
      explanation: passage.grammarNotes?.[idx] || clue?.explanation || 'Read the words before and after the blank.',
    };
  });
}

// ── Checking ───────────────────────────────────────────────────────────────

function _checkPassage(passage) {
  if (_blankFills.some(f => f === null)) {
    _showFeedback('Fill in all the blanks first! 🏰', false);
    return;
  }

  const userAnswers = buildUserAnswers(_blankFills, _bankWords);
  _lastUserAnswers = [...userAnswers];
  const allCorrect  = userAnswers.every((ans, i) => ans === passage.answers[i]);
  const blankCorrect = userAnswers.filter((ans, i) => ans === passage.answers[i]).length;
  const modeCfg = getModeConfig(_sessionMode);
  const skillKey = _currentCat === '__all__' ? 'mixed' : _currentCat;

  questMastery.recordAttempt({
    quest: 'clozeCastle',
    skill: skillKey,
    correct: allCorrect,
    responseMs: 2000,
    level: _currentLevel,
  });
  questMastery.updateSkill('clozeCastle', skillKey, allCorrect);
  progress.recordGrammarCategoryAttempt(_currentLevel, skillKey, allCorrect);

  _sessionTotal++;
  _sessionBlankTotal += passage.answers.length;
  _sessionBlankCorrect += blankCorrect;

  if (modeCfg.showFinalReviewOnly) {
    const rows = _buildReviewRows(passage, userAnswers);
    _sessionReviewRows.push(...rows.filter(r => r.status !== 'Correct').map(r => ({
      passageTitle: r.passageTitle,
      blank: r.blank,
      studentAnswer: r.studentAnswer,
      correctAnswer: r.correctAnswer,
      explanation: r.explanation,
    })));
    const examAttempts = store.get('ccqExamAttempts') || [];
    examAttempts.push({
      level: _currentLevel,
      category: skillKey,
      passageId: passage.id,
      blankCorrect,
      blankTotal: passage.answers.length,
      submittedAt: Date.now(),
    });
    store.set('ccqExamAttempts', examAttempts.slice(-150));
    _passageIdx++;
    _showPassage();
    return;
  }

  if (allCorrect) {
    _sessionCorrect++;
    gamification.recordCorrect(2000, false);
    if (getModeConfig(_sessionMode).confettiPerPassage) celebrateCorrect();
    audio.playSfx('correct');
    mascot.celebrate(false);

    const accPercent = Math.round((blankCorrect / Math.max(1, passage.answers.length)) * 100);
    if (_currentCat !== '__all__' && passage.id) {
      const tracked = recordClozeCompletion({
        level: _currentLevel,
        category: _currentCat,
        passageId: passage.id,
        accuracy: accPercent,
        ccqCompletedByPassage: store.get('ccqCompletedByPassage') || {},
        ccqCompleted: store.get('ccqCompleted') || {},
        ccqCatCompleted: store.get('ccqCatCompleted') || {},
      });
      store.set('ccqCompletedByPassage', tracked.nextByPassage);
      store.set('ccqCompleted', tracked.nextCompleted);
      store.set('ccqCatCompleted', tracked.nextCatCompleted);
    }

    document.querySelectorAll('.cloze-blank--filled').forEach(b => b.classList.add('cloze-blank--correct'));

    showAnswerReviewPanel({
      host: _container.querySelector('.cloze-game'),
      title: 'Answer Review',
      rows: _buildReviewRows(passage, userAnswers),
      onContinue: () => {
        if (passage.clues && passage.clues.length > 0) {
          _showClueExplanation(passage, () => setTimeout(() => { _passageIdx++; _showPassage(); }, 600));
        } else {
          _showFeedback('✅ Excellent! All correct!', true);
          setTimeout(() => { _passageIdx++; _showPassage(); }, 1200);
        }
      },
    });
  } else {
    audio.playSfx('wrong');
    _passageWrongCount++;

    document.querySelectorAll('.cloze-blank--filled').forEach((b, i) => {
      const userAns = _bankWords.find(w => w.id === _blankFills[i])?.word || '';
      b.classList.toggle('cloze-blank--wrong', userAns !== passage.answers[i]);
    });

    mascot.encourage();

    if (_sessionMode === 'exam') {
      showAnswerReviewPanel({
        host: _container.querySelector('.cloze-game'),
        title: 'Exam Submission Review',
        rows: _buildReviewRows(passage, userAnswers),
        onContinue: () => { _passageIdx++; _showPassage(); },
      });
      return;
    }

    if (_passageWrongCount >= 2) {
      // Second wrong attempt on this passage → teach-back before retry
      _showFeedback('❌ Let\'s review your answers first.', false);
      setTimeout(() => {
        document.querySelectorAll('.cloze-blank--wrong').forEach(b => b.classList.remove('cloze-blank--wrong'));
        const fb = document.getElementById('cloze-feedback');
        if (fb) fb.hidden = true;
        showAnswerReviewPanel({
          host: _container.querySelector('.cloze-game'),
          title: 'Review Mistakes',
          rows: _buildReviewRows(passage, userAnswers),
          onContinue: () => _showTeachBackOverlay(passage),
        });
      }, 800);
    } else {
      _showFeedback('❌ Some blanks are wrong – try again!', false);
      setTimeout(() => {
        document.querySelectorAll('.cloze-blank--wrong').forEach(b => b.classList.remove('cloze-blank--wrong'));
        const fb = document.getElementById('cloze-feedback');
        if (fb) fb.hidden = true;
      }, 1800);
    }
  }
}

// ── Teach-Back Overlay ─────────────────────────────────────────────────────

/**
 * Show a grammar tip overlay when the learner has failed a passage twice.
 * Displays the rule, an example, and a "Got it, try again" button.
 * @param {object} passage
 */
function _showTeachBackOverlay(passage) {
  if (!_container) return;

  const existing = document.getElementById('cloze-teachback-overlay');
  if (existing) existing.remove();

  const catKey = _currentCat === '__all__' ? null : _currentCat;
  const tip    = catKey ? getGrammarTip(catKey) : {
    rule: 'Read each sentence carefully and look for clues about which word fits best.',
    example: 'Look at the words around the blank — they often tell you what grammar rule to use.',
  };

  const overlay = document.createElement('div');
  overlay.id        = 'cloze-teachback-overlay';
  overlay.className = 'cloze-teachback-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Grammar tip');

  overlay.innerHTML = `
    <div class="ctb-panel">
      <div class="ctb-header">
        <span class="ctb-icon" aria-hidden="true">💡</span>
        <h3 class="ctb-title">Here's a tip!</h3>
      </div>
      <div class="ctb-rule">
        <p class="ctb-rule-text">${escapeHtml(tip.rule)}</p>
      </div>
      <div class="ctb-example">
        <span class="ctb-example-label">Example:</span>
        <p class="ctb-example-text">${escapeHtml(tip.example)}</p>
      </div>
      ${tip.tip ? `<p class="ctb-memory-tip">💡 ${escapeHtml(tip.tip)}</p>` : ''}
      <button class="btn btn--primary ctb-btn" id="ctb-try-again">
        Got it — try again!
      </button>
    </div>`;

  _container.appendChild(overlay);

  overlay.querySelector('#ctb-try-again')?.addEventListener('click', () => {
    overlay.remove();
    // Clear all fills so the child starts the passage fresh
    clearClozeRound(_bankWords, _blankFills);
    _blankFills = _blankFills.map(() => null);
    _renderBankWords(passage);
    _renderPassageText(passage);
  });

  setTimeout(() => overlay.querySelector('#ctb-try-again')?.focus(), 100);
}

// ── Post-answer Clue Explanation ───────────────────────────────────────────

function _showClueExplanation(passage, onContinue) {
  if (!_container) return;

  const existing = document.getElementById('cloze-explanation-overlay');
  if (existing) existing.remove();

  const lines = passage.answers.map((answer, idx) => {
    const clue = (passage.clues || []).find(c => c.blankIndex === idx);
    const result = _clueResults[idx] || 'weak';
    const feedback = clueResultFeedback(result);
    const score = clueResultToScore(result);
    const selected = clue?.acceptableSpans?.[0] || 'Skipped / no clue';
    const note = passage.grammarNotes?.[idx] || clue?.explanation || `"${answer}" is the best fit for the sentence meaning and grammar.`;

    return `
      <div class="clue-explanation-item">
        <p><strong>Blank ${idx + 1}:</strong> ${escapeHtml(answer)}</p>
        <p>Clue chosen: <span class="clue-result-badge ${feedback.cssClass}">${escapeHtml(selected)}</span> · Score ${Math.round(score * 100)}%</p>
        <p class="clue-explanation-text">${escapeHtml(note)}</p>
      </div>`;
  }).join('');

  const overlay = document.createElement('div');
  overlay.id = 'cloze-explanation-overlay';
  overlay.className = 'clue-explanation-overlay';
  overlay.innerHTML = `
    <div class="clue-explanation-card">
      <p class="clue-explanation-title">✅ Grammar Review</p>
      <div class="clue-explanation-body">${lines}</div>
      <button class="btn btn--primary" id="clue-explanation-next">Next →</button>
    </div>`;

  _container.querySelector('.cloze-game')?.appendChild(overlay);
  document.getElementById('clue-explanation-next')?.addEventListener('click', () => {
    overlay.remove();
    onContinue();
  });
}

// ── Feedback helper ────────────────────────────────────────────────────────

function _showFeedback(msg, success) {
  const el = document.getElementById('cloze-feedback');
  if (!el) return;
  el.textContent = msg;
  el.className = `cloze-feedback cloze-feedback--${success ? 'success' : 'error'}`;
  el.hidden = false;
  if (success) setTimeout(() => { el.hidden = true; }, 1600);
}

// ── Complete screen ────────────────────────────────────────────────────────

function _showComplete() {
  if (!_container) return;

  const icon = CLOZE_LEVEL_ICONS[_currentLevel];
  celebrateCorrect();
  audio.playSfx('levelUp');
  mascot.celebrate(true);

  const catInfo = _currentCat !== '__all__' && GRAMMAR_CATEGORIES[_currentCat]
    ? `${GRAMMAR_CATEGORIES[_currentCat].icon} ${GRAMMAR_CATEGORIES[_currentCat].label}`
    : 'All Topics';

  const acc   = _sessionBlankTotal > 0 ? Math.round((_sessionBlankCorrect / _sessionBlankTotal) * 100) : 100;
  const stars = acc >= 90 ? 3 : acc >= 70 ? 2 : 1;
  const modeCfg = getModeConfig(_sessionMode);
  const elapsedSec = Math.max(1, Math.round((Date.now() - (_examStartedAt || Date.now())) / 1000));
  const recommendation = getNextStepRecommendation({ accuracy: acc, skillLabel: catInfo, hintsUsed: _sessionHintsUsed });
  const wrongLines = _sessionReviewRows.map((row) => `- ${row.passageTitle} ${row.blank}: ${row.studentAnswer || '(blank)'} → ${row.correctAnswer}`);

  // Clue accuracy line (only shown if clue mode was used)
  const clueTotal = Object.keys(_clueResults).length;
  const clueAcc   = clueTotal > 0
    ? Math.round((_sessionClueScore / clueTotal) * 100)
    : null;
  const clueAccLine = clueAcc !== null
    ? `<p class="cloze-complete-clue">🔍 Clue accuracy: ${clueAcc}%</p>`
    : '';

  _container.innerHTML = `
    <div class="cloze-complete">
      <div class="cloze-complete-icon">${icon}</div>
      <h3 class="cloze-complete-title">Castle Cleared! 🏰</h3>
      <p class="cloze-complete-sub">${CLOZE_LEVEL_LABELS[_currentLevel]} · ${catInfo}</p>
      <div class="cloze-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="cloze-complete-score">Blanks: ${_sessionBlankCorrect} / ${_sessionBlankTotal} correct · ${acc}%</p>
      <p class="cloze-complete-score">Mode: ${modeCfg.label} · Hints used: ${_sessionHintsUsed} · Time: ${elapsedSec}s</p>
      ${clueAccLine}
      <p class="cloze-complete-score">Next step: ${recommendation}</p>
      <div class="cloze-complete-actions">
        <button class="btn btn--primary btn--lg" id="cloze-back-cat">Choose Another Topic</button>
        <button class="btn btn--ghost btn--sm" id="cloze-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="cloze-copy-summary">Copy Summary</button>
        <button class="btn btn--ghost btn--sm" id="cloze-back-levels">All Levels</button>
      </div>
    </div>`;

  document.getElementById('cloze-back-cat')?.addEventListener('click', () => _renderCategoryPicker(_currentLevel));
  document.getElementById('cloze-replay')?.addEventListener('click', () => {
    if (_currentCat === '__all__') _startAllCategories(_currentLevel);
    else _startCategory(_currentLevel, _currentCat);
  });
  document.getElementById('cloze-copy-summary')?.addEventListener('click', async () => {
    const text = buildCopySummaryText({
      modeLabel: modeCfg.label,
      title: `${CLOZE_LEVEL_LABELS[_currentLevel]} · ${catInfo}`,
      category: catInfo,
      level: CLOZE_LEVEL_LABELS[_currentLevel],
      scoreLine: getSummaryScoreLine({
        mode: _sessionMode,
        blankCorrect: _sessionBlankCorrect,
        blankTotal: _sessionBlankTotal,
        passageCorrect: _sessionCorrect,
        passageTotal: _sessionTotal,
      }),
      accuracy: acc,
      timeTaken: `${elapsedSec}s`,
      hintsUsed: _sessionHintsUsed,
      clueScore: clueAcc ?? 0,
      wrongLines,
      nextStep: recommendation,
    });
    try {
      await navigator.clipboard?.writeText(text);
      _showFeedback('Summary copied!', true);
    } catch {
      _showFeedback('Unable to copy summary on this device.', false);
    }
  });
  document.getElementById('cloze-back-levels')?.addEventListener('click', () => _renderBrowser());

  if (_keyHandler) { document.removeEventListener('keydown', _keyHandler); _keyHandler = null; }
  setTimeout(() => document.getElementById('cloze-back-cat')?.focus(), 200);
}
