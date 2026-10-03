/**
 * PhonicsQuest – the words a child meets before a story
 *
 * `supportWords` (decodability.js) lists the words a story uses that are
 * legal by a route other than sounding out. By construction it cannot list
 * the heart words its own spelling check passes: "said" is s-ai-d and "the"
 * is th-e, both inside Band B's code, so no Band B story ever showed them
 * before reading, and a child sounding out "said" says "sayd". The check is
 * graphemic on purpose (see KNOWN LIMITATION in decodability.js), so the
 * gap is closed here, in the list the child sees, rather than in the
 * validator.
 *
 * A heart word joins the list in the band where the story bank first uses
 * it, because that is where it is new. Listing it in every later story as
 * well would put 26 words in front of one Band D story and push 38 stories
 * past the twelve a child can meet in one sitting, for words they have
 * already met many times.
 */

import { STORIES } from '../data/stories.js';
import { getSightWordCode } from '../data/sightWordCode.js';
import { extractCountableTokens, supportWords } from './decodability.js';

const BAND_ORDER = ['A', 'B', 'C', 'D'];

/** @type {Map<string, string>|null} heart word → band that first uses it */
let _firstBand = null;

/** The band in which the story bank first uses a heart word, else null. */
export function heartWordFirstBand(word) {
  if (!_firstBand) {
    _firstBand = new Map();
    for (const band of BAND_ORDER) {
      for (const story of STORIES) {
        if (story.band !== band) continue;
        for (const token of extractCountableTokens(story)) {
          if (_firstBand.has(token)) continue;
          if (getSightWordCode(token)?.category === 'heart') _firstBand.set(token, band);
        }
      }
    }
  }
  return _firstBand.get(word) ?? null;
}

/**
 * The words to show before a story: `supportWords`, plus the heart words
 * that are new in this story's band, in the order the child meets them.
 *
 * `status` is supportWords' status, or 'heart' for a word added here.
 *
 * @param {object} story
 * @returns {Array<{ word: string, display: string, status: string }>}
 */
export function wordsToMeet(story) {
  if (!story) return [];
  const support = new Map(supportWords(story).map((w) => [w.word, w]));
  const out = [];
  const seen = new Set();
  for (const token of extractCountableTokens(story)) {
    if (seen.has(token)) continue;
    seen.add(token);
    if (support.has(token)) {
      out.push(support.get(token));
    } else if (heartWordFirstBand(token) === story.band) {
      out.push({ word: token, display: token === 'i' ? 'I' : token, status: 'heart' });
    }
  }
  return out;
}
