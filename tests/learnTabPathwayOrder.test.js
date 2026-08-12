import { beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * A primary profile's Learn tab must lead with Primary English, not with the
 * K1–K2 Early Reading Quest.
 *
 * Two silent CSS failures used to break this. `.home-section--primary-priority`
 * reorders with `order: -1`, which browsers ignore unless the parent is a flex
 * or grid container — and `.home-tabpanel` was `display: block`. Meanwhile
 * `.home-section--collapsed` only dimmed the phonics block to `opacity: .85`,
 * leaving all 1,886 px of it expanded above the syllabus content.
 *
 * jsdom does not lay out, so the ordering half is asserted in
 * `e2e/`; what is checked here is the part jsdom can see: the phonics
 * section really is reduced to a closed disclosure, and restoring it puts
 * every child back where it was.
 */

function stubAudioGlobals() {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
    paused: false,
    resume: () => {},
  };
  globalThis.SpeechSynthesisUtterance = class {
    constructor(t) {
      this.text = t;
    }
  };
  globalThis.AudioContext =
    globalThis.AudioContext ||
    class {
      constructor() {
        this.state = 'running';
      }
      createOscillator() {
        return { connect() {}, start() {}, stop() {}, frequency: { value: 0 } };
      }
      createGain() {
        return {
          connect() {},
          gain: {
            value: 1,
            setValueAtTime() {},
            exponentialRampToValueAtTime() {},
            linearRampToValueAtTime() {},
          },
        };
      }
      get destination() {
        return {};
      }
      resume() {
        return Promise.resolve();
      }
    };
}

function buildCoreSection() {
  document.body.innerHTML = `
    <div class="home-section" id="home-core-section">
      <div class="home-section-header"><p class="home-section-heading">🌱 Early Reading Quest</p></div>
      <div id="learn-journey-map"></div>
      <nav class="mode-grid">
        <button class="mode-card" data-mode="first">First Sound</button>
        <button class="mode-card" data-mode="last">Last Sound</button>
      </nav>
    </div>`;
  return document.getElementById('home-core-section');
}

describe('the Early Reading Quest strip on a primary Learn tab', () => {
  beforeEach(() => {
    vi.resetModules();
    stubAudioGlobals();
  });

  it('collapses the phonics block behind a closed disclosure', async () => {
    const { app } = await import('../src/app.js');
    const section = buildCoreSection();

    app._renderPrimaryEarlyReadingNote(section);

    const toggle = section.querySelector('.early-reading-toggle');
    const body = section.querySelector('.early-reading-body');
    expect(toggle).not.toBeNull();
    expect(body.hidden).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(toggle.getAttribute('aria-controls')).toBe(body.id);

    // The tiles still exist — they moved inside the disclosure, not away.
    expect(body.querySelectorAll('.mode-card')).toHaveLength(2);
    expect(section.querySelector('.mode-grid').closest('.early-reading-body')).toBe(body);
  });

  it('opens on demand and reports the new state to assistive tech', async () => {
    const { app } = await import('../src/app.js');
    const section = buildCoreSection();
    app._renderPrimaryEarlyReadingNote(section);

    const toggle = section.querySelector('.early-reading-toggle');
    toggle.click();

    expect(section.querySelector('.early-reading-body').hidden).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');

    toggle.click();
    expect(section.querySelector('.early-reading-body').hidden).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('is applied only once, however many times the home re-renders', async () => {
    const { app } = await import('../src/app.js');
    const section = buildCoreSection();

    app._renderPrimaryEarlyReadingNote(section);
    app._renderPrimaryEarlyReadingNote(section);

    expect(section.querySelectorAll('.early-reading-toggle')).toHaveLength(1);
    expect(section.querySelectorAll('.early-reading-body')).toHaveLength(1);
  });

  it('restores the full section when the profile is not on the primary pathway', async () => {
    const { app } = await import('../src/app.js');
    const section = buildCoreSection();

    app._renderPrimaryEarlyReadingNote(section);
    app._restoreEarlyReadingSection(section);

    expect(section.querySelector('.early-reading-toggle')).toBeNull();
    expect(section.querySelector('.early-reading-body')).toBeNull();
    expect(section.querySelector('.early-reading-note')).toBeNull();
    expect(section.querySelectorAll('.mode-card')).toHaveLength(2);
    expect(section.querySelector('#learn-journey-map')).not.toBeNull();
  });

  it('restoring a section that was never collapsed is a no-op', async () => {
    const { app } = await import('../src/app.js');
    const section = buildCoreSection();

    app._restoreEarlyReadingSection(section);
    app._restoreEarlyReadingSection(null);

    expect(section.querySelectorAll('.mode-card')).toHaveLength(2);
  });
});
