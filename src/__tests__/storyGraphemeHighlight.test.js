import { describe, it, expect, vi } from 'vitest';

// storyMode → audio → speechSynthesis: jsdom does not provide it, so the
// module would throw at import time. Install a stub before any import is
// resolved using vi.hoisted().
vi.hoisted(() => {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
});

const { _highlightGraphemes } = await import('../modes/storyMode.js');

// _highlightGraphemes is now a thin gate over the shared phonemeColors
// classifier: when the "Sound colours" scaffold is on (default), it wraps
// each vowel in a span coloured by the SOUND it makes. The colour logic
// itself is covered exhaustively in phonemeColors.test.js — here we only
// check the delegation and that non-letters pass through untouched.

/**
 * Which letters got which sound class, read out of the markup without
 * depending on how the attributes happen to be ordered. Asserting on a raw
 * attribute string is what made these break when the cue letter was added.
 */
function classOf(html, letters) {
  const re = new RegExp(`<span class="vs vs--(\\w+)"[^>]*>${letters}</span>`);
  return html.match(re)?.[1] ?? null;
}

describe('_highlightGraphemes (sound-colour scaffold)', () => {
  it('returns empty input untouched', () => {
    expect(_highlightGraphemes('')).toBe('');
  });

  it('colours a short vowel', () => {
    expect(classOf(_highlightGraphemes('cat'), 'a')).toBe('short');
  });

  it('colours a long vowel and its silent e', () => {
    const out = _highlightGraphemes('cake');
    expect(classOf(out, 'a')).toBe('long');
    expect(classOf(out, 'e')).toBe('silent');
  });

  it('marks the article "a" as a heart word', () => {
    // On its own, a says /uh/ — a sound no rule has taught the letter yet.
    expect(classOf(_highlightGraphemes('a'), 'a')).toBe('heart');
  });

  it('leaves consonants and spacing intact', () => {
    const out = _highlightGraphemes('the cat sat');
    expect(classOf(out, 'e')).toBe('heart'); // the heart part of "the"
    expect(out.replace(/<[^>]+>/g, '')).toBe('the cat sat'); // strip spans → original text
  });

  it('carries the diacritic through, so colour is never the only channel', () => {
    // A child who cannot tell the short red from the long green still has the
    // breve and the macron printed above the vowel.
    expect(_highlightGraphemes('cat')).toContain('data-cue="˘"');
    expect(_highlightGraphemes('cake')).toContain('data-cue="¯"');
  });
});
