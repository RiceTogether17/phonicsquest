/**
 * PhonicsQuest – Grammar Tips
 *
 * Short, child-friendly explanations for each grammar category.
 * Used by the teach-back loop in Cloze Castle: when a learner gets a
 * cloze blank wrong, the tip for that category is shown before the retry.
 *
 * Each entry:
 *   rule    – the core rule in one clear sentence
 *   example – a concrete model sentence
 *   tip     – a remembering strategy (optional but recommended)
 */

export const GRAMMAR_TIPS = {
  articles: {
    rule: 'Use "a" before consonant sounds and "an" before vowel sounds.',
    example: '"a cat" — "a house" — "an egg" — "an umbrella"',
    tip: 'Say the word out loud. Does it start with a vowel sound (a, e, i, o, u)? Then use "an".',
  },
  pronouns: {
    rule: 'A pronoun replaces a noun. Use "he/she/it" for one person or thing, "they" for more than one.',
    example: '"Tom is kind. He helps his friends." — "The dogs are loud. They bark a lot."',
    tip: 'Ask: who is the sentence about? If it\'s one person, use he/she. If it\'s many, use they.',
  },
  svAgreement: {
    rule: 'When the subject is one person or thing (he, she, it), the verb usually ends in -s.',
    example: '"She runs fast." — "They run fast." — "It looks nice."',
    tip: 'Swap the subject for he/she/it. If that works, add -s to the verb.',
  },
  simplePast: {
    rule: 'Simple past describes something that already happened. Regular verbs add -ed; irregular verbs change.',
    example: '"He walked to school." — "She ate breakfast." — "They played football."',
    tip: 'Think: did this happen before? Then use the past form of the verb.',
  },
  presentCont: {
    rule: 'Present continuous describes something happening right now. Use am/is/are + verb-ing.',
    example: '"She is running." — "They are playing." — "I am reading."',
    tip: 'Is it happening NOW? Use is/are + the verb with -ing at the end.',
  },
  pastCont: {
    rule: 'Past continuous describes something that was in progress at a past time. Use was/were + verb-ing.',
    example: '"He was sleeping when the phone rang." — "They were playing outside."',
    tip: 'Was it ongoing at a past moment? Use was (one person) or were (more than one) + verb-ing.',
  },
  perfectContinuousTenses: {
    rule: 'Perfect continuous tenses show ongoing actions linked to a specific time. Use has/have/had been + verb-ing.',
    example: '"She has been studying for two hours." — "They had been waiting a long time."',
    tip: 'How long has something been going on? Use has/have been + verb-ing.',
  },
  futureTense: {
    rule: 'Future tense describes something that will happen. Use will + base verb.',
    example: '"He will come tomorrow." — "We will go to the park."',
    tip: 'Not happened yet? Use "will" before the main verb.',
  },
  prepositions: {
    rule: 'Prepositions show location, time, or direction: in, on, at, under, between, behind.',
    example: '"The cat is on the mat." — "We meet at three o\'clock." — "She is in the room."',
    tip: 'Think of the picture the sentence is painting. Where or when is it?',
  },
  connectors: {
    rule: 'Connectors link ideas. "And" adds, "but" contrasts, "so" shows result, "because" gives reason.',
    example: '"She was tired, so she slept early." — "He tried hard but could not finish."',
    tip: 'What is the relationship between the two ideas? Adding? Contrasting? Explaining why?',
  },
  conjunctions: {
    rule: 'Conjunctions join words or sentences. Common ones: and, but, or, because, although, while.',
    example: '"He likes cats and dogs." — "She stayed home because it was raining."',
    tip: 'Look at what comes before and after the blank. Which joining word fits the meaning?',
  },
  modals: {
    rule: 'Modal verbs (can, could, should, must, may, might, will, would) show ability, permission, or obligation.',
    example: '"You must wash your hands." — "She can swim." — "We should be kind."',
    tip: 'Ask: is it possible, needed, or allowed? That tells you which modal to use.',
  },
  comparatives: {
    rule: 'Comparatives compare two things. Short words: add -er. Long words: use more.',
    example: '"He is taller than his brother." — "This bag is more expensive than that one."',
    tip: 'Comparing two things? Short word → add -er. Long word → use "more" before it.',
  },
  quantifiers: {
    rule: 'Quantifiers show how many or how much: many, much, few, little, some, any, a lot of.',
    example: '"There are many stars." — "She doesn\'t have much time." — "A few children came."',
    tip: 'Countable nouns (cats, books) → many/few. Uncountable nouns (water, time) → much/little.',
  },
  tenseAwareness: {
    rule: 'Match the verb tense to the time signal in the sentence (yesterday → past; tomorrow → future; now → present).',
    example: '"Yesterday, she walked to school." — "Tomorrow, we will visit the library."',
    tip: 'Find the time word in the sentence. It tells you which tense to use.',
  },
  passiveVoice: {
    rule: 'Passive voice focuses on what is done, not who does it. Use was/were/is/are + past participle.',
    example: '"The cake was made by Mum." — "The windows are cleaned every week."',
    tip: 'Is the subject receiving the action? Use was/were + the verb\'s past participle form.',
  },
  conditionals: {
    rule: 'Conditionals describe "if" situations. Type 1: if + present tense → will. Type 2: if + past → would.',
    example: '"If it rains, we will stay inside." — "If I were rich, I would travel the world."',
    tip: 'Is the situation real and possible? Use will. Is it imaginary? Use would.',
  },
  reportedSpeech: {
    rule: 'Reported speech shifts the tense back. "I am tired" → He said he was tired.',
    example: '"She said that she would come." — "He told me he had finished the work."',
    tip: 'When reporting past speech, move the tense one step back: is → was, will → would.',
  },
  relativeClauses: {
    rule: 'Relative clauses add information using who (people), which/that (things), whose (possession).',
    example: '"The girl who won the prize is my friend." — "The book that I read was great."',
    tip: 'Is the clause about a person? Use "who". About a thing? Use "which" or "that".',
  },
};

/**
 * Get a tip object for a grammar category key.
 * Returns a generic fallback if the category is not found.
 * @param {string} categoryKey
 * @returns {{ rule: string, example: string, tip?: string }}
 */
export function getGrammarTip(categoryKey) {
  return GRAMMAR_TIPS[categoryKey] ?? {
    rule: 'Read the sentence carefully and look for clues about which word fits best.',
    example: 'Think about what makes sense grammatically and in meaning.',
  };
}
