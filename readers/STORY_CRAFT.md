# Writing Giri stories that children want to read again

A decodable story has two jobs. It must use only the code the child has been
taught, which `npm test` checks. It must also be worth reading twice, which
no test checks. This page is about the second job.

The model is the early readers children ask for by name: Mo Willems'
Elephant & Piggie, Dr Seuss's Beginner Books, Julia Donaldson's rhyming
stories. They work with very few words, so the same tools work inside a
40-word decodable budget.

## The tools

| Tool                                | What it looks like                                                                                                                                                       | Giri example                                                                                             |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **A character who wants something** | Giri (or someone he meets) wants one thing, plainly, from the first line.                                                                                                | Giri wants a nap (`core-a-04`).                                                                          |
| **Rule of three**                   | The same move three times, a little bigger each time. The third time is where the joke or the change lands.                                                              | Tap! A cat. Clap! A band. Then everyone naps (`core-a-04`).                                              |
| **A refrain the child can shout**   | One short line that comes back, so the child reads it faster and louder each time. Use a `refrain` line: it is held to the story's code but sits outside the word count. | "Run, run! You can not get this bun!" (`core-a-13`)                                                      |
| **Dialogue that argues**            | Two voices disagreeing is drama in six words. Let the child do the voices.                                                                                               | "It is a hat!" "It is not!" (`core-a-01`)                                                                |
| **The reader knows first**          | Give the child a clue the character misses. They feel clever, and they reread to find it.                                                                                | The bun has legs. What are the legs? (`core-a-13`)                                                       |
| **A twist in the last line**        | The ending changes what came before. It should make the child laugh or say "Oh!" and want to go back.                                                                    | The cat did not want the snack. It wanted the lap (`core-a-02`). It was Giri who was lost (`core-a-11`). |
| **Sound you can hear**              | Sound effects are free to decode (see `ONOMATOPOEIA` in `decodability.js`) and fun to read aloud.                                                                        | Clang! Ding! Clink! (`core-a-08`)                                                                        |
| **Giri gets it wrong**              | A mascot who is a little too sure of himself is funnier, and kinder to a child who is still learning, than one who is always right.                                      | "I am the best at a rest!" (`core-a-16`)                                                                 |

## Habits to avoid

- **A list of events.** "Giri sat. The cat sat. The cat ran." with no want
  and no turn is practice, not a story.
- **Words forced in to tick a box.** The sight-word weave puts each quest's
  words in its story, but a word that sounds forced in ("Giri had a story to
  tell") makes the whole page sound wooden. Find a line where the word fits,
  or leave it for a later story. The weave test allows a few riders.
- **A moral at the end.** Let the twist do the work. The talk-about-it
  question is where a grown-up can draw out the lesson.
- **Changing tense mid-story.** Pick past or present and stay with it.
- **An ending that only explains.** "Giri was happy" closes the book. "The
  hat ran on Giri!" makes a child turn back to page one.

## Checking a draft

1. Read it aloud in a silly voice. If you would not read it twice to a
   five-year-old, change it.
2. Check the code and counts with `node scripts/audit-stories.mjs <storyId>`,
   then `node scripts/audit-stories.mjs --fix` to update the declared counts.
3. Run the story tests. They catch words above the story's code, too many
   words to pre-teach, and questions whose answer is not in the text.

   ```bash
   npx vitest run src/__tests__/storyDecodability.test.js src/__tests__/wordsToMeet.test.js src/__tests__/storyQuestions.test.js
   ```

4. Keep the premise of the cover picture (`illustration`), so the picture
   still matches the story.
5. Regenerate the picture-book kit with `npm run export:readers`.
