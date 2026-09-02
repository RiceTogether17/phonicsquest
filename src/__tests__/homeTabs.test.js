/**
 * Tests for the home tab controller (homeTabs.js): selection, keyboard
 * navigation, per-profile persistence, and the new-day reset to Today.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] ?? null),
    setItem: vi.fn((key, val) => {
      store[key] = String(val);
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

const TABS = ['today', 'learn', 'extra', 'grownups'];

function buildDom() {
  document.body.innerHTML = `
    <section id="screen-home">
      <div class="home-tabs" role="tablist">
        ${TABS.map(
          (t, i) => `
          <button class="home-tab" id="home-tab-${t}" role="tab"
                  aria-selected="${i === 0}" aria-controls="home-panel-${t}"
                  ${i === 0 ? '' : 'tabindex="-1"'}>${t}</button>`,
        ).join('')}
      </div>
      ${TABS.map(
        (t, i) => `
        <div class="home-tabpanel" id="home-panel-${t}" role="tabpanel" ${i === 0 ? '' : 'hidden'}>
          <button id="inside-${t}">inside ${t}</button>
        </div>`,
      ).join('')}
    </section>`;
}

let store;
let homeTabs;

beforeEach(async () => {
  localStorageMock.clear();
  vi.resetModules();
  buildDom();
  store = (await import('../modules/store.js')).store;
  homeTabs = await import('../modules/homeTabs.js');
});

describe('selectTab', () => {
  it('shows exactly one panel and updates aria state', () => {
    homeTabs.initHomeTabs();
    homeTabs.selectTab('learn');

    expect(document.getElementById('home-panel-learn').hidden).toBe(false);
    for (const t of TABS.filter((t) => t !== 'learn')) {
      expect(document.getElementById(`home-panel-${t}`).hidden).toBe(true);
    }
    expect(document.getElementById('home-tab-learn').getAttribute('aria-selected')).toBe('true');
    expect(document.getElementById('home-tab-today').getAttribute('aria-selected')).toBe('false');
    expect(document.getElementById('home-tab-learn').tabIndex).toBe(0);
    expect(document.getElementById('home-tab-today').tabIndex).toBe(-1);
  });

  it("persists the choice with today's date", () => {
    homeTabs.initHomeTabs();
    homeTabs.selectTab('extra');
    expect(store.get('homeTab')).toBe('extra');
    expect(store.get('homeTabDate')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('ignores unknown tab ids', () => {
    homeTabs.initHomeTabs();
    homeTabs.selectTab('bogus');
    expect(document.getElementById('home-panel-today').hidden).toBe(false);
  });
});

describe('getInitialTab', () => {
  it('defaults to today for a fresh profile', () => {
    expect(homeTabs.getInitialTab()).toBe('today');
  });

  it('returns the saved tab on the same day', () => {
    homeTabs.initHomeTabs();
    homeTabs.selectTab('learn');
    expect(homeTabs.getInitialTab()).toBe('learn');
  });

  it('resets to today on a new day', () => {
    homeTabs.initHomeTabs();
    homeTabs.selectTab('grownups', { persist: true });
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    expect(homeTabs.getInitialTab(tomorrow)).toBe('today');
  });
});

describe('keyboard navigation', () => {
  function press(key) {
    document
      .querySelector('.home-tabs')
      .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  }

  it('ArrowRight moves to the next tab and wraps', () => {
    homeTabs.initHomeTabs();
    press('ArrowRight');
    expect(homeTabs.getActiveTab()).toBe('learn');
    press('ArrowRight');
    press('ArrowRight');
    press('ArrowRight');
    expect(homeTabs.getActiveTab()).toBe('today'); // wrapped
  });

  it('ArrowLeft wraps backwards; Home/End jump', () => {
    homeTabs.initHomeTabs();
    press('ArrowLeft');
    expect(homeTabs.getActiveTab()).toBe('grownups');
    press('Home');
    expect(homeTabs.getActiveTab()).toBe('today');
    press('End');
    expect(homeTabs.getActiveTab()).toBe('grownups');
  });
});

describe('hidden panels and programmatic dispatch', () => {
  it('a button inside a hidden panel still receives programmatic clicks', () => {
    homeTabs.initHomeTabs(); // today active; learn hidden
    const spy = vi.fn();
    document.getElementById('inside-learn').addEventListener('click', spy);
    document.getElementById('inside-learn').click();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('initHomeTabs', () => {
  it('restores the saved same-day tab on init', () => {
    store.set('homeTab', 'extra');
    store.set(
      'homeTabDate',
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
    );
    homeTabs.initHomeTabs();
    expect(homeTabs.getActiveTab()).toBe('extra');
    expect(document.getElementById('home-panel-extra').hidden).toBe(false);
  });

  it('click on a tab fires onChange', () => {
    const onChange = vi.fn();
    homeTabs.initHomeTabs({ onChange });
    document.getElementById('home-tab-learn').click();
    expect(onChange).toHaveBeenCalledWith('learn');
    expect(homeTabs.getActiveTab()).toBe('learn');
  });
});
