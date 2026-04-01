/** Canonical phonics-group keys and legacy aliases. */

export const SHORT_VOWEL_CANONICAL_GROUPS = Object.freeze(['cvc-a', 'cvc-e', 'cvc-i', 'cvc-o', 'cvc-u']);

const LEGACY_TO_CANONICAL = Object.freeze({
  'short-a': 'cvc-a',
  'short-e': 'cvc-e',
  'short-i': 'cvc-i',
  'short-o': 'cvc-o',
  'short-u': 'cvc-u',
});

export function normalizePhonicsGroupKey(group) {
  if (!group) return group;
  return LEGACY_TO_CANONICAL[group] || group;
}

export function normalizeGroupMasteryMap(groupMastery = {}) {
  const normalized = {};
  for (const [key, value] of Object.entries(groupMastery || {})) {
    const canonical = normalizePhonicsGroupKey(key);
    if (typeof value !== 'number') continue;
    if (typeof normalized[canonical] !== 'number') {
      normalized[canonical] = value;
    } else {
      normalized[canonical] = Math.max(normalized[canonical], value);
    }
  }
  return normalized;
}
