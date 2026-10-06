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
  classifyWord,
  cleanToken,
  getStoryPhase,
  getStoryRules,
  countFocusGrapheme,
  findUnknownCapitalised,
  extractCountableTokens,
  extractReadTokens,
  wordSoundCode,
  GRAPHEME_TIERS,
  SUFFIX_TIERS,
  STORY_PHASES,
  PROPER_NOUNS,
  ONOMATOPOEIA,
  isWordDecodable,
  requiredTier,
  supportWords,
  storySupportLevel,
  allowanceWords,
  MAX_ALLOWANCE_WORDS,
  MASCOT_NAME,
} from '../modules/decodability.js';
import { getHFWTier } from '../data/hfw.js';
import { CURRICULUM } from '../data/curriculum.js';
import { wordsToMeet } from '../modules/wordsToMeet.js';

/**
 * Regression floors for the computed decodable ratio, pinned from the corpus
 * (empirical minimums: A .513, B .481, C .586, D .557, E .611).
 * New stories may not drag a band below its floor.
 *
 * They were .84–.95 until the checker learned sounds as well as letters.
 * The ratio counts only words a child can sound out with the code taught so
 * far, and a heart word never qualifies: "the", "said", "to", "was", "his",
 * "of", "he" have a part that does not say what its letters were taught to
 * say. Those words are 35–45% of any English sentence, so an honest ratio
 * sits between .5 and .7 in every band; the old figures counted "was" as
 * w-a-s and "last" as a short-a word. Nothing about the stories got harder.
 *
 * The guarantee that actually protects the reader is the stretch test above:
 * every word is readable by some taught route — sounded out, a heart word
 * from the HFW tiers or the sight-word quests, or pre-taught by the story.
 */
const RATIO_FLOORS = { A: 0.5, B: 0.47, C: 0.58, D: 0.55, E: 0.6 };

function ratioFloorFor(story) {
  return RATIO_FLOORS[story.band];
}

/** Most stretch words a single story may pre-teach via `pretaught`. */
const PRETAUGHT_CAPS = { A: 2, B: 3, C: 3, D: 3, E: 3 };

const VALID_LINE_TYPES = new Set([
  'text',
  'refrain',
  'end',
  'intro',
  'label',
  'beat',
  'paragraph',
  'chapter',
  'script', // a line in a play, with its speaker in `role`
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
  { band: 'B', phase: 'long-i', min: 5 },
  { band: 'B', phase: 'long-o', min: 4 },
  { band: 'B', phase: 'long-u', min: 6 },
  { band: 'B', phase: 'short-digraphs', min: 2 },
  { band: 'B', phase: 'extension-sg', min: 5 },
  { band: 'C', phase: 'r-controlled', min: 7 },
  { band: 'C', phase: 'digraphs', min: 3 },
  { band: 'C', phase: 'suffixes', min: 2 },
  { band: 'C', phase: 'extension-sg', min: 1 },
  { band: 'D', phase: 'diphthongs', min: 4 },
  { band: 'D', phase: 'advanced-vowel', min: 7 },
  { band: 'D', phase: 'chapter', min: 5 },
  { band: 'E', phase: 'bridge', min: 4 },
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
});

describe('refrains (R6)', () => {
  it('refrainCount matches the refrain lines', () => {
    for (const s of STORIES) {
      const { computed } = analyses.get(s.id);
      expect(s.refrainCount, `${s.id}: refrainCount`).toBe(computed.refrainCount);
    }
  });

  it('a refrain is made of words the child can already read', () => {
    // Refrains sit outside the word count, so the count's checks never see
    // them. The child reads a refrain more often than any other line, so it
    // is held to the same code: "who took my lime pie?" got into a long-i
    // story with "took", whose oo is not taught until long-u. A word that is
    // readable only with support must be on the story's support list, which
    // is where the words-to-meet panel finds it before the story starts.
    const bad = [];
    for (const s of STORIES) {
      const support = new Set(supportWords(s).map((w) => w.word));
      for (const line of s.lines.filter((l) => l.type === 'refrain')) {
        for (const raw of line.text.split(/[\s–—-]+/)) {
          const word = cleanToken(raw);
          if (!word) continue;
          const { status } = classifyWord(word, s);
          const listed = status === 'decodable' || ONOMATOPOEIA.has(word) || support.has(word);
          if (status === 'stretch' || !listed) bad.push(`${s.id}: "${word}" (${status})`);
        }
      }
    }
    expect(bad).toEqual([]);
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
    // ("caught" made this point once, but its gh is silent: a heart word.)
    expect(isWordDecodable('haul', 'diphthongs')).toBe(false);
    expect(isWordDecodable('haul', 'advanced-vowel')).toBe(true);
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
    expect(isWordDecodable('haul', 'chapter')).toBe(true);
    expect(isWordDecodable('haul', 'extension-sg')).toBe(true);
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
      'r-controlled': 7, // phase-7-bossy-r: ar, or, er/ir/ur
      diphthongs: 8, // phase-8-diphthongs: oi/oy, ou/ow, aw/au
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
      (s) => ['C', 'D', 'E'].includes(s.band) && (s.talkAboutIt || []).length < 2,
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

describe('pre-teach words (R10) — what a child must know before reading alone', () => {
  /**
   * The roadmap (1.4) asks for these to be shown BEFORE the story rather
   * than only inside the validator. The reader used to print
   * `getSightWordsInStory` instead — a different set, drawn from the
   * sight-word quest weave and capped at six.
   */
  it('lists exactly the words that are legal by a route other than decoding', () => {
    for (const story of STORIES) {
      const listed = new Set(supportWords(story).map((w) => w.word));
      const { computed } = analyzeStory(story);
      const expected =
        (computed.byStatus.hfw ?? 0) +
        (computed.byStatus.tricky ?? 0) +
        (computed.byStatus.sight ?? 0) +
        (computed.byStatus.pretaught ?? 0);
      // Counts are per token and the list is per distinct word, so the list
      // can be shorter — but never longer, and never empty when there are
      // support tokens to cover.
      expect(listed.size, `${story.id}`).toBeLessThanOrEqual(expected);
      if (expected > 0) expect(listed.size, `${story.id}`).toBeGreaterThan(0);
      if (expected === 0) expect(listed.size, `${story.id}`).toBe(0);
    }
  });

  it('never lists a word the child could sound out', () => {
    // The old panel spent slots on decodable words like "back" and "plan"
    // while omitting ones the child genuinely needed.
    for (const story of STORIES) {
      for (const { word } of supportWords(story)) {
        expect(isWordDecodable(word, story.phase), `${story.id}: "${word}"`).toBe(false);
      }
    }
  });

  it('leaves the noises out, and every name the child can sound out', () => {
    // A sound effect is read expressively with the adult, not memorised.
    // A name is only homework when it is genuinely un-decodable here — see
    // R12 for the one that is, and for the mascot exception.
    for (const story of STORIES) {
      const phase = getStoryPhase(story.phase);
      for (const { word } of supportWords(story)) {
        expect(ONOMATOPOEIA.has(word), `${story.id}: "${word}" is onomatopoeia`).toBe(false);
        if (PROPER_NOUNS.has(word)) {
          expect(word, `${story.id}: mascot listed`).not.toBe(MASCOT_NAME);
          expect(
            requiredTier(word) > phase.tier,
            `${story.id}: "${word}" is a name the child could sound out`,
          ).toBe(true);
        }
      }
    }
  });

  it('prints the pronoun I as a capital', () => {
    // The classifier lowercases every token, and a panel teaching a child to
    // recognise a word on sight must not show them the wrong shape.
    const withI = STORIES.flatMap((s) => supportWords(s)).filter((w) => w.word === 'i');
    expect(withI.length).toBeGreaterThan(0);
    for (const w of withI) expect(w.display).toBe('I');
    // Every other word prints as itself.
    for (const story of STORIES) {
      for (const w of supportWords(story)) {
        if (w.word !== 'i') expect(w.display).toBe(w.word);
      }
    }
  });

  it('keeps the list shown before reading short enough for one sitting', () => {
    // supportWords is the whole truth, and since the checker learned that
    // "the" and "said" are heart words it runs to thirty in a Band D story.
    // The panel shows the words new to the band (see wordsToMeet.js).
    for (const story of STORIES) {
      expect(wordsToMeet(story).length, `${story.id}`).toBeLessThanOrEqual(12);
    }
  });
});

describe('support level (R11) — the two labels', () => {
  it('marks exactly the teacher-supported formats as adult-supported', () => {
    // These play by looser rules than the shelf they sit on: FORMAT_RULES
    // lifts their HFW cap and STORY_PHASES grants them the full code. Both
    // facts were documented only in code comments.
    const adult = STORIES.filter((s) => storySupportLevel(s) === 'adult-supported');
    const byType = {};
    for (const s of adult) byType[s.textType] = (byType[s.textType] ?? 0) + 1;
    expect(byType).toEqual({ 'extension-sg': 6, 'chapter-reader': 5 });
  });

  it('marks every tightly-controlled reader as independent', () => {
    const independent = STORIES.filter((s) => storySupportLevel(s) === 'independent');
    expect(independent.length).toBe(STORIES.length - 11);
    for (const s of independent) {
      expect(['extension-sg', 'chapter-reader']).not.toContain(s.textType);
    }
  });
});

describe('allowance hygiene (R12) — the validator\u2019s one unbounded escape', () => {
  /**
   * `classifyWord` clears PROPER_NOUNS and ONOMATOPOEIA *before* it checks
   * the tier, so a word in either set is legal however hard it is to decode.
   * Nothing bounded that: a story could have been name soup, and a hard word
   * could have been waved through by appending it to a list.
   *
   * The exposure was never large — the heaviest story leans on one — so
   * these tests exist to keep it that way rather than to repair anything.
   */
  it('no story leans on more than a handful of allowance words', () => {
    for (const story of STORIES) {
      const words = allowanceWords(story);
      expect(
        words.length,
        `${story.id}: ${words.map((w) => w.word).join(', ')}`,
      ).toBeLessThanOrEqual(MAX_ALLOWANCE_WORDS);
    }
  });

  it('only the mascot and one Band C name are ever above their story tier', () => {
    // A new name here is not a bug to route around — it is a decision to
    // make deliberately. If this list grows, justify the addition: the word
    // has to be genuinely pre-taught on the cover or in the picture walk.
    const over = new Set();
    for (const story of STORIES) {
      for (const w of allowanceWords(story)) if (w.overTier) over.add(w.word);
    }
    expect([...over].sort()).toEqual([MASCOT_NAME, 'neighbour'].sort());
  });

  /**
   * The rule that actually closes the escape. An entry nobody uses is a
   * standing permission slip: today it is harmless, but the moment a story
   * reaches for it the word is legal with no further review. Requiring
   * unused entries to be easy words means a hard one cannot be parked in
   * the list ahead of time — it has to arrive with the story that needs it,
   * where the over-tier test above will see it.
   */
  it('an unused whitelist entry can never be a hard word', () => {
    const used = new Set();
    for (const story of STORIES) for (const t of extractCountableTokens(story)) used.add(t);

    for (const set of [PROPER_NOUNS, ONOMATOPOEIA]) {
      for (const word of set) {
        if (used.has(word)) continue;
        expect(
          requiredTier(word),
          `"${word}" is whitelisted, unused, and needs tier ${requiredTier(word)}`,
        ).toBeLessThanOrEqual(2);
      }
    }
  });

  it('a name the child cannot sound out is pre-taught like any other word', () => {
    // `neighbour` in a Band C reader is homework exactly as `said` is.
    const bandC = STORIES.find((s) =>
      allowanceWords(s).some((w) => w.overTier && w.word !== MASCOT_NAME),
    );
    expect(bandC, 'expected a story with an over-tier non-mascot name').toBeTruthy();
    expect(supportWords(bandC).map((w) => w.word)).toContain('neighbour');
  });

  it('the mascot stays off the list — his name is in the title above it', () => {
    for (const story of STORIES) {
      expect(
        supportWords(story).map((w) => w.word),
        `${story.id}`,
      ).not.toContain(MASCOT_NAME);
    }
  });

  it('a sound effect is never listed as homework', () => {
    // Read aloud expressively with the adult, not memorised on sight.
    for (const story of STORIES) {
      for (const { word } of supportWords(story)) {
        expect(ONOMATOPOEIA.has(word), `${story.id}: "${word}"`).toBe(false);
      }
    }
  });
});

describe('could, would and should', () => {
  it('are never decodable: their "oul" is a spelling no phase teaches', () => {
    // Split c·ou·ld as the diphthong of "out", "could" counted as a
    // sound-it-out word in every Band D story.
    for (const word of ['could', 'would', 'should']) {
      for (const phase of STORY_PHASES) {
        expect(isWordDecodable(word, phase.id), `${word} at ${phase.id}`).toBe(false);
      }
    }
  });

  it('reach a Band D story by the high-frequency route instead', () => {
    const scout = STORIES.find((s) => s.id === 'core-d-09');
    expect(scout.lines.some((l) => /\bCould\b/.test(l.text))).toBe(true);
    expect(supportWords(scout).map((w) => w.word)).toContain('could');
  });
});

/**
 * The checker used to read letters only. Every letter of "was", "his" and
 * "last" is taught in Band A, and none of the three says what those letters
 * were taught to say: a child sounding them out reads "wass", "hiss" and
 * "lasst" (in Singapore and British English the a of "last" says /ar/).
 * A word now counts as sounded out only when its sounds have been taught.
 */
describe('sounds as well as letters (R13)', () => {
  const PHASES = STORY_PHASES.map((p) => p.id);

  it('never counts a heart word as sounded out, at any phase', () => {
    for (const word of ['the', 'was', 'his', 'is', 'as', 'said', 'to', 'all', 'want', 'push']) {
      for (const phase of PHASES) {
        expect(isWordDecodable(word, phase), `${word} at ${phase}`).toBe(false);
      }
    }
  });

  it('waits for the ar lesson before "a" can say /ar/', () => {
    for (const word of ['last', 'fast', 'path', 'grass', 'after', 'father']) {
      expect(isWordDecodable(word, 'long-a'), `${word} at long-a`).toBe(false);
      expect(isWordDecodable(word, 'r-controlled'), `${word} at r-controlled`).toBe(true);
    }
    // The short a of "cat" is unaffected, and so is a word that looks alike.
    expect(isWordDecodable('ant', 'short-a')).toBe(true);
    expect(isWordDecodable('pant', 'short-a')).toBe(true);
  });

  it('waits for soft c, soft g and ow as in "cow"', () => {
    expect(isWordDecodable('gem', 'short-ei')).toBe(false);
    expect(isWordDecodable('gem', 'r-controlled')).toBe(true);
    expect(isWordDecodable('get', 'short-ei')).toBe(true); // a hard g
    expect(isWordDecodable('rice', 'long-i')).toBe(false);
    expect(isWordDecodable('rice', 'r-controlled')).toBe(true);
    expect(isWordDecodable('brown', 'long-o')).toBe(false);
    expect(isWordDecodable('brown', 'diphthongs')).toBe(true);
    expect(isWordDecodable('snow', 'long-o')).toBe(true); // ow says its name
  });

  it('keeps a plural or verb -s decodable when it says /z/', () => {
    // A child blending d-o-g-s says "dogz" without being taught to.
    expect(isWordDecodable('dogs', 'short-ou')).toBe(true);
    expect(isWordDecodable('pins', 'short-ei')).toBe(true);
    expect(isWordDecodable('runs', 'mixed-short')).toBe(true);
  });

  it('reads a word with an ending through its base word', () => {
    expect(wordSoundCode('pushed')?.category).toBe('heart');
    expect(wordSoundCode('planted')?.soundPhase).toBe(7);
    expect(wordSoundCode('afternoons')?.soundPhase).toBe(7);
    expect(wordSoundCode('classes')?.soundPhase).toBe(7);
    // "toes" is toe + s, not "to" + es.
    expect(isWordDecodable('toes', 'long-o')).toBe(true);
  });

  /**
   * Guards for the next story. A new word that fits one of these spelling
   * patterns needs an entry in sightWordCode.js saying what it says, or a
   * place on the list below of words whose letters say what they look like.
   */
  const vocabulary = () => [...new Set(STORIES.flatMap((s) => extractReadTokens(s)))];

  it('knows what every "a" before s, th, f, n or l says in the bank', () => {
    const SHORT_A = new Set([
      'ant',
      'ants',
      'pant',
      'canteen',
      'gathered',
      'tastes',
      'toast',
      'toaster',
    ]);
    const BROAD_A_SPELLING = /a(st|sk|sp|ss|th|ft|nce|nch|nt|lf|lm)/;
    const unknown = vocabulary().filter(
      (w) => BROAD_A_SPELLING.test(w) && !wordSoundCode(w) && !SHORT_A.has(w),
    );
    expect(unknown, 'say in sightWordCode.js whether the a says /ar/').toEqual([]);
  });

  it('knows what every "s" between vowels says in the bank', () => {
    const S_SAYS_S = new Set(['base', 'beside', 'case', 'chased', 'goose', 'loose', 'mouse']);
    const Z_SPELLING = /[aeiou]s[aeiouy]|[aeiou]se$|[aeiou]ses$|[aeiou]sed$/;
    const unknown = vocabulary().filter(
      (w) => Z_SPELLING.test(w) && !wordSoundCode(w) && !S_SAYS_S.has(w),
    );
    expect(unknown, 'say in sightWordCode.js whether the s says /z/').toEqual([]);
  });
});
