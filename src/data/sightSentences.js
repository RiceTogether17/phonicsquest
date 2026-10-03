/**
 * PhonicsQuest – Sight Word Sentences ("Sentence Stars")
 *
 * Three short decodable sentences for every sight word in Quests 1–10, taken
 * from the Giri "Sight Word Sentences" worksheet pack. Each sentence pairs a
 * sight word (read by heart) with CVC words the child decodes sound by sound,
 * and comes with its worksheet picture of Giri acting the sentence out.
 *
 * The three pictures of one word are the answer choices in the game: the
 * sentences differ only in their decodable words (cat / rat / mat), so the
 * child can only pick the right picture by actually decoding them.
 *
 * Pictures live in `public/images/sight-sentences/`.
 *
 * Keys are the quest words exactly as written in `SIGHT_QUESTS` (note 'I').
 */

/** @typedef {{ text: string, img: string }} SightSentence */

/** @type {Record<string, SightSentence[]>} */
export const SIGHT_SENTENCES = {
  'a': [
    { text: 'Sam has a cat.', img: 'sws_a_1.jpg' },
    { text: 'Max has a rat.', img: 'sws_a_2.jpg' },
    { text: 'Dan has a mat.', img: 'sws_a_3.jpg' },
  ],
  'about': [
    { text: 'Dan runs about.', img: 'sws_about_1.jpg' },
    { text: 'Jill hops about.', img: 'sws_about_2.jpg' },
    { text: 'Max digs about.', img: 'sws_about_3.jpg' },
  ],
  'above': [
    { text: 'A cat sits above.', img: 'sws_above_1.jpg' },
    { text: 'A bug sits above.', img: 'sws_above_2.jpg' },
    { text: 'A dog sits above.', img: 'sws_above_3.jpg' },
  ],
  'again': [
    { text: 'Pat runs again.', img: 'sws_again_1.jpg' },
    { text: 'A cat sits again.', img: 'sws_again_2.jpg' },
    { text: 'A pup digs again.', img: 'sws_again_3.jpg' },
  ],
  'all': [
    { text: 'All the dogs ran.', img: 'sws_all_1.jpg' },
    { text: 'All the kids ran.', img: 'sws_all_2.jpg' },
    { text: 'All the rats hid.', img: 'sws_all_3.jpg' },
  ],
  'also': [
    { text: 'She also has a cat.', img: 'sws_also_1.jpg' },
    { text: 'He also has a hat.', img: 'sws_also_2.jpg' },
    { text: 'I also have a bus.', img: 'sws_also_3.jpg' },
  ],
  'are': [
    { text: 'The dogs are big.', img: 'sws_are_1.jpg' },
    { text: 'The bats are black.', img: 'sws_are_2.jpg' },
    { text: 'The hats are red.', img: 'sws_are_3.jpg' },
  ],
  'be': [
    { text: 'It will be hot.', img: 'sws_be_1.jpg' },
    { text: 'It will be big.', img: 'sws_be_2.jpg' },
    { text: 'It will be fun.', img: 'sws_be_3.jpg' },
  ],
  'came': [
    { text: 'A fox came by.', img: 'sws_came_1.jpg' },
    { text: 'A pig came by.', img: 'sws_came_2.jpg' },
    { text: 'A frog came by.', img: 'sws_came_3.jpg' },
  ],
  'day': [
    { text: 'We run one day.', img: 'sws_day_1.jpg' },
    { text: 'We jump one day.', img: 'sws_day_2.jpg' },
    { text: 'We sit one day.', img: 'sws_day_3.jpg' },
  ],
  'do': [
    { text: 'Can it do tricks?', img: 'sws_do_1.jpg' },
    { text: 'Can he do flips?', img: 'sws_do_2.jpg' },
    { text: 'Can she do jumps?', img: 'sws_do_3.jpg' },
  ],
  'does': [
    { text: 'It does get hot.', img: 'sws_does_1.jpg' },
    { text: 'It does fit well.', img: 'sws_does_2.jpg' },
    { text: 'It does get wet.', img: 'sws_does_3.jpg' },
  ],
  'for': [
    { text: 'A mat for the cat.', img: 'sws_for_1.jpg' },
    { text: 'A log for the dog.', img: 'sws_for_2.jpg' },
    { text: 'A pen for the hen.', img: 'sws_for_3.jpg' },
  ],
  'go': [
    { text: 'I go in the hut.', img: 'sws_go_1.jpg' },
    { text: 'I go on the mat.', img: 'sws_go_2.jpg' },
    { text: 'I go in the zoo.', img: 'sws_go_3.jpg' },
  ],
  'he': [
    { text: 'He sits.', img: 'sws_he_1.jpg' },
    { text: 'He jogs.', img: 'sws_he_2.jpg' },
    { text: 'He hops.', img: 'sws_he_3.jpg' },
  ],
  'her': [
    { text: 'Her cat naps.', img: 'sws_her_1.jpg' },
    { text: 'Her fox runs.', img: 'sws_her_2.jpg' },
    { text: 'Her bat hid.', img: 'sws_her_3.jpg' },
  ],
  'his': [
    { text: 'His dog naps.', img: 'sws_his_1.jpg' },
    { text: 'His cat runs.', img: 'sws_his_2.jpg' },
    { text: 'His fox hid.', img: 'sws_his_3.jpg' },
  ],
  'I': [
    { text: 'I ran.', img: 'sws_i_1.jpg' },
    { text: 'I hit.', img: 'sws_i_2.jpg' },
    { text: 'I cut.', img: 'sws_i_3.jpg' },
  ],
  'how': [
    { text: 'How did it nap?', img: 'sws_how_1.jpg' },
    { text: 'How did it run?', img: 'sws_how_2.jpg' },
    { text: 'How did it hop?', img: 'sws_how_3.jpg' },
  ],
  'in': [
    { text: 'A cat sat in a hat.', img: 'sws_in_1.jpg' },
    { text: 'A pig dug in a wig.', img: 'sws_in_2.jpg' },
    { text: 'A fox hid in a box.', img: 'sws_in_3.jpg' },
  ],
  'into': [
    { text: 'It digs into the mud.', img: 'sws_into_1.jpg' },
    { text: 'It hops into a box.', img: 'sws_into_2.jpg' },
    { text: 'It went into a net.', img: 'sws_into_3.jpg' },
  ],
  'is': [
    { text: 'It is hot.', img: 'sws_is_1.jpg' },
    { text: 'It is wet.', img: 'sws_is_2.jpg' },
    { text: 'It is fun.', img: 'sws_is_3.jpg' },
  ],
  'it': [
    { text: 'It is a dot.', img: 'sws_it_1.jpg' },
    { text: 'It is a log.', img: 'sws_it_2.jpg' },
    { text: 'It is a bog.', img: 'sws_it_3.jpg' },
  ],
  'know': [
    { text: 'I know that cat.', img: 'sws_know_1.jpg' },
    { text: 'I know that bat.', img: 'sws_know_2.jpg' },
    { text: 'I know that jet.', img: 'sws_know_3.jpg' },
  ],
  'many': [
    { text: 'Many kids jump.', img: 'sws_many_1.jpg' },
    { text: 'Many dogs run.', img: 'sws_many_2.jpg' },
    { text: 'Many cats nap.', img: 'sws_many_3.jpg' },
  ],
  'name': [
    { text: 'My name is Tim.', img: 'sws_name_1.jpg' },
    { text: 'My name is Kim.', img: 'sws_name_2.jpg' },
    { text: 'My name is Jim.', img: 'sws_name_3.jpg' },
  ],
  'not': [
    { text: 'I did not run.', img: 'sws_not_1.jpg' },
    { text: 'I did not hit.', img: 'sws_not_2.jpg' },
    { text: 'I did not cut.', img: 'sws_not_3.jpg' },
  ],
  'now': [
    { text: 'Now it will run.', img: 'sws_now_1.jpg' },
    { text: 'Now it will nap.', img: 'sws_now_2.jpg' },
    { text: 'Now it will jump.', img: 'sws_now_3.jpg' },
  ],
  'of': [
    { text: 'A cup of tea.', img: 'sws_of_1.jpg' },
    { text: 'A cup of jam.', img: 'sws_of_2.jpg' },
    { text: 'A cup of wax.', img: 'sws_of_3.jpg' },
  ],
  'on': [
    { text: 'It is on the mat.', img: 'sws_on_1.jpg' },
    { text: 'It is on the log.', img: 'sws_on_2.jpg' },
    { text: 'It is on the rug.', img: 'sws_on_3.jpg' },
  ],
  'one': [
    { text: 'One cat on the mat.', img: 'sws_one_1.jpg' },
    { text: 'One dog in the sun.', img: 'sws_one_2.jpg' },
    { text: 'One kid in the hut.', img: 'sws_one_3.jpg' },
  ],
  'she': [
    { text: 'She runs.', img: 'sws_she_1.jpg' },
    { text: 'She jumps.', img: 'sws_she_2.jpg' },
    { text: 'She sits.', img: 'sws_she_3.jpg' },
  ],
  'over': [
    { text: 'over the lake', img: 'sws_over_1.jpg' },
    { text: 'over the rope', img: 'sws_over_2.jpg' },
    { text: 'over the hills', img: 'sws_over_3.jpg' },
  ],
  'said': [
    { text: 'He said it was big.', img: 'sws_said_1.jpg' },
    { text: 'She said to sit down.', img: 'sws_said_2.jpg' },
    { text: 'Mum said to eat up.', img: 'sws_said_3.jpg' },
  ],
  'so': [
    { text: 'It is so big.', img: 'sws_so_1.jpg' },
    { text: 'It is so fat.', img: 'sws_so_2.jpg' },
    { text: 'It is so hot.', img: 'sws_so_3.jpg' },
  ],
  'some': [
    { text: 'I have some jam.', img: 'sws_some_1.jpg' },
    { text: 'He has some pens.', img: 'sws_some_2.jpg' },
    { text: 'She has some pets.', img: 'sws_some_3.jpg' },
  ],
  'their': [
    { text: 'Their dogs run.', img: 'sws_their_1.jpg' },
    { text: 'Their cats nap.', img: 'sws_their_2.jpg' },
    { text: 'Their rats nip.', img: 'sws_their_3.jpg' },
  ],
  'story': [
    { text: 'The story was sad.', img: 'sws_story_1.jpg' },
    { text: 'The story was fun.', img: 'sws_story_2.jpg' },
    { text: 'The story was good.', img: 'sws_story_3.jpg' },
  ],
  'the': [
    { text: 'The book.', img: 'sws_the_1.jpg' },
    { text: 'The cook.', img: 'sws_the_2.jpg' },
    { text: 'The hoop.', img: 'sws_the_3.jpg' },
  ],
  'then': [
    { text: 'then she ran', img: 'sws_then_1.jpg' },
    { text: 'then he cut', img: 'sws_then_2.jpg' },
    { text: 'then he put', img: 'sws_then_3.jpg' },
  ],
  'there': [
    { text: 'There is a cat.', img: 'sws_there_1.jpg' },
    { text: 'There is a bat.', img: 'sws_there_2.jpg' },
    { text: 'There is a vat.', img: 'sws_there_3.jpg' },
  ],
  'this': [
    { text: 'This is a bag.', img: 'sws_this_1.jpg' },
    { text: 'This is a pen.', img: 'sws_this_2.jpg' },
    { text: 'This is a bot.', img: 'sws_this_3.jpg' },
  ],
  'to': [
    { text: 'Go to the van.', img: 'sws_to_1.jpg' },
    { text: 'Go to the cot.', img: 'sws_to_2.jpg' },
    { text: 'Go to the bot.', img: 'sws_to_3.jpg' },
  ],
  'too': [
    { text: 'It is too big.', img: 'sws_too_1.jpg' },
    { text: 'It is too hot.', img: 'sws_too_2.jpg' },
    { text: 'It is too ill.', img: 'sws_too_3.jpg' },
  ],
  'want': [
    { text: 'I want a bag.', img: 'sws_want_1.jpg' },
    { text: 'I want a bot.', img: 'sws_want_2.jpg' },
    { text: 'I want a box.', img: 'sws_want_3.jpg' },
  ],
  'was': [
    { text: 'The frog was big.', img: 'sws_was_1.jpg' },
    { text: 'The bat was wet.', img: 'sws_was_2.jpg' },
    { text: 'The dog was hot.', img: 'sws_was_3.jpg' },
  ],
  'were': [
    { text: 'They were hot.', img: 'sws_were_1.jpg' },
    { text: 'They were ill.', img: 'sws_were_2.jpg' },
    { text: 'They were fun.', img: 'sws_were_3.jpg' },
  ],
  'when': [
    { text: 'When the sun sets.', img: 'sws_when_1.jpg' },
    { text: 'When the dog ran.', img: 'sws_when_2.jpg' },
    { text: 'When the bat naps.', img: 'sws_when_3.jpg' },
  ],
  'what': [
    { text: 'What is in the bag?', img: 'sws_what_1.jpg' },
    { text: 'What is in the bog?', img: 'sws_what_2.jpg' },
    { text: 'What is in the bug?', img: 'sws_what_3.jpg' },
  ],
  'white': [
    { text: 'A white dog.', img: 'sws_white_1.jpg' },
    { text: 'A white cat.', img: 'sws_white_2.jpg' },
    { text: 'A white rat.', img: 'sws_white_3.jpg' },
  ],
};

/**
 * The sentences for one sight word, or an empty array if it has none.
 * @param {string} word
 * @returns {SightSentence[]}
 */
export function getSentencesForWord(word) {
  return SIGHT_SENTENCES[word] ?? [];
}

/**
 * Whether every word in a quest has sentences, so the game can run it.
 * @param {{ words: string[] } | null | undefined} quest
 */
export function questHasSentences(quest) {
  return Boolean(quest?.words?.length) && quest.words.every((w) => getSentencesForWord(w).length > 0);
}
