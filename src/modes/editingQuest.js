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
  _renderCurrent();
}

function _renderCurrent() {
  if (_idx >= _list.length) return _renderComplete();
  const item = _list[_idx];

  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">✏️ ${EDITING_LEVELS[_level]}</span>
        <span class="sfq-progress">${_idx + 1} / ${_list.length}</span>
      </div>
      <h3 class="cloze-title">${item.title}</h3>
      <p class="sfq-instruction">${item.prompt}</p>
      <p class="cloze-passage"><strong>${item.sentence}</strong></p>
      <div class="sfq-bank" id="eq-bank">
        <button class="sfq-word-chip" data-answer="${item.correct}">${item.correct}</button>
        <button class="sfq-word-chip" data-answer="${item.incorrect}">${item.incorrect}</button>
      </div>
      <div class="sfq-feedback" id="eq-feedback" hidden></div>
      <p class="dash-pattern-item">🎯 Rule: ${item.rule}</p>
      <p class="dash-pattern-item">💡 Try This!: ${item.tryThis || 'Use the corrected form in a new sentence.'}</p>
      <div class="sfq-actions">
        <button class="btn btn--ghost btn--sm" id="eq-quit">Menu</button>
      </div>
    </div>`;

  Array.from(document.querySelectorAll('#eq-bank .sfq-word-chip')).forEach(btn => {
    btn.addEventListener('click', () => _submit(item, btn.dataset.answer));
  });
  document.getElementById('eq-quit')?.addEventListener('click', () => {
    cleanupEditingQuest();
    _onGoHome?.();
  });
}

function _submit(item, selected) {
  const correct = selected === item.correct;
  const fb = document.getElementById('eq-feedback');
  if (fb) {
    fb.hidden = false;
    fb.textContent = correct
      ? `✅ Correct! ${item.explanation}`
      : `❌ Not yet. ${item.explanation}`;
  }

  questMastery.updateSkill('editingQuest', item.skill, correct);
  questMastery.recordAttempt({ quest: 'editingQuest', skill: item.skill, correct, level: _level });

  if (correct) {
    const add = item.xp || 20;
    const xp = (store.get('xp') || 0) + add;
    const levelInfo = getLevelInfo(xp);
    store.patch({ xp, level: levelInfo.level });
    audio.playSfx('correct');
  } else {
    audio.playSfx('wrong');
  }

  setTimeout(() => {
    _idx++;
    _renderCurrent();
  }, 1200);
}

function _renderComplete() {
  const completed = { ...(store.get('editingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('editingCompleted', completed);

  _container.innerHTML = `
    <div class="sfq-game">
      <h3>🎉 Editing Quest Complete</h3>
      <p>You practised rule-aware editing for ${EDITING_LEVELS[_level]}.</p>
      <button class="btn btn--primary" id="eq-back">Back to Levels</button>
    </div>`;
  document.getElementById('eq-back')?.addEventListener('click', showEditingBrowser);
}

export function cleanupEditingQuest() {
  if (_container) _container.innerHTML = '';
}
