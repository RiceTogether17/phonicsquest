import { questMastery } from '../modules/questMastery.js';
import { gamification } from '../modules/gamification.js';
import { store } from '../modules/store.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS, buildVocabMcqLevel } from '../data/vocabMcq.js';
import { VOCAB_CATEGORIES, VOCAB_CATEGORY_KEYS } from '../data/vocabCategories.js';
import { checkPostAttempt } from '../modules/remediationRouter.js';
import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';
import { buildMcqFeedbackHtml } from './mcqFeedback.js';
import { filterMcqItemsForDifficulty, MCQ_DIFFICULTIES, renderMcqDifficultyToggle } from './mcqDifficulty.js';

function _getVocabTip(category) {
  const cat = VOCAB_CATEGORIES[category] || {};
  return {
    rule: cat.rule || `${cat.label || category} vocabulary questions test word meaning and usage in context.`,
    example: cat.example || 'Choose the word that best fits the sentence.',
    tip: cat.tip || 'Read the whole sentence carefully and test each option to find which sounds natural.',
  };
}

let _container = null;
let _onGoHome = null;
let _items = [];
let _idx = 0;
let _correct = 0;
let _answered = false;
let _scope = { level: null, category: null, label: 'All Skills', difficulty: 'normal' };
let _difficulty = 'normal';

let _streak = 0;
let _maxStreak = 0;
let _missed = [];
let _isRecovery = false;
let _sessionSkillStats = {}; // category -> { correct, total }
let _categoryWrong = {}; // category -> consecutive wrong count

export function initVocabMcq(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function cleanupVocabMcq() {
  if (_container) _container.innerHTML = '';
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
  let selectedDifficulty = _scope.difficulty || _difficulty || 'normal';

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
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${renderMcqDifficultyToggle({ selected: selectedDifficulty, prefix: 'vmcq' })}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${selectedLevel} Vocabulary Concepts</h3>
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

    _container.querySelectorAll('[data-vmcq-difficulty]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedDifficulty = btn.dataset.vmcqDifficulty;
        render();
      });
    });

    _container.querySelector('#vmcq-start-level')?.addEventListener('click', () => {
      _startScope({ level: selectedLevel, category: null, difficulty: selectedDifficulty });
    });

    _container.querySelectorAll('[data-scope-level][data-scope-category]').forEach(btn => {
      btn.addEventListener('click', () => {
        _startScope({ level: btn.dataset.scopeLevel, category: btn.dataset.scopeCategory, difficulty: selectedDifficulty });
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

function _startScope({ level = null, category = null, label = '', difficulty = _difficulty } = {}) {
  _difficulty = MCQ_DIFFICULTIES[difficulty]?.key || 'normal';
  _scope = { level, category, label: label || _scopeLabel({ level, category }), difficulty: _difficulty };

  // Rebuild items fresh each session so the random seed varies (not frozen at module load).
  const freshBank = level
    ? { [level]: buildVocabMcqLevel(level) }
    : Object.fromEntries(VOCAB_MCQ_LEVELS.map(l => [l, VOCAB_MCQ_ITEMS[l]]));
  _items = _adaptiveShuffle(filterMcqItemsForDifficulty(getItemsForScope({ level, category }, freshBank), { level, difficulty: _difficulty }));

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
  _sessionSkillStats = {};
  _isRecovery = false;
  _answered = false;
  _categoryWrong = {};
  if (_scope.category && !_isRecovery) {
    _renderRuleCard(_scope.category, () => _renderQuestion());
  } else {
    _renderQuestion();
  }
}

function _startRecovery() {
  _items = _adaptiveShuffle(_missed);
  _idx = 0;
  _correct = 0;
  _streak = 0;
  _maxStreak = 0;
  _missed = [];
  _sessionSkillStats = {};
  _isRecovery = true;
  _answered = false;
  _categoryWrong = {};
  _renderQuestion();
}

export function startVocabMcqLevel(level, difficulty = _difficulty) {
  if (!_container) return;
  _startScope({ level, category: null, label: level, difficulty });
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

  // Shuffle choices at render time so position doesn't become a memory cue on replays.
  const displayChoices = [...item.choices].sort(() => Math.random() - 0.5);

  _container.innerHTML = `
    <div class="mcq-game" role="region" aria-label="Vocabulary question ${_idx + 1} of ${_items.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${_isRecovery ? '🔄' : '📖'} ${escapeHtml(roundLabel)}</span>
        ${_streakBadge()}
        <span class="sfq-progress" aria-label="Question ${_idx + 1} of ${_items.length}">${_idx + 1}/${_items.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${progressPct}%"></div></div>
      <p class="mcq-category-tag">${escapeHtml(_categoryLabel(item.category))}${_difficulty === 'challenge' ? ' · PSLE Challenge' : ''}</p>
      ${_difficulty === 'guided' && item.explain ? `<div class="mcq-learn-tip"><strong>Learn tip:</strong> ${item.explain}</div>` : ''}
      <p class="sfq-instruction">${escapeHtml(item.q)}</p>
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${displayChoices.map(c => `<button class="pt-choice-btn" data-choice="${escapeAttr(c)}" aria-label="Choose ${escapeAttr(c)}">${escapeHtml(c)}</button>`).join('')}
      </div>
      <button class="mcq-hint-btn" id="vmcq-rule-hint" aria-expanded="false">💡 Show Rule</button>
      <div class="mcq-hint-panel" id="vmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="vmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="vmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="vmcq-next" aria-label="Next question"></button>
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

      const stat = _sessionSkillStats[item.category] || (_sessionSkillStats[item.category] = { correct: 0, total: 0 });
      stat.total += 1;
      if (ok) stat.correct += 1;

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
      let hintText = buildMcqFeedbackHtml(item, ans, ok, { showClueWords: _difficulty !== 'challenge' });

      if (ok) {
        _categoryWrong[item.category] = 0;
      } else {
        _categoryWrong[item.category] = (_categoryWrong[item.category] || 0) + 1;
      }

      if (!ok) {
        const suggestion = checkPostAttempt('vocabMcq', item.category, false);
        if (suggestion && suggestion.type === 'redirect') {
          hintText += ` <br>💡 ${escapeHtml(suggestion.message)}`;
        }
      }

      if (!ok && _categoryWrong[item.category] >= 2) {
        const confusionTip = _getVocabTip(item.category);
        hintText += `<br><span class="mcq-struggling-tip"><strong>📚 Rule reminder:</strong> ${escapeHtml(confusionTip.rule)}<br><em>${escapeHtml(confusionTip.example)}</em></span>`;
      }

      if (hint) hint.innerHTML = hintText;

      const nextWrap = _container.querySelector('#vmcq-next-wrap');
      const nextBtn = _container.querySelector('#vmcq-next');
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

  const ruleHintBtn = _container.querySelector('#vmcq-rule-hint');
  const ruleHintPanel = _container.querySelector('#vmcq-hint-panel');
  if (ruleHintBtn && ruleHintPanel) {
    ruleHintBtn.addEventListener('click', () => {
      const wasHidden = ruleHintPanel.hidden;
      ruleHintPanel.hidden = !wasHidden;
      ruleHintBtn.setAttribute('aria-expanded', String(wasHidden));
      ruleHintBtn.textContent = wasHidden ? '💡 Hide Rule' : '💡 Show Rule';
      if (wasHidden) {
        const tip = _getVocabTip(item.category);
        ruleHintPanel.innerHTML = `
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${escapeHtml(tip.rule)}</p>
          <p class="mcq-hint-eg"><em>${escapeHtml(tip.example)}</em></p>
          <p class="mcq-hint-tip">${escapeHtml(tip.tip)}</p>`;
      }
    });
  }
}

// Per-skill breakdown for this session, sorted weakest-first so the child
// can see at a glance which concepts to revisit. Only shown when more than
// one category was practised (a single-skill session needs no breakdown).
function _renderSkillBreakdown() {
  const entries = Object.entries(_sessionSkillStats).filter(([, s]) => s.total > 0);
  if (entries.length === 0) return '';

  const rows = entries
    .map(([cat, s]) => ({ cat, pct: Math.round((s.correct / s.total) * 100), correct: s.correct, total: s.total }))
    .sort((a, b) => a.pct - b.pct)
    .map(({ cat, pct, correct, total }) => {
      const barColour = pct >= 70 ? 'var(--color-success)' : pct >= 40 ? 'var(--color-primary)' : 'var(--color-error)';
      return `
        <tr class="sq-skill-table-row ${pct < 50 ? 'sq-skill-table-row--weak' : ''}">
          <th scope="row" class="sq-skill-name">${escapeHtml(_categoryLabel(cat))}</th>
          <td class="sq-skill-score">${correct}/${total}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${pct}%;background:${barColour}"></div></div></td>
          <td class="sq-skill-pct">${pct}%${pct < 50 ? ' · weak' : ''}</td>
        </tr>`;
    }).join('');

  return `<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function _renderRuleCard(category, onStart) {
  const tip = _getVocabTip(category);
  const meta = VOCAB_CATEGORIES[category] || { icon: '📖', label: category };
  _container.innerHTML = `
    <div class="mcq-rule-card" role="region" aria-label="Vocabulary rule for ${escapeAttr(meta.label)}">
      <div class="mcq-rule-icon">${meta.icon}</div>
      <h2 class="mcq-rule-title">${escapeHtml(meta.label)}</h2>
      <div class="mcq-rule-body">
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">📖 Rule</p>
          <p class="mcq-rule-text">${escapeHtml(tip.rule)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">✏️ Example</p>
          <p class="mcq-rule-example">${escapeHtml(tip.example)}</p>
        </div>
        <div class="mcq-rule-section">
          <p class="mcq-rule-label">💡 Tip</p>
          <p class="mcq-rule-tip">${escapeHtml(tip.tip)}</p>
        </div>
      </div>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="mcq-rule-start">Got it — start quiz →</button>
        <button class="btn btn--ghost" id="mcq-rule-skip">Skip →</button>
      </div>
    </div>`;
  _container.querySelector('#mcq-rule-start')?.addEventListener('click', onStart);
  _container.querySelector('#mcq-rule-skip')?.addEventListener('click', onStart);
}

function _renderDone() {
  const total = _items.length;

  // Edge case: no items were ever served (bad scope/filter). Go back to menu instead of showing a 1-star, 0/0 result.
  if (total === 0) {
    showVocabMcqBrowser();
    return;
  }

  const accuracy = Math.round((_correct / total) * 100);
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy > 0 ? 1 : 0;
  // Allow another recovery attempt even after a recovery round, so a struggling learner
  // isn't left with no way to retry the questions they got wrong.
  const hasMissed = _missed.length > 0;

  const skillRows = _renderSkillBreakdown();

  let focusTip = '';
  if (accuracy < 70) {
    const statEntries = Object.entries(_sessionSkillStats).filter(([, s]) => s.total > 0);
    if (statEntries.length > 0) {
      const [weakCat] = statEntries.sort(([, a], [, b]) => (a.correct / a.total) - (b.correct / b.total))[0];
      const weakTip = _getVocabTip(weakCat);
      const weakMeta = VOCAB_CATEGORIES[weakCat] || { icon: '📖', label: weakCat };
      focusTip = `
        <div class="mcq-focus-tip">
          <p class="mcq-focus-tip-heading">${weakMeta.icon} Focus area: ${escapeHtml(weakMeta.label)}</p>
          <p class="mcq-focus-tip-rule">${escapeHtml(weakTip.rule)}</p>
          <p class="mcq-focus-tip-eg"><em>${escapeHtml(weakTip.example)}</em></p>
          <p class="mcq-focus-tip-tip">${escapeHtml(weakTip.tip)}</p>
        </div>`;
    }
  }

  _container.innerHTML = `
    <div class="sfq-browser" role="region" aria-label="Vocabulary MCQ results">
      <h2 class="sfq-title">${_isRecovery ? '🔄 Recovery Round Complete' : 'Vocabulary MCQ Complete'}</h2>
      <div class="sfq-stars" aria-label="${stars} stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="sfq-instruction">${_correct}/${total} correct · ${accuracy}%</p>
      ${_maxStreak >= 3 ? `<p class="sfq-instruction">${_maxStreak >= 10 ? '🔥' : _maxStreak >= 5 ? '⚡' : '✨'} Best streak: ${_maxStreak} in a row</p>` : ''}
      <p class="sfq-instruction">${accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great work — keep practising!' : accuracy > 0 ? 'Good effort — replay to improve!' : 'Keep trying — you can do it!'}</p>
      ${skillRows}${focusTip}
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
