/**
 * PhonicsQuest – Word Vault Quest Data (Vocabulary Cloze)
 *
 * Seven vocabulary categories × six levels (p1–p6).
 * Same passage format as grammar cloze: text with ___ blanks,
 * answers array, wordBank (answers + distractors).
 */

export const VOCAB_CATEGORIES = {
  contextInference: {
    label: 'Context Clue',
    icon: '🔎',
    color: '#6c63ff',
    desc: 'Use the story to guess the missing word',
  },
  definitionMatch: {
    label: 'Definition Match',
    icon: '📖',
    color: '#0ea5e9',
    desc: 'Match words to their meanings',
  },
  synonymContrast: {
    label: 'Synonym & Contrast',
    icon: '⚖️',
    color: '#22c55e',
    desc: 'Find words that mean the same or opposite',
  },
  morphologicalAffix: {
    label: 'Word Parts',
    icon: '🔧',
    color: '#f97316',
    desc: 'Use prefixes and suffixes to build words',
  },
  collocationCloze: {
    label: 'Word Partners',
    icon: '🤝',
    color: '#a855f7',
    desc: 'Words that naturally go together',
  },
  grammaticalRole: {
    label: 'Word Class',
    icon: '🏷️',
    color: '#ec4899',
    desc: 'Choose the right noun, verb, or adjective',
  },
  connectorClue: {
    label: 'Connectors',
    icon: '🔗',
    color: '#0d9488',
    desc: 'Link ideas with the right connector word',
  },
};

export const vocabPassages = {
  // ── CONTEXT INFERENCE ──────────────────────────────────────────────────────
  contextInference: {
    p1: [
      {
        id: 'ci-p1-01',
        title: 'Rainy Day',
        text: 'The sky was dark and clouds covered the sun. Anna put on her ___ before going outside. She did not want to get wet in the rain.',
        answers: ['raincoat'],
        wordBank: ['raincoat', 'sunglasses', 'hat', 'shoes'],
        xp: 20,
      },
    ],
    p2: [
      {
        id: 'ci-p2-01',
        title: 'The Tired Puppy',
        text: 'After running and playing all day, the puppy ___ on its soft bed. It closed its eyes and fell fast asleep. It was very tired from all the exercise.',
        answers: ['lay'],
        wordBank: ['lay', 'jumped', 'barked', 'ran'],
        xp: 25,
      },
    ],
    p3: [
      {
        id: 'ci-p3-01',
        title: 'The Lost Wallet',
        text: 'John reached into his pocket and found it empty. He ___ when he realised his wallet was missing. He quickly retraced his steps, hoping to find it.',
        answers: ['panicked'],
        wordBank: ['panicked', 'laughed', 'smiled', 'danced'],
        xp: 30,
      },
    ],
    p4: [
      {
        id: 'ci-p4-01',
        title: 'The Brave Firefighter',
        text: 'The firefighter rushed into the burning building without hesitation. She was ___ to risk her life to save others. Her colleagues admired her courage greatly.',
        answers: ['fearless'],
        wordBank: ['fearless', 'careless', 'helpless', 'restless'],
        xp: 35,
      },
    ],
    p5: [
      {
        id: 'ci-p5-01',
        title: 'The Scientist\'s Discovery',
        text: 'After years of painstaking research, Dr Lee finally made a breakthrough. She felt ___ as she published her findings. Her work would benefit millions worldwide.',
        answers: ['elated'],
        wordBank: ['elated', 'dejected', 'indifferent', 'anxious'],
        xp: 40,
      },
    ],
    p6: [
      {
        id: 'ci-p6-01',
        title: 'The Reluctant Leader',
        text: 'Although Tom had always been ___ of the spotlight, his team convinced him to stand for class president. To everyone\'s surprise, his quiet determination inspired more confidence than any speech could.',
        answers: ['wary'],
        wordBank: ['wary', 'fond', 'worthy', 'proud'],
        xp: 50,
      },
    ],
  },

  // ── DEFINITION MATCH ──────────────────────────────────────────────────────
  definitionMatch: {
    p1: [
      {
        id: 'dm-p1-01',
        title: 'Animal Homes',
        text: 'A bird lives in a ___. It is made of twigs and leaves. The bird lays its eggs there.',
        answers: ['nest'],
        wordBank: ['nest', 'cave', 'pond', 'den'],
        xp: 20,
      },
    ],
    p2: [
      {
        id: 'dm-p2-01',
        title: 'Community Helpers',
        text: 'A ___ is a person who helps sick people get better. They work in a hospital and give medicine to patients.',
        answers: ['doctor'],
        wordBank: ['doctor', 'teacher', 'farmer', 'pilot'],
        xp: 25,
      },
    ],
    p3: [
      {
        id: 'dm-p3-01',
        title: 'Weather Words',
        text: 'A ___ is a very large and powerful storm. It brings very strong winds and heavy rainfall. It can cause a lot of damage.',
        answers: ['typhoon'],
        wordBank: ['typhoon', 'drizzle', 'breeze', 'fog'],
        xp: 30,
      },
    ],
    p4: [
      {
        id: 'dm-p4-01',
        title: 'Science Vocabulary',
        text: 'The process by which plants make their own food using sunlight is called ___. Without this process, most life on Earth could not survive.',
        answers: ['photosynthesis'],
        wordBank: ['photosynthesis', 'evaporation', 'condensation', 'digestion'],
        xp: 35,
      },
    ],
    p5: [
      {
        id: 'dm-p5-01',
        title: 'Literary Terms',
        text: 'A ___ is a figure of speech that describes something by saying it is something else. For example, "Life is a journey" compares life to travelling on a road.',
        answers: ['metaphor'],
        wordBank: ['metaphor', 'simile', 'alliteration', 'hyperbole'],
        xp: 40,
      },
    ],
    p6: [
      {
        id: 'dm-p6-01',
        title: 'Economic Concepts',
        text: 'When the general price of goods and services rises over time, economists call this ___. It reduces the purchasing power of money and affects everyday consumers.',
        answers: ['inflation'],
        wordBank: ['inflation', 'recession', 'deflation', 'taxation'],
        xp: 50,
      },
    ],
  },

  // ── SYNONYM & CONTRAST ────────────────────────────────────────────────────
  synonymContrast: {
    p1: [
      {
        id: 'sc-p1-01',
        title: 'Feelings',
        text: 'Tom was ___ when he won the prize. He was so glad and could not stop smiling. A word that means the same as glad is happy.',
        answers: ['happy'],
        wordBank: ['happy', 'angry', 'tired', 'bored'],
        xp: 20,
      },
    ],
    p2: [
      {
        id: 'sc-p2-01',
        title: 'Opposite Day',
        text: 'The giant was very tall, but his pet mouse was ___. They were complete opposites and looked funny standing next to each other.',
        answers: ['tiny'],
        wordBank: ['tiny', 'huge', 'fat', 'strong'],
        xp: 25,
      },
    ],
    p3: [
      {
        id: 'sc-p3-01',
        title: 'Speed',
        text: 'The tortoise moved very ___ along the path. It was the opposite of the speedy rabbit that had already reached the finish line.',
        answers: ['slowly'],
        wordBank: ['slowly', 'quickly', 'boldly', 'softly'],
        xp: 30,
      },
    ],
    p4: [
      {
        id: 'sc-p4-01',
        title: 'Personality',
        text: 'Unlike her ___ brother who loved parties and crowds, Maya preferred quiet evenings with a good book. She was the opposite of outgoing.',
        answers: ['extroverted'],
        wordBank: ['extroverted', 'introverted', 'ambitious', 'generous'],
        xp: 35,
      },
    ],
    p5: [
      {
        id: 'sc-p5-01',
        title: 'Attitudes',
        text: 'The new policy was met with ___ from most residents. Few people supported it; the majority strongly disagreed with its terms.',
        answers: ['opposition'],
        wordBank: ['opposition', 'support', 'enthusiasm', 'admiration'],
        xp: 40,
      },
    ],
    p6: [
      {
        id: 'sc-p6-01',
        title: 'Leadership',
        text: 'Critics described the minister\'s response as ___, while supporters called it measured and calm. The same behaviour was interpreted very differently by opposing sides.',
        answers: ['indecisive'],
        wordBank: ['indecisive', 'decisive', 'assertive', 'aggressive'],
        xp: 50,
      },
    ],
  },

  // ── MORPHOLOGICAL AFFIX ───────────────────────────────────────────────────
  morphologicalAffix: {
    p1: [
      {
        id: 'ma-p1-01',
        title: 'Adding -ing',
        text: 'The boy is ___ in the pool. He loves to swim every day after school.',
        answers: ['swimming'],
        wordBank: ['swimming', 'swims', 'swam', 'swimmer'],
        xp: 20,
      },
    ],
    p2: [
      {
        id: 'ma-p2-01',
        title: 'Adding -er',
        text: 'Tom is a fast runner, but Sarah is even ___. She wins every race at school.',
        answers: ['faster'],
        wordBank: ['faster', 'fastest', 'fast', 'fastly'],
        xp: 25,
      },
    ],
    p3: [
      {
        id: 'ma-p3-01',
        title: 'Using un-',
        text: 'The instructions were confusing and ___. Nobody in the class could understand what they were supposed to do.',
        answers: ['unclear'],
        wordBank: ['unclear', 'unclear', 'clear', 'clearly'],
        xp: 30,
      },
    ],
    p4: [
      {
        id: 'ma-p4-01',
        title: 'Using -tion',
        text: 'The scientist made an important ___ that changed our understanding of the universe. Everyone was amazed by what she had found.',
        answers: ['discovery'],
        wordBank: ['discovery', 'discover', 'discoverer', 'discovered'],
        xp: 35,
      },
    ],
    p5: [
      {
        id: 'ma-p5-01',
        title: 'Using mis-',
        text: 'The journalist was accused of ___ the facts in her article. Readers were angry that she had given them incorrect information.',
        answers: ['misrepresenting'],
        wordBank: ['misrepresenting', 'representing', 'represented', 'representation'],
        xp: 40,
      },
    ],
    p6: [
      {
        id: 'ma-p6-01',
        title: 'Using -ity',
        text: 'The ___ of the candidate\'s response impressed the panel. They valued her ability to give straightforward and honest answers.',
        answers: ['authenticity'],
        wordBank: ['authenticity', 'authentic', 'authenticate', 'authentically'],
        xp: 50,
      },
    ],
  },

  // ── COLLOCATION CLOZE ─────────────────────────────────────────────────────
  collocationCloze: {
    p1: [
      {
        id: 'cc-p1-01',
        title: 'Everyday Actions',
        text: 'Every morning, I ___ my teeth before breakfast. Then I wash my face and get ready for school.',
        answers: ['brush'],
        wordBank: ['brush', 'wash', 'cut', 'clean'],
        xp: 20,
      },
    ],
    p2: [
      {
        id: 'cc-p2-01',
        title: 'At the Library',
        text: 'You must ___ quiet in the library. Talking loudly will disturb other people who are reading.',
        answers: ['keep'],
        wordBank: ['keep', 'make', 'stay', 'go'],
        xp: 25,
      },
    ],
    p3: [
      {
        id: 'cc-p3-01',
        title: 'Taking Care',
        text: 'The doctor advised him to ___ exercise regularly and eat a balanced diet. Doing so would help him ___ a healthy weight.',
        answers: ['take', 'maintain'],
        wordBank: ['take', 'maintain', 'do', 'keep', 'make', 'lose'],
        xp: 30,
      },
    ],
    p4: [
      {
        id: 'cc-p4-01',
        title: 'Giving a Speech',
        text: 'Before the debate, she took a deep breath to ___ her nerves. Then she stood up and ___ her speech with confidence.',
        answers: ['calm', 'delivered'],
        wordBank: ['calm', 'delivered', 'settle', 'spoke', 'ease', 'said'],
        xp: 35,
      },
    ],
    p5: [
      {
        id: 'cc-p5-01',
        title: 'Decision Making',
        text: 'After careful consideration, the board decided to ___ a decision on the matter. They needed more time to ___ all the facts before proceeding.',
        answers: ['defer', 'weigh'],
        wordBank: ['defer', 'weigh', 'make', 'consider', 'delay', 'judge'],
        xp: 40,
      },
    ],
    p6: [
      {
        id: 'cc-p6-01',
        title: 'Environmental Action',
        text: 'Governments must ___ concrete steps to ___ climate change. Failing to act now will ___ a heavy price on future generations.',
        answers: ['take', 'combat', 'impose'],
        wordBank: ['take', 'combat', 'impose', 'make', 'fight', 'place', 'do'],
        xp: 50,
      },
    ],
  },

  // ── GRAMMATICAL ROLE ──────────────────────────────────────────────────────
  grammaticalRole: {
    p1: [
      {
        id: 'gr-p1-01',
        title: 'Things Around Us',
        text: 'The ___ is on the table. It is round and red. I like to eat it for a snack.',
        answers: ['apple'],
        wordBank: ['apple', 'eat', 'red', 'happy'],
        xp: 20,
      },
    ],
    p2: [
      {
        id: 'gr-p2-01',
        title: 'Action Words',
        text: 'The children ___ in the park every evening. They love being active and playing games with their friends.',
        answers: ['play'],
        wordBank: ['play', 'playful', 'player', 'playground'],
        xp: 25,
      },
    ],
    p3: [
      {
        id: 'gr-p3-01',
        title: 'Describing People',
        text: 'The teacher is very ___ with her students. She never loses her patience, even when they make mistakes.',
        answers: ['patient'],
        wordBank: ['patient', 'patience', 'patiently', 'patients'],
        xp: 30,
      },
    ],
    p4: [
      {
        id: 'gr-p4-01',
        title: 'Making Nouns',
        text: 'The ___ of the new bridge took three years. Workers faced many challenges during the process.',
        answers: ['construction'],
        wordBank: ['construction', 'construct', 'constructive', 'constructively'],
        xp: 35,
      },
    ],
    p5: [
      {
        id: 'gr-p5-01',
        title: 'Abstract Nouns',
        text: 'The athlete\'s ___ never faltered, even when the team was losing. Her determination kept the whole team going.',
        answers: ['perseverance'],
        wordBank: ['perseverance', 'persevere', 'persevering', 'perseveringly'],
        xp: 40,
      },
    ],
    p6: [
      {
        id: 'gr-p6-01',
        title: 'Verb Forms',
        text: 'The report ___ that air quality has significantly ___ over the past decade due to stricter emissions regulations.',
        answers: ['indicates', 'improved'],
        wordBank: ['indicates', 'improved', 'indication', 'improvement', 'indicate', 'improving'],
        xp: 50,
      },
    ],
  },

  // ── CONNECTOR CLUE ────────────────────────────────────────────────────────
  connectorClue: {
    p1: [
      {
        id: 'con-p1-01',
        title: 'Then and After',
        text: 'I brushed my teeth. ___ I went to sleep. The next morning, I felt fresh and ready for school.',
        answers: ['Then'],
        wordBank: ['Then', 'But', 'So', 'Or'],
        xp: 20,
      },
    ],
    p2: [
      {
        id: 'con-p2-01',
        title: 'Because',
        text: 'Sam stayed at home ___ he was feeling ill. His mother made him some soup to help him feel better.',
        answers: ['because'],
        wordBank: ['because', 'although', 'before', 'after'],
        xp: 25,
      },
    ],
    p3: [
      {
        id: 'con-p3-01',
        title: 'However',
        text: 'The students studied very hard. ___, the exam was much more difficult than they had expected. Some of them did not do as well as they had hoped.',
        answers: ['However'],
        wordBank: ['However', 'Therefore', 'Moreover', 'Meanwhile'],
        xp: 30,
      },
    ],
    p4: [
      {
        id: 'con-p4-01',
        title: 'Therefore',
        text: 'The company had been making losses for three years. ___, the management decided to cut costs by reducing the number of employees.',
        answers: ['Therefore'],
        wordBank: ['Therefore', 'Nevertheless', 'Furthermore', 'Meanwhile'],
        xp: 35,
      },
    ],
    p5: [
      {
        id: 'con-p5-01',
        title: 'Nevertheless',
        text: 'The expedition faced severe weather conditions and equipment failures. ___, the team pressed on and reached the summit, refusing to give up.',
        answers: ['Nevertheless'],
        wordBank: ['Nevertheless', 'Consequently', 'Furthermore', 'Similarly'],
        xp: 40,
      },
    ],
    p6: [
      {
        id: 'con-p6-01',
        title: 'On the other hand',
        text: 'Proponents argue that social media fosters global connection and community building. ___, critics warn that it fuels misinformation and undermines mental health, particularly among adolescents.',
        answers: ['On the other hand'],
        wordBank: ['On the other hand', 'As a result', 'In addition', 'For instance'],
        xp: 50,
      },
    ],
  },
};
