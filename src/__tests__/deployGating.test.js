/*
 * Audit 2026-09-19, Finding 21 — deployment can proceed independently of
 * failing verification.
 *
 * deploy.yml ran on every push to main and did install, syntax check and
 * build. It did not depend on ci.yml, which is where the unit suite, the
 * typecheck and the axe accessibility tests live. A build succeeds whether or
 * not the tests pass, so a commit that broke an assessment regression could
 * deploy to an app used with real children.
 *
 * The audit's acceptance criterion is that a deliberately failing test
 * prevents the corresponding commit from being deployed. That cannot be
 * executed here, so these tests assert the structure that produces it — and,
 * more usefully, they fail if the gate is ever removed or loosened.
 *
 * Asserted against the file text rather than a parsed tree: `yaml` is only
 * present transitively, and a test guarding the release path should not break
 * when an unrelated dependency reshuffles.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const deploy = readFileSync(resolve(root, '.github/workflows/deploy.yml'), 'utf8');
const ci = readFileSync(resolve(root, '.github/workflows/ci.yml'), 'utf8');

/** The `on:` block only, so a `branches:` key elsewhere cannot satisfy a match. */
function triggerBlock(text) {
  const start = text.indexOf('\non:');
  expect(start, 'deploy.yml has no on: block').toBeGreaterThan(-1);
  const rest = text.slice(start + 1);
  const end = rest.search(/\n(permissions|jobs|concurrency|env|defaults):/);
  return end === -1 ? rest : rest.slice(0, end);
}

describe('deployment is gated on CI (audit finding 21)', () => {
  it('does not deploy straight off a push', () => {
    // This is the defect itself: `on: push` meant the artifact shipped before
    // anything had tested it.
    expect(triggerBlock(deploy)).not.toMatch(/^\s{2}push:/m);
  });

  it('triggers on the CI workflow completing', () => {
    const on = triggerBlock(deploy);
    expect(on).toMatch(/^\s{2}workflow_run:/m);
    expect(on).toMatch(/workflows:\s*\[['"]CI['"]\]/);
    expect(on).toMatch(/types:\s*\[completed\]/);
  });

  it('requires a successful CI conclusion before packaging', () => {
    // `workflow_run` fires on every completion, failures included, so the
    // conclusion check is what actually does the gating.
    expect(deploy).toMatch(/github\.event\.workflow_run\.conclusion\s*==\s*'success'/);
  });

  it('deploys the artifact CI verified rather than rebuilding it', () => {
    expect(deploy).toMatch(/actions\/download-artifact/);
    expect(deploy).toMatch(/name:\s*phonicsquest-build/);
    expect(deploy).toMatch(/run-id:\s*\$\{\{\s*github\.event\.workflow_run\.id\s*\}\}/);
  });

  it('names an artifact that CI actually uploads', () => {
    // A rename on either side would otherwise fail only at deploy time.
    expect(ci).toMatch(/actions\/upload-artifact/);
    expect(ci).toMatch(/name:\s*phonicsquest-build/);
  });

  it('keeps the checks in CI that the gate is there to enforce', () => {
    for (const script of ['npm run test', 'npm run typecheck', 'npm run test:e2e']) {
      expect(ci, `ci.yml no longer runs ${script}`).toContain(script);
    }
  });

  it('runs the full suite before a manual deploy may publish', () => {
    // Otherwise workflow_dispatch is a way around the gate.
    const manual = deploy.slice(deploy.indexOf('Verify (same checks as CI)'));
    expect(manual).toContain('npm run test');
    expect(manual).toContain('npm run typecheck');
  });
});
