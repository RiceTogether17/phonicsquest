/*
 * Audit 2026-09-19, finding 19 — writing feedback uses shallow text signals.
 *
 * The audit's evidence, reproduced here before the fix:
 *
 *   "The island was sandy. She forgot the ball."
 *      → credited with and (inside "sandy"), or (inside "forgot"),
 *        as (inside "was"). Three distinct connectors, from none.
 *
 * "as" inside "was" is the one that mattered most. A past-tense narrative is
 * almost guaranteed to contain "was", so every story a child wrote collected a
 * free subordinate-bank connector, and organisation scored accordingly.
 *
 * Running the same `includes` rule over other realistic drafts showed it went
 * further than the audit's single example — a four-sentence paragraph with no
 * connectors at all scored four, more than a draft that genuinely used two.
 * Required-point coverage had the same defect and cost more: it feeds both the
 * content and task-match scores, and a task asking the child to mention the
 * "ball" was satisfied by "football" or "balloon".
 *
 * Acceptance, from the audit: substring examples produce no connector credit;
 * feedback says what was observed; teacher review is supported; heuristic
 * scores are not presented as PSLE composition marks or independent mastery.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  computeMetrics,
  evaluateWriting,
  describeObserved,
  observedFacts,
  HEURISTIC_CAVEAT,
} from '../modules/writingEvaluator.js';
import {
  computeNarrativeQuality,
  scoreClimaxPresence,
  scoreResolutionPresence,
} from '../modules/writingNarrativeHelpers.js';
import {
  containsAllPhrases,
  containsAllTerms,
  containsAnyPhrase,
  containsTerm,
  containsPhrase,
  countPhrases,
  findPhrases,
  phraseIndex,
} from '../modules/textMatch.js';

const root = resolve(import.meta.dirname, '../..');

/** Every connector the evaluator credited, across all banks. */
const connectors = (text, item = {}) =>
  Object.values(computeMetrics(item, text, 4).connectorHits).flat();

describe('the audit’s example earns no connector credit (finding 19)', () => {
  it('“The island was sandy. She forgot the ball.” credits nothing', () => {
    // Before: ['and', 'or', 'as'].
    expect(connectors('The island was sandy. She forgot the ball.')).toEqual([]);
  });

  it('a draft that really uses connectors still gets them', () => {
    // The fix must not simply stop crediting. This sentence pair scored the
    // same three as the example above; now it scores its actual two.
    expect(connectors('The island was hot and dry. She left because she was tired.')).toEqual([
      'and',
      'because',
    ]);
  });

  it.each([
    ['and inside sandy', 'The beach was sandy.'],
    ['or inside forgot', 'She forgot her bag.'],
    ['as inside was', 'He was late.'],
    ['so inside sorbet', 'A sorbet melted.'],
    ['if inside gift', 'I opened my gift.'],
    ['when inside whenever', 'Whenever possible, we walk.'],
  ])('%s', (_name, text) => {
    expect(connectors(text)).toEqual([]);
  });

  it('a paragraph of substrings no longer outscores a real one', () => {
    const fake = 'The bandage was soft. He was thirsty. The horse ran. A sorbet melted.';
    const real = 'It was cold, so we went in. I read a book while my brother slept.';
    // Before: fake scored 4 distinct connectors and real scored 3.
    expect(connectors(fake)).toEqual([]);
    expect(connectors(real).length).toBeGreaterThan(0);
  });
});

describe('the same defect in the other signals (finding 19)', () => {
  it('“after” is not found in “afternoon”, nor “then” in “when”', () => {
    const m = computeMetrics({}, 'One afternoon the boy was sad. When she came, he smiled.', 4);
    expect(m.chronologicalFlow).toBe(0);
  });

  it('sequence words still count when they are words', () => {
    const m = computeMetrics({}, 'First we packed. Then we left. Finally we arrived home.', 4);
    expect(m.chronologicalFlow).toBe(3);
  });

  it('“rushed” is not found in “brushed”, nor “froze” in “frozen”', () => {
    const m = computeMetrics({}, 'He brushed his teeth. The glass was frozen.', 4);
    expect(m.sensoryHits).toBe(0);
    expect(m.sensoryWordsUsed).toEqual([]);
  });

  it('show-don’t-tell words still count, in the forms a child writes', () => {
    const m = computeMetrics({}, 'She gasped. Her hands trembled and she stared at the door.', 5);
    expect(m.sensoryWordsUsed).toEqual(expect.arrayContaining(['trembled', 'gasped', 'stared']));
  });

  it('a required point is not covered by a longer word containing it', () => {
    const item = {
      requiredChecks: [{ id: 'c1', label: 'Mention the ball', keywordsAny: ['ball'] }],
    };
    const covered = (text) => computeMetrics(item, text, 4).checkResults[0].hit;

    // Both of these used to count as mentioning the ball.
    expect(covered('We played football all day.')).toBe(false);
    expect(covered('A balloon floated by.')).toBe(false);
    // The real thing still does, in singular and plural. Strict word
    // matching alone would have traded the false positive for a false
    // negative here — a child who writes "two balls" HAS mentioned the ball.
    expect(covered('She kicked the ball.')).toBe(true);
    expect(covered('We lost two balls.')).toBe(true);
  });

  it('keywordsAll needs every term as a word', () => {
    const item = {
      requiredChecks: [{ id: 'c1', label: 'Time and place', keywordsAll: ['hall', 'monday'] }],
    };
    const covered = (text) => computeMetrics(item, text, 4).checkResults[0].hit;
    expect(covered('We met in the shallows on Mondays.')).toBe(false);
    // "Mondays" is the plural of a required term, so it counts; "shallows"
    // is not "hall" and never was.
    expect(covered('We met in the hall on Mondays.')).toBe(true);
    expect(covered('We met in the hall on Monday.')).toBe(true);
  });

  it('narrative helpers match on words too', () => {
    // "froze" inside "frozen" and "found" inside "foundation" fed the climax
    // and resolution scores that writingEvaluator folds into its own.
    expect(scoreClimaxPresence('the frozen lake glittered')).toBe(0);
    expect(scoreClimaxPresence('suddenly he froze')).toBeGreaterThan(0);
    expect(scoreResolutionPresence('the foundation was strong')).toBe(0);
    expect(scoreResolutionPresence('in the end we found it')).toBeGreaterThan(0);
  });

  it('a story of substrings scores no narrative quality', () => {
    const before = computeNarrativeQuality(
      'The bandage was soft. The frozen glass was on the foundation. My sister appears sad.',
    );
    expect(before.climax).toBe(0);
    expect(before.resolution).toBe(0);
  });
});

describe('textMatch (finding 19)', () => {
  it('matches words, not letters inside words', () => {
    expect(containsPhrase('He was late', 'as')).toBe(false);
    expect(containsPhrase('It is as big as a bus', 'as')).toBe(true);
  });

  it('is case-insensitive and tolerant of the spacing a child types', () => {
    expect(containsPhrase('After That, we ate.', 'after that')).toBe(true);
    expect(containsPhrase('after\n  that we ate', 'after that')).toBe(true);
  });

  it('treats punctuation as a boundary', () => {
    expect(containsPhrase('We ran, and then stopped.', 'and')).toBe(true);
    expect(containsPhrase('"Stop!" he said.', 'said')).toBe(true);
  });

  it('returns the matches, so a screen can show its evidence', () => {
    expect(findPhrases('It was cold, so we went in.', ['and', 'but', 'so', 'or'])).toEqual(['so']);
    expect(countPhrases('It was cold, so we went in.', ['and', 'but', 'so', 'or'])).toBe(1);
  });

  it('finds a phrase’s position as a word', () => {
    // indexOf would report 0 here, from "when".
    expect(phraseIndex('When we arrived, then we ate.', 'then')).toBe(17);
    expect(phraseIndex('nothing here', 'then')).toBe(-1);
  });

  it('an empty list satisfies “any” and “all” the same way: not at all', () => {
    expect(containsAnyPhrase('anything', [])).toBe(false);
    // A check with no terms has nothing to be satisfied by; `every` on an
    // empty array would return true and mark it covered for free.
    expect(containsAllPhrases('anything', [])).toBe(false);
  });

  it('survives empty and missing input', () => {
    expect(containsPhrase('', 'and')).toBe(false);
    expect(containsPhrase('some text', '')).toBe(false);
    expect(containsPhrase(null, 'and')).toBe(false);
    expect(findPhrases('text', null)).toEqual([]);
  });

  it('required terms tolerate a plural, function words do not', () => {
    expect(containsTerm('we lost two balls', 'ball')).toBe(true);
    expect(containsTerm('we played football', 'ball')).toBe(false);
    expect(containsAllTerms('the hall on Mondays', ['hall', 'monday'])).toBe(true);
    expect(containsAllTerms('the hall', ['hall', 'monday'])).toBe(false);
    // The plural rule is not applied to connectors: loosening a function
    // word is how "as" started matching "was".
    expect(containsPhrase('he was late', 'as')).toBe(false);
  });

  it('handles a term that does not start or end with a letter', () => {
    // Required-point keywords are authored task data and can be anything.
    // `\b$5\b` can never match, because the space before "$" is not a
    // word boundary — so the boundary markers are conditional.
    expect(containsPhrase('the cost was $5 in total', '$5')).toBe(true);
    expect(containsPhrase('we had P.E. today', 'P.E.')).toBe(true);
  });

  it('treats a phrase with regex characters literally', () => {
    expect(containsPhrase('nothing here', 'a.c')).toBe(false);
    expect(containsPhrase('the abc list', 'a.c')).toBe(false);
  });
});

describe('feedback says what was observed (finding 19)', () => {
  const item = {
    requiredChecks: [
      { id: 'c1', label: 'Say when it happened', keywordsAny: ['monday'] },
      { id: 'c2', label: 'Say who was there', keywordsAny: ['teacher'] },
    ],
  };
  const draft =
    'On Monday our class went to the hall. It was noisy, so we waited outside because the door was locked.';

  it('separates what was counted from what was judged', () => {
    const result = evaluateWriting(item, draft, 4);

    // Observations: a teacher would agree with every one of these.
    expect(result.observed.words).toBe(result.metrics.words);
    expect(result.observed.sentences).toBe(result.metrics.sentenceCount);
    expect(result.observed.connectorsUsed).toEqual(expect.arrayContaining(['so', 'because']));
    expect(result.observed.coveredPoints).toContain('Say when it happened');
    expect(result.observed.missingPoints).toContain('Say who was there');

    // Judgements: still here, still needed by the practice loop, but under
    // their own name rather than mixed in with the facts.
    expect(Object.keys(result.dimensions)).toEqual([
      'content',
      'organisation',
      'language',
      'taskFulfilment',
    ]);
  });

  it('names the connectors rather than only counting them', () => {
    // A count can be quietly wrong. A list a child reads back is checkable —
    // which is how this finding would have surfaced in use.
    const summary = describeObserved(observedFacts(computeMetrics(item, draft, 4)));
    expect(summary).toMatch(/connectors you used: .*because/);
    expect(summary).toMatch(/1 of 2 required points found/);
  });

  it('says so when there are none, rather than staying silent', () => {
    const summary = describeObserved(observedFacts(computeMetrics({}, 'The cat sat down.', 2)));
    expect(summary).toContain('no linking words found yet');
  });

  it('an empty draft still returns the full shape', () => {
    const empty = evaluateWriting(item, '', 4);
    expect(empty.observed.connectorsUsed).toEqual([]);
    expect(empty.caveat).toBe(HEURISTIC_CAVEAT);
  });
});

describe('the score is not presented as a composition mark (finding 19)', () => {
  const quest = readFileSync(resolve(root, 'src/modes/writingQuest.js'), 'utf8');

  it('the band carries a caveat wherever it is shown', () => {
    // "Writing Coach Feedback — 🌟 Band 4: Strong" is the four-band
    // vocabulary a Singapore composition rubric uses, with nothing beside it
    // to say a word counter produced it.
    expect(quest).not.toContain('Writing Coach Feedback');
    expect(quest).toContain('Draft check (automatic)');

    // Every place a band is printed goes through the one renderer that adds
    // the caveat — except the AI rubric, which has its own labelling.
    const bandLines = quest
      .split('\n')
      .filter((line) => /Band \$\{/.test(line) && !/_AI_BAND_LABELS/.test(line));
    expect(bandLines).toHaveLength(2); // the draft-check heading and the first-draft snapshot
    expect(bandLines.some((l) => l.includes('draft check'))).toBe(true);
  });

  it('the caveat says what the check cannot do', () => {
    expect(HEURISTIC_CAVEAT).toMatch(/cannot judge/i);
    expect(HEURISTIC_CAVEAT).toMatch(/teacher/i);
  });

  it('the heuristic result is still recorded as guided, never as mastery', () => {
    // Already true before this finding; asserted here because finding 19's
    // acceptance names it, and a later refactor could quietly drop it.
    const call = quest.slice(quest.indexOf("questMastery.updateSkill('writingQuest'"));
    expect(call.slice(0, 200)).toContain('EVIDENCE.GUIDED');
  });
});
