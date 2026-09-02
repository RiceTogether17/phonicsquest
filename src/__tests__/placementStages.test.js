import { describe, it, expect, beforeAll } from 'vitest';
import { WORDS } from '../data/words.js';
import { STORIES } from '../data/stories.js';

let derivePlacementResult;
let STAGES;
let STAGE_IDS;
let _computeStageScores;
let _computeSkillGaps;
let _severityFor;
let renderPlacementReportHtml;
let BAND_DESCRIPTION;

beforeAll(async () => {
  const synth = {
    getVoices: () => [],
    addEventListener: () => {},
    cancel: () => {},
    speak: () => {},
  };
  globalThis.speechSynthesis = globalThis.speechSynthesis || synth;
  if (globalThis.window) {
    globalThis.window.speechSynthesis = globalThis.window.speechSynthesis || synth;
  }
  const mod = await import('../modules/placementTest.js');
  derivePlacementResult = mod.derivePlacementResult;
  STAGES = mod.STAGES;
  STAGE_IDS = mod.STAGE_IDS;
  _computeStageScores = mod._computeStageScores;
  _computeSkillGaps = mod._computeSkillGaps;
  _severityFor = mod._severityFor;
  renderPlacementReportHtml = mod.renderPlacementReportHtml;
  BAND_DESCRIPTION = mod.BAND_DESCRIPTION;
});

// ── Helpers to build synthetic answer sets ────────────────────────────────

/** Build a list of fake responses for a section, given an outcome. */
function makeChildResponses(section, correctCount, totalCount) {
  const rows = [];
  for (let i = 0; i < totalCount; i++) {
    rows.push({ id: `${section}-${i}`, section, correct: i < correctCount });
  }
  return rows;
}
function makeTeacherResponses(section, score, totalCount) {
  const rows = [];
  for (let i = 0; i < totalCount; i++) {
    rows.push({ id: `${section}-${i}`, section, score });
  }
  return rows;
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('STAGES ladder', () => {
  it('declares seven stages in the user-specified order', () => {
    expect(STAGE_IDS).toEqual([
      'picture-id',
      'known-vocab',
      'phonemic-awareness',
      'letter-sounds',
      'blending',
      'reading',
      'grammar-vocab',
    ]);
  });

  it('every stage has icon, label, summary and a legacy gate', () => {
    for (const s of STAGES) {
      expect(typeof s.icon).toBe('string');
      expect(typeof s.label).toBe('string');
      expect(typeof s.summary).toBe('string');
      expect(['A', 'B', 'C', 'D']).toContain(s.legacyGate);
    }
  });
});

describe('_severityFor', () => {
  it('buckets scores into the four severity levels', () => {
    expect(_severityFor(0.95)).toBe('strong');
    expect(_severityFor(0.8)).toBe('strong');
    expect(_severityFor(0.65)).toBe('developing');
    expect(_severityFor(0.45)).toBe('needs-practice');
    expect(_severityFor(0.1)).toBe('not-yet');
    expect(_severityFor(0)).toBe('not-yet');
  });
});

describe('_computeStageScores', () => {
  it('returns coverage:not-tested for stages without any items', () => {
    const ss = _computeStageScores([]);
    for (const key of [
      'pictureId',
      'knownVocab',
      'phonemicAwareness',
      'letterSounds',
      'blending',
      'reading',
      'grammarVocab',
    ]) {
      expect(ss[key].coverage).toBe('not-tested');
      expect(ss[key].composite).toBe(0);
    }
  });

  it('rolls up first/last/middle/oralBlending into a PA composite', () => {
    const results = [
      ...makeChildResponses('firstSound', 3, 3), // 1.0
      ...makeChildResponses('lastSound', 2, 3), // 0.67
      ...makeChildResponses('middleSound', 1, 3), // 0.33
      ...makeChildResponses('oralBlending', 3, 3), // 1.0
    ];
    const ss = _computeStageScores(results);
    expect(ss.phonemicAwareness.firstSound).toBeCloseTo(1.0, 2);
    expect(ss.phonemicAwareness.middleSound).toBeCloseTo(0.33, 2);
    // composite = (1.0 + 0.67 + 0.33 + 1.0) / 4 ≈ 0.75
    expect(ss.phonemicAwareness.composite).toBeCloseTo(0.75, 2);
    expect(ss.phonemicAwareness.coverage).toBe('tested');
  });

  it('weights reading components: decoding 0.4, sight 0.2, sentence 0.2, comp 0.15, readAloud 0.05', () => {
    const results = [
      ...makeChildResponses('decoding', 5, 5), // 1.0
      ...makeChildResponses('sightWords', 0, 5), // 0
      ...makeChildResponses('connectedReading', 0, 5), // 0
      ...makeChildResponses('comprehension', 0, 5), // 0
      ...makeTeacherResponses('storyReadiness', 0, 2),
    ];
    const ss = _computeStageScores(results);
    // composite = 1.0 * 0.4 + 0 + 0 + 0 + 0 = 0.4
    expect(ss.reading.composite).toBeCloseTo(0.4, 2);
  });
});

describe('_computeSkillGaps', () => {
  it('emits no gaps when every stage is strong', () => {
    const ss = _computeStageScores([
      ...makeChildResponses('vocab', 3, 3),
      ...makeTeacherResponses('oral', 1, 2),
      ...makeChildResponses('knownVocab', 4, 4),
      ...makeChildResponses('firstSound', 3, 3),
      ...makeChildResponses('lastSound', 3, 3),
      ...makeChildResponses('middleSound', 3, 3),
      ...makeChildResponses('oralBlending', 3, 3),
      ...makeTeacherResponses('letterSounds', 1, 2),
      ...makeChildResponses('decoding', 18, 18),
      ...makeChildResponses('sightWords', 6, 6),
      ...makeChildResponses('connectedReading', 4, 4),
      ...makeChildResponses('comprehension', 2, 2),
      ...makeTeacherResponses('storyReadiness', 1, 2),
      ...makeChildResponses('sentenceReady', 2, 2),
      ...makeChildResponses('grammarReady', 2, 2),
      ...makeChildResponses('vocabularyReady', 2, 2),
    ]);
    expect(_computeSkillGaps(ss)).toEqual([]);
  });

  it('emits a gap for each non-strong sub-skill with severity + recommended modes', () => {
    const ss = _computeStageScores([
      ...makeChildResponses('firstSound', 3, 3), // 1.0 strong
      ...makeChildResponses('lastSound', 2, 3), // 0.67 developing
      ...makeChildResponses('middleSound', 1, 3), // 0.33 not-yet
      ...makeChildResponses('oralBlending', 3, 3), // 1.0 strong
    ]);
    const gaps = _computeSkillGaps(ss);
    const lastGap = gaps.find((g) => g.skill === 'lastSound');
    const middleGap = gaps.find((g) => g.skill === 'middleSound');

    expect(lastGap).toBeDefined();
    expect(lastGap.severity).toBe('developing');
    expect(lastGap.summary).toMatch(/last sound/i);
    expect(lastGap.recommendedModes).toContain('last-sound');

    expect(middleGap).toBeDefined();
    expect(middleGap.severity).toBe('not-yet');
    expect(middleGap.recommendedModes).toContain('middle-sound');

    // First sound was strong → must NOT appear
    expect(gaps.find((g) => g.skill === 'firstSound')).toBeUndefined();
  });

  it('skips stages whose coverage is not-tested (never tested ≠ failed)', () => {
    const ss = _computeStageScores([]); // no responses at all
    const gaps = _computeSkillGaps(ss);
    expect(gaps).toEqual([]);
  });
});

describe('derivePlacementResult — new fields', () => {
  it('attaches stageScores, skillGaps and bandDescription to the result', () => {
    const result = derivePlacementResult([], {}, 'preschool');
    expect(result.stageScores).toBeDefined();
    expect(Array.isArray(result.skillGaps)).toBe(true);
    expect(typeof result.bandDescription).toBe('string');
    expect(result.bandDescription.length).toBeGreaterThan(20);
  });

  it('preserves legacy fields (gateScores, readingBand, phonicsPhase, startGroup)', () => {
    const result = derivePlacementResult([], {}, 'preschool');
    expect(result.gateScores).toHaveProperty('gateA');
    expect(result.gateScores).toHaveProperty('gateB');
    expect(result.readingBand).toBe('pre-reader');
    expect(result.phonicsPhase).toBe(1);
    expect(typeof result.startGroup).toBe('string');
  });

  it('selects bandDescription that matches the assigned readingBand', () => {
    const result = derivePlacementResult([], {}, 'preschool');
    expect(result.bandDescription).toBe(BAND_DESCRIPTION[result.readingBand]);
  });
});

describe('renderPlacementReportHtml', () => {
  it('renders a band header, all 7 stage rows and a gap section', () => {
    const result = derivePlacementResult([], {}, 'preschool');
    const html = renderPlacementReportHtml(result);
    expect(html).toContain('Pre-reader');
    expect(html).toContain('Skill profile');
    expect(html).toMatch(/What.{1,5}s missing/); // apostrophe form varies
    // All 7 stage rows appear (use the data-stage attribute, label may be escaped)
    for (const stage of STAGES) {
      expect(html).toContain(`data-stage="${stage.id}"`);
    }
    // Print button + start CTA both present
    expect(html).toContain('pt-print-btn');
    expect(html).toContain('pt-start-btn');
  });

  it('shows the celebratory empty-state when there are no gaps', () => {
    const result = derivePlacementResult([], {}, 'preschool');
    result.skillGaps = [];
    const html = renderPlacementReportHtml(result);
    expect(html).toMatch(/No major gaps/i);
  });

  it('renders one gap card per skillGap entry, with mode chips', () => {
    const result = derivePlacementResult([], {}, 'preschool');
    result.skillGaps = [
      {
        stage: 'phonemicAwareness',
        skill: 'middleSound',
        severity: 'developing',
        summary: 'Your child is still developing middle-sound awareness.',
        recommendedModes: ['middle-sound', 'sound-count'],
      },
      {
        stage: 'letterSounds',
        skill: 'letterSounds',
        severity: 'not-yet',
        summary: 'Your child has not yet shown letter-sound knowledge.',
        recommendedModes: ['letter-sounds'],
      },
    ];
    const html = renderPlacementReportHtml(result);
    expect(html).toContain('middle-sound awareness');
    expect(html).toContain('data-mode="middle-sound"');
    expect(html).toContain('data-mode="sound-count"');
    expect(html).toContain('letter-sound knowledge');
    expect(html).toContain('data-mode="letter-sounds"');
  });
});

describe('webapp content alignment', () => {
  it('blending stage uses CVC words that exist in the WORDS bank', () => {
    // The three blending items in placementTest.js use cat/dog/sun. These
    // are the same CVC nouns the Blend It! mode (`blend.js`) uses, so the
    // screener visibly mirrors the webapp's content.
    const bank = new Set(WORDS.map((w) => w.word));
    for (const w of ['cat', 'dog', 'sun']) {
      expect(bank.has(w)).toBe(true);
    }
  });

  it('Band A reference stories used by Reading items are present in stories.js', () => {
    const bandA = STORIES.filter((s) => s.band === 'A');
    expect(bandA.length).toBeGreaterThanOrEqual(5);
    // core-a-01 is the canonical reference for the screener's reading stage.
    expect(bandA.find((s) => s.id === 'core-a-01')).toBeDefined();
  });
});
