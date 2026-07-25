/**
 * PhonicsQuest – Primary 6 Practice Test Papers
 *
 * Four full PSLE-format P6 English practice papers (Term 1–4).
 * These mirror the Singapore P6 Semestral Assessment / PSLE Preliminary
 * format used by mainstream primary schools. All prompts, passages and
 * cloze texts are ORIGINAL content written for PhonicsQuest — only the
 * paper format and skills tested follow the school-paper convention;
 * nothing is reproduced from any published or school paper.
 *
 * Section breakdown per paper (total 95 marks, 1 h 50 min):
 *   Section A — Grammar MCQ            10 items  10 marks
 *   Section B — Vocabulary MCQ          5 items   5 marks
 *   Section C — Grammar Cloze          10 blanks 10 marks
 *   Section D — Vocabulary Cloze       10 blanks 10 marks
 *   Section E — Situational Writing              15 marks  (self-assessed)
 *   Section F — Synthesis & Transformation 5 items 10 marks
 *   Section G — Comprehension Cloze    10 blanks 10 marks  (open, no word bank)
 *   Section H — Comprehension          1 passage 15 marks
 *   Section I — Editing for Spelling and Grammar 10 errors 10 marks
 *                                               ─────────
 *                                                   95
 *
 * P6 / PSLE-level grammar features:
 *   - Inversion: "Not only did she...", "Seldom have I seen..."
 *   - Type 3 conditionals: "If you had studied harder, you would have passed"
 *   - Complex reported speech (embedded questions, commands with objects)
 *   - Causative "have something done"
 *   - "It was not until... that..."
 *   - "The + comparative, the + comparative"
 *   - Advanced participial phrases
 *
 * Topic rotation:
 *   T1 — nature / conservation (inversion, causative)
 *   T2 — technology / media (idioms, collocations, reported speech)
 *   T3 — cultural heritage (conditionals, participial phrases)
 *   T4 — global issues / youth activism (balanced PSLE review)
 */

import { checkMcqItems, checkSectionMarks, checkEditingErrors } from './practiceTestValidators.js';

export const P6_PRACTICE_TEST_TERMS = Object.freeze(['T1', 'T2', 'T3', 'T4']);

export const P6_PRACTICE_TESTS = Object.freeze({

  /* ══════════════════════════════════════════════════════════════════
     TERM 1  —  Nature & Conservation
  ══════════════════════════════════════════════════════════════════ */
  T1: {
    id: 'p6-test-term-1',
    term: 'T1',
    level: 'P6',
    label: 'Term 1 Practice Test (PSLE Grammar Focus)',
    duration: '1 h 50 min',
    totalMarks: 95,
    blurb: 'P6 Term 1 PSLE-format paper — inversion, causative "have something done", Type 3 conditionals, complex passive. Situational Writing: Formal Letter. Comprehension: coral reef conservation.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      items: [
        {
          q: 'Not only ___ the students complete the project on time, but they also won first prize.',
          choices: ['did', 'have', 'were', 'had'],
          answer: 'did',
          skill: 'inversion',
          practiseTarget: 'grammar-mcq',
          explain: 'Subject-auxiliary inversion after "Not only": "Not only did the students complete..."',
        },
        {
          q: 'Dr Lim ___ her car serviced at the garage every three months.',
          choices: ['has', 'makes', 'gets', 'lets'],
          answer: 'has',
          skill: 'causative',
          practiseTarget: 'grammar-mcq',
          explain: 'Causative "have something done": she arranges for someone else to service her car.',
        },
        {
          q: 'If the scientists ___ the coral bleaching earlier, they ___ the reef.',
          choices: [
            'had detected / could have saved',
            'detected / could save',
            'had detected / could save',
            'detected / could have saved',
          ],
          answer: 'had detected / could have saved',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 3 conditional (unreal past): if + past perfect → could/would have + past participle.',
        },
        {
          q: 'It was not until the documentary was aired ___ the public became aware of the problem.',
          choices: ['that', 'when', 'which', 'where'],
          answer: 'that',
          skill: 'cleftSentence',
          practiseTarget: 'grammar-mcq',
          explain: '"It was not until X that Y" is a fixed cleft-sentence structure.',
        },
        {
          q: 'Seldom ___ such a diverse range of species in a single habitat.',
          choices: [
            'scientists have seen',
            'have scientists seen',
            'scientists did see',
            'did scientists see',
          ],
          answer: 'have scientists seen',
          skill: 'inversion',
          practiseTarget: 'grammar-mcq',
          explain: 'Inversion after negative adverb "Seldom": auxiliary before subject.',
        },
        {
          q: 'The more plastic waste ___ into the ocean, the greater ___ the damage to marine life.',
          choices: [
            'is dumped / will be',
            'dumps / is',
            'dumped / will be',
            'is dumped / is',
          ],
          answer: 'is dumped / will be',
          skill: 'comparatives',
          practiseTarget: 'grammar-mcq',
          explain: '"The + comparative... the + comparative": "The more X is done, the greater Y will be."',
        },
        {
          q: 'The endangered turtles ___ to be protected under the Wildlife Act since 2010.',
          choices: ['have been known', 'had known', 'were known', 'are knowing'],
          answer: 'have been known',
          skill: 'passiveVoice',
          practiseTarget: 'grammar-mcq',
          explain: 'Present perfect passive: "have been known" — the action started in the past and continues.',
        },
        {
          q: '___ from natural predators, the turtle population would recover within a decade.',
          choices: ['Protecting', 'Protected', 'If protecting', 'Having protected'],
          answer: 'Protected',
          skill: 'participialPhrase',
          practiseTarget: 'grammar-mcq',
          explain: 'Reduced conditional participial phrase: "Protected from..." = "If they were protected from..."',
        },
        {
          q: 'The marine biologist told the volunteers that they ___ touch the coral under any circumstances.',
          choices: ['must not', 'need not', 'cannot', 'should not'],
          answer: 'must not',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: '"Must not" remains unchanged in reported speech as the prohibition is absolute.',
        },
        {
          q: 'The reef, ___ stretches over 500 kilometres, is home to thousands of species.',
          choices: ['which', 'that', 'what', 'where'],
          answer: 'which',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: 'Non-restrictive relative clause with "which" (comma before it signals extra information).',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'The government\'s new policy was a ___ in the right direction for environmental protection.',
          choices: ['pace', 'march', 'stride', 'step'],
          answer: 'step',
          skill: 'collocationCloze',
          practiseTarget: 'vocabulary-mcq',
          explain: '"A step in the right direction" is the fixed idiom for a positive move toward a goal. "Stride" can modify the idiom but "step" is the standard, unambiguous form tested in PSLE.',
        },
        {
          q: 'The activist\'s speech was so ___ that many in the audience were moved to tears.',
          choices: ['explicit', 'eloquent', 'elusive', 'elaborate'],
          answer: 'eloquent',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Eloquent" = fluent and persuasive; matches a moving speech perfectly.',
        },
        {
          q: 'After years of overfishing, the fish stocks have been virtually ___.',
          choices: ['diminished', 'eliminated', 'depleted', 'removed'],
          answer: 'depleted',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Depleted" specifically means reduced to a very low level — strongest fit for fish stocks exhausted by overfishing.',
        },
        {
          q: 'The conservation group decided to ___ forces with the government to tackle the issue.',
          choices: ['combine', 'join', 'unite', 'merge'],
          answer: 'join',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Join forces" is the fixed collocation meaning to work together toward a common goal.',
        },
        {
          q: 'Scientists remain ___ about whether the species can be fully revived.',
          choices: ['sceptical', 'critical', 'reluctant', 'hesitant'],
          answer: 'sceptical',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Sceptical" means doubtful and unconvinced — best fits the uncertainty expressed by "whether".',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 10,
      instructions: 'Choose the correct word from the box to fill in each blank. You may use a word more than once if needed.',
      wordBank: ['been', 'being', 'by', 'for', 'had', 'have', 'having', 'in', 'of', 'on', 'since', 'which'],
      text: 'The coral reefs surrounding our island have {{1}} under threat for many years. {{2}} damaged by rising sea temperatures, large sections of the reef have turned white — a process known as bleaching. Scientists who {{3}} studied the reefs {{4}} the past decade warn that immediate action is needed. The most urgent measure is reducing the amount {{5}} carbon dioxide released into the atmosphere. {{6}} account, industries are {{7}} encouraged to adopt cleaner technologies. Divers are also {{8}} trained to remove invasive species {{9}} harm native coral. Thanks to these combined efforts, small signs {{10}} recovery have been observed in several reef zones.',
      answers: ['been', 'Having', 'have', 'for', 'of', 'By', 'being', 'being', 'which', 'of'],
      accept: [
        ['been'],
        ['Having'],
        ['have'],
        ['for'],
        ['of'],
        ['By'],
        ['being'],
        ['being'],
        ['which'],
        ['of'],
      ],
      skill: 'mixedGrammar',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 10,
      instructions: 'Choose the correct word from the box to fill in each blank. Use each word once only. There are two extra words you do not need to use.',
      wordBank: ['abundant', 'adapted', 'alert', 'delicate', 'devastated', 'fragile', 'inhabit', 'pristine', 'resilient', 'restored', 'thriving', 'vulnerable'],
      text: 'The waters off the southern coast were once home to a {{1}} ecosystem teeming with life. Hundreds of species had {{2}} perfectly to the warm, shallow environment. Tragically, decades of pollution have {{3}} these once-{{4}} reefs. Today, conservation teams are working hard to ensure that the surviving corals, though {{5}}, are given a chance to recover. Young coral fragments that prove {{6}} enough are carefully selected and placed on artificial reefs where they can grow undisturbed. Rangers keep a constant {{7}} for illegal fishing boats that continue to {{8}} the protected zone. Scientists are cautiously optimistic: a few sections of the reef are already showing signs of becoming {{9}} once again. Their goal is to see the entire reef system fully {{10}} within twenty years.',
      answers: ['fragile', 'adapted', 'devastated', 'pristine', 'vulnerable', 'resilient', 'alert', 'inhabit', 'thriving', 'restored'],
      accept: [
        ['fragile', 'delicate'],
        ['adapted'],
        ['devastated'],
        ['pristine', 'thriving', 'abundant'],
        ['vulnerable', 'fragile', 'delicate'],
        ['resilient'],
        ['alert'],
        ['inhabit'],
        ['thriving', 'abundant'],
        ['restored'],
      ],
      skill: 'contextInference',
    },

    sectionE: {
      title: 'Section E: Situational Writing',
      marks: 15,
      instructions: 'Study the situation below and write your response in about 150–200 words.',
      format: 'Formal Letter',
      purpose: 'To appeal to the Principal to start a school recycling programme',
      audience: 'The Principal of your school',
      context: 'You are a P6 student who has recently learned about the environmental impact of waste in your school. You want to persuade your Principal to introduce a school-wide recycling programme.',
      bullets: [
        'State why a recycling programme is necessary (mention the amount of waste your school generates)',
        'Suggest two practical steps the school can take to start the programme',
        'Explain what benefits the programme will bring to the school and environment',
      ],
      wordCount: '150–200 words',
      modelAnswer: `27 Meranti Crescent
Singapore 123456
12 January 2026

The Principal
Meranti Primary School
27 Meranti Crescent
Singapore 123456

Dear Principal,

I am writing on behalf of my classmates in 6 Integrity to appeal for the introduction of a school-wide recycling programme.

Our school generates a considerable amount of waste each day. Plastic bottles, paper and food packaging fill our bins, yet very little of this is recycled. By establishing dedicated recycling stations outside each classroom and in the canteen, students can easily sort their recyclables from general waste.

I would also propose that the school partner with a local recycling company to collect these materials weekly. Posters and short presentations during morning assembly can educate students about what can and cannot be recycled.

Such a programme would instil lifelong eco-friendly habits in our students and significantly reduce the school's environmental footprint. It would also set a positive example for the community.

I sincerely hope you will consider this proposal.

Yours faithfully,
Alex Tan`,
      rubric: {
        taskFulfillment: 'Addresses all three bullet points; uses appropriate formal letter format (address, date, salutation, sign-off); tone is respectful and persuasive.',
        language: 'Uses varied vocabulary and sentence structures; minimal grammar errors; formal register maintained throughout.',
        organisation: 'Clear opening (purpose), logical middle (two concrete steps), strong closing (benefits and appeal); ideas flow naturally.',
      },
    },

    sectionF: {
      title: 'Section F: Synthesis & Transformation',
      marks: 10,
      instructions: 'Rewrite each sentence or pair of sentences as directed. Do not change the meaning.',
      items: [
        {
          q: '"You must never remove coral from the reef," the ranger warned the visitors.',
          stem: 'The ranger warned the visitors that they ___',
          answer: 'must never remove coral from the reef',
          alternates: ['should never remove coral from the reef', 'were never to remove coral from the reef'],
          requiredGroups: [
            ["never remove", "never take", "never disturb", "never to remove", "never to take"],
            ["coral", "reef"],
          ],
          skill: 'reportedSpeech',
          explain: 'Reported speech: "must" often stays as "must"; remove quotation marks and adjust pronoun.',
        },
        {
          q: 'The pollution was so severe that the fish could not survive in the water.',
          stem: 'The pollution was too ___',
          answer: 'severe for the fish to survive in the water',
          alternates: ['severe for the fish to live in the water'],
          requiredGroups: [
            ["too severe", "severe for the fish"],
            ["survive", "live"],
          ],
          skill: 'connectors',
          explain: '"So... that..." → "too... for... to..." — expresses the same idea of an extreme that prevents something.',
        },
        {
          q: 'The team had never witnessed such rapid coral recovery before.',
          stem: 'Never ___',
          answer: 'had the team witnessed such rapid coral recovery before',
          alternates: ['before had the team witnessed such rapid coral recovery'],
          requiredGroups: [
            ["had the team", "had they"],
            ["witnessed", "seen", "observed"],
          ],
          skill: 'inversion',
          explain: 'Inversion after "Never": auxiliary (had) moves before the subject (the team).',
        },
        {
          q: 'The conservation group cleans the beach every week. The conservation group is made up of volunteers.',
          stem: 'The conservation group, which ___',
          answer: 'is made up of volunteers, cleans the beach every week',
          alternates: ['consists of volunteers, cleans the beach every week'],
          requiredGroups: [
            ["volunteers", "made up of", "consists of"],
            ["cleans the beach", "beach every week"],
          ],
          skill: 'relativeClauses',
          explain: 'Non-restrictive relative clause: combine with "which" and commas to add the extra detail.',
        },
        {
          q: 'People did not know about the reef\'s plight until the documentary was shown.',
          stem: 'It was not until the documentary was shown ___',
          answer: 'that people knew about the reef\'s plight',
          alternates: [
            'that people found out about the reef\'s plight',
            'that people became aware of the reef\'s plight',
          ],
          requiredGroups: [
            ["knew", "found out", "became aware", "learned"],
            ["reef", "plight"],
          ],
          skill: 'cleftSentence',
          explain: '"It was not until X that Y" cleft structure shifts emphasis to the triggering event.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word.',
      text: 'Marine biologists have long {{1}} aware of the delicate balance that sustains coral reef ecosystems. When water temperatures rise even slightly, corals expel the algae living {{2}} their tissues and turn completely white. This phenomenon, known {{3}} coral bleaching, can be fatal {{4}} left unchecked. Encouragingly, researchers have recently developed a technique {{5}} involves coating young corals with a heat-resistant probiotic. In early trials, corals treated {{6}} this method survived temperatures that would normally {{7}} caused mass bleaching. Scientists caution, {{8}}, that this is not a substitute for reducing carbon emissions. The probiotic buys time, {{9}} it does not solve the underlying problem. Governments {{10}} the world must act together if we are to protect these irreplaceable ecosystems.',
      answers: ['been', 'within', 'as', 'if', 'that', 'with', 'have', 'however', 'but', 'around'],
      accept: [
        ['been'],
        ['within', 'inside'],
        ['as'],
        ['if', 'when'],
        ['that', 'which'],
        ['with', 'using'],
        ['have'],
        ['however', 'though', 'nevertheless'],
        ['but', 'yet', 'although', 'though'],
        ['around', 'across', 'throughout'],
      ],
      skill: 'comprehensionCloze',
    },

    sectionH: {
      title: 'Section H: Comprehension',
      marks: 15,
      passage: `The Last Reef

      Few ecosystems on Earth rival the complexity and beauty of a coral reef. Often called the "rainforests of the sea", reefs cover less than one percent of the ocean floor yet support an estimated twenty-five percent of all marine species. For millions of coastal communities worldwide, they are also an economic lifeline, providing food, income from tourism, and natural protection against storm surges.

      Yet today, the world's reefs stand at the edge of collapse. Rising sea temperatures caused by climate change trigger mass bleaching events that can devastate entire reef systems within weeks. Pollution from agricultural runoff smothers coral polyps and fuels the growth of algae that suffocate them. Destructive fishing practices shatter the physical structure of the reef itself. Scientists estimate that half the world's coral reefs have already been lost since the 1950s, and the situation is worsening.

      Singapore's reefs, though small in area, have not been spared. A study conducted in 2022 found that over sixty percent of corals in the southern islands had experienced bleaching in the previous five years. Sedimentation from land reclamation projects and boat traffic continues to cloud the water, blocking the sunlight that corals need for photosynthesis.

      Yet there is reason for cautious hope. The National Parks Board has launched a coral nursery programme in which fragments of heat-resistant coral are grown on underwater frames before being transplanted onto degraded reefs. Early results are promising: survival rates for transplanted corals have exceeded seventy percent in some locations. The programme also engages volunteer divers who monitor reef health weekly, feeding data into a national database that guides conservation decisions.

      Scientists warn that reef restoration alone cannot save these ecosystems unless carbon emissions are reduced globally. "We are essentially buying time," said Dr Elaine Chong, a marine ecologist at the National University of Singapore. "The nursery gives corals a fighting chance, but without addressing the root cause, we are swimming against the tide."`,

      questions: [
        {
          type: 'factual',
          marks: 1,
          q: 'According to paragraph 1, why are coral reefs important to coastal communities? Give TWO reasons.',
          model: 'They provide food and income from tourism (accept also: natural protection against storm surges). Any two of: food / income from tourism / protection against storm surges.',
        },
        {
          type: 'factual',
          marks: 1,
          q: 'What percentage of the world\'s coral reefs have been lost since the 1950s?',
          model: 'Half (fifty percent / 50%) of the world\'s coral reefs.',
        },
        {
          type: 'vocabulary',
          marks: 1,
          q: 'Find a word in paragraph 2 that means "destroys completely and causes great damage to".',
          model: 'devastate (accept: devastates)',
        },
        {
          type: 'evidence',
          marks: 2,
          q: 'Using evidence from paragraphs 2 and 3, explain why coral reefs in Singapore face a particularly difficult situation.',
          model: 'Singapore\'s reefs face both global threats (rising temperatures causing bleaching) and local threats specific to a highly developed city-state (sedimentation from land reclamation and boat traffic). This combination makes recovery harder than in more remote locations.',
          // Two required meaning units, 1 mark each. The student must mention
          // BOTH a global / climate-driven threat AND a local Singapore-specific
          // threat — naming only one earns half marks.
          requiredGroups: [
            ['bleaching', 'rising temperature', 'global warming', 'climate'],
            ['sedimentation', 'land reclamation', 'pollution', 'boat traffic', 'urban'],
          ],
          // Retained for back-compat — used only when requiredGroups is absent.
          keywords: ['bleaching', 'sedimentation', 'land reclamation', 'pollution', 'global'],
        },
        {
          type: 'factual',
          marks: 2,
          q: 'Describe the coral nursery programme mentioned in paragraph 4. Give TWO details.',
          model: 'Coral fragments are grown on underwater frames before being transplanted onto degraded reefs. Volunteer divers monitor reef health weekly and feed data into a national database. (Any two details.)',
        },
        {
          type: 'language-use',
          marks: 1,
          q: 'In paragraph 5, what does Dr Elaine Chong mean when she says the team is "swimming against the tide"?',
          model: 'She means they are working against a powerful opposing force — their efforts are likely to be overwhelmed by the ongoing problem of carbon emissions unless global action is taken.',
          keywords: ['opposing force', 'overwhelmed', 'carbon emissions', 'tide', 'fighting'],
        },
        {
          type: 'inference',
          marks: 2,
          q: 'Do you think Dr Nair is optimistic or pessimistic about the future of coral reefs? Use evidence from her quote to support your answer.',
          model: 'She is cautiously pessimistic / realistic. She acknowledges the nursery "gives corals a fighting chance" (some hope) but stresses that without reducing carbon emissions globally, their efforts will be overwhelmed — "swimming against the tide" — suggesting the situation will not improve without global action.',
        },
        {
          type: 'personal-response',
          marks: 5,
          q: 'The passage describes several threats to coral reefs and some conservation efforts. Do you think enough is being done to save coral reefs? Use information from the passage and your own ideas to explain your answer.',
          model: 'Award up to 5 marks for a well-reasoned response that references specific threats from the passage (bleaching, pollution, destructive fishing, sedimentation), evaluates the nursery programme, argues a clear position, and provides personal reasoning with supporting evidence.',
        },
      ],
    },

    sectionI: {
      title: 'Section I: Editing for Spelling and Grammar',
      marks: 10,
      instructions: 'The passage below contains 10 errors. Each error is underlined and numbered. Write the correct word or phrase in the box provided.',
      paragraph: 'Coral reefs are among the most {{1:valueable}} ecosystems on Earth. They {{2:has}} formed over millions of years, yet the damage caused by human activity has accelerated at an alarming rate. In Singapore, reefs {{3:is}} home to nearly a quarter of all local marine species. Rising sea temperature {{4:turn}} large sections of the reef white in a process called bleaching, and without recovery time, corals may {{5:loose}} their ability to survive. Dr Farah Iskandar, a marine {{6:bilogist}} at the National University of Singapore, has spent fifteen years studying this crisis. She {{7:warn}} that the next decade will be crucial for the survival of regional reefs. Her team has made some {{8:progres}}: heat-resistant coral strains have been developed and {{9:transplant}} onto degraded reef areas. "Every coral we save counts," Dr Iskandar {{10:say}} at a global conservation summit last November.',
      errors: [
        { wrong: 'valueable',  correction: 'valuable',     kind: 'spelling' },
        { wrong: 'has',        correction: 'have',         kind: 'grammar'  },
        { wrong: 'is',         correction: 'are',          kind: 'grammar'  },
        { wrong: 'turn',       correction: 'turns',        kind: 'grammar'  },
        { wrong: 'loose',      correction: 'lose',         kind: 'spelling' },
        { wrong: 'bilogist',   correction: 'biologist',    kind: 'spelling' },
        { wrong: 'warn',       correction: 'warns',        kind: 'grammar'  },
        { wrong: 'progres',    correction: 'progress',     kind: 'spelling' },
        { wrong: 'transplant', correction: 'transplanted', kind: 'grammar'  },
        { wrong: 'say',        correction: 'said',         kind: 'grammar'  },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════════
     TERM 2  —  Technology & Media
  ══════════════════════════════════════════════════════════════════ */
  T2: {
    id: 'p6-test-term-2',
    term: 'T2',
    level: 'P6',
    label: 'Term 2 Practice Test (PSLE Vocabulary Focus)',
    duration: '1 h 50 min',
    totalMarks: 95,
    blurb: 'P6 Term 2 PSLE-format paper — reported speech with embedded questions, causative, inversion. Situational Writing: Email. Comprehension: social media and mental health.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      items: [
        {
          q: 'The journalist asked the CEO ___ the company planned to address data privacy concerns.',
          choices: ['that how', 'how', 'whether how', 'if how'],
          answer: 'how',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'Reported question with "how": no "that" is used; word order stays as statement (how + subject + verb).',
        },
        {
          q: 'Hardly ___ the app been downloaded when complaints about the interface began pouring in.',
          choices: ['has', 'had', 'was', 'did'],
          answer: 'had',
          skill: 'inversion',
          practiseTarget: 'grammar-mcq',
          explain: 'Inversion after "Hardly... when": "Hardly had X happened when Y..." — past perfect in first clause.',
        },
        {
          q: 'The influencer ___ her photos edited professionally before uploading them.',
          choices: ['has', 'makes', 'gets', 'lets'],
          answer: 'gets',
          skill: 'causative',
          practiseTarget: 'grammar-mcq',
          explain: 'Causative "get something done" — she arranges for someone else to edit her photos.',
        },
        {
          q: 'If the company ___ better security measures, the data breach ___ have occurred.',
          choices: [
            'had implemented / would not',
            'implemented / would not',
            'had implemented / would not have',
            'implements / would not',
          ],
          answer: 'had implemented / would not have',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 3 conditional (unreal past): if + past perfect → would not have + past participle.',
        },
        {
          q: 'The report, ___ was compiled over six months, revealed alarming trends in teen screen time.',
          choices: ['which', 'that', 'what', 'it'],
          answer: 'which',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: 'Non-restrictive relative clause — "which" refers to the entire report (preceded by a comma).',
        },
        {
          q: 'No sooner ___ the video posted than it ___ a million views.',
          choices: [
            'had the video been / received',
            'was the video / had received',
            'the video had been / received',
            'had the video been / had received',
          ],
          answer: 'had the video been / received',
          skill: 'inversion',
          practiseTarget: 'grammar-mcq',
          explain: '"No sooner had X been done than Y happened" — past perfect inversion in the first clause; simple past (not past perfect) in the second clause after "than".',
        },
        {
          q: 'The researcher warned that excessive screen time ___ linked to poor sleep quality in teenagers.',
          choices: ['has been', 'had been', 'is being', 'was being'],
          answer: 'had been',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, present perfect shifts to past perfect: "has been" → "had been".',
        },
        {
          q: 'The new regulation requires that all personal data ___ encrypted before transmission.',
          choices: ['is', 'be', 'was', 'has been'],
          answer: 'be',
          skill: 'subjunctive',
          practiseTarget: 'grammar-mcq',
          explain: 'Subjunctive mood after "requires that": use base verb form — "be encrypted".',
        },
        {
          q: 'The technology, ___ development took five years, will revolutionise online communication.',
          choices: ['whose', 'which', 'of which', 'that'],
          answer: 'whose',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Whose" shows possession — "the technology whose development" = "the development of the technology".',
        },
        {
          q: 'The students demanded to know ___ their personal information had been shared with advertisers.',
          choices: ['if', 'whether', 'that', 'what'],
          answer: 'whether',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: '"Demand to know whether" (yes/no question in embedded form) — "whether" is more formal than "if".',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'The viral video spread like ___, reaching millions of viewers overnight.',
          choices: ['thunder', 'lightning', 'wildfire', 'flood'],
          answer: 'wildfire',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Spread like wildfire" is the fixed idiom meaning to spread very fast and widely.',
        },
        {
          q: 'The tech giant\'s decision to acquire its rival was seen as a ___ move by industry analysts.',
          choices: ['cunning', 'bold', 'prudent', 'shrewd'],
          answer: 'shrewd',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Shrewd" combines intelligence and practicality in decision-making — best fits a strategic business move.',
        },
        {
          q: 'The company ___ a deal with three major content creators to promote its new platform.',
          choices: ['made', 'signed', 'struck', 'agreed'],
          answer: 'struck',
          skill: 'collocationCloze',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Struck a deal" is the natural collocation; "made" and "signed" collocate with "agreement" more readily.',
        },
        {
          q: 'The documentary shed ___ on the hidden dangers of unregulated social media platforms.',
          choices: ['focus', 'attention', 'light', 'clarity'],
          answer: 'light',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Shed light on" = to clarify or reveal something that was previously unclear.',
        },
        {
          q: 'Young users are particularly ___ to the negative effects of cyberbullying.',
          choices: ['sensitive', 'susceptible', 'prone', 'exposed'],
          answer: 'susceptible',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Susceptible to" = easily affected or harmed by; strongest fit when followed by "to the negative effects".',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 10,
      instructions: 'Choose the correct word from the box to fill in each blank. Use each word once only. There are two extra words you do not need to use.',
      wordBank: ['although', 'despite', 'even', 'had', 'have', 'having', 'if', 'in', 'since', 'than', 'though', 'unless'],
      text: 'Social media platforms {{1}} transformed communication in ways that were unimaginable a generation ago. {{2}} their obvious benefits, however, these platforms have also introduced new risks, particularly for younger users. Researchers warn that teenagers who spend more {{3}} three hours daily on social media are significantly more likely to experience anxiety. This is {{4}} more concerning given that many young people access these apps {{5}} the age of ten. {{6}} parents monitor their children\'s online activity carefully, harmful content can easily go unnoticed. Some families have {{7}} banned devices at mealtimes, {{8}} this requires consistent enforcement. Experts recommend that children be taught to think critically about the content they consume, {{9}} they are young. Schools, too, play a vital role: {{10}} digital literacy classes become standard in primary education, the next generation may be better equipped to navigate the online world safely.',
      answers: ['have', 'Despite', 'than', 'even', 'in', 'Unless', 'having', 'although', 'though', 'if'],
      accept: [
        ['have'],
        ['Despite'],
        ['than'],
        ['even'],
        ['since'],
        ['Unless'],
        ['having'],
        ['although', 'though'],
        ['though', 'even though', 'although'],
        ['if'],
      ],
      skill: 'connectors',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 10,
      instructions: 'Choose the correct word from the box to fill in each blank. Use each word once only. There are two extra words you do not need to use.',
      wordBank: ['anonymous', 'credible', 'distorted', 'harassment', 'impersonating', 'notorious', 'overwhelmed', 'publicised', 'rampant', 'scrutinised', 'targeted', 'verified'],
      text: 'Cyberbullying has become {{1}} in recent years, with social media providing bullies with a platform to {{2}} their victims anonymously. Because perpetrators can remain {{3}}, they often feel free to engage in {{4}} that they would never dare carry out in person. Misinformation, too, has flourished online: {{5}} images and fabricated news stories can be shared thousands of times before being {{6}} and removed by platform moderators. Some bad actors even resort to {{7}} real people to spread false information, causing reputational damage. High-profile victims of cyberbullying have bravely {{8}} their experiences in the hope of encouraging change. However, many victims feel {{9}} by the scale and speed at which hateful content spreads. Experts argue that social media companies must do more to ensure that accounts are {{10}} and that harmful content is detected quickly.',
      answers: ['rampant', 'targeted', 'anonymous', 'harassment', 'distorted', 'scrutinised', 'impersonating', 'publicised', 'overwhelmed', 'verified'],
      accept: [
        ['rampant', 'notorious'],
        ['targeted'],
        ['anonymous'],
        ['harassment'],
        ['distorted'],
        ['scrutinised'],
        ['impersonating'],
        ['publicised'],
        ['overwhelmed'],
        ['verified', 'credible'],
      ],
      skill: 'contextInference',
    },

    sectionE: {
      title: 'Section E: Situational Writing',
      marks: 15,
      instructions: 'Study the situation below and write your response in about 150–200 words.',
      format: 'Email',
      purpose: 'To inform and advise a friend about staying safe online',
      audience: 'Your friend, Jordan, who has just joined a new social media platform',
      context: 'Your friend Jordan has just told you he has signed up for a popular social media app. You are concerned because you have read about cyberbullying and privacy risks. Write an email to Jordan sharing your concerns and advising him on how to stay safe.',
      bullets: [
        'Share two specific risks Jordan should be aware of (e.g. cyberbullying, privacy settings)',
        'Give Jordan two pieces of practical advice on how to stay safe on the platform',
        'Encourage Jordan positively and offer to help him set up his privacy settings',
      ],
      wordCount: '150–200 words',
      modelAnswer: `To: sam@example.com
Subject: Staying Safe on Your New Social Media App

Hi Jordan,

Congratulations on joining! It sounds like fun, but I wanted to share a few things I have learned about staying safe online — I hope you do not mind.

Two things to watch out for: first, make sure your privacy settings are set to "Friends only" so strangers cannot view your posts or personal information. Second, be aware that not everyone online is who they claim to be. Some users pretend to be someone else to gain your trust, and cyberbullying is also quite common, especially in comment sections.

My advice: never share your home address, school name or phone number publicly. Also, if anyone sends you unkind messages, do not reply — screenshot it and tell a trusted adult straight away.

I know it can all feel a bit overwhelming at first, but you will get the hang of it quickly. Why not come over this weekend? I can walk you through the privacy settings so we can make sure your account is secure.

Looking forward to seeing your posts!

Best,
Jordan`,
      rubric: {
        taskFulfillment: 'Covers all three bullets; uses correct email format (subject line, greeting, sign-off); tone is friendly and supportive.',
        language: 'Appropriate informal register; varied vocabulary; minimal grammar errors.',
        organisation: 'Clear structure — opening (reason for writing), middle (risks and advice), closing (offer of help); logical flow.',
      },
    },

    sectionF: {
      title: 'Section F: Synthesis & Transformation',
      marks: 10,
      instructions: 'Rewrite each sentence or pair of sentences as directed. Do not change the meaning.',
      items: [
        {
          q: 'The researcher asked, "Have teenagers become more anxious because of social media?"',
          stem: 'The researcher asked whether ___',
          answer: 'teenagers had become more anxious because of social media',
          alternates: ['teenagers have become more anxious because of social media'],
          requiredGroups: [
            ["had become", "become"],
            ["anxious", "worried", "stressed"],
          ],
          skill: 'reportedSpeech',
          explain: 'Reported yes/no question: "whether" + statement word order; present perfect → past perfect in formal reported speech.',
        },
        {
          q: 'The platform was so popular that users could not log in due to server overload.',
          stem: 'The platform was too ___',
          answer: 'popular for users to log in due to server overload',
          alternates: ['popular for users to access due to server overload'],
          requiredGroups: [
            ["popular", "crowded"],
            ["log in", "access", "use"],
          ],
          skill: 'connectors',
          explain: '"So... that... could not" → "too... for... to..." expresses the same limiting result.',
        },
        {
          q: 'The app update had barely been released before users discovered a critical bug.',
          stem: 'Barely ___',
          answer: 'had the app update been released before users discovered a critical bug',
          alternates: ['had the app update been released when users discovered a critical bug'],
          requiredGroups: [
            ["had the app", "had the update"],
            ["discovered", "found", "spotted"],
          ],
          skill: 'inversion',
          explain: 'Inversion after "Barely": "Barely had X been done before/when Y happened."',
        },
        {
          q: 'The social media company launched a new feature. The feature aims to detect hate speech automatically.',
          stem: 'The social media company launched a new feature, which ___',
          answer: 'aims to detect hate speech automatically',
          alternates: ['is designed to detect hate speech automatically'],
          requiredGroups: [
            ["detect", "identify", "flag"],
            ["hate speech", "speech"],
          ],
          skill: 'relativeClauses',
          explain: 'Non-restrictive clause adds information about the feature: "which aims to..."',
        },
        {
          q: 'If the company had responded to the complaints sooner, the scandal would not have escalated.',
          stem: 'Had ___',
          answer: 'the company responded to the complaints sooner, the scandal would not have escalated',
          alternates: ['the company responded sooner to the complaints, the scandal would not have escalated'],
          requiredGroups: [
            ["responded", "reacted", "addressed"],
            ["would not have escalated", "would not have grown", "would have been contained"],
          ],
          skill: 'conditionals',
          explain: 'Type 3 conditional inversion: drop "if" and invert subject-auxiliary ("Had + subject...") — same meaning.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word.',
      text: 'The rise of social media has dramatically changed the way young people communicate and form relationships. {{1}} the past decade, the average age at which children receive their first smartphone has dropped to just ten years old. This means that primary school children are now being {{2}} to online content — both educational and harmful — before they are emotionally mature enough to process it. Mental health professionals are increasingly concerned that the constant pressure to gain "likes" and followers is {{3}} teenagers to compare themselves to unrealistic standards. Research shows that young people who spend the most time scrolling {{4}} their feeds report higher levels of loneliness and anxiety than those who do not. {{5}}, some studies suggest that social media can strengthen friendships and provide support networks, particularly for teenagers {{6}} feel isolated at school. The key, experts agree, is balance. Children should be encouraged to take regular breaks from screens {{7}} to engage in physical activities and face-to-face interactions. Parents and teachers play a crucial role in helping young people develop the critical thinking skills needed to evaluate the content they see {{8}} and the way it makes them feel. {{9}} young people are guided carefully, they can learn to harness the benefits of social media {{10}} falling into its many pitfalls.',
      answers: ['Over', 'exposed', 'causing', 'through', 'However', 'who', 'and', 'online', 'If', 'without'],
      accept: [
        ['Over', 'In'],
        ['exposed'],
        ['causing', 'encouraging', 'leading'],
        ['through', 'on'],
        ['However', 'Nevertheless', 'Yet'],
        ['who', 'that'],
        ['and'],
        ['online'],
        ['If', 'When'],
        ['without'],
      ],
      skill: 'comprehensionCloze',
    },

    sectionH: {
      title: 'Section H: Comprehension',
      marks: 15,
      passage: `Screen Time and the Teenage Brain

      For most teenagers today, a smartphone is as essential as a school bag. They use it to stay connected with friends, catch up on homework and consume a constant stream of entertainment. Yet growing evidence suggests that this near-constant connectivity is taking a toll on teenage mental health in ways that researchers are only beginning to understand.

      Dr Rebecca Yeo, a psychologist at the Institute of Child Development, has spent the past eight years studying how social media affects teenagers between the ages of twelve and seventeen. Her findings are striking. Teenagers who spend more than four hours daily on social media platforms are three times more likely to report symptoms of depression and anxiety than those who spend less than one hour. Moreover, the effects are not equal: girls appear to be significantly more affected than boys, possibly because image-based platforms amplify insecurities about physical appearance.

      The mechanism behind this is partly chemical. Every time a notification arrives — a new like, comment or follower — the brain releases a small surge of dopamine, the same chemical associated with pleasure and reward. Over time, the brain begins to crave this stimulation, making it harder for teenagers to focus on activities that do not offer instant gratification, such as reading a book or having a quiet conversation.

      Not everyone, however, believes the picture is entirely bleak. Professor James Osei, a sociologist, argues that social media also provides teenagers with vital social support. "For young people who feel marginalised at school — whether because of their interests, identity or background — online communities can be a lifeline," he says. Online spaces allow teenagers to find peers who share their passions and to explore their identities in relative safety.

      The debate, ultimately, may be less about the technology itself and more about how it is used. Experts broadly agree that the solution is not to ban smartphones — an approach that is both impractical and likely to backfire — but to teach young people to use them wisely. Schools are beginning to build "digital wellness" into their curricula, equipping students with the skills to recognise when they are being manipulated by algorithms and to set healthy boundaries around their own screen time.`,

      questions: [
        {
          type: 'factual',
          marks: 1,
          q: 'According to paragraph 2, how many times more likely are teenagers who use social media for more than four hours daily to report depression and anxiety?',
          model: 'Three times more likely.',
        },
        {
          type: 'vocabulary',
          marks: 1,
          q: 'In paragraph 2, find a word that means "makes greater or more intense".',
          model: 'amplify (accept: amplifies)',
        },
        {
          type: 'inference',
          marks: 2,
          q: 'Using paragraph 3, explain in your own words why it becomes harder for teenagers to focus on activities like reading once they are addicted to social media.',
          model: 'Because constant notifications release dopamine (a pleasure chemical), the brain gets used to this instant reward and begins to crave it. Activities like reading do not offer instant gratification, so they feel less appealing to a brain conditioned to expect quick stimulation.',
          keywords: ['dopamine', 'instant gratification', 'stimulation', 'crave', 'notifications', 'reward'],
        },
        {
          type: 'language-use',
          marks: 2,
          q: 'Professor Osei says social media can be "a lifeline" for some teenagers. What does he mean, and for whom is it most valuable?',
          model: 'He means social media can be a crucial source of support and connection. It is most valuable for teenagers who feel marginalised or isolated at school — online communities allow them to find like-minded peers and explore their identities safely.',
          keywords: ['lifeline', 'support', 'marginalised', 'isolated', 'online communities', 'connection'],
        },
        {
          type: 'inference',
          marks: 2,
          q: 'Why does the writer say that banning smartphones would "likely backfire"? Use your own words.',
          model: 'The writer implies that a ban is impractical because teenagers rely on phones for many things, and a ban might cause rebellion or workarounds, making the situation worse rather than better.',
        },
        {
          type: 'vocabulary',
          marks: 1,
          q: 'In paragraph 5, what does "curricula" mean?',
          model: 'The courses of study or subjects taught in schools (the school syllabus / programmes of study).',
        },
        {
          type: 'personal-response',
          marks: 6,
          q: 'The passage presents both the negative and positive effects of social media on teenagers. Do you think social media does more harm than good for young people your age? Use information from the passage AND your own experience or knowledge to support your answer.',
          model: 'Award up to 6 marks. Strong answers will: state a clear position; reference at least two pieces of evidence from the passage; add personal reasoning or real-world examples; acknowledge the opposing view before countering it.',
        },
      ],
    },

    sectionI: {
      title: 'Section I: Editing for Spelling and Grammar',
      marks: 10,
      instructions: 'The passage below contains 10 errors. Each error is underlined and numbered. Write the correct word or phrase in the box provided.',
      paragraph: 'A new survey has found that many teenagers spend {{1:atleast}} two hours daily on social media. Several popular platforms {{2:allows}} users to remain anonymous, which can encourage careless or hurtful behaviour. The latest research {{3:suggest}} that teenagers who spend excessive time online are more likely to {{4:experiance}} anxiety than {{5:them}} who limit their screen time to less than an hour. Parents and educators are {{6:increasing}} concerned about the impact of these habits on young people\'s wellbeing. In response, the Ministry of Education {{7:have}} introduced a new digital wellness module into secondary school curricula. Teachers now guide students to use technology {{8:responsible}} and to recognise when they {{9:is}} being manipulated by the content they see online. Students who need additional support are encouraged to speak with a school {{10:counnsellor}}.',
      errors: [
        { wrong: 'atleast',     correction: 'at least',    kind: 'spelling' },
        { wrong: 'allows',      correction: 'allow',       kind: 'grammar'  },
        { wrong: 'suggest',     correction: 'suggests',    kind: 'grammar'  },
        { wrong: 'experiance',  correction: 'experience',  kind: 'spelling' },
        { wrong: 'them',        correction: 'those',       kind: 'grammar'  },
        { wrong: 'increasing',  correction: 'increasingly', kind: 'grammar' },
        { wrong: 'have',        correction: 'has',         kind: 'grammar'  },
        { wrong: 'responsible', correction: 'responsibly', kind: 'grammar'  },
        { wrong: 'is',          correction: 'are',         kind: 'grammar'  },
        { wrong: 'counnsellor', correction: 'counsellor',  kind: 'spelling' },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════════
     TERM 3  —  Cultural Heritage
  ══════════════════════════════════════════════════════════════════ */
  T3: {
    id: 'p6-test-term-3',
    term: 'T3',
    level: 'P6',
    label: 'Term 3 Practice Test (PSLE Synthesis Focus)',
    duration: '1 h 50 min',
    totalMarks: 95,
    blurb: 'P6 Term 3 PSLE-format paper — advanced conditionals, complex reported speech, participial phrases. Situational Writing: Diary Entry. Comprehension: Singapore\'s hawker culture and UNESCO recognition.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      items: [
        {
          q: 'The cultural heritage officer said that the nomination ___ submitted the previous year.',
          choices: ['was', 'had been', 'has been', 'is'],
          answer: 'had been',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, past simple shifts to past perfect: "was submitted" → "had been submitted".',
        },
        {
          q: 'Without the dedication of community volunteers, the ancient craft ___ died out long ago.',
          choices: ['would', 'would have', 'will', 'will have'],
          answer: 'would have',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: '"Without X" here refers to a past hypothetical: "would have" + past participle (Type 3 meaning).',
        },
        {
          q: '___ in centuries-old techniques, the master potter created vessels of extraordinary beauty.',
          choices: ['Train', 'Trained', 'Training', 'Having train'],
          answer: 'Trained',
          skill: 'participialPhrase',
          practiseTarget: 'grammar-mcq',
          explain: 'Participial phrase (reduced passive): "Trained in..." = "Because she had been trained in..."',
        },
        {
          q: 'Not until the dish was included in the UNESCO list ___ receive wider international attention.',
          choices: [
            'did hawker culture',
            'hawker culture did',
            'hawker culture',
            'does hawker culture',
          ],
          answer: 'did hawker culture',
          skill: 'inversion',
          practiseTarget: 'grammar-mcq',
          explain: '"Not until X did Y..." — subject-auxiliary inversion after negative adverbial "not until".',
        },
        {
          q: 'The elderly craftsman, ___ skills had been passed down for four generations, refused to retire.',
          choices: ['whose', 'which', 'who', 'that'],
          answer: 'whose',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Whose" shows possession — "the craftsman whose skills" = "the skills of the craftsman".',
        },
        {
          q: 'She asked the curator ___ the artefact had originally come from.',
          choices: ['from where', 'where', 'which place', 'that where'],
          answer: 'where',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'Embedded question: "where" introduces a noun clause with statement word order.',
        },
        {
          q: 'If the traditional recipe ___ recorded, future generations ___ been able to recreate the dish.',
          choices: [
            'had been / would have',
            'was / would have',
            'had been / would not have',
            'were / would have been',
          ],
          answer: 'had been / would have',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Type 3 conditional: if + past perfect → would have + past participle.',
        },
        {
          q: 'The government announced that it ___ preserve all remaining heritage buildings in the district.',
          choices: ['will', 'would', 'shall', 'should'],
          answer: 'would',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, "will" shifts to "would".',
        },
        {
          q: 'The dish ___ for centuries, it has become inseparable from the national identity.',
          choices: ['Having enjoyed', 'Enjoyed', 'Having been enjoyed', 'Being enjoyed'],
          answer: 'Having been enjoyed',
          skill: 'participialPhrase',
          practiseTarget: 'grammar-mcq',
          explain: 'Perfect participial phrase (passive): "Having been enjoyed for centuries" = "Because it has been enjoyed..."',
        },
        {
          q: 'The older generation insisted that traditional cooking methods ___ taught in schools.',
          choices: ['be', 'are', 'were', 'should'],
          answer: 'be',
          skill: 'subjunctive',
          practiseTarget: 'grammar-mcq',
          explain: 'Subjunctive mood after "insist that": use base verb form — "be taught".',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'The artisan\'s intricate woodcarvings were the ___ of the annual heritage festival.',
          choices: ['highlight', 'centrepiece', 'showpiece', 'pinnacle'],
          answer: 'centrepiece',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Centrepiece" is the most prominent item that draws attention — best fits the woodcarvings\' central role.',
        },
        {
          q: 'The young chef paid ___ to the traditions that had shaped the cuisine for generations.',
          choices: ['homage', 'credit', 'tribute', 'respect'],
          answer: 'homage',
          skill: 'collocationCloze',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Pay homage to" = to show deep respect and honour; the strongest fixed collocation here.',
        },
        {
          q: 'The government\'s efforts to ___ the old dialect have met with limited success.',
          choices: ['revive', 'restore', 'recover', 'renew'],
          answer: 'revive',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Revive" = to bring back to life or active use; specifically used for languages, traditions, and practices.',
        },
        {
          q: 'The decision to demolish the heritage building was met with ___ from the community.',
          choices: ['opposition', 'protest', 'backlash', 'disapproval'],
          answer: 'backlash',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Backlash" implies a strong, public negative reaction — the strongest word for organised community resistance.',
        },
        {
          q: 'The recipe, ___ from one hawker stall owner to the next, has remained unchanged for decades.',
          choices: ['handed down', 'passed on', 'given away', 'brought over'],
          answer: 'handed down',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Handed down" specifically means to pass something through generations — the most natural phrase for traditional knowledge.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 10,
      instructions: 'Choose the correct word from the box to fill in each blank. You may use a word more than once if needed.',
      wordBank: ['be', 'been', 'being', 'for', 'from', 'had', 'have', 'in', 'of', 'that', 'which', 'who'],
      text: 'Singapore\'s hawker culture has {{1}} recognised by UNESCO as an Intangible Cultural Heritage of Humanity. This achievement, {{2}} was announced in December 2020, came after years {{3}} tireless effort by hawkers, community groups and government agencies. The nomination had {{4}} submitted twice before it was finally accepted, highlighting just how competitive the process can {{5}}. Each stall that is included in the heritage list must {{6}} deemed to represent genuine cultural significance, rather than merely producing popular food. Hawkers {{7}} worked at their trade for decades were interviewed and their stories documented. UNESCO requires {{8}} the living traditions behind each dish — its history, its techniques and its role {{9}} community bonding — {{10}} carefully preserved and passed on to the next generation.',
      answers: ['been', 'which', 'of', 'been', 'be', 'be', 'who', 'that', 'in', 'be'],
      accept: [
        ['been'],
        ['which'],
        ['of'],
        ['been'],
        ['be'],
        ['be'],
        ['who', 'that'],
        ['that'],
        ['in'],
        ['be'],
      ],
      skill: 'passiveVoice',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 10,
      instructions: 'Choose the correct word from the box to fill in each blank. Use each word once only. There are two extra words you do not need to use.',
      wordBank: ['authentic', 'cherished', 'dwindling', 'enduring', 'flourishing', 'heritage', 'iconic', 'legacy', 'revitalise', 'safeguard', 'sustain', 'vibrant'],
      text: 'Singapore\'s hawker centres are far more than places to eat — they are {{1}} gathering spots that form the very heart of community life. For decades, these bustling venues have offered {{2}} local dishes at prices that families from all walks of life can afford. Yet the hawker trade faces an uncertain future. The number of younger Singaporeans willing to take on the gruelling hours of a hawker is {{3}}, raising fears that these {{4}} culinary traditions may be lost forever. The government has introduced apprenticeship schemes to attract new hawkers and to {{5}} the trade. These initiatives aim to {{6}} the knowledge and passion of veteran hawkers by pairing them with enthusiastic young protégés. Community groups, too, have pledged to {{7}} hawker culture by organising events that celebrate Singapore\'s diverse food heritage. For many Singaporeans, a bowl of laksa or a plate of char kway teow is more than a meal — it is a connection to a shared {{8}} and a reminder of Singapore\'s multi-cultural roots. Preserving this {{9}} is not just about food; it is about protecting the soul of the nation. The hawker culture that has remained {{10}} for generations is worth every effort to keep alive.',
      answers: ['vibrant', 'authentic', 'dwindling', 'iconic', 'revitalise', 'sustain', 'safeguard', 'heritage', 'legacy', 'enduring'],
      accept: [
        ['vibrant', 'flourishing'],
        ['authentic'],
        ['dwindling'],
        ['iconic', 'cherished', 'enduring'],
        ['revitalise'],
        ['sustain', 'safeguard'],
        ['safeguard', 'sustain'],
        ['heritage', 'legacy'],
        ['legacy', 'heritage'],
        ['enduring', 'cherished'],
      ],
      skill: 'contextInference',
    },

    sectionE: {
      title: 'Section E: Situational Writing',
      marks: 15,
      instructions: 'Study the situation below and write your response in about 150–200 words.',
      format: 'Diary Entry',
      purpose: 'To reflect on a meaningful experience visiting a heritage exhibition',
      audience: 'Yourself (personal diary)',
      context: 'You have just visited the Singapore Food Story exhibition, which features displays about hawker culture and traditional Singaporean cuisine. Write a diary entry reflecting on what you saw and how it made you feel about your cultural heritage.',
      bullets: [
        'Describe two things you saw or learnt at the exhibition that impressed or surprised you',
        'Reflect on how the visit made you feel about Singapore\'s cultural heritage',
        'State one thing you would like to do to help preserve hawker culture',
      ],
      wordCount: '150–200 words',
      modelAnswer: `Saturday, 12 January 2026

Dear Diary,

Today's visit to the Singapore Food Story exhibition was truly eye-opening. I had always taken hawker food for granted, but seeing the stories behind each dish made me appreciate it in a completely new way.

The thing that surprised me most was learning that some hawker stalls have been run by the same family for four or even five generations. One display showed the original charcoal stove that a Hainanese chicken rice hawker had used in the 1950s — it was incredible to think that the same recipe is still being served today. I was also moved by a short film featuring elderly hawkers talking about their long hours and their pride in their craft.

The visit made me feel deeply proud of Singapore's multicultural heritage. It struck me that our hawker centres are places where people of all races and backgrounds come together — something rare and precious.

From now on, I want to make an effort to visit local hawker stalls rather than fast-food restaurants. Every bowl of noodles I eat is a small act of support for our culture.

Goodnight,
Hui Min`,
      rubric: {
        taskFulfillment: 'Covers all three bullets; uses correct diary format (date, salutation, personal sign-off); tone is personal, reflective and sincere.',
        language: 'Varied vocabulary; emotional language appropriate for a diary; minimal grammar errors.',
        organisation: 'Logical flow from experience → feelings → personal resolution; ideas connected naturally.',
      },
    },

    sectionF: {
      title: 'Section F: Synthesis & Transformation',
      marks: 10,
      instructions: 'Rewrite each sentence or pair of sentences as directed. Do not change the meaning.',
      items: [
        {
          q: 'The head chef said, "We will never abandon the traditional recipe."',
          stem: 'The head chef declared that they ___',
          answer: 'would never abandon the traditional recipe',
          alternates: ['would never give up the traditional recipe'],
          requiredGroups: [
            ["would never", "never abandon", "never give up"],
            ["traditional recipe", "recipe"],
          ],
          skill: 'reportedSpeech',
          explain: '"Will" → "would" in reported speech; pronoun "we" → "they"; direct speech structure removed.',
        },
        {
          q: 'The craftsman was so skilled that he could produce fifty clay pots in a single day.',
          stem: 'The craftsman was skilled enough ___',
          answer: 'to produce fifty clay pots in a single day',
          alternates: ['to make fifty clay pots in a single day'],
          requiredGroups: [
            ["produce", "make", "create"],
            ["fifty clay pots", "clay pots", "pots"],
          ],
          skill: 'connectors',
          explain: '"So... that he could" → "skilled enough to" — the "enough to" construction expresses sufficient ability.',
        },
        {
          q: 'If the community had taken action sooner, the ancient temple would not have been demolished.',
          stem: 'Had ___',
          answer: 'the community taken action sooner, the ancient temple would not have been demolished',
          alternates: ['the community taken earlier action, the ancient temple would not have been demolished'],
          requiredGroups: [
            ["taken action sooner", "taken earlier action", "acted sooner"],
            ["would not have been demolished", "would have been saved", "would not have been torn down"],
          ],
          skill: 'conditionals',
          explain: 'Type 3 conditional inversion: omit "if" and invert "had" before the subject.',
        },
        {
          q: 'The museum displayed the ancient batik. The ancient batik was created in the nineteenth century.',
          stem: 'The museum displayed the ancient batik, which ___',
          answer: 'was created in the nineteenth century',
          alternates: [
            'had been created in the nineteenth century',
            'dated back to the nineteenth century',
          ],
          requiredGroups: [
            ["created", "made", "produced", "dated"],
            ["nineteenth century", "19th century"],
          ],
          skill: 'relativeClauses',
          explain: 'Non-restrictive relative clause with "which" to add information about the batik.',
        },
        {
          q: 'The young potter learnt the craft. She became the most sought-after artisan in the region.',
          stem: 'Having learnt the craft, ___',
          answer: 'she became the most sought-after artisan in the region',
          alternates: ['the young potter became the most sought-after artisan in the region'],
          requiredGroups: [
            ["became", "turned into", "grew to be"],
            ["sought-after", "most popular", "best-known", "famous"],
          ],
          skill: 'participialPhrase',
          explain: 'Perfect participial phrase: "Having learnt X, she Y" — the first action is completed before the second begins.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word.',
      text: 'Singapore\'s hawker centres have long {{1}} considered one of the city-state\'s most beloved institutions. Unlike restaurants, {{2}} operate under one roof and employ teams of chefs, each hawker stall is independently run — often by a single stallholder {{3}} has dedicated decades to perfecting just one or two dishes. The result is an extraordinary concentration {{4}} culinary expertise in a single location. Visitors to a typical hawker centre can choose from dozens of different cuisines, {{5}} chicken rice and laksa to roti prata and dim sum, all at very affordable prices. It is this combination {{6}} variety, quality and accessibility {{7}} makes hawker centres unlike any other dining experience in the world. In recent years, the younger generation {{8}} increasingly embraced hawker culture, recognising it as an essential part of {{9}} national identity. Food bloggers and social media influencers have helped to introduce these humble stalls to a global audience, ensuring {{10}} Singapore\'s culinary heritage continues to attract visitors from all corners of the world.',
      answers: ['been', 'which', 'who', 'of', 'from', 'of', 'that', 'has', 'their', 'that'],
      accept: [
        ['been'],
        ['which', 'that'],
        ['who', 'that'],
        ['of'],
        ['from'],
        ['of'],
        ['that', 'which'],
        ['has'],
        ['their', "Singapore's", 'our'],
        ['that'],
      ],
      skill: 'comprehensionCloze',
    },

    sectionH: {
      title: 'Section H: Comprehension',
      marks: 15,
      passage: `A Taste of Home

      It begins before dawn. While most of the city sleeps, Madam Neo Guat Eng is already at her stall in the Maxwell Food Centre, lighting the wok and preparing the ingredients for another day's service. She is eighty-one years old. For the past fifty-eight years, without a single day off, she has been serving the same plate of char kway teow — broad rice noodles stir-fried with eggs, beansprouts, Chinese sausage and fresh cockles — to a loyal following of customers who return week after week, decade after decade.

      "The secret," she says, without looking up from her wok, "is the heat. The wok must be incredibly hot. You cannot rush it." Her hands move with practised precision — each ingredient added at exactly the right moment. The result is a dish with what Singaporeans call "wok hei" — literally "wok breath" — a smoky, slightly charred flavour that is almost impossible to replicate in a home kitchen.

      Madam Neo has no plans to retire. But she has no successor either. Her children have long since moved into professional careers, and her attempts to find an apprentice have been unsuccessful. "Young people do not want to do this work," she says with a shrug. "The hours are too long. The heat is too much." She is not wrong: a hawker's day typically runs from five in the morning to three in the afternoon — ten hours of intense physical labour in sweltering conditions.

      The situation is not unique to Madam Neo. Across Singapore, veteran hawkers are ageing out of the profession without passing on their skills. A government survey found that the average age of hawkers at established centres exceeds sixty, and that fewer than fifteen percent have identified a successor. The government has responded with the Hawker Culture Programme — a grant scheme and training initiative designed to attract younger Singaporeans to the trade.

      Whether such schemes can fully replace the kind of knowledge that takes a lifetime to accumulate is another matter. A dish like char kway teow is not just a recipe — it is a living tradition, shaped by memory, by the quality of ingredients available each morning, and by decades of intuition built up over thousands of repetitions. As Madam Neo herself puts it: "You cannot learn this from a book."`,

      questions: [
        {
          type: 'factual',
          marks: 1,
          q: 'How long has Madam Neo been serving char kway teow at her stall?',
          model: 'She has been serving char kway teow for fifty-eight years.',
        },
        {
          type: 'vocabulary',
          marks: 1,
          q: 'In paragraph 2, what does the phrase "wok hei" mean? Use information from the passage.',
          model: '"Wok hei" means literally "wok breath" — it refers to the smoky, slightly charred flavour produced by cooking in an extremely hot wok.',
        },
        {
          type: 'inference',
          marks: 2,
          q: 'Using evidence from paragraph 3, explain in your own words why Madam Neo has been unable to find an apprentice.',
          model: 'Younger people are unwilling to take up the hawker trade because the working conditions are extremely demanding — they must start as early as 5am and work for ten hours in intense heat. These conditions make the job unappealing compared to professional careers.',
          keywords: ['hours', 'heat', 'physical labour', 'professional careers', 'conditions', 'demanding'],
        },
        {
          type: 'factual',
          marks: 1,
          q: 'According to paragraph 4, what percentage of established hawkers have identified a successor?',
          model: 'Fewer than fifteen percent.',
        },
        {
          type: 'language-use',
          marks: 2,
          q: 'What does the writer mean when he says that a dish like char kway teow is "a living tradition"? Support your answer with evidence from the last paragraph.',
          model: 'A "living tradition" means something kept alive by the people who practise it, not fixed in a textbook. The writer supports this by explaining that the dish is shaped by memory, the quality of ingredients each day, and intuition built up over decades — elements that cannot be captured in a written recipe alone.',
          keywords: ['living tradition', 'memory', 'intuition', 'recipe', 'kept alive', 'practise'],
        },
        {
          type: 'vocabulary',
          marks: 1,
          q: 'In paragraph 4, find an expression that means "becoming too old to continue working in their profession".',
          model: 'ageing out of the profession',
        },
        {
          type: 'personal-response',
          marks: 7,
          q: 'Do you think government schemes like the Hawker Culture Programme can successfully preserve Singapore\'s hawker heritage? Use information from the passage and your own ideas to explain your answer.',
          model: 'Award up to 7 marks. Strong answers take a clear position and argue it with evidence — e.g., grants/training can attract new hawkers (for) vs. Madam Neo\'s warning that "you cannot learn this from a book" and unchanged working conditions (against). High-scoring responses acknowledge the limits of government schemes while suggesting complementary measures.',
        },
      ],
    },

    sectionI: {
      title: 'Section I: Editing for Spelling and Grammar',
      marks: 10,
      instructions: 'The passage below contains 10 errors. Each error is underlined and numbered. Write the correct word or phrase in the box provided.',
      paragraph: 'Singapore\'s hawker culture {{1:has receive}} UNESCO recognition as an Intangible Cultural Heritage of Humanity, a distinction that highlights its global significance. Hawker centres, which {{2:is}} found across the island from gleaming food courts to older outdoor stalls, {{3:reflacts}} Singapore\'s rich multicultural history. These spaces bring together people from {{4:commmunities}} of all backgrounds, and for many families, visiting the hawker centre {{5:are}} a weekly tradition. Young hawkers {{6:wants}} to inherit the trade but face many challenges, including long hours and intense heat. Some argue that authenticity is {{7:more importanter}} than innovation, but many veteran hawkers disagree. The government {{8:have}} supported aspiring hawkers through grants and training programmes. Since the scheme began, the number of registered food stall operators {{9:have}} risen steadily. Mr Chua Kim Seng, who opened his {{10:Succesful}} stall thirty years ago, credits the initiative for helping a new generation find their footing.',
      errors: [
        { wrong: 'has receive',       correction: 'has received',  kind: 'grammar'  },
        { wrong: 'is',                correction: 'are',           kind: 'grammar'  },
        { wrong: 'reflacts',          correction: 'reflects',      kind: 'spelling' },
        { wrong: 'commmunities',      correction: 'communities',   kind: 'spelling' },
        { wrong: 'are',               correction: 'is',            kind: 'grammar'  },
        { wrong: 'wants',             correction: 'want',          kind: 'grammar'  },
        { wrong: 'more importanter',  correction: 'more important', kind: 'grammar' },
        { wrong: 'have',              correction: 'has',           kind: 'grammar'  },
        { wrong: 'have',              correction: 'has',           kind: 'grammar'  },
        { wrong: 'Succesful',         correction: 'successful',    kind: 'spelling' },
      ],
    },
  },

  /* ══════════════════════════════════════════════════════════════════
     TERM 4  —  Global Issues / Youth Activism
  ══════════════════════════════════════════════════════════════════ */
  T4: {
    id: 'p6-test-term-4',
    term: 'T4',
    level: 'P6',
    label: 'Term 4 Practice Test (Balanced PSLE Review)',
    duration: '1 h 50 min',
    totalMarks: 95,
    blurb: 'P6 Term 4 comprehensive PSLE mock — full range of grammar structures, rich vocabulary, and complex comprehension. Situational Writing: Speech. Comprehension: climate change and youth activism.',

    sectionA: {
      title: 'Section A: Grammar MCQ',
      marks: 10,
      items: [
        {
          q: 'Never before ___ so many young people taken to the streets to demand climate action.',
          choices: ['have', 'had', 'were', 'did'],
          answer: 'have',
          skill: 'inversion',
          practiseTarget: 'grammar-mcq',
          explain: 'Inversion after "Never before": present perfect with inversion — "Never before have + subject + past participle".',
        },
        {
          q: 'The climate activist said that the world ___ running out of time to reverse the damage.',
          choices: ['is', 'was', 'has been', 'had been'],
          answer: 'was',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: 'In reported speech, present continuous "is running" → past continuous "was running".',
        },
        {
          q: 'If world leaders ___ serious action in the 1990s, the situation ___ as dire today.',
          choices: [
            'had taken / would not be',
            'took / would not be',
            'had taken / would not have been',
            'had taken / will not be',
          ],
          answer: 'had taken / would not be',
          skill: 'conditionals',
          practiseTarget: 'grammar-mcq',
          explain: 'Mixed conditional: past condition (Type 3: had + past participle) with present consequence (would + base verb).',
        },
        {
          q: 'The student activists ___ their presentation rehearsed by a professional coach before the conference.',
          choices: ['have', 'had', 'got', 'made'],
          answer: 'had',
          skill: 'causative',
          practiseTarget: 'grammar-mcq',
          explain: 'Causative "have something done": they arranged for someone else to rehearse/coach their presentation.',
        },
        {
          q: 'The report, ___ recommendations were largely ignored, was later proved correct.',
          choices: ['whose', 'which', 'of which', 'that'],
          answer: 'whose',
          skill: 'relativeClauses',
          practiseTarget: 'grammar-mcq',
          explain: '"Whose" shows possession — "the report whose recommendations" = "the recommendations of the report".',
        },
        {
          q: 'It was not until the glacier had entirely melted ___ the world took notice.',
          choices: ['that', 'when', 'until', 'before'],
          answer: 'that',
          skill: 'cleftSentence',
          practiseTarget: 'grammar-mcq',
          explain: '"It was not until X that Y" — fixed cleft structure; "that" introduces the main clause.',
        },
        {
          q: 'The longer we ___ to act, the harder it ___ to reverse the damage.',
          choices: [
            'wait / will become',
            'waited / becomes',
            'wait / becomes',
            'waited / will become',
          ],
          answer: 'wait / will become',
          skill: 'comparatives',
          practiseTarget: 'grammar-mcq',
          explain: '"The + comparative, the + comparative": "The longer we wait, the harder it will become."',
        },
        {
          q: '___ for their determination, the young activists were invited to address the United Nations.',
          choices: ['Admired', 'Admiring', 'Having admired', 'Admire'],
          answer: 'Admired',
          skill: 'participialPhrase',
          practiseTarget: 'grammar-mcq',
          explain: 'Participial phrase (passive): "Admired for..." = "Because they were admired for their determination..."',
        },
        {
          q: 'Scientists insist that governments ___ stricter emissions targets immediately.',
          choices: ['set', 'sets', 'should', 'must'],
          answer: 'set',
          skill: 'subjunctive',
          practiseTarget: 'grammar-mcq',
          explain: 'Subjunctive mood after "insist that": use base verb form without inflection — "set" (not "sets").',
        },
        {
          q: 'The young activist asked the delegates ___ they were willing to commit to stronger targets.',
          choices: ['if', 'whether', 'that', 'what'],
          answer: 'whether',
          skill: 'reportedSpeech',
          practiseTarget: 'grammar-mcq',
          explain: '"Whether" is used in embedded yes/no questions; more formal than "if" in written English.',
        },
      ],
    },

    sectionB: {
      title: 'Section B: Vocabulary MCQ',
      marks: 5,
      items: [
        {
          q: 'The young activist\'s passionate speech struck a ___ with world leaders at the summit.',
          choices: ['chord', 'note', 'tone', 'beat'],
          answer: 'chord',
          skill: 'idiomaticExpressions',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Strike a chord" = to cause someone to feel recognition or deep emotional resonance.',
        },
        {
          q: 'The city council agreed to ___ the construction of new coal-fired power plants.',
          choices: ['cancel', 'halt', 'suspend', 'prohibit'],
          answer: 'halt',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Halt" implies a sudden, decisive stop — strongest fit for an urgent policy decision.',
        },
        {
          q: 'Fossil fuels remain the ___ source of energy in most industrialised nations.',
          choices: ['dominant', 'leading', 'primary', 'foremost'],
          answer: 'dominant',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Dominant" conveys that fossil fuels are overwhelmingly more prevalent — stronger than "primary" or "leading" in the context of energy systems.',
        },
        {
          q: 'The non-profit organisation launched a campaign to raise ___ about ocean plastic pollution.',
          choices: ['awareness', 'consciousness', 'attention', 'knowledge'],
          answer: 'awareness',
          skill: 'collocationCloze',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Raise awareness" is the fixed collocation for spreading understanding about an issue.',
        },
        {
          q: 'The scientist\'s findings were ___ by three independent research teams before publication.',
          choices: ['tested', 'verified', 'confirmed', 'validated'],
          answer: 'verified',
          skill: 'synonymContrast',
          practiseTarget: 'vocabulary-mcq',
          explain: '"Verified" specifically means checked by an independent party to confirm accuracy — most appropriate for the peer-review process.',
        },
      ],
    },

    sectionC: {
      title: 'Section C: Grammar Cloze',
      marks: 10,
      instructions: 'Choose the correct word from the box to fill in each blank. You may use a word more than once if needed.',
      wordBank: ['although', 'been', 'by', 'despite', 'had', 'have', 'having', 'if', 'in', 'since', 'that', 'unless'],
      text: 'Climate scientists {{1}} been warning about global warming for decades, yet meaningful action has proved elusive. {{2}} the mounting evidence — rising sea levels, more frequent extreme weather events and shrinking glaciers — many governments continue to prioritise economic growth over environmental protection. If nations {{3}} acted decisively in the 1990s, today\'s temperatures would {{4}} been significantly lower. {{5}} immediate steps are taken to reduce carbon emissions, scientists warn {{6}} the planet could experience irreversible tipping points within the next thirty years. Youth activists, frustrated {{7}} the slow pace of change, have taken matters into their own hands. {{8}} faced barriers and opposition from established industries, these young campaigners have succeeded {{9}} bringing climate policy to the forefront of public debate. Their message is clear: we cannot afford to wait — {{10}} we act now, future generations will inherit a severely damaged planet.',
      answers: ['have', 'Despite', 'had', 'have', 'Unless', 'that', 'by', 'Having', 'in', 'unless'],
      accept: [
        ['have'],
        ['Despite', 'Although'],
        ['had'],
        ['have'],
        ['Unless', 'If'],
        ['that'],
        ['by'],
        ['Having'],
        ['in'],
        ['unless', 'if'],
      ],
      skill: 'connectors',
    },

    sectionD: {
      title: 'Section D: Vocabulary Cloze',
      marks: 10,
      instructions: 'Choose the correct word from the box to fill in each blank. Use each word once only. There are two extra words you do not need to use.',
      wordBank: ['catastrophic', 'compelling', 'daunting', 'determined', 'devastated', 'galvanised', 'inevitable', 'momentum', 'relentless', 'resilient', 'sustainable', 'unprecedented'],
      text: 'The climate crisis presents one of the most {{1}} challenges humanity has ever faced. The scale of change required — from energy systems and agriculture to urban planning and industry — is truly {{2}}. Yet across the world, a new generation of young people has been {{3}} into action by the urgency of the situation. These activists are {{4}} in their pursuit of change, taking to streets, courtrooms and international forums to make their voices heard. Their campaigns have built significant {{5}}, persuading several governments to declare climate emergencies and commit to net-zero targets. Scientists are equally {{6}}: despite the obstacles, they continue developing {{7}} solutions — from solar panels and wind turbines to carbon capture technology. The evidence for the need to act is {{8}}: satellite images show glaciers retreating at an {{9}} rate, and coral reefs have been {{10}} by bleaching events that have grown more frequent with each passing decade.',
      answers: ['daunting', 'unprecedented', 'galvanised', 'relentless', 'momentum', 'determined', 'sustainable', 'compelling', 'catastrophic', 'devastated'],
      accept: [
        ['daunting'],
        ['unprecedented'],
        ['galvanised'],
        ['relentless', 'determined'],
        ['momentum'],
        ['determined', 'relentless', 'resilient'],
        ['sustainable'],
        ['compelling'],
        ['catastrophic', 'unprecedented'],
        ['devastated'],
      ],
      skill: 'contextInference',
    },

    sectionE: {
      title: 'Section E: Situational Writing',
      marks: 15,
      instructions: 'Study the situation below and write your response in about 150–200 words.',
      format: 'Speech',
      purpose: 'To inspire fellow students to take action on climate change',
      audience: 'Your fellow students during a school assembly',
      context: 'You have been selected to give a three-minute speech at your school\'s Environment Day assembly. Your task is to inspire your schoolmates to take personal action on climate change.',
      bullets: [
        'State clearly why climate change is a serious issue that affects young people',
        'Suggest two specific actions students can take in their daily lives to help',
        'End with a powerful call to action that motivates your audience',
      ],
      wordCount: '150–200 words',
      modelAnswer: `Good morning, Principal, teachers and fellow students.

Today, I want to talk to you about something that affects each and every one of us — climate change.

The facts are alarming. The past decade was the hottest on record. Sea levels are rising. Extreme weather events — floods, droughts and wildfires — are becoming more frequent and more severe. Scientists warn that if we do not act now, my generation and yours will face consequences that our parents never had to imagine.

But here is the good news: we can make a difference, starting right here, right now. First, we can reduce our plastic use — bring a reusable water bottle and bag to school every day. Second, we can save energy at home by switching off lights and unplugging devices when they are not in use.

These may seem like small steps, but when thousands of students act together, the impact is enormous.

Our planet cannot wait for someone else to save it. We are that someone. Let us act today, not tomorrow.

Thank you.`,
      rubric: {
        taskFulfillment: 'Covers all three bullets; uses correct speech format (greeting, body, closing); tone is passionate and motivating.',
        language: 'Varied sentence structures; powerful vocabulary; rhetorical devices (e.g. rhetorical questions, repetition); minimal grammar errors.',
        organisation: 'Clear introduction (the issue), body (two actions), powerful conclusion (call to action); persuasive and logical flow.',
      },
    },

    sectionF: {
      title: 'Section F: Synthesis & Transformation',
      marks: 10,
      instructions: 'Rewrite each sentence or pair of sentences as directed. Do not change the meaning.',
      items: [
        {
          q: 'The scientist said, "Governments must act immediately to reduce carbon emissions."',
          stem: 'The scientist insisted that governments ___',
          answer: 'act immediately to reduce carbon emissions',
          alternates: ['must act immediately to reduce carbon emissions'],
          requiredGroups: [
            ["act immediately", "must act", "take immediate action"],
            ["carbon emissions", "emissions"],
          ],
          skill: 'reportedSpeech',
          explain: '"Insist that" takes the subjunctive: base form "act" (not "acts" or "acted"). "Must" may be retained.',
        },
        {
          q: 'The temperature increase is so severe that some species cannot survive.',
          stem: 'The temperature increase is too ___',
          answer: 'severe for some species to survive',
          alternates: ['severe for some species to live'],
          requiredGroups: [
            ["severe", "high"],
            ["species to survive", "species to live"],
          ],
          skill: 'connectors',
          explain: '"So... that... cannot" → "too... for... to..." — same meaning of an extreme that prevents survival.',
        },
        {
          q: 'The youth activists launched the campaign. The campaign changed government policy.',
          stem: 'The youth activists launched the campaign, which ___',
          answer: 'changed government policy',
          alternates: [
            'led to a change in government policy',
            'resulted in a change in government policy',
          ],
          requiredGroups: [
            ["changed", "led to a change", "resulted in"],
            ["government policy", "policy"],
          ],
          skill: 'relativeClauses',
          explain: 'Non-restrictive relative clause adds information about the campaign\'s outcome.',
        },
        {
          q: 'If the world had invested in renewable energy earlier, the current crisis would not have occurred.',
          stem: 'Had ___',
          answer: 'the world invested in renewable energy earlier, the current crisis would not have occurred',
          alternates: ['the world invested in renewables earlier, the current crisis would not have occurred'],
          requiredGroups: [
            ["invested in", "put money into"],
            ["renewable energy", "renewables"],
          ],
          skill: 'conditionals',
          explain: 'Type 3 conditional inversion: drop "if" and move "had" before the subject.',
        },
        {
          q: 'The delegates were deeply moved by the teenager\'s speech. They pledged to support stronger climate targets.',
          stem: 'Deeply moved by the teenager\'s speech, ___',
          answer: 'the delegates pledged to support stronger climate targets',
          alternates: ['the delegates promised to support stronger climate targets'],
          requiredGroups: [
            ["pledged", "promised", "committed", "vowed"],
            ["climate targets", "climate goals"],
          ],
          skill: 'participialPhrase',
          explain: 'Participial phrase construction: the participial phrase (moved by X) explains why the delegates acted.',
        },
      ],
    },

    sectionG: {
      title: 'Section G: Comprehension Cloze',
      marks: 10,
      instructions: 'Fill in each blank with ONE suitable word.',
      text: 'Climate change is no longer a distant threat — its effects {{1}} already being felt in every corner of the globe. Rising temperatures are causing glaciers to melt at an alarming rate, {{2}} in turn raises sea levels and threatens low-lying coastal communities. Extreme weather events, {{3}} as hurricanes, droughts and wildfires, are becoming both more frequent and more destructive. Scientists warn that unless carbon emissions are dramatically {{4}} within the next decade, some of these changes may become irreversible. Young people, {{5}} will bear the heaviest burden of a warming world, are increasingly frustrated by the slow pace of action. Youth-led movements have {{6}} international attention and sparked public debate, yet many activists feel {{7}} governments are still not doing enough. Despite the challenges, there is reason for hope: the cost of renewable energy {{8}} fallen dramatically in recent years, making clean energy an increasingly viable alternative to fossil fuels. {{9}} countries transition to greener economies, new jobs in the renewable sector are being created, suggesting {{10}} acting on climate change and growing the economy are not mutually exclusive.',
      answers: ['are', 'which', 'such', 'reduced', 'who', 'attracted', 'that', 'has', 'As', 'that'],
      accept: [
        ['are'],
        ['which', 'that'],
        ['such'],
        ['reduced', 'cut', 'lowered'],
        ['who'],
        ['attracted', 'drawn', 'gained'],
        ['that'],
        ['has'],
        ['As', 'When'],
        ['that'],
      ],
      skill: 'comprehensionCloze',
    },

    sectionH: {
      title: 'Section H: Comprehension',
      marks: 15,
      passage: `The Generation That Would Not Wait

      In August 2018, a fifteen-year-old Swedish girl named Greta Thunberg sat outside the Swedish parliament with a handmade sign reading "Skolstrejk för klimatet" — School Strike for Climate. She was protesting her government's failure to cut carbon emissions in line with the Paris Agreement. Few expected her solitary act of protest to amount to anything significant.

      Within eighteen months, her movement had inspired millions. The Fridays for Future campaign — named after students striking from school every Friday to demand climate action — spread to more than 150 countries. In September 2019, an estimated four million people in 161 countries took part in what became the largest climate strike in history. At its heart was a simple, urgent message: adults had failed to protect the planet, and it was time for young people to make themselves heard.

      Thunberg's approach was deliberately provocative. At the World Economic Forum in Davos, she told assembled heads of state and business leaders: "I want you to act as if the house is on fire, because it is." At the United Nations Climate Action Summit, she delivered a searing critique of world leaders: "You have stolen my dreams and my childhood with your empty words." Her speeches were remarkable for their directness and their refusal to soften hard truths to spare the feelings of the powerful.

      Critics accused Thunberg and her followers of naivety — of demanding solutions without understanding the economic complexities involved in transitioning away from fossil fuels. Others pointed out that youth protests, however inspiring, do not in themselves change policy. Some even suggested that her rise was partly a media phenomenon, sustained by the same social media ecosystems that amplify any sufficiently compelling narrative.

      Yet the effects of the movement she inspired were real. Several European governments passed new climate legislation in the months following the 2019 strikes. A survey of policymakers in twenty countries found that youth climate protests had "significantly increased political pressure" on governments to act. Thunberg herself was nominated for the Nobel Peace Prize three years in a row. Whether or not governments deliver on their promises, a generation has been politically awakened — and it has learnt that it has a voice.`,

      questions: [
        {
          type: 'factual',
          marks: 1,
          q: 'What does "Skolstrejk för klimatet" mean in English?',
          model: 'School Strike for Climate.',
        },
        {
          type: 'factual',
          marks: 1,
          q: 'According to paragraph 2, how many people took part in the September 2019 climate strike?',
          model: 'An estimated four million people (in 161 countries).',
        },
        {
          type: 'vocabulary',
          marks: 1,
          q: 'In paragraph 3, what does the word "searing" suggest about Thunberg\'s critique?',
          model: '"Searing" suggests that her criticism was extremely intense, sharp and painful — like a burn — causing discomfort to those it was directed at.',
        },
        {
          type: 'inference',
          marks: 2,
          q: 'Using evidence from paragraph 4, explain in your own words what the critics of Thunberg\'s movement argued.',
          model: 'Critics argued that young activists were idealistic but unrealistic — they called for change without fully understanding how difficult and costly it would be to move away from fossil fuels. Some also argued that protests alone cannot change government policy, and that Thunberg\'s fame was partly driven by social media rather than the substance of her arguments.',
          keywords: ['naivety', 'economic', 'fossil fuels', 'policy', 'media', 'idealistic', 'unrealistic'],
        },
        {
          type: 'language-use',
          marks: 2,
          q: 'In paragraph 3, Thunberg says "the house is on fire." What does she mean, and why is this an effective way to communicate her message?',
          model: 'She means the climate crisis is an immediate emergency requiring urgent action — just as a house fire demands immediate response, not future planning. It is effective because it uses a vivid, relatable image to make an abstract issue feel immediate and personal.',
          keywords: ['house is on fire', 'emergency', 'urgent', 'immediate', 'vivid', 'relatable', 'abstract'],
        },
        {
          type: 'factual',
          marks: 1,
          q: 'Name ONE concrete outcome of the youth climate movement mentioned in paragraph 5.',
          model: 'Several European governments passed new climate legislation in the months following the 2019 strikes. (Accept also: youth protests significantly increased political pressure on governments / Thunberg was nominated for the Nobel Peace Prize.)',
        },
        {
          type: 'personal-response',
          marks: 7,
          q: 'Do you think young people like Greta Thunberg can truly make a difference in the fight against climate change, or is the power to change things still entirely in the hands of adults? Use information from the passage and your own ideas to support your answer.',
          model: 'Award up to 7 marks. Strong answers will: take a clear position; use specific evidence from the passage (e.g. the 4 million strikers, new legislation, increased political pressure); acknowledge the limitations (critics\' points in paragraph 4); argue persuasively using own knowledge. Highest marks for nuanced thinking — e.g., young people create political pressure that makes it harder for adults to ignore, even if legislative decisions rest with adults.',
        },
      ],
    },

    sectionI: {
      title: 'Section I: Editing for Spelling and Grammar',
      marks: 10,
      instructions: 'The passage below contains 10 errors. Each error is underlined and numbered. Write the correct word or phrase in the box provided.',
      paragraph: 'Young people around the world {{1:has}} been speaking out about climate change with growing urgency. In Singapore, a group of secondary school students {{2:organise}} their first climate rally two years ago, {{3:drew}} an audience of thousands who were deeply concerned about their {{4:futere}}. The students hoped to raise {{5:awarness}} and inspire others to reduce their carbon footprint. They {{6:invites}} classmates to pledge small daily changes, from carrying reusable bags to switching off lights. Many observers believe these efforts have {{7:making}} a measurable difference to attitudes in schools across the country. One young activist summed it up: "This is not someone {{8:else}} problem," she said firmly. "{{9:We will inherited}} this planet, and so we {{10:must to}} care for it now."',
      errors: [
        { wrong: 'has',            correction: 'have',         kind: 'grammar'  },
        { wrong: 'organise',       correction: 'organised',    kind: 'grammar'  },
        { wrong: 'drew',           correction: 'drawing',      kind: 'grammar'  },
        { wrong: 'futere',         correction: 'future',       kind: 'spelling' },
        { wrong: 'awarness',       correction: 'awareness',    kind: 'spelling' },
        { wrong: 'invites',        correction: 'invited',      kind: 'grammar'  },
        { wrong: 'making',         correction: 'made',         kind: 'grammar'  },
        { wrong: 'else',           correction: "else's",       kind: 'grammar'  },
        { wrong: 'We will inherited', correction: 'We will inherit', kind: 'grammar' },
        { wrong: 'must to',        correction: 'must',         kind: 'grammar'  },
      ],
    },
  },

});

/* ── Lookup helpers ────────────────────────────────────────────────────── */

/** Returns all P6 papers as a sorted array. */
export function getP6PracticeTests() {
  return P6_PRACTICE_TEST_TERMS.map(t => P6_PRACTICE_TESTS[t]).filter(Boolean);
}

/** Returns a single P6 paper by term key, or null. */
export function getP6PracticeTest(term) {
  return P6_PRACTICE_TESTS[term] || null;
}

/* ── Structural validator ──────────────────────────────────────────────── */

/**
 * Validates structural integrity of all P6 papers.
 * Returns an array of issue strings (empty = all good).
 */
export function validateP6PracticeTests(bank = P6_PRACTICE_TESTS) {
  const issues = [];
  const blankRe = /\{\{(\d+)\}\}/g;

  for (const term of P6_PRACTICE_TEST_TERMS) {
    const test = bank[term];
    if (!test) { issues.push(`${term}: missing`); continue; }
    const tag = `P6/${term}`;

    if (test.level !== 'P6') issues.push(`${tag}: level should be 'P6'`);

    // Section A — grammar MCQ: 10 items
    const sA = test.sectionA;
    if (!sA || !Array.isArray(sA.items) || sA.items.length !== 10) {
      issues.push(`${tag}/sectionA: must have 10 items`);
    } else {
      checkMcqItems(issues, `${tag}/sectionA`, sA.items, 4);
    }

    // Section B — vocab MCQ: 5 items
    const sB = test.sectionB;
    if (!sB || !Array.isArray(sB.items) || sB.items.length !== 5) {
      issues.push(`${tag}/sectionB: must have 5 items`);
    } else {
      checkMcqItems(issues, `${tag}/sectionB`, sB.items, 4);
    }

    // Sections C & D — cloze with 10 blanks, word bank of 12
    for (const key of ['sectionC', 'sectionD']) {
      const s = test[key];
      if (!s) { issues.push(`${tag}/${key}: missing`); continue; }
      const blanks = [...(s.text || '').matchAll(blankRe)].map(m => Number(m[1]));
      if (blanks.length !== 10) issues.push(`${tag}/${key}: expected 10 blanks, found ${blanks.length}`);
      if (!Array.isArray(s.answers) || s.answers.length !== 10)
        issues.push(`${tag}/${key}: expected 10 answers`);
      if (!Array.isArray(s.wordBank) || s.wordBank.length !== 12)
        issues.push(`${tag}/${key}: word bank should have 12 words (10 used + 2 left over)`);
      const bankLower = (s.wordBank || []).map(w => w.toLowerCase());
      for (const a of s.answers || []) {
        if (!bankLower.includes(String(a).toLowerCase()))
          issues.push(`${tag}/${key}: answer "${a}" missing from word bank`);
      }
    }

    // Section E — situational writing
    const sE = test.sectionE;
    if (!sE || typeof sE.modelAnswer !== 'string' || !sE.modelAnswer.trim())
      issues.push(`${tag}/sectionE: missing modelAnswer`);
    if (!Array.isArray(sE?.bullets) || sE.bullets.length !== 3)
      issues.push(`${tag}/sectionE: need exactly 3 bullet points`);

    // Section F — synthesis & transformation: 5 items
    const sF = test.sectionF;
    if (!sF || !Array.isArray(sF.items) || sF.items.length !== 5)
      issues.push(`${tag}/sectionF: must have 5 items`);

    // Section G — comprehension cloze (open, 10 blanks)
    const sG = test.sectionG;
    if (!sG) {
      issues.push(`${tag}/sectionG: missing`);
    } else {
      const blanks = [...(sG.text || '').matchAll(blankRe)].map(m => Number(m[1]));
      if (blanks.length !== 10) issues.push(`${tag}/sectionG: expected 10 blanks, found ${blanks.length}`);
      if (!Array.isArray(sG.answers) || sG.answers.length !== 10)
        issues.push(`${tag}/sectionG: expected 10 answers`);
    }

    // Section H — comprehension
    const sH = test.sectionH;
    if (!sH || typeof sH.passage !== 'string' || !sH.passage.trim())
      issues.push(`${tag}/sectionH: missing passage`);
    if (!Array.isArray(sH?.questions) || sH.questions.length < 6)
      issues.push(`${tag}/sectionH: needs at least 6 questions`);

    // Section I — editing for spelling/grammar (10 errors)
    const sI = test.sectionI;
    if (sI) {
      const blanks = [...(sI.paragraph || '').matchAll(/\{\{(\d+):([^}]*)\}\}/g)];
      if (blanks.length !== 10)
        issues.push(`${tag}/sectionI: expected 10 numbered errors, found ${blanks.length}`);
      if (!Array.isArray(sI.errors) || sI.errors.length !== blanks.length)
        issues.push(`${tag}/sectionI: errors count (${sI.errors?.length ?? 0}) must match blanks (${blanks.length})`);
      checkEditingErrors(issues, `${tag}/sectionI`, sI);
    }

    // Per-section mark/blank alignment.
    checkSectionMarks(issues, `${tag}/sectionA`, sA, 'mcq', 10);
    checkSectionMarks(issues, `${tag}/sectionB`, sB, 'mcq', 5);
    checkSectionMarks(issues, `${tag}/sectionC`, test.sectionC, 'cloze', 10);
    checkSectionMarks(issues, `${tag}/sectionD`, test.sectionD, 'cloze', 10);
    checkSectionMarks(issues, `${tag}/sectionF`, test.sectionF, 'synthesis', 5);
    checkSectionMarks(issues, `${tag}/sectionG`, test.sectionG, 'cloze', 10);
    checkSectionMarks(issues, `${tag}/sectionI`, sI, 'editing', 10);

    // Marks total — include EVERY rendered section. Section I was previously
    // excluded, which let a 10-mark editing block sit outside the declared
    // paper total without the validator noticing.
    const markKeys = ['sectionA', 'sectionB', 'sectionC', 'sectionD', 'sectionE', 'sectionF', 'sectionG', 'sectionH', 'sectionI'];
    const total = markKeys.reduce((acc, k) => acc + (test[k]?.marks || 0), 0);
    if (total !== test.totalMarks)
      issues.push(`${tag}: section marks sum to ${total} but totalMarks=${test.totalMarks}`);
  }

  return issues;
}
