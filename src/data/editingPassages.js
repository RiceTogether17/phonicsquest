export const EDITING_LEVELS = {
  1: 'P1 Editing Foundations',
  2: 'P2 Editing Foundations',
  3: 'P3 Editing Foundations',
  4: 'P4 Editing Drill',
  5: 'P5 Editing Drill',
  6: 'P6 PSLE Editing Simulation',
};

const BASE_PASSAGES = {
  1: [
    {
      id: 'eq-p1-01',
      title: 'My School Bag',
      paragraph: 'I has a red school bag. The bag are light and I carry it every day. Yesterday I pack my books and put in a pencel case. My sister help me check if I have ruler and eraser. We was happy because nothing were missing.',
      errors: [
        { token: 'has', type: 'grammar', correction: 'have', rule: 'subject-verb agreement', explanation: 'Use "I have".' },
        { token: 'are', type: 'grammar', correction: 'is', rule: 'subject-verb agreement', explanation: 'Bag is singular.' },
        { token: 'pack', type: 'grammar', correction: 'packed', rule: 'tense consistency', explanation: 'Yesterday requires past tense.' },
        { token: 'day', type: 'spelling', correction: 'day', rule: 'check', explanation: 'Control item.', accepted: ['day'] },
        { token: 'help', type: 'grammar', correction: 'helped', rule: 'tense consistency', explanation: 'Completed action in past.' },
        { token: 'have', type: 'grammar', correction: 'had', rule: 'tense consistency', explanation: 'Past-time checking uses had.' },
        { token: 'pencel', type: 'spelling', correction: 'pencil', rule: 'spelling', explanation: 'Correct spelling is pencil.' },
        { token: 'ruler', type: 'spelling', correction: 'ruler', rule: 'check', explanation: 'Control item.', accepted: ['ruler'] },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: 'We were happy.' },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: 'Nothing was missing.' },
      ],
      xp: 36,
      tryThis: ['Tier 1: Write two school-item sentences using correct is/are.', 'Tier 2: Write four sentences about packing your bag yesterday.'],
    },
  ],
  2: [
    {
      id: 'eq-p2-01',
      title: 'At the Canteen',
      paragraph: 'After assembly, my friends goes to the canteen. I buyed noodles and my brother choose soup. The auntie smile and gave us napkin. We sits near the fan because the weather were warm. I spill some water, but I wipes it quickly with a tisue.',
      errors: [
        { token: 'goes', type: 'grammar', correction: 'go', rule: 'subject-verb agreement', explanation: 'Friends is plural.' },
        { token: 'buyed', type: 'grammar', correction: 'bought', rule: 'irregular past tense', explanation: 'Past tense of buy is bought.' },
        { token: 'choose', type: 'grammar', correction: 'chose', rule: 'irregular past tense', explanation: 'Past tense of choose is chose.' },
        { token: 'napkin', type: 'spelling', correction: 'napkins', rule: 'spelling', explanation: 'For this sentence, the expected form is napkins.' },
        { token: 'sits', type: 'grammar', correction: 'sat', rule: 'irregular verb form', explanation: 'Past tense of sit is sat.' },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: 'Weather was warm.' },
        { token: 'spill', type: 'grammar', correction: 'spilled', rule: 'tense consistency', explanation: 'Use past tense in sequence.' },
        { token: 'wipes', type: 'grammar', correction: 'wiped', rule: 'tense consistency', explanation: 'Use past tense in sequence.' },
        { token: 'tisue', type: 'spelling', correction: 'tissue', rule: 'spelling', explanation: 'Correct spelling is tissue.' },
        { token: 'canteen', type: 'spelling', correction: 'canteen', rule: 'check', explanation: 'Control item.', accepted: ['canteen'] },
      ],
      xp: 40,
      tryThis: ['Tier 1: Correct three irregular verbs from this passage.', 'Tier 2: Write a short recount of recess with correct past tense.'],
    },
  ],
  3: [
    {
      id: 'eq-p3-01',
      title: 'Neighbourhood Park Day',
      paragraph: 'Last Sunday, my family visit the park near our block. My mother bring sandwiches while I carries a football. We played under a shady tree and my cousin run around happily. Later, dark cloud appear so we decide to go home. The picnic basket was hevy but my brother carried it carefuly.',
      errors: [
        { token: 'visit', type: 'grammar', correction: 'visited', rule: 'tense consistency', explanation: 'Last Sunday indicates past tense.' },
        { token: 'bring', type: 'grammar', correction: 'brought', rule: 'irregular past tense', explanation: 'Past tense of bring is brought.' },
        { token: 'carries', type: 'grammar', correction: 'carried', rule: 'tense consistency', explanation: 'Use past tense in recount.' },
        { token: 'run', type: 'grammar', correction: 'ran', rule: 'irregular past tense', explanation: 'Past tense of run is ran.' },
        { token: 'cloud', type: 'grammar', correction: 'clouds', rule: 'plural noun', explanation: 'Dark clouds appeared.' },
        { token: 'appear', type: 'grammar', correction: 'appeared', rule: 'tense consistency', explanation: 'Past tense needed.' },
        { token: 'decide', type: 'grammar', correction: 'decided', rule: 'tense consistency', explanation: 'Past tense needed.' },
        { token: 'hevy', type: 'spelling', correction: 'heavy', rule: 'spelling', explanation: 'Correct spelling is heavy.' },
        { token: 'carefuly', type: 'spelling', correction: 'carefully', rule: 'spelling', explanation: 'Correct spelling is carefully.' },
        { token: 'picnic', type: 'spelling', correction: 'picnic', rule: 'check', explanation: 'Control item.', accepted: ['picnic'] },
      ],
      xp: 46,
      tryThis: ['Tier 1: Rewrite two sentences using correct past tense.', 'Tier 2: Add one sentence with a connector like because or so.'],
    },
  ],
  4: [
    {
      id: 'eq-p4-01',
      title: 'Library Reading Corner',
      paragraph: 'Our librarian ask each pupil to donate one storybook. Many student brings books from home, but one shelf are still empty. The prefect arrange the books and label every box neatliy. During recess, I readed a mystery tale and writed a short review. The posters on the wall were colorfull and encourged us to read daily.',
      errors: [
        { token: 'ask', type: 'grammar', correction: 'asked', rule: 'tense consistency', explanation: 'Use past tense to match context.' },
        { token: 'student', type: 'grammar', correction: 'students', rule: 'plural noun', explanation: 'Many requires plural.' },
        { token: 'brings', type: 'grammar', correction: 'brought', rule: 'irregular past tense', explanation: 'Past tense of bring is brought.' },
        { token: 'are', type: 'grammar', correction: 'is', rule: 'subject-verb agreement', explanation: 'Shelf is singular.' },
        { token: 'readed', type: 'grammar', correction: 'read', rule: 'irregular verb form', explanation: 'Past tense of read is read.' },
        { token: 'writed', type: 'grammar', correction: 'wrote', rule: 'irregular verb form', explanation: 'Past tense of write is wrote.' },
        { token: 'neatliy', type: 'spelling', correction: 'neatly', rule: 'spelling', explanation: 'Correct spelling is neatly.' },
        { token: 'colorfull', type: 'spelling', correction: 'colourful', rule: 'spelling', explanation: 'Use British spelling.' },
        { token: 'encourged', type: 'spelling', correction: 'encouraged', rule: 'spelling', explanation: 'Correct spelling is encouraged.' },
        { token: 'mystery', type: 'spelling', correction: 'mystery', rule: 'check', explanation: 'Control item.', accepted: ['mystery'] },
      ],
      xp: 55,
      tryThis: ['Tier 1: Correct two tense errors and explain why.', 'Tier 2: Write a short review paragraph with accurate grammar.'],
    },
  ],
  5: [
    {
      id: 'eq-p5-01',
      title: 'Community Clean-Up',
      paragraph: 'Last Saturday, our team clean the park near Bedok Reservoir. The teacher gave us glove and rubbish bags. Mei and I was sorting plastic bottles while Amir collect paper cups. Because everyone work together, the area become cleaner. The residents were gratefull and said we did a wonderfull job.',
      errors: [
        { token: 'clean', type: 'grammar', correction: 'cleaned', rule: 'tense consistency', explanation: 'Use past tense with last Saturday.' },
        { token: 'glove', type: 'grammar', correction: 'gloves', rule: 'plural noun', explanation: 'Plural noun needed.' },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: 'Mei and I is plural.' },
        { token: 'collect', type: 'grammar', correction: 'collected', rule: 'tense consistency', explanation: 'Past tense needed.' },
        { token: 'work', type: 'grammar', correction: 'worked', rule: 'tense consistency', explanation: 'Past tense needed.' },
        { token: 'become', type: 'grammar', correction: 'became', rule: 'irregular past tense', explanation: 'Past tense of become is became.' },
        { token: 'gratefull', type: 'spelling', correction: 'grateful', rule: 'spelling', explanation: 'Correct spelling is grateful.' },
        { token: 'wonderfull', type: 'spelling', correction: 'wonderful', rule: 'spelling', explanation: 'Correct spelling is wonderful.' },
        { token: 'Reservoir', type: 'spelling', correction: 'Reservoir', rule: 'check', explanation: 'Control item.', accepted: ['Reservoir'] },
        { token: 'rubbish', type: 'spelling', correction: 'rubbish', rule: 'check', explanation: 'Control item.', accepted: ['rubbish'] },
      ],
      xp: 62,
      tryThis: ['Tier 1: Upgrade two verbs to stronger choices.', 'Tier 2: Add a reflection with connectors although/because/therefore.'],
    },
  ],
  6: [
    {
      id: 'eq-p6-01',
      title: 'PSLE Practice Passage',
      paragraph: 'The principal announce that the school would launch a reading campaign next month. Each class were asked to design a poster and submit it by Friday. My group choose the theme “Read to Lead”, but we forget to check the grammar in our draft. After teacher feedback, we revise every sentence carefuly and correct the mispelled words. The final poster looked excellent, and everyone were excited during assembly.',
      errors: [
        { token: 'announce', type: 'grammar', correction: 'announced', rule: 'tense consistency', explanation: 'Reporting verb should be in past tense.' },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: 'Each class is singular.' },
        { token: 'choose', type: 'grammar', correction: 'chose', rule: 'irregular past tense', explanation: 'Past tense of choose is chose.' },
        { token: 'forget', type: 'grammar', correction: 'forgot', rule: 'irregular past tense', explanation: 'Past tense of forget is forgot.' },
        { token: 'revise', type: 'grammar', correction: 'revised', rule: 'tense consistency', explanation: 'Past tense needed.' },
        { token: 'carefuly', type: 'spelling', correction: 'carefully', rule: 'spelling', explanation: 'Correct spelling is carefully.' },
        { token: 'mispelled', type: 'spelling', correction: 'misspelled', rule: 'spelling', explanation: 'Correct spelling is misspelled.' },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: 'Everyone takes singular verb.' },
        { token: 'campaign', type: 'spelling', correction: 'campaign', rule: 'check', explanation: 'Control item.', accepted: ['campaign'] },
        { token: 'assembly', type: 'spelling', correction: 'assembly', rule: 'check', explanation: 'Control item.', accepted: ['assembly'] },
      ],
      xp: 72,
      tryThis: ['Tier 1: Explain one grammar correction in your own words.', 'Tier 2: Write a 120-word report with accurate tense and punctuation.'],
    },
  ],
};

function clonePassage(passage, idx) {
  const labels = ['A', 'B', 'C'];
  return {
    ...passage,
    id: `${passage.id}-v${idx + 1}`,
    title: `${passage.title} (${labels[idx]})`,
    xp: (passage.xp || 40) + idx,
  };
}

export const editingPassages = Object.fromEntries(
  Object.entries(BASE_PASSAGES).map(([level, passages]) => {
    const expanded = [];
    passages.forEach((p) => {
      for (let i = 0; i < 3; i++) expanded.push(clonePassage(p, i));
    });
    return [level, expanded];
  }),
);
