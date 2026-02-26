/**
 * Segment It Mode
 *
 * Core loop:
 * 1. Show the word + image
 * 2. Display individual letters as tappable segments
 * 3. Child groups letters into phoneme segments by tapping
 * 4. Check if their segmentation matches the word's graphemes
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';

let currentWord = null;
let selectedLetters = [];
let segmentsFound = [];
let startTime = 0;

/**
 * Set up Segment It mode for a word.
 * @param {import('../data/words.js').Word} word
 * @param {object} els  DOM element references
 */
export function setupSegment(word, els) {
  currentWord = word;
  selectedLetters = [];
  segmentsFound = [];
  startTime = Date.now();

  // Show image + word
  renderWordImage(word, els.wordEmoji, true);
  buildWordAnimation(word, els.wordDisplay);
  els.phonemeRow.innerHTML = '';

  // Instruction
  els.modeInstruction.textContent = 'Tap letters that go together to make each sound!';

  // Split word into individual letters
  const letters = word.word.split('');

  els.modeArea.innerHTML = `
    <div class="segment-word" id="segment-letters" aria-label="Tap letters to group them into sounds"></div>
    <div class="segment-targets" id="segment-targets" aria-label="Sound groups found"></div>
  `;

  const lettersContainer = document.getElementById('segment-letters');
  const targetsContainer = document.getElementById('segment-targets');

  // Create target slots (one per grapheme)
  for (let i = 0; i < word.graphemes.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'segment-slot';
    slot.dataset.index = i;
    slot.setAttribute('aria-label', `Sound ${i + 1}`);
    targetsContainer.appendChild(slot);
  }

  // Create tappable letter buttons
  letters.forEach((letter, i) => {
    const btn = document.createElement('button');
    btn.className = 'segment-btn';
    btn.textContent = letter;
    btn.dataset.index = i;
    btn.setAttribute('aria-label', `Letter ${letter}`);
    btn.addEventListener('click', () => handleLetterTap(i, letter, btn, word, els));
    lettersContainer.appendChild(btn);
  });

  // Show check button
  els.btnCheck.style.display = '';
  els.btnCheck.onclick = () => checkSegmentation(word, els);
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display = '';

  // Play the word
  setTimeout(() => audio.speakWord(word.word), 400);
}

function handleLetterTap(index, letter, btn, word, els) {
  // Toggle selection
  if (btn.classList.contains('selected')) {
    btn.classList.remove('selected');
    selectedLetters = selectedLetters.filter(l => l.index !== index);
  } else {
    btn.classList.add('selected');
    selectedLetters.push({ index, letter });
    selectedLetters.sort((a, b) => a.index - b.index);
  }

  // If selected letters form a valid grapheme, auto-submit
  const selectedStr = selectedLetters.map(l => l.letter).join('');
  const nextGrapheme = word.graphemes[segmentsFound.length];
  if (nextGrapheme && selectedStr === nextGrapheme) {
    confirmSegment(word, els);
  }
}

function confirmSegment(word, els) {
  if (selectedLetters.length === 0) return;

  const selectedStr = selectedLetters.map(l => l.letter).join('');
  const expectedGrapheme = word.graphemes[segmentsFound.length];

  if (selectedStr === expectedGrapheme) {
    // Correct segment!
    segmentsFound.push(selectedStr);

    // Mark letters as matched
    const lettersContainer = document.getElementById('segment-letters');
    selectedLetters.forEach(l => {
      const btns = lettersContainer.querySelectorAll('.segment-btn');
      btns[l.index].classList.remove('selected');
      btns[l.index].classList.add('matched');
      btns[l.index].disabled = true;
    });

    // Fill the target slot
    const slots = document.querySelectorAll('.segment-slot');
    const slot = slots[segmentsFound.length - 1];
    if (slot) {
      slot.textContent = selectedStr;
      slot.classList.add('filled');
    }

    // Play the phoneme sound
    const i = segmentsFound.length - 1;
    audio.speakPhoneme(word.graphemes[i], word.types[i]);

    selectedLetters = [];

    // All segments found?
    if (segmentsFound.length === word.graphemes.length) {
      onAllSegmented(word, els);
    }
  } else {
    // Wrong grouping — shake selected letters
    const lettersContainer = document.getElementById('segment-letters');
    selectedLetters.forEach(l => {
      const btns = lettersContainer.querySelectorAll('.segment-btn');
      btns[l.index].classList.add('wrong');
      btns[l.index].classList.remove('selected');
      setTimeout(() => btns[l.index].classList.remove('wrong'), 500);
    });
    selectedLetters = [];
  }
}

function checkSegmentation(word, els) {
  if (selectedLetters.length > 0) {
    confirmSegment(word, els);
  }
}

function onAllSegmented(word, els) {
  const responseTime = Date.now() - startTime;

  // Show phonemes with full diacritics
  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
  });

  // Play full word
  setTimeout(() => audio.speakWord(word.word), 300);

  // Auto-mark as correct (they completed it!)
  setTimeout(() => {
    els.onResult(true, responseTime);
  }, 1000);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  selectedLetters = [];
  segmentsFound = [];
}
