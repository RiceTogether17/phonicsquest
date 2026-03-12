export const WRITING_LEVELS = {
  1: 'P1 Guided Writing',
  2: 'P2 Guided Writing',
  3: 'P3 Guided + Situational Writing',
  4: 'P4 Situational Writing',
  5: 'P5 Continuous Writing',
  6: 'P6 PSLE Writing Challenge',
};

const BASE_PROMPTS = {
  1: [
    {
      id: 'wq-p1-01',
      mode: 'guided',
      textType: 'simple recount',
      prompt: 'Write 4-5 sentences about your favourite place in school.',
      requiredPoints: ['Name of place', 'One activity there', 'How you feel'],
      supportWords: ['I like', 'because', 'happy'],
      rubric: ['Writes complete simple sentences', 'Includes required content points', 'Uses capital letters and full stops'],
      sampleAnswer: 'My favourite place is the school library. I read storybooks there with my friend. I feel happy because the room is quiet and cozy.',
      xp: 22,
      tryThis: ['Tier 1: Add one describing word.', 'Tier 2: Add one sentence using because.'],
    },
  ],
  2: [
    {
      id: 'wq-p2-01',
      mode: 'guided',
      textType: 'picture-supported paragraph',
      prompt: 'Write a short paragraph about helping at home after school.',
      requiredPoints: ['Task you did', 'Who you helped', 'Why helping matters'],
      supportWords: ['after school', 'then', 'finally'],
      rubric: ['Ideas are in clear order', 'Uses simple connectors', 'Grammar and punctuation are mostly accurate'],
      sampleAnswer: 'After school, I swept the floor in the living room. Then I helped my mother fold the clothes. Finally, I felt proud because helping keeps our home neat.',
      xp: 26,
      tryThis: ['Tier 1: Add one time connector.', 'Tier 2: Improve one sentence with a stronger verb.'],
    },
  ],
  3: [
    {
      id: 'wq-p3-01',
      mode: 'situational',
      textType: 'short message',
      prompt: 'Write a polite message to your classmate to ask for missed homework.',
      pac: { purpose: 'Request information politely', audience: 'Classmate', context: 'Homework follow-up' },
      requiredPoints: ['Reason for missing class', 'Homework details requested', 'Polite closing'],
      supportWords: ['could', 'please', 'thank you'],
      rubric: ['Uses suitable tone for audience', 'Includes all content points', 'Shows accurate sentence structure'],
      sampleAnswer: 'Hi Hana, I missed class yesterday because I was unwell. Could you please tell me the Maths and English homework? Thank you for your help.',
      xp: 30,
      tryThis: ['Tier 1: Add one sentence to show responsibility.', 'Tier 2: Use one connector to improve flow.'],
    },
  ],
  4: [
    {
      id: 'wq-p4-01',
      mode: 'situational',
      textType: 'email',
      prompt: 'Write an email to your teacher to explain why you were absent from CCA and how you will catch up.',
      pac: { purpose: 'Inform and request guidance', audience: 'Form teacher / CCA teacher', context: 'School attendance follow-up' },
      requiredPoints: ['Reason for absence', 'Apology / polite tone', 'Plan to catch up'],
      supportWords: ['because', 'therefore', 'sincerely'],
      rubric: ['Addresses all content points', 'Uses appropriate tone and format', 'Uses clear grammar and punctuation'],
      sampleAnswer: 'Dear Ms Lim, I am writing to explain my absence from netball CCA yesterday because I had a fever. I am sorry for missing practice. Therefore, I will borrow the training notes and practise the drills before Friday. Thank you for your understanding. Yours sincerely, Aisha',
      xp: 36,
      tryThis: ['Tier 1: Replace one simple sentence with a complex sentence.', 'Tier 2: Add one polite request sentence using modal verbs.'],
    },
  ],
  5: [
    {
      id: 'wq-p5-01',
      mode: 'continuous',
      textType: 'narrative',
      prompt: 'Write a story about a school event where teamwork solved a problem.',
      storyPlan: {
        introduction: 'Who was involved and where did the event happen?',
        risingAction: 'What problem appeared?',
        climax: 'What was the most difficult moment?',
        fallingAction: 'How did the team respond?',
        resolution: 'What lesson did everyone learn?',
      },
      requiredPoints: ['Problem introduced', 'Team response', 'Reflection at end'],
      supportWords: ['although', 'suddenly', 'meanwhile', 'finally'],
      rubric: ['Uses 5-part story structure', 'Uses sequencing and connectors', 'Uses descriptive vocabulary and correct tense'],
      sampleAnswer: 'Our class prepared a booth for the school carnival in the hall. Suddenly, the power supply failed and our display screen turned off. Although we were worried, we split into teams to fix the issue. One group found an extension cable while another redesigned the poster board. Finally, our booth opened on time and we learned that teamwork matters most under pressure.',
      xp: 48,
      tryThis: ['Tier 1: Add one sentence that shows emotion instead of naming it.', 'Tier 2: Rewrite the climax using dialogue and punctuation.'],
    },
  ],
  6: [
    {
      id: 'wq-p6-01',
      mode: 'hybrid',
      textType: 'situational + continuous',
      prompt: 'Choose one: (A) write a formal report about a recycling campaign, or (B) write a narrative from a picture prompt about helping a stranger.',
      pac: { purpose: 'Inform / persuade with clear organisation', audience: 'School leaders or general readers', context: 'PSLE-style writing response' },
      requiredPoints: ['Clear opening', 'Development with details', 'Strong ending'],
      storyPlan: {
        introduction: 'Set context quickly.',
        risingAction: 'Build challenge or issue.',
        climax: 'Show key turning point.',
        fallingAction: 'Describe response/outcome.',
        resolution: 'Close with reflection.',
      },
      supportWords: ['consequently', 'however', 'moreover', 'in conclusion'],
      rubric: ['Content relevance', 'Organisation and coherence', 'Language accuracy', 'Mechanics (spelling/punctuation)'],
      sampleAnswer: 'In conclusion, the campaign succeeded because students understood their role and acted responsibly. The project also taught us to communicate clearly and evaluate our progress.',
      xp: 62,
      tryThis: ['Tier 1: Add one figurative expression naturally.', 'Tier 2: Revise your draft to improve one weak paragraph using COLM criteria.'],
    },
  ],
};

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
