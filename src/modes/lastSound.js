/**
 * Last Sound Mode  (Phonemic Awareness — Final Phoneme)
 *
 * Core loop:
 * 1. Show word image + play the word
 * 2. Show 4 phoneme choices for the LAST sound
 * 3. Child identifies the final phoneme
 * 4. Reveal full word + play final phoneme, then blend
 *
 * Distractor strategy: prefer phonemes that children commonly confuse with
 * the target before falling back to same-type or any-type phonemes.
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';

/**
 * Common phoneme confusion pairs — especially relevant for final consonants
 * where voicing is harder to discriminate (e.g. /d/ vs /t/ at word end).
 */
const CONFUSION_MAP = {
  // Final stop pairs (voicing)
  b:  ['p', 'd'],
  p:  ['b', 't'],
  d:  ['t', 'b'],
  t:  ['d', 'k'],
  k:  ['g', 't', 'ck'],
  g:  ['k', 'd'],
  ck: ['k', 't'],
  // Fricatives / affricates
  f:  ['v', 'th'],
  v:  ['f', 'b'],
  th: ['f', 's'],
  s:  ['z', 'sh', 'se'],
  z:  ['s'],
  sh: ['s', 'ch'],
  ch: ['sh', 'j'],
  j:  ['ch', 'g'],
  // Nasals
  m:  ['n', 'ng'],
  n:  ['m', 'ng'],
  ng: ['n', 'm'],
  // Liquids / glides
  r:  ['l'],
  l:  ['r', 'll'],
  ll: ['l', 'r'],
};

let currentWord = null;
let answered    = false;
let startTime   = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupLastSound(word, els) {
  currentWord = word;
  answered    = false;
  startTime   = Date.now();

  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';

  els.modeInstruction.textContent = 'Listen to the end of the word… what\'s the LAST sound?';

  const lastIdx      = word.graphemes.length - 1;
  const lastGrapheme = word.graphemes[lastIdx];
  const lastType     = word.types[lastIdx];

  const distractors = _getDistractors(lastGrapheme, 'last', word.level, lastType);
  const choices = shuffleArray([
    { grapheme: lastGrapheme, type: lastType, correct: true },
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
    btn.addEventListener('click', () => _handleChoice(choice, btn, word, els, grid, lastIdx));
    grid.appendChild(btn);
  }

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display  = '';

  setTimeout(() => audio.speakWord(word.word), 400);
}

function _handleChoice(choice, btn, word, els, grid, lastIdx) {
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
    const prevGrapheme = lastIdx > 0 ? word.graphemes[lastIdx - 1] : null;
    await audio.speakPhoneme(word.graphemes[lastIdx], word.types[lastIdx], { word: word.word, prevGrapheme });
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);

  setTimeout(() => {
    els.onResult(choice.correct, responseTime);
  }, choice.correct ? 800 : 1500);
}

/**
 * Build distractor pool for the last-sound position.
 *
 * Priority:
 *   1. Confusion-pair phonemes most likely to trip up the child.
 *   2. Same-type phonemes from words at this level.
 *   3. Any final phoneme (fallback).
 */
function _getDistractors(correctGrapheme, position, maxLevel = 3, targetType = null) {
  const seen        = new Set([correctGrapheme]);
  const distractors = [];

  // Tier 1: confusion-pair phonemes
  const confusionTargets = CONFUSION_MAP[correctGrapheme.toLowerCase()] ?? [];
  for (const cg of confusionTargets) {
    if (seen.has(cg)) continue;
    const levelWords = WORDS.filter(w => w.level <= maxLevel);
    const lastIdx    = position === 'last' ? -1 : 0;
    const match      = levelWords.find(w => {
      const idx = lastIdx === -1 ? w.graphemes.length - 1 : 0;
      return w.graphemes[idx] === cg;
    });
    const type = match
      ? match.types[lastIdx === -1 ? match.graphemes.length - 1 : 0]
      : (targetType ?? 'c');
    seen.add(cg);
    distractors.push({ grapheme: cg, type });
    if (distractors.length >= 3) break;
  }

  // Tier 2: same-type phonemes from word list
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter(w => w.level <= maxLevel))) {
      const idx = position === 'last' ? word.graphemes.length - 1 : 0;
      const g = word.graphemes[idx];
      const t = word.types[idx];
      if (!seen.has(g) && (!targetType || t === targetType)) {
        seen.add(g);
        distractors.push({ grapheme: g, type: t });
        if (distractors.length >= 6) break;
      }
    }
  }

  // Tier 3: any final phoneme (fallback)
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter(w => w.level <= maxLevel))) {
      const idx = position === 'last' ? word.graphemes.length - 1 : 0;
      const g = word.graphemes[idx];
      const t = word.types[idx];
      if (!seen.has(g)) {
        seen.add(g);
        distractors.push({ grapheme: g, type: t });
        if (distractors.length >= 6) break;
      }
    }
  }

  return distractors;
}

export function getCurrentWord() { return currentWord; }

export function cleanup() {
  currentWord = null;
  answered    = false;
}
