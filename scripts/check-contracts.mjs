#!/usr/bin/env node
/**
 * Build-time contract checks.
 *
 * Audit 2026-09-19, finding 26 — engineering debt makes consistency expensive.
 * Its acceptance criteria are three things a build should be able to prove:
 *
 *   1. schema validation enforces contracts at build time
 *   2. parallel registries cannot disagree
 *   3. reports never interpret a placeholder duration as observed learner speed
 *
 * plus the fix's "remove or clearly quarantine prototype pathways".
 *
 * Each check below is one of those, and each fails the build rather than
 * warning. A warning is a thing you scroll past; the whole point of this
 * finding is that drift is cheap to introduce and expensive to notice.
 *
 * What this deliberately does NOT do is police line counts. The audit is
 * explicit: "Refactor by behavioural boundary rather than undertaking a
 * cosmetic rewrite." `app.js` being long is a symptom; a check that fails on
 * it would only encourage moving code around.
 *
 * Run by `npm run build` and by CI.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
const ROOT = resolve(import.meta.dirname, '..');
const SRC = join(ROOT, 'src');

const failures = [];
const notes = [];
const fail = (check, message) => failures.push(`${check}: ${message}`);

/** Every .js file under src/, excluding tests. */
function sourceFiles(dir = SRC) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === '__tests__') continue;
      out.push(...sourceFiles(full));
    } else if (entry.endsWith('.js')) {
      out.push(full);
    }
  }
  return out;
}

const FILES = sourceFiles();
const rel = (f) => relative(ROOT, f).split('\\').join('/');

/** Relative specifiers a file imports, statically or dynamically. */
const IMPORT_RE = /(?:from\s*|import\s*\(\s*)['"](\.[^'"]+)['"]/g;
function importsOf(file) {
  const out = [];
  for (const match of readFileSync(file, 'utf8').matchAll(IMPORT_RE)) {
    let target = resolve(dirname(file), match[1]);
    if (!target.endsWith('.js')) target += '.js';
    try {
      statSync(target);
      out.push(target);
    } catch {
      /* a non-JS asset or a bare directory import — not our concern here */
    }
  }
  return out;
}

// ── 1. Parallel registries cannot disagree ──────────────────────────────────

/**
 * Read a registry's top-level keys, and one field per entry, from the source.
 *
 * Static rather than `import()`: these modules reach the whole app, including
 * `import.meta.env`, which does not exist outside Vite. A build check should
 * not need the app to boot, and should not be breakable by a side effect in
 * some module three imports away.
 *
 * Both files are Prettier-formatted, so a top-level entry is a key at two
 * spaces and its fields sit at four.
 */
function readRegistry(file, exportName, fields = []) {
  const source = readFileSync(file, 'utf8');
  const start = source.indexOf(`export const ${exportName} =`);
  if (start < 0) throw new Error(`${rel(file)} has no export named ${exportName}`);

  const entries = new Map();
  let current = null;
  for (const line of source.slice(start).split('\n')) {
    const key = /^ {2}([A-Za-z_$][\w$]*):\s*\{/.exec(line);
    if (key) {
      current = key[1];
      entries.set(current, {});
      continue;
    }
    if (!current) continue;
    for (const field of fields) {
      const value = new RegExp(`^ {4}${field}:\\s*'([^']*)'`).exec(line);
      if (value) entries.get(current)[field] = value[1];
    }
    if (/^\};/.test(line) || /^\);/.test(line)) break;
  }
  return entries;
}

const MODES = readRegistry(join(SRC, 'modes/index.js'), 'MODES', ['key', 'name']);
const PHONICS_MODES = readRegistry(join(SRC, 'modes/phonicsModes.js'), 'PHONICS_MODES', [
  'key',
  'name',
  'impl',
]);

if (MODES.size === 0) fail('registry', 'MODES parsed as empty — the parser and the file disagree');
if (PHONICS_MODES.size === 0) fail('registry', 'PHONICS_MODES parsed as empty');

for (const [key, mode] of PHONICS_MODES) {
  if (mode.key !== key) fail('registry', `PHONICS_MODES.${key}.key is "${mode.key}"`);
  if (!mode.impl) continue;
  if (!MODES.has(mode.impl)) {
    fail(
      'registry',
      `PHONICS_MODES.${key}.impl = "${mode.impl}", which is not a key of MODES — the bridge between the two registries is broken`,
    );
  }
}

for (const [key, mode] of MODES) {
  if (mode.key !== key) fail('registry', `MODES.${key}.key is "${mode.key}"`);
}
notes.push(`${MODES.size} playable modes, ${PHONICS_MODES.size} with educational metadata`);

// The fluency target lives in PHONICS_MODES and used to be duplicated as a
// literal in the mode UI, kept in step by a comment.
const fluencySource = readFileSync(join(SRC, 'modes/fluencySprintMode.js'), 'utf8');
if (/^const TARGET_WPM = \d/m.test(fluencySource)) {
  fail(
    'registry',
    'fluencySprintMode.js re-declares TARGET_WPM as a literal instead of reading PHONICS_MODES.fluencySprint.masteryCriteria.targetWpm',
  );
}

// ── 2. The registry's claim about its own wiring stays true ─────────────────

const SCORING_DIR = join(SRC, 'modes/scoring');
// The seven phonics engines, not every file in scoring/ — that directory also
// holds graders for the primary modes (shortAnswerGrader, ideaOverlap) which
// have nothing to do with this registry.
const scorers = [...PHONICS_MODES.keys()].filter((name) => {
  try {
    statSync(join(SCORING_DIR, `${name}.js`));
    return true;
  } catch {
    return false;
  }
});

/** A scorer is "wired" when a live mode UI imports it directly. */
const wired = scorers
  .filter((name) =>
    FILES.some(
      (file) =>
        file.startsWith(join(SRC, 'modes')) &&
        !file.startsWith(SCORING_DIR) &&
        !file.endsWith('phonicsModes.js') &&
        importsOf(file).includes(join(SCORING_DIR, `${name}.js`)),
    ),
  )
  .sort();

const declaredBlock = /export const SCORERS_WIRED_INTO_UI = Object\.freeze\(\[([^\]]*)\]/.exec(
  readFileSync(join(SRC, 'modes/phonicsModes.js'), 'utf8'),
);
const declared = [...(declaredBlock?.[1] ?? '').matchAll(/'([^']+)'/g)].map((m) => m[1]).sort();
if (JSON.stringify(wired) !== JSON.stringify(declared)) {
  fail(
    'wiring',
    `SCORERS_WIRED_INTO_UI says [${declared.join(', ')}] but the source imports [${wired.join(', ')}]. ` +
      'Update the list in phonicsModes.js so the registry cannot claim a UI it does not have.',
  );
} else {
  notes.push(`${wired.length} of ${scorers.length} scoring engines are wired into a mode UI`);
}

// ── 3. No placeholder durations ─────────────────────────────────────────────

// A made-up millisecond figure reaches `learningEvents`, and the parent
// dashboard averages that field into "Avg response". A constant there is an
// observation about a child that never happened.
const DURATION_LITERAL =
  /(?:responseMs|responseTimeMs)\s*:\s*\d|recordCorrect\(\s*\d|recordAttempt\([^)]*responseMs\s*:\s*\d/;
for (const file of FILES) {
  const source = readFileSync(file, 'utf8');
  for (const [i, line] of source.split('\n').entries()) {
    if (line.trim().startsWith('*') || line.trim().startsWith('//')) continue;
    if (DURATION_LITERAL.test(line)) {
      fail(
        'duration',
        `${rel(file)}:${i + 1} passes a literal duration — use a measured value or null (${line.trim()})`,
      );
    }
  }
}

// ── 4. No fabricated syllabus citation ──────────────────────────────────────

// Audit 2026-09-19, finding 25. The Parent Dashboard printed
// `Articles (LO-ENG-GR-04)` beside a link labelled "MOE syllabus", and a
// section headed "Syllabus coverage" listing `LO 3.1`, `LO 4.2`, `LO 5.2`.
// Twenty-six codes across two invented schemes, none of them an MOE
// reference. A fabricated citation is worse than none: it claims an outside
// authority checked this, and nobody did.
//
// An alignment claim may only come from `syllabusCrosswalk.js`, whose
// validator refuses an entry without a verbatim quotation and a review date.
const LO_CODE_LITERAL = /['"`]LO[- ][A-Z0-9][^'"`]*['"`]|\bloCode\b/;
const CROSSWALK = join(SRC, 'data/syllabusCrosswalk.js');
for (const file of FILES) {
  if (file === CROSSWALK) continue;
  const source = readFileSync(file, 'utf8');
  let inBlockComment = false;
  for (const [i, line] of source.split('\n').entries()) {
    const trimmed = line.trim();
    // Skip comments: the notes recording this fix quote the old codes.
    if (trimmed.startsWith('/*')) inBlockComment = !trimmed.includes('*/');
    else if (inBlockComment) {
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }
    if (inBlockComment || trimmed.startsWith('*') || trimmed.startsWith('//')) continue;
    if (LO_CODE_LITERAL.test(line)) {
      fail(
        'alignment',
        `${rel(file)}:${i + 1} carries a syllabus outcome code. Alignment claims come from data/syllabusCrosswalk.js, which requires an exact source (${trimmed.slice(0, 80)})`,
      );
    }
  }
}

// ── 5. Prototype pathways are removed, or named ─────────────────────────────

/**
 * Modules that no live entry point reaches.
 *
 * The Quest Journey prototype sat here: 1,089 lines that no shell imported,
 * deriving a digraph answer from a word's first letter. Dead code is not a
 * style problem when it teaches the wrong thing and one import away from
 * being reachable.
 *
 * Every entry below is quarantined on purpose and says why. Anything else
 * fails the build.
 */
const QUARANTINE = new Map([
  [
    'src/data/examBlueprints.js',
    'The SEAB format as checkable data (finding 1). Read by p6BlueprintHonesty.test.js, which is the point: it exists to prove the papers do not match.',
  ],
  [
    'src/data/paper2Validators.js',
    'Paper-2 content rules, exercised by paper2ContentIntegrity.test.js.',
  ],
  [
    'src/modules/progressAnalytics.js',
    'Attempt-log analytics, exercised by progressAnalytics.test.js and localDayKeys.test.js. Its only non-test importer was the Quest Journey prototype; the live daily chart reads weeklyXpLog through the same localDay helpers.',
  ],
]);

const ENTRIES = ['src/main.js', 'src/app.js']
  .map((f) => join(ROOT, f))
  .filter((f) => {
    try {
      statSync(f);
      return true;
    } catch {
      return false;
    }
  });

const reachable = new Set();
const queue = [...ENTRIES];
while (queue.length) {
  const file = queue.pop();
  if (reachable.has(file)) continue;
  reachable.add(file);
  queue.push(...importsOf(file));
}

const orphans = FILES.filter((f) => !reachable.has(f))
  .map(rel)
  .sort();
for (const orphan of orphans) {
  if (!QUARANTINE.has(orphan)) {
    fail(
      'orphan',
      `${orphan} is not reachable from ${ENTRIES.map(rel).join(' or ')}. Wire it up, delete it, or add it to QUARANTINE in this script with a reason.`,
    );
  }
}
for (const listed of QUARANTINE.keys()) {
  if (!orphans.includes(listed)) {
    fail(
      'orphan',
      `${listed} is quarantined in this script but is now reachable from the app. Remove it from QUARANTINE.`,
    );
  }
}
notes.push(`${reachable.size} of ${FILES.length} modules reachable, ${orphans.length} quarantined`);

// ── Report ──────────────────────────────────────────────────────────────────

console.log('Contract checks');
for (const note of notes) console.log(`  · ${note}`);

if (failures.length) {
  console.error(`\n✗ ${failures.length} contract failure${failures.length === 1 ? '' : 's'}:`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log('✓ All contracts hold.');
