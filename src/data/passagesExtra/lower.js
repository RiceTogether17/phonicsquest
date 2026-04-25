function deriveClues(text, answers) {
  const parts = String(text || '').split('___');
  return answers.map((_, i) => {
    const left = String(parts[i] || '').trim().split(/\s+/).slice(-4).join(' ').replace(/[.,;:!?]+$/g, '').trim();
    const right = String(parts[i + 1] || '').trim().split(/\s+/).slice(0, 4).join(' ').replace(/[.,;:!?]+$/g, '').trim();
    const span = right || left || 'sentence context';
    return {
      blankIndex: i,
      prompt: 'Which words near this blank help you choose the grammar answer?',
      acceptableSpans: [span],
      partialSpans: span.split(/\s+/).slice(0, 2),
      clueType: 'grammar-context-clue',
      explanation: `The phrase "${span}" signals the grammar form that fits here.`,
    };
  });
}

function make(id, category, title, text, answers, wordBank, xp) {
  return { id, title, text, answers, wordBank, clues: deriveClues(text, answers), xp };
}

function buildLevel(levelKey, xp, specs) {
  const out = {};
  specs.forEach((s, idx) => {
    if (!out[s.category]) out[s.category] = [];
    const id = `gx-${levelKey.toLowerCase()}-${s.category}-${String(idx + 1).padStart(2, '0')}`;
    out[s.category].push(make(id, s.category, s.title, s.text, s.answers, s.wordBank, xp));
  });
  return out;
}

const P1_SPECS = [
  { category: 'articles', title: 'Recess Snack Choice', text: 'Nina bought ___ apple at recess. Her friend packed ___ bun from home. They shared ___ drink near the canteen stall.', answers: ['an', 'a', 'the'], wordBank: ['an', 'a', 'the', 'some', 'many'] },
  { category: 'pronouns', title: 'Library Helpers', text: 'Amir carried the books and ___ placed them on the trolley. Ms Tan thanked ___ before ___ checked the list.', answers: ['he', 'him', 'she'], wordBank: ['he', 'him', 'she', 'they', 'her'] },
  { category: 'svAgreement', title: 'Morning Duties', text: 'Every monitor ___ the board after assembly. The prefects ___ outside the hall. Each pupil ___ a class file.', answers: ['wipes', 'stand', 'has'], wordBank: ['wipes', 'stand', 'has', 'wipe', 'stands'] },
  { category: 'simplePast', title: 'School Garden Visit', text: 'Yesterday, we ___ bean seeds in small cups. Mei ___ labels for each cup. The class ___ proud of our neat work.', answers: ['planted', 'wrote', 'felt'], wordBank: ['planted', 'wrote', 'felt', 'plant', 'write'] },
  { category: 'tenseAwareness', title: 'Bus Stop Timing', text: 'Every morning, Dan ___ the bus at seven. Yesterday, he ___ it because he woke up late. Tomorrow, he ___ earlier.', answers: ['takes', 'missed', 'will wake'], wordBank: ['takes', 'missed', 'will wake', 'take', 'miss'] },
  { category: 'prepositions', title: 'Bag Arrangement', text: 'Put your bottle ___ the bag pocket. Stand ___ the class monitor and the vice-monitor. Keep your shoes ___ the bench.', answers: ['in', 'between', 'under'], wordBank: ['in', 'between', 'under', 'on', 'beside'] },
  { category: 'connectors', title: 'Rainy Recess Plan', text: 'It was raining, ___ we stayed in class. We played word games ___ everyone could join. We waited quietly ___ the bell rang.', answers: ['so', 'because', 'until'], wordBank: ['so', 'because', 'until', 'but', 'or'] },
  { category: 'modals', title: 'Classroom Rules', text: 'Pupils ___ walk in the corridor. You ___ run there. You ___ ask if you need help.', answers: ['must', 'must not', 'can'], wordBank: ['must', 'must not', 'can', 'could', 'should'] },
  { category: 'countableUncountable', title: 'Art Supplies', text: 'There are many ___ on the shelf. We need some ___ for painting. There is little ___ left in the glue bottle.', answers: ['brushes', 'paper', 'glue'], wordBank: ['brushes', 'paper', 'glue', 'waters', 'scissors'] },
  { category: 'possessives', title: 'Lost-and-Found Table', text: 'This is Ali___ water bottle. Those are the girls___ badges. The teacher returned the class___ football.', answers: ['’s', '’', '’'], wordBank: ['’s', '’', 'is', 'are', 'have'] },
];

const P2_SPECS = [
  { category: 'simplePast', title: 'Canteen Queue', text: 'The bell rang and pupils ___ to the canteen. I ___ my tray carefully. We ___ our seats before eating.', answers: ['walked', 'carried', 'found'], wordBank: ['walked', 'carried', 'found', 'walk', 'carry'] },
  { category: 'presentCont', title: 'Science Practical', text: 'The groups ___ water into beakers now. Jia ___ the stopwatch. I ___ the readings in my notebook.', answers: ['are pouring', 'is holding', 'am recording'], wordBank: ['are pouring', 'is holding', 'am recording', 'poured', 'holds'] },
  { category: 'svAgreement', title: 'Assembly Team', text: 'Each prefect ___ a duty card. The ushers ___ near the gate. Our principal ___ the briefing clearly.', answers: ['has', 'wait', 'explains'], wordBank: ['has', 'wait', 'explains', 'have', 'waits'] },
  { category: 'pronouns', title: 'PE Relay', text: 'Maya passed the baton and ___ cheered loudly. Coach praised ___ after the race. Later, ___ thanked our class.', answers: ['she', 'her', 'he'], wordBank: ['she', 'her', 'he', 'they', 'him'] },
  { category: 'prepositions', title: 'Library Route', text: 'Walk ___ the hall and turn left. The reading corner is ___ the window and the plant rack. Sit ___ the blue mat.', answers: ['across', 'between', 'on'], wordBank: ['across', 'between', 'on', 'under', 'into'] },
  { category: 'conjunctions', title: 'Group Poster', text: 'We used markers ___ colour pencils for the poster. Zhi kept writing ___ his hand was tired. We finished early ___ we planned well.', answers: ['and', 'although', 'because'], wordBank: ['and', 'although', 'because', 'or', 'but'] },
  { category: 'countableUncountable', title: 'Class Party', text: 'We prepared many ___ for guests. There was much ___ in the cooler. The teacher gave us a little ___ about safety.', answers: ['sandwiches', 'juice', 'advice'], wordBank: ['sandwiches', 'juice', 'advice', 'juices', 'advices'] },
  { category: 'comparatives', title: 'Sports Day Results', text: 'Team Red ran ___ than Team Blue. Kai jumped ___ than Ben. Our last race was the ___ event.', answers: ['faster', 'higher', 'longer'], wordBank: ['faster', 'higher', 'longer', 'fast', 'highest'] },
  { category: 'modals', title: 'After-School Plan', text: 'We ___ finish homework before games. You ___ borrow my ruler if needed. Pupils ___ shout in the library.', answers: ['should', 'can', 'must not'], wordBank: ['should', 'can', 'must not', 'would', 'could'] },
  { category: 'connectors', title: 'Rain Shelter', text: 'It was stormy, ___ CCA moved indoors. We stayed in the hall ___ the rain stopped. Everyone lined up calmly ___ teachers were guiding us.', answers: ['so', 'until', 'because'], wordBank: ['so', 'until', 'because', 'but', 'or'] },
];

const P3_SPECS = [
  { category: 'pastCont', title: 'Camp Preparation', text: 'At six, we ___ sleeping bags. Mei ___ the checklist. The teachers ___ the tents near the field.', answers: ['were folding', 'was reading', 'were checking'], wordBank: ['were folding', 'was reading', 'were checking', 'folded', 'reads'] },
  { category: 'tenseAwareness', title: 'Unexpected Call', text: 'I ___ my speech when the office called. Yesterday I ___ the final draft. Tomorrow I ___ a new paragraph.', answers: ['was practising', 'printed', 'will add'], wordBank: ['was practising', 'printed', 'will add', 'practise', 'print'] },
  { category: 'svAgreement', title: 'Class Diary', text: 'Each student ___ reflections weekly. The pages ___ neatly in a folder. Our teacher ___ comments every Friday.', answers: ['writes', 'are', 'adds'], wordBank: ['writes', 'are', 'adds', 'write', 'is'] },
  { category: 'connectors', title: 'Project Delay', text: '___ the printer jammed, we stayed calm. We revised our slides ___ waiting for help. The team succeeded ___ everyone cooperated.', answers: ['Although', 'while', 'because'], wordBank: ['Although', 'while', 'because', 'unless', 'so'] },
  { category: 'conditionals', title: 'Eco Challenge', text: 'If each class ___ one recycling box, we will collect more paper. If we ___ reminders daily, pupils will remember. If rain ___, we will move the booth inside.', answers: ['sets', 'give', 'starts'], wordBank: ['sets', 'give', 'starts', 'set', 'gave'] },
  { category: 'comparatives', title: 'Reading Graph', text: 'This month is ___ than last month for pages read. Lina read ___ than her brother. Our class scored the ___ in the level.', answers: ['better', 'more', 'highest'], wordBank: ['better', 'more', 'highest', 'good', 'most high'] },
  { category: 'superlatives', title: 'CCA Awards', text: 'Among all teams, ours was the ___ prepared. Ben gave the ___ speech in class. The science booth had the ___ queue.', answers: ['most', 'best', 'longest'], wordBank: ['most', 'best', 'longest', 'more', 'better'] },
  { category: 'pronouns', title: 'Museum Notes', text: 'The guide showed us old maps and ___ explained each route. We thanked ___ after the tour. Later, ___ shared our notes with classmates.', answers: ['he', 'him', 'we'], wordBank: ['he', 'him', 'we', 'they', 'her'] },
  { category: 'quantifiers', title: 'Book Donation', text: '___ students brought storybooks for donation. There was ___ space left on the shelf. We needed ___ boxes from the office.', answers: ['Many', 'little', 'a few'], wordBank: ['Many', 'little', 'a few', 'much', 'fewest'] },
  { category: 'mixedGrammar', title: 'Oral Practice Day', text: 'If we ___ cue cards, we will speak more confidently. Ms Goh said that we ___ practise eye contact. During rehearsal, Jian ___ taking notes for our team.', answers: ['prepare', 'should', 'was'], wordBank: ['prepare', 'should', 'was', 'prepared', 'must'] },
];

export const lowerPassagesExtra = {
  P1: buildLevel('P1', 24, P1_SPECS),
  P2: buildLevel('P2', 28, P2_SPECS),
  P3: buildLevel('P3', 32, P3_SPECS),
};
