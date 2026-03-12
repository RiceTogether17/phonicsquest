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

const NON_DECODABLE_GROUPS = new Set(['sight-highfreq']);
const BLENDING_MODES = new Set(['blend', 'classicBlend']);

class Progress {
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
    // Respect the active level cap even when a specific group is chosen so
    // learners are not exposed to out-of-sequence words.
    let pool = getWordsByLevel(maxLevel);

    if (requestedGroup) {
      // Legacy struct-* filters
      if (requestedGroup === 'struct-cvc') {
        pool = WORDS.filter(w => w.pattern === 'CVC' && w.types.includes('sv') && w.level <= maxLevel);
      } else if (requestedGroup === 'struct-ccvc') {
        pool = WORDS.filter(w => w.pattern === 'blend' && w.types.includes('sv') && w.level <= maxLevel);
      } else if (requestedGroup === 'struct-cvcc') {
        pool = WORDS.filter(w => (w.group === 'struct-cvcc' || (getWordStructure(w) === 'CVCC' && w.types.includes('sv'))) && w.level <= maxLevel);
      } else if (requestedGroup === 'struct-ccvcc') {
        pool = WORDS.filter(w => (w.group === 'struct-ccvcc' || (getWordStructure(w) === 'CCVCC' && w.types.includes('sv'))) && w.level <= maxLevel);
      } else {
        // Curriculum stage structural-vowel cross-cut: e.g. 'cvc-a', 'ccvc-e', 'cvcc-i', 'ccvcc-u'
        const structMatch = requestedGroup.match(/^(cvc|ccvc|cvcc|ccvcc)-([aeiou])$/);
        if (structMatch) {
          const struct = structMatch[1].toUpperCase(); // 'CVC', 'CCVC', 'CVCC', 'CCVCC'
          const vowel  = structMatch[2];              // 'a', 'e', 'i', 'o', 'u'
          pool = WORDS.filter(w =>
            getWordStructure(w) === struct &&
            getShortVowelLetter(w) === vowel &&
            w.level <= maxLevel
          );
        } else {
          pool = pool.filter(w => w.group === requestedGroup);
        }
      }
    }

    // In free/blend category selection, prioritize honoring the chosen group
    // even if the current difficulty cap has no matches yet.
    if (pool.length === 0 && requestedGroup) {
      const structMatch = requestedGroup.match(/^(cvc|ccvc|cvcc|ccvcc)-([aeiou])$/);
      if (structMatch) {
        const struct = structMatch[1].toUpperCase();
        const vowel = structMatch[2];
        pool = WORDS.filter(w => getWordStructure(w) === struct && getShortVowelLetter(w) === vowel);
      } else if (requestedGroup === 'struct-cvc') {
        pool = WORDS.filter(w => w.pattern === 'CVC' && w.types.includes('sv'));
      } else if (requestedGroup === 'struct-ccvc') {
        pool = WORDS.filter(w => w.pattern === 'blend' && w.types.includes('sv'));
      } else if (requestedGroup === 'struct-cvcc') {
        pool = WORDS.filter(w => w.group === 'struct-cvcc' || (getWordStructure(w) === 'CVCC' && w.types.includes('sv')));
      } else if (requestedGroup === 'struct-ccvcc') {
        pool = WORDS.filter(w => w.group === 'struct-ccvcc' || (getWordStructure(w) === 'CCVCC' && w.types.includes('sv')));
      } else {
        pool = WORDS.filter(w => w.group === requestedGroup);
      }
    }

    if (isBlendingMode) {
      pool = pool.filter(word => !NON_DECODABLE_GROUPS.has(word.group) && word.pattern !== 'sight');
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
   * Avoids repeating the last N words.
   * @param {object} [opts]
   * @returns {import('../data/words.js').Word}
   */
  getNextWord(opts = {}) {
    const pool = this.getAdaptivePool(20, opts);
    const history = store.get('wordHistory') || [];
    const recentIds = history.slice(0, 5).map(h => h.wordId);

    // Try to find a word not recently played
    const fresh = pool.filter(w => !recentIds.includes(w.id));
    if (fresh.length > 0) return fresh[0];
    return pool[0] || WORDS[0];
  }

  /**
   * Record an attempt result.
   * @param {string} wordId
   * @param {boolean} correct
   * @param {string} mode  which game mode was played
   */
  recordAttempt(wordId, correct, mode = 'blend') {
    store.recordWordAttempt(wordId, correct);
    store.addWordHistory({
      wordId,
      correct,
      mode,
      timestamp: new Date().toISOString(),
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
   * @private
   */
  _weightedSample(items, count) {
    const result = [];
    const pool = [...items];

    for (let i = 0; i < count && pool.length > 0; i++) {
      const totalWeight = pool.reduce((sum, item) => sum + item.weight, 0);
      let r = Math.random() * totalWeight;

      for (let j = 0; j < pool.length; j++) {
        r -= pool[j].weight;
        if (r <= 0) {
          result.push(pool[j].word);
          pool.splice(j, 1);
          break;
        }
      }
    }

    return result;
  }
}

export const progress = new Progress();
