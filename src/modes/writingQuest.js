import { WRITING_LEVELS, writingPrompts } from '../data/writingPrompts.js';
import { WRITING_TRACKS, getTracksForLevel, getLessonsForTrack } from '../data/writingLessonPacks.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { getLevelInfo } from '../data/curriculum.js';
import { evaluateWriting, getLiveHint, compareRevisions, getDimensionFeedback, DIMENSION_LABELS, DIMENSION_EMOJIS } from '../modules/writingEvaluator.js';
import { detectBadges, renderBadgeChips } from '../modules/writingBadges.js';
import { isPlanReady, mergeLessonWithPlan, getRemediationPath, getParagraphMissionStatus } from '../modules/writingLessonEngine.js';
import { renderDrill, collectDrillAnswers, gradeDrills } from '../modules/writingReviseDrills.js';
import { getTrackProgress, setTrackProgress, migrateLegacyWritingCompleted } from '../modules/writingTrackProgress.js';

let _container = null;
let _onGoHome = null;
let _level = 1;
let _idx = 0;
let _list = [];
let _firstResult = null;
let _firstDraftText = '';
let _phase = 'learn';
let _currentPlan = {};
let _selectedStarter = '';
let _track = null;
let _tracksForLevel = [];
let _lastDraftRemediation = null;
let _lastMissionStatus = [];

export function initWritingQuest(container, onGoHome) {
  _container = container;
  _onGoHome = onGoHome;
}

function _dimensionLabel(key) { return DIMENSION_LABELS[key] || key; }

export function showWritingBrowser() {
  if (!_container) return;
  const completed = store.get('writingCompleted') || {};
  _container.innerHTML = `<div class="sfq-browser"><div class="sfq-browser-grid">${Object.entries(WRITING_LEVELS).map(([k, label]) => {
    const level = Number(k);
    const tracks = getTracksForLevel(level);
    let total = (writingPrompts[k] || []).length;
    let done = completed[k] || 0;
    if (tracks.length) {
      total = tracks.reduce((sum, t) => sum + t.lessonIds.length, 0);
      done = tracks.reduce((sum, t) => sum + (getTrackProgress(t.id).completedLessons || 0), 0);
    }
    return `<button class="sfq-level-btn" data-level="${k}"><span class="sfq-level-icon">📝</span><span class="sfq-level-name">${label}</span><span class="sfq-level-count">${Math.min(done, total)} / ${total}</span></button>`;
  }).join('')}</div></div>`;
  _container.querySelectorAll('[data-level]').forEach((btn) => btn.addEventListener('click', () => _chooseLevel(Number(btn.dataset.level))));
}

function _chooseLevel(level) {
  _level = level;
  _tracksForLevel = getTracksForLevel(level);
  if (_tracksForLevel.length > 1) {
    return _renderTrackBrowser(level);
  }
  if (_tracksForLevel.length === 1) {
    return _startTrack(_tracksForLevel[0].id);
  }
  return _startLegacyLevel(level);
}

function _renderTrackBrowser(level) {
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Choose your writing track</h3>
  <p class="sfq-instruction">${WRITING_LEVELS[level]} has multiple term tracks.</p>
  <div class="sfq-browser-grid">${_tracksForLevel.map((track) => {
    const progress = getTrackProgress(track.id);
    migrateLegacyWritingCompleted([track.id], track.lessonIds.length, level);
    return `<button class="sfq-level-btn" data-track="${track.id}"><span class="sfq-level-icon">📚</span><span class="sfq-level-name">${track.track}</span><span class="sfq-level-count">${progress.completedLessons || 0}/${track.lessonIds.length}</span></button>`;
  }).join('')}</div>
  <div class="sfq-actions" style="margin-top:10px"><button class="btn btn--ghost btn--sm" id="wq-level-back">Back</button></div></div>`;
  _container.querySelectorAll('[data-track]').forEach((btn) => btn.addEventListener('click', () => _startTrack(btn.dataset.track)));
  document.getElementById('wq-level-back')?.addEventListener('click', showWritingBrowser);
}

function _startTrack(trackId) {
  _track = WRITING_TRACKS[trackId] || null;
  _idx = 0;
  _phase = 'learn';
  _firstResult = null;
  _list = getLessonsForTrack(trackId);
  _render();
}

function _startLegacyLevel(level) {
  _track = null;
  _idx = 0;
  _phase = 'learn';
  _list = [...(writingPrompts[level] || [])];
  _render();
}

function _render() {
  if (_idx >= _list.length) return _renderDone();
  const item = _list[_idx];
  if (!_track) return _renderLegacyPrompt(item);
  if (item.lessonType === 'bossQuiz') return _renderBossQuiz(item);

  const views = {
    learn: _renderLearn,
    revise: _renderRevisePrep,
    plan: _renderPlan,
    draft: _renderDraft,
    repair: _renderRepair,
    complete: _renderLessonComplete,
  };
  return (views[_phase] || _renderLearn)(item);
}

function _renderLearn(item) {
  _container.innerHTML = `<div class="sfq-game"><div class="sfq-header"><span class="sfq-badge">🧭 ${WRITING_TRACKS[item.track].track}</span><span class="sfq-progress">${_idx + 1}/${_list.length}</span></div>
    <h3 class="cloze-title">Learn: ${item.lessonTitle}</h3>
    <div class="dash-pattern-item"><strong>Skill focus:</strong> ${item.skillFocus.join(' · ')}</div>
    <ul class="dash-pattern-item">${(item.introTeaching || []).map((line) => `<li>${line}</li>`).join('')}</ul>
    ${item.storyStarterChoices?.length ? `<div class="dash-pattern-item"><strong>Story Starter Cards</strong>${item.storyStarterChoices.map((s, i) => `<label style="display:block;margin:6px 0"><input type="radio" name="starter" value="${i}" ${i === 0 ? 'checked' : ''}/> ${s}</label>`).join('')}</div>` : ''}
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-next">Next: Revise Drills</button><button class="btn btn--ghost btn--sm" id="wq-menu">Menu</button></div></div>`;
  document.getElementById('wq-next')?.addEventListener('click', () => {
    const selected = _container.querySelector('input[name="starter"]:checked');
    _selectedStarter = selected ? item.storyStarterChoices?.[Number(selected.value)] : (item.storyStarterChoices?.[0] || '');
    _phase = 'revise';
    _render();
  });
  document.getElementById('wq-menu')?.addEventListener('click', () => { cleanupWritingQuest(); _onGoHome?.(); });
}

function _renderRevisePrep(item) {
  const drills = item.reviseDrills || [];
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Revise: Toolbox Drills</h3>
    <div class="dash-pattern-item"><strong>Vocabulary:</strong> ${item.vocabRevision.join(', ')}</div>
    <div class="dash-pattern-item"><strong>Spelling:</strong> ${item.spellingRevision.join(', ')}</div>
    ${drills.map((drill, idx) => renderDrill(drill, idx)).join('')}
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-drill-submit">Submit Drills</button></div>
    <div id="wq-drill-msg" class="dash-pattern-item">Pass at least 60% to unlock planning.</div></div>`;

  document.getElementById('wq-drill-submit')?.addEventListener('click', () => {
    const answers = collectDrillAnswers(_container, drills.length);
    const result = gradeDrills(drills, answers);
    const msg = document.getElementById('wq-drill-msg');
    if (!result.passed) {
      if (msg) msg.textContent = `You scored ${result.correctCount}/${result.total}. Try again to unlock planning.`;
      return;
    }
    if (msg) msg.textContent = `Great! ${result.correctCount}/${result.total}. Planning unlocked.`;
    _phase = 'plan';
    setTimeout(_render, 500);
  });
}

function _renderPlan(item) {
  const fields = item.plotPlanTemplate || ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'];
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Plan: Plot Builder</h3>
    <p class="sfq-instruction">Fill every core box before drafting.</p>
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
    <div class="dash-pattern-item"><strong>Paragraph Missions</strong><ul id="wq-mission-list">${(item.paragraphMissions || []).map((m) => `<li>${typeof m === 'string' ? m : m.text}</li>`).join('')}</ul></div>
    <div class="dash-pattern-item"><strong>Checkpoints:</strong><ul>${(lessonForEval.requiredChecks || []).map((c) => `<li>${c.label}</li>`).join('')}</ul></div>
    <p class="dash-pattern-item">🧰 Support words: ${(item.supportWords || []).join(', ')}</p>
    <textarea id="wq-text" class="cp-name-input" rows="9" placeholder="Write your draft..."></textarea>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-submit">Submit Draft</button></div>
    <div class="dash-pattern-item" id="wq-live-detector">Start typing to see instant writing feedback.</div>
    <div class="sfq-feedback" id="wq-feedback" hidden></div></div>`;

  document.getElementById('wq-text')?.addEventListener('input', (event) => {
    const text = event.target.value || '';
    const hint = getLiveHint(lessonForEval, text, _level);
    const missionStatus = getParagraphMissionStatus(item, text);
    _lastMissionStatus = missionStatus;
    const detector = document.getElementById('wq-live-detector');
    if (detector) detector.innerHTML = `🧠 ${hint.words}/${hint.target} words · ${(hint.score * 100).toFixed(0)}% · focus ${_dimensionLabel(hint.weakest)} · missions ${missionStatus.filter((m) => m.hit).length}/${missionStatus.length}`;
    const missionList = document.getElementById('wq-mission-list');
    if (missionList) missionList.innerHTML = missionStatus.map((m) => `<li>${m.hit ? '✅' : '⬜'} ${m.text}</li>`).join('');
  });

  document.getElementById('wq-submit')?.addEventListener('click', () => _submitDraft(item, lessonForEval));
}

function _renderDimensionBreakdown(result) {
  return `<ul>${Object.entries(result.dimensions).map(([key, val]) => `<li>${DIMENSION_EMOJIS[key] || ''} <strong>${_dimensionLabel(key)}</strong>: ${(val * 100).toFixed(0)}% — ${result.feedback?.[key] || getDimensionFeedback(key, val)}</li>`).join('')}</ul>`;
}

function _submitDraft(item, lessonForEval) {
  const text = document.getElementById('wq-text')?.value?.trim() || '';
  const fb = document.getElementById('wq-feedback');
  if (!text) return;
  _firstDraftText = text;

  const result = evaluateWriting(lessonForEval, text, _level);
  _firstResult = result;
  _lastDraftRemediation = getRemediationPath(result);
  const missionHits = _lastMissionStatus.filter((m) => m.hit).length;
  const badges = detectBadges(result.metrics, text);

  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
    fb.innerHTML = `<p><strong>${result.encouragement}</strong></p>
      <p>Score ${(result.score * 100).toFixed(0)}% ${'⭐'.repeat(result.stars)}</p>
      <p><strong>Mission Progress:</strong> ${missionHits}/${_lastMissionStatus.length || 0}</p>
      <p><strong>Revision Mission:</strong> ${_lastDraftRemediation.title}</p>
      ${_lastDraftRemediation.missingChecks.length ? `<p>Missing checkpoints: ${_lastDraftRemediation.missingChecks.join(' · ')}</p>` : ''}
      ${_renderDimensionBreakdown(result)}
      <div>${renderBadgeChips(badges)}</div>
      <div class="sfq-actions" style="margin-top:8px"><button class="btn btn--primary" id="wq-go-revise">${result.passed ? 'Polish Draft' : 'Start Repair Mission'}</button></div>`;
  }
  document.getElementById('wq-go-revise')?.addEventListener('click', () => { _phase = 'repair'; _render(); });
}

function _renderRepair(item) {
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Revise: Repair Mission</h3>
    <div class="dash-pattern-item"><strong>First Draft Snapshot</strong><p>${_firstDraftText.slice(0, 240)}${_firstDraftText.length > 240 ? '…' : ''}</p></div>
    <div class="dash-pattern-item"><strong>Fix list</strong><ul>${(_lastDraftRemediation?.missingChecks || []).map((m) => `<li>❌ ${m}</li>`).join('') || '<li>✅ All checkpoints met — polish language and flow.</li>'}</ul></div>
    <p class="sfq-instruction">Targeted prompt: ${_lastDraftRemediation?.title || 'Strengthen your weakest writing dimension.'}</p>
    <textarea id="wq-revision-text" class="cp-name-input" rows="9" placeholder="Write improved draft...">${_firstDraftText}</textarea>
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
  const missionStatus = getParagraphMissionStatus(item, text);
  _awardLessonRewards(item, result, cmp, badges, missionStatus);

  const fb = document.getElementById('wq-feedback');
  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
    fb.innerHTML = `<p><strong>Revision complete!</strong> Score ${(result.score * 100).toFixed(0)}%</p>
      <p>Score change: ${cmp ? `${cmp.scoreDiff >= 0 ? '+' : ''}${(cmp.scoreDiff * 100).toFixed(0)}%` : 'n/a'} · XP bonus: ${cmp?.revisionBonus || 0}</p>
      <p>Mission completion: ${missionStatus.filter((m) => m.hit).length}/${missionStatus.length}</p>
      <ul>${cmp ? Object.entries(cmp.improved).map(([k, v]) => `<li>${_dimensionLabel(k)} ${v >= 0 ? '⬆️' : '⬇️'} ${(v * 100).toFixed(0)}%</li>`).join('') : ''}</ul>
      ${renderBadgeChips(badges)}`;
  }
  setTimeout(() => { _phase = 'complete'; _render(); }, 1400);
}

function _awardLessonRewards(item, result, cmp, badges, missionStatus = []) {
  const skill = item.lessonType || item.mode || 'composition';
  questMastery.updateSkill('writingQuest', skill, result.passed);
  questMastery.recordAttempt({ quest: 'writingQuest', skill, correct: result.passed, level: _level });
  const missionBonus = missionStatus.length ? Math.round((missionStatus.filter((m) => m.hit).length / missionStatus.length) * 10) : 0;
  const baseXp = item.rewards?.xp || item.xp || 30;
  const xpGain = Math.round(baseXp * (0.6 + result.score * 0.4) + (cmp?.revisionBonus || 0) + missionBonus);
  const xp = (store.get('xp') || 0) + xpGain;
  const levelInfo = getLevelInfo(xp);
  const collectibles = [...new Set([...(store.get('writingCollectibles') || []), ...(item.rewards?.collectibles || []), ...badges])];
  store.patch({ xp, level: levelInfo.level, writingCollectibles: collectibles });
}

function _renderLessonComplete(item) {
  const collectibles = store.get('writingCollectibles') || [];
  if (_track) {
    setTrackProgress(_track.id, _idx + 1, _list.length, _level);
  }
  _container.innerHTML = `<div class="sfq-game"><h3>✅ Lesson complete: ${item.lessonTitle}</h3>
    <p><strong>Collection:</strong> ${collectibles.slice(-6).join(' · ') || 'None yet'}</p>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-next-lesson">Next Lesson</button></div></div>`;
  document.getElementById('wq-next-lesson')?.addEventListener('click', () => {
    _idx++;
    _phase = 'learn';
    _currentPlan = {};
    _selectedStarter = '';
    _firstDraftText = '';
    _render();
  });
}

function _renderBossQuiz(item) {
  const quiz = item.bossQuiz;
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Boss Check: ${item.lessonTitle}</h3>
    <form id="wq-boss-form">${quiz.questions.map((q, idx) => `<div class="dash-pattern-item"><strong>Q${idx + 1}. ${q.q}</strong>${q.options.map((opt, oi) => `<label style="display:block"><input type="radio" name="${q.id}" value="${oi}"/> ${opt}</label>`).join('')}</div>`).join('')}
      <div class="sfq-actions"><button type="submit" class="btn btn--primary">Submit Boss Check</button></div>
    </form>
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
      if (passed) _idx++;
      _render();
    });
  });
}

function _renderLegacyPrompt(item) {
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Writing Quest (${item.textType})</h3>
    <p class="sfq-instruction">${item.prompt}</p>
    <p class="dash-pattern-item">Legacy prompt mode remains available for this level.</p>
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
  if (_track) {
    setTrackProgress(_track.id, _list.length, _list.length, _level);
  }

  _container.innerHTML = `<div class="sfq-game"><h3>🎉 Writing Quest complete</h3><p>${_track ? `Track cleared: ${_track.track}.` : 'Level complete.'}</p>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-back">Back to Levels</button></div></div>`;
  document.getElementById('wq-back')?.addEventListener('click', () => {
    if (_tracksForLevel.length > 1) return _renderTrackBrowser(_level);
    showWritingBrowser();
  });
}

export function cleanupWritingQuest() {
  if (_container) _container.innerHTML = '';
}

export { evaluateWritingSubmission, getWritingLiveFeedback } from '../modules/writingEvaluator.js';
