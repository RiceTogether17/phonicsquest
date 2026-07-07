/**
 * JS-driven motion (GSAP wheel spin, canvas-confetti) must honour the
 * reduced-motion preference — CSS media queries can't reach it.
 */
import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { store } from '../src/modules/store.js';
import { prefersReducedMotion } from '../src/utils/motion.js';

beforeAll(() => {
  // wheel.js pulls in audio.js, which touches speechSynthesis at import time.
  const synth = { getVoices: () => [], addEventListener: () => {}, cancel: () => {}, speak: () => {} };
  globalThis.speechSynthesis = globalThis.speechSynthesis || synth;
  if (globalThis.window) window.speechSynthesis = window.speechSynthesis || synth;
});

beforeEach(() => {
  localStorage.clear();
  store.resetStorageKey();
  store.reset();
});

describe('prefersReducedMotion', () => {
  it('is false by default', () => {
    expect(prefersReducedMotion()).toBe(false);
  });

  it('is true when the app setting is on', () => {
    store.set('reducedMotion', true);
    expect(prefersReducedMotion()).toBe(true);
  });

  it('is true when the OS media query matches', () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: true });
    try {
      expect(prefersReducedMotion()).toBe(true);
    } finally {
      window.matchMedia = original;
    }
  });
});

describe('wheel spin under reduced motion', () => {
  it('resolves instantly with a category and announces it', async () => {
    store.set('reducedMotion', true);
    document.body.innerHTML = '<p id="wheel-announcer" aria-live="polite"></p>';

    const { spinWheel } = await import('../src/components/wheel.js');
    const canvas = document.createElement('canvas');
    spinWheel.init(canvas);

    const start = Date.now();
    const key = await spinWheel.spin();
    expect(Date.now() - start).toBeLessThan(500); // no 3.5s tween
    expect(typeof key).toBe('string');
    expect(key.length).toBeGreaterThan(0);
    expect(document.getElementById('wheel-announcer').textContent).toContain('Category:');
    expect(spinWheel.isSpinning).toBe(false);
  });
});

describe('confetti under reduced motion', () => {
  it('skips the canvas-confetti burst entirely', async () => {
    store.set('reducedMotion', true);
    document.body.innerHTML = '<canvas id="confetti-canvas"></canvas>';

    const confettiMock = vi.fn();
    vi.doMock('canvas-confetti', () => ({
      default: { create: vi.fn(() => confettiMock) },
    }));
    const helper = await import('../src/components/confettiHelper.js');

    helper.celebrateCorrect();
    helper.celebrateStreak();
    helper.celebrateDailyGoal();
    expect(confettiMock).not.toHaveBeenCalled();
    vi.doUnmock('canvas-confetti');
  });
});
