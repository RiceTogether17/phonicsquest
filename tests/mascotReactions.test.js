import { beforeEach, describe, expect, it, vi } from 'vitest';
import { mascot } from '../src/components/mascot.js';

/**
 * The floating mascot is hidden — it overlapped tappable content at every
 * viewport width, because `--shell-max` is 94–96vw and the "gutter" its
 * anchoring maths assumed never exists. Giri's reactions therefore have to
 * reach the header copy, which is in flow and covers nothing.
 */

beforeEach(() => {
  vi.useFakeTimers();
  document.body.innerHTML = `
    <div id="mascot"></div>
    <div id="mascot-mini"></div>`;
});

describe('mascot reactions', () => {
  it('cheers on both the header and the float', () => {
    mascot.celebrate();

    expect(document.getElementById('mascot-mini').classList.contains('celebrate')).toBe(true);
    expect(document.getElementById('mascot').classList.contains('celebrate')).toBe(true);
  });

  it('nudges the header when encouraging after a wrong answer', () => {
    mascot.encourage();

    expect(document.getElementById('mascot-mini').classList.contains('peek')).toBe(true);
    expect(document.getElementById('mascot').classList.contains('peek')).toBe(true);
  });

  it('clears the reaction class afterwards', () => {
    mascot.celebrate();
    vi.advanceTimersByTime(2500);

    expect(document.getElementById('mascot-mini').classList.contains('celebrate')).toBe(false);
    expect(document.getElementById('mascot').classList.contains('celebrate')).toBe(false);
  });

  it('returns to neutral after encouraging', () => {
    mascot.encourage();
    vi.advanceTimersByTime(3000);

    expect(document.getElementById('mascot-mini').classList.contains('peek')).toBe(false);
  });

  it('survives a missing float element', () => {
    document.body.innerHTML = '<div id="mascot-mini"></div>';

    expect(() => mascot.celebrate()).not.toThrow();
    expect(document.getElementById('mascot-mini').classList.contains('celebrate')).toBe(true);
  });
});
