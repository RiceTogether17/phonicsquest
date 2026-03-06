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
    // When a specific group is chosen, ignore the level cap so all words in
    // that group are reachable regardless of the current difficulty setting.
    let pool = opts.group ? WORDS : getWordsByLevel(maxLevel);

    if (opts.group) {
      // Legacy struct-* filters
      if (opts.group === 'struct-cvc') {
        pool = WORDS.filter(w => w.pattern === 'CVC' && w.types.includes('sv'));
      } else if (opts.group === 'struct-ccvc') {
        pool = WORDS.filter(w => w.pattern === 'blend' && w.types.includes('sv'));
      } else if (opts.group === 'struct-cvcc') {
        pool = WORDS.filter(w => w.group === 'struct-cvcc' || (getWordStructure(w) === 'CVCC' && w.types.includes('sv')));
      } else if (opts.group === 'struct-ccvcc') {
        pool = WORDS.filter(w => w.group === 'struct-ccvcc' || (getWordStructure(w) === 'CCVCC' && w.types.includes('sv')));
      } else {
        // Curriculum stage structural-vowel cross-cut: e.g. 'cvc-a', 'ccvc-e', 'cvcc-i', 'ccvcc-u'
        const structMatch = opts.group.match(/^(cvc|ccvc|cvcc|ccvcc)-([aeiou])$/);
        if (structMatch) {
          const struct = structMatch[1].toUpperCase(); // 'CVC', 'CCVC', 'CVCC', 'CCVCC'
          const vowel  = structMatch[2];              // 'a', 'e', 'i', 'o', 'u'
          pool = WORDS.filter(w =>
            getWordStructure(w) === struct &&
            getShortVowelLetter(w) === vowel
          );
        } else {
          pool = pool.filter(w => w.group === opts.group);
        }
      }
    }

    if (pool.length === 0) pool = WORDS.slice(0, 20);

    const stats = store.get('wordStats') || {};

    // Calculate weights
    const weighted = pool.map(word => {
      const s = stats[word.id];
      if (!s || s.attempts === 0) return { word, weight: 3 }; // unseen
      const accuracy = s.correct / s.attempts;
      if (accuracy < 0.5) return { word, weight: 5 };
      if (accuracy < 0.7) return { word, weight: 3 };
      if (accuracy > 0.9 && s.attempts >= MIN_ATTEMPTS_FOR_MASTERY) return { word, weight: 0.5 };
      return { word, weight: 1 };
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
