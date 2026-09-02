# PhonicsQuest — Content Quality Checks

> Automated guards that protect the curriculum, content, scoring, and
> accessibility of PhonicsQuest. Each check below is an existing or new
> test in the Vitest suite. If a check ever fails on `main`, that's the
> bug — not the test.

Run all checks with `npm test`. Specific files:

```
src/__tests__/curriculumSchema.test.js     ← shape of curriculum.js
src/__tests__/phonicsModes.test.js         ← mode registry + scoring
src/__tests__/contentQa.test.js            ← content-level QA (new)
src/__tests__/progressAnalytics.test.js    ← progress model
```

---

## 1. Curriculum completeness

**What we guarantee.** Every PHASES entry and every CURRICULUM stage
ships the full set of required fields, with non-empty values:

- `id`, `phase`, `name`, `group`
- `learningOutcome` (1+ sentence)
- `targetSounds` (≥ 1)
- `sampleWords` (≥ 4)
- `sentenceExamples` (≥ 1)
- `recommendedModes` (≥ 1, all keys must exist in `MODES`)
- `masteryCriteria` (`{ accuracy, minAttempts }`)

**Where:** `curriculumSchema.test.js`. The required-field list lives in
`REQUIRED_PHASE_FIELDS` / `REQUIRED_STAGE_FIELDS` in `curriculum.js` so
the test and the data have a shared source of truth.

**Why it matters.** Adaptive routing, dashboards, and the lesson-intro
screen all assume those fields exist. Silent `undefined` here means the
child sees an empty card or — worse — gets routed to a stage with no
sample words.

---

## 2. No duplicate sample words within the same phase

**What we guarantee.** Inside a single phase, no word appears in more
than one stage's `sampleWords` array. (Across phases, words may repeat
— "cat" is fair to revisit in later fluency reviews.)

**Where:** `contentQa.test.js`.

**Why it matters.** If "cat" shows up under both `cvc-a` and `cvc-e`
samples, the child will see the same word framed under conflicting
sounds — confusing and wrong.

---

## 3. Sample words match the declared phonics pattern

**What we guarantee.** Every `sampleWords` entry matches the broad
pattern its stage advertises:

| Stage prefix                    | Test                                                             |
| ------------------------------- | ---------------------------------------------------------------- |
| `cvc-X`                         | 3 letters · vowel matches X · no blend/digraph at the boundaries |
| `ccvc-X`                        | Starts with 2 consonants · vowel matches X                       |
| `cvcc-X`                        | Ends with 2 consonants · vowel matches X                         |
| `digraphs`                      | Contains one of sh / ch / th / wh / ck / ng                      |
| `long-a-ae`                     | Has the `a_e` split-digraph pattern                              |
| `long-a-ai`                     | Contains `ai`                                                    |
| `dip-oi`                        | Contains `oi` or `oy`                                            |
| (… similar checks for the rest) |

The rules are conservative — they don't claim phonological perfection,
they catch the obvious mistakes (e.g. a long-vowel word smuggled into a
short-vowel sample list).

**Where:** `contentQa.test.js` (`describe('sample words match stage
pattern')`).

**Why it matters.** A misclassified sample word becomes a misclassified
hint becomes a child who thinks "feet" is a short-E word.

---

## 4. Every game mode has child-friendly instructions

**What we guarantee.** Every entry in `PHONICS_MODES` ships:

- `instruction` ≤ 15 words.
- `objective` ≥ 1 sentence (parent-facing).
- Both `keyboard` and `touch` flags = true.

**Where:** `phonicsModes.test.js`.

**Why it matters.** "Tap the picture that starts with the same sound"
is a child-friendly instruction. "Identify the initial phoneme of the
depicted lexical item" is not — and was a real example that crept into
an earlier branch.

---

## 5. Every activity has correct and incorrect feedback

**What we guarantee.** Every mode in `PHONICS_MODES` ships:

- A `score` function that returns `{ correct, errorCategory, hint, ... }`.
- An `errorHints` map with a non-empty `default` key.
- At least 2 error categories beyond `default` so feedback can be
  specific (no "Oops, try again." monoculture).

**Where:** `phonicsModes.test.js` + `contentQa.test.js`.

**Why it matters.** Generic feedback wastes practice time. Error-
specific feedback ("Two letters make one sound here — try sh-, not s-")
is the whole point of phonics-aware tutoring.

---

## 6. Scoring logic — golden cases

**What we guarantee.** For every mode, golden tests cover:

- A correct attempt → `correct: true`, `masteryDelta: 1`.
- Each defined error category → returns that category + matching hint.
- A clean "no answer" attempt → returns the default hint, no crash.

**Where:** `phonicsModes.test.js` (per-mode `describe` blocks).

**Why it matters.** If scoring drifts, mastery drifts. Drift caught by
tests, not by parents reading a wrong report.

---

## 7. Progress tracking

**What we guarantee.** The progress model in `progressAnalytics.js`:

- Computes `accuracyByMode` correctly from a stream of attempts.
- Identifies the top N strongest and weakest sounds.
- Surfaces the recommended next practice (first stage below mastery).
- Tracks `attemptsOverTime` bucketed by day.
- Aggregates error categories into a `commonErrorTypes` map.
- Computes a per-phase `mastery %`.

Each of those is a separate test case so a regression names itself in
the failure message.

**Where:** `progressAnalytics.test.js`.

**Why it matters.** Parents and teachers act on these numbers. Wrong
numbers = wrong intervention.

---

## 8. Accessibility labels for key controls

**What we guarantee.** Critical UI controls render with the right
ARIA attributes:

- `aria-label` present on every icon-only button.
- `role="img"` + alt-style text on every badge.
- `aria-live="polite"` on every feedback strip.
- `aria-pressed` on every toggle / mode-pick chip.
- Quest-map nodes carry stage status in their accessible name.

**Where:** `contentQa.test.js` (`describe('accessibility labels')`)
plus the existing `keyboardManager.test.js` for keyboard wiring.

**Why it matters.** A child using a screen reader or switch control
deserves the same lesson. Drift here is silent — the child just falls
off — so the test is the only safety net.

---

## How a contributor uses this file

1. **Adding a curriculum stage?** Run `npm test`. The schema, content,
   and pattern checks all run automatically.
2. **Adding a mode?** Add the entry to `PHONICS_MODES`; the registry
   test will flag missing fields and overly-long instructions.
3. **Fixing a content bug?** Add a regression test in `contentQa.test.js`
   first, then fix the data.
4. **Touching accessibility?** Run the targeted file:
   `npx vitest run --reporter=default src/__tests__/contentQa.test.js`.

If a check feels wrong, that's a conversation worth having — but
weaken it in the PR, with a note here saying why. Don't silently skip.
