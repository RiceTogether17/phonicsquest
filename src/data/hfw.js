/**
 * High-Frequency Words (Sight Words)
 *
 * These words appear so frequently in text that children should recognise
 * them on sight rather than decode them phoneme-by-phoneme. In Decoding
 * Mode the app reads them aloud immediately with a ⭐ Sight Word badge.
 *
 * STORY_HFW — the 12 pre-taught words used across all Giri Stories levels.
 * EXTENDED_HFW — broader list used for the game modes.
 */

/** The 12 core HFW pre-taught for Giri Stories */
export const STORY_HFW = [
  'the', 'a', 'and', 'to', 'my', 'on', 'in', 'up', 'off', 'said', 'is', 'it',
];

/** Extended common sight words (Dolch pre-primer + primer core) */
const EXTENDED_HFW_LIST = [
  // Giri core
  'the', 'a', 'and', 'to', 'my', 'on', 'in', 'up', 'off', 'said', 'is', 'it',
  // Dolch pre-primer
  'i', 'he', 'she', 'we', 'me', 'be', 'do', 'go', 'so', 'no', 'all', 'are',
  'at', 'by', 'for', 'had', 'has', 'have', 'her', 'here', 'him', 'his', 'how',
  'if', 'into', 'like', 'look', 'not', 'now', 'of', 'one', 'our', 'out', 'put',
  'see', 'some', 'that', 'their', 'them', 'then', 'there', 'they', 'this', 'too',
  'two', 'was', 'were', 'went', 'what', 'when', 'where', 'who', 'will', 'with',
  'you', 'your', 'an', 'as', 'but', 'can', 'come', 'came', 'did', 'does', 'down',
  'eat', 'find', 'from', 'get', 'give', 'got', 'help', 'jump', 'just', 'know',
  'let', 'little', 'made', 'make', 'may', 'more', 'much', 'must', 'new', 'old',
  'once', 'open', 'over', 'own', 'play', 'please', 'pretty', 'ran', 'read',
  'run', 'say', 'stop', 'take', 'thank', 'think', 'too', 'under', 'very',
  'walk', 'well', 'which', 'why', 'yes', 'am', 'away', 'big', 'blue', 'can',
  'come', 'down', 'find', 'for', 'funny', 'go', 'help', 'here', 'jump', 'little',
  'look', 'make', 'me', 'my', 'not', 'one', 'play', 'red', 'run', 'said',
  'see', 'the', 'three', 'to', 'two', 'up', 'we', 'where', 'yellow', 'you',
  // Story-specific
  'felt', 'glad', 'too', 'got', 'sat', 'ran', 'had', 'met',
];

const EXTENDED_HFW_SET = new Set(EXTENDED_HFW_LIST.map(w => w.toLowerCase()));

/**
 * Is this word a high-frequency / sight word?
 * @param {string} word  raw word token (may contain punctuation)
 * @returns {boolean}
 */
export function isHFW(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  return EXTENDED_HFW_SET.has(clean);
}

/**
 * Extract the HFW that appear in a story's text.
 * Returns deduplicated list in STORY_HFW order first, then extras.
 * @param {import('./stories.js').Story} story
 * @returns {string[]}
 */
export function extractStoryHFW(story) {
  const storyWords = new Set();
  for (const line of story.lines) {
    if (!line.text) continue;
    for (const token of line.text.split(/\s+/)) {
      const clean = token.toLowerCase().replace(/[^a-z]/g, '');
      if (clean && isHFW(clean)) storyWords.add(clean);
    }
  }
  // Order: core STORY_HFW first, then any extras
  const ordered = STORY_HFW.filter(w => storyWords.has(w));
  for (const w of storyWords) {
    if (!STORY_HFW.includes(w)) ordered.push(w);
  }
  return ordered;
}
