/**
 * Word banks and passage bodies for the generated Word Vault passages.
 *
 * Each category has two bands: `lower` for P1–P3 and `upper` for P4–P6, so a
 * P1 child and a P6 child no longer practise the same answer words. Every
 * band has three answers (one per blank, in order), three distractors and
 * three bodies. `{context}` is replaced with a school occasion from the level.
 *
 * Every blank names its own clue. `spans` are the words that actually decide
 * the answer (a strong tap in clue-hunt mode); `partial` are words that point
 * the right way but are not enough on their own; `why` is what the child is
 * told afterwards. Clues are written by hand because the deciding words are
 * often before the blank ("Although … stressful"), which no fixed window of
 * neighbouring words finds.
 *
 * Rules every body follows (checked in vocabPassageGenerator.test.js):
 * - each blank has exactly one bank word that fits;
 * - every clue word appears in the body;
 * - a distractor never appears in the body, except where the category uses
 *   the opposite word as the clue (synonymContrast) or the bank is a closed
 *   set of function words (the grammar categories).
 */

const clue = (spans, partial, why) => ({ spans, partial, why });

export const GENERATED_BANKS = {
  contextInference: {
    lower: {
      answers: ['muddy', 'umbrella', 'dry'],
      distractors: ['sunny', 'helmet', 'noisy'],
      templates: [
        {
          body: "It rained all night. After {context}, the field was ___ and Mei's shoes were brown with dirt. When dark clouds came back, she opened her ___ to keep the rain off. She stood under the roof so her worksheet stayed ___.",
          clues: [
            clue(['brown with dirt'], ['rained all night'], 'Rain turns soil into wet dirt, and her shoes came back brown with it. The field was muddy.'),
            clue(['keep the rain off'], ['opened'], 'You open an umbrella to keep the rain off. A helmet is not something you open.'),
            clue(['under the roof'], ['worksheet'], 'The roof kept the rain away, so her worksheet stayed dry.'),
          ],
        },
        {
          body: 'Before {context}, a big storm passed. Ravi stepped into a puddle, and his socks were ___ with brown, wet soil. He forgot to open his ___, so raindrops fell on his hair. A towel helped him get ___ again.',
          clues: [
            clue(['brown, wet soil'], ['puddle'], 'Brown, wet soil on his socks means they were muddy.'),
            clue(['raindrops fell on his hair'], ['forgot to open'], 'An umbrella keeps raindrops off your hair. He did not open it, so he got wet.'),
            clue(['towel'], ['again'], 'A towel soaks up water, so it helped him get dry again.'),
          ],
        },
        {
          body: 'After {context}, Siti saw that the rain had turned the garden path ___ and slippery. She opened her ___ and held it over her head as more rain fell. Inside, she hung her wet coat by the fan until it was ___.',
          clues: [
            clue(['rain had turned', 'slippery'], ['garden path'], 'Rain turns a soil path into wet, slippery dirt. That is muddy.'),
            clue(['more rain fell'], ['over her head'], 'She held it over her head while rain fell, so it was her umbrella.'),
            clue(['by the fan'], ['wet coat'], 'The fan blew air on the wet coat until the water was gone, so it was dry.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['drenched', 'shelter', 'shivering'],
      distractors: ['scorching', 'audience', 'drowsy'],
      templates: [
        {
          body: "During {context}, a sudden downpour caught the class outdoors. Within seconds, Hana's uniform was ___ and water dripped from her sleeves. The teacher led everyone to the nearest ___ to wait out the storm. In the cold wind, Hana was ___ until she wrapped herself in a towel.",
          clues: [
            clue(['water dripped from her sleeves'], ['sudden downpour'], 'Water dripping from her sleeves shows she was wet all the way through, which is what drenched means.'),
            clue(['wait out the storm'], ['led everyone'], 'A shelter is a place that keeps you safe from bad weather while it passes.'),
            clue(['cold wind'], ['wrapped herself in a towel'], 'Cold wind on wet clothes makes your body shake. That is shivering, and the towel helped her warm up.'),
          ],
        },
        {
          body: 'Halfway through {context}, thunder rumbled and rain poured down. Those who had no umbrella were ___ from head to toe. The group ran to a bus stop, the only ___ nearby. Their wet shirts clung to them, and several pupils were ___ with cold in the air-conditioned bus.',
          clues: [
            clue(['from head to toe'], ['no umbrella'], 'Pouring rain, no umbrella, and wet from head to toe: they were drenched.'),
            clue(['ran to a bus stop'], ['rain poured down'], 'A bus stop has a roof, so it was the only shelter from the rain.'),
            clue(['with cold'], ['wet shirts clung'], 'Wet shirts in cold air make you shake with cold. They were shivering.'),
          ],
        },
        {
          body: 'After {context}, Wei Jie cycled home under grey clouds. A heavy shower left his school bag ___, and every page inside was soaked. He waited under a void deck, a dry ___ from the rain. By the time he reached home, his teeth were chattering and he was ___.',
          clues: [
            clue(['every page inside was soaked'], ['heavy shower'], 'If every page inside the bag was soaked, the whole bag was drenched.'),
            clue(['under a void deck'], ['from the rain'], 'The void deck covered him from the rain, so it was a shelter.'),
            clue(['teeth were chattering'], ['grey clouds'], 'Chattering teeth are a sign of being cold. He was shivering.'),
          ],
        },
      ],
    },
  },

  definitionMatch: {
    lower: {
      answers: ['canteen', 'clinic', 'classroom'],
      distractors: ['bakery', 'zoo', 'garage'],
      templates: [
        {
          body: 'After {context}, pupils buy noodles and drinks at the ___. When Lee felt sick, he went to the ___ to see the nurse. Then he went back to his ___ and sat at his desk.',
          clues: [
            clue(['buy noodles and drinks'], ['pupils'], 'The canteen is where you buy food and drinks in school.'),
            clue(['see the nurse'], ['felt sick'], 'The clinic is where a nurse looks after you when you feel sick.'),
            clue(['sat at his desk'], ['went back'], 'Your desk is in your classroom.'),
          ],
        },
        {
          body: 'Before {context}, Jun queues for a meal in the ___. He scraped his knee, so the nurse cleaned it in the ___. Then he hung his bag on his chair in the ___, where his teacher was waiting.',
          clues: [
            clue(['queues for a meal'], ['Jun'], 'The canteen is where you queue for a meal.'),
            clue(['nurse cleaned it'], ['scraped his knee'], 'A nurse cleans cuts in the clinic.'),
            clue(['teacher was waiting'], ['hung his bag on his chair'], 'Your chair and your teacher are in your classroom.'),
          ],
        },
        {
          body: 'During {context}, the class ate rice at the ___. Mei had a fever, so she lay down in the school ___. Later, the class did their spelling at their desks in the ___.',
          clues: [
            clue(['ate rice'], ['class'], 'The canteen is where pupils eat in school.'),
            clue(['had a fever'], ['lay down'], 'A sick pupil rests in the school clinic.'),
            clue(['did their spelling at their desks'], ['Later'], 'Desks for lessons are in the classroom.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['archive', 'laboratory', 'auditorium'],
      distractors: ['observatory', 'pharmacy', 'greenhouse'],
      templates: [
        {
          body: 'During {context}, Priya visited the ___, where old records and photographs are stored. Next, she carried out an experiment with beakers in the ___. Finally, she joined hundreds of pupils watching a speech in the ___.',
          clues: [
            clue(['old records and photographs are stored'], ['visited'], 'An archive is a place where old records are kept safely.'),
            clue(['experiment with beakers'], ['carried out'], 'A laboratory is a room for science experiments.'),
            clue(['hundreds of pupils watching a speech'], ['joined'], 'An auditorium is a large hall where an audience watches talks and shows.'),
          ],
        },
        {
          body: 'For {context}, the team searched the ___ for letters written a hundred years ago. They tested water samples under supervision in the ___. Then they presented their findings on stage in the ___ to a large audience.',
          clues: [
            clue(['letters written a hundred years ago'], ['searched'], 'Very old letters are kept in an archive.'),
            clue(['tested water samples'], ['supervision'], 'Testing samples is lab work, done in a laboratory.'),
            clue(['on stage', 'large audience'], ['presented'], 'A stage and a large audience tell you it was an auditorium.'),
          ],
        },
        {
          body: 'After {context}, Marcus asked the librarian to let him into the ___ to study historical documents. In the ___, he mixed chemicals while wearing goggles. At the prize-giving in the ___, every seat facing the stage was filled.',
          clues: [
            clue(['historical documents'], ['librarian'], 'Historical documents are kept in an archive.'),
            clue(['mixed chemicals', 'wearing goggles'], ['while'], 'Mixing chemicals with goggles on happens in a laboratory.'),
            clue(['every seat facing the stage'], ['prize-giving'], 'Rows of seats facing a stage are found in an auditorium.'),
          ],
        },
      ],
    },
  },

  synonymContrast: {
    lower: {
      answers: ['cheerful', 'rude', 'brief'],
      distractors: ['gloomy', 'polite', 'lengthy'],
      templates: [
        {
          body: "After {context}, Jia got good news. She was not sad at all; she looked ___ and smiled all day. The boy who pushed into the queue was not polite. He was ___. The teacher's talk was short, not long. It was a ___ talk.",
          clues: [
            clue(['smiled all day'], ['not sad'], '"Not sad" and "smiled all day" point to a happy word: cheerful. Gloomy means the opposite.'),
            clue(['not polite'], ['pushed into the queue'], '"Not polite" means the opposite of polite, which is rude.'),
            clue(['short, not long'], ['talk'], '"Short, not long" means the talk was brief. Lengthy means long, the opposite.'),
          ],
        },
        {
          body: 'During {context}, Omar felt happy and ___ because his team won. One player shouted mean words, which was ___ instead of kind. The coach gave a quick, ___ speech so everyone could go home.',
          clues: [
            clue(['happy'], ['team won'], '"And" joins two words that mean almost the same. Happy and cheerful go together.'),
            clue(['instead of kind'], ['mean words'], '"Instead of kind" asks for the opposite of kind. Shouting mean words is rude.'),
            clue(['quick'], ['go home'], 'Quick and brief mean almost the same: short.'),
          ],
        },
        {
          body: "After {context}, the classroom felt bright and ___, not gloomy. Taking a friend's pencil without asking is ___, but asking first is polite. The note was ___, with only five words.",
          clues: [
            clue(['not gloomy'], ['bright'], '"Not gloomy" asks for the opposite of gloomy: cheerful.'),
            clue(['but asking first is polite'], ['without asking'], '"But" shows a contrast with polite. The opposite of polite is rude.'),
            clue(['only five words'], ['note'], 'A note with only five words is brief.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['optimistic', 'courteous', 'concise'],
      distractors: ['pessimistic', 'arrogant', 'verbose'],
      templates: [
        {
          body: 'Although many teams had given up during {context}, Daniel remained ___ and believed they could still win. Unlike his boastful classmate, he was ___ to every visitor, greeting them warmly. His summary was ___; he explained the whole plan in two sentences.',
          clues: [
            clue(['believed they could still win'], ['Although', 'given up'], '"Although" sets up a contrast: others gave up, but Daniel believed they could win. That hopeful attitude is optimistic.'),
            clue(['greeting them warmly'], ['Unlike', 'boastful'], '"Unlike" signals the opposite of boastful. Greeting people warmly shows he was courteous.'),
            clue(['in two sentences'], ['whole plan'], 'Explaining a whole plan in two sentences is short and clear, which is concise. Verbose means using too many words.'),
          ],
        },
        {
          body: 'During {context}, Mei expected success, so she felt ___, whereas her partner kept expecting failure. She was polite and ___, holding the door for the speakers. Her report was ___ rather than long-winded.',
          clues: [
            clue(['expected success'], ['whereas', 'expecting failure'], '"Whereas" shows a contrast. Her partner expected failure; Mei expected success, so she was optimistic.'),
            clue(['polite'], ['holding the door'], '"Polite and ___" asks for a word with the same meaning. Courteous means polite.'),
            clue(['rather than long-winded'], ['report'], '"Rather than long-winded" means not using too many words. That is concise.'),
          ],
        },
        {
          body: 'After {context}, the coach praised Ravi for staying hopeful and ___ even when they were losing. He thanked the referee politely, showing he was ___, not rude. His speech was short and ___, without unnecessary words.',
          clues: [
            clue(['hopeful'], ['even when they were losing'], 'Hopeful and optimistic mean almost the same, even when things look bad.'),
            clue(['thanked the referee politely'], ['not rude'], 'Thanking someone politely shows he was courteous, the opposite of rude.'),
            clue(['without unnecessary words'], ['short'], 'Short, with no unnecessary words: that is concise.'),
          ],
        },
      ],
    },
  },

  morphologicalAffix: {
    lower: {
      answers: ['reusable', 'rewrite', 'careless'],
      distractors: ['unhappy', 'preview', 'helper'],
      templates: [
        {
          body: 'After {context}, we washed our ___ bottles so we could use them again tomorrow. My sentence had mistakes, so I had to ___ it and write it again. Ben rushed and did not check his work. His ___ work had many mistakes.',
          clues: [
            clue(['use them again'], ['washed'], 'Re- means again and -able means can be. A reusable bottle can be used again.'),
            clue(['write it again'], ['mistakes'], 'Re- means again, so rewrite means write again.'),
            clue(['did not check his work'], ['rushed'], '-less means without. Careless means without care, like rushing and not checking.'),
          ],
        },
        {
          body: 'Before {context}, Lily packed a ___ lunch box that she can use again and again. Her teacher asked her to ___ her story, writing it a second time with neater letters. She tried not to be ___, so she checked every word with care.',
          clues: [
            clue(['use again and again'], ['lunch box'], 'Re- means again and -able means can be. She can use it again, so it is reusable.'),
            clue(['writing it a second time'], ['neater letters'], 'Writing something a second time is to rewrite it. Re- means again.'),
            clue(['checked every word with care'], ['tried not to be'], 'She checked with care so she would not be careless. Careless means without care.'),
          ],
        },
        {
          body: 'After {context}, we made bags from old cloth. The bags are ___, so we can use them many times. Sam wanted to ___ his name card, so he wrote it again in bigger letters. He spilled paint because he was ___ and did not watch his brush.',
          clues: [
            clue(['use them many times'], ['old cloth'], 'Bags you can use many times are reusable.'),
            clue(['wrote it again'], ['bigger letters'], 'He wrote it again, so he wanted to rewrite it.'),
            clue(['did not watch his brush'], ['spilled paint'], 'Not watching what you do is careless. -less means without.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['irreversible', 'misinterpreted', 'effortless'],
      distractors: ['unbreakable', 'preheated', 'fearless'],
      templates: [
        {
          body: 'During {context}, the teacher warned that mixing the two chemicals causes an ___ change; once it happens, it cannot be undone. Jun ___ the instructions, so he understood them wrongly and used the wrong beaker. With practice, the next attempt felt ___, as if it took no effort at all.',
          clues: [
            clue(['cannot be undone'], ['once it happens'], 'Ir- means not and -ible means able to be. Irreversible means not able to be reversed, or undone.'),
            clue(['understood them wrongly'], ['wrong beaker'], 'Mis- means wrongly. Misinterpreted means understood wrongly.'),
            clue(['took no effort at all'], ['practice'], '-less means without. Effortless means without effort.'),
          ],
        },
        {
          body: 'In {context}, the class learned that burning paper is ___ because the ash can never become paper again. Mei ___ her friend\'s joke, understanding it wrongly as an insult. After weeks of training, her dive looked smooth and ___, needing no effort.',
          clues: [
            clue(['can never become paper again'], ['burning paper'], 'A change that can never be undone is irreversible. Ir- means not.'),
            clue(['understanding it wrongly'], ['insult'], 'Mis- means wrongly. She misinterpreted the joke.'),
            clue(['needing no effort'], ['smooth'], '-less means without. Needing no effort is effortless.'),
          ],
        },
        {
          body: 'After {context}, the leader explained that cutting down an old forest is ___, because the trees cannot be put back for hundreds of years. Some pupils ___ the poster\'s message and read its meaning the wrong way. Ali solved the puzzle in seconds; it looked ___ for him.',
          clues: [
            clue(['cannot be put back'], ['hundreds of years'], 'Something that cannot be put back is irreversible.'),
            clue(['read its meaning the wrong way'], ['message'], 'Reading a meaning the wrong way is to misinterpret it. Mis- means wrongly.'),
            clue(['in seconds'], ['solved the puzzle'], 'Solving a puzzle in seconds looks effortless, without effort.'),
          ],
        },
      ],
    },
  },

  collocationCloze: {
    lower: {
      answers: ['make', 'heavy', 'attention'],
      distractors: ['do', 'strong', 'look'],
      templates: [
        {
          body: "Before {context}, our group must ___ a decision together. Dark clouds brought ___ rain, so we stayed inside. The teacher said, 'Please pay ___ to the instructions.'",
          clues: [
            clue(['decision'], ['together'], 'We say "make a decision", not "do a decision". Make and decision go together.'),
            clue(['rain'], ['Dark clouds'], 'We say "heavy rain" for a lot of rain, not "strong rain".'),
            clue(['pay'], ['instructions'], 'We say "pay attention". Pay and attention are word partners.'),
          ],
        },
        {
          body: 'During {context}, we had to ___ a choice quickly. The weather report warned of ___ rain all afternoon. Everyone must pay ___ to the safety signs.',
          clues: [
            clue(['choice'], ['quickly'], 'We say "make a choice", not "do a choice".'),
            clue(['rain'], ['weather report'], 'We say "heavy rain", not "strong rain".'),
            clue(['pay'], ['safety signs'], 'We say "pay attention", not "pay look".'),
          ],
        },
        {
          body: 'After {context}, the leaders asked us to ___ a plan as a team. The ___ rain made the field too wet for games. When the bell rang, we paid ___ and lined up.',
          clues: [
            clue(['plan'], ['team'], 'We say "make a plan". Make and plan are word partners.'),
            clue(['rain'], ['too wet'], 'Lots of rain is "heavy rain", not "strong rain".'),
            clue(['paid'], ['bell rang'], 'We say "paid attention", not "paid look".'),
          ],
        },
      ],
    },
    upper: {
      answers: ['reach', 'keep', 'raise'],
      distractors: ['arrive', 'hold', 'lift'],
      templates: [
        {
          body: 'During {context}, the committee argued for an hour before they could ___ a conclusion. Lin had promised to bring the posters, and she always tries to ___ her promises. Our posters aimed to ___ awareness about saving water.',
          clues: [
            clue(['conclusion'], ['argued for an hour'], 'We "reach a conclusion". "Arrive" needs "at" after it, so "arrive a conclusion" is wrong.'),
            clue(['promises'], ['tries'], 'We "keep a promise", meaning we do what we said. We do not "hold" a promise.'),
            clue(['awareness'], ['posters'], 'We "raise awareness", meaning help more people know about something. "Lift awareness" is not used.'),
          ],
        },
        {
          body: 'After {context}, the class voted to ___ an agreement about the new rules. A good leader must ___ every promise made to the team. The campaign helped ___ awareness of dengue prevention.',
          clues: [
            clue(['agreement'], ['voted'], 'We "reach an agreement" when everyone finally agrees.'),
            clue(['promise'], ['good leader'], 'We "keep a promise", not "hold a promise".'),
            clue(['awareness'], ['campaign'], 'Campaigns "raise awareness". "Lift awareness" is not a word partner.'),
          ],
        },
        {
          body: 'In {context}, both sides finally managed to ___ a compromise. Ravi said he would help, so he had to ___ his word. The talk will ___ awareness about cyber safety.',
          clues: [
            clue(['compromise'], ['both sides'], 'We "reach a compromise" when both sides meet in the middle.'),
            clue(['word'], ['said he would help'], '"Keep your word" means do what you said you would do.'),
            clue(['awareness'], ['talk'], 'We "raise awareness" about a topic.'),
          ],
        },
      ],
    },
  },

  grammaticalRole: {
    lower: {
      answers: ['careful', 'carefully', 'success'],
      distractors: ['care', 'successful', 'succeed'],
      templates: [
        {
          body: "Before {context}, Mum said, 'Be ___ with the scissors.' We cut the card slowly and ___. Our model stood up straight. It was a big ___!",
          clues: [
            clue(['Be'], ['scissors'], 'After "be" we need a describing word (an adjective). Careful describes how to be.'),
            clue(['slowly'], ['cut'], '"Slowly and ___" tells how we cut, so it needs an -ly word like slowly: carefully.'),
            clue(['big'], ['stood up straight'], 'After "a big" we need a naming word (a noun). Success is the noun.'),
          ],
        },
        {
          body: 'During {context}, our teacher reminded us to be ___ near the pond. We walked ___ along the edge so nobody slipped. Nobody fell in, so the trip was a ___.',
          clues: [
            clue(['be'], ['near the pond'], 'After "be" we need a describing word (an adjective): careful.'),
            clue(['walked'], ['nobody slipped'], 'The blank tells HOW we walked, so it needs the -ly form: carefully.'),
            clue(['trip'], ['Nobody fell in'], '"The trip was a ___" needs a naming word (a noun): success.'),
          ],
        },
        {
          body: 'After {context}, Ali was very ___ not to spill when he poured the water. He held the cup ___ with both hands. Not one drop spilled, and his teacher called it a great ___.',
          clues: [
            clue(['very'], ['not to spill'], '"Very ___" describes Ali, so it needs an adjective: careful.'),
            clue(['held the cup'], ['both hands'], 'The blank tells HOW he held the cup, so it needs the -ly form: carefully.'),
            clue(['great'], ['Not one drop spilled'], 'After "a great" we need a noun: success.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['persistence', 'persistently', 'persistent'],
      distractors: ['persist', 'persisted', 'persists'],
      templates: [
        {
          body: "During {context}, Farah's ___ paid off when her model finally worked. She had tested it ___, trying again after every failure. Her teacher praised her as a ___ learner who never gave up.",
          clues: [
            clue(["Farah's"], ['paid off'], "After a possessive like Farah's we need a noun. Persistence is the noun form (-ence)."),
            clue(['tested it'], ['trying again'], 'The blank tells how she tested, so it needs the adverb form ending in -ly.'),
            clue(['learner'], ['never gave up'], 'A word before the noun "learner" that describes it is an adjective: persistent.'),
          ],
        },
        {
          body: 'In {context}, the coach said ___ matters more than talent. The team trained ___ every morning, even in the rain. They became a ___ group that refused to quit.',
          clues: [
            clue(['matters more than talent'], ['coach said'], 'The blank is the subject of "matters" and is compared with "talent", another noun. It needs the noun: persistence.'),
            clue(['trained'], ['every morning'], 'The blank tells how they trained, so it needs the adverb: persistently.'),
            clue(['group'], ['refused to quit'], 'A describing word before the noun "group" is an adjective: persistent.'),
          ],
        },
        {
          body: "After {context}, the judges noticed Ken's ___ in fixing the robot. He worked ___ until midnight. Because he was so ___, the robot moved at last.",
          clues: [
            clue(["Ken's"], ['noticed'], "After Ken's we need a noun: persistence."),
            clue(['worked'], ['until midnight'], 'The blank tells how he worked, so it needs the adverb: persistently.'),
            clue(['so'], ['Because'], '"So ___" after "was" describes Ken, so it needs an adjective: persistent.'),
          ],
        },
      ],
    },
  },

  connectorClue: {
    lower: {
      answers: ['brave', 'calm', 'tired'],
      distractors: ['scared', 'upset', 'lively'],
      templates: [
        {
          body: 'After {context}, the class went to the park. The slide was very tall, but Zara was ___ and climbed to the top. Even though a dog barked loudly, she stayed ___ and did not cry. She ran around the field ten times, so she was ___ and sat down to rest.',
          clues: [
            clue(['climbed to the top'], ['but'], '"But" shows something unexpected. The slide was tall, but she climbed it anyway. She was brave, not scared.'),
            clue(['did not cry'], ['Even though'], '"Even though" shows a surprise. A loud dog could be scary, but she did not cry. She stayed calm, not upset.'),
            clue(['ran around the field ten times'], ['so'], '"So" shows what happens next. Running ten times around the field makes you tired, so she sat down to rest.'),
          ],
        },
        {
          body: 'After {context}, Amir had to speak in front of the class. He felt nervous, but he was ___ and spoke loudly. His paper fell, but he stayed ___ and picked it up slowly. He had talked for a long time, so he was ___ and needed a drink.',
          clues: [
            clue(['spoke loudly'], ['felt nervous'], '"But" shows a surprise: he felt nervous, yet he spoke loudly. That is brave.'),
            clue(['picked it up slowly'], ['paper fell'], 'He did not rush or panic. He picked it up slowly, so he stayed calm.'),
            clue(['talked for a long time'], ['needed a drink'], '"So" shows a result. Talking for a long time made him tired.'),
          ],
        },
        {
          body: 'Before {context}, there was a big spider on the desk. Lin was ___ and moved it outside, even though her friends screamed. When everyone was shouting, she stayed ___ and spoke softly. She had carried heavy books all morning, so her arms were ___.',
          clues: [
            clue(['moved it outside'], ['even though'], 'Her friends screamed, but Lin moved the spider outside. She was brave.'),
            clue(['spoke softly'], ['shouting'], 'Everyone shouted, but she spoke softly. She stayed calm.'),
            clue(['carried heavy books all morning'], ['so'], '"So" shows a result. Carrying heavy books all morning makes your arms tired.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['determined', 'focused', 'patient'],
      distractors: ['discouraged', 'distracted', 'impatient'],
      templates: [
        {
          body: 'Although the task in {context} was difficult, Zara stayed ___ and refused to give up. Even though the hall was noisy, she remained ___ on her notes. Since the printer was slow, everyone had to be ___ and wait quietly.',
          clues: [
            clue(['Although', 'refused to give up'], ['difficult'], '"Although" sets up a contrast: the task was hard, yet she refused to give up. That is determined, not discouraged.'),
            clue(['Even though', 'notes'], ['noisy'], '"Even though" sets up a contrast: the hall was noisy, yet she kept her attention on her notes. She remained focused, not distracted.'),
            clue(['Since', 'wait quietly'], ['printer was slow'], '"Since" gives a reason: the printer was slow, so everyone had to wait quietly. That is patient.'),
          ],
        },
        {
          body: 'Although the {context} session was stressful, Amir stayed ___ and kept practising. His friends were chatting nearby, yet he stayed ___ on his revision cards. Since the queue moved slowly, the class had to remain ___.',
          clues: [
            clue(['Although', 'kept practising'], ['stressful'], '"Although" sets up a contrast: it was stressful, yet he kept practising. He stayed determined.'),
            clue(['yet', 'revision cards'], ['chatting'], '"Yet" signals a contrast: his friends were chatting, but he kept his attention on his cards. He stayed focused, not distracted.'),
            clue(['Since', 'moved slowly'], ['remain'], '"Since" gives a reason: the queue was slow, so the class had to wait without complaining. That is patient.'),
          ],
        },
        {
          body: 'Although the plan for {context} changed twice, Lin stayed ___ to finish on time. Despite the loud announcements, she remained ___ on the key points. Because help arrived late, the group had to be ___ while they waited.',
          clues: [
            clue(['Although', 'finish on time'], ['changed twice'], '"Although" sets up a contrast: the plan kept changing, yet she still aimed to finish on time. She was determined.'),
            clue(['Despite', 'key points'], ['loud announcements'], '"Despite" signals a contrast: the announcements were loud, yet she kept her mind on the key points. She remained focused.'),
            clue(['Because', 'waited'], ['arrived late'], '"Because" gives the reason they had to wait: help was late. Waiting calmly is being patient.'),
          ],
        },
      ],
    },
  },

  idiomaticExpressions: {
    lower: {
      answers: ['piece of cake', 'under the weather', 'on cloud nine'],
      distractors: ['raining cats and dogs', 'in hot water', 'cold feet'],
      templates: [
        {
          body: 'After {context}, the spelling quiz was so easy. It was a ___! The next day, Ken had a cough and a runny nose, so he felt ___. When he got a gold star, he was so happy he felt ___.',
          clues: [
            clue(['so easy'], ['spelling quiz'], '"A piece of cake" means something very easy.'),
            clue(['cough and a runny nose'], ['felt'], '"Under the weather" means feeling sick.'),
            clue(['so happy'], ['gold star'], '"On cloud nine" means very, very happy.'),
          ],
        },
        {
          body: 'During {context}, Mia finished the puzzle in one minute. It was a ___. Her friend Siti stayed home with a fever because she was ___. When Mia won the prize, she was ___ and smiled all day.',
          clues: [
            clue(['in one minute'], ['finished the puzzle'], 'Finishing in one minute means it was very easy, a piece of cake.'),
            clue(['with a fever'], ['stayed home'], 'Having a fever means feeling sick: under the weather.'),
            clue(['smiled all day'], ['won the prize'], 'Smiling all day after winning means very happy: on cloud nine.'),
          ],
        },
        {
          body: 'Before {context}, Dad said tying shoelaces is a ___ and very easy once you practise. Grandma had a sore throat and felt ___, so she rested in bed. When our class won the race, we were ___!',
          clues: [
            clue(['very easy'], ['once you practise'], '"A piece of cake" means very easy.'),
            clue(['sore throat'], ['rested in bed'], 'A sore throat means feeling sick: under the weather.'),
            clue(['won the race'], ['our class'], 'Winning the race made us very happy: on cloud nine.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['break the ice', 'spill the beans', 'hit the books'],
      distractors: ['call it a day', 'cut corners', 'beat around the bush'],
      templates: [
        {
          body: 'At the start of {context}, nobody knew each other, so the leader told a joke to ___ and get everyone talking. Jia promised to keep the surprise party a secret, but her little brother might ___. With exams next week, Raj decided to ___ and study every evening.',
          clues: [
            clue(['nobody knew each other'], ['get everyone talking'], '"Break the ice" means making strangers relaxed enough to start talking.'),
            clue(['keep the surprise party a secret'], ['little brother'], '"Spill the beans" means telling a secret.'),
            clue(['study every evening'], ['exams next week'], '"Hit the books" means study hard.'),
          ],
        },
        {
          body: 'During {context}, the new pupils sat in awkward silence until a quick game helped ___. Ahmad knew who had won the award, but he refused to ___ before the announcement. Since the test was on Monday, Lin had to ___ all weekend.',
          clues: [
            clue(['awkward silence'], ['quick game'], 'A game that ends an awkward silence helps break the ice.'),
            clue(['before the announcement'], ['who had won'], 'Telling the winner before the announcement would spill the beans, so he kept quiet.'),
            clue(['test was on Monday'], ['all weekend'], 'A test coming up means studying hard all weekend: hit the books.'),
          ],
        },
        {
          body: 'Before {context}, the emcee asked everyone to share a fun fact to ___ with the visitors they had just met. Do not ___ about the secret plan, or the surprise will be ruined. If you want a good grade, you need to ___ tonight instead of playing games.',
          clues: [
            clue(['just met'], ['fun fact'], 'Sharing fun facts with people you have just met helps break the ice.'),
            clue(['surprise will be ruined'], ['secret plan'], 'Telling the secret would ruin the surprise. That is spilling the beans.'),
            clue(['good grade'], ['instead of playing games'], 'Studying instead of playing to get a good grade is hitting the books.'),
          ],
        },
      ],
    },
  },

  proverbsSayings: {
    lower: {
      answers: ['practice', 'bird', 'hands'],
      distractors: ['sleep', 'fish', 'feet'],
      templates: [
        {
          body: "Before {context}, Sam could not skip rope. He tried every day, and soon he could! Coach said that ___ makes perfect. Lily woke up first and got the best seat. Mum said, 'The early ___ catches the worm.' When the whole class tidied up together, it took two minutes. 'Many ___ make light work,' said the teacher.",
          clues: [
            clue(['tried every day'], ['soon he could'], 'He kept trying every day and got better. "Practice makes perfect" means doing something again and again makes you good at it.'),
            clue(['woke up first'], ['best seat'], '"The early bird catches the worm" means people who come early get the best things.'),
            clue(['whole class tidied up together'], ['two minutes'], '"Many hands make light work" means a job is easy when many people help.'),
          ],
        },
        {
          body: 'During {context}, Ali kept reading aloud every night until he read smoothly. His teacher smiled and said that ___ makes perfect. Mei came to the stall before everyone else and got the last cookie, just like the early ___ that catches the worm. Ten friends carried the chairs at once, which shows that many ___ make light work.',
          clues: [
            clue(['every night'], ['read smoothly'], 'Reading every night made him better. Practice makes perfect.'),
            clue(['before everyone else'], ['last cookie'], 'Coming before everyone else is being the early bird.'),
            clue(['Ten friends'], ['carried the chairs'], 'Ten friends sharing the job makes it easy: many hands make light work.'),
          ],
        },
        {
          body: "After {context}, Jun played his piano piece again and again, and remembered that ___ makes perfect. He arrived at the library when it opened and borrowed the newest book. 'The early ___ catches the worm,' said the librarian. Then everyone helped to stack the books, because many ___ make light work.",
          clues: [
            clue(['again and again'], ['piano piece'], 'Doing something again and again is practice, and practice makes perfect.'),
            clue(['when it opened'], ['newest book'], 'Arriving as soon as it opened got him the newest book, like the early bird.'),
            clue(['everyone helped'], ['stack the books'], 'When everyone helps, the job is easy: many hands make light work.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['actions', 'cover', 'leap'],
      distractors: ['promises', 'title', 'nap'],
      templates: [
        {
          body: 'During {context}, Ravi promised to help but never did, while Wei quietly finished the job. The teacher reminded them that ___ speak louder than words. The new pupil looked shy, yet she gave the best speech, so do not judge a book by its ___. Before signing up for the hike, Lin read the route carefully, because you should look before you ___.',
          clues: [
            clue(['quietly finished the job'], ['promised to help but never did'], 'What Wei did mattered more than what Ravi said. "Actions speak louder than words" means what you do shows more than what you say.'),
            clue(['gave the best speech'], ['looked shy'], 'She looked shy but was a great speaker. "Don\'t judge a book by its cover" means don\'t judge by how things look.'),
            clue(['read the route carefully'], ['Before signing up'], '"Look before you leap" means think carefully before you act.'),
          ],
        },
        {
          body: 'After {context}, the class captain did not just talk about recycling; she set up the bins herself. Her teacher said ___ speak louder than words. The old laptop looked worn out but ran perfectly, reminding us not to judge a book by its ___. Jun checked the depth of the pool before diving in. Wise people look before they ___.',
          clues: [
            clue(['set up the bins herself'], ['did not just talk'], 'She did the work instead of only talking about it. Actions speak louder than words.'),
            clue(['ran perfectly'], ['looked worn out'], 'It looked old but worked well, so don\'t judge a book by its cover.'),
            clue(['checked the depth'], ['before diving in'], 'Checking first before diving is looking before you leap.'),
          ],
        },
        {
          body: 'Before {context}, the volunteers showed they cared by cleaning the beach instead of just posting about it, proving that ___ speak louder than words. A plain-looking stall sold the tastiest food, so never judge a book by its ___. Mei compared three plans before choosing one, since it is wise to look before you ___.',
          clues: [
            clue(['cleaning the beach'], ['instead of just posting'], 'Cleaning the beach is doing, not just saying. Actions speak louder than words.'),
            clue(['tastiest food'], ['plain-looking'], 'A plain stall with the tastiest food: don\'t judge a book by its cover.'),
            clue(['compared three plans'], ['before choosing'], 'Comparing plans before choosing is looking before you leap.'),
          ],
        },
      ],
    },
  },

  scienceTechTerms: {
    lower: {
      answers: ['magnifying glass', 'thermometer', 'magnet'],
      distractors: ['scissors', 'ruler', 'paintbrush'],
      templates: [
        {
          body: 'During {context}, we used a ___ to make a tiny ant look bigger. We checked how hot the water was with a ___. A ___ pulled the paper clips across the table.',
          clues: [
            clue(['make a tiny ant look bigger'], ['used'], 'A magnifying glass makes small things look bigger.'),
            clue(['how hot the water was'], ['checked'], 'A thermometer tells you how hot or cold something is. A ruler measures length.'),
            clue(['pulled the paper clips'], ['across the table'], 'A magnet pulls things made of iron or steel, like paper clips.'),
          ],
        },
        {
          body: 'After {context}, Mia held a ___ over a leaf to see its small lines up close. Her teacher used a ___ to find out if she had a fever. Mia picked up iron nails with a ___.',
          clues: [
            clue(['see its small lines up close'], ['leaf'], 'A magnifying glass helps you see small things up close.'),
            clue(['if she had a fever'], ['find out'], 'A thermometer measures how hot your body is, to check for a fever.'),
            clue(['picked up iron nails'], ['Mia'], 'A magnet picks up things made of iron.'),
          ],
        },
        {
          body: 'Before {context}, Jun looked at a grain of sand through a ___. He put a ___ in the cup to measure how cold the ice water was. He found that a ___ sticks to the fridge door but not to wood.',
          clues: [
            clue(['grain of sand'], ['looked at'], 'A grain of sand is tiny. A magnifying glass makes it look bigger.'),
            clue(['how cold the ice water was'], ['measure'], 'A thermometer measures how hot or cold something is.'),
            clue(['sticks to the fridge door'], ['not to wood'], 'A magnet sticks to metal like a fridge door, but not to wood.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['microscope', 'data', 'sensor'],
      distractors: ['telescope', 'opinion', 'battery'],
      templates: [
        {
          body: 'During {context}, we used a ___ to observe tiny cells that are invisible to the naked eye. We recorded each temperature reading in a table as ___ to compare later. The robot stopped when its ___ detected movement.',
          clues: [
            clue(['tiny cells', 'invisible to the naked eye'], ['observe'], 'A microscope shows things too small to see. A telescope shows things far away.'),
            clue(['recorded each temperature reading'], ['compare later'], 'Readings recorded in a table are data, facts collected to compare.'),
            clue(['detected movement'], ['robot stopped'], 'A sensor is the part of a machine that detects a change, like movement.'),
          ],
        },
        {
          body: 'In {context}, the team placed a drop of pond water under a ___ to view the bacteria. They collected measurements from twenty trials and analysed the ___ on a graph. A light ___ switched the lamp on automatically when it got dark.',
          clues: [
            clue(['view the bacteria'], ['drop of pond water'], 'Bacteria are far too small to see, so you need a microscope.'),
            clue(['collected measurements'], ['graph'], 'Measurements collected from trials are data.'),
            clue(['when it got dark'], ['automatically'], 'A light sensor detects when it gets dark and switches the lamp on.'),
          ],
        },
        {
          body: 'After {context}, pupils examined mould on bread through a ___ that magnified it 400 times. They logged the number of spores they counted as ___. A smoke ___ beeped as soon as it detected the burnt toast.',
          clues: [
            clue(['magnified it 400 times'], ['mould'], 'Making something look 400 times bigger needs a microscope.'),
            clue(['number of spores they counted'], ['logged'], 'Numbers you count and log are data.'),
            clue(['detected the burnt toast'], ['beeped'], 'A smoke sensor detects smoke and beeps.'),
          ],
        },
      ],
    },
  },

  socialStudiesVocab: {
    lower: {
      answers: ['neighbours', 'rules', 'firefighter'],
      distractors: ['strangers', 'toys', 'baker'],
      templates: [
        {
          body: 'After {context}, we waved to our ___, the people who live next door. We follow the ___ so everyone stays safe. A ___ came quickly to put out the fire.',
          clues: [
            clue(['live next door'], ['waved'], 'Neighbours are the people who live next door.'),
            clue(['stays safe'], ['follow'], 'We follow rules to keep everyone safe.'),
            clue(['put out the fire'], ['came quickly'], 'A firefighter puts out fires. A baker bakes bread.'),
          ],
        },
        {
          body: "Before {context}, Ali helped his ___ who live in the flat beside his. The class made ___ like 'Walk, don't run' to keep everyone safe. The ___ sprayed water on the burning building.",
          clues: [
            clue(['flat beside his'], ['helped'], 'People who live in the flat beside yours are your neighbours.'),
            clue(["Walk, don't run"], ['keep everyone safe'], '"Walk, don\'t run" tells us what to do. It is one of the class rules.'),
            clue(['sprayed water on the burning building'], ['burning'], 'A firefighter sprays water on fires.'),
          ],
        },
        {
          body: 'During {context}, Mei shared her cookies with her ___ next door. At the crossing, we obey the ___ and wait for the green man. A ___ climbed the tall ladder to stop the fire.',
          clues: [
            clue(['next door'], ['shared her cookies'], 'The people next door are your neighbours.'),
            clue(['wait for the green man'], ['obey'], 'Waiting for the green man is a road safety rule we obey.'),
            clue(['stop the fire'], ['tall ladder'], 'A firefighter climbs ladders to stop fires.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['citizen', 'election', 'volunteer'],
      distractors: ['tourist', 'policy', 'customer'],
      templates: [
        {
          body: 'As a Singapore ___, Amir has rights and duties in his own country. During {context}, pupils voted in an ___ to choose their class leaders. Mei worked at the food bank as a ___, helping without being paid.',
          clues: [
            clue(['rights and duties'], ['his own country'], 'A citizen belongs to a country and has rights and duties there. A tourist is only visiting.'),
            clue(['voted'], ['choose their class leaders'], 'An election is a vote to choose leaders.'),
            clue(['without being paid'], ['food bank'], 'A volunteer helps without being paid.'),
          ],
        },
        {
          body: 'During {context}, each ___ was reminded that belonging to a country comes with responsibilities. The school held an ___ where everyone cast a vote for the student council. Siti signed up as a ___ to clean the beach for free.',
          clues: [
            clue(['belonging to a country'], ['responsibilities'], 'A citizen is someone who belongs to a country and has responsibilities there.'),
            clue(['cast a vote'], ['student council'], 'Casting a vote to pick a council is an election.'),
            clue(['for free'], ['signed up'], 'Someone who works for free is a volunteer.'),
          ],
        },
        {
          body: 'After {context}, the speaker said every ___ should obey the laws of the nation they belong to. In the ___, the candidate with the most votes became captain. A ___ gave up her Saturday to teach children, asking for no pay.',
          clues: [
            clue(['nation they belong to'], ['obey the laws'], 'A citizen belongs to a nation and obeys its laws.'),
            clue(['most votes'], ['candidate'], 'Votes and candidates tell you it was an election.'),
            clue(['asking for no pay'], ['gave up her Saturday'], 'Helping for no pay is what a volunteer does.'),
          ],
        },
      ],
    },
  },

  grammarPrepositions: {
    lower: {
      answers: ['in', 'between', 'under'],
      distractors: ['on', 'at', 'beside'],
      templates: [
        {
          body: 'After {context}, I put my pencils ___ my pencil case and zipped it shut. I sat ___ Ben and Mia. Ben was to my left, and Mia was to my right. My bag was ___ the table, down by my feet.',
          clues: [
            clue(['zipped it shut'], ['pencil case'], 'Zipped shut means the pencils are inside the case, so we use "in".'),
            clue(['left', 'right'], ['Ben and Mia'], 'One friend on the left and one on the right means I was in the middle: "between".'),
            clue(['feet'], ['down'], 'Down by my feet, below the table, means "under".'),
          ],
        },
        {
          body: 'Before {context}, the crayons were ___ the box with the lid closed. The clock hangs ___ the door and the window. The cat hid ___ the chair, below the seat.',
          clues: [
            clue(['lid closed'], ['box'], 'With the lid closed, the crayons are inside the box: "in".'),
            clue(['door', 'window'], ['hangs'], 'In the middle of two things, the door and the window, is "between".'),
            clue(['below'], ['seat'], 'Below the seat means "under" the chair.'),
          ],
        },
        {
          body: 'After {context}, we watched the fish swim ___ the tank full of water. Our teacher stood ___ the two tall shelves. The ball rolled ___ the bed, and I had to crawl down low to reach it.',
          clues: [
            clue(['full of water'], ['tank'], 'The fish swim inside the water in the tank: "in".'),
            clue(['two'], ['shelves'], 'In the middle of two shelves is "between".'),
            clue(['crawl down low'], ['reach'], 'Crawling down low to reach it means the ball was "under" the bed.'),
          ],
        },
      ],
    },
    upper: {
      answers: ['among', 'throughout', 'despite'],
      distractors: ['between', 'although', 'beside'],
      templates: [
        {
          body: 'During {context}, the prize was shared ___ the five team members. The lights stayed on ___ the whole night, from dusk until dawn. The match went ahead ___ the heavy rain.',
          clues: [
            clue(['five team members'], ['shared'], '"Among" is used for more than two people. "Between" is for two.'),
            clue(['from dusk until dawn'], ['whole night'], '"Throughout" means from the start to the end of a time.'),
            clue(['heavy rain'], ['went ahead'], '"Despite" comes before a noun and shows a contrast: the rain did not stop the match. "Although" needs a full clause, like "although it rained".'),
          ],
        },
        {
          body: 'After {context}, the snacks were divided ___ all twenty pupils. Mr Tan stayed calm ___ the long meeting, from the first speech to the last. The team kept going ___ their tiredness.',
          clues: [
            clue(['all twenty pupils'], ['divided'], 'Twenty pupils is more than two, so we use "among".'),
            clue(['from the first speech to the last'], ['long meeting'], 'From the start to the end of the meeting is "throughout".'),
            clue(['tiredness'], ['kept going'], '"Despite" goes before a noun like "tiredness" to show a contrast.'),
          ],
        },
        {
          body: 'Before {context}, the secret was whispered ___ the members of the large group. The fan ran ___ the entire afternoon without stopping. The volunteers finished the clean-up ___ the scorching heat.',
          clues: [
            clue(['members of the large group'], ['whispered'], 'A large group has many members, so we use "among".'),
            clue(['entire afternoon'], ['without stopping'], 'For the whole afternoon without stopping is "throughout".'),
            clue(['scorching heat'], ['finished'], '"Despite" goes before a noun ("the scorching heat") to show the heat did not stop them.'),
          ],
        },
      ],
    },
  },

  grammarArticles: {
    lower: {
      answers: ['an', 'a', 'the'],
      distractors: ['some', 'many', 'much'],
      templates: [
        {
          body: 'Before {context}, Mira packed ___ umbrella in her bag. She borrowed ___ pencil from her partner. At the gate, she thanked ___ guard who helped her cross the road.',
          clues: [
            clue(['umbrella'], ['packed'], '"Umbrella" starts with a vowel sound (u), so we use "an".'),
            clue(['pencil'], ['borrowed'], '"Pencil" starts with a consonant sound (p), so we use "a".'),
            clue(['who helped her'], ['guard'], 'We know exactly which guard: the one who helped her. "The" points to one special thing.'),
          ],
        },
        {
          body: 'After {context}, Dan ate ___ apple. He wrote in ___ notebook. Then he gave back ___ book that his teacher lent him.',
          clues: [
            clue(['apple'], ['ate'], '"Apple" starts with a vowel sound (a), so we use "an".'),
            clue(['notebook'], ['wrote'], '"Notebook" starts with a consonant sound (n), so we use "a".'),
            clue(['teacher lent him'], ['gave back'], 'We know which book: the one his teacher lent him. So we use "the".'),
          ],
        },
        {
          body: 'During {context}, Ava carried ___ orange bag. She drew ___ cat for her class poster. At night, she looked up at ___ moon, the only one in our sky.',
          clues: [
            clue(['orange'], ['carried'], '"Orange" starts with a vowel sound (o), so we use "an".'),
            clue(['cat'], ['drew'], '"Cat" starts with a consonant sound (c), so we use "a".'),
            clue(['only one'], ['moon'], 'There is only one moon in our sky, so we use "the".'),
          ],
        },
      ],
    },
    upper: {
      answers: ['an', 'a', 'the'],
      distractors: ['many', 'much', 'few'],
      templates: [
        {
          body: "During {context}, we waited for ___ hour before the bus arrived. Mei's sister studies at ___ university in Australia. We watched ___ sun set behind the hills.",
          clues: [
            clue(['hour'], ['waited'], '"Hour" starts with a silent h, so it begins with a vowel sound ("our"). We use "an".'),
            clue(['university'], ['studies'], '"University" starts with a "you" sound, which is a consonant sound, so we use "a".'),
            clue(['sun'], ['set behind the hills'], 'There is only one sun, so we use "the".'),
          ],
        },
        {
          body: 'After {context}, Raj gave ___ honest answer when asked who broke the vase. He wore ___ uniform with a blue collar. Everyone looked up at ___ moon, which was full that night.',
          clues: [
            clue(['honest'], ['answer'], '"Honest" starts with a silent h, so it begins with a vowel sound. We use "an".'),
            clue(['uniform'], ['wore'], '"Uniform" starts with a "you" sound, a consonant sound, so we use "a".'),
            clue(['moon'], ['full that night'], 'There is only one moon, so we use "the".'),
          ],
        },
        {
          body: 'Before {context}, the principal gave us ___ hour to finish. Each pupil wore ___ European costume for the show. Later, we visited ___ tallest building in the city.',
          clues: [
            clue(['hour'], ['to finish'], '"Hour" begins with a vowel sound because the h is silent. We use "an".'),
            clue(['European'], ['costume'], '"European" starts with a "you" sound, a consonant sound, so we use "a".'),
            clue(['tallest'], ['building'], 'Words like "tallest" mean there is only one, so we use "the".'),
          ],
        },
      ],
    },
  },

  grammarSVA: {
    lower: {
      answers: ['plays', 'are', 'has'],
      distractors: ['play', 'is', 'have'],
      templates: [
        {
          body: 'Every day after {context}, my sister ___ the piano. The science notes ___ on the middle shelf. Each pupil ___ a job in the group.',
          clues: [
            clue(['sister'], ['Every day'], '"My sister" is one person, so the verb takes -s: plays.'),
            clue(['notes'], ['science'], '"Notes" means more than one, so we use "are".'),
            clue(['Each'], ['pupil'], '"Each pupil" means one pupil at a time, so we use "has".'),
          ],
        },
        {
          body: 'After {context}, our monitor ___ a game with the younger pupils. The worksheets ___ on the front table. The class leader ___ a checklist.',
          clues: [
            clue(['monitor'], ['our'], '"Our monitor" is one person, so the verb takes -s: plays.'),
            clue(['worksheets'], ['front table'], '"Worksheets" means more than one, so we use "are".'),
            clue(['leader'], ['class'], '"The class leader" is one person, so we use "has".'),
          ],
        },
        {
          body: 'During {context}, Sam ___ football with his friends. The rule cards ___ beside the sink. Every child ___ a folder for homework.',
          clues: [
            clue(['Sam'], ['football'], 'Sam is one person, so we add -s: plays.'),
            clue(['cards'], ['rule'], '"Cards" means more than one, so we use "are".'),
            clue(['Every'], ['child'], '"Every child" means each one, so we use "has".'),
          ],
        },
      ],
    },
    upper: {
      answers: ['is', 'has', 'were'],
      distractors: ['are', 'have', 'was'],
      templates: [
        {
          body: "During {context}, the box of markers ___ on the teacher's desk. Everyone in the group ___ a role to play. Yesterday, the pupils in the front row ___ the first to finish.",
          clues: [
            clue(['box'], ['markers'], 'The subject is "box", not "markers". One box, so we use "is".'),
            clue(['Everyone'], ['group'], '"Everyone" is singular, so it takes "has".'),
            clue(['pupils'], ['Yesterday'], '"Yesterday" tells us it is past, and the subject "pupils" is plural, so we use "were". Do not match the verb to "row".'),
          ],
        },
        {
          body: 'After {context}, the list of names ___ pinned on the board. Each of the captains ___ a whistle. Last week, the members of the club ___ busy with the fair.',
          clues: [
            clue(['list'], ['names'], 'The subject is "list", not "names". One list, so we use "is".'),
            clue(['Each'], ['captains'], '"Each of the captains" means each one, so the verb is singular: has.'),
            clue(['members'], ['Last week'], '"Last week" means past, and "members" is plural, so we use "were". Do not match the verb to "club".'),
          ],
        },
        {
          body: 'Before {context}, the bag of oranges ___ heavy. Nobody in the class ___ a spare pen. Two days ago, the boys near the window ___ late.',
          clues: [
            clue(['bag'], ['oranges'], 'The subject is "bag", not "oranges". One bag, so we use "is".'),
            clue(['Nobody'], ['class'], '"Nobody" is singular, so it takes "has".'),
            clue(['boys'], ['Two days ago'], '"Two days ago" means past, and "boys" is plural, so we use "were". Do not match the verb to "window".'),
          ],
        },
      ],
    },
  },
};
