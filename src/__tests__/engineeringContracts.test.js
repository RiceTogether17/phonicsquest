/*
 * Audit 2026-09-19, finding 26 — engineering debt makes consistency expensive.
 *
 * `scripts/check-contracts.mjs` enforces these at build time by reading the
 * source, which is what the acceptance criteria ask for and what catches drift
 * before a deploy. This file checks the same contracts against the real
 * objects, because a static parser can agree with itself and still be wrong
 * about what the app does.
 *
 * The three acceptance criteria:
 *   1. schema validation enforces contracts at build time
 *   2. parallel registries cannot disagree
 *   3. reports never interpret a placeholder duration as observed learner speed
 */

/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

globalThis.speechSynthesis = {
  getVoices: () => [],
  addEventListener: () => {},
  cancel: () => {},
  speak: () => {},
};
globalThis.SpeechSynthesisUtterance = class {
  constructor(text) {
    this.text = text;
  }
};

const root = resolve(import.meta.dirname, '../..');

const { MODES } = await import('../modes/index.js');
const { PHONICS_MODES, SCORERS_WIRED_INTO_UI, REQUIRED_MODE_FIELDS } =
  await import('../modes/phonicsModes.js');

describe('the two mode registries agree (finding 26)', () => {
  it('every educational mode points at a playable one', () => {
    for (const [key, mode] of Object.entries(PHONICS_MODES)) {
      if (!mode.impl) continue;
      expect(MODES[mode.impl], `PHONICS_MODES.${key}.impl = "${mode.impl}"`).toBeTruthy();
    }
  });

  it('every entry carries the metadata the registry promises', () => {
    for (const [key, mode] of Object.entries(PHONICS_MODES)) {
      for (const field of REQUIRED_MODE_FIELDS) {
        expect(mode[field], `PHONICS_MODES.${key}.${field}`).toBeDefined();
      }
      expect(mode.key).toBe(key);
    }
  });

  it('every playable mode’s key matches the slot it is stored in', () => {
    for (const [key, mode] of Object.entries(MODES)) {
      expect(mode.key).toBe(key);
    }
  });

  it('the fluency target comes from the registry, not a second copy', async () => {
    // It was `const TARGET_WPM = 30;` next to a comment claiming it matched
    // the registry — two numbers kept in step by prose.
    const source = readFileSync(resolve(root, 'src/modes/fluencySprintMode.js'), 'utf8');
    expect(source).toContain('PHONICS_MODES.fluencySprint.masteryCriteria.targetWpm');
    expect(source).not.toMatch(/^const TARGET_WPM = \d/m);
    expect(PHONICS_MODES.fluencySprint.masteryCriteria.targetWpm).toBe(30);
  });

  it('the registry no longer calls itself canonical', () => {
    // Its only importer was the dormant prototype, so "canonical" described
    // a registry nothing a child could reach was reading.
    const source = readFileSync(resolve(root, 'src/modes/phonicsModes.js'), 'utf8');
    expect(source).not.toMatch(/Canonical phonics-mode registry/);
    expect(source).not.toMatch(/All seven canonical modes now have dedicated UIs/);
    // And it names which engines are actually wired, rather than claiming all.
    expect(SCORERS_WIRED_INTO_UI).toHaveLength(4);
    expect(Object.keys(PHONICS_MODES)).toHaveLength(7);
  });
});

describe('the Quest Journey prototype is gone (finding 26)', () => {
  it('its files no longer exist', () => {
    // 1,089 lines no shell imported. Its Sound Match builder emitted a
    // grapheme taken from the sample word's first letter, so 38 of 58 stages
    // asked for a sound and keyed a letter that does not spell it — the
    // digraphs stage prompted sh /ʃ/ and marked "s" correct. Its Blend
    // Builder split "ship" into s-h-i-p, teaching the opposite of the stage's
    // own objective.
    for (const path of [
      'src/components/questJourney/index.js',
      'src/components/questJourney/controller.js',
      'src/components/questJourney/rounds.js',
      'src/components/questJourney/screens.js',
      'src/__tests__/questJourney.test.js',
    ]) {
      expect(existsSync(resolve(root, path)), `${path} still exists`).toBe(false);
    }
  });

  it('nothing references it, including the stylesheet', () => {
    const css = readFileSync(resolve(root, 'src/styles/main.css'), 'utf8');
    // Comments stripped: the note recording this fix quotes the old pattern,
    // and a rule is what matters here, not prose about it.
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, '');
    // 25 rules read `var(--qj-*, #hex)` for a token defined nowhere, so every
    // one silently used its hardcoded fallback.
    expect(rules).not.toMatch(/var\(--qj-/);
    // The replacements are declared, so they are tokens rather than phantoms.
    for (const token of [
      '--review-stroke',
      '--review-feedback-correct',
      '--review-feedback-wrong',
      '--review-badge-gold',
    ]) {
      expect(rules, `${token} is used but not defined`).toMatch(new RegExp(`^\\s*${token}:`, 'm'));
    }
  });

  it('the quarantine register lists only modules with a stated reason', () => {
    // "Remove or clearly quarantine prototype pathways." The register is in
    // the build script; this checks it has not become a dumping ground.
    const script = readFileSync(resolve(root, 'scripts/check-contracts.mjs'), 'utf8');
    const block = script.slice(script.indexOf('const QUARANTINE'), script.indexOf('const ENTRIES'));
    const entries = [...block.matchAll(/'(src\/[^']+)'/g)].map((m) => m[1]);
    expect(entries.length).toBeLessThanOrEqual(8);
    for (const entry of entries) {
      expect(existsSync(resolve(root, entry)), `${entry} is quarantined but missing`).toBe(true);
    }
    expect(entries).not.toContain('src/components/questJourney/index.js');
  });
});

describe('no report reads an invented duration as learner speed (finding 26)', () => {
  let store;
  let reporting;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    store = (await import('../modules/store.js')).store;
    reporting = await import('../modules/reporting.js');
  });

  /** One quest attempt in the learning-event log. */
  const attempt = (responseMs) => ({
    eventType: 'quest_attempt',
    quest: 'clozeCastle',
    skill: 'articles',
    correct: true,
    responseMs,
    timestamp: new Date().toISOString(),
  });

  it('a mode that cannot time a response reports no average at all', () => {
    // Before: Cloze Castle wrote responseMs: 2000 and Word Vault 1500/2000,
    // and the parent dashboard printed "Avg response: 2000ms" — a number
    // about a child that was never measured.
    store.set('learningEvents', [attempt(null), attempt(null), attempt(null)]);
    expect(reporting.getLearningFunnelReport({ days: 30 }).avgResponseMs).toBeNull();
  });

  it('a measured duration is still reported', () => {
    store.set('learningEvents', [attempt(4200), attempt(3800)]);
    expect(reporting.getLearningFunnelReport({ days: 30 }).avgResponseMs).toBe(4000);
  });

  it('nulls do not drag a real average down', () => {
    // The old constants were fast, so they pulled the mean towards "quick"
    // and suppressed the slow-response recommendation for children who were
    // genuinely slow elsewhere.
    store.set('learningEvents', [attempt(4200), attempt(3800), attempt(null), attempt(null)]);
    expect(reporting.getLearningFunnelReport({ days: 30 }).avgResponseMs).toBe(4000);
  });
});

describe('an unmeasured answer does not earn the speed bonus (finding 26)', () => {
  let gamification;

  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    ({ gamification } = await import('../modules/gamification.js'));
  });

  it('null means unknown, not instant', () => {
    // `null < 3000` is true in JavaScript, so passing null to the old
    // comparison would have handed every unmeasured answer the fast bonus —
    // the opposite of the fix.
    const unmeasured = gamification.recordCorrect(null, false);
    expect(unmeasured.reasons).not.toContain('Quick answer!');
    expect(unmeasured.reasons).toContain('Correct!');
  });

  it('a genuinely fast measured answer still earns it', () => {
    expect(gamification.recordCorrect(900, false).reasons).toContain('Quick answer!');
  });

  it('a slow measured answer does not', () => {
    expect(gamification.recordCorrect(9000, false).reasons).not.toContain('Quick answer!');
  });
});
