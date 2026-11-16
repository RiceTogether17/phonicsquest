/**
 * PhonicsQuest – sentences to read and talk about as a class.
 *
 * One set per reading phase (the same phases the stories use, so a set can
 * be checked against exactly the sounds that phase has taught). Every
 * sentence comes with:
 *
 *   questions  two or three "who / what / where" questions the class answers
 *              aloud, each with the answer the teacher reveals;
 *   change     one prompt to make a new sentence from the old one.
 *
 * Reading a word is not the same as understanding a sentence. These cards
 * are the step between the two: read it, say what happened, then say
 * something new with the same pattern.
 *
 * `classSentences.test.js` holds every sentence to its phase: each word must
 * be one the phase has taught to sound out, or a sight word already met.
 */

/** @typedef {{ q: string, a: string }} ClassQuestion */
/** @typedef {{ text: string, questions: ClassQuestion[], change: string }} ClassSentence */
/** @typedef {{ phase: string, label: string, hfwTier: number, sentences: ClassSentence[] }} ClassSentenceSet */

/** @type {ReadonlyArray<ClassSentenceSet>} */
export const CLASS_SENTENCE_SETS = Object.freeze([
  {
    phase: 'short-a',
    label: 'Short a (cat, map)',
    hfwTier: 1,
    sentences: [
      {
        text: 'Sam sat on a mat.',
        questions: [
          { q: 'Who sat?', a: 'Sam' },
          { q: 'Where did Sam sit?', a: 'On a mat' },
        ],
        change: 'Change who sat. Say the new sentence.',
      },
      {
        text: 'A cat has a nap.',
        questions: [
          { q: 'What has a nap?', a: 'A cat' },
          { q: 'What does the cat do?', a: 'It has a nap' },
        ],
        change: 'Change the animal. Who has a nap now?',
      },
      {
        text: 'Dad has a tan cap.',
        questions: [
          { q: 'Who has a cap?', a: 'Dad' },
          { q: 'What is the cap like?', a: 'It is tan' },
        ],
        change: 'Change what Dad has. Say the new sentence.',
      },
      {
        text: 'Pat can pat the cat.',
        questions: [
          { q: 'Who can pat the cat?', a: 'Pat' },
          { q: 'What can Pat do?', a: 'Pat the cat' },
        ],
        change: 'Change what Pat can pat.',
      },
    ],
  },
  {
    phase: 'short-ei',
    label: 'Short e and i (bed, pig)',
    hfwTier: 1,
    sentences: [
      {
        text: 'The red hen sat in a pen.',
        questions: [
          { q: 'What sat in a pen?', a: 'The red hen' },
          { q: 'Where did the hen sit?', a: 'In a pen' },
        ],
        change: 'Change where the hen sat.',
      },
      {
        text: 'Tim hid the big tin.',
        questions: [
          { q: 'Who hid the tin?', a: 'Tim' },
          { q: 'What did Tim hide?', a: 'The big tin' },
        ],
        change: 'Change what Tim hid.',
      },
      {
        text: 'A pig bit Ben on the leg.',
        questions: [
          { q: 'What bit Ben?', a: 'A pig' },
          { q: 'Where did the pig bite Ben?', a: 'On the leg' },
        ],
        change: 'Change who the pig bit.',
      },
      {
        text: 'Meg had ten pets.',
        questions: [
          { q: 'Who had pets?', a: 'Meg' },
          { q: 'How many pets did Meg have?', a: 'Ten' },
        ],
        change: 'Change how many pets Meg had.',
      },
    ],
  },
  {
    phase: 'short-ou',
    label: 'Short o and u (dog, sun)',
    hfwTier: 1,
    sentences: [
      {
        text: 'The dog dug in the mud.',
        questions: [
          { q: 'What dug in the mud?', a: 'The dog' },
          { q: 'Where did the dog dig?', a: 'In the mud' },
        ],
        change: 'Change the animal that dug.',
      },
      {
        text: 'Mum got on the bus.',
        questions: [
          { q: 'Who got on the bus?', a: 'Mum' },
          { q: 'What did Mum get on?', a: 'The bus' },
        ],
        change: 'Change who got on the bus.',
      },
      {
        text: 'A bug sat on a hot log.',
        questions: [
          { q: 'What sat on the log?', a: 'A bug' },
          { q: 'What was the log like?', a: 'It was hot' },
        ],
        change: 'Change what the log was like.',
      },
      {
        text: 'Tom did not run in the sun.',
        questions: [
          { q: 'Who did not run?', a: 'Tom' },
          { q: 'Where did Tom not run?', a: 'In the sun' },
        ],
        change: 'Take out "not". What does the sentence say now?',
      },
    ],
  },
  {
    phase: 'mixed-short',
    label: 'Two sounds together (frog, lamp)',
    hfwTier: 1,
    sentences: [
      {
        text: 'The frog can jump on the step.',
        questions: [
          { q: 'What can jump?', a: 'The frog' },
          { q: 'Where can the frog jump?', a: 'On the step' },
        ],
        change: 'Change what the frog can do on the step.',
      },
      {
        text: 'Fred left his lamp in the tent.',
        questions: [
          { q: 'Who left a lamp?', a: 'Fred' },
          { q: 'Where did Fred leave his lamp?', a: 'In the tent' },
        ],
        change: 'Change what Fred left in the tent.',
      },
      {
        text: 'A crab hid in the wet sand.',
        questions: [
          { q: 'What hid in the sand?', a: 'A crab' },
          { q: 'What was the sand like?', a: 'It was wet' },
        ],
        change: 'Change where the crab hid.',
      },
      {
        text: 'Stan held the flag up.',
        questions: [
          { q: 'Who held the flag?', a: 'Stan' },
          { q: 'What did Stan do with the flag?', a: 'He held it up' },
        ],
        change: 'Change what Stan held up.',
      },
    ],
  },
  {
    phase: 'short-digraphs',
    label: 'Two letters, one sound (ship, chop, thin)',
    hfwTier: 2,
    sentences: [
      {
        text: 'The fish swam by the ship.',
        questions: [
          { q: 'What swam by the ship?', a: 'The fish' },
          { q: 'What did the fish swim by?', a: 'The ship' },
        ],
        change: 'Change what the fish swam by.',
      },
      {
        text: 'Beth had chips for lunch.',
        questions: [
          { q: 'Who had chips?', a: 'Beth' },
          { q: 'When did Beth have chips?', a: 'For lunch' },
        ],
        change: 'Change what Beth had for lunch.',
      },
      {
        text: 'Chad shut the shed with a thud.',
        questions: [
          { q: 'Who shut the shed?', a: 'Chad' },
          { q: 'What sound did the shed make?', a: 'A thud' },
        ],
        change: 'Change what Chad shut.',
      },
      {
        text: 'The duck sat on a thick rock.',
        questions: [
          { q: 'What sat on the rock?', a: 'The duck' },
          { q: 'What was the rock like?', a: 'It was thick' },
        ],
        change: 'Change what the rock was like.',
      },
    ],
  },
  {
    phase: 'long-a',
    label: 'Long a (cake, rain, play)',
    hfwTier: 2,
    sentences: [
      {
        text: 'Jake gave Kate a cake.',
        questions: [
          { q: 'Who gave the cake?', a: 'Jake' },
          { q: 'Who got the cake?', a: 'Kate' },
          { q: 'What did Jake give Kate?', a: 'A cake' },
        ],
        change: 'Swap Jake and Kate. Who gives the cake now?',
      },
      {
        text: 'We play in the rain.',
        questions: [
          { q: 'Who plays in the rain?', a: 'We do' },
          { q: 'Where do we play?', a: 'In the rain' },
        ],
        change: 'Change where we play.',
      },
      {
        text: 'The snail left a wet trail.',
        questions: [
          { q: 'What left a trail?', a: 'The snail' },
          { q: 'What was the trail like?', a: 'It was wet' },
        ],
        change: 'Change the animal that left a trail.',
      },
      {
        text: 'Gran came to stay in May.',
        questions: [
          { q: 'Who came to stay?', a: 'Gran' },
          { q: 'When did Gran come?', a: 'In May' },
        ],
        change: 'Change when Gran came to stay.',
      },
    ],
  },
  {
    phase: 'long-e',
    label: 'Long e (tree, sea)',
    hfwTier: 2,
    sentences: [
      {
        text: 'Three bees sleep in the tree.',
        questions: [
          { q: 'How many bees are there?', a: 'Three' },
          { q: 'Where do the bees sleep?', a: 'In the tree' },
        ],
        change: 'Change how many bees sleep in the tree.',
      },
      {
        text: 'Dean can see a seal in the sea.',
        questions: [
          { q: 'Who can see a seal?', a: 'Dean' },
          { q: 'Where is the seal?', a: 'In the sea' },
        ],
        change: 'Change what Dean can see in the sea.',
      },
      {
        text: 'We eat meat and beans at the feast.',
        questions: [
          { q: 'What do we eat?', a: 'Meat and beans' },
          { q: 'Where do we eat?', a: 'At the feast' },
        ],
        change: 'Change what we eat at the feast.',
      },
      {
        text: 'The queen keeps a green jeep.',
        questions: [
          { q: 'Who keeps a jeep?', a: 'The queen' },
          { q: 'What is the jeep like?', a: 'It is green' },
        ],
        change: 'Change what the queen keeps.',
      },
    ],
  },
  {
    phase: 'long-i',
    label: 'Long i (kite, night, fly)',
    hfwTier: 2,
    sentences: [
      {
        text: 'Mike flies his kite at night.',
        questions: [
          { q: 'Who flies a kite?', a: 'Mike' },
          { q: 'When does Mike fly his kite?', a: 'At night' },
        ],
        change: 'Change when Mike flies his kite.',
      },
      {
        text: 'The bright light is high in the sky.',
        questions: [
          { q: 'What is high in the sky?', a: 'The bright light' },
          { q: 'Where is the light?', a: 'High in the sky' },
        ],
        change: 'Change what is high in the sky.',
      },
      {
        text: 'I like to ride my bike.',
        questions: [
          { q: 'What do I like to ride?', a: 'My bike' },
          { q: 'Who likes to ride?', a: 'I do' },
        ],
        change: 'Change what you like to do.',
      },
      {
        text: 'Five flies hide by the pie.',
        questions: [
          { q: 'How many flies hide?', a: 'Five' },
          { q: 'Where do the flies hide?', a: 'By the pie' },
        ],
        change: 'Change where the flies hide.',
      },
    ],
  },
  {
    phase: 'long-o',
    label: 'Long o (home, boat, snow)',
    hfwTier: 2,
    sentences: [
      {
        text: 'The goat rode home on a boat.',
        questions: [
          { q: 'What rode on a boat?', a: 'The goat' },
          { q: 'Where did the goat go?', a: 'Home' },
        ],
        change: 'Change what the goat rode on.',
      },
      {
        text: 'Snow fell on the road.',
        questions: [
          { q: 'What fell?', a: 'Snow' },
          { q: 'Where did the snow fall?', a: 'On the road' },
        ],
        change: 'Change where the snow fell.',
      },
      {
        text: 'Joan broke the stone toad.',
        questions: [
          { q: 'Who broke the toad?', a: 'Joan' },
          { q: 'What was the toad made of?', a: 'Stone' },
        ],
        change: 'Change what the toad is made of.',
      },
      {
        text: 'The crow has a yellow bow.',
        questions: [
          { q: 'What has a bow?', a: 'The crow' },
          { q: 'What is the bow like?', a: 'It is yellow' },
        ],
        change: 'Change what the bow is like.',
      },
    ],
  },
  {
    phase: 'long-u',
    label: 'Long u and oo (cube, blue, moon)',
    hfwTier: 2,
    sentences: [
      {
        text: 'June has a blue spoon.',
        questions: [
          { q: 'Who has a spoon?', a: 'June' },
          { q: 'What is the spoon like?', a: 'It is blue' },
        ],
        change: 'Change what June has.',
      },
      {
        text: 'The moon is up at noon.',
        questions: [
          { q: 'What is up?', a: 'The moon' },
          { q: 'When is the moon up?', a: 'At noon' },
        ],
        change: 'Is that true? Fix the sentence so it is.',
      },
      {
        text: 'A few new boots sit in the room.',
        questions: [
          { q: 'What sits in the room?', a: 'A few new boots' },
          { q: 'Are the boots old or new?', a: 'New' },
        ],
        change: 'Change where the boots sit.',
      },
      {
        text: 'Luke got glue to fix the flute.',
        questions: [
          { q: 'Who fixed the flute?', a: 'Luke' },
          { q: 'What did Luke get?', a: 'Glue' },
        ],
        change: 'Change what Luke fixed.',
      },
    ],
  },
  {
    phase: 'r-controlled',
    label: 'Bossy r (car, fork, bird)',
    hfwTier: 3,
    sentences: [
      {
        text: 'The bird sat on the car in the dark.',
        questions: [
          { q: 'What sat on the car?', a: 'The bird' },
          { q: 'When did it sit there?', a: 'In the dark' },
        ],
        change: 'Change what the bird sat on.',
      },
      {
        text: 'Her shirt has a burn on the arm.',
        questions: [
          { q: 'What has a burn?', a: 'Her shirt' },
          { q: 'Where is the burn?', a: 'On the arm' },
        ],
        change: 'Change where the burn is.',
      },
      {
        text: 'The farmer left a fork in the barn.',
        questions: [
          { q: 'Who left a fork?', a: 'The farmer' },
          { q: 'Where is the fork?', a: 'In the barn' },
        ],
        change: 'Change what the farmer left in the barn.',
      },
      {
        text: 'A storm hit the port at night.',
        questions: [
          { q: 'What hit the port?', a: 'A storm' },
          { q: 'When did the storm hit?', a: 'At night' },
        ],
        change: 'Change when the storm hit.',
      },
    ],
  },
  {
    phase: 'digraphs',
    label: 'Tricky letters (catch, bridge, phone)',
    hfwTier: 3,
    sentences: [
      {
        text: 'Mitch can catch the ball by the bridge.',
        questions: [
          { q: 'Who can catch the ball?', a: 'Mitch' },
          { q: 'Where does Mitch catch it?', a: 'By the bridge' },
        ],
        change: 'Change what Mitch can catch.',
      },
      {
        text: 'The judge has a badge on her dress.',
        questions: [
          { q: 'Who has a badge?', a: 'The judge' },
          { q: 'Where is the badge?', a: 'On her dress' },
        ],
        change: 'Change where the badge is.',
      },
      {
        text: 'Phil took a photo of the hedge.',
        questions: [
          { q: 'Who took a photo?', a: 'Phil' },
          { q: 'What is the photo of?', a: 'The hedge' },
        ],
        change: 'Change what Phil took a photo of.',
      },
      {
        text: 'Fetch the fudge from the kitchen.',
        questions: [
          { q: 'What must you fetch?', a: 'The fudge' },
          { q: 'Where is the fudge?', a: 'In the kitchen' },
        ],
        change: 'Change what you must fetch.',
      },
    ],
  },
  {
    phase: 'suffixes',
    label: 'Word endings (jumping, played, faster)',
    hfwTier: 3,
    sentences: [
      {
        text: 'Nina is jumping on the bed.',
        questions: [
          { q: 'Who is jumping?', a: 'Nina' },
          { q: 'Is she jumping now or did she jump before?', a: 'Now' },
        ],
        change: 'Say it as if it happened yesterday.',
      },
      {
        text: 'We played in the park and then rested.',
        questions: [
          { q: 'What did we do first?', a: 'We played in the park' },
          { q: 'What did we do after that?', a: 'We rested' },
        ],
        change: 'Say it as if it is happening now.',
      },
      {
        text: 'The red car is faster than the green car.',
        questions: [
          { q: 'Which car is faster?', a: 'The red car' },
          { q: 'Which car is slower?', a: 'The green car' },
        ],
        change: 'Add a third car that is the fastest.',
      },
      {
        text: 'Ben is the tallest in the class.',
        questions: [
          { q: 'Who is the tallest?', a: 'Ben' },
          { q: 'Is anyone in the class taller than Ben?', a: 'No' },
        ],
        change: 'Change "tallest" to another word that ends in "est".',
      },
    ],
  },
  {
    phase: 'diphthongs',
    label: 'Sliding vowels (coin, boy, cloud)',
    hfwTier: 3,
    sentences: [
      {
        text: 'The boy found a coin on the ground.',
        questions: [
          { q: 'Who found a coin?', a: 'The boy' },
          { q: 'Where was the coin?', a: 'On the ground' },
        ],
        change: 'Change what the boy found.',
      },
      {
        text: 'A loud sound came from the south.',
        questions: [
          { q: 'What came from the south?', a: 'A loud sound' },
          { q: 'Was the sound soft or loud?', a: 'Loud' },
        ],
        change: 'Change what the sound was like.',
      },
      {
        text: 'Roy and Joy point at the cloud.',
        questions: [
          { q: 'Who points at the cloud?', a: 'Roy and Joy' },
          { q: 'What do they point at?', a: 'The cloud' },
        ],
        change: 'Change what Roy and Joy point at.',
      },
      {
        text: 'The mouse ran out of the house.',
        questions: [
          { q: 'What ran out?', a: 'The mouse' },
          { q: 'Where did the mouse run from?', a: 'The house' },
        ],
        change: 'Change what ran out of the house.',
      },
    ],
  },
  {
    phase: 'advanced-vowel',
    label: 'More vowel teams (saw, chair, near)',
    hfwTier: 3,
    sentences: [
      {
        text: 'Paul saw a hawk on the lawn at dawn.',
        questions: [
          { q: 'Who saw a hawk?', a: 'Paul' },
          { q: 'Where was the hawk?', a: 'On the lawn' },
          { q: 'When did Paul see it?', a: 'At dawn' },
        ],
        change: 'Change when Paul saw the hawk.',
      },
      {
        text: 'The girl with fair hair sat on the chair.',
        questions: [
          { q: 'Who sat on the chair?', a: 'The girl with fair hair' },
          { q: 'What was her hair like?', a: 'It was fair' },
        ],
        change: 'Change where the girl sat.',
      },
      {
        text: 'A deer came near and we did not fear it.',
        questions: [
          { q: 'What came near?', a: 'A deer' },
          { q: 'Were we afraid of it?', a: 'No' },
        ],
        change: 'Change the animal that came near.',
      },
      {
        text: 'Take care on the stairs.',
        questions: [
          { q: 'Where must you take care?', a: 'On the stairs' },
          { q: 'Why might someone say this?', a: 'So that you do not fall' },
        ],
        change: 'Change where you must take care.',
      },
    ],
  },
]);

/** @param {string} phase */
export function classSentenceSet(phase) {
  return CLASS_SENTENCE_SETS.find((s) => s.phase === phase) || null;
}
