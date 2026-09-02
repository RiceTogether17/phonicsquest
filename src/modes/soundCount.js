/**
 * Sound Count Mode  (Phonemic Awareness — Phoneme Segmenting)
 *
 * Core loop:
 * 1. Show word image only — NOT the printed word (sound-counting is an oral
 *    task; if the child can see the letters they'll count those instead)
 * 2. Play the word
 * 3. "How many sounds?" — 4 number choices
 * 4. Child picks the phoneme count
 * 5. Reveal printed word + phoneme tiles animated one-by-one to reinforce
 *    the count
 *
 * Teaches children to attend to the number of distinct phonemes in a word,
 * a foundational segmenting skill before sound-box spelling.
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { createChoiceRound } from './choiceRound.js';

let currentWord = null;
let round = null;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupSoundCount(word, els) {
  currentWord = word;

  // Image yes, printed word NO — see the module-level comment on why.
  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  els.modeInstruction.textContent = 'How many sounds do you hear?';

  const correctCount = word.phonemes.length;
  const choices = _getCountChoices(correctCount);

  els.modeArea.innerHTML = '<div class="choice-grid choice-grid--count"></div>';
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const count of choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn choice-btn--count';
    btn.dataset.correct = String(count === correctCount);
    btn.setAttribute('aria-label', `${count} sound${count !== 1 ? 's' : ''}`);

    const numEl = document.createElement('span');
    numEl.className = 'count-number';
    numEl.textContent = count;

    const dotsEl = document.createElement('span');
    dotsEl.className = 'count-dots';
    dotsEl.textContent = '●'.repeat(count);

    btn.appendChild(numEl);
    btn.appendChild(dotsEl);
    btn.addEventListener('click', () => round?.handleTap(count === correctCount, btn));
    grid.appendChild(btn);
  }

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Count on your fingers as you hear each sound.',
    onRetry: () => {
      setTimeout(() => {
        if (store.get('stretchedSpeech')) audio.speakWordStretched(word);
        else audio.speakWord(word.word);
      }, 200);
    },
    onReveal: () => _revealAnswer(word, els),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display = '';

  setTimeout(() => {
    if (store.get('stretchedSpeech')) audio.speakWordStretched(word);
    else audio.speakWord(word.word);
  }, 400);
}

/**
 * Generate 4 number choices: the correct count plus 3 nearby distractors.
 * Keeps counts between 1 and 8 to stay realistic. Walks outward from the
 * correct answer so edge cases (correct = 1 or 7) still yield a full set
 * of 4 — a 3-option grid makes the question easier to guess.
 */
export function _getCountChoices(correct) {
  const set = new Set([correct]);
  for (let offset = 1; set.size < 4 && offset <= 8; offset++) {
    const below = correct - offset;
    const above = correct + offset;
    if (below >= 1) set.add(below);
    if (set.size < 4 && above <= 8) set.add(above);
  }
  return [...set].sort(() => Math.random() - 0.5);
}

/** Reveal printed word + phoneme tiles, then play the phonemes in sequence. */
function _revealAnswer(word, els) {
  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, showLabels: true });

  setTimeout(async () => {
    await audio.revealPhonemes(word);
  }, 500);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  round = null;
}
