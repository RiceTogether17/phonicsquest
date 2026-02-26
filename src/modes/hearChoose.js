/**
 * Hear & Choose Mode
 *
 * Core loop:
 * 1. Play the target word audio (no text/image shown initially)
 * 2. Show 4 word choices (1 correct + 3 distractors)
 * 3. Child taps the correct word
 * 4. Correct → celebrate; Wrong → shake + highlight correct
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { getDistractors, shuffleArray } from '../data/words.js';

let currentWord = null;
let answered = false;
let startTime = 0;

/**
 * Set up Hear & Choose mode for a word.
 * @param {import('../data/words.js').Word} word
 * @param {object} els  DOM element references
 */
export function setupHearChoose(word, els) {
  currentWord = word;
  answered = false;
  startTime = Date.now();

  // Hide image initially (reveal after answer)
  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  // Instruction
  els.modeInstruction.textContent = 'Listen to the word, then pick the right one!';

  // Generate 4 choices
  const distractors = getDistractors(word, 3);
  const choices = shuffleArray([word, ...distractors]);

  // Render choice buttons
  els.modeArea.innerHTML = `<div class="choice-grid"></div>`;
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const choice of choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.word;
    btn.dataset.wordId = choice.id;
    btn.setAttribute('aria-label', `Choose ${choice.word}`);

    btn.addEventListener('click', () => handleChoice(choice, btn, word, els, grid));
    grid.appendChild(btn);
  }

  // Show Say It button (re-play audio)
  els.btnSayIt.style.display = '';
  els.btnCheck.style.display = 'none';
  els.btnSkip.style.display = '';

  // Play the word
  setTimeout(() => audio.speakWord(word.word), 400);
}

function handleChoice(chosen, btn, target, els, grid) {
  if (answered) return;
  answered = true;
  const responseTime = Date.now() - startTime;
  const correct = chosen.id === target.id;

  // Disable all buttons
  grid.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.wordId === target.id) {
      b.classList.add('correct');
    }
  });

  if (!correct) {
    btn.classList.add('wrong');
  }

  // Show the word with phonemes + image
  renderWordImage(target, els.wordEmoji, true);
  buildWordAnimation(target, els.wordDisplay);
  renderPhonemes(target, els.phonemeRow, { showDiacritics: true });

  // Play correct word
  setTimeout(() => audio.speakWord(target.word), 500);

  // Report result after a short delay for visual feedback
  setTimeout(() => {
    els.onResult(correct, responseTime);
  }, correct ? 800 : 1500);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  answered = false;
}
