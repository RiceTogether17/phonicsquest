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

  const lastIdx      = lastSoundedIdx(word);
  const lastGrapheme = word.graphemes[lastIdx];
  const lastType     = word.types[lastIdx];

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
    onReveal: () => _revealAnswer(word, els, lastIdx),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display  = '';
}

/**
 * Index of the last grapheme that actually MAKES a sound.
 *
 * A magic-e word is stored as c|a|k|e with types c,lv,c,se, so the last
 * *grapheme* is a silent e. Targeting it made the question unanswerable:
 * speakPhoneme returns early for type 'se', so the correct choice played
 * nothing while every distractor played a real sound — the child could
 * pick the right answer only by noticing which button was silent, and the
 * reveal rang a tile that says nothing. Every magic-e word in the bank
 * (98 of them, across long-a/i/o/u, cons-ph, diphthongs and prefixes)
 * behaved this way, which is why the long-vowel phases quietly stopped
 * recommending this mode at all.
 *
 * The last SOUND of "cake" is /k/, so walk back past the silent tail.
 *
 * Exported for tests.
 *
 * @param {import('../data/words.js').Word} word
 * @returns {number}
 */
export function lastSoundedIdx(word) {
  const types = word?.types ?? [];
  for (let i = types.length - 1; i >= 0; i--) {
    if (types[i] !== 'se') return i;
  }
  // All-silent is not a real word shape; fall back to the final grapheme
  // rather than returning -1 and indexing off the end.
  return Math.max(0, types.length - 1);
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
function _revealAnswer(word, els, lastIdx) {
  buildWordAnimation(word, els.wordDisplay);
  // Ring the final tile so the position half of the skill is reinforced.
  renderPhonemes(word, els.phonemeRow, { showDiacritics: true, showLabels: true, targetIndex: lastIdx });
  // Having named the sound, show what the mouth does to make it.
  renderRevealMouthCue(word, lastIdx, els);

  setTimeout(async () => {
    const prevGrapheme = lastIdx > 0 ? word.graphemes[lastIdx - 1] : null;
    await audio.speakPhoneme(word.graphemes[lastIdx], word.types[lastIdx], { word: word.word, prevGrapheme });
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);
}

/**
 * Which grapheme of a pool word this position draws its distractor from.
 * Mirrors lastSoundedIdx so a magic-e word contributes its /k/, never its
 * silent e — a silent distractor is as broken as a silent answer.
 */
function _poolIdx(word, position) {
  return position === 'last' ? lastSoundedIdx(word) : 0;
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
    const match      = levelWords.find(w => w.graphemes[_poolIdx(w, position)] === cg);
    const type = match ? match.types[_poolIdx(match, position)] : (targetType ?? 'c');
    seen.add(cg);
    distractors.push({ grapheme: cg, type });
    if (distractors.length >= 3) break;
  }

  // Tier 2: same-type phonemes from word list
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter(w => w.level <= maxLevel))) {
      const idx = _poolIdx(word, position);
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
      const idx = _poolIdx(word, position);
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
  clearRevealMouthCue();
  currentWord = null;
  round       = null;
  cancelChoicePreviews();
}
