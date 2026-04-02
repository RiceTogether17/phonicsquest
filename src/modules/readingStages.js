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

export function getHomeLayoutForReadingBand(band) {
  const normalised = normaliseReadingBand(band);
  if (normalised === 'reader') {
    return { hidePhonicsCore: true, questsMilestone: false, spotlightSentenceForge: false };
  }
  if (normalised === 'developing-reader') {
    return { hidePhonicsCore: false, questsMilestone: false, spotlightSentenceForge: true };
  }
  return { hidePhonicsCore: false, questsMilestone: true, spotlightSentenceForge: false };
}
