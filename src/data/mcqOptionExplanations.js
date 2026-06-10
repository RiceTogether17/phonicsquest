function uniqueOptions(answer, distractors = []) {
  return [answer, ...distractors].filter((choice, idx, arr) => choice && arr.indexOf(choice) === idx);
}

function optionMap(answer, distractors, explain) {
  return Object.fromEntries(
    uniqueOptions(answer, distractors).map(choice => [choice, explain(choice, choice === answer)]),
  );
}

function articleRule(article) {
  const key = String(article).toLowerCase();
  if (key === 'a') return '“a” is for one non-specific countable noun before a consonant sound.';
  if (key === 'an') return '“an” is for one non-specific countable noun before a vowel sound or silent h.';
  if (key === 'the') return '“the” is for a specific, unique, or already-known noun.';
  if (key === 'some') return '“some” is for an amount of something uncountable or plural.';
  return `“${article}” does not match the article clue in this sentence.`;
}

export function makeArticleOptionExplanations(answer, distractors) {
  return optionMap(answer, distractors, (choice, isCorrect) => {
    if (isCorrect) return `Correct — ${articleRule(choice)}`;
    return `Not quite — ${articleRule(choice)} This sentence needs “${answer}”.`;
  });
}

const PRONOUN_ROLES = {
  I: 'subject pronoun', he: 'subject pronoun', she: 'subject pronoun', we: 'subject pronoun', they: 'subject pronoun', it: 'subject pronoun', It: 'subject pronoun', He: 'subject pronoun', She: 'subject pronoun', We: 'subject pronoun', They: 'subject pronoun',
  me: 'object pronoun', him: 'object pronoun', her: 'object pronoun', us: 'object pronoun', them: 'object pronoun',
  my: 'possessive adjective', your: 'possessive adjective', his: 'possessive adjective or possessive pronoun', its: 'possessive adjective', their: 'possessive adjective', our: 'possessive adjective',
  mine: 'possessive pronoun', hers: 'possessive pronoun', theirs: 'possessive pronoun', ours: 'possessive pronoun',
  myself: 'reflexive pronoun', himself: 'reflexive pronoun', herself: 'reflexive pronoun', itself: 'reflexive pronoun', ourselves: 'reflexive pronoun', yourselves: 'reflexive pronoun', themselves: 'reflexive pronoun',
};

export function makePronounOptionExplanations(answer, distractors) {
  return optionMap(answer, distractors, (choice, isCorrect) => {
    const role = PRONOUN_ROLES[choice] || 'pronoun form';
    const answerRole = PRONOUN_ROLES[answer] || 'pronoun form';
    if (isCorrect) return `Correct — “${choice}” is the ${answerRole} that fits this blank.`;
    return `Not quite — “${choice}” is a ${role}, but this blank needs “${answer}”, the ${answerRole}.`;
  });
}

export function makeAgreementOptionExplanations(answer, distractors) {
  return optionMap(answer, distractors, (choice, isCorrect) => {
    if (isCorrect) return `Correct — “${choice}” agrees with the true subject in the sentence.`;
    return `Not quite — “${choice}” does not agree with the true subject here. Use “${answer}”.`;
  });
}

export function makeTenseOptionExplanations(answer, distractors, rule) {
  return optionMap(answer, distractors, (choice, isCorrect) => {
    if (isCorrect) return `Correct — the time clue points to “${choice}”. ${rule}`;
    return `Not quite — “${choice}” is a different tense or verb form. The time clue points to “${answer}”.`;
  });
}

/**
 * Generic per-choice explanations for items whose builder did not author
 * richer ones. Uses the category's rule/tip so the feedback still teaches
 * the transferable strategy rather than just naming the answer.
 *
 * @param {string} answer
 * @param {string[]} choices    - all choices including the answer
 * @param {{ rule?: string, tip?: string, label?: string }} categoryTip
 */
export function makeFallbackOptionExplanations(answer, choices, categoryTip = {}) {
  const distractors = choices.filter(c => c !== answer);
  const rule = categoryTip.rule || '';
  const tip = categoryTip.tip || '';
  return optionMap(answer, distractors, (choice, isCorrect) => {
    if (isCorrect) return `Correct — “${choice}” is the choice that fits this sentence. ${rule}`.trim();
    return `Not quite — “${choice}” does not fit here; the sentence needs “${answer}”. ${tip || rule}`.trim();
  });
}
