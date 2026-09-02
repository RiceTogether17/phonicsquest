import { describe, it, expect } from 'vitest';
import {
  createPaSequencerState,
  nextPaWord,
  paPositionForMode,
} from '../src/modules/paTargetSequencer.js';

/**
 * Educator-design tests for the phonemic-awareness target sequencer.
 *
 * The big idea: a child cycling through First / Last / Middle Sound modes
 * should hear each target phoneme as a SET of exemplars before the ladder
 * advances, and the ladder itself should march alphabetically so a teacher
 * can run the session systematically.
 */

// A compact, deterministic Short-A pool covering enough initial and final
// consonants to exercise the ladder without dragging in the entire word list.
const SHORT_A_POOL = [
  {
    id: 'bag',
    word: 'bag',
    graphemes: ['b', 'a', 'g'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'bat',
    word: 'bat',
    graphemes: ['b', 'a', 't'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'bad',
    word: 'bad',
    graphemes: ['b', 'a', 'd'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'cab',
    word: 'cab',
    graphemes: ['c', 'a', 'b'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'can',
    word: 'can',
    graphemes: ['c', 'a', 'n'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'cap',
    word: 'cap',
    graphemes: ['c', 'a', 'p'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'cat',
    word: 'cat',
    graphemes: ['c', 'a', 't'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'dad',
    word: 'dad',
    graphemes: ['d', 'a', 'd'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'dam',
    word: 'dam',
    graphemes: ['d', 'a', 'm'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'fan',
    word: 'fan',
    graphemes: ['f', 'a', 'n'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'hat',
    word: 'hat',
    graphemes: ['h', 'a', 't'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
  {
    id: 'ham',
    word: 'ham',
    graphemes: ['h', 'a', 'm'],
    types: ['c', 'sv', 'c'],
    group: 'short-a',
    level: 1,
  },
];

const SHORT_E_POOL = [
  {
    id: 'bed',
    word: 'bed',
    graphemes: ['b', 'e', 'd'],
    types: ['c', 'sv', 'c'],
    group: 'short-e',
    level: 1,
  },
  {
    id: 'beg',
    word: 'beg',
    graphemes: ['b', 'e', 'g'],
    types: ['c', 'sv', 'c'],
    group: 'short-e',
    level: 1,
  },
  {
    id: 'hen',
    word: 'hen',
    graphemes: ['h', 'e', 'n'],
    types: ['c', 'sv', 'c'],
    group: 'short-e',
    level: 1,
  },
];

function runSession(state, opts, n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const w = nextPaWord(state, opts);
    if (!w) break;
    out.push(w);
  }
  return out;
}

describe('paPositionForMode', () => {
  it('maps PA mode keys to positions; null for everything else', () => {
    expect(paPositionForMode('first')).toBe('first');
    expect(paPositionForMode('last')).toBe('last');
    expect(paPositionForMode('middle')).toBe('middle');
    expect(paPositionForMode('blend')).toBeNull();
    expect(paPositionForMode('soundCount')).toBeNull();
  });
});

describe('First Sound — alphabetical ladder of initial phonemes', () => {
  it('visits initial graphemes alphabetically, 3 exemplars per target', () => {
    const state = createPaSequencerState();
    const words = runSession(
      state,
      {
        mode: 'first',
        group: 'short-a',
        wordList: SHORT_A_POOL,
      },
      12,
    );

    const firstGraphemes = words.map((w) => w.graphemes[0]);
    // First three should all be /b/, next three /c/, then /d/ (only 2 d-words
    // in the pool), then continue with /f/, /h/ — alphabetical throughout.
    expect(firstGraphemes.slice(0, 3)).toEqual(['b', 'b', 'b']);
    expect(firstGraphemes.slice(3, 7)).toEqual(['c', 'c', 'c', 'd']);
  });

  it('exemplars within a target are picked alphabetically by word', () => {
    const state = createPaSequencerState();
    const bWords = runSession(
      state,
      {
        mode: 'first',
        group: 'short-a',
        wordList: SHORT_A_POOL,
      },
      3,
    ).map((w) => w.word);
    expect(bWords).toEqual(['bad', 'bag', 'bat']);
  });

  it('caps at candidate count when a target has fewer than the quota', () => {
    const state = createPaSequencerState();
    // /d/ only has 2 words (dad, dam) — sequencer should advance after 2
    // and never return a duplicate.
    const words = runSession(
      state,
      {
        mode: 'first',
        group: 'short-a',
        wordList: SHORT_A_POOL,
      },
      9,
    );
    const fromD = words.filter((w) => w.graphemes[0] === 'd');
    expect(fromD.map((w) => w.word).sort()).toEqual(['dad', 'dam']);
  });
});

describe('Last Sound — alphabetical ladder of final phonemes', () => {
  it('visits final graphemes alphabetically', () => {
    const state = createPaSequencerState();
    const words = runSession(
      state,
      {
        mode: 'last',
        group: 'short-a',
        wordList: SHORT_A_POOL,
      },
      8,
    );
    const lasts = words.map((w) => w.graphemes[w.graphemes.length - 1]);
    // /b/ (cab) → /d/ (bad, dad) → /g/ (bag) → /m/ (dam, ham) → /n/ (can, fan) → ...
    expect(lasts[0]).toBe('b');
    expect(lasts.slice(1, 3)).toEqual(['d', 'd']);
    expect(lasts[3]).toBe('g');
    // Subsequent targets continue alphabetically; pin a couple more.
    expect(lasts.slice(4, 6).sort()).toEqual(['m', 'm']);
  });
});

describe('Middle Sound — single-vowel stage collapses ladder to one rung', () => {
  it('cycles all words alphabetically by word when only one medial grapheme exists', () => {
    const state = createPaSequencerState();
    const words = runSession(
      state,
      {
        mode: 'middle',
        group: 'short-a',
        wordList: SHORT_A_POOL,
      },
      6,
    );

    // Every Short-A word has /a/ medial; ladder has one rung.
    const middles = words.map((w) => w.graphemes[1]);
    expect(new Set(middles)).toEqual(new Set(['a']));
    // First four exemplars should be alphabetical by whole word.
    expect(words.slice(0, 4).map((w) => w.word)).toEqual(['bad', 'bag', 'bat', 'cab']);
  });
});

describe('Session reset on mode/group change', () => {
  it('resets the ladder when the mode key changes', () => {
    const state = createPaSequencerState();
    runSession(state, { mode: 'first', group: 'short-a', wordList: SHORT_A_POOL }, 4);
    expect(state.targetIdx).toBeGreaterThan(0);
    // Switch to a different mode — ladder should rebuild from scratch.
    const first = nextPaWord(state, { mode: 'last', group: 'short-a', wordList: SHORT_A_POOL });
    expect(first).not.toBeNull();
    expect(state.targetIdx).toBe(0);
    expect(state.history).toHaveLength(1);
  });

  it('resets when the group changes (different stage)', () => {
    const state = createPaSequencerState();
    runSession(state, { mode: 'first', group: 'short-a', wordList: SHORT_A_POOL }, 4);
    const next = nextPaWord(state, {
      mode: 'first',
      group: 'short-e',
      wordList: [...SHORT_A_POOL, ...SHORT_E_POOL],
    });
    expect(next).not.toBeNull();
    expect(next.group).toBe('short-e');
    expect(state.history).toEqual([next.id]);
  });
});

describe('Edge cases', () => {
  it('returns null for non-PA modes', () => {
    const state = createPaSequencerState();
    const w = nextPaWord(state, { mode: 'blend', group: 'short-a', wordList: SHORT_A_POOL });
    expect(w).toBeNull();
  });

  it('returns null when the pool is empty', () => {
    const state = createPaSequencerState();
    const w = nextPaWord(state, { mode: 'first', group: 'nonexistent', wordList: SHORT_A_POOL });
    expect(w).toBeNull();
  });

  it('honours maxLevel filter', () => {
    const state = createPaSequencerState();
    const mixed = [
      ...SHORT_A_POOL,
      {
        id: 'flat',
        word: 'flat',
        graphemes: ['f', 'l', 'a', 't'],
        types: ['c', 'c', 'sv', 'c'],
        group: 'short-a',
        level: 2,
      },
    ];
    const words = runSession(
      state,
      {
        mode: 'first',
        group: 'short-a',
        maxLevel: 1,
        wordList: mixed,
      },
      12,
    );
    expect(words.every((w) => w.level === 1)).toBe(true);
  });
});

describe('Big-idea coverage — full Short-A pool sweep with real WORDS list', () => {
  it('First Sound across Short A surfaces every initial consonant that exists in the pool', async () => {
    const { WORDS } = await import('../src/data/words.js');
    const shortA = WORDS.filter((w) => w.group === 'short-a' && w.level === 1);
    const expectedTargets = new Set(shortA.map((w) => w.graphemes[0]));

    const state = createPaSequencerState();
    const seenTargets = new Set();
    // Run enough rounds to cover the ladder twice with room to spare.
    for (let i = 0; i < expectedTargets.size * 5; i++) {
      const w = nextPaWord(state, { mode: 'first', group: 'short-a', wordList: WORDS });
      if (w) seenTargets.add(w.graphemes[0]);
    }
    expect(seenTargets).toEqual(expectedTargets);
  });
});
