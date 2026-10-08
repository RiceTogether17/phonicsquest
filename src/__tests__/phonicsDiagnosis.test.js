/**
 * Phonics slip diagnosis — the sound games name the child's actual mistake.
 *
 * Guards three things:
 *   1. The right slip is named for the common confusions (short vowels,
 *      buzz/no-buzz pairs, a sound heard in the wrong place, a dropped blend
 *      sound).
 *   2. The first-try cue never gives the answer away; only the reveal does.
 *   3. The round controller shows the cue and the reveal, and hands the
 *      wrong choice to the reveal so the two sounds can be played together.
 */
import { describe, expect, it, vi } from 'vitest';

globalThis.speechSynthesis = globalThis.speechSynthesis || {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
};

const { WORDS } = await import('../data/words.js');
const { diagnosePhonicsSlip, diagnoseWordSlip, lessonNoteFor, loadLessonNotes } =
  await import('../modules/phonicsDiagnosis.js');
// The lesson notes load in the background; wait for them so the reveal
// tests see the lesson's own wording.
await loadLessonNotes();
const { createChoiceRound } = await import('../modes/choiceRound.js');

const word = (w) => {
  const found = WORDS.find((x) => x.word === w);
  if (!found) throw new Error(`test word missing from bank: ${w}`);
  return found;
};
const sv = (g) => ({ grapheme: g, type: 'sv' });
const c = (g) => ({ grapheme: g, type: 'c' });

describe('diagnosePhonicsSlip', () => {
  it('names a short-vowel mix-up and reuses the lesson "watch out" note', () => {
    const d = diagnosePhonicsSlip({
      word: word('bad'),
      position: 'middle',
      target: sv('a'),
      chosen: sv('e'),
    });
    expect(d.id).toBe('short-vowel');
    expect(d.cue).toContain('/e/');
    expect(d.cue).toContain('opens wide');
    expect(d.reveal).toContain('You heard /e/');
    expect(d.reveal).toContain('"bad" has /a/ in the middle');
    expect(d.reveal).toContain('/e/ uses a small smile'); // from the cvc-a lesson
  });

  it('builds a mouth contrast when no lesson note covers the pair', () => {
    const d = diagnosePhonicsSlip({
      word: word('bad'),
      position: 'middle',
      target: sv('a'),
      chosen: sv('u'),
    });
    expect(d.id).toBe('short-vowel');
    expect(d.reveal).toMatch(
      /For \/a\/, your mouth opens wide\. For \/u\/, your mouth stays relaxed\./,
    );
  });

  it('tells a child who heard a real sound in the wrong place where it is', () => {
    const d = diagnosePhonicsSlip({
      word: word('cat'),
      position: 'first',
      target: c('c'),
      chosen: c('t'),
    });
    expect(d.id).toBe('sound-elsewhere');
    expect(d.cue).toContain('at the end');
    expect(d.reveal).toBe('/t/ is at the end of "cat". "cat" starts with /k/.');
  });

  it('treats the second sound of a blend as in the middle, not the start', () => {
    const d = diagnosePhonicsSlip({
      word: word('flag'),
      position: 'first',
      target: c('f'),
      chosen: c('l'),
    });
    expect(d.id).toBe('sound-elsewhere');
    expect(d.cue).toContain('in the middle');
  });

  it('names a buzz / no-buzz pair, whichever way round', () => {
    const quietForBuzz = diagnosePhonicsSlip({
      word: word('bad'),
      position: 'last',
      target: c('d'),
      chosen: c('t'),
    });
    const buzzForQuiet = diagnosePhonicsSlip({
      word: word('cat'),
      position: 'first',
      target: c('c'),
      chosen: c('g'),
    });
    expect(quietForBuzz.id).toBe('voicing');
    expect(buzzForQuiet.id).toBe('voicing');
    expect(quietForBuzz.cue).toContain('Touch your throat');
    expect(buzzForQuiet.reveal).toContain('/g/ buzzes in your throat and /k/ is just air');
  });

  it('uses the mouth-shape cue for consonants made in different places', () => {
    const d = diagnosePhonicsSlip({
      word: word('cat'),
      position: 'first',
      target: c('c'),
      chosen: c('m'),
    });
    expect(d.id).toBe('mouth-shape');
    expect(d.cue).toContain('back of your tongue');
  });

  it('flags a long vowel heard as short', () => {
    const d = diagnosePhonicsSlip({
      word: word('cake'),
      position: 'middle',
      target: { grapheme: 'a', type: 'lv' },
      chosen: sv('e'),
    });
    expect(d.id).toBe('vowel-length');
    expect(d.cue).toContain('says its NAME');
  });

  it('never names the answer sound in the first-try cue', () => {
    const cases = [
      ['bad', 'middle', sv('a'), sv('e')],
      ['bad', 'middle', sv('a'), sv('u')],
      ['bad', 'last', c('d'), c('t')],
      ['cat', 'first', c('c'), c('m')],
      ['cat', 'first', c('c'), c('t')],
      ['pig', 'middle', sv('i'), sv('e')],
    ];
    for (const [w, position, target, chosen] of cases) {
      const d = diagnosePhonicsSlip({ word: word(w), position, target, chosen });
      const targetLabel = { a: '/a/', d: '/d/', c: '/k/', i: '/i/' }[target.grapheme];
      expect(d.cue, `${w} ${position}`).not.toContain(targetLabel);
    }
  });

  it('returns null rather than a diagnosis when the choice is the answer', () => {
    expect(
      diagnosePhonicsSlip({ word: word('cat'), position: 'first', target: c('c'), chosen: c('k') }),
    ).toBeNull();
  });
});

describe('diagnoseWordSlip (Hear & Choose)', () => {
  it('finds the one sound that differs between the two words', () => {
    const d = diagnoseWordSlip(word('bad'), word('bed'));
    expect(d.id).toBe('short-vowel');
    expect(d.cue).toContain('You picked "bed", which has /e/');
    expect(d.reveal).toContain('"bed" has /e/, but "bad" has /a/ in the middle');
  });

  it('gives up (null) when the words differ in more than one sound', () => {
    expect(diagnoseWordSlip(word('cat'), word('dog'))).toBeNull();
  });

  it('spots a blend read with a sound dropped', () => {
    const target = {
      word: 'flag',
      phonemes: ['/f/', '/l/', '/a/', '/g/'],
      graphemes: ['fl', 'a', 'g'],
      types: ['bl', 'sv', 'c'],
    };
    const chosen = {
      word: 'fag',
      phonemes: ['/f/', '/a/', '/g/'],
      graphemes: ['f', 'a', 'g'],
      types: ['c', 'sv', 'c'],
    };
    const d = diagnoseWordSlip(target, chosen);
    expect(d.id).toBe('missing-sound');
    expect(d.reveal).toContain('f-l-a-g');
  });

  it('does not throw on any pair of bank words', () => {
    const sample = WORDS.slice(0, 120);
    for (const a of sample)
      for (const b of sample) expect(() => diagnoseWordSlip(a, b)).not.toThrow();
  });
});

describe('lessonNoteFor', () => {
  it('only returns a note that talks about both sounds', () => {
    expect(lessonNoteFor(word('pig'), 'i', '/i/', '/e/')).toMatch(/Short I .* short E/);
    expect(lessonNoteFor(word('pig'), 'i', '/i/', '/o/')).toBeNull();
  });
});

describe('createChoiceRound with diagnose', () => {
  function setup() {
    document.body.innerHTML = '<div id="area"><div class="choice-grid"></div></div>';
    const modeArea = document.getElementById('area');
    const grid = modeArea.querySelector('.choice-grid');
    const mk = (correct) => {
      const b = document.createElement('button');
      b.className = 'choice-btn';
      b.dataset.correct = String(correct);
      grid.appendChild(b);
      return b;
    };
    const right = mk(true);
    const wrong1 = mk(false);
    const wrong2 = mk(false);
    const onReveal = vi.fn();
    const round = createChoiceRound({
      modeArea,
      grid,
      onResult: () => {},
      retryHint: 'Listen for the very FIRST sound.',
      diagnose: (choice) =>
        choice === 'e'
          ? { cue: 'You picked /e/.', reveal: 'You heard /e/, but it has /a/.' }
          : null,
      onReveal,
    });
    const text = () => modeArea.querySelector('.choice-feedback-text').textContent;
    return { round, right, wrong1, wrong2, onReveal, text };
  }

  it('shows the diagnosis cue on the first miss and the reveal on the second', () => {
    const { round, wrong1, wrong2, onReveal, text } = setup();
    round.handleTap(false, wrong1, 'e');
    expect(text()).toBe('Almost! You picked /e/.');
    round.handleTap(false, wrong2, 'e');
    expect(text()).toBe('Good try! You heard /e/, but it has /a/.');
    expect(onReveal).toHaveBeenCalledWith({ mistake: 'e' });
  });

  it('falls back to the mode hint when nothing can be diagnosed', () => {
    const { round, wrong1, right, onReveal, text } = setup();
    round.handleTap(false, wrong1, 'x');
    expect(text()).toBe('Almost! Try again. Listen for the very FIRST sound.');
    round.handleTap(true, right, 'a');
    expect(onReveal).toHaveBeenCalledWith({ mistake: null });
  });
});
