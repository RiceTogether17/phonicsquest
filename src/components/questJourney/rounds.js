/**
 * Quest Journey — round builders.
 *
 * Pure functions that turn a stage definition into a sequence of round
 * payloads consumed by the game-mode renderers. Kept separate from the
 * controller so we can unit-test round shape without booting the UI.
 */

import { getStage } from '../../data/curriculum.js';

// Small distractor banks keyed by stage prefix. Real production banks
// would live in a content file; this is enough for the cvc-a slice.
const SHORT_VOWEL_DISTRACTORS = ['a', 'e', 'i', 'o', 'u'];

function _take(arr, n, rng = Math.random) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function _vowelOf(stageId) {
  const m = /(?:cvc|ccvc|cvcc|ccvcc)-([aeiou])$/.exec(stageId ?? '');
  return m?.[1] ?? null;
}

/**
 * Build a Sound Match round for a CVC short-vowel stage.
 *
 * The prompt is the target vowel sound; choices are 4 short-vowel letters
 * including the correct one. Future stages will swap in digraph /
 * consonant distractors.
 */
export function buildSoundMatchRound(stageId, { wordIndex = 0, rng = Math.random } = {}) {
  const stage = getStage(stageId);
  if (!stage) return null;
  const vowel = _vowelOf(stageId);
  const word = stage.sampleWords?.[wordIndex] ?? stage.sampleWords?.[0] ?? '';
  if (!vowel) {
    // Fallback for non-vowel stages: use the first targetSound as the prompt.
    // The correct grapheme must always be one of the choices, so force it in
    // and fill the rest from the distractor pool (same shape as the vowel path).
    const grapheme = word[0] ?? '';
    const pool = ['a', 'e', 'i', 'o', 'u', 's', 't'].filter((c) => c !== grapheme);
    const choices = grapheme
      ? _take([grapheme, ..._take(pool, 3, rng)], 4, rng)
      : _take(pool, 4, rng);
    return {
      mode: 'soundMatch',
      prompt: { sound: stage.targetSounds?.[0] ?? '/?/', grapheme },
      choices,
      word,
    };
  }
  const distractors = SHORT_VOWEL_DISTRACTORS.filter((v) => v !== vowel);
  const chosenDistractors = _take(distractors, 3, rng);
  const choices = _take([vowel, ...chosenDistractors], 4, rng);
  const soundLabel = `/${vowel}/`;
  return {
    mode: 'soundMatch',
    prompt: { sound: soundLabel, grapheme: vowel },
    choices,
    word,
  };
}

/**
 * Build a Blend Builder round: given a sample word, the target graphemes
 * are the letters of the word (cvc-a stages are all 3-letter) and the bank
 * is the same letters plus 0–1 plausible distractor.
 */
export function buildBlendBuilderRound(
  stageId,
  { wordIndex = 0, rng = Math.random, addDistractor = true } = {},
) {
  const stage = getStage(stageId);
  if (!stage) return null;
  const word = stage.sampleWords?.[wordIndex] ?? stage.sampleWords?.[0] ?? '';
  const graphemes = [...word];

  const all = new Set(graphemes);
  const vowel = _vowelOf(stageId);
  const distractorPool = ['s', 't', 'm', 'p', 'n', 'b'].filter((c) => !all.has(c));
  const distractor =
    addDistractor && distractorPool.length ? _take(distractorPool, 1, rng)[0] : null;

  const bank = _take(
    distractor ? [...graphemes, distractor] : [...graphemes],
    graphemes.length + (distractor ? 1 : 0),
    rng,
  );

  return {
    mode: 'blendBuilder',
    target: { word, graphemes },
    bank,
    vowel,
  };
}

/**
 * Build the full Sound Match + Blend Builder lesson for a stage. Picks up
 * to `roundsPerMode` distinct words from `sampleWords`.
 */
export function buildLesson(stageId, { roundsPerMode = 3, rng = Math.random } = {}) {
  const stage = getStage(stageId);
  if (!stage) return null;
  // A stage with no sample words can't produce playable rounds — return
  // null so the caller can stay on the map instead of flashing the child
  // through a sequence of empty screens.
  if (!stage.sampleWords?.length) return null;
  const wordIndices = Array.from(
    { length: Math.min(roundsPerMode, stage.sampleWords.length) },
    (_, i) => i,
  );

  const soundMatch = wordIndices
    .map((i) => buildSoundMatchRound(stageId, { wordIndex: i, rng }))
    .filter(Boolean);
  const blendBuilder = wordIndices
    .map((i) => buildBlendBuilderRound(stageId, { wordIndex: i, rng }))
    .filter(Boolean);
  if (!soundMatch.length && !blendBuilder.length) return null;

  return { stageId, soundMatch, blendBuilder };
}
