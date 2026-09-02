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
import { renderRevealMouthCue, clearRevealMouthCue } from '../components/mouthCue.js';
import { renderPhonemeChoiceGrid, cancelChoicePreviews } from '../components/phonemeChoice.js';
import { createChoiceRound } from './choiceRound.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';

const VOWEL_TYPES = new Set(['sv', 'lv', 'rc', 'dp']);
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
let round = null;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupMiddleSound(word, els) {
  currentWord = word;

  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  // Not "Stretch the word…": the prompt audio is deliberately articulated
  // rather than segmented, because segmenting would play the medial vowel on
  // its own — which IS the answer. Promising a stretch the app then doesn't
  // deliver just leaves the child waiting for audio that never comes.
  els.modeInstruction.textContent = 'Listen to the whole word… what sound is in the MIDDLE?';

  const midIdx = _getMiddleVowelIdx(word);
  const midGrapheme = word.graphemes[midIdx];
  const midType = word.types[midIdx];

  const distractors = _getVowelDistractors(midGrapheme, word.level, midType);
  // Phase 1–2 words → vowels in alphabetical order (a, e, i, o, u feel),
  // so the teacher can sweep through middle sounds systematically. Phase 3+
  // → shuffled. See firstSound.js for the rationale.
  const baseChoices = [
    { grapheme: midGrapheme, type: midType, correct: true },
    ...distractors.slice(0, 3).map((g) => ({ ...g, correct: false })),
  ];
  const choices =
    (word.level ?? 1) <= 2
      ? [...baseChoices].sort((a, b) => a.grapheme.localeCompare(b.grapheme))
      : shuffleArray(baseChoices);

  // Speak the word first; gate the choice previews on it finishing so the
  // two audio streams never overlap. Gate combines TTS-end + wall-clock
  // floor (see _waitForWordAudio).
  const wordPlayed = _waitForWordAudio(word);

  renderPhonemeChoiceGrid(els.modeArea, choices, {
    onChoose: (choice, btn) => round?.handleTap(choice.correct, btn),
    autoPlayAfter: wordPlayed,
    autoPlayDelay: 600,
    autoPlayStride: 800,
  });

  round = createChoiceRound({
    modeArea: els.modeArea,
    grid: els.modeArea.querySelector('.choice-grid'),
    onResult: els.onResult,
    retryHint: 'Say it slowly yourself — what is in the MIDDLE?',
    onRetry: () => {
      audio.speakWordArticulated(word.word).catch(() => {});
    },
    onReveal: () => _revealAnswer(word, els, midIdx),
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display = '';
}

/**
 * See firstSound.js — same gating combining TTS-end + wall-clock floor.
 * Duplicated locally to keep each mode file self-contained.
 */
function _waitForWordAudio(wordData) {
  const text = wordData?.word ?? String(wordData ?? '');
  return new Promise((resolve) => {
    setTimeout(() => {
      const ttsDone = audio.speakWordTwiceClear(text).catch(() => {});
      // Two utterances (articulated + near-natural repeat) plus the pause
      // between them — the floor covers the whole double-say.
      const minHoldMs = Math.max(2600, text.length * 340 + 900);
      const floorHold = new Promise((r) => setTimeout(r, minHoldMs));
      Promise.all([ttsDone, floorHold]).finally(resolve);
    }, 350);
  });
}

/** Reveal the full word: animation + labelled phoneme tiles + audio. */
function _revealAnswer(word, els, midIdx) {
  buildWordAnimation(word, els.wordDisplay);
  // Ring the middle tile: the child identified a sound *and* a position,
  // and without this the reveal shows every tile equally.
  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
    targetIndex: midIdx,
  });
  // Having named the sound, show what the mouth does to make it.
  renderRevealMouthCue(word, midIdx, els);

  setTimeout(async () => {
    const prevGrapheme = midIdx > 0 ? word.graphemes[midIdx - 1] : null;
    await audio.speakPhoneme(word.graphemes[midIdx], word.types[midIdx], {
      word: word.word,
      prevGrapheme,
    });
    await new Promise((r) => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);
}

/** Find the index of the middle/medial vowel phoneme. */
function _getMiddleVowelIdx(word) {
  // Look for an interior vowel (not first, not last if more than 2 phonemes)
  const minI = word.graphemes.length > 2 ? 1 : 0;
  const maxI = word.graphemes.length > 2 ? word.graphemes.length - 2 : word.graphemes.length - 1;
  for (let i = minI; i <= maxI; i++) {
    if (VOWEL_TYPES.has(word.types[i])) return i;
  }
  // Word selection excludes words without an interior vowel (see
  // hasInteriorVowel in progress.js), but replay paths (Mistakes Den,
  // word workouts) can still hand one in. Target ANY vowel over the
  // absolute-middle index: the old fallback landed on a consonant for
  // silent-e words like "ape" (a|p|e → 'p'), making the vowel-choice
  // question unanswerable.
  const anyVowel = word.types.findIndex((t) => VOWEL_TYPES.has(t));
  if (anyVowel >= 0) return anyVowel;
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
  const seen = new Set([correctGrapheme]);
  const distractors = [];

  // At level 1 restrict to short vowels so beginners compare a/e/i/o/u only
  const allowedVowelTypes = maxLevel <= 1 ? SHORT_VOWEL_TYPES : VOWEL_TYPES;

  // Tier 1: confusion-pair vowels
  const confusionTargets = VOWEL_CONFUSION_MAP[correctGrapheme.toLowerCase()] ?? [];
  for (const cg of confusionTargets) {
    if (seen.has(cg)) continue;
    // Only include if this vowel type is allowed at this level
    const match = WORDS.find(
      (w) => w.graphemes.includes(cg) && allowedVowelTypes.has(w.types[w.graphemes.indexOf(cg)]),
    );
    const type = match ? match.types[match.graphemes.indexOf(cg)] : 'sv';
    if (!allowedVowelTypes.has(type)) continue;
    seen.add(cg);
    distractors.push({ grapheme: cg, type });
    if (distractors.length >= 3) break;
  }

  // Tier 2: same allowed vowel type from word list
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter((w) => w.level <= maxLevel))) {
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
    for (const word of shuffleArray(WORDS.filter((w) => w.level <= maxLevel))) {
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

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  clearRevealMouthCue();
  currentWord = null;
  round = null;
  cancelChoicePreviews();
}
