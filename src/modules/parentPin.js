// @ts-check
/**
 * PhonicsQuest – parent PIN hashing.
 *
 * A 4-digit PIN has only 10,000 possibilities, so an unsalted SHA-256 is a
 * lookup table away from plaintext. New PINs are stored salted
 * (`sha256s:<saltHex>:<hashHex>`); the legacy `sha256:<hex>`, `plain:<pin>`
 * and raw-plaintext formats still verify so nobody gets locked out, and
 * callers upgrade them on the next successful entry.
 *
 * This is a parental *gate*, not a security boundary — the child cannot
 * read localStorage, but anyone with device access can. Salting just keeps
 * the PIN from being trivially reversible in a backup or export.
 */

/** @param {Uint8Array} bytes */
function _toHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** @param {string} text */
async function _digestHex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return _toHex(new Uint8Array(digest));
}

/**
 * Hash a PIN for storage, salted. Falls back to a marked plaintext format
 * only when SubtleCrypto is unavailable (non-secure contexts).
 * @param {string} pin
 * @returns {Promise<string>}
 */
export async function createPinHash(pin) {
  if (!globalThis.crypto?.subtle) return `plain:${pin}`;
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = _toHex(salt);
  const hashHex = await _digestHex(`${saltHex}:${pin}`);
  return `sha256s:${saltHex}:${hashHex}`;
}

/**
 * Verify an entered PIN against the stored value, whatever its era.
 *
 * @param {string} pin
 * @param {string|null|undefined} saved
 * @returns {Promise<{ ok: boolean, needsUpgrade: boolean }>}
 *   `needsUpgrade` is true when the stored format predates salting —
 *   call createPinHash and re-store on success.
 */
export async function verifyPin(pin, saved) {
  if (!saved || typeof saved !== 'string') return { ok: false, needsUpgrade: false };

  if (saved.startsWith('sha256s:')) {
    const [, saltHex, hashHex] = saved.split(':');
    if (!saltHex || !hashHex || !globalThis.crypto?.subtle)
      return { ok: false, needsUpgrade: false };
    const candidate = await _digestHex(`${saltHex}:${pin}`);
    return { ok: candidate === hashHex, needsUpgrade: false };
  }

  if (saved.startsWith('sha256:')) {
    if (!globalThis.crypto?.subtle) return { ok: false, needsUpgrade: false };
    const candidate = await _digestHex(pin);
    return { ok: `sha256:${candidate}` === saved, needsUpgrade: true };
  }

  if (saved.startsWith('plain:')) {
    return { ok: saved === `plain:${pin}`, needsUpgrade: !!globalThis.crypto?.subtle };
  }

  // Oldest format of all: the raw PIN.
  return { ok: saved === pin, needsUpgrade: !!globalThis.crypto?.subtle };
}
