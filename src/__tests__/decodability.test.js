import { describe, it, expect } from 'vitest';
import {
  STORY_PHASES,
  MAX_TIER,
  getStoryPhase,
  GRAPHEME_TIERS,
  scanWord,
  stripSuffix,
  requiredTier,
  isWordDecodable,
  cleanToken,
  extractCountableTokens,
  classifyWord,
  analyzeStory,
  countFocusGrapheme,
  findUnknownCapitalised,
  getStoryRules,
  BAND_RULES,
  PROPER_NOUNS,
} from '../modules/decodability.js';
import { CURRICULUM, PHASES } from '../data/curriculum.js';

describe('STORY_PHASES table', () => {
  it('tiers are within range and never decrease down the list', () => {
    let prev = 1;
    for (const p of STORY_PHASES) {
      expect(p.tier, `${p.id} tier`).toBeGreaterThanOrEqual(1);
      expect(p.tier, `${p.id} tier`).toBeLessThanOrEqual(MAX_TIER);
      expect(p.tier, `${p.id} tier dropped below ${prev}`).toBeGreaterThanOrEqual(prev);
      prev = p.tier;
    }
  });

  it('every phase declares a tricky-word cutoff within curriculum phases 1–10', () => {
    for (const p of STORY_PHASES) {
      expect(p.curriculumPhase, p.id).toBeGreaterThanOrEqual(1);
      expect(p.curriculumPhase, p.id).toBeLessThanOrEqual(10);
    }
  });

  it('getStoryPhase resolves ids and rejects unknowns', () => {
    expect(getStoryPhase('short-a')?.tier).toBe(1);
    expect(getStoryPhase('advanced-vowel')?.tier).toBe(5);
    expect(getStoryPhase('nope')).toBeNull();
  });

  it('the table is frozen', () => {
    expect(Object.isFrozen(STORY_PHASES)).toBe(true);
    expect(Object.isFrozen(GRAPHEME_TIERS)).toBe(true);
  });
});

describe('scanWord', () => {
  it('parses early-code words at tier 1, including digraphs and ck', () => {
    for (const w of ['cat', 'then', 'chat', 'quick', 'splash', 'back', 'song']) {
      expect(scanWord(w).tier, w).toBe(1);
    }
  });

  it('detects split digraphs only as v-C-e at the word end', () => {
    expect(scanWord('make').parse).toContain('a_e');
    expect(scanWord('make').tier).toBe(2);
    // "later" must NOT match a_e mid-word; its 'er' makes it tier 3.
    expect(scanWord('later').parse).not.toContain('a_e');
    expect(scanWord('later').tier).toBe(3);
  });

  it('prefers the longest pattern (igh over i)', () => {
    const { parse, tier } = scanWord('night');
    expect(parse).toContain('igh');
    expect(tier).toBe(2);
  });

  it('treats non-initial y as a tier-2 vowel spelling but initial y as a consonant', () => {
    expect(scanWord('dry').tier).toBe(2);
    expect(scanWord('yes').tier).toBe(1);
  });

  it('is deterministic', () => {
    expect(scanWord('chair')).toEqual(scanWord('chair'));
  });
});

describe('stripSuffix', () => {
  it('restores e-drop, doubling and -ied bases', () => {
    expect(stripSuffix('baked')).toEqual({ base: 'bake', suffix: 'ed' });
    expect(stripSuffix('running')).toEqual({ base: 'run', suffix: 'ing' });
    expect(stripSuffix('biggest')).toEqual({ base: 'big', suffix: 'est' });
    expect(stripSuffix('tried')).toEqual({ base: 'try', suffix: 'ed' });
    expect(stripSuffix('going')).toEqual({ base: 'go', suffix: 'ing' });
  });

  it('returns null when no suffix applies', () => {
    expect(stripSuffix('cat')).toBeNull();
  });
});

describe('requiredTier', () => {
  it('uses curated words.js graphemes when available', () => {
    expect(requiredTier('cat')).toBe(1); // c-a-t
    expect(requiredTier('ship')).toBe(1); // sh-i-p
    expect(requiredTier('cake')).toBe(2); // c-a_e-k
    expect(requiredTier('rain')).toBe(2); // r-ai-n
  });

  it('assigns r-controlled, diphthong and advanced patterns their tiers', () => {
    expect(requiredTier('dark')).toBe(3);
    expect(requiredTier('bird')).toBe(3);
    expect(requiredTier('coin')).toBe(4);
    expect(requiredTier('out')).toBe(4);
    expect(requiredTier('chair')).toBe(5);
    expect(requiredTier('near')).toBe(5);
  });

  it('routes suffixed forms through their base ("going" is not an oi word)', () => {
    expect(requiredTier('going')).toBe(2);
    expect(requiredTier('jumped')).toBe(2);
  });

  it('cleans punctuation and possessives first', () => {
    expect(requiredTier("Giri's")).toBe(requiredTier('giri'));
    expect(requiredTier('flat!')).toBe(1);
  });
});

describe('isWordDecodable', () => {
  it('respects the cumulative phase tiers', () => {
    expect(isWordDecodable('flat', 'short-a')).toBe(true);
    expect(isWordDecodable('cake', 'short-a')).toBe(false);
    expect(isWordDecodable('cake', 'long-a')).toBe(true);
    expect(isWordDecodable('dark', 'long-a')).toBe(false);
    expect(isWordDecodable('dark', 'r-controlled')).toBe(true);
    expect(isWordDecodable('chair', 'diphthongs')).toBe(false);
    expect(isWordDecodable('chair', 'advanced-vowel')).toBe(true);
  });

  it('rejects unknown phases', () => {
    expect(isWordDecodable('cat', 'not-a-phase')).toBe(false);
  });
});

describe('cleanToken / extractCountableTokens', () => {
  it('strips punctuation and possessive ’s', () => {
    expect(cleanToken("Giri's")).toBe('giri');
    expect(cleanToken('“Stop!”')).toBe('stop');
    expect(cleanToken('123')).toBe('');
  });

  it('counts text/intro/beat/paragraph/end lines, splitting hyphens, and skips refrain/label/chapter', () => {
    const story = {
      lines: [
        { type: 'chapter', text: 'Chapter 1: The Test' },
        { type: 'label', text: 'Problem:' },
        { type: 'text', text: 'A well-fed cat sat.' },
        { type: 'refrain', text: 'Puff puff puff!' },
        { type: 'end', text: 'The end.' },
      ],
    };
    expect(extractCountableTokens(story)).toEqual(['a', 'well', 'fed', 'cat', 'sat', 'the', 'end']);
  });
});

describe('classifyWord precedence', () => {
  const bandA = { phase: 'short-a', band: 'A', allowedHFWTier: 1 };

  it('decodable beats every whitelist (sound effects are real words)', () => {
    expect(classifyWord('tap', bandA).status).toBe('decodable');
    expect(classifyWord('jay', { ...bandA, phase: 'long-a' }).status).toBe('decodable');
  });

  it('proper nouns are allowed at any band', () => {
    expect(classifyWord('giri', bandA).status).toBe('proper');
    expect(classifyWord('deepavali', bandA).status).toBe('proper');
  });

  it('HFW within the allowed tier pass; above it they fall through', () => {
    expect(classifyWord('said', bandA).status).toBe('tricky'); // tier-2 HFW, but phase-1 tricky word
    expect(classifyWord('said', { ...bandA, allowedHFWTier: 2 }).status).toBe('hfw');
  });

  it('tricky words respect the phase cutoff', () => {
    // 'they' is introduced at curriculum phase 4; short-a's cutoff is 2.
    expect(classifyWord('they', bandA).status).toBe('stretch');
    expect(classifyWord('they', { ...bandA, phase: 'mixed-short' }).status).toBe('tricky');
  });

  it('story vocab and pretaught lists rescue stretch words', () => {
    const story = { ...bandA, pretaught: ['dry'], vocab: [{ word: 'bite' }] };
    expect(classifyWord('dry', story).status).toBe('pretaught');
    expect(classifyWord('bite', story).status).toBe('pretaught');
    expect(classifyWord('chair', story).status).toBe('stretch');
  });
});

describe('analyzeStory', () => {
  it('computes counts, ratio and stretch list for a synthetic story', () => {
    const story = {
      id: 'synthetic',
      band: 'A',
      phase: 'short-a',
      allowedHFWTier: 1,
      lines: [
        { type: 'text', text: 'The cat sat on a chair.' },
        { type: 'refrain', text: 'Puff puff!' },
      ],
    };
    const { computed } = analyzeStory(story);
    expect(computed.wordCount).toBe(6);
    expect(computed.refrainCount).toBe(1);
    expect(computed.stretchWords).toEqual([{ word: 'chair', requiredTier: 5, count: 1 }]);
    // the/cat/sat/on/a decodable or sight; chair is not.
    expect(computed.decodableRatio).toBeLessThan(1);
  });
});

describe('countFocusGrapheme', () => {
  it('counts split digraphs only at word ends', () => {
    expect(countFocusGrapheme('a_e', 'make a cake later')).toBe(2);
  });
  it('counts plain substrings', () => {
    expect(countFocusGrapheme('sh', 'shy fish shop')).toBe(3);
  });
});

describe('findUnknownCapitalised', () => {
  it('flags unwhitelisted above-tier names but not decodable capitalised words', () => {
    const story = {
      band: 'A',
      phase: 'mixed-short',
      allowedHFWTier: 1,
      lines: [{ type: 'text', text: 'The cat and Pike ran on Sand Hill.' }],
    };
    // 'Pike' needs tier 2 (i_e) and is not whitelisted; 'Sand' and 'Hill'
    // are tier-1 decodable once every short vowel is released, so their
    // capitalisation is fine.
    expect(findUnknownCapitalised(story)).toEqual(['pike']);
  });

  it('also flags a name whose vowel the phase has not released yet', () => {
    // At short-a a child has only met /a/, so "Hill" is no more readable
    // than "Pike" — the vowel budget catches it even though it is tier 1.
    const story = {
      band: 'A',
      phase: 'short-a',
      allowedHFWTier: 1,
      lines: [{ type: 'text', text: 'The cat and Pike ran on Sand Hill.' }],
    };
    expect(findUnknownCapitalised(story)).toEqual(['pike', 'hill']);
  });
});

describe('getStoryRules', () => {
  it('uses band rules for core formats and format overrides for teacher-supported ones', () => {
    expect(getStoryRules({ band: 'A', textType: 'mini-decodable' })).toEqual(BAND_RULES.A);
    const sg = getStoryRules({ band: 'B', textType: 'extension-sg' });
    expect(sg.min).toBe(40);
    expect(sg.hfwCap).toBe(3);
    const chapter = getStoryRules({ band: 'D', textType: 'chapter-reader' });
    expect(chapter.min).toBe(80);
    expect(chapter.level).toBe(4);
  });
});

describe('cross-checks against the curriculum', () => {
  // Story-bank tier each curriculum phase's sample words must fit within.
  // Phases 1–5 are early code (tier 1), 6 long vowels (2), 7 diphthongs +
  // /aw/ (4), 8 mixed review may include any pattern up to diphthongs (4),
  // 9 suffixes on familiar bases (3). Phase 10 (morphology) is beyond the
  // story bank's scope. 'blur' is the one curriculum word that leaks an
  // r-controlled vowel into a phase-2 list.
  const PHASE_TIER_CAP = { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 2, 7: 4, 8: 4, 9: 3 };
  const KNOWN_EXCEPTIONS = new Set(['blur']);

  it('every CURRICULUM stage sample word decodes within its phase tier', () => {
    for (const stage of CURRICULUM) {
      const cap = PHASE_TIER_CAP[stage.phase];
      if (!cap) continue;
      for (const w of stage.sampleWords) {
        if (KNOWN_EXCEPTIONS.has(w)) continue;
        expect(requiredTier(w), `${stage.id}: "${w}"`).toBeLessThanOrEqual(cap);
      }
    }
  });

  it('every PHASES sample word decodes within its phase tier', () => {
    for (const phase of PHASES) {
      const cap = PHASE_TIER_CAP[phase.phase];
      if (!cap) continue;
      for (const w of phase.sampleWords) {
        if (KNOWN_EXCEPTIONS.has(w)) continue;
        expect(requiredTier(w), `phase ${phase.phase}: "${w}"`).toBeLessThanOrEqual(cap);
      }
    }
  });
});

describe('whitelists', () => {
  it('are frozen and lowercase', () => {
    expect(Object.isFrozen(PROPER_NOUNS)).toBe(true);
    for (const w of PROPER_NOUNS) expect(w).toBe(w.toLowerCase());
  });
});
