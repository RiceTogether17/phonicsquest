/**
 * Last Sound Mode  (Phonemic Awareness — Final Phoneme)
 *
 * Core loop:
 * 1. Show word image + play the word
 * 2. Show 4 phoneme choices for the LAST sound
 * 3. Child identifies the final phoneme
 * 4. Reveal full word + play final phoneme, then blend
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';

let currentWord = null;
let answered    = false;
let startTime   = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupLastSound(word, els) {
  currentWord = word;
  answered    = false;
  startTime   = Date.now();

  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';

  els.modeInstruction.textContent = 'What sound does this word end with?';

  const lastIdx      = word.graphemes.length - 1;
  const lastGrapheme = word.graphemes[lastIdx];
  const lastType     = word.types[lastIdx];

  const distractors = _getDistractors(lastGrapheme, 'last');
  const choices = shuffleArray([
    { grapheme: lastGrapheme, type: lastType, correct: true },
    ...distractors.slice(0, 3).map(g => ({ ...g, correct: false })),
  ]);

  els.modeArea.innerHTML = '<div class="choice-grid"></div>';
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const choice of choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.grapheme.toUpperCase();
    btn.dataset.correct = choice.correct;
    btn.setAttribute('aria-label', `Choose ${choice.grapheme}`);
    btn.addEventListener('mouseenter', () => audio.speakPhoneme(choice.grapheme, choice.type));
    btn.addEventListener('click', () => _handleChoice(choice, btn, word, els, grid, lastIdx));
    grid.appendChild(btn);
  }

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display  = '';

  setTimeout(() => audio.speakWord(word.word), 400);
}

function _handleChoice(choice, btn, word, els, grid, lastIdx) {
  if (answered) return;
  answered = true;
  const responseTime = Date.now() - startTime;

  grid.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  if (!choice.correct) btn.classList.add('wrong');

  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, showLabels: true });

  setTimeout(async () => {
    await audio.speakPhoneme(word.graphemes[lastIdx], word.types[lastIdx]);
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);

  setTimeout(() => {
    els.onResult(choice.correct, responseTime);
  }, choice.correct ? 800 : 1500);
}

function _getDistractors(correctGrapheme, position) {
  const seen = new Set([correctGrapheme]);
  const distractors = [];

  for (const word of shuffleArray(WORDS)) {
    const idx = position === 'last' ? word.graphemes.length - 1 : 0;
    const g = word.graphemes[idx];
    const t = word.types[idx];
    if (!seen.has(g)) {
      seen.add(g);
      distractors.push({ grapheme: g, type: t });
      if (distractors.length >= 6) break;
    }
  }
  return distractors;
}

export function getCurrentWord() { return currentWord; }

export function cleanup() {
  currentWord = null;
  answered    = false;
}
