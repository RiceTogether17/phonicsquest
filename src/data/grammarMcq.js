/**
 * PhonicsQuest – Grammar MCQ Item Bank
 *
 * Data is generated from level/category blueprints so we can maintain
 * broad category coverage and consistent schema quality at scale.
 */

export const GRAMMAR_MCQ_LEVELS = ['P1', 'P2', 'P3', 'P4', 'P5', 'P6'];

const LEVEL_CATEGORY_PLAN = {
  P1: ['articles', 'pronouns', 'demonstratives', 'whQuestions', 'svAgreement', 'simplePast', 'presentCont', 'prepositions', 'possessives', 'quantifiers'],
  P2: ['articles', 'pronouns', 'reflexivePronouns', 'svAgreement', 'simplePast', 'presentCont', 'prepositions', 'connectors', 'countableUncountable', 'futureTense', 'whQuestions', 'demonstratives', 'pastCont', 'quantifiers', 'possessives', 'homophones'],
  P3: ['articles', 'pronouns', 'svAgreement', 'simplePast', 'presentCont', 'pastCont', 'prepositions', 'connectors', 'conjunctions', 'comparatives', 'modals', 'tagQuestions', 'compoundIndefinite', 'quantifiers', 'possessives', 'reflexivePronouns', 'whQuestions', 'futureTense', 'presentPerfect', 'tenseAwareness', 'countableUncountable', 'adjAdverbs', 'auxiliaries', 'superlatives', 'demonstratives', 'homophones', 'wordForms'],
  P4: ['svAgreement', 'presentPerfect', 'pastCont', 'futureTense', 'prepositions', 'connectors', 'quantifiers', 'adjAdverbs', 'auxiliaries', 'conjunctions', 'possessives', 'reflexivePronouns', 'whQuestions', 'countableUncountable', 'pronouns', 'tagQuestions', 'compoundIndefinite', 'simplePast', 'presentCont', 'perfectContinuousTenses', 'pastPerfect', 'modals', 'comparatives', 'conditionals', 'tenseAwareness', 'superlatives', 'gerundInfinitive', 'homophones', 'wordForms'],
  P5: ['svAgreement', 'tenseAwareness', 'presentPerfect', 'pastPerfect', 'perfectContinuousTenses', 'conditionals', 'passiveVoice', 'relativeClauses', 'reportedSpeech', 'modals', 'quantifiers', 'mixedGrammar', 'pastCont', 'reflexivePronouns', 'futureTense', 'countableUncountable', 'adjAdverbs', 'auxiliaries', 'tagQuestions', 'compoundIndefinite', 'simplePast', 'presentCont', 'comparatives', 'prepositions', 'connectors', 'conjunctions', 'superlatives', 'gerundInfinitive', 'homophones', 'wordForms'],
  P6: ['tenseAwareness', 'pastPerfect', 'perfectContinuousTenses', 'conditionals', 'passiveVoice', 'relativeClauses', 'reportedSpeech', 'modals', 'inversion', 'auxiliaries', 'connectors', 'mixedGrammar', 'pastCont', 'quantifiers', 'reflexivePronouns', 'futureTense', 'presentPerfect', 'countableUncountable', 'adjAdverbs', 'tagQuestions', 'compoundIndefinite', 'simplePast', 'presentCont', 'prepositions', 'conjunctions', 'svAgreement', 'superlatives', 'gerundInfinitive', 'comparatives', 'homophones', 'wordForms'],
};

const SUBJECTS = ['The pupil', 'My brother', 'Our teacher', 'The class monitor', 'The twins', 'The players', 'Her cousin', 'The science team'];
const PLACES = ['in the canteen', 'at the void deck', 'near the school gate', 'in the library', 'at East Coast Park', 'beside the hall', 'on the field', 'at the community club'];

function rotate(arr, idx) {
  return arr[idx % arr.length];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildChoices(answer, distractors) {
  const choices = [answer, ...distractors.slice(0, 3)];
  return shuffle([...new Set(choices)].slice(0, 4));
}

function difficultyFor(level, idx) {
  if (level === 'P1' || level === 'P2') return idx % 5 === 0 ? 2 : 1;
  if (level === 'P3' || level === 'P4') return idx % 4 === 0 ? 3 : 2;
  return idx % 3 === 0 ? 3 : 2;
}

const GRAMMAR_BUILDERS = {
  articles(level, i) {
    const rows = [
      ['___ hour had passed, but the team had not given up.', 'An', ['A', 'The', 'Some']],
      ['Priya found ___ umbrella leaning against the classroom door.', 'an', ['a', 'the', 'some']],
      ['The coach shared ___ useful tip just before the match began.', 'a', ['an', 'the', 'some']],
      ['I saw ___ eagle gliding slowly above the field.', 'an', ['a', 'the', 'some']],
      ['That was ___ excellent answer — the class was impressed.', 'an', ['a', 'the', 'some']],
      ['Mum left ___ orange on the counter as a snack.', 'an', ['a', 'the', 'some']],
      ['Please pass me ___ ruler so I can draw a margin.', 'a', ['an', 'the', 'some']],
      ['___ uniform with the school crest hung in the display case.', 'A', ['An', 'The', 'Some']],
      ['She gave ___ honest answer to a tricky question.', 'an', ['a', 'the', 'some']],
      ['He found ___ empty seat near the library window.', 'an', ['a', 'the', 'some']],
      ['The class planted ___ mango seedling in the school garden.', 'a', ['an', 'the', 'some']],
      ['We heard ___ unusual noise coming from the storeroom.', 'an', ['a', 'the', 'some']],
      ['Jake slipped ___ extra pen into his pencil case just in case.', 'an', ['a', 'the', 'some']],
      ['___ ice-cream treat awaited each pupil after Sports Day.', 'An', ['A', 'The', 'Some']],
      ['The new pupil gave ___ interesting talk about her home country.', 'an', ['a', 'the', 'some']],
      ['The principal made ___ announcement about the upcoming camp.', 'an', ['a', 'the', 'some']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'article_choice',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'Use "a" before consonant sounds and "an" before vowel sounds — including silent-h words like "hour" and "honest".',
    };
  },
  pronouns(level, i) {
    const p1Rows = [
      ['Tom is my friend. ___ likes to play football with me.', 'He', ['She', 'It', 'They']],
      ['Sara and I went to the park. ___ played on the swings.', 'We', ['I', 'They', 'She']],
      ['Look at the bird in the cage. ___ is so colourful!', 'It', ['He', 'She', 'They']],
      ['The boys forgot their bags. The teacher reminded ___.', 'them', ['they', 'their', 'theirs']],
      ['Don\'t eat the bread. ___ has turned mouldy.', 'It', ['He', 'She', 'They']],
      ['My dog loves to run. ___ chases every ball in the park.', 'It', ['He', 'She', 'They']],
      ['Aunty Sue baked some cookies. ___ put them on the table for us.', 'She', ['He', 'It', 'They']],
      ['The twins like football. ___ practise every Saturday morning.', 'They', ['He', 'She', 'It']],
      ['Mum and I went to the market. ___ bought fresh fruit.', 'We', ['They', 'I', 'She']],
      ['Dad called my sister and ___. We had to come inside.', 'me', ['I', 'my', 'mine']],
      ['My sister lost her pencil. I lent ___ mine for the rest of the lesson.', 'her', ['she', 'hers', 'herself']],
      ['The kitten knocked over the cup. ___ fell off the table.', 'It', ['He', 'She', 'They']],
      ['Our class won the quiz. The teacher praised ___.', 'us', ['we', 'our', 'ours']],
    ];
    const upperRows = [
      ['The girls were late, so ___ apologised to the teacher.', 'they', ['them', 'their', 'theirs']],
      ['Mr Tan called Ali and me, so he spoke to ___.', 'us', ['we', 'our', 'ours']],
      ['That sketchbook belongs to Mei. It is ___.', 'hers', ['her', 'she', 'herself']],
      ['Please pass the worksheet to Dan and ___.', 'me', ['I', 'my', 'mine']],
      ['The volunteers worked hard, and the principal thanked ___ warmly.', 'them', ['they', 'their', 'theirs']],
      ['My brother and ___ share the same room at home.', 'I', ['me', 'my', 'mine']],
      ['The new uniform belongs to my cousin — it is ___.', 'his', ['he', 'him', 'himself']],
      ['Sarah lent me her novel, so I returned it to ___ this morning.', 'her', ['she', 'hers', 'herself']],
      ['The committee made ___ decision after a long discussion.', 'its', ['it', 'their', 'theirs']],
      ['Between Daniel and ___, who do you think will win the quiz?', 'me', ['I', 'my', 'mine']],
    ];
    const rows = level === 'P1' ? p1Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'pronoun_form', q, choices: buildChoices(answer, ds), answer, explain: 'Subject pronouns (I, he, she, we, they) do the action. Object pronouns (me, him, her, us, them) receive it. After prepositions and as objects, use the object form — e.g. "between Daniel and me", "thanked them".' };
  },
  reflexivePronouns(level, i) {
    const rows = [
      ['We can do this ___. We do not need your help.', 'ourselves', ['himself', 'yourselves', 'themselves']],
      ['"You only have ___ to blame," Mother scolded my sister and me.', 'yourselves', ['yourself', 'ourselves', 'themselves']],
      ['Lin Lin made the cake all by ___ — she is very proud.', 'herself', ['himself', 'themselves', 'yourselves']],
      ['The boys built the tree house ___ over the weekend.', 'themselves', ['ourselves', 'himself', 'herself']],
      ['I taught ___ how to ride a bicycle last year.', 'myself', ['himself', 'ourselves', 'themselves']],
      ['The cat groomed ___ patiently in the sunshine.', 'itself', ['himself', 'themselves', 'herself']],
      ['Mr Lim, please help ___ to the snacks on the table.', 'yourself', ['himself', 'themselves', 'ourselves']],
      ['Tim could not lift the heavy box by ___, so he asked his brother for help.', 'himself', ['themselves', 'yourself', 'itself']],
      ['The girls poured ___ a glass of juice each before assembly.', 'themselves', ['herself', 'ourselves', 'yourselves']],
      ['"Do not blame ___, Ali — it was not your fault," said Mother.', 'yourself', ['himself', 'yourselves', 'itself']],
      ['The new boy introduced ___ to the whole class with a calm, confident voice.', 'himself', ['herself', 'themselves', 'myself']],
      ['After the long walk, we treated ___ to ice cream at the void deck.', 'ourselves', ['themselves', 'yourselves', 'myself']],
      ['The robot can repair ___ when one of its parts is damaged.', 'itself', ['himself', 'themselves', 'herself']],
      ['Hannah baked the loaf of bread ___ for the school bake sale.', 'herself', ['themselves', 'yourself', 'ourselves']],
      ['Sarah and Mia found ___ a quiet corner of the library to study.', 'themselves', ['herself', 'yourself', 'ourselves']],
      ['Have you ever asked ___ why the sky looks blue, Daniel?', 'yourself', ['himself', 'yourselves', 'themselves']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'reflexive_pronoun_form',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'A reflexive pronoun (-self/-selves) matches the subject — I→myself, we→ourselves, they→themselves, he→himself, you (plural)→yourselves.',
    };
  },
  tagQuestions(level, i) {
    const rows = [
      ['Andy is joining us for recess, ___ he?', 'isn\'t', ['is', 'does', 'doesn\'t']],
      ['You have watched this movie before, ___ you?', 'haven\'t', ['did', 'have', 'didn\'t']],
      ['They will join the swim team, ___ they?', 'won\'t', ['will', 'do', 'don\'t']],
      ['She does not eat seafood, ___ she?', 'does', ['doesn\'t', 'is', 'isn\'t']],
      ['We must finish this by Friday, ___ we?', 'mustn\'t', ['must', 'do', 'don\'t']],
      ['The twins are not in the team, ___ they?', 'are', ['aren\'t', 'is', 'isn\'t']],
      ['Your sister can swim very well, ___ she?', 'can\'t', ['can', 'does', 'doesn\'t']],
      ['He should bring his calculator tomorrow, ___ he?', 'shouldn\'t', ['should', 'does', 'doesn\'t']],
      ['They were practising in the hall after school, ___ they?', 'weren\'t', ['were', 'are', 'aren\'t']],
      ['It was a tiring P.E. lesson, ___ it?', 'wasn\'t', ['was', 'is', 'isn\'t']],
      ['Mei did her homework already, ___ she?', 'didn\'t', ['did', 'does', 'doesn\'t']],
      ['We had finished the test before the bell rang, ___ we?', 'hadn\'t', ['had', 'did', 'didn\'t']],
      ['The kittens are playing in the garden, ___ they?', 'aren\'t', ['are', 'is', 'isn\'t']],
      ['Father has fixed the broken chair, ___ he?', 'hasn\'t', ['has', 'does', 'doesn\'t']],
      ['Aunty Lin would prefer chicken rice, ___ she?', 'wouldn\'t', ['would', 'does', 'doesn\'t']],
      ['Your brother could not find his keys, ___ he?', 'could', ['couldn\'t', 'can', 'can\'t']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'tag_question_form',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'A tag question reverses the polarity of the main verb — positive statement → negative tag (and vice versa). Use the same auxiliary (is/are, do/does, have/has, will, must...).',
    };
  },
  compoundIndefinite(level, i) {
    const rows = [
      ['I must have dropped my key ___. I cannot seem to find it.', 'somewhere', ['nowhere', 'anywhere', 'everywhere']],
      ['Is there ___ at home? The lights are off.', 'anyone', ['no one', 'someone', 'everyone']],
      ['There is ___ to do — the room is spotless.', 'nothing', ['anything', 'something', 'everything']],
      ['I want to go ___ quiet for the holidays.', 'somewhere', ['nowhere', 'anywhere', 'everywhere']],
      ['___ in the class enjoys art lessons — even the shy ones.', 'Everyone', ['No one', 'Anyone', 'Someone']],
      ['I looked ___ for my glasses but they were on my head.', 'everywhere', ['nowhere', 'somewhere', 'anywhere']],
      ['Did you see ___ suspicious near the school gate just now?', 'anything', ['something', 'nothing', 'everything']],
      ['___ knocked at the door, but I could not see who it was through the peephole.', 'Someone', ['No one', 'Anyone', 'Everyone']],
      ['There is ___ in the snack jar — I finished it yesterday.', 'nothing', ['anything', 'something', 'everywhere']],
      ['We searched ___ for the missing hamster and finally found it under the sofa.', 'everywhere', ['somewhere', 'anywhere', 'nowhere']],
      ['___ in the room felt the sudden chill when Mum opened the window.', 'Everyone', ['Anyone', 'Someone', 'No one']],
      ['Has ___ told you about the change in the timetable yet?', 'anyone', ['someone', 'everyone', 'no one']],
      ['I do not know ___ in this new class — please introduce me to your friends.', 'anyone', ['someone', 'everyone', 'no one']],
      ['___ has been moved on my desk — my pencil case is in the wrong spot!', 'Something', ['Nothing', 'Anything', 'Everything']],
      ['The shop was so quiet that there was ___ inside except the cashier.', 'no one', ['someone', 'anyone', 'everyone']],
      ['Let us go ___ peaceful and read a book together this afternoon.', 'somewhere', ['anywhere', 'nowhere', 'everywhere']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'compound_pronoun_choice',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'some- = unknown but exists; any- = unspecified (in questions/negatives); no- = none; every- = all.',
    };
  },
  demonstratives(level, i) {
    const rows = [
      ['I like this toy. I do not like ___ one over there.', 'that', ['this', 'these', 'those']],
      ['"___ is my pencil," said Mimi as she held it in her hand.', 'This', ['That', 'These', 'Those']],
      ['Look at ___ apples on the table in front of us. They are red and shiny.', 'these', ['this', 'that', 'those']],
      ['Can you see ___ birds flying high in the sky?', 'those', ['this', 'that', 'these']],
      ['"Pass me ___ book on your desk, please," asked the teacher.', 'that', ['this', 'these', 'those']],
      ['"___ shoes here are mine. The ones over there are yours."', 'These', ['That', 'Those', 'This']],
      ['"___ is the way to the science lab — follow the corridor to the end and turn left," the prefect told us.', 'This', ['That', 'These', 'Those']],
      ['Could you please hand me ___ scissors over there on the cupboard?', 'those', ['this', 'that', 'these']],
      ['"___ cookies that I am holding are still warm — try one!"', 'These', ['That', 'Those', 'This']],
      ['Look! ___ butterfly near the window is much smaller than ours.', 'That', ['This', 'These', 'Those']],
      ['"___ is how you fold the paper into a boat," Mrs Lee told the class.', 'This', ['That', 'These', 'Those']],
      ['___ little boy beside me is my younger brother Tim.', 'This', ['That', 'These', 'Those']],
      ['"Please stack ___ chairs here against the wall before the parents arrive," said the teacher, pointing to the chairs beside her.', 'these', ['those', 'this', 'that']],
      ['"___ pupil by the window — please sit up straight," the teacher said.', 'That', ['This', 'These', 'Those']],
      ['Look at ___ clouds in the distance. I think it might rain later.', 'those', ['these', 'this', 'that']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'demonstrative_choice',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'Use "this/these" for things near, "that/those" for things far. Use the singular form for one and the plural form for many.',
    };
  },
  whQuestions(level, i) {
    const rows = [
      ['"___ did you perform this magic trick? Please show me," Fred asked.', 'How', ['When', 'What', 'Where']],
      ['"___ are you today? I hope you are feeling much better," my teacher said to me.', 'How', ['Why', 'What', 'Which']],
      ['"___ is your birthday party? I want to know the date," Sara asked.', 'When', ['Where', 'How', 'Who']],
      ['"___ do you keep your school bag at home?" asked Mum.', 'Where', ['When', 'How', 'Why']],
      ['"___ are you wearing a raincoat? It is not raining," Tom asked.', 'Why', ['How', 'When', 'Where']],
      ['"___ of these three animals is the largest — the blue whale, the elephant, or the giraffe?" the teacher asked.', 'Which', ['How', 'When', 'Whose']],
      ['"___ did you go on your school holiday last December?" Aunt Mei asked.', 'Where', ['When', 'How', 'Why']],
      ['"___ is the new student who joined our class today?" Daniel whispered.', 'Who', ['What', 'Which', 'Whose']],
      ['"___ pencil case is this on the floor near the door?" the teacher asked.', 'Whose', ['Who', 'Which', 'What']],
      ['"___ many books did you borrow from the school library yesterday?" the librarian asked politely.', 'How', ['What', 'When', 'Which']],
      ['"___ do you spell \'necessary\'?" the teacher asked the class.', 'How', ['What', 'When', 'Where']],
      ['"___ gave you permission to leave the classroom?" the prefect asked sternly.', 'Who', ['What', 'Which', 'Whose']],
      ['"___ colour would you like for your name card?" asked the art teacher.', 'Which', ['What', 'Whose', 'How']],
      ['"___ is the science lab? I cannot find it," the new student said.', 'Where', ['When', 'Why', 'How']],
      ['"___ did you arrive late today, Sam?" the teacher asked with concern.', 'Why', ['How', 'When', 'Where']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'wh_question_word',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'who = person; whose = ownership; what = thing or action; which = choice from a set; when = time; where = place; why = reason; how = manner or degree. Look at what the answer in the sentence is about.',
    };
  },
  svAgreement(level, i) {
    const rows = [
      ['The captain of the team ___ early every day.', 'arrives', ['arrive', 'arrived', 'arriving']],
      ['My cousins ___ badminton after school.', 'play', ['plays', 'played', 'is playing']],
      ['There ___ two packets of rice on the shelf.', 'are', ['is', 'was', 'has']],
      ['Neither the coach nor the players ___ careless today.', 'are', ['is', 'was', 'be']],
      ['Each student ___ a name tag for the camp.', 'has', ['have', 'had', 'having']],
      ['One of the pupils ___ a birthday today.', 'has', ['have', 'had', 'having']],
      ['Both the teacher and the principal ___ the new timetable.', 'support', ['supports', 'supported', 'is supporting']],
      ['A box of crayons ___ been left in the art room.', 'has', ['have', 'had', 'having']],
      ['Either the twins or their older sister ___ staying to help.', 'is', ['are', 'were', 'be']],
      ['The news about the school trip ___ very exciting.', 'is', ['are', 'was', 'be']],
      ['Not a single pupil ___ absent on Picture Day.', 'was', ['were', 'is', 'are']],
      ['Mathematics ___ her favourite subject at school.', 'is', ['are', 'was', 'be']],
      ['The pair of scissors ___ on the craft table.', 'is', ['are', 'were', 'be']],
      ['Everyone on the bus ___ to arrive by seven.', 'needs', ['need', 'needed', 'needing']],
      ['The committee ___ its decision after a long discussion.', 'made', ['make', 'makes', 'making']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'agreement', q, choices: buildChoices(answer, ds), answer, explain: 'Match the verb with the true subject — collective nouns and "each/one/either" take a singular verb.' };
  },
  simplePast(level, i) {
    const p1Rows = [
      ['Yesterday, I ___ to the library to borrow books.', 'went', ['go', 'gone', 'goes']],
      ['Yesterday, Jean ___ her bicycle to the park.', 'rode', ['ride', 'rides', 'riding']],
      ['Last weekend, Mum ___ a chocolate cake for my birthday.', 'baked', ['bake', 'bakes', 'baking']],
      ['As a young boy, Grandfather ___ in this river.', 'swam', ['swim', 'swims', 'swum']],
      ['Last night, Dad ___ us a bedtime story.', 'told', ['tell', 'tells', 'telling']],
      ['Yesterday, we ___ pizza at the food court.', 'ate', ['eat', 'eats', 'eating']],
    ];
    const p2Rows = [
      ['I was studying in my bedroom when I ___ a loud noise.', 'heard', ['hear', 'hears', 'was hearing']],
      ['My mother ___ a lot while watching a sad movie just now.', 'cried', ['cry', 'cries', 'crying']],
      ['Just a moment ago, the wind ___ and toppled the tree.', 'blew', ['blow', 'blows', 'is blowing']],
      ['Last week, our class ___ a small project for the science fair.', 'built', ['build', 'builds', 'building']],
      ['Yesterday morning, the rain ___ very heavily.', 'fell', ['fall', 'falls', 'is falling']],
      ['Our class ___ first place in the inter-school quiz last term.', 'won', ['win', 'wins', 'winning']],
      ['The librarian ___ ten new books on the display shelf last week.', 'placed', ['place', 'places', 'is placing']],
      ['Everyone ___ when the magician pulled the rabbit from the hat.', 'clapped', ['clap', 'claps', 'clapping']],
      ['The coach ___ the team captain after the final whistle.', 'congratulated', ['congratulate', 'congratulates', 'congratulating']],
      ['It ___ raining suddenly during our outdoor lesson last Thursday.', 'started', ['start', 'starts', 'is starting']],
      ['The puppy ___ at the door the whole time we were out yesterday.', 'waited', ['wait', 'waits', 'was waiting']],
    ];
    const upperRows = [
      ['Yesterday, we ___ the art display before lunch.', 'visited', ['visit', 'visits', 'visiting']],
      ['Last Friday, she ___ her wallet at home.', 'left', ['leave', 'leaves', 'leaving']],
      ['Two days ago, they ___ the heavy box upstairs.', 'carried', ['carry', 'carries', 'carrying']],
      ['Last night, Father ___ us a story about courage.', 'told', ['tell', 'tells', 'telling']],
      ['During the last fire drill, all the pupils ___ calmly to the assembly area.', 'walked', ['walk', 'walks', 'walking']],
      ['When the bell rang earlier this morning, the prefect ___ the door open for us.', 'held', ['hold', 'holds', 'is holding']],
      ['Three days ago, our librarian ___ a new shipment of storybooks.', 'received', ['receive', 'receives', 'is receiving']],
      ['Last weekend, my grandparents ___ all the way from Penang to visit us.', 'drove', ['drive', 'drives', 'driving']],
      ['Yesterday afternoon, the painter ___ the entire fence in just two hours.', 'painted', ['paints', 'paint', 'painting']],
      ['Just before assembly began, the principal ___ that the swimming meet was postponed.', 'announced', ['announces', 'announce', 'is announcing']],
    ];
    const rows = level === 'P1' ? p1Rows : level === 'P2' ? p2Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'past_tense_form', q, choices: buildChoices(answer, ds), answer, explain: 'Time markers like yesterday, last week, just now, and ago signal simple past. Regular verbs add -ed (baked, walked). Irregular verbs change form (go→went, eat→ate, blow→blew, win→won) — these must be memorised.' };
  },
  presentCont(level, i) {
    const rows = [
      ['Look! The children ___ across the hall.', 'are running', ['run', 'ran', 'is running']],
      ['Right now, my mother ___ dinner for everyone.', 'is cooking', ['cooks', 'cooked', 'are cooking']],
      ['At the moment, I ___ my spelling corrections.', 'am checking', ['check', 'checked', 'is checking']],
      ['Listen! The choir ___ the final chorus.', 'is singing', ['sing', 'sang', 'are singing']],
      ['Sshh — the baby ___ in the pram.', 'is sleeping', ['sleep', 'sleeps', 'are sleeping']],
      ['The technicians ___ the new projector right now.', 'are installing', ['installs', 'install', 'is installing']],
      ['Look outside! It ___ heavily again.', 'is raining', ['rains', 'rained', 'are raining']],
      ['The art teacher ___ a beautiful mural at this very moment.', 'is painting', ['paints', 'painted', 'are painting']],
      ['Right now, our librarian ___ the new books on the shelves.', 'is arranging', ['arranges', 'arrange', 'are arranging']],
      ['Look — the puppies ___ in the playpen!', 'are tumbling', ['tumbles', 'tumble', 'is tumbling']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'present_continuous', q, choices: buildChoices(answer, ds), answer, explain: 'Use present continuous for actions happening now.' };
  },
  prepositions(level, i) {
    const p1Rows = [
      ['Gavin fell asleep ___ the sofa.', 'on', ['in', 'into', 'onto']],
      ['The ball rolled away and fell ___ a drain.', 'into', ['to', 'on', 'over']],
      ['Holly has to attend a lesson ___ 8 o\'clock in the morning.', 'at', ['in', 'on', 'by']],
      ['It was very hot, so we sat ___ the shade where it was cooler.', 'in', ['on', 'with', 'below']],
      ['My bag is ___ the table next to my books.', 'on', ['in', 'under', 'between']],
      ['The cat is hiding ___ the chair. I cannot see it.', 'under', ['above', 'across', 'behind']],
      ['The children ran ___ the playground after the bell rang.', 'to', ['at', 'on', 'in']],
      ['She kept her storybook ___ her bag to read later.', 'in', ['on', 'at', 'under']],
      ['The kite flew high ___ the trees in the park.', 'above', ['under', 'below', 'behind']],
      ['We live ___ the sixth floor of the apartment block.', 'on', ['at', 'in', 'above']],
      ['Dad parked the car ___ the shopping centre.', 'at', ['in', 'on', 'above']],
      ['The bird perched ___ the branch and sang a sweet song.', 'on', ['at', 'in', 'under']],
      ['She waited ___ the bus stop for almost twenty minutes.', 'at', ['in', 'on', 'by']],
      ['The dog sat ___ the two children in the photograph.', 'between', ['among', 'beside', 'behind']],
    ];
    const p2Rows = [
      ['The cyclist took shelter ___ the bridge as it was raining.', 'under', ['at', 'on', 'above']],
      ['Joe kicked the ball so hard that it flew ___ the fence.', 'over', ['above', 'across', 'through']],
      ['It is dangerous to dash ___ the road without watching out for traffic.', 'across', ['along', 'over', 'through']],
      ['Emily wandered ___ a street she did not recognise.', 'down', ['off', 'around', 'among']],
      ['Tall buildings stood all ___ her.', 'around', ['beside', 'across', 'towards']],
      ['She decided to head ___ the park to find her way home.', 'towards', ['among', 'beside', 'off']],
      ['The train went ___ a long tunnel before reaching the next station.', 'through', ['over', 'across', 'along']],
      ['The rabbit hopped ___ the fence and landed on the soft grass.', 'over', ['across', 'through', 'into']],
      ['The cat jumped ___ the open box and sat down inside.', 'into', ['onto', 'over', 'through']],
      ['We walked ___ the busy road carefully, watching out for traffic.', 'along', ['across', 'through', 'around']],
      ['She slid ___ the chair to make room for the new pupil.', 'off', ['over', 'across', 'below']],
    ];
    const upperRows = [
      ['Please place the attendance file ___ the principal\'s desk.', 'on', ['in', 'under', 'between']],
      ['We reached school ___ 7.20 a.m. today.', 'at', ['on', 'in', 'by']],
      ['The football rolled ___ the bench.', 'under', ['above', 'across', 'toward']],
      ['They walked ___ the bridge to the science centre.', 'across', ['behind', 'inside', 'with']],
      ['The science exhibition was held ___ the multipurpose hall on Monday.', 'in', ['on', 'at', 'into']],
      ['Pass the message ___ Mrs Lim before recess, please.', 'to', ['at', 'for', 'with']],
      ['The new mural was painted ___ several talented seniors over the holidays.', 'by', ['for', 'with', 'from']],
      ['The library is open ___ 8 a.m. to 4 p.m. every weekday.', 'from', ['for', 'since', 'until']],
      ['We must hand in the project ___ Friday at the latest.', 'by', ['until', 'at', 'on']],
      ['The class chairperson stood ___ the principal and the vice-principal during the photograph.', 'between', ['among', 'beside', 'with']],
    ];
    const rows = level === 'P1' ? p1Rows : level === 'P2' ? p2Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'preposition_use', q, choices: buildChoices(answer, ds), answer, explain: 'Place: on (surface), in (enclosed), at (point/location), between (two), among (many). Movement: into, onto, across, through, over, along. Time: at (clock time), on (date/day), in (month/year), by (deadline), from…to (range).' };
  },
  possessives(level, i) {
    const rows = [
      ['This is not my bottle. It is ___.', 'hers', ['her', 'she', 'herself']],
      ['The boys forgot ___ PE shirts in class.', 'their', ['there', 'they', 'theirs']],
      ['That laptop belongs to my parents. It is ___.', 'theirs', ['their', 'them', 'they']],
      ['I borrowed ___ ruler because mine was missing.', 'his', ['he', 'him', 'himself']],
      ['The cat washed ___ paws after the long nap on the sofa.', 'its', ['it\'s', 'their', 'his']],
      ['My sister and I take turns walking ___ dog every evening.', 'our', ['ours', 'us', 'we']],
      ['"Is this jacket ___, Aunt Mei?" I asked at the door.', 'yours', ['your', 'you', 'yourself']],
      ['Dan said the spare key on the table is ___.', 'his', ['he', 'him', 'himself']],
      ['Daniel and Mei brought ___ projects to school in clear folders.', 'their', ['theirs', 'them', 'they']],
      ['Each student must label ___ exercise book before the lesson begins.', 'his or her', ['theirs', 'them', 'their\'s']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'possessive_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Possessive adjectives (my, your, his, her, its, our, their) come before a noun. Possessive pronouns (mine, yours, his, hers, ours, theirs) stand alone. Never use an apostrophe in "its" when showing ownership.' };
  },
  quantifiers(level, i) {
    const p1Rows = [
      ['I looked into the refrigerator. There wasn\'t ___ juice left.', 'any', ['a few', 'many', 'a little']],
      ['There is no ___ soup left after Dan finished the whole pot.', 'more', ['any', 'much', 'many']],
      ['After a tiring day, Mother had ___ rest when she came home.', 'some', ['any', 'little', 'few']],
      ['There wasn\'t ___ juice left. I only had half a glass of it.', 'much', ['some', 'little', 'few']],
      ['I bought ___ apples at the market for our breakfast.', 'some', ['any', 'much', 'a little']],
      ['How ___ pencils do you have in your pencil case?', 'many', ['much', 'a little', 'less']],
      ['We only had ___ time left, so we hurried to the bus stop.', 'a little', ['a few', 'many', 'much']],
      ['There are ___ children waiting outside — about twenty of them.', 'many', ['much', 'a little', 'some']],
      ['I drank ___ water after the long run because I was very thirsty.', 'some', ['any', 'many', 'much']],
      ['Only ___ seats are left in the hall — let us sit down quickly.', 'a few', ['a little', 'much', 'less']],
      ['Can I have ___ more time to finish my drawing?', 'a little', ['a few', 'many', 'much']],
      ['There were ___ clouds in the sky, so we stayed outside to play.', 'few', ['little', 'much', 'many']],
      ['He ate ___ biscuits but saved the rest for his sister.', 'some', ['any', 'much', 'a little']],
    ];
    const upperRows = [
      ['There are ___ marbles in this small pouch.', 'few', ['little', 'much', 'less']],
      ['How ___ sugar should we add to this drink?', 'much', ['many', 'few', 'several']],
      ['Only ___ pupils were absent during rehearsal.', 'a few', ['a little', 'much', 'less']],
      ['We have ___ water left, so refill the bottle.', 'little', ['few', 'many', 'several']],
      ['The volunteers prepared ___ packets of dried noodles for the food drive.', 'several', ['much', 'a little', 'less']],
      ['The dietitian advised him to add ___ salt to his meals and rely on herbs for flavour instead.', 'less', ['fewer', 'many', 'several']],
      ['Take ___ time as you need to finish the paper.', 'as much', ['as many', 'how much', 'how many']],
      ['Mr Lee asked, "How ___ chairs do we still need for the parents?"', 'many', ['much', 'a little', 'less']],
      ['There has been ___ rainfall this month than last month.', 'less', ['fewer', 'many', 'several']],
      ['___ of the homework was done on the bus ride home.', 'Most', ['Many', 'Several', 'A few']],
    ];
    const rows = level === 'P1' ? p1Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'quantifier_choice', q, choices: buildChoices(answer, ds), answer, explain: 'Use quantifiers based on whether the noun is countable or uncountable.' };
  },
  connectors(level, i) {
    const p2Rows = [
      ['Mandy and Ken can walk ___ take the bus to school.', 'or', ['nor', 'and', 'but']],
      ['We took off our coats ___ it was warm inside the building.', 'as', ['so', 'but', 'when']],
      ['The fire broke out ___ the store was just about to open.', 'when', ['so', 'but', 'because']],
      ['You can enter only ___ you have an entry pass.', 'if', ['as', 'while', 'until']],
      ['Shake the bottle well ___ you pour out the sauce.', 'before', ['as', 'when', 'after']],
      ['I kept ringing the doorbell ___ someone finally opened the door.', 'until', ['since', 'unless', 'while']],
      ['She wore a raincoat ___ she knew it might drizzle later.', 'because', ['but', 'or', 'when']],
      ['He was ill, ___ he still came to school for the important test.', 'but', ['and', 'so', 'because']],
      ['The teacher waited ___ the whole class was quiet.', 'until', ['since', 'while', 'as']],
      ['Read the passage carefully ___ you try to answer the questions.', 'before', ['after', 'when', 'so']],
      ['The shop was closed, ___ we went home without buying anything.', 'so', ['but', 'and', 'because']],
    ];
    const upperRows = [
      ['The sky darkened, ___ we packed our raincoats.', 'so', ['but', 'or', 'because']],
      ['She was tired, ___ she still completed her corrections.', 'but', ['and', 'so', 'because']],
      ['Pack your bottle ___ your worksheet before camp.', 'and', ['but', 'or', 'because']],
      ['He revised carefully ___ he wanted to improve.', 'because', ['but', 'so', 'or']],
      ['We must hurry, ___ we will miss the last bus.', 'or', ['so', 'and', 'but']],
      ['The teacher praised Mei ___ she had spotted the missing comma.', 'because', ['but', 'so', 'or']],
      ['I love both salads ___ stir-fried vegetables for lunch.', 'and', ['or', 'but', 'so']],
      ['Wear sunscreen, ___ you will get sunburnt at the beach.', 'or', ['so', 'because', 'and']],
      ['She studied for the test, ___ she still felt nervous on the day.', 'but', ['so', 'and', 'because']],
      ['The lift was broken, ___ we used the stairs to reach the fifth floor.', 'so', ['but', 'or', 'because']],
    ];
    const rows = (level === 'P1' || level === 'P2') ? p2Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'connector_logic', q, choices: buildChoices(answer, ds), answer, explain: 'Choose the connector that matches the relationship between the two ideas — choice (or), reason (because/as), time (before/when/until), condition (if), contrast (but).' };
  },
  countableUncountable(level, i) {
    const rows = [
      ['There is ___ rice left in the cooker.', 'some', ['many', 'few', 'an']],
      ['How ___ oranges did Grandma buy?', 'many', ['much', 'little', 'less']],
      ['Please add ___ flour to the bowl.', 'a little', ['a few', 'many', 'several']],
      ['We need ___ chairs for the visitors.', 'a few', ['a little', 'much', 'less']],
      ['There is too ___ noise in the corridor — please be quieter.', 'much', ['many', 'few', 'several']],
      ['I have ___ friends who play the violin.', 'many', ['much', 'a little', 'less']],
      ['The recipe calls for ___ sugar, just enough to balance the lemon.', 'a little', ['a few', 'many', 'several']],
      ['We bought ___ bottles of water for the camp trip.', 'several', ['a little', 'much', 'less']],
      ['There is ___ time before the bell rings — hurry up!', 'little', ['few', 'many', 'several']],
      ['Only ___ pupils were absent on the school photo day.', 'a few', ['a little', 'much', 'less']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'countability', q, choices: buildChoices(answer, ds), answer, explain: 'Match the quantifier to countable or uncountable nouns.' };
  },
  futureTense(level, i) {
    const rows = [
      ['Tomorrow, our class ___ the heritage gallery.', 'will visit', ['visit', 'visited', 'is visiting']],
      ['I think it ___ later in the afternoon.', 'will rain', ['rains', 'rained', 'is raining']],
      ['The coach says we ___ extra drills next week.', 'will have', ['have', 'had', 'are having']],
      ['Do not worry. I ___ you after CCA.', 'will call', ['call', 'called', 'am calling']],
      ['Next term, the new student ___ our table-tennis team.', 'will join', ['joins', 'joined', 'is joining']],
      ['"___ you help me carry these books, please?" asked Mrs Lim.', 'Will', ['Did', 'Are', 'Do']],
      ['Mum says we ___ for dinner at Grandpa\'s on Sunday.', 'will go', ['go', 'went', 'are going']],
      ['Look at those clouds — it ___ heavily in a few minutes.', 'is going to rain', ['rains', 'rained', 'has rained']],
      ['Hold on a second — I ___ the door for you.', 'will open', ['open', 'opened', 'am opening']],
      ['By tomorrow morning, my brother ___ his last exam paper.', 'will finish', ['finishes', 'finished', 'has finished']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'future_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Use future forms for plans, promises or predictions.' };
  },
  conjunctions(level, i) {
    const lowerRows = [
      ['Would you prefer noodles ___ rice for lunch?', 'or', ['and', 'but', 'because']],
      ['He stayed quiet ___ he was unsure of the answer.', 'because', ['or', 'but', 'so']],
      ['Pack an extra jacket, ___ the mountain evenings can be surprisingly cold.', 'for', ['yet', 'or', 'and']],
      ['She practised daily, ___ she improved steadily.', 'so', ['or', 'because', 'but']],
      ['The kitten was hungry ___ tired after the long ride home.', 'and', ['or', 'but', 'so']],
      ['Choose the blue file ___ the red one — they hold the same number of pages.', 'or', ['so', 'and', 'because']],
      ['He woke up early, ___ he still missed the school bus.', 'yet', ['so', 'and', 'because']],
      ['Wash your hands carefully ___ you finish playing outside.', 'after', ['so', 'or', 'yet']],
      ['I left early ___ I would not be caught in the storm.', 'so that', ['because', 'or', 'but']],
      ['The volunteers were patient ___ kind to every visitor in the booth.', 'and', ['but', 'or', 'so']],
    ];
    const upperRows = [
      ['The proposal was well-researched; ___, it was approved without changes.', 'consequently', ['nevertheless', 'however', 'although']],
      ['She trained hard throughout the year. ___, she did not qualify for the finals.', 'Nevertheless', ['Therefore', 'Furthermore', 'Consequently']],
      ['The talk was long; ___, every pupil stayed attentive throughout.', 'nonetheless', ['otherwise', 'therefore', 'subsequently']],
      ['He scored well in English ___ despite struggling with comprehension early in the year.', 'although', ['nevertheless', 'consequently', 'furthermore']],
      ['The hall was packed; ___, latecomers had to stand at the back.', 'as a result', ['in contrast', 'on the other hand', 'nonetheless']],
      ['The first plan failed. ___, the team drafted a revised proposal overnight.', 'Subsequently', ['Nevertheless', 'Furthermore', 'Consequently']],
      ['The campsite looked beautiful; ___, it was far too remote for young children.', 'however', ['therefore', 'furthermore', 'subsequently']],
      ['She prepared thoroughly ___ she still felt nervous before the speech.', 'although', ['consequently', 'furthermore', 'nonetheless']],
      ['The evidence was incomplete; ___, the committee deferred its decision.', 'therefore', ['however', 'furthermore', 'subsequently']],
      ['The new system saves time. ___, it reduces the risk of human error.', 'Furthermore', ['Nevertheless', 'Consequently', 'However']],
    ];
    const rows = (level === 'P5' || level === 'P6') ? upperRows : lowerRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'conjunction_function', q, choices: buildChoices(answer, ds), answer, explain: 'and = adds; but/yet = contrast; or = choice; so/so that = result/purpose; because/for = reason; after/before/when = time sequence. Check whether the two clauses agree or contrast, and what relationship connects them.' };
  },
  comparatives(level, i) {
    const rows = [
      ['This puzzle is ___ than yesterday\'s puzzle.', 'harder', ['hard', 'hardest', 'more hard']],
      ['The new route is ___ than the old one.', 'shorter', ['short', 'shortest', 'more short']],
      ['A cheetah is ___ than a rabbit.', 'faster', ['fast', 'fastest', 'more fast']],
      ['Today is ___ than Monday.', 'hotter', ['hot', 'hottest', 'more hot']],
      ['Mei is ___ than Daniel at solving riddles.', 'better', ['gooder', 'best', 'more good']],
      ['The river near my grandmother\'s village is ___ than the canal beside our school.', 'wider', ['widest', 'wide', 'more wide']],
      ['Math homework usually feels ___ than the science project to me.', 'easier', ['easy', 'easiest', 'more easy']],
      ['This year\'s school musical is ___ than last year\'s play.', 'more entertaining', ['entertaining', 'most entertaining', 'entertainingest']],
      ['My cousin is ___ than I am, even though he is two years younger.', 'taller', ['tall', 'tallest', 'more tall']],
      ['Walking home is ___ than waiting for the late bus.', 'quicker', ['quick', 'quickest', 'more quick']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'comparative_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Use a comparative form when comparing two things.' };
  },
  superlatives(level, i) {
    const rows = [
      ['Mount Everest is the ___ mountain in the world.', 'highest', ['higher', 'high', 'more high']],
      ['Of all my classmates, Aisha runs the ___.', 'fastest', ['faster', 'fast', 'most fast']],
      ['That bakery sells the ___ pastries in our neighbourhood.', 'best', ['better', 'goodest', 'most good']],
      ['This is the ___ part of the journey — we are nearly there.', 'easiest', ['easier', 'easy', 'most easy']],
      ['The blue whale is the ___ animal that has ever lived.', 'largest', ['larger', 'large', 'more large']],
      ['Mrs Lee is the ___ teacher I have met — she greets every pupil by name.', 'kindest', ['kinder', 'kind', 'most kind']],
      ['Among the three brothers, Tom is the ___.', 'tallest', ['taller', 'tall', 'most tall']],
      ['This rollercoaster is the ___ ride in the entire amusement park.', 'most exciting', ['more exciting', 'exciting', 'excitingest']],
      ['The Sahara is the ___ hot desert on Earth.', 'largest', ['larger', 'large', 'more large']],
      ['Mei chose the ___ book on the shelf to read first because it looked short.', 'thinnest', ['thinner', 'thin', 'most thin']],
      ['Of all the cakes Mum has ever baked, this one is the ___.', 'most delicious', ['more delicious', 'delicious', 'deliciousest']],
      ['Daniel is the ___ player on the team — he never gives up.', 'most determined', ['more determined', 'determined', 'determinedest']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'superlative_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Use a superlative form (-est or "most ___") to compare three or more things, with "the" before it.' };
  },
  modals(level, i) {
    const lowerRows = [
      ['You ___ submit the form by Friday.', 'must', ['might', 'could', 'would']],
      ['May I borrow your marker? Yes, you ___.', 'may', ['must', 'should', 'would']],
      ['If you feel unwell, you ___ see the school nurse.', 'should', ['might', 'would', 'can\'t']],
      ['The sign says we ___ run in the corridor.', 'must not', ['should', 'might', 'could']],
      ['"___ you please hold the door for the smaller pupils?" asked Mrs Tan.', 'Could', ['Should', 'Must', 'Will']],
      ['You ___ bring your spelling book tomorrow because we have a test.', 'have to', ['could', 'might', 'would']],
      ['Children ___ not cross the road without an adult.', 'must', ['can', 'may', 'will']],
      ['It looks cloudy — it ___ rain later in the afternoon.', 'might', ['must', 'will', 'should']],
      ['You ___ be tired after such a long walk. Sit down for a while.', 'must', ['can', 'might', 'will']],
      ['I ___ swim across the entire pool by myself now!', 'can', ['must', 'should', 'may']],
    ];
    const upperRows = [
      ['She ___ her calculator at home — she had to borrow one for the test.', 'must have left', ['should leave', 'must leave', 'could leave']],
      ['You ___ told me earlier — I would have waited for you.', 'should have', ['should', 'must have', 'could']],
      ['He looks pale; he ___ been unwell since the start of the week.', 'must have', ['should have', 'could have', 'would have']],
      ['We ___ finished the whole project by now if the printer had not broken down.', 'could have', ['could', 'must have', 'should']],
      ['She ___ left without saying goodbye — that is so unlike her.', 'cannot have', ['could not', 'must not have', 'should not']],
      ['If only I ___ studied harder, I might have scored better.', 'had', ['have', 'would have', 'could']],
      ['You ___ not have borrowed the book without asking — it is not yours.', 'should', ['must', 'could', 'might']],
      ['They ___ arrived already — the bus was supposed to leave an hour ago.', 'should have', ['must have', 'could have', 'would']],
      ['I ___ have imagined it — the lights really did flicker on their own.', 'could not', ['must not', 'should not', 'would not']],
      ['He ___ have known about the change in the timetable; he was absent that day.', 'might not', ['must not', 'should not', 'could']],
    ];
    const rows = (level === 'P5' || level === 'P6') ? upperRows : lowerRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'modal_meaning', q, choices: buildChoices(answer, ds), answer, explain: 'must = strong obligation or logical certainty; should = advice; may/can = permission; might/could = possibility; must not = prohibition; have to = external obligation. Read the context to decide the strength and type of meaning needed.' };
  },
  presentPerfect(level, i) {
    const rows = [
      ['She ___ her assignment already.', 'has completed', ['completed', 'had completed', 'is completing']],
      ['We ___ this museum before.', 'have visited', ['visited', 'had visited', 'are visiting']],
      ['The boys ___ their shoes, so they are ready.', 'have polished', ['polished', 'had polished', 'are polishing']],
      ['He ___ his wallet, so he cannot pay now.', 'has lost', ['lost', 'had lost', 'is losing']],
      ['I ___ the new librarian three times this week.', 'have met', ['met', 'had met', 'am meeting']],
      ['My grandmother ___ in this town since she was a child.', 'has lived', ['lived', 'had lived', 'is living']],
      ['The volunteers ___ over fifty bags of donations so far.', 'have packed', ['packed', 'had packed', 'are packing']],
      ['Our teacher ___ the test papers, so we will know our scores tomorrow.', 'has marked', ['marked', 'had marked', 'was marking']],
      ['I ___ to Penang twice and would happily go again.', 'have travelled', ['travelled', 'had travelled', 'am travelling']],
      ['The cleaners ___ the corridor, so please walk carefully on the wet floor.', 'have just mopped', ['just mop', 'just mopping', 'were mopping']],
      ['She ___ her room since Monday — it has become a mess.', 'has not tidied', ['did not tidy', 'is not tidying', 'had not tidied']],
      ['The technician ___ the broken projector, so the lesson can begin.', 'has fixed', ['fixed', 'had fixed', 'is fixing']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'present_perfect', q, choices: buildChoices(answer, ds), answer, explain: 'Present perfect links a past action to the present result.' };
  },
  pastCont(level, i) {
    const rows = [
      ['At 8 p.m., we ___ for the oral exam.', 'were revising', ['revised', 'have revised', 'are revising']],
      ['While I was washing dishes, my brother ___ the floor.', 'was mopping', ['mopped', 'has mopped', 'is mopping']],
      ['They ___ when the principal entered.', 'were talking', ['talked', 'have talked', 'are talking']],
      ['At that moment, the class ___ a video.', 'was watching', ['watched', 'has watched', 'is watching']],
      ['I ___ to my favourite song when the doorbell rang.', 'was listening', ['listened', 'have listened', 'am listening']],
      ['The students ___ quietly in the library when the alarm sounded.', 'were reading', ['read', 'have read', 'are reading']],
      ['At 3 p.m. yesterday, my parents ___ groceries at the supermarket.', 'were buying', ['bought', 'have bought', 'are buying']],
      ['While the coach ___ the strategy, the team listened carefully.', 'was explaining', ['explained', 'has explained', 'is explaining']],
      ['It ___ heavily when we boarded the bus this morning.', 'was raining', ['rained', 'has rained', 'is raining']],
      ['Sarah ___ a postcard to her cousin when the phone rang.', 'was writing', ['wrote', 'has written', 'is writing']],
      ['The little kittens ___ in the warm sunshine when I found them.', 'were sleeping', ['slept', 'have slept', 'are sleeping']],
      ['While Father ___ the car, Mother prepared lunch.', 'was washing', ['washed', 'has washed', 'is washing']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'past_continuous', q, choices: buildChoices(answer, ds), answer, explain: 'Past continuous describes an action in progress at a past time.' };
  },
  adjAdverbs(level, i) {
    const rows = [
      ['The speaker explained the rule ___.', 'clearly', ['clear', 'clearest', 'more clear']],
      ['After the race, the runners looked ___.', 'tired', ['tiredly', 'more tiredly', 'tiring']],
      ['Please answer the question ___.', 'politely', ['polite', 'politer', 'politeness']],
      ['The soup tastes ___.', 'delicious', ['deliciously', 'more deliciously', 'deliciousness']],
      ['Aisha sings ___ in the school choir.', 'beautifully', ['beautiful', 'beautifuller', 'beautifulness']],
      ['The puppy seemed ___ after its long nap.', 'happy', ['happily', 'more happily', 'happiness']],
      ['The chef chopped the vegetables ___ before adding them to the pot.', 'quickly', ['quick', 'quickest', 'more quick']],
      ['The new perfume smells ___.', 'sweet', ['sweetly', 'more sweetly', 'sweetness']],
      ['The driver took the corner ___ to avoid an accident.', 'carefully', ['careful', 'carefuler', 'carefulness']],
      ['The kitten felt ___ in its cosy basket.', 'safe', ['safely', 'more safely', 'safeness']],
      ['Mrs Tan explained the question ___ so even the youngest pupils understood.', 'patiently', ['patient', 'patientness', 'more patient']],
      ['The fresh fruit looked ___ on the breakfast tray.', 'appetising', ['appetisingly', 'more appetisingly', 'appetisement']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'adjective_adverb_choice', q, choices: buildChoices(answer, ds), answer, explain: 'Use adjectives after linking verbs and adverbs to describe actions.' };
  },
  auxiliaries(level, i) {
    const rows = [
      ['___ you finished your corrections yet?', 'Have', ['Do', 'Did', 'Are']],
      ['Why ___ the players so quiet today?', 'are', ['is', 'was', 'has']],
      ['___ she submit the file yesterday?', 'Did', ['Does', 'Do', 'Has']],
      ['How many chapters ___ you read so far?', 'have', ['has', 'had', 'are']],
      ['Where ___ you going after the assembly?', 'are', ['is', 'do', 'have']],
      ['___ the teacher already explained the new topic?', 'Has', ['Have', 'Did', 'Was']],
      ['Why ___ Jenny crying when I saw her in the canteen?', 'was', ['is', 'has', 'did']],
      ['When ___ the exhibition open last weekend?', 'did', ['does', 'has', 'is']],
      ['___ your father reading the newspaper at the moment?', 'Is', ['Has', 'Did', 'Do']],
      ['How long ___ you been waiting for the bus today?', 'have', ['has', 'are', 'did']],
      ['___ they bring their swimming kit yesterday?', 'Did', ['Do', 'Have', 'Are']],
      ['What ___ the librarian say about the missing book?', 'did', ['does', 'is', 'has']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'aux_question_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Match the auxiliary to the tense: Did (simple past), Do/Does (simple present), Is/Are/Was/Were (continuous), Have/Has/Had (perfect), Will (future). The auxiliary must also agree with the subject in number and person.' };
  },
  tenseAwareness(level, i) {
    const p3Rows = [
      ['She practises daily, so she usually ___ well in performances.', 'performs', ['performed', 'is performing', 'has performed']],
      ['Right now, my cousin ___ a documentary about marine animals.', 'is watching', ['watches', 'watched', 'will watch']],
      ['Last weekend, the team ___ in the pouring rain.', 'trained', ['trains', 'is training', 'has trained']],
      ['When the alarm rang, the children ___ in the corridor.', 'were playing', ['played', 'play', 'have played']],
      ['We ___ this museum twice, so the layout is familiar to us.', 'have visited', ['visited', 'were visiting', 'visit']],
      ['Every evening, Father ___ the dog at the park near our block.', 'walks', ['walked', 'is walking', 'will walk']],
      ['Tomorrow, our class ___ the science centre.', 'will visit', ['visits', 'visited', 'is visiting']],
      ['Look! Those sparrows ___ at the crumbs near the canteen.', 'are pecking', ['peck', 'pecked', 'have pecked']],
    ];
    const upperRows = [
      ['By the time we reached the hall, the programme ___.', 'had started', ['has started', 'was starting', 'starts']],
      ['She practises daily, so she usually ___ well.', 'performs', ['performed', 'is performing', 'has performed']],
      ['We ___ for twenty minutes before the rain stopped.', 'had been waiting', ['have waited', 'are waiting', 'waited']],
      ['Next month, they ___ the same project for a year.', 'will have done', ['have done', 'did', 'do']],
      ['Whenever I visit Singapore, I always ___ at my grandmother\'s house.', 'stay', ['stayed', 'have stayed', 'will stay']],
      ['Right now, my cousin ___ a documentary about marine animals.', 'is watching', ['watches', 'watched', 'will watch']],
      ['By next Friday, the construction team ___ the new bridge.', 'will have finished', ['finished', 'has finished', 'will finish']],
      ['Every morning before the bell rang, the children ___ in the courtyard.', 'gathered', ['gather', 'are gathering', 'have gathered']],
      ['Look! That little boy ___ his ice cream all over his shirt.', 'has spilled', ['spilled', 'spills', 'will spill']],
      ['When I called Sarah last night, she ___ a long bath.', 'was taking', ['took', 'has taken', 'takes']],
      ['By the time you arrive, I ___ dinner already.', 'will have cooked', ['cooked', 'cook', 'have cooked']],
      ['Father ___ to work by train every day for the past ten years.', 'has been going', ['goes', 'went', 'is going']],
    ];
    const rows = level === 'P3' ? p3Rows : upperRows;
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'tense_selection', q, choices: buildChoices(answer, ds), answer, explain: 'Look for time signals: right now/at this moment = present continuous; yesterday/last week = simple past; every day/usually = simple present; when X happened, Y was happening = past continuous; since/already/just = present perfect; by the time/before = past perfect.' };
  },
  pastPerfect(level, i) {
    const rows = [
      ['The train had left before we ___ the station.', 'reached', ['reach', 'have reached', 'are reaching']],
      ['She ___ her notes before the quiz began.', 'had revised', ['has revised', 'revised', 'was revising']],
      ['By 6 p.m., they ___ all the banners.', 'had hung', ['have hung', 'hung', 'were hanging']],
      ['He was hungry because he ___ breakfast.', 'had skipped', ['has skipped', 'skipped', 'is skipping']],
      ['When I switched on the television, the news ___ already.', 'had ended', ['has ended', 'ended', 'was ending']],
      ['The audience ___ when the play finally began at 8 p.m.', 'had been waiting', ['has been waiting', 'waited', 'is waiting']],
      ['By the time the fire engines arrived, neighbours ___ the small fire.', 'had put out', ['have put out', 'put out', 'were putting out']],
      ['Lin felt embarrassed because she ___ the wrong jersey to the match.', 'had brought', ['has brought', 'brought', 'is bringing']],
      ['We ___ for the keys for an hour when Father finally found them in the car.', 'had searched', ['have searched', 'searched', 'are searching']],
      ['The dog wagged its tail because it ___ its owner from a distance.', 'had spotted', ['has spotted', 'spots', 'is spotting']],
      ['The shop assistant explained that the last set ___ minutes earlier.', 'had been sold', ['has been sold', 'was sold', 'is being sold']],
      ['Once the storm ___, we went outside to check the garden.', 'had passed', ['has passed', 'passed', 'is passing']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'past_perfect_sequence', q, choices: buildChoices(answer, ds), answer, explain: 'Past perfect shows the earlier past action.' };
  },
  perfectContinuousTenses(level, i) {
    const rows = [
      ['By noon, we ___ for two hours.', 'had been practising', ['have practised', 'practised', 'are practising']],
      ['She looks tired because she ___ non-stop since dawn.', 'has been working', ['worked', 'had worked', 'was working']],
      ['They ___ in this neighbourhood for ten years.', 'have been living', ['lived', 'had lived', 'are living']],
      ['By next week, he ___ at this task for a month.', 'will have been working', ['has worked', 'worked', 'is working']],
      ['I ___ the same novel for three days because it is so long.', 'have been reading', ['read', 'had read', 'was reading']],
      ['The children ___ in the rain for an hour before their mother called them in.', 'had been playing', ['have been playing', 'played', 'are playing']],
      ['By the time the concert ends tonight, the band ___ for nearly four hours.', 'will have been performing', ['has performed', 'performed', 'will perform']],
      ['Mei ___ piano lessons since she was six years old.', 'has been taking', ['took', 'had taken', 'will take']],
      ['When Mother finally came home, the dog ___ at the door for ages.', 'had been waiting', ['has been waiting', 'waited', 'is waiting']],
      ['Our class ___ for the field trip ever since the term began.', 'has been preparing', ['prepared', 'had prepared', 'is preparing']],
      ['The rain ___ steadily for two days now, and the field is flooded.', 'has been falling', ['fell', 'had fallen', 'falls']],
      ['By the end of this month, she ___ in the gym every weekend for half a year.', 'will have been training', ['has trained', 'is training', 'trains']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'perfect_continuous', q, choices: buildChoices(answer, ds), answer, explain: 'Perfect continuous tenses emphasise duration of an action.' };
  },
  conditionals(level, i) {
    const rows = [
      ['If you heat ice, it ___ into water.', 'melts', ['melted', 'will melt', 'has melted']],
      ['If it rains this afternoon, we ___ indoors.', 'will stay', ['stayed', 'stay', 'have stayed']],
      ['If she had left earlier, she ___ the bus.', 'would have caught', ['catches', 'will catch', 'has caught']],
      ['If I were class chairperson, I ___ clearer notices.', 'would write', ['write', 'wrote', 'will write']],
      ['If plants do not get sunlight, they ___ poorly.', 'grow', ['grew', 'will grow', 'have grown']],
      ['If we finish the exam early, we ___ at our answers carefully.', 'will look', ['looked', 'look', 'have looked']],
      ['If Tom had remembered the umbrella, he ___ wet on the way home.', 'would not have got', ['will not get', 'does not get', 'has not got']],
      ['If I ___ a superpower, I would choose the ability to fly.', 'had', ['have', 'will have', 'will had']],
      ['Water boils at 100°C if you ___ it long enough.', 'heat', ['heated', 'will heat', 'have heated']],
      ['If the band practises every weekend, they ___ steady progress.', 'will make', ['made', 'make', 'have made']],
      ['If we had not missed the train, we ___ the concert.', 'would have caught', ['will catch', 'catch', 'are catching']],
      ['If our teacher ___ here today, she would explain the homework.', 'were', ['is', 'will be', 'has been']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'if_clauses', q, choices: buildChoices(answer, ds), answer, explain: 'Match the if-clause type with the correct result verb form.' };
  },
  passiveVoice(level, i) {
    const rows = [
      ['The science models ___ by the P5 pupils.', 'were built', ['built', 'are building', 'have built']],
      ['The report ___ by the committee tomorrow.', 'will be reviewed', ['reviews', 'reviewed', 'has reviewed']],
      ['The hall ___ before the event started.', 'had been cleaned', ['cleaned', 'was cleaning', 'has cleaned']],
      ['The safety rules ___ to all new students.', 'are explained', ['explain', 'explained', 'have explained']],
      ['The classroom windows ___ every Friday afternoon.', 'are wiped', ['wipe', 'wiped', 'have wiped']],
      ['The lost wallet ___ to the front office yesterday.', 'was returned', ['returned', 'has returned', 'is returning']],
      ['By tomorrow noon, all the prizes ___.', 'will have been packed', ['will pack', 'pack', 'has packed']],
      ['Each year, thousands of trees ___ along the new highway.', 'are planted', ['plant', 'planted', 'have planted']],
      ['The new gym ___ since January and is now ready to use.', 'has been built', ['built', 'is building', 'will build']],
      ['When we arrived, the food ___ already.', 'had been served', ['has been served', 'served', 'is serving']],
      ['The library books ___ by the volunteers right now.', 'are being sorted', ['sort', 'sorted', 'have sorted']],
      ['The award ___ to the most improved player every year.', 'is given', ['gives', 'gave', 'has given']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'passive_forms', q, choices: buildChoices(answer, ds), answer, explain: 'Passive voice focuses on the action or receiver, not the doer.' };
  },
  relativeClauses(level, i) {
    const rows = [
      ['The teacher ___ guided us is retiring this year.', 'who', ['which', 'whose', 'whom']],
      ['This is the book ___ cover was torn.', 'whose', ['who', 'which', 'whom']],
      ['The park ___ we visited has a new playground.', 'that', ['who', 'whose', 'whom']],
      ['The scientist to ___ we wrote replied kindly.', 'whom', ['who', 'which', 'whose']],
      ['The dog, ___ tail kept wagging, was clearly excited to see us.', 'whose', ['who', 'which', 'whom']],
      ['Mrs Lee, ___ teaches us mathematics, also runs the chess club.', 'who', ['which', 'whose', 'whom']],
      ['The bicycle ___ I borrowed has a flat tyre.', 'that', ['who', 'whose', 'whom']],
      ['The girl with ___ I shared my umbrella thanked me politely.', 'whom', ['who', 'which', 'whose']],
      ['The museum ___ opened last year is very popular with families.', 'which', ['who', 'whose', 'whom']],
      ['I met the author ___ wrote my favourite picture book.', 'who', ['which', 'whose', 'whom']],
      ['This is the corridor ___ floor was newly polished.', 'whose', ['who', 'which', 'whom']],
      ['The volunteers, most of ___ are seniors, run the soup kitchen on weekends.', 'whom', ['who', 'which', 'whose']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'relative_pronouns', q, choices: buildChoices(answer, ds), answer, explain: 'Use the relative pronoun that fits the noun and clause function.' };
  },
  reportedSpeech(level, i) {
    const rows = [
      ['Mum said that she ___ home late that evening.', 'would be', ['is', 'was', 'has been']],
      ['The coach told us that we ___ to bring water bottles.', 'had to', ['have to', 'must', 'are having to']],
      ['Alicia said that she ___ the worksheet already.', 'had finished', ['has finished', 'finished', 'is finishing']],
      ['He asked whether I ___ the notice.', 'had read', ['have read', 'read', 'am reading']],
      ['The principal announced that the school ___ a charity drive the following week.', 'would hold', ['will hold', 'holds', 'has held']],
      ['Tom said that his sister ___ to swim when she was four.', 'had learnt', ['has learnt', 'learnt', 'was learning']],
      ['The librarian reminded us that the books ___ by Friday.', 'had to be returned', ['must be returned', 'are returned', 'were returning']],
      ['Mei explained that she ___ the new dance steps every morning.', 'was practising', ['practises', 'has practised', 'will practise']],
      ['Father told the children that they ___ noise after 9 p.m.', 'should not make', ['must not make', 'do not make', 'have not made']],
      ['The guide warned us that the path ___ very slippery after the rain.', 'was', ['is', 'has been', 'will be']],
      ['The doctor said that I ___ plenty of water every day.', 'should drink', ['must drink', 'drink', 'have drunk']],
      ['She asked me where I ___ the spare key.', 'had hidden', ['have hidden', 'hid', 'am hiding']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'speech_reporting', q, choices: buildChoices(answer, ds), answer, explain: 'Reported speech usually shifts tense and pronouns.' };
  },
  inversion(level, i) {
    const rows = [
      ['Rarely ___ such a neat project display.', 'have we seen', ['we have seen', 'we saw', 'had we see']],
      ['Not only ___ the plan clear, but it was practical too.', 'was', ['is', 'were', 'has']],
      ['Hardly ___ when the bell rang.', 'had we sat down', ['we had sat down', 'we sit down', 'have we sat down']],
      ['Only after checking the data ___ the error.', 'did she notice', ['she noticed', 'has she noticed', 'she notices']],
      ['Never ___ such a vivid double rainbow before that afternoon.', 'had I seen', ['I had seen', 'I saw', 'have I see']],
      ['Seldom ___ this generous to the volunteers as he was last weekend.', 'is Mr Lim', ['Mr Lim is', 'Mr Lim was', 'has Mr Lim']],
      ['No sooner ___ the door than the cat darted out.', 'had I opened', ['I had opened', 'I opened', 'have I opened']],
      ['Under no circumstances ___ the laboratory unsupervised.', 'should pupils enter', ['pupils should enter', 'pupils enter', 'pupils entered']],
      ['Little ___ that the surprise party was for him.', 'did Daniel know', ['Daniel knew', 'Daniel did know', 'Daniel has known']],
      ['So loud ___ that I had to cover my ears immediately.', 'was the thunder', ['the thunder was', 'the thunder is', 'thunder had been']],
      ['Only when the rain stopped ___ to head home.', 'did we decide', ['we decided', 'we had decided', 'we decide']],
      ['Not until the last student left ___ to lock up the classroom.', 'did the teacher begin', ['the teacher began', 'the teacher begins', 'began the teacher']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'inversion_patterns', q, choices: buildChoices(answer, ds), answer, explain: 'Certain fronted phrases trigger inversion in formal structures.' };
  },
  homophones(level, i) {
    const rows = [
      ['Please put ___ bags under the desk before the test begins.', 'your', ['you\'re', 'yore', 'ur']],
      ['The cat licked ___ paw and then curled up to sleep.', 'its', ['it\'s', 'its\'', 'their']],
      ['___ going to rain this afternoon, so bring an umbrella.', 'It\'s', ['Its', 'It\'ll', 'Its\'']],
      ['The boys left ___ water bottles on the field after PE.', 'their', ['there', 'they\'re', 'theirs']],
      ['"___ the art room? I cannot find it," the new student asked.', 'Where\'s', ['Were\'s', 'Wears', 'Whereas']],
      ['The teacher praised the class because ___ all focused throughout the lesson.', 'they\'re', ['their', 'there', 'theirs']],
      ['Place the books over ___, next to the reading corner.', 'there', ['their', 'they\'re', 'here']],
      ['___ a long way from here to the community library.', 'It\'s', ['Its', 'It\'ll', 'Its\'']],
      ['Do you know ___ backpack this is? It has no name tag.', 'whose', ['who\'s', 'whos', 'who']],
      ['"___ your favourite book so far?" the librarian asked.', 'What\'s', ['Whats', 'What\'re', 'Whatever']],
      ['___ going to be the class chairperson this term?', 'Who\'s', ['Whose', 'Whos', 'Who']],
      ['The team collected all ___ equipment before leaving the field.', 'its', ['it\'s', 'their', 'its\'']],
      ['She wore ___ new school shoes for the first time on Monday.', 'her', ['hers', 'she\'s', 'herself']],
      ['We packed ___ lunches the night before the excursion.', 'our', ['ours', 'we\'re', 'hour']],
      ['___ been three weeks since the class started the project.', 'It\'s', ['Its', 'Its\'', 'It\'ll']],
      ['The guide showed us ___ to find the emergency exits.', 'where', ['were', 'wear', 'there']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'homophones',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'Homophones sound the same but are spelled differently. its = belonging to it; it\'s = it is/it has. their = belonging to them; there = place; they\'re = they are. your = belonging to you; you\'re = you are. whose = belonging to whom; who\'s = who is.',
    };
  },
  wordForms(level, i) {
    const rows = [
      ['The judges were impressed by the ___ of her piano performance.', 'brilliance', ['brilliant', 'brilliantly', 'brillianted']],
      ['The school counsellor encouraged the pupils to be ___ of their own feelings.', 'aware', ['awareness', 'awared', 'unaware']],
      ['The committee made a ___ to plant more trees along the school path.', 'decision', ['decide', 'decisive', 'decisively']],
      ['He spoke ___ when addressing the crowd at the assembly.', 'confidently', ['confident', 'confidence', 'confide']],
      ['The ___ of the volunteers was evident from the start.', 'dedication', ['dedicated', 'dedicatedly', 'dedicate']],
      ['Her ___ response impressed the panel of judges.', 'creative', ['creation', 'creatively', 'creativity']],
      ['The ___ of the new facilities was announced at the school open day.', 'completion', ['complete', 'completely', 'completed']],
      ['The athlete trained with great ___ to prepare for the national competition.', 'determination', ['determined', 'determinedly', 'determine']],
      ['The audience applauded ___ at the end of the performance.', 'enthusiastically', ['enthusiastic', 'enthusiasm', 'enthuse']],
      ['The doctor explained that the patient\'s ___ was remarkable.', 'recovery', ['recover', 'recovered', 'recoverable']],
      ['The principal reminded pupils that ___ is key to doing well.', 'perseverance', ['persevere', 'perseverant', 'persevering']],
      ['The science teacher gave a clear ___ of how photosynthesis works.', 'explanation', ['explain', 'explainable', 'explanatory']],
      ['The committee was ___ about the new timetable changes.', 'optimistic', ['optimism', 'optimistically', 'optimist']],
      ['The ___ of the event was handled by a team of senior pupils.', 'organisation', ['organise', 'organised', 'organisational']],
      ['She spoke with great ___ despite being the youngest speaker.', 'maturity', ['mature', 'maturely', 'maturing']],
      ['The ___ between the two teams was intense throughout the final match.', 'competition', ['compete', 'competitive', 'competitively']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'word_forms',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'Word forms: nouns name things (dedication, completion); adjectives describe nouns (dedicated, complete); adverbs describe verbs/adjectives (dedicatedly, completely); verbs show action (dedicate, complete). Identify the role the blank plays in the sentence before choosing the form.',
    };
  },
  gerundInfinitive(level, i) {
    const rows = [
      ['She enjoys ___ the piano for an hour every evening.', 'playing', ['play', 'to play', 'played']],
      ['We managed ___ the last bus just in time.', 'to catch', ['catching', 'caught', 'catch']],
      ['He decided ___ in the school play this year.', 'to take part', ['taking part', 'took part', 'take part']],
      ['Please finish ___ your worksheet before the bell rings.', 'doing', ['to do', 'done', 'did']],
      ['Mei hopes ___ a doctor when she grows up.', 'to become', ['becoming', 'become', 'became']],
      ['I remember ___ my water bottle this morning — it is safely in my bag.', 'packing', ['to pack', 'packed', 'pack']],
      ['He stopped ___ the view before continuing the hike.', 'to admire', ['admiring', 'admired', 'admire']],
      ['The coach suggested ___ earlier to warm up properly.', 'arriving', ['to arrive', 'arrived', 'arrive']],
      ['She agreed ___ the class presentation on behalf of the group.', 'to give', ['giving', 'gave', 'give']],
      ['They avoided ___ the busy road during the morning rush.', 'crossing', ['to cross', 'crossed', 'cross']],
      ['My brother plans ___ computing at the polytechnic next year.', 'to study', ['studying', 'studied', 'study']],
      ['Instead of ___ the escalator, they climbed the stairs for exercise.', 'taking', ['take', 'to take', 'taken']],
      ['The class kept ___ questions even after the lesson ended.', 'asking', ['to ask', 'asked', 'ask']],
      ['He forgot ___ his PE kit at home, so he borrowed a spare set.', 'to bring', ['bringing', 'brought', 'bring']],
      ['The volunteers offered ___ the elderly residents to the community hall.', 'to escort', ['escorting', 'escorted', 'escort']],
      ['She practises ___ her lines for the drama every night before bed.', 'reciting', ['to recite', 'recited', 'recite']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return {
      subskill: 'gerund_infinitive',
      q,
      choices: buildChoices(answer, ds),
      answer,
      explain: 'Certain verbs take gerunds (-ing forms), others take infinitives (to + verb). Some, like "stop" and "remember", change meaning depending on which is used.',
    };
  },
  mixedGrammar(level, i) {
    const rows = [
      ['Neither the prefect nor the players ___ responsible for the delay.', 'were', ['was', 'is', 'has']],
      ['By next June, she ___ this school for six years.', 'will have attended', ['has attended', 'attended', 'attends']],
      ['The worksheet, ___ was printed yesterday, is already outdated.', 'which', ['who', 'whom', 'whose']],
      ['If they had checked the map earlier, they ___ lost.', 'would not have got', ['do not get', 'will not get', 'have not got']],
      ['Hardly anyone ___ that the old library would close so suddenly.', 'expected', ['expects', 'has expected', 'is expecting']],
      ['The athletes, most of ___ are still teenagers, set a new national record.', 'whom', ['who', 'which', 'whose']],
      ['Either Lisa or her brothers ___ going to lead the orientation tour.', 'are', ['is', 'was', 'has']],
      ['By the time the festival ends tonight, the dancers ___ for nearly five hours.', 'will have been performing', ['have performed', 'performed', 'will perform']],
      ['The lost kitten ___ to its owner after a kind passer-by called the number on the collar.', 'was returned', ['returned', 'has returned', 'is returning']],
      ['Should it ___ tomorrow, the outdoor lesson will move to the hall.', 'rain', ['rains', 'rained', 'is raining']],
      ['The book ___ I was reading at lunch belongs to my elder sister.', 'that', ['who', 'whose', 'whom']],
      ['Mei said that she ___ how to swim before she turned six.', 'had learnt', ['has learnt', 'learnt', 'is learning']],
    ];
    const [q, answer, ds] = rotate(rows, i);
    return { subskill: 'exam_mix', q, choices: buildChoices(answer, ds), answer, explain: 'Use all sentence clues to choose the most accurate grammar form.' };
  },
};

function buildLevel(level) {
  const categories = LEVEL_CATEGORY_PLAN[level];
  const targetCount = 150;
  const items = [];
  const categoryCursor = Object.fromEntries(categories.map(c => [c, 0]));

  for (let i = 0; i < targetCount; i += 1) {
    const category = categories[i % categories.length];
    const localIndex = categoryCursor[category];
    categoryCursor[category] += 1;
    const spec = GRAMMAR_BUILDERS[category](level, localIndex);
    const id = `g-${level.toLowerCase()}-${String(i + 1).padStart(3, '0')}`;
    items.push({
      id,
      level,
      category,
      subskill: spec.subskill,
      difficulty: difficultyFor(level, i),
      q: spec.q,
      choices: spec.choices,
      answer: spec.answer,
      explain: spec.explain,
    });
  }

  return items;
}

export const GRAMMAR_MCQ_ITEMS = Object.fromEntries(
  GRAMMAR_MCQ_LEVELS.map(level => [level, buildLevel(level)]),
);
