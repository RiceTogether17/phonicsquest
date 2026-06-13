/**
 * Story-bank integrity — every story in src/data/stories.js must be
 * honestly decodable at its declared band/phase.
 *
 * The rules live in src/modules/decodability.js; this suite enforces them
 * corpus-wide. When a story fails here, run
 *
 *   node scripts/audit-stories.mjs <storyId>
 *
 * for a word-by-word report, fix the text or the metadata (never weaken a
 * floor to make a story fit), and re-run `--fix` to regenerate counts.
 */
import { describe, it, expect } from 'vitest';
import { STORIES, BAND_META } from '../data/stories.js';
import {
  analyzeStory,
  getStoryPhase,
  getStoryRules,
  countFocusGrapheme,
  findUnknownCapitalised,
  extractCountableTokens,
  GRAPHEME_TIERS,
  SUFFIX_TIERS,
  STORY_PHASES,
} from '../modules/decodability.js';

/**
 * Regression floors for the computed decodable ratio, pinned from the
 * post-audit corpus (empirical minimums: A .850, B .918, C .944, D .993).
 * New stories may not drag a band below its floor.
 */
const RATIO_FLOORS = { A: 0.84, B: 0.9, C: 0.93, D: 0.95 };

/** Most stretch words a single story may pre-teach via `pretaught`. */
const PRETAUGHT_CAPS = { A: 2, B: 3, C: 3, D: 3 };

const VALID_LINE_TYPES = new Set([
  'text', 'refrain', 'end', 'intro', 'label', 'beat', 'paragraph', 'chapter',
]);

/**
 * Minimum story counts per band × phase cell. This is the coverage
 * regression guard (same pattern as CLOZE_SUFFICIENCY_TARGETS in
 * dataIntegrity.test.js) — extend it when content lands, never shrink it.
 */
const STORY_SUFFICIENCY_TARGETS = [
  { band: 'A', phase: 'short-a', min: 4 },
  { band: 'A', phase: 'short-ei', min: 4 },
  { band: 'A', phase: 'short-ou', min: 4 },
  { band: 'A', phase: 'mixed-short', min: 4 },
  { band: 'B', phase: 'long-a', min: 3 },
  { band: 'B', phase: 'long-e', min: 3 },
  { band: 'B', phase: 'long-i', min: 3 },
  { band: 'B', phase: 'long-o', min: 3 },
  { band: 'B', phase: 'long-u', min: 3 },
  { band: 'B', phase: 'short-digraphs', min: 2 },
  { band: 'B', phase: 'extension-sg', min: 5 },
  { band: 'C', phase: 'r-controlled', min: 7 },
  { band: 'C', phase: 'digraphs', min: 3 },
  { band: 'C', phase: 'suffixes', min: 1 },
  { band: 'C', phase: 'extension-sg', min: 1 },
  { band: 'D', phase: 'diphthongs', min: 4 },
  { band: 'D', phase: 'advanced-vowel', min: 6 },
  { band: 'D', phase: 'chapter', min: 5 },
];

const analyses = new Map(STORIES.map(s => [s.id, analyzeStory(s)]));

describe('story schema (R1)', () => {
  it('ids are unique', () => {
    const ids = STORIES.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('bands, phases, levels and required fields are valid', () => {
    const bands = new Set(BAND_META.map(b => b.band));
    for (const s of STORIES) {
      expect(bands.has(s.band), `${s.id}: band ${s.band}`).toBe(true);
      expect(getStoryPhase(s.phase), `${s.id}: phase ${s.phase}`).toBeTruthy();
      const rules = getStoryRules(s);
      expect(s.level, `${s.id}: level`).toBe(rules.level);
      expect(s.title, `${s.id}: title`).toBeTruthy();
      expect(s.emoji, `${s.id}: emoji`).toBeTruthy();
      expect(s.illustration, `${s.id}: illustration`).toBeTruthy();
      expect(s.targetGraphemes?.length, `${s.id}: targetGraphemes`).toBeGreaterThan(0);
      expect(
        (s.talkAboutIt?.length ?? 0) + (s.comprehension?.length ?? 0),
        `${s.id}: needs talkAboutIt or comprehension`
      ).toBeGreaterThan(0);
      for (const line of s.lines) {
        expect(VALID_LINE_TYPES.has(line.type), `${s.id}: line type ${line.type}`).toBe(true);
      }
    }
  });
});

describe('HFW tier caps (R2)', () => {
  it('allowedHFWTier never exceeds the band/format cap', () => {
    for (const s of STORIES) {
      const { hfwCap } = getStoryRules(s);
      expect(s.allowedHFWTier, `${s.id}: tier ${s.allowedHFWTier} > cap ${hfwCap}`)
        .toBeLessThanOrEqual(hfwCap);
    }
  });
});

describe('word legality (R3) — the core promise', () => {
  it('no story contains stretch words outside its allowances', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      const list = computed.stretchWords
        .map(w => `"${w.word}" (needs tier ${w.requiredTier})`)
        .join(', ');
      expect(
        computed.stretchWords.length,
        `${s.id} [Band ${s.band} · ${s.phase}] has unsupported words: ${list}`
      ).toBe(0);
    }
  });

  it('pretaught lists stay within their band budget', () => {
    for (const s of STORIES) {
      const cap = PRETAUGHT_CAPS[s.band];
      expect((s.pretaught?.length ?? 0), `${s.id}: pretaught`).toBeLessThanOrEqual(cap);
    }
  });
});

describe('word counts (R4)', () => {
  it('computed counts sit inside the band/format range and match the metadata', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      const { min, max } = getStoryRules(s);
      expect(computed.wordCount, `${s.id}: ${computed.wordCount} words, range ${min}–${max}`)
        .toBeGreaterThanOrEqual(min);
      expect(computed.wordCount, `${s.id}: ${computed.wordCount} words, range ${min}–${max}`)
        .toBeLessThanOrEqual(max);
      expect(s.actualWordCount, `${s.id}: actualWordCount stale — run audit-stories.mjs --fix`)
        .toBe(computed.wordCount);
    }
  });
});

describe('decodable ratios (R5)', () => {
  it('declared ratio matches the computed one (±0.02)', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      expect(
        Math.abs(s.decodableRatio - computed.decodableRatio),
        `${s.id}: declared ${s.decodableRatio}, computed ${computed.decodableRatio.toFixed(2)}`
      ).toBeLessThanOrEqual(0.02);
    }
  });

  it('every story clears its band ratio floor', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      expect(
        computed.decodableRatio,
        `${s.id}: ratio ${computed.decodableRatio.toFixed(3)} below Band ${s.band} floor`
      ).toBeGreaterThanOrEqual(RATIO_FLOORS[s.band]);
    }
  });
});

describe('refrains (R6)', () => {
  it('refrainCount matches the refrain lines', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      expect(s.refrainCount, `${s.id}: refrainCount`).toBe(computed.refrainCount);
    }
  });
});

describe('focus honesty (R7)', () => {
  it('every target grapheme is available at the story phase', () => {
    for (const s of STORIES) {
      const { tier } = getStoryPhase(s.phase);
      for (const g of s.targetGraphemes) {
        const needed = g.length === 1
          ? (g === 'y' ? 2 : 1)
          : GRAPHEME_TIERS[g.toLowerCase()] ?? SUFFIX_TIERS[g.toLowerCase()];
        expect(needed, `${s.id}: unknown target grapheme "${g}"`).toBeDefined();
        expect(needed, `${s.id}: target "${g}" needs tier ${needed}, phase grants ${tier}`)
          .toBeLessThanOrEqual(tier);
      }
    }
  });

  it('every target grapheme actually occurs in the story text', () => {
    for (const s of STORIES) {
      const text = extractCountableTokens(s).join(' ');
      for (const g of s.targetGraphemes) {
        expect(
          countFocusGrapheme(g, text),
          `${s.id}: declared target "${g}" never appears`
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });
});

describe('proper-noun hygiene (R8)', () => {
  it('every capitalised mid-sentence word is decodable, allowed, or whitelisted', () => {
    for (const s of STORIES) {
      const unknown = findUnknownCapitalised(s);
      expect(
        unknown.length,
        `${s.id}: add to PROPER_NOUNS or fix: ${unknown.join(', ')}`
      ).toBe(0);
    }
  });
});

describe('coverage sufficiency (R9)', () => {
  it('every band × phase cell keeps its minimum story count', () => {
    for (const { band, phase, min } of STORY_SUFFICIENCY_TARGETS) {
      const n = STORIES.filter(s => s.band === band && s.phase === phase).length;
      expect(n, `Band ${band} · ${phase}: ${n} stories, need ≥ ${min}`).toBeGreaterThanOrEqual(min);
    }
  });

  it('every STORY_PHASES target cell is a real phase id', () => {
    const ids = new Set(STORY_PHASES.map(p => p.id));
    for (const t of STORY_SUFFICIENCY_TARGETS) {
      expect(ids.has(t.phase), `target phase ${t.phase}`).toBe(true);
    }
  });
});
