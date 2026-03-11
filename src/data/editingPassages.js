export const EDITING_LEVELS = {
  1: 'P4 Editing Drill',
  2: 'P5 Editing Drill',
  3: 'P6 PSLE Editing Simulation',
};

/**
 * PSLE-aligned editing sets.
 * Each passage targets 10 items: 5 grammar + 5 spelling.
 */
export const editingPassages = {
  1: [
    {
      id: 'eq-p4-01',
      title: 'Sports Day Notice',
      paragraph: 'Our class are preparing for Sports Day. Yesterday, we practise relay changes after school. The coach remind us to arrive punctuel and bring a water botle. My friend said he forget his cap, so I lends him mine. We was tired but proud when training finish.',
      errors: [
        { token: 'are', type: 'grammar', correction: 'is', rule: 'subject-verb agreement', explanation: '"class" is singular in this sentence.' },
        { token: 'practise', type: 'grammar', correction: 'practised', rule: 'tense consistency', explanation: '"Yesterday" signals simple past tense.' },
        { token: 'remind', type: 'grammar', correction: 'reminded', rule: 'tense consistency', explanation: 'Past tense is required for completed actions.' },
        { token: 'forget', type: 'grammar', correction: 'forgot', rule: 'irregular verb form', explanation: 'Past form of forget is forgot.' },
        { token: 'lends', type: 'grammar', correction: 'lent', rule: 'verb form', explanation: 'Past tense of lend is lent.' },
        { token: 'punctuel', type: 'spelling', correction: 'punctual', rule: 'spelling', explanation: 'Correct spelling is punctual.' },
        { token: 'botle', type: 'spelling', correction: 'bottle', rule: 'spelling', explanation: 'Double "t" in bottle.' },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: '"We" takes "were" in past tense.' },
        { token: 'finish', type: 'grammar', correction: 'finished', rule: 'tense consistency', explanation: 'Training happened in the past.' },
        { token: 'preparing', type: 'spelling', correction: 'preparing', rule: 'check', explanation: 'Control item (no change needed in spelling drill).',
          accepted: ['preparing'] },
      ],
      xp: 55,
      tryThis: [
        'Tier 1: Write one sentence with correct past tense verbs.',
        'Tier 2: Write two announcements using formal tone and correct punctuation.',
      ],
    },
  ],
  2: [
    {
      id: 'eq-p5-01',
      title: 'Community Clean-Up',
      paragraph: 'Last Saturday, our team clean the park near Bedok Reservoir. The teacher gave us glove and rubbish bags. Mei and I was sorting plastic bottles while Amir collect paper cups. Because everyone work together, the area become cleaner. The residents were gratefull and said we did a wonderfull job.',
      errors: [
        { token: 'clean', type: 'grammar', correction: 'cleaned', rule: 'tense consistency', explanation: 'Use past tense with "Last Saturday".' },
        { token: 'glove', type: 'grammar', correction: 'gloves', rule: 'plural noun', explanation: 'More than one glove was given.' },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: 'Compound subject "Mei and I" is plural.' },
        { token: 'collect', type: 'grammar', correction: 'collected', rule: 'tense consistency', explanation: 'Past tense is needed.' },
        { token: 'work', type: 'grammar', correction: 'worked', rule: 'tense consistency', explanation: 'Completed action in the past.' },
        { token: 'become', type: 'grammar', correction: 'became', rule: 'irregular past tense', explanation: 'Past tense of become is became.' },
        { token: 'gratefull', type: 'spelling', correction: 'grateful', rule: 'spelling', explanation: 'Correct spelling is grateful.' },
        { token: 'wonderfull', type: 'spelling', correction: 'wonderful', rule: 'spelling', explanation: 'Correct spelling is wonderful.' },
        { token: 'Reservoir', type: 'spelling', correction: 'Reservoir', rule: 'check', explanation: 'Control item retained for mixed review.', accepted: ['Reservoir'] },
        { token: 'rubbish', type: 'spelling', correction: 'rubbish', rule: 'check', explanation: 'Control item retained for mixed review.', accepted: ['rubbish'] },
      ],
      xp: 60,
      tryThis: [
        'Tier 1: Replace two weak verbs with stronger verbs.',
        'Tier 2: Write a 4-sentence reflection using at least one connector (although, because, therefore).',
      ],
    },
  ],
  3: [
    {
      id: 'eq-p6-01',
      title: 'PSLE Practice Passage',
      paragraph: 'The principal announce that the school would launch a reading campaign next month. Each class were asked to design a poster and submit it by Friday. My group choose the theme “Read to Lead”, but we forget to check the grammar in our draft. After teacher feedback, we revise every sentence carefuly and correct the mispelled words. The final poster looked excellent, and everyone were excited during assembly.',
      errors: [
        { token: 'announce', type: 'grammar', correction: 'announced', rule: 'tense consistency', explanation: 'Reporting verb should be in past tense.' },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"Each class" is singular.' },
        { token: 'choose', type: 'grammar', correction: 'chose', rule: 'irregular past tense', explanation: 'Past tense of choose is chose.' },
        { token: 'forget', type: 'grammar', correction: 'forgot', rule: 'irregular past tense', explanation: 'Past tense of forget is forgot.' },
        { token: 'carefuly', type: 'spelling', correction: 'carefully', rule: 'spelling', explanation: 'Correct spelling is carefully.' },
        { token: 'mispelled', type: 'spelling', correction: 'misspelled', rule: 'spelling', explanation: 'Correct spelling is misspelled.' },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"everyone" takes singular verb.' },
        { token: 'campaign', type: 'spelling', correction: 'campaign', rule: 'check', explanation: 'Control item retained for review.', accepted: ['campaign'] },
        { token: 'grammar', type: 'spelling', correction: 'grammar', rule: 'check', explanation: 'Control item retained for review.', accepted: ['grammar'] },
        { token: 'assembly', type: 'spelling', correction: 'assembly', rule: 'check', explanation: 'Control item retained for review.', accepted: ['assembly'] },
      ],
      xp: 70,
      tryThis: [
        'Tier 1: Explain one grammar correction in your own words.',
        'Tier 2: Write a 120-word report about a school campaign with accurate tense and punctuation.',
      ],
    },
  ],
};
