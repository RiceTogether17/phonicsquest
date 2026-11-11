/**
 * PhonicsQuest – reading a lesson line aloud with real sounds
 *
 * Lesson lines write sounds two ways: sounding-out runs ("c… a… t — cat!")
 * and slash notation ("/ā/"). Handed to the device voice as plain text, both
 * come out as letter NAMES: "see, ay, tee, cat", the opposite of the lesson.
 *
 * `narrationParts` splits a line into voice text and recorded sounds, in the
 * shape audio.speakWithSounds plays: strings go to the voice, and
 * `{ sounds: [...] }` plays recordings. A run that ends "— word" takes each
 * sound from that word's own tiles, so "c… ā… k — cake" plays the long a of
 * "cake" and "r… u… n + ing — running" plays the -ing ending's real sounds.
 */

import { WORDS } from '../data/words.js';
import { tileSoundKeys, hasPhonemeRecording, phonemeAudioKey } from './audio.js';

/** How slash notation in lesson text maps to recordings. */
const NOTATION_SOUNDS = Object.freeze({
  ā: ['long_a'],
  ē: ['long_e'],
  ī: ['long_i'],
  ō: ['long_o'],
  ū: ['long_u'],
  yoo: ['long_u'],
  oo: ['long_oo'],
  oy: ['oi'],
  nk: ['ng', 'k'],
  id: ['i', 'd'],
  shun: ['sh', 'ə', 'n'],
});

const PLAIN = { ā: 'a', ē: 'e', ī: 'i', ō: 'o', ū: 'u' };
const plain = (s) => s.toLowerCase().replace(/[āēīōū]/g, (c) => PLAIN[c]);

/**
 * Sounds for one written sound with no word to go on, or null. `chips` are
 * the lesson's sound buttons, which say what a sounding-out spelling means
 * today ("a…" is long a in a long-a lesson); slash notation names its sound
 * exactly, so it passes none ("/g/" is always the hard g).
 */
function soundsFor(token, chips = []) {
  const t = token.toLowerCase();
  if (NOTATION_SOUNDS[t]) return [...NOTATION_SOUNDS[t]];
  const chip = chips.find((c) => String(c.g).toLowerCase() === t);
  if (chip) {
    const keys = tileSoundKeys(chip.g, chip.type);
    if (keys?.length) return keys;
  }
  if (hasPhonemeRecording(t)) return [t];
  // A consonant run ("sw", "lt") is each letter's sound in turn.
  const letters = [...plain(t)];
  if (letters.length && letters.every((ch) => hasPhonemeRecording(ch))) return letters;
  return null;
}

/** The word's tiles as one-sound units: blends split, silent letters kept. */
function wordUnits(word) {
  const units = [];
  word.graphemes.forEach((g, i) => {
    const type = word.types[i];
    const keys = tileSoundKeys(g, type, {
      word: word.word,
      index: i,
      prevGrapheme: i > 0 ? word.graphemes[i - 1] : null,
    });
    if (type === 'bl' && keys) {
      // Each part of a blend is its own sound, and lessons sound them out
      // separately ("f… l… a… g").
      keys.forEach((k, j) => units.push({ text: k, keys: [k], blendPart: j }));
      return;
    }
    units.push({ text: g.replace(/^-/, '').toLowerCase(), keys });
  });
  return units;
}

/**
 * Match each written token to the word's units in order. Returns one list of
 * sounds per token, or null when the tokens don't spell the word's start.
 */
function matchTokens(tokens, word) {
  const units = wordUnits(word);
  const out = [];
  let at = 0;
  for (const raw of tokens) {
    const token = plain(raw);
    let matched = null;
    for (let n = 1; n <= 4 && at + n <= units.length; n++) {
      const run = units.slice(at, at + n);
      const text = run.map((u) => u.text).join('');
      // "n" in "r… u… n + ing" is the "nn" tile of "running".
      const doubled = n === 1 && text.length === 2 && text[0] === text[1] && text[0] === token;
      if (text === token || doubled) {
        if (run.some((u) => !u.keys)) return null;
        matched = { n, keys: run.flatMap((u) => u.keys) };
        break;
      }
    }
    if (!matched) return null;
    at += matched.n;
    out.push(matched.keys);
  }
  return out;
}

const SOUND_TOKEN = '[A-Za-zāēīōū]+';
// A sounding-out run: tokens joined by "…" or " + ", optionally ending in
// "— word". Either at least one "…" or a closing "— word" is required, so
// "a + r says /ar/" (naming letters) stays text.
const RUN = new RegExp(
  `(${SOUND_TOKEN}(?:\\s*(?:…|\\+)\\s*${SOUND_TOKEN})*\\s*…?)(\\s*—\\s*([A-Za-z]+))?`,
  'g',
);
const NOTATION = /\/([^/\s]{1,6})\//g;

const isBankWord = (text) => WORDS.some((w) => w.word.toLowerCase() === text.toLowerCase());

/**
 * Parts for one run of tokens, using the word when there is one. In a
 * "+" run with no "…" ("jump + ing — jumping"), a token that is a whole
 * word is said as a word: the lesson is joining chunks, not sounding out.
 */
function runParts(tokens, wordText, chips, chunked) {
  const word = wordText ? WORDS.find((w) => w.word.toLowerCase() === wordText.toLowerCase()) : null;
  let sounds = word ? matchTokens(tokens, word) : null;
  if (!sounds) {
    sounds = tokens.map((t) => soundsFor(t, chips));
    if (!sounds.every(Boolean)) return null;
  }
  return sounds.map((s, i) =>
    chunked && tokens[i].length > 2 && isBankWord(tokens[i]) ? tokens[i] : { sounds: s },
  );
}

/**
 * Split a lesson line into voice text and recorded sounds.
 *
 * @param {string} line
 * @param {{soundChips?: {g: string, type: string}[]}} [lesson]
 * @returns {Array<string|{sounds: string[]}>}
 */
export function narrationParts(line, lesson = {}) {
  const chips = lesson.soundChips || [];
  const parts = [];
  const pushText = (text) => {
    // Arrows are read as "right arrow"; a pause says the same thing.
    const t = text.replace(/→/g, ',').replace(/["“”]/g, '');
    if (/[A-Za-z0-9]/.test(t)) parts.push(t.trim());
  };

  // Slash notation first: it never overlaps a run.
  const pieces = [];
  let last = 0;
  for (const m of line.matchAll(NOTATION)) {
    const sounds = soundsFor(m[1]);
    if (!sounds) continue;
    pieces.push(line.slice(last, m.index), { sounds });
    last = m.index + m[0].length;
  }
  pieces.push(line.slice(last));

  for (const piece of pieces) {
    if (typeof piece !== 'string') {
      parts.push(piece);
      continue;
    }
    let at = 0;
    for (const m of piece.matchAll(RUN)) {
      const [whole, runText, ending, wordText] = m;
      const hasEllipsis = runText.includes('…');
      const tokens = runText
        .split(/\s*(?:…|\+)\s*/)
        .map((t) => t.trim())
        .filter(Boolean);
      if ((!hasEllipsis && !wordText) || tokens.length < (hasEllipsis ? 1 : 2)) continue;
      const run = runParts(tokens, wordText, chips, !hasEllipsis);
      if (!run) continue;
      pushText(piece.slice(at, m.index));
      run.forEach((part) => (typeof part === 'string' ? pushText(part) : parts.push(part)));
      if (ending) pushText(ending.replace('—', ''));
      at = m.index + whole.length;
    }
    pushText(piece.slice(at));
  }
  return parts;
}

export const __TEST__ = { soundsFor, matchTokens, phonemeAudioKey };
