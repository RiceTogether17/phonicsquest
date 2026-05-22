/**
 * PhonicsQuest – Primary 4 Practice Test Papers
 *
 * Four full school-style P4 English practice papers, one per term.
 * Each paper mirrors the real Singapore P4 English Continual Assessment
 * format used by many primary schools:
 *
 *   Section A — Grammar MCQ          (10 items, 10 marks)
 *   Section B — Vocabulary MCQ       ( 5 items,  5 marks)
 *   Section C — Grammar Cloze        ( 5 blanks, 5 marks)   word box, one word left over
 *   Section D — Vocabulary Cloze     ( 5 blanks, 5 marks)   word box, one word left over
 *   Section E — Editing              ( 5 errors, 5 marks)   grammar, spelling & punctuation
 *   Section F — Synthesis & Trans.   ( 5 items,  5 marks)   sentence rewriting
 *   Section G — Comprehension        (         , 20 marks)  passage + mixed question types
 *
 * Total per paper: 55 marks · Duration: 1 h 10 min
 *
 * Skill coverage rotation across the four terms:
 *   T1 — passive voice (simple present/past), relative clauses (who/which/whose/that)
 *   T2 — reported speech, Type 1 conditionals, modals
 *   T3 — past perfect, connectors (although/despite/unless/not only…but also)
 *   T4 — review of all P4 skills
 *
 * Every MCQ item carries:
 *   skill          — category key matching grammarCategories / vocabCategories
 *   practiseTarget — module key ('grammar-mcq' | 'vocab-mcq' | ...)
 *   explain        — teacher-facing rationale
 *
 * Cloze format:  {{1}} … {{5}} tokens in `text`; `answers` array length 5;
 *               `wordBank` length 6 (one extra); `leftOver` array.
 * Editing format: {{N:wrongword}} or {{N:o}} (punctuation) in `paragraph`;
 *                 `errors` array length 5.
 * Synthesis format: items with { q, stem, answer, alternates, skill, explain }
 * Comprehension: passage + questions of type mcq / short / vocab / tf-reason / open
 */

import { checkEditingErrors } from './practiceTestValidators.js';

export const P4_PRACTICE_TEST_TERMS = Object.freeze(['T1', 'T2', 'T3', 'T4']);

export const P4_PRACTICE_TESTS = Object.freeze({

  /* ================================================================
     TERM 1  —  Passive voice · Relative clauses
  ================================================================ */
  T1: {
    id: 'p4-test-term-1',
    term: 'T1',
    level: 'P4',
    label: 'Term 1 Practice Test 1',
    duration: '1 h 10 min',
    totalMarks: 55,
    blurb: 'P4 Term 1 paper — introduces passive voice (simple present/past) and relative clauses (who/which/whose/that). Comprehension passage about a school visit to a recycling plant.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      instructions: 'Choose the best answer and write its letter in the brackets provided.',
      items: [
        {
          q: 'The windows ______________ every Friday by the cleaners.',
          choices: ['wipe', 'wipes', 'are wiped', 'is wiped'],
          answer: 'are wiped',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: 'Subject "windows" is plural; the action is repeated, so we use "are wiped" (simple present passive).',
        },
        {
          q: 'The trophy ______________ by our school last year.',
          choices: ['won', 'is won', 'was won', 'has won'],
          answer: 'was won',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: '"Last year" signals simple past; passive of "win" is "was won".',
        },
        {
          q: 'My aunt, ______________ works as a nurse, lives next door.',
          choices: ['who', 'which', 'whose', 'that'],
          answer: 'who',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Who" introduces a relative clause referring to a person ("my aunt").',
        },
        {
          q: 'The book ______________ I borrowed from the library is very interesting.',
          choices: ['who', 'whom', 'whose', 'which'],
          answer: 'which',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Which" is used for things ("the book"); "who" and "whom" are for people.',
        },
        {
          q: 'The student ______________ project won first prize received a medal.',
          choices: ['who', 'whom', 'whose', 'which'],
          answer: 'whose',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Whose" shows possession — the project belongs to the student.',
        },
        {
          q: 'Neither the boys nor the teacher ______________ where the keys are.',
          choices: ['know', 'knows', 'are knowing', 'have known'],
          answer: 'knows',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: 'With "Neither…nor", the verb agrees with the subject closest to it — "the teacher" is singular, so "knows".',
        },
        {
          q: 'The injured bird ______________ by the vet this morning.',
          choices: ['treat', 'treats', 'was treated', 'is treating'],
          answer: 'was treated',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: '"This morning" is a past time signal; the bird receives the action, so we use simple past passive "was treated".',
        },
        {
          q: 'Each of the students ______________ expected to submit the assignment on time.',
          choices: ['are', 'were', 'is', 'have'],
          answer: 'is',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: '"Each of" always takes a singular verb — "each of the students is".',
        },
        {
          q: 'The old bridge ______________ by a modern one next year.',
          choices: ['replaces', 'is replaced', 'will be replaced', 'has replaced'],
          answer: 'will be replaced',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: '"Next year" indicates future; the bridge receives the action, so we use "will be replaced".',
        },
        {
          q: 'The dog ______________ belongs to our neighbour often barks at night.',
          choices: ['who', 'whom', 'that', 'whose'],
          answer: 'that',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"That" can introduce a relative clause for animals or things — it is common when referring to the subject of the clause.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      instructions: 'Choose the word that best fits the meaning of each sentence.',
      items: [
        {
          q: 'The old man ______________ slightly as he walked, favouring his injured knee.',
          choices: ['strolled', 'marched', 'limped', 'shuffled'],
          answer: 'limped',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Limped" specifically describes uneven walking due to an injury — the context mentions an injured knee.',
        },
        {
          q: 'The firefighters had to ______________ precautions before entering the burning building.',
          choices: ['do', 'make', 'take', 'get'],
          answer: 'take',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Take precautions" is the correct collocation in English — you take, not make or do, precautions.',
        },
        {
          q: 'Mia could finish any task ______________ — she never needed much time to prepare.',
          choices: ['at the drop of a hat', 'over the moon', 'in the same boat', 'under the weather'],
          answer: 'at the drop of a hat',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"At the drop of a hat" means immediately, without hesitation — fits "never needed much time to prepare".',
        },
        {
          q: 'The scientist made an important ______________ after years of research.',
          choices: ['discover', 'discovers', 'discoverer', 'discovery'],
          answer: 'discovery',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: 'The noun form of "discover" is "discovery" — needed here after the article "an".',
        },
        {
          q: 'The word "ravenous" in the passage most likely means ______________ .',
          choices: ['slightly hungry', 'extremely hungry', 'pleasantly full', 'mildly thirsty'],
          answer: 'extremely hungry',
          skill: 'contextInference',
          practiseTarget: 'vocab-mcq',
          explain: '"Ravenous" means extremely hungry; the prefix and root both suggest a strong, intense hunger.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word may only be used once. There is one extra word that you will not need.',
      wordBank: ['since', 'although', 'were', 'being', 'are', 'had'],
      text:
        'Every year, the school organises a Clean-Up Day. Students {{1}} divided into groups and assigned different areas of the school to clean. ' +
        '{{2}} the work was tiring, everyone took part cheerfully. Some students {{3}} seen picking up litter along the corridors, while others swept the classrooms. ' +
        'The project {{4}} been running for five years and has become a favourite event. ' +
        '{{5}} that time, the school has won three awards for cleanliness.',
      answers: ['were', 'Although', 'were', 'had', 'Since'],
      leftOver: ['being', 'are'],
      skill: 'passiveVoice',
      practiseTarget: 'cloze-castle',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word may only be used once. There is one extra word that you will not need.',
      wordBank: ['fragile', 'observe', 'magnificent', 'cautiously', 'startled', 'examined'],
      text:
        'On a field trip to the nature reserve, Mrs Lim asked the class to {{1}} the butterflies without disturbing them. ' +
        'One student {{2}} a large blue butterfly through her magnifying glass and noticed the delicate patterns on its wings. ' +
        'She moved {{3}} so as not to frighten it. Suddenly, a younger student sneezed loudly, and the butterfly was {{4}}. ' +
        'It flew off instantly. The guide reminded the group that butterflies are {{5}} creatures that must be handled with great care.',
      answers: ['observe', 'examined', 'cautiously', 'startled', 'fragile'],
      leftOver: ['magnificent'],
      skill: 'contextInference',
      practiseTarget: 'word-vault',
    },

    sectionE: {
      title: 'Section E: Editing for Spelling and Grammar',
      marks: 5,
      instructions: 'Each underlined word contains a spelling or grammar mistake. A circle (○) shows a missing or wrong punctuation mark. Write the correct word or punctuation mark in the space provided.',
      paragraph:
        'Last week, our class {{1:visitted}} the recycling plant near our school. We {{2:was}} given hard hats to wear before entering the building. ' +
        'Our guide, Mr Tan{{3:o}} showed us how different materials are sorted and processed. ' +
        'He explained that paper, glass and metal {{4:is}} collected separately. We were {{5:amaze}} by how much waste could be turned into useful products.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'visitted', correction: 'visited', explain: '"Visited" has only one "t" — words ending in a consonant-vowel-consonant pattern only double the final consonant when the last syllable is stressed; "visit" is not stress-final.' },
        { num: 2, kind: 'grammar', wrong: 'was', correction: 'were', explain: '"We" is plural and requires "were" in simple past.' },
        { num: 3, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after "Mr Tan" to separate the appositive from the main clause.' },
        { num: 4, kind: 'grammar', wrong: 'is', correction: 'are', explain: '"Paper, glass and metal" is a plural subject (multiple items joined by "and") — use "are".' },
        { num: 5, kind: 'grammar', wrong: 'amaze', correction: 'amazed', explain: 'After "were", we need the past participle "amazed" to form the passive adjective.' },
      ],
    },

    sectionF: {
      title: 'Section F: Synthesis and Transformation',
      marks: 5,
      instructions: 'For each question, rewrite the sentence(s) using the given word(s). Do not change the meaning. Do not add unnecessary words.',
      items: [
        {
          q: 'Someone built this temple more than two hundred years ago.\nBegin with: This temple …',
          stem: 'This temple',
          answer: 'This temple was built more than two hundred years ago.',
          alternates: ['This temple was built over two hundred years ago.'],
          skill: 'passiveVoice',
          explain: 'Change the active sentence to passive: "was built" + time phrase. The agent ("someone") is dropped.',
        },
        {
          q: 'The girl won the spelling competition. Her handwriting is very neat.\nUse: whose',
          stem: 'The girl whose',
          answer: 'The girl whose handwriting is very neat won the spelling competition.',
          alternates: [],
          skill: 'relativeClauses',
          explain: '"Whose" links the relative clause to the noun "girl" by showing possession of "handwriting".',
        },
        {
          q: 'Mr Ali built the fence. He is our caretaker.\nUse: who',
          stem: 'Mr Ali',
          answer: 'Mr Ali, who is our caretaker, built the fence.',
          alternates: ['Mr Ali who is our caretaker built the fence.'],
          skill: 'relativeClauses',
          explain: 'The relative clause "who is our caretaker" adds information about Mr Ali.',
        },
        {
          q: 'The cleaners mop the hall every morning.\nBegin with: The hall …',
          stem: 'The hall',
          answer: 'The hall is mopped every morning.',
          alternates: ['The hall is mopped every morning by the cleaners.'],
          skill: 'passiveVoice',
          explain: 'Simple present passive: "is mopped" + frequency expression.',
        },
        {
          q: 'This is the restaurant. My family and I celebrated my birthday here.\nUse: where',
          stem: 'This is the restaurant where',
          answer: 'This is the restaurant where my family and I celebrated my birthday.',
          alternates: [],
          skill: 'relativeClauses',
          explain: '"Where" introduces a relative clause for places.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension',
      marks: 20,
      passage:
        'Last Tuesday, Class 4A went on a learning journey to a recycling plant at Tuas. The students were excited because none of them had ever visited such a place before.\n\n' +
        'Upon arrival, the class was welcomed by the plant manager, Mr Ramasamy. He gave the students a brief introduction on the importance of recycling. "Every day, Singapore produces thousands of tonnes of waste," he said. "If we do not recycle, our landfill will run out of space much sooner than expected."\n\n' +
        'The students then put on safety helmets and entered the main sorting hall. There, they watched in amazement as conveyor belts carried bags of waste that were torn open by large machines. Workers and machines worked together to sort the waste into groups — paper, plastic, glass and metal.\n\n' +
        'Mrs Lim, the teacher, pointed to a large bale of crushed aluminium cans. "Did you know that aluminium can be recycled repeatedly without losing quality?" she said. Several students nodded, but others looked surprised.\n\n' +
        'At the end of the visit, each student was given a small bag made from recycled plastic. "Take this home as a reminder," Mr Ramasamy said with a smile. On the bus ride back, the students were unusually quiet — each lost in thought about how their small everyday choices could make a big difference.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'Why were the students excited about the learning journey?',
          choices: [
            'They had visited the plant many times before.',
            'None of them had ever been to such a place before.',
            'They wanted to meet Mr Ramasamy.',
            'Their teacher had promised them a special gift.',
          ],
          answer: 'None of them had ever been to such a place before.',
          explain: 'Paragraph 1 states directly: "none of them had ever visited such a place before".',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'What does Mr Ramasamy\'s warning about the landfill suggest?',
          choices: [
            'Singapore already has no more space for waste.',
            'The landfill will remain usable for many more decades.',
            'Recycling is needed to prevent the landfill from filling up too quickly.',
            'Only large companies should be responsible for recycling.',
          ],
          answer: 'Recycling is needed to prevent the landfill from filling up too quickly.',
          explain: 'Mr Ramasamy says the landfill will run out sooner if people do not recycle — implying recycling extends its life.',
        },
        {
          type: 'short',
          marks: 2,
          q: 'How did the waste bags get torn open in the sorting hall?',
          model: 'They were torn open by large machines.',
          keywords: ['large machines', 'machines'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'Name two groups into which the waste was sorted in the sorting hall.',
          model: 'Paper and plastic. (Also acceptable: glass and metal. Any two of: paper, plastic, glass, metal.)',
          keywords: ['paper', 'plastic', 'glass', 'metal'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'What interesting fact did Mrs Lim share about aluminium?',
          model: 'She said that aluminium can be recycled repeatedly without losing quality.',
          keywords: ['recycled', 'quality', 'repeatedly'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a word in paragraph 4 that means "pressed together into a compact block".',
          model: 'crushed',
          keywords: ['crushed'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a phrase in paragraph 5 that means "so deep in thought that they did not notice what was around them".',
          model: 'lost in thought',
          keywords: ['lost in thought'],
        },
        {
          type: 'tf-reason',
          marks: 2,
          statement: 'The students were very talkative on the bus ride back to school.',
          answer: 'False',
          reason: 'Paragraph 5 says the students were "unusually quiet" on the bus, not talkative.',
        },
        {
          type: 'open',
          marks: 6,
          q: 'Do you think learning journeys like this one are useful for students? Give two reasons to support your answer.',
          model: 'Yes, learning journeys like this are useful. First, students get to see real-life processes (such as recycling) that they cannot experience in the classroom. Second, seeing the effects of waste first-hand makes them more aware of environmental issues and encourages them to make better choices in daily life.',
          keywords: ['real-life', 'experience', 'classroom', 'awareness', 'environmental', 'choices'],
        },
      ],
    },
  },

  /* ================================================================
     TERM 2  —  Reported speech · Type 1 conditionals · Modals
  ================================================================ */
  T2: {
    id: 'p4-test-term-2',
    term: 'T2',
    level: 'P4',
    label: 'Term 2 Practice Test 2',
    duration: '1 h 10 min',
    totalMarks: 55,
    blurb: 'P4 Term 2 paper — reported speech (statements & questions), Type 1 conditionals and modals (would/could/should have). Comprehension passage about a beach clean-up day.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      instructions: 'Choose the best answer and write its letter in the brackets provided.',
      items: [
        {
          q: 'Jake said that he ______________ to the library the following day.',
          choices: ['will go', 'would go', 'goes', 'is going'],
          answer: 'would go',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, "will" changes to "would" and "tomorrow" changes to "the following day".',
        },
        {
          q: 'Lily told her mother that she ______________ her homework already.',
          choices: ['finishes', 'finished', 'had finished', 'has finished'],
          answer: 'had finished',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, the present perfect "has finished" shifts back to past perfect "had finished".',
        },
        {
          q: 'If it rains tomorrow, we ______________ the match indoors.',
          choices: ['play', 'played', 'will play', 'would play'],
          answer: 'will play',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional: "if + present simple, will + base verb" — a real possibility.',
        },
        {
          q: 'If you study hard, you ______________ your exams.',
          choices: ['pass', 'passed', 'would pass', 'will pass'],
          answer: 'will pass',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional for a real, likely condition: "if + present, will + base".',
        },
        {
          q: 'You ______________ apologise. It was not your fault at all.',
          choices: ['must', 'should', 'need not', 'ought to'],
          answer: 'need not',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Need not" expresses lack of necessity — there is no reason to apologise.',
        },
        {
          q: 'Tom said that he ______________ be joining us for the trip.',
          choices: ['will', 'shall', 'might', 'can'],
          answer: 'might',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, "may" changes to "might" to show uncertainty in the past.',
        },
        {
          q: 'If you see Sarah, ______________ her I said hello.',
          choices: ['told', 'tell', 'telling', 'had told'],
          answer: 'tell',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional imperative: "If you see…, tell her…" — command as the result clause.',
        },
        {
          q: 'One of the paintings ______________ stolen from the gallery last night.',
          choices: ['were', 'is', 'was', 'are'],
          answer: 'was',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: '"One of the paintings" — the subject is "one" (singular), so the verb is "was".',
        },
        {
          q: 'She told me that she ______________ nervous about the performance.',
          choices: ['is', 'are', 'was', 'were'],
          answer: 'was',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, the present simple "is" shifts to "was" (past simple).',
        },
        {
          q: 'You ______________ have told me earlier — I would have helped you plan the surprise party.',
          choices: ['must', 'would', 'could', 'should'],
          answer: 'could',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Could have told" expresses a missed opportunity in the past — you had the ability but did not do it.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      instructions: 'Choose the word that best fits the meaning of each sentence.',
      items: [
        {
          q: 'The kitten ______________ in the corner, shaking from head to tail.',
          choices: ['shivered', 'trembled', 'quivered', 'shuddered'],
          answer: 'trembled',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Trembled" describes sustained, noticeable shaking — the most natural fit for a frightened animal. "Shivered" is usually from cold; "quivered" is a fine vibration; "shuddered" is a sudden jolt.',
        },
        {
          q: 'After the argument, the two friends ______________ friends and forgave each other.',
          choices: ['made', 'became', 'turned', 'went'],
          answer: 'made',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Made friends" is the correct collocation — you "make" friends, not "became" or "went" friends.',
        },
        {
          q: 'Ben always ______________ the midnight oil the night before his exams.',
          choices: ['burns', 'lights', 'melts', 'uses'],
          answer: 'burns',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Burn the midnight oil" means to work or study late into the night — "burns" is the correct verb in this idiom.',
        },
        {
          q: 'The manager praised the team for their ______________ in finishing the project ahead of schedule.',
          choices: ['efficient', 'efficiency', 'efficiently', 'efficiencies'],
          answer: 'efficiency',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: '"Efficiency" is the noun form of "efficient" — needed here after the possessive "their".',
        },
        {
          q: 'The word "reluctantly" in the passage tells us that the boy ______________ .',
          choices: ['was eager to help', 'helped without being asked', 'helped but did not really want to', 'refused to help'],
          answer: 'helped but did not really want to',
          skill: 'contextInference',
          practiseTarget: 'vocab-mcq',
          explain: '"Reluctantly" means unwillingly — the person did something but was not keen to do it.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word may only be used once. There is one extra word that you will not need.',
      wordBank: ['if', 'unless', 'when', 'before', 'after', 'until'],
      text:
        'Zara decided to organise a bake sale to raise money for the animal shelter. She told her friends that the sale would only go ahead {{1}} enough people volunteered to help. ' +
        '{{2}} she had confirmed the date, she designed colourful posters and put them up around school. ' +
        'On the day of the sale, the team arrived early and set up the stall {{3}} the canteen opened. ' +
        'They sold baked goods throughout the recess period {{4}} every item was gone. ' +
        'Zara said she would repeat the event {{5}} the response from the school was this positive.',
      answers: ['if', 'After', 'before', 'until', 'if'],
      leftOver: ['unless', 'when'],
      skill: 'conditionals',
      practiseTarget: 'cloze-castle',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word may only be used once. There is one extra word that you will not need.',
      wordBank: ['gleaming', 'drifted', 'volunteers', 'retrieve', 'heaps', 'cluttered'],
      text:
        'On Saturday morning, about fifty {{1}} arrived at East Coast Park for the annual beach clean-up. ' +
        'The beach, which had once been {{2}} with litter from the long weekend, looked shocking. ' +
        'Plastic bottles, food wrappers and broken sandals were piled in {{3}} along the shoreline. ' +
        'Some items had even {{4}} into the sea. The team worked quickly to {{5}} what they could before the tide came in. ' +
        'By noon, the beach looked spotless once more.',
      answers: ['volunteers', 'cluttered', 'heaps', 'drifted', 'retrieve'],
      leftOver: ['gleaming'],
      skill: 'contextInference',
      practiseTarget: 'word-vault',
    },

    sectionE: {
      title: 'Section E: Editing for Spelling and Grammar',
      marks: 5,
      instructions: 'Each underlined word contains a spelling or grammar mistake. A circle (○) shows a missing or wrong punctuation mark. Write the correct word or punctuation mark in the space provided.',
      paragraph:
        'Last Saturday, our family {{1:decid}} to spend the day at the science museum. My brother, who love dinosaurs, was the most excited. ' +
        'At the entrance{{2:o}} we were handed a map of the exhibits. We {{3:spended}} the first hour at the Dinosaur Discovery Hall. ' +
        'My brother {{4:taked}} at least thirty photographs. Before we left{{5:o}} we visited the gift shop and bought a dinosaur model.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'decid', correction: 'decided', explain: '"Decided" is the correct simple past form of "decide" — the "-ed" ending is required.' },
        { num: 2, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after "At the entrance" to separate the adverbial phrase from the main clause.' },
        { num: 3, kind: 'grammar', wrong: 'spended', correction: 'spent', explain: '"Spend" is an irregular verb; its simple past form is "spent", not "spended".' },
        { num: 4, kind: 'grammar', wrong: 'taked', correction: 'took', explain: '"Take" is irregular; its simple past form is "took", not "taked".' },
        { num: 5, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after the time clause "Before we left" to separate it from the main clause.' },
      ],
    },

    sectionF: {
      title: 'Section F: Synthesis and Transformation',
      marks: 5,
      instructions: 'For each question, rewrite the sentence(s) using the given word(s). Do not change the meaning.',
      items: [
        {
          q: '"I will bring my camera tomorrow," said Grace.\nBegin with: Grace said that …',
          stem: 'Grace said that',
          answer: 'Grace said that she would bring her camera the following day.',
          alternates: ['Grace said that she would bring her camera the next day.'],
          skill: 'reportedSpeech',
          explain: 'In reported speech: "I" → "she", "will" → "would", "tomorrow" → "the following day / the next day".',
        },
        {
          q: '"I am very proud of my class," the teacher told us.\nBegin with: The teacher told us that …',
          stem: 'The teacher told us that',
          answer: 'The teacher told us that she was very proud of her class.',
          alternates: ['The teacher told us that he was very proud of his class.'],
          skill: 'reportedSpeech',
          explain: '"Am" → "was"; "my" → "her" (or "his") in reported speech.',
        },
        {
          q: 'Start your revision early. Otherwise you will not finish in time.\nUse: unless',
          stem: 'You will not finish in time',
          answer: 'You will not finish in time unless you start your revision early.',
          alternates: [],
          skill: 'conditionals',
          explain: '"Unless" means "if not" — it introduces the negative condition.',
        },
        {
          q: 'It is possible for you to borrow this book. Just return it by Friday.\nUse: may',
          stem: 'You may',
          answer: 'You may borrow this book as long as you return it by Friday.',
          alternates: ['You may borrow this book, but please return it by Friday.'],
          skill: 'modals',
          explain: '"May" expresses permission — combine with the condition about returning the book.',
        },
        {
          q: 'Marcus did not revise his notes. He failed the quiz.\nUse: should have',
          stem: 'Marcus',
          answer: 'Marcus should have revised his notes.',
          alternates: ['Marcus should have revised his notes before the quiz.'],
          skill: 'modals',
          explain: '"Should have + past participle" expresses advice or regret about a past action that was not done.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension',
      marks: 20,
      passage:
        'Every year during the June holidays, the residents of Coral Bay come together for their community beach clean-up. This year, for the first time, children from the neighbouring school, Sunridge Primary, were invited to join in.\n\n' +
        'On the morning of the event, the children arrived at the beach in their bright yellow T-shirts and thick rubber gloves. Their teacher, Mr Osman, reminded them to stay in pairs and not to pick up sharp or dangerous objects without an adult present.\n\n' +
        '"I did not expect the beach to be this dirty," said Priya, a Primary 4 student, as she gazed at the stretch of sand littered with plastic bags, straws and bottle caps. "My dad always says we should take care of our environment, but seeing this makes it so real."\n\n' +
        'Within the first hour, the children had already filled twelve large refuse bags. The community volunteers were impressed. "These children work harder than most adults I have seen at previous clean-ups!" laughed Mr Fernandez, one of the organisers.\n\n' +
        'By midday, the beach had been transformed. The sand was clean, the water looked bluer, and the seabirds seemed to return in greater numbers. As a reward, the volunteers treated the children to cold drinks and sandwiches.\n\n' +
        '"I want to come back next year," announced Priya. "And I will bring my whole family." The other children cheered in agreement. Mr Osman smiled quietly. He thought to himself that this had been the best learning journey of the year — no textbook could teach what a morning of hard work in the sun had shown them.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'What was different about this year\'s beach clean-up compared to previous years?',
          choices: [
            'The event was held on a different day.',
            'Children from a school were invited to join for the first time.',
            'The organisers wore bright yellow T-shirts.',
            'The beach was cleaner than usual.',
          ],
          answer: 'Children from a school were invited to join for the first time.',
          explain: 'Paragraph 1 states "for the first time, children from the neighbouring school … were invited to join in".',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'Why did Priya say "seeing this makes it so real"?',
          choices: [
            'She had never visited a beach before.',
            'The beach was much dirtier than she expected.',
            'She had forgotten what her father had told her.',
            'She was surprised by how clean the beach was.',
          ],
          answer: 'The beach was much dirtier than she expected.',
          explain: 'Priya said she "did not expect the beach to be this dirty" — the sight of the litter made the lesson about caring for the environment feel personal and concrete.',
        },
        {
          type: 'short',
          marks: 2,
          q: 'What safety instruction did Mr Osman give the children?',
          model: 'He told them to stay in pairs and not to pick up sharp or dangerous objects without an adult present.',
          keywords: ['pairs', 'sharp', 'dangerous', 'adult'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'How did the beach change by midday? Give two details.',
          model: 'The sand was clean and the water looked bluer. (Also acceptable: the seabirds seemed to return in greater numbers.)',
          keywords: ['clean', 'bluer', 'seabirds'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'How did Mr Fernandez feel about the children\'s work, and what did he say to show this?',
          model: 'He was impressed. He said "These children work harder than most adults I have seen at previous clean-ups!"',
          keywords: ['impressed', 'harder', 'adults'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a word in paragraph 4 that means "people who offer to do something without being paid".',
          model: 'volunteers',
          keywords: ['volunteers'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a word in paragraph 6 that means "said something publicly and with confidence".',
          model: 'announced',
          keywords: ['announced'],
        },
        {
          type: 'tf-reason',
          marks: 2,
          statement: 'Mr Osman thought the beach clean-up was a more valuable experience than learning from textbooks.',
          answer: 'True',
          reason: 'The last paragraph states that Mr Osman thought it was "the best learning journey of the year" and that "no textbook could teach what a morning of hard work in the sun had shown them".',
        },
        {
          type: 'open',
          marks: 6,
          q: 'What do you think community events like this beach clean-up can teach children? Give two points and explain each one.',
          model: 'Community events like this can teach children responsibility — they learn that they have a duty to care for public spaces. They also learn teamwork, as they work alongside adults and other children to achieve a shared goal. Seeing the result of their efforts (a clean beach) also motivates them to continue making environmentally friendly choices in daily life.',
          keywords: ['responsibility', 'teamwork', 'environment', 'shared', 'motivated', 'choices'],
        },
      ],
    },
  },

  /* ================================================================
     TERM 3  —  Past perfect · Connectors · Adjective clauses
  ================================================================ */
  T3: {
    id: 'p4-test-term-3',
    term: 'T3',
    level: 'P4',
    label: 'Term 3 Practice Test 3',
    duration: '1 h 10 min',
    totalMarks: 55,
    blurb: 'P4 Term 3 paper — past perfect (had + past participle), complex connectors (although, despite, unless, not only…but also) and participial phrases. Comprehension passage about a friendship through a school art competition.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      instructions: 'Choose the best answer and write its letter in the brackets provided.',
      items: [
        {
          q: 'By the time the ambulance arrived, the patient ______________ consciousness.',
          choices: ['lost', 'loses', 'has lost', 'had lost'],
          answer: 'had lost',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: '"Had lost" (past perfect) describes an event that happened before another past event ("arrived").',
        },
        {
          q: 'We discovered that someone ______________ our tent while we were swimming.',
          choices: ['takes', 'took', 'has taken', 'had taken'],
          answer: 'had taken',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: 'The discovering happened in the past ("discovered"); the taking happened even earlier — use past perfect "had taken".',
        },
        {
          q: 'The team played well, ______________ they lost the match in the end.',
          choices: ['so', 'because', 'although', 'unless'],
          answer: 'although',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Although" introduces a contrast — playing well but still losing is unexpected.',
        },
        {
          q: '______________ his fear of heights, Kevin climbed to the top of the observation tower.',
          choices: ['Although', 'Despite', 'Unless', 'Provided that'],
          answer: 'Despite',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Despite" is followed by a noun phrase ("his fear of heights"), not a clause. "Although" needs a full clause.',
        },
        {
          q: 'The exhibition will be cancelled ______________ at least fifty tickets are sold.',
          choices: ['if', 'although', 'unless', 'despite'],
          answer: 'unless',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Unless" means "if not" — the exhibition will be cancelled if the condition (fifty tickets sold) is not met.',
        },
        {
          q: 'Not only ______________ she finish first in the race, but she also broke the school record.',
          choices: ['she did', 'did she', 'she has', 'has she'],
          answer: 'did she',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Not only … but also" requires subject-auxiliary inversion in the first clause: "Not only did she …".',
        },
        {
          q: 'The students ______________ their experiment twice before they got a clear result.',
          choices: ['repeat', 'had repeated', 'have repeated', 'repeated'],
          answer: 'had repeated',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: 'The repeating happened before they got the result — use past perfect "had repeated".',
        },
        {
          q: '______________ tired after the hike, the children still helped set up camp.',
          choices: ['Despite being', 'Although being', 'Unless being', 'Even though'],
          answer: 'Despite being',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Despite + -ing" is a participial phrase showing contrast — the children were tired but still helped.',
        },
        {
          q: 'You may use the equipment ______________ you handle it with care.',
          choices: ['although', 'unless', 'provided that', 'despite'],
          answer: 'provided that',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Provided that" sets a condition for permission — "you can use it on condition that you are careful".',
        },
        {
          q: 'Not only ______________ the weather terrible, but the roads were also flooded.',
          choices: ['was', 'is', 'were', 'had'],
          answer: 'was',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: 'With "Not only … but also" inversion, the auxiliary must agree with the subject "the weather" (singular past) → "was".',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      instructions: 'Choose the word that best fits the meaning of each sentence.',
      items: [
        {
          q: 'The lawyer spoke in a low, steady voice, never once raising it. She was completely ______________ throughout the questioning.',
          choices: ['bold', 'composed', 'timid', 'enthusiastic'],
          answer: 'composed',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Composed" means calm and in control of one\'s emotions — fits "low, steady voice" and "never once raising it".',
        },
        {
          q: 'The athlete ______________ a new world record at the championship last month.',
          choices: ['made', 'broke', 'set', 'did'],
          answer: 'set',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Set a record" is the correct collocation — you "set" a new record (though "broke" fits for surpassing an existing one; here "new world record" makes "set" the best choice).',
        },
        {
          q: 'After the argument, Daniel realised he had acted too hastily. He decided to ______________ the hatchet and apologise.',
          choices: ['dig up', 'bury', 'drop', 'raise'],
          answer: 'bury',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Bury the hatchet" is an idiom meaning to end a quarrel and make peace.',
        },
        {
          q: 'The speech was delivered with great ______________, moving many in the audience to tears.',
          choices: ['emote', 'emotion', 'emotional', 'emotionally'],
          answer: 'emotion',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: '"Emotion" is the noun form needed here — "with great emotion" (the noun follows the preposition "with").',
        },
        {
          q: 'The phrase "the crack of dawn" in the passage means ______________ .',
          choices: ['late at night', 'very early in the morning', 'during the afternoon', 'at sunset'],
          answer: 'very early in the morning',
          skill: 'contextInference',
          practiseTarget: 'vocab-mcq',
          explain: '"The crack of dawn" is an idiom meaning the first light of day — very early in the morning.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word may only be used once. There is one extra word that you will not need.',
      wordBank: ['had', 'already', 'despite', 'although', 'since', 'yet'],
      text:
        'Mei Lin had been looking forward to the school Art Competition for weeks. By the day of the event, she {{1}} prepared three paintings, each one more detailed than the last. ' +
        '{{2}} her hard work, she felt nervous as she set up her display. ' +
        'She {{3}} not seen any of her competitors\' work. When she finally did, she was impressed — everyone had produced something beautiful. ' +
        '{{4}} the other entries were stunning, Mei Lin reminded herself to focus on her own best effort. ' +
        'The judges {{5}} spent thirty minutes studying each painting before making their decision.',
      answers: ['had', 'Despite', 'had', 'Although', 'had'],
      leftOver: ['already', 'since', 'yet'],
      skill: 'pastPerfect',
      practiseTarget: 'cloze-castle',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word may only be used once. There is one extra word that you will not need.',
      wordBank: ['approached', 'hesitantly', 'rival', 'genuine', 'admired', 'sceptical'],
      text:
        'During the competition, a girl named Shu Fen {{1}} Mei Lin\'s display and studied it closely. ' +
        'Mei Lin expected a cold comment from her {{2}}, but instead Shu Fen smiled warmly. ' +
        '"Your brushwork on the koi fish is amazing," Shu Fen said, and she sounded {{3}}. ' +
        'Mei Lin {{4}} replied with a "thank you". She had not expected such kindness. ' +
        'By the end of the day, the two girls had {{5}} each other\'s work and discovered how much they had in common.',
      answers: ['approached', 'rival', 'genuine', 'hesitantly', 'admired'],
      leftOver: ['sceptical'],
      skill: 'contextInference',
      practiseTarget: 'word-vault',
    },

    sectionE: {
      title: 'Section E: Editing for Spelling and Grammar',
      marks: 5,
      instructions: 'Each underlined word contains a spelling or grammar mistake. A circle (○) shows a missing or wrong punctuation mark. Write the correct word or punctuation mark in the space provided.',
      paragraph:
        'Mei Lin {{1:suprised}} everyone at the Art Competition by winning the top prize. Before the winners were {{2:announce}}, ' +
        'she {{3:has}} already packed her paintings, thinking she had not done well enough. ' +
        'When her name was called{{4:o}} she gasped in {{5:disbeleif}} and had to be nudged by her friend to walk up to the stage.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'suprised', correction: 'surprised', explain: '"Surprised" is the correct spelling — the prefix is "sur-", not "sup-".' },
        { num: 2, kind: 'grammar', wrong: 'announce', correction: 'announced', explain: '"Were announced" requires the past participle form "announced" to form the passive voice.' },
        { num: 3, kind: 'grammar', wrong: 'has', correction: 'had', explain: 'The packing happened before the announcement — use past perfect "had (already packed)".' },
        { num: 4, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after the time clause "When her name was called" before the main clause.' },
        { num: 5, kind: 'spelling', wrong: 'disbeleif', correction: 'disbelief', explain: '"Disbelief" is the correct spelling — prefix "dis-" + "belief".' },
      ],
    },

    sectionF: {
      title: 'Section F: Synthesis and Transformation',
      marks: 5,
      instructions: 'For each question, rewrite the sentence(s) using the given word(s). Do not change the meaning.',
      items: [
        {
          q: 'The team lost the match. They had practised for months.\nUse: although',
          stem: 'Although',
          answer: 'Although the team had practised for months, they lost the match.',
          alternates: ['The team lost the match although they had practised for months.'],
          skill: 'connectors',
          explain: '"Although" introduces the unexpected contrast — hard practice but still a loss.',
        },
        {
          q: 'Shu Fen is a talented artist. She is also a dedicated volunteer.\nUse: not only … but also',
          stem: 'Not only is',
          answer: 'Not only is Shu Fen a talented artist, but she is also a dedicated volunteer.',
          alternates: ['Shu Fen is not only a talented artist but also a dedicated volunteer.'],
          skill: 'connectors',
          explain: '"Not only … but also" pairs two qualities. With fronting, inversion is required: "Not only is Shu Fen…".',
        },
        {
          q: 'Mei Lin had eaten her lunch. She then went to the art room.\nUse: after',
          stem: 'After',
          answer: 'After Mei Lin had eaten her lunch, she went to the art room.',
          alternates: ['After she had eaten her lunch, Mei Lin went to the art room.'],
          skill: 'pastPerfect',
          explain: '"After + past perfect" correctly sequences the two past events — eating came before going to the art room.',
        },
        {
          q: 'The shop will close early. This is the case unless there are many customers.\nUse: unless',
          stem: 'The shop will close early',
          answer: 'The shop will close early unless there are many customers.',
          alternates: [],
          skill: 'connectors',
          explain: '"Unless" means "except if" — the shop closes early except in the case of many customers.',
        },
        {
          q: 'The children were tired. They did not give up.\nUse: despite',
          stem: 'Despite',
          answer: 'Despite being tired, the children did not give up.',
          alternates: ['Despite their tiredness, the children did not give up.'],
          skill: 'connectors',
          explain: '"Despite + noun / -ing phrase" contrasts tiredness with perseverance — no clause follows "despite".',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension',
      marks: 20,
      passage:
        'The school hall buzzed with excitement on the day of the Art Competition. More than a hundred paintings, sculptures and digital prints were on display, each one the result of weeks of effort and imagination.\n\n' +
        'Twelve-year-old Mei Lin had entered three oil paintings inspired by the rivers and kampungs of old Singapore. She had worked on them every evening for a month, sometimes staying up past midnight to get the brushstrokes just right. Despite her hard work, she felt a knot of anxiety in her stomach as she saw the quality of the other entries.\n\n' +
        'It was then that she noticed Shu Fen, a girl from another class whom she had always considered a rival. Shu Fen walked up to Mei Lin\'s display, studied it for a long moment, and said, "These are really beautiful. The way you\'ve captured the light on the water — it looks almost real."\n\n' +
        'Mei Lin was taken aback. She had expected criticism, not a compliment. "Thank you," she managed. "I like your charcoal portraits too. How did you get the shadows so accurate?"\n\n' +
        'The two girls talked for half an hour, exchanging tips and admiring each other\'s techniques. By the time the judges announced the results — Mei Lin first place, Shu Fen second — the rivalry felt like a distant memory.\n\n' +
        '"Art should bring people together, not apart," said the guest judge, a well-known local artist. "Today, I saw exactly that." Mei Lin caught Shu Fen\'s eye across the crowded hall, and both girls smiled.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'What kinds of artwork were on display at the competition?',
          choices: [
            'Paintings and photographs only.',
            'Paintings, sculptures and digital prints.',
            'Oil paintings, charcoal portraits and watercolours.',
            'Digital prints and sculptures only.',
          ],
          answer: 'Paintings, sculptures and digital prints.',
          explain: 'Paragraph 1 lists "paintings, sculptures and digital prints" as the types of artwork on display.',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'Why did Mei Lin feel anxious despite working hard on her paintings?',
          choices: [
            'She had not finished her third painting in time.',
            'She did not like the judges who were present.',
            'She saw that the other entries were also of high quality.',
            'She could not find a good spot to display her work.',
          ],
          answer: 'She saw that the other entries were also of high quality.',
          explain: 'Paragraph 2 says she felt anxious "as she saw the quality of the other entries".',
        },
        {
          type: 'short',
          marks: 2,
          q: 'What inspired Mei Lin\'s three oil paintings?',
          model: 'Her paintings were inspired by the rivers and kampungs of old Singapore.',
          keywords: ['rivers', 'kampungs', 'old Singapore'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'How do you know that Mei Lin was surprised by Shu Fen\'s words? Give two details from the passage.',
          model: 'She was "taken aback" and she had expected criticism, not a compliment. She also only "managed" a brief reply, showing she was not expecting kindness.',
          keywords: ['taken aback', 'criticism', 'compliment', 'managed'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'What did the two girls talk about for half an hour?',
          model: 'They exchanged tips and admired each other\'s techniques.',
          keywords: ['tips', 'techniques', 'admired'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a word in paragraph 2 that means "a feeling of worry or unease".',
          model: 'anxiety',
          keywords: ['anxiety'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a phrase in paragraph 5 that means "a memory that seems far in the past and no longer important".',
          model: 'a distant memory',
          keywords: ['distant memory'],
        },
        {
          type: 'tf-reason',
          marks: 2,
          statement: 'Mei Lin and Shu Fen were friendly towards each other before the competition.',
          answer: 'False',
          reason: 'Paragraph 3 says Mei Lin had "always considered" Shu Fen "a rival", suggesting they were competitors, not friends, before the event.',
        },
        {
          type: 'open',
          marks: 6,
          q: 'The guest judge said "Art should bring people together, not apart." Do you agree? Use examples from the passage and your own experience to support your answer.',
          model: 'I agree with the judge. In the passage, the competition brought Mei Lin and Shu Fen together — what started as a rivalry ended in friendship as they shared tips and admired each other\'s work. In real life, art classes and exhibitions also allow people of different backgrounds to connect through a shared love of creativity. When people appreciate the same artwork, they find common ground and build understanding.',
          keywords: ['rivalry', 'friendship', 'connect', 'common', 'share', 'creativity'],
        },
      ],
    },
  },

  /* ================================================================
     TERM 4  —  Review of all P4 skills
  ================================================================ */
  T4: {
    id: 'p4-test-term-4',
    term: 'T4',
    level: 'P4',
    label: 'Term 4 Practice Test 4',
    duration: '1 h 10 min',
    totalMarks: 55,
    blurb: 'P4 Term 4 review paper — covers all P4 skills: passive voice, reported speech, past perfect, conditionals, modals, connectors and relative clauses. Comprehension passage about a sports day that tests resilience and teamwork.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      instructions: 'Choose the best answer and write its letter in the brackets provided.',
      items: [
        {
          q: 'The announcement ______________ before we reached the hall.',
          choices: ['was made', 'had been made', 'has been made', 'is made'],
          answer: 'had been made',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: 'The announcement happened before we reached the hall — use past perfect passive "had been made".',
        },
        {
          q: 'Ahmad reported that the fire ______________ under control.',
          choices: ['is', 'will be', 'has been', 'was'],
          answer: 'was',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, present simple "is" shifts to past simple "was".',
        },
        {
          q: 'The documentary ______________ by a famous director and has won many awards.',
          choices: ['directs', 'directed', 'was directed', 'is directing'],
          answer: 'was directed',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: 'The documentary receives the action of directing — past passive "was directed" is correct.',
        },
        {
          q: 'If the bus ______________ on time, we will miss the first part of the performance.',
          choices: ['does not come', 'did not come', 'will not come', 'had not come'],
          answer: 'does not come',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional: "if + present simple (does not come), will + base verb".',
        },
        {
          q: 'The coach ______________ the players that they ought to give their best in the final.',
          choices: ['tells', 'told', 'has told', 'is telling'],
          answer: 'told',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'The reporting verb "told" is past simple, indicating the coach\'s speech happened in the past.',
        },
        {
          q: 'The athlete ______________ all her rivals by the time she reached the finishing line.',
          choices: ['overtakes', 'overtook', 'had overtaken', 'was overtaking'],
          answer: 'had overtaken',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: 'Overtaking happened before reaching the finishing line — use past perfect "had overtaken".',
        },
        {
          q: 'The new library is the building ______________ was opened by the mayor last month.',
          choices: ['who', 'whom', 'whose', 'that'],
          answer: 'that',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"That" introduces a relative clause for things — the building was opened by the mayor.',
        },
        {
          q: 'You ______________ bring an umbrella — the sky is very cloudy today.',
          choices: ['ought not to', 'should', 'need not', 'must not'],
          answer: 'should',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Should" gives advice — bringing an umbrella is advisable given the cloudy sky.',
        },
        {
          q: 'Not only ______________ the students complete the project early, but they also helped their classmates.',
          choices: ['they did', 'did they', 'have they', 'they had'],
          answer: 'did they',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Not only … but also" with fronting requires subject-auxiliary inversion: "Not only did they …".',
        },
        {
          q: 'The twins, ______________ parents are both doctors, want to study medicine too.',
          choices: ['who', 'whom', 'whose', 'which'],
          answer: 'whose',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Whose" shows that the parents belong to the twins — possession by a person.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      instructions: 'Choose the word that best fits the meaning of each sentence.',
      items: [
        {
          q: 'The rescue team ______________ through the rubble for hours, searching for survivors.',
          choices: ['wandered', 'rummaged', 'strolled', 'crept'],
          answer: 'rummaged',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Rummaged" means searched thoroughly by moving things around — fits "searching through rubble".',
        },
        {
          q: 'The children ______________ a decision after a long discussion.',
          choices: ['made', 'took', 'did', 'got'],
          answer: 'made',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Make a decision" is the correct collocation in English.',
        },
        {
          q: 'After studying so hard this term, Leon felt he had finally ______________ his stride.',
          choices: ['found', 'hit', 'caught', 'made'],
          answer: 'hit',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Hit one\'s stride" means to reach a level of comfortable confidence or efficiency — "hit" is the correct verb.',
        },
        {
          q: 'The scientist\'s explanation was clear and ______________, making it easy for everyone to understand.',
          choices: ['comprehend', 'comprehended', 'comprehensible', 'comprehension'],
          answer: 'comprehensible',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: '"Comprehensible" is the adjective form meaning "able to be understood" — needed here to describe the explanation.',
        },
        {
          q: 'The word "persevered" in paragraph 3 tells us that the athlete ______________ .',
          choices: ['gave up quickly', 'kept trying despite difficulties', 'won without any effort', 'stopped before the end'],
          answer: 'kept trying despite difficulties',
          skill: 'contextInference',
          practiseTarget: 'vocab-mcq',
          explain: '"Persevered" means continued to do something despite difficulty — the opposite of giving up.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word may only be used once. There is one extra word that you will not need.',
      wordBank: ['had', 'would', 'although', 'despite', 'been', 'if'],
      text:
        'The school Sports Day {{1}} been postponed twice due to the haze earlier in the year. ' +
        'When the day finally arrived, the students were thrilled, {{2}} they knew the competition ahead would be tough. ' +
        'Marcus {{3}} trained every morning for six weeks and was determined to do his best in the relay race. ' +
        'He told his teammates that he {{4}} run as fast as he could for their sake. ' +
        '{{5}} the pressure, the team stayed calm and focused at the starting line.',
      answers: ['had', 'although', 'had', 'would', 'Despite'],
      leftOver: ['been', 'if'],
      skill: 'pastPerfect',
      practiseTarget: 'cloze-castle',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word may only be used once. There is one extra word that you will not need.',
      wordBank: ['thunderous', 'surged', 'agony', 'collapsed', 'endure', 'triumph'],
      text:
        'As Marcus ran the final leg of the relay, a wave of {{1}} applause rose from the crowd. ' +
        'He pushed through the pain in his legs, refusing to let the {{2}} slow him down. ' +
        'The energy from the cheering crowd {{3}} through him like electricity. ' +
        'He crossed the finishing line just ahead of his nearest competitor. ' +
        'In that moment of {{4}}, Marcus\'s legs finally {{5}} beneath him with exhaustion and he sank onto the track, gasping for breath.',
      answers: ['thunderous', 'agony', 'surged', 'triumph', 'collapsed'],
      leftOver: ['endure'],
      skill: 'contextInference',
      practiseTarget: 'word-vault',
    },

    sectionE: {
      title: 'Section E: Editing for Spelling and Grammar',
      marks: 5,
      instructions: 'Each underlined word contains a spelling or grammar mistake. A circle (○) shows a missing or wrong punctuation mark. Write the correct word or punctuation mark in the space provided.',
      paragraph:
        'The school had {{1:prepaired}} for Sports Day by painting new lines on the track and {{2:set}} up the equipment the previous day. ' +
        'By the time the students arrived{{3:o}} everything was ready. ' +
        'The principal, {{4:who}} speech was short but inspiring, reminded everyone to play fair. ' +
        'Marcus told his teammates that they must give their {{5:upmost}} effort in every event.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'prepaired', correction: 'prepared', explain: '"Prepared" is the correct spelling — from the verb "prepare" + "-d"; no doubling of the final consonant.' },
        { num: 2, kind: 'grammar', wrong: 'set', correction: 'setting', explain: 'The gerund "setting" is needed to parallel "painting" in the structure "by painting … and setting up".' },
        { num: 3, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after the time clause "By the time the students arrived" before the main clause.' },
        { num: 4, kind: 'grammar', wrong: 'who', correction: 'whose', explain: '"Whose speech" shows possession — the speech belongs to the principal, so "whose" is correct.' },
        { num: 5, kind: 'spelling', wrong: 'upmost', correction: 'utmost', explain: '"Utmost" (meaning greatest) is the correct word — "upmost" means "highest in position" and is not the intended meaning here.' },
      ],
    },

    sectionF: {
      title: 'Section F: Synthesis and Transformation',
      marks: 5,
      instructions: 'For each question, rewrite the sentence(s) using the given word(s). Do not change the meaning.',
      items: [
        {
          q: '"We have done our best," Marcus told the team after the race.\nBegin with: Marcus told the team that …',
          stem: 'Marcus told the team that',
          answer: 'Marcus told the team that they had done their best.',
          alternates: [],
          skill: 'reportedSpeech',
          explain: '"We" → "they", "have done" (present perfect) → "had done" (past perfect) in reported speech.',
        },
        {
          q: 'The trophy was heavy. Marcus could barely lift it.\nUse: so … that',
          stem: 'The trophy was so heavy',
          answer: 'The trophy was so heavy that Marcus could barely lift it.',
          alternates: [],
          skill: 'connectors',
          explain: '"So + adjective + that" expresses a degree or result — the trophy\'s heaviness caused Marcus to barely manage.',
        },
        {
          q: 'The games master organised the event. He has worked here for ten years.\nUse: who',
          stem: 'The games master',
          answer: 'The games master who has worked here for ten years organised the event.',
          alternates: ['The games master, who has worked here for ten years, organised the event.'],
          skill: 'relativeClauses',
          explain: '"Who" introduces a relative clause giving information about the games master (a person).',
        },
        {
          q: 'The referees checked the video recordings. Only then did they make their final decision.\nUse: before',
          stem: 'The referees checked the video recordings before',
          answer: 'The referees checked the video recordings before they made their final decision.',
          alternates: ['The referees checked the video recordings before making their final decision.'],
          skill: 'pastPerfect',
          explain: '"Before" sequences two events — checking happened before the decision was made.',
        },
        {
          q: 'The swim team did not win the trophy. They still celebrated their personal bests.\nUse: although',
          stem: 'Although',
          answer: 'Although the swim team did not win the trophy, they still celebrated their personal bests.',
          alternates: ['The swim team still celebrated their personal bests although they did not win the trophy.'],
          skill: 'connectors',
          explain: '"Although" introduces the unexpected contrast — losing but still celebrating is a positive resilience message.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension',
      marks: 20,
      passage:
        'The sun had barely risen when Marcus laced up his running shoes and headed to the school track. It was Sports Day — the day he had been training for since January. Six weeks of early mornings and burning muscles had led to this moment.\n\n' +
        'Marcus was the anchor runner of the 4 x 100 m relay team. His job was to receive the baton last and sprint to the finish. Simple in theory, but the pressure was enormous. The previous year, he had dropped the baton during the exchange, costing his team first place. He had replayed that moment in his mind hundreds of times since.\n\n' +
        '"Don\'t think about last year," his coach, Ms Poh, had told him that morning. "Think about the next ten seconds."\n\n' +
        'When the starting gun fired, Marcus watched his three teammates run their legs with focus and speed. By the time the baton reached him, his team was in second place. He ran with everything he had — lungs burning, arms pumping. With twenty metres to go, he drew level with the leader. With ten, he pushed ahead.\n\n' +
        'He crossed the line first. The crowd erupted. Marcus stood at the finish line, hands on his knees, trying to catch his breath. His teammates rushed over and they collapsed into a heap of laughter and exhaustion.\n\n' +
        '"How did you do it?" his teammate Dinesh shouted above the noise. Marcus glanced at Ms Poh, who gave a quiet nod. "I just thought about the next ten seconds," he grinned.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'What had cost Marcus\'s team first place the previous year?',
          choices: [
            'Marcus ran too slowly in his leg.',
            'His teammates were not well prepared.',
            'Marcus dropped the baton during the exchange.',
            'The team started too late.',
          ],
          answer: 'Marcus dropped the baton during the exchange.',
          explain: 'Paragraph 2 says "he had dropped the baton during the exchange, costing his team first place".',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'What was the purpose of Ms Poh\'s advice to "think about the next ten seconds"?',
          choices: [
            'To tell Marcus to run his race in exactly ten seconds.',
            'To remind Marcus to focus on the present moment instead of past mistakes.',
            'To warn Marcus that the race would be over in ten seconds.',
            'To encourage Marcus to start running before the gun fired.',
          ],
          answer: 'To remind Marcus to focus on the present moment instead of past mistakes.',
          explain: 'Ms Poh told Marcus not to think about last year — the advice was to stay focused on the immediate task rather than dwelling on his past mistake.',
        },
        {
          type: 'short',
          marks: 2,
          q: 'What was Marcus\'s role in the relay team?',
          model: 'Marcus was the anchor runner — he received the baton last and sprinted to the finish.',
          keywords: ['anchor', 'last', 'finish'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'Describe what happened in the final twenty metres of Marcus\'s race. Give two details.',
          model: 'With twenty metres to go, Marcus drew level with the leader. With ten metres to go, he pushed ahead and crossed the line first.',
          keywords: ['drew level', 'pushed ahead', 'first'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'How did Marcus\'s teammates react after he crossed the finishing line?',
          model: 'They rushed over to him and collapsed into a heap of laughter and exhaustion.',
          keywords: ['rushed', 'collapsed', 'laughter', 'exhaustion'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a phrase in paragraph 4 that means "moved to the same position as another person".',
          model: 'drew level',
          keywords: ['drew level', 'level'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a word in paragraph 1 that means "fastened or tied the laces of his shoes".',
          model: 'laced',
          keywords: ['laced'],
        },
        {
          type: 'tf-reason',
          marks: 2,
          statement: 'Marcus had been preparing for Sports Day for only a few weeks.',
          answer: 'False',
          reason: 'Paragraph 1 says Marcus had been training "since January" and paragraph 2 mentions "six weeks of early mornings" — his preparation was a sustained effort lasting months, not just a few weeks.',
        },
        {
          type: 'open',
          marks: 6,
          q: 'What do you think made Marcus succeed this year when he had failed the previous year? Use details from the passage and your own ideas.',
          model: 'Marcus succeeded because he learned from his past mistake and worked hard to avoid repeating it. He trained every morning for six weeks, showing great dedication. His coach\'s advice — to focus on "the next ten seconds" — also helped him stay calm under pressure and not be distracted by memories of the previous year. This mental focus, combined with his physical preparation, helped him perform at his best when it mattered most.',
          keywords: ['training', 'dedication', 'focus', 'coach', 'mistake', 'pressure', 'prepared'],
        },
      ],
    },
  },
});

/**
 * Return a flat array of every P4 practice test.
 */
export function getP4PracticeTests() {
  return P4_PRACTICE_TEST_TERMS.map(term => P4_PRACTICE_TESTS[term]);
}

/**
 * Look up a practice test by term key.
 * @param {'T1'|'T2'|'T3'|'T4'} term
 */
export function getP4PracticeTest(term) {
  return P4_PRACTICE_TESTS[term] || null;
}

/**
 * Validate the P4 practice test bank.  Returns a list of issue strings (empty = OK).
 * Used by unit tests so contributors get a precise failure message when a
 * paper is malformed.
 */
export function validateP4PracticeTests(bank = P4_PRACTICE_TESTS) {
  const issues = [];
  const blankRe = /\{\{(\d+)\}\}/g;
  const editingBlankRe = /\{\{(\d+):[^}]*\}\}/g;
  const allowedTargets = new Set([
    'grammar-mcq', 'vocab-mcq', 'cloze-castle', 'word-vault', 'sentence-forge', 'editing-quest',
  ]);

  for (const term of P4_PRACTICE_TEST_TERMS) {
    const test = bank?.[term];
    const tag = `P4/${term}`;
    if (!test) { issues.push(`${tag}: missing`); continue; }
    if (test.level !== 'P4') issues.push(`${tag}: level must be P4`);
    if (test.term !== term) issues.push(`${tag}: term mismatch`);
    if (typeof test.label !== 'string' || !test.label.trim()) issues.push(`${tag}: missing label`);

    // Section A — 10 MCQ items
    const sA = test.sectionA;
    if (!sA || !Array.isArray(sA.items) || sA.items.length !== 10) {
      issues.push(`${tag}/sectionA: must have 10 items`);
    } else {
      for (const item of sA.items) {
        if (!item.q || !Array.isArray(item.choices) || item.choices.length !== 4) {
          issues.push(`${tag}/sectionA: malformed item (need q + 4 choices)`);
        }
        if (!item.choices?.includes(item.answer)) {
          issues.push(`${tag}/sectionA: answer "${item.answer}" not among choices`);
        }
        if (new Set(item.choices).size !== item.choices.length) {
          issues.push(`${tag}/sectionA: duplicate choices`);
        }
        if (item.practiseTarget && !allowedTargets.has(item.practiseTarget)) {
          issues.push(`${tag}/sectionA: unknown practiseTarget "${item.practiseTarget}"`);
        }
      }
    }

    // Section B — 5 MCQ items
    const sB = test.sectionB;
    if (!sB || !Array.isArray(sB.items) || sB.items.length !== 5) {
      issues.push(`${tag}/sectionB: must have 5 items`);
    } else {
      for (const item of sB.items) {
        if (!item.q || !Array.isArray(item.choices) || item.choices.length !== 4) {
          issues.push(`${tag}/sectionB: malformed item (need q + 4 choices)`);
        }
        if (!item.choices?.includes(item.answer)) {
          issues.push(`${tag}/sectionB: answer "${item.answer}" not among choices`);
        }
        if (new Set(item.choices).size !== item.choices.length) {
          issues.push(`${tag}/sectionB: duplicate choices`);
        }
      }
    }

    // Sections C and D — 5 blanks each
    for (const key of ['sectionC', 'sectionD']) {
      const s = test[key];
      if (!s) { issues.push(`${tag}/${key}: missing`); continue; }
      const blanks = [...(s.text || '').matchAll(blankRe)].map(m => Number(m[1]));
      if (blanks.length !== 5) issues.push(`${tag}/${key}: expected 5 blanks, found ${blanks.length}`);
      if (!Array.isArray(s.answers) || s.answers.length !== 5) {
        issues.push(`${tag}/${key}: expected 5 answers`);
      }
      if (!Array.isArray(s.wordBank) || s.wordBank.length < 5) {
        issues.push(`${tag}/${key}: word bank must have at least 5 words`);
      }
      const bankLower = (s.wordBank || []).map(w => w.toLowerCase());
      for (const a of s.answers || []) {
        if (!bankLower.includes(String(a).toLowerCase())) {
          issues.push(`${tag}/${key}: answer "${a}" missing from word bank`);
        }
      }
    }

    // Section E — editing, 5 errors
    const sE = test.sectionE;
    if (!sE || typeof sE.paragraph !== 'string') {
      issues.push(`${tag}/sectionE: missing paragraph`);
    } else {
      const blanks = [...sE.paragraph.matchAll(editingBlankRe)].map(m => Number(m[1]));
      if (blanks.length !== 5) issues.push(`${tag}/sectionE: expected 5 editing blanks, found ${blanks.length}`);
      if (!Array.isArray(sE.errors) || sE.errors.length !== 5) issues.push(`${tag}/sectionE: expected 5 errors`);
      checkEditingErrors(issues, `${tag}/sectionE`, sE);
    }

    // Section F — synthesis, 5 items
    const sF = test.sectionF;
    if (!sF || !Array.isArray(sF.items) || sF.items.length !== 5) {
      issues.push(`${tag}/sectionF: must have 5 synthesis items`);
    } else {
      for (const item of sF.items) {
        if (!item.q || typeof item.answer !== 'string' || !item.answer.trim()) {
          issues.push(`${tag}/sectionF: item missing q or answer`);
        }
      }
    }

    // Section G — comprehension, passage + questions
    const sG = test.sectionG;
    if (!sG || typeof sG.passage !== 'string' || !sG.passage.trim()) {
      issues.push(`${tag}/sectionG: missing passage`);
    }
    if (!Array.isArray(sG?.questions) || sG.questions.length < 4) {
      issues.push(`${tag}/sectionG: needs at least 4 questions`);
    }

    // Marks total
    const sectionKeys = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF', 'sectionG'];
    const total = sectionKeys.map(k => test[k]?.marks || 0).reduce((a, b) => a + b, 0);
    if (total !== test.totalMarks) {
      issues.push(`${tag}: section marks sum to ${total} but totalMarks=${test.totalMarks}`);
    }
  }

  return issues;
}
