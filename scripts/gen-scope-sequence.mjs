/**
 * Generate SCOPE_AND_SEQUENCE.md from the curriculum data.
 *
 * VALIDITY_ROADMAP 3.6 asks for syllabus alignment that is *auditable*. A
 * hand-written scope and sequence is not: it is a claim about the code that
 * drifts the moment a stage moves, and a curriculum specialist reading it
 * has no way to tell whether it still describes the app their child is
 * using.
 *
 * So this derives the document from `curriculum.js`, `decodability.js` and
 * `progression.js` instead of restating them. Every phase, stage, target
 * sound, sample word, mastery bar and gate criterion in the output is read
 * out of the running code. `scopeSequence.test.js` regenerates it and fails
 * when the committed file has gone stale, which is what makes it a
 * guarantee rather than a document.
 *
 * Usage:  node scripts/gen-scope-sequence.mjs [--check]
 *   --check  exit non-zero when the committed file differs (used by tests/CI)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PHASES, PRE_PHASES, CURRICULUM } from '../src/data/curriculum.js';
import { STORY_PHASES, BAND_RULES } from '../src/modules/decodability.js';
import { PROGRESSION_GATE } from '../src/modules/progressionGate.js';
import { STORIES } from '../src/data/stories.js';

/**
 * Percentages are the numbers a specialist will check against the code, so a
 * missing constant has to fail the build rather than render something
 * plausible. A silently wrong figure in this file is worse than no file.
 */
const pct = (n) => {
  if (typeof n !== 'number' || Number.isNaN(n)) {
    throw new Error(`scope/sequence: expected a number, got ${n}`);
  }
  return `${Math.round(n * 100)}%`;
};
const list = (xs, max = 8) => {
  const arr = (xs ?? []).map(String);
  const head = arr.slice(0, max).join(', ');
  return arr.length > max ? `${head}, … (${arr.length} total)` : head || '—';
};

function header() {
  return `# PhonicsQuest — Scope & Sequence

> **Generated file — do not edit by hand.**
> \`node scripts/gen-scope-sequence.mjs\` rebuilds it from the curriculum
> data, and \`src/__tests__/scopeSequence.test.js\` fails when the committed
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
   validated against this cumulatively (\`decodability.js\`), so a text can
   never ask for a spelling the child has not met.
2. **Mastery** — the accuracy bar a stage must clear.
3. **Evidence** — *how* the answer was obtained. Practice the app modelled or
   hinted does not count toward mastery; see \`evidence.js\`.

## The progression gate

A stage unlocks when its prerequisite clears **all** of these
(\`progression.js\`):

| Criterion | Bar |
| --- | --- |
| Decoding accuracy (independent attempts only) | ${pct(PROGRESSION_GATE.MIN_DECODING_ACCURACY)} |
| Spelling / encoding accuracy | ${pct(PROGRESSION_GATE.MIN_SPELLING_ACCURACY)}, once ${PROGRESSION_GATE.MIN_SPELLING_ATTEMPTS} attempts exist |
| Unique words attempted in the prerequisite group | ${PROGRESSION_GATE.MIN_UNIQUE_WORDS} (or ${pct(PROGRESSION_GATE.GROUP_SIZE_FRACTION)} of a small group) |
| Separate practice days | ${PROGRESSION_GATE.MIN_SESSION_DAYS} |
| No major vowel confusion | within ${pct(PROGRESSION_GATE.MAX_VOWEL_CONFUSION_GAP)} of sibling vowels |

Any criterion that passes only because data is missing is marked
*provisional*, and a provisional pass caps the stage at "ready to explore"
rather than "mastered". The gate deliberately separates **may advance** from
**has demonstrated**.
`;
}

function prePhaseSection() {
  const rows = PRE_PHASES.map(
    (p) => `### ${p.label}

${p.description}

- **Learning outcome:** ${p.learningOutcome}
- **Targets:** ${list(p.targetSounds)}
- **Examples:** ${list(p.sampleWords, 6)}
- **Modes:** ${list(p.recommendedModes, 12)}
- **Mastery bar:** ${pct(p.masteryCriteria.accuracy)} over ${p.masteryCriteria.minAttempts} attempts`,
  ).join('\n\n');

  return `\n---\n\n## Before print\n\n${rows}\n`;
}

function phaseSection() {
  const byPhase = new Map();
  for (const stage of CURRICULUM) {
    if (!byPhase.has(stage.phase)) byPhase.set(stage.phase, []);
    byPhase.get(stage.phase).push(stage);
  }

  const blocks = PHASES.filter((p) => typeof p.phase === 'number').map((phase) => {
    const stages = byPhase.get(phase.phase) ?? [];
    const stageRows = stages
      .map((s) => {
        const prereq = s.prerequisite ? `\`${s.prerequisite}\`` : '— (entry stage)';
        // The entry stage has no prerequisite, so its `requiredMastery: 0`
        // is the absence of a gate, not a zero bar. Printing "0%" would
        // read as a mistake in the one document meant to be checkable.
        const bar = s.prerequisite ? pct(s.requiredMastery ?? s.masteryCriteria.accuracy) : '—';
        return `| \`${s.id}\` | ${s.name} | ${list(s.targetSounds, 4)} | ${list(s.sampleWords, 5)} | ${bar} | ${prereq} |`;
      })
      .join('\n');

    return `### ${phase.label}

${phase.description}

**Learning outcome.** ${phase.learningOutcome}

| Stage | Name | Target sounds | Sample words | Mastery to pass | Prerequisite |
| --- | --- | --- | --- | --- | --- |
${stageRows || '| — | _no stages_ | | | | |'}`;
  });

  return `\n---\n\n## Phonics phases\n\n${blocks.join('\n\n')}\n`;
}

function codeReleaseSection() {
  const rows = STORY_PHASES.map((p) => {
    const budget = p.shortVowels
      ? `short vowels: ${p.shortVowels.split('').join(', ')}`
      : p.graphemeBudget
        ? p.graphemeBudget.join(', ')
        : '— (full tier)';
    return `| \`${p.id}\` | ${p.tier} | ${budget} | ${p.curriculumPhase} |`;
  }).join('\n');

  const bands = Object.entries(BAND_RULES)
    .map(([band, r]) => {
      const count = STORIES.filter((s) => s.band === band).length;
      return `| ${band} | ${r.min}–${r.max} words | tier ${r.hfwCap} | ${count} |`;
    })
    .join('\n');

  return `\n---\n\n## Code release (what a text may use)

Stories are validated against a cumulative grapheme release, so a text can
never ask for a spelling the child has not met. \`tier\` is the coarse
release; the budget is the teaching stage inside it.

| Story phase | Tier | Budget it adds | Tricky-word cutoff (curriculum phase) |
| --- | --- | --- | --- |
${rows}

### Story bands

| Band | Length | High-frequency word cap | Stories |
| --- | --- | --- | --- |
${bands}

**The guarantee:** every word in every story is readable by some taught
route — decodable at the story's phase, a high-frequency word within its
tier, a tricky word already introduced, or a pre-taught sight word. There are
**zero** unsupported words in the bank, enforced by
\`storyDecodability.test.js\` ("the core promise").
`;
}

function honestySection() {
  return `\n---\n\n## What this document does not claim

Stated plainly, because a scope and sequence that oversells itself is worse
than none:

- **No external syllabus mapping yet.** Per-item \`learningOutcome\` /
  \`component\` metadata (VALIDITY_ROADMAP 3.6) is not built, so nothing here
  is keyed to MOE or any other published syllabus. The learning outcomes
  above are the app's own.
- **No evidence-base citations.** The design follows cumulative synthetic
  phonics practice — code released in a fixed order, texts controlled to it,
  reading and spelling taught together — but this file cites no studies, and
  inventing citations would be worse than omitting them.
- **No per-stage word counts.** A stage's pool is computed at run time —
  structural stages such as \`cvc-a\` are filtered out of the bank by word
  shape, not by a matching group name — so a count printed here would be
  wrong for most stages. \`sampleWords\` above shows what each stage holds.
- **The sequence is not yet single-sourced.** VALIDITY_ROADMAP 1.1 records
  that curriculum phases, story tiers and placement phases are separate
  ordered lists that agree by construction and test rather than by deriving
  from one codebook. This document is generated from them, so it reflects
  that split honestly rather than hiding it.
`;
}

function build() {
  return [header(), prePhaseSection(), phaseSection(), codeReleaseSection(), honestySection()].join(
    '',
  );
}

/** Resolved lazily: under a test runner `import.meta.url` is not a file URL. */
function outPath() {
  return fileURLToPath(new URL('../SCOPE_AND_SEQUENCE.md', import.meta.url));
}

function main() {
  const out = outPath();
  const generated = build();

  if (process.argv.includes('--check')) {
    let current = '';
    try {
      current = readFileSync(out, 'utf8');
    } catch (_) {
      /* a missing file counts as stale */
    }
    if (current !== generated) {
      console.error('SCOPE_AND_SEQUENCE.md is stale — run: node scripts/gen-scope-sequence.mjs');
      process.exit(1);
    }
    console.log('SCOPE_AND_SEQUENCE.md is up to date.');
    return;
  }

  writeFileSync(out, generated);
  console.log(`Wrote ${out}`);
}

/**
 * Run ONLY as a CLI, never on import.
 *
 * `scopeSequence.test.js` imports `build()` to compare against the committed
 * file. If importing this module also wrote that file, the test would
 * regenerate the thing it is about to check and pass no matter what had
 * drifted — a staleness guard that guards nothing.
 */
if (process.argv[1]?.endsWith('gen-scope-sequence.mjs')) {
  main();
}

export { build };
