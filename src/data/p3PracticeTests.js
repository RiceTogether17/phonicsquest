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
 * All prompts, passages and cloze texts are ORIGINAL content written for
 * PhonicsQuest. Only the paper format and the skills tested follow the
 * school-paper convention — no question or passage is reproduced from any
 * published or school paper.
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
    blurb: 'P3 Term 1 paper — past continuous ("was sleeping when..."), polite "Could you", possessive "whose" and an "although / comparative-than" synthesis pair. Comprehension: Mira lost at the book fair.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'Halim ___ in the hammock when a sudden clap of thunder woke him.', choices: ['sleep', 'slept', 'is sleeping', 'was sleeping'], answer: 'was sleeping', skill: 'pastCont', practiseTarget: 'grammar-mcq', explain: '"Was sleeping" is past continuous — a longer past action that was interrupted by the thunder.' },
        { q: 'After finishing all her chores, Rina had very ___ energy left to play.', choices: ['much', 'some', 'many', 'little'], answer: 'little', skill: 'quantifiers', practiseTarget: 'grammar-mcq', explain: '"Very little energy" = almost none. "Little" is the negative quantifier for uncountable nouns.' },
        { q: '___ a week’s time, we will be sitting for our spelling test.', choices: ['By', 'In', 'On', 'Before'], answer: 'In', skill: 'prepositions', practiseTarget: 'grammar-mcq', explain: '"In a week\'s time" is a fixed phrase meaning "after one week from now".' },
        { q: '"___ watercolour set is this? There’s no label on it," Mrs Nair asked the class.', choices: ['Who', 'What', 'Whose', 'Which'], answer: 'Whose', skill: 'whQuestions', practiseTarget: 'grammar-mcq', explain: '"Whose" asks about ownership; "who" asks about a person.' },
        { q: '"___ you hold my bag for a minute? I need to tie my shoelace," Devi asked.', choices: ['May', 'Could', 'Must', 'Should'], answer: 'Could', skill: 'modals', practiseTarget: 'grammar-mcq', explain: '"Could you...?" is the polite request form when asking someone for a favour.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'Poor Alvin lost his footing and ___ down the grassy slope.', choices: ['tripped', 'slipped', 'dropped', 'tumbled'], answer: 'tumbled', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: '"Tumbled" means fell head-over-heels — the right verb for rolling down a slope.' },
        { q: 'The injured cyclist ___ in pain as he clutched his knee.', choices: ['sighed', 'groaned', 'mumbled', 'grumbled'], answer: 'groaned', skill: 'soundVerbs', practiseTarget: 'vocab-mcq', explain: '"Groaned" is a deep painful sound. "Mumbled" and "grumbled" are about speech.' },
        { q: 'Everyone was ___ as no one had expected the quietest newcomer to be crowned champion.', choices: ['unsure', 'alarmed', 'puzzled', 'embarrassed'], answer: 'puzzled', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Puzzled" matches the surprise of an unexpected, hard-to-understand result.' },
        { q: 'Uncle Roy bought a huge ___ of beef for the weekend barbecue.', choices: ['slab', 'lump', 'slice', 'block'], answer: 'slab', skill: 'collectiveNouns', practiseTarget: 'vocab-mcq', explain: 'A "slab" of meat is a thick, flat piece — the term used for a large cut of beef.' },
        { q: 'Despite all the trophies she has won, Xin Yi remains ___ and never brags about her success.', choices: ['bold', 'timid', 'humble', 'confident'], answer: 'humble', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Humble" means modest — the opposite of boastful.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['herself', 'their', 'she', 'they', 'her', 'them', 'themselves'],
      text:
        'Sherry was the eldest child in her family. Whenever her parents worked late, {{1}} had to mind her twin brothers. ' +
        'They were only four years old and were not able to care for {{2}} yet. ' +
        'Being sensible for {{3}} age, Sherry could be counted on to keep things running smoothly at home. ' +
        'She would warm up dinner for {{4}}, remind them to brush their teeth and pack {{5}} school bags for the next day. ' +
        'Her parents never worried, for they knew the twins were in Sherry’s capable hands.',
      answers: ['she', 'themselves', 'her', 'them', 'their'],
      leftOver: ['herself', 'they'],
      skill: 'pronouns', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['ability', 'recover', 'skill', 'lose', 'regrow', 'aside', 'apart'],
      text:
        'Starfish are truly remarkable sea animals. They have several features that set them {{1}} from other creatures. ' +
        'One surprising fact about starfish is that they have no brain and no blood. ' +
        'Another amazing feature of starfish is their {{2}} to regenerate. This means they can {{3}} lost arms over time. ' +
        'This power helps them survive in the wild, for it allows them to {{4}} from attacks and carry on living even if they {{5}} a limb to a hungry predator. ' +
        'Starfish are without doubt among the most fascinating animals in the sea.',
      answers: ['apart', 'ability', 'regrow', 'recover', 'lose'],
      leftOver: ['skill', 'aside'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Sentence Combining / Synthesis', marks: 4,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['Priya had a sprained ankle.', 'She still finished the race.'], connector: 'although', stemPosition: 'middle', model: 'Priya finished the race although she had a sprained ankle.', skill: 'connectors', explain: '"Although" introduces an unexpected fact — the sprain did not stop her.' },
        { originals: ['Ken is fast.', 'His cousin is not as fast.'], connector: 'than', stemPosition: 'middle', model: 'Ken is faster than his cousin.', skill: 'comparatives', explain: 'Comparing two people uses "-er than" (or "more ___ than" for longer adjectives).' },
      ],
    },
    sectionF: {
      title: 'Section F: Editing', marks: 6,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A circle marks a missing or wrong punctuation mark.',
      paragraph:
        'It was the first time that Devi was going down the giant zipline at adventure camp. She was not keen, but her friend Priya wanted her to come {{1:by}} her. ' +
        '"I promise you it{{2:o}}ll be exciting! You will not regret it," Priya said. ' +
        'Devi was not {{3:konvinsed}}. However, she did not want to be a wet blanket, so she climbed {{4:to}} the harness beside Priya. ' +
        'As the pulley {{5:wizzed}} along the cable, Devi squeezed her eyes shut. When the ground dropped away below her, Devi began to {{6:srheek}} at the top of her lungs. ' +
        'Strangely, her fear melted away and she began to enjoy the ride.',
      errors: [
        { num: 1, kind: 'grammar',    wrong: 'by',         correction: 'with',     explain: '"Come with her" — the preposition for accompaniment is "with", not "by".' },
        { num: 2, kind: 'punctuation',wrong: '',           correction: '’',        explain: 'An apostrophe is needed for the contraction "it\'ll" (= it will).' },
        { num: 3, kind: 'spelling',   wrong: 'konvinsed',  correction: 'convinced',explain: 'Correct spelling is "convinced".' },
        { num: 4, kind: 'grammar',    wrong: 'to',         correction: 'into',     explain: '"Climbed into the harness" — use "into" for movement that ends inside something.' },
        { num: 5, kind: 'spelling',   wrong: 'wizzed',     correction: 'whizzed',  explain: 'Correct spelling is "whizzed".' },
        { num: 6, kind: 'spelling',   wrong: 'srheek',     correction: 'shriek',   explain: 'Correct spelling is "shriek".' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended', marks: 10,
      passage:
        'Seven-year-old Mira was all set and eager for her exciting outing. Her father had promised to bring her to the giant book fair at the convention centre to hunt for her favourite comic series. She had hardly slept a wink the night before just thinking about the trip.\n\n' +
        'Suddenly, a stream of shoppers poured out of the lifts at the entrance. Mira was carried along by the crowd. She stumbled, and her fingers slipped out of her father’s hand. When she turned around, her father was nowhere to be seen! He seemed to have melted into the sea of people.\n\n' +
        'Her chest went tight and tears stung her eyes. "Papa!" she called, but her voice was swallowed by the din of the shoppers bustling past her.\n\n' +
        'Taking a deep breath, Mira remembered her father’s instructions: "If we ever lose each other, go to the information counter and tell the staff on duty." She threaded her way there, and luckily for her, kindly Customer Service Officer Ms Wong was ready to help.\n\n' +
        'After Mira explained what had happened, Ms Wong picked up a microphone. She then made several announcements asking Mira’s father to come to the information counter.\n\n' +
        'Minutes crawled by like hours. Through the crowd, about ten minutes later, Mira spotted her father hurrying towards the counter with a frantic look on his face. Her heart leapt. "Papa!" she cried, dashing towards him. He scooped her up in a tight hug, his eyes brimming with relief. Father and daughter were together again at last!\n\n' +
        'After thanking Ms Wong, they left the centre hand-in-hand, the book fair forgotten. There had been more than enough excitement for one day!',
      questions: [
        { type: 'word-meaning', marks: 1, q: 'Which word in paragraph 1 has the same meaning as "excited"?', sentence: 'Seven-year-old Mira was all set and eager for her exciting outing.', choices: ['eager', 'exciting'], answer: 'eager', explain: '"Eager" means keen and excited to do something.' },
        { type: 'short', marks: 1, q: 'What caused Mira to be "carried along by the crowd" in paragraph 2?', model: 'A stream of shoppers poured out of the lifts at the entrance.', keywords: ['stream', 'shoppers', 'poured'] },
        { type: 'short', marks: 1, q: 'Which four-word phrase in paragraph 2 tells you that Mira’s father could not be found?', model: 'nowhere to be seen', keywords: ['nowhere to be seen'] },
        { type: 'short', marks: 2, q: 'What two things did Mira’s father tell her to do if they lost each other?', model: 'Go to the information counter AND tell the staff on duty.', keywords: ['information counter', 'staff'] },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Mira was overjoyed to see her father again.', 'The book fair trip was called off.', 'Mira called out for her father.'], answer: [2, 3, 1] },
        { type: 'short', marks: 2, q: 'How did Ms Wong help Mira?', model: 'She picked up a microphone and made several announcements asking Mira’s father to come to the information counter.', keywords: ['announcements', 'microphone', 'father'] },
        {
          type: 'true-false', marks: 2,
          q: 'Read each statement and decide if it is True or False.',
          statements: [
            { text: 'Mira waited for hours to be reunited with her father.', answer: false, explain: 'It was about ten minutes — "Minutes crawled by like hours" is a simile, not literal hours.' },
            { text: 'Mira and her father were holding hands when they left the convention centre.', answer: true, explain: 'The passage says they left "hand-in-hand".' },
          ],
        },
      ],
    },
  },

  T2: {
    id: 'p3-test-term-2', term: 'T2', level: 'P3',
    label: 'Term 2 Practice Test 2',
    duration: '45 minutes', totalMarks: 40,
    blurb: 'P3 Term 2 paper — adds tag questions ("isn\'t he?"), phrasal verbs ("breaking out") and Neither...nor synthesis. Comprehension: Tara in the mirror maze.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'Rita ___ twenty laps at the club pool yesterday evening.', choices: ['swim', 'swims', 'swam', 'is swimming'], answer: 'swam', skill: 'simplePast', practiseTarget: 'grammar-mcq', explain: '"Yesterday evening" — simple past; the irregular past of "swim" is "swam".' },
        { q: 'Zack is coming along for the picnic, ___ he?', choices: ['is', 'isn’t', 'does', 'doesn’t'], answer: 'isn’t', skill: 'tagQuestions', practiseTarget: 'grammar-mcq', explain: 'A positive statement takes a negative tag — "is" → "isn\'t he?".' },
        { q: 'The pupil asked the librarian, "___ I be allowed to renew this book, please?"', choices: ['Will', 'May', 'Must', 'Should'], answer: 'May', skill: 'modals', practiseTarget: 'grammar-mcq', explain: '"May I...?" is the polite form for asking permission.' },
        { q: '"___ is the most popular flavour at this stall? Is it chocolate or vanilla?" the boy asked the vendor.', choices: ['Who', 'Where', 'Whose', 'Which'], answer: 'Which', skill: 'whQuestions', practiseTarget: 'grammar-mcq', explain: '"Which" asks the listener to pick from a known set (chocolate vs vanilla).' },
        { q: 'I must have left my spectacles ___. I simply cannot find them.', choices: ['nowhere', 'anywhere', 'somewhere', 'everywhere'], answer: 'somewhere', skill: 'compoundIndefinite', practiseTarget: 'grammar-mcq', explain: '"Somewhere" — in some unknown place. "Nowhere" would contradict "must have left".' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'Mr Raj could not describe the snatch thief as he had only caught a ___ of his back.', choices: ['look', 'peep', 'view', 'glimpse'], answer: 'glimpse', skill: 'synonymContrast', practiseTarget: 'vocab-mcq', explain: '"A glimpse" is a brief, partial look — fits "could not describe".' },
        { q: 'The circus lion succeeded in ___ of its enclosure through an unlocked gate.', choices: ['breaking into', 'breaking up', 'breaking out', 'breaking through'], answer: 'breaking out', skill: 'phrasalVerbs', practiseTarget: 'vocab-mcq', explain: '"Break out (of)" means to escape from a place where you are kept.' },
        { q: 'Our debate team clinched a convincing ___ over the defending champions.', choices: ['result', 'defeat', 'victory', 'success'], answer: 'victory', skill: 'definitionMatch', practiseTarget: 'vocab-mcq', explain: '"Victory" is the win itself. "Defeat" is the opposite — what the losers suffered.' },
        { q: 'Grandpa added just a ___ of salt to the porridge.', choices: ['grain', 'dash', 'drop', 'pinch'], answer: 'pinch', skill: 'collectiveNouns', practiseTarget: 'vocab-mcq', explain: '"A pinch of salt" — the small amount you take between thumb and forefinger.' },
        { q: 'Wafa was ___ enough to raise her hand and question the visiting speaker.', choices: ['bold', 'strong', 'heroic', 'fearful'], answer: 'bold', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Bold" means brave enough to do something daring — fits questioning a speaker.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['at', 'along', 'out', 'off', 'through', 'in', 'with'],
      text:
        'During the school break, Marcus decided to hike the forest trail behind his estate. He set {{1}} without telling anyone where he was headed. ' +
        'All he brought {{2}} him was a sling bag holding a water bottle, his wallet and a poncho. ' +
        'He did not take his phone {{3}} as he thought he would not need it. ' +
        'Unfortunately, Marcus lost his bearings {{4}} the thick undergrowth. Dusk was falling too. ' +
        'No matter which path he tried, he could not find a way {{5}}. Poor Marcus! He regretted wandering off alone and leaving his phone at home.',
      answers: ['off', 'with', 'along', 'in', 'out'],
      leftOver: ['at', 'through'],
      skill: 'prepositions', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['much', 'suffer', 'many', 'able', 'eaten', 'harmful', 'unhealthy'],
      text:
        'Did you know that onions can make your cat very sick? Onion is {{1}} to cats as it contains compounds that damage their red blood cells. ' +
        'The amount that is dangerous to a cat depends on the form of onion that it has {{2}}. ' +
        'It also depends on how {{3}} onion was swallowed and the size of the cat. ' +
        'Cats that {{4}} from onion poisoning may seem weak or lose their appetite. ' +
        'They may also not be {{5}} to run or climb as usual, or they may pant heavily. If you notice such signs, bring your cat to the vet at once.',
      answers: ['harmful', 'eaten', 'much', 'suffer', 'able'],
      leftOver: ['many', 'unhealthy'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Sentence Combining / Synthesis', marks: 4,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['Hana was upset with Farid.', 'Farid did not return her book.'], connector: 'because', stemPosition: 'middle', model: 'Hana was upset with Farid because he did not return her book.', skill: 'connectors', explain: '"Because" gives the reason — keep the feeling first, reason after.' },
        { originals: ['Sam does not play the piano.', 'Jo also does not play the piano.'], connector: 'Neither...nor', stemPosition: 'start', model: 'Neither Sam nor Jo plays the piano.', skill: 'connectors', explain: '"Neither...nor" joins two negative subjects; the verb takes the singular form ("plays").' },
      ],
    },
    sectionF: {
      title: 'Section F: Editing', marks: 6,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A circle marks a missing or wrong punctuation mark.',
      paragraph:
        'It was the last night of camp. Jamal had been waiting for this evening all week. ' +
        'He simply loved playing tricks {{1:with}} people. ' +
        'However{{2:o}} little did he guess that his bunkmates would be the ones taking {{3:rivange}} on him for the jokes he had pulled on them all week long. ' +
        'While Jamal was at dinner, one of his bunkmates Wei Jie {{4:hiding}} a rubber lizard inside his sleeping bag. ' +
        'When Jamal slid into bed, he yelled, "Yikes! There’s a lizard in here{{5:o}}" Everyone roared with laughter. Now Jamal had a taste of his own {{6:medecine}}. He finally knew how it felt to be scared out of his wits.',
      errors: [
        { num: 1, kind: 'grammar',    wrong: 'with',       correction: 'on',       explain: '"Playing tricks on people" — the correct preposition is "on", not "with".' },
        { num: 2, kind: 'punctuation',wrong: '',           correction: ',',        explain: 'A comma is needed after the connector "However".' },
        { num: 3, kind: 'spelling',   wrong: 'rivange',    correction: 'revenge',  explain: 'Correct spelling is "revenge".' },
        { num: 4, kind: 'grammar',    wrong: 'hiding',     correction: 'hid',      explain: 'Past narrative — use simple past "hid", not the -ing form.' },
        { num: 5, kind: 'punctuation',wrong: '',           correction: '!',        explain: 'An exclamation mark is needed to close the exclamation "There\'s a lizard in here!".' },
        { num: 6, kind: 'spelling',   wrong: 'medecine',   correction: 'medicine', explain: 'Correct spelling is "medicine".' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended', marks: 10,
      passage:
        'Tara’s jaw dropped. The doorway of the mirror maze was shaped like a giant octopus, its long arms curling around the entrance. Inside, rows of mirrors bounced and bent every image. "Amazing!" Tara breathed, and she darted in without waiting for her mother.\n\n' +
        'Tara raced her reflection, laughing when it copied her every move. She pressed her palm against the cool glass. Her reflection only grinned back and seemed to beckon her deeper into the maze. Curious to see where it would take her, Tara followed.\n\n' +
        'All at once, Tara stopped laughing. She spun around, but saw only endless copies of herself, each wearing the same worried frown. Some of the images began to scare her. Her neck had stretched as long as a giraffe’s, her chin looked lopsided, and her fingers wriggled like ten little worms!\n\n' +
        'Fear tightened around her chest. "Mum, where are you?" Tara called out, her voice trembling. She was lost among the mirrors. Nobody answered her.\n\n' +
        'Just then, a familiar arm wrapped around Tara’s shoulders. It was Mum’s! "Don’t worry. I’m right here," she said with a wide smile. Her mother guided Tara back out through the octopus doorway. Tara scurried out gladly. Never again would she set foot in a mirror maze!',
      questions: [
        { type: 'mcq', marks: 1, q: 'When Tara first saw the mirror maze, she was ________________.', choices: ['worried', 'terrified', 'confused', 'surprised'], answer: 'surprised', explain: '"Jaw dropped" + "Amazing!" both signal pleased surprise, not fear.' },
        { type: 'word-meaning', marks: 1, q: 'Which word in paragraph 1 has the same meaning as "caused to be out of shape"?', sentence: 'Inside, rows of mirrors bounced and bent every image.', choices: ['bounced', 'bent'], answer: 'bent', explain: '"Bent" means pushed out of its normal shape — distorted.' },
        { type: 'short', marks: 1, q: 'What does "it" in paragraph 2 line 1 refer to?', model: 'Tara’s reflection (in the mirror).', keywords: ['reflection'] },
        { type: 'short', marks: 3, q: 'Look at paragraph 3. Why did some of the images in the mirrors scare Tara? Give three reasons.', model: '(1) Her neck had stretched as long as a giraffe’s, (2) her chin looked lopsided, and (3) her fingers wriggled like ten little worms.', keywords: ['neck', 'chin', 'fingers', 'worms'] },
        { type: 'short', marks: 1, q: 'Which word in paragraph 4 tells you that Tara could not find her way out?', model: 'lost', keywords: ['lost'] },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Tara’s mother found her.', 'Tara followed her reflection.', 'Tara did not wait for her mother.'], answer: [3, 2, 1] },
        {
          type: 'true-false', marks: 2,
          q: 'Read each statement and decide if it is True or False.',
          statements: [
            { text: 'Tara followed her reflection as she was curious to see where it would take her.', answer: true, explain: 'Paragraph 2 says "Curious to see where it would take her, Tara followed."' },
            { text: 'Tara began to weep when she realised she was lost.', answer: false, explain: 'She called out (shouted) for her mum with a trembling voice, but the passage does not say she wept.' },
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
        { q: 'A group of lions ___ also known as a pride of lions.', choices: ['is', 'are', 'was', 'were'], answer: 'is', skill: 'svAgreement', practiseTarget: 'grammar-mcq', explain: '"A group of..." takes a singular verb when treated as a single unit, and general truths use the present tense.' },
        { q: 'Sanjay hoped to join the holiday camp, ___ he could not get his parents’ consent.', choices: ['as', 'but', 'for', 'although'], answer: 'but', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"But" shows the contrast — he hoped to but could not.' },
        { q: '"I ___ have set off earlier so as not to miss the kick-off," Farhan muttered to himself.', choices: ['would', 'might', 'must', 'should'], answer: 'should', skill: 'modals', practiseTarget: 'grammar-mcq', explain: '"Should have + past participle" expresses regret about a past action.' },
        { q: '"Quiet, please! The coach ___ the team announcement right now," said Mr Tan.', choices: ['made', 'makes', 'has made', 'is making'], answer: 'is making', skill: 'presentCont', practiseTarget: 'grammar-mcq', explain: '"Right now" signals an action happening at the moment — use present continuous.' },
        { q: 'You have tried this dish before, ___ you?', choices: ['did', 'have', 'didn’t', 'haven’t'], answer: 'haven’t', skill: 'tagQuestions', practiseTarget: 'grammar-mcq', explain: 'Tag matches the main auxiliary: "have tried" → "haven\'t you?" (negative tag for positive statement).' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'If you do not need the strap, you can ___ it from the camera bag.', choices: ['detach', 'loosen', 'release', 'disconnect'], answer: 'detach', skill: 'synonymContrast', practiseTarget: 'vocab-mcq', explain: '"Detach" is the precise verb for separating a removable part (like a strap) from a main item.' },
        { q: 'While everyone else was flustered and shouting, Mei stayed ___ and calmly dialled for help.', choices: ['as smooth as silk', 'as cool as a cucumber', 'as cold as ice', 'as tough as leather'], answer: 'as cool as a cucumber', skill: 'similes', practiseTarget: 'vocab-mcq', explain: '"As cool as a cucumber" is the fixed simile for staying calm under pressure.' },
        { q: 'The stranger had been ___ near the bicycle racks for over an hour.', choices: ['ambling', 'loitering', 'idling', 'dawdling'], answer: 'loitering', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: '"Loitering" means hanging around with no clear purpose — fits a suspicious stranger.' },
        { q: 'The plan to build the new clubhouse ___ because the funds could not be raised.', choices: ['fell through', 'fell out', 'fell behind', 'fell over'], answer: 'fell through', skill: 'phrasalVerbs', practiseTarget: 'vocab-mcq', explain: '"Fall through" means (of a plan/deal) to fail to happen.' },
        { q: 'No one could persuade Grandpa to see the doctor as he ___ refuses to admit he is unwell.', choices: ['boldly', 'obstinately', 'deliberately', 'courageously'], answer: 'obstinately', skill: 'mannerAdverbs', practiseTarget: 'vocab-mcq', explain: '"Obstinately" means stubbornly — refuses to change his mind no matter what.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['our', 'they', 'her', 'us', 'their', 'ourselves', 'we'],
      text:
        'Our form teacher Mrs Rahim would be attending a training course for a whole month. The class whooped when {{1}} heard the news. ' +
        'Mrs Rahim was always very firm with {{2}}, so we were thrilled that we could finally let {{3}} hair down. ' +
        'Sure enough, when Miss Devi took over, the classroom turned upside down as we did exactly as we pleased. ' +
        'Nobody listened to {{4}} during lessons and we ignored every class rule. ' +
        'It was only when the principal dropped by and said we ought to be ashamed of {{5}} that we finally behaved. ' +
        'We never saw Miss Devi again once the month was over.',
      answers: ['we', 'us', 'our', 'her', 'ourselves'],
      leftOver: ['they', 'their'],
      skill: 'pronouns', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['filled', 'attack', 'effective', 'weapon', 'important', 'creatures', 'threatened'],
      text:
        'When you think of the bombardier beetle, you may picture a tiny, harmless insect. Have you ever wondered how these little {{1}} defend themselves so well? It is all about chemistry. ' +
        'Bombardier beetles carry a secret {{2}} at the tip of their body: special spray chambers! These chambers hold liquids {{3}} with reactive chemicals. ' +
        'When the liquids mix, they heat up almost to boiling in an instant. ' +
        'When a beetle feels {{4}} by a predator, it takes aim and fires a hot, stinging spray with surprising accuracy. ' +
        'The blast is so startling that it is highly {{5}} in persuading hungry frogs and ants to hunt elsewhere. You certainly would not want to quarrel with this beetle!',
      answers: ['creatures', 'weapon', 'filled', 'threatened', 'effective'],
      leftOver: ['attack', 'important'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Comprehension Cloze (open cloze)', marks: 5,
      instructions: 'Fill in each blank with ONE suitable word. There is no word box — use grammar and meaning clues from the passage.',
      text:
        'Danny had a dreadful fear of moths. Although his parents kept assuring him that moths were {{1}} as they do not sting, bite or chase after people like some insects, Danny would not be persuaded. ' +
        'He would {{2}} his lungs out whenever a moth fluttered near him. ' +
        'Once, he even refused to enter the study room for a whole month after he {{3}} two large moths resting on the curtains. ' +
        'Unfortunately, Danny’s worst nightmare was about to come {{4}}. While he was fast asleep one night, a moth landed on his cheek. He woke with a start. ' +
        'He shrieked when he felt its wings brushing against his face. He leapt out of {{5}} and bolted straight to the bathroom. There, he splashed water on his face and scrubbed his cheeks until they turned red.',
      blanks: [
        { num: 1, answer: 'harmless', accept: ['safe'], hint: 'Opposite of "harmful" — fits "do not sting, bite or chase".', explain: '"Harmless" matches the description that moths do not sting, bite or chase people.' },
        { num: 2, answer: 'scream', accept: ['cry'], hint: 'Verb that fits "___ his lungs out" — a fixed expression.', explain: '"Scream his lungs out" is the standard idiom for shrieking loudly.' },
        { num: 3, answer: 'saw', accept: ['spotted', 'noticed'], hint: 'Past tense — what he did when the moths were on the curtains.', explain: '"Saw" — past tense of "see"; fits the time of the study-room incident.' },
        { num: 4, answer: 'true', accept: [], hint: 'Fixed phrase meaning "to happen as expected/feared".', explain: '"Come true" — fixed phrase for a wish, dream or nightmare that actually happens.' },
        { num: 5, answer: 'bed', accept: [], hint: 'Where he was sleeping just moments before.', explain: '"Leapt out of bed" — he sprang up from where he was lying.' },
      ],
      skill: 'collocationCloze', practiseTarget: 'cloze-castle',
    },
    sectionF: {
      title: 'Section F: Sentence Combining / Synthesis', marks: 4,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['The tap was leaking.', 'Uncle Bala replaced the washer.'], connector: 'since', stemPosition: 'middle', model: 'Uncle Bala replaced the washer since the tap was leaking.', skill: 'connectors', explain: '"Since" can give a reason just like "because" — keep the action first.' },
        { originals: ['This is the master switch.', 'It controls every light in the hall.'], connector: 'which', stemPosition: 'middle', model: 'This is the master switch which controls every light in the hall.', skill: 'relativeClauses', explain: '"Which" introduces a relative clause that adds information about the switch.' },
      ],
    },
    sectionG: {
      title: 'Section G: Editing', marks: 5,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A circle marks a missing or wrong punctuation mark.',
      paragraph:
        'According to old European folktales, {{1:mischeveous}} little beings called gnomes are very fond {{2:about}} guarding buried treasure. ' +
        'Legend also says that these gnomes {{3:hiding}} their chests of jewels beneath the roots of ancient oak trees. ' +
        'Some people believe that if you{{4:o}}re ever quick enough to catch a gnome, you can make him point out where his treasure lies buried. ' +
        'But what are your chances of catching one? That is an even tougher {{5:avanture}} than digging up every oak in the forest! It seems highly {{6:unlikly}} that such treasure chests will ever be found.',
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
      title: 'Section H: Comprehension Open-ended 1 — Sun and Moon', marks: 8,
      passage:
        'Long ago, in a village by a winding river, there lived a girl named Sun. Sun was skilful at everything. She was the quickest, kindest and best-loved person in her village. Sun had a sister whose name was Moon. Moon was envious of Sun, because she was not much good at anything herself. Whenever the villagers asked Moon for help, she turned them away, for she disliked being disturbed. Yet whenever anyone asked Sun for a favour, she agreed cheerfully.\n\n' +
        'One day, the sisters’ mother, Sky, set off on a long journey. She left her daughters in charge of the animals. Sun took good care of the humming bramble-hen, the speckled mips, and the curly-horned dof. Moon could not be bothered with such dull chores. Instead of helping her sister, Moon wandered to the meadow and blew dandelion clocks into the wind.\n\n' +
        'A few days after their mother had left, Sun asked her sister to mind the curly-horned dof while she went to gather berries. Instead of doing as Sun asked, Moon lay down in the grass, closed her eyes, and forgot all about the dof.\n\n' +
        'It so happened that the Queen was riding along her private road nearby. When the curly-horned dof strayed onto the road, the Queen’s horse reared up to avoid it. The Queen was flung from her saddle and landed hard on the ground, hurting her arm.\n\n' +
        'The Queen demanded to know why a curly-horned dof had been allowed onto her road and called on all the villagers for an explanation. Sun was always truthful, so she told the Queen the whole story.\n\n' +
        'The Queen then made a ruling – Sun and Moon were to serve in the palace as her royal attendants as punishment for what came to be known as the worst dof-and-horse accident in the kingdom’s history.',
      questions: [
        { type: 'mcq', marks: 1, q: 'The sisters Sun and Moon were ________________.', choices: ['both well-liked in their village', 'good at everything', 'different from each other', 'envious of each other'], answer: 'different from each other', explain: 'Sun was helpful and loved; Moon was envious and refused to help — clear opposites.' },
        { type: 'short', marks: 2, q: 'When their mother left the sisters in charge of the animals, what did Moon do and why?', model: 'Moon could not be bothered with the dull chores. Instead of helping her sister, she wandered to the meadow and blew dandelion clocks into the wind.', keywords: ['meadow', 'dandelion', 'bothered', 'not help'] },
        { type: 'short', marks: 1, q: 'What does "doing as Sun asked" in paragraph 3 refer to?', model: 'It refers to Sun asking Moon to mind the curly-horned dof while she went to gather berries.', keywords: ['mind', 'dof'] },
        {
          type: 'table', marks: 2,
          q: 'In the table below, write down the person who did each action.',
          rows: [
            { action: 'set off on a long journey', answer: 'Sky (their mother)' },
            { action: 'gave an explanation to the Queen', answer: 'Sun' },
          ],
        },
        {
          type: 'true-false', marks: 2,
          q: 'State whether each statement is True or False and give a reason.',
          statements: [
            { text: 'The Queen was injured by the curly-horned dof.', answer: false, explain: 'The dof did not touch the Queen — her horse reared to avoid it, and she fell from her saddle and hurt her arm.' },
            { text: 'Both sisters were punished by the Queen.', answer: true, explain: 'Both Sun and Moon were sent to serve in the palace as royal attendants as punishment.' },
          ],
        },
      ],
    },
    sectionI: {
      title: 'Section I: Comprehension Open-ended 2 — Nia and the Chrysalis', marks: 8,
      passage:
        'Nia adored butterflies. Every afternoon, she would hurry to the community garden to watch them dance among Grandpa’s lime trees. The striped ones with golden wings were her favourite. Their flashing colours seemed to wave at her. But lately, Nia’s heart felt heavy. The fat green caterpillars she had been watching were disappearing, one by one.\n\n' +
        'One day, she found a caterpillar hanging stiff and still inside a strange green case. Tears welled up in Nia’s eyes. "Grandpa," she sniffled, "is it trapped? Will it sleep forever?"\n\n' +
        'With a gentle smile, Grandpa crouched beside Nia. "Caterpillars do have a special kind of sleep, Nia," he explained. "But it is not like our sleep. They use that time to change into something new."\n\n' +
        'Nia stopped sniffling and began peering at the case with curiosity. "Change?"\n\n' +
        'Grandpa pointed at the little green case swaying on the twig. "That is called a chrysalis. While the caterpillar rests inside, its body slowly turns into a butterfly. Then, one fine morning — flutter! Out it comes with brand-new wings."\n\n' +
        'Nia’s eyes grew round. "So the sleeping isn’t goodbye, but a hello?"\n\n' +
        '"Exactly!" Grandpa chuckled. "The sleepy caterpillars are just getting ready to join the dance above the lime trees."\n\n' +
        'From that day on, Nia did not feel sad when a caterpillar vanished into its case. Instead, she would whisper, "Sweet dreams, little one. I can’t wait to meet you and say hello!"',
      questions: [
        { type: 'short', marks: 1, q: 'Which four-word phrase in paragraph 1 tells you that Nia was feeling sad?', model: 'heart felt heavy', keywords: ['heart felt heavy', 'lately'] },
        { type: 'short', marks: 1, q: 'What does "that time" in paragraph 3 refer to?', model: 'It refers to the time when caterpillars are in their special kind of sleep.', keywords: ['sleep', 'special'] },
        { type: 'word-meaning', marks: 1, q: 'Which word in paragraph 4 has the same meaning as "looking closely"?', sentence: 'Nia stopped sniffling and began peering at the case with curiosity.', choices: ['sniffling', 'peering'], answer: 'peering', explain: '"Peering" means looking carefully at something to see it clearly.' },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Nia no longer felt upset when a caterpillar disappeared.', 'Nia found a caterpillar inside a green case.', 'Nia learnt how caterpillars become butterflies.'], answer: [3, 1, 2] },
        {
          type: 'true-false', marks: 2,
          q: 'Read each statement and decide if it is True or False.',
          statements: [
            { text: 'Nia liked the striped butterflies with golden wings best of all.', answer: true, explain: 'Paragraph 1 says "The striped ones with golden wings were her favourite."' },
            { text: 'The caterpillar inside the chrysalis was trapped forever.', answer: false, explain: 'Inside the chrysalis the caterpillar changes into a butterfly and comes out with new wings.' },
          ],
        },
        { type: 'short', marks: 2, q: 'What two things did Nia want to do when the butterfly came out?', model: 'She wanted to meet it and say hello to it.', keywords: ['meet', 'say hello'] },
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
