/**
 * Missing Sound Mode
 *
 * Core loop:
 * 1. Show the word with one phoneme replaced by "?"
 * 2. Play the full word audio
 * 3. Show 4 phoneme choices (1 correct + 3 distractors)
 * 4. Child taps the missing sound
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';

let currentWord = null;
let missingIndex = -1;
let answered = false;
let startTime = 0;

/**
 * Set up Missing Sound mode for a word.
 * @param {import('../data/words.js').Word} word
 * @param {object} els  DOM element references
 */
export function setupMissingSound(word, els) {
  currentWord = word;
  answered = false;
  startTime = Date.now();

  // Pick a random phoneme to hide (prefer vowels for educational value)
  const vowelIndices = word.types
    .map((t, i) => (t === 'sv' || t === 'lv') ? i : -1)
    .filter(i => i >= 0);

  if (vowelIndices.length > 0) {
    missingIndex = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
  } else {
    missingIndex = Math.floor(Math.random() * word.graphemes.length);
  }

  // Don't hide silent-e
  if (word.types[missingIndex] === 'se' && word.graphemes.length > 1) {
    missingIndex = 0;
  }

  // Show image
  renderWordImage(word, els.wordEmoji, true);

  // Show word with missing letter in the letter tiles
  const display = els.wordDisplay;
  display.innerHTML = '';
  word.graphemes.forEach((g, i) => {
    const tile = document.createElement('div');
    const typeClass = {c:'consonant',sv:'short-vowel',lv:'long-vowel',d:'digraph',bl:'blend',se:'silent-e',rc:'r-control'}[word.types[i]] || 'consonant';
    tile.className = `letter-tile letter-tile--${typeClass}`;
    tile.textContent = i === missingIndex ? '?' : g;
    if (i === missingIndex) {
      tile.style.background = 'var(--border)';
      tile.style.color = 'var(--text-muted)';
      tile.style.fontSize = 'var(--font-size-3xl)';
    }
    display.appendChild(tile);
  });

  // Show phoneme row with the missing index hidden
  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    hiddenIndices: [missingIndex],
  });

  // Instruction
  els.modeInstruction.textContent = 'Which sound is missing?';

  // Generate choices
  const correctGrapheme = word.graphemes[missingIndex];
  const correctType = word.types[missingIndex];

  // Get distractor graphemes (same type, different value)
  const distractorPool = getPhonemeDistractors(correctGrapheme, correctType);
  const distractors = shuffleArray(distractorPool).slice(0, 3);
  const choices = shuffleArray([
    { grapheme: correctGrapheme, type: correctType, correct: true },
    ...distractors.map(g => ({ grapheme: g, type: correctType, correct: false })),
  ]);

  // Render choice buttons
  els.modeArea.innerHTML = `<div class="choice-grid"></div>`;
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const choice of choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.grapheme;
    btn.dataset.correct = choice.correct;
    btn.setAttribute('aria-label', `Choose ${choice.grapheme}`);
    btn.addEventListener('click', () => handleChoice(choice, btn, word, els, grid));
    grid.appendChild(btn);
  }

  // Buttons
  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display = '';

  // Play the word
  setTimeout(() => audio.speakWord(word.word), 400);
}

function handleChoice(choice, btn, word, els, grid) {
  if (answered) return;
  answered = true;
  const responseTime = Date.now() - startTime;

  // Disable all
  grid.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });

  if (!choice.correct) {
    btn.classList.add('wrong');
  }

  // Reveal the full word
  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
  });

  // Play the missing phoneme then full word
  setTimeout(async () => {
    await audio.speakPhoneme(word.graphemes[missingIndex], word.types[missingIndex]);
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);

  setTimeout(() => {
    els.onResult(choice.correct, responseTime);
  }, choice.correct ? 800 : 1500);
}

/**
 * Get distractor graphemes of the same phoneme type.
 */
function getPhonemeDistractors(correctGrapheme, type) {
  // Collect unique graphemes of the same type from all words
  const graphemes = new Set();

  for (const word of WORDS) {
    for (let i = 0; i < word.graphemes.length; i++) {
      if (word.types[i] === type && word.graphemes[i] !== correctGrapheme) {
        graphemes.add(word.graphemes[i]);
      }
    }
  }

  return Array.from(graphemes);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  missingIndex = -1;
  answered = false;
}
