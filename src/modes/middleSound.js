/**
 * Middle Sound Mode  (Phonemic Awareness — Medial Vowel)
 *
 * Core loop:
 * 1. Show word image + play the word
 * 2. Show 4 vowel choices for the MIDDLE sound
 * 3. Child identifies the vowel phoneme
 * 4. Reveal full word + highlight middle phoneme, then blend
 *
 * Works best with CVC / CCVC / CVCC patterns.
 * At level 1 the distractor pool is restricted to short vowels only, so
 * beginners compare the five short vowels rather than a mixed vowel set.
 * Falls back to Math.floor(length/2) index if no interior vowel found.
 *
 * Distractor strategy: prefer short-vowel confusion pairs (e.g. /a/ vs /u/,
 * /e/ vs /i/) which are the most commonly confused medial vowels.
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';

const VOWEL_TYPES       = new Set(['sv', 'lv', 'rc', 'dp']);
const SHORT_VOWEL_TYPES = new Set(['sv']);

/**
 * Short-vowel confusion pairs — the most commonly mixed-up medial vowels.
 * Keyed by grapheme (for short vowels only).
 */
const VOWEL_CONFUSION_MAP = {
  a: ['u', 'o', 'e'],
  e: ['i', 'a'],
  i: ['e', 'a'],
  o: ['u', 'a'],
  u: ['a', 'o'],
};

let currentWord = null;
let answered    = false;
let startTime   = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupMiddleSound(word, els) {
  currentWord = word;
  answered    = false;
  startTime   = Date.now();

  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';

  els.modeInstruction.textContent = 'Stretch the word… what sound is in the MIDDLE?';

  const midIdx     = _getMiddleVowelIdx(word);
  const midGrapheme = word.graphemes[midIdx];
  const midType    = word.types[midIdx];

  const distractors = _getVowelDistractors(midGrapheme, word.level, midType);
  const choices = shuffleArray([
    { grapheme: midGrapheme, type: midType, correct: true },
    ...distractors.slice(0, 3).map(g => ({ ...g, correct: false })),
  ]);

  els.modeArea.innerHTML = '<div class="choice-grid"></div>';
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const choice of choices) {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice.grapheme.toUpperCase();
    btn.dataset.correct = choice.correct;
    btn.setAttribute('aria-label', `Choose ${choice.grapheme}`);
    btn.addEventListener('mouseenter', () => audio.speakPhoneme(choice.grapheme, choice.type));
    btn.addEventListener('click', () => _handleChoice(choice, btn, word, els, grid, midIdx));
    grid.appendChild(btn);
  }

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display  = '';

  setTimeout(() => audio.speakWord(word.word), 400);
}

function _handleChoice(choice, btn, word, els, grid, midIdx) {
  if (answered) return;
  answered = true;
  const responseTime = Date.now() - startTime;

  grid.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  if (!choice.correct) btn.classList.add('wrong');

  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, showLabels: true });

  setTimeout(async () => {
    await audio.speakPhoneme(word.graphemes[midIdx], word.types[midIdx]);
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);

  setTimeout(() => {
    els.onResult(choice.correct, responseTime);
  }, choice.correct ? 800 : 1500);
}

/** Find the index of the middle/medial vowel phoneme. */
function _getMiddleVowelIdx(word) {
  // Look for an interior vowel (not first, not last if more than 2 phonemes)
  const minI = word.graphemes.length > 2 ? 1 : 0;
  const maxI = word.graphemes.length > 2 ? word.graphemes.length - 2 : word.graphemes.length - 1;
  for (let i = minI; i <= maxI; i++) {
    if (VOWEL_TYPES.has(word.types[i])) return i;
  }
  // Fallback: absolute middle index
  return Math.floor(word.graphemes.length / 2);
}

/**
 * Build vowel distractor pool.
 *
 * At level 1 only short vowels are used — beginners should compare the
 * five short vowels before being exposed to long vowels and complex patterns.
 *
 * Priority:
 *   1. Short-vowel confusion pairs from VOWEL_CONFUSION_MAP.
 *   2. Other vowels of the same type from the word list.
 *   3. Any vowel (fallback).
 */
function _getVowelDistractors(correctGrapheme, maxLevel = 3, targetType = null) {
  const seen        = new Set([correctGrapheme]);
  const distractors = [];

  // At level 1 restrict to short vowels so beginners compare a/e/i/o/u only
  const allowedVowelTypes = maxLevel <= 1 ? SHORT_VOWEL_TYPES : VOWEL_TYPES;

  // Tier 1: confusion-pair vowels
  const confusionTargets = VOWEL_CONFUSION_MAP[correctGrapheme.toLowerCase()] ?? [];
  for (const cg of confusionTargets) {
    if (seen.has(cg)) continue;
    // Only include if this vowel type is allowed at this level
    const match = WORDS.find(w => w.graphemes.includes(cg) && allowedVowelTypes.has(w.types[w.graphemes.indexOf(cg)]));
    const type  = match ? match.types[match.graphemes.indexOf(cg)] : 'sv';
    if (!allowedVowelTypes.has(type)) continue;
    seen.add(cg);
    distractors.push({ grapheme: cg, type });
    if (distractors.length >= 3) break;
  }

  // Tier 2: same allowed vowel type from word list
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter(w => w.level <= maxLevel))) {
      for (let i = 0; i < word.graphemes.length; i++) {
        const g = word.graphemes[i];
        const t = word.types[i];
        if (!seen.has(g) && allowedVowelTypes.has(t) && (!targetType || t === targetType)) {
          seen.add(g);
          distractors.push({ grapheme: g, type: t });
          if (distractors.length >= 6) break;
        }
      }
      if (distractors.length >= 6) break;
    }
  }

  // Tier 3: any vowel (fallback)
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter(w => w.level <= maxLevel))) {
      for (let i = 0; i < word.graphemes.length; i++) {
        const g = word.graphemes[i];
        const t = word.types[i];
        if (!seen.has(g) && VOWEL_TYPES.has(t)) {
          seen.add(g);
          distractors.push({ grapheme: g, type: t });
          if (distractors.length >= 6) break;
        }
      }
      if (distractors.length >= 6) break;
    }
  }

  return distractors;
}

export function getCurrentWord() { return currentWord; }

export function cleanup() {
  currentWord = null;
  answered    = false;
}
