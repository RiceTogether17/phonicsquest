/**
 * Phoneme-Choice Grid (sound-first, no print contamination)
 *
 * Used by the phonemic-awareness modes (firstSound, lastSound, middleSound)
 * where the child must identify a SOUND, not a letter. Two design rules:
 *
 *   1. The choice label is rendered as phoneme notation ("/k/") with a
 *      speaker icon, never as a bare uppercase letter ("K"). This signals
 *      "this is a sound" and makes the button visually different from the
 *      print-based phonics modes.
 *
 *   2. Each option auto-plays once on render so the child hears every choice
 *      before being asked to pick. A child who can't read still has full
 *      access to the task. Auto-play can be deferred via `autoPlayAfter`
 *      (a Promise) so the target-word audio plays in full before the choice
 *      previews start — overlapping the two confuses young listeners.
 *
 * Tap = commit. To re-hear an option, the user can use the existing "Say it"
 * button (which repeats the target word). Mouseenter previews on desktop for
 * keyboard/mouse users; this is silently ignored on touch.
 */

import { audio } from '../modules/audio.js';
import { phonemeNotation } from '../data/words.js';

/** Pending auto-play preview timer ids, so a new round (or the child's first
 *  tap) can cancel previews that haven't fired yet. Without this, timers from
 *  a finished round keep closured references to the old buttons and stray
 *  phoneme audio bleeds into the next question. */
let _previewTimers = [];

/**
 * Cancel all pending choice-preview timers (and any in-flight TTS utterance).
 * Called automatically when a new grid renders; modes also call it from
 * cleanup() and the round controller calls it on the child's first tap.
 */
export function cancelChoicePreviews() {
  _previewTimers.forEach(id => clearTimeout(id));
  _previewTimers = [];
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try { window.speechSynthesis.cancel(); } catch (_) { /* non-fatal */ }
  }
}

/**
 * @typedef {Object} PhonemeChoice
 * @property {string}  grapheme   - the spelling unit, used to look up audio
 * @property {string}  type       - phoneme type ('c', 'sv', 'lv', 'd', etc.)
 * @property {boolean} correct    - whether this is the right answer
 */

/**
 * Render a sound-first phoneme-choice grid into `container`.
 *
 * @param {HTMLElement} container
 * @param {PhonemeChoice[]} choices
 * @param {object} [opts]
 * @param {(choice: PhonemeChoice, btn: HTMLButtonElement) => void} [opts.onChoose]
 * @param {boolean} [opts.autoPlay=true]   - cycle through each option once on mount
 * @param {number}  [opts.autoPlayDelay=400] - initial delay before first auto-play (ms)
 * @param {number}  [opts.autoPlayStride=650] - gap between auto-played choices (ms)
 * @param {Promise<void>|null} [opts.autoPlayAfter=null] - if provided, defer the
 *   auto-play preview until this promise resolves (e.g. wait for the target
 *   word audio to finish so the two don't overlap)
 * @returns {HTMLButtonElement[]} the rendered buttons in render order
 */
export function renderPhonemeChoiceGrid(container, choices, opts = {}) {
  const {
    onChoose,
    autoPlay        = true,
    autoPlayDelay   = 400,
    autoPlayStride  = 650,
    autoPlayAfter   = null,
  } = opts;

  // A new grid supersedes any previews still queued from the previous round.
  cancelChoicePreviews();

  container.innerHTML = '<div class="choice-grid choice-grid--phoneme"></div>';
  const grid = container.querySelector('.choice-grid');

  const buttons = choices.map(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn choice-btn--phoneme';
    btn.dataset.correct  = String(!!choice.correct);
    btn.dataset.grapheme = choice.grapheme;
    btn.setAttribute(
      'aria-label',
      `Sound option ${phonemeNotation(choice.grapheme, choice.type).join(' ')}. Tap to choose.`,
    );

    const speaker = document.createElement('span');
    speaker.className = 'choice-btn-speaker';
    speaker.textContent = '🔊';
    speaker.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'choice-btn-phoneme';
    // The SOUND, not the spelling. These buttons print inside slashes, which
    // is a claim about sound: "/g/" on the answer to "gem" tells the child
    // that g says /g/ there, when the button they are about to hear says
    // /j/. Same for /ck/, /tch/, /dge/, /ph/.
    label.textContent = phonemeNotation(choice.grapheme, choice.type).join('');

    btn.appendChild(speaker);
    btn.appendChild(label);

    // Desktop hover preview only. iOS synthesizes mouseenter on tap, so on
    // touch devices this fires concurrently with the word audio and causes
    // the exact overlap we're trying to avoid. Gate it behind a real
    // pointing device using the hover media query.
    if (_hasRealHover()) {
      btn.addEventListener('mouseenter', () => {
        audio.speakPhoneme(choice.grapheme, choice.type);
      });
    }
    btn.addEventListener('click', () => {
      if (onChoose) onChoose(choice, btn);
    });

    grid.appendChild(btn);
    return btn;
  });

  if (autoPlay) {
    const start = () => _previewChoicesInOrder(buttons, choices, autoPlayDelay, autoPlayStride);
    if (autoPlayAfter && typeof autoPlayAfter.then === 'function') {
      // Defer until the gate promise settles. Errors are non-fatal — start
      // the previews anyway so the child isn't left in silence.
      autoPlayAfter.then(start, start);
    } else {
      start();
    }
  }

  return buttons;
}

/**
 * Play each option's phoneme in sequence with a brief visual highlight on
 * the currently-playing button, so a non-reading child can still distinguish
 * the choices.
 *
 * Before the FIRST preview plays we cancel any in-flight SpeechSynthesis
 * utterance — even with our wall-clock gate, an iOS quirk can leave the
 * word's TTS audio tail still draining. Cancelling here guarantees a clean
 * silence before the phoneme audio starts.
 */
function _previewChoicesInOrder(buttons, choices, initialDelay, stride) {
  buttons.forEach((btn, i) => {
    const timerId = setTimeout(async () => {
      _previewTimers = _previewTimers.filter(id => id !== timerId);
      if (btn.disabled) return;
      if (i === 0 && typeof window !== 'undefined' && window.speechSynthesis) {
        try { window.speechSynthesis.cancel(); } catch (_) { /* non-fatal */ }
      }
      btn.classList.add('previewing');
      try {
        await audio.speakPhoneme(choices[i].grapheme, choices[i].type);
      } catch (_) { /* audio failures are non-fatal */ }
      btn.classList.remove('previewing');
    }, initialDelay + i * stride);
    _previewTimers.push(timerId);
  });
}

/**
 * True if the device has a mouse-like pointer that can hover (desktop with
 * a mouse / trackpad). Returns false on touch-only devices where the OS
 * synthesizes mouseenter events from taps and would falsely trigger our
 * hover-preview.
 */
function _hasRealHover() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  try {
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch (_) {
    return false;
  }
}
