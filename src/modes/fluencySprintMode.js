/**
 * Fluency Sprint Mode  (Automaticity — rapid word recognition)
 *
 * A 45-second sprint: the app speaks a familiar word, three printed words
 * appear, the child taps the match, and the next item follows immediately.
 * At time-up the round is scored with the canonical Fluency Sprint scorer
 * (accuracy AND words-per-minute must both clear the bar for mastery) and
 * a summary with a targeted hint is shown.
 *
 * Design notes:
 * - The sprint starts behind a Start button: the timer is fair, and audio
 *   begins from a user gesture (autoplay-safe).
 * - The word pool prefers words the child already knows (≥60% accuracy in
 *   wordStats) — fluency practice is for FAMILIAR words, not new ones.
 * - The shell's Say-It and Hint buttons are hidden for the duration (both
 *   act on the single shell word, which is wrong mid-sprint) and MUST be
 *   restored in cleanup — no other mode resets them.
 */

import { renderWordImage } from '../components/phonemeDisplay.js';
import { celebrateCorrect } from '../components/confettiHelper.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { progress } from '../modules/progress.js';
import { WORDS, getWordsByLevel, getDistractors, shuffleArray } from '../data/words.js';
import { scoreFluencySprint } from './scoring/fluencySprint.js';

const SPRINT_MS = 45000;
const TARGET_WPM = 30; // matches PHONICS_MODES.fluencySprint.masteryCriteria
const MIN_POOL = 6;

let _word = null;
let _els = null;
let _pool = [];
let _queue = [];
let _attempts = [];
let _sprintStart = 0;
let _itemStart = 0;
let _currentTarget = null;
let _lastTargetId = null;
let _countdown = null;
let _timeouts = [];
let _active = false;
let _done = false;
let _announcedLow = false;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupFluencySprint(word, els) {
  _word = word;
  _els = els;
  _attempts = [];
  _timeouts = [];
  _active = false;
  _done = false;
  _announcedLow = false;
  _lastTargetId = null;

  _pool = _buildPool(word);
  _queue = shuffleArray(_pool);

  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';
  // Accuracy first: a speed prompt makes early readers guess. Time is still
  // measured in the background for the fluency score.
  els.modeInstruction.textContent = 'Tap the word you hear — keep it smooth and steady!';

  // Both shell buttons act on the single shell word — wrong mid-sprint.
  if (els.btnCheck) els.btnCheck.style.display = 'none';
  if (els.btnSayIt) els.btnSayIt.style.display = 'none';
  if (els.btnHint) els.btnHint.style.display = 'none';
  if (els.btnSkip) els.btnSkip.style.display = '';

  els.modeArea.innerHTML = /* html */ `
    <div class="fs-round">
      <div class="fs-ready" id="fs-ready">
        <p class="fs-ready-copy">⚡ 45 seconds. Listen, then tap the matching word. Ready?</p>
        <button class="btn btn--primary btn--xl" id="fs-start-btn" aria-label="Start the sprint">
          ▶ Start!
        </button>
      </div>
      <div class="fs-live" id="fs-live" hidden>
        <div class="fs-hud">
          <span class="fs-timer" id="fs-timer" role="timer" aria-live="off">45</span>
          <span class="fs-score" id="fs-score" aria-label="Correct so far">✓ 0</span>
        </div>
        <div class="fs-cards choice-grid" id="fs-cards" role="group" aria-label="Tap the word you hear"></div>
        <div class="fs-status" id="fs-status" role="status" aria-live="polite"></div>
      </div>
    </div>
  `;

  document
    .getElementById('fs-start-btn')
    ?.addEventListener('click', () => _start(), { once: true });
  document.getElementById('fs-start-btn')?.focus();
}

/** Build the sprint pool: familiar words from the current group/level. */
function _buildPool(word) {
  const maxLevel = store.get('difficulty') || 1;
  const currentGroup = store.get('currentGroup');

  let base = currentGroup
    ? progress.getWordsInGroup(currentGroup, maxLevel)
    : getWordsByLevel(maxLevel);
  if (base.length < MIN_POOL) base = getWordsByLevel(maxLevel);
  if (base.length < MIN_POOL) base = WORDS.filter((w) => w.level <= 2);

  // Fluency = practising KNOWN words: prefer ≥60%-accuracy words when there
  // are enough of them.
  const stats = store.get('wordStats') || {};
  const strong = base.filter((w) => {
    const s = stats[w.id];
    return s && s.attempts > 0 && s.correct / s.attempts >= 0.6;
  });
  const pool = strong.length >= MIN_POOL ? strong : base;

  return pool.some((w) => w.id === word.id) ? pool : [word, ...pool];
}

function _start() {
  if (_active || _done) return;
  _active = true;
  _sprintStart = Date.now();

  document.getElementById('fs-ready')?.setAttribute('hidden', '');
  document.getElementById('fs-live')?.removeAttribute('hidden');

  _countdown = setInterval(_tick, 250);
  _nextItem();
}

function _tick() {
  if (!_active) return;
  const remainMs = SPRINT_MS - (Date.now() - _sprintStart);
  const timer = document.getElementById('fs-timer');
  if (timer) timer.textContent = String(Math.max(0, Math.ceil(remainMs / 1000)));

  if (remainMs <= 10000 && !_announcedLow) {
    _announcedLow = true;
    timer?.classList.add('fs-timer--low');
    const status = document.getElementById('fs-status');
    if (status) status.textContent = '10 seconds left!';
  }
  if (remainMs <= 0) _finish();
}

function _nextItem() {
  if (!_active || _done) return;

  if (_queue.length === 0) _queue = shuffleArray(_pool);
  let target = _queue.pop();
  // Avoid an immediate repeat of the same word when the pool allows it.
  if (target?.id === _lastTargetId && (_queue.length > 0 || _pool.length > 1)) {
    const alt = _queue.pop() ?? shuffleArray(_pool.filter((w) => w.id !== _lastTargetId))[0];
    if (alt) {
      if (target) _queue.unshift(target);
      target = alt;
    }
  }
  _currentTarget = target;
  _lastTargetId = target?.id ?? null;
  if (!target) return _finish();

  const maxLevel = store.get('difficulty') || 1;
  const distractors = getDistractors(target, 2, { maxLevel });
  const cards = shuffleArray([target, ...distractors]);

  const grid = document.getElementById('fs-cards');
  if (!grid) return;
  grid.innerHTML = '';
  for (const w of cards) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn fs-card';
    btn.textContent = w.word;
    btn.dataset.correct = String(w.id === target.id);
    btn.dataset.wordId = w.id;
    btn.setAttribute('aria-label', `Choose ${w.word}`);
    btn.addEventListener('click', () => _onCardTap(btn));
    grid.appendChild(btn);
  }

  _itemStart = Date.now();
  _timeouts.push(
    setTimeout(() => {
      if (_active) audio.speakWord(target.word);
    }, 150),
  );
}

function _onCardTap(btn) {
  if (!_active || _done || btn.disabled) return;
  const correct = btn.dataset.correct === 'true';

  // Exact scorer shape: { word, correct, timeMs } per item.
  _attempts.push({
    word: _currentTarget?.word ?? '',
    correct,
    timeMs: Date.now() - _itemStart,
  });

  audio.playSfx(correct ? 'correct' : 'wrong');
  btn.classList.add(correct ? 'fs-card--yes' : 'fs-card--no');
  document
    .getElementById('fs-cards')
    ?.querySelectorAll('.fs-card')
    .forEach((b) => {
      b.disabled = true;
    });

  const score = document.getElementById('fs-score');
  if (score) score.textContent = `✓ ${_attempts.filter((a) => a.correct).length}`;

  _timeouts.push(setTimeout(() => _nextItem(), 250));
}

function _finish() {
  if (_done) return;
  _done = true;
  _active = false;
  if (_countdown) {
    clearInterval(_countdown);
    _countdown = null;
  }

  const durationMs = Math.max(1, Date.now() - _sprintStart);
  const result = scoreFluencySprint({ attempts: _attempts, durationMs, targetWpm: TARGET_WPM });
  const { wpm, accuracy, correct, total } = result.scoreBreakdown;

  if (result.correct) {
    celebrateCorrect();
    audio.playSfx('levelUp');
  }

  const live = document.getElementById('fs-live');
  if (live) live.setAttribute('hidden', '');

  const area = _els?.modeArea;
  if (!area) return;
  const summary = document.createElement('div');
  summary.className = 'fs-summary';
  summary.setAttribute('role', 'status');
  summary.innerHTML = `
    <div class="fs-summary-headline">${result.correct ? '🏅 Sprint mastered!' : '⏱️ Time!'}</div>
    <div class="fs-summary-stats">
      <span class="fs-summary-stat"><strong>${wpm}</strong> words/min</span>
      <span class="fs-summary-stat"><strong>${Math.round(accuracy * 100)}%</strong> accuracy</span>
      <span class="fs-summary-stat"><strong>${correct}/${total}</strong> correct</span>
    </div>
    ${result.hint ? `<p class="fs-summary-hint">💡 ${result.hint}</p>` : ''}
  `;
  area.querySelector('.fs-round')?.appendChild(summary);

  const wrap = document.createElement('div');
  wrap.className = 'vmcq-next-wrap';
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'btn btn--primary vmcq-next-btn';
  nextBtn.textContent = 'Next →';
  nextBtn.setAttribute('aria-label', 'Finish sprint');
  wrap.appendChild(nextBtn);
  area.appendChild(wrap);
  nextBtn.addEventListener(
    'click',
    () => {
      _els?.onResult(result.correct, durationMs);
    },
    { once: true },
  );
  nextBtn.focus();
}

export function getCurrentWord() {
  return _word;
}

export function cleanup() {
  _active = false;
  if (_countdown) {
    clearInterval(_countdown);
    _countdown = null;
  }
  _timeouts.forEach((id) => clearTimeout(id));
  _timeouts = [];
  // Restore the shell buttons — nothing else resets these.
  if (_els?.btnSayIt) _els.btnSayIt.style.display = '';
  if (_els?.btnHint) _els.btnHint.style.display = '';
  _word = null;
  _els = null;
  _pool = [];
  _queue = [];
  _attempts = [];
  _currentTarget = null;
  _lastTargetId = null;
  _done = false;
  _announcedLow = false;
}
