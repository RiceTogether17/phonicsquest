import { describe, it, expect, vi } from 'vitest';

// storyMode → audio → speechSynthesis, which jsdom lacks.
vi.hoisted(() => {
  globalThis.speechSynthesis = {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
});

const { _lineHtml, _castNoteHtml } = await import('../modes/storyMode.js');
const { STORIES } = await import('../data/stories.js');
const { extractCountableTokens } = await import('../modules/decodability.js');

/**
 * Plays: stories told as lines for parts, for a child to read aloud with a
 * sibling or a grown-up. The speaker's name labels the part; it is not text
 * the child is asked to decode.
 */
const play = {
  id: 'test-play',
  roles: ['Narrator', 'Giri', 'Mole'],
  targetGraphemes: ['o_e'],
  band: 'B',
  lines: [
    { type: 'script', role: 'Narrator', text: 'Mole was at home.' },
    { type: 'script', role: 'Mole', text: 'No. I will stay home.' },
  ],
};

describe('a line in a play', () => {
  it('shows who speaks, outside the words the child reads', () => {
    const el = document.createElement('div');
    el.innerHTML = _lineHtml(play.lines[1], 1, true, play);
    const line = el.querySelector('.sline--script');
    expect(line.querySelector('.sline-role').textContent).toBe('Mole:');
    const words = [...line.querySelectorAll('.wf-word')].map((w) => w.dataset.plain);
    expect(words).toEqual(['No', 'I', 'will', 'stay', 'home']);
  });

  it('colours each part by its place in the cast', () => {
    const el = document.createElement('div');
    el.innerHTML = _lineHtml(play.lines[1], 1, true, play);
    expect(el.querySelector('.sline--script').dataset.part).toBe('2');
  });

  it('counts the lines, not the speakers, as words to read', () => {
    expect(extractCountableTokens(play)).toEqual([
      'mole',
      'was',
      'at',
      'home',
      'no',
      'i',
      'will',
      'stay',
      'home',
    ]);
  });
});

describe('the cast note', () => {
  it('names the parts and invites readers to swap them', () => {
    const el = document.createElement('div');
    el.innerHTML = String(_castNoteHtml(play));
    expect([...el.querySelectorAll('.story-cast-part')].map((p) => p.textContent)).toEqual([
      'Narrator',
      'Giri',
      'Mole',
    ]);
    expect(el.textContent).toMatch(/swap parts/i);
  });

  it('is left out of a story that is not a play', () => {
    expect(_castNoteHtml({ lines: [] })).toBe('');
  });
});

describe('every play in the bank', () => {
  const plays = STORIES.filter((s) => s.roles?.length);

  it('exists', () => {
    expect(plays.length).toBeGreaterThan(0);
  });

  it('gives every line a speaker from its cast, and every part a line', () => {
    for (const s of plays) {
      const speakers = new Set();
      for (const line of s.lines) {
        expect(line.type, `${s.id}: plays are written in lines for parts`).toBe('script');
        expect(s.roles, `${s.id}: "${line.role}" is not in the cast`).toContain(line.role);
        speakers.add(line.role);
      }
      for (const role of s.roles)
        expect(speakers.has(role), `${s.id}: ${role} never speaks`).toBe(true);
    }
  });
});

describe('a refrain', () => {
  it('is set apart from the story, so a child knows to join in', () => {
    // The refrain style was in main.css with nothing rendering it: the
    // branch went when the old 🫧 lines did, and refrains came back later.
    const story = STORIES.find((s) => s.lines.some((l) => l.type === 'refrain'));
    const i = story.lines.findIndex((l) => l.type === 'refrain');
    const el = document.createElement('div');
    el.innerHTML = _lineHtml(story.lines[i], i, true, story);
    const line = el.querySelector('.sline--refrain');
    expect(line).not.toBeNull();
    // Its words are still tappable, like any other line the child reads.
    expect(line.querySelectorAll('[data-plain]').length).toBeGreaterThan(0);
  });
});
