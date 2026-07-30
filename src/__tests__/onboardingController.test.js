/**
 * First-run onboarding tutorial + parent PIN gate.
 *
 * Both are adult-facing gates that were previously untestable DOM wiring
 * inside app.js. The PIN tests matter most: this is the only thing between
 * a child and the parent dashboard, and it has a first-use path that sets
 * the PIN plus a legacy-format upgrade path.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

function stubAudioGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [], addEventListener: () => {}, speak: () => {}, cancel: () => {},
  };
}

function mountOnboardingDom() {
  document.body.innerHTML = `
    <div id="ob-content"></div>
    <div id="ob-dots"></div>
    <button id="ob-prev"></button>
    <button id="ob-next"></button>
    <button id="ob-skip-btn"></button>`;
}

function mountPinDom() {
  document.body.innerHTML = `
    <input class="pin-digit" /><input class="pin-digit" />
    <input class="pin-digit" /><input class="pin-digit" />
    <p id="pin-hint"></p>
    <button id="pin-confirm-btn"></button>
    <button id="pin-cancel-btn"></button>`;
}

function typePin(pin) {
  document.querySelectorAll('.pin-digit').forEach((d, i) => { d.value = pin[i] ?? ''; });
}

const handlers = () => ({
  openModal: vi.fn(),
  closeModal: vi.fn(),
  onUnlocked: vi.fn(),
});

/**
 * Wait for the click handler's awaited PIN hashing to finish.
 *
 * Polls rather than sleeping a fixed interval: PIN verification runs a
 * real crypto hash, which takes noticeably longer under full-suite load
 * than it does with this file alone. A fixed delay passed in isolation and
 * flaked in CI.
 *
 * @param {() => boolean} [done] condition to wait for; defaults to one tick
 */
const settle = async (done = null) => {
  for (let i = 0; i < 100; i++) {
    await new Promise(r => setTimeout(r, 5));
    if (!done || done()) return;
  }
};

beforeEach(() => {
  stubAudioGlobals();
  localStorage.clear();
  vi.resetModules();
});

describe('onboarding tutorial', () => {
  it('renders the first screen and opens the modal', async () => {
    mountOnboardingDom();
    const h = handlers();
    const oc = await import('../modules/onboardingController.js');
    oc.showOnboardingTutorial('pre-reader', h);

    expect(document.querySelector('.ob-screen-title').textContent).toContain('Pre-reader');
    expect(document.querySelectorAll('.ob-dot').length).toBe(4);
    expect(h.openModal).toHaveBeenCalledWith('modal-onboarding');
  });

  it('hides Back on the first screen and advances through the deck', async () => {
    mountOnboardingDom();
    const oc = await import('../modules/onboardingController.js');
    oc.showOnboardingTutorial('pre-reader', handlers());

    const prev = document.getElementById('ob-prev');
    const next = document.getElementById('ob-next');
    expect(prev.hidden).toBe(true);

    next.click();
    expect(prev.hidden).toBe(false);
    expect(document.querySelector('.ob-dot--active').previousElementSibling).not.toBeNull();
  });

  it('labels the final step as a call to action, not "Next"', async () => {
    mountOnboardingDom();
    const oc = await import('../modules/onboardingController.js');
    oc.showOnboardingTutorial('pre-reader', handlers());

    const next = document.getElementById('ob-next');
    next.click(); next.click(); next.click(); // to the last of 4
    expect(next.textContent).toMatch(/let's go/i);
  });

  it('marks onboarding complete when finished', async () => {
    mountOnboardingDom();
    const h = handlers();
    const { store } = await import('../modules/store.js');
    const oc = await import('../modules/onboardingController.js');
    oc.showOnboardingTutorial('pre-reader', h);

    const next = document.getElementById('ob-next');
    next.click(); next.click(); next.click(); next.click();

    expect(store.get('onboardingComplete')).toBe(true);
    expect(h.closeModal).toHaveBeenCalledWith('modal-onboarding');
  });

  it('marks it complete when skipped too', async () => {
    mountOnboardingDom();
    const { store } = await import('../modules/store.js');
    const oc = await import('../modules/onboardingController.js');
    oc.showOnboardingTutorial('pre-reader', handlers());

    document.getElementById('ob-skip-btn').click();
    expect(store.get('onboardingComplete')).toBe(true);
  });

  it('walks all four screens for each band, in the intended order', async () => {
    const { ONBOARDING_TUTORIAL } = await import('../data/onboardingTutorial.js');
    const oc = await import('../modules/onboardingController.js');

    for (const band of Object.keys(ONBOARDING_TUTORIAL)) {
      mountOnboardingDom();
      oc.showOnboardingTutorial(band, handlers());

      const next = document.getElementById('ob-next');
      const seen = [];
      for (let i = 0; i < 4; i++) {
        seen.push(document.querySelector('.ob-screen-title').textContent.trim());
        expect(document.querySelectorAll('.ob-dot').length, band).toBe(4);
        // The active dot must track the step, or the parent loses their place.
        const dots = [...document.querySelectorAll('.ob-dot')];
        expect(dots.findIndex(d => d.classList.contains('ob-dot--active')), `${band} step ${i}`).toBe(i);
        if (i < 3) next.click();
      }

      // Journey first, then order, then the focus card, then bonuses.
      expect(seen[0], band).toMatch(/Journey|Bridge/i);
      expect(seen[1], band).toMatch(/order each day/i);
      expect(seen[2], band).toMatch(/card every day/i);
      expect(seen[3], band).toMatch(/Bonus activities/i);
    }
  });

  it('falls back to the pre-reader deck for an unknown band', async () => {
    mountOnboardingDom();
    const oc = await import('../modules/onboardingController.js');
    oc.showOnboardingTutorial('not-a-band', handlers());
    expect(document.querySelector('.ob-screen-title').textContent).toContain('Pre-reader');
  });

  it('is a no-op when the onboarding DOM is absent', async () => {
    document.body.innerHTML = '';
    const h = handlers();
    const oc = await import('../modules/onboardingController.js');
    expect(() => oc.showOnboardingTutorial('pre-reader', h)).not.toThrow();
    expect(h.openModal).not.toHaveBeenCalled();
  });

  it('gives every reading band the same complete 4-screen deck', async () => {
    const { ONBOARDING_TUTORIAL } = await import('../data/onboardingTutorial.js');
    const bands = Object.keys(ONBOARDING_TUTORIAL);
    expect(bands).toEqual(
      expect.arrayContaining(['pre-reader', 'emerging-decoder', 'developing-reader', 'reader']),
    );

    for (const [band, screens] of Object.entries(ONBOARDING_TUTORIAL)) {
      // Two bands used to ship with only the journey screen, leaving those
      // parents without the daily order, the Best Next Step explanation or
      // the bonus-vs-lesson distinction. Pin the full deck so a new band
      // can't quietly regress to a stub.
      expect(screens.length, `${band} deck length`).toBe(4);
      for (const s of screens) {
        expect(s.icon, band).toBeTruthy();
        expect(s.title, band).toBeTruthy();
        expect(s.body, band).toBeTruthy();
      }
    }
  });

  it('orients the adult on order, focus and bonuses in every band', async () => {
    const { ONBOARDING_TUTORIAL } = await import('../data/onboardingTutorial.js');
    for (const [band, screens] of Object.entries(ONBOARDING_TUTORIAL)) {
      const titles = screens.map(s => s.title).join(' | ');
      expect(titles, band).toMatch(/order each day/i);
      expect(titles, band).toMatch(/card every day/i);
      expect(titles, band).toMatch(/bonus activities/i);

      // The daily-order screen must actually lay out numbered steps, and the
      // bonus screen must say where to find them.
      const bodies = screens.map(s => s.body).join(' ');
      expect(bodies, band).toContain('ob-step-num');
      expect(bodies, band).toMatch(/Extra<\/strong> tab/);
    }
  });

  it('only claims Extra-tab activities are in the Extra tab', async () => {
    // The original decks told parents Sight Words / Stories / Letter Sounds
    // were in the Extra tab; they are in Learn. Sending an adult to the wrong
    // tab is a real usability failure, so the copy is pinned to reality.
    //
    // Ground truth: of the activities these screens name, only Daily
    // Challenge, Random Activity and My Trophy Room live under
    // #home-panel-extra in index.html.
    const { ONBOARDING_TUTORIAL } = await import('../data/onboardingTutorial.js');
    const notInExtra = ['Sight Words', 'Giri Stories', 'Letter Sounds', 'Fluency Sprint'];

    for (const [band, screens] of Object.entries(ONBOARDING_TUTORIAL)) {
      const bonus = screens.find(s => /Bonus activities/i.test(s.title));
      expect(bonus, `${band} bonus screen`).toBeTruthy();

      // Split the list of Extra-tab items from the trailing note.
      const list = bonus.body.split('ob-bonus-note')[0];
      for (const name of notInExtra) {
        expect(list, `${band}: "${name}" listed as an Extra-tab item`).not.toContain(name);
      }
      // And the items it does list are the genuine Extra-tab ones.
      expect(list, band).toContain('Daily Challenge');
    }
  });

  it('names band-appropriate activities rather than generic copy', async () => {
    const { getTutorialScreens } = await import('../data/onboardingTutorial.js');
    const bodyOf = band => getTutorialScreens(band).map(s => s.body).join(' ');

    // An emerging decoder is not yet doing sentence construction, and a
    // reader is not being sent back to letter-sound matching.
    expect(bodyOf('emerging-decoder')).toMatch(/Blend It!/);
    expect(bodyOf('emerging-decoder')).not.toMatch(/Cloze Castle|Word Vault/);
    expect(bodyOf('developing-reader')).toMatch(/Sentence Forge/);
    expect(bodyOf('reader')).toMatch(/Cloze Castle/);
    expect(bodyOf('pre-reader')).toMatch(/First Sound|Letter Sounds/);
  });
});

describe('parent PIN gate', () => {
  it('refuses an incomplete PIN', async () => {
    mountPinDom();
    const h = handlers();
    const oc = await import('../modules/onboardingController.js');
    oc.bindPinGate(h);

    typePin('12');
    document.getElementById('pin-confirm-btn').click();
    await settle(() => !!document.getElementById('pin-hint').textContent);

    expect(document.getElementById('pin-hint').textContent).toMatch(/all 4 digits/i);
    expect(h.onUnlocked).not.toHaveBeenCalled();
  });

  it('sets the PIN on first use and unlocks', async () => {
    mountPinDom();
    const h = handlers();
    const { store } = await import('../modules/store.js');
    const oc = await import('../modules/onboardingController.js');
    oc.bindPinGate(h);

    typePin('1234');
    document.getElementById('pin-confirm-btn').click();
    await settle(() => !!store.get('parentPin'));

    const saved = store.get('parentPin');
    expect(saved).toBeTruthy();
    // Never stored in the clear.
    expect(String(saved)).not.toContain('1234');
    expect(h.onUnlocked).toHaveBeenCalledOnce();
  });

  it('unlocks on the correct PIN and rejects a wrong one', async () => {
    mountPinDom();
    const { store } = await import('../modules/store.js');
    const { createPinHash } = await import('../modules/parentPin.js');
    store.set('parentPin', await createPinHash('4321'));

    const h = handlers();
    const oc = await import('../modules/onboardingController.js');
    oc.bindPinGate(h);

    typePin('0000');
    document.getElementById('pin-confirm-btn').click();
    await settle(() => /wrong pin/i.test(document.getElementById('pin-hint').textContent));
    expect(h.onUnlocked).not.toHaveBeenCalled();
    expect(document.getElementById('pin-hint').textContent).toMatch(/wrong pin/i);
    // Boxes are cleared so the next attempt starts fresh.
    expect(Array.from(document.querySelectorAll('.pin-digit')).every(d => d.value === '')).toBe(true);

    typePin('4321');
    document.getElementById('pin-confirm-btn').click();
    await settle(() => h.onUnlocked.mock.calls.length > 0);
    expect(h.onUnlocked).toHaveBeenCalledOnce();
  });

  it('closes without unlocking on cancel', async () => {
    mountPinDom();
    const h = handlers();
    const oc = await import('../modules/onboardingController.js');
    oc.bindPinGate(h);

    typePin('1234');
    document.getElementById('pin-cancel-btn').click();

    expect(h.closeModal).toHaveBeenCalledWith('modal-pin');
    expect(h.onUnlocked).not.toHaveBeenCalled();
    expect(Array.from(document.querySelectorAll('.pin-digit')).every(d => d.value === '')).toBe(true);
  });

  it('advances focus as digits are typed', async () => {
    mountPinDom();
    const oc = await import('../modules/onboardingController.js');
    oc.bindPinGate(handlers());

    const digits = document.querySelectorAll('.pin-digit');
    digits[0].value = '7';
    digits[0].dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.activeElement).toBe(digits[1]);
  });

  it('steps back on backspace in an empty box', async () => {
    mountPinDom();
    const oc = await import('../modules/onboardingController.js');
    oc.bindPinGate(handlers());

    const digits = document.querySelectorAll('.pin-digit');
    digits[2].value = '';
    digits[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    expect(document.activeElement).toBe(digits[1]);
  });

  it('is a no-op when the PIN DOM is absent', async () => {
    document.body.innerHTML = '';
    const oc = await import('../modules/onboardingController.js');
    expect(() => oc.bindPinGate(handlers())).not.toThrow();
  });
});
