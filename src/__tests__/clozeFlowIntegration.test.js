import { describe, it, expect, beforeEach, vi } from 'vitest';
import { passages } from '../data/passages.js';
import { vocabPassages } from '../data/vocabPassages.js';

function stubBrowserGlobals() {
  globalThis.speechSynthesis = globalThis.speechSynthesis || {
    getVoices: () => [],
    addEventListener: () => {},
    speak: () => {},
    cancel: () => {},
  };
  if (!globalThis.AudioContext) {
    globalThis.AudioContext = class { constructor() {} createOscillator() { return { connect() {}, start() {}, stop() {} }; } createGain() { return { connect() {}, gain: { value: 0 } }; } };
  }
}

describe('Cloze Castle integration flow', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    localStorage.clear();
    stubBrowserGlobals();
    vi.resetModules();
  });

  it('renders the level browser via showClozeBrowser', async () => {
    const { initClozeCastle, showClozeBrowser, cleanupClozeCastle } = await import('../modes/clozeCastle.js');
    const root = document.getElementById('root');
    initClozeCastle(root, () => {});
    showClozeBrowser();
    const buttons = root.querySelectorAll('.cloze-level-btn');
    expect(buttons.length).toBe(Object.keys(passages).length);
    cleanupClozeCastle();
  });

  it('shows the Practice/Exam mode toggle once a level is selected', async () => {
    const { initClozeCastle, showClozeBrowser, cleanupClozeCastle } = await import('../modes/clozeCastle.js');
    const root = document.getElementById('root');
    initClozeCastle(root, () => {});
    showClozeBrowser();
    root.querySelector('.cloze-level-btn[data-level="P1"]').click();
    expect(root.querySelector('#cloze-mode-practice')).not.toBeNull();
    expect(root.querySelector('#cloze-mode-exam')).not.toBeNull();
    expect(root.querySelector('#cloze-mode-practice').textContent).toContain('Practice Mode');
    expect(root.querySelector('#cloze-mode-exam').textContent).toContain('Exam Mode');
    cleanupClozeCastle();
  });

  it('renders the Read-First Scan with the passage text when a category is opened', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { initClozeCastle, showClozeBrowser, cleanupClozeCastle } = await import('../modes/clozeCastle.js');
    const root = document.getElementById('root');
    initClozeCastle(root, () => {});
    showClozeBrowser();
    root.querySelector('.cloze-level-btn[data-level="P1"]').click();
    const firstCat = root.querySelector('.cloze-cat-btn');
    expect(firstCat).not.toBeNull();
    firstCat.click();
    // Click through the rule card that now shows before the scan
    const ruleSkip = root.querySelector('#cloze-rule-skip');
    if (ruleSkip) ruleSkip.click();
    const ackButton = root.querySelector('#cloze-read-first');
    expect(ackButton).not.toBeNull();
    expect(ackButton.textContent).toContain('I have read the passage');
    const passageBlock = root.querySelector('.cloze-game-scan-passage-text');
    expect(passageBlock).not.toBeNull();
    expect(passageBlock.textContent.trim().length).toBeGreaterThan(0);
    Math.random.mockRestore();
    cleanupClozeCastle();
  });

  it('advances past Read-First Scan to either the scan task or the bank', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { initClozeCastle, showClozeBrowser, cleanupClozeCastle } = await import('../modes/clozeCastle.js');
    const root = document.getElementById('root');
    initClozeCastle(root, () => {});
    showClozeBrowser();
    root.querySelector('.cloze-level-btn[data-level="P1"]').click();
    root.querySelector('.cloze-cat-btn').click();
    const ruleSkip2 = root.querySelector('#cloze-rule-skip');
    if (ruleSkip2) ruleSkip2.click();
    root.querySelector('#cloze-read-first').click();

    const onScan = root.querySelector('.scan-attention-card');
    const onBank = root.querySelector('#cloze-bank');
    expect(onScan || onBank).not.toBeNull();

    if (onScan) {
      root.querySelector('#scan-attention-skip').click();
      expect(root.querySelector('#cloze-bank')).not.toBeNull();
    }
    Math.random.mockRestore();
    cleanupClozeCastle();
  });
});

describe('Word Vault integration flow', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
    localStorage.clear();
    stubBrowserGlobals();
    vi.resetModules();
  });

  it('renders the category browser via showVaultBrowser', async () => {
    const { initWordVault, showVaultBrowser, cleanupWordVault } = await import('../modes/wordVault.js');
    const root = document.getElementById('root');
    initWordVault(root, () => {});
    showVaultBrowser();
    expect(root.querySelectorAll('.wv-cat-btn').length).toBeGreaterThan(0);
    cleanupWordVault();
  });

  it('shows Practice/Exam toggle on the level browser of a category', async () => {
    const { initWordVault, showVaultBrowser, cleanupWordVault } = await import('../modes/wordVault.js');
    const root = document.getElementById('root');
    initWordVault(root, () => {});
    showVaultBrowser();
    const firstCat = [...root.querySelectorAll('.wv-cat-btn')].find((b) => {
      const key = b.dataset.cat;
      const levels = vocabPassages[key] || {};
      return Object.values(levels).some((arr) => (arr || []).length);
    });
    expect(firstCat).not.toBeNull();
    firstCat.click();
    expect(root.querySelector('#wv-mode-practice').textContent).toContain('Practice Mode');
    expect(root.querySelector('#wv-mode-exam').textContent).toContain('Exam Mode');
    cleanupWordVault();
  });

  it('renders the Read-First Vault Scan with the passage text when a level is opened', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const { initWordVault, showVaultBrowser, cleanupWordVault } = await import('../modes/wordVault.js');
    const root = document.getElementById('root');
    initWordVault(root, () => {});
    showVaultBrowser();
    const firstCat = [...root.querySelectorAll('.wv-cat-btn')].find((b) => {
      const key = b.dataset.cat;
      const levels = vocabPassages[key] || {};
      return Object.values(levels).some((arr) => (arr || []).length);
    });
    firstCat.click();
    const lvBtn = root.querySelector('.wv-level-btn:not([disabled])');
    expect(lvBtn).not.toBeNull();
    lvBtn.click();
    // Click through the rule card that now shows before the scan
    const wvRuleSkip = root.querySelector('#wv-rule-skip');
    if (wvRuleSkip) wvRuleSkip.click();
    expect(root.querySelector('#wv-read-first')).not.toBeNull();
    expect(root.querySelector('.wv-game-scan-passage-text')).not.toBeNull();
    Math.random.mockRestore();
    cleanupWordVault();
  });
});
