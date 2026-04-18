/**
 * Optional extension bank for Word Vault (Vocabulary Cloze).
 *
 * These passages are merged into `vocabPassages` in vocabPassages.js so
 * expansions can be maintained in smaller files without editing the base bank.
 */
export const EXTRA_VOCAB_PASSAGES = {
  contextInference: {
    p1: [
      {
        id: 'ci-x-p1-01',
        title: 'Picnic Plan',
        text: 'The clouds looked dark, so Mum packed an ___. We also brought a plastic mat to keep our food ___. Everyone hoped the rain would stop ___.',
        answers: ['umbrella', 'dry', 'soon'],
        wordBank: ['umbrella', 'dry', 'soon', 'sweater', 'dirty', 'yesterday'],
        xp: 22,
      },
    ],
    p3: [
      {
        id: 'ci-x-p3-01',
        title: 'Missed Bus',
        text: 'Ethan saw the bus leaving and began to ___. He checked the timetable and realised the next bus would arrive in twenty ___. To avoid being late, he called his aunt for a ___.',
        answers: ['panic', 'minutes', 'ride'],
        wordBank: ['panic', 'minutes', 'ride', 'celebrate', 'centuries', 'nap'],
        xp: 30,
      },
    ],
    p5: [
      {
        id: 'ci-x-p5-01',
        title: 'Final Rehearsal',
        text: 'Although the team made two mistakes during rehearsal, their coach remained ___. She reminded them to breathe steadily and focus on clear ___. By showtime, everyone felt more ___ and ready.',
        answers: ['calm', 'timing', 'composed'],
        wordBank: ['calm', 'timing', 'composed', 'furious', 'noise', 'careless'],
        xp: 42,
      },
    ],
  },
  definitionMatch: {
    p2: [
      {
        id: 'dm-x-p2-01',
        title: 'School Places',
        text: 'We borrow books from the ___. We play football on the ___. We eat our lunch in the ___.',
        answers: ['library', 'field', 'canteen'],
        wordBank: ['library', 'field', 'canteen', 'laboratory', 'office', 'corridor'],
        xp: 26,
      },
    ],
    p4: [
      {
        id: 'dm-x-p4-01',
        title: 'Weather Terms',
        text: 'A sudden strong wind with rain is a ___. Tiny drops of rain are called ___. A long period without rain is a ___.',
        answers: ['storm', 'drizzle', 'drought'],
        wordBank: ['storm', 'drizzle', 'drought', 'sunbeam', 'dew', 'flood'],
        xp: 36,
      },
    ],
    p6: [
      {
        id: 'dm-x-p6-01',
        title: 'Public Language',
        text: 'A plan made by leaders to solve issues is a ___. A careful judgement that considers many sides is a ___ decision. Working with others towards shared goals is ___.',
        answers: ['policy', 'balanced', 'cooperation'],
        wordBank: ['policy', 'balanced', 'cooperation', 'protest', 'rapid', 'confusion'],
        xp: 50,
      },
    ],
  },
  collocationCloze: {
    p2: [
      {
        id: 'cc-x-p2-01',
        title: 'After Class',
        text: 'Before we leave, we ___ our desks and ___ our homework. Then we ___ goodbye to our teacher.',
        answers: ['clear', 'submit', 'say'],
        wordBank: ['clear', 'submit', 'say', 'wash', 'deliver', 'speak'],
        xp: 26,
      },
    ],
    p4: [
      {
        id: 'cc-x-p4-01',
        title: 'Science Report',
        text: 'Our group had to ___ data from three classes. We then ___ a conclusion and ___ the chart to the class.',
        answers: ['collect', 'draw', 'present'],
        wordBank: ['collect', 'draw', 'present', 'gathered', 'made', 'showed'],
        xp: 36,
      },
    ],
    p6: [
      {
        id: 'cc-x-p6-01',
        title: 'Student Council',
        text: 'The committee will ___ a proposal next week. Members must ___ responsibility for each task and ___ feedback from students.',
        answers: ['submit', 'take', 'gather'],
        wordBank: ['submit', 'take', 'gather', 'send', 'do', 'collecting'],
        xp: 50,
      },
    ],
  },
  connectorClue: {
    p3: [
      {
        id: 'con-x-p3-01',
        title: 'Practice and Result',
        text: 'The choir practised every day. ___, their harmonies became stronger. The songs were difficult; ___, they continued trying. ___, they performed confidently.',
        answers: ['As a result', 'however', 'Eventually'],
        wordBank: ['As a result', 'however', 'Eventually', 'Because', 'Although', 'Meanwhile'],
        xp: 32,
      },
    ],
    p5: [
      {
        id: 'con-x-p5-01',
        title: 'Debate Flow',
        text: 'The first team gave clear evidence; ____, the second team offered stronger examples. ____ both teams were persuasive, the judges still had to choose one winner. ____, Team B won by one point.',
        answers: ['however', 'Although', 'In the end'],
        wordBank: ['however', 'Although', 'In the end', 'therefore', 'because', 'Meanwhile'],
        xp: 42,
      },
    ],
  },
  synonymContrast: {
    p4: [
      {
        id: 'sc-x-p4-01',
        title: 'Two Attitudes',
        text: 'Amir remained ___ during the emergency drill, while his brother looked ___. Their teacher praised Amir\'s ___ response.',
        answers: ['calm', 'nervous', 'steady'],
        wordBank: ['calm', 'nervous', 'steady', 'panicked', 'confident', 'shaky'],
        xp: 36,
      },
    ],
    p6: [
      {
        id: 'sc-x-p6-01',
        title: 'Speech Tone',
        text: 'The principal gave a ___ reminder rather than a harsh warning. Her message was firm yet ___. Students left feeling corrected, not ___.',
        answers: ['gentle', 'respectful', 'humiliated'],
        wordBank: ['gentle', 'respectful', 'humiliated', 'aggressive', 'rude', 'inspired'],
        xp: 50,
      },
    ],
  },
};
