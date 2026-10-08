export const WRITING_TRACKS = {
  p3t1Creative: {
    id: 'p3t1Creative',
    level: 3,
    term: 'T1',
    track: 'P3 T1 Creative Writing Track',
    description: 'Build story craft with a repeatable Learn → Revise → Plan → Draft → Revise → Boss flow.',
    lessonIds: [
      'p3-bootcamp-sensory-show',
      'p3-lesson-rainy-court',
      'p3-lesson-lost-key',
      'p3-lesson-new-classmate',
      'p3-lesson-midnight-noise',
      'p3-boss-quiz',
    ],
  },
  p3t2Creative: {
    id: 'p3t2Creative',
    level: 3,
    term: 'T2',
    track: 'P3 T2 Creative Writing Track',
    description: 'Advance sentence openings, dialogue craft, figurative language, and climax design.',
    lessonIds: [
      'p3t2-bootcamp-openings',
      'p3t2-lesson-market-rush',
      'p3t2-lesson-garden-storm',
      'p3t2-lesson-bus-stop-kindness',
      'p3t2-lesson-lab-surprise',
      'p3t2-lesson-field-trip',
      'p3t2-boss-quiz',
    ],
  },
};

// Child-friendly names and a guiding question for every plot-plan box. The
// plan screen used to show the raw key ("risingAction") with "Plan this
// part..." underneath, which tells a P3 child nothing about what belongs there.
export const PLAN_GUIDE = {
  introduction: {
    label: 'Introduction',
    ask: 'Who is in the story, where are they, and how will you start? (speech, a sound word, the weather, a character or a question)',
  },
  risingAction: {
    label: 'Rising action',
    ask: 'What happens that leads up to the problem? Write one or two events.',
  },
  climax: {
    label: 'Climax',
    ask: 'What is the most exciting or worrying moment of the story?',
  },
  fallingAction: {
    label: 'Falling action',
    ask: 'What happens straight after the climax? How does the problem start to get sorted out?',
  },
  conclusion: {
    label: 'Conclusion',
    ask: 'How do the characters feel, what lesson is learnt, and how will you link back to the title?',
  },
  setting: {
    label: 'Setting',
    ask: 'Where and when does the story happen? Add one thing you can see, hear or smell there.',
  },
  character: {
    label: 'Characters',
    ask: 'Who is in the story? Give each person a name and one detail about them.',
  },
  problem: { label: 'Problem', ask: 'What goes wrong?' },
  feelings: {
    label: 'Feelings',
    ask: 'How does the main character feel? How will you show it with what they do, how they look and what they say?',
  },
  resolution: { label: 'Resolution', ask: 'How is the problem solved?' },
  reflection: { label: 'Reflection', ask: 'What did the main character learn or realise?' },
};

const REVISION_CORE_DRILLS = [
  {
    type: 'vocab_mcq',
    question: 'Choose the best word: The wind ____ through the trees.',
    options: ['sang', 'sat', 'slept'],
    correctIndex: 0,
    hint: 'Which word could describe a sound the wind makes?',
    why: '“Sang” lets you hear the wind. Wind cannot sit or sleep.',
  },
  {
    type: 'spelling_pick',
    question: 'Pick the correct spelling for your writing toolbox.',
    options: ['suddnly', 'suddenly', 'sudenly'],
    correctIndex: 1,
    hint: 'Start with the word “sudden”, then add -ly.',
    why: 'sudden + ly = suddenly. “Sudden” has two d’s and an e.',
  },
];

// ── P3 Term 1 teaching cards ────────────────────────────────────────────────
// Modelled on the skills a Singapore P3 creative-writing term covers (five
// senses, show-not-tell, speech tags, story starters, plot planning,
// three-step conclusions, sound words). All examples are written for this app.

const FIVE_SENSES_CARD = {
  title: 'Use your 5 senses',
  explain:
    'When you describe a place, imagine you are standing there. Ask yourself: What can I see? Hear? Smell? Touch? Taste? Each answer gives you one detail for your reader.',
  examples: [
    { label: 'See', text: 'Long queues snaked out from every stall in the canteen.' },
    { label: 'Hear', text: 'Trays clattered and friends shouted across the tables.' },
    { label: 'Smell', text: 'The smell of fried chicken wings drifted towards me.' },
    { label: 'Touch', text: 'The metal bench felt cool under my legs.' },
    { label: 'Taste', text: 'The icy Milo was sweet and creamy on my tongue.' },
  ],
  tip: 'You do not need all five senses every time. Two or three good ones are enough.',
};

const SHOW_NOT_TELL_CARD = {
  title: 'Show, don’t tell',
  explain:
    'Telling names the feeling: “I was nervous.” Showing lets the reader work out the feeling. Pretend you are the character and ask three questions: What do I DO? How do I LOOK? What do I SAY?',
  tell: 'Wei Ming was nervous.',
  show: 'Wei Ming twisted his name tag round and round. His face had gone pale. “What if I forget my lines?” he whispered.',
  examples: [
    { label: 'Do', text: 'twisted his name tag round and round' },
    { label: 'Look', text: 'his face had gone pale' },
    { label: 'Say', text: '“What if I forget my lines?” he whispered.' },
  ],
};

const FEELING_HELPER_CARD = {
  title: 'Feeling helper',
  explain: 'Stuck? Borrow an idea for the feeling you want to show, then make it your own.',
  examples: [
    { label: 'Scared', text: 'knees shook · heart thumped · voice came out as a squeak' },
    { label: 'Sad', text: 'eyes filled with tears · shoulders drooped · stared at the floor' },
    { label: 'Angry', text: 'fists clenched · face turned red · stomped away' },
    { label: 'Happy', text: 'grinned from ear to ear · jumped up and down · punched the air' },
    { label: 'Shocked', text: 'jaw dropped · eyes went wide · froze on the spot' },
    { label: 'Embarrassed', text: 'cheeks burned · looked down at my shoes · spoke in a tiny voice' },
  ],
};

const STORY_MOUNTAIN_CARD = {
  title: 'Plan with the story mountain',
  explain: 'A good story climbs up to an exciting moment and then comes back down. Plan five parts before you write.',
  steps: [
    'Introduction: who, where and when, with a strong first line.',
    'Rising action: one or two events that lead up to the problem.',
    'Climax: the most exciting or worrying moment.',
    'Falling action: what happens straight after, and how the problem gets sorted out.',
    'Conclusion: feelings, the lesson learnt, and a line that links back to the title.',
  ],
};

const STORY_STARTERS_CARD = {
  title: '5 ways to start a story',
  explain: 'Your first line should pull the reader straight into the story. Try one of these:',
  examples: [
    { label: 'Speech', text: '“Hurry, the bell is about to ring!” Mei shouted.' },
    { label: 'Weather', text: 'Rain drummed on the roof of the sheltered court.' },
    { label: 'Sound word', text: 'Splash! A ball landed in the puddle beside me.' },
    { label: 'Character', text: 'Darren was the fastest runner in our class, and he never let anyone forget it.' },
    { label: 'Question', text: 'Have you ever found something that did not belong to you?' },
  ],
  tip: 'Weather must match the setting. If your story happens indoors, describe what you see through the window, not the whole sky. A question must link to the topic but must not give away the ending.',
};

const SPEECH_PARTS_CARD = {
  title: 'Speech, speech tag and action tag',
  explain: 'Speech has three parts. Each one tells the reader something.',
  examples: [
    { label: 'Speech', text: 'the exact words, inside “ ”: “Give that back!”' },
    { label: 'Speech tag', text: 'the verb that tells HOW it was said: shouted' },
    { label: 'Action tag', text: 'what the speaker does while talking: grabbing the end of her ruler' },
  ],
  show: '“Give that back!” Hana shouted, grabbing the end of her ruler.',
};

const TAG_MATCH_CARD = {
  title: 'Make the tags match the feeling',
  explain: 'The speech tag and action tag must fit the feeling of the words. If they do not match, the reader gets confused.',
  tell: '“I’m so proud of you!” Mum grumbled, folding her arms. (Grumbling and folded arms sound annoyed, not proud.)',
  show: '“I’m so proud of you!” Mum cheered, pulling me into a hug.',
};

const SPEECH_PURPOSE_CARD = {
  title: 'Speech with a purpose',
  explain: 'Only use speech when it shows how a character feels or moves the story forward. Greetings like “Hi” and “Okay” waste words.',
  tell: '“Hi,” said Ben. “Hi,” I said.',
  show: '“That key opens the old storeroom,” Ben whispered. “We have to return it before recess ends.”',
};

const SPEECH_PUNCTUATION_CARD = {
  title: 'Punctuate speech',
  explain: 'Follow three rules when you write speech.',
  steps: [
    'Put the exact spoken words inside speech marks “ ”.',
    'Start the speech with a capital letter.',
    'The comma, ! or ? goes inside the closing speech mark: “Where did it go?” Mei asked.',
  ],
};

const WAYS_TO_SAY_CARD = {
  title: 'Ways to say “said”, “walked” and “ran”',
  explain: 'Words like “said” and “walked” get tired when you use them again and again. Pick a word that also shows the feeling.',
  examples: [
    { label: 'Angry', text: 'snapped · barked · growled' },
    { label: 'Happy', text: 'cheered · chuckled · giggled' },
    { label: 'Scared', text: 'stammered · gulped · squeaked' },
    { label: 'Sad', text: 'sobbed · sighed · sniffled' },
    { label: 'Quiet', text: 'whispered · mumbled · murmured' },
    { label: 'Walked', text: 'trudged (tired) · tiptoed (quietly) · strolled (relaxed) · marched (angry)' },
    { label: 'Ran', text: 'dashed · sprinted · raced · scurried' },
  ],
};

const CONCLUSION_CARD = {
  title: 'A strong ending in 3 steps',
  explain: 'Do not just stop. End your story with these three steps.',
  steps: [
    'Feelings: How did I feel at the end? How did the others feel?',
    'Lesson learnt: What did I (or another character) learn?',
    'Link to the topic: use the words of the title in your last line.',
  ],
  show: 'As I walked home, I could not stop smiling. I learned that one small invitation can make someone feel welcome. I will always remember the day the new classmate became my friend.',
  tip: 'Topic “A Day I Got Lost”? Try: “I hoped I would never get lost again!”',
};

const ONOMATOPOEIA_CARD = {
  title: 'Sound words (onomatopoeia)',
  explain: 'A sound word copies the sound it names. Sound words help your reader HEAR the story.',
  examples: [
    { label: 'Thud', text: 'something heavy falls' },
    { label: 'Creak', text: 'an old door or wooden floor' },
    { label: 'Drip, drip', text: 'water from a tap' },
    { label: 'Sizzle', text: 'food frying in a hot pan' },
    { label: 'Buzz', text: 'a mosquito or a bee' },
    { label: 'Brrring', text: 'an alarm clock or a school bell' },
  ],
  tip: 'Start a story with a sound word, then explain it: “Crash! A pot hit the kitchen floor.”',
};

const PUT_IT_TOGETHER_CARD = {
  title: 'Bring all your skills together',
  explain: 'In this story, try to use every tool from this term.',
  steps: [
    'Start with a sound word or one of the other story starters.',
    'Describe the setting with two senses.',
    'Show one feeling with Do, Look and Say.',
    'Add one purposeful speech with a speech tag that matches the feeling.',
    'End in 3 steps: feelings, lesson learnt, link to the topic.',
  ],
};

export const writingLessonPacks = {
  'p3-bootcamp-sensory-show': {
    id: 'p3-bootcamp-sensory-show', track: 'p3t1Creative', level: 3, lessonType: 'bootcamp', lessonTitle: 'Skills Bootcamp: Sensory Sparks + Show-Not-Tell', textType: 'guided narrative prep',
    skillFocus: ['5 senses', 'show-not-tell', 'powerful story openings'],
    introTeaching: ['Great stories help readers see, hear, and feel the moment.', 'Instead of saying “I was scared”, show it using body actions and sounds.', 'An opening line should place the reader inside the scene quickly.'],
    teachCards: [FIVE_SENSES_CARD, SHOW_NOT_TELL_CARD, FEELING_HELPER_CARD],
    vocabRevision: ['drizzle', 'echoed', 'clutched', 'shivered', 'glimmered', 'stumbled'],
    wordBucket: [
      { word: 'drizzle', meaning: 'light, fine rain', example: 'A drizzle fell as we waited at the bus stop.' },
      { word: 'echoed', meaning: 'a sound bounced back and was heard again', example: 'My footsteps echoed in the empty hall.' },
      { word: 'clutched', meaning: 'held something tightly', example: 'She clutched her water bottle as the bus jerked forward.' },
      { word: 'shivered', meaning: 'shook a little because of cold or fear', example: 'I shivered in the air-conditioned library.' },
      { word: 'glimmered', meaning: 'shone with a small, weak light', example: 'A torch glimmered at the end of the dark corridor.' },
      { word: 'stumbled', meaning: 'tripped and almost fell', example: 'He stumbled over a loose shoelace.' },
    ],
    spellingRevision: ['whisper', 'suddenly', 'because', 'through', 'shadow'],
    reviseDrills: [
      REVISION_CORE_DRILLS[1],
      { type: 'vocab_mcq', question: '“The smell of frying onions drifted out of the kitchen.” Which sense does this sentence use?', options: ['See', 'Hear', 'Smell'], correctIndex: 2, hint: 'Which part of your body notices onions frying from far away?', why: 'The word “smell” and onions frying tell the reader what reached your nose.' },
      { type: 'show_not_tell', question: 'Upgrade “I was excited.”', options: ['I was excited.', 'My feet bounced and my grin stretched wide.', 'Excited happened.'], correctIndex: 1, hint: 'Look for the sentence that never uses the word “excited”.', why: 'It shows excitement through what the body does (feet bounced) and how the face looks (a wide grin). The reader feels it without being told.' },
      { type: 'show_not_tell', question: 'Which sentence SHOWS that Dad was angry?', options: ['Dad was angry.', 'Dad felt very, very angry.', 'Dad slammed the door and his face turned red.'], correctIndex: 2, hint: 'Find what Dad DID and how he LOOKED.', why: 'Slamming the door is something Dad does, and a red face is how he looks. Both show anger without naming it.' },
      { type: 'show_not_tell', question: '“Is it my turn already?” Priya squeaked. Which Show-Not-Tell question does this answer?', options: ['What did she DO?', 'How did she LOOK?', 'What did she SAY?'], correctIndex: 2, hint: 'Look at the speech marks.', why: 'The words inside the speech marks are what Priya SAID. Her squeaky voice also shows she is nervous.' },
      { type: 'arrange_sequence', question: 'Put these story events in order:', sentences: ['The corridor lights flickered as I reached the staircase.', 'I heard footsteps echoing behind me.', 'Suddenly, my friend appeared and laughed.', 'In the end, I felt silly for being scared.'], correctOrder: [0, 1, 2, 3], hint: 'Start with the setting and finish with “In the end”.', why: 'First the setting, then the problem (footsteps), then the surprise (“Suddenly”), and last the ending (“In the end”).' },
    ],
    storyStarterChoices: ['The corridor lights flickered just as I reached the staircase.', 'Rain hammered the roof while I searched for my missing notebook.', 'A soft voice called my name from the empty basketball court.'],
    plotPlanTemplate: ['setting', 'character', 'problem', 'feelings', 'conclusion'],
    paragraphMissions: [{ text: 'Open with a scene', keywordsAny: ['corridor', 'rain', 'lights', 'court'] }, { text: 'Show one feeling using actions', keywordsAny: ['clutched', 'shivered', 'jumped', 'trembled'] }, { text: 'End with a clear resolution', keywordsAny: ['finally', 'in the end', 'at last'] }],
    supportWords: ['suddenly', 'meanwhile', 'because', 'finally', 'whispered'],
    requiredChecks: [{ id: 'sensory-detail', label: 'Include at least one sensory detail', keywordsAny: ['heard', 'smell', 'cold', 'bright', 'echoed', 'drizzle'] }, { id: 'show-feeling', label: 'Show a feeling with action', keywordsAny: ['clutched', 'trembled', 'shivered', 'gulped', 'froze'] }, { id: 'ending-signal', label: 'Include a concluding signal', keywordsAny: ['finally', 'in the end', 'at last'] }],
    rubric: ['Clear beginning-middle-ending', 'Sensory details included', 'Task checkpoints completed'],
    sampleAnswer: 'Rain drummed on the windows as I clutched my bag and stepped into the dark hall. A chair scraped behind me, and my heart jumped. I froze, then heard my friend laughing from the doorway. In the end, I smiled at my own imagination and hurried back to class.',
    tryThis: ['Swap one weak verb with a vivid verb.', 'Add one dialogue line with a speech tag.'],
    rewards: { xp: 42, collectibles: ['sensory-spark-card', 'show-not-tell-badge'] },
  },
  'p3-lesson-rainy-court': {
    id: 'p3-lesson-rainy-court', track: 'p3t1Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 1: The Rainy Court Mystery', textType: 'narrative paragraph',
    skillFocus: ['story starters', 'plot planning', 'connectors'],
    introTeaching: ['Build suspense with setting first, then problem.', 'Use connectors to keep events in order.'],
    teachCards: [STORY_MOUNTAIN_CARD, STORY_STARTERS_CARD],
    vocabRevision: ['puddle', 'slipped', 'echo', 'search', 'discovered'],
    wordBucket: [
      { word: 'puddle', meaning: 'a small pool of rainwater on the ground', example: 'A puddle had formed under the basketball hoop.' },
      { word: 'slipped', meaning: 'slid by accident and lost your balance', example: 'I slipped on the wet floor near the water cooler.' },
      { word: 'glistened', meaning: 'shone because it was wet', example: 'The court glistened after the heavy rain.' },
      { word: 'search', meaning: 'look carefully for something', example: 'We had to search every corner for the missing ball.' },
      { word: 'discovered', meaning: 'found something for the first time', example: 'I discovered a keychain hidden behind the bench.' },
    ],
    spellingRevision: ['morning', 'basketball', 'carefully', 'together'],
    reviseDrills: [
      { type: 'opening_upgrade', question: 'Pick the strongest story opening.', options: ['It was a day.', 'The court glistened with rain as an umbrella rolled across the floor.', 'I write about rain.'], correctIndex: 1, hint: 'Which line puts you right inside a place?', why: 'It shows a real place (the wet court) and something strange happening (an umbrella rolling). The reader wants to know more.' },
      { type: 'opening_upgrade', question: 'The story happens inside a classroom. Which weather opening fits best?', options: ['The sun blazed down on the empty field.', 'Rain streaked down the classroom windows as Mrs Lim took attendance.', 'Snow covered every rooftop in the town.'], correctIndex: 1, hint: 'The weather must match where the story happens.', why: 'The story is indoors, so we see the weather through the classroom window. The field is outdoors, and it does not snow in Singapore!' },
      { type: 'vocab_mcq', question: 'Which part of the story mountain is the most exciting or worrying moment?', options: ['Introduction', 'Climax', 'Conclusion'], correctIndex: 1, hint: 'It is the top of the mountain.', why: 'The climax is the top of the story mountain, where the problem is at its biggest.' },
      { type: 'opening_upgrade', question: 'Topic: “A Lost Item”. Which question opening is best?', options: ['Have you ever lost something that really mattered to you?', 'Do you like rainy days?', 'Have you ever found your friend’s keychain in a puddle?'], correctIndex: 0, hint: 'It must link to the topic but keep the ending a secret.', why: 'It links to losing something. The rain question has nothing to do with the topic, and the keychain question gives away the ending.' },
      { type: 'arrange_sequence', question: 'Put the story mountain in order:', sentences: ['After school, Mei and I went to the wet basketball court.', 'Mei noticed that her keychain was missing from her bag.', 'Just then, we spotted something shiny at the bottom of a puddle.', 'Mei fished out the keychain and dried it on her shirt.', 'We were so relieved, and I learned to stay calm when things go wrong.'], correctOrder: [0, 1, 2, 3, 4], hint: 'Introduction, rising action, climax, falling action, conclusion.', why: 'Introduction (going to the court), rising action (keychain missing), climax (spotting it), falling action (fishing it out), conclusion (feelings and lesson).' },
    ],
    storyStarterChoices: ['The basketball court was empty except for one umbrella on the floor.', 'When the whistle blew, everyone ran inside except me.', 'Splash! My shoe landed in the biggest puddle on the court.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: [{ text: 'Describe setting clearly', keywordsAny: ['court', 'rain', 'puddle'] }, { text: 'Add one surprise event', keywordsAny: ['suddenly', 'just then', 'all at once'] }, { text: 'Conclude with lesson learnt', keywordsAny: ['I learned', 'next time', 'in the end'] }],
    supportWords: ['first', 'then', 'because', 'while', 'finally'],
    requiredChecks: [{ id: 'event-one', label: 'State what happened at the court', keywordsAny: ['court', 'umbrella', 'rain', 'whistle'] }, { id: 'connector-use', label: 'Use one connector', keywordsAny: ['first', 'then', 'while', 'because', 'finally'] }, { id: 'reflection', label: 'End with reflection or lesson', keywordsAny: ['I learned', 'next time', 'in the end'] }],
    rubric: ['Ordered events', 'At least one connector', 'Clear conclusion'],
    sampleAnswer: 'The basketball court was silent except for the rain. First, I spotted an umbrella with no owner nearby. Then I heard footsteps and found my classmate searching under the bench. We worked together because she had lost her keychain. In the end, we found it in a puddle, and I learned that calm thinking solves problems faster.',
    tryThis: ['Upgrade one sentence with sensory detail.', 'Add dialogue with an action tag.'],
    rewards: { xp: 45, collectibles: ['story-starter-card', 'plot-builder-token'] },
  },
  'p3-lesson-lost-key': {
    id: 'p3-lesson-lost-key', track: 'p3t1Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 2: The Lost Key in the Library', textType: 'narrative paragraph',
    skillFocus: ['speech, speech tags and action tags', 'ways to say “said”', 'speech punctuation'],
    introTeaching: ['Dialogue should move the story forward.', 'Use action tags: “Rina whispered, clutching her notebook.”'],
    teachCards: [SPEECH_PARTS_CARD, TAG_MATCH_CARD, SPEECH_PURPOSE_CARD, SPEECH_PUNCTUATION_CARD, WAYS_TO_SAY_CARD],
    vocabRevision: ['rustled', 'peeked', 'muttered', 'relief', 'stacked'],
    wordBucket: [
      { word: 'rustled', meaning: 'made a soft, dry sound like paper moving', example: 'Pages rustled as the librarian turned them.' },
      { word: 'peeked', meaning: 'looked quickly, often secretly', example: 'I peeked between the shelves to see who was there.' },
      { word: 'muttered', meaning: 'spoke quietly and unclearly, often when annoyed', example: '“Not again,” Ben muttered under his breath.' },
      { word: 'relief', meaning: 'the happy feeling when a worry goes away', example: 'I let out a sigh of relief when I found my wallet.' },
      { word: 'stacked', meaning: 'piled neatly on top of each other', example: 'Books were stacked high on the trolley.' },
    ],
    spellingRevision: ['library', 'quietly', 'between', 'searched'],
    reviseDrills: [
      { type: 'dialogue_tag', question: 'Choose the best dialogue line.', options: ['"Stop!" it did.', '"Stop!" Mira whispered, gripping my sleeve.', '"Stop!" word happened.'], correctIndex: 1, hint: 'Look for a speech tag AND an action tag.', why: '“Whispered” is the speech tag and “gripping my sleeve” is the action tag. Together they show Mira is worried.' },
      { type: 'dialogue_tag', question: '“Shh, the librarian is coming,” Ben ____. Which speech tag fits?', options: ['bellowed', 'whispered', 'cheered'], correctIndex: 1, hint: 'Ben is asking someone to be quiet in a library.', why: 'Ben wants everyone to be quiet, so he whispers. Bellowing or cheering would be far too loud.' },
      { type: 'dialogue_tag', question: '“How dare you tear my book!” Ali giggled. Does the speech tag match the feeling?', options: ['Yes, it matches.', 'No. Ali is angry, so “snapped” fits better than “giggled”.'], correctIndex: 1, hint: 'How does Ali feel about the torn book?', why: 'The words are angry, but “giggled” is for happy speech. An angry tag like “snapped” or “growled” matches.' },
      { type: 'spelling_pick', question: 'Which sentence is punctuated correctly?', options: ['“Where is the key?” asked Mei.', '“Where is the key” asked Mei?', 'Where is the key? “asked Mei.”'], correctIndex: 0, hint: 'The question mark belongs to the spoken words.', why: 'The spoken words and their question mark go inside the speech marks. “asked Mei” stays outside.' },
      { type: 'vocab_mcq', question: 'Pick a better word for “walked” when the character is very tired.', options: ['trudged', 'skipped', 'sprinted'], correctIndex: 0, hint: 'Which word sounds slow and heavy?', why: '“Trudged” means walked slowly with heavy steps, which shows tiredness. Skipping and sprinting show energy.' },
    ],
    storyStarterChoices: ['A tiny key dropped from a book and slid under a shelf.', '“Wait! That key looks familiar,” Ben whispered.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: [{ text: 'Use one dialogue line', keywordsAny: ['"', '“', '”'] }, { text: 'Use one action tag', keywordsAny: ['whispered', 'asked', 'replied'] }, { text: 'Finish with resolution', keywordsAny: ['finally', 'in the end', 'at last'] }],
    supportWords: ['whispered', 'muttered', 'stammered', 'replied', 'carefully', 'finally'],
    requiredChecks: [{ id: 'dialogue-line', label: 'Include one dialogue line', keywordsAny: ['"', '“', '”', "'"] }, { id: 'speech-tag', label: 'Use a speech/action tag', keywordsAny: ['said', 'whispered', 'replied', 'asked', 'muttered', 'stammered', 'shouted'] }, { id: 'conclusion', label: 'Include a conclusion signal', keywordsAny: ['finally', 'in the end', 'at last'] }],
    rubric: ['Dialogue punctuation attempted', 'Actions support feelings', 'Strong ending'],
    sampleAnswer: 'A tiny key slipped under the bottom shelf while we were returning books. “Did you see where it went?” Mei asked, kneeling beside me. I peered into the dark space and muttered that we needed a ruler. Finally, the key slid out, and Mei sighed with relief. In the end, we promised to zip our pouches before entering the library.',
    tryThis: ['Replace one speech tag with a stronger action tag.', 'Add one line showing nervousness without saying “nervous”.'],
    rewards: { xp: 48, collectibles: ['dialogue-master-badge', 'word-bucket-library'] },
  },
  'p3-lesson-new-classmate': {
    id: 'p3-lesson-new-classmate', track: 'p3t1Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 3: The New Classmate Challenge', textType: 'guided narrative',
    skillFocus: ['3-step conclusions', 'purposeful dialogue', 'feelings + actions'],
    introTeaching: ['Every dialogue line should reveal a problem or solution.', 'Conclusions should show change in character.'],
    teachCards: [CONCLUSION_CARD, SPEECH_PURPOSE_CARD],
    vocabRevision: ['hesitated', 'offered', 'grinned', 'awkward', 'encouraged'],
    wordBucket: [
      { word: 'hesitated', meaning: 'paused because you were unsure', example: 'She hesitated at the door before walking in.' },
      { word: 'offered', meaning: 'asked if someone would like something', example: 'Arjun offered me half of his curry puff.' },
      { word: 'grinned', meaning: 'smiled widely', example: 'He grinned when his name was called.' },
      { word: 'awkward', meaning: 'uncomfortable and not sure what to do', example: 'There was an awkward silence after the joke.' },
      { word: 'encouraged', meaning: 'gave someone hope or confidence', example: 'My friends encouraged me to try out for the choir.' },
    ],
    spellingRevision: ['friendship', 'comfortable', 'invited', 'explained'],
    reviseDrills: [
      { type: 'arrange_sequence', question: 'Put the 3 steps of this ending in order:', sentences: ['As I walked home, I could not stop smiling.', 'I learned that a small invitation can make someone feel welcome.', 'I will always remember the day the new classmate became my friend.'], correctOrder: [0, 1, 2], hint: 'Feelings first, then the lesson, then link to the topic.', why: 'Step 1 is feelings (smiling), step 2 is the lesson learnt, and step 3 links back to the topic “The New Classmate”.' },
      { type: 'vocab_mcq', question: 'Topic: “The New Classmate”. Which last line links back to the topic?', options: ['Then I went home and ate dinner.', 'I will never forget how a lonely new classmate became my best friend.', 'The end.'], correctIndex: 1, hint: 'Look for the words of the title.', why: 'It uses the words “new classmate” from the title, so the reader knows the story is complete.' },
      { type: 'vocab_mcq', question: 'Which sentence is a lesson learnt?', options: ['I learned that it takes courage to make the first move.', 'We played catching at recess.', 'The canteen was very crowded.'], correctIndex: 0, hint: 'A lesson starts with something like “I learned that…” or “I realised that…”.', why: 'It tells us what the character understood after the story. The other two only describe events or places.' },
      { type: 'dialogue_improve', weakDialogue: '"Hello," I said. "Hello," he said.', question: 'Pick the dialogue that best moves the story forward:', options: ['"How are you?" I asked. "Fine," he said.', '"Would you like to sit with us?" I asked, sliding my tray aside to make space.'], correctIndex: 1, hint: 'Which line helps solve the problem of him being alone?', why: 'The invitation helps solve the problem, and the action tag (sliding my tray aside) shows kindness.' },
      { type: 'show_not_tell', question: 'Which sentence SHOWS that the new classmate felt lonely?', options: ['He was lonely.', 'He sat alone at the end of the bench, pushing his noodles around with his fork.', 'He felt very lonely and sad.'], correctIndex: 1, hint: 'Find what he DID.', why: 'Sitting alone and pushing his food around are actions that show loneliness without the word “lonely”.' },
    ],
    storyStarterChoices: ['Our new classmate sat alone during recess, staring at the floor.', 'I almost walked away, but then I heard him sigh.', 'Have you ever been the new kid in class?'],
    plotPlanTemplate: ['setting', 'character', 'problem', 'climax', 'conclusion'],
    paragraphMissions: [{ text: 'Show problem clearly', keywordsAny: ['alone', 'quiet', 'new classmate'] }, { text: 'Use one encouraging dialogue line', keywordsAny: ['join us', 'come with us', 'sit with us'] }, { text: 'End with what changed', keywordsAny: ['smiled', 'learned', 'grinned'] }],
    supportWords: ['although', 'because', 'meanwhile', 'after that', 'finally', 'I learned that'],
    requiredChecks: [{ id: 'problem-clear', label: 'State the social problem', keywordsAny: ['alone', 'quiet', 'new classmate', 'nobody'] }, { id: 'dialogue-purpose', label: 'Dialogue that helps solve the problem', keywordsAny: ['join us', 'come with us', 'sit with us', 'asked'] }, { id: 'change-ending', label: 'Show change at the end', keywordsAny: ['smiled', 'grinned', 'felt', 'learned'] }],
    rubric: ['Problem → action → resolution', 'Dialogue serves purpose', 'Conclusion shows growth'],
    sampleAnswer: 'Our new classmate sat alone near the stairs while everyone else played. Although I felt shy, I walked over and said, “Would you like to join our game?” He hesitated, then nodded slowly. After that, we passed the ball together and he started to grin. Finally, he thanked us, and I learned that one small invitation can change someone’s day.',
    tryThis: ['Add one sensory detail to the setting.', 'Check your ending has all 3 steps: feelings, lesson, link to the topic.'],
    rewards: { xp: 50, collectibles: ['conclusion-crafter-badge', 'friendship-word-bucket'] },
  },
  'p3-lesson-midnight-noise': {
    id: 'p3-lesson-midnight-noise', track: 'p3t1Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 4: Midnight Noise at Home', textType: 'narrative',
    skillFocus: ['sound words (onomatopoeia)', '5 senses recycle', 'show-not-tell recycle'],
    introTeaching: ['Recycle all key term skills in one complete story.', 'Plan carefully so climax and ending are clear.'],
    teachCards: [ONOMATOPOEIA_CARD, PUT_IT_TOGETHER_CARD],
    vocabRevision: ['creaked', 'faint', 'tiptoed', 'heartbeat', 'laughed'],
    wordBucket: [
      { word: 'creaked', meaning: 'made a long, squeaky sound, like an old door', example: 'The bedroom door creaked as I pushed it open.' },
      { word: 'faint', meaning: 'very soft or hard to see or hear', example: 'I heard a faint tapping from the kitchen.' },
      { word: 'tiptoed', meaning: 'walked quietly on the front of your feet', example: 'I tiptoed past my sleeping grandmother.' },
      { word: 'heartbeat', meaning: 'the thumping of your heart', example: 'My heartbeat was so loud I could hear it.' },
      { word: 'clatter', meaning: 'a loud noise of hard things hitting each other', example: 'Spoons fell into the sink with a clatter.' },
    ],
    spellingRevision: ['midnight', 'kitchen', 'listened', 'instead'],
    reviseDrills: [
      { type: 'vocab_mcq', question: 'Which sound word fits? The old wooden door ____ open slowly.', options: ['creaked', 'sizzled', 'buzzed'], correctIndex: 0, hint: 'Think of the sound an old door makes.', why: 'Old doors creak. Sizzle is food frying, and buzz is a bee or mosquito.' },
      { type: 'vocab_mcq', question: '“Sizzle” is the sound of…', options: ['food frying in a hot pan', 'a school bell', 'a dog barking'], correctIndex: 0, hint: 'Imagine eggs in a hot pan.', why: 'Sizzle copies the hissing sound of food in hot oil.' },
      { type: 'opening_upgrade', question: 'Which opening starts with a sound word and then explains it?', options: ['Thud! Something heavy had fallen in the kitchen.', 'It was night and I was sleeping.', 'Thud thud thud thud thud.'], correctIndex: 0, hint: 'You need a sound word AND a sentence that tells what made it.', why: 'It starts with the sound word “Thud!” and then tells the reader what made the sound. The last option has no explanation.' },
      { type: 'sentence_upgrade', weakSentence: 'I heard a noise in the kitchen.', question: 'Upgrade this sentence with sensory detail.', options: ['I heard a noise in the kitchen.', 'A sharp clatter echoed from the dark kitchen, and my heart hammered.', 'There was something in the kitchen maybe.'], correctIndex: 1, hint: 'Which one lets you hear the sound and feel the fear?', why: '“A sharp clatter” tells you exactly what the noise was, and “my heart hammered” shows fear.' },
      { type: 'order_sequence', question: 'Pick the best story order.', options: ['ending -> beginning -> climax', 'beginning -> problem -> climax -> resolution', 'climax -> title -> ending'], correctIndex: 1, hint: 'Climb the story mountain from the bottom.', why: 'Stories climb from the beginning, through the problem, up to the climax, and then down to the resolution.' },
    ],
    storyStarterChoices: ['Thud! A loud noise woke me just after midnight.', 'The house was dark, but the kitchen light was on.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: [{ text: 'Add at least one sensory clue', keywordsAny: ['heard', 'cold', 'dark', 'smell'] }, { text: 'Use one dialogue line', keywordsAny: ['"', '“', '”'] }, { text: 'End with reflection', keywordsAny: ['I learned', 'in the end', 'next time'] }],
    supportWords: ['thud', 'creak', 'suddenly', 'while', 'because', 'in the end'],
    requiredChecks: [{ id: 'sensory-recycle', label: 'Use one sensory expression', keywordsAny: ['heard', 'smell', 'cold', 'dark', 'creaked'] }, { id: 'dialogue-recycle', label: 'Include one dialogue line', keywordsAny: ['"', '“', '”', "'"] }, { id: 'plot-finish', label: 'End with clear resolution', keywordsAny: ['in the end', 'finally', 'at last'] }],
    rubric: ['Complete plot arc', 'Recycled skills visible', 'Reader can follow events clearly'],
    sampleAnswer: 'Thud! A loud noise woke me, and the room felt icy. I tiptoed to the kitchen while my heartbeat thumped in my ears. “Who is there?” I whispered, gripping the door frame. Suddenly, my brother popped up with a saucepan and laughed because he was making noodles. In the end, I laughed too and learned not to panic before checking the facts.',
    tryThis: ['Swap two simple verbs for vivid verbs.', 'Add one more sound word to your climax.'],
    rewards: { xp: 52, collectibles: ['sensory-spark-card', 'plot-builder-token'] },
  },
  'p3-boss-quiz': {
    id: 'p3-boss-quiz', track: 'p3t1Creative', level: 3, lessonType: 'bossQuiz', lessonTitle: 'Boss Check: Creative Writing Review',
    skillFocus: ['sensory details', 'show-not-tell', 'speech tags', 'story starters', 'plot sequence', 'conclusions', 'sound words'], introTeaching: ['Beat the boss quiz to complete Term 1 training.'],
    bossQuiz: { passMark: 9, questions: [
      { id: 'q1', q: 'Which line shows-not-tells a feeling?', options: ['I was scared.', 'My hands trembled and I stepped back.', 'I felt nervous.'], answer: 1, why: 'Trembling hands and stepping back SHOW fear. The other two only name the feeling.' },
      { id: 'q2', q: 'Which connector best signals an ending?', options: ['because', 'while', 'finally'], answer: 2, why: '“Finally” tells the reader the story is reaching its end.' },
      { id: 'q3', q: 'Which sentence has purposeful dialogue?', options: ['“Hi,” I said.', '“Hide behind me,” Zara whispered as she blocked the door.', '“Okay,” he replied.'], answer: 1, why: 'Zara’s words move the story forward and the action tag shows she is protecting someone.' },
      { id: 'q4', q: 'Best plot order?', options: ['Climax → intro → ending', 'Intro → rising action → climax → falling action → conclusion', 'Ending → intro → problem'], answer: 1, why: 'That is the story mountain: up to the climax, then down to the conclusion.' },
      { id: 'q5', q: 'A strong conclusion should…', options: ['Repeat the title only', 'Introduce a new character suddenly', 'Share feelings, give a lesson learnt and link to the topic'], answer: 2, why: 'A strong ending has 3 steps: feelings, lesson learnt and a link to the topic.' },
      { id: 'q6', q: '“Woof! Woof!” is an example of…', options: ['a sound word (onomatopoeia)', 'a speech tag', 'a lesson learnt'], answer: 0, why: '“Woof” copies the sound a dog makes, so it is a sound word.' },
      { id: 'q7', q: '“We won the match!” Jun ____, punching the air. Which speech tag fits?', options: ['sobbed', 'cheered', 'grumbled'], answer: 1, why: 'Jun is happy, so “cheered” matches. Sobbing and grumbling are for sad or annoyed speech.' },
      { id: 'q8', q: 'Your story happens in your bedroom. Which weather opening fits?', options: ['The sun blazed down on the busy playground.', 'Morning sunlight crept through my bedroom curtains.', 'Thunder rolled over the stadium.'], answer: 1, why: 'The story is indoors, so we see the sunlight through the bedroom curtains.' },
      { id: 'q9', q: 'Which sentence joins “I was tired. I walked home slowly.” without starting with “I”?', options: ['Tired and sleepy, I trudged home slowly.', 'I was tired and I walked home slowly.', 'I was tired. I walked home.'], answer: 0, why: 'Starting with “Tired and sleepy” joins the ideas into one sentence and avoids starting with “I” again.' },
      { id: 'q10', q: 'Which line describes a hawker centre with the sense of SMELL?', options: ['Plates clattered on every table.', 'The smoky smell of satay drifted past my nose.', 'The plastic chair felt sticky.'], answer: 1, why: 'The smoky smell of satay reaches your nose. Clattering is sound and sticky is touch.' },
    ], constructedItems: [
      { id: 'q11-cr', type: 'mini_revision', q: 'Improve this weak sentence using show-not-tell.', original: 'I was very happy about the result.', hint: 'Replace the emotion word with an action or physical reaction.', improvementSignals: ['smiled', 'grinned', 'jumped', 'cheered', 'punched the air', 'bounced', 'leaped'] },
      { id: 'q12-cr', type: 'mini_revision', q: 'Show that you were embarrassed, without using the word “embarrassed”.', original: 'I was embarrassed.', hint: 'What did your face do? Where did you look? What did you say?', improvementSignals: ['cheeks', 'face', 'red', 'blushed', 'looked down', 'stared at', 'whispered', 'mumbled', 'hid', 'burned'] },
    ] },
    rewards: { xp: 60, collectibles: ['p3-term1-writing-medal'] },
  },

  'p3t2-bootcamp-openings': {
    id: 'p3t2-bootcamp-openings', track: 'p3t2Creative', level: 3, lessonType: 'bootcamp', lessonTitle: 'T2 Bootcamp: Sentence Openings and Figurative Sparks', textType: 'guided narrative prep',
    skillFocus: ['sentence openings', 'simile/personification', 'dialogue purpose'],
    introTeaching: ['Start sentences in different ways: time, place, action, feeling.', 'Use similes and personification carefully to paint a scene.', 'Dialogue should solve problems or raise stakes.'],
    vocabRevision: ['glowed', 'lurched', 'murmured', 'sparked', 'darted', 'steady'],
    spellingRevision: ['beautiful', 'throughout', 'whispered', 'adventure'],
    reviseDrills: [
      { type: 'opening_upgrade', question: 'Best opening with action + place?', options: ['I had a day.', 'Across the hallway, my bag slipped as the bell rang.', 'This is a story.'], correctIndex: 1 },
      { type: 'vocab_mcq', question: 'Choose a personification sentence.', options: ['The wind moved.', 'The wind tapped on the window like a restless guest.', 'I saw wind.'], correctIndex: 1 },
      { type: 'spelling_pick', question: 'Pick the correct spelling.', options: ['advenchure', 'adventure', 'advanture'], correctIndex: 1 },
    ],
    storyStarterChoices: ['Before sunrise, the school gate yawned open in the drizzle.', 'As the bell rang, my notebook shot from my hands like a fish leaping from water.'],
    plotPlanTemplate: ['setting', 'problem', 'climax', 'resolution', 'reflection'],
    paragraphMissions: [{ text: 'Use two different sentence openings', keywordsAny: ['before', 'across', 'as', 'while'] }, { text: 'Use one simile or personification', keywordsAny: ['like a', 'as if', 'the wind', 'the rain'] }, { text: 'End with reflection', keywordsAny: ['I realized', 'I learned', 'next time'] }],
    supportWords: ['before', 'meanwhile', 'like a', 'as if', 'finally'],
    requiredChecks: [{ id: 'openings-varied', label: 'Use varied sentence openings', keywordsAny: ['before', 'as', 'while', 'across'] }, { id: 'figurative-line', label: 'Include one simile/personification idea', keywordsAny: ['like a', 'as if', 'wind', 'rain'] }, { id: 'ending-reflection', label: 'Include reflection ending', keywordsAny: ['I learned', 'I realized', 'next time'] }],
    rewards: { xp: 44, collectibles: ['opening-artist-card'] },
  },
  'p3t2-lesson-market-rush': {
    id: 'p3t2-lesson-market-rush', track: 'p3t2Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 1: Market Rush', textType: 'narrative',
    skillFocus: ['sensory detail', 'chronological flow', 'climax build'],
    introTeaching: ['Use smell/sound details to anchor setting.', 'Build urgency toward a clear turning point.'],
    vocabRevision: ['bustled', 'sizzling', 'weaved', 'stumbled', 'grabbed'], spellingRevision: ['crowded', 'careful', 'vegetables', 'balance'],
    reviseDrills: [...REVISION_CORE_DRILLS, { type: 'choose_best_revision', original: 'The market was busy and loud.', question: 'Which revision is stronger?', options: ['The market was very busy and very loud.', 'Shoppers bustled between stalls while the sizzle of oil and shouts of vendors filled the air.'], correctIndex: 1 }],
    storyStarterChoices: ['Steam rose from the noodle stall while shoppers squeezed past one another.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: [{ text: 'Sensory opening', keywordsAny: ['smell', 'sizzling', 'steam', 'shouted'] }, { text: 'Build a climax moment', keywordsAny: ['suddenly', 'all at once', 'just then'] }, { text: 'Clear resolution', keywordsAny: ['finally', 'in the end'] }],
    supportWords: ['first', 'next', 'suddenly', 'after that', 'finally'],
    requiredChecks: [{ id: 'market-setting', label: 'Describe market setting', keywordsAny: ['stall', 'market', 'shoppers', 'steam'] }, { id: 'climax-marker', label: 'Include a climax marker', keywordsAny: ['suddenly', 'just then', 'all at once'] }, { id: 'resolution-marker', label: 'Include a resolution marker', keywordsAny: ['finally', 'in the end'] }],
    rewards: { xp: 47, collectibles: ['sensory-spark-card'] },
  },
  'p3t2-lesson-garden-storm': {
    id: 'p3t2-lesson-garden-storm', track: 'p3t2Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 2: Garden Storm Rescue', textType: 'narrative',
    skillFocus: ['personification', 'dialogue for decisions'],
    introTeaching: ['Personification can make weather scenes vivid.', 'Dialogue should show planning in the crisis.'],
    vocabRevision: ['howled', 'lashed', 'shelter', 'dragged', 'soaked'], spellingRevision: ['thunder', 'lightning', 'umbrella', 'decision'],
    reviseDrills: [{ type: 'dialogue_tag', question: 'Which line shows purposeful dialogue?', options: ['"Oh," I said.', '"Take the small plants first," Jia shouted, pulling the cart.', '"Nice," he replied.'], correctIndex: 1 }, ...REVISION_CORE_DRILLS, { type: 'dialogue_improve', weakDialogue: '"Hello," said Jia. "Hello," I replied.', question: 'Pick the dialogue that best moves the story forward:', options: ['"How are you?" asked Jia. "Good," I said.', '"Grab the pots before the wind takes them!" Jia shouted, reaching for the nearest shelf.'], correctIndex: 1 }],
    storyStarterChoices: ['Dark clouds gathered, and the wind clawed at the garden flags.'],
    plotPlanTemplate: ['setting', 'problem', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: [{ text: 'Use one personification line', keywordsAny: ['wind', 'clouds', 'rain'] }, { text: 'Purposeful dialogue in climax', keywordsAny: ['take', 'run', 'quick', 'help'] }, { text: 'Ending linked to problem', keywordsAny: ['saved', 'safe', 'in the end'] }],
    supportWords: ['although', 'because', 'just then', 'finally'],
    requiredChecks: [{ id: 'weather-personification', label: 'Use weather personification/sensory detail', keywordsAny: ['wind', 'clouds', 'rain', 'howled'] }, { id: 'decision-dialogue', label: 'Include decision-making dialogue', keywordsAny: ['"', 'take', 'quick', 'help'] }, { id: 'problem-linked-conclusion', label: 'Conclusion links back to problem', keywordsAny: ['safe', 'saved', 'in the end'] }],
    rewards: { xp: 49, collectibles: ['dialogue-master-badge'] },
  },
  'p3t2-lesson-bus-stop-kindness': {
    id: 'p3t2-lesson-bus-stop-kindness', track: 'p3t2Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 3: Kindness at the Bus Stop', textType: 'guided narrative',
    skillFocus: ['emotion through action', 'conclusion craft'],
    introTeaching: ['Show kindness through actions and reactions.', 'Conclude with a lesson learned.'],
    vocabRevision: ['tugged', 'shivering', 'offered', 'grateful', 'warmth'], spellingRevision: ['blanket', 'shelter', 'patiently', 'kindness'],
    reviseDrills: [{ type: 'show_not_tell', question: 'Upgrade “He was sad.”', options: ['He was sad.', 'He stared at the ground and rubbed his eyes.', 'Sadness happened.'], correctIndex: 1 }, ...REVISION_CORE_DRILLS],
    storyStarterChoices: ['The bus shelter rattled in the rain as an old man hugged his thin jacket.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: [{ text: 'Show feelings using body action', keywordsAny: ['stared', 'rubbed', 'shivered', 'smiled'] }, { text: 'Include helping action', keywordsAny: ['offered', 'shared', 'helped'] }, { text: 'Close with reflection', keywordsAny: ['I learned', 'next time', 'in the end'] }],
    supportWords: ['while', 'because', 'after that', 'in the end'],
    requiredChecks: [{ id: 'feeling-action', label: 'Show feeling through action', keywordsAny: ['shivered', 'stared', 'rubbed', 'smiled'] }, { id: 'kindness-action', label: 'Include an act of kindness', keywordsAny: ['offered', 'shared', 'helped'] }, { id: 'reflection-ending', label: 'Include reflective ending', keywordsAny: ['I learned', 'in the end', 'next time'] }],
    rewards: { xp: 50, collectibles: ['conclusion-crafter-badge'] },
  },
  'p3t2-lesson-lab-surprise': {
    id: 'p3t2-lesson-lab-surprise', track: 'p3t2Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 4: Science Lab Surprise', textType: 'narrative',
    skillFocus: ['dialogue tags', 'climax pacing', 'sequence'],
    introTeaching: ['Use sequence connectors to control pacing.', 'Dialogue tags should show emotion and movement.'],
    vocabRevision: ['fizzed', 'spilled', 'gasped', 'measured', 'steady'], spellingRevision: ['experiment', 'carefully', 'equipment', 'solution'],
    reviseDrills: [{ type: 'order_sequence', question: 'Choose the strongest story order.', options: ['problem → intro → ending', 'intro → test → spill/climax → fix → reflection', 'ending → climax → intro'], correctIndex: 1 }, ...REVISION_CORE_DRILLS],
    storyStarterChoices: ['Blue liquid fizzed in the beaker while our group leaned closer.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: [{ text: 'Use at least two sequence connectors', keywordsAny: ['first', 'next', 'after that', 'finally'] }, { text: 'Dialogue at climax', keywordsAny: ['"', 'shouted', 'whispered'] }, { text: 'Reflect on teamwork', keywordsAny: ['team', 'together', 'I learned'] }],
    supportWords: ['first', 'next', 'suddenly', 'after that', 'finally'],
    requiredChecks: [{ id: 'sequence-flow', label: 'Use sequence connectors', keywordsAny: ['first', 'next', 'after that', 'finally'] }, { id: 'climax-dialogue', label: 'Use dialogue at climax', keywordsAny: ['"', 'shouted', 'asked'] }, { id: 'team-reflection', label: 'End with teamwork reflection', keywordsAny: ['team', 'together', 'I learned'] }],
    rewards: { xp: 52, collectibles: ['plot-builder-token'] },
  },
  'p3t2-lesson-field-trip': {
    id: 'p3t2-lesson-field-trip', track: 'p3t2Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 5: Field Trip Turnaround', textType: 'narrative',
    skillFocus: ['arc completeness', 'theme-linked conclusion'],
    introTeaching: ['Bring all skills together: sensory + sequence + dialogue + conclusion.', 'Ensure ending solves the main problem and links to theme.'],
    vocabRevision: ['trail', 'slippery', 'guided', 'cheered', 'relieved'], spellingRevision: ['adventure', 'direction', 'compass', 'remembered'],
    reviseDrills: [...REVISION_CORE_DRILLS, { type: 'opening_upgrade', question: 'Pick strongest opening.', options: ['Trip started.', 'At the edge of the forest trail, our guide raised a warning hand.', 'I am on trip.'], correctIndex: 1 }],
    storyStarterChoices: ['At the edge of the forest trail, our guide raised a warning hand.'],
    plotPlanTemplate: ['setting', 'problem', 'climax', 'resolution', 'reflection'],
    paragraphMissions: [{ text: 'Set scene with sensory details', keywordsAny: ['trail', 'mud', 'wind', 'echo'] }, { text: 'Build and resolve climax', keywordsAny: ['suddenly', 'finally', 'safe'] }, { text: 'Conclusion linked to theme of teamwork', keywordsAny: ['teamwork', 'helped each other', 'together'] }],
    supportWords: ['although', 'meanwhile', 'suddenly', 'finally', 'in the end'],
    requiredChecks: [{ id: 'scene-sensory', label: 'Add sensory scene detail', keywordsAny: ['wind', 'mud', 'echo', 'trail'] }, { id: 'arc-complete', label: 'Include climax and resolution signals', keywordsAny: ['suddenly', 'finally', 'in the end'] }, { id: 'theme-conclusion', label: 'Conclusion links to teamwork theme', keywordsAny: ['teamwork', 'together', 'helped each other'] }],
    rewards: { xp: 54, collectibles: ['word-bucket-explorer'] },
  },
  'p3t2-boss-quiz': {
    id: 'p3t2-boss-quiz', track: 'p3t2Creative', level: 3, lessonType: 'bossQuiz', lessonTitle: 'Boss Check: T2 Storycraft Mastery',
    skillFocus: ['openings', 'figurative language', 'dialogue choices', 'climax and conclusion'],
    introTeaching: ['Final check for Term 2 writing powers.'],
    bossQuiz: {
      passMark: 6,
      questions: [
        { id: 't2q1', q: 'Which opening creates strongest setting?', options: ['It was fun.', 'At dawn, fog curled around the empty playground.', 'I have story.'], answer: 1 },
        { id: 't2q2', q: 'Which line uses simile?', options: ['The bell rang.', 'My thoughts raced like marbles down a slope.', 'I felt fast.'], answer: 1 },
        { id: 't2q3', q: 'Purposeful dialogue should...', options: ['just fill space', 'show decisions or conflict', 'avoid verbs'], answer: 1 },
        { id: 't2q4', q: 'Best climax marker?', options: ['because', 'all at once', 'therefore maybe'], answer: 1 },
        { id: 't2q5', q: 'Best conclusion move?', options: ['add random event', 'link ending to solved problem/theme', 'stop abruptly'], answer: 1 },
        { id: 't2q6', q: 'Which sequence is strongest?', options: ['ending, intro, problem', 'intro, rising action, climax, resolution, reflection', 'climax, title, ending'], answer: 1 },
      ],
      constructedItems: [
        { id: 't2q7-cr', type: 'short_response', q: 'Write one sentence that uses personification to describe a storm.', hint: 'Give the storm a human action or feeling.', requiredSignals: ['wind', 'rain', 'clouds', 'thunder', 'howled', 'whispered', 'danced', 'roared', 'screamed', 'clawed', 'tapped', 'wept'] },
        { id: 't2q8-cr', type: 'mini_revision', q: 'Improve this weak opening line.', original: 'One day something happened at school.', hint: 'Add a specific place, time, or action to hook the reader.', improvementSignals: ['morning', 'bell', 'corridor', 'classroom', 'gate', 'suddenly', 'rushed', 'rang', 'echoed'] },
      ],
    },
    rewards: { xp: 62, collectibles: ['p3-term2-writing-medal'] },
  },
};

export function getTracksForLevel(level) {
  return Object.values(WRITING_TRACKS).filter((track) => track.level === level);
}

export function getTrackForLevel(level) {
  return getTracksForLevel(level)[0] || null;
}

export function getLessonsForTrack(trackId) {
  const track = WRITING_TRACKS[trackId];
  if (!track) return [];
  return track.lessonIds.map((id) => writingLessonPacks[id]).filter(Boolean);
}

export function validateLessonPackSchema(pack) {
  const required = ['id', 'track', 'level', 'lessonTitle', 'lessonType', 'skillFocus'];
  return required.every((key) => pack?.[key] !== undefined);
}
