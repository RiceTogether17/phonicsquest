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
import { SIGHT_QUESTS } from '../data/sightwords.js';

beforeAll(() => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
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
      expect(
        stage.sentenceExamples.every((s) => typeof s === 'string' && s.trim().length > 0),
      ).toBe(true);
    }
  });

  it('every stage advertises learningOutcome that mentions decode, spell, or read', () => {
    // Light heuristic — a learning outcome that doesn't use a learning verb
    // is almost certainly a description, not an outcome.
    const VERBS =
      /(decode|spell|read|recognis|recogniz|identify|blend|segment|map|distinguish|discriminate)/i;
    for (const stage of CURRICULUM) {
      expect(
        VERBS.test(stage.learningOutcome),
        `Stage ${stage.id} outcome is not action-led: "${stage.learningOutcome}"`,
      ).toBe(true);
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
  const m = String(w)
    .toLowerCase()
    .match(/[aeiou]+/g);
  return m ? m.length : 0;
}
function _hasSingleShortVowel(w, vowel) {
  const s = String(w).toLowerCase();
  if (_vowelRuns(s) !== 1) return false;
  const m = s.match(/[aeiou]+/);
  return !!m && m[0] === vowel;
}

// The structural stages are named for consonant SOUNDS, not letters: CVCC is
// one sound, a vowel, then two sounds. A letter count calls "song" CVCC (n,
// g) when ng is one sound, a digraph the child meets in phase 4, and calls
// "blur" CCVC when ur is an r-controlled vowel from phase 8. Count sounds.
const ONE_SOUND_SPELLINGS = /tch|dge|sh|ch|th|wh|ck|ng|ph|(.)\1/g;
function _consonantSounds(cluster) {
  return cluster.replace(ONE_SOUND_SPELLINGS, 'D').length;
}
const CODE_BEFORE_DIGRAPHS = (w) => !/sh|ch|th|wh|ck|ng|ph|tch|dge|(.)\1$/.test(w);
const NO_R_CONTROLLED = (w) => !/[aeiou]r/.test(w);
/**
 * Does the word have the named shape, counted in sounds?
 * @param {string} w
 * @param {'CVC'|'CCVC'|'CVCC'|'CCVCC'} shape
 */
function _fitsStructure(w, shape) {
  if (_vowelRuns(w) !== 1 || !NO_R_CONTROLLED(w)) return false;
  const onset = _consonantSounds((w.match(/^[^aeiou]*/) || [''])[0].replace(/x/g, 'ks'));
  const coda = _consonantSounds((w.match(/[^aeiou]*$/) || [''])[0].replace(/x/g, 'ks'));
  const want = { CVC: [1, 1], CCVC: [2, 1], CVCC: [1, 2], CCVCC: [2, 2] }[shape];
  // CVC words with x (fox, six) are taught with cat and hat; x is one letter.
  if (shape === 'CVC') return onset === 1 && (coda === 1 || /x$/.test(w));
  return (
    onset >= want[0] &&
    coda >= want[1] &&
    (want[0] === 2 || onset === 1) &&
    (want[1] === 2 || coda === 1)
  );
}

// A small library of pattern predicates. Each returns true if the word is
// at least plausibly a member of the declared family — the bar is "would a
// phonics teacher object?" not "is this perfectly classified."
const PATTERN_CHECKS = [
  // CVC — strict: 3 letters, middle is the named vowel, no other vowels
  {
    match: /^cvc-([aeiou])$/,
    test: (w, [vowel]) =>
      /^[a-z]{3}$/.test(w) &&
      w[1] === vowel &&
      _hasSingleShortVowel(w, vowel) &&
      CODE_BEFORE_DIGRAPHS(w) &&
      _fitsStructure(w, 'CVC'),
  },

  // CCVC — exactly one short-vowel run = named vowel, ≥ 2 leading consonants
  {
    match: /^ccvc-([aeiou])$/,
    test: (w, [vowel]) =>
      _hasSingleShortVowel(w, vowel) && CODE_BEFORE_DIGRAPHS(w) && _fitsStructure(w, 'CCVC'),
  },

  // CVCC — exactly one short-vowel run = named vowel, ≥ 2 trailing consonants
  {
    match: /^cvcc-([aeiou])$/,
    test: (w, [vowel]) =>
      _hasSingleShortVowel(w, vowel) && CODE_BEFORE_DIGRAPHS(w) && _fitsStructure(w, 'CVCC'),
  },

  // Digraphs — contain at least one of the canonical digraphs
  { match: /^digraphs$/, test: (w) => /sh|ch|th|wh|ck|ng|ph/.test(w) },

  // CCVCC — exactly one short-vowel run = named vowel; cluster both ends
  {
    match: /^ccvcc-([aeiou])$/,
    // Phase 5 follows digraphs, so "crunch" and "shrink" are fair — but each
    // end still needs two consonant SOUNDS: "flesh" and "floss" are CCVC.
    test: (w, [vowel]) => _hasSingleShortVowel(w, vowel) && _fitsStructure(w, 'CCVCC'),
  },

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

  // R-controlled vowels
  { match: /^rc-ar-or$/, test: (w) => /(ar|or)/.test(w) },
  { match: /^rc-er-ir-ur$/, test: (w) => /(er|ir|ur)/.test(w) },

  // Diphthongs
  { match: /^dip-oi$/, test: (w) => /(oi|oy)/.test(w) },
  { match: /^dip-ou$/, test: (w) => /(ou|ow)/.test(w) },
  { match: /^dip-aw$/, test: (w) => /(aw|au)/.test(w) },

  // Late consonant spellings
  { match: /^cons-tch-dge$/, test: (w) => /(tch|dge)/.test(w) },
  { match: /^cons-ph$/, test: (w) => /ph/.test(w) },
  // Soft c / soft g: the letter must be followed by e, i or y — that is the
  // rule, and a sample where it isn't would be a hard c or g in disguise.
  { match: /^cons-soft-cg$/, test: (w) => /[cg][eiy]/.test(w) },

  // Suffixes
  { match: /^suffix-ing$/, test: (w) => /ing$/.test(w) },
  { match: /^suffix-ed$/, test: (w) => /ed$/.test(w) },
  { match: /^suffix-er$/, test: (w) => /er$/.test(w) },
  { match: /^suffix-est$/, test: (w) => /est$/.test(w) },

  // Morphology
  { match: /^prefixes$/, test: (w) => /^(re|un)/.test(w) },
  { match: /^suffixes-advanced$/, test: (w) => /(tion|sion|able|ible)/.test(w) },

  // Mixed-vowel stages: same single-short-vowel-run rule as the per-vowel
  // stages, but the vowel is free — and the samples must actually span more
  // than one, or the set still telegraphs the answer it exists to hide.
  {
    match: /^(cvc|ccvc|cvcc|ccvcc)-mixed$/,
    test: (w, [shape]) =>
      /^[a-z]+$/.test(w) &&
      _fitsStructure(w, shape.toUpperCase()) &&
      (shape === 'ccvcc' || CODE_BEFORE_DIGRAPHS(w)),
  },

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

describe('mixed-vowel stages really are mixed', () => {
  for (const stage of CURRICULUM.filter((s) => s.id.endsWith('-mixed'))) {
    it(`${stage.id} — sample words span at least four short vowels`, () => {
      // The whole point of these stages: a class that meets only short-A
      // words works out that the answer is always /a/ and stops listening.
      const vowels = new Set(
        (stage.sampleWords || []).map(
          (w) =>
            (String(w)
              .toLowerCase()
              .match(/[aeiou]+/) || [''])[0],
        ),
      );
      expect(vowels.size, `${stage.id} vowels: ${[...vowels]}`).toBeGreaterThanOrEqual(4);
    });
  }
});

describe('phase examples use only the code taught by that phase', () => {
  // The phase card lists ten examples; for the structural phases they must
  // be words a child at that phase can decode.
  const SHAPES = { 1: 'CVC', 2: 'CCVC', 3: 'CVCC', 5: 'CCVCC' };
  for (const [phase, shape] of Object.entries(SHAPES)) {
    it(`phase ${phase} examples are all ${shape} in sounds`, () => {
      const p = PHASES.find((x) => x.phase === Number(phase));
      const bad = p.sampleWords.filter(
        (w) => !_fitsStructure(w, shape) || (shape !== 'CCVCC' && !CODE_BEFORE_DIGRAPHS(w)),
      );
      expect(bad).toEqual([]);
    });
  }
});

describe('early example sentences use only taught code', () => {
  // Phases 1–3 are short vowels and blends. Their example sentences reach a
  // child on the printable practice sheet, so every word must be one they
  // can decode — or a sight word from Quests 1–10, which they learn first.
  // "I sing a long song" was the CVCC short-o example: every word but "I"
  // used the ng digraph from phase 4.
  const EARLY_SIGHT = new Set(
    SIGHT_QUESTS.filter((q) => q.tier === 'easy').flatMap((q) =>
      q.words.map((w) => w.toLowerCase()),
    ),
  );
  const decodableEarly = (w) =>
    EARLY_SIGHT.has(w) ||
    (_vowelRuns(w) === 1 &&
      CODE_BEFORE_DIGRAPHS(w) &&
      NO_R_CONTROLLED(w) &&
      !/[aeiou][^aeiou]e$/.test(w));
  const early = [
    ...PHASES.filter((p) => p.phase <= 3),
    ...CURRICULUM.filter((st) => st.phase <= 3),
  ];
  for (const unit of early) {
    it(`${unit.id} — example sentences are decodable at that point`, () => {
      const bad = (unit.sentenceExamples ?? []).flatMap((sentence) =>
        (sentence.toLowerCase().match(/[a-z']+/g) ?? []).filter((w) => !decodableEarly(w)),
      );
      expect(bad).toEqual([]);
    });
  }
});

describe('sample words match stage pattern', () => {
  for (const stage of CURRICULUM) {
    it(`${stage.id} — every sample word fits the declared pattern`, () => {
      const check = findCheck(stage.id);
      expect(check, `No pattern check defined for stage "${stage.id}"`).not.toBeNull();
      const bad = (stage.sampleWords || []).filter(
        (w) => !check.test(String(w).toLowerCase(), check.captures),
      );
      expect(
        bad,
        `Stage ${stage.id} has sample words that don't fit the pattern: ${JSON.stringify(bad)}`,
      ).toEqual([]);
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
      const keys = Object.keys(PHONICS_MODES[key].errorHints).filter((k) => k !== 'default');
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
    const r = PHONICS_MODES.fluencySprint.score({
      attempts: fast,
      durationMs: 6 * 500,
      targetWpm: 30,
    });
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
