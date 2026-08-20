/**
 * Shared helper for the authored sentence batches.
 *
 * Each group is a set of hand-written sentences that share one teaching focus,
 * so the repeated metadata (skills, focus label, grammar note) is stated once
 * and the sentences themselves stay readable as a list.
 */

/**
 * @param {string} focusLabel   shown as the chip on the build screen
 * @param {string[]} sentenceSkills  drives track routing and mastery tagging
 * @param {string} grammarNote  the note shown on a miss and on the reveal
 * @param {string[]} sentences  hand-written sentences
 * @returns {Array<{sentence: string, sentenceSkills: string[], focusLabel: string, grammarNote: string}>}
 */
export function group(focusLabel, sentenceSkills, grammarNote, sentences) {
  return sentences.map((sentence) => ({
    sentence,
    sentenceSkills,
    focusLabel,
    grammarNote,
  }));
}
