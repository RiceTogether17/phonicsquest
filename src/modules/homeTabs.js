/**
 * PhonicsQuest – Home Tabs
 *
 * The home screen is split into four short tab panels (Today / Learn /
 * Extra / Grown-ups) instead of one long scroll. This module owns the
 * WAI-ARIA tabs behaviour and per-profile persistence:
 *
 *   - panels toggle via the `hidden` attribute, so hidden content drops
 *     out of the a11y tree and tab order automatically while programmatic
 *     `.click()` dispatch from app._navigateTo() keeps working
 *   - arrow keys / Home / End move between tabs (roving tabindex)
 *   - the last-used tab persists per profile, but a NEW DAY always lands
 *     the child back on Today — the tab with one clear next action
 *
 * Section-level band gating (_manageSectionVisibility) is an independent
 * layer: it keeps toggling sections *inside* panels regardless of which
 * panel is open.
 */

import { store } from './store.js';
import { localYmd } from '../utils/dates.js';

export const HOME_TABS = Object.freeze(['today', 'learn', 'extra', 'grownups']);

const DEFAULT_TAB = 'today';

const _todayISO = (now = new Date()) => localYmd(now);

function _tabEl(tab) { return document.getElementById(`home-tab-${tab}`); }
function _panelEl(tab) { return document.getElementById(`home-panel-${tab}`); }

/**
 * Which tab to show right now: a new day resets to Today; otherwise the
 * profile's last-used tab.
 * @param {Date} [now]
 * @returns {string}
 */
export function getInitialTab(now = new Date()) {
  const saved = store.get('homeTab');
  const savedDate = store.get('homeTabDate');
  if (!saved || !HOME_TABS.includes(saved)) return DEFAULT_TAB;
  if (savedDate !== _todayISO(now)) return DEFAULT_TAB;
  return saved;
}

/**
 * Show one tab panel and update tab button states.
 * @param {string} tab  one of HOME_TABS
 * @param {object} [opts]
 * @param {boolean} [opts.persist]  remember as the profile's last tab
 * @param {boolean} [opts.focus]    move focus to the tab button (keyboard nav)
 */
export function selectTab(tab, { persist = true, focus = false } = {}) {
  if (!HOME_TABS.includes(tab)) return;

  for (const t of HOME_TABS) {
    const btn = _tabEl(t);
    const panel = _panelEl(t);
    const active = t === tab;
    if (btn) {
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
      btn.classList.toggle('home-tab--active', active);
    }
    if (panel) panel.hidden = !active;
  }

  if (focus) _tabEl(tab)?.focus();

  if (persist) {
    store.set('homeTab', tab);
    store.set('homeTabDate', _todayISO());
  }
}

/** Currently selected tab (from the DOM, not the store). */
export function getActiveTab() {
  return HOME_TABS.find(t => _tabEl(t)?.getAttribute('aria-selected') === 'true') || DEFAULT_TAB;
}

/**
 * Wire up tab buttons (click + keyboard). Call once at startup, after the
 * static DOM exists.
 * @param {{ onChange?: (tab: string) => void }} [opts]
 */
export function initHomeTabs({ onChange } = {}) {
  const tablist = document.querySelector('.home-tabs');
  if (!tablist) return;

  for (const tab of HOME_TABS) {
    _tabEl(tab)?.addEventListener('click', () => {
      selectTab(tab);
      // A tab switch is a navigation moment — start the panel at its top.
      document.getElementById('screen-home')?.scrollIntoView?.({ block: 'start' });
      onChange?.(tab);
    });
  }

  tablist.addEventListener('keydown', (ev) => {
    const idx = HOME_TABS.indexOf(getActiveTab());
    let next = null;
    if (ev.key === 'ArrowRight') next = HOME_TABS[(idx + 1) % HOME_TABS.length];
    else if (ev.key === 'ArrowLeft') next = HOME_TABS[(idx - 1 + HOME_TABS.length) % HOME_TABS.length];
    else if (ev.key === 'Home') next = HOME_TABS[0];
    else if (ev.key === 'End') next = HOME_TABS[HOME_TABS.length - 1];
    if (next) {
      ev.preventDefault();
      selectTab(next, { focus: true });
      onChange?.(next);
    }
  });

  selectTab(getInitialTab(), { persist: false });
}
