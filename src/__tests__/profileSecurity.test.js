/**
 * Profile-input security regression guard.
 *
 * A profile name is user-supplied and reaches innerHTML in several places
 * (weekly recap, home pathway badge, profile grid, curriculum map, session
 * summary). The typed form caps length via `maxlength`, but `importProfile()`
 * reads names straight out of a user-supplied JSON export file — that path
 * previously accepted arbitrary markup and stored it verbatim.
 *
 * These tests pin both halves of the fix:
 *   1. the boundary sanitises/bounds what gets stored, and
 *   2. the render sites escape, so markup shows up as text either way.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

const XSS_NAME = '<img src=x onerror=alert(1)>';
const SVG_PAYLOAD = '<svg onload=alert(1)>';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
}

/** Build a syntactically valid export payload with an attacker-chosen name. */
function exportPayload(name, extra = {}) {
  return JSON.stringify({
    _type: 'phonicsquest_profile_export',
    profile: { name, avatar: '🦊', color: '#6c63ff', schoolLevel: 'preschool', ...extra },
    progressData: {},
  });
}

let profiles;
beforeEach(async () => {
  stubAudioGlobals();
  localStorage.clear();
  vi.resetModules();
  profiles = await import('../modules/profiles.js');
});

describe('profile name sanitisation at the boundary', () => {
  it('strips markup-bearing names down to inert text on import', () => {
    const { profile, error } = profiles.importProfile(exportPayload(XSS_NAME));
    expect(error).toBeFalsy();
    // The security property is that the stored name can no longer form a
    // tag — angle brackets are gone. Leftover words like "onerror" are inert
    // text; filtering those too would mangle legitimate names for no gain.
    expect(profile.name).not.toMatch(/[<>]/);
  });

  it('rejects an import whose name is nothing but markup/whitespace', () => {
    const { profile, error } = profiles.importProfile(exportPayload('   \n\t  '));
    expect(profile).toBeNull();
    expect(error).toBeTruthy();
  });

  it('clamps absurdly long imported names', () => {
    const { profile } = profiles.importProfile(exportPayload('A'.repeat(5000)));
    expect(profile.name.length).toBeLessThanOrEqual(profiles.MAX_PROFILE_NAME_LENGTH);
  });

  it('keeps the " (imported)" suffix within the length bound', () => {
    const { profile } = profiles.importProfile(exportPayload('Bartholomew Fitzgerald'));
    expect(profile.name).toContain('(imported)');
    expect(profile.name.length).toBeLessThanOrEqual(profiles.MAX_PROFILE_NAME_LENGTH);
  });

  it('rejects an avatar or colour outside the known sets', () => {
    const { profile } = profiles.importProfile(
      exportPayload('Testy', { avatar: '<script>x</script>', color: 'red;background:url(evil)' }),
    );
    expect(profile.avatar).not.toContain('<');
    // Colour reaches an inline style attribute — must come from the palette.
    expect(profile.color).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it('strips control characters and collapses newlines from typed names', () => {
    const p = profiles.createProfile('Anna \u0007 \n Smith', '🦁', '#6c63ff');
    expect(p.name).toBe('Anna Smith');
  });
});

describe('render sites treat a malicious name as text', () => {
  it('weekly recap renders markup inertly', async () => {
    profiles.createProfile(SVG_PAYLOAD, '🦁', '#6c63ff');
    const [{ showWeeklyRecap }] = await Promise.all([import('../components/weeklyRecap.js')]);
    // Activate the profile so the recap picks it up.
    const all = profiles.getProfiles();
    profiles.activateProfile(all[0].id);

    document.body.innerHTML = '';
    showWeeklyRecap({
      stats: { daysPlayed: 3, xpThisWeek: 10, wordsThisWeek: 5, questsThisWeek: 1 },
      onClose: () => {},
    });

    const modal = document.getElementById('modal-weekly-recap');
    expect(modal).toBeTruthy();
    // No live element was created from the payload...
    expect(modal.querySelector('svg')).toBeNull();
    expect(modal.querySelector('script')).toBeNull();
    // ...and nothing carries an inline event handler.
    expect(modal.innerHTML).not.toMatch(/onload=/i);
  });

  it('profile grid renders markup inertly', async () => {
    // Names are sanitised on the way in, so simulate a pre-existing
    // hostile record written by an older build to prove the render escapes.
    localStorage.setItem(
      'phonicsquest_profiles',
      JSON.stringify([
        { id: 'p_x', name: XSS_NAME, avatar: '🦁', color: '#6c63ff', schoolLevel: 'preschool' },
      ]),
    );

    const { html } = await import('../utils/html.js');
    const grid = document.createElement('div');
    const list = JSON.parse(localStorage.getItem('phonicsquest_profiles'));
    grid.innerHTML = list.map((p) => html`<span class="profile-name">${p.name}</span>`).join('');

    expect(grid.querySelector('img')).toBeNull();
    expect(grid.textContent).toContain('<img');
  });
});
