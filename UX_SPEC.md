# PhonicsQuest — UX Specification

> The plan for the quest-based learner journey. Codified BEFORE we ship UI
> so every screen has a single owner question: _what does the child do
> here, and how do they know?_

This spec is the source of truth for the eight required screens. When in
doubt — instructions, layout, button hierarchy — defer to this document.

---

## 1. Audience & guiding principles

**Primary user:** child, age 5–8, often reading without an adult.
**Secondary users:** parent (home), teacher (classroom, tablet trolley).

**Design tenets (non-negotiable):**

1. **One main action per screen.** Every screen has exactly one primary
   button or tappable region. Other actions sit in a secondary tray.
2. **Read-aloud first.** Every instruction has an audio version. Text is a
   support, not a gate.
3. **Mistakes are safe.** No red flash, no buzzer, no streak penalty for
   one wrong tap. Wrong = a calm hint and another try.
4. **Progress is visible.** Stars / dots / phase bar on every screen so a
   child can see "I'm getting closer."
5. **Reward learning, not speed.** Mastery is accuracy + repeated practice,
   not first-try speed. Speed bonuses exist but never penalise slow.
6. **Tablet-first, laptop-fine.** Touch targets ≥ 48 × 48 px, layout works
   1024 × 768 → 1440 × 900. Keyboard navigation supported everywhere.
7. **Instructions ≤ 15 words.** Plain English. Verbs the child knows.

**Out of scope (this iteration):** voice recording, multi-language, parent
accounts/backend. Those have their own future specs.

---

## 2. Screen inventory

The eight screens, in journey order. Each entry is a small spec card:
purpose · child-facing words · main action · layout sketch · states.

### 2.1 Welcome screen

- **Purpose:** orient and start a session. No login.
- **One main action:** big "Start" button.
- **Child copy:** "Hi! Ready for today's quest?"
- **Layout (mobile-up):**

  ```
  ┌──────────────────────────────────────┐
  │            🐉  PhonicsQuest          │
  │                                      │
  │   "Hi! Ready for today's quest?"     │
  │                                      │
  │           [   START   ]              │
  │                                      │
  │  Pick a player ›    Grown-ups ›      │
  └──────────────────────────────────────┘
  ```

- **States:** `idle`, `pressed`, `loading` (audio asset warm-up).
- **A11y:** mascot is decorative (aria-hidden); title is `<h1>`; start
  button has `aria-label="Start today's quest"`.

### 2.2 Child profile selection

- **Purpose:** pick which child is playing (so progress is correct).
- **One main action:** tap a profile card.
- **Child copy:** "Who's playing?"
- **Layout:** grid of profile cards (avatar + first name). One "+ Add
  player" card. Tablet shows 4 columns, laptop 5, mobile 2.
- **States:** `empty` (no profiles → big "+ Add player"), `default`,
  `editing` (long-press / pencil icon shows rename/avatar/delete).
- **A11y:** each card is a `<button>` with full name, level and
  last-played date in an aria-label.

### 2.3 Quest map by phonics phase

- **Purpose:** show the journey, mark the current stop.
- **One main action:** the "You are here" node pulses; tapping it starts
  the next lesson.
- **Child copy:** "Your quest map" · "You are here ↓"
- **Layout:** vertical scrolling path. Each phase is a chapter with its
  own colour. Nodes (one per stage) sit on a meandering trail. Locked
  nodes are dimmed with a small padlock; mastered nodes show a star.
- **States per node:** `locked`, `available`, `current` (pulsing),
  `mastered` (star), `revisit` (target icon — soft suggestion to revisit
  a weak skill, not a block).
- **A11y:** trail order is reflected in DOM order; arrow keys move
  between adjacent nodes; each node announces stage name + status.

### 2.4 Lesson intro screen

- **Purpose:** anchor the learning outcome before the game starts.
- **One main action:** "Let's go!" button.
- **Child copy:** Big target sound, one sample word, one short sentence.
  E.g.:

  ```
  "Today's sound is /ă/"
  cat
  "The cat sat on a mat."
  ```

- **Layout:** centred. Sound bubble at top, sample word with picture
  below, one decodable sentence, then "Let's go!".
- **States:** `idle`, `playing-audio` (sound bubble animates as the
  recording plays — provides visual feedback without random animation).
- **A11y:** an "🔊 hear it again" button replays the sound; everything
  also reachable by keyboard tabbing.

### 2.5 Game mode screen

The shared shell that hosts any of the seven canonical phonics modes.
Specifics per mode live in `src/modes/phonicsModes.js` (instruction,
objective, error hints, scoring).

- **Purpose:** practise. One question at a time.
- **One main action:** the active game widget (taps to answer).
- **Header (always present):** mascot · 3-step lesson progress dots ·
  "Pause" button (top-right, no quit confirmation needed — exits to
  quest map).
- **Body:** mode-specific widget centred. Big tap targets, generous
  whitespace.
- **Feedback strip (bottom):**
  - **Correct:** "Yes! 🎉" + a one-line objective tie-in
    ("That's the short A sound."). No streak slam-cuts.
  - **Wrong:** "Almost! Try again." + an error-specific hint from the
    mode's `errorHints` map. Reveal the right answer only on second miss.
- **Hint button:** always present in feedback strip; never penalises.
- **States per round:** `prompt`, `awaiting-answer`, `correct`,
  `wrong-first`, `wrong-second`, `revealed`, `between-rounds`.
- **A11y:** every game widget supports keyboard (1–4 number keys for
  choices, Space to replay audio, Enter to advance). All animations
  honour `prefers-reduced-motion`.

### 2.6 Results screen

- **Purpose:** celebrate progress and route to the next thing.
- **One main action:** "Continue" button.
- **Child copy:** "Great quest, [Name]!" with one of three tones based on
  outcome:

  | Outcome             | Top line                             |
  | ------------------- | ------------------------------------ |
  | Mastered (≥80%)     | "You mastered the short A sound!"    |
  | Improved (≥50%)     | "You're getting closer!"             |
  | Needs review (<50%) | "Let's try this one again together." |

- **Layout:** stars earned (1–3), accuracy %, time, words practised
  list, then "Continue".
- **No leaderboards.** No "you were faster than 60% of players." Reward
  is about THIS child's learning, not comparison.
- **States:** `mastered`, `improved`, `review`.
- **A11y:** result is announced via an `aria-live="polite"` region so
  screen readers don't miss it.

### 2.7 Mastery badge screen

- **Purpose:** mark a milestone (a full phase mastered, a first try).
- **One main action:** "Add to my map!" (returns to quest map with the
  star animated in).
- **Child copy:** "You earned the [phase title] badge!"
- **Layout:** big badge artwork centred, name beneath, list of the
  skills the badge represents ("You can decode: cat, hen, sit, hop, bug").
- **Trigger:** only after `phase.masteryCriteria` is met for every
  stage in that phase. Per-stage mastery is celebrated more quietly via
  the star on the quest map.
- **A11y:** badge is `role="img"` with the achievement in alt text.

### 2.8 Parent/teacher progress view

- **Purpose:** show what the child has mastered and what to practise.
- **One main action:** "Print practice list" (the dashboard exists in
  read mode; this is the only outbound action).
- **Sections (in order):**
  1. Header — child name, current phase, mastery %, last-played date.
  2. Strongest sounds (top 5).
  3. Weakest sounds (bottom 5).
  4. Suggested next activity (links to the lesson intro for that stage).
  5. Recent activity sparkline (attempts over time, last 14 days).
  6. Common error types (e.g. "vowel confusion: 14 attempts").
  7. Printable practice list — decodable words + one sentence per weak
     stage, A4-friendly print stylesheet.
- **Auth:** none. Access via a "Grown-ups ›" link from the welcome
  screen; the link explains "this view is for parents and teachers".
- **A11y:** every chart has a text summary above it; print stylesheet
  hides interactive controls.

---

## 3. Cross-screen patterns

### 3.1 Persistent UI

- **Top bar (child screens):** mascot · lesson dots · pause.
- **Top bar (adult screens):** breadcrumb · "Back to child mode".
- **Bottom strip (game-mode only):** feedback + hint button.

### 3.2 Audio

- Every instruction has an audio twin. Auto-play on first land; replayable
  via a 🔊 button. Mute toggle persists per profile.

### 3.3 Mistakes-are-safe contract

- First wrong → calm hint, no sound effect, try again.
- Second wrong → reveal the correct answer with a why ("This one is /ă/
  because A in cat makes the same sound").
- Mastery only counts the first attempt, but the child always finishes
  the question — the journey never branches into a dead end.

### 3.4 Progress visibility

- **Within a lesson:** 3 dots in the header fill as rounds complete.
- **Within a stage:** progress ring on the quest-map node.
- **Within a phase:** the phase bar at the top of the quest map.
- **Within the whole curriculum:** the badge wall on the progress view.

### 3.5 Tablet & laptop layout

- Base unit: 4 px. Container max-width 960 px on tablet, 1100 px on
  laptop. All tap targets ≥ 48 × 48 px (≥ 44 px is WCAG floor; we go
  higher because the audience is 5).
- Game widgets centre vertically on tablet portrait. Two-column layouts
  collapse to one column below 720 px width.

---

## 4. Vertical slice — what we're shipping in this pass

> The brief asked for **"Phase 2 CVC Short A → Sound Match → Blend
> Builder → Results"**. In PhonicsQuest's 10-phase scope, **Phase 2**
> is CCVC (initial blends with the short vowel). The Phase 2 short-A
> stage is `ccvc-a` (sample words: flat, clap, trap, plan, snap,
> flag, grab, stab) — short-A children with one extra consonant
> in front. That's what this slice targets.
>
> The Phase 1 short-A stage `cvc-a` (cat, hat, map…) shares the same
> rendering pipeline; switching the slice target is one constant
> change in `controller.js` (or pass `stageId` to `mountQuestJourney`).

The slice covers these screens end-to-end, using real curriculum data:

```
Welcome
  ↓
Profile select   (skipped if a default profile exists)
  ↓
Quest map        (ccvc-a is the highlighted "current" node)
  ↓
Lesson intro     (target sound /ă/, sample word "flat", sentence)
  ↓
Game: Sound Match   (3 rounds, audio → grapheme)
  ↓
Game: Blend Builder (3 rounds, tap phonemes in order)
  ↓
Results          (stars + per-mode accuracy + Continue → Quest map)
```

Out of slice (planned, not built this pass): mastery badge screen,
parent progress view (the data model is shipped, the UI is not).

### 4.1 Data the slice consumes

- `CURRICULUM` stage `ccvc-a` for outcome, sample words, sentences.
- `PHONICS_MODES.soundMatch` / `.blendBuilder` for instructions,
  objectives, error hints, scoring.
- `progressAnalytics` (new module) for read/write of attempts.

### 4.2 Code organisation

- `src/components/questJourney/` — one render-fn per screen + a tiny
  controller that maps state → screen.
- `src/styles/journey.css` — screen-specific layout on top of the
  existing token system.
- All screens are pure render functions that return an HTMLElement and
  expose a public API (`onContinue`, `onPause`, ...). The controller
  wires them together so each screen can be unit-tested in isolation.

### 4.3 Acceptance criteria for the slice

A child can:

1. Land on Welcome → press Start.
2. Pick a profile (or skip if one exists).
3. See the quest map with `ccvc-a` pulsing.
4. Open the lesson, hear the target sound, hit "Let's go!".
5. Play 3 Sound Match rounds with calm feedback.
6. Play 3 Blend Builder rounds with calm feedback.
7. See a results screen with stars, accuracy, and the words they tried.
8. Return to the quest map with `ccvc-a` now showing progress.

A developer can:

1. `npm test` → schema, mode, content, and progress tests all pass.
2. `import { mountQuestJourney } from './components/questJourney'` and
   mount the slice without booting the rest of the app.

---

## 5. Open questions / future work

- **Mascot:** placeholder emoji 🐉 for now; visual designer to replace
  with character art before broad release.
- **Audio assets:** the slice uses the existing TTS path; recorded VO
  for the lesson intro is queued for a future pass.
- **Onboarding:** the very first session for a new profile should walk
  through what a quest is. Not in the slice.
- **Localisation:** copy is all UK-friendly English. Hooks for i18n exist
  but aren't wired (`tt(...)` calls only).
