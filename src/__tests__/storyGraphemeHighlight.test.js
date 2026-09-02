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

describe('_highlightGraphemes (sound-colour scaffold)', () => {
  it('returns empty input untouched', () => {
    expect(_highlightGraphemes('')).toBe('');
  });

  it('colours a short vowel', () => {
    expect(_highlightGraphemes('cat')).toContain('vs--short">a</span>');
  });

  it('colours a long vowel and its silent e', () => {
    const out = _highlightGraphemes('cake');
    expect(out).toContain('vs--long">a</span>');
    expect(out).toContain('vs--silent">e</span>');
  });

  it('marks the article "a" as schwa', () => {
    expect(_highlightGraphemes('a')).toContain('vs--schwa">a</span>');
  });

  it('leaves consonants and spacing intact', () => {
    const out = _highlightGraphemes('the cat sat');
    expect(out).toContain('vs--schwa">e</span>'); // schwa e in "the"
    expect(out.replace(/<[^>]+>/g, '')).toBe('the cat sat'); // strip spans → original text
  });
});
