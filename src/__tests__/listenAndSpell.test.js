/**
 * Listen and Spell — the encoding mode.
 *
 * Reading and spelling are reciprocal, and until this mode existed the app
 * measured only the reading half: `listenAndSpell` was registered but pointed
 * at `classicBlend` (a reading UI), and `progression.js` criterion 2
 * (spelling accuracy ≥ 80%) had no source of data, so the strictest check in
 * the gate passed every child as `insufficient-spelling-data`.
 *
 * Four things carry the pedagogy and are pinned here:
 *
 *   1. One tile per sound, wherever the mode claims it. A word that cannot
 *      honour it (`fox` — three letters, four sounds) is spelled without the
 *      counting step rather than being asked a question with a wrong answer.
 *   2. Blends split, digraphs don't. `st` is two letters making two sounds
 *      and is spelled one sound at a time; `sh` is one sound and one choice.
 *   3. A plausible misspelling is diagnosed as one. "caik" means the child
 *      segmented correctly and picked the wrong long-a spelling; "cadk"
 *      means the segmenting broke down. Different lessons, different labels.
 *   4. Plausibility never crosses a sound boundary. `c` spells /k/ in `cat`
 *      and /s/ in `race`, so "sat" must NOT be called a plausible spelling
 *      of "cat" — it is a different word.
 *
 * Plus the wiring that was the point of the exercise: an attempt in this
 * mode has to reach `wordSkillStats[...].spelling`, or the gate is still
 * measuring nothing.
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  scoreListenAndSpell,
  getListenAndSpellHint,
  isPlausibleSpelling,
  alternativeSpellings,
} from '../modes/scoring/listenAndSpell.js';
import { WORDS, derivePhonemes } from '../data/words.js';

// The mode pulls in audio.js at module load, which touches speechSynthesis —
// so it is imported after the stub, not at the top of the file.
let MODES, spellingTilesFor, hasOneTilePerSound;
beforeAll(async () => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
  ({ spellingTilesFor, hasOneTilePerSound } = await import('../modes/listenAndSpellMode.js'));
  ({ MODES } = await import('../modes/index.js'));
});

const word = (id) => WORDS.find((w) => w.id === id);

// ── 1. Tiles ──────────────────────────────────────────────────────────────

describe('spellingTilesFor', () => {
  it('leaves single-sound graphemes as one tile', () => {
    expect(spellingTilesFor(word('cat')).map((t) => t.g)).toEqual(['c', 'a', 't']);
  });

  it('keeps a digraph whole — sh is one sound, so it is one choice', () => {
    expect(spellingTilesFor(word('ship')).map((t) => t.g)).toEqual(['sh', 'i', 'p']);
  });

  it('splits a blend — st is two sounds, and you spell it one sound at a time', () => {
    expect(spellingTilesFor(word('flag')).map((t) => t.g)).toEqual(['f', 'l', 'a', 'g']);
    expect(spellingTilesFor(word('stamp')).map((t) => t.g)).toEqual(['s', 't', 'a', 'm', 'p']);
  });

  it('keeps the silent e as its own tile — letters exceeding sounds is the lesson', () => {
    const tiles = spellingTilesFor(word('cake'));
    expect(tiles.map((t) => t.g)).toEqual(['c', 'a', 'k', 'e']);
    expect(tiles[3].type).toBe('se');
  });
});

// ── 2. When the counting step can be asked honestly ───────────────────────

describe('hasOneTilePerSound', () => {
  it('holds for the ordinary cases', () => {
    for (const id of ['cat', 'ship', 'flag', 'stamp', 'cake', 'rain', 'star']) {
      expect(hasOneTilePerSound(word(id)), `${id}`).toBe(true);
    }
  });

  it('fails for x-words — one letter, two sounds, so the count step would lie', () => {
    expect(derivePhonemes(word('fox'))).toHaveLength(4);
    expect(spellingTilesFor(word('fox'))).toHaveLength(3);
    expect(hasOneTilePerSound(word('fox'))).toBe(false);
  });

  it('fails for morphology tiles — a suffix carries several sounds at once', () => {
    const affixed = WORDS.filter((w) => (w.types || []).some((t) => t === 'p' || t === 'sf'));
    expect(affixed.length).toBeGreaterThan(0);
    for (const w of affixed) expect(hasOneTilePerSound(w), `${w.id}`).toBe(false);
  });

  /**
   * The invariant the counting step rests on, checked across the entire bank
   * rather than on a handful of examples: wherever the mode asks "how many
   * sounds?", the tiles (minus any silent e, which has no sound) number
   * exactly that many.
   */
  it('means the tiles really do number the sounds, for every word it holds for', () => {
    const pool = WORDS.filter(hasOneTilePerSound);
    expect(pool.length).toBeGreaterThan(200);
    for (const w of pool) {
      const tiles = spellingTilesFor(w);
      const silentEs = tiles.filter((t) => t.type === 'se').length;
      expect(tiles.length - silentEs, `${w.id}: ${tiles.map((t) => t.g).join('·')}`).toBe(
        derivePhonemes(w).length,
      );
    }
  });

  /**
   * The words it fails for are not dropped — they are spelled without the
   * counting step. Swapping in a neater word would be worse than a missing
   * question: `_handleResult` records against the word the SHELL chose, so a
   * substitution would file the attempt under a word the child never saw.
   */
  it('still leaves every word spellable from its own tiles', () => {
    for (const id of ['fox', 'box', 'six']) {
      const w = word(id);
      if (!w) continue;
      expect(hasOneTilePerSound(w)).toBe(false);
      expect(
        spellingTilesFor(w)
          .map((t) => t.g)
          .join(''),
      ).toBe(w.word.toLowerCase());
    }
  });

  it('tiles always reassemble into the word, across the whole bank', () => {
    for (const w of WORDS) {
      const built = spellingTilesFor(w)
        .map((t) => t.g)
        .join('');
      expect(built, `${w.id}`).toBe(w.word.toLowerCase());
    }
  });
});

// ── 3. Plausible vs impossible ────────────────────────────────────────────

describe('plausible spellings', () => {
  it('calls a real alternative spelling plausible', () => {
    // c-ai-k: correct sounds, wrong long-a spelling.
    expect(
      isPlausibleSpelling(['c', 'a', 'k', 'e'], ['c', 'ai', 'k'], {
        targetTypes: ['c', 'lv', 'c', 'se'],
      }),
    ).toBe(true);
  });

  it('calls kat for cat plausible — k really does spell /k/', () => {
    expect(
      isPlausibleSpelling(['c', 'a', 't'], ['k', 'a', 't'], { targetTypes: ['c', 'sv', 'c'] }),
    ).toBe(true);
  });

  it('treats er, ir and ur as one another — the commonest early spelling slip', () => {
    expect(isPlausibleSpelling(['h', 'er'], ['h', 'ur'], { targetTypes: ['c', 'rc'] })).toBe(true);
  });

  it('does NOT call sat a plausible spelling of cat', () => {
    // `c` spells /k/ here. Letting the sound-group table go both ways would
    // make a different real word "plausible" and put nonsense in a report.
    expect(
      isPlausibleSpelling(['c', 'a', 't'], ['s', 'a', 't'], { targetTypes: ['c', 'sv', 'c'] }),
    ).toBe(false);
  });

  it('does allow s for the soft c in race — the type says the sound', () => {
    expect(
      isPlausibleSpelling(['r', 'a', 'c', 'e'], ['r', 'a', 's', 'e'], {
        targetTypes: ['c', 'lv', 'soft_c', 'se'],
      }),
    ).toBe(true);
  });

  it('rejects a spelling with the wrong number of sounds', () => {
    expect(
      isPlausibleSpelling(['c', 'a', 't'], ['c', 'a'], { targetTypes: ['c', 'sv', 'c'] }),
    ).toBe(false);
  });

  it('rejects letters that cannot make the sound at all', () => {
    expect(
      isPlausibleSpelling(['c', 'a', 'k', 'e'], ['c', 'a', 'd', 'k'], {
        targetTypes: ['c', 'lv', 'c', 'se'],
      }),
    ).toBe(false);
  });

  it('is inert without grapheme data — letter strings cannot be segmented', () => {
    expect(isPlausibleSpelling(undefined, undefined)).toBe(false);
    expect(isPlausibleSpelling(['c', 'a', 't'], [])).toBe(false);
  });
});

describe('alternativeSpellings', () => {
  it('offers the other real spellings of the same sound', () => {
    expect(alternativeSpellings('a_e', 'lv').sort()).toEqual(['ai', 'ay']);
    expect(alternativeSpellings('er', 'rc').sort()).toEqual(['ir', 'ur']);
  });

  it('pins an ambiguous consonant to the sound it makes in this word', () => {
    expect(alternativeSpellings('c', 'c').sort()).toEqual(['ck', 'k']);
    expect(alternativeSpellings('c', 'soft_c').sort()).toEqual(['s', 'ss']);
  });

  it('never offers a vowel spelling for a consonant y', () => {
    // `y` is /y/ in `yam`, long-e in `happy` and long-i in `sky`. Reading the
    // grapheme without its type put `ea`, `ie` and `igh` in the bank for the
    // consonant — three vowel teams offered as spellings of /y/.
    expect(alternativeSpellings('y', 'c')).toEqual([]);
    expect(alternativeSpellings('y', 'lv').length).toBeGreaterThan(0);

    expect(
      isPlausibleSpelling(['y', 'a', 'm'], ['ie', 'a', 'm'], { targetTypes: ['c', 'sv', 'c'] }),
    ).toBe(false);
  });
});

// ── 4. Scoring ────────────────────────────────────────────────────────────

describe('scoreListenAndSpell', () => {
  it('keeps the letter-level categories when grapheme data is absent', () => {
    expect(scoreListenAndSpell({ target: 'cake', written: 'cak' }).errorCategory).toBe(
      'silent-e-missing',
    );
    expect(scoreListenAndSpell({ target: 'pen', written: 'pin' }).errorCategory).toBe(
      'wrong-vowel',
    );
    expect(scoreListenAndSpell({ target: 'cat', written: 'cta' }).errorCategory).toBe(
      'transposed-letters',
    );
    expect(scoreListenAndSpell({ target: 'stamp', written: 'stam' }).errorCategory).toBe(
      'missing-letter',
    );
  });

  it('reports a plausible misspelling as its own category', () => {
    const r = scoreListenAndSpell({
      target: 'cake',
      written: 'caik',
      targetGraphemes: ['c', 'a', 'k', 'e'],
      targetTypes: ['c', 'lv', 'c', 'se'],
      writtenGraphemes: ['c', 'ai', 'k'],
    });
    expect(r.correct).toBe(false);
    expect(r.errorCategory).toBe('plausible-spelling');
    expect(r.plausible).toBe(true);
    // Right sounds is still not right — mastery must not count it.
    expect(r.masteryDelta).toBe(0);
    expect(r.hint).toMatch(/different spelling/i);
  });

  it('does not dress an impossible spelling up as a plausible one', () => {
    const r = scoreListenAndSpell({
      target: 'cake',
      written: 'cadk',
      targetGraphemes: ['c', 'a', 'k', 'e'],
      targetTypes: ['c', 'lv', 'c', 'se'],
      writtenGraphemes: ['c', 'a', 'd', 'k'],
    });
    expect(r.errorCategory).toBe('default');
    expect(r.plausible).toBe(false);
  });

  it('a missing silent e stays a missing silent e, not "a different spelling"', () => {
    const r = scoreListenAndSpell({
      target: 'cake',
      written: 'cak',
      targetGraphemes: ['c', 'a', 'k', 'e'],
      targetTypes: ['c', 'lv', 'c', 'se'],
      writtenGraphemes: ['c', 'a', 'k'],
    });
    expect(r.errorCategory).toBe('silent-e-missing');
    expect(r.plausible).toBe(false);
  });

  it('marks a correct spelling plausible and complete', () => {
    const r = scoreListenAndSpell({ target: 'cat', written: 'cat' });
    expect(r.correct).toBe(true);
    expect(r.plausible).toBe(true);
    expect(getListenAndSpellHint({ target: 'cat', written: 'cat' })).toBe('');
  });
});

// ── 5. Registry + the wiring that was the point ───────────────────────────

describe('registration', () => {
  it('is a playable mode, not an alias for a reading mode', () => {
    expect(MODES.listenAndSpell).toBeTruthy();
    expect(typeof MODES.listenAndSpell.setup).toBe('function');
    expect(MODES.listenAndSpell.setup).not.toBe(MODES.classicBlend.setup);
  });

  it('claims independent evidence — the child produces print, never picks it', () => {
    expect(MODES.listenAndSpell.evidenceCeiling).toBe('independent');
  });
});

describe('spelling evidence reaches the progression gate', () => {
  let store, progress, getSkillForMode;

  beforeEach(async () => {
    ({ store } = await import('../modules/store.js'));
    ({ progress, getSkillForMode } = await import('../modules/progress.js'));
    localStorage.clear();
    store.resetStorageKey();
    store.reset();
  });

  afterEach(() => localStorage.clear());

  it('bins to the spelling skill', () => {
    expect(getSkillForMode('listenAndSpell')).toBe('spelling');
  });

  it('writes spelling attempts that criterion 2 can actually read', () => {
    // Before: `missing` and `wordSort` were the only spelling-binned modes,
    // and both are selection tasks. This is the first produced spelling.
    progress.recordAttempt('cat', true, 'listenAndSpell', 4200);
    progress.recordAttempt('cat', false, 'listenAndSpell', 6100);

    const stats = store.get('wordSkillStats').cat.spelling;
    expect(stats.attempts).toBe(2);
    expect(stats.correct).toBe(1);
    // The gate measures what the child can do unaided; the mode's ceiling
    // has to carry through to the independent counters or criterion 2 still
    // has nothing to read.
    expect(stats.independentAttempts).toBe(2);
    expect(stats.independentCorrect).toBe(1);
  });
});
