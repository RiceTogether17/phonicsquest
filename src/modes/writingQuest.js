import { WRITING_LEVELS, writingPrompts } from '../data/writingPrompts.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { getLevelInfo } from '../data/curriculum.js';
import {
  evaluateWriting,
  getLiveHint,
  compareRevisions,
  getDimensionFeedback,
  getRevisionMission,
  getEncouragement,
  DIMENSION_LABELS,
  DIMENSION_EMOJIS,
} from '../modules/writingEvaluator.js';
import { detectBadges, renderBadgeChips } from '../modules/writingBadges.js';

let _container = null;
let _onGoHome = null;
let _level = 1;
let _idx = 0;
let _list = [];
let _sessionStats = _newSessionStats();
let _firstResult = null; // stored for revision comparison

function _newSessionStats() {
  return {
    promptsCompleted: 0,
    totalScore: 0,
    starsEarned: 0,
    peerReviews: 0,
    revisionsSuggested: 0,
    strongestDimension: 'content',
    weakestDimension: 'language',
    badgesEarned: [],
  };
}

function _dimensionLabel(key) {
  return DIMENSION_LABELS[key] || key;
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
  _firstResult = null;
  _render();
}

function _prioritisePrompts(prompts) {
  return [...prompts].sort((a, b) => {
    const aMastery = questMastery.getSkillScore('writingQuest', a.mode || 'composition');
    const bMastery = questMastery.getSkillScore('writingQuest', b.mode || 'composition');
    return aMastery - bMastery;
  });
}

function _render() {
  if (_idx >= _list.length) return _renderDone();
  _firstResult = null;
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

  const hint = getLiveHint(item, text, _level);
  detector.innerHTML = `🧠 Live detector: ${hint.words}/${hint.target} words · score ${(hint.score * 100).toFixed(0)}% · focus: ${_dimensionLabel(hint.weakest)}. Tip: ${hint.tip}`;
}

function _renderDimensionBreakdown(result, peer) {
  const rows = Object.entries(result.dimensions)
    .map(([key, val]) => {
      const emoji = DIMENSION_EMOJIS[key] || '';
      const label = _dimensionLabel(key);
      const fb = result.feedback?.[key] || getDimensionFeedback(key, val);
      return `<li>${emoji} <strong>${label}</strong>: ${(val * 100).toFixed(0)}% — ${fb}</li>`;
    })
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

  const result = evaluateWriting(item, text, _level);
  const badges = detectBadges(result.metrics, text);
  const skill = item.mode || 'composition';

  questMastery.updateSkill('writingQuest', skill, result.passed);
  questMastery.recordAttempt({ quest: 'writingQuest', skill, correct: result.passed, level: _level });

  const xpGain = Math.round((item.xp || 30) * (0.55 + result.score * 0.45) + (result.stars - 1) * 8);
  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  store.patch({ xp, level: levelInfo.level });

  _sessionStats.promptsCompleted++;
  _sessionStats.totalScore += result.score;
  _sessionStats.starsEarned += result.stars;
  if (peer) _sessionStats.peerReviews++;
  if (!result.passed) _sessionStats.revisionsSuggested++;
  _sessionStats.strongestDimension = result.strongest;
  _sessionStats.weakestDimension = result.weakest;
  _sessionStats.badgesEarned.push(...badges);

  store.recordLearningEvent?.({
    eventType: 'writing_submission',
    quest: 'writingQuest',
    skill,
    correct: result.passed,
    level: _level,
    meta: {
      score: result.score,
      stars: result.stars,
      words: result.metrics.words,
      weakest: result.weakest,
      strongest: result.strongest,
      badges,
      peer,
    },
  });

  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;

    const badgeHtml = badges.length
      ? `<div style="margin:8px 0"><strong>Badges earned:</strong><br>${renderBadgeChips(badges)}</div>`
      : '';

    const checkHtml = result.checkResults?.length
      ? `<ul style="margin:4px 0">${result.checkResults.map(c => `<li>${c.hit ? '✅' : '❌'} ${c.label}</li>`).join('')}</ul>`
      : `<p>Required points: ${result.metrics.requiredHits}/${result.metrics.requiredTotal || 0}</p>`;

    const reviseBtn = !result.passed
      ? `<button class="btn btn--primary" id="wq-revise" style="margin-top:10px">✏️ Revise Draft</button>`
      : '';

    fb.innerHTML = `
      <p><strong>${result.encouragement}</strong></p>
      <p>Score ${(result.score * 100).toFixed(0)}% ${'⭐'.repeat(result.stars)} · Words: ${result.metrics.words}/${result.metrics.target}</p>
      ${badgeHtml}
      ${checkHtml}
      ${_renderDimensionBreakdown(result, peer)}
      <p><em>${result.revisionMission}</em></p>
      <p>Sample: ${item.sampleAnswer}</p>
      <p>Try This Tier 1: ${item.tryThis?.[0] || ''}</p>
      <p>Tier 2: ${item.tryThis?.[1] || ''}</p>
      ${reviseBtn}`;

    if (!result.passed) {
      _firstResult = result;
      document.getElementById('wq-revise')?.addEventListener('click', () => _startRevision(item, peer));
    }
  }

  if (result.passed) {
    setTimeout(() => {
      _idx++;
      _render();
    }, 2200);
  }
}

function _startRevision(item, peer) {
  const fb = document.getElementById('wq-feedback');
  const textarea = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('wq-text'));
  if (!textarea || !fb) return;

  fb.hidden = true;
  textarea.value = '';
  textarea.focus();

  const submitBtn = document.getElementById('wq-submit');
  if (submitBtn) {
    submitBtn.textContent = 'Submit Revision';
    submitBtn.removeEventListener('click', submitBtn._handler);
    submitBtn._handler = () => _submitRevision(item, peer);
    submitBtn.addEventListener('click', submitBtn._handler);
  }

  const detector = document.getElementById('wq-live-detector');
  if (detector) detector.textContent = 'Revise your draft based on the mission above, then submit again.';
}

function _submitRevision(item, peer) {
  const text = /** @type {HTMLTextAreaElement|null} */ (document.getElementById('wq-text'))?.value?.trim() || '';
  const fb = document.getElementById('wq-feedback');
  if (!text) {
    if (fb) {
      fb.hidden = false;
      fb.className = 'sfq-feedback sfq-feedback--error';
      fb.textContent = 'Write your revision before submitting.';
    }
    return;
  }

  const result = evaluateWriting(item, text, _level);
  const comparison = compareRevisions(_firstResult, result);
  const badges = detectBadges(result.metrics, text, comparison);
  const skill = item.mode || 'composition';

  questMastery.updateSkill('writingQuest', skill, result.passed);
  questMastery.recordAttempt({ quest: 'writingQuest', skill, correct: result.passed, level: _level });

  if (comparison?.revisionBonus > 0) {
    const xp = (store.get('xp') || 0) + comparison.revisionBonus;
    store.patch({ xp });
  }

  _sessionStats.totalScore += result.score;
  _sessionStats.starsEarned += result.stars;
  _sessionStats.strongestDimension = result.strongest;
  _sessionStats.weakestDimension = result.weakest;
  _sessionStats.badgesEarned.push(...badges);

  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;

    const badgeHtml = badges.length
      ? `<div style="margin:8px 0"><strong>Badges earned:</strong><br>${renderBadgeChips(badges)}</div>`
      : '';

    const improvHtml = comparison
      ? `<p>Score improved by ${comparison.scoreDiff >= 0 ? '+' : ''}${(comparison.scoreDiff * 100).toFixed(0)}%${comparison.revisionBonus ? ` · +${comparison.revisionBonus} XP bonus` : ''}</p>`
      : '';

    fb.innerHTML = `
      <p><strong>${result.encouragement}</strong></p>
      <p>Revision score ${(result.score * 100).toFixed(0)}% ${'⭐'.repeat(result.stars)}</p>
      ${improvHtml}
      ${badgeHtml}
      ${_renderDimensionBreakdown(result, peer)}
      <p>Sample: ${item.sampleAnswer}</p>`;
  }

  setTimeout(() => {
    _idx++;
    _render();
  }, 2800);
}

function _renderDone() {
  const completed = { ...(store.get('writingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('writingCompleted', completed);

  const avgScore = _sessionStats.totalScore / Math.max(_sessionStats.promptsCompleted, 1);
  const avgStars = _sessionStats.starsEarned / Math.max(_sessionStats.promptsCompleted, 1);
  const uniqueBadges = [...new Set(_sessionStats.badgesEarned)];

  _container.innerHTML = `<div class="sfq-game">
    <h3>🎉 Writing Quest complete</h3>
    <p>You practised PAC planning, organisation, and language accuracy.</p>
    <p>Average score: ${(avgScore * 100).toFixed(0)}% · Average stars: ${avgStars.toFixed(1)}</p>
    <p>Peer reviews: ${_sessionStats.peerReviews} · Revisions suggested: ${_sessionStats.revisionsSuggested}</p>
    <p>Strongest dimension: ${_dimensionLabel(_sessionStats.strongestDimension)} · Focus next: ${_dimensionLabel(_sessionStats.weakestDimension)}</p>
    ${uniqueBadges.length ? `<div><strong>Session badges:</strong><br>${renderBadgeChips(uniqueBadges)}</div>` : ''}
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
