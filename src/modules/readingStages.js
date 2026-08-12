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

/**
 * Was this reading band *measured*, or merely assigned?
 *
 * `getReadingBand` falls back to `'reader'` for any primary profile so the
 * grammar pathway unlocks on day one — sound routing, but it is a starting
 * assumption, not a result. Surfaces that draw the four-stage journey need to
 * tell the two apart: a P4 profile with zero recorded practice was showing
 * three green ticks and "🏅 Reading journey complete!" before its first
 * question, which is the same overclaim VALIDITY_ROADMAP.md Priority 0
 * removed from the parent report.
 *
 * @param {object|null} profile
 * @param {object|null} placementProfile
 * @returns {boolean} true only when a placement or an explicit profile band set it
 */
export function isReadingBandMeasured(profile = null, placementProfile = null) {
  return !!(placementProfile?.readingBand || profile?.readingBand);
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
