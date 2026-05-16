/**
 * Open-ended Comprehension Passages — P1 through P6.
 *
 * Each item includes a full passage, questions, and model answers that
 * students compare against their own responses.
 *
 * Passages are graded by level:
 *   P1 — 80–120 words, 3 questions
 *   P2 — 100–150 words, 3 questions
 *   P3 — 150–200 words, 4 questions
 *   P4 — 200–250 words, 4–5 questions
 *   P5 — 250–350 words, 5 questions
 *   P6 — 350–450 words, 5–6 questions
 */

export const OPEN_COMPREHENSION_PASSAGES = Object.freeze([

  // ─── P1 (migrated from primaryPlaceholders.js) ────────────────────────────

  {
    id: 'oe-p1-1',
    level: 'P1',
    title: 'Sarah and Emma',
    passage: [
      'Sarah was the only child in her family. At times, she would feel very lonely as there was no one at home to play with her. Her parents were always busy working.',
      'Luckily, Sarah had a next-door neighbour named Emma who was the same age as her. Whenever both girls were free, they would go to each other’s homes to play computer games. Sometimes, they would also go to the playground nearby.',
      'One day, Sarah received bad news. Her friend Emma and her family were moving away. When Sarah heard that, she refused to eat or sleep for a few days.',
      'Before Emma left for her new home, she invited Sarah to visit her. Sarah said that she would do so. Both girls made a promise that they would remain friends forever.',
    ].join('\n\n'),
    questions: [
      { q: 'How many people were there in Sarah’s family?', model: 'Three — Sarah and her two parents (she is the only child).' },
      { q: 'What did Sarah and Emma like doing together?', model: 'They played computer games at each other’s homes and sometimes went to the playground nearby.' },
      { q: 'What was the bad news Sarah received?', model: 'Emma and her family were moving away.' },
    ],
  },

  {
    id: 'oe-p1-2',
    level: 'P1',
    title: 'Tim and the Busker',
    passage: [
      'Tim did not like music lessons. He was learning to play the piano at a music school every Saturday. His teacher was very strict with him. He made Tim play a certain part over and over again until it was perfect.',
      'One day, Tim went to a shopping mall and saw a busker playing the piano. As Tim listened to the music, he kept tapping his feet.',
      'Many people came to watch the busker. Whenever he finished playing a tune, people clapped loudly.',
      'Tim wanted to be as good as the busker. From then on, he started practising the piano eagerly and regularly. Soon, he became so good that he was chosen to play the piano on stage.',
    ].join('\n\n'),
    questions: [
      { q: 'How often did Tim have music lessons?', model: 'Once a week — every Saturday.' },
      { q: 'What did Tim do when he listened to the busker?', model: 'He kept tapping his feet to the music.' },
      { q: 'How did Tim feel after watching the busker — and what did he start doing?', model: 'He felt inspired and wanted to be as good as the busker, so he started practising the piano eagerly and regularly.' },
    ],
  },

  {
    id: 'oe-p1-3',
    level: 'P1',
    title: 'Toby and Shadow',
    passage: [
      'Toby loved sunny days, not just for the warmth, but for his best friend, Shadow. Shadow followed Toby everywhere and copied all his actions. One afternoon, Toby had an idea. “I’m going to catch Shadow!” he declared.',
      'He stretched out his butterfly net and charged at the inky outline. Poof! Shadow slipped away. Toby chased after Shadow, but Shadow was too quick for him. He zipped under the fence and climbed up a tree.',
      'Toby plopped down to catch his breath. Just then, he saw Shadow stretching before him in the grass. Toby giggled. Maybe catching Shadow wasn’t the point. The best part was having a friend who could play hide-and-seek with him in the sunshine.',
    ].join('\n\n'),
    questions: [
      { q: 'Why did Toby love sunny days?', model: 'He liked the warmth and being with his best friend Shadow.' },
      { q: 'What does “the inky outline” in paragraph 2 refer to?', model: 'It refers to Toby’s shadow.' },
      { q: 'Why couldn’t Toby catch Shadow?', model: 'Shadow was too quick — it slipped away, zipped under the fence and climbed up a tree.' },
    ],
  },

  {
    id: 'oe-p1-4',
    level: 'P1',
    title: 'Lisa and the Magic Pebble',
    passage: [
      'Lisa was in the woods near her house when she found a small, shiny pebble that was shaped like a bird’s egg. When she picked it up, a soft voice whispered, “Make a wish, but choose wisely.”',
      'Excited, Lisa closed her eyes and wished for her favourite thing: to talk to animals.',
      'Suddenly, the forest around her came to life! A squirrel chattered, “Hello!” and a bird tweeted, “How’s the weather?”',
      'Lisa giggled in amazement. She spent the afternoon chatting with rabbits, foxes, and even a wise old owl. They told her interesting secrets about the woods she had never known.',
      'As the sun set, Lisa thanked the pebble, grateful for the many new friends she had made in the woods.',
    ].join('\n\n'),
    questions: [
      { q: 'Why was the pebble magical?', model: 'It whispered to Lisa and gave her a wish — it could talk.' },
      { q: 'What did Lisa wish for?', model: 'She wished that she could talk to animals.' },
      { q: 'Why was Lisa grateful to the pebble at the end?', model: 'Because of the wish, she had many new animal friends in the woods.' },
    ],
  },

  // ─── P2 ───────────────────────────────────────────────────────────────────

  {
    id: 'oe-p2-1',
    level: 'P2',
    title: 'The School Field Trip',
    passage: [
      'Last Friday, Mrs Chen took Class 2A on a field trip to the Bird Park. The children were very excited when the bus pulled up outside the school gates. They climbed on board, found their seats and waved goodbye to the teachers who stayed behind.',
      'At the Bird Park, a guide named Uncle Rajan led the class through three large aviaries. In the first one, colourful parrots swooped overhead. In the second, tiny sunbirds hovered near bright flowers. In the third, a group of flamingos stood on one leg in a shallow pool.',
      'After the tour, the class sat under a shady tree and ate their packed lunches. Mrs Chen reminded everyone to pick up their wrappers before they left.',
      'On the bus ride back, the children drew pictures of their favourite birds. Wei Jie drew a parrot and coloured it bright red and green. It was the best school day he could remember.',
    ].join('\n\n'),
    questions: [
      { q: 'Where did Class 2A go for their field trip?', model: 'They went to the Bird Park.' },
      { q: 'What did the flamingos do in the third aviary?', model: 'They stood on one leg in a shallow pool.' },
      { q: 'What would you have done if you were Wei Jie on the bus ride home?', model: 'Accept any reasonable personal response, e.g. “I would have drawn a flamingo because I liked how it stood on one leg.”' },
    ],
  },

  {
    id: 'oe-p2-2',
    level: 'P2',
    title: 'The Helpful Neighbour',
    passage: [
      'Old Mr Lim lived alone at the end of Jasmine Street. His knees ached when he walked, so he could not go to the market by himself. Every morning, he sat on his bench and watched the neighbourhood wake up.',
      'One Saturday, a girl named Priya noticed Mr Lim struggling to carry a heavy bag of groceries. She ran over and took the bag from him at once. “Let me help you, Uncle,” she said cheerfully.',
      'After that day, Priya made it a habit to check on Mr Lim every weekend. She helped him with his shopping and sometimes read the newspaper aloud to him. Mr Lim always had a glass of cold barley water ready for her.',
      '“You are like the granddaughter I never had,” Mr Lim told her one afternoon. Priya smiled. She had not expected a simple act of kindness to turn into such a warm friendship.',
    ].join('\n\n'),
    questions: [
      { q: 'Why could Mr Lim not go to the market by himself?', model: 'His knees ached when he walked.' },
      { q: 'What did Priya do every weekend after she first helped Mr Lim?', model: 'She helped him with his shopping and sometimes read the newspaper aloud to him.' },
      { q: 'What would you have done if you were Priya and saw Mr Lim struggling?', model: 'Accept any reasonable personal response, e.g. “I would have offered to carry the bag and asked if he needed any more help.”' },
    ],
  },

  {
    id: 'oe-p2-3',
    level: 'P2',
    title: 'The Surprise Birthday Party',
    passage: [
      'Siti’s birthday was on a Tuesday, and she thought her family had completely forgotten about it. Her mother had not mentioned it at breakfast. Her father had left for work without saying a word. Even her little brother did not wish her in the morning.',
      'At school, her friends acted strangely quiet. Nobody brought up her birthday even once. Siti felt a little sad as she walked home in the afternoon.',
      'When she opened the front door, the lights were off. She stepped inside and flicked on the switch. “SURPRISE!” shouted her family and friends. Balloons in pink and yellow filled the living room. A chocolate cake sat on the table with ten candles glowing on top.',
      'Siti burst into happy tears. Her mother hugged her tight. “Did you really think we forgot?” she laughed. It was the best birthday Siti had ever had.',
    ].join('\n\n'),
    questions: [
      { q: 'Why did Siti feel sad on the way home from school?', model: 'She thought her family and friends had forgotten her birthday because nobody mentioned it all day.' },
      { q: 'What did Siti see when she turned on the lights at home?', model: 'She saw balloons in pink and yellow, and a chocolate cake with ten candles on the table, as well as her family and friends shouting “Surprise!”' },
      { q: 'What would you have done if you were Siti’s friend to help keep the surprise secret?', model: 'Accept any reasonable personal response, e.g. “I would have pretended to be very busy and changed the subject whenever someone mentioned her birthday.”' },
    ],
  },

  {
    id: 'oe-p2-4',
    level: 'P2',
    title: 'The Missing Pet',
    passage: [
      'Aiden had a small golden hamster called Biscuit. Biscuit lived in a blue cage in Aiden’s room and loved to run on his little wheel at night. Aiden fed him sunflower seeds every morning before school.',
      'One afternoon, Aiden came home and found the cage door hanging open. Biscuit was gone! Aiden searched under the bed, behind the bookshelf and inside the wardrobe. He could not find Biscuit anywhere. He began to cry.',
      'His older sister Chloe heard him and came to help. Together, they moved the sofa in the living room. There was Biscuit, sitting happily and chewing a piece of cracker he had found on the floor.',
      '“You silly little thing!” Aiden laughed, scooping Biscuit up gently. After that, he always made sure the cage door was properly locked. He never wanted to lose Biscuit again.',
    ].join('\n\n'),
    questions: [
      { q: 'What did Aiden feed Biscuit every morning?', model: 'He fed Biscuit sunflower seeds.' },
      { q: 'Where did Aiden and Chloe finally find Biscuit?', model: 'They found Biscuit behind the sofa in the living room.' },
      { q: 'What would you have done if your pet went missing?', model: 'Accept any reasonable personal response, e.g. “I would have searched every room and asked my family to help me look.”' },
    ],
  },

  // ─── P3 ───────────────────────────────────────────────────────────────────

  {
    id: 'oe-p3-1',
    level: 'P3',
    title: 'The Volunteer Firefighter',
    passage: [
      'Every third Saturday of the month, Mr Hassan put on his bright red uniform and drove to the fire station. He was not a full-time firefighter — during the week, he worked as a secondary school teacher. But on those Saturdays, he trained alongside the professionals, ready to help if a real fire broke out nearby.',
      'Mr Hassan had become a volunteer firefighter three years earlier, after a small factory near his neighbourhood caught fire. He had watched the firefighters work tirelessly through the night and felt a deep admiration for them. He wanted to do something meaningful with his weekends, so he signed up.',
      'The training was tough. Mr Hassan had to learn how to handle heavy hoses, climb ladders in full gear and carry a person out of a smoke-filled room. At first, he struggled. But he pushed through the discomfort because he believed that protecting others was worth every drop of effort.',
      '“I may not be there every day,” he told his students once, “but when I am needed, I will be ready.” His students thought he was one of the bravest people they knew.',
    ].join('\n\n'),
    questions: [
      { q: 'What is Mr Hassan’s main job during the week?', model: 'He is a secondary school teacher.' },
      { q: 'What does “admiration” mean in paragraph 2?', model: '“Admiration” means a feeling of great respect and appreciation for someone.' },
      { q: 'How do you know that Mr Hassan found the training difficult? Quote from the text.', model: 'The text says “at first, he struggled” and that he had to “push through the discomfort.”' },
      { q: 'Why do you think Mr Hassan’s students admired him?', model: 'They admired him because he chose to spend his free time helping others and training hard so that he could protect lives, even though it was not his main job.' },
    ],
  },

  {
    id: 'oe-p3-2',
    level: 'P3',
    title: 'Green Friday at Greenwood School',
    passage: [
      'Every Friday, Greenwood Primary School looked a little different from other schools. Students came to school carrying reusable bags and empty bottles instead of the usual plastic ones. That was because of “Green Friday”, a recycling programme started by the school’s Environment Club three years ago.',
      'The club had set up three large collection bins near the canteen — one for paper, one for plastic, and one for glass. Every week, students sorted their recyclables and dropped them in. At the end of each term, a recycling company collected the materials and the school received a small payment, which was donated to a local nature charity.',
      'At first, some students forgot which bin was which and mixed up the items. The club members patiently reminded them and even made colourful posters to guide everyone.',
      'By the second year, Green Friday had become something the whole school was proud of. The principal, Mdm Goh, said the programme showed that even small actions, done consistently, could make a real difference to the environment.',
    ].join('\n\n'),
    questions: [
      { q: 'How many collection bins did the Environment Club set up, and what did each one collect?', model: 'There were three bins: one for paper, one for plastic and one for glass.' },
      { q: 'What does “consistently” mean in the final paragraph?', model: '“Consistently” means doing something regularly and without stopping.' },
      { q: 'How do you know the programme was successful? Give one piece of evidence from the text.', model: 'The text says “the whole school was proud of it” and that the principal praised the programme for making a real difference, showing it had grown beyond just a small club activity.' },
      { q: 'Why do you think the author described Green Friday in detail?', model: 'The author wanted to show that students can make a positive impact on the environment and encourage readers to take part in similar efforts in their own schools.' },
    ],
  },

  {
    id: 'oe-p3-3',
    level: 'P3',
    title: 'The Unlikely Friends',
    passage: [
      'At the Sunshine Animal Shelter, the staff were puzzled by an unusual friendship that had formed between a large, scruffy dog named Bruno and a tiny grey rabbit called Pip. Bruno had arrived at the shelter first, after being found wandering alone near a construction site. He was shy and often hid in the corner of his kennel.',
      'When Pip arrived a month later, the staff gave him a small hutch near Bruno’s kennel. On the very first night, Pip squeezed through a gap in his hutch and hopped straight to Bruno. Bruno sniffed the little rabbit carefully, then lay down beside him.',
      'After that, the two animals were inseparable. Bruno stopped hiding in corners. He began eating well and wagging his tail when the staff arrived. The staff believed it was Pip’s gentle company that had helped Bruno come out of his shell.',
      '“Animals surprise us every day,” said the shelter manager, Ms Chong. “Friendship doesn’t always look the way you expect it to.”',
    ].join('\n\n'),
    questions: [
      { q: 'Where was Bruno found before he came to the shelter?', model: 'He was found wandering alone near a construction site.' },
      { q: 'What does “come out of his shell” mean in paragraph 3?', model: 'It means to become less shy and more confident or friendly.' },
      { q: 'How do you know that Bruno was unhappy before Pip arrived? Quote from the text.', model: 'The text says he “was shy and often hid in the corner of his kennel,” showing he was withdrawn and unhappy.' },
      { q: 'What does the shelter manager’s comment tell us about her feelings towards animals?', model: 'Her comment shows that she has great respect and wonder for animals, and believes they are capable of surprising and touching behaviour that humans do not always expect.' },
    ],
  },

  {
    id: 'oe-p3-4',
    level: 'P3',
    title: 'Reaching the Top',
    passage: [
      'When Nadia was seven years old, a doctor told her that she had weak eyesight in her left eye. She would need to wear a thick patch over her stronger right eye for two hours every day to help the weaker eye improve. For Nadia, this was very hard. She could barely see with just her left eye, and wearing the patch made simple tasks like reading and drawing very frustrating.',
      'But Nadia did not give up. Her mother bought her a special sketchbook and encouraged her to draw every day, even with the patch on. Slowly, week by week, her left eye grew stronger. By the time she was nine, the doctor said she no longer needed the patch.',
      'Nadia’s drawing improved greatly too. The daily practice, though painful at first, had made her patient and persistent. At the age of ten, she won first prize in her school’s art competition.',
      '“Wearing that patch taught me that I can get through hard things,” she said during the prize presentation. “I just have to keep trying.”',
    ].join('\n\n'),
    questions: [
      { q: 'What did Nadia have to do every day to help her weaker eye?', model: 'She had to wear a thick patch over her stronger right eye for two hours every day.' },
      { q: 'What does “persistent” mean in paragraph 3?', model: '“Persistent” means continuing to try hard even when something is difficult.' },
      { q: 'How do you know that Nadia found wearing the patch difficult? Give two pieces of evidence from the text.', model: 'First, “she could barely see with just her left eye.” Second, “wearing the patch made simple tasks like reading and drawing very frustrating.”' },
      { q: 'What lesson did Nadia learn from her experience? Use her own words in your answer.', model: 'She learnt that she can get through hard things if she keeps trying. She said: “I just have to keep trying.”' },
    ],
  },

  // ─── P4 ───────────────────────────────────────────────────────────────────

  {
    id: 'oe-p4-1',
    level: 'P4',
    title: 'Saving the Old Shophouse',
    passage: [
      'Along a quiet lane in Tiong Bahru stood a row of shophouses that had been built in the 1930s. Their cream-coloured walls, ornate plaster decorations and green shuttered windows had survived decades of rain and sun. But in 2019, the owner of one of these shophouses announced that he planned to demolish it to make way for a car park.',
      'A group of young heritage enthusiasts, led by university student Kai Wen, started a petition to save the building. They gathered two thousand signatures in just one week and presented them to the Urban Redevelopment Authority. They also created an online photo series showing the shophouse’s history, including black-and-white photographs of the families who had once lived there.',
      'The response from the public was overwhelming. News articles were written. A retired architect gave a talk at the local community centre about the importance of conserving pre-war architecture. The owner eventually agreed to renovate the shophouse instead, and it was gazetted as a conservation building.',
      'Kai Wen reflected on the experience. “I think people assumed that one student couldn’t make a difference,” he said. “But when you show others why something matters, they join you. And together, you can change things.”',
    ].join('\n\n'),
    questions: [
      { q: 'Why was the shophouse under threat in 2019?', model: 'The owner planned to demolish it to make way for a car park.' },
      { q: 'What does “overwhelming” mean in paragraph 3?', model: '“Overwhelming” means very great in amount or force, more than expected.' },
      { q: 'Why did Kai Wen create a photo series showing the shophouse’s history?', model: 'He wanted to show the public that the shophouse had personal and historical significance, hoping that its connection to real families and the past would persuade people to support the effort to save it.' },
      { q: 'How did the community help save the shophouse? Give two pieces of evidence from the text.', model: 'First, the public signed a petition (two thousand signatures in one week). Second, a retired architect gave a public talk about the value of conserving pre-war architecture.' },
      { q: 'Do you agree with Kai Wen’s view that one person can make a difference? Explain your answer.', model: 'Accept any well-reasoned response. E.g. Yes, because Kai Wen’s idea started the whole movement, and his passion convinced thousands of others to care about the issue.' },
    ],
  },

  {
    id: 'oe-p4-2',
    level: 'P4',
    title: 'The Comeback',
    passage: [
      'At fourteen, Jaden was one of the most promising young swimmers in the country. His freestyle stroke was smooth and powerful, and his coaches believed he had a real chance of representing Singapore at the regional games. Then, during a training session in March, he slipped on the wet poolside and fractured his right wrist.',
      'The doctors told him he would need six months off from competitive swimming. Jaden was devastated. He sat in his room for a week, refusing to talk to anyone. Slowly, however, his coach Mr Lim visited him and said something that shifted his thinking. “Champions are not just made in the pool,” Mr Lim said. “They are made in the moments when they choose not to give up.”',
      'Jaden spent the next six months focusing on what he could control: his mental strength, his diet and his kick technique in the water without using his arms. When he returned to full training, he was more focused than ever.',
      'At the regional trials nine months later, Jaden not only qualified but broke his own personal best. Standing on the starting block, he touched the bandage he still sometimes wore on his wrist. It reminded him of what he had come through.',
    ].join('\n\n'),
    questions: [
      { q: 'What injury did Jaden suffer, and how did it happen?', model: 'He fractured his right wrist after slipping on the wet poolside during a training session.' },
      { q: 'What does “devastated” mean in paragraph 2?', model: '“Devastated” means deeply shocked and very upset.' },
      { q: 'Why did Jaden touch his bandage before the regional trials?', model: 'It reminded him of the injury and the difficult months he had come through, giving him strength and motivation.' },
      { q: 'What did Jaden focus on during his six months of recovery?', model: 'He focused on his mental strength, his diet and improving his kick technique in the water without using his arms.' },
      { q: 'What do you think the author wants readers to learn from Jaden’s story?', model: 'The author wants readers to learn that setbacks do not have to end your journey, and that determination and the right attitude during hard times can make you stronger in the end.' },
    ],
  },

  {
    id: 'oe-p4-3',
    level: 'P4',
    title: 'The Community Garden',
    passage: [
      'Plot 12 at the Bishan Community Garden had been empty for two years. The previous tenant had moved away, and nobody seemed keen to take it on. The soil was dry and cracked, and weeds had taken over the space.',
      'That changed when the Teo family from Block 47 adopted the plot. Father, mother and three children arrived one Saturday morning with spades, compost and seedlings. “We are starting small,” said Mrs Teo, kneeling to break up a clump of hard earth. “But we will get there.”',
      'Over the following months, the family transformed the plot. They planted leafy vegetables, chilli plants and a small papaya tree. They also built a simple trellis for their climbing beans. Neighbours who walked past began stopping to chat, and two nearby families even decided to adopt empty plots of their own.',
      'By the end of the year, Plot 12 had become a meeting point for the whole row of gardeners. The Teo children learnt the patience of waiting for seeds to sprout and the satisfaction of eating food they had grown themselves. For the family, the garden had become more than just a hobby — it was the heart of a small, thriving community.',
    ].join('\n\n'),
    questions: [
      { q: 'Why had Plot 12 been empty for two years?', model: 'The previous tenant had moved away and nobody had taken over the plot.' },
      { q: 'What does “thriving” mean in the final paragraph?', model: '“Thriving” means growing strongly and doing very well.' },
      { q: 'How do you know the garden had a positive effect on the neighbourhood? Give one piece of evidence.', model: 'Neighbours who walked past stopped to chat, and two nearby families decided to adopt empty plots of their own, showing the garden brought people together.' },
      { q: 'Why did Mrs Teo say “We are starting small, but we will get there”?', model: 'She was acknowledging that the task was going to take time and effort, but expressing her determination that the family would succeed through steady work.' },
      { q: 'What two lessons did the Teo children learn from the garden?', model: 'They learnt the patience of waiting for seeds to sprout and the satisfaction of eating food they had grown themselves.' },
    ],
  },

  {
    id: 'oe-p4-4',
    level: 'P4',
    title: 'A Drop in the Ocean',
    passage: [
      'When twelve-year-old Preethi read that scientists had found plastic bags at the bottom of the Mariana Trench — the deepest point in the ocean — she felt a heavy unease settle in her chest. She began researching. The statistics were alarming: millions of tonnes of plastic entered the oceans every year. Images of sea turtles tangled in packaging haunted her.',
      'Preethi decided she had to do something. She started a Science Discovery Club at her school, inviting classmates to join after-school sessions where they read research papers, watched documentaries and discussed what students their age could realistically do.',
      'The club’s first project was a three-month audit of the plastic waste in the school canteen. They counted every plastic cup and straw used during lunch. Their report showed that the canteen threw away nearly eight hundred single-use plastics a week. Preethi presented the findings to her principal, who agreed to switch to reusable cups and bamboo straws.',
      '“I know one school can’t fix the ocean,” Preethi said at the end-of-year assembly. “But every drop of change matters. If every school did what we did, the difference would be enormous.”',
    ].join('\n\n'),
    questions: [
      { q: 'What fact made Preethi decide to do something about plastic pollution?', model: 'She read that scientists had found plastic bags at the bottom of the Mariana Trench, the deepest point in the ocean.' },
      { q: 'What does “audit” mean in paragraph 3?', model: 'An “audit” is a careful check or count of something in order to understand the situation accurately.' },
      { q: 'What was the result of the club’s audit at school?', model: 'Their report showed that the canteen threw away nearly eight hundred single-use plastics a week. As a result, the principal agreed to switch to reusable cups and bamboo straws.' },
      { q: 'Why do you think Preethi said “every drop of change matters”?', model: 'She used the word “drop” to connect to water and the ocean, and to suggest that even small actions add up over time, just as drops of water eventually fill a large container.' },
      { q: 'Do you think what Preethi did was effective? Give a reason.', model: 'Accept any well-reasoned response. E.g. Yes, because she used real data from her own school to persuade the principal to make a lasting change, rather than just raising awareness without action.' },
    ],
  },

  // ─── P5 (migrated + new) ──────────────────────────────────────────────────

  {
    id: 'oe-1',
    level: 'P5',
    title: 'Mei Ling and the Lost Watch',
    passage: [
      'Mei Ling raced down the corridor, her heart pounding. The watch her grandfather had given her was missing — she could feel her wrist, bare and cold. She remembered washing her hands in the toilet near the canteen during recess. If anyone had picked it up, she would never forgive herself for being so careless.',
      'In the General Office, Mr Tan smiled kindly. “Is this yours?” he asked, holding up the silver watch. Mei Ling nodded, eyes filling with tears. “A Primary 4 boy returned it before lunch. He said it was on the basin.” Mei Ling realised she had to thank that boy somehow.',
    ].join('\n\n'),
    questions: [
      { q: 'Why was Mei Ling worried at the start of the passage?', model: 'She had lost the watch her grandfather gave her, and she felt very careless because it had sentimental value.' },
      { q: 'Who returned the watch and where was it found?', model: 'A Primary 4 boy returned it. He had found it on the basin in the toilet near the canteen.' },
      { q: 'How did Mei Ling feel at the end of the passage? Give one piece of evidence.', model: 'She felt grateful and relieved. The text says her eyes filled with tears and she wanted to thank the boy somehow.' },
    ],
  },

  {
    id: 'oe-p5-1',
    level: 'P5',
    title: 'The Silver Volunteers',
    passage: [
      'Every Tuesday morning, the community centre on Bukit Timah Road fills with a peculiar energy. Retirees in their sixties and seventies arrive carrying baskets of books, boxes of art supplies and folders of printed worksheets. They are the Silver Volunteers — a group of former teachers, engineers and nurses who give up their mornings to tutor children from low-income families.',
      'The programme was started eight years ago by Mdm Josephine Wee, a retired primary school principal. She had noticed that many children in her neighbourhood were falling behind in school, not because they lacked ability, but because their parents worked multiple jobs and had little time to help with homework. Mdm Wee believed that the elderly had both the time and the experience to fill this gap.',
      'The impact has been significant. Over sixty per cent of the children who join the programme improve their grades within a year. But the volunteers themselves say they benefit too. “I feel useful,” said Mr Raj, seventy-one, who tutors mathematics. “When a child finally understands long division, I feel a joy I never expected in retirement.”',
      'The programme also has an unexpected social dimension. Friendships have formed across generations. Some children visit their tutors during festive seasons, bringing homemade kueh or hand-drawn greeting cards. The seniors, in turn, attend their students’ school concerts and prize-giving ceremonies.',
      '“We tend to think of volunteering as giving,” Mdm Wee reflected. “But in this room, everybody receives something.”',
    ].join('\n\n'),
    questions: [
      { q: 'Why did Mdm Wee start the Silver Volunteers programme?', model: 'She noticed that children in her neighbourhood were falling behind in school because their parents were too busy working to help with homework, and she believed the elderly had both time and experience to help.' },
      { q: 'What does “peculiar” suggest about the energy in the community centre in paragraph 1?', model: '“Peculiar” suggests that the energy is unusual or surprising — not what you would typically expect in a community centre full of elderly people, making the scene seem lively and unexpected.' },
      { q: 'How has the programme benefited the volunteers themselves? Give two pieces of evidence from the text.', model: 'First, Mr Raj says he feels useful and experiences unexpected joy when a child finally grasps a concept. Second, the seniors form meaningful friendships with the children and attend their school events.' },
      { q: 'Compare the benefit the children receive with the benefit the volunteers receive.', model: 'The children receive academic help that improves their grades, while the volunteers receive a sense of purpose, usefulness and the warmth of cross-generational friendships.' },
      { q: 'What does Mdm Wee mean when she says “everybody receives something”?', model: 'She means that volunteering is not one-sided. While the volunteers appear to be giving, they also gain something valuable — purpose, joy and connection — making it a mutually beneficial arrangement.' },
    ],
  },

  {
    id: 'oe-p5-2',
    level: 'P5',
    title: 'The River She Could Not Ignore',
    passage: [
      'Thirteen-year-old Fiona first noticed the problem during a family cycling trip along Sungei Kadut. The river — which she had always thought of as a sleepy brown waterway — was clogged with plastic bottles, styrofoam boxes and tangled fishing lines. A dead fish floated near the bank. She stopped her bicycle and stared.',
      'That evening, Fiona typed out a message to the National Environment Agency describing what she had seen. She did not expect a reply. To her surprise, an officer named Mr Fong called her back within two days. He explained that Sungei Kadut was one of several waterways that received significant amounts of litter from nearby industrial estates, and that the agency had been looking for community partners to help with regular monitoring.',
      'Fiona became one of those partners. Every Saturday for the next six months, she and a rotating group of classmates walked two kilometres of riverbank, photographing litter and logging it into the agency’s online system. The data they collected contributed to a government report that recommended stricter fines for illegal dumping near waterways.',
      '“I just sent one email,” Fiona said, when a local newspaper asked about her involvement. “I didn’t think it would lead to any of this.” But her teacher, who had quietly encouraged her every step of the way, knew better. Real change, she believed, always starts with someone who refuses to look away.',
    ].join('\n\n'),
    questions: [
      { q: 'What made Fiona stop her bicycle during the cycling trip?', model: 'She noticed that the river was clogged with plastic bottles, styrofoam boxes and tangled fishing lines, and a dead fish was floating near the bank.' },
      { q: 'What does “rotating” suggest about the group of classmates in paragraph 3?', model: '“Rotating” suggests that different classmates took turns joining Fiona each Saturday, rather than the same group coming every week, showing that many students were involved over time.' },
      { q: 'How do you know that Fiona’s work had a real impact? Give two pieces of evidence from the text.', model: 'First, the data she collected contributed to a government report. Second, that report recommended stricter fines for illegal dumping near waterways, showing her work led to policy recommendations.' },
      { q: 'What does Fiona’s teacher mean by “someone who refuses to look away”?', model: 'She means that real change begins when one person chooses to take notice of a problem and act on it, rather than ignoring it and hoping someone else will deal with it.' },
      { q: 'Do you think Fiona’s approach was effective? Give your personal view with a reason.', model: 'Accept any well-reasoned response. E.g. Yes, because she did not just complain about the problem — she took a specific, practical action (contacting the agency) and then followed through with months of consistent effort.' },
    ],
  },

  {
    id: 'oe-p5-3',
    level: 'P5',
    title: 'A New Shore',
    passage: [
      'The Pereira family arrived in Singapore on a Wednesday afternoon in January, with four suitcases and a box of photographs. Miguel, who was twelve, pressed his face against the taxi window as the city scrolled past — towers of glass, flyovers draped in bougainvillea, hawker centres already bustling at five in the afternoon. Everything was familiar and strange at once, like a word you know but cannot quite pronounce.',
      'His parents had moved for work: his father had been posted to the Singapore office of an engineering firm, and his mother had found a teaching position at an international school. For them, the move was an opportunity. For Miguel, it felt like an interruption.',
      'At Riverside Primary, Miguel’s teacher, Ms Loh, assigned a classmate named Darren to show him around. Darren was quiet and methodical, the opposite of Miguel’s boisterous friends back in Lisbon. But Darren was also patient, and on the third day, he brought Miguel to a hawker centre and ordered for them both without hesitation. “Try the char kway teow,” Darren said. “Everything feels less foreign when you’ve got good food in front of you.”',
      'Miguel smiled for the first time since arriving. He thought of the box of photographs sitting unopened in his bedroom. He would unpack it soon, he decided. But for now, he was here — and here, it turned out, was not so bad.',
    ].join('\n\n'),
    questions: [
      { q: 'Why had the Pereira family moved to Singapore?', model: 'Miguel’s father had been posted to the Singapore office of an engineering firm, and his mother had found a teaching position at an international school.' },
      { q: 'What does “methodical” suggest about Darren’s character?', model: '“Methodical” suggests that Darren is careful, organised and systematic in the way he does things, contrasting with Miguel’s more lively, outgoing personality.' },
      { q: 'How does Miguel feel about the move compared to his parents? Give one piece of evidence for each.', model: 'His parents saw the move as an opportunity (the text says “for them, the move was an opportunity”). Miguel felt it as an interruption to his life (the text says “for Miguel, it felt like an interruption”).' },
      { q: 'What does the simile “like a word you know but cannot quite pronounce” tell us about Miguel’s experience of Singapore?', model: 'It tells us that Singapore felt both recognisable and unfamiliar to Miguel at the same time — he could see what things were, but he had not yet found a way to connect to them fully.' },
      { q: 'By the end of the passage, how has Miguel’s attitude begun to change? Support your answer with evidence.', model: 'He has become slightly more open and hopeful. He smiles for the first time and decides to unpack his photographs soon, showing he is beginning to settle in and accept his new home.' },
    ],
  },

  {
    id: 'oe-p5-4',
    level: 'P5',
    title: 'The Last Rattan Weaver',
    passage: [
      'In a narrow shophouse in Chinatown, eighty-two-year-old Mr Tong Ah Kwee bends over a bundle of pale rattan strips, his fingers moving with a speed that belies his age. He has been weaving rattan furniture for sixty years — chairs, baskets and lampshades that once furnished the homes of thousands of Singapore families. Today, however, he is one of the last rattan weavers left in the country.',
      'At the height of the industry in the 1970s, there were over two hundred rattan workshops in Singapore. Most of them closed as cheaper machine-made furniture flooded the market and younger generations chose not to take up the trade. “It is hard work,” Mr Tong admits, wincing as he stretches his back. “And you cannot get rich from it. So why would a young person learn?”',
      'His apprentice, twenty-six-year-old Leon, would answer differently. Leon had discovered rattan weaving at a heritage workshop three years earlier and was immediately drawn to the slow, meditative rhythm of the craft. “When I am weaving, I feel connected to something that has lasted generations,” he said. “That means something to me.”',
      'Heritage groups have called for the craft to be recognised as part of Singapore’s intangible cultural heritage. Mr Tong is cautiously hopeful. “I do not need a certificate,” he says quietly. “I just need one person who loves this work enough to keep it alive. And now I have Leon.”',
    ].join('\n\n'),
    questions: [
      { q: 'Why did most rattan workshops in Singapore close down?', model: 'Cheaper machine-made furniture flooded the market and younger generations chose not to take up the trade.' },
      { q: 'What does “belies his age” suggest about Mr Tong in paragraph 1?', model: 'It suggests that his speed and skill are surprising for someone his age — his hands move quickly, making him seem younger than he is.' },
      { q: 'Why did Leon choose to learn rattan weaving, and how does his reason differ from Mr Tong’s view?', model: 'Leon was drawn to the craft because it connected him to something lasting and meaningful. Mr Tong, by contrast, sees it as hard work that does not pay well, and doubts any young person would choose it for those reasons.' },
      { q: 'What does Mr Tong’s final quote reveal about his priorities?', model: 'It reveals that he cares more about the survival of the craft than about official recognition. He sees Leon’s commitment as far more valuable than any certificate or award.' },
      { q: 'Do you think traditional crafts like rattan weaving should be preserved? Give your personal view and a reason.', model: 'Accept any well-reasoned response. E.g. Yes, because traditional crafts are part of a community’s identity and history, and once they disappear, that connection to the past cannot be fully recovered.' },
    ],
  },

  // ─── P6 ───────────────────────────────────────────────────────────────────

  {
    id: 'oe-p6-1',
    level: 'P6',
    title: 'The Keeper of Emerald Hill',
    passage: [
      'On a Tuesday afternoon in October, a crowd of schoolchildren spilled through the wrought-iron gate of a Peranakan terrace house on Emerald Hill Road. Their guide, a compact woman named Mrs Betsy Lim, stood at the door in a floral kebaya, waiting for them to settle.',
      '“This house was built in 1910,” she began, her voice unhurried, her hands clasped in front of her. “My great-grandmother cooked in that kitchen. My grandmother learnt to read at that table. My mother married my father in the courtyard outside.” She paused, letting the weight of the years settle. “History is not only what you read in textbooks. It lives in walls.”',
      'Mrs Lim had inherited the house from her mother and spent the last two decades resisting pressure to sell it. Developers had approached her four times. Each time, she had declined. The house was gazetted as a conservation building in 2008, which offered some legal protection — but not from the rising costs of upkeep. Roof repairs alone had cost her eighty thousand dollars the previous year.',
      'Despite the financial strain, she had opened the house as a heritage education centre, running free tours for schools and offering Peranakan cooking classes on weekends. “If I sell, the house might be preserved physically,” she told one journalist. “But it will become a showroom. A thing people look at, not something they feel. I am not willing to accept that.”',
      'The children moved slowly through the rooms, touching the cool blue tiles, peering at the ornate ancestral altar, asking questions Mrs Lim answered with care and humour. One girl tugged on her sleeve. “Do you ever feel lonely, keeping all this by yourself?” she asked.',
      'Mrs Lim smiled. “Not on days like today.”',
    ].join('\n\n'),
    questions: [
      { q: 'Why has Mrs Lim refused to sell the house despite the financial strain?', model: 'She believes that selling would reduce the house to a showroom — something people look at rather than feel — and she is unwilling to let it lose its living, personal significance.' },
      { q: 'What does “unhurried” suggest about the impression the writer creates of Mrs Lim?', model: '“Unhurried” suggests that Mrs Lim is calm, confident and deliberate — she is not nervous or rushed, which creates an impression of a woman who is fully at ease with her history and her role as its keeper.' },
      { q: 'How do you know that maintaining the house is a significant financial burden? Give two pieces of evidence.', model: 'First, developers had approached her four times to buy it, suggesting the property has high commercial value that she is forgoing. Second, roof repairs alone cost her eighty thousand dollars the previous year.' },
      { q: 'What impression does the writer create of Mrs Lim as a person? Support your answer with two examples from the text.', model: 'The writer creates the impression of a principled, warm woman who is deeply committed to her heritage. First, she resists four offers from developers, showing strong principles. Second, she runs free tours for schoolchildren and answers their questions “with care and humour,” showing warmth and generosity.' },
      { q: 'What do Mrs Lim’s final words — “Not on days like today” — reveal about what gives her life meaning?', model: 'They reveal that the presence of others — especially young people engaging with the history of the house — gives her a sense of purpose and connection that offsets the difficulties of maintaining the property alone.' },
      { q: 'Do you think heritage buildings in Singapore should always be preserved, even at great personal cost? Give your personal view with a reason.', model: 'Accept any well-reasoned response. E.g. Not always, because the financial cost can be unsustainable, and sometimes a building can be preserved while also being adapted for practical use — the key is that its history is not erased.' },
    ],
  },

  {
    id: 'oe-p6-2',
    level: 'P6',
    title: 'What We Throw Away',
    passage: [
      'Singapore generated about 665,000 tonnes of food waste in 2023 — enough to fill about 51,000 double-decker buses. It is a number that sits uncomfortably alongside images of empty shelves at food banks and families who skip meals to make rent. The gap between excess and insufficiency, in a city this prosperous, demands attention.',
      'Much of this waste is invisible to those who produce it. A household opens a refrigerator, sees yesterday’s leftovers, decides it does not feel like eating them, and throws the container away. A restaurant over-prepares for a dinner service, finds itself with sixty portions left at closing time, and bags them for the rubbish truck. The scale is enormous; the individual decisions are small, even mundane.',
      'What makes the problem stubborn is that it straddles the personal and the systemic. Food waste happens in kitchens and supermarkets, yes — but it is also driven by packaging regulations that require product standardisation, business models that rely on over-supply to prevent stock-outs, and consumer expectations of perfect-looking produce. Fixing it requires action at every level.',
      'Grassroots efforts have made a dent. Community fridges placed outside HDB blocks allow residents to leave surplus food for neighbours. Schools have incorporated food-waste audits into their curriculum. Food rescue organisations redirect thousands of meals a week from caterers and hotels to charities. But recycling food waste into energy — which Singapore is increasingly doing — is not the same as preventing the waste from occurring in the first place.',
      'The real shift, several food-policy experts argue, must happen in how we think about food. Not as a commodity that is cheap, abundant and endlessly replaceable, but as a resource with real costs — environmental, moral and economic. When we throw food away, we are not just discarding a meal. We are discarding the water that grew it, the labour that harvested it, and the opportunity to have fed someone who needed it.',
    ].join('\n\n'),
    questions: [
      { q: 'According to paragraph 1, why is Singapore’s food waste figure described as sitting “uncomfortably”?', model: 'It sits uncomfortably because it contrasts sharply with the reality of food banks with empty shelves and families who skip meals — the huge amount of waste exists alongside genuine hunger and poverty.' },
      { q: 'What does “mundane” mean in paragraph 2, and why is this significant in the context of food waste?', model: '“Mundane” means ordinary and unremarkable. It is significant because it shows that the everyday, small decisions people make without thinking — like discarding leftovers — collectively add up to a massive problem.' },
      { q: 'What does the writer mean by saying food waste “straddles the personal and the systemic”? Use evidence from the text.', model: 'The writer means that food waste is caused by both individual decisions (e.g. households throwing away leftovers) and larger structural forces (e.g. packaging regulations, business models, consumer expectations), so it cannot be solved at just one level.' },
      { q: 'How have grassroots efforts helped reduce food waste? Give two examples from the text.', model: 'Community fridges outside HDB blocks allow residents to share surplus food with neighbours. Food rescue organisations redirect thousands of meals a week from caterers and hotels to charities.' },
      { q: 'What does the writer suggest is the most important change needed to address food waste?', model: 'The writer argues that the most important shift is a change in mindset — from seeing food as a cheap, replaceable commodity to seeing it as a resource with real environmental, moral and economic costs.' },
      { q: 'Do you agree that individuals should take more responsibility for food waste, or is it mainly a systemic problem? Give your personal view with a reason.', model: 'Accept any well-reasoned response. E.g. Both, because even if the systems change, individual habits are what produce waste day-to-day. Systemic change and personal responsibility need to work together.' },
    ],
  },

  {
    id: 'oe-p6-3',
    level: 'P6',
    title: 'The Mangrove at the Edge of the City',
    passage: [
      'Forty minutes from Raffles Place, on the north-western edge of Singapore, there is a pocket of forest that sounds nothing like a city. Water drips from the canopy. Mudskippers drag themselves across the grey silt. Fiddler crabs wave their single oversized claw at passers-by. This is Sungei Buloh Wetland Reserve, one of the last significant mangrove habitats left in Singapore — and one that almost did not survive.',
      'In the 1980s, the site was earmarked for a prawn farm. A group of birdwatchers, alarmed by the loss of habitat they had been documenting for years, submitted a detailed proposal to the government arguing for its preservation. They were not scientists; they were hobbyists. But their report was meticulous, their photographs compelling, and their case persuasive. In 1993, Sungei Buloh became Singapore’s first nature reserve gazetted primarily for migratory birds.',
      'Today the reserve shelters over five hundred species of fauna, including rare migratory birds that travel thousands of kilometres from Siberia and Alaska. It is a critical stopover on the East Asian-Australasian Flyway, a migratory route connecting the Arctic tundra to Australia. Without places like Sungei Buloh, these birds have nowhere to rest and refuel.',
      'The reserve also plays a quieter, less glamorous role. Mangrove forests act as natural buffers against coastal flooding, absorbing wave energy and stabilising shorelines. Their root systems trap sediment, improving water clarity. And they store carbon at rates that rival tropical rainforests — meaning every mangrove tree that remains standing is a small, silent argument against climate change.',
      'Visitors who come expecting a manicured park often leave surprised. The reserve is deliberately wild. Boardwalks allow people to walk above the mud without disturbing the ecosystem. Signs point out what to look for, but nature does not perform on cue. You have to learn to wait, and look, and be still. Perhaps that, more than anything else, is what a mangrove teaches you.',
    ].join('\n\n'),
    questions: [
      { q: 'What was Sungei Buloh originally planned to be used for in the 1980s?', model: 'It was earmarked to be developed as a prawn farm.' },
      { q: 'What does “meticulous” suggest about the birdwatchers’ report?', model: '“Meticulous” suggests that the report was extremely careful, thorough and detailed, leaving nothing overlooked — which was impressive given that the writers were amateurs rather than trained scientists.' },
      { q: 'Why is Sungei Buloh described as “critical” for migratory birds? Give two reasons from the text.', model: 'First, it is a key stopover on the East Asian-Australasian Flyway where birds rest and refuel. Second, without such stopovers, birds travelling thousands of kilometres from places like Siberia and Alaska would have nowhere to rest.' },
      { q: 'What impression does the writer create of the mangrove as a place? Support your answer with two examples.', model: 'The writer creates the impression of a place that is alive, wild and quietly powerful. First, the opening description — dripping water, mudskippers, fiddler crabs — creates a vivid, teeming sense of life. Second, the final paragraph notes the reserve is “deliberately wild” and that “nature does not perform on cue,” suggesting a humbling, unhurried environment.' },
      { q: 'What do you think the writer means in the final sentence: “Perhaps that, more than anything else, is what a mangrove teaches you”?', model: 'The writer means that the most important thing the mangrove offers is not just ecological facts or scenic beauty, but the experience of patience and stillness — of learning to observe and wait rather than expecting the world to entertain you.' },
      { q: 'Should natural habitats always be protected, even when land is needed for development? Give your personal view and a reason.', model: 'Accept any well-reasoned response. E.g. Not always, but they should be protected when they provide irreplaceable ecological functions — as Sungei Buloh does with flood protection, carbon storage and migration — because once destroyed, those functions cannot easily be restored.' },
    ],
  },

  {
    id: 'oe-p6-4',
    level: 'P6',
    title: 'The Long Way Round',
    passage: [
      'At eleven, Zara had been a competitive gymnast for five years. She trained six days a week, woke at five in the morning during competition season, and had given up birthday parties, school camps and lazy Saturday afternoons without complaint. Gymnastics was not something she did. It was, as her coach often said, something she was.',
      'Then came the fall. During a floor routine in the regional trials, Zara landed badly from a back tuck and tore the ligament in her left knee. The surgery was straightforward, the doctors said. The recovery would take at least ten months.',
      'Ten months felt like an eternity. Zara watched her teammates train from a plastic chair at the edge of the gym, her leg elevated on a foam block. She attended school normally but felt curiously absent from herself, as though the part of her that made sense of everything had been removed along with the damaged tissue.',
      'Her physiotherapist, Ms Nurul, noticed this. “Your body heals at its own pace,” she told Zara during a session. “But so does the rest of you. Give it time.” She suggested Zara try something entirely new — something low-impact that would still give her the structure she was used to. Zara chose photography.',
      'She had not expected to care about it. But there was something in the deliberate act of framing a shot — deciding what to include, what to leave out, where to place the light — that felt unexpectedly familiar. It required the same quality of attention she brought to a routine: precise, patient, focused.',
      'When Zara returned to gymnastics at twelve, she was not exactly the same gymnast she had been before. She was more considered in her preparation, quicker to recognise what her body needed, and less afraid of imperfection. Her coach noticed. “Something settled in you while you were away,” he said. Zara thought about the photographs stacked on her desk at home. “Yes,” she agreed. “Something did.”',
    ].join('\n\n'),
    questions: [
      { q: 'What does the phrase “Gymnastics was not something she did. It was something she was” tell us about Zara?', model: 'It tells us that gymnastics was central to Zara’s identity — it was not just a hobby or activity, but the core of who she was as a person.' },
      { q: 'What does “curiously absent from herself” mean in paragraph 3?', model: 'It means Zara felt disconnected from herself — as if the part of her personality that gave her life meaning and structure had disappeared along with gymnastics.' },
      { q: 'How did photography help Zara during her recovery? Give two pieces of evidence from the text.', model: 'First, it gave her structure, which she was used to from gymnastics. Second, the skill it required — precision, patience and focus — felt familiar and gave her a meaningful way to channel her attention.' },
      { q: 'How had Zara changed as a gymnast when she returned? Give two examples from the text.', model: 'She was more considered in her preparation and quicker to recognise what her body needed. She was also less afraid of imperfection, showing she had matured emotionally during her recovery.' },
      { q: 'What impression does the writer create of Zara as a character throughout the passage? Support with two examples.', model: 'The writer creates the impression of a disciplined, resilient girl who grows through adversity. First, she trained six days a week and gave up social events “without complaint,” showing strong discipline. Second, she found a way to grow through her injury via photography, showing resilience and an open mind.' },
      { q: 'Do you think setbacks always make a person stronger? Give your personal view and a reason.', model: 'Accept any well-reasoned response. E.g. Not always, but setbacks can make a person stronger if they find a productive way to respond to them, as Zara did by using her recovery time to develop a new skill that enriched her overall character.' },
    ],
  },

]);
