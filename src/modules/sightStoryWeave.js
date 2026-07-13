/**
 * PhonicsQuest – Sight-word ↔ story weave
 *
 * The easy sight-word quests are ordered to match the Giri story sequence
 * (see sightwords.js): each quest pre-teaches the sight words of the
 * stories the child is about to read. This module computes the links both
 * ways so the two surfaces can point at each other:
 *
 *   - a story shows "⭐ Words to spot" — the quest words that appear in
 *     its text, so the card game pays off inside real reading;
 *   - a quest shows which story its words unlock, closing the loop.
 *
 * Everything is derived from story text at call time (memoised) — no
 * duplicated word lists to drift.
 */

import { STORIES } from '../data/stories.js';
import { SIGHT_QUESTS } from '../data/sightwords.js';
import { extractCountableTokens } from './decodability.js';

/** quest-order position of every quest word (lowercased). */
const _wordOrder = new Map();
SIGHT_QUESTS.forEach((quest, qi) => {
  quest.words.forEach(w => {
    const clean = w.toLowerCase();
    if (!_wordOrder.has(clean)) _wordOrder.set(clean, qi);
  });
});

/** Memoised story-id → Set of quest words present in the story text. */
let _storyWordCache = null;
function _storyWords() {
  if (_storyWordCache) return _storyWordCache;
  _storyWordCache = new Map();
  for (const story of STORIES) {
    const present = new Set();
    for (const token of extractCountableTokens(story)) {
      if (_wordOrder.has(token)) present.add(token);
    }
    _storyWordCache.set(story.id, present);
  }
  return _storyWordCache;
}

/**
 * Sight words to spot in a story, ordered by quest sequence.
 * @param {object|string} storyOrId
 * @param {number} [limit] max words to return (default 6)
 * @returns {string[]}
 */
export function getSightWordsInStory(storyOrId, limit = 6) {
  const id = typeof storyOrId === 'string' ? storyOrId : storyOrId?.id;
  const present = _storyWords().get(id);
  if (!present) return [];
  return [...present]
    .sort((a, b) => (_wordOrder.get(a) ?? 999) - (_wordOrder.get(b) ?? 999))
    .slice(0, limit);
}

/**
 * The first story (in library order) that uses at least `minHits` of a
 * quest's words — the story this quest unlocks.
 * @param {{words: string[], storyBand?: string}} quest
 * @param {number} [minHits]
 * @returns {{id: string, title: string, band: string}|null}
 */
export function getStoryForQuest(quest, minHits = 2) {
  if (!quest?.words?.length) return null;
  const target = new Set(quest.words.map(w => w.toLowerCase()));
  const bands = ['A', 'B', 'C', 'D'];
  const candidates = STORIES
    .filter(s => bands.includes(s.band) && (!quest.storyBand || s.band === quest.storyBand));
  // Prefer a story using several quest words; fall back to a single hit
  // (the last quests carry ride-along words that appear nowhere).
  for (const threshold of [minHits, 1]) {
    for (const story of candidates) {
      const present = _storyWords().get(story.id) || new Set();
      let hits = 0;
      for (const w of target) if (present.has(w)) hits += 1;
      if (hits >= threshold) return { id: story.id, title: story.title, band: story.band };
    }
  }
  return null;
}

/** Test seam: drop the memoised story-word index. */
export function _resetWeaveCache() {
  _storyWordCache = null;
}
