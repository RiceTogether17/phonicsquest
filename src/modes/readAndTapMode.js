/**
 * Read & Tap Mode  (Connected text — locate a decodable word in a sentence)
 *
 * Core loop:
 * 1. A decodable sentence is shown, one tappable button per word, and the
 *    sentence is read aloud followed by the target word.
 * 2. The child taps the word they heard.
 * 3. Two-try contract via choiceRound: first miss gets a category-specific
 *    coaching hint from the canonical Read & Tap scorer (onset / rhyme /
 *    anywhere) plus a replay; the second tap reveals.
 *
 * The sentence comes from the curriculum stage's sentenceExamples when one
 * contains the shell word; otherwise a simple sight-word template is used so
 * the target is ALWAYS the shell word (keeping the shell's Say-It button and
 * attempt recording honest).
 */

import { renderWordImage } from '../components/phonemeDisplay.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { CURRICULUM } from '../data/curriculum.js';
import { findStageForGroup } from '../components/miniLesson.js';
import { tokenizeSentence, getReadAndTapHint } from './scoring/readAndTap.js';
import { createChoiceRound } from './choiceRound.js';

const TEMPLATES = [
  (w) => `I can see the ${w}.`,
  (w) => `Look at the ${w}!`,
  (w) => `The ${w} is here.`,
];

let _word = null;
let _els = null;
let _sentence = '';
let _round = null;
let _firstTap = null; // { word, index } — the scorer's tappedWord/tappedIndex
let _startTime = 0;
let _timeouts = [];

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupReadAndTap(word, els) {
  _word = word;
  _els = els;
  _firstTap = null;
  _timeouts = [];
  _startTime = Date.now();

  const target = tokenizeSentence(word.word)[0]?.word ?? word.word.toLowerCase();
  _sentence = _pickSentence(word, target);

  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';
  els.modeInstruction.textContent = 'Read the sentence. Tap the word you hear.';

  // Say-It stays visible: the target IS the shell word, so the shell's
  // replay button remains truthful in this mode.
  if (els.btnCheck) els.btnCheck.style.display = 'none';
  if (els.btnSayIt) els.btnSayIt.style.display = '';
  if (els.btnSkip) els.btnSkip.style.display = '';

  els.modeArea.innerHTML = /* html */ `
    <div class="rt-round">
      <div class="rt-sentence choice-grid choice-grid--sentence" id="rt-sentence"
           role="group" aria-label="Sentence — tap the word you hear"></div>
      <div class="rt-hint" id="rt-hint" role="status" aria-live="polite"></div>
    </div>
  `;

  const grid = document.getElementById('rt-sentence');
  const tokens = tokenizeSentence(_sentence);
  for (const t of tokens) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn rt-token';
    btn.textContent = t.surface;
    btn.dataset.correct = String(t.word === target);
    btn.dataset.index = String(t.index);
    btn.setAttribute('aria-label', t.surface);
    btn.addEventListener('click', () => {
      if (!_round || _round.isDone() || btn.disabled) return;
      _firstTap ??= { word: t.word, index: t.index };
      _round.handleTap(btn.dataset.correct === 'true', btn);
    });
    grid.appendChild(btn);
  }

  const rtHint = document.getElementById('rt-hint');
  _round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    onRetry: () => {
      // Category-specific coaching from the canonical scorer's hint engine.
      if (rtHint && _firstTap) {
        rtHint.textContent = `💡 ${getReadAndTapHint({
          sentence: _sentence,
          target,
          tappedWord: _firstTap.word,
          tappedIndex: _firstTap.index,
          timeMs: Date.now() - _startTime,
        })}`;
      }
      _timeouts.push(
        setTimeout(() => {
          audio
            .speakText(_sentence)
            .then(() => audio.speakWord(word.word))
            .catch(() => {});
        }, 250),
      );
    },
    onReveal: () => {
      grid
        .querySelectorAll('[data-correct="true"]')
        .forEach((b) => b.classList.add('rt-token--target'));
      _timeouts.push(setTimeout(() => audio.speakWord(word.word), 500));
    },
  });

  // Read the sentence, then announce the word to find.
  _timeouts.push(
    setTimeout(() => {
      audio
        .speakText(_sentence)
        .then(() => audio.speakWord(word.word))
        .catch(() => {});
    }, 400),
  );
}

/**
 * Pick a curriculum sentence containing the target word; fall back to a
 * deterministic sight-word template so the target is always present.
 */
function _pickSentence(word, target) {
  const stageGroup = store.get('currentGroup') || word.group;
  const stage =
    CURRICULUM.find((s) => s.group === stageGroup || s.id === stageGroup) ||
    findStageForGroup(word.group);

  for (const s of stage?.sentenceExamples ?? []) {
    if (tokenizeSentence(s).some((t) => t.word === target)) return s;
  }

  // Deterministic template by word id so the same word always reads the same.
  let hash = 0;
  for (const ch of String(word.id)) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return TEMPLATES[hash % TEMPLATES.length](word.word);
}

export function getCurrentWord() {
  return _word;
}

export function cleanup() {
  _timeouts.forEach((id) => clearTimeout(id));
  _timeouts = [];
  _word = null;
  _els = null;
  _round = null;
  _firstTap = null;
  _sentence = '';
}
