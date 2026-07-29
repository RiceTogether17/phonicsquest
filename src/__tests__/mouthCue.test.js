/**
 * Articulation mouth cues.
 *
 * The mapping in data/articulation.js is educational content carrying an
 * explicit review note, so these tests pin its *structural* guarantees —
 * total coverage, valid shapes, no gaps — rather than asserting that any
 * particular phonetic judgement is correct. Those judgements are for a
 * specialist to confirm; these tests make sure a correction can't silently
 * leave a phoneme unmapped.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { PHONEME_MOUTH, MOUTH_SHAPES, getMouthCue } from '../data/articulation.js';
import { renderMouthCue, MOUTH_SHAPE_KEYS } from '../components/mouthCue.js';

let host;
beforeEach(() => {
  document.body.innerHTML = '<div id="host"></div>';
  host = document.getElementById('host');
});

describe('mapping coverage', () => {
  it('maps every phoneme that appears in the word bank', async () => {
    const { WORDS } = await import('../data/words.js');
    const used = new Set();
    WORDS.forEach(w => (w.phonemes || []).forEach(p => used.add(p)));

    const unmapped = [...used].filter(p => !PHONEME_MOUTH[p]);
    expect(unmapped, `unmapped phonemes: ${unmapped.join(' ')}`).toEqual([]);
    expect(used.size).toBeGreaterThan(60);
  });

  it('only references shapes that actually exist', () => {
    for (const [phoneme, shape] of Object.entries(PHONEME_MOUTH)) {
      expect(MOUTH_SHAPES[shape], `${phoneme} -> ${shape}`).toBeTruthy();
    }
  });

  it('has a drawing for every declared shape', () => {
    for (const shape of Object.keys(MOUTH_SHAPES)) {
      expect(MOUTH_SHAPE_KEYS, shape).toContain(shape);
    }
  });

  it('gives every shape a child-actionable label and cue', () => {
    for (const [shape, def] of Object.entries(MOUTH_SHAPES)) {
      expect(def.label, shape).toBeTruthy();
      expect(def.cue, shape).toBeTruthy();
      // Cues are instructions to try, not phonetics jargon.
      expect(def.cue, shape).toMatch(/[.!]$/);
      expect(def.cue.toLowerCase(), shape).not.toMatch(/bilabial|alveolar|fricative|plosive/);
    }
  });

  it('keeps doubled graphemes on the same shape as their single form', () => {
    const pairs = [['/b/', '/bb/'], ['/f/', '/ff/'], ['/s/', '/ss/'],
      ['/t/', '/tt/'], ['/l/', '/ll/'], ['/n/', '/nn/'], ['/p/', '/pp/'], ['/g/', '/gg/']];
    for (const [single, doubled] of pairs) {
      expect(PHONEME_MOUTH[doubled], doubled).toBe(PHONEME_MOUTH[single]);
    }
  });

  it('groups the sounds children most often confuse onto a shared shape', () => {
    // The cue's whole purpose: /b/-/p/ and /d/-/t/ look identical, so the
    // diagram must not imply they differ in mouth position.
    expect(PHONEME_MOUTH['/b/']).toBe(PHONEME_MOUTH['/p/']);
    expect(PHONEME_MOUTH['/d/']).toBe(PHONEME_MOUTH['/t/']);
    expect(PHONEME_MOUTH['/f/']).toBe(PHONEME_MOUTH['/v/']);
    expect(PHONEME_MOUTH['/s/']).toBe(PHONEME_MOUTH['/z/']);
  });
});

describe('getMouthCue', () => {
  it('accepts slash and bare notation alike', () => {
    expect(getMouthCue('/b/').shape).toBe('lips-closed');
    expect(getMouthCue('b').shape).toBe('lips-closed');
  });

  it('returns label and cue alongside the shape', () => {
    const cue = getMouthCue('/m/');
    expect(cue.label).toBeTruthy();
    expect(cue.cue).toBeTruthy();
  });

  it('returns null for anything unmapped or malformed', () => {
    expect(getMouthCue('/zzz/')).toBeNull();
    expect(getMouthCue('')).toBeNull();
    expect(getMouthCue(null)).toBeNull();
    expect(getMouthCue(42)).toBeNull();
  });
});

describe('rendering', () => {
  it('draws a diagram and the text instruction', () => {
    expect(renderMouthCue('/b/', host)).toBe(true);
    expect(host.querySelector('svg')).toBeTruthy();
    expect(host.querySelector('.mouth-cue__text').textContent).toMatch(/lips/i);
    expect(host.dataset.shape).toBe('lips-closed');
  });

  it('can omit the text instruction', () => {
    renderMouthCue('/b/', host, { showCue: false });
    expect(host.querySelector('svg')).toBeTruthy();
    expect(host.querySelector('.mouth-cue__text')).toBeNull();
  });

  it('renders a distinct drawing for each shape', () => {
    const drawn = new Set();
    for (const phoneme of ['/b/', '/f/', '/th/', '/t/', '/k/', '/h/', '/sh/',
      '/w/', '/a/', '/e/', '/ee/', '/o/', '/oi/']) {
      renderMouthCue(phoneme, host);
      drawn.add(host.querySelector('svg').innerHTML);
    }
    // 13 shapes, 13 different drawings — no shape silently falls back.
    expect(drawn.size).toBe(13);
  });

  it('reports false and renders nothing for an unmapped phoneme', () => {
    expect(renderMouthCue('/zzz/', host)).toBe(false);
    expect(host.innerHTML).toBe('');
  });

  it('is a no-op without a host', () => {
    expect(renderMouthCue('/b/', null)).toBe(false);
  });

  it('clears the previous cue when switching sounds', () => {
    renderMouthCue('/b/', host);
    renderMouthCue('/ee/', host);
    expect(host.querySelectorAll('svg').length).toBe(1);
    expect(host.dataset.shape).toBe('vowel-smile');
  });
});

describe('accessibility', () => {
  it('gives the diagram a text alternative carrying the instruction', () => {
    renderMouthCue('/m/', host);
    const diagram = host.querySelector('.mouth-cue__diagram');
    expect(diagram.getAttribute('role')).toBe('img');
    expect(diagram.getAttribute('aria-label')).toContain('Lips together');
    expect(diagram.getAttribute('aria-label')).toMatch(/press both lips/i);
  });

  it('announces the instruction once, not twice', () => {
    renderMouthCue('/m/', host);
    // The visible text repeats the label, so it is hidden from AT.
    expect(host.querySelector('.mouth-cue__text').getAttribute('aria-hidden')).toBe('true');
    expect(host.querySelectorAll('[role="img"]').length).toBe(1);
  });

  it('keeps the svg itself out of the accessibility tree', () => {
    renderMouthCue('/m/', host);
    const svg = host.querySelector('svg');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(svg.getAttribute('focusable')).toBe('false');
  });
});
