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
  'My word is {w}.', // 4 words
  'I can say {w}.', // 4
  'Say {w} with me.', // 4
  'Now say the word {w}.', // 5
  'We can all say {w}.', // 5
  'I like the word {w}.', // 5
  'Can you say the word {w}?', // 6
  'Let us say the word {w} again.', // 7
];

let currentWord = null;
let round = null;
let _speakToken = 0;

/**
 * Finger-counting pace. The old 300 ms ran the words together once the
 * per-word rate slowed down; ~480 ms is roughly a beat, which is what the
 * classroom activity gives the child to lift the next finger.
 */
const INTER_WORD_MS = 480;

/** Gap between chips during the reveal — the words are printed by then. */
const REVEAL_GAP_MS = 300;

const REPLAY_IDLE = '🔊 Hear the sentence again';
const REPLAY_BUSY = '👂 Listening…';

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupWordCount(word, els) {
  currentWord = word;

  const template = SENTENCE_TEMPLATES[Math.floor(Math.random() * SENTENCE_TEMPLATES.length)];
  const tokens = buildCountSentence(template, word.word);
  const correct = tokens.length;

  // Picture cue for the featured word is fine — it names the topic, not
  // the answer. The sentence itself stays unprinted until reveal.
  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';
  els.modeInstruction.textContent = 'Listen, count on your fingers… how many words?';

  els.modeArea.innerHTML = /* html */ `
    <div class="word-count">
      <button class="wc-replay btn btn--ghost btn--sm" type="button"></button>
      <div class="wc-sentence" aria-live="polite"></div>
      <div class="choice-grid choice-grid--count" role="group" aria-label="How many words did you hear?"></div>
    </div>
  `;

  const grid = els.modeArea.querySelector('.choice-grid');
  for (const count of _getCountChoices(correct)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-btn choice-btn--count';
    btn.dataset.correct = String(count === correct);
    btn.setAttribute('aria-label', `${count} word${count !== 1 ? 's' : ''}`);
    btn.innerHTML = `
      <span class="count-number">${count}</span>
      <span class="count-dots">${'●'.repeat(count)}</span>
    `;
    btn.addEventListener('click', () => round?.handleTap(count === correct, btn));
    grid.appendChild(btn);
  }

  // Label set from JS rather than in the markup above: interpolating into an
  // innerHTML template is banned repo-wide (no-restricted-syntax), and the
  // same helper owns the label for the rest of the round anyway.
  const replayBtn = els.modeArea.querySelector('.wc-replay');
  _setReplayState(replayBtn, false);

  const speakSentence = () => _speakWordByWord(tokens, replayBtn);
  replayBtn?.addEventListener('click', speakSentence);

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid,
    onResult: els.onResult,
    retryHint: 'Put up one finger for each word you hear.',
    onRetry: () => {
      setTimeout(speakSentence, 200);
    },
    onReveal: () => _revealAnswer(tokens, els, replayBtn),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = 'none';
  els.btnSkip.style.display = '';

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
    .map((t) => t.replace(/[.,!?]/g, ''))
    .filter(Boolean);
}

/**
 * Flip the replay button between its resting label and a "playing now"
 * state. Deliberately does NOT disable the button: a child who taps mid
 * sentence wants to start over, and disabling a focused control drops
 * keyboard focus to the body. The label and the pulse are the whole point
 * — without them nothing on screen moves while the sentence plays, so a
 * child with the volume down (or who missed the start) has no way to tell
 * whether audio is running.
 */
function _setReplayState(btn, speaking) {
  if (!btn) return;
  btn.textContent = speaking ? REPLAY_BUSY : REPLAY_IDLE;
  btn.classList.toggle('is-speaking', speaking);
}

/**
 * Speak the sentence one word at a time at finger-counting pace —
 * mirroring how the whole class repeats "I , like, to, go, swimming…"
 * while counting. A token cancels any pass still running when the
 * round is replayed or torn down.
 *
 * Each word goes through speakSentenceWord rather than speakWord: standing
 * alone, a short function word needs the slower rate, the neutral pitch and
 * above all the longer onset guard, or its opening consonant is clipped and
 * the child cannot tell that a word was there at all.
 *
 * A superseded pass returns WITHOUT restoring the button — whatever bumped
 * the token owns the button now and will restore it when it finishes.
 */
function _speakWordByWord(tokens, replayBtn) {
  const token = ++_speakToken;
  _setReplayState(replayBtn, true);
  (async () => {
    for (let i = 0; i < tokens.length; i++) {
      if (token !== _speakToken) return;
      try {
        await audio.speakSentenceWord(tokens[i]);
      } catch {
        /* keep counting */
      }
      if (i < tokens.length - 1) await new Promise((r) => setTimeout(r, INTER_WORD_MS));
    }
    if (token !== _speakToken) return;
    _setReplayState(replayBtn, false);
  })();
}

/** Reveal: pop the sentence in chip-by-chip while replaying each word. */
function _revealAnswer(tokens, els, replayBtn) {
  const holder = els.modeArea.querySelector('.wc-sentence');
  if (!holder) return;

  const token = ++_speakToken;
  _setReplayState(replayBtn, true);
  (async () => {
    for (let i = 0; i < tokens.length; i++) {
      if (token !== _speakToken || !holder.isConnected) return;
      const chip = document.createElement('span');
      chip.className = 'wc-chip';
      chip.textContent = tokens[i];
      const num = document.createElement('span');
      num.className = 'wc-chip-num';
      num.textContent = String(i + 1);
      chip.prepend(num);
      holder.appendChild(chip);
      try {
        await audio.speakSentenceWord(tokens[i]);
      } catch {
        /* keep revealing */
      }
      if (i < tokens.length - 1) await new Promise((r) => setTimeout(r, REVEAL_GAP_MS));
    }
    if (token !== _speakToken) return;
    _setReplayState(replayBtn, false);
  })();
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  round = null;
  // Bumping the token stops the loop at its next await, but the word already
  // handed to the engine keeps talking over whatever screen comes next.
  _speakToken++;
  audio.cancelSpeech();
}
