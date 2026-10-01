# PhonicsQuest: code, teaching content and edtech design audit

**Repository:** RiceTogether17/phonicsquest  
**Snapshot:** `main`, commit `79dff3720015ef813eb41ed29c0ed02a60abc2ad`  
**Audit dates:** 19–20 September 2026  
**Audience:** developer, English teacher and learning-product designer

## Overall judgement

PhonicsQuest has a substantial working foundation: explicit phonics lessons, genuine spelling activities, a large English practice bank, spaced review, local learner profiles, writing drafts, and a useful distinction between supported practice and independent evidence. It is considerably more developed than a collection of disconnected quizzes.

**It is suitable for supervised practice with content corrections, but its current scores, mastery values and “full PSLE-format” claims should not be treated as dependable assessment evidence.** The most important work is to make the content, scoring and learner records trustworthy before expanding the question banks.

The highest-priority problems are:

1. P6 papers are presented as full PSLE-format papers but do not match the 2026 examination structure.
2. Open-ended paper marking rejects valid answers and awards marks for insufficient keywords.
3. Self-marking can repeatedly increase mastery on the same answer.
4. Some learner records are shared across profiles.
5. Profile exports include saved AI API keys.
6. Several activities teach or assess an inaccurate sound, rule or answer constraint.
7. Accessibility checks fail on real screens, and deployment does not depend on the verification workflow.

No repository commits, pull requests, deployments or live learner-data changes were made. The audit used a local checkout and synthetic learner profiles.

## Scope and confidence

This is a section-by-section repository audit, supported by structural content checks, representative editorial review, executable reproductions and browser checks. It is **not a claim that every sentence in every generated passage has received individual human editorial approval**.

Coverage included:

- The application shell, onboarding, placement, primary diagnostic, home tabs and guided lesson composition.
- Early-reading mode registry and shared answer, evidence, audio and progression paths; phonics data and mini-lessons; stories and sight words.
- All named primary English sections, practice papers P1–P6, and shared graders.
- Progress, reports, class snapshot, profiles, persistence, AI, offline support, tests and deployment.
- Structural checks over **2,520 Grammar MCQ items and 1,928 Vocabulary MCQ items**. Neither bank had duplicate option strings within an item or an answer missing from its choices in the generated snapshot. That does not establish semantic answer uniqueness.
- **1,117 word entries**, **69 stories**, **58 synthesis items**, **1,559 sentence entries**, and **24 purpose-written listening sets** were inventoried. Existing tests cover additional content invariants.
- Four targeted executable reproductions: repeated self-mark inflation, API key export, synthesis stem bypass and instructional audio muted by the Sound Effects switch.
- Existing browser suite and 14 primary-section landing screens at a 390 × 844 viewport. Screenshots of Grammar MCQ, Visual Text and Open-ended Comprehension were inspected.

Limitations: browser checks used headless Chromium 153, rather than the repository's pinned Chromium 151, because the pinned download failed. No live paid AI calls were made. Audio routing was inspected, but the entire recorded phoneme library was not auditioned by ear. Real Android/iOS speech recognition, screen-reader interaction, classroom use and low-end device timing still need dedicated validation. No dependency-vulnerability scan or penetration-test certification is claimed.

## Verification results

| Check                                    | Result                                     | Interpretation                                                                                               |
| ---------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ |
| Dependency installation                  | Passed                                     | Clean `npm ci --ignore-scripts`; Node 24.19.0 in this environment                                            |
| Production build                         | Passed                                     | 247 modules transformed; output matched tracked build files                                                  |
| Bundle budget                            | Passed                                     | Startup JavaScript 666.6 KiB against a 700 KiB budget; still a sizeable startup payload                      |
| Type checking                            | Passed                                     | `checkJs` is false globally; only nine source files contain `@ts-check`                                      |
| ESLint                                   | Passed with 155 warnings, zero errors      | Warnings concern interpolated `innerHTML`; this is an exposure to review, not 155 proven XSS vulnerabilities |
| Formatting                               | Passed                                     | README incorrectly says this check is not in CI                                                              |
| Scope/sequence generation                | Passed                                     | Generated document matches data; does not establish external MOE alignment                                   |
| Story audit                              | 69 audited, zero reported problems         | Checks consistency with the app's own allowances; not an independent phonics certification                   |
| Existing unit suite, initial environment | 2,620 passed, one failed                   | `progressAnalytics` daily-bucket test is timezone-sensitive                                                  |
| Full unit suite rerun under UTC          | 2,625 passed                               | Includes all 2,621 repository tests and four temporary audit reproduction tests                              |
| Focused daily-bucket reruns              | 21/21 passed under UTC and Asia/Singapore  | Distinguishes the environment-sensitive failure from a universal failure                                     |
| Existing browser suite                   | 41 passed, one failed                      | Segment It failed axe colour contrast                                                                        |
| Targeted defect reproductions            | Four confirmed                             | Described in Findings 3, 5, 8 and 9                                                                          |
| Additional mobile landing-screen checks  | All 14 opened; zero page JavaScript errors | Five screens had axe violations: one invalid ARIA list and four low-contrast labels                          |

A passing test suite cannot identify all ambiguous English questions, invalid exam claims or weak measurement assumptions. Several findings below coexist with passing regression tests.

## Priority definitions

- **P1 — before assessment use or wider unsupervised rollout:** incorrect marking/teaching, misleading assessment claims, cross-learner records or credential disclosure.
- **P2 — next improvement cycle:** accessibility, feedback, progression, navigation and reliability problems that materially affect use.
- **P3 — planned maintenance:** architecture, documentation and coverage improvements.

These are audit priorities, not claims about an active security incident.

## Detailed findings

### 1. P6 “full PSLE-format” claims are incorrect — P1

**Evidence:** `src/data/p6PracticeTests.js`, `src/modes/placeholderMeta.js`, and the P6 browser screen. All four P6 papers have the same 95-mark hybrid structure and 1 h 50 min duration. The interface explicitly describes a full Paper 1 + Paper 2 structure.

The current SEAB 2026 format is authoritative. The repository differs as follows:

| Component                 | Repository P6 papers       | SEAB 2026                                |
| ------------------------- | -------------------------- | ---------------------------------------- |
| Paper structure           | One 95-mark hybrid         | Paper 1: 50 marks; Paper 2: 90 marks     |
| Situational Writing       | 15 marks within the hybrid | 14 marks, Paper 1                        |
| Continuous Writing        | Absent from these papers   | 36 marks, Paper 1                        |
| Vocabulary Cloze          | 10 marks                   | 5 MCQ items/marks, Paper 2               |
| Visual Text Comprehension | No dedicated section       | 5 MCQ items/marks, Paper 2               |
| Comprehension Cloze       | 10 blanks/marks            | 15 blanks/marks, Paper 2                 |
| Open-ended Comprehension  | 15 marks; 7–8 questions    | 20 marks; 10 questions, Paper 2          |
| Duration                  | 1 h 50 min for hybrid      | Paper 1: 1 h 10 min; Paper 2: 1 h 50 min |

**Teacher impact:** timing practice and section weighting prepare children for a different paper. “Exam-ready” is not justified by these results.

**Fix:** immediately relabel these as custom mixed-component practice. Then implement separate, versioned Paper 1 and Paper 2 blueprints. Keep the existing questions where appropriate, but rebuild the paper assembly and scoring against the official blueprint.

**Acceptance:** a blueprint test checks component order, response type, item counts, marks and duration. Continuous writing and situational writing use teacher-reviewed assessment or clearly labelled practice feedback. Do not calculate PSLE readiness from the current hybrid.

Official source: [SEAB 2026 English Language examination format](https://isomer-user-content.by.gov.sg/334/6c4dc7cf-bf0b-4d79-9005-1b1f7fa68cc9/0001_y26_sy.pdf).

### 2. Open-ended paper marking is unreliable in both directions — P1

**Evidence:** `src/modes/scoring/shortAnswerGrader.js`; `_shortAnswerAttrs` and grading in `src/modes/primaryPracticeTest.js`; P6 comprehension data.

Of 29 P6 comprehension questions with model answers, **21 have no `requiredGroups`, `keywords` or `acceptable` list**, seven use keywords without required groups, and one has required groups. Missing marking keys fall back to a match against the complete model-answer string.

**Reproductions using actual questions:**

- Question asks what percentage of coral reefs has been lost. Response **“50%” receives zero**, because the model is a longer sentence containing several equivalent forms.
- Question asks the meaning of “swimming against the tide”. Response **“tide” receives full credit**, without explaining the figurative meaning.
- The negation helper treats **“It is not at all urgent”**, **“Never urgent”** and **“It is no longer urgent”** as unnegated matches for “urgent”. The lookback is only two words and exemptions are overbroad.

**Fix:** separate model answers from marking keys. For each question author acceptable paraphrases, essential meaning units, required evidence, contradiction rules and mark allocation. Where automated grading cannot make a reliable decision, report “Needs teacher review” rather than zero or full marks. Keyword matching alone should not award a complete explanation mark.

**Acceptance:** gold-standard cases include correct short answers, paraphrases, incomplete evidence, irrelevant keyword lists and negated answers. Teacher overrides preserve both the original automated suggestion and final judgement.

### 3. Guided self-marks inflate mastery, including repeated clicks — P1

**Evidence:** `src/modes/openResponse.js`, `src/modules/questMastery.js`.

The open-response module correctly records a `guided` learning event, but separately calls `questMastery.updateSkill()` on every self-mark click. That function accepts a boolean, not an evidence level. The self-mark buttons remain actionable.

**Reproduction:** type “cat” for a model answer “The cat is hungry”, reveal the model, then click **“I got this” ten times**. The mastery value rises from its 0.5 default to **0.9463129088**, without a second answer or independent assessment.

**Impact:** the comment that self-reports “can never support a mastery claim” is not enforced in the mastery store. Primary sections share this path.

**Fix:** make attempt commits idempotent using an attempt ID. Treat a changed self-mark as an update to one reflection record. Give `updateSkill` an evidence-aware contract; keep exposure, reflection, practice accuracy and independently demonstrated mastery separate.

**Acceptance:** repeated taps or rerenders cannot add attempts; ten self-reports cannot create independent mastery; a changed judgement replaces the previous reflection.

### 4. Story, spelling and badge records cross profile boundaries — P1

**Evidence:** `src/modes/storyMode.js` uses global keys `giri_stories_read`, `giri_meet_words` and `giri_comp_log`; `src/modes/lscwcDrill.js` uses `lscwc_stats`; `src/modules/badges.js` uses separate global badge storage. `profiles.js` itself acknowledges the outstanding migration.

**Impact:** another child on the same device can inherit read-story status, word preparation or spelling practice. Reports and recommendations can therefore describe a mixture of learners. Exporting only the main profile store also omits these separate records.

**Fix:** put learner records under one profile-aware persistence API. Keep only genuine device preferences global. Migrate legacy records with an explicit assignment strategy rather than duplicating them into every child. Delete and export all associated learner records consistently.

**Acceptance:** learner A completes a story and spelling drill; learner B remains untouched; export/import preserves A's records; deleting A does not affect B.

### 5. Learner profile exports include AI credentials — P1

**Evidence:** `src/modules/aiConfig.js` persists `aiApiKeys` and the legacy `geminiApiKey`; `store.js` serialises them; `profiles.js::exportProfile` includes the complete saved state as `progressData`.

**Reproduction:** an export from a synthetic profile containing a dummy provider key retained that key in the generated JSON. No real credential was used.

**Impact:** a normal progress-transfer file can expose the parent's provider credential when shared with a teacher or another device.

**Fix:** use an explicit export allowlist and exclude credentials, PIN material and device configuration. Store provider configuration separately from learner progress. Validate imported progress by schema and version; the current importer accepts an arbitrary object.

**Acceptance:** exported files contain no API key or PIN fields; importing an old export cannot silently overwrite credential configuration; ordinary progress round-trips without loss.

### 6. Privacy text contradicts actual AI data transmission — P1

**Evidence:** `public/privacy.html` says learner information never leaves the device or goes to a third party. `src/modules/aiProviders.js` sends requests to external providers; `aiService.js` sends full writing drafts; `aiGuardrails.js` adds practice context.

**Impact:** parents cannot make an informed choice based on the current policy. A composition can contain identifying information even if the application does not automatically add the profile name.

**Fix:** accurately describe the default offline path, optional cloud AI, what each AI feature sends, locally stored recordings, browser-dependent speech services, exports and deletion. Add a clear adult-facing disclosure before enabling cloud AI. Remove categorical compliance assertions that have not been established.

This finding is an implementation-to-disclosure mismatch, not a legal compliance determination.

### 7. Phoneme identity and audio mapping contain teaching errors — P1

**Evidence:** `src/data/words.js::_phonemesForGrapheme` splits every `bl` grapheme letter by letter. Thus **bank** is derived as `/b/ /a/ /n/ /k/`, whereas the nasal sound is /ŋ/ before /k/. Twenty entries contain an `nk` tile, including bank, pink, sink, blink and plank.

The curriculum names both /θ/ and /ð/, but the word/audio paths use one `th` token and one `th.mp3` mapping for thin and that. They cannot reliably select the appropriate voiced or unvoiced target. The schwa key is also mapped to short-u audio as an approximation.

**Impact:** an activity can count the right number of phonemes yet teach the wrong sound. Data-integrity tests do not detect that distinction.

**Fix:** make grapheme spelling, phoneme identity and audio asset distinct fields. Map `nk` to /ŋ/ + /k/; distinguish voiced and unvoiced th; supply a genuine schwa model. Apply the same canonical mapping to sound boxes, highlighting, blending, first/last sounds and spelling tiles. Audit consonant-le ordering as well: the audio table currently places /l/ before schwa.

**Acceptance:** a teacher approves minimal-pair audio and word-level mappings; count and identity are tested separately; no phoneme is replaced by an approximate sound merely to avoid a missing asset.

### 8. “Sound Effects” also disables teaching audio — P1

**Evidence:** `index.html` labels the switch **Sound Effects**; `settingsController.js` writes `sfxEnabled`; `audio.js` checks that flag in `speakWord`, articulated speech and phoneme routines.

**Reproduction:** setting `sfxEnabled=false` prevents `speakWord('cat')` from calling its speech path.

**Impact:** a teacher trying to remove reward noises also removes the spoken stimulus needed to answer phonemic-awareness tasks.

**Fix:** separate reward/effect sounds from instructional voice and recordings. If instructional audio is unavailable, stop audio-dependent assessment and offer an adult-led alternative.

**Acceptance:** disabling effects silences celebrations while all Listen, phoneme and read-aloud buttons remain usable.

### 9. Synthesis accepts answers that ignore the required opening — P1

**Evidence:** `src/data/synthesisItems.js`; `src/modes/synthesisQuest.js::buildAcceptableAnswers`.

For `st-conn-1`, the required opening is **Although**, but **“Even though Siti was feeling very tired, she completed all her chores.”** is accepted. The executable reproduction confirms this. Thirty-one of the 58 data items have at least one alternate that does not start with the supplied stem; that is a screening count, not a claim that all 31 are wrong in every exercise format.

**Impact:** equivalent meaning is accepted even when the learner has not followed the transformation instruction.

**Fix:** add explicit task constraints such as `requiredStart`, `requiredConnector`, tense/person preservation and whether only the continuation is entered. Separate open sentence-combining practice from constrained transformation practice. Apply constraints before both local and AI acceptance.

**Acceptance:** a correct paraphrase with the wrong required connector fails the task constraint with helpful feedback; a valid continuation or full sentence satisfying the stem is accepted.

### 10. Teaching rules overgeneralise or give incorrect advice — P1

**Evidence and corrections:**

| Location                                  | Current problem                                                     | Better teaching                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `synthesisQuest.js`, advancedConstruction | Says “It was not until…that” triggers inversion                     | Contrast “Not until noon **did he arrive**” with “It was not until noon that **he arrived**”                       |
| `synthesisQuest.js`, connectorCondition   | Says never pair unless and not in the same clause                   | Explain the intended condition and avoid unnecessary double negatives; grammatical exceptions exist                |
| `editingQuest.js`, comparatives           | Says two syllables or more require more                             | Teach common patterns and exceptions: happier, cleverer/more clever; do not use syllable count as an absolute rule |
| `editingQuest.js`, agreement              | Singular subjects take verbs ending in -s without restricting tense | Specify simple-present lexical verbs; distinguish be, have, modals and past tense                                  |
| `aiGuardrails.js`, system prompt          | Calls tch and dge digraphs                                          | They are three-letter graphemes/trigraphs representing one phoneme                                                 |

**Fix:** maintain one teacher-reviewed rule bank reused by lessons, wrong-answer feedback and AI instructions. Include the rule's scope, a model, a near-miss and common exceptions. Avoid “always” and “never” when the rule is only a useful beginner pattern.

**Acceptance:** teacher-reviewed examples and counterexamples accompany every generalisation. AI prompts use the same approved terminology.

### 11. Several questions have more than one defensible answer — P1

**Representative evidence:**

- Grammar MCQ: **“Both the teacher and the principal ___ the new timetable.”** Choices include **support** and **supported**. Both fit without a time context, but only support is keyed.
- Grammar MCQ: **“The news about the school trip ___ very exciting.”** Both **is** and **was** are offered without a tense clue.
- Articles: **“Please pass me ___ ruler so I can draw a margin.”** Both **a** and **the** are possible; the item does not establish whether a specific ruler is intended.
- Comprehension Cloze `cc-p3-01`: **“…visited the new community library ___ Saturday.”** Key is **last**, but **on** is equally natural; `accept` is empty.
- Comprehension Cloze `cc-p3-02`: **“…drink water ___ every drill.”** Key is **after**; **before** fits the supplied context as well.
- Vocabulary MCQ: **“The pupils have to ___ their homework before going home.”** The key is “complete”, but “finish off” is also an offered option and a valid answer in this context.

**Impact:** children may be penalised for valid English and learn that the program's preference outranks meaning.

**Fix:** author context that forces the intended answer. When the task is legitimately open, accept alternatives and explain them. For MCQs, ask a second reviewer to complete the stem using every option; structural validators cannot replace that review.

**Acceptance:** every released MCQ has one defensible answer in its stated context, and open cloze accepts all teacher-approved completions. Track disputes by stable item ID.

### 12. Practice-bank size overstates instructional variety — P2

**Evidence:** `_ensureGrammarPassageDepth` in `src/data/passages.js` duplicates the original passage and answer bank, adding a lead such as a pupil sharing a recount. `vocabPassagesExtra/generator.js` also reuses templates. `sentences.js` expands items with time/place frames.

Measured examples:

- **P1 Articles:** 27 passages and 102 blanks reduce to **four unique passage bodies** after removing the added lead; four answer sequences.
- **P6 Word Vault / Context Inference:** 38 passages and 114 blanks; **ten unique bodies and five answer sequences** under the same conservative comparison.
- The README promises more than 100 questions per Grammar/Vocabulary MCQ grade/category, but current category sizes are **8–23**, depending on the bank and scope. Deduplicating MCQs was a good change; the claim was not updated.

**Impact:** children can memorise repeated patterns; large completion counters imply more coverage than the bank provides. Extra framing adds reading load without necessarily adding a new learning demand.

**Fix:** distinguish authored seeds, surface variants and review repetitions. Report seed-level coverage. Add varied contexts, contrasting structures and transfer questions; permit intentional spaced repetition without counting it as new curriculum coverage.

**Acceptance:** generated variants retain a stable seed ID, mastered coverage uses unique seeds, and marketing counts match the live banks.

### 13. Blend confirmation is recognition of a just-modelled word — P2

**Evidence:** `src/modes/blendConfirm.js` asks which word the child just read, immediately after the model. `app.js` commits the outcome as `EVIDENCE.INDEPENDENT` against that same word.

**Judgement:** hiding print and audio during the confirmation is a useful improvement. However, identifying a just-seen and just-heard word does not establish cold decoding or transfer. This is a measurement-design limitation, not a claim that the activity has no learning value.

**Fix:** retain confirmation as immediate recognition practice. Use an unmodelled, equivalent word or a delayed retrieval probe for decoding mastery. Record adult-observed oral decoding separately.

**Acceptance:** a learner cannot master a decoding stage solely by recognising recently demonstrated targets. Reports name the skill and evidence accurately.

### 14. Fluency and supported sound work still overclaim what was measured — P2

**Evidence:** `fluencySprintMode.js` speaks the target before the child chooses it, then displays **“Sprint mastered!”** and **words/min**. The evidence layer correctly caps it at guided, but the visible result is stronger than that evidence.

`soundCount.js` can play segmented/stretched speech when the setting is enabled, while the mode retains an independent evidence ceiling and the app's result classification does not include that setting.

**Fix:** label the sprint as speed of audio-to-print matching; do not equate it with oral reading WPM. Mark segmented prompts as supported. Offer untimed accuracy practice first, followed by a suitable transfer check.

**Acceptance:** the evidence recorded changes when support changes; displayed speed metrics say exactly what was timed.

### 15. Primary mastery merges different skills and evidence types — P2

**Evidence:** `questMastery.js` stores an exponential moving average without item diversity or evidence metadata. Its cross-quest aliases mix simple past with present/past continuous, comparatives with superlatives, and idioms with proverbs. Writing Quest sends heuristic pass/fail results into that same mastery service.

**Impact:** practice in a related skill can influence a recommendation for a skill that has not been demonstrated. One question in the six-item Quick Check is enough to create a category signal; it is insufficient for a secure judgement about that category.

**Fix:** use exact shared skill IDs only where tasks assess the same construct. Treat related skills as recommendation links, not interchangeable scores. Preserve grade, unique seed, attempt number, support, evidence source and timestamp. Label sparse results “early indication”.

**Acceptance:** success with comparatives cannot establish superlative mastery; heuristic writing feedback and self-reports cannot become independent evidence; confidence depends on varied samples and delayed success.

### 16. Comprehension Cloze and Listening have reporting gaps — P2

**Evidence:** `comprehensionClozeQuest.js` displays a score and records misconception feedback but does not record normal quest attempts/mastery or persistent passage completion. `listeningComp.js` keeps answers in module-local `_scores` and renders a result without a persistent attempt commit.

**Impact:** activity can disappear when leaving the section and may not contribute to the same dashboard activity counts as Grammar MCQ. A daily plan cannot consistently know what was completed.

**Fix:** use the shared attempt service once per committed answer and persist completion. Record first attempt, supports, retries and self-assessment separately. Do not repeatedly log a mistake whenever Check is pressed.

**Acceptance:** a completed session appears in the correct learner's report after reload; revealed answers do not count as independent successes.

### 17. Open-ended sections are too large and ignore the learner's grade — P2

**Browser evidence:** a synthetic P6 profile opens Visual Text at P1 with **63 answer boxes**, Open-ended Comprehension at P1 with **107**, and Situational Writing with **20**. All items are rendered together by `primaryPlaceholders.js`. The inspected mobile screens repeat the section title in the shell and body.

**Impact:** a child must scroll through unrelated grades, hold instructions in mind and locate the next task without a clear session boundary. A large DOM also raises performance and accessibility costs.

**Fix:** default to the profile's grade, show a short catalogue, and open one stimulus/passage/task at a time. Preserve scroll position and drafts. Provide visible question progress, Previous/Next, a review screen and a clear end.

**Acceptance:** a P6 child lands on P6; no previous-grade passage is in the default task flow; navigation works at 390 px and 200% text zoom.

### 18. Visual Text is largely text-only — P2

**Evidence:** `visualTextItems.js` stores posters as strings; `primaryPlaceholders.js` renders them inside `<pre>`. The mobile screenshot confirms a plain text notice, rather than a designed stimulus.

**Teacher impact:** this practises retrieving textual information but underrepresents meaning conveyed by layout, charts, visual hierarchy, images and graphic relationships. The official Paper 2 objectives include multimodal texts.

**Fix:** use semantic HTML for posters, menus, schedules, charts and forms. Include real visual relationships and appropriate alternative descriptions. Add MCQ-format practice where the activity is presented as preparation for the PSLE Visual Text component; keep open-response discussion as a separate learning mode.

**Acceptance:** questions assess at least some information conveyed visually, not only sentences from a transcript; accessible alternatives preserve equivalent information without disclosing the answer.

### 19. Writing feedback uses shallow text signals — P2

**Evidence:** `writingEvaluator.js` matches connectors with `lower.includes()`. The sentence pair **“The island was sandy. She forgot the ball.”** is credited with **and**, **or** and **as**, because those strings occur inside other words.

Length, word variety and stock narrative expressions also contribute to heuristic feedback. The file warns that this is not authoritative assessment, which is good; the reward/mastery paths must honour that limit.

**Fix:** use token/phrase boundaries and separate observable mechanics from judgement about meaning, organisation and task fulfilment. Prefer a small number of accurate revision suggestions over a pseudo-precise overall mark. Preserve planning, drafting, feedback and revision as the core learning loop.

**Acceptance:** substring examples produce no connector credit. Feedback says what was observed, teacher review is supported, and heuristic scores are not presented as PSLE composition marks or independent mastery.

### 20. Accessibility failures are real and broader than the current home scan — P2

**Browser evidence:**

- Existing Segment It test: serious colour-contrast failure on one node.
- Comprehension Cloze picker: critical `aria-required-children` violation. `.cc-quest__levels` has `role="list"` but its button children lack the required list-item structure.
- Situational Writing, Visual Text, Open-ended Comprehension and P6 practice-paper launcher: serious contrast failure at `.placeholder-paper-link`.

The 14-screen scan found no page JavaScript errors. Several screens passed axe at their landing state. That is useful evidence, not whole-application WCAG certification.

**Fix:** use ordinary list markup with buttons inside list items, or use an appropriate group instead of a false list role. Correct colour tokens rather than one-off screen overrides. Scan task, feedback, modal and result states in each theme; test focus after lazy loading and with text zoom.

**Acceptance:** serious/critical checks pass across these states; manual keyboard and screen-reader checks confirm sensible order and focus recovery.

### 21. Deployment can proceed independently of failing verification — P1

**Evidence:** `.github/workflows/deploy.yml` runs on pushes and performs dependency installation, syntax checking and a build. It does not depend on `.github/workflows/ci.yml`, which runs the unit and browser suites.

**Impact:** a successful build can be deployed even when CI finds a failed assessment regression or accessibility test. Branch-protection configuration was not inspected, so no assertion is made about protections outside these workflow files.

**Fix:** publish the exact verified artifact only after the required checks succeed. Use one workflow with an explicit dependency, or a carefully constrained successful-CI handoff for the same commit.

**Acceptance:** a deliberate failing test prevents the corresponding commit from being deployed.

### 22. Offline support and recovery need tighter guarantees — P2

**Evidence:** `public/sw.js` caches the shell and phonemes up front, but lazy modules on use. Opening an unvisited activity offline is therefore not guaranteed. Cache activation deletes every cache name except its own two names, rather than only obsolete PhonicsQuest caches; on a shared origin that can remove another app's cache. Unversioned audio uses cache-first behaviour under a manual cache version.

`store.js` tells a user with full storage to try clearing browser data, even though this app keeps progress locally.

**Fix:** advertise precisely which content is available offline; provide an explicit downloadable learning pack or precache manifest. Namespace cache cleanup, version audio, and recover from stale chunk loads. Offer a credential-free export before any suggestion to clear data.

**Acceptance:** first-install, offline revisit, unopened-module access and app-upgrade scenarios have defined behaviour; another app's caches survive; recovery instructions do not invite avoidable progress loss.

### 23. Daily analytics mix local midnight with UTC labels — P2

**Evidence:** `progressAnalytics.js::_startOfDay` uses local midnight; `_isoDay` converts that local-midnight timestamp to an ISO UTC date. In Singapore, that labels the preceding UTC date. The initial unit failure disappears in UTC and Asia/Singapore; environments west of UTC can place the fixture's `now` and later same-day UTC attempts into different local dates.

**Fix:** decide whether the chart is learner-local or UTC, then use that convention consistently. For parent-facing “today”, use local calendar keys and advance calendar dates rather than subtracting fixed 24-hour blocks across daylight-saving boundaries.

**Acceptance:** dates and buckets are correct under UTC, Asia/Singapore and a negative-offset zone, including local-midnight and DST boundaries. Test fixtures must express the intended timezone.

### 24. AI guardrails are inconsistent across features — P2

**Evidence:** general hints use the system-channel `askGiriConstrained` wrapper. Writing coaching, essay feedback and synthesis grading call the underlying AI service with task instructions and student content in a combined prompt; they use the cap/logging helpers but not the same system policy. Sanitising HTML and URLs does not establish instructional correctness or resistance to prompt injection.

**Fix:** create one structured AI request boundary for all child-facing features, with a common system policy, explicit task schemas, delimited learner input and validated output. Enforce synthesis constraints locally. Treat AI marks as suggestions and keep the authored offline path functional.

**Acceptance:** adversarial drafts cannot change the task or request unrelated output; malformed responses fail safely; no answer, score or report changes solely because unvalidated AI text says so. Live-provider behaviour remains a separate test requirement.

### 25. MOE alignment is not established — P2

**Evidence:** `SCOPE_AND_SEQUENCE.md` explicitly states that its Learning Outcomes are the application's own and that there is no external syllabus mapping. The MOE PDF retrieval was blocked during this audit, so no unverified MOE Learning Outcome number has been invented here.

**Fix:** build a teacher-approved crosswalk containing MOE Syllabus version, exact Learning Outcome reference, grade/band, prerequisite, activity, assessment evidence and review date. Keep PSLE component mapping separate from curriculum alignment: a Paper 2-style activity does not establish that the complete P1–P6 sequence matches the syllabus.

**Acceptance:** every alignment claim has an exact, reviewable source. Label the product's sequence as its own until that work is complete.

### 26. Engineering debt makes consistency expensive — P3

**Evidence:** `src/app.js` is 3,175 lines; `src/styles/main.css` is 18,871 lines; nine source files opt into TypeScript checking. There are parallel registries (`MODES` and `PHONICS_MODES`) and multiple progress models. Some quest timings are hard-coded, e.g. 2,000 ms in Cloze Castle and 1,500 ms for Word Vault success.

The separate Quest Journey prototype also derives a sound-match answer from the first character of a sample word: the digraph stage emits a “sh” prompt with **s** as the answer; long-a emits an a_e prompt with **c** from cake. Its blend builder splits ship into individual letters. No live-shell import of this prototype was found, so this is a **dormant-code risk**, not a confirmed defect in the current main route.

**Fix:** converge on one typed content schema, one evidence-aware attempt API, one navigation contract and one design-token system. Remove or clearly quarantine prototype pathways. Replace invented timings with measured durations or null. Refactor by behavioural boundary rather than undertaking a cosmetic rewrite.

**Acceptance:** schema validation enforces contracts at build time; parallel registries cannot disagree; reports never interpret a placeholder duration as observed learner speed.

## Section-by-section teaching and design verdict

The table links each section to the detailed findings rather than implying every section needs a rebuild.

| Section                                  | What is working                                                                               | Main issue or next teaching/design step                                                                                                                     | Audit outcome                                          |
| ---------------------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Profile creation / onboarding            | Distinct preschool and primary pathways; short entry flow                                     | Isolate every learner record and keep adult setup separate from child tasks (4–6)                                                                           | Fix before shared-device use                           |
| Preschool placement                      | Broader literacy screening; explicit adult-scored probes and pseudowords                      | Make adult presence clear; report uncertainty; recheck unfamiliar vocabulary before inferring a phonics gap                                                 | Useful supervised screener; not a validated diagnostic |
| Primary Quick Check                      | Optional six-item entry check; generates immediate practice suggestions                       | One response per category is sparse; avoid declaring strengths or moving grade expectations confidently (15)                                                | Use as an initial recommendation                       |
| Today / guided lesson                    | Warm-up, teach, practice and review are composed into a coherent session                      | Completion and recommendations inherit recording/mastery inconsistencies (3, 15–16)                                                                         | Strong direction; fix data foundation                  |
| Learn / Extra / Grown-ups                | Clearer separation of activities and adult functions                                          | Keep one main child action; grade-aware entry should be consistent across modules (17)                                                                      | Retain, simplify inconsistencies                       |
| Letter Sounds / Sound Hunt               | Direct sound-to-print practice; explicit mini-lessons                                         | Correct phoneme/audio identity and distinguish effect sounds from instruction (7–8)                                                                         | Teacher audio/content sign-off needed                  |
| First / Last / Middle Sound              | Print can be withheld; stages and distractors are constrained                                 | Use canonical phoneme identity; picture vocabulary must be familiar; support should alter evidence                                                          | Retain with sound/evidence fixes                       |
| Oral Blend / Oral Segment / Count Sounds | Sound-first tasks and counting support                                                        | Count is not the same as independently producing every phoneme; segmented audio is support (14)                                                             | Report the actual subskill                             |
| Train / Odd One Out                      | Child-friendly repeated sound discrimination                                                  | Ensure all picture names are unambiguous; include an adult oral-language check                                                                              | Useful warm-up; transfer check needed                  |
| Count Words / Clap Syllables             | Separates larger spoken units from letters                                                    | Model examples first; avoid reporting these as phoneme mastery                                                                                              | Retain as phonological-awareness practice              |
| Blend It / Listen & Blend                | Explicit modelling and careful confirmation concealment                                       | Immediate same-word recognition is labelled independent decoding (13)                                                                                       | Keep teaching; revise assessment                       |
| Hear & Choose                            | Clear listening-to-print task; evidence cap is guided                                         | Labels should remain recognition/matching rather than unaided reading                                                                                       | Suitable supported practice                            |
| Segment It / Missing Sound               | Sound boxes and interactive manipulation                                                      | Segment It fails contrast; phoneme identity and supported attempts require attention (7, 20)                                                                | Fix before accessibility sign-off                      |
| Listen & Spell                           | Genuine encoding sequence; count then construct; browser flow and accessibility checks passed | Canonical sound mapping still applies; extend independent written transfer beyond a constrained tile bank                                                   | One of the stronger core activities                    |
| Word Sort                                | Pattern comparison can make sound/spelling relationships explicit                             | Check unseen-word transfer; avoid success from purely visual tile matching                                                                                  | Useful practice, not sufficient mastery alone          |
| Read & Tap / Fluency Sprint              | Engaging short recognition practice; guided evidence cap exists                               | Audio-supplied target and words/min/mastered language conflict (14)                                                                                         | Rename/reframe the metric                              |
| Sight Words / LSCWC                      | Tricky-part highlighting; sentence/story links; spelling routine                              | Shared LSCWC statistics; ensure every spelling part and pronunciation is accurately taught (4, 7)                                                           | Retain with profile/audio fixes                        |
| Giri Stories / Read to Giri              | 69 stories, four bands, word preparation and gentle speech-recognition feedback               | Shared storage; readiness should reflect actual taught code; ASR is a prompt for review, not a pronunciation mark                                           | Strong supported-reading resource                      |
| Story decodability                       | Automated word-count and allowance checks; transparent metadata                               | Low raw ratios in Band A include proper names, HFWs and taught sight words—not automatically errors; verify those words were actually taught for this child | Keep validator, add learner-specific checks            |
| Grammar MCQ                              | Compact grade-aware start screen; first-attempt handling and review lane                      | Ambiguous tense/article items and overbroad rules (10–11)                                                                                                   | Editorial pass required                                |
| Vocabulary MCQ                           | Contextual practice and banded categories                                                     | Some implausible distractors and underconstrained stems; several categories reuse upper-level pools across grades                                           | Review difficulty and uniqueness                       |
| Cloze Castle                             | Passage-level grammar practice with clue and review support                                   | Repeated passage bodies, occasional weak auto-generated clue spans, all-or-nothing passage mastery (12, 15)                                                 | Improve seeds and per-blank evidence                   |
| Word Vault                               | Definitions, parts of speech and context clues                                                | Inflated variant counts; question depth differs from vocabulary breadth (12)                                                                                | Improve transfer and honest counts                     |
| Comprehension Cloze                      | Typed open responses, accepted alternates supported                                           | Valid alternatives missing; only three passages per grade; missing normal attempt persistence; invalid ARIA list (11, 16, 20)                               | Expand after correctness fixes                         |
| Sentence Forge                           | Word order and combining offer a useful bridge to writing                                     | Generated framing does not guarantee new learning; follow reconstruction with an independent sentence                                                       | Retain, diversify authored content                     |
| Synthesis & Transformation               | Dedicated sessions, patterns and corrective teaching                                          | Required-opening bypass and inaccurate inversion guidance (9–10)                                                                                            | High-priority correction                               |
| Editing Quest                            | Identifies specific errors and gives rule-based feedback                                      | Overbroad rules can teach a second error while correcting the first (10)                                                                                    | Centralise approved rules                              |
| Writing Quest                            | Draft persistence, planning, revision and feedback cycle                                      | Shallow heuristic signals and inappropriate mastery use (15, 19)                                                                                            | Good writing workshop; not an examiner                 |
| Situational Writing                      | Purpose, audience and model responses are present                                             | Twenty tasks rendered together; self-mark inflation; correct P6 format/marks (1, 3, 17)                                                                     | Teacher-led formative use                              |
| Visual Text                              | Varied text types and question intentions                                                     | Text-only stimuli, open-response rather than exam MCQ loop, all-grade scroll and self-mark problems (3, 17–18)                                              | Needs a dedicated learner flow                         |
| Open-ended Comprehension                 | Learner must respond before seeing the model; paraphrase disclaimer                           | Keyword overlap is not idea understanding; 107 boxes rendered; self-mark inflation (3, 17)                                                                  | Keep model comparison; add teacher judgement           |
| Listening Comprehension                  | Purpose-written MCQ sets, replay and explanatory feedback                                     | Defaults to P3; results not persisted; unlimited listening is practice, not exam simulation                                                                 | Separate teaching and exam conditions                  |
| P1–P3 practice papers                    | Interactive practice/test separation; P3 availability is explicitly limited to three terms    | Local school assessment formats vary; shared open-answer grader still needs review (2)                                                                      | Label as app-authored practice                         |
| P4–P5 practice papers                    | Wider English components and feedback links                                                   | Share scoring weaknesses; do not infer official whole-paper alignment from section names                                                                    | Audit every mark scheme before assessment use          |
| P6 / Exam Practice Hub                   | Timed mode and final feedback structure exist                                                 | Wrong PSLE blueprint and unreliable open-answer marking (1–2)                                                                                               | Relabel immediately; rebuild assembly                  |
| Review Lane / Mistakes Den               | Stable MCQ seed identity and delayed recovery design                                          | Correct source answers first; recommendation precision depends on skill/evidence model                                                                      | Preserve and strengthen                                |
| Rewards / badges / streaks               | Practice motivation and short-session structure                                               | Some badges are global; do not turn reward clicks or heuristic completion into mastery                                                                      | Keep effort rewards distinct                           |
| Parent report / class snapshot           | Actionable summaries; browser tests confirm class read does not move active profile           | Input records can still be incomplete, inflated or shared; expose sample size and evidence type                                                             | Data integrity before stronger claims                  |
| Settings / AI / export / offline         | Offline authored content, configurable features and export exist                              | Audio coupling, key export, privacy mismatch and cache issues (5–8, 22–24)                                                                                  | Prioritise reliability and disclosure                  |

## Recommended teaching loop

Apply one consistent loop across modules:

1. **Learning Outcome:** one plain-language skill goal, mapped to the MOE Syllabus only where verified.
2. **Model:** a short teacher-approved example. Mark this as exposure.
3. **Guided practice:** prompts and feedback with the support recorded.
4. **Independent attempt:** a fresh item before hints or a model answer.
5. **Feedback:** identify the relevant sound, clue or rule; do not merely display the answer.
6. **Transfer:** a different word, sentence or passage using the same skill.
7. **Delayed review:** revisit the skill later with a new surface form.

For younger learners, use spoken instructions and familiar vocabulary so the language of the task does not hide the phonics skill. For primary learners, offer a short scaffolded version and two extension choices: **Try This!** with reduced support, then **Try This!** with a new context or self-generated response. These are design recommendations, not claims that difficulty is currently calibrated.

## Suggested implementation order

| Order | Work package                                                                                                       | Owner perspective               | Release condition                                                             |
| ----- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------- | ----------------------------------------------------------------------------- |
| 1     | Correct PSLE labels; disable unjustified automatic marks; prevent repeated self-mark mastery; strip export secrets | Teacher + developer             | Reproductions no longer produce misleading scores or credential-bearing files |
| 2     | Isolate learner storage, correct phoneme mappings, separate SFX and teaching voice                                 | Developer + phonics teacher     | Two-profile regression and teacher audio review pass                          |
| 3     | Editorial pass on ambiguous items, synthesis constraints and teaching rules                                        | Teacher + content engineer      | Reviewed answer keys and contrastive examples for every affected scope        |
| 4     | Unify attempts, evidence, grade and seed identity; connect cloze/listening reports                                 | Developer + assessment designer | Reports distinguish guided, independent, verified and self-assessed evidence  |
| 5     | Repair accessibility and grade-aware one-task navigation; fix deployment gating                                    | Developer + edtech designer     | Browser checks pass; failing verification blocks deployment                   |
| 6     | Build verified PSLE blueprints and an explicit MOE Learning Outcomes crosswalk                                     | Curriculum lead + developer     | Versioned source-backed schemas and teacher-reviewed mark schemes             |
| 7     | Increase genuinely distinct content, measure learning transfer and refactor hotspots                               | Product + engineering           | New content expands skills/contexts rather than just displayed counts         |

## Practical release checks

- A correct paraphrase is not marked wrong solely for differing from a model answer.
- A single keyword cannot earn a multi-part explanation mark.
- A required synthesis opening cannot be bypassed by an equivalent but differently structured sentence.
- Repeated clicks cannot increase attempts, XP or mastery for one committed response.
- Switching learners isolates stories, preparation, spelling, badges, drafts and review history.
- Exported progress contains no API credentials; restore preserves learner work.
- Turning off sound effects does not remove the stimulus needed to answer.
- A displayed “mastered” status has varied independent evidence and a clear denominator.
- Each PSLE practice paper declares its exam version and passes the official blueprint check.
- The same checked commit and artifact are the ones deployed.

## Source map

All repository evidence refers to the pinned commit above. Links below open that exact version.

| Area                              | Pinned repository sources                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Curriculum and alignment          | [src/data/curriculum.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/curriculum.js), [SCOPE_AND_SEQUENCE.md](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/SCOPE_AND_SEQUENCE.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Phonics and audio                 | [src/data/words.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/words.js), [src/modules/audio.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/audio.js), [src/data/lessons/phonicsLessons.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/lessons/phonicsLessons.js)                                                                                                                                                                                                                                                                                                                                                                                                        |
| Evidence and mastery              | [src/modules/evidence.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/evidence.js), [src/modules/questMastery.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/questMastery.js), [src/modes/openResponse.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/openResponse.js), [src/modes/blendConfirm.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/blendConfirm.js), [src/app.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/app.js)                                                                                                                    |
| Paper content and grading         | [src/data/p6PracticeTests.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/p6PracticeTests.js), [src/modes/primaryPracticeTest.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/primaryPracticeTest.js), [src/modes/scoring/shortAnswerGrader.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/scoring/shortAnswerGrader.js), [src/modes/placeholderMeta.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/placeholderMeta.js)                                                                                                                                                                                         |
| MCQ content and rules             | [src/data/grammarMcq.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/grammarMcq.js), [src/data/vocabMcq.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/vocabMcq.js), [src/data/grammarTips.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/grammarTips.js), [src/modes/editingQuest.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/editingQuest.js)                                                                                                                                                                                                                                                               |
| Synthesis                         | [src/data/synthesisItems.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/synthesisItems.js), [src/modes/synthesisQuest.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/synthesisQuest.js)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Cloze and sentence content        | [src/data/passages.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/passages.js), [src/data/vocabPassagesExtra/generator.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/vocabPassagesExtra/generator.js), [src/data/sentences.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/sentences.js), [src/data/comprehensionClozePassages.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/comprehensionClozePassages.js)                                                                                                                                                                                                     |
| Open response and visual text     | [src/modes/primaryPlaceholders.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/primaryPlaceholders.js), [src/data/visualTextItems.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/data/visualTextItems.js), [src/modes/scoring/ideaOverlap.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/scoring/ideaOverlap.js)                                                                                                                                                                                                                                                                                                                                                                |
| Writing and listening             | [src/modules/writingEvaluator.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/writingEvaluator.js), [src/modes/writingQuest.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/writingQuest.js), [src/modes/listeningComp.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/listeningComp.js), [src/modes/comprehensionClozeQuest.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/comprehensionClozeQuest.js)                                                                                                                                                                                                       |
| Profiles and data                 | [src/modules/profiles.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/profiles.js), [src/modules/store.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/store.js), [src/modes/storyMode.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/storyMode.js), [src/modes/lscwcDrill.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modes/lscwcDrill.js), [src/modules/badges.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/badges.js)                                                                                                                      |
| AI and privacy                    | [public/privacy.html](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/public/privacy.html), [src/modules/aiConfig.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/aiConfig.js), [src/modules/aiProviders.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/aiProviders.js), [src/modules/aiService.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/aiService.js), [src/modules/aiGuardrails.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/aiGuardrails.js)                                                                                                  |
| Build, deployment and maintenance | [public/sw.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/public/sw.js), [.github/workflows/ci.yml](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/.github/workflows/ci.yml), [.github/workflows/deploy.yml](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/.github/workflows/deploy.yml), [tsconfig.json](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/tsconfig.json), [src/modules/progressAnalytics.js](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/src/modules/progressAnalytics.js), [README.md](https://github.com/RiceTogether17/phonicsquest/blob/79dff3720015ef813eb41ed29c0ed02a60abc2ad/README.md) |

External assessment reference: [SEAB: PSLE formats examined in 2026](https://www.seab.gov.sg/psle/psle-formats-examined-in-2026/), with the linked English Language specification used for the comparison. No external MOE Learning Outcome identifier has been assumed.
