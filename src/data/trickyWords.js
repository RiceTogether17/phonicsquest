/**
 * Tricky High-Frequency Words — per-phase introduction schedule
 * (architecture review item #4)
 *
 * The existing HFW_TIERS in hfw.js is *story-band* gating: which sight words
 * are allowed in which decodable-story tier. That's a different question
 * from this file. This module answers: "for a child currently working on
 * curriculum phase N, which 3–5 tricky high-frequency words should they
 * be learning *alongside* the phonics work this phase?"
 *
 * Why per-phase, not "all at the end" (where the old phase-10
 * `sight-highfreq` stage placed them): early decodable sentences need
 * words like `the`, `a`, `I`, `to`, `was`, `said`, `you`, `my`. Holding
 * them all back until phase 10 means the child can't read a single real
 * sentence for the first nine phases.
 *
 * Three categories (architecture review):
 *
 *   - 'decodable-soon'   The word IS phonetically regular but the rule
 *                        hasn't been taught yet (e.g. `my`, `for`). Once
 *                        the relevant phase lands, decode normally.
 *   - 'partial'          Most of the word follows the rules; 1–2 graphemes
 *                        are irregular. Teach the regular parts via
 *                        normal decoding, map only the tricky bit.
 *   - 'fully-irregular'  Most/all of the word breaks the rules. Teach as
 *                        a whole-word mapping with the tricky parts
 *                        highlighted; explain WHY they're odd.
 *
 * Each entry's `regular` + `tricky` arrays should together cover every
 * grapheme of the word so the UI can render a highlighted overlay
 * (regular parts plain, tricky parts in colour).
 */

/**
 * @typedef {Object} TrickyWord
 * @property {string}   word               the word itself, lowercase
 * @property {number}   phase              curriculum phase to introduce (1–8)
 * @property {string[]} regular            grapheme units that decode normally
 * @property {string[]} tricky             grapheme units that are irregular
 * @property {'decodable-soon'|'partial'|'fully-irregular'} category
 * @property {string}   note               teacher-facing hint (the WHY)
 * @property {number=}  decodableInPhase   if 'decodable-soon', the phase
 *                                         when the rule lands
 */

/** @type {TrickyWord[]} */
export const TRICKY_WORDS = [
  // ── Phase 1 (CVC) — the bootstrapping set ────────────────────────────
  // Without these, no decodable sentence can be written. Children read
  // them as wholes early and learn the underlying rules later.
  { word: 'the',  phase: 1, regular: ['th'],       tricky: ['e'],         category: 'partial',         note: '"e" makes /ə/ schwa, not short /ĕ/' },
  { word: 'a',    phase: 1, regular: [],           tricky: ['a'],         category: 'partial',         note: 'one-letter /ə/ schwa when unstressed' },
  { word: 'I',    phase: 1, regular: [],           tricky: ['I'],         category: 'partial',         note: 'always capital, always /ī/' },
  { word: 'to',   phase: 1, regular: ['t'],        tricky: ['o'],         category: 'partial',         note: '"o" makes /oo/ (long u sound)' },
  { word: 'was',  phase: 1, regular: ['w'],        tricky: ['a','s'],     category: 'fully-irregular', note: '"a" makes /ŏ/ and "s" makes /z/' },
  { word: 'said', phase: 1, regular: ['s','d'],    tricky: ['ai'],        category: 'fully-irregular', note: '"ai" makes /ĕ/ instead of /ā/' },
  { word: 'you',  phase: 1, regular: [],           tricky: ['y','ou'],    category: 'fully-irregular', note: '"y" /y/ and "ou" /oo/' },
  { word: 'my',   phase: 1, regular: ['m'],        tricky: ['y'],         category: 'decodable-soon',  note: 'final-y as /ī/ — taught in Long I · y', decodableInPhase: 6 },

  // ── Phase 2 (CCVC initial blends) ────────────────────────────────────
  { word: 'have', phase: 2, regular: ['h','v'],    tricky: ['a','e'],     category: 'partial',         note: 'looks like a_e but says /hăv/' },
  { word: 'from', phase: 2, regular: ['fr','m'],   tricky: ['o'],         category: 'partial',         note: '"o" sounds more like /ŭ/' },
  { word: 'of',   phase: 2, regular: [],           tricky: ['o','f'],     category: 'fully-irregular', note: '"o" /ŭ/ and "f" /v/ — totally odd' },
  { word: 'for',  phase: 2, regular: ['f'],        tricky: ['or'],        category: 'decodable-soon',  note: '"or" is r-controlled — taught in phase 8',  decodableInPhase: 8 },
  { word: 'by',   phase: 2, regular: ['b'],        tricky: ['y'],         category: 'decodable-soon',  note: 'final-y as /ī/, same pattern as "my"', decodableInPhase: 6 },
  { word: 'too',  phase: 2, regular: ['t'],        tricky: ['oo'],        category: 'decodable-soon',  note: '"oo" makes /oo/ — taught in Long U · oo', decodableInPhase: 6 },

  // ── Phase 3 (CVCC final blends) ──────────────────────────────────────
  { word: 'are',  phase: 3, regular: [],           tricky: ['are'],       category: 'partial',         note: 'whole word /ar/ — silent "e"' },
  { word: 'out',  phase: 3, regular: ['t'],        tricky: ['ou'],        category: 'decodable-soon',  note: '"ou" is a diphthong — taught in phase 7', decodableInPhase: 7 },
  { word: 'were', phase: 3, regular: ['w'],        tricky: ['ere'],       category: 'partial',         note: '"ere" makes /er/' },
  { word: 'do',   phase: 3, regular: ['d'],        tricky: ['o'],         category: 'partial',         note: '"o" /oo/' },

  // ── Phase 4 (digraphs) ───────────────────────────────────────────────
  { word: 'they', phase: 4, regular: ['th'],       tricky: ['ey'],        category: 'partial',         note: '"ey" makes /ā/' },
  { word: 'what', phase: 4, regular: ['wh','t'],   tricky: ['a'],         category: 'partial',         note: '"a" makes /ŏ/ (after "wh")' },
  { word: 'where',phase: 4, regular: ['wh'],       tricky: ['ere'],       category: 'partial',         note: '"ere" /er/, same as in "were"' },

  // ── Phase 5 (CCVCC) ──────────────────────────────────────────────────
  // These become FULLY decodable by phase 5 — reinforce that the patterns
  // they learned earlier really work.
  { word: 'when', phase: 5, regular: ['wh','e','n'], tricky: [],          category: 'decodable-soon',  note: 'now fully decodable — celebrate!', decodableInPhase: 5 },
  { word: 'with', phase: 5, regular: ['w','i','th'], tricky: [],          category: 'decodable-soon',  note: 'now fully decodable — celebrate!', decodableInPhase: 5 },
  { word: 'why',  phase: 5, regular: ['wh'],         tricky: ['y'],       category: 'decodable-soon',  note: 'final-y as /ī/ — formally taught in phase 6', decodableInPhase: 6 },

  // ── Phase 6 (long vowels) ────────────────────────────────────────────
  { word: 'some', phase: 6, regular: ['s','m'],    tricky: ['o','e'],     category: 'partial',         note: 'looks like o_e but says /sŭm/' },
  { word: 'come', phase: 6, regular: ['c','m'],    tricky: ['o','e'],     category: 'partial',         note: 'looks like o_e but says /kŭm/' },
  { word: 'one',  phase: 6, regular: [],           tricky: ['one'],       category: 'fully-irregular', note: 'whole word /wŭn/ — totally irregular' },

  // ── Phase 7 (diphthongs) ─────────────────────────────────────────────
  { word: 'could',  phase: 7, regular: ['c','d'],    tricky: ['oul'],     category: 'partial',         note: '"oul" makes /ʊ/ (short oo)' },
  { word: 'would',  phase: 7, regular: ['w','d'],    tricky: ['oul'],     category: 'partial',         note: '"oul" makes /ʊ/' },
  { word: 'should', phase: 7, regular: ['sh','d'],   tricky: ['oul'],     category: 'partial',         note: '"oul" makes /ʊ/ — pattern shared with could/would' },

  // ── Phase 8 (advanced) ───────────────────────────────────────────────
  { word: 'friend', phase: 8, regular: ['fr','n','d'], tricky: ['ie'],    category: 'fully-irregular', note: '"ie" makes /ĕ/, "i" is silent' },
  { word: 'people', phase: 8, regular: ['p','p','l'],  tricky: ['eo','e'],category: 'fully-irregular', note: '"eo" /ē/, final "e" silent' },
  { word: 'because',phase: 8, regular: ['b'],          tricky: ['e','cau','se'], category: 'partial',  note: 'tricky middle /kŏz/ — exceptional /au/' },
];

const _BY_WORD  = new Map(TRICKY_WORDS.map(t => [t.word.toLowerCase(), t]));
const _BY_PHASE = new Map();
for (const t of TRICKY_WORDS) {
  if (!_BY_PHASE.has(t.phase)) _BY_PHASE.set(t.phase, []);
  _BY_PHASE.get(t.phase).push(t);
}

/**
 * Tricky words the learner should be working on alongside their phonics
 * for this curriculum phase. Returns 0–8 entries (phases 1 and 5 have the
 * most; later phases taper off as more words become fully decodable).
 * @param {number} phase
 * @returns {TrickyWord[]}
 */
export function getTrickyWordsForPhase(phase) {
  return _BY_PHASE.get(phase) ? [..._BY_PHASE.get(phase)] : [];
}

/**
 * All tricky words introduced in phases 1..phase (cumulative). Useful for
 * the dashboard view "tricky words known so far".
 * @param {number} phase
 * @returns {TrickyWord[]}
 */
export function getTrickyWordsUpToPhase(phase) {
  const out = [];
  for (let p = 1; p <= phase; p++) out.push(...getTrickyWordsForPhase(p));
  return out;
}

/**
 * Lookup metadata for a single tricky word.
 * @param {string} word
 * @returns {TrickyWord|null}
 */
export function getTrickyWord(word) {
  if (typeof word !== 'string') return null;
  return _BY_WORD.get(word.toLowerCase()) ?? null;
}

/**
 * `true` if this word is in the tricky list (i.e. needs mapping
 * instruction rather than pure phonics decoding at the current stage).
 * @param {string} word
 * @returns {boolean}
 */
export function isTrickyWord(word) {
  return getTrickyWord(word) !== null;
}

/**
 * Reconstruct the word from regular + tricky parts, in the order they
 * appear. Used by the UI to render a highlighted overlay. Returns an
 * ordered array of `{ text, isTricky }` segments.
 *
 *   highlightTrickyParts('said') →
 *     [ { text: 's',  isTricky: false },
 *       { text: 'ai', isTricky: true  },
 *       { text: 'd',  isTricky: false } ]
 *
 * @param {string} word
 * @returns {Array<{text: string, isTricky: boolean}>|null}
 */
export function highlightTrickyParts(word) {
  const t = getTrickyWord(word);
  if (!t) return null;
  const segments = [];
  let i = 0;
  const lower = t.word.toLowerCase();
  while (i < lower.length) {
    // Try to match a regular or tricky chunk that starts at i.
    let matched = null;
    let isTricky = false;
    for (const chunk of t.tricky) {
      if (lower.startsWith(chunk.toLowerCase(), i)) {
        if (!matched || chunk.length > matched.length) { matched = chunk; isTricky = true; }
      }
    }
    for (const chunk of t.regular) {
      if (lower.startsWith(chunk.toLowerCase(), i)) {
        if (!matched || chunk.length > matched.length) { matched = chunk; isTricky = false; }
      }
    }
    if (!matched) {
      // No declared chunk at this position — emit a single character as
      // tricky so the UI never silently drops letters.
      matched = lower[i];
      isTricky = true;
    }
    segments.push({ text: matched, isTricky });
    i += matched.length;
  }
  return segments;
}
