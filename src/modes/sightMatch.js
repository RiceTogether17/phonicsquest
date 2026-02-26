/**
 * PhonicsQuest – Sight Word Match
 *
 * A card-flip memory matching game for Dolch/Fry sight words.
 * Each quest has 5 word pairs (10 cards). Flip two at a time;
 * matched pairs stay face-up. Complete all 5 pairs to win.
 *
 * Public API:
 *   initSightMatch(container, onGoHome) – attach to DOM container
 *   showSightBrowser()                  – render quest picker
 *   cleanupSightMatch()                 – remove event listeners
 */

import { SIGHT_QUESTS, TIER_LABELS, getQuestsByTier } from '../data/sightwords.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';

// ── Module state ───────────────────────────────────────────────────────────

let _container = null;
let _onGoHome  = null;

let _activeQuest   = null;  // current SIGHT_QUESTS entry
let _flipped       = [];    // indices of currently face-up (unmatched) cards
let _matched       = new Set(); // indices of matched cards
let _busy          = false; // prevents double-flip during delay
let _moveCount     = 0;

// ── Public API ─────────────────────────────────────────────────────────────

export function initSightMatch(container, onGoHome) {
  _container = container;
  _onGoHome  = onGoHome;
}

export function showSightBrowser() {
  _activeQuest = null;
  _renderBrowser();
}

export function cleanupSightMatch() {
  if (_container) _container.innerHTML = '';
  _activeQuest = null;
  _flipped = [];
  _matched = new Set();
  _busy = false;
}

// ── Browser (quest picker) ─────────────────────────────────────────────────

function _renderBrowser() {
  if (!_container) return;

  const completedQuests = store.get('sightQuestsCompleted') || {};

  const tiers = ['easy', 'medium', 'hard'];
  let html = '<div class="sm-browser">';

  for (const tier of tiers) {
    const meta   = TIER_LABELS[tier];
    const quests = getQuestsByTier(tier);

    html += `
      <div class="sm-tier">
        <div class="sm-tier-header">
          <span class="sm-tier-icon">${meta.icon}</span>
          <div>
            <div class="sm-tier-label" style="color:${meta.color}">${meta.label}</div>
            <div class="sm-tier-desc">${meta.desc}</div>
          </div>
        </div>
        <div class="sm-quest-grid">`;

    for (const quest of quests) {
      const done = completedQuests[quest.id];
      html += `
        <button class="sm-quest-btn ${done ? 'sm-quest-btn--done' : ''}"
                data-quest="${quest.id}"
                aria-label="${quest.name} – ${quest.words.join(', ')}${done ? ' – completed' : ''}">
          <span class="sm-quest-icon">${done ? '✅' : quest.icon}</span>
          <span class="sm-quest-name">${quest.name}</span>
          <span class="sm-quest-preview">${quest.words.slice(0, 3).join(' · ')}…</span>
        </button>`;
    }

    html += '</div></div>';
  }

  html += '</div>';
  _container.innerHTML = html;

  _container.querySelectorAll('.sm-quest-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const quest = SIGHT_QUESTS.find(q => q.id === btn.dataset.quest);
      if (quest) _startQuest(quest);
    });
  });
}

// ── Game ───────────────────────────────────────────────────────────────────

function _startQuest(quest) {
  _activeQuest = quest;
  _flipped   = [];
  _matched   = new Set();
  _busy      = false;
  _moveCount = 0;

  // Build 10 cards: each word appears twice (as 'A' and 'B' pair)
  const cards = [];
  quest.words.forEach((word, i) => {
    cards.push({ word, pairId: i, cardId: i * 2     });
    cards.push({ word, pairId: i, cardId: i * 2 + 1 });
  });

  // Shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  _renderGame(quest, cards);
}

function _renderGame(quest, cards) {
  if (!_container) return;

  let html = `
    <div class="sm-game" id="sm-game">
      <div class="sm-game-header">
        <div class="sm-game-title">${quest.icon} ${quest.name}</div>
        <div class="sm-game-words">Words: ${quest.words.join(' · ')}</div>
        <div class="sm-progress" id="sm-progress">Matches: 0 / ${quest.words.length}</div>
      </div>

      <div class="sm-card-grid" id="sm-card-grid" role="grid" aria-label="Matching cards">`;

  cards.forEach((card, idx) => {
    html += `
        <div class="sm-card" data-idx="${idx}" data-pair="${card.pairId}" data-word="${card.word}"
             role="gridcell" tabindex="0" aria-label="Card ${idx + 1}, face down">
          <div class="sm-card-inner">
            <div class="sm-card-front" aria-hidden="true">⭐</div>
            <div class="sm-card-back">${card.word}</div>
          </div>
        </div>`;
  });

  html += `
      </div>

      <div class="sm-game-actions">
        <button class="btn btn--ghost btn--sm" id="sm-btn-back-to-quests">← Quests</button>
        <span class="sm-moves" id="sm-moves">Moves: 0</span>
        <button class="btn btn--ghost btn--sm" id="sm-btn-quit">Menu</button>
      </div>
    </div>`;

  _container.innerHTML = html;

  // Bind card clicks
  _container.querySelectorAll('.sm-card').forEach(card => {
    card.addEventListener('click', () => _onCardClick(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        _onCardClick(card);
      }
    });
  });

  document.getElementById('sm-btn-back-to-quests')?.addEventListener('click', () => {
    showSightBrowser();
  });

  document.getElementById('sm-btn-quit')?.addEventListener('click', () => {
    cleanupSightMatch();
    _onGoHome?.();
  });
}

function _onCardClick(cardEl) {
  if (_busy) return;

  const idx = parseInt(cardEl.dataset.idx);
  if (_matched.has(idx)) return;          // already matched
  if (_flipped.includes(idx)) return;     // already face-up

  // Flip this card
  cardEl.classList.add('sm-card--flipped');
  cardEl.setAttribute('aria-label', `Card – ${cardEl.dataset.word}`);
  audio.playSfx('pop');
  _flipped.push(idx);

  if (_flipped.length < 2) return;

  // Two cards face-up — check for match
  _busy = true;
  _moveCount++;
  const movesEl = document.getElementById('sm-moves');
  if (movesEl) movesEl.textContent = `Moves: ${_moveCount}`;

  const [idxA, idxB] = _flipped;
  const cardA = _container.querySelector(`.sm-card[data-idx="${idxA}"]`);
  const cardB = _container.querySelector(`.sm-card[data-idx="${idxB}"]`);

  if (cardA?.dataset.pair === cardB?.dataset.pair) {
    // Match!
    setTimeout(() => {
      cardA?.classList.add('sm-card--matched');
      cardB?.classList.add('sm-card--matched');
      cardA?.setAttribute('aria-label', `${cardA.dataset.word} – matched`);
      cardB?.setAttribute('aria-label', `${cardB.dataset.word} – matched`);
      _matched.add(idxA);
      _matched.add(idxB);
      _flipped = [];
      _busy = false;
      audio.playSfx('correct');

      const matchCount = _matched.size / 2;
      const progressEl = document.getElementById('sm-progress');
      if (progressEl) progressEl.textContent = `Matches: ${matchCount} / ${_activeQuest.words.length}`;

      if (_matched.size === _activeQuest.words.length * 2) {
        _onQuestComplete();
      }
    }, 400);
  } else {
    // No match — flip back after delay
    setTimeout(() => {
      cardA?.classList.remove('sm-card--flipped');
      cardB?.classList.remove('sm-card--flipped');
      cardA?.setAttribute('aria-label', `Card, face down`);
      cardB?.setAttribute('aria-label', `Card, face down`);
      _flipped = [];
      _busy = false;
      audio.playSfx('wrong');
    }, 900);
  }
}

function _onQuestComplete() {
  // Save completion
  const completed = store.get('sightQuestsCompleted') || {};
  completed[_activeQuest.id] = true;
  store.set('sightQuestsCompleted', completed);

  // Show celebration overlay
  const game = document.getElementById('sm-game');
  if (!game) return;

  const overlay = document.createElement('div');
  overlay.className = 'sm-complete-overlay';
  overlay.innerHTML = `
    <div class="sm-complete-panel">
      <div class="sm-complete-emoji">🎉</div>
      <h3 class="sm-complete-title">Quest Complete!</h3>
      <p class="sm-complete-sub">You matched all ${_activeQuest.words.length} sight words</p>
      <p class="sm-complete-moves">in ${_moveCount} moves</p>
      <div class="sm-complete-words">
        ${_activeQuest.words.map(w => `<span class="sm-word-chip">${w}</span>`).join('')}
      </div>
      <div class="sm-complete-actions">
        <button class="btn btn--primary" id="sm-btn-next-quest">Next Quest →</button>
        <button class="btn btn--ghost btn--sm" id="sm-btn-replay">Play Again</button>
      </div>
    </div>`;
  game.appendChild(overlay);

  audio.playSfx('levelUp');

  document.getElementById('sm-btn-next-quest')?.addEventListener('click', () => {
    const currentIdx = SIGHT_QUESTS.findIndex(q => q.id === _activeQuest.id);
    const next = SIGHT_QUESTS[currentIdx + 1];
    if (next) {
      _startQuest(next);
    } else {
      showSightBrowser();
    }
  });

  document.getElementById('sm-btn-replay')?.addEventListener('click', () => {
    _startQuest(_activeQuest);
  });
}
