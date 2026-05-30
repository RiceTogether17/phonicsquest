/**
 * Clap the Syllables Mode  (Phonemic Awareness — Syllable Counting)
 *
 * Inspired by "Let's All Clap" from Foundations phonics: hear a word,
 * clap once per syllable (don-key = 2 claps), then pick the count.
 * Distinct from Sound Count, which counts *phonemes*. Syllables are
 * the wider beat — a CVC word has 3 phonemes but 1 syllable.
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

let _currentWord = null;
let _answered    = false;
let _startTime   = 0;
let _clapCount   = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupSyllableClap(word, els) {
  _currentWord = word;
  _answered    = false;
  _startTime   = Date.now();
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
    audio.playSfx('pop');
  });

  const grid = els.modeArea.querySelector('#syllable-grid');
  // Choice range scales with curriculum level so younger children see
  // a smaller, less daunting set.
  const maxChoice = (word.level ?? 1) >= 4 ? 5 : 4;
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
    btn.addEventListener('click', () => _handleChoice(n, btn, word, els, grid));
    grid.appendChild(btn);
  }

  if (els.btnCheck) els.btnCheck.style.display = 'none';
  if (els.btnSayIt) els.btnSayIt.style.display = '';
  if (els.btnSkip)  els.btnSkip.style.display  = '';

  setTimeout(() => audio.speakWord(word.word), 400);
}

function _handleChoice(value, btn, word, els, grid) {
  if (_answered) return;
  _answered = true;
  const responseTime = Date.now() - _startTime;
  const correctCount = getSyllableCount(word);
  const correct      = value === correctCount;

  grid.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  if (!correct) btn.classList.add('wrong');

  // Reveal: printed word + syllable breakdown so the child sees the
  // beats they just heard.
  const breakdown = getSyllableBreakdown(word);
  els.wordDisplay.innerHTML = `
    <div class="syllable-reveal">
      <div class="syllable-reveal-word">${word.word}</div>
      <div class="syllable-reveal-breakdown" aria-label="Syllable breakdown">${breakdown}</div>
    </div>
  `;

  // Re-play the word slowly so child hears each beat one more time.
  setTimeout(() => audio.speakWord(word.word), 500);

  const wrap = document.createElement('div');
  wrap.className = 'vmcq-next-wrap';
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className   = 'btn btn--primary vmcq-next-btn';
  nextBtn.textContent = 'Next →';
  nextBtn.setAttribute('aria-label', 'Next word');
  wrap.appendChild(nextBtn);
  els.modeArea.appendChild(wrap);
  nextBtn.addEventListener('click', () => els.onResult(correct, responseTime));
  nextBtn.focus();
}

export function getCurrentWord() { return _currentWord; }

export function cleanup() {
  _currentWord = null;
  _answered    = false;
  _clapCount   = 0;
}
