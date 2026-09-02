/**
 * PhonicsQuest – Spell-It Drill (Look, Say, Cover, Write, Check)
 *
 * Five-stage spelling routine drawn from classic structured-literacy practice:
 *   1. Look   – word is shown large, pronounced; child studies every letter.
 *   2. Say    – child says the word aloud (audio replays as a prompt).
 *   3. Cover  – the word fades; child holds it in mind.
 *   4. Write  – child reconstructs the word, either by typing on the keyboard
 *               or by tapping letters from a shuffled letter bank.
 *   5. Check  – the typed answer is compared letter-by-letter; correct
 *               letters celebrate, wrong letters get flagged so the child
 *               can try again or move on.
 *
 * Public API:
 *   startLscwcDrill(container, words, { onDone, onCancel })
 *     – Renders the drill into `container` (a DOM node, usually the existing
 *       Sight Learn recall panel) and walks the child through every word.
 *     – `onDone(summary)`  fires after the last word's Check stage. Summary
 *       shape: { totalWords, correctFirstTry, attempts }.
 *     – `onCancel()`        fires if the child taps the panel's close link.
 *   cleanupLscwcDrill() – tears down listeners and state.
 *
 * Persistence:
 *   localStorage 'lscwc_stats' → { [word]: { attempts, correct, lastTs } }
 *     Capped at 200 distinct words (oldest by lastTs dropped on next write).
 *   localStorage 'lscwc_input_mode' → 'type' | 'tap'
 *     Per-child preference, persisted across sessions.
 */

import { audio } from '../modules/audio.js';

// ── Persistence keys ──────────────────────────────────────────────────────

const STATS_KEY = 'lscwc_stats';
const INPUT_MODE_KEY = 'lscwc_input_mode';
const STATS_CAP = 200;

// ── Module state ──────────────────────────────────────────────────────────

let _container = null;
/** @type {string[]} */
let _words = [];
let _wordIdx = 0;
/** @type {'look'|'say'|'cover'|'write'|'check'} */
let _stage = 'look';
let _typed = '';
/** @type {string[]} – shuffled letter bank for tap mode (current word) */
let _bank = [];
/** @type {boolean[]} – which bank slots are consumed (true = already tapped) */
let _bankUsed = [];
/** @type {'type'|'tap'} */
let _inputMode = _loadInputMode();
let _onDone = null;
let _onCancel = null;
let _coverTimer = null;
/** Stage transitions per word — used by the completion summary. */
let _attemptsThisWord = 0;
let _correctFirstTry = 0;

// ── Public API ────────────────────────────────────────────────────────────

export function startLscwcDrill(container, words, { onDone, onCancel } = {}) {
  cleanupLscwcDrill();
  _container = container;
  _words = (words || []).map((w) => String(w).trim()).filter(Boolean);
  _wordIdx = 0;
  _stage = 'look';
  _typed = '';
  _onDone = onDone;
  _onCancel = onCancel;
  _attemptsThisWord = 0;
  _correctFirstTry = 0;

  if (!_container || _words.length === 0) {
    _onDone?.({ totalWords: 0, correctFirstTry: 0, attempts: 0 });
    return;
  }
  _resetBankFor(_currentWord());
  _renderCurrent();
}

export function cleanupLscwcDrill() {
  if (_coverTimer) {
    clearTimeout(_coverTimer);
    _coverTimer = null;
  }
  _container = null;
  _words = [];
  _wordIdx = 0;
  _typed = '';
  _bank = [];
  _bankUsed = [];
  _onDone = null;
  _onCancel = null;
}

// ── Helpers exported for tests ────────────────────────────────────────────

/**
 * Validate that `letter` is the next correct character of `target` given
 * how many letters have already been typed. Case-insensitive.
 * Returns 'correct' or 'wrong'.
 */
export function _validateLetter(target, typedSoFar, letter) {
  if (typeof target !== 'string' || typeof typedSoFar !== 'string' || typeof letter !== 'string') {
    return 'wrong';
  }
  if (typedSoFar.length >= target.length) return 'wrong';
  const expected = target[typedSoFar.length].toLowerCase();
  return expected === letter.toLowerCase() ? 'correct' : 'wrong';
}

/** Fisher-Yates shuffle of a word's letters. Pure: returns a new array. */
export function _shuffleLetters(word, rng = Math.random) {
  const letters = [...String(word).toLowerCase()];
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters;
}

/** Append a single attempt for `word` to the stats log. */
export function _logAttempt(word, correct) {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    const stats = raw ? JSON.parse(raw) : {};
    const key = String(word).toLowerCase();
    if (!stats[key]) stats[key] = { attempts: 0, correct: 0, lastTs: 0 };
    stats[key].attempts++;
    if (correct) stats[key].correct++;
    stats[key].lastTs = Date.now();

    // Cap the number of distinct words tracked (drop oldest by lastTs).
    const keys = Object.keys(stats);
    if (keys.length > STATS_CAP) {
      const sorted = keys.map((k) => ({ k, ts: stats[k].lastTs ?? 0 })).sort((a, b) => a.ts - b.ts);
      const dropCount = keys.length - STATS_CAP;
      for (let i = 0; i < dropCount; i++) delete stats[sorted[i].k];
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {}
}

export function _readStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ── Internal: state transitions + rendering ───────────────────────────────

function _currentWord() {
  return _words[_wordIdx] ?? '';
}

function _resetBankFor(word) {
  _bank = _shuffleLetters(word);
  _bankUsed = _bank.map(() => false);
  _typed = '';
}

function _loadInputMode() {
  try {
    const raw = localStorage.getItem(INPUT_MODE_KEY);
    return raw === 'tap' ? 'tap' : 'type';
  } catch {
    return 'type';
  }
}

function _persistInputMode() {
  try {
    localStorage.setItem(INPUT_MODE_KEY, _inputMode);
  } catch {}
}

function _renderCurrent() {
  if (!_container) return;
  const total = _words.length;
  const wordOrdinal = Math.min(_wordIdx + 1, total);

  // Stage progress dots — Check is rendered as the final pip too.
  const stages = ['look', 'say', 'cover', 'write', 'check'];
  const stageLabels = { look: 'Look', say: 'Say', cover: 'Cover', write: 'Write', check: 'Check' };
  const dotsHtml = stages
    .map((s) => {
      const idx = stages.indexOf(s);
      const cur = stages.indexOf(_stage);
      const cls = idx < cur ? 'done' : idx === cur ? 'active' : '';
      return `<li class="lscwc-dot ${cls}" data-stage="${s}">${stageLabels[s]}</li>`;
    })
    .join('');

  const bodyHtml = _renderStage(_currentWord());

  _container.innerHTML = /* html */ `
    <div class="lscwc-panel" role="region" aria-label="Spell-It drill">
      <header class="lscwc-header">
        <div class="lscwc-progress" aria-live="polite">
          Word <strong>${wordOrdinal}</strong> of ${total}
        </div>
        <ol class="lscwc-dots" aria-label="Stages">${dotsHtml}</ol>
        <button class="lscwc-close" id="lscwc-close" type="button"
                aria-label="Close drill">✕</button>
      </header>
      <div class="lscwc-body">${bodyHtml}</div>
    </div>
  `;

  _container.querySelector('#lscwc-close')?.addEventListener('click', () => {
    cleanupLscwcDrill();
    _onCancel?.();
  });

  _wireStage(_currentWord());
}

function _renderStage(word) {
  switch (_stage) {
    case 'look':
      return _renderLook(word);
    case 'say':
      return _renderSay(word);
    case 'cover':
      return _renderCover(word);
    case 'write':
      return _renderWrite(word);
    case 'check':
      return _renderCheck(word);
    default:
      return '';
  }
}

function _renderLook(word) {
  return /* html */ `
    <div class="lscwc-stage lscwc-look">
      <h3 class="lscwc-stage-title">👀 Look</h3>
      <p class="lscwc-stage-hint">Look at every letter and listen.</p>
      <div class="lscwc-word lscwc-word--look">${_wordLetters(word)}</div>
      <div class="lscwc-actions">
        <button class="btn btn--ghost" id="lscwc-replay" type="button"
                aria-label="Hear the word again">🔊 Hear it again</button>
        <button class="btn btn--primary" id="lscwc-next-stage" type="button">
          Next →
        </button>
      </div>
    </div>
  `;
}

function _renderSay(word) {
  return /* html */ `
    <div class="lscwc-stage lscwc-say">
      <h3 class="lscwc-stage-title">🗣️ Say</h3>
      <p class="lscwc-stage-hint">Say the word out loud. You can whisper if you like.</p>
      <div class="lscwc-word lscwc-word--say">${_wordLetters(word)}</div>
      <div class="lscwc-actions">
        <button class="btn btn--ghost" id="lscwc-replay" type="button"
                aria-label="Hear the word again">🔊 Hear it again</button>
        <button class="btn btn--primary" id="lscwc-next-stage" type="button">
          I said it →
        </button>
      </div>
    </div>
  `;
}

function _renderCover(word) {
  // Word starts visible and fades to invisible via CSS animation.
  return /* html */ `
    <div class="lscwc-stage lscwc-cover">
      <h3 class="lscwc-stage-title">🫥 Cover</h3>
      <p class="lscwc-stage-hint">Picture the word in your mind…</p>
      <div class="lscwc-word lscwc-word--cover" id="lscwc-cover-word">
        ${_wordLetters(word)}
      </div>
      <div class="lscwc-actions">
        <button class="btn btn--primary" id="lscwc-next-stage" type="button" disabled>
          Ready to write →
        </button>
      </div>
    </div>
  `;
}

function _renderWrite(word) {
  // Empty slots — one per letter of target.
  const slotsHtml = word
    .split('')
    .map(
      (_, i) => /* html */ `
    <span class="lscwc-slot" data-slot-idx="${i}" aria-hidden="true"></span>
  `,
    )
    .join('');

  const bankHtml = _bank
    .map(
      (ltr, i) => /* html */ `
    <button class="lscwc-bank-tile" data-bank-idx="${i}" type="button"
            aria-label="Letter ${ltr}" ${_bankUsed[i] ? 'disabled' : ''}>
      ${ltr}
    </button>
  `,
    )
    .join('');

  const inputModeChip =
    _inputMode === 'type'
      ? `<button class="lscwc-mode-chip" id="lscwc-mode-toggle" type="button"
               aria-pressed="false">⌨️ Type · tap to switch</button>`
      : `<button class="lscwc-mode-chip" id="lscwc-mode-toggle" type="button"
               aria-pressed="true">👆 Tap · tap to switch</button>`;

  const inputArea =
    _inputMode === 'type'
      ? /* html */ `
        <div class="lscwc-write-input">
          <label for="lscwc-input" class="visually-hidden">Spell the word</label>
          <input type="text" id="lscwc-input" class="lscwc-input"
                 autocomplete="off" autocapitalize="off" spellcheck="false"
                 maxlength="${word.length}"
                 aria-label="Spell the word"
                 inputmode="text" />
          <button class="btn btn--ghost btn--sm" id="lscwc-backspace" type="button"
                  aria-label="Delete last letter">⌫</button>
        </div>
      `
      : /* html */ `
        <div class="lscwc-write-bank" role="group" aria-label="Tap letters in order">
          ${bankHtml}
        </div>
        <button class="btn btn--ghost btn--sm" id="lscwc-backspace" type="button"
                aria-label="Delete last letter">⌫ Undo last</button>
      `;

  return /* html */ `
    <div class="lscwc-stage lscwc-write">
      <h3 class="lscwc-stage-title">✍️ Write</h3>
      <p class="lscwc-stage-hint">${
        _inputMode === 'type' ? 'Type the word.' : 'Tap the letters in the right order.'
      }</p>
      <div class="lscwc-slots" id="lscwc-slots" aria-live="polite">${slotsHtml}</div>
      <div class="lscwc-write-toolbar">
        ${inputModeChip}
      </div>
      ${inputArea}
    </div>
  `;
}

function _renderCheck(word) {
  const typed = _typed;
  const allRight = typed.toLowerCase() === word.toLowerCase();
  const slotsHtml = word
    .split('')
    .map((expected, i) => {
      const got = typed[i] ?? '';
      const right = got && got.toLowerCase() === expected.toLowerCase();
      return /* html */ `
      <span class="lscwc-check-slot ${got ? (right ? 'right' : 'wrong') : 'missing'}"
            aria-label="${right ? 'correct' : 'wrong'}: ${expected}">
        <span class="lscwc-check-got">${got || '·'}</span>
        <span class="lscwc-check-exp">${expected}</span>
      </span>
    `;
    })
    .join('');

  const isLast = _wordIdx >= _words.length - 1;
  const cta = allRight
    ? isLast
      ? `<button class="btn btn--primary" id="lscwc-next-stage" type="button">🎉 Finish!</button>`
      : `<button class="btn btn--primary" id="lscwc-next-stage" type="button">Next word →</button>`
    : /* html */ `
        <button class="btn btn--ghost" id="lscwc-retry" type="button">🔁 Try again</button>
        <button class="btn btn--primary" id="lscwc-next-stage" type="button">
          ${isLast ? 'Finish' : 'Next word →'}
        </button>
      `;

  return /* html */ `
    <div class="lscwc-stage lscwc-check ${allRight ? 'lscwc-check--ok' : 'lscwc-check--bad'}">
      <h3 class="lscwc-stage-title">${allRight ? '🎉 Check' : '🤔 Check'}</h3>
      <p class="lscwc-stage-hint">
        ${allRight ? 'You spelled it!' : 'Almost — look at the red letters.'}
      </p>
      <div class="lscwc-check-row">${slotsHtml}</div>
      <div class="lscwc-actions">${cta}</div>
    </div>
  `;
}

/** Letter-by-letter span rendering used in Look / Say / Cover stages. */
function _wordLetters(word) {
  return word
    .split('')
    .map((l) => `<span class="lscwc-letter">${l}</span>`)
    .join('');
}

// ── Internal: per-stage wiring ────────────────────────────────────────────

function _wireStage(word) {
  // Speak the word on entry to Look + Say + Cover stages.
  if (_stage === 'look' || _stage === 'say') {
    audio.speakWord?.(word);
  }

  switch (_stage) {
    case 'look':
      return _wireLook();
    case 'say':
      return _wireSay();
    case 'cover':
      return _wireCover();
    case 'write':
      return _wireWrite(word);
    case 'check':
      return _wireCheck(word);
  }
}

function _wireLook() {
  _container?.querySelector('#lscwc-replay')?.addEventListener('click', () => {
    audio.speakWord?.(_currentWord());
  });
  _container?.querySelector('#lscwc-next-stage')?.addEventListener('click', () => {
    _stage = 'say';
    _renderCurrent();
  });
}

function _wireSay() {
  _container?.querySelector('#lscwc-replay')?.addEventListener('click', () => {
    audio.speakWord?.(_currentWord());
  });
  _container?.querySelector('#lscwc-next-stage')?.addEventListener('click', () => {
    _stage = 'cover';
    _renderCurrent();
  });
}

function _wireCover() {
  const word = _container?.querySelector('#lscwc-cover-word');
  const next = _container?.querySelector('#lscwc-next-stage');
  if (word) word.classList.add('lscwc-fading');
  _coverTimer = setTimeout(() => {
    if (word) word.classList.add('lscwc-covered');
    if (next) next.disabled = false;
  }, 1500);
  next?.addEventListener('click', () => {
    _stage = 'write';
    _resetBankFor(_currentWord());
    _renderCurrent();
  });
}

function _wireWrite(word) {
  const slots = () => _container?.querySelectorAll('.lscwc-slot') ?? [];

  function paintSlots() {
    slots().forEach((slot, i) => {
      const ch = _typed[i];
      slot.textContent = ch ?? '';
      slot.classList.toggle('filled', !!ch);
      slot.classList.remove('wrong');
    });
  }

  function flashWrong() {
    const i = _typed.length;
    const list = slots();
    if (i < list.length) {
      list[i].classList.add('wrong');
      setTimeout(() => list[i]?.classList.remove('wrong'), 320);
    }
  }

  function appendLetter(letter) {
    const verdict = _validateLetter(word, _typed, letter);
    if (verdict === 'correct') {
      _typed += letter.toLowerCase();
      paintSlots();
      if (_typed.length === word.length) {
        // Auto-advance to check stage after the last correct letter.
        _attemptsThisWord++;
        _logAttempt(word, true);
        if (_attemptsThisWord === 1) _correctFirstTry++;
        _stage = 'check';
        setTimeout(() => _renderCurrent(), 220);
      }
    } else {
      flashWrong();
    }
  }

  // Type mode: keyboard
  const input = _container?.querySelector('#lscwc-input');
  if (input) {
    input.focus();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (_typed.length > 0) {
          _typed = _typed.slice(0, -1);
          paintSlots();
        }
        return;
      }
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        e.preventDefault();
        appendLetter(e.key);
      }
    });
    // Defensive: the input's value should always mirror _typed.
    input.addEventListener('input', (e) => {
      e.preventDefault();
      e.target.value = '';
    });
  }

  // Tap mode: letter-bank buttons
  _container?.querySelectorAll('.lscwc-bank-tile').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const idx = Number(btn.dataset.bankIdx);
      const letter = _bank[idx];
      const verdict = _validateLetter(word, _typed, letter);
      if (verdict === 'correct') {
        _bankUsed[idx] = true;
        btn.disabled = true;
        btn.classList.add('used');
      } else {
        btn.classList.add('flash-wrong');
        setTimeout(() => btn.classList.remove('flash-wrong'), 320);
      }
      appendLetter(letter);
    });
  });

  // Backspace button (shared)
  _container?.querySelector('#lscwc-backspace')?.addEventListener('click', () => {
    if (_typed.length === 0) return;
    const removed = _typed[_typed.length - 1];
    _typed = _typed.slice(0, -1);
    paintSlots();
    if (_inputMode === 'tap') {
      // Re-enable the most recently-used bank tile that matches `removed`.
      for (let i = _bankUsed.length - 1; i >= 0; i--) {
        if (_bankUsed[i] && _bank[i] === removed) {
          _bankUsed[i] = false;
          const tile = _container?.querySelector(`.lscwc-bank-tile[data-bank-idx="${i}"]`);
          if (tile) {
            tile.disabled = false;
            tile.classList.remove('used');
          }
          break;
        }
      }
    }
  });

  // Input-mode toggle (Type ↔ Tap)
  _container?.querySelector('#lscwc-mode-toggle')?.addEventListener('click', () => {
    _inputMode = _inputMode === 'type' ? 'tap' : 'type';
    _persistInputMode();
    // Preserve typed letters across the toggle.
    _renderCurrent();
  });

  paintSlots();
}

function _wireCheck(word) {
  // If we got here via auto-advance from `write` (all correct), the
  // attempt has already been logged. If the user manually requests a
  // retry after a wrong answer, we'll log the wrong attempt now.
  const correct = _typed.toLowerCase() === word.toLowerCase();
  if (!correct) {
    // Only log a wrong attempt once per visit to the check stage.
    _attemptsThisWord++;
    _logAttempt(word, false);
  }

  _container?.querySelector('#lscwc-retry')?.addEventListener('click', () => {
    _stage = 'write';
    _resetBankFor(_currentWord());
    _renderCurrent();
  });

  _container?.querySelector('#lscwc-next-stage')?.addEventListener('click', () => {
    _advanceWordOrFinish();
  });
}

function _advanceWordOrFinish() {
  if (_wordIdx >= _words.length - 1) {
    const summary = {
      totalWords: _words.length,
      correctFirstTry: _correctFirstTry,
      attempts: _correctFirstTry, // for backwards-friendly key; full attempts in stats
    };
    cleanupLscwcDrill();
    _onDone?.(summary);
    return;
  }
  _wordIdx++;
  _stage = 'look';
  _attemptsThisWord = 0;
  _resetBankFor(_currentWord());
  _renderCurrent();
}
