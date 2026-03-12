import { describe, it, expect, beforeEach } from 'vitest';
import { settingsController } from '../src/modules/settingsController.js';
import { store } from '../src/modules/store.js';

describe('settings accessibility controls', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="dyslexia-font-toggle" type="checkbox" />
      <input id="high-contrast-toggle" type="checkbox" />
      <input id="bank-chip-scale" type="range" />
      <span id="bank-chip-scale-display"></span>
      <input id="bilingual-toggle" type="checkbox" />
      <input id="reduced-motion-toggle" type="checkbox" />
      <input id="font-size-scale" type="range" />
      <span id="font-size-scale-display"></span>
      <input id="sfx-toggle" type="checkbox" />
      <input id="autoplay-toggle" type="checkbox" />
      <input id="voice-speed" type="range" />
      <span id="voice-speed-display"></span>
      <input id="goal-range" type="range" />
      <span id="goal-range-display"></span>
      <button id="reset-progress-btn"></button>
    `;
    store.reset();
  });

  it('applies persisted chip scale and contrast attrs', () => {
    store.set('bankChipScale', 120);
    store.set('highContrastEnabled', true);
    settingsController.apply(store);
    expect(document.documentElement.style.getPropertyValue('--bank-chip-scale')).toBe('1.2');
    expect(document.documentElement.getAttribute('data-high-contrast')).toBe('true');
  });
});
