import { EDITING_LEVELS, editingPassages } from '../data/editingPassages.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { audio } from '../modules/audio.js';
import { getLevelInfo } from '../data/curriculum.js';

let _container = null;
let _onGoHome = null;
let _level = 1;
let _idx = 0;
let _list = [];
let _errorIndex = 0;
let _grammarCorrect = 0;
let _spellingCorrect = 0;

export function initEditingQuest(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function showEditingBrowser() {
  if (!_container) return;
  const completed = store.get('editingCompleted') || {};
  _container.innerHTML = `
    <div class="sfq-browser"><div class="sfq-browser-grid">
      ${Object.entries(EDITING_LEVELS).map(([k, label]) => {
        const total = (editingPassages[k] || []).length;
        const done = completed[k] || 0;
        return `<button class="sfq-level-btn" data-level="${k}">
          <span class="sfq-level-icon">✏️</span>
          <span class="sfq-level-name">${label}</span>
          <span class="sfq-level-count">${Math.min(done, total)} / ${total}</span>
        </button>`;
      }).join('')}
    </div></div>`;

  _container.querySelectorAll('[data-level]').forEach(btn => {
    btn.addEventListener('click', () => _startLevel(Number(btn.dataset.level)));
  });
}

function _startLevel(level) {
  _level = level;
  _list = [...(editingPassages[level] || [])];
  _idx = 0;
  _renderCurrentPassage();
}

function _renderCurrentPassage() {
  if (_idx >= _list.length) return _renderComplete();
  _errorIndex = 0;
  _grammarCorrect = 0;
  _spellingCorrect = 0;
  _renderErrorStep();
}

function _renderErrorStep() {
  const item = _list[_idx];
  const error = item.errors[_errorIndex];
  if (!error) {
    _finishPassage(item);
    return;
  }

  const totalErrors = item.errors.length;
  const progressPct = Math.round(((_errorIndex + 1) / totalErrors) * 100);

  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">✏️ ${EDITING_LEVELS[_level]}</span>
        <span class="sfq-progress">Passage ${_idx + 1} / ${_list.length}</span>
      </div>
      <h3 class="cloze-title">${item.title}</h3>
      <p class="sq-phase-label">PSLE-style editing: item ${_errorIndex + 1} of ${totalErrors}</p>
      <div class="sq-progress-bar"><div class="sq-progress-fill" style="width:${progressPct}%"></div></div>
      <p class="cloze-passage"><strong>${item.paragraph}</strong></p>

      <div class="sq-question-card">
        <p class="sq-question-text">Target word: <strong>${error.token}</strong></p>
        <p class="dash-pattern-item">Step 1: Choose error type</p>
        <div class="sfq-bank" id="eq-type-bank">
          <button class="sfq-word-chip" data-type="grammar">Grammar</button>
          <button class="sfq-word-chip" data-type="spelling">Spelling</button>
        </div>
      </div>

      <div id="eq-correction-wrap" hidden>
        <p class="dash-pattern-item">Step 2: Enter correction</p>
        <input id="eq-correction-input" class="cp-name-input" placeholder="Type corrected word/phrase" />
        <div class="sfq-actions" style="margin-top:8px">
          <button class="btn btn--primary" id="eq-submit-correction">Submit correction</button>
        </div>
      </div>

      <details style="margin-top:8px"><summary>Grammar rules quick reference</summary>
        <ul>
          <li>Subject-verb agreement: singular subject → singular verb.</li>
          <li>Tense consistency: follow time markers (yesterday, last week).</li>
          <li>Prepositions: choose by meaning and collocation.</li>
          <li>Spelling: check doubled consonants and vowel patterns.</li>
        </ul>
      </details>

      <div class="sfq-feedback" id="eq-feedback" hidden></div>
      <div class="dash-pattern-item">💡 Try This! Tier 1: ${item.tryThis?.[0] || 'Write one corrected sentence.'}</div>
      <div class="dash-pattern-item">🚀 Try This! Tier 2: ${item.tryThis?.[1] || 'Explain one rule to a classmate.'}</div>

      <div class="sfq-actions">
        <button class="btn btn--ghost btn--sm" id="eq-quit">Menu</button>
      </div>
    </div>`;

  const typeButtons = Array.from(document.querySelectorAll('#eq-type-bank .sfq-word-chip'));
  const correctionWrap = document.getElementById('eq-correction-wrap');
  let selectedType = null;

  typeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      selectedType = btn.dataset.type;
      typeButtons.forEach(b => b.classList.toggle('sfq-word-chip--used', b === btn));
      if (correctionWrap) correctionWrap.hidden = false;
    });
  });

  document.getElementById('eq-submit-correction')?.addEventListener('click', () => {
    const typed = /** @type {HTMLInputElement|null} */ (document.getElementById('eq-correction-input'))?.value?.trim() || '';
    _submitError(item, error, selectedType, typed);
  });

  document.getElementById('eq-quit')?.addEventListener('click', () => {
    cleanupEditingQuest();
    _onGoHome?.();
  });
}

function _submitError(item, error, selectedType, typedCorrection) {
  const fb = document.getElementById('eq-feedback');
  if (!selectedType || !typedCorrection) {
    if (fb) {
      fb.hidden = false;
      fb.className = 'sfq-feedback sfq-feedback--error';
      fb.textContent = 'Choose error type and enter a correction first.';
    }
    return;
  }

  const accepted = error.accepted || [error.correction];
  const typeCorrect = selectedType === error.type;
  const correctionCorrect = accepted.some(a => a.toLowerCase() === typedCorrection.toLowerCase());
  const correct = typeCorrect && correctionCorrect;

  if (error.type === 'grammar' && correct) _grammarCorrect++;
  if (error.type === 'spelling' && correct) _spellingCorrect++;

  questMastery.updateSkill('editingQuest', error.rule || error.type, correct);
  questMastery.recordAttempt({ quest: 'editingQuest', skill: error.rule || error.type, correct, level: _level });

  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${correct ? 'success' : 'error'}`;
    fb.textContent = correct
      ? `✅ Correct (${error.type}). ${error.explanation}`
      : `❌ Not yet. Type: ${error.type}. Correction: ${error.correction}. ${error.explanation}`;
  }

  audio.playSfx(correct ? 'correct' : 'wrong');

  setTimeout(() => {
    _errorIndex++;
    _renderErrorStep();
  }, 1000);
}

function _finishPassage(item) {
  const totalGrammar = item.errors.filter(e => e.type === 'grammar').length;
  const totalSpelling = item.errors.filter(e => e.type === 'spelling').length;
  const accuracy = (_grammarCorrect + _spellingCorrect) / Math.max(item.errors.length, 1);
  const xpGain = Math.round((item.xp || 50) * accuracy);

  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  store.patch({ xp, level: levelInfo.level });

  _container.innerHTML = `
    <div class="sfq-game">
      <h3>✅ Passage complete</h3>
      <p>Grammar: ${_grammarCorrect}/${totalGrammar} · Spelling: ${_spellingCorrect}/${totalSpelling}</p>
      <p>XP earned: +${xpGain}</p>
      <p class="dash-pattern-item">📘 Missed rules are highlighted in feedback above; retry for 80%+ mastery.</p>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="eq-next-passage">Next passage →</button>
      </div>
    </div>`;

  document.getElementById('eq-next-passage')?.addEventListener('click', () => {
    _idx++;
    _renderCurrentPassage();
  });
}

function _renderComplete() {
  const completed = { ...(store.get('editingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('editingCompleted', completed);

  _container.innerHTML = `
    <div class="sfq-game">
      <h3>🎉 Editing Quest Complete</h3>
      <p>You completed PSLE-style grammar + spelling editing drills for ${EDITING_LEVELS[_level]}.</p>
      <button class="btn btn--primary" id="eq-back">Back to Levels</button>
    </div>`;

  document.getElementById('eq-back')?.addEventListener('click', showEditingBrowser);
}

export function cleanupEditingQuest() {
  if (_container) _container.innerHTML = '';
}
