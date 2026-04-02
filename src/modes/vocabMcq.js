import { questMastery } from '../modules/questMastery.js';
import { VOCAB_MCQ_ITEMS, VOCAB_MCQ_LEVELS } from '../data/vocabMcq.js';

let _container = null;
let _onGoHome = null;
let _level = 'P1';
let _items = [];
let _idx = 0;
let _correct = 0;

export function initVocabMcq(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

export function cleanupVocabMcq() {
  if (_container) _container.innerHTML = '';
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

function _start(level) {
  _level = level;
  _items = [...(VOCAB_MCQ_ITEMS[level] || [])].sort(() => Math.random() - 0.5);
  _idx = 0;
  _correct = 0;
  _renderQuestion();
}

function _renderQuestion() {
  const item = _items[_idx];
  if (!item) return _renderDone();

  _container.innerHTML = `
    <div class="sfq-game-wrap">
      <div class="sfq-game-head"><span class="sfq-badge">📖 ${_level}</span><span>${_idx + 1}/${_items.length}</span></div>
      <p class="sfq-instruction">${item.q}</p>
      <div class="pt-choices">
        ${item.choices.map(c => `<button class="pt-choice-btn" data-choice="${c}">${c}</button>`).join('')}
      </div>
      <p class="pt-grammar-hint" id="vmcq-hint"></p>
    </div>`;

  _container.querySelectorAll('[data-choice]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ans = btn.dataset.choice;
      const ok = ans === item.answer;
      if (ok) _correct++;
      questMastery.updateSkill('vocabMcq', item.skill, ok);
      questMastery.recordAttempt({ quest: 'vocabMcq', skill: item.skill, correct: ok, level: _level });
      const hint = _container.querySelector('#vmcq-hint');
      if (hint) hint.textContent = `${ok ? '✅ Correct.' : `❌ Correct answer: ${item.answer}.`} ${item.explain}`;
      setTimeout(() => {
        _idx += 1;
        _renderQuestion();
      }, 900);
    });
  });
}

function _renderDone() {
  _container.innerHTML = `
    <div class="sfq-browser">
      <h2 class="sfq-title">Vocabulary MCQ complete</h2>
      <p class="sfq-instruction">Score: ${_correct}/${_items.length}</p>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="vmcq-replay">Replay</button>
        <button class="btn btn--ghost" id="vmcq-menu">Levels</button>
      </div>
    </div>`;
  _container.querySelector('#vmcq-replay')?.addEventListener('click', () => _start(_level));
  _container.querySelector('#vmcq-menu')?.addEventListener('click', () => showVocabMcqBrowser());
}
