/**
 * PhonicsQuest – Cloze Castle Quest Data (Grammar Cloze)
 *
 * Singapore Primary 1–6 grammar cloze passages.
 * Each passage has a text with ___ blanks, an answers array (in order),
 * and a wordBank array (answers + distractors, shuffled at runtime).
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

export const passages = {
  P1: [
    {
      id: 'g-p1-01',
      title: 'My Family',
      text: 'I have ___ mother and ___ father. They ___ very kind to me. We live in ___ big house.',
      answers: ['a', 'a', 'are', 'a'],
      wordBank: ['a', 'a', 'are', 'a', 'an', 'the', 'is', 'am'],
      xp: 20,
    },
    {
      id: 'g-p1-02',
      title: 'My School Day',
      text: 'I ___ to school every day. I like ___ draw pictures. My teacher ___ very nice to us.',
      answers: ['go', 'to', 'is'],
      wordBank: ['go', 'to', 'is', 'goes', 'for', 'are', 'went', 'at'],
      xp: 20,
    },
    {
      id: 'g-p1-03',
      title: 'The Playground',
      text: 'The children ___ playing in the playground. They ___ very happy. The playground ___ big and fun.',
      answers: ['are', 'are', 'is'],
      wordBank: ['are', 'are', 'is', 'was', 'am', 'were', 'be'],
      xp: 20,
    },
  ],

  P2: [
    {
      id: 'g-p2-01',
      title: 'A Trip to the Zoo',
      text: 'Last Sunday, my family ___ to the zoo. We ___ many animals there. The monkeys ___ swinging from tree to tree. I had ___ very fun day.',
      answers: ['went', 'saw', 'were', 'a'],
      wordBank: ['went', 'saw', 'were', 'a', 'go', 'see', 'are', 'an'],
      xp: 25,
    },
    {
      id: 'g-p2-02',
      title: 'My Pet Dog',
      text: 'I have ___ dog named Max. He ___ brown and white. Every morning, I ___ him for a walk. He ___ very friendly to everyone.',
      answers: ['a', 'is', 'take', 'is'],
      wordBank: ['a', 'is', 'take', 'is', 'an', 'are', 'took', 'was'],
      xp: 25,
    },
    {
      id: 'g-p2-03',
      title: 'Helping Mother',
      text: 'After dinner, Tom ___ the dishes for his mother. He also ___ the floor clean. His mother ___ very pleased with him.',
      answers: ['washed', 'swept', 'was'],
      wordBank: ['washed', 'swept', 'was', 'washes', 'sweeps', 'is', 'wash'],
      xp: 25,
    },
  ],

  P3: [
    {
      id: 'g-p3-01',
      title: 'Helping at Home',
      text: 'Every Saturday, Sarah helps ___ mother with the housework. She ___ the dishes after dinner and sweeps the floor. Her mother is always grateful ___ her help. Sarah feels ___ when she helps out.',
      answers: ['her', 'washes', 'for', 'happy'],
      wordBank: ['her', 'washes', 'for', 'happy', 'their', 'wash', 'of', 'sad'],
      xp: 30,
    },
    {
      id: 'g-p3-02',
      title: 'The Science Project',
      text: 'The students ___ working on a science project. They ___ been collecting data for two weeks. The results ___ very interesting. They cannot wait to ___ them to the class.',
      answers: ['are', 'have', 'are', 'present'],
      wordBank: ['are', 'have', 'are', 'present', 'were', 'has', 'were', 'show'],
      xp: 30,
    },
    {
      id: 'g-p3-03',
      title: 'At the Market',
      text: 'Mrs Tan went ___ the market early in the morning. She ___ fresh vegetables and fruits. She also bought some fish ___ her family. The market ___ very busy.',
      answers: ['to', 'bought', 'for', 'was'],
      wordBank: ['to', 'bought', 'for', 'was', 'at', 'buys', 'to', 'is'],
      xp: 30,
    },
  ],

  P4: [
    {
      id: 'g-p4-01',
      title: 'The New Library',
      text: 'The new library ___ opened last month. It is ___ modern building with thousands of books. Students can borrow books ___ bringing their library cards. The library also ___ computers for students to use.',
      answers: ['was', 'a', 'by', 'has'],
      wordBank: ['was', 'a', 'by', 'has', 'is', 'an', 'with', 'have'],
      xp: 35,
    },
    {
      id: 'g-p4-02',
      title: 'Environmental Awareness',
      text: 'Pollution ___ become a serious problem in many cities. Factories release harmful gases ___ the atmosphere. If we do not take action, the situation ___ get worse. Everyone ___ do their part to protect our planet.',
      answers: ['has', 'into', 'will', 'should'],
      wordBank: ['has', 'into', 'will', 'should', 'have', 'in', 'can', 'must'],
      xp: 35,
    },
    {
      id: 'g-p4-03',
      title: 'Sports Day',
      text: 'The school ___ a sports day last Friday. The students ___ hard for many weeks. Tom ___ the 100-metre race and was awarded a gold medal. Everyone ___ very proud of him.',
      answers: ['had', 'trained', 'won', 'was'],
      wordBank: ['had', 'trained', 'won', 'was', 'has', 'train', 'wins', 'were'],
      xp: 35,
    },
  ],

  P5: [
    {
      id: 'g-p5-01',
      title: 'Technology in Education',
      text: 'Technology ___ transformed the way students learn. ___ traditional textbooks, students now have access to online resources. ___, this has also created challenges, as some students ___ easily distracted by entertainment.',
      answers: ['has', 'Unlike', 'However', 'are'],
      wordBank: ['has', 'Unlike', 'However', 'are', 'have', 'Like', 'Therefore', 'were'],
      xp: 40,
    },
    {
      id: 'g-p5-02',
      title: 'Community Gardens',
      text: 'Community gardens ___ springing up in cities around the world. These spaces allow residents ___ grow their own vegetables. ___ providing fresh produce, they also bring people together. Many claim that gardening ___ their wellbeing.',
      answers: ['are', 'to', 'Besides', 'improves'],
      wordBank: ['are', 'to', 'Besides', 'improves', 'were', 'for', 'Despite', 'improve'],
      xp: 40,
    },
    {
      id: 'g-p5-03',
      title: 'Social Media',
      text: 'Social media ___ changed how we communicate with others. While it ___ people to stay connected, it can also lead to cyberbullying. Teenagers ___ be taught to use it responsibly. ___ misuse, social media can be a powerful tool.',
      answers: ['has', 'allows', 'should', 'Without'],
      wordBank: ['has', 'allows', 'should', 'Without', 'have', 'allow', 'must', 'Despite'],
      xp: 40,
    },
  ],

  P6: [
    {
      id: 'g-p6-01',
      title: 'Globalisation',
      text: 'Globalisation ___ interconnected economies worldwide, creating both opportunities and challenges. While it ___ facilitated the exchange of goods and ideas, it has also widened the gap ___ rich and poor nations. Critics argue that developing countries often ___ the greatest economic burden.',
      answers: ['has', 'has', 'between', 'bear'],
      wordBank: ['has', 'has', 'between', 'bear', 'have', 'had', 'among', 'bore'],
      xp: 50,
    },
    {
      id: 'g-p6-02',
      title: 'Artificial Intelligence',
      text: 'Artificial intelligence ___ reshaping industries at an unprecedented pace. Machines ___ now capable of performing tasks that once required human expertise. ___ its benefits, AI raises ethical concerns about privacy. Policymakers ___ develop frameworks to harness its potential responsibly.',
      answers: ['is', 'are', 'Despite', 'must'],
      wordBank: ['is', 'are', 'Despite', 'must', 'are', 'were', 'Because of', 'should'],
      xp: 50,
    },
    {
      id: 'g-p6-03',
      title: 'Mental Health Awareness',
      text: 'Mental health ___ increasingly recognised as essential to overall wellbeing. Schools ___ now implementing programmes to support students\' emotional health. ___, many young people still hesitate to seek help. Society ___ work collectively to reduce the stigma surrounding mental illness.',
      answers: ['is', 'are', 'Nevertheless', 'must'],
      wordBank: ['is', 'are', 'Nevertheless', 'must', 'are', 'were', 'Therefore', 'should'],
      xp: 50,
    },
  ],
};
