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

  renderWordImage(word, els.wordEmoji, true);
  buildWordAnimation(word, els.wordDisplay);
  els.phonemeRow.innerHTML = '';

  els.modeInstruction.textContent = 'Tap letters that go together to make each sound!';

  const letters = word.word.split('');

  els.modeArea.innerHTML = `
    <div class="segment-word" id="segment-letters" aria-label="Tap letters to group them into sounds"></div>
    <div class="segment-targets" id="segment-targets" aria-label="Sound groups found"></div>
  `;

  const lettersContainer = document.getElementById('segment-letters');
  const targetsContainer = document.getElementById('segment-targets');

  for (let i = 0; i < word.graphemes.length; i++) {
    const slot = document.createElement('div');
    slot.className = 'segment-slot';
    slot.dataset.index = i;
    slot.setAttribute('aria-label', `Sound ${i + 1}`);
    targetsContainer.appendChild(slot);
  }

  letters.forEach((letter, i) => {
    const btn = document.createElement('button');
    btn.className = 'segment-btn';
    btn.textContent = letter;
    btn.dataset.index = i;
    btn.setAttribute('aria-label', `Letter ${letter}`);
    btn.addEventListener('click', () => handleLetterTap(i, letter, btn, word, els));
    lettersContainer.appendChild(btn);
  });

  els.btnCheck.style.display = '';
  els.btnCheck.onclick = () => checkSegmentation(word, els);
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display = '';

  setTimeout(() => audio.speakWord(word.word), 400);
}

function handleLetterTap(index, letter, btn, word, els) {
  if (btn.classList.contains('selected')) {
    btn.classList.remove('selected');
    selectedLetters = selectedLetters.filter(l => l.index !== index);
  } else {
    btn.classList.add('selected');
    selectedLetters.push({ index, letter });
    selectedLetters.sort((a, b) => a.index - b.index);
  }

  // Auto-submit when the selection matches the next expected grapheme.
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
    segmentsFound.push(selectedStr);

    const lettersContainer = document.getElementById('segment-letters');
    selectedLetters.forEach(l => {
      const btns = lettersContainer.querySelectorAll('.segment-btn');
      btns[l.index].classList.remove('selected');
      btns[l.index].classList.add('matched');
      btns[l.index].disabled = true;
    });

    const slots = document.querySelectorAll('.segment-slot');
    const slot = slots[segmentsFound.length - 1];
    if (slot) {
      slot.textContent = selectedStr;
      slot.classList.add('filled');
    }

    const i = segmentsFound.length - 1;
    const prevGrapheme = i > 0 ? word.graphemes[i - 1] : null;
    audio.speakPhoneme(word.graphemes[i], word.types[i], { word: word.word, prevGrapheme });

    selectedLetters = [];

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

  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
  });

  setTimeout(() => audio.speakWord(word.word), 300);
  setTimeout(() => els.onResult(true, responseTime), 1000);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  selectedLetters = [];
  segmentsFound = [];
}
