import { describe, it, expect } from 'vitest';
import {
  soundColoredHtml,
  vowelSegments,
  graphemeSounds,
  soundForType,
  SOUND_META,
  VOWEL_LEGEND,
} from '../modules/phonemeColors.js';

/** Collapse coloured output into "letter:sound" tags for easy assertions. */
function tag(word) {
  return soundColoredHtml(word).replace(
    /<span class="vs vs--(\w+)">([^<]*)<\/span>/g,
    (_m, sound, letters) => `[${letters}:${sound}]`,
  );
}

describe('vowel sound classifier', () => {
  it('distinguishes the three jobs of the same letter a', () => {
    expect(tag('cat')).toBe('c[a:short]t'); // short
    expect(tag('cake')).toBe('c[a:long]k[e:silent]'); // long + silent e
    expect(tag('a')).toBe('[a:schwa]'); // schwa (the article)
  });

  it('handles every vowel-sound family', () => {
    expect(tag('car')).toBe('c[ar:rcontrolled]'); // r-controlled
    expect(tag('coin')).toBe('c[oi:diphthong]n'); // sliding
    expect(tag('green')).toBe('gr[ee:long]n'); // long vowel team
    expect(tag('bright')).toBe('br[igh:long]t'); // igh, longest-match
  });

  it('marks the a- schwa prefix and "the"', () => {
    expect(tag('about')).toBe('[a:schwa]b[ou:diphthong]t');
    expect(tag('the')).toBe('th[e:schwa]');
    expect(tag('again')).toBe('[a:schwa]g[ai:long]n');
  });

  it('handles open-syllable long vowels and final y', () => {
    expect(tag('he')).toBe('h[e:long]');
    expect(tag('go')).toBe('g[o:long]');
    expect(tag('my')).toBe('m[y:long]');
  });

  it('respects silent-e irregulars (have, one, there)', () => {
    expect(tag('have')).toBe('h[a:short]v[e:silent]');
    expect(tag('one')).toBe('[o:short]n[e:silent]');
    expect(tag('there')).toBe('th[er:rcontrolled][e:silent]');
  });

  it('marks second-syllable / final schwa (rules)', () => {
    expect(tag('sofa')).toBe('s[o:short]f[a:schwa]'); // final consonant+a
    expect(tag('panda')).toBe('p[a:short]nd[a:schwa]');
    expect(tag('animal')).toBe('[a:short]n[i:short]m[a:schwa]l'); // -al
    expect(tag('total')).toBe('t[o:short]t[a:schwa]l');
  });

  it('silences -le, silent-final-e after teams, and regular -ed', () => {
    expect(tag('little')).toBe('l[i:short]ttl[e:silent]'); // -le
    expect(tag('leave')).toBe('l[ea:long]v[e:silent]'); // team + silent e
    expect(tag('please')).toBe('pl[ea:long]s[e:silent]');
    expect(tag('house')).toBe('h[ou:diphthong]s[e:silent]'); // bank grouped ending, split
    expect(tag('reached')).toBe('r[ea:long]ch[e:silent]d'); // past-tense -ed
    expect(tag('sled')).toBe('sl[e:short]d'); // NOT a suffix — e stays short
  });

  it('applies team exceptions, tolerant of inflections', () => {
    expect(tag('head')).toBe('h[ea:short]d');
    expect(tag('been')).toBe('b[ee:short]n');
    expect(tag('friend')).toBe('fr[ie:short]nd');
    expect(tag('know')).toBe('kn[ow:long]');
    expect(tag('now')).toBe('n[ow:diphthong]'); // stays a diphthong
    expect(tag('slowly')).toBe('sl[ow:long]l[y:long]'); // slow + ly
    expect(tag('showed')).toBe('sh[ow:long][e:silent]d');
    expect(tag('flower')).toBe('fl[ow:diphthong][er:rcontrolled]'); // NOT folded to "flow"
  });

  it('does not colour proper nouns', () => {
    expect(soundColoredHtml('Giri')).toBe('Giri');
    expect(tag('Giri had a hat')).toBe('Giri h[a:short]d [a:schwa] h[a:short]t');
  });

  it('preserves case and passes punctuation/spacing through', () => {
    expect(tag('Cake!')).toBe('C[a:long]k[e:silent]!');
    expect(soundColoredHtml('').length).toBe(0);
    // strip all spans → original text is unchanged
    expect(soundColoredHtml('the cat, sat.').replace(/<[^>]+>/g, '')).toBe('the cat, sat.');
  });

  it('vowelSegments returns null for skip words and sums to word length', () => {
    expect(vowelSegments('Giri')).toBeNull();
    const segs = vowelSegments('cake');
    expect(segs.reduce((n, s) => n + s.len, 0)).toBe(4);
  });
});

describe('shared palette + tile classifier', () => {
  it('every legend entry has a colour in SOUND_META', () => {
    for (const s of VOWEL_LEGEND) {
      expect(SOUND_META[s.key]).toBeTruthy();
      expect(s.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('soundForType maps words.js types to categories', () => {
    expect(soundForType('sv')).toBe('short');
    expect(soundForType('lv')).toBe('long');
    expect(soundForType('rc')).toBe('rcontrolled');
    expect(soundForType('dp')).toBe('diphthong');
    expect(soundForType('se')).toBe('silent');
    expect(soundForType('c')).toBe('consonant');
  });

  it('graphemeSounds colours tiles and overlays schwa', () => {
    // cake: c(consonant) a(long) k(consonant) e(silent)
    expect(graphemeSounds('cake', ['c', 'a', 'k', 'e'], ['c', 'lv', 'c', 'se'])).toEqual([
      'consonant',
      'long',
      'consonant',
      'silent',
    ]);
    // again: the bank types the first a as short, but it is really schwa
    expect(graphemeSounds('again', ['a', 'g', 'ai', 'n'], ['sv', 'c', 'sv', 'c'])[0]).toBe('schwa');
  });
});
