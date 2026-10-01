/**
 * PhonicsQuest — finding the sentence that answers a question.
 *
 * What a teacher does when a child answers wrongly is not tell them the
 * answer. It is send them back to the place in the text that holds it:
 * "have another look at the bit about the storm." That turns a wrong answer
 * into a second attempt at reading for meaning, which is the skill being
 * taught, instead of into a score.
 *
 * The app had the gesture but not the mechanism. `💭 Show me where` scrolled
 * to `.sline--end, .sline:last-of-type` — the last line of the story,
 * whatever the question was. A fixed guess dressed as help.
 *
 * This locates the sentence by plain word overlap with the question and its
 * answer. Deliberately not clever: a child needs to be sent somewhere
 * defensible, and a transparent rule that can be checked against all 102
 * authored questions is worth more here than a smarter one that cannot.
 *
 * Modelled on the clue matcher in the LiftOff Stories reader
 * (github.com/RiceTogether17/LiftOff), fitted to this app's line/word
 * addressing so the reader can highlight the exact span.
 */

import { tokenise } from '../utils/tokenise.js';

/**
 * Words too common to locate anything. Dropping them is what stops every
 * question matching the longest sentence in the story.
 */
const STOP = new Set(
  `a an the and or but so to of in on at by for with from up down out over into is are was were be been am
   it its this that these those he she they we you i me my his her their our your him them us
   do does did not no yes what who where when why how which there here then than as if too very
   can could will would should has have had just all some any one true false story about
   said says say get got go goes going come came make made take took put
   little big new old good bad first next last also more most many much`.split(/\s+/),
);

/**
 * Light suffix stripping, so a question about "cakes" finds the sentence
 * about a cake.
 *
 * Deliberately ordered. A blanket `(ing|ed|es|s|ly)$` turns "cakes" into
 * "cak" while "cake" stays "cake", so the two stop matching — the opposite
 * of the point. And collapsing a doubled final letter only makes sense
 * after a suffix came off ("hopped" → "hopp" → "hop"); applied to every
 * word it turns "ball" into "bal" and "miss" into "mis".
 */
function stem(word) {
  let w = word
    .toLowerCase()
    .replace(/[^a-z']/g, '')
    .replace(/'s$/, '');

  // Plurals and third person first, cheapest reading of each shape.
  if (/[^aeiou]ies$/.test(w))
    w = `${w.slice(0, -3)}y`; // stories → story
  else if (/(ss|sh|ch|x|z)es$/.test(w))
    w = w.slice(0, -2); // boxes → box
  else if (/[^s]es$/.test(w))
    w = w.slice(0, -1); // cakes → cake
  else if (/[^su]s$/.test(w)) w = w.slice(0, -1); // cats → cat

  let cut = false;
  if (/.{3,}ing$/.test(w)) {
    w = w.slice(0, -3);
    cut = true;
  } else if (/.{3,}ed$/.test(w)) {
    w = w.slice(0, -2);
    cut = true;
  } else if (/.{3,}ly$/.test(w)) {
    w = w.slice(0, -2);
    cut = true;
  }
  // hopped → hopp → hop, but ball stays ball.
  if (cut) w = w.replace(/([bdgmnprt])\1$/, '$1');
  return w;
}

/** The words in a piece of text worth matching on. */
export function keywords(text) {
  return new Set(
    String(text ?? '')
      .split(/[\s\-—–/]+/)
      .map((w) => w.toLowerCase().replace(/[^a-z']/g, ''))
      .filter((w) => w.length > 1 && !STOP.has(w))
      .map(stem)
      .filter((w) => w.length > 1),
  );
}

/**
 * Split a story into sentences, addressed the way the reader renders them.
 *
 * `line` is the index into `story.lines` (the reader's `data-line`), and
 * `from`/`to` are inclusive word indices within that line, matching the
 * `data-word-idx` on each `.wf-word`. That is what lets the reader light up
 * the exact sentence rather than the whole paragraph.
 *
 * @param {{lines: Array<{type?:string, text?:string}>}} story
 * @returns {Array<{line:number, from:number, to:number, text:string}>}
 */
export function sentences(story) {
  const out = [];
  (story?.lines ?? []).forEach((l, line) => {
    // Labels are the teacher's story-grammar frame, not story text — a clue
    // pointing at "Problem:" tells a child nothing.
    if (l.type === 'label' || l.type === 'chapter' || !l.text) return;

    // Numbered with the reader's own tokeniser, so `from`/`to` are the
    // `data-word-idx` values on screen rather than a second opinion about
    // where the words are. See utils/tokenise.js for what went wrong when
    // they were two different splits.
    const tokens = tokenise(l.text);
    let wordIdx = -1;
    let from = null;
    let said = [];

    const flush = () => {
      if (from === null) return;
      out.push({ line, from, to: wordIdx, text: said.join('').trim() });
      from = null;
      said = [];
    };

    for (const t of tokens) {
      if (t.type === 'word') {
        wordIdx += 1;
        if (from === null) from = wordIdx;
      }
      if (from !== null) said.push(t.text);
      // End of a sentence — the closing quote or bracket belongs to it.
      if (t.type === 'punct' && /[.!?]/.test(t.text)) flush();
    }
    flush();
  });
  return out;
}

/** Below this, the best match is not good enough to send a child to. */
export const MIN_SCORE = 3;

/**
 * The sentence that best answers a question, or null when nothing in the
 * story matches well enough.
 *
 * Returning null matters: being sent to an arbitrary sentence is worse than
 * being told the answer, because the child reads it, finds nothing, and
 * learns that looking back does not work.
 *
 * @param {object} story
 * @param {string} question
 * @param {string} [answer] the right answer, when known — its words count most
 * @returns {{line:number, from:number, to:number, text:string}|null}
 */
export function findClue(story, question, answer = '') {
  const want = keywords(`${question} ${answer}`);
  const key = keywords(answer);
  if (!want.size) return null;

  let best = null;
  let bestScore = 0;
  for (const s of sentences(story)) {
    const have = keywords(s.text);
    let score = 0;
    for (const w of want) {
      if (!have.has(w)) continue;
      // A long word is a better locator than a short one, and a word from
      // the answer itself is the best locator of all.
      score += (w.length > 3 ? 2 : 1) * (key.has(w) ? 3 : 1);
    }
    // On a tie prefer the shorter sentence: it points more precisely.
    if (
      score > bestScore ||
      (score === bestScore && score > 0 && best && s.text.length < best.text.length)
    ) {
      best = s;
      bestScore = score;
    }
  }
  return bestScore >= MIN_SCORE ? best : null;
}

/**
 * The clue for a Story Quest multiple-choice question.
 * @param {object} story
 * @param {{q:string, options?:string[], answer?:number}} question
 */
export function clueForQuestion(story, question) {
  if (!question?.q) return null;
  const answerText = question.options?.[question.answer] ?? '';
  return findClue(story, question.q, answerText);
}
