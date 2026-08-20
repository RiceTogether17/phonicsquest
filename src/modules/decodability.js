/**
 * Decodability validator for the Giri story bank.
 *
 * Answers one question, deterministically and with no DOM/store access:
 * "is this word fair to ask a child at this point in the reading journey?"
 * It powers `scripts/audit-stories.mjs` and the data-integrity tests in
 * `__tests__/storyDecodability.test.js` — every story in
 * `src/data/stories.js` must pass before it ships.
 *
 * ── The model ────────────────────────────────────────────────────────────
 *
 * Graphemes are released in cumulative CODE TIERS that mirror the four
 * story bands (UK SSP practice — Letters and Sounds — not the app's
 * lesson-stage micro-order, which interleaves structure work the story
 * bank does not gate on):
 *
 *   Tier 1  Early code     all single letters, doubles (ll ss ff zz),
 *                          ck, qu and the consonant digraphs sh ch th
 *                          wh ng. (Letters and Sounds Phases 2–3 —
 *                          existing Band A depends on this, e.g. "then",
 *                          "chat", "quick". Deliberately earlier than the
 *                          app curriculum's phase-4 digraph stage.)
 *   Tier 2  Long vowels    split digraphs a_e e_e i_e o_e u_e, vowel
 *                          teams ai ay ee ea ie igh oa ow ue ew oo,
 *                          vowel-y, and the -ed/-ing/-er/-est suffixes
 *                          (Band B story prose is past tense throughout).
 *   Tier 3  R-controlled   ar or er ir ur, plus tch dge ph. NOTE: no
 *                          lesson in curriculum.js teaches tch, dge or ph,
 *                          so they belong to no phase's budget and every
 *                          word needing them ("watch", "trophy") must take
 *                          the pre-teach or sight-word route. That is a
 *                          real gap in the lesson bank, recorded here
 *                          rather than papered over by granting the code
 *                          to a phase that never taught it.
 *   Tier 4  Diphthongs     oi oy ou aw au (ow /aʊ/ shares its spelling
 *                          with tier-2 ow /oʊ/, so ow words under-require).
 *   Tier 5  Advanced       air are ear eer ere.
 *
 * Tier order follows the BAND ladder the stories ship on (Band C is
 * r-controlled, Band D is diphthongs), which is not the order the lesson
 * curriculum teaches them in (phase 7 diphthongs, phase 8 r-controlled).
 * These are two independent axes and both are honest: `tier` says what code
 * a reader at this point in the STORY bank has met, `curriculumPhase` says
 * which LESSON phase the phase's content belongs to and is used only as the
 * tricky-word cutoff. Do not derive one from the other — they were once
 * silently transposed, which handed r-controlled stories the tricky words of
 * a phase they had not reached.
 *
 * A word's REQUIRED TIER is the highest tier of any grapheme it contains:
 * curated `graphemes[]` from words.js when the word is known, otherwise a
 * longest-match pattern scan with suffix stripping. A word is decodable at
 * a story's phase when requiredTier(word) <= tier(phase).
 *
 * KNOWN LIMITATION (by design): the check is graphemic, not phonemic. A
 * letter-plain irregular like "was" (/wŏz/) parses as w-a-s and counts
 * decodable; that gap is exactly what the HFW tiers (hfw.js) and tricky
 * words (trickyWords.js) exist for, and both are still enforced as the
 * only legal routes for words ABOVE the story's tier.
 */

import { WORDS } from '../data/words.js';
import { getHFWTier } from '../data/hfw.js';
import { getTrickyWord } from '../data/trickyWords.js';

// ── Story phases ─────────────────────────────────────────────────────────

/**
 * Ordered story-phase descriptors. `tier` indexes the cumulative grapheme
 * tiers above; `curriculumPhase` is the cutoff used for tricky-word
 * allowance (a story may use a tricky word only if trickyWords.js
 * introduces it at or before this curriculum phase).
 *
 * `extension-sg` and `chapter` are teacher-supported formats (see the
 * banner comments in stories.js) and get the full code + latest cutoff.
 */
export const STORY_PHASES = Object.freeze([
  // `shortVowels` is a SUB-GATE inside tier 1. Tiers alone cannot separate
  // the early short-vowel phases — they are all tier 1 — so a story named
  // "short-a" used to be granted the same code as a digraph story, and the
  // first four stories a child ever read carried all five short vowels.
  // A vowel a child has not been taught cannot be sounded out, so the budget
  // is cumulative and enforced per phase. Only tier-1 phases carry it: above
  // tier 1 vowels come in teams and split digraphs, where a letter-level
  // check would misread "rain" as needing both /a/ and /i/.
  { id: 'short-a', tier: 1, curriculumPhase: 2, shortVowels: 'a' },
  { id: 'short-ei', tier: 1, curriculumPhase: 2, shortVowels: 'aei' },
  { id: 'short-ou', tier: 1, curriculumPhase: 2, shortVowels: 'aeiou' },
  { id: 'mixed-short', tier: 1, curriculumPhase: 4, shortVowels: 'aeiou' },
  { id: 'short-digraphs', tier: 1, curriculumPhase: 4, shortVowels: 'aeiou' },
  // `graphemeBudget` is the SUB-GATE for tiers 2 and up: a cumulative list of
  // what each phase's stage ADDS on top of every phase before it in this
  // array. A tier is a coarse release — tier 2 hands over every long-vowel
  // spelling at once, tier 3 every r-controlled one — but a phase is a
  // teaching stage inside it, and a spelling the child has not met cannot be
  // sounded out. Without the budget a story named "long-a" could serve igh,
  // oa and oo, and an "r-controlled" story could serve tch and dge.
  //
  // Tier 1 uses `shortVowels` instead, because there the unit is a single
  // vowel LETTER; from tier 2 up vowels come in teams and split digraphs,
  // where a letter-level check would misread "rain" as needing /a/ and /i/.
  { id: 'long-a', tier: 2, curriculumPhase: 6, graphemeBudget: ['a_e', 'ai', 'ay'] },
  { id: 'long-e', tier: 2, curriculumPhase: 6, graphemeBudget: ['ee', 'ea', 'e_e'] },
  { id: 'long-i', tier: 2, curriculumPhase: 6, graphemeBudget: ['i_e', 'igh', 'ie', 'y'] },
  { id: 'long-o', tier: 2, curriculumPhase: 6, graphemeBudget: ['o_e', 'oa', 'ow'] },
  { id: 'long-u', tier: 2, curriculumPhase: 6, graphemeBudget: ['u_e', 'ue', 'ew', 'oo'] },
  {
    id: 'r-controlled',
    tier: 3,
    curriculumPhase: 8,
    graphemeBudget: ['ar', 'or', 'er', 'ir', 'ur'],
  },
  // The 'digraphs' phase is consonant-digraph review — sh ch th wh, all
  // tier-1 code — so its stage adds no new spelling; it is a fluency stop,
  // not a new release. It carries an empty budget rather than none at all,
  // which would exempt it from the gate entirely.
  { id: 'digraphs', tier: 3, curriculumPhase: 8, graphemeBudget: [] },
  { id: 'suffixes', tier: 3, curriculumPhase: 9, graphemeBudget: [] },
  { id: 'diphthongs', tier: 4, curriculumPhase: 7, graphemeBudget: ['oi', 'oy', 'ou'] },
  {
    id: 'advanced-vowel',
    tier: 5,
    curriculumPhase: 9,
    graphemeBudget: ['aw', 'au', 'air', 'are', 'ear', 'eer', 'ere'],
  },
  { id: 'chapter', tier: 5, curriculumPhase: 10 },
  { id: 'extension-sg', tier: 5, curriculumPhase: 10 },
]);

const PHASE_BY_ID = new Map(STORY_PHASES.map((p) => [p.id, p]));

/** The highest tier any phase grants. */
export const MAX_TIER = 5;

/** Get the STORY_PHASES descriptor for a story phase id, or null. */
export function getStoryPhase(phaseId) {
  return PHASE_BY_ID.get(phaseId) ?? null;
}

// ── Grapheme tier tables ─────────────────────────────────────────────────

/**
 * Multi-letter grapheme → first tier it is available. Single letters are
 * always tier 1 EXCEPT vowel-y (see scan). Split digraphs are written
 * with `_e` and detected positionally, not by substring.
 */
export const GRAPHEME_TIERS = Object.freeze({
  // Tier 1 — early code
  ll: 1,
  ss: 1,
  ff: 1,
  zz: 1,
  ck: 1,
  qu: 1,
  sh: 1,
  ch: 1,
  th: 1,
  wh: 1,
  ng: 1,
  // Tier 2 — long vowels
  a_e: 2,
  e_e: 2,
  i_e: 2,
  o_e: 2,
  u_e: 2,
  ai: 2,
  ay: 2,
  ee: 2,
  ea: 2,
  ie: 2,
  igh: 2,
  oa: 2,
  ow: 2,
  ue: 2,
  ew: 2,
  oo: 2,
  y: 2,
  // Tier 3 — r-controlled + late consonant spellings
  ar: 3,
  or: 3,
  er: 3,
  ir: 3,
  ur: 3,
  tch: 3,
  dge: 3,
  ph: 3,
  // Tier 4 — diphthongs
  oi: 4,
  oy: 4,
  ou: 4,
  aw: 4,
  au: 4,
  // Tier 5 — advanced vowels
  air: 5,
  are: 5,
  ear: 5,
  eer: 5,
  ere: 5,
});

/** Suffixes the scanner may strip, with the tier the suffix itself needs. */
export const SUFFIX_TIERS = Object.freeze({
  s: 1,
  es: 1,
  ed: 2,
  ing: 2,
  er: 2,
  est: 2,
});

// Multi-letter patterns longest-first, for the greedy scan.
const SCAN_PATTERNS = Object.keys(GRAPHEME_TIERS)
  .filter((g) => !g.includes('_') && g.length > 1)
  .sort((a, b) => b.length - a.length);

const VOWELS = 'aeiou';
const SPLIT_CONSONANTS = 'bcdfghjklmnprstvz'; // mirrors storyMode._highlightGraphemes

// ── Whitelists ───────────────────────────────────────────────────────────

/**
 * Names, places and culture-specific terms that are always pre-taught
 * before a story is read (cover page / picture walk). Singapore terms
 * follow the precedent in hfw.js ('giri', 'hawker', 'neighbour' are
 * flagged "always pre-taught" there).
 */
export const PROPER_NOUNS = Object.freeze(
  new Set([
    'giri',
    'jay',
    'mei',
    'ling',
    'tan',
    'mrs',
    'mr',
    'mdm',
    'mrt',
    'may',
    'deepavali',
    'supertrees',
    'singapore',
    'kueh',
    'hawker',
    'kopitiam',
    'neighbour',
    'auntie',
    'yoghurt',
  ]),
);

/**
 * Sound-effect words: read aloud expressively with the adult, never asked
 * to be decoded cold. Only the ones that do NOT already decode at their
 * band need listing, but harmless extras are fine.
 */
export const ONOMATOPOEIA = Object.freeze(
  new Set([
    'splish',
    'splash',
    'ding',
    'clink',
    'buzz',
    'plop',
    'pop',
    'snap',
    'slap',
    'flap',
    'tap',
    'pant',
    'peck',
    'pat',
    'clang',
    'crunch',
    'yum',
  ]),
);

// ── Word-level analysis ──────────────────────────────────────────────────

const WORDS_BY_WORD = new Map(WORDS.map((w) => [w.word.toLowerCase(), w]));

/**
 * Tier required by one curated words.js grapheme, given its type code.
 * @param {string} g     grapheme text
 * @param {string} type  words.js type code (c/sv/lv/d/bl/se/rc/dp/…)
 * @returns {number}
 */
function curatedGraphemeTier(g, type) {
  const fromTable = GRAPHEME_TIERS[g.toLowerCase()];
  if (fromTable !== undefined) return fromTable;
  if (g.length === 1) {
    // Single letters: long-vowel value (final-y, open-syllable o…) is
    // tier-2 knowledge; everything else is tier 1.
    return type === 'lv' ? 2 : 1;
  }
  switch (type) {
    case 'lv':
    case 'se':
      return 2;
    case 'rc':
      return 3;
    case 'dp':
      return 4;
    case 'soft_c':
    case 'soft_g':
      return 3;
    case 'p':
    case 'sf':
      return 2;
    default:
      return 1;
  }
}

/**
 * Required tier for a word with a curated words.js entry.
 * A silent-e ('se') grapheme upgrades the preceding long vowel into a
 * split digraph — both resolve to tier 2, so no special pairing needed.
 * @param {import('../data/words.js').Word} entry
 * @returns {number}
 */
function requiredTierFromEntry(entry) {
  let tier = 1;
  for (let i = 0; i < entry.graphemes.length; i++) {
    const t = curatedGraphemeTier(entry.graphemes[i], entry.types?.[i] ?? 'c');
    if (t > tier) tier = t;
  }
  return tier;
}

/**
 * Hand-curated segmentations where the greedy longest-match scan would
 * chunk across a syllable boundary (the schwa-prefix words: 'away' is
 * a·way, not aw·ay). Letter-level fallback parsing can't fix these
 * without destroying the tier signal for real diphthong words, so the
 * exceptions are listed explicitly.
 */
const SEGMENTATION_OVERRIDES = Object.freeze({
  away: ['a', 'w', 'ay'],
  awake: ['a', 'w', 'a_e', 'k'],
  awoke: ['a', 'w', 'o_e', 'k'],
});

/**
 * Greedy longest-match grapheme scan of an unknown word.
 * Returns the parse (for diagnostics) and the highest tier required.
 *
 * Split digraphs are detected only as vowel-consonant-e at the END of the
 * (suffix-stripped) word — the same word-boundary rule storyMode's
 * `_highlightGraphemes` uses — so "later" never falsely matches a_e.
 * Vowel-y (any non-initial y) requires tier 2.
 *
 * @param {string} word  lowercase letters only
 * @returns {{ tier: number, parse: string[] }}
 */
export function scanWord(word) {
  const override = SEGMENTATION_OVERRIDES[word];
  if (override) {
    let max = 1;
    for (const g of override) {
      const t = g.length === 1 ? 1 : GRAPHEME_TIERS[g];
      if (t > max) max = t;
    }
    return { tier: max, parse: [...override] };
  }

  const parse = [];
  let tier = 1;
  let i = 0;
  const upgrade = (t) => {
    if (t > tier) tier = t;
  };

  while (i < word.length) {
    // Split digraph at word end: v-C-e.
    if (
      i + 3 === word.length &&
      VOWELS.includes(word[i]) &&
      SPLIT_CONSONANTS.includes(word[i + 1]) &&
      word[i + 2] === 'e'
    ) {
      parse.push(`${word[i]}_e`, word[i + 1]);
      upgrade(GRAPHEME_TIERS[`${word[i]}_e`] ?? 2);
      i += 3;
      continue;
    }
    // Multi-letter pattern, longest first.
    let matched = false;
    for (const g of SCAN_PATTERNS) {
      if (word.startsWith(g, i)) {
        parse.push(g);
        upgrade(GRAPHEME_TIERS[g]);
        i += g.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    // Single letter. Non-initial y is a vowel spelling (cry, happy).
    if (word[i] === 'y' && i > 0) upgrade(GRAPHEME_TIERS.y);
    parse.push(word[i]);
    i += 1;
  }
  return { tier, parse };
}

/**
 * Strip one inflectional suffix, restoring e-drop ("baked" → "bake"),
 * doubled consonants ("running" → "run") and -ies/-ied ("tried" → "try").
 * Returns null when no suffix applies or the base would be too short.
 * @param {string} word
 * @returns {{ base: string, suffix: string }|null}
 */
export function stripSuffix(word) {
  for (const suffix of ['ing', 'est', 'ed', 'er', 'es', 's']) {
    if (!word.endsWith(suffix) || word.length - suffix.length < 2) continue;
    let base = word.slice(0, -suffix.length);
    // "tried"/"tries" → "try"
    if ((suffix === 'ed' || suffix === 'es') && base.endsWith('i')) {
      base = `${base.slice(0, -1)}y`;
    } else if (
      base.length >= 4 &&
      base[base.length - 1] === base[base.length - 2] &&
      !VOWELS.includes(base[base.length - 1])
    ) {
      // "running" → "run", "biggest" → "big"
      base = base.slice(0, -1);
    } else if (
      WORDS_BY_WORD.has(`${base}e`) ||
      (!WORDS_BY_WORD.has(base) &&
        SPLIT_CONSONANTS.includes(base[base.length - 1]) &&
        VOWELS.includes(base[base.length - 2]))
    ) {
      // "baked" → "bake": restore the dropped e when that yields a known
      // word, or when the base ends v-C (so the e completes a split digraph).
      base = `${base}e`;
    }
    return { base, suffix };
  }
  return null;
}

/**
 * The lowest code tier at which a word is decodable.
 * Uses the curated words.js entry when one exists (accurate segmentation),
 * else the pattern scan — trying the word whole and suffix-stripped, and
 * keeping whichever needs the lower tier.
 * @param {string} word  raw token; cleaned internally
 * @returns {number} 1–5
 */
export function requiredTier(word) {
  const clean = cleanToken(word);
  if (!clean) return 1;
  const entry = WORDS_BY_WORD.get(clean);
  if (entry?.graphemes?.length) return requiredTierFromEntry(entry);

  let best = scanWord(clean).tier;
  const stripped = stripSuffix(clean);
  if (stripped) {
    const baseEntry = WORDS_BY_WORD.get(stripped.base);
    const baseTier = baseEntry?.graphemes?.length
      ? requiredTierFromEntry(baseEntry)
      : scanWord(stripped.base).tier;
    const viaSuffix = Math.max(baseTier, SUFFIX_TIERS[stripped.suffix]);
    if (viaSuffix < best) best = viaSuffix;
  }
  return best;
}

/**
 * Is the word decodable at this story phase?
 * @param {string} word
 * @param {string} phaseId  a STORY_PHASES id
 * @returns {boolean}
 */
/**
 * Does this word stay inside the phase's short-vowel budget?
 *
 * Always true above tier 1, and true for any phase that declares no budget.
 * @param {object|null} phase  a STORY_PHASES descriptor
 * @param {string} clean       a cleaned token
 */
/**
 * Every long-vowel grapheme released by the time a tier-2 phase is reached.
 * Built once: STORY_PHASES is frozen, so the answer never changes.
 */
const GRAPHEME_BUDGETS = (() => {
  const out = new Map();
  const running = new Set();
  for (const phase of STORY_PHASES) {
    if (!phase.graphemeBudget) continue;
    for (const g of phase.graphemeBudget) running.add(g);
    out.set(phase.id, new Set(running));
  }
  return out;
})();

/**
 * The above-tier-1 graphemes of a word under each legitimate reading of it —
 * curated entry, raw scan, and suffix-stripped base — mirroring the way
 * requiredTier takes the cheapest route to a word.
 */
function budgetedReadings(clean) {
  const entry = WORDS_BY_WORD.get(clean);
  const parses = [];
  if (entry?.graphemes?.length) {
    parses.push(entry.graphemes.map((g) => String(g.g ?? g).toLowerCase()));
  }
  parses.push(scanWord(clean).parse);
  const stripped = stripSuffix(clean);
  if (stripped) {
    const baseEntry = WORDS_BY_WORD.get(stripped.base);
    parses.push(
      baseEntry?.graphemes?.length
        ? baseEntry.graphemes.map((g) => String(g.g ?? g).toLowerCase())
        : scanWord(stripped.base).parse,
    );
  }
  // Word-initial `y` is the consonant /y/ of "yes" — tier-1 code that
  // scanWord already declines to upgrade. Only a later `y` is the long-vowel
  // spelling of "cry" and "happy".
  return parses.map((parse) =>
    parse.filter((g, idx) => GRAPHEME_TIERS[g] > 1 && !(g === 'y' && idx === 0)),
  );
}

/**
 * Does this word stay inside its phase's cumulative grapheme budget?
 * Always true for phases that declare none (tier 1, which uses the
 * short-vowel budget, and the teacher-supported chapter/extension formats,
 * which get the full code).
 * @param {object|null} phase
 * @param {string} clean
 */
export function withinGraphemeBudget(phase, clean) {
  const budget = phase && GRAPHEME_BUDGETS.get(phase.id);
  if (!budget) return true;
  return budgetedReadings(clean).some((gs) => gs.every((g) => budget.has(g)));
}

export function withinVowelBudget(phase, clean) {
  if (!phase?.shortVowels || phase.tier !== 1) return true;
  for (const letter of clean) {
    if ('aeiou'.includes(letter) && !phase.shortVowels.includes(letter)) return false;
  }
  return true;
}

/**
 * Is the word decodable at this story phase?
 * @param {string} word
 * @param {string} phaseId  a STORY_PHASES id
 * @returns {boolean}
 */
export function isWordDecodable(word, phaseId) {
  const phase = getStoryPhase(phaseId);
  if (!phase) return false;
  const clean = cleanToken(word);
  return (
    requiredTier(clean) <= phase.tier &&
    withinVowelBudget(phase, clean) &&
    withinGraphemeBudget(phase, clean)
  );
}

// ── Story-level analysis ─────────────────────────────────────────────────

/** Lowercase a token and strip everything but letters (after 's removal). */
export function cleanToken(token) {
  return token
    .toLowerCase()
    .replace(/[’']s$/u, '')
    .replace(/[^a-z]/g, '');
}

/** Line types whose words a child is asked to decode. */
const COUNTABLE_LINE_TYPES = new Set(['text', 'intro', 'beat', 'paragraph', 'end']);

/**
 * The decodable-text tokens of a story: words from countable lines split
 * on whitespace, hyphens and dashes, cleaned of punctuation/possessives.
 * Refrains (pre-taught as a unit), labels and chapter headings are
 * scaffolding and excluded.
 * @param {object} story
 * @returns {string[]}
 */
export function extractCountableTokens(story) {
  const tokens = [];
  for (const line of story.lines ?? []) {
    if (!COUNTABLE_LINE_TYPES.has(line.type) || !line.text) continue;
    for (const raw of line.text.split(/[\s–—-]+/)) {
      const clean = cleanToken(raw);
      if (clean) tokens.push(clean);
    }
  }
  return tokens;
}

/** Words pre-taught by the story itself (vocab panel + explicit list). */
function pretaughtSet(story) {
  const set = new Set();
  for (const v of story.vocab ?? []) {
    for (const part of String(v.word).toLowerCase().split(/\s+/)) {
      const clean = cleanToken(part);
      if (clean) set.add(clean);
    }
  }
  for (const w of story.pretaught ?? []) {
    const clean = cleanToken(w);
    if (clean) set.add(clean);
  }
  return set;
}

/**
 * Sight words a story is allowed to use because they have already been
 * introduced by the aligned sight-word quests (see sightwords.js and the
 * sightStoryWeave). A story carries the cumulative list on `sightWords`;
 * these are pre-taught on cards before the child reads, so they are legal
 * even when above the story's code tier — the whole point of the
 * card-game ↔ story weave. Unlike the tier-capped HFW route, this list is
 * gated by reading position (Story N knows Quests 1…N), not by band.
 * @param {object} story
 * @returns {Set<string>}
 */
function sightWordSet(story) {
  const set = new Set();
  for (const w of story.sightWords ?? []) {
    const clean = cleanToken(w);
    if (clean) set.add(clean);
  }
  return set;
}

/**
 * Classify one cleaned token against a story's allowances.
 *
 * Order matters: graphemic decodability at the story's tier comes first
 * (sound-effect words like "tap" and names like "Jay" are still decodable
 * words), then the whitelists, then the sight-word routes (HFW tier,
 * tricky schedule, and quest-introduced sight words), then story-local
 * pre-teaching. Anything left is a 'stretch' word — readable only above
 * the story's code tier — and is what the ratio floors and stretch budgets
 * in the integrity tests police.
 *
 * @param {string} clean  cleaned token (see cleanToken)
 * @param {object} story
 * @param {Set<string>} [pretaught]  memoised pretaughtSet(story)
 * @param {Set<string>} [sight]      memoised sightWordSet(story)
 * @returns {{ word: string,
 *   status: 'proper'|'onomatopoeia'|'decodable'|'hfw'|'tricky'|'sight'|'pretaught'|'stretch',
 *   requiredTier: number }}
 */
export function classifyWord(
  clean,
  story,
  pretaught = pretaughtSet(story),
  sight = sightWordSet(story),
) {
  const phase = getStoryPhase(story.phase);
  const tier = requiredTier(clean);
  const make = (status) => ({ word: clean, status, requiredTier: tier });

  // A word inside the tier but outside the phase's vowel budget is not yet
  // sound-outable. It can still be legal by another route (sight word, HFW,
  // tricky word, pre-taught) — it just cannot be called decodable.
  if (
    phase &&
    tier <= phase.tier &&
    withinVowelBudget(phase, clean) &&
    withinGraphemeBudget(phase, clean)
  ) {
    return make('decodable');
  }
  if (PROPER_NOUNS.has(clean)) return make('proper');
  if (ONOMATOPOEIA.has(clean)) return make('onomatopoeia');

  const hfwTier = getHFWTier(clean);
  if (hfwTier !== null && hfwTier <= (story.allowedHFWTier ?? 0)) return make('hfw');

  const tricky = getTrickyWord(clean);
  if (tricky && phase && tricky.phase <= phase.curriculumPhase) return make('tricky');

  if (sight.has(clean)) return make('sight');
  if (pretaught.has(clean)) return make('pretaught');
  return make('stretch');
}

// ── Band and format rules ────────────────────────────────────────────────

/** Word-range, HFW cap and level per band (see the stories.js header). */
export const BAND_RULES = Object.freeze({
  A: Object.freeze({ min: 25, max: 45, hfwCap: 1, level: 1 }),
  B: Object.freeze({ min: 45, max: 80, hfwCap: 2, level: 2 }),
  C: Object.freeze({ min: 80, max: 140, hfwCap: 3, level: 3 }),
  D: Object.freeze({ min: 140, max: 250, hfwCap: 3, level: 4 }),
});

/**
 * Teacher-supported formats override parts of their band's rules: the
 * Singapore extension readers are short local-interest texts at any band,
 * and chapter readers split one Band-D-length arc across sittings.
 * (Both are described as teacher-supported in the stories.js banners.)
 */
export const FORMAT_RULES = Object.freeze({
  'extension-sg': Object.freeze({ min: 40, max: 140, hfwCap: 3 }),
  'chapter-reader': Object.freeze({ min: 80, max: 250, hfwCap: 3 }),
});

/**
 * Effective validation rules for a story (band rules + format overrides).
 * @param {object} story
 * @returns {{ min: number, max: number, hfwCap: number, level: number }|null}
 */
export function getStoryRules(story) {
  const band = BAND_RULES[story.band];
  if (!band) return null;
  return { ...band, ...(FORMAT_RULES[story.textType] ?? {}) };
}

/**
 * How often a target grapheme occurs in a text (lowercase). Split
 * digraphs ('a_e') count vowel-consonant-e occurrences at word ends, the
 * same boundary rule storyMode highlights with; everything else is a
 * substring count.
 * @param {string} grapheme
 * @param {string} text  lowercase
 * @returns {number}
 */
export function countFocusGrapheme(grapheme, text) {
  const g = grapheme.toLowerCase();
  if (g.includes('_e')) {
    const re = new RegExp(`${g[0]}[${SPLIT_CONSONANTS}]e(?![a-z])`, 'g');
    return (text.match(re) ?? []).length;
  }
  let n = 0;
  let i = text.indexOf(g);
  while (i !== -1) {
    n += 1;
    i = text.indexOf(g, i + 1);
  }
  return n;
}

/**
 * Capitalised mid-sentence tokens that classify as 'stretch' — i.e. names
 * the PROPER_NOUNS whitelist doesn't know. Decodable capitalised words
 * ("Sports Day", "Gardens") are fine and not reported.
 * @param {object} story
 * @returns {string[]}
 */
export function findUnknownCapitalised(story) {
  const pretaught = pretaughtSet(story);
  const out = new Set();
  for (const line of story.lines ?? []) {
    if (!COUNTABLE_LINE_TYPES.has(line.type) || !line.text) continue;
    const words = line.text.split(/\s+/);
    for (let i = 0; i < words.length; i++) {
      const raw = words[i];
      if (!/^[A-Z]/.test(raw)) continue;
      const prev = i > 0 ? words[i - 1] : '';
      if (i === 0 || /[.!?:"”—]$/.test(prev)) continue;
      const clean = cleanToken(raw);
      if (!clean || clean === 'i') continue;
      if (classifyWord(clean, story, pretaught).status === 'stretch') out.add(clean);
    }
  }
  return [...out];
}

/**
 * Validate one story: classify every countable token and compute the
 * metadata the integrity tests compare against the declared fields.
 *
 * `computed.decodableRatio` counts decodable tokens over all countable
 * tokens; sight words (hfw/tricky), pre-taught words, proper nouns and
 * onomatopoeia are supported-but-not-decodable; `stretch` tokens are
 * unsupported and listed for the audit.
 *
 * @param {object} story
 * @returns {{
 *   storyId: string,
 *   computed: {
 *     wordCount: number, decodableCount: number, decodableRatio: number,
 *     refrainCount: number,
 *     byStatus: Record<string, number>,
 *     stretchWords: Array<{ word: string, requiredTier: number, count: number }>,
 *   },
 * }}
 */
export function analyzeStory(story) {
  const tokens = extractCountableTokens(story);
  const pretaught = pretaughtSet(story);
  const sight = sightWordSet(story);
  const byStatus = {};
  const stretch = new Map();
  let decodableCount = 0;

  for (const token of tokens) {
    const c = classifyWord(token, story, pretaught, sight);
    byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
    if (c.status === 'decodable') decodableCount += 1;
    if (c.status === 'stretch') {
      const entry = stretch.get(c.word) ?? { word: c.word, requiredTier: c.requiredTier, count: 0 };
      entry.count += 1;
      stretch.set(c.word, entry);
    }
  }

  const refrainCount = (story.lines ?? []).filter((l) => l.type === 'refrain').length;
  return {
    storyId: story.id,
    computed: {
      wordCount: tokens.length,
      decodableCount,
      decodableRatio: tokens.length ? decodableCount / tokens.length : 0,
      refrainCount,
      byStatus,
      stretchWords: [...stretch.values()].sort((a, b) => b.count - a.count),
    },
  };
}
