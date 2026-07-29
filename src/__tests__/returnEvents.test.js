/**
 * Return-visit event sequencing.
 *
 * The property that matters: exactly one modal greets a returning child.
 * Comeback, weekly recap and backup reminder are mutually exclusive per
 * return, each handing off to the next check only when dismissed. Getting
 * this wrong means a child who's been away a week is buried under three
 * stacked dialogs before they can play.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

function setProfile(name = 'Testy') {
  const id = 'p_return';
  localStorage.setItem('phonicsquest_profiles', JSON.stringify([
    { id, name, avatar: '🦊', color: '#6c63ff', schoolLevel: 'preschool' },
  ]));
  localStorage.setItem('phonicsquest_active_profile', id);
  localStorage.setItem('phonicsquest_legacy_migrated_to_profiles', '1');
  return id;
}

/** Give the profile enough practised words to qualify for a backup nudge. */
async function seedProgress(wordCount = 20) {
  const { store } = await import('../modules/store.js');
  const stats = {};
  for (let i = 0; i < wordCount; i++) stats[`w${i}`] = { attempts: 3, correct: 2 };
  store.set('wordStats', stats);
}

beforeEach(() => {
  stubAudioGlobals();
  localStorage.clear();
  document.body.innerHTML = '';
  vi.resetModules();
  vi.useFakeTimers();
});

describe('comeback modal', () => {
  it('greets a returning child by name and offers a warm-up', async () => {
    setProfile('Ada Lovelace');
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.showComebackModal(3);

    const modal = document.getElementById('modal-comeback');
    expect(modal).toBeTruthy();
    expect(modal.querySelector('.cb-title').textContent).toContain('Ada');
    expect(modal.querySelector('.cb-body').textContent).toContain('3 days ago');
    expect(modal.querySelector('#cb-warm-up')).toBeTruthy();
  });

  it('says "yesterday" rather than "1 days ago"', async () => {
    setProfile();
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.showComebackModal(1);
    expect(document.querySelector('.cb-body').textContent).toContain('yesterday');
  });

  it('mentions a live streak but stays quiet when there is none', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    const returnEvents = await import('../modules/returnEvents.js');

    returnEvents.showComebackModal(2);
    expect(document.querySelector('.cb-streak')).toBeNull();

    store.set('streak', 5);
    returnEvents.showComebackModal(2);
    expect(document.querySelector('.cb-streak').textContent).toContain('5 days');
  });

  it('runs the warm-up callback and closes when accepted', async () => {
    setProfile();
    const onStartWarmUp = vi.fn();
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.showComebackModal(2, { onStartWarmUp });

    document.getElementById('cb-warm-up').click();
    expect(onStartWarmUp).toHaveBeenCalledOnce();
    expect(document.getElementById('modal-comeback')).toBeNull();
  });

  it('escapes a name carrying markup', async () => {
    setProfile('<img src=x onerror=1>');
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.showComebackModal(2);

    const modal = document.getElementById('modal-comeback');
    expect(modal.querySelector('img')).toBeNull();
  });

  it('replaces rather than stacks if shown twice', async () => {
    setProfile();
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.showComebackModal(2);
    returnEvents.showComebackModal(3);
    expect(document.querySelectorAll('#modal-comeback').length).toBe(1);
  });
});

describe('backup reminder', () => {
  it('stays silent for a learner with little progress to lose', async () => {
    setProfile();
    await seedProgress(3); // under the threshold
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.checkBackupReminder();
    expect(document.getElementById('modal-backup-reminder')).toBeNull();
  });

  it('prompts once there is real progress at stake', async () => {
    setProfile();
    await seedProgress(20);
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.checkBackupReminder();

    const modal = document.getElementById('modal-backup-reminder');
    expect(modal).toBeTruthy();
    // Framed around what's at stake, not generic "back up your data".
    expect(modal.querySelector('.br-body').textContent).toContain('20 words');
  });

  it('does not nag again within the reminder interval', async () => {
    setProfile();
    await seedProgress(20);
    const { store } = await import('../modules/store.js');
    store.set('lastBackupReminderAt', new Date().toISOString());

    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.checkBackupReminder();
    expect(document.getElementById('modal-backup-reminder')).toBeNull();
  });

  it('prompts again once a week has passed', async () => {
    setProfile();
    await seedProgress(20);
    const { store } = await import('../modules/store.js');
    store.set('lastBackupReminderAt', new Date(Date.now() - 8 * 86_400_000).toISOString());

    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.checkBackupReminder();
    expect(document.getElementById('modal-backup-reminder')).toBeTruthy();
  });

  it('dismisses without exporting when the parent defers', async () => {
    setProfile();
    await seedProgress(20);
    const onToast = vi.fn();
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.showBackupReminderModal({ onToast });

    document.getElementById('br-dismiss-btn').click();
    expect(document.getElementById('modal-backup-reminder')).toBeNull();
    expect(onToast).not.toHaveBeenCalled();
  });
});

describe('return-event priority', () => {
  it('shows the comeback modal for a short absence and defers the rest', async () => {
    setProfile();
    await seedProgress(20);
    const { gamification } = await import('../modules/gamification.js');
    vi.spyOn(gamification, 'wasFreezeUsed').mockReturnValue(false);
    vi.spyOn(gamification, 'getDaysAway').mockReturnValue(3);

    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.checkReturnEvents();
    vi.advanceTimersByTime(1000);

    expect(document.getElementById('modal-comeback')).toBeTruthy();
    // The backup nudge must not pile on top of the welcome.
    expect(document.getElementById('modal-backup-reminder')).toBeNull();
  });

  it('only greets once per day', async () => {
    setProfile();
    const { store } = await import('../modules/store.js');
    const { gamification } = await import('../modules/gamification.js');
    vi.spyOn(gamification, 'wasFreezeUsed').mockReturnValue(false);
    vi.spyOn(gamification, 'getDaysAway').mockReturnValue(3);
    store.set('comebackShownAt', new Date().toISOString());

    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.checkReturnEvents();
    vi.advanceTimersByTime(1000);

    expect(document.getElementById('modal-comeback')).toBeNull();
  });

  it('reports a used streak freeze as reassurance', async () => {
    setProfile();
    const { gamification } = await import('../modules/gamification.js');
    vi.spyOn(gamification, 'wasFreezeUsed').mockReturnValue(true);
    vi.spyOn(gamification, 'getDaysAway').mockReturnValue(0);

    const onToast = vi.fn();
    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.checkReturnEvents({ onToast });

    expect(onToast).toHaveBeenCalledWith(expect.stringMatching(/streak saved/i), 'success');
  });

  it('falls through to the backup check when nothing else is due', async () => {
    setProfile();
    await seedProgress(20);
    const { gamification } = await import('../modules/gamification.js');
    vi.spyOn(gamification, 'wasFreezeUsed').mockReturnValue(false);
    vi.spyOn(gamification, 'getDaysAway').mockReturnValue(0);

    const returnEvents = await import('../modules/returnEvents.js');
    returnEvents.checkReturnEvents();

    expect(document.getElementById('modal-backup-reminder')).toBeTruthy();
  });
});
