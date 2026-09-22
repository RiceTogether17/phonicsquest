/*
 * Audit 2026-09-19, Finding 14 — fluency and supported sound work still
 * overclaim what was measured.
 *
 * Two halves.
 *
 * The sprint speaks the target and the child taps its printed match, then the
 * summary said "Sprint mastered!" and reported "words/min". The evidence layer
 * already capped the mode at `guided`; the visible result was the part still
 * claiming more than it measured, and words/min reads as an oral reading rate —
 * a figure teachers compare against benchmarks.
 *
 * soundCount asks how many sounds a word has and keeps an `independent`
 * ceiling, but with the stretchedSpeech setting on the app plays the word
 * segmented, handing the child the phoneme boundaries they were asked to find.
 * The result was classified identically either way.
 *
 * Acceptance: the evidence recorded changes when the support changes, and
 * displayed speed metrics say exactly what was timed.
 */

import { describe, it, expect } from 'vitest';
import {
  EVIDENCE,
  classifyEvidence,
  usesStretchedSpeechSupport,
  STRETCHED_SPEECH_SUPPORTED_MODES,
} from '../modules/evidence.js';

describe('supported work is not recorded as independent (audit finding 14)', () => {
  it('drops to guided when the stretched prompt is doing the segmenting', () => {
    const base = { ceiling: EVIDENCE.INDEPENDENT, hintUsed: false, wrongStrikes: 0 };

    expect(classifyEvidence({ ...base, supportUsed: false })).toBe(EVIDENCE.INDEPENDENT);
    expect(classifyEvidence({ ...base, supportUsed: true })).toBe(EVIDENCE.GUIDED);
  });

  it('names the modes the setting actually helps, and only those', () => {
    // soundCount and missingSound gate the stretched prompt on the setting.
    expect(usesStretchedSpeechSupport('soundCount')).toBe(true);
    expect(usesStretchedSpeechSupport('missingSound')).toBe(true);

    // segment and oralSegment stretch unconditionally — it is intrinsic to what
    // they teach, and their ceilings already account for it. Listing them here
    // would penalise a child for a support they were never offered a choice
    // about.
    expect(usesStretchedSpeechSupport('segment')).toBe(false);
    expect(usesStretchedSpeechSupport('oralSegment')).toBe(false);

    // A mode with no audio support at all.
    expect(usesStretchedSpeechSupport('blend')).toBe(false);
    expect(STRETCHED_SPEECH_SUPPORTED_MODES).toEqual(['soundCount', 'missingSound']);
  });

  it('still lets an adult verdict outrank the support flag', () => {
    // A watching adult can confirm the child did the work regardless.
    expect(
      classifyEvidence({
        ceiling: EVIDENCE.INDEPENDENT,
        supportUsed: true,
        adultVerdict: 'independent',
      }),
    ).toBe(EVIDENCE.VERIFIED);
  });

  it('does not raise evidence above a mode ceiling because support was off', () => {
    // fluencySprint is capped at guided whatever the child does, because the
    // target is spoken before the printed options appear.
    expect(
      classifyEvidence({ ceiling: EVIDENCE.GUIDED, supportUsed: false, hintUsed: false }),
    ).toBe(EVIDENCE.GUIDED);
  });

  it('leaves the existing hint and strike signals working', () => {
    const base = { ceiling: EVIDENCE.INDEPENDENT, supportUsed: false };
    expect(classifyEvidence({ ...base, hintUsed: true })).toBe(EVIDENCE.GUIDED);
    expect(classifyEvidence({ ...base, wrongStrikes: 1 })).toBe(EVIDENCE.GUIDED);
    expect(classifyEvidence(base)).toBe(EVIDENCE.INDEPENDENT);
  });
});
