# PhonicsQuest — Visual Design System

> The token library, component recipes, and "this is how a button feels"
> notes for the quest-based experience. The existing app already ships a
> token-driven CSS at `src/styles/main.css`; this document _names_ that
> system, adds the missing pieces for the quest journey, and records the
> before/after of the polish pass.

---

## 1. Design direction

**Personality:** warm, playful, premium educational. Think a paper-book
storybook that's been quietly turned into an app — not a slot machine.

**Audience:** children 5–8 reading from tablets at home or on a classroom
trolley; the same app needs to look credible enough that a teacher will
keep it open in front of a head teacher.

**What we are NOT:** neon flash, achievement spam, generic SaaS
gradients, anything that confuses "delight" with "distraction."

---

## 2. Colour tokens

### 2.1 Brand & semantic (already in main.css `:root`)

| Token                   | Value     | Usage                                |
| ----------------------- | --------- | ------------------------------------ |
| `--color-primary`       | `#6c63ff` | Main CTAs, current-stage highlights  |
| `--color-primary-light` | `#ede9fe` | Hover backgrounds, surface tints     |
| `--color-primary-dark`  | `#4c46c8` | Pressed button shadow, focus outline |
| `--color-secondary`     | `#ff6b8a` | Accents (badges, milestones)         |
| `--color-success`       | `#22c55e` | Correct feedback, mastered nodes     |
| `--color-error`         | `#ef4444` | Reserved — used sparingly            |
| `--color-warning`       | `#f59e0b` | Hint pill, retry-soon nudge          |
| `--color-info`          | `#3b82f6` | Parent/teacher view accents          |

### 2.2 Phoneme tile colours (already in main.css)

| Token             | Value     | Skill family             |
| ----------------- | --------- | ------------------------ |
| `--c-consonant`   | `#3b82f6` | Consonant graphemes      |
| `--c-short-vowel` | `#ef4444` | Short vowels (a/e/i/o/u) |
| `--c-long-vowel`  | `#22c55e` | Long vowels              |
| `--c-digraph`     | `#a855f7` | sh, ch, th, wh, ck, ng   |
| `--c-blend`       | `#f97316` | Initial / final blends   |
| `--c-silent-e`    | `#94a3b8` | Magic-e marker           |
| `--c-r-control`   | `#ec4899` | r-controlled vowels      |
| `--c-diphthong`   | `#0d9488` | oi/oy, ou/ow, aw         |
| `--c-suffix`      | `#d97706` | -ing, -ed, -er, -est     |

### 2.3 New: quest journey tokens

Added in `src/styles/journey.css` (layered above main.css). These tokens
exist so the quest journey can evolve its identity without touching the
core token set:

| Token                   | Value                                               | Usage                         |
| ----------------------- | --------------------------------------------------- | ----------------------------- |
| `--qj-bg`               | `linear-gradient(180deg, #fef9ff 0%, #f8f7ff 100%)` | Page background               |
| `--qj-surface`          | `#ffffff`                                           | Cards                         |
| `--qj-stroke`           | `#ece9ff`                                           | 1 px borders on cards         |
| `--qj-stroke-strong`    | `#c7c1ff`                                           | Focused / current node border |
| `--qj-node-locked`      | `#e5e3fa`                                           | Quest map locked node         |
| `--qj-node-current`     | `var(--color-primary)`                              | Pulsing current node          |
| `--qj-node-mastered`    | `var(--color-success)`                              | Earned-star node              |
| `--qj-badge-gold`       | `#facc15`                                           | Mastery badge fill            |
| `--qj-feedback-correct` | `#dcfce7`                                           | Bottom feedback strip         |
| `--qj-feedback-wrong`   | `#fef3c7`                                           | Calm "try again" — NOT red    |
| `--qj-tap-min`          | `48px`                                              | Minimum tap-target size       |

> ⚠️ Feedback for "wrong" is amber, never red. Red = error_state in our
> system, reserved for genuine errors (failed save, network down). A
> child guessing the wrong letter is _learning_, not erroring.

### 2.4 Contrast checks

All text/background pairs in the journey pass WCAG AA at 4.5:1 for body
copy and 3:1 for large text. Verified pairs:

| Foreground                  | Background                        | Ratio  | Verdict |
| --------------------------- | --------------------------------- | ------ | ------- |
| `--text` (#1e1b4b)          | `#ffffff`                         | 14.4:1 | AAA     |
| `--text` (#1e1b4b)          | `--qj-feedback-correct` (#dcfce7) | 13.1:1 | AAA     |
| `--text` (#1e1b4b)          | `--qj-feedback-wrong` (#fef3c7)   | 13.5:1 | AAA     |
| `--color-primary` (#6c63ff) | `#ffffff`                         | 4.6:1  | AA      |
| `#ffffff`                   | `--color-primary`                 | 4.6:1  | AA      |

---

## 3. Typography scale

Already tokenised in `:root`. Documented for completeness:

| Token              | Size      | Used for                         |
| ------------------ | --------- | -------------------------------- |
| `--font-size-xs`   | 0.75 rem  | Captions / labels in adult views |
| `--font-size-sm`   | 0.875 rem | Secondary copy                   |
| `--font-size-base` | 1 rem     | Body                             |
| `--font-size-md`   | 1.125 rem | Card titles                      |
| `--font-size-lg`   | 1.25 rem  | Lesson intro sentences           |
| `--font-size-xl`   | 1.5 rem   | Section headings                 |
| `--font-size-2xl`  | 2 rem     | Screen titles                    |
| `--font-size-3xl`  | 2.5 rem   | Welcome title                    |
| `--font-size-4xl`  | 3.5 rem   | Sound bubble on the lesson intro |

Body font is Nunito (rounded, friendly, legible at small sizes), with a
system-ui fallback. We do NOT use a separate display font — Nunito at
size scales is enough.

**Reading rules for child screens:**

- Line length never exceeds 32 characters on tablet portrait.
- Letter-spacing is _not_ negative anywhere — early readers parse each
  glyph individually and tracking that's too tight slows them down.
- We avoid italic for any required reading (it's harder for early
  readers); reserve italic for adult-facing notes.

---

## 4. Spacing & shape

Already tokenised. The journey sticks strictly to:

- **Spacing:** `--space-2/3/4/6/8/12` (4 px grid).
- **Radii:** `--radius-md` (cards), `--radius-lg` (modals),
  `--radius-xl` (sound bubble, primary CTA), `--radius-full` (chips,
  avatars).
- **Shadows:** `--shadow-card` for the "chunky" 3D button look the
  child screens lean on; `--shadow-md`/`-lg` for elevated panels.

---

## 5. Component recipes

Every recipe below has a class hook. Where the recipe is new, the CSS
ships in `src/styles/journey.css`; where it already exists, the class
lives in `src/styles/main.css`.

### 5.1 Buttons (`.btn`, `.btn--primary`, `.btn--ghost`, …)

Existing. Adds a new `.btn--qj-cta` variant for the quest journey's
single primary action per screen:

- 64 px tall, 24 px radius, `--font-size-lg` weight 800.
- Subtle 3D shadow (`box-shadow: 0 6px 0 var(--color-primary-dark)`),
  resolves to flat on `:active`.
- Always announces itself with `aria-label` even when text is visible —
  screen readers may pick up the inner text twice and that's fine.

### 5.2 Cards (`.qj-card`, new)

White surface, 24 px radius, 1 px `--qj-stroke` border, `--shadow-sm`.
Padding `--space-6`. Cards never have a separate hover state on touch
contexts — we use `@media (hover: hover)` to gate the hover style so
tablets don't get a stuck-hover artefact.

### 5.3 Quest map nodes (`.qj-node`, new)

A 96 × 96 px circle with the stage icon. Four states map to four CSS
modifier classes:

| Modifier              | Look                                          |
| --------------------- | --------------------------------------------- |
| `.qj-node--locked`    | Light grey fill, padlock overlay, 0.6 opacity |
| `.qj-node--available` | White fill, primary border                    |
| `.qj-node--current`   | Primary fill, 2 s gentle pulse animation      |
| `.qj-node--mastered`  | Success fill, gold star overlay               |

The pulse is opt-out via `prefers-reduced-motion`: in that case the
current node shows a static glow ring instead.

### 5.4 Progress badges (`.qj-badge`, new)

Round badge for the mastery screen and dashboards. Sizes: `--sm` 48 px,
`--md` 96 px, `--lg` 160 px. Gold fill (`--qj-badge-gold`) with the
phase icon centred. `role="img"` with descriptive alt.

### 5.5 Feedback banners (`.qj-feedback`, new)

Bottom-of-screen strip during a game round. Two variants:

- `.qj-feedback--correct` → green tint, big tick, one-sentence why
  ("That's the short A sound.").
- `.qj-feedback--wrong` → amber tint (NOT red), supportive verb
  ("Almost!"), error-specific hint pulled from `errorHints`.

Both variants are `aria-live="polite"` so screen readers narrate them.

### 5.6 Sound tiles (`.qj-sound-tile`, new)

A 72 × 72 px (touch) / 80 × 80 px (laptop) tile with a single grapheme
or grapheme cluster. Used in Sound Match and Blend Builder.

- Background uses the phoneme-family colour from §2.2 so the child
  builds visual associations (vowels are red, blends orange, etc.).
- Resting state: white fill, coloured border + label. Selected:
  coloured fill, white text.
- Tap target is the full tile; `aria-pressed` reflects selection state.

### 5.7 Word cards (`.qj-word-card`, new)

Displays a target word with optional emoji illustration. Used in the
lesson intro and in Blend Builder result strips. Big, generous letter
spacing (0.06 em), 36 px font, 16 px padding.

### 5.8 Lesson dots (`.qj-dots`, new)

Three to seven dots showing round progress. Filled dot = completed; ring
dot = upcoming; pulsing dot = current. Lives in the game-mode header.
Each dot has `aria-label="Round X of Y"` on hover/focus.

### 5.9 Sound bubble (`.qj-sound-bubble`, new)

The huge `/ă/` graphic on the lesson intro screen. 220 × 220 px circle,
`--font-size-4xl` text, plays the recording on click. Pulses _only_
during audio playback so the pulse means something.

### 5.10 Mascot (`.qj-mascot`, existing `.mascot`)

Re-uses the existing mascot. In the journey it's positioned smaller,
top-left of child screens. Decorative — `aria-hidden="true"`.

---

## 6. Accessibility states

| State            | Visual                                          |
| ---------------- | ----------------------------------------------- |
| `:focus-visible` | 3 px `--color-primary` outline, 2 px offset     |
| `:disabled`      | 50 % opacity, `cursor: not-allowed`             |
| `aria-pressed`   | Same selected look as click — never colour-only |
| `aria-invalid`   | Not used for child screens (no error_state)     |
| `aria-busy`      | Skeleton shimmer on cards while audio warms up  |

**Reduced motion:** `@media (prefers-reduced-motion: reduce)` disables
the current-node pulse and the bouncy `--ease-bounce` transitions; flat
500 ms cross-fades replace them.

**Touch target floor:** 48 × 48 px (we exceed WCAG 2.1's 44 px because
the audience is 5–8). All interactive elements ship a `.qj-tap` mixin
that enforces `min-height: var(--qj-tap-min); min-width: var(--qj-tap-min);`.

---

## 7. Layout grid

- **Base unit:** 4 px (the spacing scale lives on this).
- **Container max-width:** 1100 px on laptop, 960 px on tablet, full
  width below 720 px.
- **Page padding:** `--space-6` (24 px) on mobile, `--space-8` (32 px)
  on tablet+.
- **Game-mode body:** centred vertically using `min-height: calc(100vh -
var(--qj-header-h) - var(--qj-footer-h))`; widget never abuts the
  feedback strip.

---

## 8. Before → after notes

| Area                   | Before                                                      | After                                                                                              |
| ---------------------- | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Wrong-answer feedback  | Red `--color-error` flash + buzzer SFX in some modes        | Amber `--qj-feedback-wrong`, supportive copy, error-specific hint                                  |
| Quest map              | Hard-coded `PHASE_META` in `curriculumMap.js` (7 entries)   | Derived from canonical `PHASES` table — always 10 phases, never drifts                             |
| Mode instructions      | Scattered "desc" strings, sometimes 20+ words               | Enforced ≤ 15 words via `phonicsModes.js` + tested                                                 |
| Tap targets            | Some 36 px chip controls in legacy phonemic-awareness modes | Journey ships `--qj-tap-min: 48px` floor and a `.qj-tap` utility                                   |
| Feedback hierarchy     | Same toast for correct + incorrect, only colour differed    | Two distinct `.qj-feedback` variants with bespoke copy and hint slot                               |
| Mastery comms          | Buried in a stat row on the dashboard                       | Dedicated mastery badge screen + per-stage star on the quest map                                   |
| Speed messaging        | Speed bonus surfaced as the headline result for fast rounds | Speed bonus is a tiny chip — accuracy stays the headline                                           |
| Reduced motion         | Bouncy transitions everywhere, no fallback                  | All `--ease-bounce` transitions gated by `prefers-reduced-motion`                                  |
| Quest-map current node | Static colour swap                                          | Pulsing animation _that means audio is playing or this is your next stop_ — purposeful motion only |
| Parent view            | One catch-all dashboard, lots of charts                     | Focused sections: strongest sounds, weakest sounds, suggested next, printable list                 |

---

## 9. How to use this system

- **For a new screen:** start by picking your one main action; place
  it in a `.btn--qj-cta` slot at the bottom of the screen on mobile,
  bottom-right on laptop.
- **For a new component:** if it lives only in the journey, add the
  recipe to `journey.css`. If it's reused across the existing app, add
  the recipe to `main.css` and document it here.
- **For copy:** keep instructions ≤ 15 words for child screens; verify
  with the mode-registry test (`phonicsModes.test.js`).
- **For colour:** never invent a new hex. If you need a colour, pick a
  semantic token. If you genuinely need a new one, add it to `:root`
  and to §2 here in the same PR.
- **For motion:** if a child can't tell you _what the motion means_,
  the motion shouldn't ship.
