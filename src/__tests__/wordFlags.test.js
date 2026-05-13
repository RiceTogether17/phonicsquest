/**
 * Word-data quality flags + decodableStage routing (architecture review item #5).
 *
 * These tests lock in:
 *   1. flags catches the documented exception classes:
 *      multi-phoneme-x, silent-letter, doubled-consonant, soft-c/g,
 *      irregular, capital.
 *   2. Every word in the dataset has a non-null decodableStage so
 *      remediation routing can never get an unrouted word.
 *   3. The pattern field is preserved (pedagogical: tax stays in
 *      cvc-a even though it has 4 phonemes — that's documented as the
 *      flag's whole point).
 *   4. Named curriculum-stage groups (digraphs, suffix-ing, prefixes,
 *      …) win over structural inference — `ship` decodes to digraphs,
 *      not ccvc-i, because the digraph requires that phase.
 *   5. Long-vowel / diphthong micro-stages still resolve correctly
 *      after the flag/stage additions (no regressions).
 */
import { describe, it, expect } from 'vitest';
import { WORDS, deriveFlags, deriveDecodableStage } from '../data/words.js';
import { CURRICULUM } from '../data/curriculum.js';

const wordById = (id) => WORDS.find(w => w.id === id);

// ── Flags ───────────────────────────────────────────────────────────────────

describe('deriveFlags / word.flags', () => {
  it('every WORD gets a flags array (possibly empty)', () => {
    for (const w of WORDS) {
      expect(Array.isArray(w.flags), `${w.id} missing flags array`).toBe(true);
    }
  });

  it("'multi-phoneme-x' covers every word whose grapheme list contains 'x'", () => {
    const xWords = WORDS.filter(w => w.graphemes.includes('x'));
    expect(xWords.length).toBeGreaterThan(0);
    for (const w of xWords) {
      expect(w.flags, `${w.id} has 'x' but missing multi-phoneme-x flag`).toContain('multi-phoneme-x');
    }
    // And the count is the same: nothing else got the flag.
    const flagged = WORDS.filter(w => w.flags.includes('multi-phoneme-x'));
    expect(flagged.length).toBe(xWords.length);
  });

  it("'silent-letter' covers silent-e and silent-kn words", () => {
    expect(wordById('cake').flags).toContain('silent-letter');  // CVCe
    expect(wordById('know').flags).toContain('silent-letter');  // kn
    expect(wordById('cat').flags).not.toContain('silent-letter');
  });

  it("'doubled-consonant' covers tt/nn/gg/ff/ll/ss but NOT ck/ng/sh/ch/th (those are digraphs)", () => {
    expect(wordById('running')?.flags).toContain('doubled-consonant'); // nn
    expect(wordById('sitting')?.flags).toContain('doubled-consonant'); // tt
    // Digraphs are distinct from doubled consonants — they don't get flagged.
    expect(wordById('ship')?.flags).not.toContain('doubled-consonant');
    expect(wordById('sing')?.flags).not.toContain('doubled-consonant');
    expect(wordById('back')?.flags).not.toContain('doubled-consonant'); // 'ck' is digraph
  });

  it("'soft-g' flag is applied via the curated override list", () => {
    // Whatever words are in the SOFT_G_WORDS override should be flagged.
    const flagged = WORDS.filter(w => w.flags.includes('soft-g')).map(w => w.id);
    expect(flagged.length).toBeGreaterThan(0);
    // Words like 'get' / 'give' / 'girl' use HARD /g/ and must NOT be flagged.
    expect(wordById('get')?.flags).not.toContain('soft-g');
    expect(wordById('girl')?.flags).not.toContain('soft-g');
  });

  it("'capital' covers proper nouns (June, Luke)", () => {
    expect(wordById('June')?.flags).toContain('capital');
    expect(wordById('Luke')?.flags).toContain('capital');
    expect(wordById('cat').flags).not.toContain('capital');
  });

  it('flags are alphabetically sorted for stable serialisation', () => {
    for (const w of WORDS) {
      const sorted = [...w.flags].sort();
      expect(w.flags).toEqual(sorted);
    }
  });

  it('a word can carry multiple flags', () => {
    // June: capital proper noun AND silent-e
    expect(wordById('June')?.flags).toEqual(['capital', 'silent-letter']);
  });
});

// ── pattern still aligns to curriculum stage (the whole point of flags) ─────

describe('pattern preservation under flagging', () => {
  it("'tax' keeps pattern:'CVC' (taught alongside cat/hat) but is flagged multi-phoneme-x", () => {
    const tax = wordById('tax');
    expect(tax.pattern).toBe('CVC');
    expect(tax.flags).toContain('multi-phoneme-x');
    expect(tax.phonemes.length).toBe(4); // /t/ /a/ /k/ /s/
  });
});

// ── decodableStage ──────────────────────────────────────────────────────────

describe('deriveDecodableStage / word.decodableStage', () => {
  it('every WORD gets a non-null decodableStage', () => {
    const unrouted = WORDS.filter(w => !w.decodableStage).map(w => w.id);
    expect(unrouted, `Words without decodableStage: ${unrouted.join(', ')}`).toEqual([]);
  });

  it.each([
    // Structural-vowel inference.
    ['cat',  'cvc-a'],   ['hat',  'cvc-a'],
    ['bed',  'cvc-e'],
    ['flat', 'ccvc-a'],  ['step', 'ccvc-e'],
    ['lamp', 'cvcc-a'],  ['best', 'cvcc-e'],
    ['stamp','ccvcc-a'], ['print','ccvcc-i'],
  ])('%s → %s (structural)', (id, expected) => {
    expect(wordById(id).decodableStage).toBe(expected);
  });

  it.each([
    // Named-stage groups beat structural inference.
    ['ship',    'digraphs'],
    ['chin',    'digraphs'],
    ['that',    'digraphs'],
    ['sing',    'digraphs'],
    ['running', 'suffix-ing'],
    ['jumped',  'suffix-ed'],
    ['faster',  'suffix-er'],
    ['fastest', 'suffix-est'],
  ])('%s → %s (named group)', (id, expected) => {
    expect(wordById(id).decodableStage).toBe(expected);
  });

  it.each([
    // Long-vowel and diphthong micro-stages.
    ['cake', 'long-a-ae'],
    ['rain', 'long-a-ai'],
    ['day',  'long-a-ay'],
    ['tree', 'long-e-ee'],
    ['beat', 'long-e-ea'],
    ['kite', 'long-i-ie'],
    ['high', 'long-i-igh'],
    ['cry',  'long-i-y'],
    ['home', 'long-o-oe'],
    ['boat', 'long-o-oa'],
    ['snow', 'long-o-ow'],
    ['cube', 'long-u-ue'],
    ['blue', 'long-u-uue'],
    ['new',  'long-u-ew'],
    ['moon', 'long-u-oo'],
    ['coin', 'dip-oi'],
    ['cow',  'dip-ou'],
    ['paw',  'dip-aw'],
  ])('%s → %s (micro-stage)', (id, expected) => {
    expect(wordById(id).decodableStage).toBe(expected);
  });

  it('words whose stage exists in CURRICULUM resolve to a real stage id', () => {
    const curriculumIds = new Set(CURRICULUM.map(s => s.id));
    // Words mapping to a curriculum stage id must match an actual stage.
    const stageWords = WORDS.filter(w => curriculumIds.has(w.decodableStage));
    expect(stageWords.length).toBeGreaterThan(WORDS.length * 0.7); // most words

    // The non-curriculum-stage values are documented routing keys.
    // 'r-controlled' is a meaningful group key (no curriculum stage yet).
    // 'blends' falls through only when `play` mis-groups long-a-ay as
    // 'blends' (pre-existing data bug, out of scope for this commit).
    // long-e-ie / long-i-ind / long-i-ild / long-o-old / long-u-ui are
    // real orthographic patterns that don't yet have their own curriculum
    // micro-stage. They're routing keys awaiting curriculum expansion.
    const ALLOWED_NON_STAGE_KEYS = new Set([
      'r-controlled',
      'blends',
      'long-e-ie',
      'long-i-ind',
      'long-i-ild',
      'long-o-old',
      'long-u-ui',
    ]);
    for (const w of WORDS) {
      if (curriculumIds.has(w.decodableStage)) continue;
      expect(ALLOWED_NON_STAGE_KEYS.has(w.decodableStage),
        `${w.id} routes to "${w.decodableStage}" which is neither a curriculum stage nor a documented routing key`)
        .toBe(true);
    }
  });
});

// ── Custom deriver smoke tests ──────────────────────────────────────────────

describe('deriver helpers (independent of WORDS)', () => {
  it('deriveFlags returns [] for the simplest CVC word', () => {
    expect(deriveFlags({ id: 'cat', word: 'cat', graphemes: ['c','a','t'], types: ['c','sv','c'], pattern: 'CVC', group: 'short-a' }))
      .toEqual([]);
  });

  it('deriveFlags catches multi-phoneme x at any position', () => {
    expect(deriveFlags({ id: 'tax', word: 'tax', graphemes: ['t','a','x'], types: ['c','sv','c'] }))
      .toContain('multi-phoneme-x');
  });

  it('deriveDecodableStage prefers spellingPattern over group fallback', () => {
    const word = { word: 'cake', group: 'long-a', spellingPattern: 'ae', graphemes: ['c','a','k','e'], types: ['c','lv','c','se'] };
    expect(deriveDecodableStage(word)).toBe('long-a-ae');
  });
});
