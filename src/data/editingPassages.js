/**
 * Editing Quest passages.
 *
 * Each passage is written once, as correct English, with every planted error
 * marked in place:
 *
 *   I [[has => have :: g :: svAgreement :: Use "have" with "I".]] a red bag.
 *
 * The four parts are: the wrong word the child sees, the correction, the kind
 * of error (g = grammar, s = spelling), the rule it practises (a key of
 * EDITING_TEACHBACK in editingQuest.js), and a one-line explanation.
 *
 * Writing a passage this way keeps three things true by construction:
 *   · every error sits at a known place in the passage, so the game can
 *     underline that exact word even when the same word appears twice;
 *   · the fully corrected passage is real, correct English, because it is the
 *     text that was written;
 *   · every target really is an error. There are no "trick" targets that are
 *     already correct.
 *
 * Passages grow with the level: six errors at P1 up to twelve at P6, where the
 * split is six spelling and six grammar, as in the PSLE editing section.
 */

export const EDITING_LEVELS = {
  1: 'P1 Editing Foundations',
  2: 'P2 Editing Foundations',
  3: 'P3 Editing Foundations',
  4: 'P4 Editing Drill',
  5: 'P5 Editing Drill',
  6: 'P6 PSLE Editing Simulation',
};

const XP_BY_LEVEL = { 1: 30, 2: 36, 3: 44, 4: 54, 5: 64, 6: 72 };

const SOURCES = {
  // ───────────────────────────────────────────────────────────────────────
  // P1: is/are, has/have, simple present and simple past of common verbs,
  // a/an, short everyday spellings. Six errors.
  // ───────────────────────────────────────────────────────────────────────
  1: [
    {
      id: 'eq-p1-01',
      title: 'My School Bag',
      text:
        'I [[has => have :: g :: svAgreement :: Use "have" with "I".]] a red school bag. ' +
        'It [[are => is :: g :: svAgreement :: "It" is one thing, so use "is".]] big and light. ' +
        'Yesterday I [[pack => packed :: g :: tense :: "Yesterday" tells us it is over, so the verb needs -ed: packed.]] my books in it. ' +
        'I also put in my [[pencel => pencil :: s :: spelling :: The word is spelt p-e-n-c-i-l.]] case. ' +
        'My sister [[help => helped :: g :: tense :: This happened yesterday, so use "helped".]] me to zip the bag. ' +
        'Now my bag is ready for [[scool => school :: s :: spelling :: "School" has a silent h after the c.]].',
      tryThis: [
        'Write two sentences about your school bag using "is" and "has".',
        'Write three sentences about packing your bag yesterday. Use past tense verbs.',
      ],
    },
    {
      id: 'eq-p1-02',
      title: 'Recess Time',
      text:
        'At recess, I [[goes => go :: g :: svAgreement :: With "I" the verb has no -es: I go.]] to the canteen with my [[frend => friend :: s :: spelling :: "Friend" has an i before the e.]] Ali. ' +
        'We [[buys => buy :: g :: svAgreement :: "We" is more than one, so the verb has no -s: we buy.]] noodles and sit on a bench. ' +
        'The noodles [[is => are :: g :: svAgreement :: "Noodles" is more than one, so use "are".]] hot, so we eat slowly. ' +
        'Ali [[have => has :: g :: svAgreement :: Ali is one person, so use "has".]] a banana too. ' +
        'After that, we [[plays => play :: g :: svAgreement :: "We" takes "play", not "plays".]] catch until the bell rings.',
      tryThis: [
        'Write two sentences about recess using "I" and "we".',
        'Write three sentences about what your friend does at recess. Check each verb.',
      ],
    },
    {
      id: 'eq-p1-03',
      title: 'My Cat Mimi',
      text:
        'I have [[an => a :: g :: articles :: "Cat" starts with a consonant sound, so use "a".]] cat named Mimi. ' +
        'She [[have => has :: g :: svAgreement :: "She" is one, so use "has".]] soft white fur. ' +
        'Every morning, Mimi [[drink => drinks :: g :: svAgreement :: Mimi is one cat, so the verb needs -s: drinks.]] milk from a small bowl. ' +
        'Yesterday she [[jump => jumped :: g :: tense :: "Yesterday" needs the past tense: jumped.]] onto my bed and slept there. ' +
        'I [[luv => love :: s :: spelling :: The word is spelt l-o-v-e.]] my cat very much. ' +
        'Mimi and I [[is => are :: g :: svAgreement :: "Mimi and I" is two, so use "are".]] good friends.',
      tryThis: [
        'Write two sentences about a pet using "has" and "is".',
        'Write three sentences about what a pet does every morning.',
      ],
    },
    {
      id: 'eq-p1-04',
      title: 'At the Playground',
      text:
        'Yesterday my brother and I [[go => went :: g :: tense :: The past tense of "go" is "went".]] to the playground. ' +
        'There [[was => were :: g :: svAgreement :: "Many children" is more than one, so use "were".]] many children there. ' +
        'I [[climb => climbed :: g :: tense :: It happened yesterday, so use "climbed".]] up the slide and my brother sat on a [[sweeng => swing :: s :: spelling :: The word is spelt s-w-i-n-g.]]. ' +
        'Then it started to [[rane => rain :: s :: spelling :: The long a sound here is spelt "ai": rain.]]. ' +
        'We [[runned => ran :: g :: tense :: The past tense of "run" is "ran".]] home quickly.',
      tryThis: [
        'Write two sentences about the playground using "went" and "played".',
        'Write four sentences about a day out. Use a different past tense verb in each.',
      ],
    },
    {
      id: 'eq-p1-05',
      title: 'Breakfast',
      text:
        'My mother [[make => makes :: g :: svAgreement :: "My mother" is one person, so the verb needs -s: makes.]] breakfast every day. ' +
        'Today there [[is => are :: g :: svAgreement :: "Two eggs" is more than one, so use "are".]] two eggs on my plate. ' +
        'I eat [[a => an :: g :: articles :: "Egg" starts with a vowel sound, so use "an".]] egg and some [[bred => bread :: s :: spelling :: The short e sound here is spelt "ea": bread.]]. ' +
        'My father [[drink => drinks :: g :: svAgreement :: "My father" is one person, so use "drinks".]] coffee. ' +
        'He [[say => says :: g :: svAgreement :: "He" takes "says".]] breakfast is the best meal of the day.',
      tryThis: [
        'Write two sentences about breakfast using "a" and "an".',
        'Write three sentences about what your family eats in the morning.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P2: irregular past tense, pronouns, prepositions, plurals. Seven errors.
  // ───────────────────────────────────────────────────────────────────────
  2: [
    {
      id: 'eq-p2-01',
      title: 'Sports Day',
      text:
        'Last Friday, our school [[have => had :: g :: tense :: "Last Friday" is in the past, so use "had".]] its Sports Day. ' +
        'My classmates and I [[was => were :: g :: svAgreement :: "My classmates and I" is more than one, so use "were".]] very excited. ' +
        'I [[runned => ran :: g :: tense :: The past tense of "run" is "ran".]] in the relay race with three [[frends => friends :: s :: spelling :: "Friends" has an i before the e.]]. ' +
        'Our team [[win => won :: g :: tense :: The past tense of "win" is "won".]] a silver medal. ' +
        'My teacher [[gived => gave :: g :: tense :: The past tense of "give" is "gave".]] each of us a big smile. ' +
        'It was a [[wunderful => wonderful :: s :: spelling :: "Wonderful" begins with w-o-n.]] day.',
      tryThis: [
        'Write three sentences about a race using "ran", "won" and "gave".',
        'Write five sentences about your Sports Day. Underline each past tense verb.',
      ],
    },
    {
      id: 'eq-p2-02',
      title: 'The Library',
      text:
        'Every Tuesday, my class [[go => goes :: g :: svAgreement :: "My class" is one group, so use "goes".]] to the school library. ' +
        'The library [[have => has :: g :: svAgreement :: "The library" is one place, so use "has".]] many shelves of books. ' +
        'I like to sit [[at => on :: g :: prepositions :: We sit "on" a carpet.]] the soft carpet. ' +
        'Last week, I [[borrow => borrowed :: g :: tense :: "Last week" needs the past tense: borrowed.]] a book about [[dinasaurs => dinosaurs :: s :: spelling :: The word is spelt d-i-n-o-s-a-u-r-s.]]. ' +
        'My friend Mei Ling chose a storybook and read it to [[I => me :: g :: pronouns :: After "to" use "me", not "I".]]. ' +
        'We must return [[ours => our :: g :: pronouns :: Before a noun use "our": our books.]] books in two weeks.',
      tryThis: [
        'Write three sentences about your library using "has" and "goes".',
        'Write five sentences about a book you borrowed. Use "me" and "our" correctly.',
      ],
    },
    {
      id: 'eq-p2-03',
      title: 'A Rainy Morning',
      text:
        'It [[rain => rained :: g :: tense :: "This morning" is over, so use "rained".]] heavily this morning. ' +
        'I [[taked => took :: g :: tense :: The past tense of "take" is "took".]] my umbrella and walked to the bus stop. ' +
        'The bus [[were => was :: g :: svAgreement :: "The bus" is one, so use "was".]] late, so many [[childs => children :: g :: plurals :: The plural of "child" is "children".]] waited under the shelter. ' +
        'A kind lady shared [[she => her :: g :: pronouns :: To show the umbrella belongs to her, use "her".]] umbrella with a small boy. ' +
        'When the bus came, [[evryone => everyone :: s :: spelling :: "Everyone" is "every" + "one".]] climbed on quickly. ' +
        'I was glad to be [[at => in :: g :: prepositions :: We are "in" a room.]] my warm classroom.',
      tryThis: [
        'Write three sentences about a rainy day using "took", "was" and "children".',
        'Write five sentences about your journey to school. Check every preposition.',
      ],
    },
    {
      id: 'eq-p2-04',
      title: 'Helping at Home',
      text:
        'On Saturdays, I [[helps => help :: g :: svAgreement :: With "I" the verb has no -s: I help.]] my mother at home. ' +
        'First, I sweep the floor with [[an => a :: g :: articles :: "Broom" starts with a consonant sound, so use "a".]] broom. ' +
        'Then my brother and I [[washes => wash :: g :: svAgreement :: "My brother and I" is two people, so use "wash".]] the dishes [[togeter => together :: s :: spelling :: "Together" has "th" in the middle.]]. ' +
        'Last Saturday, we [[cook => cooked :: g :: tense :: "Last Saturday" needs the past tense: cooked.]] fried rice for lunch. ' +
        'It [[taste => tasted :: g :: tense :: The lunch is over, so use "tasted".]] delicious. ' +
        'Mother gave [[we => us :: g :: pronouns :: After a verb use "us", not "we".]] ice cream after the meal.',
      tryThis: [
        'Write three sentences about a chore you do using "I" and "we".',
        'Write five sentences about cooking a meal last weekend.',
      ],
    },
    {
      id: 'eq-p2-05',
      title: 'The Zoo Trip',
      text:
        'Last month, my family [[visit => visited :: g :: tense :: "Last month" needs the past tense: visited.]] the zoo. ' +
        'We [[seen => saw :: g :: tense :: The past tense of "see" is "saw".]] two tall giraffes eating leaves. ' +
        'The [[monkies => monkeys :: s :: spelling :: When a word ends in a vowel + y, just add -s: monkeys.]] were swinging from tree to tree. ' +
        'My little sister was afraid [[from => of :: g :: prepositions :: We are afraid "of" something.]] the lions. ' +
        'Father [[buyed => bought :: g :: tense :: The past tense of "buy" is "bought".]] us cold drinks because the weather was hot. ' +
        'We took many [[photoes => photos :: s :: spelling :: The plural of "photo" just adds -s: photos.]] before we went home. ' +
        'It [[were => was :: g :: svAgreement :: "It" is one, so use "was".]] a happy day.',
      tryThis: [
        'Write three sentences about animals using "saw" and "were".',
        'Write five sentences about a family outing. Use at least three irregular past tense verbs.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P3: agreement across a phrase, comparatives, adverbs, word forms,
  // longer spellings. Eight errors.
  // ───────────────────────────────────────────────────────────────────────
  3: [
    {
      id: 'eq-p3-01',
      title: 'The Class Party',
      text:
        "Last week, our class [[organise => organised :: g :: tense :: \"Last week\" needs the past tense: organised.]] a party for Teachers' Day. " +
        'Each of the pupils [[were => was :: g :: svAgreement :: The subject is "each", which is singular, so use "was".]] asked to bring some food to share. ' +
        'Jia Min brought [[much => many :: g :: quantifiers :: Curry puffs can be counted, so use "many".]] curry puffs, while I brought a box of [[choclate => chocolate :: s :: spelling :: "Chocolate" has an o in the middle: choc-o-late.]] cookies. ' +
        'Our form teacher was [[surprise => surprised :: g :: wordForm :: After "was" we need the describing form: surprised.]] when she walked in. ' +
        'She thanked us and said it was the [[most nice => nicest :: g :: comparatives :: A short word like "nice" adds -est: nicest.]] party she had ever attended. ' +
        'After the party, everyone [[help => helped :: g :: tense :: The party is over, so use "helped".]] to clean up. ' +
        'It was truly an [[unforgetable => unforgettable :: s :: doubling :: Double the t before -able: unforgettable.]] afternoon.',
      tryThis: [
        'Write three sentences using "each of", "many" and "nicest".',
        'Write six sentences about a class celebration. Check every verb for tense.',
      ],
    },
    {
      id: 'eq-p3-02',
      title: 'The Neighbourhood Clean-up',
      text:
        'On Sunday morning, my neighbours and I [[gather => gathered :: g :: tense :: The clean-up is over, so use "gathered".]] at the void deck for a clean-up. ' +
        'Mr Tan, who lives on the fifth floor, [[give => gave :: g :: tense :: The past tense of "give" is "gave".]] each of us a pair of gloves. ' +
        'There [[was => were :: g :: svAgreement :: "Plastic bags and empty cans" is plural, so use "were".]] plastic bags and empty cans lying beside the benches. ' +
        'We picked them up [[careful => carefully :: g :: wordForm :: To describe how we did something, use the -ly form: carefully.]] and sorted them into [[diffrent => different :: s :: spelling :: "Different" has an e after the double f: diff-e-rent.]] bins. ' +
        'By noon, the void deck looked much [[more clean => cleaner :: g :: comparatives :: A short word like "clean" adds -er: cleaner.]] than before. ' +
        'Mr Tan [[buyed => bought :: g :: tense :: The past tense of "buy" is "bought".]] cold drinks for all the [[volunters => volunteers :: s :: spelling :: "Volunteers" ends in -eers.]].',
      tryThis: [
        'Write three sentences using "carefully", "cleaner" and "were".',
        'Write six sentences about helping in your neighbourhood.',
      ],
    },
    {
      id: 'eq-p3-03',
      title: 'The Lost Wallet',
      text:
        'While I was walking home yesterday, I [[find => found :: g :: tense :: The past tense of "find" is "found".]] a brown wallet on the pavement. ' +
        'There [[was => were :: g :: svAgreement :: "Several notes and an identity card" is plural, so use "were".]] several notes and an identity card inside it. ' +
        'I did not [[knew => know :: g :: tense :: After "did not" use the plain verb: know.]] what to do at first. ' +
        'Then I [[rememberred => remembered :: s :: doubling :: "Remember" does not double the r: remembered.]] what my father always says: [[honest => honesty :: g :: wordForm :: We need the naming word here: honesty.]] is the best policy. ' +
        'I brought the wallet to the [[neerest => nearest :: s :: spelling :: "Near" is spelt with "ea": nearest.]] police post. ' +
        'The officer thanked me and wrote down my name [[on => in :: g :: prepositions :: We write "in" a notebook.]] his notebook. ' +
        'That evening, the owner, an elderly man, [[call => called :: g :: tense :: It happened that evening, so use "called".]] to thank me.',
      tryThis: [
        'Write three sentences using "found", "did not know" and "honesty".',
        'Write six sentences about a time you did the right thing.',
      ],
    },
    {
      id: 'eq-p3-04',
      title: 'A Visit to Grandma',
      text:
        'Every Sunday, my family [[visit => visits :: g :: svAgreement :: "My family" is one group, so use "visits".]] my grandmother in Toa Payoh. ' +
        'She is seventy years old, but she is [[more strong => stronger :: g :: comparatives :: A short word like "strong" adds -er: stronger.]] than many younger people. ' +
        'Last Sunday, she [[teached => taught :: g :: tense :: The past tense of "teach" is "taught".]] me how to make pineapple tarts. ' +
        'First, we rolled the dough into small balls. ' +
        'Next, we [[putted => put :: g :: tense :: The past tense of "put" is still "put".]] a little jam on each one. ' +
        'The kitchen smelled [[wonderfull => wonderful :: s :: spelling :: Words ending in -ful have only one l: wonderful.]] while the tarts were baking. ' +
        'Grandma let me [[took => take :: g :: tense :: After "let me" use the plain verb: take.]] a box of tarts home. ' +
        'I shared them [[to => with :: g :: prepositions :: We share something "with" people.]] my classmates the next day, and [[their => they :: g :: pronouns :: The doers of the action need "they".]] loved them.',
      tryThis: [
        'Write three sentences using "taught", "stronger" and "with".',
        'Write six sentences about something an older person taught you.',
      ],
    },
    {
      id: 'eq-p3-05',
      title: 'The Science Lesson',
      text:
        'Our science teacher, Mrs Lim, [[bring => brought :: g :: tense :: The past tense of "bring" is "brought".]] some seeds to class last Monday. ' +
        'She told us that plants [[needs => need :: g :: svAgreement :: "Plants" is plural, so the verb has no -s: need.]] water, air and sunlight to grow. ' +
        'Every pupil [[were => was :: g :: svAgreement :: "Every pupil" is singular, so use "was".]] given a small pot and [[a => an :: g :: articles :: "Ice-cream" starts with a vowel sound, so use "an".]] ice-cream stick to label it. ' +
        'We planted the seeds and placed the pots near the [[windo => window :: s :: spelling :: "Window" ends in -ow.]]. ' +
        'After a week, tiny green shoots [[begin => began :: g :: tense :: The past tense of "begin" is "began".]] to appear. ' +
        "My plant grew [[more fast => faster :: g :: comparatives :: A short word like \"fast\" adds -er: faster.]] than my partner's. " +
        'We measured the plants and wrote the results in our [[jurnals => journals :: s :: spelling :: "Journal" is spelt with "our": journals.]].',
      tryThis: [
        'Write three sentences using "brought", "began" and "faster".',
        'Write six sentences about an experiment you did in class.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P4: past perfect, passive, each/neither, quantifiers, word forms.
  // Ten errors.
  // ───────────────────────────────────────────────────────────────────────
  4: [
    {
      id: 'eq-p4-01',
      title: 'The Sports Carnival',
      text:
        'Last Saturday, our school held its annual sports carnival at the stadium. ' +
        'By the time the opening ceremony began, most of the spectators [[have => had :: g :: tense :: The seats were taken before another past event, so use "had".]] already taken their seats. ' +
        'Each of the four houses [[were => was :: g :: svAgreement :: The subject is "each", which is singular, so use "was".]] represented by a team of twenty athletes. ' +
        'The relay race was the most [[exiting => exciting :: s :: spelling :: "Exciting" has a c after the x.]] event of the morning. ' +
        'Although our team dropped the baton, the runners did not [[gave => give :: g :: tense :: After "did not" use the plain verb: give.]] up. ' +
        'They ran with great [[determine => determination :: g :: wordForm :: After "great" we need the naming word: determination.]] and finished in second place. ' +
        'After the prize [[presentasion => presentation :: s :: spelling :: The ending is spelt -tion: presentation.]], the athletes [[was => were :: g :: svAgreement :: "The athletes" is plural, so use "were".]] treated to refreshments. ' +
        'Nobody [[complain => complained :: g :: tense :: The carnival is over, so use "complained".]] about the hot weather [[becuase => because :: s :: spelling :: "Because" is spelt b-e-c-a-u-s-e.]] everyone had enjoyed the day. ' +
        'It was an [[experiance => experience :: s :: spelling :: "Experience" ends in -ence.]] that we would remember for a long time.',
      tryThis: [
        'Explain why "had already taken" is used in the second sentence.',
        'Write a paragraph of eight sentences about a school event, using "each of" and "had" correctly.',
      ],
    },
    {
      id: 'eq-p4-02',
      title: 'The Museum Trip',
      text:
        'Last Tuesday, the Primary Four pupils [[goes => went :: g :: tense :: "Last Tuesday" needs the past tense: went.]] on a learning journey to the National Museum. ' +
        'The guide, [[which => who :: g :: pronouns :: For a person use "who", not "which".]] had worked there for ten years, showed us around the galleries. ' +
        'She explained that the oldest exhibit [[is => was :: g :: tense :: After "explained that", keep the past tense: was.]] more than seven hundred years old. ' +
        'We saw many [[ancent => ancient :: s :: spelling :: "Ancient" is spelt with "ie": anc-ie-nt.]] tools and coins that [[was => were :: g :: svAgreement :: "Tools and coins" is plural, so use "were".]] found near the Singapore River. ' +
        'My friend Hakim was so [[intrested => interested :: s :: spelling :: "Interested" has an e after the t: in-ter-ested.]] that he filled three pages of his notebook. ' +
        'There were [[less => fewer :: g :: quantifiers :: Visitors can be counted, so use "fewer".]] visitors than usual, so we could look at everything slowly. ' +
        'At the end of the trip, each of us [[have => had :: g :: tense :: The trip is over, so use "had".]] to write a short [[reflecsion => reflection :: s :: spelling :: The ending is spelt -tion: reflection.]]. ' +
        'I wrote that it was the [[more => most :: g :: comparatives :: Comparing with every trip needs "the most".]] interesting trip I had ever been on.',
      tryThis: [
        'Explain the difference between "less" and "fewer" with one example of each.',
        'Write a paragraph of eight sentences about a learning journey, using "who" and "the most" correctly.',
      ],
    },
    {
      id: 'eq-p4-03',
      title: 'The Rainy Day Match',
      text:
        "The football match [[is => was :: g :: tense :: \"Yesterday\" needs the past tense: was.]] supposed to start at four o'clock yesterday. " +
        'However, dark clouds had [[gather => gathered :: g :: tense :: After "had" use the past participle: gathered.]] over the field by half past three. ' +
        'Our coach told us to wait in the [[shelterd => sheltered :: s :: spelling :: Add -ed to "shelter": sheltered.]] walkway. ' +
        'When the rain finally stopped, the field was [[cover => covered :: g :: tense :: After "was" use the past participle: covered.]] with puddles. ' +
        'Neither the referee nor the players [[was => were :: g :: svAgreement :: With "neither ... nor", the verb agrees with the nearer subject, "players": were.]] willing to cancel the game. ' +
        'We played on the wet grass and [[sliped => slipped :: s :: doubling :: Double the p before -ed: slipped.]] many times. ' +
        'Although we lost by one goal, our coach said he was proud [[for => of :: g :: prepositions :: We are proud "of" someone.]] us. ' +
        'He told us that winning was [[least => less :: g :: comparatives :: Comparing two things with "than" needs "less".]] important than trying our best. ' +
        'We went home [[tire => tired :: g :: wordForm :: To describe how we felt, use "tired".]] but happy, and my mother made me a bowl of hot [[soop => soup :: s :: spelling :: "Soup" is spelt with "ou".]].',
      tryThis: [
        'Explain why the verb after "Neither the referee nor the players" is plural.',
        'Write a paragraph of eight sentences about a match or game, using "had" + past participle twice.',
      ],
    },
    {
      id: 'eq-p4-04',
      title: 'The School Garden',
      text:
        'Our school garden [[were => was :: g :: svAgreement :: "Our school garden" is singular, so use "was".]] started two years ago by a group of parent volunteers. ' +
        'Since then, many kinds of [[vegtables => vegetables :: s :: spelling :: "Vegetables" has an e after the g: veg-e-tables.]] [[has => have :: g :: svAgreement :: "Many kinds" is plural, so use "have".]] been grown there. ' +
        'Every Wednesday, the members of the Gardening Club [[waters => water :: g :: svAgreement :: "The members" is plural, so the verb has no -s: water.]] the plants and remove the weeds. ' +
        'Last month, we [[harvest => harvested :: g :: tense :: "Last month" needs the past tense: harvested.]] enough spinach to cook lunch for sixty people. ' +
        'The canteen vendors were [[greatful => grateful :: s :: spelling :: "Grateful" begins with g-r-a-t-e.]] for the fresh vegetables. ' +
        'Mrs Rahim taught us how to make compost from fruit peels and dried leaves. ' +
        'It takes [[much => many :: g :: quantifiers :: Weeks can be counted, so use "many".]] weeks before the compost is ready. ' +
        'Gardening has taught me to be [[patience => patient :: g :: wordForm :: After "to be" we need the describing word: patient.]] and [[responsable => responsible :: s :: spelling :: "Responsible" ends in -ible.]]. ' +
        'I hope the garden will become even [[more big => bigger :: g :: comparatives :: A short word like "big" adds -er and doubles the g: bigger.]] next year.',
      tryThis: [
        'Explain the difference between "patience" and "patient" with one sentence for each.',
        'Write a paragraph of eight sentences about a club or project, checking every subject and verb.',
      ],
    },
    {
      id: 'eq-p4-05',
      title: 'A Kind Deed',
      text:
        'While Wei Jie [[is => was :: g :: tense :: The story happened last Monday, so use "was".]] waiting for the bus last Monday, he noticed an elderly woman struggling with her groceries. ' +
        'Several bags [[has => had :: g :: tense :: The bags fell before he noticed, so use "had".]] fallen from her trolley, and oranges were rolling across the pavement. ' +
        'Without [[hesitasion => hesitation :: s :: spelling :: The ending is spelt -tion: hesitation.]], Wei Jie ran over and picked [[it => them :: g :: pronouns :: The oranges are more than one, so use "them".]] up. ' +
        'The woman thanked him and said that few children [[was => were :: g :: svAgreement :: "Few children" is plural, so use "were".]] as helpful as he was. ' +
        'She wanted to give him [[a => an :: g :: articles :: "Orange" starts with a vowel sound, so use "an".]] orange, but he [[polite => politely :: g :: wordForm :: To describe how he refused, use the -ly form: politely.]] refused. ' +
        'When he told his mother about it that evening, she [[smile => smiled :: g :: tense :: It happened that evening, so use "smiled".]] and said she was proud of him. ' +
        "Wei Jie [[realise => realised :: g :: tense :: The story is in the past, so use \"realised\".]] that a small act of [[kindnes => kindness :: s :: spelling :: The ending -ness has a double s: kindness.]] could brighten someone's day.",
      tryThis: [
        'Explain why "them" is used and not "it" in the third sentence.',
        'Write a paragraph of eight sentences about a kind act, keeping every verb in the past tense.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P5: reported speech, conditionals, relative pronouns, gerunds, harder
  // spellings. Ten errors.
  // ───────────────────────────────────────────────────────────────────────
  5: [
    {
      id: 'eq-p5-01',
      title: 'The Science Fair',
      text:
        'The annual science fair, which [[were => was :: g :: svAgreement :: "Which" refers to "the science fair", which is singular: was.]] held in the school hall last Friday, attracted more than three hundred visitors. ' +
        'Each team [[have => had :: g :: tense :: The preparing happened before the fair, so use "had spent".]] spent weeks preparing its project. ' +
        'My group investigated how [[tempreture => temperature :: s :: spelling :: "Temperature" has four parts: tem-per-a-ture.]] affects the growth of mould on bread. ' +
        'If we had started our [[experimant => experiment :: s :: spelling :: "Experiment" ends in -ment.]] earlier, we would [[had => have :: g :: modals :: After "would" use the plain verb: would have.]] collected more data. ' +
        'One of the judges [[ask => asked :: g :: tense :: The fair is over, so use "asked".]] us why we had chosen that topic. ' +
        'Farah explained that she [[has => had :: g :: tense :: In reported speech about an earlier time, use "had".]] once found mould in her lunch box and became curious. ' +
        'The judge said that our presentation was [[clearly => clear :: g :: wordForm :: After "was" we need the describing word: clear.]] and well organised. ' +
        'Although we did not win, we were [[satisfy => satisfied :: g :: wordForm :: After "were" we need the describing form: satisfied.]] with our effort. ' +
        'The [[experiance => experience :: s :: spelling :: "Experience" ends in -ence.]] taught us that careful planning matters as much as good ideas.',
      tryThis: [
        'Explain why "would have collected" is used after "If we had started".',
        'Write a 100-word report about a competition, using one "If ... had ..., ... would have ..." sentence.',
      ],
    },
    {
      id: 'eq-p5-02',
      title: 'The Heritage Trail',
      text:
        'Last month, my class [[explore => explored :: g :: tense :: "Last month" needs the past tense: explored.]] the streets of Kampong Glam on a heritage trail. ' +
        'Our guide, Mr Osman, told us that the area [[has => had :: g :: tense :: In reported speech about an earlier time, use "had been".]] been a busy trading centre two hundred years ago. ' +
        'Many of the shophouses [[was => were :: g :: svAgreement :: "Many of the shophouses" is plural, so use "were".]] built in the 1840s and have been carefully [[preservd => preserved :: s :: spelling :: Add -d to "preserve": preserved.]]. ' +
        'We learnt that traders from [[diffrent => different :: s :: spelling :: "Different" has an e after the double f: diff-e-rent.]] parts of Asia once sold spices and cloth there. ' +
        'The mosque, [[who => whose :: g :: pronouns :: The dome belongs to the mosque, so use "whose".]] golden dome can be seen from far away, is the most [[famos => famous :: s :: spelling :: The ending is spelt -ous: famous.]] landmark in the area. ' +
        'Had we not joined the trail, we would never [[knew => have known :: g :: tense :: After "Had we not ...", use "would have" + past participle: have known.]] how much history lay behind the colourful walls. ' +
        'By the end of the walk, we were tired, yet nobody wanted to leave. ' +
        'I have [[wrote => written :: g :: tense :: After "have" use the past participle: written.]] about the trip in my journal so that I will not forget it. ' +
        'It is [[importent => important :: s :: spelling :: "Important" ends in -ant.]] to protect such places for future generations.',
      tryThis: [
        'Explain why "whose" is used for the mosque.',
        'Write a 100-word recount of a visit, using "whose" and one sentence that begins with "Had".',
      ],
    },
    {
      id: 'eq-p5-03',
      title: 'Flash Flood',
      text:
        'Heavy rain [[fall => fell :: g :: tense :: The past tense of "fall" is "fell".]] across the island for three hours on Monday afternoon. ' +
        "By four o'clock, several roads in the east [[was => were :: g :: svAgreement :: \"Several roads\" is plural, so use \"were\".]] flooded. " +
        'A bus driver, [[which => who :: g :: pronouns :: For a person use "who", not "which".]] had noticed the rising water, stopped his bus and warned the passengers to remain [[seat => seated :: g :: wordForm :: After "remain" we need the describing form: seated.]]. ' +
        'Neither the driver nor the passengers [[was => were :: g :: svAgreement :: With "neither ... nor", the verb agrees with the nearer subject, "passengers": were.]] hurt. ' +
        'Officers from the national water agency arrived [[imediately => immediately :: s :: doubling :: "Immediately" has a double m.]] and began to clear the blocked drains. ' +
        'A spokesman said that the drains would [[had => have :: g :: modals :: After "would" use the plain verb: would have.]] coped if they had not been choked with litter. ' +
        'Residents were advised to check the weather [[forcast => forecast :: s :: spelling :: "Forecast" begins with f-o-r-e.]] before leaving home. ' +
        'The water [[subside => subsided :: g :: tense :: It happened on Monday, so use "subsided".]] by evening, and traffic returned to normal. ' +
        'The incident shows how [[careles => careless :: s :: spelling :: The ending -less has a double s: careless.]] littering can cause serious problems.',
      tryThis: [
        'Explain why the verb after "Neither the driver nor the passengers" is "were".',
        'Write a 100-word news report about bad weather, using "who" and "would have".',
      ],
    },
    {
      id: 'eq-p5-04',
      title: 'The Recycling Campaign',
      text:
        'Our school launched a recycling campaign at the [[begining => beginning :: s :: doubling :: Double the n before -ing: beginning.]] of the term. ' +
        'Every class [[were => was :: g :: svAgreement :: "Every class" is singular, so use "was".]] given three bins for paper, plastic and cans. ' +
        'The class that collected the [[more => most :: g :: comparatives :: Comparing every class needs "the most".]] recyclable items would win a prize. ' +
        'At first, only a few pupils bothered to sort their rubbish. ' +
        'Our monitor, Devi, suggested [[to make => making :: g :: wordForm :: After "suggested" use the -ing form: making.]] posters to remind everyone. ' +
        'She said that if each of us [[bring => brought :: g :: tense :: In an "if" clause about an imagined case, use the past tense: brought.]] just two items a day, the bins would fill up quickly. ' +
        'Her idea worked [[brilliant => brilliantly :: g :: wordForm :: To describe how it worked, use the -ly form: brilliantly.]]. ' +
        'Within a month, our class [[has => had :: g :: tense :: This is a past story, so use "had collected".]] collected over four hundred items. ' +
        'The principal praised us for our [[committment => commitment :: s :: doubling :: "Commitment" has one t before -ment.]] during assembly. ' +
        'We have [[prove => proved :: g :: tense :: After "have" use the past participle: proved.]] that small actions can make a difference to the [[enviroment => environment :: s :: spelling :: "Environment" has an n before the m: environ-ment.]].',
      tryThis: [
        'Explain why "making" follows "suggested".',
        'Write a 100-word report on a school campaign, using "suggested" + -ing and one "if" sentence.',
      ],
    },
    {
      id: 'eq-p5-05',
      title: 'The Late Starter',
      text:
        'Mr Lee Kok Wah [[begin => began :: g :: tense :: The past tense of "begin" is "began".]] running marathons when he was fifty years old. ' +
        'His doctor had told him that he [[need => needed :: g :: tense :: In reported speech, keep the past tense: needed.]] to exercise more. ' +
        'At first, he could hardly [[ran => run :: g :: modals :: After "could" use the plain verb: run.]] round the block without stopping. ' +
        'He kept training every morning, [[dispite => despite :: s :: spelling :: "Despite" begins with d-e-s.]] the aches in his knees. ' +
        'Over the next ten years, he completed [[much => many :: g :: quantifiers :: Races can be counted, so use "many".]] races in Singapore and overseas. ' +
        'He says that the cheers of the crowd always [[gives => give :: g :: svAgreement :: The subject is "cheers", which is plural, so use "give".]] him strength. ' +
        'Now seventy, he is [[more fit => fitter :: g :: comparatives :: A short word like "fit" adds -er and doubles the t: fitter.]] than most men half his age. ' +
        'He has [[raise => raised :: g :: tense :: After "has" use the past participle: raised.]] more than fifty thousand dollars for charity through his runs. ' +
        'His [[determinasion => determination :: s :: spelling :: The ending is spelt -tion: determination.]] has inspired many younger runners. ' +
        'He believes that it is never too late [[for => to :: g :: prepositions :: "Too late" is followed by "to" + verb: too late to start.]] start something new.',
      tryThis: [
        'Explain why the verb after "the cheers of the crowd" is "give".',
        'Write a 100-word profile of someone you admire, using "has" + past participle twice.',
      ],
    },
  ],

  // ───────────────────────────────────────────────────────────────────────
  // P6: twelve errors, six spelling and six grammar, as in the PSLE editing
  // section.
  // ───────────────────────────────────────────────────────────────────────
  6: [
    {
      id: 'eq-p6-01',
      title: 'Our Hawker Centres',
      text:
        'Hawker centres have long [[be => been :: g :: tense :: After "have" use the past participle: been.]] an important part of life in Singapore. ' +
        'For many families, eating at a hawker centre [[are => is :: g :: svAgreement :: The subject is "eating", which is singular, so use "is".]] a weekly routine. ' +
        'The food is [[afordable => affordable :: s :: doubling :: "Affordable" has a double f.]], and the variety is [[extrordinary => extraordinary :: s :: spelling :: "Extraordinary" is "extra" + "ordinary".]]. ' +
        'However, the number of young people willing to become hawkers [[have => has :: g :: svAgreement :: The subject is "the number", which is singular, so use "has".]] fallen in recent years. ' +
        'The work is tiring, and stall owners often [[rises => rise :: g :: svAgreement :: "Stall owners" is plural, so the verb has no -s: rise.]] before dawn to prepare their [[ingrediants => ingredients :: s :: spelling :: "Ingredients" ends in -ents.]]. ' +
        'Some hawkers, [[who => whose :: g :: pronouns :: The children belong to the hawkers, so use "whose".]] children have chosen other careers, worry that their recipes will [[dissapear => disappear :: s :: doubling :: "Disappear" has one s and a double p.]]. ' +
        'To address this problem, the [[goverment => government :: s :: spelling :: "Government" has an n before the m: govern-ment.]] has introduced training schemes for new hawkers. ' +
        'Had such schemes [[be => been :: g :: tense :: After "had" use the past participle: been.]] introduced earlier, more stalls might have been saved. ' +
        'It is our [[responsability => responsibility :: s :: spelling :: "Responsibility" has -ibil- in the middle.]] to support the hawkers who feed us every day.',
      tryThis: [
        'Explain why the verb after "the number of young people" is singular.',
        'Write a 120-word paragraph on why a tradition should be kept, using "whose" and one sentence that begins with "Had".',
      ],
    },
    {
      id: 'eq-p6-02',
      title: 'Screen Time',
      text:
        'A recent survey [[suggest => suggests :: g :: svAgreement :: "A recent survey" is singular, so the verb needs -s: suggests.]] that children today spend far more time on screens than their parents did. ' +
        'On [[avrage => average :: s :: spelling :: "Average" has an e after the v: av-e-rage.]], a twelve-year-old uses a phone or tablet for four hours a day. ' +
        "Doctors warn that too [[many => much :: g :: quantifiers :: \"Screen time\" cannot be counted, so use \"much\".]] screen time can harm a child's eyesight and sleep. " +
        'Children who use devices late at night often [[finds => find :: g :: svAgreement :: The subject is "children", which is plural, so use "find".]] it hard to fall asleep. ' +
        'Some parents have [[try => tried :: g :: tense :: After "have" use the past participle: tried.]] to solve the problem by setting strict limits. ' +
        'Others believe that children should learn to [[manege => manage :: s :: spelling :: "Manage" ends in -age.]] their own time. ' +
        'One mother said that her son [[become => became :: g :: tense :: In reported speech about the past, use "became".]] calmer after she removed the television from his bedroom. ' +
        'Experts [[recomend => recommend :: s :: doubling :: "Recommend" has one c and a double m.]] at least one hour of outdoor play every day. ' +
        'They add that it is not [[neccessary => necessary :: s :: doubling :: "Necessary" has one c and a double s.]] to ban devices [[completly => completely :: s :: spelling :: Keep the e of "complete" before -ly: completely.]]. ' +
        'What matters is that children [[develops => develop :: g :: svAgreement :: "Children" is plural, so the verb has no -s: develop.]] healthy habits while they are young. ' +
        'With [[guidence => guidance :: s :: spelling :: "Guidance" ends in -ance.]], they can enjoy technology without being controlled by it.',
      tryThis: [
        'Explain why "too much screen time" is correct but "too many screen time" is not.',
        'Write a 120-word paragraph giving your view on screen time, with one reported-speech sentence.',
      ],
    },
    {
      id: 'eq-p6-03',
      title: 'The Old Bookshop',
      text:
        'The old bookshop at the corner of our street [[have => has :: g :: svAgreement :: The subject is "the old bookshop", which is singular, so use "has".]] been there for as long as I can remember. ' +
        'Its owner, Mr Pereira, [[know => knows :: g :: svAgreement :: "Its owner" is singular, so the verb needs -s: knows.]] every book on his shelves. ' +
        'When I was younger, I [[use => used :: g :: tense :: For a past habit, write "used to".]] to spend whole afternoons there, reading [[adventur => adventure :: s :: spelling :: "Adventure" ends in -ture.]] stories. ' +
        'Last month, I heard that the shop [[is => was :: g :: tense :: After "I heard that", keep the past tense: was.]] going to close because few customers [[was => were :: g :: svAgreement :: "Few customers" is plural, so use "were".]] buying books. ' +
        'I felt a deep sense of [[dissapointment => disappointment :: s :: doubling :: "Disappointment" has one s and a double p.]]. ' +
        'My friends and I [[decide => decided :: g :: tense :: This happened last month, so use "decided".]] to help by putting up posters around the [[neighbourhod => neighbourhood :: s :: spelling :: The ending is -hood, with a double o.]]. ' +
        "We also created a page on social media to tell people about the shop's [[speshal => special :: s :: spelling :: The \"sh\" sound in \"special\" is spelt \"ci\".]] offers. " +
        'To our [[suprise => surprise :: s :: spelling :: "Surprise" has an r before the p: sur-prise.]], more than a hundred people visited that weekend. ' +
        'Mr Pereira was so [[greatful => grateful :: s :: spelling :: "Grateful" begins with g-r-a-t-e.]] that he gave each of us a book.',
      tryThis: [
        'Explain why "used to" is correct for something that happened often in the past.',
        'Write a 120-word story about saving a place you love, keeping the tenses consistent.',
      ],
    },
    {
      id: 'eq-p6-04',
      title: 'The Void Deck Carnival',
      text:
        "Last month, the residents' committee [[organise => organised :: g :: tense :: \"Last month\" needs the past tense: organised.]] a carnival at the void deck. " +
        'The chairperson reported that preparations [[has => had :: g :: tense :: In reported speech about an earlier time, use "had been".]] been going on for weeks. ' +
        'Nevertheless, some of the [[volunters => volunteers :: s :: spelling :: "Volunteers" ends in -eers.]] were still unsure of their roles. ' +
        'The carnival [[feautred => featured :: s :: spelling :: "Feature" is spelt f-e-a-t-u-r-e.]] many games, and the children [[was => were :: g :: svAgreement :: "The children" is plural, so use "were".]] thrilled with the prizes. ' +
        'An elderly resident said that she [[wish => wished :: g :: tense :: In reported speech, "wish" becomes "wished".]] such events were held more often. ' +
        'If the weather had been better, even more people would [[of => have :: g :: modals :: Write "would have", never "would of".]] come. ' +
        'The committee [[recieved => received :: s :: spelling :: After c, it is "ei": received.]] many letters of [[apreciation => appreciation :: s :: doubling :: "Appreciation" has a double p.]] afterwards. ' +
        '[[Encourage => Encouraged :: g :: wordForm :: To describe how the members felt, use the -ed form: Encouraged.]] by the response, the members plan to hold the carnival every year. ' +
        'They hope it will become a [[tradision => tradition :: s :: spelling :: The ending is spelt -tion: tradition.]] that brings neighbours [[togather => together :: s :: spelling :: "Together" is spelt to-geth-er.]].',
      tryThis: [
        'Explain why "would of" is wrong and what should be written instead.',
        'Write a 120-word report on a community event, with two reported-speech sentences.',
      ],
    },
    {
      id: 'eq-p6-05',
      title: 'Sea Turtles',
      text:
        'Every year, thousands of sea turtles [[returns => return :: g :: svAgreement :: "Thousands of sea turtles" is plural, so use "return".]] to the beaches where they were born. ' +
        'Each female [[lay => lays :: g :: svAgreement :: "Each female" is singular, so the verb needs -s: lays.]] about a hundred eggs in a nest that she digs with her flippers. ' +
        'After covering the eggs with sand, she returns to the sea and leaves them to hatch on their own. ' +
        'Two months later, the young turtles [[emerg => emerge :: s :: spelling :: "Emerge" ends with a silent e.]] and hurry towards the water. ' +
        'Sadly, only a few of them [[survives => survive :: g :: svAgreement :: "A few of them" is plural, so use "survive".]]. ' +
        'Many are eaten by crabs and birds, while others [[is => are :: g :: svAgreement :: "Others" is plural, so use "are".]] confused by the bright lights of nearby buildings. ' +
        'Plastic waste is another [[seriuos => serious :: s :: spelling :: The ending is spelt -ious: serious.]] threat, because turtles often [[mistakes => mistake :: g :: svAgreement :: "Turtles" is plural, so the verb has no -s: mistake.]] plastic bags for jellyfish. ' +
        'In several countries, volunteers now [[patroll => patrol :: s :: spelling :: "Patrol" ends with one l.]] the beaches at night to protect the nests. ' +
        'Their efforts have made a [[noticable => noticeable :: s :: spelling :: Keep the e of "notice" before -able: noticeable.]] [[diffrence => difference :: s :: spelling :: "Difference" has an e after the double f: diff-e-rence.]]. ' +
        'If everyone reduced their use of plastic, far [[less => fewer :: g :: quantifiers :: Turtles can be counted, so use "fewer".]] turtles would be harmed. ' +
        'These [[ansient => ancient :: s :: spelling :: The "sh" sound in "ancient" is spelt "ci".]] creatures deserve our protection.',
      tryThis: [
        'Explain why "fewer turtles" is correct but "less turtles" is not.',
        'Write a 120-word information report about an animal, checking that every verb agrees with its subject.',
      ],
    },
  ],
};

const MARK = /\[\[(.+?) => (.+?) :: ([gs]) :: (\w+) :: (.+?)\]\]/g;

/**
 * Turn a marked-up passage into what the game needs.
 *
 * @param {string} text
 * @returns {{paragraph: string, corrected: string, errors: Array<{
 *   token: string, correction: string, accepted: string[], type: string,
 *   rule: string, explanation: string, index: number}>}}
 */
export function parseEditingSource(text) {
  let paragraph = '';
  let corrected = '';
  let last = 0;
  const errors = [];
  for (const m of text.matchAll(MARK)) {
    const [whole, token, correction, kind, rule, explanation] = m;
    const between = text.slice(last, m.index);
    paragraph += between;
    corrected += between;
    errors.push({
      token,
      correction,
      accepted: [correction],
      type: kind === 's' ? 'spelling' : 'grammar',
      rule,
      explanation,
      index: paragraph.length,
    });
    paragraph += token;
    corrected += correction;
    last = m.index + whole.length;
  }
  paragraph += text.slice(last);
  corrected += text.slice(last);
  return { paragraph, corrected, errors };
}

export const editingPassages = Object.fromEntries(
  Object.entries(SOURCES).map(([level, passages]) => [
    level,
    passages.map(({ text, ...rest }) => ({
      ...rest,
      ...parseEditingSource(text),
      xp: XP_BY_LEVEL[level],
    })),
  ]),
);
