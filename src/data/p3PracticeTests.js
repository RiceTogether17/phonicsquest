/**
 * PhonicsQuest – Primary 3 Practice Test Papers
 *
 * Three full school-style P3 English practice papers (Term 1, 2, 3).  P3
 * is a major jump from P2 in three ways the data must support so that
 * practice transfers to the real paper:
 *
 *   1.  Section E adds Sentence Combining with advanced connectors —
 *       "although", "than" (comparative), "Neither...nor", "since",
 *       "which" (relative clause).
 *   2.  Term 3 introduces a brand-new section type — Comprehension Cloze
 *       (open cloze, no word bank, blanks filled from prior knowledge).
 *   3.  Term 3 also doubles the comprehension load (two passages: Section
 *       H + Section I) and adds tabular answers + True/False + reason.
 *
 *   Plus, P3 starts to drill skills that simply do not exist at P2:
 *       - tag questions ("isn't he?", "haven't you?")
 *       - phrasal verbs (break out, fall through, fall over)
 *       - compound indefinite pronouns (nowhere / anywhere / somewhere)
 *       - modal regret ("should have arrived")
 *       - collective-noun SVA ("a group of sheep is")
 *
 * Every MCQ item carries:
 *   - skill          — category key from grammarCategories.js / vocabCategories.js
 *   - practiseTarget — module key the student should open to drill that skill
 *
 * Section types supported by the placeholder renderer:
 *   sectionA / sectionB         → MCQ items
 *   sectionC / sectionD         → cloze with word box
 *   sectionE (T3 only)          → open comprehension cloze {{n}} blanks
 *   sectionF / sectionG / etc.  → editing, sentence combining, comprehension
 */

import { checkEditingErrors } from './practiceTestValidators.js';

export const P3_PRACTICE_TEST_TERMS = Object.freeze(['T1', 'T2', 'T3']);

export const P3_PRACTICE_TESTS = Object.freeze({
  T1: {
    id: 'p3-test-term-1', term: 'T1', level: 'P3',
    label: 'Term 1 Practice Test 1 (Basic)',
    duration: '45 minutes', totalMarks: 40,
    blurb: 'P3 Term 1 paper — past continuous ("was sleeping when..."), polite "Could you", possessive "whose" and an "although / comparative-than" synthesis pair. Comprehension: Leo lost at the MRT station.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'Isaac ___ under a tree when a branch snapped and struck him on the head.', choices: ['sleep', 'slept', 'is sleeping', 'was sleeping'], answer: 'was sleeping', skill: 'pastCont', practiseTarget: 'grammar-mcq', explain: '"Was sleeping" is past continuous — a longer past action that was interrupted by the branch snapping.' },
        { q: 'After completing all her homework, Janice had very ___ time left to do anything else.', choices: ['much', 'some', 'many', 'little'], answer: 'little', skill: 'quantifiers', practiseTarget: 'grammar-mcq', explain: '"Very little time" = almost no time. "Little" is the negative quantifier for uncountable nouns.' },
        { q: '___ a month’s time, we will have to hand in our projects.', choices: ['By', 'In', 'On', 'Before'], answer: 'In', skill: 'prepositions', practiseTarget: 'grammar-mcq', explain: '"In a month\'s time" is a fixed phrase meaning "after one month from now".' },
        { q: '"___ worksheet is this? There’s no name written on it," Mr Low asked the class.', choices: ['Who', 'What', 'Whose', 'Which'], answer: 'Whose', skill: 'whQuestions', practiseTarget: 'grammar-mcq', explain: '"Whose" asks about ownership; "who" asks about a person.' },
        { q: '"___ you wait here for me? I won’t take long," Bernie asked.', choices: ['May', 'Could', 'Must', 'Should'], answer: 'Could', skill: 'modals', practiseTarget: 'grammar-mcq', explain: '"Could you...?" is the polite request form when asking someone for a favour.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'Poor Gladys missed a step and ___ down the stairs.', choices: ['tripped', 'slipped', 'dropped', 'tumbled'], answer: 'tumbled', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: '"Tumbled" means fell head-over-heels — the right verb for falling down stairs.' },
        { q: 'The injured man ___ in pain.', choices: ['sighed', 'groaned', 'mumbled', 'grumbled'], answer: 'groaned', skill: 'soundVerbs', practiseTarget: 'vocab-mcq', explain: '"Groaned" is a deep painful sound. "Mumbled" and "grumbled" are about speech.' },
        { q: 'Everyone was ___ as no one had expected the judges to choose the weakest contestant as the winner.', choices: ['unsure', 'alarmed', 'puzzled', 'embarrassed'], answer: 'puzzled', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Puzzled" matches the surprise of an unexpected, hard-to-understand result.' },
        { q: 'Stanley ordered the T-bone steak which is a huge ___ of meat.', choices: ['slab', 'lump', 'slice', 'block'], answer: 'slab', skill: 'collectiveNouns', practiseTarget: 'vocab-mcq', explain: 'A "slab" of meat is a thick, flat piece — the term used for a T-bone steak.' },
        { q: 'Even though many praise him, Max remains ___ and does not boast about his achievements.', choices: ['bold', 'timid', 'humble', 'confident'], answer: 'humble', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Humble" means modest — the opposite of boastful.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['herself', 'their', 'she', 'they', 'her', 'them', 'themselves'],
      text:
        'Tanya was the oldest child in the family. Whenever her parents were not at home, {{1}} had to look after her three siblings. ' +
        'They were much younger than she was and were not able to look after {{2}}. ' +
        'Being mature for {{3}} age, Tanya could be trusted to do a good job of taking care of her siblings. ' +
        'She would cook meals for {{4}}, make sure they bathed and helped them with {{5}} homework. ' +
        'Her parents need not worry as they knew the younger children were in Tanya’s safe hands.',
      answers: ['she', 'themselves', 'her', 'them', 'their'],
      leftOver: ['herself', 'they'],
      skill: 'pronouns', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['ability', 'recover', 'skill', 'lose', 'regrow', 'aside', 'apart'],
      text:
        'Jellyfish are very special creatures. They have several characteristics that set them {{1}} from other animals. ' +
        'One of the most interesting things about jellyfish is that they do not have brains, bones, hearts or eyes. ' +
        'Another fascinating characteristic of jellyfish is their {{2}} to regenerate. This means they can {{3}} lost body parts. ' +
        'It helps them to survive in the oceans for it allows them to {{4}} from injuries and continue living even if they {{5}} a body part. ' +
        'Jellyfish are no doubt one of the most unique creatures in the oceans.',
      answers: ['apart', 'ability', 'regrow', 'recover', 'lose'],
      leftOver: ['skill', 'aside'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Sentence Combining / Synthesis', marks: 4,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['Mark had a fever.', 'He still went to school.'], connector: 'although', stemPosition: 'middle', model: 'Mark went to school although he had a fever.', skill: 'connectors', explain: '"Although" introduces an unexpected fact — the fever did not stop him.' },
        { originals: ['Wendy is tall.', 'Her sister is not as tall.'], connector: 'than', stemPosition: 'middle', model: 'Wendy is taller than her sister.', skill: 'comparatives', explain: 'Comparing two people uses "-er than" (or "more ___ than" for longer adjectives).' },
      ],
    },
    sectionF: {
      title: 'Section F: Editing', marks: 6,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A circle marks a missing or wrong punctuation mark.',
      paragraph:
        'It was the first time that Sara was going for a ride on a rollercoaster. She was not keen, but her friend Kelly wanted her to come {{1:by}} her. ' +
        '"I promise you it{{2:o}}ll be fun! You will not regret it," Kelly said. ' +
        'Sara was not {{3:konvinsed}}. However, she did not want to be a spoilsport so she climbed {{4:to}} the seat next to Kelly. ' +
        'As the rollercoaster {{5:chuggled}} up the track, Sara closed her eyes. When it started plunging down, Sara began to {{6:srheek}} at the top of her lungs. ' +
        'Strangely, she lost her fear and began to enjoy the experience.',
      errors: [
        { num: 1, kind: 'grammar',    wrong: 'by',         correction: 'with',     explain: '"Come with her" — the preposition for accompaniment is "with", not "by".' },
        { num: 2, kind: 'punctuation',wrong: '',           correction: '’',        explain: 'An apostrophe is needed for the contraction "it\'ll" (= it will).' },
        { num: 3, kind: 'spelling',   wrong: 'konvinsed',  correction: 'convinced',explain: 'Correct spelling is "convinced".' },
        { num: 4, kind: 'grammar',    wrong: 'to',         correction: 'into',     explain: '"Climbed into the seat" — use "into" for movement that ends inside something.' },
        { num: 5, kind: 'spelling',   wrong: 'chuggled',   correction: 'chugged',  explain: 'Correct spelling is "chugged" (simple past of "chug").' },
        { num: 6, kind: 'spelling',   wrong: 'srheek',     correction: 'shriek',   explain: 'Correct spelling is "shriek".' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended', marks: 10,
      passage:
        'Six-year-old Leo was all ready and eager to go on his thrilling excursion. His mother had promised to take him to the Science Centre to view the special dinosaur exhibition. He could not sleep a wink the night before just thinking about today’s trip.\n\n' +
        'Suddenly, a wave of people surged at the MRT station. Leo was pushed forward. He stumbled, and his hand slipped from his mother’s grip. When he spun around, his mother was nowhere to be seen! She seemed to have been swallowed up by the crowd.\n\n' +
        'His throat tightened and tears pricked his eyes. "Mum!" he cried, but his voice was drowned out by the noise of passengers rushing past him.\n\n' +
        'Taking a deep breath, Leo remembered his mum’s words: "If we ever get separated, go to station control and ask the officer on duty for help." He made his way there and luckily for him, kindly Station Manager Mr Kassim was on hand to assist.\n\n' +
        'After Leo told him what had happened, Mr Kassim spoke into a walkie-talkie. He then made a series of announcements calling for Leo’s mum to approach station control.\n\n' +
        'Minutes stretched like hours. Through the crowd, Leo saw his mother rushing to the station control with a worried look on her face about ten minutes later. His heart leapt with joy. "Mum!" he screamed, as he ran towards her. She swept him up in a hug, her eyes filled with relief. Both mother and son were finally reunited!\n\n' +
        'After thanking Mr Kassim, they left the station, hand-in-hand, the Science Centre adventure forgotten. There was just too much excitement for the day!',
      questions: [
        { type: 'word-meaning', marks: 1, q: 'Which word in paragraph 1 has the same meaning as "excited"?', sentence: 'Six-year-old Leo was all ready and eager to go on his thrilling excursion.', choices: ['eager', 'thrilling'], answer: 'eager', explain: '"Eager" means keen and excited to do something.' },
        { type: 'short', marks: 1, q: 'What caused Leo to be "pushed forward" in paragraph 2?', model: 'A wave of people surged at the MRT station.', keywords: ['wave', 'surged', 'crowd'] },
        { type: 'short', marks: 1, q: 'Which four-word phrase in paragraph 2 tells you that Leo’s mother could not be found?', model: 'nowhere to be seen', keywords: ['nowhere to be seen'] },
        { type: 'short', marks: 2, q: 'What two things did Leo’s mother tell him to do if he got lost?', model: 'Go to station control AND ask the officer on duty for help.', keywords: ['station control', 'officer', 'help'] },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Leo was overjoyed to see his mother again.', 'The excursion was cancelled.', 'Leo shouted for his mother.'], answer: [3, 1, 2] },
        { type: 'short', marks: 2, q: 'How did Mr Kassim help Leo?', model: 'He spoke into a walkie-talkie and made a series of announcements calling for Leo’s mum to approach station control.', keywords: ['announcements', 'walkie-talkie', 'mum'] },
        {
          type: 'true-false', marks: 2,
          q: 'Read each statement and decide if it is True or False.',
          statements: [
            { text: 'Leo waited for hours to be reunited with his mother.', answer: false, explain: 'It was about ten minutes — "Minutes stretched like hours" is a simile, not literal hours.' },
            { text: 'Both Leo and his mother were holding hands when they left the MRT station.', answer: true, explain: 'The passage says they left "hand-in-hand".' },
          ],
        },
      ],
    },
  },

  T2: {
    id: 'p3-test-term-2', term: 'T2', level: 'P3',
    label: 'Term 2 Practice Test 2',
    duration: '45 minutes', totalMarks: 40,
    blurb: 'P3 Term 2 paper — adds tag questions ("isn\'t he?"), phrasal verbs ("breaking out") and Neither...nor synthesis. Comprehension: Billy in the house of mirrors.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'Jean ___ in the pool for an hour last night.', choices: ['swim', 'swims', 'swam', 'is swimming'], answer: 'swam', skill: 'simplePast', practiseTarget: 'grammar-mcq', explain: '"Last night" — simple past; the irregular past of "swim" is "swam".' },
        { q: 'Andy is joining us for recess, ___ he?', choices: ['is', 'isn’t', 'does', 'doesn’t'], answer: 'isn’t', skill: 'tagQuestions', practiseTarget: 'grammar-mcq', explain: 'A positive statement takes a negative tag — "is" → "isn\'t he?".' },
        { q: 'The student asked the teacher, "___ I be allowed to go to the toilet, please?"', choices: ['Will', 'May', 'Must', 'Should'], answer: 'May', skill: 'modals', practiseTarget: 'grammar-mcq', explain: '"May I...?" is the polite form for asking permission.' },
        { q: '"___ is the best-selling item in this store? Is it the oven or the kettle?" the customer asked the sales staff.', choices: ['Who', 'Where', 'Whose', 'Which'], answer: 'Which', skill: 'whQuestions', practiseTarget: 'grammar-mcq', explain: '"Which" asks the listener to pick from a known set (oven vs kettle).' },
        { q: 'I must have dropped my key ___. I cannot seem to find it.', choices: ['nowhere', 'anywhere', 'somewhere', 'everywhere'], answer: 'somewhere', skill: 'compoundIndefinite', practiseTarget: 'grammar-mcq', explain: '"Somewhere" — in some unknown place. "Nowhere" would contradict "I must have dropped".' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'Mrs Teo could not identify the burglar as she had only caught a ___ of his face.', choices: ['look', 'peep', 'view', 'glimpse'], answer: 'glimpse', skill: 'synonymContrast', practiseTarget: 'vocab-mcq', explain: '"A glimpse" is a brief, partial look — fits "could not identify".' },
        { q: 'The prisoners succeeded in ___ of prison by using a secret underground tunnel.', choices: ['breaking into', 'breaking up', 'breaking out', 'breaking through'], answer: 'breaking out', skill: 'phrasalVerbs', practiseTarget: 'vocab-mcq', explain: '"Break out (of)" means to escape from a place where you are kept.' },
        { q: 'Our school team won an easy ___ over our competitors in the match with a score of 4 to 1.', choices: ['result', 'defeat', 'victory', 'success'], answer: 'victory', skill: 'definitionMatch', practiseTarget: 'vocab-mcq', explain: '"Victory" is the win itself. "Defeat" is the opposite — what the losers got.' },
        { q: 'The chef added only a ___ of salt to the dish.', choices: ['grain', 'dash', 'drop', 'pinch'], answer: 'pinch', skill: 'collectiveNouns', practiseTarget: 'vocab-mcq', explain: '"A pinch of salt" — the small amount you take between thumb and forefinger.' },
        { q: 'Daphne was ___ enough to talk back and challenge the bully.', choices: ['bold', 'strong', 'heroic', 'fearful'], answer: 'bold', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Bold" means brave enough to do something risky — fits standing up to a bully.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['at', 'along', 'out', 'off', 'through', 'in', 'with'],
      text:
        'During the holidays, Kenneth decided to explore the jungle nearby. He went {{1}} without telling anyone where he was going. ' +
        'All he took {{2}} him was a backpack that contained a bottle of water, his wallet and an umbrella. ' +
        'He did not bring his mobile phone {{3}} as he thought it was unnecessary. ' +
        'Unfortunately, Kenneth lost his way {{4}} the dense jungle. It was also getting dark. ' +
        'No matter how hard he tried, he could not find a way {{5}}. Poor Kenneth! He regretted going on this trip alone and leaving his phone behind.',
      answers: ['off', 'with', 'along', 'in', 'out'],
      leftOver: ['at', 'through'],
      skill: 'prepositions', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['much', 'suffer', 'many', 'able', 'eaten', 'harmful', 'unhealthy'],
      text:
        'Did you know that chocolate can make your dog ill? Chocolate is {{1}} to dogs as it contains theobromine and caffeine. ' +
        'The amount of chocolate that is poisonous to a dog depends on the type of chocolate that they have {{2}}. ' +
        'It also depends on how {{3}} chocolate they ate and the size of the dog. ' +
        'Dogs that {{4}} from chocolate poisoning may have stomach pain or an upset stomach. ' +
        'They also may not be {{5}} to walk in a straight line or they may breathe too quickly. If you see such signs, you should take your dog to the vet straight away.',
      answers: ['harmful', 'eaten', 'much', 'suffer', 'able'],
      leftOver: ['many', 'unhealthy'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Sentence Combining / Synthesis', marks: 4,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['Gina was angry with John.', 'John did not keep his promise.'], connector: 'because', stemPosition: 'middle', model: 'Gina was angry with John because he did not keep his promise.', skill: 'connectors', explain: '"Because" gives the reason — keep the action first, reason after.' },
        { originals: ['Lisa does not play badminton.', 'Kate also does not play badminton.'], connector: 'Neither...nor', stemPosition: 'start', model: 'Neither Lisa nor Kate plays badminton.', skill: 'connectors', explain: '"Neither...nor" joins two negative subjects; the verb takes the singular form ("plays").' },
      ],
    },
    sectionF: {
      title: 'Section F: Editing', marks: 6,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A circle marks a missing or wrong punctuation mark.',
      paragraph:
        'It was April Fools’ Day. Frank had been looking forward to this day for almost a week. ' +
        'He simply loved playing pranks {{1:with}} people. ' +
        'However{{2:o}} little did he expect that his friends would be the ones taking {{3:rivange}} on him for the tricks he had played on them many times before. ' +
        'When Frank was not looking, one of his friends Samuel {{4:hiding}} a large fake spider in his bag. ' +
        'When Frank opened his bag, he screamed, "Eeks! There’s a huge spider{{5:o}}" Everyone laughed. Now Frank had a taste of his own {{6:medecine}}. He now knew how it felt to be scared out of his wits.',
      errors: [
        { num: 1, kind: 'grammar',    wrong: 'with',       correction: 'on',       explain: '"Playing pranks on people" — the correct preposition is "on", not "with".' },
        { num: 2, kind: 'punctuation',wrong: '',           correction: ',',        explain: 'A comma is needed after the connector "However".' },
        { num: 3, kind: 'spelling',   wrong: 'rivange',    correction: 'revenge',  explain: 'Correct spelling is "revenge".' },
        { num: 4, kind: 'grammar',    wrong: 'hiding',     correction: 'hid',      explain: 'Past narrative — use simple past "hid", not the -ing form.' },
        { num: 5, kind: 'punctuation',wrong: '',           correction: '!',        explain: 'An exclamation mark is needed to close the exclamation "There\'s a huge spider!".' },
        { num: 6, kind: 'spelling',   wrong: 'medecine',   correction: 'medicine', explain: 'Correct spelling is "medicine".' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended', marks: 10,
      passage:
        'Billy’s eyes grew as wide as saucers. The entrance to the house of mirrors was a giant clown. Its mouth gaped like a hungry monster. Inside, there were lots of mirrors that reflected and twisted images. "Wow!" Billy gasped excitedly and ran in without waiting for his father.\n\n' +
        'Billy chased his reflection, giggling as it did the same. He reached out with his fingers brushing against cool glass. His reflection in the mirror just laughed at him and pointed deeper into the maze. Eager to find out where it would lead him, Billy followed.\n\n' +
        'Suddenly, Billy stopped giggling. He turned, but only saw endless reflections of himself. They were all wearing the same confused frown. Some of the images in the mirrors were beginning to frighten him. His head had grown to three times its size, his eyes looked crooked and his arms and legs looked like the tentacles of an octopus!\n\n' +
        'Panic began to grip his chest. "Dad, where are you?" Billy cried out, his voice shaking. He was lost in the maze. There was no one there to help him.\n\n' +
        'Just then, a familiar hand squeezed Billy’s hand. It was Dad’s! "Don’t be frightened. Here I am," he said and grinned widely. His father led Billy back to the giant clown’s mouth. Billy stepped out hurriedly. Never would he want to visit another funhouse of mirrors ever again!',
      questions: [
        { type: 'mcq', marks: 1, q: 'When Billy first saw the house of mirrors, he was ________________.', choices: ['worried', 'terrified', 'confused', 'surprised'], answer: 'surprised', explain: '"Eyes grew as wide as saucers" + "Wow!" both signal pleased surprise, not fear.' },
        { type: 'word-meaning', marks: 1, q: 'Which word in paragraph 1 has the same meaning as "caused to be out of shape"?', sentence: 'Inside, there were lots of mirrors that reflected and twisted images.', choices: ['reflected', 'twisted'], answer: 'twisted', explain: '"Twisted" means bent or distorted out of shape.' },
        { type: 'short', marks: 1, q: 'What does "it" in paragraph 2 line 1 refer to?', model: 'Billy’s reflection (in the mirror).', keywords: ['reflection'] },
        { type: 'short', marks: 3, q: 'Look at paragraph 3. Why did some of the images in the mirrors frighten Billy? Give three reasons.', model: '(1) His head had grown to three times its size, (2) his eyes looked crooked, and (3) his arms and legs looked like the tentacles of an octopus.', keywords: ['head', 'eyes', 'arms', 'legs', 'octopus'] },
        { type: 'short', marks: 1, q: 'Which word in paragraph 4 tells you that Billy could not find his way out?', model: 'lost', keywords: ['lost'] },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Billy’s father found him.', 'Billy followed his reflection.', 'Billy did not wait for his father.'], answer: [3, 2, 1] },
        {
          type: 'true-false', marks: 2,
          q: 'Read each statement and decide if it is True or False.',
          statements: [
            { text: 'Billy followed his reflection as he wanted to discover where it would lead him.', answer: true, explain: 'Paragraph 2 says "Eager to find out where it would lead him, Billy followed."' },
            { text: 'Billy began to cry when he realised he was lost.', answer: false, explain: 'He "cried out" (shouted) for his Dad but did not weep — the passage says his voice was shaking.' },
          ],
        },
      ],
    },
  },

  T3: {
    id: 'p3-test-term-3', term: 'T3', level: 'P3',
    label: 'Term 3 Practice Test 3',
    duration: '1 hour', totalMarks: 50,
    blurb: 'P3 Term 3 paper — introduces open Comprehension Cloze (no word bank) and DOUBLES the comprehension to two passages. Adds modal regret ("should have arrived"), collective-noun SVA and the "which" relative-clause synthesis.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'A group of sheep ___ also known as a flock of sheep.', choices: ['is', 'are', 'was', 'were'], answer: 'is', skill: 'svAgreement', practiseTarget: 'grammar-mcq', explain: '"A group of..." takes a singular verb when treated as a single unit.' },
        { q: 'Mindy wanted to watch the concert, ___ she could not afford to buy the tickets.', choices: ['as', 'but', 'for', 'although'], answer: 'but', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"But" shows the contrast — she wanted to but could not.' },
        { q: '"I ___ have arrived earlier so as not to miss the show," Ernest grumbled to himself.', choices: ['would', 'might', 'must', 'should'], answer: 'should', skill: 'modals', practiseTarget: 'grammar-mcq', explain: '"Should have + past participle" expresses regret about a past action.' },
        { q: '"Pay attention! The principal ___ the announcement right now," said Mr Lee.', choices: ['made', 'makes', 'has made', 'is making'], answer: 'is making', skill: 'presentCont', practiseTarget: 'grammar-mcq', explain: '"Right now" signals an action happening at the moment — use present continuous.' },
        { q: 'You have watched this movie before, ___ you?', choices: ['did', 'have', 'didn’t', 'haven’t'], answer: 'haven’t', skill: 'tagQuestions', practiseTarget: 'grammar-mcq', explain: 'Tag matches the main auxiliary: "have watched" → "haven\'t you?" (negative tag for positive statement).' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'If you do not want to use the hood, you can ___ it from the jacket.', choices: ['detach', 'loosen', 'release', 'disconnect'], answer: 'detach', skill: 'synonymContrast', practiseTarget: 'vocab-mcq', explain: '"Detach" is the precise verb for separating a removable part (like a hood) from a main item.' },
        { q: 'Everyone was panicking and running about in all directions, but Joe was ___ and stayed where he was.', choices: ['as smooth as silk', 'as cool as a cucumber', 'as cold as ice', 'as tough as leather'], answer: 'as cool as a cucumber', skill: 'similes', practiseTarget: 'vocab-mcq', explain: '"As cool as a cucumber" is the fixed simile for staying calm under pressure.' },
        { q: 'The suspicious-looking man had been ___ in the dimly lit alley for a long time.', choices: ['ambling', 'loitering', 'idling', 'dawdling'], answer: 'loitering', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: '"Loitering" means hanging around with no clear purpose — fits "suspicious".' },
        { q: 'The business deal ___ because both sides could not agree on many matters.', choices: ['fell through', 'fell out', 'fell behind', 'fell over'], answer: 'fell through', skill: 'phrasalVerbs', practiseTarget: 'vocab-mcq', explain: '"Fall through" means (of a plan/deal) to fail to happen.' },
        { q: 'No one could change Denise’s mind as she ___ refuses to listen to others.', choices: ['boldly', 'obstinately', 'deliberately', 'courageously'], answer: 'obstinately', skill: 'mannerAdverbs', practiseTarget: 'vocab-mcq', explain: '"Obstinately" means stubbornly — refuses to change her mind no matter what.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['our', 'they', 'her', 'us', 'their', 'ourselves', 'we'],
      text:
        'Our form teacher Mrs D’Cotta would be away from school for a whole month. The whole class cheered when {{1}} heard the news. ' +
        'Mrs D’Cotta was always very strict with {{2}}, so we were glad we would be able to finally let {{3}} hair down. ' +
        'True enough, when Miss Sim took over, all hell broke loose as we finally had the freedom to do whatever we wanted. ' +
        'No one listened to {{4}} in class and we broke all the class rules. ' +
        'It was only after another teacher scolded us and told us that we ought to be ashamed of {{5}}, that we stopped misbehaving. ' +
        'We never saw Miss Sim again after the month was up.',
      answers: ['we', 'us', 'our', 'her', 'ourselves'],
      leftOver: ['they', 'their'],
      skill: 'pronouns', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['filled', 'attack', 'effective', 'weapon', 'important', 'creatures', 'threatened'],
      text:
        'Whenever you think of skunks, you would immediately think of their reputation as stinky animals. Have you ever wondered why these {{1}} smell so bad? It is all about defence. ' +
        'Skunks have a secret {{2}} under their tail: stinky spray glands! These glands hold a special liquid {{3}} with chemicals called thiols. ' +
        'These thiols contain sulphur, which is also what makes rotten eggs smell so awful. ' +
        'When a skunk feels {{4}} by its predators, it raises its tail and fires this spray with surprising accuracy up to three metres away! ' +
        'The smell is so strong that it is highly {{5}} in convincing hungry animals to find another dinner. You certainly do not want to mess with a skunk!',
      answers: ['creatures', 'weapon', 'filled', 'threatened', 'effective'],
      leftOver: ['attack', 'important'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Comprehension Cloze (open cloze)', marks: 5,
      instructions: 'Fill in each blank with ONE suitable word. There is no word box — use grammar and meaning clues from the passage.',
      text:
        'Gladys had a terrible fear of lizards. Although her parents kept telling her that lizards were {{1}} as they do not sting, bite or attack people like some other fierce animals, Gladys remained unconvinced. ' +
        'She would {{2}} her lungs out every time she saw a lizard appear before her. ' +
        'Once, she even cried and refused to go to the kitchen for an entire month when she {{3}} a family of lizards scuttling across the kitchen floor. ' +
        'Unfortunately, Gladys’s worst nightmare was about to come {{4}}. While she was sleeping in her bedroom, a lizard fell onto her head. That woke her up. ' +
        'She screamed when she felt the lizard running through her hair. She jumped out of {{5}} and immediately headed for her bathroom. There, she took a long shower and scrubbed herself as hard as she could.',
      blanks: [
        { num: 1, answer: 'harmless', accept: ['safe'], hint: 'Opposite of "harmful" — fits "do not sting, bite or attack".', explain: '"Harmless" matches the description that lizards do not sting, bite or attack.' },
        { num: 2, answer: 'scream', accept: ['cry'], hint: 'Verb that fits "___ her lungs out" — a fixed expression.', explain: '"Scream her lungs out" is the standard idiom for shrieking loudly.' },
        { num: 3, answer: 'saw', accept: ['spotted', 'noticed'], hint: 'Past tense — what she did when the lizards came across the floor.', explain: '"Saw" — past tense of "see"; fits the time of the kitchen incident.' },
        { num: 4, answer: 'true', accept: [], hint: 'Fixed phrase meaning "to happen as expected/feared".', explain: '"Come true" — fixed phrase for a wish, dream or nightmare that actually happens.' },
        { num: 5, answer: 'bed', accept: [], hint: 'Where she was sleeping just moments before.', explain: '"Jumped out of bed" — she sprang up from where she was lying.' },
      ],
      skill: 'collocationCloze', practiseTarget: 'cloze-castle',
    },
    sectionF: {
      title: 'Section F: Sentence Combining / Synthesis', marks: 4,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['The light was not working.', 'Father repaired the light.'], connector: 'since', stemPosition: 'middle', model: 'Father repaired the light since it was not working.', skill: 'connectors', explain: '"Since" can give a reason just like "because" — keep the action first.' },
        { originals: ['This is the secret key.', 'It opens every door in the castle.'], connector: 'which', stemPosition: 'middle', model: 'This is the secret key which opens every door in the castle.', skill: 'relativeClauses', explain: '"Which" introduces a relative clause that adds information about the key.' },
      ],
    },
    sectionG: {
      title: 'Section G: Editing', marks: 5,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A circle marks a missing or wrong punctuation mark.',
      paragraph:
        'According to Irish folktales, {{1:mischeveous}} little creatures called leprechauns are very fond {{2:about}} collecting gold. ' +
        'Legend also says that these leprechauns {{3:hiding}} their pots of gold at the end of rainbows. ' +
        'Some people believe that if you{{4:o}}re ever lucky enough to catch a leprechaun, you can make them reveal where they have hidden their gold. ' +
        'But what are your chances of catching one? That is an even tougher {{5:avanture}} than chasing a rainbow! It looks like it’s highly {{6:unlikly}} that such pots of gold can ever be found.',
      errors: [
        { num: 1, kind: 'spelling',   wrong: 'mischeveous',correction: 'mischievous', explain: 'Correct spelling is "mischievous".' },
        { num: 2, kind: 'grammar',    wrong: 'about',      correction: 'of',          explain: '"Fond of" is the fixed pair — never "fond about".' },
        { num: 3, kind: 'grammar',    wrong: 'hiding',     correction: 'hide',        explain: 'Use the simple present "hide" — the legend is told as a general truth.' },
        { num: 4, kind: 'punctuation',wrong: '',           correction: '’',           explain: 'An apostrophe is needed in the contraction "you\'re" (= you are).' },
        { num: 5, kind: 'spelling',   wrong: 'avanture',   correction: 'adventure',   explain: 'Correct spelling is "adventure".' },
        { num: 6, kind: 'spelling',   wrong: 'unlikly',    correction: 'unlikely',    explain: 'Correct spelling is "unlikely".' },
      ],
    },
    sectionH: {
      title: 'Section H: Comprehension Open-ended 1 — Yes and No', marks: 8,
      passage:
        'Before words were words, a boy named Yes lived in a small village. Yes was good at everything. He was the best, smartest and most liked person in his village. Yes had a brother whose name was No. No was jealous of Yes, because he was not much good at anything himself. Whenever the villagers asked No for help, he refused because he did not like people. On the other hand, whenever someone asked Yes for a favour, he would gladly help.\n\n' +
        'One day, Yes and No’s father, Okay, went on a long journey. He left his two sons in charge of the animals. Yes took good care of the great guck, the icks, and the three-toed yock. No did not want to be bothered with the boring tasks involved. Instead of helping his brother, No went down to the lake and threw rocks into the water.\n\n' +
        'A few days after his father had left, Yes asked his brother to watch the three-toed yock while he went to find some food to eat. Instead of doing what Yes asked, No lay down, shut his eyes, and forgot about the yock.\n\n' +
        'It just so happened that the King was travelling on his personal road nearby. When the three-toed yock wandered onto the road, the King’s carriage was passing by and had to swerve to avoid hitting it. The King was thrown from the carriage and fell to the ground and hurt himself.\n\n' +
        'The King demanded to know why a three-toed yock had been allowed on his road and asked all the villagers for an explanation. Yes was always honest, so he told the King the entire story.\n\n' +
        'The King then came up with an idea – Yes and No were to work in the castle as his personal assistants as punishment for what was later referred to as the worst three-toed yock and carriage accident in the kingdom’s history.',
      questions: [
        { type: 'mcq', marks: 1, q: 'The brothers Yes and No were ________________.', choices: ['both well-liked in their village', 'good at everything', 'different from each other', 'jealous of each other'], answer: 'different from each other', explain: 'Yes was helpful and liked; No was jealous and refused to help — clear opposites.' },
        { type: 'short', marks: 2, q: 'When their father left the brothers in charge of the animals, what did No do with them and why?', model: 'No did not want to be bothered with the boring tasks. Instead of helping his brother, he went down to the lake and threw rocks into the water.', keywords: ['lake', 'rocks', 'boring', 'not help'] },
        { type: 'short', marks: 1, q: 'What does "what Yes asked" in paragraph 3 refer to?', model: 'It refers to Yes asking No to watch the three-toed yock while he went to find food.', keywords: ['watch', 'yock'] },
        {
          type: 'table', marks: 2,
          q: 'In the table below, write down the person who did each action.',
          rows: [
            { action: 'went on a long journey', answer: 'Okay (their father)' },
            { action: 'gave an explanation to the king', answer: 'Yes' },
          ],
        },
        {
          type: 'true-false', marks: 2,
          q: 'State whether each statement is True or False and give a reason.',
          statements: [
            { text: 'The King was injured by the three-toed yock.', answer: false, explain: 'The yock did not hit the King — the carriage swerved to avoid it, and the King fell off and hurt himself.' },
            { text: 'Both brothers were punished by the King.', answer: true, explain: 'Both Yes and No were sent to work in the castle as personal assistants as punishment.' },
          ],
        },
      ],
    },
    sectionI: {
      title: 'Section I: Comprehension Open-ended 2 — Lila and the Sunflowers', marks: 8,
      passage:
        'Lila loved flowers. Every morning, she would skip to the window to see if any new flowers had blossomed in Grandma’s garden. Sunflowers, tall and proud, were her favourite. Their bright faces seemed to smile at her. But lately, Lila’s heart felt heavy. Some sunflowers were losing their shine, their petals drooping like tired wings.\n\n' +
        'One day, a droopy sunflower caught her eye. Tears welled up in Lila’s eyes. "Grandma," she sniffled, "this sunflower looks sad. Is it going to sleep forever?"\n\n' +
        'With a gentle smile on her face, Grandma knelt beside Lila. "Flowers do have a special kind of sleep, Lila," she explained. "But it’s not the same way that we sleep. They use that time to make tiny seeds."\n\n' +
        'Lila stopped frowning and began peering with curiosity. "Seeds?"\n\n' +
        'Grandma pointed to a brown, bumpy head at the sunflower’s centre. "See those? These are seeds. When the flower sleeps, these seeds fall to the ground and wait for spring. Then, poof! They wake up as new sunflowers, just like their parents!"\n\n' +
        'Lila’s eyes widened. "So, the sleeping isn’t goodbye, but a hello?"\n\n' +
        '"That’s right!" Grandma grinned. "The sleepy flowers are just taking a break before becoming part of a whole new garden."\n\n' +
        'From that day on, Lila did not feel sad when sunflowers drooped. Instead, she would whisper, "Sweet dreams, sunflower. I can’t wait to see you next spring and say hello!"',
      questions: [
        { type: 'short', marks: 1, q: 'Which four-word phrase in paragraph 1 tells you that Lila was feeling sad?', model: 'heart felt heavy', keywords: ['heart felt heavy', 'lately'] },
        { type: 'short', marks: 1, q: 'What does "that time" in paragraph 3 refer to?', model: 'It refers to the time when flowers are in their special kind of sleep.', keywords: ['sleep', 'special'] },
        { type: 'word-meaning', marks: 1, q: 'Which word in paragraph 4 has the same meaning as "looking closely"?', sentence: 'Lila stopped frowning and began peering with curiosity.', choices: ['frowning', 'peering'], answer: 'peering', explain: '"Peering" means looking carefully at something to see it clearly.' },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Lila no longer felt upset when she saw sunflowers drooping.', 'Lila spotted a droopy sunflower.', 'Lila learnt how new sunflowers can grow.'], answer: [3, 1, 2] },
        {
          type: 'true-false', marks: 2,
          q: 'Read each statement and decide if it is True or False.',
          statements: [
            { text: 'Lila liked sunflowers best of all.', answer: true, explain: 'Paragraph 1 says "Sunflowers, tall and proud, were her favourite."' },
            { text: 'In spring, the sunflowers would droop.', answer: false, explain: 'In spring the seeds wake up as new sunflowers — the drooping happens earlier, not in spring.' },
          ],
        },
        { type: 'short', marks: 2, q: 'What two things did Lila want to do next spring?', model: 'She wanted to see the new sunflowers and say hello to them.', keywords: ['see', 'say hello', 'sunflower'] },
      ],
    },
  },
});

export function getP3PracticeTests() {
  return P3_PRACTICE_TEST_TERMS.map(term => P3_PRACTICE_TESTS[term]);
}

export function getP3PracticeTest(term) {
  return P3_PRACTICE_TESTS[term] || null;
}

/**
 * Validate the P3 practice test bank.
 */
export function validateP3PracticeTests(bank = P3_PRACTICE_TESTS) {
  const issues = [];
  const blankRe = /\{\{(\d+)\}\}/g;
  const editingBlankRe = /\{\{(\d+):[^}]*\}\}/g;
  const allowedTargets = new Set(['grammar-mcq', 'vocab-mcq', 'cloze-castle', 'word-vault', 'sentence-forge', 'editing-quest']);

  for (const term of P3_PRACTICE_TEST_TERMS) {
    const test = bank?.[term];
    const tag = `P3/${term}`;
    if (!test) { issues.push(`${tag}: missing`); continue; }
    if (test.level !== 'P3') issues.push(`${tag}: level must be P3`);

    for (const key of ['sectionA', 'sectionB']) {
      const s = test[key];
      if (!s || !Array.isArray(s.items) || s.items.length !== 5) { issues.push(`${tag}/${key}: must have 5 items`); continue; }
      for (const item of s.items) {
        if (!item.q || !Array.isArray(item.choices) || item.choices.length !== 4) issues.push(`${tag}/${key}: malformed item`);
        if (!item.choices?.includes(item.answer)) issues.push(`${tag}/${key}: answer "${item.answer}" not among choices`);
        if (new Set(item.choices).size !== item.choices.length) issues.push(`${tag}/${key}: duplicate choices`);
        if (item.practiseTarget && !allowedTargets.has(item.practiseTarget)) issues.push(`${tag}/${key}: unknown practiseTarget "${item.practiseTarget}"`);
      }
    }

    for (const key of ['sectionC', 'sectionD']) {
      const s = test[key];
      if (!s) { issues.push(`${tag}/${key}: missing`); continue; }
      const blanks = [...(s.text || '').matchAll(blankRe)].map(m => Number(m[1]));
      if (blanks.length !== 5) issues.push(`${tag}/${key}: expected 5 blanks, found ${blanks.length}`);
      if (!Array.isArray(s.answers) || s.answers.length !== 5) issues.push(`${tag}/${key}: expected 5 answers`);
      const minBank = s.reuseAllowed ? 2 : 5;
      if (!Array.isArray(s.wordBank) || s.wordBank.length < minBank) issues.push(`${tag}/${key}: word bank too small`);
      const bankLower = (s.wordBank || []).map(w => w.toLowerCase());
      for (const a of s.answers || []) {
        if (!bankLower.includes(String(a).toLowerCase())) issues.push(`${tag}/${key}: answer "${a}" missing from word bank`);
      }
    }

    if (term === 'T3') {
      const ccloze = test.sectionE;
      if (!ccloze || typeof ccloze.text !== 'string') issues.push(`${tag}/sectionE: missing open-cloze text`);
      else {
        const blanks = [...ccloze.text.matchAll(blankRe)].map(m => Number(m[1]));
        if (blanks.length !== 5) issues.push(`${tag}/sectionE: expected 5 blanks, found ${blanks.length}`);
        if (!Array.isArray(ccloze.blanks) || ccloze.blanks.length !== 5) issues.push(`${tag}/sectionE: needs 5 blank specs`);
      }
    }

    const synthKey = term === 'T3' ? 'sectionF' : 'sectionE';
    const synth = test[synthKey];
    if (!synth || !Array.isArray(synth.items) || synth.items.length !== 2) {
      issues.push(`${tag}/${synthKey}: must have 2 sentence-combining items`);
    } else {
      for (const item of synth.items) {
        if (!Array.isArray(item.originals) || item.originals.length !== 2) issues.push(`${tag}/${synthKey}: each item needs 2 originals`);
        if (typeof item.model !== 'string' || !item.model.trim()) issues.push(`${tag}/${synthKey}: missing model`);
        if (typeof item.connector !== 'string' || !item.connector.trim()) issues.push(`${tag}/${synthKey}: missing connector`);
      }
    }

    const editKey = term === 'T3' ? 'sectionG' : 'sectionF';
    const edit = test[editKey];
    if (!edit || typeof edit.paragraph !== 'string') issues.push(`${tag}/${editKey}: missing editing paragraph`);
    else {
      const blanks = [...edit.paragraph.matchAll(editingBlankRe)].map(m => Number(m[1]));
      if (blanks.length < 5) issues.push(`${tag}/${editKey}: editing has only ${blanks.length} blanks (expected 5+)`);
      if (!Array.isArray(edit.errors) || edit.errors.length !== blanks.length) issues.push(`${tag}/${editKey}: errors count must match blanks count`);
      checkEditingErrors(issues, `${tag}/${editKey}`, edit);
    }

    const compKeys = term === 'T3' ? ['sectionH', 'sectionI'] : ['sectionG'];
    for (const k of compKeys) {
      const comp = test[k];
      if (!comp || typeof comp.passage !== 'string' || !comp.passage.trim()) issues.push(`${tag}/${k}: missing passage`);
      if (!Array.isArray(comp?.questions) || comp.questions.length < 4) issues.push(`${tag}/${k}: needs at least 4 questions`);
    }

    const sectionKeys = term === 'T3'
      ? ['sectionA','sectionB','sectionC','sectionD','sectionE','sectionF','sectionG','sectionH','sectionI']
      : ['sectionA','sectionB','sectionC','sectionD','sectionE','sectionF','sectionG'];
    const total = sectionKeys.map(k => test[k]?.marks || 0).reduce((a,b) => a+b, 0);
    if (total !== test.totalMarks) issues.push(`${tag}: section marks sum to ${total} but totalMarks=${test.totalMarks}`);
  }

  return issues;
}
