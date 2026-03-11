/**
 * PhonicsQuest – Settings Controller
 *
 * Handles all settings-panel UI bindings and initial value application.
 * Extracted from app.js to reduce its size and make settings logic testable
 * in isolation.
 *
 * USAGE:
 *   import { settingsController } from './modules/settingsController.js';
 *
 *   // Bind interactive elements (call once after DOM is ready).
 *   settingsController.bind({
 *     store,
 *     badges,
 *     gamification,
 *     onReset : () => { … },   // called after a confirmed reset
 *     closeModal: (id) => { … },
 *   });
 *
 *   // Sync UI to persisted values (call once after bind).
 *   settingsController.apply(store);
 *
 *   // Apply a named theme to <html data-theme="…">.
 *   settingsController.applyTheme('ocean');
 */

export const settingsController = {
  /**
   * Wire up all interactive settings controls.
   *
   * @param {object} deps
   * @param {import('./store.js').Store}           deps.store
   * @param {import('./badges.js').Badges}         deps.badges
   * @param {import('./gamification.js').Gamification} deps.gamification
   * @param {() => void}                           deps.onReset     - Callback after reset.
   * @param {(id: string) => void}                 deps.closeModal  - Close a modal by ID.
   */
  bind({ store, badges, gamification, onReset, closeModal }) {
    // ── Theme swatches ─────────────────────────────────────────────────────
    document.querySelectorAll('.theme-swatch').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const theme = /** @type {HTMLElement} */ (swatch).dataset.theme;
        this.applyTheme(theme);
        store.set('theme', theme);
        document.querySelectorAll('.theme-swatch').forEach(s => {
          const el = /** @type {HTMLElement} */ (s);
          const active = el.dataset.theme === theme;
          el.classList.toggle('active', active);
          el.setAttribute('aria-pressed', String(active));
        });
      });
    });

    // ── SFX toggle ─────────────────────────────────────────────────────────
    document.getElementById('sfx-toggle')?.addEventListener('change', (e) => {
      store.set('sfxEnabled', /** @type {HTMLInputElement} */ (e.target).checked);
    });

    // ── Autoplay toggle ────────────────────────────────────────────────────
    document.getElementById('autoplay-toggle')?.addEventListener('change', (e) => {
      store.set('autoplay', /** @type {HTMLInputElement} */ (e.target).checked);
    });

    // ── Voice speed ────────────────────────────────────────────────────────
    document.getElementById('voice-speed')?.addEventListener('input', (e) => {
      const val = parseFloat(/** @type {HTMLInputElement} */ (e.target).value);
      store.set('voiceSpeed', val);
      const display = document.getElementById('voice-speed-display');
      if (display) display.textContent = `${val}×`;
    });

    // ── Difficulty buttons ──────────────────────────────────────────────────
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const diff = parseInt(/** @type {HTMLElement} */ (btn).dataset.diff ?? '1');
        store.set('difficulty', diff);
        document.querySelectorAll('.diff-btn').forEach(b => {
          const el = /** @type {HTMLElement} */ (b);
          const active = parseInt(el.dataset.diff ?? '0') === diff;
          el.classList.toggle('active', active);
          el.setAttribute('aria-pressed', String(active));
        });
      });
    });

    // ── Daily-goal slider ──────────────────────────────────────────────────
    document.getElementById('goal-range')?.addEventListener('input', (e) => {
      const val = parseInt(/** @type {HTMLInputElement} */ (e.target).value);
      store.set('dailyGoal', val);
      const display = document.getElementById('goal-range-display');
      if (display) display.textContent = String(val);
      const total = document.getElementById('goal-total');
      if (total) total.textContent = String(val);
    });

    // ── Reduced-motion toggle ──────────────────────────────────────────────
    document.getElementById('reduced-motion-toggle')?.addEventListener('change', (e) => {
      const checked = /** @type {HTMLInputElement} */ (e.target).checked;
      store.set('reducedMotion', checked);
      document.documentElement.setAttribute('data-reduced-motion', checked ? 'true' : 'false');
    });

    document.getElementById('font-size-scale')?.addEventListener('input', (e) => {
      const val = parseInt(/** @type {HTMLInputElement} */ (e.target).value, 10);
      store.set('fontScale', val);
      const display = document.getElementById('font-size-scale-display');
      if (display) display.textContent = `${val}%`;
      document.documentElement.style.fontSize = `${val}%`;
    });

    document.getElementById('bilingual-toggle')?.addEventListener('change', (e) => {
      const checked = /** @type {HTMLInputElement} */ (e.target).checked;
      store.set('bilingualInstructions', checked);
      document.documentElement.setAttribute('data-bilingual', checked ? 'true' : 'false');
    });

    // ── Reset progress ─────────────────────────────────────────────────────
    document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
      if (confirm('This will erase all progress. Are you sure?')) {
        store.reset();
        badges.reset();
        gamification.init();
        closeModal('modal-settings');
        onReset();
      }
    });
  },

  /**
   * Sync all settings UI controls to the values persisted in the store.
   * Call once on startup (after `bind()`).
   *
   * @param {import('./store.js').Store} store
   */
  apply(store) {
    const sfx = /** @type {HTMLInputElement|null} */ (document.getElementById('sfx-toggle'));
    if (sfx) sfx.checked = store.get('sfxEnabled');

    const autoplay = /** @type {HTMLInputElement|null} */ (document.getElementById('autoplay-toggle'));
    if (autoplay) autoplay.checked = store.get('autoplay');

    const speed = /** @type {HTMLInputElement|null} */ (document.getElementById('voice-speed'));
    if (speed) speed.value = store.get('voiceSpeed');
    const speedDisplay = document.getElementById('voice-speed-display');
    if (speedDisplay) speedDisplay.textContent = `${store.get('voiceSpeed')}×`;

    const diff = store.get('difficulty') || 1;
    document.querySelectorAll('.diff-btn').forEach(b => {
      const el = /** @type {HTMLElement} */ (b);
      const active = parseInt(el.dataset.diff ?? '0') === diff;
      el.classList.toggle('active', active);
      el.setAttribute('aria-pressed', String(active));
    });

    const goal = store.get('dailyGoal') || 10;
    const goalRange = /** @type {HTMLInputElement|null} */ (document.getElementById('goal-range'));
    if (goalRange) goalRange.value = String(goal);
    const goalDisplay = document.getElementById('goal-range-display');
    if (goalDisplay) goalDisplay.textContent = String(goal);

    const reducedMotion = /** @type {HTMLInputElement|null} */ (
      document.getElementById('reduced-motion-toggle')
    );
    if (reducedMotion) reducedMotion.checked = store.get('reducedMotion') ?? false;
    document.documentElement.setAttribute(
      'data-reduced-motion',
      store.get('reducedMotion') ? 'true' : 'false',
    );

    const fontScale = Number(store.get('fontScale') || 100);
    const fontScaleEl = /** @type {HTMLInputElement|null} */ (document.getElementById('font-size-scale'));
    if (fontScaleEl) fontScaleEl.value = String(fontScale);
    const fontScaleDisplay = document.getElementById('font-size-scale-display');
    if (fontScaleDisplay) fontScaleDisplay.textContent = `${fontScale}%`;
    document.documentElement.style.fontSize = `${fontScale}%`;

    const bilingual = !!store.get('bilingualInstructions');
    const bilingualToggle = /** @type {HTMLInputElement|null} */ (document.getElementById('bilingual-toggle'));
    if (bilingualToggle) bilingualToggle.checked = bilingual;
    document.documentElement.setAttribute('data-bilingual', bilingual ? 'true' : 'false');
  },

  /**
   * Apply a named theme by setting `data-theme` on `<html>`.
   * @param {string} theme
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  },
};
