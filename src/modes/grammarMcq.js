import { questMastery } from '../modules/questMastery.js';
import { gamification } from '../modules/gamification.js';
import { store } from '../modules/store.js';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS } from '../data/grammarMcq.js';
import { GRAMMAR_CATEGORIES, GRAMMAR_CATEGORY_KEYS, categoryAppliesToLevel } from '../data/grammarCategories.js';
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

export function initGrammarMcq(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function cleanupGrammarMcq() {
  if (_container) _container.innerHTML = '';
  if (_advanceTimer) { clearTimeout(_advanceTimer); _advanceTimer = null; }
}

export function getAllItems(bank = GRAMMAR_MCQ_ITEMS) {
  return GRAMMAR_MCQ_LEVELS.flatMap(level => bank[level] || []);
}

export function getItemsForScope({ level = null, category = null } = {}, bank = GRAMMAR_MCQ_ITEMS) {
  const source = level ? (bank[level] || []) : getAllItems(bank);
  return category ? source.filter(item => item.category === category) : source;
}

export function countItemsForScope(scope = {}, bank = GRAMMAR_MCQ_ITEMS) {
  return getItemsForScope(scope, bank).length;
}

export function getCategoryCounts(bank = GRAMMAR_MCQ_ITEMS, categories = GRAMMAR_CATEGORY_KEYS) {
  return categories.map(category => {
    const levels = {};
    let total = 0;
    for (const level of GRAMMAR_MCQ_LEVELS) {
      const count = countItemsForScope({ level, category }, bank);
      levels[level] = count;
      total += count;
    }
    return { category, total, levels };
  });
}

export function getLevelCounts(bank = GRAMMAR_MCQ_ITEMS, levels = GRAMMAR_MCQ_LEVELS) {
  return levels.map(level => ({ level, total: countItemsForScope({ level }, bank) }));
}

function _categoryLabel(key) {
  return GRAMMAR_CATEGORIES[key]?.label || key;
}

function _scopeLabel(scope) {
  const left = scope.level || null;
  const right = scope.category ? _categoryLabel(scope.category) : null;
  return [left, right].filter(Boolean).join(' · ') || 'All Skills';
}

export function showGrammarMcqBrowser() {
  if (!_container) return;

  const levelCounts = getLevelCounts();
  const categoryCounts = getCategoryCounts();
  let selectedLevel = _scope.level || 'P1';

  const render = () => {
    _container.innerHTML = `
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">🧠 Grammar MCQ</h2>
        <p class="sfq-instruction">Choose a level first, then practise grammar concepts within that level.</p>

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
          <h3 class="mcq-browser-heading">Step 2 · ${selectedLevel} Grammar Concepts</h3>
          <div class="sfq-actions">
            <button class="btn btn--primary" id="gmcq-start-level">Start ${selectedLevel} (All Skills)</button>
          </div>
          <div class="mcq-skill-grid">
            ${categoryCounts
              .filter(({ category }) => categoryAppliesToLevel(category, selectedLevel))
              .map(({ category, levels }) => {
              const count = levels[selectedLevel] || 0;
              const meta = GRAMMAR_CATEGORIES[category] || { icon: '🧩', label: category };

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
                  <p class="mcq-skill-sub"><span class="mcq-count-badge">${count} items in ${selectedLevel}</span></p>
                </button>`;
            }).join('')}
          </div>
        </section>

        <div class="sfq-actions"><button class="btn btn--ghost" id="gmcq-home">← Home</button></div>
      </div>`;

    _container.querySelectorAll('[data-pick-level]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLevel = btn.dataset.pickLevel;
        render();
      });
    });

    _container.querySelector('#gmcq-start-level')?.addEventListener('click', () => {
      _startScope({ level: selectedLevel, category: null });
    });

    _container.querySelectorAll('[data-scope-level][data-scope-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        _startScope({ level: btn.dataset.scopeLevel, category: btn.dataset.scopeCategory });
      });
    });

    _container.querySelector('#gmcq-home')?.addEventListener('click', () => _onGoHome?.());
  };

  render();
}

function _adaptiveShuffle(items) {
  return [...items].sort((a, b) => {
    const sa = questMastery.getSkillScore('grammarMcq', a.category);
    const sb = questMastery.getSkillScore('grammarMcq', b.category);
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

export function startGrammarMcqLevel(level) {
  if (!_container) return;
  _startScope({ level, category: null, label: level });
}

function _streakBadge() {
  if (_streak < 2) return '';
  const icon = _streak >= 10 ? '🔥' : _streak >= 5 ? '⚡' : '✨';
  return `<span class="mcq-streak" aria-label="${_streak} in a row">${icon} ${_streak}</span>`;
}

function _renderClueWords(item) {
  if (!item.clueWords || item.clueWords.length === 0) return '';
  return `
    <div class="mcq-clue-words">
      <strong>🔍 Clue words:</strong> 
      ${item.clueWords.map(w => `<span class="mcq-clue-chip">${w}</span>`).join(' ')}
    </div>
  `;
}

function _renderQuestion() {
  if (!_container) return;
  const item = _items[_idx];
  if (!item) return _renderDone();

  _answered = false;
  const progressPct = Math.round(((_idx) / _items.length) * 100);
  const roundLabel = _isRecovery ? `Recovery · ${_scope.label}` : _scope.label;

  _container.innerHTML = `
    <div class="mcq-game" role="region" aria-label="Grammar question ${_idx + 1} of ${_items.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${_isRecovery ? '🔄' : '🧠'} ${roundLabel}</span>
        ${_streakBadge()}
        <span class="sfq-progress" aria-label="Question ${_idx + 1} of ${_items.length}">${_idx + 1}/${_items.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${progressPct}%"></div></div>
      <p class="mcq-category-tag">${_categoryLabel(item.category)}</p>
      <p class="sfq-instruction">${item.q}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${item.choices.map(c => `<button class="pt-choice-btn" data-choice="${c}" aria-label="Choose ${c}">${c}</button>`).join('')}
      </div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
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

      questMastery.updateSkill('grammarMcq', item.category, ok);
      questMastery.recordAttempt({ quest: 'grammarMcq', skill: item.category, correct: ok, level: _scope.level || 'Mixed' });

      _container.querySelectorAll('[data-choice]').forEach(b => {
        b.disabled = true;
        b.setAttribute('aria-disabled', 'true');
        if (b.dataset.choice === item.answer) {
          b.classList.add('pt-choice--correct');
        } else if (b === btn && !ok) {
          b.classList.add('pt-choice--wrong');
        }
      });

      const hint = _container.querySelector('#gmcq-hint');
      
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
        const suggestion = checkPostAttempt('grammarMcq', item.category, false);
        if (suggestion && suggestion.type === 'redirect') {
          hintText += ` <br>💡 ${suggestion.message}`;
        }
      }

      if (hint) hint.innerHTML = hintText;

      const nextWrap = _container.querySelector('#gmcq-next-wrap');
      const nextBtn = _container.querySelector('#gmcq-next');
      if (nextWrap && nextBtn) {
        const isLast = _idx + 1 >= _items.length;
        nextBtn.textContent = isLast ? 'See Results →' : 'Next →';
        nextBtn.setAttribute('aria-label', isLast ? 'See results' : 'Next question');
        nextWrap.style.display = '';
        nextBtn.addEventListener('click', () => {
          _idx += 1;
          _renderQuestion();
        });
        nextBtn.focus();
      }
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
    <div class="sfq-browser" role="region" aria-label="Grammar MCQ results">
      <h2 class="sfq-title">${_isRecovery ? '🔄 Recovery Round Complete' : 'Grammar MCQ Complete'}</h2>
      <div class="sfq-stars" aria-label="${stars} stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="sfq-instruction">${_correct}/${total} correct · ${accuracy}%</p>
      ${_maxStreak >= 3 ? `<p class="sfq-instruction">${_maxStreak >= 10 ? '🔥' : _maxStreak >= 5 ? '⚡' : '✨'} Best streak: ${_maxStreak} in a row</p>` : ''}
      <p class="sfq-instruction">${accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great work — keep practising!' : 'Good effort — replay to improve!'}</p>
      <div class="mcq-cat-summary">
        ${catKeys.map(k => `<span class="mcq-cat-chip">${_categoryLabel(k)}</span>`).join('')}
      </div>
      <div class="sfq-actions">
        ${hasMissed ? `<button class="btn btn--primary" id="gmcq-recovery">🔄 Recovery Round (${_missed.length})</button>` : ''}
        <button class="btn ${hasMissed ? 'btn--ghost' : 'btn--primary'}" id="gmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="gmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`;

  if (hasMissed) _container.querySelector('#gmcq-recovery')?.addEventListener('click', () => _startRecovery());
  _container.querySelector('#gmcq-replay')?.addEventListener('click', () => _startScope(_scope));
  _container.querySelector('#gmcq-menu')?.addEventListener('click', () => showGrammarMcqBrowser());
}
