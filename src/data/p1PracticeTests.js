/**
 * PhonicsQuest – Primary 1 Practice Test Papers
 *
 * Four full school-style P1 English practice papers, one per term.
 * Each paper mirrors the real Singapore P1 English Continual Assessment
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
 * Each section's items keep the exact prompts/answers from the reference
 * student copy so the experience matches the printed school paper.
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
          q: 'Yesterday, I ______________ to the library to borrow books.',
          choices: ['go', 'gone', 'went', 'am going'],
          answer: 'went',
          skill: 'simplePast',
          explain: '"Yesterday" is a past time marker, so we use the past tense "went".',
        },
        {
          q: 'Gavin fell asleep _____________ the sofa.',
          choices: ['in', 'on', 'into', 'onto'],
          answer: 'on',
          skill: 'prepositions',
          explain: 'When we sleep resting on a surface (a sofa), we use "on".',
        },
        {
          q: 'I looked into the refrigerator. There wasn’t ___________ juice left.',
          choices: ['any', 'a few', 'many', 'a little'],
          answer: 'any',
          skill: 'quantifiers',
          explain: '"There wasn\'t" (negative) pairs with "any" for uncountable nouns like juice.',
        },
        {
          q: 'I like this toy. I do not like _________ one over there.',
          choices: ['this', 'that', 'these', 'those'],
          answer: 'that',
          skill: 'demonstratives',
          explain: '"That" points to one thing further away ("over there").',
        },
        {
          q: 'My friend Kim and I are at the playground. __________ enjoy playing on the seesaw.',
          choices: ['I', 'She', 'We', 'They'],
          answer: 'We',
          skill: 'pronouns',
          explain: '"Kim and I" together becomes "We".',
        },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'The bird dipped its __________ into the pond to drink water.',
          choices: ['wing', 'beak', 'claws', 'feathers'],
          answer: 'beak',
          skill: 'bodyPartsAnimals',
          explain: 'Birds drink with their beaks. Wings are for flying; claws are for gripping.',
        },
        {
          q: 'May I ____________ a colour pencil from you?',
          choices: ['get', 'lend', 'use', 'borrow'],
          answer: 'borrow',
          skill: 'verbDistinction',
          explain: 'We "borrow" something from someone (we lend something to them).',
        },
        {
          q: 'Mrs. Lee bought a loaf of bread and some buns from the ___________.',
          choices: ['kitchen', 'bakery', 'canteen', 'restaurant'],
          answer: 'bakery',
          skill: 'placeNouns',
          explain: 'A "bakery" is the place that sells bread and buns.',
        },
        {
          q: 'We saw a _________ of elephants in the jungle.',
          choices: ['herd', 'flock', 'school', 'pack'],
          answer: 'herd',
          skill: 'collectiveNouns',
          explain: 'A group of elephants is called a "herd".',
        },
        {
          q: 'Alison was ____________ with her gift. She loved it very much.',
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
        'On Sunday, my family and I had a picnic at the beach. Before we left the house, Mother prepared some food for {{1}} to eat. ' +
        'Father also bought {{2}} favourite drinks from the supermarket for the picnic. ' +
        'It was very sunny when {{3}} were at the beach. We sat under the shade of a large tree. ' +
        '{{4}} protected us from the heat of the sun. Other beach-goers were not so lucky. ' +
        '{{5}} could not find any shade and had to sit in the sun.',
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
        'When the alarm clock rang, Jessie did not wake up and continued sleeping. When she {{1}} up, she was shocked! ' +
        'School was going to start in half an hour. ' +
        'Jessie jumped out of bed and {{2}} on her uniform. There was no time for breakfast. ' +
        'She grabbed her schoolbag, dashed out of the door and ran all the {{3}} to school. ' +
        'All around her, everyone was pointing and laughing at her. Jessie did not {{4}} why people were staring at her. ' +
        'Her friend Hannah told her she had forgotten to {{5}} her school shoes. ' +
        'Instead, she had worn her bedroom slippers to school. Jessie was very embarrassed.',
      answers: ['woke', 'put', 'way', 'know', 'wear'],
      leftOver: ['got'],
      skill: 'collocationCloze',
    },
    sectionE: {
      title: 'Section E: Word Order',
      marks: 5,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['made', 'I', 'in', 'mistakes', 'my', 'test'], answer: 'I made mistakes in my test.' },
        { scrambled: ['this', 'puzzle', 'to', 'the', 'answer', 'know', 'do', 'you'], answer: 'Do you know the answer to this puzzle?' },
        { scrambled: ['that', 'house', 'lives', 'over', 'there', 'Ann', 'in'], answer: 'Ann lives in that house over there.' },
        { scrambled: ['breakfast', 'Tony', 'for', 'cereal', 'had'], answer: 'Tony had cereal for breakfast.' },
        { scrambled: ['the', 'largest', 'world', 'in', 'the', 'animal', 'is', 'which'], answer: 'Which is the largest animal in the world?' },
      ],
    },
    sectionG: {
      title: 'Section F: Comprehension Open-ended',
      marks: 5,
      passage:
        'Sarah was the only child in her family. At times, she would feel very lonely as there was no one at home to play with her. Her parents were always busy working.\n\n' +
        'Luckily, Sarah had a next-door neighbour named Emma who was the same age as her. Whenever both girls were free, they would go to each other’s homes to play computer games. Sometimes, they would also go to the playground nearby.\n\n' +
        'One day, Sarah received bad news. Her friend Emma and her family were moving away. When Sarah heard that, she refused to eat or sleep for a few days.\n\n' +
        'Before Emma left for her new home, she invited Sarah to visit her. Sarah said that she would do so. Both girls made a promise that they would remain friends forever.',
      questions: [
        {
          type: 'mcq',
          marks: 1,
          q: 'How many people were there in Sarah’s family?',
          choices: ['two', 'three', 'four', 'five'],
          answer: 'three',
          explain: 'Sarah is the only child, so the family has Sarah and her two parents — three people.',
        },
        {
          type: 'short',
          marks: 2,
          q: 'What would Sarah and Emma do together?',
          model: 'They would go to each other’s homes to play computer games, and sometimes go to the playground nearby.',
          keywords: ['computer games', 'playground'],
        },
        {
          type: 'short',
          marks: 1,
          q: 'What "bad news" (paragraph 3) did Sarah receive?',
          model: 'She received news that her friend Emma and her family were moving away.',
          keywords: ['Emma', 'moving away'],
        },
        {
          type: 'sequence',
          marks: 1,
          q: 'Write the numbers 1, 2 and 3 to arrange the events in the correct sequence.',
          options: [
            'Sarah could not eat or sleep.',
            'Both Sarah and Emma promised to always be friends.',
            'Both Sarah and Emma would play together.',
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
    blurb: 'Term 2 paper — continuing P1 grammar and vocabulary, with a passage about practising the piano.',
    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 5,
      items: [
        { q: 'Yesterday, Jean ____________ her bicycle to the park.', choices: ['ride', 'rode', 'rides', 'is riding'], answer: 'rode', skill: 'simplePast', explain: '"Yesterday" signals past tense; the irregular past of "ride" is "rode".' },
        { q: 'The ball rolled away and fell _____________ a drain.', choices: ['to', 'on', 'into', 'over'], answer: 'into', skill: 'prepositions', explain: 'When something moves and goes inside a container or hole, we use "into".' },
        { q: 'There is no _____________ soup left after Dan finished the whole pot.', choices: ['any', 'much', 'many', 'more'], answer: 'more', skill: 'quantifiers', explain: '"No more" means none is left.' },
        { q: '"__________ is my pencil," said Mimi as she held it in her hand.', choices: ['This', 'That', 'These', 'Those'], answer: 'This', skill: 'demonstratives', explain: 'She is holding it — close to her — so we use "This" (singular, near).' },
        { q: '"Do not touch this cake. It is __________," Greedy Gavin said.', choices: ['me', 'my', 'mine', 'myself'], answer: 'mine', skill: 'possessives', explain: '"Mine" stands alone without a noun after it — it shows ownership.' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        { q: 'The farmer brushed the horse’s __________ with a comb.', choices: ['fur', 'mane', 'fleece', 'wool'], answer: 'mane', skill: 'bodyPartsAnimals', explain: 'The "mane" is the long hair on a horse\'s neck.' },
        { q: 'I _________ my grandmother a birthday card. She received it in her mailbox today.', choices: ['fetched', 'took', 'sent', 'picked'], answer: 'sent', skill: 'verbDistinction', explain: 'We "send" a card through the post; she received it in the mailbox.' },
        { q: 'I was feeling ill, so I visited a ___________ to see a doctor.', choices: ['shop', 'clinic', 'hospital', 'sickbay'], answer: 'clinic', skill: 'placeNouns', explain: 'A "clinic" is a small place where a doctor sees patients for everyday illnesses.' },
        { q: 'A / an ___________ of monkeys stole food from the shops.', choices: ['pack', 'army', 'flock', 'troop'], answer: 'troop', skill: 'collectiveNouns', explain: 'A group of monkeys is called a "troop".' },
        { q: 'I was _____________ by the size of Jane’s home. It looks like a palace!', choices: ['frightened', 'delighted', 'angry', 'amazed'], answer: 'amazed', skill: 'emotionAdjectives', explain: '"Amazed" means very surprised in a good way — fits "looks like a palace".' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. Each word can only be used once. One word will be left over.',
      wordBank: ['they', 'we', 'our', 'them', 'us', 'it'],
      text:
        'One fine day, Mum, my brother Shaun and I baked at home. Mum taught both of {{1}} how to make rock buns. ' +
        'First, {{2}} mixed all the ingredients together. Once {{3}} were mixed well, we put some dough on the baking sheet on a tray. ' +
        'When the tray was filled, we placed {{4}} in the oven. ' +
        'After the rock buns were finally baked, we placed {{5}} on a rack to cool. They were delicious!',
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
        'Kenneth had a big game tomorrow. He tried not to worry, but however hard he {{1}}, he could not fall asleep! ' +
        'Thinking about the game kept him {{2}}. ' +
        'First, he tried {{3}} hot chocolate. Next, he tried counting sheep. He {{4}} till two hundred and eighty-one until he gave up. ' +
        'By the time his eyes began to {{5}}, his alarm clock rang. Poor Kenneth did not sleep at all the whole night!',
      answers: ['tried', 'awake', 'drinking', 'counted', 'close'],
      leftOver: ['wake'],
      skill: 'collocationCloze',
    },
    sectionE: {
      title: 'Section E: Word Order',
      marks: 5,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['his', 'test', 'Pete', 'did', 'well', 'in'], answer: 'Pete did well in his test.' },
        { scrambled: ['this', 'toy', 'does', 'cost', 'how', 'much'], answer: 'How much does this toy cost?' },
        { scrambled: ['eating', 'this', 'restaurant', 'at', 'we', 'like'], answer: 'We like eating at this restaurant.' },
        { scrambled: ['school', 'every', 'day', 'to', 'I', 'walk'], answer: 'I walk to school every day.' },
        { scrambled: ['do', 'you', 'which', 'flavour', 'the', 'like', 'most'], answer: 'Which flavour do you like the most?' },
      ],
    },
    sectionG: {
      title: 'Section F: Comprehension Open-ended',
      marks: 5,
      passage:
        'Tim did not like music lessons. He was learning to play the piano at a music school every Saturday. His teacher was very strict with him. He made Tim play a certain part over and over again until it was perfect.\n\n' +
        'One day, Tim went to a shopping mall and saw a busker* playing the piano. As Tim listened to the music, he kept tapping his feet.\n\n' +
        'Many people came to watch the busker. Whenever he finished playing a tune, people clapped loudly.\n\n' +
        'Tim wanted to be as good as the busker. From then on, he started practising the piano eagerly and regularly. Soon, he became so good that he was chosen to play the piano on stage.\n\n' +
        '*busker: someone who sings, plays, or performs in a public place so that people will give money',
      questions: [
        { type: 'mcq', marks: 1, q: 'How often did Tim have music lessons?', choices: ['every day', 'once a week', 'twice a week', 'once a month'], answer: 'once a week', explain: 'Tim had piano lessons "every Saturday" — that is once a week.' },
        { type: 'short', marks: 1, q: 'In what way was his teacher "very strict" (paragraph 1) with Tim?', model: 'He made Tim play a certain part over and over again until it was perfect.', keywords: ['over and over', 'perfect'] },
        { type: 'short', marks: 1, q: 'What did Tim do as he listened to the busker?', model: 'He kept tapping his feet.', keywords: ['tapping', 'feet'] },
        {
          type: 'word-meaning',
          marks: 1,
          q: 'Circle the word in the sentence below that has the same meaning as "often".',
          sentence: 'From then on, he started practising the piano eagerly and regularly.',
          choices: ['eagerly', 'regularly'],
          answer: 'regularly',
          explain: '"Regularly" means happening often or at regular times.',
        },
        {
          type: 'sequence',
          marks: 1,
          q: 'Arrange the events in the correct sequence.',
          options: ['Tim was chosen to perform on stage.', 'People clapped loudly.', 'Tim visited a shopping mall.'],
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
    blurb: 'Term 3 paper — adds Editing for the first time. Comprehension passage about Toby chasing his shadow.',
    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 5,
      items: [
        { q: 'Don’t eat the bread. ____________ has turned mouldy.', choices: ['It', 'He', 'She', 'They'], answer: 'It', skill: 'pronouns', explain: 'We use "It" to refer to a thing like bread.' },
        { q: 'Holly has to attend a lesson _____________ 8 o’clock in the morning.', choices: ['in', 'on', 'at', 'by'], answer: 'at', skill: 'prepositions', explain: 'We use "at" before a specific clock time.' },
        { q: 'After a tiring day at the office, Mother finally had _____________ rest when she returned home.', choices: ['any', 'some', 'little', 'few'], answer: 'some', skill: 'quantifiers', explain: 'In a positive sentence with an uncountable noun (rest), we use "some".' },
        { q: '"__________ did you perform this magic trick? Please show me," Fred asked.', choices: ['How', 'When', 'What', 'Where'], answer: 'How', skill: 'whQuestions', explain: '"How" asks about the way or method — Fred wants to see the steps.' },
        { q: '"This is the __________ performance I’ve ever seen in my life!" exclaimed one of the judges.', choices: ['bad', 'worse', 'most bad', 'worst'], answer: 'worst', skill: 'superlatives', explain: 'For three or more, the superlative form of "bad" is "worst".' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        { q: 'It is hot and dry in the __________ where few plants can survive.', choices: ['forest', 'desert', 'jungle', 'reservoir'], answer: 'desert', skill: 'placeNouns', explain: 'A "desert" is a hot, dry place where few plants grow.' },
        { q: 'Whenever Steve does not have enough sleep or is hungry, he will be in a ___________ mood.', choices: ['jolly', 'lazy', 'grumpy', 'miserable'], answer: 'grumpy', skill: 'emotionAdjectives', explain: '"Grumpy" describes a bad mood from being tired or hungry.' },
        { q: 'Our pet dog ___________ its tail excitedly when it sees us.', choices: ['wags', 'flaps', 'waves', 'shakes'], answer: 'wags', skill: 'actionVerbs', explain: 'Dogs "wag" their tails when they are happy.' },
        { q: 'Every morning, I can hear birds ______________ outside my window.', choices: ['humming', 'chirping', 'cheeping', 'screeching'], answer: 'chirping', skill: 'soundVerbs', explain: 'Birds make a short, cheerful sound called "chirping".' },
        { q: 'Gail ____________ the dirty table with a cloth.', choices: ['rubbed', 'wiped', 'mopped', 'brushed'], answer: 'wiped', skill: 'actionVerbs', explain: 'We "wipe" a table with a cloth to clean it.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. You may use the words more than once.',
      wordBank: ['a', 'an', 'the'],
      reuseAllowed: true,
      text:
        'Little Joe entered his older sister Janet’s bedroom. He saw {{1}} object on the floor. It was {{2}} bead. ' +
        'Thinking it was candy, he put it in his mouth. ' +
        'Luckily, Janet entered the room looking for {{3}} bead she had lost. She saw Joe turning blue in {{4}} face and knew what had happened. ' +
        'She quickly bent him forwards and hit him {{5}} few times on his back. The bead flew out of his mouth and Joe could breathe again.',
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
        'Zoe wished she had a super power or two. Mostly, she would like to {{1}} super strength and super speed. ' +
        'She wanted to be someone who could save others from {{2}}. ' +
        'One day, Zoe was {{3}} the road when a truck came racing towards her. She {{4}} on the spot. ' +
        'Luckily, a man scooped her up just in time and brought her to {{5}}. ' +
        'That day, Zoe realised that one need not be a superhero to save others.',
      answers: ['have', 'danger', 'crossing', 'froze', 'safety'],
      leftOver: ['stopped', 'protection'],
      skill: 'collocationCloze',
    },
    sectionE: {
      title: 'Section E: Word Order',
      marks: 5,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['birthday', 'party', 'a', 'huge', 'Doreen', 'had'], answer: 'Doreen had a huge birthday party.' },
        { scrambled: ['go', 'out', 'when', 'to', 'play', 'we', 'can'], answer: 'When can we go out to play?' },
        { scrambled: ['chased', 'a', 'dog', 'by', 'was', 'the', 'boy'], answer: 'The boy was chased by a dog.' },
        { scrambled: ['like', 'would', 'you', 'now', 'to', 'have', 'lunch'], answer: 'Would you like to have lunch now?' },
        { scrambled: ['was', 'empty', 'it', 'was', 'quiet', 'the', 'house', 'as'], answer: 'It was quiet as the house was empty.' },
      ],
    },
    sectionF: {
      title: 'Section F: Editing',
      marks: 5,
      instructions: 'Each underlined word contains a spelling mistake. A wrong or missing punctuation mark is indicated by a circle. Put the correct punctuation mark or word in the box.',
      paragraph:
        'Patty was going to perform on stage for the first time in her life. She felt very {{1:nervos}}. She had butterflies in her {{2:stomak}}. ' +
        'When she went on stage{{3:o}} Patty simply stood still as she looked at all the {{4:peepel}} in the hall. ' +
        'However, when the music started playing, it calmed her down and she could sing. ' +
        'Everyone in the audience gave her a loud round of applause{{5:o}} Patty felt so happy that she had overcome her fear.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'nervos', correction: 'nervous', explain: 'The correct spelling is "nervous".' },
        { num: 2, kind: 'spelling', wrong: 'stomak', correction: 'stomach', explain: 'The correct spelling is "stomach".' },
        { num: 3, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed after the time clause "When she went on stage".' },
        { num: 4, kind: 'spelling', wrong: 'peepel', correction: 'people', explain: 'The correct spelling is "people".' },
        { num: 5, kind: 'punctuation', wrong: '', correction: '.', explain: 'A full stop ends the sentence before "Patty felt so happy".' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended',
      marks: 5,
      passage:
        'Toby loved sunny days, not just for the warmth, but for his best friend, Shadow. Shadow followed Toby everywhere and copied all his actions. One afternoon, Toby had an idea. "I’m going to catch Shadow!" he declared.\n\n' +
        'He stretched out his butterfly net and charged at the inky outline. Poof! Shadow slipped away. Toby chased after Shadow, but Shadow was too quick for him. He zipped under the fence and climbed up a tree.\n\n' +
        'Toby plopped down to catch his breath. Just then, he saw Shadow stretching before him in the grass. Toby giggled. Maybe catching Shadow wasn’t the point. The best part was having a friend who could play hide-and-seek with him in the sunshine.',
      questions: [
        { type: 'mcq', marks: 1, q: 'Toby loved sunny days as he ________________________.', choices: ['felt warm', 'enjoyed playing with his best friend Shadow', 'liked the warmth and being with his best friend Shadow', 'enjoyed being out in the sun catching his best friend Shadow'], answer: 'liked the warmth and being with his best friend Shadow', explain: 'The passage says he loved sunny days "not just for the warmth, but for his best friend".' },
        { type: 'short', marks: 1, q: 'What does "the inky outline" in paragraph 2 refer to?', model: 'It refers to Shadow (Toby’s shadow on the ground).', keywords: ['Shadow'] },
        { type: 'short', marks: 1, q: 'Why could Toby not catch Shadow?', model: 'Shadow was too quick for him.', keywords: ['too quick'] },
        { type: 'short', marks: 1, q: 'Which three-word phrase in paragraph 3 tells you that Toby stopped to rest?', model: 'catch his breath', keywords: ['catch his breath'] },
        {
          type: 'sequence',
          marks: 1,
          q: 'Arrange the events in the correct sequence.',
          options: ['Toby saw Shadow in front of him in the grass.', 'Toby decided to try to catch Shadow.', 'Shadow escaped from Toby.'],
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
    blurb: 'Term 4 paper — full P1 format with Editing and a magical pebble Comprehension passage.',
    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 5,
      items: [
        { q: 'It was very hot, so we sat ____________ the shade where it was cooler.', choices: ['on', 'in', 'with', 'below'], answer: 'in', skill: 'prepositions', explain: 'We sit "in the shade" — a fixed expression for being inside a shaded area.' },
        { q: 'Thomas wanted to borrow a book on riddles, ____________ he went to the library.', choices: ['and', 'but', 'so', 'when'], answer: 'so', skill: 'connectors', explain: '"So" shows a result — he went to the library because he wanted a book.' },
        { q: 'As a young boy, Grandfather _____________ in this river. There were no swimming pools back then.', choices: ['swim', 'swims', 'swum', 'swam'], answer: 'swam', skill: 'simplePast', explain: 'This happened long ago, so we use the simple past "swam".' },
        { q: '"__________ are you today? I hope you are feeling much better," my teacher said to me.', choices: ['How', 'Why', 'What', 'Which'], answer: 'How', skill: 'whQuestions', explain: '"How are you?" is the standard way to ask about someone\'s wellbeing.' },
        { q: 'There wasn’t _____________ juice left. I only had half a glass of it.', choices: ['much', 'some', 'little', 'few'], answer: 'much', skill: 'quantifiers', explain: 'With negative sentences and uncountable nouns (juice), we use "much".' },
      ],
    },
    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        { q: 'Everyone rushed towards the _____________ of the building to escape from the fire.', choices: ['entrance', 'lobby', 'corridor', 'exit'], answer: 'exit', skill: 'placeNouns', explain: 'You leave a building through the "exit", especially in an emergency.' },
        { q: 'No one saw the burglar ___________ into the house when night fell.', choices: ['crawling', 'sneaking', 'strolling', 'marching'], answer: 'sneaking', skill: 'actionVerbs', explain: '"Sneaking" means moving quietly so no one notices — what burglars do.' },
        { q: 'A ___________ of monkeys entered our kitchen and stole some food.', choices: ['school', 'pack', 'flock', 'troop'], answer: 'troop', skill: 'collectiveNouns', explain: 'A group of monkeys is called a "troop".' },
        { q: 'I heard an owl ______________ in the woods just now.', choices: ['screech', 'chirp', 'howl', 'crow'], answer: 'screech', skill: 'soundVerbs', explain: 'Owls "screech" — a sharp, piercing sound.' },
        { q: 'Bill is so greedy! He finished a whole ____________ of ice-cream on his own.', choices: ['carton', 'tub', 'container', 'box'], answer: 'tub', skill: 'collectiveNouns', explain: 'Ice-cream usually comes in a "tub" — a round, wide container.' },
      ],
    },
    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 5,
      instructions: 'Fill in the blanks with a suitable word from the box. One word will be left over.',
      wordBank: ['above', 'at', 'with', 'across', 'on', 'to', 'around'],
      text:
        'At the park, a group of children played together. Some were running {{1}} the grass, while others sat on the swings, flying high {{2}} the ground. ' +
        'One boy stood in the sandbox, digging in the sand {{3}} a toy shovel. A girl rode her bike {{4}} the park, laughing as she went. ' +
        'Nearby, a dog barked {{5}} people he saw and wagged its tail. The sound of joyful voices filled the air.',
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
        'Ethan stared up at the tall tree, his heart pounding. His kitten, Whiskers, was {{1}} high on a branch. ' +
        'Ethan had tried to {{2}} her to come down, but she would not budge as she was frightened. ' +
        'He circled around the tree and {{3}} what he should do. ' +
        'Just then, his neighbour, Mr. Adams, walked past. "Do you need any help?" he asked. Ethan nodded. ' +
        'Together, they got a ladder, and Mr. Adams carefully {{4}} up. Soon, Whiskers was {{5}} in Ethan’s arms. Both pet and owner were reunited at last!',
      answers: ['stuck', 'call', 'wondered', 'climbed', 'safe'],
      leftOver: ['fixed', 'thought'],
      skill: 'collocationCloze',
    },
    sectionE: {
      title: 'Section E: Word Order',
      marks: 5,
      instructions: 'Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.',
      items: [
        { scrambled: ['the', 'books', 'Amy', 'heavy', 'carry', 'helped', 'me'], answer: 'Amy helped me carry the heavy books.' },
        { scrambled: ['wait', 'long', 'how', 'do', 'we', 'to', 'have'], answer: 'How long do we have to wait?' },
        { scrambled: ['playing', 'each', 'other', 'they', 'enjoy', 'with', 'badminton'], answer: 'They enjoy playing badminton with each other.' },
        { scrambled: ['leave', 'would', 'you', 'now', 'or', 'later', 'like', 'to'], answer: 'Would you like to leave now or later?' },
        { scrambled: ['Jake', 'around', 'jogs', 'day', 'every', 'the', 'neighbourhood'], answer: 'Jake jogs around the neighbourhood every day.' },
      ],
    },
    sectionF: {
      title: 'Section F: Editing',
      marks: 5,
      instructions: 'Each underlined word contains a spelling mistake. A wrong or missing punctuation mark is indicated by a circle. Put the correct punctuation mark or word in the box.',
      paragraph:
        'Max loved his shiny red toy car more than anything. He played with it every day. ' +
        'One afternoon, it {{1:disapeared}}! Max searched under the bed{{2:o}} in his toy box, and even in the backyard, but no luck. ' +
        'Feeling sad, Max sat down on the couch. {{3:Sudennly}}, his little puppy Muffin trotted over. ' +
        'In its mouth was Max{{4:o}}s toy car, slightly wet and slimy but safe! ' +
        'Max laughed and {{5:reellised}} Muffin must have thought the car was a new chew toy.',
      errors: [
        { num: 1, kind: 'spelling', wrong: 'disapeared', correction: 'disappeared', explain: 'The correct spelling is "disappeared" (double p).' },
        { num: 2, kind: 'punctuation', wrong: '', correction: ',', explain: 'A comma is needed between items in the list of places.' },
        { num: 3, kind: 'spelling', wrong: 'Sudennly', correction: 'Suddenly', explain: 'The correct spelling is "Suddenly".' },
        { num: 4, kind: 'punctuation', wrong: '', correction: '’', explain: 'An apostrophe is needed to show possession: "Max’s toy car".' },
        { num: 5, kind: 'spelling', wrong: 'reellised', correction: 'realised', explain: 'The correct spelling is "realised".' },
      ],
    },
    sectionG: {
      title: 'Section G: Comprehension Open-ended',
      marks: 5,
      passage:
        'Lisa was in the woods near her house when she found a small, shiny pebble that was shaped like a bird’s egg. When she picked it up, a soft voice whispered, "Make a wish, but choose wisely."\n\n' +
        'Excited, Lisa closed her eyes and wished for her favourite thing: to talk to animals.\n\n' +
        'Suddenly, the forest around her came to life! A squirrel chattered, "Hello!" and a bird tweeted, "How’s the weather?"\n\n' +
        'Lisa giggled in amazement. She spent the afternoon chatting with rabbits, foxes, and even a wise old owl. They told her interesting secrets about the woods she had never known.\n\n' +
        'As the sun set, Lisa thanked the pebble, grateful for the many new friends she had made in the woods.',
      questions: [
        { type: 'mcq', marks: 1, q: 'The pebble was magical because ________________________.', choices: ['it was small and shiny', 'it was in the woods', 'it talked to Lisa', 'it was shaped like a bird’s egg'], answer: 'it talked to Lisa', explain: 'The pebble whispered to Lisa — a magical thing for a pebble to do.' },
        { type: 'short', marks: 1, q: 'What did Lisa wish for?', model: 'She wished that she could talk to animals.', keywords: ['talk', 'animals'] },
        { type: 'short', marks: 1, q: 'Which word in paragraph 4 is similar to "surprise"?', model: 'amazement', keywords: ['amazement'] },
        { type: 'short', marks: 1, q: 'Why was Lisa grateful to the pebble?', model: 'The pebble had given her the wish that let her talk to animals, so she made many new friends in the woods.', keywords: ['new friends', 'animals', 'wish'] },
        {
          type: 'sequence',
          marks: 1,
          q: 'Arrange the events in the correct sequence.',
          options: ['A squirrel greeted Lisa.', 'The animals told Lisa secrets about the woods.', 'Lisa made a wish.'],
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
