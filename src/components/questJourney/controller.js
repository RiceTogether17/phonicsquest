/**
 * Quest Journey — controller for the vertical slice.
 *
 * Boots the journey into a single host element. Drives the state machine:
 *
 *   welcome → quest-map → lesson-intro
 *           → game(soundMatch) ×3
 *           → game(blendBuilder) ×3
 *           → results → quest-map
 *
 * Persists attempts via `attemptLog` so the parent dashboard sees them.
 *
 * The controller is intentionally small. Each screen is a pure render
 * function; the controller wires their callbacks into a tiny state
 * machine that calls `render()` on every transition.
 */

import {
  renderWelcome,
  renderQuestMap,
  renderLessonIntro,
  renderGameMode,
  renderResults,
  renderProgressView,
} from './screens.js';
import { buildLesson } from './rounds.js';
import { PHONICS_MODES } from '../../modes/phonicsModes.js';
import { CURRICULUM } from '../../data/curriculum.js';
import { attemptLog, summarise } from '../../modules/progressAnalytics.js';

// Default vertical-slice stage — Phase 2 (CCVC Short A: flat, clap, trap).
// Override at mount time with `mountQuestJourney(host, { stageId: ... })`.
const SLICE_STAGE = 'ccvc-a';
const ROUNDS_PER_MODE = 3;

/**
 * Mount the journey into `host`. Returns a small handle the caller can
 * use to navigate or tear down.
 */
export function mountQuestJourney(host, opts = {}) {
  if (!host) throw new Error('mountQuestJourney: host element is required');

  const log = opts.attemptLog ?? attemptLog();
  const learnerName = opts.learnerName ?? 'Learner';
  const rng = opts.rng ?? Math.random;

  const state = {
    screen: 'welcome',
    stageId: opts.stageId ?? SLICE_STAGE,
    learnerName,
    lesson: null,
    currentMode: null,        // 'soundMatch' | 'blendBuilder'
    roundIndex: 0,
    attemptsThisLesson: 0,
    correctThisLesson: 0,
    wordsPractised: [],
    feedback: null,           // { state, copy, hint }
    pendingAdvance: false,
  };

  function _startLesson() {
    state.lesson = buildLesson(state.stageId, { roundsPerMode: ROUNDS_PER_MODE, rng });
    if (!state.lesson) {
      // Misconfigured/empty stage — stay on the map rather than dropping
      // the child into a contentless game loop.
      return _goMap();
    }
    state.currentMode = 'soundMatch';
    state.roundIndex = 0;
    state.attemptsThisLesson = 0;
    state.correctThisLesson = 0;
    state.wordsPractised = [];
    state.feedback = null;
    state.screen = 'game';
    render();
  }

  function _advanceRound() {
    if (!state.lesson) return _goMap();
    const rounds = state.lesson[state.currentMode];
    if (state.roundIndex + 1 < rounds.length) {
      state.roundIndex++;
      state.feedback = null;
    } else if (state.currentMode === 'soundMatch') {
      state.currentMode = 'blendBuilder';
      state.roundIndex = 0;
      state.feedback = null;
    } else {
      // Lesson complete — go to results.
      state.screen = 'results';
    }
    render();
  }

  function _scoreAnswer(answer) {
    const mode = PHONICS_MODES[state.currentMode];
    const result = mode.score(answer);
    const round = state.lesson[state.currentMode][state.roundIndex];
    const word = round?.target?.word ?? round?.word ?? '';

    state.attemptsThisLesson++;
    if (result.correct) state.correctThisLesson++;
    if (word && !state.wordsPractised.includes(word)) state.wordsPractised.push(word);

    log.push({
      timestamp: Date.now(),
      stageId: state.stageId,
      group:   state.stageId,
      mode:    state.currentMode,
      word,
      correct: result.correct,
      errorCategory: result.errorCategory ?? null,
      timeMs:  answer?.timeMs ?? 0,
      targetSound: round?.prompt?.sound ?? null,
    });

    if (result.correct) {
      state.feedback = {
        state: 'correct',
        copy:  'Yes! 🎉',
        hint:  '',
        cta:   'Next',
      };
    } else {
      state.feedback = {
        state: 'wrong-first',
        copy:  'Almost! Have another go.',
        hint:  result.hint || mode.errorHints.default,
        cta:   'Try again',
      };
    }
    render();
  }

  function _onContinueFromFeedback() {
    if (!state.feedback) return _advanceRound();
    if (state.feedback.state === 'correct') {
      _advanceRound();
    } else {
      // Stay on the same round so the child can try again.
      state.feedback = null;
      render();
    }
  }

  function _resultsSummary() {
    const accuracy = state.attemptsThisLesson > 0
      ? state.correctThisLesson / state.attemptsThisLesson
      : 0;
    const stars = accuracy >= 0.9 ? 3 : accuracy >= 0.7 ? 2 : accuracy >= 0.4 ? 1 : 0;
    return {
      name:          state.learnerName,
      stageId:       state.stageId,
      totalRounds:   state.attemptsThisLesson,
      correctRounds: state.correctThisLesson,
      accuracy,
      stars,
      wordsPractised: state.wordsPractised,
      mastered: accuracy >= 0.8,
    };
  }

  function _goMap()      { state.screen = 'map';      state.feedback = null; render(); }
  function _goWelcome()  { state.screen = 'welcome';  render(); }
  function _goLesson(id) { state.stageId = id; state.screen = 'lesson'; render(); }
  function _goProgress() { state.screen = 'progress'; render(); }

  function render() {
    switch (state.screen) {
      case 'welcome':
        renderWelcome(host, {
          onStart: () => _goLesson(state.stageId),
          onPickProfile: () => {/* slice doesn't include profile select */ _goMap(); },
          onAdult: _goProgress,
        });
        break;
      case 'map': {
        const mastered = _masteredStageIds(log.list());
        renderQuestMap(host, {
          currentStageId: state.stageId,
          masteredStageIds: mastered,
          unlockedStageIds: _unlockedStageIds(mastered),
          onPick: _goLesson,
          onAdult: _goProgress,
        });
        break;
      }
      case 'lesson':
        renderLessonIntro(host, {
          stageId: state.stageId,
          onStart: _startLesson,
          onBack: _goMap,
          onReplay: () => {},
        });
        break;
      case 'game': {
        const round = state.lesson?.[state.currentMode]?.[state.roundIndex];
        const totalRounds = state.lesson?.[state.currentMode]?.length ?? 0;
        renderGameMode(host, {
          modeKey:      state.currentMode,
          round,
          totalRounds,
          currentRound: state.roundIndex + 1,
          feedback:     state.feedback,
          onAnswer:     _scoreAnswer,
          onPause:      _goMap,
          onContinue:   _onContinueFromFeedback,
        });
        break;
      }
      case 'results':
        renderResults(host, {
          summary: _resultsSummary(),
          onContinue: _goMap,
          onBackToMap: _goMap,
        });
        break;
      case 'progress':
        renderProgressView(host, {
          summary: summarise(log.list(), { curriculum: CURRICULUM }),
          onBack:  _goWelcome,
          onPrint: () => { if (typeof window !== 'undefined' && window.print) window.print(); },
        });
        break;
      default:
        host.innerHTML = '';
    }
  }

  // Initial render.
  host.classList.add('qj-app');
  render();

  return {
    /** @returns {object} controller state snapshot — primarily for tests */
    getState: () => ({ ...state }),
    /** Force a re-render — primarily for tests */
    render,
    /** Programmatic navigation */
    goTo: (screen) => { state.screen = screen; render(); },
    /** Tear down — clears the host */
    destroy: () => { host.innerHTML = ''; host.classList.remove('qj-app'); },
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

function _masteredStageIds(attempts) {
  // Use the analytics module's mastery logic by inlining the threshold —
  // we don't want a circular import of summarise here.
  const counts = new Map();
  for (const a of attempts) {
    if (!a?.stageId) continue;
    const c = counts.get(a.stageId) ?? { attempts: 0, correct: 0 };
    c.attempts++;
    if (a.correct) c.correct++;
    counts.set(a.stageId, c);
  }
  const out = [];
  for (const [id, c] of counts.entries()) {
    if (c.attempts >= 6 && c.correct / c.attempts >= 0.8) out.push(id);
  }
  return out;
}

function _unlockedStageIds(masteredIds) {
  const mastered = new Set(masteredIds);
  const unlocked = [];
  for (const stage of CURRICULUM) {
    if (!stage.prerequisite) { unlocked.push(stage.id); continue; }
    if (mastered.has(stage.prerequisite)) unlocked.push(stage.id);
  }
  return unlocked;
}
