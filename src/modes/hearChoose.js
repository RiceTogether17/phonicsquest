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
import { createChoiceRound } from './choiceRound.js';

let currentWord = null;
let round = null;

/**
 * Set up Hear & Choose mode for a word.
 * @param {import('../data/words.js').Word} word
 * @param {object} els  DOM element references
 */
export function setupHearChoose(word, els) {
  currentWord = word;

  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  els.modeInstruction.textContent = 'Listen to the word, then pick the right one!';

  const distractors = getDistractors(word, 3, { maxLevel: word.level });
  const choices = shuffleArray([word, ...distractors]);

  els.modeArea.innerHTML = `<div class="choice-grid"></div>`;
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const choice of choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.word;
    btn.dataset.wordId = choice.id;
    btn.dataset.correct = String(choice.id === word.id);
    btn.setAttribute('aria-label', `Choose ${choice.word}`);

    btn.addEventListener('click', () => round?.handleTap(choice.id === word.id, btn));
    grid.appendChild(btn);
  }

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Listen one more time, then pick the word.',
    onRetry: () => { setTimeout(() => audio.speakWord(word.word), 200); },
    onReveal: () => _revealAnswer(word, els),
  });

  els.btnSayIt.style.display = '';
  els.btnCheck.style.display = 'none';
  els.btnSkip.style.display = '';

  setTimeout(() => audio.speakWord(word.word), 400);
}

/** Reveal: image + word animation + phoneme tiles + correct-word audio. */
function _revealAnswer(target, els) {
  renderWordImage(target, els.wordEmoji, true);
  buildWordAnimation(target, els.wordDisplay);
  renderPhonemes(target, els.phonemeRow, { showDiacritics: true });

  setTimeout(() => audio.speakWord(target.word), 500);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  round = null;
}
