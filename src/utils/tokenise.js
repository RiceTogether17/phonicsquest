/**
 * PhonicsQuest — one tokeniser for story text.
 *
 * The reader wraps each word of a story in a span and numbers it, and the
 * clue matcher addresses sentences by those same numbers so it can light up
 * an exact span. Two separate splits of the same text had been doing this —
 * the reader's punctuation-aware one, and the clue matcher's whitespace
 * one — and they agreed on most lines by coincidence.
 *
 * They disagreed on 30 of the bank's 302 lines: "Giri's" is one
 * whitespace word but two word tokens, and a standalone em dash is one
 * whitespace word but no word token at all. On those lines a clue would
 * have lit up the wrong phrase, which is worse than lighting up nothing —
 * the child reads it, finds no answer, and learns that looking back is
 * pointless.
 *
 * So there is one split, here, and both callers use it.
 */

/** A word, a run of punctuation, or a run of whitespace. */
const SPLIT = /(\s+|["“”'',.!?;:()-]+)/;

/**
 * @param {string} text
 * @returns {Array<{text:string, type:'word'|'punct'|'space'}>}
 */
export function tokenise(text) {
  return String(text ?? '')
    .split(SPLIT)
    .filter((p) => p.length > 0)
    .map((p) => ({
      text: p,
      type: /^\s+$/.test(p) ? 'space' : /^[^a-zA-Z0-9]+$/.test(p) ? 'punct' : 'word',
    }));
}

/**
 * The words of a line, in the order the reader numbers them.
 * @param {string} text
 * @returns {string[]}
 */
export function words(text) {
  return tokenise(text)
    .filter((t) => t.type === 'word')
    .map((t) => t.text);
}
