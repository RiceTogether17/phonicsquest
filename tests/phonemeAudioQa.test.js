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
