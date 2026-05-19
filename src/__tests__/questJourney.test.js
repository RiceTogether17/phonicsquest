/**
 * Quest Journey — vertical slice tests.
 *
 * Exercises the round builders, every screen, and the controller's
 * end-to-end flow (Welcome → Quest map → Lesson intro → Sound Match × 3
 * → Blend Builder × 3 → Results → Quest map).
 */
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

beforeAll(() => {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
});

let buildSoundMatchRound;
let buildBlendBuilderRound;
let buildLesson;
let renderWelcome;
let renderQuestMap;
let renderLessonIntro;
let renderGameMode;
let renderResults;
let renderMasteryBadge;
let renderProgressView;
let renderProfileSelect;
let mountQuestJourney;

beforeAll(async () => {
  ({
    buildSoundMatchRound,
    buildBlendBuilderRound,
    buildLesson,
    renderWelcome,
    renderProfileSelect,
    renderQuestMap,
    renderLessonIntro,
    renderGameMode,
    renderResults,
    renderMasteryBadge,
    renderProgressView,
    mountQuestJourney,
  } = await import('../components/questJourney/index.js'));
});

// Deterministic RNG factory for reproducible round builds.
function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

// ── Round builders ──────────────────────────────────────────────────────

describe('buildSoundMatchRound', () => {
  it('produces a 4-choice round for cvc-a with the named vowel as the answer', () => {
    const round = buildSoundMatchRound('cvc-a', { rng: seededRng(7) });
    expect(round.mode).toBe('soundMatch');
    expect(round.choices).toHaveLength(4);
    expect(round.choices).toContain('a');
    expect(round.prompt.grapheme).toBe('a');
  });

  it('returns null for an unknown stage', () => {
    expect(buildSoundMatchRound('not-a-stage')).toBeNull();
  });
});

describe('buildBlendBuilderRound', () => {
  it('produces a bank that contains every target grapheme', () => {
    const round = buildBlendBuilderRound('cvc-a', { wordIndex: 0, addDistractor: false, rng: seededRng(3) });
    expect(round.mode).toBe('blendBuilder');
    expect(round.target.word.length).toBe(3);
    for (const g of round.target.graphemes) {
      expect(round.bank).toContain(g);
    }
    expect(round.bank.length).toBe(round.target.graphemes.length);
  });

  it('adds a single distractor when addDistractor is true', () => {
    const round = buildBlendBuilderRound('cvc-a', { addDistractor: true, rng: seededRng(5) });
    expect(round.bank.length).toBe(round.target.graphemes.length + 1);
  });
});

describe('buildLesson', () => {
  it('builds 3 rounds per mode using distinct words', () => {
    const lesson = buildLesson('cvc-a', { roundsPerMode: 3, rng: seededRng(11) });
    expect(lesson.soundMatch).toHaveLength(3);
    expect(lesson.blendBuilder).toHaveLength(3);
    const words = lesson.blendBuilder.map(r => r.target.word);
    expect(new Set(words).size).toBe(3);
  });
});

// ── Screen render shape ────────────────────────────────────────────────

function makeHost() {
  return document.createElement('div');
}

describe('renderWelcome', () => {
  it('renders one main Start button and the secondary tray', () => {
    const host = makeHost();
    renderWelcome(host);
    const cta = host.querySelector('[data-action="start"]');
    expect(cta).not.toBeNull();
    expect(cta.getAttribute('aria-label')).toMatch(/Start/i);
    expect(host.querySelectorAll('button').length).toBeGreaterThanOrEqual(3);
  });

  it('wires onStart to the primary button', () => {
    const host = makeHost();
    let started = 0;
    renderWelcome(host, { onStart: () => started++ });
    host.querySelector('[data-action="start"]').click();
    expect(started).toBe(1);
  });
});

describe('renderProfileSelect', () => {
  it('renders a card per profile plus an "Add player" card', () => {
    const host = makeHost();
    renderProfileSelect(host, { profiles: [
      { id: 'a', name: 'Aanya', avatar: '🐰', meta: 'Phase 1' },
      { id: 'r', name: 'Rohan', avatar: '🦊', meta: 'Phase 2' },
    ] });
    expect(host.querySelectorAll('[data-profile-id]').length).toBe(2);
    expect(host.querySelector('[data-action="create"]')).not.toBeNull();
  });

  it('fires onPick with the profile id', () => {
    const host = makeHost();
    let picked = null;
    renderProfileSelect(host, {
      profiles: [{ id: 'p1', name: 'Test' }],
      onPick: (id) => picked = id,
    });
    host.querySelector('[data-profile-id="p1"]').click();
    expect(picked).toBe('p1');
  });
});

describe('renderQuestMap', () => {
  it('marks the current stage and locks future stages', () => {
    const host = makeHost();
    renderQuestMap(host, {
      currentStageId: 'cvc-a',
      masteredStageIds: [],
      unlockedStageIds: ['cvc-a'],
    });
    const current = host.querySelector('.qj-node--current');
    expect(current).not.toBeNull();
    expect(current.dataset.stageId).toBe('cvc-a');
    expect(host.querySelectorAll('.qj-node--locked').length).toBeGreaterThan(0);
  });

  it('does not fire onPick for a locked node', () => {
    const host = makeHost();
    let picked = null;
    renderQuestMap(host, {
      currentStageId: 'cvc-a',
      masteredStageIds: [],
      unlockedStageIds: ['cvc-a'],
      onPick: (id) => picked = id,
    });
    const locked = host.querySelector('.qj-node--locked');
    locked.click();
    expect(picked).toBeNull();
  });
});

describe('renderLessonIntro', () => {
  it('shows the target sound, a sample word, and a sentence', () => {
    const host = makeHost();
    renderLessonIntro(host, { stageId: 'cvc-a' });
    const bubble = host.querySelector('.qj-sound-bubble');
    const word = host.querySelector('.qj-word-card');
    expect(bubble).not.toBeNull();
    expect(word).not.toBeNull();
    expect(word.textContent.length).toBeGreaterThan(0);
    expect(host.querySelector('.qj-sentence')?.textContent.length).toBeGreaterThan(0);
  });

  it('the start CTA fires onStart with the stage id', () => {
    const host = makeHost();
    let started = null;
    renderLessonIntro(host, { stageId: 'cvc-a', onStart: (id) => started = id });
    host.querySelector('[data-action="start"]').click();
    expect(started).toBe('cvc-a');
  });
});

describe('renderGameMode — Sound Match', () => {
  const round = {
    mode: 'soundMatch',
    prompt: { sound: '/a/', grapheme: 'a' },
    choices: ['a', 'e', 'i', 'o'],
    word: 'cat',
  };

  it('renders 4 sound tiles and the mode instruction', () => {
    const host = makeHost();
    renderGameMode(host, { modeKey: 'soundMatch', round, totalRounds: 3, currentRound: 1 });
    expect(host.querySelectorAll('[data-choice]').length).toBe(4);
    expect(host.querySelector('.qj-game__instruction')?.textContent).toMatch(/Listen/i);
  });

  it('fires onAnswer with the chosen grapheme', () => {
    const host = makeHost();
    let answered = null;
    renderGameMode(host, {
      modeKey: 'soundMatch',
      round,
      onAnswer: (a) => answered = a,
    });
    host.querySelector('[data-choice="a"]').click();
    expect(answered.chosen).toBe('a');
    expect(answered.prompt.grapheme).toBe('a');
  });

  it('renders a correct feedback strip when provided', () => {
    const host = makeHost();
    renderGameMode(host, {
      modeKey: 'soundMatch',
      round,
      feedback: { state: 'correct', copy: 'Yes!', cta: 'Next' },
    });
    const fb = host.querySelector('.qj-feedback');
    expect(fb).not.toBeNull();
    expect(fb.classList.contains('qj-feedback--correct')).toBe(true);
    expect(fb.getAttribute('aria-live')).toBe('polite');
  });

  it('renders the wrong-answer feedback in AMBER, not red, with a hint', () => {
    const host = makeHost();
    renderGameMode(host, {
      modeKey: 'soundMatch',
      round,
      feedback: { state: 'wrong-first', copy: 'Almost!', hint: 'Try again.', cta: 'Try again' },
    });
    const fb = host.querySelector('.qj-feedback');
    expect(fb.classList.contains('qj-feedback--wrong')).toBe(true);
    // Critical accessibility contract: wrong feedback never uses the
    // shared error red token from main.css.
    expect(fb.classList.contains('qj-feedback--error')).toBe(false);
  });
});

describe('renderGameMode — Blend Builder', () => {
  const round = {
    mode: 'blendBuilder',
    target: { word: 'cat', graphemes: ['c', 'a', 't'] },
    bank:   ['t', 'a', 'c', 's'],
  };

  it('renders one slot per grapheme and a bank chip per bank entry', () => {
    const host = makeHost();
    renderGameMode(host, { modeKey: 'blendBuilder', round, totalRounds: 3, currentRound: 1 });
    expect(host.querySelectorAll('[data-slot]').length).toBe(3);
    expect(host.querySelectorAll('[data-bank-index]').length).toBe(4);
  });

  it('placing chips fills slots and "Check" sends them to onAnswer', () => {
    const host = makeHost();
    let answered = null;
    renderGameMode(host, {
      modeKey: 'blendBuilder',
      round,
      onAnswer: (a) => answered = a,
    });
    // Find chips by grapheme — the bank is shuffled so we can't trust index.
    const chip = (g) => [...host.querySelectorAll('[data-bank-index]')].find(b => b.dataset.grapheme === g);
    chip('c').click();
    chip('a').click();
    chip('t').click();
    host.querySelector('[data-action="blend-check"]').click();
    expect(answered.placed).toEqual(['c', 'a', 't']);
  });

  it('reset clears the slots and re-enables chips', () => {
    const host = makeHost();
    renderGameMode(host, { modeKey: 'blendBuilder', round });
    const chip = (g) => [...host.querySelectorAll('[data-bank-index]')].find(b => b.dataset.grapheme === g);
    chip('c').click();
    expect(host.querySelector('.qj-blend__slot--filled')).not.toBeNull();
    host.querySelector('[data-action="blend-reset"]').click();
    expect(host.querySelector('.qj-blend__slot--filled')).toBeNull();
    expect(host.querySelectorAll('[data-bank-index][disabled]').length).toBe(0);
  });
});

describe('renderResults', () => {
  it('shows the right headline for a mastered run', () => {
    const host = makeHost();
    renderResults(host, { summary: {
      name: 'Aanya', stageId: 'cvc-a',
      totalRounds: 6, correctRounds: 6, accuracy: 1, stars: 3,
      wordsPractised: ['cat', 'hat'],
    } });
    const h = host.querySelector('.qj-results__headline');
    expect(h.textContent).toMatch(/mastered/i);
    expect(host.querySelector('.qj-results__stars').textContent.startsWith('★★★')).toBe(true);
  });

  it('uses the supportive headline below 50% accuracy', () => {
    const host = makeHost();
    renderResults(host, { summary: {
      name: 'Aanya', stageId: 'cvc-a',
      totalRounds: 6, correctRounds: 2, accuracy: 0.33, stars: 0,
      wordsPractised: ['cat'],
    } });
    const h = host.querySelector('.qj-results__headline').textContent.toLowerCase();
    expect(h).toMatch(/try this one again/);
  });
});

describe('renderMasteryBadge', () => {
  it('renders a badge with the phase title and skills', () => {
    const host = makeHost();
    renderMasteryBadge(host, {
      phaseNumber: 1,
      skills: ['cat', 'hen', 'bug'],
    });
    expect(host.querySelector('[id="qj-badge-title"]').textContent).toMatch(/CVC Words/);
    expect(host.querySelectorAll('.qj-results__words li').length).toBe(3);
  });
});

describe('renderProgressView', () => {
  it('renders the major sections from a summarise() payload', () => {
    const host = makeHost();
    renderProgressView(host, { summary: {
      currentPhase: 1,
      masteryPercent: 25,
      strongestSounds: [{ sound: '/ă/', accuracy: 0.9, attempts: 10 }],
      weakestSounds:   [{ sound: '/ĕ/', accuracy: 0.3, attempts: 6 }],
      commonErrorTypes: [{ category: 'vowel-confusion', count: 3 }],
      suggestedNext: { id: 'cvc-e', name: 'CVC – Short E' },
      printablePracticeList: [{
        stage: { id: 'cvc-e', name: 'CVC – Short E' },
        sampleWords: ['bed', 'leg'],
        sentence: 'The hen is in the pen.',
      }],
    } });
    expect(host.textContent).toMatch(/Phase 1/);
    expect(host.textContent).toMatch(/CVC – Short E/);
    expect(host.textContent).toMatch(/vowel-confusion/);
    expect(host.querySelector('[data-action="print"]')).not.toBeNull();
  });
});

// ── Controller — end-to-end vertical slice ─────────────────────────────

function makeMemoryStorage() {
  const map = new Map();
  return {
    getItem(k)        { return map.has(k) ? map.get(k) : null; },
    setItem(k, v)     { map.set(k, String(v)); },
    removeItem(k)     { map.delete(k); },
    clear()           { map.clear(); },
  };
}

describe('mountQuestJourney — end-to-end slice', () => {
  let host;
  let storage;
  let controller;

  beforeEach(async () => {
    host = makeHost();
    document.body.appendChild(host);
    storage = makeMemoryStorage();
    const { attemptLog } = await import('../modules/progressAnalytics.js');
    controller = mountQuestJourney(host, {
      attemptLog: attemptLog(storage),
      learnerName: 'Aanya',
      rng: seededRng(42),
    });
  });

  afterEach(() => {
    controller?.destroy();
    host.remove();
  });

  it('starts on the welcome screen', () => {
    expect(controller.getState().screen).toBe('welcome');
    expect(host.querySelector('[data-action="start"]')).not.toBeNull();
  });

  it('Start → lesson intro → start lesson → game mode', () => {
    host.querySelector('[data-action="start"]').click();
    expect(controller.getState().screen).toBe('lesson');
    expect(host.querySelector('.qj-sound-bubble')).not.toBeNull();

    host.querySelector('[data-action="start"]').click();
    expect(controller.getState().screen).toBe('game');
    expect(controller.getState().currentMode).toBe('soundMatch');
  });

  it('plays 3 Sound Match rounds then advances to Blend Builder', () => {
    host.querySelector('[data-action="start"]').click(); // welcome → lesson
    host.querySelector('[data-action="start"]').click(); // lesson → game

    for (let i = 0; i < 3; i++) {
      // Click the correct grapheme (vowel a).
      host.querySelector('[data-choice="a"]').click();
      // Advance through the correct-feedback strip.
      host.querySelector('[data-action="continue"]').click();
    }
    expect(controller.getState().currentMode).toBe('blendBuilder');
  });

  it('finishing all rounds lands on the Results screen', () => {
    host.querySelector('[data-action="start"]').click(); // welcome → lesson
    host.querySelector('[data-action="start"]').click(); // lesson → game

    // 3 sound match
    for (let i = 0; i < 3; i++) {
      host.querySelector('[data-choice="a"]').click();
      host.querySelector('[data-action="continue"]').click();
    }
    // 3 blend builder
    for (let i = 0; i < 3; i++) {
      const round = controller.getState().lesson.blendBuilder[i];
      for (const g of round.target.graphemes) {
        const chip = [...host.querySelectorAll('[data-bank-index]')].find(b => b.dataset.grapheme === g && !b.hasAttribute('disabled'));
        chip?.click();
      }
      host.querySelector('[data-action="blend-check"]').click();
      host.querySelector('[data-action="continue"]').click();
    }

    expect(controller.getState().screen).toBe('results');
    expect(host.querySelector('.qj-results__headline')?.textContent).toMatch(/mastered/i);
  });

  it('logs an attempt per answer with shape compatible with progressAnalytics', () => {
    host.querySelector('[data-action="start"]').click();
    host.querySelector('[data-action="start"]').click();
    host.querySelector('[data-choice="a"]').click(); // correct
    const entries = JSON.parse(storage.getItem('phonicsquest_attempts'));
    expect(entries.length).toBe(1);
    const e = entries[0];
    expect(e).toMatchObject({
      stageId: 'cvc-a',
      mode: 'soundMatch',
      correct: true,
    });
    expect(typeof e.timestamp).toBe('number');
  });

  it('shows a wrong-feedback strip with hint when the child mis-answers', () => {
    host.querySelector('[data-action="start"]').click();
    host.querySelector('[data-action="start"]').click();
    host.querySelector('[data-choice="e"]').click(); // wrong
    const fb = host.querySelector('.qj-feedback');
    expect(fb.classList.contains('qj-feedback--wrong')).toBe(true);
    expect(fb.textContent).toMatch(/almost/i);
  });
});
