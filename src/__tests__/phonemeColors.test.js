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
    /<span class="vs vs--(\w+)"(?: data-cue="[^"]*")?>([^<]*)<\/span>/g,
    (_m, sound, letters) => `[${letters}:${sound}]`,
  );
}

/** What a browser would report as the element's text, markup stripped. */
const plainText = (html) => html.replace(/<[^>]+>/g, '');

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

  it('gives short and long vowels a printed diacritic', () => {
    expect(soundColoredHtml('cat')).toContain('data-cue="˘"'); // breve
    expect(soundColoredHtml('cake')).toContain('data-cue="¯"'); // macron
  });

  it('marks only short and long, so a page of text stays a page of text', () => {
    // Marking all six was tried: a ∅ over every silent e and a ə over every
    // "the" turned the story into a linguistics transcription. The other four
    // are separated by colours that survive colour-blindness simulation.
    const html = soundColoredHtml('The cake was in the pan for a bird.');
    const cued = [...html.matchAll(/vs--(\w+)" data-cue=/g)].map((m) => m[1]);
    expect(new Set(cued)).toEqual(new Set(['short', 'long']));
    for (const key of ['schwa', 'silent', 'rcontrolled', 'diphthong']) {
      expect(SOUND_META[key].cue, `${key} should not print a diacritic`).toBeUndefined();
    }
  });

  it('never puts the diacritic in the text itself', () => {
    // The story reader reads these nodes back as text in three places — the
    // word tap, the karaoke word-duration fallback and Read to Giri's
    // expected text. A mark rendered as content (rather than by CSS from the
    // attribute) would turn "cat" into "căat" for all three.
    for (const word of ['cat', 'cake', 'about', 'bird', 'coin', 'the']) {
      expect(plainText(soundColoredHtml(word))).toBe(word);
    }
    expect(plainText(soundColoredHtml('The cat sat on a mat.'))).toBe('The cat sat on a mat.');
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

  it('every vowel category has a distinct legend glyph', () => {
    const marks = VOWEL_LEGEND.map((s) => SOUND_META[s.key].mark);
    for (const [i, m] of marks.entries()) {
      expect(m, `${VOWEL_LEGEND[i].key} has no legend glyph`).toBeTruthy();
    }
    expect(new Set(marks).size).toBe(marks.length);
  });

  it('no two vowel colours are confusable under colour blindness', () => {
    // Viénot 1999 dichromat simulation, CIE76 ΔE. Under ~15 two colours stop
    // being tellable apart — which is how the old orange diphthong was
    // caught sitting at ΔE 14.8 from the short-vowel red.
    //
    // The floor is 15 for every pair EXCEPT schwa/silent, which are both
    // deliberately grey (one is "lazy uh", the other is no sound at all) and
    // land at ~18.8. They are separated further by silent letters rendering
    // italic and faded — a second channel, not a colour.
    const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const srgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
    const mul = (m, v) => m.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]);
    const RGB2LMS = [
      [17.8824, 43.5161, 4.11935],
      [3.45565, 27.1554, 3.86714],
      [0.0299566, 0.184309, 1.46709],
    ];
    const LMS2RGB = [
      [0.0809444479, -0.130504409, 0.116721066],
      [-0.0102485335, 0.0540193266, -0.113614708],
      [-0.000365296938, -0.00412161469, 0.693511405],
    ];
    const SIM = {
      deuter: [
        [1, 0, 0],
        [0.494207, 0, 1.24827],
        [0, 0, 1],
      ],
      protan: [
        [0, 2.02344, -2.52581],
        [0, 1, 0],
        [0, 0, 1],
      ],
      tritan: [
        [1, 0, 0],
        [0, 1, 0],
        [-0.395913, 0.801109, 0],
      ],
    };
    const sim = (h, k) =>
      mul(LMS2RGB, mul(SIM[k], mul(RGB2LMS, hex(h).map(lin)))).map((c) =>
        srgb(Math.max(0, Math.min(1, c))),
      );
    const lab = (rgb) => {
      const [r, g, b] = rgb.map((c) => lin(Math.max(0, Math.min(1, c))));
      let X = 0.4124 * r + 0.3576 * g + 0.1805 * b;
      let Y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      let Z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
      [X, Y, Z] = [X / 0.95047, Y, Z / 1.08883].map((t) =>
        t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116,
      );
      return [116 * Y - 16, 500 * (X - Y), 200 * (Y - Z)];
    };
    const dE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));

    const keys = VOWEL_LEGEND.map((s) => s.key);
    for (const kind of Object.keys(SIM)) {
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          const pair = [keys[i], keys[j]].sort().join('/');
          const floor = pair === 'schwa/silent' ? 17 : 15;
          const d = dE(sim(SOUND_META[keys[i]].color, kind), sim(SOUND_META[keys[j]].color, kind));
          expect(d, `${pair} under ${kind} is ΔE ${d.toFixed(1)}`).toBeGreaterThan(floor);
        }
      }
    }
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
