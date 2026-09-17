import { describe, it, expect } from 'vitest';
import {
  getStagesForMode,
  PICKER_MODES,
  usesStagePicker,
} from '../src/modules/phonicsProgression.js';

const CURRICULUM = [
  { id: 'cvc-a', group: 'cvc-a', phase: 1, name: 'CVC – Short A' },
  { id: 'cvc-i', group: 'cvc-i', phase: 1, name: 'CVC – Short I' },
  { id: 'ccvc-a', group: 'ccvc-a', phase: 2, name: 'CCVC – Short A' },
  { id: 'cvcc-a', group: 'cvcc-a', phase: 3, name: 'CVCC – Short A' },
  { id: 'digra-a', group: 'digra-a', phase: 4, name: 'Digraph A' },
];

const PHASES = [
  { phase: 1, recommendedModes: ['oralBlend', 'first', 'middle', 'blend', 'segment'] },
  { phase: 2, recommendedModes: ['blend', 'segment', 'hear', 'soundCount', 'missing'] },
  { phase: 3, recommendedModes: ['segment', 'last', 'hear', 'missing'] },
  { phase: 4, recommendedModes: ['hear', 'blend', 'segment', 'missing'] },
];

describe('getStagesForMode — filters CURRICULUM by mode-recommended phases', () => {
  it('returns only stages from phases that recommend the mode', () => {
    const stages = getStagesForMode('first', CURRICULUM, PHASES);
    expect(stages.map((s) => s.id)).toEqual(['cvc-a', 'cvc-i']);
  });

  it('includes every phase that lists the mode', () => {
    const stages = getStagesForMode('segment', CURRICULUM, PHASES);
    const phases = Array.from(new Set(stages.map((s) => s.phase))).sort();
    expect(phases).toEqual([1, 2, 3, 4]);
  });

  it('respects per-phase recommendations exactly', () => {
    const stages = getStagesForMode('last', CURRICULUM, PHASES);
    expect(stages.map((s) => s.id)).toEqual(['cvcc-a']);
  });

  it('falls back to the full curriculum when a mode is in no phase', () => {
    const stages = getStagesForMode('newExperimentalMode', CURRICULUM, PHASES);
    expect(stages).toHaveLength(CURRICULUM.length);
  });

  it('returns the full curriculum when mode is missing/falsy', () => {
    expect(getStagesForMode('', CURRICULUM, PHASES)).toHaveLength(CURRICULUM.length);
    expect(getStagesForMode(null, CURRICULUM, PHASES)).toHaveLength(CURRICULUM.length);
  });

  it('returns [] defensively for missing/empty curriculum', () => {
    expect(getStagesForMode('blend', [], PHASES)).toEqual([]);
    expect(getStagesForMode('blend', null, PHASES)).toEqual([]);
  });
});

describe('integration — every phonemic-awareness mode gets a non-empty stage list', () => {
  it('first / last / middle / oralBlend / soundCount / hear / missing / segment all have stages', () => {
    const PA_MODES = [
      'oralBlend',
      'first',
      'last',
      'middle',
      'soundCount',
      'hear',
      'missing',
      'segment',
    ];
    for (const mode of PA_MODES) {
      const stages = getStagesForMode(mode, CURRICULUM, PHASES);
      expect(stages.length).toBeGreaterThan(0);
    }
  });
});

describe('real curriculum — mode/phase coverage is complete and has no dead stages', () => {
  async function phasesFor(mode) {
    const { CURRICULUM: C, PHASES: P } = await import('../src/data/curriculum.js');
    const stages = getStagesForMode(mode, C, P);
    return [...new Set(stages.map((s) => s.phase))].sort((a, b) => a - b);
  }

  it('both blending modes span every phase 1–10 (Blend It! and Listen & Blend match)', async () => {
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(await phasesFor('blend')).toEqual(all);
    // classicBlend previously skipped Phase 4 (Digraphs) — guard the gap.
    expect(await phasesFor('classicBlend')).toEqual(all);
  });

  it('Segment It covers phases 1–9 but not Phase 10 (its words are PA-excluded)', async () => {
    // Phase 10 (prefixes, advanced suffixes, multisyllabic, sight) cannot serve
    // phoneme-level segmenting, so surfacing it would create dead picker stages.
    expect(await phasesFor('segment')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('the three position modes span the same phases', async () => {
    // First / Last / Middle Sound ask the same kind of question about the
    // same words, so they belong on the same phases. They used to disagree
    // — first 1-6, last 1-5, middle 1,6,7 — which showed up as three modes
    // offering three different category lists for no stated reason. Each
    // gap traced to something other than pedagogy: Middle Sound was absent
    // from the blend and digraph phases although every word there has a
    // medial vowel, and Last Sound was pulled from the long-vowel phases
    // because it targeted the silent e (see lastSoundedIdx).
    //
    // Phases 1-8 are the phoneme-level phases. Phase 9 (inflectional
    // suffixes) and Phase 10 (prefixes, advanced suffixes, multisyllabic,
    // sight) analyse morphemes, not phonemes, and Phase 10's groups are
    // PA-excluded outright — so both stay off the list.
    const phonemePhases = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(await phasesFor('first')).toEqual(phonemePhases);
    expect(await phasesFor('last')).toEqual(phonemePhases);
    expect(await phasesFor('middle')).toEqual(phonemePhases);
  });
});

describe('real curriculum — blending pickers drop the non-decodable sight stage', () => {
  it('blend / classicBlend exclude sight-highfreq; other modes keep it', async () => {
    const { CURRICULUM: C, PHASES: P } = await import('../src/data/curriculum.js');
    const { isStageHiddenForMode } = await import('../src/modules/progress.js');

    const visibleGroups = (mode) =>
      getStagesForMode(mode, C, P)
        .filter((s) => !isStageHiddenForMode(s.group, mode))
        .map((s) => s.group);

    // Sight words can't be sounded out, so they must not appear in a blending
    // picker (they'd fall back to the general pool — a misleading dead stage).
    expect(visibleGroups('blend')).not.toContain('sight-highfreq');
    expect(visibleGroups('classicBlend')).not.toContain('sight-highfreq');

    // Non-blending modes are unaffected by the filter.
    expect(isStageHiddenForMode('sight-highfreq', 'hear')).toBe(false);
    // Decodable stages are never hidden, even for blending modes.
    expect(isStageHiddenForMode('long-u-uue', 'blend')).toBe(false);
  });
});

describe('real curriculum — Last Sound surfaces beginner phases, not just CVCC', () => {
  it('Last Sound includes Phase 1 (CVC) so children can start on the easiest words', async () => {
    const { CURRICULUM: REAL_CURRICULUM, PHASES: REAL_PHASES } =
      await import('../src/data/curriculum.js');
    const stages = getStagesForMode('last', REAL_CURRICULUM, REAL_PHASES);
    const phases = Array.from(new Set(stages.map((s) => s.phase))).sort((a, b) => a - b);

    // CVC (1) is the single-final-consonant sweet spot for last-sound practice;
    // CCVC (2), CVCC (3), Digraphs (4) and CCVCC (5) all also have a clear final
    // phoneme. If any of these drop out, Last Sound starts mid-curriculum and
    // beginners hit a locked-stage wall (the original bug).
    expect(phases).toEqual(expect.arrayContaining([1, 2, 3, 4, 5]));
    expect(stages.length).toBeGreaterThan(0);
  });
});

describe('real curriculum — every picker mode has a filtered picker', () => {
  async function real() {
    return await import('../src/data/curriculum.js');
  }

  async function phasesFor(mode) {
    const { CURRICULUM: C, PHASES: P } = await real();
    return [...new Set(getStagesForMode(mode, C, P).map((s) => s.phase))].sort((a, b) => a - b);
  }

  /**
   * The guard this block exists for.
   *
   * `getStagesForMode` falls back to the WHOLE curriculum for a mode no phase
   * names — a deliberate kindness so a new mode never renders an empty
   * picker, but silent. Word Sort, Read & Tap and Fluency Sprint all sat in
   * that fallback: each opened a picker offering every stage from CVC to
   * multisyllable, and nothing said so. The fallback is still right for a
   * mode with no picker; it is never right for one that has a picker.
   */
  it('no mode that opens a picker is left in the unfiltered fallback', async () => {
    const { CURRICULUM: C, PHASES: P } = await real();
    const named = new Set(P.flatMap((p) => p.recommendedModes || []));

    for (const mode of PICKER_MODES) {
      expect(named.has(mode), `"${mode}" opens a stage picker but no phase recommends it`).toBe(
        true,
      );
      // Being named is the whole guard: the fallback fires only when nothing
      // names the mode. It is NOT "the list must be shorter than the
      // curriculum" — Blend It! is recommended everywhere and legitimately
      // shows every stage, which looks identical to the fallback from the
      // outside. The two are told apart by intent, not by length.
      expect(getStagesForMode(mode, C, P).length, `"${mode}" picker is empty`).toBeGreaterThan(0);
    }
  });

  it('usesStagePicker matches the set, and excludes the two documented opt-outs', () => {
    expect(usesStagePicker('blend')).toBe(true);
    expect(usesStagePicker('listenAndSpell')).toBe(true);
    // Clap the Syllables is decoupled from the decoding curriculum; Classic
    // Blend sets the group itself through its own dropdown.
    expect(usesStagePicker('syllable')).toBe(false);
    expect(usesStagePicker('classicBlend')).toBe(false);
  });

  it('Word Sort covers the sound-pattern phases, and stops before morphology', async () => {
    // Word Sort contrasts two sound patterns, and its bins are a sibling
    // stage: a different vowel in the structural phases, a different spelling
    // of the same vowel in Phase 6. Phases 9 and 10 study the morpheme, not
    // the sound pattern, so a sort there has no principled second bin.
    expect(await phasesFor('wordSort')).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('Read & Tap and Fluency Sprint span every phase', async () => {
    // Both work on whole printed words in a stage's pool, which every phase
    // has — connected text and automaticity are worth practising from CVC
    // right through multisyllable words.
    const all = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    expect(await phasesFor('readAndTap')).toEqual(all);
    expect(await phasesFor('fluencySprint')).toEqual(all);
  });

  it('Listen & Spell spans every phase — you spell what you can read', async () => {
    expect(await phasesFor('listenAndSpell')).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
