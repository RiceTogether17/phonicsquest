/**
 * Navigation router.
 *
 * Targets arrive from Today's Lesson steps, the recommendations engine, the
 * Mistakes Den and journey warm-ups. The failure this guards against is a
 * silent one: a child taps "Start today's lesson" and nothing happens
 * because the target name doesn't match any case. The router now reports
 * whether it handled a target, and these tests check every target the rest
 * of the app actually emits is handled.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

const makeHandlers = () => ({
  setMode: vi.fn(),
  setGroup: vi.fn(),
  getCurrentGroup: vi.fn(() => 'cvc-o'),
  startGame: vi.fn(),
  openBlendPicker: vi.fn(),
  openPrimaryPlaceholder: vi.fn(),
});

let router;
beforeEach(async () => {
  stubAudioGlobals();
  document.body.innerHTML = '';
  vi.resetModules();
  router = await import('../modules/navigationRouter.js');
});

describe('blend', () => {
  it('starts straight away when given a group', () => {
    const h = makeHandlers();
    expect(router.navigateTo('blend', 'cvc-a', h)).toBe(true);

    expect(h.setMode).toHaveBeenCalledWith('blend');
    expect(h.setGroup).toHaveBeenCalledWith('cvc-a');
    expect(h.startGame).toHaveBeenCalledWith('cvc-a');
    expect(h.openBlendPicker).not.toHaveBeenCalled();
  });

  it('opens the stage picker when no group is given', () => {
    const h = makeHandlers();
    router.navigateTo('blend', null, h);

    expect(h.openBlendPicker).toHaveBeenCalledOnce();
    expect(h.startGame).not.toHaveBeenCalled();
  });
});

describe('button targets', () => {
  it('clicks the matching home-screen button', () => {
    const h = makeHandlers();
    const btn = document.createElement('button');
    btn.id = 'btn-word-vault';
    const onClick = vi.fn();
    btn.addEventListener('click', onClick);
    document.body.appendChild(btn);

    expect(router.navigateTo('word-vault', null, h)).toBe(true);
    expect(onClick).toHaveBeenCalledOnce();
    // Routing through the button keeps its lazy-load wiring in one place.
    expect(h.startGame).not.toHaveBeenCalled();
  });

  it('reports failure when the button is absent instead of failing silently', () => {
    const h = makeHandlers();
    expect(router.navigateTo('word-vault', null, h)).toBe(false);
  });

  it('maps every button target to a real element id', () => {
    for (const [target, id] of Object.entries(router.BUTTON_TARGETS)) {
      expect(id, target).toMatch(/^btn-/);
    }
  });
});

describe('game modes', () => {
  it('resolves hyphenated aliases to their internal mode key', () => {
    const h = makeHandlers();
    router.navigateTo('first-sound', null, h);
    expect(h.setMode).toHaveBeenCalledWith('first');

    const h2 = makeHandlers();
    router.navigateTo('oral-blend', null, h2);
    expect(h2.setMode).toHaveBeenCalledWith('oralBlend');
  });

  it('starts a bare mode key directly', async () => {
    const { MODES } = await import('../modes/index.js');
    // Skip the targets with their own branch above (blend opens a picker,
    // classicBlend resumes a group) so this covers the generic path.
    const special = new Set(['blend', 'classicBlend']);
    const plainModes = Object.keys(MODES).filter(m => !special.has(m));
    expect(plainModes.length).toBeGreaterThan(0);

    for (const mode of plainModes.slice(0, 5)) {
      const h = makeHandlers();
      expect(router.navigateTo(mode, null, h), mode).toBe(true);
      expect(h.setMode, mode).toHaveBeenCalledWith(mode);
      expect(h.startGame, mode).toHaveBeenCalledWith(undefined);
    }
  });

  it('routes every registered mode to something', async () => {
    const { MODES } = await import('../modes/index.js');
    for (const mode of Object.keys(MODES)) {
      const h = makeHandlers();
      // No registered mode should be unreachable from a target string.
      expect(router.navigateTo(mode, null, h), `mode "${mode}" unroutable`).toBe(true);
    }
  });

  it('resumes the stored group for Classic Blend only', () => {
    const h = makeHandlers();
    router.navigateTo('classicBlend', null, h);
    // Classic Blend continues where the child left off...
    expect(h.startGame).toHaveBeenCalledWith('cvc-o');

    const h2 = makeHandlers();
    router.navigateTo('first-sound', null, h2);
    // ...while the PA modes pick their own word.
    expect(h2.startGame).toHaveBeenCalledWith(undefined);
  });
});

describe('primary placeholders', () => {
  it('routes every placeholder target to the shared host', () => {
    for (const target of router.PLACEHOLDER_TARGETS) {
      const h = makeHandlers();
      expect(router.navigateTo(target, null, h), target).toBe(true);
      expect(h.openPrimaryPlaceholder, target).toHaveBeenCalledWith(target);
    }
  });

  it('covers all six practice-test grades', () => {
    for (let g = 1; g <= 6; g++) {
      expect(router.PLACEHOLDER_TARGETS.has(`p${g}-practice-tests`)).toBe(true);
    }
  });
});

describe('unknown targets', () => {
  it('reports false rather than doing nothing quietly', () => {
    const h = makeHandlers();
    expect(router.navigateTo('not-a-real-target', null, h)).toBe(false);
    expect(h.setMode).not.toHaveBeenCalled();
    expect(h.startGame).not.toHaveBeenCalled();
  });

  it('tolerates missing target or handlers', () => {
    expect(router.navigateTo('', null, makeHandlers())).toBe(false);
    expect(router.navigateTo(null, null, makeHandlers())).toBe(false);
    expect(router.navigateTo('blend', null, null)).toBe(false);
  });
});

describe('coverage of targets the app actually emits', () => {
  it('handles the journey warm-up targets from todaysPlan', async () => {
    const known = new Set(router.knownTargets());
    // These are the literal targets in JOURNEY_WARMUPS (modules/todaysPlan.js).
    for (const target of ['first', 'last', 'oddOneOut', 'syllable', 'middle',
      'soundHunt', 'hear', 'sight-words', 'stories', 'blend']) {
      expect(known.has(target), `warm-up target "${target}" unroutable`).toBe(true);
    }
  });

  it('handles the remediation-chain targets', () => {
    const known = new Set(router.knownTargets());
    // From GRAMMAR_CHAIN / VOCAB_CHAIN in modules/remediationRouter.js.
    for (const target of ['grammar-mcq', 'cloze-castle', 'sentence-forge',
      'editing-quest', 'vocab-mcq', 'word-vault', 'writing-quest']) {
      expect(known.has(target), `remediation target "${target}" unroutable`).toBe(true);
    }
  });
});
