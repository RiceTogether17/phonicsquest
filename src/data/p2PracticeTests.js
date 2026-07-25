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
 * All prompts, passages and cloze texts are ORIGINAL content written for
 * PhonicsQuest. Only the paper format and the skills tested follow the
 * school-paper convention — no question or passage is reproduced from any
 * published or school paper.
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
    blurb: 'P2 Term 1 paper — adds Past Continuous, reflexive pronouns and Sentence Combining (because/or/but). Comprehension follows Farid on a delivery errand.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        {
          q: 'I was reading in the living room when I ___________ a loud crash outside.',
          choices: ['hear', 'hears', 'heard', 'was hearing'], answer: 'heard',
          skill: 'simplePast', practiseTarget: 'grammar-mcq',
          explain: 'When a past continuous action ("was reading") is interrupted, the interrupting action uses simple past: "heard".',
        },
        {
          q: 'The joggers took shelter _____________ the flyover when the rain started.',
          choices: ['at', 'on', 'above', 'under'], answer: 'under',
          skill: 'prepositions', practiseTarget: 'grammar-mcq',
          explain: '"Under the flyover" means below it — the flyover shields you from above.',
        },
        {
          q: 'This soup needs ____________ more pepper as it is quite bland.',
          choices: ['any', 'a few', 'many', 'a little'], answer: 'a little',
          skill: 'quantifiers', practiseTarget: 'grammar-mcq',
          explain: 'Pepper is uncountable. We use "a little" for a small amount of uncountable nouns.',
        },
        {
          q: 'We can carry these boxes _____________. We do not need any help.',
          choices: ['himself', 'ourselves', 'yourselves', 'themselves'], answer: 'ourselves',
          skill: 'reflexivePronouns', practiseTarget: 'grammar-mcq',
          explain: '"We" pairs with the reflexive pronoun "ourselves".',
        },
        {
          q: 'Siti and Mei can cycle ________ walk to the market.',
          choices: ['or', 'nor', 'and', 'but'], answer: 'or',
          skill: 'connectors', practiseTarget: 'cloze-castle',
          explain: '"Or" shows a choice between two options (cycle OR walk).',
        },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        {
          q: 'The litterbugs were given a __________ by the town council not to dump rubbish there again.',
          choices: ['sign', 'notice', 'message', 'warning'], answer: 'warning',
          skill: 'contextInference', practiseTarget: 'vocab-mcq',
          explain: '"Warning" is a stern instruction not to do something — fits the town council context.',
        },
        {
          q: '"There is a beetle ____________ up the wall!" cried Ben.',
          choices: ['sliding', 'trotting', 'crawling', 'travelling'], answer: 'crawling',
          skill: 'actionVerbs', practiseTarget: 'vocab-mcq',
          explain: 'Beetles "crawl" — slow, low movement on many small legs.',
        },
        {
          q: 'In storybooks, wolves often ___________ at the full moon.',
          choices: ['bark', 'howl', 'roar', 'growl'], answer: 'howl',
          skill: 'soundVerbs', practiseTarget: 'vocab-mcq',
          explain: 'Wolves "howl" — a long, drawn-out cry, especially at night.',
        },
        {
          q: 'On the long bus ride, we entertained ourselves with a _________ of cards.',
          choices: ['box', 'pile', 'pack', 'heap'], answer: 'pack',
          skill: 'collectiveNouns', practiseTarget: 'vocab-mcq',
          explain: 'A set of playing cards is called a "pack" (or deck) of cards.',
        },
        {
          q: 'Many children feel ____________ before an injection at the clinic. It is not a pleasant experience.',
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
        'Whenever my neighbours come over, we play a treasure-hunt game. There are so many clever places to hide the tokens {{1}} the void deck. ' +
        'In this game, one player hides all the tokens {{2}} the hunters start to search. The hider tucks everything away while the hunters count {{3}} 50 with their eyes shut. ' +
        '{{4}} the counting is done, the hunters spread out to look. ' +
        'I love this game as I am good {{5}} spotting sneaky hiding places. My neighbours groan whenever I find every token first.',
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
        'Badminton is one of the most popular racquet sports in Asia. A doubles match is played between two pairs of {{1}}. Both children and adults can enjoy the {{2}}. ' +
        'Games using shuttlecocks were played in Asia hundreds of years {{3}}. Similar {{4}} were also enjoyed in ancient Greece and India. ' +
        'The modern rules of badminton took shape in England. In 1893, several English clubs {{5}} a badminton association. This association wrote down the first standard set of rules for the game.',
      answers: ['players', 'sport', 'ago', 'games', 'formed'],
      leftOver: ['back', 'built'],
      skill: 'collocationCloze',
      practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Word Order', marks: 4,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['napped', 'so', 'sleepy', 'early', 'was', 'I', 'that', 'I'], answer: 'I was so sleepy that I napped early.', skill: 'connectors' },
        { scrambled: ['reading', 'books', 'prefer', 'pictures', 'do', 'you', 'or', 'drawing'], answer: 'Do you prefer drawing pictures or reading books?', skill: 'whQuestions' },
        { scrambled: ['the', 'coach’s', 'listening', 'no', 'one', 'to', 'instructions', 'was'], answer: 'No one was listening to the coach’s instructions.', skill: 'wordOrder' },
        { scrambled: ['fish', 'and', 'turtles', 'we', 'how', 'often', 'should', 'feed', 'the'], answer: 'How often should we feed the fish and turtles?', skill: 'whQuestions' },
      ],
    },
    sectionF: {
      title: 'Section F: Sentence Combining', marks: 6,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        {
          originals: ['Marcus missed the bus.', 'He woke up late.'],
          connector: 'because',
          stemPosition: 'middle',
          model: 'Marcus missed the bus because he woke up late.',
          skill: 'connectors',
          explain: '"Because" introduces the reason for an action.',
        },
        {
          originals: ['Shall we play chess?', 'Shall we play checkers?'],
          connector: 'or',
          stemPosition: 'middle',
          model: 'Shall we play chess or checkers?',
          skill: 'connectors',
          explain: '"Or" joins two choices in a question.',
        },
        {
          originals: ['Priya is tidy.', 'Her twin is messy.'],
          connector: 'but',
          stemPosition: 'middle',
          model: 'Priya is tidy but her twin is messy.',
          skill: 'connectors',
          explain: '"But" shows contrast between two ideas.',
        },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended', marks: 5,
      passage:
        'Farid’s mother had cooked a big pot of chicken curry. As she was busy, she asked Farid to bring a container of curry, some rice, cucumbers, bananas and a packet of milk to his uncle who lived one block away.\n\n' +
        'Before Farid left the house, his mother reminded him, "Remember not to follow anyone you do not know." Farid nodded and promised to be careful.\n\n' +
        'The carrier bag was bulky, and Farid staggered under its weight. On the way, a woman he did not recognise smiled and asked, "That looks heavy. Shall I carry it for you?" Remembering his promise, Farid shook his head politely and hurried on.\n\n' +
        'To his alarm, the woman kept walking in the same direction. Farid quickened his steps. Each time he glanced back, she was still there, only a few steps behind him.\n\n' +
        'When he reached his uncle’s block, his uncle was waiting at the lift lobby. After greeting Farid, his uncle waved warmly at the woman. Farid learnt that she lived right next door to his uncle, and he let out a long sigh of relief.',
      questions: [
        { type: 'mcq', marks: 1, q: 'Farid brought over ____________ to his uncle’s home.', choices: ['curry, rice, cucumbers, apples and milk', 'rice, curry, cucumbers, bananas and milk', 'curry, noodles, bananas, cucumbers and milk'], answer: 'rice, curry, cucumbers, bananas and milk', explain: 'Paragraph 1 lists curry, rice, cucumbers, bananas and milk — option 2 matches exactly.' },
        { type: 'short', marks: 1, q: 'What did Farid’s mother remind him not to do?', model: 'She reminded him not to follow anyone he did not know.', keywords: ['not', 'follow'] },
        { type: 'short', marks: 1, q: 'Which word in paragraph 3 tells you that Farid found the bag hard to carry?', model: 'staggered', keywords: ['staggered'] },
        { type: 'short', marks: 1, q: 'What did Farid do when the woman kept walking behind him?', model: 'He quickened his steps.', keywords: ['quickened', 'steps'] },
        {
          type: 'sequence', marks: 1,
          q: 'Arrange the events in the correct sequence.',
          options: ['Farid made a promise to his mother.', 'Farid was relieved to see his uncle.', 'The woman offered to carry the bag.'],
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
    blurb: 'P2 Term 2 paper — future tense ("is taking part next month"), reflexive pronouns and movement prepositions. Comprehension is about a mynah pinching Ken’s pencils.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'Priya ________ taking part in a storytelling contest next month.', choices: ['is', 'are', 'was', 'were'], answer: 'is', skill: 'svAgreement', practiseTarget: 'grammar-mcq', explain: '"Priya" is singular and "next month" is future, so use present continuous singular: "is taking part".' },
        { q: 'Sam threw the ball so hard that it sailed _____________ the wall.', choices: ['above', 'over', 'across', 'through'], answer: 'over', skill: 'prepositions', practiseTarget: 'grammar-mcq', explain: '"Over the wall" describes movement from one side of the wall to the other.' },
        { q: 'This tea is far too sweet. I think you have stirred in too __________ sugar.', choices: ['few', 'little', 'much', 'many'], answer: 'much', skill: 'quantifiers', practiseTarget: 'grammar-mcq', explain: 'Sugar is uncountable, so we use "too much" (not "too many").' },
        { q: '"You two have only _____________ to blame for this mess," Father told my brother and me.', choices: ['yourself', 'ourselves', 'yourselves', 'themselves'], answer: 'yourselves', skill: 'reflexivePronouns', practiseTarget: 'grammar-mcq', explain: 'Father is talking to "my brother and me" (you — plural), so we use "yourselves".' },
        { q: 'We put on our jackets ________ it was chilly on the ferry deck.', choices: ['as', 'so', 'but', 'when'], answer: 'as', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"As" gives the reason — meaning "because" the deck was chilly.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'I cannot eat green mangoes as they taste _____________.', choices: ['sour', 'salty', 'sweet', 'bitter'], answer: 'sour', skill: 'definitionMatch', practiseTarget: 'vocab-mcq', explain: 'Unripe mangoes have a "sour" taste — sharp and acidic.' },
        { q: 'Kim leapt back with a yelp when the snake ______________ across the path.', choices: ['slid', 'crept', 'glided', 'slithered'], answer: 'slithered', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: 'Snakes "slither" — a winding side-to-side motion unique to them.' },
        { q: 'A crow perched on our fence and began to ___________ noisily.', choices: ['caw', 'chirp', 'squawk', 'screech'], answer: 'caw', skill: 'soundVerbs', practiseTarget: 'vocab-mcq', explain: 'Crows "caw" — a loud, harsh cry.' },
        { q: 'Grandma keeps a _________ of pearls in her jewellery box.', choices: ['group', 'line', 'string', 'bunch'], answer: 'string', skill: 'collectiveNouns', practiseTarget: 'vocab-mcq', explain: 'Pearls threaded together form a "string of pearls".' },
        { q: 'Stuck indoors with no one to play with or talk to all weekend, I felt ______________.', choices: ['nasty', 'miserable', 'disappointed', 'discouraged'], answer: 'miserable', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Miserable" means very unhappy — fits being alone all weekend.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['in', 'from', 'at', 'along', 'with', 'around', 'onto'],
      text:
        'Leo loves evenings at the fitness corner. He and his friends meet {{1}} the exercise area almost every day. There are so many bars and ropes for them to have fun {{2}}. ' +
        'One of Leo’s favourites is the spinning disc. He and his friends can hop {{3}} it. Then they will whirl {{4}} as fast as they dare. ' +
        'Another favourite is the row of hanging rings. Like a family of little gibbons, they swing {{5}} ring to ring. They always have the best of times together!',
      answers: ['at', 'with', 'onto', 'around', 'from'],
      leftOver: ['in', 'along'],
      skill: 'prepositions', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['used', 'found', 'created', 'made', 'together', 'played', 'built'],
      text:
        'Long ago, most families in Singapore bought their meals from roadside stalls. Children {{1}} nearby while their parents queued along the busy streets. ' +
        'The first purpose-built food centre was {{2}} about a hundred years ago, close to the city. ' +
        'In the 1970s, many more hawker centres were built in the new towns to bring neighbours {{3}}. At first, only simple tables and stools were {{4}} in these centres. ' +
        'Later on, some centres were given a special local look. One design team even {{5}} rooftop gardens above the stalls. Today, hawker centres remain a favourite meeting place in every estate.',
      answers: ['played', 'built', 'together', 'used', 'created'],
      leftOver: ['found', 'made'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Word Order', marks: 4,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['late', 'at', 'night', 'Aman', 'till', 'trained'], answer: 'Aman trained till late at night.', skill: 'wordOrder' },
        { scrambled: ['need', 'arrive', 'what', 'time', 'do', 'we', 'to'], answer: 'What time do we need to arrive?', skill: 'whQuestions' },
        { scrambled: ['prize', 'the', 'in', 'contest', 'won', 'second', 'she'], answer: 'She won second prize in the contest.', skill: 'wordOrder' },
        { scrambled: ['sweep', 'your', 'room', 'how', 'often', 'do', 'you'], answer: 'How often do you sweep your room?', skill: 'whQuestions' },
      ],
    },
    sectionF: {
      title: 'Section F: Sentence Combining', marks: 6,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['Ken saw his results.', 'He jumped for joy.'], connector: 'When', stemPosition: 'start', model: 'When Ken saw his results, he jumped for joy.', skill: 'connectors', explain: '"When" introduces a time clause — fronted clauses take a comma.' },
        { originals: ['Would you rather visit the museum?', 'Would you rather visit the aquarium?'], connector: 'or', stemPosition: 'middle', model: 'Would you rather visit the museum or the aquarium?', skill: 'connectors', explain: '"Or" joins the two choices in one question.' },
        { originals: ['Mrs Wong felt dizzy.', 'Mrs Wong sat down to rest.'], connector: 'because', stemPosition: 'middle', model: 'Mrs Wong sat down to rest because she felt dizzy.', skill: 'connectors', explain: 'Reorder so the action ("sat down to rest") comes first, then "because" introduces the reason.' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended', marks: 5,
      passage:
        'Ken was puzzled. Every time he left his coloured pencils on the balcony table, one or two would go missing. He wondered if he had dropped them somewhere without noticing.\n\n' +
        'Ken suddenly realised that each time his pencils vanished, the balcony grille had been left open. He decided to shut it whenever he was not using the balcony.\n\n' +
        'One afternoon, as Ken stepped towards the balcony, he heard a soft rattling sound. When he peeped through the door, he could hardly believe his eyes! A glossy black mynah was hopping about on the table. It had a bright yellow pencil gripped in its beak.\n\n' +
        'The moment it noticed Ken, the bird flapped away through the open grille. Ken was so startled that he stood rooted to the ground. So it was a cheeky mynah that had been taking his pencils all along!',
      questions: [
        { type: 'mcq', marks: 1, q: 'Ken was puzzled because he did not know __________________.', choices: ['why he kept dropping his pencils', 'where he had left his schoolbag', 'why the pencils on his balcony went missing'], answer: 'why the pencils on his balcony went missing', explain: 'Paragraph 1 says the pencils would "go missing" — that is what puzzled him.' },
        { type: 'short', marks: 1, q: 'Which word in paragraph 2 means the same as "disappeared"?', model: 'vanished', keywords: ['vanished'] },
        { type: 'short', marks: 1, q: 'What did Ken decide to do whenever he was not using the balcony?', model: 'He decided to shut the balcony grille.', keywords: ['shut', 'grille'] },
        { type: 'short', marks: 2, q: 'In paragraph 3, what did Ken see on the balcony and what was it doing?', model: 'He saw a glossy black mynah hopping about on the table, with a bright yellow pencil gripped in its beak.', keywords: ['mynah', 'bird', 'pencil', 'beak'] },
      ],
    },
  },

  T3: {
    id: 'p2-test-term-3',
    term: 'T3', level: 'P2',
    label: 'Term 3 Practice Test 3',
    duration: '45 minutes', totalMarks: 40,
    blurb: 'P2 Term 3 paper — introduces Editing (mixed spelling/punctuation/grammar) and the relative-clause connector "where". Comprehension: Nora and the storeroom gecko.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'The paintbrushes belong to Wei and Lin. They are ___________.', choices: ['they', 'them', 'theirs', 'themselves'], answer: 'theirs', skill: 'possessives', practiseTarget: 'grammar-mcq', explain: '"Theirs" stands alone as a possessive pronoun showing ownership.' },
        { q: 'It is unsafe to dart _____________ the street without checking for cars.', choices: ['along', 'over', 'across', 'through'], answer: 'across', skill: 'prepositions', practiseTarget: 'grammar-mcq', explain: '"Across the street" — moving from one side to the other.' },
        { q: 'My little brother __________ loudly when his balloon burst just now.', choices: ['cry', 'cried', 'cries', 'crying'], answer: 'cried', skill: 'simplePast', practiseTarget: 'grammar-mcq', explain: '"Just now" signals the past — use simple past tense "cried".' },
        { q: 'I told the taxi driver ___________ I wanted to go and he took me straight to the stadium.', choices: ['what', 'when', 'which', 'where'], answer: 'where', skill: 'whQuestions', practiseTarget: 'grammar-mcq', explain: '"Where" reports a place — the stadium is a place.' },
        { q: 'The lights went out __________ the show was just about to begin.', choices: ['so', 'but', 'when', 'because'], answer: 'when', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"When" introduces the time it happened — at the moment the show was about to begin.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'The _____________ scanned every item at the till and told Mr Ali how much he had to pay.', choices: ['chef', 'patient', 'waiter', 'cashier'], answer: 'cashier', skill: 'placeNouns', practiseTarget: 'vocab-mcq', explain: 'A "cashier" handles payments at the till.' },
        { q: 'Wati let out a ______________ and shook her head when she saw the mountain of dishes in the sink.', choices: ['sigh', 'roar', 'hum', 'squeal'], answer: 'sigh', skill: 'soundVerbs', practiseTarget: 'vocab-mcq', explain: 'A "sigh" is a long breath out that shows tiredness or disappointment.' },
        { q: 'The toddler went missing at the funfair as he had ___________ off on his own.', choices: ['marched', 'strolled', 'travelled', 'wandered'], answer: 'wandered', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: '"Wandered" means walking aimlessly — fits a small child getting lost.' },
        { q: 'That salesman seems ____________, so do not believe every word he says.', choices: ['sly', 'honest', 'truthful', 'mischievous'], answer: 'sly', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Sly" means tricky and dishonest — the reason not to trust him.' },
        { q: 'Aunty May knitted me a woolly ______________ to keep my neck warm.', choices: ['coat', 'cape', 'scarf', 'sweater'], answer: 'scarf', skill: 'definitionMatch', practiseTarget: 'vocab-mcq', explain: 'A "scarf" is the clothing piece worn around the neck.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['they', 'our', 'ourselves', 'their', 'them', 'us', 'we'],
      text:
        'My cousins and I planned a trip to the new science centre during the holidays. When {{1}} arrived, the doors had just opened. We found {{2}} favourite exhibits in the discovery hall. ' +
        'There were plenty of hands-on stations for visitors to explore. {{3}} were spread out neatly across the hall. Some of {{4}} had buttons and levers that were great fun to press. ' +
        'We enjoyed {{5}} thoroughly and stayed until closing time. Next holiday, we will surely visit again.',
      answers: ['we', 'our', 'They', 'them', 'ourselves'],
      leftOver: ['their', 'us'],
      skill: 'pronouns', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['know', 'hospital', 'used', 'clinics', 'called', 'understand', 'noises'],
      text:
        'An ambulance is a special van that helps people who are badly hurt or very ill. In an emergency, it races to the patient and rushes them to the {{1}} as quickly as possible. ' +
        'Its bright flashing lights and wailing sirens make loud {{2}}. These help everyone {{3}} that the ambulance is on an urgent trip. ' +
        'Inside, there are many useful tools and machines. They are {{4}} by the trained paramedics to care for the patient on the way. ' +
        'You will find bandages, oxygen tanks and a rolling stretcher bed {{5}} a gurney. An ambulance is truly a little hospital on wheels!',
      answers: ['hospital', 'noises', 'know', 'used', 'called'],
      leftOver: ['clinics', 'understand'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Word Order', marks: 4,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['this', 'afternoon', 'pouring', 'it', 'was', 'very', 'heavily'], answer: 'It was pouring very heavily this afternoon.', skill: 'pastCont' },
        { scrambled: ['safety', 'rules', 'the', 'all', 'must', 'follow', 'passengers'], answer: 'All passengers must follow the safety rules.', skill: 'modals' },
        { scrambled: ['hear', 'the', 'phone', 'so', 'noisy', 'I', 'could', 'not', 'it', 'was', 'that'], answer: 'It was so noisy that I could not hear the phone.', skill: 'connectors' },
        { scrambled: ['do', 'you', 'which', 'books', 'these', 'of', 'reading', 'enjoy'], answer: 'Which of these books do you enjoy reading?', skill: 'whQuestions' },
      ],
    },
    sectionF: {
      title: 'Section F: Sentence Combining', marks: 6,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['Nobody answered the phone.', 'We called the office twice.'], connector: 'but', stemPosition: 'middle', model: 'We called the office twice, but nobody answered the phone.', skill: 'connectors', explain: '"But" shows the unexpected contrast between what was tried and what happened.' },
        { originals: ['Ben switched off the lights.', 'He checked that the windows were shut.'], connector: 'Before', stemPosition: 'start', model: 'Before Ben switched off the lights, he checked that the windows were shut.', skill: 'connectors', explain: '"Before" places the later action in the fronted clause, followed by a comma.' },
        { originals: ['This is the stall.', 'We bought the kites last week.'], connector: 'where', stemPosition: 'middle', model: 'This is the stall where we bought the kites last week.', skill: 'connectors', explain: '"Where" introduces a relative clause describing a place.' },
      ],
    },
    sectionG: {
      title: 'Section G: Editing', marks: 5,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A wrong or missing punctuation mark is indicated by a circle.',
      paragraph:
        'The first time Mina got lost was during a school visit to the museum. Everyone followed the guide’s {{1:instruktions}} and stayed close to Mrs Tan. ' +
        'Mina, however, was the only one who was not {{2:pay}} attention. She {{3:keep}} gazing at the old paintings as she found them fascinating. ' +
        'All at once{{4:o}} Mina realised she was on her own. She could not spot her teacher or her classmates anywhere. She began to feel {{5:worryed}}. ' +
        'Luckily, her teacher soon came looking for her. Mina was relieved to be found so quickly.',
      errors: [
        { num: 1, kind: 'spelling',   wrong: 'instruktions', correction: 'instructions', explain: 'Correct spelling is "instructions".' },
        { num: 2, kind: 'grammar',    wrong: 'pay',          correction: 'paying',       explain: '"was not paying attention" — after "was not", use the -ing form.' },
        { num: 3, kind: 'grammar',    wrong: 'keep',         correction: 'kept',         explain: 'Past narrative — use "kept" (past tense of "keep").' },
        { num: 4, kind: 'punctuation',wrong: '',             correction: ',',            explain: 'A comma is needed after the introductory phrase "All at once".' },
        { num: 5, kind: 'spelling',   wrong: 'worryed',      correction: 'worried',      explain: 'Correct spelling is "worried".' },
      ],
    },
    sectionH: {
      title: 'Section H: Comprehension Open-ended', marks: 5,
      passage:
        'Nora loved poking around the storeroom in her aunt’s old house. It was like a hidden cave, stacked with dusty boxes and forgotten treasures. Suddenly, her breath caught in her throat. On the wall, right beside the light switch, sat a gecko longer than her finger.\n\n' +
        'Its tiny toes twitched, and Nora’s heart hammered like a drum. She wanted to yell for her aunt, but something held her back. She remembered Aunty Rose’s words, "Geckos are like little night guards that gobble up pesky mosquitoes!"\n\n' +
        'Taking a slow breath, Nora leaned in for a closer look. The gecko did not seem so frightening anymore. It was simply waiting patiently for its supper. Perhaps geckos were not so creepy after all. Nora left the storeroom with a newfound respect for the little night guard.',
      questions: [
        { type: 'mcq', marks: 1, q: 'The phrase "her breath caught in her throat" (paragraph 1) tells us that Nora was __________________.', choices: ['excited', 'startled', 'worried'], answer: 'startled', explain: 'Breath catching in the throat is a sign of sudden shock or fright, not excitement or general worry.' },
        { type: 'short', marks: 1, q: 'Which word in paragraph 2 means the same as "moved suddenly in a way that you cannot control"?', model: 'twitched', keywords: ['twitched'] },
        { type: 'short', marks: 1, q: 'What did Nora’s aunt compare geckos to?', model: 'She compared them to little night guards that gobble up pesky mosquitoes.', keywords: ['night guards'] },
        { type: 'short', marks: 1, q: 'In the end, how did Nora feel about geckos?', model: 'She had a newfound respect for them and felt they were not so creepy after all.', keywords: ['respect', 'not so creepy'] },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Nora felt like yelling.', 'Nora watched the gecko wait for its supper.', 'Nora remembered what her aunt had said.'], answer: [1, 3, 2] },
      ],
    },
  },

  T4: {
    id: 'p2-test-term-4',
    term: 'T4', level: 'P2',
    label: 'Term 4 Practice Test 4',
    duration: '50 minutes', totalMarks: 40,
    blurb: 'P2 Term 4 paper — Editing now includes article+verb-form errors. Comprehension: Ryan’s plastic-cockroach prank.',
    sectionA: {
      title: 'Section A: Grammar MCQ', marks: 5,
      items: [
        { q: 'These board games belong to Devi and me. They are ___________.', choices: ['us', 'ours', 'we', 'theirs'], answer: 'ours', skill: 'possessives', practiseTarget: 'grammar-mcq', explain: '"Devi and me" = "us"; the possessive pronoun for "us" is "ours".' },
        { q: 'You may join the club trip only _____________ you have a signed consent form.', choices: ['as', 'while', 'until', 'if'], answer: 'if', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"If" introduces a condition — joining depends on having the form.' },
        { q: 'Moments ago, a strong gust __________ and scattered the papers everywhere.', choices: ['blow', 'blows', 'blew', 'is blowing'], answer: 'blew', skill: 'simplePast', practiseTarget: 'grammar-mcq', explain: '"Moments ago" is a past time marker; the past tense of "blow" is "blew".' },
        { q: '___________ water bottle is this on the bench? Is it yours?', choices: ['Who', 'Whose', 'Which', 'What'], answer: 'Whose', skill: 'whQuestions', practiseTarget: 'grammar-mcq', explain: '"Whose" asks about ownership; "Who" asks about a person.' },
        { q: 'Stir the paint well __________ you brush it onto the wall.', choices: ['before', 'as', 'when', 'after'], answer: 'before', skill: 'connectors', practiseTarget: 'cloze-castle', explain: '"Before" gives the right time order — stirring happens first, then brushing.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ', marks: 5,
      items: [
        { q: 'We paid a small _____________ to rent a stall at the flea market to sell our old toys.', choices: ['salary', 'fee', 'allowance', 'charge'], answer: 'fee', skill: 'definitionMatch', practiseTarget: 'vocab-mcq', explain: 'A "fee" is a small payment for a service or right (here, the right to rent a stall).' },
        { q: 'The commuters were ______________ by the man’s odd behaviour. They could not tell why he was singing and sobbing at the same time.', choices: ['curious', 'amazed', 'puzzled', 'dazed'], answer: 'puzzled', skill: 'emotionAdjectives', practiseTarget: 'vocab-mcq', explain: '"Puzzled" means unable to understand — they could not explain his behaviour.' },
        { q: 'Rahul is as proud as a ___________. He is always boasting that he is the best in class.', choices: ['fox', 'eel', 'lion', 'peacock'], answer: 'peacock', skill: 'similes', practiseTarget: 'vocab-mcq', explain: 'The simile "as proud as a peacock" is a fixed comparison for someone vain.' },
        { q: 'The mirror ____________ when the ladder toppled onto it.', choices: ['exploded', 'shattered', 'burst', 'crashed'], answer: 'shattered', skill: 'actionVerbs', practiseTarget: 'vocab-mcq', explain: '"Shattered" specifically means broke into many small pieces — the right verb for glass.' },
        { q: 'Nothing could rouse Baby Anya as she was sleeping so ______________.', choices: ['soundly', 'drowsily', 'noisily', 'calmly'], answer: 'soundly', skill: 'mannerAdverbs', practiseTarget: 'vocab-mcq', explain: '"Soundly" means deeply — "sleeping soundly" is a fixed collocation.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['beside', 'off', 'around', 'towards', 'across', 'among', 'down'],
      text:
        'Iman was lost. He had taken a wrong exit and wandered {{1}} a lane he did not recognise. Shophouses rose all {{2}} him, and delivery vans rumbled past on the narrow road. ' +
        'He felt a little frightened, but he knew he had to find his own way back. ' +
        'Iman looked {{3}} the junction and spotted a bridge he had crossed earlier that morning. He decided to walk {{4}} it, hoping it would jog his memory. ' +
        'As he went, he noticed a familiar bakery {{5}} the bridge. At last, he was on the right track! Iman was certain he would reach his grandmother’s street in no time.',
      answers: ['down', 'around', 'across', 'towards', 'beside'],
      leftOver: ['off', 'among'],
      skill: 'prepositions', practiseTarget: 'cloze-castle',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze', marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['invented', 'help', 'land', 'surface', 'made', 'explore', 'allow'],
      text:
        'A submarine is a remarkable vessel that travels beneath the sea. It can dive very deep and remain underwater for weeks without rising to the {{1}}. ' +
        'Navies use submarines to {{2}} the deep ocean and to carry out special missions. ' +
        'The earliest working submarine was {{3}} back in 1620 by an inventor named Cornelis Drebbel, and it was built mainly of wood. ' +
        'Modern submarines are far larger and are built from tough steel. They {{4}} researchers study sea life and also guard a country’s waters. ' +
        'Each submarine carries a periscope. Periscopes {{5}} the crew inside to see above the waves without surfacing. What amazing machines they are!',
      answers: ['surface', 'explore', 'invented', 'help', 'allow'],
      leftOver: ['land', 'made'],
      skill: 'collocationCloze', practiseTarget: 'word-vault',
    },
    sectionE: {
      title: 'Section E: Word Order', marks: 4,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['in', 'Africa', 'Kenya', 'Egypt', 'and', 'are', 'countries', 'located'], answer: 'Kenya and Egypt are countries located in Africa.', skill: 'wordOrder' },
        { scrambled: ['the', 'camp', 'we', 'our', 'have', 'to', 'for', 'pack', 'bags'], answer: 'We have to pack our bags for the camp.', skill: 'wordOrder' },
        { scrambled: ['kept', 'off', 'my', 'so', 'windy', 'that', 'it', 'was', 'hat', 'flying'], answer: 'It was so windy that my hat kept flying off.', skill: 'connectors' },
        { scrambled: ['at', 'the', 'food', 'court', 'may', 'we', 'instead', 'of', 'eat', 'cooking'], answer: 'We may eat at the food court instead of cooking.', skill: 'modals' },
      ],
    },
    sectionF: {
      title: 'Section F: Sentence Combining', marks: 6,
      instructions: 'Rewrite the two sentences as ONE sentence using the connector provided.',
      items: [
        { originals: ['Lena kept practising her serve.', 'She finally got it over the net.'], connector: 'until', stemPosition: 'middle', model: 'Lena kept practising her serve until she finally got it over the net.', skill: 'connectors', explain: '"Until" shows that one action continued up to the point another action happened.' },
        { originals: ['You should wash your hands.', 'After that, you can help with the baking.'], connector: 'Before', stemPosition: 'start', model: 'Before you help with the baking, you should wash your hands.', skill: 'connectors', explain: '"Before" rephrases the time order — the fronted clause takes a comma.' },
        { originals: ['The bell rang.', 'The pupils packed up their books.'], connector: 'when', stemPosition: 'middle', model: 'The pupils packed up their books when the bell rang.', skill: 'connectors', explain: '"When" introduces the moment that triggered the action.' },
      ],
    },
    sectionG: {
      title: 'Section G: Editing', marks: 5,
      instructions: 'Each underlined word contains either a spelling or grammatical mistake. A wrong or missing punctuation mark is indicated by a circle.',
      paragraph:
        'Amy did not like her mum’s new perm. It was springy and wild, and she thought it made her mum look {{1:kweer}}. Every time Mum nodded, Amy felt the curls were bouncing right at her! ' +
        '"Mum, can’t you comb it straight{{2:o}}" Amy asked. ' +
        'Her mum laughed. "Why? Don’t you like it?" ' +
        'Amy {{3:shaking}} her head and said, "It looks odd, just like a fluffy bird’s nest!" ' +
        'One morning, Amy woke up to find her mum without {{4:an}} curls that she disliked so much. Amy grinned. "You straightened it!" Her mum smiled and said she did it for her. ' +
        'Amy was pleased. However, she {{5:seekretly}} missed the bouncy curls just a little.',
      errors: [
        { num: 1, kind: 'spelling',   wrong: 'kweer',     correction: 'queer',     explain: 'Correct spelling is "queer" (meaning strange).' },
        { num: 2, kind: 'punctuation',wrong: '',          correction: '?',         explain: 'A question mark is needed at the end of the question "...comb it straight?".' },
        { num: 3, kind: 'grammar',    wrong: 'shaking',   correction: 'shook',     explain: 'Past narrative — use simple past "shook", not the -ing form.' },
        { num: 4, kind: 'grammar',    wrong: 'an',        correction: 'the',       explain: 'We refer to specific curls (the ones she disliked) — use "the", not "an".' },
        { num: 5, kind: 'spelling',   wrong: 'seekretly', correction: 'secretly',  explain: 'Correct spelling is "secretly".' },
      ],
    },
    sectionH: {
      title: 'Section H: Comprehension Open-ended', marks: 5,
      passage:
        'Ryan was always up to something. One afternoon, he decided it would be a great joke to hide a plastic cockroach in his brother Sam’s pencil case. He pictured Sam shrieking and leaping out of his chair.\n\n' +
        'When Sam opened the pencil case and saw the fake cockroach, the yell he let out sounded like an alarm. He flung the pencil case away, and it knocked his glass of milo off the table. The glass smashed into countless pieces, and a sharp shard nicked Sam’s ankle and made it bleed.\n\n' +
        'The boys’ father hurried in to find out what had happened. He was livid. Ryan had to own up to his trick. His father made him mop up the spill and use his own savings to replace the glass. Ryan learnt an important lesson that day – a prank may seem funny, but it can end in real harm.',
      questions: [
        { type: 'mcq', marks: 1, q: 'The phrase "up to something" (paragraph 1) tells us that Ryan was always __________________.', choices: ['coming up with many ideas', 'planning something bad without anyone knowing', 'thinking of ways to surprise someone'], answer: 'planning something bad without anyone knowing', explain: '"Up to something" is an idiom meaning planning mischief — usually secretly.' },
        { type: 'short', marks: 1, q: 'Which three-word phrase in paragraph 2 tells you that Sam’s yell was very loud?', model: 'like an alarm', keywords: ['like an alarm', 'sounded like'] },
        { type: 'short', marks: 1, q: 'What caused the glass to break?', model: 'Sam flung the pencil case away and it knocked his glass of milo off the table.', keywords: ['flung', 'pencil case', 'knocked'] },
        { type: 'short', marks: 1, q: 'How was Ryan punished by his father?', model: 'Ryan had to mop up the spill and use his own savings to replace the glass.', keywords: ['mop', 'savings', 'replace'] },
        { type: 'sequence', marks: 1, q: 'Arrange the events in the correct sequence.', options: ['Sam was hurt.', 'Ryan admitted that he had played a trick.', 'Sam discovered the cockroach in his pencil case.'], answer: [2, 3, 1] },
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
