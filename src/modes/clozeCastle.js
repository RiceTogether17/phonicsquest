/**
 * PhonicsQuest – Cloze Castle Quest 🏰
 *
 * Grammar cloze passages (P1–P6). Players tap words from a shared word bank
 * to fill blanks in the passage. Tap a filled blank to return the word.
 *
 * Public API:
 *   initClozeCastle(container, onGoHome)  – attach to DOM container
 *   showClozeBrowser()                    – render level picker
 *   cleanupClozeCastle()                  – teardown
 */

import { passages, CLOZE_LEVEL_LABELS, CLOZE_LEVEL_ICONS } from '../data/passages.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { gamification } from '../modules/gamification.js';
import { celebrateCorrect } from '../components/confettiHelper.js';

// ── Module state ───────────────────────────────────────────────────────────

let _container = null;
let _onGoHome  = null;

let _currentLevel   = 'P1';
let _passageIdx     = 0;
let _levelPassages  = [];
let _bankWords      = [];   // [{id, word, used}]
let _blankFills     = [];   // null | bankWordId per blank

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
}

// ── Browser ────────────────────────────────────────────────────────────────

function _renderBrowser() {
  if (!_container) return;

  const completed = store.get('ccqCompleted') || {};
  const levels    = Object.keys(passages);

  let html = '<div class="cloze-browser">';
  html += '<div class="cloze-browser-grid">';

  for (const lv of levels) {
    const total   = passages[lv].length;
    const done    = completed[lv] || 0;
    const isDone  = done >= total;
    const icon    = CLOZE_LEVEL_ICONS[lv];

    html += `
      <button class="cloze-level-btn ${isDone ? 'cloze-level-btn--done' : ''}"
              data-level="${lv}" aria-label="${CLOZE_LEVEL_LABELS[lv]}">
        <span class="cloze-level-icon">${isDone ? '⭐' : icon}</span>
        <span class="cloze-level-name">${CLOZE_LEVEL_LABELS[lv]}</span>
        <span class="cloze-level-count">${Math.min(done, total)} / ${total} done</span>
      </button>`;
  }

  html += '</div></div>';
  _container.innerHTML = html;

  _container.querySelectorAll('.cloze-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentLevel = btn.dataset.level;
      _startLevel(_currentLevel);
    });
  });
}

// ── Level flow ─────────────────────────────────────────────────────────────

function _startLevel(level) {
  _levelPassages = [...(passages[level] || [])].sort(() => Math.random() - 0.5);
  _passageIdx    = 0;
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
  // Count blanks
  const blankCount = (passage.text.match(/___/g) || []).length;

  // Build bank words from wordBank, giving each a unique id
  _bankWords = passage.wordBank.map((w, i) => ({ id: i, word: w, used: false }));
  // Shuffle
  for (let i = _bankWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_bankWords[i], _bankWords[j]] = [_bankWords[j], _bankWords[i]];
  }
  _blankFills = Array(blankCount).fill(null);

  _renderPassage(passage);
}

// ── Passage render ─────────────────────────────────────────────────────────

function _renderPassage(passage) {
  if (!_container) return;

  const icon     = CLOZE_LEVEL_ICONS[_currentLevel];
  const progress = `${_passageIdx + 1} / ${_levelPassages.length}`;

  _container.innerHTML = `
    <div class="cloze-game">
      <div class="cloze-game-header">
        <span class="cloze-badge">${icon} ${CLOZE_LEVEL_LABELS[_currentLevel]}</span>
        <span class="cloze-progress">${progress}</span>
        <span class="cloze-xp-badge">+${passage.xp} XP</span>
      </div>

      <h3 class="cloze-title">${passage.title}</h3>
      <p class="cloze-instruction">🏰 Tap a word to fill the next blank!</p>

      <div class="cloze-passage" id="cloze-passage" aria-live="polite"></div>

      <div class="cloze-bank" id="cloze-bank" aria-label="Word choices"></div>

      <div class="cloze-actions">
        <button class="btn btn--ghost btn--sm" id="cloze-clear">↺ Clear all</button>
        <button class="btn btn--primary" id="cloze-check">Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="cloze-quit">Menu</button>
      </div>

      <div class="cloze-feedback" id="cloze-feedback" hidden></div>
    </div>`;

  _renderPassageText(passage);
  _renderBankWords();

  document.getElementById('cloze-clear')?.addEventListener('click', () => {
    _bankWords.forEach(w => (w.used = false));
    _blankFills.fill(null);
    _renderPassageText(passage);
    _renderBankWords();
  });

  document.getElementById('cloze-check')?.addEventListener('click', () => _checkPassage(passage));
  document.getElementById('cloze-quit')?.addEventListener('click', () => { cleanupClozeCastle(); _onGoHome?.(); });
}

function _renderPassageText(passage) {
  const container = document.getElementById('cloze-passage');
  if (!container) return;

  // Split text by ___ to get parts
  const parts = passage.text.split('___');
  let html = '';

  parts.forEach((part, i) => {
    html += `<span>${part}</span>`;
    if (i < parts.length - 1) {
      const fill = _blankFills[i] !== null ? _bankWords.find(w => w.id === _blankFills[i]) : null;
      if (fill) {
        html += `<button class="cloze-blank cloze-blank--filled" data-blank="${i}"
                         aria-label="Remove ${fill.word} from blank">${fill.word}</button>`;
      } else {
        html += `<button class="cloze-blank" data-blank="${i}" aria-label="Empty blank ${i + 1}"></button>`;
      }
    }
  });

  container.innerHTML = html;

  // Tap filled blank → return word to bank
  container.querySelectorAll('.cloze-blank--filled').forEach(blank => {
    blank.addEventListener('click', () => {
      const idx  = parseInt(blank.dataset.blank);
      const id   = _blankFills[idx];
      const item = _bankWords.find(w => w.id === id);
      if (item) item.used = false;
      _blankFills[idx] = null;
      _renderPassageText(passage);
      _renderBankWords();
    });
  });

  // Tap empty blank → select it (optional: auto-place next available)
  container.querySelectorAll('.cloze-blank:not(.cloze-blank--filled)').forEach(blank => {
    blank.addEventListener('click', () => {
      // highlight it for next tap from bank — already handled by tap-word logic
      blank.classList.add('cloze-blank--selected');
      setTimeout(() => blank.classList.remove('cloze-blank--selected'), 800);
    });
  });
}

function _renderBankWords() {
  const bank = document.getElementById('cloze-bank');
  if (!bank) return;

  bank.innerHTML = _bankWords.map(w => `
    <button class="cloze-word-chip ${w.used ? 'cloze-word-chip--used' : ''}"
            data-id="${w.id}"
            ${w.used ? 'disabled aria-disabled="true"' : ''}
            aria-label="${w.word}">${w.word}</button>
  `).join('');

  bank.querySelectorAll('.cloze-word-chip:not([disabled])').forEach(chip => {
    chip.addEventListener('click', () => {
      const id   = parseInt(chip.dataset.id);
      const item = _bankWords.find(w => w.id === id);
      if (!item || item.used) return;

      // Find first empty blank
      const blankIdx = _blankFills.findIndex(f => f === null);
      if (blankIdx === -1) return;

      item.used = true;
      _blankFills[blankIdx] = id;
      audio.playSfx('pop');
      _renderPassageText(_levelPassages[_passageIdx]);
      _renderBankWords();
    });
  });
}

// ── Checking ───────────────────────────────────────────────────────────────

function _checkPassage(passage) {
  if (_blankFills.some(f => f === null)) {
    _showFeedback('Fill in all the blanks first! 🏰', false);
    return;
  }

  const userAnswers = _blankFills.map(id => _bankWords.find(w => w.id === id)?.word || '');
  const allCorrect  = userAnswers.every((ans, i) => ans === passage.answers[i]);

  if (allCorrect) {
    gamification.recordCorrect(2000, false);
    celebrateCorrect();
    audio.playSfx('correct');

    const completed = store.get('ccqCompleted') || {};
    completed[_currentLevel] = (completed[_currentLevel] || 0) + 1;
    store.set('ccqCompleted', completed);

    _showFeedback('✅ Excellent! All correct!', true);

    // Highlight correct blanks green
    document.querySelectorAll('.cloze-blank--filled').forEach(b => b.classList.add('cloze-blank--correct'));

    setTimeout(() => {
      _passageIdx++;
      _showPassage();
    }, 1800);
  } else {
    audio.playSfx('wrong');

    // Highlight wrong blanks red
    document.querySelectorAll('.cloze-blank--filled').forEach((b, i) => {
      const userAns = _bankWords.find(w => w.id === _blankFills[i])?.word || '';
      b.classList.toggle('cloze-blank--wrong', userAns !== passage.answers[i]);
    });

    _showFeedback('❌ Some blanks are wrong – try again!', false);
    setTimeout(() => {
      document.querySelectorAll('.cloze-blank--wrong').forEach(b => b.classList.remove('cloze-blank--wrong'));
      const fb = document.getElementById('cloze-feedback');
      if (fb) fb.hidden = true;
    }, 1800);
  }
}

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

  const levels = Object.keys(passages);
  const nextIdx = levels.indexOf(_currentLevel) + 1;
  const nextLevel = levels[nextIdx] || null;

  _container.innerHTML = `
    <div class="cloze-complete">
      <div class="cloze-complete-icon">${icon}</div>
      <h3 class="cloze-complete-title">Castle Cleared! 🏰</h3>
      <p class="cloze-complete-sub">${CLOZE_LEVEL_LABELS[_currentLevel]}</p>
      <div class="cloze-stars">⭐⭐⭐</div>
      <div class="cloze-complete-actions">
        ${nextLevel ? `<button class="btn btn--primary btn--lg" id="cloze-next-level">${CLOZE_LEVEL_LABELS[nextLevel]} →</button>` : ''}
        <button class="btn btn--ghost btn--sm" id="cloze-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="cloze-back">All Levels</button>
      </div>
    </div>`;

  document.getElementById('cloze-next-level')?.addEventListener('click', () => {
    _currentLevel = nextLevel;
    _startLevel(_currentLevel);
  });
  document.getElementById('cloze-replay')?.addEventListener('click', () => _startLevel(_currentLevel));
  document.getElementById('cloze-back')?.addEventListener('click', () => _renderBrowser());
}
