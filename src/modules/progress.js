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
import { WORDS, shuffleArray, getWordsByLevel, getWordStructure, getShortVowelLetter } from '../data/words.js';
import { MASTERY_THRESHOLD, MIN_ATTEMPTS_FOR_MASTERY } from '../data/curriculum.js';
import { normalizeAdaptiveConfig, getWordWeight } from './adaptiveSelection.js';
import { getDueItems, countDueItems } from './reviewScheduler.js';

export const NON_DECODABLE_GROUPS = new Set(['sight-highfreq']);
export const BLENDING_MODES = new Set(['blend', 'classicBlend']);

/** Should `group` be hidden from `mode`'s stage picker? Blending modes can't
 *  sound out non-decodable (irregular sight) words, so those stages are noise. */
export function isStageHiddenForMode(group, mode) {
  return BLENDING_MODES.has(mode) && NON_DECODABLE_GROUPS.has(group);
}

// Groups that should not appear in phonemic-awareness activities because their
// words are irregular, multisyllabic, or non-decodable at the phoneme level.
const PA_EXCLUDED_GROUPS = new Set([
  'sight-highfreq', 'multisyllable', 'prefixes', 'suffixes-advanced',
]);
const PHONEMIC_AWARENESS_MODES = new Set([
  'first', 'last', 'middle', 'oralBlend', 'soundCount', 'missing', 'segment',
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
  oralBlend:    'oralBlend',
  first:        'segmenting',
  last:         'segmenting',
  middle:       'segmenting',
  soundCount:   'segmenting',
  segment:      'segmenting',
  blend:        'decoding',
  classicBlend: 'decoding',
  hear:         'decoding',
  letterSounds: 'decoding',
  sightMatch:   'decoding',
  missing:      'spelling',
  wordSort:     'spelling',
  readAndTap:   'decoding',
  fluencySprint:'decoding',
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
      return WORDS.filter(w => w.pattern === 'CVC' && w.types.includes('sv') && lvl(w));
    }
    if (group === 'struct-ccvc') {
      // Structure, not the coarse `pattern:'blend'` flag: that flag is set on
      // BOTH initial-blend words (CCVC: flat, drop) and final-blend words
      // (CVCC: list, gift, mint), so filtering on it leaked ~30 CVCC words
      // into the CCVC category. getWordStructure keeps this consistent with
      // the vowel-specific ccvc-a…u stages, which already gate on 'CCVC'.
      return WORDS.filter(w => getWordStructure(w) === 'CCVC' && w.types.includes('sv') && !w.types.includes('sf') && lvl(w));
    }
    if (group === 'struct-cvcc') {
      return WORDS.filter(w => (w.group === 'struct-cvcc' || (getWordStructure(w) === 'CVCC' && w.types.includes('sv') && !w.types.includes('sf'))) && lvl(w));
    }
    if (group === 'struct-ccvcc') {
      return WORDS.filter(w => (w.group === 'struct-ccvcc' || (getWordStructure(w) === 'CCVCC' && w.types.includes('sv') && !w.types.includes('sf'))) && lvl(w));
    }

    const structMatch = group.match(/^(cvc|ccvc|cvcc|ccvcc)-([aeiou])$/);
    if (structMatch) {
      const struct = structMatch[1].toUpperCase();
      const vowel  = structMatch[2];
      return WORDS.filter(w => getWordStructure(w) === struct && getShortVowelLetter(w) === vowel && !w.types.includes('sf') && lvl(w));
    }

    // Long-vowel micro-stages: <long-X>-<spellingPattern>
    //   long-a-ae → group:'long-a' AND spellingPattern:'ae'
    //   long-o-ow → group:'long-o' AND spellingPattern:'ow'
    const longMatch = group.match(/^(long-[aeiou])-([a-z]+)$/);
    if (longMatch) {
      const parent  = longMatch[1];
      const pattern = longMatch[2];
      return WORDS.filter(w => w.group === parent && w.spellingPattern === pattern && lvl(w));
    }

    // Diphthong micro-stages: dip-<spellingPattern>
    //   dip-oi → group:'diphthongs' AND spellingPattern:'oi'  (covers oi+oy)
    //   dip-aw → group:'diphthongs' AND spellingPattern:'aw'
    const dipMatch = group.match(/^dip-([a-z]+)$/);
    if (dipMatch) {
      const pattern = dipMatch[1];
      return WORDS.filter(w => w.group === 'diphthongs' && w.spellingPattern === pattern && lvl(w));
    }

    return WORDS.filter(w => w.group === group && lvl(w));
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
    const requestedGroup = isBlendingMode && NON_DECODABLE_GROUPS.has(opts.group) ? null : opts.group;
    let pool = getWordsByLevel(maxLevel);

    if (requestedGroup) {
      pool = this._filterByGroup(requestedGroup, maxLevel);
    }

    // Retry without level cap if the capped pool was empty
    if (pool.length === 0 && requestedGroup) {
      pool = this._filterByGroup(requestedGroup);
    }

    if (isBlendingMode) {
      pool = pool.filter(word => !NON_DECODABLE_GROUPS.has(word.group) && word.pattern !== 'sight');
    }

    if (PHONEMIC_AWARENESS_MODES.has(opts.mode)) {
      pool = pool.filter(word => !PA_EXCLUDED_GROUPS.has(word.group));
    }

    if (pool.length === 0) {
      pool = isBlendingMode
        ? WORDS.filter(word => !NON_DECODABLE_GROUPS.has(word.group) && word.pattern !== 'sight').slice(0, 20)
        : WORDS.slice(0, 20);
    }

    const stats = store.get('wordStats') || {};

    const adaptiveCfg = normalizeAdaptiveConfig(store.get('adaptiveConfig'));

    // Calculate weights
    const weighted = pool.map(word => {
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
    const recentIds = new Set(
      history.slice(0, Math.max(0, windowSize)).map(h => h.wordId)
    );

    // Highest-weight word not shown recently keeps the adaptive bias while the
    // wider window guarantees variety; fall back to the pool if every candidate
    // is (unavoidably, for a tiny stage) within the recency window.
    const fresh = pool.filter(w => !recentIds.has(w.id));
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
   * @param {string}  wordId
   * @param {boolean} correct
   * @param {string}  mode        which game mode was played
   * @param {number=} responseMs  time-to-answer for fluency scoring
   */
  recordAttempt(wordId, correct, mode = 'blend', responseMs = null) {
    store.recordWordAttempt(wordId, correct);
    store.addWordHistory({
      wordId,
      correct,
      mode,
      timestamp: new Date().toISOString(),
    });

    // Per-skill breakdown — only when the mode maps to a phonics skill.
    const skill = getSkillForMode(mode);
    if (skill) {
      store.recordWordSkillAttempt(wordId, skill, correct, responseMs);
    }

    // Telemetry event for downstream scorers (masteryEngine.speed, reporting)
    store.recordLearningEvent({
      eventType:  'word_attempt',
      skill:      skill ?? null,
      correct,
      responseMs: typeof responseMs === 'number' ? responseMs : null,
      meta:       { wordId, mode },
    });

    // Update group mastery (both canonical group and structural-vowel cross-cut)
    const word = WORDS.find(w => w.id === wordId);
    if (word) {
      this._updateGroupMastery(word.group);
      this._updateStructuralGroupMastery(word);
    }
  }

  /** Recalculate mastery for a word group (by group key or structural-vowel key) */
  _updateGroupMastery(group) {
    const stats = store.get('wordStats') || {};

    // Determine which words count toward this group
    let groupWords;
    const structMatch = group.match(/^(cvc|ccvc|cvcc|ccvcc)-([aeiou])$/);
    if (structMatch) {
      const struct = structMatch[1].toUpperCase();
      const vowel  = structMatch[2];
      groupWords = WORDS.filter(w =>
        getWordStructure(w) === struct && getShortVowelLetter(w) === vowel
      );
    } else {
      groupWords = WORDS.filter(w => w.group === group);
    }

    let totalAttempts = 0;
    let totalCorrect  = 0;

    for (const w of groupWords) {
      const s = stats[w.id];
      if (s && s.attempts > 0) {
        totalAttempts += s.attempts;
        totalCorrect  += s.correct;
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
      b.correct  += s.correct;
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
      b.correct  += s.correct;
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
    const vowel  = getShortVowelLetter(word);
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
    let totalCorrect  = 0;
    let wordsAttempted = 0;
    let wordsMastered  = 0;

    for (const [, s] of Object.entries(stats)) {
      if (s.attempts > 0) {
        totalAttempts += s.attempts;
        totalCorrect  += s.correct;
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
    return getDueItems(stats, WORDS, opts).map(d => d.item);
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
      .map(item => ({ word: item.word, key: Math.pow(Math.random(), 1 / Math.max(item.weight, 0.001)) }))
      .sort((a, b) => b.key - a.key)
      .slice(0, k)
      .map(({ word }) => word);
  }
}

export const progress = new Progress();
