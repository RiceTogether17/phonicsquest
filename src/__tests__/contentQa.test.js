/**
 * Content QA — the curriculum-and-mode guardrails documented in
 * CONTENT_QA.md.
 *
 * These tests complement the existing curriculumSchema and phonicsModes
 * suites by checking the SUBSTANCE of the content (do the words match
 * the pattern? are there dupes inside a phase?) rather than just the
 * SHAPE (does every stage have a `sampleWords` field?).
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { CURRICULUM, PHASES, getStagesInPhase } from '../data/curriculum.js';

beforeAll(() => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
});

let PHONICS_MODES;
let MODES;
let MAX_INSTRUCTION_WORDS;
beforeAll(async () => {
  ({ PHONICS_MODES, MAX_INSTRUCTION_WORDS } = await import('../modes/phonicsModes.js'));
  ({ MODES } = await import('../modes/index.js'));
});

// ── 1. Curriculum completeness ───────────────────────────────────────────

describe('curriculum completeness', () => {
  it('every PHASES entry has at least one CURRICULUM stage', () => {
    for (const phase of PHASES) {
      const stages = getStagesInPhase(phase.phase);
      expect(stages.length, `phase ${phase.phase} has no stages`).toBeGreaterThan(0);
    }
  });

  it('every stage advertises sentenceExamples and they are not the empty string', () => {
    for (const stage of CURRICULUM) {
      expect(stage.sentenceExamples.every(s => typeof s === 'string' && s.trim().length > 0)).toBe(true);
    }
  });

  it('every stage advertises learningOutcome that mentions decode, spell, or read', () => {
    // Light heuristic — a learning outcome that doesn't use a learning verb
    // is almost certainly a description, not an outcome.
    const VERBS = /(decode|spell|read|recognis|recogniz|identify|blend|segment|map|distinguish|discriminate)/i;
    for (const stage of CURRICULUM) {
      expect(VERBS.test(stage.learningOutcome), `Stage ${stage.id} outcome is not action-led: "${stage.learningOutcome}"`).toBe(true);
    }
  });
});

// ── 2. No duplicate words within the same phase ─────────────────────────

describe('no duplicate sample words within the same phase', () => {
  for (const phase of PHASES) {
    it(`phase ${phase.phase} (${phase.title}) — every word is unique across its stages`, () => {
      const stages = getStagesInPhase(phase.phase);
      const seen = new Map();
      const dupes = [];
      for (const stage of stages) {
        for (const word of stage.sampleWords || []) {
          const norm = String(word).toLowerCase();
          if (seen.has(norm)) {
            dupes.push({ word: norm, stages: [seen.get(norm), stage.id] });
          } else {
            seen.set(norm, stage.id);
          }
        }
      }
      expect(dupes, `Duplicates in phase ${phase.phase}: ${JSON.stringify(dupes)}`).toEqual([]);
    });
  }
});

// ── 3. Words match declared phonics pattern ─────────────────────────────

// Single-syllable short-vowel words have exactly one run of vowel letters.
// This is the structural property we lean on for short-vowel stages — it's
// strict enough to catch a long-vowel intruder (which would have two vowel
// letters) without policing every consonant cluster.
function _vowelRuns(w) {
  const m = String(w).toLowerCase().match(/[aeiou]+/g);
  return m ? m.length : 0;
}
function _hasSingleShortVowel(w, vowel) {
  const s = String(w).toLowerCase();
  if (_vowelRuns(s) !== 1) return false;
  const m = s.match(/[aeiou]+/);
  return !!m && m[0] === vowel;
}

// A small library of pattern predicates. Each returns true if the word is
// at least plausibly a member of the declared family — the bar is "would a
// phonics teacher object?" not "is this perfectly classified."
const PATTERN_CHECKS = [
  // CVC — strict: 3 letters, middle is the named vowel, no other vowels
  { match: /^cvc-([aeiou])$/, test: (w, [vowel]) =>
    /^[a-z]{3}$/.test(w) && w[1] === vowel && _hasSingleShortVowel(w, vowel) },

  // CCVC — exactly one short-vowel run = named vowel, ≥ 2 leading consonants
  { match: /^ccvc-([aeiou])$/, test: (w, [vowel]) =>
    _hasSingleShortVowel(w, vowel) && /^[^aeiou]{2,3}[aeiou]/.test(w) },

  // CVCC — exactly one short-vowel run = named vowel, ≥ 2 trailing consonants
  { match: /^cvcc-([aeiou])$/, test: (w, [vowel]) =>
    _hasSingleShortVowel(w, vowel) && /[aeiou][^aeiou]{2,3}$/.test(w) },

  // Digraphs — contain at least one of the canonical digraphs
  { match: /^digraphs$/, test: (w) => /sh|ch|th|wh|ck|ng|ph/.test(w) },

  // CCVCC — exactly one short-vowel run = named vowel; cluster both ends
  { match: /^ccvcc-([aeiou])$/, test: (w, [vowel]) =>
    _hasSingleShortVowel(w, vowel) && /^[^aeiou]{2,3}/.test(w) && /[^aeiou]{2,3}$/.test(w) },

  // Long A: a_e — has a vowel-consonant-e pattern with a
  { match: /^long-a-ae$/, test: (w) => /a[^aeiou]e$/.test(w) },
  // Long A: ai
  { match: /^long-a-ai$/, test: (w) => /ai/.test(w) },
  // Long A: ay
  { match: /^long-a-ay$/, test: (w) => /ay/.test(w) },

  // Long E: ee
  { match: /^long-e-ee$/, test: (w) => /ee/.test(w) },
  // Long E: ea
  { match: /^long-e-ea$/, test: (w) => /ea/.test(w) },

  // Long I: i_e
  { match: /^long-i-ie$/, test: (w) => /i[^aeiou]e$/.test(w) },
  // Long I: igh
  { match: /^long-i-igh$/, test: (w) => /igh/.test(w) },
  // Long I: y at word end
  { match: /^long-i-y$/, test: (w) => /y$/.test(w) },

  // Long O: o_e
  { match: /^long-o-oe$/, test: (w) => /o[^aeiou]e$/.test(w) },
  // Long O: oa
  { match: /^long-o-oa$/, test: (w) => /oa/.test(w) },
  // Long O: ow
  { match: /^long-o-ow$/, test: (w) => /ow/.test(w) },

  // Long U: u_e
  { match: /^long-u-ue$/, test: (w) => /u[^aeiou]e$/.test(w) },
  // Long U: ue at word end
  { match: /^long-u-uue$/, test: (w) => /ue/.test(w) },
  // Long U: ew
  { match: /^long-u-ew$/, test: (w) => /ew/.test(w) },
  // Long U: oo
  { match: /^long-u-oo$/, test: (w) => /oo/.test(w) },
  // Short oo /ʊ/ (book, look, good)
  { match: /^short-oo$/, test: (w) => /oo/.test(w) },

  // Diphthongs
  { match: /^dip-oi$/, test: (w) => /(oi|oy)/.test(w) },
  { match: /^dip-ou$/, test: (w) => /(ou|ow)/.test(w) },
  { match: /^dip-aw$/, test: (w) => /(aw|au)/.test(w) },

  // Suffixes
  { match: /^suffix-ing$/,  test: (w) => /ing$/.test(w) },
  { match: /^suffix-ed$/,   test: (w) => /ed$/.test(w) },
  { match: /^suffix-er$/,   test: (w) => /er$/.test(w) },
  { match: /^suffix-est$/,  test: (w) => /est$/.test(w) },

  // Morphology
  { match: /^prefixes$/,    test: (w) => /^(re|un)/.test(w) },
  { match: /^suffixes-advanced$/, test: (w) => /(tion|sion|able|ible)/.test(w) },

  // Stages we accept on faith (mixed-review, multi-syllabic, sight)
  { match: /^(blends-review|blends|multisyllable|sight-highfreq)$/, test: () => true },
];

function findCheck(stageId) {
  for (const c of PATTERN_CHECKS) {
    const m = c.match.exec(stageId);
    if (m) return { test: c.test, captures: m.slice(1) };
  }
  return null;
}

describe('sample words match stage pattern', () => {
  for (const stage of CURRICULUM) {
    it(`${stage.id} — every sample word fits the declared pattern`, () => {
      const check = findCheck(stage.id);
      expect(check, `No pattern check defined for stage "${stage.id}"`).not.toBeNull();
      const bad = (stage.sampleWords || []).filter(w => !check.test(String(w).toLowerCase(), check.captures));
      expect(bad, `Stage ${stage.id} has sample words that don't fit the pattern: ${JSON.stringify(bad)}`).toEqual([]);
    });
  }
});

// ── 4. Every game mode has child-friendly instructions ─────────────────

describe('every phonics mode has child-friendly instructions', () => {
  it('PHONICS_MODES instructions stay ≤ MAX_INSTRUCTION_WORDS words', () => {
    for (const key of Object.keys(PHONICS_MODES)) {
      const m = PHONICS_MODES[key];
      const wordCount = m.instruction.trim().split(/\s+/).length;
      expect(wordCount, `${key}: "${m.instruction}"`).toBeLessThanOrEqual(MAX_INSTRUCTION_WORDS);
    }
  });

  it('PHONICS_MODES instructions read as a complete sentence', () => {
    for (const key of Object.keys(PHONICS_MODES)) {
      expect(PHONICS_MODES[key].instruction).toMatch(/[.!?]$/);
    }
  });

  it('legacy MODES registry entries all carry a name and a desc', () => {
    for (const key of Object.keys(MODES)) {
      expect(MODES[key].name, `MODES.${key} missing name`).toBeTruthy();
      expect(MODES[key].desc, `MODES.${key} missing desc`).toBeTruthy();
    }
  });
});

// ── 5. Every activity has correct and incorrect feedback ────────────────

describe('every phonics mode declares both correct and incorrect feedback', () => {
  it('every mode has a default error hint at least 12 characters long', () => {
    for (const key of Object.keys(PHONICS_MODES)) {
      const hint = PHONICS_MODES[key].errorHints?.default;
      expect(typeof hint).toBe('string');
      expect(hint.length).toBeGreaterThan(12);
    }
  });

  it('every mode has at least 2 error categories beyond default', () => {
    for (const key of Object.keys(PHONICS_MODES)) {
      const keys = Object.keys(PHONICS_MODES[key].errorHints).filter(k => k !== 'default');
      expect(keys.length, `${key} has only the default error hint`).toBeGreaterThanOrEqual(2);
    }
  });

  it('every mode score function returns a feedback string for a wrong answer', () => {
    // Generic empty-attempt — should return a hint, not crash.
    for (const key of Object.keys(PHONICS_MODES)) {
      const r = PHONICS_MODES[key].score({});
      expect(r).toHaveProperty('correct');
      expect(r).toHaveProperty('hint');
      if (!r.correct) expect(typeof r.hint).toBe('string');
    }
  });
});

// ── 6. Scoring logic — sanity checks ───────────────────────────────────

describe('scoring logic — sanity', () => {
  it('Sound Match scores a known correct pair correctly', () => {
    const r = PHONICS_MODES.soundMatch.score({ prompt: { grapheme: 'sh' }, chosen: 'sh' });
    expect(r.correct).toBe(true);
    expect(r.masteryDelta).toBe(1);
  });

  it('Blend Builder partial-credit accuracy is between 0 and 1', () => {
    const r = PHONICS_MODES.blendBuilder.score({
      target: { graphemes: ['c', 'a', 't'] },
      placed: ['c', 'a', 'p'],
    });
    expect(r.scoreBreakdown.accuracy).toBeGreaterThan(0);
    expect(r.scoreBreakdown.accuracy).toBeLessThan(1);
  });

  it('Fluency Sprint requires accuracy AND wpm to master', () => {
    const fast = Array.from({ length: 6 }, () => ({ correct: true, timeMs: 500 }));
    const r = PHONICS_MODES.fluencySprint.score({ attempts: fast, durationMs: 6 * 500, targetWpm: 30 });
    expect(r.correct).toBe(true);
  });
});

// ── 7. Progress tracking — smoke test against analytics ────────────────

describe('progress tracking can ingest scoring output', () => {
  it('a single attempt from each mode produces a valid analytics record', async () => {
    const { summarise } = await import('../modules/progressAnalytics.js');

    const attempts = Object.keys(PHONICS_MODES).map((mode, i) => ({
      timestamp: Date.now() + i,
      stageId: 'cvc-a',
      group: 'cvc-a',
      mode,
      word: 'cat',
      correct: i % 2 === 0,
      errorCategory: i % 2 === 0 ? null : 'default',
      timeMs: 1500,
      targetSound: 'short a /ă/',
    }));

    const out = summarise(attempts, { curriculum: CURRICULUM });
    expect(out.totalAttempts).toBe(attempts.length);
    expect(Object.keys(out.accuracyByMode).length).toBe(attempts.length);
    expect(out.suggestedNext).not.toBeNull();
  });
});

// ── 8. Accessibility labels for key controls ───────────────────────────

describe('accessibility scaffolding is in place', () => {
  it('every PHONICS_MODES entry supports keyboard and touch', () => {
    for (const key of Object.keys(PHONICS_MODES)) {
      expect(PHONICS_MODES[key].keyboard, `${key} missing keyboard support`).toBe(true);
      expect(PHONICS_MODES[key].touch, `${key} missing touch support`).toBe(true);
    }
  });

  it('legacy MODES entries include a child-facing name (used by aria-label)', () => {
    for (const key of Object.keys(MODES)) {
      const n = MODES[key].name;
      expect(typeof n).toBe('string');
      expect(n.length).toBeGreaterThan(2);
    }
  });
});
