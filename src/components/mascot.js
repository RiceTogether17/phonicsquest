/**
 * PhonicsQuest – Giri the Mascot
 *
 * Uses the uploaded Giri character PNGs for different emotional states.
 * Placed in key positions: header (mini), home hero, floating, result screen.
 */

const BASE = import.meta.env.BASE_URL;

/** Mascot image paths keyed by emotional state */
const STATES = {
  neutral:    `${BASE}images/mascot/giri-neutral.png`,
  celebrate:  `${BASE}images/mascot/giri-celebrate.png`,
  confetti:   `${BASE}images/mascot/giri-celebrate-confetti.png`,
  clap:       `${BASE}images/mascot/giri-clap-frame.png`,
  encourage:  `${BASE}images/mascot/giri-encourage.png`,
  holdCard:   `${BASE}images/mascot/giri-hold-card.png`,
  pointLeft:  `${BASE}images/mascot/giri-point-left.png`,
  pointRight: `${BASE}images/mascot/giri-point-right.png`,
  thinking:   `${BASE}images/mascot/giri-thinking.png`,
  trophy:     `${BASE}images/mascot/giri-trophy.png`,
  whiteboard: `${BASE}images/mascot/giri-whiteboard.png`,
};

/** Random encouraging phrases */
const CHEERS = [
  'You\'re doing great!', 'Amazing!', 'Keep going!', 'Super reader!',
  'You rock!', 'Fantastic!', 'Way to go!', 'Brilliant!', 'Wow!',
  'You\'re a star!', 'Nice work!', 'So proud of you!',
];

const WRONG_ENCOURAGEMENT = [
  'Almost there!', 'Try again!', 'You can do it!',
  'Keep trying!', 'So close!', 'Let\'s try once more!',
];

class Mascot {
  constructor() {
    /** @type {string} current state */
    this._state = 'neutral';
    this._preloaded = false;
  }

  /** Preload all mascot images for instant transitions */
  preload() {
    if (this._preloaded) return;
    for (const src of Object.values(STATES)) {
      const img = new Image();
      img.src = src;
    }
    this._preloaded = true;
  }

  /** Initialize all mascot positions with default state */
  init() {
    this.preload();
    this._render('mascot-mini', 'neutral', 28);
    this._render('mascot-home', 'holdCard', 100);
    this._render('mascot', 'neutral', 80);
  }

  /**
   * Set the mascot to a given emotional state across all positions.
   * @param {'neutral'|'celebrate'|'confetti'|'clap'|'encourage'|'holdCard'|'pointLeft'|'pointRight'|'thinking'|'trophy'|'whiteboard'} state
   */
  setState(state) {
    if (!STATES[state]) return;
    this._state = state;

    this._render('mascot', state, 80);
    this._render('mascot-mini', state === 'neutral' ? 'neutral' : state, 28);
  }

  /** Show mascot in home hero */
  setHomeState(state = 'holdCard') {
    this._render('mascot-home', state, 100);
  }

  /** Show mascot in result screen */
  setResultState(state = 'celebrate') {
    this._render('result-mascot', state, 140);
  }

  /**
   * Trigger a celebration sequence (correct answer).
   * @param {boolean} isLevelUp
   */
  celebrate(isLevelUp = false) {
    const state = isLevelUp ? 'trophy' : 'celebrate';
    this.setState(state);

    // Float the mascot up
    const el = document.getElementById('mascot');
    if (el) {
      el.classList.add('celebrate');
      setTimeout(() => el.classList.remove('celebrate'), 2000);
    }
  }

  /** Trigger the encouraging sequence (wrong answer) */
  encourage() {
    this.setState('encourage');

    const el = document.getElementById('mascot');
    if (el) {
      el.classList.add('peek');
      setTimeout(() => {
        el.classList.remove('peek');
        this.setState('neutral');
      }, 2500);
    }
  }

  /** Show thinking state (during phoneme reveal / timer) */
  think() {
    this.setState('thinking');
  }

  /** Show pointing state (for instructions) */
  point(direction = 'right') {
    this.setState(direction === 'left' ? 'pointLeft' : 'pointRight');
  }

  /** Show clapping (for streaks) */
  clap() {
    this.setState('clap');
    setTimeout(() => this.setState('neutral'), 2000);
  }

  /** Get a random cheer message */
  getCheer() {
    return CHEERS[Math.floor(Math.random() * CHEERS.length)];
  }

  /** Get a random encouragement message (for wrong answers) */
  getEncouragement() {
    return WRONG_ENCOURAGEMENT[Math.floor(Math.random() * WRONG_ENCOURAGEMENT.length)];
  }

  /**
   * @private Render mascot image into a container.
   * @param {string} containerId
   * @param {string} state
   * @param {number} size  pixel size
   */
  _render(containerId, state, size) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const src = STATES[state] || STATES.neutral;

    // Reuse existing img or create new one
    let img = container.querySelector('img');
    if (!img) {
      img = document.createElement('img');
      img.alt = 'Giri the mascot';
      img.draggable = false;
      img.style.cssText = `width:${size}px; height:${size}px; object-fit:contain; user-select:none; pointer-events:none;`;
      container.innerHTML = '';
      container.appendChild(img);
    }

    img.src = src;
    img.style.width  = `${size}px`;
    img.style.height = `${size}px`;
  }
}

export const mascot = new Mascot();
