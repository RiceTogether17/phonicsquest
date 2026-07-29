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
import { renderSoundBoxes, updateSoundBoxes, fillSoundBox } from '../components/soundBoxes.js';
import { renderGiriWordCard, setGiriPose } from '../components/giriWordCard.js';

let currentWord = null;
let selectedLetters = [];
let segmentsFound = [];
let wrongGroupings = 0;
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
  wrongGroupings = 0;
  startTime = Date.now();

  // The picture now lives inside the Giri card below, so the shared word
  // image is hidden to avoid showing the same emoji twice.
  renderWordImage(word, els.wordEmoji, false);
  buildWordAnimation(word, els.wordDisplay);
  els.phonemeRow.innerHTML = '';

  els.modeInstruction.textContent = 'Tap letters that go together to make each sound!';

  const letters = word.word.split('');

  els.modeArea.innerHTML = `
    <div id="segment-giri-card"></div>
    <div class="segment-word" id="segment-letters" aria-label="Tap letters to group them into sounds"></div>
    <div id="segment-sound-boxes"></div>
  `;

  const lettersContainer = document.getElementById('segment-letters');

  // Giri presents the word while the child works on it.
  renderGiriWordCard(word, document.getElementById('segment-giri-card'), {
    pose: 'think',
    caption: 'How many sounds can you hear?',
  });

  // Elkonin sound boxes: one per phoneme, filled as each sound is isolated.
  // This is the scaffold this mode's own comments have described since it
  // was written; the boxes replace the unstyled slots that stood in for it.
  renderSoundBoxes(word, document.getElementById('segment-sound-boxes'), {
    activeIndex: 0,
  });

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

  // Segmenting asks the child to mark where the sounds break. So we
  // play the word twice: first at natural rate (recognise the word),
  // then stretched (hear every phoneme as a separable beat). This
  // double-pass is the gold-standard structured-literacy model for
  // segmenting practice. The stretched-speech setting is treated as
  // forced-on inside this mode — it directly serves the task.
  setTimeout(async () => {
    await audio.speakWord(word.word);
    await new Promise(r => setTimeout(r, 350));
    await audio.speakWordStretched(word);
  }, 400);
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

    // Fill the sound box for the phoneme just isolated and advance the
    // active marker to the next empty box.
    const boxHost = document.getElementById('segment-sound-boxes');
    const filledIdx = segmentsFound.length - 1;
    fillSoundBox(boxHost, filledIdx, selectedStr);
    updateSoundBoxes(boxHost, {
      filledIndices: segmentsFound.map((_, n) => n),
      activeIndex: segmentsFound.length < word.graphemes.length ? segmentsFound.length : null,
    });

    const i = segmentsFound.length - 1;
    const prevGrapheme = i > 0 ? word.graphemes[i - 1] : null;
    audio.speakPhoneme(word.graphemes[i], word.types[i], { word: word.word, prevGrapheme });

    selectedLetters = [];

    if (segmentsFound.length === word.graphemes.length) {
      onAllSegmented(word, els);
    }
  } else {
    // Wrong grouping — shake selected letters. Counted so the round can
    // report real correctness: a fumbled word must not promote its SR box.
    wrongGroupings++;
    const lettersContainer = document.getElementById('segment-letters');
    selectedLetters.forEach(l => {
      const btns = lettersContainer.querySelectorAll('.segment-btn');
      btns[l.index].classList.add('wrong');
      btns[l.index].classList.remove('selected');
      setTimeout(() => btns[l.index].classList.remove('wrong'), 500);
    });
    selectedLetters = [];

    // Flag the box being worked on as "try again", never wrong, and have
    // Giri switch to the encouraging pose — mistakes are safe here.
    const boxHost = document.getElementById('segment-sound-boxes');
    const active = segmentsFound.length;
    updateSoundBoxes(boxHost, {
      filledIndices: segmentsFound.map((_, n) => n),
      retryIndices: [active],
    });
    setGiriPose(document.getElementById('segment-giri-card'), 'encourage');
    setTimeout(() => {
      updateSoundBoxes(boxHost, {
        filledIndices: segmentsFound.map((_, n) => n),
        activeIndex: active,
      });
      setGiriPose(document.getElementById('segment-giri-card'), 'think');
    }, 900);
  }
}

function checkSegmentation(word, els) {
  if (selectedLetters.length > 0) {
    confirmSegment(word, els);
  }
}

function onAllSegmented(word, els) {
  const responseTime = Date.now() - startTime;

  // Every box confirmed, and Giri celebrates the finished word.
  updateSoundBoxes(document.getElementById('segment-sound-boxes'), {
    filledIndices: word.graphemes.map((_, n) => n),
    correctIndices: word.graphemes.map((_, n) => n),
  });
  setGiriPose(document.getElementById('segment-giri-card'), 'celebrate');

  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
  });

  setTimeout(() => audio.speakWord(word.word), 300);
  // The child always finishes the word (the scaffold only accepts correct
  // groupings), so correctness = did they get there without a wrong grouping.
  setTimeout(() => els.onResult(wrongGroupings === 0, responseTime), 1000);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  selectedLetters = [];
  segmentsFound = [];
  wrongGroupings = 0;
}
