/**
 * PhonicsQuest – Sight Word Learn (Study Mode)
 *
 * A gentle, explicit introduction to a quest's 5 sight words BEFORE the
 * child plays the matching card game (`sightMatch.js`).
 *
 * Flow inside the screen:
 *   1. Discover  – tap each word card to hear it; "Practiced" badge appears.
 *   2. Quick Recall (unlocks once all 5 are practiced) – hear a word, tap
 *      the correct card. 3 rounds, no penalty, big celebration on finish.
 *
 * Progress is persisted via the existing `store` module under the key
 * `sightQuestsStudied` (object: { [questId]: true }). Reading from this
 * key elsewhere is tolerant of missing entries (treated as "Not started").
 *
 * Public API:
 *   initSightLearn(container, handlers) – attach to DOM container.
 *     handlers = { onGoHome?, onBackToBrowser?, onStartMatch? }
 *   showSightLearn(quest)               – render learn screen for a quest.
 *   cleanupSightLearn()                 – tear down listeners + state.
 */

import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';

// ── Module state ───────────────────────────────────────────────────────────

let _container = null;
/** @type {{ onGoHome?: () => void, onBackToBrowser?: () => void, onStartMatch?: (quest: object) => void }} */
let _handlers  = {};

let _activeQuest    = null;   // current SIGHT_QUESTS entry
let _displayWords   = [];     // possibly-shuffled copy of quest.words
let _practiced      = new Set(); // words the child has tapped to hear
let _autoPlaying    = false;  // "Listen to all" sequence in flight
let _autoplayAbort  = false;  // signal to stop "Listen to all"

// Quick Recall state
let _quizActive     = false;
let _quizRound      = 0;
let _quizTotal      = 3;
let _quizCorrect    = 0;
let _quizTarget     = null;   // current target word
let _quizChoices    = [];     // word choices on screen
let _quizBusy       = false;  // prevents double-clicks during feedback

// ── Public API ─────────────────────────────────────────────────────────────

export function initSightLearn(container, handlers = {}) {
  _container = container;
  _handlers  = handlers || {};
}

export function showSightLearn(quest) {
  if (!quest) return;
  _activeQuest  = quest;
  _displayWords = [...quest.words];
  _practiced    = new Set();
  _autoPlaying  = false;
  _autoplayAbort = false;
  _quizActive   = false;
  _quizRound    = 0;
  _quizCorrect  = 0;
  _renderLearn();
}

export function cleanupSightLearn() {
  _autoplayAbort = true;
  _autoPlaying   = false;
  _quizActive    = false;
  if (_container) _container.innerHTML = '';
  _activeQuest   = null;
  _practiced     = new Set();
  // intentionally keep _handlers around in case the screen is re-entered;
  // they're replaced on next initSightLearn() anyway.
}

// ── Main learn screen ──────────────────────────────────────────────────────

function _renderLearn() {
  if (!_container || !_activeQuest) return;

  const quest = _activeQuest;
  const studied = _isStudied(quest.id);

  const html = `
    <div class="sl-learn" id="sl-learn">
      <header class="sl-header">
        <div class="sl-header-row">
          <span class="sl-quest-icon" aria-hidden="true">${quest.icon}</span>
          <h3 class="sl-quest-title">${quest.name}</h3>
          ${studied ? '<span class="sl-studied-pill" aria-label="Already studied">📖 Studied</span>' : ''}
        </div>
        <p class="sl-hello">
          Hi friend! Let's meet ${quest.words.length} new sight words.
          Tap each card to hear it. You can listen as many times as you like!
        </p>
      </header>

      <div class="sl-toolbar" role="group" aria-label="Practice controls">
        <button class="btn btn--ghost btn--sm sl-tool-btn" id="sl-btn-listen-all"
                aria-label="Listen to all five words in order">
          <span aria-hidden="true">📢</span> Listen to all
        </button>
        <button class="btn btn--ghost btn--sm sl-tool-btn" id="sl-btn-shuffle"
                aria-label="Shuffle the order of the word cards">
          <span aria-hidden="true">🔀</span> Shuffle
        </button>
        <span class="sl-progress" id="sl-progress" aria-live="polite">
          Practiced <strong id="sl-progress-count">0</strong> / ${quest.words.length} words
        </span>
      </div>

      <div class="sl-card-grid" id="sl-card-grid" role="list"
           aria-label="Sight words to practise">
        ${_displayWords.map((w, i) => _renderWordCard(w, i)).join('')}
      </div>

      <div class="sl-recall" id="sl-recall" hidden aria-live="polite"></div>

      <div class="sl-bottom-actions">
        <button class="btn btn--ghost btn--sm" id="sl-btn-back-to-quests"
                aria-label="Back to the quest list">
          ← Quests
        </button>
        <button class="btn btn--ghost btn--sm" id="sl-btn-practiced"
                aria-label="Mark this quest as practised">
          ✅ I've practised these words!
        </button>
        <button class="btn btn--primary sl-btn-play" id="sl-btn-play-match"
                aria-label="Start the matching card game for this quest">
          🃏 Ready to play the matching game?
        </button>
      </div>
    </div>
  `;

  _container.innerHTML = html;

  // Word card taps
  _container.querySelectorAll('.sl-word-card').forEach(card => {
    card.addEventListener('click', () => _onWordCardTap(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        _onWordCardTap(card);
      }
    });
  });

  document.getElementById('sl-btn-listen-all')?.addEventListener('click', _listenToAll);
  document.getElementById('sl-btn-shuffle')?.addEventListener('click', _shuffleWords);

  document.getElementById('sl-btn-back-to-quests')?.addEventListener('click', () => {
    _autoplayAbort = true;
    _handlers.onBackToBrowser?.();
  });

  document.getElementById('sl-btn-practiced')?.addEventListener('click', () => {
    _markStudied();
    _showToastInside('Great job! Your progress is saved 🌟');
    audio.playSfx('correct');
    _renderLearn(); // re-render to show "Studied" pill
  });

  document.getElementById('sl-btn-play-match')?.addEventListener('click', () => {
    _autoplayAbort = true;
    // Reaching the matching game implies the child has at least met the
    // words, so we record it as studied for nicer browser badges.
    _markStudied();
    _handlers.onStartMatch?.(_activeQuest);
  });
}

function _renderWordCard(word, index) {
  const isPracticed = _practiced.has(word);
  const safe = _escape(word);
  return `
    <div class="sl-word-card ${isPracticed ? 'sl-word-card--practiced' : ''}"
         data-word="${safe}" data-index="${index}"
         role="listitem"
         tabindex="0"
         aria-label="Sight word ${safe}${isPracticed ? ', practised' : ''}, tap to hear it">
      <span class="sl-word-check" aria-hidden="true">${isPracticed ? '✓' : ''}</span>
      <span class="sl-word-text">${safe}</span>
      <span class="sl-word-hear" aria-hidden="true">
        <span class="sl-speaker-icon">🔊</span>
        <span class="sl-hear-label">Hear</span>
      </span>
    </div>
  `;
}

// ── Interactions ───────────────────────────────────────────────────────────

function _onWordCardTap(cardEl) {
  if (_quizActive) return; // ignore taps on cards while quiz is active
  const word = cardEl.dataset.word;
  if (!word) return;

  // Visual feedback: pop + glow
  cardEl.classList.remove('sl-word-card--pop');
  // force reflow so the animation re-triggers on rapid taps
  void cardEl.offsetWidth;
  cardEl.classList.add('sl-word-card--pop');

  audio.playSfx('pop');
  audio.speakWord(word);

  if (!_practiced.has(word)) {
    _practiced.add(word);
    cardEl.classList.add('sl-word-card--practiced');
    const check = cardEl.querySelector('.sl-word-check');
    if (check) check.textContent = '✓';
    cardEl.setAttribute(
      'aria-label',
      `Sight word ${word}, practised, tap to hear it again`,
    );
    _updateProgress();
    _maybeUnlockRecall();
  }
}

function _updateProgress() {
  const el = document.getElementById('sl-progress-count');
  if (el) el.textContent = String(_practiced.size);
}

async function _listenToAll() {
  if (!_activeQuest || _autoPlaying) return;
  _autoPlaying = true;
  _autoplayAbort = false;

  const btn = document.getElementById('sl-btn-listen-all');
  if (btn) {
    btn.setAttribute('disabled', '');
    btn.classList.add('sl-tool-btn--busy');
  }

  for (const word of _displayWords) {
    if (_autoplayAbort) break;
    const cardEl = _container?.querySelector(
      `.sl-word-card[data-word="${_attrEscape(word)}"]`,
    );
    cardEl?.classList.add('sl-word-card--highlight');
    audio.playSfx('pop');
    audio.speakWord(word);

    if (!_practiced.has(word)) {
      _practiced.add(word);
      cardEl?.classList.add('sl-word-card--practiced');
      const check = cardEl?.querySelector('.sl-word-check');
      if (check) check.textContent = '✓';
      _updateProgress();
    }

    await _delay(900);
    cardEl?.classList.remove('sl-word-card--highlight');
    await _delay(150);
  }

  _autoPlaying = false;
  if (btn) {
    btn.removeAttribute('disabled');
    btn.classList.remove('sl-tool-btn--busy');
  }
  _maybeUnlockRecall();
}

function _shuffleWords() {
  if (!_activeQuest) return;
  // Fisher-Yates shuffle; ensure at least one position changes when possible.
  const next = [..._displayWords];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  _displayWords = next;

  const grid = document.getElementById('sl-card-grid');
  if (!grid) return;
  grid.classList.add('sl-card-grid--shuffling');
  grid.innerHTML = _displayWords.map((w, i) => _renderWordCard(w, i)).join('');
  // re-bind handlers on the new card nodes
  grid.querySelectorAll('.sl-word-card').forEach(card => {
    card.addEventListener('click', () => _onWordCardTap(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        _onWordCardTap(card);
      }
    });
  });
  audio.playSfx('spin');
  setTimeout(() => grid.classList.remove('sl-card-grid--shuffling'), 350);
}

// ── Quick Recall (unlocks after every word has been practised) ─────────────

function _maybeUnlockRecall() {
  if (!_activeQuest) return;
  if (_practiced.size < _activeQuest.words.length) return;
  if (_quizActive) return;
  _renderRecallTeaser();
}

function _renderRecallTeaser() {
  const panel = document.getElementById('sl-recall');
  if (!panel) return;
  panel.hidden = false;
  panel.innerHTML = `
    <div class="sl-recall-card sl-recall-card--teaser">
      <div class="sl-recall-emoji" aria-hidden="true">🎯</div>
      <div class="sl-recall-copy">
        <div class="sl-recall-title">Nice — you've met every word!</div>
        <div class="sl-recall-sub">Try a quick check: hear a word, tap the right card.</div>
      </div>
      <button class="btn btn--primary btn--sm" id="sl-btn-start-quiz"
              aria-label="Start a quick three-question check">
        Start quick check
      </button>
    </div>
  `;
  document.getElementById('sl-btn-start-quiz')?.addEventListener('click', _startQuiz);
}

function _startQuiz() {
  _quizActive = true;
  _quizRound = 0;
  _quizCorrect = 0;
  _quizBusy = false;
  audio.playSfx('reveal');
  _nextQuizRound();
}

function _nextQuizRound() {
  if (!_activeQuest) return;
  if (_quizRound >= _quizTotal) {
    _finishQuiz();
    return;
  }
  _quizRound++;
  // Pick a target the child has practised (all words by this point).
  const words = _activeQuest.words;
  _quizTarget = words[Math.floor(Math.random() * words.length)];

  // Show up to 4 choices including the target, in random order.
  const pool = [...words];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  _quizChoices = pool.slice(0, Math.min(4, pool.length));
  if (!_quizChoices.includes(_quizTarget)) {
    _quizChoices[0] = _quizTarget;
    // Re-shuffle to avoid the target always being first
    for (let i = _quizChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [_quizChoices[i], _quizChoices[j]] = [_quizChoices[j], _quizChoices[i]];
    }
  }

  _renderQuizRound();
}

function _renderQuizRound() {
  const panel = document.getElementById('sl-recall');
  if (!panel) return;
  panel.innerHTML = `
    <div class="sl-recall-card sl-recall-card--quiz" role="group"
         aria-label="Quick check round ${_quizRound} of ${_quizTotal}">
      <div class="sl-quiz-head">
        <span class="sl-quiz-step">Quick check ${_quizRound} / ${_quizTotal}</span>
        <button class="btn btn--ghost btn--sm" id="sl-btn-quiz-hear"
                aria-label="Hear the word again">
          🔊 Hear it again
        </button>
      </div>
      <p class="sl-quiz-prompt">Tap the word you hear.</p>
      <div class="sl-quiz-choices" role="list">
        ${_quizChoices.map(w => `
          <button class="sl-quiz-choice" type="button"
                  data-word="${_escape(w)}"
                  aria-label="Choice ${_escape(w)}">
            ${_escape(w)}
          </button>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById('sl-btn-quiz-hear')?.addEventListener('click', () => {
    if (_quizTarget) audio.speakWord(_quizTarget);
  });

  panel.querySelectorAll('.sl-quiz-choice').forEach(btn => {
    btn.addEventListener('click', () => _onQuizChoice(btn));
  });

  // Speak target after a short beat so the UI is rendered first.
  setTimeout(() => { if (_quizTarget) audio.speakWord(_quizTarget); }, 250);
}

function _onQuizChoice(btn) {
  if (_quizBusy) return;
  const word = btn.dataset.word;
  if (!word) return;
  _quizBusy = true;

  if (word === _quizTarget) {
    btn.classList.add('sl-quiz-choice--correct');
    _quizCorrect++;
    audio.playSfx('correct');
    setTimeout(() => {
      _quizBusy = false;
      _nextQuizRound();
    }, 700);
  } else {
    btn.classList.add('sl-quiz-choice--wrong');
    btn.setAttribute('disabled', '');
    audio.playSfx('wrong');
    // Highlight the correct one so it's a learning moment, not a punishment.
    const panel = document.getElementById('sl-recall');
    const correctBtn = panel?.querySelector(
      `.sl-quiz-choice[data-word="${_attrEscape(_quizTarget)}"]`,
    );
    correctBtn?.classList.add('sl-quiz-choice--hint');
    setTimeout(() => {
      _quizBusy = false;
      _nextQuizRound();
    }, 1100);
  }
}

function _finishQuiz() {
  _quizActive = false;
  _markStudied();
  audio.playSfx('levelUp');

  const panel = document.getElementById('sl-recall');
  if (!panel) return;
  const allRight = _quizCorrect === _quizTotal;
  panel.innerHTML = `
    <div class="sl-recall-card sl-recall-card--done">
      <div class="sl-recall-emoji" aria-hidden="true">${allRight ? '🎉' : '🌟'}</div>
      <div class="sl-recall-copy">
        <div class="sl-recall-title">
          ${allRight ? 'Perfect! You got them all!' : 'Nice work!'}
        </div>
        <div class="sl-recall-sub">
          You got ${_quizCorrect} out of ${_quizTotal} right.
          You're ready for the matching game!
        </div>
      </div>
      <div class="sl-recall-actions">
        <button class="btn btn--ghost btn--sm" id="sl-btn-quiz-retry"
                aria-label="Try the quick check again">
          🔁 Try again
        </button>
        <button class="btn btn--primary btn--sm" id="sl-btn-quiz-to-match"
                aria-label="Play the matching game now">
          🃏 Play matching game
        </button>
      </div>
    </div>
  `;

  document.getElementById('sl-btn-quiz-retry')?.addEventListener('click', _startQuiz);
  document.getElementById('sl-btn-quiz-to-match')?.addEventListener('click', () => {
    _handlers.onStartMatch?.(_activeQuest);
  });
}

// ── Progress persistence ───────────────────────────────────────────────────

function _markStudied() {
  if (!_activeQuest) return;
  const studied = store.get('sightQuestsStudied') || {};
  if (!studied[_activeQuest.id]) {
    studied[_activeQuest.id] = true;
    store.set('sightQuestsStudied', studied);
  }
}

function _isStudied(questId) {
  const studied = store.get('sightQuestsStudied') || {};
  return Boolean(studied[questId]);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Escapes content for use inside element text or attribute values.
function _escape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escapes a string for use inside an attribute selector (e.g. data-word="…").
// Sight word data contains apostrophes like "don't" / "I'll".
function _attrEscape(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function _showToastInside(message) {
  if (!_container) return;
  const toast = document.createElement('div');
  toast.className = 'sl-inline-toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  _container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('sl-inline-toast--leave');
    setTimeout(() => toast.remove(), 350);
  }, 1800);
}
