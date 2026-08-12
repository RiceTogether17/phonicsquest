import { describe, expect, it } from 'vitest';
import { buildJourneyBarHtml } from '../components/journeyBar.js';
import { getReadingBand, isReadingBandMeasured } from '../modules/readingStages.js';

/**
 * A primary profile is routed to the `reader` band by school level alone, so
 * the grammar pathway unlocks on day one. That routing is a starting
 * assumption, not a result — and the journey bar used to render it as one:
 * three green ticks, "Reader · Stage 4 of 4" and "🏅 Reading journey
 * complete!" on a P4 profile that had answered nothing.
 */

const P4 = { name: 'Aisha', schoolLevel: 'primary', primaryGrade: 'P4' };

describe('isReadingBandMeasured', () => {
  it('is false for a primary profile routed by school level', () => {
    expect(getReadingBand(P4, null)).toBe('reader');
    expect(isReadingBandMeasured(P4, null)).toBe(false);
  });

  it('is true once a placement has run', () => {
    expect(isReadingBandMeasured(P4, { readingBand: 'reader' })).toBe(true);
  });

  it('is true when the profile carries an explicit band', () => {
    expect(isReadingBandMeasured({ ...P4, readingBand: 'developing-reader' }, null)).toBe(true);
  });

  it('is false for a bare preschool profile too', () => {
    expect(isReadingBandMeasured({ schoolLevel: 'preschool' }, null)).toBe(false);
  });
});

describe('the journey bar on an unmeasured band', () => {
  const unmeasured = buildJourneyBarHtml('reader', {}, { measured: false });

  it('does not announce the journey as complete', () => {
    expect(unmeasured).not.toContain('Reading journey complete');
  });

  it('does not tick the three stages behind it as done', () => {
    expect(unmeasured).not.toContain('journey-stage--done');
    expect(unmeasured).not.toContain('(complete)');
  });

  it('says where the child is starting, not what they achieved', () => {
    expect(unmeasured).toContain('Starting at Reader');
    expect(unmeasured).not.toContain('Stage 4 of 4');
    expect(unmeasured).toContain('not a result yet');
  });

  it('still marks the current stage so the bar is readable', () => {
    expect(unmeasured).toContain('journey-stage--current');
  });
});

describe('the journey bar on a measured band', () => {
  const measured = buildJourneyBarHtml('reader', {}, { measured: true });

  it('keeps the existing completion behaviour', () => {
    expect(measured).toContain('Reading journey complete');
    expect(measured).toContain('journey-stage--done');
    expect(measured).toContain('Stage 4 of 4');
  });

  it('defaults to measured, so existing callers are unchanged', () => {
    expect(buildJourneyBarHtml('reader', {})).toBe(measured);
  });

  it('still points at the next stage mid-journey', () => {
    const midway = buildJourneyBarHtml('emerging-decoder', {}, { measured: true });
    expect(midway).toContain('Next: <strong>Developing</strong>');
    expect(midway).toContain('Stage 2 of 4');
  });
});
