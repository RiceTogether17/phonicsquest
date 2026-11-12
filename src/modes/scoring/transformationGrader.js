/**
 * PhonicsQuest — marking for Synthesis & Transformation answers.
 *
 * A transformation item tests one piece of sentence structure: "No sooner
 * had ... THAN ...", "Not only IS the complex ...", "exclaimed THAT IT WAS
 * ...". Marking these by meaning units alone ("sat down" + "teacher started")
 * gave full marks to an answer that carried the right content inside the very
 * mistake the item exists to catch — "No sooner had the children sat down
 * WHEN the teacher started the test" scored 1.0.
 *
 * So meaning units are no longer enough for full marks. The answer's
 * structure must also match the structure of a correct answer.
 *
 * "Structure" here is the sentence with every content word blanked out: the
 * structural words (than, that, whether, had, was, not, by, to ...) stay, in
 * order, and each run of other words collapses to one gap. Two sentences with
 * the same shape say the same kind of thing in the same construction, however
 * the nouns and adjectives differ:
 *
 *   No sooner had the children sat down than the teacher started the test.
 *   → no sooner had • than •
 *   No sooner had the children sat down when the teacher started the test.
 *   → no sooner had • when •          (different shape: not full marks)
 *
 * Gaps are what make word ORDER visible. "Not only is the complex affordable"
 * and "Not only the complex is affordable" use the same structural words; it
 * is the gap between "only" and "is" that tells them apart.
 *
 * The correct shapes come from the model answer, the authored alternates, and
 * the synonyms an item lists in its `requiredGroups` — if a group offers
 * "whether" and "if", both shapes are correct.
 */

import { gradeShortAnswer } from './shortAnswerGrader.js';

/**
 * Words that carry sentence structure. Everything else — nouns, main verbs,
 * adjectives, adverbs, articles, most prepositions — is content, and a child
 * may vary it without changing the construction.
 */
const STRUCTURE_WORDS = new Set([
  // connectors and clause markers
  'than',
  'when',
  'that',
  'what',
  'whether',
  'if',
  'unless',
  'until',
  'but',
  'also',
  'and',
  'although',
  'though',
  'despite',
  'spite',
  'because',
  'so',
  'such',
  'as',
  'too',
  'enough',
  'only',
  'sooner',
  'hardly',
  'barely',
  'scarcely',
  'seldom',
  'rarely',
  'before',
  'after',
  'provided',
  'while',
  'whereas',
  'since',
  'however',
  'yet',
  // relatives
  'who',
  'whom',
  'whose',
  'which',
  'where',
  // negation
  'not',
  'no',
  'never',
  'neither',
  'nor',
  // auxiliaries and modals
  'had',
  'has',
  'have',
  'having',
  'was',
  'were',
  'is',
  'are',
  'am',
  'be',
  'been',
  'being',
  'do',
  'does',
  'did',
  'will',
  'would',
  'shall',
  'should',
  'can',
  'could',
  'may',
  'might',
  'must',
  'get',
  'got',
  // structural prepositions and the dummy subject
  'to',
  'by',
  'for',
  'it',
  'there',
]);

const CONTRACTIONS = [
  [/\bwon't\b/g, 'will not'],
  [/\bcan't\b/g, 'can not'],
  [/\bcannot\b/g, 'can not'],
  [/\bshan't\b/g, 'shall not'],
  [/n't\b/g, ' not'],
];

function _words(text) {
  let s = String(text ?? '')
    .toLowerCase()
    .replace(/[‘’]/g, "'");
  for (const [re, to] of CONTRACTIONS) s = s.replace(re, to);
  return s
    .replace(/[^a-z0-9'\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

/**
 * The structural shape of a sentence: structural words in order, with each
 * run of content words collapsed to a single gap.
 *
 * @param {string} text
 * @returns {string}
 */
export function sentenceShape(text) {
  const out = [];
  for (const w of _words(text)) {
    if (STRUCTURE_WORDS.has(w)) out.push(w);
    else if (out[out.length - 1] !== '•') out.push('•');
  }
  return out.join(' ');
}

function _cleanStem(stem) {
  return String(stem ?? '')
    .replace(/_+/g, ' ')
    .replace(/[…]|\.{3}/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function _startsWithStem(text, stem) {
  const t = _words(text).join(' ');
  const s = _words(stem).join(' ');
  return !!s && (t === s || t.startsWith(`${s} `));
}

/** Join a stem and a continuation into the whole sentence. */
function _whole(stem, text) {
  if (!stem || _startsWithStem(text, stem)) return String(text ?? '');
  return `${stem} ${text}`;
}

/**
 * Every correct whole sentence the item's data describes: the model answer,
 * the alternates, and each of those with a listed synonym swapped in.
 */
function _correctSentences({ stem, answer, alternates = [], requiredGroups = null }) {
  const bases = [answer, ...alternates].filter(Boolean).map((a) => _whole(stem, a));
  const out = new Set(bases);
  if (!Array.isArray(requiredGroups)) return [...out];

  for (const base of bases) {
    let variants = [base];
    for (const group of requiredGroups) {
      const members = (group || []).filter(Boolean);
      const lower = base.toLowerCase();
      const used = members.find((m) => lower.includes(m.toLowerCase()));
      if (!used) continue;
      const next = [];
      for (const v of variants) {
        const at = v.toLowerCase().indexOf(used.toLowerCase());
        if (at < 0) {
          next.push(v);
          continue;
        }
        for (const m of members) next.push(v.slice(0, at) + m + v.slice(at + used.length));
      }
      // Two or three groups of a few synonyms each stays small; the cap only
      // guards against an item authored with very long synonym lists.
      variants = next.slice(0, 200);
    }
    for (const v of variants) out.add(v);
  }
  return [...out];
}

/**
 * Does the answer use the construction of a correct answer?
 *
 * A child may type the whole sentence or only the part after the given
 * beginning, so both readings are tried.
 *
 * @param {string} typed
 * @param {{stem?: string, answer: string, alternates?: string[],
 *          requiredGroups?: string[][]|null}} item
 * @returns {boolean}
 */
export function hasCorrectStructure(typed, item) {
  const stem = _cleanStem(item.stem);
  const shapes = new Set(_correctSentences({ ...item, stem }).map(sentenceShape));
  if (shapes.has(sentenceShape(typed))) return true;
  return !!stem && shapes.has(sentenceShape(`${stem} ${typed}`));
}

/**
 * Grade a transformation answer.
 *
 * Full marks need an exact match with a correct answer, or every meaning unit
 * AND the right construction. Right content in the wrong construction earns at
 * most half, which is how the two halves of a transformation mark are split.
 *
 * @param {string} typed
 * @param {{stem?: string, answer: string, alternates?: string[],
 *          accepts?: string[], requiredGroups?: string[][]|null}} item
 * @returns {{fraction: number, needsReview: boolean,
 *            trace: {reason: string, hits: string[], misses: string[]}}}
 */
export function gradeTransformation(typed, item) {
  const stem = _cleanStem(item.stem);
  const alternates = item.alternates || [];
  const requiredGroups =
    Array.isArray(item.requiredGroups) && item.requiredGroups.length ? item.requiredGroups : null;

  // Accept the whole sentence or the continuation alone, whichever way the
  // answer key happens to be written.
  const accepts = new Set(item.accepts || []);
  for (const a of [item.answer, ...alternates].filter(Boolean)) {
    accepts.add(a);
    if (stem) {
      accepts.add(_whole(stem, a));
      if (_startsWithStem(a, stem)) {
        const rest = a
          .trim()
          .slice(stem.length)
          .replace(/^[\s,]+/, '')
          .trim();
        if (rest) accepts.add(rest);
      }
    }
  }

  const result = gradeShortAnswer(typed, {
    expected: item.answer || '',
    accepts: [...accepts],
    requiredGroups,
  });

  if (result.trace.reason !== 'required-groups' || result.fraction <= 0.5) return result;
  if (hasCorrectStructure(typed, { ...item, stem, alternates, requiredGroups })) return result;

  return {
    fraction: 0.5,
    needsReview: false,
    trace: {
      reason: 'structure-mismatch',
      hits: result.trace.hits,
      misses: ['sentence structure'],
    },
  };
}
