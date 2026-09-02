/**
 * Odd One Out Mode  (Phonemic Awareness — Initial-Phoneme Discrimination)
 *
 * Digital adaptation of the Foundations "Which Doesn't Belong?" activity:
 * three picture cards share the same first sound and one distractor does
 * not — the child works out which one doesn't belong.
 *
 * Core loop:
 * 1. Show 4 picture cards (emoji only — the printed words would let the
 *    child compare first LETTERS visually instead of first SOUNDS)
 * 2. The app names each card in sequence, like the classroom teacher does
 * 3. Child taps the card whose first sound is different
 * 4. Reveal: word labels appear, and the odd word plays with its first
 *    sound so the contrast with the target sound is audible
 *
 * The inverse of Train Carriages (collect the matchers): here the child
 * must REJECT the matchers and isolate the outlier — a harder
 * discrimination task, so it sits after Train in the play order.
 */

import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';
import { firstPhoneme } from './phonemePosition.js';
import { getFirstSoundDistractors } from './firstSound.js';
import { createChoiceRound } from './choiceRound.js';
import { renderWordImage } from '../components/phonemeDisplay.js';

let _currentWord = null;
let _round = null;
let _namingTimer = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupOddOneOut(word, els) {
  _currentWord = word;

  // Same-stage pool, phoneme-tagged words only (sight words carry no
  // usable first-sound information).
  const stagePool = WORDS.filter(
    (w) => w.group === word.group && Array.isArray(w.graphemes) && w.graphemes.length >= 2,
  );
  const roundData = pickOddOneOutRound(word, stagePool, WORDS);
  if (!roundData) {
    // Vanishingly rare (a first grapheme with no second exemplar in the
    // whole bank). Don't strand the child on a blank screen — record
    // nothing punitive and let the framework advance to the next word.
    els.modeArea.innerHTML = '';
    setTimeout(() => els.onResult(true, 0), 0);
    return;
  }
  const cards = shuffleArray([
    ...roundData.matches.map((w) => ({ word: w, isOdd: false })),
    { word: roundData.odd, isOdd: true },
  ]);

  // Hide the word image frame entirely — the pictures live on the choice
  // cards, so an empty stage box just wastes vertical space.
  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';
  els.modeInstruction.textContent =
    "Three words start with the same sound. Which one doesn't belong?";

  els.modeArea.innerHTML = /* html */ `
    <div class="odd-one-out">
      <button class="ooo-replay btn btn--ghost btn--sm" type="button">
        🔊 Hear the words again
      </button>
      <div class="choice-grid choice-grid--emoji" role="group" aria-label="Tap the word that starts with a different sound"></div>
    </div>
  `;

  const grid = els.modeArea.querySelector('.choice-grid');
  for (const card of cards) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn choice-btn--emoji';
    btn.dataset.correct = String(card.isOdd);
    btn.setAttribute('aria-label', `Card: ${card.word.word}`);
    btn.innerHTML = `
      <span class="choice-btn-emoji" aria-hidden="true">${card.word.emoji ?? '🃏'}</span>
      <span class="choice-btn-word choice-btn-word--hidden">${card.word.word}</span>
    `;
    btn.addEventListener('click', () => _round?.handleTap(card.isOdd, btn));
    grid.appendChild(btn);
  }

  const nameCards = () => _nameCardsInSequence(cards, grid);
  els.modeArea.querySelector('.ooo-replay')?.addEventListener('click', nameCards);

  _round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Say each word slowly — listen to the very first sound.',
    onRetry: () => {
      setTimeout(nameCards, 200);
    },
    onReveal: () => _revealAnswer(roundData.odd, els),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = 'none';
  els.btnSkip.style.display = '';

  setTimeout(nameCards, 400);
}

/**
 * Speak each card's word in visual (grid) order, briefly highlighting the
 * card being named — the digital stand-in for the teacher pointing at
 * each picture. Word length varies, so pacing is driven by each TTS
 * utterance finishing rather than a fixed stride.
 */
function _nameCardsInSequence(cards, grid) {
  const token = ++_namingTimer; // cancels any naming pass still running
  const btns = [...grid.querySelectorAll('.choice-btn')];

  (async () => {
    for (const btn of btns) {
      if (token !== _namingTimer || !btn.isConnected) return;
      const wordText = btn.getAttribute('aria-label')?.replace('Card: ', '') ?? '';
      btn.classList.add('previewing');
      try {
        await audio.speakWordArticulated(wordText);
      } catch {
        /* keep naming */
      }
      btn.classList.remove('previewing');
      await new Promise((r) => setTimeout(r, 350));
    }
  })();
}

/** Reveal: show the word labels and contrast the odd word's first sound. */
function _revealAnswer(oddWord, els) {
  els.modeArea
    .querySelectorAll('.choice-btn-word--hidden')
    .forEach((el) => el.classList.remove('choice-btn-word--hidden'));

  setTimeout(async () => {
    await audio.speakWord(oddWord.word);
    await new Promise((r) => setTimeout(r, 300));
    // The contrast is the odd word's first SOUND — /k/ for "crab", not /kr/.
    const { grapheme, type } = firstPhoneme(oddWord);
    await audio.speakPhoneme(grapheme, type);
  }, 300);
}

/**
 * Build one Odd One Out round: the sequenced word + 2 more words sharing
 * its first phoneme, plus 1 odd word with a different (ideally
 * confusable) first sound.
 *
 * Exposed un-underscored so tests can drive the picker directly.
 *
 * @param {import('../data/words.js').Word} word    the round's target word
 * @param {import('../data/words.js').Word[]} pool  same-stage candidates
 * @param {import('../data/words.js').Word[]} [fullList]  fallback pool
 * The classroom original works with "two or three" matching cards, so a
 * round with only 2 matches (3 cards total) is still valid when a stage
 * is sparse.
 *
 * @returns {{ matches: Word[], odd: Word } | null}
 */
export function pickOddOneOutRound(word, pool, fullList = WORDS) {
  // Match on the first PHONEME, not the first tile. Comparing tiles let a
  // round be built from clap / clip / clop with "crab" as the odd one —
  // and all four of those start with /k/, so the question had no answer.
  const target = firstPhoneme(word).grapheme;
  const seen = new Set([word.id]);

  // Two more same-first-sound words; fall back to the full word bank so
  // a sparse stage can't produce an unplayable 2-card round.
  const matches = [word];
  for (const source of [pool, fullList]) {
    for (const w of shuffleArray(source)) {
      if (matches.length >= 3) break;
      if (seen.has(w.id) || firstPhoneme(w).grapheme !== target) continue;
      if (!Array.isArray(w.graphemes) || w.graphemes.length < 2) continue;
      matches.push(w);
      seen.add(w.id);
    }
  }

  // Odd word: prefer a confusion-pair first sound so the discrimination
  // is instructionally meaningful, then any different first sound.
  const confusable = new Set(
    getFirstSoundDistractors(target, firstPhoneme(word).type, word.level ?? 3).map(
      (d) => d.grapheme,
    ),
  );
  const differs = (w) =>
    Array.isArray(w.graphemes) && w.graphemes.length >= 2 && firstPhoneme(w).grapheme !== target;
  const odd =
    pool.find((w) => !seen.has(w.id) && differs(w) && confusable.has(firstPhoneme(w).grapheme)) ??
    pool.find((w) => !seen.has(w.id) && differs(w)) ??
    fullList.find((w) => !seen.has(w.id) && differs(w));

  if (matches.length < 2 || !odd) return null;
  return { matches, odd };
}

export function getCurrentWord() {
  return _currentWord;
}

export function cleanup() {
  _currentWord = null;
  _round = null;
  _namingTimer++;
}
