import { WRITING_LEVELS, writingPrompts } from '../data/writingPrompts.js';
import { WRITING_TRACKS, getTrackForLevel, getLessonsForTrack } from '../data/writingLessonPacks.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { getLevelInfo } from '../data/curriculum.js';
import {
  evaluateWriting,
  getLiveHint,
  compareRevisions,
  getDimensionFeedback,
  DIMENSION_LABELS,
  DIMENSION_EMOJIS,
} from '../modules/writingEvaluator.js';
import { detectBadges, renderBadgeChips } from '../modules/writingBadges.js';
import { isPlanReady, mergeLessonWithPlan, getRemediationPath } from '../modules/writingLessonEngine.js';

let _container = null;
let _onGoHome = null;
let _level = 1;
let _idx = 0;
let _list = [];
let _firstResult = null;
let _phase = 'learn';
let _currentPlan = {};
let _selectedStarter = '';
let _track = null;

export function initWritingQuest(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

function _dimensionLabel(key) { return DIMENSION_LABELS[key] || key; }

export function showWritingBrowser() {
  if (!_container) return;
  const completed = store.get('writingCompleted') || {};
  _container.innerHTML = `<div class="sfq-browser"><div class="sfq-browser-grid">${Object.entries(WRITING_LEVELS).map(([k, label]) => {
    const track = getTrackForLevel(Number(k));
    const total = track ? track.lessonIds.length : (writingPrompts[k] || []).length;
    const done = completed[k] || 0;
    return `<button class="sfq-level-btn" data-level="${k}"><span class="sfq-level-icon">📝</span><span class="sfq-level-name">${label}</span><span class="sfq-level-count">${Math.min(done, total)} / ${total}</span></button>`;
  }).join('')}</div></div>`;
  _container.querySelectorAll('[data-level]').forEach(btn => btn.addEventListener('click', () => _startLevel(Number(btn.dataset.level))));
}

function _startLevel(level) {
  _level = level;
  _idx = 0;
  _firstResult = null;
  _phase = 'learn';
  _track = getTrackForLevel(level);
  _list = _track ? getLessonsForTrack(_track.id) : [...(writingPrompts[level] || [])];
  _render();
}

function _render() {
  if (_idx >= _list.length) return _renderDone();
  const item = _list[_idx];

  if (!_track) return _renderLegacyPrompt(item);
  if (item.lessonType === 'bossQuiz') return _renderBossQuiz(item);

  if (_phase === 'learn') return _renderLearn(item);
  if (_phase === 'revise') return _renderRevisePrep(item);
  if (_phase === 'plan') return _renderPlan(item);
  if (_phase === 'draft') return _renderDraft(item);
  if (_phase === 'repair') return _renderRepair(item);
  if (_phase === 'complete') return _renderLessonComplete(item);
}

function _renderLearn(item) {
  _container.innerHTML = `<div class="sfq-game"><div class="sfq-header"><span class="sfq-badge">🧭 ${WRITING_TRACKS[item.track].track}</span><span class="sfq-progress">${_idx + 1}/${_list.length}</span></div>
    <h3 class="cloze-title">Learn: ${item.lessonTitle}</h3>
    <div class="dash-pattern-item"><strong>Skill focus:</strong> ${item.skillFocus.join(' · ')}</div>
    <ul class="dash-pattern-item">${(item.introTeaching || []).map((line) => `<li>${line}</li>`).join('')}</ul>
    ${item.storyStarterChoices?.length ? `<div class="dash-pattern-item"><strong>Choose a Story Starter Card</strong>${item.storyStarterChoices.map((s, i) => `<label style="display:block;margin:6px 0"><input type="radio" name="starter" value="${i}" ${i===0?'checked':''}/> ${s}</label>`).join('')}</div>` : ''}
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-next">Next: Revise</button><button class="btn btn--ghost btn--sm" id="wq-menu">Menu</button></div></div>`;
  document.getElementById('wq-next')?.addEventListener('click', () => {
    const selected = _container.querySelector('input[name="starter"]:checked');
    _selectedStarter = selected ? item.storyStarterChoices[Number(selected.value)] : (item.storyStarterChoices?.[0] || '');
    _phase = 'revise';
    _render();
  });
  document.getElementById('wq-menu')?.addEventListener('click', () => { cleanupWritingQuest(); _onGoHome?.(); });
}

function _renderRevisePrep(item) {
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Revise: Word Bucket Warm-up</h3>
    <div class="dash-pattern-item"><strong>Vocabulary recycle:</strong> ${item.vocabRevision.join(', ')}</div>
    <div class="dash-pattern-item"><strong>Spelling check:</strong> ${item.spellingRevision.join(', ')}</div>
    <p class="sfq-instruction">Tap continue after reading the words aloud once.</p>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-next">Next: Plan</button></div></div>`;
  document.getElementById('wq-next')?.addEventListener('click', () => { _phase = 'plan'; _render(); });
}

function _renderPlan(item) {
  const fields = item.plotPlanTemplate || ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'];
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Plan: Plot Builder</h3>
  <p class="sfq-instruction">Complete your story map before drafting.</p>
  <div class="dash-pattern-item">${fields.map((field) => `<label style="display:block;margin:8px 0"><strong>${field}</strong><textarea data-plan="${field}" class="cp-name-input" rows="2" placeholder="Plan this part..."></textarea></label>`).join('')}</div>
  <div class="sfq-actions"><button class="btn btn--primary" id="wq-plan-next">Unlock Draft</button></div>
  <div id="wq-plan-msg" class="dash-pattern-item">All core plot boxes need at least one short sentence.</div></div>`;
  document.getElementById('wq-plan-next')?.addEventListener('click', () => {
    const plan = {};
    _container.querySelectorAll('[data-plan]').forEach((el) => { plan[el.dataset.plan] = el.value.trim(); });
    _currentPlan = plan;
    if (!isPlanReady(plan, fields.slice(0, 5))) {
      const msg = document.getElementById('wq-plan-msg');
      if (msg) msg.textContent = 'Finish the five key plot boxes to unlock drafting.';
      return;
    }
    _phase = 'draft';
    _render();
  });
}

function _renderDraft(item) {
  const lessonForEval = mergeLessonWithPlan(item, _currentPlan);
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Draft: ${item.lessonTitle}</h3>
    <p class="sfq-instruction">Starter: ${_selectedStarter || item.storyStarterChoices?.[0] || 'Create your own opening.'}</p>
    <div class="dash-pattern-item"><strong>Checkpoints:</strong><ul>${(lessonForEval.requiredChecks || []).map((c) => `<li>${c.label}</li>`).join('')}</ul></div>
    <p class="dash-pattern-item">🧰 Support words: ${(item.supportWords || []).join(', ')}</p>
    <textarea id="wq-text" class="cp-name-input" rows="9" placeholder="Write your draft..."></textarea>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-submit">Submit Draft</button></div>
    <div class="dash-pattern-item" id="wq-live-detector">Start typing to see instant writing feedback.</div>
    <div class="sfq-feedback" id="wq-feedback" hidden></div></div>`;
  document.getElementById('wq-text')?.addEventListener('input', (event) => {
    const hint = getLiveHint(lessonForEval, event.target.value || '', _level);
    const detector = document.getElementById('wq-live-detector');
    if (detector) detector.innerHTML = `🧠 Live detector: ${hint.words}/${hint.target} words · ${(hint.score * 100).toFixed(0)}% · focus ${_dimensionLabel(hint.weakest)}`;
  });
  document.getElementById('wq-submit')?.addEventListener('click', () => _submitDraft(item, lessonForEval));
}

function _renderDimensionBreakdown(result) {
  const rows = Object.entries(result.dimensions)
    .map(([key, val]) => `<li>${DIMENSION_EMOJIS[key] || ''} <strong>${_dimensionLabel(key)}</strong>: ${(val * 100).toFixed(0)}% — ${result.feedback?.[key] || getDimensionFeedback(key, val)}</li>`)
    .join('');
  return `<ul>${rows}</ul>`;
}

function _submitDraft(item, lessonForEval) {
  const text = document.getElementById('wq-text')?.value?.trim() || '';
  const fb = document.getElementById('wq-feedback');
  if (!text) return;
  const result = evaluateWriting(lessonForEval, text, _level);
  _firstResult = result;
  const remediation = getRemediationPath(result);
  const badges = detectBadges(result.metrics, text);
  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
    fb.innerHTML = `<p><strong>${result.encouragement}</strong></p>
      <p>Score ${(result.score * 100).toFixed(0)}% ${'⭐'.repeat(result.stars)}</p>
      <p><strong>Revision Mission:</strong> ${remediation.title}</p>
      ${remediation.missingChecks.length ? `<p>Missing checkpoints: ${remediation.missingChecks.join(' · ')}</p>` : ''}
      ${_renderDimensionBreakdown(result)}
      <div>${renderBadgeChips(badges)}</div>
      <div class="sfq-actions" style="margin-top:8px"><button class="btn btn--primary" id="wq-go-revise">${result.passed ? 'Polish Draft' : 'Start Repair Mission'}</button></div>`;
  }
  document.getElementById('wq-go-revise')?.addEventListener('click', () => {
    _phase = 'repair';
    _render();
  });
}

function _renderRepair(item) {
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Revise: Repair Mission</h3>
    <p class="sfq-instruction">Rewrite your story using feedback and checkpoints.</p>
    <textarea id="wq-revision-text" class="cp-name-input" rows="9" placeholder="Write improved draft..."></textarea>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-submit-revision">Submit Revision</button></div>
    <div class="sfq-feedback" id="wq-feedback" hidden></div></div>`;
  document.getElementById('wq-submit-revision')?.addEventListener('click', () => _submitRevision(item));
}

function _submitRevision(item) {
  const text = document.getElementById('wq-revision-text')?.value?.trim() || '';
  if (!text) return;
  const lessonForEval = mergeLessonWithPlan(item, _currentPlan);
  const result = evaluateWriting(lessonForEval, text, _level);
  const cmp = compareRevisions(_firstResult, result);
  const badges = detectBadges(result.metrics, text, cmp);
  _awardLessonRewards(item, result, cmp, badges);
  const fb = document.getElementById('wq-feedback');
  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
    fb.innerHTML = `<p><strong>Revision complete!</strong> Score ${(result.score * 100).toFixed(0)}%</p>
    <p>Improvement: ${cmp ? `${(cmp.scoreDiff * 100).toFixed(0)}%` : 'n/a'}</p>${renderBadgeChips(badges)}`;
  }
  setTimeout(() => { _phase = 'complete'; _render(); }, 1300);
}

function _awardLessonRewards(item, result, cmp, badges) {
  const skill = item.lessonType || item.mode || 'composition';
  questMastery.updateSkill('writingQuest', skill, result.passed);
  questMastery.recordAttempt({ quest: 'writingQuest', skill, correct: result.passed, level: _level });
  const baseXp = item.rewards?.xp || item.xp || 30;
  const xpGain = Math.round(baseXp * (0.6 + result.score * 0.4) + (cmp?.revisionBonus || 0));
  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  const collectibles = [...new Set([...(store.get('writingCollectibles') || []), ...(item.rewards?.collectibles || []), ...badges])];
  store.patch({ xp, level: levelInfo.level, writingCollectibles: collectibles });
}

function _renderLessonComplete(item) {
  const collectibles = store.get('writingCollectibles') || [];
  _container.innerHTML = `<div class="sfq-game"><h3>✅ Lesson complete: ${item.lessonTitle}</h3>
    <p>Collectibles unlocked this track make your writing toolkit stronger.</p>
    <p><strong>Collection:</strong> ${collectibles.slice(-6).join(' · ') || 'None yet'}</p>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-next-lesson">Next Lesson</button></div></div>`;
  document.getElementById('wq-next-lesson')?.addEventListener('click', () => {
    _idx++;
    _phase = 'learn';
    _currentPlan = {};
    _selectedStarter = '';
    _render();
  });
}

function _renderBossQuiz(item) {
  const quiz = item.bossQuiz;
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Boss Check: ${item.lessonTitle}</h3>
    <form id="wq-boss-form">${quiz.questions.map((q, idx) => `<div class="dash-pattern-item"><strong>Q${idx + 1}. ${q.q}</strong>${q.options.map((opt, oi) => `<label style="display:block"><input type="radio" name="${q.id}" value="${oi}"/> ${opt}</label>`).join('')}</div>`).join('')}
    <div class="sfq-actions"><button type="submit" class="btn btn--primary">Submit Boss Check</button></div></form>
    <div class="sfq-feedback" id="wq-feedback" hidden></div></div>`;
  document.getElementById('wq-boss-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;
    quiz.questions.forEach((q) => {
      const val = Number(_container.querySelector(`input[name="${q.id}"]:checked`)?.value);
      if (val === q.answer) score++;
    });
    const passed = score >= quiz.passMark;
    _awardLessonRewards(item, { passed, score: score / quiz.questions.length }, null, []);
    const fb = document.getElementById('wq-feedback');
    if (fb) {
      fb.hidden = false;
      fb.className = `sfq-feedback sfq-feedback--${passed ? 'success' : 'error'}`;
      fb.innerHTML = `<p>${passed ? 'Boss defeated!' : 'Boss is still standing—review and retry!'} ${score}/${quiz.questions.length}</p>
      <button class="btn btn--primary" id="wq-boss-next" style="margin-top:8px">${passed ? 'Finish Track' : 'Retry Boss Check'}</button>`;
    }
    document.getElementById('wq-boss-next')?.addEventListener('click', () => {
      if (passed) {
        _idx++;
      }
      _render();
    });
  });
}

function _renderLegacyPrompt(item) {
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Writing Quest (${item.textType})</h3>
  <p class="sfq-instruction">${item.prompt}</p><p class="dash-pattern-item">Legacy prompt mode is still supported for this level.</p>
  <textarea id="wq-text" class="cp-name-input" rows="9" placeholder="Write your response here..."></textarea>
  <div class="sfq-actions"><button class="btn btn--primary" id="wq-submit">Submit</button></div><div class="sfq-feedback" id="wq-feedback" hidden></div></div>`;
  document.getElementById('wq-submit')?.addEventListener('click', () => {
    const text = document.getElementById('wq-text')?.value?.trim() || '';
    if (!text) return;
    const result = evaluateWriting(item, text, _level);
    _awardLessonRewards(item, result, null, []);
    const fb = document.getElementById('wq-feedback');
    if (fb) {
      fb.hidden = false;
      fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
      fb.innerHTML = `<p>Score ${(result.score * 100).toFixed(0)}%</p>`;
    }
    setTimeout(() => { _idx++; _render(); }, 900);
  });
}

function _renderDone() {
  const completed = { ...(store.get('writingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('writingCompleted', completed);
  _container.innerHTML = `<div class="sfq-game"><h3>🎉 Writing Quest complete</h3><p>${_track ? 'Track cleared with full lesson flow.' : 'Level complete.'}</p>
  <div class="sfq-actions"><button class="btn btn--primary" id="wq-back">Back to Levels</button></div></div>`;
  document.getElementById('wq-back')?.addEventListener('click', showWritingBrowser);
}

export function cleanupWritingQuest() {
  if (_container) _container.innerHTML = '';
}

export { evaluateWritingSubmission, getWritingLiveFeedback } from "../modules/writingEvaluator.js";
