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
  { category: 'possessives', title: 'Lost-and-Found Table', text: 'This is Ali___ water bottle. Those are the girls___ badges. The teacher returned the class___ football.', answers: ['’s', '’', '’'], wordBank: ['’s', '’', '’', 'is', 'are', 'have'] },
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
  { category: 'connectors', title: 'Library Buddy Day', text: 'Mei sorted the storybooks, ___ I checked the labels carefully. The librarian was busy, ___ we worked quietly. We finished tidying the shelf ___ the lunch bell rang.', answers: ['and', 'so', 'before'], wordBank: ['and', 'so', 'before', 'but', 'or'] },
  { category: 'connectors', title: 'Hawker Centre Visit', text: 'We washed our hands ___ collecting our trays. We lined up at the noodle stall ___ chose our food. ___ eating, we cleared our plates at the tray station.', answers: ['before', 'and', 'After'], wordBank: ['before', 'and', 'After', 'because', 'so'] },
  { category: 'connectors', title: 'Bag Pack Time', text: "I packed my pencil case ___ checked my homework folder. I forgot my ruler, ___ I borrowed Sara's. We left the classroom ___ the bell rang.", answers: ['and', 'so', 'after'], wordBank: ['and', 'so', 'after', 'but', 'or'] },
  { category: 'connectors', title: 'PE Warm-Up', text: 'Coach blew the whistle ___ we lined up neatly. We stretched first, ___ jogged around the field. Marvin felt tired ___ he kept going.', answers: ['and', 'then', 'but'], wordBank: ['and', 'then', 'but', 'so', 'or'] },
  { category: 'connectors', title: 'Recycling Bin Race', text: 'Our class collected paper ___ plastic bottles for the contest. We sorted them quickly ___ the time was short. We packed the last bag ___ the timer beeped.', answers: ['and', 'because', 'before'], wordBank: ['and', 'because', 'before', 'after', 'so'] },
  { category: 'prepositions', title: 'Walk to Class', text: 'I walked ___ the classroom together with my partner. The teacher chatted ___ the parents at the gate. We arrived just ___ assembly began.', answers: ['to', 'with', 'before'], wordBank: ['to', 'with', 'before', 'after', 'from'] },
  { category: 'prepositions', title: 'Lunch Routine', text: 'We washed our hands ___ playing in the field. I shared my snack ___ Mira at the canteen. The juice came ___ the school stall.', answers: ['after', 'with', 'from'], wordBank: ['after', 'with', 'from', 'before', 'to'] },
  { category: 'prepositions', title: 'Letter to Cousin', text: 'I wrote a letter ___ my cousin in Penang. I shared the letter ___ my brother first. I posted it ___ school on Friday.', answers: ['to', 'with', 'after'], wordBank: ['to', 'with', 'after', 'before', 'from'] },
  { category: 'prepositions', title: 'Class Trip Bus', text: 'Our bus drove ___ the museum after lunch. We carried bottles ___ the school cafeteria. The teacher gave instructions ___ entering the bus.', answers: ['to', 'from', 'before'], wordBank: ['to', 'from', 'before', 'after', 'with'] },
  { category: 'prepositions', title: 'Reading Buddy Time', text: 'Year 1 pupils came ___ our classroom for reading. Each buddy paired ___ a partner quietly. We returned ___ assembly together at the end.', answers: ['to', 'with', 'after'], wordBank: ['to', 'with', 'after', 'before', 'from'] },
  { category: 'comparatives', title: 'Garden Plants', text: 'The sunflower grew ___ than the rose bush. My bean plant is ___ than yours. The garden bed feels ___ today than yesterday.', answers: ['taller', 'wider', 'cooler'], wordBank: ['taller', 'wider', 'cooler', 'tall', 'wide'] },
  { category: 'comparatives', title: 'Pencil Case Comparison', text: 'My new pencil case is ___ than my old one. The zip is ___ to open than before. The pouch inside feels ___ than I expected.', answers: ['bigger', 'easier', 'softer'], wordBank: ['bigger', 'easier', 'softer', 'big', 'easy'] },
  { category: 'comparatives', title: 'Reading Race', text: 'Sara read ___ than Ali in our reading race. My book has ___ pages than hers. The story felt ___ to follow than the last one.', answers: ['faster', 'more', 'simpler'], wordBank: ['faster', 'more', 'simpler', 'fast', 'most'] },
  { category: 'comparatives', title: 'Snack Sharing', text: "This biscuit tastes ___ than yesterday's. The juice is ___ than water in the cooler. My apple feels ___ than the one I ate this morning.", answers: ['sweeter', 'colder', 'crunchier'], wordBank: ['sweeter', 'colder', 'crunchier', 'sweet', 'cold'] },
  { category: 'comparatives', title: 'PE Stations', text: 'The skipping rope was ___ than the hula hoop. The beanbag throw is ___ than the ball toss. I felt ___ after the warm-up than before.', answers: ['lighter', 'easier', 'stronger'], wordBank: ['lighter', 'easier', 'stronger', 'light', 'easy'] },
  { category: 'articles', title: 'New Pencil Case', text: 'I bought ___ pencil case at the bookshop. ___ pencil case has dragon stickers on the front. I also got ___ eraser to put inside.', answers: ['a', 'The', 'an'], wordBank: ['a', 'The', 'an', 'the', 'A'] },
  { category: 'articles', title: 'Lost Water Bottle', text: 'Mei found ___ water bottle near the gate. ___ water bottle had her name on it. She also picked up ___ umbrella from the same spot.', answers: ['a', 'The', 'an'], wordBank: ['a', 'The', 'an', 'the', 'A'] },
  { category: 'articles', title: 'Library Visit', text: 'I borrowed ___ storybook and ___ activity book from the library. ___ storybook has colourful pictures inside.', answers: ['a', 'an', 'The'], wordBank: ['a', 'an', 'The', 'the', 'A'] },
  { category: 'articles', title: 'Snack Box Treat', text: 'Mum packed ___ orange and ___ biscuit in my snack box. ___ orange was sweet and juicy. I shared ___ biscuit with my friend.', answers: ['an', 'a', 'The', 'the'], wordBank: ['an', 'a', 'The', 'the', 'A'] },
  { category: 'articles', title: 'Class Pet', text: 'Our class has ___ rabbit named Snowy. ___ rabbit lives in a small cage. We feed ___ rabbit with carrots and lettuce every afternoon.', answers: ['a', 'The', 'the'], wordBank: ['a', 'The', 'the', 'an', 'A'] },
  { category: 'articles', title: 'Sports Day Story', text: 'There was ___ exciting race on the field. ___ race had ten runners from our level. Our class collected ___ trophy at the end of the day.', answers: ['an', 'The', 'a'], wordBank: ['an', 'The', 'a', 'the', 'A'] },
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
  { category: 'connectors', title: 'Spelling Bee Tryouts', text: 'We arrived early ___ the auditions could start on time. ___ Ms Lee called my name, my hands were shaking. I felt confident ___ I had practised every night.', answers: ['so', 'When', 'because'], wordBank: ['so', 'When', 'because', 'until', 'although'] },
  { category: 'connectors', title: 'Class Photo Day', text: '___ the photographer adjusted the lights, we tidied our uniforms. The teacher reminded us to smile ___ the camera was ready. We posed twice ___ the first picture was blurry.', answers: ['While', 'when', 'because'], wordBank: ['While', 'when', 'because', 'after', 'so'] },
  { category: 'connectors', title: 'Healthy Plate Talk', text: 'Auntie Wati explained that we should drink water ___ we feel thirsty. She showed us a balanced plate ___ we could choose better food. We listened carefully ___ the topic was important.', answers: ['when', 'so', 'because'], wordBank: ['when', 'so', 'because', 'although', 'until'] },
  { category: 'connectors', title: 'Library Mystery Book', text: 'I waited at the counter ___ the librarian found the book. ___ I opened the cover, an old bookmark fell out. I felt curious ___ the bookmark had Chinese characters.', answers: ['until', 'When', 'because'], wordBank: ['until', 'When', 'because', 'unless', 'while'] },
  { category: 'connectors', title: 'Drama Club Auditions', text: 'I read my lines slowly ___ the teacher could hear every word. ___ I forgot a sentence, I took a deep breath and continued. I kept practising ___ I felt confident.', answers: ['so', 'When', 'until'], wordBank: ['so', 'When', 'until', 'before', 'although'] },
  { category: 'tenseAwareness', title: 'Library Project Update', text: 'I ___ my notes right now. Our team ___ the rough plan yesterday. We ___ the final draft tomorrow.', answers: ['am organising', 'completed', 'will submit'], wordBank: ['am organising', 'completed', 'will submit', 'organised', 'submit'] },
  { category: 'tenseAwareness', title: 'Weekend Plans', text: 'We ___ the wet market every Saturday with grandma. We ___ a new fruit stall last weekend. We ___ a different route next time.', answers: ['visit', 'tried', 'will explore'], wordBank: ['visit', 'tried', 'will explore', 'visited', 'try'] },
  { category: 'tenseAwareness', title: 'Music Practice Routine', text: 'Lina ___ her violin scales at this moment. She ___ a small recital at home last week. She ___ for the school concert next month.', answers: ['is practising', 'performed', 'will audition'], wordBank: ['is practising', 'performed', 'will audition', 'practised', 'auditions'] },
  { category: 'tenseAwareness', title: 'Pet Care Diary', text: 'I ___ my puppy by the door right now. The vet ___ him for a check-up yesterday. My sister ___ him to the groomer tomorrow.', answers: ['am feeding', 'examined', 'will take'], wordBank: ['am feeding', 'examined', 'will take', 'feeds', 'taken'] },
  { category: 'tenseAwareness', title: 'Class Projector Drama', text: 'The projector ___ during our lesson earlier today. Our prefect ___ the spare cable yesterday. The ICT teacher ___ a new bulb tomorrow.', answers: ['froze', 'fetched', 'will install'], wordBank: ['froze', 'fetched', 'will install', 'freezes', 'fetches'] },
  { category: 'articles', title: 'School Routine', text: 'Every morning I go to school early. I carry ___ small bag and ___ apple in my hand. ___ apple is for my recess break.', answers: ['a', 'an', 'The'], wordBank: ['a', 'an', 'The', 'the', 'A'] },
  { category: 'articles', title: 'After-School Snack', text: 'Mum prepares ___ snack when I get home from school. Today she made ___ sandwich for me. ___ sandwich was filled with ham and cheese.', answers: ['a', 'a', 'The'], wordBank: ['a', 'a', 'The', 'an', 'the'] },
  { category: 'articles', title: 'Before Bed', text: 'I brush my teeth before going to bed every night. I read ___ short story under the lamp. Tonight I picked ___ adventure book about ___ brave knight.', answers: ['a', 'an', 'a'], wordBank: ['a', 'a', 'an', 'the', 'The'] },
  { category: 'articles', title: 'Sports Practice', text: 'Our team plays football every Tuesday after school. Coach brings ___ whistle and ___ stopwatch to the field. ___ whistle is very loud.', answers: ['a', 'a', 'The'], wordBank: ['a', 'a', 'The', 'an', 'the'] },
  { category: 'articles', title: 'Breakfast Story', text: 'We eat breakfast at the dining table together. Today, dad cooked ___ omelette. He also fried ___ sausage on the side. ___ sausage was crispy and tasty.', answers: ['an', 'a', 'The'], wordBank: ['an', 'a', 'The', 'the', 'A'] },
  { category: 'articles', title: 'Library Quiet Time', text: 'Pupils read in silence at school every Wednesday afternoon. I borrowed ___ comic book about ___ astronaut. ___ comic was hilarious.', answers: ['a', 'an', 'The'], wordBank: ['a', 'an', 'The', 'the', 'A'] },
  { category: 'quantifiers', title: 'Class Garden Update', text: '___ classmates volunteered to water the plants this week. There was ___ rain over the holiday. Only ___ tomatoes survived after the heavy storm.', answers: ['Many', 'a little', 'a few'], wordBank: ['Many', 'a little', 'a few', 'much', 'fewest'] },
  { category: 'quantifiers', title: 'Lunch Counter', text: 'There was ___ noodle soup left after recess. ___ pupils still wanted seconds. The auntie gave us ___ extra bowls to share.', answers: ['a little', 'Many', 'a few'], wordBank: ['a little', 'Many', 'a few', 'much', 'few'] },
  { category: 'quantifiers', title: 'School Library Visit', text: 'There were ___ new books on the shelf this week. The librarian gave only ___ stickers as rewards. We had ___ time before the bell rang.', answers: ['many', 'a few', 'a little'], wordBank: ['many', 'a few', 'a little', 'much', 'few'] },
  { category: 'quantifiers', title: 'Recess Snacks', text: 'I had ___ biscuits in my snack box. There was ___ jam left in the small jar. ___ classmates shared their crackers with me at the bench.', answers: ['many', 'a little', 'A few'], wordBank: ['many', 'a little', 'A few', 'much', 'few'] },
  { category: 'quantifiers', title: 'Art Supplies', text: 'We needed ___ markers for the class poster. The cupboard had ___ paint left at the back. ___ pupils brought their own scissors from home.', answers: ['many', 'a little', 'A few'], wordBank: ['many', 'a little', 'A few', 'much', 'few'] },
];

export const lowerPassagesExtra = {
  P1: buildLevel('P1', 24, P1_SPECS),
  P2: buildLevel('P2', 28, P2_SPECS),
  P3: buildLevel('P3', 32, P3_SPECS),
};
