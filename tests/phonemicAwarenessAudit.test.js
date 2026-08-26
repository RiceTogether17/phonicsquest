import { beforeAll, describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Invariants for the phonemic-awareness / phonics modes.
 *
 * These pin four things that had all drifted apart in different ways:
 *   1. every taught grapheme resolves to real phoneme audio (not letter names);
 *   2. Last Sound asks about a sound, never a silent letter;
 *   3. the three position modes are offered on the same phases;
 *   4. a stage is only offered to a mode that can actually serve it.
 */

globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
  paused: false,
  resume: () => {},
};
globalThis.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };

let WORDS, CURRICULUM, PHASES, progress, hasInteriorVowel, isStageHiddenForMode, lastSoundedIdx;

beforeAll(async () => {
  ({ WORDS } = await import('../src/data/words.js'));
  ({ CURRICULUM, PHASES } = await import('../src/data/curriculum.js'));
  ({ progress, hasInteriorVowel, isStageHiddenForMode } = await import('../src/modules/progress.js'));
  ({ lastSoundedIdx } = await import('../src/modes/lastSound.js'));
});

/**
 * Read the phoneme lookup tables straight out of audio.js.
 *
 * Importing the module would only expose the class, not these private maps,
 * and the point of the test is precisely that a grapheme has an ENTRY —
 * so parse the source rather than exercise the playback path.
 */
function phonemeTables() {
  const src = fs.readFileSync(path.resolve('src/modules/audio.js'), 'utf8');
  const objectAfter = (name) => {
    const start = src.indexOf(`const ${name} = {`);
    if (start < 0) throw new Error(`${name} not found in audio.js`);
    let depth = 0;
    const open = src.indexOf('{', start);
    for (let i = open; i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}' && --depth === 0) return src.slice(open, i + 1);
    }
    throw new Error(`${name} never closed`);
  };
  const keys = (name) => new Set(
    [...objectAfter(name).matchAll(/(?:^|[{,\s])'?([A-Za-z_ə][\w]*)'?\s*:/g)].map(m => m[1]),
  );
  return { files: keys('PHONEME_FILES'), tts: keys('PHONEME_TTS') };
}

/** Mirrors the grapheme+type → audio-key mapping in audio.js speakPhoneme. */
function audioKeyFor(grapheme, type) {
  let key = grapheme.toLowerCase();
  if (type === 'lv') key = `long_${key.replace('ee', 'e').replace('ay', 'a')}`;
  if (type === 'sv' && key === 'oo') key = 'short_oo';
  if (type === 'soft_c' || type === 'soft_g') key = type;
  if (type === 'dp') key = ({ oy: 'oi', ou: 'ow', au: 'aw' })[key] ?? key;
  return key;
}

// speakPhoneme routes these through dedicated branches (silent-e returns
// early; suffixes, blends and prefixes expand into phoneme sequences).
const TYPES_WITH_OWN_BRANCH = new Set(['se', 'sf', 'bl', 'p']);

// Irregular words are split into word-specific pseudo-graphemes ("nough" in
// enough, "cau" in because) that no general phoneme table can cover. They are
// already excluded from the phonemic-awareness modes.
const IRREGULAR_GROUPS = new Set([
  'sight-highfreq',
  'multisyllable',
  'prefixes',
  'suffixes-advanced',
]);

describe('phoneme audio coverage', () => {
  it('every grapheme in a decodable group has real phoneme audio', () => {
    const { files, tts } = phonemeTables();
    const missing = new Map();

    for (const word of WORDS) {
      if (IRREGULAR_GROUPS.has(word.group) || !Array.isArray(word.graphemes)) continue;
      word.graphemes.forEach((grapheme, i) => {
        const type = word.types?.[i];
        if (TYPES_WITH_OWN_BRANCH.has(type)) return;
        const key = audioKeyFor(grapheme, type);
        if (files.has(key) || tts.has(key)) return;
        if (!missing.has(key)) missing.set(key, []);
        missing.get(key).push(word.word);
      });
    }

    // Without an entry the key falls through to _speak(key) and the browser
    // reads the letters out — "tee-see-aitch" instead of /ch/.
    expect(
      [...missing].map(([k, w]) => `${k} (${w.slice(0, 3).join(', ')})`),
      'graphemes with no MP3 mapping and no phonetic TTS fallback',
    ).toEqual([]);
  });

  it.each([
    ['tch', 'catch'],
    ['dge', 'badge'],
    ['ph', 'phone'],
  ])('the late consonant spelling %s has audio', (grapheme) => {
    const { files } = phonemeTables();
    expect(files.has(grapheme)).toBe(true);
  });
});

describe('Last Sound targets a sound, not a letter', () => {
  it('skips the silent e on a magic-e word', () => {
    const cake = { word: 'cake', graphemes: ['c', 'a', 'k', 'e'], types: ['c', 'lv', 'c', 'se'] };
    expect(lastSoundedIdx(cake)).toBe(2);
    expect(cake.graphemes[lastSoundedIdx(cake)]).toBe('k');
  });

  it('leaves a word with a sounded final grapheme alone', () => {
    const cat = { word: 'cat', graphemes: ['c', 'a', 't'], types: ['c', 'sv', 'c'] };
    expect(lastSoundedIdx(cat)).toBe(2);
  });

  it('never targets a silent grapheme anywhere in the word bank', () => {
    const bad = WORDS.filter(w => w.types?.[lastSoundedIdx(w)] === 'se');
    expect(bad.map(w => w.word)).toEqual([]);
  });
});

describe('position modes are offered consistently', () => {
  const POSITION_MODES = ['first', 'last', 'middle'];

  it('every phase offers all three position modes or none of them', () => {
    // The three modes ask the same kind of question about the same words.
    // A phase that offers First and Last but not Middle is a gap, not a
    // curriculum decision — that asymmetry is what this pins.
    const split = PHASES
      .map(p => ({
        phase: p.phase,
        title: p.title,
        offered: POSITION_MODES.filter(m => (p.recommendedModes || []).includes(m)),
      }))
      .filter(p => p.offered.length > 0 && p.offered.length < POSITION_MODES.length);

    expect(split.map(p => `phase ${p.phase} ${p.title}: only [${p.offered}]`)).toEqual([]);
  });

  it('a phase offering the position modes has words they can serve', () => {
    for (const phase of PHASES) {
      if (!(phase.recommendedModes || []).includes('middle')) continue;
      const stages = CURRICULUM
        .filter(s => s.phase === phase.phase)
        .filter(s => !isStageHiddenForMode(s.group, 'middle'));
      expect(stages.length, `phase ${phase.phase} has no stage Middle Sound can serve`)
        .toBeGreaterThan(0);
      for (const stage of stages) {
        const pool = progress.getWordsInGroup(stage.group).filter(hasInteriorVowel);
        expect(pool.length, `${stage.id} is offered to Middle Sound with an empty pool`)
          .toBeGreaterThan(0);
      }
    }
  });
});

describe('stage picker hides stages a mode cannot serve', () => {
  it('hides word-final-vowel stages from Middle Sound', () => {
    // play / cry / snow / new carry the vowel as the LAST sound, so there is
    // no medial vowel to ask about.
    for (const group of ['long-a-ay', 'long-i-y', 'long-o-ow', 'long-u-ew']) {
      expect(isStageHiddenForMode(group, 'middle'), `${group} should be hidden`).toBe(true);
    }
  });

  it('keeps ordinary short-vowel stages visible to Middle Sound', () => {
    expect(isStageHiddenForMode('cvc-a', 'middle')).toBe(false);
    expect(isStageHiddenForMode('digraphs', 'middle')).toBe(false);
  });

  it('still hides irregular sight words from the blending modes', () => {
    expect(isStageHiddenForMode('sight-highfreq', 'blend')).toBe(true);
    expect(isStageHiddenForMode('cvc-a', 'blend')).toBe(false);
  });
});
