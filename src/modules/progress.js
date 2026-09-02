/**
 * PhonicsQuest – Progress & Adaptive Learning
 *
 * Tracks per-word accuracy and uses it to weight word selection:
 *  - Words with < 50% accuracy → 5× more likely to appear
 *  - Words with < 70% accuracy → 3× more likely
 *  - Words with > 90% accuracy → 0.5× (review only)
 *  - Unseen words → 3× (introduce new material)
 */

import { store } from './store.js';
import { WORDS, getWordsByLevel, getWordStructure, getShortVowelLetter } from '../data/words.js';
import { MASTERY_THRESHOLD, MIN_ATTEMPTS_FOR_MASTERY } from '../data/curriculum.js';
import { normalizeAdaptiveConfig, getWordWeight } from './adaptiveSelection.js';
import { getDueItems, countDueItems } from './reviewScheduler.js';
import { evidenceCeilingForMode } from './evidence.js';

export const NON_DECODABLE_GROUPS = new Set(['sight-highfreq']);
export const BLENDING_MODES = new Set(['blend', 'classicBlend']);

/** @type {Map<string, boolean>} memoised per group — WORDS never changes at runtime */
const _middleEligibleGroups = new Map();

/**
 * Does this group contain any word Middle Sound can honestly ask about?
 *
 * Several long-vowel stages are built entirely from words whose vowel is the
 * LAST sound — long-a-ay (play, day), long-i-y (cry, fly), long-o-ow (snow),
 * long-u-ew (new). None of them has a medial vowel, so hasInteriorVowel
 * empties the pool and word selection falls back to a slice of the whole
 * bank: the stage says "Long A — ay" and then serves random CVC words.
 */
function groupHasMedialVowel(group) {
  let hit = _middleEligibleGroups.get(group);
  if (hit === undefined) {
    hit = progress.getWordsInGroup(group).some(hasInteriorVowel);
    _middleEligibleGroups.set(group, hit);
  }
  return hit;
}

/** Should `group` be hidden from `mode`'s stage picker?
 *
 *  Two rules, both about a stage the mode cannot actually serve:
 *   - blending modes can't sound out non-decodable (irregular sight) words;
 *   - Middle Sound needs a medial vowel, and a handful of long-vowel stages
 *     carry their vowel at the end of every word.
 *
 *  A stage a mode can't serve isn't merely noise: word selection falls back
 *  to the general pool, so the child gets off-stage words under a stage
 *  heading that promised something else. */
export function isStageHiddenForMode(group, mode) {
  if (BLENDING_MODES.has(mode) && NON_DECODABLE_GROUPS.has(group)) return true;
  if (mode === 'middle' && !groupHasMedialVowel(group)) return true;
  return false;
}

const VOWEL_TYPES = new Set(['sv', 'lv', 'rc', 'dp']);

/**
 * Does the word contain a digraph tile (sh, ch, th, wh, ck, ng, ph, tch, dge)?
 *
 * Digraph words have their own curriculum stage, taught after the blend
 * stages. Counting a digraph as one sound (see getWordStructure) already
 * stops "cash" being filed as CVCC, but on its own that would only move it
 * into cvc-a — a Phase 1 stage, well ahead of where sh is taught. So the
 * structural short-vowel stages leave digraph words to the stage that owns
 * them. Nothing is lost: all 220 of them live there.
 */
function hasDigraph(word) {
  return Array.isArray(word?.types) && word.types.includes('d');
}

/**
 * Does the word use c or g for its soft sound?
 *
 * Soft c and g are a spelling rule of their own — c says /s/ and g says /j/
 * before e, i and y. Left in the structural short-vowel stages they are
 * traps: a child working through the short-e CVC set has just been taught
 * that g says /g/, meets "gem", reads it that way, and is marked wrong.
 * They now have a stage that teaches the rule before testing it.
 */
function hasSoftCG(word) {
  return Array.isArray(word?.types) && word.types.some((t) => t === 'soft_c' || t === 'soft_g');
}

const FIVE_SHORT_VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

/**
 * Is this one of the five short vowels the structural stages teach?
 *
 * `types.includes('sv')` alone is too loose for the mixed-vowel stages: it
 * also admits the short-oo of "book" and "stood" (which has its own stage)
 * and irregulars whose grapheme split gives a vowel letter the stage never
 * meant — "said" as /ai/, "does" as /oe/. The per-vowel stages never saw
 * these because they match a specific letter; the mixed stages have to say
 * so explicitly or the jumble stops being a jumble of five.
 */
function isFiveShortVowelWord(word) {
  return FIVE_SHORT_VOWELS.has(getShortVowelLetter(word));
}

/**
 * Does the word have a genuine medial vowel — a vowel phoneme that is
 * neither the first nor the last sound? Middle Sound can only ask an
 * honest question about such words: from the long-vowel stages onward
 * many words carry their vowel first or last ("ape" /ā/-p, "car" c-/ar/,
 * "boy" b-/oy/), and quizzing those as "the MIDDLE sound" actually tests
 * a first or last sound.
 */
export function hasInteriorVowel(word) {
  if (!Array.isArray(word?.types) || word.types.length <= 2) return false;
  return word.types.slice(1, -1).some((t) => VOWEL_TYPES.has(t));
}

// Groups that should not appear in phonemic-awareness activities because their
// words are irregular, multisyllabic, or non-decodable at the phoneme level.
const PA_EXCLUDED_GROUPS = new Set([
  'sight-highfreq',
  'multisyllable',
  'prefixes',
  'suffixes-advanced',
]);
const PHONEMIC_AWARENESS_MODES = new Set([
  'first',
  'last',
  'middle',
  'oralBlend',
  'soundCount',
  'oralSegment',
  'missing',
  'segment',
]);

/**
 * Mode-key → canonical skill bin.
 *
 * Different modes target different reading-science skills. Collapsing them
 * all into one wordStats accuracy hides the actual gap (a child who decodes
 * `cat` flawlessly may still be unable to orally segment /c/-/a/-/t/).
 *
 * Skill bins (architecture review):
 *   oralBlend  — auditory blending (hear sounds, identify the word)
 *   segmenting — break a word into its sounds (oral or written)
 *   decoding   — read a word from print
 *   spelling   — produce letters from a sound (sound→print mapping)
 *
 * Fluency is NOT a separate bin — it's derived from response speed on
 * correct attempts within decoding/segmenting (see masteryEngine).
 */
export const SKILL_BY_MODE = Object.freeze({
  oralBlend: 'oralBlend',
  first: 'segmenting',
  last: 'segmenting',
  middle: 'segmenting',
  soundCount: 'segmenting',
  oralSegment: 'segmenting',
  segment: 'segmenting',
  blend: 'decoding',
  classicBlend: 'decoding',
  hear: 'decoding',
  letterSounds: 'decoding',
  sightMatch: 'decoding',
  missing: 'spelling',
  wordSort: 'spelling',
  readAndTap: 'decoding',
  fluencySprint: 'decoding',
});

/** Canonical skill bins, in display order. */
export const SKILLS = Object.freeze(['oralBlend', 'segmenting', 'decoding', 'spelling']);

/** Map a mode key to its skill bin. Returns null for unknown modes. */
export function getSkillForMode(modeKey) {
  if (!modeKey) return null;
  return SKILL_BY_MODE[modeKey] ?? null;
}

class Progress {
  /**
   * Public wrapper around _filterByGroup. Used by progression.js to
   * enumerate words in a curriculum stage's group without reaching into
   * the singleton's internals.
   */
  getWordsInGroup(group, maxLevel = null) {
    return this._filterByGroup(group, maxLevel);
  }

  /**
   * Filter WORDS by structural group, with an optional level cap.
   * @param {string} group
   * @param {number|null} [maxLevel]
   * @returns {import('../data/words.js').Word[]}
   */
  _filterByGroup(group, maxLevel = null) {
    const lvl = (w) => maxLevel == null || w.level <= maxLevel;

    if (group === 'struct-cvc') {
      return WORDS.filter(
        (w) =>
          getWordStructure(w) === 'CVC' &&
          isFiveShortVowelWord(w) &&
          !w.types.includes('sf') &&
          !hasDigraph(w) &&
          !hasSoftCG(w) &&
          lvl(w),
      );
    }
    if (group === 'struct-ccvc') {
      // Structure, not the coarse `pattern:'blend'` flag: that flag is set on
      // BOTH initial-blend words (CCVC: flat, drop) and final-blend words
      // (CVCC: list, gift, mint), so filtering on it leaked ~30 CVCC words
      // into the CCVC category. getWordStructure keeps this consistent with
      // the vowel-specific ccvc-a…u stages, which already gate on 'CCVC'.
      return WORDS.filter(
        (w) =>
          getWordStructure(w) === 'CCVC' &&
          isFiveShortVowelWord(w) &&
          !w.types.includes('sf') &&
          !hasDigraph(w) &&
          !hasSoftCG(w) &&
          lvl(w),
      );
    }
    if (group === 'struct-cvcc') {
      return WORDS.filter(
        (w) =>
          getWordStructure(w) === 'CVCC' &&
          isFiveShortVowelWord(w) &&
          !w.types.includes('sf') &&
          !hasDigraph(w) &&
          !hasSoftCG(w) &&
          lvl(w),
      );
    }
    if (group === 'struct-ccvcc') {
      return WORDS.filter(
        (w) =>
          getWordStructure(w) === 'CCVCC' &&
          isFiveShortVowelWord(w) &&
          !w.types.includes('sf') &&
          !hasDigraph(w) &&
          !hasSoftCG(w) &&
          lvl(w),
      );
    }

    // The soft-c/g stage collects the rule wherever it appears, so "race"
    // and "ice" show up here as well as in their long-vowel stages — that
    // stage teaches a_e, this one teaches that c says /s/.
    if (group === 'cons-soft-cg') {
      return WORDS.filter((w) => hasSoftCG(w) && lvl(w));
    }

    const structMatch = group.match(/^(cvc|ccvc|cvcc|ccvcc)-([aeiou])$/);
    if (structMatch) {
      const struct = structMatch[1].toUpperCase();
      const vowel = structMatch[2];
      return WORDS.filter(
        (w) =>
          getWordStructure(w) === struct &&
          getShortVowelLetter(w) === vowel &&
          !w.types.includes('sf') &&
          !hasDigraph(w) &&
          !hasSoftCG(w) &&
          lvl(w),
      );
    }

    // Long-vowel micro-stages: <long-X>-<spellingPattern>
    //   long-a-ae → group:'long-a' AND spellingPattern:'ae'
    //   long-o-ow → group:'long-o' AND spellingPattern:'ow'
    const longMatch = group.match(/^(long-[aeiou])-([a-z]+)$/);
    if (longMatch) {
      const parent = longMatch[1];
      const pattern = longMatch[2];
      return WORDS.filter((w) => w.group === parent && w.spellingPattern === pattern && lvl(w));
    }

    // R-controlled micro-stages: rc-<spelling>[-<spelling>…]
    //   rc-ar-or     → r-controlled words whose vowel grapheme is ar or or
    //   rc-er-ir-ur  → r-controlled words whose vowel grapheme is er, ir or ur
    const rcMatch = group.match(/^rc-([a-z-]+)$/);
    if (rcMatch) {
      const spellings = rcMatch[1].split('-');
      return WORDS.filter((w) => {
        if (w.group !== 'r-controlled' || !lvl(w)) return false;
        const rcIdx = w.types.indexOf('rc');
        return rcIdx >= 0 && spellings.includes(w.graphemes[rcIdx]);
      });
    }

    // Diphthong micro-stages: dip-<spellingPattern>
    //   dip-oi → group:'diphthongs' AND spellingPattern:'oi'  (covers oi+oy)
    //   dip-aw → group:'diphthongs' AND spellingPattern:'aw'
    const dipMatch = group.match(/^dip-([a-z]+)$/);
    if (dipMatch) {
      const pattern = dipMatch[1];
      return WORDS.filter(
        (w) => w.group === 'diphthongs' && w.spellingPattern === pattern && lvl(w),
      );
    }

    return WORDS.filter((w) => w.group === group && lvl(w));
  }

  /**
   * Get adaptively-weighted word pool.
   * Weak words appear more often; mastered words less.
   * @param {number} count  how many words to return
   * @param {object} [opts]
   * @param {string} [opts.group]   filter to a specific word group
   * @param {number} [opts.maxLevel] max difficulty level
   * @returns {import('../data/words.js').Word[]}
   */
  getAdaptivePool(count = 10, opts = {}) {
    const maxLevel = opts.maxLevel ?? store.get('difficulty') ?? 1;
    const isBlendingMode = BLENDING_MODES.has(opts.mode);
    const requestedGroup =
      isBlendingMode && NON_DECODABLE_GROUPS.has(opts.group) ? null : opts.group;
    let pool = getWordsByLevel(maxLevel);

    if (requestedGroup) {
      pool = this._filterByGroup(requestedGroup, maxLevel);
    }

    // Retry without level cap if the capped pool was empty
    if (pool.length === 0 && requestedGroup) {
      pool = this._filterByGroup(requestedGroup);
    }

    if (isBlendingMode) {
      pool = pool.filter(
        (word) => !NON_DECODABLE_GROUPS.has(word.group) && word.pattern !== 'sight',
      );
    }

    if (PHONEMIC_AWARENESS_MODES.has(opts.mode)) {
      pool = pool.filter((word) => !PA_EXCLUDED_GROUPS.has(word.group));
    }

    // Middle Sound needs a true medial vowel — see hasInteriorVowel. Every
    // stage that recommends the mode keeps a healthy pool after this filter,
    // so it never empties a stage.
    if (opts.mode === 'middle') {
      pool = pool.filter(hasInteriorVowel);
    }

    if (pool.length === 0) {
      pool = isBlendingMode
        ? WORDS.filter(
            (word) => !NON_DECODABLE_GROUPS.has(word.group) && word.pattern !== 'sight',
          ).slice(0, 20)
        : WORDS.slice(0, 20);
    }

    const stats = store.get('wordStats') || {};

    const adaptiveCfg = normalizeAdaptiveConfig(store.get('adaptiveConfig'));

    // Calculate weights
    const weighted = pool.map((word) => {
      const s = stats[word.id];
      return { word, weight: getWordWeight(s, adaptiveCfg) };
    });

    return this._weightedSample(weighted, count);
  }

  /**
   * Get a single word using adaptive weighting.
   *
   * Avoids repeating recent words by excluding a recency window that scales
   * with the candidate pool, so a child cycles through most of the available
   * words before any repeat. A fixed window (the previous behaviour) let large
   * free-play groups resurface a word every few rounds and — worse — let small
   * stages (≤ a handful of decodable words) fall straight back to a word that
   * had just been shown. The window is capped at `pool.length - 1` so at least
   * one fresh candidate always remains.
   * @param {object} [opts]
   * @returns {import('../data/words.js').Word}
   */
  getNextWord(opts = {}) {
    const pool = this.getAdaptivePool(20, opts);
    if (pool.length === 0) return WORDS[0];

    const history = store.get('wordHistory') || [];
    const windowSize = Math.min(pool.length - 1, Math.max(5, Math.floor(pool.length * 0.6)));
    const recentIds = new Set(history.slice(0, Math.max(0, windowSize)).map((h) => h.wordId));

    // Highest-weight word not shown recently keeps the adaptive bias while the
    // wider window guarantees variety; fall back to the pool if every candidate
    // is (unavoidably, for a tiny stage) within the recency window.
    const fresh = pool.filter((w) => !recentIds.has(w.id));
    return (fresh.length > 0 ? fresh : pool)[0] || WORDS[0];
  }

  /**
   * Record an attempt result.
   *
   * Both the cross-skill summary (wordStats) AND the per-skill breakdown
   * (wordSkillStats) are updated, so the rest of the app keeps reading
   * wordStats unchanged while skill-aware features can read the breakdown.
   * The mode-key is also mapped to a learning event so masteryEngine's
   * speed score has data to work with (the previous code path filtered for
   * `word_attempt` events but nothing was emitting them).
   *
   * This is the single write path for every phonics word attempt in the app,
   * which is why the evidence level is resolved here: one place to get right.
   *
   * @param {string}  wordId
   * @param {boolean} correct
   * @param {string}  mode        which game mode was played
   * @param {number=} responseMs  time-to-answer for fluency scoring
   * @param {import('./evidence.js').EvidenceLevel=} evidence
   *   How the answer was obtained. Omit and it falls back to the mode's
   *   declared ceiling (MODES[mode].evidenceCeiling) — the most generous
   *   level that mode could possibly justify, with no per-attempt hint or
   *   retry information factored in. Callers that know about hints (the app
   *   shell) should pass a level computed by evidence.classifyEvidence().
   */
  recordAttempt(wordId, correct, mode = 'blend', responseMs = null, evidence = null) {
    const level = evidence ?? evidenceCeilingForMode(mode);
    store.recordWordAttempt(wordId, correct, level);
    store.addWordHistory({
      wordId,
      correct,
      mode,
      evidence: level,
      timestamp: new Date().toISOString(),
    });

    // Per-skill breakdown — only when the mode maps to a phonics skill.
    const skill = getSkillForMode(mode);
    if (skill) {
      store.recordWordSkillAttempt(wordId, skill, correct, responseMs, level);
    }

    // Telemetry event for downstream scorers (masteryEngine.speed, reporting)
    store.recordLearningEvent({
      eventType: 'word_attempt',
      skill: skill ?? null,
      correct,
      responseMs: typeof responseMs === 'number' ? responseMs : null,
      evidence: level,
      meta: { wordId, mode },
    });

    // Update group mastery (both canonical group and structural-vowel cross-cut)
    const word = WORDS.find((w) => w.id === wordId);
    if (word) {
      this._updateGroupMastery(word.group);
      this._updateStructuralGroupMastery(word);
    }
  }

  /** Recalculate mastery for a word group (by group key or structural-vowel key) */
  _updateGroupMastery(group) {
    const stats = store.get('wordStats') || {};

    // One definition of "the words in this group", shared with the stage
    // picker. It used to be restated here without the exclusions, so mastery
    // for cvcc-a was scored over a set that included every digraph word the
    // stage no longer serves — a bar the child could not move.
    const groupWords = this._filterByGroup(group);

    let totalAttempts = 0;
    let totalCorrect = 0;

    for (const w of groupWords) {
      const s = stats[w.id];
      if (s && s.attempts > 0) {
        totalAttempts += s.attempts;
        totalCorrect += s.correct;
      }
    }

    const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;
    store.updateGroupMastery(group, accuracy);

    // Long-vowel/diphthong macro-groups also have spelling-pattern micro-stages
    // (long-a → long-a-ae, long-a-ai, long-a-ay; diphthongs → dip-oi, dip-ou,
    // dip-aw). Refresh those alongside the parent so existing users migrate
    // automatically — the first practice attempt repopulates each micro-key
    // from the persisted wordStats.
    if (group.startsWith('long-') && /^long-[aeiou]$/.test(group)) {
      this._refreshMicroStageMastery(group, groupWords, stats);
    } else if (group === 'diphthongs') {
      this._refreshDiphthongMicroStages(groupWords, stats);
    }
  }

  /** Recompute micro-stage mastery for one long-vowel macro-group. */
  _refreshMicroStageMastery(parentGroup, groupWords, stats) {
    const buckets = new Map(); // pattern → { attempts, correct }
    for (const w of groupWords) {
      const pat = w.spellingPattern;
      if (!pat) continue;
      const s = stats[w.id];
      if (!(s && s.attempts > 0)) continue;
      const b = buckets.get(pat) || { attempts: 0, correct: 0 };
      b.attempts += s.attempts;
      b.correct += s.correct;
      buckets.set(pat, b);
    }
    for (const [pattern, b] of buckets) {
      const acc = b.attempts > 0 ? b.correct / b.attempts : 0;
      store.updateGroupMastery(`${parentGroup}-${pattern}`, acc);
    }
  }

  /** Same idea, but the diphthong micro-keys are 'dip-<pattern>'. */
  _refreshDiphthongMicroStages(groupWords, stats) {
    const buckets = new Map();
    for (const w of groupWords) {
      const pat = w.spellingPattern;
      if (!pat) continue;
      const s = stats[w.id];
      if (!(s && s.attempts > 0)) continue;
      const b = buckets.get(pat) || { attempts: 0, correct: 0 };
      b.attempts += s.attempts;
      b.correct += s.correct;
      buckets.set(pat, b);
    }
    for (const [pattern, b] of buckets) {
      const acc = b.attempts > 0 ? b.correct / b.attempts : 0;
      store.updateGroupMastery(`dip-${pattern}`, acc);
    }
  }

  /** Update mastery for all structural-vowel groups a word belongs to */
  _updateStructuralGroupMastery(word) {
    const struct = getWordStructure(word);
    const vowel = getShortVowelLetter(word);
    if (struct !== 'other' && vowel) {
      const structKey = `${struct.toLowerCase()}-${vowel}`; // e.g. 'cvc-a'
      this._updateGroupMastery(structKey);
    }
  }

  /**
   * Record grammar category accuracy and update mastery recommendation signal.
   * A category-level mastery boost is applied once accuracy exceeds 90%.
   * @param {string} levelKey
   * @param {string} categoryKey
   * @param {boolean} correct
   */
  recordGrammarCategoryAttempt(levelKey, categoryKey, correct) {
    if (!levelKey || !categoryKey) return;
    const stats = { ...(store.get('grammarCategoryStats') || {}) };
    const statKey = `${levelKey}-${categoryKey}`;
    const prev = stats[statKey] || { attempts: 0, correct: 0, accuracy: 0 };
    const attempts = prev.attempts + 1;
    const right = prev.correct + (correct ? 1 : 0);
    const accuracy = attempts > 0 ? right / attempts : 0;
    stats[statKey] = { attempts, correct: right, accuracy };
    store.set('grammarCategoryStats', stats);

    if (accuracy > 0.9 && attempts >= 3) {
      const masteryKey = `grammar:${levelKey}:${categoryKey}`;
      store.updateGroupMastery(masteryKey, Math.min(1, 0.85 + (accuracy - 0.9)));
    }
  }

  /**
   * Recommend weakest grammar category for a given level.
   * @param {string} levelKey
   * @param {string[]} categories
   * @returns {string|null}
   */
  getRecommendedGrammarCategory(levelKey, categories = []) {
    if (!levelKey || !categories.length) return null;
    const stats = store.get('grammarCategoryStats') || {};
    let best = null;
    let lowest = Infinity;

    for (const cat of categories) {
      const key = `${levelKey}-${cat}`;
      const entry = stats[key] || { attempts: 0, accuracy: 0 };
      const score = entry.attempts === 0 ? 0.45 : entry.accuracy;
      if (score < lowest) {
        lowest = score;
        best = cat;
      }
    }
    return best;
  }

  /**
   * Get accuracy for a specific word.
   * @param {string} wordId
   * @returns {{ attempts: number, correct: number, accuracy: number } | null}
   */
  getWordAccuracy(wordId) {
    const stats = store.get('wordStats') || {};
    const s = stats[wordId];
    if (!s) return null;
    return {
      ...s,
      accuracy: s.attempts > 0 ? s.correct / s.attempts : 0,
    };
  }

  /**
   * Check if a word is new (never attempted).
   * @param {string} wordId
   * @returns {boolean}
   */
  isNewWord(wordId) {
    const stats = store.get('wordStats') || {};
    return !stats[wordId] || stats[wordId].attempts === 0;
  }

  /**
   * Get overall stats for the parent dashboard.
   * @returns {object}
   */
  getOverallStats() {
    const stats = store.get('wordStats') || {};
    const history = store.get('wordHistory') || [];
    const groupMastery = store.get('groupMastery') || {};

    let totalAttempts = 0;
    let totalCorrect = 0;
    let wordsAttempted = 0;
    let wordsMastered = 0;

    for (const [, s] of Object.entries(stats)) {
      if (s.attempts > 0) {
        totalAttempts += s.attempts;
        totalCorrect += s.correct;
        wordsAttempted++;
        if (s.attempts >= MIN_ATTEMPTS_FOR_MASTERY && s.correct / s.attempts >= MASTERY_THRESHOLD) {
          wordsMastered++;
        }
      }
    }

    return {
      totalAttempts,
      totalCorrect,
      overallAccuracy: totalAttempts > 0 ? totalCorrect / totalAttempts : 0,
      wordsAttempted,
      wordsMastered,
      totalWords: WORDS.length,
      groupMastery,
      recentHistory: history.slice(0, 50),
      xp: store.get('xp'),
      level: store.get('level'),
      streak: store.get('streak'),
      bestStreak: store.get('bestStreak'),
    };
  }

  /**
   * Get words that are due for spaced-repetition review.
   * Oldest-overdue first, optionally capped to `opts.cap`. Reads the new
   * `dueAt` / `box` fields with a fallback to the legacy `nextReviewDate`
   * so words played before the engine shipped still surface correctly.
   * @param {{ cap?: number, now?: number }} [opts]
   * @returns {import('../data/words.js').Word[]}
   */
  getReviewDueWords(opts = {}) {
    const stats = store.get('wordStats') || {};
    return getDueItems(stats, WORDS, opts).map((d) => d.item);
  }

  /**
   * Total number of words due for spaced-repetition review right now.
   * Used by the Giri's Review Lane home-screen tile.
   * @returns {number}
   */
  getReviewDueCount() {
    return countDueItems(store.get('wordStats') || {}, WORDS);
  }

  /**
   * Export progress as CSV string.
   * @returns {string}
   */
  exportCSV() {
    const stats = store.get('wordStats') || {};
    const rows = ['Word,Attempts,Correct,Accuracy,Last Seen'];

    for (const word of WORDS) {
      const s = stats[word.id];
      if (s && s.attempts > 0) {
        const accuracy = ((s.correct / s.attempts) * 100).toFixed(0);
        rows.push(`${word.word},${s.attempts},${s.correct},${accuracy}%,${s.lastSeen || ''}`);
      }
    }

    return rows.join('\n');
  }

  /**
   * Weighted random sampling without replacement.
   * Uses the Efraimidis-Spirakis reservoir algorithm for O(n log k) complexity
   * instead of the previous O(n*k) approach with repeated weight recalculation.
   * @private
   */
  _weightedSample(items, count) {
    if (items.length === 0) return [];
    const k = Math.min(count, items.length);
    return items
      .map((item) => ({
        word: item.word,
        key: Math.pow(Math.random(), 1 / Math.max(item.weight, 0.001)),
      }))
      .sort((a, b) => b.key - a.key)
      .slice(0, k)
      .map(({ word }) => word);
  }
}

export const progress = new Progress();
