export const WRITING_LEVELS = {
  1: 'P1 Sentence Builder',
  2: 'P2 Guided Paragraph',
  3: 'P3 Extended Response',
};

export const writingPrompts = {
  1: [
    {
      id: 'wq-p1-01',
      prompt: 'Write one sentence about a rainy day in school.',
      supportWords: ['raincoat', 'umbrella', 'assembly'],
      rubric: ['Uses a complete sentence', 'Starts with a capital letter', 'Ends with punctuation'],
      sampleAnswer: 'I wore my raincoat before morning assembly because it was raining heavily.',
      xp: 25,
      tryThis: 'Add a describing word to your sentence.',
    },
  ],
  2: [
    {
      id: 'wq-p2-01',
      prompt: 'Write 3-4 sentences about helping a classmate.',
      supportWords: ['because', 'then', 'finally'],
      rubric: ['Has clear sequence', 'Uses at least one connector', 'Includes feeling or reflection'],
      sampleAnswer: 'My friend dropped her books, so I helped her pick them up. Then we arranged the books by subject. Finally, she thanked me and I felt happy.',
      xp: 35,
      tryThis: 'Replace one verb with a stronger verb.',
    },
  ],
  3: [
    {
      id: 'wq-p3-01',
      prompt: 'Write a short paragraph on how our class can reduce waste.',
      supportWords: ['although', 'therefore', 'recycle'],
      rubric: ['States a clear idea', 'Uses evidence/example', 'Uses linking words accurately', 'Uses correct tense and punctuation'],
      sampleAnswer: 'Although our class already recycles paper, we can do more to reduce waste. For example, we can reuse one-sided worksheets for rough work. Therefore, we will save paper and keep our classroom cleaner.',
      xp: 45,
      tryThis: 'Add one persuasive sentence to convince your reader.',
    },
  ],
};
