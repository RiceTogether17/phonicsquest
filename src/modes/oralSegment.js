/**
 * Tap the Sounds Mode  (Pure Phonemic Awareness — Oral Phoneme Segmenting)
 *
 * The grapheme-free counterpart of Segment It: the child breaks a spoken
 * word into its phonemes with NO print anywhere — not in the question and
 * not in the reveal. Where Segment It asks "which letters spell each
 * sound?", this mode asks the earlier, purely oral question: "how many
 * sounds do you hear, in order?" — classic Elkonin sound-boxes work
 * without the boxes being pre-drawn (a visible box count would leak the
 * answer).
 *
 * Core loop:
 * 1. Show the word's picture only (image, NOT the printed word — the
 *    letters would let the child count graphemes instead of sounds).
 * 2. Play the word at natural rate, then stretched, so every phoneme is
 *    audible as a separable beat.
 * 3. Big 🥁 tap pad — the child says the word slowly and taps once per
 *    sound. Each tap fills a dot, so their segmentation is visible.
 * 4. "Done" commits the tap count. First miss gets a gentle retry with
 *    the word replayed stretched; the recorded correctness is always the
 *    FIRST attempt (same contract as choiceRound).
 * 5. Reveal stays oral: the correct dots light up one by one while each
 *    phoneme plays — sounds only, never letters.
 *
 * Distinct from Count the Sounds: there the child picks a number from a
 * choice grid; here they physically tap out the segmentation themselves,
 * which is the productive form of the skill.
 */

import { renderWordImage } from '../components/phonemeDisplay.js';
import { audio } from '../modules/audio.js';

let _currentWord = null;
let _taps        = 0;
let _firstTryWrong = false;
let _finished    = false;
let _startTime   = 0;

/**
 * @param {import('../data/words.js').Word} word
 * @param {object} els
 */
export function setupOralSegment(word, els) {
  _currentWord   = word;
  _taps          = 0;
  _firstTryWrong = false;
  _finished      = false;
  _startTime     = Date.now();

  // Image yes, printed word no — same rationale as Sound Count.
  renderWordImage(word, els.wordEmoji, true);
  els.wordDisplay.innerHTML = '';
  els.phonemeRow.innerHTML  = '';
  els.modeInstruction.textContent = 'Say the word slowly. Tap once for every sound you hear!';

  const correctCount = word.phonemes.length;

  els.modeArea.innerHTML = /* html */`
    <div class="oral-segment">
      <div class="sound-dots" id="os-dots" aria-live="polite" aria-label="Sounds tapped so far"></div>
      <button class="clap-button" id="os-tap" type="button" aria-label="Tap a sound">
        <span class="clap-button-emoji" aria-hidden="true">🥁</span>
        <span class="clap-button-label">Tap a sound</span>
      </button>
      <div class="oral-segment-actions">
        <button class="btn btn--ghost btn--sm" id="os-reset" type="button">↺ Start over</button>
        <button class="btn btn--primary" id="os-done" type="button">✓ Done</button>
      </div>
      <div class="choice-feedback" id="os-feedback" role="status" aria-live="polite"></div>
    </div>
  `;

  const dotsEl   = els.modeArea.querySelector('#os-dots');
  const tapBtn   = els.modeArea.querySelector('#os-tap');
  const resetBtn = els.modeArea.querySelector('#os-reset');
  const doneBtn  = els.modeArea.querySelector('#os-done');
  const feedback = els.modeArea.querySelector('#os-feedback');

  const setFeedback = (kind, text) => {
    feedback.className = `choice-feedback choice-feedback--${kind}`;
    feedback.innerHTML = '';
    const icon = document.createElement('span');
    icon.className = 'choice-feedback-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = kind === 'retry' ? '✗' : '✓';
    const msg = document.createElement('span');
    msg.className = 'choice-feedback-text';
    msg.textContent = text;
    feedback.appendChild(icon);
    feedback.appendChild(msg);
  };

  const resetDots = () => {
    _taps = 0;
    dotsEl.innerHTML = '';
  };

  tapBtn.addEventListener('click', () => {
    if (_finished) return;
    _taps++;
    const dot = document.createElement('span');
    dot.className = 'sound-dot sound-dot--filled';
    dot.setAttribute('aria-hidden', 'true');
    dotsEl.appendChild(dot);
    audio.playSfx('pop');
  });

  resetBtn.addEventListener('click', () => {
    if (_finished) return;
    resetDots();
  });

  const finish = (finalCorrect) => {
    _finished = true;
    tapBtn.disabled   = true;
    doneBtn.disabled  = true;
    resetBtn.disabled = true;

    _revealAnswer(word, dotsEl);

    const wrap = document.createElement('div');
    wrap.className = 'vmcq-next-wrap';
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn btn--primary vmcq-next-btn';
    nextBtn.textContent = 'Next →';
    nextBtn.setAttribute('aria-label', 'Next word');
    wrap.appendChild(nextBtn);
    els.modeArea.querySelector('.oral-segment')?.appendChild(wrap);
    nextBtn.addEventListener('click', () => {
      els.onResult(finalCorrect, Date.now() - _startTime);
    }, { once: true });
    nextBtn.focus();
  };

  doneBtn.addEventListener('click', () => {
    if (_finished) return;
    if (_taps === 0) {
      setFeedback('retry', 'Tap the drum once for each sound first!');
      return;
    }
    if (_taps === correctCount) {
      setFeedback('correct', _firstTryWrong ? 'You got it! ⭐' : 'Yes! 🎉');
      audio.playSfx('correct');
      finish(!_firstTryWrong);
    } else if (!_firstTryWrong) {
      _firstTryWrong = true;
      setFeedback('retry', 'Almost! Try again. Say it slowly — one tap for each sound.');
      resetDots();
      setTimeout(() => audio.speakWordStretched(word), 300);
    } else {
      setFeedback('reveal', 'Good try! Listen — let\'s tap it together.');
      finish(false);
    }
  });

  if (els.btnCheck) els.btnCheck.style.display = 'none';
  if (els.btnSayIt) els.btnSayIt.style.display = '';
  if (els.btnSkip)  els.btnSkip.style.display  = '';

  // Natural rate first (recognise the word), then stretched (hear every
  // phoneme as a separable beat) — the same double-pass Segment It uses.
  setTimeout(async () => {
    await audio.speakWord(word.word);
    await new Promise(r => setTimeout(r, 350));
    await audio.speakWordStretched(word);
  }, 400);
}

/**
 * Oral reveal: rebuild the dot row at the correct count and light each
 * dot as its phoneme plays. No print is ever shown — when a word's
 * phoneme count doesn't line up one-to-one with its graphemes (phoneme
 * overrides like "box" /b//o//k//s/), per-grapheme playback would
 * mismatch the dots, so the stretched word carries the audio instead.
 */
function _revealAnswer(word, dotsEl) {
  const count = word.phonemes.length;
  dotsEl.innerHTML = '';
  const dots = [];
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.className = 'sound-dot';
    dot.setAttribute('aria-hidden', 'true');
    dotsEl.appendChild(dot);
    dots.push(dot);
  }
  dotsEl.setAttribute('aria-label', `${count} sound${count !== 1 ? 's' : ''}`);

  setTimeout(async () => {
    if (word.graphemes.length === count) {
      for (let i = 0; i < count; i++) {
        if (!dots[i].isConnected) return; // mode was torn down mid-reveal
        dots[i].classList.add('sound-dot--lit');
        const prevGrapheme = i > 0 ? word.graphemes[i - 1] : null;
        await audio.speakPhoneme(word.graphemes[i], word.types[i], { word: word.word, prevGrapheme });
        await new Promise(r => setTimeout(r, 250));
      }
    } else {
      dots.forEach(d => d.classList.add('sound-dot--lit'));
      await audio.speakWordStretched(word);
    }
    await new Promise(r => setTimeout(r, 300));
    if (dots[0]?.isConnected) audio.speakWord(word.word);
  }, 400);
}

export function getCurrentWord() { return _currentWord; }

export function cleanup() {
  _currentWord   = null;
  _taps          = 0;
  _firstTryWrong = false;
  _finished      = false;
}
