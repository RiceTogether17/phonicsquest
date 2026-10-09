export const WRITING_LEVELS = {
  1: 'P1 Guided Writing',
  2: 'P2 Guided Writing',
  3: 'P3 Guided + Situational Writing',
  4: 'P4 Situational Writing',
  5: 'P5 Continuous Writing',
  6: 'P6 PSLE Writing Challenge',
};

/* ═══════════════════════════════════════════════════════════════════════════
 * BASE_PROMPTS – Spiral Grammar Progression for Writing Quest
 *
 * Each level targets the grammar strands from spiralGrammar.js at
 * the appropriate depth. supportWords, rubric, and prompt demands
 * all align to the strand focus for that level.
 *
 * P1  → Simple Past intro, SVA (is/am/are), Connectors (and/but/because)
 * P2  → Simple Past recount, SVA (has/have), Connectors (so/after/then/first)
 * P3  → Past paragraph consistency, SVA tricky subjects, Subordination,
 *        Reflexive pronouns, Past continuous intro
 * P4  → Past vs past continuous, Collective-noun SVA, although/if connectors,
 *        Fronted adverbials, Future tense, Relative pronouns
 * P5  → Complex clauses with past, Embedded-phrase SVA, despite/not only,
 *        Present perfect, should have/could have
 * P6  → Past perfect, Full-passage SVA, Formal connectors, Type 3
 *        conditionals, Modal precision, Pronoun-antecedent clarity
 * ═══════════════════════════════════════════════════════════════════════════ */

const BASE_PROMPTS = {
  /* ─────────────────────────── P1 – Guided Writing ──────────────────────── */
  1: [
    {
      id: 'wq-p1-01',
      mode: 'guided',
      textType: 'simple recount',
      prompt:
        'Write 4 sentences about what you did at the school playground yesterday.',
      requiredPoints: [
        'What you did (past tense)',
        'Who was with you (use is/am/are correctly)',
        'How you felt (use because)',
      ],
      requiredChecks: [
        { id: 'what-did', label: 'Say what you did', keywordsAny: ['went', 'played', 'ran', 'climbed', 'slid', 'jumped', 'swung', 'sat', 'ate', 'had', 'rode', 'kicked', 'threw', 'caught', 'raced'] },
        { id: 'who-with', label: 'Say who was with you', keywordsAny: ['with', 'friend', 'friends', 'classmate', 'classmates', 'brother', 'sister', 'mum', 'dad', 'mother', 'father', 'teacher', 'cousin', 'alone'] },
        { id: 'feeling-because', label: 'Say how you felt and why, using because', keywordsAny: ['because'] },
      ],
      supportWords: ['I went', 'because', 'and', 'but', 'is', 'are'],
      rubric: [
        'Uses simple past correctly (e.g. went, played, ate)',
        'Uses is/am/are accurately with matching subjects',
        'Joins at least two ideas with and, but, or because',
        'Writes 4 complete sentences with capital letters and full stops',
      ],
      sampleAnswer:
        'Yesterday, I went to the playground with my friend Mei Ling. We played on the swings and I climbed the monkey bars. I am happy because recess is my favourite time. The playground is big but it was very crowded.',
      xp: 20,
      tryThis: [
        'Tier 1: Change one sentence to use "but" instead of "and".',
        'Tier 2: Add one more sentence using "because" to explain why.',
      ],
    },
    {
      id: 'wq-p1-02',
      mode: 'guided',
      textType: 'simple recount',
      prompt:
        'Write 4 sentences about a time you helped someone at school.',
      requiredPoints: [
        'Who you helped (use correct pronoun)',
        'What you did (use past tense)',
        'Join two ideas with and, but, or because',
      ],
      requiredChecks: [
        { id: 'who-helped', label: 'Say who you helped', keywordsAny: ['helped', 'classmate', 'friend', 'teacher', 'him', 'her', 'boy', 'girl'] },
        { id: 'what-did', label: 'Say what you did', keywordsAny: ['carried', 'picked', 'gave', 'showed', 'held', 'lent', 'shared', 'cleaned', 'found', 'opened', 'tied', 'helped'] },
        { id: 'join', label: 'Join two ideas with and, but or because', keywordsAny: ['because', 'but', 'and'] },
      ],
      supportWords: ['I went', 'because', 'and', 'but', 'is', 'are'],
      rubric: [
        'Uses simple past correctly (e.g. helped, picked, carried)',
        'Uses is/am/are accurately when describing people',
        'Connects at least two ideas with and, but, or because',
        'Writes 4 complete sentences with correct punctuation',
      ],
      sampleAnswer:
        'Last Monday, I helped my classmate Ali carry his books. He is in my class and he dropped them near the canteen. I picked them up because he hurt his hand. Ali is kind and he thanked me.',
      xp: 22,
      tryThis: [
        'Tier 1: Add one describing word about the person you helped.',
        'Tier 2: Rewrite one sentence to start with "Because".',
      ],
    },
  ],

  /* ─────────────────────────── P2 – Guided Writing ──────────────────────── */
  2: [
    {
      id: 'wq-p2-01',
      mode: 'guided',
      textType: 'short recount paragraph',
      prompt:
        'Write a short paragraph (5–6 sentences) about a class outing to the zoo.',
      requiredPoints: [
        'Where and when you went (simple past)',
        'Sequence of events using first/then/after that',
        'What you enjoyed most and why',
      ],
      requiredChecks: [
        { id: 'where-when', label: 'Say where and when you went', keywordsAny: ['zoo'] },
        { id: 'sequence', label: 'Put events in order with first, then, after that', keywordsAny: ['first', 'then', 'after that', 'next', 'finally'], minimumHits: 2 },
        { id: 'favourite', label: 'Say what you enjoyed most and why', keywordsAny: ['fun', 'enjoy', 'favourite', 'best', 'enjoyed', 'loved', 'liked'] },
      ],
      supportWords: ['after', 'then', 'first', 'bought', 'brought'],
      rubric: [
        'Uses simple past consistently throughout the recount',
        'Includes at least two sequence connectors (first, then, after that)',
        'Uses has/have or does/do correctly where needed',
        'Paragraph has a clear beginning and ending',
      ],
      sampleAnswer:
        'Last Friday, our class went to the Singapore Zoo. First, we visited the elephant enclosure and watched them bathe. Then, my friend Ahmad bought a souvenir from the gift shop. After that, we ate our packed lunches under a shady tree. I brought my camera and took many photos. It was a fun day because we saw so many animals.',
      xp: 26,
      tryThis: [
        'Tier 1: Add one more sentence using "after that".',
        'Tier 2: Replace a simple verb with a more interesting one (e.g. walked → strolled).',
      ],
    },
    {
      id: 'wq-p2-02',
      mode: 'guided',
      textType: 'short recount paragraph',
      prompt:
        'Write a short paragraph (5–6 sentences) about helping to prepare for a school event.',
      requiredPoints: [
        'What event you prepared for (simple past)',
        'Steps you took in order (first, then, after that)',
        'How you felt at the end',
      ],
      requiredChecks: [
        { id: 'event', label: 'Say what event you prepared for', keywordsAny: ['event', 'concert', 'party', 'fair', 'sports', 'carnival', 'performance', 'celebration', 'day'] },
        { id: 'steps', label: 'Put the steps in order with first, then, after that', keywordsAny: ['first', 'then', 'after that', 'next', 'finally'], minimumHits: 2 },
        { id: 'feeling-end', label: 'Say how you felt at the end', keywordsAny: ['felt', 'proud', 'happy', 'tired', 'excited', 'glad', 'relieved'] },
      ],
      supportWords: ['after', 'then', 'first', 'bought', 'brought'],
      rubric: [
        'Maintains simple past tense consistently',
        'Uses at least two sequence connectors correctly',
        'Subject-verb agreement is accurate (has/have, does/do)',
        'Sentences are clearly ordered and make sense together',
      ],
      sampleAnswer:
        'Last week, our class prepared for the school Sports Day. First, we made posters to cheer for our house. Then, my teacher brought face paint and we painted our cheeks. After that, we practised our cheer one more time. Ahmad bought extra ribbons for our banner. We felt proud because our class had the loudest cheer.',
      xp: 28,
      tryThis: [
        'Tier 1: Add one sentence about a friend using "he" or "she" correctly.',
        'Tier 2: Improve your ending by using "so" to show a result.',
      ],
    },
  ],

  /* ──────────────── P3 – Guided + Situational Writing ───────────────────── */
  3: [
    {
      id: 'wq-p3-01',
      mode: 'guided',
      textType: 'guided recount',
      prompt:
        'Write a guided recount (6–8 sentences) about a time you lost something important at school.',
      requiredPoints: [
        'What you lost and where (simple past)',
        'Steps you took to find it (use when, while, because)',
        'How the situation was resolved',
      ],
      requiredChecks: [
        { id: 'what-lost', label: 'Say what you lost and where', keywordsAny: ['lost', 'missing'] },
        { id: 'search', label: 'Say what you did to find it', keywordsAny: ['searched', 'looked', 'checked', 'asked', 'retraced'] },
        { id: 'resolved', label: 'Say how it was solved', keywordsAny: ['found', 'returned', 'finally', 'in the end', 'at last'] },
      ],
      supportWords: ['when', 'while', 'because', 'although', 'each'],
      rubric: [
        'Maintains tense consistency across the whole paragraph',
        'Uses at least two subordinate connectors (when, while, because)',
        'Handles tricky subjects correctly (each pupil, every child)',
        'Recount follows a clear time sequence of 6–8 sentences',
      ],
      sampleAnswer:
        'Last Tuesday, I lost my pencil case during recess. When I returned to the classroom, my desk was empty. I felt worried because it had all my colour pencils inside. While I searched under the tables, my friend Siti checked the lost-and-found box. Although I was upset, each classmate helped me look carefully. After ten minutes, Siti found it behind the bookshelf. I was so relieved because every pencil was still there.',
      xp: 30,
      tryThis: [
        'Tier 1: Add one sentence using "although" to show contrast.',
        'Tier 2: Start one sentence with "While" to describe two actions happening together.',
      ],
    },
    {
      id: 'wq-p3-02',
      mode: 'situational',
      textType: 'short message',
      prompt:
        'Write a polite message (6–8 sentences) to your classmate to ask for notes you missed when you were absent.',
      pac: {
        purpose: 'Request information politely',
        audience: 'Classmate',
        context: 'Missed lessons follow-up',
      },
      requiredPoints: [
        'Reason you were absent (use because/when)',
        'What notes or homework you need',
        'Polite closing with a thank you',
      ],
      requiredChecks: [
        { id: 'reason', label: 'Say why you were absent', keywordsAny: ['absent', 'sick', 'ill', 'fever', 'missed'] },
        { id: 'notes', label: 'Say which notes or homework you need', keywordsAny: ['notes', 'homework', 'worksheet', 'worksheets', 'assignment'] },
        { id: 'thanks', label: 'End politely with a thank you', keywordsAny: ['thank', 'thanks'] },
      ],
      supportWords: ['when', 'while', 'because', 'although', 'each'],
      rubric: [
        'Maintains past tense consistency when recounting absence',
        'Uses subordinate connectors (when, because) correctly',
        'Appropriate tone and polite language for the audience',
        'Message is 6–8 sentences with all content points addressed',
      ],
      sampleAnswer:
        'Hi Wei Lin, I was absent from school yesterday because I had a doctor\'s appointment. When I checked the class chat, I noticed that each subject had homework assigned. Could you please share the Science and Maths worksheets with me? Although I missed the lesson, I want to catch up before the test. While I was away, did Mrs Tan give any extra practice sheets? Thank you so much for helping me.',
      xp: 32,
      tryThis: [
        'Tier 1: Add one sentence that shows responsibility for catching up.',
        'Tier 2: Use "although" to show contrast in one of your sentences.',
      ],
    },
    {
      id: 'wq-p3-03',
      mode: 'guided',
      textType: 'guided recount with sequence',
      prompt:
        'Write a guided recount (6–8 sentences) about a group project you worked on in class.',
      requiredPoints: [
        'What the project was about (past tense)',
        'What happened during the work (use while/when)',
        'How your group solved a problem (use because/although)',
      ],
      requiredChecks: [
        { id: 'project', label: 'Say what the project was about', keywordsAny: ['project', 'group', 'model', 'poster', 'presentation'] },
        { id: 'during', label: 'Say what happened while you worked (while, when)', keywordsAny: ['while', 'when'] },
        { id: 'solved', label: 'Say how your group solved a problem', keywordsAny: ['solved', 'fixed', 'decided', 'agreed', 'although'] },
      ],
      supportWords: ['when', 'while', 'because', 'although', 'each'],
      rubric: [
        'Tense consistency maintained across the paragraph',
        'Uses at least two different subordinate connectors',
        'Each sentence contributes to the recount sequence',
        'Accurate subject-verb agreement with tricky subjects',
      ],
      sampleAnswer:
        'Last month, our group worked on a Science project about plants. Each member had a different task. When we started, we realised that no one brought the soil. Although we were worried, I ran to the garden to collect some. While I was digging, my teammate Ravi prepared the pots. Because we helped each other, we finished on time. Every group presented their project, but ours received the best feedback.',
      xp: 34,
      tryThis: [
        'Tier 1: Replace one connector with "while" to show simultaneous actions.',
        'Tier 2: Add a concluding sentence that reflects on what you learned.',
      ],
    },
  ],

  /* ─────────────────────── P4 – Situational Writing ─────────────────────── */
  4: [
    {
      id: 'wq-p4-01',
      mode: 'situational',
      textType: 'email',
      prompt:
        'Write an email to your CCA teacher to explain why you missed practice and how you will catch up.',
      pac: {
        purpose: 'Inform and request guidance',
        audience: 'CCA teacher',
        context: 'School attendance follow-up',
      },
      requiredPoints: [
        'Reason for absence (past tense)',
        'Plan to catch up (future tense with will)',
        'Use although or if to show mature reasoning',
      ],
      requiredChecks: [
        { id: 'reason', label: 'Give the reason you missed practice', keywordsAny: ['fever', 'clinic', 'doctor', 'missed', 'absent', 'sick', 'ill', 'appointment', 'because'] },
        { id: 'catch-up', label: 'Say how you will catch up (will)', keywordsAny: ['will'] },
        { id: 'reasoning', label: 'Use although or if to explain', keywordsAny: ['although', 'if'] },
      ],
      supportWords: ['although', 'if', 'will', 'during', 'the team'],
      rubric: [
        'Uses past and future tense appropriately in different parts',
        'Includes at least one although/if connector',
        'Uses fronted adverbials (e.g. During practice, After the session)',
        'Collective-noun SVA is correct (the team was, the class is)',
      ],
      sampleAnswer:
        'Dear Ms Tan,\n\nI am writing to explain my absence from netball CCA last Thursday. During the afternoon, I had a high fever and my mother brought me to the clinic. Although I wanted to attend practice, the doctor advised me to rest. If the team practised new drills, I will ask my teammate to teach me. After school on Monday, I will stay back to catch up. I hope the team was able to continue without too many problems.\n\nYours sincerely,\nAisha',
      xp: 36,
      tryThis: [
        'Tier 1: Add one sentence starting with a fronted adverbial (e.g. Before the next session, ...).',
        'Tier 2: Improve one sentence by combining it with an "if" clause.',
      ],
    },
    {
      id: 'wq-p4-02',
      mode: 'situational',
      textType: 'formal message',
      prompt:
        'Write a formal message to your class monitor about organising a farewell party for a teacher who is leaving.',
      pac: {
        purpose: 'Propose and plan an event',
        audience: 'Class monitor',
        context: 'School farewell event planning',
      },
      requiredPoints: [
        'Suggest an event idea (use if to propose)',
        'Describe tasks to do (use will for future plans)',
        'Use although to address a possible challenge',
      ],
      requiredChecks: [
        { id: 'idea', label: 'Suggest an event idea (use if)', keywordsAny: ['if', 'suggest', 'propose'] },
        { id: 'tasks', label: 'Describe the tasks (will)', keywordsAny: ['will'] },
        { id: 'challenge', label: 'Use although to deal with a possible problem', keywordsAny: ['although'] },
      ],
      supportWords: ['although', 'if', 'will', 'during', 'the team'],
      rubric: [
        'Appropriate mix of past tense (background) and future tense (plans)',
        'Uses although/if connectors to show reasoning',
        'Fronted adverbials used correctly',
        'Collective-noun agreement is accurate (the class has, the team will)',
      ],
      sampleAnswer:
        'Hi Jun Wei,\n\nI think our class should plan a farewell party for Mrs Lim. During the last assembly, she announced that she will be leaving at the end of the term. If we start planning now, we will have enough time to prepare a nice celebration. Although the class has a tight budget, we could make handmade cards and bake cookies together. After the exams, the team will have more free time to practise a short performance. I will bring the supplies if you can help organise the schedule.\n\nLet me know what you think!',
      xp: 38,
      tryThis: [
        'Tier 1: Add a fronted adverbial at the start of one sentence.',
        'Tier 2: Use "unless" instead of "if" in one sentence to change the meaning.',
      ],
    },
    {
      id: 'wq-p4-03',
      mode: 'situational',
      textType: 'formal invitation reply',
      prompt:
        'Write a formal reply to a school invitation confirming your participation in a reading workshop.',
      pac: {
        purpose: 'Respond formally and confirm participation',
        audience: 'Teacher-in-charge',
        context: 'School workshop invitation',
      },
      requiredPoints: [
        'Confirm attendance (future tense)',
        'Explain why you want to attend (use although/because)',
        'Polite formal closing',
      ],
      requiredChecks: [
        { id: 'confirm', label: 'Confirm that you will attend', keywordsAny: ['will attend', 'attend', 'confirm', 'pleased to'] },
        { id: 'why', label: 'Say why you want to attend', keywordsAny: ['because', 'although'] },
        { id: 'closing', label: 'End with a polite formal closing', keywordsAny: ['thank you', 'yours sincerely', 'regards'] },
      ],
      supportWords: ['although', 'if', 'will', 'during', 'the team'],
      rubric: [
        'Future tense used correctly for plans and intentions',
        'Past tense used correctly for background context',
        'Fronted adverbials enhance sentence variety',
        'Formal tone with accurate grammar throughout',
      ],
      sampleAnswer:
        'Dear Mr Goh,\n\nI would like to confirm my attendance at the reading workshop on Friday. Although I found comprehension challenging last term, I am eager to improve my skills. During the session, I will pay close attention to the strategies taught. If there are any preparation materials, I will read them beforehand. After the workshop, I will share what I learned with the rest of the class.\n\nYours sincerely,\nRyan Lee',
      xp: 38,
      tryThis: [
        'Tier 1: Start one sentence with "Before the workshop" as a fronted adverbial.',
        'Tier 2: Add a sentence using "if...will" to show a conditional plan.',
      ],
    },
  ],

  /* ──────────────────────── P5 – Continuous Writing ──────────────────────── */
  5: [
    {
      id: 'wq-p5-01',
      mode: 'continuous',
      textType: 'narrative',
      prompt:
        'Write a story about a school event where teamwork solved a serious problem.',
      storyPlan: {
        introduction: 'Who was involved and where did the event happen?',
        risingAction: 'What problem appeared unexpectedly?',
        climax: 'What was the most difficult moment?',
        fallingAction: 'How did the team respond together?',
        resolution: 'What lesson did everyone learn?',
      },
      requiredPoints: [
        'Problem introduced with show-don\'t-tell',
        'Team response using complex sentence structures',
        'Reflection at end with present perfect for lasting impact',
      ],
      requiredChecks: [
        { id: 'problem-shown', label: 'Show the problem through actions and feelings', keywordsAny: ['trembled', 'gasped', 'heart', 'froze', 'panicked', 'stared', 'shouted', 'panic'] },
        { id: 'team', label: 'Show the team working together', keywordsAny: ['together', 'team', 'teamwork', 'everyone', 'helped'] },
        { id: 'reflection', label: 'Reflect with the present perfect (have learnt, has taught)', keywordsAny: ['has been', 'has taught', 'have become', 'have learnt', 'have learned', 'have realised', 'have realized', 'since then', 'never forget', 'will never forget'] },
      ],
      supportWords: ['despite', 'not only', 'has been', 'should have'],
      rubric: [
        'Uses past tense accurately with complex clause structures (because/although/when)',
        'Includes at least one advanced connector (despite, not only...but also)',
        'Embedded-phrase SVA is accurate (the box of supplies was)',
        'Show-don\'t-tell techniques used instead of naming emotions directly',
      ],
      sampleAnswer:
        'Our class had been preparing for the school carnival for weeks. Despite our careful planning, the power supply failed ten minutes before the doors opened. Not only did the display screen go dark, but also the music system stopped working. My hands trembled as I stared at the blank screen. Although we should have checked the wiring earlier, there was no time for regret. The group of volunteers was quick to act — one team found an extension cable while another redesigned the poster layout. By the time the first visitors arrived, our booth was ready. The experience has been a valuable lesson: teamwork matters most under pressure.',
      xp: 48,
      tryThis: [
        'Tier 1: Add one sentence that shows emotion through action instead of naming it.',
        'Tier 2: Rewrite the climax to include dialogue and "despite" in the same paragraph.',
      ],
    },
    {
      id: 'wq-p5-02',
      mode: 'continuous',
      textType: 'recount',
      prompt:
        'Write about a community activity that changed your view of helping others.',
      storyPlan: {
        introduction: 'When and where did the activity happen?',
        risingAction: 'What challenge did you notice?',
        climax: 'What action did you take?',
        fallingAction: 'How did others respond?',
        resolution: 'How did your thinking change?',
      },
      requiredPoints: [
        'Specific activity described with past tense control',
        'Challenge and action using complex connectors',
        'Reflection using present perfect for ongoing impact',
      ],
      requiredChecks: [
        { id: 'activity', label: 'Describe the activity', keywordsAny: ['volunteer', 'volunteered', 'community', 'elderly', 'cleaned', 'donated', 'visited', 'helped'] },
        { id: 'challenge', label: 'Show a challenge with a linking word', keywordsAny: ['although', 'however', 'despite', 'nevertheless', 'but'] },
        { id: 'reflection', label: 'Reflect with the present perfect (have learnt, has changed)', keywordsAny: ['has been', 'has taught', 'has changed', 'since that day', 'have learnt', 'have learned', 'have realised', 'have realized', 'since then', 'changed'] },
      ],
      supportWords: ['despite', 'not only', 'has been', 'should have'],
      rubric: [
        'Uses simple past and present perfect appropriately',
        'Advanced connectors (despite, not only...but also) used correctly',
        'Subject-verb agreement accurate with embedded phrases',
        'Personal reflection shows growth and uses modal perfect (should have)',
      ],
      sampleAnswer:
        'Initially, I joined the food donation drive only because my friend invited me. Despite my reluctance, I showed up at the community centre on Saturday morning. The stack of donated items was taller than I expected. Not only did we sort hundreds of cans, but we also delivered packs to elderly residents who depended on weekly supplies. One grandmother\'s eyes glistened as she held my hand. I realised I should have started volunteering earlier. Since that day, the experience has been a turning point — I now volunteer monthly and encourage classmates to do the same.',
      xp: 46,
      tryThis: [
        'Tier 1: Add a sentence using "should have" to express a past regret.',
        'Tier 2: Use "not only...but also" to emphasise two actions in one sentence.',
      ],
    },
    {
      id: 'wq-p5-03',
      mode: 'continuous',
      textType: 'narrative with dialogue',
      prompt:
        'Write a story where a misunderstanding between friends is solved through honest conversation.',
      storyPlan: {
        introduction: 'Introduce the friends and setting.',
        risingAction: 'Describe the misunderstanding.',
        climax: 'Show the key conversation with dialogue.',
        fallingAction: 'Explain how trust was repaired.',
        resolution: 'Conclude with a reflection on communication.',
      },
      requiredPoints: [
        'Misunderstanding cause shown through actions (show-don\'t-tell)',
        'Dialogue at climax with correct punctuation',
        'Lesson learned using present perfect and advanced connectors',
      ],
      requiredChecks: [
        { id: 'cause', label: 'Show what caused the misunderstanding', keywordsAny: ['misunderstanding', 'thought', 'assumed', 'ignored', 'avoided', 'upset', 'misunderstood'] },
        { id: 'dialogue', label: 'Use speech at the climax', keywordsAny: ['said', 'asked', 'replied', 'whispered', 'explained', 'admitted'] },
        { id: 'lesson', label: 'Say what you learnt', keywordsAny: ['has taught', 'taught me', 'learnt', 'learned', 'realised', 'realized', 'honest', 'since then'] },
      ],
      supportWords: ['despite', 'not only', 'has been', 'should have'],
      rubric: [
        'Past tense control is accurate throughout complex sentences',
        'Dialogue is punctuated correctly with speech marks and reporting verbs',
        'Advanced connectors (despite, not only...but also, even though) used naturally',
        'Present perfect used in reflection (has taught, has been)',
      ],
      sampleAnswer:
        'At first, I thought Ken had ignored my message on purpose, so I stopped talking to him. Despite my anger, a small part of me felt something was wrong. Not only had he missed my text, but he had also been unwell that weekend. "I did not see your text because my phone battery died," he explained quietly. I should have asked him directly instead of assuming the worst. Afterward, we apologised and promised to clarify things before jumping to conclusions. This experience has taught me that assumptions can damage friendships faster than any argument.',
      xp: 47,
      tryThis: [
        'Tier 1: Improve the dialogue by adding a sentence with "despite".',
        'Tier 2: Add a paragraph that uses show-don\'t-tell to describe the mood before the conversation.',
      ],
    },
  ],

  /* ──────────────────── P6 – PSLE Writing Challenge ─────────────────────── */
  6: [
    {
      id: 'wq-p6-01',
      mode: 'situational',
      textType: 'email report',
      prompt:
        'Your class ran a two-week recycling campaign. Write an email to your principal, Mrs Tan, to report how it went and suggest what the school should do next.',
      pac: {
        purpose: 'Report results and make a suggestion',
        audience: 'Mrs Tan, the principal',
        context: 'End of a class recycling campaign',
      },
      requiredPoints: [
        'What the campaign did and when it ran',
        'One result, with a number if you can',
        'One suggestion for next term, with a reason',
      ],
      requiredChecks: [
        { id: 'campaign', label: 'Say what the campaign did and when', keywordsAny: ['campaign', 'recycling', 'recycle', 'collected', 'bins', 'weeks'] },
        { id: 'result', label: 'Give one result', keywordsAny: ['collected', 'increased', 'reduced', 'kilograms', 'kg', 'more than', 'twice', 'result', 'results'] },
        { id: 'suggestion', label: 'Suggest what to do next, with a reason', keywordsAny: ['suggest', 'propose', 'recommend', 'hope', 'could', 'would like', 'next term'] },
      ],
      supportWords: ['I am writing to', 'As a result', 'Furthermore', 'I would like to suggest', 'Yours sincerely'],
      rubric: [
        'All three points covered clearly',
        'Polite, formal tone that suits the principal',
        'Results stated with facts, not just feelings',
        'Clear paragraphs: purpose, results, suggestion, closing',
      ],
      sampleAnswer:
        'Dear Mrs Tan,\n\nI am writing to report on the recycling campaign that Primary 6 Courage ran from 3 to 14 March. We placed recycling bins for paper, cans and plastic bottles outside every classroom on Level 3, and class monitors emptied them each afternoon.\n\nThe campaign went well. In two weeks, we collected 48 kilograms of paper and more than 300 cans. Furthermore, the amount of rubbish in our class bins was reduced by about half, according to the cleaners.\n\nI would like to suggest that the school places recycling bins on every level next term. Many pupils from other classes asked where they could recycle, so I believe the whole school would take part.\n\nThank you for supporting our campaign.\n\nYours sincerely,\nAisyah Rahman\nClass Monitor, P6 Courage',
      xp: 60,
      tryThis: [
        'Tier 1: Add one fact or number to your result paragraph.',
        'Tier 2: Give your suggestion a reason that the principal would care about.',
      ],
    },
    {
      id: 'wq-p6-02',
      mode: 'continuous',
      textType: 'PSLE narrative',
      prompt:
        'Write a full PSLE-style narrative about a time when honesty was the hardest but best choice.',
      storyPlan: {
        introduction: 'Set the scene with sensory details and tense control.',
        risingAction: 'Build tension around a moral dilemma.',
        climax: 'Show the moment of decision with dialogue.',
        fallingAction: 'Describe the consequences of the honest choice.',
        resolution: 'Reflect using past perfect and modals to show growth.',
      },
      requiredPoints: [
        'Narrative with clear tense control throughout (past, past perfect)',
        'Moral dilemma developed with advanced connectors',
        'Reflection using modal precision (would, need not, had better)',
      ],
      requiredChecks: [
        { id: 'dilemma', label: 'Show the choice you faced', keywordsAny: ['hide', 'admit', 'admitted', 'truth', 'tempted', 'hesitated', 'whether', 'should', 'could have', 'could hide'] },
        { id: 'connectors', label: 'Link ideas with advanced connectors', keywordsAny: ['nevertheless', 'however', 'although', 'despite', 'consequently', 'furthermore'] },
        { id: 'reflection', label: 'Reflect with would, need not or had', keywordsAny: ['would', 'need not', 'had learnt', 'had learned', 'realised', 'realized', 'learnt'] },
      ],
      supportWords: [
        'consequently',
        'furthermore',
        'had already',
        'nevertheless',
      ],
      rubric: [
        'Past perfect used to sequence earlier events correctly',
        'Formal connectors link ideas across paragraphs',
        'Pronoun reference is clear even in complex multi-clause sentences',
        'Modal verbs used with precision (would, need not, had better)',
      ],
      sampleAnswer:
        'I had already stuffed the torn test paper into my bag when Mrs Lee asked us to return our scripts. My heart pounded. Nevertheless, I raised my hand and walked to the front. "I accidentally tore my paper," I admitted, my voice barely a whisper. Furthermore, I explained that I had not intended to hide it. Consequently, Mrs Lee gave me a new copy and thanked me for being honest. She said I need not worry about the tear, and that she valued honesty far more than a perfect paper. That evening, I reflected on how I would handle such moments in the future — I now understood that the truth, however uncomfortable, is always the right path.',
      xp: 62,
      tryThis: [
        'Tier 1: Add one sentence using "had already" to show a past-before-past event.',
        'Tier 2: Strengthen your reflection with a sentence using "nevertheless" and a modal verb.',
      ],
    },
    {
      id: 'wq-p6-03',
      mode: 'situational',
      textType: 'formal letter',
      prompt:
        'Some pupils want to be allowed to use mobile phones during recess. Write a letter to your principal, Mr Lim, giving your view and suggesting a fair rule.',
      pac: {
        purpose: 'Give a view politely and suggest a rule',
        audience: 'Mr Lim, the principal',
        context: 'A school discussion about phones at recess',
      },
      requiredPoints: [
        'Your view, with one reason',
        'One worry others may have, and your answer to it',
        'A fair rule you suggest',
      ],
      requiredChecks: [
        { id: 'view', label: 'Give your view with a reason', keywordsAny: ['believe', 'think', 'feel', 'view', 'opinion', 'because'] },
        { id: 'worry', label: 'Answer one worry others may have', keywordsAny: ['however', 'worry', 'worried', 'concern', 'although', 'some teachers', 'some parents', 'nevertheless'] },
        { id: 'rule', label: 'Suggest a fair rule', keywordsAny: ['suggest', 'propose', 'rule', 'allowed', 'only', 'could'] },
      ],
      supportWords: ['I am writing to', 'I believe', 'However', 'I would like to suggest', 'Yours sincerely'],
      rubric: [
        'All three points covered clearly',
        'Polite, formal tone that suits the principal',
        'The worry is answered fairly, not ignored',
        'The rule is specific and practical',
      ],
      sampleAnswer:
        'Dear Mr Lim,\n\nI am writing to share my view on whether pupils should be allowed to use mobile phones during recess. I believe a limited rule would help, because many of us need to message our parents about after-school plans.\n\nHowever, I understand that some teachers are worried that pupils will play games instead of eating or talking to friends. This is a fair concern. Nevertheless, I think it can be managed if the rule is clear.\n\nI would like to suggest that phones may be used only in the last ten minutes of recess, and only for calls and messages. Pupils who break the rule could have their phones kept by the form teacher until the end of the day.\n\nThank you for considering my suggestion.\n\nYours sincerely,\nDaniel Koh\nP6 Integrity',
      xp: 64,
      tryThis: [
        'Tier 1: Make your rule more exact: when, where and for what?',
        'Tier 2: Add one sentence that shows you understand the other side.',
      ],
    },
  ],
};

/* ═══════════════════════════════════════════════════════════════════════════
 * clonePrompt – Expansion Logic
 *
 * Each base prompt is expanded into three practice variants (A, B, C)
 * with incremental nudges and XP.
 * ═══════════════════════════════════════════════════════════════════════════ */

function clonePrompt(prompt, idx) {
  const labels = ['Practice A', 'Practice B', 'Practice C'];
  const nudges = [
    'Focus on clear sentence boundaries.',
    'Use one extra connector for flow.',
    'Improve word choice with one vivid phrase.',
  ];
  return {
    ...prompt,
    id: `${prompt.id}-v${idx + 1}`,
    prompt: `${prompt.prompt} (${labels[idx]}: ${nudges[idx]})`,
    xp: (prompt.xp || 25) + idx,
  };
}

export const writingPrompts = Object.fromEntries(
  Object.entries(BASE_PROMPTS).map(([level, prompts]) => {
    const expanded = [];
    prompts.forEach((p) => {
      for (let i = 0; i < 3; i++) expanded.push(clonePrompt(p, i));
    });
    return [level, expanded];
  }),
);
