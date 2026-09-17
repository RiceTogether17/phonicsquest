/**
 * Pseudoword decoding in the placement screener.
 *
 * Every Gate B decoding item speaks the word and asks the child to pick it
 * from four printed options, so a child who knows `cat`, `bed` and `ship` by
 * sight passes without decoding anything. `decoding` has always been an
 * upper bound on decoding rather than a measure of it — the exact confusion
 * `evidence.js` exists to prevent, untested in the one place the app makes
 * its strongest claim about a child.
 *
 * A nonword cannot be memorised, so it separates the two. These tests pin:
 *
 *   1. Every probe is decodable at the phase it claims, checked against the
 *      SAME code model the story bank uses.
 *   2. No probe is a real word — otherwise the whole argument collapses.
 *   3. The bank is a hand-written constant, never generated. In a
 *      children's app an unreviewed letter string is a liability.
 *   4. Sight recall can no longer pass as decoding: when the probe has been
 *      administered, the weaker of the two scores governs Gate B.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { WORDS } from '../data/words.js';
import { isWordDecodable, getStoryPhase } from '../modules/decodability.js';
import { getHFWTier } from '../data/hfw.js';
import { getTrickyWord } from '../data/trickyWords.js';

let PSEUDOWORD_ITEMS, derivePlacementResult, getNextGateToAppend;

beforeAll(async () => {
  const synth = {
    getVoices: () => [],
    addEventListener: () => {},
    cancel: () => {},
    speak: () => {},
  };
  globalThis.speechSynthesis = globalThis.speechSynthesis || synth;
  if (globalThis.window) {
    globalThis.window.speechSynthesis = globalThis.window.speechSynthesis || synth;
  }
  const mod = await import('../modules/placementTest.js');
  ({ PSEUDOWORD_ITEMS, derivePlacementResult, getNextGateToAppend } = mod);
});

// ── 1. The items ──────────────────────────────────────────────────────────

describe('the probe bank', () => {
  it('covers every placement phase the screener reaches', () => {
    const phases = [...new Set(PSEUDOWORD_ITEMS.map((i) => i.phase))].sort((a, b) => a - b);
    expect(phases).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('is decodable at the phase it claims', () => {
    // Checked against the story bank's own code model, so a probe can never
    // ask for a grapheme its phase has not released. This caught a real
    // error while the bank was being written: `zake`'s first draft sat at
    // `long-a`, whose budget releases a_e but not o_e, i_e or u_e.
    for (const item of PSEUDOWORD_ITEMS) {
      expect(getStoryPhase(item.codePhase), `${item.id}: codePhase`).toBeTruthy();
      expect(
        isWordDecodable(item.word, item.codePhase),
        `${item.id}: "${item.word}" is not decodable at ${item.codePhase}`,
      ).toBe(true);
    }
  });

  it('contains no real word — the whole argument rests on this', () => {
    const real = new Set(WORDS.map((w) => w.word.toLowerCase()));
    for (const { id, word } of PSEUDOWORD_ITEMS) {
      expect(real.has(word), `${id}: "${word}" is in the word bank`).toBe(false);
      expect(getHFWTier(word), `${id}: "${word}" is a high-frequency word`).toBeNull();
      expect(getTrickyWord(word), `${id}: "${word}" is a tricky word`).toBeFalsy();
    }
  });

  it('is a frozen constant, not something generated at run time', () => {
    // A generator cannot be reviewed, and plausible English letter patterns
    // produce crude and offensive strings readily. Every entry here has been
    // read by a person; freezing the bank keeps it that way.
    expect(Object.isFrozen(PSEUDOWORD_ITEMS)).toBe(true);
    const first = PSEUDOWORD_ITEMS.map((i) => i.word).join(',');
    const second = PSEUDOWORD_ITEMS.map((i) => i.word).join(',');
    expect(second).toBe(first);
  });

  it('tells the adult what the word should sound like, and never speaks it', () => {
    for (const item of PSEUDOWORD_ITEMS) {
      expect(item.sounds, `${item.id}: sounds`).toBeTruthy();
      // Speaking it would make this the listen-and-choose task Gate B
      // already runs — sound → print, not print → sound.
      expect(item.speak, `${item.id} must not carry audio`).toBeUndefined();
      expect(item.options, `${item.id} must not offer printed choices`).toBeUndefined();
      expect(item.section).toBe('pseudoword');
      expect(item.kind).toBe('pseudoword');
    }
  });

  it('never prints the word in its own prompt', () => {
    // The same leak that made Gate B meaningless before Priority 0: the
    // prompt is rendered verbatim above the item.
    for (const item of PSEUDOWORD_ITEMS) {
      expect(item.prompt.toLowerCase(), `${item.id}`).not.toContain(item.word);
    }
  });
});

// ── 2. The scoring — what the probe is actually for ───────────────────────

describe('sight recall can no longer pass as decoding', () => {
  const strongGateA = [
    { section: 'oral', score: 1 },
    { section: 'vocab', correct: true },
    { section: 'firstSound', correct: true },
    { section: 'lastSound', correct: true },
    { section: 'middleSound', correct: true },
    { section: 'letterSounds', score: 1 },
    { section: 'oralBlending', correct: true },
  ];
  const realWordsAllCorrect = [
    { section: 'decoding', correct: true, phase: 1, group: 'cvc-a' },
    { section: 'decoding', correct: true, phase: 2, group: 'ccvc-a' },
    { section: 'decoding', correct: true, phase: 3, group: 'cvcc-e' },
  ];

  it('a child who reads cat but not zaf does not clear Gate B', () => {
    // The case the probe exists for. Real-word decoding is perfect; the
    // nonwords are not read at all. Before this, that child was "secure".
    const sightReader = derivePlacementResult(
      [
        ...strongGateA,
        ...realWordsAllCorrect,
        { section: 'pseudoword', score: 0 },
        { section: 'pseudoword', score: 0 },
        { section: 'pseudoword', score: 0 },
      ],
      {},
      'primary',
    );
    expect(sightReader.stageScores.reading.decoding).toBe(1);
    expect(sightReader.stageScores.reading.pseudoword).toBe(0);

    // `gateBSecure` is internal, so assert what it actually drives — the
    // band the child is placed in and whether stories are offered. Those
    // are what reach the child, and they are what used to be wrong.
    expect(sightReader.readingBand).not.toBe('developing-reader');
    expect(sightReader.storyReadiness).toBe('not-ready');
  });

  it('a child who reads both clears it', () => {
    const decoder = derivePlacementResult(
      [
        ...strongGateA,
        ...realWordsAllCorrect,
        { section: 'pseudoword', score: 1 },
        { section: 'pseudoword', score: 1 },
        { section: 'pseudoword', score: 1 },
      ],
      {},
      'primary',
    );
    expect(decoder.stageScores.reading.pseudoword).toBe(1);
    expect(decoder.stageScores.reading.sightRecallGap).toBe(0);
    // Same real-word score as the sight reader above; the nonwords are the
    // only difference, and they are what moves the band.
    expect(decoder.readingBand).toBe('developing-reader');
    expect(decoder.storyReadiness).not.toBe('not-ready');
  });

  it('reports the gap, which is how much of the decoding score is sight recall', () => {
    const partial = derivePlacementResult(
      [
        ...strongGateA,
        ...realWordsAllCorrect,
        { section: 'pseudoword', score: 0.5 },
        { section: 'pseudoword', score: 0 },
      ],
      {},
      'primary',
    );
    // Real words 1.0, nonwords 0.25 → three quarters of the apparent
    // decoding score is not decoding.
    expect(partial.stageScores.reading.sightRecallGap).toBeCloseTo(0.75, 2);
  });

  it('does not rescore profiles recorded before the probe existed', () => {
    // `_weightedPresent` renormalises over administered sections, so
    // splitting decoding's 0.4 share unconditionally would have quietly
    // lowered the reading composite of every existing profile. The carve
    // only happens when the probe actually ran.
    // Every reading section administered, only decoding correct — the same
    // shape placementStages.test.js uses to pin the 0.4 decoding weight.
    const otherSectionsZero = [
      { section: 'sightWords', correct: false },
      { section: 'connectedReading', correct: false },
      { section: 'comprehension', correct: false },
      { section: 'storyReadiness', score: 0 },
    ];
    const before = derivePlacementResult(
      [...strongGateA, ...realWordsAllCorrect, ...otherSectionsZero],
      {},
      'primary',
    );
    expect(before.stageScores.reading.composite).toBeCloseTo(0.4, 2);

    // Add the probe and decoding's share splits 0.25/0.15, so a child who
    // reads real words but no nonwords now scores lower than one who was
    // never asked — which is the point.
    const withProbe = derivePlacementResult(
      [
        ...strongGateA,
        ...realWordsAllCorrect,
        ...otherSectionsZero,
        { section: 'pseudoword', score: 0 },
      ],
      {},
      'primary',
    );
    expect(withProbe.stageScores.reading.composite).toBeCloseTo(0.25, 2);
  });

  it('stays null when the probe was never administered', () => {
    // Most of the bank predates this item type, and a screener that stopped
    // before Gate B has no opinion to offer.
    const noProbe = derivePlacementResult([...strongGateA, ...realWordsAllCorrect], {}, 'primary');
    expect(noProbe.stageScores.reading.sightRecallGap).toBeNull();
  });
});

// ── 3. When the probe is offered ──────────────────────────────────────────

describe('gate sequencing', () => {
  const seen = (...gates) => gates.map((gate) => ({ gate }));

  it('follows Gate B when real-word decoding is working', () => {
    const result = {
      gateScores: { gateA: 0.8, gateB: 0.8, gateC: 0 },
    };
    expect(getNextGateToAppend(result, seen('INTAKE', 'A', 'B'))).toBe('B2');
  });

  it('is skipped when decoding is too weak to probe', () => {
    // A page of words that mean nothing is the most discouraging thing in
    // the screener, and tells us nothing we do not already know.
    const struggling = { gateScores: { gateA: 0.8, gateB: 0.3, gateC: 0 } };
    expect(getNextGateToAppend(struggling, seen('INTAKE', 'A', 'B'))).toBe(null);
  });

  it('is never offered twice', () => {
    const result = { gateScores: { gateA: 0.8, gateB: 0.8, gateC: 0 } };
    expect(getNextGateToAppend(result, seen('INTAKE', 'A', 'B', 'B2'))).toBe('C');
  });
});

describe('the report says what the probe found', () => {
  let renderPlacementReportHtml;
  beforeAll(async () => {
    ({ renderPlacementReportHtml } = await import('../modules/placementTest.js'));
  });

  const base = [
    { section: 'oral', score: 1 },
    { section: 'vocab', correct: true },
    { section: 'firstSound', correct: true },
    { section: 'letterSounds', score: 1 },
    { section: 'decoding', correct: true, phase: 1, group: 'cvc-a' },
    { section: 'decoding', correct: true, phase: 2, group: 'ccvc-a' },
  ];

  it('names sight recall when real words beat nonwords', () => {
    const html = renderPlacementReportHtml(
      derivePlacementResult([...base, { section: 'pseudoword', score: 0 }], {}, 'primary'),
    );
    expect(html).toContain('Nonsense word reading');
    expect(html).toMatch(/recognised on sight rather than sounded out/i);
  });

  it('says the code is secure when the two match', () => {
    const html = renderPlacementReportHtml(
      derivePlacementResult([...base, { section: 'pseudoword', score: 1 }], {}, 'primary'),
    );
    expect(html).toMatch(/what secure decoding looks like/i);
  });

  it('stays silent when the probe never ran — no guessing', () => {
    const html = renderPlacementReportHtml(derivePlacementResult(base, {}, 'primary'));
    expect(html).not.toContain('Nonsense word reading');
  });
});
