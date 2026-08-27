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

/** Debounce helper for slider inputs to avoid excessive localStorage writes */
function debounce(fn, ms = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

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
    document.querySelectorAll('.theme-swatch').forEach((swatch) => {
      swatch.addEventListener('click', () => {
        const theme = /** @type {HTMLElement} */ (swatch).dataset.theme;
        this.applyTheme(theme);
        store.set('theme', theme);
        document.querySelectorAll('.theme-swatch').forEach((s) => {
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

    // ── Voice speed (debounced to reduce localStorage writes) ─────────────
    const debouncedVoiceSpeed = debounce((val) => store.set('voiceSpeed', val));
    document.getElementById('voice-speed')?.addEventListener('input', (e) => {
      const val = parseFloat(/** @type {HTMLInputElement} */ (e.target).value);
      debouncedVoiceSpeed(val);
      const display = document.getElementById('voice-speed-display');
      if (display) display.textContent = `${val}×`;
    });

    // ── Stretched-speech toggle (phonemic-awareness modes) ─────────────────
    document.getElementById('stretched-speech-toggle')?.addEventListener('change', (e) => {
      store.set('stretchedSpeech', /** @type {HTMLInputElement} */ (e.target).checked);
    });

    const debouncedSensitivity = debounce((threshold) => store.set('speechThreshold', threshold));
    document.getElementById('speech-sensitivity')?.addEventListener('input', (e) => {
      const pct = parseInt(/** @type {HTMLInputElement} */ (e.target).value, 10);
      const threshold = Math.max(0.6, Math.min(0.95, pct / 100));
      debouncedSensitivity(threshold);
      const display = document.getElementById('speech-sensitivity-display');
      if (display) display.textContent = `${Math.round(threshold * 100)}%`;
    });

    document.getElementById('speech-accent-select')?.addEventListener('change', (e) => {
      const locale = /** @type {HTMLSelectElement} */ (e.target).value;
      store.set('speechLocale', locale);
    });

    // ── Difficulty buttons ──────────────────────────────────────────────────
    document.querySelectorAll('.diff-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const diff = parseInt(/** @type {HTMLElement} */ (btn).dataset.diff ?? '1');
        store.set('difficulty', diff);
        document.querySelectorAll('.diff-btn').forEach((b) => {
          const el = /** @type {HTMLElement} */ (b);
          const active = parseInt(el.dataset.diff ?? '0') === diff;
          el.classList.toggle('active', active);
          el.setAttribute('aria-pressed', String(active));
        });
      });
    });

    // ── Daily-goal slider (debounced) ──────────────────────────────────────
    const debouncedGoal = debounce((val) => store.set('dailyGoal', val));
    document.getElementById('goal-range')?.addEventListener('input', (e) => {
      const val = parseInt(/** @type {HTMLInputElement} */ (e.target).value);
      debouncedGoal(val);
      const display = document.getElementById('goal-range-display');
      if (display) display.textContent = String(val);
      const total = document.getElementById('goal-total');
      if (total) total.textContent = String(val);
    });

    // ── Reduced-motion toggle ──────────────────────────────────────────────
    document.getElementById('reduced-motion-toggle')?.addEventListener('change', (e) => {
      const checked = /** @type {HTMLInputElement} */ (e.target).checked;
      store.set('reducedMotion', checked);
      document.documentElement.classList.toggle('motion-reduced', checked);
    });

    const debouncedFontScale = debounce((val) => store.set('fontScale', val));
    document.getElementById('font-size-scale')?.addEventListener('input', (e) => {
      const val = parseInt(/** @type {HTMLInputElement} */ (e.target).value, 10);
      debouncedFontScale(val);
      const display = document.getElementById('font-size-scale-display');
      if (display) display.textContent = `${val}%`;
      document.documentElement.style.fontSize = `${val}%`;
    });

    document.getElementById('dyslexia-font-toggle')?.addEventListener('change', (e) => {
      const checked = /** @type {HTMLInputElement} */ (e.target).checked;
      store.set('dyslexiaFontEnabled', checked);
      if (checked) {
        this.applyTheme('dyslexia');
        store.set('theme', 'dyslexia');
      } else if (store.get('theme') === 'dyslexia') {
        this.applyTheme('default');
        store.set('theme', 'default');
      }
    });

    document.getElementById('high-contrast-toggle')?.addEventListener('change', (e) => {
      const checked = /** @type {HTMLInputElement} */ (e.target).checked;
      store.set('highContrastEnabled', checked);
      document.documentElement.setAttribute('data-high-contrast', checked ? 'true' : 'false');
      if (checked) {
        this.applyTheme('contrast');
        store.set('theme', 'contrast');
      }
    });

    document.getElementById('adult-observer-toggle')?.addEventListener('change', (e) => {
      store.set('adultObserverMode', /** @type {HTMLInputElement} */ (e.target).checked);
    });

    const debouncedChipScale = debounce((val) => store.set('bankChipScale', val));
    document.getElementById('bank-chip-scale')?.addEventListener('input', (e) => {
      const val = parseInt(/** @type {HTMLInputElement} */ (e.target).value, 10);
      debouncedChipScale(val);
      const display = document.getElementById('bank-chip-scale-display');
      if (display) display.textContent = `${val}%`;
      document.documentElement.style.setProperty('--bank-chip-scale', `${val / 100}`);
    });

    document.getElementById('bilingual-toggle')?.addEventListener('change', (e) => {
      const checked = /** @type {HTMLInputElement} */ (e.target).checked;
      store.set('bilingualInstructions', checked);
      document.documentElement.setAttribute('data-bilingual', checked ? 'true' : 'false');
    });

    // ── AI tutor: provider, key, model ─────────────────────────────────────
    document.getElementById('ai-provider-select')?.addEventListener('change', async (e) => {
      const { store: s } = await import('./store.js');
      s.set('aiProvider', /** @type {HTMLSelectElement} */ (e.target).value);
      await this._renderAiSettings();
    });

    document.getElementById('ai-model-select')?.addEventListener('change', async (e) => {
      const { activeProviderId, setModel } = await import('./aiConfig.js');
      setModel(activeProviderId(), /** @type {HTMLSelectElement} */ (e.target).value);
      await this._renderAiSettings();
    });

    document.getElementById('gemini-key-save')?.addEventListener('click', async () => {
      const { activeProviderId, setApiKey } = await import('./aiConfig.js');
      const { validateKeyShape } = await import('./aiProviders.js');
      const input = /** @type {HTMLInputElement|null} */ (
        document.getElementById('gemini-api-key')
      );
      const status = document.getElementById('gemini-key-status');
      const providerId = activeProviderId();
      const key = input?.value?.trim() || '';

      if (key) {
        // Catch a mistyped or wrong-provider key here rather than letting the
        // child hit a silent tutor an hour later.
        const shape = validateKeyShape(providerId, key);
        if (!shape.ok) {
          if (status) status.textContent = `⚠ ${shape.reason}`;
          return;
        }
      }
      setApiKey(providerId, key);
      if (status) status.textContent = key ? '✓ Key saved — try "Test the tutor"' : 'Key cleared';
      await this._renderAiSettings();
    });

    document.getElementById('ai-test-btn')?.addEventListener('click', async () => {
      const status = document.getElementById('gemini-key-status');
      const btn = /** @type {HTMLButtonElement|null} */ (document.getElementById('ai-test-btn'));
      if (status) status.textContent = 'Asking…';
      if (btn) btn.disabled = true;
      try {
        const { callAi } = await import('./aiService.js');
        const { lastError } = await import('./aiConfig.js');
        const reply = await callAi('Reply with exactly: Giri is ready.', { maxTokens: 32, temperature: 0 });
        if (status) {
          status.textContent = reply
            ? `✓ Working — Giri said: "${reply.trim().slice(0, 60)}"`
            : `⚠ ${lastError()?.message || 'No answer came back.'}`;
        }
      } finally {
        if (btn) btn.disabled = false;
        await this._renderAiSettings();
      }
    });

    document.getElementById('ai-spend-reset')?.addEventListener('click', async () => {
      const { resetSpend } = await import('./aiConfig.js');
      resetSpend();
      await this._renderAiSettings();
    });

    // ── Reset progress (lives in the PIN-gated Parent Dashboard) ────────────
    // Typed confirmation so a curious child can't wipe progress with one tap.
    document.getElementById('reset-progress-btn')?.addEventListener('click', () => {
      const typed = prompt(
        'This erases ALL progress, badges and XP for this player and cannot be undone.\n\nType RESET to confirm:',
      );
      if (typed != null && typed.trim().toUpperCase() === 'RESET') {
        store.reset();
        badges.reset();
        gamification.init();
        closeModal('modal-dashboard');
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

    const autoplay = /** @type {HTMLInputElement|null} */ (
      document.getElementById('autoplay-toggle')
    );
    if (autoplay) autoplay.checked = store.get('autoplay');

    const speed = /** @type {HTMLInputElement|null} */ (document.getElementById('voice-speed'));
    if (speed) speed.value = store.get('voiceSpeed');
    const speedDisplay = document.getElementById('voice-speed-display');
    if (speedDisplay) speedDisplay.textContent = `${store.get('voiceSpeed')}×`;

    const stretched = /** @type {HTMLInputElement|null} */ (
      document.getElementById('stretched-speech-toggle')
    );
    if (stretched) stretched.checked = !!store.get('stretchedSpeech');

    const speechThreshold = Number(store.get('speechThreshold') ?? 0.75);
    const sensitivity = /** @type {HTMLInputElement|null} */ (
      document.getElementById('speech-sensitivity')
    );
    if (sensitivity) sensitivity.value = String(Math.round(speechThreshold * 100));
    const sensitivityDisplay = document.getElementById('speech-sensitivity-display');
    if (sensitivityDisplay)
      sensitivityDisplay.textContent = `${Math.round(speechThreshold * 100)}%`;

    const speechAccent = /** @type {HTMLSelectElement|null} */ (
      document.getElementById('speech-accent-select')
    );
    if (speechAccent) speechAccent.value = store.get('speechLocale') || 'en-SG';

    const diff = store.get('difficulty') || 1;
    document.querySelectorAll('.diff-btn').forEach((b) => {
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
    document.documentElement.classList.toggle('motion-reduced', !!store.get('reducedMotion'));

    const fontScale = Number(store.get('fontScale') || 100);
    const fontScaleEl = /** @type {HTMLInputElement|null} */ (
      document.getElementById('font-size-scale')
    );
    if (fontScaleEl) fontScaleEl.value = String(fontScale);
    const fontScaleDisplay = document.getElementById('font-size-scale-display');
    if (fontScaleDisplay) fontScaleDisplay.textContent = `${fontScale}%`;
    document.documentElement.style.fontSize = `${fontScale}%`;

    const dyslexia = !!store.get('dyslexiaFontEnabled') || store.get('theme') === 'dyslexia';
    const dyslexiaToggle = /** @type {HTMLInputElement|null} */ (
      document.getElementById('dyslexia-font-toggle')
    );
    if (dyslexiaToggle) dyslexiaToggle.checked = dyslexia;

    const highContrast = !!store.get('highContrastEnabled') || store.get('theme') === 'contrast';
    const highContrastToggle = /** @type {HTMLInputElement|null} */ (
      document.getElementById('high-contrast-toggle')
    );
    if (highContrastToggle) highContrastToggle.checked = highContrast;
    document.documentElement.setAttribute('data-high-contrast', highContrast ? 'true' : 'false');

    const adultObserverToggle = /** @type {HTMLInputElement|null} */ (
      document.getElementById('adult-observer-toggle')
    );
    if (adultObserverToggle) adultObserverToggle.checked = !!store.get('adultObserverMode');

    const chipScale = Number(store.get('bankChipScale') || 100);
    const chipScaleEl = /** @type {HTMLInputElement|null} */ (
      document.getElementById('bank-chip-scale')
    );
    if (chipScaleEl) chipScaleEl.value = String(chipScale);
    const chipScaleDisplay = document.getElementById('bank-chip-scale-display');
    if (chipScaleDisplay) chipScaleDisplay.textContent = `${chipScale}%`;
    document.documentElement.style.setProperty('--bank-chip-scale', `${chipScale / 100}`);

    const bilingual = !!store.get('bilingualInstructions');
    const bilingualToggle = /** @type {HTMLInputElement|null} */ (
      document.getElementById('bilingual-toggle')
    );
    if (bilingualToggle) bilingualToggle.checked = bilingual;
    document.documentElement.setAttribute('data-bilingual', bilingual ? 'true' : 'false');

    this._renderAiSettings();
  },

  /**
   * Paint the AI tutor section from the stored config.
   *
   * Re-run after every change rather than mutating pieces: the provider
   * choice drives which controls even make sense (the on-device model has
   * no key and no model list), so a partial update would leave a key field
   * on screen for a provider that has no use for one.
   */
  async _renderAiSettings() {
    const [{ AI_PROVIDERS, PROVIDER_ORDER, getProvider }, aiConfig, { html }] = await Promise.all([
      import('./aiProviders.js'),
      import('./aiConfig.js'),
      import('../utils/html.js'),
    ]);
    const providerId = aiConfig.activeProviderId();
    const provider = getProvider(providerId);
    if (!provider) return;

    const $ = (id) => document.getElementById(id);

    const providerSelect = /** @type {HTMLSelectElement|null} */ ($('ai-provider-select'));
    if (providerSelect) {
      providerSelect.innerHTML = html`${PROVIDER_ORDER.map(
        id => html`<option value="${id}">${AI_PROVIDERS[id].label}</option>`,
      )}`;
      providerSelect.value = providerId;
    }

    const blurb = $('ai-provider-blurb');
    if (blurb) blurb.textContent = provider.blurb || '';

    // Key row: hidden entirely for a provider that needs no credential.
    const keyRow = $('ai-key-row');
    if (keyRow) keyRow.hidden = !provider.needsKey;
    const keyInput = /** @type {HTMLInputElement|null} */ ($('gemini-api-key'));
    if (keyInput) {
      keyInput.value = aiConfig.apiKeyFor(providerId);
      keyInput.placeholder = provider.keyHint
        ? `Paste your ${provider.label} key… (${provider.keyHint})`
        : 'Paste your API key…';
    }
    const keyHelp = $('ai-key-help');
    if (keyHelp) {
      keyHelp.innerHTML = provider.keyUrl
        ? html`Create one at <a href="${provider.keyUrl}" target="_blank" rel="noopener">${provider.keyUrl}</a>.`
        : '';
      keyHelp.hidden = !provider.needsKey;
    }

    const modelSelect = /** @type {HTMLSelectElement|null} */ ($('ai-model-select'));
    if (modelSelect) {
      modelSelect.innerHTML = html`${(provider.models || []).map(
        m => html`<option value="${m.id}">${m.label}</option>`,
      )}`;
      modelSelect.value = aiConfig.modelFor(providerId);
      modelSelect.disabled = (provider.models || []).length < 2;
    }

    const spendLine = $('ai-spend-line');
    if (spendLine) {
      const s = aiConfig.spendSummary();
      const err = aiConfig.lastError();
      if (err && err.code !== 'no-key') {
        // A parent looking at this screen is usually here BECAUSE the tutor
        // went quiet. Lead with the reason, not the running total.
        spendLine.textContent = `⚠ Last attempt failed: ${err.message}`;
      } else if (!s.calls) {
        spendLine.textContent = provider.free
          ? 'Runs on this device — nothing to pay.'
          : 'No AI calls yet.';
      } else if (provider.free) {
        spendLine.textContent = `${s.calls} tutor answers so far, all on this device — nothing to pay.`;
      } else {
        spendLine.textContent = s.priced
          ? `${s.calls} tutor answers so far — roughly $${s.estimatedUsd.toFixed(3)} on your ${provider.label} account. Your provider's dashboard is the real figure.`
          : `${s.calls} tutor answers so far (${s.inputTokens + s.outputTokens} tokens). No price on file for this model — check your provider's dashboard.`;
      }
    }
  },

  /**
   * Apply a named theme by setting `data-theme` on `<html>`.
   * @param {string} theme
   */
  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  },
};
