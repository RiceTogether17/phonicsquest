import { beforeAll, describe, expect, it } from 'vitest';

/**
 * What belongs in which set.
 *
 * Four rules that all say the same thing from different angles: a set should
 * practise the one thing it names, and should not quietly teach something
 * else — or telegraph its own answer.
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

let WORDS, CURRICULUM, getShortVowelLetter, getWordStructure, phonemeNotation, progress;

beforeAll(async () => {
  ({ WORDS, getShortVowelLetter, getWordStructure, phonemeNotation } =
    await import('../src/data/words.js'));
  ({ CURRICULUM } = await import('../src/data/curriculum.js'));
  ({ progress } = await import('../src/modules/progress.js'));
});

const STRUCTURAL = /^(cvc|ccvc|cvcc|ccvcc)(-[aeiou]|-mixed)$/;
const BLEND_SETS = /^(ccvc|cvcc|ccvcc)(-[aeiou]|-mixed)$/;

const structuralStages = () => CURRICULUM.filter(s => STRUCTURAL.test(s.id));
const poolOf = (stage) => progress.getWordsInGroup(stage.group);

describe('mixed-vowel sets exist and really are mixed', () => {
  it('every structural phase has a jumbled set', () => {
    for (const base of ['cvc', 'ccvc', 'cvcc', 'ccvcc']) {
      const stage = CURRICULUM.find(s => s.id === `${base}-mixed`);
      expect(stage, `${base}-mixed should exist`).toBeTruthy();
    }
  });

  it('each mixed set spans all five short vowels', () => {
    // A set built from one vowel teaches the child to stop listening: after
    // three short-A words they answer /a/ without hearing the word.
    for (const stage of CURRICULUM.filter(s => s.id.endsWith('-mixed'))) {
      const vowels = new Set(poolOf(stage).map(getShortVowelLetter));
      expect([...vowels].sort().join(''), `${stage.id}`).toBe('aeiou');
    }
  });

  it('each mixed set is big enough to stop repeating within a session', () => {
    for (const stage of CURRICULUM.filter(s => s.id.endsWith('-mixed'))) {
      expect(poolOf(stage).length, `${stage.id} pool`).toBeGreaterThanOrEqual(40);
    }
  });

  it('per-vowel sets stay single-vowel — the mixed set is the variation', () => {
    for (const stage of structuralStages()) {
      const m = stage.id.match(/-([aeiou])$/);
      if (!m) continue;
      const vowels = new Set(poolOf(stage).map(getShortVowelLetter));
      expect([...vowels], stage.id).toEqual([m[1]]);
    }
  });
});

describe('notation follows the sound, not the spelling', () => {
  it.each([
    { grapheme: 'g',   type: 'soft_g', reads: '/j/' },
    { grapheme: 'c',   type: 'soft_c', reads: '/s/' },
    { grapheme: 'c',   type: 'c',      reads: '/k/' },
    { grapheme: 'ck',  type: 'd',      reads: '/k/' },
    { grapheme: 'tch', type: 'd',      reads: '/ch/' },
    { grapheme: 'dge', type: 'd',      reads: '/j/' },
    { grapheme: 'ph',  type: 'd',      reads: '/f/' },
    { grapheme: 'wh',  type: 'd',      reads: '/w/' },
  ])('$grapheme reads $reads', ({ grapheme, type, reads }) => {
    expect(phonemeNotation(grapheme, type).join('')).toBe(reads);
  });

  it('leaves a spelling whose letters do name its sound alone', () => {
    expect(phonemeNotation('sh', 'd').join('')).toBe('/sh/');
    expect(phonemeNotation('m', 'c').join('')).toBe('/m/');
    expect(phonemeNotation('a', 'sv').join('')).toBe('/a/');
  });

  it('never prints a slashed label that is really a letter name', () => {
    // "/c/" and "/ck/" are spellings, not sounds. A button that shows one
    // and then plays /k/ is teaching the child the wrong thing.
    const SPELLINGS_NOT_SOUNDS = ['/c/', '/ck/', '/tch/', '/dge/', '/ph/', '/wh/', '/ll/', '/ss/'];
    const seen = new Set();
    for (const word of WORDS) {
      word.graphemes?.forEach((g, i) => {
        phonemeNotation(g, word.types?.[i]).forEach(p => seen.add(p));
      });
    }
    expect([...seen].filter(p => SPELLINGS_NOT_SOUNDS.includes(p))).toEqual([]);
  });
});

describe('soft c and soft g have their own set', () => {
  it('the stage exists and holds a workable set', () => {
    const stage = CURRICULUM.find(s => s.id === 'cons-soft-cg');
    expect(stage, 'cons-soft-cg stage should exist').toBeTruthy();
    expect(poolOf(stage).length).toBeGreaterThanOrEqual(15);
  });

  it('collects the rule wherever it is spelled', () => {
    const stage = CURRICULUM.find(s => s.id === 'cons-soft-cg');
    const words = poolOf(stage).map(w => w.word);
    // Long-vowel words keep their long-vowel stage too; this set is about
    // the consonant, so it gathers them as well.
    for (const w of ['gem', 'rice', 'page', 'race', 'ice']) {
      expect(words, `${w} should be in the soft c/g set`).toContain(w);
    }
  });

  it('is never lumped into a structural short-vowel set', () => {
    // "gem" in the short-e CVC set is a trap: the child has just been taught
    // g says /g/, reads it that way, and is told they are wrong.
    const leaked = structuralStages().flatMap(stage =>
      poolOf(stage)
        .filter(w => w.types.some(t => t === 'soft_c' || t === 'soft_g'))
        .map(w => `${stage.id}:${w.word}`),
    );
    expect(leaked).toEqual([]);
  });
});

describe('digraphs are not blends', () => {
  it('counts a digraph as ONE consonant when reading word structure', () => {
    const cash = { word: 'cash', graphemes: ['c', 'a', 'sh'], types: ['c', 'sv', 'd'] };
    expect(getWordStructure(cash)).toBe('CVC');

    // A real final blend is still CVCC, digraph at the front or not.
    const chest = { word: 'chest', graphemes: ['ch', 'e', 'st'], types: ['d', 'sv', 'bl'] };
    expect(getWordStructure(chest)).toBe('CVCC');
  });

  it('keeps digraph words out of the blend sets', () => {
    // A child sent to cvcc-a to practise -nd, -mp and -st used to meet
    // "cash", "catch" and "fang" — none of which has a final blend at all.
    const leaked = CURRICULUM.filter(s => BLEND_SETS.test(s.id)).flatMap(stage =>
      poolOf(stage).filter(w => w.types.includes('d')).map(w => `${stage.id}:${w.word}`),
    );
    expect(leaked).toEqual([]);
  });

  it('does not push them into the CVC sets instead', () => {
    const leaked = CURRICULUM.filter(s => /^cvc(-[aeiou]|-mixed)$/.test(s.id)).flatMap(stage =>
      poolOf(stage).filter(w => w.types.includes('d')).map(w => `${stage.id}:${w.word}`),
    );
    expect(leaked).toEqual([]);
  });

  it('leaves them all in the stage that teaches them', () => {
    expect(progress.getWordsInGroup('digraphs').length).toBeGreaterThan(100);
  });
});

describe('every sound mode reaches every set it can teach', () => {
  // The modes that ask a question ABOUT SOUNDS. They all analyse the same
  // words at the same grain, so a phase that suits one suits all of them —
  // and a mode missing from a phase is a gap, not a curriculum decision.
  const SOUND_MODES = [
    'first', 'last', 'middle', 'missing', 'soundCount',
    'oralBlend', 'oralSegment', 'oddOneOut', 'soundHunt', 'train', 'wordCount',
  ];
  // Phases 1-8 work at phoneme level; 9 and 10 analyse morphemes, and 10's
  // groups are PA-excluded outright.
  const PHONEME_PHASES = [1, 2, 3, 4, 5, 6, 7, 8];

  let PHASES;
  beforeAll(async () => {
    ({ PHASES } = await import('../src/data/curriculum.js'));
  });

  it.each(SOUND_MODES)('%s is offered on every phoneme-level phase', (mode) => {
    const offered = PHASES
      .filter(p => (p.recommendedModes || []).includes(mode))
      .map(p => p.phase)
      .sort((a, b) => a - b);
    expect(offered).toEqual(PHONEME_PHASES);
  });

  it('Missing Sound covers the CVC phase', () => {
    // "c_t — which sound is missing?" is the canonical use of this mode, and
    // it was the one phase the mode did not appear on.
    const cvc = PHASES.find(p => p.phase === 1);
    expect(cvc.recommendedModes).toContain('missing');
  });

  it('no sound mode is offered a stage it cannot serve', async () => {
    const { CURRICULUM } = await import('../src/data/curriculum.js');
    const { getStagesForMode } = await import('../src/modules/phonicsProgression.js');
    const { hasInteriorVowel, isStageHiddenForMode } = await import('../src/modules/progress.js');
    const PA_EXCLUDED = new Set(['sight-highfreq', 'multisyllable', 'prefixes', 'suffixes-advanced']);

    const dead = [];
    for (const mode of SOUND_MODES) {
      const stages = getStagesForMode(mode, CURRICULUM, PHASES)
        .filter(stage => !isStageHiddenForMode(stage.group, mode));
      for (const stage of stages) {
        let pool = progress.getWordsInGroup(stage.group).filter(w => !PA_EXCLUDED.has(w.group));
        if (mode === 'middle') pool = pool.filter(hasInteriorVowel);
        if (!pool.length) dead.push(`${mode} → ${stage.id}`);
      }
    }
    expect(dead).toEqual([]);
  });
});

describe('no stage is offered with nothing to serve', () => {
  it('every curriculum stage resolves to at least one word', () => {
    const empty = CURRICULUM.filter(s => poolOf(s).length === 0).map(s => s.id);
    expect(empty).toEqual([]);
  });
});
