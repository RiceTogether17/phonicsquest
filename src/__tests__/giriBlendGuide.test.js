/**
 * Giri blending guide.
 *
 * Rides on top of blend.js's cumulative sweep to make "sounds gathering up
 * left to right" visible rather than audio-only. Two things must hold:
 * it is purely decorative (never announced, never blocking), and it obeys
 * the reduced-motion preference — a travelling mascot is exactly the kind
 * of motion a child with vestibular sensitivity has turned off.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

/** A phoneme row with `n` tiles, laid out so geometry maths has something to read. */
function mountRow(n = 3) {
  document.body.innerHTML = '<div class="phoneme-row" id="phoneme-row"></div>';
  const row = document.getElementById('phoneme-row');
  for (let i = 0; i < n; i++) {
    const tile = document.createElement('div');
    tile.className = 'phoneme-tile';
    row.appendChild(tile);
  }
  // jsdom has no layout, so stub the boxes the guide measures.
  row.getBoundingClientRect = () => ({ left: 0, width: 300, top: 0, height: 60 });
  row.querySelectorAll('.phoneme-tile').forEach((t, i) => {
    t.getBoundingClientRect = () => ({ left: i * 100, width: 100, top: 0, height: 60 });
  });
  return row;
}

let guideMod;
beforeEach(async () => {
  stubAudioGlobals();
  localStorage.clear();
  vi.resetModules();
  guideMod = await import('../components/giriBlendGuide.js');
});

describe('mounting', () => {
  it('attaches a guide and marks the row as its positioning context', () => {
    const row = mountRow();
    const guide = guideMod.mountBlendGuide(row);

    expect(guide).toBeTruthy();
    expect(row.querySelector('.giri-blend-guide')).toBe(guide);
    expect(row.classList.contains('phoneme-row--guided')).toBe(true);
  });

  it('never attaches two guides', () => {
    const row = mountRow();
    guideMod.mountBlendGuide(row);
    guideMod.mountBlendGuide(row);
    expect(row.querySelectorAll('.giri-blend-guide').length).toBe(1);
  });

  it('unmount removes the guide and the positioning class', () => {
    const row = mountRow();
    guideMod.mountBlendGuide(row);
    guideMod.unmountBlendGuide(row);

    expect(row.querySelector('.giri-blend-guide')).toBeNull();
    expect(row.classList.contains('phoneme-row--guided')).toBe(false);
  });

  it('is a no-op without a row', () => {
    expect(guideMod.mountBlendGuide(null)).toBeNull();
    expect(() => guideMod.unmountBlendGuide(null)).not.toThrow();
  });

  it('removes itself if the mascot image fails to load', () => {
    const row = mountRow();
    const guide = guideMod.mountBlendGuide(row);
    guide.dispatchEvent(new Event('error'));
    expect(row.querySelector('.giri-blend-guide')).toBeNull();
  });
});

describe('movement', () => {
  it('centres the guide over the requested tile', () => {
    const row = mountRow(3);
    guideMod.mountBlendGuide(row);
    guideMod.moveGuideTo(row, 1);

    // Tile 1 spans 100–200, so its centre is 150.
    const guide = row.querySelector('.giri-blend-guide');
    expect(guide.style.transform).toContain('translateX(150px)');
  });

  it('faces forward mid-word and settles at the end', () => {
    const row = mountRow(3);
    guideMod.mountBlendGuide(row);

    guideMod.moveGuideTo(row, 0);
    expect(row.querySelector('.giri-blend-guide').src).toContain('point-right');

    guideMod.moveGuideTo(row, 2);
    expect(row.querySelector('.giri-blend-guide').src).toContain('hold-card');
  });

  it('celebrates over the middle of the track on the final blend', () => {
    const row = mountRow(3);
    guideMod.mountBlendGuide(row);
    guideMod.celebrateGuide(row);

    const guide = row.querySelector('.giri-blend-guide');
    expect(guide.src).toContain('celebrate');
    expect(guide.style.transform).toContain('translateX(150px)');
  });

  it('ignores an out-of-range tile rather than throwing', () => {
    const row = mountRow(3);
    guideMod.mountBlendGuide(row);
    expect(() => guideMod.moveGuideTo(row, 99)).not.toThrow();
  });

  it('does nothing when no guide is mounted', () => {
    const row = mountRow(3);
    expect(() => guideMod.moveGuideTo(row, 0)).not.toThrow();
    expect(() => guideMod.celebrateGuide(row)).not.toThrow();
  });

  it('celebrateGuide is safe on an empty row', () => {
    document.body.innerHTML = '<div id="phoneme-row"></div>';
    const row = document.getElementById('phoneme-row');
    expect(() => guideMod.celebrateGuide(row)).not.toThrow();
  });
});

describe('reduced motion', () => {
  it('disables the travel transition when the app setting is on', async () => {
    const { store } = await import('../modules/store.js');
    store.set('reducedMotion', true);

    const row = mountRow(3);
    guideMod.mountBlendGuide(row);
    guideMod.moveGuideTo(row, 2);

    const guide = row.querySelector('.giri-blend-guide');
    expect(guide.style.transition).toBe('none');
    // It still ends up in the right place — only the travel is skipped.
    expect(guide.style.transform).toContain('translateX(250px)');
  });

  it('animates normally when reduced motion is off', () => {
    const row = mountRow(3);
    guideMod.mountBlendGuide(row);
    guideMod.moveGuideTo(row, 1);
    expect(row.querySelector('.giri-blend-guide').style.transition).toBe('');
  });
});

describe('accessibility', () => {
  it('is decorative — never announced and never focusable', () => {
    const row = mountRow();
    const guide = guideMod.mountBlendGuide(row);

    expect(guide.getAttribute('aria-hidden')).toBe('true');
    expect(guide.getAttribute('alt')).toBe('');
    expect(guide.hasAttribute('tabindex')).toBe(false);
  });
});
