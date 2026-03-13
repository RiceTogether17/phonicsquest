/**
 * PhonicsQuest – Spiral Grammar Matrix
 *
 * Defines the strand-by-level curriculum map. Each grammar strand begins early
 * in simple form and recurs with increasing difficulty every year (P1–P6).
 *
 * This is the single source of truth for what grammar is taught at each level.
 * All modes (Grammar Cloze, Sentence Forge, Editing Quest, Writing Quest) draw
 * from this matrix to ensure coherent spiral progression.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * STRAND PROGRESSION SUMMARY
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Simple Past:
 *   P1 intro (yesterday + common verbs)
 *   P2 recount (irregular verbs + short sequences)
 *   P3 paragraph consistency (time markers + mixed regular/irregular)
 *   P4 contrast with past continuous
 *   P5 complex clauses (because/although/when + past)
 *   P6 advanced tense control (past perfect, reported speech contexts)
 *
 * Subject-Verb Agreement:
 *   P1 is/am/are + basic singular/plural
 *   P2 singular/plural verbs (has/have, does/do)
 *   P3 tricky subjects (each, every, none)
 *   P4 collective nouns (the class, the team) + each/every
 *   P5 embedded phrases (the box of chocolates IS)
 *   P6 full passage control with complex subjects
 *
 * Connectors:
 *   P1 and/but/because intro
 *   P2 so/or/after/then
 *   P3 when/while/because (subordination)
 *   P4 although/if/unless
 *   P5 despite/not only…but also/even though
 *   P6 formal connectors (consequently/furthermore/nevertheless)
 *
 * Pronouns:
 *   P1 he/she/it/they/we
 *   P2 him/her/them/us + possessive (my/his/her)
 *   P3 reflexive (myself/himself/themselves)
 *   P4 relative (who/which/that)
 *   P5 indefinite (someone/anyone/everybody)
 *   P6 pronoun-antecedent in complex sentences
 *
 * Prepositions:
 *   P1 in/on/at (place)
 *   P2 to/from/with/before/after (time + movement)
 *   P3 between/among/beside/above
 *   P4 during/through/across
 *   P5 despite/in spite of/instead of
 *   P6 complex prepositional phrases in formal writing
 *
 * Tense Awareness:
 *   P1 present vs past (now/yesterday markers)
 *   P2 present continuous (-ing)
 *   P3 past continuous (was/were + -ing)
 *   P4 future tense (will/going to)
 *   P5 present perfect (has/have + past participle)
 *   P6 past perfect + tense control across long passages
 *
 * Modals:
 *   P1 can/cannot
 *   P2 may/must
 *   P3 could/should
 *   P4 should/must/may in advice & rules
 *   P5 should have/could have/might have
 *   P6 would/need not/dare not + modal precision
 *
 * Conditionals:
 *   P1 (not introduced)
 *   P2 (not introduced)
 *   P3 Type 0 (if + present → present) intro
 *   P4 Type 1 (if + present → future) consolidation
 *   P5 Type 2 (if + past → would)
 *   P6 Type 3 (if + past perfect → would have) + mixed
 *
 * Articles:
 *   P1 a/an/the basics
 *   P2 specific vs general (the vs a)
 *   P3 zero article (school/home as institution)
 *   P4 the + superlative/ordinal
 *   P5 articles in formal writing
 *   P6 article precision in complex texts
 *
 * Sentence Structure:
 *   P1 SVO basics
 *   P2 compound (S + and/but + S)
 *   P3 complex (subordinate clauses)
 *   P4 fronted adverbials
 *   P5 participial phrases
 *   P6 inversion, cleft sentences
 */

/**
 * Each strand entry describes the grammar focus at a given level.
 * @typedef {Object} StrandLevel
 * @property {string} label - Human-readable label for the strand at this level
 * @property {string} focus - What the learner should master
 * @property {string[]} keyForms - Specific grammar forms taught
 * @property {string} questionDemand - What kind of question complexity is expected
 */

/** @type {Record<string, Record<string, StrandLevel>>} */
export const SPIRAL_MATRIX = {
  simplePast: {
    P1: {
      label: 'Simple Past – Intro',
      focus: 'Notice that yesterday/last night changes the verb; use common regular and high-frequency irregular verbs',
      keyForms: ['walked', 'played', 'jumped', 'went', 'ate', 'saw', 'had'],
      questionDemand: 'Single-sentence fill-in with time marker given',
    },
    P2: {
      label: 'Simple Past – Recount',
      focus: 'Use simple past in short recounts; distinguish present vs past; handle more irregular verbs',
      keyForms: ['found', 'brought', 'gave', 'took', 'made', 'first/then/after that'],
      questionDemand: 'Short linked sentences with time sequence',
    },
    P3: {
      label: 'Simple Past – Paragraph Consistency',
      focus: 'Maintain tense consistency across a paragraph; use time markers accurately; mix regular and irregular',
      keyForms: ['rang', 'stood', 'decided', 'after/when/before'],
      questionDemand: 'Paragraph-length cloze with mixed verb forms',
    },
    P4: {
      label: 'Simple Past vs Past Continuous',
      focus: 'Contrast simple past with past continuous; use past tense in fuller narratives',
      keyForms: ['was speaking', 'dropped', 'while/when + -ing'],
      questionDemand: 'Multi-sentence passages mixing simple past and past continuous',
    },
    P5: {
      label: 'Simple Past in Complex Clauses',
      focus: 'Use simple past accurately in complex sentence structures with subordination',
      keyForms: ['because', 'although', 'when', 'after', 'before'],
      questionDemand: 'Complex sentences with multiple clauses',
    },
    P6: {
      label: 'Simple Past – Advanced Tense Control',
      focus: 'Control simple past alongside past perfect, reported speech, and advanced clause structures',
      keyForms: ['had + past participle', 'reported that', 'explained that'],
      questionDemand: 'PSLE-style passage with advanced tense shifts',
    },
  },
  svAgreement: {
    P1: {
      label: 'SVA – is/am/are',
      focus: 'Match is/am/are with correct subjects',
      keyForms: ['I am', 'He/She is', 'They are', 'It is'],
      questionDemand: 'Single sentences with clear singular/plural subjects',
    },
    P2: {
      label: 'SVA – has/have, does/do',
      focus: 'Use has/have and does/do correctly with singular and plural subjects',
      keyForms: ['She has', 'They have', 'He does', 'We do'],
      questionDemand: 'Short sentences with common noun/pronoun subjects',
    },
    P3: {
      label: 'SVA – Tricky Subjects',
      focus: 'Handle each/every/none/nobody with singular verbs',
      keyForms: ['Each pupil has', 'Every child needs', 'None of them is'],
      questionDemand: 'Sentences with tricky quantifier subjects',
    },
    P4: {
      label: 'SVA – Collective Nouns',
      focus: 'Apply SVA with collective nouns and compound subjects',
      keyForms: ['The class is', 'The team has', 'Neither...nor'],
      questionDemand: 'Passages with mixed subject types',
    },
    P5: {
      label: 'SVA – Embedded Phrases',
      focus: 'Maintain agreement when phrases separate subject from verb',
      keyForms: ['The box of chocolates is', 'The students in the hall were'],
      questionDemand: 'Sentences with intervening prepositional phrases',
    },
    P6: {
      label: 'SVA – Full Passage Control',
      focus: 'Maintain SVA accuracy across long passages with complex subjects',
      keyForms: ['compound subjects', 'relative clause subjects', 'inverted subjects'],
      questionDemand: 'PSLE-style passage requiring sustained SVA control',
    },
  },
  connectors: {
    P1: {
      label: 'Connectors – and/but/because',
      focus: 'Join ideas with basic connectors',
      keyForms: ['and', 'but', 'because'],
      questionDemand: 'Complete the sentence with a basic connector',
    },
    P2: {
      label: 'Connectors – so/or/after/then',
      focus: 'Use result and sequence connectors in short recounts',
      keyForms: ['so', 'or', 'after', 'then', 'first'],
      questionDemand: 'Short recount with sequence connectors',
    },
    P3: {
      label: 'Connectors – Subordination',
      focus: 'Use when/while/because/so to create complex sentences',
      keyForms: ['when', 'while', 'before', 'after', 'because', 'so'],
      questionDemand: 'Paragraph with subordinate clauses',
    },
    P4: {
      label: 'Connectors – although/if/unless',
      focus: 'Use concessive and conditional connectors',
      keyForms: ['although', 'if', 'unless', 'even though'],
      questionDemand: 'Passages requiring cause/result and concessive logic',
    },
    P5: {
      label: 'Connectors – Advanced Linking',
      focus: 'Use sophisticated connectors for persuasion and argument',
      keyForms: ['despite', 'not only...but also', 'even though', 'in order to'],
      questionDemand: 'Multi-sentence arguments with advanced linking',
    },
    P6: {
      label: 'Connectors – Formal Discourse',
      focus: 'Use formal connectors in report and essay writing',
      keyForms: ['consequently', 'furthermore', 'nevertheless', 'moreover', 'in conclusion'],
      questionDemand: 'PSLE-style passage with formal transitions',
    },
  },
  pronouns: {
    P1: {
      label: 'Pronouns – Subject',
      focus: 'Use he/she/it/they/we correctly',
      keyForms: ['he', 'she', 'it', 'they', 'we'],
      questionDemand: 'Replace noun with correct subject pronoun',
    },
    P2: {
      label: 'Pronouns – Object & Possessive',
      focus: 'Use him/her/them/us and my/his/her/their',
      keyForms: ['him', 'her', 'them', 'us', 'my', 'his', 'her', 'their'],
      questionDemand: 'Sentences requiring object or possessive pronouns',
    },
    P3: {
      label: 'Pronouns – Reflexive',
      focus: 'Use reflexive pronouns correctly',
      keyForms: ['myself', 'himself', 'herself', 'themselves', 'ourselves'],
      questionDemand: 'Sentences where subject and object are the same person',
    },
    P4: {
      label: 'Pronouns – Relative',
      focus: 'Use who/which/that to connect clauses',
      keyForms: ['who', 'which', 'that', 'whose'],
      questionDemand: 'Combine sentences using relative pronouns',
    },
    P5: {
      label: 'Pronouns – Indefinite',
      focus: 'Use someone/anyone/everybody/nothing correctly',
      keyForms: ['someone', 'anyone', 'everybody', 'nothing', 'no one'],
      questionDemand: 'Passages with indefinite pronoun-verb agreement',
    },
    P6: {
      label: 'Pronouns – Antecedent Clarity',
      focus: 'Ensure clear pronoun-antecedent reference in complex sentences',
      keyForms: ['pronoun reference chains', 'ambiguous it/they resolution'],
      questionDemand: 'PSLE passages requiring precise pronoun tracking',
    },
  },
  prepositions: {
    P1: {
      label: 'Prepositions – in/on/at',
      focus: 'Use basic place prepositions',
      keyForms: ['in', 'on', 'at'],
      questionDemand: 'Simple sentences about location',
    },
    P2: {
      label: 'Prepositions – Time & Movement',
      focus: 'Use to/from/with and before/after for time and movement',
      keyForms: ['to', 'from', 'with', 'before', 'after'],
      questionDemand: 'Short recounts with time and place prepositions',
    },
    P3: {
      label: 'Prepositions – Position',
      focus: 'Use between/among/beside/above/below',
      keyForms: ['between', 'among', 'beside', 'above', 'below'],
      questionDemand: 'Descriptions of spatial relationships',
    },
    P4: {
      label: 'Prepositions – through/during/across',
      focus: 'Use prepositions of movement and duration',
      keyForms: ['during', 'through', 'across', 'along', 'towards'],
      questionDemand: 'Narrative passages with movement descriptions',
    },
    P5: {
      label: 'Prepositions – Complex Phrases',
      focus: 'Use despite/in spite of/instead of/according to',
      keyForms: ['despite', 'in spite of', 'instead of', 'according to'],
      questionDemand: 'Formal sentences with multi-word prepositions',
    },
    P6: {
      label: 'Prepositions – Formal Precision',
      focus: 'Use complex prepositional phrases accurately in formal writing',
      keyForms: ['with regard to', 'in addition to', 'on behalf of'],
      questionDemand: 'PSLE-style passages requiring prepositional accuracy',
    },
  },
  tenseAwareness: {
    P1: {
      label: 'Tenses – Present vs Past',
      focus: 'Distinguish now (present) from yesterday (past)',
      keyForms: ['is/was', 'play/played', 'go/went'],
      questionDemand: 'Sentence pairs: choose present or past form',
    },
    P2: {
      label: 'Tenses – Present Continuous',
      focus: 'Use is/are + -ing for actions happening now',
      keyForms: ['is running', 'are playing', 'am eating'],
      questionDemand: 'Describe pictures using present continuous',
    },
    P3: {
      label: 'Tenses – Past Continuous',
      focus: 'Use was/were + -ing for ongoing past actions',
      keyForms: ['was reading', 'were playing', 'while...was/-ing'],
      questionDemand: 'Short narratives combining past continuous and simple past',
    },
    P4: {
      label: 'Tenses – Future',
      focus: 'Use will and going to for future actions',
      keyForms: ['will go', 'is going to rain', 'shall we'],
      questionDemand: 'Passages mixing present, past, and future',
    },
    P5: {
      label: 'Tenses – Present Perfect',
      focus: 'Use has/have + past participle for past actions with present relevance',
      keyForms: ['has eaten', 'have finished', 'since/for/already/yet'],
      questionDemand: 'Distinguish simple past from present perfect',
    },
    P6: {
      label: 'Tenses – Past Perfect & Control',
      focus: 'Use had + past participle; maintain tense control across long passages',
      keyForms: ['had already left', 'had been', 'before/after + past perfect'],
      questionDemand: 'PSLE-style passage with multiple tense shifts',
    },
  },
  modals: {
    P1: {
      label: 'Modals – can/cannot',
      focus: 'Express ability and inability',
      keyForms: ['can', 'cannot'],
      questionDemand: 'Simple sentences about what you can/cannot do',
    },
    P2: {
      label: 'Modals – may/must',
      focus: 'Express permission and obligation',
      keyForms: ['may', 'must', 'must not'],
      questionDemand: 'School rules and permission sentences',
    },
    P3: {
      label: 'Modals – could/should',
      focus: 'Express possibility and advice',
      keyForms: ['could', 'should', 'should not'],
      questionDemand: 'Advice and suggestion sentences',
    },
    P4: {
      label: 'Modals – in Rules & Advice',
      focus: 'Use should/must/may in rules, advice, and explanations',
      keyForms: ['should', 'must', 'may', 'ought to'],
      questionDemand: 'Passages about rules and responsibilities',
    },
    P5: {
      label: 'Modals – Perfect Forms',
      focus: 'Use should have/could have/might have for past regret and speculation',
      keyForms: ['should have', 'could have', 'might have', 'would have'],
      questionDemand: 'Reflective passages about past decisions',
    },
    P6: {
      label: 'Modals – Precision',
      focus: 'Use would/need not/dare not with precision in complex contexts',
      keyForms: ['would', 'need not', 'dare not', 'had better'],
      questionDemand: 'PSLE-style passages requiring precise modal choice',
    },
  },
  articles: {
    P1: {
      label: 'Articles – a/an/the basics',
      focus: 'Choose a/an by initial sound; use the for specific nouns',
      keyForms: ['a', 'an', 'the'],
      questionDemand: 'Simple sentences with clear noun contexts',
    },
    P2: {
      label: 'Articles – Specific vs General',
      focus: 'Distinguish a (general) from the (specific/mentioned before)',
      keyForms: ['a/an (first mention)', 'the (second mention)', 'the (unique)'],
      questionDemand: 'Short paragraphs requiring first/second mention logic',
    },
    P3: {
      label: 'Articles – Zero Article',
      focus: 'Know when no article is needed (school, home, breakfast)',
      keyForms: ['go to school', 'at home', 'have breakfast'],
      questionDemand: 'Sentences mixing a/an/the with zero article',
    },
    P4: {
      label: 'Articles – with Superlatives & Ordinals',
      focus: 'Use the before superlatives and ordinal numbers',
      keyForms: ['the tallest', 'the first', 'the most'],
      questionDemand: 'Passages with superlatives and ordinal contexts',
    },
    P5: {
      label: 'Articles – Formal Writing',
      focus: 'Apply article rules in formal and academic contexts',
      keyForms: ['the government', 'an opportunity', 'zero article with abstract nouns'],
      questionDemand: 'Formal passages requiring nuanced article choice',
    },
    P6: {
      label: 'Articles – Precision',
      focus: 'Maintain article accuracy across complex PSLE passages',
      keyForms: ['complex noun phrases', 'embedded clauses with articles'],
      questionDemand: 'PSLE-style passage with varied article demands',
    },
  },
  conditionals: {
    P3: {
      label: 'Conditionals – Type 0 Intro',
      focus: 'Express general truths with if + present → present',
      keyForms: ['If you heat ice, it melts', 'If it rains, we stay inside'],
      questionDemand: 'Simple if-then factual sentences',
    },
    P4: {
      label: 'Conditionals – Type 1',
      focus: 'Express likely future with if + present → will',
      keyForms: ['If it rains, we will cancel', 'If you study, you will pass'],
      questionDemand: 'Passages with real conditional situations',
    },
    P5: {
      label: 'Conditionals – Type 2',
      focus: 'Express unlikely/hypothetical with if + past → would',
      keyForms: ['If I were taller, I would play', 'If she had time, she would help'],
      questionDemand: 'Hypothetical scenarios in context',
    },
    P6: {
      label: 'Conditionals – Type 3 & Mixed',
      focus: 'Express impossible past with if + past perfect → would have; mix types',
      keyForms: ['If I had known, I would have helped', 'mixed conditional forms'],
      questionDemand: 'PSLE-style passages with conditional precision',
    },
  },
};

/**
 * All grammar strands that have entries from P1.
 * Used to verify spiral coverage at each level.
 */
export const CORE_STRANDS = [
  'simplePast',
  'svAgreement',
  'connectors',
  'pronouns',
  'prepositions',
  'tenseAwareness',
  'modals',
  'articles',
];

/**
 * Strands introduced later.
 */
export const LATER_STRANDS = [
  'conditionals', // from P3
];

/**
 * Get all strands active at a given level.
 * @param {string} level - e.g. 'P1', 'P2', ..., 'P6'
 * @returns {string[]}
 */
export function getActiveStrands(level) {
  return Object.keys(SPIRAL_MATRIX).filter(strand => level in SPIRAL_MATRIX[strand]);
}

/**
 * Get strand info for a specific level.
 * @param {string} strand
 * @param {string} level
 * @returns {StrandLevel|null}
 */
export function getStrandLevel(strand, level) {
  return SPIRAL_MATRIX[strand]?.[level] ?? null;
}
