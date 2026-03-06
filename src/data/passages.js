/**
 * PhonicsQuest – Cloze Castle Quest Data (Grammar Cloze)
 *
 * Singapore Primary 1–6 grammar cloze passages.
 * Each passage has a text with ___ blanks, an answers array (in order),
 * and a wordBank array (answers + distractors, shuffled at runtime).
 *
 * Each level has 5 passages with 3–4 blanks for sufficient practice.
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
    {
      id: 'g-p1-04',
      title: 'My Toys',
      text: 'I have ___ red ball and ___ blue car. ___ ball is round. I like to ___ with my toys.',
      answers: ['a', 'a', 'The', 'play'],
      wordBank: ['a', 'a', 'The', 'play', 'an', 'the', 'A', 'plays'],
      xp: 20,
    },
    {
      id: 'g-p1-05',
      title: 'Breakfast Time',
      text: 'Every morning, I ___ my breakfast. I eat ___ egg and drink ___ glass of milk. Breakfast ___ good for me.',
      answers: ['eat', 'an', 'a', 'is'],
      wordBank: ['eat', 'an', 'a', 'is', 'eats', 'a', 'an', 'are'],
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
    {
      id: 'g-p2-04',
      title: 'At the Beach',
      text: 'We ___ to the beach yesterday. The sand ___ warm and soft. My sister ___ a sandcastle. We ___ a great time.',
      answers: ['went', 'was', 'built', 'had'],
      wordBank: ['went', 'was', 'built', 'had', 'go', 'is', 'build', 'has'],
      xp: 25,
    },
    {
      id: 'g-p2-05',
      title: 'The New Baby',
      text: 'My mother ___ a baby last week. The baby ___ very small. She ___ a lot at night. We all ___ her very much.',
      answers: ['had', 'is', 'cries', 'love'],
      wordBank: ['had', 'is', 'cries', 'love', 'has', 'was', 'cry', 'loves'],
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
    {
      id: 'g-p3-04',
      title: 'The School Concert',
      text: 'The school ___ a concert last Friday. Many students ___ on stage. The audience ___ loudly after each performance. ___ parents said it was the best concert ever.',
      answers: ['held', 'performed', 'clapped', 'Their'],
      wordBank: ['held', 'performed', 'clapped', 'Their', 'holds', 'perform', 'clap', 'They'],
      xp: 30,
    },
    {
      id: 'g-p3-05',
      title: 'A Rainy Day',
      text: 'It ___ raining heavily this morning. The children ___ not go out to play. They had to ___ indoors instead. Mother ___ them some hot chocolate to cheer them up.',
      answers: ['was', 'could', 'stay', 'made'],
      wordBank: ['was', 'could', 'stay', 'made', 'is', 'can', 'stayed', 'makes'],
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
    {
      id: 'g-p4-04',
      title: 'The Class Monitor',
      text: 'Ali ___ chosen as the class monitor last term. He ___ responsible for keeping the classroom tidy. ___ he was busy, he never complained. His classmates ___ that he did a great job.',
      answers: ['was', 'was', 'Although', 'agreed'],
      wordBank: ['was', 'was', 'Although', 'agreed', 'is', 'is', 'Because', 'agree'],
      xp: 35,
    },
    {
      id: 'g-p4-05',
      title: 'The School Garden',
      text: 'The students ___ been working on the school garden since January. They ___ different types of vegetables. The garden ___ looked after by all the classes. The harvest ___ be shared among the students.',
      answers: ['have', 'planted', 'is', 'will'],
      wordBank: ['have', 'planted', 'is', 'will', 'has', 'plant', 'was', 'would'],
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
    {
      id: 'g-p5-04',
      title: 'Healthy Eating',
      text: 'A balanced diet ___ essential for growing children. Parents ___ encourage their children to eat more fruits and vegetables. ___ eating healthily is important, exercise is ___ necessary for good health.',
      answers: ['is', 'should', 'While', 'equally'],
      wordBank: ['is', 'should', 'While', 'equally', 'are', 'must', 'Because', 'also'],
      xp: 40,
    },
    {
      id: 'g-p5-05',
      title: 'Public Transport',
      text: 'Public transport ___ become more efficient in recent years. Commuters ___ now travel faster than before. ___, overcrowding during peak hours remains a challenge. The government ___ invest more in upgrading the system.',
      answers: ['has', 'can', 'Nevertheless', 'must'],
      wordBank: ['has', 'can', 'Nevertheless', 'must', 'have', 'could', 'Therefore', 'should'],
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
    {
      id: 'g-p6-04',
      title: 'Urban Planning',
      text: 'As cities ___ to grow, urban planners face increasing pressure to ___ sustainable solutions. Green spaces ___ been shown to improve residents\' quality of life. ___, balancing development with conservation remains a significant challenge.',
      answers: ['continue', 'develop', 'have', 'However'],
      wordBank: ['continue', 'develop', 'have', 'However', 'continues', 'developing', 'has', 'Therefore'],
      xp: 50,
    },
    {
      id: 'g-p6-05',
      title: 'Cultural Diversity',
      text: 'Singapore\'s multicultural society ___ a source of strength and resilience. Citizens of different races ___ harmoniously side by side. ___ occasional tensions, the nation has ___ maintained its commitment to racial harmony.',
      answers: ['is', 'live', 'Despite', 'consistently'],
      wordBank: ['is', 'live', 'Despite', 'consistently', 'are', 'lives', 'Because of', 'rarely'],
      xp: 50,
    },
  ],
};
