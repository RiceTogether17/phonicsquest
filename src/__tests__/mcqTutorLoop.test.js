/**
 * The tutoring loop, driven through the real mode modules.
 *
 * Unit tests cover the pieces (item features, the review lane, the gloss
 * explanations). This suite checks that a child actually experiences them:
 * miss a question today → meet it again in a later session → see the word
 * taught on reveal → get the rule re-opened when the skill goes weak.
 *
 * The modes are imported statically for the same reason mcqRoundSize does it:
 * resetting modules would hand each mode its own copy of the store.
 */
import { beforeEach, describe, expect, it } from 'vitest';
import { store } from '../modules/store.js';
import { questMastery } from '../modules/questMastery.js';
import { countDueReviews } from '../modules/mcqReviewLane.js';
import { getWordGloss } from '../data/vocabGlosses.js';
import * as grammarMcq from '../modes/grammarMcq.js';
import * as vocabMcq from '../modes/vocabMcq.js';

globalThis.speechSynthesis ||= {
  getVoices: () => [],
  addEventListener: () => {},
  speak: () => {},
  cancel: () => {},
  paused: false,
  resume: () => {},
};

function mount() {
  document.body.innerHTML = '<div id="host"></div>';
  return document.getElementById('host');
}

function clickPastRuleCards() {
  for (let i = 0; i < 5; i += 1) {
    const card = document.querySelector('.mcq-rule-card button');
    if (!card) break;
    card.click();
  }
}

function startRound(mode, level) {
  const host = mount();
  if (mode === grammarMcq) {
    grammarMcq.initGrammarMcq(host, () => {});
    grammarMcq.startGrammarMcqLevel(level);
  } else {
    vocabMcq.initVocabMcq(host, () => {});
    vocabMcq.startVocabMcqLevel(level);
  }
  clickPastRuleCards();
}

/** The stem currently on screen. */
function currentStem() {
  return document.querySelector('.sfq-instruction')?.textContent?.trim() || '';
}

function choiceButtons() {
  return [...document.querySelectorAll('[data-choice]')];
}

function advance() {
  const next = document.querySelector('#gmcq-next, #vmcq-next');
  if (next && next.offsetParent !== null) next.click();
  else document.querySelector('#gmcq-next, #vmcq-next')?.click();
  clickPastRuleCards();
}

beforeEach(() => {
  store.set('paperItemLimit', null);
  store.set('lessonsSeen', {});
  store.set('mcqReviewLane', {});
  store.set('questMastery', {});
  store.set('misconceptionLog', {});
});

describe('the MCQ tutoring loop', () => {
  it('remembers exactly the questions the round counted as missed', () => {
    startRound(grammarMcq, 'P4');

    // Play the whole round, always taking the first choice. Some are right,
    // some wrong — which is the point: the lane must end up holding the
    // misses and nothing else.
    for (let i = 0; i < 30; i += 1) {
      const buttons = choiceButtons();
      if (!buttons.length) break; // results screen
      buttons[0].click();
      // A wrong first tap disables that choice and leaves the others live;
      // a second tap then reveals. Either way, finish the question.
      const stillLive = document.querySelector('[data-choice]:not([disabled])');
      if (stillLive) stillLive.click();
      advance();
    }

    // The results screen names the misses on its Recovery button.
    const recovery = document.querySelector('#gmcq-recovery');
    const missed = recovery ? Number(recovery.textContent.match(/\((\d+)\)/)?.[1] ?? 0) : 0;

    expect(missed, 'taking the first choice 10x should miss at least once').toBeGreaterThan(0);

    // Every miss is remembered, but by SEED: if the round happened to draw two
    // renderings of one seed question, they collapse into a single review
    // thread rather than queuing the same question twice.
    const due = countDueReviews('grammarMcq');
    expect(due).toBeGreaterThan(0);
    expect(due).toBeLessThanOrEqual(missed);
  });

  it('a review from an earlier session leads the next round and is labelled', () => {
    // Seed the lane directly with a due miss, as an earlier session would have.
    const seeded = grammarMcq.getItemsForScope({ level: 'P4' })[0];
    store.set('mcqReviewLane', {
      [`grammarMcq:${seeded.seedId}`]: {
        mode: 'grammarMcq',
        box: 0,
        dueAt: Date.now() - 86_400_000,
        attempts: 1,
        correct: 0,
        lastSeen: new Date(Date.now() - 86_400_000).toISOString(),
        item: seeded,
      },
    });

    startRound(grammarMcq, 'P4');

    expect(currentStem()).toBe(seeded.q);
    expect(document.querySelector('.mcq-category-tag')?.textContent).toContain('Review');
  });

  it('reviews only resurface inside the round they belong to', () => {
    const p4Item = grammarMcq.getItemsForScope({ level: 'P4' })[0];
    store.set('mcqReviewLane', {
      [`grammarMcq:${p4Item.seedId}`]: {
        mode: 'grammarMcq',
        box: 0,
        dueAt: Date.now() - 86_400_000,
        attempts: 1,
        correct: 0,
        lastSeen: new Date().toISOString(),
        item: p4Item,
      },
    });

    startRound(grammarMcq, 'P1');
    expect(currentStem()).not.toBe(p4Item.q);
  });

  it('teaches the word itself when a vocabulary answer is revealed', () => {
    // Seed a known gloss-backed item as a due review so it leads the round —
    // otherwise which categories get drawn is left to the shuffle.
    const soundVerb = vocabMcq.getItemsForScope({ level: 'P3', category: 'soundVerbs' })[0];
    expect(soundVerb, 'P3 should carry soundVerbs items').toBeTruthy();
    store.set('mcqReviewLane', {
      [`vocabMcq:${soundVerb.seedId}`]: {
        mode: 'vocabMcq',
        box: 0,
        dueAt: Date.now() - 86_400_000,
        attempts: 1,
        correct: 0,
        lastSeen: new Date().toISOString(),
        item: soundVerb,
      },
    });

    startRound(vocabMcq, 'P3');
    expect(currentStem()).toBe(soundVerb.q);

    // Answer it (either way) — the word card teaches on every reveal.
    choiceButtons()[0].click();
    const second = document.querySelector('[data-choice]:not([disabled])');
    if (second) second.click();

    const card = document.querySelector('.tf-section--wordcard');
    expect(card, 'a revealed vocabulary answer must teach the word').toBeTruthy();
    expect(card.textContent).toContain(soundVerb.answer);
    expect(card.textContent).toContain(getWordGloss(soundVerb.answer));
  });

  /**
   * Every P4 category, taught long ago. `weakSkill` is the only one the child
   * has since gone weak at — so it is the only one a tutor should re-open.
   * Adaptive shuffle serves the weakest skill first, so its card leads.
   */
  function seedStaleLessons(weakSkill) {
    const longAgo = new Date(Date.now() - 60 * 86_400_000).toISOString();
    const categories = new Set(grammarMcq.getItemsForScope({ level: 'P4' }).map((i) => i.category));
    const seen = {};
    const mastery = {};
    for (const category of categories) {
      seen[`gmcq:${category}`] = longAgo;
      mastery[category] = category === weakSkill ? 0.2 : 0.95;
    }
    store.set('lessonsSeen', seen);
    store.set('questMastery', { grammarMcq: mastery });
  }

  it('re-teaches the weak skill specifically, instead of teaching once forever', () => {
    // svAgreement is on the P4 plan, so it can actually be drawn. Adaptive
    // shuffle serves the weakest skill first, so its card leads the round.
    seedStaleLessons('svAgreement');
    expect(questMastery.getSkillScore('grammarMcq', 'svAgreement')).toBeLessThan(0.6);

    const host = mount();
    grammarMcq.initGrammarMcq(host, () => {});
    grammarMcq.startGrammarMcqLevel('P4');

    // The card shown must be the weak skill's — not some other category that
    // merely happened to be unseen.
    const card = document.querySelector('.mcq-rule-card');
    expect(card, 'a stale, weak skill should be re-taught').toBeTruthy();
    expect(card.querySelector('.mcq-rule-title')?.textContent).toBe('Subject-Verb Agreement');
  });

  it('does not re-teach a rule the child is still strong at', () => {
    seedStaleLessons(null); // every skill stale but strong
    const host = mount();
    grammarMcq.initGrammarMcq(host, () => {});
    grammarMcq.startGrammarMcqLevel('P4');
    expect(document.querySelector('.mcq-rule-card')).toBeNull();
  });
});
