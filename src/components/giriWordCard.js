/**
 * PhonicsQuest – Giri word card
 *
 * Presents a word's picture as a little scene: Giri holding it up, pointing
 * at it, thinking about it, or celebrating it. Giri is otherwise only ever
 * seen in celebrations and result screens — this puts the mascot inside the
 * learning loop, where the child actually spends their time.
 *
 * Every one of the 1,080 words gets a scene, because the subject of the
 * scene is the word's own `emoji` (all 1,080 have one) rather than a
 * bespoke illustration. That means no new assets, no bundle cost, and
 * complete coverage — including any word added to the bank later.
 *
 * Pose is chosen by *context*, not by word, so the same card reads
 * differently across a session: Giri holds a word up when it's introduced,
 * thinks about it while the child works, and celebrates when it's solved.
 *
 * Composition is DOM + CSS rather than SVG: the subject is a text emoji and
 * Giri is an existing PNG, so there is nothing to draw — DOM gives correct
 * emoji shaping, real accessibility semantics and theme inheritance, which
 * an SVG wrapper would only get in the way of.
 *
 * Accessibility: the picture keeps the same contract renderWordImage()
 * established — role="img" with "Picture of {word}" — and Giri is marked
 * decorative, so a screen-reader user hears the word's picture once, not a
 * description of the mascot.
 */

import { STATES } from './mascot.js';

/**
 * Context → Giri pose. Keys are what the *mode* is doing, so call sites read
 * as intent ('present this word') rather than as art direction.
 */
export const CARD_POSES = Object.freeze({
  present:   STATES.holdCard,    // introducing the word
  think:     STATES.thinking,    // child is working on it
  point:     STATES.pointRight,  // drawing attention to the sound track
  encourage: STATES.encourage,   // after a retry
  celebrate: STATES.celebrate,   // solved
});

/** Poses that should not animate in (celebration handles its own motion). */
const DEFAULT_POSE = 'present';

/**
 * @typedef {object} GiriWordCardOpts
 * @property {keyof typeof CARD_POSES} [pose]
 * @property {boolean} [showEmoji]   hide the picture for listening-first modes
 * @property {string}  [caption]     optional line under the card
 */

/**
 * Render the Giri word card into `host`.
 *
 * @param {import('../data/words.js').Word} word
 * @param {HTMLElement} host
 * @param {GiriWordCardOpts} [opts]
 */
export function renderGiriWordCard(word, host, opts = {}) {
  if (!host) return;
  host.innerHTML = '';
  if (!word) return;

  const { pose = DEFAULT_POSE, showEmoji = true, caption = '' } = opts;
  const poseSrc = CARD_POSES[pose] || CARD_POSES[DEFAULT_POSE];

  host.className = 'giri-word-card';
  host.dataset.pose = pose;

  // Giri: decorative. The picture below carries the meaning, and describing
  // the mascot on every word would be noise for a screen-reader user.
  const giri = document.createElement('img');
  giri.className = 'giri-word-card__giri';
  giri.src = poseSrc;
  giri.alt = '';
  giri.setAttribute('aria-hidden', 'true');
  giri.setAttribute('decoding', 'async');
  // A missing pose file must never leave a broken-image icon in a child's
  // lesson — drop Giri and let the picture stand alone.
  giri.addEventListener('error', () => giri.remove());
  host.appendChild(giri);

  const frame = document.createElement('div');
  frame.className = 'giri-word-card__frame';

  if (showEmoji) {
    const picture = document.createElement('span');
    picture.className = 'giri-word-card__picture';
    picture.textContent = word.emoji || '';
    picture.setAttribute('role', 'img');
    picture.setAttribute('aria-label', `Picture of ${word.word}`);
    frame.appendChild(picture);
  } else {
    // Listening-first modes (First Sound, Oral Blend) deliberately withhold
    // the picture so the child works from sound alone.
    const hidden = document.createElement('span');
    hidden.className = 'giri-word-card__picture giri-word-card__picture--hidden';
    hidden.textContent = '?';
    hidden.setAttribute('aria-hidden', 'true');
    frame.appendChild(hidden);
  }

  host.appendChild(frame);

  if (caption) {
    const cap = document.createElement('p');
    cap.className = 'giri-word-card__caption';
    cap.textContent = caption;
    frame.appendChild(cap);
  }
}

/**
 * Swap Giri's pose without rebuilding the card, so the picture doesn't flash
 * mid-interaction.
 * @param {HTMLElement} host
 * @param {keyof typeof CARD_POSES} pose
 */
export function setGiriPose(host, pose) {
  if (!host) return;
  const img = host.querySelector('.giri-word-card__giri');
  const src = CARD_POSES[pose];
  if (!img || !src) return;
  img.src = src;
  host.dataset.pose = pose;
}
