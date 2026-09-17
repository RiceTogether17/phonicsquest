# PhonicsQuest — Validity & Coherence Roadmap

> **Status (2026-07-30):** Priority 0 is **done** — see the commits on
> `claude/phonicsquest-repo-audit-s6hh8q`. Priorities 1–3 below are open, with
> the file:line evidence that motivates each item. Companion to
> `IMPROVEMENTS.md` (engineering debt) and `CONTENT_QA.md` (content checks);
> this document is specifically about **whether the app's claims are true**.

## Context

An instructional-design review concluded that PhonicsQuest's central weakness is
no longer missing features but **measurement validity**. The app could not
distinguish what it _taught_ from what the child could _independently
demonstrate_, and several surfaces reported more confidence than the underlying
data supported.

The governing principle for everything below:

> PhonicsQuest must distinguish between what the app taught, what the child
> practised with support, and what the child can independently demonstrate.

Once that distinction holds, adaptive selection, progression gates, parent
reports, placement recommendations and teacher decisions all become
substantially more trustworthy. Until it does, adding content makes the problem
larger, not smaller.

---

## Priority 0 — Trust the mastery data ✅ DONE

| #   | Item                                                         | Where it landed                                                                                         |
| --- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| 1   | Separate exposure / guided / independent / verified evidence | `src/modules/evidence.js`, `src/modes/index.js` (`evidenceCeiling`)                                     |
| 2   | Stop modelled and self-reported answers granting mastery     | `src/modules/store.js`, `src/modes/blendConfirm.js`                                                     |
| 3   | Fix the no-data "Exam-ready" report                          | `src/modules/parentReportCard.js`                                                                       |
| 4   | Build real independent decoding checks                       | `src/modes/blendConfirm.js`, `src/components/adultVerdict.js`, Gate B in `src/modules/placementTest.js` |
| 5   | Add confidence and sample size to every mastery score        | `src/modules/masteryEngine.js`, `src/modules/remediationRouter.js`                                      |

**What each fixed, for the record:**

- **No provenance existed.** Every attempt stored only `correct: boolean`.
  `_hintUsed` / `_wrongStrikes` were live in `app.js` at the moment of
  recording but never persisted, and `src/modes/hintUsage.js` was a 3-line
  orphan with no caller (now deleted).
- **Self-report granted full credit.** One tap of "Yes! ✓" in Blend It! wrote
  decoding accuracy, unique-word count, a session-day event, a **Leitner box
  promotion** and a group-mastery bump. With autoplay on, the assess prompt was
  reachable with zero child input. The channel was also asymmetric: the first
  "Not yet" recorded nothing, the first "Yes" recorded immediately.
- **The gate failed open.** Four of five criteria returned `pass: true` on
  missing data; only decoding failed closed.
- **Gate B did not test decoding.** Every item read `prompt: 'Tap: cat'` and
  the renderer printed the prompt verbatim above the options — a non-reader
  could pass by matching the prompt string to a button.
- **No data reported as "Exam-ready."** `bandForPct(null)` returned `'green'`,
  so a profile with zero recorded practice produced a shareable WhatsApp
  message telling a parent their child was exam-ready.

**Migration policy:** existing progress is grandfathered as `guided`. It still
counts as practice and keeps every unlocked stage unlocked, but does not
satisfy the new independent-evidence requirement. Backfill is lazy, on first
touch (`ensureEvidenceBuckets`), matching the existing `seedFromLegacy`
pattern — there is no bulk rewrite and no data loss.

---

## Priority 1 — Unify the phonics system

### 1.1 One authoritative grapheme-code sequence

There are currently **seven parallel sequences** with no single source of truth:
curriculum phases (`src/data/curriculum.js:138`), curriculum stages
(`:319`, 43 of them), story code tiers (`src/modules/decodability.js:63`),
story bands A–D (`src/data/stories.js:32`), placement gates and stages
(`src/modules/placementTest.js:35`, `:69`), journey steps
(`src/data/journeyStages.js:26`) and reading bands
(`src/modules/readingStages.js:5`).

Two of them actively contradict each other:

- **Digraphs.** The curriculum places them at phase 4
  (`src/data/curriculum.js:185`); `decodability.js:20-23` deliberately releases
  them in tier 1 and says so. Band A stories therefore legally use `then`,
  `chat` and `quick` before the child reaches phase 4.
- **Diphthongs and r-controlled are inverted.** Curriculum: phase 7 =
  Diphthongs, phase 8 = Advanced/Bossy-R (`curriculum.js:229`, `:244`).
  `decodability.js:73-76` maps r-controlled → `curriculumPhase: 7` and
  diphthongs → `curriculumPhase: 8` — the opposite. `storyGating.js:41-47`
  compounds it, gating Band C on phases 4/8 and Band D on phase 7, so an
  earlier phase gates a later band.

**Proposed shape** — one machine-readable codebook that every other system
derives from, so a word's availability is computed, never declared twice:

```
requiresCodeUnits: [1, 2, 3]
containsTrickyParts: [...]
```

### 1.2 Two unlock engines still coexist

Legacy accuracy-only (`curriculum.js:1038`, `:1075`) and the strict gate
(`progression.js:261`, `:291`) are both exported and both reachable. Retire the
legacy pair.

### 1.3 Reclassify the sight-word bank

95 quests, 474 word slots, 470 unique (`src/data/sightwords.js`). Entries are
**bare strings** inside quest arrays — no per-word metadata at all. Many early
words (`day`, `white`, `name`, `story`, `many`) are not permanently irregular;
they become decodable once the relevant code is taught.

**Reuse what already exists.** `src/data/trickyWords.js:24-45` already
implements exactly the model needed — `decodable-soon` / `partial` /
`fully-irregular`, with `regular[]` / `tricky[]` grapheme splits and a
teacher-facing `note`. It covers ~3–5 words per phase. The work is extending
that schema across the bank, not designing a new one.

Note also `src/data/hfw.js:23-42` (band gating) and
`src/data/words.js:551` (`deriveFlags` → `'irregular'`) as third and fourth
partial classifications of the same question.

### 1.4 Split stories into independent vs adult-supported — ✅ DONE

> **Correction first, because the item below overstates the problem.**
> `decodableRatio` counts only words a child can sound out **from the code
> alone**. It is not a readability score. Every other word is legal by a
> taught route — HFW tier, tricky word, pre-taught sight word — and
> `storyDecodability.test.js` R3 ("the core promise") already proves there
> are **zero** stretch words in the bank. Across all 6213 tokens: 95.6%
> decodable, 1.5% proper nouns, and 2.8% HFW/tricky/sight. The low per-story
> numbers (0.58 on the first short-a minis) are `the`, `a` and `and`
> dominating a 42-word text, which is unavoidable in any first reader. So
> "aim for ≥95%" below is measuring the wrong thing, and the floors were
> not changed.
>
> What was genuinely missing is the second half of the item — showing the
> pre-teach words — and the labels.
>
> **Pre-teach words** (`supportWords` in `decodability.js`). The reader did
> print a list, but it came from `getSightWordsInStory` — the sight-word
> quest weave, capped at six. That is a different set, and the gap was not
> academic: it omitted **110 needed words across 37 of 69 stories** while
> spending slots on decodable words like "back" and "plan". `Giri's Nap`
> showed six and needed ten. The panel now lists exactly the words that are
> legal by a non-decoding route, in story order, each tappable to hear,
> excluding proper nouns and onomatopoeia (Giri is on the cover; "Snap!" is
> the plot). The pronoun `I` prints as a capital — the classifier
> lowercases every token, and a panel teaching sight recognition must not
> show the wrong shape.
>
> **Two labels** (`storySupportLevel`). The 11 `extension-sg` and
> `chapter-reader` stories are teacher-supported formats: `FORMAT_RULES`
> lifts their HFW cap to tier 3 and `STORY_PHASES` grants them the full code
> regardless of the band they are shelved in. Both facts lived only in code
> comments while the stories sat beside tightly-controlled readers looking
> identical. They now carry "🧑‍🏫 Read with a grown-up"; the other 58 carry
> "🙋 Read by myself", and library cards show the pre-teach count.
>
> Worth recording: measured against their _own band's_ phase, those 11 run
> only 0–3 words beyond it. They are adult-supported for their language and
> multi-sitting structure, not their code load — which is why the rule keys
> off the format rather than a decodability threshold.
>
> **The allowance escape, closed.** `classifyWord` clears `PROPER_NOUNS`
> and `ONOMATOPOEIA` _before_ it checks the tier, so a word in either set
> was legal however hard it was to decode, with nothing bounding it. The
> exposure was never large — the heaviest story leans on **one** such word,
> and only `giri` and `neighbour` are ever above their story's tier — so
> `allowanceWords()` plus R12 exist to keep it that way, not to repair
> anything:
>
> - `MAX_ALLOWANCE_WORDS` (3) caps how many a story may lean on.
> - The over-tier set is pinned to exactly `{giri, neighbour}`, so a new
>   hard name is a deliberate, reviewed act rather than a silent one.
> - **An unused whitelist entry must require tier ≤ 2.** This is the rule
>   that actually closes the escape: an unused entry is a standing
>   permission slip, harmless today but legal with no further review the
>   moment a story reaches for it. A hard word can no longer be parked in
>   the list ahead of time — it has to arrive with the story that needs it,
>   where the over-tier pin will see it. Both guards were verified to fail
>   on an injected regression, not just to pass.
>
> A name above the story's tier is now pre-taught like any other word
> (`neighbour` appears in that Band C reader's panel). The mascot is the one
> exception, and a named one: `MASCOT_NAME` is in the story title directly
> above the panel, so listing it teaches nothing.

_Original item:_

Band A is labelled "Core Decodable Minis", but the first ten stories declare
decodable ratios of 0.86–0.93 (`src/data/stories.js:89-309`) against a test
floor of 0.84 (`src/__tests__/storyDecodability.test.js:32`). For a text a
child is told they can read _by themselves_, aim for ≥95%.

Two labels, not one: **Read by myself** (tightly controlled) and **Read with a
grown-up** (richer language, culture-specific vocabulary). Also show pre-taught
words _before_ the story rather than only inside the validator.

`decodability.js:37-43` already documents a related limitation: the check is
graphemic, not phonemic, so `was` parses w-a-s and counts as decodable.

### 1.5 Audit phoneme audio for schwa intrusion

Not yet verified in this pass. `tests/shortVowelPurity.test.js` and
`tests/articulatedSpeech.test.js` are the existing hooks.

### 1.6 Build a true Listen and Spell mode ✅ DONE

`src/modes/listenAndSpellMode.js` is the mode: the word is spoken and never
printed, the child is asked for a sound count, a controlled grapheme bank is
tapped into a build strip, and the canonical scorer coaches once before
revealing. `phonicsModes.js` now points `impl` at it instead of at
`classicBlend`, and both registries call it "Listen & Spell".

**Why this mattered beyond the missing mode.** `progression.js` criterion 2
requires spelling accuracy ≥ 80%, but the only spelling-binned modes were
Missing Sound and Word Sort — both _selection_ tasks. With no mode that asked
a child to produce a spelling, the criterion passed essentially every profile
as `insufficient-spelling-data`, so the strictest check in the gate was
measuring nothing. `SKILL_BY_MODE.listenAndSpell = 'spelling'`
(`src/modules/progress.js`) is what closes that loop.

**Plausible vs impossible errors** (`scoring/listenAndSpell.js`). "caik" and
"cadk" are both wrong, and a percentage calls them equal. The scorer does
not: `plausible-spelling` means every sound was spelled with a grapheme that
really spells that sound, so the segmenting was right and only the
orthographic choice was wrong — a different lesson from a broken
segmentation. Substitutions are resolved through the _sound_, not through a
flat list of interchangeable letters, because `c` spells /k/ in `cat` and /s/
in `race`; a flat list would call "sat" a plausible spelling of "cat". The
words.js `types` tag disambiguates, which is also what keeps `y` from being
offered vowel spellings in `yam`.

**Counting where tiles and sounds part company.** `soundsPerTile` keeps a
per-tile phoneme count rather than a one-tile-per-sound yes/no, so the cases
where the two differ are taught instead of skipped: a silent e makes no
sound, `x` makes two in one letter, `-ing` makes two as one spelling unit.
The child is told the true sound count and then that one part of the word
carries two of them — never _which_ part, which would spell a piece of the
word for them. This took the counting step from 972 to 1095 of the 1117-word
bank, recovering every morphology group (phases 9–10) and the x-words. Where
the per-grapheme table and `derivePhonemes` genuinely disagree (`-ed` shifts
with the sound before it) the step is dropped rather than guessed at — 22
words.

**Routing.** Being a mode is not the same as being reachable. Every step of
every `getDailyPlan` band used to be reading, so the day never asked a child
to produce a spelling. Spelling now alternates into the existing FIRST step
on the same weak group — read it today, spell it tomorrow — rather than being
appended as a fourth step, because a K1/K2 session should be getting shorter
(see 2.4). Pre-readers are untouched: no letters learned, nothing to spell.
`navigationRouter` grew a `STAGE_SCOPED_TARGETS` set for this: the generic
bare-mode-key path calls `startGame(undefined)` and drops the group, so a
plan promising "Listen & Spell – Short A" would have served an unrelated
word. `PHASES.recommendedModes` lists the mode for phases 1–10, which is what
filters its stage picker.

**The same gap in three older modes, closed.** `wordSort`, `readAndTap` and
`fluencySprint` were in no phase's `recommendedModes` either, so
`getStagesForMode` fell back to the full curriculum and each opened a picker
offering every stage from CVC to multisyllable. That fallback is a deliberate
kindness — a new mode never renders an empty picker — but it is silent, and
it is never right for a mode that actually has a picker. Word Sort now covers
phases 1–8 (its second bin is a sibling stage, and phases 9–10 study the
morpheme, not the sound pattern, so a sort there has no principled contrast);
Read & Tap and Fluency Sprint cover 1–10.

`PICKER_MODES` moved out of `app.js` into `phonicsProgression.js`, beside the
function that filters the picker, because the two only make sense together —
and `tests/phonicsProgression.test.js` now fails if a mode is added to one
without the other. Fluency Sprint and Listen & Spell were added to it: both
are stage-scoped in every other respect, but both used to start on whatever
group was last touched, with no stage progression and no mastery bar.

---

## Priority 2 — Clarify the product structure

### 2.1 Separate the three domains

The README positions the app as a K1–P6 literacy and exam platform, while
`UX_SPEC.md:14` still defines the primary user as _"child, age 5–8, often
reading without an adult."_ Those are different products sharing one shell:
Early Reading Quest, Primary English Quest, and the Exam Practice Hub. They
need different UI density, reporting language and accessibility defaults.

### 2.2 Reduce preschool choice overload

A K1 child should see today's activity, "hear it again", pause, and one reward
— everything else behind the grown-up area. Child-facing copy should avoid
CVC / CCVC / digraph / diphthong / morphology in favour of "Three-Sound Words",
"Two Letters, One Sound". Keep the technical terms in teacher reports.

### 2.3 Don't show the picture before decoding

`src/modes/blend.js:5` — "Show word image + tip prompt" is step 1, which
invites picture-guessing ("I see a cat, so the word is cat"). Reveal the image
_after_ the blend attempt, as confirmation.

### 2.4 Preschool session cap

The daily lesson composer's warm-up → teach → practice → review shape is right,
but K1/K2 plans should be genuinely shorter (~5–7 minutes), not the same plan
with fewer items.

### 2.5 Reserve "PSLE format" for verified P6 papers

The practice-test engine uses one hard-coded Paper 2 timing guide across all
levels. The 2026 Paper 2 is 1h50m with 25 MCQs and 50 open-ended questions;
P1–P5 papers should be described as school-style or syllabus-aligned practice
and carry their own paper specification per level and term.

### 2.6 Add Listening Comprehension and Oral Communication

Papers 3 and 4 (10% and 20% of PSLE English) have no coverage. Existing
phoneme-audio and story-recording infrastructure is reusable.

### 2.7 Rename static libraries

Visual Text, Open-ended Comprehension, Synthesis and Situational Writing
largely render content with model answers in expandable sections. Until they
close the loop (teach → guided example → student response → hint → scoring →
error explanation → transfer question → recorded evidence), call them
**Practice Library**.

### 2.8 Improve open-ended marking validity

Short answers are marked by normalised string equality, and some longer
comprehension responses are self-scored against a model answer. Store required
idea units, acceptable pronoun references, semantic alternatives, mark
allocation and a teacher-review flag instead.

### 2.9 Record test-mode provenance

`isTestMode` exists only as a local in `src/modes/primaryPracticeTest.js:843`
and never reaches `questAttempts`, so the parent report cannot say whether a
score came from practice or a timed test. Priority 0 added attempts,
last-practised and confidence to every reported skill; this is the one piece of
that list still missing.

---

## Priority 3 — Prepare for classroom adoption

### 3.1 Consolidate the two spaced-repetition engines

- **Leitner** over `wordStats` — `src/modules/reviewScheduler.js`, 6-box
  ladder, epoch-ms due dates. Written only by `store.recordWordAttempt`.
- **SM-2** over `srsSchedule` — `src/modules/srsScheduler.js`, ease factors,
  UTC date strings. Sole caller is Word Vault
  (`src/modes/wordVault.js:1543-1553`) — and it is driven by a **"✓ My
  sentence is similar"** button on free text that is never inspected. That is
  the same self-report problem Priority 0 fixed for blending, still live here.

No shared code, no shared state, no reconciliation. One review service with
configurable item types (`phonics-word`, `sight-word`, `grammar-skill`,
`vocabulary-item`, `writing-error`).

### 3.2 `MIN_SESSION_DAYS` silently vanishes in private browsing

`learningEvents` is the only IndexedDB-offloaded key
(`src/modules/store.js:19`) and is explicitly not persisted when IndexedDB is
unavailable (`:452-462`). The anti-binge check then has nothing to read.
Priority 0 marks that state `provisional` so it no longer reports as a clean
pass, but the underlying gap remains.

### 3.3 Placement covers only phases 1–6

`src/modules/placementTest.js:35-46` — phases 7–10 are unreachable from the
screener.

Beyond coverage, Gate B is now honest but still narrow: it measures
auditory-to-print matching. Genuine independent decoding needs grapheme recall,
cold word reading, pseudoword decoding, phoneme segmentation, encoding, and
connected reading. The code already describes the instrument as a routing
screener rather than a phonics diagnostic — parent-facing language should say
so too.

### 3.4 AI governance

The app reads a parent-supplied Gemini key from local storage and calls the
model directly from the browser, with student writing in the request. Before
wider school use: explicit parental consent, a clear third-party notice,
automatic removal of names, a provider-neutral adapter, timeouts and
deterministic local fallback, "AI formative feedback" labelling rather than
examiner claims, and a school setting that disables external AI entirely.
Keeping the local evaluator as the source of truth is a good existing
safeguard.

### 3.5 Teacher workflows and optional sync

Assignments, deadlines, hint-locking in Test Mode, item analysis, first-vs-
corrected attempt comparison, teacher comments, score override, MOE-style
progress export, grouping by misconception, printable targeted worksheets.
Local-first must remain the default for home users; cloud login should be a
school/centre feature, never compulsory.

### 3.6 Add explicit MOE Learning Outcome mapping

Per-item metadata (`level`, `component`, `learningOutcome`, `skill`,
`difficulty`, `marks`, `reviewedBy`, `syllabusVersion`) to make
syllabus-alignment claims auditable.

### 3.7 Type coverage

`tsconfig.json` keeps `checkJs: false` globally; files opt in with
`// @ts-check`. Next priority files: store and profile migration, curriculum
and content schemas, placement result objects, assessment events, paper
question models, reporting calculations. `package.json` allows
`--max-warnings 158`; ratchet it down.

---

## Known failing check — resolved

`npm run check:bundle` used to fail at ~744 kB against a 700 kB budget. It
passes now (665 kB), by the route this section prescribed: data banks split
into lazy chunks rather than the budget raised. Noted here because the entry
outlived the problem.

---

## Counting notes

Two hard-coded totals were wrong and are fixed
(`src/data/journeyStages.js`): sight-word progress used 35 against 95 real
quests, and story progress used 16 against 69 real stories, so both bars read
100% complete at roughly a third done. If either bank grows again, the totals
now derive from the data and will follow.
