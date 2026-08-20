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
  presentCont: {
    P1: {
      label: 'Present Continuous – Happening Now',
      focus: 'Use am/is/are + verb-ing for something happening at this moment',
      keyForms: ['is running', 'am eating', 'are playing', 'Look!', 'now'],
      questionDemand: 'Single sentence with a now-clue such as "Look!" or "at the moment"',
    },
    P2: {
      label: 'Present Continuous – Choosing the Right Be-Verb',
      focus: 'Match am/is/are to the subject; contrast with simple present habits',
      keyForms: ['I am', 'he is', 'they are', 'every day vs right now'],
      questionDemand: 'Sentence where the subject decides the be-verb',
    },
    P3: {
      label: 'Present Continuous – Spelling the -ing Form',
      focus: 'Apply -ing spelling rules: drop silent e, double the final consonant',
      keyForms: ['running', 'making', 'sitting', 'writing', 'swimming'],
      questionDemand: 'Choices differ only in the spelling of the -ing form',
    },
    P4: {
      label: 'Present Continuous vs Simple Present',
      focus: 'Choose between a habit and an action in progress from the time clue',
      keyForms: ['usually vs at the moment', 'every Monday vs today'],
      questionDemand: 'Two-clause sentence contrasting a habit with a current action',
    },
    P5: {
      label: 'Present Continuous – Arrangements and Trends',
      focus: 'Use the present continuous for fixed future arrangements and changing situations',
      keyForms: ['is meeting tomorrow', 'is getting warmer', 'are arriving on Friday'],
      questionDemand: 'Sentence where a future arrangement is signalled by context, not by "will"',
    },
    P6: {
      label: 'Present Continuous – Control in Longer Texts',
      focus: 'Keep the continuous consistent across a passage and avoid it with state verbs',
      keyForms: ['know', 'believe', 'own', 'belong', 'is being vs is'],
      questionDemand: 'Multi-sentence text requiring a judgement about state verbs',
    },
  },
  quantifiers: {
    P1: {
      label: 'Quantifiers – Some and A Lot',
      focus: 'Use simple quantity words with everyday nouns',
      keyForms: ['some', 'a lot of', 'many', 'a few'],
      questionDemand: 'Single sentence with a clearly countable or uncountable noun',
    },
    P2: {
      label: 'Quantifiers – Many and Much',
      focus: 'Choose many for things you can count and much for things you cannot',
      keyForms: ['many books', 'much water', 'how many', 'how much'],
      questionDemand: 'Sentence where the noun type decides the quantifier',
    },
    P3: {
      label: 'Quantifiers – A Few, A Little, Several',
      focus: 'Distinguish small quantities of countable and uncountable nouns',
      keyForms: ['a few', 'a little', 'several', 'plenty of'],
      questionDemand: 'Sentence with near-synonym quantifiers as distractors',
    },
    P4: {
      label: 'Quantifiers – Each, Every, Both',
      focus: 'Use quantifiers that fix the number of items and control the verb',
      keyForms: ['each of', 'every', 'both', 'either', 'neither'],
      questionDemand: 'Sentence where the quantifier also governs a singular or plural verb',
    },
    P5: {
      label: 'Quantifiers – Few vs A Few, Little vs A Little',
      focus: 'Notice how dropping "a" reverses the meaning from positive to negative',
      keyForms: ['few', 'a few', 'little', 'a little'],
      questionDemand: 'Sentence where the surrounding clause signals a positive or negative sense',
    },
    P6: {
      label: 'Quantifiers – Formal and Partitive Forms',
      focus: 'Use precise quantity expressions in formal writing',
      keyForms: ['a number of', 'the majority of', 'a great deal of', 'none of'],
      questionDemand: 'Formal sentence where the quantifier also decides verb agreement',
    },
  },
  futureTense: {
    P2: {
      label: 'Future – Will for Plans',
      focus: 'Use will + verb for what has not happened yet',
      keyForms: ['will go', 'will bring', 'tomorrow', 'next week'],
      questionDemand: 'Single sentence with an explicit future time marker',
    },
    P3: {
      label: 'Future – Will vs Going To',
      focus: 'Use going to for an intention already decided and will for a decision made now',
      keyForms: ['is going to', 'will', 'plans to', 'has decided to'],
      questionDemand: 'Sentence whose context states whether the plan was made earlier',
    },
    P4: {
      label: 'Future – Predictions and Evidence',
      focus: 'Choose going to when present evidence points to the outcome',
      keyForms: ['Look at those clouds', 'is going to rain', 'I think it will'],
      questionDemand: 'Sentence carrying visible evidence or an opinion phrase',
    },
    P5: {
      label: 'Future – Arrangements and Timetables',
      focus: 'Use the present continuous for arrangements and the simple present for timetables',
      keyForms: ['the train leaves at six', 'we are meeting at noon'],
      questionDemand: 'Sentence where a fixed schedule or arrangement is stated in the context',
    },
    P6: {
      label: 'Future – Perfect and Continuous Forms',
      focus: 'Express what will be finished or still ongoing at a future point',
      keyForms: ['will have finished', 'will be waiting', 'by the time', 'by then'],
      questionDemand: 'Complex sentence with a future reference point given by "by …"',
    },
  },
  pastCont: {
    P2: {
      label: 'Past Continuous – Was and Were',
      focus: 'Use was/were + verb-ing for an action in progress in the past',
      keyForms: ['was playing', 'were reading', 'at that time'],
      questionDemand: 'Single sentence with an in-progress past clue',
    },
    P3: {
      label: 'Past Continuous – Interrupted Actions',
      focus: 'Combine past continuous with simple past using when and while',
      keyForms: ['while … was', 'when … arrived', 'suddenly'],
      questionDemand: 'Two-clause sentence where one action interrupts another',
    },
    P4: {
      label: 'Past Continuous – Parallel Actions',
      focus: 'Show two past actions happening at the same time',
      keyForms: ['while … was … , … was', 'as', 'meanwhile'],
      questionDemand: 'Sentence with two simultaneous past actions',
    },
    P5: {
      label: 'Past Continuous – Setting the Scene',
      focus: 'Use the past continuous to open a narrative before the main event',
      keyForms: ['The rain was falling', 'was waiting when', 'had been'],
      questionDemand: 'Narrative opening where background and event must be separated',
    },
    P6: {
      label: 'Past Continuous – Control in Narrative',
      focus: 'Keep background and foreground tenses consistent across a paragraph',
      keyForms: ['was … when …', 'had been … before …', 'state verbs'],
      questionDemand: 'Multi-sentence narrative mixing past simple, continuous and perfect',
    },
  },
  countableUncountable: {
    P2: {
      label: 'Countable and Uncountable – Sorting Nouns',
      focus: 'Notice which everyday nouns can be counted and which cannot',
      keyForms: ['apples', 'water', 'rice', 'books', 'sand'],
      questionDemand: 'Single sentence naming a familiar concrete noun',
    },
    P3: {
      label: 'Countable and Uncountable – A, An and Some',
      focus: 'Use a/an with single countable nouns and some with uncountable ones',
      keyForms: ['a book', 'an egg', 'some milk', 'some bread'],
      questionDemand: 'Sentence where the noun type decides the determiner',
    },
    P4: {
      label: 'Countable and Uncountable – Measuring Words',
      focus: 'Count uncountable nouns using a container or unit',
      keyForms: ['a loaf of bread', 'a bar of soap', 'a slice of cake', 'a piece of advice'],
      questionDemand: 'Sentence requiring the correct partitive for an uncountable noun',
    },
    P5: {
      label: 'Countable and Uncountable – Nouns That Do Both',
      focus: 'Recognise nouns whose meaning changes when counted',
      keyForms: ['a paper vs paper', 'a glass vs glass', 'times vs time'],
      questionDemand: 'Sentence whose meaning reveals which sense of the noun is used',
    },
    P6: {
      label: 'Countable and Uncountable – Agreement and Formality',
      focus: 'Match verbs and quantifiers to uncountable nouns in formal writing',
      keyForms: ['news is', 'equipment was', 'much evidence', 'furniture'],
      questionDemand: 'Formal sentence where an uncountable noun controls the verb',
    },
  },
  reflexivePronouns: {
    P2: {
      label: 'Reflexive Pronouns – Myself and Yourself',
      focus: 'Use a reflexive pronoun when the doer and receiver are the same person',
      keyForms: ['myself', 'yourself', 'himself', 'herself'],
      questionDemand: 'Single sentence where the subject acts on itself',
    },
    P3: {
      label: 'Reflexive Pronouns – Matching the Subject',
      focus: 'Match the reflexive pronoun to the number and person of the subject',
      keyForms: ['itself', 'ourselves', 'yourselves', 'themselves'],
      questionDemand: 'Sentence where the subject decides the reflexive form',
    },
    P4: {
      label: 'Reflexive vs Object Pronouns',
      focus: 'Choose a reflexive only when subject and object refer to the same person',
      keyForms: ['She saw herself vs She saw her', 'taught himself'],
      questionDemand: 'Sentence where a reflexive and an object pronoun are both offered',
    },
    P5: {
      label: 'Reflexive Pronouns – For Emphasis',
      focus: 'Use a reflexive pronoun to stress who did the action',
      keyForms: ['I made it myself', 'the principal himself', 'by yourself'],
      questionDemand: 'Sentence where the reflexive adds emphasis rather than receiving the action',
    },
    P6: {
      label: 'Reflexive Pronouns – Common Misuses',
      focus: 'Avoid using a reflexive where a plain subject or object pronoun is correct',
      keyForms: ['Ravi and I (not myself)', 'between you and me', 'on my own'],
      questionDemand: 'Formal sentence where an over-used reflexive is the tempting distractor',
    },
  },
  homophones: {
    P2: {
      label: 'Homophones – Their, There and Two/Too',
      focus: 'Tell apart the commonest sound-alike words by their job in the sentence',
      keyForms: ['their', 'there', 'two', 'too', 'to'],
      questionDemand: 'Single sentence where meaning makes the choice clear',
    },
    P3: {
      label: 'Homophones – Its vs It’s, Your vs You’re',
      focus: 'Use an apostrophe only for the short form of two words, never for possession',
      keyForms: ["its", "it's", 'your', "you're"],
      questionDemand: 'Sentence where a possessive and a contraction are both offered',
    },
    P4: {
      label: 'Homophones – Whose, Who’s and Were/Where',
      focus: 'Separate question words, contractions and past-tense verbs that sound alike',
      keyForms: ['whose', "who's", 'were', 'where', "we're"],
      questionDemand: 'Sentence where the grammatical role decides the spelling',
    },
    P5: {
      label: 'Homophones – Meaning Pairs',
      focus: 'Choose between sound-alike words with completely different meanings',
      keyForms: ['practice/practise', 'past/passed', 'peace/piece', 'principal/principle'],
      questionDemand: 'Sentence whose meaning, not sound, decides the word',
    },
    P6: {
      label: 'Homophones – Formal and Confusable Pairs',
      focus: 'Use commonly confused formal word pairs accurately in writing',
      keyForms: ['affect/effect', 'complement/compliment', 'stationary/stationery', 'advice/advise'],
      questionDemand: 'Formal sentence where word class distinguishes the pair',
    },
  },
  whQuestions: {
    P1: {
      label: 'Wh- Questions – Who, What and Where',
      focus: 'Choose the question word that matches the kind of answer wanted',
      keyForms: ['who', 'what', 'where'],
      questionDemand: 'Short question whose answer type is obvious from context',
    },
    P2: {
      label: 'Wh- Questions – When, Why and How',
      focus: 'Ask about time, reason and manner',
      keyForms: ['when', 'why', 'how', 'because'],
      questionDemand: 'Question paired with a reply that reveals the answer type',
    },
    P3: {
      label: 'Wh- Questions – Which, Whose and How Many',
      focus: 'Ask about selection, ownership and quantity',
      keyForms: ['which', 'whose', 'how many', 'how much'],
      questionDemand: 'Question where a stated set or owner decides the question word',
    },
    P4: {
      label: 'Wh- Questions – Word Order and Auxiliaries',
      focus: 'Build questions with the auxiliary in the right place',
      keyForms: ['Did she …?', 'Has he …?', 'Where did they go?'],
      questionDemand: 'Question where the auxiliary and subject must be ordered correctly',
    },
    P5: {
      label: 'Wh- Questions – Embedded Questions',
      focus: 'Keep statement word order inside an embedded question',
      keyForms: ['I wonder where she went', 'Can you tell me what time it is'],
      questionDemand: 'Sentence where the tempting distractor keeps question word order',
    },
    P6: {
      label: 'Wh- Questions – Formal and Indirect Forms',
      focus: 'Ask politely and indirectly in formal contexts',
      keyForms: ['Could you explain why …', 'I should like to know whether …'],
      questionDemand: 'Formal request where directness and register are being tested',
    },
  },
  possessives: {
    P1: {
      label: 'Possessives – My, Your and His',
      focus: 'Show who something belongs to with a possessive adjective',
      keyForms: ['my', 'your', 'his', 'her', 'our'],
      questionDemand: 'Single sentence with a possessive before a noun',
    },
    P2: {
      label: 'Possessives – Apostrophe s',
      focus: 'Add ’s to a person or animal to show ownership',
      keyForms: ["Ravi's bag", "the dog's bowl", 'my sister’s book'],
      questionDemand: 'Sentence where a name takes the possessive form',
    },
    P3: {
      label: 'Possessives – Plural Owners',
      focus: 'Place the apostrophe after the s for plural owners',
      keyForms: ["the boys' bags", "the children's toys", "the teachers' room"],
      questionDemand: 'Sentence where the number of owners decides the apostrophe',
    },
    P4: {
      label: 'Possessives – Adjectives vs Pronouns',
      focus: 'Use a possessive pronoun alone and a possessive adjective before a noun',
      keyForms: ['mine', 'yours', 'hers', 'theirs', 'its'],
      questionDemand: 'Sentence where a noun follows the gap, or nothing does',
    },
    P5: {
      label: 'Possessives – Of-phrases and Doubles',
      focus: 'Choose between ’s and an of-phrase, and use the double possessive',
      keyForms: ['the roof of the house', 'a friend of mine'],
      questionDemand: 'Sentence where an of-phrase reads more naturally than ’s',
    },
    P6: {
      label: 'Possessives – Formal Accuracy',
      focus: 'Punctuate possessives correctly, including irregular and joint ownership',
      keyForms: ["James's book", "women's rights", "Mei and Ravi's project"],
      questionDemand: 'Formal sentence testing apostrophe placement on tricky nouns',
    },
  },
  conjunctions: {
    P3: {
      label: 'Conjunctions – Joining with And, But, Or',
      focus: 'Join two ideas with the coordinating word the meaning calls for',
      keyForms: ['and', 'but', 'or', 'so'],
      questionDemand: 'Two clauses whose relationship is plain from meaning',
    },
    P4: {
      label: 'Conjunctions – Because, Although, If',
      focus: 'Use subordinating conjunctions to show reason, contrast and condition',
      keyForms: ['because', 'although', 'if', 'unless', 'while'],
      questionDemand: 'Complex sentence whose two clauses stand in a stated relationship',
    },
    P5: {
      label: 'Conjunctions – Paired and Correlative Forms',
      focus: 'Complete paired conjunctions and keep both halves parallel',
      keyForms: ['not only … but also', 'either … or', 'neither … nor', 'both … and'],
      questionDemand: 'Sentence where the first half of a pair fixes the second',
    },
    P6: {
      label: 'Conjunctions – Formal Linking and Punctuation',
      focus: 'Link clauses formally and avoid doubling a conjunction with a connector',
      keyForms: ['whereas', 'in order that', 'provided that', 'although (not "although … but")'],
      questionDemand: 'Formal sentence where a doubled linker is the tempting distractor',
    },
  },
  comparatives: {
    P3: {
      label: 'Comparatives – Adding -er',
      focus: 'Compare two things by adding -er to a short adjective',
      keyForms: ['taller', 'faster', 'lighter', 'than'],
      questionDemand: 'Sentence comparing exactly two things, with "than" present',
    },
    P4: {
      label: 'Comparatives – More and Spelling Changes',
      focus: 'Use more with long adjectives and apply -y → -ier spelling',
      keyForms: ['more careful', 'easier', 'heavier', 'more interesting'],
      questionDemand: 'Sentence where adjective length or spelling decides the form',
    },
    P5: {
      label: 'Comparatives – Irregular and Equal Comparison',
      focus: 'Use irregular comparatives and as … as for equal comparison',
      keyForms: ['better', 'worse', 'farther', 'as tall as', 'not as … as'],
      questionDemand: 'Sentence where the comparison may be equal rather than unequal',
    },
    P6: {
      label: 'Comparatives – Precision and Common Errors',
      focus: 'Compare like with like and avoid double comparatives',
      keyForms: ['far more', 'much better', 'that of', 'those of'],
      questionDemand: 'Formal sentence where a double comparative or mismatched comparison tempts',
    },
  },
  superlatives: {
    P3: {
      label: 'Superlatives – Adding -est',
      focus: 'Pick out one from three or more using the -est form',
      keyForms: ['tallest', 'fastest', 'the', 'of all'],
      questionDemand: 'Sentence naming three or more things',
    },
    P4: {
      label: 'Superlatives – Most and The',
      focus: 'Use the most with long adjectives and remember the definite article',
      keyForms: ['the most careful', 'the busiest', 'the happiest'],
      questionDemand: 'Sentence where adjective length decides -est or "most"',
    },
    P5: {
      label: 'Superlatives – Irregular Forms and Range',
      focus: 'Use irregular superlatives and state the group being compared',
      keyForms: ['best', 'worst', 'furthest', 'in the class', 'I have ever'],
      questionDemand: 'Sentence where the group or time range is stated',
    },
    P6: {
      label: 'Superlatives vs Comparatives – Choosing Correctly',
      focus: 'Decide from the number being compared whether to use a comparative or superlative',
      keyForms: ['the better of the two', 'the best of the three', 'one of the finest'],
      questionDemand: 'Sentence where the stated number of items decides the form',
    },
  },
  tagQuestions: {
    P3: {
      label: 'Question Tags – Reversing the Polarity',
      focus: 'Add a negative tag to a positive statement and the reverse',
      keyForms: ["isn't it", 'is it', "aren't they", 'are they'],
      questionDemand: 'Simple statement whose tag must flip positive to negative',
    },
    P4: {
      label: 'Question Tags – Matching the Auxiliary',
      focus: 'Repeat the auxiliary of the statement in the tag',
      keyForms: ["hasn't he", "didn't she", "won't they", "can't we"],
      questionDemand: 'Statement whose auxiliary must reappear in the tag',
    },
    P5: {
      label: 'Question Tags – Do-support and Pronouns',
      focus: 'Supply do/does/did when the statement has no auxiliary, and match the pronoun',
      keyForms: ["doesn't he", "didn't they", 'Mei → she', 'the boys → they'],
      questionDemand: 'Statement with a full noun subject and no auxiliary',
    },
    P6: {
      label: 'Question Tags – Special Cases',
      focus: 'Handle imperatives, "let’s", "I am" and negative words in the statement',
      keyForms: ["will you", "shall we", "aren't I", 'nobody … do they'],
      questionDemand: 'Statement of an irregular type whose tag breaks the usual pattern',
    },
  },
  compoundIndefinite: {
    P3: {
      label: 'Indefinite Pronouns – Someone and Something',
      focus: 'Use compound pronouns for an unnamed person or thing',
      keyForms: ['someone', 'something', 'somewhere', 'anyone'],
      questionDemand: 'Sentence where the person or thing is deliberately unnamed',
    },
    P4: {
      label: 'Indefinite Pronouns – Some, Any and No',
      focus: 'Choose some- for statements, any- for questions and negatives, no- for absence',
      keyForms: ['anything', 'nothing', 'anybody', 'nobody'],
      questionDemand: 'Sentence whose positive, negative or question form decides the prefix',
    },
    P5: {
      label: 'Indefinite Pronouns – Singular Agreement',
      focus: 'Treat everyone, nobody and everything as singular',
      keyForms: ['Everyone is', 'Nobody was', 'Everything has'],
      questionDemand: 'Sentence where the indefinite pronoun governs the verb',
    },
    P6: {
      label: 'Indefinite Pronouns – Reference and Register',
      focus: 'Refer back to indefinite pronouns consistently in formal writing',
      keyForms: ['everyone … their', 'no one … his or her', 'each of them'],
      questionDemand: 'Formal sentence where the follow-on pronoun must agree',
    },
  },
  presentPerfect: {
    P3: {
      label: 'Present Perfect – Have and Has',
      focus: 'Use have/has + past participle for something already done',
      keyForms: ['has finished', 'have eaten', 'already', 'just'],
      questionDemand: 'Sentence with "already" or "just" as the aspect clue',
    },
    P4: {
      label: 'Present Perfect – Since and For',
      focus: 'Show how long something has been going on',
      keyForms: ['since 2019', 'for three years', 'has lived', 'have known'],
      questionDemand: 'Sentence stating a starting point or a duration',
    },
    P5: {
      label: 'Present Perfect vs Simple Past',
      focus: 'Choose the simple past when the time is finished and named',
      keyForms: ['yesterday → went', 'ever', 'never', 'so far'],
      questionDemand: 'Sentence where a finished time expression rules out the perfect',
    },
    P6: {
      label: 'Present Perfect – Continuous and Formal Use',
      focus: 'Contrast a completed result with an ongoing activity',
      keyForms: ['has been raining', 'has painted vs has been painting', 'recently'],
      questionDemand: 'Sentence where result and duration must be told apart',
    },
  },
  adjAdverbs: {
    P3: {
      label: 'Adjectives and Adverbs – Adding -ly',
      focus: 'Describe a noun with an adjective and an action with an adverb',
      keyForms: ['quick → quickly', 'careful → carefully', 'loud → loudly'],
      questionDemand: 'Sentence where the gap follows either a noun or a verb',
    },
    P4: {
      label: 'Adjectives and Adverbs – Irregular Forms',
      focus: 'Use adverbs that do not simply add -ly',
      keyForms: ['good → well', 'fast', 'hard', 'late', 'early'],
      questionDemand: 'Sentence where the adverb form is irregular',
    },
    P5: {
      label: 'Adjectives and Adverbs – After Linking Verbs',
      focus: 'Use an adjective, not an adverb, after be, seem, feel, taste and look',
      keyForms: ['tastes good', 'feels bad', 'seems careful', 'looks tired'],
      questionDemand: 'Sentence whose verb is a linking verb rather than an action verb',
    },
    P6: {
      label: 'Adjectives and Adverbs – Placement and Order',
      focus: 'Place adverbs precisely and order multiple adjectives conventionally',
      keyForms: ['only', 'even', 'a large old wooden box', 'hardly ever'],
      questionDemand: 'Sentence where adverb position or adjective order changes the meaning',
    },
  },
  auxiliaries: {
    P3: {
      label: 'Auxiliaries – Do, Does and Did',
      focus: 'Use do-support to make questions and negatives',
      keyForms: ['do not', 'does not', 'did not', 'Do you …?'],
      questionDemand: 'Question or negative needing the right form of "do"',
    },
    P4: {
      label: 'Auxiliaries – Be and Have as Helpers',
      focus: 'Match the helping verb to the tense being built',
      keyForms: ['is playing', 'has gone', 'was written', 'have been'],
      questionDemand: 'Sentence where the following verb form fixes the auxiliary',
    },
    P5: {
      label: 'Auxiliaries – Agreement and Short Answers',
      focus: 'Keep the auxiliary in step with the subject and reuse it in short replies',
      keyForms: ['Yes, she has', 'No, they did not', 'so do I', 'neither have I'],
      questionDemand: 'Exchange where a reply must reuse the right auxiliary',
    },
    P6: {
      label: 'Auxiliaries – Ellipsis and Emphasis',
      focus: 'Use auxiliaries to avoid repetition and to add emphasis',
      keyForms: ['I do hope', 'she did say', 'more than he does', 'as have many others'],
      questionDemand: 'Formal sentence where the auxiliary stands for an omitted verb phrase',
    },
  },
  wordForms: {
    P3: {
      label: 'Word Forms – Nouns from Verbs',
      focus: 'Change a verb into the noun the sentence slot needs',
      keyForms: ['decide → decision', 'act → action', 'enjoy → enjoyment'],
      questionDemand: 'Sentence whose gap follows an article or adjective',
    },
    P4: {
      label: 'Word Forms – Adjectives and Adverbs',
      focus: 'Build adjectives and adverbs with common suffixes',
      keyForms: ['-ful', '-less', '-ous', '-ly', 'care → careful → carefully'],
      questionDemand: 'Sentence where the neighbouring word class fixes the suffix',
    },
    P5: {
      label: 'Word Forms – Prefixes and Opposites',
      focus: 'Use prefixes to reverse or qualify a meaning',
      keyForms: ['un-', 'dis-', 'in-', 'mis-', 'over-', 're-'],
      questionDemand: 'Sentence whose meaning calls for a negated or repeated sense',
    },
    P6: {
      label: 'Word Forms – Whole Families in Formal Writing',
      focus: 'Select the right member of a word family for a formal slot',
      keyForms: ['analyse/analysis/analytical', 'succeed/success/successful'],
      questionDemand: 'Formal sentence where several members of one family are offered',
    },
  },
  pastPerfect: {
    P4: {
      label: 'Past Perfect – The Earlier Past',
      focus: 'Use had + past participle for the earlier of two past events',
      keyForms: ['had finished', 'had left', 'before', 'by the time'],
      questionDemand: 'Two past events whose order is signalled by before or by the time',
    },
    P5: {
      label: 'Past Perfect – Sequencing a Narrative',
      focus: 'Keep the order of past events clear across several sentences',
      keyForms: ['had already', 'after … had', 'when … had'],
      questionDemand: 'Multi-sentence narrative whose events are out of chronological order',
    },
    P6: {
      label: 'Past Perfect – Reported Speech and Regret',
      focus: 'Use the past perfect in reported speech and unreal past conditions',
      keyForms: ['said that she had', 'if I had known', 'wished he had'],
      questionDemand: 'Reported or hypothetical sentence needing a backshifted verb',
    },
  },
  perfectContinuousTenses: {
    P4: {
      label: 'Perfect Continuous – Have Been Doing',
      focus: 'Show an activity that started earlier and is still going on',
      keyForms: ['has been waiting', 'have been studying', 'for', 'since'],
      questionDemand: 'Sentence stating a duration up to now',
    },
    P5: {
      label: 'Perfect Continuous – Past and Cause',
      focus: 'Use had been + -ing to explain a past result',
      keyForms: ['had been running', 'that was why', 'because he had been'],
      questionDemand: 'Sentence where an earlier ongoing activity explains a past state',
    },
    P6: {
      label: 'Perfect Continuous – Choosing Between Aspects',
      focus: 'Decide between a completed result and a continuing activity',
      keyForms: ['has read vs has been reading', 'will have been working'],
      questionDemand: 'Sentence where result and duration are both plausible until the clue is weighed',
    },
  },
  gerundInfinitive: {
    P4: {
      label: 'Gerunds and Infinitives – After Common Verbs',
      focus: 'Learn which verbs take -ing and which take to + verb',
      keyForms: ['enjoy reading', 'want to go', 'finish writing', 'decide to stay'],
      questionDemand: 'Sentence whose main verb fixes the following form',
    },
    P5: {
      label: 'Gerunds and Infinitives – After Prepositions',
      focus: 'Use the -ing form after a preposition',
      keyForms: ['good at swimming', 'instead of going', 'look forward to seeing'],
      questionDemand: 'Sentence where a preposition immediately precedes the gap',
    },
    P6: {
      label: 'Gerunds and Infinitives – Meaning Changes',
      focus: 'Notice verbs whose meaning shifts with the form that follows',
      keyForms: ['stopped smoking vs stopped to smoke', 'remember doing vs remember to do'],
      questionDemand: 'Sentence whose context decides which of two real meanings is intended',
    },
  },
  passiveVoice: {
    P5: {
      label: 'Passive Voice – Forming the Passive',
      focus: 'Build the passive with be + past participle and name the doer with by',
      keyForms: ['was written', 'is cleaned', 'were returned', 'by the pupils'],
      questionDemand: 'Sentence where the subject receives rather than performs the action',
    },
    P6: {
      label: 'Passive Voice – Tense Control and Purpose',
      focus: 'Keep the passive in the right tense and choose it when the doer is unknown or unimportant',
      keyForms: ['has been repaired', 'will be announced', 'is being built'],
      questionDemand: 'Formal sentence where the tense of the passive must match the context',
    },
  },
  relativeClauses: {
    P5: {
      label: 'Relative Clauses – Who, Which and That',
      focus: 'Add information with the relative pronoun the noun calls for',
      keyForms: ['who', 'which', 'that', 'whose'],
      questionDemand: 'Sentence where the noun decides between a person and a thing',
    },
    P6: {
      label: 'Relative Clauses – Whom, Commas and Reduction',
      focus: 'Use whom as an object, punctuate non-defining clauses, and reduce where natural',
      keyForms: ['with whom', 'the girl, who …,', 'the book written by'],
      questionDemand: 'Formal sentence where the clause is defining or non-defining',
    },
  },
  reportedSpeech: {
    P5: {
      label: 'Reported Speech – Backshifting Tense',
      focus: 'Move the verb one step back when reporting what someone said',
      keyForms: ['said that he was', 'told me she had', 'is → was'],
      questionDemand: 'Direct speech to be reported, with the tense shifting back',
    },
    P6: {
      label: 'Reported Speech – Pronouns, Time and Questions',
      focus: 'Adjust pronouns and time words, and keep statement order in reported questions',
      keyForms: ['tomorrow → the next day', 'here → there', 'asked whether'],
      questionDemand: 'Reported question or command needing several coordinated changes',
    },
  },
  mixedGrammar: {
    P5: {
      label: 'Mixed Grammar – Combining Rules',
      focus: 'Apply several grammar rules at once, as an examination question does',
      keyForms: ['tense + agreement', 'pronoun + preposition', 'article + noun type'],
      questionDemand: 'Sentence where more than one rule must hold at the same time',
    },
    P6: {
      label: 'Mixed Grammar – Examination Control',
      focus: 'Weigh every clue in the sentence before choosing, under exam conditions',
      keyForms: ['time markers', 'true subject', 'register', 'parallel structure'],
      questionDemand: 'Multi-clause sentence where the deciding clue is not adjacent to the gap',
    },
  },
  inversion: {
    P6: {
      label: 'Inversion – After Negative Openers',
      focus: 'Invert the subject and auxiliary after a fronted negative or restrictive phrase',
      keyForms: ['Seldom had', 'Not only did', 'Hardly had', 'Under no circumstances should'],
      questionDemand: 'Formal sentence opening with a negative or restrictive adverbial',
    },
  },
  demonstratives: {
    P1: {
      label: 'Demonstratives – This and That',
      focus: 'Use this for something near and that for something further away',
      keyForms: ['this', 'that', 'here', 'there'],
      questionDemand: 'Single sentence with a clear near or far clue',
    },
    P2: {
      label: 'Demonstratives – These and Those',
      focus: 'Match the demonstrative to a singular or plural noun',
      keyForms: ['these books', 'those trees', 'this pencil', 'that bag'],
      questionDemand: 'Sentence where the noun number decides the demonstrative',
    },
    P3: {
      label: 'Demonstratives – Distance and Number Together',
      focus: 'Choose on both distance and number at once',
      keyForms: ['this/these (near)', 'that/those (far)', 'over there'],
      questionDemand: 'Sentence carrying both a distance clue and a plural noun',
    },
    P4: {
      label: 'Demonstratives – Referring Back in a Text',
      focus: 'Use a demonstrative to point back to something already mentioned',
      keyForms: ['This is why', 'That explains', 'these reasons'],
      questionDemand: 'Two-sentence text where the demonstrative refers to the earlier idea',
    },
    P5: {
      label: 'Demonstratives – Cohesion in Writing',
      focus: 'Keep references clear so the reader knows what "this" points to',
      keyForms: ['this problem', 'these findings', 'those of'],
      questionDemand: 'Passage where a bare demonstrative would be ambiguous',
    },
    P6: {
      label: 'Demonstratives – Formal Substitution',
      focus: 'Use that of and those of to compare without repeating a noun',
      keyForms: ['that of', 'those of', 'the former', 'the latter'],
      questionDemand: 'Formal comparison where a noun is replaced rather than repeated',
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
