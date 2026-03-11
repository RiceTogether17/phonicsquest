import { describe, it, expect } from 'vitest';
import { getMorphologyParts, getBaseWord, hasKnownAffix } from '../data/words.js';

describe('morphology helpers', () => {
  it('extracts prefix and suffix where possible', () => {
    expect(getMorphologyParts('unreadable')).toEqual({ prefix: 'un', base: 'read', suffix: 'able' });
  });

  it('extracts suffix from -tion words', () => {
    expect(getMorphologyParts('action')).toEqual({ prefix: null, base: 'ac', suffix: 'tion' });
  });

  it('exposes base word helper and affix detector', () => {
    expect(getBaseWord('redo')).toBe('do');
    expect(hasKnownAffix('market')).toBe(false);
    expect(hasKnownAffix('untie')).toBe(true);
  });
});
