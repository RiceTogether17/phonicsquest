/**
 * PhonicsQuest – Primary 5 Practice Test Papers
 *
 * Four full school-style P5 English practice papers (Term 1–4).
 * These mirror the Singapore P5 Continual Assessment / Semestral
 * Assessment format used by mainstream primary schools.
 *
 * Section breakdown per paper (total 85 marks, 1 h 30 min):
 *   Section A — Grammar MCQ            10 items  10 marks
 *   Section B — Vocabulary MCQ          5 items   5 marks
 *   Section C — Grammar Cloze          10 blanks 10 marks
 *   Section D — Vocabulary Cloze       10 blanks 10 marks
 *   Section E — Situational Writing              15 marks  (self-assessed)
 *   Section F — Synthesis & Transformation 5 items 10 marks
 *   Section G — Comprehension Cloze    10 blanks 10 marks  (open, no word bank)
 *   Section H — Comprehension          1 passage 15 marks
 *                                               ─────────
 *                                                   85
 *
 * New section shapes introduced at P5 (not present in P1–P3):
 *
 *   sectionE — Situational Writing
 *     { title, marks, instructions, format, purpose, audience, context,
 *       bullets: [3], wordCount, modelAnswer,
 *       rubric: { taskFulfillment, language, organisation } }
 *
 *   sectionF — Synthesis & Transformation
 *     { title, marks, instructions,
 *       items: [{ q, stem, answer, alternates: [], skill, explain }] }
 *
 *   sectionG — Comprehension Cloze (open, no word bank)
 *     { title, marks, instructions,
 *       text: '...{{1}}...{{10}}...',
 *       answers: [10], accept: [[alts], ...], skill }
 *
 *   sectionH — Comprehension (passage + questions)
 *     { title, marks, passage, questions: [...] }
 *
 * Topic rotation:
 *   T1 — nature / environment, grammar-heavy
 *   T2 — school life / community, vocabulary-heavy
 *   T3 — history / heritage, synthesis-heavy
 *   T4 — technology / sports, balanced review
 */

import { checkMcqItems, checkSectionMarks } from './practiceTestValidators.js';

export const P5_PRACTICE_TEST_TERMS = Object.freeze(['T1', 'T2', 'T3', 'T4']);

export const P5_PRACTICE_TESTS = Object.freeze({

  /* ══════════════════════════════════════════════════════════════════
     TERM 1  —  Nature & Environment  (grammar-heavy)
  ══════════════════════════════════════════════════════════════════ */
  T1: {
    id: 'p5-test-term-1',
    term: 'T1',
    level: 'P5',
    label: 'Term 1 Practice Test (Grammar Focus)',
    duration: '1 h 30 min',
    totalMarks: 85,
    blurb: 'P5 Term 1 paper — passive voice with modals, Type 1 & 2 conditionals, relative clauses, reported speech commands. Situational Writing: Email. Comprehension: rainforest biodiversity.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      items: [
        {
          q: 'All rubbish ___ of in the designated bins before you leave the campsite.',
          choices: ['must dispose', 'must be disposed', 'should dispose', 'should disposing'],
          answer: 'must be disposed',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: 'Passive voice with modal: "must be disposed of" — the subject (rubbish) receives the action; "dispose" takes the preposition "of".',
        },
        {
          q: 'If the weather ___ fine tomorrow, we ___ our nature walk as planned.',
          choices: ['is / will continue', 'is / would continue', 'were / will continue', 'were / would continue'],
          answer: 'is / will continue',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional (real/possible future): if + simple present → will + base verb.',
        },
        {
          q: 'The teacher asked the students ___ their projects by Friday without fail.',
          choices: ['submit', 'to submit', 'submitting', 'had submitted'],
          answer: 'to submit',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'Reported command: "told/asked + object + to-infinitive".',
        },
        {
          q: 'The scientist ___ the rare orchid discovered in the nature reserve.',
          choices: ['whom studied', 'which studied', 'who studied', 'whose studied'],
          answer: 'who studied',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Who" introduces a relative clause for people; "which" is for things.',
        },
        {
          q: 'The number of endangered species in Singapore ___ declining rapidly.',
          choices: ['are', 'have been', 'is', 'were'],
          answer: 'is',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: '"The number of + plural noun" takes a singular verb.',
        },
        {
          q: 'Sarah recalled ___ the butterflies flutter across the meadow when she was young.',
          choices: ['watch', 'to watch', 'watching', 'watched'],
          answer: 'watching',
          skill: 'mixedGrammar',
          practiseTarget: 'grammar-mcq',
          explain: '"Recall + gerund (verb-ing)" — not the to-infinitive.',
        },
        {
          q: '___ finished her field research, Dr Lim compiled her findings.',
          choices: ['Have', 'Having', 'She had', 'After she'],
          answer: 'Having',
          skill: 'mixedGrammar',
          practiseTarget: 'grammar-mcq',
          explain: '"Having + past participle" forms a perfect participial phrase showing a completed action before the main verb.',
        },
        {
          q: 'The river ___ have been polluted by the chemical plant — the water is too clear to cause concern.',
          choices: ['could', 'must', 'should', 'cannot'],
          answer: 'cannot',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Cannot have + past participle" expresses deduction that something did NOT happen.',
        },
        {
          q: 'The more trees ___ in the city, the ___ the air quality becomes.',
          choices: ['planted / better', 'are planted / better', 'planting / good', 'are planted / good'],
          answer: 'are planted / better',
          skill: 'comparatives',
          practiseTarget: 'grammar-mcq',
          explain: '"The more ... the + comparative" is a double-comparative structure.',
        },
        {
          q: 'Either the curator ___ the trustees ___ required to sign off on any purchase above ten thousand dollars.',
          choices: ['or / is', 'or / are', 'nor / is', 'and / are'],
          answer: 'or / are',
          skill: 'conjunctions',
          practiseTarget: 'grammar-mcq',
          explain: '"Either ... or" — the verb agrees with the subject closer to it ("the trustees" is plural and closest), so the verb is "are".',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'After years of bitter rivalry, the two companies finally ___ their differences and signed a joint partnership agreement.',
          choices: ['sorted out', 'buried', 'burned', 'settled'],
          answer: 'buried',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Bury the hatchet" means to end a quarrel and make peace.',
        },
        {
          q: 'Her colleagues noticed that Amanda was stressed, but her cheerful smile was ___ — it was actually a sign that she was coping well.',
          choices: ['a blessing in disguise', 'the last straw', 'a piece of cake', 'a silver lining'],
          answer: 'a silver lining',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"A silver lining" — a positive or hopeful aspect of an otherwise difficult situation. Her cheerful smile was the encouraging sign within a stressful period.',
        },
        {
          q: 'The loss of the rainforest is not just an environmental disaster — it is a ___ wound on the planet\'s ecological system.',
          choices: ['physical', 'theoretical', 'metaphorical', 'literal'],
          answer: 'metaphorical',
          skill: 'similes',
          practiseTarget: 'vocab-mcq',
          explain: '"A wound on the ecological system" is metaphorical — not a literal wound.',
        },
        {
          q: 'The government pledged to ___ a major campaign to protect coastal wetlands before the end of the year.',
          choices: ['launch', 'mount', 'raise', 'lift'],
          answer: 'mount',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Mount a campaign" is the standard collocation for organising a sustained effort.',
        },
        {
          q: 'The words "happy" and "content" are near-synonyms, but "content" implies a deeper sense of ___ rather than excitement.',
          choices: ['joy', 'satisfaction', 'pleasure', 'delight'],
          answer: 'satisfaction',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Content" suggests quiet satisfaction, not the active excitement of joy or delight.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word from the word bank. Each word may be used only once. Two words will be left over.',
      wordBank: ['although', 'has', 'been', 'which', 'were', 'being', 'unless', 'their', 'as', 'more', 'whose', 'despite'],
      text:
        'The mangrove forests of Singapore {{1}} long recognised as one of the most ecologically significant habitats on the island. ' +
        'These forests, {{2}} roots form a dense network above the mud, protect coastal areas from erosion and storm surges. ' +
        'For decades, large stretches of mangrove land {{3}} cleared to make way for development. ' +
        '{{4}} their small size, Singapore\'s remaining mangrove patches support an astonishing variety of wildlife. ' +
        'Migratory birds use these forests {{5}} stopover points during their long journeys across Asia. ' +
        'Researchers warn that {{6}} immediate conservation steps are taken, several mangrove-dependent species may disappear within a generation. ' +
        'The situation is {{7}} urgent today than it was twenty years ago. ' +
        'Young people are now encouraged to get involved, {{8}} {{9}} role as marine stewards allows them to help replant and monitor the forests. ' +
        'Conservation groups have noted that the number of volunteers {{10}} grown steadily over the past five years.',
      answers: ['been', 'whose', 'were', 'Despite', 'as', 'unless', 'more', 'being', 'their', 'has'],
      leftOver: ['although', 'which'],
      skill: 'mixedGrammar',
      practiseTarget: 'cloze-castle',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word from the word bank. Each word may be used only once. Two words will be left over.',
      wordBank: ['thrive', 'encounter', 'sustain', 'scarce', 'remedy', 'abundant', 'intricate', 'deteriorate', 'fragile', 'vital', 'vast', 'dwindling'],
      text:
        'The coral reef is one of the most {{1}} ecosystems on Earth. Although coral reefs cover less than one percent of the ocean floor, ' +
        'they are {{2}} to the survival of roughly a quarter of all marine species. ' +
        'Reefs provide food and shelter for countless creatures that could not {{3}} anywhere else. ' +
        'The {{4}} network of channels and caves within a reef serves as a nursery for young fish. ' +
        'Sadly, rising ocean temperatures have caused many reefs to {{5}} rapidly. ' +
        'Scientists report that coral populations are {{6}}, with some species declining by more than half in just thirty years. ' +
        'Food supplies for coastal communities who rely on reef fish are becoming {{7}}. ' +
        'Unless humans take action to {{8}} healthy reef ecosystems, the damage may become irreversible. ' +
        'Visitors who {{9}} a reef for the first time are often struck by its breathtaking beauty — and by how {{10}} it really is.',
      answers: ['intricate', 'vital', 'thrive', 'vast', 'deteriorate', 'dwindling', 'scarce', 'sustain', 'encounter', 'fragile'],
      leftOver: ['remedy', 'abundant'],
      skill: 'vocabCloze',
      practiseTarget: 'word-vault',
    },

    sectionE: {
      title: 'Section E: Situational Writing',
      marks: 15,
      instructions: 'Study the information below carefully and write your response in about 100–120 words.',
      format: 'Email',
      purpose: 'To invite your school principal to be a guest speaker at your class\'s Environment Awareness Day.',
      audience: 'Your school principal, Mr Ramesh Pillai',
      context:
        'Your class, 5 Integrity, has organised an Environment Awareness Day on 14 March. ' +
        'You would like Mr Pillai to give a short speech to inspire students to protect the environment. ' +
        'The event will be held in the school hall from 9 a.m. to 11 a.m.',
      bullets: [
        'Explain the purpose of the event and why it is important.',
        'Request Mr Pillai to give a 10-minute opening speech.',
        'Provide details about the event (date, time, venue).',
      ],
      wordCount: '100–120 words',
      modelAnswer:
        'Dear Mr Pillai,\n\n' +
        'I am writing on behalf of 5 Integrity to invite you to our Environment Awareness Day. ' +
        'Our class has organised this event to educate students about pressing environmental issues such as climate change and plastic pollution. ' +
        'We believe that your words of encouragement will inspire our schoolmates to play a greater role in protecting our planet.\n\n' +
        'We would be truly honoured if you could deliver a short 10-minute opening speech at the event. ' +
        'The Environment Awareness Day will be held in the school hall on 14 March, from 9 a.m. to 11 a.m.\n\n' +
        'We sincerely hope you will be able to join us. Thank you for your time and consideration.\n\n' +
        'Yours sincerely,\nClass Representative, 5 Integrity',
      rubric: {
        taskFulfillment: 'All 3 bullet points addressed; email format with correct salutation and sign-off; appropriate formal tone.',
        language: 'Accurate grammar and spelling; varied vocabulary; appropriate formal register throughout.',
        organisation: 'Clear introduction (purpose), body (request + details), and polite closing.',
      },
    },

    sectionF: {
      title: 'Section F: Synthesis & Transformation',
      marks: 10,
      instructions: 'For each question, rewrite the sentence(s) so that the meaning stays the same. Use the word(s) given and do not change them.',
      items: [
        {
          q: 'Park rangers must protect all nesting sites from human interference.',
          stem: 'All nesting sites ___',
          answer: 'All nesting sites must be protected from human interference by park rangers.',
          alternates: ['All nesting sites must be protected from human interference.'],
          requiredGroups: [
            ["must be protected", "have to be protected", "are to be protected"],
            ["human interference", "interference", "park rangers", "rangers"],
          ],
          skill: 'passiveVoice',
          explain: 'Passive with modal: move the object to subject position and insert "must be + past participle".',
        },
        {
          q: '"Stop throwing litter into the river at once!" the officer shouted at the boys.',
          stem: 'The officer ordered the boys ___',
          answer: 'The officer ordered the boys to stop throwing litter into the river at once.',
          alternates: ['The officer ordered the boys not to throw litter into the river.'],
          requiredGroups: [
            ["stop throwing", "not to throw", "to stop throwing"],
            ["litter", "rubbish"],
          ],
          skill: 'reportedSpeech',
          explain: 'Reported command: "ordered + object + to-infinitive"; negative command: "ordered + object + not + to-infinitive".',
        },
        {
          q: 'If the government did not act swiftly, the rare pangolin population would vanish.',
          stem: 'Were the government ___',
          answer: 'Were the government not to act swiftly, the rare pangolin population would vanish.',
          alternates: ['Were the government to fail to act swiftly, the rare pangolin population would vanish.'],
          requiredGroups: [
            ["not to act", "to fail to act"],
            ["pangolin", "would vanish", "would disappear"],
          ],
          skill: 'conditionals',
          explain: 'Type 2 conditional inversion: "Were + subject + to-infinitive" replaces "If + subject + past tense".',
        },
        {
          q: 'The wetland reserve was closed to visitors. Its restoration work had not been completed.',
          stem: 'The wetland reserve, whose ___',
          answer: 'The wetland reserve, whose restoration work had not been completed, was closed to visitors.',
          alternates: [],
          requiredGroups: [
            ["restoration work", "restoration"],
            ["had not been completed", "was not completed", "remained incomplete"],
          ],
          skill: 'relativeClauses',
          explain: '"Whose + noun" combines two sentences into a non-restrictive relative clause.',
        },
        {
          q: 'The flooding was so severe that it destroyed three coastal villages.',
          stem: 'Such ___',
          answer: 'Such was the severity of the flooding that it destroyed three coastal villages.',
          alternates: ['Such severe flooding occurred that it destroyed three coastal villages.'],
          requiredGroups: [
            ["severity", "severe flooding", "severe"],
            ["destroyed", "wiped out", "wrecked"],
          ],
          skill: 'conjunctions',
          explain: '"Such + noun phrase + that" — inversion structure.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word.',
      text:
        'Every year, millions of sea turtles are born on beaches around the world. ' +
        'As soon as a hatchling breaks free {{1}} its shell, it instinctively crawls towards the ocean. ' +
        'Scientists believe that turtles use the Earth\'s magnetic field {{2}} navigate back to the very beach where they were born, ' +
        'sometimes travelling thousands of kilometres to do {{3}}. ' +
        'The journey from beach to open sea is among the most dangerous a young turtle will {{4}} face. ' +
        'Predatory birds and crabs prey {{5}} the tiny hatchlings, and only a fraction survive to adulthood. ' +
        'Human activities pose an equally serious threat. Bright artificial lights along coastlines confuse hatchlings, {{6}} lead them away from the sea instead of towards it. ' +
        'Plastic waste in the ocean is {{7}} problem, as turtles frequently mistake plastic bags for jellyfish and swallow them. ' +
        'Conservation volunteers now patrol beaches during nesting season, ensuring that the eggs are neither {{8}} nor disturbed. ' +
        'Thanks to {{9}} efforts, turtle populations in several protected areas have begun to recover. ' +
        'However, scientists caution that global warming {{10}} poses a new challenge, as rising temperatures affect the sex ratio of hatchlings.',
      answers: ['from', 'to', 'so', 'ever', 'on', 'which', 'another', 'stolen', 'these', 'now'],
      accept: [
        ['out of'],
        ['in order to'],
        [],
        ['always', 'ultimately'],
        [],
        ['that'],
        ['a serious', 'one'],
        ['disturbed', 'taken'],
        ['such', 'their'],
        ['also', 'increasingly'],
      ],
      skill: 'comprehensionCloze',
      practiseTarget: 'cloze-castle',
    },

    sectionH: {
      title: 'Section H: Comprehension',
      marks: 15,
      passage:
        'Deep within the Borneo rainforest, a team of young Singaporean scientists set up camp at the edge of a river. Their mission: to document species that had never before been recorded in this region. The forest hummed with life — a symphony of cicadas, birdsong, and the distant splash of a hornbill diving for fish.\n\n' +
        'Dr Mei Ling, the team leader, had spent fifteen years studying tropical biodiversity. To her, every leaf and root told a story. She often reminded her students that a single hectare of rainforest could contain more species of insects than the entire continent of Europe. "Most people walk through a forest and see trees," she liked to say. "I see a library."\n\n' +
        'On the third day of the expedition, a junior researcher named Faizal made a startling discovery. While collecting water samples from a shallow stream, he noticed a translucent frog no larger than his thumbnail perched on a mossy stone. Dr Mei Ling\'s eyes widened when she examined it. Its see-through skin revealed the delicate outline of its tiny organs. After hours of careful comparison with her reference materials, she concluded that it was almost certainly a species new to science.\n\n' +
        'The team worked methodically, photographing the frog from every angle and recording its call. They were careful not to disturb its habitat. "We are guests here," Dr Mei Ling stressed. "We observe — we do not interfere."\n\n' +
        'News of the possible new species caused excitement back in Singapore. Environmental groups urged the government to gazette the surrounding forest as a protected area before logging companies could move in. A spokesperson for the loggers argued that the forest land had already been legally allocated for timber harvesting, and that the discovery of a single frog was insufficient reason to halt operations.\n\n' +
        'Back at camp, Faizal stared up at the canopy as the sun set behind the treetops. He thought about the frog — a creature that had existed for perhaps millions of years without any human ever knowing about it. He wondered how many other undiscovered wonders the forest still held, and how many would disappear before anyone had a chance to find them.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'According to paragraph 2, what does Dr Mei Ling mean when she says "I see a library"?',
          choices: [
            'She thinks forests should be converted into quiet reading areas.',
            'She sees the forest as a vast source of knowledge and information.',
            'She prefers reading books about forests to visiting them.',
            'She believes forests are as organised and structured as libraries.',
          ],
          answer: 'She sees the forest as a vast source of knowledge and information.',
          explain: 'A library stores knowledge; Dr Mei Ling sees the forest the same way — every element tells a story.',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'What was significant about the frog that Faizal discovered?',
          choices: [
            'It was the smallest frog ever found in Borneo.',
            'It could survive both in water and on land.',
            'It appeared to belong to a species previously unknown to science.',
            'It had unusually bright colours that warned away predators.',
          ],
          answer: 'It appeared to belong to a species previously unknown to science.',
          explain: 'Dr Mei Ling compared it with her references and concluded it was "almost certainly a species new to science".',
        },
        {
          type: 'short',
          marks: 1,
          q: 'Find a word in paragraph 3 that means "clear enough to see through".',
          model: 'translucent',
          keywords: ['translucent'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What does the phrase "We are guests here" (paragraph 4) tell you about Dr Mei Ling\'s attitude towards the forest?',
          model: 'It shows that she believes scientists should respect the forest and not disturb it, just as a polite guest would not interfere in someone else\'s home.',
          keywords: ['respect', 'not disturb', 'observe', 'guest'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What did environmental groups want the government to do after hearing about the discovery?',
          model: 'They urged the government to gazette the surrounding forest as a protected area before logging companies could move in.',
          keywords: ['gazette', 'protected area', 'logging', 'government'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What reason did the logging company spokesperson give for continuing operations?',
          model: 'The spokesperson argued that the forest land had already been legally allocated for timber harvesting and that discovering one frog was not enough reason to stop.',
          keywords: ['legally allocated', 'timber', 'one frog', 'insufficient'],
        },
        {
          type: 'inference',
          marks: 2,
          q: 'What impression do you get of Faizal from paragraphs 3 and 6? Support your answer with evidence from the passage.',
          model: 'Faizal comes across as a thoughtful and passionate scientist. In paragraph 3, he made a careful observation by noticing the tiny translucent frog while collecting water samples, showing his attention to detail. In paragraph 6, he reflects on the frog\'s long existence and worries about undiscovered species disappearing, revealing his deep concern for conservation.',
          keywords: ['thoughtful', 'passionate', 'observation', 'conservation', 'noticed', 'wondered'],
        },
        {
          type: 'open',
          marks: 5,
          q: 'Do you think the logging should be allowed to continue? Use information from the passage to support your view. Also give one reason of your own.',
          model: 'No — the logging should not be allowed. The discovery of a possible new species suggests the forest is ecologically significant and may contain other undiscovered organisms. Dr Mei Ling notes that a single hectare can contain more insect species than all of Europe, suggesting enormous biodiversity value. Allowing logging would destroy irreplaceable habitat before scientists have even had a chance to study it. Furthermore, once a species is extinct it cannot be recovered, so the potential loss is permanent.',
          keywords: ['new species', 'biodiversity', 'habitat', 'undiscovered', 'destroy', 'extinct'],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════════
     TERM 2  —  School Life & Community  (vocabulary-heavy)
  ══════════════════════════════════════════════════════════════════ */
  T2: {
    id: 'p5-test-term-2',
    term: 'T2',
    level: 'P5',
    label: 'Term 2 Practice Test (Vocabulary Focus)',
    duration: '1 h 30 min',
    totalMarks: 85,
    blurb: 'P5 Term 2 paper — reported speech (questions), infinitive vs gerund, SVA edge cases, modals of deduction. Situational Writing: Formal Letter. Comprehension: community library and senior coders.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      items: [
        {
          q: 'The librarian asked the visitor ___ she had registered for the reading programme.',
          choices: ['if', 'that', 'what', 'which'],
          answer: 'if',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'Reported yes/no question: "asked + if/whether + subject + verb".',
        },
        {
          q: 'None of the students ___ able to answer the final question in the competition.',
          choices: ['was', 'were', 'has been', 'is'],
          answer: 'were',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: '"None of + plural noun" takes a plural verb when emphasising individuals.',
        },
        {
          q: 'The notice on the door read: "Entry is restricted to authorised personnel. All visitors ___ be accompanied by a staff member."',
          choices: ['should', 'might', 'must', 'could'],
          answer: 'must',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Must" expresses obligation — the only option that enforces a rule.',
        },
        {
          q: 'The principal suggested ___ a community mural on the wall of the school\'s main entrance.',
          choices: ['to paint', 'paint', 'painting', 'painted'],
          answer: 'painting',
          skill: 'mixedGrammar',
          practiseTarget: 'grammar-mcq',
          explain: '"Suggest + gerund (verb-ing)"; never "suggest + to-infinitive".',
        },
        {
          q: 'The books ___ on the shelves should have been sorted by topic, not by title.',
          choices: ['arranged', 'arranging', 'which arranged', 'that were arranged'],
          answer: 'that were arranged',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"That were arranged on the shelves" — a restrictive relative clause identifying which books.',
        },
        {
          q: 'She admitted ___ forgotten to return the library book before the due date.',
          choices: ['to have', 'having', 'to having', 'have'],
          answer: 'having',
          skill: 'mixedGrammar',
          practiseTarget: 'grammar-mcq',
          explain: '"Admit + gerund (verb-ing)" — perfect gerund "having + past participle" for a past action.',
        },
        {
          q: 'The report ___ presented to the town council last Monday contained several inaccuracies.',
          choices: ['was', 'being', 'been', 'having been'],
          answer: 'being',
          skill: 'mixedGrammar',
          practiseTarget: 'grammar-mcq',
          explain: '"Being + past participle" — a present participial phrase indicating an ongoing process.',
        },
        {
          q: '"You ___ left your umbrella at the community centre — you were there just this morning," Dad said.',
          choices: ['must have', 'should have', 'could have', 'might have'],
          answer: 'must have',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Must have + past participle" — logical deduction about a past event.',
        },
        {
          q: 'This year\'s school carnival is twice ___ popular ___ last year\'s.',
          choices: ['as / as', 'more / as', 'so / as', 'as / than'],
          answer: 'as / as',
          skill: 'comparatives',
          practiseTarget: 'grammar-mcq',
          explain: '"Twice as + adjective + as" — comparison using "as ... as".',
        },
        {
          q: '___ the volunteers nor the organisers had anticipated the huge turnout at the community fair.',
          choices: ['Not only', 'Both', 'Neither', 'Either'],
          answer: 'Neither',
          skill: 'conjunctions',
          practiseTarget: 'grammar-mcq',
          explain: '"Neither ... nor" — joins two negative subjects; verb agrees with the nearer subject.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'Mr Tan could tell from Maya\'s careful choice of words that she was clearly ___ the lines — there was a hidden message in her speech.',
          choices: ['looking between', 'thinking between', 'reading between', 'speaking between'],
          answer: 'reading between',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Reading between the lines" means detecting a meaning not explicitly stated.',
        },
        {
          q: 'The new community library was described as "a ___ of knowledge", drawing readers from across the district.',
          choices: ['desert', 'drop', 'fountain', 'spark'],
          answer: 'fountain',
          skill: 'similes',
          practiseTarget: 'vocab-mcq',
          explain: '"A fountain of knowledge" is a metaphor meaning an abundant, flowing source of learning.',
        },
        {
          q: 'The committee agreed to ___ the renovation project to the most experienced contractor in the district.',
          choices: ['render', 'entrust', 'pass', 'award'],
          answer: 'award',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Award a contract/project" is the standard collocation for formally granting a contract.',
        },
        {
          q: 'The director used several ___ forms of the word "create": creation, creative, and creativity all appeared in the same paragraph.',
          choices: ['derived', 'related', 'linked', 'connected'],
          answer: 'derived',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: '"Derived forms" are words created from the same root by adding prefixes or suffixes.',
        },
        {
          q: '"Slim" and "slender" are near-synonyms, but "slim" often carries a neutral or positive tone, while "slender" sounds more ___.',
          choices: ['informal', 'negative', 'elegant', 'ordinary'],
          answer: 'elegant',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Slender" has a more graceful, literary connotation than the more everyday "slim".',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word from the word bank. You may use a word more than once, and some words will be left over.',
      wordBank: ['whenever', 'had', 'so', 'which', 'being', 'however', 'their', 'have', 'whether', 'one', 'though', 'despite'],
      text:
        'The Queenstown Community Library has been a beloved gathering place for residents for more than forty years. ' +
        '{{1}} the library opened its doors in 1982, it quickly became a focal point for the neighbourhood. ' +
        'Over the decades, the collection grew steadily, and new sections were added to cater to readers of all ages. ' +
        '{{2}}, by 2020 the building\'s ageing infrastructure was in desperate need of repair. ' +
        'Several sections of the roof {{3}} begun to leak, and the air-conditioning system {{4}} been unreliable for years. ' +
        'The library board proposed a two-year renovation, {{5}} divided residents: some welcomed the upgrade while others feared the long closure. ' +
        'Residents were surveyed on {{6}} they preferred a full closure or a phased renovation. ' +
        'The majority voted for a phased approach, {{7}} disruptive it might be to daily operations. ' +
        'Volunteers from local schools offered {{8}} help to move thousands of books into temporary storage. ' +
        'Today, {{9}} year into the renovation, the library has already reopened its ground floor. ' +
        'Residents say the improved lighting and new reading pods have made the space {{10}} inviting that they visit far more often than before.',
      answers: ['Whenever', 'However', 'had', 'had', 'which', 'whether', 'though', 'their', 'one', 'so'],
      leftOver: ['being', 'have', 'despite'],
      skill: 'mixedGrammar',
      practiseTarget: 'cloze-castle',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word from the word bank. Each word may be used only once. Two words will be left over.',
      wordBank: ['accessible', 'dedicate', 'embrace', 'foster', 'initiative', 'commend', 'cultivate', 'aspire', 'transform', 'endeavour', 'elevate', 'nurture'],
      text:
        'The "Read for Life" programme was launched three years ago with a simple goal: to {{1}} a genuine love of reading in young people. ' +
        'The organisers wanted to {{2}} reading spaces that were welcoming and {{3}} to children from all backgrounds. ' +
        'Local businesses were invited to {{4}} resources to the cause — some donated books, while others refurbished tired reading corners. ' +
        'The programme also sought to {{5}} a sense of community by encouraging families to read aloud together. ' +
        'Supporters praised the {{6}} shown by the founding team, who worked tirelessly with no pay in the first year. ' +
        'The education minister was quick to {{7}} the programme for its positive impact on literacy rates. ' +
        'Many children who joined the scheme now {{8}} to become writers, journalists, or teachers themselves. ' +
        'Parents say the programme has helped {{9}} their children\'s confidence in speaking and writing. ' +
        'Without question, the humble reading club has managed to {{10}} entire communities through the power of stories.',
      answers: ['cultivate', 'nurture', 'accessible', 'dedicate', 'foster', 'initiative', 'commend', 'aspire', 'elevate', 'transform'],
      leftOver: ['embrace', 'endeavour'],
      skill: 'vocabCloze',
      practiseTarget: 'word-vault',
    },

    sectionE: {
      title: 'Section E: Situational Writing',
      marks: 15,
      instructions: 'Study the information below carefully and write your response in about 100–120 words.',
      format: 'Formal Letter',
      purpose: 'To apply for a place in a community art workshop organised by the Taman Jurong Community Club.',
      audience: 'The Programme Coordinator, Taman Jurong Community Club',
      context:
        'The Taman Jurong Community Club is offering a six-week mural painting workshop for upper primary students. ' +
        'Applications close on 30 June. Participants will learn basic techniques from a professional artist and contribute a mural to the club\'s new youth lounge.',
      bullets: [
        'State who you are and why you are applying for the workshop.',
        'Describe your relevant interest or experience in art.',
        'Explain how participating will benefit you and the community.',
      ],
      wordCount: '100–120 words',
      modelAnswer:
        '15 Buona Vista Drive\nSingapore 129345\n20 June 2026\n\n' +
        'The Programme Coordinator\nTaman Jurong Community Club\nSingapore 640226\n\n' +
        'Dear Sir / Madam,\n\n' +
        'I am writing to apply for a place in the six-week mural painting workshop advertised by your community club. I am a Primary 5 student at Jurong Primary School with a keen interest in visual arts.\n\n' +
        'I have been attending my school\'s Art Club for two years and have participated in two inter-school exhibitions. I am eager to learn from a professional artist and develop my skills further.\n\n' +
        'I believe this workshop will not only help me grow as an artist but also allow me to contribute meaningfully to the community by beautifying the new youth lounge.\n\n' +
        'I hope you will consider my application. Thank you.\n\n' +
        'Yours faithfully,\nLim Jia Yi',
      rubric: {
        taskFulfillment: 'All 3 bullet points addressed; correct formal letter format with address, date, salutation and sign-off.',
        language: 'Formal register maintained; correct grammar; precise and varied vocabulary.',
        organisation: 'Clear opening (who you are and purpose), body (interest/experience, benefit), and polite closing.',
      },
    },

    sectionF: {
      title: 'Section F: Synthesis & Transformation',
      marks: 10,
      instructions: 'For each question, rewrite the sentence(s) so that the meaning stays the same. Use the word(s) given and do not change them.',
      items: [
        {
          q: '"Did you remember to submit your portfolio before the deadline?" Ms Chen asked Marcus.',
          stem: 'Ms Chen asked Marcus ___',
          answer: 'Ms Chen asked Marcus whether he had remembered to submit his portfolio before the deadline.',
          alternates: ['Ms Chen asked Marcus if he had remembered to submit his portfolio before the deadline.'],
          requiredGroups: [
            ["whether", "if"],
            ["had remembered", "remembered to submit"],
          ],
          skill: 'reportedSpeech',
          explain: 'Reported yes/no question: "asked + whether/if + subject + had + past participle".',
        },
        {
          q: 'The new community garden is so beautiful that residents queue to take photographs in it.',
          stem: 'Such ___',
          answer: 'Such is the beauty of the new community garden that residents queue to take photographs in it.',
          alternates: ['Such a beautiful community garden has been created that residents queue to take photographs in it.'],
          requiredGroups: [
            ["beauty", "beautiful"],
            ["queue", "line up", "wait in line"],
          ],
          skill: 'conjunctions',
          explain: '"Such + noun phrase + that" — inversion structure.',
        },
        {
          q: 'If I had more time, I would volunteer at the library every week.',
          stem: 'Had ___',
          answer: 'Had I more time, I would volunteer at the library every week.',
          alternates: [],
          requiredGroups: [
            ["had i", "more time"],
            ["would volunteer", "would help"],
          ],
          skill: 'conditionals',
          explain: 'Type 2 conditional inversion: "Had + subject + noun/adjective" replaces "If + subject + had".',
        },
        {
          q: 'The mural was painted by a group of students from the neighbourhood school.',
          stem: 'A group of students ___',
          answer: 'A group of students from the neighbourhood school painted the mural.',
          alternates: [],
          requiredGroups: [
            ["students", "group of students"],
            ["painted the mural", "made the mural", "created the mural"],
          ],
          skill: 'passiveVoice',
          explain: 'Convert passive to active: the agent (by phrase) becomes the new subject.',
        },
        {
          q: 'Maya reads widely. This has helped her score highly in English every year.',
          stem: 'Not only ___',
          answer: 'Not only does Maya read widely, but she has also scored highly in English every year.',
          alternates: ['Not only has Maya read widely, but she has also scored highly in English every year.'],
          requiredGroups: [
            ["read widely", "reads widely"],
            ["scored highly", "achieved high"],
          ],
          skill: 'conjunctions',
          explain: '"Not only ... but also" — inversion after "Not only": auxiliary before subject.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word.',
      text:
        'In many countries, volunteering has become an important part of school life. Students {{1}} give up their weekends to help at food banks, elderly care centres, and community gardens gain more than just a sense of satisfaction. ' +
        'Research shows that young volunteers {{2}} better time-management skills, stronger empathy, and a greater sense of civic responsibility {{3}} their peers who do not volunteer. ' +
        'In Singapore, the Community Involvement Programme has made volunteering a {{4}} part of every student\'s education. ' +
        'Schools partner {{5}} organisations such as the Singapore Red Cross and the Community Development Councils to offer students a variety of service opportunities. ' +
        'Critics {{6}} argue that compulsory volunteering loses its meaning — if students are required to help, are they truly volunteering? ' +
        'Supporters counter that exposure to service during formative years plants a seed {{7}} eventually grows into genuine compassion. ' +
        'One study found that students {{8}} began volunteering in primary school were three times more likely to continue doing {{9}} as adults. ' +
        'The evidence suggests that introducing young people to community service early does {{10}}, in the long run, create a more caring and cohesive society.',
      answers: ['who', 'develop', 'than', 'core', 'with', 'sometimes', 'that', 'who', 'so', 'indeed'],
      accept: [
        ['that'],
        ['acquire', 'build', 'demonstrate'],
        [],
        ['key', 'central', 'compulsory', 'fundamental'],
        [],
        ['often', 'occasionally'],
        ['which'],
        ['that'],
        [],
        ['certainly', 'undoubtedly'],
      ],
      skill: 'comprehensionCloze',
      practiseTarget: 'cloze-castle',
    },

    sectionH: {
      title: 'Section H: Comprehension',
      marks: 15,
      passage:
        'In a quiet corner of Woodlands, a small group of senior citizens gather every Tuesday afternoon in a sunlit room at the Woodlands Active Ageing Centre. What draws them together is not a game of mahjong or a fitness class, but an unlikely passion: coding.\n\n' +
        'The programme, called Silver Coders, was the brainchild of a twenty-three-year-old university student, Priya Nair, who noticed that many elderly residents in her neighbourhood felt excluded from the increasingly digital world. "Everything from hawker payment to hospital appointments has gone online," Priya observed. "Many of my elderly neighbours were struggling to keep up and felt embarrassed to ask for help."\n\n' +
        'Priya spent six months designing a curriculum specifically for older learners. She avoided jargon, used large fonts, and incorporated familiar scenarios — booking a doctor\'s appointment, paying for hawker meals, video-calling family overseas. She trained a team of student volunteers to assist the participants patiently.\n\n' +
        'The early sessions were rocky. Mr Lim Ah Kow, 74, recalls gripping the mouse so hard his knuckles turned white. "I kept clicking the wrong thing," he laughs now. "My granddaughter used to fix my mistakes — now I help her with some things."\n\n' +
        'Today, Silver Coders has expanded to five community centres across Singapore. More than eight hundred seniors have completed the programme. Several participants have gone on to create simple websites for their own small home businesses, selling homemade kaya jam and handmade crafts online.\n\n' +
        'Priya\'s work has not gone unnoticed. She recently received a national volunteer award, but she insists the real reward is watching participants\' faces light up when they successfully complete a task on their own. "Technology should not be a wall that shuts people out," she says. "It should be a door — open to everyone."',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'Why did Priya Nair start the Silver Coders programme?',
          choices: [
            'She wanted elderly residents to learn to play online games.',
            'She noticed that elderly residents felt left behind in an increasingly digital world.',
            'She was required to complete a community service project for her university.',
            'She wanted to sell technology products to senior citizens.',
          ],
          answer: 'She noticed that elderly residents felt left behind in an increasingly digital world.',
          explain: 'Paragraph 2: Priya observed that elderly neighbours struggled with digitalisation and felt embarrassed to ask for help.',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'How did Priya make the coding curriculum suitable for older learners?',
          choices: [
            'She made sessions very short and included many games.',
            'She avoided technical language, used large fonts and relevant real-life examples.',
            'She hired professional IT trainers from local companies.',
            'She asked participants to learn from standard coding textbooks.',
          ],
          answer: 'She avoided technical language, used large fonts and relevant real-life examples.',
          explain: 'Paragraph 3 details: no jargon, large fonts, and familiar scenarios like booking appointments and paying for meals.',
        },
        {
          type: 'short',
          marks: 1,
          q: 'Find a word in paragraph 2 that means "thought of or invented by someone".',
          model: 'brainchild',
          keywords: ['brainchild'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What does Mr Lim Ah Kow\'s comment "now I help her with some things" (paragraph 4) suggest about his progress?',
          model: 'It suggests that Mr Lim has improved so much in his digital skills that he can now assist his granddaughter, reversing their earlier roles.',
          keywords: ['improved', 'progress', 'reversed', 'granddaughter'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'Give ONE example from paragraph 5 of how participants used their new skills for practical purposes.',
          model: 'Some participants created simple websites for their own small home businesses, selling homemade kaya jam and handmade crafts online.',
          keywords: ['websites', 'business', 'selling', 'kaya', 'crafts'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What does Priya mean when she says technology should be "a door — open to everyone" (paragraph 6)?',
          model: 'She means that technology should be inclusive and accessible to all people, including the elderly, not something that excludes or separates them.',
          keywords: ['inclusive', 'accessible', 'excludes', 'all people'],
        },
        {
          type: 'inference',
          marks: 2,
          q: 'What do you learn about Priya\'s character from the passage? Support your answer with two pieces of evidence.',
          model: 'Priya is caring and resourceful. First, she noticed that elderly neighbours struggled and took the initiative to help, spending six months designing a curriculum — showing her compassion and dedication. Second, despite receiving a national award, she says the real reward is seeing participants succeed, which shows she is humble and genuinely motivated by helping others rather than personal recognition.',
          keywords: ['caring', 'resourceful', 'compassion', 'humble', 'initiative', 'dedicated'],
        },
        {
          type: 'open',
          marks: 5,
          q: 'Do you think schools should do more to help students learn how to support elderly people in their communities? Give two reasons for your view.',
          model: 'Yes, schools should do more. First, students who volunteer with elderly people develop empathy and an appreciation for different life experiences, which are valuable qualities for the future. Second, as Singapore\'s population ages rapidly, it is increasingly important for young people to understand the challenges faced by seniors and take an active role in building an inclusive community. Priya\'s example shows that even a single young person can make a significant difference.',
          keywords: ['empathy', 'elderly', 'inclusive', 'community', 'ageing', 'volunteer'],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════════
     TERM 3  —  History & Heritage  (synthesis-heavy)
  ══════════════════════════════════════════════════════════════════ */
  T3: {
    id: 'p5-test-term-3',
    term: 'T3',
    level: 'P5',
    label: 'Term 3 Practice Test (Synthesis Focus)',
    duration: '1 h 30 min',
    totalMarks: 85,
    blurb: 'P5 Term 3 paper — Type 3 conditionals, past participial phrases, complex relative clauses, "no sooner...than". Situational Writing: Informal Note. Comprehension: kampong spirit and oral history.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      items: [
        {
          q: 'If the old shophouse ___ demolished, many priceless murals would have been lost forever.',
          choices: ['was', 'were', 'had been', 'has been'],
          answer: 'had been',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 3 conditional (unreal past): "If + past perfect, would have + past participle".',
        },
        {
          q: 'The heritage trail, ___ the Tourist Board launched last year, has attracted over fifty thousand visitors.',
          choices: ['that', 'which', 'who', 'whom'],
          answer: 'which',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Which" introduces a non-restrictive relative clause about a thing; "that" cannot be used with non-restrictive clauses preceded by a comma.',
        },
        {
          q: 'The conserved shophouses ___ had been repurposed into boutique hotels attracted many tourists.',
          choices: ['that', 'whom', 'whose', 'which'],
          answer: 'that',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"That had been repurposed" — restrictive relative clause; "that" for things in a defining clause.',
        },
        {
          q: '___ the residents had signed the petition ___ the building received conservation status.',
          choices: ['No sooner had / than', 'Scarcely did / when', 'No sooner did / than', 'Hardly had / when'],
          answer: 'No sooner had / than',
          skill: 'conjunctions',
          practiseTarget: 'grammar-mcq',
          explain: '"No sooner had + subject + past participle ... than ..." — formal inverted structure.',
        },
        {
          q: 'The guide, ___ enthusiasm impressed every visitor, had lived in the district all his life.',
          choices: ['who', 'whose', 'which', 'that'],
          answer: 'whose',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Whose enthusiasm" — possessive relative pronoun showing the guide\'s enthusiasm.',
        },
        {
          q: 'Historians recommend ___ at least one hour at the Chinatown Heritage Centre.',
          choices: ['spend', 'to spend', 'spending', 'spent'],
          answer: 'spending',
          skill: 'mixedGrammar',
          practiseTarget: 'grammar-mcq',
          explain: '"Recommend + gerund (verb-ing)"; never "recommend + to-infinitive".',
        },
        {
          q: '___ beautifully restored over three years, the temple now welcomes over ten thousand worshippers annually.',
          choices: ['Being', 'Have been', 'Having been', 'Been'],
          answer: 'Having been',
          skill: 'mixedGrammar',
          practiseTarget: 'grammar-mcq',
          explain: '"Having been + past participle" — a perfect passive participial phrase showing a completed process.',
        },
        {
          q: 'The artisans ___ have passed down the craft of batik weaving across generations deserve wider recognition.',
          choices: ['who', 'which', 'whom', 'whose'],
          answer: 'who',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Who" — subject relative pronoun for people.',
        },
        {
          q: 'This ceramic vase ___ have originated in the Ming dynasty — the style and glaze are consistent with that era.',
          choices: ['may', 'should', 'must', 'would'],
          answer: 'may',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"May have + past participle" expresses possibility about the past; "must" would imply certainty.',
        },
        {
          q: 'The museum is ___ large ___ you can spend an entire day without seeing every exhibit.',
          choices: ['such / that', 'so / that', 'so / but', 'such / so'],
          answer: 'so / that',
          skill: 'conjunctions',
          practiseTarget: 'grammar-mcq',
          explain: '"So + adjective + that" shows a result — the museum is so large that you need a whole day. "Such" goes with a noun ("such a large museum that…"), not straight before an adjective.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'Relocating her workshop to a cheaper suburb turned out to be ___ — her business expanded significantly once she had more space.',
          choices: ['a piece of cake', 'a blessing in disguise', 'burning her bridges', 'reading between the lines'],
          answer: 'a blessing in disguise',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"A blessing in disguise" — something that seemed negative but proved beneficial.',
        },
        {
          q: 'The conservation officer described the kampong as "a time capsule", meaning it had ___.',
          choices: ['been sealed underground', 'preserved its original character unchanged', 'been forgotten by locals', 'stored records of the past'],
          answer: 'preserved its original character unchanged',
          skill: 'similes',
          practiseTarget: 'vocab-mcq',
          explain: '"Time capsule" is a metaphor for something that has stayed unchanged, preserving the past.',
        },
        {
          q: 'The heritage committee ensured that conservation concerns would ___ commercial interests in all planning decisions.',
          choices: ['set', 'take precedence over', 'make way for', 'give way to'],
          answer: 'take precedence over',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Take precedence over" means to be more important than something else.',
        },
        {
          q: 'The art exhibition showcased ___ in various forms: oil painting, charcoal drawing, and watercolour all featured prominently.',
          choices: ['paint', 'creation', 'artistry', 'canvas'],
          answer: 'artistry',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: '"Artistry" is the noun form that means skilled artistic ability or quality.',
        },
        {
          q: '"Ancient" and "antique" are related in meaning, but "antique" specifically refers to objects that are ___.',
          choices: ['very old and historically significant', 'old and valued as collectibles', 'broken or worn by age', 'foreign and exotic'],
          answer: 'old and valued as collectibles',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Antique" implies an old object valued by collectors; "ancient" refers to great age without necessarily implying collectible value.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word from the word bank. Each word may be used only once. Two words will be left over.',
      wordBank: ['had', 'been', 'which', 'whose', 'were', 'having', 'although', 'such', 'where', 'that', 'with', 'once'],
      text:
        'The kampong, {{1}} name derived from the Malay word for "village", was once the dominant form of settlement in Singapore. ' +
        'These villages, {{2}} surrounded by rubber plantations and vegetable farms, were tightly knit communities ' +
        '{{3}} residents shared resources, celebrated festivals together, and looked out for one another\'s children. ' +
        'By the 1980s, most kampongs {{4}} been cleared to make way for modern public housing. ' +
        'Residents {{5}} been relocated to HDB flats found that life in the high-rises was comfortable but less communal. ' +
        '{{6}} the kampong way of life had all but disappeared, the spirit it embodied — helpfulness, neighbourliness, and shared hardship — endured. ' +
        'This spirit is {{7}} deeply embedded in Singaporean identity that it has its own name: the kampong spirit. ' +
        'Today, community groups organise events {{8}} replicate that atmosphere of togetherness. ' +
        'New estates are designed {{9}} communal kitchens and shared garden plots to bring neighbours together. ' +
        '{{10}} a new community space opens, it is this kampong spirit that residents hope to carry forward.',
      answers: ['whose', 'which', 'where', 'had', 'having', 'Although', 'such', 'that', 'with', 'Once'],
      leftOver: ['been', 'were'],
      skill: 'mixedGrammar',
      practiseTarget: 'cloze-castle',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word from the word bank. Each word may be used only once. Two words will be left over.',
      wordBank: ['heritage', 'cherish', 'tangible', 'chronicle', 'vanish', 'testament', 'evoke', 'preserve', 'commemorate', 'erosion', 'restore', 'revive'],
      text:
        'Every nation has a duty to {{1}} its cultural heritage for future generations. In Singapore, conservation efforts have saved dozens of historic buildings from demolition. ' +
        'These buildings serve as {{2}} reminders of the island\'s rich and layered past. ' +
        'Walking through Chinatown or Kampong Glam is enough to {{3}} a sense of the hardship and hope that earlier generations experienced. ' +
        'Photographers and historians work together to {{4}} everyday life in these districts before it changes beyond recognition. ' +
        'Without such efforts, decades of accumulated culture could simply {{5}} as older residents pass on and buildings are torn down. ' +
        'The restored temples and shophouses are a {{6}} to the community\'s determination to hold on to what matters. ' +
        'Young Singaporeans are encouraged to {{7}} these places, not merely as tourist attractions, but as living connections to their roots. ' +
        'Organisations like the National Heritage Board also fund projects to {{8}} traditional crafts such as Peranakan beadwork and Malay silat. ' +
        'Each effort, however small, helps to slow the {{9}} of cultural memory. ' +
        'Together, they ensure that the stories of earlier generations will not be forgotten, but will continue to enrich the {{10}} of the nation.',
      answers: ['preserve', 'tangible', 'evoke', 'chronicle', 'vanish', 'testament', 'cherish', 'revive', 'erosion', 'heritage'],
      leftOver: ['restore', 'commemorate'],
      skill: 'vocabCloze',
      practiseTarget: 'word-vault',
    },

    sectionE: {
      title: 'Section E: Situational Writing',
      marks: 15,
      instructions: 'Study the information below carefully and write your response in about 100–120 words.',
      format: 'Informal Note / Letter',
      purpose: 'To invite your cousin, who lives overseas, to join your family on a heritage trail walk in Singapore.',
      audience: 'Your overseas cousin, Reuben',
      context:
        'Your cousin Reuben is visiting Singapore for two weeks in June. ' +
        'You have planned a self-guided heritage trail walk in Chinatown on 12 June and would like him to join your family. ' +
        'The walk will last about two hours and end with a meal at a hawker centre.',
      bullets: [
        'Invite Reuben warmly and tell him about the heritage trail walk.',
        'Describe what he can expect to see or learn during the walk.',
        'Suggest what he should bring or wear, and mention the meal afterwards.',
      ],
      wordCount: '100–120 words',
      modelAnswer:
        'Dear Reuben,\n\n' +
        'How exciting that you\'re coming to Singapore! I have something fun planned for us on 12 June — a heritage trail walk through Chinatown. I can\'t wait for you to experience it!\n\n' +
        'During the two-hour walk, we\'ll explore beautifully conserved shophouses, ancient temples, and colourful street markets. You\'ll learn so much about Singapore\'s history and the different communities that shaped it. It will be like stepping back in time!\n\n' +
        'Do wear comfortable walking shoes and bring a water bottle — it can get quite warm. After the walk, we\'ll end with a delicious hawker meal. Trust me, you\'re going to love it.\n\n' +
        'See you soon!\nYour cousin,\nAlex',
      rubric: {
        taskFulfillment: 'All 3 bullet points addressed; warm, informal tone suitable for a letter to a cousin; proper opening and sign-off.',
        language: 'Friendly register; correct grammar; natural use of informal expressions.',
        organisation: 'Logical flow from invitation to description to practical advice.',
      },
    },

    sectionF: {
      title: 'Section F: Synthesis & Transformation',
      marks: 10,
      instructions: 'For each question, rewrite the sentence(s) so that the meaning stays the same. Use the word(s) given and do not change them.',
      items: [
        {
          q: 'If the developers had respected the conservation guidelines, the heritage shophouses would not have been torn down.',
          stem: 'Had the developers ___',
          answer: 'Had the developers respected the conservation guidelines, the heritage shophouses would not have been torn down.',
          alternates: [],
          requiredGroups: [
            ["respected", "followed", "observed"],
            ["would not have been", "would not be", "would have been preserved"],
          ],
          skill: 'conditionals',
          explain: 'Type 3 conditional inversion: "Had + subject + past participle" replaces "If + subject + had + past participle".',
        },
        {
          q: '"When did the district first receive conservation status?" the journalist asked the historian.',
          stem: 'The journalist asked the historian ___',
          answer: 'The journalist asked the historian when the district had first received conservation status.',
          alternates: ['The journalist asked the historian when the district first received conservation status.'],
          requiredGroups: [
            ["when the district", "when the area"],
            ["received conservation status", "received the status", "had first received"],
          ],
          skill: 'reportedSpeech',
          explain: 'Reported wh-question: "asked + when/what/where + subject + verb (backshifted)".',
        },
        {
          q: 'No sooner had the restoration team finished work on the temple than a flood damaged part of the newly repaired roof.',
          stem: 'The restoration team had barely ___',
          answer: 'The restoration team had barely finished work on the temple when a flood damaged part of the newly repaired roof.',
          alternates: ['The restoration team had barely finished work on the temple before a flood damaged part of the newly repaired roof.'],
          requiredGroups: [
            ["had barely finished", "barely finished"],
            ["flood damaged", "damaged"],
          ],
          skill: 'conjunctions',
          explain: '"Barely/scarcely + past perfect ... when/before" is equivalent to "No sooner had ... than".',
        },
        {
          q: 'The old lighthouse stands at the tip of the peninsula. A new visitor centre has been built beside it.',
          stem: 'The old lighthouse, beside ___',
          answer: 'The old lighthouse, beside which a new visitor centre has been built, stands at the tip of the peninsula.',
          alternates: [],
          requiredGroups: [
            ["beside which", "next to which"],
            ["visitor centre", "visitor center"],
          ],
          skill: 'relativeClauses',
          explain: 'Preposition + relative pronoun: "beside which" creates a non-restrictive relative clause.',
        },
        {
          q: 'The museum attracted so many visitors that the curators extended the exhibition by another month.',
          stem: 'The museum attracted such ___',
          answer: 'The museum attracted such a large number of visitors that the curators extended the exhibition by another month.',
          alternates: ['The museum attracted such crowds that the curators extended the exhibition by another month.'],
          requiredGroups: [
            ["such a large number", "such crowds", "such many visitors"],
            ["extended", "lengthened", "prolonged"],
          ],
          skill: 'conjunctions',
          explain: '"Such + noun phrase + that" — equivalent to "so + adjective/adverb + that".',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word.',
      text:
        'For centuries, Singapore\'s waterways served as the arteries of commerce. Bumboats laden {{1}} pepper, gambier, and rice navigated the Singapore River, {{2}} its banks teemed with merchants, coolies, and hawkers. ' +
        'The river was noisy, dirty, and perpetually busy — a far cry {{3}} the peaceful promenade it is today. ' +
        'By the 1970s, however, the Singapore River had become severely polluted. ' +
        'Factories and squatters had dumped waste directly into the water for decades, {{4}} the river virtually lifeless. ' +
        'In 1977, Prime Minister Lee Kuan Yew issued a directive {{5}} the river be cleaned within ten years. ' +
        'The task was {{6}} as monumental — thousands of families had to be relocated and hundreds of businesses rehoused. ' +
        'Nevertheless, the government pressed ahead {{7}} determination. ' +
        'Bit {{8}} bit, the water began to clear. Fish returned, and water birds were seen along the banks {{9}} the first time in a generation. ' +
        'By 1987, ten years after the cleanup began, the river had been transformed. ' +
        'Today, boat quays and riverside restaurants occupy {{10}} was once a chaotic working waterfront.',
      answers: ['with', 'where', 'from', 'rendering', 'that', 'described', 'with', 'by', 'for', 'what'],
      accept: [
        [],
        ['whose', 'and its'],
        [],
        ['leaving', 'making'],
        [],
        ['regarded', 'seen', 'viewed'],
        [],
        [],
        [],
        [],
      ],
      skill: 'comprehensionCloze',
      practiseTarget: 'cloze-castle',
    },

    sectionH: {
      title: 'Section H: Comprehension',
      marks: 15,
      passage:
        'Madam Koh Wei Lan is ninety-one years old. She lives in a studio flat in Toa Payoh, surrounded by faded photographs and the smell of freshly brewed chrysanthemum tea. When she speaks, her Mandarin is rich with expressions that few people under the age of sixty still know. To spend an hour with Madam Koh is to step into a Singapore that has all but vanished.\n\n' +
        'Madam Koh was born in 1935 in a kampong near Geylang. She grew up in a wooden house on stilts, sharing it with her parents, grandparents, and five siblings. Water came from a communal standpipe; light came from oil lamps. Yet she recalls that period not with bitterness but with warmth. "We had nothing," she says, "but we had each other."\n\n' +
        'Life changed dramatically after Singapore\'s independence in 1965. Madam Koh\'s kampong was demolished in 1972 as part of a nationwide resettlement programme. She and her family were moved to a three-room HDB flat in Toa Payoh. The transition was not easy. "The flat was cleaner and safer," she concedes, "but there was no more catching of fish in the drains, no more gathering under the banyan tree."\n\n' +
        'Today, Madam Koh participates in an oral history project run by university students. Every month, she sits with a student researcher and recounts her memories, which are recorded, transcribed, and archived. She has described the texture of the grass in the kampong, the sound of the 6 a.m. water pump, and the taste of her mother\'s durian kueh. "I am not talking for myself," she explains. "I am talking for all the people who lived like I did. Someone must remember."\n\n' +
        'The project coordinator, Dr Siti Mariam, believes that oral history is irreplaceable. Photographs capture moments; documents record facts; but only a living voice can convey the emotional truth of an era. "When Madam Koh describes the scent of attap palm after a monsoon rain," Dr Siti says, "you are transported. No textbook can do that."\n\n' +
        'Madam Koh has one request for the young researchers who visit her: that they share her stories with their own children one day. "History is not just in books," she says, her eyes bright. "It lives in people. And people don\'t last forever."',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'What does the phrase "a Singapore that has all but vanished" (paragraph 1) suggest?',
          choices: [
            'Singapore has completely disappeared and no longer exists.',
            'The Singapore that Madam Koh knew has nearly ceased to exist.',
            'Madam Koh has forgotten most of what Singapore used to look like.',
            'Singapore has been replaced by a foreign country.',
          ],
          answer: 'The Singapore that Madam Koh knew has nearly ceased to exist.',
          explain: '"All but vanished" means almost completely gone — the old Singapore is nearly, but not entirely, gone.',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'Why did Madam Koh say "we had nothing, but we had each other" (paragraph 2)?',
          choices: [
            'She wanted to criticise the government for neglecting her kampong.',
            'She was explaining that material poverty was offset by close community bonds.',
            'She meant that her family owned no land and had to borrow from neighbours.',
            'She regretted that her siblings had all passed away.',
          ],
          answer: 'She was explaining that material poverty was offset by close community bonds.',
          explain: 'She recalls the kampong "not with bitterness but with warmth" — suggesting the community closeness made up for the lack of material goods.',
        },
        {
          type: 'short',
          marks: 1,
          q: 'Find a word in paragraph 3 that means "admits something reluctantly".',
          model: 'concedes',
          keywords: ['concedes'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'According to paragraph 4, what specific details did Madam Koh share with the student researchers?',
          model: 'She described the texture of the grass in the kampong, the sound of the 6 a.m. water pump, and the taste of her mother\'s durian kueh.',
          keywords: ['grass', 'water pump', 'durian kueh', 'texture', 'sound', 'taste'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What does Dr Siti Mariam believe oral history can do that photographs and documents cannot?',
          model: 'She believes oral history can convey the emotional truth of an era — a living voice can transport the listener in a way that photographs and documents cannot.',
          keywords: ['emotional truth', 'living voice', 'transported', 'convey'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'Why does Madam Koh say "I am not talking for myself" (paragraph 4)?',
          model: 'She means she is preserving the memories on behalf of all the people who lived in kampongs like she did, not just for her own benefit.',
          keywords: ['on behalf of', 'all people', 'lived like', 'remember'],
        },
        {
          type: 'inference',
          marks: 2,
          q: 'What do you learn about Madam Koh\'s attitude towards the past from the passage? Support your answer with two pieces of evidence.',
          model: 'Madam Koh feels nostalgic about the kampong years but does not resent the changes. First, she recalls her childhood "not with bitterness but with warmth", showing she treasures those memories. Second, her request that young researchers share her stories with their own children shows she is forward-looking — she wants the past to live on, not be mourned.',
          keywords: ['nostalgic', 'warmth', 'no bitterness', 'forward-looking', 'treasures', 'share'],
        },
        {
          type: 'open',
          marks: 5,
          q: 'Madam Koh says "History is not just in books — it lives in people." Do you agree? Give two reasons for your view.',
          model: 'Yes, I agree strongly. First, personal memories contain details that official records never capture — the feeling of a place, the sounds and smells of daily life, and the emotions of ordinary people. These humanise history in a way that textbooks cannot. Second, the living testimonies of individuals like Madam Koh create a direct emotional connection between the past and the present, inspiring young people to appreciate and preserve their cultural heritage.',
          keywords: ['personal memories', 'emotions', 'humanise', 'connection', 'heritage', 'ordinary people'],
        },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════════
     TERM 4  —  Technology & Sports  (balanced review)
  ══════════════════════════════════════════════════════════════════ */
  T4: {
    id: 'p5-test-term-4',
    term: 'T4',
    level: 'P5',
    label: 'Term 4 Practice Test (Balanced Review)',
    duration: '1 h 30 min',
    totalMarks: 85,
    blurb: 'P5 Term 4 balanced paper — all grammar skills reviewed, modals of deduction and regret, "not only...but also". Situational Writing: Speech. Comprehension: esports and youth competitive gaming.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      items: [
        {
          q: 'The competition rules ___ be followed strictly or participants will be disqualified.',
          choices: ['should', 'must', 'might', 'could'],
          answer: 'must',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Must" expresses strict obligation or strong necessity.',
        },
        {
          q: 'The coach ___ not have trained the team properly — they lost all five matches last season.',
          choices: ['could', 'would', 'should', 'must'],
          answer: 'should',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Should not have + past participle" expresses criticism or regret about a past action — the coach ought to have trained them better.',
        },
        {
          q: 'The new gaming centre, ___ opened last month, is already fully booked for the next three weeks.',
          choices: ['that', 'which', 'who', 'whose'],
          answer: 'which',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Which" introduces a non-restrictive clause about a thing (the gaming centre).',
        },
        {
          q: 'He asked the instructor ___ the equipment should be returned after each session.',
          choices: ['when', 'that', 'which', 'whom'],
          answer: 'when',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'Reported wh-question: "asked + when + subject + should be returned".',
        },
        {
          q: 'If the team ___ practised harder, they would have qualified for the regional finals.',
          choices: ['had', 'has', 'have', 'would have'],
          answer: 'had',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 3 conditional: "If + past perfect (had + past participle) → would have + past participle".',
        },
        {
          q: '___ the match results announced, the stadium erupted in deafening cheers.',
          choices: ['With', 'Once', 'Upon', 'Having'],
          answer: 'Upon',
          skill: 'mixedGrammar',
          practiseTarget: 'grammar-mcq',
          explain: '"Upon + gerund/noun" — a formal participial construction meaning "immediately after".',
        },
        {
          q: 'Not only ___ the highest score in the tournament, but she also set a new national record.',
          choices: ['she achieved', 'did she achieve', 'she did achieve', 'achieved she'],
          answer: 'did she achieve',
          skill: 'conjunctions',
          practiseTarget: 'grammar-mcq',
          explain: '"Not only" at the start of a clause triggers subject-auxiliary inversion.',
        },
        {
          q: 'The amount of hours young gamers spend online ___ a growing concern for health experts.',
          choices: ['are', 'were', 'is', 'have been'],
          answer: 'is',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: '"The amount of + uncountable noun" takes a singular verb.',
        },
        {
          q: 'The team ___ enjoyed competing had to withdraw after two of its members fell ill.',
          choices: ['who', 'that', 'whom', 'which'],
          answer: 'that',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"That" is used in a restrictive relative clause — the clause identifies which team.',
        },
        {
          q: 'The competitors were ___ exhausted after the finals that they could barely lift their trophies.',
          choices: ['as', 'too', 'so', 'more'],
          answer: 'so',
          skill: 'conjunctions',
          practiseTarget: 'grammar-mcq',
          explain: '"So + adjective + that" — result clause expressing the degree of exhaustion.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'By leaving the company without handing over his responsibilities, the director had effectively ___ any chance of returning.',
          choices: ['read between the lines', 'burned his bridges', 'taken a back seat', 'turned over a new leaf'],
          answer: 'burned his bridges',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Burn your bridges" means to do something that destroys your chances of going back.',
        },
        {
          q: 'The coach called the final training session before the championship "the last piece of the puzzle" — he meant it was the ___ preparation needed.',
          choices: ['last', 'final', 'missing', 'only'],
          answer: 'missing',
          skill: 'similes',
          practiseTarget: 'vocab-mcq',
          explain: '"Last piece of the puzzle" is a metaphor; here it means the missing element that completes preparation.',
        },
        {
          q: 'The technology company\'s breakthrough in battery design ___ a new era in electric vehicle travel.',
          choices: ['announced', 'marked', 'opened', 'ushered in'],
          answer: 'ushered in',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Usher in a new era" is the standard collocation for marking the start of a new period.',
        },
        {
          q: 'The word "compete" gives us ___ forms: competition (noun), competitive (adjective), and competitor (person noun).',
          choices: ['root', 'derived', 'base', 'connected'],
          answer: 'derived',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: '"Derived forms" are words formed from a root by adding affixes.',
        },
        {
          q: '"Confident" and "arrogant" are related in meaning but differ: a confident person believes in themselves, while an arrogant person ___.',
          choices: ['is very quiet and reserved', 'feels superior and looks down on others', 'is overly enthusiastic about their hobby', 'is nervous about their performance'],
          answer: 'feels superior and looks down on others',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: 'Arrogance involves a sense of superiority and looking down on others — beyond mere confidence.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word from the word bank. You may use a word more than once, and some words will be left over.',
      wordBank: ['not', 'been', 'which', 'had', 'so', 'whether', 'their', 'having', 'as', 'only', 'who', 'though'],
      text:
        'Esports — competitive video gaming — has grown from a niche hobby into a global industry worth billions of dollars. ' +
        'Professional gamers, {{1}} practise up to twelve hours a day, compete for prize pools {{2}} sometimes rival those of traditional sports championships. ' +
        'Singapore has {{3}} been slow to recognise this shift. The Singapore Esports Association was established to formalise {{4}} efforts to develop local talent. ' +
        '{{5}} opponents of esports claim it promotes unhealthy screen habits, supporters argue that gaming develops teamwork, strategic thinking, and lightning-fast reflexes. ' +
        'The debate over {{6}} esports should be classified as a legitimate sport remains unresolved. ' +
        'What is clear is that more young Singaporeans are choosing to pursue gaming {{7}} a career aspiration, {{8}} just a pastime. ' +
        'Schools have begun to offer esports clubs, recognising that students who are passionate about gaming are {{9}} only developing technical skills but also learning to manage pressure and collaborate under competition conditions. ' +
        '{{10}} competed at a high level, many young gamers report a significant improvement in their ability to focus and solve problems quickly.',
      answers: ['who', 'which', 'not', 'their', 'Though', 'whether', 'as', 'not', 'not', 'Having'],
      leftOver: ['been', 'had', 'so', 'only'],
      skill: 'mixedGrammar',
      practiseTarget: 'cloze-castle',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word from the word bank. Each word may be used only once. Two words will be left over.',
      wordBank: ['resilience', 'excel', 'setback', 'rigorous', 'dedication', 'triumph', 'breakthrough', 'perseverance', 'elite', 'hone', 'aspiration', 'discipline'],
      text:
        'Behind every sporting champion lies years of invisible effort. To {{1}} in any competitive arena, an athlete must commit to a {{2}} training programme that pushes mind and body to their limits. ' +
        'The qualities that separate a good athlete from a great one are rarely physical — they are mental. ' +
        '{{3}} allows a competitor to keep going when results are discouraging. ' +
        'Every champion has faced a major {{4}} at some point — a failed audition, a serious injury, or a crushing defeat. ' +
        'What distinguishes them is the ability to see each failure not as an end but as a lesson. ' +
        'Young athletes who wish to join the {{5}} ranks of professional sport must be willing to {{6}} their skills relentlessly, practising the same movements thousands of times until they become second nature. ' +
        'The {{7}} to compete professionally begins early in life, often fuelled by a mentor who believes in the athlete\'s potential. ' +
        'True {{8}} on the sporting field is rarely the result of talent alone — it is the product of years of quiet {{9}}. ' +
        'And when the {{10}} finally comes — when the athlete steps onto the podium — all the sacrifices feel worthwhile.',
      answers: ['excel', 'rigorous', 'resilience', 'setback', 'elite', 'hone', 'aspiration', 'triumph', 'dedication', 'breakthrough'],
      leftOver: ['discipline', 'perseverance'],
      skill: 'vocabCloze',
      practiseTarget: 'word-vault',
    },

    sectionE: {
      title: 'Section E: Situational Writing',
      marks: 15,
      instructions: 'Study the information below carefully and write your response in about 100–120 words.',
      format: 'Speech / Talk',
      purpose: 'To give a short speech at your school\'s Healthy Lifestyle Day, encouraging classmates to balance their screen time with physical activity.',
      audience: 'Your schoolmates and teachers at the school assembly',
      context:
        'Your school is holding a Healthy Lifestyle Day. You have been chosen to give a two-minute speech during the morning assembly. ' +
        'Your teacher has asked you to speak about the importance of balancing gaming and screen time with exercise and outdoor activity.',
      bullets: [
        'Acknowledge that gaming and screen time can be enjoyable and even educational.',
        'Explain the health risks of too much screen time without physical breaks.',
        'Encourage schoolmates to try a specific activity (e.g. walking, cycling, swimming) to balance their routine.',
      ],
      wordCount: '100–120 words',
      modelAnswer:
        'Good morning, teachers and fellow students.\n\n' +
        'We all enjoy gaming or scrolling through videos — and there\'s nothing wrong with that. In fact, some games sharpen our thinking and teach us to work as a team. But when screen time becomes excessive, the consequences can be serious. Poor posture, strained eyes, disrupted sleep, and reduced fitness are all linked to spending too many hours in front of a screen.\n\n' +
        'I\'d like to challenge every one of you to try just thirty minutes of physical activity each day. Whether it\'s cycling around the neighbourhood, swimming a few laps, or even a brisk walk, the benefits are enormous.\n\n' +
        'Balance is the key. Take care of yourselves. Thank you.',
      rubric: {
        taskFulfillment: 'All 3 bullet points addressed; appropriate speech format with greeting and closing; persuasive but balanced tone.',
        language: 'Confident, direct language; rhetorical devices (challenge, direct address); correct grammar.',
        organisation: 'Logical structure: acknowledgement of gaming value, health risks, call to action.',
      },
    },

    sectionF: {
      title: 'Section F: Synthesis & Transformation',
      marks: 10,
      instructions: 'For each question, rewrite the sentence(s) so that the meaning stays the same. Use the word(s) given and do not change them.',
      items: [
        {
          q: 'Not only did the young swimmer break the school record, but she also qualified for the national trials.',
          stem: 'In addition to ___',
          answer: 'In addition to breaking the school record, the young swimmer also qualified for the national trials.',
          alternates: ['In addition to breaking the school record, she also qualified for the national trials.'],
          requiredGroups: [
            ["breaking the school record", "breaking the record"],
            ["qualified", "made it"],
          ],
          skill: 'conjunctions',
          explain: '"In addition to + gerund" rephrases "Not only ... but also".',
        },
        {
          q: 'The esports arena was so crowded that the organisers had to turn away several spectators.',
          stem: 'So crowded ___',
          answer: 'So crowded was the esports arena that the organisers had to turn away several spectators.',
          alternates: [],
          requiredGroups: [
            ["so crowded", "so packed"],
            ["turn away", "reject", "refuse"],
          ],
          skill: 'conjunctions',
          explain: '"So + adjective + was + subject + that" — fronted inversion for emphasis.',
        },
        {
          q: '"Has the new stadium been officially opened yet?" the reporter asked the minister.',
          stem: 'The reporter asked the minister ___',
          answer: 'The reporter asked the minister whether the new stadium had been officially opened yet.',
          alternates: ['The reporter asked the minister if the new stadium had been officially opened yet.'],
          requiredGroups: [
            ["whether", "if"],
            ["had been officially opened", "had been opened", "had opened"],
          ],
          skill: 'reportedSpeech',
          explain: 'Reported yes/no question in passive: "asked + whether/if + subject + had been + past participle".',
        },
        {
          q: 'If the coach had spotted the athlete\'s talent earlier, he would have given her more opportunities.',
          stem: 'Had ___',
          answer: 'Had the coach spotted the athlete\'s talent earlier, he would have given her more opportunities.',
          alternates: [],
          requiredGroups: [
            ["spotted", "noticed", "identified"],
            ["would have given", "would have offered", "would have provided"],
          ],
          skill: 'conditionals',
          explain: 'Type 3 conditional inversion: "Had + subject + past participle".',
        },
        {
          q: 'The medal ceremony was held in the main stadium. Thousands of fans had gathered there.',
          stem: 'The medal ceremony was held in the main stadium, where ___',
          answer: 'The medal ceremony was held in the main stadium, where thousands of fans had gathered.',
          alternates: [],
          requiredGroups: [
            ["where thousands", "where fans"],
            ["had gathered", "gathered", "were present"],
          ],
          skill: 'relativeClauses',
          explain: '"Where" introduces a non-restrictive relative clause referring to a place.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word.',
      text:
        'Competitive esports is no longer a pastime reserved for teenagers in their bedrooms. ' +
        'Today, it is a profession {{1}} attracts sponsorship from multinational corporations and draws stadium audiences {{2}} the thousands. ' +
        'Singapore hosted its first international esports championship in 2019, {{3}} teams from over thirty countries competed for a prize pool of two million dollars. ' +
        'The event was {{4}} popular that organisers had to introduce an online ticketing system to manage demand. ' +
        'Not everyone, {{5}}, views the rise of esports positively. ' +
        'Health professionals warn that professional gamers face {{6}} risks of repetitive strain injury and sleep deprivation. ' +
        'Many top competitors burn out in {{7}} mid-twenties, their reflexes slowing {{8}} the relentless demands of elite-level play. ' +
        'The solution, most coaches agree, lies in structured rest and {{9}} preparation — training that includes not only gameplay {{10}} physical exercise, mental coaching and nutrition planning.',
      answers: ['that', 'in', 'where', 'so', 'however', 'significant', 'their', 'under', 'holistic', 'but'],
      accept: [
        ['which'],
        [],
        ['when', 'as'],
        [],
        ['though', 'nevertheless'],
        ['serious', 'real', 'genuine', 'considerable'],
        [],
        ['from', 'due to'],
        ['comprehensive', 'balanced'],
        ['also'],
      ],
      skill: 'comprehensionCloze',
      practiseTarget: 'cloze-castle',
    },

    sectionH: {
      title: 'Section H: Comprehension',
      marks: 15,
      passage:
        'At sixteen, Darren Loh was already ranked among the top fifty esports players in Southeast Asia. His speciality was a real-time strategy game called Fortress Command, which required players to simultaneously manage resources, direct units, and anticipate their opponents\' moves — all within fractions of a second. His bedroom wall was plastered with print-outs of his best strategies, and his sleep schedule was built around international tournament times.\n\n' +
        'Darren\'s parents, both civil servants, had not objected to his gaming at first. They had assumed it was a phase — something he would grow out of once examinations loomed. But by Secondary Three, it was clear that Darren had no intention of giving up. When his ranking climbed high enough to attract a sponsorship offer from a regional gaming company, they could no longer ignore the question: was this a viable future, or a dangerous distraction?\n\n' +
        '"We were genuinely torn," admits his mother, Mdm Loh Bee Cheng. "On one hand, we had always told him to pursue his passion. On the other, we worried about his health, his studies, and what would happen if it all came to nothing."\n\n' +
        'A compromise was reached. Darren would accept the sponsorship but agree to maintain his grades at a minimum of B average and limit his daily practice to six hours. A sports psychologist was brought in to help him manage competition stress and prevent burnout.\n\n' +
        'Three years later, Darren is now studying computer science at a local university while competing semi-professionally on weekends. He credits the structured approach for keeping him grounded. "Gaming taught me everything I now apply in my studies," he says. "Pattern recognition, resource management, staying calm under pressure — these are life skills."\n\n' +
        'His story is becoming less exceptional in Singapore, where the government has begun to explore how esports skills might translate into careers in game development, data analytics, and cybersecurity. For Darren, the journey from bedroom gamer to semi-professional competitor has been the most demanding — and most rewarding — experience of his life.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'Why did Darren\'s parents initially not object to his gaming (paragraph 2)?',
          choices: [
            'They believed gaming would help Darren with his school subjects.',
            'They thought it was a temporary interest that would fade.',
            'They were planning to enroll him in a professional esports academy.',
            'They saw gaming as an important social activity for teenagers.',
          ],
          answer: 'They thought it was a temporary interest that would fade.',
          explain: 'Paragraph 2: "They had assumed it was a phase — something he would grow out of once examinations loomed."',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'What does "genuinely torn" (paragraph 3) suggest about Darren\'s parents?',
          choices: [
            'They were angry with Darren for neglecting his studies.',
            'They could not reach a decision and felt deeply conflicted.',
            'They had decided to support Darren but were hiding their doubts.',
            'They were excited about the sponsorship offer.',
          ],
          answer: 'They could not reach a decision and felt deeply conflicted.',
          explain: '"Torn" means divided — they had strong reasons both for and against supporting Darren\'s gaming career.',
        },
        {
          type: 'short',
          marks: 1,
          q: 'Find a phrase in paragraph 1 that shows Darren\'s dedication to competitive gaming.',
          model: 'his sleep schedule was built around international tournament times',
          keywords: ['sleep schedule', 'tournament times', 'print-outs', 'strategies'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What conditions did Darren agree to as part of the family compromise (paragraph 4)?',
          model: 'He agreed to maintain a minimum B average in his studies and limit his daily practice to six hours.',
          keywords: ['B average', 'six hours', 'grades', 'limit'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'According to Darren (paragraph 5), what skills did gaming teach him that are also useful in life?',
          model: 'Gaming taught him pattern recognition, resource management, and the ability to stay calm under pressure.',
          keywords: ['pattern recognition', 'resource management', 'calm under pressure'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'According to paragraph 6, in what areas might esports skills be used as careers in Singapore?',
          model: 'The government is exploring careers in game development, data analytics, and cybersecurity.',
          keywords: ['game development', 'data analytics', 'cybersecurity'],
        },
        {
          type: 'inference',
          marks: 2,
          q: 'What do you learn about the relationship between Darren and his parents from the passage? Support your answer with evidence.',
          model: 'The relationship is one of mutual respect and open communication. Darren\'s parents did not forbid his gaming outright, but expressed their concerns honestly. Rather than ignoring their worries, Darren agreed to the compromise conditions, suggesting he valued their opinion. The compromise itself — not a ban, but a set of boundaries — shows that both sides were willing to listen.',
          keywords: ['mutual respect', 'communication', 'compromise', 'concerns', 'valued', 'open'],
        },
        {
          type: 'open',
          marks: 5,
          q: 'Darren says gaming taught him "life skills" such as pattern recognition, resource management, and staying calm under pressure. Do you agree that hobbies can teach important life skills? Give two reasons for your view.',
          model: 'Yes, hobbies absolutely teach important life skills. First, any hobby that involves challenge — whether it is chess, sport, or even cooking — requires persistence. Overcoming difficulties in a hobby builds resilience that transfers to school and work. Second, hobbies that involve planning or strategy, like gaming, coding, or music, develop analytical thinking. These mental skills are directly applicable to problem-solving in academic subjects and future careers.',
          keywords: ['persistence', 'resilience', 'analytical thinking', 'strategy', 'challenge', 'transferable'],
        },
      ],
    },
  },
});

/* ─────────────────────────────────────────────── */
/* Accessor helpers                                */
/* ─────────────────────────────────────────────── */

export function getP5PracticeTests() {
  return P5_PRACTICE_TEST_TERMS.map(term => P5_PRACTICE_TESTS[term]);
}

export function getP5PracticeTest(term) {
  return P5_PRACTICE_TESTS[term] || null;
}

/**
 * Validate the P5 practice test bank.
 * Returns an array of issue strings (empty array = all OK).
 */
export function validateP5PracticeTests(bank = P5_PRACTICE_TESTS) {
  const issues = [];
  const blankRe = /\{\{(\d+)\}\}/g;

  for (const term of P5_PRACTICE_TEST_TERMS) {
    const test = bank?.[term];
    const tag = `P5/${term}`;
    if (!test) { issues.push(`${tag}: missing`); continue; }
    if (test.level !== 'P5') issues.push(`${tag}: level must be P5`);

    // Section A — 10 MCQ items
    const sA = test.sectionA;
    if (!sA || !Array.isArray(sA.items) || sA.items.length !== 10) {
      issues.push(`${tag}/sectionA: must have 10 items`);
    } else {
      checkMcqItems(issues, `${tag}/sectionA`, sA.items, 4);
    }

    // Section B — 5 MCQ items
    const sB = test.sectionB;
    if (!sB || !Array.isArray(sB.items) || sB.items.length !== 5) {
      issues.push(`${tag}/sectionB: must have 5 items`);
    } else {
      checkMcqItems(issues, `${tag}/sectionB`, sB.items, 4);
    }

    // Sections C & D — cloze with 10 blanks, word bank of 12
    for (const key of ['sectionC', 'sectionD']) {
      const s = test[key];
      if (!s) { issues.push(`${tag}/${key}: missing`); continue; }
      const blanks = [...(s.text || '').matchAll(blankRe)].map(m => Number(m[1]));
      if (blanks.length !== 10) issues.push(`${tag}/${key}: expected 10 blanks, found ${blanks.length}`);
      if (!Array.isArray(s.answers) || s.answers.length !== 10)
        issues.push(`${tag}/${key}: expected 10 answers`);
      if (!Array.isArray(s.wordBank) || s.wordBank.length !== 12)
        issues.push(`${tag}/${key}: word bank should have 12 words (10 used + 2 left over)`);
      const bankLower = (s.wordBank || []).map(w => w.toLowerCase());
      for (const a of s.answers || []) {
        if (!bankLower.includes(String(a).toLowerCase()))
          issues.push(`${tag}/${key}: answer "${a}" missing from word bank`);
      }
    }

    // Section E — situational writing
    const sE = test.sectionE;
    if (!sE || typeof sE.modelAnswer !== 'string' || !sE.modelAnswer.trim())
      issues.push(`${tag}/sectionE: missing modelAnswer`);
    if (!Array.isArray(sE?.bullets) || sE.bullets.length !== 3)
      issues.push(`${tag}/sectionE: need exactly 3 bullet points`);

    // Section F — synthesis & transformation: 5 items
    const sF = test.sectionF;
    if (!sF || !Array.isArray(sF.items) || sF.items.length !== 5)
      issues.push(`${tag}/sectionF: must have 5 items`);

    // Section G — comprehension cloze (open, 10 blanks)
    const sG = test.sectionG;
    if (!sG) {
      issues.push(`${tag}/sectionG: missing`);
    } else {
      const blanks = [...(sG.text || '').matchAll(blankRe)].map(m => Number(m[1]));
      if (blanks.length !== 10) issues.push(`${tag}/sectionG: expected 10 blanks, found ${blanks.length}`);
      if (!Array.isArray(sG.answers) || sG.answers.length !== 10)
        issues.push(`${tag}/sectionG: expected 10 answers`);
    }

    // Section H — comprehension
    const sH = test.sectionH;
    if (!sH || typeof sH.passage !== 'string' || !sH.passage.trim())
      issues.push(`${tag}/sectionH: missing passage`);
    if (!Array.isArray(sH?.questions) || sH.questions.length < 6)
      issues.push(`${tag}/sectionH: needs at least 6 questions`);

    // Per-section mark/blank alignment — gradable inputs × standard weight should equal section.marks.
    // This prevents the rendered "X marks" label drifting away from the
    // grader's actual capacity. Writing (sectionE) is self-assessed; its
    // marks are exempt from this check.
    checkSectionMarks(issues, `${tag}/sectionA`, sA, 'mcq', 10);
    checkSectionMarks(issues, `${tag}/sectionB`, sB, 'mcq', 5);
    checkSectionMarks(issues, `${tag}/sectionC`, test.sectionC, 'cloze', 10);
    checkSectionMarks(issues, `${tag}/sectionD`, test.sectionD, 'cloze', 10);
    checkSectionMarks(issues, `${tag}/sectionF`, test.sectionF, 'synthesis', 5);
    checkSectionMarks(issues, `${tag}/sectionG`, test.sectionG, 'cloze', 10);

    // Marks total — sum across EVERY rendered section, not just A–H.
    // Section I exists in some papers and is rendered/graded; excluding it
    // from this check let mark mismatches sneak past unnoticed.
    const markKeys = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF', 'sectionG', 'sectionH', 'sectionI'];
    const total = markKeys.reduce((acc, k) => acc + (test[k]?.marks || 0), 0);
    if (total !== test.totalMarks)
      issues.push(`${tag}: section marks sum to ${total} but totalMarks=${test.totalMarks}`);
  }

  return issues;
}
