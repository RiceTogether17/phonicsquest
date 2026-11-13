/**
 * Oral Practice sets.
 *
 * Each set is one sitting of the oral exam: a passage to read aloud, then a
 * conversation about a notice on the same theme. The two halves share a
 * theme on purpose, because the passage is meant to warm the child up for
 * the talk that follows.
 *
 * Shape:
 *   id, band ('P1-P2' | 'P3-P4' | 'P5-P6'), theme, title
 *   purpose   who the child is reading to and why (sets the tone of voice)
 *   passage   paragraphs, read aloud
 *   watch     words worth rehearsing first, each with a plain tip
 *   notice    the thing to look at in the conversation: emoji, heading, lines
 *   prompts   three questions. The first is about the notice, the second
 *             about the child's own life, the third asks for an opinion.
 *             `starters` are sentence openers, `model` is one good answer,
 *             shown only after the child has had a go.
 */

export const ORAL_BANDS = Object.freeze(['P1-P2', 'P3-P4', 'P5-P6']);

export const ORAL_SETS = Object.freeze([
  {
    id: 'oral-lower-01',
    band: 'P1-P2',
    theme: 'Looking after our things',
    title: 'The Lost Water Bottle',
    purpose: 'You are reading this story to your class. Read it clearly so that everyone can follow.',
    passage: [
      'After recess, Mei Ling could not find her water bottle. She looked under her desk. She looked in her bag. It was not there.',
      '"Did you leave it in the canteen?" asked her friend, Arjun.',
      'The two children hurried back. There it was, on the long bench by the fruit stall! Mei Ling hugged her blue bottle.',
      '"Thank you, Arjun," she said. "Next time, I will write my name on it."',
    ],
    watch: [
      { word: 'recess', tip: 'Say REE-sess. The first part is the loud part.' },
      { word: 'hurried', tip: 'Two beats: HUR-reed.' },
      { word: 'canteen', tip: 'The loud part is at the end: can-TEEN.' },
    ],
    notice: {
      emoji: '🧺',
      heading: 'Lost and Found Corner',
      lines: [
        'Found something that is not yours?',
        'Put it in the basket outside the office.',
        'Lost something? Look here first!',
        'Remember to write your name on your things.',
      ],
    },
    prompts: [
      {
        q: 'Look at the notice. What should you do if you find a pencil case that is not yours?',
        starters: ['If I find a pencil case, I will…', 'I will do this because…'],
        model:
          'If I find a pencil case that is not mine, I will put it in the basket outside the office. The notice tells us to do that. Then the owner can look there and get it back.',
      },
      {
        q: 'Have you ever lost something? Tell me what happened.',
        starters: ['Once, I lost my…', 'I felt…', 'In the end…'],
        model:
          'Once, I lost my red jacket at school. I felt worried because my mother had just bought it. I looked in my classroom and then in the hall. In the end, my teacher found it on a chair and gave it back to me.',
      },
      {
        q: 'How can children take good care of their things?',
        starters: ['One way is to…', 'Another way is to…', 'This helps because…'],
        model:
          'One way is to write our names on our things, so people know who they belong to. Another way is to pack our bags before we leave a place. This helps because we will see at once if something is missing.',
      },
    ],
  },
  {
    id: 'oral-lower-02',
    band: 'P1-P2',
    theme: 'Playing safely',
    title: 'Rain at the Playground',
    purpose: 'You are reading this story to a younger child. Read slowly and make it sound fun.',
    passage: [
      'Ben and his sister were on the swings when the sky turned grey. Drip, drop! Rain began to fall.',
      '"Quick, run to the shelter!" called Grandpa.',
      'They sat on the bench and watched the rain make puddles. Soon the slide was shiny and wet.',
      'When the rain stopped, Ben wanted to climb up at once. "Wait," said Grandpa. "Let us dry it first." He wiped the slide with a cloth, and then they played again.',
    ],
    watch: [
      { word: 'shelter', tip: 'SHEL-ter. Start with the "sh" sound.' },
      { word: 'puddles', tip: 'PUD-dles. Keep the "u" short, as in "mud".' },
      { word: 'climb', tip: 'The "b" is silent. Say "clime".' },
    ],
    notice: {
      emoji: '🛝',
      heading: 'Playground Rules',
      lines: [
        'Take turns on the slide and the swings.',
        'Do not play when it is wet.',
        'Keep your shoes on.',
        'Put your litter in the bin.',
      ],
    },
    prompts: [
      {
        q: 'Look at the notice. Which rule do you think is the most important? Why?',
        starters: ['I think the most important rule is…', 'It is important because…'],
        model:
          'I think the most important rule is "Do not play when it is wet". It is important because a wet slide is slippery. A child could fall and get hurt.',
      },
      {
        q: 'What do you like to do at the playground?',
        starters: ['At the playground, I like to…', 'I usually go with…', 'I like it because…'],
        model:
          'At the playground, I like to go on the swings. I usually go with my cousin after school. I like it because it feels like flying when I swing high.',
      },
      {
        q: 'What should children do to keep the playground nice for everyone?',
        starters: ['Children should…', 'They should also…', 'Then…'],
        model:
          'Children should throw their litter in the bin so the playground stays clean. They should also take turns and not push. Then everyone can enjoy playing there.',
      },
    ],
  },
  {
    id: 'oral-middle-01',
    band: 'P3-P4',
    theme: 'Caring for living things',
    title: 'The Class Garden',
    purpose: 'You are reading this report at assembly. Read with a clear, steady voice so the whole school can hear.',
    passage: [
      'At the start of the term, the corner behind our classroom was nothing but dry soil and weeds. Our teacher, Mr Tan, asked if anyone wanted to turn it into a garden. Every hand in the room shot up.',
      'We pulled out the weeds, loosened the soil and planted rows of spinach and lady\'s fingers. Each group took a turn to water the seedlings before school. Some mornings we forgot, and the leaves drooped sadly.',
      'Six weeks later, we harvested enough vegetables to share with the canteen stall owners. "This is the freshest spinach I have ever cooked!" one of them declared. We could not stop smiling.',
    ],
    watch: [
      { word: 'loosened', tip: 'LOO-sund. The "s" is a soft hiss, not a "z".' },
      { word: 'seedlings', tip: 'SEED-lings. Stretch the "ee".' },
      { word: 'harvested', tip: 'HAR-vis-tid. Three beats, with the first one loudest.' },
      { word: 'declared', tip: 'dih-CLAIRD. Let your voice lift, because she is pleased.' },
    ],
    notice: {
      emoji: '🌱',
      heading: 'Join the Green Club!',
      lines: [
        'Every Friday, 2.00 pm to 3.00 pm, at the school garden',
        'Learn to grow vegetables and herbs',
        'Make compost from fruit peels',
        'Bring a hat and a water bottle. All tools are provided.',
        'Sign up with Mr Tan by 14 March',
      ],
    },
    prompts: [
      {
        q: 'Look at the poster. Would you like to join this club? Why or why not?',
        starters: ['I would like to join because…', 'The part I find most interesting is…', 'One thing that might be hard is…'],
        model:
          'Yes, I would like to join the Green Club. The part I find most interesting is making compost from fruit peels, because I have never seen how waste turns into soil. It is only an hour on Fridays, so I would still have time for my homework.',
      },
      {
        q: 'Tell me about a time you looked after a plant or an animal.',
        starters: ['Last year, I looked after…', 'Every day, I had to…', 'What I learnt was…'],
        model:
          'Last year, I looked after a pot of basil on our kitchen window. Every day, I had to water it and turn the pot towards the sun. Once I forgot for three days and the leaves turned yellow. What I learnt was that living things need care every day, not only when we remember.',
      },
      {
        q: 'Do you think every school should have a garden? Why?',
        starters: ['I think…', 'One reason is…', 'Another reason is…', 'However…'],
        model:
          'I think every school should have a garden, even a small one. One reason is that pupils can see how food grows instead of only reading about it. Another reason is that working together in a garden teaches us to be responsible. However, someone must care for it during the holidays, so the school needs a plan for that.',
      },
    ],
  },
  {
    id: 'oral-middle-02',
    band: 'P3-P4',
    theme: 'Being considerate',
    title: 'Lunch at the Hawker Centre',
    purpose: 'You are telling this story to your classmates. Read it with expression so they can picture what happened.',
    passage: [
      'On Saturday, my family went to the hawker centre near our block for lunch. It was so crowded that we had to circle the tables twice before we found seats.',
      'While my father queued for chicken rice, I noticed an elderly woman carrying a heavy tray. She was searching for a place to sit. I glanced at my mother, and she nodded. "Auntie, please sit with us!" I called.',
      'She thanked us warmly and told us stories about the old market that once stood there. When we finished eating, I stacked all our plates and carried the trays to the return rack. "What a thoughtful child," she said. I felt taller all the way home.',
    ],
    watch: [
      { word: 'queued', tip: 'Say "kyood". It is one beat.' },
      { word: 'elderly', tip: 'EL-der-lee. Three beats.' },
      { word: 'searching', tip: 'SUR-ching.' },
      { word: 'thoughtful', tip: 'THAWT-ful. Put your tongue between your teeth for "th".' },
    ],
    notice: {
      emoji: '🍽️',
      heading: 'Clean Tables, Happy Meals',
      lines: [
        'Return your tray and plates to the rack after eating',
        'Throw used tissues into the bin',
        'Share your table when it is crowded',
        'Leave the table the way you would like to find it',
      ],
    },
    prompts: [
      {
        q: 'Look at the poster. Why do you think it was put up at the hawker centre?',
        starters: ['I think it was put up because…', 'If people do not return their trays…', 'So the poster reminds us to…'],
        model:
          'I think it was put up because some people leave their trays and tissues on the table. If people do not return their trays, the next family has nowhere clean to eat and the cleaners have too much work. So the poster reminds us to clear up after ourselves.',
      },
      {
        q: 'Tell me about a time you helped someone outside your home.',
        starters: ['One day, I saw…', 'I decided to…', 'Afterwards, I felt…'],
        model:
          'One day, I saw a boy drop his coins at the bus stop. They rolled everywhere. I decided to help him pick them up before the bus came. Afterwards, I felt glad, because he smiled and said he would not have found them all by himself.',
      },
      {
        q: 'What are some ways children can be considerate in public places?',
        starters: ['One way is…', 'Another way is…', 'These things matter because…'],
        model:
          'One way is to keep our voices down on the bus or train so we do not disturb others. Another way is to give up our seat to someone who needs it more. These things matter because public places belong to everybody, and small actions make them pleasant for all of us.',
      },
    ],
  },
  {
    id: 'oral-upper-01',
    band: 'P5-P6',
    theme: 'Giving your time',
    title: 'The Reading Buddy',
    purpose: 'You are reading this account to pupils who are thinking of volunteering. Read it so that they can feel how the writer changed.',
    passage: [
      'When my form teacher suggested that I volunteer as a reading buddy at the community library, I agreed reluctantly. Giving up my Saturday mornings to read picture books with a six-year-old did not sound like much of an adventure.',
      'My buddy, Haziq, barely looked at me during our first session. He stumbled over simple words and slammed the book shut whenever he made a mistake. I was tempted to read the whole story for him. Instead, I covered the difficult words with my finger and revealed them one sound at a time.',
      'Week after week, the pauses grew shorter. Then, one morning, Haziq read an entire page without stopping. He looked up, astonished, and whispered, "I did it." It struck me then that I had not given up my Saturdays at all. I had exchanged them for something far more valuable.',
    ],
    watch: [
      { word: 'reluctantly', tip: 'rih-LUCK-tunt-lee. Slow down a little; he is unwilling.' },
      { word: 'volunteer', tip: 'vol-un-TEER. The last part is the loud part.' },
      { word: 'revealed', tip: 'rih-VEELD.' },
      { word: 'astonished', tip: 'uh-STON-isht. Let your voice show his surprise.' },
      { word: 'valuable', tip: 'VAL-yoo-bul.' },
    ],
    notice: {
      emoji: '📚',
      heading: 'Reading Buddies Wanted',
      lines: [
        'Help a younger child fall in love with books',
        'Saturdays, 10.00 am to 11.00 am, Children\'s Section, Level 2',
        'Open to pupils aged 10 and above',
        'A short training session will be provided',
        'Register at the counter by the end of the month',
      ],
    },
    prompts: [
      {
        q: 'Look at the poster. Do you think pupils your age would make good reading buddies? Why?',
        starters: ['I believe…', 'This is because…', 'For example…', 'That said…'],
        model:
          'I believe pupils my age would make good reading buddies. This is because we learnt to read not long ago, so we remember which words were hard and how it felt to get stuck. For example, I still remember mixing up "b" and "d", so I would be patient with a child who does the same. That said, we would need the training the poster mentions, because knowing how to read is not the same as knowing how to teach it.',
      },
      {
        q: 'Tell me about a time you taught someone how to do something.',
        starters: ['A few months ago…', 'At first…', 'What worked was…', 'I realised that…'],
        model:
          'A few months ago, I taught my younger cousin to ride a bicycle. At first, she kept looking down at the pedals and wobbling. What worked was asking her to look at a tree far ahead while I held the seat. After a few tries I let go without telling her, and she rode on her own. I realised that teaching is mostly about noticing what the other person is finding hard.',
      },
      {
        q: 'Some people say children are too busy with schoolwork to volunteer. What is your view?',
        starters: ['I can see why some people say that, but…', 'Firstly…', 'Moreover…', 'On balance…'],
        model:
          'I can see why some people say that, but I do not fully agree. Firstly, volunteering need not take much time; an hour a week is less than many of us spend on games. Moreover, it teaches patience and responsibility, which no worksheet can. On balance, I think children should volunteer a little, as long as they choose something they can keep up with during examination periods.',
      },
    ],
  },
  {
    id: 'oral-upper-02',
    band: 'P5-P6',
    theme: 'Using devices wisely',
    title: 'The Sunday Without Screens',
    purpose: 'You are reading this recount to your class during a talk on healthy habits. Read it in a lively way and bring out the humour.',
    passage: [
      'My mother announced it at dinner, as calmly as if she were asking someone to pass the rice. "This Sunday," she said, "nobody in this family will touch a screen." My brother nearly choked on his soup.',
      'By ten o\'clock that Sunday morning, I had tidied my desk, sharpened every pencil I owned and stared at the ceiling for what felt like an hour. Desperate, I wandered into the kitchen, where my father was attempting to bake bread from his grandmother\'s recipe. I ended up kneading dough until my arms ached.',
      'The loaf emerged lopsided and slightly burnt, yet we devoured it within minutes. That afternoon, we cycled along the park connector and played a noisy game of cards after dinner. Nobody asked for the tablet. Although I would never admit it to my mother, I am rather looking forward to next Sunday.',
    ],
    watch: [
      { word: 'announced', tip: 'uh-NOWNST.' },
      { word: 'desperate', tip: 'DES-prit. Two beats when spoken naturally.' },
      { word: 'kneading', tip: 'The "k" is silent. Say NEE-ding.' },
      { word: 'lopsided', tip: 'LOP-sy-did. Enjoy this word; it is meant to be funny.' },
      { word: 'devoured', tip: 'dih-VOW-erd.' },
    ],
    notice: {
      emoji: '📵',
      heading: 'Screen-Free Sunday Challenge',
      lines: [
        'One day. No phones, tablets or television.',
        'Try instead: a board game, a bike ride, cooking together, a visit to the library',
        'Tick each Sunday you complete on the family chart',
        'Four Sundays in a row earns your class a games afternoon',
      ],
    },
    prompts: [
      {
        q: 'Look at the poster. Which of the suggested activities would your family enjoy most? Why?',
        starters: ['My family would probably enjoy…', 'The reason is…', 'It would also give us a chance to…'],
        model:
          'My family would probably enjoy cooking together most. The reason is that we all like food, but on weekdays my parents cook in a rush while my sister and I do homework. It would also give us a chance to talk without anyone glancing at a phone, which rarely happens at our dinner table.',
      },
      {
        q: 'Tell me about something you enjoy doing that does not need a screen.',
        starters: ['Something I really enjoy is…', 'I started when…', 'What I like most about it is…'],
        model:
          'Something I really enjoy is playing badminton at the court below my block. I started when my uncle gave me his old racket two years ago. What I like most about it is that an hour passes without my noticing, and I come home tired in a good way instead of tired from staring at something.',
      },
      {
        q: 'Do you think children today spend too much time on devices? What can be done about it?',
        starters: ['In my opinion…', 'One cause is…', 'A practical step would be…', 'Ultimately…'],
        model:
          'In my opinion, many children do spend too much time on devices, though not all of that time is wasted. One cause is that devices are the easiest thing to reach for when we are bored. A practical step would be for families to agree on screen-free times, such as during meals and the hour before bed, and for parents to follow the same rule. Ultimately, children copy what they see, so the habit has to change for the whole household.',
      },
    ],
  },
]);

/** The sets written for one band, in teaching order. */
export function oralSetsForBand(band) {
  return ORAL_SETS.filter((s) => s.band === band);
}
