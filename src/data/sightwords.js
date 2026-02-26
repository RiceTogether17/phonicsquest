/**
 * PhonicsQuest – Sight Word Data
 *
 * Based on Dolch sight word lists (Pre-Primer → Grade 3).
 * Organised into quests of 5 words each for the card-match game.
 *
 * Tiers:
 *   easy   – Pre-Primer (5 quests × 5 words)
 *   medium – Primer + Grade 1 (10 quests × 5 words)
 *   hard   – Grade 2 + Grade 3 (11 quests × 5 words)
 */

/** All quests in order */
export const SIGHT_QUESTS = [

  /* ── Easy (Pre-Primer) ───────────────────────────────────────────── */
  { id: 'e1',  tier: 'easy',   name: 'Quest 1',  icon: '⭐', words: ['a',    'and', 'the', 'is',   'in'] },
  { id: 'e2',  tier: 'easy',   name: 'Quest 2',  icon: '⭐', words: ['I',    'it',  'to',  'up',   'we'] },
  { id: 'e3',  tier: 'easy',   name: 'Quest 3',  icon: '⭐', words: ['big',  'can', 'go',  'see',  'run'] },
  { id: 'e4',  tier: 'easy',   name: 'Quest 4',  icon: '⭐', words: ['my',   'not', 'one', 'said', 'you'] },
  { id: 'e5',  tier: 'easy',   name: 'Quest 5',  icon: '⭐', words: ['come', 'for', 'he',  'look', 'me'] },
  { id: 'e6',  tier: 'easy',   name: 'Quest 6',  icon: '⭐', words: ['away', 'find', 'help', 'here', 'jump'] },
  { id: 'e7',  tier: 'easy',   name: 'Quest 7',  icon: '⭐', words: ['down', 'make', 'play', 'red', 'two'] },
  { id: 'e8',  tier: 'easy',   name: 'Quest 8',  icon: '⭐', words: ['blue', 'funny', 'little', 'three', 'where'] },

  /* ── Medium (Primer + Grade 1) ───────────────────────────────────── */
  { id: 'm1',  tier: 'medium', name: 'Quest 9',  icon: '🌟', words: ['all',  'am',   'are',  'at',   'be'] },
  { id: 'm2',  tier: 'medium', name: 'Quest 10', icon: '🌟', words: ['but',  'did',  'do',   'eat',  'get'] },
  { id: 'm3',  tier: 'medium', name: 'Quest 11', icon: '🌟', words: ['good', 'have', 'he',   'into', 'like'] },
  { id: 'm4',  tier: 'medium', name: 'Quest 12', icon: '🌟', words: ['must', 'new',  'no',   'now',  'on'] },
  { id: 'm5',  tier: 'medium', name: 'Quest 13', icon: '🌟', words: ['our',  'out',  'ran',  'ride',  'saw'] },
  { id: 'm6',  tier: 'medium', name: 'Quest 14', icon: '🌟', words: ['she',  'so',   'soon', 'that', 'they'] },
  { id: 'm7',  tier: 'medium', name: 'Quest 15', icon: '🌟', words: ['this', 'too',  'want', 'was',  'well'] },
  { id: 'm8',  tier: 'medium', name: 'Quest 16', icon: '🌟', words: ['went', 'what', 'who',  'will',  'with'] },
  { id: 'm9',  tier: 'medium', name: 'Quest 17', icon: '🌟', words: ['after', 'again', 'an', 'any', 'as'] },
  { id: 'm10', tier: 'medium', name: 'Quest 18', icon: '🌟', words: ['ask', 'by', 'could', 'every', 'fly'] },
  { id: 'm11', tier: 'medium', name: 'Quest 19', icon: '🌟', words: ['from', 'give', 'going', 'had', 'has'] },
  { id: 'm12', tier: 'medium', name: 'Quest 20', icon: '🌟', words: ['her',  'him',  'his',  'how', 'just'] },
  { id: 'm13', tier: 'medium', name: 'Quest 21', icon: '🌟', words: ['know', 'let', 'live', 'may', 'of'] },
  { id: 'm14', tier: 'medium', name: 'Quest 22', icon: '🌟', words: ['old',  'once', 'open', 'over', 'put'] },
  { id: 'm15', tier: 'medium', name: 'Quest 23', icon: '🌟', words: ['some', 'stop', 'take', 'them', 'then'] },
  { id: 'm16', tier: 'medium', name: 'Quest 24', icon: '🌟', words: ['think', 'walk', 'were', 'when', 'thank'] },

  /* ── Hard (Grade 2 + Grade 3) ────────────────────────────────────── */
  { id: 'h1',  tier: 'hard',   name: 'Quest 25', icon: '💎', words: ['always', 'around', 'because', 'been', 'before'] },
  { id: 'h2',  tier: 'hard',   name: 'Quest 26', icon: '💎', words: ['best', 'both', 'buy', 'call', 'cold'] },
  { id: 'h3',  tier: 'hard',   name: 'Quest 27', icon: '💎', words: ['does', 'fast', 'first', 'five', 'found'] },
  { id: 'h4',  tier: 'hard',   name: 'Quest 28', icon: '💎', words: ['gave', 'goes', 'green', 'its', 'made'] },
  { id: 'h5',  tier: 'hard',   name: 'Quest 29', icon: '💎', words: ['many', 'off',  'or',    'pull', 'read'] },
  { id: 'h6',  tier: 'hard',   name: 'Quest 30', icon: '💎', words: ['right', 'sing', 'sit', 'sleep', 'tell'] },
  { id: 'h7',  tier: 'hard',   name: 'Quest 31', icon: '💎', words: ['their', 'these', 'those', 'upon', 'use'] },
  { id: 'h8',  tier: 'hard',   name: 'Quest 32', icon: '💎', words: ['very', 'wash', 'which', 'why', 'wish'] },
  { id: 'h9',  tier: 'hard',   name: 'Quest 33', icon: '💎', words: ['about', 'better', 'bring', 'carry', 'clean'] },
  { id: 'h10', tier: 'hard',   name: 'Quest 34', icon: '💎', words: ['done', 'draw', 'drink', 'fall', 'full'] },
  { id: 'h11', tier: 'hard',   name: 'Quest 35', icon: '💎', words: ['hold', 'keep', 'kind', 'light', 'much'] },
  { id: 'h12', tier: 'hard',   name: 'Quest 36', icon: '💎', words: ['never', 'only', 'own', 'shall', 'show'] },
  { id: 'h13', tier: 'hard',   name: 'Quest 37', icon: '💎', words: ['small', 'start', 'today', 'together', 'try'] },
];

/** Lookup quest by id */
export function getQuestById(id) {
  return SIGHT_QUESTS.find(q => q.id === id) ?? null;
}

/** Get quests filtered by tier */
export function getQuestsByTier(tier) {
  return SIGHT_QUESTS.filter(q => q.tier === tier);
}

export const TIER_LABELS = {
  easy:   { label: 'Easy',   icon: '⭐', color: '#22c55e', desc: 'Pre-Primer sight words' },
  medium: { label: 'Medium', icon: '🌟', color: '#f59e0b', desc: 'Primer & Grade 1 words' },
  hard:   { label: 'Hard',   icon: '💎', color: '#6c63ff', desc: 'Grade 2 & 3 words'     },
};
