import { describe, it, expect, beforeEach } from 'vitest';
import {
  COMPREHENSION_CLOZE_LEVELS,
  COMPREHENSION_CLOZE_PASSAGES,
  COMPREHENSION_CLOZE_SKILLS,
  getComprehensionClozePassages,
  getAllComprehensionClozePassages,
  validateComprehensionClozeBank,
} from '../data/comprehensionClozePassages.js';
import {
  initComprehensionClozeQuest,
  cleanupComprehensionClozeQuest,
  __TEST__,
} from '../modes/comprehensionClozeQuest.js';

// ─────────────────────────────────────────────────────────────────────────────
//  Content integrity — covers minimums 1, 2, 3, 4, 5, 6 from chunk 5 spec
// ─────────────────────────────────────────────────────────────────────────────

describe('Comprehension Cloze content integrity', () => {
  it('the bank passes the in-file validator with no problems', () => {
    expect(validateComprehensionClozeBank()).toEqual([]);
  });

  it('every level (P3–P6) has at least 3 passages', () => {
    for (const lv of COMPREHENSION_CLOZE_LEVELS) {
      const list = getComprehensionClozePassages(lv);
      expect(list.length, `${lv} passage count`).toBeGreaterThanOrEqual(3);
    }
  });

  it('every passage has exactly 5 blanks (text tokens and blanks array agree)', () => {
    for (const p of getAllComprehensionClozePassages()) {
      const tokens = [...p.text.matchAll(/\{\{(\d+)\}\}/g)].map((m) => Number(m[1]));
      expect(tokens.length, `${p.id} text blank count`).toBe(5);
      expect(tokens, `${p.id} blank token order`).toEqual([1, 2, 3, 4, 5]);
      expect(p.blanks.length, `${p.id} blanks[] length`).toBe(5);
      expect(
        p.blanks.map((b) => b.num),
        `${p.id} blank.num order`,
      ).toEqual([1, 2, 3, 4, 5]);
    }
  });

  it('every blank has answer + hint + explanation', () => {
    for (const p of getAllComprehensionClozePassages()) {
      for (const b of p.blanks) {
        expect(
          typeof b.answer === 'string' && b.answer.trim().length,
          `${p.id} #${b.num} answer`,
        ).toBeGreaterThan(0);
        expect(
          typeof b.hint === 'string' && b.hint.trim().length,
          `${p.id} #${b.num} hint`,
        ).toBeGreaterThan(0);
        expect(
          typeof b.explanation === 'string' && b.explanation.trim().length,
          `${p.id} #${b.num} explanation`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('no passage text contains legacy {n:a/b} two-option slash syntax', () => {
    const slash = /\{\d+:[^}/]+\/[^}]+\}/;
    for (const p of getAllComprehensionClozePassages()) {
      expect(slash.test(p.text), `${p.id} text contains slash syntax`).toBe(false);
    }
  });

  it('no answer contains a "/" character (no two-option choices)', () => {
    for (const p of getAllComprehensionClozePassages()) {
      for (const b of p.blanks) {
        expect(b.answer.includes('/'), `${p.id} #${b.num} answer contains "/"`).toBe(false);
      }
    }
  });

  it('no answer is empty', () => {
    for (const p of getAllComprehensionClozePassages()) {
      for (const b of p.blanks) {
        expect(b.answer.trim().length, `${p.id} #${b.num} empty answer`).toBeGreaterThan(0);
      }
    }
  });

  it('no duplicate passage ids across all levels', () => {
    const ids = getAllComprehensionClozePassages().map((p) => p.id);
    expect(new Set(ids).size, 'unique ids').toBe(ids.length);
  });

  it('every blank.skill is one of the known tags', () => {
    for (const p of getAllComprehensionClozePassages()) {
      for (const b of p.blanks) {
        expect(COMPREHENSION_CLOZE_SKILLS, `${p.id} #${b.num} skill "${b.skill}"`).toContain(
          b.skill,
        );
      }
    }
  });

  it('every passage.level matches the bucket it lives in', () => {
    for (const lv of COMPREHENSION_CLOZE_LEVELS) {
      for (const p of COMPREHENSION_CLOZE_PASSAGES[lv]) {
        expect(p.level, `${p.id}`).toBe(lv);
      }
    }
  });

  it('every blank.accept is an array (may be empty)', () => {
    for (const p of getAllComprehensionClozePassages()) {
      for (const b of p.blanks) {
        expect(Array.isArray(b.accept), `${p.id} #${b.num} accept[]`).toBe(true);
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Answer checking — covers minimums 8, 9
// ─────────────────────────────────────────────────────────────────────────────

describe('answer checking — _isAnswerCorrect', () => {
  const blank = { answer: 'Although', accept: ['Though', 'Even though'] };

  it('accepts the primary answer (case-insensitive)', () => {
    expect(__TEST__._isAnswerCorrect('Although', blank)).toBe(true);
    expect(__TEST__._isAnswerCorrect('although', blank)).toBe(true);
    expect(__TEST__._isAnswerCorrect('ALTHOUGH', blank)).toBe(true);
  });

  it('trims surrounding whitespace before comparing', () => {
    expect(__TEST__._isAnswerCorrect('   Although  ', blank)).toBe(true);
    expect(__TEST__._isAnswerCorrect('\tthough\n', blank)).toBe(true);
  });

  it('honours the accept[] synonyms (case-insensitive)', () => {
    expect(__TEST__._isAnswerCorrect('though', blank)).toBe(true);
    expect(__TEST__._isAnswerCorrect('Even though', blank)).toBe(true);
    expect(__TEST__._isAnswerCorrect('even THOUGH', blank)).toBe(true);
  });

  it('rejects empty input', () => {
    expect(__TEST__._isAnswerCorrect('', blank)).toBe(false);
    expect(__TEST__._isAnswerCorrect('   ', blank)).toBe(false);
    expect(__TEST__._isAnswerCorrect(null, blank)).toBe(false);
    expect(__TEST__._isAnswerCorrect(undefined, blank)).toBe(false);
  });

  it('rejects unrelated words', () => {
    expect(__TEST__._isAnswerCorrect('because', blank)).toBe(false);
    expect(__TEST__._isAnswerCorrect('but', blank)).toBe(false);
    expect(__TEST__._isAnswerCorrect('althou', blank)).toBe(false); // partial word
  });

  it('handles a missing accept[] gracefully', () => {
    expect(__TEST__._isAnswerCorrect('to', { answer: 'to' })).toBe(true);
    expect(__TEST__._isAnswerCorrect('foo', { answer: 'to' })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  Text splitting — supporting helper used by the renderer
// ─────────────────────────────────────────────────────────────────────────────

describe('text splitting — _splitText', () => {
  it('separates text and blank segments in passage order', () => {
    const segs = __TEST__._splitText('a {{1}} b {{2}} c');
    expect(segs.map((s) => s.type)).toEqual(['text', 'blank', 'text', 'blank', 'text']);
    expect(segs.filter((s) => s.type === 'blank').map((s) => s.num)).toEqual([1, 2]);
  });

  it('returns a single text segment when there are no blanks', () => {
    expect(__TEST__._splitText('plain text')).toEqual([{ type: 'text', value: 'plain text' }]);
  });

  it('handles a passage that starts with a blank', () => {
    const segs = __TEST__._splitText('{{1}} hello');
    expect(segs[0]).toEqual({ type: 'blank', num: 1 });
    expect(segs[1]).toEqual({ type: 'text', value: ' hello' });
  });

  it('handles non-string input safely', () => {
    expect(__TEST__._splitText(null)).toEqual([]);
    expect(__TEST__._splitText(undefined)).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
//  DOM rendering + interactions — covers minimums 7, 8, 9 (and lifecycle)
// ─────────────────────────────────────────────────────────────────────────────

describe('Comprehension Cloze Quest — DOM rendering', () => {
  let root;

  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    root = document.getElementById('root');
  });

  it('mounts the level picker with one button per level', () => {
    initComprehensionClozeQuest(root, {});
    const tiles = root.querySelectorAll('[data-level]');
    expect(tiles.length).toBe(COMPREHENSION_CLOZE_LEVELS.length);
    expect([...tiles].map((b) => b.dataset.level)).toEqual([...COMPREHENSION_CLOZE_LEVELS]);
    cleanupComprehensionClozeQuest();
  });

  it('every level tile is keyboard-focusable and has an aria-label', () => {
    initComprehensionClozeQuest(root, {});
    const tiles = root.querySelectorAll('[data-level]');
    for (const t of tiles) {
      expect(t.tagName).toBe('BUTTON');
      expect(t.getAttribute('aria-label')).toMatch(/comprehension cloze/i);
    }
    cleanupComprehensionClozeQuest();
  });

  it('renders 5 typed text inputs after picking a level', () => {
    initComprehensionClozeQuest(root, {});
    root.querySelector('[data-level="P3"]').click();
    const inputs = root.querySelectorAll('.cc-quest__blank');
    expect(inputs.length).toBe(5);
    inputs.forEach((inp, i) => {
      expect(inp.tagName).toBe('INPUT');
      expect(inp.getAttribute('type')).toBe('text');
      expect(inp.getAttribute('aria-label')).toMatch(new RegExp(`Blank ${i + 1}\\b`));
      expect(inp.placeholder).toBe(String(i + 1));
    });
    cleanupComprehensionClozeQuest();
  });

  it('Check Answers accepts every correct answer (case-insensitive) → 5/5', () => {
    initComprehensionClozeQuest(root, {});
    root.querySelector('[data-level="P3"]').click();
    const passage = getComprehensionClozePassages('P3')[0];
    const inputs = root.querySelectorAll('.cc-quest__blank');
    inputs.forEach((inp, i) => {
      inp.value = passage.blanks[i].answer.toUpperCase();
    });
    root.querySelector('[data-action="check"]').click();
    expect(root.querySelector('#cc-quest-score').textContent).toBe('Score: 5 / 5 correct');
    inputs.forEach((inp) => {
      expect(inp.classList.contains('cc-quest__blank--correct')).toBe(true);
      expect(inp.classList.contains('cc-quest__blank--wrong')).toBe(false);
    });
    cleanupComprehensionClozeQuest();
  });

  it('Check Answers does not mark wrong answers as correct', () => {
    initComprehensionClozeQuest(root, {});
    root.querySelector('[data-level="P3"]').click();
    const inputs = root.querySelectorAll('.cc-quest__blank');
    inputs.forEach((inp) => {
      inp.value = 'definitelywrong';
    });
    root.querySelector('[data-action="check"]').click();
    expect(root.querySelector('#cc-quest-score').textContent).toBe('Score: 0 / 5 correct');
    inputs.forEach((inp) => {
      expect(inp.classList.contains('cc-quest__blank--correct')).toBe(false);
      expect(inp.classList.contains('cc-quest__blank--wrong')).toBe(true);
    });
    cleanupComprehensionClozeQuest();
  });

  it('mixed correct / wrong / case / trimmed / empty inputs score correctly (3/5)', () => {
    initComprehensionClozeQuest(root, {});
    root.querySelector('[data-level="P3"]').click();
    const passage = getComprehensionClozePassages('P3')[0];
    const inputs = root.querySelectorAll('.cc-quest__blank');
    inputs[0].value = passage.blanks[0].answer; // correct
    inputs[1].value = 'wrong'; // wrong
    inputs[2].value = passage.blanks[2].answer.toUpperCase(); // correct (uppercase)
    inputs[3].value = ''; // wrong (empty)
    inputs[4].value = `   ${passage.blanks[4].answer}   `; // correct (trimmed)
    root.querySelector('[data-action="check"]').click();
    expect(root.querySelector('#cc-quest-score').textContent).toBe('Score: 3 / 5 correct');
    cleanupComprehensionClozeQuest();
  });

  it('Pressing Enter inside a blank triggers Check', () => {
    initComprehensionClozeQuest(root, {});
    root.querySelector('[data-level="P3"]').click();
    const passage = getComprehensionClozePassages('P3')[0];
    const inputs = root.querySelectorAll('.cc-quest__blank');
    inputs.forEach((inp, i) => {
      inp.value = passage.blanks[i].answer;
    });
    const evt = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    inputs[0].dispatchEvent(evt);
    expect(root.querySelector('#cc-quest-score').textContent).toBe('Score: 5 / 5 correct');
    cleanupComprehensionClozeQuest();
  });

  it('Show Hints toggles a 5-item hint list', () => {
    initComprehensionClozeQuest(root, {});
    root.querySelector('[data-level="P3"]').click();
    const hints = root.querySelector('#cc-quest-hints');
    expect(hints.hidden).toBe(true);
    root.querySelector('[data-action="hint"]').click();
    expect(hints.hidden).toBe(false);
    expect(hints.querySelectorAll('.cc-quest__hint-list li').length).toBe(5);
    root.querySelector('[data-action="hint"]').click();
    expect(hints.hidden).toBe(true);
    cleanupComprehensionClozeQuest();
  });

  it('Reveal Answers fills inputs, locks them readOnly, and shows explanations', () => {
    initComprehensionClozeQuest(root, {});
    root.querySelector('[data-level="P3"]').click();
    const passage = getComprehensionClozePassages('P3')[0];
    root.querySelector('[data-action="reveal"]').click();
    const inputs = root.querySelectorAll('.cc-quest__blank');
    inputs.forEach((inp, i) => {
      expect(inp.value).toBe(passage.blanks[i].answer);
      expect(inp.readOnly).toBe(true);
      expect(inp.classList.contains('cc-quest__blank--revealed')).toBe(true);
    });
    expect(root.querySelector('#cc-quest-feedback').hidden).toBe(false);
    expect(root.querySelectorAll('.cc-quest__feedback-item').length).toBe(5);
    cleanupComprehensionClozeQuest();
  });

  it('Try Another advances to a different passage at the same level', () => {
    initComprehensionClozeQuest(root, {});
    root.querySelector('[data-level="P3"]').click();
    const firstId = root.querySelector('[data-passage-id]').dataset.passageId;
    root.querySelector('[data-action="another"]').click();
    const secondId = root.querySelector('[data-passage-id]').dataset.passageId;
    expect(secondId).not.toBe(firstId);
    cleanupComprehensionClozeQuest();
  });

  it('the in-module Back button fires onClose', () => {
    let closed = false;
    initComprehensionClozeQuest(root, {
      onClose: () => {
        closed = true;
      },
    });
    root.querySelector('[data-action="back"]').click();
    expect(closed).toBe(true);
    cleanupComprehensionClozeQuest();
  });

  it('cleanup empties the container and is idempotent', () => {
    initComprehensionClozeQuest(root, {});
    expect(root.innerHTML.length).toBeGreaterThan(0);
    cleanupComprehensionClozeQuest();
    expect(root.innerHTML).toBe('');
    expect(() => cleanupComprehensionClozeQuest()).not.toThrow();
  });

  it('init with a missing onClose does not throw when Back is clicked', () => {
    initComprehensionClozeQuest(root, {});
    expect(() => root.querySelector('[data-action="back"]').click()).not.toThrow();
    cleanupComprehensionClozeQuest();
  });
});
