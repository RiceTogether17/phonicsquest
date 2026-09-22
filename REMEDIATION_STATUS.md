# Audit remediation status — PhonicsQuest_Audit_2026-09-19

Companion to `PhonicsQuest_Audit_2026-09-19.md`. Tracks what has been fixed on
`claude/phonicsquest-audit-remediation-8p5y7a`, and — more important for anyone
deciding whether to put this in front of a child — what has **not**.

Audited commit: `79dff37`. Findings: 26 (12 P1, 13 P2, 1 P3).

## Summary

**All 26 findings are addressed.** P1 was the audit's bar for "before
assessment use or wider unsupervised rollout": incorrect marking or teaching,
misleading assessment claims, cross-learner records, credential disclosure.

**Every figure and every claim the audit named as overstated is now correct or
gone.** What remains is authoring and evidence work, not remediation: the
syllabus crosswalk is built but empty, because the MOE document cannot be
retrieved from here, and some practice banks are thin now that they report
their real size.

Verification on the current head: 216 test files, 2,864 unit tests, 51 browser
tests, typecheck, lint (0 errors), formatting, contract checks, scope/sequence
check and bundle budget all pass.

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

## P2 — also done

| #   | Finding                          | What changed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| --- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 20  | Accessibility failures           | Cloze level picker is real `<ul>`/`<li>` markup. `--color-primary-on-tint` per theme, computed to clear 5:1 (all four themes failed before, worst 1.88:1), with dark mode mapped to `--color-primary-light`. CI now scans the five primary sections: 42 → 48.                                                                                                                                                                                                                                                                                                                                                                          |
| 23  | Timezone day labels              | Day keys are learner-local throughout, from one shared helper used by the chart, the XP ledger and its cutoff. Calendar stepping replaces fixed 24-hour blocks. Verified under five zones.                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 26  | Engineering debt                 | The Quest Journey prototype is deleted: 1,089 lines no shell imported, whose Sound Match builder keyed a letter taken from the sample word's first letter (38 of 58 stages) and whose Blend Builder split "ship" into s-h-i-p. `phonicsModes.js` no longer calls itself canonical and names which four of its seven engines a UI actually uses. Invented response durations are gone from Cloze Castle, Word Vault and Sentence Forge, so the dashboard's "Avg response" only averages measured ones. `check-contracts.mjs` fails the build on registry drift, a literal duration, or an unreachable module without a recorded reason. |
| 19  | Writing feedback shallow signals | Connectors, required points, sequence words and show-don't-tell credit match whole words now, so "The island was sandy. She forgot the ball." earns none of the three it used to. Feedback lists the connectors it found rather than only counting them, so the evidence is checkable. The band is labelled "Draft check (automatic)" with a line saying what a word counter cannot judge.                                                                                                                                                                                                                                             |
| 22  | Offline support and recovery     | The worker precaches every built chunk from a build manifest, so a module never opened online still opens offline; cache cleanup is namespaced, so another app on the origin survives; the cache version is a content hash the build stamps in, not a number to remember; a stale chunk after a deploy reloads itself once; the storage-full warning offers a backup instead of telling a parent to clear the data their child's progress lives in.                                                                                                                                                                                    |
| 24  | AI guardrails inconsistent       | One `askStructured` boundary for every marking feature: shared policy in the system channel, the child's writing fenced with a per-request id, a declared reply schema, and validation that drops anything else. A quoted sentence must be in the draft. An AI verdict marks a synthesis answer right for the child but records guided evidence, so it cannot become mastery.                                                                                                                                                                                                                                                          |
| 12  | Bank size overstates variety     | Every generated item names the authored one it re-presents. Coverage counts those; repeats are shown as "revision rounds". P1 Articles reads "15 questions · 0 / 4 passages · +23 revision rounds" where it read "102 questions · 0 / 27 passages". README numbers now come from the live banks and a test says so.                                                                                                                                                                                                                                                                                                                    |

## What each open item needs

Nothing below is an unfixed defect. These are the pieces that need a document
or an author rather than a change to the code.

| #   | What is open            | What it needs                                                                                                                                                                                                                                                                                                |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 25  | The crosswalk is empty  | The MOE English Language Syllabus (Primary). `moe.gov.sg` and the NIE library mirror are both refused by this environment's egress proxy, as they were during the audit. The structure, the validator and the build check are in place; entries are a teacher's data-entry job once the document is in hand. |
| 12  | Some banks are thin     | Authoring. Three distinct passages in the thinnest Cloze Castle scope. The tests are written so padding with copies cannot raise the number.                                                                                                                                                                 |
| 26  | `app.js` and `main.css` | A decomposition with real regression risk and no acceptance criterion attached. The audit warns against a cosmetic rewrite; `IMPROVEMENTS.md` #17 and #18 hold the plan.                                                                                                                                     |

## Two things the audit reported that could not be confirmed here

**The failing browser test (finding 20).** The audit found Segment It failing
an axe colour-contrast check; all 48 browser tests pass here. The audit used
headless Chromium 153 because the pinned build failed to download, and this
environment ran Chromium 1194.

Finding 20's other items are now fixed and scanned by CI — but one discrepancy
is worth recording. With `role="list"` deliberately reinstated, this
environment's axe did **not** report the `aria-required-children` violation the
audit found, although the structural test caught it. So the markup fix rests on
its own merits rather than on a reproduced axe failure. The contrast failures
did reproduce exactly, on the four screens the audit named.

**The official PSLE blueprint.** `seab.gov.sg` and the linked specification PDF
are both unreachable from this environment, so `examBlueprints.js` records only
the figures the audit verified and quoted. It is marked `isComplete: false` and
`certifyAgainstBlueprint` refuses every paper. That is enough to prove the
current papers do **not** match, which is what finding 1 needed; it is not
enough to certify that a rebuilt paper does. Completing it needs the PDF.

## What a parent reads

Per the brief's rule — a number a parent or teacher reads must be correct
before it is shown, or not shown — no figure on a parent-facing surface is now
known to overstate what happened.

Fixed across the passes: primary mastery percentages no longer merge unlike
skills and carry their sample size; the fluency figure says what it timed;
Blend It! confirmation is recorded as guided recognition rather than
independent decoding; the P6 paper score says what it is; and completion
counters count distinct passages, with repeats named as revision.

Two things to be plain about.

**"Honest" is not "sufficient."** The mastery numbers are now honest about
their own basis, not evidence that every skill has enough behind it. A score
labelled "early indication — 1 independent attempt" is doing its job by telling
you not to lean on it.

**The banks got smaller when counted properly.** Cloze Castle holds 3–11
distinct passages per grade/category and Word Vault 6–14, not the 27 and 38 the
shelf length suggested. Nothing was deleted — that is what was always there.
Whether it is enough material for a term is a curriculum question the audit
did not answer and neither does this change.

## Suggested next step

Every finding the audit raised has been addressed, and every work package it
defined is complete.

**Get the syllabus document.** It is the only thing standing between the
crosswalk and a real alignment claim, and it is a download rather than a piece
of engineering. `validateCrosswalkEntry` refuses anything without a verbatim
quotation, a page reference, a retrieval date and a named reviewer, so the
entries cannot be filled in from memory — which is how the codes this finding
removed got there.

**Author more passages** where the banks are thin (finding 12).

**Then the accessibility work**, which is scanned but not certified: the five
primary sections are covered at their landing state; task, feedback, modal and
result states in each theme still need passes, as do keyboard and
screen-reader checks on a real device. The review-surface colours renamed
under finding 26 are still not theme-aware.

Four limits worth restating before any wider rollout.

**Alignment.** The app now says its sequence is its own. That is accurate and
it is also a smaller claim than a tuition centre may want. Nothing here has
been checked against the MOE syllabus by anyone.

**AI.** The boundary makes prompt injection much harder and makes a malformed
or redirected reply fail safely, but no test can prove a model will never
comply with an instruction a child writes into their own composition. What is
proved is that a reply which does not validate is discarded, and that no mark
or score moves on AI text alone.

**Offline.** Coverage is every activity and every sound, not every story
illustration; that exclusion is recorded in the build manifest so the wording
and the behaviour cannot drift apart.

**Writing.** The evaluator is accurate about what it counts, which is not the
same as being able to mark a composition. Whether a story is interesting,
coherent or suited to its reader is still a teacher's judgement, and the app no
longer implies otherwise.
