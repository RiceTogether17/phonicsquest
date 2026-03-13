export const EDITING_LEVELS = {
  1: 'P1 Editing Foundations',
  2: 'P2 Editing Foundations',
  3: 'P3 Editing Foundations',
  4: 'P4 Editing Drill',
  5: 'P5 Editing Drill',
  6: 'P6 PSLE Editing Simulation',
};

const BASE_PASSAGES = {
  // ───────────────────────────────────────────────────────────────────────
  // P1 – Editing Foundations
  // Strands: SVA (is/am/are), simple past (yesterday + common verbs),
  //          connectors (and/but), spelling (simple phonetic)
  // 2–3 short sentences, 8–10 errors per passage
  // ───────────────────────────────────────────────────────────────────────
  1: [
    {
      id: 'eq-p1-01',
      title: 'My School Bag',
      paragraph:
        'I has a red school bag. The bag are light and I carry it every day. Yesterday I pack my books and put in a pencel case. My sister help me check if I have ruler and eraser. We was happy because nothing were missing.',
      errors: [
        { token: 'has', type: 'grammar', correction: 'have', rule: 'subject-verb agreement', explanation: 'Use "have" with the subject "I".', accepted: ['have'] },
        { token: 'are', type: 'grammar', correction: 'is', rule: 'subject-verb agreement', explanation: '"Bag" is singular, so use "is".', accepted: ['is'] },
        { token: 'pack', type: 'grammar', correction: 'packed', rule: 'tense consistency', explanation: '"Yesterday" requires past tense: packed.', accepted: ['packed'] },
        { token: 'pencel', type: 'spelling', correction: 'pencil', rule: 'spelling', explanation: 'Correct spelling is "pencil".', accepted: ['pencil'] },
        { token: 'help', type: 'grammar', correction: 'helped', rule: 'tense consistency', explanation: 'Completed action in the past needs "helped".', accepted: ['helped'] },
        { token: 'have', type: 'grammar', correction: 'had', rule: 'tense consistency', explanation: 'Past-time checking uses "had".', accepted: ['had'] },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: '"We" takes "were", not "was".', accepted: ['were'] },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"Nothing" is singular: "nothing was missing".', accepted: ['was'] },
        { token: 'day', type: 'spelling', correction: 'day', rule: 'check', explanation: 'Control item.', accepted: ['day'] },
        { token: 'ruler', type: 'spelling', correction: 'ruler', rule: 'check', explanation: 'Control item.', accepted: ['ruler'] },
      ],
      xp: 36,
      tryThis: [
        'Tier 1: Write two sentences about your school bag using the correct is/are.',
        'Tier 2: Write four sentences about packing your bag yesterday using past tense.',
      ],
    },
    {
      id: 'eq-p1-02',
      title: 'Recess Time',
      paragraph:
        'At recess, I goes to the canteen. My frend Ali are there too. We buyed drinks and sit on a bench. The wether is hot but we was happy. I finish my water and we plays together.',
      errors: [
        { token: 'goes', type: 'grammar', correction: 'go', rule: 'subject-verb agreement', explanation: '"I" takes "go", not "goes".', accepted: ['go'] },
        { token: 'frend', type: 'spelling', correction: 'friend', rule: 'spelling', explanation: 'Correct spelling is "friend".', accepted: ['friend'] },
        { token: 'are', type: 'grammar', correction: 'is', rule: 'subject-verb agreement', explanation: '"Ali" is singular, so use "is".', accepted: ['is'] },
        { token: 'buyed', type: 'grammar', correction: 'bought', rule: 'tense consistency', explanation: 'Past tense of "buy" is "bought".', accepted: ['bought'] },
        { token: 'sit', type: 'grammar', correction: 'sat', rule: 'tense consistency', explanation: 'Past tense of "sit" is "sat".', accepted: ['sat'] },
        { token: 'wether', type: 'spelling', correction: 'weather', rule: 'spelling', explanation: 'Correct spelling is "weather".', accepted: ['weather'] },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: '"We" takes "were".', accepted: ['were'] },
        { token: 'finish', type: 'grammar', correction: 'finished', rule: 'tense consistency', explanation: 'Past tense needed: "finished".', accepted: ['finished'] },
        { token: 'plays', type: 'grammar', correction: 'played', rule: 'tense consistency', explanation: 'Past tense needed: "played".', accepted: ['played'] },
        { token: 'canteen', type: 'spelling', correction: 'canteen', rule: 'check', explanation: 'Control item.', accepted: ['canteen'] },
      ],
      xp: 36,
      tryThis: [
        'Tier 1: Write two sentences about recess using "is" and "are" correctly.',
        'Tier 2: Write three sentences about yesterday\'s recess in past tense.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P2 – Editing Foundations
  // Strands: irregular past tense (buyed→bought), SVA (has/have),
  //          connectors (so/after/then), present continuous errors, spelling
  // 3–4 sentences, 10 errors per passage
  // ───────────────────────────────────────────────────────────────────────
  2: [
    {
      id: 'eq-p2-01',
      title: 'At the Canteen',
      paragraph:
        'After assembly, my friends goes to the canteen. I buyed noodles and my brother choose soup. The auntie smile and gave us napkin. We sits near the fan because the weather were warm. I spill some water, so I wipes it quickly with a tisue.',
      errors: [
        { token: 'goes', type: 'grammar', correction: 'go', rule: 'subject-verb agreement', explanation: '"Friends" is plural, so use "go".', accepted: ['go', 'went'] },
        { token: 'buyed', type: 'grammar', correction: 'bought', rule: 'irregular past tense', explanation: 'Past tense of "buy" is "bought".', accepted: ['bought'] },
        { token: 'choose', type: 'grammar', correction: 'chose', rule: 'irregular past tense', explanation: 'Past tense of "choose" is "chose".', accepted: ['chose'] },
        { token: 'smile', type: 'grammar', correction: 'smiled', rule: 'tense consistency', explanation: 'Past tense needed: "smiled".', accepted: ['smiled'] },
        { token: 'napkin', type: 'grammar', correction: 'napkins', rule: 'plural noun', explanation: '"Napkins" is needed for more than one.', accepted: ['napkins'] },
        { token: 'sits', type: 'grammar', correction: 'sat', rule: 'irregular past tense', explanation: 'Past tense of "sit" is "sat".', accepted: ['sat'] },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"Weather" is singular: "was warm".', accepted: ['was'] },
        { token: 'spill', type: 'grammar', correction: 'spilled', rule: 'tense consistency', explanation: 'Past tense needed: "spilled".', accepted: ['spilled', 'spilt'] },
        { token: 'wipes', type: 'grammar', correction: 'wiped', rule: 'tense consistency', explanation: 'Past tense needed: "wiped".', accepted: ['wiped'] },
        { token: 'tisue', type: 'spelling', correction: 'tissue', rule: 'spelling', explanation: 'Correct spelling is "tissue".', accepted: ['tissue'] },
      ],
      xp: 40,
      tryThis: [
        'Tier 1: Correct three irregular verbs from this passage and explain the rule.',
        'Tier 2: Write a short recount of recess with correct past tense verbs.',
      ],
    },
    {
      id: 'eq-p2-02',
      title: 'My CCA Day',
      paragraph:
        'Every Friday, I has CCA after school. Last Friday, I bringed my guitar and my teacher teached us a new song. Ali have a drum but he forgeted to bring drumstick. After practise, we putted our instruments away. The musec room were very messy so we clean it together.',
      errors: [
        { token: 'has', type: 'grammar', correction: 'have', rule: 'subject-verb agreement', explanation: '"I" takes "have", not "has".', accepted: ['have'] },
        { token: 'bringed', type: 'grammar', correction: 'brought', rule: 'irregular past tense', explanation: 'Past tense of "bring" is "brought".', accepted: ['brought'] },
        { token: 'teached', type: 'grammar', correction: 'taught', rule: 'irregular past tense', explanation: 'Past tense of "teach" is "taught".', accepted: ['taught'] },
        { token: 'have', type: 'grammar', correction: 'had', rule: 'subject-verb agreement', explanation: '"Ali" is singular and past context needs "had".', accepted: ['had'] },
        { token: 'forgeted', type: 'grammar', correction: 'forgot', rule: 'irregular past tense', explanation: 'Past tense of "forget" is "forgot".', accepted: ['forgot'] },
        { token: 'drumstick', type: 'grammar', correction: 'drumsticks', rule: 'plural noun', explanation: 'Plural needed: "drumsticks".', accepted: ['drumsticks'] },
        { token: 'putted', type: 'grammar', correction: 'put', rule: 'irregular past tense', explanation: '"Put" stays the same in past tense.', accepted: ['put'] },
        { token: 'musec', type: 'spelling', correction: 'music', rule: 'spelling', explanation: 'Correct spelling is "music".', accepted: ['music'] },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"Room" is singular: "was messy".', accepted: ['was'] },
        { token: 'clean', type: 'grammar', correction: 'cleaned', rule: 'tense consistency', explanation: 'Past tense needed: "cleaned".', accepted: ['cleaned'] },
      ],
      xp: 40,
      tryThis: [
        'Tier 1: Write the past tense of bring, teach, forget, and put.',
        'Tier 2: Write a recount of your CCA day using at least four irregular past tense verbs.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P3 – Editing Foundations
  // Strands: paragraph tense consistency, tricky SVA (each/every),
  //          subordinate connector errors, plural noun errors, spelling
  // 4–5 sentences, 10 errors per passage
  // ───────────────────────────────────────────────────────────────────────
  3: [
    {
      id: 'eq-p3-01',
      title: 'Neighbourhood Park Day',
      paragraph:
        'Last Sunday, my family visit the park near our HDB block. My mother bring sandwiches while I carries a football. We played under a shady tree and my cousin run around happily. Later, dark cloud appear so we decide to go home. The picnic basket was hevy but my brother carried it carefuly.',
      errors: [
        { token: 'visit', type: 'grammar', correction: 'visited', rule: 'tense consistency', explanation: '"Last Sunday" indicates past tense: "visited".', accepted: ['visited'] },
        { token: 'bring', type: 'grammar', correction: 'brought', rule: 'irregular past tense', explanation: 'Past tense of "bring" is "brought".', accepted: ['brought'] },
        { token: 'carries', type: 'grammar', correction: 'carried', rule: 'tense consistency', explanation: 'Use past tense in a recount: "carried".', accepted: ['carried'] },
        { token: 'run', type: 'grammar', correction: 'ran', rule: 'irregular past tense', explanation: 'Past tense of "run" is "ran".', accepted: ['ran'] },
        { token: 'cloud', type: 'grammar', correction: 'clouds', rule: 'plural noun', explanation: 'Multiple clouds appeared: "clouds".', accepted: ['clouds'] },
        { token: 'appear', type: 'grammar', correction: 'appeared', rule: 'tense consistency', explanation: 'Past tense needed: "appeared".', accepted: ['appeared'] },
        { token: 'decide', type: 'grammar', correction: 'decided', rule: 'tense consistency', explanation: 'Past tense needed: "decided".', accepted: ['decided'] },
        { token: 'hevy', type: 'spelling', correction: 'heavy', rule: 'spelling', explanation: 'Correct spelling is "heavy".', accepted: ['heavy'] },
        { token: 'carefuly', type: 'spelling', correction: 'carefully', rule: 'spelling', explanation: 'Correct spelling is "carefully".', accepted: ['carefully'] },
        { token: 'picnic', type: 'spelling', correction: 'picnic', rule: 'check', explanation: 'Control item.', accepted: ['picnic'] },
      ],
      xp: 46,
      tryThis: [
        'Tier 1: Rewrite two sentences from the passage using correct past tense.',
        'Tier 2: Add one sentence with a connector like "because" or "so" and correct tense.',
      ],
    },
    {
      id: 'eq-p3-02',
      title: 'The Kampung Visit',
      paragraph:
        'During the holidays, we drived to a kampung in Malaysia. Each children were excited because it was their first visit. My grandmother cook many dishs for us. We catched fish in the river and my uncle teached me how to climb a coconut tree. The experiance was unforgettable and everyone enjoy themselves.',
      errors: [
        { token: 'drived', type: 'grammar', correction: 'drove', rule: 'irregular past tense', explanation: 'Past tense of "drive" is "drove".', accepted: ['drove'] },
        { token: 'children', type: 'grammar', correction: 'child', rule: 'subject-verb agreement', explanation: '"Each" takes a singular noun: "each child".', accepted: ['child'] },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"Each child" is singular: "was excited".', accepted: ['was'] },
        { token: 'cook', type: 'grammar', correction: 'cooked', rule: 'tense consistency', explanation: 'Past tense needed: "cooked".', accepted: ['cooked'] },
        { token: 'dishs', type: 'grammar', correction: 'dishes', rule: 'plural noun', explanation: 'Plural of "dish" is "dishes".', accepted: ['dishes'] },
        { token: 'catched', type: 'grammar', correction: 'caught', rule: 'irregular past tense', explanation: 'Past tense of "catch" is "caught".', accepted: ['caught'] },
        { token: 'teached', type: 'grammar', correction: 'taught', rule: 'irregular past tense', explanation: 'Past tense of "teach" is "taught".', accepted: ['taught'] },
        { token: 'experiance', type: 'spelling', correction: 'experience', rule: 'spelling', explanation: 'Correct spelling is "experience".', accepted: ['experience'] },
        { token: 'enjoy', type: 'grammar', correction: 'enjoyed', rule: 'tense consistency', explanation: 'Past tense needed: "enjoyed".', accepted: ['enjoyed'] },
        { token: 'kampung', type: 'spelling', correction: 'kampung', rule: 'check', explanation: 'Control item.', accepted: ['kampung'] },
      ],
      xp: 46,
      tryThis: [
        'Tier 1: Write the correct past tense of drive, catch, and teach.',
        'Tier 2: Write a paragraph about a holiday trip using "each" and "every" correctly.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P4 – Editing Drill
  // Strands: past vs past continuous confusion, collective noun SVA,
  //          although/if connector errors, irregular verb forms, spelling
  // 5–6 sentences, 10 errors per passage
  // ───────────────────────────────────────────────────────────────────────
  4: [
    {
      id: 'eq-p4-01',
      title: 'Sports Day Practice',
      paragraph:
        'The team were practising on the field when the rain started. Although everyone want to continue, the coach ask them to stop. The class has already ran five laps and the pupils was very tired. Each runner take a towel and dryed themselves. If the weather clears, they would of continued. The practise session ended neatliy after the coach blowed the whistle.',
      errors: [
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"The team" is a collective noun and takes singular "was".', accepted: ['was'] },
        { token: 'want', type: 'grammar', correction: 'wanted', rule: 'tense consistency', explanation: 'Past tense needed: "wanted".', accepted: ['wanted'] },
        { token: 'ask', type: 'grammar', correction: 'asked', rule: 'tense consistency', explanation: 'Past tense needed: "asked".', accepted: ['asked'] },
        { token: 'ran', type: 'grammar', correction: 'run', rule: 'irregular verb form', explanation: 'After "had", use past participle: "had already run".', accepted: ['run'] },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: '"Pupils" is plural: "were tired".', accepted: ['were'] },
        { token: 'take', type: 'grammar', correction: 'took', rule: 'irregular verb form', explanation: 'Past tense of "take" is "took".', accepted: ['took'] },
        { token: 'dryed', type: 'grammar', correction: 'dried', rule: 'irregular verb form', explanation: 'Past tense of "dry" is "dried".', accepted: ['dried'] },
        { token: 'would of', type: 'grammar', correction: 'would have', rule: 'modal usage', explanation: 'Use "would have", not "would of".', accepted: ['would have'] },
        { token: 'neatliy', type: 'spelling', correction: 'neatly', rule: 'spelling', explanation: 'Correct spelling is "neatly".', accepted: ['neatly'] },
        { token: 'blowed', type: 'grammar', correction: 'blew', rule: 'irregular verb form', explanation: 'Past tense of "blow" is "blew".', accepted: ['blew'] },
      ],
      xp: 55,
      tryThis: [
        'Tier 1: Explain the difference between "was practising" and "practised".',
        'Tier 2: Write a paragraph about a rainy sports day using past continuous and simple past correctly.',
      ],
    },
    {
      id: 'eq-p4-02',
      title: 'Library Reading Corner',
      paragraph:
        'Our librarian ask each pupil to donate one storybook. Many student brings books from home, although one shelf are still empty. The committee have arranged the books and labelled every box neatliy. During recess, I readed a mystery tale while my friend writed a short review. The posters on the wall were colorfull and encourged us to read daily.',
      errors: [
        { token: 'ask', type: 'grammar', correction: 'asked', rule: 'tense consistency', explanation: 'Past tense needed: "asked".', accepted: ['asked'] },
        { token: 'student', type: 'grammar', correction: 'students', rule: 'plural noun', explanation: '"Many" requires plural: "students".', accepted: ['students'] },
        { token: 'brings', type: 'grammar', correction: 'brought', rule: 'irregular verb form', explanation: 'Past tense of "bring" is "brought".', accepted: ['brought'] },
        { token: 'are', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"One shelf" is singular: "was still empty".', accepted: ['was'] },
        { token: 'have', type: 'grammar', correction: 'had', rule: 'subject-verb agreement', explanation: '"The committee" is a collective noun; use "had" in past context.', accepted: ['had'] },
        { token: 'neatliy', type: 'spelling', correction: 'neatly', rule: 'spelling', explanation: 'Correct spelling is "neatly".', accepted: ['neatly'] },
        { token: 'readed', type: 'grammar', correction: 'read', rule: 'irregular verb form', explanation: 'Past tense of "read" is "read" (pronounced "red").', accepted: ['read'] },
        { token: 'writed', type: 'grammar', correction: 'wrote', rule: 'irregular verb form', explanation: 'Past tense of "write" is "wrote".', accepted: ['wrote'] },
        { token: 'colorfull', type: 'spelling', correction: 'colourful', rule: 'spelling', explanation: 'Use British spelling: "colourful".', accepted: ['colourful'] },
        { token: 'encourged', type: 'spelling', correction: 'encouraged', rule: 'spelling', explanation: 'Correct spelling is "encouraged".', accepted: ['encouraged'] },
      ],
      xp: 55,
      tryThis: [
        'Tier 1: Correct two tense errors and explain why they need past tense.',
        'Tier 2: Write a short review paragraph with accurate grammar and connectors like "although" and "if".',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P5 – Editing Drill
  // Strands: complex clause tense errors, embedded phrase SVA,
  //          advanced connector errors, modal perfect form errors, spelling
  // 6+ sentences, 10 errors per passage
  // ───────────────────────────────────────────────────────────────────────
  5: [
    {
      id: 'eq-p5-01',
      title: 'Community Clean-Up',
      paragraph:
        'Last Saturday, our team clean the park near Bedok Reservoir. The teacher gave us glove and rubbish bags. Mei and I was sorting plastic bottles while Amir collect paper cups. Because everyone work together, the area become cleaner. Despite the hot weather, not only the students but also the residents was helping eagerly. We should of started earlier, but we still did a wonderfull job. The residents were gratefull.',
      errors: [
        { token: 'clean', type: 'grammar', correction: 'cleaned', rule: 'tense consistency', explanation: 'Use past tense with "Last Saturday": "cleaned".', accepted: ['cleaned'] },
        { token: 'glove', type: 'grammar', correction: 'gloves', rule: 'plural noun', explanation: 'Plural noun needed: "gloves".', accepted: ['gloves'] },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: '"Mei and I" is plural: "were sorting".', accepted: ['were'] },
        { token: 'collect', type: 'grammar', correction: 'collected', rule: 'tense consistency', explanation: 'Past tense needed: "collected".', accepted: ['collected'] },
        { token: 'work', type: 'grammar', correction: 'worked', rule: 'tense consistency', explanation: 'Past tense needed: "worked".', accepted: ['worked'] },
        { token: 'become', type: 'grammar', correction: 'became', rule: 'irregular past tense', explanation: 'Past tense of "become" is "became".', accepted: ['became'] },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: '"Not only...but also" with plural subject takes "were".', accepted: ['were'] },
        { token: 'should of', type: 'grammar', correction: 'should have', rule: 'modal usage', explanation: 'Use "should have", not "should of".', accepted: ['should have'] },
        { token: 'wonderfull', type: 'spelling', correction: 'wonderful', rule: 'spelling', explanation: 'Correct spelling is "wonderful".', accepted: ['wonderful'] },
        { token: 'gratefull', type: 'spelling', correction: 'grateful', rule: 'spelling', explanation: 'Correct spelling is "grateful".', accepted: ['grateful'] },
      ],
      xp: 62,
      tryThis: [
        'Tier 1: Upgrade two verbs to stronger choices and explain why.',
        'Tier 2: Write a reflection paragraph using "despite", "not only...but also", and "should have".',
      ],
    },
    {
      id: 'eq-p5-02',
      title: 'The Science Fair',
      paragraph:
        'The group of students were preparing their experiment for the science fair. Even though the project require many hours of research, everyone remain dedicated. The box of chemicals on the table were labelled carefully. Mei Ling, along with her teammates, have completed the poster. They could of tested the hypothesis earlier, but they run out of materials. The teacher said we might of won first prize if we had more time. The expirience was valueable.',
      errors: [
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"The group" is singular: "was preparing".', accepted: ['was'] },
        { token: 'require', type: 'grammar', correction: 'required', rule: 'tense consistency', explanation: 'Past tense needed: "required".', accepted: ['required'] },
        { token: 'remain', type: 'grammar', correction: 'remained', rule: 'tense consistency', explanation: 'Past tense needed: "remained".', accepted: ['remained'] },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"The box" is the subject (not "chemicals"): "was labelled".', accepted: ['was'] },
        { token: 'have', type: 'grammar', correction: 'had', rule: 'subject-verb agreement', explanation: '"Mei Ling" is singular; with "along with", the verb agrees with the first subject: "had completed".', accepted: ['had'] },
        { token: 'could of', type: 'grammar', correction: 'could have', rule: 'modal usage', explanation: 'Use "could have", not "could of".', accepted: ['could have'] },
        { token: 'run', type: 'grammar', correction: 'ran', rule: 'irregular past tense', explanation: 'Past tense of "run" is "ran".', accepted: ['ran'] },
        { token: 'might of', type: 'grammar', correction: 'might have', rule: 'modal usage', explanation: 'Use "might have", not "might of".', accepted: ['might have'] },
        { token: 'expirience', type: 'spelling', correction: 'experience', rule: 'spelling', explanation: 'Correct spelling is "experience".', accepted: ['experience'] },
        { token: 'valueable', type: 'spelling', correction: 'valuable', rule: 'spelling', explanation: 'Correct spelling is "valuable".', accepted: ['valuable'] },
      ],
      xp: 62,
      tryThis: [
        'Tier 1: Explain why "the box of chemicals" takes a singular verb.',
        'Tier 2: Write a paragraph about a school project using "could have", "even though", and embedded phrase SVA.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P6 – PSLE Editing Simulation
  // Strands: advanced tense control across long passage, complex subject SVA,
  //          formal connector errors, reported speech, mixed grammar, spelling
  // 7+ sentences, 10 errors per passage
  // ───────────────────────────────────────────────────────────────────────
  6: [
    {
      id: 'eq-p6-01',
      title: 'PSLE Practice Passage – School Campaign',
      paragraph:
        'The principal announce that the school would launch a reading campaign next month. Each class were asked to design a poster and submit it by Friday. My group choose the theme "Read to Lead", but we forget to check the grammar in our draft. After receiving teacher feedback, we revise every sentence carefuly and correct the mispelled words. Furthermore, the committee have ensured that all entries were displayed in the hall. The final poster looked excellent, and everyone were excited during assembly.',
      errors: [
        { token: 'announce', type: 'grammar', correction: 'announced', rule: 'tense consistency', explanation: 'Reporting verb should be in past tense: "announced".', accepted: ['announced'] },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"Each class" is singular: "was asked".', accepted: ['was'] },
        { token: 'choose', type: 'grammar', correction: 'chose', rule: 'irregular past tense', explanation: 'Past tense of "choose" is "chose".', accepted: ['chose'] },
        { token: 'forget', type: 'grammar', correction: 'forgot', rule: 'irregular past tense', explanation: 'Past tense of "forget" is "forgot".', accepted: ['forgot'] },
        { token: 'revise', type: 'grammar', correction: 'revised', rule: 'tense consistency', explanation: 'Past tense needed: "revised".', accepted: ['revised'] },
        { token: 'carefuly', type: 'spelling', correction: 'carefully', rule: 'spelling', explanation: 'Correct spelling is "carefully".', accepted: ['carefully'] },
        { token: 'mispelled', type: 'spelling', correction: 'misspelled', rule: 'spelling', explanation: 'Correct spelling is "misspelled".', accepted: ['misspelled'] },
        { token: 'have', type: 'grammar', correction: 'had', rule: 'subject-verb agreement', explanation: '"The committee" is singular in past context: "had ensured".', accepted: ['had'] },
        { token: 'were', type: 'grammar', correction: 'was', rule: 'subject-verb agreement', explanation: '"Everyone" takes a singular verb: "was excited".', accepted: ['was'] },
        { token: 'assembly', type: 'spelling', correction: 'assembly', rule: 'check', explanation: 'Control item.', accepted: ['assembly'] },
      ],
      xp: 72,
      tryThis: [
        'Tier 1: Explain one grammar correction in your own words.',
        'Tier 2: Write a 120-word report about a school event with accurate tense control and formal connectors.',
      ],
    },
    {
      id: 'eq-p6-02',
      title: 'PSLE Practice Passage – Community Event',
      paragraph:
        'Last month, the residents\' committee organise a community carnival at the void deck. The chairperson reported that preparations has been ongoing for weeks. Nevertheless, some of the volunteer were still unfamiliar with their roles. A group of helpers, who was stationed at the entrance, greeted every visitor warmly. The children was thrilled because the carnival feautred many exciting game. One resident said that she wish she could of come earlier. Consequently, the committee decide to hold the event again next year. The occassion was a tremendous succes for the entire neighbourhood.',
      errors: [
        { token: 'organise', type: 'grammar', correction: 'organised', rule: 'tense consistency', explanation: '"Last month" requires past tense: "organised".', accepted: ['organised'] },
        { token: 'has', type: 'grammar', correction: 'had', rule: 'tense consistency', explanation: 'Reported speech in past context uses "had been": "had been ongoing".', accepted: ['had'] },
        { token: 'volunteer', type: 'grammar', correction: 'volunteers', rule: 'plural noun', explanation: '"Some of the" requires plural: "volunteers".', accepted: ['volunteers'] },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: '"A group of helpers, who" — "who" refers to plural "helpers": "were stationed".', accepted: ['were'] },
        { token: 'was', type: 'grammar', correction: 'were', rule: 'subject-verb agreement', explanation: '"The children" is plural: "were thrilled".', accepted: ['were'] },
        { token: 'feautred', type: 'spelling', correction: 'featured', rule: 'spelling', explanation: 'Correct spelling is "featured".', accepted: ['featured'] },
        { token: 'game', type: 'grammar', correction: 'games', rule: 'plural noun', explanation: '"Many" requires plural: "games".', accepted: ['games'] },
        { token: 'wish', type: 'grammar', correction: 'wished', rule: 'reported speech', explanation: 'Reported speech shifts tense: "wished".', accepted: ['wished'] },
        { token: 'could of', type: 'grammar', correction: 'could have', rule: 'modal usage', explanation: 'Use "could have", not "could of".', accepted: ['could have'] },
        { token: 'decide', type: 'grammar', correction: 'decided', rule: 'tense consistency', explanation: 'Past tense needed: "decided".', accepted: ['decided'] },
      ],
      xp: 72,
      tryThis: [
        'Tier 1: Identify and correct the reported speech error and explain the rule.',
        'Tier 2: Write a formal report about a community event using "nevertheless", "consequently", and reported speech correctly.',
      ],
    },
  ],
};

/**
 * Clone a passage into variants (A, B, C) with slightly increasing XP.
 * @param {object} passage - Base passage object.
 * @param {number} idx - Variant index (0, 1, or 2).
 * @returns {object} Cloned passage with modified id, title, and xp.
 */
function clonePassage(passage, idx) {
  const labels = ['A', 'B', 'C'];
  return {
    ...passage,
    id: `${passage.id}-v${idx + 1}`,
    title: `${passage.title} (${labels[idx]})`,
    xp: (passage.xp || 40) + idx,
  };
}

/**
 * Expand BASE_PASSAGES: each base passage gets 3 cloned variants,
 * so 2 bases × 3 clones = 6 passages per level.
 */
export const editingPassages = Object.fromEntries(
  Object.entries(BASE_PASSAGES).map(([level, passages]) => {
    const expanded = [];
    passages.forEach((p) => {
      for (let i = 0; i < 3; i++) expanded.push(clonePassage(p, i));
    });
    return [level, expanded];
  }),
);
