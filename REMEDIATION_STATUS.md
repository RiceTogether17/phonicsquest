# Audit remediation status — PhonicsQuest_Audit_2026-09-19

Companion to `PhonicsQuest_Audit_2026-09-19.md`. Tracks what has been fixed on
`claude/phonicsquest-audit-remediation-8p5y7a`, and — more important for anyone
deciding whether to put this in front of a child — what has **not**.

Audited commit: `79dff37`. Findings: 26 (12 P1, 13 P2, 1 P3).

## Summary

**All 12 P1 findings are addressed**, plus the four P2 findings of the audit's
work package 4 — the remaining ones that produce a number a parent or teacher
reads. P1 is the audit's bar for "before assessment use or wider unsupervised
rollout": incorrect marking or teaching, misleading assessment claims,
cross-learner records, credential disclosure.

Nine P2 findings and the one P3 remain. They are real and several affect daily
use.

Verification on the current head: 208 test files, 2,741 unit tests, 42 browser
tests, typecheck, lint (0 errors), formatting, scope/sequence check and bundle
budget all pass.

## The governing principle applied

Where a claim outran its evidence, the claim was corrected rather than the
activity deleted. The P6 papers still exist and are still good practice; they
no longer say "full PSLE format" or "exam-ready". Self-marking still exists and
still counts as practice; it no longer produces mastery. The distinction the
audit drew — between what the app taught, what the child practised with
support, and what they can independently demonstrate — is now enforced in the
mastery store rather than asserted in a comment.

## P1 — done

| #   | Finding                                    | What changed                                                                                                                                                                                                                                                                                                  |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | P6 "full PSLE-format" claims incorrect     | Relabelled as mixed-component practice. `examBlueprints.js` records the official format as checkable data; every paper declares `matchesOfficialFormat: false` and the seven specific differences; the score summary carries the caveat.                                                                      |
| 2   | Open-ended marking unreliable both ways    | Grader returns `needsReview` where it cannot decide; those questions leave the auto-graded total in both directions. Negation lookback, fronted-negative and "no longer" defects fixed. Polarity judged against the mark scheme, asymmetrically. Marking keys authored for the two questions the audit named. |
| 3   | Guided self-marks inflate mastery          | `updateSkill` is evidence-aware: below `independent` it records practice accuracy and leaves mastery untouched. Idempotent under an attempt ID, so ten taps bank one reflection.                                                                                                                              |
| 4   | Records cross profile boundaries           | The five global keys are scoped per profile and registered for cleanup. `adoptLegacyGlobalRecords` assigns an existing install's pile to one learner, once, then deletes the global copies.                                                                                                                   |
| 5   | Exports include AI credentials             | Credentials, PIN and provider config withheld on export **and** on import. Enforced by an explicit list plus a secret-shaped-name pattern, with a test requiring the two to agree.                                                                                                                            |
| 6   | Privacy text contradicts AI transmission   | Rewritten to describe the default offline path, what each AI feature sends, browser speech recognition, and exports. Unestablished COPPA/GDPR compliance claim removed. Adult disclosure added at the point of enabling.                                                                                      |
| 7   | Phoneme identity and audio errors          | `nk` derives /ŋ/+/k/ (20 words). Voiced /ð/ split from unvoiced /θ/ across 14 words, and routed to TTS so it is genuinely voiced. Consonant+le ordering corrected. Schwa substitution declared rather than silent.                                                                                            |
| 8   | "Sound Effects" disables teaching audio    | Nine instructional methods moved to `teachingAudioEnabled`; `sfxEnabled` governs `playSfx` alone. Both switches now say what they control.                                                                                                                                                                    |
| 9   | Synthesis ignores the required opening     | Task constraints checked before meaning **and** before the AI fallback. Wrong connector and right-connector-wrong-position get different feedback.                                                                                                                                                            |
| 10  | Teaching rules overgeneralise              | All five corrected: the not-until cleft, unless+not, comparative syllable count, subject-verb -s tense scope, and tch/dge called trigraphs.                                                                                                                                                                   |
| 11  | Items with more than one defensible answer | The six named items fixed — context added to force the keyed answer, one genuinely-correct distractor replaced, two open-cloze blanks now accept the alternatives.                                                                                                                                            |
| 21  | Deployment independent of verification     | Deployment triggers on CI succeeding and ships the artifact CI verified, not a rebuild. A manual deploy re-runs the suite first.                                                                                                                                                                              |

## P2 work package 4 — done

The audit's own next block after the P1 set, and the four findings that still
produced a figure someone would read as a result.

| #   | Finding                                         | What changed                                                                                                                                                                                                                 |
| --- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13  | Blend confirmation is recognition, not decoding | Commits at `guided` rather than `independent`. The app blended the word aloud seconds earlier, which is evidence.js's own definition of guided, so it cannot carry a decoding mastery claim.                                 |
| 14  | Fluency and supported sound work overclaim      | "Sprint mastered!" → "Target pace reached!", "words/min" → "words matched/min", with a line saying it is not a reading-aloud speed. `classifyEvidence` gained `supportUsed`, so stretched speech drops soundCount to guided. |
| 15  | Primary mastery merges skills and evidence      | Aliases split into same-construct (blended) and related (recommendation only), so comparatives no longer establish superlatives. Independent attempts counted; the printed report labels a thin score "early indication".    |
| 16  | Cloze and Listening reporting gaps              | Both commit through the shared services, once per passage. Hints or a reveal drop the cloze evidence to guided; listening commits auto-marked and self-marked answers separately.                                            |

## Not done — P2 and P3

These are unaddressed. Nothing below has been started.

| #   | Finding                                            | Why it matters                                                                                                                                                            |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 12  | Practice-bank size overstates variety              | P1 Articles' 27 passages reduce to four unique bodies. README still promises 100+ per category against actual 8–23.                                                       |
| 17  | Open-ended sections too large, grade-blind         | A P6 profile opens Open-ended Comprehension at P1 with 107 answer boxes.                                                                                                  |
| 18  | Visual Text is text-only                           | Posters rendered in `<pre>`; the official component is multimodal.                                                                                                        |
| 19  | Writing feedback uses shallow signals              | `lower.includes()` credits connectors found inside other words. Partly mitigated: writingQuest's heuristic result is now recorded as guided, so it cannot become mastery. |
| 20  | Accessibility failures                             | Comprehension Cloze picker has a critical `aria-required-children` violation; four screens have serious contrast failures. See note below.                                |
| 22  | Offline support and recovery                       | Service worker deletes every cache but its own; unopened modules are not guaranteed offline.                                                                              |
| 23  | Daily analytics mix local midnight with UTC labels | Parent-facing "today" can be the wrong day.                                                                                                                               |
| 24  | AI guardrails inconsistent                         | Writing coaching and synthesis grading bypass the shared system policy.                                                                                                   |
| 25  | MOE alignment not established                      | `SCOPE_AND_SEQUENCE.md` already says the Learning Outcomes are the app's own.                                                                                             |
| 26  | Engineering debt                                   | `app.js` 3,175 lines; `main.css` 18,871; parallel registries. Includes the dormant Quest Journey prototype that derives a digraph answer from a word's first letter.      |

## Two things the audit reported that could not be confirmed here

**The failing browser test (finding 20).** The audit found Segment It failing an
axe colour-contrast check. On the current head all 42 browser tests pass,
including that one. The audit used headless Chromium 153 because the pinned
build failed to download; this run used the environment's Chromium 1194. A
contrast result can differ between engine versions, so treat finding 20's other
items — the Comprehension Cloze `aria-required-children` violation and the
`.placeholder-paper-link` contrast failures — as still open until re-scanned on
the pinned browser. They were not fixed.

**The official PSLE blueprint.** `seab.gov.sg` and the linked specification PDF
are both unreachable from this environment, so `examBlueprints.js` records only
the figures the audit verified and quoted. It is marked `isComplete: false` and
`certifyAgainstBlueprint` refuses every paper. That is enough to prove the
current papers do **not** match, which is what finding 1 needed; it is not
enough to certify that a rebuilt paper does. Completing it needs the PDF.

## What is still not safe to show a parent

Per the brief's rule — a number a parent or teacher reads must be correct
before it is shown, or not shown:

- **Completion counters** still count surface variants as distinct coverage
  (finding 12). A bank of 27 passages reducing to four unique bodies reports as
  27 completions. This is the last figure on a parent-facing surface that
  overstates what happened, and it is the only one of the four originally
  listed here that is still open.
- **Daily "today" labels** can name the wrong day outside UTC (finding 23).
  Not a mastery figure, but it is on a chart a parent reads.

Fixed since the first pass: primary mastery percentages no longer merge unlike
skills and now carry their sample size; the fluency figure says what it timed;
Blend It! confirmation is recorded as guided recognition rather than
independent decoding. The P6 paper score says what it is.

Worth being plain about what "fixed" means for mastery: the numbers are now
honest about their own basis, not that every skill has enough evidence behind
it. A score labelled "early indication — 1 independent attempt" is doing its
job by telling you not to lean on it.

## Suggested next step

Work packages 1, 2 and 4 are complete, along with the parts of 3 and 5 the P1
findings covered.

The two best candidates now are both smaller and self-contained:

- **Finding 20 (accessibility).** Affects every session rather than a reported
  number: a critical `aria-required-children` violation on the Comprehension
  Cloze picker and serious contrast failures on four screens. Re-scan on the
  pinned browser first — see the note above about Chromium versions.
- **Finding 23 (timezone).** `_startOfDay` uses local midnight and `_isoDay`
  labels it as a UTC date, so in Singapore a parent-facing "today" can carry
  the previous day's label. Small, and it is on a chart people read.

After those, findings 17 and 18 (grade-blind section loading, text-only Visual
Text) are the largest remaining effect on how a session actually feels.
