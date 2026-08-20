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
  PROPER_NOUNS,
  ONOMATOPOEIA,
  isWordDecodable,
} from '../modules/decodability.js';
import { getHFWTier } from '../data/hfw.js';
import { CURRICULUM } from '../data/curriculum.js';

/**
 * Regression floors for the computed decodable ratio, pinned from the
 * post-audit corpus (empirical minimums: A .850, B .918, C .944, D .993).
 * New stories may not drag a band below its floor.
 */
const RATIO_FLOORS = { A: 0.84, B: 0.9, C: 0.93, D: 0.95 };

/**
 * Floors for the phases that carry a short-vowel budget, keyed by how many
 * vowels the phase has released.
 *
 * These are lower than the band floor for a structural reason, not a
 * slackening of standards. English function words — the, is, of, to, on, in,
 * he, said — carry mostly non-/a/ vowels, so until their vowel is taught they
 * can only reach the page through the sight-word route, where they count as
 * `sight` rather than `decodable`. Function words are roughly 40% of running
 * text, so an honest single-vowel story cannot exceed about 0.67 however it is
 * written; the band floor of 0.84 was pinned when cross-vowel words such as
 * "top" and "wind" still counted as decodable at short-a.
 *
 * The guarantee that actually protects the reader is unchanged and stricter
 * than before: "no story contains stretch words outside its allowances" above,
 * which means every word is readable by some legitimate route.
 */
const VOWEL_BUDGET_FLOORS = { 1: 0.55, 3: 0.8 };

/**
 * The same idea above tier 1. A phase may only use the spellings its own
 * teaching stage has reached, so an early long-a story cannot borrow "high"
 * or "cool" to lift its ratio; the words it loses go to the sight-word route
 * instead. The earlier the stage, the fewer spellings are available, so the
 * floor rises as the budget fills. Keyed by budget size; sizes not listed
 * here fall through to the band floor, which those phases do clear.
 */
const GRAPHEME_BUDGET_FLOORS = { 3: 0.84, 6: 0.85 };

function ratioFloorFor(story) {
  const phase = getStoryPhase(story.phase);
  const budget = phase?.shortVowels?.length;
  if (budget && VOWEL_BUDGET_FLOORS[budget] !== undefined) return VOWEL_BUDGET_FLOORS[budget];
  const graphemeBudget = cumulativeBudget(phase)?.size;
  if (graphemeBudget && GRAPHEME_BUDGET_FLOORS[graphemeBudget] !== undefined) {
    return GRAPHEME_BUDGET_FLOORS[graphemeBudget];
  }
  return RATIO_FLOORS[story.band];
}

/** Everything a budgeted phase has been taught, including earlier stages. */
function cumulativeBudget(phase) {
  if (!phase?.graphemeBudget) return null;
  const out = new Set();
  for (const p of STORY_PHASES) {
    if (!p.graphemeBudget) continue;
    for (const g of p.graphemeBudget) out.add(g);
    if (p.id === phase.id) return out;
  }
  return out;
}

/** Most stretch words a single story may pre-teach via `pretaught`. */
const PRETAUGHT_CAPS = { A: 2, B: 3, C: 3, D: 3 };

const VALID_LINE_TYPES = new Set([
  'text',
  'refrain',
  'end',
  'intro',
  'label',
  'beat',
  'paragraph',
  'chapter',
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

const analyses = new Map(STORIES.map((s) => [s.id, analyzeStory(s)]));

describe('story schema (R1)', () => {
  it('ids are unique', () => {
    const ids = STORIES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('bands, phases, levels and required fields are valid', () => {
    const bands = new Set(BAND_META.map((b) => b.band));
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
        `${s.id}: needs talkAboutIt or comprehension`,
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
      expect(
        s.allowedHFWTier,
        `${s.id}: tier ${s.allowedHFWTier} > cap ${hfwCap}`,
      ).toBeLessThanOrEqual(hfwCap);
    }
  });
});

describe('word legality (R3) — the core promise', () => {
  it('no story contains stretch words outside its allowances', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      const list = computed.stretchWords
        .map((w) => `"${w.word}" (needs tier ${w.requiredTier})`)
        .join(', ');
      expect(
        computed.stretchWords.length,
        `${s.id} [Band ${s.band} · ${s.phase}] has unsupported words: ${list}`,
      ).toBe(0);
    }
  });

  it('pretaught lists stay within their band budget', () => {
    for (const s of STORIES) {
      const cap = PRETAUGHT_CAPS[s.band];
      expect(s.pretaught?.length ?? 0, `${s.id}: pretaught`).toBeLessThanOrEqual(cap);
    }
  });
});

describe('word counts (R4)', () => {
  it('computed counts sit inside the band/format range and match the metadata', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      const { min, max } = getStoryRules(s);
      expect(
        computed.wordCount,
        `${s.id}: ${computed.wordCount} words, range ${min}–${max}`,
      ).toBeGreaterThanOrEqual(min);
      expect(
        computed.wordCount,
        `${s.id}: ${computed.wordCount} words, range ${min}–${max}`,
      ).toBeLessThanOrEqual(max);
      expect(
        s.actualWordCount,
        `${s.id}: actualWordCount stale — run audit-stories.mjs --fix`,
      ).toBe(computed.wordCount);
    }
  });
});

describe('decodable ratios (R5)', () => {
  it('declared ratio matches the computed one (±0.02)', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      expect(
        Math.abs(s.decodableRatio - computed.decodableRatio),
        `${s.id}: declared ${s.decodableRatio}, computed ${computed.decodableRatio.toFixed(2)}`,
      ).toBeLessThanOrEqual(0.02);
    }
  });

  it('every story clears its ratio floor', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      const floor = ratioFloorFor(s);
      expect(
        computed.decodableRatio,
        `${s.id}: ratio ${computed.decodableRatio.toFixed(3)} below floor ${floor}`,
      ).toBeGreaterThanOrEqual(floor);
    }
  });

  it('still holds full-vowel Band A stories to the band floor', () => {
    // Only the budgeted phases get the structural allowance; once all five
    // short vowels are released there is no excuse for a low ratio.
    const fullVowel = STORIES.filter(
      (s) => s.band === 'A' && getStoryPhase(s.phase)?.shortVowels === 'aeiou',
    );
    expect(fullVowel.length).toBeGreaterThan(0);
    for (const s of fullVowel) {
      expect(analyses.get(s.id).computed.decodableRatio).toBeGreaterThanOrEqual(RATIO_FLOORS.A);
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
        const needed =
          g.length === 1
            ? g === 'y'
              ? 2
              : 1
            : (GRAPHEME_TIERS[g.toLowerCase()] ?? SUFFIX_TIERS[g.toLowerCase()]);
        expect(needed, `${s.id}: unknown target grapheme "${g}"`).toBeDefined();
        expect(
          needed,
          `${s.id}: target "${g}" needs tier ${needed}, phase grants ${tier}`,
        ).toBeLessThanOrEqual(tier);
      }
    }
  });

  it('every target grapheme actually occurs in the story text', () => {
    for (const s of STORIES) {
      const text = extractCountableTokens(s).join(' ');
      for (const g of s.targetGraphemes) {
        expect(
          countFocusGrapheme(g, text),
          `${s.id}: declared target "${g}" never appears`,
        ).toBeGreaterThanOrEqual(1);
      }
    }
  });
});

describe('proper-noun hygiene (R8)', () => {
  it('every capitalised mid-sentence word is decodable, allowed, or whitelisted', () => {
    for (const s of STORIES) {
      const unknown = findUnknownCapitalised(s);
      expect(unknown.length, `${s.id}: add to PROPER_NOUNS or fix: ${unknown.join(', ')}`).toBe(0);
    }
  });
});

describe('coverage sufficiency (R9)', () => {
  it('every band × phase cell keeps its minimum story count', () => {
    for (const { band, phase, min } of STORY_SUFFICIENCY_TARGETS) {
      const n = STORIES.filter((s) => s.band === band && s.phase === phase).length;
      expect(n, `Band ${band} · ${phase}: ${n} stories, need ≥ ${min}`).toBeGreaterThanOrEqual(min);
    }
  });

  it('every STORY_PHASES target cell is a real phase id', () => {
    const ids = new Set(STORY_PHASES.map((p) => p.id));
    for (const t of STORY_SUFFICIENCY_TARGETS) {
      expect(ids.has(t.phase), `target phase ${t.phase}`).toBe(true);
    }
  });
});

/**
 * The short-vowel phases are all tier 1, so tiers alone cannot tell a
 * "short-a" story apart from a digraph story. Before the vowel budget existed,
 * the first four stories a child ever read carried all five short vowels and
 * were 72–81% readable at their stated phase — the reader's only remaining
 * strategy being to guess. These pin the budget in place.
 */
describe('short-vowel phase budget', () => {
  const PHASE_VOWELS = {
    'short-a': 'a',
    'short-ei': 'aei',
    'short-ou': 'aeiou',
    'mixed-short': 'aeiou',
    'short-digraphs': 'aeiou',
  };

  it('declares a cumulative vowel budget on every tier-1 phase', () => {
    for (const phase of STORY_PHASES.filter((p) => p.tier === 1)) {
      expect(phase.shortVowels, `${phase.id} has no vowel budget`).toBeTruthy();
      expect(PHASE_VOWELS[phase.id]).toBe(phase.shortVowels);
    }
    // Above tier 1 vowels come in teams and split digraphs, where a
    // letter-level budget would misread "rain" as needing /a/ and /i/.
    for (const phase of STORY_PHASES.filter((p) => p.tier > 1)) {
      expect(phase.shortVowels, `${phase.id} must not carry a vowel budget`).toBeUndefined();
    }
  });

  it('uses no vowel a child has not met, in any Band A story', () => {
    const offenders = [];
    for (const story of STORIES.filter((s) => s.band === 'A')) {
      const allowed = new Set((PHASE_VOWELS[story.phase] || 'aeiou').split(''));
      const sight = new Set([...(story.sightWords || [])]);
      for (const token of extractCountableTokens(story)) {
        if (sight.has(token) || PROPER_NOUNS.has(token) || ONOMATOPOEIA.has(token)) continue;
        if (getHFWTier(token) !== null) continue;
        const vowels = new Set(token.match(/[aeiou]/g) || []);
        for (const v of vowels) {
          if (!allowed.has(v))
            offenders.push(`${story.id} (${story.phase}): "${token}" needs /${v}/`);
        }
      }
    }
    expect([...new Set(offenders)], [...new Set(offenders)].slice(0, 12).join('\n')).toEqual([]);
  });

  it('rejects a word outside the budget even though its tier allows it', () => {
    // "top" is tier 1, so the tier check alone would pass it at short-a.
    expect(isWordDecodable('top', 'short-a')).toBe(false);
    expect(isWordDecodable('top', 'short-ou')).toBe(true);
    expect(isWordDecodable('hat', 'short-a')).toBe(true);
    // Above tier 1 the budget must not interfere.
    expect(isWordDecodable('rain', 'long-a')).toBe(true);
  });
});

/**
 * A tier is a coarse release; a phase is a teaching stage inside it. Tier 2
 * hands over every long-vowel spelling at once, tier 3 every r-controlled
 * one — so without a sub-gate a story named "long-a" could serve "high" and
 * "cool", an "r-controlled" story could serve "watched", and a "diphthongs"
 * story could serve "caught". All four were in the corpus.
 */
describe('grapheme phase budget', () => {
  it('declares a cumulative budget on every phase above tier 1', () => {
    // The teacher-supported formats are the deliberate exception: they get
    // the full code (see the banner comments in stories.js).
    const UNGATED = new Set(['chapter', 'extension-sg']);
    for (const phase of STORY_PHASES.filter((p) => p.tier > 1 && !UNGATED.has(p.id))) {
      expect(phase.graphemeBudget, `${phase.id} has no grapheme budget`).toBeTruthy();
    }
    // Tier 1 uses the letter-level short-vowel budget instead.
    for (const phase of STORY_PHASES.filter((p) => p.tier === 1)) {
      expect(phase.graphemeBudget, `${phase.id} must not carry one`).toBeUndefined();
    }
  });

  it('never lets a phase spend a grapheme a later phase introduces', () => {
    // The budget is defined by array order, so a phase whose stage adds a
    // grapheme must come before every phase that relies on it.
    const seen = new Set();
    for (const phase of STORY_PHASES) {
      for (const g of phase.graphemeBudget || []) {
        expect(seen.has(g), `${phase.id} re-introduces "${g}"`).toBe(false);
        seen.add(g);
      }
    }
  });

  it('rejects a spelling the phase has not reached, and accepts an earlier one', () => {
    // Same tier for each pair, so the tier check alone would pass either.
    expect(isWordDecodable('high', 'long-a')).toBe(false);
    expect(isWordDecodable('high', 'long-i')).toBe(true);
    expect(isWordDecodable('cool', 'long-o')).toBe(false);
    expect(isWordDecodable('cool', 'long-u')).toBe(true);
    expect(isWordDecodable('caught', 'diphthongs')).toBe(false);
    expect(isWordDecodable('caught', 'advanced-vowel')).toBe(true);
    // Cumulative: a later phase keeps everything the earlier ones taught.
    expect(isWordDecodable('rain', 'long-u')).toBe(true);
    expect(isWordDecodable('rain', 'diphthongs')).toBe(true);
  });

  it('reads word-initial y as the consonant it is, not a long vowel', () => {
    // "yes" must not be gated behind long-i just because it contains a y.
    expect(isWordDecodable('yes', 'long-a')).toBe(true);
    expect(isWordDecodable('cry', 'long-a')).toBe(false);
    expect(isWordDecodable('cry', 'long-i')).toBe(true);
  });

  /**
   * tch, dge and ph were once granted by tier 3 with no lesson behind them:
   * the curriculum's phase 7-9 sequence was entirely vowel work and taught
   * those spellings nowhere. curriculum.js now carries cons-tch-dge and
   * cons-ph at phase 8, so the story-side release has a lesson to point at.
   * This test is the join between the two banks — if the lessons are ever
   * removed, the story budget must go with them.
   */
  it('releases tch/dge/ph only because a lesson now teaches them', () => {
    const taught = new Set(
      CURRICULUM.filter((st) => ['cons-tch-dge', 'cons-ph'].includes(st.id)).flatMap((st) =>
        st.sampleWords.map((w) => w.toLowerCase()),
      ),
    );
    expect(taught.size, 'cons-tch-dge / cons-ph lessons are missing').toBeGreaterThan(0);
    for (const g of ['tch', 'dge', 'ph']) {
      expect(
        [...taught].some((w) => w.includes(g)),
        `no lesson word contains "${g}"`,
      ).toBe(true);
    }
    // Released by the digraphs phase, and not before it.
    expect(isWordDecodable('catch', 'r-controlled')).toBe(false);
    expect(isWordDecodable('catch', 'digraphs')).toBe(true);
    expect(isWordDecodable('photograph', 'advanced-vowel')).toBe(true);
  });

  it('leaves the teacher-supported formats on the full code', () => {
    expect(isWordDecodable('caught', 'chapter')).toBe(true);
    expect(isWordDecodable('caught', 'extension-sg')).toBe(true);
  });
});

/**
 * `tier` and `curriculumPhase` are independent axes: tier follows the band
 * ladder the stories ship on, curriculumPhase names the lesson phase that
 * teaches the content and gates tricky words. The two were once transposed
 * — r-controlled claimed phase 7 (which teaches diphthongs) and vice versa —
 * so each pointed at the other's tricky-word set.
 */
describe('phase ↔ curriculum alignment', () => {
  it('points each phase at the lesson phase that actually teaches it', () => {
    const expected = {
      'r-controlled': 8, // phase-8-advanced: ar, or, er/ir/ur
      diphthongs: 7, // phase-7-diphthongs: oi/oy, ou/ow, aw/au
      suffixes: 9, // phase-9-suffixes: -ing, -ed, -er, -est
    };
    for (const [id, phase] of Object.entries(expected)) {
      expect(getStoryPhase(id).curriculumPhase, id).toBe(phase);
    }
  });

  it('keeps curriculumPhase non-decreasing along the story ladder, bar the known swap', () => {
    // Diphthongs are taught (phase 7) before r-controlled (phase 8) but read
    // after them, so this one inversion is expected and documented.
    const inversions = [];
    for (let i = 1; i < STORY_PHASES.length; i += 1) {
      if (STORY_PHASES[i].curriculumPhase < STORY_PHASES[i - 1].curriculumPhase) {
        inversions.push(STORY_PHASES[i].id);
      }
    }
    expect(inversions).toEqual(['diphthongs']);
  });
});

/**
 * Comprehension used to run backwards: every 43-word Band A mini carried a
 * question, while all 29 Band C and D stories — the longest, most complex
 * texts in the app — carried none, so the check panel silently never rendered
 * for them.
 */
describe('comprehension questions', () => {
  it('every story ends with something to talk about', () => {
    const silent = STORIES.filter((s) => !(s.talkAboutIt || []).length).map((s) => s.id);
    expect(silent, silent.join(', ')).toEqual([]);
  });

  it('longer bands carry a follow-up thinking question, not just retrieval', () => {
    const thin = STORIES.filter(
      (s) => (s.band === 'C' || s.band === 'D') && (s.talkAboutIt || []).length < 2,
    ).map((s) => s.id);
    expect(thin, thin.join(', ')).toEqual([]);
  });

  it('asks more than literal recall across the corpus', () => {
    const all = STORIES.flatMap((s) => s.talkAboutIt || []);
    // A question that makes a reader go beyond lifting the answer off the page.
    const thinking = all.filter((q) =>
      /\bwhy\b|what does .* mean|do you think|do you agree|what might|what will|tell you|show about|change/i.test(
        q,
      ),
    );
    expect(all.length).toBeGreaterThan(90);
    expect(thinking.length / all.length).toBeGreaterThan(0.4);
  });

  it('every question is a real question addressed to the reader', () => {
    for (const story of STORIES) {
      for (const q of story.talkAboutIt || []) {
        expect(q.trim().endsWith('?'), `${story.id}: "${q}"`).toBe(true);
        expect(q.length, `${story.id}: "${q}" is too terse`).toBeGreaterThan(15);
      }
    }
  });
});
