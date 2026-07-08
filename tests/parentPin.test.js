/**
 * Parent PIN hashing: new PINs are salted, and every legacy stored format
 * (unsalted sha256, marked plaintext, raw plaintext) still verifies and is
 * flagged for upgrade.
 */
import { describe, it, expect } from 'vitest';
import { createPinHash, verifyPin } from '../src/modules/parentPin.js';

describe('createPinHash', () => {
  it('produces a salted hash, unique per call for the same PIN', async () => {
    const a = await createPinHash('1234');
    const b = await createPinHash('1234');
    expect(a).toMatch(/^sha256s:[0-9a-f]{32}:[0-9a-f]{64}$/);
    expect(a).not.toBe(b); // different salts
  });
});

describe('verifyPin', () => {
  it('accepts the right PIN and rejects the wrong one for salted hashes', async () => {
    const saved = await createPinHash('1234');
    expect((await verifyPin('1234', saved)).ok).toBe(true);
    expect((await verifyPin('1234', saved)).needsUpgrade).toBe(false);
    expect((await verifyPin('4321', saved)).ok).toBe(false);
  });

  it('verifies a legacy unsalted sha256 hash and flags it for upgrade', async () => {
    // sha256('1234')
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('1234'));
    const hex = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
    const res = await verifyPin('1234', `sha256:${hex}`);
    expect(res.ok).toBe(true);
    expect(res.needsUpgrade).toBe(true);
    expect((await verifyPin('9999', `sha256:${hex}`)).ok).toBe(false);
  });

  it('verifies legacy plain: and raw plaintext formats and flags upgrade', async () => {
    expect(await verifyPin('1234', 'plain:1234')).toEqual({ ok: true, needsUpgrade: true });
    expect((await verifyPin('1234', 'plain:9999')).ok).toBe(false);
    expect(await verifyPin('1234', '1234')).toEqual({ ok: true, needsUpgrade: true });
    expect((await verifyPin('1234', '9999')).ok).toBe(false);
  });

  it('rejects missing or malformed stored values', async () => {
    expect((await verifyPin('1234', null)).ok).toBe(false);
    expect((await verifyPin('1234', undefined)).ok).toBe(false);
    expect((await verifyPin('1234', 'sha256s:broken')).ok).toBe(false);
  });
});
