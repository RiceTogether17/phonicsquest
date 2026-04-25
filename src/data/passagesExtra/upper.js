function deriveClues(text, answers) {
  const parts = String(text || '').split('___');
  return answers.map((_, i) => {
    const left = String(parts[i] || '').trim().split(/\s+/).slice(-4).join(' ').replace(/[.,;:!?]+$/g, '').trim();
    const right = String(parts[i + 1] || '').trim().split(/\s+/).slice(0, 4).join(' ').replace(/[.,;:!?]+$/g, '').trim();
    const span = right || left || 'sentence context';
    return {
      blankIndex: i,
      prompt: 'Identify the phrase that gives the grammar clue for this blank.',
      acceptableSpans: [span],
      partialSpans: span.split(/\s+/).slice(0, 2),
      clueType: 'grammar-context-clue',
      explanation: `The phrase "${span}" is the key evidence for this grammar choice.`,
    };
  });
}

function make(id, title, text, answers, wordBank, xp) {
  return { id, title, text, answers, wordBank, clues: deriveClues(text, answers), xp };
}

function buildLevel(levelKey, xp, specs) {
  const out = {};
  specs.forEach((s, idx) => {
    if (!out[s.category]) out[s.category] = [];
    out[s.category].push(make(`gx-${levelKey.toLowerCase()}-${s.category}-${String(idx + 1).padStart(2, '0')}`, s.title, s.text, s.answers, s.wordBank, xp));
  });
  return out;
}

const P4_SPECS = [
  { category: 'futureTense', title: 'Camp Packing List', text: 'Tomorrow we ___ at school by seven. Our team ___ food labels before breakfast. The teachers ___ safety checks after assembly.', answers: ['will meet', 'will sort', 'will conduct'], wordBank: ['will meet', 'will sort', 'will conduct', 'met', 'sorted'] },
  { category: 'presentPerfect', title: 'Revision Tracker', text: 'I ___ three chapters this week. Our class ___ two timed practices already. The coach ___ us clear feedback.', answers: ['have completed', 'has done', 'has given'], wordBank: ['have completed', 'has done', 'has given', 'completed', 'give'] },
  { category: 'modals', title: 'Leadership Brief', text: 'Class leaders ___ report incidents quickly. Monitors ___ skip duty without informing teachers. We ___ ask politely before using equipment.', answers: ['must', 'must not', 'should'], wordBank: ['must', 'must not', 'should', 'can', 'could'] },
  { category: 'quantifiers', title: 'Science Fair Booth', text: '___ visitors asked about our prototype. There was ___ time left before judging. We still had ___ flyers to distribute.', answers: ['Many', 'little', 'a few'], wordBank: ['Many', 'little', 'a few', 'much', 'fewest'] },
  { category: 'prepositions', title: 'Public Transport Route', text: 'We waited ___ the bus interchange gate. The class sat ___ the front and middle sections. Bags stayed ___ the seats during the ride.', answers: ['at', 'between', 'under'], wordBank: ['at', 'between', 'under', 'into', 'on'] },
  { category: 'relativeClauses', title: 'Museum Reflection', text: 'The exhibit ___ taught us about trade routes was interactive. The curator ___ notes were detailed answered our questions. The gallery ___ we sketched was crowded.', answers: ['that', 'whose', 'where'], wordBank: ['that', 'whose', 'where', 'who', 'whom'] },
  { category: 'superlatives', title: 'CCA Trial Results', text: 'Our relay team gave the ___ performance this term. Mei solved the puzzle in the ___ time. The coach called it the ___ drill so far.', answers: ['best', 'shortest', 'most disciplined'], wordBank: ['best', 'shortest', 'most disciplined', 'better', 'shorter'] },
  { category: 'conjunctions', title: 'Composition Workshop', text: 'We outlined the plot ___ drafted the opening paragraph. Kai revised the ending ___ he was tired. The group succeeded ___ everyone listened.', answers: ['and', 'although', 'because'], wordBank: ['and', 'although', 'because', 'or', 'unless'] },
  { category: 'mixedGrammar', title: 'Neighbourhood Project', text: 'By Friday, we ___ collected interview notes. If residents ___ feedback, we will improve our plan. Ms Lee said the report ___ be submitted online.', answers: ['had', 'share', 'must'], wordBank: ['had', 'share', 'must', 'have', 'shared'] },
  { category: 'futureTense', title: 'Oral Exam Week', text: 'Next Monday, I ___ a full mock oral. My partner ___ cue cards tonight. Our teacher ___ the scoring rubric tomorrow.', answers: ['will attempt', 'will prepare', 'will explain'], wordBank: ['will attempt', 'will prepare', 'will explain', 'attempted', 'prepares'] },
];

const P5_SPECS = [
  { category: 'presentPerfect', title: 'Exam Revision Log', text: 'We ___ three mock papers this month. Jia ___ her mistakes in a notebook. Our tutor ___ us on weak sections.', answers: ['have finished', 'has recorded', 'has coached'], wordBank: ['have finished', 'has recorded', 'has coached', 'finished', 'record'] },
  { category: 'pastPerfect', title: 'Before the Briefing', text: 'By the time the principal arrived, the committee ___ the slides. The emcee ___ the script twice. We ___ all microphones.', answers: ['had finalised', 'had rehearsed', 'had tested'], wordBank: ['had finalised', 'had rehearsed', 'had tested', 'finalised', 'has tested'] },
  { category: 'passiveVoice', title: 'Science Showcase', text: 'The prototypes ___ displayed in the hall. Each label ___ checked by the judges. Extra notes ___ uploaded after school.', answers: ['were', 'was', 'were'], wordBank: ['were', 'was', 'were', 'are', 'is'] },
  { category: 'conditionals', title: 'Study Plan Choices', text: 'If we ___ our revision timetable, we will stay on track. If I ___ earlier yesterday, I would have slept more. If teams ___ clearer goals, progress would improve.', answers: ['follow', 'had started', 'set'], wordBank: ['follow', 'had started', 'set', 'follows', 'start'] },
  { category: 'reportedSpeech', title: 'Teacher Conference', text: 'Ms Lim said that the oral exam ___ begin at eight. She told us that we ___ annotate key points. She added that we ___ stay calm.', answers: ['would', 'should', 'must'], wordBank: ['would', 'should', 'must', 'will', 'can'] },
  { category: 'countableUncountable', title: 'Canteen Survey', text: 'There was much ___ about healthier meals. A large ___ of pupils voted online. Only a little ___ remained by noon.', answers: ['feedback', 'number', 'juice'], wordBank: ['feedback', 'number', 'juice', 'numbers', 'juices'] },
  { category: 'comparatives', title: 'Timed Practice Review', text: 'This paper was ___ than last week\'s. Ben answered ___ than before. Our weakest section became ___ after practice.', answers: ['harder', 'faster', 'stronger'], wordBank: ['harder', 'faster', 'stronger', 'hard', 'strongest'] },
  { category: 'mixedGrammar', title: 'Leadership Reflection', text: 'If we ___ responsibilities clearly, meetings run smoothly. The minutes ___ uploaded by the secretary yesterday. Our vice-captain said everyone ___ contributed well.', answers: ['divide', 'were', 'had'], wordBank: ['divide', 'were', 'had', 'divided', 'was'] },
  { category: 'presentPerfect', title: 'Reading Marathon', text: 'I ___ six chapters since Monday. My friend ___ summaries after each chapter. We ___ our vocabulary lists together.', answers: ['have read', 'has written', 'have compared'], wordBank: ['have read', 'has written', 'have compared', 'read', 'writes'] },
  { category: 'passiveVoice', title: 'Community Event Booth', text: 'The donation boxes ___ placed near the entrance. A poster ___ designed by our class. Final reminders ___ sent to volunteers.', answers: ['were', 'was', 'were'], wordBank: ['were', 'was', 'were', 'is', 'are'] },
];

const P6_SPECS = [
  { category: 'passiveVoice', title: 'PSLE Briefing Notes', text: 'The schedule ___ announced during assembly. Updated instructions ___ shared with parents. Revision packs ___ distributed before dismissal.', answers: ['was', 'were', 'were'], wordBank: ['was', 'were', 'were', 'is', 'are'] },
  { category: 'reportedSpeech', title: 'Consultation Advice', text: 'Mr Goh said that we ___ revise by topic. He told us that each answer ___ include evidence. He reminded us that confidence ___ grow with practice.', answers: ['should', 'must', 'would'], wordBank: ['should', 'must', 'would', 'can', 'will'] },
  { category: 'conditionals', title: 'Final Revision Strategy', text: 'If I ___ distractions, I would finish earlier. If we ___ harder last month, this section would feel easier. If the class ___ a shared checklist, fewer tasks are missed.', answers: ['reduced', 'had practised', 'keeps'], wordBank: ['reduced', 'had practised', 'keeps', 'reduce', 'kept'] },
  { category: 'relativeClauses', title: 'Community Proposal Draft', text: 'The plan ___ our team submitted was approved. The mentor ___ guidance helped us refine details was encouraging. The hall ___ we presented was full.', answers: ['that', 'whose', 'where'], wordBank: ['that', 'whose', 'where', 'which', 'whom'] },
  { category: 'inversion', title: 'Rarely and Only', text: 'Rarely ___ students get such detailed feedback. Only after we checked twice ___ we submit the final copy. Never ___ the team ignore the deadline.', answers: ['do', 'did', 'does'], wordBank: ['do', 'did', 'does', 'is', 'are'] },
  { category: 'quantifiers', title: 'Final Week Planning', text: '___ of the revision tasks were completed before Friday. There was ___ room for error in this paper. We still needed ___ examples for section B.', answers: ['Most', 'little', 'a few'], wordBank: ['Most', 'little', 'a few', 'many', 'much'] },
  { category: 'perfectContinuousTenses', title: 'Long-Term Preparation', text: 'I ___ revising vocabulary since January. By March, we ___ completed two mock papers. Our tutor ___ analysing common errors when we arrived.', answers: ['have been', 'had', 'was'], wordBank: ['have been', 'had', 'was', 'has been', 'were'] },
  { category: 'mixedGrammar', title: 'Exam Readiness Check', text: 'If we ___ calm during the paper, we will think clearly. The answer scripts ___ checked by two teachers. Our form teacher said we ___ done enough practice.', answers: ['stay', 'were', 'had'], wordBank: ['stay', 'were', 'had', 'stayed', 'was'] },
  { category: 'conditionals', title: 'After-Action Review', text: 'If the team ___ earlier, we would have avoided the rush. If I ___ more examples, my explanation would be stronger. If everyone ___ focused, revision time improves.', answers: ['had started', 'had used', 'stays'], wordBank: ['had started', 'had used', 'stays', 'start', 'stay'] },
  { category: 'relativeClauses', title: 'Transport Survey Report', text: 'The route ___ many pupils use is often crowded. The officer ___ response we recorded thanked our class. The stop ___ we interviewed commuters was near school.', answers: ['that', 'whose', 'where'], wordBank: ['that', 'whose', 'where', 'which', 'who'] },
];

export const upperPassagesExtra = {
  P4: buildLevel('P4', 38, P4_SPECS),
  P5: buildLevel('P5', 44, P5_SPECS),
  P6: buildLevel('P6', 52, P6_SPECS),
};
