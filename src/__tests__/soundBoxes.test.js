/**
 * Elkonin sound boxes.
 *
 * The scaffold makes the count and order of a word's sounds visible during
 * segmenting. Two properties carry the pedagogy and are pinned here:
 *
 *   1. exactly one box per phoneme, for every word length in the bank
 *      (2–8 sounds), and
 *   2. state is never conveyed by colour alone — each box carries its own
 *      aria-label naming position, state and sound type, because a child
 *      using a screen reader or a high-contrast theme needs the same
 *      information a sighted child gets from the fill.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  renderSoundBoxes, updateSoundBoxes, fillSoundBox, soundCount, __TEST__,
} from '../components/soundBoxes.js';

/** A word shaped like the entries in data/words.js. */
function makeWord(graphemes, types, overrides = {}) {
  return {
    id: graphemes.join(''),
    word: graphemes.join(''),
    graphemes,
    types,
    phonemes: graphemes.map(g => `/${g}/`),
    ...overrides,
  };
}

const CAT = makeWord(['c', 'a', 't'], ['c', 'sv', 'c']);

let host;
beforeEach(() => {
  document.body.innerHTML = '<div id="host"></div>';
  host = document.getElementById('host');
});

describe('box count', () => {
  it('renders one box per phoneme', () => {
    const n = renderSoundBoxes(CAT, host);
    expect(n).toBe(3);
    expect(host.querySelectorAll('.sound-box').length).toBe(3);
  });

  it('covers every word length the bank contains (2 to 8 sounds)', () => {
    for (let len = 2; len <= 8; len++) {
      const graphemes = Array.from({ length: len }, (_, i) => String.fromCharCode(97 + i));
      const word = makeWord(graphemes, graphemes.map(() => 'c'));
      renderSoundBoxes(word, host);
      expect(host.querySelectorAll('.sound-box').length, `${len} sounds`).toBe(len);
    }
  });

  it('tags the container with the sound count so long words can shrink', () => {
    renderSoundBoxes(makeWord(['s', 't', 'r', 'a', 'n', 'd'], Array(6).fill('c')), host);
    expect(host.classList.contains('sound-boxes--n6')).toBe(true);
  });

  it('falls back to graphemes when phonemes are missing', () => {
    const word = { word: 'ox', graphemes: ['o', 'x'], types: ['sv', 'c'] };
    expect(soundCount(word)).toBe(2);
    expect(renderSoundBoxes(word, host)).toBe(2);
  });

  it('renders nothing for an empty or missing word rather than throwing', () => {
    expect(renderSoundBoxes(null, host)).toBe(0);
    expect(renderSoundBoxes({ word: '', graphemes: [], phonemes: [] }, host)).toBe(0);
    expect(host.querySelectorAll('.sound-box').length).toBe(0);
  });

  it('is a no-op without a host', () => {
    expect(() => renderSoundBoxes(CAT, null)).not.toThrow();
    expect(renderSoundBoxes(CAT, null)).toBe(0);
  });

  it('clears previous boxes when re-rendering for a new word', () => {
    renderSoundBoxes(makeWord(['s', 'p', 'l', 'a', 't'], Array(5).fill('c')), host);
    renderSoundBoxes(CAT, host);
    expect(host.querySelectorAll('.sound-box').length).toBe(3);
  });
});

describe('sound-type colour language', () => {
  it('gives each box the class matching its phoneme type', () => {
    renderSoundBoxes(CAT, host);
    const boxes = host.querySelectorAll('.sound-box');
    expect(boxes[0].classList.contains('sound-box--consonant')).toBe(true);
    expect(boxes[1].classList.contains('sound-box--short-vowel')).toBe(true);
    expect(boxes[2].classList.contains('sound-box--consonant')).toBe(true);
  });

  it('maps the full type vocabulary without falling over', () => {
    const types = ['c', 'sv', 'lv', 'd', 'bl', 'se', 'rc', 'dp', 'sf', 'p', 'soft_c', 'soft_g'];
    const word = makeWord(types.map((_, i) => String.fromCharCode(97 + i)), types);
    renderSoundBoxes(word, host);
    // Every box resolves to a real class — none left unstyled.
    host.querySelectorAll('.sound-box').forEach((box, i) => {
      const hasType = [...box.classList].some(c =>
        c.startsWith('sound-box--') &&
        !/--(empty|active|filled|correct|retry)$/.test(c));
      expect(hasType, types[i]).toBe(true);
    });
  });

  it('defaults an unknown type to consonant rather than rendering untyped', () => {
    renderSoundBoxes(makeWord(['z'], ['nonsense']), host);
    expect(host.querySelector('.sound-box').classList.contains('sound-box--consonant')).toBe(true);
  });
});

describe('states', () => {
  it('starts every box empty with a placeholder, not the answer', () => {
    renderSoundBoxes(CAT, host);
    host.querySelectorAll('.sound-box').forEach(box => {
      expect(box.dataset.state).toBe('empty');
      expect(box.querySelector('.sound-box__mark').textContent).toBe(__TEST__.EMPTY_MARK);
    });
  });

  it('shows the grapheme only once a box is filled', () => {
    renderSoundBoxes(CAT, host, { filledIndices: [0] });
    const boxes = host.querySelectorAll('.sound-box');
    expect(boxes[0].querySelector('.sound-box__mark').textContent).toBe('c');
    expect(boxes[1].querySelector('.sound-box__mark').textContent).toBe(__TEST__.EMPTY_MARK);
  });

  it('marks the active box distinctly from empty ones', () => {
    renderSoundBoxes(CAT, host, { activeIndex: 1 });
    const boxes = host.querySelectorAll('.sound-box');
    expect(boxes[1].dataset.state).toBe('active');
    expect(boxes[0].dataset.state).toBe('empty');
  });

  it('ranks correct and retry above filled/active', () => {
    renderSoundBoxes(CAT, host, {
      filledIndices: [0, 1, 2], correctIndices: [0], retryIndices: [1], activeIndex: 2,
    });
    const boxes = host.querySelectorAll('.sound-box');
    expect(boxes[0].dataset.state).toBe('correct');
    expect(boxes[1].dataset.state).toBe('retry');
    expect(boxes[2].dataset.state).toBe('filled');
  });

  it('updates states in place without rebuilding the nodes', () => {
    renderSoundBoxes(CAT, host);
    const first = host.querySelector('.sound-box');
    updateSoundBoxes(host, { filledIndices: [0], activeIndex: 1 });

    // Same element instance — a rebuild here would drop focus mid-tap.
    expect(host.querySelector('.sound-box')).toBe(first);
    expect(first.dataset.state).toBe('filled');
    expect(host.querySelectorAll('.sound-box')[1].dataset.state).toBe('active');
  });

  it('keeps the type class when the state class changes', () => {
    renderSoundBoxes(CAT, host);
    updateSoundBoxes(host, { filledIndices: [1] });
    const vowel = host.querySelectorAll('.sound-box')[1];
    expect(vowel.classList.contains('sound-box--short-vowel')).toBe(true);
    expect(vowel.classList.contains('sound-box--filled')).toBe(true);
  });

  it('fillSoundBox writes a grapheme into one box', () => {
    renderSoundBoxes(CAT, host);
    fillSoundBox(host, 2, 't');
    expect(host.querySelectorAll('.sound-box')[2].querySelector('.sound-box__mark').textContent).toBe('t');
  });

  it('fillSoundBox ignores an out-of-range index', () => {
    renderSoundBoxes(CAT, host);
    expect(() => fillSoundBox(host, 99, 'x')).not.toThrow();
  });
});

describe('accessibility', () => {
  it('describes the whole track on the container', () => {
    renderSoundBoxes(CAT, host, { filledIndices: [0] });
    expect(host.getAttribute('role')).toBe('list');
    expect(host.getAttribute('aria-label')).toBe('Sound boxes: 3 sounds, 1 filled');
  });

  it('keeps the container label in sync as boxes fill', () => {
    renderSoundBoxes(CAT, host);
    updateSoundBoxes(host, { filledIndices: [0, 1] });
    expect(host.getAttribute('aria-label')).toContain('2 filled');
  });

  it('uses the singular for a one-sound word', () => {
    renderSoundBoxes(makeWord(['a'], ['sv']), host);
    expect(host.getAttribute('aria-label')).toContain('1 sound,');
  });

  it('labels every box with its position and state', () => {
    renderSoundBoxes(CAT, host, { filledIndices: [0], activeIndex: 1 });
    const boxes = host.querySelectorAll('.sound-box');
    expect(boxes[0].getAttribute('aria-label')).toBe('Sound 1 of 3: c, filled, consonant');
    expect(boxes[1].getAttribute('aria-label')).toBe('Sound 2 of 3: current, empty');
    expect(boxes[2].getAttribute('aria-label')).toBe('Sound 3 of 3: empty');
  });

  it('announces correct and retry without the word "wrong"', () => {
    renderSoundBoxes(CAT, host, { correctIndices: [0], retryIndices: [1], filledIndices: [0, 1] });
    const boxes = host.querySelectorAll('.sound-box');
    expect(boxes[0].getAttribute('aria-label')).toContain('correct');
    // Mistakes are safe in this app — the copy says try again, never wrong.
    expect(boxes[1].getAttribute('aria-label')).toBe('Sound 2 of 3: try again');
    expect(boxes[1].getAttribute('aria-label')).not.toMatch(/wrong|incorrect/i);
  });

  it('hides the decorative placeholder glyph from assistive tech', () => {
    renderSoundBoxes(CAT, host);
    host.querySelectorAll('.sound-box__mark').forEach(mark => {
      expect(mark.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('does not leak the answer to screen readers before a box is filled', () => {
    renderSoundBoxes(CAT, host);
    const labels = [...host.querySelectorAll('.sound-box')].map(b => b.getAttribute('aria-label'));
    expect(labels.join(' ')).not.toMatch(/\bc\b|\ba\b|\bt\b/);
  });
});
