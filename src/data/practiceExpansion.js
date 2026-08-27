/** Shared, deterministic expansion helpers for large practice banks. */

export const MIN_QUESTIONS_PER_SCOPE = 101;

// Used for cloze passage leads and titles ("Mei's recount"), where a name is
// part of the material, and by varyMcqNames for names already inside a
// sentence. MCQ stems are no longer wrapped in a name — see
// contextualizeMcqQuestion.
const NAMES = [
  'Mei', 'Ravi', 'Siti', 'Ben', 'Zara', 'Ahmad', 'Priya', 'Kai', 'Jia', 'Wei',
  'Ali', 'Nurul', 'Devi', 'Sam', 'Hana', 'Farid', 'Lena', 'Arjun', 'Ying',
  'Omar', 'Tara', 'Ethan', 'Aisha',
];

const TEXT_TYPES = ['story', 'recount', 'diary entry', 'report', 'news article'];

const DAYS = [
  'Monday morning', 'Monday afternoon', 'Tuesday morning', 'Tuesday afternoon',
  'Wednesday morning', 'Wednesday afternoon', 'Thursday morning',
  'Thursday afternoon', 'Friday morning', 'Friday afternoon', 'Saturday morning',
];

const SETTINGS = [
  'recess', 'the art lesson', 'the science lesson', 'silent reading',
  'the library visit', 'PE', 'music class', 'assembly', 'the spelling test',
  'group work',
];

export function expansionContext(index) {
  const day = DAYS[index % DAYS.length];
  const setting = SETTINGS[Math.floor(index / DAYS.length) % SETTINGS.length];
  return `on ${day} during ${setting}`;
}

const GIRL_NAMES = ['Mei', 'Siti', 'Priya', 'Jia', 'Zara', 'Aisha', 'Nurul', 'Devi', 'Hana', 'Lena', 'Ying', 'Tara', 'Sarah'];
const BOY_NAMES = ['Ravi', 'Ben', 'Ahmad', 'Ali', 'Farid', 'Arjun', 'Omar', 'Ethan', 'Daniel', 'Tom', 'Kai', 'Wei', 'Sam'];
const ALL_SWAP_NAMES = [...GIRL_NAMES, ...BOY_NAMES];
// Kai, Wei and Sam read as either gender, so they only take part in swaps
// when the item has no gendered pronouns that could contradict the change.
const GENDER_AMBIGUOUS = new Set(['Kai', 'Wei', 'Sam']);
const GENDERED_WORDS = /\b(he|she|his|her|him|hers|himself|herself|boy|girl|brother|sister)\b/i;
// Titles carry gender and honorific conventions a plain name swap can break
// ("Mdm Siti" must never become "Mdm Omar"), so titled names are left alone.
const TITLE_WORDS = '(?:Mr|Mrs|Ms|Mdm|Madam|Miss|Master|Cikgu|Uncle|Auntie|Aunty)';

function collectSpecText(spec) {
  return [
    spec.q, spec.answer, spec.explain, spec.reasoning,
    ...(spec.choices || []),
    ...Object.values(spec.optionExplanations || {}),
  ].filter(Boolean).join(' ');
}

function swapInText(text, mapping) {
  if (!text) return text;
  const map = new Map(mapping);
  const re = new RegExp(`\\b(${mapping.map(([from]) => from).join('|')})\\b`, 'g');
  return String(text).replace(re, name => map.get(name));
}

/**
 * Vary the pupil names inside a repeated seed question so each repeat reads
 * as fresh content, not the same sentence again. Swaps are gender-consistent
 * (a name referred to as “she” is only replaced by another girl’s name) and
 * are skipped entirely when a name appears in the answer choices, where a
 * swap could break the question.
 */
export function varyMcqNames(spec, index) {
  const specText = collectSpecText(spec);
  const found = ALL_SWAP_NAMES.filter(name =>
    new RegExp(`\\b${name}\\b`).test(spec.q) &&
    !new RegExp(`\\b${TITLE_WORDS}\\.?\\s+${name}\\b`).test(specText));
  if (!found.length) return spec;
  const choiceText = [spec.answer, ...(spec.choices || [])].join(' ');
  if (ALL_SWAP_NAMES.some(name => new RegExp(`\\b${name}\\b`).test(choiceText))) return spec;

  const gendered = GENDERED_WORDS.test(specText);
  const mapping = [];
  for (const name of found) {
    if (gendered && GENDER_AMBIGUOUS.has(name)) continue;
    const pool = gendered
      ? (GIRL_NAMES.includes(name) ? GIRL_NAMES : BOY_NAMES).filter(n => !GENDER_AMBIGUOUS.has(n))
      : ALL_SWAP_NAMES;
    const at = pool.indexOf(name);
    const replacement = pool[(at + index) % pool.length];
    if (replacement !== name) mapping.push([name, replacement]);
  }
  if (!mapping.length) return spec;

  const optionExplanations = spec.optionExplanations
    ? Object.fromEntries(Object.entries(spec.optionExplanations).map(([k, v]) => [k, swapInText(v, mapping)]))
    : spec.optionExplanations;
  return {
    ...spec,
    q: swapInText(spec.q, mapping),
    explain: swapInText(spec.explain, mapping),
    reasoning: swapInText(spec.reasoning, mapping),
    clueWords: spec.clueWords ? spec.clueWords.map(word => swapInText(word, mapping)) : spec.clueWords,
    optionExplanations,
  };
}

/**
 * Classify an MCQ stem, without wrapping it in anything.
 *
 * Every generated question used to be dressed in one of ten scene-setting
 * frames — "Fill in the blank in Siti's sentence: …", "Help Ben complete
 * this sentence: …". They existed to make repeated base sentences look
 * distinct, and they worked: the banks reported 100% unique prompts while
 * holding roughly one real question for every six shown.
 *
 * That was the wrong trade. The frame restates an instruction the screen
 * already gives ("READ THE WHOLE SENTENCE FIRST, THEN CHOOSE THE WORD THAT
 * FITS THE BLANK"), introduces a name the question never uses again, and
 * buries the sentence the child actually has to read under a clause of
 * admin. The banks are deduplicated to their real seeds instead, so fewer
 * questions each appear once, unadorned.
 *
 * The return shape is unchanged so callers do not have to care.
 *
 * @param {string} question
 * @returns {{ question: string, questionType: string }}
 */
export function contextualizeMcqQuestion(question) {
  const trimmed = String(question || '').trim();
  const base = /[.?!]["'\u2019\u201d)\]]?$/.test(trimmed) ? trimmed : `${trimmed}.`;
  return {
    question: base,
    // Still recorded by review scheduling; now describes the stem's own
    // shape rather than which wrapper it happened to be handed.
    questionType: /___/.test(base) ? 'sentence-completion' : 'question-response',
  };
}

/** One-sentence lead for duplicated cloze passages, e.g. “Mei shared this recount with the class.” */
export function passageLead(index) {
  const name = NAMES[index % NAMES.length];
  const type = TEXT_TYPES[index % TEXT_TYPES.length];
  return `${name} shared this ${type} with the class.`;
}

function lowercaseOpening(sentence) {
  const text = String(sentence || '');
  const firstWord = (text.match(/^[“"']?([A-Za-z]+)/) || [])[1] || '';
  const properOpenings = new Set(['I', 'Mei', 'Ahmad', 'Siti', 'Ravi', 'Wei', 'Zara', 'Jia', 'Priya', 'Kai', 'Ben', 'Ali', 'National']);
  if (properOpenings.has(firstWord)) return text;
  return text.replace(/^([“"']?)([A-Z])/, (_, quote, letter) => `${quote}${letter.toLowerCase()}`);
}

export function contextualizeSentence(sentence, index) {
  const context = expansionContext(index);
  const opening = context.replace(/^on /, 'On ');
  return `${opening}, ${lowercaseOpening(sentence)}`;
}

export function contextualTitle(index) {
  const name = NAMES[index % NAMES.length];
  const type = TEXT_TYPES[index % TEXT_TYPES.length];
  return `${name}’s ${type}`;
}
