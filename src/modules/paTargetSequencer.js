/**
 * PhonicsQuest — Phonemic-Awareness Target Sequencer
 *
 * Drives word selection for First Sound, Last Sound and Middle Sound modes
 * so a child encounters each target phoneme as a *set* of exemplars before
 * the ladder advances.
 *
 * Design (phonics-educator hat):
 *
 *   • Within a stage, the target ladder is the alphabetical list of
 *     graphemes that actually appear at the relevant position (first /
 *     last / middle). So in a Short-A stage, First Sound cycles
 *     /b/ → /c/ → /d/ → /f/ → /h/ → … using the initial consonants
 *     present in that stage's pool, in alphabetical order.
 *
 *   • For each target, the child sees WORDS_PER_TARGET exemplars
 *     (3 for First/Last Sound, 4 for Middle Sound — vowels carry more
 *     phonemic load). Exemplars are picked alphabetically by the whole
 *     word so the teacher gets a predictable order to narrate.
 *
 *   • Big-idea coverage is achieved at the *curriculum* level, not the
 *     session level: as the child works Short A → Short E → Short I →
 *     Short O → Short U stages, every common initial consonant gets
 *     paired with every short vowel in medial position, and every
 *     common final consonant is rehearsed. After all five short-vowel
 *     stages the child has heard the whole CVC phoneme matrix.
 *
 *   • When a stage has only one grapheme at the target position
 *     (Middle Sound in a single-vowel stage like Short A — every word
 *     has /a/ in the middle), the "ladder" collapses to one rung and
 *     we simply cycle the pool alphabetically by word.
 *
 *   • Recently-shown words are skipped so the same exemplar doesn't
 *     come back twice in a row when the pool wraps.
 *
 * No DOM, no store reads — everything is passed in, so tests cover all
 * branches with fixtures.
 */

// Train Carriages is round-based — the mode itself shows 4–6 cards per
// target — so the sequencer hands the framework one word per round, just
// to drive the alphabetical target advancement.
const WORDS_PER_TARGET = { first: 3, last: 3, middle: 4, train: 1 };
const RECENT_LOOKBACK = 10;

/**
 * @typedef {object} PaSequencerState
 * @property {string[]|null} targets             alphabetical ladder of target graphemes for the current pool
 * @property {number}        targetIdx           index of current target on the ladder
 * @property {string[]}      wordsForTargetSeen  word ids already shown for the current target
 * @property {string[]}      history             session-wide list of word ids shown
 * @property {string|null}   key                 mode::group key — sequencer resets when this changes
 */

/** Build a blank sequencer state. */
export function createPaSequencerState() {
  return {
    targets: null,
    targetIdx: 0,
    wordsForTargetSeen: [],
    history: [],
    key: null,
  };
}

/** Return 'first' | 'last' | 'middle' for the PA modes; null otherwise. */
export function paPositionForMode(mode) {
  // Sound Hunt and Odd One Out are first-sound games too: both should walk
  // the same alphabetical target ladder so every initial letter-sound gets
  // systematic coverage instead of adaptive bouncing.
  if (mode === 'first' || mode === 'train' || mode === 'soundHunt' || mode === 'oddOneOut')
    return 'first';
  if (mode === 'last') return 'last';
  if (mode === 'middle') return 'middle';
  return null;
}

/**
 * Pick the grapheme at the "target position" inside a word.
 *
 * For 'middle' on words with an even grapheme count we take the slot just
 * left of centre — for a CVCC word like "belt" (b-e-l-t) the medial vowel
 * lives at index 1, not index 2. The middleSound mode already prefers
 * vowel slots, so this just stays consistent with how that mode picks
 * the target tile (see middleSound.js `_findMidIdx`).
 */
function targetIndexOf(word, position) {
  const gs = word.graphemes;
  const types = Array.isArray(word.types) ? word.types : [];
  if (position === 'first') return 0;
  if (position === 'last') {
    // The last tile that makes a sound: "cake" ends in /k/, not a silent e.
    for (let i = gs.length - 1; i >= 0; i--) if (types[i] !== 'se') return i;
    return gs.length - 1;
  }
  // middle — prefer the leftmost vowel between the first and last sounds,
  // then any vowel; if no type info, fall back to centre.
  const interior = types.findIndex((t, i) => i > 0 && i < types.length - 1 && VOWEL_TYPES.has(t));
  if (interior >= 0) return interior;
  const vowelIdx = types.findIndex((t) => VOWEL_TYPES.has(t));
  if (vowelIdx >= 0) return vowelIdx;
  return Math.floor((gs.length - 1) / 2);
}

const VOWEL_TYPES = new Set(['sv', 'lv', 'rc', 'dp']);

/**
 * Middle Sound only makes sense when a vowel sits between the first and last
 * sounds. "ash" is a-sh: its vowel IS the first sound, so asking for the
 * middle of a two-sound word quizzes First Sound under the wrong name.
 * Mirrors hasInteriorVowel in progress.js, which the adaptive picker uses.
 */
function hasInteriorVowel(word) {
  const types = Array.isArray(word.types) ? word.types : [];
  if (types.length <= 2) return false;
  return types.slice(1, -1).some((t) => VOWEL_TYPES.has(t));
}

function targetGraphemeOf(word, position) {
  return word.graphemes[targetIndexOf(word, position)];
}

/**
 * Build the candidate pool from the master word list, honouring group +
 * level filters. Words must have at least 2 graphemes to be eligible (no
 * single-grapheme sight words in a PA exercise).
 *
 * A word whose target tile does not make its spelling's usual sound is left
 * out. The answer buttons are labelled and voiced by spelling, so the middle
 * of "bush" would be a "u" button playing the u of "bus", and the middle of
 * "rule" a "u" button saying "you" beside an "oo" distractor that is the
 * sound the child actually heard. Tricky (sight) words are left out for the
 * same reason: "who" does not start with the /w/ its "wh" button plays.
 */
/** Games whose answer choices are pictures: every word needs a true one. */
const PICTURE_CHOICE_MODES = new Set(['oddOneOut', 'train']);

function buildPool(wordList, group, maxLevel, position, mode) {
  return wordList.filter(
    (w) =>
      (!group || w.group === group) &&
      (typeof maxLevel !== 'number' || (w.level ?? 1) <= maxLevel) &&
      Array.isArray(w.graphemes) &&
      w.graphemes.length >= 2 &&
      w.group !== 'sight-highfreq' &&
      (position !== 'middle' || hasInteriorVowel(w)) &&
      !w.phonemeKeys?.[targetIndexOf(w, position)] &&
      !(PICTURE_CHOICE_MODES.has(mode) && w.noPicture),
  );
}

function resetLadder(state) {
  state.targets = null;
  state.targetIdx = 0;
  state.wordsForTargetSeen = [];
  state.history = [];
}

/**
 * Return the next word for the active PA mode, advancing the sequencer
 * state in place.
 *
 * @param {PaSequencerState} state
 * @param {object}  opts
 * @param {string}  opts.mode       'first' | 'last' | 'middle'
 * @param {string=} opts.group      curriculum group key (e.g. 'short-a')
 * @param {number=} opts.maxLevel   highest curriculum level allowed
 * @param {Array}   opts.wordList   master word list (injected so tests can swap it in)
 * @returns {object|null}           the chosen word, or null if no pool
 */
export function nextPaWord(state, { mode, group, maxLevel, wordList }) {
  const position = paPositionForMode(mode);
  if (!position) return null;

  // Reset the ladder if the mode/group key changed since the last call —
  // the previous ladder targets no longer apply to a different stage.
  const key = `${mode}::${group ?? ''}`;
  if (state.key !== key) {
    resetLadder(state);
    state.key = key;
  }

  const pool = buildPool(wordList, group, maxLevel, position, mode);
  if (pool.length === 0) return null;

  if (!state.targets) {
    const uniques = new Set(pool.map((w) => targetGraphemeOf(w, position)));
    state.targets = [...uniques].sort((a, b) => a.localeCompare(b));
    state.targetIdx = 0;
    state.wordsForTargetSeen = [];
  }

  const quota = WORDS_PER_TARGET[mode] ?? 3;
  const recent = state.history.slice(-RECENT_LOOKBACK);

  // Two passes around the ladder: first pass tries to honour both the
  // per-target quota AND the "not recently shown" rule. If we make it all
  // the way around without finding anything fresh, second pass relaxes the
  // recent-lookback so we never return null on a non-empty pool.
  for (let relax = 0; relax < 2; relax++) {
    for (let step = 0; step < state.targets.length; step++) {
      const target = state.targets[state.targetIdx];
      const candidates = pool
        .filter((w) => targetGraphemeOf(w, position) === target)
        .sort((a, b) => a.word.localeCompare(b.word));

      const capacity = Math.min(quota, candidates.length);
      if (state.wordsForTargetSeen.length >= capacity) {
        // Quota met for this target — advance.
        state.targetIdx = (state.targetIdx + 1) % state.targets.length;
        state.wordsForTargetSeen = [];
        continue;
      }

      const fresh = candidates.find(
        (w) => !state.wordsForTargetSeen.includes(w.id) && (relax === 1 || !recent.includes(w.id)),
      );
      if (fresh) {
        state.wordsForTargetSeen.push(fresh.id);
        state.history.push(fresh.id);
        return fresh;
      }
      // No fresh candidate at this target — advance ladder.
      state.targetIdx = (state.targetIdx + 1) % state.targets.length;
      state.wordsForTargetSeen = [];
    }
    // Completed a full lap without returning — relax and try again.
  }

  // Absolute fallback: take any pool word so the session never stalls.
  const fallback = pool[0];
  state.history.push(fallback.id);
  return fallback;
}
