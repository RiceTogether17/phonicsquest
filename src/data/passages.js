/**
 * PhonicsQuest – Cloze Castle Quest Data (Grammar Cloze)
 *
 * Singapore Primary 1–6 grammar cloze passages organised by level → category.
 * Each category tests a specific grammar concept with 3 passages of 3–4 blanks.
 *
 * SPIRAL PROGRESSION MODEL
 * ────────────────────────────────────────────────────────────────────────────
 * Subject-verb agreement recurs: P1 → P2 → P3 → P4 → P5 (increasing complexity)
 * Conjunctions recur:            P2 → P3 → P5
 * Passive voice recurs:          P5 → P6
 * Tense builds:                  P2 (simplePast, presentCont) → P3 (pastCont) → P4 (future)
 * Conditionals recur:            P5 → P6 (rising complexity)
 *
 * Structure: passages[level][categoryKey] = [passage, passage, passage]
 */

export const CLOZE_LEVEL_LABELS = {
  P1: 'Primary 1',
  P2: 'Primary 2',
  P3: 'Primary 3',
  P4: 'Primary 4',
  P5: 'Primary 5',
  P6: 'Primary 6',
};

export const CLOZE_LEVEL_ICONS = {
  P1: '🌱', P2: '🌿', P3: '🌳', P4: '🔥', P5: '💎', P6: '👑',
};

export const GRAMMAR_CATEGORIES = {
  articles:        { label: 'Articles (a/an/the)',    icon: '📰' },
  pronouns:        { label: 'Pronouns',               icon: '👤' },
  svAgreement:     { label: 'Subject-Verb Agreement', icon: '🤝' },
  simplePast:      { label: 'Simple Past Tense',      icon: '⏪' },
  presentCont:     { label: 'Present Continuous',     icon: '🔄' },
  pastCont:        { label: 'Past Continuous',        icon: '⏳' },
  futureTense:     { label: 'Future Tense',           icon: '🔮' },
  prepositions:    { label: 'Prepositions',           icon: '📍' },
  conjunctions:    { label: 'Conjunctions',           icon: '🔗' },
  modals:          { label: 'Modal Verbs',            icon: '💪' },
  comparatives:    { label: 'Comparatives',           icon: '📊' },
  quantifiers:     { label: 'Quantifiers',            icon: '🔢' },
  passiveVoice:    { label: 'Passive Voice',          icon: '🔄' },
  conditionals:    { label: 'Conditionals (If)',      icon: '❓' },
  reportedSpeech:  { label: 'Reported Speech',        icon: '💬' },
  relativeClauses: { label: 'Relative Clauses',       icon: '🧩' },
};

export const passages = {
  P1: {
    articles: [
      {
        id: 'g-p1-art-01', title: 'My Family',
        text: 'I have ___ mother and ___ father. They live in ___ big house. I also have ___ older sister.',
        answers: ['a', 'a', 'a', 'an'],
        wordBank: ['a', 'a', 'a', 'an', 'the', 'an', 'the', 'a'],
        xp: 20,
      },
      {
        id: 'g-p1-art-02', title: 'At the Shop',
        text: 'I want ___ apple and ___ banana. ___ apple is red. ___ banana is yellow.',
        answers: ['an', 'a', 'The', 'The'],
        wordBank: ['an', 'a', 'The', 'The', 'a', 'an', 'A', 'An'],
        xp: 20,
      },
      {
        id: 'g-p1-art-03', title: 'My Classroom',
        text: 'There is ___ teacher in my class. She has ___ big desk. ___ whiteboard is on ___ wall.',
        answers: ['a', 'a', 'The', 'the'],
        wordBank: ['a', 'a', 'The', 'the', 'an', 'the', 'A', 'a'],
        xp: 20,
      },
    ],
    pronouns: [
      {
        id: 'g-p1-pro-01', title: 'My Friends',
        text: 'Tom is my friend. ___ likes to play. Sara is nice too. ___ shares her toys. ___ play together every day.',
        answers: ['He', 'She', 'We'],
        wordBank: ['He', 'She', 'We', 'It', 'They', 'I'],
        xp: 20,
      },
      {
        id: 'g-p1-pro-02', title: 'Our Pets',
        text: 'I have a cat. ___ is fluffy. My brother has a dog. ___ is big. ___ love our pets very much.',
        answers: ['It', 'It', 'We'],
        wordBank: ['It', 'It', 'We', 'He', 'She', 'They'],
        xp: 20,
      },
      {
        id: 'g-p1-pro-03', title: 'At the Park',
        text: 'Ali and I went to the park. ___ played on the swings. Then ___ had ice cream. ___ mother called us home.',
        answers: ['We', 'we', 'His'],
        wordBank: ['We', 'we', 'His', 'They', 'he', 'My'],
        xp: 20,
      },
    ],
    svAgreement: [
      {
        id: 'g-p1-sva-01', title: 'The Playground',
        text: 'The children ___ playing. Tom ___ on the slide. The girls ___ skipping.',
        answers: ['are', 'is', 'are'],
        wordBank: ['are', 'is', 'are', 'am', 'was', 'were'],
        xp: 20,
      },
      {
        id: 'g-p1-sva-02', title: 'Breakfast Time',
        text: 'I ___ my breakfast every morning. Mum ___ eggs for me. We ___ happy at breakfast.',
        answers: ['eat', 'cooks', 'are'],
        wordBank: ['eat', 'cooks', 'are', 'eats', 'cook', 'is'],
        xp: 20,
      },
      {
        id: 'g-p1-sva-03', title: 'My School',
        text: 'My teacher ___ very kind. The students ___ hard. I ___ in Primary 1.',
        answers: ['is', 'work', 'am'],
        wordBank: ['is', 'work', 'am', 'are', 'works', 'is'],
        xp: 20,
      },
    ],
    prepositions: [
      {
        id: 'g-p1-pre-01', title: 'Where Is It?',
        text: 'The ball is ___ the table. The cat is ___ the chair. The shoes are ___ the door.',
        answers: ['on', 'under', 'near'],
        wordBank: ['on', 'under', 'near', 'in', 'behind', 'above'],
        xp: 20,
      },
      {
        id: 'g-p1-pre-02', title: 'Going Places',
        text: 'I go ___ school every day. We walk ___ the park. The bus stops ___ my house.',
        answers: ['to', 'through', 'near'],
        wordBank: ['to', 'through', 'near', 'at', 'into', 'by'],
        xp: 20,
      },
      {
        id: 'g-p1-pre-03', title: 'My Room',
        text: 'My bed is ___ the window. My toys are ___ a box. My books are ___ the shelf.',
        answers: ['beside', 'in', 'on'],
        wordBank: ['beside', 'in', 'on', 'under', 'behind', 'at'],
        xp: 20,
      },
    ],
  },

  P2: {
    simplePast: [
      {
        id: 'g-p2-sp-01', title: 'A Trip to the Zoo',
        text: 'Last Sunday, my family ___ to the zoo. We ___ many animals. The monkeys ___ from tree to tree.',
        answers: ['went', 'saw', 'swung'],
        wordBank: ['went', 'saw', 'swung', 'go', 'see', 'swing'],
        xp: 25,
      },
      {
        id: 'g-p2-sp-02', title: 'Helping Mother',
        text: 'After dinner, Tom ___ the dishes. He also ___ the floor. His mother ___ very pleased.',
        answers: ['washed', 'swept', 'was'],
        wordBank: ['washed', 'swept', 'was', 'washes', 'sweeps', 'is'],
        xp: 25,
      },
      {
        id: 'g-p2-sp-03', title: 'The Birthday Party',
        text: 'Sara ___ a birthday party last week. Her friends ___ presents. They ___ cake and played games.',
        answers: ['had', 'brought', 'ate'],
        wordBank: ['had', 'brought', 'ate', 'has', 'bring', 'eat'],
        xp: 25,
      },
    ],
    presentCont: [
      {
        id: 'g-p2-pc-01', title: 'At the Beach',
        text: 'The children ___ sandcastles now. The waves ___ crashing on the shore. Dad ___ under the umbrella.',
        answers: ['are building', 'are', 'is sitting'],
        wordBank: ['are building', 'are', 'is sitting', 'build', 'is', 'sits'],
        xp: 25,
      },
      {
        id: 'g-p2-pc-02', title: 'Recess Time',
        text: 'The bell has rung. The children ___ in the canteen. Some boys ___ football. The teacher ___ them.',
        answers: ['are eating', 'are playing', 'is watching'],
        wordBank: ['are eating', 'are playing', 'is watching', 'eat', 'play', 'watches'],
        xp: 25,
      },
      {
        id: 'g-p2-pc-03', title: 'A Busy Morning',
        text: 'Look! Mum ___ breakfast. Dad ___ the newspaper. I ___ ready for school.',
        answers: ['is cooking', 'is reading', 'am getting'],
        wordBank: ['is cooking', 'is reading', 'am getting', 'cooks', 'reads', 'get'],
        xp: 25,
      },
    ],
    svAgreement: [
      {
        id: 'g-p2-sva-01', title: 'At the Market',
        text: 'Mrs Lin ___ at the market every Saturday. She ___ fresh fruit and vegetables. The fruit sellers ___ very friendly to their customers.',
        answers: ['shops', 'buys', 'are'],
        wordBank: ['shops', 'buys', 'are', 'shop', 'buy', 'is'],
        xp: 25,
      },
      {
        id: 'g-p2-sva-02', title: 'Lunchtime',
        text: 'The canteen ___ very busy at lunchtime. Ali and Tom ___ rice for lunch. Their teacher ___ a bowl of noodles.',
        answers: ['is', 'have', 'has'],
        wordBank: ['is', 'have', 'has', 'are', 'has', 'have'],
        xp: 25,
      },
      {
        id: 'g-p2-sva-03', title: 'My Classmates',
        text: 'I ___ in Class 2A. My best friend ___ next to me. We ___ our homework together every afternoon.',
        answers: ['am', 'sits', 'do'],
        wordBank: ['am', 'sits', 'do', 'are', 'sit', 'does'],
        xp: 25,
      },
    ],
    conjunctions: [
      {
        id: 'g-p2-conj-01', title: 'After School',
        text: 'I like cats ___ dogs. I want to play ___ I have homework. I will play ___ I finish.',
        answers: ['and', 'but', 'after'],
        wordBank: ['and', 'but', 'after', 'or', 'so', 'before'],
        xp: 25,
      },
      {
        id: 'g-p2-conj-02', title: 'Weather',
        text: 'It was raining ___ we stayed indoors. We played games ___ watched TV. The rain stopped ___ we went outside.',
        answers: ['so', 'and', 'then'],
        wordBank: ['so', 'and', 'then', 'but', 'or', 'because'],
        xp: 25,
      },
      {
        id: 'g-p2-conj-03', title: 'Choosing a Snack',
        text: 'Would you like an apple ___ an orange? I like both ___ I can only have one. I chose the apple ___ it is my favourite.',
        answers: ['or', 'but', 'because'],
        wordBank: ['or', 'but', 'because', 'and', 'so', 'then'],
        xp: 25,
      },
    ],
  },

  P3: {
    pastCont: [
      {
        id: 'g-p3-pco-01', title: 'A Rainy Day',
        text: 'It ___ raining heavily when we left school. The children ___ for their parents under the shelter. Some pupils ___ their umbrellas.',
        answers: ['was', 'were waiting', 'were sharing'],
        wordBank: ['was', 'were waiting', 'were sharing', 'is', 'waited', 'shared'],
        xp: 30,
      },
      {
        id: 'g-p3-pco-02', title: 'The Surprise',
        text: 'While Mum ___ dinner, we ___ the living room. We ___ a surprise party for her.',
        answers: ['was cooking', 'were decorating', 'were planning'],
        wordBank: ['was cooking', 'were decorating', 'were planning', 'cooked', 'decorated', 'planned'],
        xp: 30,
      },
      {
        id: 'g-p3-pco-03', title: 'At the Park',
        text: 'The birds ___ when we arrived. Children ___ on the grass. An old man ___ on the bench.',
        answers: ['were singing', 'were playing', 'was sitting'],
        wordBank: ['were singing', 'were playing', 'was sitting', 'sang', 'played', 'sat'],
        xp: 30,
      },
    ],
    svAgreement: [
      {
        id: 'g-p3-sva-01', title: 'Helping at Home',
        text: 'Sarah ___ her mother with the housework every Saturday. She ___ the dishes after dinner. Her parents ___ always grateful for her help.',
        answers: ['helps', 'washes', 'are'],
        wordBank: ['helps', 'washes', 'are', 'help', 'wash', 'is'],
        xp: 30,
      },
      {
        id: 'g-p3-sva-02', title: 'The Science Project',
        text: 'The students ___ working on a science project. Each student ___ a different role. The results ___ very interesting.',
        answers: ['are', 'has', 'are'],
        wordBank: ['are', 'has', 'are', 'is', 'have', 'is'],
        xp: 30,
      },
      {
        id: 'g-p3-sva-03', title: 'Our Neighbourhood',
        text: 'Mr Lee ___ near the park. The twins ___ to the same school. Everyone in the neighbourhood ___ friendly.',
        answers: ['lives', 'go', 'is'],
        wordBank: ['lives', 'go', 'is', 'live', 'goes', 'are'],
        xp: 30,
      },
    ],
    comparatives: [
      {
        id: 'g-p3-comp-01', title: 'Comparing Animals',
        text: 'An elephant is ___ than a dog. A cheetah is ___ than a turtle. The blue whale is the ___ animal on Earth.',
        answers: ['bigger', 'faster', 'largest'],
        wordBank: ['bigger', 'faster', 'largest', 'big', 'fast', 'large'],
        xp: 30,
      },
      {
        id: 'g-p3-comp-02', title: 'My Family',
        text: 'My brother is ___ than me. My sister is the ___ in our family. I am ___ than my sister but shorter than my brother.',
        answers: ['taller', 'shortest', 'taller'],
        wordBank: ['taller', 'shortest', 'taller', 'tall', 'short', 'tall'],
        xp: 30,
      },
      {
        id: 'g-p3-comp-03', title: 'School Subjects',
        text: 'Maths is ___ than art for me. English is the ___ subject I have. Science is ___ interesting than history.',
        answers: ['harder', 'easiest', 'more'],
        wordBank: ['harder', 'easiest', 'more', 'hard', 'easy', 'most'],
        xp: 30,
      },
    ],
    conjunctions: [
      {
        id: 'g-p3-conj-01', title: 'After the Match',
        text: 'The school team played very hard. ___, they did not win the match. They were disappointed ___ they did not give up. They decided to practise even harder the ___ day.',
        answers: ['However', 'but', 'next'],
        wordBank: ['However', 'but', 'next', 'Therefore', 'and', 'following'],
        xp: 30,
      },
      {
        id: 'g-p3-conj-02', title: 'Helping a Friend',
        text: 'Wei felt sad ___ she had lost her bottle. Amy saw this ___ decided to help. They searched together ___ found it under the bench.',
        answers: ['because', 'and', 'and'],
        wordBank: ['because', 'and', 'and', 'so', 'but', 'then'],
        xp: 30,
      },
      {
        id: 'g-p3-conj-03', title: 'A Busy Weekend',
        text: 'Tom wanted to go swimming ___ it was raining. ___ the rain stopped, he went to the playground instead. He had fun ___ was glad he went out.',
        answers: ['but', 'When', 'and'],
        wordBank: ['but', 'When', 'and', 'because', 'After', 'so'],
        xp: 30,
      },
    ],
  },

  P4: {
    futureTense: [
      {
        id: 'g-p4-ft-01', title: 'The School Garden',
        text: 'The students ___ plant flowers next week. They ___ water them every day. The garden ___ look beautiful in a month.',
        answers: ['will', 'will', 'will'],
        wordBank: ['will', 'will', 'will', 'would', 'shall', 'can'],
        xp: 35,
      },
      {
        id: 'g-p4-ft-02', title: 'Holiday Plans',
        text: 'We ___ going to visit Japan next year. My father ___ book the tickets soon. I ___ so excited about the trip.',
        answers: ['are', 'will', 'am'],
        wordBank: ['are', 'will', 'am', 'were', 'would', 'was'],
        xp: 35,
      },
      {
        id: 'g-p4-ft-03', title: 'The New Library',
        text: 'The new library ___ be completed next year. Students ___ be able to borrow more books. It ___ also have a reading garden.',
        answers: ['will', 'will', 'will'],
        wordBank: ['will', 'will', 'will', 'would', 'can', 'shall'],
        xp: 35,
      },
    ],
    modals: [
      {
        id: 'g-p4-mod-01', title: 'Environmental Awareness',
        text: 'We ___ reduce our use of plastic. Everyone ___ do their part to protect the planet. We ___ not waste water.',
        answers: ['should', 'must', 'should'],
        wordBank: ['should', 'must', 'should', 'will', 'can', 'may'],
        xp: 35,
      },
      {
        id: 'g-p4-mod-02', title: 'Library Rules',
        text: 'You ___ talk loudly in the library. Students ___ return books on time. You ___ borrow up to four books at once.',
        answers: ['must not', 'should', 'may'],
        wordBank: ['must not', 'should', 'may', 'can', 'will', 'shall'],
        xp: 35,
      },
      {
        id: 'g-p4-mod-03', title: 'Being Safe',
        text: 'You ___ look left and right before crossing. Children ___ not play near the road. We ___ always wear our seatbelts.',
        answers: ['must', 'should', 'must'],
        wordBank: ['must', 'should', 'must', 'can', 'may', 'will'],
        xp: 35,
      },
    ],
    quantifiers: [
      {
        id: 'g-p4-quan-01', title: 'The Class Monitor',
        text: 'Ali had ___ responsibilities as class monitor. He made sure ___ student did their work. There were ___ complaints about his leadership.',
        answers: ['many', 'every', 'few'],
        wordBank: ['many', 'every', 'few', 'much', 'each', 'little'],
        xp: 35,
      },
      {
        id: 'g-p4-quan-02', title: 'The Canteen',
        text: 'There is not ___ food left in the canteen. Only ___ students brought their own lunch. ___ of the rice has been eaten.',
        answers: ['much', 'a few', 'Most'],
        wordBank: ['much', 'a few', 'Most', 'many', 'few', 'Some'],
        xp: 35,
      },
      {
        id: 'g-p4-quan-03', title: 'Shopping',
        text: 'We bought ___ apples and ___ bread. There were ___ people at the market. We did not have ___ money left.',
        answers: ['some', 'some', 'many', 'much'],
        wordBank: ['some', 'some', 'many', 'much', 'any', 'few', 'little', 'several'],
        xp: 35,
      },
    ],
    svAgreement: [
      {
        id: 'g-p4-sva-01', title: 'The School Team',
        text: 'The school team ___ been training very hard. Each player ___ a special role. One of the girls ___ the fastest runner in the school.',
        answers: ['has', 'has', 'is'],
        wordBank: ['has', 'has', 'is', 'have', 'have', 'are'],
        xp: 35,
      },
      {
        id: 'g-p4-sva-02', title: 'Our Classroom',
        text: 'Everyone in the class ___ expected to do their best. Each of the students ___ a reading journal. Neither the teacher nor the pupils ___ absent today.',
        answers: ['is', 'has', 'were'],
        wordBank: ['is', 'has', 'were', 'are', 'have', 'was'],
        xp: 35,
      },
      {
        id: 'g-p4-sva-03', title: 'Community Helpers',
        text: 'A group of nurses ___ visiting our school today. The team of doctors ___ also joined them. Every child in the hall ___ very excited to meet them.',
        answers: ['is', 'has', 'was'],
        wordBank: ['is', 'has', 'was', 'are', 'have', 'were'],
        xp: 35,
      },
    ],
  },

  P5: {
    svAgreement: [
      {
        id: 'g-p5-sva-01', title: 'The School Play',
        text: 'The school play ___ been rehearsed for six weeks. Neither the lead actor nor his classmates ___ willing to give up. Each performer ___ expected to memorise all their lines.',
        answers: ['has', 'were', 'is'],
        wordBank: ['has', 'were', 'is', 'have', 'was', 'are'],
        xp: 40,
      },
      {
        id: 'g-p5-sva-02', title: 'The Sports Team',
        text: 'The team ___ decided to train every day after school. The group of players ___ been working very hard. Neither the captain nor the players ___ ready to give up.',
        answers: ['has', 'has', 'were'],
        wordBank: ['has', 'has', 'were', 'have', 'have', 'was'],
        xp: 40,
      },
      {
        id: 'g-p5-sva-03', title: 'Community Service',
        text: 'Community projects ___ becoming more popular in schools. The number of student volunteers ___ increasing every year. Everyone who takes part ___ expected to work as a team.',
        answers: ['are', 'is', 'is'],
        wordBank: ['are', 'is', 'is', 'is', 'are', 'are'],
        xp: 40,
      },
    ],
    passiveVoice: [
      {
        id: 'g-p5-pv-01', title: 'The New Bridge',
        text: 'The new bridge ___ opened by the minister. It ___ designed by a famous architect. The project ___ completed ahead of schedule.',
        answers: ['was', 'was', 'was'],
        wordBank: ['was', 'was', 'was', 'is', 'has', 'had'],
        xp: 40,
      },
      {
        id: 'g-p5-pv-02', title: 'School Events',
        text: 'The competition ___ organised by the student council. Prizes ___ awarded to the top three teams. The event ___ attended by over five hundred students.',
        answers: ['was', 'were', 'was'],
        wordBank: ['was', 'were', 'was', 'is', 'are', 'is'],
        xp: 40,
      },
      {
        id: 'g-p5-pv-03', title: 'The Science Exhibition',
        text: 'The science exhibition ___ organised by the school\'s STEM club. Each entry ___ carefully judged by a team of teachers. The prizes ___ awarded during the school assembly.',
        answers: ['was', 'was', 'were'],
        wordBank: ['was', 'was', 'were', 'is', 'is', 'are'],
        xp: 40,
      },
    ],
    conditionals: [
      {
        id: 'g-p5-cond-01', title: 'Healthy Eating',
        text: 'If you ___ more vegetables, you will feel healthier. If we ___ not recycle, the environment will suffer. If it ___ tomorrow, the match will be cancelled.',
        answers: ['eat', 'do', 'rains'],
        wordBank: ['eat', 'do', 'rains', 'ate', 'did', 'rained'],
        xp: 40,
      },
      {
        id: 'g-p5-cond-02', title: 'Studying Hard',
        text: 'If she ___ harder, she would score better. If I ___ a bird, I would fly around the world. If we ___ earlier, we would not have missed the bus.',
        answers: ['studied', 'were', 'had left'],
        wordBank: ['studied', 'were', 'had left', 'studies', 'am', 'left'],
        xp: 40,
      },
      {
        id: 'g-p5-cond-03', title: 'Being a Good Friend',
        text: 'If you ___ more patient with others, friendships will last longer. Unless we ___ kinder to those around us, we will push people away. If they ___ listened more carefully, the misunderstanding would not have happened.',
        answers: ['are', 'become', 'had'],
        wordBank: ['are', 'become', 'had', 'were', 'became', 'have'],
        xp: 40,
      },
    ],
    conjunctions: [
      {
        id: 'g-p5-conj-01', title: 'The School Camp',
        text: 'The school camp had been a great success. ___, some students felt it was too short. ___ the teachers had planned many activities, there was not enough time. Students today travel further ___ they did in the past.',
        answers: ['Nevertheless', 'Although', 'than'],
        wordBank: ['Nevertheless', 'Although', 'than', 'Therefore', 'Because', 'then'],
        xp: 40,
      },
      {
        id: 'g-p5-conj-02', title: 'Two Schools',
        text: '___ some students prefer indoor activities, others love outdoor sports. The school library is quiet, ___ the sports hall is always noisy. ___ both places serve different purposes, they are equally important.',
        answers: ['While', 'whereas', 'Although'],
        wordBank: ['While', 'whereas', 'Although', 'Because', 'and', 'Since'],
        xp: 40,
      },
      {
        id: 'g-p5-conj-03', title: 'Helping Others',
        text: 'The students helped in the canteen ___ they wanted to give back to the school. ___ it was tiring, they found it very rewarding. They continued ___ they had cleared all the trays.',
        answers: ['because', 'Although', 'until'],
        wordBank: ['because', 'Although', 'until', 'so', 'However', 'while'],
        xp: 40,
      },
    ],
  },

  P6: {
    passiveVoice: [
      {
        id: 'g-p6-pv-01', title: "The School's Anniversary",
        text: "The school's anniversary celebrations ___ organised by the parent-teacher committee. A special magazine ___ printed to mark the occasion. Photographs ___ taken of every class and displayed in the hall.",
        answers: ['were', 'was', 'were'],
        wordBank: ['were', 'was', 'were', 'are', 'is', 'are'],
        xp: 50,
      },
      {
        id: 'g-p6-pv-02', title: 'The Community Garden',
        text: 'A community garden ___ set up by a group of volunteers last year. Vegetables and herbs ___ planted in the raised garden beds. The garden ___ visited by many residents every weekend.',
        answers: ['was', 'were', 'is'],
        wordBank: ['was', 'were', 'is', 'is', 'are', 'was'],
        xp: 50,
      },
      {
        id: 'g-p6-pv-03', title: 'The Book Donation Drive',
        text: 'Thousands of books ___ donated to the school library last month. Each book ___ carefully sorted and labelled by student volunteers. The new arrivals ___ displayed in the reading corner for all to enjoy.',
        answers: ['were', 'was', 'were'],
        wordBank: ['were', 'was', 'were', 'are', 'is', 'are'],
        xp: 50,
      },
    ],
    reportedSpeech: [
      {
        id: 'g-p6-rs-01', title: "The Teacher's Announcement",
        text: 'The teacher announced that the class ___ have a spelling test on Friday. She added that students ___ prepare by reviewing all their notes. She also reminded them that the test ___ cover the words from this term.',
        answers: ['would', 'should', 'would'],
        wordBank: ['would', 'should', 'would', 'will', 'must', 'will'],
        xp: 50,
      },
      {
        id: 'g-p6-rs-02', title: "The Principal's Speech",
        text: 'The principal announced that the school ___ hold its open house the following month. She said that all students ___ encouraged to invite their families. She added that a special programme ___ be prepared for visitors.',
        answers: ['would', 'were', 'would'],
        wordBank: ['would', 'were', 'would', 'will', 'are', 'will'],
        xp: 50,
      },
      {
        id: 'g-p6-rs-03', title: 'What Happened in Class',
        text: 'The students reported that the experiment ___ produced unexpected results. Ali explained that he ___ not understood the instructions at first. The teacher replied that she ___ go through it again in the next lesson.',
        answers: ['had', 'had', 'would'],
        wordBank: ['had', 'had', 'would', 'has', 'have', 'will'],
        xp: 50,
      },
    ],
    relativeClauses: [
      {
        id: 'g-p6-rc-01', title: 'Our School Library',
        text: 'The school library, ___ was recently renovated, has a much larger collection now. Students ___ love reading often spend their recess there. Books ___ have been donated are sorted and placed on special shelves.',
        answers: ['which', 'who', 'that'],
        wordBank: ['which', 'who', 'that', 'whom', 'whose', 'where'],
        xp: 50,
      },
      {
        id: 'g-p6-rc-02', title: 'A Good Teacher',
        text: 'A good teacher is someone ___ understands how different students learn. Mrs Lim, ___ class I was in last year, made lessons very enjoyable. The teaching methods ___ she used helped many students improve greatly.',
        answers: ['who', 'whose', 'that'],
        wordBank: ['who', 'whose', 'that', 'whom', 'which', 'where'],
        xp: 50,
      },
      {
        id: 'g-p6-rc-03', title: 'Our Neighbourhood',
        text: 'Singapore, ___ people come from many different backgrounds, is a diverse and vibrant society. Residents ___ have lived here for decades feel a strong sense of belonging. The community centre, ___ our family has been going for years, runs activities for everyone.',
        answers: ['whose', 'who', 'where'],
        wordBank: ['whose', 'who', 'where', 'which', 'that', 'whom'],
        xp: 50,
      },
    ],
    conditionals: [
      {
        id: 'g-p6-cond-01', title: 'Being Responsible',
        text: 'If the students ___ not revised their work, they would have done poorly in the test. If we ___ responsible citizens, our community will be a much better place. Had the team ___ more careful, they would not have lost the match.',
        answers: ['had', 'are', 'been'],
        wordBank: ['had', 'are', 'been', 'have', 'were', 'being'],
        xp: 50,
      },
      {
        id: 'g-p6-cond-02', title: 'Making Good Choices',
        text: 'If we ___ our time wisely, we would achieve much more each day. Unless we ___ kinder to one another, conflicts will keep happening. If students ___ to help each other more, everyone in the school would benefit.',
        answers: ['managed', 'are', 'chose'],
        wordBank: ['managed', 'are', 'chose', 'manage', 'were', 'choose'],
        xp: 50,
      },
      {
        id: 'g-p6-cond-03', title: 'A Different Outcome',
        text: 'If more students ___ involved in community service, the neighbourhood would be cleaner. Had the team ___ together better, they would have won the competition. If everyone ___ to do their part, the school would become an even better place.',
        answers: ['were', 'worked', 'chose'],
        wordBank: ['were', 'worked', 'chose', 'are', 'work', 'choose'],
        xp: 50,
      },
    ],
  },
};
