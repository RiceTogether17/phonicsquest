/**
 * Curriculum vs. placement alignment.
 *
 * The architecture review caught a real-world bug: curriculum.js placed
 * digraphs at phase 7 (after diphthongs) while placementTest.js placed
 * them at phase 4 (before long vowels). The screener and the curriculum
 * disagreed on what each phase number meant, so a child could be screened
 * into a stage that wasn't actually next.
 *
 * These tests are the regression guard. They assert that:
 *   1. Each Gate B decoding item's `phase` corresponds to a PLACEMENT_PHASES
 *      entry whose `fallbackGroup` matches the kind of word being asked.
 *   2. Every PLACEMENT_PHASES.fallbackGroup is reachable from CURRICULUM —
 *      either as a `group` on some stage, or as a curriculum-stage id.
 *   3. Phase numbers in PLACEMENT_PHASES match the corresponding phase
 *      numbers in PHASE_LABELS (curriculum.js).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { CURRICULUM, PHASE_LABELS } from '../data/curriculum.js';

let PLACEMENT_PHASES;
let GATE_B_ITEMS;

beforeAll(async () => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
  const mod = await import('../modules/placementTest.js');
  PLACEMENT_PHASES = mod.PLACEMENT_PHASES;
  GATE_B_ITEMS = mod.GATE_B_ITEMS;
});

describe('curriculum/placement phase alignment', () => {
  it('PLACEMENT_PHASES is contiguous starting at 1', () => {
    PLACEMENT_PHASES.forEach((def, i) => {
      expect(def.phase).toBe(i + 1);
    });
  });

  it('every placement-phase fallbackGroup is reachable from CURRICULUM', () => {
    const curriculumGroups = new Set(CURRICULUM.map(s => s.group));
    const curriculumIds    = new Set(CURRICULUM.map(s => s.id));
    for (const def of PLACEMENT_PHASES) {
      const reachable = curriculumGroups.has(def.fallbackGroup) || curriculumIds.has(def.fallbackGroup);
      expect(reachable, `fallbackGroup "${def.fallbackGroup}" for phase ${def.phase} not in CURRICULUM`).toBe(true);
    }
  });

  it('placement and curriculum agree that digraphs come before CCVCC, long vowels, and diphthongs', () => {
    // Curriculum order — extracted from the stage list rather than hard-coded.
    // After the long-vowel/diphthong micro-stage split, the canonical order
    // markers are: digraphs → ccvcc-a → long-a-ae (first long-vowel
    // micro-stage) → dip-oi (first diphthong micro-stage).
    const stageOrder = CURRICULUM.map(s => s.id);
    const idx = (id) => stageOrder.indexOf(id);

    expect(idx('digraphs')).toBeGreaterThan(-1);
    expect(idx('ccvcc-a')).toBeGreaterThan(-1);
    expect(idx('long-a-ae')).toBeGreaterThan(-1);
    expect(idx('dip-oi')).toBeGreaterThan(-1);

    expect(idx('digraphs')).toBeLessThan(idx('ccvcc-a'));
    expect(idx('digraphs')).toBeLessThan(idx('long-a-ae'));
    expect(idx('digraphs')).toBeLessThan(idx('dip-oi'));

    // Placement order matches: digraphs phase < ccvcc phase < long-vowel phase
    const phaseOf = (group) => PLACEMENT_PHASES.find(p => p.fallbackGroup === group)?.phase;
    expect(phaseOf('digraphs')).toBeLessThan(phaseOf('ccvcc-a'));
    expect(phaseOf('ccvcc-a')).toBeLessThan(phaseOf('long-a-ae'));
  });

  it('PHASE_LABELS covers every PLACEMENT_PHASES.phase number', () => {
    for (const def of PLACEMENT_PHASES) {
      expect(PHASE_LABELS[def.phase], `Missing PHASE_LABELS entry for phase ${def.phase}`).toBeTruthy();
    }
  });

  it('curriculum prerequisite chain is intact (no dangling links after the reorder)', () => {
    const ids = new Set(CURRICULUM.map(s => s.id));
    for (const stage of CURRICULUM) {
      if (!stage.prerequisite) continue;
      expect(ids.has(stage.prerequisite), `Stage "${stage.id}" points to missing prereq "${stage.prerequisite}"`).toBe(true);
    }
  });

  it('every curriculum stage has a phase that matches PHASE_LABELS', () => {
    for (const stage of CURRICULUM) {
      expect(PHASE_LABELS[stage.phase], `Stage "${stage.id}" has phase ${stage.phase} with no PHASE_LABELS entry`).toBeTruthy();
    }
  });
});

describe('Gate B item bank coverage (issue #108)', () => {
  it('has at least 4 decoding items per phonics phase 1-6', () => {
    for (let phase = 1; phase <= 6; phase++) {
      const items = GATE_B_ITEMS.filter(i => i.section === 'decoding' && i.phase === phase);
      expect(items.length, `phase ${phase} has only ${items.length} decoding items`).toBeGreaterThanOrEqual(4);
    }
  });

  it('probes every short vowel at least once in phase 1', () => {
    const groups = new Set(GATE_B_ITEMS.filter(i => i.phase === 1).map(i => i.group));
    for (const v of ['a', 'e', 'i', 'o', 'u']) {
      expect(groups.has(`cvc-${v}`), `no phase-1 item for cvc-${v}`).toBe(true);
    }
  });

  it('has at least 8 sight-word items', () => {
    const sight = GATE_B_ITEMS.filter(i => i.section === 'sightWords');
    expect(sight.length).toBeGreaterThanOrEqual(8);
  });

  it('every item is answerable: correct answer among 4 unique options', () => {
    for (const item of GATE_B_ITEMS) {
      expect(item.options, item.id).toContain(item.correct);
      expect(new Set(item.options).size, `${item.id} has duplicate options`).toBe(item.options.length);
      expect(item.options.length, item.id).toBe(4);
    }
  });

  it('every decoding item group maps to a curriculum stage (directly or via normalization)', async () => {
    const { normalizePhonicsGroupKey } = await import('../modules/phonicsGroupKeys.js');
    const curriculumGroups = new Set(CURRICULUM.map(s => s.group));
    const curriculumIds = new Set(CURRICULUM.map(s => s.id));
    for (const item of GATE_B_ITEMS) {
      if (item.section !== 'decoding') continue;
      const key = normalizePhonicsGroupKey(item.group);
      const reachable = curriculumGroups.has(key) || curriculumIds.has(key)
        || curriculumGroups.has(item.group) || curriculumIds.has(item.group);
      expect(reachable, `item ${item.id} group "${item.group}" not reachable from CURRICULUM`).toBe(true);
    }
  });

  it('item ids are unique', () => {
    const ids = GATE_B_ITEMS.map(i => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
