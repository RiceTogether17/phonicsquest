import { describe, it, expect } from 'vitest';
import { getReadingBand, getHomeLayoutForReadingBand } from '../modules/readingStages.js';

/**
 * Regression tests for the diagnostic bypass for primary-school profiles.
 *
 * The decision: school-age children creating a P1-P6 profile should NOT
 * have to sit through the phonological-awareness placement test before
 * they can reach the Primary English content.  The underlying invariants
 * that make this safe are:
 *
 *   1. `getReadingBand` falls back to "reader" for any primary profile
 *      that has no placement payload, so band-aware UI keeps working.
 *
 *   2. The "reader" home layout hides phonics-core and surfaces the
 *      Primary English grid, which is what a P1-P6 child should see.
 */
describe('Primary diagnostic bypass — supporting invariants', () => {
  it('falls back to "reader" band for a primary profile without a placement', () => {
    const primaryProfile = { schoolLevel: 'primary', primaryGrade: 'P3' };
    expect(getReadingBand(primaryProfile, null)).toBe('reader');
  });

  it('still falls back to "pre-reader" for a preschool profile without a placement', () => {
    const preschoolProfile = { schoolLevel: 'preschool' };
    expect(getReadingBand(preschoolProfile, null)).toBe('pre-reader');
  });

  it('honours an explicit placement payload over the primary fallback', () => {
    const primaryProfile = { schoolLevel: 'primary', primaryGrade: 'P1' };
    const placement = { readingBand: 'emerging-decoder' };
    expect(getReadingBand(primaryProfile, placement)).toBe('emerging-decoder');
  });

  it('reader band hides phonics-core in the home layout', () => {
    const layout = getHomeLayoutForReadingBand('reader');
    expect(layout.hidePhonicsCore).toBe(true);
    expect(layout.questsMilestone).toBe(false);
  });
});

/**
 * Shape check for the default placement payload the app seeds when it
 * skips the diagnostic for a primary profile.  This mirrors the keys
 * that downstream consumers (dashboard, recommendations, paper mode)
 * peek at via `store.get('placementProfile')`.
 */
describe('Primary diagnostic bypass — default placement payload', () => {
  // Inline the same default-payload shape used by App._buildPrimaryDefaultPlacement.
  // If the shape changes, update both this expectation and the app helper.
  const PRIMARY_DEFAULT_KEYS = [
    'readingBand', 'phonicsPhase', 'phase', 'startGroup', 'preSeededStats',
    'sightWordBand', 'storyReadiness',
    'sentenceReady', 'grammarReady', 'vocabularyReady',
    'bandDescription', 'intake', 'skippedDiagnostic',
  ];

  function buildPrimaryDefaultPlacement(profile) {
    return {
      readingBand: 'reader',
      phonicsPhase: 5,
      phase: 5,
      startGroup: null,
      preSeededStats: {},
      sightWordBand: 'strong',
      storyReadiness: 'paragraph',
      sentenceReady: true,
      grammarReady: true,
      vocabularyReady: true,
      bandDescription: 'Primary English pathway — diagnostic skipped for school-age learners.',
      intake: { schoolLevel: 'primary', primaryGrade: profile?.primaryGrade || null },
      skippedDiagnostic: true,
    };
  }

  it('includes every documented field a downstream consumer might read', () => {
    const payload = buildPrimaryDefaultPlacement({ primaryGrade: 'P3' });
    for (const key of PRIMARY_DEFAULT_KEYS) {
      expect(payload, `missing key: ${key}`).toHaveProperty(key);
    }
    expect(payload.readingBand).toBe('reader');
    expect(payload.skippedDiagnostic).toBe(true);
    expect(payload.intake.primaryGrade).toBe('P3');
  });

  it('keeps the reader band so the home layout hides phonics-core', () => {
    const payload = buildPrimaryDefaultPlacement({ primaryGrade: 'P1' });
    const layout = getHomeLayoutForReadingBand(payload.readingBand);
    expect(layout.hidePhonicsCore).toBe(true);
  });
});
