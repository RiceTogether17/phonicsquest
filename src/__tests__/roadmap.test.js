/**
 * Tests for the parent Learning Roadmap (components/roadmap.js) and the
 * shared journey bar builder (components/journeyBar.js).
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => { store[key] = String(val); }),
    removeItem: vi.fn((key) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

let store;
let roadmap;
let journeyBar;

beforeEach(async () => {
  localStorageMock.clear();
  vi.resetModules();
  document.body.innerHTML = '<div id="host"></div>';
  store = (await import('../modules/store.js')).store;
  journeyBar = await import('../components/journeyBar.js');
  roadmap = await import('../components/roadmap.js');
});

describe('journeyBar', () => {
  it('computes 0% for a fresh pre-reader', () => {
    const { safeIdx, totalProgress } = journeyBar.computeJourneyProgress('pre-reader', {});
    expect(safeIdx).toBe(0);
    expect(totalProgress).toBe(0);
  });

  it('adds within-stage credit from group mastery', () => {
    const { totalProgress } = journeyBar.computeJourneyProgress('pre-reader', { 'cvc-a': 0.8 });
    expect(totalProgress).toBeGreaterThan(0);
    expect(totalProgress).toBeLessThan(25);
  });

  it('a reader starts at 75%', () => {
    const { safeIdx, totalProgress } = journeyBar.computeJourneyProgress('reader', {});
    expect(safeIdx).toBe(3);
    expect(totalProgress).toBeGreaterThanOrEqual(75);
  });

  it('builds markup with current stage and progressbar', () => {
    const html = journeyBar.buildJourneyBarHtml('emerging-decoder', {});
    expect(html).toContain('journey-stage--current');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('Emerging');
  });
});

describe('renderRoadmap', () => {
  it('renders all parent sections for a fresh pre-reader', () => {
    const host = document.getElementById('host');
    roadmap.renderRoadmap(host, {});

    const text = host.textContent;
    expect(text).toContain('Learning Roadmap');
    expect(text).toContain('is now');                  // where they are
    expect(text).toContain('Phonics foundations');
    expect(text).toContain('How to help this week');
    expect(text).toContain('Primary English skills');
    expect(text).toContain('Parent Dashboard');
    // journey bar present
    expect(host.querySelector('.reading-journey-bar')).toBeTruthy();
    // phase cards present
    expect(host.querySelectorAll('.cm-phase').length).toBeGreaterThanOrEqual(5);
  });

  it('shows locked quest gates with progress for a pre-reader', () => {
    const host = document.getElementById('host');
    roadmap.renderRoadmap(host, {});
    const text = host.textContent;
    // quests are locked for a fresh profile with no mastered words
    expect(text).toContain("What's locked");
    expect(text).toMatch(/opens after\s+\d+\s+mastered words/);
  });

  it('explains phonics stage locks in plain language when progress exists', () => {
    // Some cvc-a progress so the next stage's gate has data to explain
    store.set('groupMastery', { 'cvc-a': 0.5 });
    store.set('wordStats', { cat: { attempts: 4, correct: 2 } });
    const host = document.getElementById('host');
    roadmap.renderRoadmap(host, {});
    const lockCards = host.querySelectorAll('.roadmap-lock-card');
    expect(lockCards.length).toBeGreaterThan(0);
  });

  it('fires onGoToday and onOpenDashboard callbacks', () => {
    const host = document.getElementById('host');
    const onGoToday = vi.fn();
    const onOpenDashboard = vi.fn();
    roadmap.renderRoadmap(host, { onGoToday, onOpenDashboard });

    host.querySelector('#roadmap-go-today').click();
    host.querySelector('#roadmap-open-dashboard').click();
    expect(onGoToday).toHaveBeenCalledTimes(1);
    expect(onOpenDashboard).toHaveBeenCalledTimes(1);
  });

  it('includes tricky words for the current stage', () => {
    const host = document.getElementById('host');
    roadmap.renderRoadmap(host, {});
    // phase 1 tricky words include "the"
    expect(host.textContent).toContain('Tricky words');
    expect(host.querySelectorAll('.progress-chip').length).toBeGreaterThan(0);
  });
});
