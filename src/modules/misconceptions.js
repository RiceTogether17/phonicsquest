/**
 * PhonicsQuest – Misconception taxonomy
 *
 * The vocabulary the feedback system uses to say *what went wrong*, rather
 * than only *that* something went wrong. A real teacher marking a wrong
 * answer does not think "incorrect" — they think "she matched the verb to
 * the nearest noun again". This file is that second thought, written down.
 *
 * Each entry carries four separable things, because the feedback ladder
 * uses them at different moments:
 *
 *   childName  – what the child is told the slip is called, in plain words.
 *                Never jargon: "matching the verb to the wrong word".
 *   label      – the teacher/parent-facing name, used in reports where the
 *                technical term is the useful one.
 *   rule       – the transferable rule, one sentence. Shown when re-teaching.
 *   example    – a worked model showing the rule applied and misapplied.
 *   cue        – the *coaching prompt*: what to say on the FIRST wrong
 *                attempt, when the answer must not be revealed yet. Always
 *                points at evidence in the question and hands the thinking
 *                back to the child.
 *   selfCheck  – the habit to carry to the next question ("swap in he/she").
 *
 * `cue` is the part that makes this a teaching system instead of an answer
 * key: it is phrased so it can be shown *before* the child sees the correct
 * answer and still be useful.
 */

/**
 * @typedef {object} Misconception
 * @property {string} id
 * @property {string} label       teacher-facing name
 * @property {string} childName   child-facing name, plain language
 * @property {string} rule        the transferable rule, one sentence
 * @property {string} example     worked example showing right vs wrong
 * @property {string} cue         first-attempt coaching prompt (no answer given)
 * @property {string} selfCheck   habit to use on the next question
 * @property {string} domain      'grammar' | 'vocab' | 'spelling' | 'comprehension' | 'writing'
 */

/** @type {Record<string, Misconception>} */
export const MISCONCEPTIONS = Object.freeze({
  'subject-verb-agreement': {
    id: 'subject-verb-agreement',
    label: 'Subject–verb agreement',
    childName: 'matching the verb to the wrong word',
    rule: 'The verb must match the subject: one thing takes "is / was / has / runs", more than one takes "are / were / have / run".',
    example: '"The boy runs." (one) — "The boys run." (more than one)',
    cue: 'Find the subject — who or what is doing it? Is it one, or more than one? Now try again.',
    selfCheck: 'Swap the subject for he/she/it or they. Whichever sounds right tells you the verb.',
    domain: 'grammar',
  },

  'agreement-with-nearest-noun': {
    id: 'agreement-with-nearest-noun',
    label: 'Agreement with the nearest noun',
    childName: 'matching the verb to the closest word instead of the real subject',
    rule: 'The words between the subject and the verb do not change the verb. Cover them up and the subject is still the boss.',
    example: '"The box of apples IS heavy." — the box is heavy, not the apples.',
    cue: 'Cover up the words in the middle with your finger. Who or what is really doing the action? Try again.',
    selfCheck: 'Cross out any "of…", "with…" or "and his…" phrase before you choose the verb.',
    domain: 'grammar',
  },

  'tense-time-marker': {
    id: 'tense-time-marker',
    label: 'Tense ignoring the time signal',
    childName: 'missing the word that tells you when',
    rule: 'A time word in the sentence decides the tense: "yesterday" needs past, "now" needs present, "tomorrow" needs future.',
    example: '"Yesterday she walked home." — not "walks". "Every day she walks home."',
    cue: 'There is a word in this sentence that tells you WHEN it happened. Find it, then try again.',
    selfCheck: 'Hunt for the time word first — before you look at the choices.',
    domain: 'grammar',
  },

  'tense-choice': {
    id: 'tense-choice',
    label: 'Tense choice',
    childName: 'picking the wrong time for the verb',
    rule: 'Same verb, different time: choose the form that matches when the action happens.',
    example:
      '"I eat" (now) — "I ate" (before) — "I will eat" (later) — "I have eaten" (done, still matters now).',
    cue: 'You picked the right verb but the wrong time. When is this happening? Try again.',
    selfCheck: 'Say the sentence out loud with each choice. Which one lands in the right time?',
    domain: 'grammar',
  },

  'verb-form-after-helper': {
    id: 'verb-form-after-helper',
    label: 'Verb form after a helper verb',
    childName: 'changing the verb after a helping word',
    rule: 'After can, will, should, must, did or "to", the verb stays in its plain form — no -s, no -ed, no -ing.',
    example: '"She can swim." — not "can swims". "He didn\'t go." — not "didn\'t went".',
    cue: 'Look at the word just before the gap. After a helping word, what shape does the verb take? Try again.',
    selfCheck: 'Spot the helper first. If there is one, the next verb is plain.',
    domain: 'grammar',
  },

  'article-sound': {
    id: 'article-sound',
    label: 'a / an by sound',
    childName: 'choosing a or an by the letter instead of the sound',
    rule: 'Use "an" before a vowel SOUND and "a" before a consonant SOUND — your ears decide, not the spelling.',
    example: '"an hour" (sounds like "our") — "a university" (sounds like "you-niversity").',
    cue: 'Say the next word out loud. Does it START with a vowel sound? Try again.',
    selfCheck: 'Whisper the word after the gap before you choose.',
    domain: 'grammar',
  },

  'article-specificity': {
    id: 'article-specificity',
    label: 'a / the — general or specific',
    childName: 'mixing up a general thing and a particular thing',
    rule: 'Use "a/an" the first time you mention something, and "the" when both of you already know which one.',
    example: '"I saw a dog. The dog was barking."',
    cue: 'Is this the first time this thing is mentioned, or do we already know which one? Try again.',
    selfCheck: 'Ask: could I point at it and we would both know which? Then "the".',
    domain: 'grammar',
  },

  'pronoun-case': {
    id: 'pronoun-case',
    label: 'Pronoun case',
    childName: 'using the doing-pronoun where the receiving-pronoun belongs',
    rule: 'He, she, they, I and we DO the action. Him, her, them, me and us RECEIVE it.',
    example: '"She gave the book to me." — not "to I". "My friend and I went." — not "me went".',
    cue: 'Is this pronoun doing the action, or having it done to them? Try again.',
    selfCheck: 'Take the other person out of the sentence and say it alone: "…gave it to me."',
    domain: 'grammar',
  },

  'pronoun-agreement': {
    id: 'pronoun-agreement',
    label: 'Pronoun agreement',
    childName: 'using a pronoun that does not match who it stands for',
    rule: 'A pronoun must match the noun it replaces — one person or many, and the right person.',
    example: '"The girls packed their bags." — not "her bags".',
    cue: 'Which noun does this pronoun stand for? One, or more than one? Try again.',
    selfCheck: 'Point back to the noun the pronoun replaces before you choose.',
    domain: 'grammar',
  },

  'comparative-vs-superlative': {
    id: 'comparative-vs-superlative',
    label: 'Comparative vs superlative',
    childName: 'comparing two things the way you compare many',
    rule: 'Two things → -er / more … than. Three or more → the -est / the most.',
    example: '"Ali is taller than Ben." — "Ali is the tallest in the class."',
    cue: 'Count how many things are being compared. Two, or more than two? Try again.',
    selfCheck: 'Look for the word "than" — it means only two are being compared.',
    domain: 'grammar',
  },

  'countable-uncountable': {
    id: 'countable-uncountable',
    label: 'Countable / uncountable words',
    childName: 'using a counting word with something you cannot count',
    rule: 'Use many / few / fewer for things you can count, and much / little / less for things you cannot.',
    example: '"many books" but "much water" — "fewer cars" but "less traffic".',
    cue: 'Could you count that thing one, two, three? Try again with that in mind.',
    selfCheck: 'Try saying "two of them". If it sounds odd, the word is uncountable.',
    domain: 'grammar',
  },

  'preposition-collocation': {
    id: 'preposition-collocation',
    label: 'Preposition collocation',
    childName: 'picking a small joining word that does not go with this verb',
    rule: 'Prepositions travel in fixed pairs with certain words — you learn them together, like "good AT", "listen TO", "arrive AT".',
    example: '"She is good at drawing." — not "good in drawing".',
    cue: 'Read the whole phrase together, not just the gap. Which small word usually follows that word? Try again.',
    selfCheck: 'Learn the pair as one chunk: "depend on", "afraid of", "interested in".',
    domain: 'grammar',
  },

  'connector-meaning': {
    id: 'connector-meaning',
    label: 'Connector meaning',
    childName: 'joining two ideas with the wrong kind of link',
    rule: 'The connector must match the relationship: "because" gives a reason, "but/although" shows a surprise, "so" gives a result.',
    example: '"It rained, SO we stayed in." — "It rained, BUT we still went out."',
    cue: 'Read both halves. Does the second half give a reason, a result, or a surprise? Try again.',
    selfCheck: 'Name the relationship in your head before you look at the choices.',
    domain: 'grammar',
  },

  'noun-number': {
    id: 'noun-number',
    label: 'Singular / plural nouns',
    childName: 'using one when the sentence needs many (or the other way round)',
    rule: 'Most nouns add -s for more than one, but some change completely: child → children, mouse → mice, foot → feet.',
    example: '"Three children" — not "three childs".',
    cue: 'How many is the sentence talking about? Try again.',
    selfCheck: 'Look for a number word or "some / many / a few" just before the noun.',
    domain: 'grammar',
  },

  'punctuation-slip': {
    id: 'punctuation-slip',
    label: 'Punctuation',
    childName: 'a punctuation slip',
    rule: 'Sentences start with a capital letter and end with . ? or ! — and names always take a capital.',
    example: '"where is my bag" → "Where is my bag?"',
    cue: 'Read it aloud. Where does your voice stop, and does anything need a capital? Try again.',
    selfCheck: 'Check the first letter and the last mark of every sentence you write.',
    domain: 'writing',
  },

  'homophone-confusion': {
    id: 'homophone-confusion',
    label: 'Homophone confusion',
    childName: 'two words that sound the same but mean different things',
    rule: "Same sound, different job: their = belonging to them, there = a place, they're = they are.",
    example: '"They\'re putting their bags over there."',
    cue: 'These words sound the same but do different jobs. What job does this gap need? Try again.',
    selfCheck: 'Try stretching it out: if "they are" fits, it is "they\'re".',
    domain: 'spelling',
  },

  'word-form': {
    id: 'word-form',
    label: 'Word form',
    childName: 'the right word wearing the wrong ending',
    rule: 'The same word family changes shape for its job: care → careful (describes) → carefully (how) → careless (without).',
    example:
      '"He drove carefully." (how he drove) — "He is a careful driver." (what kind of driver)',
    cue: 'You found the right word family. Does the gap need a describing word, an action, or a how-word? Try again.',
    selfCheck: 'Ask what JOB the gap does before you choose the ending.',
    domain: 'vocab',
  },

  'spelling-slip': {
    id: 'spelling-slip',
    label: 'Spelling',
    childName: 'the right word with a spelling slip',
    rule: 'You chose the right word — it just needs the correct letters.',
    example: '"beautiful", not "beautifull".',
    cue: 'You have the right word. Look at the letters again, one part at a time. Try again.',
    selfCheck: 'Break the word into chunks and check each one: beau-ti-ful.',
    domain: 'spelling',
  },

  'word-choice-context': {
    id: 'word-choice-context',
    label: 'Word choice in context',
    childName: 'a word that is close in meaning but does not fit here',
    rule: 'Words that mean nearly the same thing are not always swappable — the sentence around the gap decides.',
    example:
      '"a large crowd" and "a big crowd" both work, but only "a heavy rain" becomes "heavy rainfall".',
    cue: 'Read the whole sentence with your word in it. Which part does not sound right? Try again.',
    selfCheck: 'Read the sentence back with your choice inside before you commit.',
    domain: 'vocab',
  },

  'opposite-meaning': {
    id: 'opposite-meaning',
    label: 'Opposite meaning chosen',
    childName: 'picking the word that means the opposite',
    rule: 'Check whether the sentence is positive or negative before you choose — one small word like "not" or "never" flips everything.',
    example: '"The path was NOT safe, so it was dangerous." — not "secure".',
    cue: 'Is this sentence saying something good or something bad is happening? Try again.',
    selfCheck: 'Look for "not", "never", "hardly" or "instead" — they flip the meaning.',
    domain: 'vocab',
  },

  'evidence-not-checked': {
    id: 'evidence-not-checked',
    label: 'Answer not checked against the text',
    childName: 'answering from memory instead of from the passage',
    rule: 'Every comprehension answer must be provable — you should be able to put your finger on the line that shows it.',
    example: 'Question: "Why did Mei run?" → find the sentence that says "because she was late".',
    cue: 'Go back to the passage and find the exact line that answers this. Try again.',
    selfCheck: 'Point to your evidence in the text before you choose.',
    domain: 'comprehension',
  },

  'question-word-missed': {
    id: 'question-word-missed',
    label: 'Question word missed',
    childName: 'answering a different question from the one asked',
    rule: 'The question word tells you what kind of answer to give: why → a reason, how → a way, when → a time.',
    example: '"Why was she late?" needs "because…", not "at eight o\'clock".',
    cue: 'Read the question word again — why, how, when or where? Does your answer match it? Try again.',
    selfCheck: 'Underline the question word before you answer.',
    domain: 'comprehension',
  },

  'incomplete-answer': {
    id: 'incomplete-answer',
    label: 'Incomplete answer',
    childName: 'a good start that stops too soon',
    rule: 'An open-ended answer needs every part the question asks for — if it asks for two reasons, give two.',
    example: '"Give two reasons" → "She was tired AND it was raining."',
    cue: 'Count what the question asks for, then count what you gave. Try again.',
    selfCheck: 'Re-read the question after answering and tick off each part.',
    domain: 'comprehension',
  },

  'structure-not-followed': {
    id: 'structure-not-followed',
    label: 'Required structure not used',
    childName: 'a good sentence that does not use the pattern asked for',
    rule: 'Synthesis questions test one pattern — you must start with the words given and keep the original meaning.',
    example: 'Begin with "No sooner…" → "No sooner had he sat down than the bell rang."',
    cue: 'Look at the words you were told to begin with. Does your sentence use them? Try again.',
    selfCheck: 'Copy the given opening words first, then build the rest around them.',
    domain: 'writing',
  },

  'meaning-changed': {
    id: 'meaning-changed',
    label: 'Meaning changed in rewriting',
    childName: 'a rewrite that changed what the sentence means',
    rule: 'When you rewrite a sentence, every fact must survive — same who, same what, same when.',
    example: '"The cake was eaten by Sara." keeps Sara as the eater.',
    cue: 'Read your sentence and the original side by side. Did anything change? Try again.',
    selfCheck: 'Check who did what to whom in both versions.',
    domain: 'writing',
  },

  'rule-not-applied': {
    id: 'rule-not-applied',
    label: 'Rule not applied',
    childName: 'a rule that has not clicked yet',
    rule: 'Slow down and name the rule before you choose — the right answer follows from the rule, not from what sounds nice.',
    example: 'Say the rule in your own words first, then test each choice against it.',
    cue: 'Read the sentence once more and look for the clue that decides this. Try again.',
    selfCheck: 'Say the rule out loud before you tap.',
    domain: 'grammar',
  },

  'no-answer': {
    id: 'no-answer',
    label: 'No answer given',
    childName: 'a blank left empty',
    rule: 'An empty answer always scores zero — a sensible guess sometimes scores.',
    example: 'Even a partial answer can earn a mark; nothing never can.',
    cue: 'Have a go — write the best word you can think of. You can change it after.',
    selfCheck: 'Never leave a blank on a paper. Put something.',
    domain: 'writing',
  },
});

/** All misconception ids. */
export const MISCONCEPTION_IDS = Object.freeze(Object.keys(MISCONCEPTIONS));

/**
 * Look up a misconception, tolerating unknown ids.
 * @param {string} id
 * @returns {Misconception|null}
 */
export function getMisconception(id) {
  return MISCONCEPTIONS[id] || null;
}

/**
 * The default misconception for a domain, used when no detector matches but
 * the answer is still wrong. Keeps every wrong answer nameable.
 * @param {string} domain
 * @returns {string} misconception id
 */
export function fallbackMisconceptionFor(domain) {
  switch (domain) {
    case 'vocab':
      return 'word-choice-context';
    case 'spelling':
      return 'spelling-slip';
    case 'comprehension':
      return 'evidence-not-checked';
    case 'writing':
      return 'structure-not-followed';
    default:
      return 'rule-not-applied';
  }
}
