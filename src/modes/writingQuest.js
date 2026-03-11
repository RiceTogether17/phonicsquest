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

  const pacBlock = item.pac ? `
    <div class="dash-pattern-item"><strong>PAC</strong><br>
      Purpose: ${item.pac.purpose}<br>
      Audience: ${item.pac.audience}<br>
      Context: ${item.pac.context}
    </div>` : '';

  const storyPlanBlock = item.storyPlan ? `
    <div class="dash-pattern-item"><strong>5-part story planning</strong>
      <ul>
        <li>Introduction: ${item.storyPlan.introduction}</li>
        <li>Rising Action: ${item.storyPlan.risingAction}</li>
        <li>Climax: ${item.storyPlan.climax}</li>
        <li>Falling Action: ${item.storyPlan.fallingAction}</li>
        <li>Resolution: ${item.storyPlan.resolution}</li>
      </ul>
    </div>` : '';

  const requiredPoints = item.requiredPoints?.length
    ? `<div class="dash-pattern-item"><strong>Must include:</strong> ${item.requiredPoints.join(' · ')}</div>`
    : '';

  _container.innerHTML = `
    <div class="sfq-game">
      <div class="sfq-header">
        <span class="sfq-badge">📝 ${WRITING_LEVELS[_level]}</span>
        <span class="sfq-progress">${_idx + 1} / ${_list.length}</span>
      </div>
      <h3 class="cloze-title">Writing Quest (${item.textType})</h3>
      <p class="sfq-instruction">${item.prompt}</p>
      ${pacBlock}
      ${storyPlanBlock}
      ${requiredPoints}
      <p class="dash-pattern-item">🧰 Support words: ${item.supportWords.join(', ')}</p>
      <textarea id="wq-text" class="cp-name-input" rows="8" placeholder="Write your response here..."></textarea>
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

  const words = text.split(/\s+/).length;
  const hasPunctuation = /[.!?]$/.test(text);
  const requiredHits = (item.requiredPoints || []).filter(p => text.toLowerCase().includes(p.split(' ')[0].toLowerCase())).length;

  const lengthTarget = _level === 1 ? 60 : _level === 2 ? 100 : 150;
  const lengthScore = Math.min(words / lengthTarget, 1);
  const punctuationScore = hasPunctuation ? 1 : 0.4;
  const contentScore = item.requiredPoints?.length ? requiredHits / item.requiredPoints.length : 0.8;
  const score = (lengthScore * 0.4) + (punctuationScore * 0.2) + (contentScore * 0.4);
  const correct = score >= 0.7;

  questMastery.updateSkill('writingQuest', item.mode || 'composition', correct);
  questMastery.recordAttempt({ quest: 'writingQuest', skill: item.mode || 'composition', correct, level: _level });

  const xpGain = correct ? (item.xp || 25) : Math.floor((item.xp || 25) / 2);
  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  store.patch({ xp, level: levelInfo.level });

  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${correct ? 'success' : 'error'}`;
    fb.textContent = `${correct ? '✅ Strong draft.' : '🟡 Draft needs revision.'} Score ${(score * 100).toFixed(0)}%. Sample: ${item.sampleAnswer} ${peer ? ' | Peer review: partner checks rubric rows.' : ''} | Try This Tier 1: ${item.tryThis?.[0] || ''} | Tier 2: ${item.tryThis?.[1] || ''}`;
  }

  setTimeout(() => {
    _idx++;
    _render();
  }, 1800);
}

function _renderDone() {
  const completed = { ...(store.get('writingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('writingCompleted', completed);
  _container.innerHTML = `<div class="sfq-game"><h3>🎉 Writing Quest complete</h3><p>You practised PAC planning, organisation, and language accuracy.</p><button class="btn btn--primary" id="wq-back">Back to Levels</button></div>`;
  document.getElementById('wq-back')?.addEventListener('click', showWritingBrowser);
}

export function cleanupWritingQuest() {
  if (_container) _container.innerHTML = '';
}
