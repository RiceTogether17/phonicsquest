import { describe, it, expect } from 'vitest';
import { deriveGraphemes, expandBlends } from '../modules/deriveGraphemes.js';
import { WORDS } from '../data/words.js';

const split = (w) => deriveGraphemes(w)?.graphemes.join('·');

describe('splitting a word the bank does not hold', () => {
  it('keeps consonant digraphs together', () => {
    expect(split('ship')).toBe('sh·i·p');
    expect(split('chin')).toBe('ch·i·n');
    expect(split('back')).toBe('b·a·ck');
    expect(split('ring')).toBe('r·i·ng');
    expect(split('phone')).toBe('ph·o·n·e');
  });

  it('keeps qu together, where the u is not a vowel sound at all', () => {
    expect(split('quick')).toBe('qu·i·ck');
    expect(split('quilt')).toBe('qu·i·l·t');
  });

  it('separates a blend, because a blend is two sounds', () => {
    // The app's own rule: a digraph is one sound, a blend is two you can
    // hear separately. A ladder is where that distinction does the work.
    expect(split('stamp')).toBe('s·t·a·m·p');
    expect(split('clap')).toBe('c·l·a·p');
  });

  it('keeps a doubled consonant together', () => {
    expect(split('hill')).toBe('h·i·ll');
    expect(split('mess')).toBe('m·e·ss');
  });

  it('reads a suffix as one chunk', () => {
    expect(split('jumping')).toBe('j·u·m·p·-ing');
    expect(split('landed')).toBe('l·a·n·d·-ed');
    expect(split('quickly')).toBe('qu·i·ck·-ly');
  });

  it('does not find a suffix that is not there', () => {
    // Without the stem guards these read as sh+-ed, se+-ed and cr+-est —
    // each of which would teach a child a grapheme their word does not have.
    expect(split('shed')).toBe('sh·e·d');
    expect(split('seed')).toBe('s·ee·d');
    expect(split('crest')).toBe('c·r·e·s·t');
    expect(split('bed')).toBe('b·e·d');
  });

  it('does not call n + soft g a /ng/ digraph', () => {
    // "change" is n plus a soft g; sounding it with the /ŋ/ of "ring" is
    // simply the wrong sound.
    expect(split('change')).toBe('ch·a·n·g·e');
    expect(split('hinge')).toBe('h·i·n·g·e');
    // …but a real /ŋ/ still holds together.
    expect(split('rang')).toBe('r·a·ng');
    expect(split('long')).toBe('l·o·ng');
  });

  it('keeps the e silent when a magic-e word is made plural', () => {
    // The vowel classifier only recognises a silent e at the end of a word,
    // so "cakes" came out with the e sounding — a ladder rung saying /e/ in
    // a word where that letter is silent.
    const { graphemes, types } = deriveGraphemes('cakes');
    expect(graphemes).toEqual(['c', 'a', 'k', 'e', 's']);
    expect(types[3]).toBe('se');
    expect(types[4]).toBe('c');
  });

  it('does not mistake an ordinary final s for a plural', () => {
    // The rule fires only on a magic-e stem, so these are untouched.
    expect(split('glass')).toBe('g·l·a·ss');
    expect(split('this')).toBe('th·i·s');
    expect(split('bus')).toBe('b·u·s');
  });

  it('marks silent letters so the ladder skips them', () => {
    const { graphemes, types } = deriveGraphemes('cake');
    expect(graphemes).toEqual(['c', 'a', 'k', 'e']);
    expect(types[3]).toBe('se');
  });

  it('returns null rather than guessing at a proper noun or empty input', () => {
    expect(deriveGraphemes('Giri')).toBeNull();
    expect(deriveGraphemes('')).toBeNull();
    expect(deriveGraphemes('   ')).toBeNull();
    expect(deriveGraphemes(null)).toBeNull();
  });

  it('never shows a letter the word does not contain', () => {
    // The one guarantee that matters most: whatever the split gets wrong,
    // the tiles a child sees must spell their word.
    for (const w of ['cakes', 'walked', 'small', 'shrink', 'through', 'strength', 'quickly']) {
      const out = deriveGraphemes(w);
      expect(out.graphemes.join('').replace(/-/g, ''), w).toBe(w);
      expect(out.types).toHaveLength(out.graphemes.length);
    }
  });
});

describe('expandBlends', () => {
  it('opens a bank blend tile into its sounds', () => {
    expect(expandBlends(['st', 'ay'], ['bl', 'lv']).graphemes).toEqual(['s', 't', 'ay']);
    expect(expandBlends(['str', 'ea', 'm'], ['bl', 'lv', 'c']).graphemes).toEqual([
      's',
      't',
      'r',
      'ea',
      'm',
    ]);
  });

  it('leaves digraph tiles alone — those really are one sound', () => {
    const out = expandBlends(['sh', 'i', 'p'], ['d', 'sv', 'c']);
    expect(out.graphemes).toEqual(['sh', 'i', 'p']);
    expect(out.types).toEqual(['d', 'sv', 'c']);
  });
});

describe('measured against the curated bank', () => {
  const bankWords = WORDS.filter((w) => w.graphemes?.length);

  /** How often the derived split matches the bank, blends expanded on both. */
  function score() {
    let compared = 0;
    let agreed = 0;
    for (const w of bankWords) {
      const got = deriveGraphemes(w.word);
      if (!got) continue;
      compared++;
      const want = expandBlends(w.graphemes, w.types).graphemes;
      if (got.graphemes.join('|') === want.join('|')) agreed++;
    }
    return { compared, agreed, pct: (100 * agreed) / compared };
  }

  it('rebuilds every bank word exactly', () => {
    // This is the guarantee, not the agreement rate: the split may group
    // letters differently from a curator, but it must never invent or drop
    // one. A child seeing a letter their word does not have is a teaching
    // error; a coarser grouping is a judgement call.
    const failures = [];
    for (const w of bankWords) {
      const got = deriveGraphemes(w.word);
      if (!got) continue;
      const rebuilt = got.graphemes.join('').replace(/-/g, '');
      if (rebuilt !== w.word.toLowerCase().replace(/[^a-z]/g, '')) failures.push(w.word);
    }
    expect(failures).toEqual([]);
  });

  it('agrees with the curated split on at least 95% of bank words', () => {
    const { compared, pct } = score();
    expect(compared).toBeGreaterThan(1000);
    // Measured at 95.2% when written. The floor is here so a change that
    // makes the split worse fails rather than quietly teaching the wrong
    // thing; raise it if the split improves.
    expect(pct, `agreement is ${pct.toFixed(1)}%`).toBeGreaterThanOrEqual(95);
  });

  it('covers the story words the bank does not', () => {
    // The whole reason this module exists: without it the blend ladder
    // would appear on one tap in three.
    const bank = new Set(WORDS.map((w) => w.word.toLowerCase()));
    const outside = ['cakes', 'walked', 'small', 'stayed', 'looked', 'baking'];
    for (const w of outside) {
      expect(bank.has(w), `${w} is in the bank — pick another example`).toBe(false);
      expect(deriveGraphemes(w), w).not.toBeNull();
    }
  });
});
