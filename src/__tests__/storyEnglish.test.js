/**
 * The stories model the English a child is learning to read and write.
 *
 * "One egg did wiggle", "Two flies did zoom by" and "they did say" put an
 * emphatic do into a plain statement, which is the pattern a primary
 * grammar paper marks wrong. They crept in because a Band A story cannot
 * use -ed yet, but a plain alternative almost always exists ("One egg had a
 * wiggle", "The box went buzz", "Two flies zoomed by").
 */
import { describe, expect, it } from 'vitest';
import { STORIES } from '../data/stories.js';

/** Words that can follow do/does/did in a correct statement: "did not", "did a check". */
const ALLOWED_AFTER_DO = new Set(
  (
    'not a an the its his her their my your our it this that these those ' +
    'so well what some all too one me him them us'
  ).split(' '),
);

/** Sentences of a line, each with its closing punctuation (and quote) kept. */
function sentences(text) {
  return text.split(/(?<=[.!?]["”’]?)\s+/).filter(Boolean);
}

/** Emphatic do + verb in a statement; questions ("What did he find?") are fine. */
function emphaticDo(text) {
  const found = [];
  for (const sentence of sentences(text)) {
    if (sentence.replace(/["”’]+$/, '').endsWith('?')) continue;
    for (const m of sentence.matchAll(/\b(do|does|did)\s+([A-Za-z']+)/gi)) {
      if (!ALLOWED_AFTER_DO.has(m[2].toLowerCase())) found.push(m[0]);
    }
  }
  return found;
}

describe('story English', () => {
  it('catches the pattern it is meant to catch', () => {
    expect(emphaticDo('One egg did wiggle. Then a big wiggle!')).toEqual(['did wiggle']);
    expect(emphaticDo('"Play the same tune!" they did say.')).toEqual(['did say']);
    expect(emphaticDo('What did he find? Two toads!')).toEqual([]);
    expect(emphaticDo('The chick did not sit. Giri did a check.')).toEqual([]);
    expect(emphaticDo('"Do it again!" Giri came back.')).toEqual([]);
  });

  it('no story puts an emphatic "did" in a plain statement', () => {
    const offences = [];
    for (const story of STORIES) {
      for (const line of story.lines) {
        for (const hit of emphaticDo(line.text ?? '')) offences.push(`${story.id}: "${hit}"`);
      }
    }
    expect(offences).toEqual([]);
  });
});
