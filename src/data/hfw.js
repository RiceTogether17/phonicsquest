/**
 * High-Frequency Words (Sight Words) — Tiered System
 *
 * These words appear so frequently in text that children should recognise
 * them on sight rather than decode them phoneme-by-phoneme. In Decoding
 * Mode the app reads them aloud immediately with a ⭐ Sight Word badge.
 *
 * HFW Tiers (aligned with the 4-band decodable story system):
 *   Tier 1: the, a, and, is, it, to, in, on, my           → Band A
 *   Tier 2: was, said, we, he, she, they, of, for, with,  → Band B
 *           went
 *   Tier 3: could, would, should, there, where, one, some, → Band C
 *           were
 *   Band D uses flexible HFW (all tiers + extras).
 *
 * STORY_HFW — legacy alias for Tier 1 (backward compat).
 * HFW_TIERS — the authoritative tiered word lists.
 */

// ── Tiered HFW ───────────────────────────────────────────────────────────────

/** Tier 1 — permitted in Band A (earliest decodables) */
export const HFW_TIER_1 = [
  'the', 'a', 'and', 'is', 'it', 'to', 'in', 'on', 'my',
];

/** Tier 2 — permitted in Band B (story readers) */
export const HFW_TIER_2 = [
  'was', 'said', 'we', 'he', 'she', 'they', 'of', 'for', 'with', 'went',
];

/** Tier 3 — permitted in Band C (fluency readers) */
export const HFW_TIER_3 = [
  'could', 'would', 'should', 'there', 'where', 'one', 'some', 'were',
];

/** Combined tier lookup: word → tier number (1, 2, or 3) */
export const HFW_TIERS = new Map([
  ...HFW_TIER_1.map(w => [w, 1]),
  ...HFW_TIER_2.map(w => [w, 2]),
  ...HFW_TIER_3.map(w => [w, 3]),
]);

/**
 * Get the HFW tier for a word.
 * @param {string} word
 * @returns {number|null} 1, 2, 3, or null if not a tiered HFW
 */
export function getHFWTier(word) {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  return HFW_TIERS.get(clean) ?? null;
}

/**
 * Get all HFW words permitted at a given band.
 * @param {'A'|'B'|'C'|'D'} band
 * @returns {string[]}
 */
export function getAllowedHFW(band) {
  switch (band) {
    case 'A': return [...HFW_TIER_1];
    case 'B': return [...HFW_TIER_1, ...HFW_TIER_2];
    case 'C': return [...HFW_TIER_1, ...HFW_TIER_2, ...HFW_TIER_3];
    case 'D': return [...HFW_TIER_1, ...HFW_TIER_2, ...HFW_TIER_3]; // flexible
    default:  return [...HFW_TIER_1];
  }
}

// ── Legacy exports (backward compatibility) ──────────────────────────────────

/** @deprecated Use HFW_TIER_1 instead. The original 12 pre-taught HFW. */
export const STORY_HFW = [
  ...HFW_TIER_1,
  // These 3 were in the original STORY_HFW but are now in Tier 2+
  'said', 'up', 'off',
];

// ── Extended HFW (for game modes, not story gating) ──────────────────────────

const EXTENDED_HFW_LIST = [
  // All tiers
  ...HFW_TIER_1, ...HFW_TIER_2, ...HFW_TIER_3,
  // Dolch pre-primer + primer
  'i', 'me', 'be', 'do', 'go', 'so', 'no', 'all', 'are',
  'at', 'by', 'had', 'has', 'have', 'her', 'here', 'him', 'his', 'how',
  'if', 'into', 'like', 'look', 'not', 'now', 'our', 'out', 'put',
  'see', 'that', 'their', 'them', 'then', 'this', 'too',
  'two', 'what', 'when', 'who', 'will',
  'you', 'your', 'an', 'as', 'but', 'can', 'come', 'came', 'did', 'does', 'down',
  'eat', 'find', 'from', 'get', 'give', 'got', 'help', 'jump', 'just', 'know',
  'let', 'little', 'made', 'make', 'may', 'more', 'much', 'must', 'new', 'old',
  'once', 'open', 'over', 'own', 'play', 'please', 'pretty', 'ran', 'read',
  'run', 'say', 'stop', 'take', 'thank', 'think', 'under', 'very',
  'walk', 'well', 'which', 'why', 'yes', 'am', 'away', 'big', 'blue',
  'funny', 'red', 'three', 'up', 'off', 'yellow',
  // Story-specific
  'felt', 'glad', 'sat', 'had', 'met',
  // Very common words with irregular/advanced phonics — pre-taught as sight words
  'girl', 'year', 'saw', 'far', 'crowd', 'oil', 'near', 'hear', 'fear',
  'dear', 'bear', 'wear', 'know', 'show', 'grow', 'glow', 'blow', 'snow',
  // Character name and key cultural terms — always pre-taught, treated as sight words
  'giri', 'hawker', 'neighbour',
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
 * Returns deduplicated list in tier order (Tier 1 first, then 2, then 3, then extras).
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
  // Order: Tier 1 → 2 → 3 → extras
  const allTiered = [...HFW_TIER_1, ...HFW_TIER_2, ...HFW_TIER_3];
  const ordered = allTiered.filter(w => storyWords.has(w));
  for (const w of storyWords) {
    if (!allTiered.includes(w)) ordered.push(w);
  }
  return ordered;
}
