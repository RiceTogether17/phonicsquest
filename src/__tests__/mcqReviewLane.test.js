import { beforeEach, describe, expect, it } from 'vitest';
import { store } from '../modules/store.js';
import {
  recordMcqAttempt,
  getDueReviews,
  countDueReviews,
  RECOVERED_BOX,
  LANE_CAP,
} from '../modules/mcqReviewLane.js';

const DAY = 86_400_000;

function item(seed, overrides = {}) {
  return {
    id: `g-p3-articles-${seed}`,
    seedId: `g:articles:${seed}`,
    level: 'P3',
    category: 'articles',
    q: `Sentence ${seed} with ___ blank.`,
    choices: ['a', 'an', 'the', 'some'],
    answer: 'an',
    explain: 'Use "an" before vowel sounds.',
    optionExplanations: {
      a: 'x'.repeat(30),
      an: 'y'.repeat(30),
      the: 'z'.repeat(30),
      some: 'w'.repeat(30),
    },
    ...overrides,
  };
}

beforeEach(() => {
  store.set('mcqReviewLane', {});
});

describe('mcqReviewLane', () => {
  it('a first-attempt miss enters the lane, due immediately', () => {
    recordMcqAttempt('grammarMcq', item('001'), false);
    const due = getDueReviews('grammarMcq');
    expect(due).toHaveLength(1);
    expect(due[0].seedId).toBe('g:articles:001');
    expect(due[0].isReview).toBe(true);
  });

  it('a correct answer on an untracked item does not enter the lane', () => {
    recordMcqAttempt('grammarMcq', item('001'), true);
    expect(countDueReviews('grammarMcq')).toBe(0);
  });

  it('spaced successes push the next review out, then retire the item', () => {
    const now = Date.now();
    recordMcqAttempt('grammarMcq', item('001'), false, now);
    // Correct the next day → due moves into the future.
    recordMcqAttempt('grammarMcq', item('001'), true, now + DAY);
    expect(getDueReviews('grammarMcq', { now: now + DAY + 1000 })).toHaveLength(0);
    // Climb the ladder day by spaced day until recovered.
    let t = now + DAY;
    for (let box = 1; box < RECOVERED_BOX; box += 1) {
      t += 40 * DAY; // comfortably past any interval
      recordMcqAttempt('grammarMcq', item('001'), true, t);
    }
    expect(store.get('mcqReviewLane')['grammarMcq:g:articles:001']).toBeUndefined();
  });

  it('a recovery-round success holds the box — it proves help, not retention', () => {
    const now = Date.now();
    recordMcqAttempt('grammarMcq', item('001'), false, now);
    const afterMiss = store.get('mcqReviewLane')['grammarMcq:g:articles:001'];

    // Answering correctly seconds later in the recovery round must not promote.
    recordMcqAttempt('grammarMcq', item('001'), true, now + 30_000, { promote: false });
    const afterRecovery = store.get('mcqReviewLane')['grammarMcq:g:articles:001'];
    expect(afterRecovery.box).toBe(afterMiss.box);
    expect(afterRecovery.dueAt).toBe(afterMiss.dueAt);

    // Four quick recovery rounds must not retire an item never recalled cold.
    for (let i = 0; i < 4; i += 1) {
      recordMcqAttempt('grammarMcq', item('001'), true, now + 60_000 * (i + 1), { promote: false });
    }
    expect(store.get('mcqReviewLane')['grammarMcq:g:articles:001']).toBeTruthy();
  });

  it('a wrong answer in a recovery round still demotes', () => {
    const now = Date.now();
    recordMcqAttempt('grammarMcq', item('001'), false, now);
    recordMcqAttempt('grammarMcq', item('001'), true, now + 40 * DAY); // real spaced success → box 1
    recordMcqAttempt('grammarMcq', item('001'), false, now + 41 * DAY, { promote: false });
    expect(store.get('mcqReviewLane')['grammarMcq:g:articles:001'].box).toBe(0);
  });

  it('a wrong answer pulls the item closer again', () => {
    const now = Date.now();
    recordMcqAttempt('grammarMcq', item('001'), false, now);
    recordMcqAttempt('grammarMcq', item('001'), true, now + DAY);
    recordMcqAttempt('grammarMcq', item('001'), false, now + 2 * DAY);
    expect(getDueReviews('grammarMcq', { now: now + 2 * DAY + 1000 })).toHaveLength(1);
  });

  it('scope filters mirror the round scope', () => {
    recordMcqAttempt('grammarMcq', item('001'), false);
    recordMcqAttempt(
      'grammarMcq',
      item('002', { level: 'P5', category: 'modals', seedId: 'g:modals:002' }),
      false,
    );
    expect(getDueReviews('grammarMcq', { level: 'P3' })).toHaveLength(1);
    expect(getDueReviews('grammarMcq', { category: 'modals' })).toHaveLength(1);
    expect(getDueReviews('grammarMcq', { level: 'P3', category: 'modals' })).toHaveLength(0);
    expect(getDueReviews('grammarMcq')).toHaveLength(2);
  });

  it('two renderings of one seed share a single review thread', () => {
    // Same seedId, different wrapper frame and pupil name — one question.
    recordMcqAttempt(
      'grammarMcq',
      item('001', {
        id: 'g-p3-articles-001',
        q: 'Fill in the blank in Mei’s sentence: Sentence 001 with ___ blank.',
      }),
      false,
    );
    recordMcqAttempt(
      'grammarMcq',
      item('001', {
        id: 'g-p3-articles-047',
        q: 'Help Ravi complete this sentence: Sentence 001 with ___ blank.',
      }),
      false,
    );
    expect(countDueReviews('grammarMcq')).toBe(1);
  });

  it('modes are isolated from each other', () => {
    recordMcqAttempt('grammarMcq', item('001'), false);
    expect(countDueReviews('vocabMcq')).toBe(0);
  });

  it('the lane stays bounded per mode', () => {
    const now = Date.now();
    for (let i = 0; i < LANE_CAP + 10; i += 1) {
      recordMcqAttempt(
        'grammarMcq',
        item(String(i), { seedId: `g:articles:${i}` }),
        false,
        now + i,
      );
    }
    const lane = store.get('mcqReviewLane');
    expect(Object.keys(lane).length).toBeLessThanOrEqual(LANE_CAP);
    // Oldest-seen entries were the ones evicted.
    expect(lane['grammarMcq:g:articles:0']).toBeUndefined();
    expect(lane[`grammarMcq:g:articles:${LANE_CAP + 9}`]).toBeTruthy();
  });

  it('items without a seedId are ignored rather than corrupting the lane', () => {
    recordMcqAttempt('grammarMcq', { ...item('001'), seedId: undefined }, false);
    expect(countDueReviews('grammarMcq')).toBe(0);
  });
});
