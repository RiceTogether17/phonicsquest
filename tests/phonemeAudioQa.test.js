/**
 * Phoneme clips carry the consonant, not a vowel after it (AUDIO_QA.md).
 *
 * b, g, j/soft_g, y, w and q were recorded as "buh", "guh", "juh"… and were
 * trimmed where their first formant opened into the vowel. The trimmed clips
 * are 128 kbps CBR, so file size is a proxy for length: each is now under
 * ~0.2 s, where the "uh" versions ran 0.24–0.33 s. Restoring an untrimmed
 * recording by accident trips this.
 */
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const DIR = resolve(import.meta.dirname, '../public/audio/phonemes');
const size = (name) => statSync(resolve(DIR, `${name}.mp3`)).size;

describe('phoneme clips without a trailing vowel', () => {
  it.each(['b', 'g', 'j', 'soft_g', 'y', 'w', 'q'])('%s.mp3 is the short, trimmed clip', (name) => {
    // 3,500 bytes ≈ 0.22 s at 128 kbps including the encoder's padding.
    expect(size(name)).toBeLessThanOrEqual(3500);
  });

  it('has a recorded /aw/, so saw and paw do not fall back to the device voice', () => {
    expect(existsSync(resolve(DIR, 'aw.mp3'))).toBe(true);
    expect(size('aw')).toBeGreaterThan(2000);
  });
});

describe('vowel clips made from the main voice (AUDIO_QA.md)', () => {
  // long_oo and short_oo used to be a different, lower speaker (~98 Hz), and
  // ran 0.5-0.6 s (8-10 kB). The main-voice versions are 0.37 s and 0.24 s.
  it('the oo clips are the main-voice versions, not the old second speaker', () => {
    expect(size('long_oo')).toBeLessThan(7500);
    expect(size('short_oo')).toBeLessThan(5000);
    expect(size('short_oo')).toBeLessThan(size('long_oo'));
  });

  it('the schwa has its own recording, shorter than the stressed short u', () => {
    expect(existsSync(resolve(DIR, 'schwa.mp3'))).toBe(true);
    expect(size('schwa')).toBeGreaterThan(1500);
    expect(size('schwa')).toBeLessThan(size('u'));
  });
});
