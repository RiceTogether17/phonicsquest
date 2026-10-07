# Second-reader review: Grammar MCQ, Vocabulary MCQ, Sentence Forge, Cloze Castle, Word Vault

**Date:** 2026-10-07 · **Base commit:** `f21a9b4` · **Regression tests:** `src/__tests__/secondReaderReview.test.js`

The 2026-09-19 audit (finding 11) asked for one thing that tests cannot do: a
second reader who completes every item with every option and asks _is this
also right?_ Its own acceptance bar was "every released MCQ has one defensible
answer in its stated context, and open cloze accepts all teacher-approved
completions." Remediation fixed the six items it named and stated plainly that
the remaining banks had not been reviewed. This is that review, for the five
Primary English modules above.

## Verdict

The engineering around these modules is careful. The content had three kinds
of problem that teach a child the wrong thing, all now fixed where the fix was
clear:

1. **Correct English marked wrong.** This was the most common fault, and it was
   systematic rather than occasional. Distractors were built from the same verb
   in another tense, or a near-synonym, without checking whether that option
   also fits. Examples: _My cousins **played** badminton after school_,
   _If you heat ice, it **will melt**_, _Tomorrow, our class **is visiting** the
   science centre_, _Please **turn off** the music_. A child who knows English
   learns that the app's preference outranks meaning.
2. **Wrong English marked right.** The app required some answers that are wrong
   English: _Never **did** I **expected**_, _a large amount of **resources**_,
   _we stacked books **in** the shelf_ (with **on** offered as the "wrong"
   answer), and _I saw an owl near **The** old tree. **a** owl flew away_. The
   last came from a code bug that rewrote Word Vault answer keys (see W1).
3. **Explanations that teach a false rule.** _"'Passed' is simple past; 'had
   passed' is needed"_ (both are correct after _once_);
   _"'Is having'… next month is further away"_ (the present continuous works for
   arrangements at any distance); _"'Must not have' expresses prohibition"_ (it
   is a deduction).

Two larger design issues remain open because they need a decision, not an edit.
The **clue hunt** teaches the wrong evidence on auto-generated clues, and most
of **Word Vault** is a template generator that gives every level, P1 to P6,
the same answers. Both are under _Open, needs a decision_ below.

## What was read

| Module         | Read                                                                                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grammar MCQ    | All 887 distinct question/answer pairs across P1–P6, each completed with every option, plus the option explanations of every item changed.                    |
| Vocabulary MCQ | All 754 distinct pairs, same method.                                                                                                                          |
| Cloze Castle   | All 529 distinct passages, every blank filled with every bank word.                                                                                           |
| Word Vault     | All 245 hand-written passages; the generator's 14 categories × 3 templates (504 passages) read as templates; the build pipeline that post-processes the bank. |
| Sentence Forge | All 1,559 sentences scanned for words that can legitimately move; the 211 candidates read individually. Answer checking and feedback code read.               |
| Shared code    | Name variation (`practiceExpansion.js`), cloze grading (`clozeEngine.js`, both modes), clue derivation, Word Vault enrichment, Sentence Forge checking.       |

## Findings and what changed

### P1 — fixed in this change

**W1. Word Vault rewrote answer keys (code bug).** `enrichVocabMetadata`
removed repeated answers case-insensitively and refilled the gap from the word
bank, so a passage that needs a word twice had a _distractor_ keyed as correct.
It also deleted the duplicate tiles the child needed to finish. Four passages
and their revision rounds were served with corrupt keys:

| Passage     | Served key required                                       |
| ----------- | --------------------------------------------------------- |
| `ga-p2-01`  | "I saw an owl near **The** old tree. **a** owl flew away" |
| `con-p2-03` | "They clapped **Because** the song ended"                 |
| `con-p4-02` | "The team won **Because of** all the challenges"          |
| `con-p2-02` | "We brush our teeth **When** we go to bed"                |

Answers are now kept as authored. The bank keeps one tile per blank that needs
it. The four passages were re-authored with distinct words, because the bank
validator requires that. A test now checks that every passage carries the tiles
its own answers need.

**W2. Wrong keys, broken sentences and factual errors.** Fixed:

- Cloze Castle: _Never ~~did I expected~~ did I expect_; _feels ~~much neater neat~~_;
  _has completed the prototype ~~since last Wednesday~~_; _~~By Tuesday~~ … has read
  … since Monday_; _~~Although~~ a member forgets the schedule, we remind them_;
  _won ~~because of~~ all the challenges_; _the class~~'~~'s football_ (the P3 bank
  teaches _class's_); _the ~~longer~~ event_ among three races; _a large ~~amount~~
  number of resources_; a first-mention _the drink_; contradictions such as
  _a little rain_ next to _the heavy storm_ and _too little equipment_ next to
  _plenty of supplies_; _Kai has been checking … before we started presenting_.
- Word Vault: _a eraser_, _a aeroplane_, _a island_; _a compass shows top,
  bottom, left and right_; _Because his friends were chatting, he became
  **focused**_ (with **distracted** in the bank) in every generated connector
  passage; _we stacked books **in** the shelf_; _During reading corner_,
  _During bus ride home_ and similar in every generated context; _pencilcase_.
- Vocabulary MCQ: _A rule … is called a **rule**_; _The person who leads a
  country is called the **leader**_; _The opposite of "oppressive" **in this
  passage**_ with no passage; _everyone wore **sunglasses** glasses_; _The heron
  **waded motionless**_; a forensic technician _wiping_ evidence before dusting
  it for fingerprints.
- Grammar MCQ: _She drank **a little** water because she was very thirsty_;
  _By tomorrow morning, my brother **will finish**_ (the bank's own
  tense-awareness items mark _will finish_ wrong after _By next Friday_);
  _The red pencil case is not hers — mine is blue_.

**W3. Distractors that were also correct (MCQ).** About 80 Grammar and 55
Vocabulary items were changed. In each, either the distractor was replaced with
one that is actually wrong, or the stem gained the context that rules it out.
The patterns, so a future author can avoid them:

| Pattern                                                            | Example                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| Agreement item offers the past tense, which shows no agreement     | _My cousins ___ badminton_: play / **played**                      |
| _while_ / _after_ / _before_ / _once_ item offers the simple past  | _While the coach ___ the strategy_: was explaining / **explained** |
| Future item offers the present continuous or the timetable present | _Tomorrow, our class ____: will visit / **is visiting**            |
| Zero conditional offers _will_                                     | _If you heat ice, it ____: melts / **will melt**                   |
| Reported speech offers _must_ or a past form with a stated time    | _The doctor said that I ____: should drink / **must drink**        |
| Preposition with no position cue                                   | _The cat is hiding ___ the chair_: under / **behind**              |
| Near-synonym action, sound and emotion verbs                       | _the snake ___ towards her_: slithered / **slid, crept, glided**   |
| Phrasal verb pairs                                                 | _Please ___ the music_: turn down / **turn off**                   |
| Quantifier with no amount cue                                      | _There are ___ children_: many / **some**                          |
| Definition matched by a distractor                                 | _new to a job and still learning_: apprentice / **intern**         |

Every replacement option has its own explanation, and explanations that taught a
false rule were rewritten. The two items the earlier remediation "fixed" by
adding a time phrase (_supported … which begins this Monday_, _was very
exciting — we leave on Friday_) were still double-correct. Their tests in
`ambiguousItems.test.js` now pin the stronger fix.

**W4. Cloze banks that hold a synonym of the answer.** Many Cloze Castle and
Word Vault banks contain a second correct word. Examples: _Although_ beside
_Even though_, _Moreover_ beside _Furthermore_, _which_ beside _that_ in a
defining clause, _should_ beside _must_ in a rule, _tells_ beside _reads_ for
a bedtime story, _hold_ beside _organise_ a meeting. Removing every
near-synonym would remove the lesson, so the engine now accepts them.
`isBlankAnswerCorrect` in `clozeEngine.js` marks a blank right if it matches
the key or an entry in `passage.acceptableAnswers`. The alternatives live in
`src/data/clozeAcceptableAnswers.js`: 127 Cloze Castle seeds and 46 Word Vault
seeds, inherited by every revision round. A test checks that each alternative
is a real tile in that blank. Verified in the browser: _Although_ in a P5
connector passage is marked correct, and _because_ in the same blank is still
marked wrong.

**W5. Sentence Forge rejected valid word orders.** Only 3 of 1,559 sentences
accepted a second order, and inconsistently. _The old man walked slowly down
the stairs_ accepted _slowly walked_. _My sister packed her suitcase
carefully_ rejected _My sister carefully packed her suitcase_. 78 sentences now
accept the second order (`src/data/sentenceForgeAlternatives.js`), each built
from exactly the target's tiles. When a child uses it, the feedback now reads
"Correct! You could also say: …" instead of a plain "Perfect!", so the child
learns that English allowed both.

**W6. Name variation changed a person's gender.** `varyMcqNames` did not treat
_Aunt_ as a title or plural words as gendered. That produced _"Aunt Omar
asked"_, _"Aunt Arjun asked"_ and _"Among the three brothers, Nurul is the
tallest"_. _Aunt_ is now a title, and _brothers, sisters, boys, girls, sons,
daughters, mother, father, aunt, uncle, nephew, niece_ count as gendered.

### Open — needs a decision (not changed here)

**D1. The clue hunt teaches the wrong evidence on generated clues.** Before
choosing a word, the child must tap "the clue word" for each blank. For 52% of
Cloze Castle clues and 68% of Word Vault clues there is no authored clue. The
code takes the 3–5 words to the _right_ of the blank as the "strong" clue, and
the explanation says only _"The phrase X gives a clue for the correct grammar
form."_ For _Tom is my friend. ___ likes to play_ the strong clue is _likes to
play_, so a child who taps **Tom**, the real clue, is told it is weak. For
_the path outside was ___. Mei opened her…_ the strong clue is _". Mei opened
her"_, punctuation included. Options, best first: (a) skip the clue step for
blanks with no authored clue, (b) derive clues per category (antecedent for
pronouns, subject for agreement, time words for tense, next word's sound for
articles), or (c) accept any word in the blank's sentence as a strong clue.
Option (a) is a small change and stops the harm today.

**D2. Word Vault is mostly a template generator, identical at every level.**
504 of 749 "distinct" passages come from `vocabPassagesExtra/generator.js`.
Each category uses the same three answers at every level, so a P6 child doing
Context Inference fills in _muddy / umbrella / dry_ 34 times. Seven categories
at P1 and P2 have no hand-written passage at all, and nor do the three grammar
categories at any level. The language errors are fixed (W2). The design
problem stands: the generator adds volume, not vocabulary. Recommend replacing
it with authored passages per level (even 4–6 per category would be more
teaching), or at minimum using different answer sets per level band.

**D3. Year levels are barely differentiated.** 344 of 887 Grammar MCQ seeds are
served at four or more levels. Vocabulary uses two tiers (P1–P2 and P3–P6), so
a P3 child gets _legislature, pacifist, treaty_ and a P6 child gets the same.
Some P1 items ask for _efficient, veterinarian, exhausted_. Recommend a
difficulty spine per category before adding more items.

**D4. The hardest topics get the least teaching.** 106 Grammar and 103
Vocabulary items fall back to a generic explanation (_"'X' is the choice that
fits this sentence"_). That covers every Reported Speech, Inversion and Mixed
Grammar item, and every Connector Clue, Action Verb and Manner Adverb item: the
P5–P6 topics where a child most needs to know _why_. Authoring per-option
explanations for these ~200 items is the highest-value writing task in these
modules.

**D5. Judgement calls left as they were.** Each of these is defensible in a
Singapore exam context, but each should be a deliberate choice, and the
feedback should say "both are used; in exams, choose X":

- _whom_ vs _who_ as an object;
- collective nouns with plural verbs (_the committee … their_, _a group of
  boys are_), which is standard British usage;
- _was_ vs _were_ in second conditionals;
- past-perfect items that still offer the simple past where a _by the time_
  cue exists;
- "Collective Nouns" mixes true collectives (_flock, pride_) with containers and
  partitives (_carton, loaf, tray, flight of stairs_) without saying so.

## Verification

- Unit tests: 235 files, 3,159 tests pass, including 40 new tests in
  `secondReaderReview.test.js` and the two updated tests in
  `ambiguousItems.test.js`.
- `npm run build` (contracts check, bundle, service-worker manifest) passes;
  typecheck passes; lint has 0 errors; scope/sequence check is up to date.
- Browser tests: smoke, app shell, full session and primary-section
  accessibility suites (30 tests) pass.
- In the browser: a P5 Cloze Castle connector passage marks _Although_ in the
  _Even though_ blank correct, and _because_ wrong.

## Suggested next steps, in order

1. D1 option (a): skip the clue step where the clue was generated. This is a
   small change that stops active mis-teaching.
2. D4: author per-option explanations for Reported Speech, Inversion, Mixed
   Grammar, Connector Clue, Action Verbs and Manner Adverbs.
3. D2: author Word Vault passages per level and retire or demote the generator.
4. D3: give each category a P1→P6 difficulty spine.
5. Keep `secondReaderReview.test.js`'s pattern. When a new item is authored,
   complete it with every option before release. A validator cannot do this.
