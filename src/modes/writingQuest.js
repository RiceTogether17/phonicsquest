import { WRITING_LEVELS, writingPrompts } from '../data/writingPrompts.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { getLevelInfo } from '../data/curriculum.js';

let _container = null;
let _onGoHome = null;
let _level = 1;
let _idx = 0;
let _list = [];
let _sessionStats = _newSessionStats();

function _newSessionStats() {
  return {
    promptsCompleted: 0,
    totalScore: 0,
    starsEarned: 0,
    peerReviews: 0,
    revisionsSuggested: 0,
    strongestDimension: 'content',
    weakestDimension: 'language',
  };
}


function _getLengthTarget(level) {
  if (level <= 1) return 35;
  if (level === 2) return 55;
  if (level === 3) return 80;
  if (level === 4) return 110;
  if (level === 5) return 150;
  return 190;
}

export function getWritingLiveFeedback(item, text, level) {
  const result = evaluateWritingSubmission(item, text, level);
  const { strongest, weakest } = _findStrongWeak(result.dimensions);
  return {
    result,
    strongest,
    weakest,
    tip: _dimensionAdvice(weakest),
    progressLabel: `Words ${result.words}/${_getLengthTarget(level)}`,
  };
}
export function evaluateWritingSubmission(item, text, level) {
  const normalized = (text || '').trim();
  const words = normalized ? normalized.split(/\s+/).length : 0;
  const sentences = normalized
    .split(/[.!?]+/)
    .map(s => s.trim())
    .filter(Boolean);
  const sentenceCount = sentences.length;

  const hasEndingPunctuation = /[.!?]$/.test(normalized);
  const connectors = ['because', 'although', 'however', 'therefore', 'meanwhile', 'finally', 'consequently', 'moreover', 'but', 'so'];
  const connectorHits = connectors.reduce((count, word) => count + (normalized.toLowerCase().includes(word) ? 1 : 0), 0);

  const requiredPoints = item.requiredPoints || [];
  const requiredHits = requiredPoints.filter((p) => normalized.toLowerCase().includes(p.split(' ')[0].toLowerCase())).length;

  const lengthTarget = _getLengthTarget(level);

  const content = Math.min(1, ((requiredPoints.length ? requiredHits / requiredPoints.length : 0.6) * 0.7) + (Math.min(words / lengthTarget, 1) * 0.3));
  const organisation = Math.min(1, ((Math.min(sentenceCount / 5, 1) * 0.6) + (Math.min(connectorHits / 3, 1) * 0.4)));
  const language = Math.min(1, ((hasEndingPunctuation ? 0.5 : 0.2) + (Math.min(words / (lengthTarget * 0.85), 1) * 0.2) + (Math.min(connectorHits / 4, 1) * 0.3)));
  const taskFulfilment = Math.min(1, ((requiredPoints.length ? requiredHits / requiredPoints.length : 0.7) * 0.8) + (hasEndingPunctuation ? 0.2 : 0));

  const weighted = (content * 0.3) + (organisation * 0.25) + (language * 0.25) + (taskFulfilment * 0.2);

  return {
    words,
    sentenceCount,
    requiredHits,
    requiredTotal: requiredPoints.length,
    dimensions: {
      content,
      organisation,
      language,
      taskFulfilment,
    },
    score: weighted,
    passed: weighted >= 0.72,
  };
}

function _dimensionLabel(key) {
  if (key === 'taskFulfilment') return 'task fulfilment';
  return key;
}

function _findStrongWeak(dimensions) {
  const entries = Object.entries(dimensions);
  const strongest = entries.reduce((best, next) => (next[1] > best[1] ? next : best));
  const weakest = entries.reduce((worst, next) => (next[1] < worst[1] ? next : worst));
  return { strongest: strongest[0], weakest: weakest[0] };
}

function _dimensionAdvice(key) {
  switch (key) {
    case 'content': return 'Add specific details, examples, or emotions so ideas feel complete.';
    case 'organisation': return 'Use clearer paragraph flow: opening → development → ending, with connectors.';
    case 'language': return 'Proofread grammar and punctuation. Vary sentence starters for fluency.';
    case 'taskFulfilment': return 'Check every required point and keep tone aligned to purpose/audience.';
    default: return 'Revise one paragraph to strengthen clarity.';
  }
}

function _scoreToStars(score) {
  if (score >= 0.88) return 3;
  if (score >= 0.72) return 2;
  return 1;
}

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
  _sessionStats = _newSessionStats();
  _list = _prioritisePrompts(writingPrompts[level] || []);
  _idx = 0;
  _render();
}

function _prioritisePrompts(prompts) {
  return [...prompts].sort((a, b) => {
    const aMastery = questMastery.getMastery?.('writingQuest', a.mode || 'composition') ?? 0.5;
    const bMastery = questMastery.getMastery?.('writingQuest', b.mode || 'composition') ?? 0.5;
    return aMastery - bMastery;
  });
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
      <textarea id="wq-text" class="cp-name-input" rows="9" placeholder="Write your response here..."></textarea>
      <div class="dash-pattern-item" style="margin-top:10px"><strong>Rubric</strong><ul>${item.rubric.map(r => `<li>${r}</li>`).join('')}</ul></div>
      <label class="toggle-row"><span>Peer review mode</span><span class="toggle-wrap"><input type="checkbox" id="wq-peer" role="switch"><span class="toggle-track" aria-hidden="true"></span></span></label>
      <div class="sfq-actions">
        <button class="btn btn--primary" id="wq-submit">Submit</button>
        <button class="btn btn--ghost btn--sm" id="wq-menu">Menu</button>
      </div>
      <div class="dash-pattern-item" id="wq-live-detector" aria-live="polite">Start typing to see instant writing feedback.</div>
      <div class="sfq-feedback" id="wq-feedback" hidden></div>
    </div>`;

  document.getElementById('wq-submit')?.addEventListener('click', () => _submit(item));
  document.getElementById('wq-menu')?.addEventListener('click', () => { cleanupWritingQuest(); _onGoHome?.(); });
  document.getElementById('wq-text')?.addEventListener('input', (event) => {
    const value = event?.target?.value || '';
    _updateLiveDetector(item, value);
  });
}


function _updateLiveDetector(item, text) {
  const detector = document.getElementById('wq-live-detector');
  if (!detector) return;
  if (!text?.trim()) {
    detector.textContent = 'Start typing to see instant writing feedback.';
    return;
  }

  const live = getWritingLiveFeedback(item, text, _level);
  detector.innerHTML = `🧠 Live detector: ${live.progressLabel} · score ${(live.result.score * 100).toFixed(0)}% · strongest ${_dimensionLabel(live.strongest)} · focus ${_dimensionLabel(live.weakest)}. Tip: ${live.tip}`;
}

function _renderDimensionBreakdown(result, peer) {
  const rows = Object.entries(result.dimensions)
    .map(([key, val]) => `<li>${_dimensionLabel(key)}: ${(val * 100).toFixed(0)}% — ${_dimensionAdvice(key)}</li>`)
    .join('');
  return `<ul>${rows}</ul>${peer ? '<p>Peer review prompt: ask your partner to suggest one upgrade to your weakest dimension.</p>' : ''}`;
}

function _renderDimensionBreakdown(result, peer) {
  const rows = Object.entries(result.dimensions)
    .map(([key, val]) => `<li>${_dimensionLabel(key)}: ${(val * 100).toFixed(0)}% — ${_dimensionAdvice(key)}</li>`)
    .join('');
  return `<ul>${rows}</ul>${peer ? '<p>Peer review prompt: ask your partner to suggest one upgrade to your weakest dimension.</p>' : ''}`;
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

  const result = evaluateWritingSubmission(item, text, _level);
  const stars = _scoreToStars(result.score);
  const { strongest, weakest } = _findStrongWeak(result.dimensions);
  const skill = item.mode || 'composition';

  questMastery.updateSkill('writingQuest', skill, result.passed);
  questMastery.recordAttempt({ quest: 'writingQuest', skill, correct: result.passed, level: _level });

  const xpGain = Math.round((item.xp || 30) * (0.55 + result.score * 0.45) + (stars - 1) * 8);
  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  store.patch({ xp, level: levelInfo.level });

  _sessionStats.promptsCompleted++;
  _sessionStats.totalScore += result.score;
  _sessionStats.starsEarned += stars;
  if (peer) _sessionStats.peerReviews++;
  if (result.score < 0.72) _sessionStats.revisionsSuggested++;
  _sessionStats.strongestDimension = strongest;
  _sessionStats.weakestDimension = weakest;

  store.recordLearningEvent?.({
    eventType: 'writing_submission',
    quest: 'writingQuest',
    skill,
    correct: result.passed,
    level: _level,
    meta: {
      score: result.score,
      stars,
      words: result.words,
      weakest,
      strongest,
      peer,
    },
  });

  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
    fb.innerHTML = `${result.passed ? '✅ Strong draft.' : '🟡 Draft needs revision.'} Score ${(result.score * 100).toFixed(0)}% ${'⭐'.repeat(stars)}
      <p>Required points: ${result.requiredHits}/${result.requiredTotal || 0} · Words: ${result.words}</p>
      ${_renderDimensionBreakdown(result, peer)}
      <p>Sample: ${item.sampleAnswer}</p>
      <p>Try This Tier 1: ${item.tryThis?.[0] || ''}</p>
      <p>Tier 2: ${item.tryThis?.[1] || ''}</p>`;
  }

  setTimeout(() => {
    _idx++;
    _render();
  }, 2200);
}

function _renderDone() {
  const completed = { ...(store.get('writingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('writingCompleted', completed);

  const avgScore = _sessionStats.totalScore / Math.max(_sessionStats.promptsCompleted, 1);
  const avgStars = _sessionStats.starsEarned / Math.max(_sessionStats.promptsCompleted, 1);

  _container.innerHTML = `<div class="sfq-game">
    <h3>🎉 Writing Quest complete</h3>
    <p>You practised PAC planning, organisation, and language accuracy.</p>
    <p>Average score: ${(avgScore * 100).toFixed(0)}% · Average stars: ${avgStars.toFixed(1)}</p>
    <p>Peer reviews: ${_sessionStats.peerReviews} · Revisions suggested: ${_sessionStats.revisionsSuggested}</p>
    <p>Strongest dimension: ${_dimensionLabel(_sessionStats.strongestDimension)} · Focus next: ${_dimensionLabel(_sessionStats.weakestDimension)}</p>
    <div class="sfq-actions">
      <button class="btn btn--primary" id="wq-back">Back to Levels</button>
      <button class="btn btn--ghost btn--sm" id="wq-replay">Replay Level</button>
    </div>
  </div>`;
  document.getElementById('wq-back')?.addEventListener('click', showWritingBrowser);
  document.getElementById('wq-replay')?.addEventListener('click', () => _startLevel(_level));
}

export function cleanupWritingQuest() {
  if (_container) _container.innerHTML = '';
}
