/**
 * The closing screen celebrates learning (words read, words kept, what is
 * next) and focus breaks are offered after steady play, never after mistakes.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  wordsReadToday,
  wordsKeptToday,
  nextAdventure,
  effortMessage,
} from '../modules/sessionWins.js';
import {
  FocusTimer,
  FOCUS_MINUTES,
  IDLE_RESET_MINUTES,
  CALM_BREAKS,
  pickBreak,
  showFocusBreak,
} from '../modules/focusBreak.js';
import { CURRICULUM, MASTERY_THRESHOLD } from '../data/curriculum.js';

const MIN = 60_000;
const text = (id) => ({ cat: 'cat', hat: 'hat', map: 'map' })[id];

describe('wordsReadToday', () => {
  const now = new Date(2026, 9, 22, 15, 0).getTime();
  const at = (h) => new Date(2026, 9, 22, h, 0).toISOString();

  it('lists each correctly read word from today once, newest first', () => {
    const history = [
      { wordId: 'hat', correct: true, timestamp: at(14) },
      { wordId: 'cat', correct: true, timestamp: at(13) },
      { wordId: 'hat', correct: true, timestamp: at(12) },
    ];
    expect(wordsReadToday(history, text, now)).toEqual(['hat', 'cat']);
  });

  it('leaves out wrong answers and other days', () => {
    const history = [
      { wordId: 'cat', correct: false, timestamp: at(14) },
      { wordId: 'map', correct: true, timestamp: new Date(2026, 9, 21, 20).toISOString() },
    ];
    expect(wordsReadToday(history, text, now)).toEqual([]);
  });
});

describe('wordsKeptToday', () => {
  it('names words the review ladder graduated today only', () => {
    const now = new Date(2026, 9, 22, 15).getTime();
    const stats = {
      cat: { graduatedAt: new Date(2026, 9, 22, 9).getTime() },
      hat: { graduatedAt: new Date(2026, 9, 1, 9).getTime() },
      map: { graduatedAt: null },
    };
    expect(wordsKeptToday(stats, text, now)).toEqual(['cat']);
  });
});

describe('nextAdventure', () => {
  const first = CURRICULUM[0];
  const second = CURRICULUM[1];

  it('keeps practising the current stage until it is secure', () => {
    const next = nextAdventure(first.group, { [first.group]: 0.5 });
    expect(next.kind).toBe('keep');
    expect(next.name).toMatch(/cat/);
  });

  it('points to the next stage once the current one is secure', () => {
    const next = nextAdventure(first.group, { [first.group]: MASTERY_THRESHOLD });
    expect(next.kind).toBe('next');
    expect(next.example).toBe(second.sampleWords[0]);
  });

  it('returns null for an unknown group or past the last stage', () => {
    expect(nextAdventure('no-such-group')).toBeNull();
    const last = CURRICULUM[CURRICULUM.length - 1];
    expect(nextAdventure(last.group, { [last.group]: 1 })).toBeNull();
  });
});

describe('effortMessage', () => {
  it('praises effort at every level and never grades the child down', () => {
    const lines = [
      effortMessage(9, 10),
      effortMessage(5, 10),
      effortMessage(1, 10),
      effortMessage(0, 0),
    ];
    for (const l of lines) {
      expect(l).not.toMatch(/needs|bad|poor|fail/i);
      expect(l.endsWith('!')).toBe(true);
    }
    expect(effortMessage(1, 10)).toMatch(/trying/);
  });
});

describe('FocusTimer', () => {
  it('offers a break after the focus stretch of steady play', () => {
    const t = new FocusTimer();
    const start = 1_000_000;
    let due = false;
    for (let m = 0; m <= FOCUS_MINUTES; m++) due = t.noteAnswer(start + m * MIN);
    expect(due).toBe(true);
  });

  it('is not due before the stretch is up', () => {
    const t = new FocusTimer();
    t.noteAnswer(0);
    expect(t.noteAnswer((FOCUS_MINUTES - 1) * MIN)).toBe(false);
  });

  it('restarts after an idle gap, which already was a rest', () => {
    const t = new FocusTimer();
    const start = 1_000_000;
    for (let m = 0; m < FOCUS_MINUTES; m++) t.noteAnswer(start + m * MIN);
    const back = start + (FOCUS_MINUTES + IDLE_RESET_MINUTES) * MIN;
    expect(t.noteAnswer(back)).toBe(false);
  });

  it('restarts after a break', () => {
    const t = new FocusTimer();
    for (let m = 0; m <= FOCUS_MINUTES; m++) t.noteAnswer(m * MIN);
    t.reset(FOCUS_MINUTES * MIN);
    expect(t.noteAnswer((FOCUS_MINUTES + 1) * MIN)).toBe(false);
  });
});

describe('showFocusBreak', () => {
  afterEach(() => {
    document.getElementById('modal-focus-break')?.remove();
    vi.useRealTimers();
  });

  it('speaks the move aloud and closes when the child is ready', () => {
    vi.useFakeTimers();
    const speak = vi.fn();
    const onDone = vi.fn();
    showFocusBreak({ speak, onDone });
    const modal = document.getElementById('modal-focus-break');
    expect(modal).not.toBeNull();
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0]).toMatch(/brain break/);
    modal.querySelector('#fb-ready').click();
    expect(document.getElementById('modal-focus-break')).toBeNull();
    expect(onDone).toHaveBeenCalled();
  });

  it('only picks calm moves at bedtime', () => {
    for (const r of [0, 0.4, 0.99]) {
      expect(CALM_BREAKS).toContain(pickBreak({ calm: true, random: () => r }));
    }
  });
});
