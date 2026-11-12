/**
 * Sample scripts for checking the AI writing marker against the PSLE scale.
 *
 * Each script has the mark range a careful PSLE marker would give it. These
 * are authored estimates, not marks from real exam scripts, so the ranges
 * are deliberately wide: they catch a marker that is badly off (padding
 * scored as strong writing, a missing point not costing marks), not one that
 * is a mark or two away from a teacher. Real marked scripts, with a parent's
 * permission, would make a tighter check.
 *
 * The weak scripts contain their mistakes on purpose.
 *
 * Used by src/__tests__/writingMarker.test.js. Not part of the app.
 */

export const CONTINUOUS_TASK =
  'Write a composition of at least 150 words about a time you helped someone who was in trouble.';

/**
 * expect: inclusive [min, max] for each part and the total, on the 2025
 * format: Content /18, Language /18, total /36.
 */
export const CONTINUOUS_SAMPLES = [
  {
    id: 'strong',
    why: 'Clear, developed story with feelings, a turning point and few errors.',
    expect: { content: [14, 18], language: [14, 18], total: [28, 36] },
    text: `The rain was so heavy that afternoon that I could barely see the bus stop across the road. I was hurrying home from tuition, clutching my umbrella, when I heard a thin, frightened cry coming from the void deck.

Huddled beside the letterboxes was a little boy, no older than five, his school shoes soaked and his face streaked with tears. "I can't find my grandma," he sobbed. My first thought was to call for an adult, but the void deck was empty and the rain showed no sign of stopping.

I knelt down so that we were the same height and asked him his name. "Ryan," he whispered. I remembered what my teacher had taught us: stay calm and stay where people can find you. I gave Ryan my jacket, which was only slightly damp, and asked if he knew his block number. He shook his head, but he pointed proudly at the dinosaur sticker on his bag. On the back, in neat handwriting, was a phone number.

My hands trembled as I dialled it on my phone. A worried voice answered on the first ring. Ten minutes later, an elderly lady came hurrying towards us, her umbrella flapping in the wind. She swept Ryan into a hug and thanked me again and again.

As I walked home, wet and cold, I felt warmer than I had all day. I learned that helping someone does not always need courage, just the willingness to stop and listen.`,
  },
  {
    id: 'competent',
    why: 'A complete, relevant story told plainly, with some grammar slips.',
    expect: { content: [9, 14], language: [9, 14], total: [18, 28] },
    text: `Last year during the school holidays, I went to the park with my brother. We were playing football near the playground when we saw an old man fall down. He drop his bag and his oranges roll everywhere.

My brother and I ran to him quickly. I asked him if he was okay. He said his leg was painful and he cannot stand up. I was very scared because I did not know what to do. My brother told me to pick up the oranges while he help the man to sit on the bench.

Then I remember that there was a security guard at the entrance of the park. I ran there as fast as I could and told him what happened. The guard came with me and called the ambulance. While we waited, I talked to the old man so he would not feel lonely. He told me he was going to visit his grandson.

When the ambulance came, the old man thanked us. He gave us two oranges as a present. My mother was very proud of us when we told her the story. I felt happy that we helped him and I will always help people who are in trouble.`,
  },
  {
    id: 'weak',
    why: 'On topic, but thin events and frequent errors in grammar and spelling.',
    expect: { content: [4, 10], language: [3, 9], total: [7, 18] },
    text: `One day i go to the market with my mother. There is a girl she is crying. She lost her mother. i feel sad for her. I ask her what happen and she say she cannot find her mother. Me and my mother bring her to the stall uncle. The uncle say he will help. Then the girl mother come back she very happy. She say thank you to us and give me sweet. I very happy also because i help the girl. Then we go home and eat lunch. That day was a very good day and I learn that we must help people always when they are in truble because it is good to help.`,
  },
  {
    id: 'too-short',
    why: 'Far under 150 words, so the ideas cannot be developed.',
    expect: { content: [0, 6], language: [0, 9], total: [0, 14] },
    text: `I helped my friend when he fell down at recess. I brought him to the general office and the teacher put a plaster on his knee. He said thank you and I was happy.`,
  },
  {
    id: 'padded',
    why: 'Long, but mostly linking words and repeated filler with no real story. The old word-count marker scored this kind of script as Secure.',
    expect: { content: [0, 6], language: [0, 10], total: [0, 14] },
    text: `Firstly, I helped someone. Moreover, it was a very good day. Furthermore, I was very happy. In addition, the person was also very happy. Suddenly, I helped someone. However, it was very good. Therefore, I was happy. Besides that, the day was good and the weather was good and everything was good.

Secondly, I helped someone again. Moreover, it was very nice. Furthermore, helping is very important. In addition, helping is very good. Suddenly, I felt happy. However, I was very happy. Therefore, helping is good. Besides that, the person said thank you and I said you are welcome and the person said thank you again.

Finally, I helped someone. Moreover, it was the best day. Furthermore, I learned that helping is good. In addition, I learned that helping is important. Suddenly, I was happy. However, I was very very happy. Therefore, in conclusion, helping someone is good and important and everyone should help someone because helping is good.`,
  },
  {
    id: 'off-topic',
    why: 'Well written, but about a holiday, not about helping someone.',
    expect: { content: [0, 8], language: [10, 18], total: [8, 24] },
    text: `The plane touched down in Penang just as the sun was setting, painting the sky in shades of orange and pink. My family had been planning this trip for months, and I could hardly sit still as we waited for our luggage.

On our first morning, we wandered through the narrow streets of George Town. Colourful murals covered the walls of old shophouses, and I posed beside a painting of two children on a bicycle. The smell of char kway teow drifted from a hawker stall, and my father insisted that we try it immediately. It was smoky, salty and absolutely delicious.

In the afternoon, we took the funicular train up Penang Hill. The air grew cooler with every metre, and from the top we could see the whole island spread out beneath us like a map. My little sister pressed her nose against the railing and counted the ships in the harbour.

When we flew home three days later, I carried a bag of tau sar pneah for my grandmother and a head full of memories. It was the best holiday I have ever had.`,
  },
];

/** A situational writing task from the P5 writing track, with its points. */
export const SITUATIONAL_TASK = {
  situation:
    'After recess, your class, 5 Harmony, throws away about two bags of fruit peel every week. You want to start a composting project. Write an email to Mr Goh, the teacher-in-charge of the Green Club.',
  format: 'Formal email',
  audience: 'Mr Goh, the teacher-in-charge of the Green Club',
  points: [
    'Explain the problem you noticed',
    'Describe how the project would work, including where the compost bin would go',
    'Ask for his approval and for one thing you need from the Green Club',
  ],
};

/**
 * expect: inclusive [min, max] on the 2025 format: Task fulfilment /6,
 * Language and organisation /8, total /14.
 */
export const SITUATIONAL_SAMPLES = [
  {
    id: 'all-points',
    why: 'Every point covered, formal tone, clear order.',
    expect: { taskFulfilment: [5, 6], languageOrganisation: [6, 8], total: [11, 14] },
    text: `Dear Mr Goh,

I am Mei Ling from 5 Harmony, and I am writing to propose a composting project for our class.

After recess every day, our class throws away a lot of fruit peel. We counted, and it adds up to about two bags every week. This waste could be put to better use.

We would like to collect the peel in a covered container after recess. Each week, one group from our class would empty it into a compost bin. We suggest placing the bin beside the school garden, near the tap, so that it is easy to water and far from the classrooms. When the compost is ready, it could be used to feed the plants in the garden.

May we have your approval to start this project? We would also be grateful if the Green Club could lend us a compost bin.

Thank you for considering our idea.

Yours sincerely,
Tan Mei Ling
5 Harmony`,
  },
  {
    id: 'one-point',
    why: 'Polite and accurate, but only the first point is there: no plan, no bin location, no request.',
    expect: { taskFulfilment: [0, 3], languageOrganisation: [3, 8], total: [3, 10] },
    text: `Dear Mr Goh,

I am writing to tell you about a problem in my class, 5 Harmony.

Every day after recess, my classmates throw away their fruit peel in the dustbin. By the end of the week there are about two bags of fruit peel. I think this is a waste because the peel could be used for something useful. Many of my classmates agree with me.

Thank you for reading my email.

Yours sincerely,
Ahmad
5 Harmony`,
  },
  {
    id: 'poor-language',
    why: 'All three points are there, but the tone is far too casual for a teacher and the grammar is weak.',
    expect: { taskFulfilment: [3, 6], languageOrganisation: [0, 4], total: [3, 10] },
    text: `hey mr goh!!

our class got so much fruit peel every week like 2 bag, so wasted lor. we want do compost. we put the peel in one box after recess then every week one group throw into the compost bin. the bin can put beside school garden near the tap. can or not?? also can green club give us one compost bin. thx!!!!

from jun hao 5 harmony`,
  },
];
