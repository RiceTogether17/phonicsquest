/**
 * PhonicsQuest – Primary 2 Practice Test Papers
 *
 * Four full school-style P2 English practice papers, one per term, with
 * the same shape as the P1 bank.  P2 differs from P1 in three ways the
 * data must support so practice transfers to the real paper:
 *
 *   1.  Section F is "Sentence Combining" (3 × 2-mark items, with a stem
 *       like "because", "or", "but", "when", "Before", "until", "where").
 *   2.  Editing in T3/T4 covers Spelling, Punctuation AND Grammar (P1
 *       editing only had spelling + punctuation).
 *   3.  Comprehension (Section G in T1/T2, Section H in T3/T4) uses a
 *       3-option tick-the-box MCQ + short answers + a sequencing task.
 *
 * Every MCQ item carries:
 *   - skill         — category key from grammarCategories.js or vocabCategories.js
 *   - practiseTarget — module key the student should open to drill that skill
 *                      ('grammar-mcq' | 'vocab-mcq' | 'cloze-castle' |
 *                       'word-vault' | 'sentence-forge' | 'editing-quest')
 *
 * The renderer uses skill+practiseTarget to show "Practise this skill →"
 * buttons next to each question, so the practice test doubles as a
 * launchpad into the corresponding drill module.
 */

import { checkEditingErrors } from './practiceTestValidators.js';

export const P2_PRACTICE_TEST_TERMS = Object.freeze(['T1', 'T2', 'T3', 'T4']);

export const P2_PRACTICE_TESTS = Object.freeze({
  T1: {
    id: 'p2-test-term-1',
    term: 'T1', level: 'P2',
    label: 'Term 1 Practice Test 1 (Basic)',
    duration: '45 minutes', totalMarks: 35,
    blurb: 'P2 Term 1 paper — adds Past Continuous, reflexive pronouns and Sentence Combining (because/or/but). Comprehension follows Cathy on a grocery errand.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        {
          q: 'I was studying in my bedroom when I ___________ a loud noise.',
          choices: ['hear', 'hears', 'heard', 'was hearing'], answer: 'heard',
          skill: 'simplePast', practiseTarget: 'grammar-mcq',
          explain: 'When a past continuous action ("was studying") is interrupted, the interrupting action uses simple past: "heard".',
        },
        {
          q: 'The cyclist took shelter _____________ the bridge as it was raining.',
          choices: ['at', 'on', 'above', 'under'], answer: 'under',
          skill: 'prepositions', practiseTarget: 'grammar-mcq',
          explain: '"Under the bridge" means below it — the bridge provides shelter from above.',
        },
        {
          q: 'This dish needs ____________ more salt as it is rather tasteless.',
          choices: ['any', 'a few', 'many', 'a little'], answer: 'a little',
          skill: 'quantifiers', practiseTarget: 'grammar-mcq',
          explain: 'Salt is uncountable. We use "a little" for a small amount of uncountable nouns.',
        },
        {
          q: 'We can do this _____________. We do not need your help.',
          choices: ['himself', 'ourselves', 'yourselves', 'themselves'], answer: 'ourselves',
          skill: 'reflexivePronouns', practiseTarget: 'grammar-mcq',
          explain: '"We" pairs with the reflexive pronoun "ourselves".',
        },
        {
          q: 'Mandy and Ken can walk ________ take the bus to school.',
          choices: ['or', 'nor', 'and', 'but'], answer: 'or',
          skill: 'connectors', practiseTarget: 'cloze-castle',
          explain: '"Or" shows a choice between two options (walk OR take the bus).',
        },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        {
          q: 'Our noisy neighbours were given a __________ by the police not to make so much noise.',
          choices: ['sign', 'notice', 'message', 'warning'], answer: 'warning',
          skill: 'contextInference', practiseTarget: 'vocab-mcq',
          explain: '"Warning" is a stern instruction not to do something — fits the police context.',
        },
        {
          q: '"Look at that caterpillar ____________ on the branch!" Joe said.',
          choices: ['sliding', 'trotting', 'crawling', 'travelling'], answer: 'crawling',
          skill: 'actionVerbs', practiseTarget: 'vocab-mcq',
          explain: 'Caterpillars "crawl" — slow, low-to-the-ground movement using many legs.',
        },
        {
          q: 'People believe that wolves like to ___________ at the moon.',
          choices: ['bark', 'howl', 'roar', 'growl'], answer: 'howl',
          skill: 'soundVerbs', practiseTarget: 'vocab-mcq',
          explain: 'Wolves "howl" — a long, drawn-out cry, especially at night.',
        },
        {
          q: 'To while away time, we played with a _________ of cards.',
          choices: ['box', 'pile', 'pack', 'heap'], answer: 'pack',
          skill: 'collectiveNouns', practiseTarget: 'vocab-mcq',
          explain: 'A set of playing cards is called a "pack" (or deck) of cards.',
        },
        {
          q: 'Most children feel ____________ visiting the dentist. It is an unpleasant experience.',
          choices: ['excited', 'nervous', 'annoyed', 'discouraged'], answer: 'nervous',
          skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq',
          explain: '"Nervous" means worried or anxious — the natural feeling before something unpleasant.',
        },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['at', 'in', 'after', 'before', 'from', 'to', 'inside'],
      text:
        'Whenever my cousins come over to my house, we would play a game of hide-and-seek. There are so many wonderful places to hide {{1}} the garden. ' +
        'In hide-and-seek, players run and hide {{2}} the seeker tries to find them. The seeker will have to close his or her eyes and count {{3}} 100. ' +
        '{{4}} the seeker has finished counting, he or she will have to search for the hiders. ' +
        'I love playing this game as I am good {{5}} hiding and finding people. My cousins get especially annoyed with me when I find them easily.',
      answers: ['in', 'before', 'to', 'After', 'at'],
      leftOver: ['from', 'inside'],
      skill: 'prepositions',
      practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['ago', 'formed', 'back', 'sport', 'games', 'players', 'built'],
      text:
        'Soccer is perhaps the most popular team sport in the world. It is played between two teams of eleven {{1}}. Both men and women can play the {{2}}. ' +
        'Soccer was played in China more than 2,000 years {{3}}. Similar {{4}} were also played in ancient Greece, Rome, Japan and Mexico. ' +
        'The modern sport of soccer began in England. In 1863, several English soccer teams {{5}} the Football Association (FA). This association created the first standard set of rules for the game.',
      answers: ['players', 'sport', 'ago', 'games', 'formed'],
      leftOver: ['back', 'built'],
      skill: 'collocationCloze',
      practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Word Order', marks: 4,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['slept', 'so', 'tired', 'early', 'was', 'I', 'that', 'I'], answer: 'I was so tired that I slept early.', skill: 'connectors' },
        { scrambled: ['playing', 'games', 'prefer', 'television', 'do', 'you', 'or', 'watching'], answer: 'Do you prefer playing games or watching television?', skill: 'whQuestions' },
        { scrambled: ['the', 'teacher’s', 'paying', 'no', 'one', 'to', 'instructions', 'attention', 'was'], answer: 'No one was paying attention to the teacher’s instructions.', skill: 'wordOrder' },
        { scrambled: ['plants', 'and', 'trees', 'we', 'how', 'often', 'should', 'water', 'the'], answer: 'How often should we water the plants and trees?', skill: 'whQuestions' },
      ],
    },
    sectionF: {
      title: 'Section F: Sentence Combining', marks: 6,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        {
          originals: ['Gloria slipped and fell.', 'She was not careful.'],
          connector: 'because',
          stemPosition: 'middle',
          model: 'Gloria slipped and fell because she was not careful.',
          skill: 'connectors',
          explain: '"Because" introduces the reason for an action.',
        },
        {
          originals: ['Would you want to go to the beach?', 'Would you want to go to the park?'],
          connector: 'or',
          stemPosition: 'middle',
          model: 'Would you want to go to the beach or the park?',
          skill: 'connectors',
          explain: '"Or" joins two choices in a question.',
        },
        {
          originals: ['Dan is hard-working.', 'His brother is lazy.'],
          connector: 'but',
          stemPosition: 'middle',
          model: 'Dan is hard-working but his brother is lazy.',
          skill: 'connectors',
          explain: '"But" shows contrast between two ideas.',
        },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended', marks: 5,
      passage:
        'Cathy’s mother had gone to the supermarket and bought a large bag of groceries. As she was busy, she asked Cathy to bring the meat, vegetables, fruit, bread and milk over to her grandmother who lived one street away.\n\n' +
        'Before Cathy left the house, her mother instructed her, "Remember not to talk to strangers." Cathy nodded and promised to do so.\n\n' +
        'The bag of groceries was very heavy and Cathy struggled to carry it. Along the way to her grandmother’s house, a man whom she did not know approached her and asked, "Do you need any help?" Remembering her promise to her mother, Cathy shook her head and walked away.\n\n' +
        'To her dismay, the man followed her. Cathy tried to walk as fast as she could. She turned back to look and was horrified to see that he was still walking close behind her.\n\n' +
        'When she reached her grandmother’s house, she was relieved to see her grandmother at the gate. After greeting Cathy, her grandmother also waved at the man. Cathy realised that he was her grandmother’s next-door neighbour and let out an immense sigh of relief.',
      questions: [
        { type: 'mcq', marks: 1, q: 'Cathy brought over ____________ to her grandmother’s house.', choices: ['meat, bread, vegetables, rice and juice', 'bread, milk, fruit, vegetables and meat', 'vegetables, buns, meat, fruit and milk'], answer: 'bread, milk, fruit, vegetables and meat', explain: 'Paragraph 1 lists meat, vegetables, fruit, bread and milk — option 2 matches exactly.' },
        { type: 'short', marks: 1, q: 'What did Cathy’s mother tell her not to do?', model: 'She told her not to talk to strangers.', keywords: ['not', 'strangers', 'talk'] },
        { type: 'short', marks: 1, q: 'Which word in paragraph 3 tells you that Cathy found it hard to carry the bag of groceries?', model: 'struggled', keywords: ['struggled'] },
        { type: 'short', marks: 1, q: 'What did Cathy do when the man followed her?', model: 'She tried to walk as fast as she could.', keywords: ['fast', 'walk'] },
        {
          type: 'sequence', marks: 1,
          q: 'Arrange the events in the correct sequence.',
          options: ['Cathy made a promise to her mother.', 'Cathy was glad to see her grandmother.', 'The man asked if Cathy needed help.'],
          answer: [1, 3, 2],
        },
      ],
    },
  },

  T2: {
    id: 'p2-test-term-2',
    term: 'T2', level: 'P2',
    label: 'Term 2 Practice Test 2',
    duration: '45 minutes', totalMarks: 35,
    blurb: 'P2 Term 2 paper — future tense ("is performing next week"), reflexive pronouns and movement prepositions. Comprehension is about a monkey raiding Tina’s snack stash.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'Alan ________ performing in a concert next week.', choices: ['is', 'are', 'was', 'were'], answer: 'is', skill: 'svAgreement', practiseTarget: 'grammar-mcq', explain: '"Alan" is singular and "next week" is future, so use present continuous singular: "is performing".' },
        { q: 'Joe kicked the ball so hard that it flew _____________ the fence.', choices: ['above', 'over', 'across', 'through'], answer: 'over', skill: 'prepositions', practiseTarget: 'grammar-mcq', explain: '"Over the fence" describes movement from one side of the fence to the other.' },
        { q: 'The noodles are too salty. I think you have added too __________ salt.', choices: ['few', 'little', 'much', 'many'], answer: 'much', skill: 'quantifiers', practiseTarget: 'grammar-mcq', explain: 'Salt is uncountable, so we use "too much" (not "too many").' },
        { q: '"You only have _____________ to blame," Mother scolded my sister and me.', choices: ['yourself', 'ourselves', 'yourselves', 'themselves'], answer: 'yourselves', skill: 'reflexivePronouns', practiseTarget: 'grammar-mcq', explain: 'Mother is talking to "my sister and me" (you — plural), so we use "yourselves".' },
        { q: 'We took off our coats ________ it was warm inside the building.', choices: ['as', 'so', 'but', 'when'], answer: 'as', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"As" gives the reason — meaning "because" the building was warm.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'I don’t like lemons as they taste _____________.', choices: ['sour', 'salty', 'sweet', 'bitter'], answer: 'sour', skill: 'definitionMatch', practiseTarget: 'vocab-mcq', explain: 'Lemons have a "sour" taste — sharp and acidic.' },
        { q: 'Betsy let out a scream when the snake ______________ towards her.', choices: ['slid', 'crept', 'glided', 'slithered'], answer: 'slithered', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: 'Snakes "slither" — a winding side-to-side motion unique to them.' },
        { q: 'The crow flew in and began to ___________ loudly.', choices: ['caw', 'chirp', 'squawk', 'screech'], answer: 'caw', skill: 'soundVerbs', practiseTarget: 'vocab-mcq', explain: 'Crows "caw" — a loud, harsh cry.' },
        { q: 'My aunt Jemima always wears a _________ of pearls round her neck.', choices: ['group', 'line', 'string', 'bunch'], answer: 'string', skill: 'collectiveNouns', practiseTarget: 'vocab-mcq', explain: 'Pearls threaded together form a "string of pearls".' },
        { q: 'As I had no one to play with and talk to all day, I felt ______________.', choices: ['nasty', 'miserable', 'disappointed', 'discouraged'], answer: 'miserable', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Miserable" means very unhappy — fits being alone all day.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['in', 'from', 'at', 'along', 'with', 'around', 'onto'],
      text:
        'Dennis enjoys playing with his friends. They will meet {{1}} the playground almost every day. There are so many interesting rides and equipment for them to have fun {{2}}. ' +
        'One of Dennis’ favourites is the merry-go-round. He and his friends can hop {{3}} it. Then they will spin {{4}} as quickly as they can. ' +
        'Another of Dennis’ favourites are the monkey bars. Like a bunch of chimpanzees, he and his friends would swing {{5}} bar to bar. They certainly know how to have a whale of a time!',
      answers: ['at', 'with', 'onto', 'around', 'from'],
      leftOver: ['in', 'along'],
      skill: 'prepositions', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['used', 'found', 'created', 'made', 'together', 'played', 'built'],
      text:
        'Almost a hundred years ago, children in Singapore played outside. They {{1}} in the streets, fields or on empty land. The first public playground was {{2}} in 1928 and it was located at Dhoby Ghaut. ' +
        'In the 1970s, more public playgrounds were built in housing estates to bring people {{3}}. In the beginning, ready-made playground equipment was {{4}} in these playgrounds. ' +
        'Later on, playgrounds were built with a special Singaporean look. One designer {{5}} the "dragon playgrounds". Sadly, only a few of these playgrounds can now be found in the older estates.',
      answers: ['played', 'built', 'together', 'used', 'created'],
      leftOver: ['found', 'made'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Word Order', marks: 4,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['studied', 'at', 'night', 'Mindy', 'till', 'late'], answer: 'Mindy studied till late at night.', skill: 'wordOrder' },
        { scrambled: ['to', 'leave', 'we', 'have', 'do', 'what', 'time'], answer: 'What time do we have to leave?', skill: 'whQuestions' },
        { scrambled: ['the', 'competition', 'in', 'I', 'won', 'prize', 'first'], answer: 'I won first prize in the competition.', skill: 'wordOrder' },
        { scrambled: ['you', 'how', 'often', 'do', 'your', 'bedroom', 'tidy'], answer: 'How often do you tidy your bedroom?', skill: 'whQuestions' },
      ],
    },
    sectionF: {
      title: 'Section F: Sentence Combining', marks: 6,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['Jill heard the good news.', 'She was overjoyed.'], connector: 'When', stemPosition: 'start', model: 'When Jill heard the good news, she was overjoyed.', skill: 'connectors', explain: '"When" introduces a time clause — fronted clauses take a comma.' },
        { originals: ['Would you like to eat Japanese food?', 'Would you like to eat Korean food?'], connector: 'or', stemPosition: 'middle', model: 'Would you like to eat Japanese or Korean food?', skill: 'connectors', explain: '"Or" joins the two food choices in one question.' },
        { originals: ['Mr Sim had a headache.', 'Mr Sim took a pill.'], connector: 'because', stemPosition: 'middle', model: 'Mr Sim took a pill because he had a headache.', skill: 'connectors', explain: 'Reorder so the action ("took a pill") comes first, then "because" introduces the reason.' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended', marks: 5,
      passage:
        'Tina was confused. Every time she brought snacks into her bedroom, some of them would go missing. She wondered if she had been forgetful and placed them somewhere else instead.\n\n' +
        'Tina suddenly remembered that each time her snacks vanished, her windows were wide open. She decided to close them when she was not using her bedroom.\n\n' +
        'One day, as Tina was about to enter her room, she heard odd noises. When she opened the door, she could not believe her eyes! A long-tailed macaque was there in her room. It was holding a pack of chips in its hands.\n\n' +
        'When it saw Tina, it quickly escaped through the opened windows. Tina was so shocked that she could not move and chase after it. So it was a naughty monkey that had been stealing her snacks!',
      questions: [
        { type: 'mcq', marks: 1, q: 'Tina was confused because she did not know __________________.', choices: ['why she was so forgetful', 'where she had placed her things', 'why the snacks in her bedroom went missing'], answer: 'why the snacks in her bedroom went missing', explain: 'Paragraph 1 says snacks would "go missing" — that is what puzzled her.' },
        { type: 'short', marks: 1, q: 'Which word in paragraph 2 means the same as "disappeared"?', model: 'vanished', keywords: ['vanished'] },
        { type: 'short', marks: 1, q: 'What did Tina decide to do whenever she was not using her bedroom?', model: 'She decided to close her bedroom windows.', keywords: ['close', 'windows'] },
        { type: 'short', marks: 2, q: 'In paragraph 3, what did Tina see in her room and what was it doing?', model: 'She saw a long-tailed macaque (a monkey) in her room, and it was holding a pack of chips in its hands.', keywords: ['macaque', 'monkey', 'chips', 'holding'] },
      ],
    },
  },

  T3: {
    id: 'p2-test-term-3',
    term: 'T3', level: 'P2',
    label: 'Term 3 Practice Test 3',
    duration: '45 minutes', totalMarks: 40,
    blurb: 'P2 Term 3 paper — introduces Editing (mixed spelling/punctuation/grammar) and the relative-clause connector "where". Comprehension: Dan and the basement spider.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'The crayons belong to Cora and Corrie. They are ___________.', choices: ['they', 'them', 'theirs', 'themselves'], answer: 'theirs', skill: 'possessives', practiseTarget: 'grammar-mcq', explain: '"Theirs" stands alone as a possessive pronoun showing ownership.' },
        { q: 'It is dangerous to dash _____________ the road without watching out for traffic.', choices: ['along', 'over', 'across', 'through'], answer: 'across', skill: 'prepositions', practiseTarget: 'grammar-mcq', explain: '"Across the road" — moving from one side to the other.' },
        { q: 'My mother __________ a lot while watching a sad movie just now.', choices: ['cry', 'cried', 'cries', 'crying'], answer: 'cried', skill: 'simplePast', practiseTarget: 'grammar-mcq', explain: '"Just now" signals the past — use simple past tense "cried".' },
        { q: 'I told the driver ___________ I would like to go and he drove me to the school.', choices: ['what', 'when', 'which', 'where'], answer: 'where', skill: 'whQuestions', practiseTarget: 'grammar-mcq', explain: '"Where" asks about (or reports) a place — the school is a place.' },
        { q: 'The fire broke out __________ the store was just about to open.', choices: ['so', 'but', 'when', 'because'], answer: 'when', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"When" introduces the time the fire happened — at the moment the store was about to open.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'The _____________ added up the total cost of all the items and showed the customer how much he had to pay.', choices: ['chef', 'patient', 'waiter', 'cashier'], answer: 'cashier', skill: 'placeNouns', practiseTarget: 'vocab-mcq', explain: 'A "cashier" handles payments at the till.' },
        { q: 'Gabriel let out a ______________ and shook his head when he saw the huge pile of homework he had to do.', choices: ['sigh', 'roar', 'hum', 'squeal'], answer: 'sigh', skill: 'soundVerbs', practiseTarget: 'vocab-mcq', explain: 'A "sigh" is a long breath out that shows tiredness or disappointment.' },
        { q: 'Little Sophie went missing as she had ___________ off on her own.', choices: ['marched', 'strolled', 'travelled', 'wandered'], answer: 'wandered', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: '"Wandered" means walking aimlessly — fits a small child getting lost.' },
        { q: 'He seems to be ____________, so do not believe every word he says.', choices: ['sly', 'honest', 'truthful', 'mischievous'], answer: 'sly', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Sly" means tricky and dishonest — the reason not to trust him.' },
        { q: 'I wrapped a ______________ around my neck as I was feeling cold.', choices: ['coat', 'cape', 'scarf', 'sweater'], answer: 'scarf', skill: 'definitionMatch', practiseTarget: 'vocab-mcq', explain: 'A "scarf" is the clothing piece worn around the neck.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['they', 'our', 'ourselves', 'their', 'them', 'us', 'we'],
      text:
        'My friends and I made plans to go to the library nearby to borrow books. When {{1}} reached the library, it was just after opening time. We found {{2}} favourite books in the children’s section. ' +
        'There were so many chairs for us to sit on. {{3}} were all conveniently placed around the library. Some of {{4}} were armchairs that were very comfortable. ' +
        'We enjoyed {{5}} there and got the books we wanted. Next week, we will be visiting the library again.',
      answers: ['we', 'our', 'They', 'them', 'ourselves'],
      leftOver: ['their', 'us'],
      skill: 'pronouns', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['know', 'hospital', 'used', 'clinics', 'called', 'understand', 'noises'],
      text:
        'An ambulance carries very sick or injured people. During an emergency, it will go to people and take them to {{1}} at top speed. ' +
        'It is like a fast-moving van with lots of lights and sirens that make loud {{2}}. This is to let everyone {{3}} it is coming to help. ' +
        'Inside the ambulance, there are many tools and equipment. They are {{4}} by the paramedics to help you feel better. ' +
        'There are bandages, oxygen cylinders and even a special bed on wheels {{5}} a gurney. An ambulance is just like a mini hospital on wheels!',
      answers: ['hospital', 'noises', 'know', 'used', 'called'],
      leftOver: ['clinics', 'understand'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Word Order', marks: 4,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['very', 'heavily', 'this', 'morning', 'it', 'raining', 'was'], answer: 'It was raining very heavily this morning.', skill: 'pastCont' },
        { scrambled: ['obey', 'school', 'rules', 'the', 'should', 'all', 'students'], answer: 'All students should obey the school rules.', skill: 'modals' },
        { scrambled: ['so', 'cold', 'I', 'stop', 'shivering', 'could', 'not', 'it', 'was', 'that'], answer: 'It was so cold that I could not stop shivering.', skill: 'connectors' },
        { scrambled: ['do', 'you', 'which', 'these', 'activities', 'of', 'doing', 'enjoy'], answer: 'Which of these activities do you enjoy doing?', skill: 'whQuestions' },
      ],
    },
    sectionF: {
      title: 'Section F: Sentence Combining', marks: 6,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['No one came to open the door.', 'We rang the doorbell.'], connector: 'but', stemPosition: 'middle', model: 'We rang the doorbell, but no one came to open the door.', skill: 'connectors', explain: '"But" shows the unexpected contrast between what was tried and what happened.' },
        { originals: ['Jill left the room.', 'She asked the teacher for permission.'], connector: 'Before', stemPosition: 'start', model: 'Before Jill left the room, she asked the teacher for permission.', skill: 'connectors', explain: '"Before" places the earlier action first; the fronted clause is followed by a comma.' },
        { originals: ['This is the place.', 'I lost my wallet yesterday.'], connector: 'where', stemPosition: 'middle', model: 'This is the place where I lost my wallet yesterday.', skill: 'connectors', explain: '"Where" introduces a relative clause describing a place.' },
      ],
    },
    sectionG: {
      title: 'Section G: Editing', marks: 5,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A wrong or missing punctuation mark is indicated by a circle.',
      paragraph:
        'The first time Ben got lost was when he was at the zoo. Everyone followed the teacher’s {{1:instruksions}} and stayed close to Mr Lee. ' +
        'Ben, however, was the only one who was not {{2:pay}} attention. He {{3:keep}} staring at the animals as he was very much attracted to them. ' +
        'All of a sudden{{4:o}} Ben realised he was all alone. He could not find his teacher or classmates. He started feeling {{5:woryied}}. ' +
        'Luckily, his teacher came to look for him. Ben was relieved as he was no longer lost.',
      errors: [
        { num: 1, kind: 'spelling',   wrong: 'instruksions', correction: 'instructions', explain: 'Correct spelling is "instructions".' },
        { num: 2, kind: 'grammar',    wrong: 'pay',          correction: 'paying',       explain: '"was not paying attention" — after "was not", use the -ing form.' },
        { num: 3, kind: 'grammar',    wrong: 'keep',         correction: 'kept',         explain: 'Past narrative — use "kept" (past tense of "keep").' },
        { num: 4, kind: 'punctuation',wrong: '',             correction: ',',            explain: 'A comma is needed after the introductory phrase "All of a sudden".' },
        { num: 5, kind: 'spelling',   wrong: 'woryied',      correction: 'worried',      explain: 'Correct spelling is "worried".' },
      ],
    },
    sectionH: {
      title: 'Section H: Comprehension Open-ended', marks: 5,
      passage:
        'Dan loved exploring the basement in his grandparents’ house. It was like a secret world, filled with dusty and forgotten toys. Suddenly, a shiver ran down his spine. He spotted a spider that was bigger than his thumb. It hung upside down in a web.\n\n' +
        'Eight hairy legs twitched, and Dan’s heart thumped like a drum. He wanted to scream for his grandparents, but something stopped him. He remembered Grandpa’s words, "Spiders are like tiny housekeepers that eat pesky flies!"\n\n' +
        'Taking a deep breath, Dan moved closer. The spider did not seem so scary anymore. It was just busy working and mending its web. Perhaps spiders weren’t so bad after all. Dan left the basement with a newfound respect for the little housekeeper.',
      questions: [
        { type: 'mcq', marks: 1, q: 'The phrase "a shiver ran down his spine" (paragraph 1) tells us that Dan was __________________.', choices: ['excited', 'fearful', 'worried'], answer: 'fearful', explain: 'A shiver down the spine is a classic sign of sudden fear, not excitement or general worry.' },
        { type: 'short', marks: 1, q: 'Which word in paragraph 2 means the same as "moved suddenly in a way that you cannot control"?', model: 'twitched', keywords: ['twitched'] },
        { type: 'short', marks: 1, q: 'What did Dan’s grandfather compare spiders to?', model: 'He compared them to tiny housekeepers that eat pesky flies.', keywords: ['housekeepers'] },
        { type: 'short', marks: 1, q: 'In the end, how did Dan feel about spiders?', model: 'He had a newfound respect for them and felt they were not so bad after all.', keywords: ['respect', 'not so bad'] },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Dan felt like screaming.', 'Dan watched the spider mend its web.', 'Dan remembered what his grandfather had told him.'], answer: [1, 3, 2] },
      ],
    },
  },

  T4: {
    id: 'p2-test-term-4',
    term: 'T4', level: 'P2',
    label: 'Term 4 Practice Test 4',
    duration: '50 minutes', totalMarks: 40,
    blurb: 'P2 Term 4 paper — Editing now includes article+verb-form errors. Comprehension: Olivia’s rubber-snake prank.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'These comic books belong to Marion and me. They are ___________.', choices: ['us', 'ours', 'we', 'theirs'], answer: 'ours', skill: 'possessives', practiseTarget: 'grammar-mcq', explain: '"Marion and me" = "us"; the possessive pronoun for "us" is "ours".' },
        { q: 'You can enter only _____________ you have an entry pass.', choices: ['as', 'while', 'until', 'if'], answer: 'if', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"If" introduces a condition — entry depends on having a pass.' },
        { q: 'Just a moment ago, the wind __________ and toppled the tree.', choices: ['blow', 'blows', 'blew', 'is blowing'], answer: 'blew', skill: 'simplePast', practiseTarget: 'grammar-mcq', explain: '"Just a moment ago" is a past time marker; the past tense of "blow" is "blew".' },
        { q: '___________ bag is that over there? Is it yours?', choices: ['Who', 'Whose', 'Which', 'What'], answer: 'Whose', skill: 'whQuestions', practiseTarget: 'grammar-mcq', explain: '"Whose" asks about ownership; "Who" asks about a person.' },
        { q: 'Shake the bottle well __________ you pour out the sauce.', choices: ['before', 'as', 'when', 'after'], answer: 'before', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"Before" gives the right time order — shaking happens first, then pouring.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'We paid a small _____________ to set up a booth at the fair to sell our cupcakes.', choices: ['salary', 'fee', 'allowance', 'charge'], answer: 'fee', skill: 'definitionMatch', practiseTarget: 'vocab-mcq', explain: 'A "fee" is a small payment for a service or right (here, the right to set up a booth).' },
        { q: 'Everyone was ______________ by the passenger’s strange behaviour. They did not know why she was crying and laughing to herself.', choices: ['curious', 'amazed', 'puzzled', 'dazed'], answer: 'puzzled', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Puzzled" means unable to understand — they did not know why she was behaving strangely.' },
        { q: 'Dennis is as proud as a ___________. He always thinks he is better than other people.', choices: ['fox', 'eel', 'lion', 'peacock'], answer: 'peacock', skill: 'similes', practiseTarget: 'vocab-mcq', explain: 'The simile "as proud as a peacock" is a fixed comparison for someone vain.' },
        { q: 'The vase ____________ when it hit the floor.', choices: ['exploded', 'shattered', 'burst', 'crashed'], answer: 'shattered', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: '"Shattered" specifically means broke into many small pieces — the right verb for glass.' },
        { q: 'It was so difficult to wake Ian as he was sleeping so ______________.', choices: ['soundly', 'drowsily', 'noisily', 'calmly'], answer: 'soundly', skill: 'mannerAdverbs', practiseTarget: 'vocab-mcq', explain: '"Soundly" means deeply — "sleeping soundly" is a fixed collocation.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['beside', 'off', 'around', 'towards', 'across', 'among', 'down'],
      text:
        'Emily was lost. She had taken a wrong turn and wandered {{1}} a street she did not recognise. Tall buildings stood all {{2}} her, and cars rushed by on the busy road. ' +
        'She felt a bit scared, but knew she simply had to find her way home. ' +
        'Emily looked {{3}} the street and saw a park she had passed earlier that day. She decided to head {{4}} it, thinking it might help her remember the way. ' +
        'As she walked, she spotted a familiar shop {{5}} the park. At last, she was getting closer! Emily was sure she would be back in her own neighbourhood in no time.',
      answers: ['down', 'around', 'across', 'towards', 'beside'],
      leftOver: ['off', 'among'],
      skill: 'prepositions', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['invented', 'help', 'land', 'surface', 'made', 'explore', 'allow'],
      text:
        'A submarine is a special kind of boat that can travel under the water. It can go very deep and stay underwater for a long time without needing to come up to the {{1}}. ' +
        'Submarines are used by the navy to {{2}} the ocean and for important missions. ' +
        'The first real submarine was {{3}} a long time ago, in 1620, by a man named Cornelis Drebbel. His submarine was small and made of wood. ' +
        'Today, submarines are much bigger and are made of strong metal. They {{4}} scientists study the ocean and also protect countries. ' +
        'Submarines have periscopes, which {{5}} the people inside it to see above the water without coming up. They are amazing machines that can go far beneath the sea!',
      answers: ['surface', 'explore', 'invented', 'help', 'allow'],
      leftOver: ['land', 'made'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Word Order', marks: 4,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['in', 'Asia', 'Thailand', 'India', 'and', 'are', 'countries', 'located'], answer: 'Thailand and India are countries located in Asia.', skill: 'wordOrder' },
        { scrambled: ['the', 'trip', 'we', 'early', 'have', 'to', 'for', 'wake', 'up'], answer: 'We have to wake up early for the trip.', skill: 'wordOrder' },
        { scrambled: ['kept', 'on', 'I', 'so', 'hot', 'that', 'it', 'was', 'perspiring'], answer: 'It was so hot that I kept on perspiring.', skill: 'connectors' },
        { scrambled: ['at', 'home', 'outside', 'may', 'we', 'instead', 'of', 'have', 'dinner'], answer: 'We may have dinner outside instead of at home.', skill: 'modals' },
      ],
    },
    sectionF: {
      title: 'Section F: Sentence Combining', marks: 6,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['I kept begging my parents to let me go to the party.', 'My parents finally gave in.'], connector: 'until', stemPosition: 'middle', model: 'I kept begging my parents to let me go to the party until they finally gave in.', skill: 'connectors', explain: '"Until" shows that one action continued up to the point another action happened.' },
        { originals: ['You should watch out for traffic.', 'After that, you can cross the road.'], connector: 'Before', stemPosition: 'start', model: 'Before you cross the road, you should watch out for traffic.', skill: 'connectors', explain: '"Before" rephrases the time order — fronted clause takes a comma.' },
        { originals: ['It began to rain.', 'People rushed to find shelter.'], connector: 'when', stemPosition: 'middle', model: 'People rushed to find shelter when it began to rain.', skill: 'connectors', explain: '"When" introduces the moment that triggered the action.' },
      ],
    },
    sectionG: {
      title: 'Section G: Editing', marks: 5,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A wrong or missing punctuation mark is indicated by a circle.',
      paragraph:
        'Joe did not like his dad’s new moustache. It was thick and curly, and he thought it made his dad look {{1:kweer}}. Every time Dad smiled, Joe felt like the moustache was laughing too! ' +
        '"Dad, can’t you shave it off{{2:o}}" Joe asked. ' +
        'His dad chuckled. "Why? Don’t you like it?" ' +
        'Joe {{3:shaking}} his head and said, "It looks weird, just like a hairy caterpillar!" ' +
        'One morning, Joe woke up to find his dad without {{4:an}} moustache that he disliked so much. Joe grinned. "You shaved it!" His dad smiled and said he did it for him. ' +
        'Joe was glad. However, he {{5:seekretly}} missed the silly moustache just a little.',
      errors: [
        { num: 1, kind: 'spelling',   wrong: 'kweer',     correction: 'queer',     explain: 'Correct spelling is "queer" (meaning strange).' },
        { num: 2, kind: 'punctuation',wrong: '',          correction: '?',         explain: 'A question mark is needed at the end of the question "...shave it off?".' },
        { num: 3, kind: 'grammar',    wrong: 'shaking',   correction: 'shook',     explain: 'Past narrative — use simple past "shook", not the -ing form.' },
        { num: 4, kind: 'grammar',    wrong: 'an',        correction: 'the',       explain: 'We refer to a specific moustache (the one he disliked) — use "the", not "an".' },
        { num: 5, kind: 'spelling',   wrong: 'seekretly', correction: 'secretly',  explain: 'Correct spelling is "secretly".' },
      ],
    },
    sectionH: {
      title: 'Section H: Comprehension Open-ended', marks: 5,
      passage:
        'Olivia was always up to something. One day, she thought it would be great fun to put a rubber snake in her sister, Emily’s, backpack. She imagined Emily screaming and jumping when she saw it.\n\n' +
        'When Emily opened her backpack and saw the fake snake, the scream she let out sounded like a siren. She threw her backpack and it accidentally knocked over a vase. The vase broke into a million pieces and one of the glass pieces cut Emily and made her bleed.\n\n' +
        'Emily’s and Olivia’s mother rushed in to see what was happening. She was furious. Olivia was forced to confess to the prank. Her mother ordered her to clean up the mess and pay for the broken vase. Olivia learnt a valuable lesson that day – although pranks can be fun, they can also have serious consequences.',
      questions: [
        { type: 'mcq', marks: 1, q: 'The phrase "up to something" (paragraph 1) tells us that Olivia was always __________________.', choices: ['coming up with many ideas', 'planning something bad without anyone knowing', 'thinking of something to surprise someone'], answer: 'planning something bad without anyone knowing', explain: '"Up to something" is an idiom meaning planning mischief — usually secretly.' },
        { type: 'short', marks: 1, q: 'Which three-word phrase in paragraph 2 tells you that Emily’s scream was very loud?', model: 'sounded like a siren', keywords: ['like a siren', 'sounded like'] },
        { type: 'short', marks: 1, q: 'What caused the vase to break?', model: 'Emily threw her backpack and it accidentally knocked over a vase.', keywords: ['threw', 'backpack', 'knocked'] },
        { type: 'short', marks: 1, q: 'How was Olivia punished by her mother?', model: 'Olivia had to clean up the mess and pay for the broken vase.', keywords: ['clean up', 'pay'] },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Emily was hurt.', 'Olivia admitted that she had played a prank.', 'Emily discovered the snake in her backpack.'], answer: [2, 3, 1] },
      ],
    },
  },
});

/** Flat list helpers (mirror the P1 bank API). */
export function getP2PracticeTests() {
  return P2_PRACTICE_TEST_TERMS.map(term => P2_PRACTICE_TESTS[term]);
}

export function getP2PracticeTest(term) {
  return P2_PRACTICE_TESTS[term] || null;
}

/**
 * Validate the P2 practice test bank.
 */
export function validateP2PracticeTests(bank = P2_PRACTICE_TESTS) {
  const issues = [];
  const blankRe = /\{\{(\d+)\}\}/g;
  const editingBlankRe = /\{\{(\d+):[^}]*\}\}/g;
  const allowedTargets = new Set(['grammar-mcq', 'vocab-mcq', 'cloze-castle', 'word-vault', 'sentence-forge', 'editing-quest']);

  for (const term of P2_PRACTICE_TEST_TERMS) {
    const test = bank?.[term];
    const tag = `P2/${term}`;
    if (!test) { issues.push(`${tag}: missing`); continue; }
    if (test.level !== 'P2') issues.push(`${tag}: level must be P2`);

    for (const key of ['sectionA', 'sectionB']) {
      const section = test[key];
      if (!section || !Array.isArray(section.items) || section.items.length !== 5) {
        issues.push(`${tag}/${key}: must have 5 items`);
        continue;
      }
      for (const item of section.items) {
        if (!item.q || !Array.isArray(item.choices) || item.choices.length !== 4) {
          issues.push(`${tag}/${key}: malformed item (need q + 4 choices)`);
        }
        if (!item.choices?.includes(item.answer)) {
          issues.push(`${tag}/${key}: answer "${item.answer}" not among choices`);
        }
        if (new Set(item.choices).size !== item.choices.length) {
          issues.push(`${tag}/${key}: duplicate choices`);
        }
        if (item.practiseTarget && !allowedTargets.has(item.practiseTarget)) {
          issues.push(`${tag}/${key}: unknown practiseTarget "${item.practiseTarget}"`);
        }
      }
    }

    for (const key of ['sectionC', 'sectionD']) {
      const section = test[key];
      if (!section) { issues.push(`${tag}/${key}: missing`); continue; }
      const blanks = [...(section.text || '').matchAll(blankRe)].map(m => Number(m[1]));
      if (blanks.length !== 5) issues.push(`${tag}/${key}: expected 5 blanks, found ${blanks.length}`);
      if (!Array.isArray(section.answers) || section.answers.length !== 5) {
        issues.push(`${tag}/${key}: expected 5 answers`);
      }
      const reuseAllowed = Boolean(section.reuseAllowed);
      const minBank = reuseAllowed ? 2 : 5;
      if (!Array.isArray(section.wordBank) || section.wordBank.length < minBank) {
        issues.push(`${tag}/${key}: word bank must have at least ${minBank} words`);
      }
      const bankLower = (section.wordBank || []).map(w => w.toLowerCase());
      for (const a of section.answers || []) {
        if (!bankLower.includes(String(a).toLowerCase())) {
          issues.push(`${tag}/${key}: answer "${a}" missing from word bank`);
        }
      }
    }

    const sE = test.sectionE;
    if (!sE || !Array.isArray(sE.items) || sE.items.length !== 4) {
      issues.push(`${tag}/sectionE: must have 4 word-order items`);
    } else {
      for (const item of sE.items) {
        if (!Array.isArray(item.scrambled) || item.scrambled.length < 4) {
          issues.push(`${tag}/sectionE: scrambled words missing`);
        }
        if (typeof item.answer !== 'string' || !item.answer.trim()) {
          issues.push(`${tag}/sectionE: missing answer sentence`);
        }
        const stripPunct = (s) => String(s).replace(/[‘’“”".,?!]/g, '').toLowerCase().trim();
        const scrambledNorm = (item.scrambled || []).map(stripPunct).sort().join(' ');
        const answerNorm = stripPunct(item.answer).split(/\s+/).sort().join(' ');
        if (scrambledNorm !== answerNorm) {
          issues.push(`${tag}/sectionE: scrambled words do not form "${item.answer}"`);
        }
      }
    }

    const sF = test.sectionF;
    if (!sF || !Array.isArray(sF.items) || sF.items.length !== 3) {
      issues.push(`${tag}/sectionF: must have 3 sentence-combining items`);
    } else {
      for (const item of sF.items) {
        if (!Array.isArray(item.originals) || item.originals.length !== 2) issues.push(`${tag}/sectionF: each item needs 2 originals`);
        if (typeof item.model !== 'string' || !item.model.trim()) issues.push(`${tag}/sectionF: missing model answer`);
        if (typeof item.connector !== 'string' || !item.connector.trim()) issues.push(`${tag}/sectionF: missing connector`);
      }
    }

    if (term === 'T3' || term === 'T4') {
      const sG = test.sectionG;
      if (!sG || typeof sG.paragraph !== 'string') issues.push(`${tag}/sectionG: missing editing paragraph`);
      else {
        const blanks = [...sG.paragraph.matchAll(editingBlankRe)].map(m => Number(m[1]));
        if (blanks.length !== 5) issues.push(`${tag}/sectionG: expected 5 editing blanks, found ${blanks.length}`);
        if (!Array.isArray(sG.errors) || sG.errors.length !== 5) issues.push(`${tag}/sectionG: expected 5 errors`);
        checkEditingErrors(issues, `${tag}/sectionG`, sG);
      }
    }

    const compKey = (term === 'T3' || term === 'T4') ? 'sectionH' : 'sectionG';
    const comp = test[compKey];
    if (!comp || typeof comp.passage !== 'string' || !comp.passage.trim()) issues.push(`${tag}/${compKey}: missing passage`);
    if (!Array.isArray(comp?.questions) || comp.questions.length < 4) issues.push(`${tag}/${compKey}: needs at least 4 questions`);

    const sectionKeys = (term === 'T3' || term === 'T4')
      ? ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF', 'sectionG', 'sectionH']
      : ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF', 'sectionG'];
    const sectionMarksTotal = sectionKeys.map(k => test[k]?.marks || 0).reduce((a, b) => a + b, 0);
    if (sectionMarksTotal !== test.totalMarks) {
      issues.push(`${tag}: section marks sum to ${sectionMarksTotal} but totalMarks=${test.totalMarks}`);
    }
  }

  return issues;
}
