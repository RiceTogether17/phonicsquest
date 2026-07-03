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
import { store } from '../modules/store.js';
import { WORDS, shuffleArray } from '../data/words.js';
import { createChoiceRound } from './choiceRound.js';

let currentWord = null;
let missingIndex = -1;
let round = null;

/**
 * Set up Missing Sound mode for a word.
 * @param {import('../data/words.js').Word} word
 * @param {object} els  DOM element references
 */
export function setupMissingSound(word, els) {
  currentWord = word;

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

  // Get distractor graphemes (same type, different value) — bounded by the
  // target word's level so beginners never see graphemes that only appear in
  // higher-level words (e.g. r-controlled or diphthong vowels at level 1).
  const distractorPool = getPhonemeDistractors(correctGrapheme, correctType, word.level);
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
    btn.addEventListener('click', () => round?.handleTap(choice.correct, btn));
    grid.appendChild(btn);
  }

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Say the word — which sound fills the gap?',
    onRetry: () => {
      setTimeout(() => {
        if (store.get('stretchedSpeech')) audio.speakWordStretched(word);
        else audio.speakWord(word.word);
      }, 200);
    },
    onReveal: () => _revealAnswer(word, els),
  });

  // Buttons
  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display = '';

  // Play the word
  setTimeout(() => {
    if (store.get('stretchedSpeech')) audio.speakWordStretched(word);
    else audio.speakWord(word.word);
  }, 400);
}

/** Reveal the full word + play the missing phoneme, then the word. */
function _revealAnswer(word, els) {
  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
  });

  setTimeout(async () => {
    const prevGrapheme = missingIndex > 0 ? word.graphemes[missingIndex - 1] : null;
    await audio.speakPhoneme(word.graphemes[missingIndex], word.types[missingIndex], { word: word.word, prevGrapheme });
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);
}

/**
 * Static per-type fallback graphemes so a question can never render with
 * fewer than 3 distractors (a 1-2 option "MCQ" is un-failable and useless
 * as assessment). Only used when the word list can't supply enough.
 */
const FALLBACK_DISTRACTORS = {
  sv: ['a', 'e', 'i', 'o', 'u'],
  lv: ['ee', 'igh', 'oa', 'ai', 'oo'],
  c:  ['s', 't', 'm', 'p', 'n', 'd'],
  d:  ['sh', 'ch', 'th', 'ng', 'ck'],
  bl: ['st', 'bl', 'tr', 'gr', 'fl'],
  rc: ['ar', 'or', 'er', 'ir', 'ur'],
  dp: ['oi', 'ow', 'ou', 'oy', 'aw'],
};

/**
 * Get distractor graphemes of the same phoneme type, bounded to graphemes
 * that actually appear in words at or below `maxLevel`. Falls back to the
 * full word list, then to a static per-type pool, so the result always has
 * at least 3 entries.
 */
export function getPhonemeDistractors(correctGrapheme, type, maxLevel = 3) {
  const collect = (pool) => {
    const graphemes = new Set();
    for (const word of pool) {
      for (let i = 0; i < word.graphemes.length; i++) {
        if (word.types[i] === type && word.graphemes[i] !== correctGrapheme) {
          graphemes.add(word.graphemes[i]);
        }
      }
    }
    return graphemes;
  };

  const result = collect(WORDS.filter(w => w.level <= maxLevel));
  if (result.size < 3) {
    for (const g of collect(WORDS)) result.add(g);
  }
  if (result.size < 3) {
    const fallback = FALLBACK_DISTRACTORS[type] ?? FALLBACK_DISTRACTORS.c;
    for (const g of fallback) {
      if (g !== correctGrapheme) result.add(g);
      if (result.size >= 3) break;
    }
  }
  return Array.from(result);
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  missingIndex = -1;
  round = null;
}
