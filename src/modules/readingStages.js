/**
 * Reading-stage helpers used by placement, recommendation and unlock routing.
 */

export const READING_BANDS = Object.freeze([
  'pre-reader',
  'emerging-decoder',
  'developing-reader',
  'reader',
]);

export function normaliseReadingBand(band, fallback = 'pre-reader') {
  return READING_BANDS.includes(band) ? band : fallback;
}

/**
 * Determine reading band from a placement payload + profile metadata.
 * Preserves backward compatibility with older profiles that only had schoolLevel.
 */
export function getReadingBand(profile = null, placementProfile = null) {
  if (placementProfile?.readingBand) {
    return normaliseReadingBand(placementProfile.readingBand);
  }
  if (profile?.readingBand) {
    return normaliseReadingBand(profile.readingBand);
  }
  return profile?.schoolLevel === 'primary' ? 'reader' : 'pre-reader';
}

export function isGrammarPathway(band) {
  return normaliseReadingBand(band) === 'reader';
}
