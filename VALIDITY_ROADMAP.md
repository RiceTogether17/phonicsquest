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

### 1.4 Split stories into independent vs adult-supported

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

### 1.6 Build a true Listen and Spell mode

`src/modes/phonicsModes.js:181` maps `listenAndSpell` to `classicBlend` as
"the closest existing UI". The two skills are opposites — Classic Blend is
print → sound → word; Listen and Spell is spoken word → phonemes → graphemes.
The two registries also disagree on that implementation's display name
(`modes/index.js:66-77` calls it "Listen & Blend").

A real mode should play the word without showing it, ask for a sound count,
offer a controlled grapheme bank, let the child build the spelling, and
distinguish phonologically plausible errors from impossible ones.

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

## Known failing check

`npm run check:bundle` fails: the main chunk is ~744 kB against a 700 kB
budget. **This predates the Priority 0 work** — `main` measures 740.8 kB. Per
`scripts/check-bundle-size.mjs`, the fix is to split a data bank into a lazy
chunk (see `src/modes/lazy.js`) rather than raise the budget.

---

## Counting notes

Two hard-coded totals were wrong and are fixed
(`src/data/journeyStages.js`): sight-word progress used 35 against 95 real
quests, and story progress used 16 against 69 real stories, so both bars read
100% complete at roughly a third done. If either bank grows again, the totals
now derive from the data and will follow.
