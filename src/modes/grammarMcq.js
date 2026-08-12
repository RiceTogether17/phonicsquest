import { questMastery } from '../modules/questMastery.js';
import { getDefaultPracticeLevel, isRecommendedLevel } from '../modules/practiceDefaults.js';
import { gamification } from '../modules/gamification.js';
import { store } from '../modules/store.js';
import { GRAMMAR_MCQ_ITEMS, GRAMMAR_MCQ_LEVELS, buildGrammarMcqLevel } from '../data/grammarMcq.js';
import {
  GRAMMAR_CATEGORIES,
  GRAMMAR_CATEGORY_KEYS,
  categoryAppliesToLevel,
} from '../data/grammarCategories.js';
import { checkPostAttempt } from '../modules/remediationRouter.js';
import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';
import { attachMcqAnswerLadder, attachGiriHint } from './mcqFeedback.js';
import {
  filterMcqItemsForDifficulty,
  MCQ_DIFFICULTIES,
  renderMcqDifficultyToggle,
} from './mcqDifficulty.js';
import { getGrammarTip } from '../data/grammarTips.js';
import { MCQ_ROUND_SIZE } from '../constants.js';
import { renderMcqQuickStart } from './mcqBrowserShell.js';

let _container = null;
let _onGoHome = null;
let _items = [];
let _idx = 0;
let _correct = 0;
let _scope = { level: null, category: null, label: 'All Skills', difficulty: 'normal' };
let _difficulty = 'normal';

let _streak = 0;
let _maxStreak = 0;
let _missed = [];
let _isRecovery = false;
let _sessionSkillStats = {}; // category -> { correct, total }
let _ruleCardsShown = 0; // teach-cards shown this session (capped)

/** Max rule cards to interleave per mixed session — a tutor teaches a few
 *  new things per sitting, not every concept at once. */
const MAX_RULE_CARDS_PER_SESSION = 3;

function _lessonKey(category) {
  return `gmcq:${category}`;
}

function _hasBeenTaught(category) {
  return !!(store.get('lessonsSeen') || {})[_lessonKey(category)];
}

function _markTaught(category) {
  const seen = { ...(store.get('lessonsSeen') || {}) };
  if (seen[_lessonKey(category)]) return;
  seen[_lessonKey(category)] = new Date().toISOString();
  store.set('lessonsSeen', seen);
}

export function initGrammarMcq(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function cleanupGrammarMcq() {
  if (_container) _container.innerHTML = '';
}

export function getAllItems(bank = GRAMMAR_MCQ_ITEMS) {
  return GRAMMAR_MCQ_LEVELS.flatMap((level) => bank[level] || []);
}

export function getItemsForScope({ level = null, category = null } = {}, bank = GRAMMAR_MCQ_ITEMS) {
  const source = level ? bank[level] || [] : getAllItems(bank);
  return category ? source.filter((item) => item.category === category) : source;
}

export function countItemsForScope(scope = {}, bank = GRAMMAR_MCQ_ITEMS) {
  return getItemsForScope(scope, bank).length;
}

export function getCategoryCounts(bank = GRAMMAR_MCQ_ITEMS, categories = GRAMMAR_CATEGORY_KEYS) {
  return categories.map((category) => {
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
  return levels.map((level) => ({ level, total: countItemsForScope({ level }, bank) }));
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
  let selectedLevel = _scope.level || getDefaultPracticeLevel();
  let selectedDifficulty = _scope.difficulty || _difficulty || 'normal';

  const render = () => {
    _container.innerHTML = `
      <div class="sfq-browser mcq-browser">
        <h2 class="sfq-title">🧠 Grammar MCQ</h2>
        <p class="sfq-instruction">Pick your level and how much support you want, then practise one grammar skill at a time — or mix them all together.</p>

        ${renderMcqQuickStart({
          prefix: 'gmcq',
          level: selectedLevel,
          recommended: isRecommendedLevel(selectedLevel),
          chooserHtml: `<section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 1 · Select Level</h3>
          <div class="sfq-browser-grid mcq-level-grid">
            ${levelCounts
              .map(
                ({ level, total }) => `
              <button class="sfq-level-btn mcq-level-card ${level === selectedLevel ? 'mcq-level-card--active' : ''}" data-pick-level="${level}">
                ${isRecommendedLevel(level) ? '<span class="mcq-level-rec" aria-label="Recommended level">⭐ For you</span>' : ''}
                <span class="sfq-level-name">${level}</span>
                <span class="mcq-count-badge">${total} items</span>
              </button>
            `,
              )
              .join('')}
          </div>
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 2 · Choose Support</h3>
          ${renderMcqDifficultyToggle({ selected: selectedDifficulty, prefix: 'gmcq' })}
        </section>

        <section class="mcq-browser-section">
          <h3 class="mcq-browser-heading">Step 3 · ${selectedLevel} Grammar Concepts</h3>
          <p class="mcq-browser-hint">New to a skill? Tap its card — you'll see the rule and an example before the questions begin.</p>
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
              })
              .join('')}
          </div>
        </section>`,
        })}

        <div class="sfq-actions"><button class="btn btn--ghost" id="gmcq-home">← Home</button></div>
      </div>`;

    _container.querySelector('#gmcq-quick-start')?.addEventListener('click', () => {
      _startScope({ level: selectedLevel, category: null, difficulty: selectedDifficulty });
    });

    _container.querySelectorAll('[data-pick-level]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedLevel = btn.dataset.pickLevel;
        render();
      });
    });

    _container.querySelectorAll('[data-gmcq-difficulty]').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedDifficulty = btn.dataset.gmcqDifficulty;
        render();
      });
    });

    _container.querySelector('#gmcq-start-level')?.addEventListener('click', () => {
      _startScope({ level: selectedLevel, category: null, difficulty: selectedDifficulty });
    });

    _container.querySelectorAll('[data-scope-level][data-scope-category]').forEach((btn) => {
      btn.addEventListener('click', () => {
        _startScope({
          level: btn.dataset.scopeLevel,
          category: btn.dataset.scopeCategory,
          difficulty: selectedDifficulty,
        });
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
    return sa - sb + (Math.random() - 0.5) * 0.3;
  });
}

function _startScope({ level = null, category = null, label = '', difficulty = _difficulty } = {}) {
  _difficulty = MCQ_DIFFICULTIES[difficulty]?.key || 'normal';
  _scope = {
    level,
    category,
    label: label || _scopeLabel({ level, category }),
    difficulty: _difficulty,
  };

  // Rebuild items fresh each session so the random seed varies (not frozen at module load).
  const freshBank = level
    ? { [level]: buildGrammarMcqLevel(level) }
    : Object.fromEntries(GRAMMAR_MCQ_LEVELS.map((l) => [l, GRAMMAR_MCQ_ITEMS[l]]));
  _items = _adaptiveShuffle(
    filterMcqItemsForDifficulty(getItemsForScope({ level, category }, freshBank), {
      level,
      difficulty: _difficulty,
    }),
  );

  // Paper Mode sets its own length; everything else gets a finishable round
  // rather than the whole bank. See MCQ_ROUND_SIZE in constants.js.
  const limit = store.get('paperItemLimit');
  store.set('paperItemLimit', null);
  _items = _items.slice(0, limit || MCQ_ROUND_SIZE);

  _idx = 0;
  _correct = 0;
  _streak = 0;
  _maxStreak = 0;
  _missed = [];
  _sessionSkillStats = {};
  _isRecovery = false;
  _ruleCardsShown = 0;
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
  _ruleCardsShown = MAX_RULE_CARDS_PER_SESSION; // recovery rounds don't re-teach
  _renderQuestion();
}

export function startGrammarMcqLevel(level, difficulty = _difficulty) {
  if (!_container) return;
  _startScope({ level, category: null, label: level, difficulty });
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
      ${item.clueWords.map((w) => `<span class="mcq-clue-chip">${escapeHtml(w)}</span>`).join(' ')}
    </div>
  `;
}

/** Explicit task instruction, the way a teacher frames a question before pupils
 *  attempt it. Fill-in-the-blank stems and direct questions need different framing. */
function _taskInstruction(item) {
  return /___/.test(item.q || '')
    ? 'Read the whole sentence first, then choose the word that fits the blank.'
    : 'Read the question carefully, then choose the best answer.';
}

function _renderQuestion() {
  if (!_container) return;
  const item = _items[_idx];
  if (!item) return _renderDone();

  // Teach before practice: the first time this profile meets a category in a
  // mixed session, show its rule card first (scoped sessions teach at start).
  if (!_hasBeenTaught(item.category) && _ruleCardsShown < MAX_RULE_CARDS_PER_SESSION) {
    return _renderRuleCard(item.category, () => _renderQuestion());
  }

  const progressPct = Math.round((_idx / _items.length) * 100);
  const roundLabel = _isRecovery ? `Recovery · ${_scope.label}` : _scope.label;

  // Shuffle choices at render time so position doesn't become a memory cue on replays.
  const displayChoices = [...item.choices].sort(() => Math.random() - 0.5);

  _container.innerHTML = `
    <div class="mcq-game" role="region" aria-label="Grammar question ${_idx + 1} of ${_items.length}">
      <div class="sfq-header">
        <span class="sfq-badge">${_isRecovery ? '🔄' : '🧠'} ${escapeHtml(roundLabel)}</span>
        ${_streakBadge()}
        <span class="sfq-progress" aria-label="Question ${_idx + 1} of ${_items.length}">${_idx + 1}/${_items.length}</span>
      </div>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${progressPct}%"></div></div>
      <p class="mcq-category-tag">${escapeHtml(_categoryLabel(item.category))}${_difficulty === 'challenge' ? ' · PSLE Challenge' : ''}</p>
      ${_difficulty === 'guided' && item.explain ? `<div class="mcq-learn-tip"><strong>📖 Before you answer:</strong> ${item.explain}</div>` : ''}
      <p class="mcq-task-instruction">${_taskInstruction(item)}</p>
      <p class="sfq-instruction">${escapeHtml(item.q)}</p>
      ${_difficulty === 'guided' ? _renderClueWords(item) : ''}
      <div class="pt-choices" role="group" aria-label="Answer choices">
        ${displayChoices.map((c) => `<button class="pt-choice-btn" data-choice="${escapeAttr(c)}" aria-label="Choose ${escapeAttr(c)}">${escapeHtml(c)}</button>`).join('')}
      </div>
      <button class="mcq-hint-btn" id="gmcq-rule-hint" aria-expanded="false">💡 Stuck? Show the rule</button>
      <div class="mcq-hint-panel" id="gmcq-hint-panel" hidden></div>
      <p class="pt-grammar-hint" id="gmcq-hint" role="status" aria-live="polite"></p>
      <div class="vmcq-next-wrap" id="gmcq-next-wrap" style="display:none">
        <button class="btn btn--primary vmcq-next-btn" id="gmcq-next" aria-label="Next question"></button>
      </div>
    </div>`;

  const nextWrap = _container.querySelector('#gmcq-next-wrap');
  const nextBtn = _container.querySelector('#gmcq-next');
  if (nextBtn) {
    const isLast = _idx + 1 >= _items.length;
    nextBtn.textContent = isLast ? 'See Results →' : 'Next →';
    nextBtn.setAttribute('aria-label', isLast ? 'See results' : 'Next question');
    nextBtn.addEventListener('click', () => {
      _idx += 1;
      _renderQuestion();
    });
  }

  attachMcqAnswerLadder({
    root: _container,
    item,
    feedbackEl: _container.querySelector('#gmcq-hint'),
    nextWrap,
    nextBtn,
    mode: 'grammarMcq',
    domain: 'grammar',
    skillLabel: _categoryLabel(item.category),
    level: _scope.level || item.level,
    showClueWords: _difficulty !== 'challenge',
    tip: getGrammarTip(item.category),

    // The mark is the first attempt. A child who self-corrects on the second
    // look has still shown they did not know it cold, and the mastery score
    // must keep saying so.
    onFirstAttempt: (ok) => {
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

      const stat =
        _sessionSkillStats[item.category] ||
        (_sessionSkillStats[item.category] = { correct: 0, total: 0 });
      stat.total += 1;
      if (ok) stat.correct += 1;

      questMastery.updateSkill('grammarMcq', item.category, ok);
      questMastery.recordAttempt({
        quest: 'grammarMcq',
        skill: item.category,
        correct: ok,
        level: _scope.level || 'Mixed',
      });
    },

    extraHtml: (_chosen, ok) => {
      if (ok) return '';
      let html = '';
      const suggestion = checkPostAttempt('grammarMcq', item.category, false);
      if (suggestion && suggestion.type === 'redirect') {
        html += `<p class="tf-section tf-section--redirect"><span class="tf-section__icon" aria-hidden="true">🧭</span> ${escapeHtml(suggestion.message)}</p>`;
      }
      return html;
    },
  });

  const ruleHintBtn = _container.querySelector('#gmcq-rule-hint');
  const ruleHintPanel = _container.querySelector('#gmcq-hint-panel');
  if (ruleHintBtn && ruleHintPanel) {
    ruleHintBtn.addEventListener('click', () => {
      const wasHidden = ruleHintPanel.hidden;
      ruleHintPanel.hidden = !wasHidden;
      ruleHintBtn.setAttribute('aria-expanded', String(wasHidden));
      ruleHintBtn.textContent = wasHidden ? '💡 Hide the rule' : '💡 Stuck? Show the rule';
      if (wasHidden) {
        const tip = getGrammarTip(item.category);
        ruleHintPanel.innerHTML = `
          <p class="mcq-hint-rule"><strong>Rule:</strong> ${escapeHtml(tip.rule)}</p>
          <p class="mcq-hint-eg"><em>${escapeHtml(tip.example)}</em></p>
          <p class="mcq-hint-tip">${escapeHtml(tip.tip)}</p>`;
        attachGiriHint(ruleHintPanel, {
          item,
          categoryLabel: GRAMMAR_CATEGORIES[item.category]?.label || item.category,
          level: _scope.level || item.level,
        });
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
    .map(([cat, s]) => ({
      cat,
      pct: Math.round((s.correct / s.total) * 100),
      correct: s.correct,
      total: s.total,
    }))
    .sort((a, b) => a.pct - b.pct)
    .map(({ cat, pct, correct, total }) => {
      const barColour =
        pct >= 70
          ? 'var(--color-success)'
          : pct >= 40
            ? 'var(--color-primary)'
            : 'var(--color-error)';
      return `
        <tr class="sq-skill-table-row ${pct < 50 ? 'sq-skill-table-row--weak' : ''}">
          <th scope="row" class="sq-skill-name">${escapeHtml(_categoryLabel(cat))}</th>
          <td class="sq-skill-score">${correct}/${total}</td>
          <td><div class="sq-skill-track" aria-hidden="true"><div class="sq-skill-bar" style="width:${pct}%;background:${barColour}"></div></div></td>
          <td class="sq-skill-pct">${pct}%${pct < 50 ? ' · weak' : ''}</td>
        </tr>`;
    })
    .join('');

  return `<h4 class="sq-skills-heading">Skill breakdown</h4><table class="sq-skills-table"><thead><tr><th>Skill</th><th>Score</th><th>Progress</th><th>Accuracy</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function _renderRuleCard(category, onStart) {
  _ruleCardsShown += 1;
  _markTaught(category);
  const tip = getGrammarTip(category);
  const meta = GRAMMAR_CATEGORIES[category] || { icon: '🧠', label: category };
  _container.innerHTML = `
    <div class="mcq-rule-card" role="region" aria-label="Grammar rule for ${escapeAttr(meta.label)}">
      <div class="mcq-rule-icon">${meta.icon}</div>
      <h2 class="mcq-rule-title">${escapeHtml(meta.label)}</h2>
      <p class="mcq-rule-intro">A quick lesson before you practise — read it once, then try the questions.</p>
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
        <button class="btn btn--ghost" id="mcq-rule-skip">I know this rule — skip →</button>
      </div>
    </div>`;
  _container.querySelector('#mcq-rule-start')?.addEventListener('click', onStart);
  _container.querySelector('#mcq-rule-skip')?.addEventListener('click', onStart);
}

function _renderDone() {
  const total = _items.length;

  // Edge case: no items were ever served (bad scope/filter). Go back to menu instead of showing a 1-star, 0/0 result.
  if (total === 0) {
    showGrammarMcqBrowser();
    return;
  }

  const accuracy = Math.round((_correct / total) * 100);
  const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy > 0 ? 1 : 0;
  // Allow another recovery attempt even after a recovery round, so a struggling learner
  // isn't left with no way to retry the questions they got wrong.
  const hasMissed = _missed.length > 0;

  // A teacher always names the next step, not just the score.
  const nextSteps = [];
  if (hasMissed) {
    nextSteps.push(
      `Start with the Recovery Round — it replays only the ${_missed.length} question${_missed.length === 1 ? '' : 's'} you missed, while they are still fresh in your mind.`,
    );
  }
  if (accuracy < 70 && _difficulty !== 'guided') {
    nextSteps.push(
      'If this round felt hard, switch to Learn mode — you will see each rule before you answer.',
    );
  } else if (accuracy >= 90 && _difficulty !== 'challenge' && !hasMissed) {
    nextSteps.push(
      'You have mastered this round — try PSLE Challenge mode for exam-style questions without clue words.',
    );
  }
  const nextStepHtml = nextSteps.length
    ? `<p class="mcq-next-step">🧑‍🏫 <strong>Teacher's tip:</strong> ${nextSteps.join(' ')}</p>`
    : '';

  const skillRows = _renderSkillBreakdown();

  let focusTip = '';
  if (accuracy < 70) {
    const statEntries = Object.entries(_sessionSkillStats).filter(([, s]) => s.total > 0);
    if (statEntries.length > 0) {
      const [weakCat] = statEntries.sort(
        ([, a], [, b]) => a.correct / a.total - b.correct / b.total,
      )[0];
      const weakTip = getGrammarTip(weakCat);
      const weakMeta = GRAMMAR_CATEGORIES[weakCat] || { icon: '🧠', label: weakCat };
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
    <div class="sfq-browser" role="region" aria-label="Grammar MCQ results">
      <h2 class="sfq-title">${_isRecovery ? '🔄 Recovery Round Complete' : 'Grammar MCQ Complete'}</h2>
      <div class="sfq-stars" aria-label="${stars} stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      <p class="sfq-instruction">${_correct}/${total} correct · ${accuracy}%</p>
      ${_maxStreak >= 3 ? `<p class="sfq-instruction">${_maxStreak >= 10 ? '🔥' : _maxStreak >= 5 ? '⚡' : '✨'} Best streak: ${_maxStreak} in a row</p>` : ''}
      <p class="sfq-instruction">${accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great work — keep practising!' : accuracy > 0 ? 'Good effort — mistakes are how we learn!' : 'Keep trying — you can do it!'}</p>
      ${skillRows}${focusTip}${nextStepHtml}
      <div class="sfq-actions">
        ${hasMissed ? `<button class="btn btn--primary" id="gmcq-recovery">🔄 Recovery Round (${_missed.length})</button>` : ''}
        <button class="btn ${hasMissed ? 'btn--ghost' : 'btn--primary'}" id="gmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="gmcq-menu">Back to Skill Menu</button>
      </div>
    </div>`;

  if (hasMissed)
    _container.querySelector('#gmcq-recovery')?.addEventListener('click', () => _startRecovery());
  _container.querySelector('#gmcq-replay')?.addEventListener('click', () => _startScope(_scope));
  _container.querySelector('#gmcq-menu')?.addEventListener('click', () => showGrammarMcqBrowser());
}
