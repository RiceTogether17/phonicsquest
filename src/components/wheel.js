/**
 * PhonicsQuest – Spinning Category Wheel
 *
 * A Canvas-based prize wheel that selects a word category.
 * When it lands, letters fly in to build the word (via GSAP).
 */

import gsap from 'gsap';
import { WORD_GROUPS, GROUP_ORDER } from '../data/words.js';
import { audio } from '../modules/audio.js';

/** Which groups are visible on the wheel (subset for cleaner UI) */
const WHEEL_GROUPS = GROUP_ORDER.slice(0, 10); // 10 segments

class SpinWheel {
  constructor() {
    /** @type {HTMLCanvasElement|null} */
    this._canvas = null;
    /** @type {CanvasRenderingContext2D|null} */
    this._ctx = null;
    this._angle = 0;
    this._spinning = false;
    this._segments = [];
    this._onLand = null;
  }

  /**
   * Initialize the wheel.
   * @param {HTMLCanvasElement} canvas
   */
  init(canvas) {
    this._canvas = canvas;
    this._ctx = canvas.getContext('2d');
    this._segments = WHEEL_GROUPS.map(key => ({
      key,
      ...WORD_GROUPS[key],
    }));
    this._draw();
  }

  /**
   * Spin the wheel! Returns a promise that resolves with the selected group key.
   * @returns {Promise<string>}
   */
  spin() {
    if (this._spinning) return Promise.reject('already spinning');
    this._spinning = true;

    return new Promise((resolve) => {
      const targetAngle = this._angle + (Math.random() * 3 + 4) * Math.PI * 2;

      gsap.to(this, {
        _angle: targetAngle,
        duration: 3.5,
        ease: 'power4.out',
        onUpdate: () => {
          this._draw();
          // Tick sound on segment changes
          const segIndex = this._getSelectedIndex();
          if (this._lastSegIndex !== segIndex) {
            this._lastSegIndex = segIndex;
            audio.playSfx('spin');
          }
        },
        onComplete: () => {
          this._spinning = false;
          const idx = this._getSelectedIndex();
          const group = this._segments[idx];
          // Flash the selected segment
          this._flashSegment(idx);
          resolve(group.key);
        },
      });
    });
  }

  /** @returns {boolean} */
  get isSpinning() {
    return this._spinning;
  }

  /** @private */
  _getSelectedIndex() {
    const segAngle = (Math.PI * 2) / this._segments.length;
    // The "pointer" is at the top (12 o'clock position = -π/2)
    const normalizedAngle = ((this._angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    // Which segment is at the pointer?
    const idx = Math.floor(normalizedAngle / segAngle) % this._segments.length;
    return this._segments.length - 1 - idx; // reverse for CW spin
  }

  /** @private */
  _draw() {
    const ctx = this._ctx;
    const canvas = this._canvas;
    if (!ctx || !canvas) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r  = Math.min(cx, cy) - 6;
    const segAngle = (Math.PI * 2) / this._segments.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this._angle);

    // Draw segments
    for (let i = 0; i < this._segments.length; i++) {
      const seg = this._segments[i];
      const startAngle = i * segAngle;
      const endAngle   = startAngle + segAngle;

      // Segment fill
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();

      // Segment border
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.rotate(startAngle + segAngle / 2);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Emoji icon
      ctx.font = '24px sans-serif';
      ctx.fillText(seg.icon, r * 0.58, 0);

      // Text label
      ctx.font = 'bold 10px Nunito, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(seg.label, r * 0.38, 0);

      ctx.restore();
    }

    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw pointer (triangle at top)
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx, 4);
    ctx.lineTo(cx - 10, -4);
    ctx.lineTo(cx + 10, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  /** @private Flash the selected segment briefly */
  _flashSegment(idx) {
    const ctx = this._ctx;
    if (!ctx) return;
    // Simple flash via redraw with highlight
    let count = 0;
    const interval = setInterval(() => {
      count++;
      this._draw();
      if (count >= 4) clearInterval(interval);
    }, 150);
  }
}

/**
 * Animate letters flying into position to spell a word.
 * @param {import('../data/words.js').Word} word
 * @param {HTMLElement} container  the #word-display element
 * @param {Function} [onLetterLand]  callback(index) when each letter lands
 */
export function buildWordAnimation(word, container, onLetterLand) {
  container.innerHTML = '';

  const typeClassMap = {
    c:  'consonant',
    sv: 'short-vowel',
    lv: 'long-vowel',
    d:  'digraph',
    bl: 'blend',
    se: 'silent-e',
    rc: 'r-control',
  };

  const tiles = word.graphemes.map((grapheme, i) => {
    const tile = document.createElement('div');
    tile.className = `letter-tile letter-tile--${typeClassMap[word.types[i]] || 'consonant'}`;
    tile.textContent = grapheme;
    tile.setAttribute('role', 'listitem');
    tile.setAttribute('aria-label', `${grapheme}, ${typeClassMap[word.types[i]] || 'consonant'}`);
    container.appendChild(tile);
    return tile;
  });

  // Animate: letters start offset + invisible, fly in with stagger
  gsap.set(tiles, {
    opacity: 0,
    scale: 0.3,
    y: -60,
    rotation: () => gsap.utils.random(-30, 30),
  });

  gsap.to(tiles, {
    opacity: 1,
    scale: 1,
    y: 0,
    rotation: 0,
    duration: 0.45,
    stagger: 0.12,
    ease: 'back.out(1.7)',
    onComplete: () => {
      tiles.forEach(t => t.classList.add('letter-tile--revealed'));
    },
    onUpdate: function() {
      // Call onLetterLand for each tile that becomes visible
      const progress = this.progress();
      const stagger = 0.12;
      tiles.forEach((_, i) => {
        const tileStart = (i * stagger) / (tiles.length * stagger + 0.45);
        if (progress >= tileStart + 0.3 && !tiles[i].dataset.landed) {
          tiles[i].dataset.landed = 'true';
          onLetterLand?.(i);
        }
      });
    },
  });

  return tiles;
}

export const spinWheel = new SpinWheel();
