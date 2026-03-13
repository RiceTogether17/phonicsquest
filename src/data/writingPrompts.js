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
      mode: 'hybrid',
      textType: 'situational + continuous',
      prompt:
        'Choose one: (A) Write a formal report about a school recycling campaign, OR (B) Write a narrative from a picture prompt about helping a stranger.',
      pac: {
        purpose: 'Inform / persuade with clear organisation',
        audience: 'School leaders or general readers',
        context: 'PSLE-style writing response',
      },
      storyPlan: {
        introduction: 'Set context quickly with precise tense control.',
        risingAction: 'Build challenge or issue with rising tension.',
        climax: 'Show key turning point with advanced grammar.',
        fallingAction: 'Describe response/outcome with formal transitions.',
        resolution: 'Close with reflection using past perfect and modals.',
      },
      requiredPoints: [
        'Clear opening with tense control',
        'Development using formal connectors and complex structures',
        'Strong ending with reflection (past perfect, modals)',
      ],
      supportWords: [
        'consequently',
        'furthermore',
        'had already',
        'nevertheless',
      ],
      rubric: [
        'All grammar strands controlled: tense, SVA, connectors, pronouns',
        'Formal connectors (consequently, furthermore, nevertheless) used accurately',
        'Past perfect (had already) used correctly to sequence events',
        'Pronoun-antecedent clarity maintained in complex sentences',
      ],
      sampleAnswer:
        'The school recycling campaign had already been running for two weeks when the committee noticed a drop in participation. Consequently, we held an emergency meeting to discuss new strategies. Furthermore, we invited a guest speaker who shared her experience working with environmental organisations. Nevertheless, some students remained sceptical. The committee — which had already prepared backup plans — launched a poster competition. By the end of the term, recycling rates had improved by forty percent. The project taught us that persistence and clear communication are essential for lasting change.',
      xp: 60,
      tryThis: [
        'Tier 1: Add one sentence using "nevertheless" to show contrast.',
        'Tier 2: Revise your draft to improve one weak paragraph using COLM criteria (Content, Organisation, Language, Mechanics).',
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
        'I had already stuffed the torn test paper into my bag when Mrs Lee asked us to return our scripts. My heart pounded. Nevertheless, I raised my hand and walked to the front. "I accidentally tore my paper," I admitted, my voice barely a whisper. Furthermore, I explained that I had not intended to hide it. Consequently, Mrs Lee gave me a new copy and thanked me for being honest. She said I need not worry about the tear and that honesty had better be valued more than a perfect paper. That evening, I reflected on how I would handle such moments in the future — I now understood that the truth, however uncomfortable, is always the right path.',
      xp: 62,
      tryThis: [
        'Tier 1: Add one sentence using "had already" to show a past-before-past event.',
        'Tier 2: Strengthen your reflection with a sentence using "nevertheless" and a modal verb.',
      ],
    },
    {
      id: 'wq-p6-03',
      mode: 'situational',
      textType: 'formal argumentative essay',
      prompt:
        'Write a formal argumentative essay on whether school rules help or limit students. Use clear examples and a balanced conclusion.',
      pac: {
        purpose: 'Argue and persuade with balanced reasoning',
        audience: 'School leaders and teachers',
        context: 'PSLE-style formal writing',
      },
      requiredPoints: [
        'Clear thesis with supporting examples',
        'Counter-argument addressed using formal connectors',
        'Balanced conclusion with modal precision',
      ],
      supportWords: [
        'consequently',
        'furthermore',
        'had already',
        'nevertheless',
      ],
      rubric: [
        'All grammar strands demonstrate PSLE-level control',
        'Formal connectors (consequently, furthermore, nevertheless, moreover) structure the argument',
        'Tense control is accurate: present for general truths, past for examples, past perfect for sequences',
        'Subject-verb agreement maintained with complex subjects throughout',
      ],
      sampleAnswer:
        'School rules are often seen as restrictive, but they serve an important purpose. Furthermore, rules such as punctuality create a calm and structured learning environment. Consequently, students learn discipline and responsibility from a young age. Nevertheless, some argue that excessive regulations limit creativity and independence. A student who had already shown leadership qualities, for example, might feel constrained by rules that do not allow student-led initiatives. In conclusion, school rules are most effective when they are fair, clearly communicated, and regularly reviewed. Leaders would do well to involve students in the rule-making process, as this fosters both respect and ownership.',
      xp: 64,
      tryThis: [
        'Tier 1: Add one counter-argument sentence using "nevertheless".',
        'Tier 2: Improve cohesion by adding formal linkers (furthermore, consequently) between paragraphs.',
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
