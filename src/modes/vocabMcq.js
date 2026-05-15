import { questMastery } from '../modules/questMastery.js';
import { gamification } from '../modules/gamification.js';
import { store } from '../modules/store.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';
import { VOCAB_CATEGORIES, VOCAB_CATEGORY_KEYS } from '../data/vocabCategories.js';
import { checkPostAttempt } from '../modules/remediationRouter.js';

let _container = null;
let _onGoHome = null;
let _items = [];
let _idx = 0;
let _correct = 0;
let _answered = false;
let _advanceTimer = null;
let _scope = { level: null, category: null, label: 'All Skills' };

let _streak = 0;
let _maxStreak = 0;
let _missed = [];
let _isRecovery = false;

export function initVocabMcq(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function cleanupVocabMcq() {
  if (_container) _container.innerHTML = '';
  if (_advanceTimer) { clearTimeout(_advanceTimer); _advanceTimer = null; }
}

export function getAllItems(bank = VOCAB_MCQ_ITEMS) {
  return VOCAB_MCQ_LEVELS.flatMap(level => bank[level] || []);
}

export function getItemsForScope({ level = null, category = null } = {}, bank = VOCAB_MCQ_ITEMS) {
  const source = level ? (bank[level] || []) : getAllItems(bank);
  return category ? source.filter(item => item.category === category) : source;
}

export function countItemsForScope(scope = {}, bank = VOCAB_MCQ_ITEMS) {
  return getItemsForScope(scope, bank).length;
}

export function getCategoryCounts(bank = VOCAB_MCQ_ITEMS, categories = VOCAB_CATEGORY_KEYS) {
  return categories.map(category => {
    const levels = {};
    let total = 0;
    for (const level of VOCAB_MCQ_LEVELS) {
      const count = countItemsForScope({ level, category }, bank);
      levels[level] = count;
      total += count;
    }
    return { category, total, levels };
  });
}

export function getLevelCounts(bank = VOCAB_MCQ_ITEMS, levels = VOCAB_MCQ_LEVELS) {
  return levels.map(level => ({ level, total: countItemsForScope({ level }, bank) }));
}

function _categoryLabel(key) {
  return VOCAB_CATEGORIES[key]?.label || key;
}

function _scopeLabel(scope) {
  const left = scope.level || null;
  const right = scope.category ? _categoryLabel(scope.category) : null;
  return [left, right].filter(Boolean).join(' · ') || 'All Skills';
}

export function showVocabMcqBrowser() {
  if (!_container) return;

  const levelCounts = getLevelCounts();
  const categoryCounts = getCategoryCounts();
  let selectedLevel = _scope.level || 'P1';

  const render = () => {
    _container.innerHTML = `
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">📖 Vocabulary MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise vocabulary concepts within that level.</p>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${levelCounts.map(({ level, total }) => `
              <button class="sfq-level-btn mcq-level-card ${level === selectedLevel ? 'mcq-level-card--active' : ''}" data-pick-level="${level}">
                <span class="sfq-level-name">${level}</span>
                <span class="mcq-count-badge">${total} items</span>
              </button>
            `).join('')}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · ${selectedLevel} Vocabulary Concepts</h3>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="vmcq-start-level">Start ${selectedLevel} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${categoryCounts.map(({ category, levels }) => {
              const count = levels[selectedLevel] || 0;
              const meta = VOCAB_CATEGORIES[category] || { icon: '📘', label: category, desc: '' };

              if (!count) {
                return `
                  <button class="mcq-skill-card mcq-skill-card--disabled" disabled>
                    <div class="mcq-skill-title">${meta.icon} ${meta.label}</div>
                    <p class="mcq-skill-sub">Coming soon for ${selectedLevel}</p>
                  </button>`;
              }

              return `
                <button class="mcq-skill-card" data-scope-level="${selectedLevel}" data-scope-category="${category}">
                  <div class="mcq-skill-title">${meta.icon} ${meta.label}</div>
                  <p class="mcq-skill-sub">${meta.desc || ''}</p>
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${count} items in ${selectedLevel}</span></p>
                </button>`;
            }).join('')}
          </div>
        </section>

        <div class="sfq-actions"><button class="btn btn--ghost" id="vmcq-home">← Home</button></div>
      </div>`;

    _container.querySelectorAll('[data-pick-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLevel = btn.dataset.pickLevel;
        render();
      });
    });

    _container.querySelector('#vmcq-start-level')?.addEventListener('click', () => {
      _startScope({ level: selectedLevel, category: null });
    });

    _container.querySelectorAll('[data-scope-level][data-scope-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        _startScope({ level: btn.dataset.scopeLevel, category: btn.dataset.scopeCategory });
      });
    });

    _container.querySelector('#vmcq-home')?.addEventListener('click', () => _onGoHome?.());
  };

  render();
}

function _adaptiveShuffle(items) {
  return [...items].sort((a, b) => {
    const sa = questMastery.getSkillScore('vocabMcq', a.category);
    const sb = questMastery.getSkillScore('vocabMcq', b.category);
    return (sa - sb) + (Math.random() - 0.5) * 0.3;
  });
}

function _startScope({ level = null, category = null, label = '' } = {}) {
  _scope = { level, category, label: label || _scopeLabel({ level, category }) };
  _items = _adaptiveShuffle(getItemsForScope({ level, category }));

  const limit = store.get('paperItemLimit');
  if (limit) {
    store.set('paperItemLimit', null);
    _items = _items.slice(0, limit);
  }

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
  _startScope({ level, category: null, label: level });
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
  const roundLabel = _isRecovery ? `Recovery · ${_scope.label}` : _scope.label;

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
        _correct += 1;
        _streak += 1;
        _maxStreak = Math.max(_maxStreak, _streak);
        gamification.recordCorrect();
      } else {
        _streak = 0;
        _missed.push(item);
        gamification.recordWrong();
      }

      questMastery.updateSkill('vocabMcq', item.category, ok);
      questMastery.recordAttempt({ quest: 'vocabMcq', skill: item.category, correct: ok, level: _scope.level || 'Mixed' });

      _container.querySelectorAll('[data-choice]').forEach(b => {
        b.disabled = true;
        b.setAttribute('aria-disabled', 'true');
        if (b.dataset.choice === item.answer) {
          b.classList.add('pt-choice--correct');
        } else if (b === btn && !ok) {
          b.classList.add('pt-choice--wrong');
        }
      });

      const hint = _container.querySelector('#vmcq-hint');
      let hintText = '';
      if (ok) {
        hintText = '✅ <strong>Correct!</strong>';
      } else {
        hintText = `❌ <strong>Correct answer:</strong> ${item.answer}`;
      }

      // Show clue words if available
      if (item.clueWords && item.clueWords.length > 0) {
        hintText += `<br><span class="mcq-clue-words"><strong>🔍 Clue words:</strong> ${item.clueWords.map(w => `<span class="mcq-clue-chip">${w}</span>`).join(' ')}</span>`;
      }

      // Show reasoning if available, otherwise fall back to explain
      if (item.reasoning) {
        hintText += `<br><span class="mcq-reasoning">${item.reasoning}</span>`;
      } else if (item.explain) {
        hintText += `<br>${item.explain}`;
      }

      if (!ok) {
        const suggestion = checkPostAttempt('vocabMcq', item.category, false);
        if (suggestion && suggestion.type === 'redirect') {
          hintText += ` <br>💡 ${suggestion.message}`;
        }
      }

      if (hint) hint.innerHTML = hintText;

      _advanceTimer = setTimeout(() => {
        _advanceTimer = null;
        _idx += 1;
        _renderQuestion();
      }, ok ? 1400 : 2200);
    });
  });
}

function _renderDone() {
  if (_advanceTimer) { clearTimeout(_advanceTimer); _advanceTimer = null; }
  const total = _items.length;
  const accuracy = total > 0 ? Math.round((_correct / total) * 100) : 0;
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : 1;
  const hasMissed = _missed.length > 0 && !_isRecovery;

  const catKeys = [...new Set(_items.map(item => item.category))];

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
        <button class="btn btn--ghost" id="vmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`;

  if (hasMissed) _container.querySelector('#vmcq-recovery')?.addEventListener('click', () => _startRecovery());
  _container.querySelector('#vmcq-replay')?.addEventListener('click', () => _startScope(_scope));
  _container.querySelector('#vmcq-menu')?.addEventListener('click', () => showVocabMcqBrowser());
}
