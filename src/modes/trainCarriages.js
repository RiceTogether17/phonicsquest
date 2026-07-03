/**
 * Train Carriages Mode  (Phonemic Awareness — Initial Phoneme Collection)
 *
 * Inspired by the "Train Carriages" classroom activity from Foundations
 * phonics: a target initial sound is announced, 4–6 picture cards are
 * laid out, and the child taps every card that starts with the target
 * sound. Each correct tap "joins" the card to a growing train as a
 * new carriage. Round ends when all matching cards are collected;
 * the framework's next-word call advances the alphabetical target
 * ladder (run through paTargetSequencer just like First Sound).
 *
 * The session-level framework calls setup(word, els) once per round,
 * not per tap — the passed word's first grapheme IS the round's
 * target, because the sequencer feeds words in alphabetical order of
 * initial phoneme. The mode itself owns the multi-card round.
 */

import { renderWordImage } from '../components/phonemeDisplay.js';
import { audio } from '../modules/audio.js';
import { WORDS, shuffleArray } from '../data/words.js';
import { getFirstSoundDistractors } from './firstSound.js';
import { celebrateCorrect } from '../components/confettiHelper.js';

const ROUND_CARD_COUNT = 6;
const ROUND_MATCH_COUNT = 3;

let _currentWord = null;
let _targetGrapheme = null;
let _targetType = null;
let _startTime = 0;
let _strikes = 0;
let _collected = [];   // word ids matched so far this round
let _cards = [];       // [{ word, isMatch, btn }]
let _completed = false;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupTrainCarriages(word, els) {
  _currentWord    = word;
  _targetGrapheme = word.graphemes[0];
  _targetType     = word.types[0];
  _startTime      = Date.now();
  _strikes        = 0;
  _collected      = [];
  _completed      = false;

  // Build the round pool from the same stage. Drop sight-only words —
  // they don't carry a phoneme tag and confuse the first-sound game.
  const stagePool = WORDS.filter(w =>
    w.group === word.group &&
    Array.isArray(w.graphemes) && w.graphemes.length >= 2
  );
  const round = pickTrainRound(_targetGrapheme, _targetType, stagePool, {
    cardCount: ROUND_CARD_COUNT,
    matchCount: ROUND_MATCH_COUNT,
  });

  _cards = shuffleArray([
    ...round.matches.map(w => ({ word: w, isMatch: true,  btn: null })),
    ...round.distractors.map(w => ({ word: w, isMatch: false, btn: null })),
  ]);

  // Top bar: hide the per-word phoneme tiles and emoji from other modes.
  renderWordImage(word, els.wordEmoji, false);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';
  els.modeInstruction.textContent =
    `Find the words that start with /${_targetGrapheme}/`;

  els.modeArea.innerHTML = /* html */`
    <div class="train-mode">
      <div class="train-target">
        <button class="train-replay" type="button" aria-label="Hear the target sound again">🔊</button>
        <span class="train-target-sound" aria-live="polite">/${_targetGrapheme}/</span>
      </div>
      <div class="train-track" id="train-track" aria-label="Carriages collected so far">
        <span class="train-engine" aria-hidden="true">🚂</span>
      </div>
      <div class="word-card-grid" id="train-grid" role="group" aria-label="Pick the words that start with the target sound"></div>
    </div>
  `;

  const grid = els.modeArea.querySelector('#train-grid');
  _cards.forEach((card, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'word-card';
    btn.dataset.idx     = String(idx);
    btn.dataset.match   = String(card.isMatch);
    btn.dataset.wordId  = card.word.id;
    btn.setAttribute('aria-label', `Card: ${card.word.word}`);
    btn.innerHTML = `
      <span class="word-card-emoji" aria-hidden="true">${card.word.emoji ?? '🃏'}</span>
      <span class="word-card-word">${card.word.word}</span>
    `;
    btn.addEventListener('click', () => _handleCardTap(card, btn, els));
    grid.appendChild(btn);
    card.btn = btn;
  });

  els.modeArea.querySelector('.train-replay')?.addEventListener('click', () => {
    audio.speakPhoneme(_targetGrapheme, _targetType);
  });

  // Announce target sound after a short pause so it doesn't collide
  // with the screen-transition audio.
  setTimeout(() => audio.speakPhoneme(_targetGrapheme, _targetType), 400);

  // Hide the framework's Check / Say-it buttons (Train doesn't need them).
  if (els.btnCheck) els.btnCheck.style.display = 'none';
  if (els.btnSayIt) els.btnSayIt.style.display = 'none';
  if (els.btnSkip)  els.btnSkip.style.display  = '';
}

function _handleCardTap(card, btn, els) {
  if (_completed || btn.disabled) return;

  if (card.isMatch) {
    btn.disabled = true;
    btn.classList.add('word-card--collected');
    audio.speakWord(card.word.word);
    _collected.push(card.word.id);
    _addCarriage(card.word);

    const totalMatches = _cards.filter(c => c.isMatch).length;
    if (_collected.length >= totalMatches) {
      _completeRound(els);
    }
  } else {
    btn.classList.add('word-card--wrong');
    setTimeout(() => btn.classList.remove('word-card--wrong'), 600);
    audio.playSfx('wrong');
    _strikes++;
  }
}

function _addCarriage(word) {
  const track = document.getElementById('train-track');
  if (!track) return;
  const carriage = document.createElement('span');
  carriage.className = 'train-carriage';
  carriage.setAttribute('aria-label', word.word);
  carriage.innerHTML = `
    <span class="train-carriage-cargo" aria-hidden="true">${word.emoji ?? ''}</span>
    <span class="train-carriage-body"  aria-hidden="true">🚃</span>
  `;
  track.appendChild(carriage);
}

function _completeRound(els) {
  if (_completed) return;
  _completed = true;
  const time = Date.now() - _startTime;
  const cleanRound = _strikes === 0;

  celebrateCorrect();

  const banner = document.createElement('div');
  banner.className = 'train-banner';
  banner.textContent = cleanRound ? 'All aboard! 🎉' : 'Great picking! 🚂';
  els.modeArea.appendChild(banner);

  // The mode's resultPolicy is 'final', so this outcome is recorded once and
  // the framework always advances — no app-level retry can strand the round.
  // Report real correctness: a clean sweep counts as a pass; mis-taps mean
  // the word still needs practice and must not promote its SR box.
  setTimeout(() => els.onResult(cleanRound, time), 1600);
}

/**
 * Build a round of `cardCount` cards where `matchCount` share the
 * target initial grapheme and the rest are confusion-pair distractors.
 *
 * Exposed (un-underscored) so tests can drive the picker directly.
 *
 * @param {string} targetGrapheme
 * @param {string} targetType
 * @param {import('../data/words.js').Word[]} pool
 * @param {{cardCount?:number, matchCount?:number}} [opts]
 * @returns {{ matches: Word[], distractors: Word[] }}
 */
export function pickTrainRound(targetGrapheme, targetType, pool, opts = {}) {
  const cardCount  = opts.cardCount  ?? ROUND_CARD_COUNT;
  const matchCount = opts.matchCount ?? ROUND_MATCH_COUNT;

  const matchCandidates = pool
    .filter(w => w.graphemes?.[0] === targetGrapheme)
    .sort((a, b) => a.word.localeCompare(b.word));
  const matches = matchCandidates.slice(0, Math.min(matchCount, matchCandidates.length));

  if (matches.length === 0) {
    return { matches: [], distractors: [] };
  }

  const seen = new Set(matches.map(m => m.id));
  const distractors = [];
  const need = cardCount - matches.length;

  // Tier 1: confusion-pair distractors via the existing firstSound helper.
  const distractorGraphemes = getFirstSoundDistractors(targetGrapheme, targetType, 3);
  for (const dg of distractorGraphemes) {
    if (distractors.length >= need) break;
    const w = pool.find(x => x.graphemes?.[0] === dg.grapheme && !seen.has(x.id));
    if (w) { distractors.push(w); seen.add(w.id); }
  }

  // Tier 2: top up with any non-matching pool word.
  if (distractors.length < need) {
    for (const w of shuffleArray(pool)) {
      if (distractors.length >= need) break;
      if (seen.has(w.id) || w.graphemes?.[0] === targetGrapheme) continue;
      distractors.push(w); seen.add(w.id);
    }
  }

  return { matches, distractors };
}

export function getCurrentWord() {
  return _currentWord;
}

export function cleanup() {
  _currentWord    = null;
  _targetGrapheme = null;
  _targetType     = null;
  _collected      = [];
  _cards          = [];
  _strikes        = 0;
  _completed      = false;
}
