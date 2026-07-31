# PhonicsQuest — UI/UX & Game-Design Audit: findings and open decisions

> **Status (2026-07-30):** the verified defects below are **fixed** on
> `claude/phonicsquest-repo-audit-s6hh8q`. Everything under "Open product
> decisions" is deliberately **not** actioned — those are calls for the
> product owner, not defects. Companion to `VALIDITY_ROADMAP.md`
> (measurement validity), `IMPROVEMENTS.md` (engineering debt) and
> `CONTENT_QA.md` (content checks).

## Scope note

The source audit was **truncated mid-sentence** during Spell-It, so its
sections on Giri Stories and on the Primary English / Exam Practice Hub
modules were never received, despite the preamble promising them. Anything
about those areas below comes from reading the code, not from the audit.

## The audit's central claim

> PhonicsQuest currently has many different educational modes, but too few
> truly different play patterns.

That is a fair reading of the code. Eleven early-reading modes share
`createChoiceRound` (`src/modes/choiceRound.js`) and the same physical
action — hear or read a prompt, tap one of four, see a tick, press Next. The
shared controller is genuinely good (calm first-error retry, answer revealed
on the second, only first-attempt performance recorded), and consolidating on
it was the right engineering call. The consequence is that content and
distractors vary while the _play_ does not.

---

## Verified defects — fixed

### 1. Hearing a word counted as practising it

`src/modes/sightLearn.js` labelled both states "Practiced", and
`_listenToAll` added **every** word to that set in a single pass, which also
satisfied `_maybeUnlockRecall`. One press of "Listen to all" filled the
progress counter and unlocked Quick Recall with no child input at all.

Now counted and labelled separately: **Met** (heard — muted ♪ badge) versus
**Remembered** (recalled unaided from four choices — the earned ✓). Quick
Recall still unlocks once every word is met, since meeting them is the
prerequisite for trying to recall them; what changed is that meeting them no
longer _is_ recalling them. Covered by
`src/__tests__/sightLearnEvidence.test.js`.

### 2. Fluency Sprint's tile described an activity it does not contain

The tile read _"Read fast — beat the clock!"_ while the activity speaks a
word and asks the child to tap its printed match. It described neither the
action nor a goal worth setting an early reader, and it reintroduced the
speed framing already removed from the in-game instruction. Now
_"Hear it, spot it — keep up the pace!"_

### 3. Two modes rated themselves as evidence of independent decoding

This was a mistake in the evidence model added earlier on this branch, and
the audit's observation about name-versus-mechanic surfaced it. Hear & Choose
was correctly capped at `guided` because it speaks the target before showing
print — but **Fluency Sprint** and **Read & Tap** do exactly the same thing
and were left at `independent`. `readAndTapMode.js:108` reads the whole
sentence aloud _and then_ speaks the target, and the mode's own instruction
is "Tap the word you hear".

Both are now `guided`, so neither can support a decoding-mastery claim.
`src/__tests__/evidence.test.js` reads the real instruction strings and fails
any mode that tells the child to tap what they heard while rating itself
independent.

---

## Verified observations — not defects, no change made

These check out against the source but are working as designed. Listed so
they are not re-discovered as bugs:

- **`ADVANCE_MS = 700`** (`src/modes/wordSortMode.js:29`) — the audit is
  right that 700 ms is short for inspecting a _wrong_ answer. Changing it is
  a feel decision, not a correctness one.
- **Segment It auto-submits** on an exact match (`src/modes/segment.js:104`)
  while a Check button also exists. Two paths to the same outcome; the audit
  prefers one. Deliberate as written.
- **Clap the Syllables** takes the response twice — tap the beats, then pick
  the number from a choice grid (`src/modes/syllableClap.js:54-61`). The clap
  count is currently not the answer. Scoring the taps directly would be a
  mechanic change.
- **Letter Sounds defaults to "All Sounds"** (`src/modes/letterSounds.js:105`)
  rather than the child's current stage.
- **Count the Words** frames are generated from templates like
  `'My word is {w}.'` and `'I can say {w}.'`
  (`src/modes/wordCountMode.js:38-39`) — reliable to generate, thin as
  language.

---

## Open product decisions — deliberately not actioned

Each of these is a reasonable idea and a real judgement call. They change
what the product _is_, so they need an owner's decision rather than an
implementer's.

### Consolidating 19 modes into ~9 child-facing worlds

The audit proposes Blend Lab, Sound Detective, Sound Drums, Sound Train,
Rhythm Room, Letter Hunt, Sound Workshop, Sorting Station and Reading Trail,
keeping the 19 subskills for reporting and teacher selection.

Worth noting in favour: the underlying data model already supports it —
`subskill` tags, per-skill `wordSkillStats` bins and the `MODES` registry are
all independent of how the menu is grouped. This is a presentation change,
not a data migration. It is also the single largest item in the audit.

### Renaming modes to match their mechanics

Fluency Sprint → "Rapid Word Match", Listen & Blend → "Blend Board — Free
Practice", Hear & Choose → "Quick Word Check". I fixed Fluency Sprint's
_description_ because it was factually wrong about the action; renaming the
modes themselves is a product decision, and mode keys appear in saved
progress (`questMastery`, `wordSkillStats`, `modeDifficulty`), so a rename
needs a display-name layer rather than a key change.

### Reward-frequency hierarchy

The proposed ladder (soft tick → Giri reaction → round completion → map
progress → badge → story reward → rare full celebration) is a coherent
design. Implementing it touches `gamification.js`, `badges.js`,
`confettiHelper.js` and every mode's success path.

### Splitting child controls from teacher controls

Listen & Blend carries category, speed, blend-style, playback and
self-assessment controls on one screen. The audit's read — that this is a
strong teacher tool wearing a child-game costume — matches the code. A
collapsible teacher drawer or PIN gate is the suggested fix; the parent-PIN
module (`src/modules/parentPin.js`) already exists to gate it.

### Reducing simultaneous UI layers on Primary English screens

Grammar MCQ can show round badge, streak, progress, progress bar, category,
difficulty, guided tip, task instruction, question, clue chips, choices, rule
hint and feedback at once. The proposed budget — one context label, one
progress indicator, one instruction, one play area, one primary action, ≤2
secondary — is sound but touches every Primary English mode.

### Per-mode mechanic redesigns

Train Carriages (visible carriage targets, station progression), Missing
Sound (drag the grapheme into the gap), Word Sort (drag-and-drop, three-bin
rounds), Segment It (bracket/swipe grouping, hidden-count boxes), Sound Hunt
(a real scene to hunt in), Count the Words (character dialogue and stepping
stones), Odd One Out (per-card replay plus a "what do the others share?"
step), Blend It! (my-turn / together / new-challenge loop), Read & Tap
(silent-reading level, continuous sentence rendering).

Two of these interact with work already on this branch:

- **Blend It!'s "my turn first"** is partly addressed. The confirmation round
  added for Priority 0 already moves the child from claiming to demonstrating
  — but it lands _after_ the model, not before it.
- **Read & Tap's silent-reading level** would raise its evidence ceiling back
  to `independent` for that level specifically, since the target would no
  longer be spoken. That is the clean way to make the mode mean what its name
  says.

### Sight Word Match transfer

Matching `said` to `said` tests card-location memory and visual identity.
Proposed better pairs: audio ↔ printed word, tricky part ↔ whole word, word ↔
sentence, lowercase ↔ uppercase. Note this interacts with
`VALIDITY_ROADMAP.md` §1.3 — pair types like "tricky part ↔ whole word"
require the per-word classification that bank does not yet have.

### Blend It! shows the picture before decoding

Already recorded in `VALIDITY_ROADMAP.md` §2.3 from the first audit
(`src/modes/blend.js:5`). Both audits independently flagged it.
