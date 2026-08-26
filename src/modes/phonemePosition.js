/**
 * Where the first and last PHONEME of a word actually live.
 *
 * The word bank stores a consonant blend as a single grapheme tile —
 * "clamp" is cl|a|mp — because that is how the word is spelled and how the
 * tiles are drawn. But a blend is two phonemes you can hear separately;
 * that is exactly what makes it a blend rather than a digraph. "sh" is one
 * sound, "cl" is two.
 *
 * First Sound, Last Sound and Odd One Out all ask about ONE phoneme, so
 * they have to look inside the tile. The first sound of "clamp" is /k/, not
 * /kl/; the last is /p/, not /mp/. Reading the tile whole made the answer
 * to "what is the LAST sound?" a two-sound chunk sitting among single-sound
 * distractors, and made Odd One Out able to build a round where clap, clip
 * and clop are the matches and "crab" is the odd one — all four of which
 * start with /k/.
 *
 * The containing tile index is returned alongside, because the reveal still
 * rings the whole tile: the child should see WHERE in the word the sound
 * sits, and "mp" is genuinely the chunk that carries it.
 */

/**
 * Blends whose FIRST letter is not the first sound. Both are single words
 * in the bank, but a wrong answer key is a wrong answer key.
 *   know  — the k is silent, the word starts /n/
 *   shred — "shr" is the sh digraph plus /r/, so it starts /ʃ/
 */
const INITIAL_BLEND_ONSETS = {
  kn: 'n',
  shr: 'sh',
};

/**
 * @typedef {object} PositionedPhoneme
 * @property {string} grapheme  the phoneme's own spelling ('p', not 'mp')
 * @property {string} type      phoneme type, for audio + tile rendering
 * @property {number} index     index of the TILE that contains it
 */

/**
 * Index of the last grapheme that actually MAKES a sound.
 *
 * A magic-e word is stored as c|a|k|e with types c,lv,c,se, so the last
 * *grapheme* is a silent e. Targeting it made Last Sound unanswerable:
 * speakPhoneme returns early for type 'se', so the correct choice played
 * nothing while every distractor played a real sound.
 *
 * @param {import('../data/words.js').Word} word
 * @returns {number}
 */
export function lastSoundedIdx(word) {
  const types = word?.types ?? [];
  for (let i = types.length - 1; i >= 0; i--) {
    if (types[i] !== 'se') return i;
  }
  // All-silent is not a real word shape; fall back to the final grapheme
  // rather than returning -1 and indexing off the end.
  return Math.max(0, types.length - 1);
}

/**
 * The word's first phoneme.
 * @param {import('../data/words.js').Word} word
 * @returns {PositionedPhoneme}
 */
export function firstPhoneme(word) {
  const grapheme = word?.graphemes?.[0] ?? '';
  const type     = word?.types?.[0] ?? 'c';
  if (type !== 'bl') return { grapheme, type, index: 0 };

  const onset = INITIAL_BLEND_ONSETS[grapheme.toLowerCase()] ?? grapheme[0];
  return { grapheme: onset, type: 'c', index: 0 };
}

/**
 * The word's last phoneme, skipping any silent tail.
 * @param {import('../data/words.js').Word} word
 * @returns {PositionedPhoneme}
 */
export function lastPhoneme(word) {
  const index    = lastSoundedIdx(word);
  const grapheme = word?.graphemes?.[index] ?? '';
  const type     = word?.types?.[index] ?? 'c';
  if (type !== 'bl') return { grapheme, type, index };

  // Every final blend in the bank ends in a plain consonant letter that is
  // its own last sound — st→/t/, nd→/d/, mp→/p/, nk→/k/, ps→/s/ — so the
  // last letter needs no override table the way initial blends do.
  return { grapheme: grapheme[grapheme.length - 1], type: 'c', index };
}
