/**
 * Vocabulary MCQ pools for the bands that used to borrow another band's words.
 *
 * Fifteen categories had only two pools: one for P1 and P2, and one shared by
 * P3 through P6. So a P3 child met "legislature" and "unanimously", and a P6
 * child preparing for the PSLE was asked for "bakery" and "fins".
 *
 * MIDDLE_ROWS gives P3 and P4 their own pool in the categories whose shared
 * pool is pitched at P5 and P6. UPPER_ROWS gives P5 and P6 their own pool in
 * the categories whose shared pool is pitched at P3 and P4.
 *
 * Row format: [stem, answer, [three wrong choices], why]. `why` is one plain
 * sentence that teaches the clue. It is optional: categories whose feedback is
 * built from word meanings or from a fixed template leave it out.
 */

export const MIDDLE_ROWS = {
  contextInference: [
    ['The path was so ___ after the rain that Mei Ling nearly fell twice.', 'slippery', ['dusty', 'narrow', 'bright'], 'Rain makes a path wet, and nearly falling tells you it was slippery.'],
    ['Ravi was ___ to find that his lost wallet had been handed in at the office.', 'relieved', ['annoyed', 'ashamed', 'bored'], 'Getting back something you lost takes a worry away, so you feel relieved.'],
    ['The old bridge looked too ___ to cross, so the hikers took the longer route.', 'dangerous', ['colourful', 'ordinary', 'modern'], 'People choose a longer route only to stay safe, so the bridge must have looked dangerous.'],
    ['Because the instructions were ___, everyone finished the model without asking for help.', 'clear', ['missing', 'lengthy', 'confusing'], 'Nobody needed help, so the instructions must have been easy to understand: clear.'],
    ['The shop was ___ on Sunday, so we had to come back the next day.', 'closed', ['famous', 'spotless', 'nearby'], 'They had to come back another day, so the shop was not open: it was closed.'],
    ['Aunt Lim is very ___; she gave half of her cakes to the neighbours.', 'generous', ['stubborn', 'forgetful', 'curious'], 'Someone who gladly gives things away is generous.'],
    ['The puppy was ___ of the vacuum cleaner and hid under the bed whenever it was switched on.', 'frightened', ['fond', 'proud', 'tired'], 'Hiding under the bed shows fear, so the puppy was frightened.'],
    ['We could ___ hear the speaker because the microphone was not working.', 'barely', ['clearly', 'loudly', 'gladly'], 'Without a microphone a speaker is hard to hear. "Barely" means only just.'],
    ['The museum guide asked us not to touch the vase because it was very ___.', 'fragile', ['ordinary', 'cheap', 'plain'], 'We are told not to touch things that break easily. "Fragile" means easily broken.'],
    ['After walking for three hours without water, the scouts were extremely ___.', 'thirsty', ['cheerful', 'chilly', 'tidy'], '"Without water" is the clue: going without a drink makes you thirsty.'],
    ['Siti ___ her little brother to try again, telling him that he could do it.', 'encouraged', ['forbade', 'forgot', 'refused'], 'Telling someone "you can do it" gives them courage. That is what "encouraged" means.'],
    ['The two teams were so evenly matched that it was ___ to guess who would win.', 'difficult', ['simple', 'unfair', 'boring'], 'When two teams are equally good, guessing the winner is hard: difficult.'],
  ],

  definitionMatch: [
    ['A person who designs buildings is an ___.', 'architect', ['author', 'athlete', 'acrobat'], 'An architect draws the plans for buildings.'],
    ['A book that gives the meanings of words is a ___.', 'dictionary', ['diary', 'directory', 'calendar'], 'A dictionary lists words in alphabetical order with their meanings.'],
    ['A story of a person\'s life, written by that person, is an ___.', 'autobiography', ['advertisement', 'atlas', 'anthology'], '"Auto" means self, "bio" means life and "graphy" means writing: writing about your own life.'],
    ['Someone who watches a sports match or a show is a ___.', 'spectator', ['referee', 'competitor', 'coach'], 'A spectator only watches. The referee, the competitors and the coach all take part.'],
    ['A long period without rain is a ___.', 'drought', ['flood', 'breeze', 'harvest'], 'A drought is a long dry spell when no rain falls.'],
    ['A doctor who operates on patients is a ___.', 'surgeon', ['dentist', 'pharmacist', 'nurse'], 'A surgeon is the doctor who carries out operations.'],
    ['Money paid regularly to a worker for the work done is a ___.', 'salary', ['fine', 'fare', 'prize'], 'A salary is regular pay for work. A fine is a punishment and a fare pays for a ride.'],
    ['A group of people who sing together is a ___.', 'choir', ['crew', 'crowd', 'queue'], 'A choir is a group of singers.'],
    ['A period of one hundred years is a ___.', 'century', ['decade', 'season', 'fortnight'], 'A century is 100 years. A decade is 10 years and a fortnight is two weeks.'],
    ['A person who rides in a bus, train or aeroplane but does not drive it is a ___.', 'passenger', ['pedestrian', 'mechanic', 'cyclist'], 'A passenger is carried by a vehicle. A pedestrian travels on foot.'],
    ['A sudden shaking of the ground is an ___.', 'earthquake', ['eclipse', 'avalanche', 'echo'], 'In an earthquake the earth quakes, which means it shakes.'],
    ['A large building where aeroplanes are kept and repaired is a ___.', 'hangar', ['harbour', 'garage', 'platform'], 'A hangar is for aeroplanes. A garage is for cars and a harbour is for ships.'],
  ],

  synonymContrast: [
    ['The opposite of "ancient" is ___.', 'modern', ['old', 'huge', 'broken'], '"Ancient" means very old, so its opposite is "modern", which means of the present time.'],
    ['A word that means the same as "enormous" is ___.', 'huge', ['tiny', 'heavy', 'bright'], '"Enormous" and "huge" both mean very, very big.'],
    ['The opposite of "victory" is ___.', 'defeat', ['prize', 'battle', 'cheer'], 'A victory is a win, so its opposite is a defeat, which is a loss.'],
    ['A word that means the same as "purchase" is ___.', 'buy', ['sell', 'borrow', 'return'], 'To purchase something is to buy it.'],
    ['The opposite of "shallow" is ___.', 'deep', ['wide', 'calm', 'narrow'], 'Shallow water does not go far down. Deep water does.'],
    ['A word that means the same as "assist" is ___.', 'help', ['stop', 'follow', 'visit'], 'To assist someone is to help them.'],
    ['The opposite of "accept" is ___.', 'refuse', ['receive', 'agree', 'collect'], 'To accept is to say yes to something. To refuse is to say no.'],
    ['A word that means the same as "frequently" is ___.', 'often', ['seldom', 'never', 'slowly'], '"Frequently" means many times, which is the same as "often".'],
    ['The opposite of "temporary" is ___.', 'permanent', ['short', 'sudden', 'early'], 'Something temporary lasts a short time. Something permanent lasts for good.'],
    ['A word that means the same as "weep" is ___.', 'cry', ['laugh', 'shout', 'whisper'], 'To weep is to cry with tears.'],
    ['The opposite of "expand" is ___.', 'shrink', ['grow', 'stretch', 'burst'], 'To expand is to get bigger. To shrink is to get smaller.'],
    ['A word that means the same as "courageous" is ___.', 'brave', ['fearful', 'careless', 'gentle'], '"Courageous" comes from "courage". A person with courage is brave.'],
  ],

  collocationCloze: [
    ['It took him a week to ___ up his mind about which CCA to join.', 'make', ['do', 'take', 'put'], 'The fixed phrase is "make up your mind", which means to decide.'],
    ['The firemen managed to ___ out the fire before it spread.', 'put', ['take', 'make', 'get'], 'We "put out" a fire. The words always go together.'],
    ['Our class will ___ part in the National Day parade.', 'take', ['make', 'do', 'give'], 'The fixed phrase is "take part", which means to join in.'],
    ['She ___ a promise to visit her grandmother every week.', 'made', ['did', 'said', 'told'], 'In English we "make a promise".'],
    ['We must ___ the rules when we are at the swimming pool.', 'follow', ['listen', 'hear', 'carry'], 'We "follow" or "obey" rules. We listen to people, not to rules.'],
    ['Wei Jie ___ a mistake in the last sum.', 'made', ['did', 'had', 'took'], 'In English we "make a mistake". We never "do a mistake".'],
    ['The children ___ fun at the water park.', 'had', ['made', 'did', 'took'], 'We "have fun". The past tense is "had fun".'],
    ['Please ___ the truth about what happened.', 'tell', ['say', 'speak', 'talk'], 'We "tell the truth" and "tell a lie". "Say" needs the words that were said.'],
    ['A good friend knows how to ___ a secret.', 'keep', ['hold', 'save', 'stay'], 'We "keep a secret" when we do not tell anyone.'],
    ['Mother asked me to ___ the table for dinner.', 'set', ['put', 'make', 'do'], 'To "set the table" is to lay out the plates, bowls and cutlery.'],
    ['The doctor told him to ___ a rest for two days.', 'take', ['make', 'do', 'give'], 'We "take a rest" or "have a rest".'],
    ['I ___ a cold after playing in the rain.', 'caught', ['took', 'made', 'did'], 'We "catch a cold". The past tense is "caught a cold".'],
    ['She ___ her temper when her brother broke her model.', 'lost', ['dropped', 'missed', 'threw'], 'To "lose your temper" is to become very angry.'],
  ],

  grammaticalRole: [
    ['The children waited ___ for the bus.', 'patiently', ['patient', 'patience', 'impatient']],
    ['The ___ of the bridge took two years.', 'construction', ['construct', 'constructed', 'constructive']],
    ['It was a ___ day for a picnic.', 'wonderful', ['wonder', 'wonderfully', 'wondered']],
    ['She gave a ___ of the missing dog to the police.', 'description', ['describe', 'described', 'descriptive']],
    ['The magician\'s tricks ___ the audience.', 'amazed', ['amazing', 'amazement', 'amazingly']],
    ['He answered every question ___.', 'correctly', ['correct', 'correction', 'corrected']],
    ['Eating fruit every day is good for your ___.', 'health', ['healthy', 'healthily', 'heal']],
    ['The road is ___ when it is wet.', 'dangerous', ['danger', 'dangerously', 'endanger']],
    ['We made a ___ to visit the zoo on Saturday.', 'decision', ['decide', 'decided', 'decisive']],
    ['The baby slept ___ through the storm.', 'peacefully', ['peaceful', 'peace', 'peaceable']],
    ['The ___ boy shared his lunch with a classmate who had none.', 'thoughtful', ['thought', 'thoughtfully', 'thoughtfulness']],
    ['Her ___ in the race made her parents proud.', 'success', ['succeed', 'successful', 'successfully']],
  ],

  connectorClue: [
    ['Although it was raining, the children were still ___ to go out.', 'eager', ['afraid', 'unable', 'sorry'], '"Although" signals a surprise: rain usually keeps children in, but these children still wanted to go.'],
    ['Jun studied hard, so his results were ___.', 'good', ['poor', 'late', 'strange'], '"So" gives the result. Hard study leads to good results.'],
    ['The soup was piping hot, but the rice was stone ___.', 'cold', ['warm', 'soft', 'white'], '"But" signals a contrast. The opposite of piping hot is stone cold.'],
    ['He could not reach the shelf because he was too ___.', 'short', ['tall', 'strong', 'quick'], '"Because" gives the reason. Being too short is why he could not reach.'],
    ['Mei practised every day; as a result, her playing became much ___.', 'better', ['worse', 'slower', 'quieter'], '"As a result" tells you what practice led to: better playing.'],
    ['The box looked heavy; however, it was surprisingly ___.', 'light', ['large', 'solid', 'full'], '"However" signals a contrast with "heavy", so the box was light.'],
    ['Unless you water the plant, it will ___.', 'wither', ['bloom', 'grow', 'sprout'], '"Unless you water it" means "if you do not water it". A plant without water withers.'],
    ['She was tired, yet she ___ to finish her project.', 'continued', ['refused', 'forgot', 'failed'], '"Yet" signals a surprise: a tired person might stop, but she kept going.'],
    ['Since the lift was broken, we had to use the ___.', 'stairs', ['door', 'phone', 'bell'], '"Since" gives the reason. With no lift, the only way up is the stairs.'],
    ['Even though the test was hard, Arif stayed ___.', 'calm', ['worried', 'upset', 'confused'], '"Even though" signals a surprise: a hard test could upset someone, but Arif stayed calm.'],
    ['It was getting dark, so Dad switched on the ___.', 'lights', ['fan', 'radio', 'tap'], '"So" gives the result. When it gets dark, we switch on the lights.'],
    ['Despite the long queue, the customers remained ___.', 'patient', ['angry', 'restless', 'rude'], '"Despite" signals a surprise: a long queue could annoy people, but they stayed patient.'],
  ],

  wordParts: [
    ['The prefix "dis-" in "disagree" means ___.', 'not', ['again', 'before', 'very'], 'To disagree is to not agree. "Dis-" turns a word into its opposite.'],
    ['The prefix "mis-" in "misspell" means ___.', 'wrongly', ['again', 'before', 'together'], 'To misspell a word is to spell it wrongly.'],
    ['The suffix "-ful" in "hopeful" means ___.', 'full of', ['without', 'again', 'before'], 'A hopeful person is full of hope.'],
    ['The suffix "-er" in "painter" tells us the word names a ___.', 'person', ['place', 'feeling', 'time'], 'A painter is a person who paints. "-er" often names the person who does something.'],
    ['The prefix "tri-" in "tricycle" means ___.', 'three', ['two', 'one', 'many'], 'A tricycle has three wheels. "Tri-" means three, as in "triangle".'],
    ['The prefix "bi-" in "bicycle" means ___.', 'two', ['three', 'half', 'many'], 'A bicycle has two wheels. "Bi-" means two.'],
    ['The suffix "-less" in "homeless" means ___.', 'without', ['full of', 'again', 'more'], 'A homeless person is without a home.'],
    ['The prefix "over-" in "oversleep" means ___.', 'too much', ['too little', 'again', 'not'], 'To oversleep is to sleep too much or too long.'],
    ['The suffix "-able" in "washable" means ___.', 'can be', ['cannot be', 'full of', 'without'], 'A washable shirt can be washed.'],
    ['The prefix "multi-" in "multicoloured" means ___.', 'many', ['one', 'half', 'no'], 'Something multicoloured has many colours.'],
    ['The prefix "semi-" in "semicircle" means ___.', 'half', ['whole', 'double', 'small'], 'A semicircle is half a circle.'],
    ['The suffix "-est" in "tallest" means ___.', 'most', ['more', 'less', 'not'], 'The tallest pupil is the most tall of all. "-er" means more and "-est" means most.'],
  ],

  idiomaticExpressions: [
    ['"Once in a blue moon" means ___.', 'very rarely', ['every night', 'when it is dark', 'very often']],
    ['"A couch potato" is a person who is ___.', 'lazy and inactive', ['fond of vegetables', 'short and round', 'good at cooking']],
    ['"See eye to eye" means to ___.', 'agree with each other', ['stare at each other', 'stand very close', 'be the same height']],
    ['"In hot water" means ___.', 'in trouble', ['taking a bath', 'feeling warm', 'cooking soup']],
    ['"Cost an arm and a leg" means to be ___.', 'very expensive', ['very painful', 'very heavy', 'very dangerous']],
    ['"Call it a day" means to ___.', 'stop working', ['name the day', 'wake up early', 'phone a friend']],
    ['If friends "pull your leg", they ___ you.', 'tease', ['hurt', 'trip', 'carry']],
    ['"A fish out of water" describes someone who feels ___.', 'out of place', ['very thirsty', 'very cold', 'very free']],
    ['"Hit the sack" means to ___.', 'go to bed', ['punch a bag', 'pack a bag', 'drop something']],
    ['"Kill two birds with one stone" means to ___.', 'finish two tasks with one action', ['hurt animals', 'throw things carelessly', 'waste a lot of time']],
    ['"In the same boat" means ___.', 'in the same situation', ['on the same ship', 'in the same family', 'of the same age']],
    ['"Cry over spilt milk" means to ___.', 'be upset about something that cannot be changed', ['clean up a mess', 'waste food', 'ask for more milk']],
  ],
};

export const UPPER_ROWS = {
  actionVerbs: [
    ['The exhausted hikers ___ up the last steep stretch of the trail, their boots heavy with mud.', 'trudged', ['skipped', 'glided', 'dashed'], 'To trudge is to walk slowly with heavy steps, the way tired people in muddy boots walk.'],
    ['She ___ the letter into tiny pieces so that nobody could read it.', 'shredded', ['folded', 'sealed', 'posted'], 'To shred something is to tear or cut it into tiny pieces.'],
    ['The chef ___ the onions into small, even cubes before adding them to the pan.', 'diced', ['kneaded', 'whisked', 'peeled'], 'To dice is to cut food into small cubes. "Dice" are cubes too.'],
    ['Grandfather ___ at the tiny print on the medicine bottle, unable to read it without his glasses.', 'squinted', ['glared', 'winked', 'grinned'], 'To squint is to half-close your eyes to see something small or unclear.'],
    ['The thief ___ the handbag from the woman\'s shoulder and fled.', 'snatched', ['handed', 'placed', 'received'], 'To snatch is to grab something suddenly and roughly.'],
    ['He ___ the heavy cupboard across the room on his own, a few centimetres at a time.', 'dragged', ['flung', 'tossed', 'flicked'], 'To drag is to pull something heavy along the floor. Nobody can fling or toss a heavy cupboard.'],
    ['The little girl ___ at her mother\'s sleeve to get her attention.', 'tugged', ['hurled', 'crushed', 'folded'], 'To tug is to give a quick, short pull.'],
    ['The wind ___ the door shut with a bang that shook the windows.', 'slammed', ['eased', 'nudged', 'slid'], 'To slam is to shut with great force and noise. The "bang" is the clue.'],
    ['The toddler ___ unsteadily across the room towards his father\'s open arms.', 'tottered', ['marched', 'sprinted', 'strode'], 'To totter is to walk with shaky steps, as if about to fall. "Unsteadily" is the clue.'],
    ['She ___ the dough for ten minutes until it was smooth and stretchy.', 'kneaded', ['sliced', 'sprinkled', 'poured'], 'To knead is to press and fold dough with your hands.'],
    ['The crowd ___ forward as soon as the gates were opened.', 'surged', ['tiptoed', 'crawled', 'retreated'], 'To surge is to rush forward suddenly and strongly, like a wave.'],
    ['The goalkeeper ___ to his left at full stretch and tipped the ball over the bar.', 'lunged', ['strolled', 'crouched', 'wandered'], 'To lunge is to throw your body forward suddenly to reach something.'],
  ],

  similes: [
    ['The detective was as cunning as a ___ and soon tricked the thief into confessing.', 'fox', ['owl', 'ox', 'lamb']],
    ['Though he is over eighty, Mr Tan is as fit as a ___ and cycles every morning.', 'fiddle', ['fox', 'bull', 'drum']],
    ['The new recruit stood as stiff as a ___ while the sergeant inspected the line.', 'poker', ['pillow', 'ribbon', 'feather']],
    ['Without her glasses, Grandma is as blind as a ___.', 'bat', ['bee', 'cat', 'hawk']],
    ['On that windless morning, the surface of the pond was as smooth as ___.', 'glass', ['gravel', 'bark', 'wool']],
    ['He remained as cool as a ___ even when the judges questioned him sharply.', 'cucumber', ['candle', 'kettle', 'pepper']],
    ['The old sailor had survived three shipwrecks and was as tough as ___.', 'nails', ['pillows', 'petals', 'noodles']],
    ['After a good night\'s sleep, she woke up feeling as fresh as a ___.', 'daisy', ['desert', 'stone', 'shadow']],
    ['When the principal walked in, the noisy hall became as silent as the ___.', 'grave', ['market', 'storm', 'drum']],
    ['The classroom was as hot as an ___ after the air conditioner broke down.', 'oven', ['igloo', 'icebox', 'aquarium']],
    ['My grandmother is as wise as an ___, and everyone goes to her for advice.', 'owl', ['ox', 'eel', 'ant']],
    ['She turned as white as a ___ when she heard the terrible news.', 'sheet', ['rose', 'crow', 'plum']],
  ],

  soundVerbs: [
    ['The lost lamb ___ pitifully until its mother answered from across the field.', 'bleated', ['brayed', 'trumpeted', 'hooted']],
    ['The stubborn donkey ___ loudly and refused to take another step.', 'brayed', ['bleated', 'twittered', 'cackled']],
    ['Sensing danger, the elephant raised its trunk and ___ a warning to the herd.', 'trumpeted', ['twittered', 'grunted', 'bleated']],
    ['The hens ___ noisily when the farmer came to collect their eggs.', 'cackled', ['bellowed', 'trumpeted', 'brayed']],
    ['An owl ___ softly from the old angsana tree as night fell.', 'hooted', ['grunted', 'bellowed', 'cackled']],
    ['The injured puppy ___ softly as the vet examined its paw.', 'whimpered', ['bellowed', 'trumpeted', 'cackled']],
    ['The leopard bared its teeth and ___ at the intruder.', 'snarled', ['twittered', 'bleated', 'whimpered']],
    ['The pigs ___ contentedly as they rooted in the mud for food.', 'grunted', ['hooted', 'twittered', 'brayed']],
    ['A troop of monkeys ___ excitedly in the branches when the fruit seller passed by.', 'chattered', ['bellowed', 'hooted', 'bleated']],
    ['The angry bull ___ and pawed the ground before charging.', 'bellowed', ['twittered', 'whimpered', 'cackled']],
    ['The piglet ___ shrilly when the farmer lifted it off the ground.', 'squealed', ['hooted', 'bellowed', 'brayed']],
    ['Sparrows ___ cheerfully on the telephone wire outside my window.', 'twittered', ['snarled', 'grunted', 'bellowed']],
  ],

  emotionAdjectives: [
    ['After explaining the rule for the fifth time, the ___ coach threw up his hands.', 'exasperated', ['elated', 'contented', 'remorseful']],
    ['Never having spoken before a large audience, Hui Min felt ___ as she waited backstage.', 'apprehensive', ['indignant', 'remorseful', 'envious']],
    ['The team was ___ when the final whistle confirmed their first championship win.', 'elated', ['dejected', 'mortified', 'apprehensive']],
    ['Accused of cheating when he had done nothing wrong, Farid was ___.', 'indignant', ['remorseful', 'elated', 'contented']],
    ['Having lost the final by a single point, the ___ players sat silently in the changing room.', 'dejected', ['elated', 'contented', 'bewildered']],
    ['The tourists were ___ by the maze of narrow lanes and could not find their way back.', 'bewildered', ['elated', 'indignant', 'remorseful']],
    ['Feeling ___ for having lied to his mother, Ben decided to own up.', 'remorseful', ['indignant', 'elated', 'bewildered']],
    ['Kumar felt ___ when his cousin received the very bicycle he had been saving up for.', 'envious', ['remorseful', 'apprehensive', 'contented']],
    ['She was ___ when she realised she had been calling her new teacher by the wrong name all week.', 'mortified', ['elated', 'envious', 'contented']],
    ['The villagers were ___ to see snow falling in the middle of summer.', 'astonished', ['remorseful', 'envious', 'dejected']],
    ['With a good book and a cup of tea, Grandma sat in her armchair, perfectly ___.', 'contented', ['exasperated', 'mortified', 'indignant']],
    ['During her first week at the overseas camp, Aisha felt ___ and missed her family badly.', 'homesick', ['elated', 'indignant', 'astonished']],
  ],

  collectiveNouns: [
    ['A ___ of five judges will decide the winner of the debate.', 'panel', ['crew', 'gang', 'shoal']],
    ['The bride carried a ___ of white roses down the aisle.', 'bouquet', ['batch', 'panel', 'range']],
    ['The ship\'s ___ of sailors worked through the night to repair the torn sail.', 'crew', ['panel', 'choir', 'shoal']],
    ['The diver swam through a shimmering ___ of tiny silver fish.', 'shoal', ['batch', 'crew', 'range']],
    ['On a clear night you can see a ___ of stars shaped like a hunter.', 'constellation', ['range', 'bouquet', 'batch']],
    ['A ___ of snow-capped mountains stretched across the horizon.', 'range', ['shoal', 'panel', 'bundle']],
    ['Mum took a fresh ___ of cookies out of the oven.', 'batch', ['bouquet', 'gang', 'crew']],
    ['The old man carried a ___ of firewood on his back.', 'bundle', ['shoal', 'panel', 'choir']],
    ['The police finally caught the ___ of thieves who had been breaking into shops.', 'gang', ['choir', 'panel', 'bouquet']],
    ['The school ___ of sixty singers performed at the Esplanade.', 'choir', ['shoal', 'range', 'batch']],
    ['Our teacher read us three poems from a new ___ of verse by local writers.', 'anthology', ['bouquet', 'constellation', 'shoal']],
    ['The ___ of worshippers rose to its feet as the service began.', 'congregation', ['constellation', 'anthology', 'range']],
  ],

  placeNouns: [
    ['Hundreds of parrots and hornbills fly freely inside the walk-in ___ at the bird park.', 'aviary', ['orchard', 'quarry', 'granary']],
    ['We spent the morning picking apples from the trees in the ___.', 'orchard', ['quarry', 'shipyard', 'archive']],
    ['Granite for the new road was cut from a ___ on the edge of the island.', 'quarry', ['orchard', 'granary', 'pharmacy']],
    ['Through the giant telescope at the ___, we saw the rings of Saturn.', 'observatory', ['aviary', 'archive', 'courthouse']],
    ['After weeks without rain, the water level in the ___ had fallen sharply.', 'reservoir', ['granary', 'orchard', 'dormitory']],
    ['The boarders must be back in their ___ by nine o\'clock every night.', 'dormitory', ['courthouse', 'shipyard', 'observatory']],
    ['After the harvest, the farmers stored their rice in the village ___.', 'granary', ['aviary', 'reservoir', 'courthouse']],
    ['Old newspapers and photographs of the town are kept in the national ___.', 'archive', ['granary', 'greenhouse', 'shipyard']],
    ['The tanker was towed to the ___ to have its damaged hull repaired.', 'shipyard', ['courthouse', 'orchard', 'observatory']],
    ['Tomato seedlings are raised in a heated ___ until they are strong enough to plant outside.', 'greenhouse', ['granary', 'quarry', 'archive']],
    ['Reporters waited outside the ___ to hear the judge\'s verdict.', 'courthouse', ['pharmacy', 'dormitory', 'aviary']],
    ['Dad collected Grandma\'s medicine from the ___ with the doctor\'s prescription.', 'pharmacy', ['granary', 'archive', 'observatory']],
  ],

  bodyPartsAnimals: [
    ['Unlike whales, fish take in oxygen from the water through their ___.', 'gills', ['quills', 'tusks', 'hooves']],
    ['The octopus wrapped its eight ___ around the crab.', 'tentacles', ['antennae', 'flippers', 'talons']],
    ['An ant uses the two ___ on its head to feel and smell its way along a trail.', 'antennae', ['tentacles', 'tusks', 'quills']],
    ['The wild boar dug up roots with its long ___.', 'snout', ['flippers', 'gills', 'scales']],
    ['The cobra sank its ___ into its prey and injected venom.', 'fangs', ['hooves', 'gills', 'whiskers']],
    ['A pangolin is protected by hard, overlapping ___ that cover its body like armour.', 'scales', ['quills', 'whiskers', 'gills']],
    ['The sea turtle used its powerful ___ to haul itself up the beach.', 'flippers', ['tentacles', 'fangs', 'antennae']],
    ['When threatened, the porcupine raised the sharp ___ on its back.', 'quills', ['gills', 'scales', 'flippers']],
    ['The eagle swooped down and seized the rabbit in its ___.', 'talons', ['hooves', 'gills', 'antennae']],
    ['Poachers hunt elephants for their ivory ___.', 'tusks', ['quills', 'talons', 'flippers']],
    ['A cat uses its ___ to judge whether a gap is wide enough to squeeze through.', 'whiskers', ['fangs', 'talons', 'scales']],
    ['We heard the clatter of the horses\' ___ on the cobbled street.', 'hooves', ['flippers', 'whiskers', 'tentacles']],
  ],

  verbDistinction: [
    ['Please ___ your hand if you know the answer.', 'raise', ['rise', 'lay', 'lie']],
    ['Hot air balloons ___ because warm air is lighter than cold air.', 'rise', ['raise', 'lay', 'adapt']],
    ['Please ___ the baby gently in the cot.', 'lay', ['lie', 'rise', 'lose']],
    ['The doctor told him to ___ down and rest.', 'lie', ['lay', 'raise', 'lose']],
    ['I am happy to ___ your invitation to the party.', 'accept', ['except', 'adopt', 'affect']],
    ['Everyone ___ Mei Ling handed in the form on time.', 'except', ['accept', 'affect', 'adapt']],
    ['Too little sleep can ___ your marks.', 'affect', ['effect', 'accept', 'adopt']],
    ['The new rule had an immediate ___ on attendance.', 'effect', ['affect', 'advice', 'advise']],
    ['I would ___ you to check your work before handing it in.', 'advise', ['advice', 'adopt', 'adapt']],
    ['My grandfather gave me some good ___ about saving money.', 'advice', ['advise', 'effect', 'affect']],
    ['Be careful not to ___ your bus card on the way home.', 'lose', ['loose', 'lie', 'lay']],
    ['The screw was ___, so the shelf wobbled.', 'loose', ['lose', 'lay', 'raise']],
    ['The family decided to ___ a puppy from the animal shelter.', 'adopt', ['adapt', 'affect', 'advise']],
    ['Animals must ___ to changes in their surroundings to survive.', 'adapt', ['adopt', 'advise', 'raise']],
  ],
};

/**
 * Per-choice feedback built from a row's `why` sentence.
 *
 * @param {string} answer
 * @param {string[]} wrong
 * @param {string} [why]
 * @returns {Record<string, string>|undefined}
 */
export function explanationsFromWhy(answer, wrong, why) {
  if (!why) return undefined;
  const out = { [answer]: `"${answer}" is right. ${why}` };
  for (const choice of wrong) out[choice] = `Not "${choice}". ${why} The answer is "${answer}".`;
  return out;
}
