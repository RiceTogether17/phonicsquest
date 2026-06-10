/**
 * PhonicsQuest – Mini-Lesson Overlay
 *
 * The shared explicit-instruction layer: a tutor-style "I do → we do →
 * you do" sequence shown before independent practice.
 *
 *   Step 1 (I do)  – Giri teaches the target sound/pattern: headline,
 *                    tappable sound chips, a short narrated script, and
 *                    "watch out" confusion pointers.
 *   Step 2 (We do) – Giri and the child blend one word together using
 *                    the colour-coded phoneme tiles.
 *   Step 3 (You do)– "Your turn!" hands off to the practice mode.
 *
 * Lesson content lives in src/data/lessons/phonicsLessons.js (lazy-loaded
 * here so it stays out of the initial bundle). Stage metadata comes from
 * CURRICULUM. First-encounter gating uses the `lessonsSeen` store key.
 */

import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { CURRICULUM } from '../data/curriculum.js';
import { WORDS } from '../data/words.js';
import { renderPhonemes } from './phonemeDisplay.js';
import { escapeHtml, escapeAttr } from '../utils/escapeHtml.js';

const OVERLAY_ID = 'mini-lesson-overlay';

/** Find the curriculum stage for a word-group key (stage.group or stage.id). */
export function findStageForGroup(group) {
  if (!group) return null;
  return CURRICULUM.find(s => s.group === group || s.id === group) ?? null;
}

/** Has this child already been taught this lesson? */
export function hasSeenLesson(lessonKey) {
  const seen = store.get('lessonsSeen') || {};
  return !!seen[lessonKey];
}

/** Record that a lesson has been taught (idempotent). */
export function markLessonSeen(lessonKey) {
  const seen = { ...(store.get('lessonsSeen') || {}) };
  if (seen[lessonKey]) return;
  seen[lessonKey] = new Date().toISOString();
  store.set('lessonsSeen', seen);
}

function _removeOverlay() {
  document.getElementById(OVERLAY_ID)?.remove();
  document.removeEventListener('keydown', _onKeydown);
  try { window.speechSynthesis?.cancel(); } catch { /* no TTS */ }
}

let _onDismiss = null;
function _onKeydown(e) {
  if (e.key === 'Escape') {
    e.stopPropagation();
    const cb = _onDismiss;
    _onDismiss = null;
    _removeOverlay();
    cb?.();
  }
}

/**
 * Show the mini-lesson for a curriculum stage, if one exists and the
 * child hasn't been taught it yet.
 *
 * @param {string} group  word-group key the session is practising
 * @param {object} [opts]
 * @param {boolean} [opts.force]  show even if already seen (replay)
 * @returns {Promise<boolean>}  resolves true once the overlay closes
 *                              (or immediately with false if not shown)
 */
export async function maybeShowStageLesson(group, { force = false } = {}) {
  const stage = findStageForGroup(group);
  if (!stage) return false;

  const lessonKey = `phonics:${stage.id}`;
  if (!force && hasSeenLesson(lessonKey)) return false;

  // Lesson scripts are lazy-loaded so the bank stays out of the home bundle.
  const { getPhonicsLesson } = await import('../data/lessons/phonicsLessons.js');
  const lesson = getPhonicsLesson(stage.id);
  if (!lesson) return false;

  return new Promise(resolve => {
    showMiniLesson({ stage, lesson, onDone: () => {
      markLessonSeen(lessonKey);
      resolve(true);
    } });
  });
}

/**
 * Render the lesson overlay. Exposed separately so the curriculum map /
 * lesson runner can replay a lesson on demand.
 *
 * @param {object} params
 * @param {object} params.stage   CURRICULUM stage
 * @param {object} params.lesson  PHONICS_LESSONS entry
 * @param {Function} params.onDone
 */
export function showMiniLesson({ stage, lesson, onDone }) {
  _removeOverlay();
  _onDismiss = onDone;

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  overlay.className = 'mini-lesson-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', `Lesson: ${stage.name}`);
  document.body.appendChild(overlay);
  document.addEventListener('keydown', _onKeydown);

  const finish = () => {
    _onDismiss = null;
    _removeOverlay();
    onDone?.();
  };

  _renderTeachStep(overlay, stage, lesson, () => {
    _renderWeDoStep(overlay, stage, lesson, finish);
  });
}

/* ── Step 1: I do (Giri teaches) ─────────────────────────────────── */

function _renderTeachStep(overlay, stage, lesson, onNext) {
  const chips = (lesson.soundChips || []).map((chip, i) => `
    <button class="mini-lesson-chip mini-lesson-chip--${escapeAttr(chip.type)}" data-chip="${i}"
            aria-label="Play the sound ${escapeAttr(chip.label)}">
      ${escapeHtml(chip.label)} <span aria-hidden="true">🔊</span>
    </button>`).join('');

  const scriptLines = lesson.script.map(line => `
    <li class="mini-lesson-line">${escapeHtml(line)}</li>`).join('');

  const confusions = (lesson.confusions || []).map(c => `
    <p class="mini-lesson-confusion">⚠️ ${escapeHtml(c)}</p>`).join('');

  overlay.innerHTML = `
    <div class="mini-lesson-panel" role="document">
      <div class="mini-lesson-step-tag">Lesson · Step 1 of 2</div>
      <div class="mini-lesson-mascot" aria-hidden="true">🦉</div>
      <h2 class="mini-lesson-headline">${escapeHtml(lesson.headline)}</h2>
      <p class="mini-lesson-stage">${escapeHtml(stage.name)}</p>
      ${chips ? `<div class="mini-lesson-chips" role="group" aria-label="Tap to hear the sounds">${chips}</div>` : ''}
      <ol class="mini-lesson-script">${scriptLines}</ol>
      ${confusions}
      <div class="mini-lesson-actions">
        <button class="btn btn--ghost" id="mini-lesson-listen">🔊 Read it to me</button>
        <button class="btn btn--primary" id="mini-lesson-next">Let's try one together →</button>
      </div>
      <button class="mini-lesson-skip" id="mini-lesson-skip">Skip lesson</button>
    </div>`;

  overlay.querySelectorAll('[data-chip]').forEach(btn => {
    btn.addEventListener('click', () => {
      const chip = lesson.soundChips[Number(btn.dataset.chip)];
      if (chip) audio.speakPhoneme(chip.g, chip.type);
    });
  });

  overlay.querySelector('#mini-lesson-listen')?.addEventListener('click', async () => {
    for (const line of lesson.script) {
      // Narration stops if the overlay was closed mid-read.
      if (!document.getElementById(OVERLAY_ID)) return;
      await audio.speakText(line);
    }
  });

  overlay.querySelector('#mini-lesson-next')?.addEventListener('click', onNext);
  overlay.querySelector('#mini-lesson-skip')?.addEventListener('click', () => {
    const cb = _onDismiss;
    _onDismiss = null;
    _removeOverlay();
    cb?.();
  });

  overlay.querySelector('#mini-lesson-next')?.focus();
}

/* ── Step 2: We do (blend one word together) ─────────────────────── */

function _renderWeDoStep(overlay, stage, lesson, onDone) {
  const word = WORDS.find(w => w.word === lesson.weDoWord);

  overlay.innerHTML = `
    <div class="mini-lesson-panel" role="document">
      <div class="mini-lesson-step-tag">Lesson · Step 2 of 2</div>
      <div class="mini-lesson-mascot" aria-hidden="true">🦉</div>
      <h2 class="mini-lesson-headline">Let's read one together!</h2>
      <p class="mini-lesson-stage">${escapeHtml(stage.name)}</p>
      <div class="mini-lesson-word">
        ${word?.emoji ? `<span class="mini-lesson-emoji" aria-hidden="true">${word.emoji}</span>` : ''}
        <div class="mini-lesson-tiles phoneme-row" id="mini-lesson-tiles" role="list" aria-label="Sounds in ${escapeAttr(lesson.weDoWord)}"></div>
      </div>
      <p class="mini-lesson-prompt">Giri says each sound — say them with Giri, then say the whole word!</p>
      <div class="mini-lesson-actions">
        <button class="btn btn--primary" id="mini-lesson-blend">🔊 Blend it with Giri</button>
        <button class="btn btn--primary" id="mini-lesson-done" hidden>Your turn! Start practice →</button>
      </div>
      <button class="mini-lesson-skip" id="mini-lesson-skip2">Skip to practice</button>
    </div>`;

  const tilesHost = overlay.querySelector('#mini-lesson-tiles');
  if (word && tilesHost) {
    renderPhonemes(word, tilesHost, { showDiacritics: true });
  } else if (tilesHost) {
    tilesHost.outerHTML = `<span class="mini-lesson-plain-word">${escapeHtml(lesson.weDoWord)}</span>`;
  }

  const doneBtn = overlay.querySelector('#mini-lesson-done');
  overlay.querySelector('#mini-lesson-blend')?.addEventListener('click', async () => {
    if (word) {
      await audio.speakWordStretched(word);
    } else {
      await audio.speakWord(lesson.weDoWord);
    }
    if (doneBtn) {
      doneBtn.hidden = false;
      doneBtn.focus();
    }
  });

  doneBtn?.addEventListener('click', onDone);
  overlay.querySelector('#mini-lesson-skip2')?.addEventListener('click', onDone);
  overlay.querySelector('#mini-lesson-blend')?.focus();
}
