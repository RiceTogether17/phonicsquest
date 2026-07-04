/**
 * Count the Words Mode  (Phonological Awareness — Word Counting)
 *
 * Digital adaptation of the Foundations "Word Counting / Finger Counting"
 * activity: the teacher says a sentence, the children repeat it while
 * counting each word on their fingers, then answer "how many words?".
 * Word counting develops spoken fluency and implicitly teaches sentence
 * structure — the earliest level of phonological awareness, before
 * syllables and phonemes.
 *
 * Core loop:
 * 1. A short sentence featuring the current word is spoken aloud —
 *    word by word, finger-counting pace, with NO printed text (showing
 *    the sentence would turn an oral task into visual token-counting)
 * 2. "How many words did you hear?" — 4 number choices with dots
 * 3. Reveal: the sentence appears as one chip per word, popping in
 *    one at a time while each word replays, reinforcing the count
 *
 * Polysyllabic guard from the source material: templates use the child's
 * current word plus simple function words, so "swimming counts as two
 * words" style confusions are avoided by design at this level.
 */

import { renderWordImage } from '../components/phonemeDisplay.js';
import { audio } from '../modules/audio.js';
import { createChoiceRound } from './choiceRound.js';
import { _getCountChoices } from './soundCount.js';

/**
 * Sentence frames of varying length. `{w}` is replaced by the current
 * word. The frames talk ABOUT the word ("say the word …") rather than
 * using it in a scene, so they stay grammatical whether the word bank
 * hands us a noun (cat), a verb (run) or an adjective (wet). Function
 * words are high-frequency so the sentence is easy to hold in memory
 * and every slot is a single clean spoken word.
 */
const SENTENCE_TEMPLATES = [
  'My word is {w}.',              // 4 words
  'I can say {w}.',               // 4
  'Say {w} with me.',             // 4
  'Now say the word {w}.',        // 5
  'We can all say {w}.',          // 5
  'I like the word {w}.',         // 5
  'Can you say the word {w}?',    // 6
  'Let us say the word {w} again.', // 7
];

let currentWord = null;
let round = null;
let _speakToken = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupWordCount(word, els) {
  currentWord = word;

  const template = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
  const tokens   = buildCountSentence(template, word.word);
  const correct  = tokens.length;

  // Picture cue for the featured word is fine — it names the topic, not
  // the answer. The sentence itself stays unprinted until reveal.
  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';
  els.modeInstruction.textContent = 'Listen, count on your fingers… how many words?';

  els.modeArea.innerHTML = /* html */`
    <div class="word-count">
      <button class="wc-replay btn btn--ghost btn--sm" type="button">
        🔊 Hear the sentence again
      </button>
      <div class="wc-sentence" aria-live="polite"></div>
      <div class="choice-grid choice-grid--count" role="group" aria-label="How many words did you hear?"></div>
    </div>
  `;

  const grid = els.modeArea.querySelector('.choice-grid');
  for (const count of _getCountChoices(correct)) {
    const btn = document.createElement('button');
    btn.type            = 'button';
    btn.className       = 'choice-btn choice-btn--count';
    btn.dataset.correct = String(count === correct);
    btn.setAttribute('aria-label', `${count} word${count !== 1 ? 's' : ''}`);
    btn.innerHTML = `
      <span class="count-number">${count}</span>
      <span class="count-dots">${'●'.repeat(count)}</span>
    `;
    btn.addEventListener('click', () => round?.handleTap(count === correct, btn));
    grid.appendChild(btn);
  }

  const speakSentence = () => _speakWordByWord(tokens);
  els.modeArea.querySelector('.wc-replay')?.addEventListener('click', speakSentence);

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Put up one finger for each word you hear.',
    onRetry: () => { setTimeout(speakSentence, 200); },
    onReveal: () => _revealAnswer(tokens, els),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = 'none';
  els.btnSkip.style.display  = '';

  setTimeout(speakSentence, 400);
}

/**
 * Split a filled template into clean spoken word tokens (punctuation
 * stripped, no empties). Exported for tests.
 *
 * @param {string} template  e.g. 'I see a {w}.'
 * @param {string} word
 * @returns {string[]}
 */
export function buildCountSentence(template, word) {
  return template
    .replace('{w}', word)
    .split(/\s+/)
    .map(t => t.replace(/[.,!?]/g, ''))
    .filter(Boolean);
}

/**
 * Speak the sentence one word at a time at finger-counting pace —
 * mirroring how the whole class repeats "I , like, to, go, swimming…"
 * while counting. A token cancels any pass still running when the
 * round is replayed or torn down.
 */
function _speakWordByWord(tokens) {
  const token = ++_speakToken;
  (async () => {
    for (const t of tokens) {
      if (token !== _speakToken) return;
      try { await audio.speakWord(t); } catch { /* keep counting */ }
      await new Promise(r => setTimeout(r, 300));
    }
  })();
}

/** Reveal: pop the sentence in chip-by-chip while replaying each word. */
function _revealAnswer(tokens, els) {
  const holder = els.modeArea.querySelector('.wc-sentence');
  if (!holder) return;

  const token = ++_speakToken;
  (async () => {
    for (let i = 0; i < tokens.length; i++) {
      if (token !== _speakToken || !holder.isConnected) return;
      const chip = document.createElement('span');
      chip.className   = 'wc-chip';
      chip.textContent = tokens[i];
      const num = document.createElement('span');
      num.className   = 'wc-chip-num';
      num.textContent = String(i + 1);
      chip.prepend(num);
      holder.appendChild(chip);
      try { await audio.speakWord(tokens[i]); } catch { /* keep revealing */ }
      await new Promise(r => setTimeout(r, 250));
    }
  })();
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  round = null;
  _speakToken++;
}
