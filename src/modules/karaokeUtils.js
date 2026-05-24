/**
 * Pure helpers for karaoke read-aloud in Giri Stories.
 *
 * Kept in its own module so it can be unit-tested without dragging in the
 * Web Audio / speechSynthesis stack — and so other readers (e.g. future
 * Word Detective tooltips) can reuse the charIndex → word-index mapping
 * without coupling to storyMode.
 */

/**
 * Map a TTS `boundary` event `charIndex` back to a zero-based word index
 * inside the utterance text. Counts whitespace-separated tokens up to and
 * including the character at `charIndex`. Returns -1 for invalid input so
 * the caller can skip the highlight cleanly (e.g. when a voice fires
 * boundary events for non-word units).
 *
 * @param {string} text
 * @param {number} charIndex
 * @returns {number}
 */
export function mapCharIndexToWord(text, charIndex) {
  if (typeof text !== 'string' || text.length === 0) return -1;
  if (typeof charIndex !== 'number' || !Number.isFinite(charIndex) || charIndex < 0) return -1;
  const clamped = Math.min(charIndex, text.length - 1);

  let wordIdx = -1;
  let inWord = false;
  for (let i = 0; i <= clamped; i++) {
    const isSpace = /\s/.test(text.charAt(i));
    if (!isSpace && !inWord) {
      wordIdx++;
      inWord = true;
    } else if (isSpace) {
      inWord = false;
    }
  }
  return wordIdx < 0 ? -1 : wordIdx;
}

/**
 * Should an element be scrolled into view? True if it has fallen offscreen
 * by an 80px margin (top or bottom). Pulled out so storyMode can stay
 * jiggle-free during karaoke and the rule is easy to test.
 *
 * @param {{ top:number, bottom:number }} rect
 * @param {number} viewportHeight
 * @returns {boolean}
 */
export function isOffscreen(rect, viewportHeight) {
  if (!rect || typeof rect.top !== 'number' || typeof rect.bottom !== 'number') return false;
  if (typeof viewportHeight !== 'number' || viewportHeight <= 0) return false;
  const margin = 80;
  return rect.bottom < margin || rect.top > viewportHeight - margin;
}
