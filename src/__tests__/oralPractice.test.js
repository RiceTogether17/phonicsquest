/**
 * Oral Practice: the sets are complete and fit their level, the self-check
 * adds up, and the screens walk from reading aloud to the conversation to
 * the results without needing a microphone.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.hoisted(() => {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
});

const { ORAL_BANDS, ORAL_SETS, oralSetsForBand } = await import('../data/oralSets.js');
const {
  READING_CHECKS,
  TALK_CHECKS,
  summariseOral,
  initOralPractice,
  showOralBrowser,
  cleanupOralPractice,
} = await import('../modes/oralPractice.js');
const { store } = await import('../modules/store.js');

const words = (text) => text.split(/\s+/).filter(Boolean).length;

describe('oral sets', () => {
  it('offers at least two sets in every band', () => {
    for (const band of ORAL_BANDS) {
      expect(oralSetsForBand(band).length, band).toBeGreaterThanOrEqual(2);
    }
  });

  it('gives every set a purpose, words to rehearse, a notice and three questions', () => {
    const ids = new Set();
    for (const s of ORAL_SETS) {
      expect(ids.has(s.id), `${s.id} is repeated`).toBe(false);
      ids.add(s.id);
      expect(ORAL_BANDS).toContain(s.band);
      expect(s.purpose.length, `${s.id}: purpose`).toBeGreaterThan(20);
      expect(s.watch.length, `${s.id}: watch words`).toBeGreaterThanOrEqual(3);
      expect(s.notice.lines.length, `${s.id}: notice`).toBeGreaterThanOrEqual(3);
      expect(s.prompts.length, `${s.id}: prompts`).toBe(3);
      for (const p of s.prompts) {
        expect(p.q.trim(), `${s.id}: question`).toMatch(/[?.]$/);
        expect(p.starters.length, `${s.id}: starters`).toBeGreaterThanOrEqual(2);
        // A model answer has to show the answer-reason-example shape.
        expect(words(p.model), `${s.id}: model for "${p.q}"`).toBeGreaterThanOrEqual(25);
      }
    }
  });

  it('only asks a child to rehearse words that are in the passage', () => {
    for (const s of ORAL_SETS) {
      const text = s.passage.join(' ').toLowerCase();
      for (const w of s.watch) {
        expect(text.includes(w.word.toLowerCase()), `${s.id}: "${w.word}"`).toBe(true);
      }
    }
  });

  it('keeps each passage to a length its level can read in one go', () => {
    const range = { 'P1-P2': [50, 100], 'P3-P4': [90, 160], 'P5-P6': [130, 220] };
    for (const s of ORAL_SETS) {
      const n = words(s.passage.join(' '));
      const [min, max] = range[s.band];
      expect(n, `${s.id} has ${n} words`).toBeGreaterThanOrEqual(min);
      expect(n, `${s.id} has ${n} words`).toBeLessThanOrEqual(max);
    }
  });
});

describe('summariseOral', () => {
  const full = (checks) => Object.fromEntries(checks.map((c) => [c.id, 2]));

  it('adds up both parts and has nothing to fix when everything is a yes', () => {
    const sum = summariseOral(full(READING_CHECKS), [full(TALK_CHECKS), full(TALK_CHECKS)]);
    expect(sum.readingScore).toBe(sum.readingMax);
    expect(sum.talkScore).toBe(sum.talkMax);
    expect(sum.nextStep).toBeNull();
    expect(sum.examGuide).toMatchObject({ reading: 15, talk: 25 });
  });

  it('names the weakest check as the next thing to work on', () => {
    const reading = { ...full(READING_CHECKS), feeling: 0 };
    const sum = summariseOral(reading, [full(TALK_CHECKS)]);
    expect(sum.nextStep.id).toBe('feeling');
    expect(sum.readingScore).toBe(sum.readingMax - 2);
  });

  it('looks across all three answers for the conversation', () => {
    const talk = [
      { ideas: 0, clear: 2 },
      { ideas: 1, clear: 2 },
      { ideas: 0, clear: 2 },
    ];
    const sum = summariseOral(full(READING_CHECKS), talk);
    expect(sum.nextStep.id).toBe('ideas');
    expect(sum.talkScore).toBe(7);
    expect(sum.talkMax).toBe(12);
  });
});

describe('the practice itself', () => {
  let host;
  const click = (sel) => host.querySelector(sel).click();
  const rateAll = () => {
    const checks = new Set(
      [...host.querySelectorAll('[data-act="rate"]')].map((b) => b.dataset.check),
    );
    for (const id of checks) click(`[data-act="rate"][data-check="${id}"][data-value="2"]`);
  };

  beforeEach(() => {
    cleanupOralPractice();
    document.body.innerHTML = '<div id="host"></div>';
    host = document.getElementById('host');
    store.set('oralCompleted', {});
    initOralPractice(host, () => {});
    showOralBrowser();
  });

  it('lists the sets for the chosen band', () => {
    click('[data-act="band"][data-band="P5-P6"]');
    const cards = host.querySelectorAll('[data-act="open"]');
    expect(cards.length).toBe(oralSetsForBand('P5-P6').length);
  });

  it('holds back the conversation until the reading has been checked', () => {
    click('[data-act="open"]');
    expect(host.querySelector('#oral-passage')).not.toBeNull();
    expect(host.querySelector('[data-act="to-talk"]').disabled).toBe(true);
    rateAll();
    expect(host.querySelector('[data-act="to-talk"]').disabled).toBe(false);
  });

  it('shows a model answer only after the child says they have answered', () => {
    click('[data-act="open"]');
    rateAll();
    click('[data-act="to-talk"]');
    expect(host.querySelector('.oral-notice')).not.toBeNull();
    expect(host.querySelector('.oral-model')).toBeNull();
    click('[data-act="show-model"]');
    expect(host.querySelector('.oral-model')).not.toBeNull();
  });

  it('walks through all three questions and saves the result', () => {
    const id = host.querySelector('[data-act="open"]').dataset.id;
    click('[data-act="open"]');
    rateAll();
    click('[data-act="to-talk"]');
    for (let i = 0; i < 3; i++) {
      click('[data-act="show-model"]');
      rateAll();
      click('[data-act="next-prompt"]');
    }
    expect(host.querySelector('.oral-scores')).not.toBeNull();
    const saved = store.get('oralCompleted')[id];
    expect(saved.reading).toBe(saved.readingMax);
    expect(saved.talk).toBe(saved.talkMax);
  });

  it('works without a microphone', () => {
    click('[data-act="open"]');
    // jsdom has no MediaRecorder, which is also the case on some school devices.
    expect(host.querySelector('[data-act="record-start"]')).toBeNull();
    expect(host.querySelector('#oral-recorder').textContent).toMatch(/aloud/);
  });
});
