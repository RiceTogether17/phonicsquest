/*
 * Audit 2026-09-19, Finding 6 — privacy text contradicts actual AI
 * transmission.
 *
 * public/privacy.html said learner information "never leaves the device" and
 * that the app does not transmit any personal information "to any third
 * party". Meanwhile aiProviders.js posts to Google, Anthropic and OpenAI
 * endpoints, aiService.js sends the child's full composition draft for writing
 * coaching and rubric grading, and aiGuardrails.js adds recent practice
 * context.
 *
 * This is an implementation-to-disclosure mismatch, and the failure mode is
 * that a parent cannot make an informed choice. So the test is written against
 * what the code actually does: if a new outbound call appears, or the policy
 * drifts back to an absolute claim, this fails.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (p) => readFileSync(resolve(root, p), 'utf8');

const policy = read('public/privacy.html');
const shell = read('index.html');
const providers = read('src/modules/aiProviders.js');

describe('the privacy policy matches what the app transmits (audit finding 6)', () => {
  it('makes no absolute "never leaves the device" claim', () => {
    // The specific sentences the audit found. They cannot be true while the
    // AI features exist at all.
    expect(policy).not.toMatch(/never leaves the device/i);
    expect(policy).not.toMatch(/does\s+<strong>not<\/strong>\s+collect, store, or transmit/i);
  });

  it('says plainly that optional features send text off the device', () => {
    expect(policy).toMatch(/send text off the device|do send data to a third party/i);
    // And names the thing a parent would most want to know.
    expect(policy).toMatch(/full composition/i);
  });

  it('names every provider the code can actually post to', () => {
    // Derived from the code, so adding a fourth provider without updating the
    // policy fails here rather than silently understating the disclosure.
    // Only hosts the app POSTs to. `keyUrl` lines point a parent at a console
    // to obtain a key and are not data destinations.
    const endpointLines = providers
      .split('\n')
      .filter((line) => !line.includes('keyUrl') && /https:\/\//.test(line));
    const apiHosts = new Set(
      endpointLines.flatMap((line) =>
        [...line.matchAll(/https:\/\/([a-z0-9.-]+)\//g)].map((m) => m[1]),
      ),
    );

    // Non-vacuity: the three known providers must actually be discovered.
    expect(apiHosts.size).toBeGreaterThanOrEqual(3);

    const expectedNames = {
      'generativelanguage.googleapis.com': /google|gemini/i,
      'api.anthropic.com': /anthropic|claude/i,
      'api.openai.com': /openai/i,
    };

    for (const host of apiHosts) {
      const pattern = expectedNames[host];
      expect(
        pattern,
        `aiProviders.js posts to ${host}, which this test does not know about`,
      ).toBeDefined();
      expect(policy, `privacy.html does not mention the provider at ${host}`).toMatch(pattern);
    }
  });

  it('discloses that browser speech recognition may send audio to the vendor', () => {
    expect(policy).toMatch(/speech.recognition/i);
    expect(policy).toMatch(/browser vendor|browser's own privacy policy/i);
  });

  it('says exports exclude the key and the PIN, matching the export allowlist', () => {
    expect(policy).toMatch(/exclude.*(API key|AI key)/i);
    expect(policy).toMatch(/PIN/);
  });

  it('drops the unestablished compliance assertions', () => {
    // It previously said the app "is designed to comply with" COPPA and GDPR.
    // The audit is explicit that it made no compliance determination, so the
    // policy should not imply one either.
    expect(policy).not.toMatch(/designed to comply with/i);
    expect(policy).toMatch(/do not claim certification|should not be read as one/i);
  });

  it('warns the adult before cloud AI is enabled, not only in the policy', () => {
    // A policy page nobody opens is not a disclosure. The audit asks for a
    // clear adult-facing disclosure at the point of enabling.
    expect(shell).toMatch(/class="ai-disclosure"/);
    const start = shell.indexOf('class="ai-disclosure"');
    const disclosure = shell.slice(start, start + 1400);
    expect(disclosure).toMatch(/before you turn this on/i);
    expect(disclosure).toMatch(/composition/i);
    expect(disclosure).toMatch(/privacy\.html/);
  });

  it('says the non-AI path still works, so the choice is a real one', () => {
    expect(policy).toMatch(/works without|non-AI path|Every AI feature has a working/i);
  });
});
