# PhonicsQuest — Improvement & Debug Work Document

> **Status (2026-07-07):** items #1-16, #20-25 are DONE, plus #27 (html``
> helper landed; call-site migration is opportunistic), #31 (automatic
> daily backup + restore), and the safe subset of #17-19 (salted PIN
> module extracted, shared day-key helpers, journey gate documented).
> Each landed as its own commit on `claude/phonicsquest-opus-4.8-a2zop2`
> with tests. **Remaining:** the large refactors in #17 (full app.js
> decomposition) and #18 (SRS unification), and #26/#28/#29/#30/#32/#33.

## Context

This document is a full audit of PhonicsQuest structured so it can be executed
task-by-task. It was produced from a codebase-wide review: **all 1,669 tests pass**,
`tsc --noEmit` is clean, and `vite build` succeeds — so this is **latent-bug and
quality work, not broken-CI recovery**. Every finding below was verified against the
source (file:line cited). Fix in severity order: P0 security/data-loss first, then P1
logic bugs, then P2 accessibility, then P3 robustness, then P4 architecture, then P5
tooling.

**Repo convention:** the Vite build output is committed to `docs/` for GitHub Pages
(`vite.config.js` sets `outDir: 'docs'`). Rebuild and commit the regenerated `docs/`
bundle as part of any change that touches `src/`.

---

## P0 — Security & data loss (fix first)

### 1. XSS: AI writing-coach feedback rendered as unescaped HTML

`src/modes/writingQuest.js:314-324` — `_renderAiCoachHtml` interpolates raw Gemini
output (`sentPart`, `issuePart`, `GOOD:` text) into a template assigned via `innerHTML`.
The prompt asks the model to quote the child's own draft back (`SENTENCE: [exact quote]`),
so typed markup like `<img src=x onerror=…>` gets echoed and executed. The sibling
`_renderAiRubricHtml` (line 330) already has a local `esc()` — this function was missed.
**Fix:** escape every interpolated segment (reuse the existing `esc` pattern or
`src/utils/escapeHtml.js`). Add a regression test feeding `<script>`-bearing model output
through the renderer.

### 2. AI output bypasses the guardrail sanitizer

`src/modules/aiService.js:141-160, 234-260` — `getWritingCoachFeedback` and
`gradeSynthesisAnswer` call `callGemini` directly and return raw text, unlike
`askGiriConstrained` which runs `sanitizeAiText` (strips HTML/URLs/markdown). Root cause
enabling #1.
**Fix:** route all child-facing model output through `sanitizeAiText` from `aiGuardrails.js`.

### 3. Gemini API key sent as URL query parameter

`src/modules/aiService.js:25` — `fetch(\`${GEMINI_URL}?key=${key}\`)`leaks the key into
history/Referer/proxy logs.
**Fix:** send via the`x-goog-api-key` header instead.

### 4. Corrupt-state guard silently wipes ALL progress

`src/modules/store.js:202-234` — `_validateState` returns false if any one of six numeric
fields is non-finite, and `_load` then returns fresh `DEFAULT_STATE`, destroying every
wordStat/badge/mastery record with no backup or notice.
**Fix:** repair individual bad fields instead of discarding the whole state; on
unrecoverable failure, stash the raw payload under a backup key (e.g.
`phonicsquest_v2__corrupt`) and show a toast. Add tests.

---

## P1 — Logic bugs in learning/game code

### 5. Mastery engine's speed dimension is permanently dead

`src/modules/masteryEngine.js:78-87` — `_speedScore` filters on `e.meta?.correct === true`
and `typeof e.meta?.responseMs === 'number'`, but `store.recordLearningEvent`
(`store.js:481-496`) stores `correct` and `responseMs` **top-level** with only
`{wordId, mode}` in `meta`. No event ever matches, so the 0.2 speed weight in
`getWordMastery` never contributes. Sibling `getWordSkillMastery` (lines 159-167) reads the
correct shape.
**Fix:** change to `e.correct === true`, `typeof e.responseMs === 'number'`,
`e.responseMs`. Add a test asserting speed contributes for a realistic event.

### 6. Sound Match rounds can omit the correct answer

`src/components/questJourney/rounds.js:43-48` — the non-vowel fallback in
`buildSoundMatchRound` picks `choices` from a fixed pool `['a','e','i','o','u','s','t']`
without forcing the correct grapheme in, so the child can face an unanswerable round. The
vowel branch (line 52) guarantees inclusion.
**Fix:** mirror the vowel branch — force the correct grapheme into the choice set. Add a test.

### 7. Placement-test composites divide by fixed denominators

`src/modules/placementTest.js:1014-1016` — Gate A child composite is `(five sections)/5` and
teacher composite `/2`, but un-administered sections score 0 (`_accuracy`/`_teacherScore` at
lines 659/665), deflating the composite and risking under-placement below the 0.6
`gateASecure` threshold. Same pattern in `_computeStageScores` (lines 770-772).
**Fix:** compute over administered sections only (dynamic denominator) or renormalize
weights; add tests for partially-administered screeners.

### 8. Dead identical if/else in PA target sequencer

`src/modules/paTargetSequencer.js:170-171` — both branches assign
`state.wordsForTargetSeen = []`. Refactor leftover; determine intended lap-completion
behavior or collapse to one line.

### 9. Inconsistent strong-mastery boundary in adaptive selection

`src/modules/adaptiveSelection.js:48-64` — SRS branch uses `>= cfg.strongAccuracy`, plain
classifier uses `>`. A word at exactly 0.9 accuracy is "strong" only if it has a review date.
**Fix:** use `>=` consistently.

### 10. Minor stat/robustness issues (batch)

- `masteryEngine.js:85,171`, `progression.js:208` — "median" takes the upper-middle element
  for even-length arrays; average the two central values.
- `progression.js:87-88` — `_accuracyOver` can yield `NaN` when `s.correct` is undefined;
  default with `(s.correct || 0)`.
- `progression.js:264-266` — `getUnlockedStages` silently depends on `CURRICULUM` being
  topologically ordered; add a guard or iterate to fixpoint.
- `src/modules/speech.js:220-226` — external `stop()` leaves the pending `listen()` promise
  dangling up to 12s; clear the timeout and resolve immediately.

---

## P2 — Accessibility (stated priority in CLAUDE.md)

### 11. Modals: no focus trap, no focus restore

`src/modules/modalManager.js:46-71,82-88` — `open()` focuses the first element but Tab
escapes the `aria-modal` dialog; `close()` never restores focus to the opener.
**Fix:** capture `document.activeElement` on open, cycle Tab/Shift+Tab inside the modal,
restore on close. Extend `tests/settingsAccessibility.test.js`.

### 12. GSAP/canvas animations ignore reduced motion

`src/components/wheel.js:47-80,196-253`, `src/components/confettiHelper.js` (all functions)
— CSS honors `prefers-reduced-motion` but the 3.5s wheel spin and full-screen confetti are
JS-driven and always run.
**Fix:** gate on `store.get('reducedMotion') || matchMedia('(prefers-reduced-motion:
reduce)').matches`; skip to end state / static reveal.

### 13. Wheel result never announced to assistive tech

`index.html:671` + `src/components/wheel.js` — the category wheel is a canvas with one
static `aria-label`; the landed category is never exposed.
**Fix:** announce the resolved `group.label` into a polite `aria-live` region when `spin()`
resolves.

---

## P3 — PWA / persistence robustness

### 14. Store hardening

- `store.js:229` — shallow `{...DEFAULT_STATE, ...saved}` merge drops newly added nested
  keys (`questMastery`, `adaptiveConfig`, `clueStats` buckets); add `schemaVersion` to
  `DEFAULT_STATE` + deep-merge known nested objects + versioned migration hook.
- `settingsController.js:186` — `geminiApiKey` isn't in `DEFAULT_STATE` and `store.reset()`
  (line 334) preserves only `parentPin`, so resetting progress silently deletes the parent's
  API key. Add the key to defaults and the reset-preserve list.

### 15. Service worker fixes (`public/sw.js`)

- Line 42: `addAll(SHELL_FILES)` aborts the whole install on one 404 — cache per-file with
  tolerance (like the phoneme loop at 50-66 already does).
- Line 140: navigations cached by full URL (query variants) grow `SHELL_CACHE` unbounded —
  normalize the nav cache key.
- `src/modules/pwa.js:21-25`: "App updated! Refresh" toast fires on `activated` with no
  reload path — prompt on `waiting`, post `skipWaiting`, reload on `controllerchange`.

### 16. Recording memory/quota (`src/modules/storyRecording.js`)

- Lines 306-310: `_saveHistory` swallows quota errors silently — surface the existing
  storage-warning toast.
- Line 24: `_blobStore` accumulates audio blobs across re-records — cap/evict.

---

## P4 — Architecture & content (larger refactors; do after P0-P3)

### 17. Decompose the 3,436-line `src/app.js` God object

One `App` class wires every screen's listeners inline. Extract by feature (auth/PIN, profile
import, lesson finalization, quest routing) following the existing
`src/components/questJourney/controller.js` pattern (small controller + pure render fns).
Also: `hashPin` (`app.js:108-114`) is unsalted SHA-256 with a `plain:${pin}` fallback — salt
it while extracting auth.

### 18. Unify the three spaced-repetition systems

`srsScheduler.js` (SM-2, YYYY-MM-DD `dueAt`), `reviewScheduler.js` (Leitner, epoch-ms
`dueAt`), and `adaptiveSelection.js` (`nextReviewDate`) each compute "due" independently (≥4
call sites). `store.recordWordAttempt` (`store.js:400-401`) writes both new and legacy fields
to keep them in sync. Pick `reviewScheduler` as source of truth, adapt the other consumers,
and consolidate the ~5 duplicated YYYY-MM-DD date helpers into one shared util.

### 19. Align duplicated mastery gates in questJourney

`src/components/questJourney/controller.js:249-273` reimplements mastery (0.8/6 attempts) and
prerequisite gating inline, diverging from `PROGRESSION_GATE` (0.85 + 4 criteria) in
`progression.js:44-53`. Extract a shared gate or document the intentional difference.

### 20. Open issue #108 — expand Gate B placement item bank

`placementTest.js` Gate B has 1 item per phonics phase and 2 sight words. Expand
`GATE_B_ITEMS` to 3-4 items per phase (CVC, CCVC, CVCC, digraphs, long vowels) + 3-4 more
sight words, with phonetically plausible minimal-pair distractors and `phase`/`group` values
aligned with blend.js/classicBlend.js.

---

## P5 — Tooling, tests & docs

### 21. Make `typecheck` real (or honest)

`package.json:12` runs `tsc --noEmit`, but the repo is 266 `.js` files vs **one** 27-line
`.ts` file; `tsconfig.json` has `"checkJs": false` and includes only `src/types/**/*.ts` +
nonexistent `.d.ts` files. CI's "type check" validates almost nothing.
**Fix:** enable `checkJs: true` + `allowJs` and fix resulting JSDoc-type errors incrementally
(the code already carries rich JSDoc typedefs), or at minimum scope-in a few core modules. If
too noisy, start with `store.js`, `masteryEngine.js`, `placementTest.js`.

### 22. Add ESLint

No lint/format config or devDeps exist; `check:syntax` only catches parse errors. Add ESLint
flat config with a conservative ruleset (`no-unused-vars`, `eqeqeq`, `no-implicit-globals`)
and an `npm run lint` script wired into `.github/workflows/ci.yml`.

### 23. Test-coverage gaps (add targeted unit tests)

- **`src/utils/escapeHtml.js` has zero tests** despite being the XSS-critical utility — test
  it first (pairs with P0 #1).
- Untested modules: `badges.js`, `dashboardInsights.js`, `pwa.js`, `sentenceSkills.js`,
  `srsScheduler.js`, `writingBadges.js`, `writingDraftStore.js`.
- Untested components: `questJourney/rounds.js` and `controller.js` (both carry the P1 bugs
  above — write their tests as part of those fixes), `wheel.js`, `dashboard.js`,
  `sessionSummary.js`, `weeklyRecap.js`.
- Suite quality is otherwise excellent (120 files / 1,669 tests, no skips, no assertion-free
  tests) — match its existing style.

### 24. Docs & release hygiene

- `MIGRATION.md:135,142` says deploy from `dist/` but `vite.config.js:6` sets
  `outDir: 'docs'` — a manual deployer ships nothing. Also cites nonexistent
  `public/audio/sfx/*.mp3` and `.svg` icons (they're `.png`), and claims "5 game modes" vs
  the 18+ registered in `src/modes/index.js`. Fix the paths and mark the doc as historical or
  update it.
- `play-store/assetlinks.json` still carries `REPLACE_WITH_YOUR_APP_SIGNING_SHA256_FINGERPRINT`
  — fine pre-publish, but add a check or prominent note so a TWA release doesn't ship broken
  Digital Asset Links.
- `scripts/*.mjs` utilities (audit-stories, gen-store-graphics, optimize-images) have no
  `npm run` aliases and aren't documented — add aliases.

### 25. Content labeling (low, batch with #20)

`src/data/words.js`: `dip-aw` sits under "diphthongs" but /ɔː/ is a monophthong — relabel the
umbrella (e.g. "Diphthongs & other vowel sounds") or move the group. Word data itself is clean
(1,066 entries, no duplicate ids/words; `contentQa.test.js` enforces curriculum invariants).

---

## P6 — Strategic improvements (beyond bug fixes)

These are larger-lever investments observed during the audit. None are defects; each is a
verified gap with a concrete payoff.

### 26. Bundle size & startup performance

`vite build` warns: the main `index` chunk is **588 kB** (152 kB gzip), plus
`primaryPlaceholders` 437 kB and `grammarMcq` 329 kB. Cause: `src/app.js` eagerly imports
heavy data modules (`data/curriculum.js`, `data/words.js` at `app.js:88-95`) and ~80 static
imports total, so all core data ships before first paint. On the low-end tablets/school
Chromebooks this app targets, that's real startup cost.
**Fix:** dynamic-`import()` quest data at quest-launch time (the `src/modes/lazy.js`
registry already exists — extend the pattern to data files); add `build.rollupOptions.output.manualChunks`
for the big data files; set a `chunkSizeWarningLimit` budget in CI so regressions fail the build.

### 27. Systemic XSS hardening (beyond the P0 patch)

There are **349 `innerHTML` assignments across 79 files**, each a manual-escaping
opportunity for the next P0 #1. Patching one call site doesn't fix the pattern.
**Fix:** add a tiny auto-escaping tagged-template helper (e.g. `html\`...\``that escapes
interpolations by default, with an explicit`raw()` opt-out), migrate high-risk surfaces
first (anything rendering child input, AI output, or profile names), and add an ESLint rule
(`no-unsanitized/property` or a custom rule) once #22 lands.

### 28. End-to-end browser tests

1,669 unit tests but **zero browser-level tests** — no Playwright/e2e directory, so nothing
verifies that a child can actually complete a lesson end-to-end (DOM wiring in `app.js` is
exactly the layer unit tests skip, and exactly where the P1/P2 bugs live).
**Fix:** add Playwright with 3-5 smoke flows: app boots → pick profile → complete one blend
round; open settings modal (keyboard-only); complete a wheel spin; placement test start.
Run headless in CI after unit tests.

### 29. Automated accessibility & performance gates in CI

A11y is a stated priority but is only tested by one unit file. Add `axe-core` assertions to
the Playwright flows (#28) and a Lighthouse CI budget (a11y ≥ 95, performance budget tied to
#26) so regressions are caught mechanically rather than by audit.

### 30. Move recordings & bulky state to IndexedDB

No IndexedDB usage anywhere; everything lives in localStorage (~5 MB quota) — 1,066 words of
stats, 1,000-event learning log, plus recording metadata, while audio Blobs sit in memory
(`storyRecording.js:24`). Quota exhaustion is the likely trigger for the P0 #4 wipe path.
**Fix:** move recordings (and optionally `learningEvents`) to IndexedDB; keep localStorage
for small settings/progress. Pairs with #14's schema versioning.

### 31. Automatic progress backup / restore

`profiles.js:261` has manual JSON export/import, but nothing automatic — a lost device or the
P0 #4 bug means total progress loss for a child. Cheap wins: auto-snapshot the last-known-good
state to a second localStorage key (or IndexedDB) on each successful save, and offer a
one-tap "restore from backup" in parent settings. (Full cloud sync is out of scope; note it
as a future direction.)

### 32. Externalize learner-facing strings (i18n readiness)

Every UI string is hardcoded English inline across 80+ files (no locale layer,
no `navigator.language` use). Even if translation never happens, centralizing learner-facing
strings into a strings module would enable the CLAUDE.md "age-appropriate text" review to
happen in one place, and unblocks localization later.
**Fix:** low priority; do opportunistically during the #17 app.js decomposition rather than
as a big-bang migration.

### 33. Dev-experience guardrails

No Prettier, no pre-commit hooks, no dependency-update automation. After #22 (ESLint), add
Prettier + a pre-commit hook (lint-staged) and a monthly Dependabot/Renovate config — the
lockfile pins vite 5.x while vitest is 4.x-modern; keeping these moving prevents a painful
future jump.

---

## Suggested execution order (each a reviewable commit)

1. P0 #1-3 (XSS + sanitizer + API key header) + escapeHtml tests (P5 #23a)
2. P0 #4 (store state repair/backup) + tests
3. P1 #5-9 (mastery speed, sound-match choices, placement denominators, sequencer dead
   branch, boundary) + tests
4. P1 #10 batch (median, NaN, topo guard, speech promise)
5. P2 #11-13 (focus trap, reduced motion, wheel announcement)
6. P3 #14-16 (store versioning, service worker, recordings)
7. P5 #21-22 (typecheck + ESLint) — do before big refactors so they police them
8. P4 #17-19 (app.js decomposition, SRS unification, gate alignment) — largest, riskiest, last
9. P4 #20 + P5 #24-25 (issue #108 item bank, docs, content labels)
10. P6 #26-33 as capacity allows — recommended order: #27 (html helper, prevents P0 recurrence),
    #28-29 (e2e + CI gates, protect everything above), #26 (bundle), #30-31 (IndexedDB +
    backup), #32-33 (i18n prep, dev guardrails)

---

## Verification (run after every change)

1. `npm test` — 1,669+ tests must stay green; each fix above adds targeted tests.
2. `npm run typecheck` and `npm run check:syntax`.
3. `npm run build` — commit the regenerated `docs/` bundle.
4. Manual XSS check: type `<img src=x onerror=alert(1)>` into Writing Quest with the AI coach
   mocked to echo it; verify it renders as text.
5. Keyboard pass: open the settings modal, verify Tab is trapped and focus returns on Escape.
6. Reduced-motion pass: enable the setting, spin the wheel, verify no 3.5s animation/confetti.
