/**
 * PhonicsQuest – Primary 6 practice papers laid out like Paper 2
 *
 * Four papers that follow the Paper 2 (Language Use and Comprehension)
 * layout: two booklets, nine sections, 90 marks, 1 h 50 min.
 *
 *   Booklet A (multiple choice, 25 marks)
 *     A  Grammar                      10 questions  10 marks
 *     B  Vocabulary                    5 questions   5 marks
 *     C  Vocabulary Cloze              5 questions   5 marks
 *     D  Visual Text Comprehension     5 questions   5 marks
 *   Booklet B (written, 65 marks)
 *     E  Grammar Cloze                10 blanks     10 marks
 *     F  Editing                      10 corrections 10 marks
 *     G  Comprehension Cloze          15 blanks     15 marks
 *     H  Synthesis & Transformation    5 questions  10 marks
 *     I  Comprehension (open-ended)   10 questions  20 marks
 *
 * Each paper is built on the matching term paper in `p6PracticeTests.js`:
 * the grammar, vocabulary, grammar cloze, editing and synthesis sections are
 * shared, and this file adds what the layout needs and the term papers do
 * not have — a vocabulary cloze, a visual text section, five more cloze
 * blanks, and enough comprehension questions for ten at two marks each.
 *
 * ## What this is, and is not
 *
 * The four component figures `examBlueprints.js` records for Paper 2
 * (Vocabulary Cloze 5, Visual Text 5, Comprehension Cloze 15, open-ended
 * Comprehension 20) and the paper total of 90 are matched exactly, and a test
 * holds them to it. The remaining component marks are not in that blueprint
 * yet, so `certifyAgainstBlueprint` still refuses and no paper here is
 * labelled as being in the official format. A score here covers Paper 2
 * only: Writing, Listening and Oral are separate papers.
 */

import { P6_PRACTICE_TESTS } from './p6PracticeTests.js';
import { VISUAL_TEXT_ITEMS } from './visualTextItems.js';
import { checkMcqItems } from './practiceTestValidators.js';

/** Shown wherever a score from these papers is reported. */
export const P6_PAPER2_ALIGNMENT = Object.freeze({
  format: 'paper-2-layout',
  formatLabel: 'Paper 2 layout practice',
  matchesOfficialFormat: false,
  comparedAgainst: 'SEAB-2026',
  differences: Object.freeze([
    'Covers Paper 2 only: Paper 1 (Writing), Listening and Oral are not included',
    'Open-ended comprehension is two marks for every question',
    'Typed answers are checked against key ideas, so long answers may need a grown-up to confirm',
  ]),
  scoreCaveat:
    'Practice score on a paper laid out like Paper 2 (90 marks). Writing, Listening ' +
    'and Oral are separate papers, so this is not a PSLE readiness figure.',
});

export const P6_PAPER2_TERMS = Object.freeze(['T1', 'T2', 'T3', 'T4']);

const mcq = (q, choices, answer, explain, skill) => ({ q, choices, answer, explain, skill });

/** A word-meaning question on an underlined word in the vocabulary cloze. */
const vc = (n, word, choices, answer) =>
  mcq(
    `(${n}) Which is closest in meaning to "${word}" as it is used in the passage?`,
    choices,
    answer,
    `In this passage "${word}" means "${answer}".`,
    'contextInference',
  );

const short = (pos, type, q, model, requiredGroups, extra = {}) => ({
  pos,
  type,
  marks: 2,
  q,
  model,
  ...(requiredGroups ? { requiredGroups, keywords: requiredGroups.flat() } : {}),
  ...extra,
});

/**
 * What each paper adds to its term paper.
 *
 * `vocabCloze.text` marks the five tested words as `{{n:word}}`.
 * `clozeExtra` continues the term paper's comprehension cloze from blank 11.
 * `comprehension` questions carry `pos`: where they sit among the term
 * paper's own questions (which keep positions 0, 1, 2, ...), so the ten
 * questions follow the passage in order.
 */
const ADDITIONS = {
  T1: {
    theme: 'nature and conservation',
    vocabCloze: {
      text:
        'When the tide goes out at the wetland, a {{1:remarkable}} world is revealed. Crabs {{2:scurry}} across the mudflats while herons wait patiently in the shallows. Volunteers guide visitors along the boardwalk, reminding them not to {{3:disturb}} the animals. Years ago, plans to build on the land were {{4:shelved}} after the public spoke up for the wetland. Today it remains a {{5:sanctuary}} for hundreds of species.',
      items: [
        vc(1, 'remarkable', ['extraordinary', 'enormous', 'dangerous', 'familiar'], 'extraordinary'),
        vc(2, 'scurry', ['scamper', 'stroll', 'tumble', 'glide'], 'scamper'),
        vc(3, 'disturb', ['bother', 'feed', 'photograph', 'follow'], 'bother'),
        vc(4, 'shelved', ['put aside', 'announced', 'completed', 'improved'], 'put aside'),
        vc(5, 'sanctuary', ['refuge', 'market', 'exhibit', 'barrier'], 'refuge'),
      ],
    },
    visual: {
      id: 'vt-schedule-P6-18',
      items: [
        mcq('Which of these activities must be registered for before the carnival?', ['Art workshop', 'Drama Club showcase', 'Obstacle course', 'Choir concert'], 'Art workshop', 'The note says Hall B workshops require pre-registration, and the Art workshop is in Hall B.', 'visualText'),
        mcq('A parent arrives at 2:45 p.m. Which of these can she still watch?', ['the finals of the games', 'the choir concert', 'the tug-of-war heats', 'the opening ceremony'], 'the finals of the games', 'The finals start at 2:30 p.m. and the next item on the field is at 3:30 p.m. The other three are over.', 'visualText'),
        mcq('At which of these times is nothing happening in Hall B?', ['9:00 a.m.', '11:00 a.m.', '1:00 p.m.', '3:30 p.m.'], '9:00 a.m.', 'The Hall B column shows a dash at 9:00 a.m.', 'visualText'),
        mcq('What is the main purpose of the note at the bottom of the schedule?', ['to tell readers how to get a place in a workshop', 'to advertise the school office', 'to explain why there is a lunch break', 'to thank the organisers'], 'to tell readers how to get a place in a workshop', 'It says workshops need pre-registration and where and by when to register.', 'visualText'),
        mcq('Which statement is true?', ['Every venue stops for lunch at the same time.', 'The carnival ends with the school band concert.', 'The Art workshop is open to pupils of all ages.', 'Games on the field begin with the tug-of-war heats.'], 'Every venue stops for lunch at the same time.', 'All three columns show a lunch break at 12:00 p.m.', 'visualText'),
      ],
    },
    clozeExtra: {
      text:
        ' Ordinary people can help {{11}} well. Choosing sunscreen that does not harm corals, eating seafood {{12}} has been caught responsibly and refusing to buy souvenirs made {{13}} coral all make a difference. Small {{14}} these actions may seem, they add up when millions of people take them. After all, a reef that has taken thousands of years to grow can be destroyed {{15}} a single careless season.',
      answers: ['as', 'that', 'from', 'as', 'in'],
      accept: [['as'], ['that', 'which'], ['from', 'of'], ['as', 'though'], ['in', 'within', 'during']],
    },
    comprehension: {
      fix: [['Do you think Dr Nair is', 'Do you think Dr Chong is']],
      add: [
        short(0.5, 'inference', 'Why are coral reefs called the "rainforests of the sea"? Use information from paragraph 1.', 'Like rainforests, they take up very little space (less than one percent of the ocean floor) yet support a huge share of living things (about a quarter of all marine species).', [['one percent', 'small', 'little space', 'tiny', 'less than'], ['twenty-five percent', 'quarter', '25', 'many species', 'marine species']]),
        short(3.5, 'factual', 'From paragraph 3, explain how land reclamation and boat traffic harm corals.', 'They stir up sediment that clouds the water and blocks the sunlight that corals need for photosynthesis.', [['sediment', 'cloud', 'murky', 'dirty'], ['sunlight', 'light', 'photosynthesis']]),
        short(4.5, 'vocabulary', 'Which word in paragraph 4 tells you that the early results give reason to be hopeful?', 'promising', null, { acceptable: ['promising'] }),
      ],
    },
  },
  T2: {
    theme: 'technology and media',
    vocabCloze: {
      text:
        'Mr Lim was {{1:sceptical}} when his grandson offered to teach him to make a video call. He had always been {{2:reluctant}} to try new gadgets. After a few {{3:clumsy}} attempts, however, a familiar face appeared on the screen. His sister, who had {{4:emigrated}} to Canada thirty years ago, waved at him. From that day on, the weekly calls became a {{5:cherished}} routine.',
      items: [
        vc(1, 'sceptical', ['doubtful', 'excited', 'angry', 'curious'], 'doubtful'),
        vc(2, 'reluctant', ['unwilling', 'unable', 'eager', 'afraid'], 'unwilling'),
        vc(3, 'clumsy', ['awkward', 'careful', 'quick', 'secret'], 'awkward'),
        vc(4, 'emigrated', ['moved abroad to live', 'gone on holiday', 'returned home', 'been sent away'], 'moved abroad to live'),
        vc(5, 'cherished', ['treasured', 'tiring', 'expensive', 'strict'], 'treasured'),
      ],
    },
    visual: {
      id: 'vt-infographic-P6-21',
      items: [
        mcq('On average, how many more hours do the children spend on screens on a weekend day than on a school day?', ['2.9 hours', '3.2 hours', '6.1 hours', '9.3 hours'], '2.9 hours', '6.1 hours minus 3.2 hours is 2.9 hours.', 'visualText'),
        mcq('Which health effect was reported by more than half, but fewer than two-thirds, of the children?', ['Difficulty sleeping', 'Eye strain', 'Reduced physical activity', 'Difficulty concentrating in school'], 'Difficulty sleeping', '54% is more than half and less than two-thirds. Eye strain, at 68%, is more than two-thirds.', 'visualText'),
        mcq('According to the study, children with less than two hours of screen time a day', ['scored higher on reading tests', 'slept fifteen percent longer', 'did not suffer from eye strain', 'spent more time outdoors'], 'scored higher on reading tests', 'They scored 15% higher on standardised reading tests than those with more than five hours.', 'visualText'),
        mcq('A family keeps all phones away from the dinner table. Which recommendation are they following?', ['Recommendation 1', 'Recommendation 2', 'Recommendation 3', 'None of them'], 'Recommendation 1', 'Recommendation 1 asks for screen-free periods, and gives meals as an example.', 'visualText'),
        mcq('Why does the summary name its source at the bottom?', ['to show that the findings can be trusted', 'to advertise the university', 'to tell readers where to buy parental controls', 'to thank the children who took part'], 'to show that the findings can be trusted', 'Naming who carried out the study lets readers judge how reliable the figures are.', 'visualText'),
      ],
    },
    clozeExtra: {
      text:
        ' Schools, too, have begun to respond. Some now set aside lessons {{11}} which pupils discuss what they have seen online. Others invite parents to workshops {{12}} that the same messages are heard at home. None of this means that technology is the enemy. {{13}} matters is how wisely it is used. A phone can connect a child {{14}} a grandparent overseas just as easily as it can distract him {{15}} his homework.',
      answers: ['in', 'so', 'What', 'to', 'from'],
      accept: [['in', 'during'], ['so'], ['what'], ['to', 'with'], ['from']],
    },
    comprehension: {
      add: [
        short(-0.5, 'inference', 'In paragraph 1, the writer compares a smartphone to a school bag. What does this comparison tell you about teenagers and their phones?', 'It shows that a phone is something teenagers feel they cannot do without and use every day.', [['essential', 'necessary', 'cannot do without', 'need', 'important', 'every day', 'everyday', 'daily', 'always']]),
        short(1.5, 'factual', 'According to paragraph 2, why might girls be more affected than boys?', 'Platforms built around pictures make them more insecure about how they look.', [['image', 'picture', 'photo'], ['appearance', 'look', 'insecur']]),
        short(1.7, 'factual', 'According to paragraph 3, what is dopamine and when does the brain release it?', 'It is a chemical linked with pleasure and reward. The brain releases it each time a notification, such as a like or a comment, arrives.', [['pleasure', 'reward'], ['notification', 'like', 'comment', 'follower']]),
        short(5.5, 'factual', 'From paragraph 5, give TWO things schools teach students so that they use their phones wisely.', 'To recognise when algorithms are manipulating them, and to set healthy limits on their own screen time.', [['algorithm', 'manipulat'], ['boundar', 'limit', 'screen time']]),
      ],
    },
  },
  T3: {
    theme: 'heritage',
    vocabCloze: {
      text:
        'The old shophouse on the corner had stood {{1:vacant}} for years before the Tan family bought it. Its timber shutters were {{2:weathered}} and its tiles cracked. Rather than {{3:demolish}} the building, the family hired craftsmen to restore it {{4:meticulously}}, one panel at a time. When the doors finally opened, neighbours {{5:marvelled}} at how closely it resembled the photographs from their childhood.',
      items: [
        vc(1, 'vacant', ['empty', 'hidden', 'locked', 'famous'], 'empty'),
        vc(2, 'weathered', ['worn', 'painted', 'polished', 'stolen'], 'worn'),
        vc(3, 'demolish', ['tear down', 'sell off', 'rent out', 'paint over'], 'tear down'),
        vc(4, 'meticulously', ['very carefully', 'very quickly', 'very cheaply', 'very quietly'], 'very carefully'),
        vc(5, 'marvelled', ['were amazed', 'were annoyed', 'were confused', 'were worried'], 'were amazed'),
      ],
    },
    visual: {
      id: 'vt-form-P6-20',
      items: [
        mcq('What is the main purpose of this letter?', ['to tell parents about Graduation Night and how to sign up', 'to ask parents for donations', 'to announce the examination results', 'to remind pupils of the school dress code'], 'to tell parents about Graduation Night and how to sign up', 'It gives the date, time, packages, payment and reply slip for the event.', 'visualText'),
        mcq('A pupil will attend with both parents and wants the souvenir book. Which package should the family choose?', ['Package B', 'Package A', 'Package C', 'Packages A and C'], 'Package B', 'Package B is the pupil, two guests and the souvenir book.', 'visualText'),
        mcq('By which date must the reply slip be returned?', ['25 April 2025', '15 April 2025', '30 April 2025', '14 November 2025'], '25 April 2025', 'The slip goes to the form teacher by 25 April. Payment is due on 30 April.', 'visualText'),
        mcq('How much more does Package B cost than Package A?', ['$20', '$15', '$45', '$65'], '$20', '$80 minus $60 is $20.', 'visualText'),
        mcq('Which statement is true?', ['Payment is due five days after the reply slip.', 'Guests must pay for their dinner separately.', 'The event will be held in the morning.', 'Pupils must wear their school uniform.'], 'Payment is due five days after the reply slip.', 'The reply slip is due on 25 April and payment on 30 April.', 'visualText'),
      ],
    },
    clozeExtra: {
      text:
        ' Not everyone is convinced that fame is good for the trade. Long queues may please stallholders, {{11}} they can drive away the regular customers who have supported a stall {{12}} decades. Rising rents are {{13}} worry, since few young hawkers can afford to start out. Even {{14}}, most Singaporeans agree that a city without its hawker centres would hardly feel {{15}} home.',
      answers: ['but', 'for', 'another', 'so', 'like'],
      accept: [['but', 'yet'], ['for'], ['another'], ['so'], ['like']],
    },
    comprehension: {
      add: [
        short(0.5, 'evidence', 'Give TWO pieces of evidence from paragraph 1 that show Madam Neo is dedicated to her work.', 'At eighty-one she is at her stall before dawn, and she has worked for fifty-eight years without a single day off.', [['dawn', 'early', 'eighty-one', '81'], ['fifty-eight', '58', 'day off']]),
        short(1.5, 'inference', 'According to paragraph 2, what is Madam Neo\'s "secret", and why is her dish hard to copy at home?', 'Her secret is a very hot wok that is never rushed. It gives the smoky "wok hei" flavour that a home kitchen can hardly produce.', [['heat', 'hot'], ['smoky', 'wok hei', 'charred', 'home']]),
        short(2.5, 'factual', 'Using paragraph 3, describe a hawker\'s typical working day.', 'It runs from five in the morning to three in the afternoon: ten hours of hard physical work in great heat.', [['five', '5', 'ten hours', 'three', '3'], ['heat', 'hot', 'sweltering', 'physical', 'labour']]),
        short(3.5, 'factual', 'According to paragraph 4, what has the government done about the shortage of young hawkers?', 'It has set up the Hawker Culture Programme, which offers grants and training to attract younger Singaporeans to the trade.', [['hawker culture programme', 'grant', 'training', 'scheme'], ['young', 'attract']]),
      ],
    },
  },
  T4: {
    theme: 'global issues',
    vocabCloze: {
      text:
        'After the floods, help arrived from {{1:unexpected}} places. A group of secondary school students {{2:pooled}} their savings to buy rice and blankets. Their teacher was {{3:astonished}} by how quickly they organised themselves. Although the supplies were {{4:modest}}, the families who received them were deeply grateful. The students\' {{5:initiative}} later inspired the whole town to start a relief fund.',
      items: [
        vc(1, 'unexpected', ['surprising', 'distant', 'wealthy', 'nearby'], 'surprising'),
        vc(2, 'pooled', ['combined', 'counted', 'spent', 'hid'], 'combined'),
        vc(3, 'astonished', ['amazed', 'upset', 'amused', 'puzzled'], 'amazed'),
        vc(4, 'modest', ['small', 'generous', 'late', 'costly'], 'small'),
        vc(5, 'initiative', ['readiness to act without being told', 'request for help', 'sense of humour', 'love of study'], 'readiness to act without being told'),
      ],
    },
    visual: {
      id: 'vt-notice-P6-19',
      items: [
        mcq('Who issued this advisory?', ['the Land Transport Authority', 'a school principal', 'the Traffic Police', 'the Ministry of Education'], 'the Land Transport Authority', 'The third line says "Issued by: Land Transport Authority (LTA)".', 'visualText'),
        mcq('At which of these times does the 40 km/h limit NOT apply?', ['10:30 a.m.', '7:00 a.m.', '9:00 a.m.', '2:00 p.m.'], '10:30 a.m.', 'The limit applies from 6:30 to 9:30 a.m. and from 12:00 to 3:00 p.m.', 'visualText'),
        mcq('Which rule does the advisory say applies "at all times"?', ['no stopping or parking at yellow-box markings', 'the 40 km/h speed limit', 'no U-turns at pick-up points', 'giving way at zebra crossings'], 'no stopping or parking at yellow-box markings', 'Rule 2 ends with the words "at all times".', 'visualText'),
        mcq('A driver is given the lowest fine for speeding and the highest fine for illegal parking. How much must he pay in all?', ['$270', '$220', '$190', '$150'], '$270', '$150 for speeding plus $120 for parking is $270.', 'visualText'),
        mcq('What is the purpose of the last two lines of the advisory?', ['to ask the public to cooperate and report unsafe driving', 'to list more penalties', 'to advertise a telephone service', 'to give directions to the nearest school'], 'to ask the public to cooperate and report unsafe driving', 'They appeal for cooperation and give a number for reporting unsafe driving.', 'visualText'),
      ],
    },
    clozeExtra: {
      text:
        ' None of this will happen by {{11}}. Every country, rich {{12}} poor, will have to play its part, and ordinary citizens must be willing to change the way they live. It is easy to feel that one person\'s choices make {{13}} difference. Yet history shows that great changes have often begun {{14}} a handful of determined people. The question is no longer whether we can act, {{15}} whether we will.',
      answers: ['itself', 'or', 'no', 'with', 'but'],
      accept: [['itself', 'chance', 'accident'], ['or'], ['no', 'little'], ['with'], ['but']],
    },
    comprehension: {
      add: [
        short(0.5, 'inference', 'Using paragraph 1, explain why few people expected Greta\'s protest to matter.', 'She was only fifteen and was protesting alone, with nothing but a handmade sign.', [['alone', 'solitary', 'one girl', 'by herself', 'only one'], ['fifteen', 'young', 'girl', 'handmade', 'teenager']]),
        short(1.5, 'factual', 'According to paragraph 2, how did the Fridays for Future campaign get its name?', 'Students stayed away from school every Friday to demand action on the climate.', [['friday'], ['strike', 'school', 'skip', 'stay away']]),
        short(2.5, 'factual', 'According to paragraph 3, what made Thunberg\'s speeches remarkable?', 'They were direct, and she refused to soften hard truths to spare the feelings of powerful people.', [['direct', 'blunt', 'honest', 'straight', 'soften', 'hard truth']]),
        short(6, 'inference', 'In the last paragraph, what does the writer mean by "a generation has been politically awakened"?', 'Young people have become aware that they have a voice and can influence the decisions leaders make.', [['voice', 'heard', 'speak', 'influence', 'power', 'difference'], ['young', 'generation', 'aware', 'realis', 'learn']]),
      ],
    },
  },
};

const VISUAL_BY_ID = new Map(VISUAL_TEXT_ITEMS.map((v) => [v.id, v]));

function buildComprehension(base, extra) {
  const kept = base.questions
    .filter((q) => q.type !== 'personal-response')
    .map((q, i) => {
      let text = q.q;
      for (const [from, to] of extra.fix || []) text = text.replace(from, to);
      return { ...q, q: text, marks: 2, pos: i };
    });
  const questions = [...kept, ...extra.add]
    .sort((a, b) => a.pos - b.pos)
    .map(({ pos: _pos, ...q }) => q);
  return {
    title: 'Section I: Comprehension',
    marks: 20,
    timeGuide: '~25 min',
    passage: base.passage,
    questions,
  };
}

function buildPaper(term, number) {
  const base = P6_PRACTICE_TESTS[term];
  const add = ADDITIONS[term];
  const visual = VISUAL_BY_ID.get(add.visual.id);
  const cloze = base.sectionG;
  return {
    id: `p6-paper2-${number}`,
    term,
    level: 'P6',
    label: `Paper 2 Layout · Practice ${number}`,
    duration: '1 h 50 min',
    totalMarks: 90,
    examAlignment: P6_PAPER2_ALIGNMENT,
    blurb: `Laid out like Paper 2: Booklet A (multiple choice, 25 marks) and Booklet B (written, 65 marks). Nine sections, including Visual Text and a 15-blank Comprehension Cloze. Theme: ${add.theme}.`,
    sectionA: { ...base.sectionA, title: 'Booklet A · Section A: Grammar', timeGuide: '~8 min' },
    sectionB: { ...base.sectionB, title: 'Booklet A · Section B: Vocabulary', timeGuide: '~4 min' },
    sectionC: {
      title: 'Booklet A · Section C: Vocabulary Cloze',
      marks: 5,
      timeGuide: '~6 min',
      instructions: 'Read the passage. For each numbered, underlined word, choose the answer closest in meaning.',
      stimulus: { kind: 'passage', text: add.vocabCloze.text },
      items: add.vocabCloze.items,
    },
    sectionD: {
      title: 'Booklet A · Section D: Visual Text Comprehension',
      marks: 5,
      timeGuide: '~8 min',
      instructions: 'Study the text below, then answer the questions.',
      stimulus: { kind: 'visual', item: visual },
      items: add.visual.items,
    },
    sectionE: {
      ...base.sectionC,
      title: 'Booklet B · Section E: Grammar Cloze',
      timeGuide: '~10 min',
      grammarCloze: true,
    },
    sectionF: { ...base.sectionI, title: 'Booklet B · Section F: Editing for Spelling and Grammar', timeGuide: '~10 min' },
    sectionG: {
      title: 'Booklet B · Section G: Comprehension Cloze',
      marks: 15,
      timeGuide: '~18 min',
      instructions: cloze.instructions,
      text: cloze.text + add.clozeExtra.text,
      answers: [...cloze.answers, ...add.clozeExtra.answers],
      accept: [...cloze.accept, ...add.clozeExtra.accept],
      skill: cloze.skill,
    },
    sectionH: { ...base.sectionF, title: 'Booklet B · Section H: Synthesis & Transformation', timeGuide: '~12 min' },
    sectionI: buildComprehension(base.sectionH, add.comprehension),
  };
}

export const P6_PAPER2_TESTS = Object.freeze(
  Object.fromEntries(P6_PAPER2_TERMS.map((term, i) => [term, Object.freeze(buildPaper(term, i + 1))])),
);

export function getP6Paper2Tests() {
  return P6_PAPER2_TERMS.map((t) => P6_PAPER2_TESTS[t]);
}

/** The section names and marks, in paper order. */
export function paper2Sections(paper) {
  return [
    ['Grammar MCQ', paper.sectionA],
    ['Vocabulary MCQ', paper.sectionB],
    ['Vocabulary Cloze', paper.sectionC],
    ['Visual Text Comprehension', paper.sectionD],
    ['Grammar Cloze', paper.sectionE],
    ['Editing', paper.sectionF],
    ['Comprehension Cloze', paper.sectionG],
    ['Synthesis & Transformation', paper.sectionH],
    ['Comprehension Open-ended', paper.sectionI],
  ].map(([name, s]) => ({ name, marks: s.marks }));
}

/** Structural checks; returns a list of problems (empty when sound). */
export function validateP6Paper2Tests(bank = P6_PAPER2_TESTS) {
  const issues = [];
  const blankRe = /\{\{(\d+)\}\}/g;
  for (const term of P6_PAPER2_TERMS) {
    const p = bank[term];
    const tag = `P6-Paper2/${term}`;
    if (!p) {
      issues.push(`${tag}: missing`);
      continue;
    }
    const sum = paper2Sections(p).reduce((n, s) => n + s.marks, 0);
    if (sum !== 90 || p.totalMarks !== 90) issues.push(`${tag}: marks add to ${sum}, not 90`);

    for (const [key, n] of [['sectionA', 10], ['sectionB', 5], ['sectionC', 5], ['sectionD', 5]]) {
      const s = p[key];
      if (s.items.length !== n || s.marks !== n) issues.push(`${tag}/${key}: needs ${n} one-mark items`);
      checkMcqItems(issues, `${tag}/${key}`, s.items, 4);
    }

    const marked = [...p.sectionC.stimulus.text.matchAll(/\{\{(\d+):([^}]+)\}\}/g)];
    if (marked.length !== 5) issues.push(`${tag}/sectionC: needs 5 underlined words`);
    marked.forEach((m, i) => {
      if (Number(m[1]) !== i + 1) issues.push(`${tag}/sectionC: word ${i + 1} is misnumbered`);
      if (!p.sectionC.items[i]?.q.includes(`"${m[2]}"`))
        issues.push(`${tag}/sectionC: question ${i + 1} does not ask about "${m[2]}"`);
    });

    if (!p.sectionD.stimulus.item?.poster) issues.push(`${tag}/sectionD: visual text missing`);

    for (const [key, n] of [['sectionE', 10], ['sectionG', 15]]) {
      const s = p[key];
      const nums = [...s.text.matchAll(blankRe)].map((m) => Number(m[1]));
      if (nums.length !== n || nums.some((v, i) => v !== i + 1))
        issues.push(`${tag}/${key}: blanks must run 1 to ${n}`);
      if (s.answers.length !== n || s.accept.length !== n) issues.push(`${tag}/${key}: needs ${n} answers`);
      s.answers.forEach((a, i) => {
        if (!s.accept[i].map((x) => x.toLowerCase()).includes(String(a).toLowerCase()))
          issues.push(`${tag}/${key}: answer ${i + 1} is not in its accepted list`);
      });
      if (s.marks !== n) issues.push(`${tag}/${key}: should carry ${n} marks`);
    }
    if (p.sectionG.wordBank) issues.push(`${tag}/sectionG: must have no word box`);

    if (p.sectionF.errors.length !== 10 || p.sectionF.marks !== 10) issues.push(`${tag}/sectionF: needs 10 errors`);
    if (p.sectionH.items.length !== 5 || p.sectionH.marks !== 10) issues.push(`${tag}/sectionH: needs 5 two-mark items`);

    const qs = p.sectionI.questions;
    if (qs.length !== 10) issues.push(`${tag}/sectionI: needs 10 questions, has ${qs.length}`);
    if (qs.reduce((n, q) => n + q.marks, 0) !== 20) issues.push(`${tag}/sectionI: questions must add to 20 marks`);
    if (qs.some((q) => q.type === 'personal-response')) issues.push(`${tag}/sectionI: no essay-length question`);
    for (const q of qs) if (!q.q || !q.model) issues.push(`${tag}/sectionI: question without a model answer`);
  }
  return issues;
}
