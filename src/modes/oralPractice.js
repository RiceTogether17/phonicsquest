/**
 * PhonicsQuest – Oral Practice
 *
 * One sitting of the oral exam: read a passage aloud, then talk about a
 * notice on the same theme. Nothing here listens to or judges the child's
 * voice. The child (or the adult beside them) hears a model, records and
 * plays back their own attempt, and rates it against a short checklist, so
 * it works on any device with no account and no network.
 *
 * UI flow:
 *   Browser → level band, then a set
 *   Reading → purpose, words to rehearse, passage, hear / record, self-check
 *   Talk    → the notice, three questions one at a time, each with sentence
 *             starters, record, a model answer after the attempt, self-check
 *   Results → what went well, the one thing to work on next
 *
 * Lifecycle:
 *   initOralPractice(container, onGoHome)
 *   showOralBrowser()
 *   cleanupOralPractice()
 */

import { ORAL_BANDS, oralSetsForBand } from '../data/oralSets.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { escapeHtml } from '../utils/escapeHtml.js';

/** What the child rates after reading aloud. Each is scored 0, 1 or 2. */
export const READING_CHECKS = Object.freeze([
  {
    id: 'words',
    label: 'I said the words correctly',
    tip: 'Tap each word in "Practise these words first", then read the passage again one sentence at a time.',
  },
  {
    id: 'pace',
    label: 'I read smoothly, not too fast and not too slow',
    tip: 'Pause for a short breath at every comma and a longer one at every full stop.',
  },
  {
    id: 'feeling',
    label: 'My voice showed the feeling',
    tip: 'Find the speech marks. Read those words the way the person would really say them.',
  },
]);

/** What the child rates after each conversation answer. Scored 0, 1 or 2. */
export const TALK_CHECKS = Object.freeze([
  {
    id: 'ideas',
    label: 'I gave my answer, a reason and an example',
    tip: 'Use the pattern: my answer, because…, for example…',
  },
  {
    id: 'clear',
    label: 'I spoke in full, clear sentences',
    tip: 'Start with one of the sentence starters and finish the whole sentence before you begin the next.',
  },
]);

const RATING_WORDS = Object.freeze(['Not yet', 'Mostly', 'Yes']);

/** Marks each part carries in the Primary 6 oral exam. */
const EXAM_WEIGHTS = Object.freeze({ reading: 15, talk: 25 });

// ── Module state ─────────────────────────────────────────────────────────────

let _container = null;
let _onGoHome = null;
let _band = ORAL_BANDS[0];
let _set = null;
/** 'browser' | 'reading' | 'talk' | 'results' */
let _step = 'browser';
let _promptIdx = 0;
let _modelShown = false;
/** @type {Record<string, number>} */
let _readingRatings = {};
/** @type {Array<Record<string, number>>} */
let _talkRatings = [];

/** @type {MediaRecorder|null} */
let _recorder = null;
/** @type {MediaStream|null} */
let _stream = null;
let _recordingUrl = null;
let _micMessage = '';

// ── Scoring (pure, exported for tests) ───────────────────────────────────────

/**
 * Turn the two sets of self-ratings into totals and the one thing to work on.
 * @param {Record<string, number>} reading  READING_CHECKS id → 0..2
 * @param {Array<Record<string, number>>} talk  one map per prompt, TALK_CHECKS id → 0..2
 */
export function summariseOral(reading, talk) {
  const readingMax = READING_CHECKS.length * 2;
  const readingScore = READING_CHECKS.reduce((n, c) => n + (reading?.[c.id] ?? 0), 0);
  const talkMax = (talk?.length ?? 0) * TALK_CHECKS.length * 2;
  const talkScore = (talk ?? []).reduce(
    (n, r) => n + TALK_CHECKS.reduce((m, c) => m + (r?.[c.id] ?? 0), 0),
    0,
  );

  // The weakest check, as a share of what it could have scored. Reading
  // wins a tie, because it comes first in the exam and is quicker to fix.
  const shares = [
    ...READING_CHECKS.map((c) => ({ check: c, share: (reading?.[c.id] ?? 0) / 2 })),
    ...TALK_CHECKS.map((c) => ({
      check: c,
      share: talk?.length ? talk.reduce((n, r) => n + (r?.[c.id] ?? 0), 0) / (talk.length * 2) : 1,
    })),
  ];
  const weakest = shares.reduce((low, s) => (s.share < low.share ? s : low), shares[0]);

  return {
    readingScore,
    readingMax,
    talkScore,
    talkMax,
    nextStep: weakest.share < 1 ? weakest.check : null,
    examGuide: {
      reading: Math.round((readingScore / readingMax) * EXAM_WEIGHTS.reading),
      talk: talkMax ? Math.round((talkScore / talkMax) * EXAM_WEIGHTS.talk) : 0,
      readingOutOf: EXAM_WEIGHTS.reading,
      talkOutOf: EXAM_WEIGHTS.talk,
    },
  };
}

// ── Recording ────────────────────────────────────────────────────────────────

function _canRecord() {
  return (
    typeof navigator !== 'undefined' &&
    !!navigator.mediaDevices?.getUserMedia &&
    typeof window.MediaRecorder === 'function'
  );
}

function _dropRecording() {
  if (_recordingUrl) URL.revokeObjectURL(_recordingUrl);
  _recordingUrl = null;
}

function _releaseMic() {
  try {
    if (_recorder && _recorder.state !== 'inactive') _recorder.stop();
  } catch (_) {
    /* already stopped */
  }
  _stream?.getTracks().forEach((t) => t.stop());
  _recorder = null;
  _stream = null;
}

async function _startRecording() {
  _dropRecording();
  _micMessage = '';
  audio.cancelSpeech?.();
  try {
    _stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const chunks = [];
    const recorder = new MediaRecorder(_stream);
    recorder.addEventListener('dataavailable', (e) => {
      if (e.data?.size) chunks.push(e.data);
    });
    recorder.addEventListener('stop', () => {
      _stream?.getTracks().forEach((t) => t.stop());
      _stream = null;
      _recorder = null;
      if (chunks.length) {
        _recordingUrl = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }));
      }
      _renderRecorder();
    });
    _recorder = recorder;
    recorder.start();
  } catch (_) {
    _releaseMic();
    _micMessage = 'The microphone is not available. You can still practise by speaking aloud.';
  }
  _renderRecorder();
}

function _recorderHtml() {
  if (!_canRecord()) {
    return '<p class="oral-note">Say it aloud to someone, or to yourself in a mirror.</p>';
  }
  const recording = !!_recorder;
  const button = recording
    ? '<button class="btn btn--danger" type="button" data-act="record-stop">■ Stop recording</button>'
    : `<button class="btn btn--primary" type="button" data-act="record-start">🎙 ${
        _recordingUrl ? 'Record again' : 'Record myself'
      }</button>`;
  const status = recording ? '<span class="oral-recording" role="status">● Recording…</span>' : '';
  const playback = _recordingUrl
    ? `<audio class="oral-playback" controls src="${escapeHtml(_recordingUrl)}" aria-label="Play back my recording"></audio>`
    : '';
  const note = _micMessage
    ? `<p class="oral-note" role="status">${escapeHtml(_micMessage)}</p>`
    : '<p class="oral-note">Your recording stays on this device and is cleared when you move on.</p>';
  return `${button}${status}${playback}${note}`;
}

function _renderRecorder() {
  const slot = _container?.querySelector('#oral-recorder');
  if (slot) slot.innerHTML = _recorderHtml();
}

// ── Shared pieces ────────────────────────────────────────────────────────────

function _checksHtml(checks, ratings, group) {
  return checks
    .map((c) => {
      const options = RATING_WORDS.map((word, value) => {
        const on = ratings[c.id] === value;
        return `<button class="btn ${on ? 'btn--primary' : 'btn--ghost'} oral-rate" type="button"
          data-act="rate" data-group="${group}" data-check="${c.id}" data-value="${value}"
          aria-pressed="${on}">${word}</button>`;
      }).join('');
      return `
      <div class="oral-check" role="group" aria-label="${escapeHtml(c.label)}">
        <span class="oral-check-label">${escapeHtml(c.label)}</span>
        <span class="oral-check-options">${options}</span>
      </div>`;
    })
    .join('');
}

function _allRated(checks, ratings) {
  return checks.every((c) => Number.isInteger(ratings[c.id]));
}

function _noticeHtml(notice) {
  const lines = notice.lines.map((l) => `<li>${escapeHtml(l)}</li>`).join('');
  return `
    <figure class="oral-notice" aria-label="Notice: ${escapeHtml(notice.heading)}">
      <div class="oral-notice-emoji" aria-hidden="true">${escapeHtml(notice.emoji)}</div>
      <figcaption class="oral-notice-heading">${escapeHtml(notice.heading)}</figcaption>
      <ul class="oral-notice-lines">${lines}</ul>
    </figure>`;
}

// ── Screens ──────────────────────────────────────────────────────────────────

function _browserHtml() {
  const done = store.get('oralCompleted') || {};
  const tabs = ORAL_BANDS.map(
    (b) => `
    <button class="btn ${b === _band ? 'btn--primary' : 'btn--ghost'}" type="button"
            data-act="band" data-band="${b}" aria-pressed="${b === _band}">${b.replace('-', ' to ')}</button>`,
  ).join('');
  const cards = oralSetsForBand(_band)
    .map(
      (s) => `
      <button class="lc-passage-card" type="button" data-act="open" data-id="${escapeHtml(s.id)}">
        <div class="lc-passage-title">${done[s.id] ? '✅ ' : ''}${escapeHtml(s.title)}</div>
        <div class="lc-passage-meta">${escapeHtml(s.theme)} · read aloud, then 3 questions</div>
      </button>`,
    )
    .join('');
  return `
    <section class="oral" aria-label="Oral Practice">
      <header class="oral-head">
        <h2>🎤 Oral Practice</h2>
        <p class="oral-note">Read a passage aloud, then talk about a notice on the same theme. About 10 minutes.</p>
      </header>
      <div class="oral-tabs">${tabs}</div>
      <div class="lc-passage-grid">${cards}</div>
      <footer class="oral-foot">
        <button class="btn btn--ghost" type="button" data-act="home">← Back to home</button>
      </footer>
    </section>`;
}

function _readingHtml() {
  const s = _set;
  const watch = s.watch
    .map(
      (w) => `
      <li class="oral-watch-item">
        <button class="btn btn--ghost oral-watch-word" type="button" data-act="say" data-word="${escapeHtml(w.word)}"
                aria-label="Hear the word ${escapeHtml(w.word)}">🔊 ${escapeHtml(w.word)}</button>
        <span class="oral-watch-tip">${escapeHtml(w.tip)}</span>
      </li>`,
    )
    .join('');
  const paragraphs = s.passage.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
  return `
    <section class="oral" aria-label="Reading aloud">
      <button class="btn btn--ghost" type="button" data-act="browser">← Back to sets</button>
      <p class="oral-step">Part 1 of 2 · Reading aloud</p>
      <h2 class="oral-title">${escapeHtml(s.title)}</h2>
      <p class="oral-purpose">${escapeHtml(s.purpose)}</p>

      <details class="oral-watch" open>
        <summary>Practise these words first</summary>
        <ul class="oral-watch-list">${watch}</ul>
      </details>

      <div class="oral-passage" id="oral-passage">${paragraphs}</div>

      <div class="oral-actions">
        <button class="btn btn--ghost" type="button" data-act="hear">▶ Hear it read</button>
        <button class="btn btn--ghost" type="button" data-act="hush">■ Stop</button>
      </div>
      <div class="oral-actions" id="oral-recorder">${_recorderHtml()}</div>

      <section class="oral-checks" aria-label="Check my reading">
        <h3>How did the reading go?</h3>
        ${_checksHtml(READING_CHECKS, _readingRatings, 'reading')}
      </section>

      <button class="btn btn--success oral-next" type="button" data-act="to-talk"
              ${_allRated(READING_CHECKS, _readingRatings) ? '' : 'disabled'}>Next: the conversation →</button>
    </section>`;
}

function _talkHtml() {
  const s = _set;
  const prompt = s.prompts[_promptIdx];
  const ratings = _talkRatings[_promptIdx] || {};
  const starters = prompt.starters.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
  const last = _promptIdx === s.prompts.length - 1;
  const model = _modelShown
    ? `<div class="oral-model" role="region" aria-label="One good answer">
         <h3>One good answer</h3>
         <p>${escapeHtml(prompt.model)}</p>
         <button class="btn btn--ghost" type="button" data-act="hear-model">▶ Hear it</button>
       </div>
       <section class="oral-checks" aria-label="Check my answer">
         <h3>How did your answer go?</h3>
         ${_checksHtml(TALK_CHECKS, ratings, 'talk')}
       </section>
       <button class="btn btn--success oral-next" type="button" data-act="next-prompt"
               ${_allRated(TALK_CHECKS, ratings) ? '' : 'disabled'}>${
                 last ? 'See how I did →' : 'Next question →'
               }</button>`
    : `<button class="btn btn--success oral-next" type="button" data-act="show-model">I have answered. Show a good answer</button>`;
  return `
    <section class="oral" aria-label="Conversation">
      <button class="btn btn--ghost" type="button" data-act="browser">← Back to sets</button>
      <p class="oral-step">Part 2 of 2 · Conversation · Question ${_promptIdx + 1} of ${s.prompts.length}</p>
      ${_noticeHtml(s.notice)}
      <p class="oral-question">
        <button class="btn btn--ghost oral-hear-q" type="button" data-act="hear-q" aria-label="Hear the question">🔊</button>
        ${escapeHtml(prompt.q)}
      </p>
      <div class="oral-starters">
        <h3>You could begin with</h3>
        <ul>${starters}</ul>
        <p class="oral-note">Aim for three or four sentences: your answer, a reason, an example.</p>
      </div>
      <div class="oral-actions" id="oral-recorder">${_recorderHtml()}</div>
      ${model}
    </section>`;
}

function _resultsHtml() {
  const s = _set;
  const sum = summariseOral(_readingRatings, _talkRatings);
  const exam =
    s.band === 'P5-P6'
      ? `<p class="oral-note">As a rough guide from your own check: reading aloud about
           ${sum.examGuide.reading} out of ${sum.examGuide.readingOutOf}, conversation about
           ${sum.examGuide.talk} out of ${sum.examGuide.talkOutOf}. An examiner may see it differently.</p>`
      : '';
  const next = sum.nextStep
    ? `<div class="oral-model">
         <h3>One thing to work on next</h3>
         <p><strong>${escapeHtml(sum.nextStep.label)}.</strong> ${escapeHtml(sum.nextStep.tip)}</p>
       </div>`
    : `<div class="oral-model"><h3>Well done!</h3><p>You were happy with every part. Try a new set, or the next level up.</p></div>`;
  return `
    <section class="oral" aria-label="Oral Practice results">
      <h2 class="oral-title">${escapeHtml(s.title)}</h2>
      <p class="oral-step">Your own check</p>
      <ul class="oral-scores">
        <li><span>Reading aloud</span><strong>${sum.readingScore} / ${sum.readingMax}</strong></li>
        <li><span>Conversation</span><strong>${sum.talkScore} / ${sum.talkMax}</strong></li>
      </ul>
      ${exam}
      ${next}
      <div class="oral-actions">
        <button class="btn btn--primary" type="button" data-act="again">Do this set again</button>
        <button class="btn btn--ghost" type="button" data-act="browser">Choose another set</button>
        <button class="btn btn--ghost" type="button" data-act="home">Back to home</button>
      </div>
    </section>`;
}

function _render() {
  if (!_container) return;
  const html =
    _step === 'reading'
      ? _readingHtml()
      : _step === 'talk'
        ? _talkHtml()
        : _step === 'results'
          ? _resultsHtml()
          : _browserHtml();
  _container.innerHTML = html;
}

/** Leave whatever was playing or recording behind before the screen changes. */
function _quiet() {
  audio.cancelSpeech?.();
  _releaseMic();
  _dropRecording();
  _micMessage = '';
}

function _go(step) {
  _quiet();
  _step = step;
  _render();
  _container?.scrollTo?.({ top: 0 });
  _container?.querySelector('h2, .oral-step')?.scrollIntoView?.({ block: 'start' });
}

function _openSet(id) {
  const set = oralSetsForBand(_band).find((s) => s.id === id);
  if (!set) return;
  _set = set;
  _promptIdx = 0;
  _modelShown = false;
  _readingRatings = {};
  _talkRatings = set.prompts.map(() => ({}));
  _go('reading');
}

function _saveResult() {
  const sum = summariseOral(_readingRatings, _talkRatings);
  try {
    const done = { ...(store.get('oralCompleted') || {}) };
    done[_set.id] = {
      at: new Date().toISOString(),
      reading: sum.readingScore,
      readingMax: sum.readingMax,
      talk: sum.talkScore,
      talkMax: sum.talkMax,
      nextStep: sum.nextStep?.id ?? null,
    };
    store.set('oralCompleted', done);
  } catch (_) {
    /* best effort: never block the results screen */
  }
}

/** Re-render without losing the scroll position or an in-progress recording. */
function _refreshKeepingPlace() {
  const top = _container?.scrollTop ?? 0;
  const pageTop = typeof window !== 'undefined' ? window.scrollY : 0;
  _render();
  if (_container) _container.scrollTop = top;
  if (typeof window !== 'undefined') window.scrollTo?.(0, pageTop);
}

function _onClick(e) {
  const el = e.target.closest?.('[data-act]');
  if (!el || !_container?.contains(el)) return;
  const act = el.dataset.act;

  if (act === 'home') {
    _quiet();
    _onGoHome?.();
  } else if (act === 'browser') {
    _go('browser');
  } else if (act === 'band') {
    _band = el.dataset.band;
    _render();
  } else if (act === 'open') {
    _openSet(el.dataset.id);
  } else if (act === 'again') {
    _openSet(_set.id);
  } else if (act === 'say') {
    audio.speakWord?.(el.dataset.word);
  } else if (act === 'hear') {
    audio.speakText?.(_set.passage.join(' '));
  } else if (act === 'hush') {
    audio.cancelSpeech?.();
  } else if (act === 'hear-q') {
    audio.speakText?.(_set.prompts[_promptIdx].q);
  } else if (act === 'hear-model') {
    audio.speakText?.(_set.prompts[_promptIdx].model);
  } else if (act === 'record-start') {
    _startRecording();
  } else if (act === 'record-stop') {
    try {
      _recorder?.stop();
    } catch (_) {
      _releaseMic();
      _renderRecorder();
    }
  } else if (act === 'rate') {
    const value = Number(el.dataset.value);
    if (el.dataset.group === 'reading') _readingRatings[el.dataset.check] = value;
    else _talkRatings[_promptIdx][el.dataset.check] = value;
    _refreshKeepingPlace();
    _container
      .querySelector(
        `[data-act="rate"][data-check="${el.dataset.check}"][data-value="${el.dataset.value}"]`,
      )
      ?.focus?.({ preventScroll: true });
  } else if (act === 'to-talk') {
    _promptIdx = 0;
    _modelShown = false;
    _go('talk');
  } else if (act === 'show-model') {
    _modelShown = true;
    audio.cancelSpeech?.();
    _releaseMic();
    _refreshKeepingPlace();
    _container.querySelector('.oral-model')?.scrollIntoView?.({ block: 'nearest' });
  } else if (act === 'next-prompt') {
    if (_promptIdx < _set.prompts.length - 1) {
      _promptIdx += 1;
      _modelShown = false;
      _go('talk');
    } else {
      _saveResult();
      _go('results');
    }
  }
}

// ── Lifecycle ────────────────────────────────────────────────────────────────

export function initOralPractice(container, onGoHome) {
  cleanupOralPractice();
  _container = container;
  _onGoHome = onGoHome;
  _container?.addEventListener('click', _onClick);
}

export function showOralBrowser() {
  _set = null;
  _go('browser');
}

export function cleanupOralPractice() {
  _quiet();
  _container?.removeEventListener('click', _onClick);
  _container = null;
  _onGoHome = null;
  _set = null;
  _step = 'browser';
}
