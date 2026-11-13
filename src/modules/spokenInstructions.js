// @ts-check
/**
 * PhonicsQuest – Spoken game instructions
 *
 * Every phonics game prints a short instruction above the play area, but a
 * child who can't read yet never gets to know what that line says. This map
 * holds the line Giri says out loud when a game opens, and again whenever the
 * child taps "What do I do?".
 *
 * The spoken lines are written for listening, not copied from the screen:
 * short sentences, no symbols like "/m/" or "…", and always a clear action
 * ("tap the number", "tap the picture") so the child knows what to press.
 */

/** Games a child can play by listening alone — no letters to read. */
export const LISTENING_MODES = Object.freeze(
  new Set([
    'first',
    'last',
    'middle',
    'oralBlend',
    'soundCount',
    'oralSegment',
    'oddOneOut',
    'train',
    'wordCount',
    'syllable',
  ]),
);

/** @type {Readonly<Record<string, string>>} */
export const SPOKEN_INSTRUCTIONS = Object.freeze({
  blend: 'Tap Next Sound to hear each sound. Then put the sounds together and say the word.',
  classicBlend: 'Listen to each sound. Then put the sounds together and say the word.',
  oralBlend: 'Listen to the sounds. Then tap the picture of the word they make.',
  first: 'Listen to the word. What sound does it start with? Tap that sound.',
  last: 'Listen to the word. What sound does it end with? Tap that sound.',
  middle: 'Listen to the word. What sound is in the middle? Tap that sound.',
  soundCount: 'Listen to the word. How many sounds can you hear? Tap the number.',
  oralSegment: 'Listen to the word. Say it slowly, and tap once for every sound.',
  train: 'Listen to the sound. Tap every word that starts with that sound.',
  oddOneOut:
    'Listen to the words. Three of them start with the same sound. Tap the one that is different.',
  wordCount: 'Listen to the sentence. How many words can you hear? Tap the number.',
  syllable: 'Listen to the word. Clap for each beat. Then tap how many beats.',
  soundHunt: 'Listen to the sound. Tap the letter that makes it.',
  hear: 'Listen to the word. Then tap the word you heard.',
  missing: 'One sound is missing from the word. Listen, then tap the missing sound.',
  segment: 'Break the word into its sounds. Tap the letters that go together for each sound.',
  wordSort: 'Hear each word. Then tap the box that has the same sound.',
  readAndTap: 'Read the sentence. Then tap the word you hear.',
  fluencySprint: 'Listen to the word, then tap it. Go smooth and steady.',
  listenAndSpell: 'Listen to the word. Then tap the letters to spell it.',
});

/**
 * The line to say for a game. Falls back to the printed instruction, with
 * symbols stripped, for any game without a written spoken line.
 *
 * @param {string} mode
 * @param {string} [shownText]  the instruction currently on screen
 * @returns {string}
 */
export function spokenInstructionFor(mode, shownText = '') {
  if (Object.prototype.hasOwnProperty.call(SPOKEN_INSTRUCTIONS, mode)) {
    return SPOKEN_INSTRUCTIONS[mode];
  }
  return shownText
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '')
    .replace(/[/…—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
