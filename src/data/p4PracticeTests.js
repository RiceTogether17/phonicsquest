/**
 * PhonicsQuest – Primary 4 Practice Test Papers
 *
 * Four full school-style P4 English practice papers, one per term.
 * Each paper mirrors the common Singapore P4 English Continual Assessment
 * format used by many primary schools. All prompts, passages and cloze
 * texts are ORIGINAL content written for PhonicsQuest — only the paper
 * format and skills tested follow the school-paper convention:
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
    blurb: 'P4 Term 1 paper — introduces passive voice (simple present/past) and relative clauses (who/which/whose/that). Comprehension passage about a school visit to a water reclamation plant.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      instructions: 'Choose the best answer and write its letter in the brackets provided.',
      items: [
        {
          q: 'The mirrors ______________ every Monday by the attendants.',
          choices: ['wipe', 'wipes', 'are wiped', 'is wiped'],
          answer: 'are wiped',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: 'Subject "mirrors" is plural; the action is repeated, so we use "are wiped" (simple present passive).',
        },
        {
          q: 'The championship shield ______________ by our school last year.',
          choices: ['won', 'is won', 'was won', 'has won'],
          answer: 'was won',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: '"Last year" signals simple past; passive of "win" is "was won".',
        },
        {
          q: 'My uncle, ______________ works as a chef, lives across the street.',
          choices: ['who', 'which', 'whose', 'that'],
          answer: 'who',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Who" introduces a relative clause referring to a person ("my uncle").',
        },
        {
          q: 'The umbrella ______________ I borrowed from the office is very sturdy.',
          choices: ['who', 'whom', 'whose', 'which'],
          answer: 'which',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Which" is used for things ("the umbrella"); "who" and "whom" are for people.',
        },
        {
          q: 'The pupil ______________ painting won first prize received a book voucher.',
          choices: ['who', 'whom', 'whose', 'which'],
          answer: 'whose',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Whose" shows possession — the painting belongs to the pupil.',
        },
        {
          q: 'Neither the twins nor their mother ______________ where the spare key is.',
          choices: ['know', 'knows', 'are knowing', 'have known'],
          answer: 'knows',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: 'With "Neither…nor", the verb agrees with the subject closest to it — "their mother" is singular, so "knows".',
        },
        {
          q: 'The stray kitten ______________ by the vet this morning.',
          choices: ['treat', 'treats', 'was treated', 'is treating'],
          answer: 'was treated',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: '"This morning" is a past time signal; the kitten receives the action, so we use simple past passive "was treated".',
        },
        {
          q: 'Each of the players ______________ expected to attend the briefing on time.',
          choices: ['are', 'were', 'is', 'have'],
          answer: 'is',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: '"Each of" always takes a singular verb — "each of the players is".',
        },
        {
          q: 'The old footbridge ______________ by a sheltered linkway next year.',
          choices: ['replaces', 'is replaced', 'will be replaced', 'has replaced'],
          answer: 'will be replaced',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: '"Next year" indicates future; the bridge receives the action, so we use "will be replaced".',
        },
        {
          q: 'The parrot ______________ belongs to our neighbour often squawks at dawn.',
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
          q: 'The veteran striker ______________ off the pitch, favouring his bandaged knee.',
          choices: ['strolled', 'marched', 'limped', 'shuffled'],
          answer: 'limped',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Limped" specifically describes uneven walking due to an injury — the context mentions a bandaged knee.',
        },
        {
          q: 'The hikers had to ______________ precautions before entering the flooded trail.',
          choices: ['do', 'make', 'take', 'get'],
          answer: 'take',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Take precautions" is the correct collocation in English — you take, not make or do, precautions.',
        },
        {
          q: 'Zara could organise a games session ______________ — she never needed much time to prepare.',
          choices: ['at the drop of a hat', 'over the moon', 'in the same boat', 'under the weather'],
          answer: 'at the drop of a hat',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"At the drop of a hat" means immediately, without hesitation — fits "never needed much time to prepare".',
        },
        {
          q: 'The archaeologist made a remarkable ______________ after months of digging.',
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
        'Every year, the residents’ committee organises a Harvest Morning at the community garden. Helpers {{1}} divided into teams and assigned different plots to tend. ' +
        '{{2}} the work was tiring, everyone pitched in cheerfully. Some helpers {{3}} seen trimming the herbs along the fence, while others raked the paths. ' +
        'The programme {{4}} been running for five years and has become a favourite event. ' +
        '{{5}} that time, the garden has won three community awards.',
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
        'On a field trip to the wetlands, Mr Koh asked the class to {{1}} the dragonflies without disturbing them. ' +
        'One pupil {{2}} a large crimson dragonfly through her binoculars and noticed the fine veins on its wings. ' +
        'She moved {{3}} so as not to frighten it. Suddenly, a younger pupil dropped his clipboard with a clatter, and the dragonfly was {{4}}. ' +
        'It darted off instantly. The guide reminded the group that dragonflies are {{5}} creatures that must never be grabbed or handled roughly.',
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
        'Last week, our class {{1:visitted}} the waterworks near our school. We {{2:was}} given safety vests to wear before entering the plant. ' +
        'Our guide, Ms Chen{{3:o}} showed us how raw water is filtered and treated. ' +
        'She explained that sand, gravel and carbon {{4:is}} used in separate stages. We were {{5:amaze}} by how much work goes into every clean drop.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'visitted', correction: 'visited', explain: '"Visited" has only one "t" — words ending in a consonant-vowel-consonant pattern only double the final consonant when the last syllable is stressed; "visit" is not stress-final.' },
        { num: 2, kind: 'grammar', wrong: 'was', correction: 'were', explain: '"We" is plural and requires "were" in simple past.' },
        { num: 3, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after "Ms Chen" to separate the appositive from the main clause.' },
        { num: 4, kind: 'grammar', wrong: 'is', correction: 'are', explain: '"Sand, gravel and carbon" is a plural subject (multiple items joined by "and") — use "are".' },
        { num: 5, kind: 'grammar', wrong: 'amaze', correction: 'amazed', explain: 'After "were", we need the past participle "amazed" to form the passive adjective.' },
      ],
    },

    sectionF: {
      title: 'Section F: Synthesis and Transformation',
      marks: 5,
      instructions: 'For each question, rewrite the sentence(s) using the given word(s). Do not change the meaning. Do not add unnecessary words.',
      items: [
        {
          q: 'Someone carved this statue more than a hundred years ago.\nBegin with: This statue …',
          stem: 'This statue',
          answer: 'This statue was carved more than a hundred years ago.',
          alternates: ['This statue was carved over a hundred years ago.'],
          skill: 'passiveVoice',
          explain: 'Change the active sentence to passive: "was carved" + time phrase. The agent ("someone") is dropped.',
        },
        {
          q: 'The boy won the chess tournament. His memory is very sharp.\nUse: whose',
          stem: 'The boy whose',
          answer: 'The boy whose memory is very sharp won the chess tournament.',
          alternates: [],
          skill: 'relativeClauses',
          explain: '"Whose" links the relative clause to the noun "boy" by showing possession of "memory".',
        },
        {
          q: 'Mdm Siti sewed the curtains. She is our neighbour.\nUse: who',
          stem: 'Mdm Siti',
          answer: 'Mdm Siti, who is our neighbour, sewed the curtains.',
          alternates: ['Mdm Siti who is our neighbour sewed the curtains.'],
          skill: 'relativeClauses',
          explain: 'The relative clause "who is our neighbour" adds information about Mdm Siti.',
        },
        {
          q: 'The gardeners water the plants every morning.\nBegin with: The plants …',
          stem: 'The plants',
          answer: 'The plants are watered every morning.',
          alternates: ['The plants are watered every morning by the gardeners.'],
          skill: 'passiveVoice',
          explain: 'Simple present passive: "are watered" + frequency expression.',
        },
        {
          q: 'This is the stadium. Our team played its first match here.\nUse: where',
          stem: 'This is the stadium where',
          answer: 'This is the stadium where our team played its first match.',
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
        'Last Thursday, Class 4B went on a learning journey to a water reclamation plant in the west of Singapore. The students were excited because none of them had ever set foot in such a place before.\n\n' +
        'Upon arrival, the class was welcomed by the plant supervisor, Mdm Rosnah. She gave the students a short talk on why every drop of water matters. "Every day, Singapore uses millions of litres of water," she said. "If we do not reuse our water, our reservoirs will run low much faster than expected."\n\n' +
        'The students then put on safety vests and entered the main treatment hall. There, they watched in wonder as used water flowed through giant tanks and was pushed through rows of fine membranes by powerful pumps. Staff and machines worked together to clean the water in stages — screening, filtering and disinfecting.\n\n' +
        'Mr Faizal, the teacher, pointed to a display of bottled reclaimed water. "Did you know that reclaimed water is clean enough to pass thousands of quality tests?" he said. Several students nodded, but others looked doubtful.\n\n' +
        'At the end of the visit, each student was given a small keychain made from recycled bottle caps. "Take this home as a reminder," Mdm Rosnah said with a smile. On the bus ride back, the students were unusually quiet — each lost in thought about how their small everyday habits could make a big difference.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'Why were the students excited about the learning journey?',
          choices: [
            'They had visited the plant many times before.',
            'None of them had ever been to such a place before.',
            'They wanted to meet Mdm Rosnah.',
            'Their teacher had promised them a special gift.',
          ],
          answer: 'None of them had ever been to such a place before.',
          explain: 'Paragraph 1 states directly: "none of them had ever set foot in such a place before".',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'What does Mdm Rosnah\'s warning about the reservoirs suggest?',
          choices: [
            'Singapore has already run out of water.',
            'The reservoirs will stay full for many more decades.',
            'Reusing water is needed to stop the reservoirs from running low too quickly.',
            'Only factories should be responsible for saving water.',
          ],
          answer: 'Reusing water is needed to stop the reservoirs from running low too quickly.',
          explain: 'Mdm Rosnah says the reservoirs will run low faster if people do not reuse water — implying that reusing water makes supplies last longer.',
        },
        {
          type: 'short',
          marks: 2,
          q: 'How was the used water pushed through the fine membranes?',
          model: 'It was pushed through by powerful pumps.',
          keywords: ['powerful pumps', 'pumps'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'Name two stages in which the water was cleaned in the treatment hall.',
          model: 'Screening and filtering. (Also acceptable: disinfecting. Any two of: screening, filtering, disinfecting.)',
          keywords: ['screening', 'filtering', 'disinfecting'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'What interesting fact did Mr Faizal share about reclaimed water?',
          model: 'He said that reclaimed water is clean enough to pass thousands of quality tests.',
          keywords: ['quality tests', 'clean'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a word in paragraph 3 that means "great surprise and admiration".',
          model: 'wonder',
          keywords: ['wonder'],
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
          model: 'Yes, learning journeys like this are useful. First, students get to see real-life processes (such as water treatment) that they cannot experience in the classroom. Second, seeing how much effort goes into producing clean water makes them more aware of conservation and encourages them to build better habits in daily life.',
          keywords: ['real-life', 'experience', 'classroom', 'awareness', 'conservation', 'habits'],
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
    blurb: 'P4 Term 2 paper — reported speech (statements & questions), Type 1 conditionals and modals (would/could/should have). Comprehension passage about a community garden makeover.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      instructions: 'Choose the best answer and write its letter in the brackets provided.',
      items: [
        {
          q: 'Priya said that she ______________ to the dentist the following day.',
          choices: ['will go', 'would go', 'goes', 'is going'],
          answer: 'would go',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, "will" changes to "would" and "tomorrow" changes to "the following day".',
        },
        {
          q: 'Arun told his father that he ______________ his chores already.',
          choices: ['finishes', 'finished', 'had finished', 'has finished'],
          answer: 'had finished',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, the present perfect "has finished" shifts back to past perfect "had finished".',
        },
        {
          q: 'If it pours tomorrow, we ______________ the tournament indoors.',
          choices: ['play', 'played', 'will play', 'would play'],
          answer: 'will play',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional: "if + present simple, will + base verb" — a real possibility.',
        },
        {
          q: 'If you train consistently, you ______________ your fitness test.',
          choices: ['pass', 'passed', 'would pass', 'will pass'],
          answer: 'will pass',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional for a real, likely condition: "if + present, will + base".',
        },
        {
          q: 'You ______________ pay for the repairs. The damage was not caused by you.',
          choices: ['must', 'should', 'need not', 'ought to'],
          answer: 'need not',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Need not" expresses lack of necessity — there is no reason for you to pay.',
        },
        {
          q: 'Wei Ming said that he ______________ be joining us for dinner.',
          choices: ['will', 'shall', 'might', 'can'],
          answer: 'might',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, "may" changes to "might" to show uncertainty in the past.',
        },
        {
          q: 'If you meet Aunty Rose, ______________ her I said thank you.',
          choices: ['told', 'tell', 'telling', 'had told'],
          answer: 'tell',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional imperative: "If you meet…, tell her…" — command as the result clause.',
        },
        {
          q: 'One of the sculptures ______________ damaged during the move last night.',
          choices: ['were', 'is', 'was', 'are'],
          answer: 'was',
          skill: 'svAgreement',
          practiseTarget: 'grammar-mcq',
          explain: '"One of the sculptures" — the subject is "one" (singular), so the verb is "was".',
        },
        {
          q: 'He told me that he ______________ anxious about the audition.',
          choices: ['is', 'are', 'was', 'were'],
          answer: 'was',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, the present simple "is" shifts to "was" (past simple).',
        },
        {
          q: 'You ______________ have called me earlier — I would have helped you carry the groceries.',
          choices: ['must', 'would', 'could', 'should'],
          answer: 'could',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Could have called" expresses a missed opportunity in the past — you had the ability but did not do it.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      instructions: 'Choose the word that best fits the meaning of each sentence.',
      items: [
        {
          q: 'The puppy ______________ under the bench, shaking from nose to tail.',
          choices: ['shivered', 'trembled', 'quivered', 'shuddered'],
          answer: 'trembled',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Trembled" describes sustained, noticeable shaking — the most natural fit for a frightened animal. "Shivered" is usually from cold; "quivered" is a fine vibration; "shuddered" is a sudden jolt.',
        },
        {
          q: 'After the quarrel, the two cousins ______________ friends again and forgave each other.',
          choices: ['made', 'became', 'turned', 'went'],
          answer: 'made',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Made friends" is the correct collocation — you "make" friends, not "became" or "went" friends.',
        },
        {
          q: 'Mei always ______________ the midnight oil the week before her recitals.',
          choices: ['burns', 'lights', 'melts', 'uses'],
          answer: 'burns',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Burn the midnight oil" means to work or study late into the night — "burns" is the correct verb in this idiom.',
        },
        {
          q: 'The supervisor praised the crew for their ______________ in clearing the site ahead of schedule.',
          choices: ['efficient', 'efficiency', 'efficiently', 'efficiencies'],
          answer: 'efficiency',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: '"Efficiency" is the noun form of "efficient" — needed here after the possessive "their".',
        },
        {
          q: 'The word "reluctantly" in the passage tells us that the girl ______________ .',
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
        'Iqbal decided to organise a car-wash to raise funds for the school library. He told his classmates that the event would only go ahead {{1}} enough helpers signed up. ' +
        '{{2}} he had fixed the date, he designed bright flyers and pinned them up around the estate. ' +
        'On the morning itself, the team arrived early and set out their buckets {{3}} the first cars drove in. ' +
        'They scrubbed and rinsed right through the morning {{4}} every booked slot was done. ' +
        'Iqbal said he would run the event again {{5}} the support from the neighbourhood stayed this strong.',
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
        'On Sunday morning, about forty {{1}} gathered by the park canal for the quarterly clean-up. ' +
        'The banks, which had become {{2}} with litter after the festival weekend, were a sorry sight. ' +
        'Drink cans, plastic bags and torn banners lay in {{3}} along the walkway. ' +
        'Some rubbish had even {{4}} into the canal itself. The team worked swiftly to {{5}} what they could before the afternoon rain. ' +
        'By lunchtime, the canal banks looked spotless once more.',
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
        'Last Sunday, our family {{1:decid}} to spend the day at the bird park. My sister, who loves parrots, was the most excited. ' +
        'At the gate{{2:o}} we were handed a map of the aviaries. We {{3:spended}} the first hour at the Rainbow Ridge enclosure. ' +
        'My sister {{4:taked}} at least forty photographs. Before we left{{5:o}} we stopped by the gift shop and bought a penguin plushie.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'decid', correction: 'decided', explain: '"Decided" is the correct simple past form of "decide" — the "-ed" ending is required.' },
        { num: 2, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after "At the gate" to separate the adverbial phrase from the main clause.' },
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
          q: '"I will bring my guitar tomorrow," said Wen.\nBegin with: Wen said that …',
          stem: 'Wen said that',
          answer: 'Wen said that he would bring his guitar the following day.',
          alternates: ['Wen said that he would bring his guitar the next day.'],
          skill: 'reportedSpeech',
          explain: 'In reported speech: "I" → "he", "will" → "would", "tomorrow" → "the following day / the next day".',
        },
        {
          q: '"I am very proud of my team," the coach told us.\nBegin with: The coach told us that …',
          stem: 'The coach told us that',
          answer: 'The coach told us that she was very proud of her team.',
          alternates: ['The coach told us that he was very proud of his team.'],
          skill: 'reportedSpeech',
          explain: '"Am" → "was"; "my" → "her" (or "his") in reported speech.',
        },
        {
          q: 'Pack your bag tonight. Otherwise you will not leave on time.\nUse: unless',
          stem: 'You will not leave on time',
          answer: 'You will not leave on time unless you pack your bag tonight.',
          alternates: [],
          skill: 'conditionals',
          explain: '"Unless" means "if not" — it introduces the negative condition.',
        },
        {
          q: 'It is possible for you to use my bicycle. Just oil the chain afterwards.\nUse: may',
          stem: 'You may',
          answer: 'You may use my bicycle as long as you oil the chain afterwards.',
          alternates: ['You may use my bicycle, but please oil the chain afterwards.'],
          skill: 'modals',
          explain: '"May" expresses permission — combine with the condition about oiling the chain.',
        },
        {
          q: 'Rita did not check the weather. She was caught in the rain.\nUse: should have',
          stem: 'Rita',
          answer: 'Rita should have checked the weather.',
          alternates: ['Rita should have checked the weather before going out.'],
          skill: 'modals',
          explain: '"Should have + past participle" expresses advice or regret about a past action that was not done.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension',
      marks: 20,
      passage:
        'Every year during the December holidays, the residents of Riverbend estate come together to spruce up their community garden. This year, for the first time, pupils from the nearby school, Meadow Primary, were invited to join in.\n\n' +
        'On the morning of the event, the pupils arrived at the garden in their bright orange caps and sturdy gardening gloves. Their teacher, Mrs Chandra, reminded them to stay with their buddies and not to handle the garden tools without an adult present.\n\n' +
        '"I did not expect the garden to be this overgrown," said Hakim, a Primary 4 pupil, as he stared at the beds choked with weeds, dead leaves and tangled vines. "My mum always says we should care for our shared spaces, but seeing this makes it so real."\n\n' +
        'Within the first hour, the pupils had already filled ten large garden bags with weeds. The residents were impressed. "These children work harder than most adults I have seen at previous makeovers!" chuckled Mr Wee, one of the organisers.\n\n' +
        'By midday, the garden had been transformed. The beds were neat, the paths were clear, and the butterflies seemed to return in greater numbers. As a reward, the residents treated the pupils to iced lemon tea and curry puffs.\n\n' +
        '"I want to come back next year," announced Hakim. "And I will bring my whole family." The other pupils cheered in agreement. Mrs Chandra smiled quietly. She thought to herself that this had been the best learning journey of the year — no textbook could teach what a morning of honest work under the sun had shown them.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'What was different about this year\'s garden makeover compared to previous years?',
          choices: [
            'The event was held on a different day.',
            'Pupils from a school were invited to join for the first time.',
            'The organisers wore bright orange caps.',
            'The garden was tidier than usual.',
          ],
          answer: 'Pupils from a school were invited to join for the first time.',
          explain: 'Paragraph 1 states "for the first time, pupils from the nearby school … were invited to join in".',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'Why did Hakim say "seeing this makes it so real"?',
          choices: [
            'He had never visited a garden before.',
            'The garden was much more overgrown than he expected.',
            'He had forgotten what his mother had told him.',
            'He was surprised by how tidy the garden was.',
          ],
          answer: 'The garden was much more overgrown than he expected.',
          explain: 'Hakim said he "did not expect the garden to be this overgrown" — the sight of the choked beds made the lesson about caring for shared spaces feel personal and concrete.',
        },
        {
          type: 'short',
          marks: 2,
          q: 'What safety instruction did Mrs Chandra give the pupils?',
          model: 'She told them to stay with their buddies and not to handle the garden tools without an adult present.',
          keywords: ['buddies', 'tools', 'adult'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'How did the garden change by midday? Give two details.',
          model: 'The beds were neat and the paths were clear. (Also acceptable: the butterflies seemed to return in greater numbers.)',
          keywords: ['neat', 'clear', 'butterflies'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'How did Mr Wee feel about the pupils\' work, and what did he say to show this?',
          model: 'He was impressed. He said "These children work harder than most adults I have seen at previous makeovers!"',
          keywords: ['impressed', 'harder', 'adults'],
        },
        {
          type: 'vocab',
          marks: 1,
          q: 'Find a word in paragraph 4 that means "people who live in a particular place".',
          model: 'residents',
          keywords: ['residents'],
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
          statement: 'Mrs Chandra thought the garden makeover was a more valuable experience than learning from textbooks.',
          answer: 'True',
          reason: 'The last paragraph states that Mrs Chandra thought it was "the best learning journey of the year" and that "no textbook could teach what a morning of honest work under the sun had shown them".',
        },
        {
          type: 'open',
          marks: 6,
          q: 'What do you think community events like this garden makeover can teach children? Give two points and explain each one.',
          model: 'Community events like this can teach children responsibility — they learn that they have a duty to care for shared spaces. They also learn teamwork, as they work alongside adults and other children to achieve a common goal. Seeing the result of their efforts (a tidy, thriving garden) also motivates them to keep caring for their neighbourhood in daily life.',
          keywords: ['responsibility', 'teamwork', 'shared', 'common', 'motivated', 'neighbourhood'],
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
    blurb: 'P4 Term 3 paper — past perfect (had + past participle), complex connectors (although, despite, unless, not only…but also) and participial phrases. Comprehension passage about a friendship formed at a school science fair.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      instructions: 'Choose the best answer and write its letter in the brackets provided.',
      items: [
        {
          q: 'By the time the paramedics reached the trail, the hiker ______________ consciousness.',
          choices: ['lost', 'loses', 'has lost', 'had lost'],
          answer: 'had lost',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: '"Had lost" (past perfect) describes an event that happened before another past event ("reached").',
        },
        {
          q: 'We realised that someone ______________ our picnic basket while we were flying kites.',
          choices: ['takes', 'took', 'has taken', 'had taken'],
          answer: 'had taken',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: 'The realising happened in the past ("realised"); the taking happened even earlier — use past perfect "had taken".',
        },
        {
          q: 'The choir sang beautifully, ______________ they missed the top prize in the end.',
          choices: ['so', 'because', 'although', 'unless'],
          answer: 'although',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Although" introduces a contrast — singing beautifully but still missing the prize is unexpected.',
        },
        {
          q: '______________ her fear of water, Lina completed the kayaking course.',
          choices: ['Although', 'Despite', 'Unless', 'Provided that'],
          answer: 'Despite',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Despite" is followed by a noun phrase ("her fear of water"), not a clause. "Although" needs a full clause.',
        },
        {
          q: 'The fun fair will be called off ______________ at least a hundred tickets are sold.',
          choices: ['if', 'although', 'unless', 'despite'],
          answer: 'unless',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Unless" means "if not" — the fair will be called off if the condition (a hundred tickets sold) is not met.',
        },
        {
          q: 'Not only ______________ she top the level in Mathematics, but she also won the art prize.',
          choices: ['she did', 'did she', 'she has', 'has she'],
          answer: 'did she',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Not only … but also" requires subject-auxiliary inversion in the first clause: "Not only did she …".',
        },
        {
          q: 'The scouts ______________ their knot drill twice before they finally passed the test.',
          choices: ['repeat', 'had repeated', 'have repeated', 'repeated'],
          answer: 'had repeated',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: 'The repeating happened before they passed — use past perfect "had repeated".',
        },
        {
          q: '______________ soaked after the storm, the campers still pitched the tents.',
          choices: ['Despite being', 'Although being', 'Unless being', 'Even though'],
          answer: 'Despite being',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Despite + -ing" is a participial phrase showing contrast — the campers were soaked but still helped.',
        },
        {
          q: 'You may borrow the telescope ______________ you handle it with care.',
          choices: ['although', 'unless', 'provided that', 'despite'],
          answer: 'provided that',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Provided that" sets a condition for permission — "you can use it on condition that you are careful".',
        },
        {
          q: 'Not only ______________ the queue endless, but the car park was also full.',
          choices: ['was', 'is', 'were', 'had'],
          answer: 'was',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: 'With "Not only … but also" inversion, the auxiliary must agree with the subject "the queue" (singular past) → "was".',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      instructions: 'Choose the word that best fits the meaning of each sentence.',
      items: [
        {
          q: 'The surgeon spoke in a low, steady voice, never once hurrying. She remained completely ______________ throughout the operation.',
          choices: ['bold', 'composed', 'timid', 'enthusiastic'],
          answer: 'composed',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Composed" means calm and in control of one\'s emotions — fits "low, steady voice" and "never once hurrying".',
        },
        {
          q: 'The sprinter ______________ a new national record at the trials last month.',
          choices: ['made', 'broke', 'set', 'did'],
          answer: 'set',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Set a record" is the correct collocation — you "set" a new record (though "broke" fits for surpassing an existing one; here "new national record" makes "set" the best choice).',
        },
        {
          q: 'After the quarrel, Imran realised he had spoken too harshly. He decided to ______________ the hatchet and apologise.',
          choices: ['dig up', 'bury', 'drop', 'raise'],
          answer: 'bury',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Bury the hatchet" is an idiom meaning to end a quarrel and make peace.',
        },
        {
          q: 'The farewell song was performed with great ______________, moving many teachers to tears.',
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
        'Jia Hui had been looking forward to the school Science Fair for weeks. By the day of the event, she {{1}} built three working models, each one more intricate than the last. ' +
        '{{2}} her careful preparation, she felt jittery as she set up her booth. ' +
        'She {{3}} not seen any of her competitors\' projects. When she finally did, she was impressed — everyone had created something clever. ' +
        '{{4}} the other booths were dazzling, Jia Hui reminded herself to focus on presenting her own best work. ' +
        'The judges {{5}} spent twenty minutes questioning each participant before making their decision.',
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
        'During the fair, a boy named Ren Jun {{1}} Jia Hui\'s booth and studied her wind turbine closely. ' +
        'Jia Hui braced herself for a mocking remark from her {{2}}, but instead Ren Jun grinned warmly. ' +
        '"Your gear design is brilliant," Ren Jun said, and he sounded {{3}}. ' +
        'Jia Hui {{4}} replied with a "thank you". She had not expected such warmth. ' +
        'By the end of the day, the two had {{5}} each other\'s projects and discovered how much they had in common.',
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
        'Jia Hui {{1:suprised}} everyone at the Science Fair by clinching the top award. Before the winners were {{2:announce}}, ' +
        'she {{3:has}} already dismantled part of her booth, thinking she had not done well enough. ' +
        'When her name was called{{4:o}} she gasped in {{5:disbeleif}} and had to be nudged by her friend to walk up to the stage.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'suprised', correction: 'surprised', explain: '"Surprised" is the correct spelling — the prefix is "sur-", not "sup-".' },
        { num: 2, kind: 'grammar', wrong: 'announce', correction: 'announced', explain: '"Were announced" requires the past participle form "announced" to form the passive voice.' },
        { num: 3, kind: 'grammar', wrong: 'has', correction: 'had', explain: 'The dismantling happened before the announcement — use past perfect "had (already dismantled)".' },
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
          q: 'The band lost the contest. They had rehearsed for months.\nUse: although',
          stem: 'Although',
          answer: 'Although the band had rehearsed for months, they lost the contest.',
          alternates: ['The band lost the contest although they had rehearsed for months.'],
          skill: 'connectors',
          explain: '"Although" introduces the unexpected contrast — hard rehearsal but still a loss.',
        },
        {
          q: 'Ren Jun is a gifted inventor. He is also a patient mentor.\nUse: not only … but also',
          stem: 'Not only is',
          answer: 'Not only is Ren Jun a gifted inventor, but he is also a patient mentor.',
          alternates: ['Ren Jun is not only a gifted inventor but also a patient mentor.'],
          skill: 'connectors',
          explain: '"Not only … but also" pairs two qualities. With fronting, inversion is required: "Not only is Ren Jun…".',
        },
        {
          q: 'Jia Hui had packed her tools. She then left the hall.\nUse: after',
          stem: 'After',
          answer: 'After Jia Hui had packed her tools, she left the hall.',
          alternates: ['After she had packed her tools, Jia Hui left the hall.'],
          skill: 'pastPerfect',
          explain: '"After + past perfect" correctly sequences the two past events — packing came before leaving the hall.',
        },
        {
          q: 'The kiosk will close early. This is the case unless there are many visitors.\nUse: unless',
          stem: 'The kiosk will close early',
          answer: 'The kiosk will close early unless there are many visitors.',
          alternates: [],
          skill: 'connectors',
          explain: '"Unless" means "except if" — the kiosk closes early except in the case of many visitors.',
        },
        {
          q: 'The hikers were hungry. They did not stop walking.\nUse: despite',
          stem: 'Despite',
          answer: 'Despite being hungry, the hikers did not stop walking.',
          alternates: ['Despite their hunger, the hikers did not stop walking.'],
          skill: 'connectors',
          explain: '"Despite + noun / -ing phrase" contrasts hunger with perseverance — no clause follows "despite".',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension',
      marks: 20,
      passage:
        'The school hall hummed with energy on the day of the Science Fair. More than eighty projects — working models, posters and experiments — filled the tables, each one the product of weeks of tinkering and testing.\n\n' +
        'Eleven-year-old Jia Hui had entered three working models inspired by clean energy: a wind turbine, a solar oven and a water wheel. She had worked on them every evening for a month, sometimes staying up past midnight to sand and rewire the parts. Despite her preparation, she felt a knot of anxiety in her stomach when she saw the standard of the other booths.\n\n' +
        'It was then that she noticed Ren Jun, a boy from another class whom she had always considered a rival. Ren Jun walked up to Jia Hui\'s booth, studied her turbine for a long moment, and said, "This is really impressive. The way you\'ve balanced the blades — it spins so smoothly."\n\n' +
        'Jia Hui was taken aback. She had expected criticism, not a compliment. "Thank you," she managed. "I like your volcano model too. How did you time the eruption so perfectly?"\n\n' +
        'The two talked for half an hour, exchanging tips and admiring each other\'s designs. By the time the judges announced the results — Jia Hui first place, Ren Jun second — the rivalry felt like a distant memory.\n\n' +
        '"Science should spark curiosity, not jealousy," said the guest judge, a university professor. "Today, I saw exactly that." Jia Hui caught Ren Jun\'s eye across the crowded hall, and both of them smiled.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'What kinds of projects were on display at the fair?',
          choices: [
            'Working models and photographs only.',
            'Working models, posters and experiments.',
            'Wind turbines, volcanoes and posters only.',
            'Posters and experiments only.',
          ],
          answer: 'Working models, posters and experiments.',
          explain: 'Paragraph 1 lists "working models, posters and experiments" as the types of projects on display.',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'Why did Jia Hui feel anxious despite working hard on her models?',
          choices: [
            'She had not finished her third model in time.',
            'She did not like the judges who were present.',
            'She saw that the other booths were also of a high standard.',
            'She could not find a good spot to set up her booth.',
          ],
          answer: 'She saw that the other booths were also of a high standard.',
          explain: 'Paragraph 2 says she felt anxious "when she saw the standard of the other booths".',
        },
        {
          type: 'short',
          marks: 2,
          q: 'What inspired Jia Hui\'s three working models?',
          model: 'Her models were inspired by clean energy — a wind turbine, a solar oven and a water wheel.',
          keywords: ['clean energy', 'turbine', 'solar'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'How do you know that Jia Hui was surprised by Ren Jun\'s words? Give two details from the passage.',
          model: 'She was "taken aback" and she had expected criticism, not a compliment. She also only "managed" a brief reply, showing she was not expecting kindness.',
          keywords: ['taken aback', 'criticism', 'compliment', 'managed'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'What did the two pupils talk about for half an hour?',
          model: 'They exchanged tips and admired each other\'s designs.',
          keywords: ['tips', 'designs', 'admired'],
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
          statement: 'Jia Hui and Ren Jun were friendly towards each other before the fair.',
          answer: 'False',
          reason: 'Paragraph 3 says Jia Hui had "always considered" Ren Jun "a rival", suggesting they were competitors, not friends, before the event.',
        },
        {
          type: 'open',
          marks: 6,
          q: 'The guest judge said "Science should spark curiosity, not jealousy." Do you agree? Use examples from the passage and your own experience to support your answer.',
          model: 'I agree with the judge. In the passage, the fair brought Jia Hui and Ren Jun together — what started as a rivalry ended in friendship as they shared tips and admired each other\'s designs. In real life, science clubs and fairs also let people of different backgrounds connect through a shared sense of wonder. When people puzzle over the same question, they find common ground and build understanding.',
          keywords: ['rivalry', 'friendship', 'connect', 'common', 'share', 'curiosity'],
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
    blurb: 'P4 Term 4 review paper — covers all P4 skills: passive voice, reported speech, past perfect, conditionals, modals, connectors and relative clauses. Comprehension passage about a games carnival that tests resilience and teamwork.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      instructions: 'Choose the best answer and write its letter in the brackets provided.',
      items: [
        {
          q: 'The results ______________ before we reached the noticeboard.',
          choices: ['was made', 'had been made', 'has been made', 'is made'],
          answer: 'had been made',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: 'The results were released before we reached the noticeboard — use past perfect passive "had been made".',
        },
        {
          q: 'Siti reported that the situation ______________ under control.',
          choices: ['is', 'will be', 'has been', 'was'],
          answer: 'was',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, present simple "is" shifts to past simple "was".',
        },
        {
          q: 'The short film ______________ by a local director and has won several awards.',
          choices: ['directs', 'directed', 'was directed', 'is directing'],
          answer: 'was directed',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: 'The short film receives the action of directing — past passive "was directed" is correct.',
        },
        {
          q: 'If the train ______________ on time, we will miss the opening ceremony.',
          choices: ['does not come', 'did not come', 'will not come', 'had not come'],
          answer: 'does not come',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 1 conditional: "if + present simple (does not come), will + base verb".',
        },
        {
          q: 'The captain ______________ the players that they ought to stay focused in the final.',
          choices: ['tells', 'told', 'has told', 'is telling'],
          answer: 'told',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'The reporting verb "told" is past simple, indicating the captain\'s speech happened in the past.',
        },
        {
          q: 'The cyclist ______________ all her rivals by the time she reached the final bend.',
          choices: ['overtakes', 'overtook', 'had overtaken', 'was overtaking'],
          answer: 'had overtaken',
          skill: 'pastPerfect',
          practiseTarget: 'grammar-mcq',
          explain: 'Overtaking happened before reaching the final bend — use past perfect "had overtaken".',
        },
        {
          q: 'The new hall is the building ______________ was opened by the minister last month.',
          choices: ['who', 'whom', 'whose', 'that'],
          answer: 'that',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"That" introduces a relative clause for things — the building was opened by the minister.',
        },
        {
          q: 'You ______________ carry a raincoat — the clouds look heavy today.',
          choices: ['ought not to', 'should', 'need not', 'must not'],
          answer: 'should',
          skill: 'modals',
          practiseTarget: 'grammar-mcq',
          explain: '"Should" gives advice — carrying a raincoat is advisable given the heavy clouds.',
        },
        {
          q: 'Not only ______________ the scouts finish the trail early, but they also helped the younger group.',
          choices: ['they did', 'did they', 'have they', 'they had'],
          answer: 'did they',
          skill: 'connectors',
          practiseTarget: 'grammar-mcq',
          explain: '"Not only … but also" with fronting requires subject-auxiliary inversion: "Not only did they …".',
        },
        {
          q: 'The sisters, ______________ parents are both chefs, want to open a café too.',
          choices: ['who', 'whom', 'whose', 'which'],
          answer: 'whose',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Whose" shows that the parents belong to the sisters — possession by a person.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      instructions: 'Choose the word that best fits the meaning of each sentence.',
      items: [
        {
          q: 'The volunteers ______________ through the cluttered storeroom for hours, searching for the old trophies.',
          choices: ['wandered', 'rummaged', 'strolled', 'crept'],
          answer: 'rummaged',
          skill: 'synonymContrast',
          practiseTarget: 'vocab-mcq',
          explain: '"Rummaged" means searched thoroughly by moving things around — fits digging through a cluttered storeroom.',
        },
        {
          q: 'The committee ______________ a decision after a lengthy discussion.',
          choices: ['made', 'took', 'did', 'got'],
          answer: 'made',
          skill: 'collocationCloze',
          practiseTarget: 'vocab-mcq',
          explain: '"Make a decision" is the correct collocation in English.',
        },
        {
          q: 'After weeks of daily practice, Devi felt she had finally ______________ her stride.',
          choices: ['found', 'hit', 'caught', 'made'],
          answer: 'hit',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocab-mcq',
          explain: '"Hit one\'s stride" means to reach a level of comfortable confidence or efficiency — "hit" is the correct verb.',
        },
        {
          q: 'The instructor\'s directions were clear and ______________, making the drill easy for everyone to follow.',
          choices: ['comprehend', 'comprehended', 'comprehensible', 'comprehension'],
          answer: 'comprehensible',
          skill: 'morphologicalAffix',
          practiseTarget: 'vocab-mcq',
          explain: '"Comprehensible" is the adjective form meaning "able to be understood" — needed here to describe the explanation.',
        },
        {
          q: 'The word "persevered" in paragraph 3 tells us that the swimmer ______________ .',
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
        'The school Games Carnival {{1}} been postponed twice due to the wet weather earlier in the term. ' +
        'When the day finally arrived, the pupils were overjoyed, {{2}} they knew the events ahead would be demanding. ' +
        'Danish {{3}} trained every morning for two months and was determined to give his all in the sprint relay. ' +
        'He told his teammates that he {{4}} run flat out for their sake. ' +
        '{{5}} the pressure, the team stayed calm and composed at the starting line.',
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
        'As Danish ran the anchor leg of the relay, a wave of {{1}} cheering rolled down from the stands. ' +
        'He powered through the burning in his calves, refusing to let the {{2}} slow his stride. ' +
        'The roar of the crowd {{3}} through him like electricity. ' +
        'He lunged across the line a step ahead of his nearest rival. ' +
        'In that moment of {{4}}, Danish\'s legs finally {{5}} beneath him with exhaustion and he sank onto the track, gulping for air.',
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
        'The school had {{1:prepaired}} for the Games Carnival by marking fresh lanes on the track and {{2:set}} up the tentage the evening before. ' +
        'By the time the pupils streamed in{{3:o}} everything was ready. ' +
        'The vice-principal, {{4:who}} speech was brief but rousing, reminded everyone to compete graciously. ' +
        'Danish told his teammates that they must give their {{5:upmost}} effort in every event.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'prepaired', correction: 'prepared', explain: '"Prepared" is the correct spelling — from the verb "prepare" + "-d"; no doubling of the final consonant.' },
        { num: 2, kind: 'grammar', wrong: 'set', correction: 'setting', explain: 'The gerund "setting" is needed to parallel "marking" in the structure "by marking … and setting up".' },
        { num: 3, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after the time clause "By the time the pupils streamed in" before the main clause.' },
        { num: 4, kind: 'grammar', wrong: 'who', correction: 'whose', explain: '"Whose speech" shows possession — the speech belongs to the vice-principal, so "whose" is correct.' },
        { num: 5, kind: 'spelling', wrong: 'upmost', correction: 'utmost', explain: '"Utmost" (meaning greatest) is the correct word — "upmost" means "highest in position" and is not the intended meaning here.' },
      ],
    },

    sectionF: {
      title: 'Section F: Synthesis and Transformation',
      marks: 5,
      instructions: 'For each question, rewrite the sentence(s) using the given word(s). Do not change the meaning.',
      items: [
        {
          q: '"We have given our all," Danish told the team after the race.\nBegin with: Danish told the team that …',
          stem: 'Danish told the team that',
          answer: 'Danish told the team that they had given their all.',
          alternates: [],
          skill: 'reportedSpeech',
          explain: '"We" → "they", "have given" (present perfect) → "had given" (past perfect) in reported speech.',
        },
        {
          q: 'The medal box was heavy. Danish could barely carry it.\nUse: so … that',
          stem: 'The medal box was so heavy',
          answer: 'The medal box was so heavy that Danish could barely carry it.',
          alternates: [],
          skill: 'connectors',
          explain: '"So + adjective + that" expresses a degree or result — the box\'s heaviness caused Danish to barely manage.',
        },
        {
          q: 'The games master planned the carnival. He has served here for ten years.\nUse: who',
          stem: 'The games master',
          answer: 'The games master who has served here for ten years planned the carnival.',
          alternates: ['The games master, who has served here for ten years, planned the carnival.'],
          skill: 'relativeClauses',
          explain: '"Who" introduces a relative clause giving information about the games master (a person).',
        },
        {
          q: 'The judges reviewed the photo finish. Only then did they confirm the winner.\nUse: before',
          stem: 'The judges reviewed the photo finish before',
          answer: 'The judges reviewed the photo finish before they confirmed the winner.',
          alternates: ['The judges reviewed the photo finish before confirming the winner.'],
          skill: 'pastPerfect',
          explain: '"Before" sequences two events — reviewing happened before the winner was confirmed.',
        },
        {
          q: 'The netball team did not lift the cup. They still celebrated their improved scores.\nUse: although',
          stem: 'Although',
          answer: 'Although the netball team did not lift the cup, they still celebrated their improved scores.',
          alternates: ['The netball team still celebrated their improved scores although they did not lift the cup.'],
          skill: 'connectors',
          explain: '"Although" introduces the unexpected contrast — losing but still celebrating is a positive resilience message.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension',
      marks: 20,
      passage:
        'The sky was still grey when Danish pulled on his spikes and jogged to the school field. It was the day of the Games Carnival — the day he had been preparing for since the start of the year. Two months of dawn runs and aching legs had brought him to this moment.\n\n' +
        'Danish was the anchor runner of the 4 x 100 m relay team. His task was to take the baton last and carry it home. Simple on paper, but the weight on his shoulders was heavy. The year before, he had fumbled the baton at the changeover, and his team had lost first place. He had turned that moment over in his head countless times since.\n\n' +
        '"Forget last year," his coach, Mr Loh, had told him that morning. "Run the race in front of you."\n\n' +
        'When the whistle blew, Danish watched his three teammates storm around the track with focus and speed. By the time the baton slapped into his palm, his team was lying second. He gave everything he had — chest heaving, legs driving. With twenty metres to go, he drew level with the leader. With ten, he edged in front.\n\n' +
        'He crossed the line first. The stands erupted. Danish doubled over at the finish, hands on his knees, trying to catch his breath. His teammates rushed over and they collapsed into a heap of laughter and exhaustion.\n\n' +
        '"How did you do it?" his teammate Kumar shouted above the cheering. Danish glanced at Mr Loh, who gave a quiet nod. "I just ran the race in front of me," he grinned.',
      questions: [
        {
          type: 'mcq',
          marks: 2,
          q: 'What had cost Danish\'s team first place the previous year?',
          choices: [
            'Danish ran too slowly in his leg.',
            'His teammates were not well prepared.',
            'Danish fumbled the baton at the changeover.',
            'The team started too late.',
          ],
          answer: 'Danish fumbled the baton at the changeover.',
          explain: 'Paragraph 2 says "he had fumbled the baton at the changeover, and his team had lost first place".',
        },
        {
          type: 'mcq',
          marks: 2,
          q: 'What was the purpose of Mr Loh\'s advice to "run the race in front of you"?',
          choices: [
            'To tell Danish to run only in the front lane of the track.',
            'To remind Danish to focus on the present moment instead of past mistakes.',
            'To warn Danish that the race would be over very quickly.',
            'To encourage Danish to start running before the whistle blew.',
          ],
          answer: 'To remind Danish to focus on the present moment instead of past mistakes.',
          explain: 'Mr Loh told Danish to forget last year — the advice was to stay focused on the immediate task rather than dwelling on his past mistake.',
        },
        {
          type: 'short',
          marks: 2,
          q: 'What was Danish\'s role in the relay team?',
          model: 'Danish was the anchor runner — he took the baton last and carried it home to the finish.',
          keywords: ['anchor', 'last', 'finish'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'Describe what happened in the final twenty metres of Danish\'s race. Give two details.',
          model: 'With twenty metres to go, Danish drew level with the leader. With ten metres to go, he edged in front and crossed the line first.',
          keywords: ['drew level', 'edged in front', 'first'],
        },
        {
          type: 'short',
          marks: 2,
          q: 'How did Danish\'s teammates react after he crossed the finishing line?',
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
          q: 'Find a word in paragraph 1 that means "ran at a slow, steady pace".',
          model: 'jogged',
          keywords: ['jogged'],
        },
        {
          type: 'tf-reason',
          marks: 2,
          statement: 'Danish had been preparing for the Games Carnival for only a few days.',
          answer: 'False',
          reason: 'Paragraph 1 says Danish had been preparing "since the start of the year" with "two months of dawn runs" — his preparation was a sustained effort lasting months, not days.',
        },
        {
          type: 'open',
          marks: 6,
          q: 'What do you think made Danish succeed this year when he had failed the previous year? Use details from the passage and your own ideas.',
          model: 'Danish succeeded because he learned from his past mistake and worked hard to avoid repeating it. He trained every morning for two months, showing great dedication. His coach\'s advice — to "run the race in front of you" — also helped him stay calm under pressure and not be distracted by memories of the previous year. This mental focus, combined with his physical preparation, helped him perform at his best when it mattered most.',
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
