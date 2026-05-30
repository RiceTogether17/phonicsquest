/**
 * First Sound Mode  (Phonemic Awareness — Initial Phoneme Identification)
 *
 * Core loop:
 * 1. Show the word image/emoji (but NOT the word text)
 * 2. Play the word audio
 * 3. Show 4 SOUND-FIRST choices (speaker icon + /phoneme/ notation, with
 *    each option auto-played in sequence) — never bare uppercase letters
 * 4. Child identifies the initial phoneme
 * 5. Reveal full word + play first phoneme then full word
 *
 * Distractor strategy: prefer phonemes that children commonly confuse with
 * the target (e.g. /b/ vs /p/, /d/ vs /t/, /f/ vs /th/) before falling back
 * to same-type or any-type phonemes from the word list.
 */

import { renderPhonemes, renderWordImage } from '../components/phonemeDisplay.js';
import { renderPhonemeChoiceGrid } from '../components/phonemeChoice.js';
import { buildWordAnimation } from '../components/wheel.js';
import { audio } from '../modules/audio.js';
import { store } from '../modules/store.js';
import { WORDS, shuffleArray } from '../data/words.js';

/**
 * Common phoneme confusion pairs for initial consonants and short vowels.
 * Keyed by the grapheme string; values are the most confusable alternatives.
 */
const CONFUSION_MAP = {
  // Stop consonant pairs (voicing & place)
  b:  ['p', 'd'],
  p:  ['b', 't'],
  d:  ['b', 't'],
  t:  ['d', 'k'],
  k:  ['g', 't'],
  g:  ['k', 'd'],
  // Fricative / affricate confusions
  f:  ['th', 'v'],
  v:  ['f', 'b'],
  th: ['f', 'd'],
  s:  ['z', 'sh'],
  z:  ['s', 'j'],
  sh: ['s', 'ch'],
  ch: ['sh', 'j'],
  j:  ['ch', 'g'],
  // Nasal / liquid
  m:  ['n', 'b'],
  n:  ['m', 'ng'],
  ng: ['n', 'm'],
  r:  ['w', 'l'],
  w:  ['r', 'v'],
  l:  ['r', 'n'],
  // Short vowel confusions (medial, but also appear as first grapheme in some words)
  a:  ['u', 'o'],
  e:  ['i', 'a'],
  i:  ['e', 'a'],
  o:  ['u', 'a'],
  u:  ['a', 'o'],
};

let currentWord = null;
let answered = false;
let startTime = 0;

/**
 * Set up First Sound mode for a word.
 * @param {import('../data/words.js').Word} word
 * @param {object} els  DOM element references
 */
export function setupFirstSound(word, els) {
  currentWord = word;
  answered = false;
  startTime = Date.now();

  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML = '';

  els.modeInstruction.textContent = 'Say the word slowly… what\'s the FIRST sound?';

  const firstGrapheme = word.graphemes[0];
  const firstType     = word.types[0];

  const distractorGraphemes = getFirstSoundDistractors(firstGrapheme, firstType, word.level);
  const distractors = shuffleArray(distractorGraphemes).slice(0, 3);

  // Early-stage learners (Phase 1–2 words) get the choices in alphabetical
  // order so the teacher/parent can cover initial sounds systematically and
  // the child has a stable scanning frame. From Phase 3 onward we shuffle
  // so finding the answer is a genuine auditory discrimination task again.
  const baseChoices = [
    { grapheme: firstGrapheme, type: firstType, correct: true },
    ...distractors.map(g => ({ grapheme: g.grapheme, type: g.type, correct: false })),
  ];
  const choices = (word.level ?? 1) <= 2
    ? [...baseChoices].sort((a, b) => a.grapheme.localeCompare(b.grapheme))
    : shuffleArray(baseChoices);

  // Play the target word FIRST and wait for it to finish before previewing
  // the choice phonemes — overlapping the two makes the question unlistenable
  // for young children who are still building auditory discrimination.
  // We gate on BOTH the TTS promise AND a word-length-proportional wall-clock
  // floor: some browsers (notably iOS Safari) resolve the speak Promise before
  // the audio buffer actually finishes outputting, so the TTS signal alone
  // isn't reliable on every device.
  const wordPlayed = _waitForWordAudio(word);

  renderPhonemeChoiceGrid(els.modeArea, choices, {
    onChoose: (choice, btn) =>
      handleChoice(choice, btn, word, els, els.modeArea.querySelector('.choice-grid')),
    autoPlayAfter: wordPlayed,
    autoPlayDelay:  600,   // pause after the word so the child can re-attune to phoneme listening
    autoPlayStride: 800,
  });

  els.btnCheck.style.display = 'none';
  els.btnSayIt.style.display = '';
  els.btnSkip.style.display = '';
}

/**
 * Resolve only when the target-word audio is genuinely done playing.
 *
 * Combines the TTS promise (which reports completion based on the
 * SpeechSynthesis `onend` event) with a wall-clock floor derived from
 * word length. On some browsers `onend` fires before the audio actually
 * leaves the speaker — the floor catches that case so the choice phonemes
 * never bleed into the end of the word.
 */
function _waitForWordAudio(wordData) {
  const text = wordData?.word ?? String(wordData ?? '');
  const stretched = !!store.get('stretchedSpeech');
  return new Promise(resolve => {
    setTimeout(() => {
      const ttsDone   = stretched
        ? audio.speakWordStretched(wordData).catch(() => {})
        : audio.speakWord(text).catch(() => {});
      // Stretched playback is roughly 1 phoneme-MP3 (~600 ms) per grapheme
      // plus the final slow blend, so the floor needs to grow accordingly.
      const phonemeCount = wordData?.graphemes?.length ?? text.length;
      const minHoldMs = stretched
        ? Math.max(1400, phonemeCount * 800 + 900)
        : Math.max(1100, text.length * 140 + 400);
      const floorHold = new Promise(r => setTimeout(r, minHoldMs));
      Promise.all([ttsDone, floorHold]).finally(resolve);
    }, 350);
  });
}

function handleChoice(choice, btn, word, els, grid) {
  if (answered) return;
  answered = true;
  const responseTime = Date.now() - startTime;

  grid.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
  });

  if (!choice.correct) {
    btn.classList.add('wrong');
  }

  buildWordAnimation(word, els.wordDisplay);
  renderPhonemes(word, els.phonemeRow, {
    showDiacritics: true,
    showLabels: true,
  });

  setTimeout(async () => {
    await audio.speakPhoneme(word.graphemes[0], word.types[0]);
    await new Promise(r => setTimeout(r, 300));
    await audio.speakWord(word.word);
  }, 300);

  const wrap = document.createElement('div');
  wrap.className = 'vmcq-next-wrap';
  const nextBtn = document.createElement('button');
  nextBtn.className = 'btn btn--primary vmcq-next-btn';
  nextBtn.textContent = 'Next →';
  nextBtn.setAttribute('aria-label', 'Next word');
  wrap.appendChild(nextBtn);
  els.modeArea.appendChild(wrap);
  nextBtn.addEventListener('click', () => els.onResult(choice.correct, responseTime));
  nextBtn.focus();
}

/**
 * Get distractor first-sounds.
 *
 * Priority:
 *   1. Phonemes the child is most likely to confuse with the target (CONFUSION_MAP).
 *   2. Other phonemes of the same type from the word list.
 *   3. Any phoneme from the word list (fallback).
 */
function getFirstSoundDistractors(correctGrapheme, correctType, maxLevel = 3) {
  const seen        = new Set([correctGrapheme]);
  const distractors = [];

  // Tier 1: confusion-pair phonemes — the most instructionally useful distractors
  const confusionTargets = CONFUSION_MAP[correctGrapheme.toLowerCase()] ?? [];
  for (const cg of confusionTargets) {
    if (seen.has(cg)) continue;
    // Find this grapheme in the word list to get its type
    const match = WORDS.find(w => w.level <= maxLevel && w.graphemes[0] === cg);
    if (match) {
      seen.add(cg);
      distractors.push({ grapheme: cg, type: match.types[0] });
    } else {
      // Use the correct type as a reasonable approximation
      seen.add(cg);
      distractors.push({ grapheme: cg, type: correctType });
    }
    if (distractors.length >= 3) break;
  }

  // Tier 2: same-type phonemes from the word list
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter(w => w.level <= maxLevel))) {
      const g = word.graphemes[0];
      const t = word.types[0];
      if (!seen.has(g) && t === correctType) {
        seen.add(g);
        distractors.push({ grapheme: g, type: t });
        if (distractors.length >= 6) break;
      }
    }
  }

  // Tier 3: any phoneme (fallback)
  if (distractors.length < 3) {
    for (const word of shuffleArray(WORDS.filter(w => w.level <= maxLevel))) {
      const g = word.graphemes[0];
      const t = word.types[0];
      if (!seen.has(g)) {
        seen.add(g);
        distractors.push({ grapheme: g, type: t });
        if (distractors.length >= 6) break;
      }
    }
  }

  return distractors;
}

export function getCurrentWord() {
  return currentWord;
}

export function cleanup() {
  currentWord = null;
  answered = false;
}
