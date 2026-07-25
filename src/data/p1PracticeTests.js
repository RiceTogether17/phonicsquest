/**
 * PhonicsQuest – Primary 1 Practice Test Papers
 *
 * Four full school-style P1 English practice papers, one per term.
 * Each paper mirrors the common Singapore P1 English Continual Assessment
 * format used by many primary schools:
 *
 *   Section A — Grammar MCQ (5 marks)
 *   Section B — Vocabulary MCQ (5 marks)
 *   Section C — Grammar Cloze (5 marks)        word box, one will be left over
 *   Section D — Vocabulary Cloze (5 marks)     word box, one or two will be left over
 *   Section E — Word Order (5 marks)           rearrange into a sentence or question
 *   Section F — Editing (5 marks, Terms 3-4)   spelling + missing punctuation
 *   Section F / G — Comprehension Open-ended (5 marks)
 *
 * Term 1 and Term 2 omit Editing (total 30 marks, 30 minutes).
 * Term 3 and Term 4 add Editing (total 35 marks, 40 minutes).
 *
 * All prompts, passages and cloze texts are ORIGINAL content written for
 * PhonicsQuest. Only the paper format and the skills tested follow the
 * school-paper convention — no question or passage is reproduced from any
 * published or school paper.
 *
 * Item shape per section:
 *   sectionA / sectionB:
 *     { q, choices: [4], answer, explain }
 *   sectionC / sectionD:
 *     { wordBank: [...], text: 'before {{1}} between {{2}}', answers: [...], leftOver: [...] }
 *   sectionE:
 *     { scrambled: [...], answer, alternates: [] }
 *   sectionF (editing):
 *     { paragraph, errors: [{ token | type:'punctuation', correction, kind }] }
 *   sectionG (comprehension):
 *     { passage, questions: [{ q, type: 'mcq' | 'short' | 'sequence', ... }] }
 *
 * UI consumers (placeholder module, future Mock Test mode) can render the
 * data progressively — Section A first, then B, and so on — and can score
 * each section independently.
 */

export const P1_PRACTICE_TEST_TERMS = Object.freeze(['T1', 'T2', 'T3', 'T4']);

export const P1_PRACTICE_TESTS = Object.freeze({
  T1: {
    id: 'p1-test-term-1',
    term: 'T1',
    level: 'P1',
    label: 'Term 1 Practice Test 1 (Basic)',
    duration: '30 minutes',
    totalMarks: 30,
    blurb: 'Term 1 foundation paper — Grammar & Vocabulary MCQ, Grammar & Vocabulary Cloze, Word Order and a short Comprehension passage.',
    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 5,
      items: [
        {
          q: 'Last week, I ______________ to the museum with my class.',
          choices: ['go', 'gone', 'went', 'am going'],
          answer: 'went',
          skill: 'simplePast',
          explain: '"Last week" is a past time marker, so we use the past tense "went".',
        },
        {
          q: 'The cat curled up and slept _____________ the mat.',
          choices: ['in', 'on', 'into', 'onto'],
          answer: 'on',
          skill: 'prepositions',
          explain: 'When something rests on a flat surface (a mat), we use "on".',
        },
        {
          q: 'I shook the bottle. There wasn’t ___________ water left inside.',
          choices: ['any', 'a few', 'many', 'a little'],
          answer: 'any',
          skill: 'quantifiers',
          explain: '"There wasn\'t" (negative) pairs with "any" for uncountable nouns like water.',
        },
        {
          q: 'I want this sticker. I do not want _________ one on the shelf.',
          choices: ['this', 'that', 'these', 'those'],
          answer: 'that',
          skill: 'demonstratives',
          explain: '"That" points to one thing further away ("on the shelf").',
        },
        {
          q: 'My cousin Ben and I are at the pool. __________ love splashing in the water.',
          choices: ['I', 'She', 'We', 'They'],
          answer: 'We',
          skill: 'pronouns',
          explain: '"Ben and I" together becomes "We".',
        },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'The parrot cracked the seed open with its strong __________.',
          choices: ['wing', 'beak', 'claws', 'feathers'],
          answer: 'beak',
          skill: 'bodyPartsAnimals',
          explain: 'Birds crack seeds with their beaks. Wings are for flying; claws are for gripping.',
        },
        {
          q: 'May I ____________ your storybook? I will return it tomorrow.',
          choices: ['get', 'lend', 'use', 'borrow'],
          answer: 'borrow',
          skill: 'verbDistinction',
          explain: 'We "borrow" something from someone and return it later (they lend it to us).',
        },
        {
          q: 'Dad picked up fresh rolls and a small cake from the ___________ downstairs.',
          choices: ['kitchen', 'bakery', 'canteen', 'restaurant'],
          answer: 'bakery',
          skill: 'placeNouns',
          explain: 'A "bakery" is the place that sells bread, rolls and cakes.',
        },
        {
          q: 'A _________ of cattle was grazing quietly in the field.',
          choices: ['herd', 'flock', 'school', 'pack'],
          answer: 'herd',
          skill: 'collectiveNouns',
          explain: 'A group of cattle is called a "herd".',
        },
        {
          q: 'Grandma was ____________ with the card I made her. She loved it very much.',
          choices: ['upset', 'excited', 'surprised', 'delighted'],
          answer: 'delighted',
          skill: 'emotionAdjectives',
          explain: '"Delighted" means very pleased — it matches "loved it very much".',
        },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. One word will be left over.',
      wordBank: ['they', 'our', 'it', 'we', 'them', 'us'],
      text:
        'On Friday, my class visited the school garden. Before the visit, our teacher packed some seeds for {{1}} to plant. ' +
        'She also carried {{2}} watering cans down from the classroom. ' +
        'It began to drizzle while {{3}} were planting the seeds. We sheltered under the big canvas sheet beside the shed. ' +
        '{{4}} kept us dry until the rain passed. The seedlings from last month were not so lucky. ' +
        '{{5}} had no cover and got soaked in the rain.',
      answers: ['us', 'our', 'we', 'It', 'They'],
      leftOver: ['them'],
      skill: 'pronouns',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. One word will be left over.',
      wordBank: ['wear', 'know', 'got', 'way', 'put', 'woke'],
      text:
        'A noisy thunderstorm kept Marcus up half the night. When he {{1}} up the next morning, the sun was already high in the sky! ' +
        'Sports camp was starting in twenty minutes. ' +
        'Marcus splashed water on his face and {{2}} on his T-shirt. There was no time for toast. ' +
        'He grabbed his cap, hopped on his bicycle and pedalled all the {{3}} to the community centre. ' +
        'When he arrived, his friends started giggling. Marcus did not {{4}} what was so funny. ' +
        'Then his coach pointed at his feet and reminded him to {{5}} matching shoes next time. ' +
        'Marcus looked down — he had one sneaker and one sandal on!',
      answers: ['woke', 'put', 'way', 'know', 'wear'],
      leftOver: ['got'],
      skill: 'collocationCloze',
    },
    sectionE: {
      title: 'Section E: Word Order',
      marks: 5,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['seeds', 'we', 'the', 'planted', 'in', 'garden'], answer: 'We planted seeds in the garden.' },
        { scrambled: ['the', 'way', 'you', 'know', 'do', 'hall', 'to', 'the'], answer: 'Do you know the way to the hall?' },
        { scrambled: ['near', 'that', 'Ravi', 'the', 'sits', 'window', 'at', 'desk'], answer: 'Ravi sits at that desk near the window.' },
        { scrambled: ['for', 'Mei', 'lunch', 'had', 'noodles'], answer: 'Mei had noodles for lunch.' },
        { scrambled: ['the', 'tallest', 'in', 'our', 'town', 'building', 'is', 'which'], answer: 'Which is the tallest building in our town?' },
      ],
    },
    sectionG: {
      title: 'Section F: Comprehension Open-ended',
      marks: 5,
      passage:
        'Jun lived with his parents and his little sister. In the evenings, the flat often felt quiet. His parents were busy clearing up after dinner, and his sister was too small to play any games.\n\n' +
        'Luckily, Jun’s next-door neighbour, Uncle Salim, kept a little balcony garden. Whenever Jun was free, he would help Uncle Salim water the chilli plants and count the new flowers. Sometimes, they would repot seedlings together.\n\n' +
        'One day, Jun heard some sad news. Uncle Salim was moving to a new flat on the other side of the island. When Jun heard that, he lost his appetite and moped around the house for days.\n\n' +
        'Before Uncle Salim left, he gave Jun one of his chilli plants and told him to visit any time. Jun promised to look after the plant and to tell Uncle Salim about every new flower.',
      questions: [
        {
          type: 'mcq',
          marks: 1,
          q: 'How many people were there in Jun’s family?',
          choices: ['two', 'three', 'four', 'five'],
          answer: 'four',
          explain: 'Jun lived with his parents and his little sister — Jun, two parents and one sister make four people.',
        },
        {
          type: 'short',
          marks: 2,
          q: 'What would Jun and Uncle Salim do together?',
          model: 'They would water the chilli plants, count the new flowers, and sometimes repot seedlings together.',
          keywords: ['water', 'flowers'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What "sad news" (paragraph 3) did Jun hear?',
          model: 'He heard that Uncle Salim was moving to a new flat on the other side of the island.',
          keywords: ['Uncle Salim', 'moving'],
        },
        {
          type: 'sequence',
          marks: 1,
          q: 'Write the numbers 1, 2 and 3 to arrange the events in the correct sequence.',
          options: [
            'Jun lost his appetite.',
            'Jun promised to look after the chilli plant.',
            'Jun and Uncle Salim would garden together.',
          ],
          answer: [2, 3, 1],
        },
      ],
    },
  },

  T2: {
    id: 'p1-test-term-2',
    term: 'T2',
    level: 'P1',
    label: 'Term 2 Practice Test 2',
    duration: '30 minutes',
    totalMarks: 30,
    blurb: 'Term 2 paper — continuing P1 grammar and vocabulary, with a passage about learning to swim.',
    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 5,
      items: [
        { q: 'Last evening, Kavi ____________ his scooter along the park connector.', choices: ['ride', 'rode', 'rides', 'is riding'], answer: 'rode', skill: 'simplePast', explain: '"Last evening" signals past tense; the irregular past of "ride" is "rode".' },
        { q: 'The coin slipped from my hand and dropped _____________ the drain.', choices: ['to', 'on', 'into', 'over'], answer: 'into', skill: 'prepositions', explain: 'When something falls and goes inside a container or hole, we use "into".' },
        { q: 'There is no _____________ rice left after the big family dinner.', choices: ['any', 'much', 'many', 'more'], answer: 'more', skill: 'quantifiers', explain: '"No more" means none is left.' },
        { q: '"__________ is my seat," said Lena as she patted the chair she was sitting on.', choices: ['This', 'That', 'These', 'Those'], answer: 'This', skill: 'demonstratives', explain: 'The chair is right where she is — close to her — so we use "This" (singular, near).' },
        { q: '"Don’t take that umbrella. It is __________," Raj said quickly.', choices: ['me', 'my', 'mine', 'myself'], answer: 'mine', skill: 'possessives', explain: '"Mine" stands alone without a noun after it — it shows ownership.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        { q: 'The lion shook its golden __________ as it rose from the grass.', choices: ['fur', 'mane', 'fleece', 'wool'], answer: 'mane', skill: 'bodyPartsAnimals', explain: 'The "mane" is the long hair around a lion\'s (or horse\'s) neck.' },
        { q: 'I _________ my pen pal a postcard. It reached her letter box a week later.', choices: ['fetched', 'took', 'sent', 'picked'], answer: 'sent', skill: 'verbDistinction', explain: 'We "send" a postcard through the post; it arrived in her letter box.' },
        { q: 'Ben had a bad cough, so Mum took him to the ___________ near our block to see a doctor.', choices: ['shop', 'clinic', 'hospital', 'sickbay'], answer: 'clinic', skill: 'placeNouns', explain: 'A "clinic" is a small place where a doctor sees patients for everyday illnesses.' },
        { q: 'A / an ___________ of monkeys swung through the trees at the reservoir.', choices: ['pack', 'army', 'flock', 'troop'], answer: 'troop', skill: 'collectiveNouns', explain: 'A group of monkeys is called a "troop".' },
        { q: 'I was _____________ by the enormous sandcastle. It looked like a real fort!', choices: ['frightened', 'delighted', 'angry', 'amazed'], answer: 'amazed', skill: 'emotionAdjectives', explain: '"Amazed" means very surprised in a good way — fits "looked like a real fort".' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. One word will be left over.',
      wordBank: ['they', 'we', 'our', 'them', 'us', 'it'],
      text:
        'Last weekend, Dad, my sister Rani and I made paper lanterns at home. Dad showed both of {{1}} how to fold the coloured paper. ' +
        'First, {{2}} cut out all the shapes carefully. Once {{3}} were ready, we glued the edges and tied a string to each lantern. ' +
        'When the biggest lantern was done, we hung {{4}} up by the window. ' +
        'After the rest were finished, we gave {{5}} to our neighbours. Everyone loved the lanterns!',
      answers: ['us', 'we', 'they', 'it', 'them'],
      leftOver: ['our'],
      skill: 'pronouns',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. One word will be left over.',
      wordBank: ['counted', 'wake', 'tried', 'close', 'drinking', 'awake'],
      text:
        'Mia’s class trip to the zoo was tomorrow. She was so excited that however hard she {{1}}, she could not fall asleep! ' +
        'Thinking about the animals kept her {{2}}. ' +
        'First, she tried {{3}} a mug of warm milk. Next, she tried counting the glow stars on her ceiling. She {{4}} till one hundred and ninety-nine before she gave up. ' +
        'Just as her eyes began to {{5}}, the birds outside started to sing. Poor Mia hardly slept a wink all night!',
      answers: ['tried', 'awake', 'drinking', 'counted', 'close'],
      leftOver: ['wake'],
      skill: 'collocationCloze',
    },
    sectionE: {
      title: 'Section E: Word Order',
      marks: 5,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['her', 'quiz', 'Sara', 'did', 'in', 'well', 'spelling'], answer: 'Sara did well in her spelling quiz.' },
        { scrambled: ['this', 'ticket', 'does', 'cost', 'how', 'much'], answer: 'How much does this ticket cost?' },
        { scrambled: ['playing', 'this', 'park', 'at', 'we', 'like'], answer: 'We like playing at this park.' },
        { scrambled: ['bus', 'every', 'morning', 'to', 'I', 'ride', 'school', 'the'], answer: 'I ride the bus to school every morning.' },
        { scrambled: ['do', 'you', 'which', 'song', 'the', 'like', 'best'], answer: 'Which song do you like the best?' },
      ],
    },
    sectionG: {
      title: 'Section F: Comprehension Open-ended',
      marks: 5,
      passage:
        'Devi dreaded her swimming lessons. She trained at the pool every Saturday. Her coach was very strict with her. He made Devi repeat the same kick drill again and again until it was smooth.\n\n' +
        'One afternoon, Devi went to the beach and watched a lifeguard glide through the waves. As Devi watched, she found herself moving her arms along with him.\n\n' +
        'A small crowd gathered to watch the lifeguard train. Whenever he finished a lap, the onlookers cheered.\n\n' +
        'Devi wanted to swim as well as the lifeguard. From then on, she practised her strokes eagerly and regularly. Soon, she swam so well that she was picked for the school relay team.',
      questions: [
        { type: 'mcq', marks: 1, q: 'How often did Devi have swimming lessons?', choices: ['every day', 'once a week', 'twice a week', 'once a month'], answer: 'once a week', explain: 'Devi trained at the pool "every Saturday" — that is once a week.' },
        { type: 'short', marks: 1, q: 'In what way was her coach "very strict" (paragraph 1) with Devi?', model: 'He made Devi repeat the same kick drill again and again until it was smooth.', keywords: ['repeat', 'drill'] },
        { type: 'short', marks: 1, q: 'What did Devi do as she watched the lifeguard?', model: 'She found herself moving her arms along with him.', keywords: ['arms'] },
        {
          type: 'word-meaning',
          marks: 1,
          q: 'Circle the word in the sentence below that has the same meaning as "often".',
          sentence: 'From then on, she practised her strokes eagerly and regularly.',
          choices: ['eagerly', 'regularly'],
          answer: 'regularly',
          explain: '"Regularly" means happening often or at regular times.',
        },
        {
          type: 'sequence',
          marks: 1,
          q: 'Arrange the events in the correct sequence.',
          options: ['Devi was picked for the school relay team.', 'The onlookers cheered.', 'Devi went to the beach.'],
          answer: [3, 2, 1],
        },
      ],
    },
  },

  T3: {
    id: 'p1-test-term-3',
    term: 'T3',
    level: 'P1',
    label: 'Term 3 Practice Test 3',
    duration: '40 minutes',
    totalMarks: 35,
    blurb: 'Term 3 paper — adds Editing for the first time. Comprehension passage about Mabel and her echo.',
    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 5,
      items: [
        { q: 'Don’t drink the milk. ____________ has gone sour.', choices: ['It', 'He', 'She', 'They'], answer: 'It', skill: 'pronouns', explain: 'We use "It" to refer to a thing like milk.' },
        { q: 'The school bus leaves _____________ seven o’clock sharp every morning.', choices: ['in', 'on', 'at', 'by'], answer: 'at', skill: 'prepositions', explain: 'We use "at" before a specific clock time.' },
        { q: 'After the long hike, Grandpa finally had _____________ rest under the shady tree.', choices: ['any', 'some', 'little', 'few'], answer: 'some', skill: 'quantifiers', explain: 'In a positive sentence with an uncountable noun (rest), we use "some".' },
        { q: '"__________ did you fold this paper crane? Please teach me," begged Lily.', choices: ['How', 'When', 'What', 'Where'], answer: 'How', skill: 'whQuestions', explain: '"How" asks about the way or method — Lily wants to learn the steps.' },
        { q: '"That was the __________ storm we have had in years!" said the old fisherman.', choices: ['bad', 'worse', 'most bad', 'worst'], answer: 'worst', skill: 'superlatives', explain: 'For three or more, the superlative form of "bad" is "worst".' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        { q: 'Camels can travel for days across the hot, dry __________ without water.', choices: ['forest', 'desert', 'jungle', 'reservoir'], answer: 'desert', skill: 'placeNouns', explain: 'A "desert" is a hot, dry place where few plants grow.' },
        { q: 'Whenever baby Ken misses his afternoon nap, he becomes ___________ and fusses at everyone.', choices: ['jolly', 'lazy', 'grumpy', 'miserable'], answer: 'grumpy', skill: 'emotionAdjectives', explain: '"Grumpy" describes a bad mood from being tired or hungry.' },
        { q: 'The puppy ___________ its tail happily whenever the front gate opens.', choices: ['wags', 'flaps', 'waves', 'shakes'], answer: 'wags', skill: 'actionVerbs', explain: 'Dogs "wag" their tails when they are happy.' },
        { q: 'At dawn, I can hear sparrows ______________ in the trees along our street.', choices: ['humming', 'chirping', 'cheeping', 'screeching'], answer: 'chirping', skill: 'soundVerbs', explain: 'Birds make a short, cheerful sound called "chirping".' },
        { q: 'Devi ____________ the sticky table with a damp cloth.', choices: ['rubbed', 'wiped', 'mopped', 'brushed'], answer: 'wiped', skill: 'actionVerbs', explain: 'We "wipe" a table with a cloth to clean it.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. You may use the words more than once.',
      wordBank: ['a', 'an', 'the'],
      reuseAllowed: true,
      text:
        'Little Omar toddled into the garage. He picked up {{1}} old bottle from the shelf. Inside it was {{2}} marble. ' +
        'He shook the bottle hard to get it out. ' +
        'Just then, his big brother came in to fetch {{3}} pump he had left by the door. He saw Omar tipping the bottle towards his open mouth. ' +
        'He took the bottle gently out of {{4}} little boy’s hands and gave it {{5}} few firm taps. The marble rolled out safely onto the mat.',
      answers: ['an', 'a', 'the', 'the', 'a'],
      leftOver: [],
      skill: 'articles',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['crossing', 'froze', 'have', 'stopped', 'safety', 'danger', 'protection'],
      text:
        'Arif often daydreamed about being a hero. More than anything, he wanted to {{1}} sharp eyes and quick feet. ' +
        'He hoped to be someone who could keep others out of {{2}}. ' +
        'One evening, Arif was {{3}} the field when a runaway kite string tangled around a toddler near the pond. The frightened toddler {{4}} at the water’s edge. ' +
        'Arif sprinted over, untangled the string and led him back to {{5}} beside his mother. ' +
        'That day, Arif learnt that you do not need a cape to help someone.',
      answers: ['have', 'danger', 'crossing', 'froze', 'safety'],
      leftOver: ['stopped', 'protection'],
      skill: 'collocationCloze',
    },
    sectionE: {
      title: 'Section E: Word Order',
      marks: 5,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['chocolate', 'cake', 'a', 'huge', 'Priya', 'baked'], answer: 'Priya baked a huge chocolate cake.' },
        { scrambled: ['visit', 'new', 'when', 'the', 'zoo', 'we', 'can'], answer: 'When can we visit the new zoo?' },
        { scrambled: ['chased', 'the', 'cat', 'by', 'was', 'the', 'mouse'], answer: 'The mouse was chased by the cat.' },
        { scrambled: ['start', 'would', 'you', 'now', 'to', 'your', 'like', 'homework'], answer: 'Would you like to start your homework now?' },
        { scrambled: ['was', 'off', 'it', 'were', 'dark', 'the', 'lights', 'as'], answer: 'It was dark as the lights were off.' },
      ],
    },
    sectionF: {
      title: 'Section F: Editing',
      marks: 5,
      instructions: 'Each underlined word contains a spelling mistake. A wrong or missing punctuation mark is indicated by a circle. Put the correct punctuation mark or word in the box.',
      paragraph:
        'Ravi was going to read his poem aloud at assembly for the first time. He felt very {{1:nervus}}. His hands would not stop {{2:shakeing}}. ' +
        'When he stepped up to the microphone{{3:o}} Ravi looked out at all the {{4:childern}} in the hall and forgot his first line. ' +
        'Then he took a deep breath, found the words, and read all the way to the end. ' +
        'Everyone clapped and cheered for him{{5:o}} Ravi beamed with pride at what he had done.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'nervus', correction: 'nervous', explain: 'The correct spelling is "nervous".' },
        { num: 2, kind: 'spelling', wrong: 'shakeing', correction: 'shaking', explain: 'Drop the silent e before adding -ing: "shaking".' },
        { num: 3, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after the time clause "When he stepped up to the microphone".' },
        { num: 4, kind: 'spelling', wrong: 'childern', correction: 'children', explain: 'The correct spelling is "children".' },
        { num: 5, kind: 'punctuation', wrong: '', correction: '.', explain: 'A full stop ends the sentence before "Ravi beamed with pride".' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended',
      marks: 5,
      passage:
        'Mabel loved rainy days, not just for the puddles, but for her favourite game with Echo. Whenever she shouted under the empty void deck, Echo shouted right back. One afternoon, Mabel had a plan. "Today I’m going to find Echo!" she announced.\n\n' +
        'She tiptoed behind the biggest pillar and yelled, "Hello!" Then she leapt around it. Nobody was there. Echo’s voice bounced away down the corridor. Mabel hunted behind the letter boxes and even peeked into the stairwell, but she found no one.\n\n' +
        'Tired out, Mabel sat down on a step to catch her breath. She called out one more soft "hello", and the friendly voice floated straight back to her. Mabel giggled. Maybe finding Echo wasn’t the point. The best part was having a playmate who always answered on a rainy afternoon.',
      questions: [
        { type: 'mcq', marks: 1, q: 'Mabel loved rainy days as she ________________________.', choices: ['liked the puddles', 'enjoyed shouting under the void deck', 'liked the puddles and playing her game with Echo', 'enjoyed splashing in the puddles with Echo'], answer: 'liked the puddles and playing her game with Echo', explain: 'The passage says she loved rainy days "not just for the puddles, but for her favourite game with Echo".' },
        { type: 'short', marks: 1, q: 'What does "the friendly voice" in paragraph 3 refer to?', model: 'It refers to Echo (Mabel’s own echo under the void deck).', keywords: ['Echo'] },
        { type: 'short', marks: 1, q: 'Why could Mabel not find Echo?', model: 'Echo was only her own voice bouncing back, so there was no one to find.', keywords: ['voice'] },
        { type: 'short', marks: 1, q: 'Which three-word phrase in paragraph 3 tells you that Mabel stopped to rest?', model: 'catch her breath', keywords: ['catch her breath'] },
        {
          type: 'sequence',
          marks: 1,
          q: 'Arrange the events in the correct sequence.',
          options: ['Mabel heard the friendly voice float back to her.', 'Mabel decided to find Echo.', 'Echo’s voice bounced away down the corridor.'],
          answer: [3, 1, 2],
        },
      ],
    },
  },

  T4: {
    id: 'p1-test-term-4',
    term: 'T4',
    level: 'P1',
    label: 'Term 4 Practice Test 4',
    duration: '40 minutes',
    totalMarks: 35,
    blurb: 'Term 4 paper — full P1 format with Editing and a magical seashell Comprehension passage.',
    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 5,
      items: [
        { q: 'The sun was blazing, so we rested ____________ the shade of the old rain tree.', choices: ['on', 'in', 'with', 'below'], answer: 'in', skill: 'prepositions', explain: 'We rest "in the shade" — a fixed expression for being inside a shaded area.' },
        { q: 'Nadia wanted to post a letter, ____________ she walked to the post office.', choices: ['and', 'but', 'so', 'when'], answer: 'so', skill: 'connectors', explain: '"So" shows a result — she walked there because she wanted to post a letter.' },
        { q: 'When Grandma was a girl, she _____________ across this very stream to get to school.', choices: ['swim', 'swims', 'swum', 'swam'], answer: 'swam', skill: 'simplePast', explain: 'This happened long ago, so we use the simple past "swam".' },
        { q: '"__________ are you feeling after your fall? I hope it does not hurt any more," asked the school nurse.', choices: ['How', 'Why', 'What', 'Which'], answer: 'How', skill: 'whQuestions', explain: '"How are you feeling?" is the standard way to ask about someone\'s wellbeing.' },
        { q: 'There wasn’t _____________ paint left in the tin. I could only cover half the wall.', choices: ['much', 'some', 'little', 'few'], answer: 'much', skill: 'quantifiers', explain: 'With negative sentences and uncountable nouns (paint), we use "much".' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        { q: 'When the fire alarm rang, everyone hurried to the nearest _____________ of the cinema.', choices: ['entrance', 'lobby', 'corridor', 'exit'], answer: 'exit', skill: 'placeNouns', explain: 'You leave a building through the "exit", especially in an emergency.' },
        { q: 'Nobody noticed the fox ___________ into the henhouse after midnight.', choices: ['crawling', 'sneaking', 'strolling', 'marching'], answer: 'sneaking', skill: 'actionVerbs', explain: '"Sneaking" means moving quietly so no one notices.' },
        { q: 'A ___________ of monkeys followed the hikers along the nature trail.', choices: ['school', 'pack', 'flock', 'troop'], answer: 'troop', skill: 'collectiveNouns', explain: 'A group of monkeys is called a "troop".' },
        { q: 'Late at night, we heard an owl ______________ from the old rain tree.', choices: ['screech', 'chirp', 'howl', 'crow'], answer: 'screech', skill: 'soundVerbs', explain: 'Owls "screech" — a sharp, piercing sound.' },
        { q: 'Zul was so hungry that he polished off a whole ____________ of yoghurt by himself.', choices: ['carton', 'tub', 'container', 'box'], answer: 'tub', skill: 'collectiveNouns', explain: 'Yoghurt and ice-cream usually come in a "tub" — a round, wide container.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. One word will be left over.',
      wordBank: ['above', 'at', 'with', 'across', 'on', 'to', 'around'],
      text:
        'At the beach, a group of cousins played happily together. Some raced {{1}} the wet sand, while others flew kites that soared high {{2}} the waves. ' +
        'One girl knelt beside a rock pool, scooping water {{3}} a small red pail. Her brother pedalled his tricycle {{4}} the picnic mats, ringing his bell as he went. ' +
        'Nearby, a seagull squawked {{5}} anyone who came too close to its perch. Laughter drifted along the shore all afternoon.',
      answers: ['across', 'above', 'with', 'around', 'at'],
      leftOver: ['on', 'to'],
      skill: 'prepositions',
    },
    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. Two words will be left over.',
      wordBank: ['climbed', 'wondered', 'safe', 'stuck', 'fixed', 'call', 'thought'],
      text:
        'Hana stood at the foot of the mango tree, staring up anxiously. Her kite was {{1}} among the highest branches. ' +
        'She had tried to {{2}} her brother for help, but he was still at football practice. ' +
        'She walked round and round the trunk and {{3}} how to get it back. ' +
        'Just then, her neighbour, Mdm Chia, came by carrying a long pole. "Shall we try together?" she offered. Hana beamed. ' +
        'Mdm Chia held the ladder steady while Hana carefully {{4}} up a few rungs and nudged the kite free with the pole. Soon the kite was {{5}} in her hands, ready to fly again!',
      answers: ['stuck', 'call', 'wondered', 'climbed', 'safe'],
      leftOver: ['fixed', 'thought'],
      skill: 'collocationCloze',
    },
    sectionE: {
      title: 'Section E: Word Order',
      marks: 5,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['the', 'dishes', 'Omar', 'dirty', 'wash', 'helped', 'me'], answer: 'Omar helped me wash the dirty dishes.' },
        { scrambled: ['walk', 'far', 'how', 'do', 'we', 'to', 'have'], answer: 'How far do we have to walk?' },
        { scrambled: ['flying', 'each', 'other', 'they', 'enjoy', 'with', 'kites'], answer: 'They enjoy flying kites with each other.' },
        { scrambled: ['eat', 'would', 'you', 'now', 'or', 'later', 'like', 'to'], answer: 'Would you like to eat now or later?' },
        { scrambled: ['Nina', 'at', 'swims', 'week', 'every', 'the', 'community', 'pool'], answer: 'Nina swims at the community pool every week.' },
      ],
    },
    sectionF: {
      title: 'Section F: Editing',
      marks: 5,
      instructions: 'Each underlined word contains a spelling mistake. A wrong or missing punctuation mark is indicated by a circle. Put the correct punctuation mark or word in the box.',
      paragraph:
        'Bella treasured her sparkly blue kite more than anything. She flew it every weekend. ' +
        'One morning, it {{1:vanishd}}! Bella hunted behind the sofa{{2:o}} inside the storeroom, and even out on the balcony, but found nothing. ' +
        'Feeling glum, Bella flopped onto her beanbag. {{3:Sudenly}}, her baby brother waddled in. ' +
        'Tucked under his arm was Bella{{4:o}}s kite, crumpled and sticky but whole! ' +
        'Bella laughed and {{5:realied}} her brother must have taken it for a blanket.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'vanishd', correction: 'vanished', explain: 'The correct spelling is "vanished".' },
        { num: 2, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed between items in the list of places.' },
        { num: 3, kind: 'spelling', wrong: 'Sudenly', correction: 'Suddenly', explain: 'The correct spelling is "Suddenly" (double d).' },
        { num: 4, kind: 'punctuation', wrong: '', correction: '’', explain: 'An apostrophe is needed to show possession: "Bella’s kite".' },
        { num: 5, kind: 'spelling', wrong: 'realied', correction: 'realised', explain: 'The correct spelling is "realised".' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended',
      marks: 5,
      passage:
        'Ivan was exploring the beach near his grandmother’s kampung when he spotted a smooth spiral seashell half-buried in the sand. When he lifted it to his ear, a gentle voice hummed, "Make a wish, but choose kindly."\n\n' +
        'Thrilled, Ivan shut his eyes and wished for the thing he wanted most: to understand the sea creatures.\n\n' +
        'At once, the shoreline burst into chatter! A crab clicked, "Mind my house!" and a seagull cried, "Fine breeze today!"\n\n' +
        'Ivan laughed in amazement. He spent the whole morning trading stories with starfish, minnows and one grumpy old turtle. They shared wonderful secrets about the tides that he had never heard before.\n\n' +
        'When it was time for lunch, Ivan thanked the seashell, grateful for all the new friends he had made along the shore.',
      questions: [
        { type: 'mcq', marks: 1, q: 'The seashell was magical because ________________________.', choices: ['it was smooth and spiral', 'it was half-buried in the sand', 'it spoke to Ivan', 'it was near the kampung'], answer: 'it spoke to Ivan', explain: 'The seashell hummed a message to Ivan — a magical thing for a shell to do.' },
        { type: 'short', marks: 1, q: 'What did Ivan wish for?', model: 'He wished that he could understand the sea creatures.', keywords: ['understand', 'sea creatures'] },
        { type: 'short', marks: 1, q: 'Which word in paragraph 4 is similar to "surprise"?', model: 'amazement', keywords: ['amazement'] },
        { type: 'short', marks: 1, q: 'Why was Ivan grateful to the seashell?', model: 'The seashell had granted his wish to understand the sea creatures, so he made many new friends along the shore.', keywords: ['new friends', 'wish'] },
        {
          type: 'sequence',
          marks: 1,
          q: 'Arrange the events in the correct sequence.',
          options: ['A crab spoke to Ivan.', 'The sea creatures shared secrets about the tides.', 'Ivan made a wish.'],
          answer: [2, 3, 1],
        },
      ],
    },
  },
});

/**
 * Return a flat array of every P1 practice test.
 */
export function getP1PracticeTests() {
  return P1_PRACTICE_TEST_TERMS.map(term => P1_PRACTICE_TESTS[term]);
}

/**
 * Look up a practice test by term key.
 * @param {'T1'|'T2'|'T3'|'T4'} term
 */
export function getP1PracticeTest(term) {
  return P1_PRACTICE_TESTS[term] || null;
}

/**
 * Validate the practice test bank.  Returns a list of issue strings (empty = OK).
 * Used by unit tests so contributors get a precise failure message when a
 * paper is malformed.
 */
export function validateP1PracticeTests(bank = P1_PRACTICE_TESTS) {
  const issues = [];
  const blankRe = /\{\{(\d+)\}\}/g;
  const editingBlankRe = /\{\{(\d+):[^}]*\}\}/g;

  for (const term of P1_PRACTICE_TEST_TERMS) {
    const test = bank?.[term];
    const tag = `P1/${term}`;
    if (!test) { issues.push(`${tag}: missing`); continue; }
    if (test.level !== 'P1') issues.push(`${tag}: level must be P1`);
    if (test.term !== term) issues.push(`${tag}: term must be ${term}`);
    if (typeof test.label !== 'string' || !test.label.trim()) issues.push(`${tag}: missing label`);

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
      if (!reuseAllowed) {
        const answersLower = (section.answers || []).map(a => String(a).toLowerCase());
        const dupes = answersLower.filter((a, i) => answersLower.indexOf(a) !== i);
        if (dupes.length) issues.push(`${tag}/${key}: duplicate answers ${dupes.join(',')} but reuseAllowed=false`);
      }
    }

    const sE = test.sectionE;
    if (!sE || !Array.isArray(sE.items) || sE.items.length !== 5) {
      issues.push(`${tag}/sectionE: must have 5 word-order items`);
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
          issues.push(`${tag}/sectionE: scrambled words do not form the answer (${item.answer})`);
        }
      }
    }

    if (term === 'T3' || term === 'T4') {
      const sF = test.sectionF;
      if (!sF || typeof sF.paragraph !== 'string') issues.push(`${tag}/sectionF: missing paragraph`);
      else {
        const blanks = [...sF.paragraph.matchAll(editingBlankRe)].map(m => Number(m[1]));
        if (blanks.length !== 5) issues.push(`${tag}/sectionF: expected 5 editing blanks, found ${blanks.length}`);
        if (!Array.isArray(sF.errors) || sF.errors.length !== 5) issues.push(`${tag}/sectionF: expected 5 errors`);
      }
    }

    const sG = test.sectionG;
    if (!sG || typeof sG.passage !== 'string' || !sG.passage.trim()) issues.push(`${tag}/sectionG: missing passage`);
    if (!Array.isArray(sG?.questions) || sG.questions.length < 4) issues.push(`${tag}/sectionG: needs at least 4 questions`);

    const sectionMarksTotal = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE']
      .map(k => test[k]?.marks || 0)
      .reduce((a, b) => a + b, 0)
      + (test.sectionF?.marks || 0)
      + (test.sectionG?.marks || 0);
    if (sectionMarksTotal !== test.totalMarks) {
      issues.push(`${tag}: section marks sum to ${sectionMarksTotal} but totalMarks=${test.totalMarks}`);
    }
  }

  return issues;
}
