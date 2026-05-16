/**
 * Synthesis & Transformation items for Primary English Quest.
 *
 * Shape extends SYNTHESIS_SAMPLES in src/modes/primaryPlaceholders.js with:
 *   skillKey   — camelCase identifier for the skill category
 *   pattern    — human-readable transformation label
 *   alternates — array of fully correct alternative answers (may be empty)
 *   explain    — brief, student-friendly grammar note (P4–P6 level)
 *
 * Levels: P4 | P5 | P6
 *
 * Patterns covered:
 *   Connectors        — although/even though, so…that/such…that,
 *                       not only…but also, as soon as/no sooner…than,
 *                       unless/provided that
 *   Active ↔ Passive  — simple past, present perfect, modal, passive→active
 *   Reported Speech   — statement, question, command, exclamation
 *   Relative Clauses  — who, which, whose, whom/preposition+which
 *   Comparison        — as…as/not as…as, comparative+than, the more…the more
 *   Advanced          — it was not until…that, no sooner had…than,
 *                       fronted negative adverb (seldom/never/rarely)
 */

export const SYNTHESIS_ITEMS = Object.freeze([

  // ═══════════════════════════════════════════════════════════════════════════
  // CONNECTORS (8 items)
  // ═══════════════════════════════════════════════════════════════════════════

  // --- although / even though (contrast) ---

  {
    id: 'st-conn-1',
    level: 'P5',
    skill: 'Connector — Contrast (although)',
    skillKey: 'connectorContrast',
    pattern: 'although / even though',
    original: 'Siti was feeling very tired. She completed all her chores.',
    stem: 'Although',
    answer: 'Although Siti was feeling very tired, she completed all her chores.',
    alternates: [
      'Even though Siti was feeling very tired, she completed all her chores.',
      'Siti completed all her chores although she was feeling very tired.',
      'Siti completed all her chores even though she was feeling very tired.',
    ],
    explain: '"Although" and "even though" introduce a contrast — the situation in the main clause is surprising given what the "although" clause says. Put a comma after the "although" clause when it comes first.',
  },

  {
    id: 'st-conn-2',
    level: 'P5',
    skill: 'Connector — Contrast (even though)',
    skillKey: 'connectorContrast',
    pattern: 'although / even though',
    original: 'The weather was stormy. The match was not cancelled.',
    stem: 'Even though',
    answer: 'Even though the weather was stormy, the match was not cancelled.',
    alternates: [
      'Although the weather was stormy, the match was not cancelled.',
      'The match was not cancelled even though the weather was stormy.',
      'The match was not cancelled although the weather was stormy.',
    ],
    explain: '"Even though" is slightly stronger than "although" and emphasises the surprising contrast. Both can be used at the beginning or in the middle of the sentence.',
  },

  // --- so…that / such…that ---

  {
    id: 'st-conn-3',
    level: 'P5',
    skill: 'Connector — Result (so…that)',
    skillKey: 'connectorResult',
    pattern: 'so…that',
    original: 'The music was very loud. We could not hear each other speak.',
    stem: 'The music was so',
    answer: 'The music was so loud that we could not hear each other speak.',
    alternates: [],
    explain: '"So + adjective/adverb + that" expresses a result. Use "so" before an adjective or adverb on its own. Do not add "very" — "so" already replaces it.',
  },

  {
    id: 'st-conn-4',
    level: 'P5',
    skill: 'Connector — Result (such…that)',
    skillKey: 'connectorResult',
    pattern: 'such…that',
    original: 'It was a very boring lesson. Half the class fell asleep.',
    stem: 'It was such',
    answer: 'It was such a boring lesson that half the class fell asleep.',
    alternates: ['The lesson was so boring that half the class fell asleep.'],
    explain: '"Such + (a/an) + adjective + noun + that" expresses a result. Use "such" when a noun follows. Remember the article "a/an" between "such" and the adjective.',
  },

  // --- not only…but also ---

  {
    id: 'st-conn-5',
    level: 'P5',
    skill: 'Connector — Addition (not only…but also)',
    skillKey: 'connectorAddition',
    pattern: 'not only…but also',
    original: 'Rahul won the gold medal. He also broke the school record.',
    stem: 'Rahul not only',
    answer: 'Rahul not only won the gold medal but also broke the school record.',
    alternates: ['Not only did Rahul win the gold medal, but he also broke the school record.'],
    explain: '"Not only…but also" links two positive ideas and emphasises that both are true. When "not only" starts the whole sentence, the subject and auxiliary verb must be inverted: "Not only did Rahul…"',
  },

  // --- as soon as / no sooner…than ---

  {
    id: 'st-conn-6',
    level: 'P5',
    skill: 'Connector — Time (as soon as)',
    skillKey: 'connectorTime',
    pattern: 'as soon as',
    original: 'She arrived at the station. The train departed immediately.',
    stem: 'As soon as',
    answer: 'As soon as she arrived at the station, the train departed.',
    alternates: ['The train departed as soon as she arrived at the station.'],
    explain: '"As soon as" means "immediately when" and shows that the second event happened right after the first. Use simple past in both clauses when both events are in the past.',
  },

  {
    id: 'st-conn-7',
    level: 'P6',
    skill: 'Connector — Time (no sooner…than)',
    skillKey: 'connectorTime',
    pattern: 'no sooner…than',
    original: 'The children sat down. The teacher started the test immediately.',
    stem: 'No sooner had',
    answer: 'No sooner had the children sat down than the teacher started the test.',
    alternates: [],
    explain: '"No sooner had + subject + past participle + than + subject + simple past" shows that the second event followed the first with no delay. Note: "no sooner" always uses the past perfect (had + past participle) in its clause.',
  },

  // --- unless / provided that ---

  {
    id: 'st-conn-8',
    level: 'P5',
    skill: 'Connector — Condition (unless / provided that)',
    skillKey: 'connectorCondition',
    pattern: 'unless / provided that',
    original: 'You must submit your homework. If you do not, you will not be allowed to take the test.',
    stem: 'You will not be allowed to take the test unless',
    answer: 'You will not be allowed to take the test unless you submit your homework.',
    alternates: [
      'Unless you submit your homework, you will not be allowed to take the test.',
      'You will be allowed to take the test provided that you submit your homework.',
    ],
    explain: '"Unless" means "if not" — it introduces the condition that must NOT happen for the result to follow. "Provided that" means "on the condition that" — the opposite of unless. Do not use "unless" and "not" together.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTIVE ↔ PASSIVE (6 items)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'st-pass-1',
    level: 'P4',
    skill: 'Active → Passive (simple past)',
    skillKey: 'activeToPassive',
    pattern: 'simple past active → passive',
    original: 'The cleaners swept the corridors every morning.',
    stem: 'The corridors',
    answer: 'The corridors were swept by the cleaners every morning.',
    alternates: [],
    explain: 'To change simple past active to passive: [object] + "was/were" + past participle + "by" + [agent]. Use "were" for plural nouns.',
  },

  {
    id: 'st-pass-2',
    level: 'P4',
    skill: 'Active → Passive (simple past)',
    skillKey: 'activeToPassive',
    pattern: 'simple past active → passive',
    original: 'The principal awarded five pupils with trophies.',
    stem: 'Five pupils',
    answer: 'Five pupils were awarded trophies by the principal.',
    alternates: ['Trophies were awarded to five pupils by the principal.'],
    explain: 'With verbs that have two objects (e.g. "award someone something"), either object can become the subject of the passive sentence.',
  },

  {
    id: 'st-pass-3',
    level: 'P5',
    skill: 'Active → Passive (present perfect)',
    skillKey: 'activeToPassive',
    pattern: 'present perfect passive',
    original: 'The technician has repaired the school projector.',
    stem: 'The school projector',
    answer: 'The school projector has been repaired by the technician.',
    alternates: [],
    explain: 'Present perfect passive: "have/has" + "been" + past participle. "The technician" becomes the agent after "by".',
  },

  {
    id: 'st-pass-4',
    level: 'P5',
    skill: 'Active → Passive (modal — should)',
    skillKey: 'activeToPassive',
    pattern: 'modal passive (should be)',
    original: 'Students should hand in all assignments on time.',
    stem: 'All assignments',
    answer: 'All assignments should be handed in on time.',
    alternates: ['All assignments should be handed in by students on time.'],
    explain: 'Modal passive: [object] + modal verb + "be" + past participle. The "by" phrase can be left out when it is already understood who is responsible.',
  },

  {
    id: 'st-pass-5',
    level: 'P6',
    skill: 'Active → Passive (modal — must)',
    skillKey: 'activeToPassive',
    pattern: 'modal passive (must be)',
    original: 'Everyone must wear a safety helmet inside the construction site.',
    stem: 'A safety helmet',
    answer: 'A safety helmet must be worn by everyone inside the construction site.',
    alternates: ['A safety helmet must be worn inside the construction site.'],
    explain: 'For modal passives with "must", use: [object] + "must be" + past participle. The agent ("by everyone") can be omitted if the meaning is clear.',
  },

  {
    id: 'st-pass-6',
    level: 'P6',
    skill: 'Passive → Active',
    skillKey: 'passiveToActive',
    pattern: 'passive → active',
    original: 'The science experiment was conducted by the P5 pupils last Friday.',
    stem: 'The P5 pupils',
    answer: 'The P5 pupils conducted the science experiment last Friday.',
    alternates: [],
    explain: 'To change passive to active, move the "by" agent to the front as the subject, put the verb in the correct active tense (simple past here), and make the original subject the object.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DIRECT ↔ INDIRECT / REPORTED SPEECH (6 items)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'st-rs-1',
    level: 'P4',
    skill: 'Reported Speech — Statement',
    skillKey: 'reportedSpeechStatement',
    pattern: 'direct statement → reported speech',
    original: '"I am very proud of you," said Mrs Lim to the class.',
    stem: 'Mrs Lim told the class',
    answer: 'Mrs Lim told the class that she was very proud of them.',
    alternates: ['Mrs Lim said that she was very proud of the class.'],
    explain: 'In reported speech, change: "I" → "she/he", "you" → "them/the class", "am" → "was". Add "that" after the reporting verb. Shift the tense one step back (present → past).',
  },

  {
    id: 'st-rs-2',
    level: 'P5',
    skill: 'Reported Speech — Statement',
    skillKey: 'reportedSpeechStatement',
    pattern: 'direct statement → reported speech',
    original: '"We will leave for the museum tomorrow," the teacher announced.',
    stem: 'The teacher announced',
    answer: 'The teacher announced that they would leave for the museum the next day.',
    alternates: ['The teacher announced that they would leave for the museum the following day.'],
    explain: 'In reported speech, "will" changes to "would", "tomorrow" changes to "the next day" or "the following day", and "we" changes to "they".',
  },

  {
    id: 'st-rs-3',
    level: 'P5',
    skill: 'Reported Speech — Yes/No Question',
    skillKey: 'reportedSpeechQuestion',
    pattern: 'reported question (whether/if)',
    original: '"Did you remember to bring your permission slip?" the teacher asked Tom.',
    stem: 'The teacher asked Tom',
    answer: 'The teacher asked Tom whether he had remembered to bring his permission slip.',
    alternates: ['The teacher asked Tom if he had remembered to bring his permission slip.'],
    explain: 'For yes/no questions in reported speech, use "whether" or "if". The auxiliary "did" is removed and the verb changes to past perfect ("had remembered"). Word order becomes subject + verb (no inversion).',
  },

  {
    id: 'st-rs-4',
    level: 'P5',
    skill: 'Reported Speech — Wh-Question',
    skillKey: 'reportedSpeechQuestion',
    pattern: 'reported question (wh-word)',
    original: '"Where did you find the injured bird?" the vet asked the boy.',
    stem: 'The vet asked the boy',
    answer: 'The vet asked the boy where he had found the injured bird.',
    alternates: [],
    explain: 'For wh-questions in reported speech, keep the wh-word ("where") and use statement word order (subject + verb), not question order. Change "did you find" → "he had found".',
  },

  {
    id: 'st-rs-5',
    level: 'P5',
    skill: 'Reported Speech — Command',
    skillKey: 'reportedSpeechCommand',
    pattern: 'direct command → reported (told/asked + to-infinitive)',
    original: '"Please sit down and be quiet," said the librarian to the pupils.',
    stem: 'The librarian told the pupils',
    answer: 'The librarian told the pupils to sit down and be quiet.',
    alternates: ['The librarian asked the pupils to sit down and be quiet.'],
    explain: 'Commands in reported speech use "told/asked + object + to + infinitive". Drop "please" (or use "asked" to keep the polite tone). Do not use "that".',
  },

  {
    id: 'st-rs-6',
    level: 'P6',
    skill: 'Reported Speech — Exclamation',
    skillKey: 'reportedSpeechExclamation',
    pattern: 'direct exclamation → reported speech',
    original: '"What a beautiful painting this is!" exclaimed the judge.',
    stem: 'The judge exclaimed that',
    answer: 'The judge exclaimed that it was a very beautiful painting.',
    alternates: ['The judge exclaimed that the painting was very beautiful.'],
    explain: 'Exclamations ("What a…!") are reported using "exclaimed that" + a statement. The exclamation structure changes to a normal sentence. "What a + adjective + noun" becomes "very + adjective + noun".',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // RELATIVE CLAUSES (4 items)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'st-rel-1',
    level: 'P4',
    skill: 'Relative Clause — who (people)',
    skillKey: 'relativeClause',
    pattern: 'relative clause with who',
    original: 'The boy rescued the drowning kitten. He was praised by his teacher.',
    stem: 'The boy who',
    answer: 'The boy who rescued the drowning kitten was praised by his teacher.',
    alternates: [],
    explain: '"Who" is used for people. It replaces the subject pronoun ("he/she/they") and joins the two sentences. Keep the verb in the relative clause in the same tense as the original.',
  },

  {
    id: 'st-rel-2',
    level: 'P4',
    skill: 'Relative Clause — which (things)',
    skillKey: 'relativeClause',
    pattern: 'relative clause with which',
    original: 'The library book was left on the bus. It had just been borrowed.',
    stem: 'The library book which',
    answer: 'The library book which had just been borrowed was left on the bus.',
    alternates: ['The library book that had just been borrowed was left on the bus.'],
    explain: '"Which" is used for things and animals. It can often be replaced by "that". Place the relative clause right after the noun it describes.',
  },

  {
    id: 'st-rel-3',
    level: 'P5',
    skill: 'Relative Clause — whose (possession)',
    skillKey: 'relativeClause',
    pattern: 'relative clause with whose',
    original: 'The scientist made a breakthrough discovery. Her research had spanned 10 years.',
    stem: 'The scientist whose',
    answer: 'The scientist whose research had spanned 10 years made a breakthrough discovery.',
    alternates: [],
    explain: '"Whose" shows possession and replaces a possessive pronoun ("his/her/their"). "Whose" + noun stays together — do not separate them.',
  },

  {
    id: 'st-rel-4',
    level: 'P6',
    skill: 'Relative Clause — whom / preposition + which',
    skillKey: 'relativeClause',
    pattern: 'whom / preposition + which',
    original: 'The mentor helped Jun greatly. Jun was very grateful to him.',
    stem: 'The mentor to whom',
    answer: 'The mentor to whom Jun was very grateful had helped him greatly.',
    alternates: ['The mentor whom Jun was very grateful to had helped him greatly.'],
    explain: '"Whom" is used for people in the object position. When a preposition is involved ("to him"), it moves before "whom" in formal English: "to whom". In informal English, the preposition can stay at the end.',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEGREES OF COMPARISON (3 items)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'st-comp-1',
    level: 'P4',
    skill: 'Comparison — as…as / not as…as',
    skillKey: 'comparison',
    pattern: 'as…as / not as…as',
    original: 'Jake is 12 years old. His brother Ben is also 12 years old.',
    stem: 'Jake is as',
    answer: 'Jake is as old as his brother Ben.',
    alternates: ['Ben is as old as Jake.', 'Jake is not younger than his brother Ben.'],
    explain: '"As + adjective + as" shows that two things are equal. The adjective stays in its base form (not comparative or superlative).',
  },

  {
    id: 'st-comp-2',
    level: 'P4',
    skill: 'Comparison — comparative + than',
    skillKey: 'comparison',
    pattern: 'comparative adjective + than',
    original: 'The red backpack costs $45. The blue backpack costs $38.',
    stem: 'The red backpack is',
    answer: 'The red backpack is more expensive than the blue backpack.',
    alternates: ['The blue backpack is cheaper than the red backpack.'],
    explain: 'Use the comparative form of the adjective + "than" to compare two things. For longer adjectives (two or more syllables), use "more + adjective" instead of adding "-er".',
  },

  {
    id: 'st-comp-3',
    level: 'P6',
    skill: 'Comparison — the more…the more',
    skillKey: 'comparison',
    pattern: 'the more…the more',
    original: 'If you practise more, you will improve more.',
    stem: 'The more you practise,',
    answer: 'The more you practise, the more you will improve.',
    alternates: [],
    explain: '"The more…the more" shows a proportional relationship — as one thing increases, another increases too. Both parts use the comparative form and the structure is always: "The more [clause], the more [clause]."',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADVANCED / PSLE-LEVEL (3 items)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    id: 'st-adv-1',
    level: 'P6',
    skill: 'Advanced — It was not until…that',
    skillKey: 'advancedConstruction',
    pattern: 'it was not until…that',
    original: 'Priya did not realise she had lost her phone until she reached home.',
    stem: 'It was not until',
    answer: 'It was not until Priya reached home that she realised she had lost her phone.',
    alternates: [],
    explain: '"It was not until [time/event] that [main clause]" emphasises the lateness of a realisation or action. The main clause uses simple past tense. This structure is often used to highlight a delay.',
  },

  {
    id: 'st-adv-2',
    level: 'P6',
    skill: 'Advanced — No sooner had…than',
    skillKey: 'advancedConstruction',
    pattern: 'no sooner had…than (fronted)',
    original: 'He had barely switched off the lights when his phone rang.',
    stem: 'No sooner had he',
    answer: 'No sooner had he switched off the lights than his phone rang.',
    alternates: [],
    explain: '"No sooner had + subject + past participle + than + subject + simple past" places "no sooner" at the front for emphasis. Note that the past perfect is used in the first clause and simple past in the second.',
  },

  {
    id: 'st-adv-3',
    level: 'P6',
    skill: 'Advanced — Fronted negative adverb (Seldom)',
    skillKey: 'advancedConstruction',
    pattern: 'seldom / never / rarely + subject-verb inversion',
    original: 'She hardly ever complained about her difficulties.',
    stem: 'Seldom did',
    answer: 'Seldom did she complain about her difficulties.',
    alternates: ['Rarely did she complain about her difficulties.', 'Never did she complain about her difficulties.'],
    explain: 'When negative adverbs like "seldom", "rarely", or "never" are placed at the beginning of a sentence for emphasis, the subject and auxiliary verb must be inverted (like in a question): "Seldom did she…" not "Seldom she did…"',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL ITEMS — bringing total to 30+
  // ═══════════════════════════════════════════════════════════════════════════

  // Extra connector
  {
    id: 'st-conn-9',
    level: 'P4',
    skill: 'Connector — Contrast (although)',
    skillKey: 'connectorContrast',
    pattern: 'although / even though',
    original: 'The movie was long. The children did not get bored.',
    stem: 'Although the movie was long,',
    answer: 'Although the movie was long, the children did not get bored.',
    alternates: [
      'The children did not get bored although the movie was long.',
      'Even though the movie was long, the children did not get bored.',
    ],
    explain: '"Although" joins two contrasting ideas. The idea that is surprising or unexpected goes in the main clause. Do not use "but" with "although" in the same sentence.',
  },

  // Extra active → passive
  {
    id: 'st-pass-7',
    level: 'P5',
    skill: 'Active → Passive (modal — can)',
    skillKey: 'activeToPassive',
    pattern: 'modal passive (can be)',
    original: 'Pupils can borrow laptops from the library for home use.',
    stem: 'Laptops',
    answer: 'Laptops can be borrowed from the library by pupils for home use.',
    alternates: ['Laptops can be borrowed from the library for home use.'],
    explain: 'Use "can be + past participle" for modal passive. The agent ("by pupils") can be dropped if the sentence is clear without it.',
  },

  // Extra reported speech
  {
    id: 'st-rs-7',
    level: 'P6',
    skill: 'Reported Speech — Statement (time expression changes)',
    skillKey: 'reportedSpeechStatement',
    pattern: 'direct statement → reported speech',
    original: '"I finished the project three days ago," Maya told her mother.',
    stem: 'Maya told her mother',
    answer: 'Maya told her mother that she had finished the project three days before.',
    alternates: ['Maya told her mother that she had finished the project three days earlier.'],
    explain: 'In reported speech, "ago" changes to "before" or "earlier", and the verb shifts back one tense: "finished" (simple past) → "had finished" (past perfect).',
  },

  // Extra relative clause
  {
    id: 'st-rel-5',
    level: 'P5',
    skill: 'Relative Clause — which (non-defining)',
    skillKey: 'relativeClause',
    pattern: 'non-defining relative clause with which',
    original: 'The school won the National Green Award. This surprised everyone.',
    stem: 'The school won the National Green Award,',
    answer: 'The school won the National Green Award, which surprised everyone.',
    alternates: [],
    explain: 'A non-defining relative clause adds extra information and is separated by a comma. Use "which" (not "that") for non-defining clauses referring to a whole idea or thing.',
  },

  // Extra comparison
  {
    id: 'st-comp-4',
    level: 'P4',
    skill: 'Comparison — not as…as',
    skillKey: 'comparison',
    pattern: 'not as…as',
    original: 'The new canteen is smaller than the old one.',
    stem: 'The old canteen is',
    answer: 'The old canteen is not as small as the new one.',
    alternates: ['The new canteen is not as big as the old one.'],
    explain: '"Not as + adjective + as" shows that the first thing has less of that quality than the second. Make sure the adjective matches the comparison you are making.',
  },

  // Extra advanced construction
  {
    id: 'st-adv-4',
    level: 'P6',
    skill: 'Advanced — Fronted negative adverb (Never)',
    skillKey: 'advancedConstruction',
    pattern: 'seldom / never / rarely + subject-verb inversion',
    original: 'The champion had never lost a match in his entire career.',
    stem: 'Never',
    answer: 'Never had the champion lost a match in his entire career.',
    alternates: [],
    explain: 'Fronting "never" gives the sentence greater emphasis. Use past perfect after "never" when the original sentence is also past perfect: "had never lost" → "Never had he lost".',
  },

  // Extra connector — provided that
  {
    id: 'st-conn-10',
    level: 'P6',
    skill: 'Connector — Condition (provided that)',
    skillKey: 'connectorCondition',
    pattern: 'provided that',
    original: 'Students can use the computer lab after school. They must have a teacher\'s permission.',
    stem: 'Students can use the computer lab after school',
    answer: 'Students can use the computer lab after school provided that they have a teacher\'s permission.',
    alternates: ['Provided that they have a teacher\'s permission, students can use the computer lab after school.'],
    explain: '"Provided that" sets a condition that must be met for the main clause to be true. It is more formal than "if" and is commonly used in rules and notices.',
  },

  // Extra not only…but also (fronted)
  {
    id: 'st-conn-11',
    level: 'P6',
    skill: 'Connector — Addition (not only…but also, fronted)',
    skillKey: 'connectorAddition',
    pattern: 'not only…but also (fronted inversion)',
    original: 'The new sports complex is affordable. It is also conveniently located.',
    stem: 'Not only is',
    answer: 'Not only is the new sports complex affordable, but it is also conveniently located.',
    alternates: ['The new sports complex is not only affordable but also conveniently located.'],
    explain: 'When "not only" is fronted (moved to the beginning), invert the subject and auxiliary verb in the first clause: "Not only is the complex…". The second clause keeps normal word order.',
  },

  // Extra as soon as
  {
    id: 'st-conn-12',
    level: 'P4',
    skill: 'Connector — Time (as soon as)',
    skillKey: 'connectorTime',
    pattern: 'as soon as',
    original: 'The bell rang. All the pupils rushed out of the classroom immediately.',
    stem: 'As soon as the bell rang,',
    answer: 'As soon as the bell rang, all the pupils rushed out of the classroom.',
    alternates: ['All the pupils rushed out of the classroom as soon as the bell rang.'],
    explain: '"As soon as" means "at the very moment when". Both events are in the simple past when talking about past events. No comma is needed when "as soon as" is in the middle.',
  },

]);
