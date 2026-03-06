/**
 * PhonicsQuest – Cloze Castle Quest Data (Grammar Cloze)
 *
 * Singapore Primary 1–6 grammar cloze passages organised by level → category.
 * Each category tests a specific grammar concept with 3 passages of 3–4 blanks.
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

/**
 * Grammar categories available per level.
 * Not every level has every category — each level focuses on
 * age-appropriate concepts.
 */
export const GRAMMAR_CATEGORIES = {
  articles:        { label: 'Articles (a/an/the)',  icon: '📰' },
  pronouns:        { label: 'Pronouns',             icon: '👤' },
  svAgreement:     { label: 'Subject-Verb Agreement', icon: '🤝' },
  simplePast:      { label: 'Simple Past Tense',    icon: '⏪' },
  presentCont:     { label: 'Present Continuous',    icon: '🔄' },
  pastCont:        { label: 'Past Continuous',       icon: '⏳' },
  futureTense:     { label: 'Future Tense',         icon: '🔮' },
  prepositions:    { label: 'Prepositions',          icon: '📍' },
  conjunctions:    { label: 'Conjunctions',          icon: '🔗' },
  modals:          { label: 'Modal Verbs',           icon: '💪' },
  comparatives:    { label: 'Comparatives',          icon: '📊' },
  quantifiers:     { label: 'Quantifiers',           icon: '🔢' },
  passiveVoice:    { label: 'Passive Voice',         icon: '🔄' },
  conditionals:    { label: 'Conditionals (If)',     icon: '❓' },
  reportedSpeech:  { label: 'Reported Speech',       icon: '💬' },
  relativeClauses: { label: 'Relative Clauses',      icon: '🧩' },
};

export const passages = {
  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY 1
  // ═══════════════════════════════════════════════════════════════════════════
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

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY 2
  // ═══════════════════════════════════════════════════════════════════════════
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
    pronouns: [
      {
        id: 'g-p2-pro-01', title: 'My Pet Dog',
        text: 'I have a dog. ___ name is Max. ___ is brown and white. I take ___ for a walk every morning.',
        answers: ['His', 'He', 'him'],
        wordBank: ['His', 'He', 'him', 'Its', 'It', 'it'],
        xp: 25,
      },
      {
        id: 'g-p2-pro-02', title: 'The New Baby',
        text: 'My sister had ___ baby. ___ is very small. ___ all love the baby very much.',
        answers: ['her', 'He', 'We'],
        wordBank: ['her', 'He', 'We', 'his', 'She', 'They'],
        xp: 25,
      },
      {
        id: 'g-p2-pro-03', title: 'Class Activity',
        text: 'The teacher told ___ to open our books. ___ asked Ali a question. Ali gave ___ the answer.',
        answers: ['us', 'She', 'her'],
        wordBank: ['us', 'She', 'her', 'them', 'He', 'him'],
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

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY 3
  // ═══════════════════════════════════════════════════════════════════════════
  P3: {
    simplePast: [
      {
        id: 'g-p3-sp-01', title: 'At the Market',
        text: 'Mrs Tan ___ to the market early in the morning. She ___ fresh vegetables and fruits. She also ___ some fish for her family.',
        answers: ['went', 'bought', 'bought'],
        wordBank: ['went', 'bought', 'bought', 'goes', 'buys', 'buys'],
        xp: 30,
      },
      {
        id: 'g-p3-sp-02', title: 'The School Concert',
        text: 'The school ___ a concert last Friday. Many students ___ on stage. The audience ___ loudly after each performance.',
        answers: ['held', 'performed', 'clapped'],
        wordBank: ['held', 'performed', 'clapped', 'holds', 'perform', 'clap'],
        xp: 30,
      },
      {
        id: 'g-p3-sp-03', title: 'The Lost Wallet',
        text: 'John ___ his pocket and found it empty. He ___ when he realised his wallet was missing. He quickly ___ his steps.',
        answers: ['checked', 'panicked', 'retraced'],
        wordBank: ['checked', 'panicked', 'retraced', 'checks', 'panics', 'retraces'],
        xp: 30,
      },
    ],
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
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY 4
  // ═══════════════════════════════════════════════════════════════════════════
  P4: {
    simplePast: [
      {
        id: 'g-p4-sp-01', title: 'Sports Day',
        text: 'The school ___ a sports day last Friday. The students ___ hard for many weeks. Tom ___ the 100-metre race. Everyone ___ very proud.',
        answers: ['had', 'trained', 'won', 'was'],
        wordBank: ['had', 'trained', 'won', 'was', 'has', 'train', 'wins', 'were'],
        xp: 35,
      },
      {
        id: 'g-p4-sp-02', title: 'The Camp',
        text: 'The scouts ___ to a campsite last weekend. They ___ tents and ___ a campfire. Everyone ___ songs around the fire.',
        answers: ['went', 'pitched', 'built', 'sang'],
        wordBank: ['went', 'pitched', 'built', 'sang', 'go', 'pitch', 'build', 'sing'],
        xp: 35,
      },
      {
        id: 'g-p4-sp-03', title: 'The Visit',
        text: 'Last holiday, we ___ our grandparents. Grandma ___ our favourite dishes. We ___ stories and ___ together.',
        answers: ['visited', 'cooked', 'shared', 'laughed'],
        wordBank: ['visited', 'cooked', 'shared', 'laughed', 'visit', 'cooks', 'share', 'laugh'],
        xp: 35,
      },
    ],
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
        id: 'g-p4-ft-03', title: 'The New Building',
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
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY 5
  // ═══════════════════════════════════════════════════════════════════════════
  P5: {
    svAgreement: [
      {
        id: 'g-p5-sva-01', title: 'Technology in Education',
        text: 'Technology ___ transformed the way students learn. Neither the teachers nor the principal ___ opposed to using it. Each student ___ given a tablet.',
        answers: ['has', 'is', 'is'],
        wordBank: ['has', 'is', 'is', 'have', 'are', 'are'],
        xp: 40,
      },
      {
        id: 'g-p5-sva-02', title: 'The Committee',
        text: 'The committee ___ made its decision. The team of doctors ___ arrived. Neither the captain nor the players ___ ready to give up.',
        answers: ['has', 'has', 'were'],
        wordBank: ['has', 'has', 'were', 'have', 'have', 'was'],
        xp: 40,
      },
      {
        id: 'g-p5-sva-03', title: 'Community Gardens',
        text: 'Community gardens ___ springing up worldwide. The number of volunteers ___ increasing. Everyone in the neighbourhood ___ welcome to join.',
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
        text: 'The competition ___ organised by the student council. Prizes ___ awarded to the top three teams. The event ___ attended by over 500 students.',
        answers: ['was', 'were', 'was'],
        wordBank: ['was', 'were', 'was', 'is', 'are', 'is'],
        xp: 40,
      },
      {
        id: 'g-p5-pv-03', title: 'Social Media',
        text: 'Fake news ___ spread quickly on social media. Millions of users ___ affected by misinformation every day. Stronger laws ___ needed to address this problem.',
        answers: ['is', 'are', 'are'],
        wordBank: ['is', 'are', 'are', 'was', 'were', 'were'],
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
        id: 'g-p5-cond-03', title: 'Environmental Action',
        text: 'If everyone ___ less plastic, the oceans would be cleaner. Unless we ___ action now, the situation will worsen. If the government ___ new laws, pollution could decrease.',
        answers: ['used', 'take', 'introduced'],
        wordBank: ['used', 'take', 'introduced', 'uses', 'took', 'introduces'],
        xp: 40,
      },
    ],
    conjunctions: [
      {
        id: 'g-p5-conj-01', title: 'Public Transport',
        text: 'Public transport has improved. ___, overcrowding remains a challenge. ___ the government has invested heavily, more needs to be done. Commuters travel faster ___ before.',
        answers: ['Nevertheless', 'Although', 'than'],
        wordBank: ['Nevertheless', 'Although', 'than', 'Therefore', 'Because', 'then'],
        xp: 40,
      },
      {
        id: 'g-p5-conj-02', title: 'The Debate',
        text: '___ some students prefer sciences, others favour the arts. The urban campus is modern, ___ the rural one is more traditional. ___ both have strengths, they serve different needs.',
        answers: ['While', 'whereas', 'Although'],
        wordBank: ['While', 'whereas', 'Although', 'Because', 'and', 'Since'],
        xp: 40,
      },
      {
        id: 'g-p5-conj-03', title: 'Volunteering',
        text: 'The students volunteered ___ they wanted to help. ___ it was tiring, they found it rewarding. They continued ___ they made a difference.',
        answers: ['because', 'Although', 'until'],
        wordBank: ['because', 'Although', 'until', 'so', 'However', 'while'],
        xp: 40,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRIMARY 6
  // ═══════════════════════════════════════════════════════════════════════════
  P6: {
    passiveVoice: [
      {
        id: 'g-p6-pv-01', title: 'Globalisation',
        text: 'Economies ___ been interconnected by globalisation. The exchange of goods ___ facilitated by new trade agreements. However, the gap between nations ___ widened considerably.',
        answers: ['have', 'has been', 'has been'],
        wordBank: ['have', 'has been', 'has been', 'has', 'was', 'was'],
        xp: 50,
      },
      {
        id: 'g-p6-pv-02', title: 'Artificial Intelligence',
        text: 'Industries ___ being reshaped by AI at an unprecedented pace. Tasks that once ___ performed by humans are now automated. New frameworks ___ be developed to address ethical concerns.',
        answers: ['are', 'were', 'must'],
        wordBank: ['are', 'were', 'must', 'is', 'are', 'should'],
        xp: 50,
      },
      {
        id: 'g-p6-pv-03', title: 'Conservation Efforts',
        text: 'Endangered species ___ protected by international laws. New reserves ___ been established in Southeast Asia. These efforts ___ supported by donations from around the world.',
        answers: ['are', 'have', 'are'],
        wordBank: ['are', 'have', 'are', 'were', 'has', 'were'],
        xp: 50,
      },
    ],
    reportedSpeech: [
      {
        id: 'g-p6-rs-01', title: 'The Interview',
        text: 'The minister said that the economy ___ improving. He added that new jobs ___ be created next year. He assured the public that the government ___ working hard.',
        answers: ['was', 'would', 'was'],
        wordBank: ['was', 'would', 'was', 'is', 'will', 'is'],
        xp: 50,
      },
      {
        id: 'g-p6-rs-02', title: 'School Announcement',
        text: 'The principal announced that the school ___ be closed the following day. She said that students ___ to stay home. She added that online lessons ___ be provided.',
        answers: ['would', 'were', 'would'],
        wordBank: ['would', 'were', 'would', 'will', 'are', 'will'],
        xp: 50,
      },
      {
        id: 'g-p6-rs-03', title: 'The News Report',
        text: 'The reporter said that the fire ___ started in the kitchen. Witnesses claimed that they ___ smoke coming from the building. Officials stated that no one ___ injured.',
        answers: ['had', 'had seen', 'had been'],
        wordBank: ['had', 'had seen', 'had been', 'has', 'saw', 'was'],
        xp: 50,
      },
    ],
    relativeClauses: [
      {
        id: 'g-p6-rc-01', title: 'Mental Health Awareness',
        text: 'Mental health, ___ is essential to wellbeing, deserves more attention. Students ___ struggle with anxiety often hesitate to seek help. Programmes ___ support emotional health are being implemented.',
        answers: ['which', 'who', 'that'],
        wordBank: ['which', 'who', 'that', 'whom', 'whose', 'where'],
        xp: 50,
      },
      {
        id: 'g-p6-rc-02', title: 'Urban Planning',
        text: 'Cities ___ prioritise green spaces tend to have happier residents. The architect ___ designed the building won an award. The park, ___ was completed last year, attracts many visitors.',
        answers: ['that', 'who', 'which'],
        wordBank: ['that', 'who', 'which', 'whom', 'whose', 'where'],
        xp: 50,
      },
      {
        id: 'g-p6-rc-03', title: 'Cultural Diversity',
        text: 'Singapore, ___ population is multicultural, celebrates many festivals. Citizens ___ backgrounds are different live harmoniously. The neighbourhood ___ I grew up in is very diverse.',
        answers: ['whose', 'whose', 'where'],
        wordBank: ['whose', 'whose', 'where', 'which', 'who', 'that'],
        xp: 50,
      },
    ],
    conditionals: [
      {
        id: 'g-p6-cond-01', title: 'Climate Change',
        text: 'If governments ___ not acted sooner, the damage would have been irreversible. If carbon emissions ___ reduced, global temperatures will stabilise. Had the treaty ___ signed earlier, more species could have been saved.',
        answers: ['had', 'are', 'been'],
        wordBank: ['had', 'are', 'been', 'have', 'were', 'being'],
        xp: 50,
      },
      {
        id: 'g-p6-cond-02', title: 'Technology Ethics',
        text: 'If AI ___ regulated properly, its benefits would outweigh the risks. Unless stricter laws ___ passed, privacy violations will increase. If we ___ to ignore these issues, the consequences would be severe.',
        answers: ['were', 'are', 'were'],
        wordBank: ['were', 'are', 'were', 'is', 'was', 'was'],
        xp: 50,
      },
      {
        id: 'g-p6-cond-03', title: 'Education Reform',
        text: 'If more resources ___ allocated to schools, outcomes would improve. Had the programme ___ implemented earlier, more students would have benefited. If we ___ to reform the system now, future generations will thank us.',
        answers: ['were', 'been', 'choose'],
        wordBank: ['were', 'been', 'choose', 'are', 'being', 'chose'],
        xp: 50,
      },
    ],
  },
};
