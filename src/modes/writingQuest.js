import { WRITING_LEVELS, writingPrompts } from '../data/writingPrompts.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { getLevelInfo } from '../data/curriculum.js';

let _container = null;
let _onGoHome = null;
let _level = 1;
let _idx = 0;
let _list = [];

export function initWritingQuest(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function showWritingBrowser() {
  if (!_container) return;
  const completed = store.get('writingCompleted') || {};
  _container.innerHTML = `<div class="sfq-browser"><div class="sfq-browser-grid">${Object.entries(WRITING_LEVELS).map(([k, label]) => {
    const total = (writingPrompts[k] || []).length;
    const done = completed[k] || 0;
    return `<button class="sfq-level-btn" data-level="${k}"><span class="sfq-level-icon">📝</span><span class="sfq-level-name">${label}</span><span class="sfq-level-count">${Math.min(done, total)} / ${total}</span></button>`;
  }).join('')}</div></div>`;
  _container.querySelectorAll('[data-level]').forEach(btn => btn.addEventListener('click', () => _startLevel(Number(btn.dataset.level))));
}

function _startLevel(level) {
  _level = level;
  _list = [...(writingPrompts[level] || [])];
  _idx = 0;
  _render();
}

function _render() {
  if (_idx >= _list.length) return _renderDone();
  const item = _list[_idx];
  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">📝 ${WRITING_LEVELS[_level]}</span>
        <span class="sfq-progress">${_idx + 1} / ${_list.length}</span>
      </div>
      <h3 class="cloze-title">Writing Quest</h3>
      <p class="sfq-instruction">${item.prompt}</p>
      <p class="dash-pattern-item">🧰 Support words: ${item.supportWords.join(', ')}</p>
      <textarea id="wq-text" class="cp-name-input" rows="6" placeholder="Write your response here..."></textarea>
      <div class="dash-pattern-item" style="margin-top:10px"><strong>Rubric</strong><ul>${item.rubric.map(r => `<li>${r}</li>`).join('')}</ul></div>
      <label class="toggle-row"><span>Peer review mode</span><span class="toggle-wrap"><input type="checkbox" id="wq-peer" role="switch"><span class="toggle-track" aria-hidden="true"></span></span></label>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="wq-submit">Submit</button>
        <button class="btn btn--ghost btn--sm" id="wq-menu">Menu</button>
      </div>
      <div class="sfq-feedback" id="wq-feedback" hidden></div>
    </div>`;

  document.getElementById('wq-submit')?.addEventListener('click', () => _submit(item));
  document.getElementById('wq-menu')?.addEventListener('click', () => { cleanupWritingQuest(); _onGoHome?.(); });
}

function _submit(item) {
  const text = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('wq-text'))?.value?.trim() || '';
  const peer = /** @type {HTMLInputElement|null} */ (document.getElementById('wq-peer'))?.checked || false;
  const fb = document.getElementById('wq-feedback');
  if (!text) {
    if (fb) {
      fb.hidden = false;
      fb.className = 'sfq-feedback sfq-feedback--error';
      fb.textContent = 'Write at least one sentence before submitting.';
    }
    return;
  }

  const passesLength = text.split(/\s+/).length >= (_level === 1 ? 6 : _level === 2 ? 15 : 25);
  const hasPunctuation = /[.!?]$/.test(text);
  const score = (passesLength ? 0.6 : 0.3) + (hasPunctuation ? 0.4 : 0.1);
  const correct = score >= 0.7;

  questMastery.updateSkill('writingQuest', 'composition', correct);
  questMastery.recordAttempt({ quest: 'writingQuest', skill: 'composition', correct, level: _level });

  const xpGain = correct ? (item.xp || 25) : Math.floor((item.xp || 25) / 2);
  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  store.patch({ xp, level: levelInfo.level });

  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${correct ? 'success' : 'error'}`;
    fb.textContent = `${correct ? '✅ Great draft!' : '🟡 Good start.'} Sample: ${item.sampleAnswer} ${peer ? ' | Peer review enabled: ask a classmate to tick rubric checks.' : ''} | Try This: ${item.tryThis}`;
  }

  setTimeout(() => {
    _idx++;
    _render();
  }, 1500);
}

function _renderDone() {
  const completed = { ...(store.get('writingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('writingCompleted', completed);
  _container.innerHTML = `<div class="sfq-game"><h3>🎉 Writing Quest complete</h3><button class="btn btn--primary" id="wq-back">Back to Levels</button></div>`;
  document.getElementById('wq-back')?.addEventListener('click', showWritingBrowser);
}

export function cleanupWritingQuest() {
  if (_container) _container.innerHTML = '';
}
