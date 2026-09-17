# PhonicsQuest — Scope & Sequence

> **Generated file — do not edit by hand.**
> `node scripts/gen-scope-sequence.mjs` rebuilds it from the curriculum
> data, and `src/__tests__/scopeSequence.test.js` fails when the committed
> copy has gone stale. Everything below is read out of the running code, so
> it describes the app as it actually behaves rather than as anyone remembers
> it.

## How to read this

The app teaches **two pre-phases** (no print, then letters and their sounds)
followed by **ten phonics phases**, each split into stages. A stage is the
unit a child is placed into and practises; a phase is the group of stages
that share a code layer.

Three separate things gate a child's progress, and it is worth keeping them
apart when auditing:

1. **Code release** — which graphemes a stage is allowed to use. Stories are
   validated against this cumulatively (`decodability.js`), so a text can
   never ask for a spelling the child has not met.
2. **Mastery** — the accuracy bar a stage must clear.
3. **Evidence** — *how* the answer was obtained. Practice the app modelled or
   hinted does not count toward mastery; see `evidence.js`.

## The progression gate

A stage unlocks when its prerequisite clears **all** of these
(`progression.js`):

| Criterion | Bar |
| --- | --- |
| Decoding accuracy (independent attempts only) | 85% |
| Spelling / encoding accuracy | 80%, once 6 attempts exist |
| Unique words attempted in the prerequisite group | 12 (or 75% of a small group) |
| Separate practice days | 2 |
| No major vowel confusion | within 20% of sibling vowels |

Any criterion that passes only because data is missing is marked
*provisional*, and a provisional pass caps the stage at "ready to explore"
rather than "mastered". The gate deliberately separates **may advance** from
**has demonstrated**.

---

## Before print

### Step 0a — Phonemic Awareness

Hearing sounds in spoken words — first, last and middle sounds, clapping syllables, blending sounds by ear. No letters yet.

- **Learning outcome:** Hear, count and play with the individual sounds inside spoken words: isolate first/last/middle sounds and orally blend three sounds into a word.
- **Targets:** first sound isolation, last sound isolation, middle sound isolation, oral blending, syllable clapping, word counting
- **Examples:** cat (/k/ /a/ /t/), sun (/s/ /u/ /n/), map (/m/ /a/ /p/), ti-ger (2 claps), ba-na-na (3 claps)
- **Modes:** first, last, middle, oralBlend, soundCount, oralSegment, syllable, wordCount, oddOneOut, train
- **Mastery bar:** 80% over 6 attempts

### Step 0b — Letter Sounds

Matching each letter to the sound it makes — s says /s/, a says /ă/ — so sounds can be read from print.

- **Learning outcome:** Say the most common sound for each single letter quickly and pick the letter that matches a spoken sound.
- **Targets:** s /s/, a /ă/, t /t/, p /p/, i /ĭ/, n /n/, m /m/, d /d/, … (19 total)
- **Examples:** s → sun, a → apple, t → top, p → pig, i → ink, n → net
- **Modes:** letterSounds, soundHunt, hear
- **Mastery bar:** 80% over 6 attempts

---

## Phonics phases

### Phase 1 — CVC

Simple 3-sound short-vowel words (cat, hen, big, dog, bug).

**Learning outcome.** Decode any short-vowel consonant–vowel–consonant word in isolation and in a simple sentence.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `cvc-a` | CVC – Short A | short a /ă/ | cat, hat, map, bat, ran, … (8 total) | — | — (entry stage) |
| `cvc-e` | CVC – Short E | short e /ĕ/ | bed, leg, ten, hen, pen, … (8 total) | 70% | `cvc-a` |
| `cvc-i` | CVC – Short I | short i /ĭ/ | bit, tip, dip, pig, win, … (8 total) | 70% | `cvc-e` |
| `cvc-o` | CVC – Short O | short o /ŏ/ | hop, dog, top, pot, fox, … (8 total) | 70% | `cvc-i` |
| `cvc-u` | CVC – Short U | short u /ŭ/ | bug, cup, run, sun, mud, … (8 total) | 70% | `cvc-o` |
| `cvc-mixed` | CVC – Mixed Vowels | short a /ă/, short e /ĕ/, short i /ĭ/, short o /ŏ/, … (5 total) | mat, fed, dig, fog, dug, … (8 total) | 70% | `cvc-u` |

### Phase 2 — CCVC

Two consonants at the start before the vowel (flat, step, drip, drum).

**Learning outcome.** Decode and spell short-vowel words that begin with an l-, r-, or s-blend.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `ccvc-a` | CCVC – Short A | bl, cl, fl, pl, … (18 total) | flat, clap, trap, plan, snap, … (8 total) | 70% | `cvc-mixed` |
| `ccvc-e` | CCVC – Short E | st-, fr-, sl-, sp-, … (5 total) | step, fret, sled, fled, spell, … (8 total) | 70% | `ccvc-a` |
| `ccvc-i` | CCVC – Short I | fl-, tr-, dr-, sl-, … (6 total) | flip, trip, drip, slip, swim, … (8 total) | 70% | `ccvc-e` |
| `ccvc-o` | CCVC – Short O | fl-, dr-, st-, sl-, … (5 total) | flop, drop, stop, slot, plot, … (8 total) | 70% | `ccvc-i` |
| `ccvc-u` | CCVC – Short U | dr-, sl-, st-, pl-, … (5 total) | drum, slug, stub, plum, blur, … (8 total) | 70% | `ccvc-o` |
| `ccvc-mixed` | CCVC – Mixed Vowels | short a /ă/, short e /ĕ/, short i /ĭ/, short o /ŏ/, … (5 total) | slam, bled, slim, clog, stud, … (8 total) | 70% | `ccvc-u` |

### Phase 3 — CVCC

Two consonants at the end after the vowel (band, belt, gift, song, jump).

**Learning outcome.** Decode and spell short-vowel words that end in a consonant blend.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `cvcc-a` | CVCC – Short A | -nd, -st, -mp, -nk, … (6 total) | band, bank, camp, hand, sand, … (8 total) | 70% | `ccvc-mixed` |
| `cvcc-e` | CVCC – Short E | -lt, -st, -nd, -nt, … (5 total) | belt, best, bend, melt, vent, … (8 total) | 70% | `cvcc-a` |
| `cvcc-i` | CVCC – Short I | -ft, -lk, -st, -nt, … (5 total) | gift, milk, list, hint, lift, … (8 total) | 70% | `cvcc-e` |
| `cvcc-o` | CVCC – Short O | -nd, -ng, -st, -nk | bond, song, lost, long, cost, … (8 total) | 70% | `cvcc-i` |
| `cvcc-u` | CVCC – Short U | -mp, -st, -ng, -nt | jump, dust, lung, hunt, dump, … (8 total) | 70% | `cvcc-o` |
| `cvcc-mixed` | CVCC – Mixed Vowels | short a /ă/, short e /ĕ/, short i /ĭ/, short o /ŏ/, … (5 total) | land, lend, fist, fond, gust, … (8 total) | 70% | `cvcc-u` |

### Phase 4 — Digraphs

Two letters making one sound — sh, ch, th, wh, ck, ng.

**Learning outcome.** Recognise that two letters can make one sound, and decode digraph words in connected text.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `digraphs` | Digraphs | sh /ʃ/, ch /tʃ/, th /θ/, th /ð/, … (7 total) | ship, chip, that, when, sing, … (10 total) | 70% | `cvcc-mixed` |

### Phase 5 — CCVCC

Blends at both ends of the word (stamp, blend, print, stomp, stump).

**Learning outcome.** Decode and spell short-vowel words with blends at both the start and the end.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `ccvcc-a` | CCVCC – Short A | stCC-mp, clCC-, blCC-st, brCC-nd | stamp, clamp, plank, brand, prank, … (8 total) | 70% | `digraphs` |
| `ccvcc-e` | CCVCC – Short E | blCC-nd, trCC-nd, crCC-st, spCC-nt | blend, trend, crest, spent, swept, … (8 total) | 70% | `ccvcc-a` |
| `ccvcc-i` | CCVCC – Short I | blCC-nk, drCC-nk, prCC-nt, swCC-ft | blink, drink, print, swift, sprint, … (8 total) | 70% | `ccvcc-e` |
| `ccvcc-o` | CCVCC – Short O | stCC-mp, prCC-ng, frCC-st, flCC-ss | stomp, prong, blond, frost, floss, … (8 total) | 70% | `ccvcc-i` |
| `ccvcc-u` | CCVCC – Short U | stCC-mp, clCC-mp, blCC-nt, grCC-nt | stump, clump, blunt, grunt, trust, … (8 total) | 70% | `ccvcc-o` |
| `ccvcc-mixed` | CCVCC – Mixed Vowels | short a /ă/, short e /ĕ/, short i /ĭ/, short o /ŏ/, … (5 total) | bland, spend, clink, frond, slump, … (8 total) | 70% | `ccvcc-u` |

### Phase 6 — Long Vowels

Long vowel patterns — split digraphs (a_e), vowel teams (ai, ee, oa) and word-end patterns (ay, ow, y).

**Learning outcome.** Decode long-vowel words across the major spelling patterns and choose the right pattern when spelling.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `long-a-ae` | Long A · a_e | a_e /eɪ/ | cake, name, late, bake, lake, … (8 total) | 70% | `ccvcc-mixed` |
| `long-a-ai` | Long A · ai | ai /eɪ/ | rain, tail, sail, paid, train, … (8 total) | 70% | `long-a-ae` |
| `long-a-ay` | Long A · ay | ay /eɪ/ | play, day, way, say, may, … (8 total) | 70% | `long-a-ai` |
| `long-e-ee` | Long E · ee | ee /iː/ | tree, feet, see, bee, week, … (8 total) | 70% | `long-a-ay` |
| `long-e-ea` | Long E · ea | ea /iː/ | beat, sea, dream, beach, leaf, … (8 total) | 70% | `long-e-ee` |
| `long-i-ie` | Long I · i_e | i_e /aɪ/ | kite, like, time, ride, smile, … (8 total) | 70% | `long-e-ea` |
| `long-i-igh` | Long I · igh | igh /aɪ/ | night, light, right, might, sight, … (8 total) | 70% | `long-i-ie` |
| `long-i-y` | Long I · y | y /aɪ/ | cry, try, fly, my, sky, … (8 total) | 70% | `long-i-igh` |
| `long-o-oe` | Long O · o_e | o_e /oʊ/ | home, hope, note, rope, vote, … (8 total) | 70% | `long-i-y` |
| `long-o-oa` | Long O · oa | oa /oʊ/ | boat, coat, road, soap, toad, … (8 total) | 70% | `long-o-oe` |
| `long-o-ow` | Long O · ow | ow /oʊ/ | snow, slow, low, mow, grow, … (8 total) | 70% | `long-o-oa` |
| `long-u-ue` | Long U · u_e | u_e /juː/, u_e /uː/ | cube, tube, rule, mule, cute, … (8 total) | 70% | `long-o-ow` |
| `long-u-uue` | Vowel team /oo/ · ue | ue /uː/ | blue, true, glue, clue, sue, … (8 total) | 70% | `long-u-ue` |
| `long-u-ew` | Vowel team /oo/ · ew | ew /uː/ | new, few, drew, blew, flew, … (8 total) | 70% | `long-u-uue` |
| `long-u-oo` | Vowel team /oo/ · oo | oo /uː/ | moon, food, pool, room, soon, … (8 total) | 70% | `long-u-ew` |
| `short-oo` | Short oo /ʊ/ · oo | oo /ʊ/ | book, look, cook, hook, foot, … (8 total) | 70% | `long-u-oo` |

### Phase 7 — Diphthongs

Sliding vowel sounds — oi/oy, ou/ow and the aw pattern.

**Learning outcome.** Decode and spell words with diphthong vowel patterns and discriminate them by sound.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `dip-oi` | Diphthong · oi/oy | oi /ɔɪ/, oy /ɔɪ/ | coin, boy, soil, joy, boil, … (8 total) | 70% | `long-u-oo` |
| `dip-ou` | Diphthong · ou/ow | ou /aʊ/, ow /aʊ/ | out, cow, loud, town, found, … (8 total) | 70% | `dip-oi` |
| `dip-aw` | /aw/ pattern | aw /ɔː/, au /ɔː/ | paw, jaw, saw, dawn, lawn, … (8 total) | 70% | `dip-ou` |

### Phase 8 — Advanced

Mixed-blend review, r-controlled vowels (ar, or, er, ir, ur) and the late consonant spellings tch, dge and ph.

**Learning outcome.** Read mixed-blend words fluently and decode words where r changes the vowel sound.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `blends-review` | Blends Review | initial blends, final blends, both-end blends, tri-consonant blends (spr-, str-, scr-) | float, crisp, blend, sprint, plank, … (8 total) | 70% | `dip-aw` |
| `rc-ar-or` | Bossy R · ar & or | ar /ɑr/, or /ɔr/ | car, star, farm, park, corn, … (8 total) | 70% | `blends-review` |
| `rc-er-ir-ur` | Bossy R · er, ir & ur | er /ɜr/, ir /ɜr/, ur /ɜr/ | her, fern, bird, girl, turn, … (8 total) | 70% | `rc-ar-or` |
| `cons-tch-dge` | tch and dge | tch /tʃ/, dge /dʒ/ | catch, match, patch, fetch, pitch, … (8 total) | 70% | `rc-er-ir-ur` |
| `cons-ph` | ph says /f/ | ph /f/ | phone, graph, photo, dolphin, elephant, … (8 total) | 70% | `cons-tch-dge` |
| `cons-soft-cg` | Soft c and soft g | soft c /s/, soft g /dʒ/ | rice, cent, face, space, page, … (8 total) | 70% | `cons-ph` |

### Phase 9 — Suffixes

-ing, -ed, -er and -est on familiar base words.

**Learning outcome.** Read and spell words with -ing, -ed, -er and -est, hearing the suffix as a separate chunk.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `suffix-ing` | -ing Words | -ing /ɪŋ/ | running, jumping, sitting, eating, playing, … (8 total) | 70% | `cons-soft-cg` |
| `suffix-ed` | -ed Words | -ed /d/, -ed /t/, -ed /ɪd/ | jumped, helped, picked, played, walked, … (8 total) | 70% | `suffix-ing` |
| `suffix-er` | -er Words | -er /ɚ/ | grander, taller, bigger, smaller, slower, … (8 total) | 70% | `suffix-ed` |
| `suffix-est` | -est Words | -est /ɪst/ | grandest, tallest, biggest, smallest, slowest, … (8 total) | 70% | `suffix-er` |

### Phase 10 — Morphology & Fluency

Prefixes, advanced suffixes, multi-syllabic words and high-frequency irregular sight words.

**Learning outcome.** Read multi-syllable and morphologically complex words and recognise common irregular sight words on sight.

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
| `prefixes` | Prefixes (re-, un-) | re- /ri/, un- /ʌn/ | redo, untie, unwrap, rewrite, unzip, … (8 total) | 70% | `suffix-est` |
| `suffixes-advanced` | Advanced Suffixes (-tion, -able) | -tion /ʃən/, -able /əbl/ | action, nation, readable, station, lovable, … (8 total) | 70% | `prefixes` |
| `multisyllable` | Multi-syllabic Words | open syllable, closed syllable, consonant-le | science, market, energy, jungle, planet, … (8 total) | 70% | `suffixes-advanced` |
| `sight-highfreq` | High-frequency Sight Words | irregular sight | their, because, enough, through, friend, … (8 total) | 70% | `multisyllable` |

---

## Code release (what a text may use)

Stories are validated against a cumulative grapheme release, so a text can
never ask for a spelling the child has not met. `tier` is the coarse
release; the budget is the teaching stage inside it.

| Story phase | Tier | Budget it adds | Tricky-word cutoff (curriculum phase) |
| --- | --- | --- | --- |
| `short-a` | 1 | short vowels: a | 2 |
| `short-ei` | 1 | short vowels: a, e, i | 2 |
| `short-ou` | 1 | short vowels: a, e, i, o, u | 2 |
| `mixed-short` | 1 | short vowels: a, e, i, o, u | 4 |
| `short-digraphs` | 1 | short vowels: a, e, i, o, u | 4 |
| `long-a` | 2 | a_e, ai, ay | 6 |
| `long-e` | 2 | ee, ea, e_e | 6 |
| `long-i` | 2 | i_e, igh, ie, y | 6 |
| `long-o` | 2 | o_e, oa, ow | 6 |
| `long-u` | 2 | u_e, ue, ew, oo | 6 |
| `r-controlled` | 3 | ar, or, er, ir, ur | 8 |
| `digraphs` | 3 | tch, dge, ph | 8 |
| `suffixes` | 3 |  | 9 |
| `diphthongs` | 4 | oi, oy, ou | 7 |
| `advanced-vowel` | 5 | aw, au, air, are, ear, eer, ere | 9 |
| `chapter` | 5 | — (full tier) | 10 |
| `extension-sg` | 5 | — (full tier) | 10 |

### Story bands

| Band | Length | High-frequency word cap | Stories |
| --- | --- | --- | --- |
| A | 25–45 words | tier 1 | 16 |
| B | 45–80 words | tier 2 | 24 |
| C | 80–140 words | tier 3 | 13 |
| D | 140–250 words | tier 3 | 16 |

**The guarantee:** every word in every story is readable by some taught
route — decodable at the story's phase, a high-frequency word within its
tier, a tricky word already introduced, or a pre-taught sight word. There are
**zero** unsupported words in the bank, enforced by
`storyDecodability.test.js` ("the core promise").

---

## What this document does not claim

Stated plainly, because a scope and sequence that oversells itself is worse
than none:

- **No external syllabus mapping yet.** Per-item `learningOutcome` /
  `component` metadata (VALIDITY_ROADMAP 3.6) is not built, so nothing here
  is keyed to MOE or any other published syllabus. The learning outcomes
  above are the app's own.
- **No evidence-base citations.** The design follows cumulative synthetic
  phonics practice — code released in a fixed order, texts controlled to it,
  reading and spelling taught together — but this file cites no studies, and
  inventing citations would be worse than omitting them.
- **No per-stage word counts.** A stage's pool is computed at run time —
  structural stages such as `cvc-a` are filtered out of the bank by word
  shape, not by a matching group name — so a count printed here would be
  wrong for most stages. `sampleWords` above shows what each stage holds.
- **The sequence is not yet single-sourced.** VALIDITY_ROADMAP 1.1 records
  that curriculum phases, story tiers and placement phases are separate
  ordered lists that agree by construction and test rather than by deriving
  from one codebook. This document is generated from them, so it reflects
  that split honestly rather than hiding it.
