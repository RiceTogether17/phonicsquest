/*
 * Audit 2026-09-19, Finding 13 — blend confirmation is recognition of a
 * just-modelled word.
 *
 * blendConfirm asks which word the child just read, immediately after the app
 * has blended it aloud, and app.js committed the outcome as
 * EVIDENCE.INDEPENDENT against that same word.
 *
 * The audit is careful here, and so is this file: hiding print and audio
 * during the confirmation is a real improvement, and the activity has genuine
 * learning value. The defect is a measurement-design one — identifying a
 * just-seen, just-heard word does not establish cold decoding or transfer.
 *
 * Acceptance: a learner cannot master a decoding stage solely by recognising
 * recently demonstrated targets.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  EVIDENCE,
  EVIDENCE_RANK,
  isMasteryEvidence,
  MIN_MASTERY_EVIDENCE,
} from '../modules/evidence.js';

const root = resolve(import.meta.dirname, '../..');
const appSource = readFileSync(resolve(root, 'src/app.js'), 'utf8');

/** The onDone handler that commits the confirmation result. */
function confirmCommitCall() {
  const marker = 'onDone: (confirmed, confirmMs) =>';
  const at = appSource.indexOf(marker);
  expect(at, 'blend confirmation commit not found in app.js').toBeGreaterThan(-1);
  return appSource.slice(at, at + 200);
}

describe('blend confirmation is not independent decoding (audit finding 13)', () => {
  it('commits the confirmation at guided, not independent', () => {
    const call = confirmCommitCall();
    expect(call).toContain('EVIDENCE.GUIDED');
    expect(call).not.toContain('EVIDENCE.INDEPENDENT');
  });

  it('cannot support a mastery claim at that level', () => {
    // The whole point: guided work is practice, and mastery needs independent.
    expect(isMasteryEvidence(EVIDENCE.GUIDED)).toBe(false);
    expect(MIN_MASTERY_EVIDENCE).toBe(EVIDENCE.INDEPENDENT);
  });

  it('still ranks well above the self-report it replaced', () => {
    // Not a regression to the "Yes! ✓" problem Priority 0 fixed. The child
    // performs something here rather than claiming it, and the record says so.
    expect(EVIDENCE_RANK[EVIDENCE.GUIDED]).toBeGreaterThan(EVIDENCE_RANK[EVIDENCE.EXPOSURE]);
  });

  it('says in the module why, so the next reader does not "fix" it back', () => {
    const source = readFileSync(resolve(root, 'src/modes/blendConfirm.js'), 'utf8');

    // The docblock used to assert the opposite — "that tap is real,
    // independent evidence" — which is how the classification got there.
    expect(source).not.toMatch(/real,\s*independent evidence/i);
    expect(source).toMatch(/finding 13/);
    // Wrap-tolerant: the docblock breaks this phrase across a line.
    expect(source.replace(/\s*\n\s*\*\s*/g, ' ')).toMatch(/just-seen, just-heard/i);
    // And it names what would actually establish decoding.
    expect(source).toMatch(/unmodelled equivalent word|delayed retrieval probe/i);
  });
});
