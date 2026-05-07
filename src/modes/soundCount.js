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

let currentWord = null;
let answered    = false;
let startTime   = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupSoundCount(word, els) {
  currentWord = word;
  answered    = false;
  startTime   = Date.now();

  // Image yes, printed word NO — see the module-level comment on why.
  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  els.modeInstruction.textContent = 'How many sounds do you hear?';

  const correctCount = word.phonemes.length;
  const choices      = _getCountChoices(correctCount);

  els.modeArea.innerHTML = '<div class="choice-grid choice-grid--count"></div>';
  const grid = els.modeArea.querySelector('.choice-grid');

  for (const count of choices) {
    const btn = document.createElement('button');
    btn.className        = 'choice-btn choice-btn--count';
    btn.dataset.correct  = String(count === correctCount);
    btn.setAttribute('aria-label', `${count} sound${count !== 1 ? 's' : ''}`);

    const numEl = document.createElement('span');
    numEl.className   = 'count-number';
    numEl.textContent = count;

    const dotsEl = document.createElement('span');
    dotsEl.className   = 'count-dots';
    dotsEl.textContent = '●'.repeat(count);

    btn.appendChild(numEl);
    btn.appendChild(dotsEl);
    btn.addEventListener('click', () => _handleChoice(count, btn, word, els, grid));
    grid.appendChild(btn);
  }

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display  = '';

  setTimeout(() => audio.speakWord(word.word), 400);
}

/**
 * Generate 4 number choices: the correct count plus 3 nearby distractors.
 * Keeps counts between 1 and 7 to stay realistic.
 */
function _getCountChoices(correct) {
  const set = new Set([correct]);
  const candidates = [correct - 2, correct - 1, correct + 1, correct + 2]
    .filter(n => n >= 1 && n <= 7);
  for (const c of candidates) {
    set.add(c);
    if (set.size >= 4) break;
  }
  return [...set].sort(() => Math.random() - 0.5);
}

function _handleChoice(count, btn, word, els, grid) {
  if (answered) return;
  answered = true;
  const responseTime = Date.now() - startTime;
  const correct = count === word.phonemes.length;

  grid.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });
  if (!correct) btn.classList.add('wrong');

  // Reveal printed word + phoneme tiles so child can see + count the sounds
  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, showLabels: true });

  // Play phonemes sequentially to reinforce the count
  setTimeout(async () => {
    await audio.revealPhonemes(word);
  }, 500);

  setTimeout(() => {
    els.onResult(correct, responseTime);
  }, correct ? 1200 : 2000);
}

export function getCurrentWord() { return currentWord; }

export function cleanup() {
  currentWord = null;
  answered    = false;
}
