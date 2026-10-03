# Giri Readers — picture kit

Everything needed to turn the 69 Giri stories into printed picture books:
the words for every page, a ChatGPT prompt for every picture, and a
"reading together" page for the grown-up.

| File                                            | Books | Pictures (with covers) | Ages |
| ----------------------------------------------- | ----: | ---------------------: | ---- |
| [1-band-a.md](1-band-a.md) — short vowels       |    16 |                     96 | 4–6  |
| [2-band-b.md](2-band-b.md) — long vowels        |    19 |                    114 | 5–7  |
| [3-band-c.md](3-band-c.md) — ar, or, er, ir, ur |    12 |                     49 | 6–8  |
| [4-band-d.md](4-band-d.md) — oi, ou, air, aw…   |    11 |                     55 | 7–9  |
| [5-singapore.md](5-singapore.md)                |     6 |                     36 | 5–8  |
| [6-chapter-books.md](6-chapter-books.md)        |     2 |                     18 | 7–9  |
| **Total**                                       |    66 |                    368 |      |

The two chapter books hold five chapters between them, so 69 stories make
66 books. [pictures.csv](pictures.csv) lists every picture with
its file name and a `done` column to tick off as you go.

Start with **Set 1**. It is the smallest, and Band A is where a child starts
reading.

## Once, before the first book

1. **Make a ChatGPT Project** called "Giri Readers", so the pictures and
   chats for this job stay in one place.
2. **Make Giri's character sheet.** Start a chat, attach
   `public/images/mascot/giri-neutral.png`, and paste:

   ```text
   Using the attached picture of Giri, make a character sheet on a plain white background: Giri from the front, from the side and from the back, then walking, waving and sitting. Keep him exactly like the picture — bamboo steamer-basket hat tied with red string, golden dumpling ears, dark seaweed-strip eyebrows, black oval eyes, yellow pineapple-bun tummy. Same cartoon style. No words or letters.
   ```

   Save the result as `giri-sheet.png`. From now on, attach this sheet in
   every book's chat. One clear reference is what keeps Giri looking the
   same across 368 pictures.

3. For books with **Mrs Tan** (Sets 3 and 4), also attach
   `public/images/stories/giri_level03_story06_neighbour.jpg`, which shows
   her as the app already draws her.

## For each book

1. **Start a new chat** in the project, so one story can't leak into the
   next. Attach `giri-sheet.png`.
2. **Paste the setup message** (section 1 under the book). ChatGPT should
   reply "Ready".
3. **Paste the cover message, then one page message at a time** (section 2).
4. **Check each picture** against the checklist below. If it fails, say
   what's wrong ("There is a word on the shop sign — take it off") and ask
   again.
5. **Save it with the file name shown** (for example `core-a-01-p02.png`),
   all in one folder. The layout step that builds the printable book finds
   pictures by these names.
6. Tick it off in `pictures.csv`.

ChatGPT limits how many pictures you can make in a day, so plan a set over
several sittings.

## Picture checklist

- [ ] **Everything the words name is there, and looks like it.** If the
      page says "hat", there's a hat a child would call a hat.
- [ ] **Nothing extra a child could name instead.** Bands A and B need plain
      backgrounds.
- [ ] **No words, letters or numbers anywhere.** ChatGPT tends to put them on
      signs, books and T-shirts, and its spelling isn't reliable.
- [ ] **Giri is Giri:** steamer hat, dumpling ears, seaweed eyebrows,
      pineapple-bun tummy.
- [ ] **It doesn't give away the next page.**

### Why these rules matter

In a decodable reader the child is meant to **read the words, not the
picture**. If a picture shows things the text doesn't mention, a child who
is stuck looks up and guesses ("dog!" when the word is "pup"). Guessing is
the habit phonics teaching tries to replace. So the picture's job is to
**confirm** what the child has just read: they sound out "the cat sat on
the hat", look up, and see they were right. That is also why the
reading-together steps say to look at the picture after reading the page,
not before.

## The reading-together page

Each book ends with a page for the grown-up, built from the same data the
app uses:

- **Sounds in this book.** The book's target sounds, each with words from
  the story to practise first.
- **Words to know first.** Words the child can't sound out yet. ❤️ marks a
  heart word, with its one tricky part named ("said: ai says /e/").
- **Questions** with the answers ticked, and talk-about-it prompts.

Each set file also has a short "How to read these books together" section.
Print it inside the cover of every book in that set.

## Characters

Giri and Mrs Tan are described from the existing app pictures. **Mum is a
placeholder:** she is described as a taller rice-ball with a pink apron and
no hat. If you'd like her to look different, change her line in
`scripts/export-reader-prompts.mjs` (`CAST`) and re-run the script below,
before you draw any of her books.

## Print size

A 1024 × 1024 picture prints sharp at about 9 cm square (300 dpi). That
fits an A5 page with the text underneath. For a bigger picture, upscale it
first.

## If a story changes

The set files and `pictures.csv` are generated from `src/data/stories.js`.
After a story changes, rebuild them:

```bash
npm run export:readers
```

Don't edit the generated files by hand. Your changes would be lost the next
time the script runs.
