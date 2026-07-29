/**
 * Writing draft persistence.
 *
 * This layer holds a child's actual written work between sessions — the
 * one place in the app where losing state means losing something they
 * authored rather than something re-derivable. These tests pin the merge
 * semantics (partial updates must not clobber earlier fields), the
 * tracked/legacy key separation, and the clear paths.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

async function loadStore() {
  const drafts = await import('../modules/writingDraftStore.js');
  const { store } = await import('../modules/store.js');
  return { ...drafts, store };
}

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

describe('tracked drafts', () => {
  it('round-trips a saved draft', async () => {
    const { saveDraft, loadDraft } = await loadStore();
    saveDraft('narrative-p3', 2, { draftText: 'The cat sat.', phase: 'draft' });

    const rec = loadDraft('narrative-p3', 2);
    expect(rec.draftText).toBe('The cat sat.');
    expect(rec.phase).toBe('draft');
    expect(rec.trackId).toBe('narrative-p3');
    expect(rec.lessonIdx).toBe(2);
  });

  it('returns null for a lesson that has no draft', async () => {
    const { loadDraft } = await loadStore();
    expect(loadDraft('narrative-p3', 9)).toBeNull();
  });

  it('merges partial updates instead of replacing the record', async () => {
    const { saveDraft, loadDraft } = await loadStore();
    saveDraft('t1', 0, { draftText: 'first pass', selectedStarter: 'One rainy day' });
    saveDraft('t1', 0, { phase: 'feedback' });

    const rec = loadDraft('t1', 0);
    // The earlier fields must survive a later partial write.
    expect(rec.draftText).toBe('first pass');
    expect(rec.selectedStarter).toBe('One rainy day');
    expect(rec.phase).toBe('feedback');
  });

  it('preserves createdAt across updates but advances updatedAt', async () => {
    const { saveDraft, loadDraft } = await loadStore();
    saveDraft('t1', 0, { draftText: 'a' });
    const first = loadDraft('t1', 0);

    vi.setSystemTime(new Date(Date.parse(first.createdAt) + 60_000));
    saveDraft('t1', 0, { draftText: 'b' });
    const second = loadDraft('t1', 0);

    expect(second.createdAt).toBe(first.createdAt);
    expect(Date.parse(second.updatedAt)).toBeGreaterThanOrEqual(Date.parse(first.updatedAt));
    vi.useRealTimers();
  });

  it('keeps drafts for different lessons and tracks separate', async () => {
    const { saveDraft, loadDraft } = await loadStore();
    saveDraft('t1', 0, { draftText: 'lesson zero' });
    saveDraft('t1', 1, { draftText: 'lesson one' });
    saveDraft('t2', 0, { draftText: 'other track' });

    expect(loadDraft('t1', 0).draftText).toBe('lesson zero');
    expect(loadDraft('t1', 1).draftText).toBe('lesson one');
    expect(loadDraft('t2', 0).draftText).toBe('other track');
  });

  it('hasDraft reflects presence', async () => {
    const { saveDraft, hasDraft } = await loadStore();
    expect(hasDraft('t1', 0)).toBe(false);
    saveDraft('t1', 0, { draftText: 'x' });
    expect(hasDraft('t1', 0)).toBe(true);
  });

  it('clearDraft removes only the targeted lesson', async () => {
    const { saveDraft, clearDraft, loadDraft } = await loadStore();
    saveDraft('t1', 0, { draftText: 'keep me' });
    saveDraft('t1', 1, { draftText: 'delete me' });

    clearDraft('t1', 1);
    expect(loadDraft('t1', 1)).toBeNull();
    expect(loadDraft('t1', 0).draftText).toBe('keep me');
  });
});

describe('legacy (untracked) drafts', () => {
  it('round-trips under its own key space', async () => {
    const { saveLegacyDraft, loadLegacyDraft } = await loadStore();
    saveLegacyDraft(3, 1, { draftText: 'legacy text' });

    const rec = loadLegacyDraft(3, 1);
    expect(rec.draftText).toBe('legacy text');
    expect(rec.level).toBe(3);
  });

  it('does not collide with a tracked draft of similar indices', async () => {
    const { saveDraft, saveLegacyDraft, loadDraft, loadLegacyDraft } = await loadStore();
    saveDraft('3', 1, { draftText: 'tracked' });
    saveLegacyDraft(3, 1, { draftText: 'legacy' });

    expect(loadDraft('3', 1).draftText).toBe('tracked');
    expect(loadLegacyDraft(3, 1).draftText).toBe('legacy');
  });

  it('clearLegacyDraft removes it', async () => {
    const { saveLegacyDraft, clearLegacyDraft, loadLegacyDraft } = await loadStore();
    saveLegacyDraft(2, 0, { draftText: 'x' });
    clearLegacyDraft(2, 0);
    expect(loadLegacyDraft(2, 0)).toBeNull();
  });
});

describe('feedback and revision updates', () => {
  it('updatePhase only changes the phase', async () => {
    const { saveDraft, updatePhase, loadDraft } = await loadStore();
    saveDraft('t1', 0, { draftText: 'body' });
    updatePhase('t1', 0, 'revise');

    const rec = loadDraft('t1', 0);
    expect(rec.phase).toBe('revise');
    expect(rec.draftText).toBe('body');
  });

  it('updateFeedback stores the result and only the optional parts supplied', async () => {
    const { saveDraft, updateFeedback, loadDraft } = await loadStore();
    saveDraft('t1', 0, { draftText: 'body' });
    updateFeedback('t1', 0, { score: 7 }, undefined, ['hit'], undefined);

    const rec = loadDraft('t1', 0);
    expect(rec.feedbackResult).toEqual({ score: 7 });
    expect(rec.missionStatus).toEqual(['hit']);
    // Omitted optional args must not be written as undefined keys.
    expect(rec.remediation).toBeUndefined();
    expect(rec.badges).toBeUndefined();
  });

  it('updateRevision records the revised text and comparison', async () => {
    const { saveDraft, updateRevision, loadDraft } = await loadStore();
    saveDraft('t1', 0, { firstDraftText: 'before' });
    updateRevision('t1', 0, 'after', { score: 9 }, { improved: true });

    const rec = loadDraft('t1', 0);
    expect(rec.firstDraftText).toBe('before');   // original preserved
    expect(rec.revisedDraftText).toBe('after');
    expect(rec.revisionComparison).toEqual({ improved: true });
    expect(rec.badges).toEqual([]);              // defaults when omitted
  });
});

describe('getDraftSummary', () => {
  it('returns null for a missing record', async () => {
    const { getDraftSummary } = await loadStore();
    expect(getDraftSummary(null)).toBeNull();
  });

  it('summarises what the learner has done so far', async () => {
    const { getDraftSummary } = await loadStore();
    const summary = getDraftSummary({
      phase: 'feedback',
      draftText: 'words',
      feedbackResult: { score: 5 },
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    expect(summary).toEqual({
      phase: 'feedback',
      hasText: true,
      hasFeedback: true,
      hasRevision: false,
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
  });

  it('falls back gracefully on a sparse record', async () => {
    const { getDraftSummary } = await loadStore();
    const summary = getDraftSummary({});
    expect(summary.phase).toBe('unknown');
    expect(summary.hasText).toBe(false);
    expect(summary.updatedAt).toBe('');
  });
});
