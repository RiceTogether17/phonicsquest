/**
 * PhonicsQuest – Phonics slip diagnosis
 *
 * The phonics counterpart of `answerDiagnosis.js`: turns "wrong" into
 * "wrong *because*" for the tap-to-choose sound games.
 *
 * A child who taps /e/ for "bad" has told us something specific — they are
 * mixing short A and short E — and the reply should say so, not "Almost! Try
 * again." Every sound game already knows the word, which position it asked
 * about, the sound the child chose and the right one. That is enough to name
 * the slip without any per-item authoring:
 *
 *   sound-elsewhere   the chosen sound IS in the word, just in another place
 *                     ("/t/ is in cat — at the end")
 *   short-vowel       two short vowels mixed up (/a/ vs /e/)
 *   vowel-length      a long vowel heard as short, or the other way round
 *   voicing           a buzz/no-buzz pair (/b/ vs /p/, /d/ vs /t/ …)
 *   mouth-shape       any other consonant pair with a different mouth shape
 *   missing-sound     a blend word read with one sound left out (fag/flag)
 *
 * Each diagnosis carries two child-facing lines, mirroring the cue/reteach
 * split in the Primary English system (FEEDBACK_SYSTEM.md):
 *
 *   cue     shown after the FIRST wrong tap. Names what the child picked and
 *           points at the evidence (where the sound sits, what the mouth
 *           does) but never names the answer.
 *   reveal  shown when the answer is revealed. Names both sounds, and uses the
 *           stage's own mini-lesson "watch out" note when one covers this pair,
 *           so the game and the lesson say the same thing.
 *
 * Pure functions over word data — no DOM, no store, no audio.
 */

import { phonemeNotation } from '../data/words.js';
import { getMouthCue } from '../data/articulation.js';

/**
 * The mini-lesson scripts are a lazy chunk (miniLesson.js loads them on
 * demand) and must stay out of the main bundle, so the "watch out" notes are
 * fetched in the background. Until they arrive — in practice before the
 * child's first wrong tap — the reveal uses the built-in mouth contrast.
 *
 * @type {Record<string, { confusions?: string[] }>|null}
 */
let lessons = null;

/** Load the lesson notes; resolves once `lessonNoteFor` can use them. */
export function loadLessonNotes() {
  return import('../data/lessons/phonicsLessons.js')
    .then((m) => {
      lessons = m.PHONICS_LESSONS;
    })
    .catch(() => {
      /* offline before the chunk was cached: fall back to built-in lines */
    });
}

if (typeof window !== 'undefined') loadLessonNotes();

/**
 * Short vowels: the keyword picture every mini-lesson uses, and what the
 * mouth does. Kept in step with the cvc-* lessons in phonicsLessons.js.
 */
const SHORT_VOWELS = Object.freeze({
  a: { keyword: 'apple', mouth: 'your mouth opens wide' },
  e: { keyword: 'egg', mouth: 'your mouth makes a small smile' },
  i: { keyword: 'igloo', mouth: 'it is quick and tiny' },
  o: { keyword: 'octopus', mouth: 'your lips make a round circle' },
  u: { keyword: 'umbrella', mouth: 'your mouth stays relaxed' },
});

/** Pairs made in the same place, one with the voice on (buzz) and one off. */
const VOICED_PARTNER = Object.freeze({
  '/b/': '/p/',
  '/d/': '/t/',
  '/g/': '/k/',
  '/v/': '/f/',
  '/z/': '/s/',
  '/j/': '/ch/',
});
const VOICING_PAIRS = new Map(
  Object.entries(VOICED_PARTNER).flatMap(([voiced, quiet]) => [
    [voiced, { voiced, quiet }],
    [quiet, { voiced, quiet }],
  ]),
);

const VOWEL_TYPES = new Set(['sv', 'lv', 'rc', 'dp']);

/** @typedef {'first'|'middle'|'last'|'missing'} SoundPosition */

/**
 * @typedef {object} PhonicsDiagnosis
 * @property {string} id      slip kind (see file header)
 * @property {string} cue     first-wrong-tap coaching line; never names the answer
 * @property {string} reveal  answer-reveal line naming both sounds
 */

// ── Helpers ───────────────────────────────────────────────────────────────

/** "/k/" for a grapheme as the choice buttons print it. */
function notation(grapheme, type, wordText = '') {
  return phonemeNotation(grapheme, type, wordText).join('');
}

function isShortVowel(grapheme, type) {
  return type === 'sv' && Object.hasOwn(SHORT_VOWELS, String(grapheme).toLowerCase());
}

function sentenceCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The sound named the way a child hears it in a lesson: `/e/, like "egg"`. */
function soundWithKeyword(grapheme, type, label) {
  if (isShortVowel(grapheme, type)) {
    return `${label}, like "${SHORT_VOWELS[grapheme.toLowerCase()].keyword}"`;
  }
  return label;
}

const POSITION_NOUN = { first: 'first', middle: 'middle', last: 'last', missing: 'missing' };

/** `"bad" has /a/ in the middle`, `"cat" starts with /k/` … */
function whereClause(wordText, position, label) {
  switch (position) {
    case 'first':
      return `"${wordText}" starts with ${label}`;
    case 'last':
      return `"${wordText}" ends with ${label}`;
    case 'middle':
      return `"${wordText}" has ${label} in the middle`;
    default:
      return `"${wordText}" needs ${label}`;
  }
}

/** Where in the word a phoneme index sits, as a child would say it. */
function placeOf(index, length) {
  if (index === 0) return 'at the start';
  if (index === length - 1) return 'at the end';
  return 'in the middle';
}

/** Does a lesson note talk about this sound? Matches "/e/" or "short E". */
function mentionsSound(note, label) {
  const lower = note.toLowerCase();
  if (lower.includes(label.toLowerCase())) return true;
  const bare = label.replace(/\//g, '');
  return bare.length === 1 && lower.includes(`short ${bare}`);
}

/**
 * The mini-lesson "watch out" note that covers this exact pair, if any.
 * Looks at the word's own stage first, then the short-vowel lesson for the
 * target sound, so a cvc-a word and a ccvc-a word both find "/a/ opens your
 * mouth wide; /e/ uses a small smile."
 *
 * @param {object} word
 * @param {string} targetGrapheme
 * @param {string} targetLabel
 * @param {string} chosenLabel
 * @returns {string|null}
 */
export function lessonNoteFor(word, targetGrapheme, targetLabel, chosenLabel) {
  const stages = [word?.decodableStage, `cvc-${String(targetGrapheme).toLowerCase()}`];
  for (const stage of stages) {
    for (const note of lessons?.[stage]?.confusions ?? []) {
      if (mentionsSound(note, targetLabel) && mentionsSound(note, chosenLabel)) return note;
    }
  }
  return null;
}

// ── Sound-level diagnosis ─────────────────────────────────────────────────

/**
 * Work out why a child picked `chosen` when the answer was `target`.
 *
 * @param {object} args
 * @param {object} args.word                       the target word (words.js shape)
 * @param {SoundPosition} args.position            which sound the game asked for
 * @param {{grapheme: string, type: string}} args.target
 * @param {{grapheme: string, type: string}} args.chosen
 * @param {string} [args.lead]   override for the opening "You picked …" sentence
 * @param {string} [args.heard]  override for "You heard /e/" in the reveal
 * @returns {PhonicsDiagnosis|null}  null when nothing more useful than the
 *   game's own hint can be said
 */
export function diagnosePhonicsSlip({ word, position, target, chosen, lead, heard }) {
  if (!word || !target || !chosen) return null;
  const wordText = word.word ?? '';
  const t = notation(target.grapheme, target.type, wordText);
  const c = notation(chosen.grapheme, chosen.type);
  if (!t || !c || t === c) return null;

  const opener = lead ?? `You picked ${soundWithKeyword(chosen.grapheme, chosen.type, c)}.`;
  const noun = POSITION_NOUN[position] ?? 'missing';
  const answerAt = whereClause(wordText, position, t);
  const youHeard = heard ?? `You heard ${c}`;

  // 1. The sound is in the word — the child heard it, just not in the right
  //    place. Not for Missing Sound, where the rest of the word is on screen.
  if (position !== 'missing' && Array.isArray(word.phonemes)) {
    const at = word.phonemes.findIndex((p, i) => p === c && !_isAskedIndex(i, word, position));
    if (at >= 0) {
      const place = placeOf(at, word.phonemes.length);
      return {
        id: 'sound-elsewhere',
        cue: `${opener} Good ear: that sound IS in the word, but it is ${place}. Which sound is ${noun === 'first' ? 'FIRST' : noun === 'last' ? 'LAST' : 'in the MIDDLE'}?`,
        reveal: `${c} is ${place} of "${wordText}". ${sentenceCase(answerAt)}.`,
      };
    }
  }

  // 2. Two short vowels.
  if (isShortVowel(target.grapheme, target.type) && isShortVowel(chosen.grapheme, chosen.type)) {
    const tv = SHORT_VOWELS[target.grapheme.toLowerCase()];
    const cv = SHORT_VOWELS[chosen.grapheme.toLowerCase()];
    const note =
      lessonNoteFor(word, target.grapheme, t, c) ?? `For ${t}, ${tv.mouth}. For ${c}, ${cv.mouth}.`;
    return {
      id: 'short-vowel',
      cue: `${opener} Say the word slowly. Listen to the ${noun} sound: ${tv.mouth}.`,
      reveal: `${youHeard}, but ${answerAt}, like "${tv.keyword}". ${note}`,
    };
  }

  // 3. Long vs short vowel.
  const targetVowel = VOWEL_TYPES.has(target.type);
  const chosenVowel = VOWEL_TYPES.has(chosen.type);
  if (targetVowel && chosenVowel && (target.type === 'lv') !== (chosen.type === 'lv')) {
    const targetLong = target.type === 'lv';
    return {
      id: 'vowel-length',
      cue: targetLong
        ? `${opener} Listen again. The vowel in this word says its NAME.`
        : `${opener} Listen again. The vowel in this word is short and quick, like in "apple" or "egg".`,
      reveal: targetLong
        ? `${youHeard}, but ${answerAt}. That vowel says its name.`
        : `${youHeard}, but ${answerAt}. That vowel is a short sound, not its name.`,
    };
  }

  // 4. Buzz / no buzz.
  const pair = VOICING_PAIRS.get(t);
  if (pair && VOICING_PAIRS.get(c)?.voiced === pair.voiced) {
    return {
      id: 'voicing',
      cue: `${opener} Touch your throat and say the ${noun} sound. Does it buzz, or is it just air?`,
      reveal: `${youHeard}, but ${answerAt}. ${pair.voiced} and ${pair.quiet} use the same mouth shape, but ${pair.voiced} buzzes in your throat and ${pair.quiet} is just air.`,
    };
  }

  // 5. Any other consonant pair the mouth can tell apart.
  if (!targetVowel && !chosenVowel) {
    const tm = getMouthCue(t);
    const cm = getMouthCue(c);
    if (tm && cm && tm.shape !== cm.shape) {
      const how = tm.cue.charAt(0).toLowerCase() + tm.cue.slice(1);
      return {
        id: 'mouth-shape',
        cue: `${opener} Say the word slowly and feel your mouth. For the ${noun} sound: ${how}`,
        reveal: `${youHeard}, but ${answerAt}. To make ${t}: ${how}`,
      };
    }
  }

  // Same mouth, different sound (/m/ vs /b/), or two long vowels: there is no
  // reliable one-line cue, but naming the two sounds still beats "Almost!".
  return {
    id: 'sound-mixup',
    cue: `${opener} Listen to the word again, and say the ${noun} sound with it.`,
    reveal: `${youHeard}, but ${answerAt}. Listen to them one after the other.`,
  };
}

/** Is phoneme index `i` the one the game asked about? */
function _isAskedIndex(i, word, position) {
  const n = word.phonemes.length;
  if (position === 'first') return i === 0;
  if (position === 'last') return i === n - 1;
  // Middle: the asked vowel is any vowel phoneme between the ends. A
  // consonant in the middle of a blend word (fl-a-g's /l/) is still "in the
  // middle", so only skip vowels here.
  return i > 0 && i < n - 1 && _phonemeIsVowel(word, i);
}

function _phonemeIsVowel(word, phonemeIndex) {
  // Map the phoneme index back to its grapheme tile: blends add phonemes.
  let p = 0;
  for (let gi = 0; gi < (word.graphemes?.length ?? 0); gi++) {
    const type = word.types?.[gi];
    const count = type === 'se' ? 0 : phonemeNotation(word.graphemes[gi], type, word.word).length;
    if (phonemeIndex < p + count) return VOWEL_TYPES.has(type);
    p += count;
  }
  return false;
}

// ── Word-level diagnosis (Hear & Choose) ──────────────────────────────────

/**
 * Diagnose a wrong WORD choice by finding the sound where the two words
 * differ. "bed" for "bad" is a one-sound swap in the middle; "fag" for
 * "flag" is a blend with a sound left out.
 *
 * @param {object} target  the word that was said
 * @param {object} chosen  the word the child tapped
 * @returns {PhonicsDiagnosis|null}
 */
export function diagnoseWordSlip(target, chosen) {
  const tp = target?.phonemes;
  const cp = chosen?.phonemes;
  if (!Array.isArray(tp) || !Array.isArray(cp) || target.word === chosen.word) return null;
  const picked = `You picked "${chosen.word}".`;

  if (tp.length === cp.length) {
    const diffs = tp.map((p, i) => (p === cp[i] ? -1 : i)).filter((i) => i >= 0);
    if (diffs.length !== 1) return null;
    const i = diffs[0];
    const position = i === 0 ? 'first' : i === tp.length - 1 ? 'last' : 'middle';
    const slip = diagnosePhonicsSlip({
      word: target,
      position,
      target: _soundAt(target, i),
      chosen: _soundAt(chosen, i),
      lead: `You picked "${chosen.word}", which has ${cp[i]}.`,
      heard: `"${chosen.word}" has ${cp[i]}`,
    });
    if (!slip) return null;
    // Both words are on screen, so "that sound is in the word" can't apply;
    // only the sound-pair diagnoses make sense here.
    if (slip.id === 'sound-elsewhere') return null;
    return slip;
  }

  if (tp.length === cp.length + 1) {
    const i = tp.findIndex((p, k) => p !== cp[k]);
    const without = [...tp.slice(0, i), ...tp.slice(i + 1)];
    if (without.join('') !== cp.join('')) return null;
    return {
      id: 'missing-sound',
      cue: `${picked} Say the word slowly, one sound at a time. It has one more sound than that.`,
      reveal: `"${target.word}" has ${tp[i]} too: ${tp.map((p) => p.replace(/\//g, '')).join('-')}. Say every sound.`,
    };
  }
  return null;
}

/** The {grapheme, type} of a word's phoneme at index i (blends unpacked). */
function _soundAt(word, phonemeIndex) {
  let p = 0;
  for (let gi = 0; gi < word.graphemes.length; gi++) {
    const type = word.types[gi];
    const count = type === 'se' ? 0 : phonemeNotation(word.graphemes[gi], type, word.word).length;
    if (phonemeIndex < p + count) {
      if (type === 'bl') {
        const letter = word.phonemes[phonemeIndex].replace(/\//g, '');
        return { grapheme: letter, type: 'c' };
      }
      return { grapheme: word.graphemes[gi], type };
    }
    p += count;
  }
  return { grapheme: '', type: 'c' };
}
