export const WRITING_TRACKS = {
  p3t1Creative: {
    id: 'p3t1Creative',
    level: 3,
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
};

export const writingLessonPacks = {
  'p3-bootcamp-sensory-show': {
    id: 'p3-bootcamp-sensory-show',
    track: 'p3t1Creative',
    level: 3,
    lessonType: 'bootcamp',
    lessonTitle: 'Skills Bootcamp: Sensory Sparks + Show-Not-Tell',
    textType: 'guided narrative prep',
    skillFocus: ['5 senses', 'show-not-tell', 'powerful story openings'],
    introTeaching: [
      'Great stories help readers see, hear, and feel the moment.',
      'Instead of saying “I was scared”, show it using body actions and sounds.',
      'An opening line should place the reader inside the scene quickly.',
    ],
    vocabRevision: ['drizzle', 'echoed', 'clutched', 'shivered', 'glimmered', 'stumbled'],
    spellingRevision: ['whisper', 'suddenly', 'because', 'through', 'shadow'],
    storyStarterChoices: [
      'The corridor lights flickered just as I reached the staircase.',
      'Rain hammered the roof while I searched for my missing notebook.',
      'A soft voice called my name from the empty basketball court.',
    ],
    plotPlanTemplate: ['setting', 'character', 'problem', 'feelings', 'conclusion'],
    paragraphMissions: ['Open with a scene', 'Show one feeling using actions', 'End with a clear resolution'],
    supportWords: ['suddenly', 'meanwhile', 'because', 'finally', 'whispered'],
    requiredChecks: [
      { id: 'sensory-detail', label: 'Include at least one sensory detail', keywordsAny: ['heard', 'smell', 'cold', 'bright', 'echoed', 'drizzle'] },
      { id: 'show-feeling', label: 'Show a feeling with action', keywordsAny: ['clutched', 'trembled', 'shivered', 'gulped', 'froze'] },
      { id: 'opening-signal', label: 'Start with a scene/action signal', keywordsAny: ['the', 'rain', 'lights', 'suddenly'] },
      { id: 'ending-signal', label: 'Include a concluding signal', keywordsAny: ['finally', 'in the end', 'at last'] },
    ],
    rubric: ['Clear beginning-middle-ending', 'Sensory details included', 'Task checkpoints completed'],
    sampleAnswer: 'Rain drummed on the windows as I clutched my bag and stepped into the dark hall. A chair scraped behind me, and my heart jumped. I froze, then heard my friend laughing from the doorway. In the end, I smiled at my own imagination and hurried back to class.',
    tryThis: ['Swap one weak verb with a vivid verb.', 'Add one dialogue line with a speech tag.'],
    rewards: { xp: 42, collectibles: ['sensory-spark-card', 'show-not-tell-badge'] },
  },
  'p3-lesson-rainy-court': {
    id: 'p3-lesson-rainy-court',
    track: 'p3t1Creative',
    level: 3,
    lessonType: 'narrative',
    lessonTitle: 'Topic 1: The Rainy Court Mystery',
    textType: 'narrative paragraph',
    skillFocus: ['story openings', 'plot structure', 'connectors'],
    introTeaching: ['Build suspense with setting first, then problem.', 'Use connectors to keep events in order.'],
    vocabRevision: ['puddle', 'slipped', 'echo', 'search', 'discovered'],
    spellingRevision: ['morning', 'basketball', 'carefully', 'together'],
    storyStarterChoices: ['The basketball court was empty except for one umbrella on the floor.', 'When the whistle blew, everyone ran inside except me.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: ['Describe setting', 'Add one surprise event', 'Conclude with lesson learnt'],
    supportWords: ['first', 'then', 'because', 'while', 'finally'],
    requiredChecks: [
      { id: 'event-one', label: 'State what happened at the court', keywordsAny: ['court', 'umbrella', 'rain', 'whistle'] },
      { id: 'connector-use', label: 'Use one connector', keywordsAny: ['first', 'then', 'while', 'because', 'finally'] },
      { id: 'reflection', label: 'End with reflection or lesson', keywordsAny: ['I learned', 'next time', 'in the end'] },
    ],
    rubric: ['Ordered events', 'At least one connector', 'Clear conclusion'],
    sampleAnswer: 'The basketball court was silent except for the rain. First, I spotted an umbrella with no owner nearby. Then I heard footsteps and found my classmate searching under the bench. We worked together because she had lost her keychain. In the end, we found it in a puddle, and I learned that calm thinking solves problems faster.',
    tryThis: ['Upgrade one sentence with sensory detail.', 'Add dialogue with an action tag.'],
    rewards: { xp: 45, collectibles: ['story-starter-card', 'plot-builder-token'] },
  },
  'p3-lesson-lost-key': {
    id: 'p3-lesson-lost-key', track: 'p3t1Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 2: The Lost Key in the Library',
    textType: 'narrative paragraph', skillFocus: ['show-not-tell', 'dialogue with speech tags'],
    introTeaching: ['Dialogue should move the story forward.', 'Use action tags: “Rina whispered, clutching her notebook.”'],
    vocabRevision: ['rustled', 'peeked', 'muttered', 'relief', 'stacked'],
    spellingRevision: ['library', 'quietly', 'between', 'searched'],
    storyStarterChoices: ['A tiny key dropped from a book and slid under a shelf.', '“Wait! That key looks familiar,” Ben whispered.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: ['Use one dialogue line', 'Use one action tag', 'Finish with resolution'],
    supportWords: ['whispered', 'replied', 'carefully', 'after that', 'finally'],
    requiredChecks: [
      { id: 'dialogue-line', label: 'Include one dialogue line', keywordsAny: ['"', '“', '”', "'" ] },
      { id: 'speech-tag', label: 'Use a speech/action tag', keywordsAny: ['said', 'whispered', 'replied', 'asked'] },
      { id: 'conclusion', label: 'Include a conclusion signal', keywordsAny: ['finally', 'in the end', 'at last'] },
    ],
    rubric: ['Dialogue punctuation attempted', 'Actions support feelings', 'Strong ending'],
    sampleAnswer: 'A tiny key slipped under the bottom shelf while we were returning books. “Did you see where it went?” Mei asked, kneeling beside me. I peered into the dark space and muttered that we needed a ruler. Finally, the key slid out, and Mei sighed with relief. In the end, we promised to zip our pouches before entering the library.',
    tryThis: ['Replace one speech tag with a stronger action tag.', 'Add one line showing nervousness without saying “nervous”.'],
    rewards: { xp: 48, collectibles: ['dialogue-master-badge', 'word-bucket-library'] },
  },
  'p3-lesson-new-classmate': {
    id: 'p3-lesson-new-classmate', track: 'p3t1Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 3: The New Classmate Challenge',
    textType: 'guided narrative', skillFocus: ['purposeful dialogue', 'feelings + actions', 'conclusions'],
    introTeaching: ['Every dialogue line should reveal a problem or solution.', 'Conclusions should show change in character.'],
    vocabRevision: ['hesitated', 'offered', 'grinned', 'awkward', 'encouraged'],
    spellingRevision: ['friendship', 'comfortable', 'invited', 'explained'],
    storyStarterChoices: ['Our new classmate sat alone during recess, staring at the floor.', 'I almost walked away, but then I heard him sigh.'],
    plotPlanTemplate: ['setting', 'character', 'problem', 'climax', 'conclusion'],
    paragraphMissions: ['Show problem clearly', 'Use one encouraging dialogue line', 'End with what changed'],
    supportWords: ['although', 'because', 'meanwhile', 'after that', 'finally'],
    requiredChecks: [
      { id: 'problem-clear', label: 'State the social problem', keywordsAny: ['alone', 'quiet', 'new classmate', 'nobody'] },
      { id: 'dialogue-purpose', label: 'Dialogue that helps solve the problem', keywordsAny: ['join us', 'come with us', 'sit with us', 'asked'] },
      { id: 'change-ending', label: 'Show change at the end', keywordsAny: ['smiled', 'grinned', 'felt', 'learned'] },
    ],
    rubric: ['Problem → action → resolution', 'Dialogue serves purpose', 'Conclusion shows growth'],
    sampleAnswer: 'Our new classmate sat alone near the stairs while everyone else played. Although I felt shy, I walked over and said, “Would you like to join our game?” He hesitated, then nodded slowly. After that, we passed the ball together and he started to grin. Finally, he thanked us, and I learned that one small invitation can change someone’s day.',
    tryThis: ['Add one sensory detail to the setting.', 'Improve your conclusion with a lesson sentence.'],
    rewards: { xp: 50, collectibles: ['conclusion-crafter-badge', 'friendship-word-bucket'] },
  },
  'p3-lesson-midnight-noise': {
    id: 'p3-lesson-midnight-noise', track: 'p3t1Creative', level: 3, lessonType: 'narrative', lessonTitle: 'Topic 4: Midnight Noise at Home',
    textType: 'narrative', skillFocus: ['5 senses recycle', 'plot arc polish', 'show-not-tell recycle'],
    introTeaching: ['Recycle all key term skills in one complete story.', 'Plan carefully so climax and ending are clear.'],
    vocabRevision: ['creaked', 'faint', 'tiptoed', 'heartbeat', 'laughed'],
    spellingRevision: ['midnight', 'kitchen', 'listened', 'instead'],
    storyStarterChoices: ['A loud thud woke me just after midnight.', 'The house was dark, but the kitchen light was on.'],
    plotPlanTemplate: ['introduction', 'risingAction', 'climax', 'fallingAction', 'conclusion'],
    paragraphMissions: ['Add at least one sensory clue', 'Use one dialogue line', 'End with reflection'],
    supportWords: ['suddenly', 'while', 'because', 'after that', 'in the end'],
    requiredChecks: [
      { id: 'sensory-recycle', label: 'Use one sensory expression', keywordsAny: ['heard', 'smell', 'cold', 'dark', 'creaked'] },
      { id: 'dialogue-recycle', label: 'Include one dialogue line', keywordsAny: ['"', '“', '”', "'" ] },
      { id: 'plot-finish', label: 'End with clear resolution', keywordsAny: ['in the end', 'finally', 'at last'] },
    ],
    rubric: ['Complete plot arc', 'Recycled skills visible', 'Reader can follow events clearly'],
    sampleAnswer: 'A loud thud woke me, and the room felt icy. I tiptoed to the kitchen while my heartbeat thumped in my ears. “Who is there?” I whispered, gripping the door frame. Suddenly, my brother popped up with a saucepan and laughed because he was making noodles. In the end, I laughed too and learned not to panic before checking the facts.',
    tryThis: ['Swap two simple verbs for vivid verbs.', 'Use one connector to smooth your climax to ending.'],
    rewards: { xp: 52, collectibles: ['sensory-spark-card', 'plot-builder-token'] },
  },
  'p3-boss-quiz': {
    id: 'p3-boss-quiz', track: 'p3t1Creative', level: 3, lessonType: 'bossQuiz', lessonTitle: 'Boss Check: Creative Writing Review',
    skillFocus: ['sensory details', 'show-not-tell', 'dialogue tags', 'plot sequence', 'conclusions'],
    introTeaching: ['Beat the boss quiz to complete Term 1 training.'],
    bossQuiz: {
      passMark: 4,
      questions: [
        { id: 'q1', q: 'Which line shows-not-tells a feeling?', options: ['I was scared.', 'My hands trembled and I stepped back.', 'I felt nervous.'], answer: 1 },
        { id: 'q2', q: 'Which connector best signals an ending?', options: ['because', 'while', 'finally'], answer: 2 },
        { id: 'q3', q: 'Which sentence has purposeful dialogue?', options: ['“Hi,” I said.', '“Hide behind me,” Zara whispered as she blocked the door.', '“Okay,” he replied.'], answer: 1 },
        { id: 'q4', q: 'Best plot order?', options: ['Climax → intro → ending', 'Intro → rising action → climax → falling action → conclusion', 'Ending → intro → problem'], answer: 1 },
        { id: 'q5', q: 'A strong conclusion should...', options: ['Repeat the title only', 'Introduce a new character suddenly', 'Resolve the problem and show what changed'], answer: 2 },
      ],
    },
    rewards: { xp: 60, collectibles: ['p3-term1-writing-medal'] },
  },
};

export function getTrackForLevel(level) {
  return Object.values(WRITING_TRACKS).find((track) => track.level === level) || null;
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
