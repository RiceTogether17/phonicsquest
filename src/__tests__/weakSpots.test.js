/**
 * Weak spots: the phonics games log which two sounds a child mixes up, and
 * the dashboard turns that, with what the app already knows, into a short
 * list a parent or tutor can act on.
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

const { store } = await import('../modules/store.js');
const { recordSoundConfusion, getSoundConfusions } = await import('../modules/soundConfusions.js');
const { buildWeakSpots, weakSpotsText, MAX_WEAK_SPOTS } = await import('../modules/weakSpots.js');
const { diagnosePhonicsSlip } = await import('../modules/phonicsDiagnosis.js');
const { createChoiceRound } = await import('../modes/choiceRound.js');
const { WORDS } = await import('../data/words.js');

const bad = WORDS.find((w) => w.word === 'bad');

beforeEach(() => {
  store.set('soundConfusions', {});
  store.set('misconceptionLog', {});
  store.set('oralCompleted', {});
  store.set('wordStats', {});
  store.set('questAttempts', []);
});

describe('sound confusions', () => {
  it('counts a pair the same whichever way round it was mixed up', () => {
    recordSoundConfusion({ target: '/a/', chosen: '/e/', word: 'bad' });
    recordSoundConfusion({ target: '/e/', chosen: '/a/', word: 'bed' });
    const [pair] = getSoundConfusions();
    expect(pair.sounds).toEqual(['/a/', '/e/']);
    expect(pair.count).toBe(2);
    expect(pair.words).toEqual(['bed', 'bad']);
  });

  it('says nothing about a single slip, or an old one', () => {
    recordSoundConfusion({ target: '/a/', chosen: '/e/', word: 'bad' });
    expect(getSoundConfusions()).toEqual([]);
    recordSoundConfusion({ target: '/a/', chosen: '/e/', word: 'bad' });
    const later = Date.now() + 15 * 24 * 60 * 60 * 1000;
    expect(getSoundConfusions({ now: later })).toEqual([]);
  });

  it('a diagnosis names the two sounds, except when the sound was only misplaced', () => {
    const swap = diagnosePhonicsSlip({
      word: bad,
      position: 'middle',
      target: { grapheme: 'a', type: 'sv' },
      chosen: { grapheme: 'e', type: 'sv' },
    });
    expect(swap.slip).toEqual({ target: '/a/', chosen: '/e/', word: 'bad' });

    const misplaced = diagnosePhonicsSlip({
      word: bad,
      position: 'first',
      target: { grapheme: 'b', type: 'c' },
      chosen: { grapheme: 'd', type: 'c' },
    });
    expect(misplaced.id).toBe('sound-elsewhere');
    expect(misplaced.slip).toBeUndefined();
  });

  it('a game logs the first wrong tap, once', () => {
    document.body.innerHTML = `<div id="area"><div class="choice-grid">
      <button class="choice-btn" data-correct="true">a</button>
      <button class="choice-btn" data-correct="false">e</button>
      <button class="choice-btn" data-correct="false">i</button></div></div>`;
    const area = document.getElementById('area');
    const [right, e, i] = area.querySelectorAll('.choice-btn');
    const round = createChoiceRound({
      modeArea: area,
      grid: area.querySelector('.choice-grid'),
      onResult: () => {},
      diagnose: (choice) =>
        diagnosePhonicsSlip({
          word: bad,
          position: 'middle',
          target: { grapheme: 'a', type: 'sv' },
          chosen: choice,
        }),
    });
    round.handleTap(false, e, { grapheme: 'e', type: 'sv' });
    round.handleTap(false, i, { grapheme: 'i', type: 'sv' });
    expect(right.disabled).toBe(true);
    const log = store.get('soundConfusions');
    expect(Object.keys(log)).toEqual(['/a/ /e/']);
    expect(log['/a/ /e/'].count).toBe(1);
  });
});

describe('buildWeakSpots', () => {
  it('is empty for a child with nothing recorded', () => {
    expect(buildWeakSpots()).toEqual([]);
  });

  it('leads with the sounds a child mixes up, and says what to do', () => {
    for (const word of ['bad', 'bed', 'pen']) {
      recordSoundConfusion({ target: '/a/', chosen: '/e/', word });
    }
    const [first] = buildWeakSpots();
    expect(first.kind).toBe('sounds');
    expect(first.title).toBe('Mixes up the sounds /a/ and /e/');
    expect(first.evidence).toContain('3 times');
    expect(first.evidence).toContain('"pen", "bed" and "bad"');
    expect(first.action.length).toBeGreaterThan(20);
  });

  it('adds the latest oral check and never lists more than five things', () => {
    for (const [a, b] of [
      ['/a/', '/e/'],
      ['/i/', '/e/'],
      ['/b/', '/d/'],
    ]) {
      recordSoundConfusion({ target: a, chosen: b, word: 'x' });
      recordSoundConfusion({ target: a, chosen: b, word: 'y' });
    }
    store.set('oralCompleted', {
      old: { at: '2026-01-01T00:00:00.000Z', nextStep: 'words' },
      new: { at: '2026-02-01T00:00:00.000Z', nextStep: 'ideas' },
    });
    const spots = buildWeakSpots();
    expect(spots.length).toBeLessThanOrEqual(MAX_WEAK_SPOTS);
    expect(spots.filter((s) => s.kind === 'sounds').length).toBe(2);
    expect(spots.find((s) => s.kind === 'oral').title).toMatch(/reason and an example/);
  });

  it('can be copied as a short numbered note', () => {
    recordSoundConfusion({ target: '/a/', chosen: '/e/', word: 'bad' });
    recordSoundConfusion({ target: '/a/', chosen: '/e/', word: 'bed' });
    const text = weakSpotsText(buildWeakSpots(), 'Mei');
    expect(text.split('\n')[0]).toBe('What Mei needs next:');
    expect(text.split('\n')[1]).toMatch(/^1\. Mixes up the sounds/);
    expect(weakSpotsText([])).toBe('');
  });
});
