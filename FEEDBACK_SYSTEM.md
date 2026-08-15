# PhonicsQuest — the Primary English feedback system

> How every Primary English mode answers a child who gets something wrong,
> and where to change it. Companion to `VALIDITY_ROADMAP.md` (measurement
> validity), `UX_AUDIT_FINDINGS.md` (interaction design) and `CONTENT_QA.md`
> (content checks).

## The problem this replaces

Before this system each mode wrote its own reply to a wrong answer, and the
quality ranged from a full hint ladder (Cloze Castle) to a bare
`❌ Not quite. Correct answer: were`. The weakest of them did the one thing a
teacher never does: hand over the answer on the first mistake, with nothing in
between. Where a mode did explain, the explanation depended on hand-authored
`optionExplanations` / `wrongOptionTraps` that exist on a small fraction of the
banks; everywhere else the "explanation" was a restatement of "wrong":

    "a" does not match the clue in this sentence.

## What a teacher does, and where each part lives

| Teacher move                                    | Implementation                                  |
| ----------------------------------------------- | ----------------------------------------------- |
| Withhold the answer once; point at the evidence | `teacherFeedback.js` — `coach` stage            |
| Name the actual slip, not just "wrong"          | `answerDiagnosis.js` + `misconceptions.js`      |
| Give the rule, a worked example, the habit      | `misconceptions.js` fields, `reteach` stage     |
| Explain the _correct_ answers too               | `praise` stage                                  |
| Remember across questions and sessions          | the misconception log, `store.misconceptionLog` |
| Ask for the reasoning back                      | `transfer` section on `reteach`                 |
| Tell the grown-up what to work on               | `parentReportCard.js` → `card.habits`           |

## The three modules

### `src/modules/misconceptions.js` — what can go wrong

27 named misconceptions. Each carries five separable strings because the ladder
uses them at different moments:

- `childName` — plain language, shown to the child ("matching the verb to the
  closest word instead of the real subject")
- `label` — the technical name, for parent/teacher reporting
- `rule` — the transferable rule, one sentence
- `example` — a worked model
- `cue` — **the first-attempt prompt**, phrased so it can be shown _before_ the
  answer is revealed and still be useful
- `selfCheck` — the habit to carry to the next question

`cue` is what makes this a teaching system rather than an answer key.

### `src/modules/answerDiagnosis.js` — which one applies

Pure functions over strings: no DOM, no store, no network. Given the stem, the
chosen answer and the correct answer, ~16 ordered detectors work out the
misconception morphologically and from the clue words in the stem:

- `was` for `were` → subject–verb agreement (or _agreement with the nearest
  noun_ when a phrase sits between subject and verb)
- `walks` for `walked` with "yesterday" in the stem → a missed time signal,
  and the evidence returned is the word `yesterday`
- `swims` for `swim` after "can" → verb form after a helper
- `their` for `there` → homophone
- `careful` for `carefully` → word form
- `beautifull` for `beautiful` → spelling slip

The key property is **coverage without authoring**: detection works on the
whole bank, not the fraction with hand-written explanations. Authored text
still wins where it exists.

Entry points:

- `diagnoseAnswer({ stem, given, correct, choices, skill, domain })`
- `diagnoseWrittenAnswer({ given, model, requiredWords, … })` for typed answers
- `stemForBlank(text, blankIndex, answers)` — the sentence around one blank of a
  passage, siblings filled in, so the detectors can see the subject and the time
  words. Understands all three blank markers in use: `___`, `{{n}}`, `(n)`
- `stemAroundToken(text, token)` — the same for a word being corrected in place

Every wrong answer gets a misconception. When no detector matches, the domain
fallback is used and `matched: false` is returned — callers use that to prefer
authored text, and the re-teach avoids announcing a placeholder as a finding.

### `src/modules/teacherFeedback.js` — what to say, and when

The ladder:

| Attempt               | Stage              | Shows                                                               |
| --------------------- | ------------------ | ------------------------------------------------------------------- |
| 1st wrong             | `coach`            | cue + the evidence to look at. **No answer.**                       |
| 2nd wrong             | `reteach`          | slip named, rule, example, answer, next-time habit, transfer prompt |
| correct               | `praise`           | one line of _why_ it works                                          |
| correct after a retry | `praise-recovered` | credit for checking again                                           |

Plus the pattern log: `recordMisconception` on each revealed slip,
`creditMisconception` on each clean answer. A misconception is named as a
pattern on its **third** sighting within 14 days, and retired after **three**
clean answers. `getMisconceptionSummary()` feeds the parent report.

`renderTeacherFeedbackHtml()` renders the shared card anatomy;
`teacherFeedbackText()` gives the plain-text form for tests and screen readers.

## Scoring rule: the mark is the first attempt

**A retry teaches; it does not score.** Every mode records mastery, session
score, streak and the missed-item list from the first attempt only, so a child
who self-corrects on the second look still shows as not knowing it cold. This
mirrors the early-reading `choiceRound` controller, which has always scored
first attempts only, and it is what keeps the retry from inflating the
`VALIDITY_ROADMAP.md` Priority 0 evidence model.

Three modes were double-counting before this work — Synthesis Quest and
Sentence Forge recorded an attempt on _every_ submission, so an item solved on
the second try was recorded as one wrong **and** one right. Both now record
once.

## Wiring a new mode in

1. **Choice-based rounds** — call `attachMcqAnswerLadder()` from
   `src/modes/mcqFeedback.js` with the `[data-choice]` container, the feedback
   element, and an `onFirstAttempt` hook for the measurement. It owns the
   retry, focus management, answer reveal and the Next button. Grammar MCQ,
   Vocabulary MCQ and Listening Comprehension use it.
2. **Batch-marked passages** — diagnose per blank with `diagnoseAnswer` +
   `stemForBlank`, then call `recordMisconceptionsFromReview(rows)` once per
   submission. Cloze Castle, Word Vault, Comprehension Cloze and the practice
   papers use this shape.
3. **Typed answers** — `buildWrittenFeedback()` / `diagnoseWrittenAnswer()`.
   Synthesis Quest and Editing Quest use these.

Pass `cue` to override the first-attempt prompt when the medium calls for it —
Listening Comprehension says "play that part once more" rather than "go back to
the passage".

## Deliberate choices worth keeping

- **Authored text always wins.** A human sentence about _this_ distractor beats
  a detected category. The diagnosis then supplies the rule, example, habit and
  pattern tracking that authored text never carried.
- **A re-teach is blue, not red.** Colour is by stage, not by right/wrong: we
  are learning something, not failing. Every row also carries an icon and a
  word, so meaning survives without colour.
- **Hints never leak answers.** Editing Quest used to reveal the first letter
  of the correction. A first letter is an answer, not a hint.
- **A wrong draft is not wiped.** Synthesis Quest used to clear the textarea on
  a wrong attempt, forcing a restart from a blank page. Revising your own draft
  is the skill that mode teaches.
- **One-off slips are not habits.** The parent report stays silent until
  something recurs.

## Not covered

- **Writing Quest** has its own evaluator (`writingEvaluator.js`) with a
  different shape — rubric bands over long text, not an answer against a key.
  It has not been folded in.
- The **Practice Library** modules (Visual Text, Open-ended Comprehension,
  Situational Writing) are answerable via `modes/openResponse.js`, but they are
  not auto-marked: their banks carry `{ q, model }` with no marking key, so the
  child commits an answer, sees the model plus an idea checklist
  (`scoring/ideaOverlap.js`), and self-marks. A self-mark records at the
  `guided` evidence ceiling and never supports a mastery claim.
- Detection is **string- and morphology-based**. It cannot know that "advice"
  is uncountable, so items turning on word knowledge fall back to the authored
  explanation. That is the correct outcome, not a gap to paper over with a
  guess.
