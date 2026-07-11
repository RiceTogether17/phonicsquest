/** Shared, deterministic expansion helpers for large practice banks. */

export const MIN_QUESTIONS_PER_SCOPE = 101;

const DAYS = [
  'Monday morning', 'Monday afternoon', 'Tuesday morning', 'Tuesday afternoon',
  'Wednesday morning', 'Wednesday afternoon', 'Thursday morning',
  'Thursday afternoon', 'Friday morning', 'Friday afternoon', 'Saturday morning',
];

const SETTINGS = [
  'the class briefing', 'a library activity', 'the science lesson',
  'a group discussion', 'the school assembly', 'the reading workshop',
  'a project meeting', 'the language lesson', 'a peer-editing session',
  'the learning-support clinic',
];

const MCQ_FORMS = [
  {
    type: 'sentence-completion',
    render: (question, context) => `Complete the sentence reviewed ${context}: ${question}`,
  },
  {
    type: 'proofreading',
    render: (question, context) => `A pupil proofreading notes ${context} found one gap in this sentence: ${question} Which option fits?`,
  },
  {
    type: 'dialogue-completion',
    render: (question, context) => `While working ${context}, a pupil asked how to complete this line: ${question}`,
  },
  {
    type: 'context-selection',
    render: (question, context) => `Read the sentence discussed ${context}: ${question} Choose the most accurate answer.`,
  },
  {
    type: 'editing-choice',
    render: (question, context) => `An editor checking a class response ${context} saw this sentence: ${question} What belongs in the blank?`,
  },
];

export function expansionContext(index) {
  const day = DAYS[index % DAYS.length];
  const setting = SETTINGS[Math.floor(index / DAYS.length) % SETTINGS.length];
  return `on ${day} during ${setting}`;
}

export function contextualizeMcqQuestion(question, index, level = '') {
  const form = MCQ_FORMS[index % MCQ_FORMS.length];
  const trimmed = String(question || '').trim();
  const base = /[.?!]["'’”)\]]?$/.test(trimmed) ? trimmed : `${trimmed}.`;
  const levelLabel = /^P\d$/i.test(level) ? `with a Primary ${level.slice(1)} class ` : '';
  return {
    question: form.render(base, `${levelLabel}${expansionContext(index)}`),
    questionType: form.type,
  };
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
  const day = DAYS[index % DAYS.length];
  const setting = SETTINGS[Math.floor(index / DAYS.length) % SETTINGS.length]
    .replace(/^(the|a|an)\s+/i, '');
  return `${day} · ${setting}`;
}
