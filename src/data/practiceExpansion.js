/** Shared, deterministic expansion helpers for large practice banks. */

export const MIN_QUESTIONS_PER_SCOPE = 101;

// 23 names (coprime with the 5 MCQ forms and 5 text types below) so every
// (name, form) pair is unique across the first 115 indexes — this is what
// keeps repeated base questions distinct without resorting to artificial
// scene-setting boilerplate.
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

// Five short, kid-friendly question frames. Each frame includes the pupil's
// name so that when a base sentence repeats, the prompt still reads naturally
// and stays unique.
const MCQ_FORMS = [
  {
    type: 'sentence-completion',
    render: (question, name) => `Fill in the blank in ${name}’s sentence: ${question}`,
  },
  {
    type: 'proofreading',
    render: (question, name) => `${name} is checking a sentence. Choose the word that fits the blank: ${question}`,
  },
  {
    type: 'dialogue-completion',
    render: (question, name) => `${name} read this sentence aloud, leaving out one word: ${question} Which word is missing?`,
  },
  {
    type: 'context-selection',
    render: (question, name) => `Choose the best word for the blank in ${name}’s sentence: ${question}`,
  },
  {
    type: 'editing-choice',
    render: (question, name) => `Help ${name} complete this sentence: ${question}`,
  },
];

export function expansionContext(index) {
  const day = DAYS[index % DAYS.length];
  const setting = SETTINGS[Math.floor(index / DAYS.length) % SETTINGS.length];
  return `on ${day} during ${setting}`;
}

export function contextualizeMcqQuestion(question, index) {
  const form = MCQ_FORMS[index % MCQ_FORMS.length];
  const name = NAMES[index % NAMES.length];
  const trimmed = String(question || '').trim();
  const base = /[.?!]["'’”)\]]?$/.test(trimmed) ? trimmed : `${trimmed}.`;
  return {
    question: form.render(base, name),
    questionType: form.type,
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
