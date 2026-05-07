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
 *      access to the task.
 *
 * Tap = commit. To re-hear an option, the user can use the existing "Say it"
 * button (which repeats the target word). Mouseenter previews on desktop for
 * keyboard/mouse users; this is silently ignored on touch.
 */

import { audio } from '../modules/audio.js';

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
 * @returns {HTMLButtonElement[]} the rendered buttons in render order
 */
export function renderPhonemeChoiceGrid(container, choices, opts = {}) {
  const {
    onChoose,
    autoPlay        = true,
    autoPlayDelay   = 400,
    autoPlayStride  = 650,
  } = opts;

  container.innerHTML = '<div class="choice-grid choice-grid--phoneme"></div>';
  const grid = container.querySelector('.choice-grid');

  const buttons = choices.map(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn choice-btn--phoneme';
    btn.dataset.correct  = String(!!choice.correct);
    btn.dataset.grapheme = choice.grapheme;
    btn.setAttribute('aria-label', `Sound option. Tap to choose.`);

    const speaker = document.createElement('span');
    speaker.className = 'choice-btn-speaker';
    speaker.textContent = '🔊';
    speaker.setAttribute('aria-hidden', 'true');

    const label = document.createElement('span');
    label.className = 'choice-btn-phoneme';
    label.textContent = `/${choice.grapheme}/`;

    btn.appendChild(speaker);
    btn.appendChild(label);

    btn.addEventListener('mouseenter', () => {
      // Desktop preview — silently no-ops on touch devices.
      audio.speakPhoneme(choice.grapheme, choice.type);
    });
    btn.addEventListener('click', () => {
      if (onChoose) onChoose(choice, btn);
    });

    grid.appendChild(btn);
    return btn;
  });

  if (autoPlay) {
    _previewChoicesInOrder(buttons, choices, autoPlayDelay, autoPlayStride);
  }

  return buttons;
}

/**
 * Play each option's phoneme in sequence with a brief visual highlight on
 * the currently-playing button, so a non-reading child can still distinguish
 * the choices.
 */
function _previewChoicesInOrder(buttons, choices, initialDelay, stride) {
  buttons.forEach((btn, i) => {
    setTimeout(async () => {
      // Skip if the button has already been disabled (child answered before
      // the preview finished).
      if (btn.disabled) return;
      btn.classList.add('previewing');
      try {
        await audio.speakPhoneme(choices[i].grapheme, choices[i].type);
      } catch (_) { /* audio failures are non-fatal */ }
      btn.classList.remove('previewing');
    }, initialDelay + i * stride);
  });
}
