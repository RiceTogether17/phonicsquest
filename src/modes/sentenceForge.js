/**
 * PhonicsQuest – Sentence Forge Quest 🔨
 *
 * Word-order game: scrambled words → tap to arrange into a correct sentence.
 * Public API mirrors sightMatch.js pattern.
 *
 * Public API:
 *   initSentenceForge(container, onGoHome) – attach to DOM container
 *   showSentenceBrowser()                  – render level picker
 *   cleanupSentenceForge()                 – teardown
 */

import { allSentences, SENTENCE_LEVEL_LABELS, SENTENCE_LEVEL_ICONS } from '../data/sentences.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { gamification } from '../modules/gamification.js';
import { questMastery } from '../modules/questMastery.js';
import { celebrateCorrect, celebrateLevelUp } from '../components/confettiHelper.js';

// ── Module state ───────────────────────────────────────────────────────────

let _container = null;
let _onGoHome  = null;

let _currentLevel = 1;
let _levelSentences = [];
let _sentenceIdx = 0;
let _bankWords = [];       // [{id, word, used}]
let _answerSlots = [];     // bank word ids in answer order (null = empty never happens; slots grow as words tapped)
let _sessionCorrect = 0;
let _sessionTotal = 0;

// ── Public API ─────────────────────────────────────────────────────────────

export function initSentenceForge(container, onGoHome) {
  _container = container;
  _onGoHome  = onGoHome;
}

export function showSentenceBrowser() {
  _renderBrowser();
}

export function cleanupSentenceForge() {
  if (_container) _container.innerHTML = '';
  _bankWords   = [];
  _answerSlots = [];
}

// ── Browser ────────────────────────────────────────────────────────────────

function _renderBrowser() {
  if (!_container) return;

  const completed = store.get('sfqCompleted') || {};

  let html = '<div class="sfq-browser">';
  html += '<div class="sfq-browser-grid">';

  for (let lv = 1; lv <= 6; lv++) {
    const total = allSentences.filter(s => s.level === lv).length;
    const done  = completed[lv] || 0;
    const isDone = done >= total;
    const icon   = SENTENCE_LEVEL_ICONS[lv - 1];

    html += `
      <button class="sfq-level-btn ${isDone ? 'sfq-level-btn--done' : ''}"
              data-level="${lv}" aria-label="${SENTENCE_LEVEL_LABELS[lv]}">
        <span class="sfq-level-icon">${isDone ? '⭐' : icon}</span>
        <span class="sfq-level-name">${SENTENCE_LEVEL_LABELS[lv]}</span>
        <span class="sfq-level-count">${Math.min(done, total)} / ${total}</span>
      </button>`;
  }

  html += '</div></div>';
  _container.innerHTML = html;

  _container.querySelectorAll('.sfq-level-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _currentLevel = parseInt(btn.dataset.level);
      _startLevel(_currentLevel);
    });
  });
}

// ── Level flow ─────────────────────────────────────────────────────────────

function _startLevel(level) {
  const raw = allSentences.filter(s => s.level === level);
  // Shuffle a copy so order varies each play
  _levelSentences = [...raw].sort(() => Math.random() - 0.5);
  _sentenceIdx    = 0;
  _sessionCorrect = 0;
  _sessionTotal   = 0;
  _showSentence();
}

function _showSentence() {
  if (_sentenceIdx >= _levelSentences.length) {
    _showComplete();
    return;
  }
  const entry   = _levelSentences[_sentenceIdx];
  // Strip trailing punctuation for the scramble; preserve for checking
  const clean   = entry.sentence.replace(/[.!?]$/, '');
  const punct   = entry.sentence.slice(clean.length);
  const rawWords = clean.split(' ');

  // Build bank words with unique ids
  _bankWords = rawWords.map((w, i) => ({ id: i, word: w, used: false }));

  // Shuffle bank
  for (let i = _bankWords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [_bankWords[i], _bankWords[j]] = [_bankWords[j], _bankWords[i]];
  }

  _answerSlots = [];
  _renderGame(entry, punct);
}

// ── Game render ────────────────────────────────────────────────────────────

function _renderGame(entry, punct) {
  if (!_container) return;

  const progress = `${_sentenceIdx + 1} / ${_levelSentences.length}`;
  const icon     = SENTENCE_LEVEL_ICONS[_currentLevel - 1];
  const xpVal    = 10 + _currentLevel * 5;

  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">${icon} ${SENTENCE_LEVEL_LABELS[_currentLevel]}</span>
        <span class="sfq-progress">${progress}</span>
        <span class="sfq-xp-badge">+${xpVal} XP</span>
      </div>

      <p class="sfq-instruction">🔨 Tap the words to build the sentence!</p>

      <div class="sfq-answer-area" id="sfq-answer-area" aria-label="Your sentence">
        <div class="sfq-answer-chips" id="sfq-answer-chips">
          <span class="sfq-placeholder" id="sfq-placeholder">Tap words below…</span>
        </div>
        <span class="sfq-punct" id="sfq-punct" aria-hidden="true">${punct}</span>
      </div>

      <div class="sfq-bank" id="sfq-bank" aria-label="Word choices"></div>

      <div class="sfq-actions">
        <button class="btn btn--ghost btn--sm" id="sfq-clear">↺ Clear</button>
        <button class="btn btn--primary" id="sfq-check">Check ✓</button>
        <button class="btn btn--ghost btn--sm" id="sfq-quit">Menu</button>
      </div>

      <div class="sfq-feedback" id="sfq-feedback" hidden></div>
    </div>`;

  _renderBank();
  _renderAnswer();

  document.getElementById('sfq-clear')?.addEventListener('click', () => {
    _bankWords.forEach(w => (w.used = false));
    _answerSlots = [];
    _renderBank();
    _renderAnswer();
  });

  document.getElementById('sfq-check')?.addEventListener('click', () => _checkAnswer(entry, punct));
  document.getElementById('sfq-quit')?.addEventListener('click', () => { cleanupSentenceForge(); _onGoHome?.(); });
}

function _renderBank() {
  const bank = document.getElementById('sfq-bank');
  if (!bank) return;
  bank.innerHTML = _bankWords.map(w => `
    <button class="sfq-word-chip ${w.used ? 'sfq-word-chip--used' : ''}"
            data-id="${w.id}"
            ${w.used ? 'disabled aria-disabled="true"' : ''}
            aria-label="${w.word}">${w.word}</button>
  `).join('');

  bank.querySelectorAll('.sfq-word-chip:not([disabled])').forEach(chip => {
    chip.addEventListener('click', () => {
      const id = parseInt(chip.dataset.id);
      const item = _bankWords.find(w => w.id === id);
      if (!item || item.used) return;
      item.used = true;
      _answerSlots.push(id);
      audio.playSfx('pop');
      _renderBank();
      _renderAnswer();
    });
  });
}

function _renderAnswer() {
  const area   = document.getElementById('sfq-answer-chips');
  const ph     = document.getElementById('sfq-placeholder');
  if (!area) return;

  if (_answerSlots.length === 0) {
    // show placeholder
    if (ph) ph.hidden = false;
    // remove any existing chips
    area.querySelectorAll('.sfq-answer-chip').forEach(c => c.remove());
    return;
  }

  if (ph) ph.hidden = true;
  area.querySelectorAll('.sfq-answer-chip').forEach(c => c.remove());

  _answerSlots.forEach((id, idx) => {
    const item = _bankWords.find(w => w.id === id);
    if (!item) return;
    const chip = document.createElement('button');
    chip.className = 'sfq-answer-chip';
    chip.textContent = item.word;
    chip.setAttribute('aria-label', `Remove ${item.word}`);
    chip.addEventListener('click', () => {
      // Return word to bank
      item.used = false;
      _answerSlots.splice(idx, 1);
      _renderBank();
      _renderAnswer();
    });
    area.appendChild(chip);
  });
}

// ── Checking ───────────────────────────────────────────────────────────────

function _checkAnswer(entry, punct) {
  if (_answerSlots.length === 0) {
    _showFeedback('Build your sentence first! 🔨', false);
    return;
  }

  const constructed = _answerSlots.map(id => _bankWords.find(w => w.id === id)?.word || '').join(' ') + punct;
  const correct     = constructed === entry.sentence;

  _sessionTotal++;

  if (correct) {
    _sessionCorrect++;
    questMastery.recordAttempt({
      quest: 'sentenceForge',
      skill: 'word_order',
      correct: true,
      responseMs: 1200,
      level: _currentLevel,
    });
    questMastery.updateSkill('sentenceForge', 'word_order', true);
    gamification.recordCorrect(1200, false);
    celebrateCorrect();
    audio.playSfx('correct');

    // Track per-level progress
    const completed = store.get('sfqCompleted') || {};
    completed[_currentLevel] = (completed[_currentLevel] || 0) + 1;
    store.set('sfqCompleted', completed);

    _showFeedback('✅ Perfect! Well done!', true);
    setTimeout(() => {
      _sentenceIdx++;
      _showSentence();
    }, 1500);
  } else {
    questMastery.recordAttempt({
      quest: 'sentenceForge',
      skill: 'word_order',
      correct: false,
      responseMs: 1200,
      level: _currentLevel,
    });
    questMastery.updateSkill('sentenceForge', 'word_order', false);
    audio.playSfx('wrong');
    _showFeedback('❌ Not quite – try rearranging!', false);
    const area = document.getElementById('sfq-answer-area');
    area?.classList.remove('sfq-shake');
    void area?.offsetWidth;
    area?.classList.add('sfq-shake');
    setTimeout(() => area?.classList.remove('sfq-shake'), 500);
  }
}

function _showFeedback(msg, success) {
  const el = document.getElementById('sfq-feedback');
  if (!el) return;
  el.textContent = msg;
  el.className = `sfq-feedback sfq-feedback--${success ? 'success' : 'error'}`;
  el.hidden = false;
  if (success) setTimeout(() => { el.hidden = true; }, 1400);
}

// ── Complete screen ────────────────────────────────────────────────────────

function _showComplete() {
  if (!_container) return;

  const acc   = _sessionTotal > 0 ? Math.round((_sessionCorrect / _sessionTotal) * 100) : 0;
  const stars = acc >= 90 ? 3 : acc >= 70 ? 2 : 1;
  const icon  = SENTENCE_LEVEL_ICONS[_currentLevel - 1];

  celebrateCorrect();
  audio.playSfx('levelUp');

  _container.innerHTML = `
    <div class="sfq-complete">
      <div class="sfq-complete-icon">${icon}</div>
      <h3 class="sfq-complete-title">Level Complete!</h3>
      <p class="sfq-complete-sub">${SENTENCE_LEVEL_LABELS[_currentLevel]}</p>
      <div class="sfq-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="sfq-complete-score">${_sessionCorrect} / ${_sessionTotal} correct · ${acc}%</p>
      <div class="sfq-complete-actions">
        <button class="btn btn--primary btn--lg" id="sfq-next-level">
          ${_currentLevel < 6 ? 'Next Level →' : 'Back to Levels'}
        </button>
        <button class="btn btn--ghost btn--sm" id="sfq-replay">Play Again ↺</button>
        <button class="btn btn--ghost btn--sm" id="sfq-back-levels">All Levels</button>
      </div>
    </div>`;

  document.getElementById('sfq-next-level')?.addEventListener('click', () => {
    if (_currentLevel < 6) { _currentLevel++; _startLevel(_currentLevel); }
    else _renderBrowser();
  });
  document.getElementById('sfq-replay')?.addEventListener('click', () => _startLevel(_currentLevel));
  document.getElementById('sfq-back-levels')?.addEventListener('click', () => _renderBrowser());
}
