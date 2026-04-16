import { questMastery } from '../modules/questMastery.js';
import { gamification } from '../modules/gamification.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';
import { VOCAB_CATEGORIES } from '../data/vocabCategories.js';
import { checkPostAttempt } from '../modules/remediationRouter.js';

let _container = null;
let _onGoHome = null;
let _level = 'P1';
let _items = [];
let _idx = 0;
let _correct = 0;
let _answered = false;
let _advanceTimer = null;

// ── Gamification state ──────────────────────────────────────────────────
let _streak = 0;
let _maxStreak = 0;
let _missed = [];        // items answered incorrectly — for recovery round
let _isRecovery = false;  // true during recovery round

export function initVocabMcq(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function cleanupVocabMcq() {
  if (_container) _container.innerHTML = '';
  if (_advanceTimer) { clearTimeout(_advanceTimer); _advanceTimer = null; }
}

export function showVocabMcqBrowser() {
  if (!_container) return;
  _container.innerHTML = `
    <div class="sfq-browser">
      <h2 class="sfq-title">📖 Vocabulary MCQ</h2>
      <p class="sfq-instruction">Practise level-based vocabulary paper items.</p>
      <div class="sfq-browser-grid">
        ${VOCAB_MCQ_LEVELS.map(l => `<button class="sfq-level-btn" data-level="${l}">${l}</button>`).join('')}
      </div>
      <div class="sfq-actions"><button class="btn btn--ghost" id="vmcq-home">← Home</button></div>
    </div>`;

  _container.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => _start(btn.dataset.level));
  });
  _container.querySelector('#vmcq-home')?.addEventListener('click', () => _onGoHome?.());
}

/**
 * Mastery-weighted shuffle: items in weaker categories float toward the
 * front so the child practises what they need most.  A random jitter
 * (±0.15) keeps the order varied across replays.
 */
function _adaptiveShuffle(items) {
  return [...items].sort((a, b) => {
    const sa = questMastery.getSkillScore('vocabMcq', a.category);
    const sb = questMastery.getSkillScore('vocabMcq', b.category);
    return (sa - sb) + (Math.random() - 0.5) * 0.3;
  });
}

function _start(level) {
  _level = level;
  _items = _adaptiveShuffle(VOCAB_MCQ_ITEMS[level] || []);
  _idx = 0;
  _correct = 0;
  _streak = 0;
  _maxStreak = 0;
  _missed = [];
  _isRecovery = false;
  _answered = false;
  if (_advanceTimer) { clearTimeout(_advanceTimer); _advanceTimer = null; }
  _renderQuestion();
}

function _startRecovery() {
  _items = _adaptiveShuffle(_missed);
  _idx = 0;
  _correct = 0;
  _streak = 0;
  _maxStreak = 0;
  _missed = [];
  _isRecovery = true;
  _answered = false;
  if (_advanceTimer) { clearTimeout(_advanceTimer); _advanceTimer = null; }
  _renderQuestion();
}

export function startVocabMcqLevel(level) {
  if (!_container) return;
  _start(level);
}

function _categoryLabel(key) {
  return VOCAB_CATEGORIES[key]?.label || key;
}

function _streakBadge() {
  if (_streak < 2) return '';
  const icon = _streak >= 10 ? '🔥' : _streak >= 5 ? '⚡' : '✨';
  return `<span class="mcq-streak" aria-label="${_streak} in a row">${icon} ${_streak}</span>`;
}

function _renderQuestion() {
  if (!_container) return;
  const item = _items[_idx];
  if (!item) return _renderDone();

  _answered = false;
  const progressPct = Math.round(((_idx) / _items.length) * 100);
  const roundLabel = _isRecovery ? 'Recovery Round' : _level;

  _container.innerHTML = `
    <div class="mcq-game" role="region" aria-label="Vocabulary question ${_idx + 1} of ${_items.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${_isRecovery ? '🔄' : '📖'} ${roundLabel}</span>
        ${_streakBadge()}
        <span class="sfq-progress" aria-label="Question ${_idx + 1} of ${_items.length}">${_idx + 1}/${_items.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${progressPct}%"></div></div>
      <p class="mcq-category-tag">${_categoryLabel(item.category)}</p>
      <p class="sfq-instruction">${item.q}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${item.choices.map(c => `<button class="pt-choice-btn" data-choice="${c}" aria-label="Choose ${c}">${c}</button>`).join('')}
      </div>
      <p class="pt-grammar-hint" id="vmcq-hint" role="status" aria-live="polite"></p>
    </div>`;

  _container.querySelectorAll('[data-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (_answered) return;
      _answered = true;

      const ans = btn.dataset.choice;
      const ok = ans === item.answer;

      if (ok) {
        _correct++;
        _streak++;
        if (_streak > _maxStreak) _maxStreak = _streak;
        gamification.recordCorrect();
      } else {
        _streak = 0;
        _missed.push(item);
        gamification.recordWrong();
      }

      questMastery.updateSkill('vocabMcq', item.category, ok);
      questMastery.recordAttempt({ quest: 'vocabMcq', skill: item.category, correct: ok, level: _level });

      // Disable all buttons and highlight correct/wrong
      _container.querySelectorAll('[data-choice]').forEach(b => {
        b.disabled = true;
        b.setAttribute('aria-disabled', 'true');
        if (b.dataset.choice === item.answer) {
          b.classList.add('pt-choice--correct');
        } else if (b === btn && !ok) {
          b.classList.add('pt-choice--wrong');
        }
      });

      // Streak flash
      if (ok && _streak >= 3) {
        const streakEl = _container.querySelector('.mcq-streak');
        if (streakEl) streakEl.classList.add('mcq-streak--flash');
      }

      // Feedback text
      const hint = _container.querySelector('#vmcq-hint');
      let hintText = ok ? '✅ Correct.' : `❌ Correct answer: ${item.answer}.`;
      hintText += ` ${item.explain}`;

      // Remediation nudge on wrong answer
      if (!ok) {
        const suggestion = checkPostAttempt('vocabMcq', item.category, false);
        if (suggestion && suggestion.type === 'redirect') {
          hintText += ` 💡 ${suggestion.message}`;
        }
      }

      if (hint) hint.textContent = hintText;

      _advanceTimer = setTimeout(() => {
        _advanceTimer = null;
        _idx += 1;
        _renderQuestion();
      }, ok ? 1200 : 2000);
    });
  });
}

function _renderDone() {
  if (_advanceTimer) { clearTimeout(_advanceTimer); _advanceTimer = null; }
  const total = _items.length;
  const accuracy = total > 0 ? Math.round((_correct / total) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
  const hasMissed = _missed.length > 0 && !_isRecovery;

  // Per-category coverage
  const catStats = {};
  for (const item of _items) {
    if (!catStats[item.category]) catStats[item.category] = { total: 0 };
    catStats[item.category].total++;
  }
  const catKeys = Object.keys(catStats);

  _container.innerHTML = `
    <div class="sfq-browser" role="region" aria-label="Vocabulary MCQ results">
      <h2 class="sfq-title">${_isRecovery ? '🔄 Recovery Round Complete' : 'Vocabulary MCQ Complete'}</h2>
      <div class="sfq-stars" aria-label="${stars} stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="sfq-instruction">${_correct}/${total} correct · ${accuracy}%</p>
      ${_maxStreak >= 3 ? `<p class="sfq-instruction">${_maxStreak >= 10 ? '🔥' : _maxStreak >= 5 ? '⚡' : '✨'} Best streak: ${_maxStreak} in a row</p>` : ''}
      <p class="sfq-instruction">${accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great work — keep practising!' : 'Good effort — replay to improve!'}</p>
      <div class="mcq-cat-summary">
        ${catKeys.map(k => `<span class="mcq-cat-chip">${_categoryLabel(k)}</span>`).join('')}
      </div>
      <div class="sfq-actions">
        ${hasMissed ? `<button class="btn btn--primary" id="vmcq-recovery">🔄 Recovery Round (${_missed.length})</button>` : ''}
        <button class="btn ${hasMissed ? 'btn--ghost' : 'btn--primary'}" id="vmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="vmcq-menu">Levels</button>
      </div>
    </div>`;

  if (hasMissed) {
    _container.querySelector('#vmcq-recovery')?.addEventListener('click', () => _startRecovery());
  }
  _container.querySelector('#vmcq-replay')?.addEventListener('click', () => _start(_level));
  _container.querySelector('#vmcq-menu')?.addEventListener('click', () => showVocabMcqBrowser());
}
