import { describe, it, expect } from 'vitest';
import { buildWordWorkout, pickWorkoutModes } from '../src/modules/wordWorkout.js';

const cat = { id: 'cat', word: 'cat', pattern: 'CVC', group: 'short-a' };
const flat = { id: 'flat', word: 'flat', pattern: 'CCVC', group: 'short-a' };
const band = { id: 'band', word: 'band', pattern: 'CVCC', group: 'short-a' };
const stamp = { id: 'stamp', word: 'stamp', pattern: 'CCVCC', group: 'short-a' };
const ship = { id: 'ship', word: 'ship', pattern: 'DIGRAPH', group: 'digraphs' };
const cake = { id: 'cake', word: 'cake', pattern: 'CVCE', group: 'long-a' };
const star = { id: 'star', word: 'star', pattern: 'CCVR', group: 'r-controlled' };

describe('pickWorkoutModes — chooses a sensible ladder per word complexity', () => {
  it('CVC opens with the simplest cue (hear) then climbs', () => {
    expect(pickWorkoutModes(cat)).toEqual(['hear', 'blend', 'segment', 'missing']);
  });

  it('CCVC skips the easiest cue and leads with blending', () => {
    expect(pickWorkoutModes(flat)).toEqual(['blend', 'segment', 'missing', 'soundCount']);
  });

  it('CVCC ends with a final-sound check (the distinguishing skill)', () => {
    expect(pickWorkoutModes(band)).toEqual(['blend', 'segment', 'last', 'missing']);
  });

  it('CCVCC drills both blend and segment plus phoneme counting', () => {
    expect(pickWorkoutModes(stamp)).toEqual(['blend', 'segment', 'soundCount', 'missing']);
  });

  it('digraph group anchors on middle / vowel-pattern work', () => {
    // Note: `group: 'digraphs'` is the active selector here — the
    // long-/digraphs branch fires before the per-pattern switch, so the
    // ladder leads with vowel work rather than pure segmenting.
    expect(pickWorkoutModes(ship)).toEqual(['hear', 'blend', 'middle', 'segment']);
  });

  it('a DIGRAPH-pattern word outside the digraphs group uses the segment ladder', () => {
    const odd = { id: 'odd', word: 'odd', pattern: 'DIGRAPH', group: 'short-o' };
    expect(pickWorkoutModes(odd)).toEqual(['hear', 'blend', 'segment', 'middle']);
  });

  it('long-vowel group anchors on middle / vowel-pattern work', () => {
    expect(pickWorkoutModes(cake)).toEqual(['hear', 'blend', 'middle', 'segment']);
  });

  it('r-controlled group is treated like a vowel pattern', () => {
    expect(pickWorkoutModes(star)).toEqual(['hear', 'blend', 'middle', 'missing']);
  });

  it('falls back to a safe 3-step ladder for unknown patterns', () => {
    expect(pickWorkoutModes({ id: 'foo', word: 'foo' })).toEqual(['hear', 'blend', 'segment']);
  });

  it('returns [] for missing/invalid word input', () => {
    expect(pickWorkoutModes(null)).toEqual([]);
    expect(pickWorkoutModes(undefined)).toEqual([]);
  });
});

describe('buildWordWorkout — same word, varied cues per round', () => {
  it('returns an ordered list of {word, mode} rounds', () => {
    const rounds = buildWordWorkout(cat);
    expect(rounds).toHaveLength(4);
    for (const r of rounds) expect(r.word).toBe(cat);
    expect(rounds.map((r) => r.mode)).toEqual(['hear', 'blend', 'segment', 'missing']);
  });

  it('every round drills the same lexical item (the whole point)', () => {
    const rounds = buildWordWorkout(stamp);
    const ids = new Set(rounds.map((r) => r.word.id));
    expect(ids.size).toBe(1);
    expect(rounds.length).toBeGreaterThan(0);
  });

  it('refuses a word without an id (defensive — workout writes telemetry by id)', () => {
    expect(buildWordWorkout({ word: 'no-id' })).toEqual([]);
    expect(buildWordWorkout(null)).toEqual([]);
  });

  it('a CVC word produces a 4-round workout (hear → blend → segment → missing)', () => {
    expect(buildWordWorkout(cat).length).toBe(4);
  });

  it('an unknown-pattern word produces the 3-round fallback', () => {
    expect(buildWordWorkout({ id: 'foo', word: 'foo' }).length).toBe(3);
  });
});
