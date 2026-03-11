export const WRITING_LEVELS = {
  1: 'P4 Situational Writing',
  2: 'P5 Continuous Writing',
  3: 'P6 PSLE Writing Challenge',
};

export const writingPrompts = {
  1: [
    {
      id: 'wq-p4-sw-01',
      mode: 'situational',
      textType: 'email',
      prompt: 'Write an email to your teacher to explain why you were absent from CCA and how you will catch up.',
      pac: {
        purpose: 'Inform and request guidance',
        audience: 'Form teacher / CCA teacher',
        context: 'School attendance follow-up',
      },
      requiredPoints: ['Reason for absence', 'Apology / polite tone', 'Plan to catch up'],
      supportWords: ['because', 'therefore', 'sincerely'],
      rubric: ['Addresses all content points', 'Uses appropriate tone and format', 'Uses clear grammar and punctuation'],
      sampleAnswer: 'Dear Ms Lim, I am writing to explain my absence from netball CCA yesterday because I had a fever. I am sorry for missing practice. Therefore, I will borrow the training notes and practise the drills before Friday. Thank you for your understanding. Yours sincerely, Aisha',
      xp: 35,
      tryThis: ['Tier 1: Replace one simple sentence with a complex sentence.', 'Tier 2: Add one polite request sentence using modal verbs.'],
    },
  ],
  2: [
    {
      id: 'wq-p5-cw-01',
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
      supportWords: ['although', 'suddenly', 'meanwhile', 'finally'],
      rubric: ['Uses 5-part story structure', 'Uses sequencing and connectors', 'Uses descriptive vocabulary and correct tense'],
      sampleAnswer: 'Our class prepared a booth for the school carnival in the hall. Suddenly, the power supply failed and our display screen turned off. Although we were worried, we split into teams to fix the issue. One group found an extension cable while another redesigned the poster board. Finally, our booth opened on time and we learned that teamwork matters most under pressure.',
      xp: 45,
      tryThis: ['Tier 1: Add one sentence that shows emotion instead of naming it.', 'Tier 2: Rewrite the climax using dialogue and punctuation.'],
    },
  ],
  3: [
    {
      id: 'wq-p6-psle-01',
      mode: 'hybrid',
      textType: 'situational + continuous',
      prompt: 'Choose one: (A) write a formal report about a recycling campaign, or (B) write a narrative from a picture prompt about helping a stranger.',
      pac: {
        purpose: 'Inform / persuade with clear organisation',
        audience: 'School leaders or general readers',
        context: 'PSLE-style writing response',
      },
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
      xp: 60,
      tryThis: ['Tier 1: Add one figurative expression naturally.', 'Tier 2: Revise your draft to improve one weak paragraph using COLM criteria.'],
    },
  ],
};
