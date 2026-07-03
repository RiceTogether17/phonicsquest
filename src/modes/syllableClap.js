/**
 * Clap the Syllables Mode  (Phonemic Awareness — Syllable Counting)
 *
 * Inspired by "Let's All Clap" from Foundations phonics: hear a word,
 * clap once per syllable (don-key = 2 claps), then pick the count.
 * Distinct from Sound Count, which counts *phonemes*. Syllables are
 * the wider beat — a CVC word has 3 phonemes but 1 syllable.
 *
 * Syllable awareness is a PHONOLOGICAL skill that develops earlier than
 * phonemic awareness (word → syllable → onset-rime → phoneme), so this
 * mode is available from the very start and is decoupled from the
 * decoding curriculum: it draws words from the dedicated, always-open
 * pool in src/data/syllableWords.js (which ramps 1→4 syllables), not
 * the lockable curriculum stages. See _startGame in app.js.
 *
 * Core loop:
 * 1. Show the word's picture (image, NOT the printed word — counting
 *    syllables from the printed letters is the trap this mode avoids).
 * 2. Play the word.
 * 3. Big 👏 Clap button — each tap adds a beat to a visible counter
 *    and plays a short clap sound, so the child gets motor + audio
 *    feedback for each beat.
 * 4. Choice grid below: 1, 2, 3, 4 — child picks the syllable count.
 * 5. Reveal the printed word with its syllable breakdown (don-key).
 */

import { renderWordImage } from '../components/phonemeDisplay.js';
import { audio } from '../modules/audio.js';
import { getSyllableCount, getSyllableBreakdown } from '../modules/syllables.js';
import { createChoiceRound } from './choiceRound.js';

let _currentWord = null;
let _round       = null;
let _clapCount   = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupSyllableClap(word, els) {
  _currentWord = word;
  _clapCount   = 0;

  // Image yes, printed word no — same rationale as Sound Count.
  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';
  els.modeInstruction.textContent = 'Clap the syllables — how many beats?';

  const correctCount = getSyllableCount(word);

  els.modeArea.innerHTML = /* html */`
    <div class="syllable-mode">
      <button class="clap-button" id="clap-btn" type="button" aria-label="Tap to clap">
        <span class="clap-button-emoji" aria-hidden="true">👏</span>
        <span class="clap-button-label">Clap!</span>
      </button>
      <div class="clap-counter" aria-live="polite" aria-label="Claps so far">
        <span id="clap-count-display">0</span>
      </div>
      <div class="syllable-choices choice-grid choice-grid--count" id="syllable-grid"></div>
    </div>
  `;

  document.getElementById('clap-btn')?.addEventListener('click', () => {
    _clapCount++;
    const display = document.getElementById('clap-count-display');
    if (display) display.textContent = String(_clapCount);
    audio.playSfx('clap');
  });

  const grid = els.modeArea.querySelector('#syllable-grid');
  // Choice range always covers the correct answer plus at least one
  // higher option, capped at 6 so the grid stays tappable for little
  // fingers (1-syllable words still show a full 1–4 set).
  const maxChoice = Math.min(6, Math.max(4, correctCount + 1));
  for (let n = 1; n <= maxChoice; n++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className       = 'choice-btn choice-btn--count';
    btn.dataset.correct = String(n === correctCount);
    btn.dataset.value   = String(n);
    btn.setAttribute('aria-label', `${n} syllable${n !== 1 ? 's' : ''}`);

    const num = document.createElement('span');
    num.className   = 'count-number';
    num.textContent = String(n);

    const dots = document.createElement('span');
    dots.className   = 'count-dots';
    dots.textContent = '●'.repeat(n);

    btn.appendChild(num);
    btn.appendChild(dots);
    btn.addEventListener('click', () => _round?.handleTap(n === correctCount, btn));
    grid.appendChild(btn);
  }

  _round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Clap it out slowly, one beat at a time.',
    onRetry: () => { setTimeout(() => audio.speakWord(word.word), 200); },
    onReveal: () => _revealAnswer(word, els),
  });

  if (els.btnCheck) els.btnCheck.style.display = 'none';
  if (els.btnSayIt) els.btnSayIt.style.display = '';
  if (els.btnSkip)  els.btnSkip.style.display  = '';

  setTimeout(() => audio.speakWord(word.word), 400);
}

/** Reveal: printed word + syllable breakdown, then re-play the word. */
function _revealAnswer(word, els) {
  const breakdown = getSyllableBreakdown(word);
  els.wordDisplay.innerHTML = `
    <div class="syllable-reveal">
      <div class="syllable-reveal-word">${word.word}</div>
      <div class="syllable-reveal-breakdown" aria-label="Syllable breakdown">${breakdown}</div>
    </div>
  `;

  setTimeout(() => audio.speakWord(word.word), 500);
}

export function getCurrentWord() { return _currentWord; }

export function cleanup() {
  _currentWord = null;
  _round       = null;
  _clapCount   = 0;
}
