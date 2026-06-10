import { WRITING_LEVELS, writingPrompts } from '../data/writingPrompts.js';
import { WRITING_TRACKS, getTracksForLevel, getLessonsForTrack } from '../data/writingLessonPacks.js';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { getLevelInfo } from '../data/curriculum.js';
import { evaluateWriting, getLiveHint, compareRevisions, getDimensionFeedback, DIMENSION_LABELS, DIMENSION_EMOJIS, getRubricBand, getDimensionBandLabel } from '../modules/writingEvaluator.js';
import { detectBadges, renderBadgeChips } from '../modules/writingBadges.js';
import { isPlanReady, mergeLessonWithPlan, getRemediationPath, getParagraphMissionStatus, getPlanDraftMatchReport } from '../modules/writingLessonEngine.js';
import { renderDrill, collectDrillAnswers, gradeDrills } from '../modules/writingReviseDrills.js';
import { getTrackProgress, setTrackProgress, migrateLegacyWritingCompleted, getLevelTrackProgress } from '../modules/writingTrackProgress.js';
import { saveDraft, loadDraft, clearDraft, updatePhase, updateFeedback, updateRevision, saveLegacyDraft, loadLegacyDraft, clearLegacyDraft, getDraftSummary } from '../modules/writingDraftStore.js';
import { hasApiKey, getWritingCoachFeedback, gradeEssayWithRubric } from '../modules/aiService.js';

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
  _container.innerHTML = `<div class="sfq-browser"><div class="sfq-browser-grid">${Object.entries(WRITING_LEVELS).map(([k, label]) => {
    const level = Number(k);
    const tracks = getTracksForLevel(level);
    const { done, total } = _getLevelProgress(level, tracks);
    return `<button class="sfq-level-btn" data-level="${k}"><span class="sfq-level-icon">📝</span><span class="sfq-level-name">${label}</span><span class="sfq-level-count">${Math.min(done, total)} / ${total}</span></button>`;
  }).join('')}</div></div>`;
  _container.querySelectorAll('[data-level]').forEach((btn) => btn.addEventListener('click', () => _chooseLevel(Number(btn.dataset.level))));
}

/**
 * Get progress for a level. Track-based progress is the source of truth
 * for tracked levels. Legacy writingCompleted is used only as fallback
 * for untracked levels.
 */
function _getLevelProgress(level, tracks) {
  if (tracks.length) {
    // Ensure migration has run for all tracks at this level
    tracks.forEach(t => migrateLegacyWritingCompleted([t.id], t.lessonIds.length, level));
    const total = tracks.reduce((sum, t) => sum + t.lessonIds.length, 0);
    const done = tracks.reduce((sum, t) => sum + (getTrackProgress(t.id).completedLessons || 0), 0);
    return { done, total };
  }
  // Legacy fallback for levels without tracks
  const completed = store.get('writingCompleted') || {};
  const total = (writingPrompts[level] || []).length;
  const done = completed[level] || 0;
  return { done, total };
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
  // Migrate before reading progress so counts are up-to-date
  _tracksForLevel.forEach(t => migrateLegacyWritingCompleted([t.id], t.lessonIds.length, level));

  // Sort tracks by term order (T1 before T2, etc.)
  const sortedTracks = [..._tracksForLevel].sort((a, b) => {
    const termA = (a.term || '').replace(/\D/g, '') || '0';
    const termB = (b.term || '').replace(/\D/g, '') || '0';
    return Number(termA) - Number(termB);
  });

  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Choose your writing track</h3>
  <p class="sfq-instruction">${WRITING_LEVELS[level]} has multiple term tracks.</p>
  <div class="sfq-browser-grid">${sortedTracks.map((track) => {
    const progress = getTrackProgress(track.id);
    const completed = progress.completedLessons || 0;
    const total = track.lessonIds.length;
    const statusLabel = completed >= total ? ' (Complete)' : '';
    return `<button class="sfq-level-btn" data-track="${track.id}"><span class="sfq-level-icon">📚</span><span class="sfq-level-name">${track.track}${statusLabel}</span><span class="sfq-level-count">${completed}/${total}</span></button>`;
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
  _firstDraftText = '';
  _currentPlan = {};
  _selectedStarter = '';
  _lastDraftRemediation = null;
  _lastMissionStatus = [];
  _list = getLessonsForTrack(trackId);

  // Resume from saved draft if one exists for the current lesson
  _tryRestoreFromDraft(trackId, _idx);
  _render();
}

/** Attempt to restore in-memory state from a persisted draft record. */
function _tryRestoreFromDraft(trackId, lessonIdx) {
  const saved = loadDraft(trackId, lessonIdx);
  if (!saved) return;
  if (saved.phase) _phase = saved.phase;
  if (saved.firstDraftText) _firstDraftText = saved.firstDraftText;
  if (saved.plan && Object.keys(saved.plan).length) _currentPlan = saved.plan;
  if (saved.selectedStarter) _selectedStarter = saved.selectedStarter;
  if (saved.feedbackResult) _firstResult = saved.feedbackResult;
  if (saved.remediation) _lastDraftRemediation = saved.remediation;
  if (saved.missionStatus) _lastMissionStatus = saved.missionStatus;
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
  // Check if there's a saved draft for this lesson (to offer resume)
  const saved = _track ? loadDraft(_track.id, _idx) : null;
  const summary = getDraftSummary(saved);
  const resumeHtml = summary && summary.hasText ? `<div class="wq-resume-banner">
    <p><strong>You have a saved draft for this lesson.</strong></p>
    <p>Phase: ${summary.phase} ${summary.hasFeedback ? ' · Feedback saved' : ''} ${summary.hasRevision ? ' · Revision saved' : ''}</p>
    <p style="font-size:0.85em;color:var(--text-muted)">Last worked on: ${summary.updatedAt ? new Date(summary.updatedAt).toLocaleDateString() : 'unknown'}</p>
    <div class="sfq-actions" style="margin-top:6px">
      <button class="btn btn--primary btn--sm" id="wq-resume">Continue Where You Left Off</button>
      <button class="btn btn--ghost btn--sm" id="wq-start-fresh">Start Fresh</button>
    </div>
  </div>` : '';

  _container.innerHTML = `<div class="sfq-game"><div class="sfq-header"><span class="sfq-badge">🧭 ${WRITING_TRACKS[item.track].track}</span><span class="sfq-progress">${_idx + 1}/${_list.length}</span></div>
    <h3 class="cloze-title">Learn: ${item.lessonTitle}</h3>
    ${resumeHtml}
    <div class="dash-pattern-item"><strong>Skill focus:</strong> ${item.skillFocus.join(' · ')}</div>
    <ul class="dash-pattern-item">${(item.introTeaching || []).map((line) => `<li>${line}</li>`).join('')}</ul>
    ${item.storyStarterChoices?.length ? `<div class="dash-pattern-item"><strong>Story Starter Cards</strong>${item.storyStarterChoices.map((s, i) => `<label style="display:block;margin:6px 0"><input type="radio" name="starter" value="${i}" ${i === 0 ? 'checked' : ''}/> ${s}</label>`).join('')}</div>` : ''}
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-next">Next: Revise Drills</button><button class="btn btn--ghost btn--sm" id="wq-menu">Menu</button></div></div>`;

  // Resume button: restore saved state and jump to saved phase
  document.getElementById('wq-resume')?.addEventListener('click', () => {
    _tryRestoreFromDraft(_track.id, _idx);
    _render();
  });
  // Start fresh: clear saved draft and stay on learn
  document.getElementById('wq-start-fresh')?.addEventListener('click', () => {
    if (_track) clearDraft(_track.id, _idx);
    _phase = 'learn';
    _firstResult = null;
    _firstDraftText = '';
    _currentPlan = {};
    _selectedStarter = '';
    _lastDraftRemediation = null;
    _lastMissionStatus = [];
    _render();
  });

  document.getElementById('wq-next')?.addEventListener('click', () => {
    const selected = _container.querySelector('input[name="starter"]:checked');
    _selectedStarter = selected ? item.storyStarterChoices?.[Number(selected.value)] : (item.storyStarterChoices?.[0] || '');
    _phase = 'revise';
    // Persist starter choice and phase
    if (_track) saveDraft(_track.id, _idx, { selectedStarter: _selectedStarter, phase: 'revise' });
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
    if (_track) updatePhase(_track.id, _idx, 'plan');
    setTimeout(_render, 500);
  });
  document.getElementById('wq-menu')?.addEventListener('click', () => { cleanupWritingQuest(); _onGoHome?.(); });
}

function _renderPlan(item) {
  const fields = item.plotPlanTemplate || ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'];
  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Plan: Plot Builder</h3>
    <p class="sfq-instruction">Fill every core box before drafting.</p>
    <div class="dash-pattern-item">${fields.map((field) => `<label style="display:block;margin:8px 0"><strong>${field}</strong><textarea data-plan="${field}" class="cp-name-input" rows="2" placeholder="Plan this part..."></textarea></label>`).join('')}</div>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-plan-next">Unlock Draft</button></div>
    <div id="wq-plan-msg" class="dash-pattern-item">All core plot boxes need at least one short sentence.</div></div>`;
  // Restore saved plan values if resuming
  if (_currentPlan && Object.keys(_currentPlan).length) {
    fields.forEach(field => {
      const el = _container.querySelector(`[data-plan="${field}"]`);
      if (el && _currentPlan[field]) el.value = _currentPlan[field];
    });
  }

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
    // Persist plan and phase
    if (_track) saveDraft(_track.id, _idx, { plan: _currentPlan, phase: 'draft' });
    _render();
  });
}

function _renderDraft(item) {
  const lessonForEval = mergeLessonWithPlan(item, _currentPlan);
  // Restore saved draft text if resuming
  const savedRecord = _track ? loadDraft(_track.id, _idx) : null;
  const restoredText = savedRecord?.draftText || '';

  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Draft: ${item.lessonTitle}</h3>
    <p class="sfq-instruction">Starter: ${_selectedStarter || item.storyStarterChoices?.[0] || 'Create your own opening.'}</p>
    <div class="dash-pattern-item"><strong>Paragraph Missions</strong><ul id="wq-mission-list">${(item.paragraphMissions || []).map((m) => `<li>${typeof m === 'string' ? m : m.text}</li>`).join('')}</ul></div>
    <div class="dash-pattern-item"><strong>Checkpoints:</strong><ul>${(lessonForEval.requiredChecks || []).map((c) => `<li>${c.label}</li>`).join('')}</ul></div>
    <p class="dash-pattern-item">🧰 Support words: ${(item.supportWords || []).join(', ')}</p>
    <textarea id="wq-text" class="cp-name-input" rows="9" placeholder="Write your draft...">${_escapeHtml(restoredText)}</textarea>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-submit">Submit Draft</button></div>
    <div class="dash-pattern-item" id="wq-live-detector">Start typing to see instant writing feedback.</div>
    <div class="sfq-feedback" id="wq-feedback" hidden></div>
    ${_renderFeedbackReviewPanel()}
    </div>`;

  // Debounced auto-save for draft text
  let _draftSaveTimer = null;
  document.getElementById('wq-text')?.addEventListener('input', (event) => {
    const text = event.target.value || '';
    const hint = getLiveHint(lessonForEval, text, _level);
    const missionStatus = getParagraphMissionStatus(item, text);
    _lastMissionStatus = missionStatus;
    const detector = document.getElementById('wq-live-detector');
    if (detector) detector.innerHTML = `🧠 ${hint.words}/${hint.target} words · ${(hint.score * 100).toFixed(0)}% · focus ${_dimensionLabel(hint.weakest)} · missions ${missionStatus.filter((m) => m.hit).length}/${missionStatus.length}`;
    const missionList = document.getElementById('wq-mission-list');
    if (missionList) missionList.innerHTML = missionStatus.map((m) => `<li>${m.hit ? '✅' : '⬜'} ${m.text}</li>`).join('');

    // Auto-save draft text every 2 seconds of inactivity
    clearTimeout(_draftSaveTimer);
    _draftSaveTimer = setTimeout(() => {
      if (_track) saveDraft(_track.id, _idx, { draftText: text, phase: 'draft' });
    }, 2000);
  });

  document.getElementById('wq-submit')?.addEventListener('click', () => _submitDraft(item, lessonForEval));
  _bindFeedbackReviewToggle();
}

function _renderDimensionBreakdown(result) {
  return `<ul class="wq-dimension-list">${Object.entries(result.dimensions).map(([key, val]) => {
    const band = getDimensionBandLabel(val);
    return `<li>${DIMENSION_EMOJIS[key] || ''} <strong>${_dimensionLabel(key)}</strong>: <span class="wq-dim-band wq-dim-band--${band.replace(/\s/g, '-').toLowerCase()}">${band}</span> — ${result.feedback?.[key] || getDimensionFeedback(key, val)}</li>`;
  }).join('')}</ul>`;
}

function _renderAiCoachHtml(raw) {
  if (raw.startsWith('GOOD:')) {
    return `<div class="wq-ai-feedback-wrap"><p class="wq-ai-heading">✨ AI Coach</p><p class="wq-ai-good">${raw.replace('GOOD:', '').trim()}</p></div>`;
  }
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l.startsWith('SENTENCE:'));
  if (!lines.length) return '';
  const items = lines.map(l => {
    const [sentPart, issuePart] = l.replace('SENTENCE:', '').split('| ISSUE:');
    return `<li class="wq-ai-item"><span class="wq-ai-quote">"${(sentPart || '').trim()}"</span><span class="wq-ai-tip">${(issuePart || '').trim()}</span></li>`;
  }).join('');
  return `<div class="wq-ai-feedback-wrap"><p class="wq-ai-heading">✨ AI Coach — sentence feedback</p><ul class="wq-ai-list">${items}</ul></div>`;
}

const _AI_BAND_LABELS = { 4: 'Strong 🌟', 3: 'Secure ✅', 2: 'Developing 📈', 1: 'Needs Support 💪' };

function _renderAiRubricHtml(graded) {
  const esc = (s) => String(s ?? '').replace(/[<>&]/g, c => ({ '<':'&lt;', '>':'&gt;', '&':'&amp;' }[c]));
  const rows = Object.entries(graded.dimensions).map(([key, d]) => `
    <li class="wq-ai-item">${DIMENSION_EMOJIS[key] || ''} <strong>${_dimensionLabel(key)}</strong>:
      Band ${d.band} — ${_AI_BAND_LABELS[d.band] || ''}${d.comment ? `<span class="wq-ai-tip">${esc(d.comment)}</span>` : ''}</li>`).join('');
  return `<div class="wq-ai-feedback-wrap">
    <p class="wq-ai-heading">✨ AI Coach — rubric marking</p>
    <ul class="wq-ai-list">${rows}</ul>
    ${graded.overall ? `<p class="wq-ai-good">${esc(graded.overall)}</p>` : ''}
  </div>`;
}

async function _submitDraft(item, lessonForEval) {
  const text = document.getElementById('wq-text')?.value?.trim() || '';
  const fb = document.getElementById('wq-feedback');
  if (!text) return;
  _firstDraftText = text;

  const result = evaluateWriting(lessonForEval, text, _level);
  _firstResult = result;
  _lastDraftRemediation = getRemediationPath(result);
  const missionHits = (_lastMissionStatus || []).filter((m) => m.hit).length;
  const badges = detectBadges(result.metrics, text);

  // Persist draft text, feedback, and all structured data
  if (_track) {
    saveDraft(_track.id, _idx, {
      draftText: text,
      firstDraftText: text,
      phase: 'draft',
    });
    updateFeedback(_track.id, _idx, result, _lastDraftRemediation, _lastMissionStatus, badges);
  }

  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
    const rubric = getRubricBand(result.score);
    fb.innerHTML = `<p><strong>${result.encouragement}</strong></p>
      <p><strong>Writing Coach Feedback</strong> — ${rubric.emoji} Band ${rubric.band}: ${rubric.label} ${'⭐'.repeat(result.stars)}</p>
      <p><strong>Mission Progress:</strong> ${missionHits}/${_lastMissionStatus.length || 0}</p>
      <p><strong>Revision Mission:</strong> ${_lastDraftRemediation.title}</p>
      ${_lastDraftRemediation.missingChecks.length ? `<p>Missing checkpoints: ${_lastDraftRemediation.missingChecks.join(' · ')}</p>` : ''}
      ${_renderDimensionBreakdown(result)}
      <div>${renderBadgeChips(badges)}</div>
      <p style="font-size:0.85em;color:var(--text-muted);margin-top:6px">Take your time to read the feedback above. Press Continue when you are ready.</p>
      <div class="sfq-actions" style="margin-top:8px"><button class="btn btn--primary" id="wq-go-revise">${result.passed ? 'Continue: Polish Draft' : 'Continue: Start Repair Mission'}</button></div>`;
  }
  // Scroll feedback into view
  fb?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // AI sentence-level feedback (async, appended when ready)
  if (hasApiKey() && fb) {
    const aiSection = document.createElement('div');
    aiSection.className = 'wq-ai-feedback';
    aiSection.innerHTML = '<p class="wq-ai-loading">✨ AI coach is reading your draft…</p>';
    fb.appendChild(aiSection);
    const taskDesc = item?.title || item?.prompt || '';
    getWritingCoachFeedback(text, _level, taskDesc).then(raw => {
      if (!raw || !aiSection.isConnected) return;
      aiSection.innerHTML = _renderAiCoachHtml(raw);
    });

    // AI rubric grading next to the local bands. Commentary only — the
    // local score above remains the source of truth for XP/progression.
    const rubricSection = document.createElement('div');
    rubricSection.className = 'wq-ai-feedback';
    fb.appendChild(rubricSection);
    gradeEssayWithRubric(text, _level, taskDesc).then(graded => {
      if (!graded || !rubricSection.isConnected) return;
      rubricSection.innerHTML = _renderAiRubricHtml(graded);
    });
  }

  document.getElementById('wq-go-revise')?.addEventListener('click', () => {
    _phase = 'repair';
    if (_track) updatePhase(_track.id, _idx, 'repair');
    _render();
  });
}

function _renderRepair(item) {
  const remediation = _lastDraftRemediation || { missingChecks: [], narrativePrompts: [], title: 'Polish your draft.' };
  const firstBand = _firstResult ? getRubricBand(_firstResult.score || 0) : null;
  const firstScore = firstBand ? `Band ${firstBand.band} – ${firstBand.label}` : '?';
  const weakDim = remediation.weakestDimension || _firstResult?.weakest || 'content';
  const weakLabel = _dimensionLabel(weakDim);
  const weakFeedback = _firstResult?.feedback?.[weakDim] || getDimensionFeedback(weakDim, 0.4);

  // Build checklist items from missing checks + narrative prompts
  const checklistItems = [
    ...remediation.missingChecks.map(c => ({ text: c, type: 'checkpoint' })),
    ...remediation.narrativePrompts.map(p => ({ text: p, type: 'narrative' })),
  ];
  if (checklistItems.length === 0) {
    checklistItems.push({ text: 'Polish language and flow — all checkpoints met.', type: 'polish' });
  }

  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Revise: Repair Mission</h3>
    <div class="dash-pattern-item" style="background:var(--bg-card);padding:8px;border-radius:6px">
      <strong>First Draft Snapshot</strong> (${firstScore})
      <p style="font-size:0.9em;white-space:pre-wrap;max-height:120px;overflow-y:auto;border:1px solid var(--border);padding:6px;border-radius:4px;margin-top:4px">${_escapeHtml(_firstDraftText)}</p>
    </div>
    <div class="dash-pattern-item">
      <strong>Weakest area:</strong> ${DIMENSION_EMOJIS[weakDim] || ''} ${weakLabel}
      <p style="font-size:0.9em">${weakFeedback}</p>
    </div>
    <div class="dash-pattern-item">
      <strong>Repair Checklist</strong>
      <ul id="wq-repair-checklist">${checklistItems.map((c, i) => `<li id="repair-check-${i}">❌ ${c.text}</li>`).join('')}</ul>
    </div>
    <p class="sfq-instruction">${remediation.title}</p>
    <textarea id="wq-revision-text" class="cp-name-input" rows="9" placeholder="Write improved draft...">${_firstDraftText}</textarea>
    <div id="wq-repair-live" class="dash-pattern-item" style="font-size:0.9em">Start editing to see live repair progress.</div>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-submit-revision">Submit Revision</button></div>
    <div class="sfq-feedback" id="wq-feedback" hidden></div>
    ${_renderFeedbackReviewPanel()}
    </div>`;

  // Live repair checklist update while typing
  const lessonForEval = mergeLessonWithPlan(item, _currentPlan);
  document.getElementById('wq-revision-text')?.addEventListener('input', (event) => {
    const text = event.target.value || '';
    const hint = getLiveHint(lessonForEval, text, _level);
    const missionStatus = getParagraphMissionStatus(item, text);
    const currentResult = evaluateWriting(lessonForEval, text, _level);

    // Update live stats
    const liveEl = document.getElementById('wq-repair-live');
    const scoreDiff = currentResult.score - (_firstResult?.score || 0);
    if (liveEl) {
      const liveRubric = getRubricBand(currentResult.score);
      liveEl.innerHTML = `🔧 ${hint.words} words · ${liveRubric.emoji} ${liveRubric.label} (${scoreDiff >= 0 ? '+' : ''}${(scoreDiff * 100).toFixed(0)}%) · Missions: ${missionStatus.filter(m => m.hit).length}/${missionStatus.length}`;
    }

    // Update checklist — mark items that are now satisfied
    const checkResults = currentResult.checkResults || [];
    const missingNow = new Set(checkResults.filter(c => !c.hit).map(c => c.label));
    checklistItems.forEach((c, i) => {
      const el = document.getElementById(`repair-check-${i}`);
      if (!el) return;
      if (c.type === 'checkpoint') {
        el.textContent = missingNow.has(c.text) ? `❌ ${c.text}` : `✅ ${c.text}`;
      } else if (c.type === 'narrative') {
        // Re-evaluate narrative quality for narrative prompts
        const nq = currentResult.metrics?.narrativeQuality || {};
        const satisfied = (nq.climax > 0.3 || !c.text.includes('turning point'))
          && (nq.resolution > 0.3 || !c.text.includes('problem was solved'))
          && (nq.reflection > 0.3 || !c.text.includes('learned or felt'))
          && (nq.dialogue > 0.3 || !c.text.includes('dialogue'));
        el.textContent = satisfied ? `✅ ${c.text}` : `❌ ${c.text}`;
      }
    });
  });

  document.getElementById('wq-submit-revision')?.addEventListener('click', () => _submitRevision(item));
  _bindFeedbackReviewToggle();
}

function _escapeHtml(text) {
  return (text || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
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

  // Persist revision data
  if (_track) {
    updateRevision(_track.id, _idx, text, result, cmp, badges);
    saveDraft(_track.id, _idx, {
      revisedDraftText: text,
      phase: 'complete',
      missionStatus,
    });
  }

  // Build before/after comparison summary
  const beforeBand  = _firstResult ? getRubricBand(_firstResult.score) : null;
  const afterBand   = getRubricBand(result.score);
  const beforeWords = _firstResult?.metrics?.words || 0;
  const afterWords  = result.metrics?.words || 0;

  const dimComparison = cmp ? Object.entries(cmp.improved).map(([k, v]) => {
    const before = _firstResult?.dimensions?.[k] || 0;
    const after  = result.dimensions?.[k] || 0;
    const arrow  = v > 0.02 ? '⬆️' : v < -0.02 ? '⬇️' : '➡️';
    return `<li>${DIMENSION_EMOJIS[k] || ''} ${_dimensionLabel(k)}: ${getDimensionBandLabel(before)} ${arrow} ${getDimensionBandLabel(after)}</li>`;
  }).join('') : '';

  const fb = document.getElementById('wq-feedback');
  if (fb) {
    fb.hidden = false;
    fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
    fb.innerHTML = `<p><strong>Revision complete!</strong></p>
      <div style="display:flex;gap:16px;flex-wrap:wrap;margin:8px 0">
        <div style="flex:1;min-width:100px;text-align:center;padding:6px;border:1px solid var(--border);border-radius:6px">
          <div style="font-size:0.8em;color:var(--text-muted)">Before</div>
          <div style="font-size:1.1em;font-weight:bold">${beforeBand ? `${beforeBand.emoji} ${beforeBand.label}` : '?'}</div>
          <div style="font-size:0.8em">${beforeWords} words</div>
        </div>
        <div style="flex:1;min-width:100px;text-align:center;padding:6px;border:1px solid var(--border);border-radius:6px">
          <div style="font-size:0.8em;color:var(--text-muted)">After</div>
          <div style="font-size:1.1em;font-weight:bold">${afterBand.emoji} ${afterBand.label}</div>
          <div style="font-size:0.8em">${afterWords} words</div>
        </div>
      </div>
      <p>${cmp?.netImproved ? '📈 Your writing improved!' : '➡️ Keep refining.'} XP bonus: ${cmp?.revisionBonus || 0}</p>
      <p>Mission completion: ${missionStatus.filter((m) => m.hit).length}/${missionStatus.length}</p>
      <ul>${dimComparison}</ul>
      ${renderBadgeChips(badges)}
      <p style="font-size:0.85em;color:var(--text-muted);margin-top:6px">Review your results above. Press Continue when ready.</p>
      <div class="sfq-actions" style="margin-top:8px"><button class="btn btn--primary" id="wq-revision-continue">Continue</button></div>`;
  }
  // Scroll feedback into view and wait for user to click Continue
  fb?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  document.getElementById('wq-revision-continue')?.addEventListener('click', () => {
    _phase = 'complete';
    _render();
  });
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

  // Build a persistent feedback summary from the saved draft record
  const saved = _track ? loadDraft(_track.id, _idx) : null;
  let feedbackSummaryHtml = '';
  if (saved?.feedbackResult) {
    const r = saved.feedbackResult;
    const cmp = saved.revisionComparison;
    feedbackSummaryHtml = `<div class="wq-feedback-review-panel">
      <strong>Lesson Feedback Summary</strong>
      ${(() => { const rb = getRubricBand(r.score || 0); return `<p>${rb.emoji} Band ${rb.band}: ${rb.label} ${'⭐'.repeat(r.stars || 0)}</p>`; })()}
      <p>${r.encouragement || ''}</p>
      ${_renderDimensionBreakdown(r)}
      ${cmp?.netImproved ? `<p>📈 Revision improved your writing!</p>` : ''}
      ${saved.badges?.length ? `<p>Badges: ${saved.badges.join(' · ')}</p>` : ''}
    </div>`;
  }

  _container.innerHTML = `<div class="sfq-game"><h3>✅ Lesson complete: ${item.lessonTitle}</h3>
    ${feedbackSummaryHtml}
    <p><strong>Collection:</strong> ${collectibles.slice(-6).join(' · ') || 'None yet'}</p>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-next-lesson">Next Lesson</button></div></div>`;
  document.getElementById('wq-next-lesson')?.addEventListener('click', () => {
    // Clear the saved draft for this lesson now that it's complete
    if (_track) clearDraft(_track.id, _idx);
    _idx++;
    _phase = 'learn';
    _currentPlan = {};
    _selectedStarter = '';
    _firstDraftText = '';
    _firstResult = null;
    _lastDraftRemediation = null;
    _lastMissionStatus = [];
    _render();
  });
}

function _renderBossQuiz(item) {
  const quiz = item.bossQuiz;
  const allItems = [...quiz.questions, ...(quiz.constructedItems || [])];
  const totalItems = allItems.length;

  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Boss Check: ${item.lessonTitle}</h3>
    <form id="wq-boss-form">
      ${quiz.questions.map((q, idx) => `<div class="dash-pattern-item"><strong>Q${idx + 1}. ${q.q}</strong>${q.options.map((opt, oi) => `<label style="display:block"><input type="radio" name="${q.id}" value="${oi}"/> ${opt}</label>`).join('')}</div>`).join('')}
      ${(quiz.constructedItems || []).map((ci, idx) => _renderBossConstructedItem(ci, quiz.questions.length + idx)).join('')}
      <div class="sfq-actions"><button type="submit" class="btn btn--primary">Submit Boss Check</button></div>
    </form>
    <div class="sfq-feedback" id="wq-feedback" hidden></div></div>`;

  document.getElementById('wq-boss-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    let score = 0;
    // Grade MCQ questions
    quiz.questions.forEach((q) => {
      const val = Number(_container.querySelector(`input[name="${q.id}"]:checked`)?.value);
      if (val === q.answer) score++;
    });
    // Grade constructed-response items
    (quiz.constructedItems || []).forEach((ci) => {
      const response = _container.querySelector(`textarea[name="${ci.id}"]`)?.value?.trim() || '';
      if (_gradeBossConstructedItem(ci, response)) score++;
    });
    const passed = score >= quiz.passMark;
    _awardLessonRewards(item, { passed, score: score / totalItems, dimensions: {} }, null, []);
    const fb = document.getElementById('wq-feedback');
    if (fb) {
      fb.hidden = false;
      fb.className = `sfq-feedback sfq-feedback--${passed ? 'success' : 'error'}`;
      fb.innerHTML = `<p>${passed ? 'Boss defeated!' : 'Boss is still standing — review and retry!'} ${score}/${totalItems}</p>
      <button class="btn btn--primary" id="wq-boss-next" style="margin-top:8px">${passed ? 'Finish Track' : 'Retry Boss Check'}</button>`;
    }
    document.getElementById('wq-boss-next')?.addEventListener('click', () => {
      if (passed) _idx++;
      _render();
    });
  });
}

function _renderBossConstructedItem(ci, displayIdx) {
  if (ci.type === 'short_response') {
    return `<div class="dash-pattern-item">
      <strong>Q${displayIdx + 1}. ${ci.q}</strong>
      <p style="font-size:0.9em;color:var(--text-muted)">${ci.hint || 'Write a short answer.'}</p>
      <textarea name="${ci.id}" class="cp-name-input" rows="2" placeholder="Your answer..."></textarea>
    </div>`;
  }
  if (ci.type === 'mini_revision') {
    return `<div class="dash-pattern-item">
      <strong>Q${displayIdx + 1}. ${ci.q}</strong>
      <p style="font-size:0.9em"><em>Original:</em> "${ci.original}"</p>
      <p style="font-size:0.9em;color:var(--text-muted)">${ci.hint || 'Rewrite to improve it.'}</p>
      <textarea name="${ci.id}" class="cp-name-input" rows="2" placeholder="Your improved version..."></textarea>
    </div>`;
  }
  return '';
}

function _gradeBossConstructedItem(ci, response) {
  if (!response || response.length < 3) return false;
  const lower = response.toLowerCase();

  if (ci.type === 'short_response') {
    // Check that response contains at least one required signal
    const signals = ci.requiredSignals || [];
    if (signals.length === 0) return response.length >= 8;
    return signals.some(s => lower.includes(s.toLowerCase()));
  }

  if (ci.type === 'mini_revision') {
    const original = (ci.original || '').toLowerCase();
    // Must be different from original
    if (lower === original) return false;
    // Check for improvement signals
    const signals = ci.improvementSignals || [];
    if (signals.length === 0) return response.length > original.length;
    return signals.some(s => lower.includes(s.toLowerCase()));
  }

  return false;
}

function _renderLegacyPrompt(item) {
  // Restore saved legacy draft if available
  const savedLegacy = loadLegacyDraft(_level, _idx);
  const restoredText = savedLegacy?.draftText || '';

  _container.innerHTML = `<div class="sfq-game"><h3 class="cloze-title">Writing Quest (${item.textType})</h3>
    <p class="sfq-instruction">${item.prompt}</p>
    <p class="dash-pattern-item">Legacy prompt mode remains available for this level.</p>
    <textarea id="wq-text" class="cp-name-input" rows="9" placeholder="Write your response here...">${_escapeHtml(restoredText)}</textarea>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-submit">Submit</button></div><div class="sfq-feedback" id="wq-feedback" hidden></div></div>`;

  // Auto-save legacy draft
  let _legacySaveTimer = null;
  document.getElementById('wq-text')?.addEventListener('input', (e) => {
    clearTimeout(_legacySaveTimer);
    _legacySaveTimer = setTimeout(() => {
      saveLegacyDraft(_level, _idx, { draftText: e.target.value || '', phase: 'draft' });
    }, 2000);
  });

  document.getElementById('wq-submit')?.addEventListener('click', () => {
    const text = document.getElementById('wq-text')?.value?.trim() || '';
    if (!text) return;
    const result = evaluateWriting(item, text, _level);
    _awardLessonRewards(item, result, null, []);

    // Persist legacy feedback
    saveLegacyDraft(_level, _idx, {
      draftText: text,
      firstDraftText: text,
      feedbackResult: result,
      phase: 'complete',
    });

    const fb = document.getElementById('wq-feedback');
    if (fb) {
      fb.hidden = false;
      fb.className = `sfq-feedback sfq-feedback--${result.passed ? 'success' : 'error'}`;
      const legacyRubric = getRubricBand(result.score || 0);
      fb.innerHTML = `<p><strong>${result.encouragement || (result.passed ? 'Well done!' : 'Keep practising!')}</strong></p>
        <p><strong>Writing Coach Feedback</strong> — ${legacyRubric.emoji} Band ${legacyRubric.band}: ${legacyRubric.label} ${'⭐'.repeat(result.stars || 0)}</p>
        ${_renderDimensionBreakdown(result)}
        <p style="font-size:0.85em;color:var(--text-muted);margin-top:6px">Review your feedback. Press Continue when ready.</p>
        <div class="sfq-actions" style="margin-top:8px"><button class="btn btn--primary" id="wq-legacy-continue">Continue</button></div>`;
    }
    fb?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    document.getElementById('wq-legacy-continue')?.addEventListener('click', () => {
      clearLegacyDraft(_level, _idx);
      _idx++;
      _render();
    });
  });
}

function _renderDone() {
  // Track-based progress is the primary source of truth
  if (_track) {
    setTrackProgress(_track.id, _list.length, _list.length, _level);
  }
  // Legacy writingCompleted maintained as backward-compat fallback only
  const completed = { ...(store.get('writingCompleted') || {}) };
  completed[_level] = Math.max(completed[_level] || 0, _list.length);
  store.set('writingCompleted', completed);

  _container.innerHTML = `<div class="sfq-game"><h3>🎉 Writing Quest complete</h3><p>${_track ? `Track cleared: ${_track.track}.` : 'Level complete.'}</p>
    <div class="sfq-actions"><button class="btn btn--primary" id="wq-back">Back to Levels</button></div></div>`;
  document.getElementById('wq-back')?.addEventListener('click', () => {
    if (_tracksForLevel.length > 1) return _renderTrackBrowser(_level);
    showWritingBrowser();
  });
}

/**
 * Render a collapsible "View Feedback" panel that shows the latest persisted
 * feedback for the current lesson. Shown in draft and repair phases so the
 * learner (or parent) can review feedback at any time.
 */
function _renderFeedbackReviewPanel() {
  const saved = _track ? loadDraft(_track.id, _idx) : null;
  if (!saved?.feedbackResult) return '';
  const r = saved.feedbackResult;
  const rem = saved.remediation;
  const ms = saved.missionStatus || [];
  const cmp = saved.revisionComparison;
  const badges = saved.badges || [];

  return `<div class="wq-feedback-review-panel" id="wq-review-panel">
    <button class="wq-review-toggle" id="wq-review-toggle" aria-expanded="false">
      View Last Feedback
    </button>
    <div class="wq-review-body" id="wq-review-body" hidden>
      <p><strong>${r.encouragement || ''}</strong></p>
      ${(() => { const rb = getRubricBand(r.score || 0); return `<p>${rb.emoji} Band ${rb.band}: ${rb.label} ${'⭐'.repeat(r.stars || 0)}</p>`; })()}
      <p>Mission Progress: ${ms.filter(m => m.hit).length}/${ms.length}</p>
      ${rem?.title ? `<p>Revision Mission: ${rem.title}</p>` : ''}
      ${rem?.missingChecks?.length ? `<p>Missing: ${rem.missingChecks.join(' · ')}</p>` : ''}
      ${_renderDimensionBreakdown(r)}
      ${badges.length ? `<p>Badges: ${badges.join(' · ')}</p>` : ''}
      ${cmp?.netImproved ? `<p>📈 Revision improved! XP bonus: ${cmp.revisionBonus || 0}</p>` : ''}
    </div>
  </div>`;
}

/** Bind the toggle behaviour for the feedback review panel. */
function _bindFeedbackReviewToggle() {
  const toggle = document.getElementById('wq-review-toggle');
  const body = document.getElementById('wq-review-body');
  if (!toggle || !body) return;
  toggle.addEventListener('click', () => {
    const expanded = body.hidden;
    body.hidden = !expanded;
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? 'Hide Feedback' : 'View Last Feedback';
  });
}

export function cleanupWritingQuest() {
  if (_container) _container.innerHTML = '';
}

export { evaluateWritingSubmission, getWritingLiveFeedback } from '../modules/writingEvaluator.js';
