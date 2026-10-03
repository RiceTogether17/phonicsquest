/**
 * Sentence Stars — sight words read in decodable sentences.
 *
 * Pins the content alignment (every Quest 1–10 word has three sentences and
 * pictures, and nothing else does), the decoding helpers, and the game flow:
 * the star is only earned by picking the picture that matches the sentence.
 */
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { SIGHT_QUESTS, getQuestsByTier } from '../data/sightwords.js';
import { SIGHT_SENTENCES, questHasSentences } from '../data/sightSentences.js';

const IMG_DIR = resolve(import.meta.dirname, '../../public/images/sight-sentences');
// The browser offers Sentence Stars on exactly the easy tier (Quests 1–10).
const FIRST_TEN = getQuestsByTier('easy');

vi.mock('../modules/audio.js', () => ({
  audio: {
    playSfx: vi.fn(),
    speakSightWord: vi.fn(),
    speakWordArticulated: vi.fn(),
    speakText: vi.fn(() => Promise.resolve()),
    cancelSpeech: vi.fn(),
  },
}));

describe('sentence data', () => {
  it('covers exactly the words of Quests 1–10', () => {
    const questWords = FIRST_TEN.flatMap((q) => q.words).sort();
    expect(Object.keys(SIGHT_SENTENCES).sort()).toEqual(questWords);
    FIRST_TEN.forEach((q) => expect(questHasSentences(q), q.id).toBe(true));
    expect(SIGHT_QUESTS.slice(10).some(questHasSentences)).toBe(false);
  });

  it('gives each word three sentences that use it, each with its own picture', () => {
    for (const [word, sentences] of Object.entries(SIGHT_SENTENCES)) {
      expect(sentences, word).toHaveLength(3);
      const re = new RegExp(`(^|\\W)${word}(\\W|$)`, 'i');
      for (const s of sentences) {
        expect(s.text, `"${s.text}" should use "${word}"`).toMatch(re);
        expect(existsSync(join(IMG_DIR, s.img)), s.img).toBe(true);
      }
      expect(new Set(sentences.map((s) => s.img)).size, word).toBe(3);
    }
  });
});

describe('decoding helpers', () => {
  let mod;
  beforeAll(async () => {
    mod = await import('../modes/sightSentences.js');
  });

  it('colours the short vowel of closed-syllable words only', () => {
    expect(mod.shortVowelIndex('cat')).toBe(1);
    expect(mod.shortVowelIndex('hills')).toBe(1);
    expect(mod.shortVowelIndex('jumps')).toBe(1);
    for (const w of ['lake', 'zoo', 'book', 'down', 'they', 'put', 'the', 'was']) {
      expect(mod.shortVowelIndex(w), w).toBe(-1);
    }
  });

  it('every sentence has a word that tells its picture apart', () => {
    for (const [word, sentences] of Object.entries(SIGHT_SENTENCES)) {
      for (const s of sentences) {
        const others = sentences.filter((o) => o !== s).map((o) => o.text);
        expect(mod.distinguishingWords(s.text, others).size, `${word}: ${s.text}`).toBeGreaterThan(
          0,
        );
      }
    }
    expect([
      ...mod.distinguishingWords('Sam has a cat.', ['Max has a rat.', 'Dan has a mat.']),
    ]).toEqual(['sam', 'cat']);
  });

  it('builds an intro then three sentence rounds per word', () => {
    const rounds = mod.buildRounds(SIGHT_QUESTS[0]);
    expect(rounds).toHaveLength(20);
    expect(rounds.filter((r) => r.type === 'intro').map((r) => r.word)).toEqual(
      SIGHT_QUESTS[0].words,
    );
  });
});

describe('game flow', () => {
  let mod, store, container;
  beforeAll(async () => {
    mod = await import('../modes/sightSentences.js');
    ({ store } = await import('../modules/store.js'));
  });

  beforeEach(() => {
    store.set('sightSentencesCompleted', {});
    document.body.innerHTML = '<div id="root"></div>';
    container = document.getElementById('root');
    mod.initSightSentences(container, {});
    mod.showSightSentences(SIGHT_QUESTS[0]);
  });

  const click = (sel) => container.querySelector(sel).click();
  const answer = () => {
    const sentence = container
      .querySelector('#sst-sentence')
      .textContent.replace(/\s+/g, ' ')
      .trim();
    const word = Object.values(SIGHT_SENTENCES)
      .flat()
      .find((s) => s.text === sentence);
    return container.querySelector(`.sst-pic[data-img="${word.img}"]`);
  };

  it('starts on the star word, then shows a sentence with three pictures', () => {
    expect(container.querySelector('.sst-intro-word').textContent.trim()).toBe('a');
    click('#sst-btn-go');
    expect(container.querySelectorAll('.sst-pic')).toHaveLength(3);
    expect(container.querySelector('.sst-word--target').textContent).toBe('a');
  });

  it('a wrong picture gives no star and highlights the clue word', () => {
    click('#sst-btn-go');
    const wrong = [...container.querySelectorAll('.sst-pic')].find((b) => b !== answer());
    wrong.click();
    expect(wrong.disabled).toBe(true);
    expect(container.querySelectorAll('.sst-star--on')).toHaveLength(0);
    expect(container.querySelector('.sst-word--hint')).toBeTruthy();
    // Quest 1 opens on "a": Sam / Max / Dan — names keep their capital.
    expect(container.querySelector('#sst-feedback').textContent).toMatch(/“(Sam|Max|Dan)”/);
    expect(container.querySelector('#sst-btn-next').hidden).toBe(true);
  });

  it('the right picture colours a star and offers Next', () => {
    click('#sst-btn-go');
    answer().click();
    expect(container.querySelectorAll('.sst-star--on')).toHaveLength(1);
    expect(container.querySelector('#sst-btn-next').hidden).toBe(false);
  });

  it('finishing all 15 sentences saves the quest', () => {
    for (let i = 0; i < 20; i++) {
      if (container.querySelector('#sst-btn-go')) click('#sst-btn-go');
      else {
        answer().click();
        click('#sst-btn-next');
      }
    }
    expect(container.querySelector('.sst-complete')).toBeTruthy();
    expect(store.get('sightSentencesCompleted')[SIGHT_QUESTS[0].id]).toEqual({
      stars: 15,
      firstTry: 15,
      total: 15,
    });
  });
});
