/**
 * PhonicsQuest – the words a child meets before a story
 *
 * `supportWords` (decodability.js) lists every word a story uses that the
 * child cannot sound out by this point: the heart words ("the", "said",
 * "his"), words whose sound comes in a later lesson ("fast" before a can
 * say /ar/), and the story's own pre-taught words and names. That is the
 * honest list of what a child needs, and in a Band D story it runs to
 * thirty words, most of them met in every story since Band A.
 *
 * So the list shown before reading keeps two kinds of word apart:
 *
 *   - A word that belongs to this story (pre-taught, a name) is always shown.
 *   - A word the whole bank shares — a heart word or sight word, legal
 *     through the HFW tiers, the tricky-word schedule or the sight-word
 *     quests — is shown in the band where the story bank first needs it,
 *     because that is where it is new. Listing it in every later story would
 *     put twenty-odd words in front of one Band D story, for words the child
 *     has already met many times.
 */

import { STORIES } from '../data/stories.js';
import { supportWords } from './decodability.js';

const BAND_ORDER = ['A', 'B', 'C', 'D', 'E'];

/** Statuses of words every story shares, taught once and met everywhere. */
const SHARED = new Set(['hfw', 'tricky', 'sight']);

/** @type {Map<string, string>|null} shared word → band that first needs it */
let _firstBand = null;

/** The band in which the story bank first needs a shared word, else null. */
export function sharedWordFirstBand(word) {
  if (!_firstBand) {
    _firstBand = new Map();
    for (const band of BAND_ORDER) {
      for (const story of STORIES) {
        if (story.band !== band) continue;
        for (const w of supportWords(story)) {
          if (SHARED.has(w.status) && !_firstBand.has(w.word)) _firstBand.set(w.word, band);
        }
      }
    }
  }
  return _firstBand.get(word) ?? null;
}

/**
 * The words to show before a story, in the order the child meets them:
 * `supportWords`, less the shared words first needed in an earlier band.
 *
 * @param {object} story
 * @returns {Array<{ word: string, display: string, status: string }>}
 */
export function wordsToMeet(story) {
  if (!story) return [];
  return supportWords(story).filter(
    (w) => !SHARED.has(w.status) || sharedWordFirstBand(w.word) === story.band,
  );
}
