# Audit remediation status — PhonicsQuest_Audit_2026-09-19

Companion to `PhonicsQuest_Audit_2026-09-19.md`. Tracks what has been fixed on
`claude/phonicsquest-audit-remediation-8p5y7a`, and — more important for anyone
deciding whether to put this in front of a child — what has **not**.

Audited commit: `79dff37`. Findings: 26 (12 P1, 13 P2, 1 P3).

## Summary

**All 12 P1 findings are addressed**, plus nine P2 findings: the four of the
audit's work package 4 (the remaining ones that produce a number a parent or
teacher reads), the accessibility failures, the timezone bug, the two
learning-experience findings, and the practice-bank counting. P1 is the audit's
bar for "before assessment use or wider unsupervised rollout": incorrect
marking or teaching, misleading assessment claims, cross-learner records,
credential disclosure.

**Every figure the audit named as overstated is now correct or gone.** Four P2
findings and the one P3 remain; none of them produces a number anyone reads.
They are real and two affect daily use.

Verification on the current head: 212 test files, 2,790 unit tests, 48 browser
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

## P2 — also done

| #   | Finding                      | What changed                                                                                                                                                                                                                                                                                                        |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 20  | Accessibility failures       | Cloze level picker is real `<ul>`/`<li>` markup. `--color-primary-on-tint` per theme, computed to clear 5:1 (all four themes failed before, worst 1.88:1), with dark mode mapped to `--color-primary-light`. CI now scans the five primary sections: 42 → 48.                                                       |
| 23  | Timezone day labels          | Day keys are learner-local throughout, from one shared helper used by the chart, the XP ledger and its cutoff. Calendar stepping replaces fixed 24-hour blocks. Verified under five zones.                                                                                                                          |
| 12  | Bank size overstates variety | Every generated item names the authored one it re-presents. Coverage counts those; repeats are shown as "revision rounds". P1 Articles reads "15 questions · 0 / 4 passages · +23 revision rounds" where it read "102 questions · 0 / 27 passages". README numbers now come from the live banks and a test says so. |

## Not done — P2 and P3

These are unaddressed. Nothing below has been started.

| #   | Finding                               | Why it matters                                                                                                                                                            |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 19  | Writing feedback uses shallow signals | `lower.includes()` credits connectors found inside other words. Partly mitigated: writingQuest's heuristic result is now recorded as guided, so it cannot become mastery. |
| 22  | Offline support and recovery          | Service worker deletes every cache but its own; unopened modules are not guaranteed offline.                                                                              |
| 24  | AI guardrails inconsistent            | Writing coaching and synthesis grading bypass the shared system policy.                                                                                                   |
| 25  | MOE alignment not established         | `SCOPE_AND_SEQUENCE.md` already says the Learning Outcomes are the app's own.                                                                                             |
| 26  | Engineering debt                      | `app.js` 3,175 lines; `main.css` 18,871; parallel registries. Includes the dormant Quest Journey prototype that derives a digraph answer from a word's first letter.      |

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

Work packages 1, 2 and 4 are complete, along with the parts of 3 and 5 the P1
findings covered.

Finding 12's counting half is done; its content half is not. The banks now
report their real size, and that size is small in places — three distinct
passages in the thinnest Cloze Castle scope. Authoring more passages is the
only way to raise it, and the tests are written so that padding with copies
cannot.

Findings 22 and 24 are the next largest: the service worker deletes every
cache but its own, which can remove another app's data on a shared origin, and
writing coaching and synthesis grading bypass the shared AI system policy.
Neither shows up in a lesson, but both are the kind of thing that is much
cheaper to fix before a wider rollout than after one.

Accessibility is scanned but not certified. The five primary sections are
covered at their landing state; task, feedback, modal and result states in each
theme still need passes, as do keyboard and screen-reader checks on a real
device.
