/*
 * Every word in the phonics bank is shown to a 4–8 year old, read aloud,
 * and drawn with an emoji. Decodability is not enough to earn a place: a
 * word also has to be one a parent is happy to hear their child practise.
 *
 * These were in the bank, several with pictures that made the adult sense
 * explicit (gob 🫦, gash and stab 🗡️, rum 🍹, pub 🍺). Each is easy to
 * re-add by accident from a decodable-word list, so the test names them.
 */
import { describe, expect, it } from 'vitest';
import { WORDS } from '../data/words.js';
import { CURRICULUM, PHASES } from '../data/curriculum.js';

const UNSUITABLE = {
  'vulgar slang': ['cock', 'shag', 'gob', 'bust'],
  'drugs or alcohol': ['bong', 'rum', 'pub', 'keg', 'beer', 'wine', 'gin'],
  'weapons or injury': ['gash', 'stab', 'drub', 'lash', 'gun', 'kill'],
  disease: ['pus', 'pox'],
  insults: ['slur', 'brat', 'runt'],
  'rude words': ['suck', 'curse', 'damn', 'crap'],
};
const BLOCKED = new Set(Object.values(UNSUITABLE).flat());

describe('word bank suitability', () => {
  it('holds no word on the unsuitable list', () => {
    const found = WORDS.filter((w) => BLOCKED.has(w.word.toLowerCase())).map((w) => w.word);
    expect(found).toEqual([]);
  });

  it('no stage or phase lists an unsuitable word as an example', () => {
    const samples = [...PHASES, ...CURRICULUM].flatMap((s) =>
      (s.sampleWords ?? []).map((w) => String(w).split(/[\s(]/)[0].toLowerCase()),
    );
    expect(samples.filter((w) => BLOCKED.has(w))).toEqual([]);
  });

  it('no word is drawn with a weapon, alcohol or gambling emoji', () => {
    const DISALLOWED_EMOJI = ['🗡️', '🔫', '🍺', '🍹', '🍷', '🍸', '🫦', '🚬', '🎰'];
    const found = WORDS.filter((w) => DISALLOWED_EMOJI.includes(w.emoji)).map(
      (w) => `${w.word} ${w.emoji}`,
    );
    expect(found).toEqual([]);
  });
});
