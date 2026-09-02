/**
 * Sound Hunt Mode  (Phonics — Sound-to-Letter Recognition)
 *
 * Digital adaptation of the Foundations "Sound/Letter Recognition"
 * grapheme-chart activity: the teacher says "The sound is /r/" and the
 * child places a counter on the letter that makes it. Here the app
 * plays the target phoneme and the child taps the matching letter card.
 *
 * Core loop:
 * 1. Play the target phoneme (the first sound of the sequenced word) —
 *    no picture, no printed word, nothing that gives the answer away
 * 2. Show 4 LETTER cards (bare graphemes — this is the print side of the
 *    bridge, the opposite direction of First Sound's /phoneme/ buttons)
 * 3. Child taps the letter that makes the sound
 * 4. Reveal an example word that starts with the letter + play it
 *
 * Runs on the same alphabetical target ladder as First Sound / Train
 * Carriages (via paTargetSequencer), so the child meets every
 * letter-sound correspondence systematically — exactly the "help
 * children remember letter sounds" drill from the classroom material.
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { createChoiceRound } from './choiceRound.js';
import { audio } from '../modules/audio.js';
import { shuffleArray } from '../data/words.js';
import { getFirstSoundDistractors } from './firstSound.js';

let currentWord = null;
let round = null;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupSoundHunt(word, els) {
  currentWord = word;

  const targetGrapheme = word.graphemes[0];
  const targetType = word.types[0];

  // No emoji, no printed word — either would leak the answer before the
  // child has done the sound-to-letter mapping themselves. Hide the image
  // frame too so the stage doesn't show an empty box.
  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  els.modeInstruction.textContent = 'Listen… which letter makes that sound?';

  const distractors = shuffleArray(
    getFirstSoundDistractors(targetGrapheme, targetType, word.level ?? 3),
  ).slice(0, 3);

  const choices = shuffleArray([
    { grapheme: targetGrapheme, type: targetType, correct: true },
    ...distractors.map((d) => ({ grapheme: d.grapheme, type: d.type, correct: false })),
  ]);

  els.modeArea.innerHTML = /* html */ `
    <div class="sound-hunt">
      <button class="sound-hunt-replay btn btn--ghost btn--sm" type="button">
        🔊 Hear the sound again
      </button>
      <div class="choice-grid choice-grid--letter" role="group" aria-label="Pick the letter that makes the sound"></div>
    </div>
  `;

  const grid = els.modeArea.querySelector('.choice-grid');
  for (const choice of choices) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn choice-btn--letter';
    btn.dataset.correct = String(choice.correct);
    btn.setAttribute('aria-label', `Letter ${choice.grapheme}`);
    btn.innerHTML = `<span class="choice-btn-letter">${choice.grapheme}</span>`;
    btn.addEventListener('click', () => round?.handleTap(choice.correct, btn));
    grid.appendChild(btn);
  }

  const playTarget = () => audio.speakPhoneme(targetGrapheme, targetType);
  els.modeArea.querySelector('.sound-hunt-replay')?.addEventListener('click', playTarget);

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Say the sound out loud, then look at each letter.',
    onRetry: () => {
      setTimeout(playTarget, 200);
    },
    onReveal: () => _revealAnswer(word, els),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = 'none'; // "Say it" would speak the answer word
  els.btnSkip.style.display = '';

  // Short pause so the phoneme doesn't collide with screen-transition audio.
  setTimeout(playTarget, 400);
}

/** Reveal an example word that starts with the target letter. */
function _revealAnswer(word, els) {
  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, showLabels: true });

  setTimeout(async () => {
    await audio.speakPhoneme(word.graphemes[0], word.types[0]);
    await new Promise((r) => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  round = null;
}
