/**
 * Oral Blend Mode  (Pure Phonemic Awareness — Auditory Blending)
 *
 * Core loop:
 * 1. Play phonemes one-by-one with pauses:  /k/ … /a/ … /t/
 * 2. Show 4 emoji-only choices (NO word text during the question)
 * 3. Child identifies the blended word by its picture
 * 4. Reveal word text + phoneme tiles + full word audio
 *
 * This is pure phonemic awareness: no print is shown during the question
 * phase, so the child must blend sounds mentally rather than match letters.
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { getDistractors, shuffleArray } from '../data/words.js';
import { createChoiceRound } from './choiceRound.js';

let currentWord = null;
let round = null;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupOralBlend(word, els) {
  currentWord = word;

  // No image, no word text during question — pure auditory task
  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  els.modeInstruction.textContent = 'Listen to the sounds… which word is it?';

  const distractors = getDistractors(word, 3, { maxLevel: word.level });
  const choices = shuffleArray([word, ...distractors]);

  // Render choice buttons: large emoji + word label (hidden until reveal)
  els.modeArea.innerHTML = '<div class="choice-grid choice-grid--emoji"></div>';
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const choice of choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn choice-btn--emoji';
    btn.dataset.wordId = choice.id;
    btn.dataset.correct = String(choice.id === word.id);
    btn.setAttribute('aria-label', `Choose ${choice.word}`);

    const emojiEl = document.createElement('span');
    emojiEl.className = 'choice-btn-emoji';
    emojiEl.textContent = choice.emoji;
    emojiEl.setAttribute('aria-hidden', 'true');

    const labelEl = document.createElement('span');
    labelEl.className = 'choice-btn-word choice-btn-word--hidden';
    labelEl.textContent = choice.word;

    btn.appendChild(emojiEl);
    btn.appendChild(labelEl);
    btn.addEventListener('click', () => round?.handleTap(choice.id === word.id, btn));
    grid.appendChild(btn);
  }

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Blend the sounds together in your head.',
    onRetry: () => {
      setTimeout(() => _playPhonemes(word), 200);
    },
    onReveal: () => _revealAnswer(word, els, grid),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display = '';

  // Play each phoneme with a clear pause between them
  setTimeout(() => _playPhonemes(word), 600);
}

/** Speak each grapheme in sequence with a pause between. */
async function _playPhonemes(word) {
  for (let i = 0; i < word.graphemes.length; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 300));
    const prevGrapheme = i > 0 ? word.graphemes[i - 1] : null;
    await audio.speakPhoneme(word.graphemes[i], word.types[i], { word: word.word, prevGrapheme });
  }
}

/** Reveal: word labels on choices + image + word text + phoneme tiles + audio. */
function _revealAnswer(word, els, grid) {
  grid
    .querySelectorAll('.choice-btn-word')
    .forEach((l) => l.classList.remove('choice-btn-word--hidden'));

  renderWordImage(word, els.wordEmoji, true);
  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, showLabels: true });

  setTimeout(() => audio.speakWord(word.word), 400);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  round = null;
}
