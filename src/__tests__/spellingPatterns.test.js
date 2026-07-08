/**
 * Long-vowel and diphthong micro-stage tests.
 *
 * Splitting `long-a` into a_e / ai / ay (and so on for the other long
 * vowels and the diphthongs) was the biggest curriculum change of this
 * pass. These tests lock in:
 *   1. deriveSpellingPattern() correctly tags every long-vowel/diphthong
 *      word in the dataset.
 *   2. Each curriculum micro-stage actually has words behind it (no
 *      empty stages — those would block the unlock chain).
 *   3. The progress._filterByGroup selector returns the same set of
 *      words the curriculum stage promises.
 *   4. The micro-stage prerequisite chain is intact and ordered the way
 *      structured-literacy practice expects (split-digraph before vowel
 *      teams; oi/oy before ou/ow before aw).
 */
import { describe, it, expect } from 'vitest';
import { WORDS, WORD_GROUPS } from '../data/words.js';
import { CURRICULUM } from '../data/curriculum.js';
import { progress } from '../modules/progress.js';

const wordById = (id) => WORDS.find(w => w.id === id);

describe('deriveSpellingPattern()', () => {
  it.each([
    // Long A
    ['cake', 'ae'], ['name', 'ae'], ['take', 'ae'],
    ['rain', 'ai'], ['mail', 'ai'], ['sail', 'ai'],
    ['day',  'ay'], ['play', null /* play is in 'blends' group, not long-a */],
    // Long E
    ['tree', 'ee'], ['feet', 'ee'], ['bee', 'ee'],
    ['beat', 'ea'], ['sea',  'ea'], ['mean', 'ea'],
    // Long I: i_e, igh, final-y
    ['kite', 'ie'], ['bike', 'ie'], ['line', 'ie'],
    ['high', 'igh'], ['night', 'igh'], ['light', 'igh'], ['bright', 'igh'],
    ['my',   'y'],   ['cry',   'y'],   ['fly',   'y'],   ['why',    'y'],
    // Long O
    ['home', 'oe'], ['note', 'oe'],
    ['boat', 'oa'], ['coat', 'oa'],
    ['snow', 'ow'], ['low',  'ow'],
    // Long U: u_e (split-digraph) → ue (vowel team) → ew → oo
    ['cube', 'ue'],  ['tune', 'ue'],
    ['blue', 'uue'], ['true', 'uue'], ['glue', 'uue'],
    ['new',  'ew'],  ['drew', 'ew'],  ['flew', 'ew'],
    ['moon', 'oo'],  ['food', 'oo'],  ['zoo',  'oo'],
    // Diphthongs (oi/oy collapse, ou/ow collapse, aw separate)
    ['coin', 'oi'], ['boy',  'oi'], ['joy', 'oi'],
    ['out',  'ou'], ['cow',  'ou'], ['town', 'ou'],
    ['paw',  'aw'], ['saw',  'aw'], ['dawn', 'aw'],
  ])('%s → spellingPattern %s', (id, expected) => {
    const w = wordById(id);
    expect(w, `word ${id} not found in dataset`).toBeDefined();
    expect(w.spellingPattern).toBe(expected);
  });

  it('returns null for short-vowel and structural words', () => {
    expect(wordById('cat').spellingPattern).toBeNull();
    expect(wordById('flat').spellingPattern).toBeNull();
    expect(wordById('ship').spellingPattern).toBeNull();
  });

  it('every long-* and diphthongs word has a non-null spellingPattern', () => {
    const offenders = WORDS
      .filter(w => (w.group?.startsWith('long-') || w.group === 'diphthongs') && !w.spellingPattern)
      .map(w => w.id);
    expect(offenders, `Words missing spellingPattern: ${offenders.join(', ')}`).toEqual([]);
  });
});

describe('long-vowel / diphthong micro-stage curriculum coverage', () => {
  const microIds = [
    'long-a-ae', 'long-a-ai', 'long-a-ay',
    'long-e-ee', 'long-e-ea',
    'long-i-ie', 'long-i-igh', 'long-i-y',
    'long-o-oe', 'long-o-oa', 'long-o-ow',
    'long-u-ue', 'long-u-uue', 'long-u-ew', 'long-u-oo',
    'dip-oi', 'dip-ou', 'dip-aw',
  ];

  it('every micro-stage exists in CURRICULUM exactly once', () => {
    for (const id of microIds) {
      const matches = CURRICULUM.filter(s => s.id === id);
      expect(matches, `expected exactly one curriculum entry for ${id}`).toHaveLength(1);
    }
  });

  it('the old macro stages (long-a, long-e, …, diphthongs) no longer exist', () => {
    for (const oldId of ['long-a', 'long-e', 'long-i', 'long-o', 'long-u', 'diphthongs']) {
      const stage = CURRICULUM.find(s => s.id === oldId);
      expect(stage, `old macro stage "${oldId}" should have been replaced by micro-stages`).toBeUndefined();
    }
  });

  it('every micro-stage has at least one word backing it', () => {
    for (const id of microIds) {
      const stage = CURRICULUM.find(s => s.id === id);
      const words = progress._filterByGroup(stage.group);
      expect(words.length, `micro-stage "${id}" has zero words — empty stages block the unlock chain`).toBeGreaterThan(0);
    }
  });

  it('each micro-stage word filter only includes its own pattern', () => {
    for (const id of microIds) {
      const stage = CURRICULUM.find(s => s.id === id);
      const words = progress._filterByGroup(stage.group);
      // Extract the expected pattern from the stage id (long-a-ae → ae, dip-oi → oi)
      const pattern = id.startsWith('dip-') ? id.slice(4) : id.split('-').slice(2).join('-');
      for (const w of words) {
        expect(w.spellingPattern, `${w.id} in ${id} should have pattern "${pattern}"`).toBe(pattern);
      }
    }
  });

  it('every micro-stage has a label/colour entry in WORD_GROUPS', () => {
    for (const id of microIds) {
      expect(WORD_GROUPS[id], `WORD_GROUPS missing entry for ${id}`).toBeDefined();
    }
  });
});

describe('micro-stage pedagogical ordering', () => {
  const order = (id) => CURRICULUM.findIndex(s => s.id === id);

  it('Long A: split-digraph before ai before ay', () => {
    expect(order('long-a-ae')).toBeLessThan(order('long-a-ai'));
    expect(order('long-a-ai')).toBeLessThan(order('long-a-ay'));
  });

  it('Long O: split-digraph before oa before ow', () => {
    expect(order('long-o-oe')).toBeLessThan(order('long-o-oa'));
    expect(order('long-o-oa')).toBeLessThan(order('long-o-ow'));
  });

  it('Long I: split-digraph before igh before final-y', () => {
    expect(order('long-i-ie')).toBeLessThan(order('long-i-igh'));
    expect(order('long-i-igh')).toBeLessThan(order('long-i-y'));
  });

  it('Long U: split-digraph before vowel-team ue before ew before oo', () => {
    expect(order('long-u-ue')).toBeLessThan(order('long-u-uue'));
    expect(order('long-u-uue')).toBeLessThan(order('long-u-ew'));
    expect(order('long-u-ew')).toBeLessThan(order('long-u-oo'));
  });

  it('Diphthongs: oi/oy before ou/ow before aw', () => {
    expect(order('dip-oi')).toBeLessThan(order('dip-ou'));
    expect(order('dip-ou')).toBeLessThan(order('dip-aw'));
  });

  it('All micro-stages sit in phase 6 (long vowels) or phase 7 (diphthongs)', () => {
    for (const stage of CURRICULUM) {
      if (stage.id.startsWith('long-')) expect(stage.phase).toBe(6);
      if (stage.id.startsWith('dip-'))  expect(stage.phase).toBe(7);
    }
  });

  it('Phase 6 ends with the short-oo contrast stage; phase 7 starts with dip-oi', () => {
    const phase6 = CURRICULUM.filter(s => s.phase === 6);
    const phase7 = CURRICULUM.filter(s => s.phase === 7);
    // short-oo (book /ʊ/) deliberately follows long-u-oo (moon /uː/) so the
    // two sounds of oo are taught back-to-back as a contrast pair.
    expect(phase6.at(-1).id).toBe('short-oo');
    expect(phase6.at(-2).id).toBe('long-u-oo');
    expect(phase7[0].id).toBe('dip-oi');
  });
});
