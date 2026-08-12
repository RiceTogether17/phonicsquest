/**
 * PhonicsQuest – Listening Comprehension Mode
 *
 * UI flow:
 *   Browser  → level selector (P1–P6), then passage grid
 *   Passage  → title + TTS controls (listen / stop) + "Answer Questions →"
 *   Questions → one at a time (P3–P6) or all-at-once (P1–P2), textarea +
 *               model-answer reveal + self-mark buttons
 *   Results  → score summary, encouraging message, navigation buttons
 *
 * Lifecycle:
 *   initListeningComp(container, onGoHome)
 *   showListeningBrowser()
 *   cleanupListeningComp()
 */

import { OPEN_COMPREHENSION_PASSAGES } from '../data/openComprehensionPassages.js';
import { LISTENING_PASSAGES } from '../data/listeningPassages.js';
import { store } from '../modules/store.js';
import { escapeHtml } from '../utils/escapeHtml.js';
import { attachMcqAnswerLadder } from './mcqFeedback.js';

// ── Module state ─────────────────────────────────────────────────────────────

let _container = null;
let _onGoHome = null;
let _selectedLevel = 'P3';
let _currentPassage = null;
let _hasListened = false;
let _currentQ = 0;
let _scores = [];
let _utterance = null;

// ── Speech helpers ────────────────────────────────────────────────────────────

function _speak(text) {
  window.speechSynthesis.cancel();
  _utterance = new SpeechSynthesisUtterance(text);
  _utterance.rate = store.get('voiceSpeed') || 0.9;
  _utterance.lang = 'en-SG';
  window.speechSynthesis.speak(_utterance);
}

function _stopSpeaking() {
  window.speechSynthesis.cancel();
  _utterance = null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Mount the Listening Comprehension mode.
 * @param {HTMLElement} container
 * @param {() => void} onGoHome
 */
export function initListeningComp(container, onGoHome) {
  if (!container) return;
  _container = container;
  _onGoHome = typeof onGoHome === 'function' ? onGoHome : () => {};
  _selectedLevel = 'P3';
  _currentPassage = null;
  _hasListened = false;
  _currentQ = 0;
  _scores = [];
  _utterance = null;
}

/** Navigate to the passage browser (level + grid). */
export function showListeningBrowser() {
  _stopSpeaking();
  _currentPassage = null;
  _hasListened = false;
  _currentQ = 0;
  _scores = [];
  _renderBrowser();
}

/** Teardown — stop TTS and clear the container. */
export function cleanupListeningComp() {
  _stopSpeaking();
  if (_container) _container.innerHTML = '';
  _container = null;
  _onGoHome = null;
  _currentPassage = null;
  _hasListened = false;
  _utterance = null;
}

// ── Data helpers ──────────────────────────────────────────────────────────────

const LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

function _passagesForLevel(level) {
  // Purpose-written listening sets (auto-marked MCQ) first, then the shared
  // open-ended passages (self-marked against a model answer).
  return [
    ...LISTENING_PASSAGES.filter((p) => p.level === level),
    ...OPEN_COMPREHENSION_PASSAGES.filter((p) => p.level === level),
  ];
}

/** Listening-set passages carry MCQ options; open-ended ones don't. */
function _isMcqPassage(p = _currentPassage) {
  return Array.isArray(p?.questions?.[0]?.options);
}

// ── Screen: Browser ───────────────────────────────────────────────────────────

function _renderBrowser() {
  if (!_container) return;

  const levelTabs = LEVELS.map(
    (lv) => `
    <button class="btn ${lv === _selectedLevel ? 'btn--primary' : 'btn--ghost'} lc-level-tab"
            type="button" data-level="${lv}" aria-pressed="${lv === _selectedLevel}">
      ${escapeHtml(lv)}
    </button>`,
  ).join('');

  _container.innerHTML = `
    <section class="lc-browser" aria-label="Listening Comprehension">
      <header style="margin-bottom:var(--space-3,12px)">
        <h2 style="margin:0 0 var(--space-2,8px)">&#128066; Listening Comprehension</h2>
        <p style="color:var(--text-muted,#888);margin:0">Choose a level and a passage. Listen, then answer questions.</p>
      </header>

      <div class="lc-level-tabs" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:var(--space-3,12px)">
        ${levelTabs}
      </div>

      <div id="lc-passage-grid" class="lc-passage-grid" aria-live="polite"></div>

      <footer style="margin-top:var(--space-4,16px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home">&#8592; Back to home</button>
      </footer>
    </section>`;

  _container.querySelectorAll('.lc-level-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      _selectedLevel = btn.dataset.level;
      _renderBrowser();
    });
  });

  document.getElementById('lc-btn-home')?.addEventListener('click', () => {
    _onGoHome?.();
  });

  _renderPassageGrid();
}

function _renderPassageGrid() {
  const grid = document.getElementById('lc-passage-grid');
  if (!grid) return;

  const passages = _passagesForLevel(_selectedLevel);
  if (passages.length === 0) {
    grid.innerHTML =
      '<p style="color:var(--text-muted,#888)">No passages available for this level yet.</p>';
    return;
  }

  grid.innerHTML = passages
    .map((p) => {
      const qCount = Array.isArray(p.questions) ? p.questions.length : 0;
      const kindLabel = _isMcqPassage(p)
        ? `🎧 Listening set · pick the answer`
        : `✏️ Open-ended · self-marked`;
      return `
      <button class="lc-passage-card" type="button" data-id="${escapeHtml(p.id)}"
              aria-label="Start ${escapeHtml(p.title)}, ${qCount} question${qCount !== 1 ? 's' : ''}">
        <div class="lc-passage-title">${escapeHtml(p.title)}</div>
        <div class="lc-passage-meta">${kindLabel} · ${qCount} question${qCount !== 1 ? 's' : ''}</div>
      </button>`;
    })
    .join('');

  grid.querySelectorAll('.lc-passage-card').forEach((card) => {
    card.addEventListener('click', () => {
      const passage = passages.find((p) => p.id === card.dataset.id);
      if (passage) _openPassage(passage);
    });
  });
}

// ── Screen: Passage (TTS) ─────────────────────────────────────────────────────

function _openPassage(passage) {
  _stopSpeaking();
  _currentPassage = passage;
  _hasListened = false;
  _renderPassageScreen();
}

function _renderPassageScreen() {
  if (!_container || !_currentPassage) return;
  const p = _currentPassage;
  const qCount = Array.isArray(p.questions) ? p.questions.length : 0;

  _container.innerHTML = `
    <section class="lc-browser" aria-label="Listen to Passage">
      <header style="margin-bottom:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-back-browser" style="margin-bottom:var(--space-2,8px)">&#8592; Back to passages</button>
        <h2 style="margin:0">${escapeHtml(p.title)}</h2>
        <p style="color:var(--text-muted,#888);margin:var(--space-1,4px) 0 0">
          ${escapeHtml(p.level)} &middot; ${qCount} question${qCount !== 1 ? 's' : ''}
        </p>
      </header>

      <div class="lc-player">
        <p style="color:var(--text-muted,#888);margin-bottom:var(--space-3,12px)">
          Press <strong>Listen</strong> to hear the passage read aloud. You can listen as many times as you like.
        </p>
        <button class="btn btn--primary lc-listen-btn" type="button" id="lc-btn-listen">&#9654; Listen to Passage</button>
        <button class="btn btn--ghost lc-listen-btn" type="button" id="lc-btn-stop" style="display:none">&#9632; Stop</button>
        <div id="lc-answer-btn-wrap" style="${_hasListened ? '' : 'display:none'}">
          <hr style="margin:var(--space-4,16px) 0;border:none;border-top:1px solid var(--border,#e5e3fa)">
          <button class="btn btn--success" type="button" id="lc-btn-to-questions">Answer Questions &#8594;</button>
        </div>
      </div>

      <footer style="margin-top:var(--space-4,16px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home2">&#8592; Back to home</button>
      </footer>
    </section>`;

  const listenBtn = document.getElementById('lc-btn-listen');
  const stopBtn = document.getElementById('lc-btn-stop');
  const answerWrap = document.getElementById('lc-answer-btn-wrap');

  listenBtn?.addEventListener('click', () => {
    _speak(p.script || p.passage);
    listenBtn.style.display = 'none';
    stopBtn.style.display = '';
    if (_utterance) {
      _utterance.addEventListener('end', () => {
        stopBtn.style.display = 'none';
        listenBtn.style.display = '';
      });
    }
    if (!_hasListened) {
      _hasListened = true;
      answerWrap.style.display = '';
    }
  });

  stopBtn?.addEventListener('click', () => {
    _stopSpeaking();
    stopBtn.style.display = 'none';
    listenBtn.style.display = '';
  });

  document.getElementById('lc-btn-to-questions')?.addEventListener('click', () => {
    _stopSpeaking();
    _currentQ = 0;
    _scores = [];
    _renderQuestionsScreen();
  });

  document.getElementById('lc-back-browser')?.addEventListener('click', () => {
    _stopSpeaking();
    showListeningBrowser();
  });

  document.getElementById('lc-btn-home2')?.addEventListener('click', () => {
    _onGoHome?.();
  });
}

// ── Screen: Questions ─────────────────────────────────────────────────────────

/** P1 and P2 get all questions at once; P3+ get one at a time. */
function _isAllAtOnce() {
  return _currentPassage?.level === 'P1' || _currentPassage?.level === 'P2';
}

function _renderQuestionsScreen() {
  if (!_container || !_currentPassage) return;

  if (_isMcqPassage()) {
    _renderMcqQuestion(_currentQ);
  } else if (_isAllAtOnce()) {
    _renderAllQuestions();
  } else {
    _renderSingleQuestion(_currentQ);
  }
}

/**
 * One auto-marked multiple-choice question at a time (listening sets).
 * Tap a choice → instant marking, the authored "how the script gives it
 * away" explanation, then Next.
 */
function _renderMcqQuestion(qIndex) {
  const p = _currentPassage;
  const questions = p.questions || [];

  if (qIndex >= questions.length) {
    _renderResults();
    return;
  }

  const q = questions[qIndex];
  const total = questions.length;

  // Shuffle at render time — authored option order must never be learnable
  // (e.g. "the first option is always right").
  const shuffled = [...q.options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  _container.innerHTML = `
    <section class="lc-browser" aria-label="Question ${qIndex + 1} of ${total}">
      <header style="margin-bottom:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-back-passage3" style="margin-bottom:var(--space-2,8px)">&#8592; Listen again</button>
        <h2 style="margin:0">${escapeHtml(p.title)}</h2>
        <p style="color:var(--text-muted,#888);margin:var(--space-1,4px) 0 0">Question ${qIndex + 1} of ${total}</p>
      </header>

      <div class="lc-question-box" id="lc-mcq-block">
        <p style="font-weight:700;margin:0 0 var(--space-2,8px)">
          Q${qIndex + 1}. ${escapeHtml(q.q || '')}
        </p>
        <div class="lc-mcq-options" style="display:flex;flex-direction:column;gap:8px">
          ${shuffled
            .map(
              (opt) => `
            <button class="btn btn--ghost lc-mcq-option" type="button" data-choice="${escapeHtml(opt)}"
                    style="text-align:left;justify-content:flex-start">${escapeHtml(opt)}</button>`,
            )
            .join('')}
        </div>
        <div id="lc-mcq-feedback" class="lc-model-answer" style="display:none" role="status" aria-live="polite"></div>
        <div id="lc-mcq-next-wrap" style="display:none;margin-top:var(--space-3,12px)">
          <button class="btn btn--primary" type="button" id="lc-mcq-next">
            ${qIndex + 1 >= total ? 'See My Score →' : 'Next →'}
          </button>
        </div>
      </div>

      <footer style="margin-top:var(--space-4,16px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home4">&#8592; Back to home</button>
      </footer>
    </section>`;

  const nextWrap = document.getElementById('lc-mcq-next-wrap');
  const nextBtn = document.getElementById('lc-mcq-next');
  nextBtn?.addEventListener('click', () => {
    _currentQ = qIndex + 1;
    _renderMcqQuestion(_currentQ);
  });

  attachMcqAnswerLadder({
    root: _container,
    item: { q: q.q, answer: q.answer, choices: shuffled, explain: q.explain },
    feedbackEl: document.getElementById('lc-mcq-feedback'),
    nextWrap,
    nextBtn,
    mode: 'listeningComp',
    domain: 'comprehension',
    skillLabel: 'Listening comprehension',
    // A listener who missed a detail should hear it again, not re-read a page.
    cue: 'Play that part once more and listen for the answer, then choose again.',
    // The score is the first attempt; the second listen is for learning.
    onFirstAttempt: (ok) => {
      _scores[qIndex] = ok ? 1 : 0;
    },
  });

  document.getElementById('lc-back-passage3')?.addEventListener('click', () => {
    _stopSpeaking();
    _renderPassageScreen();
  });

  document.getElementById('lc-btn-home4')?.addEventListener('click', () => {
    _onGoHome?.();
  });
}

function _renderAllQuestions() {
  const p = _currentPassage;
  const questions = p.questions || [];

  const questionBlocks = questions
    .map(
      (q, i) => `
    <div class="lc-question-box" id="lc-q-block-${i}">
      <p style="font-weight:700;margin:0 0 var(--space-2,8px)">
        Q${i + 1}. ${escapeHtml(q.q || q.question || '')}
      </p>
      <textarea class="lc-answer-area" id="lc-answer-${i}"
                placeholder="Write your answer here&#8230;"
                aria-label="Answer for question ${i + 1}"></textarea>
      <div style="margin-top:8px">
        <button class="btn btn--secondary" type="button" data-check="${i}">Check Answer</button>
      </div>
      <div id="lc-reveal-${i}" style="display:none">
        <div class="lc-model-answer">
          <strong>Model Answer:</strong> ${escapeHtml(q.model || q.modelAnswer || '')}
        </div>
        <div class="lc-self-mark">
          <button class="btn btn--success" type="button" data-mark="right" data-qi="${i}">&#10003; Got it right</button>
          <button class="btn btn--danger"  type="button" data-mark="wrong" data-qi="${i}">&#10007; Got it wrong</button>
        </div>
        <p id="lc-marked-${i}" style="display:none;font-size:0.9em;color:var(--text-muted,#888);margin-top:4px"></p>
      </div>
    </div>`,
    )
    .join('');

  _container.innerHTML = `
    <section class="lc-browser" aria-label="Answer Questions">
      <header style="margin-bottom:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-back-passage2" style="margin-bottom:var(--space-2,8px)">&#8592; Back to passage</button>
        <h2 style="margin:0">${escapeHtml(p.title)}</h2>
        <p style="color:var(--text-muted,#888);margin:var(--space-1,4px) 0 0">Answer all questions, then see your score.</p>
      </header>

      <div id="lc-questions-body">
        ${questionBlocks}
      </div>

      <div style="margin-top:var(--space-4,16px)">
        <button class="btn btn--primary" type="button" id="lc-btn-finish">See My Score &#8594;</button>
      </div>

      <footer style="margin-top:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home3">&#8592; Back to home</button>
      </footer>
    </section>`;

  // Check-answer buttons
  _container.querySelectorAll('[data-check]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.check, 10);
      const reveal = document.getElementById(`lc-reveal-${idx}`);
      if (reveal) reveal.style.display = '';
      btn.style.display = 'none';
    });
  });

  // Self-mark buttons
  _container.querySelectorAll('[data-mark]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.qi, 10);
      const mark = btn.dataset.mark;
      _scores[idx] = mark === 'right' ? 1 : 0;
      const markedEl = document.getElementById(`lc-marked-${idx}`);
      if (markedEl) {
        markedEl.style.display = '';
        markedEl.textContent = mark === 'right' ? '✓ Marked as correct' : '✗ Marked as incorrect';
      }
      // Disable both self-mark buttons for this question
      const block = document.getElementById(`lc-q-block-${idx}`);
      block?.querySelectorAll('[data-mark]').forEach((b) => {
        b.disabled = true;
      });
    });
  });

  document.getElementById('lc-btn-finish')?.addEventListener('click', () => {
    // Fill any unscored questions as 0
    const total = questions.length;
    for (let i = 0; i < total; i++) {
      if (_scores[i] === undefined) _scores[i] = 0;
    }
    _renderResults();
  });

  document.getElementById('lc-back-passage2')?.addEventListener('click', () => {
    _renderPassageScreen();
  });

  document.getElementById('lc-btn-home3')?.addEventListener('click', () => {
    _onGoHome?.();
  });
}

function _renderSingleQuestion(qIndex) {
  const p = _currentPassage;
  const questions = p.questions || [];

  if (qIndex >= questions.length) {
    _renderResults();
    return;
  }

  const q = questions[qIndex];
  const total = questions.length;

  _container.innerHTML = `
    <section class="lc-browser" aria-label="Question ${qIndex + 1} of ${total}">
      <header style="margin-bottom:var(--space-3,12px)">
        <button class="btn btn--ghost" type="button" id="lc-back-passage3" style="margin-bottom:var(--space-2,8px)">&#8592; Back to passage</button>
        <h2 style="margin:0">${escapeHtml(p.title)}</h2>
        <p style="color:var(--text-muted,#888);margin:var(--space-1,4px) 0 0">Question ${qIndex + 1} of ${total}</p>
      </header>

      <div class="lc-question-box" id="lc-single-q-block">
        <p style="font-weight:700;margin:0 0 var(--space-2,8px)">
          Q${qIndex + 1}. ${escapeHtml(q.q || q.question || '')}
        </p>
        <textarea class="lc-answer-area" id="lc-single-answer"
                  placeholder="Write your answer here&#8230;"
                  aria-label="Answer for question ${qIndex + 1}"></textarea>
        <div style="margin-top:8px">
          <button class="btn btn--secondary" type="button" id="lc-check-btn">Check Answer</button>
        </div>
        <div id="lc-single-reveal" style="display:none">
          <div class="lc-model-answer">
            <strong>Model Answer:</strong> ${escapeHtml(q.model || q.modelAnswer || '')}
          </div>
          <div class="lc-self-mark">
            <button class="btn btn--success" type="button" id="lc-mark-right">&#10003; Got it right</button>
            <button class="btn btn--danger"  type="button" id="lc-mark-wrong">&#10007; Got it wrong</button>
          </div>
        </div>
      </div>

      <footer style="margin-top:var(--space-4,16px)">
        <button class="btn btn--ghost" type="button" id="lc-btn-home4">&#8592; Back to home</button>
      </footer>
    </section>`;

  document.getElementById('lc-check-btn')?.addEventListener('click', () => {
    document.getElementById('lc-single-reveal').style.display = '';
    document.getElementById('lc-check-btn').style.display = 'none';
  });

  function _recordAndAdvance(got) {
    _scores[qIndex] = got ? 1 : 0;
    _currentQ = qIndex + 1;
    _renderSingleQuestion(_currentQ);
  }

  document
    .getElementById('lc-mark-right')
    ?.addEventListener('click', () => _recordAndAdvance(true));
  document
    .getElementById('lc-mark-wrong')
    ?.addEventListener('click', () => _recordAndAdvance(false));

  document.getElementById('lc-back-passage3')?.addEventListener('click', () => {
    _stopSpeaking();
    _renderPassageScreen();
  });

  document.getElementById('lc-btn-home4')?.addEventListener('click', () => {
    _onGoHome?.();
  });
}

// ── Screen: Results ───────────────────────────────────────────────────────────

function _renderResults() {
  if (!_container || !_currentPassage) return;
  const p = _currentPassage;
  const total = (p.questions || []).length;
  const correct = _scores.filter((s) => s === 1).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  let message;
  if (pct === 100) {
    message = 'Perfect score! Outstanding listening and comprehension!';
  } else if (pct >= 75) {
    message = 'Great job! You understood the passage really well.';
  } else if (pct >= 50) {
    message = 'Good effort! Keep practising — you are getting there.';
  } else {
    message = 'Keep it up! Try listening again and re-reading your answers.';
  }

  const trophyIcon =
    pct === 100 ? '&#127942;' : pct >= 75 ? '&#11088;' : pct >= 50 ? '&#128077;' : '&#128170;';

  _container.innerHTML = `
    <section class="lc-browser" aria-label="Results">
      <div style="text-align:center;padding:var(--space-5,24px) 0">
        <div style="font-size:3rem;margin-bottom:var(--space-2,8px)">${trophyIcon}</div>
        <h2 style="margin:0 0 var(--space-1,4px)">${escapeHtml(p.title)}</h2>
        <p style="font-size:1.4em;font-weight:700;margin:var(--space-2,8px) 0">
          ${correct} / ${total} correct
        </p>
        <p style="color:var(--text-muted,#888);margin:0 0 var(--space-4,16px)">${escapeHtml(message)}</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn--primary" type="button" id="lc-btn-try-again">Try Again</button>
          <button class="btn btn--ghost"   type="button" id="lc-btn-back-passages">Back to Passages</button>
          <button class="btn btn--ghost"   type="button" id="lc-btn-home5">&#8592; Back to home</button>
        </div>
      </div>
    </section>`;

  document.getElementById('lc-btn-try-again')?.addEventListener('click', () => {
    _openPassage(p);
  });

  document.getElementById('lc-btn-back-passages')?.addEventListener('click', () => {
    showListeningBrowser();
  });

  document.getElementById('lc-btn-home5')?.addEventListener('click', () => {
    _onGoHome?.();
  });
}
