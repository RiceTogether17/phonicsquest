/**
 * SCOPE_AND_SEQUENCE.md must describe the app that actually exists.
 *
 * VALIDITY_ROADMAP 3.6 asks for syllabus alignment that is *auditable*. A
 * hand-written scope and sequence is not: it drifts the moment a stage
 * moves, and a curriculum specialist reading it has no way to tell whether
 * it still matches the code. Generating it from `curriculum.js` solves half
 * of that; this test is the other half, because a generated file that nobody
 * regenerates is just a stale file with extra steps.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { build } from '../../scripts/gen-scope-sequence.mjs';
import { CURRICULUM, PHASES } from '../data/curriculum.js';
import { PROGRESSION_GATE } from '../modules/progressionGate.js';

// Resolved from the project root rather than `import.meta.url`: under the
// test runner that is not a file URL.
const DOC = resolve(process.cwd(), 'SCOPE_AND_SEQUENCE.md');
const committed = () => readFileSync(DOC, 'utf8');

describe('the committed scope and sequence', () => {
  it('matches what the curriculum data generates right now', () => {
    // If this fails the document is stale, not wrong:
    //   node scripts/gen-scope-sequence.mjs
    expect(committed()).toBe(build());
  });

  it('lists every phase and every stage — no quiet omissions', () => {
    const doc = committed();
    for (const phase of PHASES.filter((p) => typeof p.phase === 'number')) {
      expect(doc, `phase ${phase.phase} missing`).toContain(phase.label);
    }
    for (const stage of CURRICULUM) {
      expect(doc, `stage ${stage.id} missing`).toContain(`\`${stage.id}\``);
    }
  });

  it('quotes the real gate numbers', () => {
    // The bars a specialist will check against the code.
    const doc = committed();
    expect(doc).toContain(`${Math.round(PROGRESSION_GATE.MIN_DECODING_ACCURACY * 100)}%`);
    expect(doc).toContain(`${Math.round(PROGRESSION_GATE.MIN_SPELLING_ACCURACY * 100)}%`);
    expect(doc).toContain(String(PROGRESSION_GATE.MIN_UNIQUE_WORDS));
  });

  it('says what it does not claim', () => {
    // A scope and sequence that oversells itself is worse than none. The
    // app maps to no published syllabus and cites no studies, and the
    // document has to say so rather than letting a reader assume otherwise.
    const doc = committed();
    expect(doc).toMatch(/does not claim/i);
    expect(doc).toMatch(/no external syllabus mapping/i);
    expect(doc).toMatch(/cites no studies|no evidence-base citations/i);
  });

  it('never prints a bare 0% where there is simply no gate', () => {
    // The entry stage has `requiredMastery: 0` — the absence of a
    // prerequisite, not a zero bar. "0%" would read as a mistake in the one
    // document whose purpose is being checkable.
    expect(committed()).not.toContain('| 0% |');
  });
});
