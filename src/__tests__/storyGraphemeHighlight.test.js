import { describe, it, expect, beforeEach, vi } from 'vitest';

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

// The grapheme highlighter wraps target-sound substrings with band-specific
// spans so beginning readers can lock onto the new pattern. Behaviour:
//   - Single vowels match everywhere ('a' in 'had', 'a' in 'sat', etc.)
//   - Digraphs (longest first) match greedily
//   - Split digraphs (a_e, i_e, …) only match at vowel-consonant-e word boundary
//   - Returns text unchanged when scaffold is disabled

describe('_highlightGraphemes', () => {
  beforeEach(() => {
    // Default: scaffold preference enabled. Stored under the module's pref key.
    localStorage.setItem('giri_show_graphemes', 'true');
  });

  it('returns text unchanged for empty inputs / missing band / no graphemes', () => {
    expect(_highlightGraphemes('hat', [], 'A')).toBe('hat');
    expect(_highlightGraphemes('hat', ['a'], '')).toBe('hat');
    expect(_highlightGraphemes('', ['a'], 'A')).toBe('');
    expect(_highlightGraphemes('hat', null, 'A')).toBe('hat');
  });

  it('wraps every short-a in Band A red span', () => {
    const out = _highlightGraphemes('Giri had a hat', ['a'], 'A');
    // Three lowercase a's get wrapped (Giri has no lowercase a; "had", "a", "hat")
    const matches = out.match(/gph--A gph-vowel">a</g) || [];
    expect(matches.length).toBe(3);
    expect(out).toContain('class="gph gph--A gph-vowel">a</span>');
  });

  it('wraps digraphs greedily and skips internal repeats', () => {
    const out = _highlightGraphemes('green sea', ['ee', 'ea'], 'B');
    expect(out).toContain('gph--B gph-digraph">ee<');
    expect(out).toContain('gph--B gph-digraph">ea<');
    // Should not double-wrap or wrap the individual letters again
    expect(out.match(/gph--B gph-vowel/g)).toBeNull();
  });

  it('handles split digraphs (a_e) by wrapping vowel + silent e separately', () => {
    const out = _highlightGraphemes('cake', ['a_e'], 'B');
    expect(out).toContain('gph--B gph-vowel">a</span>');
    expect(out).toContain('k');           // middle consonant untouched
    expect(out).toContain('gph--B gph-silent">e</span>');
  });

  it('does NOT treat "ate" inside "plate" as a split digraph at word end', () => {
    // 'plate' is V-C-e at word boundary → split digraph match
    const out = _highlightGraphemes('plate', ['a_e'], 'B');
    expect(out).toContain('gph--B gph-vowel">a</span>');
    expect(out).toContain('gph--B gph-silent">e</span>');
  });

  it('does NOT wrap "a" + "te" inside "later" as a split digraph (consonant follows e)', () => {
    // 'later' — a-t-e but 'r' follows, so this is NOT a CVCe pattern. The 'a'
    // should NOT be wrapped as a split-vowel. (The helper falls through to
    // the single-vowel pattern only if 'a' is also in the grapheme list.)
    const out = _highlightGraphemes('later', ['a_e'], 'B');
    expect(out).not.toContain('gph-silent');
    // 'a' is not in the grapheme list, so it should also not be wrapped
    expect(out).not.toContain('gph-vowel');
  });

  it('prefers longer digraphs over shorter (igh before single i)', () => {
    const out = _highlightGraphemes('bright', ['i_e', 'igh'], 'B');
    expect(out).toContain('gph--B gph-digraph">igh</span>');
    // i is wrapped only as part of "igh", not as a standalone vowel
    expect(out).not.toMatch(/gph-vowel">i</);
  });

  it('preserves case in the wrapped span', () => {
    const out = _highlightGraphemes('Aa', ['a'], 'A');
    expect(out).toContain('>A<');
    expect(out).toContain('>a<');
  });

  it('returns input unchanged when no targets supplied', () => {
    expect(_highlightGraphemes('Giri had a hat', [], 'A')).toBe('Giri had a hat');
    expect(_highlightGraphemes('Giri had a hat', null, 'A')).toBe('Giri had a hat');
  });
});
