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
import { renderRevealMouthCue, clearRevealMouthCue } from '../components/mouthCue.js';
import { renderPhonemeChoiceGrid, cancelChoicePreviews } from '../components/phonemeChoice.js';
import { createChoiceRound } from './choiceRound.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';
import { lastPhoneme } from './phonemePosition.js';

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
let round       = null;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupLastSound(word, els) {
  currentWord = word;

  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';

  els.modeInstruction.textContent = 'Listen to the end of the word… what\'s the LAST sound?';

  // The last PHONEME, which is not always the last tile: "cake" ends in a
  // silent e, and "clamp" ends in a two-sound blend whose last sound is /p/.
  const { grapheme: lastGrapheme, type: lastType, index: lastIdx } = lastPhoneme(word);

  const distractors = _getDistractors(lastGrapheme, 'last', word.level, lastType);
  // Phase 1–2 words → alphabetical order (predictable for the teacher, lower
  // load for the child). Phase 3+ → shuffled so the answer can't be located
  // by remembered position. See firstSound.js for the rationale.
  const baseChoices = [
    { grapheme: lastGrapheme, type: lastType, correct: true },
    ...distractors.slice(0, 3).map(g => ({ ...g, correct: false })),
  ];
  const choices = (word.level ?? 1) <= 2
    ? [...baseChoices].sort((a, b) => a.grapheme.localeCompare(b.grapheme))
    : shuffleArray(baseChoices);

  // Speak the word first; gate the choice previews on it finishing so the
  // two audio streams never overlap. Gate combines TTS-end + wall-clock
  // floor (see _waitForWordAudio).
  const wordPlayed = _waitForWordAudio(word);

  renderPhonemeChoiceGrid(els.modeArea, choices, {
    onChoose: (choice, btn) => round?.handleTap(choice.correct, btn),
    autoPlayAfter: wordPlayed,
    autoPlayDelay:  600,
    autoPlayStride: 800,
  });

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid: els.modeArea.querySelector('.choice-grid'),
    onResult: els.onResult,
    retryHint: 'Listen right to the END of the word.',
    onRetry: () => { audio.speakWordArticulated(word.word).catch(() => {}); },
    onReveal: () => _revealAnswer(word, els, lastIdx, lastGrapheme, lastType),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display  = '';
}

/**
 * See firstSound.js — same gating combining TTS-end + wall-clock floor.
 * Duplicated locally to keep each mode file self-contained.
 */
function _waitForWordAudio(wordData) {
  const text = wordData?.word ?? String(wordData ?? '');
  return new Promise(resolve => {
    setTimeout(() => {
      const ttsDone   = audio.speakWordTwiceClear(text).catch(() => {});
      // Two utterances (articulated + near-natural repeat) plus the pause
      // between them — the floor covers the whole double-say.
      const minHoldMs = Math.max(2600, text.length * 340 + 900);
      const floorHold = new Promise(r => setTimeout(r, minHoldMs));
      Promise.all([ttsDone, floorHold]).finally(resolve);
    }, 350);
  });
}

/** Reveal the full word: animation + labelled phoneme tiles + audio. */
function _revealAnswer(word, els, lastIdx, lastGrapheme, lastType) {
  buildWordAnimation(word, els.wordDisplay);
  // Ring the final TILE — for "clamp" that is "mp", which is genuinely the
  // chunk carrying the /p/ the child just named, and showing it tells them
  // where in the word the sound lives.
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, showLabels: true, targetIndex: lastIdx });
  // The mouth cue is for the SOUND, not the tile: "mp" has no mouth shape.
  renderRevealMouthCue(word, lastIdx, els, { phoneme: lastGrapheme });

  setTimeout(async () => {
    const prevGrapheme = lastIdx > 0 ? word.graphemes[lastIdx - 1] : null;
    await audio.speakPhoneme(lastGrapheme, lastType, { word: word.word, prevGrapheme });
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);
}

/**
 * The phoneme a pool word contributes at this position.
 *
 * Runs through the same resolver as the answer, so a magic-e word offers
 * its /k/ rather than a silent e, and a blend word offers /p/ rather than
 * /mp/. A distractor that is silent, or that is two sounds when the answer
 * is one, gives the answer away just as surely as a wrong key does.
 */
function _poolPhoneme(word, position) {
  return position === 'last'
    ? lastPhoneme(word)
    : { grapheme: word.graphemes[0], type: word.types[0], index: 0 };
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
    const match      = levelWords.find(w => _poolPhoneme(w, position).grapheme === cg);
    const type = match ? _poolPhoneme(match, position).type : (targetType ?? 'c');
    seen.add(cg);
    distractors.push({ grapheme: cg, type });
    if (distractors.length >= 3) break;
  }

  // Tier 2: same-type phonemes from word list
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter(w => w.level <= maxLevel))) {
      const { grapheme: g, type: t } = _poolPhoneme(word, position);
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
      const { grapheme: g, type: t } = _poolPhoneme(word, position);
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
  clearRevealMouthCue();
  currentWord = null;
  round       = null;
  cancelChoicePreviews();
}
