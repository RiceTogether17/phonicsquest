/**
 * PhonicsQuest – Sentence Skills Model
 *
 * Provides skill tag definitions, diagnostic hint generation, and
 * session summary computation for the upgraded Sentence Forge quest.
 *
 * Skill tags can be attached to sentence entries via sentenceSkills: [...]
 * Backward compatible: sentences without skill tags still work normally.
 */

/** Human-readable labels for sentence skill tags. */
export const SENTENCE_SKILL_LABELS = {
  word_order: 'Word Order',
  first_word_clue: 'First Word',
  time_order_clue: 'Time Order',
  connector_clue: 'Connectors',
  tense_clue: 'Verb Tense',
  punctuation_clue: 'Punctuation',
  subject_action_clue: 'Subject & Action',
  modal_order: 'Modal Verbs',
  clause_boundary: 'Clause Boundary',
  inversion_pattern: 'Inversion',
  comparison_structure: 'Comparisons',
  preposition_clue: 'Prepositions',
};

/**
 * Generate a short clue panel prompt for sentences with metadata.
 * Returns null if the entry has no enriching metadata to display.
 *
 * @param {Object} entry - sentence data entry
 * @returns {{ prompt: string, detail?: string }|null}
 */
export function getSkillCluePrompt(entry) {
  if (!entry) return null;
  const skills = entry.sentenceSkills || [];

  if (entry.firstWordHint && skills.includes('first_word_clue')) {
    return {
      prompt: 'Which word should come first in this sentence?',
      detail: entry.firstWordHint,
    };
  }
  if (entry.punctuationHint && skills.includes('punctuation_clue')) {
    return {
      prompt: 'Notice the comma — what does it tell you about word order?',
      detail: entry.punctuationHint,
    };
  }
  if (skills.includes('time_order_clue')) {
    return {
      prompt: 'Find the time word or phrase. Where does it go in the sentence?',
      detail: entry.grammarNote || 'Time phrases often come first, before the comma.',
    };
  }
  if (skills.includes('connector_clue') && entry.expectedConnector) {
    return {
      prompt: `Find the connector word (e.g. "${entry.expectedConnector}"). Which part does it join?`,
      detail: entry.grammarNote || 'Connectors link two ideas and must be placed between them.',
    };
  }
  if (skills.includes('tense_clue') && entry.grammarNote) {
    return {
      prompt: 'Which word tells you when this action happened?',
      detail: entry.grammarNote,
    };
  }
  if (skills.includes('modal_order')) {
    return {
      prompt: 'Find the modal verb (e.g. should, must, can). Where does it go?',
      detail: entry.grammarNote || 'Modal verbs come directly before the main verb.',
    };
  }
  if (skills.includes('comparison_structure')) {
    return {
      prompt: 'This sentence uses a comparison. Find the pattern: adj + -er + than.',
      detail: entry.grammarNote || '',
    };
  }
  if (skills.includes('preposition_clue')) {
    return {
      prompt: 'Find the preposition phrase. Which word shows position, time, or direction?',
      detail:
        entry.grammarNote || 'Prepositions like in/on/under/between link nouns to place and time.',
    };
  }
  if (skills.includes('inversion_pattern')) {
    return {
      prompt: 'This sentence has an inverted structure. Where does the subject go?',
      detail:
        entry.grammarNote ||
        'In inverted sentences, the verb or auxiliary comes before the subject.',
    };
  }
  return null;
}

/**
 * Diagnose a wrong sentence build attempt and produce a targeted hint.
 * Uses sentence metadata when available; falls back to generic advice.
 *
 * @param {Object} entry - sentence data entry
 * @param {string[]} builtWords  - words in learner's order
 * @param {string[]} correctWords - correct word order
 * @returns {string} targeted hint message
 */
/**
 * Where the build first departs from the target, described the way a teacher
 * standing over the desk would: naming the word that is out of place rather
 * than restating the rule.
 *
 * A category hint ("check where the connector goes") is advice about the kind
 * of sentence. This is advice about THIS attempt, so it comes first — but only
 * when the child is close enough for the position to mean something. On a
 * wholly scrambled attempt, pointing at word 1 teaches nothing.
 *
 * @param {string[]} builtWords
 * @param {string[]} correctWords
 * @returns {string} '' when no useful positional hint applies
 */
export function describeFirstDivergence(builtWords, correctWords) {
  if (!builtWords?.length || !correctWords?.length) return '';

  const firstWrong = correctWords.findIndex((word, i) => builtWords[i] !== word);
  // Every placed word matches and the sentence is complete.
  if (firstWrong === -1) return '';

  const placed = firstWrong;
  const given = builtWords[firstWrong];

  // Nothing right yet: a position hint would just read as "word 1 is wrong".
  if (placed === 0) return '';

  const soFar = `The first ${placed === 1 ? 'word is' : `${placed} words are`} right.`;

  // The prefix is correct and the child simply has not finished. Never name
  // the next word here — a child could otherwise press Check repeatedly and
  // have the whole sentence dictated to them one word at a time.
  if (given === undefined) {
    return `${soFar} Keep going — some words are still in the bank.`;
  }

  // Naming only the misplaced word keeps the answer unrevealed while still
  // pointing at the decision the child has to make.
  return `${soFar} "${given}" is not what comes next — look again at that spot.`;
}

export function diagnoseBuildError(entry, builtWords, correctWords) {
  if (!builtWords.length) return 'Build your sentence first! 🔨';

  // A hint about THIS attempt beats a hint about this kind of sentence.
  const positional = describeFirstDivergence(builtWords, correctWords);
  if (positional) return positional;

  // First-word mismatch
  if (entry.expectedFirstWord) {
    const built = (builtWords[0] || '').toLowerCase().replace(/[^a-z]/g, '');
    const correct = entry.expectedFirstWord.toLowerCase().replace(/[^a-z]/g, '');
    if (built !== correct) {
      return entry.firstWordHint
        ? `Check the first word. ${entry.firstWordHint}`
        : `Try starting with "${entry.expectedFirstWord}".`;
    }
  }

  // Connector placement mismatch
  if (entry.expectedConnector) {
    const conn = entry.expectedConnector.toLowerCase();
    const correctIdx = correctWords.findIndex(
      (w) => w.toLowerCase().replace(/[^a-z]/g, '') === conn,
    );
    const builtIdx = builtWords.findIndex((w) => w.toLowerCase().replace(/[^a-z]/g, '') === conn);
    if (correctIdx !== -1 && correctIdx !== builtIdx) {
      return entry.grammarNote
        ? `"${entry.expectedConnector}" is in the wrong place. ${entry.grammarNote}`
        : `The connector "${entry.expectedConnector}" belongs in a different position.`;
    }
  }

  // Skill-based hints
  const skills = entry.sentenceSkills || [];

  if (skills.includes('time_order_clue')) {
    const firstCorrect = correctWords[0];
    if (builtWords[0] !== firstCorrect) {
      return entry.punctuationHint || 'The time phrase should come at the start, before the comma.';
    }
  }

  if (skills.includes('punctuation_clue') && entry.punctuationHint) {
    return entry.punctuationHint;
  }

  if (skills.includes('connector_clue')) {
    return 'Check where the connector word goes — it links two parts of the sentence.';
  }

  if (skills.includes('tense_clue') && entry.grammarNote) {
    return `Look at the verb tense clue. ${entry.grammarNote}`;
  }

  if (skills.includes('modal_order')) {
    return 'Check the modal verb position (e.g. should, must, can) — it comes before the main verb.';
  }

  if (skills.includes('clause_boundary')) {
    return 'Your sentence may have the clause order reversed. Look for the comma.';
  }

  if (skills.includes('inversion_pattern')) {
    return 'This sentence uses an inverted structure — the verb comes before the subject.';
  }

  if (skills.includes('comparison_structure')) {
    return entry.grammarNote || 'Check the comparative structure: adjective + -er + than.';
  }

  if (skills.includes('preposition_clue')) {
    return entry.grammarNote || 'Check where the preposition phrase should go in the sentence.';
  }

  if (skills.includes('first_word_clue') && entry.firstWordHint) {
    return entry.firstWordHint;
  }

  // Fall back to grammar note if present
  if (entry.grammarNote) return `${entry.grammarNote} Try rearranging.`;

  return 'Not quite — try rearranging the words. 🔨';
}

/**
 * Compute session skill summary from the attempt tracking map.
 *
 * @param {Object} skillAttempts - { [skillKey]: { correct: number, total: number } }
 * @returns {{ strongest: string|null, weakest: string|null, scores: Array }}
 */
export function getSkillSummary(skillAttempts) {
  const entries = Object.entries(skillAttempts)
    .filter(([, d]) => d.total > 0)
    .map(([skill, d]) => ({
      skill,
      label: SENTENCE_SKILL_LABELS[skill] || skill.replace(/[_-]/g, ' '),
      score: d.correct / d.total,
      attempts: d.total,
    }));

  if (!entries.length) return { strongest: null, weakest: null, scores: [] };

  const sorted = [...entries].sort((a, b) => b.score - a.score);
  return {
    strongest: sorted[0].label,
    weakest: sorted[sorted.length - 1].label,
    scores: entries,
  };
}
