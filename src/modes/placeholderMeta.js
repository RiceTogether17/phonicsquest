/**
 * PhonicsQuest – Primary placeholder metadata
 *
 * Lightweight labels/icons/blurbs for the Primary English placeholder modules.
 * Kept in its own module (separate from the heavy primaryPlaceholders.js, which
 * pulls in every practice-test data set) so the header text can be looked up
 * eagerly without forcing the large data chunk to load.
 */

export const PLACEHOLDER_META = {
  'visual-text': {
    icon: '🖼️',
    label: 'Visual Text Comprehension',
    blurb: 'Read posters, notices, schedules and infographics (P1–P6) and answer questions. Builds Paper 2 Visual Text skills.',
    paperLink: 'Paper 2 · Visual Text',
  },
  'comprehension-cloze': {
    icon: '📰',
    label: 'Comprehension Cloze',
    blurb: 'Open-cloze passages — fill the blank with one suitable word using both grammar and meaning clues. Helps with Paper 2 Comprehension Cloze.',
    paperLink: 'Paper 2 · Comprehension Cloze',
  },
  'open-comprehension': {
    icon: '📚',
    label: 'Open-ended Comprehension',
    blurb: 'Read a passage and answer questions in your own words (P1–P6). Compare your answers to model responses and self-assess.',
    paperLink: 'Paper 2 · Comprehension Open-ended',
  },
  synthesis: {
    icon: '🔁',
    label: 'Synthesis & Transformation',
    blurb: 'Combine or rewrite sentences without changing meaning — connectors, reported speech, passive voice, relative clauses (P4–P6).',
    paperLink: 'Paper 2 Booklet B · Synthesis & Transformation',
    related: { target: 'sentence-forge', label: '🔨 Sentence Forge for word-order practice' },
  },
  'situational-writing': {
    icon: '✉️',
    label: 'Situational Writing',
    blurb: 'Write emails, letters, diary entries and speeches for real-life purposes (P5–P6). Purpose, audience and format all matter.',
    paperLink: 'Paper 1 · Situational Writing',
    related: { target: 'writing-quest', label: '📝 Writing Quest for continuous writing' },
  },
  'p1-practice-tests': {
    icon: '🎓',
    label: 'Primary 1 Practice Tests',
    blurb: 'Four full P1 English papers (T1–T4). Grammar MCQ, Vocabulary MCQ, Grammar Cloze, Vocabulary Cloze, Word Order, Editing (T3 & T4) and Comprehension. Every section is scored and weak skills link to drill modules.',
    paperLink: 'P1 · Continual Assessment style',
  },
  'p2-practice-tests': {
    icon: '🎓',
    label: 'Primary 2 Practice Tests',
    blurb: 'Four full P2 English papers (T1–T4). Adds Sentence Combining and mixed-error Editing. Every question shows its skill with a "Practise this →" shortcut.',
    paperLink: 'P2 · Continual Assessment style',
  },
  'p3-practice-tests': {
    icon: '🎓',
    label: 'Primary 3 Practice Tests',
    blurb: 'Three P3 papers (T1–T3 only — there is no T4 in this bank). Adds tag questions, phrasal verbs, modal-regret ("should have"), open Comprehension Cloze and two-passage comprehension in T3.',
    paperLink: 'P3 · Continual Assessment style',
  },
  'p4-practice-tests': {
    icon: '🎓',
    label: 'Primary 4 Practice Tests',
    blurb: 'Four full P4 papers (T1–T4). Introduces passive voice, reported speech, relative clauses, conditionals, Synthesis & Transformation and longer comprehension. Aligned to the P4 school format (55 marks per paper).',
    paperLink: 'P4 · School exam format',
  },
  'p5-practice-tests': {
    icon: '🎓',
    label: 'Primary 5 Practice Tests',
    blurb: 'Four full P5 papers (T1–T4). Adds Situational Writing (email/letter/diary/speech) and Comprehension Cloze (open, 10 blanks). Harder grammar and PSLE-level vocabulary throughout.',
    paperLink: 'P5 · PSLE preparation format',
  },
  'p6-practice-tests': {
    icon: '🎓',
    label: 'Primary 6 Practice Tests',
    blurb: 'Four full PSLE-format P6 papers (T1–T4). Full Paper 1 + Paper 2 structure with the hardest synthesis patterns, inversion, and evidence-based comprehension. Get exam-ready.',
    paperLink: 'P6 · Full PSLE format',
  },
};

export function getPlaceholderMeta(kind) {
  return PLACEHOLDER_META[kind] || null;
}
