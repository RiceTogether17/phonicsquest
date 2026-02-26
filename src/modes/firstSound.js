/**
 * First Sound Mode
 *
 * Core loop:
 * 1. Show the word image/emoji (but NOT the word text)
 * 2. Play the word audio
 * 3. Show 4 phoneme choices for the FIRST sound
 * 4. Child identifies the initial phoneme
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';

let currentWord = null;
let answered = false;
let startTime = 0;

/**
 * Set up First Sound mode for a word.
 * @param {import('../data/words.js').Word} word
 * @param {object} els  DOM element references
 */
export function setupFirstSound(word, els) {
  currentWord = word;
  answered = false;
  startTime = Date.now();

  // Show image but NOT the word text (child must identify first sound)
  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  // Instruction
  els.modeInstruction.textContent = 'What sound does this word start with?';

  // The first grapheme / phoneme
  const firstGrapheme = word.graphemes[0];
  const firstType     = word.types[0];

  // Get distractors (different first sounds)
  const distractorGraphemes = getFirstSoundDistractors(firstGrapheme, firstType);
  const distractors = shuffleArray(distractorGraphemes).slice(0, 3);

  const choices = shuffleArray([
    { grapheme: firstGrapheme, type: firstType, correct: true },
    ...distractors.map(g => ({ grapheme: g.grapheme, type: g.type, correct: false })),
  ]);

  // Render choice buttons with phoneme styling
  els.modeArea.innerHTML = `<div class="choice-grid"></div>`;
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const choice of choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.grapheme.toUpperCase();
    btn.dataset.correct = choice.correct;
    btn.setAttribute('aria-label', `Choose ${choice.grapheme}`);

    // Play phoneme on hover/focus for accessibility
    btn.addEventListener('mouseenter', () => {
      audio.speakPhoneme(choice.grapheme, choice.type);
    });

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

  // Play first phoneme then full word
  setTimeout(async () => {
    await audio.speakPhoneme(word.graphemes[0], word.types[0]);
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);

  setTimeout(() => {
    els.onResult(choice.correct, responseTime);
  }, choice.correct ? 800 : 1500);
}

/**
 * Get distractor first-sounds from other words.
 */
function getFirstSoundDistractors(correctGrapheme, correctType) {
  const seen = new Set([correctGrapheme]);
  const distractors = [];

  for (const word of shuffleArray(WORDS)) {
    const g = word.graphemes[0];
    const t = word.types[0];
    if (!seen.has(g)) {
      seen.add(g);
      distractors.push({ grapheme: g, type: t });
      if (distractors.length >= 6) break;
    }
  }

  return distractors;
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  answered = false;
}
